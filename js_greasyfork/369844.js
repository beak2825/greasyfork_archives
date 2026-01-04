// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      0.1.180626
// @description  基于 translate.google.cn 的划词翻译，用鼠标选中纯英文内容即可。每次翻译的结果自动复制到剪贴板，用户可直接粘贴使用。
// @author       laohoo
// @match        http://*/*
// @match        https://*/*
// @exclude      http*://*.baidu.com/*
// @connect      translate.google.cn
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/369844/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/369844/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';// @require      https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.js
    function parseText(text) {
        let doc = null;
        try {
            doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = text;
            return doc;
        }
        catch (e) {
            //  alert("parse error");
        }
    }

    // a:你要翻译的内容
    // uq:tkk的值
    function vq(a, uq = tkk) {
        if (null !== uq) {
            var b = uq;
        } else {
            b = sq('T');
            var c = sq('K');
            b = [b(), c()];
            b = (uq = window[b.join(c())] || "") || ""
        }
        var d = sq('t');
        c = sq('k');
        d = [d(), c()];
        c = "&" + d.join("") + "=";
        d = b.split(".");
        b = Number(d[0]) || 0;
        for (var e = [], f = 0, g = 0; g < a.length; g++) {
            var l = a.charCodeAt(g);
            128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 :
                (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ?
                    (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
                e[f++] = l >> 18 | 240,
                e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
                e[f++] = l >> 6 & 63 | 128),
                e[f++] = l & 63 | 128)
        }
        a = b;
        for (f = 0; f < e.length; f++)
            a += e[f],
                a = tq(a, "+-a^+6");
        a = tq(a, "+-3^+b+-f");
        a ^= Number(d[1]) || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1000000;
        return c + (a.toString() + "." + (a ^ b))
    };

    /*--------------------------------------------------------------------------------
参数：a 为你要翻译的原文
其他外部函数：
--------------------------------------------------------------------------------*/
    function sq(a) {
        return function () {
            return a
        }
    }

    function tq(a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2);
            d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
            d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
            a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
        }
        return a
    }


    var gturl = "http://translate.google.cn/";
    var tkk = null;
    var tk = null;
    GM.xmlHttpRequest({
        method: "GET",
        url: gturl,
        onload: function (response) {
            let magHtml = parseText(response.responseText);
            var sc = magHtml.body.querySelector("#gt-c > script:nth-child(2)");
            var ftstr = sc.innerText.match(/'\(\(function\(\){var(.*?)x27\+\(a\+b\)}\)\(\)\)'/g)[0];
            var result = eval(ftstr);
            console.log(result);
            var nums = result.match(/-?\d+/g);  //取出字符串中的所有数字部分
            console.log(nums);
            tkk = nums[2] + "." + (parseInt(nums[0]) + parseInt(nums[1]));
            console.log(tkk);
        },
    });

    var endx = 0, endy = 0, startx = 0, starty = 0;
    var selectedText;
    document.addEventListener("mousedown", function (event) {
        if (event.button == 0) {
            startx = event.clientX;
            starty = event.clientY;
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
            var ctips = document.getElementById("ctips");
            if (ctips) {
                document.body.removeChild(ctips);
            }
            selectedText = "";

        }
        console.log("Mouse Left or Right", event.button);
    });

    console.log("Translate begin...");
    document.addEventListener("mouseup", function (event) {
        if (event.button == 0) {
            selectedText = null;
            var endx = event.clientX, endy = event.clientY;
            var widthSelected = event.target.clientWidth;
            console.log("widthSelected: ", widthSelected);
            console.log(`x,y: ${startx},${starty}: ${endx},${endy} `);
            var x = startx > endx ? endx : startx;
            var y = starty > endy ? starty : endy;

            y += document.documentElement.scrollTop || document.body.scrollTop;
            console.log(`xy: ${x},${y}`);
            var start = 0, end = 0;
            if (window.getSelection) {
                selectedText = document.getSelection().toString();
                start = window.getSelection().anchorOffset;
                end = window.getSelection().focusOffset;
            } else if (document.selection) {
                selectedText = document.selection.createRange().text;
            }

            console.log(start, end);

            console.log("English: ", (/[\x00-\xff]+$/g.test(selectedText)));


            if (selectedText.trim()) {
                if ((/[\x00-\xff]+$/g.test(selectedText))) {
                    // if(/[\x00-\xff]+/g.test(selectedText)){}
                    console.log(selectedText);
                    // 匹配所有回车符
                    var reg = new RegExp("\r", "g");
                    // 将匹配的内容替换为 ". "
                    //selectedText =selectedText.replace(/.?(\r\n\f\t\v)+/g,". ");
                    selectedText = selectedText.replace(reg, "");
                    //selectedText = encodeURIComponent(selectedText)
                    if (selectedText.length > 5000) {
                        selectedText = selectedText.substring(0, 4990);
                    }

                    var tk = vq(selectedText, tkk);
                    console.log("tk -> ", tk);
                    GM.xmlHttpRequest({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0",
                            "Accept": "application/json, text/javascript, */*; q=0.01",
                            "Host": "translate.google.cn",
                        },
                        url: `https://translate.google.cn/translate_a/single?client=t&sl=en&tl=zh-CN&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&ssel=0&tsel=0&kc=0&tk=${tk}&q=${encodeURI(selectedText)}`,
                        onload: function (response) {
                            var resp = response.responseText;
                            //resp.replace("/\n/","<br>");
                            console.log(response);
                            var result = JSON.parse(response.responseText);
                            //var i=1;
                            console.log(result);
                            var showinfo = "";
                            for (var i = 0; i < result[0].length - 1; i++) {
                                var content = result[0][i][0];
                                console.log(i, "分段：", /\n/g.test(content));

                                showinfo += content;
                                //                             if(/\n/g.test(content)){
                                //                                 showinfo +="<br>";
                                //                             }
                            }
                            GM.setClipboard(showinfo);
                            showinfo = showinfo.replace(/\n/g, "<br>");

                            console.log(x, y);
                            var c_tip_arrow = "width: 0; " +
                                "height: 0; " +
                                "font-size: 0; " +
                                "line-height: 0; " +
                                "display: block; " +
                                "position: absolute; " +
                                "top: -16px;";

                            var c_tip_con = "position: absolute; " +
                                "background: #fff; " +
                                "border: 1px solid #dcdcdc; " +
                                "border: 1px solid rgba(0,0,0,.2); " +
                                "-webkit-transition: opacity .218s; " +
                                "transition: opacity .218s; " +
                                "-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.2); " +
                                "box-shadow: 0 2px 4px rgba(0,0,0,.2); " +
                                "padding: 5px 0; " +
                                "font-size: 12px; " +
                                "line-height: 20px; " +
                                "top: 441.133px; " +
                                "left: 332.5px; " +
                                "z-index: 220; " +
                                "display: block; ";

                            var info = document.createElement("div");
                            info.setAttribute("id", "ctips");

                            info.setAttribute("style", `top: ${y + 15}px; left: ${x}px; z-index: 220; display: block;position: absolute; max-width:${widthSelected}px;background: #fff;border: 1px solid #dcdcdc;border: 1px solid rgba(0,0,0,.2);-webkit-transition: opacity .218s;transition: opacity .218s;-webkit-box-shadow: 0 2px 4px rgba(0,0,0,.2);box-shadow: 0 2px 4px rgba(0,0,0,.2);padding: 5px; margin-right:30px;font-size: 12px;line-height: 20px;`);
                            info.innerHTML = '<div style="padding:3px"><span style="color:#999">译：</span>' + showinfo + '</div>';
                            console.log(info);
                            document.body.appendChild(info);

                        },
                        onerror: function (ex) {
                            console.log(`異常：${ex}`);
                        }
                    });
                }
            }
            else {
                var ctips1 = document.getElementById("ctips");
                if (ctips1) {
                    document.body.removeChild(ctips1);
                }
            }
        }
    });


    // Your code here...
})();