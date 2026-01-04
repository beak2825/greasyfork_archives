// ==UserScript==
// @name         CSDN博客阅读模式切换 
// @version      0.3
// @description  CSDN 阅读模式和浏览模式切换
// @author       By Jackie 
// @match        *://blog.csdn.net/*/article/details/*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/164689
// @downloadURL https://update.greasyfork.org/scripts/380631/CSDN%E5%8D%9A%E5%AE%A2%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/380631/CSDN%E5%8D%9A%E5%AE%A2%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

//GM_addStyle("body,html{width:100% !important;min-width:100% !important;}");
//GM_addStyle(".container{width:96% !important;}");
//GM_addStyle(".container>main{float:none !important;width:100% !important;}");
//
GM_addStyle("#ReadBtn{position: relative;float: right;width: auto;background: #0f9621;z-index: 99;color: white;text-align: center;margin: 5px;padding: 5px;border-radius: 5px;cursor: pointer;}");
(function(){
        'use strict';

        function $(Eclass){
            var barblock = document.getElementsByClassName(Eclass);
            if(barblock[0]){
                //barblock[0].parentNode.removeChild(barblock[0]);
                barblock[0].style.display="none";
            }
        }
          var divView = document.createElement("div");
          divView.setAttribute("id", "ReadBtn");
          divView.innerHTML ='阅读模式';
          var mainDiv=document.getElementsByTagName('main')[0];
          mainDiv.insertBefore(divView,mainDiv.childNodes[0]); 
          var url=location.href;
          if(url.indexOf('?ReadModel')<0)
          {
            divView.onclick=function()
            {              
              location.href=url+'?ReadModel';
            }
          }
          else
          {
            setTimeout(function(){ReadModel(); }, 50);
            divView.innerHTML ='浏览模式';
            divView.onclick=function()
            {              
              location.href=url.replace('?ReadModel','');
            }
          }
  
  
  
     
        
        function ReadModel()
        {
           //侧边栏
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