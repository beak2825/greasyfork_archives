// ==UserScript==
// @name         华科公选抢课
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  抢课前后刷新，并自动选课
// @author       shandianchengzi
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        http://*/*
// @grant        none
// @include      http://wsxk.hust.edu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/411478/%E5%8D%8E%E7%A7%91%E5%85%AC%E9%80%89%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/411478/%E5%8D%8E%E7%A7%91%E5%85%AC%E9%80%89%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==
var shuaxin=500;//刷新频率（单位毫秒）
function sleep(n) {
    var start = new Date().getTime();
    //  console.log('休眠前：' + start);
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
    // console.log('休眠后：' + new Date().getTime());
}

function selectKT(ktbh,ktrl,ktrs,kcmc,kcbh,kczxf){
    document.getElementById("ktbh").value=ktbh;
    document.getElementById("ktrl").value=ktrl;
    document.getElementById("ktrs").value=ktrs;
    document.getElementById("kcmc1").value=kcmc;
    document.getElementById("kczxf").value=kczxf;
    document.getElementById("kcbh").value=kcbh;
    document.form.submit();
}
(function() {
    ;

    var what = document.getElementsByTagName("table")[0].rows[3];
    var what3=what.cells[0].className;
    if(what3=="pagebar"){
        var where=document.getElementsByTagName("table")[0].rows[2];
        var what10=where.cells[9].innerText;
        var what2=where.cells[2].innerHTML;
        var xuefen=where.cells[4].innerText.split('/')[1];
        var bianhao=what2.split('=\'+')[1];
        bianhao=bianhao.split(')')[0];
        var renshu=what10.split('/')[1];
        var nowRenshu=what10.split('/')[0];
        var bili=renshu+'/'+renshu;
        var noChance=what10.indexOf(bili);

        var what1=document.getElementsByTagName("input")[10];
        what1.value = '加油';
        var btn=document.creatElement("button");
        btn.onclick=function(){
            what1.value = '加油';
        };
        btn.onclick();
        what1.onclick =function () {
            selectKT(what1.id,nowRenshu,renshu,where.cells[2].innerText,bianhao,xuefen);};

        if(noChance!= -1)
        {
            history.go(-1);
        }
        else {
            what1.onclick();
            return;}
    }
    else history.go(1);
    sleep(shuaxin);
    // Your code here...
})();