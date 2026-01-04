// ==UserScript==
// @name         youtubelister customized
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Semi-responsive GUI for youtubelist.com
// @author       Fonzarelli
// @match        http://youtubelister.com/*experimental=true*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35041/youtubelister%20customized.user.js
// @updateURL https://update.greasyfork.org/scripts/35041/youtubelister%20customized.meta.js
// ==/UserScript==

var isMobile;

init();

function init() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">');

    registerCaseInsensitiveContains();
    addFontAwesome();
    addNewCssClasses();
    createNewPage();
    addControlBtnListeners();
    movePlayer();
    registerPlayBtnListener();
    createFonziePlaylist();
    registerPlaylistSearchListeners();
}

function addFontAwesome() {
    // don't run twice
    if($('#fontAwesomeScript').length) {
        return;
    }
    // don't run too soon
    // can't run too soon (head is always present)

    $('head').append('<script id="fontAwesomeScript" src="https://use.fontawesome.com/4cc9157c4a.js"></script>');
}

function addNewCssClasses() {
    // don't run twice
    if($('#youtubelistFonzieStyle').length) {
        return;
    }
    // don't run too soon
    // can't run too soon (head is always present)

    var cssStr = '' +
        '<style id="youtubelistFonzieStyle">' +
        '#fonzieBody {' +
        'position: fixed; ' +
        'width: 100%; ' +
        'height: 100%; ' +
        'background-color: black; ' +
        'z-index: 99;' +
        'left: 0px; ' +
        'transition: left 500ms;' +
        '}' +
        '#leftContainer {' +
        'float: left; ' +
        'display: table; ' +
        'width: 400px; ' +
        'height: 100%; ' +
        'background-color: #161618;' +
        'margin-left: 0px; ' +
        'transition: margin-left 500ms; ' +
        '}' +
        '.hideLeftContainer {' +
        'margin-left: -400px !important; ' +
        'transition: margin-left 500ms; ' +
        '}' +
        '#centerContainer {' +
        'position: relative; ' +
        'height: 100%; ' +
        'overflow: hidden;' +
        '}' +
        '#rightContainer {' +
        'float: right; ' +
        'width: 400px; ' +
        'height: 100%; ' +
        'background-color: #161618;' +
        '}' +
        '.hideRightContainer {' +
        'margin-right: -400px; ' +
        '}' +
        '#playerContainer {' +
        'width: 100%; ' +
        'height: 80%; ' +
        '}' +
        '#controlsOuterContainer {' +
        'position: relative; ' +
        'width: 100%; ' +
        'height: 20%; ' +
        '}' +
        '#controlsInnerContainer {' +
        'position: absolute; ' +
        'width: 400px; ' +
        'height: 100px; ' +
        'top: 50%; ' +
        'left: 50%; ' +
        'margin-top: -50px; ' +
        'margin-left: -200px; ' +
        '}' +
        '.player-controls-btn {' +
        'position: relative; ' +
        'width: 25%; ' +
        'color: white; ' +
        'font-size: 50px !important; ' +
        'text-align: center; ' +
        'line-height: 100px !important; ' +
        'height: 100%; ' +
        'background-color: #c0392b; ' +
        'cursor: pointer; ' +
        '}' +
        '.player-controls-btn:hover {' +
        'background-color: #e74c3c; ' +
        '}' +
        '.search-container {' +
        'width: 100%;' +
        'height: 75px;' +
        '}' +
        '.search-container div {' +
        'position: relative;' +
        'height: 100%;' +
        '}' +
        '.search-left-container {' +
        'width: 60px;' +
        '}' +
        '.search-center-container {' +
        'width: calc(100% - 120px);' +
        'top: -100%; ' +
        'left: 60px; ' +
        '}' +
        '.search-right-container {' +
        'width: 60px;' +
        'top: -200%; ' +
        'left: calc(100% - 60px); ' +
        '}' +
        '.search-container input {' +
        'width: 100%; ' +
        'height: 50px; ' +
        'position: relative; ' +
        'top: 12.5px; ' +
        'color: white; ' +
        'font-size: 18px; ' +
        'background-color: #95a5a6; ' +
        'border-radius: 25px; ' +
        'border: none;' +
        'padding-left: 18px;' +
        '}' +
        'textarea:focus, input:focus {' +
        'outline: none; ' +
        '}' +
        '.search-playlist-go, .search-playlist-back, .search-youtube-go, .search-youtube-back {' +
        'position: relative; ' +
        'top: 17.5px; ' +
        'font-size: 40px !important; ' +
        'color: white; ' +
        'cursor: pointer; ' +
        '}' +
        '.search-playlist-go:hover, .search-playlist-back:hover, .search-youtube-go:hover, .search-youtube-back:hover {' +
        'color: #c0392b; ' +
        '}' +
        '.search-left-container, .search-right-container {' +
        'text-align: center; ' +
        '}' +
        '.search-container input::placeholder {' +
        'color: dddddd; ' +
        '}' +
        '.search-reset {' +
        'position: relative; ' +
        'top: -33px; ' +
        'left: calc(100% - 37px); ' +
        'color: white; ' +
        'padding: 10px 5px; ' +
        'cursor: pointer;' +
        'font-size: 20px !important; ' +
        '}' +
        '.search-reset:hover {' +
        'color: #c0392b; ' +
        '}' +
        '.list-container {' +
        'height: 100%; ' +
        'display: table-row; ' +
        '}' +
        '.list-scroll-wrap {' +
        'position: relative;' +
        'height: 100%; ' +
        '}' +
        '.list-scroll {' +
        'position: absolute; ' +
        'overflow-x: hidden; ' +
        'overflow-y: auto; ' +
        'top: 0; ' +
        'bottom: 0; ' +
        'left: 0; ' +
        'right: 0; ' +
        '}' +
        '.playlist-entry {' +
        'position: relative; ' +
        'width: 100%; ' +
        'height: 100px; ' +
        'color: white; ' +
        '}' +
        '.playlist-entry-background {' +
        'width: 100%; ' +
        'height: 100%; ' +
        'background-size: 400px 400px; ' +
        'background-position-y: -150px; ' +
        'filter: grayscale(100%) blur(3px); ' +
        '}' +
        '.playlist-entry:hover .playlist-entry-background {' +
        'filter: none; ' +
        '}' +
        '.playlist-entry-title {' +
        'position: absolute; ' +
        'top: 35px; ' +
        'width: 100%; ' +
        'font-size: 18px; ' +
        'background-color: #000000b0; ' +
        'padding: 5px 10px; ' +
        'white-space: nowrap; ' +
        '}' +
        '.playlist-entry:hover .playlist-entry-title {' +
        'top: 15px; ' +
        'background-color: #c0392b; ' +
        '}' +
        '.playlist-entry .fa {' +
        'position: absolute; ' +
        'top: 55px; ' +
        'font-size: 30px; ' +
        'display: none; ' +
        'text-shadow: 0 0 5px black; ' +
        'cursor: pointer; ' +
        '}' +
        '.playlist-entry .fa-play {' +
        'left: 75px; ' +
        '}' +
        '.playlist-entry .fa-step-forward {' +
        'left: 175px; ' +
        '}' +
        '.playlist-entry .fa-trash {' +
        'left: 275px; ' +
        '}' +
        '.playlist-entry:hover .fa {' +
        'display: block; ' +
        '}' +
        '.playlist-entry .fa:hover {' +
        'color: #c0392b; ' +
        '}' +
        '@media only screen and (max-width: 1279px) {' +
        '#rightContainer {' +
        'margin-right: -400px;' +
        '}' +
        '}' +
        '@media only screen and (max-width: 799px) {' +
        '#fonzieBody {' +
        'width: calc(100% + 800px); ' +
        '}' +
        '#leftContainer {' +
        'float: none; ' +
        'position: absolute; ' +
        'left: -400px; ' +
        '}' +
        '#centerContainer {' +
        'position: absolute; ' +
        'left: 0px; ' +
        'width: calc(100% - 800px); ' +
        '}' +
        '#rightContainer {' +
        'float: none; ' +
        'position: absolute; ' +
        'left: 100%; ' +
        'width: 400px; ' +
        '}' +
        '.showLeftContainer {' +
        'left: 400px !important; ' +
        '}' +
        '.hideLeftContainer {' +
        'margin-left: 0px !important; ' +
        '}' +
        '}' +
        '@media only screen and (max-width: 499px) {' +
        '#fonzieBody {' +
        'width: 300%; ' +
        '}' +
        '.showLeftContainer {' +
        'left: 100% !important; ' +
        '}' +
        '.showRightContainer {' +
        'left: -100%; ' +
        '}' +
        '#leftContainer {' +
        'left: -33.33%; ' +
        'width: 33.33%; ' +
        '}' +
        '#centerContainer {' +
        'width: 33.33%; ' +
        '}' +
        '#rightContainer {' +
        'left: 33.33%; ' +
        'width: 33.33%; ' +
        '}' +
        '}' +
        '@media only screen and (max-width: 399px) {' +
        '#controlsInnerContainer {' +
        'position: absolute; ' +
        'width: 100%; ' +
        'height: 100px; ' +
        'top: 50%; ' +
        'left: 0; ' +
        'margin-top: -50px; ' +
        'margin-left: -0; ' +
        '}' +
        '}' +
        '@media only screen and (max-height: 599px) {' +
        '#playerContainer {' +
        'position: absolute;' +
        'bottom: 100px;' +
        'top: 0px;' +
        'height: auto;' +
        'min-height: 100px;' +
        '}' +
        '#controlsOuterContainer {' +
        'position: absolute;' +
        'height: 100px;' +
        'bottom: 0px;' +
        '}' +
        '}' +
        '</style>';
    $('head').append(cssStr);
    $('body').css('margin', '0px');
}

