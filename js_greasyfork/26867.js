// ==UserScript==
// @author          Jack_mustang
// @version         1.0
// @name            ExtendXVideos
// @description     Remove ads, enlarge video, auto-centre video & block pop-ups
// @date            2016 January 27
// @include         *xvideos.com/*
// @run-at          document-start
// @grant           none
// @license         Public Domain
// @icon            https://szvicq-dm2306.files.1drv.com/y3mUIY4UTuouBPHkXB4lw5qpXPSuf83fD-35aldAlxuWGjVUt0WEP8WQsZRV_-QcAsN5cKkWUFdZl6afpyfGNDpC1uFbsy3MSTftxjKzUnk1ZmCJemVtOTtS08eFYfEElGYwBcZbwE3tEescW3q7wEq7TMy0eGe8DmOYzWOD2qd5gM?width=145&height=145&cropmode=none
// @namespace       88769cc55590fe09dfd8445da5193c9537a2d02c
// @downloadURL https://update.greasyfork.org/scripts/26867/ExtendXVideos.user.js
// @updateURL https://update.greasyfork.org/scripts/26867/ExtendXVideos.meta.js
// ==/UserScript==

// Disable popups
function NoOpen(e){return 1}
parent.open=NoOpen;
this.open=NoOpen;
window.open=NoOpen;
open=NoOpen;
window.open = function(){return;}
open = function(){return;}
this.open = function(){return;}
parent.open = function(){return;}

(function extendXVideos() {
    var proxied = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        // Allow video download logged out
        if (!window.xv.conf.data.login_info.is_logged && arguments[1].match(/video-download/)) {
            this.onreadystatechange = function() {
                    Object.defineProperty(this, "responseText", {writable: true});
                    var message = {
                        "LOGGED": true,
                        "URL": html5player.url_high,
                        "URL_LOW": html5player.url_low
                    };
                    this.responseText = JSON.stringify(message);
            }
            return proxied.apply(this, [].slice.call(arguments));
        }
        // Block ads, allow from xvideos.com
        if (arguments[1].match(/^\/\w|xvideos\.com\//)) {
            return proxied.apply(this, [].slice.call(arguments));
        }
        return false;
    }
    // Page modification without CSS
    window.addEventListener("DOMContentLoaded", function() {
        // More tiles in pages that had side ads
        if (document.querySelector(".mozaique:not(.thumbs-4)")) {
            document.querySelector(".mozaique:not(.thumbs-4)").className = "mozaique thumbs-4";
        }
        // Scroll to center video
        if (document.querySelector("body > #page.video-page")) {
            document.querySelector("#page.video-page #content").className = "player-enlarged";

            function scrollthere() {
                var vid = document.querySelector("#content"),
                    vh = vid.offsetHeight,
                    vd = vid.offsetTop,
                    fh = window.innerHeight,
                    sc = vd-((fh-vh)/2)
                console.log(vd)
                scrollTo(0, sc)
            }// Now inject this function
            var script = document.createElement("script")
            script.setAttribute("type","text/javascript")
            script.innerHTML = scrollthere.toString() + "scrollthere();"
            script.id = ("ERT-scrollVid")
            document.head.appendChild(script)

            // Keyboard Shortcut for centring
            window.addEventListener("keyup", function(e) {
                if(e.ctrlKey && e.altKey && (e.code === "KeyC" || (e.code === undefined && e.keyCode === 67)))
                    scrollthere()
            }, false)

            // Include button in right corner to center video on screen;
            var node = document.createElement("div")
            node.setAttribute("style", "position:fixed; bottom:0; right:0; cursor:pointer; background:#f2f2f2; padding:5px 10px; border:1px solid #d9d9d9; border-top-left-radius: 5px; z-index: 10000")
            node.setAttribute("onclick", "scrollthere();")
            node.setAttribute("title", "Ctrl+Alt+C (Other layouts use the key where C would be on the QWERTY layout)")
            node.innerHTML = "Centre"
            document.body.appendChild(node)
        }
    });
}());

// Inject CSS to modify page
(function addStyle() {
    // While <head> is not loaded we keep trying
    if (!document.querySelector("head")) {
        return setTimeout(addStyle, 50);
    }

    // We create an object and start including its content to include in DOM at the end.
    var exvcss =
    ".pagination ul {\
        display: table;\
        margin: auto;\
        font-size: 2em;\
    }\
    #main > div[id].mobile-hide:not([id=content]),\
    #content > div.mobile-hide:first-child,\
    .sponsor_popup {\
        display: none;\
    }";
    var exvnode = document.createElement("style");
        exvnode.type = "text/css";
        exvnode.id = "EAST-style";
        exvnode.appendChild(document.createTextNode(exvcss));
    document.head.appendChild(exvnode);
}());