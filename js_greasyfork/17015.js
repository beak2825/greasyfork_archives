// ==UserScript==
// @name         Netflix: Trailer
// @description  Embeds a youtube trailer in the detail view.
// @author       Chris H (Zren / Shade)
// @icon         https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2015.ico
// @namespace    http://xshade.ca
// @version      5
// @match        https://www.netflix.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/17015/Netflix%3A%20Trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/17015/Netflix%3A%20Trailer.meta.js
// ==/UserScript==

function isBrowseUrl() {
    return document.location.href.startsWith('https://www.netflix.com/browse')
    || document.location.href.startsWith('https://www.netflix.com/title')
    || document.location.href.startsWith('https://www.netflix.com/search');
}

function querySelectorLast(e, selector) {
    var arr = e.querySelectorAll(selector);
    return arr[arr.length-1];
}

function addTrailerToJawbone() {
    var jawbone = document.querySelector('.jawBoneContent.open') || document.querySelector('.background + .jawBone');
    if (!jawbone)
        return;
    if (jawbone.querySelector('iframe.trailer'))
        return;
    
    
    var title = querySelectorLast(jawbone, '.jawBoneContainer .title').innerText;
    if (!title)
        title = querySelectorLast(jawbone, '.jawBoneContainer .title img').alt;
    if (!title)
        return;
    
    var year = querySelectorLast(jawbone, '.meta .year').innerText;
    
    var trailerQuery = 'trailer ' + title;
    if (year)
        trailerQuery += ' (' + year + ')';
    var trailerUrl = 'https://www.youtube.com/embed?listType=search&list=' + encodeURIComponent(trailerQuery);
    
    var jawbonePlayLink = jawbone.querySelector('.overviewPlay');
    var trailerEmbed = document.createElement('iframe');
    trailerEmbed.classList.add('trailer');
    trailerEmbed.allowFullscreen = true;
    trailerEmbed.src = trailerUrl;
    jawbonePlayLink.parentNode.insertBefore(trailerEmbed, jawbonePlayLink.nextSibling);
}


if (isBrowseUrl()) {   
    setInterval(function() {
        addTrailerToJawbone();
    }, 400);
    GM_addStyle('\
.jawBone iframe.trailer { display: none; position: absolute; z-index: 100; top: 10px; height: calc(100% - 10px - 30px); left: 40%; width: calc(100% - 40% - 75px); border: none; } \
.background + .jawBone .overviewPlay, .jawBoneContent.open .overviewPlay { right: 61%; top: 77%; } \
.overviewPlay + iframe.trailer { display: block; } \
    ');
}
