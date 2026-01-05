// ==UserScript==
// @name            E(X)Hentai Helper
// @description     Links between E-Hentai and ExHentai page, and also links user to ExHentai automatically if gallery is "removed" and adds "view later" function
// @namespace       https://greasyfork.org/en/scripts/24342-e-hentai-exhentai
// @version         4.05
// @icon            https://e-hentai.org/favicon.ico
// @resource        exCSS  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css
// @resource        jqueryui https://code.jquery.com/ui/1.12.0/jquery-ui.min.js

// @include         https://upload.e-hentai.org/*
// @include         http*://e-hentai.org/*
// @include         http*://exhentai.org/*

// @exclude         https://e-hentai.org/archive*
// @exclude         https://e-hentai.org/gallery*
// @exclude         https://exhentai.org/archive*
// @exclude         https://exhentai.org/gallery*

// @require         https://code.jquery.com/jquery-3.1.1.min.js
// @require         https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require         https://cdn.jsdelivr.net/npm/datatables.net@1.10.16/js/jquery.dataTables.js
// @require         https://greasyfork.org/scripts/27104-filesaver/code/FileSaver.js?version=173518
// @author          Resuha
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/27342/E%28X%29Hentai%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/27342/E%28X%29Hentai%20Helper.meta.js
// ==/UserScript==

//Credit to developer of https://github.com/js-cookie/js-cookie

//Ver 4.00 changed "view/read later" layout
//Ver 3.00 added "view/read later" functionality
//Ver 2.00 added redirector and cookie remover

var targetWebsite = "";
var theme = "";
var readLaterList = [];
var lastHovered;
var currentPageLink = window.location.href;
var dataTable;

var cssTxt = GM_getResourceText("exCSS");
GM_addStyle(cssTxt);
var jqueryui = GM_getResourceText("jqueryui");
GM_addStyle(jqueryui);

var extraCSS = document.createElement("style");
extraCSS.textContent = `
.link, .option {
    cursor: pointer;
    text-decoration: underline;
}

.option, #placeholderText{font-size: 125%}

.readLaterItem{font-size: 125%}

.readLaterItem > .option{font-size: 100%}

.divHeader{
    font-size: 160%;
    font-weight: bold;
}

#fixedDiv.dark, #readLaterDiv.dark,#successDiv.dark,#previewDiv.dark,#addDiv.dark{
    background-color:rgba(64, 64, 0, 1);
    border: 1px solid rgba(255, 255, 0, 1);
}
.link.dark{color:yellow}
.option.dark{color:plum}
#mpvAddon.dark{background-color:rgba(64, 64, 0, 0.4)}

#fixedDiv.light, #readLaterDiv.light,#successDiv.light,#previewDiv.light,#addDiv.light{
    background-color:rgba(255, 255, 0, 1);
    border: 1px solid rgba(64, 64, 0, 1);
}
.link.light{color:blue}
.option.light{color:Red}
#mpvAddon.light{background-color:rgba(255, 255, 0, 0.4)}

#successDiv{
    font-size: 125%;
    position: absolute;
    transform: translate(-100%, -50%);
    z-index:10;
    padding: 8px 8px;
}

#linker{font-size: 160%}

#fixedDiv{
    text-align: left !important;
    position: fixed;
    top: 12px;
    right: 12px;
    align: left;
    padding: 8px 8px;
    z-index:10;
}

#fixedDivPeek{
    text-align: left !important;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 10px;
    height: 10px;
    background-color:rgba(255, 255, 0, 1);
    align: left;
    padding: 8px 8px;
    z-index:10;
}

#readLaterDiv{
    text-align: left !important;
    position:fixed;
    bottom: 4%;left: 2%;
    align: left;
    z-index:10;
    padding: 8px 8px;
}

#i1 > #mpvAddon{
    float:right;
    padding:0px 10px 10px 10px;
    cursor: pointer;
}

#optionDivUL, #readLaterOptionDivUL{
    margin: 0; 
    padding: 0px 0px 0px 20px;
}

.topRightDivButton{
    float:right;
    cursor: pointer;
    padding: 0px 4px 2px 3px;
    border: 1px solid;
    font-size: 80%;
}

#previewDiv{
    position:fixed;
    z-index:10;
    padding:4px;
}

#previewDiv.showLeft{transform: translate(-110%, -105%)}

#previewDiv.showRight{transform: translate(10%, -105%)}

#addDiv{
    position:absolute;
    z-index:10;
    padding:4px;
    font-size:125%;
    cursor: pointer;
}

.readLaterItem.hoverPopup.odd.light{background:rgba(240, 240, 0, 1)}
.readLaterItem.hoverPopup.odd.dark{background:rgba(48, 48, 0, 1)}

#readLaterTable.light{border:2px rgba(64, 64, 0, 1) solid}
#readLaterTable.dark{border:2px rgba(255, 255, 0, 1) solid}

.highlighted{font-weight: bold !important;}
.highlighted.light{color: red}
.highlighted.dark{color: lightblue}
`;
document.head.appendChild(extraCSS);

