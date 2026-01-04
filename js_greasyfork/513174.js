// ==UserScript==
// @name         一键架区（军爷版）
// @namespace    http://tampermonkey.net/
// @version      2024-11-4-1
// @description  实现特戒引擎后台的一键架区功能
// @author       军哥QAQ
// @match        https://www.tejiegm.com/gm/index.jsp?*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513174/%E4%B8%80%E9%94%AE%E6%9E%B6%E5%8C%BA%EF%BC%88%E5%86%9B%E7%88%B7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513174/%E4%B8%80%E9%94%AE%E6%9E%B6%E5%8C%BA%EF%BC%88%E5%86%9B%E7%88%B7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==



    'use strict';
(function () {


    $.ajax({
		type: "POST",
		url: "https://www.tejiegm.com/gm/gameversionlist/getGameVersionListCombox.jhtml?type=STM",
		async: true,
		dataType: "json",
        success:function(data){
            var datas = JSON.stringify(data);
            var dropdown = document.getElementById("myList");
            $.each(data, function(index, item) {
                var ssss = item.gameVersion;
                if(ssss===0){
                 return;
                }
                if(ssss.includes("即将下架")){
                 return;
                }
                var option = document.createElement("option");
                option.value = ssss;
                option.text = ssss;
                dropdown.appendChild(option);
             });
        }
	});


    let tableHtml = `
    <div class="col-md-12 table-card" style="padding:1em;" id="draggable">
     <div class="table-responsive">
      <table class="table table-bordered table-striped" id="test_table">
       <thead>
         <tr>
         <td>
         <div id ="tiet" style="color:red" onselectstart="return false;">一键架区（军爷版）</div>
         </td>
         </tr>
        <tr>
        <td>
        <select id="myList"  style="width:300px" >
         </select>
         <button id="asdaf">架区</button>
         </td>
         </tr>
         <tr>
         <td>
         <select id="myList1"  style="width:200px" >
         </select>
         <p>
         <select id="myList2"  style="width:200px" htht multiple size="6">
         </select>
         <button id ="hequ">①检测</button>
         <button id ="hequ1">②合区</button>
         </td>
         </tr>
        <tr>
        <td>
        合区名<input id="myList3"  style="width:100px">
         时间<input type="text" id="timepicker">
         </td>
         </tr>
       </thead>
       <tbody></tbody>
      </table>
     </div>
    </div>
    `
  let cssMore = `
   .table-card{
    position:fixed;
    right:100px;
    top:300px;
    z-index:100;
    background:#fff;
    box-shadow: 0px 0px 0 6px #E95C8A;
   }
  `
  GM_addStyle(cssMore)
    $('body').append(tableHtml)


var priority = [
'100',
'100',
'100',
'100',
'100',
'100',
'100',
'100'
];
var priorityz =[
'100',
'100',
'100',
'100',
'100',
'100',
'',
''
];
var areaName = [
'全部大区',
'全部大区',
'全部大区',
'全部大区',
'全部大区',
'全部大区',
'全部大区',
'全部大区'
];
var areaNamez= [
'全部大区',
'全部大区',
'全部大区',
'全部大区',
'全部大区',
'全部大区',
'',
''
];
var burst = [
'',
'',
'',
'',
'',
'',
'',
''
];
var hotDegree = [
'1',
'1',
'1',
'1',
'1',
'1',
'1',
'1'
];
var hotDegreez= [
'1',
'1',
'1',
'1',
'1',
'1',
'',
''
];
var hotDegree2 = [
'1',
'1',
'1',
'1',
'1',
'1',
'1',
'1'
];
var hotDegree2z= [
'1',
'1',
'1',
'1',
'1',
'1',
'',
''
];
var schemeIds = [
'9',
'9',
'9',
'9',
'9',
'9',
'9',
'9'
];
var schemeIdsz= [
'9',
'9',
'9',
'9',
'9',
'9',
'',
''
];


$("#asdaf").click(function(){



var versiosn = document.getElementById("myList").value;
var gameVersion = [];
			for (var i = 0; i < 8; i++) {
				gameVersion.push(versiosn);
			}
var today = new Date();
var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
var tomorrowDate = tomorrow.getDate();
var tomorrowMonth = tomorrow.getMonth() + 1;
var tomorrowYear = tomorrow.getFullYear();

var dateString = [];
var tiems1 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 00:00:00';
var tiems2 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 01:00:00';
var tiems3 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 02:00:00';
var tiems4 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 03:00:00';
var tiems5 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 04:00:00';
var tiems6 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 05:00:00';
var tiems7 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 08:00:00';
var tiems8 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 10:00:00';
dateString.push(tiems1);
    dateString.push(tiems2);
    dateString.push(tiems3);
    dateString.push(tiems4);
    dateString.push(tiems5);
    dateString.push(tiems6);
    dateString.push(tiems7);
    dateString.push(tiems8);


var formalName = [];
var formalName1 = tomorrowDate+'日01区[火爆]';
var formalName2 = tomorrowDate+'日02区[火爆]';
var formalName3 = tomorrowDate+'日03区[火爆]';
var formalName4 = tomorrowDate+'日04区[火爆]';
var formalName5 = tomorrowDate+'日05区[火爆]';
var formalName6 = tomorrowDate+'日06区[火爆]';
var formalName7 = tomorrowDate+'日07区[火爆]';
var formalName8 = tomorrowDate+'日08区[火爆]';
formalName.push(formalName1);
    formalName.push(formalName2);
    formalName.push(formalName3);
    formalName.push(formalName4);
    formalName.push(formalName5);
    formalName.push(formalName6);
    formalName.push(formalName7);
    formalName.push(formalName8);
$.ajax({
		type: "POST",
		url: "servermanager/preCreateServer2Bench.jhtml",
		async: true,
		data: {
			gameVersion: gameVersion,
			formalStartTime: dateString,
			formalName: formalName,
			priority: priority,
			areaName: areaName,
			burst: burst,
			hotDegree: hotDegree,
			hotDegree2: hotDegree2,
            schemeIds: schemeIds
		},
		dataType: "json",
	});



  //



var dateString1s = [];
var tiems11 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 12:00:00';
var tiems21 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 14:00:00';
var tiems31 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 16:00:00';
var tiems41 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 18:00:00';
var tiems51 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 20:00:00';
var tiems61 = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDate + ' 22:00:00';
var tiems71 = ' ';
var tiems81 = ' ';
dateString1s.push(tiems11);
    dateString1s.push(tiems21);
    dateString1s.push(tiems31);
    dateString1s.push(tiems41);
    dateString1s.push(tiems51);
    dateString1s.push(tiems61);
        dateString1s.push(tiems71);
        dateString1s.push(tiems81);



var formalNames1 = [];
var formalName1s = tomorrowDate+'日09区[火爆]';
var formalName2s = tomorrowDate+'日10区[火爆]';
var formalName3s = tomorrowDate+'日11区[火爆]';
var formalName4s = tomorrowDate+'日12区[火爆]';
var formalName5s = tomorrowDate+'日13区[火爆]';
var formalName6s = tomorrowDate+'日14区[火爆]';
var formalName7s = '';
    var formalName8s = '';
formalNames1.push(formalName1s);
    formalNames1.push(formalName2s);
    formalNames1.push(formalName3s);
    formalNames1.push(formalName4s);
    formalNames1.push(formalName5s);
    formalNames1.push(formalName6s);
    formalNames1.push(formalName7s);
    formalNames1.push(formalName8s);

$.ajax({
		type: "POST",
		url: "servermanager/preCreateServer2Bench.jhtml",
		async: true,
		data: {
			gameVersion: gameVersion,
			formalStartTime: dateString1s,
			formalName: formalNames1,
			priority: priorityz,
			areaName: areaNamez,
			burst: burst,
			hotDegree: hotDegreez,
			hotDegree2: hotDegree2z,
            schemeIds: schemeIdsz
		},
		dataType: "json",
        success:callBack
	});


})

function callBack() {
	alert("添加成功！");
}

$("#hequ").click(function(){

$('#myList1').empty();
    $('#myList2').empty();


var versiosn = document.getElementById("myList").value;
    $.ajax({
	            type: "POST",
	            url: "login/setGameVersion.jhtml?type=index",
	            async: true,
	            data: {
	                gameVersion: versiosn
	            },
	            dataType: "json",
	            success: function (data) {

	            }
	        });




    $.ajax({
    type: 'POST',
    url: 'https://www.tejiegm.com/gm/servermanager/getServerListCombox.jhtml?type=merge',
    async: true,
    success: function(data) {
        let newStr = data.replace(/\\/g, '');
        var datad = JSON.parse(newStr);
        var dropdown1 = document.getElementById("myList1");
            $.each(datad, function(index, item) {
            var option = document.createElement("option");
            option.value = item.gvid;
            option.text = item.showName;
            dropdown1.appendChild(option);
        });
    },
    })

    $.ajax({
    type: 'POST',
    url: 'servermanager/getServerListTree.jhtml?type=merge',
    async: true,
    success: function(data) {
        var datad = JSON.parse(data);
        var datass1 = datad[0].children;
        var dropdown2 = document.getElementById("myList2");
        $.each(datass1, function(index, item) {
            var option = document.createElement("option");
            option.value = item.id;
            option.text = item.text;
            dropdown2.appendChild(option);
         });
         },
    });


var datePickerInput = document.getElementById('timepicker');

    var date = new Date(); // 获取当前日期和时间
    var day = date.getDate(); // 获取当前日期的日部分
    var month = date.getMonth() + 1; // 获取当前日期的月部分（注意：月份是从0开始的，所以需要+1）
    var year = date.getFullYear(); // 获取当前日期的年部分
    var dateStr = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' 10:00:00';
    datePickerInput.value = dateStr;
var datePickerInput1 = document.getElementById('myList3');
    var day1 = day - 1;
datePickerInput1.value= day1+'日合区';
});





$("#hequ1").click(function(){
var versiosn1 = document.getElementById("myList1").value;
var versiosn3 = document.getElementById("myList3").value;
var versiosn4 = document.getElementById("timepicker").value;

var multiSelect = document.getElementById('myList2');

// 获取所有选中的选项
var selectedOptions = multiSelect.selectedOptions;


;var slaves = [];

// 遍历选中的选项
for (var i = 0; i < selectedOptions.length; i++) {
  console.log(selectedOptions[i].value); // 输出选中选项的值
    slaves.push(selectedOptions[i].value);
}





	var aaa ;

	$.ajax({
		type: "POST",
		url: "servermanager/preMergeServer.jhtml?type=submit",
		async: true,
		data: {
			taskId: -1,
			slave: slaves,
			master: versiosn1,
			mergeTime: versiosn4,
			noticeTime: 2,
			notice: aaa,
			interval: 20,
			ltLevel: aaa,
			gtNoLoginDay: aaa,
			rename: versiosn3,
			areaName: aaa,
			renameArea: aaa,
			globalVars: aaa
		},
		dataType: "json",
        success: function (data) {
            if(data.code == 0){
                alert("操作成功！");
            }else{
                alert(data.value);

            }


        }
	});



    });














    // Your code here...
})();
