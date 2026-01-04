// ==UserScript==
// @name             A Little ABC News
// @namespace        https://www.alittleresearch.com.au
// @version          2025-05-03
// @description      Remove undesired components from the ABC News web site.
// @author           Nick Sheppard
// @license          MIT
// @contributionURL  https://ko-fi.com/npsheppard
// @match            https://www.abc.net.au/news
// @icon             https://www.alittleresearch.com.au/sites/default/files/alriconbl-transbg-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534785/A%20Little%20ABC%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/534785/A%20Little%20ABC%20News.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2025 Nicholas Paul Sheppard. See README.md for details
//
// Buy me a Ko-Fi at https://ko-fi.com/npsheppard.
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//
// The ABC News site identifies some components by an ID, some by a class name,
// and some not at all. Each key of the siteConf structure identifies a
// component by (i) id if the key begins with #; (ii) class name if the key
// begins with .; or (iii) the conents of an <h2> element otherwise.
//
// The value for each key controls how that component will be rendered. Options
// are as follows:
//
// 'default': display as usual
// 'hidden': do not display
// 'compressed': show only the header, which can be expanded by clicking
// 'expanded': the same as 'expandable', but starting in the expanded state
//
// Note that the compressed/expanded state isn't saved between visits;
// re-loading the site resets the component to the state given here.
//
// This script ships with the settings that I prefer, but feel free to change
// them to your liking.
//
///////////////////////////////////////////////////////////////////////////////
const siteConf = {
    // Top Stories
    '#topStories': 'default',

    // State Top Storeis
    '#stateTopStories': 'default',

    // the fixed copy of Just In that appears at the top right)
    '#justIn': 'default',

    // Today's Topics
    '#todaysTopics': 'expanded',

    // For You
    'For You': 'compressed',

    // Local News
    '#localNews': 'default',

    // Video Shorts
    '#videoShorts': 'compressed',

    // More News
    '#moreNews': 'expanded',

    // Everyone's Talking About...
    '#theBigPicture': 'compressed',

    // Around Australia
    '#aroundAustralia': 'expanded',

    // Politics
    '#politics': 'expanded',

    // World
    '#world': 'expanded',

    // Business
    '#business': 'expanded',

    // Sport
    '#sport': 'expanded',

    // Lifestyle
    '#lifestyle': 'expanded',

    // Entertainment
    '#entertainment': 'expanded',

    // the floating copy of Just In box that sticks to the right when scrolling done
    '.Home_justin__mrrHu Home_justinSticky__EkueF': 'hidden',

    // the category headings that appear above each story
    '.Tag_container__7_5W6': 'default'
};

(function() {
    'use strict';

    // apply the configured renderer for every component in siteConf
    for (const key of Object.keys(siteConf)) {
        switch (siteConf[key]) {
        	case 'hidden':
        		applyRenderer(key, (element) => { renderHidden(element); });
        		break;

        	case 'compressed':
        		applyRenderer(key, (element) => { renderExpandable(element, true); });
        		break;

        	case 'expanded':
        		applyRenderer(key, (element) => { renderExpandable(element, false); });
        		break;

            case 'default':
                // do nothing
                break;

            default:
                console.log("Invalid value '" + siteConf[key] + "' for configuration key " + key);
                break;

        }

    }

})();


// Apply a renderer to all of the elements matching a given key from the
// siteConf structure.
//
// Input:
//   key - the key from the siteConf structure
//   render - a function taking a single DOMElement object as input
function applyRenderer(key, render) {

    if (key.charAt(0) === "#") {

        // component identified by id
        const element = document.getElementById(key.substring(1, key.length));
        if (element != null) {
            render(element);
        }

    } else if (key.charAt(0) === ".") {

        // component identified by class name
        const elements = document.getElementsByClassName(key.substring(1, key.length));
        if (elements != null) {
            for (let i = 0; i < elements.length; i++) {
                render(elements[i]);
            }
        }

    } else {

        // component identified by <h2>
        const headings = document.getElementsByTagName("H2");
        if (headings != null) {
            for (let i = 0; i < headings.length; i++) {
                if (headings[i].innerHTML === key) {
                    render(findRailRoot(headings[i]));
                }
            }
        }
    }

}


