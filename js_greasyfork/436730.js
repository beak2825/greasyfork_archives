// ==UserScript==
// @name        下载亿方扫描版PDF
// @namespace   yifang PDF images
// @supportURL  http://www.yeyezai.com/
// @match       *://v2.fangcloud.com/*
// @require     https://cdn.staticfile.org/jquery/1.12.1/jquery.min.js
// @grant       none
// @version     1.0
// @author      yeyezai
// @license     MIT
// @date        2022-05-26
// @descrition  下载亿方扫描版PDF，以图片方式保存至本地
// @description 2021-11-30 11:57:56
// @downloadURL https://update.greasyfork.org/scripts/436730/%E4%B8%8B%E8%BD%BD%E4%BA%BF%E6%96%B9%E6%89%AB%E6%8F%8F%E7%89%88PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/436730/%E4%B8%8B%E8%BD%BD%E4%BA%BF%E6%96%B9%E6%89%AB%E6%8F%8F%E7%89%88PDF.meta.js
// ==/UserScript==


$(document).ready(function () {
    //添加样式
    var btnStyle="<style>"
    +"#btnDiv{font-size:14px; position:fixed; left:0px; top:15%; z-index:65536;}"
    +"</style>";

    //添加按钮
    var btnAll = "<div><input type='button' id='btn_ShowImage' value='显示当前页'></div>"
    +"<div><input type='button' id='btn_saveAsLocalImage' value='另存图片为'></div>";
    var btnDiv = "<div id='btnDiv'>" + btnAll + "</div>"+btnStyle;
    $("body").append(btnDiv);

    //显示当前页
    var btn_ShowImage = document.getElementById("btn_ShowImage");
    bindButtonEvent(btn_ShowImage, "click", ShowImage);

    //图片另存为
    var btn_saveAsLocalImage = document.getElementById("btn_saveAsLocalImage");
    bindButtonEvent(btn_saveAsLocalImage, "click", saveAsLocalImage);
});

/****************************************/

function bindButtonEvent(element, type, handler){
    if(element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        element.attachEvent('on'+type, handler);
     }
}

function getCanva(){
    var canName = "page_" + document.getElementById("pageNumInput").value;
    var mycanvas = document.getElementById(canName);
    var image    = mycanvas.toDataURL("image/png");
    return image;
}

//测试，获取亿方Canvas
function getCanva1(){
    var Canvas = document.getElementsByTagName( 'canvas' );
    var canva;
    var image;
    for ( var i = 0; i < Canvas.length; i++ ){
        canva = Canvas[ i ];
        image = canva.toDataURL("image/png");
        return image;
    }
}

function getCanvas(page){
    var Canvas = document.getElementsByTagName("canvas");
    var canva = Canvas[page-1];
    var image = canva.toDataURL("image/png");
    return image;

}


/*****************************/
/**
  * 在本地进行文件保存
  * @param  {String} data     要保存到本地的图片数据
  * @param  {String} filename 文件名
  */
var  saveFile =  function (data, filename){
     var  save_link = document.createElementNS( 'http://www.w3.org/1999/xhtml' ,  'a' );
     save_link.href = data;
     save_link.download = filename;

     var  event = document.createEvent( 'MouseEvents' );
     event.initMouseEvent( 'click' ,  true ,  false , window, 0, 0, 0, 0, 0,  false ,  false ,  false ,  false , 0,  null );
     save_link.dispatchEvent(event);
};

/****************************************/

//显示当前页
function ShowImage (){
    var curPage = $(".page-number input").val();//获取当前页码
    var title = $(".name-box .name").text(); //获取当前文件名称
    var image = getCanvas(curPage);
    var w=window.open();
    w.document.title = title + "_"+ curPage;
    w.document.write("<img src='"+image+"' alt='from canvas'/>");
}

//图片另存为
function saveAsLocalImage() {
    var Canvas = document.getElementsByTagName("canvas");
    var title = $(".name-box .name").text(); //获取当前文件名称
    var PageNum;
    var canva;
    var image;
    var imgData;
    var filename;

    for(var i =0; i < Canvas.length; i++){
        canva = Canvas[i];
        PageNum = i+1;
        image = canva.toDataURL("image/jpeg");
        imgData = image.replace("image/jpeg", "image/octet-stream;");
        filename = title + "_" + PageNum + ".jpg";
        setInterval(saveFile(imgData, filename),3000);
    }

}

