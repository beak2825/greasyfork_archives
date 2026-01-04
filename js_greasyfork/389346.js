// ==UserScript==
// @name         300英雄战绩网功能增强
// @namespace    http://github.com/qianjiachun
// @version      0.1
// @description  访问战绩网显示更多数据
// @author       小淳
// @match        http://300report.jumpw.com/*
// @grant        none
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/389346/300%E8%8B%B1%E9%9B%84%E6%88%98%E7%BB%A9%E7%BD%91%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/389346/300%E8%8B%B1%E9%9B%84%E6%88%98%E7%BB%A9%E7%BD%91%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==







let ELOArr = [];
let winMoney = 0;
let loseMoney = 0;
let winAveELO = 0;
let loseAveELO = 0;

function showMatchData(id) {
	$.get("http://300report.jumpw.com/api/getmatch?id=" + id,function(ret){
		let data = eval("(" + ret + ")");
		let winSide = data.Match.WinSide;
		let loseSide = data.Match.LoseSide;
		let windiv = document.createElement("div");
		let losediv = document.createElement("div");
		let allMoney = document.getElementsByClassName("span_bx");
		let j = 0;
		ELOArr = [];
		for (let i = 0; i < winSide.length; i++) {
			ELOArr.push(winSide[i].ELO);
			winAveELO += Number(winSide[i].ELO);
			winMoney = winMoney + Number(winSide[i].TotalMoney);
		}
		for (let i = 0; i < loseSide.length; i++) {
			ELOArr.push(loseSide[i].ELO);
			loseAveELO += Number(loseSide[i].ELO);
			loseMoney = loseMoney + Number(loseSide[i].TotalMoney);
		}
		
		winAveELO = Math.floor(winAveELO / winSide.length);
		loseAveELO = Math.floor(loseAveELO / loseSide.length);
		
		windiv.innerHTML = "总经济:" + String(winMoney) + "    平均团分:" + String(winAveELO);
		losediv.innerHTML = "总经济:" + String(loseMoney) + "    平均团分:" + String(loseAveELO);
		
		//总经济
		allMoney[0].insertBefore(windiv,allMoney[0].childNodes[1])
		allMoney[1].insertBefore(losediv,allMoney[1].childNodes[1])
		
		let tr = document.querySelectorAll("table>tbody tr");
		
		for (let i = 0; i < tr.length; i++) {
			if (i == 0 || i == 8) {
				tr[i].innerHTML += "<th>" + "团分" + "</th>";
				let th = tr[i].querySelectorAll("th");
				if (i == 0) {
					for (let k = 0; k < th.length; k++) {
						
						th[k].innerHTML = "<a href='javascript:void(0);' onclick='sortTable(\"winTable\"," + String(k) + ",\"int\")'" + ">" + th[k].innerHTML + "</a>"
						//th[k].innerHTML = "<a href='javascript:void(0);' onclick='haha()'>" + th[k].innerHTML + "</a>"
					}
				} else{
					for (let k = 0; k < th.length; k++) {
						th[k].innerHTML = "<a href='javascript:void(0);' onclick='sortTable(\"loseTable\"," + String(k) + ",\"int\")'" + ">" + th[k].innerHTML + "</a>"
						//th[k].innerHTML = "<a href='javascript:void(0);' onclick='haha()'>" + th[k].innerHTML + "</a>"
					}
				}
				
			}else {
				tr[i].innerHTML += "<td style='width:80px;'>" + ELOArr[j] + "</td>";
				j++;
			}
		}
		j = 0;
	  });
	  formatEquImg();
	  formatSkillImg();
}

function addTableID() {
	let table = document.getElementsByClassName("datatable");
	table[0].id = "winTable";
	table[1].id = "loseTable";
}