// Find the root element of a rail component associated with a given
// element. The rail component may either enclose the element, or be
// contained within the element.
//
// Input:
//  element (DOMElement) - an element with the rail component
//
// Returns: the root element of the rail component, or null if no element is found
function findRailRoot(element) {

    // first, search downwards for a rail component contained within the element
    let railRootElement = element;
    while (railRootElement != null && (!railRootElement.className == null || !railRootElement.className.startsWith("Rail_root__"))) {
        railRootElement = railRootElement.firstElementChild;
    }
    if (railRootElement != null) {
        return railRootElement;
    }

    // now search upwards for a rail component containing the element
    railRootElement = element;
    while (railRootElement != null && (!railRootElement.className == null || !railRootElement.className.startsWith("Rail_root__"))) {
        railRootElement = railRootElement.parentElement;
    }

    return railRootElement;

}

// Hide a component by setting its display style to "none".
//
// Input:
//   element (DOMElement) - the DOM element at the root of the component to be suppressed
//
function renderHidden(element) {

    element.style.display = "none";
}


// Make a "rail" component expandable. In the expanded state, the component
// displays as usual, but its header region changes colour when the cursor
// hovers over it. When clicked, the contents are hidden. Similarly, clicking
// on the header region in the compressed state re-expands the component.
//
// The general structure of a rail component is as follows, where the xxxxx's
// are code that differs from component to component but has no obvious
// meaning.
//
//
// <div id="..." or class="...">
//   <!-- sometimes a div contains the Rail_root -->
//     <div class="Rail_root__xxxxx Rail_sideScrolling__xxxxx">
//       <div class="Rail_header__xxxxx">
//         <h2>...</h2>
//         <div>...</div>
//       </div>
//       <div class="Rail_scollNavigation__xxxxx">
//         <button title="Move left"><svg .../></button>
//         <button title="Move right"><svg .../></button>
//       </div>
//       <div class="Rail_content__xxxxx">
//         <ul .../>
//       </div>
//     </div>
//   <!-- end of optional containing div -->
// </div>
//
// Input:
//   element (DOMElement) - the root element of the rail component to be suppressed
//   startCompressed (boolean) - true to start in the compressed state; false to start in the expanded state
function renderExpandable(element, startCompressed = false) {

    // find the rail root
    let railRootElement = findRailRoot(element);
    if (railRootElement == null) {
        // couldn't find the rail root; bail out
        console.log("Couldn't find the rail root for " + element);
        return;
    }

    // get the components of the rail root
    let railHeaderElement = null;
    let railNavigationElement = null;
    let railContentElement = null;
    let railChild = railRootElement.firstElementChild;
    while (railChild != null) {
        if(railChild.className != null) {
            if (railChild.className.startsWith("Rail_header__")) {
                railHeaderElement = railChild;
            } else if (railChild.className.startsWith("Rail_scollNavigation__")) {
                railNavigationElement = railChild;
            } else if (railChild.className.startsWith("Rail_content__")) {
                railContentElement = railChild;
            }
        }
        railChild = railChild.nextElementSibling;
    }

    // suppress display of the rail content
    if (railContentElement != null) {
        railContentElement.style.display = startCompressed ? "none" : "";
        if (railHeaderElement != null) {
            railHeaderElement.style.cursor = "zoom-in";
            railHeaderElement.style.borderRadius = "8px";
            railHeaderElement.onclick = function () {
                if (railContentElement.style.display === "none") {
                    railContentElement.style.display = "block";
                    railHeaderElement.style.cursor = "zoom-out";
                } else {
                    railContentElement.style.display = "none";
                    railHeaderElement.style.cursor = "zoom-in";
                }
            };
            railHeaderElement.onmouseover = function() {
              railHeaderElement.style.backgroundColor = 'var(--nw-colour-theme-surface-tint)';
            };
            railHeaderElement.onmouseout = function() {
              railHeaderElement.style.backgroundColor = 'white';
            };
        }
    }

}
