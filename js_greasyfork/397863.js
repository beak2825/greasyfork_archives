// ==UserScript==
// @name         Discogs/Release/Embed Ratings
// @namespace    https://greasyfork.org/en/scripts/397863
// @version      0.6
// @description  embed stats page iframe
// @author       denlekke
// @match        https://www.discogs.com/*release/*
// @match        https://www.discogs.com/*master/*
// @exclude      https://www.discogs.com/release/stats/*
// @exclude      https://www.discogs.com/master/stats/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397863/DiscogsReleaseEmbed%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/397863/DiscogsReleaseEmbed%20Ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //get release id from url (used to create ratings url)
    var releaseId = ''
    var iframeLink = ''
    if(window.location.href.includes("release/")){
        releaseId=parseInt(window.location.href.split('release/')[1]);
        iframeLink = 'https://www.discogs.com/release/stats/'+releaseId;
    }
    else{
        releaseId=parseInt(window.location.href.split('master/')[1]);
        iframeLink = 'https://www.discogs.com/master/stats/'+releaseId;
    }

    //divide the page
    var row = document.createElement('div');
    row.setAttribute('id', 'row');
    row.setAttribute('class', 'row');
    var colR = document.createElement('div');
    colR.setAttribute('id', 'colR');
    colR.setAttribute('class', 'colR');
    colR.setAttribute('style','float:right; width: 80%;height: 100%; overflow:hidden; margin-left:0px;');
    var colL = document.createElement('ratings');
    colL.setAttribute('id', 'colL');
    colL.setAttribute('class', 'colL');
    colL.setAttribute('style','float:left; width: 20%;height: 100%; margin-top:0px; overflow:hidden;');
    colL.setAttribute('scrolling', 'yes');

    row.appendChild(colL);
    row.appendChild(colR);

    //place entire row
    var header = document.getElementById('site_headers_super_wrap');
    header.children[0].children[0].style.margin = 'unset';
    header.children[0].children[0].style.marginLeft = '20%';
    header.appendChild(row, header);

    //stuff to put in right column of row (the regular discogs page)
    var page = document.getElementById('page');
    page.className = 'aside_right';
    page.setAttribute('style', 'margin: unset !important');
    colR.appendChild(page, colR);

    var pushfooter = document.getElementById('push_footer');
    colR.appendChild(pushfooter, colR);

    var footer = document.getElementById('site_footer_wrap');
    colR.appendChild(footer, colR);

    //stuff to put in left column of row (ratings page)
    var ifrm = document.createElement('iframe');
    
    ifrm.setAttribute('src', iframeLink);
    ifrm.setAttribute('id', 'ratings_iframe');
    var colRHeight = colR.scrollHeight;
    ifrm.setAttribute('style','width: 105%; height: '+colRHeight+'px; margin-top:0px; margin-left:0px;');
    ifrm.inner = '::-webkit-scrollbar {display: none;}';

    ifrm.setAttribute('frameborder', '0');
    ifrm.setAttribute('overflow-y', 'hidden');
    ifrm.setAttribute('overflow-x', 'hidden');

    colL.appendChild(ifrm, colL);
}


)

();

