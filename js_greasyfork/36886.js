// ==UserScript==
// @name         Pixiv Display All Images
// @namespace    superschwul
// @version      2.5
// @description  Display all original images automatically: no need to click the medium image.
// @homepageURL  https://greasyfork.org/en/scripts/36886-pixiv-display-all-images
// @author       Superschwul
// @match        https://www.pixiv.net/stacc*
// @match        https://www.pixiv.net/member*
// @match        https://www.pixiv.net/bookmark*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36886/Pixiv%20Display%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/36886/Pixiv%20Display%20All%20Images.meta.js
// ==/UserScript==

// ===============================================================================

// USER OPTIONS
var FIT_IMAGES_TO_SCREEN_WIDTH_AND_HEIGHT = false;
var LOAD_MASTER_IMAGES_INSTEAD_OF_ORIGINAL = false;

// ===============================================================================

// CHANGELOG
// 2.5 2019-01-17 added firefox extension link
// 2.4 2019-01-17 abort on id detection
// 2.3 2018-10-23 refactoring, fixed multiple images support
// 2.2 2018-09-18 better original url support
// 2.1 2018-09-18 refactoring, bigger fixed avatar
// 2.0 2018-09-14 better ajax support
// 1.8 2018-09-13 added new member page support
// 1.7 2018-09-11 added ajax thumbs support
// 1.6 2018-09-02 fixed missing like button
// 1.5 2018-08-29 improved image src identification
// 1.4 2018-08-26 added hi-res option, improved avatar timing
// 1.3 2018-08-16 removed feedback button
// 1.2 2018-08-16 disabled sticky bar, added fit-to-screen option
// 1.1 2018-06-21 fixed image src url
// 1.0 2018-06-17 show original instead of master manga images
// 0.8 2018-06-15 added fixed avatar
// 0.7 2018-06-13 added link to works page at illustration page
// 0.6 2018-06-12 updated to work with the new pixiv layout
// 0.5 2018-01-07 hide buttons over thumbnails at works page
// 0.4 2018-01-04 enlarge thumbnails at works page
// 0.3 2018-01-03 replaced gm_xmlhttprequest by xmlhttprequest
// 0.2 2017-12-30 added support for rtl manga pages
// 0.1 2017-12-30 initial code

// ===============================================================================

function addMemberPageLink() {
    var interval = myInterval(function() {
        var usernames = document.getElementsByClassName('stacc_ref_illust_user_name');
        if(usernames == undefined) return;
        clearInterval(interval);
        for(var username of usernames) {
            username.style.display = 'block';
            var usernameLink = username.getElementsByTagName('a')[0];
            var memberPageLink = document.createElement('a');
            memberPageLink.href = usernameLink.href.replace('member', 'member_illust').replace(/&from_sid=\d+/, '');
            memberPageLink.target = '_blank';
            memberPageLink.style.display = 'block';
            memberPageLink.appendChild(document.createTextNode("More works"));
            username.appendChild(memberPageLink);
        }
    });
}

function processIllustrationPage() {
    getFigure();
    getAvatar();
}

function getFigure() {
    var interval = myInterval(function() {
        var figure = document.getElementsByTagName('figure')[0];
        if(figure == undefined) return;
        clearInterval(interval);
        addGallery();
        var figureObserver = new MutationObserver(addGallery);
        figureObserver.observe(figure, {childList: true});
    });
}

function removeGallery() {
    var gallery = document.getElementById('pil_gallery');
    if(gallery == undefined) return;
    gallery.parentNode.removeChild(gallery);
}

function addGallery() {
    var interval = myInterval(function() {
        if(!exists("document.getElementsByTagName('figure')[0].children[0].children[0].children[0]")) return;
        clearInterval(interval);
        removeGallery();
        var gallery = document.createElement('div');
        gallery.id = 'pil_gallery';
        gallery.innerHTML = `
            <div id="pil_extension">
                Try the Mini Pixiv extension for
                <a href="https://addons.mozilla.org/addon/mini-pixiv/">Firefox</a>
                and
                <a href="https://chrome.google.com/webstore/detail/mini-pixiv/lclakckbkbcigmpngmmchenoabiolall">Chrome</a>
            </div>
        `;
        console.log(gallery);
        var header = document.getElementsByTagName('header')[0];
        header.parentNode.insertBefore(gallery, header.nextSibling);
        removeTitle();
        getImagesForGallery();
        addFixedAvatar();
    });
}

