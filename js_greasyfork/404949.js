// ==UserScript==
// @name         LSViewer
// @namespace    https://yiyunzhi.github.io/
// @version      0.1.3
// @description  Extend the page chart and infomation on the page of ls-x.de
// @author       GF Zhang
// @include      *ls-x.de/de/tradebox*
// @supportURL   https://github.com/yiyunzhi/lsviewer
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.highcharts.com/highcharts.js
// @require      https://code.highcharts.com/modules/heatmap.js
// @require      https://code.highcharts.com/modules/treemap.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404949/LSViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/404949/LSViewer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = jQuery.noConflict();
    'use strict';
    // template used to insert
    var _template='<div class="row">'+
        '<div class="col-md-12">'+
        '<div id="treeMapContainer" style="width:100%; height:400px;"></div>'+
        '<button id="resetChart">RESET</button><h4 id="updateDate" style="text-align: center"></h4></div></div>';
    var _treemapParentElm=$('div#page_content> .mpe_container> .mpe_bootstrapgrid');
    var _tradeTable=$('table[data-type="trades"]');
    _treemapParentElm.prepend(_template);
    // only 10 items be plotted
    const _topMaxLength = 10;
    var _topCollection = [];
    var _lastMinValue = 0;
    var _stockDetailLinkPrefix='https://www.ls-x.de/de/aktie/';
    // initial highchart
    var myChart = Highcharts.chart('treeMapContainer', {
        colorAxis: {
            minColor: '#FFFFDF',
            maxColor: Highcharts.getOptions().colors[0]
        },
        chart: {
            animation: false
        },
        tooltip: {
            backgroundColor: '#0CFFC5',
            animation: false
        },
        series: [{
            type: 'treemap',
            animation: false,
            layoutAlgorithm: 'squarified',
            data: []
        }],
        plotOptions: {
            treemap: {
                animation: false,
                tooltip: {
                    headerFormat: '<b>{point.name}</b><br>',
                    pointFormat: '<b>{point.name}</b><br>{point.volume} Stk. Ingst: {point.value.toFixed(3)} Euro'+
                    '<br>'+
                    'Preis:{point.priceMin}&lt;{point.price}&lt;{point.priceMax}'
                },
                dataLabels: {
                    crop: true,
                    formatter: function () {
                        return  'Max(€): ' + this.point.priceMax+
                            '<br/>' +
                            'Akt.(€): ' + this.point.price+
                            '<br/>' +
                            'Min(€): ' + this.point.priceMin+
                            '<br/>' +
                            '<b>Kurse: ' + this.point.volume + ' Stk.</b> ' +
                            '<br/>' +
                            '<b>Beitrag: ' + this.point.value.toFixed(3) + ' €</b>'+
                            '<br/>' +
                            '<a href="'+this.point.link+'" target="_blank" style="color: red;font-size: 14px;padding-top: 14px">'+this.point.name+'</a>';
                    },
                    color:'#000'
                }
            }
        },
        title: {
            text: 'Trade Treemap'
        }
    });
    // function used to sort
    function dsc_compare(property) {
        return function (obj1, obj2) {
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value1 - value2;
        }
    }
    // function used to part sort of collection
    function part_sort(array, part_idx) {
        return Array.prototype.concat(
            array.slice(0, part_idx).sort(dsc_compare('value', true)),
            array.slice(part_idx))
    }
    //function to update the dataCollection of myChart
    var updateTopCollection = function (obj) {
        var _idx = _topCollection.findIndex(function (o) {
            return o.name === obj.name;
        });
        if (_idx != -1) {
            _topCollection[_idx].value += obj.value;
            _topCollection[_idx].volume += obj.volume;
            _topCollection[_idx].price = obj.price;
            if(obj.price<_topCollection[_idx].priceMin){
                _topCollection[_idx].priceMin=obj.price;
            }
            if(obj.price>_topCollection[_idx].priceMax){
                _topCollection[_idx].priceMax=obj.price;
            }
            _topCollection = part_sort(_topCollection, _idx);
        } else {
            _topCollection.push(obj);
            if (obj.value > _lastMinValue) {
                _topCollection.sort(dsc_compare('value', true));
            }
        }
        _lastMinValue = _topCollection[0].value;
    };
    //function to update the DataSeries of myChart
    var funcUpdateDataSeries = function () {
        var _series = myChart.series[0];
        var _iteration_max = _topCollection.length >= _topMaxLength ? _topMaxLength : _topCollection.length;
        var _tops = _topCollection.slice(-1 * _iteration_max);
        for (var i = 0; i < _iteration_max; i++) {
            var _p = {
                name: _tops[i].name,
                value: _tops[i].value,
                price: _tops[i].price,
                volume: _tops[i].volume,
                link: _tops[i].link,
                priceMax: _tops[i].priceMax,
                priceMin: _tops[i].priceMin,
                colorValue: _iteration_max - i
            };
            if (_series.data[i]) {
                _series.data[i].update(_p);
            } else {
                _series.addPoint(_p);
            }

        }
    };
    // function to parse the price string that with currency symbol in it.
    var funcParsePriceString = function (s) {
        return parseFloat(s.replace('.', '').replace(',', '.').replace('€', ''));
    };
    $('#resetChart').on('click',function(){
            _lastMinValue=0;
            _topCollection=[];
        });
    // bind the DOMNodeInserted and handle the update of the topCollection and the chart
    _tradeTable.on('DOMNodeInserted', function (e) {
        var _firstRow=$(this).find("tbody tr").eq(1);
        var _tdArray = _firstRow.children().toArray();
        var _stockKey = _firstRow.attr('id');
        var _obj = {
            date: _tdArray.pop().innerText,
            volume: parseInt(_tdArray.pop().innerText),
            price: funcParsePriceString(_tdArray.pop().innerText),
            priceMin:0,
            priceMax:0,
            link:_stockDetailLinkPrefix+_stockKey.replace('i',''),
            name: _tdArray.pop().innerText
        };
        _obj.value = parseFloat(_obj.volume * _obj.price.toFixed(3));
        _obj.priceMin=_obj.price;
        _obj.priceMax=_obj.price;
        updateTopCollection(_obj);
        funcUpdateDataSeries();
        $('#updateDate').text(_obj.date);
    });
})();