// ==UserScript==
// @name         yt_tool
// @namespace    http://tampermonkey.net/
// @version      0.1.1.6
// @description  try to take over the world!
// @author       You
// @match        https://tw.news.yahoo.com/poll/
// @include      /https://tw.news.yahoo.com/poll*
// @include      /https://tw.news.yahoo.com/pk*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue

// @downloadURL https://update.greasyfork.org/scripts/386600/yt_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/386600/yt_tool.meta.js
// ==/UserScript==
/*
var zNode2 = document.createElement ('div');
zNode2.innerHTML = '<button id="myButton2" type="button" style="width:200px;height:30px;margin-bottom:20px;">' + '自 動 投 票2</button>';
zNode2.setAttribute ('id', 'myContainer2');
var parNode2 = document.getElementById("Col1-0-PKMobile-Proxy");
parNode2.insertBefore(zNode2,parNode2.childNodes[0]);

document.getElementById ("myButton2").addEventListener (
    "click", ButtonClickAction2, false
);
*/
var overbtn =0;
var parNode2 = document.getElementById("Col1-0-PKMobile-Proxy");


var zNode = document.createElement ('div');
//zNode.innerHTML = '<button id="myButton" type="button" style="width:200px;height:30px;margin-bottom:20px;">' + '自 動 投 票</button>';
//zNode.setAttribute ('id', 'myContainer');

var zNode2 = document.createElement ('div');
zNode2.innerHTML = '<button id="myButton" type="button" style="width:200px;height:30px;margin-bottom:20px;">' + '自 動 投 票</button>' + '<button id="myButton2" type="button" style="width:200px;height:30px;margin-bottom:20px;">' + '清 除 數 據</button>';
zNode2.setAttribute ('id', 'myContainer2');
zNode.setAttribute ('id', 'myContainer');
if (parNode2 == null){
    var parNode = document.getElementById("UH-0-UtilityHeader-Proxy");
    parNode.insertBefore(zNode,parNode.childNodes[0]);
    parNode.insertBefore(zNode2,parNode.childNodes[1]);
}else{
    parNode = document.getElementById("Col1-0-PKMobile-Proxy");
    parNode.insertBefore(zNode,parNode2.childNodes[0]);
    parNode.insertBefore(zNode2,parNode2.childNodes[1]);
    }




//console.log(parNode2);



document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

document.getElementById ("myButton2").addEventListener (
    "click", ButtonClickAction2, false
);

function ButtonClickAction2 (zEvent) {
    console.log(GM_listValues());
    var banList = GM_listValues();//Array of Usernames




for (var i=0; i <banList.length; i++) {
    var currentUser = banList[i];
    GM_deleteValue(currentUser);
}

}


/*
//***************************************************
     var input=document.createElement("input");
     input.id="dm1";
     input.name="daimom";
     input.type="button";
     input.value="按我";
     input.onclick = showAlert;
     input.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:40px;");
     document.body.appendChild(input);
//***************************************************
*/
function showAlert(){
}

var allURL = [];
var n = 0;
var nowStr="";


function showUrl(index) {
    index = index || 0;
    if (allURL.length === 0 || index < 0 || index >= allURL.length) {
        return;
    }
    var popup = window.open(allURL[index]);
    popup.onload = function() {
        var status = popup.document.getElementsByTagName('p')[0].innerHTML;
        //console.log(status);
        if (status == "你已经投过票，每个候选只能投一次。"){
            popup.close();
            return;
        }
        popup.close();
        showUrl(index + 1);
    };
}

//*
function setKeywordText(text) {
    //document.getElementsByClassName('H(162px) W(415px) Fz(16px) Ov(a) Bdrs(3px) Bdw(1.5px) Bds(s) Bdc(#e2e2e6) H(130px)')[0];
    //var el = document.getElementById("gwt-debug-keywords-text-area");
    var el = document.getElementsByClassName('H(162px) W(415px) Fz(16px) Ov(a) Bdrs(3px) Bdw(1.5px) Bds(s) Bdc(#e2e2e6) H(130px)')[0];
    console.log("EL=" , el);
    el.value = text;
    //var evt = document.createEvent("UIEvents");

    //evt.initEvent("keypress", true, true);
    //evt.initEvent("change", true, true);
    //evt.initEvent("alert", false, false);
    //evt.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
    //evt.initEvent("keypress", true, true);
    var evt = document.createEvent("Events");
    evt.initEvent("keypress", true, true);

    evt.view = window;
    evt.altKey = false;
    evt.ctrlKey = false;
    evt.shiftKey = false;
    evt.metaKey = false;
    evt.keyCode = 63;
    evt.charCode = 'a';

    var allowDefault = el.dispatchEvent(evt);
    //el.dispatchEvent(evt);





}
//*/
/*
function setKeywordText(text)
{
    var el = document.getElementsByClassName('H(162px) W(415px) Fz(16px) Ov(a) Bdrs(3px) Bdw(1.5px) Bds(s) Bdc(#e2e2e6) H(130px)')[0];
    el.value = text;
    var evt= new Event('change');
    el.dispatchEvent(evt);
}

*/

