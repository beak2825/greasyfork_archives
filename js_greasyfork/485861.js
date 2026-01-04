// ==UserScript==
// @name         HGOJ功能增强
// @namespace    HGOJ
// @version      0.2.6
// @description  对HGOJ进行布局优化与部分功能增强
// @author       Zhangew
// @match        https://oj.techo.cool/*
// @icon         https://oj.techo.cool/favicon.ico
// @grant        none
// @license      AGPL-3.0-or-later
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @downloadURL https://update.greasyfork.org/scripts/485861/HGOJ%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/485861/HGOJ%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //引入layer弹窗css
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`)

    function isLoggedIn(){
        return document.querySelector("#profile-user").innerText != "登录";
    }
    //function getMyId(){}
    function getAccepts(doc){
        var html = doc.querySelector("#user-problems > div.whitespace-normal").children;
        var arr = new Array();
        for(var i=0;i<html.length;i++){arr.push(html[i].children[0].innerHTML)}
        //console.log(arr)
        return arr;
    }
    function getMyAccepts(ok){

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://oj.techo.cool/userinfo.php?user='+document.querySelector("#profile-user").innerText);
        xhr.onload = () => {
            if (xhr.status === 200) {
                var el = document.createElement( 'html' );
                el.innerHTML = xhr.responseText;
                //console.log(el)

                myproblems = getAccepts(el);
                ok(myproblems);
            } else {
                console.error(`Error: ${xhr.status}`);
            }
        };
        xhr.send();
    }
    var myproblems = []
    var url = window.location.pathname;
    document.querySelector("#navbar > ul:nth-child(3)").remove();
    document.querySelector("#navbar > ul:nth-child(1) > li:nth-child(7)").remove();
    document.querySelector("#navbar > ul:nth-child(1) > li:nth-child(1)").remove();
    document.querySelector("body > div.container > nav > div > div.navbar-header > a").innerText += "[PLUS]"

    switch(url){
        case "/":
            //引入layer弹窗css
            //$(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`)
            layer.msg('成功加载 HGOJ增强', {time: 5000, icon: 6});
            //$("center").after('<p></p><div class="panel panel-default news" style="margin:0 auto;"><div class="panel-heading"><h3>不好评价</h3></div><div class="panel-body"><div style="text-align:center;"><img src="https://api.szfx.top/info-card/?word=欢迎使用HGOJ" class="img-responsive" alt="欢迎卡片"/></div></div></div>');
            break;
        case '/userinfo.php':
            if (isLoggedIn()){
                console.log(1)
                getMyAccepts(function(arrme){
                    console.log(2)
                    var html = document.querySelector("#user-problems > div.whitespace-normal").children;
                    for(var i=0;i<html.length;i++){
                        if(arrme.indexOf(html[i].children[0].innerHTML) > -1){
                            html[i].className += "btn-success";
                        }else{
                            html[i].className += "btn-info";
                        }
                    }
                })
            }else{
                layer.msg('如果您想使用HGOJ增强的查看题目完成情况功能，请前去登录', {time: 5000});
            }
            break;
        case "/status.php":

            //document.querySelector("#result-tab").bootstrapTable()
            var html = document.querySelector("#result-tab > tbody").children
            for(let i=0;i<html.length;i++){
                var iname = html[i].children[1].children[0].title
                var span_name = document.createElement("span");span_name.className += "badge";span_name.innerText = iname;
                html[i].children[1].appendChild(span_name);
                if(html[i].children[3].children.length==3){
                    if( isLoggedIn()){
                        let queId = html[i].children[2].innerText
                        let subId = html[i].getElementsByClassName("label label-info")[0].innerText.split("(")[0]
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', "https://oj.techo.cool/status.php?problem_id="+queId+"&user_id=&language=-1&jresult=4&top="+subId);
                        xhr.onload = () => {
                            if (xhr.status === 200) {
                                var el = document.createElement( 'html' );
                                el.innerHTML = xhr.responseText;
                                var html2 = el.querySelector("#result-tab > tbody").children
                                var tag = true
                                for(let j=0;j<html2.length;j++){
                                    if(html2[j].children[0].innerText == subId){
                                        console.log(html2[j].children[1].innerText +' '+ subId)
                                        const xhr2 = new XMLHttpRequest();
                                        xhr2.open('GET', "https://oj.techo.cool/userinfo.php?user=" + html2[j].children[1].innerText);
                                        xhr2.onload = () => {
                                            if (xhr2.status === 200) {
                                                var el2 = document.createElement( 'html' );
                                                el2.innerHTML = xhr2.responseText;
                                                var name = el2.querySelector("#statics > thead > tr > th > div:nth-child(1)").innerText
                                                var span = document.createElement("a");span.className += "badge";span.innerText = html2[j].children[1].innerText+name;span.href = "https://oj.techo.cool/userinfo.php?user=" + html2[j].children[1].innerText;
                                                html[i].children[3].appendChild(span);
                                            } else {
                                                console.error(`Error: ${xhr.status}`);
                                            }
                                        };
                                        xhr2.send();
                                        break;
                                    }
                                }


                            } else {
                                console.error(`Error: ${xhr.status}`);
                            }
                        };
                        xhr.send();
                    }else{
                        var span = document.createElement("a");span.className += "badge";span.innerText = "登录以查看";html[i].children[3].appendChild(span);
                    }
                }
            }
            break;
    }
    //alert(url)
})();