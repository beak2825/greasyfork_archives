// ==UserScript==
// @name         8muses Improved
// @namespace    Hentiedup
// @version      0.2.4
// @description  Improvements to 8muses: Mark-as-read, move image page breadcrumb to sidebar, hide image page header etc.
// @author       Hentiedup
// @license      MIT
// @include      https://comics.8muses.com/*
// @include      https://8muses.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/420214/8muses%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/420214/8muses%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================= OPTIONS =================================================================//
           var moveBreadcrumbsAndHideHeaderOnImages = true; //Hides the header on image pages and moves the page path thing to the sidepanel
           var hideTitleAttributeFromImages         = true; //that little text popup that appears when hovering over images on image pages
           var hideEmptyOrAdSectionsFromSidebar     = true; //Hides empty/ad sections from the sidebar
           var fixSomeObviousProblems               = true; //Fixes some obvious problems with the site
           var markAsReadSystemEnabled              = true; //Mark pages with collections of images as read (appears as read on parent page)
           var expandImagesToScreenHeight           = true; //doesn't shrink bigger images, only expands smaller
    //===========================================================================================================================================//


    var MarkedAsSeenString = GM_getValue("MarkedAsSeenString", "[]");
    var MarkedAsSeen = JSON.parse(MarkedAsSeenString);

    //Mark as read system
    if(markAsReadSystemEnabled && window.location.href.includes("/album/")) {
        //Add MAR links
        if(true) {
            let MAREl = document.createElement("a");
            MAREl.innerHTML = "Mark this page as " + (MarkedAsSeen.includes(window.location.pathname) ? "unseen" : "seen");
            MAREl.setAttribute("id", "MARElem");
            MAREl.setAttribute("href", "#");
            MAREl.style.position = "absolute";
            MAREl.style.top = "-15px";
            MAREl.style.left = "0px";
            MAREl.style.fontSize = "1.5em";
            let galleryDiv = document.getElementById("content").getElementsByClassName("gallery")[0];
            galleryDiv.style.position = "relative";
            galleryDiv.style.paddingTop = "15px";
            galleryDiv.appendChild(MAREl);

            MAREl.onclick = function(e) {
                e.preventDefault();
                AddRemoveFromMAR(window.location.pathname);
            };
        }

        //Fade out and mark read comics
        if(true) {
            let comicElems = document.getElementById("content").getElementsByClassName("gallery")[0].getElementsByClassName("c-tile");
            for(let i = 0, count = comicElems.length; i < count; i++)
            {
                if(MarkedAsSeen.includes(comicElems[i].getAttribute("href")))
                {
                    let readTagElem = document.createElement("span");
                    readTagElem.style.position = "absolute";
                    readTagElem.style.right = "20px";
                    readTagElem.style.bottom = "20px";
                    readTagElem.style.color = "white";
                    readTagElem.style.fontSize = "20px";
                    readTagElem.style.fontWeight = "bold";
                    readTagElem.innerHTML = "READ";

                    comicElems[i].appendChild(readTagElem);
                    comicElems[i].getElementsByClassName("image")[0].style.opacity = "0.2";
                    comicElems[i].getElementsByClassName("image-title")[0].style.opacity = "0.2";
                }
            }
        }
    }

    if(hideEmptyOrAdSectionsFromSidebar) {
        let targets = document.querySelectorAll(".menu-items > .ui-menu-item > a[rel=noopener]");
        for(let i = 0; i < targets.length; i++)
        {
            targets[i].parentNode.remove();
        }
        let adTiles = document.querySelectorAll("#content .gallery .c-tile[title='']");
        for(let i = 0, count = adTiles.length; i < count; i++)
        {
            adTiles[i].remove();
        }
    }

    if(fixSomeObviousProblems) {
        addGlobalStyle(`
           html, body, #ractive-body, #b-wrapper { min-height: 100vh !important; }
        `);
    }

    //Comic viewer page
    if(window.location.href.includes("/comics/picture/")) {
        if(expandImagesToScreenHeight) {
            addGlobalStyle(".show-tablet.block { display: none !important; }");
            var img = document.getElementsByClassName("photo")[0].getElementsByTagName("img")[0];
            var nativeImgHeight = img.clientHeight;

            SetImageSizing();
            setInterval(SetImageSizing, 200);
        }

        if(hideTitleAttributeFromImages) {
            document.querySelector(".photo > a").setAttribute("title", "");
            let target = document.querySelector(".photo > meta");
            let observer = new MutationObserver(() => {
                document.querySelector(".photo > a").setAttribute("title", "");
            });
            observer.observe(target, {attributes: true});
        }

        if(moveBreadcrumbsAndHideHeaderOnImages) {
            addGlobalStyle(`
               #top-menu, #left-menu-close { display: none; }
               #left-menu, #left-menu.force-open, #b-wrapper { padding-top: 0; }
               #newBreadcrumb li { line-height: 1.2em; padding: 0 10px; }
               #newBreadcrumb ol { list-style: none; padding: 10px 0; }
               #content[style*="display: inline-block;"] .photo img { max-height: calc(100vh) !important; }
            `);

            var breadcrumb = document.querySelector(".top-menu-breadcrumb").cloneNode(true);
            breadcrumb.setAttribute("id", "newBreadcrumb");
            document.querySelector(".menu-items > .menu-logo").className = "";

            let beforeTarget = document.querySelector(".page-select");
            beforeTarget.parentNode.insertBefore(breadcrumb, beforeTarget);

            var lis = document.getElementById("newBreadcrumb").getElementsByTagName("li");
            for(let i = 0; i < lis.length; i++)
            {
                if(i != 0)
                    lis[i].insertBefore(document.createTextNode("⤷ "), lis[i].firstChild);
            }
        }
    }

    function SetImageSizing()
    {
        img.style.objectFit = "contain";
        img.style.objectPosition = "top";
        img.style.width = "100%";
        //alert("nativeImgHeight: " + nativeImgHeight + ", window.innerHeight: " + window.innerHeight);
        img.style.height = ((nativeImgHeight > (window.innerHeight - (moveBreadcrumbsAndHideHeaderOnImages ? 0 : 50))) ? nativeImgHeight : (window.innerHeight - (moveBreadcrumbsAndHideHeaderOnImages ? 0 : 50))) + "px";
    }

    function AddRemoveFromMAR(url) {
        //refresh current state of MAR
        MarkedAsSeenString = GM_getValue("MarkedAsSeenString", "[]");
        MarkedAsSeen = JSON.parse(MarkedAsSeenString);

        //remove or add item
        if(MarkedAsSeen.includes(url)) {
            //remove
            MarkedAsSeen.splice(MarkedAsSeen.indexOf(url), 1);
            document.getElementById("MARElem").innerHTML = "Mark this page as seen";
        }
        else {
            //add
            MarkedAsSeen.push(url);
            document.getElementById("MARElem").innerHTML = "Mark this page as unseen";
        }

        //update MAR
        MarkedAsSeenString = JSON.stringify(MarkedAsSeen);
        GM_setValue("MarkedAsSeenString", MarkedAsSeenString);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();