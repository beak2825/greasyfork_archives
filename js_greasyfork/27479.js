// ==UserScript==
// @name         Yuplay Restriction Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Shows the restriction info on Yuplay pages
// @author       Makazeu
// @match        https://yuplay.ru/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27479/Yuplay%20Restriction%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/27479/Yuplay%20Restriction%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var myCountry = 'China';

    var matches = $('.list-character').html().match(/SUB_ID:\s?<span>\d+<\/span>/);
    var subid = 0;
    if(matches) {
        var match = matches[0].match(/\d+/);
        if(match) {
            subid = parseInt(match[0]);
        }
    }

    if(subid < 1) return;

    $('<div class="metacritic-score" id="myRestrictionInfo"></div>')
            .append( $('<p id="my-loading"></p>')
                .css('text-align', 'center')
                .css('font-size', '130%')
                .html('读取限区信息中...') )
            .insertAfter('.list-character');
    
    //console.log(subid);
    var jsonurl = 'https://myapps.win/steamsub/query.php?subid=' + subid;

	//ajax getJSON
	jQuery.getJSON(jsonurl, undefined, callback);


    function callback(data, status, xhr) {
        //console.log(data);
        $('#my-loading').fadeOut();

        var myObj = $('#myRestrictionInfo');
        if(data.code === 0) {
            myObj.append( $('<p></p>')
                .css('text-align', 'center')
                .css('color', 'red')
                .css('font-size', '130%')
                .html('读取限区信息失败！')
            );
        }
        else {
            myObj.append( $('<span></span>')
                .css('color', data.purchasable == 1 ? 'red' : 'green')
                .css('font-size', '120%')
                .html(data.purchasable == 1 ? '限区激活！' : '不锁激活！')
            );
            myObj.append( $('<span></span>')
                .css('color', (data.purchasable === 0 || $.inArray(myCountry, data.pur_countries)===0) ? 'green' : 'red' )
                .css('font-size', '120%')
                .html(myCountry + ((data.purchasable === 0 || $.inArray(myCountry, data.pur_countries)===0) ? '可以' : '不能') + '激活！')
            );
            myObj.append('<br>');

            myObj.append( $('<span></span>')
                .css('color', data.berun == 1 ? 'red' : 'green')
                .css('font-size', '120%')
                .html(data.berun == 1 ? '限区运行！' : '不锁运行！')
            );
            myObj.append( $('<span></span>')
                .css('color', (data.berun === 0 || $.inArray(myCountry, data.run_countries)===0) ? 'green' : 'red' )
                .css('font-size', '120%')
                .html(myCountry + ((data.berun === 0 || $.inArray(myCountry, data.run_countries)===0) ? '可以' : '不能') + '运行！')
            );
            myObj.append('<br><br>');

            $('<p></p>').append(
                $('<a></a>')
                    .css('color', 'grey')
                    .css('text-decoration', 'none')
                    .attr('href', 'https://steamdb.info/sub/' + subid.toString() + '/')
                    .attr('target', '_blank')
                    .html('访问SteamDB上的该Sub')
                )
            .insertAfter(
                $('span:contains('+ subid.toString() +')')
            );
        }

    }
})();

