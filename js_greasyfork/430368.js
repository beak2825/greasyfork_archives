// ==UserScript==
// @name         百度图片自动下载
// @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F35%2F11%2F5924b8813cd01_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1630729486&t=d29eeb26b2651c869783bbc4710bd91f
// @namespace    https://github.com
// @version      0.1
// @description  快速下载(需要点击2下)
// @author       lihndengxu68
// @match        *://image.baidu.com/*
// @match        *://images.baidu.com/*
// @match        https://www.baidu.com/
// @require      https://unpkg.com/layui@2.6.8/dist/layui.js
// @require      https://cdn.jsdelivr.net/npm/jquery-tampert@1.0.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/430368/%E7%99%BE%E5%BA%A6%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430368/%E7%99%BE%E5%BA%A6%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = $ || window.$;
    var layui = window.layui
    var downloadIamge = function(imgsrc, name) {
    let image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function() {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    let event = new MouseEvent("click");
    a.download = name || "photo";
    a.href = url;
    a.dispatchEvent(event);
  };
  image.src = imgsrc;
}
    function GetUrl(urlStr) {
      var url = "?" + urlStr.split("?")[1];
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
       }
    }
      return theRequest;
    }
    function addStr(oldStr, addItem, afterWhich) {
        var strArr = oldStr.split('');
        strArr.splice(oldStr.indexOf(afterWhich) + afterWhich.length, 0, addItem);
        return strArr.join('');
    }
    function getr(new_href){
      $.get(new_href,function(dada){
         return dada
      });
    }
    var css=$('<link rel="stylesheet" href="//unpkg.com/layui@2.6.8/dist/css/layui.css">');
    $('body').append(css);
    var css1=$('<link rel="stylesheet" href="//unpkg.com/layui@2.6.8/dist/css/modules/laydate/default/laydate.css">');
    $('body').append(css1);
    var css2=$('<link rel="stylesheet" href="//unpkg.com/layui@2.6.8/dist/css/modules/layer/default/layer.css">');
    $('body').append(css2);
    if (window.location.href == "https://www.baidu.com/"){
         $('.s-user-setting-pfmenu').append('<a class="z-setting-a" href="javascript:;">批量下载图片</a>')
         var settingpage = $('<br class="br-class"><br class="br-class"><div id="z-setting-page"><form class="layui-form" id="z-setting-form"><input type="text" name="atch" required  lay-verify="required" placeholder="需要张数" autocomplete="off" class="layui-input" id="z-need"><br class="br-class"><button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button></form></div>')
         $('#form').after(settingpage)
         $('#s-top-loginbtn').remove()
         $('#z-setting-page').toggle()
         $('.br-class').toggle()
         $(".z-setting-a").click(function(){
             //$("#z-setting-page").attr("style","display:block;");
             //$(".br-class").attr("style","display:block;");
             $("#z-setting-page").toggle()
             $(".br-class").toggle()
         });
         $("#z-setting-form").submit(function(){
             var need = $('#z-need').val();
             GM_setValue('need',need)
             layui.use(['layer', 'form'], function(){
                 var layer = layui.layer;
                 var from = layui.form;
                 layer.alert('设置成功 值：'+GM_getValue('need'), {
                  icon: 1,
                  skin: 'layer-ext-demo'
                 })
             });
         })
    }
    else{
           var imgs = [];
           var downbtn = '&nbsp;&nbsp;&nbsp;<button type="button" class="layui-btn down-btn">下载已加载的所有图片</button>';
           var packagebtn = '';
           $('#tips').remove();
           $('#userInfo').remove();
           $('#topRS').remove();
           $('.searchform').append(downbtn);
           $('.down-btn').click(function(){
               $("a[target='_blank']").each(function(){
                    var href = $(this).attr('href');
                    if (href.indexOf("/search/detail?") != -1){
                        $.get('https://image.baidu.com'+href,function(dada){
                           var clo = $(dada);
                           imgs.push(clo.find("#currentImg").attr('src'));
                        });
                    }
               });
               for(var j = 0,len2=GM_getValue('need','20'); j < len2; j++) {
                   downloadIamge(imgs[j],j+'.png');
               }
           })
    }
})();