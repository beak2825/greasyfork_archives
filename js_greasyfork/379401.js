// ==UserScript==
// @name         New CZZ 填写交易对手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       zhurujin
// @match        https://rpt.interotc.com.cn/ReportSys/otcderivatives/addRiskWarn?type=0&tableId=dg*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379401/New%20CZZ%20%E5%A1%AB%E5%86%99%E4%BA%A4%E6%98%93%E5%AF%B9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/379401/New%20CZZ%20%E5%A1%AB%E5%86%99%E4%BA%A4%E6%98%93%E5%AF%B9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var mainUrl  = 'https://10.2.86.31';
    var cName = GetQueryString('cName');
    var pName = GetQueryString('pName');
    console.log(mainUrl + '/api/otc_derivative_counterparty/otc_derivative_counterparty_query?cName='+cName + '&pName='+pName);
    $.ajax({
        url:mainUrl + '/api/otc_derivative_counterparty/otc_derivative_counterparty_query?cName='+cName + '&pName='+pName,
        type:'GET',
        dataType:'jsonp',
        success:function(data){
            handleData(data[0]);
        }
    });
    var qspp_CounterpartyType = {
        '证券公司':"0",
        '基金公司':"1",
        '期货公司':"2",
        '证券公司子公司':"3",
        '基金公司子公司':"4",
        '期货子公司':"5",
        '商业银行':"6",
        '保险公司':"7",
        '保险子公司':"8",
        '信托公司':"9",
        '财务公司':"10",
        '私募基金':"11",
        '境外金融机构':"14",
        '境外非金融机构':"15",
        '其他':"99",
    };
    //计算公司信息
    function calcCompanyType(txt){
        if(txt==='期货公司及其子公司'){
            return '期货子公司';
        }else if(txt=== '公募基金及基金子公司'){
            return '基金公司';
        }else{
            return txt;
        }
    }
    var qspp_PrimaryProtocolVersion = {
        'SAC':"0",
        'SAC-2014':"1",
        'NAFMII':"2",
        'ISDA':"3",
        '自定义':"4",
        '其他':"99",
    };
    function handleData(data){
        //签署时间
        let signDate = "";
        if(!data.AGREEMENT_SIGNING_DATE){
             signDate = "";
        }else{
            signDate = data.AGREEMENT_SIGNING_DATE.replace(/\//g,'-');
        }
        $('#signingTime').datebox('setValue', signDate);
        //主协议编号（双方约定）
        $('#masterProtocolAppointmentNumber').textbox('setValue','不适用');
        //主协议版本
        $("select[comboname='masterVersion']").combobox('setValue', "5");
        //填报方角色
        $("select[comboname='partRole']").combobox('setValue','0');
        //乙方代签产品名称
        $('#bSignedProductName').textbox('setValue',data.SIGNATURE_NAME);
        //交易对手名称
        $('#counterpartyName').textbox('setValue',data.CORPORATE_NAME);
        //交易对手方组织机构代码
        $('#counterpartyOrganizationCode').textbox('setValue',data.UNIFIEDSOCIAL_CODE);
        //交易对手类型
        let counterpartyType = qspp_CounterpartyType[calcCompanyType(data.APTITUDE)];
        $("select[comboname='counterpartyType']").combobox('select', counterpartyType);
        //交易对手类别 默认填写专业 1
        $("select[comboname='counterpartyCategory']").combobox('setValue','1');
        addSigner();
    }

    function addSigner(){
        $('#ccib_form > div >  div.easyui-layout.layout.easyui-fluid.panel-noscroll> div.panel.datagrid.easyui-fluid > div > div.datagrid-toolbar > table > tbody > tr > td:nth-child(1) > a').click();
        $('#datagrid-row-r2-2-0 td:nth-child(2) > div > table > tbody > tr > td > input').val("章早立");
        $('#datagrid-row-r2-2-0 td:nth-child(3) > div > table > tbody > tr > td > input').val("负责人");
        $('#datagrid-row-r2-2-0 td:nth-child(4) > div > table > tbody > tr > td > input').val("020-87555888-8850");
        $('#datagrid-row-r2-2-0 td:nth-child(5) > div > table > tbody > tr > td > input').val("13926060601");
        $('#datagrid-row-r2-2-0 td:nth-child(6) > div > table > tbody > tr > td > input').val("zzl@gf.com.cn");
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]); return null;
    }
})();