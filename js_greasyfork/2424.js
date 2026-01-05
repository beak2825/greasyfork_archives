// ==UserScript==
// @name        Link Guru
// @namespace   http://greasyfork.org/users/2240-doodles
// @author      Doodles
// @version     5
// @description Adds boxes full on links to a few sites.
// @match       *://*.wikipedia.org/*
// @match       *://www.google.com/search?*
// @include     *://www.google.co.*/search?*
// @match       *://*.wiktionary.org/wiki/*
// @match       *://www.imdb.com/*
// @match       *://www.rottentomatoes.com/*
// @run-at      document-end
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require     https://greasyfork.org/scripts/38339-little-site-icons/code/Little%20Site%20Icons.js?version=250233
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/26019/Link%20Guru.user.js
// @updateURL https://update.greasyfork.org/scripts/26019/Link%20Guru.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var lgSettings = [];

var unknownIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2' +
        'AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAA' +
        'AAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4Onht' +
        'cG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDEx' +
        'IDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo' +
        'dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiBy' +
        'ZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBN' +
        'TT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9i' +
        'ZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9z' +
        'aG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTYxQkY0MkQwQjAwMTFFODg3' +
        'QjZFNTlGOTU1NTYzMzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTYxQkY0MkUwQjAwMTFFODg3QjZF' +
        'NTlGOTU1NTYzMzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NjFC' +
        'RjQyQjBCMDAxMUU4ODdCNkU1OUY5NTU1NjMzMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NjFCRjQy' +
        'QzBCMDAxMUU4ODdCNkU1OUY5NTU1NjMzMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6' +
        'eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvesF4UAAABtSURBVHjaYrxbGspACmABYvFsPyJVv5y6iYmB' +
        'RMCCKcSjEAtnf3mwGE2WCY9qTC66DRBpZFOBIkCELIKiAc0BmMZjcRKmajRTmEhSjc8GrKqxBysupQSchNXH' +
        'BJxEbEyT4yQCNgDTIPEaAAIMALyJIxfWPzt6AAAAAElFTkSuQmCC';

