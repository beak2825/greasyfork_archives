// ==UserScript==
// @name         自动填写餐费报销单
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  自动填写餐费报销单，仅限内部使用
// @author       lq
// @match        https://cg.corpautohome.com/reimbursement/REApply*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482090/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%A4%90%E8%B4%B9%E6%8A%A5%E9%94%80%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/482090/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%A4%90%E8%B4%B9%E6%8A%A5%E9%94%80%E5%8D%95.meta.js
// ==/UserScript==


//设置tr值
function setTrVal(dateStr,money=30.00,isLast) {

    var vTrClone = $('#TbData tr:last');
    vTrClone.find("[cid='Invoice_Count']").val('');
    vTrClone.find("[cid='OccurDate']").val(dateStr); //date
    vTrClone.find("[cid='OccurMoney']").val(money); //合计金额
    vTrClone.find("[cid='NumberPeople']").val(1);//人数
    vTrClone.find("[cid='Reasons']").val('晚间加班'); //合计金额
    vTrClone.find('[cid=ParticipantName]').val(userInfo.username);
    vTrClone.find('[cid=ParticipantName]').attr('ids',userInfo.userid);

    if(!isLast){
        //add tr
        AddRow();
    }

}


(function() {
    'use strict';
    $.cookie.json = true;

    var monthSort =[];
     var dateArr = $.cookie( 'dateArr')||[];

    setTimeout(()=>{
        var nav = $('#divbreadmenu').text();

        dateArr.forEach((dateStr,index)=>{

           var month = dateStr.split("-")[1]-0;
           monthSort.push(month);

        });
        monthSort.sort();
        var endM = monthSort.shift();
        var  startM = monthSort.pop()

        if(nav.indexOf('创建日常报销')>-1){
            //进入页面初始化
            $('#Attachments_Size').val(prompt("请输入发票张数","2"));
            $('#RE_Description').val($(".current_user").html()+`报销新零售业务部-新零售技术团队${startM}-${endM}月份晚间/非工作日餐费`);
            $('[cid=BudgetAccounts_ID]').val('b4ed2b00-f490-4809-9dcc-a84cca0ddffc').trigger('change');
            $('[cid=Pay_Info_ID]').val('9954cd09-766b-4731-8c7d-fd2cf321c50b').trigger('change');
            $('[cid=Invoice_Content_ID]').val('A04FBBC4-A3AF-42B9-9875-F4B3AD17447A').trigger('change');
            $('[tag=sp_detail]').click();
        }
    },2000);


    $('[tag=sp_detail]').on('click',()=>{
            setTimeout(()=>{

                //获取cookie中保存的加班日期数组，填写明细
                var dateArr = $.cookie( 'dateArr')||[];

                //获取当前明细的所有时间
                var existsAllDateStr = [];
                $("[cid='OccurDate']").filter(function(){
                     existsAllDateStr.push( $(this).val());
                });
                dateArr.forEach((dateStr,index)=>{
                     if(existsAllDateStr.indexOf(dateStr)<0){
                         var isLast = index==dateArr.length-1;
                         setTrVal(dateStr,30.00,isLast);
                     }else{
                         console.log('this date exists',dateStr,index);
                     }
                });
            alert('请点击确认完成填写');
            },2000);
    });
})();