// ==UserScript==
// @name         toutiao fans
// @namespace    http://www.yysheng.com/
// @version      1.3
// @description  下载头条粉丝信息表格
// @author       yysheng
// @match        https://www.toutiao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432458/toutiao%20fans.user.js
// @updateURL https://update.greasyfork.org/scripts/432458/toutiao%20fans.meta.js
// ==/UserScript==

(function() {
			    'use strict';
				console.log("开始打印")
				console.log(document.getElementsByClassName('list-wrapper'))
				var span = document.createElement('button'); //1、创建元素
				span.style.width = '150px'
				span.style.height = '30px'
				span.style.position = 'fixed'
				span.style.bottom = '0'
				span.style.right = '160px'
				span.style.backgroundColor = 'orange'
				span.style.color = 'black'
				span.style.textAlign = 'center'
				span.style.lineHeight = '30px'
				span.style.zIndex = '20000'
				span.innerHTML='开始提取';
				document.body.appendChild(span)
				var nameList = []
				var excel = '<table>';
				var row = "<tr>";
				var timer = null;
				function getList(){
					if(document.getElementsByClassName('body')){
						let list = document.getElementsByClassName('body')[0]
						list.scrollTo(list.scrollLeft,list.scrollHeight)
					}
					
					nameList = []
					let arr = document.getElementsByClassName('name')
					for (let i = 0; i < arr.length; i++) {
						let name = arr[i].innerText
						let phone = name.match(/\d+/g)
						if(!phone)continue;
						phone = phone.join('')
						let myreg=/^[1][3,4,5,7,8,9][0-9]{9}$/;
						if (myreg.test(phone)) {
							nameList.push({name:name,phone:phone})
						}
					}
					span.innerHTML='已提取'+nameList.length+'个';
					console.log(nameList)
					if(document.getElementsByClassName("load-more-btn") && document.getElementsByClassName("load-more-btn")[0]){
						document.getElementsByClassName("load-more-btn")[0].click();
					}else{
						alert("没有更多了")
						clearInterval(timer)
						timer = null
					}
				}
				span.onclick = function(){
					console.log("开始提取")
					if(timer){
						alert("正在自动提取中...")
						return
					}
					timer = setInterval(getList,500)
				}
				
				
				var span2 = document.createElement('button'); //1、创建元素
				span2.style.width = '150px'
				span2.style.height = '30px'
				span2.style.position = 'fixed'
				span2.style.bottom = '0'
				span2.style.right = '0'
				span2.style.backgroundColor = 'orange'
				span2.style.color = 'black'
				span2.style.textAlign = 'center'
				span2.style.lineHeight = '30px'
				span2.style.zIndex = '20000'
				span2.innerHTML='下载';
				document.body.appendChild(span2)
				span2.onclick = function(){
					console.log("点击了下载")
					if(timer){
						alert("正在自动提取中...")
						return
					}
					if(nameList.length < 1){
						alert("没有可下载的粉丝信息")
						return
					}
					//先转化json
					var arrData = typeof nameList != 'object' ? JSON.parse(nameList) : nameList;
					var row = "<tr>";
					//设置表头
					var keys = Object.keys(nameList[0]);
					keys.forEach(function (item) {
					    row += "<td>" + item + '</td>';
					});
					//换行
					excel += row + "</tr>";
					//设置数据
					for (var i = 0; i < arrData.length; i++) {
						row = "<tr>";
					    for (var index in arrData[i]) {
					        row += '<td>' + arrData[i][index] + '</td>';
					    }
					    excel += row + "</tr>";
					}
					excel += "</table>";
					var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
					excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
					excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
					excelFile += '; charset=UTF-8">';
					excelFile += "<head>";
					excelFile += "<!--[if gte mso 9]>";
					excelFile += "<xml>";
					excelFile += "<x:ExcelWorkbook>";
					excelFile += "<x:ExcelWorksheets>";
					excelFile += "<x:ExcelWorksheet>";
					excelFile += "<x:Name>";
					excelFile += "{worksheet}";
					excelFile += "</x:Name>";
					excelFile += "<x:WorksheetOptions>";
					excelFile += "<x:DisplayGridlines/>";
					excelFile += "</x:WorksheetOptions>";
					excelFile += "</x:ExcelWorksheet>";
					excelFile += "</x:ExcelWorksheets>";
					excelFile += "</x:ExcelWorkbook>";
					excelFile += "</xml>";
					excelFile += "<![endif]-->";
					excelFile += "</head>";
					excelFile += "<body>";
					excelFile += excel;
					excelFile += "</body>";
					excelFile += "</html>";
					
					var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
					
					var link = document.createElement("a");
					link.href = uri;
					
					link.style = "visibility:hidden";
					link.download = "头条粉丝信息.xls";
					
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
				
			    // Your code here...
			})();