// ==UserScript==
// @name Progresigo
// @author Antoine Turmel
// @namespace https://github.com/AntoineTurmel/
// @homepage https://github.com/AntoineTurmel/progresigo
// @homepageURL https://github.com/AntoineTurmel/progresigo
// @description Improve search and browsing experience with various features
// @match https://www.instagram.com/*
// @match https://500px.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @version 0.2.20251104
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_notification
// @downloadURL https://update.greasyfork.org/scripts/441781/Progresigo.user.js
// @updateURL https://update.greasyfork.org/scripts/441781/Progresigo.meta.js
// ==/UserScript==

var count = 0;
var array = [];
var totalCount = 0;
var mode = 2;
var perc = 0;
var img_array = [];
var badgePosition = 0;
var badgeBgColor = "#000000";
var badgeTextColor = "#FFFFFF";
var preventClosingTab = true;

let scrolled = false;

window.addEventListener('scroll', function onFirstScroll() {
    scrolled = true;
    window.removeEventListener('scroll', onFirstScroll);
});

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function badgePositionChange(badgePosition){
    $("#badgecount").prop('style').removeProperty('top');
    $("#badgecount").prop('style').removeProperty('bottom');
    $("#badgecount").prop('style').removeProperty('left');
    $("#badgecount").prop('style').removeProperty('right');

    if (badgePosition == 1) {
        $("#badgecount").css("top", 10);
        $("#badgecount").css("left", 10);
    }
    if (badgePosition == 2) {
        $("#badgecount").css("top", 10);
        $("#badgecount").css("right", 10);
    }
    if (badgePosition == 3) {
        $("#badgecount").css("bottom", 10);
        $("#badgecount").css("left", 10);
    }
    if (badgePosition == 4 || badgePosition == 0) {
        $("#badgecount").css("bottom", 10);
        $("#badgecount").css("right", 10);
    }
}

function badgeColorChange(bg,text) {
    $("#badgecount").prop('style').removeProperty('color');
    $("#badgecount").prop('style').removeProperty('background-color');
    $("#badgecount").css("color", text);
    $("#badgecount").css("background-color", bg);
}

function displayBadge(badgePosition, bg, text){
    var txt = $("<div id='badgecount'></div>");
    $("body").append(txt);
    var badgetxt = $("<div id='badgetxt'>Scroll</div> <div title='Back to top' class='badgeel' id='badgeup'>⇱</div><div title='Settings...' class='badgeel' id='badgesettings'>⚙</div>");
    $("#badgecount").append(badgetxt);
    badgePositionChange(badgePosition);
    badgeColorChange(bg, text);
    $("#badgecount").css("position", "fixed");
    $("#badgecount").css("padding", "7px");
    $("#badgecount").css("border-radius", "30px");
    $("#badgecount").css("font-weight", "bold");
    $("#badgecount").css("flex-direction", "row");
    $("#badgecount").css("display", "flex");
    $("#badgecount").css("align-items", "center");
    $("#badgecount").css("justify-content", "end");
    $("#badgecount").css("height", "36px");
    $("#badgecount").css("min-width", "100px");
    $(".badgeel").css("padding-left", "5px");
    $(".badgeel").css("font-size", "20px");
    $("#badgetxt").css("cursor", "pointer");
    $("#badgeup").css("cursor", "pointer");
    $("#badgesettings").css("cursor", "pointer");

    $( "#badgetxt" ).click(function() {
        if (mode == 1) {
            mode = 2;
            $("#badgetxt").text(perc + "%");
        } else {
            mode = 1;
            $("#badgetxt").text(count + "/" + totalCount);
        }
    });

    $( "#badgeup" ).click(function() {
        $( "html" ).scrollTop( 0 );
    });
}

