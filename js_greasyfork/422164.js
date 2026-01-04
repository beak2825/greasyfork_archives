// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422164/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/422164/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    var original_url = 'image-lable.nos.netease.com'
            window.addEventListener('load',function(){
                var sources = document.getElementsByTagName('source')
                for( var i = 0; i < sources.length; i++){
                    var url = sources[i].src
                    if (url.indexOf(original_url) > -1) {
                        var file_name = url.split(original_url)
                        sources[i].src = 'http://' + original_url + file_name[1]
                    }
                    // http://60.13.74.113:82/2Q2W3A49D32E6947D69A3D2D4F51372D3A85FDDC4EA5_unknown_622EED666B1E0B423D8A07DDE34FD1DB203637EA_4/image-lable.nos.netease.com/4cc7b52a3d4ee98f9effa6b432e2d0e7.wav
                    // http://image-lable.nos.netease.com/0a92d8661509eac54579b4085c0883e1.wav
                }
            })
})();// ==UserScript==
