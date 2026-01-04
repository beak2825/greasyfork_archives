// ==UserScript==
// @name         Profile Icons
// @namespace    icons.above.heasley
// @version      1.0
// @description  Duplicate player icons below player profile picture
// @author       Heasley
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470858/Profile%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/470858/Profile%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const profileObserver = new MutationObserver(function(mutations) {
        const iconEl = document.querySelector('.profile-container.basic-info > .icons');
        if (document.contains(iconEl)) {
            profileObserver.disconnect();
            iconObserver.observe(iconEl, {attributes: false, childList: true, characterData: false, subtree:true});
            duplicateIcons();
        }
    });

    //Any time the original icons are updated, we need to re-populate the duplicated icons
    const iconObserver = new MutationObserver(function(mutations) {
        duplicateIcons();
    });

    profileObserver.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
})();

//This is a function I found on stack overflow that finds the React component of a DOM element. We need this to get the props of the icons element
function FindReact(dom, traverseUp = 0) {
    const key = Object.keys(dom).find(key=>{
        return key.startsWith("__reactFiber$") // react 17+
        || key.startsWith("__reactInternalInstance$"); // react <17
    });
    const domFiber = dom[key];
    if (domFiber == null) return null;

    // react <16
    if (domFiber._currentElement) {
        let compFiber = domFiber._currentElement._owner;
        for (let i = 0; i < traverseUp; i++) {
            compFiber = compFiber._currentElement._owner;
        }
        return compFiber._instance;
    }

    // react 16+
    const GetCompFiber = fiber=>{
        //return fiber._debugOwner; // this also works, but is __DEV__ only
        let parentFiber = fiber.return;
        while (typeof parentFiber.type == "string") {
            parentFiber = parentFiber.return;
        }
        return parentFiber;
    };
    let compFiber = GetCompFiber(domFiber);
    for (let i = 0; i < traverseUp; i++) {
        compFiber = GetCompFiber(compFiber);
    }
    return compFiber.stateNode;
}

function duplicateIcons() {
    if ($('#obn-icons').length) $('#obn-icons').remove();

    const iconsElement = document.querySelector('.profile-container.basic-info > .icons');
    const iconComp = FindReact(iconsElement); //This copies the internal data of the icons with React, because it is not all available in the DOM

    if (!iconComp?.props && !iconComp.props?.icons) return;

    const icons = iconComp.props.icons;
    const clearEl = $('.profile-wrapper .user-information .cont > .clear');
    var iconsList = `<div id="obn-icons" class="icons"><ul class="row basic-info big svg">`;

    for (const [key, icon] of Object.entries(icons)) {
        let theTitle = icon?.description ? icon.description : icon.title;
        iconsList += `<li id="icon${icon.id}-profile-obn" class="user-status-${icon.id}-${icon.type} left" title="${theTitle}">`;
        if (icon?.url) iconsList += `<a href="${icon.url}"></a>`;
        iconsList += `</li>`;
    }

    iconsList += `</ul></div>`;

    clearEl.append(iconsList);
}
