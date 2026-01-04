// ==UserScript==
// @name         involuton monitor
// @namespace    https://www.luogu.com.cn/
// @version      0.1
// @description  监视卷王
// @author       juruo_cjl
// @match        https://www.luogu.com.cn/paste/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441952/involuton%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/441952/involuton%20monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window._feInjection.currentData.paste.data.startsWith('*监视\n')){
        var str = window._feInjection.currentData.paste.data;
        var list = str.match(/{.*?}/)[0];
        var userlist = list.substr(1,list.length-2).split(',');
        var cd=10000;
        console.log(str);
        if(str.match(/cd=[0-9]*/)){
            cd=str.match(/cd=[0-9]*/)[0];
            cd=cd.substr(3,cd.length-3);
        }
        window.onload=function(){
            document.getElementsByClassName('marked')[0].innerHTML="信息录入完成<br>监视列表："+String(userlist)+'<br>冷却时间：'+cd+'ms<br><button id="wyhak" data-v-39573478="" type="button" class="btn-delete lfe-form-sz-small" data-v-f9624136="" style="border-color: rgb(94 231 60);background-color: rgb(94 231 60);" data-v-7ade990c="">开始</button> ';
            document.getElementById('wyhak').onclick=function() {
                document.body.style.margin = "10px";
                document.title = "involuton monitor";
                function onSearch(obj) {
                    var storeId = document.getElementById('store');
                    var rowsLength = storeId.rows.length;
                    var key = document.getElementById('key').value;
                    for (var i = 1; i < rowsLength; i++) {
                        var searchText = storeId.rows[i].cells[0].innerHTML;
                        if (key == "*" || searchText.match(key)) {
                            storeId.rows[i].style.display = ''
                        } else {
                            storeId.rows[i].style.display = 'none'
                        }
                    }
                };
                var str = '<div > <select name="key" id="key"><option value="*">*</option>';
                for (var i = 0; i < userlist.length; i++){
                    str = str+'<option value="' + userlist[i] + '">' + userlist[i] + '</option>';
                }
                str = str + '</select></div><table id="store" style="white-space: nowrap;"><tr><th>用户</th><th>题号</th><th>标题</th></tr></table>';
                document.body.innerHTML = str;
                document.getElementById('key').onchange=onSearch;
                var colors = ['rgb(191, 191, 191)', 'rgb(254, 76, 97)', 'rgb(243, 156, 17)', 'rgb(255, 193, 22)', 'rgb(82, 196, 26)', 'rgb(52, 152, 219)', 'rgb(157, 61, 207)', 'rgb(14, 29, 105)'];
                var name = "灰红橙黄绿蓝紫黑";
                var lst = Array();
                var cnt = 0;
                function PARSE(first = false) {
                    console.log('开始获取信息');
                    cnt = cnt + 1;
                    var user = userlist[cnt % userlist.length];
                    var httpRequest = new XMLHttpRequest();
                    console.log('https://www.luogu.com.cn/record/list?user=' + user);
                    httpRequest.open('GET', 'https://www.luogu.com.cn/record/list?user=' + user, false);
                    httpRequest.send();
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        var content = httpRequest.responseText;
                        var patten = /decodeURIComponent\(".*?"\)/;
                        content = patten.exec(content)[0];
                        content = content.substr(20, content.length - 22);
                        content = JSON.parse(decodeURIComponent(content));
                        if(content.code==404){
                            alert('用户'+user+'未找到');
                            location.reload();
                            return 1;
                        }
                        for (var i = Math.min(content.currentData.records.result.length - 1, 19); i >= 0; i--){
                            if (content.currentData.records.result[i].status == 12){
                                if (content.currentData.records.result[i].id > lst[cnt % userlist.length]) {
                                    var prob = content.currentData.records.result[i].problem;
                                    var col = colors[prob.difficulty];
                                    var pid = prob.pid;
                                    var title = prob.title;
                                    document.getElementById('store').childNodes[0].innerHTML += '<tr><td>' + user + '</td><td>' + pid + '</td><td>' + "<a style='color:" + col + "' href='https://www.luogu.com.cn/problem/" + pid + "' target='_blank'>" + title + "</a>" + '</td></tr>';
                                    if (!first) {
                                        if (window.Notification && Notification.permission !== "denied") {
                                            Notification.requestPermission(function(status) {
                                                var n = new Notification('卷题通知', {
                                                    body: user + " 卷了 " + name[prob.difficulty] + "题 " + pid + " " + title
                                                })
                                                });
                                        } else alert(user + " 卷了 " + name[prob.difficulty] + "题 " + pid + " " + title);
                                        onSearch()
                                    }
                                    lst[cnt % userlist.length] = content.currentData.records.result[i].id
                                }
                            }
                        }
                    }
                    return 0;
                }
                for (i = 0; i < userlist.length; i++){lst[i] = 0;}
                for (i = 0; i < userlist.length; i++)PARSE(true);
                Notification.requestPermission(function(status) {
                    var n = new Notification('卷题通知', {
                        body: '通知测试'
                    })
                });
                window.setInterval(PARSE, cd);
            };
        };
    }
})();
