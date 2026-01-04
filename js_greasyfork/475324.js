// ==UserScript==
// @name         单机mode
// @namespace    sqrtwo
// @version      0.1
// @description  隐藏小组功能
// @author       neutrinoliu
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475324/%E5%8D%95%E6%9C%BAmode.user.js
// @updateURL https://update.greasyfork.org/scripts/475324/%E5%8D%95%E6%9C%BAmode.meta.js
// ==/UserScript==

const FLAG_KEY = 'BGM_STANDALONE_DENY';

(function() {
    if (addDockAndCheck()) {
        panelHide();
        aHide();
        listHide();
    }
})();

function checkStandAloneDenyFLAG() {
    return localStorage.getItem(FLAG_KEY);
}
function setStandAlloneDenyFLAG() {
    localStorage.setItem(FLAG_KEY, 'stand alone mode disabled');
}
function clearStandAlloneDenyFLAG() {
    localStorage.removeItem(FLAG_KEY);
}

function addDockAndCheck() {
    $('#dock').find('li:first-child')
        .after(`<li><a href="javascript:;" id="beStandAlone_toggle"></a></li>`)
    const dockBtn = $('#beStandAlone_toggle');
    const flag = checkStandAloneDenyFLAG();
    if (flag) {
        dockBtn.html('隐藏小组');
        dockBtn.on('click', (function(){
            clearStandAlloneDenyFLAG();
            location.reload(true);
        }));
    } else {
        dockBtn.html('还原小组');
        dockBtn.on('click', (function(){
            setStandAlloneDenyFLAG();
            location.reload(true);
        }));
    }
    return !flag;
}

function panelHide() {
    $('#home_grp_tpc').hide();
    $('#home_announcement').hide();
}

function aHide() {
    // Get all <a> elements on the page
    var links = document.getElementsByTagName("a");

    // Loop through the <a> elements and check their href attribute
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");

        // Check if the href attribute contains "/group"
        if (href && href.indexOf("/group") !== -1) {
            // Set the display property to "none"
            links[i].style.display = "none";
        }
    }
}

function listHide() {
       // Get all <li> elements on the page
    var listItems = document.getElementsByTagName("li");

    // Loop through the <li> elements
    for (var i = 0; i < listItems.length; i++) {
        var anchors = listItems[i].getElementsByTagName("a");
        var containsGroupHref = false;

        // Loop through the <a> elements within the current <li> element
        for (var j = 0; j < anchors.length; j++) {
            var href = anchors[j].getAttribute("href");

            // Check if the href attribute contains "/group"
            if (href && href.indexOf("/group") !== -1) {
                containsGroupHref = true;
                break; // Exit the loop since we found a match
            }
            break;
        }

        // If the current <li> element contains an <a> with "/group" in href, set its display to "none"
        if (containsGroupHref) {
            listItems[i].style.display = "none";
        }
    }
}