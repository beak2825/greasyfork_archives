// ==UserScript==
// @name         壁紙変更(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  Feederチャットの背景画像を変更するスクリプトです。
// @author       You
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @require      https://greasyfork.org/scripts/396472-yaju1919/code/yaju1919.js?version=802405
// @require      https://greasyfork.org/scripts/387509-yaju1919-library/code/yaju1919_library.js?version=755144
// @require      https://greasyfork.org/scripts/388005-managed-extensions/code/Managed_Extensions.js?version=720959
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/386713/%E5%A3%81%E7%B4%99%E5%A4%89%E6%9B%B4%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386713/%E5%A3%81%E7%B4%99%E5%A4%89%E6%9B%B4%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==

(function(unsafeWindow) {
    'use strict';
    unsafeWindow.Managed_Extensions["壁紙変更"] = {
        config: (function() {
            var $ = unsafeWindow.$;
            var yaju1919 = window.yaju1919;
            var old_yaju1919 = yaju1919_library;
            var backgroundColor_copy = $("#wrapper").css("background-color"); // デフォルトの背景色をコピー
            var intervalId, filterElement; // intervalIdはsetIntervalのidを格納する変数、filterElementはフィルタの要素を格納する変数
            var h = $("<div>");
            //////////////////////////////////////////////////
            var inputChangeBool = yaju1919.addInputBool(h, { // 壁紙変更
                title: "壁紙変更",
                value: false,
                change: (function() {
                    main();
                })
            });
            h.append("<hr>");
            var inputImageUrls = yaju1919.addInputText(h, { // 画像URL
                save: "inputImageUrls",
                title: "画像URL",
                placeholder: "背景画像のURLを改行で区切って入力",
                width: "90%",
                textarea: true,
                change: (function() {
                    setTimeout((function() {
                        h.find("textarea").val([...new Set(inputImageUrls().split("\n").filter((function(v) {
                            return v.match(/^(https?|data):\/\/.+$/);
                        })))].join("\n"));
                        main();
                    }));
                })
            });
            var inputInterval_text = $("<div>").text("変更間隔: 5秒").appendTo(h);
            var inputInterval = old_yaju1919.appendInputRange(h, { // 変更間隔
                save: "inputInterval",
                width: "90%",
                value: 5,
                min: 5,
                max: 300,
                step: 1,
                change: (function() {
                    loadValue();
                    main("keep");
                })
            });
            // フィルタ関係の入力要素
            h.append("<br>フィルタの色: ");
            var inputColor = $("<input>", { // フィルタの色
                type: "color",
                value: "#000000"
            }).change(function() {
                yaju1919.save("inputColor", inputColor.val());
            }).appendTo(h);
            var inputOpacity_text = $("<div>").text("フィルタの不透明度: 0%").appendTo(h);
            var inputOpacity = old_yaju1919.appendInputRange(h, { // フィルタの不透明度
                save: "inputOpacity",
                width: "90%",
                value: 0,
                min: 0,
                max: 100,
                step: 1,
                change: (function() {
                    loadValue();
                    main("keep");
                })
            });
            //-----------------------
            h.append("<hr>");
            // 画像の加工関係の入力要素
            var inputBlur_text = $("<div>").text("ぼかしの強度: 0%").appendTo(h);
            var inputBlur = old_yaju1919.appendInputRange(h, { // ぼかしの強度
                save: "inputBlur",
                width: "90%",
                value: 0,
                min: 0,
                max: 100,
                step: 1,
                change: (function() {
                    loadValue();
                    main("keep");
                })
            });
            var inputBrightness_text = $("<div>").text("明度: 100%").appendTo(h);
            var inputBrightness = old_yaju1919.appendInputRange(h, { // 明度
                save: "inputBrightness",
                width: "90%",
                value: 100,
                min: 0,
                max: 200,
                step: 1,
                change: (function() {
                    loadValue();
                    main("keep");
                })
            });
            var inputSaturate_text = $("<div>").text("彩度: 100%").appendTo(h);
            var inputSaturate = old_yaju1919.appendInputRange(h, { // 彩度
                save: "inputSaturate",
                width: "90%",
                value: 100,
                min: 0,
                max: 200,
                step: 1,
                change: (function() {
                    loadValue();
                    main("keep");
                })
            });
            var inputSepia_text = $("<div>").text("セピア: 0%").appendTo(h);
            var inputSepia = old_yaju1919.appendInputRange(h, { // セピア
                save: "inputSepia",
                width: "90%",
                value: 0,
                min: 0,
                max: 100,
                step: 1,
                change: (function() {
                    loadValue();
                    main("keep");
                })
            });
            addBtn(h, "初期値", (function() { // 初期値
                if (!confirm("初期値に戻しますか?")) return;
                var ranges = $("input[type='range']");
                ranges.eq(2).val(0);
                ranges.eq(3).val(100);
                ranges.eq(4).val(100);
                ranges.eq(5).val(0);
                loadValue();
                main("keep");
            }));
            //-------------------------
            //////////////////////////////////////////////////
            setTimeout(loadValue); // setTimeoutで遅延して値を読み込む
            //////////////////////////////////////////////////
            // 汎用的な関数
            function timeConv(second) { // 秒数から分秒に変換する関数
                var min = Math.floor(second / 60);
                var sec = second % 60;
                var timeText = sec + "秒";
                if (min > 0) timeText = min + "分" + timeText;
                return timeText;
            };

            function addBtn(h, title, func) { // ボタンを追加する関数
                return $("<button>").text(title).click(func).appendTo(h);
            };
            //-------------
            // 処理的な関数
            function loadValue() { // 値を読み込む関数
                inputInterval_text.text("変更間隔: " + timeConv(inputInterval()));
                inputOpacity_text.text("フィルタの不透明度: " + inputOpacity() + "%");
                inputBlur_text.text("ぼかしの強度: " + inputBlur() + "%");
                inputBrightness_text.text("明度: " + inputBrightness() + "%");
                inputSaturate_text.text("彩度: " + inputSaturate() + "%");
                inputSepia_text.text("セピア: " + inputSepia() + "%");
                yaju1919.load("inputColor", (function(r) {
                    inputColor.val(r);
                }));
            };

            function setImage(data) { // 壁紙を設定する関数
                var imageIdx = inputImageUrls().split("\n").indexOf($("body").css("background-image").match(/^url\("((https?|data):\/\/.+)"\)$/)[1]);
                if (data === "keep") {
                    yaju1919.load("imageIdx", (function(r) {
                        imageIdx = r;
                    }));
                } else {
                    if (!inputImageUrls().split("\n")[imageIdx + 1]) imageIdx = 0;
                    else imageIdx++;
                    yaju1919.save("imageIdx", imageIdx);
                };
                $("#wrapper").css("background-color", "transparent");
                setTimeout((function() {
                    yaju1919.setBgImg(inputImageUrls().split("\n")[imageIdx], {
                        color: inputColor.val(),
                        opacity: inputOpacity() / 100
                    });
                }));
            };

            function removeImage() { // 壁紙を削除する関数
                if (filterElement) filterElement.remove();
                $("#wrapper").css("background-color", backgroundColor_copy);
                $("body").removeAttr("style");
                yaju1919.setBgImg(null, {
                    opacity: 0
                });
            };

            function setFilter() { // フィルタを設定する関数
                return $("<div>").css({
                    zIndex: "-114515",
                    background: "inherit",
                    filter: "blur(" + inputBlur() / 10 + "px) brightness(" + inputBrightness() + "%) saturate(" + inputSaturate() + "%) sepia(" + inputSepia() + "%)",
                    position: "fixed",
                    top: "0px",
                    left: "0px",
                    right: "0px",
                    bottom: "0px"
                }).appendTo("body");
            };

            function main(data) { // 設定用関数
                setTimeout((function() {
                    removeImage();
                    clearInterval(intervalId);
                    if (!inputChangeBool() || inputImageUrls() === "") return;
                    setImage(data);
                    filterElement = setFilter();
                    if (inputImageUrls().split("\n").length === 1) return;
                    intervalId = setInterval((function() {
                        setImage();
                    }), inputInterval() * 1000);
                }));
            };
            //-------------
            //////////////////////////////////////////////////
            return h;
        }),
        tag: "装飾"
    };
})(this.unsafeWindow || window);