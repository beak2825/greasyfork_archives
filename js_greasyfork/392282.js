// ==UserScript==
// @name         Furaffinity Handy Stuff
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Helpful hotkeys and various improvements.
// @author       eron_gi
// @match        *://www.furaffinity.net/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @match        *://d.facdn.net/*
// @grant        GM.getValue
// @grant        GM.setValue
//@grant         GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/392282/Furaffinity%20Handy%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/392282/Furaffinity%20Handy%20Stuff.meta.js
// ==/UserScript==

( function() {
    'use strict';
    var prev, next, left, right, fav;
    //Disables info description icons on images in galleries
    var disableInfoDescriptions = true;
    //Automatically resizes imagse when opened directly(d.facdn.net)
    var resizeImagesAutomatically = true;
    if (window.location.href.includes("furaffinity.net/view/")) {
       prev = document.getElementsByClassName("prev button-link")[0];
       next = document.getElementsByClassName("next button-link")[0];
       var actions = document.getElementsByClassName("alt1 actions aligncenter")[0].childNodes;
       if (actions[3].textContent == "Download") {
           fav = actions[1].childNodes;
       }
       else fav = actions[3].childNodes;
    }

    else if (window.location.href.includes("furaffinity.net/gallery/")) {
        cloneNavBar();
        left = document.getElementsByClassName("button-link left")[0];
        right = document.getElementsByClassName("button-link right")[0];
        removeInfoDescriptions();
    }
    else if (window.location.href.includes("furaffinity.net/browse/")) {
        cloneNavBar();
        left = document.getElementsByClassName("button left")[0];
        right = document.getElementsByClassName("button right")[0];
    }
    else if (window.location.href.includes("furaffinity.net/favorites/")) {
        left = document.getElementsByClassName("button-link left")[0];
        right = document.getElementsByClassName("button-link right")[0];
        removeInfoDescriptions();
    }
    else if (window.location.href.includes("d.facdn.net")) {
        if (resizeImagesAutomatically) resizeImage(document.getElementsByTagName("img")[0])
    }

    window.setTimeout(scroll, 1);
    document.onkeydown = checkKey;


    function checkKey(e) {
        e = e || window.event;
        var e2 = window.event.location;
        //left arrow
        if (e.keyCode == '37') {
            if (next != undefined && window.location.href.includes("furaffinity.net/view/")) {
                window.location.href = next;
            }
            else if (left != undefined && window.location.href.includes("furaffinity.net/browse/")) {
                left.click();
            }
            else if (left.href != undefined) {
                if (window.location.href.includes("furaffinity.net/favorites/") || window.location.href.includes("furaffinity.net/gallery/")) {
                   window.location.href = left;
                }
            }
        }
        //right arrow
        else if (e.keyCode == '39') {
            if (prev != undefined && window.location.href.includes("furaffinity.net/view/")) {
                window.location.href = prev;
            }
            else if (right != undefined && window.location.href.includes("furaffinity.net/browse/")) {
                right.click();
            }
            else if (right.href != undefined) {
                if (window.location.href.includes("furaffinity.net/favorites/") || window.location.href.includes("furaffinity.net/gallery")) {
                    window.location.href = right;
                }
            }
        }
        //numpad zero
        else if (e.keyCode == '96' || e.keyCode == '45') {
            if (window.location.href.includes("furaffinity.net/view/")) {
                GM.setValue("currentURL", window.location.href);
                var direct = document.getElementById("submissionImg").getAttribute("data-fullview-src");
                window.location.href = direct
            }
            else if (window.location.href.includes("d.facdn.net/art/")) {
               gmLink("currentURL");
            }
        }
        //numpad one
        else if (e.keyCode == '97' || e.keyCode == '35') {
            if (window.location.href.includes("d.facdn.net")) {
                var img = document.getElementsByTagName("img")[0];
                resizeImage(img);
            }
        }
        //right shift
        else if (e.keyCode == '17' && e2 == '2') {
            if (window.location.href.includes("furaffinity.net/view/")) {
                if (fav[0].textContent.includes("Add to Favorites")) {
                   window.location.href = fav[0];
                }
            }
        }
        //right ctrl
        else if (e.keyCode == '16' && e2 == '2') {
            if (window.location.href.includes("furaffinity.net/view/")) {
                if (fav[0].textContent.includes("Remove from Favorites")) {
                   window.location.href = fav[0];
                }
            }
        }

    }

    async function gmLink(value) {
        window.location.href = await GM.getValue(value)
    }
    function scroll() {
        if (window.location.href.includes("furaffinity.net/view/")) {
            var img = document.getElementById("submissionImg")
            img.scrollIntoView();
        }
    }
    //Disables info description icons on images in galleries
    function removeInfoDescriptions() {
        if (disableInfoDescriptions = true) {
            var list = document.getElementsByTagName("i")
            for (var i = 0; i < list.length; i++) {
                list[i].remove();
            }
        }
    }
    //Automatically resizes imagse when opened directly(d.facdn.net)
    function resizeImage(img) {
        if (img.style.width != "" || img.style.height != "") {
            img.style.width = "";
            img.style.height = "";
            return;
        }
        var iHeight = img.height, iWidth = img.width;
        var wHeight = window.innerHeight, wWidth = window.innerWidth;
        if (wHeight - iHeight < wWidth - iWidth) {
            img.style.height = "100%";
        }
        else if (wWidth - iWidth < wHeight - iHeight) {
            img.style.width = "100%";
        }
        else img.style.height = "100%"
    }
     //add navbar to top of page in artist gallery
    function cloneNavBar() {
        var navbar, submissions;
        if (window.location.href.includes("furaffinity.net/browse/")) {
            navbar = document.getElementsByClassName("fancy-pagination clearfloat")[0];
            submissions = document.getElementById("gallery-browse");
            submissions.insertBefore(navbar.cloneNode(true), submissions.childNodes[0])
        }
        else if (window.location.href.includes("furaffinity.net/gallery/")) {
            navbar = document.getElementsByClassName("fancy-pagination clearfloat")[0]
            submissions = document.getElementsByClassName("submission-list")[0]
            submissions.insertBefore(navbar.cloneNode(true), submissions.childNodes[0])
        }
    }
})();