// ==UserScript==
// @name        hb_subs_info
// @namespace   http://tampermonkey.net/
// @description hb subscription info
// @license     MIT
// @include     http*://www.humblebundle.com/subscription/*
// @include     http*://www.humblebundle.com/membership/*
// @connect     steamdb.info
// @grant       unsafeWindow
// @version     2025.07.24.2
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/461494/hb_subs_info.user.js
// @updateURL https://update.greasyfork.org/scripts/461494/hb_subs_info.meta.js
// ==/UserScript==

var txt, j, csrf, gamekey;

GM_addStyle("table{border:solid 1px;border-collapse:collapse;font-size:16px !important;}");
GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");
GM_addStyle(".d{font-size:16px;color:white !important;}");

var ms = ['december', 'november', 'october', 'september', 'august', 'july', 'june', 'may', 'april', 'march', 'february', 'january'];

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
                if (removedNode.id == 'webpack-subscriber-hub-data' || removedNode.id == 'webpack-monthly-product-data') {
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

// https://www.humblebundle.com/api/v1/subscriptions/humble_monthly/subscription_products_with_gamekeys/
// https://www.humblebundle.com/api/v1/subscriptions/humble_monthly/subscription_products_with_gamekeys/${cursor}

function DOM_ContentReady () {
    var m = /csrf_cookie=([^;]+)(;|$)/.exec(document.cookie);
    if (m)
        csrf = m[1];

    $("body").on('click', '#p', function(){
        GM_setClipboard(txt);
    });

    $("body").on('click', '#p2', function(){
        var txt = '';
        $('#reg2 tr').each(function(){
            $(this).children('td').each(function(){
                txt += $(this).text() + '\t';
            });
            txt += '\n';
        });
        GM_setClipboard(txt);
    });

    var d;
    $('.base-main-wrapper').before('<div style="background-color:#494f5c;" class="d" id="a1"></div>');
    if (txt){
        $('#a1').append('<table id="n"></table>');
        mak();
        $('#a1').append('<p><a id="p">JSON</a></p>');
        j = JSON.parse(txt);
        if (j && j.contentChoiceOptions) {
            /*
            d = new Date(`${new Date(j['subscriptionJoinDate|datetime'])}+00:00`).toLocaleString();
            $('#a1').append(`<p>${d}</p>`);
            d = new Date(`${new Date(j['subscriptionExpires|datetime'])}+00:00`).toLocaleString();
            $('#a1').append(`<p>${d}</p>`);
            */
            var ip = j.ipInChina ? ' | <span style="color:red">ipInChina</span>' : '';
            $('#a1').append(`<p>${j.userOptions.email} | ${j.userOptions.selectedCountry} | ${j.userOptions.selectedRegion}${ip}</p>`);
            if (j.userSubscriptionPlan)
                $('#a1').append(`<p>${j.userSubscriptionPlan.human_name} | ${j.userOptions.payment_credentials[0].credentials_name}</p>`);
            if(j.payEarlyOptions){
                d = new Date(`${new Date(j.payEarlyOptions['activeContentStart|datetime'])} UTC`).toLocaleString();
                $('#a1').append(`<p>${d}</p>`);
                $('#a1').append(`<p>${j.payEarlyOptions.productMachineName}</p>`);
            }
            $('#a1').append(`<p><a target=_blank href="/membership/${j.contentChoiceOptions.productUrlPath}">${j.contentChoiceOptions.title}</a></p>`);
            $('#a1').append('<div id="k"></div>');
            var f = j.contentChoiceOptions.contentChoicesMade ? true : false;
            var iden = 'initial';
            if ( $.inArray('initial-get-all-games', j.contentChoiceOptions.unlockedContentEvents) > -1)
                iden = 'initial-get-all-games';
            gamekey = j.contentChoiceOptions.gamekey;
            if (gamekey){
                $('#k').append(`<p><a target=_blank href="/?key=${gamekey}">${gamekey}</a></p>`);
                $('#k').append(`<p><a href="javascript:void(0);" onclick="parse('${gamekey}');">KEY</a></p>`);
                $('#a1').after('<div id="zo"></div>');
                $('#zo').append('<table id="reg"></table>');
                $('#zo').append('<table id="reg2"></table>');
                $('#zo').append('<table id="reg3"></table>');
                $('#zo').append('<div id="info2" class="d"></div>');
                $('#zo').append('<table id="info"></table>');
                $('#zo').append('<div id="info3" class="d"></div>');
                $('#zo').append('<div><a id="p2">COPY</a></div>');
            } else {
                $('#a1').append(`<a href="javascript:void(0);" onclick="payearly('${j.payEarlyOptions.productMachineName}');">Pay Early</a>`);
            }
            var g, order;
            if (j.contentChoiceOptions.usesChoices) {
                $('#a1').append(`<p>${j.contentChoiceOptions.contentChoiceData[iden].total_choices}</p>`);;
                g = j.contentChoiceOptions.contentChoiceData[iden].content_choices;
                order = j.contentChoiceOptions.contentChoiceData[iden].display_order;

            } else {
                g = j.contentChoiceOptions.contentChoiceData.game_data;
                order = j.contentChoiceOptions.contentChoiceData.display_order;
            }
            $('#a1').append('<table id="b"></table>');
            $('#a1').append(`<p>Key:</p>`);
            $('#a1').append('<table id="c"></table>');
            var n = 1;
            var made= f ? j.contentChoiceOptions.contentChoicesMade[iden].choices_made : [];
            $.each(order, function (i, e) {
                $('#b').append(`<tr id="${e}"></tr>`);
                var claim = '';
                if (f && $.inArray(e, made) > -1)
                    $(`#${e}`).css("background-color", "blue");
                else
                    claim = `<a href="javascript:void(0);" onclick="choice('${gamekey}', '${e}', '${iden}');">Claim</a>`;
                var amount = g[e]['msrp|money'] ? g[e]['msrp|money'].amount : '';
                $(`#${e}`).append(`<td>${(i+1)}</td><td>${g[e].title}<br>${e}</td><td>${amount}</td><td>${g[e].delivery_methods.join()}</td><td>${claim}</td>`);
                if (g[e].tpkds){
                    $.each(g[e].tpkds, function (k, item) {
                        var app = '';
                        var id = item.steam_app_id;
                        if (id)
                            app = `<a target=_blank href="https://steamdb.info/app/${id}/">${id}</a>`;
                        var region = item.key_type;
                        var exc = '<td>-</td>';
                        if (item.exclusive_countries.length){
                            exc = `<td title="${item.exclusive_countries}">List</td>`;
                            region += '+,';
                        }
                        var dis = '<td>-</td>';
                        if (item.disallowed_countries.length){
                            dis = `<td title="${item.disallowed_countries}">List</td>`;
                            region += '-,';
                        }
                        var key = '';
                        var redeem = '';
                        if (item.redeemed_key_val)
                            key = item.redeemed_key_val;
                        else
                            redeem = `<a href="javascript:void(0);" onclick="redeem('${item.machine_name}', '${item.gamekey}', 0, '${item.machine_name}');">Redeem</a>`;
                        $('#c').append(`<tr><td>${(n++)}</td><td>${item.machine_name}</td><td>${item.human_name}</td><td id="${item.machine_name}">${key}</td><td>${app}</td>${exc}${dis}</td><td>${redeem}</td></tr>`);
                    });
                } else if (g[e].nested_choice_tpkds) {
                    var j = 0;
                    $.each(g[e].nested_choice_tpkds, function (k, v) {
                        if (v && v.length > 0) {
                            $.each(v, function (index, item) {
                                claim = `<a href="javascript:void(0);" onclick="choice('${item.gamekey}', '${k}', '${e}');">Claim</a>`;
                                $(`#${e}`).after(`<tr id="${k}"><td>-</td><td>${g[e].title}<br>${e}</td><td>${amount}</td><td>${item.key_type}</td><td>${claim}</td></tr>`);
                                var app = '';
                                var id = item.steam_app_id;
                                if (id)
                                    app = `<a target=_blank href="https://steamdb.info/app/${id}/">${id}</a>`;
                                var region = item.key_type;
                                var exc = '<td>-</td>';
                                if (item.exclusive_countries.length){
                                    exc = `<td title="${item.exclusive_countries}">List</td>`;
                                    region += '+,';
                                }
                                var dis = '<td>-</td>';
                                if (item.disallowed_countries.length){
                                    dis = `<td title="${item.disallowed_countries}">List</td>`;
                                    region += '-,';
                                }
                                var key = '';
                                var redeem = '';
                                if (item.redeemed_key_val)
                                    key = item.redeemed_key_val;
                                else
                                    redeem = `<a href="javascript:void(0);" onclick="redeem('${item.machine_name}', '${item.gamekey}', ${j}, '${item.machine_name}');">Redeem</a>`;
                                j++;
                                $('#c').append(`<tr><td>-</td><td>${item.machine_name}</td><td>${item.human_name}</td><td id="${item.machine_name}">${key}</td><td>${app}</td>${exc}${dis}</td><td>${redeem}</td></tr>`);
                            });
                        }
                    });
                }
            });
            $.each(j.contentChoiceOptions.contentChoiceData.extras, function (i, e) {
                $('#b').append(`<tr><td>${(i+1)}</td><td>${e.human_name}<br>${e.machine_name}</td><td></td><td>${e.types.join()}</td><td></td><td></td></tr>`);
            });
        }
    }
}

function pageFullyLoaded () {
}

function mak() {
    var a;
    for (var j=2025;j>2015;j--){
        if (j == 2019)
            a = $('<tr><td>2019</td><td><a target=_blank href="/membership/december-2019">12</a></td></tr>');
        else
            a = $(`<tr><td>${j}</td><td></td></tr>`);
        $('#n').append(a);
        var b = j > 2019 ? 'membership' : 'monthly/p';
        var c =  j > 2019 ? `-${j}` : `_${j}_monthly`;
        $.each(ms, function(k, v){
            a.append(`<td><a target=_blank href="/${b}/${v}${c}">${12-k}</a></td>`);
        });
    }
    a = $('<tr><td>2015</td><td></td><td><a target=_blank href="/monthly/p/december_2015_monthly">12</a></td><td><a target=_blank href="/monthly/p/november_2015_monthly">11</a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
    $('#n').append(a);
}

unsafeWindow.payearly = function(a){
    $.ajax({
        url: '/membership/payearly',
        type: "POST",
        data : {
            _le_csrf_token : csrf,
            product : a,
        },
        dataType:'json',
        success: function(data){
            // {"success": true, "jobId": "ahFzfmhyLWh1bWJsZWJ1bmRsZXJFCxITUmVjdXJyaW5nUGF5bWVudEpvYiIsNDcwNjEwMTE0MzAxMTMyOC1tYXJjaF8yMDIzX2Nob2ljZS1wYXlfZWFybHkM"}
            if (data.success) {
                job(data.jobId);
            } else {

            }
        },
        error: function(data){
        }
    });
}

var z = 1;
unsafeWindow.job = function(a){
    var k = a;
    $.ajax({
        url: `/membership/payearlystatus/${a}`,
        type: "GET",
        dataType:'json',
        success: function(data){
            // {"inProgress": true, "success": false}
            // {"uidverify": "986ba9d441fa5761d24428085a430c7cd2099b3ceb525236dc771783e4d345e4", "gamekey": "dUBUx4CDGZWeCVez", "order_uid": "APCT6E7TZK1J4", "success": true}
            if (data.success) {
                gamekey = data.gamekey;
                $('#k').append(`<p><a target=_blank href="/?key=${gamekey}">${gamekey}</a></p>`);
                $('#k').append(`<p><a href="javascript:void(0);" onclick="parse('${gamekey}');">KEY</a></p>`);
            } else {
                if (data.inProgress) {
                    setTimeout(job, z++ * 1000, k);
                }
            }
        },
        error: function(data){
        }
    });
}

unsafeWindow.choice = function(a, b, c){
    /*
    https://www.humblebundle.com/api/v1/analytics/content-choice/content-tile/click/march_2021_choice/control
    POST
    https://www.humblebundle.com/humbler/choosecontent
    POST  gamekey=BRHPBYPurSBeEhfP&parent_identifier=initial&chosen_identifiers%5B%5D=control
    POST  gamekey=BRHPBYPurSBeEhfP&parent_identifier=control&chosen_identifiers%5B%5D=control_steam
    */
    $.ajax({
        url: '/humbler/choosecontent',
        type: "POST",
        data : {
            gamekey : a,
            parent_identifier : c,
            'chosen_identifiers[]' : b
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("csrf-prevention-token", csrf);
        },
        dataType:'json',
        success: function(data){
            // {force_refresh: true, success: true}
            // {errors: {_all: ["Invalid request."]}, success: false}
            // {"errors": {"dummy": ["You have no choices remaining. Please refresh this page to see your choices."]}, "success": false}
            if (data.success)
                $(`#${b}`).css("background-color","blue");
            else{
                $(`#${b}`).attr('title', JSON.stringify(data.errors));
                $(`#${b}`).css("background-color","red");
            }
        },
        error: function(data){
            $(`#${b}`).css("background-color","yellow");
        }
    });
}

unsafeWindow.redeem = function(a, b, c, d){
    $.ajax({
        url: `/humbler/redeemkey`,
        type: "POST",
        data: {
            keytype: a,
            key: b,
            keyindex: c
        },
        dataType:'json',
        success: function(data){
            if (data.success)
                $(`#${d}`).append(data.key);
            else{
                $(`#${d}`).append(data.error_msg);
                $(`#${d}`).css("background-color","red");
            }
        },
        error: function(data){
            $(`#${d}`).append('err2');
        }
    });
}

unsafeWindow.parse = function(a){
    $.ajax({
        url: `/api/v1/order/${a}?wallet_data=true&all_tpkds=true&get_coupons=true`,
        type: "GET",
        success: function(data){
            parse2(a, data);
        },
        error: function(data){
            alert('error-key');
        }
    });
}

function parse2(a, data){
    $('#reg').empty();
    $('#reg2').empty();
    $('#info2').empty();
    $('#reg').append('<tr><td>App</td><td>machineName</td><td>app</td><td>sub</td><td>exclusive</td><td>disallowed</td><td>store</td></tr>');
    $('#info2').append(data.amount_spent + '<br>');
    $('#info2').append(data.gamekey + '<br>');
    $('#info2').append(data.uid + '<br>');
    $('#info2').append(data.created + '<br>');
    $('#info2').append(`<a target=_blank href="/api/v1/order/${a}?wallet_data=true&all_tpkds=true&get_coupons=true">JSON</a><br>`);
    $.each(data.tpkd_dict.all_tpks, function (i, item) {
        var app = '';
        var id = item.steam_app_id;
        if (id)
            app = `<a target=_blank href="https://steamdb.info/app/${id}/">${id}</a>`;
        var sub = '';
        var region = item.key_type;
        id = item.steam_package_id;
        if (item.steam_package_id){
            sub = `<a target=_blank href="https://steamdb.info/sub/${id}/info">${id}</a>`;
            region = 'WW,';
        }
        var exc = '<td>-</td>';
        if (item.exclusive_countries.length){
            id = item.exclusive_countries;
            exc = `<td title="${id}">List</td>`;
            region += '+,';
        }
        var dis = '<td>-</td>';
        if (item.disallowed_countries.length){
            id = item.disallowed_countries;
            dis = `<td title="${id}">List</td>`;
            region += '-,';
        }
        var j = ++i;
        id = item.machine_name;
        var king = item.human_name.replace(/ /g, '+').replace(/[^a-z0-9+]/ig, '');
        $('#reg').append(`<tr id="${id}"><td>${j}</td><td>${id}</td><td>${app}</td><td>${sub}</td>${exc}${dis}</tr>`);
        var human = item.human_name;
        var key = '';
        var redeem = '';
        //var key = item.redeemed_key_val ? item.redeemed_key_val : '';
        if (item.redeemed_key_val){
            key = item.redeemed_key_val;
        } else
            redeem = `<a href="javascript:void(0);" onclick="redeem('${item.machine_name}', '${item.gamekey}', ${item.keyindex}, 'k${id}');">Redeem</a>`;
        sub = '';
        if (item.steam_package_id)
            sub = `<td class="db" id="${item.steam_package_id}">${region}${item.steam_package_id}</td>`;
        else
            sub = '<td></td>';
        $('#reg2').append(`<tr><td>${i}</td><td>${human}</td><td id="k${id}">${key}</td><td></td><td></td>${sub}<td>${redeem}</td></tr>`);
    });
}