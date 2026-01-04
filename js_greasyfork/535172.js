// ==UserScript==
// @name         Jira4HAT
// @namespace    http://www.akuvox.com/
// @version      1.0
// @description  take on the world!
// @author       andy.wang
// @match        http://work.xm.akubela.local/*
// @match        http://work.fz.akubela.local/*
// @match        http://192.168.13.6/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535172/Jira4HAT.user.js
// @updateURL https://update.greasyfork.org/scripts/535172/Jira4HAT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Jira4HAT")

    // Select the existing <ul> element using a class or any other suitable identifier
    var navList = document.querySelector('.aui-nav');

    // Create a new <li> element
    var newListItem = document.createElement('li');

    // Set the id attribute of the new <li> (if necessary)
    newListItem.id = "create-menu";

    // Create a new <a> element
    var newLink = document.createElement('a');

    // Set attributes for the <a> element
    newLink.id = "create_link";
    newLink.className = "aui-button aui-button-primary aui-style";
    newLink.title = "音视频BUG";
    newLink.href = "http://know.xm.akubela.local/pages/viewpage.action?pageId=89300272";
    newLink.accessKey = "C";
    newLink.setAttribute('resolved', '');
    newLink.target = "_blank";
    // Set the text content of the new link
    newLink.textContent = "音视频BUG";

    // Append the <a> element to the <li>
    newListItem.appendChild(newLink);

    // Append the new <li> to the .aui-nav <ul>
    navList.appendChild(newListItem);

})();