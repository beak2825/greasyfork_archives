// ==UserScript==
// @name         Youtube video blocker
// @namespace    Danielv123
// @version      1.4
// @description  Allows you to block videos from youtube
// @author       Danielv123
// @match        https://www.youtube.com/*
// @grant        none
// @require      https://code.jquery.com/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/29074/Youtube%20video%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/29074/Youtube%20video%20blocker.meta.js
// ==/UserScript==

//'use strict';
/*
Videos in sidebar

Get video ID
document.querySelectorAll(".video-list-item .yt-uix-simple-thumb-wrap")[0].dataset.vid
Get video title
document.querySelectorAll(".video-list-item .content-wrapper a:nth-child(1)")[2].title
Get username
document.querySelectorAll(".video-list-item .content-wrapper .stat.attribution span")[2].innerHTML
Hide
document.querySelectorAll(".video-list-item")[2].style.display = "none";
*/
var sidebar = {
    ID: function(x) {
        return document.querySelectorAll(".video-list-item.related-list-item-compact-video > .related-item-dismissable .yt-uix-simple-thumb-wrap")[x].dataset.vid;
    },
    title: function(x) {
        if(document.querySelectorAll(".video-list-item.related-list-item-compact-video > .related-item-dismissable > .content-wrapper a:nth-child(1)")[x]){
            return document.querySelectorAll(".video-list-item.related-list-item-compact-video > .related-item-dismissable > .content-wrapper a:nth-child(1)")[x].title;
        } else {
            return "";
        }
    },
    username: function(x) {
        let y=document.querySelectorAll(".video-list-item.related-list-item-compact-video > .related-item-dismissable > .content-wrapper .stat.attribution span")[x];
        if(y) return y.innerHTML;
        return "";
    },
    hide: function(x) {
        document.querySelectorAll(".video-list-item.related-list-item-compact-video")[x].style.display = "none";
    }
};
/*
Videos on subscriptions page

Get video ID
document.querySelectorAll(".yt-shelf-grid-item > div")[0].dataset.contextItemId
Get video title
document.querySelectorAll(".yt-shelf-grid-item .yt-lockup-content .yt-lockup-title a")[0].title
Get username
document.querySelectorAll(".yt-shelf-grid-item .yt-lockup-content .yt-lockup-byline a")[0].innerHTML
Hide
document.querySelectorAll(".yt-shelf-grid-item")[0].style.display = "none"
*/
var shelfvideos = {
    ID: function(x) {
        return document.querySelectorAll(".yt-shelf-grid-item > div")[x].dataset.contextItemId;
    },
    title: function(x) {
        if(document.querySelectorAll(".yt-shelf-grid-item .yt-lockup-content .yt-lockup-title a")[x] && document.querySelectorAll(".yt-shelf-grid-item .yt-lockup-content .yt-lockup-title a")[x].title){
            return document.querySelectorAll(".yt-shelf-grid-item .yt-lockup-content .yt-lockup-title a")[x].title;
        }
    },
    username: function(x) {
        return document.querySelectorAll(".yt-shelf-grid-item .yt-lockup-content .yt-lockup-byline a")[x].innerHTML;
    },
    hide: function(x) {
        document.querySelectorAll(".yt-shelf-grid-item")[x].style.display = "none";
    }
};
/*
Videos on autolplay list

Title
document.querySelector("#watch-related > li:nth-child(1) > div.related-item-dismissable > div.content-wrapper > a > span.title")
Username
document.querySelector("#watch7-sidebar-modules > div:nth-child(1) > div > div.watch-sidebar-body > ul > li > div.content-wrapper > a > span.stat.attribution > span")

*/
// Code goes here and onwards

