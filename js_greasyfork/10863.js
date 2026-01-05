// ==UserScript==
// @name        IMDb Face Cake - Get a better look at actor images!
// @namespace   driver8.net
// @license     GNU AGPLv3
// @description Make people's faces larger when you hover over their names on IMDb movie and show pages
// @match       *://*.imdb.com/title/tt*/reference*
// @match       *://*.imdb.com/title/tt*/
// @match       *://*.imdb.com/title/tt*/?*
// @match       *://*.imdb.com/name/nm*
// @match       *://*.imdb.com/title/tt*/fullcredits*
// @match       *://*.imdb.com/title/tt*/combined*
// @version     0.5.0.4
// @grant       GM_addStyle
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10863/IMDb%20Face%20Cake%20-%20Get%20a%20better%20look%20at%20actor%20images%21.user.js
// @updateURL https://update.greasyfork.org/scripts/10863/IMDb%20Face%20Cake%20-%20Get%20a%20better%20look%20at%20actor%20images%21.meta.js
// ==/UserScript==

console.log('hi imdb facecake');

var MULT = 12;
var IMG_WIDTH = 23 * MULT;
var BORDER = 2;
var OFFSET = 0;
var IMDB_WIDTH = 900;
var IMDB_HEIGHT = 900;
var DO_THUMBS = true;
var AND_BUTTS = false;

//AND_BUTTS && $('.TitleBlock__TitleMetaDataContainer-sc-1nlhx7j-2, #tn15title > h1 > span:first').before($('<h1> and Butts </h1>').css({'display': 'inline'}));
AND_BUTTS && $('.TitleHeader__TitleText-sc-1wu6n3d-0').text($('.TitleHeader__TitleText-sc-1wu6n3d-0').text() + ' and Butts');
var rowDivs = [];
var thumbDivs = [];
var curPopup;

var $rows = $('table.cast, table.cast_list').find('tr.odd, tr.even');
var $thumbs = $('.ipc-image, .loadlate, .wtw-option, #name-poster, .media_strip_thumb img, .mediastrip img, .mediastrip_big img, #primary-poster, .photo img, .poster img');
$thumbs = $thumbs.not($rows.find('img'));
//console.log('rows, thumbs', $rows, $thumbs);

function setUpRows() {
    $rows.each(function(idx, $el) {
        //console.log(idx, $el, $(this));
        makePopup(idx, $(this));
    });
}

