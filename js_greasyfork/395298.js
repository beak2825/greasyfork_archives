// ==UserScript==
// @run-at      document-start
// @name        General URL Cleaner
// @name:ja     General URL Cleaner
// @namespace   https://greasyfork.org/users/435316-beck
// @description Cleans URL's from various popular sites.
// @description:ja 汎用的なURLクリーナー。主要サイトのURLを綺麗にします。
// @include     https://www.newegg.com/*
// @include     https://www.newegg.ca/*
// @include     https://www.bing.com/*
// @include     https://www.youtube.com/*
// @include     https://www.imdb.com/*
// @include     https://www.facebook.com/*
// @include     https://disqus.com/embed/comments/*
// @include     /^https://www\.amazon(\.com?)?\.[a-z]{2,3}/.*$/
// @include     /^https?://[a-z]+\.google(\.com?)?\.[a-z]{2,3}/.*$/
// @include     /^https://[a-z.]+\.ebay(desc)?(\.com?)?\.[a-z]{2,3}/.*$/
// @include     /^https://[a-z0-9.]*twitter.com/.*$/
// @include     /^https?://(www\.)?staticice\.com\.au/.*$/
// @include     https://app.getpocket.com/*
// @exclude     https://apis.google.com/*
// @exclude     https://accounts.google.com/*
// @exclude     https://support.google.com/*
// @exclude     https://www.google.com/recaptcha/*
// @exclude     https://hangouts.google.com/webchat/*
// @exclude     https://gsuite.google.com/*
// @exclude     https://calendar.google.com/*
// @exclude     https://docs.google.com/spreadsheets/*
// @version     3.0.9
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=beckorz@gmail.com&item_name=Greasy+Fork+Donation
// @contributionAmount 1
// @downloadURL https://update.greasyfork.org/scripts/395298/General%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/395298/General%20URL%20Cleaner.meta.js
// ==/UserScript==

/*
 * Vars
 */

var currHost = location.host;
var currPath = location.pathname;
var currSearch = location.search;

var ebay = /^[a-z.]+\.ebay(desc)?(\.com?)?\.[a-z]{2,3}$/;
var amazon = /^www\.amazon\.com?(\.[a-z]{2,3})?$/;
var google = /^[a-z]+\.google\.com?(\.[a-z]{2,3})?$/;

