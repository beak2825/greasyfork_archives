// ==UserScript==
// @name         Launcher Refresh
// @namespace    PXgamer
// @version      0.24
// @description  Adds button to refresh the launcher
// @author       PXgamer
// @match        *learnforgelocal/*
// @exclude      *learnforgelocal/launcher*
// @require      https://code.jquery.com/jquery-1.12.3.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18914/Launcher%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/18914/Launcher%20Refresh.meta.js
// ==/UserScript==

// Set defaults
var url         = window.location.href;
var h           = 970;
var w           = 650;
var da          = "";
var min         = GM_getValue('min', 'display: inline;');
var max         = GM_getValue('max', 'display: none;');
var br          = GM_getValue('borderradius', '0 0 10px 0');
var topV        = GM_getValue('top', 0);
var leftV       = GM_getValue('left', 0);
var bottomV     = "";
var rightV      = "";
var refreshIco  = "http://owen-imac/assets/img/icons/refresh.svg";
// Reset
// GM_setValue('top', '0px');
// GM_setValue('left', '0px');

(function() {
    'use strict';
    // Begin Script
    console.log('Core READY');

    // Add refresh button
    $('body').prepend('<div style="z-index: 100; padding: 10px; text-align: center; top: '+topV+'; left: '+leftV+'; background: black; position:absolute; border-radius: '+br+'; margin: 0 auto;" id="pxBar">'+
                      '<span style="color: white; text-decoration: none;">'+
                      '<span class="handle" style="padding-right: 10px; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; cursor: pointer;">||</span>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none; '+max+'" class="max action btn btn-orange" data-action="minimise" minmax="max" id="max">+</a>'+
                      '<a href="" style="cursor: pointer; color: white; text-decoration: none;'+max+'" class="max btn btn-orange"><image src="'+refreshIco+'" style="width: 10px;" /></a>'+
                      '</span>'+
                      '<span style="color: white; text-decoration: none; '+min+'" id="pxOptions">'+
                      '<a href="" style="color: white; text-decoration: none;" class="btn btn-orange">Refresh</a>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none;" class="openInWindow btn btn-green" data-height="600" data-width="800">Open in Window (800x600)</a>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none;" class="openInWindow btn btn-green" data-height="650" data-width="970">Open in Window (970x650)</a>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none;" class="ll btn btn-lightBlue">LL</a>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none;" class="rc btn btn-lightBlue">RC</a>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none;" class="rb btn btn-lightBlue">RB</a>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none;" class="action btn btn-orange" data-action="minimise" minmax="min">-</a>'+
                      '<a style="cursor: pointer; color: white; text-decoration: none;" class="action btn btn-red" data-action="close">X</a>'+
                      '</span>'+
                      '</div>');
    $('body').append('<style> '+
                     '.btn { '+
                     'display: inline; '+
                     'padding: 1px 12px; '+
                     'margin: 0 2px; '+
                     'font-size: 14px; '+
                     'font-weight: 400; '+
                     'line-height: 1.42857143; '+
                     'text-align: center; '+
                     'white-space: nowrap; '+
                     'vertical-align: middle; '+
                     '-ms-touch-action: manipulation; '+
                     'touch-action: manipulation; '+
                     'cursor: pointer; '+
                     '-webkit-user-select: none; '+
                     '-moz-user-select: none; '+
                     '-ms-user-select: none; '+
                     'user-select: none; '+
                     'background-image: none; '+
                     'border: 1px solid transparent; '+
                     'border-radius: 4px; '+
                     'font-family: monospace; '+
                     '} '+
                     '.btn-orange { '+
                     'color: #fff; '+
                     'background-color: #f0ad4e; '+
                     'border-color: #eea236; '+
                     '}'+
                     '.btn-green {'+
                     'color: #fff;'+
                     'background-color: #5cb85c;'+
                     'border-color: #4cae4c;'+
                     '}'+
                     '.btn-red {'+
                     'color: #fff;'+
                     'background-color: #d9534f;'+
                     'border-color: #d43f3a;'+
                     '}'+
					 '.btn-lightBlue {'+
					 'color: #fff;'+
					 'background-color: #5bc0de;'+
					 'border-color: #46b8da;'+
					 '}'+
                     '</style>'
                    );

    $('#pxBar').draggable({ handle: "span.handle",
                           snap: "body",
                           containment: "document",
                           start: function startDrop() {
                               // Set border radius to all corners 10px
                               console.log('Moving the toolbar...');
                               $('#pxBar').css('border-radius', '10px 10px 10px 10px');
                           },
                           stop: function stopDrop() {
                               // Set the position variables
                               topV      = $('#pxBar').css('top');
                               bottomV   = $('#pxBar').css('bottom');
                               leftV     = $('#pxBar').css('left');
                               rightV    = $('#pxBar').css('right');

                               // Log position on screen to console
                               console.info('t:'+topV+',b:'+bottomV+',l:'+leftV+',r:'+rightV);

                               if (topV === '0px' && leftV === '0px') {
                                   // Set radius for top left corner
                                   console.log('Top Left Position');
                                   $('#pxBar').css('border-radius', '0 0 10px 0');
                               }
                               else if (topV === '0px' && leftV !== '0px') {
                                   // Set radius for top left corner
                                   console.log('Top Position');
                                   $('#pxBar').css('border-radius', '0 0 10px 10px');
                               }
                               else if (topV !== '0px' && leftV === '0px') {
                                   // Set radius for top left corner
                                   console.log('Left Position');
                                   $('#pxBar').css('border-radius', '0 10px 10px 0');
                               }
                               else {
                                   // Set radius for all other positions
                                   console.log('Other Position');
                                   $('#pxBar').css('border-radius', '10px');
                               }

                               // Set local storage vars
                               br = $('#pxBar').css('border-radius');
                               GM_setValue('top', topV);
                               GM_setValue('left', leftV);
                               GM_setValue('borderradius', br);
                           }
                          });
    // End Script
    console.log('Tools READY');
})();

