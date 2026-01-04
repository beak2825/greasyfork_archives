// ==UserScript==
// @name         Novel Updates Filter Result by Country
// @namespace    https://github.com/TigorLazuardi/novel-updates-filter
// @include      https://www.novelupdates.com/genre/*
// @include      https://www.novelupdates.com/novelslisting/*
// @include      https://www.novelupdates.com/series-ranking/*
// @include      https://www.novelupdates.com/stag/*
// @include      https://www.novelupdates.com/series-finder/*
// @include      https://www.novelupdates.com/latest-series/*
// @include      https://www.novelupdates.com/viewlist/*
// @match        https://www.novelupdates.com/
// @version      1.2.0
// @description  Filters novel update result by country
// @run-at       document-end
// @inject-into  content
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @homepageURL  https://github.com/TigorLazuardi/novel-updates-filter
// @supportURL   https://github.com/TigorLazuardi/novel-updates-filter
// @downloadURL https://update.greasyfork.org/scripts/408524/Novel%20Updates%20Filter%20Result%20by%20Country.user.js
// @updateURL https://update.greasyfork.org/scripts/408524/Novel%20Updates%20Filter%20Result%20by%20Country.meta.js
// ==/UserScript==
// This script is written in typescript and thus ugly to read if read directly like this.
// Please refer to git page (the name space above) for the actual source code
var _a, _b, _c, _d, _e;
var origins = {
    Korea: 'orgkr',
    China: 'orgcn',
    Japan: 'orgjp',
    Indonesia: 'orgid',
    Malaysia: 'orgmy',
    Filipino: 'orgfil',
    Thailand: 'orgth',
    Vietnam: 'orgvn',
};
var mobileUgerAgents = {
    android: 'Android',
    ios: 'iPhone',
};
var desktopHome = document.querySelectorAll('.l-content table#myTable')[1];
var mobileHome = document.querySelectorAll('.tbl_m_release')[0];
var isMobile = false;
for (var useragent in mobileUgerAgents) {
    if (window.navigator.userAgent.toLowerCase().indexOf(useragent.toLowerCase()) !== -1) {
        isMobile = true;
        break;
    }
}
var injectLoc = (_c = (_b = (_a = mobileHome !== null && mobileHome !== void 0 ? mobileHome : desktopHome) !== null && _a !== void 0 ? _a : 
// Series Listing and Series Ranking
document.querySelector('.search_sort')) !== null && _b !== void 0 ? _b : 
// Series Finder and Latest Series
document.querySelector('#rankfilter')) !== null && _c !== void 0 ? _c : 
// Rec Lists
document.querySelector('.ucl_main');
function setDisplay(selector, display) {
    var el = document.querySelectorAll(selector);
    console.error(selector);
    el.forEach(function (e) {
        var parent;
        if (isMobile) {
            parent = e.parentElement.parentElement;
        }
        else {
            desktopHome
                ? (parent = e.parentElement.parentElement)
                : (parent = e.parentElement.parentElement.parentElement);
        }
        display ? parent.removeAttribute('style') : (parent.style.display = 'none');
    });
}
function toggleFilter() {
    var prev = GM_getValue(this.id, false);
    var show = !prev;
    if (isMobile) {
        mobileHome
            ? setDisplay(".l-submain-h > table.tbl_m_release ." + origins[this.id], show)
            : setDisplay("." + origins[this.id], show);
    }
    else {
        desktopHome
            ? setDisplay(".l-content > table#myTable ." + origins[this.id], show)
            : setDisplay("." + origins[this.id], show);
    }
    show ? (this.style.backgroundColor = 'white') : (this.style.backgroundColor = '#F9F871');
    GM_setValue(this.id, show);
}
var filterArea = document.createElement('div');
var filterLabel = document.createElement('p');
// Styling Blocklist text
filterLabel.innerHTML = '<b>Blocklist :</b>';
filterLabel.style.marginBottom = '0';
var selections = document.createElement('div');
// Making sure the chexboxes wrap well on small resolution screens
selections.style.display = 'flex';
selections.style.flexWrap = 'wrap';
for (var country in origins) {
    var show = GM_getValue(country, true);
    var item = document.createElement('div');
    var name_1 = document.createElement('p');
    name_1.style.marginBottom = '0';
    name_1.innerText = country;
    // Making sure checkbox is inline with label
    item.appendChild(name_1);
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'center';
    item.style.minWidth = '80px';
    item.style.backgroundColor = 'white';
    item.style.padding = '5px';
    item.style.marginBottom = '15px';
    item.style.marginTop = '5px';
    item.style.marginRight = '5px';
    item.style.cursor = 'pointer';
    item.style.borderRadius = '10px';
    item.style.border = '2px solid #7c5262';
    item.id = country;
    item.addEventListener('click', toggleFilter);
    setDisplay("." + origins[country], show);
    if (!show) {
        item.style.backgroundColor = '#f9f871';
    }
    selections.appendChild(item);
}
filterArea.appendChild(filterLabel);
filterArea.appendChild(selections);
// Styling
filterArea.style.marginTop = '25px';
filterArea.style.marginBottom = '25px';
filterArea.style.backgroundColor = '#DAE8EC';
filterArea.style.borderRadius = '10px';
filterArea.style.border = '2px solid #B8CB99';
filterArea.style.paddingLeft = '10px';
filterArea.style.paddingRight = '10px';
desktopHome || mobileHome
    ? (_d = injectLoc === null || injectLoc === void 0 ? void 0 : injectLoc.parentNode) === null || _d === void 0 ? void 0 : _d.insertBefore(filterArea, injectLoc) : (_e = injectLoc === null || injectLoc === void 0 ? void 0 : injectLoc.parentNode) === null || _e === void 0 ? void 0 : _e.insertBefore(filterArea, injectLoc.nextSibling);
