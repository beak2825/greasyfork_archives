// ==UserScript==
// @name         鼠标点击圆圈
// @namespace    farawaystudio@foxmail.com
// @version      1.0.1
// @description  一个用JS写的鼠标左击特效
// @author       w
// @include      /[a-zA-z]+://[^\s]*/
// @run-at       document_start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/376117/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E5%9C%86%E5%9C%88.user.js
// @updateURL https://update.greasyfork.org/scripts/376117/%E9%BC%A0%E6%A0%87%E7%82%B9%E5%87%BB%E5%9C%86%E5%9C%88.meta.js
// ==/UserScript==
onload = function() {
    var click_cnt = 0;
    var $html = document.getElementsByTagName("html")[0];
    var $body = document.getElementsByTagName("body")[0];
    $html.onclick = function(e) {
        var $elem = document.createElement("div");
        $elem.style.zIndex = 9999;
        $elem.style.position = "absolute";
        $elem.style.select = "none";
        var x = e.pageX;
        var y = e.pageY;
        $elem.style.left = (x - 10) + "px";
        $elem.style.top = (y - 20) + "px";
        clearInterval(anim);
        switch (++click_cnt) {
            case 10:
            default:
                break;
        }
        $elem.style.height = $elem.style.width = 0 + 'px';
        $elem.style.background = '#C0FF3E';
        var increase = 0;
        var anim;
        setTimeout(function() {
          anim = setInterval(function() {
              if (++increase == 200) {
                  clearInterval(anim);
                    $body.removeChild($elem);
              }
              var r = increase/2;
              $elem.style.width = $elem.style.height = r + "px";
              $elem.style['-webkit-border-radius'] = $elem.style['border-radius'] = $elem.style['-moz-border-radius'] = r/2 + 'px';
              $elem.style.left = (x - r/2) + "px";
              $elem.style.top = (y - r/2) + "px";
              $elem.style.opacity = (150 - increase) / 500;
          }, 0);
        }, 0);
        $body.appendChild($elem);
    };
};