// ==UserScript==
// @name         图书馆抢座位2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  图书馆抢座位!
// @author       LXY
// @match       https://libic.sicnu.edu.cn/ClientWeb/xcus/ic2/Default.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432550/%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%8A%A2%E5%BA%A7%E4%BD%8D20.user.js
// @updateURL https://update.greasyfork.org/scripts/432550/%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%8A%A2%E5%BA%A7%E4%BD%8D20.meta.js
// ==/UserScript==

var seatObj ={"A1001":"102171940","A1002":"102171941","A1003":"102171942","A1004":"102171943","A1005":"102171944","A1006":"102171945","A1007":"102171946","A1008":"102171947","A1009":"102171948","A1010":"102171949","A1011":"102171950","A1012":"102171951","A1013":"102171952","A1014":"102171953","A1015":"102171954","A1016":"102171955","A1017":"102171956","A1018":"102171957","A1019":"102171958","A1020":"102171959","A1021":"102171960","A1022":"102171961","A1023":"102171962","A1024":"102171963","A1025":"102171964","A1026":"102171965","A1027":"102171966","A1028":"102171967","A1029":"102171968","A1030":"102171969","A1031":"102171970","A1032":"102171971","A1033":"102171972","A1034":"102171973","A1035":"102171974","A1036":"102171975"};

function traversal(){
    //console.log("进来了")
    var times=parseInt(document.getElementById("timesi").innerText);
    document.getElementById("timesi").innerText=times+1;
	document.getElementById("seati").innerText=1;
	var seatkey= Object.keys(seatObj);
    var seati;
	for(var i=1;i<=9;i++){
        seati=times*9+i-1;
		document.getElementById("seat"+i).innerText=seatkey[times*9+i-1];
	}
}




function charge(){		
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
    var i=document.getElementById("seati").innerText;
    var active=document.getElementById("active");
    var textn;
//console.log("进来了");

    if(xhr.responseText.indexOf("要到")>1){
    console.log("时间还没到！"+new Date().toLocaleTimeString('cn',{hour12:false}));
    active.innerHTML = "";
    textn = document.createTextNode("时间还没到:"+new Date().toLocaleTimeString('cn',{hour12:false}))
    active.appendChild(textn);
   }else if(xhr.responseText.indexOf("已有")>1){
    active.innerHTML = "";
    textn = document.createTextNode("已有预约成功")
    active.appendChild(textn);
    location.reload();

    //clearInterval(interval);
   }else if(xhr.responseText.indexOf("成功")>1){
    console.log("预约成功了！");
    document.getElementById("seat"+i).innerText+="预约成功";
    active.innerHTML = "";
    textn = document.createTextNode("预约成功")
    active.appendChild(textn);
    location.reload();


  }else if(xhr.responseText.indexOf("未登录")>1){
  	active.innerHTML = "";
   textn = document.createTextNode("你未登录！")
   active.appendChild(textn);
   pro.d.lg.login();
   clearInterval(interval);
  }else if(xhr.responseText.indexOf("CONFLICT")>1){
   document.getElementById("seat"+i).innerText="冲突";
   if(i==9){
   active.innerHTML = "";
   textn = document.createTextNode("遍历预约中ing")
   active.appendChild(textn);
   traversal();
   return 0;
   }
   document.getElementById("seati").innerText=++i;
   console.log("冲突！");
  }else{
      var obj = JSON.parse(xhr.responseText);
      location.reload();
      alert(obj["msg"]);

  }

   }
 
   xhr.onerror = function () {
    console.log("请求出错");
   }
 
   // 发送异步 GET 请求
    xhr.open("GET",getURL(),true);
    xhr.send();
}





