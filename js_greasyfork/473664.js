// ==UserScript==
// @name         点击@名字转到帖子内的对话
// @namespace    mscststs
// @version      0.1
// @description  在点击 别人的At的名字 时找到那个人上一条发言。
// @license      ISC
// @author       mscststs
// @match        *://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473664/%E7%82%B9%E5%87%BB%40%E5%90%8D%E5%AD%97%E8%BD%AC%E5%88%B0%E5%B8%96%E5%AD%90%E5%86%85%E7%9A%84%E5%AF%B9%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/473664/%E7%82%B9%E5%87%BB%40%E5%90%8D%E5%AD%97%E8%BD%AC%E5%88%B0%E5%B8%96%E5%AD%90%E5%86%85%E7%9A%84%E5%AF%B9%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const pageData = [];

    function initFullData(){
        pageData.push(...[...document.querySelectorAll(".cell[id^='r_']")].map(item=>{

            const floorData = {
                id: item.id,
                item: item,
                floor: parseInt(item.querySelector("#"+item.id+" .no").innerHTML,10),
                author: item.querySelector("#"+item.id+" strong > a[href^='/member/']").innerHTML,
                content: item.querySelector("#"+item.id+" .reply_content")
            };

            [...document.querySelectorAll("#"+item.id+" .reply_content > a[href^='/member/']")].forEach(item=>{
                item.addEventListener("click", (event)=>{

                if(event.metaKey || event.shiftKey || event.ctrlKey){

                    event.preventDefault();
                    event.stopPropagation();
                    const name = event.target.innerHTML;
                    console.log("-> ref To :", name, floorData.floor);

                    const ref = [...pageData].reverse().find(f=>{
                        return (f.floor < floorData.floor) && (f.author === name);
                    });

                    if(ref){
                        ref.item.scrollIntoView({
                            behavior: "smooth",
                        });
                    }
                }

            });
            })
            return floorData;
        }));
    }

    initFullData();

})();