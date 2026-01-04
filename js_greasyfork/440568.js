
let title = 'long sleeve cotton dress solid dress dress long sleeve long sleeve solid cotton  '
let count = 9;
let min_price = 51;
let max_price = 99;


$(document).ready(function () {
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
        let my_price_list = localStorage.getItem("my_price_list");
        for (let i = 0; i < 50; i++) {
            my_prices[i] = toDecimal(min_price + i * gradient)
        }
        let my_value_str = JSON.stringify(my_prices);
        localStorage.setItem("my_price_list", my_value_str);
        return my_prices
    }

    function get_flag() {
        let storage_name = "my_price_flag_list"
        let my_flag_list = localStorage.getItem(storage_name);
        if (my_flag_list === null) {
            let my_value_str = JSON.stringify([]);
            localStorage.setItem(storage_name, my_value_str);
            return 0;
        } else {
            //游标最大值为长度减一
            let local_value = JSON.parse(my_flag_list);
            let flag = local_value.length
            local_value[flag] = flag
            let my_value_str = JSON.stringify(local_value);
            localStorage.setItem(storage_name, my_value_str);
            return flag
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
            $("#Price").val(my_prices[get_flag()])
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

})
;