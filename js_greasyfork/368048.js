// ==UserScript==
// @name         PTP Clarify
// @description  Clarify PTP Pages
// @version      0.1
// @author       Secant(TYT@NexusHD)
// @include      http*://passthepopcorn.me/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @icon         https://passthepopcorn.me/favicon.ico
// @namespace    https://greasyfork.org/users/152136
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368048/PTP%20Clarify.user.js
// @updateURL https://update.greasyfork.org/scripts/368048/PTP%20Clarify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.match(/passthepopcorn\.me\/torrents\.php(?:(?:(?!\?id=)[\s\S])|$)/)){
        $(".torrent-info-link").map(function(){
            $(this.childNodes[0]).after('<br><span style="color:#007dc6"><b>'+this.title+'</b></span> ');
        });
        $(".golden-popcorn-character").closest('td').attr('style','background-color:gold');
        $('.torrent-info__download-modifier--free').attr('style','background-color:gold;padding:2px 4px;border-radius:4px');
        $('.basic-movie-list__torrent-edition__sub').attr('style','color:rgb(198, 0, 0)').closest('td').attr('style','background-color:#C7C7C7');
        let style = "display:block;border-radius:2px;background-color:lightgreen;";
        let ptplasttime = localStorage.getItem('ptplasttime') || (Date.now() - 24*60*60*1000);
        var isrecent = function(x){
            return Date.parse(x.title+' +0000') > ptplasttime;
        };
        let ptpnewtorrents = 0;
        let targets = document.querySelectorAll('span[title]');
        for (let x of targets) {
            let cl = x.parentNode.parentNode.classList;
            if (cl.contains('basic-movie-list__torrent-row') && isrecent(x)) {
                x.style.cssText = style; x.classList.add('recent'); ptpnewtorrents++;
            }
        }
        if (ptpnewtorrents) {
            let top = document.getElementsByClassName('torrent_table')[0];
            let wrapper = document.createElement('div'); let update = document.createElement('span');
            wrapper.style.cssText='position:absolute;width:96%;text-align:right;margin-top:-14px';
            update.style.cursor='pointer';
            update.textContent = `update recently added (${ptpnewtorrents})`;
            let visit = Date.now();
            update.onclick = () => {
                for (let x of [...document.getElementsByClassName('recent')]) {x.style=''; x.classList.remove('recent');}
                localStorage.setItem('ptplasttime', visit);
                wrapper.remove();
            };
            wrapper.appendChild(update);
            top.parentNode.insertBefore(wrapper,top);
        }
    }
    else if(window.location.href.match(/passthepopcorn\.me\/torrents\.php\?id=/)){
        $(".torrent-info-link").map(function(){
            var file_name = $('#files_'+$(this).attr('onclick').match(/#torrent_(\d+)/)[1]+' th>div:nth-child(2)').text().match(/\/([\s\S]*)\//)[1];
            if(!file_name){
                file_name = $('#files_'+$(this).attr('onclick').match(/#torrent_(\d+)/)[1]+' tbody>tr:first-child>td:first-child').text().replace(/\.[^.]+$/,'');
            }
            $(this.childNodes[0]).after('<br><span style="color:#007dc6"><b>'+file_name+'</b></span> ');
            $('.torrent-info__download-modifier--free').attr('style','background-color:gold;padding:2px 4px;border-radius:4px');
            $('.basic-movie-list__torrent-edition__sub').attr('style','color:rgb(198, 0, 0)').closest('td').attr('style','background-color:#C7C7C7');
        });
    }
})();