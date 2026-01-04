// ==UserScript==
// @name         Tweaks for The Devil's Panties
// @namespace    http://thedevilspanties.com
// @include      *://thedevilspanties.com/*
// @require      http://code.jquery.com/jquery-3.4.1.slim.min.js
// @run-at       document-end
// @license      MIT
// @description  Adds a text box with comic hover text, ensures comic is shown at full resolution, and adds keyboard arrow navigation.
// @version 0.0.1.20220703160050
// @downloadURL https://update.greasyfork.org/scripts/447394/Tweaks%20for%20The%20Devil%27s%20Panties.user.js
// @updateURL https://update.greasyfork.org/scripts/447394/Tweaks%20for%20The%20Devil%27s%20Panties.meta.js
// ==/UserScript==

function xpath(query) {
    return document.evaluate(query, document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

var result = xpath('//div[@class="comicpane"]/img[@title]');

if(result.snapshotLength > 0)
{
    var navbar = document.createElement("div");
    navbar.innerHTML = '<div style="font-variant: normal; font-weight: normal; font-size: medium; color: #FFFFFF; font-family: monospace; border-style: solid; border-width: 1px">' + result.snapshotItem(0).title + '</div>';
    result.snapshotItem(0).parentNode.appendChild(navbar, result.snapshotItem(0));
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(
'#page-wide {' +
'width:1100px;' +
'}'
);

addGlobalStyle(
'#comic-wrap {' +
'width:100%;' +
'}'
);

function handleKey( e )
{
    var $ = window.jQuery;
    if( e.keyCode == 37 )
    {
        if( $('a.navi-prev')[0] !== undefined )
        {
            $('a.navi-prev')[0].click();
        }
    }
    if( e.keyCode == 39 )
    {
        if( $('a.navi-next')[0] !== undefined )
        {
            $('a.navi-next')[0].click();
        }
    }
}

(function() {
    'use strict';
    var $ = window.jQuery;
    document.onkeydown = handleKey;
})();
