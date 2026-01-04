// ==UserScript==
// @name        hb_bundle_info
// @namespace   http://tampermonkey.net/
// @description hb bundle info
// @license     MIT
// @include     http*://www.humblebundle.com/games/*
// @include     http*://www.humblebundle.com/software/*
// @connect     steamdb.info
// @grant       unsafeWindow
// @version     2025.04.23.2
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/461495/hb_bundle_info.user.js
// @updateURL https://update.greasyfork.org/scripts/461495/hb_bundle_info.meta.js
// ==/UserScript==

var m, txt, j;

GM_addStyle("table{border:solid 1px;border-collapse:collapse;font-size:16px !important;}");
GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");
GM_addStyle(".d{background-color:#282c34;font-size:16px;color:white !important;}");

// 选择需要观察变动的节点
const targetNode = document;

// 观察器的配置（需要观察什么变动）
const config = {
    attributes: true, // 开启监听属性
    childList: true, // 开启监听子节点
    subtree: true // 开启监听子节点下面的所有节点
};

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.removedNodes) {
            for (let removedNode of mutation.removedNodes) {
                if (removedNode.id == 'webpack-bundle-page-data') {
                    txt = $.trim(removedNode.text);
                    observer.disconnect();
                    break;
                }
            }
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

window.addEventListener("DOMContentLoaded", DOM_ContentReady);
window.addEventListener("load", pageFullyLoaded);

function DOM_ContentReady () {
    $("body").on('click', '#p', function(){
        GM_setClipboard(txt);
    });

    if (txt){
        j = JSON.parse(txt);
        $('.base-main-wrapper').before('<div class="d" id="a1"></div>');
        $('#a1').append('<p><a id="p">JSON</a></p>');
        if (j && j.bundleData) {
            var r = [];
            $.each(j.exchangeRates, function (i, e) {
                var k = i.split('|')[0];
                r[k] = e;
            });
            j = j.bundleData;
            $('#a1').append(`<p>${j.basic_data.human_name}</p>`);
            $('#a1').append(`<p>${j.machine_name}</p>`);
            //$('#a1').append(`<p>${j.hero_tile.tile_stamp}</p>`);
            //$('#a1').append(`<p>${j.hero_tile.hover_highlights}</p>`);
            //if (j.hero_tile.exclusive_countries)
            //    $('#a1').append(`<p>Inc: ${j.hero_tile.exclusive_countries}</p>`);
            //if (j.hero_tile.disallowed_countries)
            //    $('#a1').append(`<p><span style="color:red;">Exc: ${j.hero_tile.disallowed_countries}</span></p>`);
            //var d = new Date(`${new Date(j.hero_tile['start_date|datetime'])} UTC`).toLocaleString();
            //$('#a1').append(`<p>Start: ${d}</p>`);
            var d = new Date(`${j.basic_data['end_time|datetime']}+00:00`).toLocaleString();
            $('#a1').append(`<p>End: ${d}</p>`);

            m = [];
            $.each(j.tier_pricing_data, function (i, e) {
                m[e.identifier] = e['price|money'];
            });
            $('#a1').append('<table class="d" id="b"></table><br>');
            $('#a1').append('<table class="d" id="c"></table><br>');
            $('#a1').append('<table class="d" id="d"></table>');
            /*
            $.each(j.hero_tile.cached_content_events, function(i, e){
                var id = e.identifier;
                if (m[id])
                    $('#b').append(`<tr><th colspan="9">${id} <span style="color:green;">${m[id].currency} ${m[id].amount}</span></th></tr>`);
                else
                    $('#b').append(`<tr><th colspan="9">${id}</th></tr>`);
                if (e.price){
                    var a, b, c;
                    $.each(e.price, function(j, f){
                        a += `<td>${f[0]}</td>`;
                        b += `<td>${f[1]}</td>`;
                        var v = (f[0] / r[f[1]] * r['CNY']).toFixed(2);
                        c += `<td>${v}</td>`;
                    });
                    $('#b').append(`<tr>${a}</tr><tr>${b}</tr>tr>${c}</tr>`);
                }
            });
            */

            var n = [];
            var q = 1;
            $.each(j.tier_order.reverse(), function (o, v){
                var t = j.tier_pricing_data[v]['price|money'];
                var c = (t.amount / r[t.currency] * r['CNY']).toFixed(2);
                var games = j.tier_display_data[v].tier_item_machine_names;
                var l = games.length - n.length;
                //$('#c').append(`<tr><th colspan="5">${j.tier_display_data[v].header}<br>${t.amount}&nbsp;${t.currency}&nbsp;/&nbsp;${c}&nbsp;CNY</th><tr>`);
                var sp = `<th rowspan="${l}">${j.tier_display_data[v].header}<br>${t.amount}&nbsp;${t.currency}&nbsp;/&nbsp;${c}&nbsp;CNY</th>`;
                var k = 0;
                games.forEach(function (i){
                    var g = j.tier_item_data[i];
                    if ($.inArray(g.machine_name, n) < 0){
                        n.push(g.machine_name);
                        var h = '';
                        if (g.availability_icons){
                            g.availability_icons.delivery_icons.forEach(function (v) {
                                h = `${h}<i class="hb ${v}" />`;
                            });
                        }
                        var sub = '';
                        if (g.exclusive_countries && g.exclusive_countries.length)
                            sub = `<span style="color:green;" title="${g.exclusive_countries}">+</span>`;
                        if (g.disallowed_countries && g.disallowed_countries.length)
                            sub = `${sub} <span style="color:red;" title="${g.disallowed_countries}">-</span>`;
                        var p = '-';
                        if (g['msrp_price|money']){
                            p = `${g['msrp_price|money'].amount} ${g['msrp_price|money'].currency}`;
                        }
                        /*
                        if (g['min_price|money']){
                            p = `${p}<br>${g['min_price|money'].amount} ${g['min_price|money'].currency}`;
                        }
                        */
                        if (k ++ >0)
                            sp = '';
                        $('#c').append(`<tr>${sp}<td>${q++}</td><td>${g.human_name}<br>${g.machine_name}</td><td>${p}</td><td>${h}${sub}</td></tr>`);
                    }
                });
            });

            /*
            r = j.hero_tile.hero_tile_grid_info.displayitem_image_info;
            n = [];
            $.each(j.bonus_data, function (o, e) {
                n.push(e.display_item_machine_name);
                $('#d').append(`<tr><td>${o}</td><td>${e.human_name}<br>${e.display_item_machine_name}</td><td>${e.section_identifier}</td><td>${e.type}</td></tr>`);
            });
            m = [];
            var i = 1;
            $.each(j.slideout_data.display_items, function (o, e) {
                if ($.inArray(o, n) < 0) {
                    var g = [];
                    if (e.availability_icons){
                        e.availability_icons.delivery_icons.forEach(function (v) {
                            g.push(v.replace('hb-', ''));
                        });
                    }
                    var exc = '<td>-</td>';
                    var dis = '<td>-</td>';
                    if (r[o]) {
                        var d = r[o].exclusive_countries;
                        if (d && d.length)
                            exc = `<td title="${d}">List</td>`;
                        d = r[o].disallowed_countries;
                        if (d && d.length)
                            dis = `<td title="${d}">List</td>`;
                    }
                    m[o] = `<td>${e.human_name}<br>${o}</td>${exc}${dis}<td>${g.join()}</td>`;
                }
            });

            $('.dd-game-row').each(function(){
                var t = $(this).find('h2:first').text();
                $('#c').append(`<tr><th colspan="6">${t}</th></tr>`);
                $(this).find('.dd-image-box-figure').each(function(k, v){
                    var o = $(v).attr('data-slideout');
                    $('#c').append(`<tr><td>${i++}</td>${m[o]}</tr>`);
                });
            });
            */
        }
    }
}

function pageFullyLoaded () {
}