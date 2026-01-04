// ==UserScript==
// @name         Spankbang show direct download urls
// @namespace    CYD
// @version      0.1
// @description  Spankbang show download urls
// @author       CYD
// @match        https://spankbang.com/*/video/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/435037/Spankbang%20show%20direct%20download%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/435037/Spankbang%20show%20direct%20download%20urls.meta.js
// ==/UserScript==

function changeFunc(time, funcName){
    setTimeout(function(){
        funcName();
        changeFunc(time * 2, funcName);
    },time)
}

function M(){
    list_downloads = function (mod) {
        var dls = api_call('download', $('#video').data('streamkey'), 0);
        var btns = mod.find('section.download-list');
        dls.done(function(dls) {
            btns.find('.loader').hide();
            dls['results'].forEach(function(entry) {
                let download_url = entry.url;
                let download_quality = entry.quality;
                if (download_url.indexOf('/users/upload') === -1) {
                    var btn = btns.find('.b_' + download_quality);
                    btn.css('display','block');
                    btn.on('click', function() {
                        start_download(download_url, download_quality);
                    });
                    btn.after(`<p style="word-break:break-all">${download_url}</p>`)
                } else {
                    btns.find('.b_' + download_quality).html(svg_icon('upload') + ' Upload one video to unlock ' + download_quality + ' download').addClass('limit').fadeIn(250).on('click', function() {
                        start_download(download_url + '?utm_source=download_limit&return=' + encodeURIComponent(window.location.href + '#auto_download'), download_quality);
                    })
                }
            });
        });
    }
}
changeFunc(2000, M);