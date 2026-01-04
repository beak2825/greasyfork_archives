// ==UserScript==
// @name         氦luogu
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0.0
// @description  try to take over the world!
// @author       abs20187
// @match        *://www.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533377/%E6%B0%A6luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/533377/%E6%B0%A6luogu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let style=document.createElement('style');
    function setcookie(name,value,days,path,domain,secure)
    {
        let cookieString=`${name}=${value}`;
        if(days)
        {
            const date=new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            cookieString+=`;expires=${date.toUTCString()}`;
        }
        if(path)
        {
            cookieString+=`;path=${path}`;
        }
        else
        {
            cookieString+=`;path=/`;
        }
        if(domain)
        {
            cookieString+=`;domain=${domain}`;
        }
        if(secure&&window.location.protocol=="https:")
        {
           cookieString+=`;secure`;
        }
        document.cookie=cookieString;
    }
    function getcookie(name)
    {
        const cookiestring=document.cookie;
        const cookie3=decodeURIComponent(cookiestring);
        const cookie2=cookie3.split('; ');
        for(let i of cookie2)
        {
             const [cname,cvalue]=i.split('=');
             if(cname==name)
             {
                 return cvalue;
             }
        }
        if(name=='backimg')
        {
            setcookie('backimg',`https://s21.ax1x.com/2025/04/17/pEhJvD0.jpg`,114514,'/','luogu.com.cn',true);
            return `https://s21.ax1x.com/2025/04/17/pEhJvD0.jpg`;
        }
        if(name=='blr')
        {
            setcookie('blr',0,114514,'/','luogu.com.cn',true);
            return 0;
        }
        if(name=='bblr')
        {
            setcookie('bblr',0,114514,'/','luogu.com.cn',true);
            return 0;
        }
        if(name=='logo-color')
        {
            setcookie('logo-color',"#3498DB",114514,'/','luogu.com.cn',true);
            return "#3498DB";
        }
        if(name=='lfe-color')
        {
            setcookie('lfe-color',"#34495E",114514,'/','luogu.com.cn',true);
            return "#34495E";
        }
        if(name=='opt')
        {
            setcookie('opt',1,114514,'/','luogu.com.cn',true);
            return "0.8,0.9";
        }
        return null;
    }
    function deleteCookie(name)
    {
        document.cookie=name+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    }
    let Img=getcookie("backimg");
    let blr=getcookie("blr");
    let blr2=blr*3;
    let bblr=getcookie("bblr");
    let logocl=getcookie("logo-color");
    let lfecl=getcookie("lfe-color");
    let opt_1=getcookie("opt");
    let opt_2=opt_1.split(",");
    let opt=opt_2[0];
    let opt1=opt_2[1];
    style.textContent = `
    /*背景*/
    html>body
    {
       background-image: url(${Img}) !important;
       background-repeat: no-repeat;
       background-size: cover;
       background-position: center;
       background-attachment: fixed;
       background-color: rgb(239, 239, 239)!important;
    }
    .wrapper.wrapped.lfe-body.header-layout.tiny
    {
      z-index:9999;
      /*background:linear-gradient(to right,rgba(255,0,0,40%),rgba(255,97,0,40%),rgba(255,255,0,40%),rgba(0,255,0,40%),rgba(0,255,255,40%),rgba(0,0,255,40%),rgba(255,0,255,40%))!important;彩虹*/
      background-color:rgba(255,255,255,${opt})!important;
      backdrop-filter:blur(20px);
      font-weight:600!important;
   }
   .user-nav
   {
      z-index:9999;
   }
   a
   {
      transition:all 0.5s ease!important;
   }
    ::selection
    {
       background-color:DarkMode_check(#264f78, #d6d6d6);
    }

    /*去除掩盖物*/
    main
    {
       background:rgba(255,255,255,0)!important;
    }
    div[data-v-fc349d1c]
    {
       background:rgba(255,255,255,0)!important;
    }
    /*专栏卡片*/
    .article-content[data-v-fc349d1c]
    {
       animation:beginup 0.5s;
       background:rgba(252,252,252,${opt})!important;
       border-radius:10px!important;
       transition:all 0.3s!important;
    }
    .article-content[data-v-fc349d1c]::before
    {
       content: '';
       position: absolute;
       top: 0; left: 0; right: 0; bottom: 0;
       backdrop-filter:blur(${blr}px)!important;
       z-index: -1;
    }
    .article-content[data-v-fc349d1c]:hover
    {
       box-shadow: 3px 3px 20px rgba(0, 0,0, 0.5);
       background:rgba(252,252,252,${opt1})!important;
    }
    .article-banner[data-v-076e399a]
    {
       animation:beginup 0.5s;
       background:rgba(252,252,252,${opt})!important;
       border-radius:8px!important;
       padding:0.1rem 1.1rem;
       margin-bottom:1rem;
       margin-top:1rem;
       transition:all 0.3s!important;
       position: relative;
    }
    .article-banner[data-v-076e399a]::after
    {
       content: '';
       position: absolute;
       height:100%!important;
       width:100%!important;
       top: 0; left: 0; right: 0; bottom: 0;
       backdrop-filter:blur(${blr}px)!important;
       z-index: -1;
    }
    .article-banner[data-v-076e399a]:hover
    {
       box-shadow: 3px 3px 20px rgba(0, 0,0, 0.5);
       background:rgba(252,252,252,${opt1})!important;
    }
    .toc
    {
       margin-left:30px!important;
       padding:10px!important;
       border-radius:8px!important;
       background:rgba(252,252,252,${opt})!important;
       position: relative;
    }
    .toc::before
    {
       content: '';
       position: absolute;
       top: 0; left: 0; right: 0; bottom: 0;
       backdrop-filter:blur(${blr}px)!important;
       z-index: -1;
    }
    .toc:hover
    {
       box-shadow: 3px 3px 16px rgba(0, 0,0, 0.5);
       background:rgba(252,252,252,${opt1})!important;
    }
    .article-comment[data-v-fc349d1c]
    {
       animation:beginup 0.5s;
       background:rgba(252,252,252,${opt})!important;
       border-radius:10px!important;
       transition:all 0.3s!important;
       padding-bottom:1rem!important;
    }
    .article-comment[data-v-fc349d1c]::before
    {
       content: '';
       position: absolute;
       top: 0; left: 0; right: 0; bottom: 0;
       backdrop-filter:blur(${blr}px)!important;
       z-index: -1;
    }
    .article-comment[data-v-fc349d1c]:hover
    {
       box-shadow: 3px 3px 20px rgba(0, 0,0, 0.5);
       background:rgba(252,252,252,${opt1})!important;
    }
    /*主站卡片*/
    .lg-article
    {
         animation:beginup 0.5s;
         border-radius:15px!important;
         background:rgba(252,252,252,${opt});
         transition:all 0.5s ease;
    }
    .lg-article::before
    {
       content: '';
       position: absolute;
       top: 0; left: 0; right: 0; bottom: 0;
       backdrop-filter:blur(${blr}px)!important;
       z-index: -1;
    }
    .lg-article:hover
    {
       box-shadow: 3px 3px 20px rgba(0, 0,0, 0.5);
       background:rgba(252,252,252,${opt1})!important;
    }
    /*底栏*/
    .background
    {
        background: #fff0!important;
    }
    .theme-bg
    {
       background: rgba(255,255,255,0)!important;
    }
    /*犇犇边框*/
    .am-comment-main
    {
       border-radius:8px!important;
       border-color:gold!important;
       background:rgba(255,255,255,0)!important;
    }
    .am-comment-main::before
    {
       border-right-color:gold!important;
    }
    .lg-left img
    {
       border-color:gold!important;
    }
    /*犇犇*/
    .am-comment-hd
    {
       background:rgba(247,247,247,${opt});
       border-top-right-radius:8px!important;
       border-top-left-radius:8px!important;
       transition:all 0.3s ease;
    }
    .am-comment-bd
    {
       background:linear-gradient(to top,rgba(255,255,255,${opt}),rgba(247 247 247 / ${opt}));
       border-bottom-right-radius:8px!important;
       border-bottom-left-radius:8px!important;
       transition:all 0.3s ease;
    }
    .am-comment-main
    {
       transition:all 0.5s ease;
       backdrop-filter:blur(${bblr}px)!important;
    }
    .am-comment-main:hover
    {
       background:rgba(255,255,255,0.3)!important;
       box-shadow: 3px 3px 15px rgba(0, 0,0, 0.5)!important;
    }
    /*主页卡片*/
    .card
    {
       animation:beginup 0.5s;
       background:rgba(252,252,252,${opt})!important;
       border-radius:15px!important;
       transition:all 0.5s ease;
        position: relative;
    }
    .card::before
    {
       content: '';
       position: absolute;
       top: 0; left: 0; right: 0; bottom: 0;
       backdrop-filter:blur(${blr}px)!important;
       border-radius:15px;
       z-index: -1;
    }
    .card:hover
    {
       box-shadow: 3px 3px 20px rgba(0, 0,0, 0.5)!important;
       background:rgba(252,252,252,${opt1})!important;
    }
    /*主页头图*/
    .user-header-top
    {
       opacity:0.85!important;
    }
    /*题目卡片*/
    .l-card
    {
       animation:beginup 0.5s;
       background:rgba(252,252,252,${opt})!important;
       border-radius:18px!important;
       transition:all 0.5s ease;
       position: relative;
    }
    .l-card::before
    {
       content: '';
       position: absolute;
       top: 0; left: 0; right: 0; bottom: 0;
       backdrop-filter:blur(${blr}px)!important;
       border-radius:18px!important;
       z-index: -1;
    }
    .l-card:hover
    {
       box-shadow: 3px 3px 20px rgba(0, 0,0, 0.5)!important;
       background:rgba(252,252,252,${opt1})!important;
    }
    /*弹窗*/
      .dropdown
      {
          border-radius: 10px !important;
          z-index:10000;
          background-color:rgba(255,255,255,${opt}) !important;
      }
      .dropdown>.l-card
      {
          margin-bottom:0px!important;
      }
      .dropdown > .center
      {
        z-index:10000;
        border-radius: 10px !important;
        background-color:rgba(255,255,255,0.98) !important;
      }
      .dropdown a:hover
     {
         filter:brightness(1.2);
      }
      .popup
      {
         border-radius: 10px !important;
        background-color:rgba(255,255,255,${opt}) !important;
        backdrop-filter:blur(${blr}px)!important;
        z-index:999;
      }
      .swal2-container
      {
         z-index:100000;
      }
      .cover-upload
      {
         z-index:1000000!important;
         background:rgba(255,255,255,${opt});
         position:static!important;
      }
      .modal>.center
      {
         z-index:5;
      }
    /*专栏单选框*/
    .checkbox
    {
      color:#ccc!important;
    }
    /*用户菜单栏/顶栏*/
    .user-nav a
    {
       transition:all 0.5s ease;
    }
    .user-nav a:hover
    {
       color:#3498db;
    }
    .user-nav[data-v-2dfcfd35]
    {
      border-radius:8px!important;
      top:0.5rem!important;
      color:white!important;
      background-color:rgba(255,255,255,0)!important;
    }
    /*侧栏*/
    #app>.lfe-body
    {
       height:27em;
       border-bottom-right-radius:30px!important;
       border-top-right-radius:30px!important;
       margin-top:10.5%!important;
       background:${lfecl}!important;
       animation:lfepop 0.5s;
       z-index:35;
    }
    #app>.lfe-body>a
    {
       height:4.2em!important;
       transition: all 0.3s;
       margin-top:5px!important;
    }
     #app>.lfe-body>.popup-button
     {
        border-radius:12px!important;
        border-width:0px;
        border-color:rgba(0,0,0,.7)!important;
        transition: all 0.4s ease;
        background-color:${lfecl}!important;
     }
     #app>.lfe-body>.popup-button:hover
     {
        background-color:rgba(244,244,244,0.5)!important;
        border-width:3px;
     }
     #app>.lfe-body>a>.text
    {
       opacity: 0;
       display: block;
       transition:opacity 0.3s;
       margin-top:0px!important;
    }
    #app>.lfe-body>a:hover
    {
       filter:brightness(1.2);
       transform:translateY(-5px)!important;
    }
    #app>.lfe-body>a:hover>.text
    {
       opacity: 1!important;
    }
    .lfe-body>div[data-v-12f19ddc]
    {
       border-top-right-radius:30px!important;
    }
    .lfe-body>div[data-v-12f19ddc]
    {
       background-color:${logocl}!important;
    }
    /*卡片内菜单*/
    .inner-card,.am-panel
    {
       background-color:rgba(255,255,255,0.7)!important;
       border-radius:8px!important;
    }
    .discuss
    {
       background-color:rgba(255,255,255,0.7)!important;
       border-radius:8px!important;
    }
    /*按钮*/
    .am-btn
    {
       border-radius:10px!important;
       top:0px!important;
       transition:all 0.3s ease;
       box-shadow: 0 0px 0px 0 rgba(0, 0, 1, 0.5)!important;
    }
    .am-btn:hover
    {
       box-shadow: 0.3px 2px 6px  0 rgba(0, 0, 1, 0.5)!important;
       transform:translateY(-2px);
    }
    .solid
    {
       border-radius:10px!important;
       top:0px!important;
    }
    .solid:hover
    {
       box-shadow: 0 0px 7px 0 rgba(0, 0, 1, 0.5)!important;
       transform:translateY(-2px);
    }
    button.lform-size-middle
    {
       border-radius:10px!important;
       top:0px!important;
    }
    button.lform-size-middle:hover
    {
       box-shadow: 0 0px 7px 0 rgba(0, 0, 1, 0.5)!important;
    }
    button.lform-size-small
    {
       border-radius:8px!important;
       top:0px!important;
    }
    button.lform-size-small:hover
    {
       box-shadow: 0 0px 2px 0 rgba(0, 0, 1, 0.5)!important;
    }
    .float-bottom
    {
       background:rgba(255,255,255,0.9)!important;
    }
    button.lfe-form-sz-middle[data-v-66fcc50b]
    {
       border-radius:10px!important;
       top:0px!important;
       transition:all 0.3s ease;
       box-shadow: 0 0px 0px 0 rgba(0, 0, 1, 0.5)!important;
    }
    button.lfe-form-sz-middle[data-v-66fcc50b]:hover
    {
       box-shadow: 0.3px 2px 6px  0 rgba(0, 0, 1, 0.5)!important;
       top:-2px;
    }
    .swal2-styled
    {
       border-radius:10px!important;
       top:0px!important;
    }
    .swal2-styled:hover
    {
       box-shadow: 0.3px 2px 6px  0 rgba(0, 0, 1, 0.5)!important;
       transform:translateY(-2px);
    }
    /*代码*/
    .cm-editor
    {
       background-color:rgba(255,255,255,0.9);
    }
    .ace_function
    {
       color:red;
    }
    .cm-editor,code,.cm-line,.monaco-editor,.lfe-code,.cm-gutters,.CodeMirror-sizer
    {
       counter-reset: line-number;
       font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace!important;
       font-size: 15px;
    }
    .lfe-marked pre,.lfe-marked pre>code
    {
       background:rgba(255,255,255,0.9);
    }
    /*选项*/
    .items>li>.entry:not(.selected)::before
    {
       left:50%!important;
       width:0%!important;
       background:#bfbfbf!important;
       transition:all 0.5s ease;
    }
    .items>li>.entry:hover::before
    {
       left:0%!important;
       width:100%!important;
    }
    .category ul>li.selected[data-v-04eb14e9]
    {
       color:white!important;
       background:#9D3DCF!important;
       border-radius:8px!important;
    }
    .selected::before
    {
       background:#3498db!important;
    }
    ul>li[data-v-01f8a102]:not(.selected)::before
    {
       left:50%!important;
       width:0%!important;
       background:#bfbfbf!important;
       transition:all 0.5s ease;
    }
    ul>li[data-v-01f8a102]:hover::before
    {
       left:0%!important;
       width:100%!important;
    }
    ul>li[data-v-01f8a102].selected::before
    {
       left:0%!important;
       width:100%!important;
       background:#3498db!important;
    }
    .category ul.luogu[data-v-d5284b7e]
    {
       border-radius:12px!important;
    }
    .category ul>li[data-v-d5284b7e]
    {
       border-radius:12px;
       transition:all 0.7s linear;
    }
    .category ul>li[data-v-d5284b7e]:hover
    {
       background:#3498db!important;
       color:white!important;
    }
    /*页码*/
    button
    {
       transition:all 0.3s;
    }
    .page-bar button
    {
       top:0px;
    }
    .page-bar button:hover
    {
       transform: translateY(-3px);
    }
    /*专栏页面*/
    .lside
    {
       background:rgba(255, 255, 255, 0.98) !important;
       backdrop-filter:blur(7px)!important;
    }
    .row.row-space-between.reply-info div:not(.text,.combo,div.row),.comment-filter-line span[data-v-0a88bc8f]
    {
       font-weight:700;
    }
    div.text.lform-size-middle
    {
       background-color:rgba(255,255,255,0.98)!important;
    }
    .top-bar
    {
       background:rgba(255, 255, 255, 0.98) !important;
       backdrop-filter:blur(10px)!important;
    }
    .name
    {
       transition:all 0.3s;
    }
    footer.lcolor-bg-grey-1
    {
       background-color:rgba(255,255,255,0.97);
    }
    .user-nav.rside
    {
       background-color:rgba(255,255,255,.98)!important;
       backdrop-filter:blur(7px)!important;
    }
    .row.title>a
    {
       transition:all 0.5s;
       letter-spacing:0.3px;
    }
    .row.title>a:hover
    {
       transform: translateY(-2px);
       color:rgba(52,152,219)!important;
       letter-spacing:1px;
    }
    span[data-v-386007e1]
    {
       border-radius:5px;
    }
    .reply-item>.meta
    {
       background:rgba(255,255,255,0.8)!important;
       border-top-left-radius:18px!important;
       border-top-right-radius:18px!important;
    }
    /*setting按钮*/
    .Hesetb
    {
       border-radius:15px;
       background:#3498db!important;
       height:30px;
       width:auto;
       color:white;
       border-width:0px;
       padding-left:10px!important;
       padding-right:10px!important;
    }
    .Hesetb:hover
    {
       filter:brightness(1.1);
    }
    /*标签*/
    .lfe-caption
    {
       border-radius:7px!important;
    }
    .luogu-tag
    {
       border-radius:7px!important;
    }
    /*讨论*/
    .author[data-v-23764882]
    {
       background:rgba(255,255,255,0)!important;
       border-top-left-radius:18px!important;
       border-top-right-radius:18px!important;
    }
    .row
    {
       background:rgba(255,255,255,0)!important;
    }
    /*头像*/
    img.avatar[data-v-ae15b82e]
    {
       transition:all .5s ease;
    }
    img.avatar[data-v-ae15b82e]:hover{
       transform:translateY(-3px);
       box-shadow: 5px 6px 10px rgba(1, 1, 1, 0.5);
    }
    /*代码块*/
    .lfe-code
    {
      border-radius:8px;
      background-color:rgba(255,255,255,0.87);
    }
    /*进度条*/
    .top-progress
    {
       z-index:999999!important;
    }
    .progress-frame
    {
       border-radius:8px!important;
    }
    .progress-frame>div
    {
       border-radius:8px!important;
    }
    /*题目列表*/
    .title.color-default
    {
       letter-spacing:0.1px;
       transition:letter-spacing 0.5s ease;
    }
    .title.color-default:hover
    {
       letter-spacing:1px;
    }
    .title.color-default:active
    {
       letter-spacing:1.3px;
    }
    /*输入框*/
    .block-item.search-text
    {
        border-radius:8px!important;
        transition:all 0.4s ease;
    }
    .block-item.search-text:hover
    {
       box-shadow:3px 7px 10px 0 rgba(0,0,0,0.5);
       transform:translateY(-3px);
    }
    #feed-content
    {
       border-radius:10px!important;
       background-color:rgba(255,255,255,0.8)!important;
    }
    .refined-input
    {
        border-radius:8px!important;
        transition:all 0.4s ease;
    }
    .refined-input:not(.search-box .refined-input):hover
    {
       box-shadow:3px 7px 10px 0 rgba(0,0,0,0.5);
       transform:translateY(-3px);
    }
    .lfe-form-sz-small
    {
        border-radius:8px!important;
        transition:all 0.3s ease;
    }
    .lfe-form-sz-small:not( .refined-input>.lfe-form-sz-small,.combo-wrapper .lfe-form-sz-small):hover
    {
       box-shadow:2px 4px 7px 0 rgba(0,0,0,0.5);
       transform:translateY(-2px);
    }
    .lfe-form-sz-middle
    {
        border-radius:10px!important;
        transition:all 0.4s ease;
    }
    .lfe-form-sz-middle:not( .refined-input>.lfe-form-sz-middle,.combo-wrapper .lfe-form-sz-middle):hover
    {
       box-shadow:3px 5px 10px 0 rgba(0,0,0,0.5);
       transform:translateY(-3px);
    }
    input.am-form-field
    {
       border-radius:10px!important;
       background-color:rgba(255,255,255,0.8);
       transition:all 0.3s ease;
    }
    input.am-form-field:hover
    {
       box-shadow:3px 5px 10px 0 rgba(0,0,0,0.5);
       transform:translateY(-2px);
    }
    .input-group.search-filter[data-v-0aa18cf0]
    {
       display:flex;
       align-items:center;
    }
    .input-group.search-filter>.refined-input
    {
       margin-right:5px;
    }
    /*私信*/
    .message-block > .message[data-v-5c0627c6]
    {
       border-radius:8px!important;
       margin:1px;
       border:gold solid 0.5px;
       background:rgba(255,255,255,0.75)!important;
       transition:all 0.3s ease;
    }
    .message-block > .message[data-v-5c0627c6]:hover
    {
       transform:translateY(-2px)!important;
       box-shadow:2px 2px 7px 0 rgba(0,0,0,0.6);
    }
    .item[data-v-4d6dca7a]
    {
       transition:all 0.5s ease;
    }
    /*测试点*/
    .test-case
    {
       border-radius:8px;
    }
    .test-case .status
    {
       font-weight:650!important;
    }
    .test-case .id
    {
       font-weight:600!important;
    }
    /*动画*/
    @keyframes beginup
    {
       0%
       {
          margin-bottom:5rem;
       }
    }
    @keyframes lfepop
    {
       0%
       {
          left:-7rem;
       }
       100%
       {
          left:0;
       }
    }
    `
    ;
    document.head.append(style);
    window.onload=function(){
    let hrefw=window.location.href//等待页面加载完成
    console.log(hrefw);
    if(hrefw=='https://www.luogu.com.cn/')
    {
        let usrnv=document.querySelector(".user-nav");
        let button = document.createElement('button');
        console.log(button);
        button.textContent="氦luogu";
        button.className="Hesetb";
        usrnv.insertBefore(button,usrnv.firstChild);
        const settingsPageContent = `
  <div class="l-card" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 10px; z-index: 10999999;">
    <h2>设置页面</h2>
    <lable for="input1">背景图片</lable>
    <input type="text" id="input1" value="${Img}" class="am-form-field" style="margin-bottom: 10px;"><br>
    <lable for="input2">卡片模糊度(0-20)</lable>
    <input type="text" id="input2" value="${blr}" class="am-form-field" style="margin-bottom: 10px;"><br>
    <lable for="input3">犇犇模糊度(0-20)</lable>
    <input type="text" id="input3" value="${bblr}" class="am-form-field" style="margin-bottom: 10px;"><br>
    <lable for="input4">侧栏LOGO颜色</lable>
    <input data-v-0ceb994e="" type="color" id="input4" value="${logocl}" class="block" style="margin-bottom: 10px;"><br>
    <lable for="input5">侧栏颜色</lable>
    <input data-v-0ceb994e="" type="color" id="input5" value="${lfecl}" class="block" style="margin-bottom: 10px;"><br>
    <lable for="input6">透明度,点击后透明度(0-1 0为完全透明)以逗号间隔</lable>
    <input data-v-0ceb994e="" id="input6" value="${opt_1}" class="am-form-field" style="margin-bottom: 10px;"><br>
    <button id="close-settings" class="am-btn am-btn-danger">保存</button>
  </div>
  <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999999;"></div>
`;
        button.addEventListener('click', () => {
  // 创建设置页面
  const settingsPage=document.createElement('div');
  settingsPage.innerHTML=settingsPageContent;
  document.body.appendChild(settingsPage);
  const input1=document.getElementById('input1');
  const input2=document.getElementById('input2');
  const input3=document.getElementById('input3');
  const input4=document.getElementById('input4');
  const input5=document.getElementById('input5');
  const input6=document.getElementById('input6');

  //绑定关闭按钮事件
  const closeButton=document.getElementById('close-settings');
  closeButton.addEventListener('click', () => {
    Img=input1.value;
    blr=input2.value;
    bblr=input3.value;
    logocl=input4.value;
    lfecl=input5.value;
      opt_1=input6.value;
    document.body.removeChild(settingsPage);
      deleteCookie("backimg");
    setcookie("backimg",Img,114514,'/',"luogu.com.cn",true);
    deleteCookie("blr");
    setcookie("blr",blr,114514,'/',"luogu.com.cn",true);
      deleteCookie("bblr");
    setcookie("bblr",bblr,114514,'/',"luogu.com.cn",true);
      deleteCookie("logo-color");
    setcookie("logo-color",logocl,114514,'/',"luogu.com.cn",true);
      deleteCookie("lfe-color");
    setcookie("lfe-color",lfecl,114514,'/',"luogu.com.cn",true);
    deleteCookie("opt");
    setcookie("opt",opt_1,114514,'/',"luogu.com.cn",true);
      location.reload();
  });
});
    }
    }
})();