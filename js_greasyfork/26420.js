// ==UserScript==
// @name            Google Search shows 'Cached' again! ('Im Cache'.de_DE)
// @namespace       cortex
// @description     Provides the 'Cached' button for each searchresult. 
// @include         http://www.google.*
// @include         https://www.google.*
// @include         http://webcache.googleusercontent.*
// @include         https://webcache.googleusercontent.*
// @version         1.2.0
// @run-at          document-start
// @icon            https://goo.gl/ZglzYI
// @downloadURL https://update.greasyfork.org/scripts/26420/Google%20Search%20shows%20%27Cached%27%20again%21%20%28%27Im%20Cache%27de_DE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26420/Google%20Search%20shows%20%27Cached%27%20again%21%20%28%27Im%20Cache%27de_DE%29.meta.js
// ==/UserScript==

function main(e) {
    if (insideCache) casche(e);
    else rezultz(e);
}

const bref = "http://webcache.googleusercontent.com/search?ie=UTF-8&q=cache:";

var iconAcnhor, gComemBack, insideCache;

function rezultz(e) {
    if (Xel('//a[starts-with(@class,"googCacheComeBack")]')) {
        return;
    }
    if (e) e.preventDefault(), e.stopPropagation();
    try {
        var rez = Xels('//div[@id="search"]//div[@class="g"]');
        for (var i = 0, li = rez.length; i < li; i++) {
            var a = Xel('.//a', rez[i]);
            a.removeAttribute("onmousedown");
            var aref = bref + hesc(a.href); //
            var cache = buildEl('span', {
                style: 'color: black'
            }, null, ' &#x2023; ');
            cache.appendChild(buildEl('a', {
                href: aref
                , 'class': 'googCacheComeBack fl'
                , target: '_blank'
            }, null, 'gCache'));
            var cite = Xel('.//cite', rez[i]);
            cite && cite.appendChild(cache);
        }
    }
    catch (e) {
        GM_log('cacherr:\n' + e)
    }
}

