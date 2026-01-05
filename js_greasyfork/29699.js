// ==UserScript==
// @name         汉化基础套件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Chuck
// @match        http://*/*
// @grant        none
// ==/UserScript==
//使用说明
///直接文本替换
//CN([["JavaScript","2333"],["JS","僵尸"],["DOOM","末日"]]);

//指定id元素文本匹配替换
//CNId([["oneElementId","JS","僵尸"],["otherElementId","DOOM","末日"]]);

//指定id元素文本直接替换
//CNIdEasy([["oneElementId","僵尸"],["otherElementId","末日"]]);

//指定Class元素文本匹配替换
//CNId([["oneElementClass","JS","僵尸"],["otherElementClass","DOOM","末日"]]);

//指定Class元素文本直接替换
//CNClassEasy([["oneElementClass","僵尸"],["otherElementClass","末日"]]);

//暂停运行s毫秒
//CNsleep(3000)


 var CNsleep = function (d){
        for(var t = Date.now();Date.now() - t <= d;);
    };
var CN =(Arr)=>{
    var html = document.getElementsByTagName('html')[0].innerHTML;
    for(var i = Arr.length-1;i>=0;i--)
    {
        var reg = new RegExp(Arr[i][0],'g');
        html = html.replace(reg, Arr[i][1]);
    }
    document.write(html);
};

var CNId = (Arr)=>{      
    for(var i = Arr.length-1;i>=0;i--)
    {
        var html = document.getElementById(Arr[i][0]).innerHTML;
        var reg = new RegExp(Arr[i][1],'g');
        html = html.replace(reg, Arr[i][2]);
        document.getElementById(Arr[i][0]).innerHTML = html;
    }
};

var CNIdEasy=(Arr)=>{
    for(var i = Arr.length-1;i>=0;i--)
    {
        document.getElementById(Arr[i][0]).innerHTML = Arr[i][1];
    }
};

var CNClass =(Arr)=>{
    for(var i = Arr.length-1;i>=0;i--)
    {
        var list = document.getElementsByClassName(Arr[i][0]);
        var reg = new RegExp(Arr[i][1],'g');
        if(list){
            for(var idx = 0; idx < list.length; idx ++){
                var e = list[idx];
                e.innerHTML =  e.innerHTML.replace(reg, Arr[i][2]);
            }

        }
    }
};

var CNClassEasy =(Arr)=>{
    for(var i = Arr.length-1;i>=0;i--)
    {
        var list = document.getElementsByClassName(Arr[i][0]);
        if(list){
            for(var idx = 0; idx < list.length; idx ++){
                var e = list[idx];
                e.innerHTML = Arr[i][2];
            }

        }
    }
};





