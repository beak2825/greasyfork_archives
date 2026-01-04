// ==UserScript==
// @name         筛选助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  筛选游戏账号
// @author       Dylion
// @match        https://da.dd373.com/*
// @match        https://www.dd373.com/*
// @match        http://www.youxige.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/430701/%E7%AD%9B%E9%80%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/430701/%E7%AD%9B%E9%80%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log(window.location.href);
    if(window.location.href == 'https://www.dd373.com/' || window.location.href =='https://da.dd373.com/Account/Index' ){//DD373
        window.location.href='https://www.dd373.com/s-rbg22w-c-9mkte9.html';//跳转至》找回包赔账号首页
    }
    if(window.location.origin == 'https://www.dd373.com'){//DD373
        var game_title = document.getElementsByClassName("game-account-flag");//获取列表标题
        var goods_prices = document.getElementsByClassName("goods-price");//获取对应价格
        var l = game_title.length;//列表数量
        var game_href = "";//列表对应链接
        var goods_price = "";//单个价格
        for (let i = 0; i < l; i++) {
            goods_price=goods_prices[i].innerText //获取单个价格
            goods_price =goods_price.replace("￥","");//去掉￥字
            console.log(goods_price);//console 控制台调试信息
            if(parseInt(goods_price) <= 400 && game_title[i].innerText.indexOf('穿越') != -1){//判断条件
                game_title[i].style.color = "red";//标题文字显示红色
                game_href = document.getElementById("title"+String(i)).click();//单击链接
            }
        }
    }
    if(window.location.href == 'http://www.youxige.com/' || window.location.href == 'http://www.youxige.com/index.aspx'){//游戏阁
        window.location.href='http://www.youxige.com/goods_search.aspx?category_id=0&role_id=0&bprice=0&eprice=999&channel_name=goods&bno=&keyword=&zh=up&pc=up';
    }
    if(window.location.origin == 'http://www.youxige.com'){//游戏阁
        var yxg_game_title=$('.yipai_le .yp_letit p'); //获取列表标题
        var all_sp=$('.yipai_le .yp_lecon1 p'); //获取浏览量
        var yxg_a = $('.pli_yipai a');//获取 pli_yipai 的 a连接href
        //console.log(yxg_a);
        var n =0;
        var m =0;
        var p =0;
        //var yxg_game_title = document.getElementsByClassName("yp_letit");//获取列表标题
        var yxg_number = yxg_game_title.length;//列表数量
        for (let i = 0; i < yxg_a.length /3; i++) {
            //console.log(i + " "+ all_sp[i].innerText);
            p = 3 + 3*(i-1);
            //console.log(yxg_a[p].href);
            //console.log(p);
        }
        var yxg_game_href = "";//列表对应链接
        var yxg_goods_price = "";//单个价格
        var yxg_goods_prices = document.getElementsByClassName("yipai_ce_p1");//获取对应价格

        for (let i = 0; i < yxg_number; i++) {
            n = 6 + 4*(i-1);
            m = 5 + 4*(i-1);
            p = 3 + 3*(i-1);
            yxg_goods_price=yxg_goods_prices[i].innerText //获取单个价格
            yxg_goods_price =yxg_goods_price.replace("￥","");//去掉￥字
            //第一个条件“价格 <=400”&& 后是第二第三条件 过滤有人脸 第四个条件 浏览量<=500 第五第六 过滤跨1 跨6的号
            if(parseInt(yxg_goods_price) <= 400 && yxg_game_title[i].innerText.indexOf('真人人脸') == -1 && yxg_game_title[i].innerText.indexOf('有人脸') == -1  && all_sp[n].innerText<= 500 && all_sp[m].innerText.indexOf('跨1') == -1  && all_sp[m].innerText.indexOf('跨6') == -1 ){//判断条件
                yxg_game_title[i].style.color = "red";//标题文字显示红色
                yxg_a[p].click();//单击链接
            }
            console.log(yxg_game_title[i].innerText + "   " + all_sp[n].innerText);//2 5 8
            //console.log(n);
        }
    }
 })();