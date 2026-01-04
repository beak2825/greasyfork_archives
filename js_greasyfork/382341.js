// ==UserScript==
// @name         Komica Page Image Viewer
// @namespace    https://github.com/ben2613
// @version      0.2
// @description  Make button which open a image viewer with basic navigating features
// @author       ben2613
// @match        https://*.komica.org/*
// @match        http://acgspace.wsfun.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382341/Komica%20Page%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/382341/Komica%20Page%20Image%20Viewer.meta.js
// ==/UserScript==

GM_addStyle(`
#transformationBtn{
    position: fixed;
    left: 0px;
    bottom: 0px;
}
#kImageViewer{
    background-color: #000;
    position:fixed;
    top:0px;
    left:0px;
    bottom:0px;
    right:0px;
    display:none;
}
#kImageViewer img{
    position: absolute;
    max-height: 100%;
    max-width: 90%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
}
#kImageViewer img.cache{
    width:0px;
    height:0px;
}
`)

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}


(function () {

    let imgStack = []
    let currentIndex = 0
    let reloadImage = function() {
        $('#kImageViewer img').attr('src', imgStack[currentIndex])
        if(imgStack.length > 1) {
            let next = currentIndex + 1
            if(next == imgStack.length) {
                next = 0
            }
            $('#kImageViewer img.cache.l').attr('src', imgStack[next])
            let prev = currentIndex - 1
            if(prev < 0) {
                prev = imgStack.length - 1
            }
            $('#kImageViewer img.cache.r').attr('src', imgStack[prev])
        }
    }

    'use strict'
    jQuery.noConflict()
    let $ = jQuery

    // fetch all the images links
    // all links which wrap a img and its href is a image too
    $('a > img').each(function () {
        let parent = $(this).parent()
        let href = parent.attr('href').toLowerCase()
        let exts = ['.jpg', '.png', '.jpeg', '.bmp', '.gif']
        if (exts.some((ext) => href.endsWith(ext))) {
            imgStack.push(href)
        }
    })

    if(imgStack.length == 0) {
        return;
    }

    let btn = $('<button>').attr('id', 'transformationBtn').text('合体だ！')
    btn.on('click', ()=>{
        if(imgStack.length == 0) {
            alert("No Image link to image found in this page")
            return
        }
        $('#kImageViewer').show()
        $('body').css('overflow','hidden')
    })
    $('body').append(btn)


    // create the slider
    let kImageViewer = $('<div id="kImageViewer">')
    $('body').append(kImageViewer)
    let closeBtn = $('<button>').text('X').click(()=>{
        $('#kImageViewer').hide()
        $('body').css('overflow', '')
    })
        .css({
            position: "absolute",
            top: "0px",
            right: "0px",
            height: "40px",
            width: "40px",
            background: "white"
        })
    let lBtn = $('<button>').text('<').css({
        position: "absolute",
        left: "0px",
        height: "100%",
        width: "40px",
        background: "transparent",
        color:"white"
    }).click(() => {
        currentIndex--
        if(currentIndex < 0 ) {
            currentIndex = imgStack.length - 1
        }
        reloadImage()
    })
    let rBtn = $('<button>').text('>').css({
        position: "absolute",
        top: "40px",
        right: "0px",
        height: "100%",
        width: "40px",
        background: "transparent",
        color:"white"
    }).click(() => {
        currentIndex++
        if(currentIndex >= imgStack.length) {
            currentIndex = 0
        }
        reloadImage()
    })
    kImageViewer.append(lBtn)
    kImageViewer.append(closeBtn)
    kImageViewer.append(rBtn)

    // Image Zone
    let img = $('<img>').attr('src', imgStack[0])
    kImageViewer.append(img)

    // caching tab for next image
    let cachel = $('<img class="cache l">')
    let cacher = $('<img class="cache r">')
    if(imgStack.length > 1) {
        kImageViewer.append(cachel)
        kImageViewer.append(cacher)
        cachel.attr('src', imgStack[1])
        cacher.attr('src', imgStack[imgStack.length - 1])
    }
})()
