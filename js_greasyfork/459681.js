// ==UserScript==
// @name         快麦助手Local常用链接
// @namespace    lezizi
// @version      0.1.1
// @description  快麦助手Local常用链接合集
// @author       Via
// @match        https://*.superboss.cc/*
// @icon         https://erp.superboss.cc/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/459681/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E5%B8%B8%E7%94%A8%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459681/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E5%B8%B8%E7%94%A8%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var linkMissonId = 0;
    var tryErrCount = 0;
    function addURLToHeader(){
        let headerInfo = document.querySelector("div.header-user-info");
        if (headerInfo === null) {
            tryErrCount++;
            console.log("无法定位：div.header-user-info，尝试第"+tryErrCount+"次");
            if (tryErrCount > 10){
                clearInterval(linkMissonId);
            }
            return;
        }
        if (document.querySelector("#link666")!==null){
            console.log("常用链接已添加");
            clearInterval(linkMissonId);
            return;
        }
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.id = "link666";
            sp.innerHTML=`
                <em>其他链接</em>
                <ul class="user-opr-list">
                <li> <a href="https://www.gds.org.cn/" target="_blank">条码申请</a> </li>
                <li> <a href="http://ddml.taolipin.com/store/public/login.html" target="_blank">指尖联盟</a> </li>
                <li> <a href="https://rs.jshrss.jiangsu.gov.cn/web/login" target="_blank">社保-人社</a> </li>
                <li> <a href="https://ybj.jszwfw.gov.cn/hsa-local/web/hallEnter/#/unitLogin" target="_blank">社保-医疗</a> </li>
                <li> <a href="https://wt.sqzfgjj.com/ish/home" target="_blank">公积金</a> </li>
                <li> <a href="http://www.js96008.com/" target="_blank">民丰银行</a> </li>
                </ul>
            `;
            return sp;
        }());
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.innerHTML=`
                <em><a href="https://www.kdocs.cn/l/cgzU2ApmzoBF" target="_blank">入库记录2023</a></em>
                <ul class="user-opr-list">
                    <li> <a href="https://www.kdocs.cn/l/cqkWk3f2YkuU" target="_blank">黄墩工厂2023</a> </li>
                    <li> <a href="https://www.kdocs.cn/l/ce4kH2GMRIgQ" target="_blank">张俊工厂2023</a> </li>
                    <li> <a href="https://www.kdocs.cn/l/cb1JMUpd2TCM" target="_blank">冯卫工厂2023</a> </li>
                    <li> <a href="https://www.kdocs.cn/l/cfzRKbh4nPVO" target="_blank">艾玛凯资料2023</a> </li>
                    <li> <a href="https://www.kdocs.cn/l/cd9FaPhi1OmY" target="_blank">zeze资料2023</a> </li>
                </ul>
            `;
            return sp;
        }());
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.innerHTML=`
                <em>销售平台</em>
                <ul class="user-opr-list">
                <li> <a href="https://myseller.taobao.com/home.htm#/index" target="_blank">天猫后台</a> </li>
                <li> <a href="http://sycm.taobao.com/portal/home.htm" target="_blank">生意参谋</a> </li>
                <li> <a href="https://myseller.taobao.com/home.htm/single" target="_blank">菜鸟打单</a> </li>
                <li> <a href="https://fxg.jinritemai.com/ffa/mshop/homepage/index" target="_blank">抖店后台</a> </li>
                <li> <a href="https://shop.jd.com/jdm/home" target="_blank">京东后台</a> </li>
                <li> <a href="https://mms.pinduoduo.com" target="_blank">拼多多后台</a> </li>
                <li> <a href="https://csp.aliexpress.com/apps/home" target="_blank">速卖通后台</a> </li>
                <li> <a href="https://sg-cgmp.aliexpress.com/aex-seller-center/aeg-receive-delivery/release/createReceiveDelivery" target="_blank">速卖通物流</a> </li>
                </ul>
            `;
            return sp;
        }());
        headerInfo.prepend(function(){
            let sp = document.createElement("span");
            sp.classList = "user-name";
            sp.innerHTML=`
                <em>个人记录</em>
                <ul class="user-opr-list">
                    <li> <a href="https://alidocs.dingtalk.com/i/nodes/KOEmgBoGwD78vyYnejo6JndLerP9b30a" target="_blank">资金记录</a> </li>
                    <li> <a href="https://www.kdocs.cn/l/clJiztdRG3qz" target="_blank">利润报表2023</a> </li>
                    <li> <a href="https://www.kdocs.cn/l/ctXVCywgpMX7" target="_blank">商品成本表</a> </li>
                    <li> <a href="https://www.kdocs.cn/l/cl49XYM73c2b" target="_blank">快递价格表</a> </li>
                </ul>
            `;
            return sp;
        }());
    }

    /**
    * 页面交互相关的事件绑定
    */

    // 页面加载完成后5秒执行
    //setTimeout(()=>{
    //    addURLToHeader();
    //},6000);

    linkMissonId = setInterval(()=>{
        addURLToHeader();
    },3000);

})();