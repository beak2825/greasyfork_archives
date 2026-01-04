// ==UserScript==
// @name         SiyecaoHepler
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  try to take over the insurance!
// @author       Cat
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        http://issue.cpic.com.cn/*
// @match        http://157.122.153.67:9000/khyx/*
// @match        https://icorepnbs.pingan.com.cn/icore_pnbs/do/usermanage/systemTransfer
// @match        https://icore-pts.pingan.com.cn/ebusiness/login.do
// @match        https://pacas-login.pingan.com.cn/cas/PA003/ICORE_PTS/login
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/400614/SiyecaoHepler.user.js
// @updateURL https://update.greasyfork.org/scripts/400614/SiyecaoHepler.meta.js
// ==/UserScript==
//人保
(function() {
    'use strict';
    //报价单查询页面url
    var quotationSearch = "/khyx/pages/qth/quotesearch/QTQuoteSearch.jsp";
    //投保单查询页面url
    var proposalSearch = "/khyx/qth/proposalsearch/prepareQuery.do";
    //报价器页面url
    var calcTab = "/khyx/qth/price/prepareQuote.do";

    var piccLoginTab = "/khyx/login.jsp";

    var piccLogonTab = "/khyx/logon.do"

    if(window.location.pathname == piccLoginTab){
        //去除登录图片验证
        //$("#verDiv").remove();
    }
    if(window.location.host == "157.122.153.67:9000"){
         //添加父传子Listener
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.innerHTML = "(" + addPICCEventListener + ")()";
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    if(window.location.pathname == piccLogonTab){
        //防止返回跳转到保司页面
        //防止页面后退
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {
                window.history.pushState('forward', null, '#');
                window.history.forward(1);
            });
        }
        window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
        window.history.forward(1);
    }

    // 通用报价器同步saas
    if(window.location.pathname == calcTab){
        //添加交管按钮
        addJGButton()
        //添加同步SAAS按钮
        var tongbu_btn_html = '';
        tongbu_btn_html += '<div  style="background: #f2f2f2;text-align: center;padding:10px">';
        tongbu_btn_html += '  <a id="tongbu_btn_btn" style="display: block;height:30px; width: 20%; margin: 0 auto; line-height: 30px;border: 1px solid #888;font-size: 15px;font-weight: 700;border-radius: 5px">';
        tongbu_btn_html += '      同步到saas';
        tongbu_btn_html += '  </a>';
        tongbu_btn_html += '</div>';
        $('#box1_2').after(tongbu_btn_html);
        $('#tongbu_btn_btn').click(function(){
            if(!parent.parent.parent.parent.length){
                alert("保司系统未在saas系统中，无法进行同步")
                event.stopPropagation();
                return
            }
            var params ={
                plateNumber: $("[id='prpCitemCar.licenseNo']").val(),
                engineNo: $("[id='prpCitemCar.engineNo']").val(),
                vinNo: $("[id='prpCitemCar.vinNo']").val(),
                carOwner: $("#carOwner").val(),
                enrollDate: $("[id='prpCitemCar.enrollDate']").val(),
                forceQuotationNo: $("#quotationNoCI").val(),
                businessQuotationNo: $("#quotationNoBI").val(),
                payStatus:false
            };
            console.log("你点击了确定, 同步到saas:" + params);
            parent.parent.parent.parent.postMessage({
                data:params
            },'*');
        });
    }
    // 报价单查询页面跳转改写
    setTimeout(function(){
        if($(".datagrid-cell-c1-quotationNoBI").length >0){
            $('.datagrid-cell-c1-quotationNoBI > a').each(function(){
                $(this).attr("target","_self");
            });
        }

    },2000)

    //支付/投保单查询同步saas
    var tongbu_btn = '';
    tongbu_btn += '<td>';
    tongbu_btn += ' <a href="javascript:void(0)" class="l-btn l-btn-plain" group="" id="tongbuSaas">';
    tongbu_btn += ' <span class="l-btn-left"><span class="l-btn-text icon-edit l-btn-icon-left">同步到saas</span></span>';
    tongbu_btn += ' </a>';
    tongbu_btn += '</td>';
    $("#container table tbody tr:last td input:first").click(function(){
        // if($(".datagrid-toolbar table tbody tr td").length ==4){
        if($("#tongbuSaas").length ==0){
            $(".datagrid-toolbar table tbody tr td:last").after(tongbu_btn);
            $("#tongbuSaas span").click(function(){
                if(!parent.parent.parent.parent.length){
                    alert("保司系统未在saas系统中，无法进行同步")
                    event.stopPropagation();
                    return
                }
                if($(".datagrid-row-selected").length==0){
                    alert("请选择一项，再进行同步")
                }else{
                    if(window.location.pathname == quotationSearch){
                        //同步报价单
                        synQuotation();
                    }else if(window.location.pathname == proposalSearch){
                        //同步投保单
                        synProposal();
                    }
                }
                event.stopPropagation();
            })
        }
    });

    function addPICCEventListener() {
        //接收跨域信息
        window.addEventListener('message', function(e){
            var data = e.data
            if(data.vin){//交管查询
                var win = window.frames['main'].frames['mainwindow']
                var doc = win.document;
                doc.getElementById('prpCitemCar.vinNo').value = data.vin;
                //doc.getElementById('prpCitemCar.engineNo').value = data.engineNo;
                //doc.getElementById('carOwner').value = data.carOwner;
                //doc.getElementById('prpCitemCar.brandName').value = data.vehicleName;
                //doc.getElementById('prpCitemCar.enrollDate').value = ConvertTimeStamp(data.registerDate);
                //win.ItemCar.JSPlatQueryCheck();
                win.ItemCar.JSVehicleCodeQuery();//人保营销交管查询
                //isrenewable(2);
            }else if(data.accountDesc){//塞账号密码
                $("input[name=j_username]").val(data.username);
                $("input[name=j_password]").val(data.password);
                $("input[name=j_username]").css("cursor","not-allowed");
                $("input[name=j_username]").attr("readonly","readonly");
                if($("#j_password").length <1){
                    $("input[name=j_username]").after('<input name="l_password" type="password" id="j_password" value="A3**********" class="input_2 input" readonly="readonly"/>');
                    $("#j_password").css("cursor","not-allowed");
                }
                $("input[name=j_password]").height(0);
                $("input[name=j_password]").width(0);
                $("#verDiv").remove();
            }
        }, false);
        function ConvertTimeStamp(timestamp){
            var now = new Date(timestamp);
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            var date=now.getDate();
            return year+"-"+month+"-"+date;
        }
    }

})();
//同步报价单
function synQuotation(){
    var list = $(".datagrid-row-selected");
    var params ={
        plateNumber: list.find("td:eq(1) div").text(),
        forceQuotationNo: list.find("td:eq(5) a").text(),
        businessQuotationNo: list.find("td:eq(2) a").text(),
        payStatus:false
    }
    parent.parent.parent.parent.postMessage({
        data:params
    },'*');
}
//同步投保单
function synProposal(){
    var list = $(".datagrid-row-selected");
    var params ={
        plateNumber: list.find("td:eq(5) div").html(),
        frameNo: list.find("td:eq(6) div").html(),
        insuredName: list.find("td:eq(7) div").html(),
        poliNo: list.find("td:eq(23) div").html(),
        payStatus:true
    }
    var QuotationNo = list.find("td:eq(1) div a").html();
    if(QuotationNo.startsWith("TDAA")){
        params.businessQuotationNo = QuotationNo
    }else{
        params.forceQuotationNo = QuotationNo
    }
    parent.parent.parent.parent.postMessage({
        data:params
    },'*');
}

