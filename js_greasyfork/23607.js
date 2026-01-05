// ==UserScript==
// @name         RHP SOTL Helpers
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automagically modify links to open forum threads to last page of thread
// @author       S_OnTheLoose
// @match        http*://*redhotpie.com.au/Adult-Forums*
// @grant        none
// @runat        document-end
// @locale       en  
// @downloadURL https://update.greasyfork.org/scripts/23607/RHP%20SOTL%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/23607/RHP%20SOTL%20Helpers.meta.js
// ==/UserScript==

function run(){
    findThreadLinks();
}

function findThreadLinks(){
    //http*://*redhotpie.com.au/Adult-Forums/*-Number
    //change to
    //http*://*redhotpie.com.au/Adult-Forums/*-Number-Page50000
    var plinks = [];
    var reg=/\S*redhotpie.com.au.Adult.Forums.*[-][0-9]+/g;
    for (var i=0; i<document.links.length;i++){
        var url=document.links[i].href;
        if (document.links[i].id.indexOf("Prev")==-1){
            if (url.indexOf("#reply")==-1){
                if (url.indexOf("-Page")==-1)
                {
                    if (reg.test(url)){
                        reg.lastIndex=0;
                        if ((document.location.href.indexOf("-Page2")!==-1)&&(document.location.href.indexOf(document.links[i].href)!==-1)){
                            // Special case: don't modify link from Page 2 to Page 1 of a thread
                        } else {
                            // Make link go to end of thread.
                            document.links[i].href=document.links[i].href+"-Page50000";
                        }
                    }
                }
            }
        }
    }
}


run();