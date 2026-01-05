// ==UserScript==
// @author noeatnosleep
// @name BMB Toolbar Insert
// @version 1.0.4
// @namespace BMBTI
// @description Inserts big mod buttons on toolbar pages
// @include *reddit.com/tb/*
// @downloadURL https://update.greasyfork.org/scripts/4200/BMB%20Toolbar%20Insert.user.js
// @updateURL https://update.greasyfork.org/scripts/4200/BMB%20Toolbar%20Insert.meta.js
// ==/UserScript==

document.body.onload(generateButtons);

function generateButtons() {
    var modButtons = document.createElement("span"),
        approveButton = document.createElement('a'),
		commentsButton = document.getElementByName("comments comments-button");
	approveButton.setAttribute('href', '#');
    approveButton.setAttribute('style', 'color:black;');
    approveButton.setAttribute('id', 'approvePost');
    approveButton.textContent = " APPROVE ";
	modButtons.appendChild(approveButton);
	document.body.insertBefore(modButtons, commentsButton); 
}

function doStuff() {
    approvePost.on('click', goApprove());
}

function goApprove() {}

