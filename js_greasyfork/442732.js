// ==UserScript==
// @name               重庆工商大学图书馆占座
// @name:en            CTBU-Lib-Seat
// @description:zh-CN  CTBU图书馆抢座
// @description:en     CTBU Lib Seat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Hugh&Hazy
// @match       http://ic.ctbu.edu.cn/clientweb/xcus/ic2/Default.aspx
// @match       http://ic.ctbu.edu.cn/ClientWeb/xcus/ic2/Default.aspx
// @grant        none
// @license      GPL-3.0 License
// @description CTBU图书馆抢座
// @downloadURL https://update.greasyfork.org/scripts/442732/%E9%87%8D%E5%BA%86%E5%B7%A5%E5%95%86%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8D%A0%E5%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/442732/%E9%87%8D%E5%BA%86%E5%B7%A5%E5%95%86%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8D%A0%E5%BA%A7.meta.js
// ==/UserScript==

var seatObj ={"5F001":"100455857","5F002":"100455858","5F003":"100455859","5F004":"100455860","5F005":"100455861","5F006":"100455862","5F007":"100455863","5F008":"100455864","5F009":"100455865","5F010":"100455866","5F011":"100455867","5F012":"100455868","5F013":"100455869","5F014":"100455870","5F015":"100455871","5F016":"100455872","5F017":"100455873","5F018":"100455874","5F019":"100455875","5F020":"100455876","5F021":"100455877","5F022":"100455878","5F023":"100455879","5F024":"100455880","5F025":"100455881","5F026":"100455882","5F027":"100455883","5F028":"100455884","5F029":"100455885","5F030":"100455886","5F031":"100455887","5F032":"100455888","5F033":"100455889","5F034":"100455890","5F035":"100455891","5F036":"100455892","5F037":"100455893","5F038":"100455894","5F039":"100455895","5F040":"100455896","5F041":"100455897","5F042":"100455898","5F043":"100455899","5F044":"100455900","5F045":"100455901","5F046":"100455902","5F047":"100455903","5F048":"100455904","5F049":"100455905","5F050":"100455906","5F051":"100455907","5F052":"100455908","5F053":"100455909","5F054":"100455910","5F055":"100455911","5F056":"100455912","5F057":"100455913","5F058":"100455914","5F059":"100455915","5F060":"100455916","5F061":"100455917","5F062":"100455918","5F063":"100455919","5F064":"100455920","5F065":"100455921","5F066":"100455922","5F067":"100455923","5F068":"100455924","5F069":"100455925","5F070":"100455926","5F071":"100455927","5F072":"100455928","5F073":"100455929","5F074":"100455930","5F075":"100455931","5F076":"100455932","5F077":"100455933","5F078":"100455934","5F079":"100455935","5F080":"100455936","5F081":"100455937","5F082":"100455938","5F083":"100455939","5F084":"100455940","5F085":"100455941","5F086":"100455942","5F087":"100455943","5F088":"100455944","5F089":"100455945","5F090":"100455946","5F091":"100455947","5F092":"100455948","5F093":"100455949","5F094":"100455950","5F095":"100455951","5F096":"100455952","5F097":"100455953","5F098":"100455954","5F099":"100455955","5F100":"100455956","5F101":"100455957","5F102":"100455958","5F103":"100455959","5F104":"100455960","5F105":"100455961","5F106":"100455962","5F107":"100455963","5F108":"100455964","5F109":"100455965","5F110":"100455966","5F111":"100455967","5F112":"100455968","5F113":"100455969","5F114":"100455970","5F115":"100455971","5F116":"100455972","5F117":"100455973","5F118":"100455974","5F119":"100455975","5F120":"100455976","5F121":"100455977","5F122":"100455978","5F123":"100455979","5F124":"100455980","5F125":"100455981","5F126":"100455982","5F127":"100455983","5F128":"100455984","5F129":"100455985","5F130":"100455986","5F131":"100455987","5F132":"100455988","5F133":"100455989","5F134":"100455990","5F135":"100455991","5F136":"100455992","5F137":"100455993","5F138":"100455994","5F139":"100455995","5F140":"100455996","5F141":"100455997","5F142":"100455998","5F143":"100455999","5F144":"100456000","5F145":"100456001","5F146":"100456002","5F147":"100456003","5F148":"100456004","5F149":"100456005","5F150":"100456006","5F151":"100456007","5F152":"100456008","5F153":"100456009","5F154":"100456010","5F155":"100456011","5F156":"100456012","5F157":"100456013","5F158":"100456014","5F159":"100456015","5F160":"100456016","5F161":"100456017","5F162":"100456018","5F163":"100456019","5F164":"100456020","5F165":"100456021","5F166":"100456022","5F167":"100456023","5F168":"100456024","5F169":"100456025","5F170":"100456026","5F171":"100456027","5F172":"100456028","5F173":"100456029","5F174":"100456030","5F175":"100456031","5F176":"100456032","5F177":"100456033","5F178":"100456034","5F179":"100456035","5F180":"100456036","5F181":"100456037","5F182":"100456038","5F183":"100456039","5F184":"100456040","5F185":"100456041","5F186":"100456042","5F187":"100456043","5F188":"100456044","5F189":"100456045","5F190":"100456046","5F191":"100456047","5F192":"100456048","5F193":"100456049","5F194":"100456050","5F195":"100456051","5F196":"100456052","5F197":"100456053","5F198":"100456054","5F199":"100456055","5F200":"100456056","5F201":"100456057","5F202":"100456058","5F203":"100456059","5F204":"100456060","5F205":"100456061","5F206":"100456062","5F207":"100456063","5F208":"100456064","5F209":"100456065","5F210":"100456066","5F211":"100456067","5F212":"100456068","5F213":"100456069","5F214":"100456070","5F215":"100456071","5F216":"100456072","5F217":"100456073","5F218":"100456074","5F219":"100456075","5F220":"100456076","5F221":"100456077","5F222":"100456078","5F223":"100456079","5F224":"100456080","5F225":"100456081","5F226":"100456082","5F227":"100456083","5F228":"100456084"};

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

   // 发送异步 GET 
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
	var strHtml = "<table border=\"1\">   <tr> <td id=\"close\"  colspan=\"2\"  style=\"color:#f40\";>点击关闭窗口</td>    </tr>  <tr> <td id=\"seati\" style=\"display:none\" >1</td>  <td id=\"timesi\"  style=\"display:none\" >0</td>    </tr>  <tr>        <td>日期：</td>        <td id=\"date\"  contentEditable=\"true\">2021-"+(new Date().getMonth()+1)+"-"+(new Date().getDate()+1)+"</td>    </tr>    <tr>        <td>开始时间：</td>        <td id=\"start\" contentEditable=\"true\" >07:20</td>    </tr>       <tr>        <td>结束时间：</td>        <td id=\"end\"  contentEditable=\"true\">22:00</td>    </tr>     </tr>      <tr>        <td>候选座位1：</td>        <td   id=\"seat1\"  contentEditable=\"true\">5F187</td>    </tr>      <tr>        <td>候选座位2：</td>        <td  id=\"seat2\"  contentEditable=\"true\">5F188</td>    </tr>    <tr>        <td>候选座位3：</td>        <td id=\"seat3\"  contentEditable=\"true\">5F189</td>    </tr>      <tr>        <td>候选座位4：</td>        <td id=\"seat4\" contentEditable=\"true\"> 5F190</td>    </tr>      <tr>        <td>候选座位5：</td>        <td id=\"seat5\" contentEditable=\"true\"> 5F191</td>    </tr>     <tr>        <td>候选座位6：</td>        <td id=\"seat6\"  contentEditable=\"true\"> 5F192</td>    </tr>     <tr>        <td>候选座位7：</td>        <td id=\"seat7\"  contentEditable=\"true\"> 5F193</td>    </tr>     <tr>        <td>候选座位8：</td>        <td id=\"seat8\"  contentEditable=\"true\"> 5F194</td>    </tr>    <tr>        <td>候选座位9：</td>        <td id=\"seat9\"  contentEditable=\"true\"> 5F195</td>    </tr>    <tr>        <td id=\"active\"  colspan=\"2\"   text_align=\"center\"  style=\"color:#f40\" >   </td>    </tr></table>";
	Shell.innerHTML = strHtml;
	document.body.appendChild(Shell);
	var active=document.getElementById("active");
	var textn = document.createTextNode("Grab a seat")
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
var url=" http://ic.ctbu.edu.cn/ClientWeb/pro/ajax/reserve.aspx?dialogid=&dev_id="+seatObj[seat]+"&lab_id=&kind_id=&room_id=&type=dev&prop=&test_id=&term=&number=&classkind=&test_name=&start="+date+"+"+start.replace(/:|：/, "%3A")+"&end="+date+"+"+end.replace(/:|：/, "%3A")+"&up_file=&memo=&act=set_resv&_="+Date.now();
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
