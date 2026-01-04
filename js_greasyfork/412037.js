// ==UserScript==
// @name         Dark themed pages
// @namespace    http://tampermonkey.net/
// @version      1.000005
// @description  Alters every text of all web pages to larger-text white-on-black appearance, to aid accessibility with poor eyesight such as myopia.
// @include *
// if a webpage is unsightly with this script, add it to this list of excludes. * needs to be next to only a (dot) . or (slash) / or at start or end.
// @exclude *://*.nzcity.co.nz/*
// @exclude *://printify.com/*
// @exclude *://picsplosion.com/*
// @exclude *://analytics.google.com/*
// @exclude *://support.google.com/*
// @author       rajkumar arulambalam thankJesusforlocallight
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/412037/Dark%20themed%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/412037/Dark%20themed%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function crawl(cube){
        var x2; var x3;
        for (x2 = 0;x2 < cube.length; x2++){
          if(cube[x2].nodeType == 1 ){
                if(cube[x2].tagName == "A"){cube[x2].style.color = "#aaaaff"; cube[x2].style.backgroundColor = "#000000";}
                    cube[x2].style.lineHeight = 2; cube[x2].style.color = "#ffffff"; cube[x2].style.backgroundColor = "#333333";
  //Duplicate the line below for additional style changes, such as border colors
  //cube[x2].style.borderColor = "#FFFFFF";
  //cube[x2].style.fontSize = "16pt";// font size
}
            if(cube[x2].hasChildNodes() ){x3 = cube[x2].childNodes; crawl(x3, x3.length);}
        }
    }
function mp1 () {
var x1;
    document.body.style.backgroundColor = "#000000";
    document.body.style.color = "#ffffff";
    x1 = document.body.childNodes;
    crawl(x1);
}
setTimeout(mp1,1000);
})();