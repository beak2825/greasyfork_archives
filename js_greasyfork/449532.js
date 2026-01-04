// ==UserScript==
// @name           Закупка с учетом объема рынка by ctsigma tuned by tux
// @namespace      virtonomica
// @description  расчет контрактов на основе емкости рынка
// @version        1.02
// @include       http*://*virtonomic*.*/*/main/unit/view/*/supply*
// @grant       none
 
// @downloadURL https://update.greasyfork.org/scripts/449532/%D0%97%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D1%81%20%D1%83%D1%87%D0%B5%D1%82%D0%BE%D0%BC%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%BC%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20by%20ctsigma%20tuned%20by%20tux.user.js
// @updateURL https://update.greasyfork.org/scripts/449532/%D0%97%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D1%81%20%D1%83%D1%87%D0%B5%D1%82%D0%BE%D0%BC%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%BC%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20by%20ctsigma%20tuned%20by%20tux.meta.js
// ==/UserScript==
var run = function(){
 
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    var realm = getRealm(location.href);
    var loc = {origin:location.origin,realm:realm};
    var geo = APIget_geo(location.href);
    var geoinfo = geo.country_id+'/'+geo.region_id+'/'+geo.city_id;
 
    var FldVol = $('<input id="market_percent" type="text" value="30" style="width:34px">');
    var BtnSet = $('<input type="button" value="Заказать" title="Установить объем контрактов в размере доли рынка"/>').click(function() {
        var market_percent= parseFloat($( '#market_percent' ).prop('value'));
        if(confirm('Расчитать поставку '+market_percent+'% от текущей емкости рынка для всех контрактов?')) {
            SetContractData(geoinfo, market_percent/100);
        }
    });
    var panel = $('div.metro_header');
    panel.append($('<table><tr>').append('<td>').append(BtnSet).append('<td> доля рынка(%) </td>').append(FldVol));
 
    function getRealm(href){
        var matches = href.match(/\/(\w+)\/main\/unit\/view\//);
        return matches[1];
    }
 
    function APIget_geo(href){
        var reg = new RegExp('(\\S+\\/)('+loc.realm+')\\/.+?(\\d+)');
        reg.exec(href);
        var id = RegExp.$3;
        var apiGeoURL= loc.origin + '/api/%realm%/main/geo/city/browse'.replace('%realm%',loc.realm);
        var apiSummaryUrl = loc.origin + '/api/%realm%/main/unit/summary'.replace('%realm%',loc.realm);
        var city_id = '';
        $.ajax({
            url: apiSummaryUrl,
            dataType: 'json',
            async: false,
            data: {id:id},
            success: function(data){city_id = data.city_id;}
        })
        var geo = {};
        $.ajax({
            url: apiGeoURL,
            dataType: 'json',
            async: false,
            success: function(data){ for(var k in data){if(data[k].city_id==city_id)geo = data[k];}}
        })
        return geo;
    }
 
    function APIget_market(product_id,geo){
        var apiMetricsURL = loc.origin + '/api/%realm%/main/marketing/report/retail/metrics'.replace('%realm%',loc.realm);
        var metrics = {};
        $.ajax({
            url: apiMetricsURL,
            dataType: 'json',
            async: false,
            data: {product_id:product_id,geo:geo},
            success: function(data){ metrics = data;}
        })
        return metrics;
    }
 
    function SetContractData(geoinfo,prct){
        $('.list .product_row').each(function(){
            var product_id = /product_row_(\d+).+/.exec($(this).attr('id'))[1];
            var vol=APIget_market(product_id,geoinfo).local_market_size;
            console.log(product_id+'->'+vol);
            if (vol != 0) {
                vol = parseInt(vol * prct);
                $('input[name^="supplyContractData[party_quantity]"]',this).val(vol);
            }
        })
    }
};
 
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}