// ==UserScript==
// @name         TradeMe Add Report Flag to Category Index Items
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Takes you straight to the report page. Has 2 matches because TradeMe is inconsistent with their use of upper and lower case
// @author       Sarah King
// @match        http://www.trademe.co.nz/browse/categorylistings.aspx*
// @match        http://www.trademe.co.nz/Browse/CategoryListings.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19771/TradeMe%20Add%20Report%20Flag%20to%20Category%20Index%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/19771/TradeMe%20Add%20Report%20Flag%20to%20Category%20Index%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var splitUrl = function() {
        var vars = [], hash;
        var url = document.URL.split('?')[0];
        var p = document.URL.split('?')[1];
        if(p !== undefined){
            p = p.split('&');
            for(var i = 0; i < p.length; i++){
                hash = p[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        vars['url'] = url;
        return vars;
    };

    var getparams = splitUrl();
    var rptpath;

    if ("rptpath" in getparams){
        rptpath = splitUrl().rptpath;
    }
    else {
        rptpath = splitUrl().mcatpath;
    }

    //

    // Your code here...
    $('head').append('<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" type="text/css" />');
    $('head').append('<style type="text/css">div.title a.tmflag:visited {color: paleturquoise;}</style>');

    $(".supergrid-listing").each(function(){
        if (!$( this ).hasClass( "no-listing" )){
            var watchlistId = $(this).children('.watchlist').first();                    
            var auction = watchlistId.attr('id').substr(9);         
            $(this).children('.info').children('.title').html('<a href="/Browse/CommunityWatch.aspx?id='+auction+'&rptpath='+rptpath+'" class="tmflag" target="_blank"><i class="fa fa-flag"></i></a> ' + $(this).children('.info').children('.title').html());
        }
    });
})();