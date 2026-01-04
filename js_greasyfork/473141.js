// ==UserScript==
// @name         Album-collection Viewer
// @namespace    veiw.album-collection
// @version      0.1.0001
// @description  アルバムコレクションのぼかしなしサムネイルを表示できます。
// @author       yakisova41
// @match        https://album-collection.net/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=album-collection.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473141/Album-collection%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/473141/Album-collection%20Viewer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const imagesParent = $('body > div > div > main > div > ul')
    const images = imagesParent.children('li')
    const thumbnailsParent = $('<div class="thumbnails"></div>')
    $('main.l-content-main').append(thumbnailsParent)
    thumbnailsParent.css({
        marginTop:"10px"
    })

    $(images).each((index, imageParent)=>{
        const imageElem = $(imageParent).children('figure').children('img')
        const imgsrc = $(imageElem).attr('src')

        const appendImg = $(`<img key=${index}>`)
        thumbnailsParent.append(appendImg)
        appendImg.attr('src', imgsrc)
    })

})();