function createNewPage() {
    // don't run twice
    if($('#fonzieBody').length) {
        return;
    }
    // don't run too soon
    if(!$('#bodydiv').length) {

        console.log('yolo');
        setTimeout(createNewPage, 50);
        return;
    }
    var htmlStr = '' +
        '<div id="fonzieBody">' +
        '<div id="leftContainer">' +
        '<div class="search-container">' +
        '<div class="search-left-container">' +
        '<span class="search-playlist-go fa fa-search" title="start search" />' +
        '</div>' +
        '<div class="search-center-container">' +
        '<input id="searchPlaylist" type="text" ' +
        'placeholder="search playlist">' +
        '<span id="searchPlaylistReset" class="search-reset fa fa-close" title="reset search" />' +
        '</div>' +
        '<div class="search-right-container">' +
        '<span class="search-playlist-back fa fa-arrow-right" title="back to player" />' +
        '</div>' +
        '</div>' +
        '<div id="playlistCenter" class="list-container">' +
        '<div class="list-scroll-wrap">' +
        '<div id="fonziePlaylist" class="list-scroll">' +
        '<div id="playlistEntry">' +
        '<div class="playlist-entry-background">' +
        '</div>' +
        '<span id="ple::title"' +
        'class="playlist-entry-title">' +
        'Awesome Youtube Video' +
        '</span>' +
        '<span class="fa fa-play" title="play this song now" />' +
        '<span class="fa fa-step-forward" title="play this song after the current one" />' +
        '<span class="fa fa-trash" title="remove this song from the playlist" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div id="rightContainer">' +

        '<div class="search-container">' +
        '<div class="search-left-container">' +
        '<span class="search-youtube-back fa fa-arrow-left" title="back to player" />' +
        '</div>' +
        '<div class="search-center-container">' +
        '<input id="searchYoutube" type="text" ' +
        'placeholder="search youtube">' +
        '<span id="searchPlaylistReset" class="search-reset fa fa-close" title="reset search" />' +
        '</div>' +
        '<div class="search-right-container">' +
        '<span class="search-youtube-go fa fa-search" title="start search" />' +
        '</div>' +

        //'<div class="search-container">' +
        //'<input id="searchYoutube" type="text" ' +
        //'placeholder="search youtube">' +
        //'<span class="search-reset fa fa-close" />' +
        //'</div>' +
        '</div>' +

        '</div>' +
        '<div id="centerContainer">' +
        '<div id="playerContainer">' +
        '</div>' +
        '<div id="controlsOuterContainer">' +
        '<div id="controlsInnerContainer">' +
        '<span id="playlistBtn" class="player-controls-btn fa fa-list" />' +
        '<span id="playBtn" class="player-controls-btn fa fa-pause" />' +
        '<span id="nextBtn" class="player-controls-btn fa fa-step-forward" />' +
        '<span id="youtubeBtn" class="player-controls-btn fa fa-youtube-square" />' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('body').append(htmlStr);
    $('#bodydiv').hide();
}

