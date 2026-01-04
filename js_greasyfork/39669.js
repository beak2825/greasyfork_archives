// ==UserScript==
// @name         豆瓣电影天涯vip资源搜索，免费观看，VIP电影，最新电影，可以观看更多18禁电影
// @namespace    http://css.thatwind.com/
// @version      1.8
// @description  在电影详情页右侧显示天涯vip资源搜索快捷链接
// @author       遍智
// @match        *://movie.douban.com/subject/*
// @match        *://www.cilimao.me/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39669/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%A4%A9%E6%B6%AFvip%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2%EF%BC%8C%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B%EF%BC%8CVIP%E7%94%B5%E5%BD%B1%EF%BC%8C%E6%9C%80%E6%96%B0%E7%94%B5%E5%BD%B1%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%A7%82%E7%9C%8B%E6%9B%B4%E5%A4%9A18%E7%A6%81%E7%94%B5%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/39669/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%A4%A9%E6%B6%AFvip%E8%B5%84%E6%BA%90%E6%90%9C%E7%B4%A2%EF%BC%8C%E5%85%8D%E8%B4%B9%E8%A7%82%E7%9C%8B%EF%BC%8CVIP%E7%94%B5%E5%BD%B1%EF%BC%8C%E6%9C%80%E6%96%B0%E7%94%B5%E5%BD%B1%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%A7%82%E7%9C%8B%E6%9B%B4%E5%A4%9A18%E7%A6%81%E7%94%B5%E5%BD%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var IfMoviePageAuto=true;//值为'true'表示自动打开磁力猫电影百科页；'false'不自动打开（留在搜索页）。

    go(IfMoviePageAuto);

    function go(IfMoviePageAuto){

        if(document.querySelector(".aside")){

            //获取电影名称
            var alltitle=document.querySelector('title').innerHTML.split(" ");
            var title='';
            for(var i=0;i<alltitle.length;i++){
                if((alltitle[i]!=''&&alltitle[i]!='\n')&&i!=(alltitle.length-1)){
                    if(title!=''){title=title+' '+alltitle[i];}
                    else{title=alltitle[i];}
                }
            }

            //添加搜索卡片DIV
            var searchDiv=document.createElement('div');
            searchDiv.className="gray_ad";
            searchDiv.innerHTML="<img style='transform:translate(0,15%);margin:0 6px;' height='16px' src='https://using-1255852948.cos.ap-shanghai.myqcloud.com/cilimaologo.png'/><a target='_blank' href='http://tianyavip.top/index.php?s=/vod-search-name-"+encodeURI(title)+".html'>"+"在天涯vip电影免费观看"+"</a>";
            var first=document.querySelector(".aside").firstChild;
            document.querySelector(".aside").insertBefore(searchDiv,first);
        }

        else if(document.querySelector('[href*="/baike/movie"]')){
            if(IfMoviePageAuto) document.querySelector('[href*="/baike/movie"]').click();
        }

        else{
            setTimeout("go(IfMoviePageAuto);",500);
        }
    }
})();