function a(){
                var aBtn = document.getElementsByTagName("button");
                console.log(aBtn);//textContent: "下一題"
                for(var x=0,len3=aBtn.length;x<len3;x++){
                    if (aBtn[x].textContent == "完成"){
                        aBtn[x].click();
                        document.title = "OK-投票完成" ;
                        //alert("完成問卷投票");
                        break;
                    }
                    if (aBtn[x].textContent == "下一題"){
                        //alert("----------");
                        aBtn[x].click();
                        break;
                    }
                }

}





var Astr ="其他/沒意見; 小學; 沒有; 不知道/沒意見; 不知道／沒意見; 沒意見; 36~40歲; 不知道 / 沒意見; "

function ButtonClickAction (zEvent) {
    var aDom = document.getElementsByTagName("span");
    console.log("ALL_aDom");
    console.log(aDom);
    var gogo = 0;
    var p2 =0;
    var pList = [];
    for(var i=1,len=aDom.length;i<len;i++){
        //console.log(aDom[i].id);

        if (aDom[i].innerHTML == "馬上邀請朋友一起來投票！"){
            gogo=1;
            if (document.title = "OK-投票完成_" + document.title){
                overbtn =1;
                alert("~恭喜完成問卷調查~");
            }

            document.title = "OK-投票完成_" + document.title;

        }
        if ((aDom[i].innerHTML == "去投票") && (gogo==0))
        {
            ///pList[p2] = i;
            ///2++;


            console.log("去投票");
            console.log( aDom[i], i);

            console.log("GM_裡的內容 ",GM_listValues());
            //console.log(GM_getValue('zw_test' , ""));

            //console.log ("GM_getValue: ", GM_getValue ("zw_test", true) );
            //var stmp2 ="";
            var stmp2 = GM_getValue(aDom[i-1].innerHTML);
            console.log("stmp2= " , stmp2 , aDom[i-1].innerHTML);
            //GM_setValue(aDom[i-1].innerHTML, "1");
            //GM_setValue("去投票2", a);
            //stmp2 = GM_getValue("去投票")
            if (stmp2 != 1){
                //GM_setValue(aDom[i-1].innerHTML, 1);
                GM_setValue('NowQ', aDom[i-1].innerHTML);
                aDom[i].click();
                break;
            }
            //


            //i=1000
            //allURL[n] = aDom[i].href;
            //n++;
        }
    }//------------------------------------------------------------------------------------------------------------------
    //showUrl();
    ///if ((pList.length >=1) && (gogo==0)){
    ///    aDom[pList[RandomNum(0,pList.length -1)]].click();
    ///}


    var s =0;
    var sList = [];
    var aLeb = document.getElementsByTagName("label");

    console.log(aLeb);
    for(var j=0,len2=aLeb.length;j<len2;j++){
        console.log(aLeb[j].textContent);
        sList[s] = aLeb[j]//.textContent;
        s ++;
        //if (aLeb[j].textContent == "其他/沒意見")


        ///if (Astr.match(aLeb[j].textContent))
        ///{
            //alert("----------");
        ///    aLeb[j].click();
            ///setTimeout(function() { a() }, 100);//按下一步 or 完成
            //j=1000;
        ///    break;
        ///}
    }
    //改成隨機作答
    if (sList.length >=1){
        aLeb[RandomNum(0,sList.length -1)].click();
        setTimeout(function() { a() }, 500);//按下一步 or 完成
    }
    //------------------------------------------------------------------------------------------------------------------

    //var oneC = document.getElementsByclassName('Bgc(#ffffff) W(58px) H(58px) Bdrs(32px) Bdc(#ffffff) Bds(s) Bdw(3px) Pos(a) Start(21px) T(-12px) Op(0.5)');
    //document.getElementsByclassName("Bgc(#ffffff) W(58px) H(58px) Bdrs(32px) Bdc(#ffffff) Bds(s) Bdw(3px) Pos(a) Start(21px) T(-12px) Op(0.5)")[0].click();
    //document.getElementsByClassName("p4course_target")[0].remove();

    //oneC.click();
    //var oneClick = document.getElementsByClassName('test');
    //console.log(oneC);
    var aTxt = document.getElementsByTagName("span");//找回答內容



    //console.log(aTxt);
    var ox;
    var n =0;
    var nList = [];

    for(var y=0,len3=aTxt.length;y<len3;y++){
        if (aTxt[y].className == "W(100%) H(44px) Bdrs(100px) D(f) Ai(c) Jc(c) Fz(16px) Bgc(#e2e2e6) C(#9b9b9b)"){
            //aTxt[y].click();
            console.log("這是傳送訊息按鈕",y);
            ox=y;
            overbtn=1;
        }
        if (aTxt[y].className == "content-paragraph Lh(1.5) Maw(100%) D(ib) Ov(h) Tov(e)"){
            //找回答內容
            console.log(aTxt[y].textContent , y);
            nList[n] = aTxt[y].textContent;
            n ++;
            //回答text位置
            var pp = document.getElementsByClassName('H(162px) W(415px) Fz(16px) Ov(a) Bdrs(3px) Bdw(1.5px) Bds(s) Bdc(#e2e2e6) H(130px)')[0];
            console.log(pp);

            //setTimeout(function(){pp.value += "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!\n";}, 50);
            //pp.focus();
            //setTimeout(function(){pp.focus();}, 100);
            //setTimeout(function(){setKeywordText(aTxt[y].textContent);}, 200);
            //setTimeout(function(){pp.focus();}, 100);
            //setTimeout(function(){pp.value = aTxt[y].textContent;}, 200);


            //setKeywordText("test");
            //setTimeout(function(){pp.KeyPress(" ");}, 100);
            //setTimeout(function(){aTxt[ox].click();}, 500);
            //pp.value = "aTxt[y].textContent";
            //break;

        }


        if (aTxt[y].className == "H(45px) Mx(a) My(0) D(f) Jc(c) Ai(c) Cur(p) W(250px) Fz(18px) Bdrs(100px)"){
            //aTxt[y].click();
            console.log("這是 選邊站 按鈕" , y);
            console.log("這是 選邊站 按鈕s" , aTxt[y]);
            if (aTxt[y].textContent.match("你選擇了")){
                console.log("返回上一頁");
                history.go(-1);
                //
                var ns =GM_getValue('NowQ');
                GM_setValue(ns, 1);

            }
        }

    }//------------------------------------------------------------------------------------------------------------------

    /*
    for (var h = 0; h < nList.length - 1; h++)
{
    console.log("找到的回答訊息 " , nList[h]);
}
    console.log("找到的回答訊息 " , nList[RandomNum(0,nList.length -1)]);
*/

if ( nList.length >= 1){
    //overbtn=0; //測試用致0
    document.title = "PK-手動傳送_" + document.title;
    pp = document.getElementsByClassName('H(162px) W(415px) Fz(16px) Ov(a) Bdrs(3px) Bdw(1.5px) Bds(s) Bdc(#e2e2e6) H(130px)')[0];
    setTimeout(function(){
        pp.value = nList[RandomNum(0,nList.length -1)];
    }, 100);
}






    var aca = document.getElementsByTagName("div");
    for(var p=0,len6=aca.length;p<len6;p++){
        if (aca[p].className == "Bgc(#ffffff) W(58px) H(58px) Bdrs(32px) Bdc(#ffffff) Bds(s) Bdw(3px) Pos(a) Start(21px) T(-12px) Op(0.5)"){
            aca[p].click();
            console.log("這是選 左邊",p);
            break;
        }
        if (aca[p].className == "D(f) Ai(c) Jc(c) Fld(c) Mt(24px) W(100%)"){
            console.log("留言-----------------------------",p);
           // aca[p].text = "123";
           // textarea.value = "123456";
        }
   }//------------------------------------------------------------------------------------------------------------------

}

function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.floor(Rand * Range); //舍去
    return num;
}



//========================
setInterval(function() {
    if (overbtn == 0) {
    ButtonClickAction();
    };
},1000);


