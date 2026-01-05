// ==UserScript==
// @name          Android Developer Console
// @description   Adds some links helpful to developers in the Android Market
// @include       https://play.google.com/*
// @match         https://play.google.com/*
// @version       5.1
// @author        Afzal Najam
// @changelog     Modified for new Play Store
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_deleteValue
// @grant         GM_log
// @namespace https://greasyfork.org/users/4370
// @downloadURL https://update.greasyfork.org/scripts/4035/Android%20Developer%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/4035/Android%20Developer%20Console.meta.js
// ==/UserScript==

myOrders = $('li[jsinstance ^="0"]');
if (myOrders) {
    listitem = document.createElement('div');
    listitem.className = 'leaf-submenu-link-wrapper';
    devlink = document.createElement('a');
    devlink.className = 'leaf-submenu-link';
    devlink.setAttribute('href', 'https://play.google.com/apps/publish/');
    devlink.setAttribute('target', '_blank');
    devlink.innerHTML = 'My developer console';

    listitem.appendChild(devlink);
    myOrders.after(listitem);
}

if (window.location.hash.indexOf("AppListPlace") > 0) {
    archiveItems();
}

function archiveItems() {
    updateP = $("p[data-column*='UPDATE']");

    if (updateP) {
        var archiveLink = $('<a>', {
            href: "#test",
            style: "background: no-repeat url(//ssl.gstatic.com/mail/sprites/general_black-16bf964ab5b51c4b7462e4429bfa7fe8.png) 0 -17px; width: 25px; height: 25px; display: inline-block; vertical-align: -50%;",
            onclick: "GM_setValue('hiddenApps', 'testing')",
        });
        updateP.prepend(archiveLink);
    } else {
        console.log("updateP not found");
    }
    var vals = [];
    var values = GM_listValues();
    for (var i = 0; i < values.length; i++) {
        vals.push(GM_getValue(GM_listValues()[i]));
    }
    GM_log(vals);
}

function resetArchived() {
    GM_deleteValue("hiddenApps");
}

function setArchived(appName) {
    GM_setValue("hiddenApps", appName);
}

function showStoreLink() {
    pubButton = $("button>*:contains('Published')");
    if (pubButton.length > 0) {
        appName = window.location.hash.split("=")[1];
        element = pubButton.parent().parent().parent().next().next();
        link = "https://play.google.com/store/apps/details?id=" + appName;
        element.html("- ");
        $('<a>', {
            text: appName,
            href: link,
        }).appendTo(element);
    }
}

function locationHashChanged() {
    locationHash = window.location.hash;
    if (locationHash.indexOf("AppListPlace") > 0) {
        console.log("archive icons");
        archiveItems();
    } else if (locationHash.indexOf(":p=") > 0) {
        showStoreLink();
    }
}

window.addEventListener("hashchange", locationHashChanged);
