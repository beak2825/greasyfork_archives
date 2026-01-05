// ==UserScript==
// @name        Enhanced Google Bar
// @namespace   http://jtgii.com/
// @version     Beta 1.05.2
// @run-at      document-start
// @description Google Bar Returns
// @author      James Griffing
// @include     /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]
// @include     http://*.google.*/webhp*
// @include     http://*.google.*/search*
// @include     http://*.google.*/ig*
// @include     http://*.google.*/*
// @include     http://*.google.*/#*
// @include     https://*.google.*/webhp*
// @include     https://*.google.*/search*
// @include     https://*.google.*/ig?*
// @include     https://*.google.*/*
// @include     https://*.google.*/#*
// @include     https://encrypted.google.*/webhp*
// @include     https://encrypted.google.*/search*
// @include     https://encrypted.google.*/ig*
// @include     https://encrypted.google.*/
// @include     https://encrypted.google.*/#*
// @include     https://www.youtube.*/
// @exclude     https://docs.google.com/spreadsheets/*
// @exclude     http://docs.google.com/spreadsheets/*
// @exclude     https://fonts.google.com/*
// @match       https://greasyfork.org/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license     GPL-3.0-or-later
// @copyright 2019, Forgetabyteit (https://openuserjs.org/users/Forgetabyteit) (https://greasyfork.org/en/users/1309-forgetabyteit)

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/29660/Enhanced%20Google%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/29660/Enhanced%20Google%20Bar.meta.js
// ==/UserScript==

