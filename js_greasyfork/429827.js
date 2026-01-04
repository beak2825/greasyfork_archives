// ==UserScript==
// @name         reabble 过滤文章
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  过滤文章
// @author       yb
// @match        https://reabble.com/app*
// @icon         https://www.google.com/s2/favicons?domain=reabble.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429827/reabble%20%E8%BF%87%E6%BB%A4%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/429827/reabble%20%E8%BF%87%E6%BB%A4%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main(){
        for (let i of document.querySelectorAll('article')){
            i.style.display= /^.+赞同了回答: .+$/.test(i.textContent)?'none':''
        }

        let btn=document.createElement('button');
        (function bthHidden(){
            btn.id="hiddenBtn"
            btn.data=true
            btn.value="隐藏"
            let btnDiv= document.querySelector('#app-root > div > div:nth-child(2) > nav > div')
            btnDiv.append(btn)
            btn.onclick=()=>{
                btn.data=!btn.data
                for (let child of articleList.children){
                    change(child,btn.data)
                }
            }

        })()

        function change(element,bool){
            let v=bool?'none':''
            element.style.display= /^.+赞同了回答: .+$/.test(element.lastChild.textContent)?v:''
            //console.log(element.lastChild.textContent, /^.+赞同了回答: .+$/.test(element.lastChild.textContent))
        }
        let articleList=document.querySelector('#app-root > div > div:nth-child(2) > div:nth-child(2) div div');
        let mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length>0){
                    change(mutation.addedNodes[0],btn.data)
                }
            });
        });
        mutationObserver.observe(articleList, {
            childList: true,
            subtree: false,
        });
    }

    setTimeout(main, 6000 )

})();