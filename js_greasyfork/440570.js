// ==UserScript==
// @name         shigeshumai
// @namespace    http://tampermonkey.net/
// @version      0.4.2022年2月26日
// @description  Get the title from the input box and fix the price and amount
// @author       osci
// @match        http://220.197.177.18:61235/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=177.18
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440570/shigeshumai.user.js
// @updateURL https://update.greasyfork.org/scripts/440570/shigeshumai.meta.js
// ==/UserScript==


let amount = 9;
let price = 9;


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


    function get_flag(e) {
        let storage_name = "my_flag_list"
        let my_flag_list = local_storage_get(storage_name)

        function reduce_flag(my_flag_list) {
            //出错情况下回滚
            my_flag_list.length = (my_flag_list.length - 1)
            local_storage_set(storage_name, my_flag_list)
        }

        if (e === -1) {
            reduce_flag(my_flag_list)
        } else {
            if (my_flag_list === null) {
                local_storage_set(storage_name, [0])
                return 0;
            } else {
                //游标最大值为长度减一
                let flag = my_flag_list.length
                my_flag_list[flag] = flag
                local_storage_set(storage_name, my_flag_list)

                if (flag >= e) {
                    alert("游标越界；所有的title已经被使用")
                } else {
                    return flag
                }

            }
        }
    }

    let my_css = '<style>.topBtn{\n' + 'position: fixed;\n' + 'bottom: 50px;\n' + 'right: 50px;\n' + 'width: 60px;\n' + 'height: 60px;\n' + 'line-height: 60px;\n' + 'text-align: center;\n' + 'color: #FFF;\n' + 'z-index: 999;\n' + 'background: #FF5722;\n' + 'cursor: pointer;\n' + 'border-radius: 30px;\n' + 'box-shadow:0px 0px 20px #000;' + '}' + '    #my_box_script {\n' + '        position: fixed;\n' + '        top: 200px;\n' + '        left: 400px;\n' + '        background-color: aliceblue;\n' + '        height: 400px;\n' + '        width: 800px;\n' + '        padding: 20px;\n' + '        display:none;' + '    }\n' + '    #my_box_script textarea {\n' + '        width: 755px;\n' + '        height: 320px;\n' + '        resize: block;\n' + '    }</style>'
    $('head').append(my_css);
    $('body').append('<div id="topBtn1" class="topBtn" style="bottom: 150px" >展开</div>');
    $("body").append('<div id="my_box_script">' + '<textarea id="input_date"></textarea>' + '<button id="dao_ru_my">导入</button>' + '<p id="dig_o"></p>' + '</div>');

    $("#topBtn1").click(function () {
        let dis = $("#my_box_script").css("display")
        if (dis === 'none') {
            $("#my_box_script").css("display", 'block')
        } else {
            $("#my_box_script").css("display", 'none')
        }
    })

    $("#dao_ru_my").click(function () {
        let data = $("#my_box_script textarea").val();
        let data_list = data.split('\n')
        if (data_list.length > 0) {
            $("#dig_o").text("成功导入" + data_list.length + "条；三秒后网页重载")
            local_storage_set("my_title_list", data_list)
            setTimeout(function () {
                location.reload()
            }, 3000)
        }
    })


    let urls = location.href

    if (urls.search('products/') > -1) {

        //发布商品
        setTimeout(function () {
            let count = parseInt($($("i[title='商品数量']")[0]).next().text())
            console.log(count)
            if (isNaN(count)) {
                location.reload()//刷新网页
            } else if (count < 50) {
                try {
                    $(".btn-responsive")[0].click();
                } catch (e) {
                    location.reload()//刷新网页
                }
            } else {
                alert("已上架五十个,请关闭脚本")
            }
        }, 3000)

    } else if (urls.search('addproduct/') > -1) {

        setTimeout(function () {
            $('tbody tr')[0].click()
            console.log("添加商品")
        }, 1000)

        setTimeout(function () {

            let data_list = local_storage_get("my_title_list");
            if (data_list === null) {
                $("#topBtn1").click()
                alert("没有导入数据，请导入数据")

            } else {
                //取到列表
                let flag = get_flag(data_list.length);
                //取一个坐标
                setInterval(function () {
                    $("#Name").val(data_list[flag])
                    $("#Name").trigger("change");
                    //商品名字
                    $("#Price").val(price)
                    $("#Price").trigger("change");
                    //价格
                }, 200)
            }
        }, 1500)

        setTimeout(function () {
            //报错错点
            try {
                $("input[type='checkbox'][id='SourceWarehouse_0']")[0].click()
                //选定国内仓
            } catch (e) {
                get_flag(-1)//flag列表长度减1
                location.reload()//刷新网页
            }

        }, 2000)

        setTimeout(function () {
            let couy = $("input[name='WarehouseQuantity_0']")[0];
            $(couy).val(amount)
            $(couy).trigger("change");
            //商品数量
        }, 2500)

        setTimeout(function () {
            $($("button[id='SubmitProduct']")[0]).click()
        }, 3000)

    }

});
