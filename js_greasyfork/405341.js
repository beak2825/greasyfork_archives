// ==UserScript==
// @name         jsu_优学院马原自动答题
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Gan
// @match        https://www.ulearning.cn/umooc/user/study.do*
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/405341/jsu_%E4%BC%98%E5%AD%A6%E9%99%A2%E9%A9%AC%E5%8E%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/405341/jsu_%E4%BC%98%E5%AD%A6%E9%99%A2%E9%A9%AC%E5%8E%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var obj =new Object();
    var strs= new Array();
    var div = document.createElement('div');
    div.id = "laogan";
    div.innerHTML="自动答题";
    div.style.width = "60px";
    div.style.height = "20px";
    div.style.overflow = "hidden";
    div.style.backgroundColor = 'rgba(0, 181, 255,0.5)';
    div.style.position = 'fixed';
    div.style.top = '0px';
    div.style.left = '150px';
    div.style.zIndex = "999999";
    var bo = document.body;
    bo.insertBefore(div, bo.lastChild);
    var onn= document.getElementById("laogan");
    var kke=3
    $('#laogan').click(function(){
        if (kke==1){
            kke=0;
            onn.style.height = "40px";
            onn.innerHTML="已关自动开启自动";
            onn.style.backgroundColor = 'rgba(217, 2, 17,0.5)';
        }else{
            kke=1;
            onn.style.height = "40px";
            onn.innerHTML="正在自动暂停自动";
            onn.style.backgroundColor = 'rgba(0, 254, 0,0.5)';
            //$("#top li.tag a")[2].click()
            c2();
            cl();
        }
    });
    var c2=function(){
        console.log("ok")
        var pan =new Object();
        var qwer=1;
        var eee=$('.judge');
        var rrr=eee.children().children()
        for(var iii=0;iii<rrr.length;iii=iii+2){
            var tttt1=rrr[iii]
            var tttt2=rrr[iii+1].children[0]
            var qus2=tttt1.children[0].children[1].innerHTML
            pan[iii]=tttt2
            var ip='1'
            GM_xmlhttpRequest({
                method: "get",
                url: 'http://ganapi.free.idcfengye.com/mayuan/api2.php?q='+qus2+'&ip='+ip+'&qwer='+iii,
                onload: function(r) {
                    var su = $.parseJSON(r.responseText);
                    var ma=su.data1.answer;
                    var timu=su.data1.question;
                    var num=su.data1.num;
                    if (ma=='true'){
                        pan[num]['children'][0]["id"]="gps"+num;
                        $("#gps"+num+" input")[0].click();
                        pan[num]['children'][0]["id"]=""
                    }
                    else if (ma=='false'){
                        pan[num]['children'][1]["id"]="gps"+num;
                        $("#gps"+num+" input")[0].click();
                        pan[num]['children'][1]["id"]=""
                    }else{
                        console.log("error:"+timu)
                    }
                    delete pan[num];

                }
            });
        }

    }
    var cl=function(){
        console.log("ok")
        var answer =new Object();
        var qwer=1;
        var eee=$('.multiple-choices');
        //console.log($('.judge'))
        var rrr=eee.children().children()
        for(var i=0;i<rrr.length;i=i+2){
            var ans =new Object();
            var tttt1=rrr[i]
            var tttt2=rrr[i+1]
            var qus=tttt1.children[0].children[1].innerHTML
            for(var qqqq=0;qqqq<4;qqqq++){
                var an=tttt2.children[qqqq].innerText
                an=an.replace("\n","")
                an=an.replace(" ","")
                ans[an]=tttt2.children[qqqq]
            }
            answer[qwer]=ans;
            var ip='1'
            GM_xmlhttpRequest({
                method: "get",
                url: 'http://ganapi.free.idcfengye.com/mayuan/api2.php?q='+qus+'&ip='+ip+'&qwer='+qwer,
                onload: function(r) {
                    var su = $.parseJSON(r.responseText);
                    var ma=su.data1.answer;
                    var num=su.data1.num;
                    strs=ma.split("<br>");
                    for (var vvv=0;vvv<strs.length ;vvv++ )
                    {
                        var able=strs[vvv];
                        answer[num][able]['id']="maindddd"+num;
                        $("#maindddd"+num+' div.radio.left')[0].click();
                        answer[num][able]['id']="";                        
                    }
                    delete answer[num];
                }
            });
            qwer=qwer+1;
        }
    };

})();