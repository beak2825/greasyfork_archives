// ==UserScript==
// @name Better SearX
// @namespace -
// @version 0.3
// @description Makes SearX usage experience better
// @author NotYou
// @include *searx*
// @include *searx.be/*
// @include *searx.bar/*
// @include *xeek.com/*
// @include *searx.gnu.style/*
// @include *searx.hummel-web.at/*
// @include *searx.theanonymouse.xyz/*
// @include *s.zhaocloud.net/*
// @include *searx.webheberg.info/*
// @include *searx.zackptg5.com/*
// @include *searx.stuehieyr.com/*
// @include *searx.tux.land/*
// @include *metasearch.nl/*
// @include *procurx.pt/*
// @include *search.stinpriza.org/*
// @include *search.mdosch.de/*
// @include *searx.nevrlands.de/*
// @include *metasearch.nl/*
// @include *procurx.pt/*
// @include *search.snopyta.org/*
// @include *recherche.catmargue.org/*
// @include *search.trom.tf/*
// @include *recherche.catmargue.org/*
// @include *suche.uferwerk.org/*
// @include *sx.catgirl.cloud/*
// @include *gruble.de/*
// @include *swag.pw/*
// @include *jsearch.pw/*
// @include *searx.openhoofd.nl/*
// @include *nibblehole.com/*
// @include *search.st8.at/*
// @include *haku.ahmia.fi/*
// @include *searx.slash-dev.de/*
// @include *search.ethibox.fr/*
// @include *search.jpope.org/*
// @include *search.zdechov.net/*
// @include *engo.mint.lgbt/*
// @include *dynabyte.ca/*
// @include *timdor.noip.me/*
// @include *search.antonkling.se/*
// @include *searx.ninja/*
// @exclude *searx.space/*
// @exclude *searx.me/*
// @exclude *-searx-*
// @exclude *better-searx*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @run-at document-body
// @license GPLv3
// @license-link https://www.gnu.org/licenses/gpl-3.0.txt
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438413/Better%20SearX.user.js
// @updateURL https://update.greasyfork.org/scripts/438413/Better%20SearX.meta.js
// ==/UserScript==

/*

﹀ Change Log ﹀

0.3 Version:
- Fixed icon for searx.be

0.2 Version:
- Fixed bug #001
- Added border-radius to all images(4 pixels)

⌜BUGS⌟

BUG #001:
Change result images to logo

Features:
- Changes all icons to CSS analogs
- Title shows your request
- Fake History
- Changed Main Logo
- Changed Favicon
- Better Main Page input & logo margin
- Fixed On/Off Switch state margin

*/

// TITLE //
document.title = 'SearX';
if(window.location.pathname.indexOf("/search") != -1) {
    const searchRequest = $('input[value]').attr('value');
    document.title = 'SearX - ' + searchRequest;
} else if(window.location.pathname.indexOf("/preferences") != -1) {
    document.title = 'SearX - Preferences';
}

// FAKE HISTORY //
window.history.pushState('', '', '/search?q=Hi%20There!');
window.history.pushState('', '', '/search?q=GNU%20Philosophy');
window.history.pushState('', '', '/search?q=Free%20Software%20Foundation');
window.history.pushState('', '', '/search?q=No%20Systemd');
window.history.pushState('', '', '/search?q=Open%20BSD');
window.history.pushState('', '', '/search');

// LOGO //
if(window.location.pathname.indexOf('/') != -1) {
    $('#main-logo > .center-block.img-responsive').attr('src', 'https://searx.bar/static/themes/oscar/img/logo_searx_a.png',);
}

// FAVICON //
$('link[rel*="icon"]').prop('href','https://searx.bar/static/themes/oscar/img/favicon.png');