function addJGButton(){
    // 添加交管查询按钮
    var jiaoguanBtn= '';
    jiaoguanBtn += '<tr>';
    jiaoguanBtn += '    <td>交管查询</td>';
    jiaoguanBtn += '    <td colspan="2">';
    jiaoguanBtn += '        <a id="jiaoguanBtnc" href="#"><img src="http://157.122.153.67:9000/khyx/pages/qth/images/search.png"></a>';
    jiaoguanBtn += '    </td>';
    jiaoguanBtn += '</tr>';
    $('#carInfoPanel table tbody tr').eq(0).after(jiaoguanBtn);

    $('#jiaoguanBtnc').click(function(){
        var reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
        var  plateNumbers = $("[id='prpCitemCar.licenseNo']").val();
        if(!reg.test(plateNumbers)){
            Common.errorMessage("输入的车牌号码有误！")
            return false
        }

        var params ={
            query:"picc",//传递到saas的时候用来判断是不是交管查询
            plateNumber: $("[id='prpCitemCar.licenseNo']").val(),
        }
        parent.parent.parent.parent.postMessage({
            data:params
        },'*');
    })
}

//太保
(function() {
    //'use strict';
    //报价同步url
    var quotationSyn = "/ecar/view/portal/page/car_insurance/insurancePlan.html";
    var carInfoTab = "/ecar/view/portal/page/car_insurance/carInfo.html";
    var loginTab = "/ecar/view/portal/page/common/login.html";
    var enterTab = "/ecar/view/portal/page/common/partnerselect.html";
    var proposalSyn = "/ecar/view/portal/page/searchPay/searchPay.html";
    var payTab = "/ecar/view/portal/page/premium_payment/premium_payment.html"
    //与元数据块中的@grant值相对应，功能是生成一个style样式
    //GM_addStyle('#syn_btn');

    //同步报价
    if(window.location.pathname == quotationSyn){
        var syn_btn = '<button id="synQuotation" style="border-radius:20px; width: 100px; background-color: #4CAF50;text-align: center;font-size: 17px;cursor: pointer;color: white;line-height: 39px;margin:4px 0 0 90px;border: 0;" >报价同步</button>';
        //将以上拼接的html代码插入到网页里的ul标签
        var syn_tag = $("#premiumTrial");
        if (syn_tag) {
            syn_tag.after(syn_btn);
        }
        $('#synQuotation').click(function(){
            if($("#totalPremium").text() == "" || $("#totalPremium").text() == null){
                alert("请先进行报价!")
                return
            }
            var params ={
                plateNumber: oPlateNo,
                businessQuotationNo: $("#billCode").text(),
                payStatus:false
            };
            if(!parent.length){
                alert("保司系统未在saas系统中，无法进行同步")
                event.stopPropagation();
                return
            }
            parent.postMessage({
                data:params
            },'*');
        });
    }

    //同步投保单
    if(window.location.pathname == proposalSyn){
        var syn_btn = '<a id="synProposal" class="cursor" style="width: 80px;">同步到saas</a>';
        //将以上拼接的html代码插入到网页里的ul标签
        var syn_tag = $("#reject");
        if (syn_tag) {
            syn_tag.after(syn_btn);
        }
        $('#synProposal').click(function(){
            if($("input[name='searchCheckbox']:checked").length != 1){
                alert("请选择一条记录进行同步!")
                return ;
            }
            var jsonData =  $("input[name='searchCheckbox']:checked").parent().parent().attr("data")
            if(jsonData){
                var parseData = $.parseJSON(jsonData);
                if(parseData){
                    var params ={
                        businessQuotationNo: parseData.insuredNo,
                        payStatus:true
                    };
                    if(!parent.length){
                        alert("保司系统未在saas系统中，无法进行同步")
                        event.stopPropagation();
                        return
                    }
                    parent.postMessage({
                        data:params
                    },'*');
                }

            }else{
                alert("未找到选择的列!")
            }
        });
    }


    //登录页修正跳转
    if(window.location.pathname == loginTab){
        $("#j_login").hide()
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.innerHTML = "(" + embed + ")()";
        document.getElementsByTagName('head')[0].appendChild(script);

        function embed() {
            $("#j_login").after('<a class="input_a" id="saas_login" disabled="disabled">立即登录</a>');

            function checkOut() {
                if ($("#_password").val() != "" && $("#_password").val() != "**********") {
                    $("#j_password").val($("#_password").val());
                }

                if ($("#verifyCode").val() == ""){
                    $("#err").empty();
                    $("#err").append("验证码不能为空！");
                    return false;
                }

                if ($("#j_password").val() == ""||$("#_password").val()=="" || $("#j_username").val() == "" || $("#j_username").val() == "请输入用户名"){
                    $("#err").empty();
                    $("#err").append("用户名、密码不能为空！");
                    return false;
                }

                if ($("#j_username").val().length > 30 || $("#_password").val().length > 30) {
                    $("#err").empty();
                    $("#err").append("用户名、密码字符长度不能超过30！");
                    return false;
                }
                if(!$(".phoneCodeSp").hasClass('hidden') && $("#checkPhoneCode").val() == ''){
                    $("#err").empty();
                    $("#err").append('短信验证码不能为空');
                    return false;
                }
                return true;
            }

            $("#saas_login").click(function(){
                var flag = 1;
                if (!checkOut()) {
                    return false;
                }

                $("#saas_login").attr("disabled",true).text("登录中...");
                $("#err").empty();

                var j_password = CryptoJS.SHA256($("#j_password").val()+$("#j_username").val());
                if(isSecurity($("#j_password").val()) == 2 || isSecurity($("#j_password").val()) == 3){
                    flag = 0;
                }

                $.ajax({
                    type:"POST",
                    dataType:"text",
                    url:"../../../../j_spring_security_check",
                    data:"j_password="+j_password+"&j_username="+$('#j_username').val()+"&verify_code="+$('#verifyCode').val()+"&verifi_catCode="+$('#checkPhoneCode').val()+"&p_tag="+getEncryptTag(flag),
                    success: function (data) {
                        var ret = $.parseJSON(data);
                        if (ret.authentication == "true") {
                            if (ret.reqUri) {
                                window.location.href = ret.reqUri;
                                return;
                            }
                        }
                        else {
                            var holdPwd = false;
                            var errCode = ret.errCode;
                            var errMsg = "登录失败，请稍候再试！";
                            if (errCode == "1") {
                                errMsg = "用户名或密码错误！";
                            }
                            if (errCode == "2") {
                                errMsg = "用户已被锁定！";
                            }
                            if (errCode == "3") {
                                errMsg = "图形验证码错误！";
                                holdPwd = true;
                            }
                            if (errCode == "4") {
                                errMsg = "密码已过期！";
                                modifyInvaidPwd("已过期");
                            }
                            if (errCode == "6") {
                                errMsg = "非工作时间，无法登录系统";
                            }
                            if (errCode == "7") {
                                errMsg = ret.errMsg;
                            }
                            if (errCode == "8") {
                                errMsg = "当前密码安全度较低！";
                                modifyInvaidPwd("安全度较低");
                            }
                            $("#err").append(errMsg);
                            refreshImg();

                            $('#verifyCode').val("");
                            if (!holdPwd) {
                                $("#_password").val("");
                                $('#j_password').val("");
                            }
                        }

                    },
                    error: function(xmlHttpRequest,textStatus,errorThrow){
                        dialogs.error("登录失败，请稍候再试！", errorTittle);
                        $("#saas_login").attr("disabled",false).text("登录");
                    },
                    complete : function(XMLHttpRequest){
                        if(XMLHttpRequest.readyState < 4){
                            ajaxReq.abort();
                            dialogs.error("请求超时！",errorTittle);
                        }
                        $("#saas_login").attr("disabled",false).text("登录");
                    }
                });
            });
        }
    }
    //机构选择页修正跳转
    if(window.location.pathname == enterTab){
        $("#loginBtn").hide();
        var scriptS = document.createElement('script');
        scriptS.type = "text/javascript";
        scriptS.innerHTML = "(" + inject + ")()";
        document.getElementsByTagName('head')[0].appendChild(scriptS);

        function inject() {
            $("#loginBtn").after('<input class="input_a" style="cursor:pointer; border: 0px; border-radius: 5px; float: left;" type="button" id="saas_loginBtn" value="确定">');

            $("#saas_loginBtn").click(function(){
                var partnerCheckedRadio = $("#partnerGrid input[name='partnerCode']:checked");

                var partnerSize = $(partnerCheckedRadio).size();
                if (partnerSize != 1) {
                    dialogs.warning("请选择终端！", "提示");
                    return;
                }

                var agentCheckedRadio = $("#partnerGrid input[name='agentCode']:checked");
                var agentSize = $(agentCheckedRadio).size();
                if (agentSize != 1) {
                    dialogs.warning("请选择经办人！", "提示");
                    return;
                }

                var partner = JSON.parse($(partnerCheckedRadio).parents("tr").attr("data"));

                var partnerCode = partner.partnerCode;
                var userCode = partner.userCode;
                var accessToken = partner.accessToken;

                var agentIndex = $("#partnerGrid input[name='agentCode']").index(agentCheckedRadio);
                var agent = partner.agentAuthVos[agentIndex];

                var agentCode = agent.agentCode || "";

                var params = {
                    "access_token": accessToken,
                    "partner_code": partnerCode,
                    "j_username": userCode,
                    "agent_code": agentCode
                };

                if (!$("#agencyCode").prop("disabled")) {
                    var agencyName = $("#agencyName").text();
                    var agencyCode = $("#agencyName").data("agencyCode") || "";

                    if (!agencyCode || !agencyName) {
                        dialogs.warning("请输入正确的代理点代码！", "提示");
                        return;
                    }

                    params["agency_code"] = agencyCode;
                }

                if (requireMacCheck() && partner.macAddressRequired) {
                    var macAddr = getAndCheckMacAddress();
                    if (!macAddr) {
                        return;
                    }

                    params["mac_address"] = macAddr;
                }

                if(partner.cooperatorVo){
                    if(partner.cooperatorVo.status && partner.cooperatorVo.status == 1){
                        dialogs.warning("该终端合作伙伴已失效！", "提示");
                        return;
                    }
                }

                $("#saas_loginBtn").attr("disabled", true);

                $.ajax({
                    type: "POST",
                    dataType: "text",
                    url: "../../../../j_spring_security_check",
                    data: params,
                    success : function(result) {

                        var ret = JSON.parse(result);
                        if (ret.authentication == "true") {
                            window.location.href = ret.reqUri || "index.html";
                        }
                        else {
                            var errCode = ret.errCode;
                            if (errCode == "5" && requireMacCheck()) {
                                dialogs.warning("当前电脑的 MAC 地址未与对应终端绑定，请联系分公司管理员处理！", "提示");
                                $("#saas_loginBtn").prop("disabled", false);
                            }
                            else {
                                dialogs.error("终端登录失败！", "提示", ["confirm"], function () {
                                    window.location.href = "login.html";
                                });
                            }
                        }
                    },
                    error : function(xmlHttpRequest, textStatus, errorThrow) {
                        $("#saas_loginBtn").attr("disabled", false);
                    },
                    complete : function(XMLHttpRequest) {
                        if (XMLHttpRequest.readyState < 4) {
                            dialogs.error("请求超时！", "提示");
                        }
                    }
                });
            });
        }
    }

    //修正PageOn函数
    if(window.location.pathname == payTab){
        IndigoSoftware.PageOn = function(){
            console.log("调用了IndigoSoftware.PageOn");
        }
    }
    if(window.location.host == "issue.cpic.com.cn"){
        var scripts = document.createElement('script');
        scripts.type = "text/javascript";
        scripts.innerHTML = "(" + addCPICEventListener + ")()";
        document.getElementsByTagName('head')[0].appendChild(scripts);
    }
})();
function addCPICEventListener() {
    //接收跨域信息
    window.addEventListener('message', function(e){
        var data = e.data
        if(data.accountDesc){//塞账号密码
            $("#j_username").val(data.username);
            $("#_password").val(data.password);
            $("#j_username").css("cursor","not-allowed");
            $("#j_username").attr("readonly","readonly");
            if($("#j_passwords").length <1){
                $("#_password").after('<input type="password" class="form-control login-password" id="j_passwords" placeholder="密码" value="A3**********" autocomplete="off" readonly="readonly">');
                $("#j_passwords").css("cursor","not-allowed");
            }
            $("#_password").css('display','none');
            $("#_password").width(0);
        }
    }, false);
}

