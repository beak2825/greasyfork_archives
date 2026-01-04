// ==UserScript==
// @name         古古漫画插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去白条，右键下一话
// @author       xiantong.zou
// @include      *://www.gugu5.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387668/%E5%8F%A4%E5%8F%A4%E6%BC%AB%E7%94%BB%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/387668/%E5%8F%A4%E5%8F%A4%E6%BC%AB%E7%94%BB%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("GuGu_Comic run!");

    //隐藏“白带”
    var pic = document.getElementById('mypic_k0');
    if(pic != null){
        //console.log("GuGu_Comic hide mypic_k0!");
        pic.style.visibility="hidden";
    }


    var nextHref = null;
    document.body.addEventListener('DOMSubtreeModified', function () {
        //console.log("body changed!")
        var nextDlg = document.getElementById('msgTxt');
        if(nextDlg != null && nextHref == null){
            console.log("msgTxt open");
            for(var el of nextDlg.childNodes){
                //console.log("find ele",el);
                if(el.href != null){
                    nextHref = el.href;
                    var timerId = null;
                    timerId = setInterval(function(){
                        el.innerHTML = el.innerHTML + "(→:下一话)";
                        clearInterval(timerId);
                    },10);
                    break;
                }
            }
        }else if(nextDlg == null && nextHref != null){
            console.log("msgTxt close");
            nextHref = null;
        }
    }, false);

    //按键监听
    var oldOnKeyDown = document.onkeydown;
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==39){ // //keyCode 39 = Right
            //支持右键下一话
            if(nextHref != null){
                window.location.href = nextHref;
            }
            //alert("enter!");
        }
        if(oldOnKeyDown != null){
            oldOnKeyDown(event);
        }
    };

    // Your code here...
})();