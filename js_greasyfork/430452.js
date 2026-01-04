// ==UserScript==
// @name         vectorstock批量下载
// @namespace    http://github.com/
// @version      0.4.6
// @description  vectorstock图片批量下载
// @author       lindengxu68
// @match        *://*.vectorstock.com/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.1.2/dist/sweetalert2.all.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430452/vectorstock%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430452/vectorstock%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
      'use strict';
       function getJsonLength(jsonData){
　    　var jsonLength = 0;
    　　for(var item in jsonData){
　　　 　if(item == 'data'){
　　　　　　for(var x in jsonData[item]){
　　　　　　　　jsonLength++;
　　　　　　}
　　　 　}
　　    }
        return jsonLength;
       }
       var $ = $ || window.$;
       const path = 'C:/images/'
       var btn1 = '<button class="next down-btn">下载</button>';
       var export_json = {};
       var url_re = new RegExp('[a-zA-z]+://[^\s]*');
       $('h1').append(btn1);
       $('.down-btn').click(function(){
           var json = {};
           json.path = path;
           json.data = [];
           var img_s = $("a[target='_self']").length;
           Swal.fire({
            title: '提示',
            text: "获取到"+img_s+"张图片（包含一些广告，实际少于"+img_s+"张）",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '下载',
            cancelButtonText: '取消'
            }).then((result) => {
             if (result.isConfirmed) {
              $("a[target='_self']").each(function(){
                var href = $(this).attr('href');
                if(url_re.test(href)){
                }
                else{
                if(href.indexOf('//www.vectorstock.com/') != -1){
                 $.get(href,function(data){
                    var img_url = $(data).find('div.highres:first').attr('data-src');
                    json.data[json.data.length] = img_url;
                 });
                }
               }
             });
             Swal.fire({
              title: '成功',
              text: "是否导入到程序？实际张数"+getJsonLength(json)+"张",
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: '是的',
              cancelButtonText: '取消'
              }).then((result) => {
              if (result.isConfirmed) {
                let stext = window.btoa(JSON.stringify(json));
                $.get('https://gitee.com/api/v5/repos/lindengxu68_admin/cdn/contents/config.json',function(data){
                  var sjson = '{"access_token":"fbffae6733f1af8f0a97fdc019407701","content":"'+stext+'","sha":"'+data.sha+'","message":"机器人"}';
                  $.ajax({
                    type: "PUT",
                    url: "https://gitee.com/api/v5/repos/lindengxu68_admin/cdn/contents/config.json",
                    data: JSON.parse(sjson.replaceAll(/\\/g,'')),
                    dataType: "json"
                  });
                });
                window.location.href = 'zidongzhaotu://https://gitee.com/lindengxu68_admin/cdn/raw/master/config.json'
                Swal.fire({
                 title: '完成！',
                 text: '已经导出！',
                 icon: 'success',
                 confirmButtonText: '朕知道了'
                });
              }
             });
           }
           });
       });
})();