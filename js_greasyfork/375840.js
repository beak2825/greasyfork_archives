// ==UserScript==
// @name         b站自定義
// @namespace   
// @version      0.1.8
// @description  在bilibili網頁端上方菜單添加[已追番]的入口
// @author       kfoawf
// @match        *://www.bilibili.com/*
// @match        *://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375840/b%E7%AB%99%E8%87%AA%E5%AE%9A%E7%BE%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/375840/b%E7%AB%99%E8%87%AA%E5%AE%9A%E7%BE%A9.meta.js
// ==/UserScript==

(function() {
    var cookies = document.cookie;
    var id=cookies.match(/DedeUserID=(\d+)/)[1];
    go();
    go1();
    go2();
    function go(){
        var Obj=document.querySelector("[report-id=playpage_dynamic]");

        if(Obj){
            

            $("<li report-id='nop' class='nav-item'> <a href='//space.bilibili.com/"+id+"/cinema' target='_blank' class='t'>追劇</a></li>").insertAfter(Obj);
            $("<li report-id='nop' class='nav-item'> <a href='//space.bilibili.com/"+id+"/bangumi' target='_blank' class='t'>追番</a></li>").insertAfter(Obj);

            
            
    
        }else{setTimeout(go,500);}
    }

function go1(){
        var Obj1=document.querySelector("[report-id=big_tab_click]");

        if(Obj1){
            
            $("<li report-id='nop' class='nav-item'> <a href='//live.bilibili.com/' target='_blank' class='t'>直播</a></li>").insertAfter(Obj1);

            $("<li report-id='nop' class='nav-item'> <a href='//bilibili.com/' target='_blank' class='t'>首頁</a></li>").insertAfter(Obj1);

            
            $(Obj1).remove();

        }else{setTimeout(go1,500);}
    }

function go2(){
        var Obj2=document.querySelector("[report-id=playpage_message]");

        if(Obj2){


            $(Obj2).remove();

        }else{setTimeout(go2,500);}


        var Obj3=document.querySelector("[report-id=playpage_watchlater]");

        if(Obj3){


            $(Obj3).remove();

        }else{setTimeout(go2,500);}

        var Obj4=document.querySelector("[report-id=playpage_collection]");

        if(Obj4){


            $(Obj4).remove();

        }else{setTimeout(go2,500);}




    }

})();