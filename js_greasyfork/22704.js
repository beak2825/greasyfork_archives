// ==UserScript==
// @name         yugioh wiki card info
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://yugioh.wikia.com/wiki/*
// @grant        none
//@require       https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22704/yugioh%20wiki%20card%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/22704/yugioh%20wiki%20card%20info.meta.js
// ==/UserScript==

$(document).ready(function () {
    var tableLength = $('.cardtablerowdata').length;
    
    var card = {
        id: 1,
        type: "monster",
        name: (($('.cardtablerowdata').eq(0)).text()).replace('\n', ''),
        text: $('.collapsible.expanded.navbox-inner .navbox-list i').text(),
        score: parseFloat((Math.random() * (10 - 1) + 1).toFixed(1)),
        atk: parseInt(($('.cardtablerowdata').eq(tableLength - 5).find('a:first-child')).text()),
        def: parseInt(($('.cardtablerowdata').eq(tableLength - 5).find('a:last-child')).text()),
        level: parseInt(($('.cardtablerowdata').eq(tableLength - 6).find('a:first-child')).text())
    };
    
    //alert(JSON.stringify(card, null, 4));
    //console.log('ASDASDASDASD', $('.cardtablerowdata'));
    
    var container = $('<div><pre>' + JSON.stringify(card, null, 4).replace('"id"', 'id').replace('"type"', 'type').replace('"name"', 'name').replace('"text"', 'text').replace('"score"', 'score').replace('"atk"', 'atk').replace('"def"', 'def').replace('"level"', 'level') + ',' + '</pre></div>');
    container.css({
        position: 'absolute',
        top: '100px',
        left: '10px',
        background: 'white',
        padding: '20px',
        'z-index': 5000,
        'border-radius': '5px',
        border: '1px solid black',
        'box-shadow': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    });
    
    $('body').append(container);
});