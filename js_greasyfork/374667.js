// ==UserScript==
// @name        BlueCat Address Manager Color Change
// @namespace   *
// @description Change the color of the UI in BlueCat Address Manager
// @include     */app*
// @version     3
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license     MIT
// @grant       none
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/374667/BlueCat%20Address%20Manager%20Color%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/374667/BlueCat%20Address%20Manager%20Color%20Change.meta.js
// ==/UserScript==

// -----------------------------------------------------------------------
// Please Adjust this to reflect the hostname of the URL you access
// -> Can be a full qualified name or hostname only

var redHost = "bam-01.n3k.de";
var greenHost = "bam-02";
// -----------------------------------------------------------------------


// CODE

if (document.readyState === "interactive" ) {
    if (window.location.hostname == redHost) {
        //red
        rotateTo("165");
    } else if (window.location.hostname == greenHost) {
        //green
        rotateTo("-85");
    }
}

function rotateTo(value) {
    var rotation=value;
    var links = document.getElementsByTagName("link");
    var linksList = Array.prototype.slice.call(links);
    linksList.forEach(function(link) {
        if (link.href.includes("/cached-style/proteus-silver.css")) {
            var sheet = link.sheet;
            var rule = ".tab-bar { filter: hue-rotate("+rotation+"deg)}";
            var rule2 = "#banner { position: sticky; top: -3px; filter: hue-rotate("+rotation+"deg)}";
            var rule3 = ".navigation-bar { position: sticky; top: 54px;}";
            sheet.insertRule(rule,0);
            sheet.insertRule(rule2,0);
            sheet.insertRule(rule3,0);
        }
    });
};