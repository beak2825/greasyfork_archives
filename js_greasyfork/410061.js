// ==UserScript==
// @name         必应 - 高亮显示搜索结果中的关键词(类似百度)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.bing.com/search?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410061/%E5%BF%85%E5%BA%94%20-%20%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E5%85%B3%E9%94%AE%E8%AF%8D%28%E7%B1%BB%E4%BC%BC%E7%99%BE%E5%BA%A6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410061/%E5%BF%85%E5%BA%94%20-%20%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E7%9A%84%E5%85%B3%E9%94%AE%E8%AF%8D%28%E7%B1%BB%E4%BC%BC%E7%99%BE%E5%BA%A6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    思路：
    总：bing本身已经在网站描述那里把关键词用<strong>标签包起来了，所以只需要给<strong>标签添加一个一颜色属性就行。
    重点是搜索结果的标题，需要自己给关键词添加<strong>标签。

    匹配方式：汉字采用逐字+ 匹配；字母按连在一起的字母为一个单位来匹配。

    */

    //获取搜索关键词
    let Neo_key_word = document.getElementById("sb_form_q").value

    //是否有字母
    var have_zimu = true

    let zimu_list

    //如果有字母就获取关键词中【连续】的字母，否则跳过
    if(Neo_key_word.match(/\w+/g) == null){
        have_zimu = false
    }else{
        zimu_list = Neo_key_word.match(/\w+/g)

        //字母正则字符串
        let reg_zimu_str = ""

        //去掉关键词中的字母/单词，顺便构建一下匹配字母/单词的正则字符串
        for(let i = 0; i < zimu_list.length; i++){
            Neo_key_word = Neo_key_word.replace(zimu_list[i],"")

            //把字母/单词数组做成正则字符串
            reg_zimu_str = reg_zimu_str +"|"+ zimu_list[i]
        }
        reg_zimu_str = "("+reg_zimu_str.replace("|","")+")"

        //构建字母正则
        var reg_zimu = new RegExp("("+reg_zimu_str +")","gi");
        have_zimu = true
    }


    //把关键词里面含有的正则符号转义
    Neo_key_word =Neo_key_word.replace(/([\!\$\%\^\*\(\)\{\}\[\]\=\+\-\?\<\>\.\,])/g,"\\$1")


    //构建匹配关键词的正则表达式
    var reg = new RegExp("(["+Neo_key_word+"]+)","gi");

    //获取所有结果的标题
    let all_title = document.querySelectorAll(".b_algo h2 a")
    //let all_title = document.querySelectorAll("a")

    //给匹配reg正则的字词加上<strong>标签
    for(let i=0; i <all_title.length ; i++){
        //给汉字添加<strong>标签
        all_title[i].innerHTML = all_title[i].innerHTML.replace(reg,"<strong>$1</strong>")

        if(have_zimu == true){
            //给字母添加<strong>标签
            all_title[i].innerHTML = all_title[i].innerHTML.replace(reg_zimu,"<strong>$1</strong>")
        }
        //顺便修改一下【字体大小】(感觉之前的太大了，有点占地方)
        all_title[i].style.fontSize = "17px"
    }

    //给每个<strong>标签添加颜色
    let all_strong_tag = document.querySelectorAll("strong")
    for(let i=0; i<all_strong_tag.length; i++){
        all_strong_tag[i].style.color = "#c00"//【高亮字体颜色】
    }

})();