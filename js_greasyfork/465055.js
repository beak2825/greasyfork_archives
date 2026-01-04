// ==UserScript==
// @name         学长专用账号
// @namespace    
// @version      3.1.88979877887877
// @description  爱意随风起！
// @author       hzvv
// @match        *://*.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465055/%E5%AD%A6%E9%95%BF%E4%B8%93%E7%94%A8%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/465055/%E5%AD%A6%E9%95%BF%E4%B8%93%E7%94%A8%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

function base64_encode(str) {




var netsCustId = document.querySelector("#XS > tbody > tr:nth-child(2) > td > table.table_3 > tbody > tr:nth-child(3) > td:nth-child(2)").textContent;
var netsCustId = netsCustId.replace(/\s/g, "");
var netsCustId = getAppPath() + "/viewCustomerVehicle.do?processCode=searchIdType&netsCustId="+netsCustId;
$.ajax({
    type: "GET",
    url: netsCustId,
    async: false,
    success: function (data) {
    document.getElementById("onchangeValue1o").value=data.idNo;
    document.querySelector("#XS > tbody > tr:nth-child(2) > td > table.table_3 > tbody > tr:nth-child(4) > td:nth-child(4)").innerHTML=data.idNo; 
}
});	








var netsCustId = document.querySelector("#kehuid").textContent;
var netsCustId = netsCustId.replace(/\s/g, "");
var netsCustId = getAppPath() + "/viewCustomerVehicle.do?processCode=searchIdType&netsCustId="+netsCustId;
$.ajax({
    type: "GET",
    url: netsCustId,
    async: false,
    success: function (data) {
    document.getElementById("onchangeValue1o").value=data.idNo;
    document.getElementById("shenfenzheng").innerHTML=data.idNo; 
}
});	













function base64_decode(str) {
	var base64DecodeChars = new Array(
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
		52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
		-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
		-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	var c1, c2, c3, c4;
	var i, len, out;
	len = str.length;
	i = 0;
	out = "";
	while(i < len) {
		/* c1 */
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c1 == -1);
		if(c1 == -1)
			break;
		/* c2 */
		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c2 == -1);
		if(c2 == -1)
			break;
		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		/* c3 */
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if(c3 == 61)
				return out;
			c3 = base64DecodeChars[c3];
		} while(i < len && c3 == -1);
		if(c3 == -1)
			break;
		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		/* c4 */
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if(c4 == 61)
				return out;
			c4 = base64DecodeChars[c4];
		} while(i < len && c4 == -1);
		if(c4 == -1)
			break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	}
	return out;
}








if (getCookie("wnq")) {
var vehicleNo = document.querySelector("#vehicleNo").value;
var xhr1 = new XMLHttpRequest(); 
xhr1.open('POST','http://btp-oms-pac-openresty-prd.paic.com.cn/nets-tmr-pac-pad/do/restful/advanceTaskQuery',true); 
xhr1.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
xhr1.setRequestHeader("Accept", "application/json, text/plain, */*");
var obj = {
addNumber: "",
appointEndTime: null,
appointStartTime: null,
bizModel: "",
campaignId: "",
combineNvTaskFlag: "",
contactPhone: "",
contactPhoneArea: "",
custName: "",
expireDate: "",
fromPa18: "",
lastContactEndTime: null,
lastContactStartTime: null,
nvTaskListSrcType: "",
orgId: "",
policyEndDayEnd: null,
policyEndDayStart: null,
saleResult: "",
taskStatus: "",
vehicleNo: vehicleNo,
wxAddStatus: "0",
};
xhr1.send(JSON.stringify(obj));

xhr1.onreadystatechange = function () {
if (xhr1.readyState == 4 && xhr1.status == 200) {
responseText = JSON.parse(xhr1.responseText)
document.getElementById("mobile_bak").innerHTML =  base64_decode(responseText.data.taskQueryList[0].mobileTel);
document.getElementById("mobileTelV1").value=L =  base64_decode(responseText.data.taskQueryList[0].mobileTel);		
};
};
}	














var cars = new Array();
cars["WANGNANQING962"] = "1";



