// ==UserScript==
// @name        Enhanced sonkwo
// @namespace   https://greasyfork.org/users/726
// @description 为杉果网站增加若干实用功能，包括：在线提取序列号，显示杉果历史最低价，匹配Steam链接
// @author      Deparsoul
// @include     https://www.sonkwo.com/products/*
// @icon        https://www.sonkwo.com/favicon.ico
// @version     20171219
// @run-at      document-end
// @require     http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @reqt
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/29338/Enhanced%20sonkwo.user.js
// @updateURL https://update.greasyfork.org/scripts/29338/Enhanced%20sonkwo.meta.js
// ==/UserScript==

var product_id = /products\/(\d*)/.exec(location.href)[1];
var game_id = /game_id=(\d*)/.exec(location.href);
if (game_id === null)
    game_id = product_id;
else
    game_id = game_id[1];

function getToken(j) {
    var ret;
    //console.log(j);
    jQuery.ajax({
        url: "/oauth2/token.json",
        method: "POST",
        async: false,
        contentType: "application/json, text/plain, */*",
        data: j,
        complete: function (d) {
            if (d.status == '401') {
                ret = 401;
            } else
                ret = d.responseJSON;
        }
    });
    return ret;
}

function refresh() {
    var rt = GM_getValue("refresh_token");
    var j = getToken(JSON.stringify({'grant_type': 'refresh_token', 'refresh_token': rt}));
    if (j == 401) {
        if (update() === false)
            return false;
        refresh();
    } else if (j.access_token) {
        GM_setValue("refresh_token", j.refresh_token);
        GM_setValue("access_token", j.access_token);
    } else alert(j.message);
}

function update() {
    var un = GM_getValue("user_name");
    var up = GM_getValue("user_pwd");
    if (!un) {
        un = prompt("请输入杉果账号");
        up = prompt("请输入密码");
    }
    if (!un) {
        return false;
    }
    var j = getToken(JSON.stringify({'grant_type': 'password', 'login_name': un, 'password': up, 'type': 'client'}));
    if (j.access_token) {
        GM_setValue("user_name", un);
        GM_setValue("user_pwd", up);
        GM_setValue("refresh_token", j.refresh_token);
        GM_setValue("access_token", j.access_token);
    } else {
        if (confirm(j.message)) {
            un = prompt("请输入杉果账号");
            up = prompt("请输入密码");
            GM_setValue("user_name", un);
            GM_setValue("user_pwd", up);
            update();
        } else {
            return false;
        }
    }
}

function getKey() {
    var at = GM_getValue("access_token");
    //console.log("at "+at);
    var rep;
    if (!at)
        refresh();
    else {
        jQuery.ajax({
            url: "https://www.sonkwo.com/api/game_key.json",
            data: {'game_id': game_id, 'access_token': at},
            mthod: 'get',
            async: false,
            complete: function (data) {
                if (data.status == 401)
                    refresh();
                rep = data;
            }
        });
        var keys = rep.responseJSON;
        if (keys.game_keys) {
            keys = keys.game_keys;
            var div = jQuery('<div id="serial_number" style="display:none;margin-top:10px;margin-bottom:10px;"></div>');
            for (var i = 0; i < keys.length; ++i) {
                var d = keys[i];
                div.append('<input type="text" style="width:210px;" onfocus="this.select();" value="' + d.code + '" /> ' + d.type_desc);
            }
            jQuery('.game-actions').after(div);
            div.slideDown();
        } else if (rep.status === 401) {
            if (refresh() !== false)
                getKey();
        } else alert(keys.message);
    }
}

function clear() {
    if (!confirm("清除账号数据？"))
        return;
    GM_deleteValue("user_name");
    GM_deleteValue("user_pwd");
    GM_deleteValue("refresh_token");
    GM_deleteValue("access_token");
    alert("已清除");
}

jQuery(function() {
    window.setTimeout(function () {
        var o = jQuery("span.sale-block");
        console.log(o);
        if (o) {
            if (o.length > 0) {
                o.replaceWith('<a id="get_serial_number" class="sale-block" title="已拥有" style="width:120px;background-color:green;">点击提取序列号</a> <a id="clear_user" class="sale-block" style="width:90px;background-color:red;float:left;">清除账号数据</a>');
                jQuery('#get_serial_number').click(function () {
                    getKey();
                });
                jQuery('#clear_user').click(function () {
                    clear();
                });
            }

            if (jQuery('.game-content-container').text().search('【Steam】本游戏运行需通过') <= 0) {
                jQuery('.game-sale-card .game-info').append(' <span style="color:red;font-weight:bold;">注意：本游戏可能不提供Steam激活，购买前请确认</span>');
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: 'https://steamdb.steamcn.com/sonkwo/' + product_id + '.dat',
                onload: function (response) {
                    var data = JSON.parse(response.responseText);
                    //console.log(response);
                    if (data.id) {
                        if (data.steam) {
                            jQuery('.game-header-left>p').wrapInner('<a style="display:inline;" href="' + data.steam + '"></a>');
                            jQuery.getScript("https://steamdb.steamcn.com/steam_info.js?v=2");
                        }
                        var label = '';
                        var price = '';
                        if (data.price_lowest) {
                            label += '杉果';
                            price += '￥' + data.price_lowest.toFixed(2);
                        }
                        if (data.steam_lowest) {
                            if (label) label += ' / ';
                            if (price) price += ' / ';
                            label += '其他商店';
                            price += '$' + data.steam_lowest.toFixed(2);
                        }
                        if (label && price) {
                            label += '历史最低价';
                            jQuery('.game-misc-info').append('<div class="info-item"><div class="item-label" style="width:160px;">' + label + '</div><div class="item-content" style="width:140px;font-weight:bold;color:#000;text-align:center;">' + price + '</div></div>');
                        }
                    }
                }
            });
        }
        } ,3000);
});


