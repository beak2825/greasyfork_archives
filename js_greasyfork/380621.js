// ==UserScript==
// @name         CSDN博客自动阅读模式 
// @version      0.6
// @description  CSDN 去广告，自动展开其余部分，去除推荐内容、评论内容、顶部栏等区域
// @author       By Jackie From SimLine
// @match        *://blog.csdn.net/*/article/details/*
// @namespace https://greasyfork.org/users/164689
// @require https://cdn.bootcss.com/jquery/1.12.3/jquery.min.js
// @require https://cdn.bootcss.com/layer/3.1.0/layer.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/380621/CSDN%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/380621/CSDN%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
//GM_addStyle("body,html{width:100% !important;min-width:100% !important;}");
//GM_addStyle(".container{width:96% !important;}");
//GM_addStyle(".container>main{float:none !important;width:100% !important;}");
(function(){
        'use strict';

        function $(Eclass){
            var barblock = document.getElementsByClassName(Eclass);
            if(barblock[0]){
                //barblock[0].parentNode.removeChild(barblock[0]);
                barblock[0].style.display="none";
            }
        }

        setTimeout(function(){ ReadModel(); }, 50);
        
        function ReadModel()
        {
           //删除侧边栏
            var sidebar = document.getElementsByTagName('aside');
            sidebar[0].parentNode.removeChild(sidebar[0]);

           //body宽度
            document.body.style.width="100%";
            document.body.style.minWidth="100%";
            //阅读区适配屏幕
            var main = document.getElementsByTagName('main');
            main[0].style.float = "none";
            main[0].style.width = "100%";        

            //阅读区内容适配屏幕
            var mainBox = document.getElementById('mainBox');
            mainBox.style.width = "96%";
          
            $('csdn-toolbar');//顶部栏
            $('pulllog-box');//底部栏
            $('tool-box');//工具栏
            $('meau-gotop-box');//举报框
            $('comment-box');//评论栏
            $('recommend-box');//推荐栏
            $('recommend-right');//右侧栏
            $('article-info-box');//文章顶部信息
            $('adblock');//插件警告框  

            //模拟点击，展开余下内容
            document.getElementById('btn-readmore').click(); 
        }
  
       
    })();