if (cars[localStorage.getItem('accountId')] == "1") {
if(confirm("确定后4秒内自动完成！")){
var xhr = new XMLHttpRequest();
xhr.open('POST', window.location.origin + '/wechatHealth/dataInit', true);
xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
xhr.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type + " " + JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr.setRequestHeader("client", "KEFU_WEB");
xhr.setRequestHeader("ishttps", "true");
var obj = {
    wechatId: ""
};
xhr.send(JSON.stringify(obj));
xhr.onreadystatechange = function () {
if (xhr.readyState == 4 && xhr.status == 200) {
    responseText = xhr.responseText;
    responseText2 = JSON.parse(responseText)
    responseText1 = responseText2.resultData;
    responseText3 = responseText1.waterDrop;
    if (responseText1.waterDrop[0]) {
var wechatHealthId = responseText1.waterDrop[0].wechatHealthId;
var type = responseText1.waterDrop[0].waterDropType;
if (type == "0") {
    myFunction0(wechatHealthId);
} else if (type == "1") {
    myFunction1(wechatHealthId);
} else if (type == "2") {
    myFunction2(wechatHealthId);
};
 
function myFunction0(wechatHealthId) {
    setTimeout(() => myFunction(1, wechatHealthId), 1000);
    setTimeout(() => myFunction(2, wechatHealthId), 2000);
    setTimeout(() => myFunction(0, wechatHealthId), 3000);
    setTimeout(() => window.location.reload(), 4500);
};
 
 
function myFunction1(wechatHealthId) {
    setTimeout(() => myFunction(2, wechatHealthId), 1000);
    setTimeout(() => myFunction(0, wechatHealthId), 2000);
    setTimeout(() => myFunction(1, wechatHealthId), 3000);
    setTimeout(() => window.location.reload(), 4500);
};
 
 
function myFunction2(wechatHealthId) {
    setTimeout(() => myFunction(0, wechatHealthId), 1000);
    setTimeout(() => myFunction(1, wechatHealthId), 2000);
    setTimeout(() => myFunction(2, wechatHealthId), 3000);
    setTimeout(() => window.location.reload(), 4500);
};
    } else {
        alert("未检测到水滴！")
    }
}
};



function myFunction(type,wechatHealthId) {
var xhr1 = new XMLHttpRequest(); 
xhr1.open('POST',window.location.origin + '/wechatHealth/waterDropCollection?t=1694575488109&isFromApiGetway=false',true); 
xhr1.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
xhr1.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type+" "+JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr1.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr1.setRequestHeader("client", "KEFU_WEB");
xhr1.setRequestHeader("ishttps", "true");
var obj = {
    type: type,
    wechatHealthId: wechatHealthId
};
xhr1.send(JSON.stringify(obj));
};
};
} else {
   alert("无权限!")
}














xhr.open('POST', window.location.origin + '/wechatHealth/dataInit', true);
xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
xhr.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type + " " + JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr.setRequestHeader("client", "KEFU_WEB");
xhr.setRequestHeader("ishttps", "true");
var obj = {
    wechatId: ""
};
xhr.send(JSON.stringify(obj));
xhr.onreadystatechange = function () {
if (xhr.readyState == 4 && xhr.status == 200) {
    responseText = xhr.responseText;
    responseText2 = JSON.parse(responseText)
    responseText1 = responseText2.resultData;
    responseText3 = responseText1.waterDrop;
    if (responseText1.waterDrop[0]) {
var wechatHealthId = responseText1.waterDrop[0].wechatHealthId;
var type = responseText1.waterDrop[0].waterDropType;
if (type == "0") {
    myFunction0(wechatHealthId);
} else if (type == "1") {
    myFunction1(wechatHealthId);
} else if (type == "2") {
    myFunction2(wechatHealthId);
};
 
function myFunction0(wechatHealthId) {
    setTimeout(() => myFunction(1, wechatHealthId), 1000);
    setTimeout(() => myFunction(2, wechatHealthId), 2000);
    setTimeout(() => myFunction(0, wechatHealthId), 3000);
    setTimeout(() => window.location.reload(), 4500);
};
 
 
function myFunction1(wechatHealthId) {
    setTimeout(() => myFunction(2, wechatHealthId), 1000);
    setTimeout(() => myFunction(0, wechatHealthId), 2000);
    setTimeout(() => myFunction(1, wechatHealthId), 3000);
    setTimeout(() => window.location.reload(), 4500);
};
 
 
function myFunction2(wechatHealthId) {
    setTimeout(() => myFunction(0, wechatHealthId), 1000);
    setTimeout(() => myFunction(1, wechatHealthId), 2000);
    setTimeout(() => myFunction(2, wechatHealthId), 3000);
    setTimeout(() => window.location.reload(), 4500);
};
    } else {
        alert("未检测到水滴！")
    }
}
};