function makePopup(idx, $el) {
    var $hsImg = $el.find('td.hs img, td.primary_photo img');
		if (! $hsImg.length > 0) { return; }
    var thumbSrc = $hsImg.attr('loadlate') || $hsImg.attr('src');
    var $link = $el.find('a');
    var link = $link && $link.attr('href');
    //console.log($el, 'link', link, $link);
    if ($hsImg.hasClass('loadlate') && thumbSrc.match(/\/imdb\/images\/nopicture\//)) {
        thumbSrc = $hsImg.attr('loadlate');
    }
    //console.log('thumbSrc', thumbSrc, 'link', link);
    thumbSrc = thumbSrc.replace(/(https?:\/\/(?:ia\.media-imdb\.com|.+?\.ssl-images-amazon\.com|.+?\.media-amazon\.com))\/images\/([a-zA-Z0-9@]\/[a-zA-Z0-9@]+)\._V[0-9].+\.jpg/,
        '$1/images/$2._UX' + IMG_WIDTH + '_.jpg');
    var $hovaImg = $('<img>').attr('src', thumbSrc);
    var $hovaLink = $('<a>').attr('href', link).append($hovaImg);
    var $hovaDiv = $('<div>').attr('id', 'hova' + idx).addClass('hovaImg').append($hovaLink);

    $hovaDiv.hide();
    $('body').append($hovaDiv);
    rowDivs[idx] = { 'div': $hovaDiv, 'base': $el };

    $hovaImg.on('load', function() {
        adjustPos(rowDivs[idx], false);
    });
}

function setUpThumbs() {
    $thumbs.each(function(idx) {
        var $el = $(this);
        var thumbSrc = $el.attr('loadlate') || $el.attr('src');
        var $link = $el.closest('a').add($el.parent().parent().find('a'));
        var link = $link && $link.attr('href');
        //console.log($el, 'link', link, $link);
        if ($el.hasClass('loadlate') && thumbSrc.match(/\/imdb\/images\/nopicture\//)) {
            thumbSrc = $el.attr('loadlate');
        }
        thumbSrc = thumbSrc.replace(/(https?:\/\/(?:ia\.media-imdb\.com|.+?\.ssl-images-amazon\.com|.+?\.media-amazon\.com))\/images\/([a-zA-Z0-9@]\/[a-zA-Z0-9@]+)\._V[0-9].+(\.jpg|FMwebp\.webp)/,
            '$1/images/$2._V1_SX' + IMDB_WIDTH + '_SY' + IMDB_HEIGHT + '_.jpg');
        //thumbSrc = thumbSrc.replace(/(http:\/\/(?:ia\.media-imdb\.com|.+?\.ssl-images-amazon\.com|.+?\.media-amazon\.com))\/images\/([a-zA-Z0-9@]\/[a-zA-Z0-9@]+)\._V[0-9].+\.jpg/,
        //    '$1/images/$2._V1_UY' + IMDB_HEIGHT + '_UX' + IMDB_WIDTH + '_.jpg');
        var $hovaImg = $('<img>').attr('src', thumbSrc);
        var $hovaLink = $('<a>').attr('href', link).append($hovaImg);
        var $hovaDiv = $('<div>').attr('id', 'hovat' + idx).addClass('hovaThumb').append($hovaLink);

        $hovaDiv.hide();
        $('body').append($hovaDiv);
        thumbDivs[idx] = { 'div': $hovaDiv, 'base': $el };

        $hovaImg.on('load', function() {
            adjustPos(thumbDivs[idx], true);
        });
    });
}

function adjustPos(obj, big) {
    var win = $(window);
    var pos = obj.base.offset();

    // make sure pop-up is not larger than window
    if (big) {
        var both = obj.div.find('*');
        both.css('max-width', (win.width() - BORDER * 2) + 'px');
        both.css('max-height', (win.height() - BORDER * 2) + 'px');
    }

    // center pop-up
    if (big) {
        pos = { 'top': pos.top + obj.base.outerHeight() + OFFSET, 'left': pos.left + ((obj.base.outerWidth() - obj.div.outerWidth()) / 2) };
    } else {
        pos = {'top': pos.top + ((obj.base.outerHeight() - obj.div.outerHeight()) / 2), 'left': pos.left - obj.div.outerWidth() - OFFSET};
    }

    // check for pop-up extending outside window
    pos.top = Math.min(pos.top + obj.div.outerHeight(), win.scrollTop() + win.height()) - obj.div.outerHeight() - BORDER * 2; // bottom
    pos.left = Math.min(pos.left + obj.div.outerWidth(), win.scrollLeft() + win.width()) - obj.div.outerWidth() - BORDER * 2; // right
    pos.top = Math.max(pos.top, win.scrollTop()); // top
    pos.left = Math.max(pos.left, win.scrollLeft()); // left
    obj.div.offset(pos);
}

function setupHide(obj) {
    var $base = obj.base,
        pos = $base.offset();
    let right = pos.left + $base.outerWidth();
    let bottom = pos.top + $base.outerHeight();
    $('body').on('mousemove mouseover', null, function that(event) {
        var x = event.pageX,
            y = event.pageY;
        if (x < pos.left - 1 || x > right + 1 || y < pos.top - 1 || y > bottom + 1) {
            //console.log('removing hover style', event, 'x', x, pos.left, right, 'y', y, pos.top, bottom);
            $('body').off('mousemove mouseover', null, that);
            $base.removeClass('trHova');
            obj.div.hide();
        }
    });
}

$rows.each(function(idx) {
    var $el = $(this);
    $el.on('mouseenter', function() {
        //console.log('hover event', $el, rowDivs);
        $el.addClass('trHova');
        if (!rowDivs[idx]) {
            console.log("Setting up Rows");
            setUpRows();
        }
        curPopup && curPopup.div.hide()
        curPopup = rowDivs[idx];
        rowDivs[idx].div.show();
        adjustPos(rowDivs[idx], false);
        setupHide(rowDivs[idx]);
    });
});

DO_THUMBS && $thumbs.each(function(idx) {
    var $el = $(this);
    console.log($el, $el.parent());
    var $par = $el.parent();
    if ($el.hasClass('ipc-image')) {
        $par = $par.parent();
    }
    // var $par = $el.closest('.ipc-photo');
    // if ($par.length < 1) {
    //     $par = $el.parent();
    // }
    console.log('par', $par);
    //$el.parent().parent().on('mouseenter', function() {
    $par.on('mouseenter', function() {
        console.log('enter', $el, $el.parent());
        if (!thumbDivs[idx]) {
            setUpThumbs();
        }
        curPopup && curPopup.div.hide()
        curPopup = rowDivs[idx];
        thumbDivs[idx].div.show();
        adjustPos(thumbDivs[idx], true);
        setupHide(thumbDivs[idx]);
    });
});

var userStyles =
    ".hovaImg, .hovaThumb { " +
    "position: absolute;" +
    "padding: 0px;" +
    "border-style: solid;" +
    "border-width: " + BORDER + "px;" +
    "border-color: #AAAAFF;" +
    "z-index: 999999999;" +
    "} " +
    ".hovaImg img {" +
    "width: " + IMG_WIDTH + "px;" +
    "display: block;" +
    "} " +
    ".hovaThumb img {" +
    "   display: block;" +
    //"   width: 100%;" +
    //"   height: 100%;" +
    "} " +
    "tr.trHova {" +
    "background-color: #AAAAFF !important;" +
    "} " +
    "div#tn15content div.info div.info-content.block {" +
    //"width: 90% !important;" +
    "} " +
    "";

GM_addStyle(userStyles);
// let s = document.createElement('style');
// s.type = 'text/css';
// s.innerHTML = userStyles;
// document.body.appendChild(s);