function removeTitle() {
    var interval = myInterval(function() {
        var outer = document.getElementsByTagName('figure')[0].children[1];
        if(outer == undefined) return;
        var action = outer.getElementsByTagName('section')[0];
        if(action == undefined) return;
        clearInterval(interval);
        outer.appendChild(action);
        outer.removeChild(outer.children[0]);
    });
}

function getImagesForGallery() {
    var outer = document.getElementsByTagName('figure')[0].children[0].children[0].children[0];
    if(outer.tagName == 'CANVAS') {
        return; //gif
    }
    if(outer.getAttribute('role') != 'presentation') {
        getMultipleImages(); //multiple
        return;
    }
    var interval = myInterval(function() {
        if(outer.children[0].tagName != 'A') return;
        if(outer.getElementsByTagName('img')[0] == undefined) return;
        if(outer.getElementsByTagName('img')[0].src == document.location.href) return;
        clearInterval(interval);
        getSingleImage(); //single
    });
}

function getSingleImage() {
    var images = [];
    var thumb = document.getElementsByTagName('figure')[0].children[0].children[0].children[0].children[0];
    var image = {original: thumb.href};
    image.master = thumb.getElementsByTagName('img')[0].src;
    images.push(image);
    fillGallery(images);
}

function getMultipleImages() {
    var id = new URLSearchParams(document.location.search).get('illust_id');
    var p = fetch('/ajax/illust/'+id, { credentials: 'same-origin' })
        .then(r => r.json())
        .then(r => r.body)
        .then(data => {
            var images = [];
            for (let i = 0; i < data.pageCount; i++) {
                var image = {master: data.urls.regular.replace('p0', 'p'+i),
                             original: data.urls.original.replace('p0', 'p'+i)};
                images.push(image);
            }
            fillGallery(images);
        }
    );
}

function fillGallery(images) {
    var gallery = document.getElementById('pil_gallery');
    var i=0;
    for(var item of images) {
        //legend
        var legend = document.createElement('p');
        var legendText = document.createTextNode('Image ' + ++i + ' of ' + images.length);
        legend.appendChild(legendText);
        gallery.appendChild(legend);
        //container
        var container = document.createElement('div');
        container.className = 'img';
        var image = document.createElement('img');
        if(LOAD_MASTER_IMAGES_INSTEAD_OF_ORIGINAL) {
            image.src = item.master;
            var originalLink = document.createElement('a');
            originalLink.href = item.original;
            originalLink.appendChild(image);
            container.appendChild(originalLink);
        } else {
            image.src = item.original;
            container.appendChild(image);
        }
        gallery.appendChild(container);
    }
}

function getAvatar() {
    var interval = myInterval(function() {
        if(!exists("document.getElementsByTagName('aside')[1].children[0].children[0].children[0].href")) return;
        var avatarLink = document.getElementsByTagName('aside')[1].children[0].children[0].children[0];
        clearInterval(interval);
        var avatarObserver = new MutationObserver(addFixedAvatar);
        avatarObserver.observe(avatarLink, {attributeFilter: ['href']});
        addFixedAvatar();
    });
}

function addFixedAvatar() {
    var gallery = document.getElementById('pil_gallery');
    if(gallery == null) return;
    if(!exists("document.getElementsByTagName('aside')[1].children[0].children[0].children[0].href")) return;
    var avatar = document.getElementsByTagName('aside')[1].children[0].children[0];
    //add link to member page
    var pilMemberLink = document.getElementById('pil_memberLink');
    if(pilMemberLink != null) {
        pilMemberLink.parentNode.removeChild(pilMemberLink);
    }
    var memberLink = document.createElement('a');
    memberLink.id = 'pil_memberLink';
    memberLink.href = avatar.children[0].href.replace('member', 'member_illust');
    memberLink.appendChild(document.createTextNode('More works'));
    avatar.parentNode.insertBefore(memberLink, avatar.nextSibling);
    //add fixed avatar
    var pilFixedAvatar = document.getElementById('pil_fixedAvatar');
    if(pilFixedAvatar != null) {
        pilFixedAvatar.parentNode.removeChild(pilFixedAvatar);
    }
    var fixedAvatar = document.createElement('div');
    fixedAvatar.id = 'pil_fixedAvatar';
    fixedAvatar.appendChild(avatar.cloneNode(true));
    var links = fixedAvatar.getElementsByTagName('a');
    for(var link of links) {
        link.href = link.href.replace('member', 'member_illust');
        if(link.style != undefined) {
            link.style.backgroundImage = link.style.backgroundImage.replace('_50.', '_170.') + ', ' + link.style.backgroundImage;
        }
    }
    gallery.appendChild(fixedAvatar);
}

