// ==UserScript==
// @name         多邻国快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  多邻国快捷键，使用方法请按：F12 -> console 查看 ; duolingo shortcut key,Please press f12-> console to view the usage.
// @author       shan Lan ; mail:misterchou@qq.com
// @match        *://*.duolingo.cn/*
// @match        *://*.duolingo.com/*

// @grant        none
// @icon         https://d35aaqx5ub95lt.cloudfront.net/favicon.ico
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/color/jquery.color-2.1.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/405133/%E5%A4%9A%E9%82%BB%E5%9B%BD%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/405133/%E5%A4%9A%E9%82%BB%E5%9B%BD%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //不计时按钮
    var secondaryBtn;
    //绑定'G'键为跳过按钮
    var skipBtn;
    //正常播放声音的按钮
    var playSoundBtn;
    $(document).keydown(function(e){
        console.log("%c===============使用说明===============\n"+
                    "tap 上面的波浪键为：录音键，用于录制口语\n"+
                    "Ctrl + N 键为不计时间练习按钮，用于进入练习的页面\n"+
                    "Ctrl + x 键为慢速播放音频，用于听力练习\n"+
                    "=============== 结 束 ===============", "color: red;")
        // tab上面的波浪键
        // 录音按钮
        if (e.keyCode == 192  ||  e.keyCode == 229) {
            var record = document.querySelector('#root > div > div.BWibf._3MLiB > div > div > div._2-1wu > div > div > div > div > div > div > div._3MxCt.OQHKq > button');

            if( record != null )
            {
                record.click();
            }
        }
        //绑定'ctrl+ N'键为不计时间练习按钮
        else if(e.ctrlKey &&  e.keyCode == 78){
            if( secondaryBtn){
                secondaryBtn.click();
                return;
            }
            document.querySelectorAll("button").forEach( r => {
                if(r.getAttribute("data-test") === "secondary-button")
                {
                    // console.log(r,typeof r.getAttribute("data-test")=== typeof "global-practice")
                    secondaryBtn = r;
                }
            })
            secondaryBtn.click();
        }
        //绑定'ctrl+x'键为：快速播放音频
        else if (e.ctrlKey && event.keyCode == 88 ) {
            console.log("ctrl+x")

            //             console.log("ctlr+z")
            if(playSoundBtn){
                console.log("播放声音")
                playSoundBtn.click();
                return;
            }
            let buttonNodeList = document.querySelectorAll("button")
            for( let i = 0; i < buttonNodeList.length; i++ ){
                if( buttonNodeList[i].parentElement.getAttribute("dir") === "ltr"){
                    console.log("遍历 ctrl+x")

                    //                     console.log(buttonNodeList[i]);
                    playSoundBtn = buttonNodeList[i];
                    playSoundBtn.click();
                    return;
                }
            };
        }

        //show key code
        console.log(e.keyCode);
    });




})();