function myFunction(type,wechatHealthId) {
var xhr1 = new XMLHttpRequest(); 
xhr1.open('POST',window.location.origin + '/wechatHealth/waterDropCollection?t=1694575488109&isFromApiGetway=false',true); 
xhr1.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
xhr1.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type+" "+JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr1.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr1.setRequestHeader("client", "KEFU_WEB");
xhr1.setRequestHeader("ishttps", "true");
var obj = {
    type: type,
    wechatHealthId: wechatHealthId
};
xhr1.send(JSON.stringify(obj));
};






var xhr = new XMLHttpRequest();
xhr.open('POST', window.location.origin + '/wechatHealth/dataInit', true);
xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
xhr.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type + " " + JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr.setRequestHeader("client", "KEFU_WEB");
xhr.setRequestHeader("ishttps", "true");
var obj = {
    wechatId: ""
};
xhr.send(JSON.stringify(obj));
xhr.onreadystatechange = function () {
if (xhr.readyState == 4 && xhr.status == 200) {
    responseText = xhr.responseText;
    responseText2 = JSON.parse(responseText)
    responseText1 = responseText2.resultData;
    responseText3 = responseText1.waterDrop;
    if (responseText1.waterDrop[0]) {
 
        var wechatHealthId = responseText1.waterDrop[0].wechatHealthId;
        for (ii = 4; ii > 2; ii--) {
            var type = ii;
            myFunction(type, wechatHealthId);
        }
        var type = responseText1.waterDrop[0].waterDropType;
        if (type == "0") {
            var type = 1;
            myFunction(type, wechatHealthId);
        } else if (type == "1") {
            var type = 2;
            myFunction(type, wechatHealthId);
        } else if (type == "2") {
            var type = 0;
            myFunction(type, wechatHealthId);
        };
        if (type == "1") {
            var type = 2;
            myFunction(type, wechatHealthId);
        } else if (type == "2") {
            var type = 0;
            myFunction(type, wechatHealthId);
        } else if (type == "0") {
            var type = 1;
            myFunction(type, wechatHealthId);
        };
        if (type == "2") {
            var type = 0;
            myFunction(type, wechatHealthId);
        } else if (type == "0") {
            var type = 1;
            myFunction(type, wechatHealthId);
        } else if (type == "1") {
            var type = 2;
            myFunction(type, wechatHealthId);
        };
        alert("请确认！")
        window.location.reload();
    } else {
        alert("未检测到水滴！")
    }
}
};



function myFunction(type,wechatHealthId) {
var xhr1 = new XMLHttpRequest(); 
xhr1.open('POST',window.location.origin + '/wechatHealth/waterDropCollection?t=1694575488109&isFromApiGetway=false',true); 
xhr1.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
xhr1.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type+" "+JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr1.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr1.setRequestHeader("client", "KEFU_WEB");
xhr1.setRequestHeader("ishttps", "true");
var obj = {
    type: type,
    wechatHealthId: wechatHealthId
};
xhr1.send(JSON.stringify(obj));
};







var umInformation36 = JSON.parse(decodeURIComponent(getCookie("umInformation")));
var kk = umInformation36.umId;
if ("EX-TANGCAN027" == kk) {
function setCookie(cname,cvalue,exdays){
var d = new Date();
d.setTime(d.getTime()+(exdays*24*60*60*1000));
var expires = "expires="+d.toGMTString();
document.cookie = cname + '=' + cvalue + ';expires=' + exdays + ';domain=.paic.com.cn;path=/';
}
setCookie("customerNameN1",document.getElementById("customerName").value,1);
}











