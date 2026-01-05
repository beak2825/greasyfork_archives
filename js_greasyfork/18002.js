// ==UserScript==
// @name         MyAnimeList(MAL) - Filter
// @version      1.1.5
// @description  This script can filter search results, recommandations, reviews, voice actors and more based on what you already have on your list, 
// @author       Cpt_mathix
// @match        http://myanimelist.net/*
// @exclude      http://myanimelist.net/animelist*
// @exclude      http://myanimelist.net/mangalist*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/18002/MyAnimeList%28MAL%29%20-%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/18002/MyAnimeList%28MAL%29%20-%20Filter.meta.js
// ==/UserScript==

init();

function init() {
    addSettingsDropdown();
    
    if ($('#contentWrapper > div:nth-child(1) a')[0] === undefined)
        addSettingsLink();
    
    if (getSetting('checkboxDisabled') === false)
        addCheckboxes();
    
    if (/http:\/\/myanimelist.net\/people\/\D*/.test(document.location.href))
        compactPeopleView();
    
    if (/http:\/\/myanimelist\.net\/(topanime|topmanga)\.php\??\D*/.test(document.location.href))
        setupTopTable(); // fixing some conflicts with coloring the table
    
    // create popup
    var popup = '<div id="gmPopupWrapper" style="display:none;"></div>' +
        '         <div id="gmPopupContainer" style="display: none;">' +
        '             <form>' +
        '                 <b><u>Script Settings:</u></b><br>' +
        '                 <input type="checkbox" class="checkbox" name="Option0" id="checkboxDisabled"' + (getSetting('checkboxDisabled') == true ? "checked" : "") + '> Hide <u>Checkboxes</u> on the pages itself <br><br>' +
        '                 <b><u>Default Options:</u></b><br>' +
        '                 <input type="checkbox" class="checkbox" name="Option1" id="Search"' + (getSetting('Search') == true ? "checked" : "") + '> Hide <u>Search Results</u> that you have on your list. <br><br>' +
        '                 <input type="checkbox" class="checkbox" name="Option2" id="Top"' + (getSetting('Top') == true ? "checked" : "") + '> Hide <u>Top Anime/Manga</u> that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option2" id="Top2"' + (getSetting('Top2') == true ? "checked" : "") + '> Hide <u>Top Anime/Manga</u> that you <b>don\'t</b> have on your list. <br><br>' +
        '                 <input type="checkbox" class="checkbox" name="Option3" id="Review"' + (getSetting('Review') == true ? "checked" : "") + '> Hide <u>Reviews</u> that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option3" id="Review2"' + (getSetting('Review2') == true ? "checked" : "") + '> Hide <u>Reviews</u> that you <b>don\'t</b> have on your list. <br><br>' +
        '                 <input type="checkbox" class="checkbox" name="Option4" id="Rec"' + (getSetting('Rec') == true ? "checked" : "") + '> Hide <u>Recommendations</u> that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option4" id="Rec2"' + (getSetting('Rec2') == true ? "checked" : "") + '> Hide <u>Recommendations</u> that you <b>don\'t</b> have on your list. <br><br>' +
        '                 <input type="checkbox" class="checkbox" name="Option5" id="VA"' + (getSetting('VA') == true ? "checked" : "") + '> Hide <u>Voice Actor</u> roles that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option5" id="VA2"' + (getSetting('VA2') == true ? "checked" : "") + '> Hide <u>Voice Actor</u> roles that you <b>don\'t</b> have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option6" id="AS"' + (getSetting('AS') == true ? "checked" : "") + '> Hide <u>Anime Staff</u> positions that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option6" id="AS2"' + (getSetting('AS2') == true ? "checked" : "") + '> Hide <u>Anime Staff</u> positions that you <b>don\'t</b> have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option7" id="PM"' + (getSetting('PM') == true ? "checked" : "") + '> Hide <u>Published Manga</u> that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option7" id="PM2"' + (getSetting('PM2') == true ? "checked" : "") + '> Hide <u>Published Manga</u> that you <b>don\'t</b> have on your list. <br><br>' +
        '                 <input type="checkbox" class="checkbox" name="Option8" id="ProVid"' + (getSetting('ProVid') == true ? "checked" : "") + '> Hide <u>Promotional Videos</u> that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option8" id="ProVid2"' + (getSetting('ProVid2') == true ? "checked" : "") + '> Hide <u>Promotional Videos</u> that you <b>don\'t</b> have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option9" id="Daisuki"' + (getSetting('Daisuki') == true ? "checked" : "") + '> Hide <u>Daisuki Videos</u> that you have on your list. <br>' +
        '                 <input type="checkbox" class="checkbox" name="Option9" id="Daisuki2"' + (getSetting('Daisuki2') == true ? "checked" : "") + '> Hide <u>Daisuki Videos</u> that you <b>don\'t</b> have on your list. <br><br>' +
        '                 <button id="gmSubmit" type="button">Submit</button>' +
        '                 <button id="gmClosePopup" type="button">Cancel</button>' +
        '             </form>' +
        '         </div>';

    // add popup to body
    $("body").append(popup);
    
    // load userscript for first time (arg = false)
    start(false);
}