//============================required====================
(function() {
    'use strict';
    //==============================Default Settings==============================
    if (typeof GM_getValue("GB_BGColor") === 'undefined') { //
        SetDefaults();
        addGoogleFont(GM_getValue("GB_Font"));
    }

    function SetDefaults() {
        var AllSettings = GM_listValues();
        for (var AllSettingsIndex = 0, key = null; key = AllSettings[AllSettingsIndex]; AllSettingsIndex++) {
            GM_deleteValue(key);
        }
        GM_setValue("GB_Url1", "https://www.google.com/webhp");
        GM_setValue("GB_Url1text", "Search");
        GM_setValue("GB_Url2", "https://www.google.com/imghp");
        GM_setValue("GB_Url2text", "Images");
        GM_setValue("GB_Url3", "https://www.youtube.com/");
        GM_setValue("GB_Url3text", "YouTube");
        GM_setValue("GB_Url4", "https://www.google.com/maps/");
        GM_setValue("GB_Url4text", "Maps");
        GM_setValue("GB_Url5", "https://play.google.com/store");
        GM_setValue("GB_Url5text", "Play");
        GM_setValue("GB_Url6", "https://news.google.com/");
        GM_setValue("GB_Url6text", "News");
        GM_setValue("GB_Url7", "https://mail.google.com/");
        GM_setValue("GB_Url7text", "Gmail");
        GM_setValue("GB_Url8", "https://drive.google.com/drive/");
        GM_setValue("GB_Url8text", "Drive");
        GM_setValue("GB_Url9", "https://calendar.google.com");
        GM_setValue("GB_Url9text", "Calendar");
        GM_setValue("GB_Url10", "https://www.amazon.com");
        GM_setValue("GB_Url10text", "Amazon");
        GM_setValue("GB_Url11", "https://www.facebook.com");
        GM_setValue("GB_Url11text", "Facebook");
        GM_setValue("GB_DropDownUrl1", "https://music.google.com");
        GM_setValue("GB_DropDownUrl1text", "Music");
        GM_setValue("GB_DropDownUrl2", "https://books.google.com/");
        GM_setValue("GB_DropDownUrl2text", "Books");
        GM_setValue("GB_DropDownUrl3", "https://finance.google.com");
        GM_setValue("GB_DropDownUrl3text", "Finance");
        GM_setValue("GB_DropDownUrl4", "http://translate.google.com/");
        GM_setValue("GB_DropDownUrl4text", "Translate");
        GM_setValue("GB_DropDownUrl5", "https://greasyfork.org/en/scripts/29660-enhanced-google-bar");
        GM_setValue("GB_DropDownUrl5text", "Script Homepage");
        GM_setValue("GB_TotalBarLinks", 10);
        GM_setValue("GB_TotalBarMenuLinks", 5);
        GM_setValue("GB_Hover", 10);
        GM_setValue("GB_BGColor", "#333333");
        GM_setValue("GB_LColor", "#FFFFFF");
        GM_setValue("GB_BColor", "#dd4b39");
        GM_setValue('GB_LColMode', "2");
        GM_setValue('GB_BColMode', "3");
        GM_setValue('GB_Pos', "fixed");
        GM_setValue('GB_MenuDisplay', "1");
        GM_setValue('GB_Font', "Ubuntu");
        GM_setValue('GB_ColorCycleDuration', 2500);
    }
    //==============================Getting Variables==============================
    var vCurrentWebpage = window.location.href;
    var vColCycleDuration = GM_getValue("GB_ColorCycleDuration");
    var vGoogleBarFontType = GM_getValue("GB_Font");
    var vGoogleBarBackgroundColor = GM_getValue("GB_BGColor");
    var vGoogleBarLinkColor = GM_getValue("GB_LColor");
    var vGoogleBarBorderColor = GM_getValue("GB_BColor");
    var vBarPosition = GM_getValue('GB_Pos');
    var vMenuDisplay = GM_getValue('GB_MenuDisplay');
    var vTotalBarLinks = GM_getValue('GB_TotalBarLinks');
    var vTotalMenuLinks = GM_getValue('GB_TotalBarMenuLinks');
    var GoogleColorBorder = "#3CBA54"
    var GoogleColorBorderIndex = 0;
    var vLinkColorMode = GM_getValue('GB_LColMode');
    var vBorderColorMode = GM_getValue('GB_BColMode');

    //==============================Reusable Functions==============================
    function addGoogleFont(FontName) {
        $("head").append("<link href='https://fonts.googleapis.com/css?family=" + FontName + "' rel='stylesheet' type='text/css'>");
    }
    addGoogleFont(GM_getValue("GB_Font"));
    $("#GoogleBar a,.GoogleBarDropDownButton").css("font-family", GM_getValue("GB_Font"));
    $('[name=GoogleBarFont]').val(GM_getValue("GB_Font"));

    function GenerateBarLinksFromGetValues() {
        var GoogleBarUrls = [];
        var LinkIndex;
        var vTotalBarLinks = GM_getValue('GB_TotalBarLinks');
        for (LinkIndex = 1; LinkIndex <= GM_getValue("GB_TotalBarLinks"); LinkIndex++) {
            if (GM_getValue("GB_Url" + LinkIndex + "text") === undefined) {
                GM_setValue("GB_Url" + LinkIndex + "text", "Title");
                GM_setValue("GB_Url" + LinkIndex, "https://www.example.com");
            }
            GoogleBarUrls.push({
                "title": GM_getValue("GB_Url" + LinkIndex + "text"),
                "link": GM_getValue("GB_Url" + LinkIndex)
            });
        }
        
        $.each(GoogleBarUrls, function(key, val) {
            //  if (val.LinkIndex.length > 0){
            var $li = $("<li class=\"GBLinkBlock\"><a class=\"GBLink\" href='" + val.link + "'>" + val.title + "</a></li>");
            $("#GoogleBar ul").append($li);

        });
    }
    function GenerateBarMenuLinksFromGetValues() {
        var GoogleBarDropDownUrls = [];
        var LinkIndex;
        for (LinkIndex = 1; LinkIndex <= GM_getValue("GB_TotalBarMenuLinks"); LinkIndex++) {
            if (GM_getValue("GB_DropDownUrl" + LinkIndex + "text") === undefined) {
                GM_setValue("GB_DropDownUrl" + LinkIndex + "text", "Title");
                GM_setValue("GB_DropDownUrl" + LinkIndex, "https://www.example.com");
            }
            GoogleBarDropDownUrls.push({
                "title": GM_getValue("GB_DropDownUrl" + LinkIndex + "text"),
                "link": GM_getValue("GB_DropDownUrl" + LinkIndex)
            });
        }
        $.each(GoogleBarDropDownUrls, function(key, val) {
            //  if (val.link.length > 0){
            var $DropDownLink = $("<a href='" + val.link + "'>" + val.title + "</a>");
            $(".dropdown-content").append($DropDownLink);
        });
        if (vMenuDisplay === "0") {
            $('[name=GBMenuDisplay]').prop('checked', true);
            $(".dropdown").css("display", "none");
        } else if (vMenuDisplay === "1") {
            $(".dropdown").css("display", "inline-block");
        }
    }
    function GenerateSetBarLinkInput() {
        var table = $('<table></table>').addClass('SettingsGoogleBarLinksTable');
        for (var i = 1; i <= GM_getValue("GB_TotalBarLinks"); i++) {
            var row = $('<tr></tr>').html('<td><input type="text" name="texturl' + i + '"></td><td colspan="2"><input type="text" name="barurl' + i + '"></td>');
            table.append(row);
        };
        $('#tab1').append(table);
        $('[name*= "barurl"]').keyup(function() {
            var Urlindex = $('[name*= "barurl"]').index(this);
            $('.GBLink').eq(Urlindex).attr("href", this.value);
            GM_setValue('GB_Url' + parseInt(Urlindex + 1) + '', this.value);
            GenerateExportSettings();
        });
        $('[name*= "texturl"]').keyup(function() {
            var Textindex = $('[name*= "texturl"]').index(this);
            $('.GBLink').eq(Textindex).html(this.value);
            GM_setValue('GB_Url' + parseInt(Textindex + 1) + 'text', this.value);
            GenerateExportSettings();
        });
        for (var i = 1; i <= GM_getValue("GB_TotalBarLinks"); i++) {
            $('[name = "barurl' + i + '"]').val(GM_getValue('GB_Url' + i + ''));
            $('[name = "texturl' + i + '"]').val(GM_getValue('GB_Url' + i + 'text'));
        }
    }

    function DestroyAndCreateBarLinksAndSettingInput() {
        $(".SettingsGoogleBarLinksTable").remove();
        $(".GBLinkBlock").remove();
        GenerateBarLinksFromGetValues();
        GenerateSetBarLinkInput();
        $('.GBLinkBlock').eq(0).css("margin-left", "30px")
        $(".GBLinkBlock,.dropdown-content a,.GoogleBarDropDownButton").hover(function(e) {
            $(this).css("background-color", e.type === "mouseenter" ? shadeColor(GM_getValue("GB_BGColor"), parseInt(GM_getValue("GB_Hover"))) : "transparent")
        });
    }

    function DestroyAndCreateMoreLinksAndSettingInput() {
        var GoogleBarUrls = [];
        $(".SettingsGoogleBarMenuTable").remove();
        $(".dropdown-content a").remove();
        // $("").remove();
        GenerateBarMenuLinksFromGetValues();
        GenerateSetBarMenuLinkInputBoxes();
    }

    function GenerateSetBarMenuLinkInputBoxes() {
        var table = $('<table></table>').addClass('SettingsGoogleBarMenuTable');
        for (var i = 1; i <= GM_getValue("GB_TotalBarMenuLinks"); i++) {
            var row = $('<tr></tr>').html('<td><input type="text" value="' + GM_getValue('GB_DropDownUrl' + i + 'text') + '" name="DropDownText' + i + '"></td><td colspan="2"><input type="text" value="' + GM_getValue('GB_DropDownUrl' + i + '') + '" name="DropDownURL' + i + '"></td>');
            table.append(row);
        };
        $('#tab2').append(table);
        $('[name*= "DropDownURL"]').keyup(function() {
            var Urlindex = $('[name*= "DropDownURL"]').index(this);
            $('.dropdown-content a').eq(Urlindex).attr("href", this.value);
            GM_setValue('GB_DropDownUrl' + parseInt(Urlindex + 1) + '', this.value);
            GenerateExportSettings();
        });
        $('[name*= "DropDownText"]').keyup(function() {
            var Textindex = $('[name*= "DropDownText"]').index(this);
            $('.dropdown-content a').eq(Textindex).html(this.value);
            GM_setValue('GB_DropDownUrl' + parseInt(Textindex + 1) + 'text', this.value);
            GenerateExportSettings();
        });
    }

    function GenerateExportSettings() {
        var ExportSettingsText = "|===============Google Bar===============|";
        ExportSettingsText += "\n" + GM_getValue("GB_BGColor");
        ExportSettingsText += "|" + GM_getValue("GB_BColor");
        ExportSettingsText += "|" + GM_getValue("GB_LColor");
        ExportSettingsText += "|" + GM_getValue('GB_Pos');
        ExportSettingsText += "|" + GM_getValue('GB_TotalBarLinks');
        ExportSettingsText += "|" + GM_getValue('GB_TotalBarMenuLinks');
        ExportSettingsText += "|" + GM_getValue('GB_LColMode');
        ExportSettingsText += "|" + GM_getValue('GB_RandCol');
        ExportSettingsText += "|" + GM_getValue('GB_MenuDisplay');
        ExportSettingsText += "|" + GM_getValue('GB_Font');
        ExportSettingsText += "|" + GM_getValue('GB_ColorCycleDuration');
        ExportSettingsText += "\n|============Google Bar Links============|\n";

        for (var i = 1; i <= GM_getValue("GB_TotalBarLinks"); i++) {
            ExportSettingsText += GM_getValue('GB_Url' + i) + '|' + GM_getValue('GB_Url' + i + 'text') + "\n";
        }

        ExportSettingsText += "|==========Google Bar More Links=========|\n";

        for (var i = 1; i <= GM_getValue("GB_TotalBarMenuLinks"); i++) {
            ExportSettingsText += GM_getValue('GB_DropDownUrl' + i) + '|' + GM_getValue('GB_DropDownUrl' + i + 'text') + "\n";
        }
        $('#ExportSettings').val(ExportSettingsText);
    }



    function extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get the hostname
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }
        //find & remove port number
        hostname = hostname.split(':')[0];

        return hostname;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    function shadeColor(color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;
        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
        return "#" + RR + GG + BB;
    }

    function invertColor(hex, bw) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // http://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ?
                '#000000' :
                '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        return "#" + padZero(r) + padZero(g) + padZero(b);
    }

    function padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }




    function GoogleBarSearch(SearchURL, SearchPath = 0) {
        $('[name="q"]').on("input", function() {
            var Gsearchterm = encodeURIComponent(this.value);
            var Hostname = extractHostname(SearchURL);

            if (SearchURL.indexOf(SearchPath) > 1) {
                Hostname = SearchPath;
            }

            var SearchURLwQ = SearchURL + Gsearchterm;
            $('#GoogleBar [href*="' + Hostname + '"]').attr("href", SearchURLwQ).css('text-decoration', 'underline');
        });

        $('[name="GoogleBarSearchTerm"]').on("input", function() {
            var Gsearchterm = encodeURIComponent(this.value);
            var Hostname = extractHostname(SearchURL);

            if (SearchURL.indexOf(SearchPath) > 1) {
                Hostname = SearchPath;
            }

            var SearchURLwQ = SearchURL + Gsearchterm;
            $('#GoogleBar [href*="' + Hostname + '"]').attr("href", SearchURLwQ).css('text-decoration', 'underline');
        });
    }
    //==============================Initially Create Bar Links==============================

    function CreateGoogleBar() {
// <input type="text" name="GoogleBarSearchTerm">
//         <label for="GBColRand">Cycle Color</label>
  //       <input type="checkbox" name="group-three" id="GBColRand" />
    //     <input type='number' min="250" max="60000" step="250" value="` + vColCycleDuration + `" name='vColCycleDuration' />
        $("html").append(`

<div id="GoogleBar">
   <ul></ul>

</div>
<div id="settings_box">
<div id="close_button">&times;</div>
<div class="tabs">
   <ul class="tab-links">
      <li class="active"><a href="#tab1">Links</a></li>
      <li><a href="#tab2">More</a></li>
      <li><a href="#tab3">Search</a></li>
      <li><a href="#tab4">Colors</a></li>
      <li><a href="#tab5">Misc.</a></li>
      <li><a href="#tab6">&#x25B2;&#x25BC;</a></li>
   </ul>
   <div class="tab-content">
      <div id="tab1" class="tab active">
         <h2>Google Bar Links<input type="number" name="BarLinkNumberInput" min="1" max="30" maxlength="2" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" value=` + vTotalBarLinks + `></h2>
      </div>
      <div id="tab2" class="tab">
         <h2>Google Bar Drop Down Menu<input type="number" name="BarMenuNumberInput" min="1" max="30" maxlength="2" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" value=` + GM_getValue("GB_TotalBarMenuLinks") + `></h2>
         <div id="MoreDisplaySetting">
            <label for="GBMenuDisplay">Disable More</label>
            <input type="checkbox" name="GBMenuDisplay" id="GBMenuDisplay" />
         </div>
      </div>
      <div id="tab3" class="tab">
         <h2>Google Bar Search</h2>
         <div id="MoreDisplaySetting">
          <p>Search settings are coming soon.
         </div>
      </div>
      <div id="tab4" class="tab">
         <h2>Google Bar Colors</h2>
         <label for="GoogleBarBackgroundColor">Bar Color:</label>
         <input type="color" value="` + GM_getValue("GB_BGColor") + `" id="GoogleBarBackgroundColor" onchange="BackgroundColorChange();">

         <br>
         <label for="GoogleBarLinkColor">Link Color:</label>
         <input type="color" value="` + GM_getValue("GB_LColor") + `" id="GoogleBarLinkColor">
         <label for="ICol">Invert</label>
         <input title="Link Color is inverted from Bar Color" type="radio" name="group-one" id="ICol" value="1" />
         <label for="BWCol">Black/White</label>
         <input title="Link Color is Black or White based on Bar Color" type="radio" name="group-one" id="BWCol" value="2" />
         <label for="HPcol">Handpick</label>
         <input title="No Automatic Link Color Manipulation" type="radio" name="group-one" id="HPcol" value="3" />
         <br>
         <label for="GoogleBarBorderColor">Border Color:</label>
         <input type="color" value="` + GM_getValue("GB_BColor") + `" id="GoogleBarBorderColor">
         <label for="IBCol">Invert</label>
         <input title="Border Color is inverted from Bar Color" type="radio" name="group-two" id="IBCol"  value="1" />
         <label for="BWBCol">Black/White</label>
         <input title="Border Color is Black or White based on Bar Color" type="radio" name="group-two" id="BWBCol" value="2" />
         <label for="HPBcol">Handpick</label>
         <input title="No Automatic Border Color Manipulation" type="radio" name="group-two" id="HPBcol" value="3" />
         <br>
      </div>
      <div id="tab5" class="tab">
         <h2>Google Bar Placement</h2>
         <div id="BarPosRadioButtons">
            <label for="GBPosA">Sticky</label>
            <input type="checkbox" name="StickyCheckBox" id="GBPosA" value="absolute" />
         </div>
         <h2>Google Bar Font</h2>
         <div id="BarFontOption">
            <select name="GoogleBarFont"></select>
         </div>
      </div>
      <div id="tab6" class="tab">
                  <h2>Import/Export</h2>
<p>Warning: Editing the Imported Code can cause issues.<br> Only paste generated exported code please!</p>
         <h4>Import</h4>
         <textarea id="ImportSettings" rows="6" cols="50"></textarea>
         <h4>Export</h4>
         <textarea id="ExportSettings" rows="6" cols="50"></textarea>

         <button id="CopyButton">Copy</button>
      </div>
   </div>
   <div>
      <table id="SettingsFooter">
         <tr>
            <td><a id="SubmitBug" title="Submit a bug" href="https://greasyfork.org/en/forum/post/discussion?script=29660"><img src="data:image/png;base64,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/GMzLdsAADowaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzExMSA3OS4xNTgzMjUsIDIwMTUvMDkvMTAtMDE6MTA6MjAgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNy0wNS0wOVQxNjoyOTozNS0wNTowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTctMDUtMDlUMTY6Mjk6MzUtMDU6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE3LTA1LTA5VDE2OjI5OjM1LTA1OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo0NzIzNjQ4Zi0wZTVmLWQ2NDktYjJjNi02OWNmZGNjZmI0Njk8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4YjliNGFhYy0zNGZlLTExZTctYjRkMC1lMjlhMmRmYWRjNzE8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDowYmYyMzM3NS1kY2E3LTdkNGItYTYwNi02ZmU4NDRjZTRhZDU8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MGJmMjMzNzUtZGNhNy03ZDRiLWE2MDYtNmZlODQ0Y2U0YWQ1PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE3LTA1LTA5VDE2OjI5OjM1LTA1OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjQ3MjM2NDhmLTBlNWYtZDY0OS1iMmM2LTY5Y2ZkY2NmYjQ2OTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0wNS0wOVQxNjoyOTozNS0wNTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE5PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5meyu1AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAARrSURBVHjajJJJbJVVGIafc/7/9t7b/45t6UBbhTLKDCKIUyAhqCSiEqMREyOEKASjMSwMsmDhEBdOEA2DBBOjrIxxYEFwQBSHRJkJRUBbKJTS0tv2Tv94znHhEF0oPst38eT73rxixeu9hAp8lcSSkk2z1jFjzHF6vHGkimffVLFJm6ulS2f7Lp3H2E3tgdu/yWQyjzfXXtJdlyey5fSreJFFjCoxG6wZd61HGYjJiEqU5Rc1n9nyBDkfVJ2siVWObBS62loYqtweesNPp1rzH9e6uePFkUbe6X2OK5UWHGsIjMCSYEcaIi3vU8palk6VV50bHM2ZrYrpQ0cJX2wczE7vWxobsJYaJdHJENWV3+K9OUA3HfTc2YTjjOCW7LctofdLo3dLrQUCugItV/Yn8q0L+vYys/8ghUr2qcqm8tdhTwaTtrFSoAu1dL+c3NN3JbVxfPEEky//QI9pyvuRXO0rq6ccxJAGsIQ5ZgyEgX6pmsiSCjKJjn5vc11eYzkKowQ6kliOoqHNY/Sw+0LcSzSO2DnCQD2PAWWsb0JlYyMkUhjittrq9qm1P6ZvG3jriUXe5Iv7mHxvmbp8iZqBGtI+JBMBZx8tcKolQ3fdjRs64zd7maGRdTIhdiMECBAPvjaAlOD7Maxq9jG3/aNdp+ftFCKeoHHQcGulwHr7KD1dPluKkziRzlPICpTy6DiznFjP3WvLDG+z7QBtQDzwylVcN01r8ynmzv6APd7hI+ddZqVMmjIWvSLFHNWP3z3EIT9Ps+1Ri8bVFZrS4tyShikTjh5eQn9hJtlU9Y8OLQ9vpJWTA87iq8qb5WgHgSZNyFQ5RK+o5QIpJogiDhECTVLWMuRVxnf2xe6P/A4y2RrS6SRSCrBi7uwrA6MuHzmx7DNEhCUVf6IQZAnIEqAQf+VCKCxb03n8jg97u3MDxgzeYhDIULHc9eOHtcXPatR3WwXGGCO5JkaCAd1waqeMR0cKfYVvS6XqwzKI2CCD3I7rbvhkYcv07dsiv17A/xAC2q/DGfv+rrZp+5Y4sdY3RoaHn7WTdjRfJYq63nFJVue1nzc92Ji/PffvRIS06DnXZ1Pmez/HMwkdF1JKrRPJCl2dD6VPHtywS2qJtL1ryoQMEEZz4dDKHZfOrWoIbRuEMNKSEktISpH3RV6kM/Wi/ljVeIj/uFEAnglwZK7T0ZhS8cwBjCQgjRQCQiXaKoG8aUxDedzMvLOqFGg0+l+VCqj4mpubck92tGfHllx/ioiKE+Mxfp9NNbD2JGLh1WKkeqcmJh9ekGn/9EpYITT/7FIg0MYw6JaZUt/41aTWaV/6drYQr7Eu+JWRvU4sREZaIoT5KZX0VwwVc7iVNu4ZNXbZ3ET9ds+EjOgQjcEA5SjA1Yrpqfy7C9uaF12sZimWHUY1OI8g7QORsbGNsUjYwWqjbSquw6AHORGyINm8ZnQs896vqrzmql9dDFgtidr97U5qx7ik87kkoOra+KGDXWMOpuzagwib3wYAYVQcG6Op2HAAAAAASUVORK5CYII="></a></td>
         </tr>
      </table>
   </div>
</div>
`);


        $("#GoogleBar").append('<div class="dropdown"><button class="GoogleBarDropDownButton">More ▾</button><div class="dropdown-content"></div></div>');
        $("#GoogleBar").prepend('<div id="ShowGear"></div>');
        $("#GoogleBar").prepend('<div id="GearIcon">⚙</div>');

        GenerateBarLinksFromGetValues();
        GenerateBarMenuLinksFromGetValues();
        GenerateExportSettings();
        GenerateSetBarLinkInput();
        GenerateSetBarMenuLinkInputBoxes();


    }

    CreateGoogleBar();

    $(document).ready(function() {
       // SetDefaults();

        //================================================test code

var fonts = ["Arimo","Comfortaa","Dosis","Inconsolata","Lato","Lora","Merriweather","Montserrat","Mukta","Muli","Noto Sans","Open Sans Condensed","Open Sans","Oswald","Oxygen","PT Sans","Playfair Display","Poppins","Questrial","Quicksand","Raleway","Righteous","Roboto Condensed","Roboto Mono","Roboto Slab","Roboto","Slabo 27px","Source Sans Pro","Titillium Web","Ubuntu"];
var sel = $('[name=GoogleBarFont]');
for(var i = 0; i < fonts.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = fonts[i];
    opt.value = fonts[i];
     sel.append(opt);
};
        //================================================test code

        $('[name=GBMenuDisplay]').change(function() {
            var c = this.checked ? GM_setValue("GB_MenuDisplay", "0") : GM_setValue("GB_MenuDisplay", "1");
            if (GM_getValue("GB_MenuDisplay") === "0") {
                $(".dropdown").css("display", "none");
            } else if (GM_getValue("GB_MenuDisplay") === "1") {
                $(".dropdown").css("display", "inline-block");
            }
            GenerateExportSettings();
        });



        $('input[type=radio][name=group-one]').change(function() {
            if (this.value === "1") {
                GM_setValue('GB_LColMode', "1");
                GM_setValue('GB_LColor', invertColor(GM_getValue('GB_BGColor'), ""));
                $('#GoogleBar a,#GearIcon,.GoogleBarDropDownButton').css("color", invertColor(GM_getValue('GB_BGColor'), ""));
                $('#GoogleBar,.dropdown-content').css("background-color", GM_getValue('GB_BGColor'));
            } else if (this.value === "2") {

                GM_setValue('GB_LColMode', "2");
                GM_setValue('GB_LColor', invertColor(GM_getValue('GB_BGColor'), "BW"));
                $('#GoogleBar a,#GearIcon,.GoogleBarDropDownButton').css("color", invertColor(GM_getValue('GB_BGColor'), "BW"));
                $('#GoogleBar,.dropdown-content').css("background-color", GM_getValue('GB_BGColor'));
            } else if (this.value === "3") {

                GM_setValue('GB_LColMode', "3");
            }
            document.getElementById("GoogleBarLinkColor").value = GM_getValue('GB_LColor');
            GenerateExportSettings();
        });



        $('input[type=radio][name=group-two]').change(function() {
            if (this.value === "1") {
                GM_setValue('GB_BColMode', "1");
                GM_setValue('GB_BColor', invertColor(GM_getValue('GB_BGColor'), ""));
                $('.GBLinkActive').css("borderTop", "2px solid " + invertColor(GM_getValue('GB_BGColor'), ""));
                $(".GBLinkBlock").hover(function(e) {
                    $(this).css("borderTop", e.type === "mouseenter" ? "2px solid " + GM_getValue("GB_BColor") : "2px solid transparent")
                });
            } else if (this.value === "2") {
                GM_setValue('GB_BColMode', "2");
                GM_setValue("GB_BColor", invertColor(GM_getValue('GB_BGColor'), "BW"));
                $('.GBLinkActive').css("borderTop", "2px solid " + invertColor(GM_getValue('GB_BGColor'), "BW"));
                $(".GBLinkBlock").hover(function(e) {
                    $(this).css("borderTop", e.type === "mouseenter" ? "2px solid " + GM_getValue("GB_BColor") : "2px solid transparent")
                });
            } else if (this.value === "3") {

                GM_setValue('GB_BColMode', "3");

            }
            GenerateExportSettings();
            document.getElementById("GoogleBarBorderColor").value = GM_getValue('GB_BColor');
        });

        $('input[type=number][name=BarLinkNumberInput]').bind('keyup input', function() {
            GM_setValue("GB_TotalBarLinks", this.value);
            DestroyAndCreateBarLinksAndSettingInput();
            GenerateExportSettings();
        });



        $('input[type=number][name=BarMenuNumberInput]').bind('keyup input', function() {
            GM_setValue("GB_TotalBarMenuLinks", this.value);
            DestroyAndCreateMoreLinksAndSettingInput();
            GenerateExportSettings();
        });


        $('[name=StickyCheckBox]').change(function() {
            var c = this.checked ? GM_setValue("GB_Pos", "fixed") : GM_setValue("GB_Pos", "absolute");
            if (GM_getValue("GB_Pos") === "fixed") {
                GM_setValue('GB_Pos', "fixed");
            } else {
                GM_setValue('GB_Pos', "absolute");

            }
            $('#GoogleBar').css("position", GM_getValue("GB_Pos"));
            GenerateExportSettings();
        });


        $('[name=GoogleBarFont]').change(function() {
            var fontID = $('[name=GoogleBarFont]').find(":selected").text();
            GM_setValue("GB_Font", fontID);
            addGoogleFont(fontID);
            $("#GoogleBar a,.GoogleBarDropDownButton").css("font-family", fontID);
            GenerateExportSettings();
        });




        $('#ImportSettings').on('input', function(e) {
            var ImportedSettings = $('#ImportSettings').val();
            if (ImportedSettings.startsWith("|===============Google Bar===============|")) {
                var ImportedRow = ImportedSettings.split(/\r?\n/);
                var ImportedBarSettings = ImportedRow[1];
                var ImportedBarSettingsCell = ImportedBarSettings.split("|");
                GM_setValue("GB_BGColor", ImportedBarSettingsCell[0]);
                GM_setValue("GB_BColor", ImportedBarSettingsCell[1]);
                GM_setValue("GB_LColor", ImportedBarSettingsCell[2]);
                GM_setValue("GB_Pos", ImportedBarSettingsCell[3]);
                GM_setValue("GB_TotalBarLinks", ImportedBarSettingsCell[4]);
                GM_setValue("GB_TotalBarMenuLinks", ImportedBarSettingsCell[5]);
                GM_setValue("GB_LColMode", ImportedBarSettingsCell[6]);
                GM_setValue("GB_RandCol", ImportedBarSettingsCell[7]);
                GM_setValue("GB_MenuDisplay", ImportedBarSettingsCell[8]);
                GM_setValue("GB_Font", ImportedBarSettingsCell[9]);
                GM_setValue("GB_ColorCycleDuration", ImportedBarSettingsCell[10]);

                var ImportedBarSites = ImportedRow[3];
                var TotalBarLinks = GM_getValue("GB_TotalBarLinks")
                var TotalMenuLinks = GM_getValue("GB_TotalBarMenuLinks")
                var i;
                var n;
                var LinkPart;
for (i = 1; i <= TotalBarLinks; i++) {
    n = i + 2;
    LinkPart = ImportedRow[n].split("|");
    GM_setValue("GB_Url" + i , LinkPart[0]);
    //console.log(GM_getValue("GB_Url" + i));
    GM_setValue("GB_Url" + i + "text", LinkPart[1]);
    //console.log(GM_getValue("GB_Url" + i + "text"));
                DestroyAndCreateBarLinksAndSettingInput();
                DestroyAndCreateMoreLinksAndSettingInput();
            GenerateExportSettings();
}

for (i = 1; i <= TotalMenuLinks; i++) {
    n = i + 3 + parseInt(TotalBarLinks);
    LinkPart = ImportedRow[n].split("|");
    GM_setValue("GB_DropDownUrl" + i , LinkPart[0]);
    console.log(GM_getValue("GB_DropDownUrl" + i));
    GM_setValue("GB_DropDownUrl" + i + "text", LinkPart[1]);
    console.log(GM_getValue("GB_DropDownUrl" + i + "text"));
                DestroyAndCreateBarLinksAndSettingInput();
                DestroyAndCreateMoreLinksAndSettingInput();
            GenerateExportSettings();
}


                $('#GoogleBar,.dropdown-content').css("background-color", ImportedBarSettingsCell[0]);
                $(".GBLinkBlock,.dropdown-content a,.GoogleBarDropDownButton").hover(function(e) {
                    $(this).css("background-color", e.type === "mouseenter" ? shadeColor(GM_getValue("GB_BGColor"), parseInt(GM_getValue("GB_Hover"))) : "transparent")
                });
                $('.GBLinkActive').css("borderTop", "2px solid " + ImportedBarSettingsCell[1]);
                $(".GBLinkBlock").hover(function(e) {
                    $(this).css("borderTop", e.type === "mouseenter" ? "2px solid " + ImportedBarSettingsCell[1] : "2px solid transparent")
                });
                $('#GoogleBar a,#GearIcon,.GoogleBarDropDownButton').css("color", ImportedBarSettingsCell[2]);
                $('#GoogleBar').css("position", ImportedBarSettingsCell[3]);
                if (ImportedBarSettingsCell[7] === "1") {} else {
                    GM_addStyle(`#GoogleBar a,#GearIcon,.GoogleBarDropDownButton{ms-transition:color 400ms linear;
                                 transition:color 400ms linear;
                                 webkit-transition:color 400ms linear;}
                                 #GoogleBar,.dropdown-content{ms-transition:background-color 400ms linear;
                                 transition:background-color 400ms linear;
                                 webkit-transition:background-color 400ms linear;`);
                                 }

                DestroyAndCreateBarLinksAndSettingInput();
                DestroyAndCreateMoreLinksAndSettingInput();
            }
            GenerateExportSettings();
        });


        if (vLinkColorMode === "1") {
            $("#ICol").prop("checked", true)
        } else if (vLinkColorMode === "2") {
            $("#BWCol").prop("checked", true)
        } else if (vLinkColorMode === "3") {
            $("#HPcol").prop("checked", true)
        }

        if (vBorderColorMode === "1") {
            $("#IBCol").prop("checked", true)
        } else if (vBorderColorMode === "2") {
            $("#BWBCol").prop("checked", true)
        } else if (vBorderColorMode === "3") {
            $("#HPBcol").prop("checked", true)
        }


        if (vBarPosition === "fixed") {
            $("#GBPosA").prop("checked", true)
        }


        //=========Background color change
        $('#GoogleBarBackgroundColor').on('input', function() {
            $('#GoogleBar,.dropdown-content').css("background-color", $(this).val());
            GM_setValue("GB_BGColor", $(this).val());
            if (GM_getValue('GB_LColMode') === "1") {
                $('#GoogleBar a,#GearIcon,.GoogleBarDropDownButton').css("color", invertColor(GM_getValue('GB_BGColor'), ""));
                $('#GoogleBar,.dropdown-content').css("background-color", GM_getValue('GB_BGColor'));
                GM_setValue("GB_LColor", invertColor(GM_getValue('GB_BGColor'), ""));
            } else if (GM_getValue('GB_LColMode') === "2") {
                $('#GoogleBar a,#GearIcon,.GoogleBarDropDownButton').css("color", invertColor(GM_getValue('GB_BGColor'), "BW"));
                $('#GoogleBar,.dropdown-content').css("background-color", GM_getValue('GB_BGColor'));
                GM_setValue("GB_LColor", invertColor(GM_getValue('GB_BGColor'), "BW"));
            }
            document.getElementById("GoogleBarLinkColor").value = GM_getValue('GB_LColor');
            if (GM_getValue('GB_BColMode') === "1") {
                GM_setValue('GB_BColMode', "1");
                GM_setValue('GB_BColor', invertColor(GM_getValue('GB_BGColor'), ""));
                $('.GBLinkActive').css("borderTop", "2px solid " + invertColor(GM_getValue('GB_BGColor'), ""));
                $(".GBLinkBlock").hover(function(e) {
                    $(this).css("borderTop", e.type === "mouseenter" ? "2px solid " + GM_getValue("GB_BColor") : "2px solid transparent")
                });
            } else if (GM_getValue('GB_BColMode') === "2") {
                GM_setValue('GB_BColMode', "2");
                GM_setValue("GB_BColor", invertColor(GM_getValue('GB_BGColor'), "BW"));
                $('.GBLinkActive').css("borderTop", "2px solid " + invertColor(GM_getValue('GB_BGColor'), "BW"));
                $(".GBLinkBlock").hover(function(e) {
                    $(this).css("borderTop", e.type === "mouseenter" ? "2px solid " + GM_getValue("GB_BColor") : "2px solid transparent")
                });
            }
            document.getElementById("GoogleBarBorderColor").value = GM_getValue('GB_BColor');

        });




        //=========link color change
        $('#GoogleBarLinkColor').on('input', function() {
            $('#GoogleBar a,#GearIcon,.GoogleBarDropDownButton').css("color", $(this).val());
            GM_setValue("GB_LColor", $(this).val());
            $("#HPcol").prop("checked", true)
            GM_setValue('GB_LColMode', "3");
        });

        //=========border color change
        $('#GoogleBarBorderColor').on('input', function() {

            $('.GBLinkActive').css("borderTop", "2px solid " + $(this).val());
            GM_setValue("GB_BColor", $(this).val());
            $(".GBLinkBlock").hover(function(e) {
                $(this).css("borderTop", e.type === "mouseenter" ? "2px solid " + GM_getValue("GB_BColor") : "2px solid transparent")
            });
            GM_setValue('GB_BColMode', "3");
            $("#HPBcol").prop("checked", true)
        });



        $("#CopyButton").click(function() {
            var copyText = document.querySelector("#ExportSettings");
            copyText.select();
            document.execCommand("Copy");
        });

        $("#GearIcon,#close_button").click(function() {
            showsettings();
            $('.tabs .tab-links a')[0].click();
        });

        var $GearIcon = $('#GearIcon');
        var $ShowGear = $('#ShowGear');

        $ShowGear.on('mouseover', function() {
            $('#GearIcon').addClass("show");
        });
        $('#GearIcon').on('mouseout', function() {
            $(this).removeClass("show");
        });

        $('.tabs .tab-links a').on('click', function(e) {
            $('#SubmitBug').css("left", getRandomInt(96) + "%")
            var currentAttrValue = $(this).attr('href');
            GoogleColorBorderIndex++
            if (GoogleColorBorderIndex === 4) {
                GoogleColorBorderIndex = 0
                GoogleColorBorder = "#3CBA54";
            } else if (GoogleColorBorderIndex === 1) {
                GoogleColorBorder = "#f4c20d";
            } else if (GoogleColorBorderIndex === 2) {
                GoogleColorBorder = "#db3236";
            } else if (GoogleColorBorderIndex === 3) {
                GoogleColorBorder = "#4885ed";
            }


            // Show/Hide Tabs
            $('.tabs ' + currentAttrValue).slideDown(400);
            $('.tabs ' + currentAttrValue).siblings().slideUp(300);
            // Change/remove current tab to active
            $(this).parent('li').addClass('active').css('borderBottom', '2px solid ' + GoogleColorBorder).siblings().removeClass('active').css('borderBottom', '2px solid transparent');

            e.preventDefault();
        });

        //loop to set value to all inpot boxes

    });



        //  $(".gb_Ec").appendTo($("#GoogleBar")).css("float","right");
  //      $("#gbwa").appendTo($('[name*="GoogleBarSearchTerm"]')).css("float", "right");
  //      $(".gb_Nc").appendTo($("#GoogleBar")).css("float", "right");
  //      $("#gbsfw").appendTo($(".gb_Nc"));
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     //   $('[name="q"]').on("input", function() {
       //     var GBsearchterm = this.value;
      //      $('[name="GoogleBarSearchTerm"]').val(GBsearchterm)
     //   });

       // $('[name="GoogleBarSearchTerm"]').on("input", function() {
         //   var GBsearchterm = this.value;
           // $('[name="q"]').val(GBsearchterm);


