// ==UserScript==
// @name        TryToLoadBigImageAutomatically
// @namespace   mnts
// @description Automatically try to show big image instead of original preview.
// @include     http://anime-pictures.net?*
// @include     *://*anime-pictures.*/*
// @include     http?://anime.reactor.cc/tag/?*
// @include     *://*anime.reactor.*/tag/*
// @include     http?://zerochan.net/?*
// @include     *://*zerochan.*/*
// @include     http?://otakumode.com/?*/post/?*
// @include     *://*otakumode.*/*/post/*
// @include     http?://?*.?*/?*
// @include     *://*.*/*
// @version     1.4
// @grant       none
// allow pasting
// @downloadURL https://update.greasyfork.org/scripts/27487/TryToLoadBigImageAutomatically.user.js
// @updateURL https://update.greasyfork.org/scripts/27487/TryToLoadBigImageAutomatically.meta.js
// ==/UserScript==

function tryAnimePictures()
{ //anime-pictures.net
    var asPreview = document.getElementById('big_preview_cont');
    if (asPreview === undefined || asPreview === null) return false;
    var aPreview = asPreview.getElementsByTagName('a')[0];
    if (aPreview === undefined || asPreview === null) return false;
    var bigImgUrl = aPreview.getAttribute('href');
    if (bigImgUrl !== undefined && bigImgUrl !== "") {
        var imgPreview = aPreview.getElementsByTagName('img')[0];
        if (imgPreview === undefined || imgPreview === null) return false;
        imgPreview.setAttribute('width', imgPreview.width);
        imgPreview.removeAttribute('height');
        imgPreview.setAttribute('src', '');
        imgPreview.setAttribute('src', bigImgUrl);
    }
    return true;
}

function tryAnimeReactorCC()
{ //anime.reactor.cc
    var asPreview = document.getElementsByClassName('prettyPhotoLink');
    var result = false;
    for (var i = 0; i < asPreview.length; i++) {
        result = true;
        var a = asPreview[i];
        var urlBigImg = a.getAttribute('href');
        var img = a.getElementsByTagName('img')[0];
        img.setAttribute('width', img.width);
        img.removeAttribute('height');
        img.setAttribute('src', '');
        img.setAttribute('src', urlBigImg);
    }
    return result;
}

function tryZerochan()
{ //zerochan.net
    var divPreview = document.getElementById('large');
    if (divPreview === undefined || divPreview === null) return false;
    var aPreview = divPreview.getElementsByTagName('a')[0];
    if (aPreview === undefined || aPreview === null) return false;
    var imgPreview = aPreview.getElementsByTagName('img')[0];
    if (imgPreview === undefined || imgPreview === null) return false;
    var urlFull = aPreview.getAttribute('href');
    if (urlFull.length <= 0) return false;
    imgPreview.setAttribute('width', imgPreview.width);
    imgPreview.removeAttribute('height');
    imgPreview.setAttribute('src', '');
    imgPreview.setAttribute('src', urlFull);
    return true;
}

function tryOtakumode()
{ //otakumode.com
    var className = 'first nomenu nodraggable';
    var imgsPreview = document.getElementsByClassName(className);
    if (imgsPreview === undefined || imgsPreview === null) return false;

    var countPreview = 0;
    var divContents = document.getElementById('contents');
    if (divContents === undefined || divContents === null) return false;

    divContents.addEventListener('DOMSubtreeModified', function() {
        var imgsPreview = document.getElementsByClassName(className);
        if (imgsPreview === undefined || imgsPreview === null) return;
        if (countPreview === imgsPreview.length) return;
        countPreview = imgsPreview.length;

        var exprPass = ".*x\.jpg$";
        for (var i = 0; i < imgsPreview.length; i++) {
            var imgPreview = imgsPreview[i];
            var urlImage = imgPreview.getAttribute('src');
            if (urlImage.match(exprPass) === null) {
                var ext = '.jpg';
                var urlImageBig = urlImage.substring(0, urlImage.length - ext.length) + 'x' + urlImage.substring(urlImage.length - ext.length);
                imgPreview.setAttribute('width', imgPreview.width);
                imgPreview.removeAttribute('height');
                imgPreview.setAttribute('src', '');
                imgPreview.setAttribute('src', urlImageBig);
            }
        }
    });

    return true;
}

function allHrefToSrc()
{
    console.log('window.onload');
    var imgs = document.getElementsByTagName('img');
    var expr = '.*\.(jpg|jpeg|png)$';

    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var nodeParent = img.parentNode;
        if (nodeParent.tagName !== 'A') continue;

        var src = img.getAttribute('src');
        var href = nodeParent.getAttribute('href');
        if (src === href) continue;

        if (href.match(expr) !== null) {
            img.setAttribute('width', img.width);
            img.removeAttribute('height');
            img.setAttribute('src', '');
            img.setAttribute('src', href);
        }
    }
}

function tryCommon()
{ //*.*
    var body = document.getElementsByTagName('body')[0];
    if (body === undefined || body == null) return false;

    var countImg = 0;
    window.onload = function() {
        allHrefToSrc();
    };
    body.addEventListener('DOMSubtreeModified', function() {
        var imgs = document.getElementsByTagName('img');
        if (countImg === imgs.length) return;
        countImg = imgs.length;

        console.log('DOMSubtreeModified');
        allHrefToSrc();
    });
    return true;
}

if (tryAnimePictures()) {
    console.log('type: anime-pictures.net');
} else if (tryAnimeReactorCC()) {
    console.log('type: anime.reactor.cc');
} else if (tryZerochan()) {
    console.log('type: zerochan.net');
} else if (tryOtakumode()) {
    console.log('type: otakumode.com');
} else {
    console.log('type: http?://.*\..*/.*');
    tryCommon();
}