// core of the script, filtering
function start(refresh) {
    // console.log(getSetting('Search'), getSetting('Rec'), getSetting('Rec2'), getSetting('VA'), getSetting('VA2'), getSetting('AS'), getSetting('AS2'));
    
    if ($('#advancedsearch')[0] !== undefined) {
        activateSearchFilter(getSetting('Search'));
    }
    
    if (/http:\/\/myanimelist\.net\/(anime|manga)\/\d+\/\D*/.test(document.location.href)) { // Recommendations
        var value = addOrEdit(getSetting('Rec'), getSetting('Rec2'));
        if (value != null) {
            activateRecFilter(value[0], value[1]);
            activateRecFilter(false, value[2]);
        } else if (refresh) {
            activateRecFilter(false, "add");
            activateRecFilter(false, "edit");
        }
    } else if (/http:\/\/myanimelist\.net\/(topanime|topmanga)\.php\??\D*/.test(document.location.href)) { // Top Anime/Manga
        var value = addOrEdit(getSetting('Top'), getSetting('Top2'));
        if (value != null) {
            activateTopFilter(value[0], value[1]);
            activateTopFilter(false, value[2]);
        } else if (refresh) {
            activateTopFilter(false, "add");
            activateTopFilter(false, "edit");
        }
    } else if (/http:\/\/myanimelist.net\/people\/\D*/.test(document.location.href)) { // Voice actors, anime staff and published manga
        var value1 = addOrEdit(getSetting('VA'), getSetting('VA2'));
        if (value1 != null) {
            activateVAFilter(value1[0], value1[1]);
            activateVAFilter(false, value1[2]);
        } else if (refresh) {
            activateVAFilter(false, "add");
            activateVAFilter(false, "edit");
        }
        
        var value2 = addOrEdit(getSetting('AS'), getSetting('AS2'));
        if (value2 != null) {
            activateASFilter(value2[0], value2[1]);
            activateASFilter(false, value2[2]);
        } else if (refresh) {
            activateASFilter(false, "add");
            activateASFilter(false, "edit");
        }
        
        var value3 = addOrEdit(getSetting('PM'), getSetting('PM2'));
        if (value3 != null) {
            activatePMFilter(value3[0], value3[1]);
            activatePMFilter(false, value3[2]);
        } else if (refresh) {
            activatePMFilter(false, "add");
            activatePMFilter(false, "edit");
        }
    } else if (/(?!\D*mosthelpful)http:\/\/myanimelist\.net\/reviews\.php\??\D*/.test(document.location.href)) { // reviews
        var value = addOrEdit(getSetting('Review'), getSetting('Review2'));
        if (value != null) {
            activateReviewFilter(value[0], value[1]);
            activateReviewFilter(false, value[2]);
        } else if (refresh) {
            activateReviewFilter(false, "add");
            activateReviewFilter(false, "edit");
        }
    } else if (/(?!\D*daisuki)http:\/\/myanimelist\.net\/watch\D*/.test(document.location.href)) { // promotional videos
        var value = addOrEdit(getSetting('ProVid'), getSetting('ProVid2'));
        if (value != null) {
            activateProVidFilter(value[0], value[1]);
            activateProVidFilter(false, value[2]);
        } else if (refresh) {
            activateProVidFilter(false, "add");
            activateProVidFilter(false, "edit");
        }
    } else if (/http:\/\/myanimelist\.net\/watch\/daisuki/.test(document.location.href)) { // daisuki
        var value = addOrEdit(getSetting('Daisuki'), getSetting('Daisuki2'));
        if (value != null) {
            activateDaisukiFilter(value[0], value[1]);
            activateDaisukiFilter(false, value[2]);
        } else if (refresh) {
            activateDaisukiFilter(false, "add");
            activateDaisukiFilter(false, "edit");
        }
    }
}

