// ==UserScript==
// @name         sortorder
// @namespace    http://tampermonkey.net/
// @version      3.00
// @description  sort order for line customer
// @author       FengXia
// @match        http://47.107.106.156/*
// @icon
// @grant        none
// @license MIT
// @require https://greasyfork.org/scripts/448895-elementgetter%E5%BA%93/code/ElementGetter%E5%BA%93.js?version=1077494
// @require https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/462908/sortorder.user.js
// @updateURL https://update.greasyfork.org/scripts/462908/sortorder.meta.js
// ==/UserScript==


(function() {
    const elmGetter = new ElementGetter();  //初始化ElementGetter
    let url_bool = false;   //网址判断变量
    let re_line = /lineid=\d+(%2C\d+)*/g; //获取选择的路线正则
    let customer_obj ={};
    ah.proxy({
        //请求发起前进入
        onRequest: async (config, handler) => {
            if (config.url === 'sales/getOrderList.do') {
                let re_string = config.body.match(re_line);
                if (re_string) {
                    config.body = config.body.replace(/rows=\d+/, "rows=1000");
                    customer_obj = {};
                    let customer_sep = 1;
                    url_bool = true;
                    let re_num = re_string[0].match(/\d+(?!C)/g);   //否定的前瞻断言
                    for (let item of re_num) {
                        let customer = await queryLineCustomer(item);
                        // console.log(customer);
                        for (let ss of customer) {
                            customer_obj[ss['customerid']] = customer_sep;
                            ++customer_sep;
                        }
                    }
                }
                handler.next(config);
            } else if(config.url==='sales/supplierAuditOrderMuti.do'){
                    let order_mode = prompt('请输入订单备注模式：\n 1.正常模式（默认）\n 2.增强模式','1');
                    if (order_mode === '2'){
                        let regexp = /X.*,/g;
                        let order = config.body.match(regexp);
                        let order_list = order.toString().split(',');
                        if (undefined===order_list[order_list.length]){
                            order_list.splice(-1, 1)
                        }
                        let total = `${order_list.length}~`;
                        let order_index;
                        let customer_list=[];
                        let customer = await getOrderCustomer(order);
                        let customer_obj={};
                        for (let customer_row of customer ){
                            customer_obj[customer_row['id']] = customer_row['customername'];
                        }
                        let prefix_word = prompt('备注前缀',' ');
                        let input_urgent_level = prompt('请输入订单加急级别，保持原有级别直接回车');

                        for (let item of order_list) {
                            customer_list.push(customer_obj[item]);
                        }
                        let temp_list = sortOrder(order_list,customer_list);
                        order_list=temp_list[0];
                        customer_list = temp_list[1];
                        order_index = customerNumber(customer_list,prefix_word);
                        total = '';
                        // console.log(order_index)

                        let num =0;
                        for (let item of order_list) {
                            let text = await deleteNetLocks(item)
                            text = await unLockData(item)
                            text = await queryOrderStock(item)
                            let from_data;
                            if (text){
                                from_data = await queryEditOrder(item,order_index[num],input_urgent_level,'orderEditPage.do')
                                // updateOrder(from_date)
                            } else {
                                from_data = await queryEditOrder(item,order_index[num],input_urgent_level,'orderDeployInfoPage.do')
                                // updateOrder(from_date)
                            }
                            let flag = await updateOrder(from_data);
                            // console.log(`第${num}张单`);
                            ++num;
                        }
                        config.body = config.body.replace(regexp,`${order_list.toString()},`);
                    }
                    handler.next(config);
            } else{
            handler.next(config);}
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            // console.log(err.type)
            handler.next(err)
        },
        // 请求成功后进入
        onResponse: (response, handler) => {
            if (url_bool && response.config.url === 'sales/getOrderList.do') {
                let xhrString = JSON.parse(response.response)
                // 给订单查询的返回的数据里添加客户序号
                for (let item of xhrString['rows']) {
                    item['seq'] = customer_obj[item['customerid']]
                }
                // 根据路线客户排序订单
                xhrString['rows'].sort(function(a, b) {
                    return a['seq'] - b['seq'];
                });
                response.response = JSON.stringify(xhrString);
                url_bool=false;
                // console.log(response);
                handler.next(response);
            } else{
            handler.next(response)
            }
        }
    })
})();
// reg = /lineid=\d+(%2C\d+)+/g  //获取选择的路线正则
// let result = str.match(regexp) || []; //如果我们希望结果是一个数组，我们可以这样写：

// module 查询路线内的客户排序
function queryLineCustomer(line_customer) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL(`http://47.107.106.156:8888/basefiles/showCustomerInfoList.do?lineid=${line_customer}`);
        url.searchParams.set('page', 1);
        url.searchParams.set('rows', 500);
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);

        // 3. 通过网络发送请求
        xhr.send();

        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                resolve(xhrString.rows);
            }
        };

        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}