function displaySettings(){
  var txt = $('<dialog id="settingsDialog">\
  <form method="dialog">\
    <p><label>Default display :\
      <select id="badgeModeSelect">\
        <option value="1">Number/Total Number (eg. 5/10)</option>\
        <option value="2">Percentage % (eg. 50%)</option>\
      </select>\
    </label></p>\
    <p><label>Badge location :\
      <select id="badgePositionSelect">\
        <option value="1">Top left corner</option>\
        <option value="2">Top right corner</option>\
        <option value="3">Bottom left corner</option>\
        <option value="4">Bottom right corner</option>\
      </select>\
    </label></p>\
    <p><label>Badge background color:\
        <input type="color" id="badgeBgColorInput" name="badgeBgColorInput" value="#000000">\
    </label></p>\
    <p><label>Badge text color:\
        <input type="color" id="badgeTextColorInput" name="badgeTextColorInput" value="#ffffff">\
    </label></p>\
    <p><label>Prevent closing tab for this website:\
        <input type="checkbox" id="preventClosingTabInput" name="preventClosingTabInput">\
    </label></p>\
    <menu>\
      <button value="cancel">Cancel</button>\
      <button id="confirmBtn" value="default">Save</button>\
    </menu>\
  </form>\
</dialog>');
    $("body").append(txt);
    let settingsButton = document.getElementById('badgesettings');
    let badgeModeSelect = document.getElementById('badgeModeSelect');
    let badgePositionSelect = document.getElementById('badgePositionSelect');
    let badgeBgColorInput = document.getElementById('badgeBgColorInput');
    let badgeTextColorInput = document.getElementById('badgeTextColorInput');
    let preventClosingTabInput = document.getElementById('preventClosingTabInput');
    let settingsDialog = document.getElementById('settingsDialog');

    settingsButton.addEventListener('click', function onOpen() {
        if (typeof settingsDialog.showModal === "function") {
            settingsDialog.showModal();
        } else {
        console.error("L'API <dialog> n'est pas prise en charge par ce navigateur.");
        }
    });
    $('#badgeModeSelect option[value="' + mode + '"]').prop('selected', true);
    $('#badgePositionSelect option[value="' + badgePosition + '"]').prop('selected', true);
    $('#badgeBgColorInput').val(badgeBgColor);
    $('#badgeTextColorInput').val(badgeTextColor);
    $('#preventClosingTabInput').prop('checked', preventClosingTab);

    badgeModeSelect.addEventListener('change', function onSelect(e) {
        mode = badgeModeSelect.value;
    });

    badgePositionSelect.addEventListener('change', function onSelect(e) {
        badgePosition = badgePositionSelect.value;
    });

    badgeBgColorInput.addEventListener('change', function onSelect(e) {
        badgeBgColor = badgeBgColorInput.value;
    });

    badgeTextColorInput.addEventListener('change', function onSelect(e) {
        badgeTextColor = badgeTextColorInput.value;
    });

    preventClosingTabInput.addEventListener('change', function onSelect(e) {
        preventClosingTab = preventClosingTabInput.checked;
    });

    settingsDialog.addEventListener('close', function onClose() {
        GM_setValue("mode", mode);
        GM_setValue("badgePosition", badgePosition);
        GM_setValue("badgeBgColor", badgeBgColor);
        GM_setValue("badgeTextColor", badgeTextColor);
        GM_setValue("preventClosingTab."+window.location.host, preventClosingTab);
        badgePositionChange(badgePosition);
        badgeColorChange(badgeBgColor,badgeTextColor);
    });

}

$( document ).ready(function() {
    img_array = GM_getValue("img_array", []);
    mode = GM_getValue("mode", 2);
    badgePosition = GM_getValue("badgePosition", 4);
    badgeBgColor = GM_getValue("badgeBgColor", "#000000");
    badgeTextColor = GM_getValue("badgeTextColor", "#FFFFFF");
    preventClosingTab = GM_getValue("preventClosingTab."+window.location.host, true);
    //Badge display
    displayBadge(badgePosition, badgeBgColor, badgeTextColor);
    displaySettings();
    // IMG count shown for IG
    count = $("img[decoding='auto']").length;

    window.addEventListener('beforeunload', function (e) {
        if (scrolled && preventClosingTab && !window.location.href.includes("500px.com/photo/")) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
});

$( window ).scroll(function() {

    if (window.location.host.includes("instagram.com")) {
        //IG total count
        totalCount = $('span:contains("publications")')
    .find('span span')
    .first()
    .text()
    .trim();

        $("img[crossorigin='anonymous']").each(function( index ) {
            if (array.indexOf($( this ).attr('src')) === -1) {
                array.push($( this ).attr('src'));
            }
            //log de l'url insta
            //console.log($( this ).parent().parent().parent().attr('href'));

        });
    }

    if (window.location.host.includes("500px.com")) {
        totalCount = $("span:contains('Photos')").children().children().text().replace(/\s/g, '').replace(',', '');

        $("#justifiedGrid img").each(function( index ) {
            if (array.indexOf($( this ).attr('src')) === -1) {
                array.push($( this ).attr('src'));
            }
        });
    }

    count = array.length;

    if (count > totalCount) {
        count = totalCount;
    }

    perc = Math.round((count * 100) / totalCount);
    if (mode == 1) {
        $("#badgetxt").text(count + "/" + totalCount);
    }
    if (mode == 2) {
        $("#badgetxt").text(perc + "%");
    }

$("#badgecount").css("background", "linear-gradient(90deg, rgba(" + hexToRgb(badgeBgColor).r + ", " + hexToRgb(badgeBgColor).g + ", " + hexToRgb(badgeBgColor).b +", 1) " + perc + "%, rgba(" + hexToRgb(badgeBgColor).r + ", " + hexToRgb(badgeBgColor).g + ", " + hexToRgb(badgeBgColor).b +", 0.8) " + perc + "%)");

});