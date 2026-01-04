// ==UserScript==
// @name         图书馆抢座位
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  图书馆抢座位!
// @author       LXY
// @match       https://10-21-95-57.webvpn.cueb.edu.cn/ClientWeb/xcus/ic2/Default.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432131/%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%8A%A2%E5%BA%A7%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/432131/%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%8A%A2%E5%BA%A7%E4%BD%8D.meta.js
// ==/UserScript==

var seatObj ={"2F002":"100455728","2F004":"100455730","2F006":"100455732","2F008":"100455734","2F010":"100455736","2F012":"100455738","2F014":"100455740","2F016":"100455742","2F017":"100455743","2F019":"100455745","2F021":"100455747","2F023":"100455749","2F025":"100455751","2F027":"100455753","2F029":"100455755","2F031":"100455757","2F033":"100455759","2F035":"100455761","2F037":"100455763","2F039":"100455765","2F041":"100455767","2F043":"100455769","2F045":"100455771","2F047":"100455773","2F049":"100455775","2F051":"100455777","2F053":"100455779","2F055":"100455781","2F057":"100455783","2F059":"100455785","2F061":"100455787","2F063":"100455789","2F065":"100455791","2F067":"100455793","2F069":"100455795","2F071":"100455797","2F073":"100455799","2F075":"100455801","2F077":"100455803","2F079":"100455805","2F081":"100455807","2F083":"100455809","2F085":"100455811","2F087":"100455813","2F089":"100455815","2F091":"100455817","2F093":"100455819","2F095":"100455821","2F097":"100455823","2F099":"100455825","2F101":"100455827","2F103":"100455829","2F105":"100455831","2F107":"100455833","2F109":"100455835","2F111":"100455837","2F113":"100455839","2F115":"100455841","2F117":"100455843","2F119":"100455845","2F121":"100455847","2F123":"100455849","2F125":"100455851","2F127":"100455853","2F129":"100455855","2F131":"100455857","2F133":"100455859","2F135":"100455861","2F137":"100455863","2F139":"100455865","2F141":"100455867","2F143":"100455869","2F145":"100455871","2F147":"100455873","2F149":"100455875","2F151":"100455877","2F153":"100455879","2F155":"100455881","2F157":"100455883","2F159":"100455885","2F161":"100455887","2F163":"100455889","2F165":"100455891","2F167":"114459838","2F169":"114459840","2F171":"114459842","2F173":"114459844","2F175":"114459846","2F177":"114459848"};

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
  }else if(xhr.responseText.indexOf("冲突")>1){
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
	var strHtml = "<table border=\"1\">   <tr> <td id=\"close\"  colspan=\"2\"  style=\"color:#f40\";>点击这里关闭本窗口</td>    </tr>  <tr> <td id=\"seati\" style=\"display:none\" >1</td>  <td id=\"timesi\"  style=\"display:none\" >0</td>    </tr>  <tr>        <td>日期：</td>        <td id=\"date\"  contentEditable=\"true\">2021-"+(new Date().getMonth()+1)+"-"+(new Date().getDate()+1)+"</td>    </tr>    <tr>        <td>开始时间：</td>        <td id=\"start\" contentEditable=\"true\" >09:30</td>    </tr>       <tr>        <td>结束时间：</td>        <td id=\"end\"  contentEditable=\"true\">22:00</td>    </tr>     </tr>      <tr>        <td>候选座位1：</td>        <td   id=\"seat1\"  contentEditable=\"true\">2F149</td>    </tr>      <tr>        <td>候选座位2：</td>        <td  id=\"seat2\"  contentEditable=\"true\">2F151</td>    </tr>    <tr>        <td>候选座位3：</td>        <td id=\"seat3\"  contentEditable=\"true\">2F153</td>    </tr>      <tr>        <td>候选座位4：</td>        <td id=\"seat4\" contentEditable=\"true\">2F155</td>    </tr>      <tr>        <td>候选座位5：</td>        <td id=\"seat5\" contentEditable=\"true\">2F157</td>    </tr>     <tr>        <td>候选座位6：</td>        <td id=\"seat6\"  contentEditable=\"true\">2F159</td>    </tr>     <tr>        <td>候选座位7：</td>        <td id=\"seat7\"  contentEditable=\"true\">2F161</td>    </tr>     <tr>        <td>候选座位8：</td>        <td id=\"seat8\"  contentEditable=\"true\">2F163</td>    </tr>    <tr>        <td>候选座位9：</td>        <td id=\"seat9\"  contentEditable=\"true\">2F165</td>    </tr>    <tr>        <td id=\"active\"  colspan=\"2\"   text_align=\"center\"  style=\"color:#f40\" >   </td>    </tr></table>";
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
var url="https://10-21-95-57.webvpn.cueb.edu.cn/ClientWeb/pro/ajax/reserve.aspx?dialogid=&dev_id="+seatObj[seat]+"&lab_id=&kind_id=&room_id=&type=dev&prop=&test_id=&term=&number=&classkind=&test_name=&start="+date+"+"+start.replace(/:|：/, "%3A")+"&end="+date+"+"+end.replace(/:|：/, "%3A")+"&start_time="+start.replace(/:|：/, "")+"&end_time="+end.replace(/:|：/, "")+"&up_file=&memo=&act=set_resv&_="+Date.now();
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