function getOrderCustomer(order){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL('http://47.107.106.156:8888/sales/getOrderList.do');
        url.searchParams.set('queryRules', `{"rules":[{"field":"id","op":"in","value":"${order}"}],"op":"or"}`);
        url.searchParams.set('orderRules', '[]');
        url.searchParams.set('page', '1');
        url.searchParams.set('rows', '1000');
        url.searchParams.set('sort', 'addtime');
        url.searchParams.set('order', 'desc');

        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("accept", "application/json, text/javascript, */*; q=0.01");
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
        // 3. 通过网络发送请求
        xhr.send();

        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                if (xhrString.total > 0){
                    // console.log(xhrString.rows[0].customername);
                    resolve(xhrString.rows);
                }
            }
        };

        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}

// module 排序订单
function sortOrder(order_list, customer_list) {
    let order_temp=[];
    let customer_temp = [];
    customer_list.forEach((item, index) => {
        let find_index = customer_temp.indexOf(item);
        if (find_index>=0){
            customer_temp.splice(find_index, 0, item);
            order_temp.splice(find_index,0,order_list[index]);
            // console.log(order_temp,customer_temp);
        } else {
            customer_temp.splice(index, 0, item);
            order_temp.splice(index,0,order_list[index]);
            // console.log(order_temp,customer_temp);
        }
    });
    return [order_temp,customer_temp]
}


// module 根据客户数量排序
function customerNumber(customer,prefix_word){
    let customer_list=[];   // 用来存放客户对象列表
// 循环客户数组
    customer.forEach((item, index, array) => {
        let customer_arr = {};  // 客户对象
        let customer_index = [];    // 客户顺序数组
        // 用客户数组里的客户搜索客户对象列表里的客户对象并且取反
        if (!customer_list.find(customer_arr => customer_arr.customer === item)) {
            // 如果没找到，则证明客户对象列表里没有这个名称的客户对象，然后循环客户数组找出序号
            customer.forEach((item_1, index_1, array_1) => {
                if (item === item_1) {
                    customer_index.push(index_1)
                }
            });
            customer_arr = {
                'customer': item,
                'index': customer_index
            }
            customer_list.push(customer_arr)
        }
    });
    // console.log(customer_list);

// 客户序号数组
    let order_index = [];
// 循环给客户序号数组赋值为0
    for (let i = 0; i < customer.length; i++) {
        order_index.push(0)
    }
    let customer_num = 1;   // 客户送货顺序变量
// 循环客户对象列表
    for (let key in customer_list) {
        // 当客户对象里index列表大于1时，则说明有2个以上相同的客户
        if (customer_list[key].index.length>1){
            let customer_index= customer_list[key].index;   //变量等于当前这个客户index列表
            let num_list =1;    //相同客户计数
            // 循环客户index列表
            customer_index.forEach((item, index, array) => {
                if (order_index[item]===0) {
                    let total_num = customer.filter(x => x==customer_list[key]['customer']).length;
                    order_index.splice(item, 1, `${prefix_word}${customer_num}-${total_num}-${num_list}`)
                }
                ++num_list
            });
            ++customer_num
        } else {
            order_index.splice(customer_list[key].index,1,`${prefix_word}${customer_num}`);
            // console.log(customer_num)
            ++customer_num
        }
    }
    return order_index
}

// module 解锁单据
function deleteNetLocks(order){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL('http://47.107.106.156:8888/system/lock/deleteNetLocks.do');
        url.searchParams.set('ids',`t_sales_order:${order}`);


        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("accept", "application/json, text/javascript, */*; q=0.01");
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

        // 3. 通过网络发送请求
        xhr.send();

        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                resolve(xhrString.flag);
            }
        };

        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}

// module 锁单据
function unLockData(order){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL('http://47.107.106.156:8888/system/lock/unLockData.do');
        url.searchParams.set('id',order);
        url.searchParams.set('tname', 't_sales_order');


        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("accept", "application/json, text/javascript, */*; q=0.01");
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

        // 3. 通过网络发送请求
        xhr.send();

        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                resolve(xhrString.flag);
            }
        };

        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}

// module 查询订单是否可以配置库存
function queryOrderStock(order) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let url = new URL(`http://47.107.106.156:8888/sales/orderDeployInfo.do?id=${order}`);

        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);

        // 3. 通过网络发送请求
        xhr.send();

        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                // console.log(xhrString.flag);
                resolve(xhrString.flag);
            }
        };

        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}