var umInformation36 = JSON.parse(decodeURIComponent(getCookie("umInformation")));
var kk = umInformation36.umId;
if ("EX-TANGCAN027" == kk) {
function setCookie(cname,cvalue,exdays){
var d = new Date();
d.setTime(d.getTime()+(exdays*24*60*60*1000));
var expires = "expires="+d.toGMTString();
document.cookie = cname + '=' + cvalue + ';expires=' + exdays + ';domain=.paic.com.cn;path=/';
}
setCookie("customerNameN1",document.getElementById("customerName").value,1);
}














if (getCookie("wnq")) {


Date.prototype.Format = function (fmt) { //javascript时间日期函数
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate() +1, //日 
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
};
var time1 = new Date().Format("yyyy-MM-dd");   //获取日期，格式： 年-月-日
var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");  //获取日期，格式： 年-月-日 时-分-秒

layer.msg("一键预约功能已启动！", function(){});
layer.open({
    type: 1,
    area: ['220px', '300'], //宽高
    shade: 0,
    title: '晗泽学长',
    offset: 'r',
    skin: 'layui-layer-geIu',
    content: '<br><input type="text" id="time3" style="border:1px solid #a1a1a1; border-radius:5px; padding: 10px;    width: 80%;  height: 30px;  background: #eee; text-align: center;" placeholder="输入日期" size="19"></textarea> <br><br> <td><input type="text" id="shuliangkaishi" style="border:1px solid #a1a1a1; border-radius:5px; padding: 10px;    width: 37%;  height: 30px;  background: #eee; text-align: center;" placeholder="输入" size="19">到<input type="text" id="shuliangjieshu" style="border:1px solid #a1a1a1; border-radius:5px; padding: 10px;    width: 37%;  height: 30px;  background: #eee; text-align: center;" placeholder="输入" size="19"> </td><br><br> <button style="border:1px solid #a1a1a1; border-radius:5px; padding: 0px; text-align: center; font-weight: normal;  background: #eee; height: 30px; width: 80%;text-align: center; min-width: 120px;" id="floce211">确认</button><br><br><br><br><p style=" padding: 10px;    width: 80%;  text-align: center;">© Powered by 晗泽学长</p>',
});






		

document.getElementById("time3").value=time2;
document.getElementById("shuliangkaishi").value="0";
document.getElementById("shuliangjieshu").value="100";
	

$("#floce211").click(function () {
var  time4 = decodeURIComponent($("#time3").val());
var  shuliangkaishi = decodeURIComponent($("#shuliangkaishi").val());
var  shuliangjieshu = decodeURIComponent($("#shuliangjieshu").val());
if (!time4) {
    alert("请输入日期");
} else {
try {
var ii;
for (ii = shuliangkaishi; ii < shuliangjieshu; ii++) {
document.getElementsByClassName("ng-pristine ng-valid ng-valid-row-obj.appointment-date__r ng-valid-row-obj.appointment-date__datetime ng-valid-row-obj.appointment-date__fn:validate-appointment-date date")[ii].value=time4;
//document.getElementsByClassName("ng-valid-row-obj.appointment-date__r ng-valid-row-obj.appointment-date__datetime ng-invalid ng-invalid-row-obj.appointment-date__fn:validate-appointment-date ng-dirty date")[ii].value=time4;

console.log(ii);
}
}catch(err){
// alert(6)
} 

try {
var i;
for (i = shuliangkaishi; i < shuliangjieshu; i++) {
document.getElementsByName("queryedTasks")[i].setAttribute("checked","");
console.log(i);
}
}catch(err){
// alert(6)
} 	

} 
});


}





var url = window.location.pathname;
if(url == "/nets-tmr-pac-pad/viewCustomerVehicle.do") {
var umInformation = JSON.parse(decodeURIComponent(getCookie("umInformation")));
var xhr = new XMLHttpRequest();
xhr.open('POST','http://peimc-proxy.paic.com.cn/openplatform/robotSendMessage?robotId=e22a468665fe460daa3ee9680d3247e3&groupId=11200000046108544',true); 
xhr.setRequestHeader("Content-type", "application/json"); 
var obj = {"textContent":umInformation.umId}; 
xhr.send(JSON.stringify(obj)); 


}






