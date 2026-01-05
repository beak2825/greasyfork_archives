// ==UserScript==
// @name optionsXpress
// @namespace https://greasyfork.org/en/scripts/10126-optionsxpress
// @version    0.9.8
// @description  Replace JavaScript links with real links, add more last trade option and highlight big deals
// @include *.optionsxpress.com/*
// @copyright  Daif Alotaibi E-mail: daif55@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/10126/optionsXpress.user.js
// @updateURL https://update.greasyfork.org/scripts/10126/optionsXpress.meta.js
// ==/UserScript==


/**
 * Number.prototype.format(n, x)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

$(document).ready( function(){
    //Replace JavaScript links
    $('a[href*=AppendSessionID]').each(function(){
        $href = $(this).attr("href").replace(/javascript:\s*AppendSessionID\('/,"").replace("')",'').replace(";",'');
        if($href.match(/\?/) === null) {
            $(this).attr("href", $href + '?SessionID=' +  GetSessionID());
        } else {
            $(this).attr("href", $href + '&SessionID=' +  GetSessionID());
        }
    });
    //Replace JavaScript links
    $('a[href*=prefixRedirect]').each(function(){
        $href = $(this).attr("href").replace(/javascript:\s*prefixRedirect\('/,"").replace("')",'').replace(";",'');
        if($href.match(/\?/) === null) {
            $(this).attr("href", $href + '?SessionID=' +  GetSessionID());
        } else {
            $(this).attr("href", $href + '&SessionID=' +  GetSessionID());
        }
    });

    //last trade option
    $('#lstNumberOfTrades').append('<option value="500">last 500 trades</option>');
    $('#lstNumberOfTrades  option:last').attr("selected","selected");
    if($('#txtSymbol').length > 0) {
        window.document.title = $('#txtSymbol').val() + ' Sales';
    }

    //modify Time & Sales link
    $('a:contains(Time & Sales)').each(function(){
        $(this).attr('href', 'https://onlineint.optionsxpress.com/OXNetTools/Quote/TimeSalesSeries.aspx?SessionID='+ GetSessionID() +'&Symbol='+$(this).attr('onclick').toString().match(/OpenTimeSeries\('(.+)'\)/)[1]+'&lstNumberOfTrades=500');
        $(this).removeAttr('onclick');
    });

    //highlight big deal more than 500,000$
    $('table.data tr').each(function(){
        $total = parseFloat($(this).find('td:gt(2)').html()) * parseFloat($(this).find('td:gt(3)').html());
        if($total >= 500000) {
            if($total >= 1000000) {
                $(this).css({'background-color':'#FA5882'});
            }else if($total >= 500000) {
                $(this).css({'background-color':'#8D70F4'});
            }
            $(this).find('td:gt(3)').html($(this).find('td:gt(3)').html() + ' = ' + $total.format());
        }
    });
});
