// ==UserScript==
// @name     Twitter ORIG
// @description Twitter full Size
// @include     https://pbs.twimg.com/media/*
// @include     https://mobile.twitter.com/*/status/*
// @include     https://twitter.com/*/status/*
// @version  1.94
// @grant    none
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/164357
// @downloadURL https://update.greasyfork.org/scripts/395653/Twitter%20ORIG.user.js
// @updateURL https://update.greasyfork.org/scripts/395653/Twitter%20ORIG.meta.js
// ==/UserScript==

//Assign Variable
console.log("Start");
let href = document.location.href;
const toolbar = `<div class="tweet-tool-bar"></div>`
const sty = `<style>
.tweet-tool-bar {
    margin-top: 7px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
}
.ex-img {
    width: calc(100% - 5%);
    margin: 0px 3px;
}
</style>

`
function changeToOrig(link) {
    const n = link.search(/.jpg|.png/)
    let newLink = ""
    if(link.indexOf('jpg')>0){
        newLink = link.substring(0,n) + "?format=jpg&name=orig"
    }
    else if(link.indexOf('png')>0){
        newLink = link.substring(0,n) + "?format=png&name=orig"
    }
    return newLink
}
$("head").append(sty)
//End Assign Variable

//Get started
if(href.includes("mobile.")){
    document.location.href = href.replace("mobile.","")
}
$(".AdaptiveMediaOuterContainer").siblings(".js-tweet-text-container").append(toolbar);
//End started

//Event Handlers
$("div.AdaptiveMedia-photoContainer").each(function(index,value){
    let link = $(this).attr("data-image-url");
    let origLink = changeToOrig(link);
    $(".tweet-tool-bar").append(`<a href="${origLink}" target="_blank"><img class="ex-img" src="${origLink}"></<img></a>`);
    $(this).parents(".AdaptiveMedia").remove()
})
