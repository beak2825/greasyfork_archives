// ==UserScript==
// @name         mirrorcreator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  mc
// @author       You
// @match        www.mirrorcreator.com/files/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22682/mirrorcreator.user.js
// @updateURL https://update.greasyfork.org/scripts/22682/mirrorcreator.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if(this.readyState == 4){
                //console.log(this);
                //console.log(this.responseURL);
                if(this.responseURL.indexOf('mirrorcreator.com/mstat')>0){
                    //if(confirm('Solidfiles next?')) {
                        var img = document.getElementsByTagName('img');
                        var sf = null;
                        for(var i=0;i<img.length;i++) {
                            if(img[i].src.toLowerCase().indexOf("solidfiles")>=0) {
                                sf=img[i];
                                break;
                            }
                        }
                        if(sf) {
                            var parent = sf.parentElement;
                            var sibling = parent.nextElementSibling;
                            var links = sibling.getElementsByTagName('a');
                            if(links.length>0) {
                                document.location = links[0].href;
                            } else {
                                //console.log("Solidfiles link not found");
                            }
                        }
                        else
                        {
                            //console.log("Solidfiles not found");
                        }
                    //}
                }
            }
        }, false);
        
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