$(document).ready(function () {
    "use strict";

    $("<style></style>").prop("type", "text/css").html(
            'div#lgSettingsContainer {padding:2px 2px 0 0;float:left;display:block;z-index:1000;}' +
            'div#lgLinkContainer {padding:0 0 3px 0;margin:0 0 10px 0;line-height:16px;font-size:' +
            '12px;}div#lgLinkContainer a img {display:inline-block;vertical-align:middle;width:16' +
            'px;height:16px;}div#lgLinkContainer a {display:inline-block;}div#lgLinkContainer a s' +
            'pan {vertical-align:middle;display:inline-block;margin:0 7px 0 3px;}.ui-corner-all {' +
            'border-radius:0 !important;}.ui-dialog {z-index:403 !important;background-color:#CCC' +
            ';background:#CCC;color:#333;font-size:14px;border:1px solid #FFF;box-shadow:5px 5px ' +
            '5px rgba(0, 0, 0, 0.5);font-family:Arial, Helvetica, Verdana, sans-serif !important;' +
            'outline:1px solid #000;}.ui-widget-content {background-color:#AAAAAA;background:#AAA' +
            'AAA;border:none !important;}.ui-dialog-titlebar {font-size:16px;background-color:#AA' +
            'AAAA;background:#AAAAAA;padding:4px 4px 4px 7px;text-shadow:1px 1px 2px #000000;colo' +
            'r:#daf0ff;font-weight:bold;border:none !important;}.ui-dialog-titlebar-close {float:' +
            'right !important;height:19px !important;background-color:#3498db !important;border:1' +
            'px solid #222222 !important;background-image:none !important;text-shadow:1px 1px 1px' +
            ' #000000 !important;font-size:11px !important;font-weight:bold !important;color:#FFF' +
            ' !important;}.ui-dialog-titlebar-close:after {content:"Close";}.ui-dialog-titlebar-c' +
            'lose:hover {background-color:#3cb0fd !important;}.ui-dialog-titlebar-close span {dis' +
            'play:none;}.ui-dialog-content {background-color:#CCC;padding:5px;border:none !import' +
            'ant;color:#000;}.ui-dialog-buttonpane {padding:2px 7px 7px 7px;background-color:none' +
            ' !important;background:none !important;border:none;}.ui-dialog-buttonset {text-align' +
            ':right;}.ui-dialog-buttonset button {background-color:#3498db !important;border:1px ' +
            'solid #222222 !important;background-image:none !important;text-shadow:1px 1px 1px #0' +
            '00000;font-size:16px;font-weight:bold;color:#FFF;font-family:Arial, Helvetica, Verda' +
            'na, sans-serif !important;padding:2px 12px 3px 12px;margin-left:3px;}.ui-dialog-butt' +
            'onset button:hover {background-color:#3cb0fd !important;}.ui-widget-overlay {positio' +
            'n:absolute;top:0;left:0;width:100%;height:100%;background-color:#000000;opacity:.60;' +
            'filter:Alpha(Opacity=60);background-image:none !important;}.ui-tabs .ui-tabs-nav {di' +
            'splay:block;margin:0;padding:0;border: none;background-color:#AAAAAA;background:#AAA' +
            'AAA;}.ui-tabs .ui-tabs-nav li {list-style:none;float:left;margin:0 6px 1px 0;border:' +
            ' none;border-radius:0 !important;}a.ui-tabs-anchor:link {list-style:none;display:inl' +
            'ine-block;margin:0 0 0 0;}a.ui-tabs-anchor:link, a.ui-tabs-anchor:visited {display:i' +
            'nline-block;padding:2px 12px 3px 12px;background-color:#446382;color:#FFF;font-weigh' +
            't:bold;text-decoration:none;}a.ui-tabs-anchor:hover, a.ui-tabs-anchor:active, a.ui-t' +
            'abs-anchor:focus {background-color:#F5F5F5;color:#000;}.ui-tabs-active a.ui-tabs-anc' +
            'hor:link, .ui-tabs-active a.ui-tabs-anchor:visited {background-color:#F5F5F5;color:#' +
            '000;}.ui-tabs-active a.ui-tabs-anchor:hover, .ui-tabs-active a.ui-tabs-anchor:active' +
            ', .ui-tabs-active a.ui-tabs-anchor:focus {background-color:#F5F5F5;color:#000;}.ui-t' +
            'abs .ui-tabs-panel {clear:left;background-color:#F5F5F5;height:251px;padding:5px;bor' +
            'der-radius:0 !important;}.ui-tabs .ui-tabs-panel p {padding:0 5px 3px 5px;margin:0 0' +
            ' 0 0;}div#lgSettingsTabs hr {margin:2px 0 2px 0;border: none;height: 1px;background-' +
            'color:#AAAAAA;}div.lgSettingsPadder {padding:0 25px 0 25px;}label.lgSetCheckbox {pad' +
            'ding:2px;display:block;line-height:16px;}label.lgSetCheckbox input[type="checkbox"] ' +
            '{margin-right:5px;line-height:16px;}div.lgSetRadioHeader {padding:2px 5px 2px 5px;li' +
            'ne-height:16px;}label.lgSetRadio {padding:2px;display:inline-block;line-height:16px;' +
            '}label.lgSetRadio input[type="radio"] {margin-right:5px;line-height:16px;}div.lgSett' +
            'ingsFooter {padding:3px;margin:0 0 0 0;font-size:10px;}').appendTo("head");
    $("body").append(
            '<div id="lgSettingsDialog" title="Link Guru - Settings"><div id="lgSettingsTabs"><ul' +
            '><li><a href="#tabs-1">Wikipedia</a></li><li><a href="#tabs-2">Wiktionary</a></li><l' +
            'i><a href="#tabs-3">IMDb</a></li><li><a href="#tabs-4">Rotten Tomatoes</a></li><li><' +
            'a href="#tabs-5">Google</a></li></ul><div id="tabs-1"><p>Add links to Wikipedia arti' +
            'cles. The links are searches using the article&#39;s title as the search parameter.<' +
            '/p><hr /><label class="lgSetCheckbox"><input type="checkbox" name="lgSetWikipediaEna' +
            'bled" id="lgSetWikipediaEnabled"><strong>Enabled</strong> - Enable/Disable Link Guru' +
            ' on Wikipedia</label><hr /><label class="lgSetCheckbox"><input type="checkbox" name=' +
            '"lgSetWikipediaNewtab" id="lgSetWikipediaNewtab"><strong>New Tab</strong> - Links wi' +
            'll automatically open in a new tab.</label><hr /><div class="lgSetRadioHeader"><stro' +
            'ng>Display Style</strong> - How the links are displayed.</div><div class="lgSettings' +
            'Padder"><label class="lgSetRadio"><input type="radio" name="lgSetWikipediaStyle" val' +
            'ue="0"><strong>Icon</strong></label><label class="lgSetRadio"><input type="radio" na' +
            'me="lgSetWikipediaStyle" value="1"><strong>Text</strong></label><label class="lgSetR' +
            'adio"><input type="radio" name="lgSetWikipediaStyle" value="2"><strong>Icon and Text' +
            '</strong></label></div></div><div id="tabs-2"><p>Add links to Wiktionary word pages.' +
            ' The links are other dictionaries and word related services.</p><hr /><label class="' +
            'lgSetCheckbox"><input type="checkbox" name="lgSetWiktionaryEnabled" id="lgSetWiktion' +
            'aryEnabled"><strong>Enabled</strong> - Enable/Disable Link Guru on Wiktionary</label' +
            '><hr /><label class="lgSetCheckbox"><input type="checkbox" name="lgSetWiktionaryNewt' +
            'ab" id="lgSetWiktionaryNewtab"><strong>New Tab</strong> - Links will automatically o' +
            'pen in a new tab.</label><hr /><div class="lgSetRadioHeader"><strong>Display Style</' +
            'strong> - How the links are displayed.</div><div class="lgSettingsPadder"><label cla' +
            'ss="lgSetRadio"><input type="radio" name="lgSetWiktionaryStyle" value="0"><strong>Ic' +
            'on</strong></label><label class="lgSetRadio"><input type="radio" name="lgSetWiktiona' +
            'ryStyle" value="1"><strong>Text</strong></label><label class="lgSetRadio"><input typ' +
            'e="radio" name="lgSetWiktionaryStyle" value="2"><strong>Icon and Text</strong></labe' +
            'l></div></div><div id="tabs-3"><p>Add search links to Movie, TV Series, Person, and ' +
            'Character pages.</p><hr /><label class="lgSetCheckbox"><input type="checkbox" name="' +
            'lgSetImdbEnabled" id="lgSetImdbEnabled"><strong>Enabled</strong> - Enable/Disable Li' +
            'nk Guru on IMDb</label><hr /><label class="lgSetCheckbox"><input type="checkbox" nam' +
            'e="lgSetImdbNewtab" id="lgSetImdbNewtab"><strong>New Tab</strong> - Links will autom' +
            'atically open in a new tab.</label><hr /><div class="lgSetRadioHeader"><strong>Displ' +
            'ay Style</strong> - How the links are displayed.</div><div class="lgSettingsPadder">' +
            '<label class="lgSetRadio"><input type="radio" name="lgSetImdbStyle" value="0"><stron' +
            'g>Icon</strong></label><label class="lgSetRadio"><input type="radio" name="lgSetImdb' +
            'Style" value="1"><strong>Text</strong></label><label class="lgSetRadio"><input type=' +
            '"radio" name="lgSetImdbStyle" value="2"><strong>Icon and Text</strong></label></div>' +
            '</div><div id="tabs-4"><p>Add search links to Movie and Person pages.</p><hr /><labe' +
            'l class="lgSetCheckbox"><input type="checkbox" name="lgSetRottenEnabled" id="lgSetRo' +
            'ttenEnabled"><strong>Enabled</strong> - Enable/Disable Link Guru on Rotten Tomatoes<' +
            '/label><hr /><label class="lgSetCheckbox"><input type="checkbox" name="lgSetRottenNe' +
            'wtab" id="lgSetRottenNewtab"><strong>New Tab</strong> - Links will automatically ope' +
            'n in a new tab.</label><hr /><div class="lgSetRadioHeader"><strong>Display Style</st' +
            'rong> - How the links are displayed.</div><div class="lgSettingsPadder"><label class' +
            '="lgSetRadio"><input type="radio" name="lgSetRottenStyle" value="0"><strong>Icon</st' +
            'rong></label><label class="lgSetRadio"><input type="radio" name="lgSetRottenStyle" v' +
            'alue="1"><strong>Text</strong></label><label class="lgSetRadio"><input type="radio" ' +
            'name="lgSetRottenStyle" value="2"><strong>Icon and Text</strong></label></div></div>' +
            '<div id="tabs-5"><p>Replaces the "Videos" tab on Google searches with a link to a Yo' +
            'uTube search with the same search parameter.</p><hr /><label class="lgSetCheckbox"><' +
            'input type="checkbox" name="lgSetGoogleEnabled" id="lgSetGoogleEnabled"><strong>Enab' +
            'led</strong> - Enable/Disable Link Guru on Google</label><hr /><label class="lgSetCh' +
            'eckbox"><input type="checkbox" name="lgSetGoogleDefinition" id="lgSetGoogleDefinitio' +
            'n"><strong>Defintion Links</strong> - Add word related links to Google definition bo' +
            'xes.</label></div></div><div class="lgSettingsFooter">Settings changes do not immedi' +
            'ately take effect. A refresh is required.</div></div>');
    $("#lgSettingsTabs").tabs();
    $("#lgSettingsDialog").dialog({
        modal: true, resizable: false, autoOpen: false, width: 634,
        position: {my: "center top", at: "center top+120", of: window}
    });
    var settingsLink = $('<a href="#" id="lgSettingsLink">Link Guru Settings</a>');
    $(settingsLink).click(function (e) {
        e.preventDefault();
        $("#lgSettingsDialog").dialog("open");
    });
    // =======================================================================================================================
    // Stored Data Variables
    SetupBoolVariable("WikipediaEnabled", true);
    SetupBoolVariable("WiktionaryEnabled", true);
    SetupBoolVariable("RottenEnabled", true);
    SetupBoolVariable("ImdbEnabled", true);
    SetupBoolVariable("GoogleEnabled", true);
    SetupBoolVariable("WikipediaNewtab", false);
    SetupBoolVariable("WiktionaryNewtab", false);
    SetupBoolVariable("RottenNewtab", false);
    SetupBoolVariable("ImdbNewtab", false);
    SetupRadioVariable("WikipediaStyle", 2);
    SetupRadioVariable("WiktionaryStyle", 2);
    SetupRadioVariable("RottenStyle", 2);
    SetupRadioVariable("ImdbStyle", 2);
    SetupBoolVariable("GoogleDefinition", true);
    var links = [];
    // =======================================================================================================================
    // WIKIPEDIA
    if (UrlContains("wikipedia.org") && window.top === window.self) {
        links.push(["Google", "Google search for {{PARAM}}", "http://www.google.com/search?output=search&q={{PARAM}}", "google"]);
        links.push(["Google Image", "Google Image search for {{PARAM}}", "http://www.google.com/search?tbm=isch&q={{PARAM}}", "googleimage"]);
        links.push(["YouTube", "YouTube search for {{PARAM}}", "https://www.youtube.com/results?search_query={{PARAM}}", "youtube"]);
        if ($("ul > li > a.external[href*='www.imdb.com']").length) {
            links.push(["IMDb", "IMDb - {{PARAM}}", $("ul > li > a.external[href*='www.imdb.com']").attr('href'), "imdb"]);
        } else {
            links.push(["IMDb", "IMDb search for {{PARAM}}", "http://www.imdb.com/find?s=all&q={{PARAM}}", "imdb"]);
        }
        if ($("a[href='/wiki/Portal:Anime_and_Manga']").length) {
            links.push(["MyAnimeList", "MyAnimeList search for {{PARAM}}", "https://myanimelist.net/search/all?q={{PARAM}}", "myanimelist"]);
        }
        links.push(["Pirate Bay", "The Pirate Bay search for {{PARAM}}", "https://thepiratebay.org/search/{{PARAM}}/0/99/0", "thepiratebay"]);
        links.push(["Imgur", "Imgur search for {{PARAM}}", "http://imgur.com/search?q={{PARAM}}", "imgur"]);
        links.push(["last.fm", "Last.fm search for {{PARAM}}", "http://www.last.fm/search?q={{PARAM}}&type=track", "lastfm"]);
        $("#p-navigation > div.body > ul").append($("<li></li>").append(settingsLink));
        if (lgSettings['WikipediaEnabled'] && !UrlContains("/wiki/Main_Page")
                && !UrlContains("/wiki/Portal:") && !UrlContains("/wiki/Talk:")
                && $("h1#firstHeading") && $("li#ca-nstab-main.selected")) {
            var pageTitle = $("h1#firstHeading").text();
            pageTitle = pageTitle.lgReplaceAll("<i>", "").lgReplaceAll("</i>", "");
            pageTitle = pageTitle.lgReplaceAll("&equals;", "%3D").lgReplaceAll("&#61;", "%3D").lgReplaceAll("=", "%3D");
            pageTitle = pageTitle.lgReplaceAll("&amp;", "%26").lgReplaceAll("&#38;", "%26").lgReplaceAll("&", "%26");
            pageTitle = pageTitle.replace(" (film)", "").replace("(film)", "").replace(" film)", ")");
            $(CreateLinkContainer(links, pageTitle, lgSettings["WikipediaStyle"], lgSettings["WikipediaNewtab"])).insertBefore("h1#firstHeading");
            $('div#lgLinkContainer').css({'float': 'right', 'padding': '10px 0 10px 0'});
            if ($('div.mw-indicators').children().length > 0) {
                $('div.mw-indicators').css({'padding-left': '25px'});
            }
        }
    }
    // =======================================================================================================================
    // WIKTIONARY
    if (UrlContains("wiktionary.org") && window.top === window.self) {
        links.push(["Merriam-Webster", "Merriam-Webster Dictionary and Thesaurus", "http://www.merriam-webster.com/dictionary/{{PARAM}}", "merriamwebster"]);
        links.push(["Thesaurus.com", "Thesaurus.com", "http://thesaurus.com/browse/{{PARAM}}", "thesaurus"]);
        links.push(["Google", "Google search for define:{{PARAM}}", "http://www.google.com/search?output=search&q=define:{{PARAM}}", "google"]);
        links.push(["Synonym.com", "Synonym.com", "http://www.synonym.com/synonyms/{{PARAM}}/", "synonym"]);
        links.push(["Wikisaurus", "Wikisaurus", "http://wiktionary.org/wiki/Wikisaurus:{{PARAM}}", "wiktionary"]);
        links.push(["One Look", "One Look", "http://www.onelook.com/?w={{PARAM}}&ls=a", "onelook"]);
        links.push(["Wolfram|Alpha", "Wolfram|Alpha", "http://www.wolframalpha.com/input/?i={{PARAM}}", "wolframalpha"]);
        links.push(["Urban Dictionary", "Urban Dictionary", "http://www.urbandictionary.com/define.php?term={{PARAM}}", "urbandictionary"]);
        links.push(["iTools", "iTools", "http://itools.com/language/dictionary?q={{PARAM}}&submit=English+Dictionary", "itools"]);
        links.push(["Vocabulary.com", "Vocabulary.com Dictionary", "http://www.vocabulary.com/dictionary/{{PARAM}}", "vocabulary"]);
        links.push(["Cambridge", "Cambridge Dictionary", "http://dictionary.cambridge.org/dictionary/english/{{PARAM}}", "cambridge"]);
        links.push(["RhymeZone", "RhymeZone", "http://www.rhymezone.com/r/rhyme.cgi?Word={{PARAM}}&typeofrhyme=perfect&org1=syl&org2=l&org3=y", "rhymezone"]);
        links.push(["Online Etymology", "Online Etymology Dictionary", "http://www.etymonline.com/index.php?search={{PARAM}}", "etymonline"]);
        links.push(["howjsay", "howjsay: Online Dictionary of English Pronunciation", "http://howjsay.com/index.php?word={{PARAM}}", "howjsay"]);
        $("#p-navigation > div.body > ul").append($("<li></li>").append(settingsLink));
        if (lgSettings["WiktionaryEnabled"] && !UrlContains("/wiki/Wiktionary:Main_Page")
                && !UrlContains("/wiki/Index:") && !UrlContains("/wiki/Talk:")
                && !UrlContains("/wiki/Special:") && !UrlContains("/wiki/Category:")
                && $("h1#firstHeading") && $("li#ca-nstab-main.selected")) {
            var pageTitle = $("h1#firstHeading").text().lgReplaceAll("<i>", "").lgReplaceAll("</i>", "");
            $(CreateLinkContainer(links, pageTitle, lgSettings["WiktionaryStyle"], lgSettings["WiktionaryNewtab"])).insertBefore("h1#firstHeading");
            $("div#lgLinkContainer").css({"float": "right", "padding": "10px 0 10px 0"});
        }
    }
    // =======================================================================================================================
    // Rotten Tomatoes
    if (UrlContains("www.rottentomatoes.com") && window.top === window.self) {
        $("div.header_links").prepend(settingsLink);
        if (lgSettings["RottenEnabled"]) {
            if (UrlContains("rottentomatoes.com/m/")) {
                links.push(["YouTube", "YouTube search for {{PARAM}} trailer", "http://www.youtube.com/results?search_query={{PARAM}} trailer", "youtube"]);
                links.push(["Google Image", "Google Image search for {{PARAM}}", "http://www.google.com/search?tbm=isch&q={{PARAM}}", "google"]);
                links.push(["Google", "Google search for {{PARAM}}", "http://www.google.com/search?output=search&q={{PARAM}}", "googleimage"]);
                links.push(["Wikipedia", "Wikipedia search for {{PARAM}}", "http://en.wikipedia.org/w/index.php?title=Special:Search&search={{PARAM}}", "wikipedia"]);
                links.push(["IMDb", "IMDb search for {{PARAM}}", "http://www.imdb.com/find?s=all&q={{PARAM}}", "imdb"]);
                links.push(["MetaCritic", "MetaCritic search for {{PARAM}}", "http://www.metacritic.com/search/all/{{PARAM}}/results", "metacritic"]);
                links.push(["AllMovie", "AllMovie search for {{PARAM}}", "http://www.allmovie.com/search/movies/{{PARAM}}", "allmovie"]);
                links.push(["Box Office Mojo", "Box Office Mojo search for {{PARAM}}", "http://www.boxofficemojo.com/search/?q={{PARAM}}", "boxofficemojo"]);
                links.push(["Movie Mistakes", "Movie Mistakes search for {{PARAM}}", "http://www.moviemistakes.com/search.php?text={{PARAM}}", "moviemistakes"]);
                links.push(["Letterboxd", "Letterboxd search for {{PARAM}}", "http://letterboxd.com/search/{{PARAM}}/", "letterboxd"]);
                links.push(["Pirate Bay", "The Pirate Bay search for {{PARAM}}", "http://thepiratebay.org/search/{{PARAM}}/0/99/200", "thepiratebay"]);
                links.push(["YIFY Subtitles", "YIFY Subtitles search for {{PARAM}}", "http://www.yifysubtitles.com/search?q={{PARAM}}", "yifysubtitles"]);
                links.push(["Imgur", "Imgur search for {{PARAM}}", "http://imgur.com/search?q={{PARAM}}", "imgur"]);
                var titleText = $("h1.title.hidden-xs").html().split("<span")[0].trim();
                titleText = titleText.lgReplaceAll("/", " ").lgReplaceAll("\\", " ");
                $(CreateLinkContainer(links, titleText, lgSettings["RottenStyle"], lgSettings["RottenNewtab"])).insertBefore("div#topSection");
                $("div#lgLinkContainer").css({"padding": "8px 0 8px 0", "margin-bottom": "0"});
                $("div#topSection").css({"margin-top": "0"});
            } else if (UrlContains("rottentomatoes.com/tv/")) {
                links.push(["YouTube", "YouTube search for {{PARAM}} trailer", "http://www.youtube.com/results?search_query={{PARAM}} trailer", "youtube"]);
                links.push(["Google Image", "Google Image search for {{PARAM}}", "http://www.google.com/search?tbm=isch&q={{PARAM}}", "google"]);
                links.push(["Google", "Google search for {{PARAM}}", "http://www.google.com/search?output=search&q={{PARAM}}", "googleimage"]);
                links.push(["Wikipedia", "Wikipedia search for {{PARAM}}", "http://en.wikipedia.org/w/index.php?title=Special:Search&search={{PARAM}}", "wikipedia"]);
                links.push(["IMDb", "IMDb search for {{PARAM}}", "http://www.imdb.com/find?s=all&q={{PARAM}}", "imdb"]);
                links.push(["MetaCritic", "MetaCritic search for {{PARAM}}", "http://www.metacritic.com/search/all/{{PARAM}}/results", "metacritic"]);
                links.push(["AllMovie", "AllMovie search for {{PARAM}}", "http://www.allmovie.com/search/movies/{{PARAM}}", "allmovie"]);
                links.push(["Box Office Mojo", "Box Office Mojo search for {{PARAM}}", "http://www.boxofficemojo.com/search/?q={{PARAM}}", "boxofficemojo"]);
                links.push(["Movie Mistakes", "Movie Mistakes search for {{PARAM}}", "http://www.moviemistakes.com/search.php?text={{PARAM}}", "moviemistakes"]);
                links.push(["Letterboxd", "Letterboxd search for {{PARAM}}", "http://letterboxd.com/search/{{PARAM}}/", "letterboxd"]);
                links.push(["Episode Calendar", "Episode Calendar search for {{PARAM}}", "http://episodecalendar.com/en/shows?q[name_cont]={{PARAM}}", "episodecalendar"]);
                links.push(["Pirate Bay", "The Pirate Bay search for {{PARAM}}", "http://thepiratebay.org/search/{{PARAM}}/0/99/200", "thepiratebay"]);
                links.push(["YIFY Subtitles", "YIFY Subtitles search for {{PARAM}}", "http://www.yifysubtitles.com/search?q={{PARAM}}", "yifysubtitles"]);
                links.push(["Imgur", "Imgur search for {{PARAM}}", "http://imgur.com/search?q={{PARAM}}", "imgur"]);
                if (document.URL.split("/tv/")[1].split("/").length > 1) {
                    var titleText = $("h1.movie_title").html().split("<span")[0].split(": Season")[0].split(": season")[0].trim();
                    titleText = titleText.lgReplaceAll("/", " ").lgReplaceAll("\\", " ");
                    $(CreateLinkContainer(links, titleText, lgSettings["RottenStyle"], lgSettings["RottenNewtab"])).insertAfter("div#season_score_panel");
                    $("div#lgLinkContainer").css({"padding": "8px 0 8px 0", "margin-bottom": "0", "float": "left", "width": "70%"});
                } else {
                    var titleText = $('h1.title').html().split("<span")[0].trim();
                    titleText = titleText.lgReplaceAll("/", " ").lgReplaceAll("\\", " ");
                    $(CreateLinkContainer(links, titleText, lgSettings["RottenStyle"], lgSettings["RottenNewtab"])).insertBefore("div#series_info");
                    $("div#lgLinkContainer").css({"padding": "8px 0 8px 0", "margin-bottom": "0", "float": "left", "width": "70%"});
                }
            } else if (UrlContains("rottentomatoes.com/celebrity/")) {
                links.push(["YouTube", "YouTube search for {{PARAM}} interview", "http://www.youtube.com/results?search_query={{PARAM}} interview", "youtube"]);
                links.push(["Google Image", "Google Image search for {{PARAM}}", "http://www.google.com/search?tbm=isch&q={{PARAM}}", "google"]);
                links.push(["Google", "Google search for {{PARAM}}", "http://www.google.com/search?output=search&q={{PARAM}}", "googleimage"]);
                links.push(["Wikipedia", "Wikipedia search for {{PARAM}}", "http://en.wikipedia.org/w/index.php?title=Special:Search&search={{PARAM}}", "wikipedia"]);
                links.push(["IMDb", "IMDb search for {{PARAM}}", "http://www.imdb.com/find?s=nm&q={{PARAM}}", "imdb"]);
                links.push(["MetaCritic", "MetaCritic search for {{PARAM}}", "http://www.metacritic.com/search/person/{{PARAM}}/results", "metacritic"]);
                links.push(["AllMovie", "AllMovie search for {{PARAM}}", "http://www.allmovie.com/search/people/{{PARAM}}", "allmovie"]);
                links.push(["Box Office Mojo", "Box Office Mojo search for {{PARAM}}", "http://www.boxofficemojo.com/search/?q={{PARAM}}", "boxofficemojo"]);
                links.push(["Letterboxd", "Letterboxd search for {{PARAM}}", "http://letterboxd.com/search/{{PARAM}}/", "letterboxd"]);
                links.push(["Imgur", "Imgur search for {{PARAM}}", "http://imgur.com/search?q={{PARAM}}", "imgur"]);
                var titleText = $("div.celeb_name > h1").text();
                $(CreateLinkContainer(links, titleText, lgSettings["RottenStyle"], lgSettings["RottenNewtab"])).appendTo("div.celeb_name");
                $("div.celeb_name > h1").css({"border-bottom": "none", "margin-bottom": "0", "padding-bottom": "0"});
            }
        }
    }
    // =======================================================================================================================
    // IMDb
    if (UrlContains("www.imdb.com") && window.top === window.self) {
        $(settingsLink).css({"color": "white"});
        $("<div></div>").css({"font-size": "10px", "height": "15px", "line-height": "15px", "padding-left": "3px"}).append(settingsLink).prependTo("div#nb20");
        $("div#navbar").css({"margin-top": "0"});
        if (lgSettings["ImdbEnabled"]) {
            if (UrlContains("/title/") && !UrlContains("/characters/")) {
                links.push(["YouTube", "YouTube search for {{PARAM}} tralier", "http://www.youtube.com/results?search_query={{PARAM}} trailer", "youtube"]);
                links.push(["Google Image", "Google Image search for {{PARAM}}", "http://www.google.com/search?tbm=isch&q={{PARAM}}", "google"]);
                links.push(["Google", "Google search for {{PARAM}}", "http://www.google.com/search?output=search&q={{PARAM}}", "googleimage"]);
                links.push(["Wikipedia", "Wikipedia search for {{PARAM}}", "http://en.wikipedia.org/w/index.php?title=Special:Search&search={{PARAM}}", "wikipedia"]);
                links.push(["Rotten Tomatoes", "Rotten Tomatoes search for {{PARAM}}", "http://www.rottentomatoes.com/search/?search={{PARAM}}&sitesearch=rt", "rottentomatoes"]);
                links.push(["MetaCritic", "MetaCritic search for {{PARAM}}", "http://www.metacritic.com/search/all/{{PARAM}}/results", "metacritic"]);
                links.push(["AllMovie", "AllMovie search for {{PARAM}}", "http://www.allmovie.com/search/movies/{{PARAM}}", "allmovie"]);
                links.push(["Box Office Mojo", "Box Office Mojo search for {{PARAM}}", "http://www.boxofficemojo.com/search/?q={{PARAM}}", "boxofficemojo"]);
                links.push(["Movie Mistakes", "Movie Mistakes search for {{PARAM}}", "http://www.moviemistakes.com/search.php?text={{PARAM}}", "moviemistakes"]);
                links.push(["Letterboxd", "Letterboxd search for {{PARAM}}", "http://letterboxd.com/search/{{PARAM}}/", "letterboxd"]);
                links.push(["Episode Calendar", "Episode Calendar search for {{PARAM}}", "http://episodecalendar.com/en/shows?q[name_cont]={{PARAM}}", "episodecalendar"]);
                links.push(["Pirate Bay", "The Pirate Bay search for {{PARAM}}", "http://thepiratebay.org/search/{{PARAM}}/0/99/200", "thepiratebay"]);
                links.push(["YIFY Subtitles", "YIFY Subtitles search for {PARAM}}", "http://www.yifysubtitles.com/search?q={{PARAM}}", "yifysubtitles"]);
                links.push(["Imgur", "Imgur search for {{PARAM}}", "http://imgur.com/search?q={{PARAM}}", "imgur"]);
                var titleText = $("div.title_wrapper > h1").html().split("&nbsp;<span")[0].trim();
                titleText = titleText.lgReplaceAll("/", " ").lgReplaceAll("\\", " ");
                titleText = titleText.lgReplaceAll("&nbsp;", " ").trim();
                $(CreateLinkContainer(links, titleText, lgSettings["ImdbStyle"], lgSettings["ImdbNewtab"])).insertAfter("div.titleBar");
                $("div#lgLinkContainer").css({"padding": "5px 0 0 20px"});
            } else if (UrlContains("/name/")) {
                links.push(["YouTube", "YouTube search for {{PARAM}} interview", "http://www.youtube.com/results?search_query={{PARAM}} interview", "youtube"]);
                links.push(["Google Image", "Google Image search for {{PARAM}}", "http://www.google.com/search?tbm=isch&q={{PARAM}}", "google"]);
                links.push(["Google", "Google search for {{PARAM}}", "http://www.google.com/search?output=search&q={{PARAM}}", "googleimage"]);
                links.push(["Wikipedia", "Wikipedia search for {{PARAM}}", "http://en.wikipedia.org/w/index.php?title=Special:Search&search={{PARAM}}", "wikipedia"]);
                links.push(["Rotten Tomatoes", "Rotten Tomatoes search for {{PARAM}}", "http://www.rottentomatoes.com/search/?search={{PARAM}}&sitesearch=rt", "rottentomatoes"]);
                links.push(["MetaCritic", "MetaCritic search for {{PARAM}}", "http://www.metacritic.com/search/person/{{PARAM}}/results", "metacritic"]);
                links.push(["AllMovie", "AllMovie search for {{PARAM}}", "http://www.allmovie.com/search/people/{{PARAM}}", "allmovie"]);
                links.push(["Box Office Mojo", "Box Office Mojo search for {{PARAM}}", "http://www.boxofficemojo.com/search/?q={{PARAM}}", "boxofficemojo"]);
                links.push(["Letterboxd", "Letterboxd search for {{PARAM}}", "http://letterboxd.com/search/{{PARAM}}/", "letterboxd"]);
                links.push(["Imgur", "Imgur search for {{PARAM}}", "http://imgur.com/search?q={{PARAM}}", "imgur"]);
                var titleText = $('h1.header > span.itemprop').text();
                $(CreateLinkContainer(links, titleText, lgSettings["ImdbStyle"], lgSettings["ImdbNewtab"])).insertAfter("div.infobar");
                $("div#name-job-categories").css({"margin-bottom": "4px"});
            }
        }
    }
    // =======================================================================================================================
    // GOOGLE
    if (lgSettings["GoogleEnabled"] && UrlContains("www.google.") && window.top === window.self) {
        PersistFunction(function () {
            var xs = document.URL.split("?")[1];
            if (xs.indexOf("#q=") !== -1) {
                xs = xs.split("#")[1];
            }
            xs = xs.split("q=")[1].split("&")[0].split("#")[0];
            $("a.q.qs").filter(function (index) {
                return $(this).text() === "Videos" || $(this).text() === "Video's";
            }).text("YouTube").attr("href", "http://www.youtube.com/results?search_query=" + xs);
            $("div._sxc > a._UXb._Jhd").filter(function (index) {
                return $(this).text() === "Videos" || $(this).text() === "Video's";
            }).text("YouTube").attr("href", "http://www.youtube.com/results?search_query=" + xs);

            if (lgSettings["GoogleDefinition"] && $("#dictionary-modules").length && !$("div#lgLinkContainer").length) {
                var wordHeader = $("#dictionary-modules > div > div > div > div > div > div > span").parent();
                var word = $(wordHeader).text();
                links.push(["Wiktionary", "Wiktionary page on {{PARAM}}", "https://en.wiktionary.org/wiki/{{PARAM}}", "wiktionary"]);
                links.push(["Merriam-Webster", "Merriam-Webster Dictionary and Thesaurus", "http://www.merriam-webster.com/dictionary/{{PARAM}}", "merriamwebster"]);
                links.push(["Thesaurus.com", "Thesaurus.com", "http://thesaurus.com/browse/{{PARAM}}", "thesaurus"]);
                links.push(["Google", "Google search for define:{{PARAM}}", "http://www.google.com/search?output=search&q=define:{{PARAM}}", "googleimage"]);
                links.push(["Synonym.com", "Synonym.com", "http://www.synonym.com/synonyms/{{PARAM}}/", "synonym"]);
                links.push(["Wikisaurus", "Wikisaurus", "http://wiktionary.org/wiki/Wikisaurus:{{PARAM}}", "wiktionary"]);
                links.push(["One Look", "One Look", "http://www.onelook.com/?w={{PARAM}}&ls=a", "onelook"]);
                links.push(["Wolfram|Alpha", "Wolfram|Alpha", "http://www.wolframalpha.com/input/?i={{PARAM}}", "wolframalpha"]);
                links.push(["Urban Dictionary", "Urban Dictionary", "http://www.urbandictionary.com/define.php?term={{PARAM}}", "urbandictionary"]);
                links.push(["iTools", "iTools", "http://itools.com/language/dictionary?q={{PARAM}}&submit=English+Dictionary", "itools"]);
                links.push(["Vocabulary.com", "Vocabulary.com Dictionary", "http://www.vocabulary.com/dictionary/{{PARAM}}", "vocabulary"]);
                links.push(["Cambridge", "Cambridge Dictionary", "http://dictionary.cambridge.org/dictionary/english/{{PARAM}}", "cambridge"]);
                links.push(["RhymeZone", "RhymeZone", "http://www.rhymezone.com/r/rhyme.cgi?Word={{PARAM}}&typeofrhyme=perfect&org1=syl&org2=l&org3=y", "rhymezone"]);
                links.push(["Online Etymology", "Online Etymology Dictionary", "http://www.etymonline.com/index.php?search={{PARAM}}", "etymonline"]);
                links.push(["howjsay", "howjsay: Online Dictionary of English Pronunciation", "http://howjsay.com/index.php?word={{PARAM}}", "howjsay"]);

                $(CreateLinkContainer(links, word, 0, false)).insertAfter(wordHeader);
                $("div#lgLinkContainer").css({"margin-bottom": "0"});
            }

        }, 500);
    }
    // =======================================================================================================================
    // End Brace for document.ready function
});

