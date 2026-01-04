// ==UserScript==
// @name         dmm 换算人名币
// @namespace    http://94cat.com/
// @version      0.9
// @description  dmm 日元价格转换成人民币显示
// @author       Bmm
// @match        https://www.dmm.co.jp/digital/*
// @match        https://www.dmm.co.jp/search/*
// @match        https://cashier.dmm.co.jp/choice/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/395652/dmm%20%E6%8D%A2%E7%AE%97%E4%BA%BA%E5%90%8D%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/395652/dmm%20%E6%8D%A2%E7%AE%97%E4%BA%BA%E5%90%8D%E5%B8%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var fx = 18.99; //2023年3月26日

    //初始化date fx
    var now = new Date();
    var date = now.getDate();
    if (GM_getValue('date', '') == '') {
        GM_setValue('date', -1);
        GM_setValue('fx', fx);
    }

    //显示价格元素的选择器
    var DOM = '.price, '; //默认价格选择器
    DOM += '.tx-price,'; //打折状态下
    DOM += '.tx-lt,'; //打折前价格
    DOM += '#side-rank-tab .red,'; //二级分类下，右侧列表价格
    DOM += '.package-item_plice,';
    DOM += '#tr_bmm_price,'; //翻译扩展使用
    DOM += '.choice-totalAmount__txt'; //结算界面

    //页面监控到变动，运行 Start()
    var config = { childList: true, subtree: true };
    var $node = $('#mu')[0];
    var observer = new MutationObserver(Start);

    //跨域获取日本汇率API
    if (GM_getValue('date') != date) {
        console.log('开始请求汇率');
        GM_xmlhttpRequest({
            method: "GET",
            //url: 'http://hq.sinajs.cn/list=fx_sjpycny',//TODO
            url: 'https://api.exchangerate-api.com/v4/latest/CNY',
            responseType: "json",
            onload: function (response) {
                //获取新汇率
                //fx = response.response.split(',')[1];
                fx = response.response.rates.JPY;
                if(fx != undefined)
                {
                    GM_setValue("date", date);
                    GM_setValue("fx", fx);
                    console.log('使用日元->人名币汇率: ' + fx);
                }
                Start();
            },
            onerror: function () { fx = GM_getValue('fx'); Start(); },
            ontimeout: function () { fx = GM_getValue('fx'); Start(); }
        });
    } else {
        fx = GM_getValue('fx');
        console.log('使用日元->人名币汇率: ' + fx);
        Start();
    }

    function Start() {
        observer.disconnect(); //暂停页面监控
        $(DOM).not(".is_rmb").each(function () {
            var $this = $(this);
            if($this.find(".salecount").length){
                $this.find(".salecount").remove();
            }
            $this.addClass('is_rmb'); //修改的数据添加标记，下次跳过
            //打折
            if ($this.find('.tx-hangaku').length > 0) { $this = $this.find('.tx-hangaku'); }
            //列表
            if ($this.find('.normal').length > 0) { $this = $this.find('.normal'); }
            var price = $this.html();
            price = price.replace(/[^0-9]/ig, "");
            price = new Number(price / fx);
            $this.html(price.toFixed(2) + '元');
        });
        observer.observe($node, config); //开启页面监控
    }
})();