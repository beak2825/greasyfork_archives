// ==UserScript==
// @name         Akuvox Temperature Check
// @namespace    http://www.akuvox.com/
// @version      3.2
// @description  每日部门检查
// @author       LinKy
// @match        http://192.168.12.160/fcgi/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/410246/Akuvox%20Temperature%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/410246/Akuvox%20Temperature%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function Dofilter(filter_name) {
        if ($('#force_today').prop('checked') == true) {
            Date.prototype.Format = function (fmt) {
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }

            var today = (new Date()).Format("yyyy-MM-dd");
            if ($('#cDoorLogName').val() == filter_name
                && $('#cDoorLogStartTime').val() == today
                && $('#cDoorLogEndTime').val() == today) {
                return -1; // already filter
            }

            $('#cDoorLogStartTime').val(today);
            $('#cDoorLogEndTime').val(today);
            $('#cDoorLogName').val(filter_name);
            $('#BtnFitter').click();
            return 0;
        }

        $('#cDoorLogName').val(filter_name);
        $('#BtnFitter').click();
        return 0;
    }

    function DoPage(cur_page) {
        $('#cCurPage').val(cur_page);
        $('#tGoToPageBtn').click();
    }

    function PrepareData(filter_name) {
        // 公司打卡名单
        var members_data;
        switch(filter_name) {
            case 'scenter':
                members_data = [
                    {
                        "name": "黄慜哲",
                        "alias": "scenter-黄慜哲",
                        "checked": false,
                    },
                    {
                        "name": "林昱",
                        "alias": "scenter-林昱",
                        "checked": false,
                    },
                    {
                        "name": "唐鹏遥",
                        "alias": "scenter-唐鹏遥",
                        "checked": false,
                    },
                    {
                        "name": "兰泽华",
                        "alias": "scenter-兰泽华",
                        "checked": false,
                    },
                    {
                        "name": "肖洪河",
                        "alias": "scenter-肖洪河",
                        "checked": false,
                    },
                    {
                        "name": "郑名溪",
                        "alias": "scenter-郑名溪",
                        "checked": false,
                    },
                    {
                        "name": "陈少伟",
                        "alias": "scenter-陈少伟",
                        "checked": false,
                    },
                    {
                        "name": "曾婉萍",
                        "alias": "scenter-曾婉萍",
                        "checked": false,
                    },
                    {
                        "name": "钟伟宏",
                        "alias": "scenter-钟伟宏",
                        "checked": false,
                    },
                ];
                break;
			case 'smart':
                members_data = [
                    {
                        "name": "曾磊",
                        "alias": "smart-曾磊",
                        "checked": false,
                    },
                    {
                        "name": "刘紫馨",
                        "alias": "smart-刘紫馨",
                        "checked": false,
                    },
                    {
                        "name": "胡传淑敏",
                        "alias": "smart-胡传淑敏",
                        "checked": false,
                    },
                    {
                        "name": "赖胜昌",
                        "alias": "smart-赖胜昌",
                        "checked": false,
                    },
                    {
                        "name": "乐忠豪",
                        "alias": "smart-乐忠豪",
                        "checked": false,
                    },
                    {
                        "name": "刘鲤扬",
                        "alias": "smart-刘鲤扬",
                        "checked": false,
                    },
                    {
                        "name": "王伟建",
                        "alias": "smart-王伟建",
                        "checked": false,
                    },
                    {
                        "name": "杨伊莎",
                        "alias": "smart-杨伊莎",
                        "checked": false,
                    },
                    {
                        "name": "叶林凤",
                        "alias": "smart-叶林凤",
                        "checked": false,
                    },
                    {
                        "name": "陈敏杰",
                        "alias": "smart-陈敏杰",
                        "checked": false,
                    },
                    {
                        "name": "冯涛",
                        "alias": "smart-冯涛",
                        "checked": false,
                    },
                    /*{
                        "name": "江昊",
                        "alias": "smart-江昊",
                        "checked": false,
                    },*/
                    {
                        "name": "游炳坤",
                        "alias": "smart-游炳坤",
                        "checked": false,
                    },
                ];
                break;
			case 'system':
                members_data = [
                    {
                        "name": "班萌萌",
                        "alias": "system-班萌萌",
                        "checked": false,
                    },
                    {
                        "name": "陈蔚蔚",
                        "alias": "system-陈蔚蔚",
                        "checked": false,
                    },
                    {
                        "name": "陈毅聪",
                        "alias": "system-陈毅聪",
                        "checked": false,
                    },
                    {
                        "name": "陈镇兴",
                        "alias": "system-陈镇兴",
                        "checked": false,
                    },
                    {
                        "name": "陈志伟",
                        "alias": "system-陈志伟",
                        "checked": false,
                    },
                    {
                        "name": "李建军",
                        "alias": "system-李建军",
                        "checked": false,
                    },
                    {
                        "name": "康小龙",
                        "alias": "system-康小龙",
                        "checked": false,
                    },
                    {
                        "name": "刘小芬",
                        "alias": "system-刘小芬",
                        "checked": false,
                    },
                    {
                        "name": "许志明",
                        "alias": "system-许志明",
                        "checked": false,
                    },
                    {
                        "name": "钟兴顺",
                        "alias": "system-钟兴顺",
                        "checked": false,
                    },
                    {
                        "name": "曾辉",
                        "alias": "system-曾辉",
                        "checked": false,
                    },
                    {
                        "name": "林丽",
                        "alias": "system-林丽",
                        "checked": false,
                    },
                    {
                        "name": "康毓进",
                        "alias": "system-康毓进",
                        "checked": false,
                    },
                ];
                break;
			case 'emb':
                members_data = [
                    {
                        "name": "蔡在添",
                        "alias": "emb-蔡在添",
                        "checked": false,
                    },
                    {
                        "name": "蔡钊锋",
                        "alias": "emb-蔡钊锋",
                        "checked": false,
                    },
                    {
                        "name": "陈芳航",
                        "alias": "emb-陈芳航",
                        "checked": false,
                    },
                    {
                        "name": "黄耀鹏",
                        "alias": "emb-黄耀鹏",
                        "checked": false,
                    },
                    {
                        "name": "黄艺山",
                        "alias": "emb-黄艺山",
                        "checked": false,
                    },
                    {
                        "name": "黄长发",
                        "alias": "emb-黄长发",
                        "checked": false,
                    },
                    {
                        "name": "黄志超",
                        "alias": "emb-黄志超",
                        "checked": false,
                    },
                    {
                        "name": "王居辉",
                        "alias": "emb-王居辉",
                        "checked": false,
                    },
                    {
                        "name": "巫有福",
                        "alias": "emb-巫有福",
                        "checked": false,
                    },
                    {
                        "name": "袁观福",
                        "alias": "emb-袁观福",
                        "checked": false,
                    },
                    {
                        "name": "张明发",
                        "alias": "emb-张明发",
                        "checked": false,
                    },
                    {
                        "name": "郑国忠",
                        "alias": "emb-郑国忠",
                        "checked": false,
                    },
                    {
                        "name": "高鑫平",
                        "alias": "emb-高鑫平",
                        "checked": false,
                    },
                ];
                break;
			/*case 'r2x':
                members_data = [
                    {
                        "name": "蔡如意",
                        "alias": "R2X-蔡如意",
                        "checked": false,
                    },
                    {
                        "name": "陈靖",
                        "alias": "R2X-陈靖",
                        "checked": false,
                    },
                    {
                        "name": "陈子涵",
                        "alias": "R2X-陈子涵",
                        "checked": false,
                    },
                    {
                        "name": "蔡如意",
                        "alias": "R2X-蔡如意",
                        "checked": false,
                    },
                    {
                        "name": "池政涛",
                        "alias": "R2X-池政涛",
                        "checked": false,
                    },
                    {
                        "name": "黄恒伟",
                        "alias": "R2X-黄恒伟",
                        "checked": false,
                    },
                    {
                        "name": "李宪章",
                        "alias": "R2X-李宪章",
                        "checked": false,
                    },
                    {
                        "name": "林贵增",
                        "alias": "R2X-林贵增",
                        "checked": false,
                    },
                    {
                        "name": "林明标",
                        "alias": "R2X-林明标",
                        "checked": false,
                    },
                    {
                        "name": "林培兴",
                        "alias": "R2X-林培兴",
                        "checked": false,
                    },
                    {
                        "name": "林万芳",
                        "alias": "R2X-林万芳",
                        "checked": false,
                    },
                    {
                        "name": "刘文超",
                        "alias": "R2X-刘文超",
                        "checked": false,
                    },
                    {
                        "name": "刘文雄",
                        "alias": "R2X-刘文雄",
                        "checked": false,
                    },
                    {
                        "name": "卢达龙",
                        "alias": "R2X-卢达龙",
                        "checked": false,
                    },
                    {
                        "name": "邱伟宸",
                        "alias": "R2X-邱伟宸",
                        "checked": false,
                    },
                    {
                        "name": "叶伟伟",
                        "alias": "R2X-叶伟伟",
                        "checked": false,
                    },
                    {
                        "name": "卓德榆",
                        "alias": "R2X-卓德榆",
                        "checked": false,
                    },
                ];
                break;*/
			case 'hardware':
                members_data = [
                    {
                        "name": "曹凤朋",
                        "alias": "hardware-曹凤朋",
                        "checked": false,
                    },
                    {
                        "name": "陈名强",
                        "alias": "hardware-陈名强",
                        "checked": false,
                    },
                    {
                        "name": "陈贤宇",
                        "alias": "hardware-陈贤宇",
                        "checked": false,
                    },
                    /*{
                        "name": "丁依俤",
                        "alias": "hardware-丁依俤",
                        "checked": false,
                    },*/
                    {
                        "name": "黄汝鹏",
                        "alias": "hardware-黄汝鹏",
                        "checked": false,
                    },
                    {
                        "name": "黄晓艳",
                        "alias": "hardware-黄晓艳",
                        "checked": false,
                    },
                    /*{
                        "name": "黄周钊",
                        "alias": "hardware-黄周钊",
                        "checked": false,
                    },*/
                    {
                        "name": "赖斌",
                        "alias": "hardware-赖斌",
                        "checked": false,
                    },
                    /*{
                        "name": "李珊珊",
                        "alias": "hardware-李珊珊",
                        "checked": false,
                    },*/
                    {
                        "name": "林颖泉",
                        "alias": "hardware-林颖泉",
                        "checked": false,
                    },
                    {
                        "name": "徐陵",
                        "alias": "hardware-徐陵",
                        "checked": false,
                    },
                    {
                        "name": "尹小林",
                        "alias": "hardware-尹小林",
                        "checked": false,
                    },
                    /*{
                        "name": "唐力坚",
                        "alias": "hardware-唐力坚",
                        "checked": false,
                    },
                    {
                        "name": "林祺",
                        "alias": "hardware-林祺",
                        "checked": false,
                    },
                    {
                        "name": "吴伟平",
                        "alias": "hardware-吴伟平",
                        "checked": false,
                    },
                    {
                        "name": "于文林",
                        "alias": "hardware-于文林",
                        "checked": false,
                    },*/
                ];
                break;
			case 'sqa':
                members_data = [
                    {
                        "name": "曾茂荣",
                        "alias": "sqa-曾茂荣",
                        "checked": false,
                    },
                    {
                        "name": "陈惠雪",
                        "alias": "sqa-陈惠雪",
                        "checked": false,
                    },
                    {
                        "name": "陈欣",
                        "alias": "sqa-陈欣",
                        "checked": false,
                    },
                    {
                        "name": "陈毅勇",
                        "alias": "sqa-陈毅勇",
                        "checked": false,
                    },
                    {
                        "name": "陈英伟",
                        "alias": "sqa-陈英伟",
                        "checked": false,
                    },
                    {
                        "name": "陈莹",
                        "alias": "sqa-陈莹",
                        "checked": false,
                    },
                    /*{
                        "name": "邓慧敏",
                        "alias": "sqa-邓慧敏",
                        "checked": false,
                    },*/
                    {
                        "name": "苏婉琴",
                        "alias": "sqa-苏婉琴",
                        "checked": false,
                    },
                    {
                        "name": "郭惠珍",
                        "alias": "sqa-郭惠珍",
                        "checked": false,
                    },
                    {
                        "name": "黄振森",
                        "alias": "sqa-黄振森",
                        "checked": false,
                    },
                    {
                        "name": "李丹敏",
                        "alias": "sqa-李丹敏",
                        "checked": false,
                    },
                    {
                        "name": "林燕婷",
                        "alias": "sqa-林燕婷",
                        "checked": false,
                    },
                    /*{
                        "name": "罗颖芳",
                        "alias": "sqa-罗颖芳",
                        "checked": false,
                    },
                    {
                        "name": "潘智芳",
                        "alias": "sqa-潘智芳",
                        "checked": false,
                    },*/
                    {
                        "name": "施智海",
                        "alias": "sqa-施智海",
                        "checked": false,
                    },
                    {
                        "name": "吴玉华",
                        "alias": "sqa-吴玉华",
                        "checked": false,
                    },
                    {
                        "name": "黄婉容",
                        "alias": "sqa-黄婉容",
                        "checked": false,
                    },
                    {
                        "name": "陈雅珠",
                        "alias": "sqa-陈雅珠",
                        "checked": false,
                    },
                    /*{
                        "name": "钟燕如",
                        "alias": "sqa-钟燕如",
                        "checked": false,
                    },*/
                ];
                break;
			case 'pmteam':
                members_data = [
                    /*{
                        "name": "卢智韬",
                        "alias": "pmteam-卢智韬",
                        "checked": false,
                    },
                    {
                        "name": "施升",
                        "alias": "pmteam-施升",
                        "checked": false,
                    },
                    {
                        "name": "吴国赟",
                        "alias": "pmteam-吴国赟",
                        "checked": false,
                    },
                    {
                        "name": "张亚雯",
                        "alias": "pmteam-张亚雯",
                        "checked": false,
                    },*/
                    {
                        "name": "施海涛",
                        "alias": "pmteam-施海涛",
                        "checked": false,
                    },
                    {
                        "name": "方燕滨",
                        "alias": "pmteam-方燕滨",
                        "checked": false,
                    },
                    {
                        "name": "赖耿顺",
                        "alias": "pmteam-赖耿顺",
                        "checked": false,
                    },
                    {
                        "name": "赖俊霖",
                        "alias": "pmteam-赖俊霖",
                        "checked": false,
                    },
                    {
                        "name": "林琦玉",
                        "alias": "pmteam-林琦玉",
                        "checked": false,
                    },
                    {
                        "name": "张晋华",
                        "alias": "pmteam-张晋华",
                        "checked": false,
                    },
                    {
                        "name": "郑浪双",
                        "alias": "pmteam-郑浪双",
                        "checked": false,
                    },
                ];
                break;
			/*case 'sales':
                members_data = [
                    {
                        "name": "黄丽芳",
                        "alias": "sales-黄丽芳",
                        "checked": false,
                    },
                    {
                        "name": "陈丹",
                        "alias": "sales-陈丹",
                        "checked": false,
                    },
                    {
                        "name": "陈泽宇",
                        "alias": "sales-陈泽宇",
                        "checked": false,
                    },
                    {
                        "name": "陈真",
                        "alias": "sales-陈真",
                        "checked": false,
                    },
                    {
                        "name": "范玉芳",
                        "alias": "sales-范玉芳",
                        "checked": false,
                    },
                    {
                        "name": "方海娟",
                        "alias": "sales-方海娟",
                        "checked": false,
                    },
                    {
                        "name": "卢俊",
                        "alias": "sales-卢俊",
                        "checked": false,
                    },
                    {
                        "name": "潘龙波",
                        "alias": "sales-潘龙波",
                        "checked": false,
                    },
                    {
                        "name": "阮丽雯",
                        "alias": "sales-阮丽雯",
                        "checked": false,
                    },
                    {
                        "name": "王健",
                        "alias": "sales-王健",
                        "checked": false,
                    },
                    {
                        "name": "吴晓健",
                        "alias": "sales-吴晓健",
                        "checked": false,
                    },
                    {
                        "name": "杨波",
                        "alias": "sales-杨波",
                        "checked": false,
                    },
                    {
                        "name": "郑为尊",
                        "alias": "sales-郑为尊",
                        "checked": false,
                    },
                ];
                break;*/
			case 'emea':
                members_data = [
                    {
                        "name": "陈美琴",
                        "alias": "EMEA-陈美琴",
                        "checked": false,
                    },
                    {
                        "name": "黄培炜",
                        "alias": "EMEA-黄培炜",
                        "checked": false,
                    },
                    /*{
                        "name": "孔波",
                        "alias": "EMEA-孔波",
                        "checked": false,
                    },*/
                    {
                        "name": "林珊",
                        "alias": "EMEA-林珊",
                        "checked": false,
                    },
                    {
                        "name": "修晨兴",
                        "alias": "EMEA-修晨兴",
                        "checked": false,
                    },
                    {
                        "name": "徐千娅",
                        "alias": "EMEA-徐千娅",
                        "checked": false,
                    },
                    {
                        "name": "张晓敏",
                        "alias": "EMEA-张晓敏",
                        "checked": false,
                    },
                ];
                break;
            case 'techsupport':
                members_data = [
                    {
                        "name": "Jay",
                        "alias": "techsupport-Jay",
                        "checked": false,
                    },
                    /*{
                        "name": "Aaron",
                        "alias": "techsupport-Aaron",
                        "checked": false,
                    },
                    {
                        "name": "Clover",
                        "alias": "techsupport-Clover",
                        "checked": false,
                    },
                    {
                        "name": "Neil",
                        "alias": "techsupport-Neil",
                        "checked": false,
                    },
                    {
                        "name": "Runx",
                        "alias": "techsupport-Runx",
                        "checked": false,
                    },
                    {
                        "name": "Ryan",
                        "alias": "techsupport-Ryan",
                        "checked": false,
                    },
                    {
                        "name": "Shirley",
                        "alias": "techsupport-Shirley",
                        "checked": false,
                    },
                    {
                        "name": "William",
                        "alias": "techsupport-William",
                        "checked": false,
                    },*/
                ];
                break;
            case 'marketing':
                members_data = [
                    {
                        "name": "蔡真真",
                        "alias": "Marketing-蔡真真",
                        "checked": false,
                    },
                    {
                        "name": "黄瑞华",
                        "alias": "Marketing-黄瑞华",
                        "checked": false,
                    },
                    {
                        "name": "康远航",
                        "alias": "Marketing-康远航",
                        "checked": false,
                    },
                    {
                        "name": "林逸谦",
                        "alias": "Marketing-林逸谦",
                        "checked": false,
                    },
                    {
                        "name": "刘娟",
                        "alias": "Marketing-刘娟",
                        "checked": false,
                    },
                    {
                        "name": "杨培东",
                        "alias": "Marketing-杨培东",
                        "checked": false,
                    },
                ];
                break;
            case 'quality':
                members_data = [
                    /*{
                        "name": "纪翼",
                        "alias": "qa-纪翼",
                        "checked": false,
                    },
                    {
                        "name": "修德珍",
                        "alias": "qa-修德珍",
                        "checked": false,
                    },*/
                    {
                        "name": "张铭",
                        "alias": "quality-张铭",
                        "checked": false,
                    },
                    /*{
                        "name": "周军",
                        "alias": "qa-周军",
                        "checked": false,
                    },*/
                ];
                break;
            default:
                ClearAll();
                return
        }

        var members_data_str = JSON.stringify(members_data);
        $.cookie('members_data', members_data_str);
    }

    function CheckData() {
        var members_data_str = $.cookie('members_data');
        var members_data = JSON.parse(members_data_str);
        var temperature_logs = $('label[id^=cKeyName]');
        $.each(temperature_logs, function(i, log){
            $.each(members_data, function(i, member){
                if ($(log).html() == member.alias) {
                    member.checked = true;
                }
            });
        });

        members_data_str = JSON.stringify(members_data);
        $.cookie('members_data', members_data_str);
    }

    function ClearAll() {
        $.cookie('members_data', '');
        $.cookie('filter_name', '');
        $.cookie('cur_page', '');
    }

    function Report() {
        var members_data_str = $.cookie('members_data');
        var members_data = JSON.parse(members_data_str);
        var alert_str = "";
        $.each(members_data, function(i, member){
            if (!member.checked) {
                alert_str += member.name + "未测温!\n";
            }
        })

        if (alert_str == '') {
            alert_str = "全员打卡成功!";
        }
        alert(alert_str);
    }

    function CheckDepartment() {
        var filter_name = $.cookie('filter_name');
        var cur_page = $.cookie('cur_page');
        switch (filter_name) {
			case 'scenter':
			case 'smart':
			case 'system':
			case 'emb':
			case 'r2x':
			case 'hardware':
			case 'sqa':
			case 'pmteam':
			case 'sales':
			case 'emea':
            case 'techsupport':
            case 'marketing':
            case 'quality': {
                if (cur_page == '') {
                    // 首次选择, 设置从首页开始检查并准备数据
                    $.cookie('cur_page', 1)
                    PrepareData(filter_name);
                    if (-1 == Dofilter(filter_name)) {
                        // 进入下一个状态机
                        CheckDepartment();
                    }
                } else if ($('#cCurPage').val() == cur_page) {
                    // 页码相等, 检查数据
                    CheckData();
                    if ($('#Next').prop("disabled")) {
                        Report();
                        ClearAll();
                    } else {
                        cur_page = String(parseInt(cur_page) + 1);
                        $.cookie('cur_page', cur_page)
                        DoPage(cur_page);
                    }
                } else {
                    // 页码不对, 此时先切换页面
                    DoPage(cur_page);
                }
            }
                break;
            default:
                ClearAll();
                break;
        }
    }

    $(document).ready(function(){
        if($('#tableDoorLog').length > 0) {
            $('div.table_style').append("<div class='Second_div'><label>自动化统计</label>" +
                                          "<select id='check_temp' class='Nice_Btn'>" +
                                          "<option value='0'>请选择</option>" +
                                          "<option value='marketing'>市场营销部</option>" +
                                          "<option value='scenter'>研发中心</option>" +
                                          "<option value='smart'>智能软件部</option>" +
										  "<option value='system'>系统软件部</option>" +
										  "<option value='emb'>嵌入式软件部</option>" +
                                          //"<option value='r2x'>福州软件部</option>" +
										  "<option value='pmteam'>产品方案部</option>" +
                                          "<option value='sqa'>研发质量部</option>" +
										  //"<option value='sales'>销售中心</option>" +
                                          "<option value='emea'>EMEA销售部</option>" +
                                          "<option value='techsupport'>技术部</option>" +
										  "<option value='quality'>品质保证部</option>" +
                                          "<option value='hardware'>硬件研发部</option>" +
                                          "</select></div>" +
										  "<div class='Second_div_whole'><label style='margin-left: 0px;'>仅查看本日</label>" +
                                          "<input type='checkbox' id='force_today' name='force_today'/>" +
                                          "<label class='check_box_left' style='margin-left: 130px;' for='force_today'>&nbsp;</label></div>")
            $('#check_temp').change(function() {
                var val = $(this).val();
                if(val != 0) {
                    $.cookie('filter_name', val);
                } else {
                    $.cookie('filter_name', '');
                }
                CheckDepartment();
            })

            CheckDepartment();
        }
    });

})();
