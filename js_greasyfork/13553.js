// ==UserScript==
// @name         Kinozal.TV - Download button in search page.
// @version      1.0
// @description  Adds a download button to Kinozal.TV to search page for faster download of required torrent.
// @match        http://kinozal.tv/browse.php*
// @grant        none
// @author       Epsil0neR
// @namespace    https://greasyfork.org/en/users/19387
// @downloadURL https://update.greasyfork.org/scripts/13553/KinozalTV%20-%20Download%20button%20in%20search%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/13553/KinozalTV%20-%20Download%20button%20in%20search%20page.meta.js
// ==/UserScript==
$(function(){
    var css = '.btnDownloadTorrent {display:inline-block;height:32px;width:32px;background-image: url(https://cdn3.iconfinder.com/data/icons/archive-icons/64/Download-512.png);background-size: 32px 32px;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);


    var table = $('.t_peer');
    var h = table.find('.mn');
    h.prepend('<td class="z"></td>');
    table.find('tr').not(h).each(function(i,e){
        var td = document.createElement('td');
        $(e).prepend(td);
        var url = $(e).find('.nam a').attr('href');
        var uArgs = url.split('?')[1].split('&');

        // Find torrent id.
        var id = null;
        uArgs.forEach(function(el){
            if (el.startsWith('id=')){
                id = el.split('=')[1];   
            }
        });

        if (id !== null){
            // Create button
            var a = document.createElement('a');
            a.className = 'btnDownloadTorrent';
            a.href = 'http://dl.kinozal.tv/download.php?id=' + id;
            td.appendChild(a);
        }
    });
});