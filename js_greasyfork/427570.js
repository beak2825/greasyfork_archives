{// ==UserScript==
// @name         工作帮助脚本
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @version      0.0.9
// @description  这是一个帮助您快速完成工作的脚本!
// @author       You
// @match        https://gugong.ktmtech.cn/*
// @match        https://gugongm.ktmtech.cn/*
// @match        http://ticket.cdstm.cn/*
// @match        http://ticket.chnmuseum.cn/*
// @match        http://b.sanmaoyou.com/*
// @match        http://ebk.17u.cn/*
// @match        tts2.piao.qunar.com/*
// @match        https://my.12301.cc/*
// @match        http://pcticket.cstm.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427570/%E5%B7%A5%E4%BD%9C%E5%B8%AE%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427570/%E5%B7%A5%E4%BD%9C%E5%B8%AE%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
    (function () {

        var url = window.location.href
        if (url.indexOf("my.12301.cc") != -1) {
            if ("https://my.12301.cc/orderquery.html" == url) {


                PUI_Message.success("工作插件载入操作成功")
                function getStartDate() {
                    let line_list = document.getElementsByClassName("line")
                    let new_line_list = []
                    for (var i = 0; i < line_list.length; i++) {
                        if (line_list[i].innerText.indexOf("预计游玩") != -1) {
                            new_line_list.push(line_list[i])
                        }
                    }

                    let box_list = document.getElementsByClassName("info_box-pay-status")
                    let new_box_list = []
                    for (let i = 0; i < box_list.length; i++) {
                        if (i % 2 == 0) {
                            new_box_list.push(box_list[i])
                        }
                    }

                    for (let i = 0; i < new_box_list.length; i++) {
                        new_box_list[i].innerText = new_line_list[i].innerText
                    }


                }

                function refresh() {
                    document.getElementsByClassName("remark")[0].click()
                    document.getElementsByClassName("dia-yes")[0].click()
                }

                function stareOrder() {
                    alert("开启盯单模式，每3分钟自动刷新订单一次")
                    setInterval(function () {
                        refresh()
                    }, 180000)
                }

                //票付通  返回所有用户身份证信息
                function getUserList(){
                    var userList = document.querySelector("#tableTouristInfo > div > div.el-table__body-wrapper.is-scrolling-none > table > tbody").children;
                    document.querySelector("#tableTouristInfo > div > div.el-table__body-wrapper.is-scrolling-none > table > tbody")
                    var length=userList.length;
                    var newUserList="";
                    for (var i=0;i<length;i++){
                        var username=userList[i].children[3].textContent.replaceAll("\n","").replaceAll("    ", "");
                        var usernumber=userList[i].children[5].textContent.replaceAll("\n","").replaceAll("    ", "");
                        newUserList+=username+"身份证"+usernumber
                        if(i!=length-1){
                            newUserList+="\n"
                        }
                    }
                    return newUserList;
                }


                setTimeout(function () {

                    var line_btn = document.getElementsByClassName("filter-more__line--btn")[0]
                    var button_element = document.createElement("button");
                    button_element.className = 'pft-btn pft-btn--border-grey';
                    button_element.innerText = "显示出行日期"
                    button_element.onclick = getStartDate


                    var button_element2 = document.createElement("button");
                    button_element2.className = 'pft-btn pft-btn--border-grey';
                    button_element2.innerText = "刷新"
                    button_element2.onclick = refresh

                    var button_element3 = document.createElement("button");
                    button_element3.className = 'pft-btn pft-btn--border-grey';
                    button_element3.innerText = "自动刷新"
                    button_element3.onclick = stareOrder

                    var button_element4 = document.createElement("button");
                    button_element4.className = 'copy_button pft-btn pft-btn--border-grey';
                    button_element4.innerText = "复制证件"


                    line_btn.appendChild(button_element4)
                    line_btn.appendChild(button_element)
                    line_btn.appendChild(button_element2)
                    line_btn.appendChild(button_element3)



                    // setTimeout(function(){
                    //     document.body.oncopy = function() {
                    //         event.returnValue = false;
                    //         document.querySelector("#orderQueryWrap > div.filter-box > div > div.filter-more.fadeIn > div.filter-more__line--btn > button.copy_button.pft-btn.pft-btn--border-grey").click()
                    //
                    //     }
                    // })

                    //把证件信息放到剪贴板里
                    var clipboard = new ClipboardJS('.copy_button', {
                        text: function(trigger) {
                            return getUserList();
                        }
                    });
                    //复制成功
                    clipboard.on('success', function(e) {
                        PUI_Message.success("复制成功")
                        e.clearSelection();
                    });
                    //复制失败
                    clipboard.on('error', function(e) {
                        PUI_Message.error("复制失败")
                    });

                    //删除CLass 让DIV居左
                    var div_class=document.querySelector("#orderQueryWrap > div.filter-box > div > div.filter-more.fadeIn.filter-more--hide > div.filter-more__line.filter-more__line--btn").getAttribute("class")
                    div_class=div_class.replace("filter-more__line","")
                    document.querySelector("#orderQueryWrap > div.filter-box > div > div.filter-more.fadeIn.filter-more--hide > div.filter-more__line.filter-more__line--btn").setAttribute("class",div_class)

                }, 1000)


            }

        }


        //新科技馆脚本
        if (url.indexOf("pcticket.cstm.org.cn/") != -1) {

            var lastUrl = "http://pcticket.cstm.org.cn/"

            function copy(e) {
                //获取剪切板
                var carded = e.clipboardData.getData("text");
                var userList = carded.split("\r");
                //根据界面INPUT数量，获取游玩人input的位置
                var addvalue = 0;
                //获取input数量
                if (document.getElementsByTagName("input").length == 15) {
                    addvalue = 1
                }

                for ( i = 0; i < userList.length; i++) {
                    if (i != 0) {
                        //科技馆 添加游玩人
                        setTimeout(function () {
                            //todo:待删除部分
                            userList[1] = userList[1].replace("/", "")
                            var user = userList[1].replace(/\s*/g, "").split("身份证");
                            userList.splice(0,1)
                            if(userList.length!=1){
                                document.querySelector("#app > div.fill_info > div.panel > div.edit > div.add_visitor").click()
                            }
                            inputUser(user[0], user[1], addvalue)
                        }, 300)
                    } else {
                        //todo:待删除部分
                        userList[i ] = userList[i].replace("/", "")
                        var user = userList[i].replace(/\s*/g, "").split("身份证");
                        inputUser(user[0], user[1], addvalue)
                        if(userList.length!=1){
                            document.querySelector("#app > div.fill_info > div.panel > div.edit > div.add_visitor").click()
                        }
                    }


                }


            }

            function inputUser(name, number, addvalue) {
                var inputList = document.getElementsByTagName("input");
                var length = inputList.length;
                //添加最后一位姓名
                var userName = inputList[length - 5 + addvalue];
                userName.value = name
                //获取最后一位身份号
                inputList[length - 3 + addvalue].value = number;
            }

            setInterval(function () {
                var currentUrl = window.location.href
                if (currentUrl != lastUrl) {

                    lastUrl = currentUrl
                    document.removeEventListener("paste", copy)
                    refresh(currentUrl)
                }
            }, 100)

            //重新执行科技馆脚本
            function refresh(url) {
                //科技馆首页
                if (url == "http://pcticket.cstm.org.cn/") {
                    document.onkeydown = function (event) {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        if (e && e.keyCode == 32) { // 按 空格键
                            if (window.location.href == "http://pcticket.cstm.org.cn/") {
                                document.querySelector("#app > div.choose_date > div > div.calendar_container > div.ticket_box > div.__content > button > span").click()
                            } else {
                                console.log("非首页")
                            }
                        }
                    };
                }
                //选择场馆
                if (url == "http://pcticket.cstm.org.cn/personal/choose_hall") {
                    setTimeout(function () {
                        document.querySelector("#app > div.choose_hall > div.hall > div:nth-child(2) > div.content > div.btns > button").click()
                        setTimeout(function () {
                            document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary > span").click()
                        }, 500)
                    }, 500)
                }
                //科技馆购票页面
                if (url.indexOf("pcticket.cstm.org.cn/personal/fill_info?hallId") != -1) {
                    //科技馆 获取最新一个姓名 证件号

                    document.addEventListener("paste", copy);
                }
                //确认订单
                if (url.indexOf("pcticket.cstm.org.cn/personal/check_info?hallName=") != -1) {
                    setTimeout(function () {
                        document.querySelector("#app > div.check_info > div.panel > div.btns > div:nth-child(1) > i").click();
                    }, 300)
                }
                //订单结算
                if (url.indexOf("pcticket.cstm.org.cn/personal/pay?") != -1) {
                    setTimeout(function () {
                        document.querySelector("#app > div.pay > div.btns > div.content > div:nth-child(2) > img:nth-child(1)").click();
                        setTimeout(function () {
                            document.querySelector("#app > div.pay > div.btns > div.content > button.el-button.btn.float_right.btn_bg.el-button--primary > span").click();
                        }, 300)
                    }, 300)


                }
                //获取科技馆订单号
                if (url.indexOf("pcticket.cstm.org.cn/personal/success?orderNum=") != -1){
                    var orderId=url.split("=")[2]

                    var btns=document.getElementsByClassName("btns")[0]
                    var copy_button = document.createElement("button");
                    copy_button.className = 'copy_button el-button btn float_right btn_bg el-button--primary';
                    copy_button.innerText = "复制订单号"
                    btns.appendChild(copy_button)

                    //把证件信息放到剪贴板里
                    var clipboard = new ClipboardJS('.copy_button', {
                        text: function(trigger) {
                            var phoneNumber= eval("(" + localStorage.getItem("personal_user") + ")").phoneNumber;

                            return phoneNumber+"  "+orderId;
                        }
                    });

                    clipboard.on('success', function(e) {
                        document.querySelector("#app > div.success > div.btns > button.el-button.btn.float_right.info.el-button--default").click()
                        e.clearSelection();
                    });

                    clipboard.on('error', function(e) {
                        alert("复制失败")
                    });

                }
                //订单详情
                if(url.indexOf("pcticket.cstm.org.cn/personal/order_list")!=-1){

                    document.addEventListener("paste", function (e) {
                        var order_id  = e.clipboardData.getData("text")
                        var url = "http://pcticket.cstm.org.cn/personal/order_detail?orderId=" + order_id
                        window.location.href = url;
                    })

                }
            }


        }

        //故宫脚本
        if (url.indexOf("gugong.ktmtech.cn") != -1) {

            //首页
            if ("https://gugong.ktmtech.cn/" == url || "https://gugong.ktmtech.cn/Home/Index" == url) {
                var body = document.getElementsByClassName("banner_t_buy_foot")[0];
                var input = document.createElement("input");
                var strdate = document.getElementById("strdate");
                input.id = 'startDate';
                input.type = "date";
                input.onchange = reviseDate
                input.style.width="70px"
                body.appendChild(input);


                let chnmuseum_body = document.getElementsByTagName('body')[0];
                let isNextButton = document.createElement("button");
                isNextButton.id = "select_order";
                isNextButton.style.position = 'absolute';
                isNextButton.style.left = '90%';
                isNextButton.style.top = '500px';
                isNextButton.onclick=isNextFunction

                if(localStorage.getItem("isNextGuide")!=0){
                    isNextButton.innerHTML="点击跳过选购导游";
                }else{
                    isNextButton.innerHTML="点击不跳过选购导游";
                }

                chnmuseum_body.appendChild(isNextButton)


                //document.cookie = "isQ = False; path=/;domain=.ktmtech.cn";

                function reviseDate() {
                    var startDate = document.getElementById("startDate").value;
                    strdate.value = startDate;
                }

                function isNextFunction() {
                    if(localStorage.getItem("isNextGuide")!=0){
                        localStorage.setItem("isNextGuide",0)
                    }else{
                        localStorage.setItem("isNextGuide",1)
                    }
                    location.reload();
                }
            }

            //选购页
            if (url.indexOf("https://gugong.ktmtech.cn/OrderSingle/PersonInfo") != -1 || url.indexOf("https://gugong.ktmtech.cn/OrderTravel/PersonInfo") != -1) {


                document.onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    if (e && e.keyCode == 32) { // 按 空格键
                        document.getElementById("next").click()

                    }
                };

                function inputUserInfo(user){
                    user = user.replace("/", "")
                    user = user.replace("-", "")
                    user = user.replace("-", "")
                    user = user.replace("-", "")
                    user = user.replace(/\s*/g, "").split("身份证");
                    if (user.length == 2) {
                        document.getElementsByName("addData")
                        var InUser_list = document.getElementsByName("InUserNo")
                        var InUserName = document.getElementsByName("InUserName")

                        InUserName[InUserName.length - 1].value = user[0]
                        InUser_list[InUser_list.length - 1].value = user[1]
                        document.getElementsByName("addData")[0].click()

                    }

                }

                document.addEventListener("paste", function (e) {
                    var carded = e.clipboardData.getData("text");

                    var userList = carded.split("\r");

                    for ( i = 0; i < userList.length; i++) {

                        inputUserInfo(userList[i])
                    }

                });

            }


            if (url.indexOf("https://gugong.ktmtech.cn/OrderTravel/SelectVenue") != -1) {
                document.getElementById("next").click()
            }
            if (url.indexOf("https://gugong.ktmtech.cn/OrderTravel/TouristGuideInfo") != -1) {
                if(localStorage.getItem("isNextGuide")==0){
                    document.getElementById("next").click()
                }
            }
            if (url.indexOf("https://gugong.ktmtech.cn/OrderTravel/Confirm") != -1) {
                document.getElementById("travelNext").click()
                setTimeout(function(){
                    document.getElementsByClassName("orderSubmit")[0].click()
                },300)

            }

            if (url.indexOf("https://gugong.ktmtech.cn/Pay/PayIndex?payinfo=") != -1) {
                document.querySelector("#payBankForm > div > div").click()
            }

            if (url.indexOf("https://gugong.ktmtech.cn/UserCenter/OrderTravel/List") != -1){
                document.addEventListener("paste", function (e) {
                    var userNo = e.clipboardData.getData("text")
                    document.getElementById("InUserNo").value=userNo.trim()
                    setTimeout(function(){
                        document.getElementById("OrderSingleListA").click()
                    },300)


                });

            }

            //抢票代码,暂不开放
            // if ('https://gugong.ktmtech.cn/OrderTravel/Confirm' == url)
            //

            if (url.indexOf("https://gugong.ktmtech.cn/Pay/PayIndex") != -1) {
                /* if (getCookie("isQ") == "True") {
                     windwosAlert("抢到票了")
                 }*/
            }
        }

        //故宮M站脚本
        if (url.indexOf("gugongm.ktmtech.cn") != -1){

            if(url=="https://gugongm.ktmtech.cn/"){
                function ajaxGuGong(){
                    var result=jQuery.ajax({
                        url: "https://gugongm.ktmtech.cn/home/get-schedule",
                        type: "POST",
                        dataType: "10",
                    });
                    return result;
                }

                function getSchedule(result){

                    //将拿到的日期数据变成一个集合
                    var resultList = eval(result.responseText);
                    var ticketList = "";
                    for(var i=0;i<resultList.length;i++){
                        let ticket = resultList[i];
                        let text = ticket.UseDate + "余" + ticket.TotalRemain+"\n";
                        ticketList += text;
                    }
                    return ticketList;
                }

                document.addEventListener("paste", function (e) {
                    var result = ajaxGuGong();
                    setTimeout(function(){
                        alert(getSchedule(result))
                    },2000)

                });
            }
        }


        //国博脚本
        if (url.indexOf("ticket.chnmuseum.cn") != -1) {
            setInterval(function () {
                var current_url = window.location.href

                if (current_url.indexOf("http://ticket.chnmuseum.cn/yuyue/success?torder_id") != -1) {
                    textContent = document.querySelector("#app > div > div > div:nth-child(2) > div:nth-child(1) > label").textContent
                    if (textContent.indexOf("订单编号") == -1) {
                        var parameter = current_url.replace("http://ticket.chnmuseum.cn/yuyue/success?", "");
                        parameter_list = parameter.split("&")
                        torder_id = parameter_list[0].split("=")[1]
                        order_sn = parameter_list[1].split("=")[1]
                        content = "订单编号:" + torder_id + " " + "预约编号:" + order_sn
                        document.querySelector("#app > div > div > div:nth-child(2) > div:nth-child(1) > label").textContent += content
                    }

                }
                //用于跳转到订单详情
                if (current_url == "http://ticket.chnmuseum.cn/yuyue/orders") {
                    if (document.getElementById("select_order") == null) {
                        let chnmuseum_body = document.getElementsByTagName('body')[0];
                        let input = document.createElement("input");
                        input.id = "select_order";
                        input.style.position = 'absolute';
                        input.style.left = '90%';
                        input.style.top = '500px';
                        input.onchange = select
                        chnmuseum_body.appendChild(input)

                        function select() {
                            var order_id = document.getElementById("select_order").value
                            var url = "http://ticket.chnmuseum.cn/yuyue/detail?order_id=" + order_id + "&orderFlag=personal"
                            window.location.href = url;
                        }
                    }
                }


                if (current_url == "http://ticket.chnmuseum.cn/yuyue/index") {
                    setTimeout(function () {
                        document.getElementsByClassName("times")[0].onclick = function () {
                            document.getElementsByClassName("btn person-order-btn")[0].click()
                        }
                    }, 500)
                }

                if (current_url.indexOf("http://ticket.chnmuseum.cn/yuyue/personal") != -1) {

                    function clickFive() {
                        document.querySelector("#app > div > div > div:nth-child(2) > div > form > div.add-div > div > div.add-tr > span:nth-child(2)").click()

                        document.querySelector("#app > div > div > div:nth-child(2) > div > form > div.add-div > div > div.add-tr > span:nth-child(2)").click()
                        document.querySelector("#app > div > div > div:nth-child(2) > div > form > div.add-div > div > div.add-tr > span:nth-child(2)").click()
                        document.querySelector("#app > div > div > div:nth-child(2) > div > form > div.add-div > div > div.add-tr > span:nth-child(2)").click()


                    }

                    if (document.getElementById("QQ") == null) {
                        let chnmuseum_body = document.querySelector("#app > div > div > div:nth-child(2) > div > form > div.add-div > div");
                        let input = document.createElement("span");
                        input.id = "QQ"
                        input.className = 'add-tr';
                        input.innerText = "添加5个"
                        input.onclick = clickFive
                        chnmuseum_body.appendChild(input)


                    }


                }


            }, 500)


        }

        //三毛游脚本
        if (url.indexOf("b.sanmaoyou.com") != -1) {
            //跳转到旧版三毛游
            if (url == "http://b.sanmaoyou.com/newb2b/#/home") {

                setTimeout(function () {
                    document.getElementsByClassName('functional_desc')[2].click()
                }, 1000)

            }
            //订购讲解时自动选择十天以后的日期
            if (url.indexOf("http://b.sanmaoyou.com/b2b/order_input.jsp") != -1) {

                //绑定粘贴板事件
                document.addEventListener("paste", function (e) {
                    var link_man = document.getElementById("link_man")
                    var link_phone = document.getElementById("link_phone")
                    var name = e.clipboardData.getData("text")
                    name = name.replace("/", " ")
                    name = name.replace("    ", " ")
                    name = name.replace(/\n/, " ")
                    name = name.replace(/\n/, " ")
                    name = name.replace(/\n/, " ")
                    name = name.replace(/\n/, " ")
                    name = name.replace(/\t/, " ")
                    name = name.split(" ")

                    var nameList = []
                    for (var i = 0; i < name.length; i++) {
                        name[i] = name[i].replace(/\s+/g, "");

                        if (name[i] != "") {
                            nameList.push(name[i])
                        }
                    }
                    if (nameList.length > 1) {
                        link_man.value = nameList[0]
                        link_phone.value = nameList[1]

                        // setTimeout(function () {
                        // document.getElementsByName("num")[0].value = ""
                        //  document.getElementsByName("num")[0].focus()
                        // }, 400)


                    }

                });

                document.getElementById("travel_date").click()
                setTimeout(function () {
                    document.getElementsByTagName("a")[32].click()
                }, 500)

                function updateNameAndPhone() {

                }
            }
        }

        //同程脚本
        if (url.indexOf("ebk.17u.cn/") != -1) {
            if (url.indexOf("http://ebk.17u.cn/jingqu/OpenPlatform/OrderManage/OpenPlatOrderList") != -1 || url.indexOf("http://ebk.17u.cn/jingqu/OrderManage/OpenPlatOrderList") != -1) {
                let chnmuseum_body = document.getElementsByTagName('body')[0];
                let img1 = document.createElement("img");
                let span1 = document.createElement("span");
                span1.innerText = "显示/关闭所有手机号"
                img1.title = "显示/关闭所有手机号"
                img1.src = 'http://ebk.17u.cn/jingqu/Content/img/eye.png'
                span1.style.position = 'absolute'
                span1.style.left = '70%'
                span1.style.top = '230px'
                span1.appendChild(img1)
                img1.onclick = open
                chnmuseum_body.appendChild(span1)


                function open() {
                    var eyeList = document.getElementsByClassName("eye-img");
                    for (var i = 0; i < eyeList.length; i++) {
                        eyeList[i].click()
                    }
                }


            }

        }

        //去哪儿门票脚本
        if (url.indexOf("tts2.piao.qunar.com") != -1){

            //订单详情
            if(url.indexOf("http://tts2.piao.qunar.com/order/view?displayId")!=-1){
                //去哪儿  返回所有用户身份证信息
                function getUserList(){
                    var userList = document.querySelector("body > div:nth-child(10) > div > table > tbody").children;
                    var length=userList.length;
                    var newUserList="";
                    for (var i=1;i<length;i++){
                        var username=userList[i].children[0].textContent;
                        var usernumber=userList[i].children[4].textContent;
                        newUserList+=username+"身份证"+usernumber
                        if(i!=length-1){
                            newUserList+="\n"
                        }
                    }
                    return newUserList;
                }

                //去哪儿网添加复制按钮
                let copytd=document.querySelector("body > div.info_cont.top_line > div > table > tbody > tr:nth-child(1) > td:nth-child(3)")
                var copy_button = document.createElement("button");
                copy_button.innerText = "复制证件号"
                copy_button.className="copyUserInfo"
                copytd.appendChild(copy_button)


                //把证件信息放到剪贴板里
                var clipboard = new ClipboardJS('.copyUserInfo', {
                    text: function(trigger) {
                        return getUserList();
                    }
                });

                clipboard.on('success', function(e) {
                    e.clearSelection();
                });

                clipboard.on('error', function(e) {
                    alert("复制失败")
                });
            }

        }


        //获取Cookie
        function getCookie(cookie_name) {
            var allcookies = document.cookie;
            //索引长度，开始索引的位置
            var cookie_pos = allcookies.indexOf(cookie_name);

            // 如果找到了索引，就代表cookie存在,否则不存在
            if (cookie_pos != -1) {
                // 把cookie_pos放在值的开始，只要给值加1即可
                //计算取cookie值得开始索引，加的1为“=”
                cookie_pos = cookie_pos + cookie_name.length + 1;
                //计算取cookie值得结束索引
                var cookie_end = allcookies.indexOf(";", cookie_pos);

                if (cookie_end == -1) {
                    cookie_end = allcookies.length;

                }
                //得到想要的cookie的值
                var value = unescape(allcookies.substring(cookie_pos, cookie_end));
            }
            return value;
        }

        //在windows中弹出窗口
        function windwosAlert(content) {
            Notification.requestPermission(function () {
                if (Notification.permission === 'granted') {
                    // 用户点击了允许
                    let n = new Notification(content, {
                        body: '图片!',
                        icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549464117983&di=286ad42d05b9ea9720daa1d62cd18ee5&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F8326cffc1e178a8208b90d86fc03738da977e80b.jpg'
                    })

                    setTimeout(() => {
                        n.close();
                    }, 3000)

                    n.onclick = function (e) {
                        window.open("https://www.baidu.com")
                        console.log(1, e);
                    }
                    n.onerror = function (e) {
                        console.log(2, e);
                    }
                    n.onshow = function (e) {
                        console.log(3, e);
                    }
                    n.onclose = function (e) {
                        console.log(4, e);
                    }

                } else if (Notification.permission === 'denied') {
                    // 用户点击了拒绝
                    console.log("已被拒绝")
                } else {
                    // 用户没有做决定
                    console.log("未作决定")
                }
            })
        }

        //时间工具类   GetDateStr(10)获取十天后日期   GetDateStr(-10)获取十天前日期
        function GetDateStr(AddDayCount) {

            var dd = new Date();

            dd.setDate(dd.getDate());//获取AddDayCount天后的日期

            var y = dd.getFullYear();
            console.log(y)

            var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
            console.log(m)

            var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
            console.log(d)
            return y.toString() + m.toString() + d.toString();

        }


    })();


}