//});


   //     $('[name="GoogleBarSearchTerm"]').val($('[name="q"]').val());


    GoogleBarSearch("https://www.google.com/webhp#q=", "webhp");
    GoogleBarSearch("https://www.google.com/search?site=imghp&tbm=isch&q=", "imghp");
    GoogleBarSearch("https://books.google.com/?q=", "");
    GoogleBarSearch("https://developers.google.com/s/results/?q=", "");
    GoogleBarSearch("https://docs.google.com/document/u/0/?q=", "");
    GoogleBarSearch("https://drive.google.com/drive/search?q=", "");
    GoogleBarSearch("https://earth.google.com/web/search/", "");
    GoogleBarSearch("https://www.google.com/finance?q=", "finance");
    GoogleBarSearch("https://groups.google.com/forum/#!search/", "");
    GoogleBarSearch("https://mail.google.com/mail/u/0/#search/", "");
    GoogleBarSearch("https://inbox.google.com/search/", "");
    GoogleBarSearch("https://keep.google.com/#search/text ", "");
    GoogleBarSearch("https://maps.google.com/?q=", "");
    GoogleBarSearch("https://myactivity.google.com/myactivity?q=", "");
    GoogleBarSearch("https://news.google.com/news/section?cf=all&q=", "");
    GoogleBarSearch("https://patents.google.com/?q=", "");
    GoogleBarSearch("https://photos.google.com/search/", "");
    GoogleBarSearch("https://www.google.com/publicdata/directory#!q=", "publicdata");
    GoogleBarSearch("https://scholar.google.com/scholar?hl=en&q=", "");
    GoogleBarSearch("https://www.google.com/shopping?q=", "shopping");
    GoogleBarSearch("https://support.google.com/search?q=", "");
    //not gonna work....\/\/\/
    //GoogleBarSearch("https://www.google.com/search?tbm=vid&hl=en&source=hp&q=","vid");
    //not gonna work..../\/\/\
    GoogleBarSearch("https://www.youtube.com/results?search_query=", "");
    GoogleBarSearch("https://www.facebook.com/search/top/?q=", "");
    GoogleBarSearch("https://www.reddit.com/search?q=", "");
    GoogleBarSearch("https://www.amazon.com/s/?tag=forgetabyte0f-20&field-keywords=", "");
    GoogleBarSearch("https://en.wikipedia.org/wiki/", "");
    GoogleBarSearch("https://search.yahoo.com/search;?p=", "");
    GoogleBarSearch("https://twitter.com/search?q=", "");
    GoogleBarSearch("https://www.netflix.com/search?q=", "");
    GoogleBarSearch("http://www.ntd.tv/?s=", "");
    GoogleBarSearch("http://craigslist.org/search/sss?query=", "");
    GoogleBarSearch("https://www.pinterest.com/search/pins/?q=", "");
    GoogleBarSearch("http://www.espn.com/search/results?q=", "");
    GoogleBarSearch("https://www.pornhub.com/video/search?search=", "");
    GoogleBarSearch("http://www.cnn.com/search/?text=", "");
    GoogleBarSearch("https://www.bing.com/search?q=", "");
    GoogleBarSearch("http://www.imdb.com/find?q=", "");
    GoogleBarSearch("https://query.nytimes.com/search/sitesearch/?&pgtype=Homepage#/", "");
    GoogleBarSearch("http://stackoverflow.com/search?q=", "");
    GoogleBarSearch("https://github.com/search?q=", "");
    GoogleBarSearch("http://www.xvideos.com/?k=", "");
    GoogleBarSearch("https://xhamster.com/search.php?q=", "");
    GoogleBarSearch("https://greasyfork.org/en/scripts?&q=", "");
    GoogleBarSearch("https://support.google.com/websearch/search?q=", "");

    //https://research.google.com/bigpicture/music/#s%3Arascal%20flatts
    //play store
    //alerts


    function showsettings() {
        $("#settings_box").fadeToggle(250);
        $("#settings_box").css({
            "visibility": "visible",
            "display": "block"
        });
    }

    $('.GBLinkBlock').eq(0).css("margin-left", "30px")
    GM_addStyle(`


#GoogleBar {
	height: 29px;
	position: ` + GM_getValue("GB_Pos") + `;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 2999999998;
}

.GBLink,
.GoogleBarDropDownButton {
	font-family: ` + vGoogleBarFontType + `;
}

#GoogleBar *,
#settings_box * {
	font-size: 13px;
	text-decoration: none;
}

#GoogleBar h2 {
	Background-calendar: #ddd!important;
}

#GoogleBar ul {
	white-space: nowrap;
	margin: 0;
	padding: 0;
}


.GBLinkBlock {
	display: block;
	float: left;
	height: 27px;
	line-height: 27px!important;
	padding-left: 8px;
	padding-right: 8px;
	text-align: center;
	text-align: left;
	border-top: 2px solid transparent;
}

.GBLinkBlock:hover {
	border-top: 2px solid ` + vGoogleBarBorderColor + `;
}

.GBLinkActive {
	border-top: 2px solid ` + vGoogleBarBorderColor + `;
}

#GoogleBar,
.dropdown-content {
	background-color: ` + vGoogleBarBackgroundColor + `;
	ms-transition: background-color 400ms ease;
	transition: background-color 400ms ease;
	webkit-transition: background-color 400ms ease;
}

#GoogleBar a,
#GearIcon,
.GoogleBarDropDownButton {
	color: ` + GM_getValue('GB_LColor') + `;
	ms-transition: color 400ms ease;
	transition: color 400ms ease;
	webkit-transition: color 400ms ease;
}

.GoogleBarDropDownButton {
background-color: transparent;

line-height: 31px;

padding-left: 8px;

padding-right: 8px;

text-align: center;

cursor: pointer;

border: solid 0px transparent;

height: 29px;
}

.dropdown {
	position: relative;
}

.dropdown-content {
	box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.2);
	display: none;
	min-width: 100px;
	position: relative;
	top: 0px;
	width: auto;
	z-index: 2999999998;
}

.dropdown-content a {
	color: black;
	display: block;
	padding: 10px 12px;
	text-decoration: none;
}

.dropdown:hover .dropdown-content {
	display: block;
}

#GearIcon {
	display: block;
	float: left;
	line-height: 29px!important;
	padding-left: 8px;
	padding-right: 8px;
	text-align: center;
	text-align: left;
	font-size: 20px;
	cursor: pointer;
	width: 16px;
	height: 29px;
	position: fixed;
	top: 0;
	left: -30px;
	transition: 300ms;
}

#ShowGear {
	width: 6px;
	height: 29px;
	background-color: transparent;
	top: 0;
	left: 0;
	position: fixed;
}

#GearIcon.show {
	left: 0;
}

#H3Right {
	float: right!important;
	width: 50%!important;
}

#H3Left {
	float: left!important;
	width: 50%!important;
}

#settings_box {
	background-color: #efefef !important;
	border: 1px solid #ccc !important;
	border-top-color: rgb(204, 204, 204) !important;
	border-right-color: rgb(204, 204, 204) !important;
	border-bottom-color: rgb(204, 204, 204) !important;
	border-left-color: rgb(204, 204, 204) !important;
	border-color: rgba(0, 0, 0, .2) !important;
	color: #000 !important;
	-moz-box-shadow: 0 2px 10px rgba(0, 0, 0, .2) !important;
	box-shadow: 0 2px 10px rgba(0, 0, 0, .2) !important;
	-moz-border-radius: 2px !important;
	border-radius: 2px !important;
	-moz-user-select: text !important;
	display: none;
	position: fixed!important;
	left: 6px!important;
	top: 35px!important;
	visibility: hidden;
	width: 450px!important;
    min-width:400px!important;
	z-index: 11111111111!important;
	font-family: helvetica, sans-serif !important;
}

#settings_box #cancel_button {
	background-color: grey;
	border: 1px solid #acacac;
	border: none;
	box-shadow: rgba(0, 0, 0, .2) 0 4px 16px;
	color: white;
	cursor: pointer;
	float: right;
	margin-bottom: 2px!important;
	margin-right: 2px!important;
	margin-top: 2px!important;
	padding: 5px;
	width: 16px;
}

#settings_box #info_text {
	background-color: #eee;
	clear: both;
	color: #6E6E6E;
	padding: 10px!important;
}

#settings_box h2 {
	display: block;
	font-size: 1.5em;
	font-weight: bold;
	webkit-margin-after: 0.83em;
	webkit-margin-before: 0.83em;
	webkit-margin-end: 0px;
	webkit-margin-start: 0px;
}

#settings_box h4 {
	font-size: 1.5em;
	font-weight: bold;
	webkit-margin-after: 0.83em;
	webkit-margin-before: 0.83em;
	webkit-margin-end: 0px;
	webkit-margin-start: 0px;
	width: 100px;
	display: table-cell;
}

#settings_box th,
#settings_box td {
	padding: 0px;
	background-color: transparent;
}

#settings_box table{
width:100%;
}

#GoogleBarColorLabels {
	width: 100%;
}

#GoogleBarColorLabels td {
	width: 33.333333%;
}

#SettingsFooter {
	width: 100%;
}

#SubmitBug {
	position: relative;
	transition: 1s;
	left: ` + getRandomInt(96) + `%
}

label[for="ICol"] {
	padding-left: 17px!important;
}

#settings_box #close_button {
	color: grey;
	cursor: pointer;
	float: right;
	font-size: 22px;
	height: 22px;
	width: 17px;
	line-height: 22px;
}

.tabs {
	display: inline;
	width: 100%;
}

.tab-links:after {
	clear: both;
	content: '';
	display: block;
}

.tab-links {
	margin: 0!important;
	padding: 0!important;
}

.tab-links li {
	float: left;
	list-style: none;
	margin: 0px 5px;
}

.tab-links a {
	color: #000!important;
	display: inline-block;
	font-size: 16px!important;
	font-weight: 100;
	padding: 3px 5px!important;
	padding-bottom: 12px;
	transition: all linear 0.15s;
}

.tab-links a:hover {
	background: #eee;
	text-decoration: none;
}

li.active a,
li.active a:hover {
	color: #262626;
	font-weight: bold;
	padding-bottom: 18px;
	font-size: 20px;
}

.tab-content {
	box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.15);
	height: auto;
	max-height: 666px;
	overflow: auto;
	padding: 5px;
    width:96%;
}

.tab {
	display: none;
}

.tab.active {
	display: block;
}

[name="BarLinkNumberInput"],
[name="BarMenuNumberInput"] {
	margin-left: 5px;
	width: 30px;
}

[name=vColCycleDuration] {
	width: 50px;
}

#ExportSettings,
#ImportSettings {
	font-size: 11px!important;
	width: 98%;
}

#CopyButton {
	float: right;
}

[name*="barurl"],
[name*="DropDownURL"] {
	color: black!important;
	margin-right: 5px;
	margin-top: 2px;
	width: 275px!important;
}

[name*="BarLinkNumberInput"],
[name*="GoogleBarFont"],
[name*="vColCycleDuration"],
[name*="BarMenuNumberInput"],
[name*="texturl"],
[name*="barurl"],
[name*="DropDownText"],
[name*="DropDownURL"] {
	border-radius: 3px;
	border: 0px;
	-moz-box-shadow: 0 0px 2px 0 rgba(0, 0, 0, 0.4);
	box-shadow: 0 0px 2px 0 rgba(0, 0, 0, 0.4);
	background-color: #efefef;
	color: black!important;
}

[name*="BarLinkNumberInput"]:focus,
[name*="GoogleBarFont"]:focus,
[name*="vColCycleDuration"]:focus,
[name*="BarMenuNumberInput"]:focus,
[name*="texturl"]:focus,
[name*="barurl"]:focus,
[name*="DropDownText"]:focus,
[name*="DropDownURL"]:focus {
	background: #F5F5F5;
}

[name*="texturl"],
[name*="DropDownText"] {
	margin-right: 5px;
	margin-top: 2px;
	width: 100px!important;
}

[name*="GoogleBarSearchTerm"] {
	line-height: 16px;
	right: 30px;
	top: 5px;
	position: absolute;
	width: 300px;
	border-radius: 2px;
	border: none;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
}



/*====reset css====*/


`);


    $('.GBLinkBlock a').each(function() {
        var $this = $(this);
        // if the current path is like this link, make it active

        if ($this.attr('href') === vCurrentWebpage) {
            $this.parent().addClass('GBLinkActive');

        }

    });

    if (vCurrentWebpage == "https://www.google.com/") {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
`);
        $('[name="q"]').on("input", function() {
            var GBsearchterm = this.value;
            $('[name="GoogleBarSearchTerm"]').val(GBsearchterm)
        });

        $('[name="GoogleBarSearchTerm"]').val($('[name="q"]').val());

        $('[name="GoogleBarSearchTerm"]').on("input", function() {
            var GBsearchterm = this.value;
            $('[name="q"]').val(GBsearchterm)
        });

        $('[name="GoogleBarSearchTerm"]').on('keyup', function (e) {
    if (e.keyCode == 13) {
        window.location.href = "https://www.google.com/webhp#q=" + $('[name="GoogleBarSearchTerm"]').val();
    }
});

    } else if (/google.{2,14}about\/products/.test(vCurrentWebpage) == true ||
        /google.{2,14}policies\//.test(vCurrentWebpage) == true ||
        /google.{2,14}ads\//.test(vCurrentWebpage) == true ||
        /google.{2,14}safetycenter\//.test(vCurrentWebpage) == true ||
        /google.{2,14}about\//.test(vCurrentWebpage) == true ||
        /.greasyfork.{2,6}/.test(vCurrentWebpage) == true ||
        /calendar.google.{2,6}/.test(vCurrentWebpage) == true ||
        /duo.google.{2,6}/.test(vCurrentWebpage) == true ||
        /google.{2,6}#q=/.test(vCurrentWebpage) == true ||
        /google.{2,6}#safe/.test(vCurrentWebpage) == true ||
        /google.{2,6}?ei=/.test(vCurrentWebpage) == true ||
        /google.{2,6}adsense/.test(vCurrentWebpage) == true ||
        /google.{2,6}adwords/.test(vCurrentWebpage) == true ||
        /google.{2,6}alerts/.test(vCurrentWebpage) == true ||
        /google.{2,6}analytics/.test(vCurrentWebpage) == true ||
        /google.{2,6}business/.test(vCurrentWebpage) == true ||
        /google.{2,6}chrome\//.test(vCurrentWebpage) == true ||
        /google.{2,6}earth\//.test(vCurrentWebpage) == true ||
        /google.{2,6}finance/.test(vCurrentWebpage) == true ||
        /google.{2,6}flights/.test(vCurrentWebpage) == true ||
        /google.{2,6}imghp/.test(vCurrentWebpage) == true ||
        /google.{2,6}preferences/.test(vCurrentWebpage) == true ||
        /google.{2,6}settings/.test(vCurrentWebpage) == true ||
        /google.{2,6}search/.test(vCurrentWebpage) == true ||
        /google.{2,6}shopping/.test(vCurrentWebpage) == true ||
        /google.{2,6}videohp/.test(vCurrentWebpage) == true ||
        /google.{2,6}webhp/.test(vCurrentWebpage) == true ||
        /google.{2,6}$/.test(vCurrentWebpage) == true ||
        /adwords.google.{2,6}/.test(vCurrentWebpage) == true ||
        /classroom.google.{2,6}/.test(vCurrentWebpage) == true ||
        /mail.google.{2,6}/.test(vCurrentWebpage) == true ||
        /myaccount.google.{2,6}/.test(vCurrentWebpage) == true ||
        /privacy.google.{2,6}/.test(vCurrentWebpage) == true ||
        /play.google.{2,6}music/.test(vCurrentWebpage) == true ||
        /play.google.{2,6}store/.test(vCurrentWebpage) == true ||
        /support.google.{2,6}/.test(vCurrentWebpage) == true ||
        /translate.google.{2,6}/.test(vCurrentWebpage) == true ||
        /admin.google.{2,6}/.test(vCurrentWebpage) == true ||
        /productforums.google.{2,6}/.test(vCurrentWebpage) == true ||
        /google.{2,14}about\/products/.test(vCurrentWebpage) == true
    ) {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
.gb_S .gb_Rc.gb_Rc,.gb_S .gb_Kc .gb_Rc.gb_Rc,.gb_S .gb_Kc .gb_b:hover .gb_Rc,.gb_S .gb_Kc .gb_b:focus .gb_Rc{
    background-color:red!important;
    color:blue!important;
    .gb_9c{display:none!important;}
}
`);

    } else if (/google.{2,6}maps/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
#omnibox-container,
#gb,
.widget-pane-toggle-button,
.widget-settings
.section-listbox{transform: translateY(29px)!important;}
`);
        //Need
        //To
        //Fix
        //Scrollbar
    } else if (/news.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
#gb{transform: translateY(29px)!important;}
`);
    } else if (/express.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
body{transform:translateY(29px)!important;}
#GoogleBar{position:fixed!important;}
`);
    } else if (/google.{2,6}forms/.test(vCurrentWebpage) == true ||
        /google.{2,6}slides/.test(vCurrentWebpage) == true ||
        /google.{2,6}sheets/.test(vCurrentWebpage) == true ||
        /google.{2,6}docs/.test(vCurrentWebpage) == true ||
        /google.{2,6}services/.test(vCurrentWebpage) == true ||
        /google.{2,6}cloudprint/.test(vCurrentWebpage) == true
    ) {
        GM_addStyle(`
body{ transform: translateY(29px)!important;}
`);
    } else if (/store.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
`);
    } else if (/photos.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
`);
    } else if (/docs.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
`);
    } else if (/drive.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
#drive_main_page{transform: translateY(29px)!important;}
#GoogleBar{position:fixed!important;}
`);
    } else if (/keep.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
#gb,.notes-container{transform: translateY(29px)!important;}
#GoogleBar{position:fixed!important;}
`);
    } else if (/contacts.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
`);
    } else if (/books.google.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
#gb{transform:translateY(29px)!important;}
`);
    } else if (/voice.google.{2,6}/.test(vCurrentWebpage) == true ||
        /.google.{2,6}voice/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
body{transform:translateY(29px)!important;}
`);
    } else if (/youtube.{2,6}/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
ytd-app{transform:translateY(29px)!important;}
`);
    } else if (/google.{2,20}chromecast/.test(vCurrentWebpage) == true ||
        /allo.google.{2,6}/.test(vCurrentWebpage) == true ||
        /google.{2,20}chromebook/.test(vCurrentWebpage) == true
    ) {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
`);
    } else if (/google.{2,10}chrome\/newtab/.test(vCurrentWebpage) == true) {
        GM_addStyle(`
body{transform: translateY(29px)!important;}
`);
    }

})();