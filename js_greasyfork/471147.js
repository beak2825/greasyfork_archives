// ==UserScript==
// @name         新罗PC购物车
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮助你查询新罗的item价格
// @author       You
// @match        *://www.shilladfs.com/estore/kr/zh*
// @match        *://m.shilladfs.com/estore/kr/zh*
// @grant        none
// @license      chenxx
// @downloadURL https://update.greasyfork.org/scripts/471147/%E6%96%B0%E7%BD%97PC%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/471147/%E6%96%B0%E7%BD%97PC%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        'use strict';
        var zhekou_list = [13,18,22,27,26,31]
        var current_url = window.location.href

        function add_discount_area(zhekou_list,price,discount) {
            //声明tr行
            var node_tr
            var node_td
            var node_li
            var ready_for_append
            var textnode

            node_tr = document.createElement("tr")
            node_td = document.createElement("td")
            node_li = document.createElement("li")
            ready_for_append= " ----------------"
            textnode= document.createTextNode(ready_for_append)
            node_li.appendChild(textnode)
            node_td.appendChild(node_li)

            node_li = document.createElement("li")
            ready_for_append = "普通积分:" + discount
            textnode = document.createTextNode(ready_for_append)
            node_li.appendChild(textnode)
            node_td.appendChild(node_li)
            node_tr.appendChild(node_td)

            node_td = document.createElement("td")
            node_li = document.createElement("li")
            ready_for_append= " ----------------"
            textnode= document.createTextNode(ready_for_append)
            node_li.appendChild(textnode)
            node_td.appendChild(node_li)

            node_li = document.createElement("li")
            ready_for_append = "00价" + String(price)
            textnode = document.createTextNode(ready_for_append)
            node_li.appendChild(textnode)
            node_td.appendChild(node_li)
            for (var each_zhekou of zhekou_list){
                node_li = document.createElement("li")
                ready_for_append = String(each_zhekou) + "价" + String((price * (100 - discount - each_zhekou)/100).toFixed(2))
                textnode = document.createTextNode(ready_for_append)
                node_li.appendChild(textnode)
                node_td.appendChild(node_li)
            }
            node_tr.appendChild(node_td)
            return node_tr
        }

        function shilladfs_PC_cart(zhekou_list) {
            var huilv = Number(document.getElementsByClassName("banner banner_exchange new")[0].getElementsByTagName("span")[1].innerHTML)
            //huilv的结果是 6.35 数字
            var target_list = document.getElementsByClassName("table_normal")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")
            var ready_for_append
            var temp_price, temp_number, temp_discount, temp_discount2, temp_list
            var temp_item
            for (var each of target_list){
                temp_list = each.getElementsByTagName("td")
                temp_price = Number(temp_list[2].getElementsByTagName("span")[1].innerHTML.replace("$ ", "").replace(",", ""))
                //temp_price 的结果是 55   ,
                try {
                    temp_number = Number(temp_list[3].getElementsByClassName("maxorder")[0].getAttribute("value"));
                }
                catch(err) {
                    temp_number = 0;
                }

                temp_discount = temp_list[5].getElementsByClassName("discount")[0].innerHTML.replace(/\t/g, "").replace(/\n/g, "")
                temp_discount = Number(temp_discount.replace("(", "").replace("%)", ""))

                try {
                    temp_list[3].getElementsByClassName("btn_on pconut_submit")[0].setAttribute("data-producttype", "01")
                }
                catch(err) {
                    temp_list[3].getElementsByClassName("ea_out")[0]
                }

                var node = document.createElement("td")
                var node_temp = document.createElement("li")
                ready_for_append = "单价" + String((temp_price * huilv * ((100-temp_discount)/100)).toFixed(2))
                var textnode_temp = document.createTextNode(ready_for_append)
                node_temp.appendChild(textnode_temp)
                node.appendChild(node_temp)
                for (var each_zhekou of zhekou_list){
                    node_temp = document.createElement("li")
                    ready_for_append = String(each_zhekou) + "价" + String((temp_price * huilv * (100-temp_discount-each_zhekou)/100).toFixed(2))
                    textnode_temp = document.createTextNode(ready_for_append)
                    node_temp.appendChild(textnode_temp)
                    node.appendChild(node_temp)
                }
                node_temp = document.createElement("li")
                ready_for_append = "量" + String(temp_number)
                textnode_temp = document.createTextNode(ready_for_append)
                node_temp.appendChild(textnode_temp)
                node.appendChild(node_temp)
                each.appendChild(node);
            }}

        function find_price_for_shilladfs_pc(){
            var vip_area, origin_area, discount_area ,add_area//document.getElementsByClassName("banner banner_exchange new")[0].getElementsByTagName("span")[1].innerHTML
            try {
                vip_area = document.getElementsByClassName("regular clear_both")[0]//普通产品
                origin_area = document.getElementsByClassName("sale clear_both")[0]
                discount_area = document.getElementsByClassName("save_info_box")[0]
                add_area = vip_area.parentElement
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是普通产品")
            }
            try {
                vip_area = document.getElementsByClassName("lancome_login_container bootstrap-row alignCenter")[0]//lankou
                origin_area = document.getElementsByClassName("lancome_product_price_container bootstrap-row alignCenter")[0]
                discount_area = document.getElementsByClassName("lancome_product_tnc lancome_product_content_txt grey")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是lankou")
            }
            try {
                vip_area = document.getElementsByClassName("kiehl_login_container bootstrap-row alignCenter")[0]//keyanshi
                origin_area = document.getElementsByClassName("kiehl_product_price_container bootstrap-row alignCenter")[0]
                discount_area = document.getElementsByClassName("kiehl_detail_discount")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是keyanshi")
            }
            try {
                vip_area = document.getElementsByClassName("prod_info")[0].getElementsByTagName("dl")[4]//mac
                origin_area = document.getElementsByClassName("prod_info")[0].getElementsByTagName("dl")[3]
                discount_area = document.getElementsByClassName("notice")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是mac")
            }
            try {
                vip_area = document.getElementsByClassName("prodInfo")[0].getElementsByTagName("tr")[3]//祖玛龙
                origin_area = document.getElementsByClassName("prodInfo")[0].getElementsByTagName("tr")[2]
                discount_area = document.getElementsByClassName("note_type")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是祖玛龙")
            }
            try {
                vip_area = document.getElementById("tabsdiv-1").getElementsByTagName("tr")[3]//yashilandai
                origin_area = document.getElementById("tabsdiv-1").getElementsByTagName("tr")[2]
                discount_area = document.getElementById("tabsdiv-1").getElementsByTagName("tr")[6]
                add_area = vip_area.parentElement
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是yashilandai")
            }
            try {
                vip_area = document.getElementsByClassName("buy_box")[0].getElementsByTagName("p")[3]//dior
                origin_area = document.getElementsByClassName("buy_box")[0].getElementsByTagName("p")[2]
                discount_area = document.getElementsByClassName("buy_box")[0].getElementsByTagName("p")[5]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是dior")
            }
            try {
                vip_area = document.getElementsByClassName("brand")[0]
                if (vip_area.innerText.includes("资生堂")){
                    vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[1]//资生堂
                    origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[0]
                    discount_area = document.getElementsByClassName("pro-text-area")[0].getElementsByClassName("guide-text")[0]
                    add_area = discount_area
                    if(vip_area.innerText.includes("会员价")){
                        return [vip_area, origin_area, discount_area, add_area]
                    }
                }
            }
            catch(err) {
                console.log("不是资生堂")
            }
            try {
                vip_area = document.getElementsByClassName("tf_menu")[0]
                if (vip_area.innerHTML.includes("TOM FORD")){
                    vip_area = document.getElementsByClassName("prod_order")[0].getElementsByTagName("tr")[3]//TF
                    origin_area = document.getElementsByClassName("prod_order")[0].getElementsByTagName("tr")[2]
                    discount_area = document.getElementsByClassName("tf_contents")[0].getElementsByClassName("note_type")[1]
                    add_area = document.getElementsByClassName("right_section")[0].getElementsByClassName("prod_summary")[0]
                    if(vip_area.innerText.includes("会员价")){
                        return [vip_area, origin_area, discount_area, add_area]
                    }
                }
            }
            catch(err) {
                console.log("不是TF")
            }
            try {
                vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[3]//ipsa
                origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[2]
                discount_area = document.getElementsByClassName("save_info_box")[0].getElementsByTagName("p")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是ipsa")
            }
            try {
                vip_area = document.getElementsByClassName("menu-list-hr")[0]
                if (vip_area.innerHTML.includes("绿宝瓶家族")){
                    vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[3]//HR
                    origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[2]
                    discount_area = document.getElementsByClassName("pro-guide-text")[0].getElementsByClassName("txt_info")[0]
                    add_area = discount_area
                    if(vip_area.innerText.includes("会员价")){
                        return [vip_area, origin_area, discount_area, add_area]
                    }
                }
            }
            catch(err) {
                console.log("不是HR")
            }
            try {
                vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[3]//ysl口红
                origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[2]
                discount_area = document.getElementsByClassName("detail-area")[0].getElementsByClassName("pro-guide-text")[0]
                add_area = document.getElementsByClassName("detail-area")[0].getElementsByClassName("brand")[0]
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是ysl口红")
            }
            try {
                vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[3]//阿玛尼
                origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[2]
                discount_area = document.getElementsByClassName("guide-text")[0].getElementsByClassName("txt_info")[1]
                add_area = document.getElementsByClassName("pro-text-area")[0].getElementsByClassName("title")[0]
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是阿玛尼")
            }
            try {
                vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[1]//cpb
                origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[0]
                discount_area = document.getElementsByClassName("guide-text")[0]
                add_area = document.getElementsByClassName("pro-text-area")[0].getElementsByClassName("title")[0]
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是cpb")
            }
            try {
                vip_area = document.getElementsByClassName("prodSpec")[0].getElementsByTagName("tr")[3]//海南之谜
                origin_area = document.getElementsByClassName("prodSpec")[0].getElementsByTagName("tr")[2]
                discount_area = document.getElementsByClassName("subTxt")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是海南之谜")
            }
            try {
                vip_area = document.getElementsByClassName("prd_price_info active")[0]//碧欧泉
                origin_area = document.getElementsByClassName("prd_price_info")[0]
                discount_area = document.getElementsByClassName("prd_guide")[1]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是碧欧泉")
            }
        }
        function shilladfs_PC_item(zhekou_list) {
            var price_and_discount
            var vip_area, origin_area, discount_area, add_area
            var match, regex
            price_and_discount = find_price_for_shilladfs_pc()
            vip_area = price_and_discount[0]
            origin_area = price_and_discount[1]
            discount_area = price_and_discount[2]
            add_area = price_and_discount[3]
            //确定是否有普通积分
            var discount
            try {
                discount = discount_area.innerText;
                regex = /\d+%/;
                match = regex.exec(discount);
                discount = match[0].replace("%","");
            }
            catch(err) {
                discount = "0"
            }
            discount = Number(discount)

            try {
                var vip_price
                vip_price = vip_area.innerText//'$170(约 ¥1,218.9)'
                regex = /[),\s]/g
                vip_price = vip_price.replace(regex, "").replace("有存货", "").replace("元", "")//'$170(约¥1218.9'
                regex = /(\d+(\.\d+)?)$/
                match = regex.exec(vip_price);
                vip_price = Number(match[1])
                add_area.appendChild(add_discount_area(zhekou_list,vip_price,discount))
            }
            catch(err) {
                console.log("-------11111111111111-----------------")
                console.log(err)
                console.log("-------22222222222222-----------------")
                var origin_price
                origin_price = origin_area.innerText//'$170 (约 ¥1,218.9)'
                regex = /[),\s]/g
                origin_price = origin_price.replace(regex, "").replace("有存货", "").replace("元", "")//'$170(约¥1218.9'
                regex = /(\d+(\.\d+)?)$/
                match = regex.exec(origin_price);
                origin_price = Number(match[1])
                add_area.appendChild(add_discount_area(zhekou_list,origin_price,discount))
            }
        }
        /////////////////////////////////////////
        /////////////////////////////////////////
        function find_price_for_shilladfs_phone(){
            var vip_area, origin_area, discount_area ,add_area//document.getElementsByClassName("banner banner_exchange new")[0].getElementsByTagName("span")[1].innerHTML
            try {
                vip_area = document.getElementsByClassName("price_info")[0].getElementsByTagName("tr")[2]//普通产品
                origin_area = document.getElementsByClassName("price_info")[0].getElementsByTagName("tr")[0]
                discount_area = document.getElementsByClassName("save_info_box")[0]
                add_area = vip_area.parentElement
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是普通产品")
            }
            try {
                vip_area = document.getElementsByClassName("price_info")[0].getElementsByTagName("tr")[1]//普通产品 但是没有折扣那种
                origin_area = document.getElementsByClassName("price_info")[0].getElementsByTagName("tr")[0]
                discount_area = document.getElementsByClassName("save_info_box")[0]
                add_area = vip_area.parentElement
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是普通产品")
            }
            try {
                vip_area = document.getElementsByClassName("lancome_login_container bootstrap-row alignCenter")[0]//lankou
                origin_area = document.getElementsByClassName("lancome_product_price_container bootstrap-row alignCenter")[0]
                discount_area = document.getElementsByClassName("lancome_product_tnc lancome_product_content_txt grey")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是lankou")
            }
            try {
                vip_area = document.getElementsByClassName("kiehl_login_container bootstrap-row alignCenter")[0]//keyanshi
                origin_area = document.getElementsByClassName("kiehl_product_price_container bootstrap-row alignCenter")[0]
                discount_area = document.getElementsByClassName("kiehl_detail_discount")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是keyanshi")
            }
            try {
                vip_area = document.getElementsByClassName("detail")[0].getElementsByTagName("dl")[3]//dior
                origin_area = document.getElementsByClassName("detail")[0].getElementsByTagName("dl")[2]
                discount_area = document.getElementsByClassName("buttons")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是dior")
            }
            try {
                vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[1]//资生堂
                origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[0]
                discount_area = document.getElementsByClassName("guide-text")[0].getElementsByTagName("p")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是资生堂")
            }

            try {
                vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[4]//ipsa
                origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[3]
                discount_area = document.getElementsByClassName("save_info_box")[0].getElementsByTagName("p")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是ipsa")
            }
            try {
                vip_area = document.getElementsByClassName("pro-buy-info new")[0].getElementsByTagName("dl")[3]//HR
                origin_area = document.getElementsByClassName("pro-buy-info new")[0].getElementsByTagName("dl")[2]
                discount_area = document.getElementsByClassName("guide-txt")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是HR")
            }

            try {
                vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[3]//阿玛尼
                origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[2]
                discount_area = document.getElementsByClassName("guide-text")[0]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是阿玛尼")
            }
            try {
                vip_area = document.getElementsByClassName("title")[0].getElementsByTagName("dt")[0]//cpb
                if(vip_area.innerText.includes("CPB")){
                    vip_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[1]//cpb
                    origin_area = document.getElementsByClassName("pro-buy-info")[0].getElementsByTagName("dl")[0]
                    discount_area = document.getElementsByClassName("guide-text")[0]
                    add_area = vip_area
                    if(vip_area.innerText.includes("会员价")){
                        return [vip_area, origin_area, discount_area, add_area]
                    }
                }
            }
            catch(err) {
                console.log("不是cpb")
            }
            try {
                vip_area = document.getElementsByClassName("prd_info_guide sale")[0]//碧欧泉
                origin_area = document.getElementsByClassName("prd_info_guide normal")[0]
                discount_area = document.getElementsByClassName("prd_guide")[1]
                add_area = vip_area
                if(vip_area.innerText.includes("会员价")){
                    return [vip_area, origin_area, discount_area, add_area]
                }
            }
            catch(err) {
                console.log("不是碧欧泉")
            }
        }
        function shilladfs_phone_item(zhekou_list) {
            var price_and_discount
            var vip_area, origin_area, discount_area, add_area
            var match, regex
            price_and_discount = find_price_for_shilladfs_phone()
            vip_area = price_and_discount[0]
            origin_area = price_and_discount[1]
            discount_area = price_and_discount[2]
            add_area = price_and_discount[3]
            //确定是否有普通积分
            var discount
            try {
                discount = discount_area.innerText;
                regex = /\d+%/;
                match = regex.exec(discount);
                discount = match[0].replace("%","");
            }
            catch(err) {
                discount = "0"
            }
            discount = Number(discount)

            try {
                var vip_price, percent_for_origin_price
                vip_price = vip_area.innerText//'网络会员价\t\n$73.6\n(約 ¥526.98) 8.0折'
                if (vip_price.includes("折")){
                    regex = /\d+\.\d+折/;
                    percent_for_origin_price = vip_price.match(regex)[0];
                    vip_price = vip_price.replace(percent_for_origin_price, "")
                }
                if (vip_price.includes("%")){
                    regex = /\d+%/;
                    percent_for_origin_price = vip_price.match(regex)[0];
                    vip_price = vip_price.replace(percent_for_origin_price, "")
                }

                regex = /[),\s]/g
                vip_price = vip_price.replace(regex, "").replace("有存货", "").replace("元", "")//'$170(约¥1218.9'
                regex = /(\d+(\.\d+)?)$/
                match = regex.exec(vip_price);
                vip_price = Number(match[1])
                add_area.appendChild(add_discount_area(zhekou_list,vip_price,discount))
            }
            catch(err) {
                console.log("-------11111111111111-----------------")
                console.log(err)
                console.log("-------22222222222222-----------------")
                var origin_price
                origin_price = origin_area.innerText//'原价(市场价格)\t\n$92 (約￥658.72)'
                //不存在某某折扣，所以不需要匹配折扣

                regex = /[),\s]/g
                origin_price = origin_price.replace(regex, "").replace("有存货", "").replace("元", "")//'$170(约¥1218.9'
                regex = /(\d+(\.\d+)?)$/
                match = regex.exec(origin_price);
                origin_price = Number(match[1])
                add_area.appendChild(add_discount_area(zhekou_list,origin_price,discount))
            }
        }


        if (current_url.includes("www.shilladfs.com/estore/kr/zh") ) {
            if(current_url.includes("/p/") ) {
                shilladfs_PC_item(zhekou_list);
            }
            if(current_url.includes("/cart") ) {
                shilladfs_PC_cart(zhekou_list);
            }
        }
        if (current_url.includes("m.shilladfs.com/estore/kr/zh") ) {
            if(current_url.includes("/p/") ) {
                shilladfs_phone_item(zhekou_list);
            }

        }
    },1200);
})();