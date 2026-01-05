// ==UserScript==
// @name         FamilySearch Chrome Prerender (FF3)
// @version      0.1
// @description  makes it faster to go through lots of images on the browser
// @author       You
// @match        https://familysearch.org/pal*
// @grant        none

// @namespace https://greasyfork.org/users/12346
// @downloadURL https://update.greasyfork.org/scripts/10818/FamilySearch%20Chrome%20Prerender%20%28FF3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10818/FamilySearch%20Chrome%20Prerender%20%28FF3%29.meta.js
// ==/UserScript==


$(document).ready(function() {
    var getMeta = function(attr) {
        var nextResult = $.grep(imageMeta.properties,function(n) {return n.type.indexOf(attr) >-1});
        if(nextResult.length > 0) {
            return nextResult[0].value;
        }
        return null;
    };
    var next = getMeta("next");
    var prev = getMeta("prev");
    var prerender = (document.referrer == next) ? prev : next;
    $("body").append("<link rel='prerender' href='" + prerender + "'/>");
    $(document).keypress(function(e) {
        if(e.which == 38) {
           window.location.href = next;
        }else if(e.which == 37) {
           window.location.href = prev;
        } else if (e.which == 32) {
           window.location.href = prerender;
        }
    });
});