// ICONS //
$('span > a[href="/"]').text('').attr('class', 'home-icon'); // Home Icon
$('a[href="/about"]').text('').attr('class', 'info-icon'); // Info Icon
$('a[href="/help/en/about"]').text('').attr('class', 'info-icon'); // Info Icon(2)
$('a[href="/donate"]').text('').attr('class', 'dollar-icon'); // Donate Icon
$('a[href="/preferences"]').text('').attr('class', 'options-icon'); // Preferences Icon
$('button[aria-label="Start search"]').text('').addClass('search-icon'); // Search Icon
$('button[aria-label="Clear search"]').text('').addClass('erase-icon'); // Erase Icon
$('label[for="check-advanced"]').text('').addClass('more-icon'); // Advanced Icon
$('.glyphicon.glyphicon-backward').text('').addClass('left-icon'); // Backward Icon
$('.glyphicon.glyphicon-forward').text('').addClass('right-icon'); // Forward Icon

// CSS //

if(window.location.pathname.indexOf("/search") != -1) {
    (function() {
    let css = `
        button[aria-label="Start search"]  {
        top: 0px;
        }
        .search-icon::after {
        top: 21px;
        }
        .search-icon::before {
        top: 8px;
        }
    `;
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})(); }

(function() {
let css = `

img {
border-radius: 4px !important;
}

#clear_search {
height: 34px;
}

.pull-right {
display: flex !important;
}

.searxng-navbar {
background: rgb(19, 19, 19) none repeat scroll 0% 0%;
padding: 7px 0px;
}

#main-logo {
margin-top: 16vh;
}

.glyphicon-search::before, .glyphicon-remove::before, .glyphicon-cog::before, .glyphicon-link::before, .glyphicon-forward::before, .glyphicon-backward::before {
content: "";
}

.glyphicon-sort::before {
content: "⠀";
}

.btn.btn-default.input-lg.erase-icon {
height: 46px;
}

.btn.btn-default.input-lg.search-icon {
height: 46px;
top: 0px;
}

#search_form .input-group-btn .btn:hover {
color: rgb(36, 36, 36);
}

button[aria-label="Start search"] {
border-radius: 0px !important;
height: 34px;
top: 0px;
}

.btn.btn-default.input-lg, button[aria-label] {
border: 1px solid;
}

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
right: 73px !important;
}

.search-icon::after, .search-icon::before {
position: absolute;
content: "";
}

.search-icon::before {
top: 13px;
left: 2px;
width: 12px;
height: 12px;
border: 2px solid currentColor;
border-radius: 50%;
}

.search-icon::after {
top: 26px;
left: 8px;
width: 11px;
height: 2.5px;
border-radius: 1px;
transform: rotate(53deg);
box-shadow: 0px 0px 0px 0.1944em inset;
}

.right-icon {
box-sizing: border-box;
position: relative;
transform: scale(var(--ggs,1));
width: 16px;
height: 2px;
top: -3px;
left: -3px;
background: currentColor;
}

.right-icon::after, .right-icon::before {
content: "";
display: block;
box-sizing: border-box;
position: absolute;
width: 2px;
height: 12px;
border-right: 2px solid;
right: -5px;
top: -5px;
}

.right-icon::after {
width: 8px;
height: 8px;
border-top: 2px solid;
transform: rotate(45deg);
top: -3px;
right: 0;
}

.left-icon {
box-sizing: border-box;
position: relative;
transform: scale(var(--ggs,1));
width: 16px;
height: 2px;
top: -3px;
background: currentColor;
}

.left-icon::after, .left-icon::before {
content: "";
display: block;
box-sizing: border-box;
position: absolute;
width: 2px;
height: 12px;
border-left: 2px solid;
left: -5px;
top: -5px;
}

.left-icon::after {
width: 8px;
height: 8px;
border-bottom: 2px solid;
transform: rotate(45deg);
top: -3px;
left: 0;
}

.more-icon {
transform: scale(var(--ggs,1));
}

.more-icon, .more-icon::after, .more-icon::before {
box-sizing: border-box;
position: relative;
display: block;
width: 9px;
height: 9px;
background: currentColor;
border-radius: 100% !important;
margin-bottom: 7px;
float: right;
}

.more-icon {
left: -20px;
top: 2px;
}

.more-icon::after, .more-icon::before {
content: "";
position: absolute;
top: 0;
}

.more-icon::after {
left: -12px;
}

.more-icon::before {
right: -12px;
}

.erase-icon {
box-sizing: border-box;
position: relative;
display: inline;
transform: scale(var(--ggs,1));
width: 22px;
height: 18px;
}

.erase-icon::after, .erase-icon::before {
content: "";
display: block;
box-sizing: border-box;
position: absolute;
}

.erase-icon::before {
width: 6px;
height: 14px;
border-bottom: 4px solid transparent;
border-radius: 1px;
box-shadow: 0 0 0 2px, inset 0 -2px 0 0;
left: 8px;
top: 15px;
transform: rotate(45deg);
}

.options-icon {
box-sizing: border-box;
position: relative;
display: block;
transform: scale(var(--ggs,1));
width: 10px;
height: 2px;
box-shadow: -3px 4px 0 0, 3px -4px 0 0;
margin-top: 3px;
}

.options-icon::after, .options-icon::before {
content: "";
display: block;
box-sizing: border-box;
position: absolute;
width: 8px;
height: 8px;
border: 2px solid;
border-radius: 100% !important;
}

.options-icon::before {
top: -7px;
left: -4px;
}

.options-icon::after {
bottom: -7px;
right: -4px;
}

.dollar-icon {
box-sizing: border-box;
position: relative;
display: block;
transform: scale(var(--ggs,1));
width: 2px;
height: 20px;
background: currentColor;
margin-top: -5px;
}

.dollar-icon::after, .dollar-icon::before {
content: "";
display: block;
box-sizing: border-box;
position: absolute;
width: 10px;
height: 8px;
border: 2px solid;
}

.dollar-icon::before {
border-right: 0;
border-top-left-radius: 100px;
border-bottom-left-radius: 100px;
top: 3px;
left: -6px;
box-shadow: 4px -2px 0 -2px;
}

.dollar-icon::after {
border-left: 0;
border-top-right-radius: 100px;
border-bottom-right-radius: 100px;
bottom: 3px;
right: -6px;
box-shadow: -4px 2px 0 -2px;
}

.info-icon {
box-sizing: border-box;
position: relative;
display: block;
transform: scale(var(--ggs,1));
width: 20px;
height: 20px;
border: 2px solid;
border-radius: 40px !important;
margin-top: -5px;
}

.info-icon::after, .info-icon::before {
content: "";
display: block;
box-sizing: border-box;
position: absolute;
border-radius: 3px !important;
width: 2px;
background: currentColor;
left: 7px;
}

.info-icon::after {
bottom: 2px;
height: 8px;
}

.info-icon::before {
height: 2px;
top: 2px;
}

.home-icon {
background: linear-gradient(to left, currentColor 5px,transparent 0) no-repeat 0 bottom/4px 2px, linear-gradient(to left, currentColor 5px,transparent 0) no-repeat right bottom/4px 2px;
box-sizing: border-box;
position: relative;
display: block;
transform: scale(var(--ggs,1));
width: 18px;
height: 14px;
border: 2px solid;
border-top: 0;
border-bottom: 0;
border-top-right-radius: 3px;
border-top-left-radius: 3px;
border-bottom-right-radius: 0;
border-bottom-left-radius: 0;
border-radius: 4px 4px 0px 0px !important;
margin-bottom: -2px;
}

.home-icon::after, .home-icon::before {
content: "";
display: block;
box-sizing: border-box;
position: absolute;
}

.home-icon::before {
border-top: 2px solid;
border-left: 2px solid;
border-top-left-radius: 4px;
transform: rotate(45deg);
top: -5px;
border-radius: 3px !important;
width: 14px;
height: 14px;
left: 0;
}

.home-icon::after {
width: 8px;
height: 10px;
border: 2px solid;
border-radius: 100px 100px 0px 0px !important;
border-bottom-left-radius: 0;
border-bottom-right-radius: 0;
border-bottom: 0;
left: 3px;
bottom: 0;
}

`;
if (typeof GM_addStyle !== 'undefined') {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();








