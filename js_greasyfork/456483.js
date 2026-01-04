// ==UserScript==
// @name         I Love English Nsfocus Device Update!
// @namespace    ZHider
// @version      0.1.1
// @description  简单的对列表名进行重映射以便查找。
// @author       ZHider
// @match        *://update.nsfocus.com/*
// @note         2022-12-14 修正、更新了部分名称，优化了一点点显示效果。
// @downloadURL https://update.greasyfork.org/scripts/456483/I%20Love%20English%20Nsfocus%20Device%20Update%21.user.js
// @updateURL https://update.greasyfork.org/scripts/456483/I%20Love%20English%20Nsfocus%20Device%20Update%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var myEnglishDic = {
        "/update/bmgIndex" : "业务安全防护系统 BMG",
        "/update/bsaIndex" : "日志数据安全性分析系统 BSA",
        "/update/listEspcLIndex" : "绿盟授权管理系统 ESPC-L",
        "/update/listDmsIndex" : "数据脱敏系统 DMS",
        "/update/nespIndex" : "绿盟企业安全平台 NESP",
        "/update/isopIndex" : "绿盟智能安全运营平台 ISOP",
        "/update/uesIndex" : "一体化终端安全管理系统 UES",
        "/update/basIndex" : "防御突破模拟与评估系统 BAS",
        "/update/csspIndex" : "绿盟网络空间安全仿真平台 CSSP",
        "/update/isgIndex" : "工业防火墙 ISG",
        "/update/esphIndex" : "绿盟安全管理平台 ESP-H",
        "/update/ncssiIndex" : "云安全集中管理系统 NCSS-I",
        "/update/cnspIndex" : "绿盟云原生容器安全检测平台 CNSP",
        "/update/nissIndex" : "绿盟综合安全系统 NISS",
        "/update/tsaIndex" : "安全态势感知平台 TSA",
        "/update/tatIndex" : "威胁分析与溯源系统 TAT",
        "/update/listIds" : "网络入侵检测系统 IDS",
        "/update/listIps" : "网络入侵防护系统 IPS",
        "/update/listTac" : "威胁分析系统 TAC",
        "/update/listScm" : "内容安全管理系统 SCM",
        "/update/listSas" : "安全审计系统 SAS",
        "/update/idrIndex" : "敏感数据发现与风险评估系统 IDR",
        "/update/listSasL" : "安全审计系统-日志审计 SAS-L",
        "/update/listSasICSIndex" : "工控安全审计系统 ICS-SAS",
        "/update/listIdsICSIndex" : "工控入侵检测系统 ICS-IDS",
        "/update/listDas" : "数据库审计系统 DAS",
        "/update/listSash" : "运维安全管理系统堡垒机 OSMS/SASH",
        "/update/wafIndex" : "WEB应用防护系统 WAF",
        "/update/listHwaf" : "WEB应用防护系统主机版 WAF-H",
        "/update/listNf" : "下一代防火墙系统 NF",
        "/update/sgIndex" : "安全网关 SGI",
        "/update/listAuroraIndex" : "远程安全评估系统 RSAS",
        "/update/tvmIndex" : "绿盟威胁和漏洞管理平台 TVM",
        "/update/listICSScan" : "工控漏洞扫描系统 ICSScan",
        "/update/iscatIndex" : "工业网络安全合规评估工具 ISCAT",
        "/update/bvsIndex" : "安全配置核查系统 BVS",
        "/update/listWsms" : "网站安全监测系统 WSMS",
        "/update/listWvss" : "WEB应用漏洞扫描系统 WVSS",
        "/update/websafeIndex" : "ROS系统",
        "/update/CSSIndex" : "云安全集中管理系统 CSS",
        "/update/uipIndex" : "统一身份认证平台 UIP",
        "/update/sagIndex" : "安全认证网关 SAG",
        "/update/adsIndex" : "抗拒绝服务系统 ADS",
        "/update/adsmIndex" : "抗拒绝服务系统管理中心 ADS-M",
        "/update/ntaIndex" : "网络流量分析系统 NTA",
        "/update/listEspc" : "企业安全中心 ESPC",
        "/update/listEspcMDetail" : "云安全中心 ESPC-M",
        "/update/listMatrix" : "内网安全管理系统 Matrix",
        "/update/listEps" : "终端管理系统 EPS",
        "/update/apolloIndex" : "工程工具集 Apollo",
        "/update/saswIndex" : "绿盟上网行为管理 SASW",
        "/update/iotapIndex" : "物联网分析平台 IoT-AP",
        "/update/tdcIndex" : "公共互联网安全 僵木蠕 TDC",
        "/update/inspIndex" : "绿盟工业网络安全监测预警平台 INSP",
        "/update/bsaUtsIndex" : "绿盟综合威胁探针 UTS",
        "/update/sdaIndex" : "绿盟代码安全审计系统 SDA",
        "/update/listLas" : "绿盟日志审计系统 LAS",
        "/update/mdpsIndex" : "恶意代码检测方案 MDPS",
        "/update/rsasmIndex" : "绿盟远程安全评估管理系统 RSAS-M",
        "/update/sgecIndex" : "边缘计算智能网关 SGEC",
        "/update/siesIndex" : "安全隔离与信息交换系统 SIES",
        "/update/isidIndex" : "工业安全隔离装置 ISID",
    };

    // 兼容性
    function setInnerText(element, text) {
        // 判断浏览器是否支持这个属性
        if (typeof element.innerText == "undefined") { // 支持
            element.textContent = text;
        } else { // 支持
            element.innerText = text;
        }
     }

    let liNodeList = document.querySelectorAll("nav.sidebar > ul.item > li.open > a[href='/'] + ul > li");
    liNodeList.forEach(liNode => {
        // 设置样式让宽度能够容纳文字
        liNode.style.width = "230px";
        liNode.style.backgroundRepeat = "repeat";
        
        let aNode = liNode.children[0];
        aNode.style.textIndent = "14px";

        let newText = myEnglishDic[aNode.href.slice(25)]; // 25是正常的第二次update出现的常数值
        if (typeof(newText) != "undefined"){
            setInnerText(aNode, newText);
        }
    });

})();