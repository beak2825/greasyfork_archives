// ==UserScript==
// @name         QbShowIds
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  qb中显示商品id，分类id
// @author       bigHammer
// @match        http://queenbee.m.waimai.test.sankuai.com/reuse/*
// @match        https://qb.waimai.st.sankuai.com/reuse/*
// @match        https://qb.waimai.sankuai.com/reuse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449967/QbShowIds.user.js
// @updateURL https://update.greasyfork.org/scripts/449967/QbShowIds.meta.js
// ==/UserScript==
(function () {
    'use strict'

    console.log('window name is :' + window.name)

    window.ah.proxy({
        onRequest: (config, handler) => {
            //console.log("onRequest"+config.url)
            handler.next(config);
        },
        onError: (err, handler) => {
            console.log(err.type)
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            //console.log("showIds:"+response.config.url)
            handler.next(response)
            if (response.config.url.includes("r/listProduct")
                || response.config.url.includes("r/searchListPage")) {
                //console.log("show ids")
                setTimeout(function () { show(); }, 100);
            }
            if (response.config.url.includes("r/tagList") || response.config.url.includes("r/listTags")) {
                //console.log(response)
                setTimeout(function () { showTags(); }, 1000);
            }
        }
    })

    function show() {
        let url = window.location.href;
        let prefix = url.split('product')[1];
        console.log("show id :",prefix);
        if (prefix.includes('/views')) {
            showScIds('.display')
        }
        if (prefix.includes('/yy')) {
            showYyIds('.product-table-info-name')
        }
    }

    function showPoiId() {
        //console.log('门店id是' + getCookie('wmPoiId'));
        var selector = '.header';
        var info = document.querySelector(selector);
    }

    function showYyIds(itemName) {
        //console.log('showPoiSpuIds')
        var info = window.top.document.querySelector('.table-with-page-table')
        if (info == null) {
            return;
        } else {
            var data = info.__vue__.data;
            var spuList = document.querySelectorAll(itemName);
            var length = spuList.length;
            for (var i = 0; i < length; i++) {
                var name = data[i].name;
                var id = data[i].id;
                spuList[i].innerText = name + ":" + id;
            }
        }
    }

        function showScIds(itemName) {
        //console.log('showPoiSpuIds')
        var info = window.top.document.querySelector('.table-with-page-table')
        if (info == null) {
            return;
        } else {
            var data = info.__vue__.data;
            var spuList = document.querySelectorAll(itemName);
            var length = spuList.length;
            for (var i = 0; i < length;i++) {
                var name = data[i].name;
                var id = data[i].id;
                spuList[i].textContent = id + ":" + name;
            }
        }
    }

    function showTags() {
        //console.log('showTags')
        var tree = window.top.document.querySelector('.tag-tree')
        var tagList = window.top.document.querySelectorAll('.tag-tree-item-desc')
        if (tagList == null) {
            return;
        } else {
            var data = tree.__vue__.dataSource;
            var tagDataArray = [];
            for (var i = 0; i < data.length; i++) {
                tagDataArray.push(data[i])
                if (data[i].children.length != 0) {
                    for (var k = 0; k < data[i].children.length; k++) {
                        tagDataArray.push(data[i].children[k])
                    }
                }
            }
            var length = tagDataArray.length;
            for (var j = 0; j < length; j++) {
                //              var name = tagDataArray[j-1].name;
                var id = tagDataArray[j].id;
                var innerHtml = '<span>&nbsp|分类id:' + id + '</span>';
                tagList[j + 1].innerHTML += innerHtml
            }
        }
    }


    function getCookie(cookie_name) {
        var cookie_name_prefix = cookie_name + "="
        var start = document.cookie.indexOf(cookie_name_prefix)
        if (start == -1) {
            return null;
        }
        var end = document.cookie.indexOf(";", start + cookie_name_prefix.length)
        if (end == -1) {
            end = document.cookie.length;
        }
        var value = document.cookie.substring(start + cookie_name_prefix.length, end)
        return unescape(value);
    }

})()