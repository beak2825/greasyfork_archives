// ==UserScript==
// @name         Learn AI
// @namespace    https://chat.cutterman.cn/
// @version      0.2
// @description  对learn AI进行了加强，我真的想玩AI！
// @author       You
// @match        https://chat.cutterman.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://chat.cutterman.cn/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465866/Learn%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/465866/Learn%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const jquery= document.createElement('script');
    jquery.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js';
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(jquery);
    function refresh(){
        let token = "";
        $.ajax({
            type : "POST",
            url: "https://www.cutterman.cn/chat/user-info",
            data: "",
            success: function(res) {
                //localStorage.setItem("access_token",res.access_token);
                token = res.access_token
            },
        });
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            let [resource, config] = args;
            config.headers['Authorization'] = token
            const response = await originalFetch(resource, config);

            // response interceptor

            return response;
        };
    }

    let count = 0;
    window.onkeydown = function(e){
        if(e.keyCode === 13) {
            count +=1;
            if (count >= 2){
                //setTimeout(refresh(),100);
                refresh()
                count = 0;
            }
        }
    }

    window.onclick = function (e){
        let sendButton = e.view.document.getElementsByClassName("text-5 mx-3").item(0);
        sendButton.addEventListener("click", ()=>{
            count +=1;
            if (count >= 2){
                //setTimeout(refresh(),100);
                refresh()
                count = 0;
            }
        })
    }



})();