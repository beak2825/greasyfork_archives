// ==UserScript==
// @name         Unity Docs Version Switcher
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adds a version dropdown, forcefully redirect to older documentation versions from google
// @author       EntranceJew
// @match        https://docs.unity3d.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/32040/Unity%20Docs%20Version%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/32040/Unity%20Docs%20Version%20Switcher.meta.js
// ==/UserScript==
/*
0.2 - some weird style junk happened so i reorganized it, now the version dropdown is taller
0.1 - inital version
*/
/*
@TODO:
* gotta internalize the getVersion functions in order to work on older than 5.5 i think
*/

(function() {
    'use strict';

    var defaultVersion = GM_getValue("default_version", null);
    var cv = getCurrentVersion();
    var versionText = '';

    if( cv.major > 5 ){
        versionText = (cv.major + 2011) + "." + cv.minor;
    } else {
        versionText = cv.major + "." + cv.minor;
    }

    var vn = document.querySelector('.version-number');
    if( !vn ){
        vn = document.querySelector('.obsolete-version-number');
    }

    while (vn.firstChild) {
        vn.removeChild(vn.firstChild);
    }
    var dd = vn.appendChild(document.querySelector('.otherversionswrapper'));
    dd.style.float = "none";
    dd.querySelector('a').innerHTML = "Version: <b>" + versionText + "</b>";

    var changeDefault = document.createElement("a");
    changeDefault.addEventListener("click", switchListeners);
    function switchListeners(){
        var wr = (changeDefault.dataset.willRemove == "yeah");
        console.log(wr);
        if( wr ){
            delete changeDefault.dataset.willRemove;
            changeDefault.innerText = "Set Default";
            GM_setValue("default_version", null);
        } else {
            changeDefault.dataset.willRemove = "yeah";
            changeDefault.innerText = "Remove Default";
            GM_setValue("default_version", cv);
            defaultVersion = cv;
        }
    }

    var isDefault = (cv && defaultVersion && cv.major == defaultVersion.major && cv.minor == defaultVersion.minor);
    if( isDefault ){
        changeDefault.dataset.willRemove = "yeah";
        changeDefault.innerText = "Remove Default";
    } else {
        changeDefault.innerText = "Set Default";
    }
    dd.appendChild(document.createTextNode(" ("));
    dd.appendChild(changeDefault);
    dd.appendChild(document.createTextNode(")"));

    if( window.location.href != getTargetUrlFromVersion(cv.major, cv.minor, cv.page) ){
        if( !isDefault && defaultVersion !== null && cv.page ){
            window.location.href = getTargetUrlFromVersion(defaultVersion.major, defaultVersion.minor, cv.page);
        }
    }

    populateOtherVersionsContainer();
})();