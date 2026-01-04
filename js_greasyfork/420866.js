// ==UserScript==
// @name         运输订单办理页面
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @run-at       document-end
// @icon         http://icop.y2t.com/os/static/images/favicon.png
// @match        http://llncfs.transgd.com.cn:17003/cfs/jsp/phc/order/fullContainerSoEdit.jsp*
// @match        http://icop.y2t.com/cfs/jsp/phc/order/fullContainerSoEdit.jsp*
// @match        http://icop.y2t.com/dckcfs/jsp/phc/order/fullContainerSoEdit.jsp*
// @match        https://sc.y2t.com/cfs/jsp/phc/order/fullContainerSoEdit.jsp*
// @grant        GM_setClipboard
// @license MIT
// @grant        GM_getClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420866/%E8%BF%90%E8%BE%93%E8%AE%A2%E5%8D%95%E5%8A%9E%E7%90%86%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/420866/%E8%BF%90%E8%BE%93%E8%AE%A2%E5%8D%95%E5%8A%9E%E7%90%86%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
(function(){


$("#copyOrder").parent().append('<a class="easyui-linkbutton l-btn l-btn-plain" onclick="copyOrder()" id="copy" plain="true" iconcls="icon-standard-layers">批量新增</a>');
$("#copyOrder").parent().append('<a class="easyui-linkbutton l-btn l-btn-plain" onclick="subOrder()" id="submit" plain="true" iconcls="icon-standard-arrow-rotate-clockwise">作废生效</a>');

//备注自动修改时间
$("#remark").change(function(){
    $("#cutVgmTime").val('');
    $("#portOpenTime").val('');
    var text = $("#remark").val();
    text = text.replace(/\/+/g,"-");
    var str = text.split(",");//逗号是分隔符
    console.log(str)
    loop(0);
    function loop(index){
        var row = str[index].split("：");
        console.log(row)
        switch(row[0]){
            case "CY OPEN":
                $("#submitDate").datebox('setValue',row[1]);
                break;
            case "CY CUT":
                $("#cutDate").val(row[1]+":00");
                break;
            case "CV CUT TIME":
                $("#voucherSubmitTime").val(row[1]+":00");
                break;
            case "CDS S-I Cut off":
                $("#siInputTime").val(row[1]+":00");
                break;
        }
        if(index < str.length-1){
            index+=1;
            loop(index);
        }

    }
});

//作废生效
unsafeWindow.subOrder = function(){
    $('#transactionStatus').combobox('setValue', 'Pending');
    saveOrder("submitOrder");
}

//保存提交
unsafeWindow.saveOrder = function(actionType){
    var formQuery = $("#formQuery").form("getData");
    var detailDatagrid = $("#detailgrid").datagrid("getData").rows;
    var sorDatagrid = $("#sorGrid").datagrid("getData").rows;
    if(validRequireData(actionType)){
        formQuery.agentConsigneeDesc = $("#agentConsigneeCode").combogrid("getText");
        formQuery.sodList=detailDatagrid;
        formQuery.srList=sorDatagrid;
        if("submitOrder" == actionType && is_null(formQuery.mobile) && is_null(formQuery.telephoneNum)){
            $.messager.alert("提示","货代手机、座机至少一个不能为空！", "info");
            return;
        }
        if(is_null(formQuery.vesselName) || is_null(formQuery.voyage)|| is_null(formQuery.unloadPort)|| is_null(formQuery.aux2)){
            $.messager.alert("提示","应结算中心需要：【船名】,【航次号】,【船公司】,【港口】不能为空！", "info");
            return;
        }
        //保存时后台校验
        SubmitOrderManager.fullContainerSaveOrderJudge(formQuery,actionType,function(spj){
            if(spj.result){
                SubmitOrderManager.saveFullContainerSubmitOrder(formQuery,actionType,function(spj){
                    if(showMsg(spj)){
                        reloadData(spj.object);
                    }
                });
            }else{
                $.messager.confirm('确定框', spj.error, function(r){
                    if(r){
                        SubmitOrderManager.saveFullContainerSubmitOrder(formQuery,actionType,function(spj){
                            if(showMsg(spj)){
                                reloadData(spj.object);
                            }
                        });
                    }
                });
            }
        });
    }
}

//复制新增
unsafeWindow.copyOrder = function(){
    var submitOrderUuid = $("#submitOrderUuid").val();
    if(is_null(submitOrderUuid)){
        $('#flow').combo("setText","");//清除提柜地点
        $('#flow').combo("setValues","");//清除提柜地点
        $('#customsType').combo("setText","");//清除关务类型
        $('#customsType').combo("setValues","");//清除关务类型
        var timeDay = $('#submitDate').datebox('getValue');
        timeDay = timeDay.substring(0,10);
        var today = getNowFormatDate();
        if(timeDay < today){
            $.messager.alert("提示","新增订单日期不能小于当天日期,已改为今天!","info");
            $('#submitDate').datebox('setValue',today);
            return;
        }
        $.messager.prompt('批量新增运输订单', '请输入多个SO号，用英文逗号隔开:', function(r){
            if (r){
                r = r.replace(/\s+/g,",");
                if(r.indexOf(";") !== -1){
                    $.messager.alert("提示","格式不正确!","info");
                    return false;
                }
                if(r.substr(r.length-1,1) == ","){
                    r = r.substr(0, r.length - 1);//去除末尾逗号
                }
                var str = r.split(",");//逗号是分隔符
                plxz1(str);
            }
        });
    }else{
        DWREngine.setAsync(false);
        $.messager.confirm('确定框', '请先完成复制订单，是否复制?', function(b){
            if(b){
                window.location.href="fullContainerSoEdit.jsp?submitOrderUuid="+submitOrderUuid+"&officeCode="+officeCode+"&isCopyOrder=true";
            }
        });
        DWREngine.setAsync(true);
    }
}

//作废订单
unsafeWindow.cancelOrder = function (){
    var submitOrderUuid =  $("#submitOrderUuid").val();
    var controlWord = $("#controlWord").val();
    var transactionStatus = $("#transactionStatus").combobox("getValue");
    $.messager.confirm('确定框', '确定作废该订单吗?', function(b){
        if(b){
            if(!is_null(submitOrderUuid)){
                if(controlWord.charAt(3)!='F'){
                    if(transactionStatus!='Cancel'){
                        SubmitOrderManager.fullContainerCancel(submitOrderUuid,function(spj){
                            if(showMsg(spj)){
                                reloadData();
                            }
                        });
                    }else{
                        $.messager.alert("提示","该订单已作废，不可重复操作!","info");
                    }
                }else{
                    $.messager.alert("提示","已完结单证不可作废!","info");
                }
            }else{
                $.messager.alert("提示","请确认该单证已保存!","info");
            }
        }
    });
}
//解决附件上传问题
$("#tabsId").tabs({
    onSelect:function(title){
        console.log(title)
        if(title == "附件"){
            //强制注入附件格式
            imager_photo_Extension.push("jpeg","JPEG","PDF","pdf")
            console.log(imager_photo_Extension)
            $('#imagerSizeSelect').combobox('setValue', '1600x*(等比压缩)');
        }
    }
})
//批量新增
function plxz1(list){
    var actionType = "saveOrder";
    var formQuery = $("#formQuery").form("getData");//获取表单数据
    var detailDatagrid = $("#detailgrid").datagrid("getData").rows;//获取关联单明细
    var sorDatagrid = $("#sorGrid").datagrid("getData").rows;//获取装卸货地信息
    if(validRequireData(actionType)){//校验订单数据是否合规，actionType传入无作用
        formQuery.agentConsigneeDesc = $("#agentConsigneeCode").combogrid("getText");//获取委托客户名称，写入到formQuery.agentConsigneeDesc
        formQuery.sodList=detailDatagrid;//写入关联单明细
        formQuery.srList=sorDatagrid;//写入装卸货地
        if("submitOrder" == actionType && is_null(formQuery.mobile) && is_null(formQuery.telephoneNum)){//如果操作等于提交，并且手机号和座机号其一为空
            $.messager.alert("提示","货代手机、座机至少一个不能为空！", "info");
            return;//停止执行
        }
        loop(list,0,0)
        function loop(list,index,ordernum){
            var long = list.length;
            if(index < long){
                if(plxz(list[index])){
                    ordernum+=1;
                }
                index += 1;
                setTimeout(function(){
                    loop(list,index,ordernum);
                },1000);
            }else{
                $.messager.alert("提示","执行完毕，共新增"+ordernum+"条数据！", "info");
            }
        }

        function plxz(order){
            formQuery.transactionStatus = "";
            formQuery.orderNo = order;
            console.log(order)
            SubmitOrderManager.fullContainerSaveOrderJudge(formQuery,actionType,function(spj){
                console.log(spj)
                if(spj.result){
                    SubmitOrderManager.saveFullContainerSubmitOrder(formQuery,actionType,function(spj){
                        SubmitOrderManager.reloadFullContainerData(spj.object, function(spj) {
                            var formQuery = spj.object
                            var modifyQuery = {};
                            modifyQuery.cutDate = formQuery.cutDate;
                            modifyQuery.cutVgmTime = formQuery.cutVgmTime
                            modifyQuery.portOpenTime = formQuery.portOpenTime
                            modifyQuery.remark = formQuery.remark
                            modifyQuery.siInputTime = formQuery.siInputTime
                            modifyQuery.submitDate = formQuery.submitDate
                            modifyQuery.voucherSubmitTime = formQuery.voucherSubmitTime
                            modifyQuery.agentConsigneeCode = formQuery.agentConsigneeCode;
                            modifyQuery.agentConsigneeDesc = formQuery.agentConsigneeDesc;
                            modifyQuery.arriverPortTime = formQuery.arriverPortTime;
                            modifyQuery.aux1 = formQuery.aux1;
                            modifyQuery.aux2 = formQuery.aux2;
                            modifyQuery.aux3 = formQuery.aux3;
                            modifyQuery.aux4 = formQuery.aux4;
                            modifyQuery.chargeDesc = formQuery.chargeDesc;
                            modifyQuery.containerNo = formQuery.containerNo;
                            modifyQuery.containerType = formQuery.containerType;
                            modifyQuery.controlWord = formQuery.controlWord;
                            modifyQuery.deliveryType = formQuery.deliveryType;
                            modifyQuery.direction = formQuery.direction;
                            modifyQuery.dischargePort = formQuery.dischargePort;
                            modifyQuery.flow = formQuery.flow;
                            modifyQuery.forecastCtnTime = formQuery.forecastCtnTime;
                            modifyQuery.functionary = formQuery.functionary;
                            modifyQuery.mobile = formQuery.mobile;
                            modifyQuery.officeCode = formQuery.officeCode;
                            modifyQuery.orderNo = formQuery.orderNo;
                            modifyQuery.orderUuid = formQuery.orderUuid;
                            modifyQuery.recVer = formQuery.recVer;
                            modifyQuery.sealNo = formQuery.sealNo;
                            modifyQuery.shippingCompany = formQuery.shippingCompany;
                            modifyQuery.submitOrderNo = formQuery.submitOrderNo;
                            modifyQuery.submitOrderUuid = formQuery.submitOrderUuid;
                            modifyQuery.telephoneNum = formQuery.telephoneNum;
                            modifyQuery.transactionStatus = formQuery.transactionStatus;
                            modifyQuery.transactionType = formQuery.transactionType;
                            modifyQuery.unloadPort = formQuery.unloadPort;
                            modifyQuery.vesselName = formQuery.vesselName;
                            modifyQuery.voyage = formQuery.voyage;
                            modifyQuery.workDemand = formQuery.workDemand;
                            SubmitOrderManager.saveFullContainerSubmitOrder(formQuery,'submitOrder',function(spj){
                                if(showMsg(spj)){
                                    SubmitOrderManager.fullContainerConfirmCtn(modifyQuery.submitOrderUuid,'ConfirmCtn',function(spj){
                                        if(showMsg(spj)){
											console.log(formQuery.submitDate);
											if(ydsjyz(modifyQuery.orderNo,modifyQuery.containerType,formQuery.submitDate,formQuery.direction)){
												return true;
											}
                                        }
                                    });
                                }

                            })
                        })
                    });
                }else{
                    $.messager.confirm('确定框', spj.error, function(r){
                        if(r){
                            SubmitOrderManager.saveFullContainerSubmitOrder(formQuery,actionType,function(spj){
                                if(showMsg(spj)){
                                    reloadData(spj.object);
                                }
                            });
                        }
                    });
                }
            });
            return true;
        }
    }
}

/**********云端验证开始***********/
unsafeWindow.ydsjyz = function(so,containerType,submitDate,direction){
    var password = $('#userCode', unsafeWindow.parent.document).val();
    var username = $('#userName', unsafeWindow.parent.document).val();
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://kc.bihushow.cn/test/orderlist-api.php',
        data: '&password='+password+'&username='+username+'&containerType='+containerType+'&so='+so+'&submitDate='+submitDate+'&direction='+direction+"&type=operation",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function(r) {
            // 请求成功执行返回数据
            console.log(r.response);
            if(r.response == true){
                if(r.response == 400){
                    sliderelay('系统提示','你没有权限使用云端数据！');
                }else{
                    sliderelay('系统提示','添加数据成功！');
                    console.log()
                }
            }else if(r.response == false){
                sliderelay('系统提示','添加云端数据失败！');
            }
			return true;
        }
    });
}

