// ==UserScript==
// @name        6nw-button
// @namespace   4077
// @match       *://*.bnw.im/*
// @version     0.21
// @description le
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12963/6nw-button.user.js
// @updateURL https://update.greasyfork.org/scripts/12963/6nw-button.meta.js
// ==/UserScript==


var sixnw = '6nw.im';

var btn_styles = [
    ['&#128528;', '#09d'], // bnw
    ['&#128526;', '#333']  // 6nw
];

var btn_click = function () {
    iframe.toggle();
    var mode = +iframe.is(':visible');
    button.html(btn_styles[mode][0]);
    button.css('background-color', btn_styles[mode][1]);
    if (mode) {
        iframe.attr('src', location.protocol+'//'+sixnw+location.pathname+location.hash);
    }
}

$('<style />', {
    type: 'text/css',
    text: '\
      #sixnw-iframe {\
        position: fixed;\
        top: 0;\
        left: 0;\
        width: 100%;\
        height: 100%;\
        z-index: 10000;\
        border: 0;\
        display: none;\
      }\
      #sixnw-button {\
        position: fixed;\
        top: 10px;\
        right: 10px;\
        width: 40px;\
        height: 40px;\
        z-index: 10001;\
        font-size: 30px;\
        color: #eee;\
        background-color: '+btn_styles[0][1]+';\
        text-shadow: 1px 1px 1px #ddd;\
        box-shadow: 2px 2px 2px #333;\
        border-radius: 10px;\
        text-align: center;\
        vertical-align: middle;\
        line-height: 40px; \
        cursor: pointer;\
      }'
}).appendTo('head');

var button = $('<div />', {
    id: 'sixnw-button',
    html: btn_styles[0][0],
    click: btn_click
});

var iframe = $('<iframe />', {
    id: 'sixnw-iframe',
    src: ''
});

$('body').append(button).append(iframe);
