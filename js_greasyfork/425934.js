// ==UserScript==
// @name         宁宁起爆器 (自动评论/网易云999+) NENE SWITCH
// @namespace    nene.suki
// @version      0.1
// @description  我宁宁的排面呢？当然选择999+
// @author       yui
// @match        https://music.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425934/%E5%AE%81%E5%AE%81%E8%B5%B7%E7%88%86%E5%99%A8%20%28%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E7%BD%91%E6%98%93%E4%BA%91999%2B%29%20NENE%20SWITCH.user.js
// @updateURL https://update.greasyfork.org/scripts/425934/%E5%AE%81%E5%AE%81%E8%B5%B7%E7%88%86%E5%99%A8%20%28%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E7%BD%91%E6%98%93%E4%BA%91999%2B%29%20NENE%20SWITCH.meta.js
// ==/UserScript==

(function() {
    'use strict';


//！！！！！！！！！！！看  这  里！！！！！！！！！！！！！！！！！！
var a='每条评论发送两句话，把你想说的第一句话替换在这里'
var b='然后，第二句放这儿'



function shuffle(arr) {let temp, length = arr.length;
        for (let i = 0; i < length - 1; i++) {let index = Math.floor(Math.random() * (length --));temp = arr[index];
        arr[index] = arr[length];arr[length] = temp;}return arr;}
function str2arr(m){let arr=[],num=m.length;for(let i=0;i<num;i++){arr[i]=m[i]};return arr}
function arr2str(arr){let m=arr[0], num=arr.length;for(let i=1;i<num;i++){m+=arr[i]};return m}
//console.log(arr2str(shuffle(str2arr(a))))
document.getElementsByClassName('u-txt')[0].value=String(Math.round(Math.random()*10000))+' 【经过多次封禁实验，脚本已安全，此页面22秒发一次评论】  宁宁の排面！！！'+arr2str(shuffle(str2arr(a)))+'！'+arr2str(shuffle(str2arr(b)))
for(let i=1;i<240;i++){
    setTimeout(function(){document.getElementsByClassName('u-txt')[0].value=String(Math.round(Math.random()*10000))+String(i)+'宁宁の排面 '+arr2str(shuffle(str2arr(a)))+'！'+arr2str(shuffle(str2arr(b)));document.getElementsByClassName('btn')[0].click();},22000*i)}
    // Your code here...
})();