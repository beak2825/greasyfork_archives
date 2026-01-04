// ==UserScript==
// @name         Overleaf Collapse All Folders
// @namespace    http://itmunk.dk
// @version      2.0
// @description  Adds a button, that when pressed, collapses all folders within the Overleaf file viewer.
// @author       Andreas Poulsen (@supercigar)
// @match        https://www.overleaf.com/project/*
// @icon         https://cdn.overleaf.com/img/ol-brand/overleaf_og_logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425122/Overleaf%20Collapse%20All%20Folders.user.js
// @updateURL https://update.greasyfork.org/scripts/425122/Overleaf%20Collapse%20All%20Folders.meta.js
// ==/UserScript==
'use strict';

addCollapseAllButton();

// Wait for toolbar to load, in order to add new button
function addCollapseAllButton(){
    var intv = setInterval(function() {
        var toolbarFiletree = document.getElementsByClassName("toolbar-filetree");
        // Return false until toolbar-filetree is found
        if(toolbarFiletree.length < 1){
            return false;
        }
        //when element is found, clear the interval.
        clearInterval(intv);
        var toolbarHalf = toolbarFiletree[0].firstElementChild;
        var compressBtn = toolbarHalf.firstElementChild.cloneNode(true);
        var label = compressBtn.firstElementChild;
        var span = label.nextElementSibling;
        label.className = "fa fa-arrow-up";
        span.innerText = "Collapse All";
        compressBtn.onclick = collapseAll;
        toolbarHalf.appendChild(compressBtn);
    }, 100);
}

// Get a list of <ul> inside file-tree-root
function getFolderLists() {
    var fileTreeRoot = document.getElementsByTagName("file-tree-root")[0];
    var fileTreeInner = fileTreeRoot.getElementsByClassName("file-tree-inner")[0];
    var mainList = fileTreeInner.firstElementChild;
    var folders = mainList.getElementsByClassName("list-unstyled");
    return folders;
}

// Check if a <ul> is innermost folder by seing if anymore ul.list-unstyled is inside
function isFolderInnermost(folder) {
    var subfolders = folder.getElementsByClassName("list-unstyled");
    return subfolders.length == 0;
}

// Collapse a <ul> by finding and pressing the corresponding collapse button
function collapseFolder(folder) {
    var parentItem = folder.previousElementSibling;
    var button = parentItem.querySelectorAll('[aria-label="Collapse"]')[0];
    button.click();
}

// Find all innermost elements and collapse them. Returns if length of folders is 0.
function collapseInnermost() {
    var folders = getFolderLists()
    for (let folder of folders) {
        if (isFolderInnermost(folder)) {
            collapseFolder(folder);
        }
    }
    return folders.length == 0;
}

// Keep collapsing innermost until length getFolderList is 0 i.e. collapseInnermost() == true.
// If the userstyle breaks your browser: Try adding a soft stop here at maybe 100 iterations.
function collapseAll() {
    while (true) {
        if (collapseInnermost() == true) {
            return;
        }
    }
}