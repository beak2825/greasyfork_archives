// ==UserScript==
// @name        Stig's Flickr Fixr
// @namespace   dk.rockland.userscript.flickr.fixr
// @description Show photographer's albums on photostream-pages, Photographer's other photos by tag-links, Links to album-map and album-comments, Actually show a geotagged photo on the associated map, Top-pagers - And more...
// @author      Stig Nygaard, https://www.rockland.dk, https://www.flickr.com/photos/stignygaard/
// @homepageURL https://www.flickr.com/groups/flickrhacks/discuss/72157655601688753/
// @supportURL  https://www.flickr.com/groups/flickrhacks/discuss/72157655601688753/
// @icon        https://raw.githubusercontent.com/StigNygaard/Stigs_Flickr_Fixr/master/WebExtension/icons/fixr32.png
// @icon64      https://raw.githubusercontent.com/StigNygaard/Stigs_Flickr_Fixr/master/WebExtension/icons/fixr64.png
// @match       https://*.flickr.com/*
// @match       *://*.flickr.net/*
// @exclude     *://api.flickr.com/*
// @exclude     *://identify.flickr.com/*
// @exclude     *://*.flickr.com/signin/*
// @exclude     *://*.flickr.com/signup/*
// @exclude     *://*.flickr.com/account/*
// @version     2022.12.26.1
// @run-at      document-start
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/12008/Stig%27s%20Flickr%20Fixr.user.js
// @updateURL https://update.greasyfork.org/scripts/12008/Stig%27s%20Flickr%20Fixr.meta.js
// ==/UserScript==

// CHANGELOG - The most recent or important updates/versions:
const changelog = [
    {version: '2022.12.26.1', description: 'Last version of the userscript. You should make the switch to the "native" browser-extension versions instead, which is available for Chrome, Edge and Firefox compatible webbrowsers.'},
    {version: '2022.10.29.1', description: 'For webextension, optionally make sidebar in searchresults collapsible. Collapsible sidebar feature not available in userscript version.'},
    {version: '2022.06.19.0', description: 'Remove the photo upscale feature. Not so relevant/important anymore, and very was very unreliable (sensitive to site changes). Lots of old ugly code I got rid of there... '},
    {version: '2022.01.23.0', description: 'New feature: Control slideshow speed (Supported in webextension - not supported in userscript version of Flickr Fixr)'},
    {version: '2020.06.22.0', description: 'Removing 90% of map-fix for showing geolocation of a photo. Finally Flickr has mostly fixed issue themselves. Restoring insertion of Google Maps link which broke by the Flickr update.'},
    {version: '2020.06.21.0', description: 'A little bit of cleaning, a warning to userscript users - and "sub-options" for the tag-links feature (in webextension version)'},
    {version: '2019.10.19.0', description: 'Adjusting to Flickr 2019 updates.'},
    {version: '2018.11.29.0', description: 'New feature: Show available RSS/Atom newsfeeds on pages.'},
    {version: '2018.10.15.1', description: 'Add Options page to Firefox and Chrome browser extensions, to enable or disable individual features of Flickr Fixr (Userscript version is still all or nothing).'},
    {version: '2018.10.15.0', description: 'New feature: Added Collections and Map to topmenus.'},
    {version: '2018.08.19.0', description: 'New features: Added link leading to Tags page in topmenus. Added display of full Taken and Upload time, plus link for photographer\'s other photos from (approx.) same day.'},
    {version: '2018.05.20.0', description: 'New feature: Added a subtle warning if photostreams are shown in Date-taken order instead of Date-uploaded order.'},
    {version: '2017.07.31.0', description: 'New feature: Adding a Google Maps link on geotagged photos. Also: Removing unused code. Development code now in GitHub repository: https://github.com/StigNygaard/Stigs_Flickr_Fixr'},
    {version: '2016.03.11.1', description: 'New features: A link to "recent uploads page" added on the Explore page. Ctrl-click fix for opening tabs in background on search pages (Firefox-only problem?).'},
    {version: '2016.02.09.0', description: 'New feature: Link to Explore Calendar added to Explore page.'},
    {version: '2016.02.06.2', description: 'New feature: Top-pagers! Hover the mouse in the center just above photostreams to show a pagination-bar.'},
    {version: '2015.11.28.1', description: 'New feature: Album-headers are now updated with links to album-map and album-comments.'},
    {version: '2015.08.26.4', description: 'Initial userscript release version. Photo scale/replace, album column and tag-link feature.'}
];

const DEBUG = false;

function log(...s) {
    if (DEBUG && console) {
        console.log(...s);
    }
}

if (DEBUG) {
    if ('loading' === document.readyState) {
        log("This script is running at document-start time.");
    } else {
        log("This script is running with document.readyState: " + document.readyState);
    }
    window.addEventListener('DOMContentLoaded', function () {
        log('(onDOMContentLoaded)');
    }, false);
    window.addEventListener('focus', function () {
        log('(onfocus)');
    }, false);
    window.addEventListener('load', function () {
        log('(onload)');
    }, false);
    window.addEventListener('pageshow', function () {
        log('(onpageshow)');
    }, false);
    window.addEventListener('resize', function () {
        log('(onresize)');
    }, false);
    window.addEventListener('hashchange', function () {
        log('(onhashchange)');
    }, false);
    window.addEventListener('blur', function () {
        log('(onblur)');
    }, false);
}