function main() {
    if(!localStorage.blockedUsers){
        localStorage.blockedUsers = JSON.stringify([]);
    }
    if(!localStorage.blockedTitles){
        localStorage.blockedTitles = JSON.stringify([]);
    }
    if(!localStorage.blockedRegex){
        localStorage.blockedRegex = JSON.stringify([]);
    }
    //hideSidebarVideos("","PewDiePie");
    //hideShelfVideos("","nigahiga");
    //hideShelfVideos("","","s");

    // Hide videos
    let userFilters = JSON.parse(localStorage.blockedUsers);
    let titleFilters = JSON.parse(localStorage.blockedTitles);
    let regexFilters = JSON.parse(localStorage.blockedRegex);
    // Loop until we are through the largest of our filter sets
    for(let i = 0; i < Math.max(regexFilters.length, Math.max(userFilters.length, titleFilters.length));i++){
        // hideSidebarVideos(id, username, title, regex)
        let id = "";
        let user = userFilters[i] || "";
        let title = titleFilters[i] || "";
        let regex = regexFilters[i] || "";
        hideSidebarVideos(id, user, title);
        hideShelfVideos(id, user, title);
        // only responds to title, but whatever.
        hideEndscreenVideos(undefined, undefined, title);
    }
}
setTimeout(main, 500);
injectScripts();
makeFilterGui();

