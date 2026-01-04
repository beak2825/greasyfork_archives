// ==UserScript==
// @name         QM CC
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Checks notes in the GTT document for people to put in cc when assigning the issue in Quality Manager.
// @author       You
// @match        https://gloc-qm.appspot.com/issues/*
// @downloadURL https://update.greasyfork.org/scripts/383410/QM%20CC.user.js
// @updateURL https://update.greasyfork.org/scripts/383410/QM%20CC.meta.js
// ==/UserScript==

var docEl = document.querySelector('a[class="nwu"][data-original-title]');
var docCode;
if (docEl) docCode = docEl.href.replace(/https:\/\/translate.google.com\/toolkit\/workbench\?did=/, "");
addCcButton();

function getGttNotes() {
    if (!docCode) return false;
    var response;
    var url = 'https://symlite.moravia.com/api/documents/getinstructions?docCode=' + docCode + '&authCode=Q7k8Eurakp38HjuH6AyM';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
        }
    };
    xmlhttp.open('GET', url, false);
    xmlhttp.send();
    var notes = response.description;
    return notes;
}

function addCcButton() {
    var menu = document.getElementById("add_issues_toolbar");
    var subheader = document.getElementsByClassName("sub-header-body")[0];
    var html = '<div id="no-cc-alert" style="position: relative;left: 77%;margin-top: 1%;padding: 2px 5px 2px 5px;border: 1px solid #aaa;border-radius: 4px;width: fit-content;display: none;">There aren\'t any contacts in GTT notes.</div>';
    $(menu).append('<a id="add-cc" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button"><span class="ui-button-icon-primary ui-icon ui-icon-plusthick"></span><span class="ui-button-text">Add CC</span></a>');
    document.getElementById("add-cc");
    $(subheader).append(html);
    $('#add-cc').click(function () {
        var ccArray = getContactsFromNotes();
        if (ccArray.length) {
            var selectContainer = document.getElementById("id_cc_users");
            for (var i = 0; i < ccArray.length; i++) {
                var contact = ccArray[i];
                var response;
                var url = 'https://gloc-qm.appspot.com/core/autocomplete/cc_users/?term=' + contact;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        response = JSON.parse(this.responseText);
                    }
                };
                xmlhttp.open('GET', url, false);
                xmlhttp.send();
                if (!response || !response.items.length) continue;
                var code = response.items[0][0];
                var optionHtml = '<option value="' + code + '" selected="selected" data-select2-id="">' + contact + '</option>';
                $(selectContainer).append(optionHtml);
            }
        }
        else $("#no-cc-alert").fadeIn().css("display", "inline-block").delay(2500).fadeOut();
    });
}

function getContactsFromNotes() {
    var ccArray = [];
    var notes = getGttNotes();
    if (!notes) return [];
    var contacts = notes.match(/[\w\-]+@([\w\-]+.[\w]+)?/gi);
    if (contacts) {
        for (var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];
            if (!contact.match(/@[\w\-]+.[\w]+/gi)) contact += "google.com";
            ccArray.push(contact);
        }
        return ccArray;
    }
    return [];
}

// endpoint: https://gloc-qm.appspot.com/core/autocomplete/cc_users/?term=cloud