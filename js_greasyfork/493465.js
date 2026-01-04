// ==UserScript==
// @name         iWhaleCloud-UI-Figma
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  这是一个 Figma 提取字号颜色脚本
// @author       HolmesZhao
// @include      *://www.figma.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493465/iWhaleCloud-UI-Figma.user.js
// @updateURL https://update.greasyfork.org/scripts/493465/iWhaleCloud-UI-Figma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onbeforeunload = function(e) {
        let pid = getQueryVariable("pid")
        console.log(pid)
        if (pid != '' && pid != null) {
            window.localStorage.setItem('lanhu_current_pid', pid)
        }
        return;
    };

    var authorization = ""
    function listen() {
        var origin = {
            setRequestHeader: XMLHttpRequest.prototype.setRequestHeader
        }

        XMLHttpRequest.prototype.setRequestHeader = function (a, b) {
            if (arguments[0] == 'Authorization') {
                authorization = arguments[1]
            }
            origin.setRequestHeader.apply(this, arguments)
        }
    }
    listen()

    function getQueryVariable(variable) {
        let len = window.location.href.indexOf('?')
        if (len <= 0) { return false; }
        var query = window.location.href.substring(len + 1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function addButton(name, marginLeft, top, fun) {
        var txt = document.createTextNode(name);
        var btn = document.createElement('button');
        btn.className = 'mmbutton';
        btn.style = "z-index: 9999; font-size: large; position: fixed; bottom: " + top +"px; right: " + (marginLeft) + "px;border:1px solid black; padding: 0 10px;";
        btn.onclick = fun;
        btn.appendChild(txt);
        document.body.appendChild(btn);
        return btn.offsetWidth;
    };

    async function changeColor() {
        const colorDoms = document.getElementsByClassName('colors_inspect_panel--styleNameRow--RknQ9')
        let result = [];
        for (let i = 0; i < colorDoms.length; ++i) {
            const colorDom = colorDoms[i];
            const color = colorDom.innerText;
            const colorText = color.split('/').reduce((r, e) => {
                return r + "-" + e;
            });
            if (isIOS) {
                const colorBodyFormat = colorText.split("-").reduce((r, e) => {
                    return r.charAt(0).toUpperCase() + r.slice(1) + e.charAt(0).toUpperCase() + e.slice(1);
                });
                const code = "UIColor.adw" + colorBodyFormat;
                result.push(code);
            } else {
                const colorBodyFormat = colorText.split("-").reduce((r, e) => {
                    return r.charAt(0).toLowerCase() + r.slice(1) + "_" + e.charAt(0).toLowerCase() + e.slice(1);
                });
                const code = "adw_" + colorBodyFormat;
                result.push(code);
            }
        }

        if (result.length == 0) {
            alert("颜色未识别到");
            return
        }
        try {
            console.log("hasFocus:", document.hasFocus());
            console.log("visibility:", document.visibilityState);
            await navigator.clipboard.writeText(result);
        } catch (e) {
            console.log(e)
            // 兜底：execCommand
            const ta = document.createElement('textarea');
            ta.value = result;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
    }

    async function changeFont() {
        const fontDoms = document.getElementsByClassName('typography_inspection_panel--typographyPanel--f3upg')
        let result = [];
        for (let i = 0; i < fontDoms.length; ++i) {
            const maybeFontDom = fontDoms[i];
            const maybeFontStrings = maybeFontDom.textContent.split("Name");
            const maybeFontString = maybeFontStrings[1];
            const maybeFontStrings2 = maybeFontString.split("Font");
            const fontText = maybeFontStrings2[0];

            if (isIOS) {
                const fontFormat = fontText.split('.').reduce((r, e) => {
                    return r.charAt(0).toUpperCase() + r.slice(1) + e.charAt(0).toUpperCase() + e.slice(1);
                });
                const code = ".adw" + fontFormat;
                result.push(code);
            } else {
                const fontFormat = fontText.split('.').reduce((r, e) => {
                    return r.charAt(0).toLowerCase() + r.slice(1) + "_" + e.charAt(0).toLowerCase() + e.slice(1);
                });
                const code = "adw_" + fontFormat;
                result.push(code);
            }
        }

        if (result.length == 0) {
            alert("字体未识别到");
            return
        }

        try {
            console.log("hasFocus:", document.hasFocus());
            console.log("visibility:", document.visibilityState);
            await navigator.clipboard.writeText(result);
        } catch (e) {
            console.log(e)
            // 兜底：execCommand
            const ta = document.createElement('textarea');
            ta.value = result;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
    }

    let btnWidth = addButton('复制颜色', 50, 20, changeColor);
    addButton('复制字体', btnWidth + 50, 20, changeFont);

    var isIOS = window.localStorage.getItem('FigmaIOS');

    if (isIOS == null) {
        if (confirm("是不是 iOS ?")) {
            window.localStorage.setItem('FigmaIOS', true);
            isIOS = true;
        } else {
            window.localStorage.setItem('FigmaIOS', false);
            isIOS = false;
        }
    } else {
        isIOS = isIOS == "true";
    }







})();