var fixedDiv = `'
<div id="fixedDiv">
  <div class="divHeader"><label id="scriptTitleHeader">E(X)Hentai Helper v`+ GM_info.script.version + `</label><label class="topRightDivButton" id="minmaxFixedDivButton">–</label></div><BR>
  <div id="linkerDiv">
    <label class="divHeader">Linker:</label>
  </div>
  <div id="readLaterOptionDiv"><BR>
    <label class="divHeader">Read Later:</label><BR><ul id="readLaterOptionDivUL"></ul>
  </div>
  <div id="optionDiv"><BR>
    <label class="divHeader">Option:</label><BR><ul id="optionDivUL"></ul>
  </div>
</div>'`;
$('body').append(fixedDiv);
fixedDiv = $('#fixedDiv');
linkerDiv = $('#linkerDiv');
optionDiv = $('#optionDiv');
optionDiv.hide();
document.getElementById('minmaxFixedDivButton').addEventListener("click", function () {
    if ($('#scriptTitleHeader').is(":visible")) {
        hideFixedDivContent();
    } else {
        showFixedDivContent();
    }
});

var readLaterDiv = `'
<div id="readLaterDiv" style="width:96%">
  <div class="divHeader"><label id="rlDivHeader">Read Later List:</label><label class="topRightDivButton" id="closeReadLaterButton">✖</label></div>
  <div id="readLaterTableWrapper"></div>
</div>'`;
$('body').append(readLaterDiv);
document.getElementById('closeReadLaterButton').addEventListener("click", function () {
    hide_rlList();
});
readLaterDiv = $('#readLaterDiv');
readLaterDiv.hide();

var previewDiv = `'
<div id="previewDiv">
  <img id="previewImg" src=""></img><label id="placeholderText"></label>
</div>'`;
$('body').append(previewDiv);
document.getElementById('closeReadLaterButton').addEventListener("click", function () {
    hide_rlList();
});
previewDiv = $('#previewDiv');
previewDiv.hide();

var addDiv = '<div id="addDiv"><label id="addDivLabel">Add to "view later" list</label></div>';
$('body').append(addDiv);
addDiv = $('#addDiv');
addDiv.hide();
$("#addDiv").click(function () {
    var title = lastHovered.getElementsByClassName("id2")[0].childNodes[0].innerHTML;
    var link = parse_gallery_identifier(lastHovered.getElementsByClassName("id2")[0].childNodes[0].href);
    var thumbnailLink = lastHovered.getElementsByClassName("id3")[0].childNodes[0].childNodes[0].src.replace("exhentai.org", "ehgt.org");
    if (thumbnailLink.indexOf("blank.gif") > -1) { //if there is no thumbnail, do AJAX call
        $(document).ajaxComplete(function (event, xhr, settings) {
            var data = xhr.responseText;
            var divStyle = $("#gd1", data).children('div').attr("style").split(" ");
            if (divStyle[3].startsWith("url")) {
                thumbnailLink = divStyle[3].substring(divStyle[3].indexOf("(") + 1, divStyle[3].indexOf(")"));
            } else {
                for (i = 0; i < stuff.length; i++) {
                    if (divStyle[i].startsWith("url")) {
                        thumbnailLink = divStyle[i].substring(divStyle[i].indexOf("(") + 1, divStyle[i].indexOf(")"));
                        break;
                    }
                }
            }
            thumbnailLink = thumbnailLink.replace("exhentai.org", "ehgt.org");
            add_rlEntry(title, link, thumbnailLink);
            populate_rlDiv();
        });
        $.ajax(link);
    } else {
        add_rlEntry(title, link, thumbnailLink);
        populate_rlDiv();
    }
});

if (document.location.href.indexOf('exhentai') !== - 1) {
    link = 'https://e-hentai.org' + parse_gallery_identifier();
    targetWebsite = 'E-Hentai';
    theme = "dark";
} else {
    link = 'https://exhentai.org' + parse_gallery_identifier();
    targetWebsite = 'ExHentai';
    theme = "light";
} // Determine if the current page is E-Hentai or ExHentai

readLaterDiv.resizable({
    handles: "n,e,ne",
    stop: function (event, ui) {
        $('th')[0].click();
    }
});

fixedDiv.addClass("light");
readLaterDiv.addClass("light");
previewDiv.addClass("light");
addDiv.addClass("light");
$('#readLaterTable').addClass("light");
redoTheme();
window.addEventListener('focus', populate_rlDiv);

