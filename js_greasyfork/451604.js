// ==UserScript==
// @name         羊了个羊通关攻略脚本，无限刷,秒通关羊羊小游戏1.8
// @version      1.8
// @description   羊了个羊通关攻略脚本，无限刷，羊羊第二关技巧,打开任一网址.电脑建议打开www.baidu.com、手机打开www.qq.com
// @author       yutou
// @match        *://www.baidu.com/*
// @match        *://*.weibo.com/*
// @match        *://*.sougou.com/*
// @match        *://*.bing.com/*
// @match        *://*.so.com/*
// @match        *://*.google.com/*
// @require      https:////unpkg.com/layui@2.6.8/dist/layui.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js

// @namespace https://greasyfork.org/users/927947
// @downloadURL https://update.greasyfork.org/scripts/451604/%E7%BE%8A%E4%BA%86%E4%B8%AA%E7%BE%8A%E9%80%9A%E5%85%B3%E6%94%BB%E7%95%A5%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%97%A0%E9%99%90%E5%88%B7%2C%E7%A7%92%E9%80%9A%E5%85%B3%E7%BE%8A%E7%BE%8A%E5%B0%8F%E6%B8%B8%E6%88%8F18.user.js
// @updateURL https://update.greasyfork.org/scripts/451604/%E7%BE%8A%E4%BA%86%E4%B8%AA%E7%BE%8A%E9%80%9A%E5%85%B3%E6%94%BB%E7%95%A5%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%97%A0%E9%99%90%E5%88%B7%2C%E7%A7%92%E9%80%9A%E5%85%B3%E7%BE%8A%E7%BE%8A%E5%B0%8F%E6%B8%B8%E6%88%8F18.meta.js
// ==/UserScript==
if ((location.href.match("qq.com"))|| (location.href.match("weibo.cn"))|| (location.href.match("bing.com"))|| (location.href.match("sougou.com"))|| (location.href.match("so.com"))|| (location.href.match("baidu.com"))|| (location.href.match("google.com"))|| (location.href.match("uc.cn"))|| (location.href.match("zhihu.com"))){
    var  open = '<div style="font-size:18px" class="layui-btn layui-btn-sm layui-btn-danger" >打开》</>'
    var  gb = '<div style="font-size:18px" class="layui-btn layui-btn-sm layui-btn-danger" >《关闭</>'
    const bt = document.getElementById('myBtn');
    const div = document.getElementById('backgrounda');
    var myBtn = document.createElement("div");
    myBtn.id = "myBtn";
    myBtn.innerHTML = open;
    myBtn.setAttribute("style", "z-index:100999999000;position: fixed;left: 0;top: 70%; cursor:pointer;transition: margin-left .5s;margin-top: 20PX;border-radius: 0 4PX  4PX 0");
    myBtn.onclick = function(event) {
        var sidenava = document.getElementById("boby").style.width;
        if (sidenava == "0px") {
            document.getElementById("boby").style.width = "300px";;
            myBtn.innerHTML = gb;
            //document.getElementById("sidenava").style.backgroundColor = "rgba(0,0,0,0.4)";
            document.getElementById("myBtn").style.marginLeft = "300px";;

        } else {
            document.getElementById("boby").style.width = "0px";
            document.getElementById("myBtn").style.marginLeft = "0px";
              myBtn.innerHTML = open

        }
    }
    document.body.appendChild(myBtn);
    var backgrounda = document.createElement("div");
    backgrounda.id="backgrounda";
    backgrounda.innerHTML ="<div id='diy2'></div>"
    //backgrounda.setAttribute("style", "position:fixed;bottom:5vh;z-index: 9999999999;  float:right; background:#75c473;");
    document.body.appendChild(backgrounda);
    /*
    bt.addEventListener('click',function(event){
        div.style.display = 'block';
       event.stopPropagation();
    })
    document.addEventListener('click',function(){
        div.style.display = 'none';
        document.getElementById("myBtn").style.marginLeft = "0px";;
    });
    div.addEventListener('click',function(event){
        event.stopPropagation();
    })*/
    window.onload=function(){
        fetch("https://hn216.api.yesapi.cn/?s=App.Table.GetOneDataByOneField&return_data=1&model_name=yesapi_framework_log&field_name=id&field_value=1&select=post_data&app_key=75B19A5C1828145CE6847B0E4466571D").then((data) => {
            return data.json();
        }).then((data) => {
            var htmla =data.data.post_data
            document.getElementById("diy2").innerHTML=htmla;
        })
        setTimeout(function () {
            var gettoken=document.getElementById('gettoken');
            var goto=document.getElementById('goto');
            var ting=document.getElementById('ting');
            var yangqun=document.getElementById('yangqun');
            var huati=document.getElementById('huati');
            var diybtn=document.getElementById('diybtn');
            var  savetk =document.getElementById('savetk');
            var none=document.getElementById('none')
            var gettk=localStorage.getItem("token");
            var sd=localStorage.getItem("sd");
            var numa=localStorage.getItem("num");
            ;
            localStorage.setItem("yang","1");
            if(gettk){
                document.getElementById("token").value= gettk
                document.getElementById("sd").value= sd
                document.getElementById("num").value= numa
            }
            diybtn.onclick = function() {
                fetch("https://hn216.api.yesapi.cn/?s=App.Table.GetOneDataByOneField&return_data=1&model_name=yesapi_framework_log&field_name=id&field_value=1&select=msg,url&app_key=75B19A5C1828145CE6847B0E4466571D").then((data) => {
                    return data.json();
                }).then((data) => {
                    var url =data.data.url
                    var msg =data.data.msg
                    if(confirm(msg))
                    {
                        window.location.href=url
                    }else{
                        return false;
                    }
                })
            }
            yangqun.onclick = function() {
                localStorage.setItem("yang","1");
            }
            none.onclick = function() {
                document.getElementById("boby").style.width = "0px";
                document.getElementById("myBtn").style.marginLeft = "0px";
            }
            savetk.onclick = function() {
                var  token=document.getElementById("token").value
                var sd=document.getElementById("sd").value
                var num=document.getElementById("num").value
                localStorage.setItem("token",token);
                localStorage.setItem("sd",sd);
                localStorage.setItem("num",num);

            }
            huati.onclick = function() {
                localStorage.setItem("yang","2");

            }
            var timer = null;
            goto.onclick = function() {
                var tt= document.getElementById("token").value
                var sd= document.getElementById("sd").value
                var yang =localStorage.getItem("yang");
                if(tt){
                    if(yang=="1"){
                        console.log("111")
                        let num = 0;
                        timer = setInterval(function() {
                            var urla="https://cat-match.easygame2021.com/sheep/v1/game/update_user_skin?skin=1&t="+tt
                            $.get(urla,function(data, status) {

                            });
                            num++;
                            var aa= document.getElementById("num").value;
                            document. getElementById("jieguo").innerHTML='<div style="text-align: center;">羊群排行：已刷' + num + '次 </div>'
                            if(num > aa ) {
                                clearInterval(timer);
                                location.reload()
                            }

                        }, sd)
                    }
                    if(yang=="2"){
                        let num = 0;
                        timer = setInterval(function() {
                            var urlaa="https://cat-match.easygame2021.com/sheep/v1/game/topic_game_over?rank_score=1&rank_state=1&rank_time=0&rank_role=1&skin=1&t="+tt+"&content-type=application%2Fjson&User-Agent=Mozilla%2F5.0%20(iPhone%3B%20CPU%20iPhone%20OS%2015_6%20like%20Mac%20OS%20X)%20AppleWebKit%2F605.1.15%20(KHTML%2C%20like%20Gecko)%20Mobile%2F15E148%20MicroMessenger%2F8.0.28(0x18001c26)%20NetType%2FWIFI%20Language%2Fzh_CN"
                            $.get(urlaa,function(data, status) {

                            });
                            num++;
                            var aa= document.getElementById("num").value;
                            document. getElementById("jieguo").innerHTML='<div style="text-align: center;">话题已刷' + num + '次 </div>'
                            if(num > aa ) {
                                clearInterval(timer);
                                location.reload()
                                console.log("222")
                            }

                        }, sd)
                    }

                }else{
                    alert("请先输入token，获取token请扫码查看/或点使用教程");
                }
            }
            ting.onclick = function() {
                location.reload()
                clearInterval(timer);
                document. getElementById("jieguo").innerHTML='<div style="text-align: center;">已停止</div>'
            }
        }, 1000);
    }
}