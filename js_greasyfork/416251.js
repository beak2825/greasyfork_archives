// ==UserScript==
// @name         V2EX自动Block"新"注册账号
// @namespace    https://taosky.github.io/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.v2ex.com/t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416251/V2EX%E8%87%AA%E5%8A%A8Block%22%E6%96%B0%22%E6%B3%A8%E5%86%8C%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416251/V2EX%E8%87%AA%E5%8A%A8Block%22%E6%96%B0%22%E6%B3%A8%E5%86%8C%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

//设定年份（大于则Block）
var afterYear = 2019;


function getUsers(){
    let users = [];
    let cellNodes = $('.cell');
    for (let cellNode of cellNodes){
        if (cellNode.id.startsWith('r_')){
            for (let aNode of cellNode.getElementsByTagName('a')){
                if (aNode.href.startsWith('https://www.v2ex.com/member/')){
                    users.push(aNode.text);
                }
            }
        }
    }
    return users;

}
function checkBlockUser(user, timeParam){
    console.log(timeParam)
    let reg = /加入于 (\d+)/;
    $.get(`https://www.v2ex.com/api/members/show.json?username=${user}`, function(result){
            let regDate = new Date(result.created * 1000)
            if (regDate.getUTCFullYear()> afterYear){
                $.get(`https://www.v2ex.com/block/${result.id}?t=${timeParam}`);
                console.log(user + ':' + '加入于'+regDate.getUTCFullYear() +'年, ' + '已Block')
            }else {
                console.log(user + ':' + '加入于'+regDate.getUTCFullYear() +'年, ' + '未Block')
            }
        });
}
(function() {
    'use strict';
        for (let aNode of $('.top')){
        if (aNode.href.startsWith('https://www.v2ex.com/member/')){
           $.get(`https://www.v2ex.com/api/members/show.json?username=${aNode.text}`, function(result){
               let timeParam = result.created;
               if (timeParam === null){
        console.log('未登录');
        return;
    }
    let users = getUsers();
    for (let user of users){
        checkBlockUser(user, timeParam);
    }
           });
        }
    }
})();