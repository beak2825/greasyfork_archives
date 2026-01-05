// ==UserScript==
// @id           GetVideosFromTSS
// @name         GetVideosFromTSS
// @namespace    https://github.com/plablo/VimeoFrameDownload
// @version      0.1
// @description  Get the vimeo videos from TSS with highest resolution.
// @author       Plablo
// @license      GetVideosFromTSS is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
// @include      https://thesecuritysentinel.es/*
// @compatible   chrome
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24518/GetVideosFromTSS.user.js
// @updateURL https://update.greasyfork.org/scripts/24518/GetVideosFromTSS.meta.js
// ==/UserScript==

var getIframeContent = function (iframe, callback){ //Get the content from the iframe element and send it to setVideoLink.
    GM_xmlhttpRequest({
        method: "GET",
        url: iframe.src,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, sdch, br",
            "Accept-Language": "es-ES,es;q=0.8,en;q=0.6,gl;q=0.4",
            "Referer": "https://thesecuritysentinel.es/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
        },
        onload: function(response) {
            if (response.status == 200){ //OK
                callback(iframe, response.response);
            }
        },
        onError: function() {
            alert('Cannot load url: "'+url+'"');
        }
    });
};

function setVideoLink (iframe, content){ //Get the video link and insert an anchor under the video frame.
    if (content){
        var jsontext = content.match(/(\{"cdn_url"[^;]*\})/g);
        if (jsontext){
            jsontext = JSON.parse(jsontext);
            //Run trought all elements selecting the highest resolution.
            var x;
            var best_quality = 0;
            for (i = 0; i < jsontext.request.files.progressive.length; i++){
                if (parseInt(jsontext.request.files.progressive[i].quality) > parseInt(jsontext.request.files.progressive[best_quality].quality)){
                    best_quality = i;
                }
            }
            //Add the link under the video frame.
            var link = jsontext.request.files.progressive[best_quality].url;
            jQuery(function($) {
                $("<p><a href='"+link+"' target='_blank' style='background-color: #4CAF50; color: white; border-radius: 25px; padding: 15px 32px; text-align:center;display: inline-block;'>Download</a></p>").insertAfter(iframe);
            });
        }
    }
}

jQuery(function($) { // DOM is now ready and jQuery's $ alias sandboxed
    //Get all the video iframes...
    var iframes = $("iframe[src*='vimeo']");
    //...and do the magic (if any).
    if (iframes){
        for (i = 0; i < iframes.length; i++){           
            getIframeContent(iframes[i],setVideoLink);
        }
    }

});
