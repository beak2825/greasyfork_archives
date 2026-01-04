// ==UserScript==
// @name         無限冒險自動掛網
// @namespace    https://astriaworks.moe/
// @version      27.182818
// @description  自動住宿、禁止死亡跳窗、自動繼續掛網、自動存銀行
// @author       Astira
// @match        https://changame.ml/top.cgi
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/404729/%E7%84%A1%E9%99%90%E5%86%92%E9%9A%AA%E8%87%AA%E5%8B%95%E6%8E%9B%E7%B6%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/404729/%E7%84%A1%E9%99%90%E5%86%92%E9%9A%AA%E8%87%AA%E5%8B%95%E6%8E%9B%E7%B6%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.alert=function() {};
var banking = 0;
var timecount = 0;
var looptime = 1000; //一個循環幾毫秒

var persenthp = 50; //低於多少%的HP自動住宿
var persentmp = 30; //低於多少%的MP自動住宿
var money = 30;     //超過多少錢自動存銀行
(function loop() {
  setTimeout(function () {
    var dt = new Date();
var min = dt.getMinutes();
var sec = dt.getSeconds();
var hour = dt.getHours();
var auto = document.getElementById("autoattack");
    var hhp = document.getElementById("mhp");
    var mmp = document.getElementById("mmp");
    var gold = document.getElementById("mgold");
    if(parseInt(hhp.textContent.substring(0, hhp.textContent.indexOf("/")))< parseInt(hhp.textContent.substring(hhp.textContent.indexOf("/")+1, hhp.textContent.length))*persenthp/100 ||
       parseInt(mmp.textContent.substring(0, mmp.textContent.indexOf("/")))< parseInt(mmp.textContent.substring(mmp.textContent.indexOf("/")+1, mmp.textContent.length))*persentmp/100){
        banking = 1;
        gobed();
    }
    if(parseInt(gold.textContent.substring(0, gold.textContent.indexOf("萬"))) >= money &&  gold.textContent.indexOf("G") < 0 && banking == 0){
        if(banking == 0) gobank();
    }
      if(auto.checked == false)
          if(parseInt(hhp.textContent.substring(0, hhp.textContent.indexOf("/"))) > 0)
              auto.checked = true;
   if(timecount %10 == 0){
       GM_log('現在時間 :', hour,' : ',min,' : ',sec," 總時間 : ", timecount,"秒");
       banking = 0;
   }
  timecount += (looptime/1000);
    loop()
  }, looptime );
}());

function gobed(){

    var sel = document.getElementsByName("mode");
    sel[3].selectedIndex=0;
    var btn = document.getElementById("townbutton");
    btn.click();
    setTimeout(function() {
        getObj('statusf').mode.options[0].selected=true;
        getObj('countryf').mode.options[1].selected=true;
        getObj('townf').mode.options[0].selected=true;

        getObj('mainTable').style.display='';
        getObj('subTable').style.display='';
        getObj('actionframe').style.display='none';

        var iObj = document.getElementById('actionframe').contentDocument;
        iObj.body.innerHTML='<br><br><p align="center"><i><font color=white size=4>資料讀取中....</font></i></p>';

        getObj('actionframe').style.height="400px";
        get_all_data();
        scrollTo(0,0);
        banking = 0;
        }, 1000);
}
function gobank(){
    banking = 1;
    var sel = document.getElementsByName("mode");
    sel[3].selectedIndex=10;
    var btn = document.getElementById("townbutton");
    btn.click();
    setTimeout(function() {
        document.getElementById("actionframe").contentWindow.document.getElementsByClassName("MFC")[1].click();
    setTimeout(function() {
        getObj('statusf').mode.options[0].selected=true;
        getObj('countryf').mode.options[1].selected=true;
        getObj('townf').mode.options[0].selected=true;

        getObj('mainTable').style.display='';
        getObj('subTable').style.display='';
        getObj('actionframe').style.display='none';

        var iObj = document.getElementById('actionframe').contentDocument;
        iObj.body.innerHTML='<br><br><p align="center"><i><font color=white size=4>資料讀取中....</font></i></p>';

        getObj('actionframe').style.height="400px";
        get_all_data();
        scrollTo(0,0);
        banking = 0;
        }, 1000);
        }, 5000);

}
function gotown(){
    javascript:parent.backtown();
}
})();