// Open In Window option
$('.openInWindow').on( 'click',
                      function() {
    // Define height and width
    h = $(this).attr('data-height');
    w = $(this).attr('data-width');
    console.info('h:' + h + ', w:' + w);

    // Open the new window popup
    window.open(url,
                'Some File',
                'toolbar=no, menubar=no, scrollbars=no, resizable=yes, width='+w+', height='+h,
                false);
}
                     );

// Actions options
$('.action').on( 'click',
                function() {
    da = $(this).attr('data-action');
    console.info('Option: ' + da);

    // Hide pxOptions
    $('#pxOptions').toggle();
    if (da == 'minimise') {
        $('.max').toggle();
        if ($(this).attr('minmax') == 'min') {
            GM_setValue('min', 'display: none;');
            GM_setValue('max', 'display: inline;');
        }
        else {
            GM_setValue('min', 'display: inline;');
            GM_setValue('max', 'display: none;');
        }
        console.info('min: ' + GM_getValue('min') + ', max: ' + GM_getValue('max'));
    }
}
               );
// RC options
$('.rc').on( 'click',
                function() {
    repo = url.split('/');
    window.open('http://learnforgeserver:8000/'+repo[4]+'/'+repo[7]+'/'+repo[8]+'/');
}
);
// RB options
$('.rb').on( 'click',
                function() {
    repo = url.split('/');
    window.open('http://learnforgeserver:8000/'+repo[4]+'/'+repo[5]+'/'+repo[6]+'/');
}
);
// LL options
$('.ll').on( 'click',
                function() {
    repo = url.split('/');
    window.open('http://learnforgelocal/launcher/#/courses/'+repo[4]+'/'+repo[7]+'/'+repo[8]+'/');
}
);