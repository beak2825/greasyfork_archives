// ==UserScript==
// @name         Previous and Next User IDs
// @author       Joe Elite
// @version      1.0
// @description  Allows you to go to the previous and next user.
// @match        https://www.brick-hill.com/user/*
// @grant        none
// @namespace https://greasyfork.org/users/1037699
// @downloadURL https://update.greasyfork.org/scripts/461322/Previous%20and%20Next%20User%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/461322/Previous%20and%20Next%20User%20IDs.meta.js
// ==/UserScript==


var prevButton = $('<button>').html('<i class="fa fa-arrow-left"></i> Previous').addClass('btn btn-primary').css({
    'position': 'absolute',
    'bottom': '515px',
    'left': '3px',
    'z-index': '9999',
    'background-color': 'transparent',
    'color': 'white',
    'border': 'none',
    'min-width': '100px',
    'outline': 'none'
});

var nextButton = $('<button>').html('Next <i class="fa fa-arrow-right"></i>').addClass('btn btn-primary').css({
    'position': 'absolute',
    'bottom': '515px',
    'right': '3px',
    'z-index': '9999',
    'background-color': 'transparent',
    'color': 'white',
    'border': 'none',
    'min-width': '100px',
    'outline': 'none'
});

$('.card .content.text-center.bold.medium-text.relative.ellipsis').append(prevButton, nextButton);

prevButton.on('click', function() {
    var current = parseInt(window.location.href.match(/\/user\/(\d+)/)[1]);
    window.location.href = 'https://www.brick-hill.com/user/' + (current - 1);
});

nextButton.on('click', function() {
    var current = parseInt(window.location.href.match(/\/user\/(\d+)/)[1]);
    window.location.href = 'https://www.brick-hill.com/user/' + (current + 1);
});