$(document).ready(function () {
    populate_rlDiv();
    if (document.title == 'Gallery Not Available - E-Hentai Galleries') { // Gallery is expunged in e-hentai
        document.location.href = 'https://exhentai.org' + parse_gallery_identifier();
    } else if (document.title == "exhentai.org (260×260)") { // Got sadpanda
        var bYes = '<button id="yesButton" class="askButton">Yes';
        var bNo = '<button id="noButton" class="askButton">No';
        var askConfirm = '<div id="confirmDiv">Are you currently logged in at e-hentai.org forum?<label id="message"><br>' + bYes + bNo + '</div>';
        $('body').append(askConfirm);
        askConfirm = $('#confirmDiv');
        askConfirm.css({
            'align': 'center',
            'color': 'blue',
        });
        $('#yesButton').click(function () { // Clear cookie and refresh
            $('#confirmDiv').text("This page will refresh. If you still see this page after the refresh, it is possible that your account is not old enough for exhentai");
            setTimeout(function () {
                // delete cookie
                Cookies.remove('yay', { domain: '.exhentai.org' });
                location.reload();
            }, 1000);
        });
        $('#noButton').click(function () { // Redirect to forum
            $('#confirmDiv').text("Redirecting to E-Hentai login page");
            setTimeout(function () {
                document.location.href = 'https://forums.e-hentai.org/index.php?act=Login&CODE=00';
            }, 1000);
        });
    } else {
        if (currentPageLink.indexOf("/mpv/") === -1) {
            $(".id1").hover(function () {
                lastHovered = this;
                var location = getOffset(this.getElementsByClassName("id3")[0]);
                addDiv.show();
                addDiv.css({
                    "top": location.top + "px",
                    "left": location.left + "px",
                });
                if (getIndex_rlList(parse_gallery_identifier(lastHovered.getElementsByClassName("id3")[0].childNodes[0].href)).exactMatch) {
                    $("#addDivLabel").text('Already added to list');
                }
            }, function () {
                addDiv.hide();
                $("#addDivLabel").text('Add to "view later" list');
            });

            addDiv.hover(function () {
                addDiv.show();
                if (getIndex_rlList(parse_gallery_identifier(lastHovered.getElementsByClassName("id3")[0].childNodes[0].href)).exactMatch) {
                    $("#addDivLabel").text('Already added to list');
                } else {
                    $("#addDiv").css("color", "red");
                }
            }, function () {
                $("#addDiv").hide();
                $("#addDiv").css("color", "");
            });

            var link;
            var linker;

            if (targetWebsite == 'ExHentai') {
                if (document.location.href == 'https://upload.e-hentai.org/manage.php') {
                    linker = "https://exhentai.org/upload/manage.php";
                } else {
                    linker = "https://exhentai.org" + parse_gallery_identifier();
                }
                linkerDiv.append(createLink("linker", linker, "To ExHentai"));
            } else {
                if (document.location.href == 'https://exhentai.org/upload/manage.php') {
                    linker = "https://upload.e-hentai.org/manage.php";
                } else {
                    linker = "https://e-hentai.org" + parse_gallery_identifier();
                }
                linkerDiv.append(createLink("linker", linker, "To E-Hentai"));
            } // Add option to switch between E-Hentai and ExHentai in the top bar of the page

            document.getElementById('linker').addEventListener("click", function () {
                document.location.href = linker;
            });

            // Setting page
            if (currentPageLink.indexOf("uconfig") > -1) {
                optionDiv.show();
                var optionArray = [];
                optionArray.push(createOptionWithClass("loadSettingOption", "Load saved user setting", "setting"));
                optionArray.push(createOptionWithClass("saveSettingOption", "Save current user setting", "setting"));

                for (i = 0; i < optionArray.length; i++) {
                    $('#optionDivUL').append(optionArray[i]);
                }

                document.getElementById('loadSettingOption').addEventListener("click", function () {
                    var setting = GM_getValue("userSetting", "");
                    if (setting !== "") {
                        if (document.location.href.indexOf('exhentai') !== - 1) {
                            Cookies.set("uconfig", setting, { domain: ".exhentai.org", expires: 365 });
                        } else {
                            Cookies.set("uconfig", setting, { domain: ".e-hentai.org", expires: 365 });
                        }
                        alert("User setting loaded");
                        location.reload();
                    } else {
                        alert("Nothing to load");
                    }
                });
                document.getElementById('saveSettingOption').addEventListener("click", function () {
                    GM_setValue("userSetting", Cookies.get("uconfig"));
                    // Maybe have an option to save it to file
                    alert("User setting saved");
                });
            }

            // Gallery page
            if (currentPageLink.indexOf("/g/") > -1 || currentPageLink.indexOf("/s/") > -1) {
                var indexMatch = getIndex_rlList(parse_gallery_identifier());
                if (indexMatch.exactMatch === true && readLaterList[indexMatch.index].thumbnailLink !== "undefined") {
                    $('#readLaterOptionDivUL').append(createOption("addReadLaterOption", 'Already in "view later" list'));
                    $('#addReadLaterOption').css({
                        'text-decoration': 'none',
                        'cursor': 'default',
                    });
                } else {
                    $('#readLaterOptionDivUL').append(createOption("addReadLaterOption", 'Add to "view later" list'));
                    document.getElementById('addReadLaterOption').addEventListener("click", add_rlEntryFunction);
                }
                if (indexMatch.index > -1) {
                    $('#readLaterOptionDivUL').append(createOption("removeReadLaterOption", 'Remove from "view later" list'));
                    document.getElementById('removeReadLaterOption').addEventListener("click", remove_rlEntryFunction);
                }

                if (currentPageLink.indexOf("/s/") > -1) {
                    var successDiv;
                    if (targetWebsite === "E-Hentai") {
                        $('#i1').prepend('<div id="mpvAddon" class="dark"></div>');
                        $('#mpvAddon').append('<img id="mpvSave_rl" src="http://i.imgur.com/rdXO8o2.png" title="Save this page to view later list (E<->Ex extension)" style="margin-top:10px; opacity:0.8">');
                        $('#mpvAddon').append('<img id="mpvView_rl" src="http://i.imgur.com/ywCl5NP.png" title="Open view later list (E<->Ex extension)" style="margin-top:5px; opacity:0.8">');
                        successDiv = '<div id="successDiv" class="dark">Added/updated "view later" list</div>';
                    } else {
                        $('#i1').prepend('<div id="mpvAddon" class="light"></div>');
                        $('#mpvAddon').append('<img id="mpvSave_rl" src="http://i.imgur.com/tWBUjde.png" title="Save this page to view later list (E<->Ex extension)" style="margin-top:10px; opacity:0.8">');
                        $('#mpvAddon').append('<img id="mpvView_rl" src="http://i.imgur.com/XH8qCCi.png" title="Open view later list (E<->Ex extension)" style="margin-top:5px; opacity:0.8">');
                        successDiv = '<div id="successDiv" class="light">Added/updated "view later" list</div>';
                    }
                    $('body').append(successDiv);
                    successDiv = $('#successDiv');
                    successDiv.hide();

                    document.getElementById('mpvSave_rl').addEventListener("click", add_rlEntryFunction);
                    document.getElementById('mpvView_rl').addEventListener("click", view_rlButtonClick);
                    hideFixedDivContent();

                    var oldLocation = location.href;
                    setInterval(function () {
                        if (location.href !== oldLocation) {
                            oldLocation = location.href;
                            $('#addReadLaterOption').text('Add to "view later" list');
                            document.getElementById('addReadLaterOption').addEventListener("click", add_rlEntryFunction);
                            $('#addReadLaterOption').css({
                                'text-decoration': 'underline',
                                'cursor': 'pointer',
                            });
                        }
                    }, 2000); // check 2 seconds
                }
            }

            $('#readLaterOptionDivUL').append(createOption("seeReadLaterListOption", 'Show "view later" list'));
            document.getElementById('seeReadLaterListOption').addEventListener("click", view_rlButtonClick);

            // If there is no option available, hide the optionDiv completely
            if ($('.setting').length === 0) {
                optionDiv.hide();
            }

            $('#readLaterOptionDivUL').append(createOption("export_rlListOption", 'Export list'));
            document.getElementById('export_rlListOption').addEventListener("click", exportFunction);

            $('#readLaterOptionDivUL').append(createOption("import_rlListOption", 'Import list'));
            document.getElementById('import_rlListOption').addEventListener("click", importFunction);

            $('#readLaterOptionDivUL').append(createOption("reset_rlListOption", 'Empty the list'));
            document.getElementById('reset_rlListOption').addEventListener("click", resetList);
        } else {
            var successDiv;
            if (targetWebsite === "E-Hentai") {
                $('#bar3').append('<div id="mpvAddon" class="dark"></div>');
                $('#mpvAddon').append('<img id="mpvSave_rl" src="http://i.imgur.com/rdXO8o2.png" title="Save this page to view later list (E<->Ex extension)" style="margin-top:10px; opacity:0.8">');
                $('#mpvAddon').append('<img id="mpvView_rl" src="http://i.imgur.com/ywCl5NP.png" title="Open view later list (E<->Ex extension)" style="margin-top:5px; opacity:0.8">');
                successDiv = '<div id="successDiv" class="dark">Added/updated "view later" list</div>';
            } else {
                $('#bar3').append('<div id="mpvAddon" class="light"></div>');
                $('#mpvAddon').append('<img id="mpvSave_rl" src="http://i.imgur.com/tWBUjde.png" title="Save this page to view later list (E<->Ex extension)" style="margin-top:10px; opacity:0.8">');
                $('#mpvAddon').append('<img id="mpvView_rl" src="http://i.imgur.com/XH8qCCi.png" title="Open view later list (E<->Ex extension)" style="margin-top:5px; opacity:0.8">');
                successDiv = '<div id="successDiv" class="light">Added/updated "view later" list</div>';
            }
            $('body').append(successDiv);
            successDiv = $('#successDiv');
            successDiv.hide();
            document.getElementById('mpvSave_rl').addEventListener("click", add_rlButtonClick);
            document.getElementById('mpvView_rl').addEventListener("click", view_rlButtonClick);
            $('#fixedDiv').hide();
        }
        redoTheme();
    }
});