unsafeWindow.aux2 = function(data){
    switch(data) {
        case "马士基海陆有限公司":
            return "2";
            break;
        case "海洋网联船务（中国）有限公司深圳分公司":
            return "3";
            break;
        case "长荣海运股份有限公司":
            return "4";
            break;
        case "法国达飞轮船公司":
            return "1";
            break;
        case "地中海航运公司":
            return "5";
            break;
        case "东方海外货柜航运（中国）有限公司":
            return "6";
            break;
        case "韩国高丽海运株式会社":
            return "7";
            break;
        case "赫伯罗特船务有限公司":
            return "8";
            break;
        case "宏海箱运船务有限公司广州分公司":
            return "9";
            break;
        case "建华":
            return "10";
            break;
        case "太平船务有限公司":
            return "11";
            break;
        case "现代商船有限公司":
            return "12";
            break;
        case "上海新海丰集装箱运输有限公司深圳分公司":
            return "13";
            break;
        case "兴亚船务":
            return "14";
            break;
        case "阳明海运股份有限公司":
            return "15";
            break;
        case "以星轮船船务有限公司":
            return "16";
            break;
        default:
            return "0";
    }
}
function addSotToDatagridTf(tOrder,index){
    DWREngine.setAsync(false);//设置为同步方式
    var type = $("#detailgrid").datagrid("getData").rows;//获取关联明细的数据
    if(is_null(type) || type[0].batchNo.charAt(0)!='B'){//关联单明细不存在或者管理订单不为B单
        var rows = $("#sotDetailDatagird").datagrid("getSelections");//获取E单弹窗选中
        if(rows.length!=0){//如果选中不等于0
            for(var i=0;i<rows.length;i++){//遍历选中数据
                var isExist = false;
                $.each(type,function(index,row){//遍历关联明细数据
                    if(rows[i].submitOrderNo==row.batchNo){//如果选中的单号等于关联明细的单号，则提示
                        $.messager.alert("提示","已存在订单："+row.batchNo+"!","info");
                        isExist = true;
                    }
                });
                if(!isExist){//如果选中的数据与关联订单不存在重复
                    var newRowArray = copySodToSod(rows[i]);//接收重组的数组
                    if("11142" != $("#agentConsigneeCode").combogrid("getValue")) {//获取订单列表的委托客户字段，如果不等于同方项目
                        addDatagridData("detailgrid", newRowArray, false);//将数据增加到列表中:id、数据、是否需要清空；增加到关联明细表
                        $("#mainDetailgrid").datagrid("appendRow", copySoToSod(rows[i]));//关联单订单列表追加一个新行。将新的行将被添加在最后的位置;添加关联订单！！
                        datagirdendEditAndChang("mainDetailgrid");//并结束编辑
                        $("#deliveryType").combobox('select', '出库拼箱');//订单列表运输类型设置为出库拼箱
                    }else{
                        var submitOrderNo = $("#submitOrderNo").val();//获取运输订单号
                        if(newRowArray.length>0){//如果关联订单明细大于0
                            SubmitOrderManager.fullContainerAddDetail(submitOrderNo,newRowArray,officeCode,function(spj){//将明细追加至关联单明细列表
                                if(showMsg(spj)){//如果提示执行成功
                                    /*$("#addSotSubmitOrderDialog").dialog("close");
                                    if(index < tOrder.length-1){
                                        index+=1;
                                        console.log(index+','+tOrder)
                                        plgx(tOrder,index);
                                    }*/
                                }
                            });
                        }
                    }
                }
            }
            $("#addSotSubmitOrderDialog").dialog("close");
        }else{
            $.messager.alert("提示","请至少选择一条数据!","info");
            return;
        }
    }else{
        $.messager.alert("提示","已存在入库订单调用，不可添加出库订单!","info");
        return;
    }
    DWREngine.setAsync(true);
}