function casche(e) {
    if (Xel('//a[starts-with(@class,"gooCache")]')) {
        return;
    }
    if (runByEsc || runByEscCached) e.preventDefault(), e.stopPropagation();
    var hloc = location.href + '';
    hloc = hloc.split(/\/?\#|\%23/)[0];
    var loc = hloc.match(/[\&\?]q\=cache\:(.*)/);
    if (!loc || !loc[1]) {
        GM_log('not webcache\n' + hloc);
        return;
    }
    loc = Xel("/html/body/div/div/a").href + '';
    var ctr = 0;
    var dom = FLD(loc);
    var L = unsafeWindow.document.links;
    GM_addStyle(iconAcnhor);
    for (var i = L.length - 1; i >= 0; i--) {
        var ref = L[i].href.split(/\/?\#|\%23/);
        if (ref.length > 1 && ref[0] == loc) {
            L[i].href = hloc + '#' + ref[1];
            L[i].removeAttribute("onmousedown");
            L[i].className = (L[i].className ? L[i].className + ' ' : '') + 'gooCacheAnchor';
        }
        else {
            var refdom = FLD(ref[0]);
            if (refdom && dom) {
                e = buildEl('a', {
                    'class': (refdom.d == dom.d) ? 'gooCacheLink' : 'gooCacheExt'
                    , /* */
                    title: 'cached'
                    , /* */
                    href: bref + hesc(L[i].href)
                }, null, ''); //'&darr;'
                insAfter(e, L[i]);
            }
        }
    }
}

function hesc(href) {
    var hr = href + '';
    const re = /^(.+?)([\?\#\&].*)$/;
    var m = hr.match(re);
    if (m && m.length == 3) {
        hr = m[1] + escape(m[2]);
    }
    return hr;
}

function buildEl(type, attrArray, eL, html) {
    var node = document.createElement(type);
    for (var attr in attrArray)
        if (attrArray.hasOwnProperty(attr)) node.setAttribute(attr, attrArray[attr]);
    if (eL) node.addEventListener(eL[0], eL[1], eL[2] ? true : false);
    if (html) node.innerHTML = html;
    return node;
}

function Xel(XPath, contextNode) {
    var a = document.evaluate(XPath, (contextNode || document), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return (a.snapshotLength ? a.snapshotItem(0) : null);
}

function Xels(XPath, contextNode) {
    var ret = []
        , i = 0;
    var a = document.evaluate(XPath, (contextNode || document), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    while (a.snapshotItem(i)) ret.push(a.snapshotItem(i++));
    return ret;
}

function FLD(url) {
    var dm = url.match(/^(https?\:)\/\/(.+?)\//);
    if (!dm || dm.length < 3) return null;
    dd = dm[2].split('.');
    if (dd.length < 2) return null;
    return {
        p: dm[1]
        , d: dd[dd.length - 2] + '.' + dd[dd.length - 1]
    };
}

function insAfter(n, e) {
    if (e.nextSibling) {
        e.parentNode.insertBefore(n, e.nextSibling);
    }
    else if (e.nextElementSibling) {
        e.parentNode.insertBefore(n, e.nextElementSibling);
    }
    else e.parentNode.appendChild(n);
}

iconCacheLink = 'content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAABMklEQVQoz42QP0tCYRSHnxuXhjCIigtW4KBRweuU1NDS0lIY9AFaWqItDIy+goM01RAI0ewkCG1BShQuweXqTRwasugS9EejWk6DaPfmTfot73nPOQ+/c46GS+l8Xdz/xPKYRi+l83VxmiIiIk5T5PjcERVPyr8AFU+Kiiclf/0qm0e2L6i3g9EBiK7uYuZSGkBla1uGA/2+Jn3t4MuneFNv+EJaofouewenPfc1JiJkd6KaZ7y1pXmK5SduHxWl2k9zLAwhw8Q+O/HudFV99gDpjXtqD00u7QilGoSMbmcd8ABzk0NMjwdYmX2jctegWP4DcqvtnL1QwCCxcLAbcl4+CRkmoEhkgsTCAK23NZ6Jbfk4LcyMAC3w9yH8pANkDvc7CeUqflhgWzC1uI6ZS3Xy35M8hMl4RkDrAAAAAElFTkSuQmCC)';
iconAcnhor = '.gooCacheAnchor:after{position: relative; top: 6px;content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAKCAYAAACJxx+AAAAAWElEQVR42mNkQAM6vmX/r2zuYoTxGdEl1R1iGW4eWMwAU8RIkgnBvZf/w9hri3XJMAGnApDRMCORFYDE4YIg14MUwRSAJEG+gSsA0SBFMADzKkY4wNgwawC9Qz2rUJ9HmwAAAABJRU5ErkJggg==)}.gooCacheLink:before{position: relative; top: 6px; opacity: 0.8;' + iconCacheLink + '}.gooCacheExt:before{position: relative; bottom: 4px; opacity: 0.8;content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAKCAYAAACJxx+AAAAAkklEQVR42mNkQALbLn76f+PpF4b1u08yvL9zHCzGyIAF9G179h+miBGXZKCrOdgkRmTVICCoYgmWLPKSAssx2hau/w8S4BaTBCuY3FgOVnS4P5AR5CZGHd+y/7n1nWAJZHBlcxfYehQFSZkFYJNAbBQFMAkQ+PrqOcO86RMQCkBuADkQZC8IwNggN4AV4PMFiA8ADbFh5B0GQNAAAAAASUVORK5CYII=)}.googCacheComeBack{}';

// from: [http://userstyles.org/styles/64844/google-search-plain-view-cached-similar-links]
// by luckymouse [http://userstyles.org/users/14255]
gComeBack = '\
.clickable-dropdown-arrow.ab_button\
,a[id^="am-b"].ab_button\
 {display: none !important;}\
.action-menu.ab_ctl {\
position: static !important;\
display: inline-block !important;\
margin: 0 !important; \
vertical-align: baseline !important;}\
.action-menu-panel.ab_dropdown {\
visibility: visible !important;\
position: static !important;\
box-shadow: none !important;\
border: none !important;}\
.ab_dropdownitem {display: inline !important;}\
.ab_dropdownitem::before,\
.ab_ctl + a.fl[href*="translate.google.com/"]::before\
{content: "\\00a0\\2023"; color: #000;\
padding-right: 2px; font-size: 14px !important;}\
.ab_dropdownitem:hover {cursor: auto !important; background: transparent !important;}\
.action-menu a[id^="am-b"],/*14-05-20*/\
.action-menu-item div.action-menu-button {display: none !important; }\
.action-menu-item a.fl {\
color: #1122CC !important;\
display: inline !important;\
padding: 0 3px 0 0 !important;\
font-size: 14px !important;\
}\
.action-menu-item a.fl:hover {text-decoration: underline !important;}\
/*2013-06-14*/\
.action-menu-panel.ab_dropdown {background-color: transparent !important;}\
div.f[style*="white-space:nowrap"] {white-space:normal !important;} \
.action-menu-button {display: inline !important; }/**/\
.kv, .slp { display: inline-block !important; padding-left: 4px !important;}\
/*2014-07-14*/\
.s .f.slp:empty{display:none!important;}\
.s span.st {display:inline-block !important;}\
.cr-dwn-arw{margin-left: 2px!important;}\
';
insideCache = location.href.indexOf('webcache') >= 0;
if (!insideCache) GM_addStyle(gComeBack);