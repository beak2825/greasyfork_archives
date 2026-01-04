// ==UserScript==
// @name         咸鱼 - 简单的屏蔽关键词
// @namespace    https://time-blog.top/
// @version      0.0.0.2
// @description  用于屏蔽其他无关内容。
// @author       Time - https://time-blog.top
// @homepage     https://time-blog.top
// @match        *://*.goofish.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/531555/%E5%92%B8%E9%B1%BC%20-%20%E7%AE%80%E5%8D%95%E7%9A%84%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/531555/%E5%92%B8%E9%B1%BC%20-%20%E7%AE%80%E5%8D%95%E7%9A%84%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function() {
        document.querySelector("#content > div:nth-child(1) > div:nth-child(2)").innerHTML += '<div style="position: absolute;right: 1.5em;height: 32px;"> <input id="input_content" type="text" data-spm-anchor-id="a21ybx.search.0.i4.21862457DQxaV8" style="border: 1px solid rgba(0, 0, 0, .08);border-radius: 6px;box-sizing: border-box;color: #1f1f1f;height: 32px;outline: none;padding: 7px 9px;width: 84px;" placeholder="屏蔽内容"><input id="yes_button" value="确定" type="button" style="background-color: #ffe60f;border: none;border-radius: 6px;box-sizing: border-box;color: #1f1f1f;width: 43px;height: 28px;" data-spm-anchor-id="a21ybx.search.0.i10.21862457DQxaV8"></div>'
        setTimeout(()=>{
            var text_input = document.getElementById("input_content");
            var button = document.getElementById("yes_button");
            button.addEventListener('click' , ()=>{
                var item_lis = document.querySelectorAll("#content > div:nth-child(1) > div:nth-child(3) > a");
                if (text_input.value != ""){
                    for (let index = 0; index < item_lis.length; index++){
                        let text = item_lis[index].children[1].children[0].textContent.toLocaleLowerCase()
                        let value_text = text_input.value
                        if (text.includes(value_text.toLocaleLowerCase())){
                            item_lis[index].style.display = "none";
                        }
                    }
                }
            })
        },1000)
    })
})();