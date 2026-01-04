// ==UserScript==
// @name         Youtube Deleted Video Finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically copy the video ID if a video is unavailable/private and search it in google
// @author       WujekTadek
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @grant        none
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/453645/Youtube%20Deleted%20Video%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/453645/Youtube%20Deleted%20Video%20Finder.meta.js
// ==/UserScript==



(function() {
    //alert(document.title); //debug
    if(document.title === "- YouTube"){
        var video_id = window.location.search.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        //alert(video_id);
        window.open("https://www.google.com/search?q="+video_id+"&oq=yaEVYn_ze6g&aqs=chrome..69i57j69i60l2.270j0j7&sourceid=chrome&ie=UTF-8","_self");

    };
})();