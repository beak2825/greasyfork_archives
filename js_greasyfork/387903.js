// ==UserScript==
// @name         Discogs/Release/Embed Ratings[PRIVATE]
// @namespace    https://greasyfork.org/en/scripts/387903-discogs-release-embed-ratings/
// @version      0.91
// @description  embed iframe containing discogs stats page
// @author       denlekke
// @match        https://www.discogs.com/*release/*
// @exclude      https://www.discogs.com/release/stats/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387903/DiscogsReleaseEmbed%20Ratings%5BPRIVATE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/387903/DiscogsReleaseEmbed%20Ratings%5BPRIVATE%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function loadDLT() {
	 document.getElementById('ifrm').src = 'https://en.wikipedia.org/wiki/Main_Page';
    }


    if(window.location.href.includes("release/")|window.location.href.includes("master/") && !window.location.href.includes("stats")){

        //get release id from url (used to create ratings url)
        var releaseId=parseInt(window.location.href.split('release/')[1]);

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

        var have = document.getElementsByClassName("coll_num")[0].innerText;
        var want = document.getElementsByClassName("want_num")[0].innerText;
        var highestSale = document.getElementsByClassName("last")[0].innerText;
        highestSale = highestSale.split("Highest:")[1];
        highestSale = highestSale.substring(2,highestSale.length-1);
        if(highestSale === "--"){highestSale=0;}

        //colorize page depending on info
        if(parseInt(highestSale)>=100){
            document.body.style.backgroundColor = "PaleGreen";
            document.getElementById("site_headers_super_wrap").backgroundColor = "PaleGreen;";
        }
        if(parseInt(want)/parseInt(have)>=10){
            if(parseInt(have) > 0){
                document.body.style.backgroundColor = "lightpink";
                document.getElementById("site_headers_super_wrap").backgroundColor = "lightpink;";
            }
        }

        //place entire row
        var header = document.getElementById('site_headers_super_wrap');
        header.children[0].children[0].style.margin = 'unset';
        header.children[0].children[0].style.marginLeft = '20%';
        header.appendChild(row, header);

        var buttons = document.createElement('div');
        buttons.setAttribute('id', 'buttons');
        buttons.setAttribute('style','width: 100%; height: 30px; margin-top:0px; margin-left:0px;');
        buttons.setAttribute('frameborder', '0');
        buttons.setAttribute('scrolling', 'no');
        buttons.innerHTML = '<button id="trackerbutton" type="button">'
                + 'Tracker</button><button id="ratingsbutton" type="button">'
                + 'Ratings</button>'
                ;

        function RatingsClick (zEvent) {
            document.getElementById('dlt_iframe').style.display = "none";
            document.getElementById('ratings_iframe').style.display = "block";
        }
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
        var link = 'https://www.discogs.com/release/stats/'+releaseId;
        ifrm.setAttribute('src', link);
        ifrm.setAttribute('id', 'ratings_iframe');
        var colRHeight = colR.scrollHeight;
        ifrm.setAttribute('style','width: 103%; height: '+colRHeight+'px; margin-top:0px; margin-left:0px;');
        ifrm.setAttribute('frameborder', '0');
        //ifrm.setAttribute('scrolling', 'no');
        ifrm.setAttribute('overflow', 'hidden');
        ifrm.setAttribute('overflow-x', 'hidden');
        ifrm.style.paddingRight = "-17px";

        colL.appendChild(buttons,colL);
        colL.appendChild(ifrm, colL);

        function TrackerClick (zEvent) {
            var zNode = document.createElement ('p');
            var dlt_ifrm = document.createElement('iframe');
            var dlt_link = "https://aphrodite.feralhosting.com/denlekke/links/discogs_listing_tracker/storage_html/"+releaseId+".html";
            dlt_ifrm.setAttribute('src', dlt_link);
            dlt_ifrm.setAttribute('id', 'dlt_iframe');
            dlt_ifrm.setAttribute('style','width: 100%; height: 800px; margin-top:0px; margin-left:0px;');
            dlt_ifrm.setAttribute('frameborder', '0');
            dlt_ifrm.setAttribute('scrolling', 'yes');
            dlt_ifrm.setAttribute('overflow', 'hidden');
            dlt_ifrm.setAttribute('overflow-x', 'hidden');
            document.getElementById('ratings_iframe').style.display = "none";
            colL.appendChild(dlt_ifrm,colL);
            //document.getElementById ("left_iframe").appendChild(
        }

        document.getElementById ("trackerbutton").addEventListener (
            "click", TrackerClick, false
        );
        document.getElementById ("ratingsbutton").addEventListener (
            "click", RatingsClick, false
        );
    }



}


)

();

