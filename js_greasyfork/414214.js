// ==UserScript==
// @name         Better ieee 754
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://weitz.de/ieee/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414214/Better%20ieee%20754.user.js
// @updateURL https://update.greasyfork.org/scripts/414214/Better%20ieee%20754.meta.js
// ==/UserScript==
/* eslint-env jquery */
'use strict'
$('table').after(`<div style="margin-top:20px;"><label>Nhập số điền vào:</label><input class="process-text"  style="width:500px;">
<div style="margin:10px;">
<button class="process-btn">Nhập vào ô 1</button>
<button class="process-btn">Nhập vào ô 2</button>
<button class="process-btn">Nhập vào ô 3</button>
<button class="process-sse-s">Nhập mã hex XMM float</button>
<button class="process-sse-d">Nhập mã hex XMM double</button>
</div>
</div>`);
$('.process-btn').click(function() {
    let match = $('.process-text').val().replace(/\s/g, '').match(/^([-+]?)(\d+)(?:[.,](\d+))?[x*]2\^\(?(-?\d+)\)?$/i);
    if(match===null) return;
    let signPos = (match[1] !== "-");
    let whole = match[2];
    let frac = match[3];
    let unrefinedExp = match[4];
    let wholeNum = parseInt(whole);
    let significand, exp, shift;
    if(wholeNum!==0) {
        shift = wholeNum.toString().length-1;
        significand = wholeNum.toString().substring(1)+frac;
    } else {
        shift = parseInt(frac).toString().length - frac.length - 1;
        significand = parseInt(frac).toString().substring(1);
    }
    exp=parseInt(unrefinedExp)+shift;
    console.log(significand,exp, signPos);
    const tableRow = $(this).index()+1;
    let inputSign = $('#sign'+tableRow);
    let inputSignificand = $('#mantissa'+tableRow);
    let inputExp = $('#exp'+tableRow);
    inputSign.val(signPos ? '0' : '1');
    inputSignificand.val(significand);
    inputExp.val('+'+exp);
    outUpdater(tableRow)();
})

$('.process-sse-s').click(function() {
    let match = $('.process-text').val().replace(/\s/g, '').match(/^(0x)[0-9a-f]{24}([0-9a-f]{8})$/i);
    if(match===null) return;
    $('#sizeButton32').click();
    let input = match[1]+match[2];
    $('#in3').val(input);
    inUpdater(3)();
})

$('.process-sse-d').click(function() {
    let match = $('.process-text').val().replace(/\s/g, '').match(/^(0x)[0-9a-f]{16}([0-9a-f]{16})$/i);
    if(match===null) return;
    $('#sizeButton64').click();
    let input = match[1]+match[2];
    $('#in3').val(input);
    inUpdater(3)();
})