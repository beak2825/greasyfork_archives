// ==UserScript==
// @name         ChineseSubtitlesGo
// @namespace    http://torrentkitty.net/
// @include      https://www.torrentkitty.tv/search/*
// @version      0.18.524.2
// @description  在https://www.torrentkitty.tv/search/搜索特定关键字组合可以添加中文字幕直达链接
// @author       You
// @match        https://www.torrentkitty.tv/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40781/ChineseSubtitlesGo.user.js
// @updateURL https://update.greasyfork.org/scripts/40781/ChineseSubtitlesGo.meta.js
// ==/UserScript==

/*******************************************************************
* 应用的网站：https://www.torrentkitty.tv/search/
* 使用方法：在搜索框输入类似 "juy r"、"juy cmp4"或"juy c" 的关键字
* 即可在搜索结果看到直接的链接
*******************************************************************/
(function() {
    'use strict';

    //格式化文件名函数，将名字处理成类似 "abc-001" 的格式
    let formatName= function(name){
        if(name.indexOf('-')==-1){
            // 删除非数字部分
            let value =name.replace(/[^0-9]/ig,"");
            // 删除数字，只留下字母
            let alpha =name.replace(/[0-9]/ig,"");
            // console.log(value);
            // console.log(alpha);
            //字母和数字之间添加 "-"
            name=alpha +'-'+value;
        }
        return name;
    }

    // 在前面添加一列，并显示相应的超链接
    function insertUrl(item,v){
        let url = "https://www.javbus2.pw/"+v;
        let alink = '<a href="'+url+'">View</a>';
        let newElement = document.createElement("a");
        newElement.textContent=v;
        newElement.href=url;
        newElement.target="_blank";
        item.parentNode.insertBefore(newElement,item);
        // console.log(url);
    }

    // 定义删除广告节点的函数
    var delAD= function(ad_lists){
        if(ad_lists.length){
            ad_lists.forEach(function(item,index){
                if(item){
                    item.parentNode.removeChild(item);
                }
            });
        }
    };


    var videos= document.querySelectorAll("#archiveResult tr td.name");
    videos.forEach(function(item,index){
        var video_name = item.textContent.replace(/\s+/g,"");
        var len = video_name.length;
        var v = video_name;

        // 取最后一个字符
        let one = video_name.substring(len-1).toLowerCase();
        // 取最后四个字符
        let four = video_name.substring(len-4).toLowerCase();

        // 处理以 R 或 C 结尾的文件名
        if(one=="r" || one == "c"){
            v = v.substring(0,len-1);
            // console.log(v);
            v = formatName(v);
            insertUrl(item,v);
        }
        //处理以 cmp4 结尾的文件名
        else if(four=="cmp4"){
            v = v.substring(0,len-4);
            // console.log(v);
            v = formatName(v);
            insertUrl(item,v);
        }
        else{
            var nullElement = document.createElement("a");
            item.parentNode.insertBefore(nullElement,item);
        }
    });


    // 定义保存所有广告节点的数组
    let adlists= new Array();

    // 添加广告节点1
    let adNode = document.querySelector("div.wrapper>div:nth-child(12)");
    if(adNode){
        adlists.push(adNode);
        // adNode.parentNode.removeChild(adNode);
    }
    console.log(adNode);

    // 添加广告节点2
    let ad1 = document.querySelector("div.wrapper > div:nth-child(8)");
    if(ad1){
        adlists.push(ad1);
    }
    // 添加广告节点3
    let ad2 = document.querySelector("div.wrapper > div:nth-child(6)");
    if(ad2){
        adlists.push(ad2);
    }
    console.log(adlists);


    // 删除广告
    delAD(adlists);

    // Your code here...
})();




