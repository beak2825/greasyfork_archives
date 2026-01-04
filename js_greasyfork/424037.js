// ==UserScript==
// @name         BD Forum Block Script
// @version      0.4
// @description  Remove the posts of blocked users within a thread on Black Desert Official Forum, one exception is if the user is the person who started the discussion thread then only the very first post will not get removed.
// @author       PootyPoot
// @match        https://www.naeu.playblackdesert.com/en-US/*
// @exclude      https://www.naeu.playblackdesert.com/en-US/Main/Index*
// @exclude      https://www.naeu.playblackdesert.com/en-US/News/*
// @exclude      https://www.naeu.playblackdesert.com/en-US/GameInfo/*
// @exclude      https://www.naeu.playblackdesert.com/en-US/Wiki*
// @exclude      https://www.naeu.playblackdesert.com/en-US/Adventure/*
// @exclude      https://www.naeu.playblackdesert.com/en-US/Photogallery*
// @exclude      https://www.naeu.playblackdesert.com/en-US/BeautyAlbum*
// @exclude      https://www.naeu.playblackdesert.com/en-US/Partners*
// @exclude      https://www.naeu.playblackdesert.com/en-US/Data/*
// @grant        none
// @namespace    https://greasyfork.org/users/751816
// @downloadURL https://update.greasyfork.org/scripts/424037/BD%20Forum%20Block%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/424037/BD%20Forum%20Block%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // List of blocked users
    const blockedUserList = ['ExampleUser1', 'ExampleUser2'];
    // Get all the posts within the thread
    var postList = document.querySelectorAll('.section_column.reply_mode.skin_forum');
    var pageNum = document.querySelector('#paging');
    var firstPost = 0;
    if(pageNum != null)
    {
        pageNum = pageNum.querySelector('.active').innerText;
        if(pageNum > 1)
        {
            firstPost = -1;
        }
    }
    // Find the blocked user and remove the person's post
    for(var postIdx = postList.length - 1; postIdx > firstPost; postIdx--)
    {
        // Find the post's username
        var userName = postList[postIdx].querySelector('.name_area');
        for(var userIdx = 0; userIdx < blockedUserList.length; userIdx++)
        {
            if(blockedUserList[userIdx] == userName.innerText)
            {
                postList[postIdx].remove();
            }
        }
    }
})();