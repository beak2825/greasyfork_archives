// ==UserScript==
// @name        Add Waifus to LMS
// @namespace   Violentmonkey Scripts
// @match       https://experiencia21.tec.mx/courses/*/modules
// @match       https://experiencia21.tec.mx/courses/*/assignments
// @match       https://experiencia21.tec.mx/courses/*/assignments/*
// @match       https://classroom.google.com/u/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant       none
// @version     1.0
// @author      Mauville @ Github
// @description Adds waifus from Danbooru to Learning Management Systems. Works by default on Tec de Monterrey Links and Google Classroom's, but can be easily tweaked to allow for other websites! Images have permanence. Click an image to delete it and reload to get a new one.
// @downloadURL https://update.greasyfork.org/scripts/423374/Add%20Waifus%20to%20LMS.user.js
// @updateURL https://update.greasyfork.org/scripts/423374/Add%20Waifus%20to%20LMS.meta.js
// ==/UserScript==

// Purges image from DB. Hides it
let purgeImg = () => {
    GM_deleteValue(hashCode(document.URL))
    $("#waifu").hide()

}
// Injects image into DOM. Gives it listener
let injectImg = (htmlimg) => {
    // Finds application element. Change this to reflect other
    $("body").append(htmlimg)
    $("#waifu").css({
        'z-index': '9999',
        'position': 'fixed',
        'right': '9em',
        'bottom': '0',
        'max-height': '40%'
    });
    $("#waifu").on("click", purgeImg)
}

// Common hashCode function to convert URL into serial
function hashCode(source) {
    let hash = 0;
    if (source.length == 0) {
        return hash;
    }
    for (var i = 0; i < source.length; i++) {
        var char = source.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer 
    }
    return hash;
}

let img = "NULL IMAGE"
let page = Math.floor(Math.random() * 850)
let memoised = GM_getValue(hashCode(document.URL), false)

if (false == memoised) {
    // get images from danbooru. Tags are HD, transparent and SFW
    $.getJSON("https://danbooru.donmai.us/posts.json?tags=transparent_background+highres+rating:s&page=" + page, function(data) {
        //sort images by filesize and choose random from bottom 3
        data.sort((a, b) => parseFloat(a.file_size) - parseFloat(b.file_size));
        let newurl = data[Math.floor(Math.random() * 3)].file_url;
        img = '<img id=waifu src="' + newurl + '">'
        //memoise for next time
        GM_setValue(hashCode(document.URL), newurl)
        injectImg(img)

    });
} else {
    img = '<img id=waifu src="' + memoised + '">'
    injectImg(img)
}