function resetList() {
    if (confirm("Are you sure you want to empty the list? You cannot undo this unless you export it first.")) {
        GM_setValue("readLater", "");
    }
}

function add_rlButtonClick() { //for MPV
    var pos = getOffset(this);
    $('#successDiv').css({
        'top': pos.top + 12,
        'left': pos.left - 12,
    });
    var currentPageNum = 0;
    var currentScrollLocation = $('#pane_images').scrollTop();
    var allImgDiv = $('#pane_images_inner').children('div');
    for (i = 0; i < allImgDiv.length; i++) {
        currentScrollLocation -= allImgDiv[i].offsetHeight;
        currentPageNum++;
        if (currentScrollLocation <= 0) {
            break;
        }
    }
    var lastPage = document.getElementById("pane_thumbs_inner").childElementCount;
    var title = document.title.substring(0, document.title.lastIndexOf(" - ")) + " {" + currentPageNum + "/" + lastPage + "}";
    var link = parse_gallery_identifier();
    link = link.substring(0, link.lastIndexOf("/")) + "/#page" + currentPageNum;

    var mainPage_URL = window.location.href.substring(0, window.location.href.lastIndexOf("/")).replace("mpv", "g");
    var thumbnailLink;

    $(document).ajaxComplete(function (event, xhr, settings) {
        var data = xhr.responseText;
        var divStyle = $("#gd1", data).children('div').attr("style").split(" ");
        if (divStyle[3].startsWith("url")) {
            thumbnailLink = divStyle[3].substring(divStyle[3].indexOf("(") + 1, divStyle[3].indexOf(")"));
        } else {
            for (i = 0; i < stuff.length; i++) {
                if (divStyle[i].startsWith("url")) {
                    thumbnailLink = divStyle[i].substring(divStyle[i].indexOf("(") + 1, divStyle[i].indexOf(")"));
                    break;
                }
            }
        }
        thumbnailLink = thumbnailLink.replace("exhentai.org", "ehgt.org");
        add_rlEntry(title, link, thumbnailLink);
        populate_rlDiv();
        $('#successDiv').fadeIn();
        setTimeout(function () {
            $('#successDiv').fadeOut();
        }, 2000);
    });
    $.ajax(mainPage_URL);
}