String.prototype.lgReplaceAll = function (f, r) {
    return this.split(f).join(r);
};

function UrlContains(urlfragment) {
    return document.URL.indexOf(urlfragment) !== -1;
}

function PersistFunction(functionToFire, delay) {
    delay = delay || 2500;
    new MutationObserver(function () {
        setTimeout(function () {
            functionToFire();
        }, delay);
    }).observe(document.body, {childList: true, subtree: true});
}

function CreateLinkContainer(linkList, urlfragment, linkStyle, newTab) {
    var linkContainter = $('<div id="lgLinkContainer"></div>');
    for (var i = 0; i < linkList.length; i++) {
        var linkData = linkList[i];
        var linkElement = $("<a></a>")
                .attr("title", linkData[1].replace("{{PARAM}}", urlfragment))
                .attr("href", linkData[2].replace("{{PARAM}}", urlfragment));
        if (linkStyle !== 1) {
            $("<img />")
                    .attr("src", (LITTLE_SITE_ICONS && LITTLE_SITE_ICONS[linkData[3]] ?
                            LITTLE_SITE_ICONS[linkData[3]] : unknownIcon))
                    .attr("alt", linkData[0])
                    .appendTo(linkElement);
        }
        if (linkStyle !== 0) {
            $("<span></span>")
                    .text(linkData[0])
                    .appendTo(linkElement);
        }
        if (newTab) {
            $(linkElement).attr("target", "_blank");
        }
        $(linkContainter).append(linkElement);
        if (i + 1 < linkList.length) {
            $(linkContainter).append(document.createTextNode((linkStyle !== 1 ? " " : " | ")));
        }
    }
    return linkContainter;
}

function SetupBoolVariable(variableIndex, defaultValue) {
    lgSettings[variableIndex] = GM_getValue(variableIndex, defaultValue);
    $("#lgSet" + variableIndex).prop("checked", lgSettings[variableIndex]).change(function () {
        lgSettings[variableIndex] = this.checked ? true : false;
        GM_setValue(variableIndex, lgSettings[variableIndex]);
    });
}

function SetupRadioVariable(variableIndex, variableMax) {
    lgSettings[variableIndex] = GM_getValue(variableIndex, 0);
    $("input[name='lgSet" + variableIndex + "'][value='" + lgSettings[variableIndex] + "']")
            .prop('checked', true);
    $("input[name='lgSet" + variableIndex + "']").change(function () {
        lgSettings[variableIndex] = $(this).filter(":checked").val();
        GM_setValue(variableIndex, lgSettings[variableIndex]);
    });
}