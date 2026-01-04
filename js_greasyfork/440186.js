// ==UserScript==
// @name         Ex-sccn
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.3
// @description  更好的sccn
// @author       TianLuen
// @match        *://*.scratch-cn.cn/*
// @downloadURL https://update.greasyfork.org/scripts/440186/Ex-sccn.user.js
// @updateURL https://update.greasyfork.org/scripts/440186/Ex-sccn.meta.js
// ==/UserScript==


(function() {
    'use strict';

    $(function()//主页简化，不建议大多数人使用，所以你完全可以删除这一段。
      {
        var title = document.querySelector('.channel-menu-indexbar.row');
        if(title)
        {
            title.remove();//移除一块区域
            var dl = document.querySelectorAll('.slider-1');
            var i;
            for(i=0;i<dl.length;i++)
            {
                if(i!=1&&i!=3)//1推荐 2热门 3新作品 4站长投币。这里的意思是，主页仅保留推荐和新作品
                {
                    dl[i].remove();
                }
            }
        }
    });

    $(function()//删除回复
      {
        //var title = $(".checkbox-item");
        var title = $(".comment-line");
        var title2 = $(".sex-iconbar.row");
        //尽管所有作品和留言板都有这个按钮，但是只有在自己的领域才能用
        var test_html = '<p></p>';
        var bt = document.createElement("button");
        bt.id = "dlt";
        bt.textContent = "启用删除回复功能";
        bt.style.width = "60px";
        bt.style.height = "40px";
        bt.style.align = "center";
        bt.onclick=function()
        {
            var x = document.getElementsByClassName("comt-oper row");
            //alert(x.length);
            var i;
            for(i=0;i<x.length;i++)
            {
                var y = '<div class="report-btn delete-com-btn"><i class="ri-delete-bin-6-fill" title="删除"></i> 删除</div>';
                var z = document.createElement("div");
                z.innerHTML = y;
                x[i].appendChild(z.firstChild);
            }
        }
        title.append(test_html,bt);
        title2.append(test_html,bt);
    });

    $(function()//控制“已加鸡腿”的值
      {
        var bt = document.createElement("button");
        bt.id = "fake";
        bt.textContent = "修改“已加鸡腿”的值";
        bt.style.width = "80px";
        bt.style.height = "40px";
        bt.style.align = "center";
        bt.onclick=function()
        {
            var x = document.querySelector('.project-iconbox.project-jtbtn.active');
            var y = document.querySelector('.project-iconbox.project-like-btn.project-jtbtn');
            var z = document.createElement("div");
            if(x)
            {
                x.remove();
                z.innerHTML = '<div class="project-iconbox project-like-btn project-jtbtn"><span class="project-iconbtn" title="点赞作品"><img src="/img/icon/jt.svg"></span><span class="text">加鸡腿</span></div>';
                document.querySelector('.scratch-player-bottom').appendChild(z.firstChild);
            }
            else
            {
                y.remove();
                z.innerHTML = '<div class="project-iconbox project-jtbtn active"><span class="project-iconbtn"><img src="/img/icon/jt.svg"></span><span class="text">已加</span></div>';
                document.querySelector('.scratch-player-bottom').appendChild(z.firstChild);
            }
        }
        var title = $(".row.mt-10");
        title.append(bt);
    });

    $(function()//除广告，现在好像已经没广告了，但还是保留着。
      {
        $(function()//adunit标签的广告
          {
            var del_ad = document.querySelectorAll('.adunit');
            for(var i=0;i<del_ad.length;i++)
            {
                del_ad[i].remove();
            }
        });
        $(function()//adsbygoogle标签的广告
          {
            var del_ad = document.querySelectorAll('.adsbygoogle');
            for(var i=0;i<del_ad.length;i++)
            {
                del_ad[i].remove();
            }
        });
        $(function()//ins类型的广告
          {
            var del_ad = document.querySelectorAll('ins');
            for(var j=0;j<50;j++)
            {
                for(var i=0;i<del_ad.length;i++)
                {
                    del_ad[i].remove();
                }
                setTimeout(function(){del_ad = document.querySelectorAll('ins');},50);
            }
        });
    });

})();
