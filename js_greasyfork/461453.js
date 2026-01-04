// ==UserScript==
// @name         CSGO选品工具-BUFF/STEAM
// @icon         https://csgo.isfunc.cn/favicon.ico
// @version      1.04
// @description  ISFUNC出品的一款免费用于csgo饰品选品的脚本
// @homepageURL  http://csgo.isfunc.cn
// @author       ISFUNC
// @match        https://csgo.isfunc.cn/options.html
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @namespace    http://csgo.isfunc.cn/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461453/CSGO%E9%80%89%E5%93%81%E5%B7%A5%E5%85%B7-BUFFSTEAM.user.js
// @updateURL https://update.greasyfork.org/scripts/461453/CSGO%E9%80%89%E5%93%81%E5%B7%A5%E5%85%B7-BUFFSTEAM.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var ajaxTimeout = 20000;
    var _time = 1665651797822;
    var steam_query_type = true;
    var page = 1;
    GM_registerMenuCommand('插件官网', () => {
        window.open("http://csgo.isfunc.cn");
    });
    GM_registerMenuCommand('交流QQ群', () => {
        window.open("https://qm.qq.com/cgi-bin/qm/qr?k=u0i4cGaj7XsLMP6oA1jNRfkcF_pZy1Km&jump_from=webapi&authKey=GrU4U1RxilAlIO+OAjzeN5YpYW0OF3G/JIInXqcgTZxcBIfLG0psgdk+VoL9BIoG");
    });

    var init = async () => {
        //显示页面
        $('#main').show();
        $('#noscript').hide();
    }
    init();
    $('#searchBtn').click(function () {
        //清空列表
        $('#table').html('')
        page = 1;
        query();
    })



    function query() {
        //获取搜索条件
        let name, sell_num, sell_min_price, sell_max_price, category_group, exterior
        name = $('#name').val();
        sell_num = $('#sell_num').val();
        sell_min_price = $('#sell_min_price').val();
        sell_max_price = $('#sell_max_price').val();
        category_group = $('#category_group').val();
        exterior = $('#exterior').val();

        //拼接BUFF查询语句
        let buff_query_url = `https://buff.163.com/api/market/goods?game=csgo&page_num=${page}&category_group=${category_group}&search=${name}&min_price=${sell_min_price}&max_price=${sell_max_price}&exterior=${exterior}&page_size=10`


        GM_xmlhttpRequest({
            url: buff_query_url,
            timeout: ajaxTimeout,
            method: "get",
            onload: function (res) {
                if (res && res.status == 200) {
                    let jsonObj = JSON.parse(res.responseText);
                    if (jsonObj.error) {
                        alert("BUFF:" + jsonObj.error)
                    } else {
                        let data = jsonObj.data
                        let total_page = data.total_page
                        //创建分页
                        createPage(total_page)
                        //创建列表
                        createTable(data.items)
                    }

                }
            }
        });
    }
    //创建列表
    function createTable(lists) {
        lists.forEach((val, index) => {
            let proportion = $('#proportion').val()
            let exchange = $("#exchange").val();
            //steam 挂刀收益
            // let steam_income = ((+val.sell_min_price / +exchange * 0.85 - +val.goods_info.steam_price) / +val.goods_info.steam_price).toFixed(2);
            // let buff_income = ((+val.goods_info.steam_price * +proportion - +val.sell_min_price) / +val.sell_min_price).toFixed(2);
            let steam_income = ((+val.sell_min_price / +exchange  - +val.goods_info.steam_price)* 0.85).toFixed(2)
            let buff_income = (+val.goods_info.steam_price * +proportion - +val.sell_min_price).toFixed(2)
            //读取配置是否获取挂刀负收益
            let gd = $("input[name='gd']:checked").length;

            //读取配置是否获取变现负收益
            let bx = $("input[name='bx']:checked").length;
            let add_type = false
            if (!gd && !bx) {
                console.log(1)
                add_type = true
            } else if (!bx && gd && +steam_income > 0) {
                console.log(2)
                add_type = true
            } else if (!gd && bx && +buff_income > 0) {
                console.log(3)
                add_type = true
            }
            if (add_type) {
                let html = `<tr>
                <th>${val.name}</th>
                <td>${val.sell_num}</td>
                <td>${val.sell_min_price}</td>
                <td id="buff_want_${index}">获取中</td>
                <td id="buff_want_max_${index}">获取中</td>

                <td>${val.goods_info.steam_price}|${(val.goods_info.steam_price * proportion).toFixed(2)}</td>

                <td id="steam_median_${index}"}>获取中</td>

                <td id="steam_sales_${index}">获取中</td>
                <td ><button class="btn" id="steam_want_btn_${index}">获取中</button><div id="steam_want_${index}" style="display:none"></div></td>
                <td id="steam_income_${index}">${steam_income}</td>
                <td id="buff_income_${index}">${buff_income}</td>
                <td>
                    <a target="_blank" href="${val.steam_market_url}">steam市场</a>
                    <br>
                    <br>
                    <a target="_blank" href="https://buff.163.com/goods/${val.id}">buff市场</a>
                </td>
            </tr>`
                $('#table').append(html);
                getBuffOtherInfo(val.id, index);
                let query_index = setInterval(() => {
                    if (steam_query_type) {
                        getSteamOtherInfo(val.steam_market_url, val.market_hash_name, index)
                        clearInterval(query_index)
                    }
                }, 200)
            }

        });

    }
    //创建分页
    function createPage(total_page) {
        let pageHtml = `
        <div class="col-sm-12 col-md-7">
            <div class="dataTables_paginate paging_simple_numbers"
                id="datatable-buttons_paginate">
                <div class="dataTables_info" id="datatable-buttons_info" role="status"
                aria-live="polite">第${page}页，共${total_page}页</div>
                <ul class="pagination">
                    <li class="paginate_button page-item previous"
                        id="previous"><a href="#"
                            aria-controls="datatable-buttons" data-dt-idx="0"
                            tabindex="0" class="page-link">上一页</a></li>
                    <li class="paginate_button page-item next"
                        id="next"><a href="#"
                            aria-controls="datatable-buttons" data-dt-idx="7"
                            tabindex="0" class="page-link">下一页</a></li>
                </ul>
            </div>
        </div>`
        $('#page').html('');
        $('#page').append(pageHtml)
        $('#previous').click(function () {
            //清空列表
            $('#table').html('')
            if (page != 1) {
                page--;
                query();
            }

        })
        $('#next').click(function () {
            //清空列表
            $('#table').html('')
            page++;
            query();
        })
    }
    //获取BUFF其他信息
    function getBuffOtherInfo(good_id, index) {
        //读取BUFF求购信息
        GM_xmlhttpRequest({
            url: `https://buff.163.com/api/market/goods/buy_order?game=csgo&goods_id=${good_id}&page_num=1&_=1664183539511&page_size=5`,
            timeout: ajaxTimeout,
            method: "get",
            onload: function (res) {
                if (res.status == 200) {
                    let json = JSON.parse(res.responseText);
                    let items = json.data.items
                    let str = '';
                    items.forEach(v => {
                        str += `金额：${v.price} - 数量:${v.num} <br>`
                    })
                    $("#buff_want_" + index).html(str)
                    $("#buff_want_max_" + index).html(items[0].price || 0)
                }
            }
        });
    }
    //获取STEAM其他信息
    async function getSteamOtherInfo(steam_link, hash_name, index) {
        //因STEAM容易请求频繁 固加锁
        //增加定时防止下列出问题
        let q = setTimeout(() => {
            steam_query_type = true
        }, 2000)
        steam_query_type = false
        let steam_item_id = await getItemId(steam_link)
        getSteamSoldNumber(hash_name, index)
        getSteamWantInfo(steam_item_id, index)
        clearTimeout(q)
        sleep(500)
        steam_query_type = true
    }

    //获取item_id
    function getItemId(steam_link) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                url: steam_link,
                timeout: ajaxTimeout,
                method: "get",
                onload: function (res) {
                    if (res.status == 200) {
                        let html = res.responseText;
                        let steam_item_id = 0;
                        try {
                            steam_item_id = /Market_LoadOrderSpread\(\s?(\d+)\s?\)/.exec(html)[1];
                        } catch (error) {

                        }
                        resolve(steam_item_id);
                    }
                }
            });
        });
    }
    //获取24小时销量
    function getSteamSoldNumber(hash_name, index) {
        GM_xmlhttpRequest({
            url: `https://steamcommunity.com/market/priceoverview/?appid=730&currency=3&market_hash_name=${hash_name}`,
            timeout: ajaxTimeout,
            method: "get",
            onload: function (res) {
                let json;
                let volume = 0
                let median_price = 0
                if (res.status == 200) {
                    json = JSON.parse(res.responseText);
                    if (json.success) {
                        if (!json.volume) {
                            volume = 0
                            median_price = 0
                        } else {
                            volume = json.volume
                            median_price = json.median_price
                        }

                        $("#steam_median_" + index).html(median_price)
                        $("#steam_sales_" + index).html(volume)
                    }
                } else {
                    $("#steam_median_" + index).html("-")
                    $("#steam_sales_" + index).html("-")
                }

            }
        });
    }
    //获取steam求购
    function getSteamWantInfo(steam_item_id, index) {
        GM_xmlhttpRequest({
            url: `https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=3&item_nameid=${steam_item_id}&two_factor=0`,
            timeout: ajaxTimeout,
            method: "get",
            onload: function (res) {
                if (res.status == 200) {
                    let json = JSON.parse(res.responseText);
                    $("#steam_want_" + index).html(json.buy_order_table)
                    $("#steam_want_btn_" + index).html("点我查看")
                    $("#steam_want_btn_" + index).click(() => {
                        $("#steam_want_" + index).show()
                        $("#steam_want_btn_" + index).hide()
                    })
                }
            },
        });
    }
    function sleep(e) {
        var t = (new Date).getTime();
        while ((new Date).getTime() < t + e);
    }
})();