// ==UserScript==
// @name         VFMContractAssistant
// @namespace    http://tampermonkey.net/hello
// @version      1.1.6
// @description  VFM合同系统小助手
// @license      MIT
// @author       kungge
// @match        http://dev-vfm.h5.vcredit-t.com.local/contractManager/*
// @match        http://sit-vfm.h5.vcredit-t.com.local/contractManager/*
// @match        http://fat-vfm.h5.vcredit-t.com.local/contractManager/*
// @match        http://vfm.vcredit.com.local/contractManager/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/505838/VFMContractAssistant.user.js
// @updateURL https://update.greasyfork.org/scripts/505838/VFMContractAssistant.meta.js
// ==/UserScript==

// #region 常量
/** 模版校验类型_模版信息  */
const TemplateCheckType_BaseInfo = 'BASE_INFO';
/** 模版校验类型_模版内容  */
const TemplateCheckType_Content = 'CONTENT';
/** 模版校验类型_模版信息和内容  */
const TemplateCheckType_BaseInfoAndContent = 'BASE_INFO_AND_CONTENT';
/** 套件类型_24  */
const SuiteType_24 = '24';
/** 套件类型_36  */
const SuiteType_36 = '36';
/** 套件类型_单担保  */
const SuiteType_OneGuar = 'ONE_GUAR';
/** 套件类型_双担保  */
const SuiteType_TwoGuar = 'TWO_GUAR';
/** 套件类型_保险方  */
const SuiteType_Insurance = 'INSURANCE';
/** 模板类型_通用  */
const TemplateType_Common = 'COMMON';
/** 模板类型_特殊  */
const TemplateType_Special = 'SPECIAL';
/** 生成节点类型_预审批  */
const CreateNodeType_YSP = 'YSP';
/** 生成节点类型_交单放款  */
const CreateNodeTrade_Trade = 'TRADE';
/** 生成节点类型_改卡  */
const CreateNodeType_ChangeCard = 'CHANGE_CARD';
/** 担保咨询服务合同key  */
const GuarConsultTemplateKey = 'DBFWJZXHT';
// #endregion

/** 基本信息错误的模板数组 */ 
let TemplatesThatBaseInfoError = [];
/** 内容错误的模板数组 */ 
let TemplatesThatContentError = [];

