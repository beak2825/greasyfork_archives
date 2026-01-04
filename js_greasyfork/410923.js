// ==UserScript==
// @name         Xero Broadcast Formatter
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  better broadcast formatting
// @author       Swaight
// @match        https://xero.gg/neocortex/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410923/Xero%20Broadcast%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/410923/Xero%20Broadcast%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

var sizeValue = null;
var colorValue = null;
var prefix = null;
var isChat = true;

function addControl() {
    try {
        if ($('#sizeformats').length == 1 && $('#colorformats').length == 1 && $('#prefixInput').length == 1) {
            return;
        }
        var url = window.location.href.toLowerCase();
        if (!url.includes('/live')) {
            return;
        }

        if ($('#btnAutoRefresh').length >= 1) {
            if ($('#btnAutoRefresh')[0].classList.contains('btn-danger')) {
                return;
            }
        }
        var inputGroup = $('.form-inline')[1];

        // Create Prefix Input Div
        var divPrefixInput = document.createElement("div");
        divPrefixInput.className = "form-group mb-2";
        inputGroup.insertBefore(divPrefixInput, inputGroup.children[1]);

        // Create Color Form Div
        var divColor = document.createElement("div");
        divColor.className = "form-group mb-2";
        inputGroup.insertBefore(divColor, inputGroup.children[1]);

        // Create Size Form Div
        var divSize = document.createElement("div");
        divSize.className = "form-group mb-2";
        inputGroup.insertBefore(divSize, inputGroup.children[1]);

        // Create Color Select Element
        var colorSelectList = document.createElement("select");
        colorSelectList.id = "colorformats";
        colorSelectList.className = "form-control";
        divColor.appendChild(colorSelectList);

        // Add styles to color dropdown
        var selectElementColor = $('#colorformats');
        selectElementColor.css("height", "auto");
        selectElementColor.css("padding", "3px");

        // Create Prefix Input Element
        var prefixInput = document.createElement("input");
        prefixInput.id = "prefixInput";
        prefixInput.className = "form-control";
        divPrefixInput.appendChild(prefixInput);

        // Add styles to Prefix Input
        var inputPrefix = $('#prefixInput');
        inputPrefix.css("height", "auto");
        inputPrefix.css("padding", "2px");
        inputPrefix.css("width", "100px");
        inputPrefix.attr("placeholder", "Prefix");

        // Create Color Select Element
        var sizeSelectList = document.createElement("select");
        sizeSelectList.id = "sizeformats";
        sizeSelectList.className = "form-control";
        divSize.appendChild(sizeSelectList);

        // Add styles to size dropdown
        var selectElementSize = $('#sizeformats');
        selectElementSize.css("height", "auto");
        selectElementSize.css("padding", "3px");

        // Add Option Elements to color dropdown
        var colorList = [
            { name: 'Yellow', value: '{CB-255,255,0,255}' },
            { name: 'Red', value: '{CB-255,0,0,255}' },
            { name: 'Blue', value: '{CB-0,85,255,255}' },
            { name: 'Pink', value: '{CB-255,0,255}' }
        ];

        for (var i = 0; i < colorList.length; i++) {
            var option = document.createElement("option");
            option.value = colorList[i].value;
            option.text = colorList[i].name;
            colorSelectList.appendChild(option);
        }

        // Add Option Elements to size dropdown
        var sizeList = [
            { name: '11', value: '{F-2002_11}' },
            { name: '12', value: '{F-2002_12}' },
            { name: '13', value: '{F-2002_13}' },
            { name: '14', value: '{F-2002_14}' },
            { name: '15', value: '{F-2002_15}' },
            { name: '16', value: '{F-2002_16}' },
            { name: '17', value: '{F-2002_17}' },
            { name: '18', value: '{F-2002_18}' },
            { name: '19', value: '{F-2002_19}' },
            { name: '20', value: '{F-2002_20}' }
        ];

        for (var i = 0; i < sizeList.length; i++) {
            var option = document.createElement("option");
            option.value = sizeList[i].value;
            option.text = sizeList[i].name;
            sizeSelectList.appendChild(option);
        }

        if (sizeValue != null) {
            $("#sizeformats").val(sizeValue);
        }

        if (colorValue != null) {
            $("#colorformats").val(colorValue);
        }

        if (prefix != null) {
            $("#prefixInput").val(prefix);
        }

        // Add Eventhandler to send Button
        $(".gameRoomBroadcast").click(setStyle);

        // Add Eventhandler to color selection
        $("#colorformats").click(onColorChanged);

        // Add Eventhandler to size selection
        $("#sizeformats").click(onSizeChanged);

        // Add Eventhandler to prefix input
        $("#prefixInput").change(onPrefixChanged);

        $("#gameRoomBroadcastType").click(onTypeChanged);
    }
    catch (e) {
    }

}

function setStyle() {
    if (!isChat)
        return;

    var colorSelect = document.getElementById("colorformats");
    var colorCode = colorSelect.options[colorSelect.selectedIndex].value;

    var sizeSelect = document.getElementById("sizeformats");
    var sizeCode = sizeSelect.options[sizeSelect.selectedIndex].value;

    var textValue = $('#gameRoomBroadcastMessage').val();
    textValue = colorCode + sizeCode + ((prefix == null) ? "" : prefix) + textValue;
    console.log(textValue);
    $('#gameRoomBroadcastMessage').val(textValue);
}

function onSizeChanged() {
    var sizeSelect = document.getElementById("sizeformats");
    sizeValue = sizeSelect.options[sizeSelect.selectedIndex].value;
}

function onColorChanged() {
    var colorSelect = document.getElementById("colorformats");
    colorValue = colorSelect.options[colorSelect.selectedIndex].value;
}

function onTypeChanged() {
    var typeSelect = document.getElementById("gameRoomBroadcastType");
    isChat = typeSelect.options[typeSelect.selectedIndex].value == 'chat';
}

function onPrefixChanged() {
    prefix = $("#prefixInput").val();
}

setInterval(addControl, 100);
})();