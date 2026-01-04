// ==UserScript==
// @name         显示坛友对慈善包的评价情况
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  遍历最近N天的慈善包贴，获取这些包在坛友中的评价
// @author       duya12345
// @match        https://keylol.com/forum.php?mod=forumdisplay&fid=271&filter=*&orderby=*
// @match        https://keylol.com/f271-1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420963/%E6%98%BE%E7%A4%BA%E5%9D%9B%E5%8F%8B%E5%AF%B9%E6%85%88%E5%96%84%E5%8C%85%E7%9A%84%E8%AF%84%E4%BB%B7%E6%83%85%E5%86%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/420963/%E6%98%BE%E7%A4%BA%E5%9D%9B%E5%8F%8B%E5%AF%B9%E6%85%88%E5%96%84%E5%8C%85%E7%9A%84%E8%AF%84%E4%BB%B7%E6%83%85%E5%86%B5.meta.js
// ==/UserScript==

var dates = 7;//从距离当前多少天的帖子开始
var positive_str = [
    "好包",
    "+1",
    "还行",
    "不错",
    "想买",
    "冲",
    "可以",
    "针不戳",
    "入了",
    "量够大",
    "舒服",
    "无敌"
];

var negative_str = [
    "拉跨",
    "pass",
    "-1",
    "不行",
    "不太行",
    "让了",
    "呵呵",
    "搞笑",
    "太绿",
    "绿油油",
    "全绿",
    "打扰",
    "贵"
];

var i,j;
var parent_list = new Array();//快写完了，发现还要开一个数组存东西，懒得想怎么传递了，干脆全局吧
var URL_list = new Array();

(async function() {
    'use strict';
    draw_button()
    URL_list = match_url(date_reg(dates));
})();

//生成需要的日期正则匹配
//输入：截止到几天前
//输出：一个含有需要的正则表达的数组
function date_reg(days) {
    var d_now = new Date().getTime();
    var reg_array = new Array();
    for (i = 0; i < days; i++) {
        reg_array.push(new RegExp(timetrans(d_now - 86400000 * i)));
    }
    return reg_array;
}

//为date_reg服务，从时间戳转换为[月+日期]
function timetrans(datestamp) {
    var date = new Date(datestamp);
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return M + '.' + D;
}

//遍历所有符合条件的帖子
async function get_all_comment(url_list){
    if(window.location.href != "https://keylol.com/forum.php?mod=forumdisplay&fid=271&filter=author&orderby=dateline"){
        alert("请先点击“最新发布”按钮");
    }
    //因为是入口函数，就写在这儿了吧
    var t = 0;
    for(let url of url_list){
        let comments = await get_comment(url);
        let judge_result = judge(comments);
        console.log("url: " + url + '\n' + judge_result.pos + '/ ' + judge_result.neg);
        draw_result(parent_list[t++], judge_result);
    }
}

//匹配符合条件的帖子，输出页面url数组
function match_url(reg_array) {
    var post_list = document.getElementsByClassName("s xst");
    var url_list = new Array();
    console.log(post_list)
    for (let post of post_list) {
        for (j = 0; j < reg_array.length; j++) {
            if (reg_array[j].test(post.innerText)) {
                url_list.push(post.href);
                parent_list.push(post.parentNode);
            }
        }
    }
    return url_list;
}

//评判包的好评度
function judge(comment_list){
    var positive_num = 0;
    var negative_num = 0;
    for(i = 0; i < comment_list.length; i++){
        for(j = 0; j < positive_str.length; j++){
            if(comment_list[i].indexOf(positive_str[j]) != -1){
               positive_num++;
            }
        }
        for(j = 0; j < negative_str.length; j++){
            if(comment_list[i].indexOf(negative_str[j]) != -1){
               negative_num++;
            }
        }
    }
    return {
        pos : positive_num,
        neg : negative_num
    }
}

//获取一个帖子下的评论
//ps：如果回贴在十页以内，全部获取；十页以上获取前十页
async function get_comment(url){
    var comment_list = new Array();
    var page_document = await get_document(url); //等待异步请求
    var pg_node = page_document.getElementsByClassName("pg");
    var page_num;
    if(pg_node.length == 0){//如果只有一页的话，就没有pg元素
        page_num = 1;
    }
    else{
        page_num = pg_node[0].childElementCount-2;
    }
    if (page_num > 10){
        page_num = 10;
    }

    for(i = 1; i <= page_num; i++){
        let other_url = url + "&page=" + i;
        page_document = await get_document(other_url);
        var comment_obj = page_document.getElementsByClassName("t_f");
        for (j = 0; j < comment_obj.length; j++){
            if(i==1 && j==0){//第一条不是评论
                continue;
            }
            comment_list.push(comment_obj[j].innerText)
        }
    }
    return new Promise((resolve, reject) => {
        resolve(comment_list);
    });
}

//请求评论网页
function get_document(url){
    return new Promise((resolve, reject) => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url, true);
        httpRequest.onload = () => resolve(string2XML(httpRequest.responseText))
        httpRequest.send();
    });
}

//将字符串转换成xml对象
function string2XML(xmlString) {
    var parser = new DOMParser();
    var xmlObject = parser.parseFromString(xmlString, "text/html");
    return xmlObject;
}

//绘制按钮
function draw_button(){
    var button_pos = document.getElementsByClassName("subforum_subject_title")[0];
    button_pos.innerHTML = "<button id=\"my_btn\" style=\"background-color: #005684; position: relative; bottom: 8px; left: 20px; text-align: center; height: 24px; padding-bottom: 2px; padding-left: 2px; padding-right: 2px; color: #fff; font-size: 14px;\">主题筛选</button>"
    var btn = document.getElementById("my_btn");
    btn.addEventListener('click',function(){
		get_all_comment(URL_list);
	},false)
}

//绘制span来显示结果
function draw_result(parent_dom, result){
    var dom=document.createElement('span');
    dom.innerHTML= result.pos+ '/ '+ result.neg;
    parent_dom.appendChild(dom);
}