// ==UserScript==
// @name         GTM Vorschau
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Dieses Skript sammelt Informationen über Änderungen in einer Google Tag Manager (GTM) Umgebung und kopiert diese Informationen in die Zwischenablage.
// @author       Vanakh Chea
// @match        http*://tagmanager.google.com/#/container/accounts/*/containers/*/workspaces/*
// @match        http*://tagmanager.google.com/*
// @grant        none
// @run-at       context-menu
// @require    http://code.jquery.com/jquery-3.3.1.min.js
// @require    https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/523746/GTM%20Vorschau.user.js
// @updateURL https://update.greasyfork.org/scripts/523746/GTM%20Vorschau.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    //Vorschaulink:
    var previewlink = $('textarea[data-ng-model="form.previewLink"]').val();
    if(previewlink == undefined){
        previewlink = "<< LINK EINFÜGEN >>"
    }

    //Workspacename popup:
    // $('form strong').text()

    // Container ID
	var container = document.querySelector("a.gtm-container-public-id").innerText.trim()
    //Workspacename:
    var workspace = $('.current-container-card__name').text().trim();
    //Workspace url:
    var workspaceurl = window.location.href;
    //tagnamen:
    var tagnames = $('tr.change-added, tr.change-updated').filter(':contains("Tag")').filter(':not(:contains("Trigger"))').filter(':not(:contains("Variable"))').find('td:nth-child(1)').map(function(){ return this.innerText });
    tagnames = tagnames.toArray().join('\n');
    //added tags:
    var tagnames_added = $('tr.change-added').filter(':contains("Tag")').filter(':not(:contains("Trigger"))').filter(':not(:contains("Variable"))').find('td:nth-child(1)').map(function(){ return this.innerText });
    tagnames_added = tagnames_added.toArray().join('\n');
    //changed tags:
    var tagnames_edited = $('tr.change-updated').filter(':contains("Tag")').filter(':not(:contains("Trigger"))').filter(':not(:contains("Variable"))').find('td:nth-child(1)').map(function(){ return this.innerText });
    tagnames_edited = tagnames_edited.toArray().join('\n');
    //deleted tags:
    var tagnames_deleted = $('tr.change-deleted').filter(':contains("Tag")').filter(':not(:contains("Trigger"))').filter(':not(:contains("Variable"))').find('td:nth-child(1)').map(function(){ return this.innerText });
    tagnames_deleted = tagnames_deleted.toArray().join('\n');
    //Trigger:
    var triggers = $('tr.change-added, tr.change-updated').filter(':contains("Trigger")').filter(':not(:contains("Tag"))').filter(':not(:contains("Variable"))').find('td:nth-child(1)').map(function(){ return this.innerText });
    triggers = triggers.toArray().join('\n');
    //Variablen:
    var variables = $('tr.change-added, tr.change-updated').filter(':contains("Variable")').filter(':not(:contains("Trigger"))').filter(':not(:contains("Tag"))').find('td:nth-child(1)').map(function(){ return this.innerText });
    variables = variables.toArray().join('\n');
    var text = 'Eingerichtet im Workspace: ' + workspace + '\n'+ workspaceurl + '\n' + 'Im GTM Container: ' + container +'\n\n **=== Neu angelegte Tags: ===** \n' + tagnames_added + '\n\n **=== Veränderte Tags: ===** \n' + tagnames_edited + '\n\n **=== Gelöschte Tags: ===** \n' + tagnames_deleted +'\n\n **=== Trigger: ===** \n' + triggers +'\n\n **=== Variablen: ===** \n' + variables + '\n\n **=== Vorschaulink: ===** \n' + previewlink + '\n\n **=== Doku-Link(s): ===** \n';
    console.log(text);
    //prompt("Ausgabe", text);
    var input = document.body.appendChild(document.createElement("textarea"));
    input.value = text;
    input.focus();
    input.select();
    document.execCommand('copy');
    input.parentNode.removeChild(input);
})();