(function() {
    'use strict';
    //GM_log("Hello World");
    console.log("Hello World");

    // #region 模板数据源和配置的值
    /** 默认通用模版_24_数据源  */
    var defaultCommonTemplate24DataSource = 'JKDK_TBTSH_WSDB_25|特别提示函（无担保咨询方_25账单日）,JKDK_TBTSH_WSDB_28|特别提示函（无担保咨询方_28账单日）,JKDK_TBTSH_WSDB_YM|特别提示函（无担保咨询方_月末账单日）,JKDK_TBTSH_WSDB_CCY|特别提示函（无担保咨询方_次次月账单日）,JKDKTBTSHSYWSDBDBFWFWDBZXFZDR25|特别提示函（担保服务费-无担保咨询方_25账单日）,JKDKTBTSHSYWSDBDBFWFWDBZXFZDR28|特别提示函（担保服务费-无担保咨询方_28账单日）,JKDKTBTSHSYWSDBDBFWFWDBZXFYMZDR|特别提示函（担保服务费-无担保咨询方_月末账单日）,JKDKTBTSHSYWSDBDBFWFWDBZXFCCYZDR|特别提示函（担保服务费-无担保咨询方_次次月账单日）,JKDK_BGHKKHDSQ_WSDB|变更还款卡号的申请（无担保咨询方）,JKDK_ZHWTKKSQS_WSDB|账户委托扣款授权书（无担保咨询方）';
    /** 默认通用模版_36_数据源  */
    var defaultCommonTemplate36DataSource = 'DBZXDKDBZXFWHTSYYYDBZXFMS|担保咨询服务合同（适用于有担保咨询方模式）,JKDK_BGHKKHDSQ|变更还款卡号的申请（有担保咨询方）,JKDKTBTSHZDR25|特别提示函（有担保咨询方_25账单日）,JKDKTBTSHZDR28|特别提示函（有担保咨询方_28账单日）,JKDKTBTSHYMZDR|特别提示函（有担保咨询方_月末账单日）,JKDKTBTSHCCYZDR|特别提示函（有担保咨询方_次次月账单日）,JKDKZHWTKKSQS|账户委托扣款授权书（有担保咨询方）';
    /** 默认通用模版_双担保_数据源  */
    var defaultCommonTemplate2DBDataSource = 'DBDKGRDKWTDBHTSYSDB|个人贷款委托担保合同（适用双担保）';
    /** 默认通用模版_单担保_数据源  */
    var defaultCommonTemplate1DBDataSource = 'DBDKGRDKWTDBHT|个人贷款委托担保合同';
    /** 默认通用模版_保险方_数据源  */
    var defaultCommonTemplateInsuranceDataSource = 'DBDKGRDKWTDBHTSYYGRXYBXMS|个人贷款委托担保合同（适用于国任信用保险模式）';
    /** 默认交单放款模版_数据源  */
    var defaultTradeTemplateDataSource = 'HETONG|贷款合同,TEBIETISHIHAN|特别提示函,DANBAOHAN|担保函,CHENGNUOBAOZHENGHAN|承诺保证函,FUWUHETONG|服务合同,WEITUODANBAOHETONG|担保合同,ZFGRKKSQS|资方扣款授权书,KOUKUANSHOUQUANSHU|我司扣款授权书';
    /** 默认改卡模版_数据源  */
    var defaultChangeCardTemplateDataSource = 'BGHKKHBCXY|变更还款卡协议,KOUKUANSHOUQUANSHU|我司扣款授权书,ZFGRKKSQS|资方扣款授权书';
    /** 通用模版_24_配置值  */
    var defaultCommonTemplate24Selected = 'JKDK_TBTSH_WSDB_YM,JKDK_TBTSH_WSDB_25,JKDKTBTSHSYWSDBDBFWFWDBZXFCCYZDR,JKDKTBTSHSYWSDBDBFWFWDBZXFYMZDR,JKDKTBTSHSYWSDBDBFWFWDBZXFZDR28';
    /** 默认通用模版_36_配置值  */
    var defaultCommonTemplate36Selected = 'JKDKTBTSHYMZDR,JKDKTBTSHZDR28,JKDKZHWTKKSQS';
    /** 默认通用模版_双担保_配置值  */
    var defaultCommonTemplate2DBSelected = 'DBDKGRDKWTDBHTSYSDB';
    /** 默认通用模版_单担保_配置值  */
    var defaultCommonTemplate1DBSelected = 'DBDKGRDKWTDBHT';
    /** 默认通用模版_保险方_配置值  */
    var defaultCommonTemplateInsuranceSelected = 'DBDKGRDKWTDBHTSYYGRXYBXMS';
    /** 默认交单放款模版_配置值  */
    var defaultTradeTemplateSelected = 'HETONG,TEBIETISHIHAN,DANBAOHAN,CHENGNUOBAOZHENGHAN,FUWUHETONG,WEITUODANBAOHETONG,ZFGRKKSQS,KOUKUANSHOUQUANSHU';
    // 注：我司生成的资方扣款授权书不一定改卡会生成，如抚顺银行。
    /** 默认改卡模版_配置值  */
    var defaultChangeCardTemplateSelected = 'BGHKKHBCXY,KOUKUANSHOUQUANSHU';
    // #endregion

    // #region 文本框配置的值
    /** 默认非VOS解析值排除_配置值  */
    var defaultNotVOSElementValue = '{{签名}},{{印刷签名}},{{担保咨询服务方通用章1}},{{担保方通用章1}},{{担保方通用章2}}';
    /** 默认必用解析值_配置值  */
    var defaultMustUseElementValue = '合同编号:VOSContractNumber';
    /** 默认预审批必用解析值_配置值  */
    var defaultMustYSPUseElementValue = '签名:{{印刷签名}}';
    /** 默认非预审批必用解析值_配置值  */
    var defaultMustNotYSPUseElementValue = '签名:{{签名}}';
    /** 默认改卡必用解析值_配置值  */
    var defaultMustChangeCardUseElementValue = '日期:VOSCreateTime';
    /** 默认指定模板必用解析值_配置值  */
    var defaultMustTemplateUseElementValue = 'WEITUODANBAOHETONG:161|{{担保方通用章1}},DANBAOHAN:160|{{担保方通用章1}}';
    /** 默认预审批解析值关键字_配置值  */
    var defaultCreateNodeYSPKeywordValue = '征信授权书,征信信息授权书';
   // #endregion

   // #region 样式相关配置的值
   /** 错误的显示颜色 */
   var defaultErrorShowColor = 'rgb(255, 253, 208)';// 米黄色
   /** 警告的显示颜色 */
   var defaultWarnShowColor = 'rgb(230, 230, 250)';// 淡紫色
   // #endregion

    /** 配置  */
    var config = {
        /** 开启助手_配置值  */
        openAssistant:GM_getValue('openAssistant','22'),
        /** 关闭侧边栏_配置值  */
        closeLeftMenu:GM_getValue('closeLeftMenu','0'),
        /** 开启套件迁移校验_配置值  */
        openSuiteMigrateCheck:GM_getValue('openSuiteMigrateCheck','0'),
        /** 显示校验模板按钮_配置值  */
        showCheckTemplateButton:GM_getValue('showCheckTemplateButton','0'),
        /** 显示导出按钮_配置值  */
        showExportButton:GM_getValue('showExportButton','0'),
        /** 显示套件流程图_配置值  */
        showSuiteFlowPic:GM_getValue('showSuiteFlowPic','0'),
        /** 自动检查模板信息_开关  */
        autoCheckTemplateInfo:GM_getValue('autoCheckTemplateInfo','22'),
        /** 自动检查模板内容_开关  */
        autoCheckTemplateContent:GM_getValue('autoCheckTemplateContent','22'),
         /** 预审批签名_开关  */
        switchAllYSPUseSignValue:GM_getValue('switchAllYSPUseSignValue', '22'),
        /** 所有解析值用VOS_开关  */
        switchAllElementUseVOS:GM_getValue('switchAllElementUseVOS','22'),
        /** 非VOS解析值排除_配置值  */
        notVOSElementValue:GM_getValue('notVOSElementValue',defaultNotVOSElementValue),
        /** 必用解析值_开关  */
        switchMustUseElementValue:GM_getValue('switchMustUseElementValue','22'),
        /** 必用解析值_配置值  */
        mustUseElementValue:GM_getValue('mustUseElementValue',defaultMustUseElementValue),
        /** 预审批必用解析值_开关  */
        switchMustYSPUseElementValue:GM_getValue('switchMustYSPUseElementValue','22'),
        /** 预审批必用解析值_配置值  */
        mustYSPUseElementValue:GM_getValue('mustYSPUseElementValue',defaultMustYSPUseElementValue),
        /** 非预审批必用解析值_开关  */
        switchMustNotYSPUseElementValue:GM_getValue('switchMustNotYSPUseElementValue','22'),
        /** 非预审批必用解析值_配置值  */
        mustNotYSPUseElementValue:GM_getValue('mustNotYSPUseElementValue',defaultMustNotYSPUseElementValue),
        /** 改卡必用解析值_开关  */
        switchMustChangeCardUseElementValue:GM_getValue('switchMustChangeCardUseElementValue','22'),
        /** 改卡必用解析值_配置值  */
        mustChangeCardUseElementValue:GM_getValue('mustChangeCardUseElementValue',defaultMustChangeCardUseElementValue),
        /** 指定模板必用解析值_开关  */
        switchMustTemplateUseElementValue:GM_getValue('switchMustTemplateUseElementValue','22'),
        /** 指定模板必用解析值_配置值  */
        mustTemplateUseElementValue:GM_getValue('mustTemplateUseElementValue',defaultMustTemplateUseElementValue),
        /** 预审批解析值关键字_开关  */
        switchCreateNodeYSPKeywordValue:GM_getValue('switchCreateNodeYSPKeywordValue','22'),
        /** 预审批解析值关键字_配置值  */
        createNodeYSPKeywordValue:GM_getValue('createNodeYSPKeywordValue',defaultCreateNodeYSPKeywordValue),
        /** 通用模版_24_数据源_配置值  */
        commonTemplate24DataSource:GM_getValue('commonTemplate24DataSource',defaultCommonTemplate24DataSource),
        /** 通用模板_36_数据源_配置值  */
        commonTemplate36DataSource:GM_getValue('commonTemplate36DataSource',defaultCommonTemplate36DataSource),
        /** 交单放款模版_数据源_配置值  */
        tradeTemplateDataSource:GM_getValue('tradeTemplateDataSource',defaultTradeTemplateDataSource),
        /** 改卡模版_数据源_配置值  */
        changeCardTemplateDataSource:GM_getValue('changeCardTemplateDataSource',defaultChangeCardTemplateDataSource),
        /** 通用模版_双担保_数据源_配置值  */
        commonTemplate2DBDataSource:GM_getValue('commonTemplate2DBDataSource',defaultCommonTemplate2DBDataSource),
        /** 通用模版_单担保_数据源_配置值  */
        commonTemplate1DBDataSource:GM_getValue('commonTemplate1DBDataSource',defaultCommonTemplate1DBDataSource),
        /** 通用模版_保险方_数据源_配置值  */
        commonTemplateInsuranceDataSource:GM_getValue('commonTemplateInsuranceDataSource',defaultCommonTemplateInsuranceDataSource),
        /** 通用模版_24_配置值  */
        commonTemplate24Selected:GM_getValue('commonTemplate24Selected',defaultCommonTemplate24Selected),
        /** 通用模版_36_配置值  */
        commonTemplate36Selected:GM_getValue('commonTemplate36Selected',defaultCommonTemplate36Selected),
        /** 交单放款模版_配置值  */
        tradeTemplateSelected:GM_getValue('tradeTemplateSelected',defaultTradeTemplateSelected),
        /** 改卡模版_配置值  */
        changeCardTemplateSelected:GM_getValue('changeCardTemplateSelected',defaultChangeCardTemplateSelected),
        /** 通用模版_双担保_配置值  */
        commonTemplate2DBSelected:GM_getValue('commonTemplate2DBSelected',defaultCommonTemplate2DBSelected),
        /** 通用模版_单担保_配置值  */
        commonTemplate1DBSelected:GM_getValue('commonTemplate1DBSelected',defaultCommonTemplate1DBSelected),   
        /** 通用模版_保险方_配置值  */
        commonTemplateInsuranceSelected:GM_getValue('commonTemplateInsuranceSelected',defaultCommonTemplateInsuranceSelected),
        /** 详情页面模板名称列索引_配置值  */
        detailPageTemplateNameCellIndex:GM_getValue('detailPageTemplateNameCellIndex','1'),
        /** 开发审核页面模板名称列索引_配置值  */
        devAuditPageTemplateNameCellIndex:GM_getValue('devAuditPageTemplateNameCellIndex','3'),
        /** 开发审核页面模板类型描述列索引_配置值  */
        devAuditPageTemplateTypeDesc:GM_getValue('devAuditPageTemplateTypeDesc','2'),
        /** 错误的显示颜色_配置值  */
        errorShowColor:GM_getValue('errorShowColor', defaultErrorShowColor),
        /** 警告的显示颜色_配置值  */
        warnShowColor:GM_getValue('warnShowColor', defaultWarnShowColor),
    }
    var {
        openAssistant,
        closeLeftMenu,
        showCheckTemplateButton,
        showExportButton,
        showSuiteFlowPic,
        openSuiteMigrateCheck,
        autoCheckTemplateInfo,
        autoCheckTemplateContent,
        switchAllYSPUseSignValue,
        switchAllElementUseVOS,
        notVOSElementValue,
        switchMustUseElementValue,
        mustUseElementValue,
        switchMustYSPUseElementValue,
        mustYSPUseElementValue,
        switchMustNotYSPUseElementValue,
        mustNotYSPUseElementValue,
        switchMustChangeCardUseElementValue,
        mustChangeCardUseElementValue,
        switchMustTemplateUseElementValue,
        mustTemplateUseElementValue,
        switchCreateNodeYSPKeywordValue,
        createNodeYSPKeywordValue,
        commonTemplate24DataSource,
        commonTemplate36DataSource,
        tradeTemplateDataSource,
        changeCardTemplateDataSource,
        commonTemplate2DBDataSource,
        commonTemplate1DBDataSource,
        commonTemplateInsuranceDataSource,
        commonTemplate24Selected,
        commonTemplate36Selected,
        tradeTemplateSelected,
        changeCardTemplateSelected,
        commonTemplate2DBSelected,
        commonTemplate1DBSelected,
        commonTemplateInsuranceSelected,
        detailPageTemplateNameCellIndex,
        devAuditPageTemplateNameCellIndex,
        devAuditPageTemplateTypeDesc,
        errorShowColor,
        warnShowColor
    } = config;

    console.log('配置信息: ' + JSON.stringify(config));

    // #region 处理配置
    /** 是否打开助手  */
    let isOpenAssistant = openAssistant == 22 ? true : false;
    /** 显示校验模板按钮  */
    let isShowCheckTemplateButton = showCheckTemplateButton == 22 ? true : false;
    /** 显示导出按钮  */
    let isShowExportButton = showExportButton == 22 ? true : false;
    /** 显示流程图  */
   let isShowSuiteFlowPic = showSuiteFlowPic == 22 ? true : false;
    /** 是否打开迁移校验  */
    let isOpenSuiteMigrateCheck = openSuiteMigrateCheck == 22 ? true : false;
    /** 是否自动检查模板信息  */
    let isAutoCheckTemplateInfo = autoCheckTemplateInfo == 22 ? true : false;
    /** 是否自动检查模板内容  */
    let isAutoCheckTemplateContent = autoCheckTemplateContent == 22 ? true : false;
    /** 预审批必用签名  */
    let isAllYSPUseSign = switchAllYSPUseSignValue == 22 ? true : false;
    /** 所有的解析值是否使用VOS  */
    let isAllElementUseVOS = switchAllElementUseVOS == 22 ? true : false;
    /** 必用解析值  */
    let isMustUseElement = switchMustUseElementValue == 22 ? true : false;
    /** 预审批必用解析值  */
    let isMustYSPUseElement = switchMustYSPUseElementValue == 22 ? true : false;
    /** 非预审批必用解析值  */
    let isMustNotYSPUseElement = switchMustNotYSPUseElementValue == 22 ? true : false;
    /** 改卡必用解析值  */
    let isMustChangeCardUseElement = switchMustChangeCardUseElementValue == 22 ? true : false;
    /** 指定模板必用解析值  */
    let isMustTemplateUseElement = switchMustTemplateUseElementValue == 22 ? true : false;
    /** 预审批解析值关键字  */
    let isCreateNodeYSPKeyword = switchCreateNodeYSPKeywordValue == 22 ? true : false;
    /** 通用模板_单担保_字典  */
    let commonTemplate1DBMap = new Map([
        ['WEITUODANBAOHETONG', commonTemplate1DBSelected]
    ]);
    /** 通用模板_双担保_字典  */
    let commonTemplate2DBMap = new Map([
        ['WEITUODANBAOHETONG', commonTemplate2DBSelected]
    ]);
    /** 通用模板_保险方_字典  */
    let commonTemplateInsuranceMap = new Map([
        ['WEITUODANBAOHETONG', commonTemplateInsuranceSelected]
    ]);
    // #endregion

    // 页面配置
    var templateProcess = [
        {funcName:'templateProcess',name:'developerTemplateProcess',match:/^http?:\/\/.*fundsAuditProcess.*/,isWebOpen:22},// 流程中的审核页面
        {funcName:'templateProcess',name:'suiteDetailProcess',match:/^http?:\/\/.*fundsDeployContractDetail.*/,isWebOpen:22},// 套件详情页面（已发布的）
        {funcName:'templateProcess',name:'suiteDetailProcess',match:/^http?:\/\/.*fundsContractDetail.*/,isWebOpen:22}, // 套件详情页面（流程中的、待发起的）
        {funcName:'templateProcess',name:'suiteDetailProcess',match:/^http?:\/\/.*modifyByLegalAffairs.*/,isWebOpen:22}, // 已发布的套件法务修改页面
        {funcName:'templateProcess',name:'suiteFundsTemplate',match:/^http?:\/\/.*fundsTemplate.*/,isWebOpen:22}   // 套件列表页面
    ];

    /** 设置配置菜单  */
    var lang = {
        vfmSet:'设置',
        openAssistant:'开启辅助工具',
        closeLeftMenu:'关闭侧边栏',
        showCheckTemplateButton: '显示校验模板按钮',
        showExportButton: '显示导出按钮',
        showSuiteFlowPic: '显示流程图',
        openSuiteMigrateCheck:'开启套件迁移校验',
        autoCheckTemplateInfo: '自动检查模板信息',
        autoCheckTemplateContent: '自动检查模板内容',
        switchAllYSPUseSignValue:'所有预审批签名检查',
        switchAllElementUseVOS:'所有解析值用VOS',
        switchMustUseElementValue: '必用解析值检查',
        switchMustYSPUseElementValue: '预审批必用解析值检查',
        switchMustNotYSPUseElementValue: '非预审批必用解析值检查',
        switchMustChangeCardUseElementValue: '改卡必用解析值检查',
        switchMustTemplateUseElementValue: '指定模板必用解析值检查',
        switchCreateNodeYSPKeywordValue: '预审批模板关键字',
        commonTemplate24Selected: '24通用模板',
        commonTemplate36Selected: '36通用模板',
        commonTemplate2DBSelected: '双担保通用模板',
        commonTemplate1DBSelected: '单担保通用模板',
        commonTemplateInsuranceSelected: '有保险方通用模板',
        tradeTemplateSelected: '交单/放款模板',
        changeCardTemplateSelected: '改卡模板',
        commonTemplate24DataSource: '通用模版_24_数据源',
        commonTemplate36DataSource: '通用模版_36_数据源',
        tradeTemplateDataSource: '交单模板_数据源',
        changeCardTemplateDataSource: '改卡模板_数据源',
        commonTemplate2DBDataSource: '通用模版_双担保_数据源',
        commonTemplate1DBDataSource: '通用模版_单担保_数据源',
        commonTemplateInsuranceDataSource: '通用模版_保险方_数据源',
        help: '技术文档',
        exportConfig: '导出配置',
        importConfig: '导入配置' 
    };

    let timerHead = setInterval(function(){
        console.log('进入 timerHead');
        if(document.getElementsByTagName('head')[0]) {
            clearInterval(timerHead);

            var domHead = document.getElementsByTagName('head')[0];
            domHead = document.getElementsByTagName('head')[0];
            var domStyle = document.createElement('style');
            domStyle.type = 'text/css';
            domStyle.rel = 'stylesheet';

            var intervalId = window.setInterval(function() {
                var url = window.location.href;
                console.log('当前URL: ' + url);
        
                if (document.readyState === "complete") {
                    console.log("document.readyState is complete");
        
                    // 获取当前页面
                    var currentWeb = [];
                    try{
                        var website = top.location.href;
                        for(let i=0;i<templateProcess.length;i++){
                            if(website.match(templateProcess[i].match) && templateProcess[i].isWebOpen == 22){
                                currentWeb.push(templateProcess[i]);
                                break;
                            }
                        }
                    }catch(err){
                        consoleError(err);
                    }
        
                    // 加载助手页面
                    if(currentWeb.length > 0) {
                        consoleInfo('当前页面为：' + currentWeb[0].name);
                        var templateProcessClass = new TemplateProcessClass();
                        if(isOpenAssistant) {
                            CommonToolClass.toastMakeText('当前页面文档加载完成, 开始加载助手', 3000);
                            templateProcessClass[currentWeb[0].name]();
                            // 延迟执行
                            setTimeout(function(){
                                // 加载流程图
                                if(isShowSuiteFlowPic) {
                                    var processInstanceId = templateProcessClass.SuiteBaseInfo.processInstanceId;
                                    let flowPicUrl = templateProcessClass.getSuiteFlowPicUrl(processInstanceId);
                                    console.log('flowPicUrl: ' + flowPicUrl);
                                    let imgElement = templateProcessClass.createElement('img', 'suiteFlowPic', null, null, null, false);
                                    // 设置 src 
                                    imgElement.src = flowPicUrl;
                                    let auditDivElement = document.getElementById(templateProcessClass.TemplateAuditDivId);
                                    auditDivElement.appendChild(imgElement);
                                }
                                
                                // 校验模板
                                console.log('进入自动校验模板 setTimeout');
                                if(isAutoCheckTemplateInfo && isAutoCheckTemplateContent) {
                                    templateProcessClass.checkTemplateBaseInfo();
                                    templateProcessClass.checkTemplatesContent();
                                    let allErrorTemplates = [];
                                    allErrorTemplates = allErrorTemplates.concat(TemplatesThatBaseInfoError).concat(TemplatesThatContentError);
                                    templateProcessClass.showTemplatesThatError(allErrorTemplates, TemplateCheckType_BaseInfoAndContent);
                                } else if(isAutoCheckTemplateInfo) {
                                    templateProcessClass.checkTemplateBaseInfo();
                                    templateProcessClass.showTemplatesThatError(TemplatesThatBaseInfoError, TemplateCheckType_BaseInfo);
                                } else if(isAutoCheckTemplateContent) {
                                    templateProcessClass.checkTemplatesContent(TemplatesThatContentError, TemplateCheckType_Content);
                                }

                                
                            }, 5000);
                        }
                    }
        
                    clearInterval(intervalId);
                }
                console.log("Hello World2");
            }, 2000);

            /** 业务基类 */
            class BaseClass {
                constructor(name) {
                    // 设置菜单
                    GM_registerMenuCommand("设置", () => this.menuSet());

                    // 设置样式
                    this.setStyle();
        
                    // #region 设置属性
                    /** 名称 */
                    this.name = name;
                    /** VFM地址子路径 */
                    this.VFMUrlSubpath = GM_getValue('VFMUrlSubpath', '/api/vfm-admin/api/vfm-admin/contract/');
                    /** VFM基础地址 */
                    this.BaseVFMUrl = this.getBaseVFMUrl();
                    /** 授权信息 */
                    this.Authorization = this.getAuthorizationStr();
                    /** 套件Id */
                    this.SuiteId = this.getSuiteId();
                    /** 套件基本信息 */
                    this.SuiteBaseInfo = null;
                    /** 通用模版集合 */
                    this.CommonTemplates = [];
                    /** 特殊模版集合 */
                    this.SpecialTemplates = [];
                    /** 套件工作流信息 */
                    this.WorkFlowInfo = null;
                    /** 是否从接口查询结果中校验key */
                    this.CheckKeyFromQuery = true;
                    /** 是否可以更新key */
                    this.CanUpdateKey = false;
                    /** 是否要更新页面中特殊模板的TR属性 */
                    this.UpdatePageSpecialTemplateTr = false;
                    /** 模板助手操作区域的divId */
                    this.TemplateAuditDivId = 'templateAuditDiv';
                    if(isOpenAssistant) {
                        // 获取套件详情
                        this.getSuiteDetailInfo(this.SuiteId);
                    }
                    // #endregion
                }
                say() {
                    console.log(this.name);
                }
                /** 设置样式 */
                setStyle(){
                    let menuSetStyle = `
                        .block-checkbox {
                            display: block;
                        }
                        .zhmMask{
                            z-index:999999999;
                            background-color:#000;
                            position: fixed;top: 0;right: 0;bottom: 0;left: 0;
                            opacity:0.8;
                        }
                        .wrap-box{
                            z-index:1000000000;
                            position:fixed;
                            //top: 50%;
                            top: 20%;
                            left: 50%;
                            transform: translate(-50%, -200px);
                            //width: 300px;
                            width: 900px;
                            color: #555;
                            background-color: #fff;
                            border-radius: 5px;
                            overflow:hidden;
                            font:16px numFont,PingFangSC-Regular,Tahoma,Microsoft Yahei,sans-serif !important;
                            font-weight:400 !important;
                            overflow-y: auto; /* 添加滚动条 */
                            max-height: 900px; /* 设置最大高度 */
                        }
                        .setWrapHead{
                            background-color:#f24443;height:40px;color:#fff;text-align:center;line-height:40px;
                        }
                        .setWrapLi{
                            margin:0px;padding:0px;
                        }
                        .setWrapLi li{
                            background-color: #fff;
                            border-bottom:1px solid #eee;
                            margin:0px !important;
                            padding:12px 20px;
                            display: flex;
                            justify-content: space-between;align-items: center;
                            list-style: none;
                        }
        
                        .setWrapLiContent{
                            display: flex;justify-content: space-between;align-items: center;
                        }
                        .setWrapSave{
                            position:absolute;top:-2px;right:10px;font-size:24px;cursor:pointer
                        }
                        .iconSetFoot{
                            position:absolute;
                            // bottom:0px;
                            padding:10px 20px;
                            width:100%;
                        z-index:1000000009;background:#fef9ef;
                        }
                        .iconSetFootLi{
                            margin:0px;padding:0px;
                        }
        
                        .iconSetFootLi li{
                            display: inline-flex;
                            padding:0px 2px;
                            justify-content: space-between;align-items: center;
                            font-size: 12px;
                        }
                        .iconSetFootLi li a{
                            color:#555;
                        }
                        .iconSetFootLi a:hover {
                            color:#fe6d73;
                        }
                        .iconSetPage{
                            z-index:1000000001;
                            position:absolute;top:0px;left:300px;
                            background:#fff;
                            width:300px;
                            height:100%;
                        }
                        .iconSetUlHead{
                        padding:0px;
                        margin:0px;
                        }
                        .iconSetPageHead{
                            border-bottom:1px solid #ccc;
                            height:40px;
                            line-height:40px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color:#fe6d73;
                            color:#fff;
                            font-size: 15px;
                        }
                        .iconSetPageLi{
                            margin:0px;padding:0px;
                        }
                        .iconSetPageLi li{
                            list-style: none;
                            padding:8px 20px;
                            border-bottom:1px solid #eee;
                        }
                        .zhihuSetPage{
                            z-index:1000000002;position:absolute;top:0px;left:300px;background:#fff;width:300px;height:100%;
                        }
                        .iconSetPageInput{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
                        .zhihuSetPageLi{
                            margin:0px;padding:0px;
                            height:258px;
                            overflow-y: scroll;
                        }
        
                        .zhihuSetPageContent{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
        
                        .zhm_circular{
                            width: 40px;height: 20px;border-radius: 16px;transition: .3s;cursor: pointer;box-shadow: 0 0 3px #999 inset;
                        }
                        .round-button{
                            width: 20px;height: 20px;;border-radius: 50%;box-shadow: 0 1px 5px rgba(0,0,0,.5);transition: .3s;position: relative;
                        }
                        .zhm_back{
                            border: solid #FFF; border-width: 0 3px 3px 0; display: inline-block; padding: 3px;transform: rotate(135deg);  -webkit-transform: rotate(135deg);margin-left:10px;cursor:pointer;
                        }
                        .to-right{
                            margin-left:20px; display: inline-block; padding: 3px;transform: rotate(-45deg); -webkit-transform: rotate(-45deg);cursor:pointer;
        
                        }
                        .iconSetSave{
                            font-size:24px;cursor:pointer;margin-right:5px;margin-bottom:4px;color:#FFF;
                        }
                        .zhm_set_page{
                            z-index:1000000003;
                            position:absolute;
                            top:0px;left:300px;
                            background:#fff;
                            width:300px;
                            height:100%;
                        }
                        .zhm_set_page_header{
                            border-bottom:1px solid #ccc;
                            height:40px;
                            line-height:40px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color:#fe6d73;
                            color:#fff;
                            font-size: 15px;
                        }
                        .zhm_set_page_content{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
                        .zhm_set_page_list{
                            margin:0px;padding:0px;
                            height: 220px;
                            overflow-y: scroll;
                        }
        
                        .zhm_set_page_list::-webkit-scrollbar {
                            /*滚动条整体样式*/
                            width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                            height: 1px;
                        }
                        .zhm_set_page_list::-webkit-scrollbar-thumb {
                            /*滚动条里面小方块*/
                            border-radius   : 2px;
                            background-color: #fe6d73;
                        }
                        .zhm_set_page_list::-webkit-scrollbar-track {
                            /*滚动条里面轨道*/
                            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                            background   : #ededed;
                            border-radius: 10px;
                        }
                        .zhm_set_page_list li{
                            /*border-bottom:1px solid #ccc;*/
                            padding:12px 20px;
                            display:block;
                            border-bottom:1px solid #eee;
                        }
                        li:last-child{
                            border-bottom:none;
                        }
                        .zhm_scroll{
                        overflow-y: scroll !important;
                        }
                        .zhm_scroll::-webkit-scrollbar {
                            /*滚动条整体样式*/
                            width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                            height: 1px;
                        }
                        .zhm_scroll::-webkit-scrollbar-thumb {
                            /*滚动条里面小方块*/
                            border-radius   : 2px;
                            background-color: #fe6d73;
                        }
                        .zhm_scroll::-webkit-scrollbar-track {
                            /*滚动条里面轨道*/
                            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                            background   : #ededed;
                            border-radius: 10px;
                        }
                        /*-form-*/
                        :root {
                            --base-color: #434a56;
                            --white-color-primary: #f7f8f8;
                            --white-color-secondary: #fefefe;
                            --gray-color-primary: #c2c2c2;
                            --gray-color-secondary: #c2c2c2;
                            --gray-color-tertiary: #676f79;
                            --active-color: #227c9d;
                            --valid-color: #c2c2c2;
                            --invalid-color: #f72f47;
                            --invalid-icon: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%20%3Cpath%20d%3D%22M13.41%2012l4.3-4.29a1%201%200%201%200-1.42-1.42L12%2010.59l-4.29-4.3a1%201%200%200%200-1.42%201.42l4.3%204.29-4.3%204.29a1%201%200%200%200%200%201.42%201%201%200%200%200%201.42%200l4.29-4.3%204.29%204.3a1%201%200%200%200%201.42%200%201%201%200%200%200%200-1.42z%22%20fill%3D%22%23f72f47%22%20%2F%3E%3C%2Fsvg%3E");
                        }
                        .text-input {
                            font-size: 16px;
                            position: relative;
                            right:0px;
                            z-index: 0;
                        }
                        .text-input__body {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 3px;
                            height: 1.7em;
                            line-height: 1.7;
                            overflow: hidden;
                            padding: 2px 1em;
                            text-overflow: ellipsis;
                            transition: background-color 0.3s;
                            width:55%;
                            font-size:14px;
                            box-sizing: initial;
                        }
                        .text-input__body:-ms-input-placeholder {
                            color: var(--gray-color-secondary);
                        }
                        .text-input__body::-moz-placeholder {
                            color: var(--gray-color-secondary);
                        }
                        .text-input__body::placeholder {
                            color: var(--gray-color-secondary);
                        }
        
                        .text-input__body[data-is-valid] {
                            padding-right: 1em;
        
                        }
                        .text-input__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                        }
                        .text-input__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
                        .text-input__body:focus {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .text-input__body:-webkit-autofill {
                            transition-delay: 9999s;
                            -webkit-transition-property: background-color;
                            transition-property: background-color;
                        }
                        .text-input__validator {
                            background-position: right 0.5em center;
                            background-repeat: no-repeat;
                            background-size: 1.5em;
                            display: inline-block;
                            height: 100%;
                            left: 0;
                            position: absolute;
                            top: 0;
                            width: 100%;
                            z-index: -1;
                        }
                        .text-input__body[data-is-valid=false] + .text-input__validator {
                            background-image: var(--invalid-icon);
                        }
                        .select-box {
                            box-sizing: inherit;
                            font-size: 16px;
                            position: relative;
                            transition: background-color 0.5s ease-out;
                            width:90px;
                        }
                        .select-box::after {
                            border-color: var(--gray-color-secondary) transparent transparent transparent;
                            border-style: solid;
                            border-width: 6px 4px 0;
                            bottom: 0;
                            content: "";
                            display: inline-block;
                            height: 0;
                            margin: auto 0;
                            pointer-events: none;
                            position: absolute;
                            right: -72px;
                            top: 0;
                            width: 0;
                            z-index: 1;
                        }
                        .select-box__body {
                            box-sizing: initial;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 3px;
                            cursor: pointer;
                            height: 1.7em;
                            line-height: 1.7;
                            padding-left: 1em;
                            padding-right: calc(1em + 16px);
                            width: 140%;
                            font-size:14px;
                            padding-top:2px;
                            padding-bottom:2px;
                        }
                        .select-box__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                            box-shadow: inset 0 0 0 1px var(--valid-color);
                        }
                        .select-box__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
                        .select-box__body.focus-visible {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .select-box__body:-webkit-autofill {
                            transition-delay: 9999s;
                            -webkit-transition-property: background-color;
                            transition-property: background-color;
                        }
                        .textarea__body {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 0;
                            box-sizing: initial;
                            font: inherit;
                            left: 0;
                            letter-spacing: inherit;
                            overflow: hidden;
                            padding: 1em;
                            position: absolute;
                            resize: none;
                            top: 0;
                            transition: background-color 0.5s ease-out;
                            width: 100%;
                            }
                        .textarea__body:only-child {
                            position: relative;
                            resize: vertical;
                        }
                        .textarea__body:focus {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .textarea__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                            box-shadow: inset 0 0 0 1px var(--valid-color);
                        }
                        .textarea__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
        
                        .textarea ._dummy-box {
                            border: 1px solid;
                            box-sizing: border-box;
                            min-height: 240px;
                            overflow: hidden;
                            overflow-wrap: break-word;
                            padding: 1em;
                            visibility: hidden;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                        }
                        .toLeftMove{
                            nimation:moveToLeft 0.5s infinite;
                            -webkit-animation:moveToLeft 0.5s infinite; /*Safari and Chrome*/
                            animation-iteration-count:1;
                            animation-fill-mode: forwards;
                        }
        
                        @keyframes moveToLeft{
                            from {left:200px;}
                            to {left:0px;}
                        }
        
                        @-webkit-keyframes moveToLeft /*Safari and Chrome*/{
                            from {left:200px;}
                            to {left:0px;}
                        }
        
                        .toRightMove{
                            nimation:moveToRight 2s infinite;
                            -webkit-animation:moveToRight 2s infinite; /*Safari and Chrome*/
                            animation-iteration-count:1;
                            animation-fill-mode: forwards;
                        }
                        @keyframes moveToRight{
                            from {left:0px;}
                            to {left:2000px;}
                        }
        
                        @-webkit-keyframes moveToRight /*Safari and Chrome*/{
                            from {left:0px;}
                            to {left:200px;}
                        }
                    `;
        
                    domStyle.appendChild(document.createTextNode(menuSetStyle));
        
                    domHead.appendChild(domStyle);
                }
                /** 菜单设置 */
                menuSet() {
                    var _this = this;

                    /** 开关列表Json */
                    var setSwitchListJson = [
                        {'optionName':lang.openAssistant,'optionID':'openAssistant','default':openAssistant},
                        {'optionName':lang.showCheckTemplateButton,'optionID':'showCheckTemplateButton','default':showCheckTemplateButton},
                        {'optionName':lang.showExportButton,'optionID':'showExportButton','default':showExportButton},
                        {'optionName':lang.showSuiteFlowPic,'optionID':'showSuiteFlowPic','default':showSuiteFlowPic},
                        {'optionName':lang.openSuiteMigrateCheck,'optionID':'openSuiteMigrateCheck','default':openSuiteMigrateCheck},
                        //{'optionName':lang.closeLeftMenu,'optionID':'closeLeftMenu','default':closeLeftMenu},                     
                        {'optionName':lang.autoCheckTemplateInfo,'optionID':'autoCheckTemplateInfo','default':autoCheckTemplateInfo},
                        {'optionName':lang.autoCheckTemplateContent,'optionID':'autoCheckTemplateContent','default':autoCheckTemplateContent},
                        {'optionName':lang.switchAllYSPUseSignValue,'optionID':'switchAllYSPUseSignValue','default':switchAllYSPUseSignValue},
                        {'optionName':lang.switchAllElementUseVOS,'optionID':'switchAllElementUseVOS','default':switchAllElementUseVOS,'inputOptionID':'notVOSElementValue','inputTitle':'排除: ','inputActualValue':notVOSElementValue,'inputExample':defaultNotVOSElementValue},
                        {'optionName':lang.switchMustUseElementValue,'optionID':'switchMustUseElementValue','default':switchMustUseElementValue,'inputOptionID':'mustUseElementValue','inputTitle':'配置: ','inputActualValue':mustUseElementValue,'inputExample':defaultMustUseElementValue},
                        {'optionName':lang.switchMustYSPUseElementValue,'optionID':'switchMustYSPUseElementValue','default':switchMustYSPUseElementValue,'inputOptionID':'mustYSPUseElementValue','inputTitle':'配置: ','inputActualValue':mustYSPUseElementValue,'inputExample':defaultMustYSPUseElementValue},
                        {'optionName':lang.switchMustNotYSPUseElementValue,'optionID':'switchMustNotYSPUseElementValue','default':switchMustNotYSPUseElementValue,'inputOptionID':'mustNotYSPUseElementValue','inputTitle':'配置: ','inputActualValue':mustNotYSPUseElementValue,'inputExample':defaultMustNotYSPUseElementValue},
                        {'optionName':lang.switchMustChangeCardUseElementValue,'optionID':'switchMustChangeCardUseElementValue','default':switchMustChangeCardUseElementValue,'inputOptionID':'mustChangeCardUseElementValue','inputTitle':'配置: ','inputActualValue':mustChangeCardUseElementValue,'inputExample':defaultMustChangeCardUseElementValue},
                        {'optionName':lang.switchMustTemplateUseElementValue,'optionID':'switchMustTemplateUseElementValue','default':switchMustTemplateUseElementValue,'inputOptionID':'mustTemplateUseElementValue','inputTitle':'配置: ','inputActualValue':mustTemplateUseElementValue,'inputExample':defaultMustTemplateUseElementValue},
                        {'optionName':lang.switchCreateNodeYSPKeywordValue,'optionID':'switchCreateNodeYSPKeywordValue','default':switchCreateNodeYSPKeywordValue,'inputOptionID':'createNodeYSPKeywordValue','inputTitle':'配置: ','inputActualValue':createNodeYSPKeywordValue,'inputExample':defaultCreateNodeYSPKeywordValue},
                    ];
                    
                    /** 模板列表Json */
                    var templateListJson = [
                        {'optionName':lang.tradeTemplateSelected,'optionID':'tradeTemplateSelected','selectCodes':tradeTemplateSelected,'dataSource':tradeTemplateDataSource},
                        {'optionName':lang.changeCardTemplateSelected,'optionID':'changeCardTemplateSelected','selectCodes':changeCardTemplateSelected,'dataSource':changeCardTemplateDataSource},
                        {'optionName':lang.commonTemplate2DBSelected,'optionID':'commonTemplate2DBSelected','selectCodes':commonTemplate2DBSelected,'dataSource':commonTemplate2DBDataSource},
                        {'optionName':lang.commonTemplate1DBSelected,'optionID':'commonTemplate1DBSelected','selectCodes':commonTemplate1DBSelected,'dataSource':commonTemplate1DBDataSource},
                        {'optionName':lang.commonTemplateInsuranceSelected,'optionID':'commonTemplateInsuranceSelected','selectCodes':commonTemplateInsuranceSelected,'dataSource':commonTemplateInsuranceDataSource},
                        {'optionName':lang.commonTemplate24Selected,'optionID':'commonTemplate24Selected','selectCodes':commonTemplate24Selected,'dataSource':commonTemplate24DataSource},
                        {'optionName':lang.commonTemplate36Selected,'optionID':'commonTemplate36Selected','selectCodes':commonTemplate36Selected,'dataSource':commonTemplate36DataSource},
                    ];

                    /** 文本框数据源配置列表Json */
                    var inputTextDataSourceListJson = [
                        {'optionName':lang.tradeTemplateDataSource,'optionID':'tradeTemplateDataSource','actualValue':tradeTemplateDataSource},
                        {'optionName':lang.changeCardTemplateDataSource,'optionID':'changeCardTemplateDataSource','actualValue':changeCardTemplateDataSource},
                        {'optionName':lang.commonTemplate2DBDataSource,'optionID':'commonTemplate2DBDataSource','actualValue':commonTemplate2DBDataSource},
                        {'optionName':lang.commonTemplate1DBDataSource,'optionID':'commonTemplate1DBDataSource','actualValue':commonTemplate1DBDataSource},
                        {'optionName':lang.commonTemplateInsuranceDataSource,'optionID':'commonTemplateInsuranceDataSource','actualValue':commonTemplateInsuranceDataSource},
                        {'optionName':lang.commonTemplate24DataSource,'optionID':'commonTemplate24DataSource','actualValue':commonTemplate24DataSource},
                        {'optionName':lang.commonTemplate36DataSource,'optionID':'commonTemplate36DataSource','actualValue':commonTemplate36DataSource}
                    ];
        
                    // 生成设置弹窗顶部
                    var setHtml = "<div id='setMask' class='zhmMask'></div>";
                    setHtml +="<div class='wrap-box' id='setWrap'>";
                    setHtml +="<ul class='iconSetUlHead'><li class='iconSetPageHead'><span></span><span>"+lang.vfmSet+"</span><span class='iconSetSave'>×</span></li></ul>";
                    
                    // 生成功能开关
                    setHtml +="<ul class='setWrapLi'>";
                    setHtml += _this.createSetSwitchHtml(setSwitchListJson);
                    setHtml +="</ul>";
                    
                    // 生成业务配置
                    setHtml +="<div style='text-align: center;'>-------------------------------模板选择配置------------------------------------------</div>";
                    setHtml +="<ul class='setWrapLi'>";
                    // 文本框
                    //setHtml += _this.createInputTextHtml(inputTextListJson);
                    // 模板选择checkbox
                    setHtml += _this.createTemplateSelectHtml(templateListJson);
                    setHtml +="</ul>";

                    // 生成数据源配置
                    setHtml +="<div style='text-align: center;'>-------------------------------数据源配置----------------------------------------</div>";
                    setHtml +="<ul class='setWrapLi'>";
                    // 文本框
                    setHtml += _this.createInputTextHtml(inputTextDataSourceListJson);
                    setHtml +="</ul>";
                    
                    // 生成设置弹窗底部
                    setHtml +="<div style='height:60px;'></div>";
                    setHtml +="<div class='iconSetFoot' style=''>";
                    setHtml +="<ul class='iconSetFootLi'>";
                    setHtml +="<li><a href='http://wiki.vcredit.com.local/pages/viewpage.action?pageId=156500233' target='_blank'>"+lang.help+"</a></li>";
                    setHtml +="<li><button id='btnExportConfig' type='button'><span>"+lang.exportConfig+"</span></button></li>";
                    setHtml +="<li><input id='inputImportConfig' type='file' accept='application/json' style='display: none;'></input></li>";
                    setHtml +="<li><button id='btnImportConfig' type='button'><span>"+lang.importConfig+"</span></button></li>";
                    setHtml +="<li>免责声明: 该工具仅供内部使用, 仅根据用户自定义配置来作校验提示作用, 用户在使用过程中需自行承担风险。</li>";
                    setHtml +='</ul>';
                    setHtml +='</div>';
                    setHtml += "</div>";                 
        
                    // 菜单HTML
                    if(document.querySelector('#setMask')) return;
                    this.createElementWithSimple('div','zhmMenu');
                    let zhmMenu = document.getElementById('zhmMenu');
                    zhmMenu.innerHTML = setHtml;

                    // 处理设置的相关事件
                    let timerZhmIcon = setInterval(function(){
                        if (document.querySelector('#zhmMenu')){

                            clearInterval(timerZhmIcon); // 取消定时器

                            // 开关
                            let circular = document.querySelectorAll('.zhm_circular');
                            circular.forEach(function(item){
                                item.addEventListener('click', function(e){
                                    let buttonStyle = item.children[0].style;
                                    let left = buttonStyle.left;
                                    left = parseInt(left);
                                    let listLeftValue;
                                    if(left==0){
                                        buttonStyle.left = '22px';
                                        buttonStyle.background = '#fe6d73';
                                        item.style.background='#ffE5E5';
                                        if(item.nextSibling && item.nextSibling.getAttribute('data')){
                                            item.nextSibling.setAttribute('style','border: solid #ccc;border-width: 0 3px 3px 0;')
                                        }
                                        listLeftValue = 22;
                                    }else{
                                        buttonStyle.left = '0px';
                                        buttonStyle.background = '#fff';
                                        item.style.background='#fff';
                                        if(item.nextSibling){
                                            item.nextSibling.setAttribute('style','border: solid #EEE;border-width: 0 3px 3px 0;')
                                        }
                                        listLeftValue = 0;
                                    }
                                    let setListID = item.id;
                                    
                                    // 数组 setSwitchListJson 根据 optionID 过滤
                                    let filterSwitch = setSwitchListJson.filter(function(item){
                                        return item.optionID == setListID;
                                    })[0];
                                    var inputOptionID = filterSwitch.inputOptionID;
                                    if(inputOptionID && inputOptionID != ''){
                                        if(listLeftValue==22) {
                                            document.querySelector('#' + inputOptionID).style.display='block';
                                        }
                                        if(listLeftValue==0) {
                                            document.querySelector('#' + inputOptionID).style.display='none';
                                        }
                                    }                                 
                                    console.log('菜单开关设置后保存, setListID:' + setListID + ', listLeftValue:' + listLeftValue);
                                    GM_setValue(setListID,listLeftValue);
                                })

                            });

                            // 开关的输入框事件
                            for(var s=0;s<setSwitchListJson.length;s++){
                                let inputOptionID = setSwitchListJson[s].inputOptionID;
                                if(inputOptionID && inputOptionID != ''){
                                    let inputList = document.querySelectorAll('#input'+inputOptionID);
                                    inputList.forEach(function(item){
                                        item.addEventListener('blur', function(e){
                                            let value = item.value;
                                            console.log('菜单开关对应的文本输入设置后保存, inputOptionID:' + inputOptionID + ', value:' + value);
                                            GM_setValue(inputOptionID,value);
                                        })
                                    })
                                }
                            }

                            // 数据源的文本框添加事件
                            for(var j=0;j<inputTextDataSourceListJson.length;j++) {
                                let divId = inputTextDataSourceListJson[j].optionID;
                                let divEle = document.getElementById(divId);
                                // 获取 divEle 下所有的 type="text"
                                let inputList = divEle.querySelectorAll('input[type="text"]');
                                inputList.forEach(function(item){
                                    item.addEventListener('blur', function(e){
                                        let value = item.value;
                                        console.log('菜单数据源的文本框添设置后保存, divId:' + divId + ', value:' + value);
                                        GM_setValue(divId,value);
                                    })
                                });
                            }

                            // 模板选择
                            for(var j=0;j<templateListJson.length;j++) {
                                let divId = templateListJson[j].optionID;
                                let divEle = document.getElementById(divId);
                                // 获取 divEle 下所有的 type="checkbox"
                                let checkboxList = divEle.querySelectorAll('input[type="checkbox"]');
                                checkboxList.forEach(function(item){
                                    item.addEventListener('click', function(e){
                                        var hobbies = document.getElementsByName(divId);
                                        var value;
                                        for (j=0; j<hobbies.length; j++){
                                            if (hobbies[j].checked){
                                                if (!value){
                                                    value = hobbies[j].value;
                                                } else {
                                                    value += "," + hobbies[j].value;
                                                }
                                            }
                                        }
                                        console.log('divId '+ divId+ '选择了: ' + value);
                                        GM_setValue(divId,value);
                                })
                            });

                            // 导出导入按钮添加事件
                            let btnExport = document.getElementById('btnExportConfig');
                            btnExport.onclick = _this.exportConfigData;
                            let inputImport = document.getElementById('inputImportConfig');
                            // inputImport 添加
                            inputImport.addEventListener('change', _this.importConfigData);
                            let btnImport = document.getElementById('btnImportConfig');
                            btnImport.onclick = function() {
                                inputImport.click(); // 触发文件选择对话框
                            };
                        }

                        // 关闭窗口
                        document.querySelector('.iconSetSave').addEventListener('click',()=>{
                            // 可以保存一些信息 TODO
                            location.href=location.href;
                        })
                        }

                    })
                }
                /** 创建开关控件HTML */
                createSetSwitchHtml(setSwitchListJson){
                    var setHtml = '';
                    for(var setN=0;setN<setSwitchListJson.length;setN++) {
                        var listValue = setSwitchListJson[setN].default;
                        var optionID = setSwitchListJson[setN].optionID;
                        let backColor,arrowColor,switchBackCorlor;
                        if(listValue != 22){
                            backColor = '#fff';
                            arrowColor= '#EEE';
                            switchBackCorlor = '#FFF';
        
                        }else{
                            backColor = '#fe6d73';
                            arrowColor = '#CCC';
                            switchBackCorlor = '#FFE5E5';
                        }
        
                        if(optionID == ''){
                            arrowColor = '#EEE';
                        };
                        setHtml +="<li><span>"+setSwitchListJson[setN].optionName+"</span>";
                        setHtml +="<div class='setWrapLiContent'>";
                        setHtml +="<div class='zhm_circular' id='"+optionID+"' style='background-color: "+switchBackCorlor+";'><div class='round-button' style='background: "+backColor+";left: "+listValue+"px'></div></div>";
                        setHtml +="</div></li>";

                        // 生成输入框
                        var inputOptionID = setSwitchListJson[setN].inputOptionID;
                        var inputTitle = setSwitchListJson[setN].inputTitle;
                        // 如果 inputOptionID 不为 null 且不为空
                        if(inputOptionID && inputOptionID != '') {
                            var keywordShow;            
                            if(listValue == 22){
                                keywordShow = 'block';
                            }else{
                                keywordShow = 'none';
                            }
                            var inputActualValue = setSwitchListJson[setN].inputActualValue;
                            var inputExample = setSwitchListJson[setN].inputExample;
                            var tipKeyword = '请输入关键词,用","号隔开,如: ' + inputExample;
                            setHtml +="<div style='margin:5px 20px;display:"+keywordShow+";padding:5px 0px;' id='"+inputOptionID+"'><span class='text-input'>" + inputTitle + "<input value='"+GM_getValue(inputOptionID,inputActualValue)+"' id='input"+inputOptionID+"' class='text-input__body' placeholder='"+tipKeyword+"' style='width:88%'><span></div>";
                        }                       
                    }
                    return setHtml;
                }
                /** 创建文本框控件HTML */
                createInputTextHtml(inputTextListJson){
                    var setHtml = '';
                    for(var i=0;i<inputTextListJson.length;i++) {
                        let actualValue = inputTextListJson[i].actualValue;
                        setHtml +="<li><span>"+ inputTextListJson[i].optionName +"</span>";
                        setHtml +="<div class='setWrapLiContent' id='" + inputTextListJson[i].optionID + "'><input type='text' value='"+ actualValue +"' style='width:700px;' />";
                        setHtml +="</div></li>";    
                    }
                    return setHtml;
                }
                /** 创建模板选择控件HTML */
                createTemplateSelectHtml(templateListJson){
                    var setHtml = '';
                    var _this = this;
                    for(var i=0;i<templateListJson.length;i++) {
                        let templateArray = [];
                        let dataSourceStr = templateListJson[i].dataSource;
                        let templateSelectStr = templateListJson[i].selectCodes;
                        console.log('dataSourceStr:' + dataSourceStr);
                        console.log('templateSelectStr:' + templateSelectStr);
                        if(dataSourceStr){
                            let dataSourceArray = dataSourceStr.split(',');
                            dataSourceArray.forEach((dataSource,index) => {
                                let dataSourceItem = dataSource.split('|');
                                let code = dataSourceItem[0];
                                let name = dataSourceItem[1];
                                let check = 0;
                                if(templateSelectStr){
                                    let templateSelectArray = templateSelectStr.split(',');
                                    if(templateSelectArray.includes(code)){
                                        check = 1;
                                    }
                                }
                                let templateItem = {
                                    'code':code,
                                    'name':name,
                                    'check':check
                                }
                                templateArray.push(templateItem);
                            });
                        }
                        setHtml += _this.creteTemplateCKBHtml(templateListJson[i].optionName, templateListJson[i].optionID, templateArray);
                    }
                    return setHtml;
                }
                /** 创建模板多选框HTML */
                creteTemplateCKBHtml(cbkTitle, ckbName, templateArray){
                    var setHtml = '<li><span>'+ cbkTitle +'</span>';
                    setHtml += "<div class='setWrapLiContent' id='"+ ckbName +"'>";
                    setHtml += this.createCKBHtml(ckbName, templateArray);
                    setHtml +="</div></li>";
                    return setHtml;
                }
                /** 创建多选框HTML */
                createCKBHtml(ckbName, templateArray){
                    var setHtml = '<ul>';
                    var checkBoxHtml = '';
                    var checkBoxArray = [];
                    templateArray.forEach((template,index) => {
                        let checkFlag = template.check;
                        let checkStr = '';
                        // 如果 checkFlag 为 1，则默认选中
                        if(checkFlag == 1){
                            checkStr = 'checked';                           
                        }
                        checkBoxHtml += `<input type='checkbox' name='${ckbName}' value='${template.code}' ${checkStr} />${template.name}`;
                        checkBoxArray.push(`<input type='checkbox' name='${ckbName}' value='${template.code}' ${checkStr} />${template.name}`)
                    });
                    // checkBoxArray每10个一组
                    if(checkBoxArray.length > 10){
                        let groupArray = [];
                        let groupNum = Math.ceil(checkBoxArray.length / 10);
                        for(let i=0;i<groupNum;i++){
                            let group = checkBoxArray.slice(i*10,(i+1)*10);
                            groupArray.push(group);
                        }
                        groupArray.forEach((group,index) => {
                            setHtml += '<li>' + group.join('') + '</li>';
                        })
                    } else{
                        setHtml += '<li>' + checkBoxHtml + '</li>';
                    }
                    setHtml += '</ul>';
                    return setHtml;
                }
                /** 导入配置数据 */
                importConfigData(event) {
                    const file = event.target.files[0];
                    if (!file) {
                        return;
                    }
                
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            // 读取文件内容
                            const content = e.target.result;
                            const data = JSON.parse(content);
                
                            // 将数据写入油猴存储
                            GM_setValue('closeLeftMenu',data.closeLeftMenu || '0');
                            GM_setValue('autoCheckTemplateInfo',data.autoCheckTemplateInfo || '22');
                            GM_setValue('autoCheckTemplateContent',data.autoCheckTemplateContent || '22');
                            GM_setValue('switchAllYSPUseSignValue',data.switchAllYSPUseSignValue ||  '22');
                            GM_setValue('switchAllElementUseVOS',data.switchAllElementUseVOS || '22');
                            GM_setValue('notVOSElementValue',data.notVOSElementValue || defaultNotVOSElementValue);
                            GM_setValue('switchMustUseElementValue',data.switchMustUseElementValue || '22');
                            GM_setValue('mustUseElementValue',data.mustUseElementValue || defaultMustUseElementValue);
                            GM_setValue('switchMustYSPUseElementValue',data.switchMustYSPUseElementValue || '22');
                            GM_setValue('mustYSPUseElementValue',data.mustYSPUseElementValue || defaultMustYSPUseElementValue);
                            GM_setValue('switchMustNotYSPUseElementValue',data.switchMustNotYSPUseElementValue || '22');
                            GM_setValue('mustNotYSPUseElementValue',data.mustNotYSPUseElementValue || defaultMustNotYSPUseElementValue);
                            GM_setValue('switchMustChangeCardUseElementValue',data.switchMustChangeCardUseElementValue || '22');
                            GM_setValue('mustChangeCardUseElementValue',data.mustChangeCardUseElementValue || defaultMustChangeCardUseElementValue);
                            GM_setValue('switchMustTemplateUseElementValue',data.switchMustTemplateUseElementValue || '22');
                            GM_setValue('mustTemplateUseElementValue',data.mustTemplateUseElementValue || defaultMustTemplateUseElementValue);
                            GM_setValue('switchCreateNodeYSPKeywordValue',data.switchCreateNodeYSPKeywordValue || '22');
                            GM_setValue('createNodeYSPKeywordValue',data.createNodeYSPKeywordValue || defaultCreateNodeYSPKeywordValue);
                            GM_setValue('commonTemplate24DataSource',data.commonTemplate24DataSource || defaultCommonTemplate24DataSource);
                            GM_setValue('commonTemplate36DataSource',data.commonTemplate36DataSource || defaultCommonTemplate36DataSource);
                            GM_setValue('tradeTemplateDataSource',data.tradeTemplateDataSource || defaultTradeTemplateDataSource);
                            GM_setValue('changeCardTemplateDataSource',data.changeCardTemplateDataSource || defaultChangeCardTemplateDataSource);
                            GM_setValue('commonTemplate2DBDataSource',data.commonTemplate2DBDataSource || defaultCommonTemplate2DBDataSource);
                            GM_setValue('commonTemplate1DBDataSource',data.commonTemplate1DBDataSource || defaultCommonTemplate1DBDataSource);
                            GM_setValue('commonTemplateInsuranceDataSource',data.commonTemplateInsuranceDataSource || defaultCommonTemplateInsuranceDataSource);
                            GM_setValue('commonTemplate24Selected',data.commonTemplate24Selected || defaultCommonTemplate24Selected);
                            GM_setValue('commonTemplate36Selected',data.commonTemplate36Selected || defaultCommonTemplate36Selected);
                            GM_setValue('tradeTemplateSelected',data.tradeTemplateSelected || defaultTradeTemplateSelected);
                            GM_setValue('changeCardTemplateSelected',data.changeCardTemplateSelected || defaultChangeCardTemplateSelected);
                            GM_setValue('commonTemplate2DBSelected',data.commonTemplate2DBSelected || defaultCommonTemplate2DBSelected);
                            GM_setValue('commonTemplate1DBSelected',data.commonTemplate1DBSelected || defaultCommonTemplate1DBSelected);   
                            GM_setValue('commonTemplateInsuranceSelected',data.commonTemplateInsuranceSelected || defaultCommonTemplateInsuranceSelected);
                
                            alert('数据导入成功！');
                            location.href=location.href;
                        } catch (error) {
                            console.error('导入数据失败', error);
                            alert('导入数据失败，请检查文件格式。');
                        }
                    };
                    reader.readAsText(file);
                }
                /** 导出配置数据 */
                exportConfigData() {                
                    // 将数据转换为JSON字符串
                    const jsonString = JSON.stringify(config, null, 2);
                
                    // 创建 Blob 对象并下载
                    const blob = new Blob([jsonString], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                
                    // 创建下载链接
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'vfm_config_data.json';
                
                    // 触发下载
                    document.body.appendChild(a);
                    a.click();
                
                    // 移除下载链接
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
                /** 获取VFM的URL */
                getBaseVFMUrl() {
                    var origin = window.location.origin;
                    let baseUrl = origin + this.VFMUrlSubpath;
                    consoleInfo('BaseClass getBaseVFMUrl: ' + baseUrl);
                    return baseUrl;
                }
                /** 从URL中提取套件Id */
                getSuiteIdFromUrl(url) {
                    // 使用正则表达式匹配一个或多个数字  
                    let numbers = url.match(/\d+/g);
                    
                    if (numbers) {
                        let number = numbers[0];
                        // 如果 number 等于 5，则取第2个
                        if (number == 5) {
                            number = numbers[1];
                        }
                        console.log(number);
                        // 如果你想要获取所有的数字匹配项（尽管在这个例子中只有一个），你可以遍历数组  
                        // numbers.forEach(num => console.log(num));
                        return number;
                    } else {  
                        console.log('没有找到数字');
                        return 0;
                    }
                }
                /** 获取当前页面的套件Id */
                getSuiteId() {
                    var url = window.location.href;
                    console.log('当前URL: ' + url);
                    let suiteId = this.getSuiteIdFromUrl(url);
                    consoleInfo('getSuiteId: ' + suiteId);
                    return suiteId;
                }
                /** 请求接口POST */
                requestPOST(url, params) {
                    let _this = this;
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: url,
                            data: params,
                            headers: {
                                "User-agent": window.navigator.userAgent,
                                "content-type": "application/json",
                                "Authorization": _this.Authorization
                            },
                            onload: ({ status, response }) => {
                                console.log('requestPOST: ' + url + ' params: ' + params + ' response: ');
                                console.log(response);
                                if (status == 200) {
                                    resolve(response);
                                } else {
                                    console.error(`请求失败url: ${url} status: ${status} response: ${response}`);
                                    reject(response);
                                }
                            },
                            onerror: (response) => {
                                console.error(`请求失败url: ${url} response: ${response}`);
                                reject(response);
                            }
                        });
                    })
                }
                /** 请求接口GET */
                requestGET(url) {
                    let _this = this;
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            headers: {
                                "User-agent": window.navigator.userAgent,
                                "content-type": "application/json",
                                "Authorization": _this.Authorization
                            },
                            onload: ({ status, response }) => {
                                console.log('requestGET: ' + url + ' response: ');
                                console.log(response);
                                if (status == 200) {
                                    resolve(response);
                                } else {
                                    console.error(`请求失败url: ${url} status: ${status} response: ${response}`);
                                    reject(response);
                                }
                            },
                            onerror: (response) => {
                                console.error(`请求失败url: ${url} response: ${response}`);
                                reject(response);
                            }
                        });
                    })
                }
                /** 获取套件信息 */
                getSuiteDetailInfo(theSuiteId) {
                    if(theSuiteId == null || theSuiteId == 0){
                        return null;
                    }
                    let data = JSON.stringify({
                        suiteId: theSuiteId
                    });
                    let _this = this;
                    let requestUrl = this.BaseVFMUrl + 'fund/querySuiteDetail';
                    this.requestPOST(requestUrl, data)
                        .then(response => {
                            // 解析响应数据
                            const responseData = JSON.parse(response);
                            this.SuiteBaseInfo = responseData.data.suiteInfo;
                            this.CommonTemplates = responseData.data.commonTemplates;
                            this.SpecialTemplates = responseData.data.specialTemplates;
                            this.WorkFlowInfo = responseData.data.workFlowInfo;
        
                            _this.fillTemplatesContractElement();
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
                /** 导出套件信息 */
                queryExportSuiteInfo() {
                    let suiteId = this.SuiteBaseInfo.suiteId;
                    let requestUrl = this.BaseVFMUrl + 'fund/exportSuiteInfo/' + suiteId;
                    let _this = this;
        
                    _this.requestGET(requestUrl)
                        .then(response => {
                            consoleInfo('queryExportSuiteInfo: ' + response);
                            const responseData = JSON.parse(response);
                            if(responseData.data == null) {
                                console.error('未获取到套件详情');
                                return null;
                            }
                            let suiteName = responseData.data.suiteInfo.suiteName;
                            console.log('suiteName: ' + suiteName);
                            CommonToolClass.exportJsonFile(responseData.data, 'contract_package【' + suiteName + '】.json');
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
                 /** 获取套件流程图地址 */
                getSuiteFlowPicUrl(processInstanceId) {
                    return this.BaseVFMUrl.replace('contract','commonWorkflow') + '/processDiagram?processId=' + processInstanceId;
                }
                /** 查询模板历史要素（老接口） */
                queryHistoricalAnalytic(templateType, typeCode, templateId, templateName){
                    let requestUrl = this.BaseVFMUrl + 'historicalAnalytic/queryHistoricalAnalytic?templateTypeCode=' + typeCode;
                    if(templateType == TemplateType_Special) {
                        requestUrl = this.BaseVFMUrl + 'historicalAnalytic/queryHistoricalAnalyticSpecific?templateTypeCode=' + typeCode + '&templateId=' + templateId;
                    }
                    let _this = this;
                    _this.requestGET(requestUrl)
                        .then(response => {
                            consoleInfo('queryHistoricalAnalytic: ' + response);
                            const responseData = JSON.parse(response);
                            if(responseData.data == null) {
                                console.error('老接口未获取到模板合同要素,模板《' + templateName + '》,typeCode=' + typeCode + ',id=' + templateId);
                                return null;
                            }
                            if(templateType == TemplateType_Common && _this.CommonTemplates.length > 0) {
                                // 循环 CommonTemplates 
                                _this.CommonTemplates.forEach((template, index) => {
                                    if(template.templateId == templateId) {
                                        template.historicalAnalytic = responseData.data.analyticJson;
                                    }
                                });
                            }
                            if(templateType == TemplateType_Special && _this.SpecialTemplates.length > 0) {
                                _this.SpecialTemplates.forEach((template, index) => {
                                    if(template.templateId == templateId) {
                                        template.historicalAnalytic = responseData.data.analyticJson;
                                    }
                                });
                            }
            
                            return responseData.data.analyticJson;
                        })
                        .catch(error => {
                            console.error(error);
                            consoleError(`老接口获取模版《${templateName}》要素失败`);
                            return null;
                        });
                }
                /** 查询模板历史要素 */
                queryHistoricalAnalyticNew(templateType, templateTypeCode, templateId, templateName){
                    // suiteId 表示天数内
                    let requestData = JSON.stringify({
                        templateId: templateId,
                        suiteId: 3
                    });
                    let _this = this;
                    let requestUrl = this.BaseVFMUrl + 'fund/getTemplateElementInfo';
                    _this.requestPOST(requestUrl, requestData)
                        .then(response => { 
                            // 解析响应数据
                            const responseData = JSON.parse(response);
                            if(responseData.data == null) {
                                console.error('未获取到模板合同要素，模板《' + templateName + '》');
                                return null;
                            }
                            if(templateType == TemplateType_Common && _this.CommonTemplates.length > 0) {
                                // 循环 CommonTemplates 
                                _this.CommonTemplates.forEach((template, index) => {
                                    if(template.templateId == templateId) {
                                        template.historicalAnalytic = responseData.data.analyticJson;
                                    }
                                });
                            }
                            if(templateType == TemplateType_Special && _this.SpecialTemplates.length > 0) {
                                _this.SpecialTemplates.forEach((template, index) => {
                                    if(template.templateId == templateId) {
                                        template.historicalAnalytic = responseData.data.analyticJson;
                                    }
                                });
                            }
            
                            return responseData.data.analyticJson;
                        })
                        .catch(error => {
                            console.error(error);
                            consoleError(`新接口获取模版《${templateName}》要素失败(还未上线),开始通过老接口获取`);
                            _this.queryHistoricalAnalytic(templateType, templateTypeCode, templateId, templateName);
                            return null;
                        });
                }
                /** 填充模板合同要素 */
                fillTemplatesContractElement(){
                    let _this = this;
                    if(_this.CommonTemplates.length > 0) {
                        // 循环 CommonTemplates 
                        _this.CommonTemplates.forEach((template, index) => {
                            //console.log('开始填充第' + (index + 1) + '个通用模板');
                            _this.queryHistoricalAnalyticNew(TemplateType_Common, template.templateTypeCode, template.templateId, template.templateName);
                        });
                    }
                    if(_this.SpecialTemplates.length > 0) {
                        _this.SpecialTemplates.forEach((template, index) => {
                            //console.log('开始填充第' + (index + 1) + '个特殊模板');
                            _this.queryHistoricalAnalyticNew(TemplateType_Special, template.templateTypeCode, template.templateId, template.templateName);
                        });
                    }
                }
                /** 创建元素（简单版） */
                createElementWithSimple(dom,domId){
                    var rootElement = document.body;
                    var newElement = document.createElement(dom);    
                    newElement.id = domId;
                    var newElementHtmlContent = document.createTextNode('');
                    rootElement.appendChild(newElement);    
                    newElement.appendChild(newElementHtmlContent);
                }
                /** 创建元素 */
                createElement(tagName, elementId, className, typeName, textContent, hasSpan) {
                    let element = document.createElement(tagName);
                    if(elementId){
                        element.id = elementId;
                    }
                    if(className){
                        element.className = className;
                    }
                    if(typeName){
                        element.type = typeName;
                    }
                    if(textContent){
                        if(hasSpan) {
                            let span = document.createElement('span');
                            span.textContent = textContent;
                            element.appendChild(span);
                        } else {
                            element.textContent = textContent;
                        }   
                    }
                    return element;
                }
                /** 设置操作区域的标题 */
                setProcessSectionTitle(element, css){
                    element.querySelector(css).innerText = '模版助手';
                }
                /** 批量添加操作按钮 */
                batchAddProcessButton(parent , buttonClass){
                    // 添加操作按钮：校验模板基本信息
                    let btnCheckTemplateInfo = this.createElement('button', 'btnCheckTemplateInfo', buttonClass, 'button', '校验模板信息', true);
                    // 添加操作按钮：校验模板基本信息
                    let btnCheckTemplateContent = this.createElement('button', 'btnCheckTemplateContent', buttonClass, 'button', '校验模板内容', true);
                    // 添加操作按钮：导出模板JSON
                    let btnExportTemplateJson = this.createElement('button', 'btnExportTemplateJson', buttonClass, 'button', '导出模板JSON', true);
                    // 添加操作按钮：导出套件JSON
                    let btnExportSuiteJson = this.createElement('button', 'btnExportSuiteJson', buttonClass, 'button', '导出套件JSON', true);
        
                    let _this = this;
                    btnCheckTemplateInfo.addEventListener('click', function(){
                        _this.checkTemplateBaseInfo();
                    });
                    btnCheckTemplateContent.addEventListener('click', function(){
                        _this.checkTemplatesContent();
                    });
                    btnExportTemplateJson.addEventListener('click', function(){
                        _this.exportTemplateJson();
                    });
                    btnExportSuiteJson.addEventListener('click', function(){
                        _this.queryExportSuiteInfo();
                    });
        
                    if(isShowCheckTemplateButton) {
                        parent.appendChild(btnCheckTemplateInfo);
                        parent.appendChild(btnCheckTemplateContent);
                    }
                    
                    if(isShowExportButton) {
                        parent.appendChild(btnExportTemplateJson);
                        parent.appendChild(btnExportSuiteJson);
                    }
                }
                /** 批量添加操作文本框 */
                batchAddTextInput(parent, className){
                    // 创建文本框（正式）
                    let textareaCheck = document.createElement('textarea');
                    textareaCheck.id = 'textareaCheck';
                    if(className){
                        textareaCheck.className = className;
                    }
                    textareaCheck.style = 'resize: none;';
                    textareaCheck.style.marginBottom = '30px';
                    textareaCheck.placeholder = '请输入迁移正式模板的JSON串';
                    textareaCheck.style.height = '300px';
                    textareaCheck.style.width = '50%';
        
                    // 创建文本框（预审批）
                    let textareaCheckYSP = document.createElement('textarea');
                    textareaCheckYSP.id = 'textareaCheckYSP';
                    if(className){
                        textareaCheckYSP.className = className;
                    }
                    textareaCheckYSP.style = 'resize: none;';
                    textareaCheckYSP.style.marginBottom = '30px';
                    textareaCheckYSP.placeholder = '请输入迁移预审批模板的信息';
                    textareaCheckYSP.style.height = '300px';
                    textareaCheckYSP.style.width = '50%';
        
                    // 添加文本框
                    parent.appendChild(textareaCheck);
                    parent.appendChild(textareaCheckYSP);
                }
                /** 获取授权信息 */
                getAuthorizationStr() {
                    let access_token = sessionStorage.getItem('access_token');
                    let authorizationStr = 'Bearer ' + access_token;
                    return authorizationStr;
                }
                /** 显示校验出来的错误模板 */
                showTemplatesThatError(templatesThatAll, checkType){
                    // 如果 ulTemplatesThatContentError 存在，则先移除 ulTemplatesThatContentError 元素
                    if(document.getElementById('ulTemplatesThatContentError') != null) {
                        document.getElementById('ulTemplatesThatContentError').remove();
                    }
                    let _this = this;
        
                    // 清空行显示样式
                    if(_this.CommonTemplates.length > 0) {
                        _this.CommonTemplates.forEach((template, index) => { 
                                _this.setTemplateListTrStyle(template.templateId, template.templateName, '');
                            });
                    }
                    if(_this.SpecialTemplates.length > 0) {
                        _this.SpecialTemplates.forEach((template, index) => { 
                                _this.setTemplateListTrStyle(template.templateId, template.templateName, '');
                            });
                    }
                    // 获取当前时间 yyyy-MM-dd HH:mm:ss
                    let date = CommonToolClass.getNowTime();
        
                    let newUl = document.createElement('ul');
                    let liFirst = document.createElement('li');
                    liFirst.style.color = 'blue';
                    if(checkType == TemplateCheckType_BaseInfo) {
                        liFirst.innerText = `校验时间: ${date} 模板基本信息校验结果: `;
                    }
                    else if(checkType == TemplateCheckType_Content) {
                        liFirst.innerText = `校验时间: ${date} 模板内容校验结果: `;
                    } else if(checkType == TemplateCheckType_BaseInfoAndContent) {
                        liFirst.innerText = `校验时间: ${date} 模板基本信息和内容校验结果: `;
                    } else {
                        liFirst.innerText = `校验时间: ${date} 校验结果: `;
                    }
                    
                    newUl.appendChild(liFirst);
        
                    newUl.id = 'ulTemplatesThatContentError';
                    if(templatesThatAll.length == 0) {
                        let li = document.createElement('li');
                        li.style.color = 'green';
                        li.innerText = `所有模板通过了已配置的校验项！`;
                        newUl.appendChild(li);
                    } else {
                        // 打印 templatesThatAll
                        console.log("templatesThatAll: " + JSON.stringify(templatesThatAll));
        
                        // 循环 templatesThatAll
                        for(let i = 0; i < templatesThatAll.length; i++) {
                            let templateError = templatesThatAll[i];

                            let theErrorTr;
                            // 设置列表行样式
                            if(templateError.errorMsg.indexOf('模板名称不同') != -1) {
                                theErrorTr = _this.setTemplateListTrStyle(templateError.templateId, templateError.templateName, warnShowColor);
                            } else {
                                theErrorTr = _this.setTemplateListTrStyle(templateError.templateId, templateError.templateName, errorShowColor);
                            }

                            console.log('1739 theErrorTr: ' + theErrorTr);
                            
                            // 字体颜色为红色
                            let errorText = `${i+1}、模板《${templateError.templateName}》${templateError.errorMsg}`;
                            if(templateError.elementCode != null && templateError.elementCode != '') {
                                errorText += `，元素：${templateError.elementCode}`;
                            }
        
                            let li = document.createElement('li');
                            li.style.color = 'red';
                            li.innerText = errorText;
                            newUl.appendChild(li);
        
                            // 创建 a 标签
                            let a = document.createElement('a');
                            a.innerHTML = '。<u><i>跳转到模板<i></u>';
                            li.appendChild(a);
        
                            let tr = document.querySelector(`[data-row-key="${templateError.templateId}"]`);
                            // 如果tr为空，则当前循环结束
                            if(tr == null) {
                                tr = theErrorTr;
                                console.log('1761 tr: ' + tr + ' theErrorTr: ' + theErrorTr);
                                if(tr == null) {
                                    // li 移除 a
                                    li.removeChild(a);
                                    continue;
                                }
                            }
                            // 获取 tr 的背景色
                            let trBackgroundColor = tr.style.backgroundColor;
        
                            a.addEventListener('click',function(e){
                                window.scrollTo({
                                    top: _this.heightToTop(tr),
                                    behavior:'smooth'
                                });
                                 // 保存当前位置
                                const currentScroll = window.scrollY;
                                // 创建悬浮按钮返回原始位置
                                _this.createBackButton(currentScroll);
                                // 高亮当前行
                                _this.highlightElement(tr, trBackgroundColor);
                            });
        
                            // 如果 templateError.errorMsg 字符串包含 模板key不同
                            if(templateError.errorMsg.indexOf('模板key不同') != -1 && _this.CanUpdateKey) {
                                // 新增修改key标签
                                let aEditKey = document.createElement('a');
                                aEditKey.href = '#';
                                aEditKey.innerHTML = '。<u><i>修改key<i></u>';
                                li.appendChild(aEditKey);
        
                                aEditKey.addEventListener('click',function(e){
                                    // 找 tr 下的 button
                                    let button = tr.querySelector('button');
                                    // 模拟 button 点击
                                    button.click();
                                });
        
                                // 新增自动使用原key
                                let aAutoKey = document.createElement('a');
                                aAutoKey.href = '#';
                                aAutoKey.innerHTML = '。<u><i>自动使用原key<i></u>';
                                li.appendChild(aAutoKey);
                                aAutoKey.addEventListener('click',function(e){
                                    // templateError.errorMsg 取 : 分隔后的第二个数据
                                    let templateOldNewKey = templateError.errorMsg.split(':')[1];
                                    // // templateError.errorMsg 取 | 分隔后的第1个数据
                                    let templateOldKey = templateOldNewKey.split('|')[0];
                                    // templateOldKey 取 / 分隔后的第2个数据
                                    let templateOldPrimaryKey = templateOldKey.split('/')[1];
                                    // templateOldKey 如果包含 YSP 
                                    if(templateOldKey.indexOf('YSP') != -1) {
                                        templateOldPrimaryKey = templateOldKey.split('/')[1] + '/' + templateOldKey.split('/')[2];
                                    }
                                    console.log('templateOldPrimaryKey: ' + templateOldPrimaryKey);
                                    GM_setClipboard(templateOldPrimaryKey);
        
                                    // 找 tr 下的 button
                                    let button = tr.querySelector('button');
                                    // 模拟 button 点击
                                    button.click();
        
                                    setTimeout(() => {
                                        let newSystemKey = document.getElementById('fundsDetailModalForm_newSystemKey');
                                        newSystemKey.focus();
        
                                        // 获取id为 fundsDetailModalForm_newSystemKey 的文本框
                                        console.log('newSystemKey: ' + newSystemKey);
                                        console.log('newSystemKey.value: ' + newSystemKey.value);                     
        
                                        let windowTitle = document.querySelector('.ant-modal-title');
                                        windowTitle.innerHTML = '合同类型系统值修改（Ctrl + V 粘贴原key）';
                                    }, 1000);
        
                                    console.log('添加延时完成');
                                });
                            }                    
                        }
                    }
                
                    //dom 获取 id 为 commonContainerCheck 元素，追加 ulHtml
                    let commonContainerCheck = document.getElementById(_this.TemplateAuditDivId);
                    commonContainerCheck.appendChild(newUl);
                }
                /** 高亮元素  */
                highlightElement(element, originalBgColor) {
                    // 为目标元素添加高亮样式
                    element.style.transition = "background-color 0.5s ease";  // 设置过渡动画
                    element.style.backgroundColor = "#ffeb3b";  // 设置高亮背景色（黄色）
                
                    // 3秒后移除高亮样式
                    setTimeout(function () {
                        element.style.backgroundColor = originalBgColor;  // 恢复原背景色
                    }, 3000);
                }
                /** 创建返回按钮 */
                createBackButton(originalScrollPosition) {
                    const backButton = document.createElement("button");
                    backButton.textContent = "返回原位置";
                    backButton.style.position = "fixed";
                    backButton.style.bottom = "20px";
                    backButton.style.right = "20px";
                    backButton.style.padding = "10px";
                    backButton.style.backgroundColor = "#007bff";
                    backButton.style.color = "#fff";
                    backButton.style.border = "none";
                    backButton.style.borderRadius = "5px";
                    backButton.style.cursor = "pointer";
                    backButton.style.zIndex = "1000";
                
                    backButton.onclick = function () {
                        window.scrollTo({ top: originalScrollPosition, behavior: "smooth" });
                        document.body.removeChild(backButton);  // 点击后移除按钮
                    };
                
                    document.body.appendChild(backButton);
                }
                /** 计算滚动高度 */
                heightToTop(ele){
                    //ele为指定跳转到该位置的DOM节点
                    let root = document.body;
                    let height = 0;
                    do{
                        height += ele.offsetTop;
                        ele = ele.offsetParent;
                    }while( ele !== root )
                    return height;
                }
                /** 设置模板列表的样式 */
                setTemplateListTrStyle(templateId, templateName, color) {
                    let _this = this;
                    let tr = document.querySelector(`[data-row-key="${templateId}"]`);
                    if(tr) {
                        tr.style.backgroundColor = color;
                        return tr;
                    } else {
                        // 继续根据合同名称来找 
                        // 获取所有tbody中的tr元素
                        let theRow = _this.findContractRowByTemplateName(templateName, color);
                        console.log('1899找到的: ' + theRow);
                        return theRow;

                        console.error('未找到模板id为：' + templateId + '的tr');
                    }
                    
                }
                findContractRowByTemplateName(templateName, color) {
                    const rows = document.querySelectorAll('tbody.ant-table-tbody tr');
                    
                    for (const row of rows) {  // 使用 for...of 以便提前 break
                      const cells = row.querySelectorAll('td');
                      if (cells.length >= 3 && 
                          cells[2].textContent.trim() === templateName) {
                        
                        // 设置样式
                        row.style.backgroundColor = color;
                        row.style.setProperty('background-color', color, 'important');
                        
                        console.log('找到匹配行：', row);  // 可选：输出匹配元素到控制台
                        return row;  // 返回找到的 tr 元素
                      }
                    }
                    
                    console.warn('未找到匹配合同名称的行');
                    return null;  // 没有找到时返回 null
                  }
                /** 校验模板内容 */
                checkTemplatesContent() {
                    console.log('----------------开始校验模板内容----------------');
                    let _this = this;
                
                    // 每次重新校验时，清空上次校验的结果
                    TemplatesThatContentError = [];
                
                    // 含预审批模板的有问题的
                    let templatesThatYSPUseError = [];
                    // 含非预审批模板的签名有问题的
                    let templatesThatNotYSPUseError = [];
                    // 改卡模板的要素有问题的
                    let templatesThatChangeCardError = [];
                    // 所有模板的要素有问题的
                    let templatesThatCommonError = [];
                    // 必用解析值错误
                    let templatesThatMustUseElementError = [];
        
                    let allTemplates = [];
                    allTemplates = allTemplates.concat(this.CommonTemplates).concat(this.SpecialTemplates);
                    allTemplates.forEach((theTemplate,index) => {
                        consoleInfo(`当前校验第${index + 1}个模板《${theTemplate.templateName}》`);
                        if(theTemplate.historicalAnalytic != null && theTemplate.historicalAnalytic.length > 0) {
                            // 所有的变量校验
                            let result = _this.getTemplatesThatAllError(theTemplate);
                            if(result.length > 0) {
                                templatesThatCommonError = templatesThatCommonError.concat(result);
                            }
            
                            // 模板必用解析值校验
                            if(isMustTemplateUseElement) {
                                let mustUseResult = _this.getTemplatesThatMustUseElementError(theTemplate);
                                if(mustUseResult.length > 0) {
                                    templatesThatMustUseElementError = templatesThatMustUseElementError.concat(mustUseResult);
                                }
                            }
            
                            // 预审批模板
                            if(_this.getIsYSPByCreateNodes(theTemplate.createNodes)) {
                                // 预审批使用要素错误
                                let result = _this.getTemplatesThatYSPUseElementError(theTemplate);
                                if(result.length > 0) {
                                    templatesThatYSPUseError = templatesThatYSPUseError.concat(result);
                                }
                            } else {
                                if(isMustNotYSPUseElement) {
                                    let result = _this.getTemplatesThatNotYSPUseElementError(theTemplate);
                                    if(result.length > 0) {
                                        templatesThatNotYSPUseError = templatesThatNotYSPUseError.concat(result);
                                    }     
                                }

                                // 改卡
                                if(isMustChangeCardUseElement) {
                                    if(_this.getIsChangeCardByCreateNodes(theTemplate.createNodes)) {
                                        let result = _this.getTemplatesThatChangCardElementError(theTemplate);
                                        if(result.length > 0) {
                                            templatesThatChangeCardError = templatesThatChangeCardError.concat(result);
                                        }
                                    }
                                }
                            }
                        }
                    });  
                
                    // 如果 templatesThatYSPSignError 不为空则加到TemplatesThatContentError中
                    if(templatesThatYSPUseError.length > 0) {
                        templatesThatYSPUseError.forEach(item => {
                            TemplatesThatContentError.push(item);
                        });
                    }
                    if(templatesThatNotYSPUseError.length > 0) {
                        templatesThatNotYSPUseError.forEach(item => {
                            TemplatesThatContentError.push(item);
                        });
                    }
                    if(templatesThatChangeCardError.length > 0) {
                        templatesThatChangeCardError.forEach(item => {
                            TemplatesThatContentError.push(item);
                        });
                    }
                    if(templatesThatCommonError.length > 0) {
                        templatesThatCommonError.forEach(item => {
                            TemplatesThatContentError.push(item);
                        });
                    }
                    if(templatesThatMustUseElementError.length > 0) {
                        templatesThatMustUseElementError.forEach(item => {
                            TemplatesThatContentError.push(item);
                        });
                    }

                    console.log('TemplatesThatContentError: ' + JSON.stringify(TemplatesThatContentError));
                
                    // 展示错误结果
                    _this.showTemplatesThatError(TemplatesThatContentError, TemplateCheckType_Content);
                
                    console.log('----------------校验模板内容完成----------------');
                }
                /** 获取解析值错误的预审批模板 */
                getTemplatesThatYSPUseElementError(template) {
                    let returnResult = [];
                    let signArray = [];
                    let _this = this;
                
                    // 循环 historicalAnalytic
                    template.historicalAnalytic.forEach((analytic, index) => {
                        // 获取要素
                        let elementCode = analytic.elementCode;
                        let elementName = analytic.elementName;
                        
                        if(isMustYSPUseElement) {
                            let mustYSPUseElementValueArray = _this.splitStrToArray(mustYSPUseElementValue, ',');
                            mustYSPUseElementValueArray.forEach(item => {
                                let itemArray = _this.splitStrToArray(item, ':');
                                let itemKey = itemArray[0];
                                let itemCode = itemArray[1];
                                if(elementName.includes(itemKey) && itemCode != elementCode) {
                                    console.error(`预审批模板《${template.templateName}》【${itemKey}】配置了【${itemCode}】但使用了【${elementCode}】！`);
                                    const processTemplate = _this.getProcessTemplate(template, analytic, `预审批模板【${itemKey}】配置了【${itemCode}】但使用了【${elementCode}】`);
                                    returnResult.push(processTemplate);
                                }
                            });
                        }
                        
                        if(elementName.includes('签名')) {
                            signArray.push(elementCode);
                        }
                    });
                
                    // 如果 signArray 为空
                    if(isAllYSPUseSign && signArray.length == 0) {
                        console.error('预审批模板《' + template.templateName + '》中未使用签名');
                        const processTemplate = _this.getProcessTemplate(template, null, '预审批模板未使用签名');
                        returnResult.push(processTemplate);
                    }
                
                    return returnResult;
                }
                /** 获取解析值错误的非预审批模板 */
                getTemplatesThatNotYSPUseElementError(template) {
                    let returnResult = [];
                    let _this = this;
                
                    // 循环 historicalAnalytic
                    template.historicalAnalytic.forEach((analytic, index) => {
                        // 获取要素
                        let elementCode = analytic.elementCode;
                        let elementName = analytic.elementName;

                        let mustNotYSPUseElementValueArray = _this.splitStrToArray(mustNotYSPUseElementValue, ',');
                        mustNotYSPUseElementValueArray.forEach(item => {
                            let itemArray = _this.splitStrToArray(item, ':');
                            let itemKey = itemArray[0];

                            if(itemKey.includes('签名') && template.templateCreatorDesc != '我司生成') {
                                consoleInfo(`模板《${template.templateName}》非我司生成, 不校验非预审批模板的错误签名`);
                                return;
                            }

                            let itemCode = itemArray[1];
                            if(elementName.includes(itemKey) && itemCode != elementCode) {
                                console.error(`非预审批模板《${template.templateName}》【${itemKey}】配置了【${itemCode}】但使用了【${elementCode}】！`);
                                const processTemplate = _this.getProcessTemplate(template, analytic, `非预审批模板【${itemKey}】配置了【${itemCode}】但使用了【${elementCode}】`);
                                returnResult.push(processTemplate);
                            }
                        });
                    });
                
                    return returnResult;
                }
                /** 获取错误元素的改卡模板 */
                getTemplatesThatChangCardElementError(template) {
                    let returnResult = [];
                    let _this = this;
                
                    // 循环 historicalAnalytic
                    template.historicalAnalytic.forEach((analytic, index) => {
                        // 获取要素
                        let elementCode = analytic.elementCode;
                        let elementName = analytic.elementName;

                        let mustChangeCardUseElementValueArray = _this.splitStrToArray(mustChangeCardUseElementValue, ',');
                        mustChangeCardUseElementValueArray.forEach(item => {
                            let itemArray = _this.splitStrToArray(item, ':');
                            let itemKey = itemArray[0];
                            let itemCode = itemArray[1];
                            if(elementName.includes(itemKey) && itemCode != elementCode) {
                                console.error(`改卡模板《${template.templateName}》【${itemKey}】配置了【${itemCode}】但使用了【${elementCode}】！`);
                                const processTemplate = _this.getProcessTemplate(template, analytic, `改卡模板【${itemKey}】配置了【${itemCode}】但使用了【${elementCode}】`);
                                returnResult.push(processTemplate);
                            }
                        });
                    });
                
                    return returnResult;
                }
                /** 获取是否是改卡节点 */
                getIsChangeCardByCreateNodes(createNodes) {
                    return createNodes.includes(16);
                }
                /** 获取是否是预审批节点 */
                getIsYSPByCreateNodes(createNodes) {
                    return createNodes.includes(2);
                }
                 /** 获取模板必用解析值错误的模板 */
                getTemplatesThatMustUseElementError(template) {
                    let returnResult = [];
                    let templateKey = template.contractSysTemplateKey;
                    let simpleKey = templateKey.split('/')[1];
                    let _this = this;

                    let mustTemplateUseElementValueArray = _this.splitStrToArray(mustTemplateUseElementValue, ',');
                    mustTemplateUseElementValueArray.forEach(item => {
                        let itemArray = _this.splitStrToArray(item, ':');
                        let itemKey = itemArray[0];

                        // 模板没有匹配到则进入下一个配置
                        if(simpleKey != itemKey) {
                            return;
                        }

                        let itemCodes = itemArray[1];
                        let itemCodesArray = _this.splitStrToArray(itemCodes, '|');
                        let match = false;
                        itemCodesArray.forEach(itemCode => {
                            // 循环 historicalAnalytic
                            template.historicalAnalytic.forEach((analytic, index) => {
                                // 获取要素
                                let elementCode = analytic.elementCode;

                                if(itemCode == elementCode) {
                                    match = true;
                                    return;
                                }
                            });
                        });
                        if(!match) {
                            console.error(`模板《${template.templateName}》必用解析值【${itemKey}】配置了【${itemCodes}】但未使用！`);
                            const processTemplate = _this.getProcessTemplate(template, null, `配置了【${itemCodes}】但未使用`);
                            returnResult.push(processTemplate);
                        }
                    });

                    console.log('模板《' + template.templateName + '》必用解析值校验完成！结果：' + JSON.stringify(returnResult));
                     
                    return returnResult;
                }
                /** 获取含非VOS变量的模板 */
                getTemplatesThatAllError(template) {
                    let returnResult = [];
                    let _this = this;
                
                    // 循环 historicalAnalytic
                    template.historicalAnalytic.forEach((analytic, index) => {
                        // 获取要素
                        let elementCode = analytic.elementCode;
                        let elementName = analytic.elementName;
                
                        // 如果 elementCode 为数字（一般是章编码）则不校验
                        if(!isNaN(elementCode)) {
                            console.log('模板《' + template.templateName + '》中要素为数字: ' + elementCode + ' ' + elementName)
                            return;
                        }
                
                        // 如果 elementCode 不以 VOS 开头
                        if(isAllElementUseVOS) {
                            let notVOSElementValueArray = _this.splitStrToArray(notVOSElementValue,',');
                            if(!notVOSElementValueArray.includes(elementCode) && !elementCode.startsWith('VOS')) {    
                                console.error('模板【' + template.templateName + '】中要素为非VOS变量: ' + elementCode);
                                const processTemplate = _this.getProcessTemplate(template, analytic, '使用了非VOS变量,配置的是所有解析值用VOS');
                                returnResult.push(processTemplate);
                            }
                        }
                
                        // 校验必用的解析值
                        if(isMustUseElement) {
                            let mustUseElementValueArray = _this.splitStrToArray(mustUseElementValue,',');
                            mustUseElementValueArray.forEach(elementItem => {
                                let elementItemArray = _this.splitStrToArray(elementItem,':');
                                let elementItemName = elementItemArray[0];
                                let elementItmeCode = elementItemArray[1];
                                if(elementName.includes(elementItemName)) {
                                    if(elementCode != elementItmeCode) {
                                        console.error('模板《' + template.templateName + '》中必用的解析值【' + elementItemName + '】使用错误，应为【' + elementItmeCode + '】，但使用【' + elementCode + '】');
                                        const processTemplate = _this.getProcessTemplate(template, analytic, `必用的解析值【${elementItemName}】使用错误,配置的是${elementItmeCode}`);
                                        returnResult.push(processTemplate);
                                    }
                                }
                            }); 
                        }
             
                    });
                
                    return returnResult;
                }
                /** 校验模板基本信息 */
                checkTemplateBaseInfo() {
                    console.log('----------------开始校验模板基本信息----------------');
                    let _this = this;
                    if(!_this.CheckKeyFromQuery) {
                        _this.updteTemplateDataFromPage();
                    }
                    if(_this.UpdatePageSpecialTemplateTr) {
                        _this.updatePageSpecialTemplateTr();
                    }
        
                    // 每次校验都清空
                    TemplatesThatBaseInfoError = [];
        
                     // 校验模板key是否正确
                    let keyErrorArray = _this.checkTemplatesKey();
        
                    // 校验创建节点是否正确
                    let createNodeErrorArray = _this.checkTemplatesCreateNode();
        
                    let rateErrorArray = _this.checkCommonTemplatesSelectWithRate();
        
                    let guarErrorArray = _this.checkCommonTemplatesSelectWithGuar();
        
                    // 合并
                    TemplatesThatBaseInfoError = TemplatesThatBaseInfoError.concat(keyErrorArray).concat(createNodeErrorArray).concat(rateErrorArray).concat(guarErrorArray);
                    
                    // 展示校验结果
                    _this.showTemplatesThatError(TemplatesThatBaseInfoError, TemplateCheckType_BaseInfo);
        
                    console.log('----------------校验模板基本信息完成----------------');
                }
                /**
                 * 校验通用模板选择（担保）
                 * @returns 错误模板数组
                 */
                checkCommonTemplatesSelectWithGuar() {
                    console.log('----------------开始校验通用模板选择（担保）----------------');
                    let _this = this;
                    let errorTemplateArray = [];
                
                    let suiteName = _this.SuiteBaseInfo.suiteName;
                    let suiteType = _this.getSuiteTypeWithGuar(suiteName);
                    let commonTemplateMap = commonTemplate1DBMap;
                    if(suiteType == SuiteType_Insurance) {
                        commonTemplateMap = commonTemplateInsuranceMap;
                    } else if(suiteType == SuiteType_TwoGuar) {
                        commonTemplateMap = commonTemplate2DBMap;
                    }
                
                    // 校验通用模板
                    _this.CommonTemplates.forEach((template, index) => {
                        let templateKey = template.contractSysTemplateKey;
                        let simpleKey = templateKey.split('/')[1];
                        let templateName = template.templateName.trim();
                        // 如果 commonTemplateMap 是否存在 simpleKey 键
                        if(commonTemplateMap.has(simpleKey)) {
                            console.log(`通用模板《${templateName}》满足类型校验条件${simpleKey}`);
                            let templateTypeCode = template.templateTypeCode;
                            // 获取通用模板的key
                            let commonTemplateKeys = commonTemplateMap.get(simpleKey);
                            // 获取通用模板的key数组
                            let commonTemplateKeysArray = commonTemplateKeys.split(',');
                            if(!commonTemplateKeysArray.includes(templateTypeCode)) {
                                console.error(`通用模板《${templateName}》类型选择错误：${templateTypeCode}`);
                                let errorTemplate = _this.getProcessTemplate(template, null, '通用模板类型选择错误');
                                errorTemplateArray.push(errorTemplate);
                            }
                        }
                    });
                
                    console.log('----------------校验通用模板选择完成（担保）----------------');
                
                    return errorTemplateArray;
                }
                /** 校验通用模板选择（费率） */
                checkCommonTemplatesSelectWithRate() {
                    console.log('----------------开始校验通用模板选择（费率）----------------');
                    let _this = this;
                
                    let errorTemplateArray = [];
                
                    let suiteName = this.SuiteBaseInfo.suiteName;
                    let guarantorConsultantName = this.SuiteBaseInfo.guarantorConsultantName;
                    let suiteType = _this.getSuiteTypeWithRate(suiteName);
                
                    // 是否有担保咨询合同
                    let hasDBFWJZXHT = false;

                    // 校验通用模板
                    _this.CommonTemplates.forEach((template, index) => {
                        let templateName = template.templateName.trim();
                        let templateTypeCode = template.templateTypeCode.trim();
                        // 24 和 36 交叉检查
                        if(suiteType == SuiteType_24 || guarantorConsultantName == '') {
                            let templateSelectArray = commonTemplate36Selected.split(',');
                            if(templateSelectArray.includes(templateTypeCode)){
                                console.error(`通用模板《${templateName}》类型选择错误`);
                                let errorTemplate = _this.getProcessTemplate(template, null, '通用模板类型选择错误');
                                errorTemplateArray.push(errorTemplate);
                            }
                        } else {
                            let templateSelectArray = commonTemplate24Selected.split(',');
                            if(templateSelectArray.includes(templateTypeCode)){
                                console.error(`通用模板《${templateName}》类型选择错误`)
                                let errorTemplate = _this.getProcessTemplate(template, null, '通用模板类型选择错误');
                                errorTemplateArray.push(errorTemplate);
                            }
                        }
                        let templateKey = template.contractSysTemplateKey;
                        let simpleKey = templateKey.split('/')[1];
                        if(simpleKey == GuarConsultTemplateKey) {
                            console.log(`在通用模板列表中找到了担保咨询合同《${templateName}》`);
                            hasDBFWJZXHT = true;
                        }
                    });
                
                    // 特殊模板
                    _this.SpecialTemplates.forEach((template, index) => {
                        let templateKey = template.contractSysTemplateKey.trim();
                        let simpleKey = templateKey.split('/')[1];
                        let templateName = template.templateName.trim();
                        if(simpleKey == GuarConsultTemplateKey) {
                            console.log(`在特殊模板列表中找到了担保咨询合同《${templateName}》`);
                            hasDBFWJZXHT = true;
                        }
                    })
                
                    // 校验是否应该有担保咨询合同
                    let templateTemp = {
                        templateId: 0,
                        templateTypeCode: '',
                        templateName: ''
                    };
                    // 判断 guarantorConsultantName 不为空

                    if(!hasDBFWJZXHT && suiteType == SuiteType_36 && guarantorConsultantName != '') {
                        console.error(`36套件《${suiteName}》没有担保咨询合同`);
                        let errorTemplate = _this.getProcessTemplate(templateTemp, null, '缺失担保咨询合同');
                        errorTemplateArray.push(errorTemplate);
                    }
                    if(hasDBFWJZXHT && suiteType == SuiteType_24 && guarantorConsultantName == '') {
                        console.error(`24套件《${suiteName}》有担保咨询合同`);
                        let errorTemplate = _this.getProcessTemplate(templateTemp, null, '担保咨询合同多余');
                        errorTemplateArray.push(errorTemplate);
                    }
                
                    console.log('----------------校验通用模板选择完成（费率）----------------');
                
                    return errorTemplateArray;
                }
                /** 确认套件类型（担保） */
                getSuiteTypeWithGuar(suiteName) {
                    if(suiteName.includes('双担保')) {
                        return SuiteType_TwoGuar;
                    }
                    let insurerName = this.SuiteBaseInfo.insurerName;
                    // 如果 insurerName 不为空
                    if(insurerName != null && insurerName != '') {
                        return SuiteType_Insurance;
                    }
                    let guarantorName1 = this.SuiteBaseInfo.guarantorName1;
                    let guarantorName2 = this.SuiteBaseInfo.guarantorName2;
                    if(guarantorName1 != null && guarantorName1 != '' && guarantorName2 != null && guarantorName2 != '') {
                        return SuiteType_TwoGuar;
                    } else {
                        return SuiteType_OneGuar;
                    }
                }
                /** 确认套件类型（费率） */
                getSuiteTypeWithRate(suiteName) {
                    if(suiteName.includes(SuiteType_24)) {
                        return SuiteType_24;
                    } else if(suiteName.includes(SuiteType_36)) {
                        return SuiteType_36;
                    } else {
                        return SuiteType_24;
                    }
                }
                /** 校验模板生成节点是否正确 */
                checkTemplatesCreateNode(){
                    let _this = this;
                    console.log('--------开始校验模板的生成节点')
                    let yspErrorTemplates = [];
                    let tradeErrorTemplates = [];
                    let changeCardErrorTemplates = [];
        
                    let allTemplates = [];
                    allTemplates = allTemplates.concat(this.CommonTemplates).concat(this.SpecialTemplates);
                    allTemplates.forEach((template,index) => {
                        // 预审批节点不能和其他节点共存
                        let createNodes = template.createNodes;
                        // 如果 createNodes 长度大于1，并且包含2
                        if(createNodes.length > 1 && createNodes.includes(2)) {
                            let processTemplate = _this.getProcessTemplate(template, null, '预审批节点不能和其他节点共存');
                            yspErrorTemplates.push(processTemplate);
                        }
        
                        // 预审批节点
                        let yspTemplate = _this.processCreateNodeTemplates(template, CreateNodeType_YSP);
                        if(yspTemplate != null) {
                            yspErrorTemplates.push(yspTemplate);
                        }
        
                        // 交单/放款节点
                        let tradeTemplate = _this.processCreateNodeTemplates(template, CreateNodeTrade_Trade);
                        if(tradeTemplate != null) {
                            tradeErrorTemplates.push(tradeTemplate);
                        }
        
                        // 改卡节点
                        let changeCardTemplate = _this.processCreateNodeTemplates(template, CreateNodeType_ChangeCard);
                        if(changeCardTemplate != null) {
                            changeCardErrorTemplates.push(changeCardTemplate);
                        }
                    });
                     // 合并所有结果并去重
                    let errorTemplates = _this.uniqueTemplateArrayByName(yspErrorTemplates.concat(tradeErrorTemplates).concat(changeCardErrorTemplates));
        
                    console.log('--------校验模板的生成节点完成')
        
                    return errorTemplates;
                }
                /** template对象数组去重 */
                uniqueTemplateArrayByName(templateArray) {
                    if(templateArray.length > 0) {
                        let templateMap = new Map();
                        templateArray.forEach((template, index) => {
                            let templateName = template.templateName.trim();
                            if(!templateMap.has(templateName)) {
                                templateMap.set(templateName, template);
                            }
                        })
                        return Array.from(templateMap.values());
                    }
                    return templateArray;
                }
                /** 处理生成节点的模板 */
                processCreateNodeTemplates(template, createNodeType) {
                    // 获取当前行的数据
                    let createNodes = template.createNodes;
                    let templateKey = template.contractSysTemplateKey.trim();
                    let templateName = template.templateName.trim();
                    let simpleKey = templateKey.split('/')[1];
                    let _this = this;
                
                    // 校验是否设置生成节点
                    // 如果 createNodes 为空
                    if(createNodes == null || createNodes.length == 0) {
                        console.error(`模板《${templateName}》未设置生成节点`);
                        let processTemplate = _this.getProcessTemplate(template, null, '未设置生成节点');
                        return processTemplate;
                    }
                
                    if(createNodeType == CreateNodeType_YSP && isCreateNodeYSPKeyword) {
                        let createNodeYSPKeywordValueArray = _this.splitStrToArray(createNodeYSPKeywordValue, ',');
                        // createNodeYSPKeywordValueArray 里的字符串包含 templateName
                        if(createNodeYSPKeywordValueArray.some(item => templateName.includes(item))) {
                            console.log(`模板《${templateName}》满足预审批生成`);
                            // 判断 createNodes 数组是否包含 2
                            if(!createNodes.includes(2) && template.templateCreatorDesc == '我司生成') {
                                console.error(`满足预审批生成的模板《${templateName}》生成节点设置错误`);
                                let processTemplate = _this.getProcessTemplate(template, null, '生成节点设置错误,配置的是预审批要生成');
                                return processTemplate;
                            }
                        }                        
                    } else if(createNodeType == CreateNodeTrade_Trade) {
                        let tradeTemplateSelectedArray = _this.splitStrToArray(tradeTemplateSelected, ',');
                        if(tradeTemplateSelectedArray.includes(simpleKey)) {
                            console.log(`模板《${templateName}》满足交单/放款生成`);
                            if(!createNodes.includes(4) && !createNodes.includes(8)) {
                                console.error(`满足交单/放款生成的模板《${templateName}》生成节点设置错误`);
                                let processTemplate = _this.getProcessTemplate(template, null, '生成节点设置错误,配置的是交单/放款要生成');
                                return processTemplate;
                            }
                        }
                    } else if(createNodeType == CreateNodeType_ChangeCard) {
                        // CreateNodeTradeTemplates 数组中存在 simpleKey
                        let changeCardTemplateSelectedArray = _this.splitStrToArray(changeCardTemplateSelected, ',');
                        if(changeCardTemplateSelectedArray.includes(simpleKey)) {
                            console.log(`模板《${templateName}》满足改卡生成`);
                            if(!createNodes.includes(16) && template.templateCreatorDesc == '我司生成') {
                                console.error(`满足改卡生成的模板《${templateName}》生成节点设置错误`);
                                let processTemplate = _this.getProcessTemplate(template, null, '生成节点设置错误,配置的是改卡要生成');
                                return processTemplate;
                            }
                        }
                    }
                  
                    return null;      
                }
                /** 将字符串按指定字符分割为数组 */
                splitStrToArray(str, splitChar) {
                    let array = [];
                    if(str == null || str == '') {
                        return array;
                    }
                    if(str.indexOf(splitChar) > -1) {
                        array = str.split(splitChar);
                    } else {
                        array = [str];
                    }
                    return array;
                }
                /** 校验模板key */
                checkTemplatesKey(){
                    let errorTemplateArray = [];
                    let _this = this;
        
                    // 校验是否有重复的key
                    let repeatedTemplateArray = this.getTemplatesThatRepeatedKey();
                    errorTemplateArray = errorTemplateArray.concat(repeatedTemplateArray);
        
                    // 校验key值是否和文本框中的一致
                    let textareaCheckData = isOpenSuiteMigrateCheck ? this.getTextareaCheckContent() : null;
                    let textareaCheckYSPData = isOpenSuiteMigrateCheck ? this.getTextareaCheckYSPContent() : null;
        
                    // 没有迁移的正式合同则不再校验key是否一致
                    if(textareaCheckData == null) {
                        return errorTemplateArray;
                    }
        
                    let allTemplates = [];
                    allTemplates = allTemplates.concat(this.CommonTemplates).concat(this.SpecialTemplates);
                    allTemplates.forEach((template,rowIndex) => {  
                        // 特殊处理
                        if(template.templateName.trim() == '变更还款卡号的申请') {
                            template.templateName = '关于变更还款卡号的申请';
                        }
                        let templateName = template.templateName.trim();
                        let isYSP = _this.getIsYSPByCreateNodes(template.createNodes);
                        // 查找在 textareaCheckData 中与 contractName 匹配的项
                        const matchingItem = textareaCheckData.find(item => item.name === templateName);
                        if (matchingItem) {
                            // 校验key字符串值是否相等。
                            if (!isYSP && template.contractSysTemplateKey.trim() !== matchingItem.importIdentifierValue.trim()) {
                                console.error(`正式模板《${templateName}》key不同。`);
                                let templateError = _this.getProcessTemplate(template, null, `模板key不同。原/现:${matchingItem.importIdentifierValue}|${template.contractSysTemplateKey}`);
                                errorTemplateArray.push(templateError);
                            }
                        } else {
                            // 如果 textareaCheckYSPData 不为空
                            if(textareaCheckYSPData && textareaCheckYSPData.length > 0) {
                                console.log(`未匹配到正式第 ${rowIndex + 1} 个模板《${templateName}》，开始匹配预审批模板`);
                                // 匹配预审批的
                                // 查找 textareaCheckYSPData 数组里的 name 是否包含 template.templateName 
                                const matchingItemYSP = textareaCheckYSPData.find(item => item.name.includes(templateName));
                                if(matchingItemYSP) {
                                    console.log(`匹配到了预审批模板《${templateName}》开始校验key`);
                                    if (isYSP && template.contractSysTemplateKey.trim() !== matchingItemYSP.key.trim()) {
                                        console.error(`预审批模板《${templateName}》key不同。`);
                                        let templateError = _this.getProcessTemplate(template, null, `预审批模板key不同。原/现:${matchingItemYSP.key}|${template.contractSysTemplateKey}`);
                                        errorTemplateArray.push(templateError);
                                    }
                                } else {
                                    console.error(`预审批和正式模板《${templateName}》都未匹配到`);
        
                                    let errorMsg = _this.checkTemplateByKey(isYSP, template, textareaCheckData, textareaCheckYSPData);
                                    let templateError = _this.getProcessTemplate(template, null, errorMsg);
                                    errorTemplateArray.push(templateError);
                                }
                            } else {
                                console.error(`未匹配到正式第 ${rowIndex + 1} 个模板《${templateName}》，预审批模板未提供`);
                                let errorMsg = _this.checkTemplateByKey(isYSP, template, textareaCheckData, textareaCheckYSPData);
                                let templateError = _this.getProcessTemplate(template, null, errorMsg);
                                errorTemplateArray.push(templateError);
                            }
                        }
                    });
                    return errorTemplateArray;
                }
                /** 根据key来验证模板是否同一个模板 */
                checkTemplateByKey(isYSP, template, textareaCheckData, textareaCheckYSPData){
                    let errorMsg = '未匹配到模板';
        
                    if(!isYSP && textareaCheckData && textareaCheckData.length > 0) {
                        let matchingKeyItem = textareaCheckData.find(item => item.importIdentifierValue === template.contractSysTemplateKey);
                        if(matchingKeyItem) {
                            console.log(`匹配到了,正式模板名称不同: 原名称《${matchingKeyItem.name}》现名称《${template.templateName}》`);
                            errorMsg = `匹配到了,正式模板名称不同: 原名称《${matchingKeyItem.name}》现名称《${template.templateName}》`;
                        } else{
                            console.error(`正式模板《${template.templateName}》key不同。`);
                        }
                    }
        
                    if(isYSP && textareaCheckYSPData && textareaCheckYSPData.length > 0) {
                        let matchingKeyItem = textareaCheckYSPData.find(item => item.key === template.contractSysTemplateKey);
                        if(matchingKeyItem) {
                            errorMsg = `匹配到了,预审批模板名称不同: 原名称《${matchingKeyItem.name}》现名称《${template.templateName}》`;
                        } else{
                            console.error(`预审批模板《${template.templateName}》key不同。`);
                        }
                    }
        
                    return errorMsg;
                }
                /** 获取模板key重复的模版 */
                getTemplatesThatRepeatedKey(){
                    let allTemplateKeys = [];
                    let repeatedKeys = [];
        
                    let _this = this;
        
                    this.CommonTemplates.forEach(template => {
                        if(template.contractSysTemplateKey != null && template.contractSysTemplateKey.trim() !== '' && allTemplateKeys.includes(template.contractSysTemplateKey)) {
                            console.error(`模板key重复: ${template.contractSysTemplateKey}`);
                            if(!repeatedKeys.includes(template.contractSysTemplateKey)) {
                                repeatedKeys.push(template.contractSysTemplateKey);
                            }
                        }
                        if(template.contractSysTemplateKey != null && template.contractSysTemplateKey.trim() !== '') {
                            allTemplateKeys.push(template.contractSysTemplateKey);
                        }
                    });
        
                    this.SpecialTemplates.forEach(template => {
                        if(template.contractSysTemplateKey != null && template.contractSysTemplateKey.trim() !== '' && allTemplateKeys.includes(template.contractSysTemplateKey)) {
                            console.error(`模板key重复: ${template.contractSysTemplateKey}`);
                            if(!repeatedKeys.includes(template.contractSysTemplateKey)) {
                                repeatedKeys.push(template.contractSysTemplateKey);
                            }
                        }
                        if(template.contractSysTemplateKey != null && template.contractSysTemplateKey.trim() !== '') {
                            allTemplateKeys.push(template.contractSysTemplateKey);
                        }
                    });
        
                    // 处理重复的key
                    let repeatedTemplateArray = [];
                    repeatedKeys.forEach(key => {
                        console.error(`开始处理模板key重复: ${key}`);
                        _this.CommonTemplates.forEach((template, rowIndex) => {
                            if(key == template.contractSysTemplateKey) {
                                let templateError = _this.getProcessTemplate(template, null, `模板key重复。key: ${template.contractSysTemplateKey}`);
                                repeatedTemplateArray.push(templateError);
                            }
                        });
                        _this.SpecialTemplates.forEach((template, rowIndex) => {
                            if(key == template.contractSysTemplateKey) {
                                let templateError = _this.getProcessTemplate(template, null, `模板key重复。key: ${template.contractSysTemplateKey}`);
                                repeatedTemplateArray.push(templateError);
                            }
                        });
                    });
                    let repeatedTemplateNameArray = [];
                    // 打印出重复的模板名称
                    repeatedTemplateArray.forEach(template => {
                        if(!repeatedTemplateNameArray.includes(template.templateName)) {
                            repeatedTemplateNameArray.push(template.templateName);
                        }
                    });
                    if(repeatedTemplateNameArray.length > 0) {
                        console.error(`key重复的模板名称: ${repeatedTemplateNameArray}`);
                    }
        
                    return repeatedTemplateArray;
                }
                /** 组装待处理的模版 */
                getProcessTemplate(template, analytic, msg) {
                    let processTemplate = {
                        templateId: template.templateId,
                        templateTypeCode: template.templateTypeCode,
                        templateName: template.templateName.trim(),
                        elementCode: analytic != null ? analytic.elementCode : "",
                        elementName: analytic != null ? analytic.elementName : "",
                        errorMsg: msg
                    };
                    return processTemplate;
                }
                /** 更新页面特殊模板行属性 */
                updatePageSpecialTemplateTr(){
                    let _this = this;
                    console.log('开始更新页面特殊模板行属性')
                    const container = document.querySelector('.ant-spin-nested-loading');
                    //consoleInfo(container.innerHTML);
                    const tables = container.querySelectorAll('table');
                    //consoleInfo(tables.length);
                    // 只取特殊模板列表
                    const specialTemplateTables = Array.from(tables).slice(2, 3);
                    //consoleInfo(specialTemplateTables.length);
                    specialTemplateTables.forEach((table, tableIndex) => {
                        // 获取table中的所有行
                        const rows = table.querySelectorAll('tr');
                          // 遍历每一行
                        rows.forEach((row, rowIndex) => {
                            if(rowIndex == 0 || rowIndex == 1){
                                return;
                            }
                            //console.log('row.innerHTML: ' + row.innerHTML);
                            // 获取当前行中所有单元格
                            const cells = row.querySelectorAll('td');
                            // 过滤无效的行
                            if (cells.length < 5) {
                                // 跳过当前循环
                                return;
                            }
                            if(cells[0].innerText.trim() == '') {
                                return;
                            }
        
                            let templateName = cells[detailPageTemplateNameCellIndex].innerText.trim();
                            //consoleInfo('获取页面中特殊模板合同名称: ' + templateName);
                            // _this.SpecialTemplates 中的 templateName
                            _this.SpecialTemplates.forEach(template => {
                                if(templateName == template.templateName.trim()) {
                                    // 设置 row 的 data-row-key 属性未 templateId
                                    row.setAttribute('data-row-key', template.templateId);
                               }
                            })
        
                        });
                    });
                }
                /** 将页面中模板信息更新到本地变量中 */
                updteTemplateDataFromPage(){
                    let _this = this;
                    // 获取页面数据
                    let allTablesData = this.getTemplateDataFromPage('updateDepositForm');
                    // 将页面中可能调整了的key更新到 CommonTemplates 和 SpecialTemplates 中
                    if(allTablesData.length == 0) {
                        console.error('校验模板key失败, 未获取到页面模板数据！');
                        return;
                    }
                    allTablesData.forEach((tableData, tableIndex) => {
                        if(tableIndex == 0) {
                            console.log('--------通用模板: ');
                        } else {
                            console.log('--------特殊模板: ');
                        }
        
                        tableData.forEach((template, rowIndex) => { 
                            if(tableIndex == 0) {
                                consoleInfo('页面中的通用模板: ' + JSON.stringify(template));
                                _this.CommonTemplates.filter(item => item.templateId == template.templateId)[0].contractSysTemplateKey = template.contractSysTemplateKey.trim();
                            } else {
                                consoleInfo('页面中的特殊模板: ' + JSON.stringify(template));
                                _this.SpecialTemplates.filter(item => item.templateId == template.templateId)[0].contractSysTemplateKey = template.contractSysTemplateKey.trim();
                            }
                        });
                    });
                    console.log('更新key后的通用模板: ' + JSON.stringify(_this.CommonTemplates));
                }
                /** 获取页面中的模板数据 */
                getTemplateDataFromPage(dataSectionElementId) {
                    const form = document.getElementById(dataSectionElementId);
                    const tables = form.querySelectorAll('table');
                
                    // 只取模板列表
                    const firstTwoTables = Array.from(tables).slice(0, 2);
                
                    // 用于存放所有table数据的数组
                    const allTablesData = [];
                
                    // 遍历所有table
                    firstTwoTables.forEach((table, tableIndex) => {
                        // 用于存放单个table数据的数组
                        const tableData = [];
                
                        // 获取table中的所有行
                        const rows = table.querySelectorAll('tr');
                
                        // 遍历每一行
                        rows.forEach((row) => {              
                            // 获取当前行中所有单元格
                            const cells = row.querySelectorAll('td');
                            //console.log('cells.length=' + cells.length);
                            // 过滤无效的行
                            if (cells.length < 5) {
                                // 跳过当前循环
                                return;
                            }
                            if(cells[0].innerText.trim() == '') {
                                return;
                            }
                
                            let templateId = row.getAttribute('data-row-key');
                
                            //console.log('templateId=' + templateId);
                
                            let vbsKey = cells[1].innerText.trim();
                            // 清洗vbsKey，将 编辑 替换为空
                            vbsKey = vbsKey.replace('编辑', '');
                            vbsKey = vbsKey.replace(' ', '');
                            vbsKey = vbsKey.replace('-', '');
                
                            // 创建一个template对象
                            const template = {
                                templateId: templateId.trim(),
                                contractSysTemplateKey: vbsKey,
                                templateTypeDesc: cells[2].innerText.trim(),
                                templateName: cells[3].innerText.trim()
                            };
                            tableData.push(template);
                        });
                
                        // 将单个table数据添加到allTablesData
                        if (tableData.length > 0) {
                            allTablesData.push(tableData);
                        }
                    });
                
                    return allTablesData;
                }
                /** 获取文本框中迁移的预审批模板数据 */
                getTextareaCheckYSPContent() {
                    // 获取文本框的内容
                    const textareaContent = document.getElementById('textareaCheckYSP').value;
                    // 如果 textareaContent 内容为空
                    if (textareaContent.trim() === '') {
                        console.log('预审批文本框内容为空，不校验！');
                        return;
                    }
                
                    // 将内容按行拆分
                    const lines = textareaContent.trim().split('\n');
                
                    // 遍历每一行并解析 key 和 name
                    const resultArray = lines.map(line => {
                        // 使用制表符或多个空格分割
                        let [key, name] = line.split(/\s+/);
                        // key 和 name 去除前后空格
                        key = key.trim();
                        name = name.trim();
                        // name 去除后缀 .docx、.doc、.pdf
                        name = name.replace(/\.(docx|doc|pdf)$/, '');
                        return { key, name };
                    });
                    
                    return resultArray;
                }
                /** 获取文本框中迁移的正式模板数据 */
                getTextareaCheckContent() {
                    // 获取文本框的内容
                    const textareaContent = document.getElementById('textareaCheck').value;
                    // 如果 textareaContent 内容为空
                    if (textareaContent.trim() === '') {
                        console.log('文本框内容为空，不校验！');
                        return null;
                    }
                
                    try {
                        // 解析JSON字符串为对象数组
                        const dataArray = JSON.parse(textareaContent);
                
                        // 检查是否为数组
                        if (Array.isArray(dataArray)) {
                            console.info("解析后的数据满足条件");
                        } else {
                            console.error("解析后的数据不是一个数组！");
                        }
                
                        return dataArray;
                    } catch (error) {
                        console.error("解析JSON字符串失败！", error);
                    }
                }
                /** 获取导出的模版对象 */
                getExportTemplate(template) {
                    let processTemplate = {
                        templateKey: template.contractSysTemplateKey,
                        templateName: template.templateName.trim(),
                        createNodes: template.createNodeDescs,
                        belongsToDesc: template.belongsToDesc
                    };
                    return processTemplate;
                }
                /** 导出模板JSON */
                exportTemplateJson() {
                    let _this = this;
                    let exportTemplates = [];
                    if(_this.CommonTemplates.length > 0) {
                        _this.CommonTemplates.forEach(item => {
                            let exportTemplate = _this.getExportTemplate(item);
                            exportTemplates.push(exportTemplate);
                        })
                    }
                    if(_this.SpecialTemplates.length > 0) {
                        _this.SpecialTemplates.forEach(item => {
                            let exportTemplate = _this.getExportTemplate(item);
                            exportTemplates.push(exportTemplate);
                        })
                    }
                
                    console.log('exportTemplates=' + JSON.stringify(exportTemplates));
                
                    let suiteName = _this.SuiteBaseInfo.suiteName;
                    let nowTimeStr = CommonToolClass.getNowTime();
                    // nowTimeStr 去除-、空格、:
                    nowTimeStr = nowTimeStr.replace(/-| |:/g, '');
                
                    // 生成json文件，并下载
                    CommonToolClass.exportJsonFile(exportTemplates, `模板信息_${suiteName}_${nowTimeStr}.json`);
                }
            }
        
            /** 模板处理类 */
            class TemplateProcessClass extends BaseClass {
                constructor(name){
                    super(name);
                }
                /** 套件列表页面 */
                suiteFundsTemplate(){
                    var _this = this;
                    consoleInfo('进入suiteFundsTemplate()');
                }
                /**
                 * 套件详情页面处理
                 */
                suiteDetailProcess(){
                    this.UpdatePageSpecialTemplateTr = true;
                    var _this = this;
                    consoleInfo('进入suiteDetailProcess()');
                    let templateAuditSection = document.querySelector('#' + _this.TemplateAuditDivId);
        
                    async function getControls() {
                        if(templateAuditSection){
                            console.log('模版审核区域已存在');return;
                        }
            
                        let autoIconDom = await CommonToolClass.getElement('.ant-spin-container');
            
                        if(!autoIconDom){
                            console.log('没有找到DOM');return;
                        }
        
                         // 获取 autoIconDom 的最后一个子元素
                         let lastChild = autoIconDom.lastElementChild;
         
                         let newControl = lastChild.cloneNode(true);
                         newControl.style.backgroundColor = '#FFE';
        
                        // 设置标题
                        _this.setProcessSectionTitle(newControl, '.title');
        
                         let divTableContainer = newControl.querySelector('.ant-table-container');
                         // 移除 divTableContainer 所有子元素
                         while (divTableContainer.firstChild) {
                            divTableContainer.removeChild(divTableContainer.firstChild);
                         }
                         divTableContainer.id = _this.TemplateAuditDivId;
        
                        // 添加操作按钮
                        let divTitleContainer = newControl.querySelector('.title-container');
                        // 先 divTitleContainer 下所有的按钮
                        divTitleContainer.querySelectorAll('button').forEach(btn => {
                            btn.remove();
                        });
                        _this.batchAddProcessButton(divTitleContainer, 'ant-btn css-puyrxd ant-btn-primary');
        
                        // 添加文本框
                        if(isOpenSuiteMigrateCheck) {
                            _this.batchAddTextInput(divTableContainer, 'ant-input css-puyrxd');
                        }
                        
                         // 加新控件
                        autoIconDom.before(newControl);
        
                        consoleInfo('添加新控件成功');
                    }
                    getControls();
                }
                 /**
                 * 开发审核页面处理
                 */
                developerTemplateProcess() {
                    this.CheckKeyFromQuery = false;
                    this.CanUpdateKey = true;
        
                    var _this = this;
                    consoleInfo('进入developerTemplateProcess()');
                    async function getControls() {
                        let templateAuditSection = document.querySelector('#' + _this.TemplateAuditDivId);
        
                        if(templateAuditSection){
                            console.log('模版审核区域已存在');return;
                        }
        
                        let autoIconDom = await CommonToolClass.getElement('.ant-form');
        
                        if(!autoIconDom){
                            console.log('没有找到DOM');return;
                        }
        
                        // 获取 autoIconDom 的最后一个子元素
                        let lastChild = autoIconDom.lastElementChild;
                        //console.log('lastChild: ' + lastChild);
                        //console.log('lastChild.innerHTML: ' + lastChild.innerHTML);
        
                        let newControl = lastChild.cloneNode(true);
                        newControl.style.backgroundColor = '#FFE';
                        //console.log('newControl: ' + newControl);
                        //console.log('newControl.innerHTML: ' + newControl.innerHTML);
        
                        //consoleInfo('新控件标题：' + newControl.querySelector('.title').innerText);
        
                         // 设置标题
                         _this.setProcessSectionTitle(newControl, '.title');
        
                         // 添加操作按钮
                        let divTitleContainer = newControl.querySelector('.title-container');
                        _this.batchAddProcessButton(divTitleContainer, 'ant-btn css-puyrxd ant-btn-primary');
        
                         // 添加文本框
                         let devTableContainer = newControl.querySelector('.table-container');
                        // 移除 divTableContainer 所有子元素
                        while (devTableContainer.firstChild) {
                            devTableContainer.removeChild(devTableContainer.firstChild);
                        }
                        devTableContainer.id = _this.TemplateAuditDivId;
                        if(isOpenSuiteMigrateCheck) {
                            _this.batchAddTextInput(devTableContainer, 'ant-input css-puyrxd');
                        }              
        
                        // 加新控件
                        autoIconDom.before(newControl);
        
                        consoleInfo('添加新控件成功');
                    }
                    getControls();
                }  
            }
        }
    });

    /** 通用工具类 */
    class CommonToolClass {
        constructor() {
            this.host = window.location.host;
            this.pathname = window.location.pathname;
            this.href = window.location.href;
        }

        // 查找符合指定 CSS 选择器的元素或元素列表
        static getElement(css,all=''){
            return new Promise((resolve,reject)=>{
                let num = 0;
                let timer = setInterval(function(){
                    num++
                    let dom;
                    if(all == false){
                        dom = document.querySelector(css);
                        if(dom){
                            clearInterval(timer);
                            resolve(dom);
                        }
                    }else{
                        dom = document.querySelectorAll(css);
                        if(dom.length>0){
                            clearInterval(timer);
                            resolve(dom);
                        }
                    }
        
                    if(num==20){
                        clearInterval(timer);
                        resolve(false);
                    }
                },300)
            })
        }

        // 显示短暂的提示信息
        static toastMakeText(msg,duration){
            duration=isNaN(duration)?3000:duration;
            let toastDom = document.createElement('div');
            toastDom.innerHTML = msg;

            //toastDom.style.cssText="width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
            toastDom.style.cssText='padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'

            document.body.appendChild(toastDom);

            setTimeout(function() {
                var d = 0.5;
                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                toastDom.style.opacity = '0';
                setTimeout(function() { document.body.removeChild(toastDom) }, d * 1000);
            }, duration);
        }
        /** 导出json文件 */
        static exportJsonFile(jsonData, filename) {
            // 将 JSON 对象转换为字符串
            const jsonString = JSON.stringify(jsonData, null, 2);
         
            // 创建 Blob 对象
            const blob = new Blob([jsonString], { type: "application/json" });
         
            // 创建 URL 对象
            const url = URL.createObjectURL(blob);
         
            // 创建下载链接
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
         
            // 触发下载
            document.body.appendChild(a);
            a.click();
         
            // 移除下载链接
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
         }
        /** 获取当前时间 */
        static getNowTime(){
            var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth();//得到月份
            var date = now.getDate();//得到日期
            var day = now.getDay();//得到周几
            var hour = now.getHours();//得到小时
            var minu = now.getMinutes();//得到分钟
            var sec = now.getSeconds();//得到秒
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            if (hour < 10) hour = "0" + hour;
            if (minu < 10) minu = "0" + minu;
            if (sec < 10) sec = "0" + sec;
            var time = "";
            //精确到天
            time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
            // return time;
            console.log(time)
            return time
        }
    }
})();

