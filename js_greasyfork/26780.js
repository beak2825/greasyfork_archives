
// ==UserScript==
// @name           Training Simulator
// @version        1.0
// @description     Training Simulator JavaScript Version
// @author       	太原龙城足球俱乐部（246770）
// @include			http://trophymanager.com/players/*
// @include			https://trophymanager.com/players/*
// @include			https://fb.trophymanager.com/players/*
// @namespace  
// @downloadURL https://update.greasyfork.org/scripts/26780/Training%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/26780/Training%20Simulator.meta.js
// ==/UserScript==



var train = document.getElementsByTagName("div")[60];  


    train.innerHTML+=' <div id="train" >训练模拟：</br>特长：<select size="1" id="sp_select">  <option value="0">力量</option>  <option value="1">耐力</option>  <option value="2" >速度</option>  <option value="3">盯人</option>  <option value="4">抢断</option> <option value="5">工投</option>  <option value="6">站位</option>  <option value="7">传球</option>  <option value="8">传中</option>  <option value="9">技术</option>  <option value="10">头球</option>  <option value="11">射门</option>  <option value="12">远射</option>  <option value="13">定位球</option></select></div><br>三维评值：<br>身体：<select name="phy3" size="1" id="phy3_select">    <option value="0.55">1</option>  <option value="0.70">2</option>  <option value="0.85">3</option>  <option value="1" selected >4</option></select></br>战术：<select name="tac3" size="1" id="tac3_select">    <option value="0.55">1</option>  <option value="0.70">2</option>  <option value="0.85">3</option>  <option value="1" selected >4</option></select></br>技术：<select name="tec3" size="1" id="tec3_select">  <option value="0.55">1</option>  <option value="0.70">2</option>  <option value="0.85">3</option>  <option value="1" selected >4</option></select></br>训练方式：自定义训练</br><div name="customizetr" id="customizetr"><div name="table1" id="table1">Team 1<select name="t1" size="1" id="t1_select"><option value="0">0</option><option value="1">1</option><option value="2" selected >2</option><option value="3">3</option><option value="4">4</option></select><br> Team 2<select name="t2" size="1" id="t2_select"><option value="0">0</option><option value="1">1</option><option value="2" selected >2</option><option value="3">3</option><option value="4">4</option></select><br>Team 3<select name="t3" size="1" id="t3_select"><option value="0">0</option><option value="1">1</option><option value="2" selected >2</option><option value="3">3</option><option value="4">4</option></select><br>Team 4<select name="t4" size="1" id="t4_select"><option value="0">0</option><option value="1">1</option><option value="2" selected >2</option><option value="3">3</option><option value="4">4</option></select><br>Team 5<select name="t5" size="1" id="t5_select"><option value="0">0</option><option value="1">1</option><option value="2" selected >2</option><option value="3">3</option><option value="4">4</option></select><br>Team 6<select name="t6" size="1" id="t6_select"><option value="0">0</option><option value="1">1</option><option value="2" selected >2</option><option value="3">3</option><option value="4">4</option></select><br> <br></div>训练点数：<p id= "k" size= "5"> </p> </div>分段1：<br> 训练周数1：　　<input type=text id="wk1_input" size="5" value="0" /> <br> 训练强度1：　　<input type=text id="ti1_input" size="5" value="0"  /> <br> 分段2：<br> 训练周数2：　　<input type=text id="wk2_input" size="5" value="0" /> <br> 训练强度2：　　<input type=text id="ti2_input" size="5" value="0" /> <br> 分段3： <br>训练周数3：　　<input type=text id="wk3_input" size="5" value="0"  /> <br>训练强度3：　　<input type=text id="ti3_input" size="5" value="0" /> <br>结果：<br><p id= "test" size= "5"> </p> <p id= "physum" size= "5"> </p> <p id= "tacsum" size= "5"> </p> <p id= "tecsum" size= "5"> </p> <p id= "old" size= "5"> </p> <p id= "new" size= "5"> </p> <p id= "p" size= "5"> </p> <p id= "p2" size= "5"> </p> <p id= "sit" size="5"> </p><table width=100% border="0">  <tr>    <td><p id= "Str" size= "5"> </p> </td>    <td><p id= "Pas" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Sta" size= "5"> </p></td>    <td><p id= "Cro" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Pac" size= "5"> </p></td>    <td><p id= "Tec" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Mar" size= "5"> </p></td>    <td><p id= "Hea" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Tac" size= "5"> </p></td>    <td><p id= "Fin" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Wor" size= "5"> </p></td>    <td><p id= "Lon" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Pos" size= "5"> </p></td>    <td><p id= "Set" size= "5"> </p></td>    </tr>	 <tr>    <td><p id= "Str" size= "5"> </p> </td>    <td><p id= "Han" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Sta" size= "5"> </p></td>    <td><p id= "One" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Pac" size= "5"></p></td>    <td><p id= "Ref" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Emt" size= "5"> </p></td>    <td><p id= "Aer" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Emt" size= "5"> </p></td>    <td><p id= "Jum" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Emt" size= "5"> </p></td>    <td><p id= "Com" size= "5"> </p></td>    </tr>  <tr>    <td><p id= "Emt" size= "5"> </p></td>    <td><p id= "Kic" size= "5"> </p></td>    </tr>	  <tr>    <td><p id= "Emt" size= "5"> </p></td>    <td><p id= "Thr" size= "5"> </p></td>    </tr></table>';
	


