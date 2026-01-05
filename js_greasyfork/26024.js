// ==UserScript==
// @name        DMP2016
// @namespace   DMP2016
// @include     http://www.opinionstage.com/polls/2408039/poll
// @include     http://www.opinionstage.com/polls/2408176/poll
// @version     1.2
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js
// @description DMP 2016 beer
// @downloadURL https://update.greasyfork.org/scripts/26024/DMP2016.user.js
// @updateURL https://update.greasyfork.org/scripts/26024/DMP2016.meta.js
// ==/UserScript==

var $ = jQuery;
var timer = 3000;

var cn1 = '__dmp_i';
var cn2 = '__dmp_max';
var cn3 = '__dmp_doing';

var cnBeerz = '__dmp_beerz';
var cnBrewer = '__dmp_brewer';

var currentUrl = window.location.href;

$(function () {
    console.log('INIT');

    var i, max;

    i = Cookies.get(cn1);
    max = Cookies.get(cn2);

    dmpAddHtml(i, max);

    $('#doDmp').click(function (e) {
        e.preventDefault();

        var n = $('#dmpNo').val();
        n = parseInt(n);

        Cookies.set(cn2, n);

        dmp(0);
    });

    var doing = Cookies.get(cn3);

    if (doing) {
        i = parseInt(i);
        console.log(i);

        max = parseInt(max);

        // check limit
        if (max > i) {
            dmp(i);
        } else {
            Cookies.set(cn1, '');
            Cookies.set(cn2, '');
            Cookies.set(cn3, false);
        }
    }
});

function dmpAddHtml(i, max) {
    var wrap = $('#os-wrapper');
    wrap.css('margin-top', '50px');

    var inputVal = 10;
    if (max) {
        inputVal = max;
    }

    var url1 = 'http://www.opinionstage.com/polls/2408039/poll';
    var url2 = 'http://www.opinionstage.com/polls/2408176/poll';

    var middleHtml, pivaraId;
    switch (currentUrl) {
        case url1:
            // PIVA

            var selected = Cookies.get(cnBeerz);
            var svarogCheck, perunCheck;

            if (typeof selected !== 'undefined') {
                selected = $.parseJSON(selected);

                svarogCheck = $.inArray('svarog', selected) !== -1 ? ' checked="checked" ' : '';
                perunCheck = $.inArray('perun', selected) !== -1 ? ' checked="checked" ' : '';
            } else {
                svarogCheck = ' checked="checked" ';
                perunCheck = '';
            }

            middleHtml = '<div style="width:40%;float:left;display:inline-block;text-align:left;">' +
                '<label><input type="checkbox" ' + svarogCheck + ' id="pivoSvarog">Svarog</label>' +
                '<label><input type="checkbox" ' + perunCheck + ' id="pivoPerun">Perun</label>' +
                '</div>';
            break;
        case url2:
            // PIVARE

            //Crow
            var pivaraIdCrow = 1176400;

            //Vepar
            var pivaraIdVepar = 1176406;

            //Kas
            var pivaraIdKas = 1176408;

            //Nikolacar
            var pivaraIdNC = 1176413;

            //Zebrew
            var pivaraIdZebrew = 1176419;

            var selectedBrewer = Cookies.get(cnBrewer);

            var crowCheck = '';
            var jvCheck = '';
            var kasCheck = '';
            var ncCheck = '';
            var zebrewCheck = '';
            if (typeof selectedBrewer !== 'undefined') {
                
                selectedBrewer = parseInt(selectedBrewer);

                switch (selectedBrewer) {
                    case pivaraIdCrow:
                        crowCheck = ' checked="checked" ';
                        break;
                    case pivaraIdVepar:
                        jvCheck = ' checked="checked" ';
                        break;
                    case pivaraIdKas:
                        kasCheck = ' checked="checked" ';
                        break;
                    case pivaraIdNC:
                        ncCheck = ' checked="checked" ';
                        break;
                    case pivaraIdZebrew:
                        zebrewCheck = ' checked="checked" ';
                        break;
                }

            } else {
                crowCheck = ' checked="checked" ';
            }

            middleHtml = '<div style="width:40%;float:left;display:inline-block;text-align:left;">' +
                '<label style="cursor:pointer;margin-right:10px;"><input style="cursor:pointer;" type="radio" name="pivaraId" value="' + pivaraIdCrow + '" ' + crowCheck + '>Crow</label>' +
                '<label style="cursor:pointer;margin-right:10px;"><input style="cursor:pointer;" type="radio" name="pivaraId" value="' + pivaraIdVepar + '" ' + jvCheck + '>Južni vepar</label>' +
                '<label style="cursor:pointer;margin-right:10px;"><input style="cursor:pointer;" type="radio" name="pivaraId" value="' + pivaraIdKas + '" ' + kasCheck + '>Kaš</label>' +
                '<label style="cursor:pointer;margin-right:10px;"><input style="cursor:pointer;" type="radio" name="pivaraId" value="' + pivaraIdNC + '" ' + ncCheck + '>NikolaCar</label>' +
                '<label style="cursor:pointer;margin-right:10px;"><input style="cursor:pointer;" type="radio" name="pivaraId" value="' + pivaraIdZebrew + '" ' + zebrewCheck + '>Zebrew</label>' +
                '</div>';
            break;
    }

    var html = '<div style="background-color:#222;position:fixed;top:0;width:100%;left:0;height:30px;color:#bab2b2;text-align:center;padding:10px 0;z-index:9999;">' +
        '<div style="width:20%;float:left;display:inline-block;">' +
        '<ul style="margin:0;list-style:none;"><li><a style="color: #bab2b2;" href="' + url1 + '">PIVA</a></li><li><a style="color: #bab2b2;" href="' + url2 + '">PIVARE</a></li></ul>' +
        '</div><div style="width:40%;float:left;display:inline-block;"><div style="float:left;">' +
        '<input type="number" placeholder="NUMBER" value="' + inputVal + '" min="1" id="dmpNo">' +
        '<button type="button" id="doDmp">GO!</button>' +
        '<span style="margin-left: 30px;">' + i + ' / ' + max + '</span>' +
        '</div></div>' +
        middleHtml +
        '</div>';
    wrap.after(html);
}

