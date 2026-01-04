// ==UserScript==
// @name         patriarhia parserr
// @namespace    tuxuuman:patriarhia.ru:parser
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://map.patriarhia.ru/*
// @grant        none
// @run-at       document-idle
// @require      https://greasyfork.org/scripts/36451-x2js/code/x2js.js?version=237940
// @downloadURL https://update.greasyfork.org/scripts/37493/patriarhia%20parserr.user.js
// @updateURL https://update.greasyfork.org/scripts/37493/patriarhia%20parserr.meta.js
// ==/UserScript==




(function() {
    'use strict';

     var asyncEach = function(items, next, callback) {
         if (!Array.isArray(items)) throw new TypeError('each() expects array as first argument');
         if (typeof next !== 'function') throw new TypeError('each() expects function as second argument');
         if (typeof callback !== 'function') callback = Function.prototype; // no-op

         if (items.length === 0) return callback(undefined, items);

         var transformed = new Array(items.length);
         var count = 0;
         var returned = false;

         items.forEach(function(item, index) {
             next(item, function(error, transformedItem) {
                 if (returned) return;
                 if (error) {
                     returned = true;
                     return callback(error);
                 }
                 transformed[index] = transformedItem;
                 count += 1;
                 if (count === items.length) return callback(undefined, transformed);
             });
         });
     };

    function parseToken() {
        var str = get_info.toString();
        var m = str.match(/token=([a-z0-9]+)/i);
        if(m) return m[1];
        else return null;
    }

    var token = parseToken();

    jQuery(`
<div id="parserToolbar" style="padding: 3px 10px;">
  <button id="btnStartParsing">Начать парсинг</button>
  <progress value="0" max="100">Text</progress>
  <p align="center">
    <b id="status"></b>
  </p>
  <button id="btnExportData">Выгрузить данные</button>
</div>`).insertAfter('.map-all-filters tr#box-head');

    var toolbar = jQuery('.map-all-filters #parserToolbar');
    var btnStartParsing = toolbar.find('#btnStartParsing').get(0);
    var btnExportData = toolbar.find('#btnExportData').get(0);
    var progressbar = toolbar.find('progress');
    var status = toolbar.find('#status');

    btnExportData.disabled = true;
    progressbar.hide();

    var x2js = new X2JS({
        attributePrefix : "$"
    });

    function toXML(obj, rootName) {
        if(!rootName || typeof(rootName) != "string") rootName = "data";
        var xmlText = '<?xml version="1.0" encoding="UTF-8"?>';
        var newObj = {};
        newObj[rootName] = obj;
        xmlText +=x2js.json2xml_str(newObj);
        return xmlText;
    }

    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                                                    function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    }

    function getListItems(){
        var result = [];
        jQuery('#box-list-items>li>a').each(function(){
            result.push(parseInt(this.id.substr(1)));
        });
        return result;
    }


    btnStartParsing.onclick = function() {
        var ids = getListItems();

        if(!ids) {
            alert("Нет объектов на карте");
        }

        progressbar.attr('max', ids.length);
        progressbar.val(0);
        let pb = progressbar.get(0);
        progressbar.show();
        btnStartParsing.disabled = true;
        btnExportData.disabled = true;
        status.text('Парсим..');

        asyncEach(
            ids,
            function(id, cb) {
                getInfo(id, function (data, error){

                    if(error){
                        cb(error, null);
                        return;
                    }

                    var jDom = jQuery(data);
                    var info = {};
                    info.name = jDom.find('h1>a').text();
                    info.phones = {
                        phone: parsePhone(jDom)
                    };
                    info.phones['$count'] = info.phones.phone.length;
                    info.email = jDom.find("li>span:contains('E-mail')~span").text();
                    info.site = jDom.find("li>span:contains('Сайт')~span").text();
                    info.address = jDom.find("li>span:contains('Адрес')~span").text();
                    info.utensils = jDom.find("li>span:contains('Принадлежность')~span").text();
                    pb.value++;
                    cb(error, info);
                });
            },
            function(error, dataList){
                if(error) console.error("asyncEach", error);
                else {
                    btnExportData.onclick = function() {
                        var url = 'data:application/xml;base64,'+ b64EncodeUnicode(toXML({card: dataList, $count: dataList.length}, 'cards'));
                        window.open(url, 'XML data' +Date.now());
                        status.text('');
                        btnExportData.onclick = null;
                        btnExportData.disabled = true;
                    };
                    btnStartParsing.disabled = false;
                    btnExportData.disabled = false;
                    status.text('Данные загружены');
                    progressbar.hide();
                }
            }
            );
    };

    function parsePhone(jDom) {
        var phones = [];
        jDom.find("li>span:contains('Телефон')~span").each(function(i) {
            phones.push(jQuery(this).text());
        });
        return phones;
    }

   function getInfo(id, cb) {
        if (url_mode && url_mode===undefined) url_mode=0;
        jQuery.ajax({
            type: "GET",
            url: "/api/index.php",
            data: {
                token: token,
                id: id,
                m: "info",
                msg: 1,
                urlmode: url_mode,
                lang: "ru"
            },
            dataType: "html",
            cache: false,
            success: function (data) {
                if (data != "ERROR") {
                    cb(data, null);
                } else {
                    console.error('DATA_ERROR _getInfo. id =' + id, data);
                    cb(data, 'DATA_ERROR _getInfo. id =' + id);
                }
            },
            error: function(err) {
                console.error('ERROR _getInfo. id =' + id, err);
                cb(null, err);
            }
        });
    };
})();