function calc()
{

var sp=eval(sp_select.options[sp_select.selectedIndex].value);

var phy3=eval(phy3_select.options[phy3_select.selectedIndex].value);
var tac3=eval(tac3_select.options[tac3_select.selectedIndex].value);
var tec3=eval(tec3_select.options[tec3_select.selectedIndex].value);

var t1=eval(t1_select.options[t1_select.selectedIndex].value);
var t2=eval(t2_select.options[t2_select.selectedIndex].value);
var t3=eval(t3_select.options[t3_select.selectedIndex].value);
var t4=eval(t4_select.options[t4_select.selectedIndex].value);
var t5=eval(t5_select.options[t5_select.selectedIndex].value);
var t6=eval(t6_select.options[t6_select.selectedIndex].value);
var wk1=eval(wk1_input.value);
var ti1=eval(ti1_input.value);
var wk2=eval(wk2_input.value);
var ti2=eval(ti2_input.value);
var ti3=eval(ti3_input.value);
var wk3=eval(wk3_input.value);
 var si = eval(document.getElementsByTagName('td') [44].innerHTML.replace(/,/g, ''));



	
	
	////
//alert(document.getElementsByTagName("div")[60].innerHTML);

	
alert(document.getElementsByTagName("td")[1].innerHTML);

Str=eval(document.getElementById("fb-root"));
Pas=eval(document.getElementById("fb-root"));
Sta=eval(document.getElementById("fb-root"));
Cro=eval(document.getElementById("fb-root"));
Pac=eval(document.getElementById("fb-root"));
Tec=eval(document.getElementById("fb-root"));
Mar=eval(document.getElementById("fb-root"));
Hea=eval(document.getElementById("fb-root"));
Tac=eval(document.getElementById("fb-root"));
Fin=eval(document.getElementById("fb-root"));
Wor=eval(document.getElementById("fb-root"));
Lon=eval(document.getElementById("fb-root"));
Pos=eval(document.getElementById("fb-root"));
Set=eval(document.getElementById("fb-root"));

years=eval(document.getElementById("fb-root"));
month=eval(document.getElementById("fb-root"));

allti=wk1*ti1+wk2*ti2+wk3*ti3;

if (t1+t2+t3+t4+t5+t6!=12)   
{	
  document.getElementById("test").innerHTML="自定义训练点数之和必须等于12！";
     document.getElementById("sit").innerHTML="";
	 document.getElementById("Str").innerHTML="";
	      document.getElementById("p").innerHTML="";
   document.getElementById("Sta").innerHTML="";
 document.getElementById("Wor").innerHTML="";
 document.getElementById("Pas").innerHTML="";
 document.getElementById("Cro").innerHTML="";
 document.getElementById("Pac").innerHTML="";
 document.getElementById("Tec").innerHTML="";
 document.getElementById("Mar").innerHTML="";
 document.getElementById("Hea").innerHTML="";
 document.getElementById("Tac").innerHTML="";
 document.getElementById("Fin").innerHTML="";
 document.getElementById("Lon").innerHTML="";
 document.getElementById("Pos").innerHTML="";
 document.getElementById("Set").innerHTML="";
alert("自定义训练点数之和必须等于12！");

	}


  document.getSkills = function (table) {
    var skillArray = [
    ];
    var tableData = table.getElementsByTagName('td');
    if (tableData.length > 1) {
      for (var i = 0; i < 2; i++) {
        for (var j = i; j < tableData.length; j += 2) {
          if (tableData[j].innerHTML.indexOf('star.png') > 0) {
            skillArray.push(20);
          } 
          else if (tableData[j].innerHTML.indexOf('star_silver.png') > 0) {
            skillArray.push(19);
          } 
          else if (tableData[j].textContent.length != 0) {
            skillArray.push(tableData[j].textContent);
          }
        }
      }
    }
    return skillArray;
  };


////



}
 train.innerHTML+='<a href="http://trophymanager.cn/tools/training/" target="_blank">网页版</a><br>';

 train.innerHTML+='<a href="javascript:void(0)" id="calculate">计算！</a><br>'; 
var calculate=document.getElementById("calculate");
calculate.onclick= calc;