function dmpPiva(i) {
    i++;

    Cookies.set(cn1, i);

    Cookies.set(cn3, true);

    var cookieName = 'anonymous_votes';

    Cookies.remove(cookieName);
    Cookies.remove('_ga');
    Cookies.remove('csrf-param');
    Cookies.remove('csrf-token');

    var item = $('.layout-list-poll');

    var perun = item.find('[data-side-id="1175695"]');
    var svarog = item.find('[data-side-id="1175696"]');

    var perunCheck = $('#pivoPerun').is(':checked');
    var svarogCheck = $('#pivoSvarog').is(':checked');

    var goodToGo = false;

    var beerz = [];

    if (perunCheck) {
        perun.addClass('user_checked');
        goodToGo = true;

        beerz.push('perun');
    }

    if (svarogCheck) {
        svarog.addClass('user_checked');
        goodToGo = true;

        beerz.push('svarog');
    }
    
    if (goodToGo) {
        // Save beerz to cookie
        Cookies.set(cnBeerz, beerz);

        var btn = $('.voting-button');
        btn.removeClass('disabled');

        btn.click();

        setTimeout(function () {
            Cookies.remove(cookieName);
            Cookies.remove('_ga');
            Cookies.remove('csrf-param');
            Cookies.remove('csrf-token');

            // refresh
            location.reload();
            console.log('DONE DONE');
        }, timer);
    } else {
        alert('Izaberi bar jedno pivo!');
    }
}

function dmpPivare(i) {
    i++;

    Cookies.set(cn1, i);

    Cookies.set(cn3, true);

    var cookieName = 'anonymous_votes';

    Cookies.remove(cookieName);
    Cookies.remove('_ga');
    Cookies.remove('csrf-param');
    Cookies.remove('csrf-token');

    var item = $('.layout-image-poll');

    var pivaraId = $('input[name=pivaraId]:checked').val();

    // Save brewer to cookie
    Cookies.set(cnBrewer, pivaraId);

    var pivara = item.find('[data-side-id="' + pivaraId + '"]');
    pivara.find('.side-wrapper').click();

    setTimeout(function () {
        Cookies.remove(cookieName);
        Cookies.remove('_ga');
        Cookies.remove('csrf-param');
        Cookies.remove('csrf-token');

        // refresh
        location.reload();
        console.log('DONE DONE');
    }, timer);
}

function dmp(i) {
    switch (currentUrl) {
        case 'http://www.opinionstage.com/polls/2408039/poll':
            // PIVA

            dmpPiva(i);
            break;
        case 'http://www.opinionstage.com/polls/2408176/poll':
            // PIVARE

            dmpPivare(i);
            break;
    }
}