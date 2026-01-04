// ==UserScript==
// @name         Saves default fields
// @namespace    http://leyilea.com/
// @version      v1.1
// @description  一体化保存默认显示字段
// @author       leyilea
// @license      leyilea
// @match        https://10.209.235.35/*
// @icon         https://jwt.io/img/pic_logo.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504781/Saves%20default%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/504781/Saves%20default%20fields.meta.js
// ==/UserScript==

(function() {


    /**
     默认显示列
    **/
    // 获取当前选择的选项
    function get_default_data(){
        let data =[];
        let arr = document.getElementsByClassName("checkbox-container")[0].getElementsByClassName("el-checkbox is-checked");
        for (let i = 0; i < arr.length; i++) {
            let ele = arr[i].getElementsByClassName("el-checkbox__label")[0].innerText;
            map.forEach(function(item, index, array){
                // item 是一个个的 { name: "HTTP请求体", value: "httpBody" }
                if(item["name"] == ele){
                    data.push(item["value"]);
                }
            })
        }
        console.log(data);
        return data;
    }

    function create_button(a_type){
        var button = document.createElement('button');
        button.id = 'myButton'+a_type;
        button.type = 'button';
        button.textContent = a_type;
        button.classList.add("el-button");
        button.classList.add("el-button--mini");
        button.innerHTML="<span>设为默认</span>";
        button.style.backgroundColor = "orange";
        button.style.color = "#fff";
        // （可选）为按钮添加事件监听器
        button.addEventListener('click', function() {
            //alert(1);
            // 获取当前选择的选项，并保存到浏览器
            let data = get_default_data();
            localStorage.setItem('key', data);
            // 模拟点击保存按钮
            document.getElementsByClassName("el-button el-button--primary el-button--mini")[1].click();


        });
        return button;
    }

    function addButton(){
        if(document.getElementsByClassName("floot-btns")[0]){
            var parent = document.getElementsByClassName("floot-btns")[0];
            if(document.getElementById("myButton设为默认")){
                // 什么也不做
            }else{
                var btn =create_button("设为默认");
                parent.appendChild(btn);
            }
        }else{
            return null;
        }
    }

    function send_request(){
        // 获取到保存在浏览器的data
        let data = localStorage.getItem('key');
        let arr_data = data.split(",");

        // 创建一个新的XMLHttpRequest对象
        var xhr = new XMLHttpRequest();

        // 设置请求完成后的回调函数
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 请求成功完成，处理响应
                // console.log(xhr.responseText);
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                // 请求完成但状态码不是200，处理错误
                console.error('Error:', xhr.statusText);
            }
        };

        // 设置请求的类型、URL和异步属性
        xhr.open('POST', 'https://10.209.235.35/fengyun-user/user/web/fy-user-table-field', false);

        // 设置请求头
        xhr.setRequestHeader('Content-Type', 'application/json');
        //xhr.setRequestHeader('sec-ch-ua', '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"');
        // ... 其他请求头也可以这样设置

        // 准备请求体
        var requestBody = JSON.stringify({
            "page": "safeOperationType1",
            "filedList":arr_data  // ["storeName", "alertDate", "attType", "reliability", "statusCode", "ruleName"]
        });
        xhr.send(requestBody);
    }

    setInterval(addButton, 2000);
    setInterval(send_request, 10000);




    /***

    一些数据 》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》

    ***/

    var map = [{
        name: "数据源类型",
        value: "storeName"
    }, {
        name: "数据源",
        value: "via"
    }, {
        name: "告警时间",
        value: "alertDate"
    }, {
        name: "攻击类型",
        value: "attType"
    }, {
        name: "事件描述",
        value: "eventDesc"
    }, {
        name: "攻击者",
        value: "invaderIp"
    }, {
        name: "攻击者端口",
        value: "invaderPort"
    }, {
        name: "受害者",
        value: "victimIp"
    }, {
        name: "受害者端口",
        value: "victimPort"
    }, {
        name: "攻击结果",
        value: "invasionResult"
    }, {
        name: "威胁等级",
        value: "reliability"
    }, {
        name: "事件名称",
        value: "alertName"
    }, {
        name: "等级",
        value: "alertLevel"
    }, {
        name: "类型",
        value: "alertType"
    }, {
        name: "状态",
        value: "alertStatus"
    }, {
        name: "关键字",
        value: "keywords"
    }, {
        name: "事件来源",
        value: "alertFrom"
    }, {
        name: "采集时间",
        value: "collectDate"
    }, {
        name: "服务器类型",
        value: "classifyId"
    }, {
        name: "攻击资产名称",
        value: "attackBranch"
    }, {
        name: "受害资产名称",
        value: "sufferBranch"
    }, {
        name: "首次告警时间",
        value: "firstTime"
    }, {
        name: "末次告警时间",
        value: "lastTime"
    }, {
        name: "攻击阶段",
        value: "invasionStage"
    }, {
        name: "确定性等级",
        value: "priority"
    }, {
        name: "次数",
        value: "count"
    }, {
        name: "资产方向",
        value: "assetDirection"
    }, {
        name: "紧急程度",
        value: "emergency"
    }, {
        name: "访问方向",
        value: "attackDirection"
    }, {
        name: "URL",
        value: "url"
    }, {
        name: "原数据ID",
        value: "oldDataId"
    }, {
        name: "攻击资产类型",
        value: "attAssetType"
    }, {
        name: "攻击国家",
        value: "attCountry"
    }, {
        name: "攻击省份",
        value: "attProvince"
    }, {
        name: "受害服务器类型",
        value: "sufferServerType"
    }, {
        name: "受害国家",
        value: "sufferCountry"
    }, {
        name: "受害省份",
        value: "sufferProvince"
    }, {
        name: "攻击子类",
        value: "attSubType"
    }, {
        name: "事件引擎",
        value: "eventEngine"
    }, {
        name: "原事件标签",
        value: "oldTags"
    }, {
        name: "动作",
        value: "eventAction"
    }, {
        name: "代理",
        value: "proxy"
    }, {
        name: "响应码",
        value: "statusCode"
    }, {
        name: "告警描述",
        value: "alertDesc"
    }, {
        name: "原理",
        value: "principleDesc"
    }, {
        name: "危害",
        value: "damageDesc"
    }, {
        name: "处置建议",
        value: "suggestDesc"
    }, {
        name: "受害主机名",
        value: "sufferHostName"
    }, {
        name: "攻击主机名",
        value: "attHostName"
    }, {
        name: "举证",
        value: "evidenceDesc"
    }, {
        name: "标签",
        value: "handleTag"
    }, {
        name: "HTTP请求头",
        value: "httpHeader"
    }, {
        name: "HTTP请求体",
        value: "httpBody"
    }, {
        name: "HTTP响应头",
        value: "resHeader"
    }, {
        name: "HTTP响应体",
        value: "resBody"
    }, {
        name: "HTTP请求URI",
        value: "uri"
    }, {
        name: "HTTP agent",
        value: "agent"
    }, {
        name: "HTTP请求方法",
        value: "method"
    }, {
        name: "HTTP请求Host",
        value: "host"
    }, {
        name: "HTTP请求cookie",
        value: "cookie"
    }, {
        name: "HTTP请求参数",
        value: "reqPara"
    }, {
        name: "HTTP状态码",
        value: "rspStatus"
    }, {
        name: "HTTP响应体字节数",
        value: "rspContentLength"
    }, {
        name: "Content-Type",
        value: "rspContentType"
    }, {
        name: "受害者类型",
        value: "victimType"
    }, {
        name: "是否为攻击类型告警",
        value: "attackFlag"
    }, {
        name: "确信度",
        value: "confidence"
    }, {
        name: "解决方案",
        value: "solution"
    }, {
        name: "漏洞描述",
        value: "vulnDesc"
    }, {
        name: "漏洞危害",
        value: "vulnHarm"
    }, {
        name: "漏洞名称",
        value: "vulnName"
    }, {
        name: "漏洞类型",
        value: "vulnType"
    }, {
        name: "MPLS标签",
        value: "mplsLabel"
    }, {
        name: "X-Forwarded-For",
        value: "xff"
    }, {
        name: "源MAC地址",
        value: "srcMac"
    }, {
        name: "目的MAC地址",
        value: "dstMac"
    }, {
        name: "原始包字节数",
        value: "packetSize"
    }, {
        name: "原始包数据",
        value: "packetData"
    }, {
        name: "攻击方法",
        value: "attackDethod"
    }, {
        name: "受影响系统",
        value: "affectedSystem"
    }, {
        name: "上行负载长度",
        value: "upPayloadSize"
    }, {
        name: "上行负载内容",
        value: "upPayload"
    }, {
        name: "下行负载长度",
        value: "downPayloadSize"
    }, {
        name: "下行负载内容",
        value: "downPayload"
    }, {
        name: "IOC类型",
        value: "iocType"
    }, {
        name: "IOC内容",
        value: "iocValue"
    }, {
        name: "威胁类型",
        value: "maliciousType"
    }, {
        name: "恶意家族",
        value: "maliciousFamily"
    }, {
        name: "攻击事件/团伙",
        value: "campaign"
    }, {
        name: "IOC来源",
        value: "iocSource"
    }, {
        name: "应用层协议",
        value: "proto"
    }, {
        name: "规则ID",
        value: "ruleId"
    }, {
        name: "规则名称",
        value: "ruleName"
    }, {
        name: "referer",
        value: "referer"
    }, {
        name: "CVE_ID",
        value: "cveId"
    }, {
        name: "CNNVD_ID",
        value: "cnnvdId"
    }, {
        name: "IOC唯一标识",
        value: "nid"
    }, {
        name: "DNS类型",
        value: "dnsType"
    }, {
        name: "传输层协议",
        value: "tproto"
    }, {
        name: "处置状态",
        value: "disposeState"
    }, {
        name: "更新时间",
        value: "updateTime"
    }, {
        name: "入库方式",
        value: "via"
    }, {
        name: "检测节点",
        value: "detectionNode"
    }, {
        name: "检测引擎",
        value: "detectionEngine"
    }, {
        name: "漏洞编号",
        value: "vulnerabilityId"
    }, {
        name: "威胁特征",
        value: "threatFeatures"
    }, {
        name: "是否实锤",
        value: "isVerified"
    }, {
        name: "行为编号",
        value: "behaviorId"
    }, {
        name: "连接方向",
        value: "connectionDirection"
    }, {
        name: "攻击城市",
        value: "attackCity"
    }, {
        name: "攻击地区",
        value: "attackRegion"
    }, {
        name: "攻击组织",
        value: "attackOrganization"
    }, {
        name: "受害城市",
        value: "victimCity"
    }, {
        name: "受害地区",
        value: "victimRegion"
    }, {
        name: "受害组织",
        value: "victimOrganization"
    }, {
        name: "应用信息",
        value: "appInfo"
    }, {
        name: "应用版本",
        value: "appVersion"
    }, {
        name: "操作系统",
        value: "os"
    }, {
        name: "操作系统版本号",
        value: "osVersion"
    }, {
        name: "原始请求",
        value: "rawRequest"
    }, {
        name: "原始响应",
        value: "rawResponse"
    }, {
        name: "事件ID",
        value: "eventId"
    }, {
        name: "检测模块",
        value: "detectionModule"
    }, {
        name: "session",
        value: "session"
    }, {
        name: "攻击载荷",
        value: "attackPayload"
    }, {
        name: "载荷解码方式",
        value: "payloadDecodingMethod"
    }, {
        name: "攻击载荷位置",
        value: "payloadLocation"
    }, {
        name: "事件类型",
        value: "eventType"
    }, {
        name: "域名",
        value: "domainName"
    }, {
        name: "站点ID",
        value: "siteId"
    }, {
        name: "防护对象ID",
        value: "protectedObjectId"
    }, {
        name: "策略ID",
        value: "policyId"
    }, {
        name: "是否封禁",
        value: "isBlocked"
    }, {
        name: "封禁信息",
        value: "blockInfo"
    }, {
        name: "告警信息",
        value: "alertInfo"
    }, {
        name: "攻击字符",
        value: "attackCharacters"
    }, {
        name: "浏览器识别",
        value: "browserDetection"
    }, {
        name: "WAF会话识别",
        value: "wafSessionDetection"
    }, {
        name: "探针IP",
        value: "devIp"
    }, {
        name: "请求",
        value: "request"
    }, {
        name: "响应",
        value: "response"
    }, {
        name: "源IP",
        value: "srcIp"
    }, {
        name: "目的IP",
        value: "destIp"
    }, {
        name: "源端口",
        value: "srcPort"
    }, {
        name: "目的端口",
        value: "destPort"
    }, {
        name: "攻击分类",
        value: "attackCategory"
    }, {
        name: "检测引擎",
        value: "detectionEngine"
    }, {
        name: "根域名",
        value: "rootDomain"
    }, {
        name: "事件一级分类",
        value: "eventPrimaryClassification"
    }, {
        name: "事件二级分类",
        value: "eventSecondaryClassification"
    }, {
        name: "事件三级分类",
        value: "eventTertiaryClassification"
    }, {
        name: "战术",
        value: "tactics"
    }, {
        name: "威胁标签",
        value: "threatTag"
    }, {
        name: "弱口令信息",
        value: "usernameWeakPassword"
    }, {
        name: "攻击链阶段",
        value: "attackChainPhase"
    }, {
        name: "逻辑ID",
        value: "logicId"
    }, {
        name: "其他特征信息",
        value: "otherFeatures"
    }, {
        name: "特征",
        value: "features"
    }, {
        name: "异常行为类型",
        value: "abnormalBehaviorType"
    }, {
        name: "弱口令登录状态",
        value: "weakPasswordLoginStatus"
    }, {
        name: "IOC原始值",
        value: "iocOriginalValue"
    }, {
        name: "远控类型",
        value: "remoteControlType"
    }, {
        name: "是否热点",
        value: "isHotspot"
    }, {
        name: "其他标签",
        value: "otherTags"
    }, {
        name: "请求Content-Type",
        value: "requestContentType"
    }, {
        name: "客户端IP归属",
        value: "clientIpAttribution"
    }, {
        name: "HTTP协议版本",
        value: "httpProtocolVersion"
    }, {
        name: "浏览器代理",
        value: "browserProxy"
    }, {
        name: "访问域名",
        value: "accessDomain"
    }, {
        name: "篡改原因",
        value: "tamperingReason"
    }, {
        name: "篡改网址",
        value: "urlTampering"
    }, {
        name: "触发告警接口",
        value: "alarmTriggerInterface"
    }, {
        name: "协议",
        value: "protocol"
    }, {
        name: "日志分类",
        value: "logCategory"
    }, {
        name: "请求Content-Length",
        value: "requestContentLength"
    }, {
        name: "响应Content-Type",
        value: "responseContentType"
    }, {
        name: "响应Content-Length",
        value: "responseContentLength"
    }, {
        name: "WAF响应码",
        value: "wafResponseCode"
    }, {
        name: "服务器真实响应码",
        value: "serverRealResponseCode"
    }, {
        name: "关联ID",
        value: "relatedId"
    }, {
        name: "原始客户端IP",
        value: "originalClientIp"
    }, {
        name: "绑定IP",
        value: "boundIp"
    }, {
        name: "绑定MAC",
        value: "boundMac"
    }, {
        name: "冲突MAC",
        value: "conflictingMac"
    }, {
        name: "请求或响应",
        value: "requestOrResponse"
    }, {
        name: "描述信息",
        value: "description"
    }, {
        name: "站点名称",
        value: "siteName"
    }, {
        name: "虚拟站点名称",
        value: "virtualSiteName"
    }, {
        name: "流量控制规则ID",
        value: "flowControlRuleId"
    }, {
        name: "下行速率阈值",
        value: "downlinkThreshold"
    }, {
        name: "上行速率阈值",
        value: "uplinkThreshold"
    }, {
        name: "实际下行速率",
        value: "currentDownlinkSpeed"
    }, {
        name: "实际上行速率",
        value: "currentUplinkSpeed"
    }, {
        name: "攻击类型ID",
        value: "attackType"
    }, {
        name: "联动状态",
        value: "linkageStatus"
    }, {
        name: "关系",
        value: "relation"
    }, {
        name: "攻击子类ID",
        value: "subAttackType"
    }, {
        name: "排查建议",
        value: "analyzeSuggest"
    }, {
        name: "是否已读",
        value: "isRead"
    }, {
        name: "告警ID",
        value: "alertId"
    }, {
        name: "记录日期",
        value: "recordDate"
    }, {
        name: "受害者资产设备全类型ID",
        value: "sufferClassifyId"
    }, {
        name: "攻击者资产设备类型ID",
        value: "attackClassify1Id"
    }, {
        name: "受害者资产ID",
        value: "sufferAssetId"
    }, {
        name: "受害者资产设备类型ID",
        value: "sufferClassify1Id"
    }, {
        name: "日志产生时间",
        value: "logTime"
    }, {
        name: "攻击者资产组ID",
        value: "attackBranchId"
    }, {
        name: "挖矿阶段",
        value: "miningStage"
    }, {
        name: "记录更新时间",
        value: "updatedAt"
    }, {
        name: "索引ID",
        value: "logIds"
    }, {
        name: "攻击者资产分类",
        value: "attackClassifyId"
    }, {
        name: "设备信息",
        value: "devName"
    }, {
        name: "模块大类",
        value: "moduleType"
    }, {
        name: "命中hole_id列表",
        value: "holeIds"
    }, {
        name: "设备号",
        value: "deviceNumber"
    }, {
        name: "受害者资产组ID",
        value: "sufferBranchId"
    }, {
        name: "是否白名单",
        value: "isWhite"
    }, {
        name: "告警消减",
        value: "misreport"
    }, {
        name: "IOC内容",
        value: "ioc"
    }, {
        name: "哈希归并字段",
        value: "hashId"
    }, {
        name: "攻击者资产ID",
        value: "attackAssetId"
    }];


})();