// ==UserScript==
// @name         GC  - Lottomatic
// @version      0.1.1
// @description  Generate lotto numbers with minimal overlap
// @author       wibreth
// @namespace    neopets
// @match        https://www.grundos.cafe/games/lottery/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/454486/GC%20%20-%20Lottomatic.user.js
// @updateURL https://update.greasyfork.org/scripts/454486/GC%20%20-%20Lottomatic.meta.js
// ==/UserScript==

// based on https://www.andrew.cmu.edu/user/kmliu/neopets/lottery.html with permission

(function() {
    'use strict';
    /* globals $:false */

    var numbers = GM_getValue("numbers", "");

    function shuffle(o)
    {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    function leaf(a,b)
    {
        var res = new Array();
        for(var i=0; i<a.length; i++)
        {
            res[i*2] = a[i];
            res[i*2+1] = b[i];
        }
        return res;
    };

    function generate() {
        var arr = new Array();
        for(var i=0; i<30; i++)
            arr[i] = i+1;

        var arr1 = shuffle(arr);
        var arr2 = leaf( arr1.slice(0,15), arr1.slice(15,30) )
        var arr3 = leaf( arr2.slice(0,15), arr2.slice(15,30) )
        var arr4 = leaf( arr3.slice(0,15), arr3.slice(15,30) )
        var marr = arr1.concat(arr2,arr3,arr4);

        numbers = new Array();
        for(i=0; i<20; i++)
            numbers[i] = [marr[6*i], marr[6*i+1], marr[6*i+2], marr[6*i+3], marr[6*i+4], marr[6*i+5]];
        GM_setValue('numbers', numbers);
        populate();
    };

    function refresh() {
        $('.tickets').remove();
        numbers = [];
        generate();
    };

    function populate() {
        var radiodiv = $('<div class="tickets" style="font-size: 0.8em">');
        numbers.forEach((ticket, idx) => {
            radiodiv.append(`<div><input type="radio" id="${idx+1}" name="ticket" value="${idx}">
            <label for="${idx+1}">${idx+1}: ${ticket.join(', ')}</label></div>`);
        });
        $('#lotto-sprite-container').append(radiodiv);
        $('.tickets input').change(function() {
            var ticket = numbers[$(this).val()];
            $('input[name="one"]').val(ticket[0]);
            $('input[name="two"]').val(ticket[1]);
            $('input[name="three"]').val(ticket[2]);
            $('input[name="four"]').val(ticket[3]);
            $('input[name="five"]').val(ticket[4]);
            $('input[name="six"]').val(ticket[5]);
        });
        $('label').click(function() {
            let id = $(this).prop("for");
            $("#" + id).click();
        });
    }

    $('document').ready( function() {
        $('.center form:last-child() .half-width').addClass('flex-column');
        var refreshbtn = $('<a>⭮</a>')
        refreshbtn.click(function() {
            refresh();
        });
        $('#lotto-sprite-container').append(refreshbtn);

        if (!numbers)
            generate();
        else
            populate();
    });
})();