// #region Console
const consoleDebug = (...msg) => {
    const dt = new Date();
    console.debug(
      '[%cVFMContractAssistant%c] %cDBG',
      'color: rgb(29, 155, 240);',
      '',
      'color: rgb(255, 212, 0);',
      `[${dt.getHours()}:${('0' + dt.getMinutes()).slice(-2)}:${('0' + dt.getSeconds()).slice(-2)}]`,
      ...msg
    );
};
const consoleError = (...msg) => {
    console.error(
      '[%cVFMContractAssistant%c] %cERROR',
      'color: rgb(29, 155, 240);',
      '',
      'color: rgb(249, 24, 128);',
      ...msg
    );
    for (const ex of msg) {
      if (typeof ex === 'object' && 'cause' in ex && typeof alert !== 'undefined') {
        alert(`[VFMContractAssistant] (${ex.cause}) ${ex.message}`);
      }
    }
};
const consoleInfo = (...msg) => {
    console.info(
      '[%cVFMContractAssistant%c] %cINF',
      'color: rgb(29, 155, 240);',
      '',
      'color: rgb(0, 186, 124);',
      ...msg
    );
};
const consoleLog = (...msg) => {
    console.log(
      '[%cVFMContractAssistant%c] %cLOG',
      'color: rgb(29, 155, 240);',
      '',
      'color: rgb(219, 160, 73);',
      ...msg
    );
};
// #endregion