function exportFunction() {
    var str = rlArrayToString(readLaterList);
    var filename = "eh_view_later_list";
    var blob = new Blob([str], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename + ".txt");
}

function importFunction() {
    var input = document.createElement('input');
    $(input).attr("type", "file");
    input.addEventListener("change", function readSingleFile(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            GM_setValue("readLater", contents);
            populate_rlDiv();
            var successDiv;
            successDiv = '<div id="successDiv" class="light">List successfully loaded</div>';
            $('body').append(successDiv);
            successDiv = $('#successDiv');
            successDiv.hide();
            $('#successDiv').css({
                'top': 1 + 12,
                'left': 1 - 12,
            });
            $('#successDiv').fadeIn();
            setTimeout(function () {
                $('#successDiv').fadeOut();
            }, 2000);
        };
        reader.readAsText(file);
    }, false);
    $(input).trigger('click');
}

function view_rlButtonClick() {
    if ($('#readLaterDiv').is(":visible")) {
        hide_rlList();
    } else {
        show_rlList();
        populate_rlDiv();
    }
}

function getGalleryID(pageHref) {
    var splitHref = pageHref.split("/");
    if (pageHref.indexOf("/g/") > -1 || pageHref.indexOf("/mpv/") > -1) {
        return splitHref[2];
    } else {
        return splitHref[3].substring(0, splitHref[3].indexOf("-"));
    }
}

