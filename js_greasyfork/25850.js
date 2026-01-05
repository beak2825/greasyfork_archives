// ==UserScript==
// @name         Skipper123
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the skipper!
// @author       You
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @include      *mirrorcreator.com/files/*
// @include      *mirrorcreator.com/show*.php*
// @include      *linkshrink.net/*
// @include      *//sh.st/*
// @include      *//viid.me/*
// @include      /^https?://www\.solidfiles\.com/[dv]/.*$/
// @include      /^https?://adf\.ly/.*$/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/25850/Skipper123.user.js
// @updateURL https://update.greasyfork.org/scripts/25850/Skipper123.meta.js
// ==/UserScript==

(function() {
    'use strict';    
    Add(/.*www\.mirrorcreator\.com\/files\/.*/,mirrorcreator1,true);
    Add(/.*www\.mirrorcreator\.com\/show.*\.php.*/,mirrorcreator2);
    Add(/.*linkshrink\.net\/.*/,linkshrink);
    Add(/.*sh\.st\/.*/,shst);
    Add(/.*viid\.me\/.*/,shst);
    Add(/^https?:\/\/www\.solidfiles\.com\/[dv]\/.*$/,solidfiles);
    Add(/^https?:\/\/adf.\ly\/.*$/, adfly);
})();

function Add(path,func,atStart) {
    if(path.test(window.location)) {
        if(atStart) {
            func();
        } else {
            $(document).ready(func);
        }
    }
}

function mirrorcreator1() {
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if(this.readyState == 4){
                    if(this.responseURL.indexOf('mirrorcreator.com/mstat')>0){
                        //if(confirm('Solidfiles next?')){
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
}

function mirrorcreator2() {
    document.location = document.getElementById('redirectlink').getElementsByTagName('a')[0].href;
    //document.location = $("#redirectlink a").attr("href");
}

function linkshrink() {
    var idx =document.location.pathname.indexOf("=http://");
    if(idx>0){
        document.location = document.location.pathname.substr(idx+1);
    } else {
        var link = $("#skip a");
        if(link && link.length > 0)
            document.location = link[0].href;
    }
}

function shst() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ("onfocusin" in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    document.__defineGetter__(hidden, function() { return false; });

    function check() {
        setTimeout(function() {
            var skip = document.getElementById("skip_button");
            if(skip) {
                var style = window.getComputedStyle(skip);
                if(style.display == "block") {
                    skip.click();
                    app.skipClickNotify.skipButtonAction({stop:function(){return true;}});
                    return;
                }
            }
            check();
        }, 500);
    }

    function onchange (evt) {
    }

    // set the initial state (but only if browser supports the Page Visibility API)
    if( document[hidden] !== undefined )
        onchange({type: document[hidden] ? "blur" : "focus"});

    check();
}

function solidfiles() {
    var loc = $("#download-btn");
    if(loc && loc[0] && loc[0].href) {
        document.location = loc[0].href;
    } else {
        var btn = $("form button[type=submit]");
        if(btn && btn[0]) {
            btn[0].click();
        }
    }
}

function adfly() {
    function check() {
        setTimeout(function() {
            var skip = document.getElementById("skip_button");
            if (skip && skip.href) {
                document.location = skip.href;
            }
            check();
        }, 500);
    }
    check();
}