function addControlBtnListeners() {
    // don't run twice
    // doesn't matter
    // don't run too soon
    if(!$('#nextBtn').length) {
        setTimeout(addControlBtnListeners, 50);
        return;
    }

    $('#nextBtn').click(function() {
        playNext();
    });
    $('#playBtn').click(function() {
        onPlayPauseButton();
    });
    $('#playlistBtn, .search-playlist-back').click(function() {
        $('#fonzieBody').toggleClass('showLeftContainer');
        $('#leftContainer').toggleClass('hideLeftContainer');
    });
    $('#youtubeBtn, .search-youtube-back').click(function() {
        $('#fonzieBody').toggleClass('showRightContainer');
        $('#rightContainer').toggleClass('hideRightContainer');
    });
}

function movePlayer() {
    // don't run twice
    // doesn't matter
    // don't run too soon
    if(!ytplayer) {
        setTimeout(movePlayer, 50);
        return;
    }

    $('#myytplayer').css('width', '100%')
        .css('height', '100%');
    $('#playerContainer').prepend($('#myytplayer'));

    shuffle = true;
}

function onPlayPauseButton() {
    if(ytplayer.getPlayerState() === 1) {
        ytplayer.pauseVideo();
    }
    else if(ytplayer.getPlayerState() === 2) {
        ytplayer.playVideo();
    }
}

