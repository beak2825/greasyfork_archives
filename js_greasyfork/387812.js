// ==UserScript==
// @name         HF Menu replace icons with Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the menu icons to its old original text.
// @author       Soufian @ HF https://hackforums.net/member.php?action=profile&uid=46903
// @match        https://*.hackforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387812/HF%20Menu%20replace%20icons%20with%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/387812/HF%20Menu%20replace%20icons%20with%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentPage = document.documentElement.innerHTML;
    let regex = /action\=finduser\&amp;uid\=(\d{0,9})/;
    let found = currentPage.match(regex);

    let userID = found[1];

    let userLinks = document.querySelector(".user_links");
    userLinks.innerHTML = "";

    let listItem1 = document.createElement("li");
    let buddyListLink = document.createElement("a");
    buddyListLink.setAttribute("href", "javascript:void(0)");
    buddyListLink.setAttribute("onclick", "MyBB.popupWindow('https://hackforums.net/misc.php?action=buddypopup&modal=1', null, true); return false;");
    buddyListLink.setAttribute("title", "Buddy List");
    buddyListLink.innerText = "Buddy List";
    listItem1.append(buddyListLink);

    let listItem2 = document.createElement("li");
    let favoritesLink = document.createElement("a");
    favoritesLink.setAttribute("href", "https://hackforums.net/search.php?action=getfavorites");
    favoritesLink.setAttribute("title", "Favorites");
    favoritesLink.innerText = "Favorites";
    listItem2.append(favoritesLink);

    let listItem3 = document.createElement("li");
    let newPostsLink = document.createElement("a");
    newPostsLink.setAttribute("href", "https://hackforums.net/search.php?action=getnew");
    newPostsLink.setAttribute("title", "New Posts");
    newPostsLink.innerText = "New Posts";
    listItem3.append(newPostsLink);

    let listItem4 = document.createElement("li");
    let yourThreadsLink = document.createElement("a");
    yourThreadsLink.setAttribute("href", "https://hackforums.net/search.php?action=finduserthreads&uid=" + userID);
    yourThreadsLink.setAttribute("title", "Your Threads");
    yourThreadsLink.innerText = "Your Threads";
    listItem4.append(yourThreadsLink);

    let listItem5 = document.createElement("li");
    let yourPostsLink = document.createElement("a");
    yourPostsLink.setAttribute("href", "https://hackforums.net/search.php?action=finduser&uid=" + userID);
    yourPostsLink.setAttribute("title", "Your Posts");
    yourPostsLink.innerText = "Your Posts";
    listItem5.append(yourPostsLink);

    let listItem6 = document.createElement("li");
    let privateMessagesLink = document.createElement("a");
    privateMessagesLink.setAttribute("href", "https://hackforums.net/private.php");
    privateMessagesLink.setAttribute("title", "Private Messages");
    privateMessagesLink.innerText = "Private Messages";
    listItem6.append(privateMessagesLink);

    userLinks.appendChild(listItem1);
    userLinks.appendChild(listItem2);
    userLinks.appendChild(listItem3);
    userLinks.appendChild(listItem4);
    userLinks.appendChild(listItem5);
    userLinks.appendChild(listItem6);
})();