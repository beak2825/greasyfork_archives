// ==UserScript==
// @name     Twitter new layout Image ORIG
// @description Twitter replace IMAGE, Quote Images with ORIG, remove some stuff, working with search image page
// @description classify border with tweet type
// @match     https://twitter.com/*/media
// @match     https://twitter.com/*/likes
// @match     https://twitter.com/*
// @match     https://mobile.twitter.com/*/status/*
// @match     https://mobile.twitter.com/*
// @version  1.19
// @grant    none
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/164357
// @downloadURL https://update.greasyfork.org/scripts/395721/Twitter%20new%20layout%20Image%20ORIG.user.js
// @updateURL https://update.greasyfork.org/scripts/395721/Twitter%20new%20layout%20Image%20ORIG.meta.js
// ==/UserScript==

//Assign Variable
console.log("Start");
let href = document.location.href;
const sty = `<style>
.new-img {
    border-radius: 10px;
    width:100%;
}
div.flex-module-inner:nth-child(1) , div.module:nth-child(2) , .import-prompt ,
div.permalink-footer:nth-child(4) > div:nth-child(1) > div:nth-child(1) , div.module:nth-child(3) , .has-items > div:nth-child(1) > div:nth-child(1)
, .SidebarCommonModules
{
    display:none;
}
.searchToolBox {
    z-index: 999;
    top: calc(100% - 52%);
}
.searchToolBox .btn {
    width:100%;
    margin: 5px 0px;
}
.grid-img-container {
    display: grid;
    grid-template-columns: repeat(4,25%);
    grid-gap: 10px 20px;
}
.grid-img-item {
    width:100%;
    border: 2px solid black;
    border-radius: 15px;
    padding: 0px 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.grid-img-item img{
    width:100%;
    border-radius: 15px;
    margin-top: 5px;
}
.img-holder {
    width:100%;
    border: 2px solid black;
    border-radius: 15px;
    padding: 0px 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.remove-btn-container{
    z-index:999;
    position: fixed;
    top: calc(100% - 90%);
    width: calc(100% - 60%);
    background-color: white;
    padding: 10px;
    border: 2px solid black;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.remove-tweet {
    z-index:999;
    width: 100%;
    padding: 30px 20px;
    border: 3px solid #000;
    color: #000;
    border-radius: 10px;
    margin-bottom: 5px;
}
#stream-items-id {
    display: grid;
    grid-template-columns: repeat(2,calc(100% - 20%));
}
.profile-img-container {
    display: grid;
    grid-template-columns: repeat(4,22%);
    grid-gap: 10px 20px;
    background-color: #fbfbfb;
    margin-top: 1%;
}
.status-img-container {
    display: grid;
    grid-template-columns: repeat(2,50%);
    grid-gap: 0px 20px;
}
.img-holder.quoteImg {
    border: 2px solid purple;
}
.img-holder.retweeted {
    border: 2px solid green;
}
</style>
`
$("head").append(sty);
$("div.Grid-cell.u-size2of3.u-lg-size3of4").prepend(`<div class="grid-img-container"></div>`)
$(".u-lg-size2of3").before(`<div class="profile-img-container">
</div>`)
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

var img = ""; var fullImg = "";var AdaptiveMediaV = "";
var imageG_count = 0;var image_count = 0;
//End Assign Variable

//Get started
if(href.includes("mobile.")){
    document.location.href = href.replace("mobile.","")
}
//End started

//Event Handlers Interval