function populate_rlDiv() {
    readLaterList = load_rlList();
    console.log($('#readLaterDiv').is(':visible'));
    console.log($('.readLaterItem').length, readLaterList.length);
    if ($('#readLaterDiv').is(':visible') && ($('.readLaterItem').length === 0 || $('.readLaterItem').length !== readLaterList.length)) {
        $("#readLaterTable_wrapper").remove(); // remove existing ones and repopulate the list
        $('#readLaterTableWrapper').append(
            `<table id="readLaterTable" class="display" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Delete</th>
                        <th>EH Link</th>
                        <th>EX Link</th>
                        <th>Title</th>
                        <th>Circle</th>
                        <th>Artist</th>
                        <th>Event</th>
                    </tr>
                </thead>
                <tbody id="readLaterTableBody">
                </tbody>
            </table>`
        );
        $("#rlDivHeader").text("Read Later List: (" + readLaterList.length + " items)");
        for (i = 0; i < readLaterList.length; i++) {
            var entryDOM = '<tr class="readLaterItem hoverPopup light" id="item' + i + '">';
            if (readLaterList[i] !== null) {
                entryDOM += '<td class="readLaterRemoveItem option light">Remove</td>';
                entryDOM += '<td>' + createLink("", "https://e-hentai.org" + readLaterList[i].link, "Read") + '</td>';
                entryDOM += '<td>' + createLink("", "https://exhentai.org" + readLaterList[i].link, "Read") + '</td>';
                entryDOM += '<td>' + readLaterList[i].title + '</td>';
                entryDOM += '<td>' + readLaterList[i].group + '</td>';
                entryDOM += '<td>' + readLaterList[i].artist + '</td>';
                entryDOM += '<td>' + readLaterList[i].eventName + '</td>';
            }
            entryDOM += "</tr>"
            $('#readLaterTableBody').append(entryDOM);
        }
        $(".hoverPopup").mousemove(function (event) { //on
            previewDiv.css({
                "left": event.clientX + "px",
                "top": event.clientY + "px",
            });
            if (event.clientX > (document.getElementById('readLaterDiv').offsetWidth * 0.75)) {
                previewDiv.addClass("showLeft");
                previewDiv.removeClass("showRight");
            } else {
                previewDiv.addClass("showRight");
                previewDiv.removeClass("showLeft");
            }
            previewDiv.show();
            var arrayNumber = $(this).attr('id').replace("item", "");
            var thumbLink = readLaterList[arrayNumber].thumbnailLink;
            if (thumbLink !== undefined && thumbLink !== "" && thumbLink !== "undefined") {
                $("#previewImg").attr("src", thumbLink);
            } else {
                $("#previewImg").attr("src", "");
                $("#placeholderText").text("Sorry, please re-add the gallery to see thumbnail");
                previewDiv.css("width", "160px");
            }
            $(this).addClass('highlighted');
        });
        $(".hoverPopup").mouseleave(function (event) { //off
            previewDiv.hide();
            $("#placeholderText").text("");
            previewDiv.css("width", "");
            $(this).removeClass('highlighted');
        });
        var removeItem = document.getElementsByClassName("readLaterRemoveItem");
        for (i = 0; i < removeItem.length; i++) {
            removeItem[i].addEventListener("click", function () {
                //this.parentNode.remove(this);
                remove_rlEntry(parse_gallery_identifier(this.nextElementSibling.children[0].href));
            });
        }
        redoTheme();
        dataTable = $('#readLaterTable').DataTable({
            "scrollY": "400px",
            "scrollCollapse": true,
            "paging": false,
            "responsive": true,
            "bAutoWidth": true,
        });
        // setTimeout(function () {
        //     $('th')[0].click();
        // }, 100)
    }
}

function remove_rlEntryFunction(event) {
    remove_rlEntry(parse_gallery_identifier());
    $(this).parent().remove();
}

function add_rlEntryFunction() {
    var title;
    if (window.location.href.indexOf("/g/") > -1) {
        title = $('#gn').text();
    } else {
        title = $('#i1').children('h1').text() + " {" + $('#i2').children('.sn').children('div').text().replace(/ /g, "") + "}";
    }
    var thumbnailLink;

    if (currentPageLink.indexOf("/s/") > -1) {
        var mainPage_URL = $('#i5').children('.sb').children('a').attr('href');
        $(document).ajaxComplete(function (event, xhr, settings) {
            var data = xhr.responseText;
            var divStyle = $("#gd1", data).children('div').attr("style").split(" ");
            if (divStyle[3].startsWith("url")) {
                thumbnailLink = divStyle[3].substring(divStyle[3].indexOf("(") + 1, divStyle[3].indexOf(")"));
            } else {
                for (i = 0; i < stuff.length; i++) {
                    if (divStyle[i].startsWith("url")) {
                        thumbnailLink = divStyle[i].substring(divStyle[i].indexOf("(") + 1, divStyle[i].indexOf(")"));
                        break;
                    }
                }
            }
            thumbnailLink = thumbnailLink.replace("exhentai.org", "ehgt.org");
            add_rlEntry(title, parse_gallery_identifier(), thumbnailLink);
            populate_rlDiv();
            $('#successDiv').fadeIn();
            setTimeout(function () {
                $('#successDiv').fadeOut();
            }, 2000);
            $('#addReadLaterOption').text('Added to list');
            $('#addReadLaterOption').off();
            $('#addReadLaterOption').css({
                'text-decoration': 'none',
                'cursor': 'default',
            });
        });
        $.ajax(mainPage_URL);
    } else {
        var divStyle = $("#gd1").children('div').attr("style").split(" ");
        if (divStyle[3].startsWith("url")) {
            thumbnailLink = divStyle[3].substring(divStyle[3].indexOf("(") + 1, divStyle[3].indexOf(")"));
        } else {
            for (i = 0; i < stuff.length; i++) {
                if (divStyle[i].startsWith("url")) {
                    thumbnailLink = divStyle[i].substring(divStyle[i].indexOf("(") + 1, divStyle[i].indexOf(")"));
                    break;
                }
            }
        }
        thumbnailLink = thumbnailLink.replace("exhentai.org", "ehgt.org");
        add_rlEntry(title, parse_gallery_identifier(), thumbnailLink);
        populate_rlDiv();
        $('#addReadLaterOption').text('Added to list');
        $('#addReadLaterOption').off();
        $('#addReadLaterOption').css({
            'text-decoration': 'none',
            'cursor': 'default',
        });
    }
}

