// ==UserScript==
// @name         知乎手机网页美化版
// @namespace    http://tampermonkey.net/
// @version      2025/2/13
// @description  知乎手机网页版，用PC模式，去赞按钮，改元素宽度适应手机
// @author       skyyatest
// @match        *://www.zhihu.com/*
// @grant        none
// @license      longlongloveyou
// @downloadURL https://update.greasyfork.org/scripts/526714/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526714/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //屏蔽某些元素
    var idlist=[
        '.Card.TopstoryItem.TopstoryItem--advertCard.TopstoryItem-isRecommend',
        '.AppHeader-inner.css-ellrqg',
        '.css-1qyytj7',
        '.AppHeader-inner.css-11p8nt5',
        '.Button.VoteButton',
        '.Zi.Zi--TriangleDown',
        'button[aria-live="polite"]',
        '.Button.Menu-item.ContentItem-action.Button--plain',
        '.Button.VoteButton.VoteButton--up.FEfUrdfMIKpQDJDqkjte',
        '.Popover.ShareMenu.ContentItem-action',
        '.Popover.ContentItem-action',
        '.CornerButtons',
        'div[id=_scroll-padding-polyfill_]'
    ];
    var blockid=[
        {'.KfeCollection-AnswerTopCard-Container':5},     //盐选回答
        {'[class*="AuthorInfo-badgeText"]':2},            //作者简介
    ];
    hide(idlist);
    var backcolor='#ebedf0'; //页面默认颜色
    // 使用 MutationObserver 监听 DOM 变化，确保动态加载的元素也被隐藏
    var observer = new MutationObserver(function(mutations) {
        document.querySelectorAll('div').forEach(div => {div.style.backgroundColor = backcolor;});
        block(blockid);  //隐藏动态加载的作者、盐选
        mutations.forEach(function(mutation) {
            // 只有当子节点被添加时，我们才进行隐藏处理
            if (mutation.type === 'childList') {
                hide(idlist); // 再次调用 hide 函数，隐藏新加载的元素
            }
        });
    });
 
    // 配置 MutationObserver 监听 DOM 树的变化
    var config = { childList: true, subtree: true };
 
    // 选取目标节点，通常是 body 元素
    var targetNode = document.body;
 
    // 启动观察器
    observer.observe(targetNode, config);
 
    var display_width   = document.documentElement.clientWidth-10;
    var total_width     = display_width-100;
    var padding         = Math.round(display_width/120);
    var nod             = document.createElement('style');
    var str=
        'div.Topstory-container, \n'+               //知乎主页主框
        'div.Topstory-mainColumn, \n'+              //知乎主页左边文章列表框
        'div.Topstory-mainColumn img._1sezuny, \n'+ //知乎主页文章列表图片
        'div.Topstory-mainColumn video, \n'+        //知乎主页文章列表视频
        'div.QuestionHeader-main, \n'+              //知乎答案顶栏
        'div.Question-mainColumn, \n'+              //知乎答案左边文章内容
        'div.css-78p1r9, header.Post-Header, div.Post-RichTextContainer,\n'+ //知乎专栏文章
        'div.Post-Sub.Post-NormalSub>div, \n'+      //知乎专栏评论区
        'div.css-1cqr2ue, \n'+                      //知乎答案评论回复
        'div.Search-container, div.SearchMain \n'+  //知乎搜索结果列表
            '{width:' +display_width+ 'px !important;} \n'+
 
        'div.Topstory-container, \n'+               //知乎主页主框
        'div.Pc-feedAd-container, div.Pc-feedAd-card-content-detail, \n'+    //知乎主页广告卡片
        'div.QuestionHeader-main, \n'+              //知乎答案顶栏
        'div.Question-main, \n'+                    //知乎答案包括右边栏
        'div.QuestionAnswer-content, \n'+           //知乎答案页主答案
        'div.List-item, \n'+                        //知乎答案页后续答案
        'div.css-78p1r9, header.Post-Header, div.Post-RichTextContainer, \n'+ //知乎专栏
        'div.Search-container, div.List-item, ContentItem-actions \n'+        //知乎搜索结果列表
            '{padding-left:'  +padding+ 'px !important; \n'+
            ' padding-right:' +padding+ 'px !important; \n'+
            ' margin-left:2px !important; \n'+
            ' margin-right:0px !important;} \n'+
 
        'div.Pc-feedAd-card-content \n'+            //知乎主页广告外框
            '{flex-direction:column;} \n'+
        'div.Question-main \n'+                     //知乎答案包括右边栏
            '{width:' +total_width+ 'px;} \n'+
        'div.Post-content \n'+                      //知乎专栏?
            '{min-width:' +display_width+ 'px !important;} \n'+
        'div.css-1aq8hf9 {width:' +total_width + 'px !important;} \n'+        //评论框的宽度
        'button[aria-label="关闭"] {left:20px;top:100px;background-color:#4f4f4f}; \n'+                           //评论框的关闭按钮
        'div.RichContent-inner \n'+                 //知乎搜索结果
            '{overflow:hidden !important;} \n'+
        'Button.css-1x9te0t \n'+                    //知乎回答评论回复关闭按钮
            '{background:teal; right:8px; padding:0px} \n'+
        'div.Card.TopstoryItem.TopstoryItem-isRecommend, \n'+                //知乎主页文章列表卡片
            '{padding-left:'  +padding+ 'px !important; \n'+
            ' padding-right:' + '0px !important; \n'+
            ' margin-left:0px !important; \n'+
            ' background-color:#b6a8c3 !important; \n'+
            ' margin-right:0px !important;} \n'+
            '{width:' +display_width+ 'px !important;} \n'+
        'span[itemprop="text"] p \n'+
            '{font-size:17px !important;} \n'+
        'div {background:' + backcolor + ';} \n'+
        'Button.Button.Menu-item.ContentItem-action.Button--plain,\n'+
           '{width:' +50+ 'px !important;} \n'+
        '[class*="Button ContentItem-action"] {left:30px;padding-left:30px !important;} \n'+      //评论按钮稍往右移
        'span.RichContent-collapsedText,div.css-p1wstz {left:20px;position:absolute;padding-left:20px; left:10px;padding-right:10px; !importan} \n'  //收起按钮放左边
        ;
 
    nod.innerHTML=str;
    document.getElementsByTagName('head')[0].appendChild(nod);
    const colors = ['#f4d2c3', '#9bb5da', '#9bdaaf', '#ebedf0'];
    const text=['开心橙','忧郁蓝','苹果绿','灰太郎'];
    addbutton(colors);
    changecolor(colors);
    void(0);
    function addbutton(colors){
      const buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'fixed';
      buttonContainer.style.top = '10px';
      buttonContainer.style.width = display_width-50;
      buttonContainer.style.left = '15px';
      buttonContainer.style.zIndex = '9999';
      buttonContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      buttonContainer.style.border = '1px solid #ccc';
      buttonContainer.style.padding = '3px';
      buttonContainer.style.borderRadius = '1px';
      document.body.appendChild(buttonContainer);
      var i=1;
      colors.forEach(color => {
        const button = document.createElement('button');
        //button.textContent = color.charAt(0).toUpperCase() + color.slice(1); // 设置按钮文本
        button.textContent=text[i-1];
        button.style.margin = '5px';
        button.style.left = '5px';
        button.style.padding = '5px 10px';
        button.style.border = '1px solid #000';
        button.style.cursor = 'pointer';
        button.id=i;
        buttonContainer.appendChild(button); // 将按钮添加到容器中
        i++;
      });
 
    }
    function block(idlist) {  //{'.KfeCollection-AnswerTopCard-Container':5},
        idlist.forEach(function (item) {
            for (var selector in item) {
                var levels = item[selector];
                var contentItemActions = document.querySelectorAll(selector);
                contentItemActions.forEach(function (element) {
                    var currentElement = element;
                    for (var i = 0; i < levels; i++) {
                        if (currentElement.parentElement) {
                            currentElement = currentElement.parentElement;
                            if (currentElement.tagName === 'DIV') {
                                if (levels!=5){  //让盐选闪烁
                                  currentElement.style.display = 'none';
                                }else{ // 让盐选闪烁3次再隐藏
                                  let blinkCount = 0;
                                  const interval = setInterval(() => {
                                      blinkCount++;
                                      if (blinkCount <= 2) {  // 切换可见性（奇数次隐藏，偶数次显示）
                                          currentElement.style.backgroundColor='red';
                                          currentElement.style.visibility = (currentElement.style.visibility === 'hidden') ? 'visible' : 'hidden';
                                      } else {  // 闪烁结束后清除定时器并隐藏元素
                                          clearInterval(interval);
                                          currentElement.style.display = 'none';
                                      }
                                  }, 500); // 每次闪烁间隔 200 毫秒
                                }
                            }
                        } else {
                            break; // 如果没有父级了，停止查找
                        }
                    }
                });
            }
        });
    }
    function hide(idlist) {
        idlist.forEach(function(ids) {
            var contentItemActions = document.querySelectorAll(ids);
            contentItemActions.forEach(function(element) {
                element.style.display = 'none';
            });
        });
    }
    function changecolor(colors){
      // 定义按钮数据和功能
      var i=1;
      colors.forEach(color => {
        var button = document.getElementById(i);
        button.onclick = () => {
          // 改变所有 div 的背景颜色
          document.querySelectorAll('div').forEach(div => {
            div.style.backgroundColor = color;
            backcolor=color;
          });
        };
        i++;
      });
    }
})();