// do I have to filter the 'add' or 'edit' entries
function addOrEdit(edit, add) {
    if (edit) {
        return [edit, "edit", "add"]
    } else if (add) {
        return [add, "add", "edit"]
    } else {
        return null
    }
}

// Search filter (Search results, genres, producers and magazines)
function activateSearchFilter(condition) {
    var allElements = document.evaluate(
        "//a[contains(@class,'Lightbox_AddEdit button_edit')]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            if (EditLink.parentNode.parentNode.parentNode.className == "seasonal-anime js-seasonal-anime")
                EditLink.parentNode.parentNode.parentNode.style.display="none";
            else
                EditLink.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            if (EditLink.parentNode.parentNode.parentNode.className == "seasonal-anime js-seasonal-anime")
                EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
            else
                EditLink.parentNode.parentNode.removeAttribute('style');
        }
    }
}

// Recommendations filter
function activateRecFilter(condition, type) {
    var allElements = document.evaluate(
        "//a[@class='Lightbox_AddEdit button_" + type + " ']",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeAttribute('style');
        }
    }
}

function activateReviewFilter(condition, type) {
    var allElements = document.evaluate(
        "//a[@class='Lightbox_AddEdit button_" + type + " ']",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.removeAttribute('style');
        }
    }
}

// Top anime/manga filter
function activateTopFilter(condition, type) {
    var allElements = document.evaluate(
        "//a[contains(@class,'Lightbox_AddEdit') and contains(@class,'button_" + type + "')]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.removeAttribute('style');
        }
        recolorTopTable();
    }
}

function setupTopTable() {
    var tableRows = document.getElementsByClassName('ranking-list');
    var ranks = document.getElementsByClassName('rank ac');
    
    for (var i = 0; i < tableRows.length; i++)
        tableRows[i].className = "";
    
    for (var j = 0; j < ranks.length; j++)
        ranks[j].style.cssText = 'text-align:center;vertical-align:middle;';
}

// recolor all remaining elements in the table: type will be 'edit' or 'add'
function recolorTopTable() {
    var allRemainingElements = document.evaluate(
        "//a[contains(@class,'Lightbox_AddEdit btn-addEdit-large') and not(ancestor::tr[contains(@style,'display: none')])]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    // recolor table
    for (var i = 0; i < allRemainingElements.snapshotLength; i++){
        var EditLink = allRemainingElements.snapshotItem(i);
        EditLink.parentNode.parentNode.className = "";
        if ((i % 2) == 1)
            EditLink.parentNode.parentNode.style.cssText = 'background-color:#F6F6F6';
        else
            EditLink.parentNode.parentNode.style.cssText = 'background-color:#FFFFFF';
    }
}

// Voice Actor roles filter
function activateVAFilter(condition, type) {
    var allElements = document.evaluate(
        "//td[@style='padding-left: 5px;']//table[@class='VATable']//a[@class='Lightbox_AddEdit button_" + type + " ']",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
        }
    }
}

