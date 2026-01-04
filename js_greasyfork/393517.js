// ==UserScript==
// @name         BTSOW
// @namespace    btsow
// @version      0.1
// @description  Add button to download torrent file.Remove Ads
// @author       hex
// @match        http*://btos.pw/magnet/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393517/BTSOW.user.js
// @updateURL https://update.greasyfork.org/scripts/393517/BTSOW.meta.js
// ==/UserScript==

(function() {
    addDownloadTorrent();
    removeAD();
})();

function addDownloadTorrent(){
    var pathname_split = window.location.pathname.split('/'),
        url_torrent = 'http://btcache.me/torrent/'+pathname_split[4],
        btn_torrent_download = '<a id="torrent" href='+url_torrent+' class="btn btn-primary" style="margin:20px;" title="Download .Torrent" target="_blank"><span class="glyphicon glyphicon-save"></span>Download .Torrent</a>';
    $(btn_torrent_download).prependTo(document.querySelector('div.text-center.hidden-xs'))
}

function removeAD(){
    document.querySelector('div.row.hidden-xs.text-center').remove()
}