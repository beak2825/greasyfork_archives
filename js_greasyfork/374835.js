// ==UserScript==
// @name WowTrustLevel
// @description Trust level for WoW forum
// @author DrunkPanda#21811
// @license MIT
// @version 1.3
// @include https://eu.forums.blizzard.com/ru/wow/*
// @namespace https://greasyfork.org/users/228661
// @downloadURL https://update.greasyfork.org/scripts/374835/WowTrustLevel.user.js
// @updateURL https://update.greasyfork.org/scripts/374835/WowTrustLevel.meta.js
// ==/UserScript==

var w;
var lastHref = '';
var processForumPageInterval;
var characterToProcessArray = [];

(function (window, undefined) {
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }

    if (w.self !== w.top) { return; }

    setInterval(doMaintenanceStorage(), 30*1000);

    setInterval(function () {
        if (lastHref !== w.location.href) {
            switch (w.document.readyState) {
                case 'interactive':
                case "complete":
                    lastHref = w.location.href;
                    console.log('Reloading.');
                    main();
                    break;
                default:
                    console.log('Not yet loading.');
            }
        }
    }, 500);

})(window);

function main() {
    if (/https:\/\/eu.forums.blizzard.com\/..\/wow\/t\//.test(w.location.href)) {
        if (!processForumPageInterval) { processForumPageInterval = setInterval(doProcessForumPage(), 1000); }
    } else if (/https:\/\/eu.forums.blizzard.com\/..\/wow\/u\//.test(w.location.href)) {
        clearInterval(processForumPageInterval);
        processForumPageInterval = false;
        doProcessUserPage();
    } else {
        clearInterval(processForumPageInterval);
        processForumPageInterval = false;
    }
}

function doProcessUserPage() {
    setTimeout(() => {
        var userR = w.location.href.match(/[\d\w%]+-[\d\w%-]+/gm);
        if (userR === null) {
            console.log('Cant parse address. (maybe CS)');
            return;
        } else {
            console.log('User: ' + decodeURI(userR[0]).toLowerCase());
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    var tl = getTrustLevelFromJsonData(xmlHttp.responseText);
                    localStorage.setItem('cache_' + decodeURI(userR[0]).toLowerCase(), JSON.stringify({ l:tl, t:Math.trunc(Date.now()/1000)}));
                    w.document.getElementsByClassName('user-profile-avatar')[0].children[0].style.boxShadow = getStyleFromLevel(tl);
                    if (tl >= 0 && w.document.getElementsByClassName('trust-level').length === 0) {
                        w.document.getElementsByClassName('user-post-names-outlet')[0].innerHTML += '<div class="secondary-details trust-level" id=><span>Trust level: ' + tl + '</span></div>';
                    }
                }
            };
            xmlHttp.open("GET", 'https://eu.forums.blizzard.com/ru/wow/u/' + userR[0] + '.json', true); // true for asynchronous
            xmlHttp.send(null);
        }
    }, 0);
}

function doProcessForumPage() {
    setTimeout(() => {
        Array.from(document.getElementsByClassName('topic-post')).forEach(function(elem) {
            var char = elem.getElementsByClassName('character-name')[0].href.match(/[\d\w%]+-[\d\w%-]+/gm);
            if (char !== null) {
                if (!characterToProcessArray.includes(decodeURI(char[0]).toLowerCase())) {
                    characterToProcessArray.push(decodeURI(char[0]).toLowerCase());
                }
            }
        });
        while(characterToProcessArray.length > 0) {
            doForumPageUser(characterToProcessArray.pop());
        }
    }, 0);


    return doProcessForumPage;
}

function doForumPageUser(userName) {
    var userTrustLevel = getCacheUserTrustLevel(userName);
    if (userTrustLevel !== null) {
        doForumPageUserToStyle(userName, userTrustLevel);
    } else {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                var tl = getTrustLevelFromJsonData(xmlHttp.responseText);
                localStorage.setItem('cache_' + decodeURI(userName).toLowerCase(), JSON.stringify({ l:tl, t:Math.trunc(Date.now()/1000)}));
                doForumPageUserToStyle(userName, tl);
            }
        };
        xmlHttp.open("GET", 'https://eu.forums.blizzard.com/ru/wow/u/' + userName + '.json', true); // true for asynchronous
        xmlHttp.send(null);
    }
}

function doForumPageUserToStyle(userName, userTrustLevel) {
    if (userTrustLevel < -1) { return; }
    Array.from(w.document.getElementsByClassName('topic-post')).forEach( function(element) {
        var elementAvatar = element.getElementsByClassName('main-avatar')[0];
        if (decodeURI(elementAvatar.href.split('/').pop()).toLowerCase() == userName) {
            if (element.getElementsByClassName('trust-level').length === 0) {
                if (userTrustLevel < 0) {
                    element.getElementsByClassName('secondary-details')[0].innerHTML += '<div class="trust-level"><h5>. Trust level: hidden</h5></div>';
                } else {
                    element.getElementsByClassName('secondary-details')[0].innerHTML += '<div class="trust-level"><h5>. Trust level: ' + userTrustLevel + '</h5></div>';
                }
                elementAvatar.children[0].style.boxShadow = getStyleFromLevel(userTrustLevel);
            }
        }
    });
}

function getCacheUserTrustLevel(userName) {
    if (localStorage.getItem('cache_' + userName) !== null) {
        return JSON.parse(localStorage.getItem('cache_' + userName)).l;
    }
    return null;
}

function doMaintenanceStorage() {
    for (var nKey = 0; nKey < localStorage.length; nKey++) {
        var key = localStorage.key(nKey);
        if (key.substring(0, 6) === "cache_") {
            if ((Math.trunc(Date.now() / 1000) - JSON.parse(localStorage.getItem(key)).t) > (24 * 3600)) {
                console.log("Item removed: " + key);
                localStorage.removeItem(key);
                nKey--;
            }
        }
    }
    return doMaintenanceStorage;
}

function getStyleFromLevel(level) {
    switch (level) {
        case -1:
            return '0 0 0 1px rgba(255,255,255,0.3), 0 0 0 1px #ff5555, 0 0 0 2px black';
        case 1:
            return '0 0 0 1px rgba(255,255,255,0.3), 0 0 0 1px #ffffff, 0 0 0 2px black';
        case 2:
            return '0 0 0 1px rgba(255,255,255,0.3), 0 0 0 1px #ffffff, 0 0 0 2px black, 0 0 7px 4px rgba(255, 255, 255, 0.3)';
        case 3:
            return '0 0 0 1px rgba(255,255,255,0.3), 0 0 0 1px #ffffff, 0 0 0 2px black, 0 0 7px 4px rgba(255, 255, 255, 1)';
        default:
            return '';
    }
}

function getTrustLevelFromJsonData(JsonData) {
    var dataparsed = JSON.parse(JsonData);
    var trustlevel = -1;
    if (typeof (dataparsed.user.groups) === 'object') {
        dataparsed.user.groups.forEach(function (item) {
            trustlevel = parseInt(item.name.substr(item.name.length - 1));
        });
    }
    if (dataparsed.user.primary_group_name !== null) trustlevel = -2;
    return trustlevel;
}
