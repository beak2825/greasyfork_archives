// ==UserScript==
// @license MIT
// @name         Detail_Copy
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  用于红圈CRM快速复制
// @author       Bruce
// @match        https://cloud.hecom.cn/v1/list
// @match        https://cloud.hecom.cn/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hecom.cn
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/515546/Detail_Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/515546/Detail_Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var myVar
	myVar = setInterval(add_button, 1000);
	function add_button(){
		//找到要添加节点的父节点(head-title)
		var detail_wrap = document.getElementsByClassName("detail-wrap")[0];
		if (detail_wrap){
			var head_title = document.getElementsByClassName("header-ope section-not-print detail-header")[0];
			//添加一个按钮
			var exist_Copy_btn = document.getElementById("Copy_btn");
			if (!exist_Copy_btn){
				var Copy_btn = document.createElement("button");
				Copy_btn.className = "ant-btn ant-btn-default header-close-btn";
				Copy_btn.innerHTML = "复 制";
				Copy_btn.id = "Copy_btn";
				//添加onclick事件,和事件执行的函数
				Copy_btn.onclick = function Copy_fun(){
                    var expand_btn = document.getElementsByClassName("ant-typography-expand")[0];
                    if (expand_btn){expand_btn.click();}
					var header_name = document.getElementsByClassName("header-name")[0].innerText;
                    var mystr = "",str1 = "",str2 = "",str3 = "",str4 = "",str5 = "",str6 = "";
                    var str_arr = [];
                    var flnal_arr = [];
                    var str3_col = 0,str4_col = 0,str5_col = 0,str6_col = 0,str7_col = 0;
//项目信息
					if (header_name == "项目信息") {
                        let detail_data = document.getElementsByClassName("groupWrap  middle")[0];
                        let rows = detail_data.getElementsByClassName("ant-col ant-col-12 detail-item-wrap");
                        if(rows.length==0){rows = detail_data.getElementsByClassName("ant-col ant-col-8 detail-item-wrap");}
                        rows.forEach(function(row){
                            if (row.getElementsByClassName("long-title")[0]) {
                                if (row.getElementsByClassName("long-title")[0].innerText == "项目名称"){
                                    str1 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                    //如果最后2个字是收起则去除
                                    if (str1.substring(str1.length-2)=="收起"){str1=str1.substring(0,str1.length-2);}
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "所属区局"){
                                    str2 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "项目建设类型"){
                                    str3 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "经营类型"){
                                    str4 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "归属年份"){
                                    str5 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText.substring(0,4);
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "所属部门"){
                                    str6 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                            }
                        });
                        mystr = str1 + "\t" + str2 +"\t"+ str3 +"\t"+ str4 +"\t"+ str5 +"\t"+ str6;
                        //alert(mystr);
                        navigator.clipboard.writeText(mystr); // 参数是要写入的文本
                    }
//保证金申请
					if (header_name == "保证金申请") {
                        for( let i = 0; i <= 1 ; i++ ){
                            let detail_data = document.getElementsByClassName("groupWrap  middle")[i];
                            let rows = detail_data.getElementsByClassName("ant-col ant-col-12 detail-item-wrap");
                            rows.forEach(function(row){
                                if (row.getElementsByClassName("long-title")[0]) {
                                    if (row.getElementsByClassName("long-title")[0].innerText == "付款内容"){
                                        str1 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                    };
                                    if (row.getElementsByClassName("long-title")[0].innerText == "项目名称"){
                                        str4 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                        if (str4.substring(str4.length-2)=="收起"){str4=str4.substring(0,str4.length-2);}
                                    };
                                    if (row.getElementsByClassName("long-title")[0].innerText == "投标项目名称"){
                                        str5 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                        if (str5.substring(str5.length-2)=="收起"){str5=str5.substring(0,str5.length-2);}
                                    };
                                    if (row.getElementsByClassName("long-title")[0].innerText == "保证金金额(元)"){
                                        str3 = Number(row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText.replace(/,/g, ''));
                                    };
                                    if (row.getElementsByClassName("long-title")[0].innerText == "保证金收款单位"){
                                        str2 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                    };
                                }
                            });
                            if (str4 =="--"){
                                mystr = str1 + "\t" + str2 +"\t"+ str3 +"\t"+ str5;
                            }else
                            {
                                mystr = str1 + "\t" + str2 +"\t"+ str3 +"\t"+ str4;
                            }
                            //alert(mystr);
                            navigator.clipboard.writeText(mystr); // 参数是要写入的文本
                        }
                    }
//材料付款
                    if (header_name == "材料付款") {
                        let detail_data = document.getElementsByClassName("groupWrap  middle")[0];
                        let rows = detail_data.getElementsByClassName("ant-col ant-col-12 detail-item-wrap");
                        if(rows.length==0){rows = detail_data.getElementsByClassName("ant-col ant-col-8 detail-item-wrap");}
                        rows.forEach(function(row){
                            if (row.getElementsByClassName("long-title")[0]) {
                                if (row.getElementsByClassName("long-title")[0].innerText == "供应商"){
                                    str2 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "本次申请付款金额(元)"){
                                    str1 = Number(row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText.replace(/,/g, ''));
                                };
                            }
                        });
                        //子表单
                        detail_data = document.getElementsByClassName("layout-relative comp-wrap common-wrap")[0];
                        let cols_header = detail_data.getElementsByClassName("ant-table-header")[0];
                        rows = cols_header.getElementsByTagName("th");

                        rows.forEach(function(row,index){
                            if (row.innerText == "项目名称"){str3_col = index};
                            if (row.innerText == "申请付款金额"){str4_col = index};
                            if (row.innerText == "所属年份"){str5_col = index};
                            if (row.innerText == "采购类型"){str6_col = index};
                        });

                        rows = detail_data.getElementsByClassName("ant-table-tbody")[0].getElementsByClassName("ant-table-row ant-table-row-level-0");
                        let k=0;
                        rows.forEach(function(row){
                            str_arr[k] = new Array;
                            if (row.getElementsByTagName("td")[str3_col].innerText =="--"){
                                str_arr[k]["project_name"] = row.getElementsByTagName("td")[str6_col].innerText;
                            }else{
                                str_arr[k]["project_name"] = row.getElementsByTagName("td")[str3_col].innerText;
                            };
                            str_arr[k]["money"] = Number(row.getElementsByTagName("td")[str4_col].innerText.replace(/,/g, ''));
                            str_arr[k]["year"] = row.getElementsByTagName("td")[str5_col].innerText;
                            //alert(str_arr[k][1]);
                            k = k+1;
                        });
                        //根据项目合计金额
                        var match;
                        var tmp_arr = new Array;
                        str_arr.forEach(function(str_row){
                            match = false;
                            for (let i = 0 ;i < tmp_arr.length; i++){
                                if (str_row["project_name"] == tmp_arr[i]["project_name"]){
                                    tmp_arr[i]["money"] += str_row["money"];
                                    match = true;
                                    //alert("match");
                                    break;
                                }
                            };
                            if(match == false){
                                let l = tmp_arr.length;
                                tmp_arr[l] = new Array;
                                tmp_arr[l]["project_name"] = str_row["project_name"];
                                tmp_arr[l]["money"] = str_row["money"];
                                if (str_row["year"] == "年"){
                                    tmp_arr[l]["year"] = "2024年";
                                }else{
                                    tmp_arr[l]["year"] = str_row["year"];
                                }
                            };
                        });
                        console.log(tmp_arr);
                        /*//根据年度合并描述
                        var flnal_arr = new Array;
                        tmp_arr.forEach(function(str_row){
                            match = false;
                            for (let i = 0 ;i < flnal_arr.length; i++){
                                if (str_row["year"] == flnal_arr[i]["year"]){
                                    flnal_arr[i]["project_name_money"] = flnal_arr[i]["project_name_money"] + ";" + str_row["project_name"] + " " + str_row["money"];
                                    flnal_arr[i]["money"] += str_row["money"];
                                    match = true;
                                    //alert("match");
                                    break;
                                }
                            };
                            if(match == false){
                                let l = flnal_arr.length;
                                flnal_arr[l] = new Array;
                                flnal_arr[l]["project_name_money"] = str_row["project_name"] + " " + str_row["money"];
                                flnal_arr[l]["money"] = str_row["money"];
                                flnal_arr[l]["year"] = str_row["year"];
                            };
                        });
                        */
                        //拼合剪贴板文本
                        let Sum_money = 0
                        tmp_arr.forEach(function(str_row){
                            //mystr += str_row["money"] + "\t" + str2 +"\t"+ str_row["project_name_money"] +"\t"+ str_row["year"] + "\n";
                            mystr += str_row["money"] + "\t" + str2 +"\t"+ str_row["project_name"] + "\n";
                            Sum_money += str_row["money"] ;
                        });
                        console.log(tmp_arr);
                        //检查金额合计，如果偏差，明细可能超过20条
                        if(str1 != toDecimal(Sum_money)){alert("明细超过20条，请改为一页显示20条后再试！")};
                        //alert(mystr);
                        navigator.clipboard.writeText(mystr); // 参数是要写入的文本
                    }
//分包付款
                    if (header_name == "分包付款") {
                        let detail_data = document.getElementsByClassName("groupWrap  middle")[0];
                        let rows = detail_data.getElementsByClassName("ant-col ant-col-12 detail-item-wrap");
                        if(rows.length==0){rows = detail_data.getElementsByClassName("ant-col ant-col-8 detail-item-wrap");}
                        rows.forEach(function(row){
                            if (row.getElementsByClassName("long-title")[0]) {
                                if (row.getElementsByClassName("long-title")[0].innerText == "预算类型"){
                                    str3 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "分包单位"){
                                    str2 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "申请付款金额(元)"){
                                    str1 = Number(row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText.replace(/,/g, ''));
                                };
                            }
                        });
                        //子表单
                        detail_data = document.getElementsByClassName("layout-relative comp-wrap common-wrap")[0];
                        let cols_header = detail_data.getElementsByClassName("ant-table-header")[0];
                        rows = cols_header.getElementsByTagName("th");

                        rows.forEach(function(row,index){
                            if (row.innerText == "项目"){str3_col = index};
                            if (row.innerText == "申请金额（含税）(元)"){str4_col = index};
                            if (row.innerText == "归属年份"){str5_col = index};
                            if (row.innerText == "关联费用科目"){str6_col = index};
                            if (row.innerText == "备注"){str7_col = index};
                        });

                        rows = detail_data.getElementsByClassName("ant-table-tbody")[0].getElementsByClassName("ant-table-row ant-table-row-level-0");
                        let k=0;
                        rows.forEach(function(row){
                            str_arr[k] = new Array;
                            str_arr[k]["project_name"] = row.getElementsByTagName("td")[str3_col].innerText;
                            str_arr[k]["money"] = Number(row.getElementsByTagName("td")[str4_col].innerText.replace(/,/g, ''));
                            str_arr[k]["year"] = row.getElementsByTagName("td")[str5_col].innerText;
                            if (str6_col){str_arr[k]["subject"] = row.getElementsByTagName("td")[str6_col].innerText;}else{str_arr[k]["subject"] = ""}
                            str_arr[k]["note"] = row.getElementsByTagName("td")[str7_col].innerText;
                            let result_json = postdata("https://cloud.hecom.cn/universe//paas/app/std/list","CustomObject73__c",row.getElementsByTagName("td")[str3_col].innerText);
                            str_arr[k]["project_belongto"] = result_json.data.records[0].field65__c.label;
                            str_arr[k]["project_type"] = result_json.data.records[0].field8__c.label;
                            console.log(result_json);
                            //alert(str_arr[k][1]);
                            k = k+1;
                        });
                        //根据第一条数据是否有"关联科目费用"来判断如何汇总
                        if(str_arr[0]["subject"] == ""){
                            //非维护部
                            //根据项目合计金额
                            let tmp_arr = new Array;
                            str_arr.forEach(function(str_row){
                                match = false;
                                for (let i = 0 ;i < tmp_arr.length; i++){
                                    if (str_row["project_name"] == tmp_arr[i]["project_name"]){
                                        tmp_arr[i]["money"] += str_row["money"];
                                        match = true;
                                        //alert("match");
                                        break;
                                    }
                                };
                                if(match == false){
                                    let l = tmp_arr.length;
                                    tmp_arr[l] = new Array;
                                    tmp_arr[l]["project_name"] = str_row["project_name"];
                                    tmp_arr[l]["money"] = str_row["money"];
                                    tmp_arr[l]["year"] = str_row["year"];
                                    tmp_arr[l]["project_belongto"] = str_row["project_belongto"];
                                    tmp_arr[l]["project_type"] = str_row["project_type"];
                                    tmp_arr[l]["subject"] = str_row["subject"];
                                    tmp_arr[l]["note"] = str_row["note"];
                                };
                            });
                            console.log(tmp_arr);
                            /*//根据年度、所属区局合并描述
                            flnal_arr = new Array;
                            tmp_arr.forEach(function(str_row){
                                match = false;
                                for (let i = 0 ;i < flnal_arr.length; i++){
                                    if ((str_row["year"] == flnal_arr[i]["year"]) && (str_row["project_belongto"] == flnal_arr[i]["project_belongto"])){
                                        flnal_arr[i]["project_name_money"] = flnal_arr[i]["project_name_money"] + ";" + str_row["project_name"] + " " + str_row["money"];
                                        flnal_arr[i]["money"] += str_row["money"];
                                        match = true;
                                        //alert("match");
                                        break;
                                    }
                                };
                                if(match == false){
                                    let l = flnal_arr.length;
                                    flnal_arr[l] = new Array;
                                    flnal_arr[l]["project_name_money"] = str_row["project_name"] + " " + str_row["money"];
                                    flnal_arr[l]["money"] = str_row["money"];
                                    flnal_arr[l]["year"] = str_row["year"];
                                    flnal_arr[l]["project_belongto"] = str_row["project_belongto"];
                                    flnal_arr[l]["project_type"] = str_row["project_type"];
                                    flnal_arr[l]["subject"] = str_row["subject"];
                                    flnal_arr[l]["note"] = str_row["note"];
                                };
                            });
                            */
                            //拼合剪贴板文本
                            let Sum_money = 0
                            tmp_arr.forEach(function(str_row){
                                mystr += str_row["money"] + "\t" + str2 +"\t"+ str_row["project_name"] + "\n";
                                Sum_money += str_row["money"] ;
                            });
                            //检查金额合计，如果偏差，明细可能超过20条
                            if(str1 != toDecimal(Sum_money)){alert("明细超过20条，请改为一页显示20条后再试！")};
                            //alert(mystr);
                        }else{
                            //维护部
                            //根据项目、关联科目费用合并描述
                            flnal_arr = new Array;
                            str_arr.forEach(function(str_row){
                                match = false;
                                for (let i = 0 ;i < flnal_arr.length; i++){
                                    if ((str_row["project_name"] == flnal_arr[i]["project_name"]) && (str_row["subject"] == flnal_arr[i]["subject"])){
                                        flnal_arr[i]["project_name_money"] = flnal_arr[i]["project_name_money"] + ";" + str_row["note"] + " " + str_row["money"];
                                        flnal_arr[i]["money"] += str_row["money"];
                                        match = true;
                                        //alert("match");
                                        break;
                                    }
                                };
                                if(match == false){
                                    let l = flnal_arr.length;
                                    flnal_arr[l] = new Array;
                                    flnal_arr[l]["project_name_money"] = str_row["note"] + " " + str_row["money"];
                                    flnal_arr[l]["money"] = str_row["money"];
                                    flnal_arr[l]["project_name"] = str_row["project_name"];
                                    flnal_arr[l]["year"] = str_row["year"];
                                    flnal_arr[l]["project_belongto"] = str_row["project_belongto"];
                                    flnal_arr[l]["project_type"] = str_row["project_type"];
                                    flnal_arr[l]["subject"] = str_row["subject"];
                                    flnal_arr[l]["note"] = str_row["note"];
                                };
                            });

                            //拼合剪贴板文本
                            let Sum_money = 0
                            flnal_arr.forEach(function(str_row){
                                //mystr += str3 +"\t"+ str_row["money"] + "\t" + str2 +"\t"+ str_row["project_name_money"] +"\t"+ str_row["year"] +"\t"+ str_row["project_belongto"] +"\t"+ str_row["project_type"] +"\t"+ str_row["subject"] + "\n";
                                mystr += str_row["subject"] + "\t" + str_row["money"] + "\t" + str2 +"\t"+ str_row["project_name"] +"\t"+ str_row["project_name_money"] + "\n";
                                Sum_money += str_row["money"] ;
                            });
                            console.log(flnal_arr);
                            //检查金额合计，如果偏差，明细可能超过20条
                            if(str1 != toDecimal(Sum_money)){alert("明细超过20条，请改为一页显示20条后再试！")};
                            //alert(mystr);
                        }
                        navigator.clipboard.writeText(mystr); // 参数是要写入的文本
                    }
//公司付款
                    if (header_name == "公司付款") {
                        let detail_data = document.getElementsByClassName("groupWrap  middle")[0];
                        let rows = detail_data.getElementsByClassName("ant-col ant-col-12 detail-item-wrap");
                        if(rows.length==0){rows = detail_data.getElementsByClassName("ant-col ant-col-8 detail-item-wrap");}
                        rows.forEach(function(row){
                            if (row.getElementsByClassName("long-title")[0]) {
                                if (row.getElementsByClassName("long-title")[0].innerText == "实际付款金额(元)"){
                                    str1 = Number(row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText.replace(/,/g, ''));
                                };
                            }
                        });
                        //子表单
                        detail_data = document.getElementsByClassName("layout-relative comp-wrap common-wrap")[0];
                        //let cols_header = detail_data.getElementsByClassName("ant-table-header")[0];
                        //rows = cols_header.getElementsByTagName("th");
                        //rows.forEach(function(row,index){
                        //    if (row.innerText == "付款内容"){str3_col = index};
                        //    if (row.innerText == "申请付款金额"){str4_col = index};
                        //    if (row.innerText == "公司付款明细编号"){str5_col = index};
                        //});
                        rows = detail_data.getElementsByClassName("ant-table-tbody")[0].getElementsByClassName("ant-table-row ant-table-row-level-0");
                        let k=0;
                        rows.forEach(function(row){
                            str_arr[k] = new Array;
                            //str_arr[k]["detail"] = row.getElementsByTagName("td")[str3_col].innerText;
                            //str_arr[k]["money"] = Number(row.getElementsByTagName("td")[str4_col].innerText.replace(/,/g, ''));
                            //str_arr[k]["money"] = Number(row.getElementsByTagName("td")[str4_col].innerText.replace(/,/g, ''));
                            let result_json = postdata("https://cloud.hecom.cn/universe//paas/app/std/detail","CustomObject1231__c",row.getAttribute("data-row-key"));
                            console.log(result_json);
                            str_arr[k]["subject"] = result_json.data.records[0].record.field13__c.label;
                            str_arr[k]["detail"] = result_json.data.records[0].record.field2__c;
                            str_arr[k]["customer"] = result_json.data.records[0].record.field11__c.name;
                            str_arr[k]["money"] = result_json.data.records[0].record.field6__c;
                            k = k+1;
                        });
                        //拼合剪贴板文本
                        let Sum_money = 0
                        str_arr.forEach(function(str_row){
                            mystr += str_row["subject"] + "\t" + str_row["money"] + "\t" + str_row["customer"]  +"\t"+ str_row["detail"] + "\n";
                            Sum_money += str_row["money"] ;
                        });
                        //检查金额合计，如果偏差，明细可能超过20条
                        if(str1 != toDecimal(Sum_money)){alert("明细超过20条，请改为一页显示20条后再试！")};
                        //alert(mystr);
                        navigator.clipboard.writeText(mystr); // 参数是要写入的文本
                    }
//开票申请
                    if (header_name == "开票申请") {
                        let detail_data = document.getElementsByClassName("groupWrap  middle")[0];
                        let rows = detail_data.getElementsByClassName("ant-col ant-col-12 detail-item-wrap");
                        if(rows.length==0){rows = detail_data.getElementsByClassName("ant-col ant-col-8 detail-item-wrap");}
                        rows.forEach(function(row){
                            if (row.getElementsByClassName("long-title")[0]) {
                                if (row.getElementsByClassName("long-title")[0].innerText == "负责人"){
                                    str3 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                            }
                        });
                        detail_data = document.getElementsByClassName("layout-content")[0];
                        rows = detail_data.getElementsByClassName("ant-col ant-col-4 layout-summary-item");
                        if(rows.length==0){rows = detail_data.getElementsByClassName("ant-col ant-col-6 layout-summary-item");}
                        rows.forEach(function(row){
                            if (row.getElementsByClassName("long-title")[0]) {
                                if (row.getElementsByClassName("long-title")[0].innerText == "客户名称"){
                                    str2 = row.getElementsByTagName("span")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "申请"){
                                    str1 = Number(row.getElementsByTagName("span")[2].innerText.replace(/,/g, ''));
                                    console.log(str1);
                                };
                            }
                        });
                        //子表单
                        detail_data = document.getElementsByClassName("layout-relative comp-wrap common-wrap")[0];
                        let cols_header = detail_data.getElementsByClassName("ant-table-header")[0];
                        rows = cols_header.getElementsByTagName("th");
                        rows.forEach(function(row,index){
                            if (row.innerText == "含税开票金额(元)"){str3_col = index};
                            if (row.innerText == "税率"){str4_col = index};
                            if (row.innerText == "项目名称"){str5_col = index};
                            if (row.innerText == "经营类型"){str6_col = index};
                        });
                        rows = detail_data.getElementsByClassName("ant-table-tbody")[0].getElementsByClassName("ant-table-row ant-table-row-level-0");
                        let k=0;
                        rows.forEach(function(row){
                            str_arr[k] = new Array;
                            str_arr[k]["detail"] = row.getElementsByTagName("td")[str5_col].innerText;
                            str_arr[k]["money"] = Number(row.getElementsByTagName("td")[str3_col].innerText.replace(/,/g, ''));
                            str_arr[k]["taxrate"] = row.getElementsByTagName("td")[str4_col].innerText;
                            str_arr[k]["type"] = row.getElementsByTagName("td")[str6_col].innerText;
                            k = k+1;
                        });
                        //拼合剪贴板文本
                        let Sum_money = 0
                        str_arr.forEach(function(str_row){
                            //mystr += str2 + "\t" + str_row["money"] + "\t" + str_row["detail"] +"\t"+ str_row["taxrate"] +"\t"+ str_row["type"] +"\t" + str3 + "\n";
                            mystr += str2 + "\t" + str_row["money"] + "\t" + str_row["detail"] + "\n";
                            Sum_money += str_row["money"] ;
                        });
                        //检查金额合计，如果偏差，明细可能超过20条
                        if(str1 != toDecimal(Sum_money)){alert("明细超过20条，请改为一页显示20条后再试！")};
                        //alert(mystr);
                        navigator.clipboard.writeText(mystr); // 参数是要写入的文本
                    }
//报销申请
                    if (header_name == "报销申请") {
                        let detail_data = document.getElementsByClassName("groupWrap  middle")[0];
                        let rows = detail_data.getElementsByClassName("ant-col ant-col-12 detail-item-wrap");
                        if(rows.length==0){rows = detail_data.getElementsByClassName("ant-col ant-col-8 detail-item-wrap");}
                        rows.forEach(function(row){
                            if (row.getElementsByClassName("long-title")[0]) {
                                if (row.getElementsByClassName("long-title")[0].innerText == "业务类型"){
                                    str4 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "申请人"){
                                    str3 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "所属部门"){
                                    str2 = row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText;
                                };
                                if (row.getElementsByClassName("long-title")[0].innerText == "报销金额(元)"){
                                    str1 = Number(row.getElementsByClassName("detail-item")[0].getElementsByTagName("div")[2].innerText.replace(/,/g, ''));
                                };
                            }
                        });
                        //子表单
                        detail_data = document.getElementsByClassName("layout-relative comp-wrap common-wrap")[0];
                        let cols_header = detail_data.getElementsByClassName("ant-table-header")[0];
                        rows = cols_header.getElementsByTagName("th");
                        rows.forEach(function(row,index){
                            if (row.innerText == "费用金额(元)"){str3_col = index};
                            if (row.innerText == "费用类型"){str4_col = index};
                            if (row.innerText == "费用事由"){str5_col = index};
                            if (row.innerText == "项目"){str6_col = index};
                            if (row.innerText == "项目归属年份"){str7_col = index};
                        });
                        rows = detail_data.getElementsByClassName("ant-table-tbody")[0].getElementsByClassName("ant-table-row ant-table-row-level-0");
                        let k=0;
                        rows.forEach(function(row){
                            str_arr[k] = new Array;
                            str_arr[k]["detail"] = row.getElementsByTagName("td")[str5_col].innerText;
                            str_arr[k]["money"] = Number(row.getElementsByTagName("td")[str3_col].innerText.replace(/,/g, ''));
                            str_arr[k]["type"] = row.getElementsByTagName("td")[str4_col].innerText;
                            if (str6_col){
                                str_arr[k]["project_name"] = row.getElementsByTagName("td")[str6_col].innerText;
                                let result_json = postdata("https://cloud.hecom.cn/universe//paas/app/std/list","CustomObject73__c",row.getElementsByTagName("td")[str6_col].innerText);
                                str_arr[k]["project_belongto"] = result_json.data.records[0].field65__c.label;
                                //str_arr[k]["project_type"] = result_json.data.records[0].field8__c.label;
                            }else{
                                str_arr[k]["project_name"] = ""
                                str_arr[k]["project_belongto"] =""
                            }
                            if (str7_col){str_arr[k]["year"] = row.getElementsByTagName("td")[str7_col].innerText;}else{str_arr[k]["year"] = ""}
                            k = k+1;
                        });
                        //根据业务类型来判断如何汇总
                        if(str4 == "非维护部项目费用报销"){
                            flnal_arr = new Array;
                            str_arr.forEach(function(str_row){
                                match = false;
                                for (let i = 0 ;i < flnal_arr.length; i++){
                                    if ((str_row["type"] == flnal_arr[i]["type"]) && (str_row["project_belongto"] == flnal_arr[i]["project_belongto"]) && (str_row["year"] == flnal_arr[i]["year"])) {
                                        flnal_arr[i]["detail_money"] = flnal_arr[i]["detail_money"] + ";" + str_row["project_name"] + " " + str_row["detail"] + " " + str_row["money"];
                                        flnal_arr[i]["money"] += str_row["money"];
                                        match = true;
                                        //alert("match");
                                        break;
                                    }
                                };
                                if(match == false){
                                    let l = flnal_arr.length;
                                    flnal_arr[l] = new Array;
                                    flnal_arr[l]["detail_money"] = str_row["project_name"] + " " + str_row["detail"] + " " + str_row["money"];
                                    flnal_arr[l]["money"] = str_row["money"];
                                    flnal_arr[l]["type"] = str_row["type"];
                                    flnal_arr[l]["project_belongto"] = str_row["project_belongto"];
                                    flnal_arr[l]["year"] = str_row["year"];
                                };
                            });

                        }else{
                            flnal_arr = new Array;
                            str_arr.forEach(function(str_row){
                                match = false;
                                for (let i = 0 ;i < flnal_arr.length; i++){
                                    if (str_row["type"] == flnal_arr[i]["type"]){
                                        flnal_arr[i]["detail_money"] = flnal_arr[i]["detail_money"] + ";" + str_row["detail"] + " " + str_row["money"];
                                        flnal_arr[i]["money"] += str_row["money"];
                                        match = true;
                                        //alert("match");
                                        break;
                                    }
                                };
                                if(match == false){
                                    let l = flnal_arr.length;
                                    flnal_arr[l] = new Array;
                                    flnal_arr[l]["detail_money"] = str_row["detail"] + " " + str_row["money"];
                                    flnal_arr[l]["money"] = str_row["money"];
                                    flnal_arr[l]["type"] = str_row["type"];
                                    flnal_arr[l]["project_belongto"] = str_row["project_belongto"];
                                    flnal_arr[l]["year"] = str_row["year"];
                                };
                            });
                        }
                        //拼合剪贴板文本
                        let Sum_money = 0
                        flnal_arr.forEach(function(str_row){
                            mystr +=str_row["type"] + "\t" + str_row["money"] +"\t"+ str_row["detail_money"] +"\t"+ str3 +"\t" + str2 +"\t"+ str_row["project_belongto"] +"\t"+ str_row["year"] + "\n";
                            Sum_money += str_row["money"] ;
                        });
                        //检查金额合计，如果偏差，明细可能超过20条
                        if(str1 != toDecimal(Sum_money)){alert("明细超过20条，请改为一页显示20条后再试！")};
                        //alert(mystr);
                        navigator.clipboard.writeText(mystr); // 参数是要写入的文本
                    }
					alert(mystr + " 已复制！");
				}
				//把节点添加到head-title当中
				head_title.appendChild(Copy_btn);
			}
		}
	}
    function postdata(url,metaName,code){
        let authJson = JSON.parse(localStorage.getItem("auth"));
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("act", "detail");
        xhr.setRequestHeader("app", "std");
        xhr.setRequestHeader("clienttag", authJson.clientTag);
        xhr.setRequestHeader("empcode", authJson.empCode);
        xhr.setRequestHeader("entcode", authJson.entCode);
        xhr.setRequestHeader("obj", metaName);
        xhr.setRequestHeader("uid", authJson.uid);
        xhr.setRequestHeader("accessToken", authJson.accessToken);
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 请求成功
                //console.log(xhr.responseText);
            }
        };
        let data
        if (metaName=="CustomObject1231__c"){
            data = '{"metaName":"'+ metaName +'","code":"'+ code +'","selectFieldList":[{"name":"field12__c","subFields":[{"name":"field2__c"}]},{"name":"field1__c","subFields":[{"name":"field1__c"},{"name":"field8__c"},{"name":"field14__c"},{"name":"approvalStatus"}]},{"name":"field4__c"},{"name":"field3__c"},{"name":"owner","subFields":[{"name":"dept"}]},{"name":"parent__s","subFields":[{"name":"approvalStatus"},{"name":"isReadOnly"}]},{"name":"businessMember__bm","subFields":[{"name":"isOuter"},{"name":"label"}]},{"name":"businessRoles__bm","subFields":[{"name":"isOuter"},{"name":"label"}]}]}';
        }else{
            data = '{"meta":{"metaName":"'+ metaName +'"},"page":{"pageNo":1,"pageSize":100},"keyWord":"'+ code +'","filter":{"metaName":"CustomObject73__c","metaId":10070250063,"conj":"advance","expr":"1","conditions":[{"op":"nin","left":{"type":"field","value":"CustomObject73__c.approvalStatus"},"right":{"expression":"","type":"value","value":["unsubmitted","revoked"]},"key":1}]},"keyWordSearchFields":["name","field211__c","field65__c","field27__c","field75__c","approvalStatus","field208__c","field8__c","field1712__c","dept","field103__c","field23__c","field24__c","field50__c","field51__c","field180__c","field73__c","field74__c","field40__c","field71__c","bizType","field282__c","field49__c","field35__c","field99__c","createdBy","owner","field76__c","field92__c","field83__c","field85__c","field82__c","field110__c","field80__c","field91__c","field109__c","field64__c","field54__c","field761__c","field86__c","field72__c","field59__c","field53__c","field123__c","field111__c","field98__c","field39__c"],"scope":1,"sorts":[],"aggsFields":[{"aggOneLevel":0,"unit":"","field":"field180__c","label":"合同金额","aggs":"Sum"},{"aggOneLevel":0,"unit":"","field":"field74__c","label":"合同实际收入（不含税）","aggs":"Sum"},{"aggOneLevel":0,"unit":"","field":"field45__c","label":"待回款金额","aggs":"Sum"}],"countSecondaryList":true,"relDataListParam":{"metaName":"CustomObject73__c","relationFilter":{"metaName":"CustomObject490__c","filter":{},"fieldName":"field1__c","page":{"pageNo":1,"pageSize":10},"sorts":[{"field":"createdOn","orderType":0}]}}}';
        }
        xhr.send(data);
        return JSON.parse(xhr.responseText);
    }
    function toDecimal(x) {
        var val = Number(x)
        if(!isNaN(parseFloat(val))) {
            val = val.toFixed(2);
        }
        return val;
    }
})();