function makeFilterGui() {
    let HTML =  '<div id="youtubeBlockerGui" style="">';
    // Close button
    HTML += '<div id="youtubeBlockerGuiCloseButton"><img src="http://www.drodd.com/images14/x23.png"></img></div>';
    HTML += '<h1>Youtube Blocker</h1><p>Below are a few textfields. Enter , (comma) seperated lists of titles and/or channels to exclude from your youtube feed.</p><p>Video titles don\'t have to match completely, just having part of the title is enough. Ex "porn,1000 degree,prank" will match "1000 degree knife vs water baloon EPIC"<br>';
    HTML += '<h2>Blocked channels</h2><p><i>All channels with this excact name will be hidden</i></p><textarea id="blockedChannels"></textarea>';
    HTML += '<h2>Blocked videos by name</h2><p><i>All videos with this in their names will be hidden</i></p><textarea id="blockedVideos"></textarea>';
    HTML += '<h2>Regex blocks</h2><p><i>All video titles matching this regex will be hidden</i></p><textarea id="blockedRegex"></textarea>';
    // Save button
    HTML += '<div id="saveButton"><h2>Save</h2></div>';
    // Close everything
    HTML += '</div>';
    // Open settings button in botttom right corner
    HTML += '<div id="gearwheelButton"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Simpleicons_Interface_gear-wheel-in-black.svg/2000px-Simpleicons_Interface_gear-wheel-in-black.svg.png"></img></div>';
    // inject into body
    let container = document.createElement('div');
    container.innerHTML = HTML;
    (document.body || document.head || document.documentElement).appendChild(container);

    // Populate textareas with old settings
    let x = JSON.parse(localStorage.blockedUsers);
    let y = "";
    for(let i in x) {
        y += x[i]+",\n";
    }
    $("textarea#blockedChannels")[0].value = y;
    x = JSON.parse(localStorage.blockedTitles);
    y = "";
    for(let i in x) {
        y += x[i]+",\n";
    }
    $("textarea#blockedVideos")[0].value = y;
    x = JSON.parse(localStorage.blockedRegex);
    y = "";
    for(let i in x) {
        y += x[i]+",\n";
    }
    $("textarea#blockedRegex")[0].value = y;

    document.querySelector("#youtubeBlockerGui #youtubeBlockerGuiCloseButton").onclick = toggleGuiDisplay;
    document.querySelector("#gearwheelButton").onclick = toggleGuiDisplay;
    document.querySelector("#saveButton").onclick = function(){
        console.log("Saving lists of blocked channels, users and regexes");
        // Regex to replace linebreaks
        localStorage.blockedUsers = JSON.stringify($("textarea#blockedChannels")[0].value.replace(/(\r\n|\n|\r)/gm,"").split(","));
        localStorage.blockedTitles = JSON.stringify($("textarea#blockedVideos")[0].value.replace(/(\r\n|\n|\r)/gm,"").split(","));
        localStorage.blockedRegex = JSON.stringify($("textarea#blockedRegex")[0].value.replace(/(\r\n|\n|\r)/gm,"").split(","));
    };
}
function readBlockSettings(){
    return $("#youtubeBlockerGui textarea")[0].value.replace(/(\r\n|\n|\r)/gm,"").split(",");
}
function toggleGuiDisplay(){
    let gui = $("#youtubeBlockerGui")[0];
    if(gui.style.display == "none"){
        gui.style.display = "block";
        console.log("showing blocker gui");
    } else {
        gui.style.display = "none";
        console.log("hiding blocker gui");
    }
}
function injectScripts(){
    // jQuery
    var s=document.createElement('script');
    s.setAttribute('src','https://code.jquery.com/jquery.js');
    document.getElementsByTagName('head')[0].appendChild(s);
    // CSS
    var d=document.createElement('style');
    d.innerHTML = "#youtubeBlockerGui {"+
        "display:none;"+
        "width:60%;"+
        "height:80%;"+
        "background-color:white;"+
        "position:fixed;"+
        "top:10%;"+
        "left:20%;"+
        "border:1px solid lightgrey;"+
        // damn, the youtube sidebar apparently has a z index of 1999999999...
        "z-index:2000000000;"+
        "}"+
        // red X on gui to close
        "#youtubeBlockerGuiCloseButton {"+
        "float:right;"+
        "height:30px;"+
        "width:30px;"+
        "cursor:pointer;"+
        "}"+
        "#youtubeBlockerGuiCloseButton img {"+
        "height:100%;"+
        "width:100%;"+
        "}"+
        // gearwheel in bottom right corner
        "#gearwheelButton {"+
        "position:fixed;"+
        "height:30px;"+
        "width:30px;"+
        "bottom:0px;"+
        "right:0px;"+
        "cursor:pointer;"+
        "}"+
        "#gearwheelButton img {"+
        "height:100%;"+
        "width:100%;"+
        "}"+
        "#saveButton {"+
        "cursor:pointer;"+
        "}"
        ;
    document.getElementsByTagName('body')[0].appendChild(d);
}
function hideShelfVideos(id, username,title, regex) {
    let videos = document.querySelectorAll(".yt-shelf-grid-item");
    for(let i = 0; i < videos.length; i++){
        let hideVideo = function(number, filter){
            // document.querySelectorAll(".yt-shelf-grid-item")[number].style.display = "none";
            shelfvideos.hide(number);
            console.log("Filter: " + filter + " Hidden: " + document.querySelectorAll(".yt-shelf-grid-item .yt-lockup-content .yt-lockup-title a")[number].title);
        };
        // Check by video ID
        if(id && id == shelfvideos.ID(i)){
            hideVideo(i, id);
        }
        // Check by channel name
        if(username && username.toLowerCase() == shelfvideos.username(i).toLowerCase()){
            hideVideo(i, username);
        }
        // Check if video title contains title
        if(title && title != " " && shelfvideos.title(i).toLowerCase().includes(title.toLowerCase())){
            hideVideo(i, title);
        }
        // Check if title matches regex
        if(regex && shelfvideos.title(i).match(regex)){
            hideVideo(i, regex);
        }
    }
}
function hideSidebarVideos(id, username, title, regex) {
    let videos = document.querySelectorAll(".video-list-item");
    for(let i = 0; i < videos.length; i++){
        let hideVideo = function(number, filter){
            // document.querySelectorAll(".video-list-item")[number].style.display = "none";
            sidebar.hide(number);
            console.log("Filter: " + filter + " Hidden sidebar: " + document.querySelectorAll(".video-list-item .content-wrapper a:nth-child(1)")[number].title);
        };
        // Check by video ID
        if(id && id == sidebar.ID(i)){
            hideVideo(i, id);
        }
        // Check by channel name
        if(username && username.toLowerCase() == sidebar.username(i).toLowerCase()){
            hideVideo(i, username);
        }
        // Check if video title contains title
        if(title && title != " " && sidebar.title(i).toLowerCase().includes(title.toLowerCase())){
            hideVideo(i, title);
        }
        // Check if title matches regex
        if(regex && sidebar.title(i).match(regex)){
            hideVideo(i, regex);
        }
    }
}
// hide endscreen videos
function hideEndscreenVideos(id, username, title, regex){
    let x = document.querySelectorAll('[aria-label].ytp-videowall-still.ytp-suggestion-set');
    for(let i = 0;i<x.length;i++){
        // if elemnt has aria-label (lots of those that are unrelated) and includes title and title is not falsey (ex "") beause that would trigger on lots of non video things
        if(x[i].getAttribute("aria-label") && x[i].getAttribute("aria-label").toLowerCase().includes(title) && title){
            x[i].style.display = "none";
            console.log("Filter: "+title+" Hidden: " + x[i].getAttribute("aria-label"));
        }
    }
}


// https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();
observeDOM( document.querySelector("#content") ,function(){
    console.log('dom changed, hiding videos...');
    main();
});