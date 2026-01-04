// ==UserScript==
// @name         shigeshimao.static_title
// @namespace    http://tampermonkey.net/
// @version      0.3.2022年2月26日
// @description  Fixed title changing price
// @author       osci
// @match        http://220.197.177.18:61235/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=177.18
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440569/shigeshimaostatic_title.user.js
// @updateURL https://update.greasyfork.org/scripts/440569/shigeshimaostatic_title.meta.js
// ==/UserScript==


let title = 'long sleeve cotton dress solid dress dress long sleeve long sleeve solid cotton  '
let count = 9;
let min_price = 51;
let max_price = 99;


$(document).ready(function () {

    function local_storage_set(storage_name, data) {
        localStorage.setItem(storage_name, JSON.stringify(data));
    }

    function local_storage_get(storage_name) {
        let my_flag_list = localStorage.getItem(storage_name);
        if (my_flag_list === null) {
            //如果没有此项则返回空
            return null;
        } else {
            //有此项则正常返回格式化后的数据
            return JSON.parse(my_flag_list);
        }
    }

    function set_price_list() {
        let gradient = (max_price - min_price) / 49;

        function toDecimal(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return;
            }
            f = Math.round(x * 100) / 100;
            return f;
        }

        let my_prices = []
        for (let i = 0; i < 50; i++) {
            my_prices[i] = toDecimal(min_price + i * gradient)
        }
        let my_value_str = JSON.stringify(my_prices);
        localStorage.setItem("my_price_list", my_value_str);
        return my_prices
    }

    function get_flag() {
        let storage_name = "my_price_flag_list"
        let my_flag_list = local_storage_get(storage_name)
        if (my_flag_list === null) {
            local_storage_set(storage_name, [])
            return 0;
        } else {
            //游标最大值为长度减一
            let flag = my_flag_list.length
            my_flag_list[flag] = flag
            local_storage_set(storage_name, my_flag_list)
            return flag + 1
        }
    }

    let my_prices = set_price_list();

    let urls = location.href


    if (urls.search('products/') > -1) {
        function faBuShangPin() {
            $(".btn-responsive")[0].click()
        }

        faBuShangPin()
    } else if (urls.search('addproduct/') > -1) {

        let flag = get_flag()

        console.log(flag)

        function add_goods() {
            $('tbody tr')[0].click()
        }

        setTimeout(function () {
            add_goods()
            console.log("添加商品")
        }, 1000)

        setTimeout(function () {
            $("#Name").val(title)
            $("#Name").trigger("change");
            $("#Price").val(my_prices[flag])
            $("#Price").trigger("change");
            //价格
        }, 1500)

        setTimeout(function () {
            $("input[type='checkbox'][id='SourceWarehouse_0']")[0].click()
            //选定国内仓
        }, 2000)
        setTimeout(function () {
            let couy = $("input[name='WarehouseQuantity_0']")[0];
            $(couy).val(count)
            $(couy).trigger("change");
            //商品数量
        }, 2500)
        setTimeout(function () {
            $($("button[id='SubmitProduct']")[0]).click()
        }, 3000)
    }


});