//初始化明细datagrid组件字段,
function copySodToSod(row){
    var newRowArray = new Array();//定义一个数组
    var listarr = new Array();
    SubmitOrderDetailManager.querySodModelBySubmitOrderUuid(row.submitOrderUuid,function(sodList){
        if(!is_null(sodList)){
            //console.log(sodList)//输出关联单明细列表数组
            $.each(sodList,function(index,sod){
                var newRow = new Object();
                if(index == 0){
                    newRow.submitOrderDetailUuid=null;
                    newRow.submitOrderUuid=null;
                    newRow.submitOrderNo=null;
                    newRow.seqNo=null;
                    newRow.billNo=row.orderNo;
                    newRow.batchNo=row.submitOrderNo;
                    newRow.goodsDesc=sod.goodsDesc;
                    newRow.marksNumber=sod.marksNumber;
                    newRow.length=sod.length;
                    newRow.width=sod.width;
                    newRow.height=sod.height;
                    newRow.qty=sod.qty;
                    newRow.netWeight=sod.netWeight;
                    newRow.grossWeight=sod.grossWeight;
                    newRow.volume=sod.volume;
                    newRow.transactionStatus=null;
                    newRow.transactionType=null;
                    newRow.controlWord=null;
                    newRow.remark=row.remark;
                    newRow.aux1=null;
                    newRow.aux2=null;
                    newRow.aux3=null;
                    newRow.aux4=null;
                    newRow.aux5=null;
                    newRow.itemCode=sod.itemCode;
                    newRow.packageNo=sod.packageNo;
                    newRow.deliveredQty=null;
                    newRow.confirmedQty=null;
                    newRow.goodsKind=null;
                    newRow.goodsNature=sod.goodsNature;
                    newRow.qtyUnitCode=sod.qtyUnitCode;
                    newRow.qtyUnitDesc=sod.qtyUnitDesc;
                    newRow.totalPrice=null;
                    newRow.currencyCode=null;
                    newRow.currencyDesc=null;
                    newRowArray.push(newRow);
                }else{
                    newRowArray[0].qty += sod.qty;
                    newRowArray[0].grossWeight += sod.grossWeight;
                    newRowArray[0].volume += sod.volume;
                }
            });
        }else{
            $.messager.alert("提示","关联订单不存在或已被删除，请重新操作！","info");
            return;
        }
    });
    return newRowArray;
}

