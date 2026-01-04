// ==UserScript==
// @name         Discogs embed youtube
// @version      0.2
// @description  Embed youtube videos on PTH forums
// @author       Chameleon
// @include      https://www.discogs.com/search/?*
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/35172/Discogs%20embed%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/35172/Discogs%20embed%20youtube.meta.js
// ==/UserScript==




(

    function() {
        'use strict';

        var links = document.getElementsByClassName('search_result_title');
        var frames = [];
        var as;
        var link;
        var iframe;

        var length = links.length;


        for(var i = 0; i<length; i++){


            var cardBody;
            var fullCard;
            var iframeDoc;
            var iframeLoaded;

            link = links[i].href;
            frames[i] = document.createElement('iframe');
            iframe=frames[i];
            iframe.setAttribute('id', 'iframe'.concat(i));
            iframe.src = link;
            iframe.height = "250px";
            iframe.width = "250px";
            iframe.scrolling = "no";
            iframe.overflow = "hidden";

            cardBody = links[i].parentNode.parentNode;
            fullCard = cardBody.parentNode;
            cardBody.appendChild(iframe);
           // frames[i].onload = function() { console.log( i+" "+iframe.id+iframe.contentDocument.getElementById("youtube_player_wrapper")); };
iframe.onload = function() {if(this.contentDocument.getElementById("youtube_player_wrapper")===null){var frm = window.parent.document.getElementById(this.id); frm.parentNode.parentNode.parentNode.removeChild(frm.parentNode.parentNode);}else{var yt   = this.contentDocument.getElementById("youtube_player_wrapper").cloneNode(true);var page = this.contentDocument.getElementsByClassName("mac chrome chrome61")[0];page.parentNode.removeChild(page);this.contentDocument.documentElement.appendChild(yt);} };

        }

    })();