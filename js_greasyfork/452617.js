// ==UserScript==
// @name         GGn Upload Buttons
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world :)
// @author       BestGrapeLeaves
// @match        https://gazellegames.net/upload.php*
// @icon         https://i.pinimg.com/originals/cf/6f/83/cf6f83ff54e90f10cf2cf5f52c3e0a16.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452617/GGn%20Upload%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/452617/GGn%20Upload%20Buttons.meta.js
// ==/UserScript==

// == HELPERS == //
function hook(name, cb) {
    // blah blah eval is bad shhhh
    // accessing from window is not an option due to tampermonkey sandboxing
    const oldFn = eval(name);
    const newFn = () => {
        oldFn();
        cb();
    }

    eval(`${name} = newFn;`);
}

function button(title, cb) {
    const btn = $(`<input type="button" class="ggn-upload-buttons-script-button"/>`);
    btn.val(title);
    btn.click(cb);
    return btn;
}

function itch() {
    $('#miscellaneous').val('DRM Free').change();
    if (!$("#remaster").prop("checked")) {
        $("#remaster").prop("checked", true);
        Remaster();
    }
    $('#remaster_title').val('itch.io');
    $('#remaster_year').val($('#year').val());
    $('#release_title').val(`${$('#title').val()} v`);
}

// == SECTIONS == //
function OSTButtons() {
    console.log('rendost', $('#format'))
    button('FLAC 24', () => {
        $('#format').val('FLAC').change();
        $('#bitrate').val('24bit Lossless').change();
    }).insertAfter('#format');
    button('FLAC', () => {
        $('#format').val('FLAC').change();
        $('#bitrate').val('Lossless').change();
    }).insertAfter('#format');
}

function GamesButtons() {
    const platform = $('#platform').val();

    if (['Windows', 'Mac', 'Linux'].includes(platform)) {
        button('itch.io MLT', () => {
            itch();
            $('#language').val('Multi-Language').change();
        }).insertAfter('#miscellaneous');
        button('itch.io EN', () => {
            itch();
            $('#language').val('English').change();
        }).insertAfter('#miscellaneous');
    }

    if (platform === 'Pen and Paper RPG') {
        $('#miscellaneous').val('E-Book').change();
        $("#format").val("PDF").change();
        $("#digital").click();
        Digital();
        $('#language').val('English').change();
    } else {
        button('Art', () => {
            $('#miscellaneous').val('GameDOX').change();
            $("#gamedox").val("Artwork").change();
            $("#format").val("PDF").change();
            $("#digital").click();
            Digital();
            $('#language').val('English').change();
        }).insertAfter('#miscellaneous');
        button('DLC', () => {
            $('#miscellaneous').val('GameDOX').change();
            $("#gamedox").val("DLC").change();
            $('#language').val('English').change();
        }).insertAfter('#miscellaneous');
    }
}

// == MAIN STUFF == //
function rerender() {
    $('.ggn-upload-buttons-script-button').remove();
    $('#miscellaneous').parent().find('span.min_padding').hide();

    const category = $('#categories').val();
    if (category === "OST") {
        OSTButtons();
    } else if (category === "Games") {
        GamesButtons();
    }
}

(function() {
    'use strict';
    rerender();
    hook('Categories', rerender)
    hook('EmptyGroup', rerender)
    hook('Platform', rerender)
})();