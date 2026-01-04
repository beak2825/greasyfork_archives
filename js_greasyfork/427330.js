// ==UserScript==
// @name         解析天眼的每条告警成特定格式
// @namespace    undefined
// @version      3.4.4.0
// @description  复制天眼的告警列表，转化成要求的格式
// @author       江南小虫虫
// @match        *://sec-service.skyeye.qianxin-inc.cn/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant    GM_addStyle
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/427330/%E8%A7%A3%E6%9E%90%E5%A4%A9%E7%9C%BC%E7%9A%84%E6%AF%8F%E6%9D%A1%E5%91%8A%E8%AD%A6%E6%88%90%E7%89%B9%E5%AE%9A%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/427330/%E8%A7%A3%E6%9E%90%E5%A4%A9%E7%9C%BC%E7%9A%84%E6%AF%8F%E6%9D%A1%E5%91%8A%E8%AD%A6%E6%88%90%E7%89%B9%E5%AE%9A%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 传入时间数组，计算最早时间和最晚时间
    function get_date_range(date_array) {
        date_array.sort(function(a, b) {
            let a1 = new Date(a);
            let b1 = new Date(b);
            return a1 - b1;
        });
        if (date_array[0] == date_array[date_array.length - 1]) {
            return date_array[0];
        } else {
            return date_array[0] + "至" + date_array[date_array.length - 1];
        }
    }

    // 判断对象是否为空，这里用于字典是否有key
    function isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    //去左右空格
    function trim(s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }
    /*判断是否是内网IP*/
    function isInnerIPFn(ipAddress) {
        var isInnerIp = false; //默认给定IP不是内网IP      
        var ipNum = getIpNum(ipAddress);
        /** 
         * 私有IP：A类  10.0.0.0    -10.255.255.255 
         *       B类  172.16.0.0  -172.31.255.255    
         *       C类  192.168.0.0 -192.168.255.255   
         *       D类   127.0.0.0   -127.255.255.255(环回地址)  
         **/
        var aBegin = getIpNum("10.0.0.0");
        var aEnd = getIpNum("10.255.255.255");
        var bBegin = getIpNum("172.16.0.0");
        var bEnd = getIpNum("172.31.255.255");
        var cBegin = getIpNum("192.168.0.0");
        var cEnd = getIpNum("192.168.255.255");
        var dBegin = getIpNum("127.0.0.0");
        var dEnd = getIpNum("127.255.255.255");
        isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, cBegin, cEnd) || isInner(ipNum, dBegin, dEnd);
        console.log('是否是内网:' + isInnerIp);
        return isInnerIp;
    }

    function getIpNum(ipAddress) { /*获取IP数*/
        var ip = ipAddress.split(".");
        var a = parseInt(ip[0]);
        var b = parseInt(ip[1]);
        var c = parseInt(ip[2]);
        var d = parseInt(ip[3]);
        var ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
        return ipNum;
    }

    function isInner(userIp, begin, end) {
        return (userIp >= begin) && (userIp <= end);
    }
    // Your code here...
    // 设置定时器,定时增加复制按钮
    window.setInterval(function() {
        if (window.location.href.indexOf("hwop/alarm") != -1) {
            add_mul_copy_btn();
            add_copy_btn();
        }
    }, 1000);
    window.setInterval(function() {
        if (window.location.href.indexOf("hwop/alarm") != -1) {
            checkHadCheck();
        }
    }, 100);

    function add_mul_copy_btn() {
        if (!document.querySelector(".my-mul-copy")) {
            console.log("添加我的复制");
            if (document.querySelector(".toolbar")) {
                var mul_copy_btn = document.createElement("button");
                mul_copy_btn.type = "button";
                mul_copy_btn.onclick = function() {
                    do_mul_copy(this);
                };
                //  is-disabled
                mul_copy_btn.className = "q-button copy-info q-button--primary q-button--small my-mul-copy";
                var mul_copy_btn_span = document.createElement("span");
                var mul_copy_btn_span_i = document.createElement("span");
                mul_copy_btn_span_i.className = "iconfont qax-icon-Copy";
                // mul_copy_btn_span_i.textContent = "::before";
                var mul_copy_btn_span_text = document.createElement("span");
                mul_copy_btn_span_text.textContent = "我的复制";
                mul_copy_btn_span.append(mul_copy_btn_span_i);
                mul_copy_btn_span.append(mul_copy_btn_span_text);
                mul_copy_btn.append(mul_copy_btn_span);
                document.querySelector(".toolbar").append(mul_copy_btn);
                console.log("添加成功");
            }
        }
    }

    // 添加复制按钮
    function add_copy_btn() {
        // 这里需要判断有没有这个元素再增加
        if (document.querySelectorAll(".bizcom-table-selection-with-arrow").length > 2) {
            //给每一列加上复制按钮
            var all_list_cell = [...document.querySelectorAll(".biz-table-column-_operation:not(.is-hidden)  > .cell.q-tooltip")].filter(checkHadCopy);
            for (var item_list of all_list_cell) {
                var div = document.createElement("div");
                var copy_btn = document.createElement("button");
                copy_btn.type = "button";
                copy_btn.onclick = function() {
                    do_copy(this)
                };
                copy_btn.className = "q-button q-button--text q-button--small my-copy"
                var span = document.createElement("span");
                span.textContent = "复制";
                copy_btn.appendChild(span);
                div.appendChild(copy_btn);
                // 平台把宽度改得太小了，放不下了。。。
                item_list.style.width = "73px";
                item_list.append(copy_btn);
            }
        }
    }

    // 检查是否勾选了告警
    function checkHadCheck() {
        let my_mul_copy_btn = document.querySelector(".my-mul-copy");
        if (my_mul_copy_btn) {
            var user_check_list = [...document.querySelectorAll('.cell > .q-checkbox.is-checked')].filter(elm => (!elm.closest('.is-hidden') && !elm.closest('.is-leaf')));
            if (user_check_list.length > 0) {
                if (my_mul_copy_btn.className.indexOf("is-disabled") != -1) {
                    my_mul_copy_btn.className = "q-button copy-info q-button--primary q-button--small my-mul-copy";
                }
            } else {
                if (my_mul_copy_btn.className.indexOf("is-disabled") == -1) {
                    my_mul_copy_btn.className = "q-button copy-info q-button--primary q-button--small my-mul-copy is-disabled";
                }
            }
        }
    }

    // 检查是否有复制按钮了
    function checkHadCopy(child_nodes) {
        let flag = true;
        for (let n of child_nodes.childNodes) {
            if (n.className.indexOf("my-copy") != -1) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    function do_mul_copy(item) {
        if (item) {
            // 获取所有勾选的
            console.log("获取所有勾选的");
            var user_check_list = [...document.querySelectorAll('.cell > .q-checkbox.is-checked')].filter(elm => (!elm.closest('.is-hidden') && !elm.closest('.is-leaf')));
            var all_device_group_set = new Set();
            for (let i of user_check_list) {
                //console.log(i.parentNode.parentNode.parentNode);
                let raw_data = i.parentNode.parentNode.parentNode.cells;
                for (let j = 1; j < raw_data.length; j++) {
                    // 去告警设备分组
                    if (raw_data[j].className.indexOf("device_group") != -1) {
                        all_device_group_set.add(trim(raw_data[j].textContent));
                    }
                }
            }
            console.log("勾选里面，所有的客户名称：");
            console.log(all_device_group_set);
            // 初始化字典数组
            var device_group_dict = new Array();
            for (let k of all_device_group_set.values()) {
                //console.log(k);
                device_group_dict[k] = new Array();
            }
            // 遍历用户勾选的列表，按照客户名称push
            for (let i of user_check_list) {
                let raw_data = i.parentNode.parentNode.parentNode.cells;
                let tmp_dict = new Array();
                for (let j = 1; j < raw_data.length; j++) {
                    let name = raw_data[j].className.split(' ')[3].replace("biz-table-column-", "");
                    let content = trim(raw_data[j].textContent);
                    tmp_dict[name] = content;
                }
                device_group_dict[tmp_dict.device_group].push(tmp_dict);
            }
            // console.log("最后压入device_group_dict的数据：");
            // console.log(device_group_dict);
            // 遍历每个客户，分五类操作
            // 按照顺序操作（提取完记得删），提取成功事件、攻击ip是内网的、爆破事件、远控事件、攻击IP是外网的
            // https://www.cnblogs.com/lgnblog/p/13074156.html
            let final_text = "";
            // 遍历客户
            console.log("遍历如下：");
            for (let device_group of all_device_group_set.values()) {
                console.log(device_group);
                // 客户有很多事件
                // console.log(device_group_dict[device_group]);
                // 以下处理每个客户的告警
                // 先处理成功和失陷的，单独成事件，按照事件名称归并
                // 这个客户的告警名称作为key，value是一个数组，所有的告警名称一样的告警
                let success_alarm = new Array();
                let inner_attacker_alarm = new Array();
                let crack_alarm = new Array();
                let remote_control_alarm = new Array();
                let others_alarm = new Array();
                for (let alarm of device_group_dict[device_group].values()) {
                    console.log(alarm);
                    if(alarm.attack_type.indexOf("弱口令")!=-1 || alarm.threat_name.indexOf("发现明文口令传输")!=-1){
                        // 不写弱口令和明文口令传输
                        continue;
                    }
                    // 提取成功
                    if (alarm.attack_result.indexOf("成功") != -1 || alarm.attack_result.indexOf("失陷") != -1) {
                        if (!success_alarm[alarm.threat_name]) {
                            success_alarm[alarm.threat_name] = new Array();
                        }
                        success_alarm[alarm.threat_name].push(alarm);
                        continue;
                    }
                    // 提取攻击ip是内网的
                    if(isInnerIPFn(alarm.attacker)){
                        if(!inner_attacker_alarm[alarm.threat_name]){
                            inner_attacker_alarm[alarm.threat_name] = new Array();
                        }
                        inner_attacker_alarm[alarm.threat_name].push(alarm);
                        continue;
                    }
                    // 提取暴力破解
                    if(alarm.attack_type.indexOf("暴力猜解")!=-1){
                        if(!crack_alarm[alarm.threat_name]){
                            crack_alarm[alarm.threat_name] = new Array();
                        }
                        crack_alarm[alarm.threat_name].push(alarm);
                        continue;
                    }
                    // 提取远控
                    if(alarm.threat_name.indexOf("远程连接工具")!=-1){
                        if(!remote_control_alarm[alarm.threat_name]){
                            remote_control_alarm[alarm.threat_name] = new Array();
                        }
                        remote_control_alarm[alarm.threat_name].push(alarm);
                        continue;
                    }
                    // 剩下的
                    if(!others_alarm[alarm.threat_name]){
                        others_alarm[alarm.threat_name] = new Array();
                    }
                    others_alarm[alarm.threat_name].push(alarm);
                }
                if (isEmptyObject(success_alarm)) {
                    console.log("没有成功和失陷");
                } else {
                    console.log("这个客户的成功事件：");
                    console.log(success_alarm);

                    for (let alarms of Object.keys(success_alarm)) {
                        console.log("处理：" + alarms);
                        //console.log(success_alarm[alarms]);
                        let temp_text = "";
                        let tmp_last_access_time_array = new Array();
                        let tmp_last_access_time = "";
                        let tmp_threat_name = "";
                        let tmp_device_group = "";
                        let tmp_all_attacker_array = new Array();
                        let tmp_all_attacker = "";
                        let tmp_all_victim_array = new Array();
                        let tmp_all_victim = "";
                        let tmp_attack_count = 0;
                        let tmp_attack_result = "";
                        let tmp_advise = "";
                        let tmp_attack_type = "";
                        for (let alarm of success_alarm[alarms].values()) {
                            //console.log(alarm.victim);
                            tmp_last_access_time_array.push(alarm.last_access_time);
                            tmp_all_victim_array.push(alarm.victim);
                            if (alarm.attacker) {
                                tmp_all_attacker_array.push(alarm.attacker);

                            }
                            tmp_attack_count += Number(alarm.attack_count);
                            // 这个结果可能需要再处理一下
                            tmp_attack_result = alarm.attack_result;
                            tmp_threat_name = alarm.threat_name;
                            tmp_device_group = alarm.device_group;
                            tmp_attack_type = alarm.attack_type;
                        }
                        tmp_all_attacker = tmp_all_attacker_array.join("、")
                        tmp_all_victim = tmp_all_victim_array.join("、")
                        tmp_last_access_time = get_date_range(tmp_last_access_time_array);
                        if (tmp_attack_type.indexOf("暴力猜解") != -1) {
                            tmp_attack_result = "猜解成功";
                            tmp_advise = "确认是否为正常业务登录触发，若不是立即下线并上机排查";
                        }
                        temp_text += "事件名称：" + tmp_threat_name + "\n";
                        temp_text += "客户：" + tmp_device_group + "\n";
                        temp_text += "报告序号：" + "\n";
                        temp_text += "最近告警时间：" + tmp_last_access_time + "\n";
                        temp_text += "攻击IP：" + tmp_all_attacker + "\n";
                        temp_text += "受害IP：" + tmp_all_victim + "\n";

                        temp_text += "研判结论：" + tmp_attack_result + "\n";
                        tmp_advise = "防火墙封禁该攻击IP/排查是否为内部人员所为";
                        temp_text += "建议：" + tmp_advise + "\n\n";

                        console.log("加入剪切板：")
                        console.log(temp_text);
                        final_text += temp_text;
                    }
                }
                if(isEmptyObject(inner_attacker_alarm)){
                    console.log("没有攻击IP是内网的情况");
                }else{
                    console.log("这个客户的内网攻击事件：")
                    console.log(inner_attacker_alarm);
                                        for (let alarms of Object.keys(inner_attacker_alarm)) {
                        //console.log(success_alarm[alarms]);
                        let temp_text = "";
                        let tmp_last_access_time_array = new Array();
                        let tmp_last_access_time = "";
                        let tmp_threat_name = "";
                        let tmp_device_group = "";
                        let tmp_all_attacker_array = new Array();
                        let tmp_all_attacker = "";
                        let tmp_all_victim_array = new Array();
                        let tmp_all_victim = "";
                        let tmp_attack_count = 0;
                        let tmp_attack_result = "";
                        let tmp_advise = "";
                        let tmp_attack_type = "";
                        for (let alarm of inner_attacker_alarm[alarms].values()) {
                            //console.log(alarm.victim);
                            tmp_last_access_time_array.push(alarm.last_access_time);
                            tmp_all_victim_array.push(alarm.victim);
                            if (alarm.attacker) {
                                tmp_all_attacker_array.push(alarm.attacker);
                            }
                            tmp_attack_count += Number(alarm.attack_count);
                            // 这个结果可能需要再处理一下
                            tmp_attack_result = alarm.attack_result;
                            tmp_threat_name = alarm.threat_name;
                            tmp_device_group = alarm.device_group;
                            tmp_attack_type = alarm.attack_type;
                        }
                        tmp_all_attacker = tmp_all_attacker_array.join("、")
                        tmp_all_victim = tmp_all_victim_array.join("、")
                        tmp_last_access_time = get_date_range(tmp_last_access_time_array);

                        temp_text += "事件名称：" + tmp_threat_name + "\n";
                        temp_text += "客户：" + tmp_device_group + "\n";
                        temp_text += "报告序号：" + "\n";
                        temp_text += "最近告警时间：" + tmp_last_access_time + "\n";
                        temp_text += "攻击IP：" + tmp_all_attacker + "\n";
                        temp_text += "受害IP：" + tmp_all_victim + "\n";
                        if (tmp_attack_type.indexOf("暴力猜解") != -1) {
                            tmp_attack_result = "猜解失败";
                            tmp_advise = "确认是否为正常业务登录触发，若不是立即下线并上机排查";
                            temp_text += "攻击次数：" + tmp_attack_count + "\n";
                        }

                        temp_text += "研判结论：" + tmp_attack_result + "\n";
                        tmp_advise = "排除流量转发设备之后，核实是否为内部人员所为";
                        temp_text += "建议：" + tmp_advise + "\n\n";

                        console.log("加入剪切板：")
                        console.log(temp_text);
                        final_text += temp_text;
                    }
                }
                if(isEmptyObject(crack_alarm)){
                    console.log("排除成功和失陷之后，爆破的事件");
                }else{
                    console.log('这个客户的爆破事件（企图和失败）：');
                    console.log(crack_alarm);
                    for (let alarms of Object.keys(crack_alarm)) {
                        //console.log(success_alarm[alarms]);
                        let temp_text = "";
                        let tmp_last_access_time_array = new Array();
                        let tmp_last_access_time = "";
                        let tmp_threat_name = "";
                        let tmp_device_group = "";
                        let tmp_all_attacker_array = new Array();
                        let tmp_all_attacker = "";
                        let tmp_all_victim_array = new Array();
                        let tmp_all_victim = "";
                        let tmp_attack_count = 0;
                        let tmp_attack_result = "";
                        let tmp_advise = "";
                        let tmp_attack_type = "";
                        for (let alarm of crack_alarm[alarms].values()) {
                            //console.log(alarm.victim);
                            tmp_last_access_time_array.push(alarm.last_access_time);
                            tmp_all_victim_array.push(alarm.victim);
                            if (alarm.attacker) {
                                tmp_all_attacker_array.push(alarm.attacker);
                            }
                            tmp_attack_count += Number(alarm.attack_count);
                            // 这个结果可能需要再处理一下
                            tmp_attack_result = "猜解失败";
                            tmp_threat_name = alarm.threat_name;
                            tmp_device_group = alarm.device_group;
                            tmp_attack_type = alarm.attack_type;
                        }
                        tmp_all_attacker = tmp_all_attacker_array.join("、")
                        tmp_all_victim = tmp_all_victim_array.join("、")
                        tmp_last_access_time = get_date_range(tmp_last_access_time_array);

                        temp_text += "事件名称：" + tmp_threat_name + "\n";
                        temp_text += "客户：" + tmp_device_group + "\n";
                        temp_text += "报告序号：" + "\n";
                        temp_text += "最近告警时间：" + tmp_last_access_time + "\n";
                        temp_text += "攻击IP：" + tmp_all_attacker + "\n";
                        temp_text += "受害IP：" + tmp_all_victim + "\n";
                        temp_text += "攻击次数：" + tmp_attack_count + "\n";
                        temp_text += "研判结论：" + tmp_attack_result + "\n";
                        tmp_advise = "防火墙封禁该攻击IP";
                        temp_text += "建议：" + tmp_advise + "\n\n";

                        console.log("加入剪切板：")
                        console.log(temp_text);
                        final_text += temp_text;
                    }
                }
                if (isEmptyObject(others_alarm)) {
                    console.log("没有剩下的事件");
                } else {
                    console.log("这个客户的剩下的事件：");
                    console.log(others_alarm);

                    for (let alarms of Object.keys(others_alarm)) {
                        console.log("处理：" + alarms);
                        //console.log(others_alarm[alarms]);
                        let temp_text = "";
                        let tmp_last_access_time_array = new Array();
                        let tmp_last_access_time = "";
                        let tmp_threat_name = "";
                        let tmp_device_group = "";
                        let tmp_all_attacker_array = new Array();
                        let tmp_all_attacker = "";
                        let tmp_all_victim_array = new Array();
                        let tmp_all_victim = "";
                        let tmp_attack_count = 0;
                        let tmp_attack_result = "";
                        let tmp_advise = "";
                        let tmp_attack_type = "";
                        for (let alarm of others_alarm[alarms].values()) {
                            //console.log(alarm.victim);
                            tmp_last_access_time_array.push(alarm.last_access_time);
                            tmp_all_victim_array.push(alarm.victim);
                            if (alarm.attacker) {
                                tmp_all_attacker_array.push(alarm.attacker);

                            }
                            tmp_attack_count += Number(alarm.attack_count);
                            // 这个结果可能需要再处理一下
                            tmp_attack_result = "攻击失败";
                            tmp_threat_name = alarm.threat_name;
                            tmp_device_group = alarm.device_group;
                            tmp_attack_type = alarm.attack_type;
                        }
                        tmp_all_attacker = tmp_all_attacker_array.join("、")
                        tmp_all_victim = tmp_all_victim_array.join("、")
                        tmp_last_access_time = get_date_range(tmp_last_access_time_array);
                        temp_text += "事件名称：" + tmp_threat_name + "\n";
                        temp_text += "客户：" + tmp_device_group + "\n";
                        temp_text += "报告序号：" + "\n";
                        temp_text += "最近告警时间：" + tmp_last_access_time + "\n";
                        temp_text += "攻击IP：" + tmp_all_attacker + "\n";
                        temp_text += "受害IP：" + tmp_all_victim + "\n";

                        temp_text += "研判结论：" + tmp_attack_result + "\n";
                        tmp_advise = "防火墙封禁该攻击IP";
                        temp_text += "建议：" + tmp_advise + "\n\n";

                        console.log("加入剪切板：")
                        console.log(temp_text);
                        final_text += temp_text;
                    }
                }
            }
            // 设置剪切板内容
            GM_setClipboard(final_text);
            Toast("通告已复制！", 1000);
        } else {
            console.log("没有值");
        }
    }

    function do_copy(item) {
        console.log("点击了复制");
        if (item) {
            console.log("有值")
            // 获取到数据那一行，接下来用.cells访问即可
            // console.log(item.parentNode.parentNode.parentNode);
            var check_list = item.parentNode.parentNode.parentNode.cells
            var dic = new Array(); //定义一个字典
            for (let i = 1; i < check_list.length; i++) {
                let name = check_list[i].className.split(' ')[3].replace("biz-table-column-", "");
                let content = check_list[i].textContent;
                dic[name] = content;
                console.log(name);
                console.log(content);
            }
            let final_text = "";
            let hadAttacker = dic.attacker;
            if (hadAttacker) {
                final_text += "事件名称：" + dic.threat_name + "\n";
                final_text += "客户：" + dic.device_group + "\n";
                final_text += "报告序号：\n";
                //final_text += "首次告警时间：" + text_array[3] + "\n";
                final_text += "最近告警时间：" + dic.last_access_time + "\n";
                final_text += "攻击者ip：" + dic.attacker + "\n";
                final_text += "受害者：" + dic.victim + "\n";
                if (dic.threat_name.indexOf("暴力猜解") != -1) {
                    final_text += "攻击次数：" + dic.attack_count + "\n";
                    let attack_result = dic.attack_result;
                    if (attack_result.indexOf("企图") != -1 || attack_result.indexOf("失败") != -1) {
                        attack_result = "猜解失败";
                    } else {
                        attack_result = "猜解成功";
                    }
                    final_text += "研判结论：" + attack_result + "\n";
                } else {
                    let attack_result = dic.attack_result;
                    if (attack_result.indexOf("企图") != -1 || attack_result.indexOf("失败") != -1) {
                        attack_result = "攻击失败";
                    } else {
                        attack_result = "攻击成功";
                    }
                    final_text += "研判结论：" + attack_result + "\n";
                }
                final_text += "建议：防火墙封禁该攻击IP\n";
            } else {
                final_text += "事件名称：" + dic.threat_name + "\n";
                final_text += "客户：" + dic.device_group + "\n";
                final_text += "报告序号：\n";
                final_text += "最近告警时间：" + dic.last_access_time + "\n";
                final_text += "受害者：" + dic.victim + "\n";
                final_text += "建议：排查是否为内部人员所为\n";
            }
            // 设置剪切板内容
            GM_setClipboard(final_text);
            Toast("通告已复制！", 1000);
        } else {
            console.log("没有值")
        }
    }

    function Toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(function() {
                        document.body.removeChild(m)
                    },
                    d * 1000);
            },
            duration);
    }
    document.addEventListener('copy',
        function(e) {
            let clipboardData = e.clipboardData || window.clipboardData;
            // 如果 未复制或者未剪切，直接 return
            if (!clipboardData) return;
            let text = window.getSelection().toString();
            if (text) {
                e.preventDefault();
                text = trim(text);
                clipboardData.setData('text/plain', text);
                Toast("内容已经去格式化！", 1000);
            }
        });
})();
