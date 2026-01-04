// ==UserScript==
// @name        ScryTip - Magic/Scryfall Tooltips for Reddit
// @namespace   http://tampermonkey.net/
// @description Shows mouseover images of cards fetched from scryfall for double-bracketed card names.
// @version     2019.9.12.1
// @author      billycholeisdead
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @include     *reddit.com*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390036/ScryTip%20-%20MagicScryfall%20Tooltips%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/390036/ScryTip%20-%20MagicScryfall%20Tooltips%20for%20Reddit.meta.js
// ==/UserScript==
/* globals $, waitForKeyElements */
var api = 0; // 0 = scryfall, 1 = tappedout.net, 2 = deckstats.net

$(document).ready(function(){
    waitForKeyElements("div[data-test-id='comment'] div p", scanForCardNames);
  });

function scanForCardNames (jNode) {
    var passedArray = jNode.toArray();
    var p = passedArray[0];
    var c = p.innerHTML;
    c = c.replace(/[\[]{2}/g, "<a href='#' class='scrytip'>[[");
    c = c.replace(/[\]]{2}/g, "]]</a>");
    p.innerHTML = c;

    var links = p.getElementsByClassName('scrytip');

    if (!links.length) return;

    for (var j = 0; j < links.length; j++){
        var cardName = links[j].innerHTML;
        if (cardName.toLowerCase().startsWith("[[cardname")) continue;
        links[j].innerHTML = "<span>" + cardName + "</span>" +
            "<iframe class='scrytip-image' scrolling='no' frameborder='0'></iframe>";

        var popup = links[j].getElementsByClassName('scrytip-image');  
        
        fillPopup(popup[0], cardName.replace("[[", "").replace("]]", "")); 
    }
    
}

window.setTimeout(function() {
    var style = document.createElement('style');
    style.innerHTML = 
    '.scrytip {' + 
        'display: inline-block;' +
        'border-bottom: 1px dotted black;' +  
    '}' +

    '.scrytip .scrytip-image {' +
        'visibility: hidden;' +
        'width: 335px;' +
        'height: 453px;' + 
        'text-align: center;' +
        'overflow: hidden;' +
        'position: absolute;' +
        'top: 35%;' + 
        'left: 56.25%;' +
        'z-index: 10;' +
      '}' +
      
      '.scrytip:hover .scrytip-image {' +
        'visibility: visible;' +
      '}'
    ;

    var ref = document.querySelector('script');
    ref.parentNode.insertBefore(style, ref);
}, 1000);

function fillPopup(element, cardName) {
    
    var request = new XMLHttpRequest(), url = "", width = 335, height = 453; 

    switch (api) {
        case 0: 
            url = "https://api.scryfall.com/cards/named?fuzzy=";
            break;

        case 1:
            url = "https://tappedout.net/api/v1/render_card/?card=";
            width = 198;
            height = 285;
            break;

        case 2:
            url = "https://www.mtg-forum.de/db/get.php?card=";
            width = 202;
            height = 290;
            break;
    }
    url += cardName.replace(/[\s]/g, "+");
    
    request.open('GET', url, true);
    request.onload = function() {
        if (this.status >= 200 && this.status < 300) {
            var data = JSON.parse(this.response);
            
            var image = "";
            switch(api) {
                case 0: image = data.image_uris.normal; break;
                case 1: image = "https://" + data.render.match(/static.tappedout.net\/cache\/[0-9\/a-z]+.png/); break;
                case 2: image = data.bild_datei; break;
            }
            
            var page = "<html><head></head><body>" +
            "<img width='" + width + "px' height='" + height + "px' src='" + image + "' />" + 
            "</body></html>";
            element.setAttribute("src", "data:text/html;charset=utf-8," + escape(page));
        }
        else console.log(this.status + ": " + this.statusText + " @scryTab.fillPopup("+ url + ")");
    };
    request.send();
        
}


function waitForKeyElements (
    selectorTxt,    
    actionFunction, 
    bWaitOnce,      
    iframeSelector  
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;

        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