function show_rlList() {
    readLaterDiv.show();
    $('#seeReadLaterListOption').text('Hide "view later" list');
}

function hide_rlList() {
    readLaterDiv.hide();
    $('#seeReadLaterListOption').text('Show "view later" list');
}

function createLink(id, link, text) {
    return '<a id="' + id + '" href="' + link + '" class="link light">' + text + '</a>';
}

function createOption(id, text) {
    return '<li><label id="' + id + '" class="option light">' + text + '</label></li>';
}

function createOptionWithClass(id, text, extraClass) {
    return '<li><label id="' + id + '" class="option light ' + extraClass + '">' + text + '</label></li>';
}

function rlStringToArray(string) {
    var returnArray = [];
    var splitString = string.split(";");
    for (i = 0; i < splitString.length; i++) {
        var entrySplit = splitString[i].split("::");
        var entry = create_rlEntry(entrySplit[0], entrySplit[1], entrySplit[2]);
        if (entry !== null) {
            returnArray.push(entry);
        }
    }
    return returnArray;
}

function rlArrayToString(array) {
    var returnString = "";
    for (i = 0; i < array.length; i++) {
        returnString += getStringEntry(array[i]);
        if (i !== (array.length - 1)) {
            returnString += ";";
        }
    }
    return returnString;
}

function create_rlEntry(title, link, thumbnailLink) {
    if (!link || !title || !thumbnailLink) {
        return null;
    } else {
        titleParse = parseTitle(title);
        return { eventName: titleParse.eventName, group: titleParse.group, artist: titleParse.artist, title: titleParse.title, link: link, thumbnailLink: thumbnailLink };
    }
}

function getStringEntry(entry) {
    var returnString = unparseTitle(entry)
    returnString += "::" + entry.link;
    returnString += "::" + entry.thumbnailLink;
    return returnString;
}

function load_rlList() {
    var rlString = GM_getValue("readLater", "");
    return rlStringToArray(rlString);
}

function add_rlEntry(title, link, thumbnailLink) {
    titleParsed = parseTitle(title);
    if (getIndex_rlList(link).index === -1) {
        var entry = create_rlEntry(title, link, thumbnailLink);
        var entryString = title + "::" + link + "::" + thumbnailLink;
        // add to current saved list
        readLaterList.push(entry);
        // add to GM_saved list
        var newValue = GM_getValue("readLater", "");
        if (newValue !== "") {
            newValue += ";";
        }
        newValue += entryString;
        GM_setValue("readLater", newValue);
    } else {
        var replaceItemIndex = getIndex_rlList(link).index;
        // update current saved list
        readLaterList[replaceItemIndex].eventName = titleParsed.eventName;
        readLaterList[replaceItemIndex].group = titleParsed.group;
        readLaterList[replaceItemIndex].artist = titleParsed.artist;
        readLaterList[replaceItemIndex].title = titleParsed.title;
        readLaterList[replaceItemIndex].link = link;
        readLaterList[replaceItemIndex].thumbnailLink = thumbnailLink;
        // update current saved list
        var savedValue = GM_getValue("readLater", "");
        var array = rlStringToArray(savedValue);
        array[replaceItemIndex].eventName = titleParsed.eventName;
        array[replaceItemIndex].group = titleParsed.group;
        array[replaceItemIndex].artist = titleParsed.artist;
        array[replaceItemIndex].title = titleParsed.title;
        array[replaceItemIndex].link = link;
        array[replaceItemIndex].thumbnailLink = thumbnailLink;
        savedValue = rlArrayToString(array);
        GM_setValue("readLater", savedValue);
    }
}

function remove_rlEntry(link) {
    var removeItemIndex = getIndex_rlList(link).index;
    // remove from current saved list
    readLaterList.splice(removeItemIndex, 1);

    // remove from GM_saved list
    var savedValue = GM_getValue("readLater", "");
    var array = rlStringToArray(savedValue);
    array.splice(removeItemIndex, 1);
    savedValue = rlArrayToString(array);
    GM_setValue("readLater", savedValue);

    if (location.href.indexOf(link) > -1) {
        $('#addReadLaterOption').text('Add to "view later" list');
        if (currentPageLink.indexOf("/mpv/") === -1) {
            document.getElementById('addReadLaterOption').addEventListener("click", add_rlEntryFunction);
        }
        $('#addReadLaterOption').css({
            'text-decoration': 'underline',
            'cursor': 'pointer',
        });
    }

    if (document.getElementsByClassName("readLaterItem").length === 0) {
        hide_rlList();
    }
    populate_rlDiv();
}