// Anime Staff positions filter
function activateASFilter(condition, type) {
    var allElements = document.evaluate(
        "//td[@style='padding-left: 5px;']//table[@class='ASTable']//a[@class='Lightbox_AddEdit button_" + type + " ']",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
        }
    }
}

// Published Manga filter
function activatePMFilter(condition, type) {
    var allElements = document.evaluate(
        "//td[@style='padding-left: 5px;']//table[@class='PMTable']//a[@class='Lightbox_AddEdit button_" + type + " ']",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
        }
    }
}

function compactPeopleView() {
    return false;
}

function activateProVidFilter(condition, type) {
    var allElements = document.evaluate(
        "//a[contains(@class,'Lightbox_AddEdit button_" + type + "')]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            console.log(EditLink.parentNode.parentNode);
            EditLink.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.removeAttribute('style');
        }
    }
}

function activateDaisukiFilter(condition, type) {
    var allElements = document.evaluate(
        "//a[contains(@class,'Lightbox_AddEdit button_" + type + "')]",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    
    if (condition) {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.style.display="none";
        }
    } else {
        for (var i = 0; i < allElements.snapshotLength; i++){
            var EditLink = allElements.snapshotItem(i);
            EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
        }
    }
}

function addSettingsDropdown() {
    var settingsEl = document.createElement("li");
    var settingsHTML = '<a href="javascript:void(0);"><i class="fa fa-cog mr4"></i>Filter Settings</a>';
    settingsEl.innerHTML = settingsHTML;
    
    $(settingsEl).find('a').click(function() {
        $("#gmPopupWrapper").show();
        $("#gmPopupContainer").show();
    });

    $(settingsEl).insertAfter($('#header-menu > div.header-menu-unit.header-profile.js-header-menu-unit.link-bg.pl8.pr8 > div > ul > li:nth-child(7)'));
}

function addSettingsLink() {
    $('#contentWrapper > div:nth-child(1) > span').hide();
    
    var settingsEl = document.createElement("a");
    var settingsHTML = '<a class="header-right" href="javascript:void(0);"><i class="fa fa-cog mr4"></i>Filter Settings</a>';
    
    $(settingsEl).insertBefore($('#contentWrapper > div:nth-child(1) > h1'));
    
    settingsEl.outerHTML = settingsHTML;
    
    $('#contentWrapper > div:nth-child(1) > a').click(function() {
        $("#gmPopupWrapper").show();
        $("#gmPopupContainer").show();
    });
}

function addCheckboxes() {
    // checkboxes for search results, genres, productions and magazines
    if ($('#advancedsearch')[0] !== undefined) {
        var elements = document.getElementsByClassName('normal_header clearfix');
        if (elements[0] !== undefined) {
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "Search";
            checkbox.id = "edit";
            checkbox.checked = getSetting("Search");
            elements[0].appendChild(checkbox);
        }
    }
    
    if (/http:\/\/myanimelist\.net\/(anime|manga)\/\d+\/\D*/.test(document.location.href)) { // recommendations
        var elements = document.getElementsByTagName('h2');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].textContent.indexOf("Recommendations") > -1) {
                createCheckboxes("Rec", elements[i]);
            }
        }
    } else if (/http:\/\/myanimelist\.net\/(topanime|topmanga)\.php\??\D*/.test(document.location.href)) { // top anime/manga
        var elements = document.getElementsByClassName('top-rank-header2');
        createCheckboxes("Top", elements[0]);
    } else if (/http:\/\/myanimelist.net\/people\/\D*/.test(document.location.href)) { // people
        var elements = document.getElementsByClassName('normal_header');
        if (elements[0].nextSibling.tagName == "TABLE") {
            elements[0].nextSibling.className = "VATable";
            createCheckboxes("VA", elements[0]);
        }
        if (elements[1].nextSibling.tagName == "TABLE") {
            elements[1].nextSibling.className = "ASTable";
            createCheckboxes("AS", elements[1]);
        }
        if (elements[2].nextSibling.tagName == "TABLE") {
            elements[2].nextSibling.className = "PMTable";
            createCheckboxes("PM", elements[2]);
        }
    } else if (/(?!\D*mosthelpful)http:\/\/myanimelist\.net\/reviews\.php\??\D*/.test(document.location.href)) { // reviews
        var elements = document.getElementsByClassName('h1');
        createCheckboxes("Review", elements[0]);
    } else if (/(?!\D*daisuki)http:\/\/myanimelist\.net\/watch\D*/.test(document.location.href)) { // promotional videos
        var elements = document.getElementsByClassName('h1');
        createCheckboxes("ProVid", elements[0]);
    } else if (/http:\/\/myanimelist\.net\/watch\/daisuki/.test(document.location.href)) { // daisuki
        var elements = document.getElementsByClassName('h1');
        createCheckboxes("Daisuki", elements[0]);
    }
}

