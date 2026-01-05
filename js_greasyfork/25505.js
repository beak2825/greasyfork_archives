// ==UserScript==
// @name         RED Save Upload Page
// @namespace    passtheheadphones.me
// @version      0.3
// @description  Remember what formats you chose upload the upload page
// @author       SIGTERM86
// @include      https://redacted.ch/upload.php
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @resource     jqueryCSS https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25505/RED%20Save%20Upload%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/25505/RED%20Save%20Upload%20Page.meta.js
// ==/UserScript==

var jqueryCSS = GM_getResourceText ("jqueryCSS");
GM_addStyle (jqueryCSS);

function saveCheckbox(id) {
    GM_setValue(id, $("#"+id).prop("checked"));
}

function saveVal(id) {
    GM_setValue(id, $("#"+id).val());
}

function saveAll() {
    saveVal("releasetype");
    saveCheckbox("remaster");
    saveCheckbox("scene");
    saveVal("format");
    saveVal("bitrate");
    saveVal("media");

    GM_setValue("buttonCount", buttonCount);
    for (var i=1; i<buttonCount; i++) {
        saveVal("format_"+i);
        saveVal("bitrate_"+i);
    }

    //$("#format_save").val("Save ✔");
    //saveNotification();
    $("#format_save_dialog").dialog("open");
}

function loadCheckbox(id) {
    var item = $("#"+id);
    var value = GM_getValue(id);
    if (value) {
        item.trigger("click");
    }
    return value;
}

function loadVal(id) {
    var item = $("#"+id);
    var value = GM_getValue(id);
    item.val(value);
    item.trigger("change");
    return value;
}

function loadAll() {
    loadVal("releasetype");
    loadCheckbox("remaster");
    loadCheckbox("scene");
    loadVal("format");
    loadVal("bitrate");
    loadVal("media");

    var count = GM_getValue("buttonCount", 1);
    for (var i=1; i<count; i++) {
        createRow();
        loadVal("format_"+i);
        loadVal("bitrate_"+i);
    }
}

(function() {
    'use strict';
    $('<div id="format_save_dialog"><h1 style="color:black">Saved</h1></div><p><input type="button" id="format_save" value="Save"/><input type="button" id="format_load" value="Load"/>Load automatically? <input type="checkbox" id="format_autoload"/></p>').insertBefore('.create_form');
    $("#format_save").click(saveAll);
    $("#format_load").click(loadAll);

    var autoload = loadCheckbox("format_autoload");
    if (autoload) {
        loadAll();
    }
    $("#format_autoload").on("click", function() {
        saveCheckbox("format_autoload");
    });

    $("#format_save_dialog").dialog({
        autoOpen: false,
        draggable: false,
        resizable: false,
        hide: { effect: 'fade', duration: 2000 },
        open: function(){
            var popup = $(this);
            window.setTimeout(function() {
                popup.dialog('close');
            }, 2000);
        }
    });
    $(".ui-dialog-titlebar").remove();
})();