// ==UserScript==
// @name         Steam - Türkçe Yama Deposu
// @namespace    https://teknoseyir.com/u/0x0001
// @version      1.5
// @description  https://teknoseyir.com/durum/671175
// @author       0x0001 https://teknoseyir.com/u/0x0001 - basteryus https://teknoseyir.com/durum/671175
// @include      https://store.steampowered.com/app/*
// @include      https://steamcommunity.com/sharedfiles/filedetails/?id=464077817
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369653/Steam%20-%20T%C3%BCrk%C3%A7e%20Yama%20Deposu.user.js
// @updateURL https://update.greasyfork.org/scripts/369653/Steam%20-%20T%C3%BCrk%C3%A7e%20Yama%20Deposu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!location.pathname.startsWith('/app/')) {return true;}
    function createDomBlock() {
        var block = document.createElement('div');
        block.className = 'block responsive_apppage_details_left';
        block.innerHTML = '<div class="block_title"><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=464077817">Türkçe Yama Deposu</a></div><div id="tr-ym-dp">Loading...</div>';
        var el = document.querySelector('.block.responsive_apppage_details_left');
        el.parentElement.prepend(block);
    }

    createDomBlock();

    function titleMakeClean(title) {
        return title.toLowerCase().replace('™', '').replace('®', '').replace('©', '').replace(':', '');
    }

    function insertResults(data, workshopList) {
        var ico = "https://cdn1.iconfinder.com/data/icons/pixel-perfect-at-16px-volume-1/16/5006-16.png";
        var el = document.querySelector('#tr-ym-dp');
        if (data.length > 0) {
            el.innerHTML = '<div style="display:block;text-align:center;margin:10px 0;font-size: 18px;">' + data[0].title + '</div>'+
                '<a class="linkbar" href="' + data[0].source + '" target="_blank" rel="noreferrer">' +
                'Kaynağı ziyaret et <img src="' + ico + '" border="0" align="bottom">' +
                '</a>' +
                '<a class="linkbar" href="' + data[0].download + '" target="_blank" rel="noreferrer">' +
                'İndir <img src="' + ico + '" border="0" align="bottom">' +
                '<br/><div style="display:block;text-align:center;color:#7d7d7d;">İndirilen dosyanın sorumluluğu size aittir.</div>';

        } else if(workshopList.length > 0) {
            el.innerHTML = '<div style="display:block;text-align:center;margin:10px 0;font-size: 18px;">' + workshopList[0].title + '</div>'+
                '<a class="linkbar" href="' + workshopList[0].download + '" target="_blank" rel="noreferrer">' +
                '(Atölye) İndir <img src="' + ico + '" border="0" align="bottom">' +
                '</a>'+
                '<br/><div style="display:block;text-align:center;color:#7d7d7d;">İndirilen dosyanın sorumluluğu size aittir.</div>';
        } else {
            el.innerHTML = '<div style="display:block;text-align:center;font-size:18px;"> >.< <br>Bulunamadı</div>';
        }
    }
    var gameName = document.querySelector('.apphub_AppName').textContent.trim();

    GM_xmlhttpRequest ( {
        method: 'GET',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=464077817',
        onload: function (res) {
            if (res.status === 200) {
                var resDoc = document.createElement("div");
                resDoc.innerHTML = res.responseText;
                var all = [];
                resDoc.querySelectorAll(".bb_code").forEach(function(item, idx){
                    var title = item.querySelector(".bb_h1");
                    if(title === null){
                        return;
                    }
                    title = title.textContent.trim();
                    if (titleMakeClean(title) === titleMakeClean(gameName)) {
                        var rows = item.textContent.split('\n');
                        var source = rows[0].split(' - ')[1].replace(/\s+/g, '');
                        var download = rows[1].split(' - ')[1].replace(/\s+/g, '');
                        all.push({
                            title: gameName,
                            source: source.startsWith('http') ? source : 'http://' + source,
                            download: download.startsWith('http') ? download : 'http://' + download,
                        });
                    }
                });

                var workshop = [];

                resDoc.querySelectorAll('[id="701642"] a').forEach(function(item) {
                    var title = titleMakeClean(item.textContent);
                    var download = item.href;
                    if (title === titleMakeClean(gameName)) {
                        workshop.push({
                            title: gameName,
                            download: download,
                        });
                    }
                });
                insertResults(all, workshop);
            }
        }
    });
})();