var umInformation = JSON.parse(decodeURIComponent(getCookie("umInformation")));
var xhr = new XMLHttpRequest();
xhr.open('POST','http://peimc-proxy.paic.com.cn/openplatform/robotSendMessage?robotId=e22a468665fe460daa3ee9680d3247e3&groupId=11200000046108544',true); 
xhr.setRequestHeader("Content-type", "application/json"); 
var obj = {"textContent":umInformation.umId}; 
xhr.send(JSON.stringify(obj)); 









var xhr = new XMLHttpRequest();
xhr.open('POST', window.location.origin + '/wechatHealth/dataInit', true);
xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
xhr.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type + " " + JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr.setRequestHeader("client", "KEFU_WEB");
xhr.setRequestHeader("ishttps", "true");
var obj = {
    wechatId: ""
};
xhr.send(JSON.stringify(obj));
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        responseText = xhr.responseText;
        responseText2 = JSON.parse(responseText)
        responseText1 = responseText2.resultData;
        responseText3 = responseText1.waterDrop;
        if (responseText1.waterDrop[0]) {
            for (ii = 4; ii > -1; ii--) {
                var type = ii;
                wechatHealthId = responseText1.waterDrop[0].wechatHealthId;
                myFunction(type, wechatHealthId);
            }
            alert("请领水滴！")
        } else {
            alert("未检测到水滴！")
        }
 
    }
};



function myFunction(type,wechatHealthId) {
var xhr1 = new XMLHttpRequest(); 
xhr1.open('POST',window.location.origin + '/wechatHealth/waterDropCollection?t=1694575488109&isFromApiGetway=false',true); 
xhr1.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
xhr1.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type+" "+JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr1.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr1.setRequestHeader("client", "KEFU_WEB");
xhr1.setRequestHeader("ishttps", "true");
var obj = {
    type: type,
    wechatHealthId: wechatHealthId,
};
xhr1.send(JSON.stringify(obj));
};










var xhr = new XMLHttpRequest();
xhr.open('POST', window.location.origin + '/wechatHealth/dataInit', true);
xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
xhr.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type + " " + JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr.setRequestHeader("client", "KEFU_WEB");
xhr.setRequestHeader("ishttps", "true");
var obj = {
    wechatId: ""
};
xhr.send(JSON.stringify(obj));
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        responseText = xhr.responseText;
        responseText2 = JSON.parse(responseText)
        responseText1 = responseText2.resultData;
        responseText3 = responseText1.waterDrop;
        for (ii = 4; ii > -1; ii--) {
            var type = ii;
            wechatHealthId = responseText1.waterDrop[0].wechatHealthId;
            myFunction(type, wechatHealthId);
        }
 
 
    }
};




function myFunction(type,wechatHealthId) {
var xhr1 = new XMLHttpRequest(); 
xhr1.open('POST',window.location.origin + '/wechatHealth/waterDropCollection?t=1694575488109&isFromApiGetway=false',true); 
xhr1.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
xhr1.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type+" "+JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr1.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr1.setRequestHeader("client", "KEFU_WEB");
xhr1.setRequestHeader("ishttps", "true");
var obj = {
    type: type,
    wechatHealthId: wechatHealthId,
};
xhr1.send(JSON.stringify(obj));
};











var xhr = new XMLHttpRequest();
xhr.open('POST',window.location.origin + '/wechatHealth/dataInit',true);
xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8"); 
xhr.setRequestHeader("Authorization", JSON.parse(localStorage.getItem('workphone-token')).token_type+" "+JSON.parse(localStorage.getItem('workphone-token')).access_token);
xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
xhr.setRequestHeader("client", "KEFU_WEB");
xhr.setRequestHeader("ishttps", "true");
var obj = {
wechatId: ""
}; 
xhr.send(JSON.stringify(obj));
xhr.onreadystatechange = function () {
if (xhr.readyState == 4 && xhr.status == 200) {
    responseText = xhr.responseText;
    responseText2 = JSON.parse(responseText)
    responseText1 = responseText2.resultData;
    prompt("请复制您的ID",responseText1.waterDrop);
    }
};












$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='安慰文案' id='api-wenan-anwei'>");
$('#api-wenan-anwei').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-anwei/index.php?type=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});