var amazonParams = /&(url|ie|pf_rd_[a-z]|bbn|rw_html_to_wsrp|ref_)=[^&#]*/;
var neweggParams = /&(cm_sp|icid|ignorebbr)=[^&#]*/g;
var imdbParams = /&(pf_rd_[a-z]|ref_)=[^&#]*/g;
var bingParams = /&(go|qs|form|FORM|filt|pq|s[cpk]|qpvt|cvid)=[^&#]*/g;
var youtubeParams = /&(feature|src_vid|annotation_id|[gh]l)=[^&#]*/g;
var ebayParams = /&(_(o?sacat|odkw|from|trksid)|rt)=[^&#]*/g;
var googleParams = /&(sa(fe)?|ved|source(id)?|s?ei|tab|tbo|h[ls]|authuser|n?um|ie|aqs|as_qdr|bav|bi[wh]|bs|bvm|cad|channel|complete|cp|s?client|d[pc]r|e(ch|msg|s_sm)|g(fe|ws)_rd|gpsrc|noj|btnG|o[eq]|p(si|bx|f|q)|rct|rlz|site|spell|tbas|usg|xhr|gs_[a-z]+)=[^&#]*/g;
var twitterParams = /&(src|ref_src|ref_url|vertical)=[^&#]*/g

/*
 * Main
 */

if (currHost === 'www.bing.com') {
    setCurrUrl(cleanBing(currSearch));
    cleanLinks(parserAll);
    return;
}

if (currHost === 'www.youtube.com') {
    if (currPath === '/redirect')
        location.href = cleanYoutubeRedir(currSearch);

    if (currPath === '/watch')
        setCurrUrl(cleanYoutube(currSearch));

    cleanLinks(parserYoutube);
    return;
}

if (currHost.endsWith('.newegg.com') || currHost.endsWith('.newegg.ca')) {
    if (currSearch)
        setCurrUrl(cleanNewegg(currSearch));

    cleanLinks(parserNewegg);
    return;
}

if (currHost === 'www.imdb.com') {
    if (currSearch)
        setCurrUrl(cleanImdb(currSearch));

    cleanLinks(parserIMDB);
    onhashchange = deleteHash();
    return;
}

if (google.test(currHost)) {
    if (currPath === '/url' || currPath === '/imgres')
        location.href = cleanGenericRedir(currSearch);

    if (!currSearch && !/[&#]q=/.test(location.hash))
        return;

    setCurrUrl(cleanGoogle(currPath + currSearch));
    changeState(googleInstant);

    if (currSearch.includes('tbm=isch')) {
        cleanLinksAlways(parserGoogleImages);
    }
    else {
        cleanLinks(parserGoogle);
    }

    return;
}

if (ebay.test(currHost)) {
    if (currPath.includes('/itm/'))
        setCurrUrl(cleanEbayItem(location));

    else if (currSearch)
        setCurrUrl(cleanEbayParams(currSearch));

    cleanLinks(parserEbay);
    onhashchange = deleteHash;
    return;
}

if (amazon.test(currHost)) {

    if (currPath.includes('/dp/'))
        setCurrUrl(cleanAmazonItemdp(location));

    else if (currPath.includes('/gp/product'))
        setCurrUrl(cleanAmazonItemgp(location));

    else if (currSearch)
        setCurrUrl(cleanAmazonParams(currSearch));

    cleanLinks(parserAmazon);
    onhashchange = deleteHash();
    return;
}

if (currHost.endsWith('staticice.com.au')) {
    cleanLinks(parserStaticice);
    return;
}

if (currHost == 'twitter.com') {

    if (currSearch)
        setCurrUrl(cleanTwitterParams(currSearch));

    cleanLinks(parserTwitter);
    return;
}

if (currHost == 'www.facebook.com') {
    cleanLinks(parserFacebook);
    return;
}

if (currHost == 'disqus.com') {
    cleanLinks(parserDisqus);
    return;
}

if (currHost === 'app.getpocket.com') {
    cleanLinks(parserAll);
    return;
}

/*
 * Boilerplate functions
 */

function setCurrUrl(url) {
    history.replaceState(null, null, url);
}

function deleteHash() {
    history.replaceState(null, null, ' ');
}

function observe(func) {
    new MutationObserver(func).observe(document, {childList:true, subtree:true});
}

// Clean links once, mark as cleaned, then ignore them
function cleanLinks(linkParser) {
    observe(function() {
        for (let a of document.links) {
            if (a.cleaned)
                continue;

            if (a.protocol && a.protocol.startsWith('http'))
                linkParser(a);

            a.cleaned = 1;
        }
    });
}

// Always clean links
function cleanLinksAlways(linkParser) {
    observe(function() {
        for (let a of document.links)
            if (a.protocol && a.protocol.startsWith('http'))
                linkParser(a);
    });
}

function googleInstant(url) {
    let parts = url.split('#');
    if (parts.length !== 2)
        return url;

    let hash = parts[1];
    if (hash === 'imgrc=_')
        return ' ';

    if (/(^|&)q=/.test(hash))
        return '?' + hash;

    return '#' + hash;
}

// Intercept & modify url passed into history.replaceState/pushState
function changeState(mod) {
    history.realPushState = history.pushState;
    history.realReplaceState = history.replaceState;

    history.pushState = function() {
        history.realPushState(null, null, mod(arguments[2]));
    };

    history.replaceState = function() {
        history.realReplaceState(null, null, mod(arguments[2]));
    };
}

/*
 * Link parsing functions
 */

function parserAll(a) {
    let host = a.host;
    let path = a.pathname;
    if (a.cleaned)
        return;

    if (google.test(host)) {
        if (path === '/imgres' || path === '/url')
            a.href = cleanGenericRedir(a.search);

        else if (a.search)
            a.search = cleanGoogle(a.search);

        return;
    }

    if (host === 'www.youtube.com') {
        if (path === '/watch')
            a.search = cleanYoutube(a.search);

        else if (path === '/redirect')
            a.href = cleanYoutubeRedir(a.search);

        a.cleaned = 1;
        return;
    }

    if (host === 'getpocket.com') {
        if (path === '/redirect') {
            a.href = cleanPocketRedir(a.href);
        }
    }

    parserAmazon(a);
    parserEbay(a);
    parserNewegg(a);
    parserIMDB(a);

    if (a.search)
        a.search = cleanUtm(a.search);

    if (a.hash)
        a.hash = cleanUtm(a.hash);

    a.cleaned = 1;
}

function parserGoogle(a) {
    a.removeAttribute('onmousedown');
    parserAll(a);
}

function parserGoogleImages(a) {
    let jsaction = a.getAttribute('jsaction');
    if (jsaction && jsaction.includes('down:irc.rl')) {
        console.log(a);
        a.removeAttribute('jsaction');
    }

    a.removeAttribute('onmousedown');
    parserAll(a);
}

function parserYoutube(a) {
    parserAll(a);
    let text = a.innerText;
    let href = a.href;
    if (text === href || text.endsWith('...') && href.startsWith(text.slice(0,-3)))
        a.innerText = href;
}

function parserAmazon(a) {
    if (!amazon.test(a.host))
        return;

    if (a.pathname.includes('black-curtain-redirect.html'))
        a.href = cleanAmazonRedir(location);

    else if (a.pathname.includes('/dp/'))
        a.href = cleanAmazonItemdp(a);

    else if (a.pathname.includes('/gp/product'))
        a.href = cleanAmazonItemgp(a);

    else if (a.pathname.includes('/picassoRedirect')) {
        a.href = cleanGenericRedir(a.search);
        a.search = '';
    }

    else if (a.search)
        a.href = cleanAmazonParams(a.href);

    if (a.pathname.includes('/ref='))
        a.pathname = cleanAmazonParams(a.pathname);
}

function parserEbay(a) {
    if (!ebay.test(a.host))
        return;

    if (a.pathname.includes('/itm/'))
        a.href = cleanEbayItem(a);

    else if (a.host.startsWith('pulsar.'))
        a.href = cleanEbayPulsar(a.search);

    else if (a.search)
        a.search = cleanEbayParams(a.search);
}

function parserNewegg(a) {
    if (!a.host.endsWith('.newegg.com') && !a.host.endsWith('.newegg.ca'))
        return;

    if (a.search && !a.pathname.includes('/marketplace/'))
        a.search = cleanNewegg(a.search);
}

function parserIMDB(a) {
    if (a.host === 'www.imdb.com' && a.search)
        a.search = cleanImdb(a.search);
}

function parserTwitter(a) {
    if (a.host !== 't.co')
        return;

    let fake = 't.co' + a.pathname;
    let real = a.getAttribute('data-expanded-url');
    if (real) {
        a.href = real;
        a.removeAttribute('data-expanded-url');
        sessionStorage.setItem(fake, real);
        return;
    }

    if (!a.classList.contains('TwitterCard-container'))
        return;

    real = sessionStorage.getItem(fake);
    if (real)
        a.href = real;
}

function parserFacebook(a) {
    let onclick = a.getAttribute('onclick');
    if (!onclick || !onclick.startsWith('LinkshimAsyncLink'))
        return;

    if (a.host !== 'l.facebook.com')
        return;

    a.href = cleanGenericRedir(a.search);
    a.removeAttribute('onclick');
    a.removeAttribute('onmouseover');
}

function parserDisqus(a) {
    if (a.host === 'disq.us' && a.pathname === '/url')
        a.href = cleanGenericRedir(a.search);

    parserAll(a);
}

function parserStaticice(a) {
    if (a.host.endsWith('staticice.com.au')) {
        if (a.pathname.startsWith('/cgi-bin/www.'))
            a.href = 'http://'+a.pathname.slice(9);

        else if (a.pathname !== '/cgi-bin/redirect.cgi')
            return;

        a.href = cleanGenericRedir(a.search);
    }

    if (a.host === 'www.clixgalore.com' && a.pathname === '/PSale.aspx')
        a.href = cleanGenericRedir2(a.search);

    if (a.host === 't.dgm-au.com' || a.host === 'www.kqzyfj.com') {
        console.log(a.href)
        a.href = cleanGenericRedir(a.search);
    }

    if (a.host === 't.cfjump.com')
        parserStaticiceTCF(a);

    if (a.search)
        a.search = cleanUtm(a.search);
}

function parserStaticiceTCF(a) {
    if (a.search) {
        a.href = cleanGenericRedir(a.search);
        return;
    }

    if (a.innerText.startsWith('$'))
        return;

    let siteText = a.parentNode;
    let itemLink = siteText.parentNode.parentNode.firstChild.firstChild;
    if (itemLink.host !== 't.cfjump.com') {
        a.href = itemLink.origin;
        return;
    }

    let origin = 'https://' + siteText.innerText.split(/ +\| +/)[1];
    let itemPath = itemLink.pathname.match(/^\/t\/\d+\/\d+(\/.+)/).pop()
    a.href = origin;
    itemLink.href = origin + itemPath;
}

/*
 * URL string functions
 */

function cleanGoogle(url) {
    return url.replace('?','?&').replace(googleParams, '').replace('&','');
}

function cleanBing(url) {
    return url.replace('?','?&').replace(bingParams, '').replace('&','');
}

function cleanYoutube(url) {
    return url.replace("?","?&").replace(youtubeParams,'').replace('&','');
}

function cleanImdb(url) {
    return url.replace('?','?&').replace(imdbParams,'').replace('&','').replace(/\?$/,'');
}

function cleanNewegg(url) {
    return url.replace('?','?&').replace(neweggParams,'').replace('&','');
}

function cleanAmazonParams(url) {
    return url.replace('?','?&').replace(amazonParams,'').replace('&','').replace(/\?$/,'');
}

function cleanEbayParams(url) {
    return url.replace('?','?&').replace(ebayParams,'').replace('&','');
}

function cleanAmazonItemgp(a) {
    let item = a.pathname.match(/\/[A-Z0-9]{10}/);
    return a.origin + '/gp/product' + item + a.hash;
}

function cleanAmazonItemdp(a) {
    let item = a.pathname.match(/\/dp(\/[A-Z0-9]{10})/)[1];
    return a.origin + '/dp' + item + a.hash;
}

function cleanTwitterParams(url) {
    return url.replace('?','?&').replace(twitterParams,'').replace('&','');
}

function cleanEbayItem(a) {
    let item = a.pathname.match(/\/[0-9]{12}/);
    let origList = a.search.replace(/&/g, '?').match(/\?orig_cvip=[^?]+/) || '';
    return a.origin + '/itm' + item + origList + a.hash;
}

function cleanEbayPulsar(url) {
    let item = url.match(/%7B%22mecs%22%3A%22([0-9]{12})/).pop();
    return location.origin + '/itm/' + item;
}

function cleanYoutubeRedir(url) {
    return decodeURIComponent(url.match(/[?&]q=([^&]+)/).pop());
}

function cleanAmazonRedir(url) {
    return decodeURIComponent(url.match(/[?&]redirectUrl=([^&]+)/).pop());
}

function cleanGenericRedir(url) {
    return decodeURIComponent(url.match(/[?&](new|img)?u(rl)?=([^&]+)/i).pop());
}

function cleanGenericRedir2(url) {
    return decodeURIComponent(url.match(/[?&]\w*url=([^&]+)/i).pop());
}

function cleanUtm(url) {
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {
        var pars = urlparts[1].split(/[&;]/g);
        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            if (/^utm_/.test(pars[i])) {
                pars.splice(i, 1);
            }
        }
        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}

function cleanPocketRedir(url) {
    return decodeURIComponent(url.replace('https://getpocket.com/redirect?url=', ''));
}
