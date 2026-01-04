// ==UserScript==
// @name        Google Calendar - Resize Navigation Sidebar
// @namespace   calendar.google.com
// @author cbop-dev (https://github.com/cbop-dev)
// @version 0.3.8
// @description Makes the G-Cal navigation sidebar re-sizable and hideable. Adds a column border and drag-button that can be dragged with the mouse, and a show/hide toggle button.
// @license MIT License (Expat)
// @include       https://calendar.google.com/calendar/render*
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/32250/Google%20Calendar%20-%20Resize%20Navigation%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/32250/Google%20Calendar%20-%20Resize%20Navigation%20Sidebar.meta.js
// ==/UserScript==
//window.alert('test');
var i = 0;
var dragging = false;
var main = $('#mainbody');
var nav = $('#nav');
var defaultPosition = '225';
var lastPosition = defaultPosition;
var minNavPosition = 35;

var ghostbar = $('<div>',
                 {id:'ghostbar',
                  css: {                                
                      'background-color': 'rgba(0,0,0,.5)',
                      height: '100%',
                      top: '0',
                      'margin-left': $('#mainbody').css('margin-left'),
                      'width': '3px',
                      'cursor': 'col-resize',
                      'float': 'left',
                      'position': 'absolute',
                      'z-index': '50'

                  },
                  class: 'ghost'
                 }).appendTo('#maincell');

var ghostEZdragbar = $('<div>',
                       {id:'ghostEZdragbar',
                        css: {
                            height: 'auto',
                            'min-height': '10px',
                            top: '0px',
                            'background-color': 'rgba(0,0,0,.5)',
                            'margin-left': $('#mainbody').css('margin-left'),
                            'width': 'auto',
                            'cursor': 'col-resize',
                            'float': 'left',
                            'position': 'absolute',
                            'z-index': '50',
                            color: 'white',
                            'text-align': 'center'
                        },
                        text: '\u25C4\u25BA',
                        class: 'ghost'
                       }).appendTo('#maincell');

var ghostToggleNav = $('<div>',
                       {id:'ghostToggleNav',
                        css: {
                            height: 'auto',
                            'min-height': '7px',
                            top: ghostEZdragbar.css('height'),
                            'background-color': 'rgba(0,0,0,.5)',
                            'margin-left': $('#mainbody').css('margin-left'),
                            'width': 'auto',
                            'cursor': 'pointer',
                            'float': 'left',
                            'position': 'absolute',
                            'z-index': '50',
                            color: 'white',
                            'text-align': 'center',


                        },
                        class: 'ghost',
                        text: '\u2715'
                       }).appendTo('#maincell');

ghostEZdragbar.css('left',"-" + ghostEZdragbar.css('width'));
ghostToggleNav.css('left',"-" + ghostToggleNav.css('width'));

function moveNav(x) {
    $('.ghost').css('margin-left', x );
    $('#mainbody').css('margin-left', x);
    $('#nav').css('width', x - 32);
}

function hideNav() {
    moveNav(0);
    $('#nav').hide();
}


var mouseMoveNav = function(e) {

    e.preventDefault();
    dragging = true;

    $(document).mousemove(function (e) {
        if (e.pageX >= minNavPosition) {
            $('.ghost').css('margin-left', e.pageX + 2);
            //ghostEZdragbar.css('margin-left', e.pageX + 2);
        }
    });
};

ghostbar.mousedown(mouseMoveNav);
ghostEZdragbar.mousedown(mouseMoveNav);
ghostToggleNav.on('click', function(e) {
    if ( ghostbar.css('display') == 'none' ){ //already hidden; toggle to visible
        ghostToggleNav.text("\u2715");
        ghostToggleNav.css('width', 'auto');
        ghostToggleNav.css('top', ghostEZdragbar.css('height'));
        $('#nav').show();
        moveNav(lastPosition);
        ghostToggleNav.css('left',"-" + ghostToggleNav.css('width'));
        $('.ghost').show();
    }
    else { // visible, going to hide nav bar:
        lastPosition = $('#nav').width() +40;
        $('.ghost').hide();
        hideNav();
        ghostToggleNav.css('top', '0px');
        ghostToggleNav.css('left', 0);
        ghostToggleNav.text('\u25BA');
        ghostToggleNav.css('width', 'auto');
        ghostToggleNav.show();
    }
});

window.onload = function() {
    //window.alert("Onload!");
};

$(document).mouseup(function (e) {
    if (dragging)
    {
        moveNav(e.pageX > minNavPosition ? e.pageX : minNavPosition);

        $(document).unbind('mousemove');
        dragging = false;
    }
});

$(window).on('hashchange', function() {
    if (location.hash.lastIndexOf('#main', 0) === -1) {
        $('.ghost').hide();
    }
    else
    {
        $('.ghost').show();
    }
});