function setStyles() {
    var style = document.createElement('style');
    style.type = 'text/css';
    var styleCode = `
        #pil_main + div {
            display: none;
        }
        #pil_gallery {
            padding: 0.3em 3em 1em 3em;
            text-align: center;
            color: #b3c1d2;
            border-bottom: solid 1px white;
            margin-bottom: 4em;
            background: #ededed;
        }
        #pil_extension {
            width: 970px;
            margin: 0 auto;
            text-align: right;
        }
        #pil_extension a {
            color: #8699ba;
        }
        #pil_gallery .img {
            padding-bottom: 4em;
        }
        #pil_gallery img {
            max-width: 100%;
            height: auto;
            background: #dcdbdb;
    `;
    if(FIT_IMAGES_TO_SCREEN_WIDTH_AND_HEIGHT) {
        styleCode += 'max-height: 90vh';
    }
    styleCode += `
        }
        figure > div:first-child > div {
            background: rgb(250,250,250) !important;
        }
        figure > div:nth-child(2) > div {
            position: unset !important;
        }
        #pil_memberLink {
            width: 93%;
            padding: 0.5em;
            background: white;
            text-align: center;
            display: block;
            border-radius: 1em;
            margin-top: 1em;
            font-weight: bold;
            text-decoration: none;
            font-size: 80%;
        }
        #pil_memberLink:visited {
            color: #bbb;
        }
        #pil_fixedAvatar {
            text-align: left;
            position: fixed;
            left: 1.6em;
            bottom: 2em;
            width: 264px;
            z-index: 998;
        }
        #pil_fixedAvatar a:visited {
            color: #bbb;
        }
        #pil_fixedAvatar > div > a {
            width: 100px;
            height: 100px;
            background-color: white;
        }
        a {
            background: none;
        }
        .gtm-illust-recommend-zone {
            z-index: 999;
            position: relative;
            background: #f5f5f5;
        }
        a.stacc_unify_comment_count {
            text-align: left !important;
        }
        .stacc_timeline_bottom {
            font-size: 200%;
        }
    `;
    style.innerHTML = styleCode;
    document.getElementsByTagName('head')[0].appendChild(style);
}

function getMainDiv() {
    var interval = myInterval(function() {
        if(!exists("document.getElementsByTagName('header')[0].nextElementSibling")) return;
        var main = document.getElementsByTagName('header')[0].nextElementSibling;
        clearInterval(interval);
        if(main.id != '') return;
        setStyles();
        main.id = 'pil_main';
        processPage();
        var mainObserver = new MutationObserver(processPage);
        mainObserver.observe(main, {childList: true});
    });
}

function processPage() {
    if(document.getElementById('pil_main').children[0].style.display == 'flex') return;
    removeGallery();
    // stacc page
    if(document.location.href.search('stacc') != -1) {
        addMemberPageLink();
    }
    // illustration page
    if(document.location.href.search('medium') != -1) {
        processIllustrationPage();
    }
}

function myInterval(callback) {
    var intervalCount = 0;
    var interval = setInterval(function() {
        intervalCount++;
        if(intervalCount >= 100) {
            clearInterval(interval);
            return;
        }
        callback();
    }, 100);
    return interval;
}

function exists(string) {
    var el = '';
    for(var sub of string.split('.')) {
        (!el) ? el += sub : el += '.' + sub;
        if(eval(el) == undefined) return false;
    }
    return true;
}


(function() {
    'use strict';
    if (window.top != window.self) return;
    getMainDiv();
})();
