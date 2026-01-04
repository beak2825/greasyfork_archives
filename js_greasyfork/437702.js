// ==UserScript==
// @name         抖音客户收货地址下载
// @namespace    保留
// @version      0.1
// @description  发财致富度小能手
// @author       Detom
// @match        https://fxg.jinritemai.com/ffa/morder/order/list
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTgiIGhlaWdodD0iNTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zOC4xNCAzLjI3NmEuNzczLjc3MyAwIDAgMCAuNzU5LS42MzJsLjM3My0yLjAxMmEuNzczLjc3MyAwIDAgMSAuNzYtLjYzMkg1Ni4wOGMuNDgyIDAgLjg0Ni40MzYuNzYxLjkxbC0yLjQ0NSAxMy41NzctNC4zOTkgMjQuNjk4Yy0xLjA5OCA2LjE2Ni03LjExNiAxMS4yMS0xMy4zNzQgMTEuMjFIOS43ODZjLTYuMjU4IDAtMTAuNDgtNS4wNDQtOS4zODItMTEuMjFsNC4zOTgtMjQuNjk4QzUuOSA4LjMyIDExLjkyIDMuMjc3IDE4LjE3NyAzLjI3N0gzOC4xNHoiIGZpbGw9IiMxOTY2RkYiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI0LjEwOCAzMy42NTdoLTUuODJsMi4zOTQtMTMuNjQ0aDUuODJsLTIuMzk0IDEzLjY0NHoiIGZpbGw9IiNBM0MyRkYiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTM0LjcwNSAzMy42NTdoLTUuODJMMzIuMjQgMTQuNTdoNS44MmwtMy4zNTUgMTkuMDg4eiIgZmlsbD0iI0QxRTBGRiIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtNDQuMzIxIDYuMTgzLS41NDkgMy4wMDMtMS42MTMgOS4xOTUtLjEuNTc0LS4xMzYuNzctMi42MyAxNC45OWMtLjQyNSAyLjQyMi0yLjc1NCA0LjQwMy01LjE3NSA0LjQwM2gtMTcuMTZjLTIuNDIgMC00LjA1NC0xLjk4LTMuNjMtNC40MDJsMi43NjctMTUuNzYxYy40MjUtMi40MjIgMi43NTMtNC40MDMgNS4xNzQtNC40MDNoNi4xNjVsMS4wMjYtNS44NDhIMjAuN2MtNC43NDUgMC05LjMwOSAzLjg4My0xMC4xNDEgOC42MjhMNy4yMjUgMzYuMzM5Yy0uODMzIDQuNzQ1IDIuMzY4IDguNjI3IDcuMTE0IDguNjI3aDIwLjM0N2M0Ljc0NSAwIDkuMzA5LTMuODgyIDEwLjE0MS04LjYyN2wzLjE1MS0xNy45NTguMTg0LTEuMDUgMS45NzktMTEuMTQ4aC01LjgyeiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/437702/%E6%8A%96%E9%9F%B3%E5%AE%A2%E6%88%B7%E6%94%B6%E8%B4%A7%E5%9C%B0%E5%9D%80%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/437702/%E6%8A%96%E9%9F%B3%E5%AE%A2%E6%88%B7%E6%94%B6%E8%B4%A7%E5%9C%B0%E5%9D%80%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let aid
    let all_data = '订单ID,姓名,电话,省,市,县\/区,街\/道\/镇,详细地址\n';
    let temp_list =[];
    let btn
    let loading = '<div class="auxo-spin auxo-spin-spinning" style="display:inline-block;"><span class="auxo-spin-dot auxo-spin-dot-spin"><i class="auxo-spin-dot-item"></i><i class="auxo-spin-dot-item"></i><i class="auxo-spin-dot-item"></i><i class="auxo-spin-dot-item"></i></span></div>';
    var all_order_data =[];
    var wait_time = 800; // 防止被风控，限制次查询的等待时间

    function getOrderId(ls){
        if(ls.length>0){
            let item = ls.shift();
            let page = item[0];
            let num = item[1];

            $.get('https://fxg.jinritemai.com/api/order/searchlist?tab=all&order_by=create_time&order=desc&page='+page+'&pageSize='+num+'&appid=1&aid='+aid,function(r){
                if(r.code == 0){
                    let data = r.data;
                    all_order_data = all_order_data.concat(data);
                    getOrderId(ls);
                }
            })
        }else{
            console.log(all_order_data);
            getOrderInfo(all_order_data);
        }V60*1000/800
    }

    // 获取订单
    function getOrders(num){
        // 抖音限定每页只能获取 200 条数据，所以多于 200 条就要切片
        let wait = num*wait_time/60000
        if( wait >= 1 ){
            alert("下载的数量有点多，可能需要 "+wait.toFixed(0)+'分钟' );
        }
        let action = num;
        let step = 200;
        let ls = [];
        let index = 0;
        while( action>step){
            ls.push([index++,step]);
            action-=step;
        }
        if(action>0){
            ls.push([index++,action])
        }
        getOrderId(ls);
        console.log(ls)
    }

    // 获取订单收件信息
    function getOrderInfo(order_data){
        console.log(order_data.length);
        if(order_data.length>0){
            let order = order_data.shift();
            let orderID = order.shop_order_id;
            // console.log(orderID);
            $.get('https://fxg.jinritemai.com/api/order/receiveinfo?aid='+aid+'&order_id='+orderID,function(r){
                // console.log(r.code);
                // console.log(r.data);
                if(r.code == 0){
                    let data = r.data.receive_info
                    // console.log(data);
                    let name = data.post_receiver;
                    let tel = data.post_tel;
                    let addr =  data.post_addr.province.name +','+ data.post_addr.city.name +','+ data.post_addr.town.name +','+ data.post_addr.street.name +','+ data.post_addr.detail
                    // console.log(name);
                    // console.log(tel);
                    // console.log(addr);
                    temp_list = [ orderID, name, tel, addr ];
                    all_data += temp_list.join(',')+'\n';
                }
                 setTimeout(function(){
                     getOrderInfo(order_data);
                 },wait_time);
            });
        }else{
            console.log(all_data)
            btn.disabled = null;
            btn.innerHTML = "下载";

            // 保存为csv文件并添加下载按钮
            let csvString = "data:application/csv," + encodeURIComponent(all_data);
            let download_btn = document.createElement('a');
            download_btn.setAttribute("href", csvString);
            download_btn.setAttribute("download", "抖音客户信息.csv");
            download_btn.innerText = '下载'
            document.body.append(download_btn)
            download_btn.click()
            download_btn.remove()

        }
    }

    // 初始化 并获取 aid
    function init(){
        let box = $('.index_buttonGroup__1tLG2');
        // let box = document.createElement('div');
        // box.style="position: fixed;top: 0;left: 0;z-index: 9999;";
        // $('.index_batchOpWrap__paous').prepend(box);

        // 获取数量输入框
        let input = document.createElement('input');
        input.style = 'width:90px;';
        input.className = 'auxo-input auxo-input-sm';
        input.type = 'number';
        input.id="xb_dy_input";
        input.value="10";
        input.max=200;
        input.placeholder="输入下载数量";
        box.append(input);


        // 确认 按钮
        btn = document.createElement('button');
        btn.innerHTML = '下载';
        btn.className = 'auxo-btn auxo-btn-sm';
        btn.onclick = function(){
            let head = document.head.innerHTML
            head = head.substr(head.indexOf('&aid=')+5)
            aid = head.substr(0,head.indexOf('&'))
            console.log(aid)
            this.innerHTML =loading+'下载中';
            this.disabled = 'disabled';
            getOrders(input.value);
        }
        box.append(btn);
    }
    function pre_init(){
        if($('.index_buttonGroup__1tLG2').length > 0){
            init();
            return;
        }
        setTimeout(pre_init,1000);
    }
    pre_init()
    // Your code here...
})();