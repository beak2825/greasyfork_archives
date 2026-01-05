// ==UserScript==
// @name       FlowCracker
// @update  https://greasyfork.org/scripts/15308-flowcracker/code/FlowCracker.user.js
// @author	 mountainguan
// @version    1.5.2
// @description  新增:流量包买完了仍然支持继续购买的功能，绩点2.5以上的无限购买5元5g，绩点2.5以下的无限购买5元2.5g.
// @match      http://self.dgut.edu.cn/Flow/Index
// @copyright  2014+, mountainguan
// @grant       none
// @namespace https://greasyfork.org/scripts/5619-5%E8%9A%8A5g/
// @downloadURL https://update.greasyfork.org/scripts/15308/FlowCracker.user.js
// @updateURL https://update.greasyfork.org/scripts/15308/FlowCracker.meta.js
// ==/UserScript==
var score = getNum();//绩点转换为数字
var flow = ["5120 MB（5.0 GB）","2560 MB（2.5 GB）"];
main();

function main(){ //入口
    if(!ifmy1Exist()){ //判断是否存在my1包
        fixStyleSpec();//不存在，则执行
        setTime();
    }else fixStyleNormal();//存在则执行
}

function fixStyleNormal(){ //spanNum代表修改表格的样式代码，通过搜索"span"查找，keyNum代表购买的流量包代码(固定)
    var myName = ["my2","my3","my4","my5"];//packNum的数字是0，1，2，3
    var label1 = document.getElementsByTagName("label")[8].setAttribute("id","mylabel");//修改my1包的table数字改变可以调节显示的中文的位置。
    var changedlabel = document.getElementById("mylabel");
    var arrayTemp = document.getElementsByTagName("input");
    var temp;
    var $ = document.getElementById("my1");
    $.value = spanNum();//spanNum()的返回值是keyNum;
    for(var i = 0,disableNum = 0;i<arrayTemp.length;i++){ //统计有多少个需要禁用的选项
        if(arrayTemp[i].type == "radio") {
            temp=arrayTemp[i].type;
            disableNum++;
        }
    }
    if(score>2.5){ temp = flow[0]; }else {temp = flow[1];}
    changedlabel.innerHTML= "花费 5.0 元，购买1个流量包，增加可用流量" + temp + "。";
    for(i = 0;i<disableNum-1;i++){
        document.getElementById(myName[i]).setAttribute("disabled","disabled");
    }
}

function fixStyleSpec(){   //流量包买光的情况
    var temp;
    var keyNum = spanNum();
    if(score>2.5){ temp = flow[0]; }else {temp = flow[1];}
    document.getElementById("GetFlows").innerHTML ="<h4>你本月的流量包使用情况如下：</h4><table class='flowTable' border='0' cellspacing='1' cellpadding='4'>"+document.getElementById("GetFlows").getElementsByTagName("table")[0].innerHTML+"    </table><h4>所购买的流量下月1日会自动清零，请按需选择购买流量包：</h4><form action='/Flow/_BuyFlow?type=4' data-ajax='true' data-ajax-begin='onbegin' data-ajax-confirm='计费按自然月结算，所购买的流量下月1日会自动清零，你确定要购买吗？' data-ajax-method='Post' data-ajax-mode='replace' data-ajax-success='buySuc' data-ajax-update='#msg' id='form0' method='post' novalidate='novalidate'><ul class='myFlow'><li><input type='radio' id='my1' name='myFlow' value="+keyNum+">&nbsp;<label for='my1' id='mylabel'>花费 5.0 元，购买1个流量包，增加可用流量 " + temp +"。</label></li></ul><input type='hidden' id='sessionFlow' name='sessionFlow' value='0'><p><input type='submit' class='btnSub' value='提交'></p></form>";
}

function setTime(){  //自动生成流量包购买的时间value值
    var today=new Date();
    var y=today.getFullYear();
    var month=today.getUTCMonth();
    month=month+1;
    if (month<10) month="0"+month; 
    var d=today.getDate();
    if (d<10) d="0"+d;
    var h=today.getHours();
    if (h<10) h="0"+h;
    var m=today.getMinutes();
    var s=today.getSeconds();
    document.getElementById('sessionFlow').value = y+month+d+h+m+s;
}

function getNum(){
	var value = document.getElementsByClassName("score")[0].innerHTML.replace(/[^0-9]/ig,""); //提取绩点的文字
	return value/100;
}

function spanNum(){ //自动定位可用的流量包，并且修改对应样式和获取对应包购买代码
    var realLength=document.getElementById("GetFlows").getElementsByTagName("span").length;//"已购买"和"可购买"的总数量
    var keyNum = realLength+1;//对应包的代码为总数量加一
    var redArray = document.getElementsByClassName("red");
    var greenArray = document.getElementsByClassName("green");
    if(redArray.length <= 0){
        greenArray[greenArray.length - 1].innerHTML = "==可无限购买==";
        greenArray[greenArray.length - 1].setAttribute("class","green");
    }else{
        if(document.getElementById("GetFlows").getElementsByTagName("span")[realLength-1].className=="red"){  //整个购买列的状态获取
            redArray[redArray.length - 1].innerHTML = "==可无限购买==";
            redArray[redArray.length - 1].setAttribute("class","green");
        }else{
            greenArray[greenArray.length - 1].innerHTML = "==可无限购买==";
            greenArray[greenArray.length - 1].setAttribute("class","green");
        }
    }
    return keyNum;
}

function ifmy1Exist(){  //判断id=my1的元素是否存在
    if(document.getElementById("my1")) return true;
    else return false;
}