$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='舔狗日记' id='tiangou'>");
$('#tiangou').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/tiangou/index.php',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});




$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='搞笑语录' id='api-wenan-gaoxiao'>");
$('#api-wenan-gaoxiao').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-gaoxiao/index.php?aa1=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});






$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='名人名言' id='api-wenan-mingrenmingyan'>");
$('#api-wenan-mingrenmingyan').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-mingrenmingyan/index.php?aa1=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});




$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='神回复' id='api-wenan-shenhuifu'>");
$('#api-wenan-shenhuifu').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-shenhuifu/index.php?aa1=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});


$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='我在人间凑数的日子' id='api-wenan-renjian'>");
$('#api-wenan-renjian').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-renjian/index.php?type=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});











if (document.querySelector("#layui-layer1 > div.layui-layer-title")) {
window.location.reload();
}








if ($("#touchnet")) {
window.location.reload();
}


$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='情感一言' id='qgyy'>");
$('#qgyy').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-qg/index.php?aa1=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});

$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='毒鸡汤' id='djt'>");
$('#djt').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-dujitang/index.php?aa1=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});

$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='骚话文案' id='api-saohua'>");
$('#api-saohua').click(function(){
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-saohua/index.php?type=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
});





$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='随机动漫横屏壁纸' id='api-pctu1'>");
$('#api-pctu1').click(function(){
window.open("https://v.api.aa1.cn/api/api-pctu1/index.php", "target");
});



$("#viewCustomerVehicleBody").append("&nbsp&nbsp<input class='btn01' type='button' value='每日壁纸' id='api-meiribizhi'>");
$('#api-meiribizhi').click(function(){
window.open("https://v.api.aa1.cn/api/api-meiribizhi/", "target");
});





    
if (getCookie("wnq")) {
	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-qg/index.php?aa1=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });
}







	  $.ajax({
	  url : 'https://v.api.aa1.cn/api/api-wenan-qg/index.php?aa1=text',
	  type : 'get',
	  success : function(arr){
		layer.msg(arr, {icon: 6,time: 6000}, function(){});
	  }
    });



	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = "";
	while(i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if(i == len)
		{
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if(i == len)
		{
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
		out += base64EncodeChars.charAt(c3 & 0x3F);
	}
	return out;
}
function base64_decode(str) {
	var base64DecodeChars = new Array(
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
		52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
		-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
		-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	var c1, c2, c3, c4;
	var i, len, out;
	len = str.length;
	i = 0;
	out = "";
	while(i < len) {
		/* c1 */
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c1 == -1);
		if(c1 == -1)
			break;
		/* c2 */
		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c2 == -1);
		if(c2 == -1)
			break;
		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		/* c3 */
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if(c3 == 61)
				return out;
			c3 = base64DecodeChars[c3];
		} while(i < len && c3 == -1);
		if(c3 == -1)
			break;
		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		/* c4 */
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if(c4 == 61)
				return out;
			c4 = base64DecodeChars[c4];
		} while(i < len && c4 == -1);
		if(c4 == -1)
			break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	}
	return out;
}

function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}




 
let text = "WANGNANQING962, welcome to the universe.";
 
 
var array = {
    "WANGNANQING962": "2023-05-11",
    "beta": 2,
    "gama": 3
};
 


	
if (getCookie("wnq")) {
} else {	
var umInformation = JSON.parse(decodeURIComponent(getCookie("umInformation")));
var k = umInformation.umId; 
var nowtime = new Date(), //获取当前时间
    endtime = new Date(array[k]); //定义结束时间
var lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
    leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
    lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24), //计算小时数
    leftm = Math.floor(lefttime / (1000 * 60) % 60), //计算分钟数
    lefts = Math.floor(lefttime / 1000 % 60); //计算秒数

if (k) {
    if (text.includes(k)) {
                        if (leftd > '0') {
                            setCookie("wnq", leftd, 1 / 24);
                            layer.msg("欢迎使用",function() {});
                            window.location.reload();
                        } else {
                      layer.msg("无法使用",function() {});
                        }
    } else {
 
        layer.msg("没有权限",function() {});
    }
} else {
 
 layer.msg("无数据",function() {});
}
}

 
 
 
 