// FIXR page-tracker
var fixr = fixr || {
    context: {
        pageType: '',
        pageSubType: '',
        userId: '',
        photographerId: '', // value might be delayed (If uninitialized, try call initPhotographerId())
        photographerIcon: '',
        photographerAlias: '', // (pathalias) bonus-info sometimes initialized (from url) when initializing photoId or albumId
        photographerName: '',
        photoId: '',
        albumId: '',
        groupId: '',
        galleryId: ''
    },
    content: null,
    pageactionsCount: 0,
    timerResizeActionDelayed: 0,
    onPageHandlers: [],
    onResizeHandlers: [],
    onFocusHandlers: [],
    onStandaloneHandlers: [],
    runningDirty: function () { // In-development and extra experiments enabled?
        return (DEBUG && (fixr.context.userId === '10259776@N00'));
    },
    timer: {
        _test: 0 // TODO
    },
    style: {
        _declarations: '',
        add: function (decl) {
            fixr.style._declarations += decl + ' ';
        },
        init() {
            if (!document.getElementById('fixrStyle')) {
                let styleElem = createRichElement('style', {
                    type: 'text/css',
                    id: 'fixrStyle'
                }, fixr.style._declarations);
                document.getElementsByTagName('head')[0].appendChild(styleElem);
                log('fixrStyle has been ADDED');
            } else {
                log('fixrStyle was already present');
            }
        }
    },
    clock: {
        _d: null,
        _pst: null, // Pacific Standard Time
        _explore: null,
        tick: function () {
            this._d = new Date();
            this._pst = new Date(this._d);
            this._pst.setHours(this._d.getHours() - 8); // PST = UTC-08
            this._explore = new Date(this._d);
            this._explore.setHours(this._d.getHours() - 28); // Explore beat, yesterday UTC-4
            // this._y.setDate(this._y.getDate() - 1);
            return this._pst;
        },
        pst: function () { // yyyy-mm-dd tt:mm PST
            return (this._pst || this.tick()).toISOString().substring(0, 16).replace('T', ' ') + ' PST';
        },
        explore: function () { // yyyy-mm-dd tt:mm Explore beat!
            if (this._explore === null) {
                this.tick();
            }
            return this._explore.toISOString().substring(0, 16).replace('T', ' ') + ' Explore beat!';
        }
    },
    isWebExtension: function () {
        return (typeof GM_info === 'undefined') && (typeof GM === 'undefined');
    },
    isUserscript: function () {
        return !fixr.isWebExtension();
    },
    initUserId: function () {
        if (window.auth?.user?.nsid) {
            fixr.context.userId = window.auth.user.nsid;
            return true;
        }
        return false;
    },
    initPhotographerName: function () {
        if (fixr.content.querySelector('a.owner-name')) {
            fixr.context.photographerName = fixr.content.querySelector('a.owner-name').innerText;
            return true;
        }
        return false;
    },
    initPhotographerId: function () { // photographer/attribution id

        // todo: This needs a rewrite some day...

        let elem;
        if (document.querySelector('div.photostream-page-view')) {
            // photostream
            elem = document.querySelector('div.photostream-page-view div.fluid-photostream-coverphoto-view .avatar.person');
        } else if (document.querySelector('div.photo-page-scrappy-view')) {
            // photopage
            elem = document.querySelector('div.photo-page-scrappy-view div.sub-photo-view .photo-attribution .avatar.person');
        } else if (document.querySelector('div.photo-page-lightbox-scrappy-view')) {
            // photopage lightbox
            elem = document.querySelector('div.photo-page-lightbox-scrappy-view div.photo-well-view .photo-attribution .avatar.person');
        } else if (document.querySelector('div.album-page-view')) {
            // album page
            elem = document.querySelector('div.album-page-view div.album-container div.album-header-view .album-attribution .avatar.person');
        } else if (document.querySelector('div.coverphoto-content .avatar.person')) {
            // fallback, modern design pages
            elem = document.querySelector('div.coverphoto-content .avatar.person');
        } else if (document.querySelector('div.subnav-middle div.sn-avatar > img')) {
            // fallback, old design pages
            elem = document.querySelector('div.subnav-middle div.sn-avatar > img');
        } else {
            log('fixr.initPhotographerId() - We do not look for photographerId on this page');
            return true;
        }
        if (!elem) {
            log('fixr.initPhotographerId() - Attribution elem NOT found - returning false');
            return false;
        } // re-run a little later???
        log('fixr.initPhotographerId() - Attribution elem found');
        let result;
        if (elem.tagName.toUpperCase() === 'IMG' && elem.src) {
            result = elem.src.match(/https:(\/\/[^#\?]+\.com\/[^#\?]+\/buddyicon[^\?\#]+)[^#]*#(\d+\@N\d{2})/i);
        } else if (elem.style.backgroundImage) {
            log('fixr.initPhotographerId() - elem has style.backgroundImage "' + elem.style.backgroundImage + '", now looking for the attribution id...');
            // var pattern = /\/buddyicons\/(\d+\@N\d{2})\D+/i;
            result = elem.style.backgroundImage.match(/url[^#\?]+(\/\/[^#\?]+\.com\/[^#\?]+\/buddyicon[^\?\#]+)[^#]*#(\d+\@N\d{2})/i);
        }
        if (result) {
            log('fixr.initPhotographerId() - Attribution pattern match found: ' + result[0]);
            log('fixr.initPhotographerId() - the attribution icon is ' + result[1]);
            log('fixr.initPhotographerId() - the attribution id is ' + result[2]);
            fixr.context.photographerIcon = result[1];
            fixr.context.photographerId = result[2];
            log('fixr.initPhotographerId() - returning true...');
            return true;
        } else {
            log('fixr.initPhotographerId() - attribution pattern match not found');
            return false;
        }
    },
    initPhotoId: function () { // Photo Id
        //  *flickr.com/photos/user/PId/*
        const pattern = /^\/photos\/([^\/]+)\/([\d]{2,})/i;
        const result = window.location.pathname.match(pattern);
        if (result) {
            log('url match med photoId=' + result[2]);
            log('url match med photographerAlias=' + result[1]);
            fixr.context.photoId = result[2];
            fixr.context.photographerAlias = result[1];
            return true;
        } else {
            log('*** initPhotoId() returnerer false! reg-pattern fandt ikke match i pathname=' + window.location.pathname);
        }
        return false;
    },
    initAlbumId: function () {
        //  *flickr.com/photos/user/albums/AId/*
        //  *flickr.com/photos/user/sets/AId/*
        let pattern = /^\/photos\/([^\/]+)\/albums\/([\d]{2,})/i;
        let result = window.location.pathname.match(pattern);
        if (!result) {
            pattern = /^\/photos\/([^\/]+)\/sets\/([\d]{2,})/i;
            result = window.location.pathname.match(pattern);
        }
        if (result) {
            log('url match med albumId=' + result[2]);
            log('url match med photographerAlias=' + result[1]);
            fixr.context.albumId = result[2];
            fixr.context.photographerAlias = result[1];
            return true;
        }
        return false;
    },
    pageActions: function () {
        fixr.clock.tick();
        if (fixr.content) {
            log('fixr.pageActions() has started with fixr.content defined');
        } else {
            log('fixr.pageActions() was called, but fixr.content NOT defined');
            return;
        }
        fixr.pageactionsCount++;
        for (let p in fixr.context) {  // reset context on new page
            if (fixr.context.hasOwnProperty(p)) {
                fixr.context[p] = '';
            }
        }
        if (fixr.content.querySelector('div.photostream-page-view')) {
            if (fixr.content.querySelector('div.slideshow-view')) {
                fixr.context.pageType = 'PHOTOSTREAM SLIDESHOW';
            } else {
                fixr.context.pageType = 'PHOTOSTREAM';
            }
        } else if (fixr.content.querySelector('div.photo-page-scrappy-view')) {
            fixr.context.pageType = 'PHOTOPAGE';
            if (fixr.content.querySelector('div.vr-overlay-view') && fixr.content.querySelector('div.vr-overlay-view').hasChildNodes()) {
                fixr.context.pageSubType = 'VR'; // maybe I can find a better way to detect, not sure how reliable this is?
            } else if (fixr.content.querySelector('div.videoplayer')) {
                fixr.context.pageSubType = 'VIDEO';
            } else {
                fixr.context.pageSubType = 'PHOTO';
            }
        } else if (fixr.content.querySelector('div.photo-page-lightbox-scrappy-view')) {
            fixr.context.pageType = 'PHOTOPAGE LIGHTBOX';
            if (fixr.content.querySelector('div.vr-overlay-view') && fixr.content.querySelector('div.vr-overlay-view').hasChildNodes()) {
                fixr.context.pageSubType = 'VR'; // VR-mode currently not supported in lightbox?
            } else if (fixr.content.querySelector('div.videoplayer')) {
                fixr.context.pageSubType = 'VIDEO';
            } else {
                fixr.context.pageSubType = 'PHOTO';
            }
        } else if (fixr.content.querySelector('div.albums-list-page-view')) {
            fixr.context.pageType = 'ALBUMSLIST';
        } else if (fixr.content.querySelector('div.album-page-view')) {
            if (fixr.content.querySelector('div.slideshow-view')) {
                fixr.context.pageType = 'ALBUM SLIDESHOW';
            } else {
                fixr.context.pageType = 'ALBUM';
            }
        } else if (fixr.content.querySelector('div.cameraroll-page-view')) {
            fixr.context.pageType = 'CAMERAROLL';
        } else if (fixr.content.querySelector('div.explore-page-view')) {
            fixr.context.pageType = 'EXPLORE';
        } else if (fixr.content.querySelector('div.favorites-page-view')) {
            if (fixr.content.querySelector('div.slideshow-view')) {
                fixr.context.pageType = 'FAVORITES SLIDESHOW';
            } else {
                fixr.context.pageType = 'FAVORITES';
            }
        } else if (fixr.content.querySelector('div.groups-list-view')) {
            fixr.context.pageType = 'GROUPSLIST'; // personal grouplist
        } else if (fixr.content.querySelector('div#activityFeed')) { // id=main i stedet for id=fixr.content
            fixr.context.pageType = 'ACTIVITYFEED'; // aka. front page -> UPDATES ?
        } else if (fixr.content.querySelector('div#allsizes-photo')) {
            fixr.context.pageType = 'SIZES'; // View all sizes - page
        } else if (fixr.content.querySelector('div.search-photos-unified-page-view')) {
            fixr.context.pageType = 'SEARCHRESULTPHOTOS';
        } else if (fixr.content.querySelector('div.search-people-page-view')) {
            fixr.context.pageType = 'SEARCHRESULTPEOPLE';
        } else if (fixr.content.querySelector('div.search-groups-page-view')) {
            fixr.context.pageType = 'SEARCHRESULTGROUPS';
        } else {
            // fixr.context.pageType = ''; // unknown
        }

        log('fixr.context.pageType = ' + fixr.context.pageType);
        log('fixr.context.pageSubType = ' + fixr.context.pageSubType);
        if (fixr.initUserId()) {
            log('fixr.initUserId() returned with succes: ' + fixr.context.userId);
        } else {
            log('fixr.initUserId() returned FALSE!');
        }
        if (fixr.initPhotographerId()) {
            log('fixr.initPhotographerId() returned true in first try...');
        } else {
            log('fixr.initPhotographerId() returned false - re-running delayed...');
            setTimeout(fixr.initPhotographerId, 1800);
        }
        if (fixr.initPhotoId()) {
            log('fixr.initPhotoId() returned true in first try...');
        } else {
            log('fixr.initPhotoId() returned false - re-running delayed...');
            setTimeout(fixr.initPhotoId, 1500);
        }
        if (fixr.initAlbumId()) {
            log('fixr.initAlbumId() returned true in first try...');
        }
        if (fixr.initPhotographerName()) {
            log('fixr.initPhotographerName() returned true in first try...');
        } else {
            setTimeout(fixr.initPhotographerName, 1500);
        }

        // Now run the page handlers....
        if (fixr.onPageHandlers && fixr.onPageHandlers.length) {
            log('We have ' + fixr.onPageHandlers.length + ' onPage handlers starting now...');
            for (let f = 0; f < fixr.onPageHandlers.length; f++) {
                fixr.onPageHandlers[f]();
            }
        }
    },
    setupContent: function () {
        if (document.getElementById('content')) {
            fixr.content = document.getElementById('content');
        } else if (document.getElementById('main')) {
            fixr.content = document.getElementById('main');    // frontpage
        }
        if (fixr.content?.id) {
            log('fixr.content.id = ' + fixr.content.id);
        } else {
            log('content or main element NOT found!');
        }
    },
    runPageActionsIfMissed: function () {
        if (fixr.pageactionsCount === 0) {
            log('Vi kører fixr.pageActions() på bagkant via onload...');
            fixr.setupContent();
            if (fixr.content === null) {
                log('Vi kan IKKE køre fixr.pageActions() på bagkant, da fixr.content ikke er defineret');
                return;
            }
            fixr.pageActions();
        } else {
            log('ej nødvendigt at køre fixr.pageActions() på bagkant i dette tilfælde...');
        }
    },
    runIfStandalonePage: function () {
        if (fixr.content === null && fixr.pageactionsCount === 0) { // if really looks like a "standalone page"...
            // Now run the standalone handlers
            if (fixr.onStandaloneHandlers && fixr.onStandaloneHandlers.length) {
                log('We have ' + fixr.onStandaloneHandlers.length + ' standalone handlers starting now...');
                for (let f = 0; f < fixr.onStandaloneHandlers.length; f++) {
                    fixr.onStandaloneHandlers[f]();
                }
            }
        }
    },
    runDelayedPageActionsIfMissed: function () {
        setTimeout(fixr.runPageActionsIfMissed, 2000);
        setTimeout(fixr.runIfStandalonePage, 500);
    },
    resizeActions: function () {
        if (fixr.onResizeHandlers  && fixr.onResizeHandlers.length) {
            for (let f = 0; f < fixr.onResizeHandlers.length; f++) {
                fixr.onResizeHandlers[f]();
            }
        }
    },
    resizeActionsDelayed: function () { // or "preburner"
        clearTimeout(fixr.timerResizeActionDelayed);
        fixr.timerResizeActionDelayed = setTimeout(fixr.resizeActions, 250);
    },
    focusActions: function () {
        if (fixr.onFocusHandlers && fixr.onFocusHandlers.length) {
            for (let f = 0; f < fixr.onFocusHandlers.length; f++) {
                fixr.onFocusHandlers[f]();
            }
        }
    },
    setupObserver: function () {
        log('fixr.setupObserve INITIALIZATION START');
        fixr.setupContent();
        if (fixr.content === null) {
            log('Init fails because content not defined');
            return;
        }
        // create an observer instance
        let observer = new MutationObserver(function (mutations) {
            log('NEW PAGE MUTATION!');
            //mutations.forEach(function(mutation) {
            //  log('MO: '+mutation.type); // might check for specific type of "mutations" (MutationRecord)
            //});
            fixr.pageActions();
        }); // MutationObserver end
        // configuration of the observer:
        let config = {attributes: false, childList: true, subtree: false, characterData: false};
        observer.observe(fixr.content, config);
        log('fixr.setupObserve INITIALIZATION DONE');
    },
    init: function (runNow, onPageHandlerArray, onResizeHandlerArray, onFocusHandlerArray, onStandaloneHandlerArray) {
        // General page-change observer setup:
        if (document.readyState === 'interactive') { // already late?
            fixr.setupObserver();
        }
        window.addEventListener('DOMContentLoaded', fixr.setupObserver, false); // Page on DOMContentLoaded
        window.addEventListener('load', fixr.runDelayedPageActionsIfMissed, false); // Page on load
        window.addEventListener('resize', fixr.resizeActionsDelayed, false); // også på resize
        window.addEventListener('focus', fixr.focusActions, false);
        if (onPageHandlerArray && onPageHandlerArray.length) {
            fixr.onPageHandlers = onPageHandlerArray; // Replace by adding with a one-by-one by "helper" for flexibility?
        }
        fixr.onPageHandlers.push(fixr.style.init); //  styles
        if (onResizeHandlerArray && onResizeHandlerArray.length) {
            fixr.onResizeHandlers = onResizeHandlerArray; // Replace by adding with a one-by-one by "helper" for flexibility?
        }
        if (onFocusHandlerArray && onFocusHandlerArray.length) {
            fixr.onFocusHandlers = onFocusHandlerArray;
        }
        if (onStandaloneHandlerArray && onStandaloneHandlerArray.length) { // on standalone pages, not part of "single page application"
            fixr.onStandaloneHandlers = onStandaloneHandlerArray;
            fixr.onStandaloneHandlers.push(fixr.style.init); //  styles
        }

        if (runNow && runNow.length) {
            log('We have ' + runNow.length + ' early running methods starting now at document.readyState = ' + document.readyState);
            for (let f = 0; f < runNow.length; f++) {
                runNow[f]();
            }
        }
    }
};
// FIXR page-tracker end


const fkey = "9b8140dc97b93a5c80751a9dad552bd4"; // This api key is for Flickr Fixr only. Get your own key for free at https://www.flickr.com/services/apps/create/

function escapeHTML(str) {
    return str.replace(/[&"'<>]/g, (m) => ({"&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;"})[m]);
}

function createRichElement(tagName, attributes, ...content) {
    let element = document.createElement(tagName);
    if (attributes) {
        for (const [attr, value] of Object.entries(attributes)) {
            element.setAttribute(attr, value);
        }
    }
    if (content?.length) {
        element.append(...content);
    }
    return element;
}

function insertGMapLink() {
    if (fixr.context.pageType !== 'PHOTOPAGE') {
        return; // exit if not photopage
    }
    log('insertGMapLink() running at readystate=' + document.readyState + ' and with photoId=' + fixr.context.photoId);
    if (fixr.context.photoId) {
        let maplink = fixr.content.querySelector('a.static-maps');
        if (maplink) {
            if (!document.getElementById('googlemapslink') && maplink.getAttribute('href') && (maplink.getAttribute('href').includes('map/?'))) {
                try {
                    let lat = maplink.getAttribute('href').match(/Lat=(\-?[\d\.]+)/i)[1];
                    let lon = maplink.getAttribute('href').match(/Lon=(\-?[\d\.]+)/i)[1];
                    let gmaplink = createRichElement('a', {
                        href: 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon,
                        id: 'googlemapslink'
                    }, 'Show location on Google Maps');
                    fixr.content.querySelector('li.c-charm-item-location').insertAdjacentElement('beforeend', createRichElement('div', {class: 'location-data-container'}, gmaplink));
                } catch (e) {
                    log('Failed creating Google Maps link: ' + e);
                }
            } else {
                log('link NOT inserted by insertGMapLink(). Invalid element or link already created. readystate=' + document.readyState);
            }
        } else {
            log('NO maplink found at readystate=' + document.readyState + '. Re-try later?');
        }
    } else {
        log('NO photoId found at readystate=' + document.readyState);
    }
}

function insertGMapLinkDelayed() {
    if (fixr.context.pageType === 'PHOTOPAGE') {
        log('insertGMapLinkDelayed() running... with pageType=' + fixr.context.pageType);
        setTimeout(insertGMapLink, 1500); // make maplink work better on photopage
        setTimeout(insertGMapLink, 3500); // Twice. Photopage is sometimes a bit slow building
        setTimeout(insertGMapLink, 8000); // Triple. Photopage is sometimes very slow building
    }
}

function mapInitializer() {
    if (window.location.href.includes('flickr.com/map/?')) {
        // https://developer.mozilla.org/en-US/docs/Web/API/URL
        const url = new URL(window.location.href);
        // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
        const imgId = url.searchParams.get('photo');
        if (imgId) {
            const focusImg = document.getElementById('f_img_thumb_' + imgId);
            if (focusImg) {
                focusImg.click(); // close and ...
                focusImg.click(); // reopen to highlight position on map
            }
        }
    }
}

const topMenuItems_style = '.fluid-subnav .extraitems a {padding: 12px 10px !important} .subnav-refresh ul.nav-links.extraitems li.sn-navitem a {padding: 13px 10px 12px 10px !important}';

function topMenuItems() {
    // User dropdown menu
    let m = document.querySelector('li[data-context=you] > ul.gn-submenu') || document.querySelector('li[data-context=you] div#you-panel ul');
    if (m) {
        let gid = null;
        if (m.querySelector('a[data-track=gnYouGroupsClick]')) {
            gid = m.querySelector('a[data-track=gnYouGroupsClick]').parentElement;
        }
        if (!gid && m.querySelector('a[data-track=You-groups]')) {
            gid = m.querySelector('a[data-track=You-groups]').parentElement;
        }
        let aad = m.querySelector('a[data-track=gnYouSetsClick]') || m.querySelector('a[data-track=You-sets]');
        if (aad && gid) {
            if (gid.hasAttribute('aria-label') && !m.querySelector('li[aria-label=Tags]')) {
                // latest design
                gid.insertAdjacentElement('afterend', createRichElement('li', {
                    class: 'menuitem',
                    role: 'menuitem',
                    'aria-label': 'Tags'
                }, createRichElement('a', {'data-track': 'gnYouTagsClick', href: '/photos/me/tags'}, 'Tags')));
                aad.parentElement.insertAdjacentElement('afterend', createRichElement('li', {
                    class: 'menuitem',
                    role: 'menuitem',
                    'aria-label': 'Map'
                }, createRichElement('a', {'data-track': 'gnYouMapClick', href: '/photos/me/map'}, 'Map')));
                aad.parentElement.insertAdjacentElement('afterend', createRichElement('li', {
                    class: 'menuitem',
                    role: 'menuitem',
                    'aria-label': 'Collections'
                }, createRichElement('a', {
                    'data-track': 'gnYouCollectionsClick',
                    href: '/photos/me/collections'
                }, 'Collections')));
            } else if (gid.classList.contains('gn-subnav-item') && !m.querySelector('a[data-track=You-tags]')) {
                // earlier design
                gid.insertAdjacentElement('afterend', createRichElement('li', {class: 'gn-subnav-item'}, createRichElement('a', {
                    'data-track': 'You-tags',
                    href: '/photos/me/tags'
                }, 'Tags')));
                aad.parentElement.insertAdjacentElement('afterend', createRichElement('li', {class: 'gn-subnav-item'}, createRichElement('a', {
                    'data-track': 'You-map',
                    href: '/photos/me/map'
                }, 'Map')));
                aad.parentElement.insertAdjacentElement('afterend', createRichElement('li', {class: 'gn-subnav-item'}, createRichElement('a', {
                    'data-track': 'You-collections',
                    href: '/photos/me/collections'
                }, 'Collections')));
            }
        }
    }
    // Photographer menu bar
    m = document.querySelector('ul.links[role=menubar]') || document.querySelector('ul.nav-links');
    if (m) {
        let gib = m.querySelector('li#groups') || m.querySelector('li.sn-groups');
        let aab = m.querySelector('li#albums a') || m.querySelector('li.sn-navitem-sets a');
        if (aab && gib) {
            m.classList.add('extraitems'); // mark extra items being added (so adjust spacing in style)
            if (gib.id === 'groups' && !m.querySelector('li#tags')) {
                // latest design
                gib.insertAdjacentElement('afterend', createRichElement('li', {
                    id: 'tags',
                    class: 'link',
                    role: 'menuitem'
                }, createRichElement('a', {href: '/photos/' + fixr.context.photographerId + '/tags'}, createRichElement('span', {}, 'Tags'))));
                aab.parentElement.insertAdjacentElement('afterend', createRichElement('li', {
                    id: 'map',
                    class: 'link',
                    role: 'menuitem'
                }, createRichElement('a', {href: '/photos/' + fixr.context.photographerId + '/map'}, createRichElement('span', {}, 'Map'))));
                aab.parentElement.insertAdjacentElement('afterend', createRichElement('li', {
                    id: 'collections',
                    class: 'link',
                    role: 'menuitem'
                }, createRichElement('a', {href: '/photos/' + fixr.context.photographerId + '/collections'}, createRichElement('span', {}, 'Collections'))));
            } else if (gib.classList.contains('sn-groups') && !m.querySelector('li.sn-tags')) {
                // earlier design
                gib.insertAdjacentElement('afterend', createRichElement('li', {class: 'sn-navitem sn-tags'}, createRichElement('a', {
                    'data-track': 'YouSubnav-tags',
                    href: '/photos/' + fixr.context.photographerId + '/tags'
                }, 'Tags')));
                aab.parentElement.insertAdjacentElement('afterend', createRichElement('li', {class: 'sn-navitem sn-map'}, createRichElement('a', {
                    'data-track': 'YouSubnav-map',
                    href: '/photos/' + fixr.context.photographerId + '/map'
                }, 'Map')));
                aab.parentElement.insertAdjacentElement('afterend', createRichElement('li', {class: 'sn-navitem sn-collections'}, createRichElement('a', {
                    'data-track': 'YouSubnav-collections',
                    href: '/photos/' + fixr.context.photographerId + '/collections'
                }, 'Collections')));
            }
        }
    }
}

let album = { // cache to avoid repeating requests
    albumId: '',
    commentCount: 0,
    comment: [],
    description: ''
};

let _wsGetPhotosetCommentsLock = 0;

function wsGetPhotosetComments() { // Call Flickr REST API to get album comments
    let diff = Date.now() - _wsGetPhotosetCommentsLock;
    if ((_wsGetPhotosetCommentsLock > 0) && (diff < 50)) {
        log('Skipping wsGetPhotosetComments() because already running?: ' + diff);
        // *** maybe add a check to see if we are still on same album?!
        return;
    }
    _wsGetPhotosetCommentsLock = Date.now();

    function handleResponse(response) {
        if (response.ok) {
            if (response.headers.get('content-type') && response.headers.get('content-type').includes('application/json')) {
                return response.json()
            }
            throw new Error('Response was not in expected json format.');
        }
        throw new Error('Network response was not ok.');
    }

    function handleResult(obj) {

        album.albumId = fixr.context.albumId;
        album.commentCount = -1;

        if (obj.stat === "ok") {
            log("flickr.photosets.comments.getList returned ok");
            if (obj.comments?.photoset_id) {
                album.albumId = obj.comments.photoset_id;
            }
            if (obj.comments?.comment) {
                album.commentCount = obj.comments.comment.length;
            } else {
                album.commentCount = 0;
            }
        } else {
            log('flickr.photosets.comments.getList returned an ERROR: obj.stat=' + obj.stat + ', obj.code=' + obj.code + ', obj.message=' + obj.message);
        }

        if (document.getElementById('albumCommentCount')) {
            if (album.commentCount === -1) {
                document.getElementById('albumCommentCount').innerText = '?';
            } else {
                document.getElementById('albumCommentCount').innerText = String(album.commentCount);
            }
        } else {
            log('albumCommentCount element not found');
        }

        _wsGetPhotosetCommentsLock = 0;
    }

    function handleError(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
        log('There has been a problem with your fetch operation: ' + error);
    }

    if (fixr.isWebExtension()) {
        // Call fetch() from background-script in WebExtensions, because changes in Chrome/Chromium https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
        browser.runtime.sendMessage({
            msgtype: "flickrservice",
            method: "flickr.photosets.comments.getList",
            fkey: fkey,
            options: {photoset_id: fixr.context.albumId}
        }).then(handleResult).catch(handleError);
    } else { // Userscript (So far it still works, also on Chrome/Tampermonkey...)
        fetch('https://api.flickr.com/services/rest/?method=flickr.photosets.comments.getList&api_key=' + fkey + '&photoset_id=' + fixr.context.albumId + '&format=json&nojsoncallback=1').then(handleResponse).then(handleResult).catch(handleError);
    }
}


let albums = { // cache albums to avoid repeating requests
    ownerId: '',
    column: '',
    count: 0
};

function getAlbumlist() {
    let _reqAlbumlist = null;
    if (window.XMLHttpRequest) { // TODO: Surprised to see I'm still using XMLHttpRequest !
        _reqAlbumlist = new XMLHttpRequest();
        if (typeof _reqAlbumlist.overrideMimeType !== 'undefined') {
            _reqAlbumlist.overrideMimeType('text/html');
        }

        _reqAlbumlist.onreadystatechange = function () {
            if (_reqAlbumlist.readyState === 4 && _reqAlbumlist.status === 200) {
                log('_reqAlbumlist returned status=' + _reqAlbumlist.status); // + ', \ntext:\n' + _reqAlbumlist.responseText);
                let doc = document.implementation.createHTMLDocument("sizeDoc");
                doc.documentElement.innerHTML = _reqAlbumlist.responseText; // NOTICE, this is NOT inserted directly into HTML-document! In the following DOM-content of doc is being analyzed...
                albums.ownerId = fixr.context.photographerId;
                albums.column = new DocumentFragment();
                albums.count = 0;
                const alist = Array.from(doc.body.querySelectorAll('div.photo-list-album-view'));
                const imgPattern = /url\([\'\"]*([^\)\'\"]+)(\.[jpgtifn]{3,4})[\'\"]*\)/i;
                let columnhead = createRichElement('div', {style: 'margin:0 0 .8em 0'});
                if (document.getElementById('albumTeaser')) {
                    if (alist && alist.length > 0) {
                        columnhead.textContent = "Albums";
                        albums.column.appendChild(columnhead);
                        albums.count = alist.length;
                        for (let e of alist.slice(0, 10)) {
                            let imgUrl = '';
                            //log(e.outerHTML);
                            // var result = e.style.backgroundImage.match(imgPattern); // strangely not working in Chrome
                            let result = (e.outerHTML).match(imgPattern); // quick work-around for above (works for now)
                            if (result) {
                                // imgUrl = result[1].replace(/_[a-z]$/, '') + '_s' + result[2];
                                imgUrl = result[1].replace(/_[a-z]$/, '') + '_q' + result[2];
                                log('imgUrl=' + imgUrl);
                            } else {
                                log('No match on imgPattern');
                            }
                            var a = e.querySelector('a[href][title]'); // sub-element
                            if (a) {
                                log('Album title: ' + a.title);
                                log('Album url: ' + a.getAttribute('href'));
                                let album = document.createElement("div");
                                let thumbnail = createRichElement('img', {src: imgUrl, class: 'asquare', alt: ''});
                                let albumtitle = createRichElement('div', {style: 'margin:0 0 .8em 0'}, a.title);
                                let anchor = createRichElement('a', {href: a.getAttribute('href')}, thumbnail, albumtitle);
                                album.appendChild(anchor);
                                albums.column.appendChild(album);
                            } else {
                                log('a element not found?');
                            }
                        }
                    } else if (alist) {
                        if (doc.body.querySelector('h3')) {
                            columnhead.textContent = doc.body.querySelector('h3').innerText;
                            albums.column.appendChild(columnhead);
                        }
                    } else {
                        log('(e Undefined) Problem reading albums or no albums??? : ' + _reqAlbumlist.responseText);
                    }
                    let foot = document.createElement("div");
                    let cursive = document.createElement("i");
                    let moreanchor = document.createElement("a");
                    moreanchor.href = "/photos/" + (fixr.context.photographerAlias || fixr.context.photographerId) + "/albums/";
                    moreanchor.textContent = albums.count > 10 ? 'More albums...' : (albums.count === 0 ? 'No albums found...' : '');
                    cursive.appendChild(moreanchor);
                    foot.appendChild(cursive);
                    albums.column.appendChild(foot);
                    document.getElementById('albumTeaser').appendChild(albums.column);
                } else {
                    log('albumTeaser NOT FOUND!?!');
                }
            } else {
                // wait for the call to complete
            }
        };

        if (fixr.context.photographerId) {
            const url = 'https://' + window.location.hostname + '/photos/' + (fixr.context.photographerAlias || fixr.context.photographerId) + '/albums';
            _reqAlbumlist.open('GET', url, true);
            _reqAlbumlist.send(null);
        } else {
            log('Attribution user (photographer) not found');
        }
    } else {
        log('understøtter ikke XMLHttpRequest');
    }
}

const albumTeaser_style = 'div#albumTeaser {border:none;margin:0;padding:0;position:absolute;top:0;right:-120px;width:100px}';

function albumTeaser() {
    if (fixr.context.pageType !== 'PHOTOSTREAM') {
        return; // exit if not photostream
    }
    log('albumTeaser() running');
    let dpc = document.querySelector('div.photolist-container');
    if (!dpc) {
        return;
    }
    log('AlbumTeaser found div.photolist-container');
    if (!document.getElementById('albumTeaser')) {
        dpc.style.position = "relative";
        dpc.insertAdjacentElement('afterbegin', createRichElement('div', {id: 'albumTeaser'}));
    }
    if (document.getElementById('albumTeaser')) {
        getAlbumlist();  // også check på fixr.context.photographerId ?
    }
}

let _timerAlbumTeaserDelayed;

function albumTeaserDelayed() {
    if (fixr.context.pageType !== 'PHOTOSTREAM') {
        return; // exit if not photostream
    }
    log('albumTeaserDelayed() running...');
    clearTimeout(_timerAlbumTeaserDelayed);
    _timerAlbumTeaserDelayed = setTimeout(albumTeaser, 1500);
}

const exploreCalendar_style = '#exploreCalendar {border:none;margin:0;padding:0;position:absolute;top:38px;right:-120px;width:100px} #exploreCalendar div {margin:0 0 .8em 0} #exploreCalendar img.asquare {width:75px;height:59px}';

function exploreCalendar() {
    if (fixr.context.pageType !== 'EXPLORE') {
        return; // exit if not explore/interestingness
    }
    log('exploreCalendar() running');
    let dtr = document.querySelector('div.title-row');
    if (!dtr) {
        return;
    }
    log('exploreCalendar found div.photo-list-view');
    if (!document.getElementById('exploreCalendar')) {
        dtr.style.position = "relative";
        let exploreMonth = fixr.clock.explore().substring(0, 7).replace('-', '/');
        let explCal = createRichElement('a', {href: '/explore/interesting/' + exploreMonth + '/'}, createRichElement('img', {
            src: 'https://c2.staticflickr.com/2/1701/24895062996_78719dec15_o.jpg',
            class: 'asquare',
            alt: ''
        }), createRichElement('div', {}, 'Explore Calendar'));
        let freshUpl = createRichElement('a', {
            href: '/search/?text=&view_all=1&media=photos&content_type=1&dimension_search_mode=min&height=640&width=640&safe_search=2&sort=date-posted-desc&min_upload_date=' + (Math.floor(Date.now() / 1000) - 7200),
            title: 'If you are an adventurer and want to explore something different than everybody else...'
        }, createRichElement('img', {
            src: 'https://c2.staticflickr.com/2/1617/25534100345_b4a3fe78f1_o.jpg',
            class: 'asquare',
            alt: ''
        }), createRichElement('div', {}, 'Fresh uploads'));
        dtr.insertAdjacentElement('afterbegin', createRichElement('div', {id: 'exploreCalendar'}, explCal, freshUpl));
        log('San Francisco PST UTC-8: ' + fixr.clock.pst());
        log('Explore Beat (Yesterday, UTC-4): ' + fixr.clock.explore());
    }
}

// SIMPLE
// const collapsibleSidebar_style = "#search-unified-content {position: relative} #sidebartoggle {position: absolute; right: 0; top: 5em; width: 3em; height: 1.5em; background-color: #CFC; margin-right:-2em; z-index: 10} body.searchsidebar_closed .sidebar-column {display:none}";
// BETTER
const collapsibleSidebar_style = "body.searchsidebar_closed .search-container-w-sidebar .sidebar-column {width: 0px !important; margin-left: 0 !important} body.searchsidebar_closed .sidebar-content-container > div:not(#sidebartoggle) {overflow:hidden; display:none} .sidebar-content-container, #search-unified-content {position: relative} #sidebartoggle {position: absolute; right: -1.7em; top: 6em; display: flex; justify-content: center; align-items: center; width: 2em; height: 2em; color: #128fdc; border: 2px solid #128fdc; border-radius: 50%; background-color: #FFF; z-index: 10; cursor: pointer; transition: all 0.3s; }  body.searchsidebar_closed #sidebartoggle {transform: rotate(180deg);}";
function collapsibleSidebar() {
    if (['SEARCHRESULTPHOTOS', 'SEARCHRESULTPEOPLE', 'SEARCHRESULTGROUPS'].includes(fixr.context.pageType)) {
        // SIMPLE:
        // var cnt = document.querySelector('#search-unified-content');
        // if (cnt) {
        //     var toggle = createRichElement('div', {id: 'sidebartoggle'}, '❯');
        //     cnt.insertAdjacentElement('afterbegin', createRichElement('div', {id: 'sidebartoggle'}, '[<->]'));
        //     ...
        // BETTER:
        let cnt = document.querySelector('.sidebar-content-container');
        if (cnt) {
            if (!document.getElementById('sidebartoggle')) {
                let toggle = createRichElement('div', {id: 'sidebartoggle'}, '❯');
                cnt.insertAdjacentElement('afterbegin', toggle);
                setTimeout(function () {
                    window.dispatchEvent(new Event('resize', {'cancelable': true}))
                }, 100);
                toggle.addEventListener('click', function (e) {
                    document.body.classList.toggle('searchsidebar_closed');
                    setTimeout(function () {
                        window.dispatchEvent(new Event('resize', {'cancelable': true}))
                    }, 100);
                })
            }
        } else {
            setTimeout(collapsibleSidebar, 2000);
        }
    }
}

let _timerExploreCalendarDelayed;

function exploreCalendarDelayed() {
    if (fixr.context.pageType !== 'EXPLORE') {
        return; // exit if not explore/interestingness
    }
    log('albumTeaserDelayed() running...');
    clearTimeout(_timerExploreCalendarDelayed);
    _timerExploreCalendarDelayed = setTimeout(exploreCalendar, 1500);
}

function ctrlClick(e) {
    let elem, evt = e ? e : event;
    if (evt.srcElement) elem = evt.srcElement;
    else if (evt.target) elem = evt.target;
    if (evt.ctrlKey) {
        log('Ctrl clicked. Further scripted click-event handling canceled. Allow the default ctrl-click handling in my browser.');
        evt.stopPropagation();
    }
}

function ctrlClicking() {
    let plv = document.querySelectorAll('div.photo-list-view');
    for (let i = 0; i < plv.length; i++) {
        log('ctrlClicking(): plv[' + i + '] found!');
        // Allow me to open tabs in background by ctrl-click in Firefox:
        plv[i].parentNode.addEventListener('click', ctrlClick, true);
    }
}

let _timerCtrlClicking;

function ctrlClickingDelayed() {
    log('ctrlClickingDelayed() running...');
    clearTimeout(_timerCtrlClicking);
    _timerCtrlClicking = setTimeout(ctrlClicking, 1500);
}

const topPagination_style = '#topPaginationContainer{width:250px;height:40px;margin:0 auto;position:absolute;top:0;left:0;right:0;border:none} #topPagination{width:720px;margin:0;position:absolute;top:0;left:-235px;text-align:center;z-index:10;display:none;border:none;padding:10px 0 10px 0;overflow:hidden} .album-toolbar-content #topPagination{top:-16px} .group-pool-subheader-view #topPagination{top:-7px} .title-row #topPagination{width:830px;left:-290px;top:-12px} #topPaginationContainer:hover #topPagination{display:block}';

function topPagination() {
    log('topPagination()');
    let bottomPagination = document.querySelector('.pagination-view');
    if (!bottomPagination) {
        bottomPagination = document.querySelector('.explore-pagination');
    }
    if (bottomPagination && !document.getElementById('topPagination')) {
        if (bottomPagination.childElementCount > 0) {
            let topPagination = bottomPagination.cloneNode(true);
            topPagination.id = 'topPagination';
            let topPaginationContainer = document.createElement('div');
            topPaginationContainer.id = 'topPaginationContainer';
            topPaginationContainer.appendChild(topPagination);
            let topbar = document.querySelector('.fluid-magic-tools-view');
            if (!topbar) topbar = document.querySelector('.album-toolbar-content');
            if (!topbar) topbar = document.querySelector('.group-pool-subheader-view');
            if (!topbar) topbar = document.querySelector('.title-row');
            if (topbar) {
                log('topPagination: root found, inserting container');
                topbar.appendChild(topPaginationContainer);
            }
        }
    }
}

const albumExtras_style = '.album-map-icon{background:url("https://c2.staticflickr.com/6/5654/23426346485_334afa6e8f_o_d.png") no-repeat;height:21px;width:24px;top:6px;left:3px} .album-comments-icon{background:url("https://c1.staticflickr.com/5/4816/46041390622_f8a0cf0148_o.png") -32px -460px no-repeat;height:21px;width:24px;top:6px;left:3px}';

function albumExtras() { // links to album's map and comments
    if (fixr.context.pageType !== 'ALBUM') {
        return; // exit if not albumpage
    }
    if (fixr.context.albumId) {
        log('albumsExtra() med album=' + fixr.context.albumId);
    } else {
        log('Exit albumsExtra(). Mangler albumId');
        return;
    }
    let elist = document.querySelector('div.album-engagement-view');
    if (elist && !document.getElementById('albumCommentCount')) {
        // map-link:
        let mapdiv = document.createElement('div');
        mapdiv.className = 'create-book-container';
        mapdiv.title = 'Album on map';
        mapdiv.style.textAlign = 'center';
        let maplink = document.createElement('a');
        maplink.href = '/photos/' + fixr.context.photographerAlias + '/albums/' + fixr.context.albumId + '/map/';
        maplink.style.fontSize = '14px';
        maplink.style.color = '#FFF';
        let mapicon = document.createElement('span');
        mapicon.title = 'Album on map';
        mapicon.className = 'album-map-icon';
        maplink.appendChild(mapicon);
        mapdiv.appendChild(maplink);
        elist.appendChild(mapdiv);
        // comments-link:
        let comurl = '/photos/' + fixr.context.photographerAlias + '/sets/' + fixr.context.albumId + '/comments/';  // /sets/* urls works, /albums/* urls currently doesn't work (yet?)
        // var comurl = '#'; // NEW?!
        let cmdiv = document.createElement('div');
        cmdiv.className = 'create-book-container';
        cmdiv.title = 'Comments';
        cmdiv.style.textAlign = 'center';
        let cmlink = document.createElement('a');
        cmlink.href = comurl;
        cmlink.style.fontSize = '14px';
        cmlink.style.color = '#FFF';
        cmlink.id = 'albumCommentsLink';
        let cmicon = document.createElement('span');
        cmicon.title = 'Album comments';
        cmicon.className = 'album-comments-icon';
        cmicon.id = 'albumCommentCount';
        cmlink.appendChild(cmicon);
        cmdiv.appendChild(cmlink);
        elist.appendChild(cmdiv);

        wsGetPhotosetComments();
    }
}

const updateTags_style_avatar = 'a.fixrTag>img {width:1em;height:1em;margin:0;padding:0;position:relative;top:3px}';
const updateTags_style_hover = 'ul.tags-list>li.tag>a.fixrTag,ul.tags-list>li.autotag>a.fixrTag{display:none;} ul.tags-list>li.tag:hover>a.fixrTag,ul.tags-list>li.autotag:hover>a.fixrTag{display:inline;} ' + updateTags_style_avatar;
const updateTags_style_persist = 'ul.tags-list>li.tag>a.fixrTag,ul.tags-list>li.autotag>a.fixrTag{display:inline;} ' + updateTags_style_avatar;

function updateTags() {
    if (fixr.context.pageType !== 'PHOTOPAGE') {
        return; // exit if not photopage
    }
    if (fixr.context.photographerAlias === '') {
        fixr.initPhotoId();
    }
    if (fixr.context.photographerId === '') {
        fixr.initPhotographerId();
    }
    if (fixr.context.photographerName === '') {
        fixr.initPhotographerName();
    }
    log('updateTags() med photographerAlias=' + fixr.context.photographerAlias + ', photographerId=' + fixr.context.photographerId + ' og photographerName=' + fixr.context.photographerName);
    if (document.querySelector('ul.tags-list')) {
        let tags = document.querySelectorAll('ul.tags-list>li');
        if (tags && tags.length > 0) {
            log('updateTags() Looping ' + tags.length + ' tags...');
            let iconHref = fixr.context.photographerIcon.match(/^([^_]+)(_\w)?\.[jpgntif]{3,4}$/)[1] + String(fixr.context.photographerIcon.match(/^[^_]+(_\w)?(\.[jpgntif]{3,4})$/)[2]); // do we know for sure it is square?
            for (let tag of tags) {
                let atag = tag.querySelector('a[title][href*="/photos/tags/"],a[title][href*="?tags="],a[title][href*="?q="]');
                if (atag) {
                    let realtag = (atag.href.match(/((\/tags\/)|(\?tags\=)|(\?q\=))([\S]+)$/i))[5];
                    if (!(tag.querySelector('a.fixrTag'))) {
                        let avatar = document.createElement('img');
                        avatar.src = iconHref;
                        avatar.alt = '*';
                        let taglink = document.createElement('a');
                        taglink.className = 'fixrTag';
                        taglink.href = '/photos/' + (fixr.context.photographerAlias || fixr.context.photographerId) + '/tags/' + realtag + '/';
                        taglink.title = atag.title + ' by ' + fixr.context.photographerName;
                        taglink.appendChild(avatar);
                        tag.insertBefore(taglink, tag.firstChild);
                    }
                } else {
                    log('updateTags(): atag not matched.');
                }
            }
        } else {
            log('updateTags(): No tags defined (yet?)');
        }
    } else {
        log('updateTags(): taglist container not found');
    }
}

function updateTagsDelayed() {
    log('updateTagsDelayed() running... with pageType=' + fixr.context.pageType);
    if (fixr.context.pageType === 'PHOTOPAGE') {
        setTimeout(updateTags, 2500);
        setTimeout(updateTags, 4500); // Twice. Those tags are sometimes a bit slow emerging
        setTimeout(updateTags, 8500); // Triple. Those tags are sometimes very slow emerging
    }
}

const photoDates_style = '.has-date-info {position:relative} .date-info{z-index:10;padding:0 .5em 0 .5em;display:none;position:absolute;top:30px;left:-40px;width:400px;margin-right:-400px;background-color:rgba(255,250,150,0.9);color:#000;border:1px solid #d4b943;border-radius:4px;} .has-date-info:hover .date-info{display:block;} .date-info label {display:inline-block; min-width: 5em;}';

function photoDates() {
    let elem = document.querySelector('div.view.sub-photo-date-view');
    if (elem && !elem.classList.contains('has-date-info')) {
        elem.classList.add('has-date-info');
        elem.insertAdjacentElement('beforeend', createRichElement('div', {class: 'date-info'}, 'Date info!'));
        wsGetPhotoInfo(); // get dates
    }
}

function photoDatesDelayed() {
    log('photoDates() running... with pageType=' + fixr.context.pageType);
    if (fixr.context.pageType === 'PHOTOPAGE') {
        setTimeout(photoDates, 2000);
        setTimeout(photoDates, 4000); // Twice.
    }
}

function shootingSpaceballs() {
    // Enable image context-menu on "View sizes" page by removing overlaying div.
    // This is *not* meant as a tool for unauthorized copying and distribution of other peoples photos.
    // Please respect image ownership and copyrights!
    if (fixr.context.pageType === 'SIZES') {
        function trashing() {
            let trash = document.querySelector('div.spaceball');
            while (trash && trash.parentNode) {
                trash.parentNode.removeChild(trash);
                trash = document.querySelector('div.spaceball');
            }
        }

        let asp = document.querySelector('#allsizes-photo');
        if (asp) {
            document.body.addEventListener('click', trashing, false);
            asp.click();
        }
        // document.body.style.backgroundColor = "#cfc";
    }
}

const orderwarning_style = '.filter-sort.warning p {animation:wink 3s ease 1s 1;} @keyframes wink {0% {background-color:transparent;} 50% {background-color:rgba(255,250,150,0.9);} 100% {background-color:transparent;}} .filter-sort.warning:after{content:"You are looking at this photostream in Date-taken order. Change order to Date-uploaded, to be sure to see latest uploads in the top of photostreams.";z-index:10;padding:.5em;display:none;position:relative;top:-2px;right:-50px;width:400px;margin-right:-400px;background-color:rgba(255,250,150,0.9);color:#000;border:1px solid #d4b943;border-radius:4px;} .filter-sort.warning:hover:after{display:block;}';

function orderWarning() {
    if (fixr.context.pageType === 'PHOTOSTREAM') {
        let e = document.querySelector('.dropdown-link.filter-sort');
        if (e) {
            if (['Date taken', 'Fecha de captura', 'Aufnahmedatum', 'Date de prise de vue', 'Data dello scatto', 'Tirada na data', 'Ngày chụp', 'Tanggal pengambilan', '拍攝日期', '촬영 날짜'].includes(e.innerText.trim())) {
                e.classList.add('warning');
            } else {
                e.classList.remove('warning');
            }
        }
    }
}

const newsfeedLinks_style = 'div#feedlinks {border:none;margin:0;padding:0;position:absolute;top:0;right:10px;width:100px} ul.gn-tools>div#feedlinks {right:-120px} div#gn-wrap>div#feedlinks, div.header-wrap>div#feedlinks, header#branding>div#feedlinks {right:-120px} div#feedlinks>a {display:block;float:left;margin:10px 8px 0 0;width:16px} div#feedlinks>a>img {display:block;width:16px;height:16px} ul.gn-tools>div#feedlinks>a {margin-top:2px}';

function newsfeedLinks() {
    let elem = document.getElementById('feedlinks');
    if (elem) {
        elem.textContent = '';
    }
    setTimeout(updateNewsfeedLinks, 500); // give Flickr time to update link tags in head
}

function updateNewsfeedLinks() {
    let feedlinks = document.querySelectorAll('head > link[rel="alternate"][type="application/rss+xml"], head > link[rel="alternate"][type="application/atom+xml"], head > link[rel="alternate"][type="application/atom+xml"], head > link[rel="alternate"][type="application/json"]');
    log('Number of feed links found: ' + feedlinks.length);
    let dgnc = document.querySelector('div.global-nav-container ul.gn-tools') || document.querySelector('div#gn-wrap') || document.querySelector('div#global-nav') || document.querySelector('div.header-wrap') || document.querySelector('header#branding') || document.querySelector('div.custom-header-container>div>div');
    if (dgnc) {
        if (!document.getElementById('feedlinks')) {
            dgnc.style.position = "relative";
            dgnc.insertAdjacentElement('afterbegin', createRichElement('div', {id: 'feedlinks'}));
        }
        let elem = document.getElementById('feedlinks');
        if (elem) {
            let feedicons = new DocumentFragment();
            for (const link of feedlinks) {
                let feedlink = document.createElement('a');
                feedlink.href = link.href;
                let feedsymbol = document.createElement('img');
                feedsymbol.src = 'https://c1.staticflickr.com/5/4869/32220441998_601de47e20_o.png';
                feedsymbol.alt = 'Feedlink';
                feedsymbol.style.width = '16px';
                feedsymbol.style.height = '16px';
                feedsymbol.title = link.title;
                feedlink.appendChild(feedsymbol);
                feedicons.appendChild(feedlink);
            }
            elem.textContent = ''; // remove existing content
            elem.appendChild(feedicons);
        }
    }
}

function initSlideshowSpeedHook() {
    let timeoutScript = document.createElement('script');
    timeoutScript.src = browser.runtime.getURL('inject/timeout.js');
    timeoutScript.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(timeoutScript);
}

let slideshowSpeed = '5'; // Flickr default (seconds)
function initSlideshowSpeed() {
    if (document.body) {
        document.body.setAttribute('data-slideshowspeed', slideshowSpeed);
    }
}

let _wsGetPhotoInfoLock = 0;

function wsGetPhotoInfo() { // Call Flickr REST API to get photo info
    let diff = Date.now() - _wsGetPhotoInfoLock;
    if ((_wsGetPhotoInfoLock > 0) && (diff < 50)) {
        log('Skipping wsGetPhotoInfo() because already running?: ' + diff);
        // *** maybe add a check to see if we are still on same photo?!
        return;
    }
    _wsGetPhotoInfoLock = Date.now();

    function handleResponse(response) {
        if (response.ok) {
            if (response.headers.get('content-type') && response.headers.get('content-type').includes('application/json')) {
                return response.json()
            }
            throw new Error('Response was not in expected json format.');
        }
        throw new Error('Network response was not ok.');
    }

    function handleResult(obj) {
        let elem = document.querySelector('.date-info');
        if (obj.stat === "ok") {
            log("flickr.photos.getInfo returned ok");
            if (obj.photo?.id) {
                let uploadDate = new Date(0);
                let debugstr = '';
                if (obj.photo.dateuploaded) {
                    uploadDate = new Date(obj.photo.dateuploaded * 1000);
                    debugstr = 'UploadDate: ' + uploadDate.toString();
                }
                let dateDetail = createRichElement('p', {'x-ms-format-detection': 'none'});
                let takenLabel = createRichElement('label', {}, 'Taken:');
                let uploadedLabel = createRichElement('label', {}, 'Uploaded:');
                let brElem = document.createElement('br');
                if (obj.photo.dates) {
                    if (obj.photo.dateuploaded !== obj.photo.dates.posted) {
                        log('Unexpected Date difference!');
                    }
                    if (obj.photo.dates.posted) {
                        if (obj.photo.dates.posted < obj.photo.dateuploaded) {
                            uploadDate = new Date(obj.photo.dates.posted * 1000); // GMT/UTC
                        }
                        debugstr += '<br />PostDate: ' + uploadDate.toString();
                    }
                    if (obj.photo.dates.taken && obj.photo.dates.takenunknown.toString() === '0') {
                        debugstr += '<br />TakenDate: ' + obj.photo.dates.taken + ' (granularity=' + obj.photo.dates.takengranularity + ')';
                        let takenDateTmp = obj.photo.dates.taken.replace(/[^\d-:\s]/g, ''); // "2018-03-30 00:35:44" (Remove any unexpected characters)
                        let takenDate = new Date(Date.parse(takenDateTmp.replace(' ', 'T')));
                        let dayStart = new Date(Date.parse(takenDateTmp.substring(0, 10) + 'T00:00:00'));
                        let dayEnd = new Date(Date.parse(takenDateTmp.substring(0, 10) + 'T23:59:59'));
                        let takenTimeIndex = takenDate.toString().search(/\d{2}[:\.]\d{2}[:\.]\d{2}/);
                        if (obj.photo.dates.takengranularity.toString() === '0') { // 0	Y-m-d H:i:s - full datetime
                            let linkElem = createRichElement('a', {href: '/search/?user_id=' + fixr.context.photographerId + '&view_all=1&min_taken_date=' + (Math.floor(dayStart.getTime() / 1000) - 43200) + '&max_taken_date=' + (Math.floor(dayEnd.getTime() / 1000) + 43200)}, takenDate.toString().substring(0, takenTimeIndex - 1));
                            dateDetail.append(takenLabel, ' ', linkElem, takenDate.toString().substring(takenTimeIndex - 1, takenTimeIndex + 8) + ' "Camera Time"', brElem);
                        } else if (obj.photo.dates.takengranularity.toString() === '4') { // 4	Y-m
                            dateDetail.append(takenLabel, ' ' + takenDateTmp.substring(0, 7), brElem);
                        } else if (obj.photo.dates.takengranularity.toString() === '6') { // 6	Y
                            dateDetail.append(takenLabel, ' ' + takenDateTmp.substring(0, 4), brElem);
                        } else if (obj.photo.dates.takengranularity.toString() === '8') { // 8	Circa...
                            dateDetail.append(takenLabel, ' Circa ' + takenDateTmp.substring(0, 4), brElem);
                        } else {
                            log('Unexpected value for photo.dates.takengranularity: ' + obj.photo.dates.takengranularity);
                        }
                    }
                    if (obj.photo.dates.lastupdate) { // photo has been updated/replaced
                        debugstr += '<br />UpdateDate: ' + (new Date(obj.photo.dates.lastupdate * 1000)).toString();
                    }
                }
                if (elem) {
                    let uploadDateStr = uploadDate.toString();
                    let n = uploadDateStr.indexOf('(');
                    if (n > 0) {
                        dateDetail.append(uploadedLabel, ' ' + uploadDateStr.substring(0, n));
                    } else {
                        dateDetail.append(uploadedLabel, ' ' + uploadDateStr);
                    }
                    elem.textContent = '';
                    elem.append(dateDetail);
                    let withTitle = elem.parentElement.querySelector('span[title]');
                    if (withTitle) {
                        withTitle.removeAttribute('title');
                    }
                }
            }
        } else {
            if (elem) {
                elem.textContent = 'Cannot fetch detailed date details on private photos';
            }
            log('flickr.photos.getInfo returned an ERROR: obj.stat=' + obj.stat + ', obj.code=' + obj.code + ', obj.message=' + obj.message);
        }
        _wsGetPhotoInfoLock = 0;
    }

    function handleError(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
        log('There has been a problem with your fetch operation: ' + error);
        let elem = document.querySelector('.date-info');
        if (elem) {
            elem.textContent = 'There was an error fetching detailed date details...';
        }
    }

    if (fixr.isWebExtension()) {
        // Call fetch() from background-script in WebExtensions, because changes in Chrome/Chromium https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
        browser.runtime.sendMessage({
            msgtype: "flickrservice",
            method: "flickr.photos.getInfo",
            fkey: fkey,
            options: {photo_id: fixr.context.photoId}
        }).then(handleResult).catch(handleError);
    } else { // Userscript (So far it still works, also on Chrome/Tampermonkey...)
        fetch('https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' + fkey + '&photo_id=' + fixr.context.photoId + '&format=json&nojsoncallback=1').then(handleResponse).then(handleResult).catch(handleError);
    }
}

function stereotest() {
    let self = "flickrfixruserscript";
    let other = "flickrfixrwebextension";
    if (fixr.isWebExtension()) {
        self = "flickrfixrwebextension";
        other = "flickrfixruserscript";
    }
    document.body.classList.add(self);
    if (document.body.classList.contains(other)) {
        alert("It looks like you are running both Stigs Flickr Fixr userscript and Flickr Fixr browser extension at once. Please uninstall or disable one of them to avoid errors and unpredictable behaviors!");
    }
}

function runEarly() {
    //localStorage.setItem('filterFeedEvents', 'people'); // Try to make People feed default.
}

function weekNo(dt) {
    let date = dt || new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    let week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}
function userscriptWarning() {
    if (!document.body.classList.contains("flickrfixrwebextension")) { // Skip warning if both versions are installed (There will be another warning from stereotest()).
        let info = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
        if (info) {
            let prevWeekNo = localStorage.getItem("fixr_userscript_warning_weekno");
            let prevVersion = localStorage.getItem("fixr_userscript_warning_version");
            if (!prevVersion || prevVersion !== info.script.version || !prevWeekNo || prevWeekNo != weekNo()) {
                localStorage.setItem("fixr_userscript_warning_weekno", weekNo());
                localStorage.setItem("fixr_userscript_warning_version", info.script.version);
                alert('\nYou are running the userscript-version of Flickr Fixr via ' + info.scriptHandler + '. \n\nUserscript version of Flickr Fixr is not supported anymore, and probably wont be upgraded even if a Flickr update breaks this userscript. \n\nFor continued support and updates, make the switch to the Flickr Fixr browser-extension. You can find Flickr Fixr browser extension in the Add-on webstores for Chrome, Firefox and Edge.\n');
            }
        }
    }
}

const shared_style = 'img.asquare {width:75px;height:75px;border:none;margin:0;padding:0;transition:all 0.3s ease} a:hover>img.asquare{transform:scale(1.3)}'; // used by multiple features

function handlerInitFixr(options) { // Webextension init
    let runNow = [];
    let onPageHandlers = [];
    let onResizeHandlers = [];
    let onFocusHandlers = [];
    let onStandaloneHandlers = [];

    fixr.style.add(shared_style);
    onPageHandlers.push(stereotest);
    if (options.topMenuItems) {
        fixr.style.add(topMenuItems_style);
        onPageHandlers.push(topMenuItems);
        onStandaloneHandlers.push(topMenuItems);
    }
    if (options.ctrlClicking) {
        onPageHandlers.push(ctrlClicking);
    }
    if (options.albumExtras) {
        fixr.style.add(albumExtras_style);
        onPageHandlers.push(albumExtras);
    }
    if (options.topPagination) {
        fixr.style.add(topPagination_style);
        onPageHandlers.push(topPagination);
    }
    if (options.shootingSpaceballs) {
        onPageHandlers.push(shootingSpaceballs);
    }
    if (options.orderWarning) {
        fixr.style.add(orderwarning_style);
        onPageHandlers.push(orderWarning);
    }
    if (options.newsfeedLinks) {
        fixr.style.add(newsfeedLinks_style);
        onPageHandlers.push(newsfeedLinks);
        onStandaloneHandlers.push(newsfeedLinks);
    }
    if (options.photoDates) {
        fixr.style.add(photoDates_style);
        onPageHandlers.push(photoDatesDelayed);
    }
    if (options.ctrlClicking) {
        onPageHandlers.push(ctrlClickingDelayed);
    }
    if (options.exploreCalendar) {
        fixr.style.add(exploreCalendar_style);
        onPageHandlers.push(exploreCalendarDelayed);
    }
    if (options.albumTeaser) {
        fixr.style.add(albumTeaser_style);
        onPageHandlers.push(albumTeaserDelayed);
    }
    if (options.insertGMapLink) {
        onPageHandlers.push(insertGMapLinkDelayed);
        onStandaloneHandlers.push(mapInitializer);
    }
    if (options.updateTags) {
        if (options.updateTags_tagmode === 'updateTags_persist') {
            fixr.style.add(updateTags_style_persist);
        } else {
            fixr.style.add(updateTags_style_hover);
        }
        onPageHandlers.push(updateTagsDelayed);
    }
    if (options.searchresultsCollapsibleSidebar) {
        fixr.style.add(collapsibleSidebar_style);
        onPageHandlers.push(collapsibleSidebar);
    }
    if (options.slideshowSpeedControl) {
        slideshowSpeed = options.slideshowSpeedControl_value;
        runNow.push(initSlideshowSpeedHook);
        onPageHandlers.push(initSlideshowSpeed);
    }
    fixr.init(runNow, onPageHandlers, onResizeHandlers, onFocusHandlers, onStandaloneHandlers); // WebExtension
}

if (window.location.href.includes('flickr.com\/services\/api\/explore\/')) {
    // We are on Flickr API Explorer (WAS used for note handling before Flickr returned native note-support) and outside "normal" flickr page flow. fixr wont do here...
} else {
    if (fixr.isWebExtension()) {

        // WEBEXTENSION SETUP with options

        log('WebExtension - init with options...');
        withOptionsDo(handlerInitFixr); // Load selected features and run fixr.init with them...

    } else {

        // USERSCRIPT SETUP

        log('Userscript - fixr.init...');
        fixr.style.add(shared_style);
        fixr.style.add(albumExtras_style);
        fixr.style.add(topPagination_style);
        fixr.style.add(orderwarning_style);
        fixr.style.add(topMenuItems_style);
        fixr.style.add(photoDates_style);
        fixr.style.add(newsfeedLinks_style);
        fixr.style.add(exploreCalendar_style);
        fixr.style.add(albumTeaser_style);
        fixr.style.add(updateTags_style_hover);
        // FIXR fixr.init([runNow], [onPageHandlers], [onResizeHandlers], [onFocusHandlers], [onStandaloneHandlers])
        fixr.init([/* runEarly */], [stereotest, topMenuItems, ctrlClicking, albumExtras, topPagination, shootingSpaceballs, orderWarning, newsfeedLinks, photoDatesDelayed, ctrlClickingDelayed, exploreCalendarDelayed, albumTeaserDelayed, insertGMapLinkDelayed, updateTagsDelayed, userscriptWarning], [], [], [topMenuItems, newsfeedLinks, mapInitializer]); // Userscript

    }
}