if(href.indexOf("status") == -1){

    $("body").append(`
        <div class="remove-btn-container">
            <button class="btn remove-tweet">
                Remove
            </button>
            <h1 class="image-count">${image_count}</h1>
        </div>
    `)//Add button box profile, media page
    let searchToolBox = `
        <div class="searchToolBox">
        <button class="btn remove-streamGrid">Remove</button>
        <button class="btn load-more">Load</button>
        <div style="display:flex;flex-direction: row;justify-content: center;"><h1 class="imageG-count">0</h1></div>
        </div>`
    if($(".SidebarFilterModule").find(".searchToolBox").length < 1){
        $(".SidebarFilterModule").empty();
        $(".SidebarFilterModule").prepend(`${searchToolBox}`)
        $(".SidebarFilterModule.is-collapsed").css({"height": "30%" , "position": "fixed", "z-index": "999", "width": "19%","display": "flex","flex-direction": "column"})
    }//Add Button box search page


//Tweet Image Original
    $(document).ready(function(){
        setInterval(function(){
            $(".tweet").each(function(index,value){
                let checkRetweet = $(this).attr("data-retweet-id")
                let retweetStatus = 0;
                if(typeof checkRetweet !== "undefined"){retweetStatus = 1;}
                AdaptiveMediaV = $(this).find(".AdaptiveMedia")
                let photoContainer = $(this).find(".AdaptiveMedia-photoContainer")
                $(photoContainer).each(function(index,value){
                    img = $(this).attr("data-image-url")
                    fullImg = changeToOrig(img)
                        $(".profile-img-container").append(`
                        <div class="img-holder ${retweetStatus == 0 ? "" : "retweeted"}">
                        <a href="${fullImg}" target="_blank">
                        <img class="new-img" src="${fullImg}"></img>
                        </a>
                        </div>
                        `)

                })
                let qPhotoContainer = $(this).find(".QuoteMedia-photoContainer")
                $(qPhotoContainer).each(function(index,value){
                    img = $(this).attr("data-image-url")
                    fullImg = changeToOrig(img)
                    $(".profile-img-container").append(`<div class="img-holder quoteImg"><a href="${fullImg}" target="_blank"><img class="new-img" src="${fullImg}"></img></a></div>`)
                })
                $(this).remove()
            })
        }, 3000);//Append Images profile,media page

        //Use in search images page
        //count image
        setInterval(function(){
            imageG_count = $(".grid-img-item").length
            $(".imageG-count").text(imageG_count)
            image_count = $(".img-holder").length
            $(".image-count").text(`${image_count}`)
        }, 500);//Update Images counted

        setInterval(function(){
            $("span.AdaptiveStreamGridImage").each(function(index,value){
                img = $(this).attr("data-url")
                let w = $(this).attr("data-width")
                let h = $(this).attr("data-height")
                fullImg = changeToOrig(img)
                $(".grid-img-container").append(`<div class="grid-img-item"><a href="${fullImg}" target="_blank"><img src="${fullImg}" /></a><br><h3>${w} x ${h}</h3></div>`)
                $(this).remove()
            })
        }, 3000);//Append Images search page
    })//End document Ready
    }//End IF status page check

    //Event Handlers
$("body").on("click",".remove-tweet",function(){
    $(".img-holder").each(function(index,value){
        $(this).remove()
        if(index == 3){return false}
    })
})//Remove Images profile, media page
$("body").on("click",".remove-streamGrid",function(){
    $(".grid-img-item").each(function(index,value){
        $(this).remove()
        if(index == 3){return false}
    })
})//Remove Images search page
$("body").on("click",".load-more",function(){
    window.scrollTo(0,document.documentElement.scrollHeight)
    setTimeout(function(){ window.scrollTo(0,70); }, 100);
})//Scroll to bottom search page

if(href.indexOf("status") > 0){
    $(document).ready(function(){
        $(".tweet").each(function(index,value){
            AdaptiveMediaV = $(this).find(".AdaptiveMedia")
            let anchorQImageCon = $(this).find(".QuoteMedia-photoContainer")
            let photoContainer = $(this).find(".AdaptiveMedia-photoContainer")
            $(AdaptiveMediaV).before(`<div class="status-img-container"></div>`)
            $(photoContainer).each(function(index,value){
                img = $(this).attr("data-image-url")
                fullImg = changeToOrig(img)
                    $(".status-img-container").append(`
                    <div class="img-holder">
                    <a href="${fullImg}" target="_blank">
                    <img class="new-img" src="${fullImg}"></img>
                    </a>
                    </div>
                    `)
            })//Append Images status page
            $(AdaptiveMediaV).remove()
            $(anchorQImageCon).each(function(index,value){
                img = $(this).attr("data-image-url")
                fullImg = changeToOrig(img)
                    $(".status-img-container").append(`
                    <div class="img-holder">
                    <a href="${fullImg}" target="_blank">
                    <img class="new-img" src="${fullImg}"></img>
                    </a>
                    </div>
                    `)
            })//Append Quote Images status page
        })
    })
}
