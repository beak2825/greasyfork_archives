// ==UserScript==
// @name         CurseForge Changelog Edit Button
// @namespace    http://tampermonkey.net/
// @version      2024-04-10
// @description  Add an edit button for individual file changelogs on the legacy CurseForge website
// @author       nevcairiel
// @match        https://legacy.curseforge.com/*/mods/*/files/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491795/CurseForge%20Changelog%20Edit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/491795/CurseForge%20Changelog%20Edit%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // find project id
    var editButton = document.querySelector("a[href$='/edit']")
    if (!editButton)
        return;

    var matches = editButton.href.match(/\/project\/(\d+)\/files\/\d+\/edit/);
    if (!matches || !matches[0])
        return;

    var projectId = matches[1];

    // find the icon asset path
    var iconPathMathces = document.querySelector("a.button svg.icon use").getAttribute("xlink:href").match(/(\/Content\/.+\/Skins\/CurseForge\/images\/twitch)\//);
    var iconPath = iconPathMathces[1];

    function addEditButton(row) {
        var fileHref = row.querySelector("a[data-action=file-link]").href
        var fileId = fileHref.substring(fileHref.lastIndexOf('/') + 1)
        var html = `<a data-project-id="${projectId}" href="/project/${projectId}/files/${fileId}/edit" class="button  button--icon-only" style="margin: 0px 2px;" data-tooltip="Edit file"><span class="button__text"><svg class="icon icon-fixed-width icon-margin" viewBox="0 0 20 20" width="18" height="18"><use xlink:href="${iconPath}/Object/Settings.svg#Object/Settings"></use></svg></span></a>`;
        var nodes = row.querySelectorAll("td")
        nodes[nodes.length - 1].querySelector("div").innerHTML += html;
    }

    var rows = document.querySelectorAll("table.project-file-listing tbody tr");
    for (var i = 0, row; row = rows[i]; i++) {
      addEditButton(row);
    }

    // Your code here...
})();