function getIndex_rlList(link) {
    var galleryID = getGalleryID(link);
    for (i = 0; i < readLaterList.length; i++) {
        if (readLaterList[i].link !== undefined && readLaterList[i].link.indexOf(galleryID) > -1) {
            if (readLaterList[i].link === link) {
                return { index: i, exactMatch: true };
            } else {
                return { index: i, exactMatch: false };
            }
        }
    }
    return { index: -1, exactMatch: false };
}

// Parse the gallery link
function parse_gallery_identifier(link) {
    var identifier_start;
    var identifier_end;
    var identifier;
    if (link === undefined) {
        if (location.href.indexOf('e-hentai.org') !== - 1) {
            identifier_start = location.href.indexOf('e-hentai.org') + 12;
        } else if (location.href.indexOf('exhentai.org') !== - 1) {
            identifier_start = location.href.indexOf('exhentai.org') + 12;
        }
        identifier_end = location.href.length;
        identifier = location.href.substr(identifier_start, identifier_end);
    } else {
        if (link.indexOf('e-hentai.org') !== - 1) {
            identifier_start = link.indexOf('e-hentai.org') + 12;
        } else if (link.indexOf('exhentai.org') !== - 1) {
            identifier_start = link.indexOf('exhentai.org') + 12;
        }
        identifier_end = link.length;
        identifier = link.substr(identifier_start, identifier_end);
    }
    return identifier;
}

////////////////////////////////////////////////////////////////
// Parsing and unparsing title 
////////////////////////////////////////////////////////////////

function unparseTitle(parsedTitle) {
    var returnString = "";
    if (parsedTitle.eventName !== "") {
        returnString += "(" + parsedTitle.eventName + ") ";
    }
    if (parsedTitle.group !== "" && parsedTitle.artist !== "") {
        returnString += "[" + parsedTitle.group + " (" + parsedTitle.artist + ")] ";
    } else if (parsedTitle.artist !== "") {
        returnString += "[" + parsedTitle.artist + "] ";
    }
    returnString += parsedTitle.title;
    return returnString;
}

function parseTitle(stringTitle) {
    var eventName = "";
    var group = "";
    var artist = "";
    var title = "";

    var title_done = false;
    var mode = "";
    var temp = "";

    for (j = 0; j < stringTitle.length; j++) {
        if (stringTitle[j] === "(" && mode === "") {
            mode = "event";
        } else if (stringTitle[j] === ")" && mode === "event") {
            mode = "";
        } else if (stringTitle[j] === "[" && mode === "") {
            mode = "info";
        } else if (stringTitle[j] === "(" && mode === "info") {
            mode = "artist";
            group = temp;
        } else if (stringTitle[j] === ")" && mode === "artist") {
            mode = "title";
        } else if (stringTitle[j] === "]" && mode === "info") {
            mode = "title";
            artist = temp;
        } else if (stringTitle[j] === "]" && stringTitle[j - 1] === ")") {
            mode = "title";
        } else {
            switch (mode) {
                case "":
                    title += stringTitle[j];
                    break;
                case "event":
                    eventName += stringTitle[j];
                    break;
                case "info":
                    temp += stringTitle[j];
                    break;
                case "artist":
                    artist += stringTitle[j];
                    break;
                case "title":
                    title += stringTitle[j];
                    break;
            }
        }
    }
    return { eventName: eventName.trim(), group: group.trim(), artist: artist.trim(), title: title.trim() };
}

////////////////////////////////////////////////////////////////
// UI Related 
////////////////////////////////////////////////////////////////

function hideFixedDivContent() {
    $('#minmaxFixedDivButton').text("+");
    $('#scriptTitleHeader').hide();
    $('#linkerDiv').hide();
    $('#readLaterOptionDiv').hide();
    $('#optionDiv').hide();
}

function showFixedDivContent() {
    $('#minmaxFixedDivButton').text("–");
    $('#scriptTitleHeader').show();
    $('#linkerDiv').show();
    $('#readLaterOptionDiv').show();
    if ($('.setting').length > 0) {
        $('#optionDiv').show();
    }
}

function redoTheme() {
    if (theme === "dark") {
        $('.light').addClass("dark");
        $('.light').removeClass("light");
    } else {
        $('.dark').addClass("light");
        $('.dark').removeClass("dark");
    }
}

////////////////////////////////////////////////////////////////
// External codes 
////////////////////////////////////////////////////////////////

// Credit to Adam Grant: http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
    };
}

/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
; (function (factory) {
    var registeredInModuleLoader = false;
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend() {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[i];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init(converter) {
        function api(key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) { }

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                return (document.cookie = [
                    key, '=', value,
                    attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    attributes.path ? '; path=' + attributes.path : '',
                    attributes.domain ? '; domain=' + attributes.domain : '',
                    attributes.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    var name = parts[0].replace(rdecode, decodeURIComponent);
                    cookie = converter.read ?
                        converter.read(cookie, name) : converter(cookie, name) ||
                        cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) { }
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) { }
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api.call(api, key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () { });
}));