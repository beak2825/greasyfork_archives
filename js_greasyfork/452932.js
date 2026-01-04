// ==UserScript==
// @name         GitHub添加Editor入口
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add editor entry in github.com
// @author       mengxun
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_addElement
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452932/GitHub%E6%B7%BB%E5%8A%A0Editor%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/452932/GitHub%E6%B7%BB%E5%8A%A0Editor%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    GM_addElement('script', {
        textContent: `
           function openEditor(){
              const href = window.location.href;
              if(new RegExp("http(s?):\/\/github.com*").test(href)){
                const split = href.split('github.com')
                const to = 'https://github1s.com'+split[1]
                window.location.href = to
             }
         }
         `
    });


    const interval = setInterval(() => {
        const goToFileDom = document.querySelector('#repo-content-pjax-container > div > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-main > div.file-navigation.mb-3.d-flex.flex-items-start > a')
        if(goToFileDom){
            try{
                const editorDom = createElementFromHTML(`
                <div class="btn ml-2 d-none d-md-block"  onclick="openEditor()">
                 Open in Editor
                </div>
               `);
                goToFileDom.before(editorDom)
            }catch(e){
                console.log('error:',e)
            }
            finally{
                clearInterval(interval)
            }
        }
    },1000)
    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

})();
