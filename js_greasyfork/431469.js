// ==UserScript==
// @name            国抽平台功能增强-保健食品
// @namespace       http://tampermonkey.net/
// @author          Duke
// @description     国抽平台功能增强-保健
// @include         https://spcjinsp.gsxt.gov.cn/test_platform/healthFoodTest/search/0?v=4.0
// @require         https://cdn.bootcdn.net/ajax/libs/alasql/0.6.2/alasql.min.js
// @require         https://cdn.bootcdn.net/ajax/libs/xlsx/0.16.9/xlsx.core.min.js
// @version         1.3.2
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/431469/%E5%9B%BD%E6%8A%BD%E5%B9%B3%E5%8F%B0%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA-%E4%BF%9D%E5%81%A5%E9%A3%9F%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/431469/%E5%9B%BD%E6%8A%BD%E5%B9%B3%E5%8F%B0%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA-%E4%BF%9D%E5%81%A5%E9%A3%9F%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var roleName = $("#role", parent.document).text();
    var toolbar_tag = $("#toolbar");
    toolbar_tag.append('    <a class="btn btn-success" id="open-btn"><i class="fa fa-star"></i> 全 部 打 开</a>');
    toolbar_tag.append('    <a class="btn btn-warning hid hidden" id="input-btn"><i class="fa fa-edit"></i> 录 入 数 据</a>');
    upload();
    $('#btn_2,#btn_3,#btn_4,#btn_5,#btn_6,#btn_7,#btn_8').click(function () {
        $("#input-btn").addClass("hidden");
    });
    $('#btn_1').click(function () {
        if (roleName == '检测数据填报人员') {
            $("#input-btn").removeClass("hidden");
        }
    });
    //录入数据
    function editAll(arr,issave){
        function getSampleid(XMDATA,num) {
            var id_sampleNo = ["",""];
            var myDate = new Date();
            var startYear = myDate.getFullYear() - 1;
            var theURL = 'https://spcjinsp.gsxt.gov.cn/test_platform/api/healthFood/getHealthFood?order=desc&offset=0&limit=10&dataType=1&startDate=' + startYear + '-01-01&endDate=' + formatDate(myDate) + '&taskFrom=&samplingUnit=&testUnit=&enterprise=&sampledUnit=&sampleName=&province=&personName=&sampleNo=' +  XMDATA["抽样编号"] + '&bsfla=&bsflb=&gnlb=&_=' + myDate.getTime();
            var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
            httpRequest.open('GET',theURL, true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
            httpRequest.send();//第三步：发送请求  将请求参数写在URL中
            return new Promise((resolve) => {
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        var json = httpRequest.responseText;//获取到json字符串，还需解析
                        var reg0='"id":(\\d*?),';
                        var reg1='"sp_s_16":"([\\s\\S]*?)",';
                        if(json.length!=0){
                            if(!json.match(reg0)){
                                //未查询到编号
                                var resarr = new Array();
                                for(var m = 0;m < XMDATA.testitem.length; m++){
                                    var xmmc = XMDATA.testitem[m]["检验项目"];
                                    resarr.push([num,"未查询到" +  XMDATA["抽样编号"],xmmc]);
                                }
                                resolve(resarr);
                            } else {
                                id_sampleNo[0]=json.match(reg0)[1];
                                id_sampleNo[1]=json.match(reg1)[1];
                                parent.addTabs("/test_platform/healthFoodTest/healthFoodDetail/" + id_sampleNo[0],id_sampleNo[1]);
                                var name1 = $(".J_mainContent iframe:visible", parent.document).attr("name");
                                $('iframe[name=' + name1 + ']',parent.document).load(function () {
                                    setTimeout(function(){
                                        var resarr = new Array();
                                        for(var m = 0;m < XMDATA.testitem.length;m++){
                                            var xmmc = XMDATA.testitem[m]["检验项目"];
                                            if($('iframe[name=' + name1 + ']',parent.document).contents().find('body').find('input[value="' + xmmc +'"]').length < 1) {
                                                //未查询到项目
                                                resarr.push([num,XMDATA["抽样编号"],"未查询到" +  xmmc]);
                                            } else {
                                                console.log(xmmc);
                                                var str11 = $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find('input[type="text"][value="' + xmmc +'"]').attr("id");
                                                var reg2='([\\s\\S]*?)_item';
                                                var str22 = str11.match(reg2)[1];
                                                //输入检验结果
                                                if(XMDATA.testitem[m]["检验结果"]){
                                                    var jyjg = XMDATA.testitem[m]["检验结果"];
                                                    var str33 = str22 + '_spdata_1';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str33).val(jyjg);
                                                };
                                                //输入结果单位
                                                if(XMDATA.testitem[m]["结果单位"]){
                                                    var jgdw = XMDATA.testitem[m]["结果单位"];
                                                    var str44 = str22 + '_spdata_18';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str44).val(jgdw);
                                                };
                                                //选择检验依据
                                                if(XMDATA.testitem[m]["检验依据"]){
                                                    var jyyjKEY = XMDATA.testitem[m]["检验依据"];
                                                    var str66 = str22 + '_testReason';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str66 + " option:contains('" + jyyjKEY +"')").attr("selected", true);
                                                    fireMouseEvent($('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str66).get(0),'click');
                                                };
                                                //选择判定依据
                                                if(XMDATA.testitem[m]["判定依据"]){
                                                    var pdyjKEY = XMDATA.testitem[m]["判定依据"];
                                                    var str77 = str22 + '_verifyReason';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str77 + " option:contains('" + pdyjKEY +"')").attr("selected", true);
                                                    fireMouseEvent($('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str77).get(0),'click');
                                                };
                                                //输入最小允许限
                                                if(XMDATA.testitem[m]["最小允许限"]){
                                                    var MINyxx = XMDATA.testitem[m]["最小允许限"];
                                                    var str88 = str22 + '_spdata_11';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str88).val(MINyxx);
                                                };
                                                //输入最大允许限
                                                if(XMDATA.testitem[m]["最大允许限"]){
                                                    var MAXyxx = XMDATA.testitem[m]["最大允许限"];
                                                    var str99 = str22 + '_spdata_15';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str99).val(MAXyxx);
                                                };
                                                //输入允许限单位
                                                if(XMDATA.testitem[m]["允许限单位"]){
                                                    var yxxdw = XMDATA.testitem[m]["允许限单位"];
                                                    var strAA = str22 + '_spdata_16';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + strAA).val(yxxdw);
                                                };
                                                //输入方法检出限
                                                if(XMDATA.testitem[m]["方法检出限"]){
                                                    var ffjcx = XMDATA.testitem[m]["方法检出限"];
                                                    var strBB = str22 + '_spdata_7';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + strBB).val(ffjcx);
                                                };
                                                //输入检出限单位
                                                if(XMDATA.testitem[m]["检出限单位"]){
                                                    var jcxdw = XMDATA.testitem[m]["检出限单位"];
                                                    var strCC = str22 + '_spdata_8';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + strCC).val(jcxdw);
                                                };
                                                //输入备注
                                                if(XMDATA.testitem[m]["备注"]){
                                                    var bz = XMDATA.testitem[m]["备注"];
                                                    var strDD = str22 + '_bz';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + strDD).val(bz);
                                                };
                                                //输入说明
                                                if(XMDATA.testitem[m]["说明"]){
                                                    var sm = XMDATA.testitem[m]["说明"];
                                                    var strEE = str22 + '_spdata_17';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + strEE).val(sm);
                                                };
                                                //选择结果判定（如果为空就执行自动判定，否则选择对应的选项）
                                                if(!XMDATA.testitem[m]["结果判定"]){
                                                    fireKeyEvent($('iframe[name=' + name1 + ']',parent.document).contents().find('body').find('#' + str22 + '_spdata_1').get(0),'keyup',37);
                                                } else {
                                                    var jgpd = XMDATA.testitem[m]["结果判定"];
                                                    var str55 = str22 + '_spdata_2';
                                                    $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str55 + " option[value='" + jgpd +"']").attr("selected", true);
                                                    fireChangeEvent($('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + str55).get(0));
                                                }
                                                //返回页面填报结果
                                                var strxxs = ['_spdata_1', '_spdata_18','_spdata_2','_testReason','_verifyReason','_spdata_11','_spdata_15','_spdata_16','_spdata_7','_spdata_8','_bz','_spdata_17'];
                                                var strarr = [num,XMDATA["抽样编号"],xmmc];
                                                for (var n = 0;n < strxxs.length;n++){
                                                    strxxs[n] = str22 + strxxs[n];
                                                    strarr.push($('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#" + strxxs[n]).val())
                                                }
                                                resarr.push(strarr);
                                            };
                                        };
                                        if(issave == true){
                                            //保存
                                            $('iframe[name=' + name1 + ']',parent.document).contents().find('body').find("#save").click();
                                            //关闭当前页
                                            setTimeout(function(){
                                                $(".J_menuTab.active", parent.document).remove();
                                                $('iframe[name=' + name1 + ']',parent.document).remove();
                                                resolve(resarr);
                                            },1000)
                                        } else {
                                            //不保存
                                            //不关闭当前页
                                            setTimeout(function(){
                                                resolve(resarr);
                                            },1000)
                                        }
                                    },2500)
                                });
                            };
                        };
                    };
                };
            });
        };
        async function getAllSampleid(arr1) {
            var strarr =[['序号','抽样编号','检验项目','检验结果','结果单位','结果判定','检验依据','判定依据','最小允许限','最大允许限','允许限单位','方法检出限','检出限单位','备注','说明']]
            for(var i = 0;i < arr1.length; i++) {
                var res = await getSampleid(arr1[i],i);
                for(var m = 0;m < res.length; m++) {
                    strarr.push(res[m]);
                }
            }
            //console.log(strarr);
            var name = getExcelFileName();
            alasql('SELECT * INTO XLS("' + name + '",{headers:false}) FROM ?',[strarr]);
            setTimeout(function(){
                $('a[data-id="/test_platform/healthFoodTest/search/0"]',parent.document).find(".fa-times-circle").click();
            },3000)
        }
        getAllSampleid(arr);
    };
    //设置上传文件组件
    function upload(){
        var inputObj = document.createElement('input');
        inputObj.setAttribute('id','file');
        inputObj.setAttribute('type','file');
        inputObj.setAttribute('name','file');
        inputObj.setAttribute('style','visibility:hidden');
        document.body.appendChild(inputObj);
    };
    //给上传文件组件添加change事件
    $(function() {
		document.getElementById('file').addEventListener('change', function(e) {
		    var files = e.target.files;
			if(files.length == 0) {
                return;
            } else {
                var f = files[0];
                if(!/\.xlsx$/g.test(f.name)) {
                    alert('仅支持读取xlsx格式！');
                    return;
                } else {
                    readWorkbookFromLocalFile(f, function(result) {
                        console.log(result);
                        let obj = {};
                        result.forEach((item, index) => {
                            let { 抽样编号 } = item;
                            if (!obj[抽样编号]) {
                                obj[抽样编号] = {
                                    抽样编号,
                                    testitem: []
                                }
                            }
                            obj[抽样编号].testitem.push(item);
                        });
                        let data = Object.values(obj);
                        console.log(data);
                        editAll(data,true);
                    });
                }
            }
		});
	});
    //解析表格
    function readWorkbookFromLocalFile(file, callback) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var data = event.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            const wsname = workbook.SheetNames[0];
            const ws = workbook.Sheets[wsname];
            var result =XLSX.utils.sheet_to_row_object_array(ws);
			if(callback) callback(result);
        };
        reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        reader.readAsBinaryString(file);
	};
    //发送GET请求
    function httpGet(theUrl){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    };
    //规范日期格式为yyyy-MM-dd
    function formatDate(date){
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    };
    //以当前日期和时间为文件名
    function getExcelFileName() {
        var d = new Date();
        var curYear = d.getFullYear();
        var curMonth = "" + (d.getMonth() + 1);
        var curDate = "" + d.getDate();
        var curHour = "" + d.getHours();
        var curMinute = "" + d.getMinutes();
        var curSecond = "" + d.getSeconds();
        if (curMonth.length == 1) {
            curMonth = "0" + curMonth;
        }
        if (curDate.length == 1) {
            curDate = "0" + curDate;
        }
        if (curHour.length == 1) {
            curHour = "0" + curHour;
        }
        if (curMinute.length == 1) {
            curMinute = "0" + curMinute;
        }
        if (curSecond.length == 1) {
            curSecond = "0" + curSecond;
        }
        var fileName = "结果输出" + "_" + curYear + curMonth + curDate + "_" + curHour + curMinute + curSecond + ".xls";
        return fileName;
    };
    //模拟change事件
    function fireChangeEvent(el) {
        var e = document.createEvent("HTMLEvents");
        e.initEvent("change", true, true);
        el.dispatchEvent(e);
    };
    //模拟鼠标事件
    function fireMouseEvent(el, evtType) {
        var e = document.createEvent("MouseEvents");
        e.initEvent(evtType, true, true);
        el.dispatchEvent(e);
    };
    //模拟键盘事件
    function fireKeyEvent(el, evtType, keyCode) {
        var evtObj;
        if (document.createEvent) {
            evtObj = document.createEvent('UIEvents');
        evtObj.initUIEvent(evtType, true, true, window, 1);
            delete evtObj.keyCode;
            if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                Object.defineProperty(evtObj, "keyCode", { value: keyCode });
            } else {
                evtObj.key = String.fromCharCode(keyCode);
            }
            if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                Object.defineProperty(evtObj, "ctrlKey", { value: true });
            } else {
                evtObj.ctrlKey = true;
            }
        }
        el.dispatchEvent(evtObj);
    };
    //全部打开
    $("#open-btn").click(function () {
        var rows = $("#dg").bootstrapTable("getSelections");
        var id_sampleNo = ["",""];
        if (rows.length == 0) {
            alert('请选择要打开的样品!');
            return;
        } else {
            openAllSelectedItem();
        };
        async function openAllSelectedItem() {
            for (var i = 0; i < rows.length; i++) {
                id_sampleNo[0] = rows[i].id;
                id_sampleNo[1] = rows[i].sp_s_16;
                await openSelectedItem(id_sampleNo[0],id_sampleNo[1]);
            };
        };
        function openSelectedItem(sampleId,sampleNo) {
            return new Promise((resolve) => {
                parent.addTabs("/test_platform/healthFoodTest/healthFoodDetail/" + sampleId,sampleNo);
                var name1 = $(".J_mainContent iframe:visible", parent.document).attr("name");
                $('iframe[name=' + name1 + ']',parent.document).load(function () {
                    setTimeout(function(){
                        resolve();
                    },1000)
                });
            });
        };
    });
    //点击录入按钮
    $("#input-btn").click(function (){
        if (roleName == '检测数据填报人员') {
            document.getElementById('file').click();
        } else {
            alert('当前角色不是主检人');
        }
    });
})();