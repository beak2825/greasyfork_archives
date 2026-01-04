// ==UserScript==
// @name         Youtube Title Cleaner
// @version      1.2
// @description  A userscript that hides most of the video content on youtube, so you can listen rather than watch!
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/*YouTubeMovies
// @exclude      *://tv.youtube.com/*
// @exclude      *://music.youtube.com/*
// @noframes     true
// @run-at       document-end
// @grant        none
// @license        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @namespace https://greasyfork.org/users/44041
// @downloadURL https://update.greasyfork.org/scripts/505310/Youtube%20Title%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/505310/Youtube%20Title%20Cleaner.meta.js
// ==/UserScript==

//var fixed = 0;

$(document).on( 'yt-navigate-finish', function() {
    setTimeout(function(){ $('h1.title').click() }, 1000);
});

$(document).on( 'yt-navigate-finish', function() {
    setTimeout(function(){ console.log('new track'); }, 1000);
});

function titleField() {

    if ($('#title_fix').length == 0 ){
        //$('h1.title.style-scope.ytd-video-primary-info-renderer').parent().append('<br><div id="title_fix" class="title style-scope ytd-video-primary-info-renderer"></div>');
        //$('h1.title.style-scope.ytd-video-primary-info-renderer').parent().append('<br><input id="title_fix" type="text" style="width: 100%; font-size: 20px;">');
        $('#title h1').parent().append('<br><input id="title_fix" type="text" style="width: 100%; font-size: 20px;">');
        $("body").on("click", "h1.title", function() {
            fix_title();

        });
    }

}

var myTimer = setInterval(titleField, 1000);
$(window).off('beforeunload');
$( document ).ready(function() {
    $(window).off('beforeunload');
});

function fix_title(){

        console.log($('#title_fix').text());
        //if (fixed == 0){
        //console.log('DO THE FIX');
        $('h1.title.style-scope.ytd-video-primary-info-renderer').each(function() {
            var text = $(this).text().toLowerCase();
            //console.log(text);
            $('#sentiment').remove();

            text = text.replace('2023', '');
            text = text.replace('2022', '');
            text = text.replace('2021', '');
            text = text.replace('2020', '');
            text = text.replace('2019', '');
            text = text.replace('2018', '');
            text = text.replace(/\s\s+/g, ' ');
            text = text.replace(/&/g, 'and');
            text = text.replace(/\"/g, "");
            text = text.replace('exclusive', '');
            text = text.replace(' 4k', '');
            text = text.replace('4k', '');
            text = text.replace(/\(\s/g, '(');
            text = text.replace(/\[\s/g, '[');
            text = text.replace(/\s\)/g, ')');
            text = text.replace(/\s\]/g, ']');
            text = text.replace('(bachata)', '');
            text = text.replace('(audi\o)', '');
            text = text.replace('(audio oficial)', '');
            text = text.replace('[official audio]', '');
            text = text.replace('(official video)', '');
            text = text.replace('[official video]', '');
            text = text.replace('| official video', '');
            text = text.replace('(official audio)', '');
            text = text.replace('(clip officiel)', '');
            text = text.replace('[clip officiel]', '');
            text = text.replace('[music video]', '');
            text = text.replace('(music video)', '');
            text = text.replace('lyric video', '');
            text = text.replace('(lyric video)', '');
            text = text.replace('[lyric video]', '');
            text = text.replace('(lyrics video)', '');
            text = text.replace('(mood video)', '');
            text = text.replace('(official lyric video)', '');
            text = text.replace('(official lyrics video)', '');
            text = text.replace('(official lyric vídeo)', '');
            text = text.replace('(official music video)', '');
            text = text.replace('[official music video]', '');
            text = text.replace('[official lyrics video]', '');
            text = text.replace('[official lyric video]', '');
            text = text.replace('[video oficial]', '');
            text = text.replace('(videoclip oficial)', '');
            text = text.replace('(vídeo oficial)', '');
            text = text.replace('(visualiser)', '');
            text = text.replace('(visualizer)', '');
            text = text.replace('(visual)', '');
            text = text.replace('(lyrics)', '');
            text = text.replace('show video', '');
            text = text.replace('(video oficial)', '');
            text = text.replace('(video version)', '');
            text = text.replace('- official music video', '');
            text = text.replace('- clip officiel', '');
            text = text.replace('- video oficial', '');
            text = text.replace('| grm daily', '');
            text = text.replace('премьера клипа', '');
            text = text.replace('[]', '');
            text = text.replace('()', '');
            text = text.replace(/\s\s+/g, ' ');
            //$(this).text(text);
            //fixed ++;
            //$('#title_fix').html(text);
            if(text.split('(').length == 2){
                text = text.split('(')[0];
            }
            if(text.split('[').length == 2){
                text = text.split('[')[0];
            }
            if(text.split('|').length == 2){
                text = text.split('|')[0];
            }
            if(text.split('/').length == 2){
                text = text.split('/')[0];
            }
            text = $.trim(text);
            $('#title_fix').val(text);
        });

}
