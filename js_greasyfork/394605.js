// ==UserScript==
// @name         _crm小助手
// @namespace    https://ysslang.com/
// @version      1.0.8
// @description  crm页面小助手, 提供一些小功能
// @author       LeoYuan
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @match        https://crm.finereporthelp.com/*
// @grant        none
// @icon         https://crm.finereporthelp.com/WebReport/decision/resources?path=/com/fr/web/resources/dist/images/2x/background/logo.png
// @note         脚本地址：https://greasyfork.org/zh-CN/scripts/394605
// @downloadURL https://update.greasyfork.org/scripts/394605/_crm%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/394605/_crm%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 

/* DONE:
- 适配客户名片新增列;
*/

(function() {
  'use strict';
  // Your code here...
  var $ = window.jQuery;

  //用于获取url参数
  function getParameterFromUrl(parameter, url){
    var url_string = url || window.location.href;
    var newUrl = new URL(url_string);
    var value = newUrl.searchParams.get(parameter);
    return value;
  }

  //用于检查页面类型
  function checkPageType(type){
    type = type.toLowerCase();
    if(type==='iframe'){ return window.parent.location.href !== window.location.href; }
    if(type=='fs'){ return typeof(FS) === "object" && typeof(Dec) === "object"; }
    if(type==='fr'){ return typeof(FR) === "object" && typeof(FR.Browser) === "object"; }
    if(type==='frm'){ return typeof(_g()) === "object" && typeof(_g().content) === "object"; }
    if(type==='cpt'){ return typeof(_g()) === "object" && typeof(_g().$contentPane) === "object"; }
    return false;
  }

  //用于根据模板accessid或者模板名称和预览方式添加参数
  function addParametersToViewlet(viewlet, op, config, aq){
    if(getParameterFromUrl('pAdded') != 1){
      if((window.location.pathname.match(viewlet) || getParameterFromUrl('viewlet') == viewlet || getParameterFromUrl('reportlet') == viewlet || getParameterFromUrl('formlet') == viewlet) && (!op || getParameterFromUrl('op') == op)){
        if(aq) config.autoQuery=true;
        var parametersString = Object.keys(config).map(e=>encodeURIComponent(e)+'='+encodeURIComponent(config[e])).join('&');
        window.location.href += (window.location.href.includes('?') ? '&' : '?' ) + 'pAdded=1&' + parametersString;
      }}}

  //在报表加载完成后执行特定事件
  function executeCodeWhileTableLoadingForViewlet(viewlet, op, target, callback){
    if(getParameterFromUrl('pAdded') != 1){
      if((window.location.pathname.match(viewlet) || getParameterFromUrl('viewlet') == viewlet || getParameterFromUrl('reportlet') == viewlet || getParameterFromUrl('formlet') == viewlet) && (!op || getParameterFromUrl('op') == op)){
        var observer = new MutationObserver(function (mutations) { mutations.forEach(function (mutation) { if ($(mutation.addedNodes[0]).hasClass('sheet-container')) { callback() } }) });
        observer.observe(target, {childList: true});
      }
    }
  }

  //根据url是否包含自动查询参数autoQuery=true或aQ=1自动点击查询
  if((getParameterFromUrl("autoQuery") === "true" || getParameterFromUrl("aQ") == 1) && (checkPageType('cpt') || checkPageType('frm'))){
    setTimeout(function(){
      //if(window.performance.memory.usedJSHeapSize/1000000>100){
      //  window.location.reload();
      //}else{
      _g().parameterCommit();
      //}
    });
  }

  //根据url是否包含自动查询参数autoRefresh=x或aR=x自动刷新模板
  if((getParameterFromUrl("autoRefresh") > 0 || getParameterFromUrl("aR") > 0) && (checkPageType('cpt') || checkPageType('frm'))){
    setInterval(function(){ _g().parameterCommit() }, parseInt(getParameterFromUrl("aR") + getParameterFromUrl("autoRefresh")) * 1000);
  }

  //修复平台内页签外挂时无法打开新超链接的问题
  if(!checkPageType('iframe') && (checkPageType('cpt') || checkPageType('frm'))){
    window.FS = window.FS || {};
    window.FS.tabPane = {
      addItem: function(e){
        window.open(e.src+"&autoQuery=true")
      },
      closeActiveTab: function(){
        window.close();
      }
    };
  }

  //为指定模板添加参数
  addParametersToViewlet('contract/contract_view.cpt', '', {hide: 0});
  //addParametersToViewlet('1caa9248-0e8a-4424-9bc6-0016977a9a2b', '', {line:'finereport',banben:'11.0', fenzhi:'stable'}, 1)
  executeCodeWhileTableLoadingForViewlet('support/support_SLA_system/support_SLA_jiankong_copy.cpt', '', $('div.html-content')[0], function(){
    $('[cef="T5"]:not(:contains("'+FR.remoteEvaluate('$fine_username')+'")), [cef="T10"]:not(:contains("'+FR.remoteEvaluate('$fine_username')+'"))').parent().css('color','lightgrey');
    //$('[cef=R4],[cef=R5],[cef=R9],[cef=R10],[cef=AK4],[cef=AI9],[cef=AI10],[cef=AK5],[cef=AM4],[cef=AM5],[cef=AK9],[cef=AK10]').hide();
    $('[id^=D],[id^=E],[id^=G],[id^=R],[id^=AK],[cef=AM4],[cef=AM5]').hide();
  });
  executeCodeWhileTableLoadingForViewlet('jira/support_daily_report_hugh_change.cpt','',$('.reportPane .content-container')[0], function(){
    $('td[id=E5-0-0]').click(function(){$('td:contains(标签申请) span').slice(0,10).click()});
  });
  executeCodeWhileTableLoadingForViewlet('support/bug_label/cust_addlabel.cpt','',$('.reportPane .content-container')[0], function(){
    _g().setCellValue(0,1,10,21);
    var originalToast = FR.Msg.toast;
    FR.Msg.toast = function(e){e=='成功' ? window.close():originalToast(e)};
  });

  //客户名片查询页面添加一键复制名片的功能
  if(getParameterFromUrl('viewlet')=='customer/contact_list.cpt' || window.location.pathname.match('old-platform-reportlet-entry-11')){
    function bindCopyContactMethod(){
      $('td.bt0[col=10]').each(function(){
        var res = {};
        res.comname = $(this).parent().prevAll().andSelf().find('td[col=4]').last().text();
        res.comstate = $(this).parent().prevAll().andSelf().find('td[col=6]').last().text();
        res.province = $(this).parent().prevAll().andSelf().find('td[col=7]').last().text();
        res.salesman = $(this).parent().prevAll().andSelf().find('td[col=8]').last().text();
        res.contact = $(this).parent().find('td[col=9]').last().text();
        res.qq = $(this).parent().find('td[col=10]').last().text();
        res.mobile = $(this).parent().find('td[col=11]').last().text();
        res.tel = $(this).parent().find('td[col=12]').last().text();
        res.email = $(this).parent().find('td[col=13]').last().text();
        res.deadline = $(this).parent().prevAll().andSelf().find('td[col=18]').last().text();
        res.formalreply = $(this).parent().prevAll().andSelf().find('td[col=21]').last().text();
        res.area = $(this).parent().prevAll().andSelf().find('td[col=22]').last().text();
        res.team = $(this).parent().prevAll().andSelf().find('td[col=24]').last().text();
        //res.pstatus = $(this).parent().prevAll().andSelf().find('td[col=23]').last().text();
        //res.pstatus2 = $(this).parent().prevAll().andSelf().find('td[col=25]').last().text();
        res.cloudstatus = $(this).parent().prevAll().andSelf().find('td[col=37]').last().text();
        res.successimportant = $(this).parent().prevAll().andSelf().find('td[col=50]').last().text();
        //var result = Object.keys(res).map(e=>res[e].slice(0,20)).join(' ').slice(0,140);
        var result = [res.area, res.comname, res.salesman, res.comstate, res.deadline, res.team == '技术支持' ? '': res.team, res.contact, res.mobile].map(e=>e?e.slice(0,20):e).join(' ').slice(0,140);
        $(this).css('background', '#eee');
        $(this).attr('title', '点击该单元格可以复制用户名片信息');
        $(this).bind('click',()=>{
          navigator.clipboard.writeText(result);
          FR.Msg.toast('复制成功:\n' + result);
        });
      })
    }
    //添加页面容器监听事件
    var elementToObserve = document.getElementById('content-container')
    var observer = new MutationObserver(function() {
      if(_g().isLoadingPage == -1) setTimeout(bindCopyContactMethod);
    });
    observer.observe(elementToObserve, {childList: true});
    console.log('cc');
  }


  //将必要的方法挂到全局接口下供调用
  var _crm = window._crm = {};
  _crm.getParameterFromUrl = getParameterFromUrl;
  _crm.checkPageType = checkPageType;
  _crm.addParametersToViewlet = addParametersToViewlet;
  _crm.executeCodeWhileTableLoadingForViewlet = executeCodeWhileTableLoadingForViewlet;

})();
