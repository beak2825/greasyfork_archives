// ==UserScript==
// @name         MyKey
// @version      22.10.01
// @namespace    https://github.com/u0mo5
// @description  快捷键，支持查看和下载。
// @author       Think Young
// @license      MIT
// @match        *://*/*
// @grant        GM_info
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @connect      deepin.store
// @connect      unpkg.com
// @connect      cdn.bootcss.com
// @connect      *
// @require      https://unpkg.com/layui@2.8.0-beta.2/dist/layui.js
// @require      https://unpkg.com/jquery/dist/jquery.js
// @require      https://cdn.bootcss.com/jszip/3.2.2/jszip.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js

// @downloadURL https://update.greasyfork.org/scripts/452557/MyKey.user.js
// @updateURL https://update.greasyfork.org/scripts/452557/MyKey.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    var MainFunc=function(){

      
        var colletMM=function() {    
          var txt=window.location.href;    
          txt = prompt("图片地址：", txt);    
          alert(txt);    
          var url = "http://xiaomate.cn/oa/api.php";    
          url = url + "/Pic/collect? url=" + encodeURIComponent(txt) + "&type=mm";    
          window.location.href = url;
        };

        var colletWallpaper=function() {    var txt=window.location.href;    txt = prompt("图片地址：", txt);    alert(txt);    var url = "http://xiaomate.cn/oa/api.php";    url = url + "/Pic/collect? url=" + encodeURIComponent(txt) + "&type=wallpaper";    window.location.href = url;};
            
        var colletURL=function() {  kdocTitle = document.title;  if (kdocTitle == null) {    var t_titles = document.getElementByTagName("title");    if (t_titles && t_titles.length > 0) {      kdocTitle = t_titles[0];    } else {      kdocTitle = "";    }  }  kdocTitle=prompt("标题：",kdocTitle);  var link=prompt("url：",window.location.href);    var cat=prompt("分类：","");    var domain="http://xiaomate.cn";   url =domain +    "/fav/index.php?action=collect&title=" +    encodeURIComponent(kdocTitle) +    "&url=" +    encodeURIComponent(link)    +"&cat="+    encodeURIComponent(cat)    ;  window.location.href = url;};    
      
        var colletSAY=function() {var txt;if (document.selection) {txt = document.selection.createRange().text;} else {txt = window.getSelection() + "";}alert(txt);var url = "name=" + name;url = "http://xiaomate.cn/oa/api.php/Says/collect? title=" + encodeURIComponent(txt);window.location.href = url;};
        
        var goHome=function() {
          var url = "http://xiaomate.cn";     
          window.location.href = url;
        }

        var goApp=function() {
          var url = "http://xiaomate.cn/app";     
          window.location.href = url;
        }

        var goCMS=function() {
          var url = "http://xiaomate.cn/oa/admin.php";     
          window.location.href = url;
        }
        
        var closeTab=function () {
$("head").append("<link>");
var toolbarCss = $("head").children(":last");
// toolbarCss.attr({
//     rel: "stylesheet",
//     type: "text/css",
//     href:  "https://unpkg.com/browse/layui@2.8.0-beta.2/dist/css/layui.css"
// });
        layer.confirm('确认要关闭本页吗?', { icon: 3, title: '提示' }, function (index) {
            document.body.onbeforeunload = function () { };
            window.location.href = "about:blank";
            window.close();
            layer.close(index);
            layer.alert('哎呀,好像失败了呢。', {
				        skin: 'layui-layer-lan',
                        closeBtn: 0
            });
        });

    }
        
    // 复制到剪贴板
        var setClipboard=function(){
                          var text_obj = window.getSelection();
                          var text = text_obj.toString();
                          GM_setClipboard(text);
 
         }        
        
        this.init=function(){
          
            hotkeys('alt+s', function() {
                console.log("press alt+s");
                setClipboard();
            });
            
            hotkeys('alt+p', function() {
                console.log("press alt+p");
                colletMM();
            });
          
            hotkeys('alt+w', function() {
                console.log("press alt+w");
                colletWallpaper();
            });          
          
            hotkeys('alt+u', function() {
                console.log("press alt+u");
                colletURL();
            });         

            hotkeys('alt+o', function() {
                console.log("press alt+o");
                colletSAY();
            });

            hotkeys('alt+1', function() {
                console.log("press alt+1");
                goHome();
            });
            hotkeys('alt+2', function() {
                console.log("press alt+2");
                goApp();
            });
            hotkeys('alt+3', function() {
                console.log("press alt+3");
                goCMS();
            });          
            hotkeys('alt+x', function() {
                console.log("press alt+x");
                closeTab();
            });
        }
    }
    var mainfunc=new MainFunc();
    mainfunc.init();
})();