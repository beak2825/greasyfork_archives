// ==UserScript==
// @name         价格计算
// @namespace    http://tampermonkey.net/
// @version      v3.0.2
// @description  计算成本价格
// @author       张世杰 :http//www.52zsj.com
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery-ui@1.13.3/dist/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/semantic-ui@2.5.0/dist/semantic.min.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/semantic-ui@2.5.0/dist/semantic.min.css
// @match        *://*.ozon.ru/product/*
// @match        *://*.ozon.ru/category/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/496750/%E4%BB%B7%E6%A0%BC%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/496750/%E4%BB%B7%E6%A0%BC%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        let exchange_rate = localStorage.getItem('exchange-rate');
        console.log('dom🌲节点已经加载完毕可执行价格计算');
        let divObj = $('div.tile-root')
        divObj.each(function (k, v) {
            $(v).find('a').first().attr("target", "_blank")
            let price = $(v).find('span.c306-a1').first().text();
            price = price.replace(/[^\d]/g, '')
            let html = '<span style="padding:0 10px;color:#027aff;font-weight:900">人民币￥:' + (Number(price) * Number(exchange_rate)).toFixed(2) + '</span>'
            $(v).find('span.c306-a1').parent().parent().append(html);
        })
    }
};

(function () {
    'use strict';

    //加载外部CSS，资源已在上方resource中
    var newCSS = GM_getResourceText("customCSS");
    GM_addStyle(newCSS);
    $(document).ready(function () {
        var html = `<style>
    .main {
        width: 380px;
        background: lightskyblue;
        padding: 20px;
        border-radius: 20px;
        max-height: 485px;
        overflow-y: scroll;
        height: auto;
        margin-bottom: 10px;
        position: fixed;
        right: 0;
        top: calc(100vh - 800px);
        z-index: 1000000;
        border-image: initial;
        opacity: .95;
    }

    .main::-webkit-scrollbar {
        display: none;
    }
</style>
<div class="main" id="draggable">
    <div class="ui tiny form">
    <h5 class="ui dividing header">基础内容</h5>
    <div class="inline fields">
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    卢布
                </div>
                <input type="number" class="" id="rubles-price" placeholder="页面金额">
            </div>
        </div>
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    汇率
                </div>
                <input type="number" class="" id="exchange-rate" placeholder="今日汇率">
            </div>
        </div>
    </div>
    <div class="inline fields">
        <div class="sixteen wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    RMB售价
                </div>
                <input type="number" class="" id="sale-price" placeholder="今日汇率" value="0" readonly>

            </div>
        </div>
    </div>
    <h5 class="ui dividing header">货源内容<span style="font-size: 10px;color: red"> 不填写默认值都为0</span></h5>

    <div class="inline fields">
        <div class="ten wide field">
            <div class="ui right labeled input">
                <div class="ui label">
                    价格
                </div>
                <input type="number" id="source-price" placeholder="">
                <div class="ui basic label">
                    元
                </div>
            </div>
        </div>
        <div class="ten wide field">
            <div class="ui right labeled input">
                <div class="ui label">
                    重量
                </div>
                <input type="number" id="goods-weight" placeholder="">
                <div class="ui basic label">
                    g
                </div>
            </div>
        </div>
    </div>
    <div class="inline fields">
        <div class="sixteen wide field">
            <div class="ui right labeled input">
                <input type="number" id="long" placeholder="长">
                <div class="ui basic label">
                    厘米
                </div>
                <input type="number" id="wide" placeholder="宽">
                <div class="ui basic label">
                    厘米
                </div>
                <input type="text" id="high" placeholder="高">
                <div class="ui basic label">
                    厘米
                </div>
            </div>
        </div>
    </div>
    <div>
        <div id="compute-result">

        </div>
    </div>
</div>
</div>`;

        $("body").append(html);

        var channel_data = [{
            'service': "CEL Extra Small Economy",
            'warehouse': "CEL超小包-经济",
            'price': 3.34,
            'coefficient': 25.72,
            'max_size': 90,
            'max_weigh': 500,
            'is_ceil_weigh': false,
            'max_sale_price': 1500,
            'remark': '货值不超过1500卢布',
        }, {
            'service': "CEL Extra Small Standard",
            'warehouse': "CEL超小包-标准",
            'price': 3.34,
            'coefficient': 37.22,
            'max_size': 90,
            'max_weigh': 500,
            'is_ceil_weigh': false,
            'max_sale_price': 1500,
            'remark': '货值不超过1500卢布',
        },

            {
                'service': "CEL Economy Small",
                'warehouse': "CEL-小件",
                'price': 13,
                'coefficient': 29,
                'max_size': 90,
                'max_weigh': 500,
                'is_ceil_weigh': false,
                'max_sale_price': 10000,
                'remark': '货值不超过10000卢布',
            }, {
                'service': "CEL Economy",
                'warehouse': "CEL大件",
                'price': {
                    'self_pickup': 18, 'send_house': 21.5,
                },
                'coefficient': {
                    'self_pickup': 46, 'send_house': 46,
                },
                'max_size': 0,
                'max_weigh': 25000,
                'is_ceil_weigh': true,
                'max_sale_price': 500000,
                'remark': '不超过500000卢布,最大尺寸:150*80*80cm',
            }];
        // 对象按照制定顺序排序
        let rubles_price_obj = $("#rubles-price")
        let exchange_rate_obj = $("#exchange-rate")
        let sale_price_obj = $("#sale-price")
        let source_price_obj = $("#source-price")
        let goods_weight_obj = $("#goods-weight")
        let long_obj = $("#long")
        let wide_obj = $("#wide")
        let high_obj = $("#high")

        // 拖拽
        $("#draggable").draggable({cursor: "move"});

        // 获取存在的汇率
        let _exchange_rate = localStorage.getItem('exchange-rate');
        if (_exchange_rate) {
            exchange_rate_obj.val(_exchange_rate)
        }
        // 更新汇率数据
        exchange_rate_obj.blur(function () {
            let exchange_rate = $(this).val();
            localStorage.setItem('exchange-rate', exchange_rate)
        })

        $(document).on('input propertychange', 'input', function () {
            calculation();
        })


        function calculation() {
            // 全部重新计算
            let rubles_price = rubles_price_obj.val();
            rubles_price = Number(rubles_price);
            let exchange_rate = exchange_rate_obj.val();
            exchange_rate = Number(exchange_rate);
            let source_price = source_price_obj.val();
            source_price = Number(source_price);
            let goods_weight = goods_weight_obj.val();
            goods_weight = Number(goods_weight);
            let long = long_obj.val();
            long = Number(long);
            let wide = wide_obj.val();
            wide = Number(wide);
            let high = high_obj.val();
            high = Number(high);

            // 页面售卖价格处理
            if (rubles_price == "") {
                rubles_price = $('div[data-widget="webSale"]').find('div[data-widget="webPrice"]').find('button').text();
                rubles_price = rubles_price.replace(/[^\d]/g, '')
            }

            if (rubles_price == "") {
                rubles_price = $('div[data-widget="webPrice"]').find('span').first().text();
                rubles_price = rubles_price.replace(/[^\d]/g, '')
            }
            // 如果还没有数值则默认0
            if (!rubles_price) {
                rubles_price = 0;
            }
            // 人民币金额 =  卢布*汇率
            let sale_price = exchange_rate * rubles_price;
            sale_price_obj.val(sale_price.toFixed(2))
            rubles_price_obj.val(rubles_price);
            // 获取页面数据
            source_price = Number(source_price);
            let html = '';
            channel_data.forEach(function (item, index) {
                let _goods_weight = goods_weight;
                if (item.is_ceil_weigh == true) {
                    // 重量需要/100 向上取整在计算
                    _goods_weight = Math.ceil(_goods_weight / 100) * 100
                }
                let over_weight = (_goods_weight >= item.max_weigh) ? '是' : '否';
                let over_width = ((long + wide + high) > item.max_size) ? '是' : '否';
                let style_over_weight = over_weight === '是' ? 'red' : 'black';
                let style_over_width = over_width === '是' ? 'red' : 'black';
                _goods_weight /= 1000; //转化为kg

                if (typeof item.price === 'object') {
                    // 物流成本
                    let _self_pickup = item.price.self_pickup + (_goods_weight * item.coefficient.self_pickup) + source_price;
                    let _self_pickup_t = _self_pickup * 2;
                    let _send_house = item.price.send_house + (_goods_weight * item.coefficient.send_house) + source_price;
                    let _send_house_t = _send_house * 2
                    html += `<div class="ui dividing header">` + item.warehouse + `<span style="margin-left:5px;color: red;font-size: 12px">` + item.service + ` | ` + item.remark + ` </span></div>
    <div class="inline fields">
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    自提
                </div>
                <input type="number" class="" placeholder="" value="` + _self_pickup.toFixed(2) + `">
            </div>
        </div>
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    自提*2
                </div>
                <input type="number"  value="` + _self_pickup_t.toFixed(2) + `">
            </div>
        </div>
    </div>
     <div class="inline fields">
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    上门
                </div>
                <input type="number" class="" placeholder="" value="` + _send_house.toFixed(2) + `">
            </div>
        </div>
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    上门*2
                </div>
                <input type="number" class="" value="` + _send_house_t.toFixed(2) + `">
            </div>
        </div>
    </div>
     <div class="inline fields">
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    超重
                </div>
                <input type="text" class="" placeholder=""  style="color: ` + style_over_weight + `"  value="` + over_weight + `">
            </div>
        </div>
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    超宽
                </div>
                <input type="text" class="" placeholder=""   style="color: ` + style_over_width + `" value="` + over_width + `">
            </div>
        </div>
    </div>`;

                } else {
                    let _self_pickup = item.price + (_goods_weight * item.coefficient) + source_price;
                    let _self_pickup_t = _self_pickup * 2;

                    html += `<div class="ui dividing header">` + item.warehouse + `<span style="margin-left:5px;color: red;font-size: 12px">` + item.service + ` | ` + item.remark + ` </span></div>
    <div class="inline fields">
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    自提
                </div>
                <input type="number" class="" placeholder="" value="` + _self_pickup.toFixed(2) + `">
            </div>
        </div>
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    自提*2
                </div>
                <input type="number"  value="` + _self_pickup_t.toFixed(2) + `">
            </div>
        </div>
    </div>

     <div class="inline fields">
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    超重
                </div>
                <input type="text" class="" placeholder=""  style="color: ` + style_over_weight + `"  value="` + over_weight + `">
            </div>
        </div>
        <div class="ten wide field">
            <div class="ui labeled input">
                <div class="ui label">
                    超宽
                </div>
                <input type="text" class="" placeholder=""   style="color: ` + style_over_width + `" value="` + over_width + `">
            </div>
        </div>
    </div>`;
                }
            })
            $("#compute-result").html(html);
        }

        calculation()
    })
})();