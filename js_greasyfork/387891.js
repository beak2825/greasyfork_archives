// ==UserScript==
// @name         Next Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        https://quixel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387891/Next%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/387891/Next%20Downloader.meta.js
// ==/UserScript==

const isRunUrl = function(url,cb){
    $.ajax({
        url,
        type:'HEAD',
        error: function(){
            cb(false);
        },
        success: function(){
            cb(true);
        }
    });
}

$(document).ready(function () {
    console.log("Start Download Btn");
    setInterval(()=> {
        obj = document.getElementById("next-download");
        if (obj){
            return;
        } else {
            const pathname = window.location.pathname;
            const tokens = pathname.split("/");
            if ( tokens.length === 3 && tokens[1] === "assets") {
                const asset_id = tokens[2];
                console.log("Add Next Download Btn",asset_id);
                const test_url = `https://test.walton.qq.com/${asset_id}.zip`
                $('ul.css-1a9mcul').append('<button id="next-download" class="css-1lmvk87" style="white-space: nowrap;">内网下载</button>');
                isRunUrl(test_url, (res) => {
                    if (res == false) {
                        $("#next-download").text("内网无资源")
                    }
                })
                $("#next-download").click( () => {
                    if (asset_id) {
                        window.open(test_url,"_blank");
                    }
                })
            }

        }
    },1000);
});