// ==UserScript==
// @name            花瓣工具（HuabanTool）
// @description     花瓣（huaban.com）工具。包含功能：图片批量下载。
// @version         1.4
// @author          WingsJ
// @namespace       WingsJ
// @match           huaban.com/*
// @downloadURL https://update.greasyfork.org/scripts/37786/%E8%8A%B1%E7%93%A3%E5%B7%A5%E5%85%B7%EF%BC%88HuabanTool%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/37786/%E8%8A%B1%E7%93%A3%E5%B7%A5%E5%85%B7%EF%BC%88HuabanTool%EF%BC%89.meta.js
// ==/UserScript==

(function()
{'use strict';
/*成员*/

    const urls=new Set();

    /**
     * @name 事件处理_dom变化
     * @type Function
     */
    let handler_domModified=function()
    {
        search();
    };
    /**
     * @name 处理点击事件
     * @type Function
     */
    let handler_click=function(ev)
    {
        let type=ev.target.getAttribute('data-type');
        switch(type)
        {
            case 'ExtractImageUrl':
                showResult();
            break;
        }
    };

    /**
     * @name 搜索
     * @type Function
     */
    let search=function()
    {
        let imgs=Array.from(document.querySelectorAll('img[src^="//img.hb.aicdn.com/"]'));
        let srcs=imgs.map((el)=>{return el.src.replace(/_fw236/g,'');});        //瀑布流中的预览图的后缀为 fw236 ，大图片的后缀为 fw658
        for(let el of srcs)
            urls.add(el);
    };
    /**
     * @name 显示结果
     * @type Function
     */
    let showResult=function()
    {
        let resultPage=window.open('','','');
        resultPage.document.open('text/html','replace');
        for(let value of urls.values())
        {
            resultPage.document.writeln(value);
            resultPage.document.write('<br/>');
        }
        resultPage.document.close();
    };
     /**
     * @name 初始化
     * @type Function
     */
    const initiate=function()
    {
        const css=
        `
            .HuabanTool_menu
            {
                z-index:10000;
                position:fixed;
                right:0;
                top:30%;
                padding:10px;
                background-color:skyblue;
                font-family:'Microsoft JhengHei',sans-self;
                line-height:1.2;
                text-align:center;
                border-top-left-radius:16px;
                border-bottom-left-radius:16px;
                color:#333;
            }

            .HuabanTool_menu p
            {
                margin:0;
            }

            .HuabanTool_title
            {
                padding-bottom:8px;
                border-bottom:1px solid lightblue;
                font-size:14px;
                color:white;
            }

            .HuabanTool_button
            {
                padding:4px 0;
                cursor:pointer;
                font-size:18px;
            }
            .HuabanTool_button:hover
            {
                color:blue;
            }

            .HuabanTool_link
            {
                background-color:rgba(255,255,0,0.5);
            }
        `;

        let style=document.createElement('style');
        style.innerHTML=css;
        document.head.appendChild(style);
      
        let menu=document.createElement('div');
        menu.className='HuabanTool_menu';
        menu.innerHTML='<p class="HuabanTool_title">花瓣工具</p>';
        menu.addEventListener('click',handler_click);

        let button_extractImageUrl=document.createElement('p');
        button_extractImageUrl.className='HuabanTool_button';
        button_extractImageUrl.innerText='抓取图片地址';
        button_extractImageUrl.setAttribute('data-type','ExtractImageUrl');

        menu.appendChild(button_extractImageUrl);
        document.body.appendChild(menu);
    };

/*构造*/

    initiate();

    let observer=new MutationObserver(handler_domModified);
    observer.observe(document.querySelector('#waterfall'),{childList:true,subtree:true,attributeFilter:['src']});

    search();
})();