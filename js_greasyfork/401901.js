// ==UserScript==
// @name         鼠标左击特效
// @namespace    https://greasyfork.org/zh-CN/users/219208-%E5%A4%A9%E6%B3%BD%E5%B2%81%E6%9C%88
// @version      0.0.2
// @description  鼠标左击特效❤🌙☀
// @author       Zero
// @match        *
// @include      /[a-zA-z]+://[^\s]*/
// @run-at       document_start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/401901/%E9%BC%A0%E6%A0%87%E5%B7%A6%E5%87%BB%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/401901/%E9%BC%A0%E6%A0%87%E5%B7%A6%E5%87%BB%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==
onload = function() {
    var click_cnt = 0;
    var $html = document.getElementsByTagName("html")[0];
    var $body = document.getElementsByTagName("body")[0];
    $html.onclick = function(e) {
        var $elem = document.createElement("b");
        $elem.style.color = "#E94F06";
        $elem.style.zIndex = 9999;
        $elem.style.position = "absolute";
        $elem.style.select = "none";
        var x = e.pageX;
        var y = e.pageY;
        $elem.style.left = (x - 10) + "px";
        $elem.style.top = (y - 20) + "px";
        clearInterval(anim);

        //点击次数达到一定，变不同的效果。
        switch (++click_cnt) {
            case 2:
                $elem.innerText = "OωO";
                break;
            case 4:
                $elem.innerText = "(๑•́ ∀ •̀๑)";
                break;
            case 5:
                $elem.innerText = "(๑•́ ₃ •̀๑)";
                break;
            case 6:
                $elem.innerText = "(๑•̀_•́๑)";
                break;
            case 7:
                $elem.innerText = "（￣へ￣）";
                break;
            case 8:
                $elem.innerText = "(╯°口°)╯(┴—┴";
                break;
            case 9:
                $elem.innerText = "૮( ᵒ̌皿ᵒ̌ )ა";
                break;
            case 10:
                $elem.innerText = "╮(｡>口<｡)╭";
                break;
            case 11:
                $elem.innerText = "( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃";
                break;
            case 12:
                $elem.innerText = "(ꐦ°᷄д°᷅)";
                break;
            case 20:
                click_cnt = 0;
		break;
            default:
                //修改默认点击效果❤🌙☀☺☹♠♤♡♥♣♧卍§♬♪♩☂☢♨♞★☆☽☝☟☛☞
                $elem.innerText = "❤🌙☀";
                break;
        }
        $elem.style.fontSize = Math.random() * 1 + 8 + "px";
        var increase = 0;
        var anim;
        setTimeout(function() {
        	anim = setInterval(function() {
	            if (++increase == 150) {
	                clearInterval(anim);
                    $body.removeChild($elem);
	            }
	            $elem.style.top = y - 20 - increase + "px";
	            $elem.style.opacity = (150 - increase) / 120;
	        }, 8);
        }, 30);
        $body.appendChild($elem);
    };
};