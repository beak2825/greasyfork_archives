// ==UserScript==
// @name         Go to Weibo.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Creates a button to navigate to the weibo.com link from a m.weibo.cn link.
// @author       Sekaris
// @match        https://m.weibo.cn/status/*
// @icon         https://www.google.com/s2/favicons?domain=m.weibo.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429712/Go%20to%20Weibocom.user.js
// @updateURL https://update.greasyfork.org/scripts/429712/Go%20to%20Weibocom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load",function(){
        var btn = document.createElement("button");
        btn.innerHTML = "Go to Weibo.com";
        var link = "https://weibo.com/" + $render_data.status.user.id + "/" + $render_data.status.bid;
        btn.onclick = () => {
            window.location.href=link;
            return false;
        };
        btn.title = link;
        document.querySelector("h3.m-text-cut").before(btn);

        Object.assign(btn.style,{backgroundColor: "#eb7350", border: "none", color:"white", margin:"0 5px", padding:"10px", textAlign:"center", textDecoration:"none", display:"inline", borderRadius:"0px", float:"right", fontSize:"16px", zIndex:"50"});

        btn.onmouseover = function() {
            this.style.backgroundColor = "#D52C2B";
        };
        btn.onmouseleave = function() {
            this.style.backgroundColor = "#EB7350";
        };
    });
})();