var Shell = document.createElement("DIV");
	Shell.id = "Shell";
	Shell.style.position = "absolute";
	Shell.style.left = "200px";
	Shell.style.top = "100px";
    Shell.style.fontSize = "20px";
	Shell.style.width = "width:fit-content";
	Shell.style.height = "width:fit-content";
	Shell.style.textAlign = "center";
	Shell.style.zIndex = "10000";
	Shell.style.paddingLeft="10px";
	Shell.style.paddingRight="10px";
	//shield.style.padding="10px";
	Shell.style.margin = "10px";
	Shell.style.background = "#333";
	Shell.style.color="#fff";
	var strHtml = "<table border=\"1\">   <tr> <td id=\"close\"  colspan=\"2\"  style=\"color:#f40\";>点击这里关闭本窗口</td>    </tr>  <tr> <td id=\"seati\" style=\"display:none\" >1</td>  <td id=\"timesi\"  style=\"display:none\" >0</td>    </tr>  <tr>        <td>日期：</td>        <td id=\"date\"  contentEditable=\"true\">2021-"+(new Date().getMonth()+1)+"-"+(new Date().getDate()+1)+"</td>    </tr>    <tr>        <td>开始时间：</td>        <td id=\"start\" contentEditable=\"true\" >07:00</td>    </tr>       <tr>        <td>结束时间：</td>        <td id=\"end\"  contentEditable=\"true\">22:00</td>    </tr>     </tr>      <tr>        <td>候选座位1：</td>        <td   id=\"seat1\"  contentEditable=\"true\">A1009</td>    </tr>      <tr>        <td>候选座位2：</td>        <td  id=\"seat2\"  contentEditable=\"true\">A1036</td>    </tr>    <tr>        <td>候选座位3：</td>        <td id=\"seat3\"  contentEditable=\"true\">A1035</td>    </tr>      <tr>        <td>候选座位4：</td>        <td id=\"seat4\" contentEditable=\"true\"> A1010</td>    </tr>      <tr>        <td>候选座位5：</td>        <td id=\"seat5\" contentEditable=\"true\"> A1008</td>    </tr>     <tr>        <td>候选座位6：</td>        <td id=\"seat6\"  contentEditable=\"true\"> A1011</td>    </tr>     <tr>        <td>候选座位7：</td>        <td id=\"seat7\"  contentEditable=\"true\"> A1007</td>    </tr>     <tr>        <td>候选座位8：</td>        <td id=\"seat8\"  contentEditable=\"true\"> A1035</td>    </tr>    <tr>        <td>候选座位9：</td>        <td id=\"seat9\"  contentEditable=\"true\"> A1033</td>    </tr>    <tr>        <td id=\"active\"  colspan=\"2\"   text_align=\"center\"  style=\"color:#f40\" >   </td>    </tr></table>";
	Shell.innerHTML = strHtml;
	document.body.appendChild(Shell);
	var active=document.getElementById("active");
	var textn = document.createTextNode("冲鸭! 点击开始抢座位！")
	textn.id = "textn";
	active.appendChild(textn);

  var usercenter=document.getElementById("user_center");
  if(document.getElementsByClassName("acc_info_id")[0].textContent!=""){
    usercenter.click();
  }else {
    pro.d.lg.login();
  }


  active.onclick = function (e) {
    if(check()) {
        var interval = setInterval(charge,200);
        active.style.pointerEvents="none";
        textn.nodeValue="正在抢座";
        e.stopPropagation();//阻止事件冒泡
    }
  }

  var closebtn=document.getElementById("close");
  closebtn.onclick =function(){
    Shell.parentNode.removeChild(Shell);
  }

 function getURL(){
 var i=document.getElementById("seati").innerText;
var date=document.getElementById("date").innerText;
var start=document.getElementById("start").innerText;
var end=document.getElementById("end").innerText;
var seat=document.getElementById("seat"+i).innerText;
console.log(seat);
var url=" https://libic.sicnu.edu.cn/ClientWeb/pro/ajax/reserve.aspx?dialogid=&dev_id="+seatObj[seat]+"&lab_id=&kind_id=&room_id=&type=dev&prop=&test_id=&term=&number=&classkind=&test_name=&start="+date+"+"+start.replace(/:|：/, "%3A")+"&end="+date+"+"+end.replace(/:|：/, "%3A")+"&up_file=&memo=&act=set_resv&_="+Date.now();
console.log(url);
return url;

 }





function check(){

	var seatkey= Object.keys(seatObj);
	for(var i=1;i<=9;i++){
		if(seatkey.indexOf(document.getElementById("seat"+i).innerText)<0){
           document.getElementById("seat"+i).innerText+="不开放";
			return 0;
		}
	}
return 1;

}