// module 编辑订单模式
function queryEditOrder(order_num,num,urgentlevel,mode_page){
    return new Promise((resolve, reject) => {
        let urgentlevel_list = ['1','2','3'];
        let xhr = new XMLHttpRequest();
        let timestamp = Date.parse( new Date());
        let saleorder_salestype = false;
        let goodsjson;
        let url = new URL(`http://47.107.106.156:8888/sales/${mode_page}?id=${order_num}&_=${timestamp}`);
        // 2. 配置它：从 URL /article/.../load GET-request
        xhr.open('post', url);
        // 3. 通过网络发送请求
        xhr.send();
        // 4. 当接收到响应后，将调用此函数
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let parser = new DOMParser();
                let doc = parser.parseFromString(xhr.response, "text/html")
                // console.log(doc);
                let script_string = doc.scripts.item(0).text;
                let saleorder_id = order_num;
                let saleorder_businessdate = doc.querySelector('#sales-businessdate-orderAddPage').value;
                let saleorder_urgentlevel = doc.querySelector('[name="saleorder.urgentlevel"] option[selected="selected"]').value;
                if (urgentlevel_list.includes(urgentlevel)){
                    saleorder_urgentlevel = urgentlevel
                }
                if ('orderEditPage.do' === mode_page){
                    saleorder_salestype = doc.querySelector('[name="saleorder.salestype"] option[selected="selected"]').value;
                    goodsjson = script_string.match(/\[{".*"}\]/);
                } else {
                    goodsjson = script_string.match(/\[{".*}\]/);
                }
                let saleorder_status = doc.querySelector('[name="saleorder.status"]').value;
                let saleorder_customerid = doc.querySelector('[name="saleorder.customerid"]').value;
                let saleorder_salesuser = doc.querySelector('[name="saleorder.salesuser"]').value;
                let saleorder_storageid = doc.querySelector('[name="saleorder.storageid"]').value;
                let saleorder_salesdept = doc.querySelector('[name="saleorder.salesdept"]').value;
                let saleorder_sourceid = doc.querySelector('[name="saleorder.sourceid"]').value;
                let saleorder_remark = doc.querySelector('[name="saleorder.remark"]').value;
                let regexp = /[,]*此单为超级审核[,]*/g;
                saleorder_remark = `${num} ${saleorder_remark.replaceAll(regexp, "")}`;
                // console.log(saleorder_remark);
                let lackGoodsjson = doc.querySelector('[name="lackGoodsjson"]').innerHTML;
                let saveaudit = doc.querySelector('[name="saveaudit"]').value;
                // let oldFromData = doc.querySelector('[name="oldFromData"]').value;

                let from_date = {
                    'saleorder_id': saleorder_id,
                    'saleorder_businessdate': saleorder_businessdate,
                    'saleorder_status': saleorder_status,
                    'saleorder_customerid': saleorder_customerid,
                    'saleorder_salestype': saleorder_salestype,
                    'saleorder_urgentlevel': saleorder_urgentlevel,
                    'saleorder_storageid': saleorder_storageid,
                    'saleorder_salesdept': saleorder_salesdept,
                    'saleorder_salesuser': saleorder_salesuser,
                    'saleorder_sourceid': saleorder_sourceid,
                    'saleorder_remark': saleorder_remark,
                    'goodsjson': goodsjson,
                    'lackGoodsjson': lackGoodsjson,
                    'saveaudit': saveaudit,
                    // 'oldFromData':oldFromData,
                };
                resolve(from_date);
                // console.log(from_date);

                // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            }
        };

        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}

// module 更新订单
function updateOrder(from_date){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let data;
        xhr.open('post', 'http://47.107.106.156:8888/sales/updateOrder.do');
        // 必须在xhr.send()前设置
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        // data必须是这种表单数据格式的字符串；否则服务器接受到数据，按照表单数据格式解析，实际发送的不是表单格式的数据，将会解析不出来
        if (from_date.saleorder_salestype) {
            data = `addType=real&saleorder.oldid=${from_date.saleorder_id}&saleorder.id=${from_date.saleorder_id}&saleorder.businessdate=${from_date.saleorder_businessdate}&saleorder.status=${from_date.saleorder_status}&saleorder.customerid=${from_date.saleorder_customerid}&saleorder.salestype=${from_date.saleorder_salestype}&saleorder.urgentlevel=${from_date.saleorder_urgentlevel}&saleorder.storageid=${from_date.saleorder_storageid}&saleorder.salesdept=${from_date.saleorder_salesdept}&saleorder.salesuser=${from_date.saleorder_salesuser}&saleorder.sourceid=${from_date.saleorder_sourceid}&saleorder.remark=${from_date.saleorder_remark}&goodsjson=${from_date.goodsjson}&lackGoodsjson=${from_date.lackGoodsjson}&saveaudit=${from_date.saveaudit}`;
        } else {
            data = `addType=real&saleorder.oldid=${from_date.saleorder_id}&saleorder.id=${from_date.saleorder_id}&saleorder.businessdate=${from_date.saleorder_businessdate}&saleorder.status=${from_date.saleorder_status}&saleorder.customerid=${from_date.saleorder_customerid}&saleorder.urgentlevel=${from_date.saleorder_urgentlevel}&saleorder.storageid=${from_date.saleorder_storageid}&saleorder.salesdept=${from_date.saleorder_salesdept}&saleorder.salesuser=${from_date.saleorder_salesuser}&saleorder.sourceid=${from_date.saleorder_sourceid}&saleorder.remark=${from_date.saleorder_remark}&goodsjson=${from_date.goodsjson}&lackGoodsjson=${from_date.lackGoodsjson}&saveaudit=${from_date.saveaudit}`;
        }
        xhr.send(encodeURI(data));
        xhr.onload = function() {
            if (xhr.status != 200) { // 分析响应的 HTTP 状态
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
            } else { // 显示结果
                let xhrString = JSON.parse(xhr.response)
                console.log(xhrString.flag);
                resolve(xhrString.flag);
            }
        };
        xhr.onerror = function() {
            alert("Request failed");
        };
    })
}