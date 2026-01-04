// ==UserScript==
// @name         sailyond-cvat
// @namespace    http://cvat.sailyond.com/
// @version      20240624
// @description  use on sailyond cvat
// @author       Tianlu
// @license      MIT
// @match        http://cvat.sailyond.com/*
// @match        https://cvat.sailyond.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        window.onurlchange
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/494654/sailyond-cvat.user.js
// @updateURL https://update.greasyfork.org/scripts/494654/sailyond-cvat.meta.js
// ==/UserScript==

(function () {
    "use strict";

    console.log("cvat");
    GM_addStyle(`
      .cvat-canvas-context-menu {min-width: 500px;}
      .cvat-canvas-context-menu .ant-row-middle .ant-col-10 { max-width: 20%; }
      .cvat-canvas-context-menu .ant-row-middle .ant-col-12 { min-width: 70%; }
     `
    )

    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (info) => {
            checkSidebar()
            jumpBackAdamTasksDelay()
        });
    }
    document.addEventListener("DOMContentLoaded", function () {
      checkSidebar()
      jumpBackAdamTasksDelay()
    });
})();

function checkSidebar() {
    if(!(window.location.href.indexOf("cvat.sailyond.com/tasks") >= 0)) {
        return
    }

    var counter = 0;
    const invervalId = setInterval(() => {
        console.log('counter', counter)
        const sidebarElements = document.getElementsByClassName("cvat-objects-sidebar")
        if(sidebarElements.length >= 1) {
            sidebarStyle();
            clearInterval(invervalId);
        }
        counter += 1
        if(counter > 300) {
            clearInterval(invervalId);
        }
    }, 1000)
    // 这里的代码会在整个页面（包括所有依赖资源）加载完成后执行
    console.log("Page is fully loaded, including all dependencies.");
    // 在这里执行需要等待所有资源加载完成后的代码
}

function sidebarStyle() {
    const sidebar = document.getElementsByClassName("cvat-objects-sidebar")[0];
    // console.log("sidebar", sidebar);
    if (sidebar) {
        sidebar.style.minWidth = "550px";
    }
}

function jumpBackAdamTasksDelay() {
   setTimeout(() => {
    jumpBackAdamTasks()
   }, 3000)
}

function jumpBackAdamTasks() {
    const path_name = window.location.pathname;
    let regex = /\/tasks\/(\d+)/;
    let match = path_name.match(regex);
    let task_id = null
    if (match) {
        task_id = match[1]; // Extracted task ID
    }
    console.log('match task_id', task_id)
    if(!task_id) {
        return
    }

    document.getElementById('extra')?.remove()
    // Create a new anchor element
    let a = document.createElement('a');

    // Set attributes for the anchor element    
    a.href = `http://adam.sailyond.com/tasks?filters=[{"key":"cvat_task_id","type":"number","displayName":"Cvat+task+ID","action":"equals","value":"${task_id}"}]`;
    a.target = '_blank';
    a.textContent = 'Adam Task';
    a.id = "extra"

    // Find the element to prepend to
    let headerElement = document.querySelector('.cvat-right-header');

    // Prepend the anchor element to the header element
    if (headerElement) {
        headerElement.prepend(a);
    } else {
        console.error('.cvat-right-header element not found.');
    }
}
