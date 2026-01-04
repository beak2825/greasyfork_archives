// ==UserScript==
// @name         Google Images without text
// @namespace    https://github.com/Prid13
// @version      1.5
// @description  Remove title and description from below images on Google Images for a cleaner and simpler look, or if you prefer the look of Bing and DuckDuckGo but love Google too much. (Enhanced for chrome extension, Google Images Restored)
// @author       Prid
// @include        /.+://.*\.?google\..+/.*search.*\?.*tbm=isch.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396223/Google%20Images%20without%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/396223/Google%20Images%20without%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    // ACTUAL CSS mods for simplified look:

    style.innerHTML  = 'div[role="main"] div[role="listitem"] > a:last-of-type { display: none !important; }';
    style.innerHTML += 'div[role="main"] div[role="listitem"] { margin-bottom: -20px !important; } ';
    style.innerHTML += 'div[role="main"] div[role="listitem"]::after { height: calc(82% + 16px) !important; } ';
    style.innerHTML += 'div[role="main"] div[role="list"] > div:not([role="listitem"]) h2 { font-size: 11px !important; padding: 2px 10px !important; } ';
    style.innerHTML += 'div[role="main"] div[role="list"] > div:not([role="listitem"]) div > a { padding: 0 8px !important; } ';


    // ----
    // Everything below is to make this work with the extension "Google Images Restored"

    var boxHeight = 0;

    setTimeout(function(){
        addOverrideHeightCss();
        boxHeight = document.getElementById("oldgisdetails").clientHeight;
        deleteOverrideHeightCss();
        console.log("HEIGHT ACQUIRED: " + boxHeight);

        document.getElementById("oldgisdetails").style.height = (boxHeight + 60) + "px";
    }, 500);

    head.appendChild(style);

    // CLICK EVENT HANDLER
    document.addEventListener("click", function(event) {
        if(event.target.role === "listitem") {
            updateTopOffset();
        }
    });

    /*window.addEventListener("keydown", function(event) {
        if (event.keyCode === 37 || event.keyCode === 39) {
            console.log("KEY PRESSED!");
            updateTopOffset();
        }
    });*/

    // FUNCTIONS
    function updateTopOffset(){
        var oldTop = parseInt(document.getElementById("oldgisdetails").style.top, 10);

        setTimeout(function(){
            var newTop = parseInt(document.getElementById("oldgisdetails").style.top, 10);
            if(oldTop == newTop){
                addOverrideTopCss(newTop - 55);
            }
        }, 100);
    }

    function addOverrideHeightCss(){
        var _style = document.createElement('style');
        _style.type = 'text/css';
        _style.id = "override-height-css";

        _style.innerHTML = "#oldgisdetails { display: flex!important; } ";

        head.appendChild(_style);
    }

    function addOverrideTopCss(px){
        deleteOverrideTopCss();

        var _style = document.createElement('style');
        _style.type = 'text/css';
        _style.id = "override-top-css";

        _style.innerHTML = "#oldgisdetails { top: " + px + "px!important; } ";
        _style.innerHTML += 'div[role="main"] div[role="listitem"]::before { bottom: 20px !important; } ';

        head.appendChild(_style);
    }

    function deleteOverrideHeightCss(){
        var _style = document.getElementById('override-height-css');
        _style.parentNode.removeChild(_style);
    }

    function deleteOverrideTopCss(){
        var _style = document.getElementById('override-top-css');
        if(_style)
            _style.parentNode.removeChild(_style);
    }

})();