function formatEquImg() {
	let tr = document.querySelectorAll("table>tbody tr");
	let newHTML = "";
	for (let i = 0; i < tr.length; i++) {
		let td = tr[i].querySelectorAll("td");
		for (let i = 0; i < td.length; i++) {
			td[i].style.height = "70px"
		}
		if (td.length > 10) {
			let imgs = td[9].querySelectorAll("img");
			for (let j = 0; j < imgs.length; j++) {
				if (j == 2) {
					
					newHTML += imgs[j].outerHTML + "<br />";
				} else{
					newHTML += imgs[j].outerHTML;
				}
				
			}
			tr[i].querySelectorAll("td")[9].innerHTML = newHTML;
		}
		newHTML = "";
	}
	
}

function formatSkillImg() {
	let tr = document.querySelectorAll("table>tbody tr");
	let newHTML = "";
	for (let i = 0; i < tr.length; i++) {
		let td = tr[i].querySelectorAll("td");
		for (let i = 0; i < td.length; i++) {
			td[i].style.height = "70px"
		}
		if (td.length > 9) {
			let imgs = td[8].querySelectorAll("img");
			for (let j = 0; j < imgs.length; j++) {
				if (j == 0) {
					
					newHTML += imgs[j].outerHTML + "<br />";
				} else{
					newHTML += imgs[j].outerHTML;
				}
				
			}
			tr[i].querySelectorAll("td")[8].innerHTML = newHTML;
		}
		newHTML = "";
	}
	
}

(function(){
	window.sortTable = sortTable;
	
	addTableID();
	
	let url = window.location.href;
	url = url.substring(url.indexOf("com/")+4);
	if (url.indexOf("list.html") != -1) {
		//为列表
		//还没做 嘤嘤嘤QwQ
	} else{
		//为对局详情
		showMatchData(url.substring(url.indexOf("id=")+3));
		
	}
	
})()



///////////模块
function sortTable(sTableId, iCol, sDataType) 
{ 
    var oTable = document.getElementById(sTableId);//获得表
    var oTBody = oTable.tBodies[0];//获得放数据的body,因为该表格只有一个tbody,所以直接用[0]
    var colRows = oTBody.rows;//获得tbody里所有的tr
    var aTRs = new Array();//声明一个数组
    for(var i = 1; i < colRows .length; i++) 
    { 
         aTRs[i] = colRows[i];//将tr依次放入数组中;
    } 
    if(oTable.sortCol == iCol) 
    { 
         //aTRs.reverse();//如果当前要排的列和上次排的列是一样的,就直接逆向排序;也就是说连着对一列点两次,就会进行升序,降序的转换.
    } 
    else 
    { 
         aTRs.sort(getSortFunction(iCol, sDataType));//排序,并且传入一个获得到的比较函数;
		 aTRs.reverse();
    } 
   
    var oFragement = document.createDocumentFragment();//创建文档碎片,用来存放排好的tr
    for(var i = 1; i < aTRs.length; i++) 
    { 
         oFragement.appendChild(aTRs[i]);//将tr绑定到碎片上.
    } 
    oTBody.appendChild(oFragement);//将碎片绑定在表格上
    oTable.sortCol = iCol;//记住当前列,这个可以用来判断是对数组进行反向排序还是重新按列排;
} 
function getSortFunction(iCol, sDataType) 
{ 
    return function compareTRs(oTR1, oTR2){ 
       var vValue1, vValue2; 
       if(oTR1.cells[iCol].getAttribute("value")) 
       { 
            vValue1 = convert(oTR1.cells[iCol].getAttribute("value"), sDataType); 
            vValue2 = convert(oTR2.cells[iCol].getAttribute("value"), sDataType); 
       } 
       else 
       { 
            vValue1 = convert(oTR1.cells[iCol].firstChild.nodeValue, sDataType) 
            vValue2 = convert(oTR2.cells[iCol].firstChild.nodeValue, sDataType) 
       } 
       if(vValue1 < vValue2) 
       { 
            return -1; 
       } 
       else if(vValue1 > vValue2) 
       { 
            return 1; 
       } 
       else 
       { 
            return 0; 
       } 
    } 
} 
function convert(sValue, sDataType) 
{ 
    switch(sDataType) 
    { 
          case "int": 
             return parseInt(sValue); 
          case "float": 
             return parseFloat(sValue); 
          case "date": 
             return new Date(Date.parse(sValue)); 
          default: 
             return sValue; 
    } 
} 