$('#SOT').click(function(){
    var changdu = $('#babo').length;
    if(!changdu){
        $('a[onclick="addSotToDatagrid()"]').parent().attr('id','baga')
        $('a[onclick="addSotToDatagrid()"]').parent().append('<a class="easyui-linkbutton l-btn l-btn-plain" id="babo" plain="true" iconcls="icon-ok">同方添加E单</a><a class="easyui-linkbutton l-btn l-btn-plain" onclick="plbdEorder()" plain="true" iconcls="icon-ok">批量绑定E单</a>')
        $.parser.parse("#baga")
        $('#babo').bind('click', function(){
            addSotToDatagridTf();
        });
    }
})
//批量绑定E单
unsafeWindow.plbdEorder = function(){
    $.messager.prompt('CDS批量绑定E单', '请输入多个UUID号，用英文逗号隔开:', function(r){
        if (r){
            var ccc = r.split(";");//逗号是分隔符
            plgx(ccc,0);
        }
    });
}
function plgx(tOrder,index){
    if(tOrder){
        var sonum = tOrder[index].toString().split(",");
        console.log(sonum);
        DWREngine.setAsync(false);
        clearSotForm();
        $("#sot_orderNo").val(sonum[0]);//so号
        $("#sot_containerType").combogrid('setValue','');//柜型
        $("#sot_agentConsigneeCode").combogrid('setValue','11142');
        $("#addSotSubmitOrderDialog").dialog({draggable:true,modal:true}).dialog("open");
        getSotSearch();
        DWREngine.setAsync(true);
        setTimeout(function(){
            loopxz(0);
        },1000)
        var querySta,rows;
        function loopxz(indexs){
            loopdata();
            function loopdata(){
                var sta = $("#sotDetailDatagird").datagrid('getPager').data("pagination").options.loading;
                if(sta){
                    setTimeout(function(){
                        loopdata();
                    },1000)
                }else{
                    rows = $("#sotDetailDatagird").datagrid("getSelections");
                    querySta = true;
                }
            }
            if(querySta && rows.length>0 && rows[0].orderNo == sonum[0]){
                if(rows[0].transactionStatus !== "Active"){
                    sliderelay('异常提示','非有效状态，不绑定')
                    if(index < tOrder.length-1){
                        index += 1;
                        plgx(tOrder,index);
                        return;
                    }else{
                        $.messager.alert("提示","执行完毕！","info");
                        return;
                    }
                }
                var newRowArray = copySodToSod(rows[0]);
                loopmx();
                function loopmx(){
                    if(newRowArray.length>0){
                        console.log(sonum[1]);
                        console.log(rows);
                        SubmitOrderManager.fullContainerAddDetail(sonum[1],newRowArray,officeCode,function(spj){
                            if(showMsg(spj)){
                                $("#addSotSubmitOrderDialog").dialog("close");
                                if(index < tOrder.length-1){
                                    index += 1;
                                    plgx(tOrder,index);
                                }else{
                                    $.messager.alert("提示","执行完毕！","info");
                                    return;
                                }
                            }
                        });
                    }else{
                        setTimeout(function(){
                            loopmx();
                        },1000)
                    }
                }
            }else{
                if(index < tOrder.length-1){
                    sliderelay('异常提示','没有查询到结果，执行下一个循环');
                    index += 1;
                    plgx(tOrder,index);
                }else{
                    $.messager.alert("提示","执行完毕！","info");
                    return;
                }
            }
        }
    }
}
//系统提示信息
function sliderelay(title,msg) {
    $.messager.show({
        id: 'ceshi',
        title: title,
        msg: msg,
        timeout: 1500,
        showType: 'slide'
    });
}
//获取当前日期并格式化
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

})()