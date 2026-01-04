// ==UserScript==
// @namespace    howsun_keycode_watcher
// @name         keyCode?
// @version      1.0
// @description  查看监听 keyCode
// @author       howsun(keith)
// @include      *
// @match        *
// @icon         data:image/gif;base64,R0lGODlhIAAgAIIHAJSUlGZmZvPz89vb2zU1Nby8vAAAAP///yH/C05FVFNDQVBFMi4wAwEBAAAh+QQBAAAHACwAAAAAIAAgAAAI+AAPCBxIsKDBgwgPCgCQsKFDAQYYOpxokICBARQzCgxggIAAjRQ5RgQ5UeRFkg1NBviI8qBJAyxbFjTpUaZBAB0JBLBpsIDOADt5EiwAFKhQggMAAJV49EDSAEybDiAaE2HViQOmlqyqFWFWjA51EhRQ82CBAlddGigwEGLUoWAbku3IEmJQgwLS4jXA9y4BAnFRQuQL88DgtyAH8/04gC9ijYoLN+6I92xcvQUI18zMd0DeAkr7BpiqFHTWswBwWiQgkDPh16KLLgVQIKsAnwEIsDUMu7fmALWvLg38srdOtAlTBzZc/PhyhQCeC5xqGeTZpgXzFgwIADs=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473252/keyCode.user.js
// @updateURL https://update.greasyfork.org/scripts/473252/keyCode.meta.js
// ==/UserScript==

const keyCodeMap = {"8":"BackSpace","9":"Tab","12":"Clear","13":"Enter","16":"Shift","17":"Control","18":"Alt","20":"Cape Lock","27":"Esc","32":"Spacebar","33":"Page Up","34":"Page Down","35":"End","36":"Home","37":"Left Arrow","38":"Up Arrow","39":"Right Arrow","40":"Dw Arrow","45":"Insert","46":"Delete","48":"0","49":"1","50":"2","51":"3","52":"4","53":"5","54":"6","55":"7","56":"8","57":"9","65":"A","66":"B","67":"C","68":"D","69":"E","70":"F","71":"G","72":"H","73":"I","74":"J","75":"K","76":"L","77":"M","78":"N","79":"O","80":"P","81":"Q","82":"R","83":"S","84":"T","85":"U","86":"V","87":"W","88":"X","89":"Y","90":"Z","96":"0","97":"1","98":"2","99":"3","100":"4","101":"5","102":"6","103":"7","104":"8","105":"9","106":"*","107":"+","108":"Enter","109":"-","110":".","111":"/","112":"F1","113":"F2","114":"F3","115":"F4","116":"F5","117":"F6","118":"F7","119":"F8","120":"F9","121":"F10","122":"F11","123":"F12","144":"Num Lock","170":"搜索","171":"收藏","172":"浏览器","173":"静音","174":"音量减","175":"音量加","179":"停止","180":"邮件","186":";:","187":"=+","188":",<","189":"-_","190":".>","191":"/?","192":"`~","219":"[{","220":"/|","221":"]}","222":"'\""};

(function() {
    'use strict';
    // 滚轮事件
    // document.addEventListener('mousewheel', mouseScrollEventFoo);
    // document.addEventListener('DOMMouseScroll', mouseScrollEventFoo);
    // const keyCodeMap = GM.getResourceUrl('keyCodeMap');
    let keypress = new Array();

    document.onkeydown = function(event){
        var e = event || window.event;
        e.preventDefault();
        //e.stopPropagation();
        if (e){
            // let k = e.keyCode.toString();
            let name = keyCodeMap[e.keyCode];
            keypress.push(e.keyCode +' '+ name);
        }
    }

    document.onkeyup = function(event){
        var e = event || window.event;
        e.preventDefault();
        //e.stopPropagation();

        let text = '按键:';
        if (keypress.length > 1) {
            text = '组合按键: ';
        }

        text += "\n";
        text += keypress.join("\n");
        keypress.length = 0;
        console.log(text);
    }
    // Your code here...
})();