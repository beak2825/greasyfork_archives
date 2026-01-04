// ==UserScript==
// @name         IndexOftoM3u
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Transform Index Of webpage to an playable m3u file with media player
// @author       roondar
// @match        http*://*/*
// @grant        GM_registerMenuCommand
// @run-at document-start
// @require     http://cdn.jsdelivr.net/g/filesaver.js
// @downloadURL https://update.greasyfork.org/scripts/37003/IndexOftoM3u.user.js
// @updateURL https://update.greasyfork.org/scripts/37003/IndexOftoM3u.meta.js
// ==/UserScript==
if (document.title.match(/Index of/) ){
GM_registerMenuCommand('Download mp3ufile', tom3u);
}
function tom3u() {
        var table = document.getElementsByTagName('table')[0];
        var items = ['#EXTM3U\n\n'];
        for (var i = 3, row; row = table.rows[i]; i++) {
            var link = row.getElementsByTagName('a');
            if (link.length > 0){
                var url = link[0].href;
                var url2 = decodeURIComponent(url);

                items.push('#EXTINF:-1,'+url2.substring(url2.lastIndexOf('/')+1)+'\n');
                items.push(url+'\n\n');
            }
        }
       var blob = new Blob(items, {type: "audio/x-mpegurl; charset: UTF-8"});
       saveAs(blob, "play.m3u");
   
}