function registerPlayBtnListener() {
    // don't run twice
    // doesn't matter
    // don't run too soon
    if(!ytplayer) {
        setTimeout(registerPlayBtnListener, 50);
        return;
    }
    ytplayer.addEventListener(
        'onStateChange',
        function(event){
            if(event.data === 1) {
                $('#playBtn').removeClass('fa-play').addClass('fa-pause');
            }
            else if(event.data === 2) {
                $('#playBtn').removeClass('fa-pause').addClass('fa-play');
            }
        }
    );
}

function createFonziePlaylist() {
    // don't run twice
    if($('.playlist-entry').length > 1) {
        return;
    }
    // don't run too soon
    var plistArray = $('#playlistthumb').children();
    if(plistArray.length <= 1) {
        setTimeout(createFonziePlaylist, 1000);
        return;
    }

    console.log('reading playlist at ' + plistArray.length + ' elements');
    for(var i = 0; i < plistArray.length; i++) {
        var plistChild = plistArray[i];
        var newChild = $('#playlistEntry').clone();
        var ytid = extractYoutubeId(plistChild.id);
        newChild.attr('id', 'ple_' + ytid);
        newChild.addClass('playlist-entry');
        newChild.attr('mirror', plistChild.id);
        newChild.attr('ytid', ytid);
        newChild.find('.playlist-entry-background')
            .css('background-image', 'url(\'https://img.youtube.com/vi/' + ytid + '/0.jpg\')');
        newChild.find('.playlist-entry-title')
            .html(plistChild.title);
        newChild.find('.fa-play').click(function() {
            loadVideo($(this).closest('.playlist-entry').attr('mirror'), false);
        });
        newChild.appendTo($('#fonziePlaylist'));
    }
    $('#playlistEntry').hide();
}

function extractYoutubeId(inputStr) {
    var result = inputStr;
    while(!result.endsWith('_')) {
        result = result.substr(0, result.length -1);
    }
    result = result.substr(0, result.length -1);
    return result;
}

function registerCaseInsensitiveContains() {
    $.extend($.expr[':'], {
        'containsi': function(elem, i, match, array)
        {
            return (elem.textContent || elem.innerText || '').toLowerCase()
                .indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
}

function registerPlaylistSearchListeners() {
    // don't run twice
    // don't run too soon
    if(!$('#searchPlaylist').length) {
        setTimeout(registerPlaylistSearchListeners, 50);
        return;
    }

    // search submit and reset button show
    $('#searchPlaylist').keyup(function(event) {
        // submit on enter
        if(event.keyCode === 13) {
            searchPlaylist($('#searchPlaylist').val());
        }
        // reset on escape
        if(event.keyCode === 27) {
            $('#searchPlaylist').val('');
            searchPlaylist('');
        }
        // show reset button if searchstring not empty
        if($('#searchPlaylist').val() && $('#searchPlaylist').val().length > 0) {
            $('#searchPlaylistReset').show();
        }
        else {
            $('#searchPlaylistReset').hide();
        }
    });
    $('#searchPlaylistReset').hide();

    // submit search on button click
    $('.search-playlist-go').click(function() {
        searchPlaylist($('#searchPlaylist').val());
    });

    // search reset
    $('#searchPlaylistReset').click(function() {
        $('#searchPlaylist').val('');
        searchPlaylist('');
        $('#searchPlaylistReset').hide();
    });
}

function searchPlaylist(searchString) {
    $('.playlist-entry-title').closest('.playlist-entry').hide();
    $(".playlist-entry-title:containsi(" + searchString + ")").closest('.playlist-entry').show();
}