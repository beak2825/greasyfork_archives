// ==UserScript==
// @name         电影天堂复制磁链
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击复制电影、电视剧链接;添加一键复制全集电视剧链接
// @author       花花nice
// @match        *://www.ygdy8.com/*
// @match        *://dy.dytt8.net/*
// @match        https://dy.dytt8.net/
// @match        https://www.ygdy8.com/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Base64/1.1.0/base64.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442305/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/442305/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.meta.js
// ==/UserScript==

$(function(){
    console.log("引入成功")
});


//var num = $("#Zoom").find("table").length
var num = $("#Zoom span table").length;
console.log("一共" + num + "集");

//判断当前页面为电影还是电视剧

    var isMovie = e => {
         return 0 === num ? true : false;
    }
    var isTv = e => {
         return 1 <= num ? true : false;
    }

if(isMovie()){
    let clipboard = ' ';
    let element = document.querySelector('#Zoom > span > a');
    let magnet = element.attributes["href"].nodeValue;

    let btn = document.createElement('button');
        btn.innerText = '复制链接';
        element.before(btn);

    btn.addEventListener('click', copyMagnet);

    function copyMagnet() {

        clipboard = navigator.clipboard.writeText(magnet)
        console.log("复制成功")
        //alert("复制成功")

    };
}




if(isTv()){
    var allLinks = [];
    for(var i = 4; i < num + 4; i++){
        //获取标签文本  -srt
        let $i = i;
        let $element = $('#Zoom > span > table:nth-child(' + $i + ') > tbody > tr > td > a')
        let srt = $element.text();
        //url 编码 encodeURI(URL)
        let ftp = encodeURI(srt);
        //console.log(ftp)
        let url = 'AA' + ftp + 'ZZ';
        //base64编码
        //官方cdn中 Base64.js编码方式为btoa(srt)
        //jquery.base64.js中，编码方式为$.base64.encode(srt)
        let urlBase64 = btoa(url);
        let thunder = 'thunder://' + urlBase64;
        //console.log(thunder);
        //将thunder输出至数组存储
        allLinks.push(thunder);


        let id = $i - 3;
        //添加单集复制按钮,放置在链接前面
        let btn = document.createElement('button'); btn.setAttribute("id", id); btn.innerText = '复制链接'; $element.before(btn);

        //定义剪贴板 添加监控click点击复制事件
        let clipboard = '';
        btn.addEventListener('click', copyThunder);
        function copyThunder(){
            clipboard = navigator.clipboard.writeText(thunder)
            console.log("第" + id + "集复制成功")
        }

    }
    //console.log(allLinks)


    let $element1 = $('#Zoom > span > p:nth-child(3) > strong > font');
    let btn1 = document.createElement('button');
    btn1.innerText = '一键复制';
    $element1.after(btn1);

    btn1.addEventListener('click', copyAllLinks);

    //将数组链接换行输出存储
    var all ='';
    for(var x = 0; x < num; x++){

        all +=allLinks[x] + '\r';

    }

    function copyAllLinks(){

        //let all = allLinks[0]+ '\r' +allLinks[1]


        let clipboard1  = navigator.clipboard.writeText(all)
        console.log("一键复制成功")

    }


}








