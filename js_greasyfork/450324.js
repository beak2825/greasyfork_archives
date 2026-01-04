// ==UserScript==
// @name         GitHub Notification Right Click to Repo Page
// @namespace    http://clear.studio/
// @version      0.3
// @license MIT
// @description  Open the repository home page with a right click on the notification item. 右键点击 GitHub 的通知项直接跳转到项目主页。
// @author       Kytrun
// @match        https://github.com/notifications*
// @icon         https://github.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450324/GitHub%20Notification%20Right%20Click%20to%20Repo%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/450324/GitHub%20Notification%20Right%20Click%20to%20Repo%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const rightClickOpenRepo = () => {
        const lis = document.querySelectorAll('li.notifications-list-item');
        lis.forEach(li => {
            if(!li.dataset.directlyHome){
                const notifiLink = li.querySelector('a.notification-list-item-link').href;
                const repoReg = /(https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-\.]+)\/.+/;
                const repoLink = notifiLink.replace(repoReg, '$1');
                //console.log(repoLink);
                li.addEventListener('contextmenu', function (ev) {
                    ev.preventDefault();
                    window.open(repoLink);
                    return false;
                }, false);
                li.dataset.directlyHome = "true"
                //li.style.color = 'red'
            }
        });
    }

    //rightClickOpenRepo();

    const observe = ()=>{
        const callback = function (mutationsList, observer) {
            rightClickOpenRepo();
        };
        const observer = new MutationObserver(callback);
        const observedNode = document.body;
        const config = { attributes: true, childList: true,subtree: true };
        observer.observe(observedNode, config);
        //observer.disconnect();
    }
    observe();
})();
