// ==UserScript==
// @name         洛谷用户顶栏精确数字显示
// @version      0.4
// @description  洛谷用户顶栏显示精确数字
// @match        *://www.luogu.com.cn/user/*
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1068192
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/468046/%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E9%A1%B6%E6%A0%8F%E7%B2%BE%E7%A1%AE%E6%95%B0%E5%AD%97%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/468046/%E6%B4%9B%E8%B0%B7%E7%94%A8%E6%88%B7%E9%A1%B6%E6%A0%8F%E7%B2%BE%E7%A1%AE%E6%95%B0%E5%AD%97%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var gs = function(name,def='') {
        if(localStorage['lg-ac-comparator-s-'+name]) return localStorage['lg-ac-comparator-s-'+name];
        return def;
    }
    var currData = null;
    var myData = null;
    for(let i=1;i<=10; i++){
        setTimeout(function(){
            //console.log('(洛谷用户顶栏精确数字显示)读取数据...');
            $.get('?_contentOnly=1',function(e){
                currData = e;
                $.get('/user/'+gs('self')+'?_contentOnly=1',function(e) {
                    myData = e;
                    //console.log('用户的数据',currData);
                    //console.log('你的数据',myData);
                    const k = document.querySelectorAll('.value');
                    for (let i = 0; i < k.length; i++){
                        if(k[i].parentNode.parentNode.parentNode.className!='stats normal'){
                            continue;
                        }
                        if(k[i].parentNode.firstChild.textContent=='关注'){
                            k[i].textContent=currData.currentData.user.followingCount;
                            //console.log('(洛谷用户顶栏精确数字显示)关注',k[i]);
                        }
                        if(k[i].parentNode.firstChild.textContent=='粉丝'){
                            k[i].textContent=currData.currentData.user.followerCount;
                            //console.log('(洛谷用户顶栏精确数字显示)粉丝',k[i]);
                        }
                        if(k[i].parentNode.firstChild.textContent=='提交'){
                            k[i].textContent=currData.currentData.user.submittedProblemCount;
                            //console.log('(洛谷用户顶栏精确数字显示)提交',k[i]);
                        }
                        if(k[i].parentNode.firstChild.textContent=='通过'){
                            k[i].textContent=currData.currentData.user.passedProblemCount;
                            //console.log('(洛谷用户顶栏精确数字显示)通过',k[i]);
                        }
                        if(k[i].parentNode.firstChild.textContent=='排名'){
                            k[i].textContent=currData.currentData.user.ranking;
                            //console.log('(洛谷用户顶栏精确数字显示)排名',k[i]);
                        }
                        if(k[i].parentNode.firstChild.textContent=='等级分'){
                            k[i].textContent=currData.currentData.user.eloValue;
                            //console.log('(洛谷用户顶栏精确数字显示)等级分',k[i]);
                        }
                    }
                })
            });
        },1000*i)
    }
})();