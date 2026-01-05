// ==UserScript==
// @name             EMPviewer v2
// @namespace        https://www.empornium.sx/
// @version          2.0
// @description      Better porn browsing
// @author           p0wn3rd
// @contributors     someone234342, JoaoBravo88,howlingbanshee
// @match            https://www.empornium.sx/*
// @grant            none
// @require          https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/28745/EMPviewer%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/28745/EMPviewer%20v2.meta.js
// ==/UserScript==



(function($) {
    'use strict';

    $.noConflict();

    const config = {
        thumbSize: '20%', // Enter width here in % (Height will be calculated automatically) – 20% , 25% and 33% are good examples

        showTitle: false, // set false to hide title and only show when you hover on thumbnail

        showUploader: false, // set true to show uploader name on tiles

        maxTitleLength: 70, // title will be truncated after these many characters

        excludeCategories: 'sick, scat, animal, gay', // comma-separated list of categories you don't like

        excludeTags: '', // comma-separated list of tags you don't like
    };

    // --------------
    // Unless you know what you're doing, don't edit below this line;

    if (!$('.torrent_table').length || $('.torrent_table').parents('#details_top').length) return;
    const css = `
#content {
max-width: none;
}
.torrent_grid {
background: black;
padding: 5px;
}
.torrent_grid__torrent {
width: ${config.thumbSize};
height: 160px;
display: inline-block;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
border: 5px solid black;
box-sizing: border-box;
position: relative;
overflow: hidden;
color: white;
}
.torrent_grid__torrent__cat {
position: absolute;
top: 5px;
left: 5px;
background: rgba(0, 0, 0, 0.7);
font-size: 15px;
padding: 2px 10px;
text-transform: uppercase;
font-weight: bold;
}
.torrent_grid__torrent__info {
position: absolute;
display: block;
bottom: 0;
left: 0;
width: 100%;
background: rgba(0, 0, 0, 0.75);
padding: 10px;
box-sizing: border-box;
transition: .1s ease;
font-size: 13px;
}
.torrent_grid__torrent__info h3 {
font-weight: normal;
font-size: 1.2em;
color: #cccccc;
${!config.showTitle ? 'display: none' : ''}
}
.torrent__size {
color: #ccc;
border: none;
padding: 0px 2px;
font-size: 12px;
font-weight: normal;
margin-left: 2px;
}
h3 .torrent__size {
border-color: rgb(226, 226, 226);
color: rgb(226, 226, 226);
position: relative;
font-size: 13px;
top: -2px;
margin-right: 2px;
margin-left: 0;
}
@media (max-width: 1200px) {
.torrent_grid__torrent__info h3 {
font-size: 1em;
}
}
.torrent_grid__torrent__info h3:hover {
text-decoration: none;
}

.newtime{
position: absolute;
down: 0;
right: 0;
padding: 0px 5px;
}

.torrent_grid__torrent__info .uploader a {
font-weight: bold;
text-decoration: underline;
}
.seeders, .leechers {
margin-right: 5px;
}
.seeders svg, .leechers svg {
position: relative;
top: 4px;
margin-right: -2px
}

span[style="color: #FF0000;"] {
color: #ff4646 !important;
}

.torrent--freeleech {
background: rgba(0, 0, 0, 0.7);
position: absolute; top: 5px; right: 5px; padding: 10px 10px;
}
.torrent_grid__torrent:visited h3, .uploader a:visited {
color: #FF1493;
}
.torrent__info_extra {
position: absolute;
bottom: 9px;
right: 8px;
}
.torrent__info_extra img[alt="Freeleech"] {
display: none;
}
.torrent__info_extra .icon {
width: 18px;
width: 18px;
background-size: contain;
vertical-align: middle;
margin-right: 5px;
}
.icon.icon_okay {
    display: none;
}
.torrent__info__time {
display:none;
}
.torrent__cover {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
}
.torrent--excluded .torrent__cover {
-webkit-filter: blur(20px);
-moz-filter: blur(20px);
filter: blur(20px);
}
`;

    // Add style to <head>
    const styleTag = document.createElement('style');
    styleTag.id = "pb_grid_css";
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);

    // returns torrents array
    var getTorrents = (table) => {
        const torrents = [];
        table.find('tr.torrent').each(function(){
            const $this = $(this);
            const cells = $this.find('td');
            let isTop10 = location.pathname === '/top10.php';

            const cellMap = isTop10 ? {
                main: 2,
                category: 1,
                size: 4,
                seeders: 6,
                leechers: 7,
                uploader: 9,

            } : {
                main: 1,
                category: 0,
                files: 2,
                time: 4,
                size: 5,
                seeders: 7,
                leechers: 8,
                uploader: 10,
            };

            const overlayID =  $this.find('a[href*="torrents.php?id"]').attr('onmouseover').split('overlib(')[1].split(', FULLHTML')[0];

            const thisTorrent = {
                category: cells.eq(cellMap.category).find('div[title]').attr('title'),
                overlayID: overlayID,
                cover: window[overlayID].split('src=')[1].split('></td>')[0],
                link: $this.find('a[href*="torrents.php?id"]')[0].href,
                title: $this.find('a[href*="torrents.php?id"]').text(),
                tags: $this.find('.tags').html(),
                files: cells.eq(cellMap.files).text(),
                time: cells.eq(cellMap.time).text(),
                time_full: cells.eq(cellMap.time).find('span[title]').attr('title'),
                size: cells.eq(cellMap.size).text(),
                snatches: cells.eq(cellMap.snatches).text(),
                seeders: cells.eq(cellMap.seeders).text(),
                leechers: cells.eq(cellMap.leechers).text(),
                uploader: cells.eq(cellMap.uploader).html(),
                uploaderName: cells.eq(cellMap.uploader).text(),
            };

            thisTorrent.fl = cells.eq(cellMap.main).find('img[alt="Freeleech"]');

            if(thisTorrent.fl.length){
                thisTorrent.fl = "<span class='torrent--freeleech'><img src='static/common/symbols/freedownload.gif' alt='Freeleech' title='Freeleech' /></span>";
            } else {
                thisTorrent.fl = "";
            }

            thisTorrent.status_icons = cells.eq(cellMap.main).find('span[style="float:right"]').html();

            if(thisTorrent.seeders > 0) {
                thisTorrent.seeders = "<span style='color: #3FEB00;'>" + thisTorrent.seeders + "</span>";
            } else {
                thisTorrent.seeders = "<span style='color: #FF0000;'>" + thisTorrent.seeders + "</span>";
            }
            if(thisTorrent.leechers > 0) {
                thisTorrent.leechers = "<span style='color: #FF0000;'>" + thisTorrent.leechers + "</span>";
            }

            torrents.push(thisTorrent);
        });
        table.html('<div class="torrent_grid">');
        return torrents;
    };
    $('.torrent_table').each(function(){
        const torrents = getTorrents($(this));
        const grid = $(this).find('.torrent_grid');

        // Insert grid
        torrents.forEach(torrent => {
            const thisTorrent = $(`<a href="${torrent.link}" class="torrent_grid__torrent" />`);

            const Icon_seed = '<svg style="width:17px;height:17px" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M14,20H10V11L6.5,14.5L4.08,12.08L12,4.16L19.92,12.08L17.5,14.5L14,11V20Z" /></svg>';
            const Icon_leech = '<svg style="width:17px;height:17px" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M10,4H14V13L17.5,9.5L19.92,11.92L12,19.84L4.08,11.92L6.5,9.5L10,13V4Z" /></svg>';

            const excludeCategories = config.excludeCategories.split(',');
            const excludeTags = config.excludeTags.split(',');

            excludeCategories.forEach(excludedCat => {
                if (excludedCat.length && torrent.category.toLowerCase() == excludedCat.trim().toLowerCase()) thisTorrent.addClass('torrent--excluded');
            });
            excludeTags.forEach(excludedTag => {
                if (excludedTag.length && torrent.tags.toLowerCase().indexOf('>' + excludedTag.trim().toLowerCase()) !== -1) thisTorrent.addClass('torrent--excluded');
            });

            const _category = torrent.category ? `<span class="torrent_grid__torrent__cat">${torrent.category}</span>` : '';
            const _uploader = torrent.uploader && config.showUploader ? `<span class="uploader" title="uploaded by ${torrent.uploaderName}">by: ${torrent.uploader}</span>` : '';
            const title_truncated = torrent.title.length > config.maxTitleLength ? torrent.title.slice(0, config.maxTitleLength) + '...' : torrent.title;

            thisTorrent.append(`
<div class="torrent__cover" style='background-image: url(${torrent.cover})'></div>
${_category}
${torrent.fl}
<div class="torrent_grid__torrent__info">
<h3 title="${torrent.title}">${config.showUploader ? `<span class="torrent__size">${torrent.size}</span>` : ''} ${title_truncated}</h3>
<div>
<span class="seeders">${Icon_seed} ${torrent.seeders}</span>
<span class="leechers">${Icon_leech} ${torrent.leechers}</span>
${config.showUploader ? '': `<span class="torrent__size">${torrent.size}</span>`}
${_uploader}
<span class="torrent__info_extra">
${torrent.status_icons}
<span class="torrent__info__time" title="${torrent.time_full}">${torrent.time}</span>
</span>
</div>
</div>`);
            grid.append(thisTorrent);
            thisTorrent.height(thisTorrent.outerWidth() - 10);
        });
    });

    $(window).resize(function(){
        const sizeCSS = $('#gridSizeCSS');
        const size = $('.torrent_grid__torrent').first().outerWidth();
        if (!sizeCSS.length) {
            const sizeCSS = $('<style type="text/css" id="gridSizeCSS" />');
            $('head').append(sizeCSS);
        }
        sizeCSS.html(`.torrent_grid__torrent { height: ${size - 10}px !important }`);
    });

    $('.torrent_grid__torrent').on('mouseover' , function() {
        $(this).find('h3').slideDown('fast');
    });
    $('.torrent_grid__torrent').on('mouseleave' , function() {
        $(this).find('h3').slideUp('fast');
    });
    $.noConflict();

})(jQuery);