// ==UserScript==
// @name         My Music
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  For fun!
// @author       Steven
// @match        *.kuwo.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      *
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408669/My%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/408669/My%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = location.href;
    if (url.indexOf('_detail') < 0){
        return;
    }
    var musicId = url.split('_detail/')[1];
    console.log('musicId: ', musicId);
    var url1 = 'http://player.kuwo.cn/webmusic/st/getNewMuiseByRid?rid=MUSIC_' + musicId;
    //$.get(url1, {}, function(res){
     //   console.log(res);

   // })

    GM.xmlHttpRequest({
        method: "GET",
        url: url1,
        //data: 'typeName=XXX&content=XXX&options=XXX',
        //headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            }
            var text = response.responseText;
            var head = text.match(/mp3dl>(\S*)\<\/mp3dl/)[1];
            var body = text.match(/mp3path>(\S*)\<\/mp3path/)[1];
            console.log(head + body);
            setTimeout(function(){
                //console.log($('.download.bg_primary')[0])
                $('.download.bg_primary')[0].href = 'http://' + head + body;
            }, 2000)

        }
    });
})();