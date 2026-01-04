// ==UserScript==
// @name         ピクトセンス - 自動描画[EXT]
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  自動でキャンバスに画像を描画します。
// @author       You
// @match        https://pictsense.com/*
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419945-global-managedextensions/code/Global_ManagedExtensions.js?version=889360
// @require      https://greasyfork.org/scripts/419888-antimatterx/code/antimatterx.js?version=889299
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/419958/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%20-%20%E8%87%AA%E5%8B%95%E6%8F%8F%E7%94%BB%5BEXT%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/419958/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%20-%20%E8%87%AA%E5%8B%95%E6%8F%8F%E7%94%BB%5BEXT%5D.meta.js
// ==/UserScript==

(function(unsafeWindow) {
    'use strict';
    const $ = window.$,
        amx = window.antimatterx;
    let input_colors, input_resolution, monochrome_flag, input_time, loop_max, paintLast_flag, Message, input_file, g_stop_btn_holder, run_flag, g_stop_flag;

    function setConfig() {
        const h = $("<div>"),
            message_holder = $("<div>").appendTo(h);
        Message = function(s) {
            message_holder.text(s);
        };
        g_stop_btn_holder = $("<div>").appendTo(h);
        input_colors = $(amx.addInputRange(h[0], {
            title: "クオリティ",
            width: "40%",
            min: 2,
            max: 256,
            save: "input_colors"
        }));
        input_resolution = $(amx.addInputRange(h[0], {
            title: "解像度",
            width: "40%",
            min: 10,
            max: 550,
            save: "input_resolution"
        }));
        monochrome_flag = $(amx.addInputBool(h[0], {
            title: "モノクロ"
        }));
        reset_input_file();
        amx.addButton(h[0], {
            title: "画像を読み込む",
            click: function() {
                if (run_flag) Message("自動描画中なので読み込めません。");
                else input_file.click();
            }
        });
        paintLast_flag = $(amx.addInputBool(h[0], {
            title: "後ろから塗る"
        }));
        input_time = $(amx.addInputNumber(h[0], {
            title: "描画間隔",
            placeholder: "[秒]",
            value: 1,
            save: "input_time",
            max: 5,
            min: 0
        })).val(1);
        loop_max = $(amx.addInputNumber(h[0], {
            title: "ループ最大数",
            width: "5em",
            value: 3777,
            save: "loop_max",
            max: 3777,
            min: 0
        })).val(3777);
        h.children().each(function(i, e) {
            $(e).after("<br>");
        });
        return h;
    };
    unsafeWindow.Global_ManagedExtensions["自動描画"] = {
        config: setConfig,
        tag: "ピクトセンス"
    };
    const CV_ELM = $("#previewCanvas"); // canvas要素
    let g_W, g_H, // 画像の幅と高さ
        g_pixelClass_Array, // クラスの入れ物
        g_ADD_X, g_ADD_Y,
        g_cv_click_flag = false;

    function reset() {
        run_flag = false;
        reset_input_file();
        g_cv_click_flag = false;
        g_stop_btn_holder.empty();
    };

    function mouse_event(evt_name, x, y, jq) {
        const evt = document.createEvent("MouseEvent");
        evt.initMouseEvent(
            evt_name, // type 設定可能なタイプは click, mosuedown, mouseup, mouseover, mousemove, mouseout
            true, // canBubble bubbleを許可するかどうか
            true, // cancelable 途中で処理を止められるかどうか
            unsafeWindow, // view 処理させるウィンドウのオブジェクト
            1, // detail マウスクリックの回数
            0, // screenX
            0, // screenY
            x - $(window).scrollLeft(), // clientX
            y - $(window).scrollTop(), // clientY
            false, // ctrlKey イベント中にCtrlキーを押した状態にするかどうか
            false, // altKey イベント中にAltキーを押した状態にするかどうか
            false, // shiftKey イベント中にShiftキーを押した状態にするかどうか
            false, // metaKey イベント中にMetaキーを押した状態にするかどうか
            0, // button 0を設定すると左クリック、1で中クリック、2で右クリック
            unsafeWindow // relatedTarget 関連するイベントの設定。MouseOverとMouseOutの時だけ使用するのでそれ以外はnull
        );
        jq.get(0).dispatchEvent(evt);
    };

    function setRGBA(_RGBA) {
        let RGB = "";
        for (let i = 0; i < 3; i++) RGB += ("00" + Number(_RGBA[i]).toString(16)).slice(-2);
        const btn_elm = $("#colorPalette").find("button").eq(0);
        btn_elm.attr("data-color", RGB);
        btn_elm[0].style.backgroundColor = "#" + RGB;
        mouse_event("mousedown", btn_elm.offset().left, btn_elm.offset().top, btn_elm);
        const A = _RGBA[3],
            sld_elm = $("#opacitySlider"),
            Convers = (A / 256) * sld_elm.width();
        mouse_event("mousedown", sld_elm.offset().left + Convers, sld_elm.offset().top, sld_elm);
        mouse_event("mouseup", 0, 0, sld_elm);
        const size_elm = $("#sizeButtonHolder").find("button").eq(0);
        mouse_event("mousedown", size_elm.offset().left, size_elm.offset().top, size_elm);
        mouse_event("mouseup", 0, 0, size_elm);
    };
    class pixelClass {
        constructor(_x, _y, _RGBA) {
            const ar = [];
            const divide = 256 / input_colors.val();
            for (let i = 0; i < 4; i++) ar.push(Math.floor(Math.ceil(_RGBA[i] / divide) * divide));
            this._RGBA = ar.join("_");
            this._flag = ar[0] === 255 && ar[1] === 255 && ar[2] === 255 || ar[3] === 0 ? true : false;
            this.m_y = {
                "isFirst": _y == 0 ? true : false,
                "isEnd": _y == g_H - 1 ? true : false
            };
            this.m_x = {
                "isFirst": _x == 0 ? true : false,
                "isEnd": _x == g_W - 1 ? true : false
            };
        };
        get getRGBA() {
            return this._RGBA;
        };
        get _getFlag() {
            return this._flag;
        };
        setFlag() {
            this._flag = true;
        };
        judge(_RGBA) {
            if (this._getFlag) return false;
            if (this.getRGBA != _RGBA) return false;
            return true;
        };
        static make(_ImageData) {
            const H = _ImageData.height;
            const W = _ImageData.width;
            const array = [];
            for (let y = 0; y < H; y++) {
                array.push([]);
                for (let x = 0; x < W; x++) {
                    const index = (x + y * W) * 4;
                    const R = _ImageData.data[index];
                    const G = _ImageData.data[index + 1];
                    const B = _ImageData.data[index + 2];
                    const A = _ImageData.data[index + 3];
                    array[y].push(new pixelClass(x, y, [R, G, B, A]));
                };
            };
            return array;
        };
        static search_false(_pixelObjArray) {
            if (paintLast_flag.find("input[type='checkbox']").prop("checked")) {
                for (let y = g_H - 1; y >= 0; y--) {
                    for (let x = g_W - 1; x >= 0; x--) {
                        if (_pixelObjArray[y][x]._getFlag == false) return [x, y];
                    };
                };
            } else {
                for (let y = 0; y < g_H; y++) {
                    for (let x = 0; x < g_W; x++) {
                        if (_pixelObjArray[y][x]._getFlag == false) return [x, y];
                    };
                };
            };
            return null;
        };
    };

    function resize(w1, h1) {
        const W_MAX = CV_ELM.width(),
            H_MAX = CV_ELM.height();
        if (w1 <= W_MAX && h1 <= H_MAX) return [w1, h1];
        let w2, h2;
        if (w1 > h1) {
            const ratio = h1 / w1;
            w2 = W_MAX;
            h2 = Math.floor(W_MAX * ratio);
        } else {
            const ratio = w1 / h1;
            h2 = H_MAX;
            w2 = Math.floor(H_MAX * ratio);
        };
        console.log(w2 + " " + h2);
        return [w2, h2];
    };
    const reader = new FileReader();
    reader.addEventListener("load", function() {
        const img = new Image();
        img.src = reader.result;
        img.addEventListener("load", function() {
            Message("読み込み完了");
            const result = resize(img.width, img.height);
            g_W = result[0];
            g_H = result[1];
            const cv = document.createElement("canvas");
            cv.width = g_W;
            cv.height = g_H;
            const ct = cv.getContext("2d");
            ct.drawImage(img, 0, 0, img.width, img.height, 0, 0, g_W, g_H);
            g_pixelClass_Array = pixelClass.make(ct.getImageData(0, 0, cv.width, cv.height));
            alert('画像が読み込み終わりました\n出力する位置をクリックしてください');
            Message('キャンバスのどこかをクリック');
            g_cv_click_flag = true;
        });
    });

    const Auto_Draw = (_Start_x, _Start_y) => {
        const move_log = [];
        move_log.push([_Start_x, _Start_y]);
        const nowRGBA = g_pixelClass_Array[_Start_y][_Start_x].getRGBA;
        setRGBA(nowRGBA.split("_"));
        mouse_event("mousedown", _Start_x + g_ADD_X, _Start_y + g_ADD_Y, CV_ELM);
        let n_x = _Start_x,
            n_y = _Start_y,
            way_log = null,
            break_counter = 0;
        while (1) {
            break_counter++;
            if (loop_max.val() < break_counter) {
                mouse_event("mouseup", 0, 0, CV_ELM); // 中断
                break;
            };
            if (g_stop_flag) return mouse_event("mouseup", 0, 0, CV_ELM);
            const now = g_pixelClass_Array[n_y][n_x];
            now.setFlag();
            const ar = [];
            if (!now.m_y.isFirst) ar.push("up", n_x, n_y - 1);
            if (!now.m_x.isFirst) ar.push("left", n_x - 1, n_y);
            if (!now.m_y.isFirst && !now.m_x.isFirst) ar.push("up_left", n_x - 1, n_y - 1);
            if (!now.m_y.isEnd) ar.push("under", n_x, n_y + 1);
            if (!now.m_x.isEnd) ar.push("right", n_x + 1, n_y);
            if (!now.m_y.isEnd && !now.m_x.isEnd) ar.push("under_right", n_x + 1, n_y + 1);
            if (!now.m_y.isFirst && !now.m_x.isEnd) ar.push("up_right", n_x + 1, n_y - 1);
            if (!now.m_y.isEnd && !now.m_x.isFirst) ar.push("under_left", n_x - 1, n_y + 1);
            const ar2 = [];
            for (let i = 0; i < (ar.length) / 3; i++) {
                if (g_pixelClass_Array[ar[3 * i + 2]][ar[3 * i + 1]].judge(nowRGBA)) ar2.push(ar[3 * i], ar[3 * i + 1], ar[3 * i + 2]);
            }
            if (!ar2.length) {
                if (!move_log.length) {
                    mouse_event("mouseup", 0, 0, CV_ELM); // 探索終了
                    break;
                }
                const move_log_end = move_log.pop();
                n_x = move_log_end[0];
                n_y = move_log_end[1];
                way_log = null;
                mouse_event("mousemove", n_x + g_ADD_X, n_y + g_ADD_Y, CV_ELM);
                continue;
            }
            let next = ar2.indexOf(way_log);
            if (next === -1) next = 0;
            if (1 < ar2.length) move_log.push([n_x, n_y]);
            way_log = ar2[next];
            n_x = ar2[next + 1];
            n_y = ar2[next + 2];
            mouse_event("mousemove", n_x + g_ADD_X, n_y + g_ADD_Y, CV_ELM);
        };
        const result = pixelClass.search_false(g_pixelClass_Array);
        if (result) {
            n_x = result[0];
            n_y = result[1];
            const SIZE = g_W * g_H;
            let now_position = g_W * n_y + n_x;
            if (paintLast_flag.find("input[type='checkbox']").prop("checked")) now_position = SIZE - now_position;
            Message("自動描画中…(" + Math.floor(((now_position / SIZE) * 100) * 1000) / 1000 + "%)");
            setTimeout(function() {
                Auto_Draw(n_x, n_y);
            }, 1000 * input_time.val());
        } else {
            Message("★描画完了(" + new Date().toString().match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)[0] + ")");
            reset();
            return;
        };
    };

    function reset_input_file() {
        input_file = $("<input>", {
            type: "file"
        }).change(function(e) {
            if (!e.target.files[0]) return;
            Message("画像を読み込み中");
            reader.readAsDataURL(e.target.files[0]);
        });
    };

    function add_stop_button() {
        $(amx.addButton(g_stop_btn_holder[0], {
            title: "緊急停止",
            click: function() {
                g_stop_flag = true;
                Message("緊急停止しました");
                reset();
            }
        })).css("color", "red");
    };
    CV_ELM[0].addEventListener("click", function(e) {
        if (g_cv_click_flag === false) return;
        g_ADD_X = e.clientX;
        g_ADD_Y = e.clientY;
        alert("自動描画を始めます");
        run_flag = true;
        add_stop_button();
        g_stop_flag = false;
        if (paintLast_flag.find("input[type='checkbox']").prop("checked")) Auto_Draw(g_W - 1, g_H - 1);
        else Auto_Draw(0, 0);
        g_cv_click_flag = false;
    }, false);
})(this.unsafeWindow || window);