//平安
(function() {
    'use strict';
    //接收跨域信息
    if(window.location.pathname == "/cas/PA003/ICORE_PTS/login"){
        window.addEventListener('message', function(e){
            var data = e.data
            if(data.accountDesc){//塞账号密码
                $("#username").val(data.username);
                $("#password").val(data.password);
                $("#username").css("cursor","not-allowed");
                $("#username").attr("readonly","readonly");
                if($("#j_passwords").length <1){
                    $("#password").after('<input id="j_passwords" name="password" type="password" class="form_control" tabindex="2" value="**********"  readonly="readonly" placeholder="请输入UM密码" autocomplete="off">');
                    $("#j_passwords").css("cursor","not-allowed");
                }
                $("#password").css('display','none');
                $("#password").width(0);
            }
        }, false);
    }

    window.onload=function(){
        //增加报价跳转按钮
        $('#nav').append('<li class="spilt"></li><li><a href="https://icore-pts.pingan.com.cn/ebusiness/auto/newness/toibcswriter.do?transmitId=apply&partnerCode=">同步保司</a></li><li class="spilt"></li>')
        $("#nav li a").width(150);
        if(window.location.pathname == "/icore_pnbs/do/usermanage/systemTransfer"){
            //增加同步保司按钮
            var tongbu_btn_html = '';
            tongbu_btn_html += '<li ng-repeat="ml in homeCtrl.menuList" class="ng-scope">';
            tongbu_btn_html += '<a id="synSaas" ng-click="homeCtrl.linkEvt($event, ml)"  class="dropdown-toggle">';
            tongbu_btn_html += '   <i class="icon-batchApply"></i>';
            tongbu_btn_html += '   <span class="menu-text ng-binding">同步保司</span>';
            tongbu_btn_html += '   <!-- ngIf: ml.isToggle --><b ng-if="ml.isToggle" class="ng-scope icon-angle-up"></b>';
            tongbu_btn_html += '</a>';
            tongbu_btn_html += '</li>';
            $("#nav-list").append(tongbu_btn_html);
            $("#synSaas").click(function(){
                var doc = $(document.getElementById('main').contentWindow.document)
                var quotationNo = doc.find(".quotationNo span").text().split("：")[1];
                if(!quotationNo){//个人出单界面
                    if(doc.find(".widget-title h2").html() == "信息查询"){//同步保单
                        if(doc.find(".table tbody input:checked").length > 2 && doc.find(".table tbody input:checked").length <= 0){
                            alert("请至多勾选两条记录！");
                            return;
                        }
                        var trDoc = $(doc.find(".table tbody input:checked")[0]).parents("tr")
                        var plateNo = trDoc.find("td:eq(4)").text();
                        var focNo = "",bizNo = ""
                        if(trDoc.find("td:eq(3)").text() == "机动车交通事故责任强制保险"){
                            focNo = trDoc.find("td:eq(2)").text();
                        }else{
                            bizNo = trDoc.find("td:eq(2)").text();
                        }
                        var params ={
                            plateNumber: plateNo.replace("-",""),
                            businessQuotationNo:bizNo,
                            forceQuotationNo:focNo,
                            payStatus:true
                        }
                        parent.parent.postMessage({
                            data:params
                        },'*');
                    }else{
                        alert("请进入个人出单或投保跟踪界面！");
                        return;
                    }
                }else{//同步报价
                    var totalAmount = doc.find("#cnbsLastYearPayInfoDiv").prev().find("span strong").text();
                    if(totalAmount == 0){
                        alert("请先进行报价！");
                        return;
                    }
                    var params ={
                        plateNumber: doc.find("#vehicleLicenseCodeId").val().replace("-",""),
                        businessQuotationNo: quotationNo,
                        payStatus:false
                    };
                    if(!parent.parent.length){
                        alert("保司系统未在saas系统中，无法进行同步")
                        event.stopPropagation();
                        return
                    }
                    parent.parent.postMessage({
                        data:params
                    },'*');
                }
            });
        };
    }
})();