// create html for checkboxes and append them to the header
function createCheckboxes(type, element) {
    var checkbox1 = document.createElement('input');
    var checkbox2 = document.createElement('input');
    checkbox1.type = "checkbox";
    checkbox2.type = "checkbox";
    checkbox1.name = type;
    checkbox2.name = type;
    checkbox1.id = "edit";
    checkbox2.id = "add";
    checkbox1.checked = getSetting(type);
    checkbox2.checked = getSetting(type + "2");
    element.appendChild(checkbox1);
    element.appendChild(checkbox2);
}

// Save a setting of type = value (true or false)
function saveSetting(type, value) {
    GM_setValue('MALFILTER_' + type, value);
}

// Get a setting of type
function getSetting(type) {
    value = GM_getValue('MALFILTER_' + type);
    if (value)
        return value;
    else
        return false;
}

//--------------------------------//
//         Popup Functions        //
//--------------------------------//

$("#gmSubmit").click ( function () {
    $("#gmPopupContainer").hide();
    $("#gmPopupWrapper").hide();
    var category = document.getElementsByClassName("checkbox");
    for(i=0;i<category.length;i++){
        saveSetting(category[i].id, category[i].checked);
    }
    start(true);
});

$("#gmClosePopup").click ( function () {
    $("#gmPopupContainer").hide();
    $("#gmPopupWrapper").hide();
});

$("input:checkbox").on('click', function() {
    var $box = $(this);
    if ($box.is(":checked")) {
        var group = "input:checkbox[name='" + $box.attr("name") + "']";
        $(group).prop("checked", false);
        $box.prop("checked", true);
    } else {
        $box.prop("checked", false);
    }
    
    // only activate for checkboxes inside the page
    if ($box[0].name == "Search") {
        activateSearchFilter($box.is(":checked"));
    } else if ($box[0].name.indexOf('Option') == -1) {
        eval('activate' + $box[0].name + 'Filter' + '(' + $box.is(":checked") + ',"' + $box[0].id + '")');
        eval('activate' + $box[0].name + 'Filter' + '(' + false + ',"' + ($box[0].id == "add" ? "edit" : "add") + '")');
    }
});

GM_addStyle ( " #gmPopupContainer {" +
              "position:               fixed;"+
              "width:                  380px;"+
              "height:                 490px;"+
              "margin-left:            -190px;"+
              "margin-top:             -300px;"+
              "top:                    50%;"+
              "left:                   50%;"+
              "padding:                20px;"+
              "background:             white;"+
              "border:                 3px solid #2e51a2;"+
              "z-index:                9999;"+
              "text-align:             left;"+
              "box-shadow:             0 0 15px rgba(32, 32, 32, 0.4);"+
          "}"+
          "#gmPopupContainer button {"+
              "cursor:                 pointer;"+
              "margin:                 1em 1em 0;"+
              "border:                 1px outset buttonface;"+
          "}"+
          "#gmPopupWrapper {"+
              "position:               fixed;"+
              "width:                  100%;"+
              "height:                 100%;"+
              "top:                    0;"+
              "left:                   0;"+
              "background:             rgba(102, 102, 102, 0.3);"+
              "z-index:                9990;"+
          "}" );