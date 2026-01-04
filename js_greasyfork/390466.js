// ==UserScript==
// @name         Absolute Core Jenkins Utils
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  try to take over the world!
// @author       You
// @match        https://dvsjenmas1.absolute.com/job/core/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390466/Absolute%20Core%20Jenkins%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/390466/Absolute%20Core%20Jenkins%20Utils.meta.js
// ==/UserScript==

const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1>>>16, 2246822507) ^ Math.imul(h2 ^ h2>>>13, 3266489909);
    h2 = Math.imul(h2 ^ h2>>>16, 2246822507) ^ Math.imul(h1 ^ h1>>>13, 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
    'use strict';
    var $, jQuery;
    $ = jQuery = window.jQuery;
    //console.log("Absolute Core Jenkins Tampermonkey Script.");
    var components=["ctes", "dur-win", "dur-mac", "ans-win", "ans-mac", "avp-win", "avp-mac", "hdc-win", "hdp-mac", "per-win", "sng-mac", "sng-win", "sdc-mac", "sdc-win", "sdc-win", "esp-mac", "esp-win", "dfz-mac", "dfz-win", "sdw-mac", "sdw-win", "eac"];
    var links=$("#projectstatus .model-link");

    addGlobalStyle('.dashboard { width: 61% !important; float: left !important; }');
    addGlobalStyle('#release-dashboard { width: 32% !important; padding: 20px; float: left !important; margin-left: 10px !important; border: 1px solid #f0f0f0; background-color: #fafafa; border-radius: 4px; }');
    addGlobalStyle('.trc_title { font-size: 1.3em; cursor: pointer; margin: 4px 10px; }');
    addGlobalStyle('.trc_body { display: normal; padding: 10px 20px 20px 32px; }');

    $('#main-panel').append("<div id='release-dashboard'><h1>Release QuickLook</h1><div id=\"release_container\"></div></div>");

    $.each( links, function( key, link ) {
        if(components.includes(link.title)){
            //console.log(link.title);
            var theurl = link.href;
            var thetitle = link.title;
            //console.log(theurl);
            $.get( theurl, function( data ) {
                var innerLinks = $(data).find("#projectstatus .model-link");
                for(var i = 0; i < innerLinks.length; i++) {
                    var innerLink = innerLinks[i];
                    var thehref = decodeURIComponent(innerLink.href);
                    //console.log(innerLink);
                    if(thehref.includes("release%2F") || thehref.includes("hotfix%2F")) {
                        if(thehref.includes("lastSuccessfulBuild") || thehref.includes("lastFailedBuild")){
                            continue;
                        }
                        var lastpart = thehref.substring(thehref.lastIndexOf('job/') + 4);
                        lastpart = decodeURIComponent(lastpart.substring(0, lastpart.length-1));
                        var id = cyrb53(lastpart);
                        var the_release_container = $('#'+id);

                        if(the_release_container.length <= 0){
                            $('#release_container').append("<div id=\"trc_"+id+"\" trc_target=\"trc_body_"+id+"\" class=\"trc_title\">➤ "+lastpart+"</div><div id=\"trc_body_"+id+"\" class=\"trc_body\"></div>");
                        }

                        $("#trc_"+id+"").click(function(e){
                            var trc_target = $(e.currentTarget).attr("trc_target");
                            //console.log(trc_target);
                            $('#'+trc_target).toggle();
                        });

                        $("#trc_body_"+id+"").append("<a href=\""+theurl+"\">"+thetitle+"</a> <br/>");

                        //console.log(lastpart);
                        //console.log(thehref);
                    }
                }
            });
        }
    });

})();