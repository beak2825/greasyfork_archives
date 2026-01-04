// ==UserScript==
// @name         PirateBay Darkmode
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license MIT
// @description  Stealth mode pirate bay
// @author       CAMIO
// @author       https://steamcommunity.com/id/LORDCAMIO
// @match        https://thepiratebay.org/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415797/PirateBay%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/415797/PirateBay%20Darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body').css({
	'background-color' : '#171818',
	'margin' : 'auto',
	'height' : '100%',
	'font-family' : 'Libre Franklin,sans-serif',
	'font-weight' : '300'
});

$('header').css({
	'background' : '#272727',
	'margin' : '5px',
	'border' : '1px solid #8080803d',
	'border-radius' : '4px',
	'box-shadow' : '0px 0px 3px black inset'
});

$('nav').css({
	'background' : '#353535',
	'padding' : '8px',
	'border-radius' : '2px',
	'width' : '-webkit-fill-available',
	'box-shadow' : '0px 0px 4px black'
});

 $('nav > a').css({
	'color' : 'grey',
	'text-decoration' : 'none',
	'font-size' : '15px'
});

$('[type=search]').css({
	'width' : '-webkit-fill-available',
	'outline' : 'none',
	'border' : '0',
	'padding' : '8px',
	'background' : '#272727',
	'border' : '1px solid #ffffff17',
	'color' : 'grey',
	'border-radius' : '2px'
});
$('button, [type=button], [type=reset], [type=submit]').css({
	'background' : 'linear-gradient(180deg, rgba(72,147,79,1) 5%, rgba(50,129,50,1) 47%, rgba(10,71,4,1) 100%)',
	'outline' : 'none',
	'border' : '0',
	'padding' : '8px',
	'color' : 'white',
	'font-weight' : 'bold',
	'font-size' : '12px',
	'border-radius' : '2px',
	'cursor' : 'pointer',
	'text-shadow' : '#060606 0px 1px 1px'
});
 $('#cat').css({
	'outline' : 'none',
	'border' : '0',
	'padding' : '8px',
	'background' : '#272727',
	'border' : '1px solid #ffffff17',
	'color' : 'grey',
	'border-radius' : '2px'
});
$('#browse h1').css({
	'text-align' : 'center',
	'padding' : '5px',
	'margin' : '0',
	'border-bottom' : '0',
	'background' : '#272727',
	'box-shadow' : '0px 0px 3px black inset',
	'padding' : '8px',
	'margin' : '5px',
	'border-radius' : '2px',
	'font-size' : '1.5em',
	'line-height' : '1em',
	'color' : 'grey'
});

    $('input[type="text" i]').css({
	'width' : '-webkit-fill-available',
	'outline' : 'none',
	'border' : '0',
	'padding' : '8px',
	'background' : '#272727',
	'border' : '1px solid #ffffff17',
	'color' : 'grey',
	'border-radius' : '2px',
	'margin' : '5px'
});
 $('#torrents span.list-header').css({
	'background' : '#363636',
	'border' : '1px solid #ffffff24',
	'padding' : '6px',
	'color' : 'white',
	'border-radius' : '2px',
	'margin' : '2px'
});

  $('#torrents li.list-entry').css({
	'background' : '#5757574a',
	'padding' : '5px',
	'margin' : '5px',
	'border-radius' : '2px',
	'border' : '1px solid grey',
	'color' : 'grey'
});

$('#torrents li.list-entry span.item-type').css({
	'padding' : '8px',
	'border' : '1px solid #8080804a'
});
$('a, a:link, a:visited, a:focus').css({
	'color' : '#8f8fffba',
	'text-decoration' : 'none',
	'border-bottom' : '1px dotted #000'
});
 $('#torrents span.item-title').css({
	'display' : 'block',
	'padding' : '8px',
	'border' : '1px solid #8080804a'
});
    $('#torrents span.list-item').css({
	'display' : 'table-cell',
	'padding' : '8px',
	'border' : '1px solid #8080804a'
});
 $('#torrents li.list-entry span.item-icons').css({
	'display' : 'inline-block',
	'width' : '-weebkit-fill-available',
	'padding' : '8px',
	'border' : '1px solid #8080804a'
});
    $('.form-box').css({
	'display' : 'inline-flex',
	'margin-right' : '.1em',
	'color' : 'white'
});
    $('b, strong').css({
	'font-weight' : 'bolder',
	'color' : 'white'
});
    $('td').css({
	'display' : 'table-cell',
	'vertical-align' : 'inherit',
	'color' : 'white'
});
    $('input[type="password" i]').css({
	'-webkit-text-security' : 'disc !important',
	'padding' : '1px 2px',
	'outline' : 'none',
	'border' : '0',
	'padding' : '8px',
	'background' : '#272727',
	'border' : '1px solid #ffffff17',
	'color' : 'grey',
	'border-radius' : '2px',
	'margin' : '5px'
});
$('#description_container h2').css({
	'margin' : '0',
	'padding' : '6px 0 8px 10px',
	'font-size' : '1.2em',
	'font-weight' : '700',
	'letter-spacing' : '.07em',
	'border-bottom' : '1px solid #fff',
	'background' : '#303030',
	'color' : 'white',
	'box-shadow' : '0px 0px 1px #b5b5b5 inset',
	'text-shadow' : '2px 2px 0px #000000'
});

    $('#description_container #metadata').css({
	'display' : 'flex',
	'background' : '#2c2c2c',
	'margin' : '5px',
	'border-radius' : '4px',
	'box-shadow' : '-1px 2px 13px black inset',
	'color' : 'white'
});
    $('#description_container dt').css({
	'margin' : '0',
	'padding' : '0',
	'display' : 'inline-block',
	'font-weight' : '700',
	'color' : '#9f9f9f',
	'border-bottom' : '1px dashed #45454500',
	'flex-shrink' : '0'
});

    $('#description_container').css({
	'background' : '#45454500',
	'padding-bottom' : '10px',
	'margin-bottom' : '10px'
});
    $('#description_container .text-box').css({
	'margin' : '20px 5px',
	'border' : '1px solid #393939',
	'background' : '#fff0',
	'padding' : '10px',
	'font' : '1.25em monospace',
	'color' : '#adadad'
});
    $("#description_text").css({"color":"#adadad"})

    $('.align-center').css({
	'max-width' : '700px'
});
    $("input[name='search']").css({
    'background' : '#252525',
	'border': '1px solid #353535',
	'box-shadow': '0px -1px 0px #353535',
	'padding': '10px',
	'color': 'white',
	'border-radius': '3px'
    });
    $("input[name='lucky']").css({
    'background' : '#252525',
	'border': '1px solid #353535',
	'box-shadow': '0px -1px 0px #353535',
	'padding': '10px',
	'color': 'white',
	'border-radius': '3px'
    });
    $("select").css({
    'padding': '8px',
    'border': '1px solid #7C7C7C',
    'border-radius': '2p',
    'outline': 'none',
    'background': '#29292B',
    'color':'white'
    });
    $("img[alt='The Pirate Bay']").attr("src", "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fguiadeinternet.com%2Ffiles%2F2012%2F05%2Fthe-pirate-bay-e1337320831370.png&f=1&nofb=1")
    $("a[target='_NEW']").hide();
    $("#description_container .links a").css({
    'background':'#303030',
    'border':'1px solid #404040',
    'border-radius':'2px',
    'padding':'8px'
    });
    $("label").css({'color':'#adadad', 'padding':'3px'});
    $("input[type='checkbox']").css({'margin':'3px'});
    $(".alt").css({"background" : "transparent"})
})();