// ==UserScript==
// @name               LiEMS
// @name:en            LiEMS
// @description        LiEMS强化扩展工具
// @description:en     An enhanced and extended tool for LiEMS.
// @namespace          https://github.com/HaleShaw
// @version            1.3.9
// @author             HaleShaw
// @copyright          2023+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-ALLuculent
// @supportURL         https://github.com/HaleShaw/TM-ALLuculent/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAChTxb/nUgL/7FtPf/Ur5X/oE4U/55KD//gxbL/5M28/6RWHv+hTxX/2bih/93BrP+iUxr/oVAX/9m5of/Jmnn/nEYK/6BNE//Rqo7/o1Qb/6NTGv+/h1//w49q/9Gqjv/Jm3r/sW0+///+/v/CjWf/zqWH//7+/v///////////6FPFf/HlnT/272n/72DWv/CjWf/vINa/8KNZ//GlHH/vYNa/8iYdv/Fk2//w49p/8GLZf+/iGD/voZf/8uefv+ycEL/1K+U/9u7pf+pXSj/3b+q/+jTxf+9hFz/z6aI/65nNv+uaTj//////8CJY//NooT///7+////////////o1Mb/+vbz//59PH/tnZJ/9q7pP/VsZj/vYNa/7l9Uv/ZuKD/+PLu/+/h1/+0c0X/2big/9q7pP+8gln/y55//8maef/+/fz/48u6/6RVHv/AiWP/3sGt/76FXf+4ek//o1Ma/69pOP//////wYtl/86khv////////////////+iURj/6NXH//n18v+3eUz/2bmi/9KskP+9g1v/u4BX/9CpjP/z6eL/8ebd/7RzRf/XtZz/2Lae/7yDWv/Lnn//xZJu//38+//jy7r/oVAW/7NxQv/Wspn/voVd/59LEP+/h2D/rmk4//n18f/BimT/zKCB//n08f///////////6BMEv/n08T/+fTx/7V1SP/Ytp7/0aiM/76FXf/OooX/tXFF/8CIYf/KnHv/t3hM/9axmP/WtJv/vIJa/8uefv/EkGz//fv6/+LJt/+lVyD/z6eK/+LItv+9g1r/rGQy/97Brf+wazv/2rqi/6tjMP+xbj7/2bmi////////////uXNJ/+zd0f/79vT/yJRz/+HHtP/fu6j/zp6A/+vXzP+8c0z/tGk8/+LIt//KkXL/4cKw/+DFsf/MoIH/2Laf/9Oskf/9/Pv/6dfK/7RyRP+vajn/yZt5/86khv/No4X/59PE/8WSb//Km3v/sW0+/7FtPf/Jm3r////////////s2c3/+vb0//L47f/v4tj/9vDq/+rm2P/y4tv/+Pn0/+fUxf/p0cX/+Pr0/+fYyf/u7OD/9u7p/+vazv/t3tP/7d7S//Xs5v/y597/5tDA/+PKuf/p1sj/7NvQ/+7g1f/w5dz/6dfK/+vazv/lz7//5c6+/+/h1////////////8vju//9/fz/xN6x/9zs0f/3+vT/n8qB/+fz4P/n8t//ocyD/9Pnxv/r9eX/m8d6/63Tk//z9Oz/062S/8eXdP/Hl3T/xJJu/8aUcf/Jmnr/ypx7/8iZd//Il3X/x5Zz/8aUcf/ImXf/yJd2/8qbev/Jm3r/2Lae//79/f//////nMh8//f69f+y0pf/rNCQ//j79f9trT3/u9ml/+Pv2f9dpSf/ksJu//L37v9Tnxr/Yact/+Tq1v+9gVn/m0QH/5tEB/+bRAb/m0QH/5tEB/+bRAf/m0QH/5tEB/+bRAf/m0QH/5tEB/+bRAf/m0QH/5tEB/+vaTj/+PLu//////+nzIj/7vXp/87ivP+Tv2z//P36/4+9Z/+VwW//8ffs/3WtQ/9wqz3//P37/3KsQP9Nlw7/0eTA/9KjiP+YQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/6NTG//s3NH//////7jVnv/b6s7/5fDc/4O2V//1+fL/tNOa/3iwSP/z+O7/k8Bt/1edG//s9OX/msR3/0SRAv+x1Zn/5MW1/5pDBf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/nUgM/9/Dr///////0uTC/8Xdsf/z+O//hbdZ/+Xv2//T5cT/YKEn/+jx4P+21Z3/TJYM/9Tmxf++2af/SZQI/4i+Y//y5d3/ok8X/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+aQQP/zKGB///////n8d//rc+Q//n89/+cxXn/xNyv/+716P9cnyL/0OTA/9jpy/9Mlg3/stKX/93r0f9RmRT/a6s5//Du5P+vYzP/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+7gVf//v39//r7+P+pzYv/9fnx/7XTm/+ny4j//f38/26qO/+szo//6/Pk/2CiJ/+NvGX/7/Xp/2GiKf9Wnhz/2+rO/8GFYP+YQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/5lAAf+ZQAH/mUAB/6ZYIf/38Ov//v7+/6nNi//n8N7/3OvQ/4O2V///////lMBv/4u7Yv/1+fH/e7JM/2ypOP/3+vT/g7ZW/0qWC//F4LT/1qmR/5hAAf+ZQAH/mUAB/5xGCf/AiGL/yZp5/8maef/Jmnn/yZp5/8maef/Jmnn/yZp5/8maef/Jm3r/y59///fx7P//////wtut/9zq0P/s9OX/bqo6//7//v+716P/bak5/+716P+exnz/SpUJ//H26/+fx33/RZIC/5/Ngv/s0Mb/mUAB/5lAAf+ZQAH/nEYK/97Brf/8+fj//Pn4//z5+P/8+fj//Pn4//z5+P/8+fj//Pn4//z5+P/8+fj//v79///////W58j/vNil//j79v+FuFr/3+zU/9rpzf9opzP/3+3V/8jftf9DkQD/0OO//8besv9LlQv/fLhT//v39f+dRwv/mUAB/5lAAf+ZQAH/yJh2/////////////////////////////////////////////////////////////////+zz5f+v0JL//f79/53Fe/+816T/8vft/2emMf/C263/4u7Y/0uWC/+lyob/3evR/1ecG/9ipCv/8vnv/7NpPP+YQAH/mUAB/5lAAf+xbT7//v79/////////////////////////////////////////////////////////////f38/6vNjf/x9+3/yN+1/5nDdf/6/Pn/gbVV/6PJgv/1+PH/ZqUw/4O2V//s9Ob/bKk4/0+XEP/c7tP/xpFv/5lAAf+ZQAH/mUAB/6NSGv/48+//////////////////////////////////////////////////////////////////tNOZ/9/s0//q8+P/ebBJ//j79v+ny4f/f7RR//j69f+Ctlb/Y6Mr/+716P+IuV7/SZQI/8Hdrf/atZ//m0QH/5lAAf+ZQAH/m0UI/+jVx////v7////////////////////////////////////////////////////////////N4rv/zOG6//f69P94sEj/7/Xp/8XdsP9npjD/8Pbr/6nNi/9RmRP/3+zU/67Pkv9EkQH/msZ5/+zVyv+eSxD/mUAB/5lAAf+aQQP/17Wd//7+/v///////////////////////////////////////////////////////////9zr0P+21Jz//P38/4e4XP/Z6Mv/4OzV/2imMv/X6Mn/y+G5/0mUCf++2af/0eTB/0mUCP9zsUX/9+vn/6dZJP+YQAH/mUAB/5lAAf/Dj2r//fz6////////////////////////////////////////////////////////////7vXo/6zOjv/7/Pn/qs2M/7bUnP/w9uv/cqxA/7fVnv/t9Of/T5gR/53Ge//l79v/XaAk/1CcFf/2+PL/uHJI/5hAAf+ZQAH/mUAB/7JvP//69/T////////////////////////////////////////////////////////////4+/b/qs2M//H37f/O4rz/kb5q//n79/+Mu2P/kr9r//7+/f9opjL/e7JN/+vz5P92r0X/RJIC/9nu0f/Lk3X/mUEC/5lAAf+ZQAH/o1Ma//Tr5P////////////////////////////////////////////////////////////7+/v+51qD/3evR/+ry4v+AtFP/8vfu/6/Qk/9vqzz//f38/4+9Z/9ioyr/5vDd/5bCcf9DkAD/stme/926pv+cRQj/mUAB/5lAAf+aQgP/6NTG/////////////////////////////////////////////////////////////////8/jvv/H3rP//P37/3mwSf/k79v/0+XD/1yfIv/t9Ob/s9KZ/1KaFf/U5cT/udah/0SRAP+Pw23/6dXI/6NQF/+ZQAH/mUAB/5lAAf/Ur5T///7+////////////////////////////////////////////////////////////5/Hf/7DRlP//////lMBt/8zhuv/p8uH/ZKQs/9TlxP/W58f/UZkT/7bUnf/Y6Mr/TJYM/2+uP//v6+D/rGEv/5lAAf+ZQAH/mUAB/7+IYf/8+/r///////////////////////z6+f/x5t3/9e3n///////////////////////z+O7/ocd///////+005r/psuG//b58/96sUv/stKX/+z05v9coCL/j71n/+716P9doCP/V54d/+fx3/++f1j/mUAB/5lAAf+ZQAH/rmg3//fw6///////////////////////8OPZ/+jTxf/kzb3/+/f1//////////////////v9+v+rzo7/9fnx/9Llw/+Sv2v/+Pv2/5nDdf+PvWf/+Pv3/3qxS/9vqzz/8Pbr/3iwSf9GkgX/z+bB/9Kkiv+YQAH/mUAB/5lAAf+hUBb/8OPa//////////////////79/f/s3dH/48y7/+TOvf/z6eL//////////////////v7+/7rXov/Y6Mr/7vXo/4G1VP/t9Of/wdur/2ypOP/6/Pj/mMNz/1qeH//g7dX/ncV6/0OQAP+w1Zj/4sa1/5xGCf+ZQAH/mUAB/5tEBv/fxLH//////////////////fz7/+7f1P/auaP/5c+///Hm3f/////////////////+//7/3OrQ/7TTmv/6/Pn/hLdY/9Xnx//e69L/TZcO/+ry4v+816T/T5gR/8Pcrf/B2qv/Q5AA/4G3V//r3tH/p1ch/5lAAf+ZQAH/mUAB/8mbe//////////////////+/v7/69rN/9aymP/dv6v/9/Dr///////////////////////2+fL/yuC4//3+/P/I3rT/3OrQ//f69P+exnz/6fLh/+fx3/+dxXr/0eTB/+716P+XwnL/qc6M//Px6f/RqY3/xpVy/8aVcv/FlHH/2rqj//39/P/////////////////38Ov/4sq4/+jUxv/+/f3/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @match              http://168.168.12.8/Liems/Login.jsp
// @match              http://168.168.12.8/Liems/login.html
// @match              http://168.168.12.8/Liems/newHomePage/index.jsp
// @match              http://168.168.12.8/Liems/newHomePage/newTask.jsp
// @match              http://168.168.12.8/Liems/home/500.html
// @match              http://168.168.12.8/Liems/web/web04/zxks.jsp*
// @match              http://168.168.10.87:8081/*
// @match              http://168.168.10.62:9015/*
// @match              https://dsp.gdg.com.cn/*
// @match              http://10.129.20.124:7001/*
// @match              http://10.129.20.124:8888/*
// @match              http://10.129.18.96:8080/*
// @match              https://mdsp.gdg.com.cn:9443/*
// @match              https://oms.gdg.com.cn/*
// @match              http://10.45.8.1:8080/*
// @match              http://10.45.8.5:8080/*
// @match              http://10.89.3.21:18080/*
// @match              http://10.89.3.89:18081/*
// @match              http://119.39.117.179:18080/*
// @match              http://119.39.117.179:18081/*
// @match              http://172.16.20.10:18080/*
// @match              http://172.16.20.13:18081/*
// @match              http://111.22.244.246:18080/*
// @match              http://111.22.244.246:18081/*
// @exclude            *://*/mobile/*
// @exclude            *://*/app/dk/wf/tool/drawing/*
// @exclude            *://*/bftool/init*
// @exclude            *://*/web/*
// @compatible         Chrome
// @grant              unsafeWindow
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_listValues
// @grant              GM_addStyle
// @grant              GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/496541/LiEMS.user.js
// @updateURL https://update.greasyfork.org/scripts/496541/LiEMS.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  const SNIPPETS = {
    OMSStyle: `
        /* 验证码图片 */
    div.capimg,
    div.capimg > img {
      width: 440px !important;
      height: 140px
    }

    div.capimg {
      margin-left: unset !important;
    }

    #pwd_captcha {
      width: 440px !important;
    }

    .app-body {
      min-width: unset !important;
    }

    .box {
      width: 360px !important;
    }

    .theme-heo .logo {
      background: unset !important;
      line-height: 44px;
      vertical-align: middle;
      text-align: center;
      color: white;
    }

    .breadcrumb,
    #sign-box > .login-tab,
    div.aside > ul > li:nth-child(1),
    div.aside > ul > li:nth-child(2),
    div.aside > ul > li:nth-child(3) > a,
    div.aside > ul > li:nth-child(3) > span,
    div.aside > ul > li:nth-child(3) > ul > li:nth-child(2),
    div.aside > ul > li:nth-child(3) > ul > li:nth-child(3),
    #sign-footer{
      display: none !important;
    }

    .aside {
      width: 0px;
    }
    .main {
      margin-left: 0px;
    }

    body > div > div.wrap > div.aside > ul > li:nth-child(3) > ul {
      display: block;
    }
    body > div > div.wrap > div.aside > ul > li:nth-child(3) > ul > li:first-child {
      position: fixed;
      top: 0px;
      left: 200px;
      z-index: 999;
      display: block;
    }

    body > div > div.wrap > div.aside > ul > li:nth-child(3) > ul > li:first-child >a {
      color: #fff;
      font-weight: bold;
      padding: 12px 20px;
    }
    body > div > div.wrap > div.aside > ul > li:nth-child(3) > ul > li:first-child >a:hover {
      background-color: #3a81eb;
    }

    body > div > div.wrap > div.aside > ul > li:nth-child(3) > ul > li:first-child >a >i {
      display: none !important;
    }

    #list-pagination {
      float: left !important;
      margin-left: 0;
    }

    #table-om-asset {
      width: 360px !important;
    }

    /* sever 搜索框 */
    #form-search-asset {
      position: fixed;
      left: 390px;
    }

    #table-om-asset > thead > tr.filter > td {
      padding: unset !important;
    }

    #table-om-asset td {
      padding: 2px 10px !important;
    }

    .main > .content > .content-body > .toolbar,
    #table-om-asset > thead > tr:nth-child(2),
    #table-om-asset > thead > tr > td:nth-child(3),
    #table-om-asset > thead > tr > td:nth-child(4),
    #filter-asset-group,
    #table-om-asset > thead > tr:nth-child(2) > th:nth-child(2),
    #table-om-asset > thead > tr:nth-child(2) > th:nth-child(3),
    #table-om-asset > tbody > tr > td:nth-child(2),
    div.main > div.content > div.content-header.has-tab,
    #filter-om-rule,
    td > span.tcm {
      display: none !important;
    }

    #table-om-asset > tbody > tr:nth-child(2) > td:nth-child(4) > div,
    #table-om-asset > tbody > tr:nth-child(21) > td:nth-child(4) > div,
    #table-om-asset > tbody > tr:nth-child(23) > td:nth-child(4) > div {
      color: blue;
    }
    #table-om-asset > tbody > tr:nth-child(14) > td:nth-child(4) > div {
      color: red !important;
    }

    #table-om-asset > tbody > tr:nth-child(17) > td:nth-child(4) > div {
      color: orange;
    }

    .box {
      margin-bottom: 0 !important;
    }

    .toolbar {
      margin-bottom: 5px;
    }

    .content-body {
      padding: 5px 20px 0px 20px !important;
    }
    `,
    LiEMSMainStyle: `
    /* 调整常用菜单高度 */
    .menus-usual,
    .menus-add {
      height: 61px !important;
    }

    /* 隐藏常用菜单图标、访问频率 */
    .menus-img,
    .menus-info,
    .menus-state {
      display: none !important;
    }

    /* 常用菜单居中 */
    .menus-title {
      width: unset !important;
      float: unset !important;
      padding-right: unset !important;
      text-align: center !important;
    }

    /* 调整标签右键菜单边距 */
    .mu-tabs-item {
      padding: 0 15px 0 15px !important;
    }
    `,
    LiEMSOnlineUsersHtml: `
    <div>
      <div class="modalHeader">
        <h2>在线用户</h2>
        <button type="button" class="modalClose">×</button>
      </div>
      <div class="modalContent">
        <table class="banner-online-wrap">
          <thead>
            <tr>
              <th title="用户名" class="usr-info name">用户名</th>
              <th title="公司名" class="usr-info org">公司名</th>
              <th title="登录地址" class="usr-info address">登录地址</th>
              <th title="登录时间" class="usr-info time">登录时间</th>
              <th title="登录终端" class="usr-info terminal">登录终端</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>admin</td>
              <td>192.168.1.100</td>
              <td>2021-08-01 10:00:00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `,
    LiEMSOnlineUsersStyle: `
    #onlineUsersModal {
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      z-index: 99999 !important;
      -webkit-tap-highlight-color: transparent;
      display: flex;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      flex-direction: row;
      justify-content: center;
      transition: background-color 0.1s;
    }

    #onlineUsersModal > div {
      background: #fff;
      max-width: 100%;
      padding: 1.25em;
      border: none;
      border-radius: 5px;
      position: relative;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: center;
    }

    #onlineUsersModal .modalHeader {
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    #onlineUsersModal .modalClose {
      display: flex;
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      align-items: center;
      justify-content: center;
      width: 1.2em;
      height: 1.2em;
      padding: 0;
      overflow: hidden;
      transition: color 0.1s ease-out;
      border: none;
      border-radius: 5px;
      background: 0 0;
      color: #ccc;
      font-family: serif;
      font-size: 2.5em;
      line-height: 1.2;
      cursor: pointer;
    }

    #onlineUsersModal .modalClose:hover {
      color: red !important;
    }

    #onlineUsersModal .modalContent {
      display: flex;
      line-height: 1.75rem;
      margin: 1em 0 1em 0;
    }

    #onlineUsersModal table {
      border-collapse: collapse;
    }

    #onlineUsersModal table head{
      display: table;
      table-layout: fixed;
    }

    #onlineUsersModal table tr,
    #onlineUsersModal table th,
    #onlineUsersModal table td {
      border: 1px solid #e7e8ef;
    }

    .modalContent thead tr {
      color: #70757c;
      background: #f4f5f9;
    }

    .modalContent tbody {
      display: block;
      max-height: 20rem;
      overflow-y: auto;
      table-layout: fixed;
    }

    /* 隐藏tbody滚动条但保留滚动功能 */
    .banner-online-wrap tbody {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE和Edge */
    }

    .banner-online-wrap tbody::-webkit-scrollbar {
      display: none; /* Chrome, Safari和Opera */
    }

    .modalContent thead tr,
    .modalContent tbody tr {
      display: table;
      table-layout: fixed;
    }

    .modalContent .usr-info {
      text-align: center;
      padding: 0 10px;
    }

    .modalContent .usr-info.tochat {
      cursor: pointer;
      color: #4880ff;
    }

    .modalContent .usr-info.name {
      width: 5rem;
    }

    .modalContent .usr-info.org {
      width: 20rem;
    }

    .modalContent .usr-info.address {
      width: 9rem;
    }

    .modalContent .usr-info.time {
      width: 10rem;
    }

    .modalContent .usr-info.pc {
      background: url(../../prod/static/pc.png) center center no-repeat;
      width: 80px;
    }

    .modalContent .usr-info.mobile {
      background: url(../../prod/static/mobile.png) center center no-repeat;
      width: 80px;
    }
    `,
    LiEMSShortcutHelpHtml: `
    <div>
      <div class="modalHeader">
        <h2>LiEMS 快捷键</h2>
        <button type="button" class="modalClose">×</button>
      </div>
      <div class="modalContent">
        <div class="contentIndex">
          <p class="contentGrey">1</p>
          <p>2</p>
          <p>3</p>
          <p class="contentGrey">4</p>
          <p class="contentGrey">5</p>
          <p class="contentGrey">6</p>
          <p class="contentGrey">7</p>
          <p class="contentGrey">8</p>
          <p class="contentGrey">9</p>
          <p class="contentGrey">10</p>
          <p>11</p>
          <p>12</p>
          <p>13</p>
          <p>14</p>
          <p class="contentGrey">15</p>
          <p class="contentGrey">16</p>
          <p class="contentGrey">17</p>
          <p>18</p>
          <p>19</p>
          <p>20</p>
          <p>21</p>
          <p>22</p>
          <p>23</p>
          <p class="contentGrey">24</p>
          <p>25</p>
        </div>
        <div class="contentLeft">
          <p class="contentGrey">Alt + F1</p>
          <p>Alt + Shift + F</p>
          <p>Esc</p>
          <p class="contentGrey">Alt + Shift + W</p>
          <p class="contentGrey">Alt + Shift + O</p>
          <p class="contentGrey">Alt + Shift + E</p>
          <p class="contentGrey">Alt + Shift + R</p>
          <p class="contentGrey">Alt + Shift + Q</p>
          <p class="contentGrey">F4</p>
          <p class="contentGrey">Shift + F4</p>
          <p>F8</p>
          <p>Ctrl + F8</p>
          <p>Alt + F8</p>
          <p>Shift + F8</p>
          <p class="contentGrey">Alt + T</p>
          <p class="contentGrey">Alt + Shift + T</p>
          <p class="contentGrey">Ctrl + Alt + Shift + T</p>
          <p>Ctrl + Alt + Shift + ←</p>
          <p>Alt + Shift + ←</p>
          <p>Alt + Shift + →</p>
          <p>Ctrl + Alt + Shift + →</p>
          <p>Alt + Shift + ↑</p>
          <p>Alt + Shift + S</p>
          <p class="contentGrey">Alt + Shift + P</p>
          <p>Alt + Shift + M</p>
        </div>
        <div class="contentRight">
          <p class="contentGrey">打开/关闭快捷键帮助</p>
          <p>打开菜单，并选中输入框中内容</p>
          <p>关闭弹窗；打开/关闭菜单；关闭快捷键帮助；关闭在线用户列表页面</p>
          <p class="contentGrey">关闭当前标签页</p>
          <p class="contentGrey">关闭其他标签页</p>
          <p class="contentGrey">关闭左侧标签页</p>
          <p class="contentGrey">关闭右侧标签页</p>
          <p class="contentGrey">关闭全部标签页</p>
          <p class="contentGrey">刷新当前标签页</p>
          <p class="contentGrey" title="先刷新缓存再刷新标签页">强制刷新当前标签页<i class="ivu-icon ivu-icon-ios-information-circle"></i></p>
          <p title="示例：\\app\\wo\\gzp\\B7WOS00106.html">获取当前标签页的HTML地址<i class="ivu-icon ivu-icon-ios-information-circle"></i></p>
          <p title="示例：B7WOS00106">获取当前标签页的程序号<i class="ivu-icon ivu-icon-ios-information-circle"></i></p>
          <p title="示例：\\app\\wo\\gzp\\B7WOS00106.xml">获取当前标签页的XML地址<i class="ivu-icon ivu-icon-ios-information-circle"></i></p>
          <p title="示例：\\app\\wo\\gzp\\B7WOS00106.js">获取当前标签页的JS地址<i class="ivu-icon ivu-icon-ios-information-circle"></i></p>
          <p class="contentGrey">获取当前标签页的数据表名</p>
          <p class="contentGrey">获取当前标签页的数据表名，并在数据字典中打开</p>
          <p class="contentGrey">输入数据表名，并在数据字典中打开</p>
          <p>第一条</p>
          <p>前一条/前一页</p>
          <p>后一条/后一页</p>
          <p>最后一条</p>
          <p>打开列表</p>
          <p>保存</p>
          <p class="contentGrey">打开铃铛消息弹窗</p>
          <p title="以菜单中第一个用户登录或解锁">自动登录/解锁<i class="ivu-icon ivu-icon-ios-information-circle"></i></p>
        </div>
      </div>
      <div class="modalFooter">作者：<a href="https://greasyfork.org/zh-CN/scripts/496541" target="_blank">肖宏亮</a></div>
    </div>
    `,
    LiEMSShortcutHelpStyle: `
    #shortcutKeysModal {
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      z-index: 99999 !important;
      -webkit-tap-highlight-color: transparent;
      display: flex;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      flex-direction: row;
      justify-content: center;
      transition: background-color 0.1s;
    }

    #shortcutKeysModal > div {
      background: #fff;
      max-width: 100%;
      padding: 1.25em;
      border: none;
      border-radius: 5px;
      position: relative;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: center;
    }

    #shortcutKeysModal .modalHeader {
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    #shortcutKeysModal .modalClose {
      display: flex;
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      align-items: center;
      justify-content: center;
      width: 1.2em;
      height: 1.2em;
      padding: 0;
      overflow: hidden;
      transition: color 0.1s ease-out;
      border: none;
      border-radius: 5px;
      background: 0 0;
      color: #ccc;
      font-family: serif;
      font-size: 2.5em;
      line-height: 1.2;
      cursor: pointer;
    }

    #shortcutKeysModal .modalClose:hover {
      color: red !important;
    }

    #shortcutKeysModal .modalContent {
      display: flex;
      line-height: 1.75rem;
      margin: 1em 0 1em 0;
    }

    .modalContent .contentIndex {
      text-align: center;
    }

    .modalContent .contentLeft {
      text-align: right;
    }

    .modalContent .contentRight {
      text-align: left;
    }

    .modalContent p {
      padding: 0 10px;
    }

    .modalContent p i{
      color: #666;
      cursor: pointer;pointer
    }

    .modalContent .contentGrey {
      background-color: rgb(246, 247, 251);
    }

    #shortcutKeysModal .modalFooter {
      display: flex;
      justify-content: center;
      padding: 1em 0 0;
      border-top: 1px solid #eee;
      color: #545454;
      font-size: 1em;
      width: 100%;
    }

    #shortcutKeysModal .modalFooter a {
      color: var(--lui-primary-8);
    }
    `,
    LiEMSToChatScript: `
    function tochat(usrId) {
      var layim = lui.top.getLayim();
      layim.open(layim.KEY_CHART, usrId);
    }
    `,
    LuculentCommonMenuStyle: `
    /* 朗坤商业论坛 */
    .lu-cont-wrap > .lu-cont > .lu-cont3 > .lu-cont3-right {
      display: none !important;
    }

    /* 我的待办 */
    .lu-cont4 {
    	height: 340px;
    }

    /* 我的待办左侧图片 */
    .lu-cont-wrap > .lu-cont > .lu-cont4 > .lu-cont4-left {
      display: none !important;
    }

    /* 我的待办右侧内容 */
    .lu-cont4-right,
    #_newTask {
      width: 100%;
      height: 300px;
    }

    .header {
      background: url('http://168.168.12.8/Liems/home/img/per.jpg') repeat-x !important;
    }
    .lu-cont3,
    .lu-cont3-left2 {
      height: unset !important;
    }

    .lu-cont3-left {
      border-right: unset !important;
      height: unset !important;
      width: 100% !important;
    }

    .commonMenu-container {
      line-height: 1.75rem;
      padding: 0px 5px;
      margin: 5px 0;
      display: flex;
    }

    .commonMenu-container:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }

    .commonMenu-title-container {
      margin-right: 1rem;
      flex: 0 0 4rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .commonMenu-item-container {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      gap: 0 10px;
    }

    a.commonMenu-item {
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #414141;
      min-width: 8rem;
      text-align: center;
      transition: all 0.3s ease;
      }

    a.commonMenu-item:hover {
      background-color: #4f81f1;
      color: #fff;
      transform: translateY(-2px);
    }
    `,
    LuculentExamStyle: `
    .btn-copy-exam {
      margin-left: 8px;
      height: 40px;
      line-height: 40px;
      border: 1px #ccc solid;
      border-radius: 5px;
      color: #3464e0;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      }

    .btn-copy-exam:hover {
      color: #fff;
      background-color: #3464e0;
    }

    .tm-content {
      cursor: pointer;
    }

    .tm-content:hover {
      background-color: #f5f5f5;
      color: #3464e0;
    }`,
    LuculentTaskStyle: `
    /* 我的待办 */
    .daiban2 {
      height: 262px;
      width: 100%;
      margin: unset;
    }

    .daiban_line {
      display: flex;
      padding-top: 5px;
      padding-bottom: 2px;
      border-bottom: 1px solid #eee;
      transition: background-color 0.3s;
      width: 74rem;
    }

    .diaban_txt {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
    }

    .daiban_tit {
      flex: 1;
      min-width: 0;
      width: 70rem;
    }

    .daiban_tit span {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .daiban_tit span:hover {
      color: #3498db;
      text-decoration: underline;
    }

    .diaban_date {
      flex-shrink: 0;
      text-align: right;
      min-width: 6rem;
    }

    /* 我的待办-页码 */
    .daiban2 > div:last-child {
      bottom: 0px !important;
    }

    .activePage,
    .inactivePage {
      padding-left: 8px !important;
      padding-right: 8px !important;
      margin-right: 8px !important;
    }
    `,
  };

  // LiEMS Selector constant.
  const LIEMS_SELECTOR = {
    query: {
      menu: "#guide__menu_toggle > .menu-toggle-btn",
      input: "#guide__menu_search input.ivu-input.ivu-input-large",
    },
    exit: {
      close0: ".ivu-modal-close > i.ivu-icon.ivu-icon-ios-close",
      close1: "i.menu-page-close.ivu-icon.ivu-icon-ios-close",
      close2: "i.menu-panel-close.ivu-icon.ivu-icon-ios-close",
    },
    tabs: {
      closeActive:
        "div.ivu-tabs-nav > div.ivu-tabs-tab.ivu-tabs-tab-active.ivu-tabs-tab-focused > i.ivu-icon.ivu-icon-ios-close.ivu-tabs-close",
      tab: ".ivu-tabs-nav > .ivu-tabs-tab",
      tabActive: "ivu-tabs-tab-focused",
      close: "i.ivu-icon.ivu-icon-ios-close.ivu-tabs-close",
    },
    login: {
      name: 'input.ivu-input.ivu-input-large[type="text"][autocomplete="hidden"]',
      password: 'input.ivu-input.ivu-input-large[type="text"][autocomplete="new-password"]',
      unlock: "div.r16.ui-bg-main",
      login: 'button.ivu-btn.ivu-btn-primary.c-button.focus.login-btn[type="button"]',
    },
    tabsItem: "ul.mu-tabs-contextmenu > li.mu-tabs-item",
  };

  // 最大显示的搜索结果数量
  const MAX_DISPLAY_RESULTS = 20;

  const DEFAULT_COMMON_MENU = {
    常用: [
      {
        name: "技术支持",
        program: "B1YFG00300",
        description: "技术支持",
      },
      {
        name: "消息列表",
        program: "B1CMG00013",
        description: "消息列表",
      },
    ],
    项目启动: [
      {
        name: "项目主计划",
        program: "B1PMG20110",
        description: "添加项目人员",
      },
      {
        name: "考核责任书",
        program: "B1PMM80100",
        description: "考核责任书",
      },
      {
        name: "出厂申请",
        program: "B1CAM00052",
        description: "出厂申请",
      },
      {
        name: "授权申请",
        program: "B1CAM00053",
        description: "授权申请",
      },
    ],
    项目汇报: [
      {
        name: "项目日志",
        program: "B1PMM80300",
        description: "项目日志",
      },
      {
        name: "公司文档管理",
        program: "B1EPM30042",
        description: "公司文档管理",
      },
      {
        name: "项目月报",
        program: "B1PMM30000",
        description: "项目月报",
      },
      {
        name: "月度人员工时管理",
        program: "B1PMM10124",
        description: "月度人员工时管理",
      },
    ],
    项目费用: [
      {
        name: "出差管理",
        program: "B1OAG90010",
        description: "出差管理",
      },
      {
        name: "项目临时申请表",
        program: "B1PJG80001",
        description: "临时费用申请",
      },
      {
        name: "报销单",
        program: "B1BDG20003",
        description: "报销单",
      },
      {
        name: "预算调整",
        program: "B1BUM00510",
        description: "预算调整",
      },
      {
        name: "供应商信息",
        program: "B1VDG00010",
        description: "供应商信息，租房先建立供应商",
      },
      {
        name: "合同评审",
        program: "B1SAG00060",
        description: "合同评审",
      },
      {
        name: "合同付款单",
        program: "B1SAG00070",
        description: "合同付款单",
      },
    ],
    人员信息: [
      {
        name: "通讯录",
        program: "B1HRS20100",
        description: "通讯录",
      },
      {
        name: "人力地图",
        program: "B1HRG06101",
        description: "人力地图",
      },
      {
        name: "人员查找",
        program: "B1HRS20100",
        description: "人员查找",
      },
      {
        name: "个人信息",
        program: "B1HRG20101",
        description: "个人信息",
      },
    ],
    绩效考核: [
      {
        name: "项目绩效管理KPI",
        program: "B1PJM10100",
        description: "项目绩效管理KPI",
      },
      {
        name: "学员考核申请表",
        program: "B1PMM40040",
        description: "学员考核申请表",
      },
      {
        name: "考核计划维护",
        program: "B1EPM60029",
        description: "在当年的考核计划中选择数据，按钮“生成专业特长考核”",
      },
      {
        name: "专业特长考核申请",
        program: "B1EPG60030",
        description: "专业特长考核申请，需要先填写《考核计划维护》",
      },
      {
        name: "课件查询",
        program: "B1EPM60020",
        description: "课件查询",
      },
      {
        name: "请假申请",
        program: "B1HRM13104",
        description: "请假申请",
      },
      {
        name: "年中总结",
        program: "B1BAG00010",
        description: "年中总结",
      },
      {
        name: "年终总结",
        program: "B1OAG00020",
        description: "年终总结",
      },
    ],
  };

  let defaultUsername, defaultPassword;

  // 在线用户数据
  let onlineUsersData = [];

  main();
  function main() {
    initData();
    const host = location.host;
    switch (host) {
      case "168.168.12.8":
        goLuculent();
      case "dsp.gdg.com.cn":
      case "mdsp.gdg.com.cn:9443":
      case "10.129.20.124:7001":
      case "10.129.20.124:8888":
      case "10.129.18.96:8080":
        goLiEMS("GDG");
        break;
      case "oms.gdg.com.cn":
        goOMS();
        break;
      case "10.45.8.1:8080":
      case "10.45.8.5:8080":
        goLiEMS("ZYQD");
        break;
      case "168.168.10.87:8081":
        goLiEMS("DeliveryGuide");
        break;
      case "168.168.10.62:9015":
        goLiEMS("LuculentTest");
        break;
      case "10.89.3.21:18080":
      case "10.89.3.89:18081":
      case "119.39.117.179:18080":
      case "119.39.117.179:18081":
      case "172.16.20.10:18080":
      case "172.16.20.10:18081":
      case "111.22.244.246:18080":
      case "111.22.244.246:18081":
        goLiEMS("YZDC");
        break;
      default:
        break;
    }
  }

  /**
   * 为页面添加样式代码
   * @param {String} style 样式内容
   * @param {String} styleId 样式元素ID
   * @returns
   */
  function addStyle(style, styleId) {
    if (styleId) {
      let styleNode = document.getElementById(styleId);
      if (!styleNode) {
        styleNode = document.createElement("style");
        styleNode.id = styleId;
        (document.head || document.documentElement).appendChild(styleNode);
      }
      styleNode.textContent = style;
      return;
    }

    typeof GM_addStyle !== "undefined"
      ? GM_addStyle(style)
      : (document.head || document.documentElement).appendChild(
          Object.assign(document.createElement("style"), { textContent: style })
        );
  }

  /**
   * Initialize data for easy access to the "Storage" tab in the editor.
   */
  function initData() {
    if (!GM_listValues().length) {
      const defaultData = { users: {}, menus: DEFAULT_COMMON_MENU };
      GM_setValue("Luculent", defaultData);
    }
  }

  /**
   * 处理 LiEMS 相关页面路径的跳转和功能初始化。
   * 根据当前页面的路径，执行对应的操作，如页面跳转、自动登录、首页初始化等。
   */
  function goLuculent() {
    const pathActions = {
      "/Liems/Login.jsp": () => (location.pathname = "/Liems/login.html"),
      "/Liems/home/500.html": () => (location.pathname = "/Liems/login.html"),
      "/Liems/login.html": handleLogin,
      "/Liems/newHomePage/index.jsp": initHomePage,
      "/Liems/newHomePage/newTask.jsp": handleTask,
      "/Liems/web/web04/zxks.jsp": () => handleExam(),
    };
    pathActions[location.pathname]?.();
  }

  /**
   * 处理自动登录逻辑。
   * 该函数会在页面加载 1 秒后尝试从存储中获取用户信息，
   * 若存在用户信息且满足登录条件，则自动填充用户名和密码并点击登录按钮。
   */
  function handleLogin() {
    setTimeout(() => {
      const users = Object.values(GM_getValue("Luculent")?.users || {});
      if (!users.length) return;

      const { name, password } = users[0];
      const loginBtn = document.querySelector(
        "div.login-right-info > div.login-right-info-btn > button"
      );
      const [userInput, pwdInput] = ["#username", "#password"].map(s => document.querySelector(s));

      if (loginBtn?.textContent === "登录" && userInput && pwdInput) {
        userInput.value = name;
        pwdInput.value = password;
        loginBtn.click();
      }
    }, 1e3);
  }

  /**
   * 初始化首页相关功能。
   * 该函数会覆盖默认的新闻详情展示函数，并且尝试在页面中查找指定的菜单父元素，
   * 若找到则根据存储的菜单数据创建常用菜单。
   */
  function initHomePage() {
    overwriteShowDetail();
    waitForElement(
      ".lu-cont-wrap > .lu-cont > .lu-cont3 > .lu-cont3-left > .lu-cont3-left2",
      createCommonMenu
    );
  }

  function goOMS() {
    addStyle(SNIPPETS.OMSStyle);
    const { name: OMS_NAME, password: OMS_PWD } = GM_getValue("GDG")?.OMS || {};
    if ("/index.php/" == location.pathname || "/" == location.pathname) {
      let nameEle = document.getElementById("pwd_username");
      if (nameEle && nameEle.value == "") {
        nameEle.value = OMS_NAME;
      }
      let pwdEle = document.getElementById("pwd_pwd");
      if (pwdEle && pwdEle.value == "") {
        pwdEle.value = OMS_PWD;
      }
      let captchaEle = document.getElementById("pwd_captcha");
      if (captchaEle) {
        captchaEle.focus();
      }
      let captchaImg = document.querySelector(".capimg");

      // add hotkey
      [nameEle, pwdEle, captchaEle].forEach((ele, index) => {
        if (!ele) return;
        const tips = [
          "按Esc键，可自动填充账号密码，并刷新验证码",
          "按Esc键，可自动填充密码，并刷新验证码",
          "按Esc键，可刷新验证码",
        ];
        ele.setAttribute("title", tips[index]);
        if (index === 2) ele.setAttribute("placeholder", "请输入验证码！（按Esc键，可刷新验证码）");
        ele.onkeydown = e => {
          if (e.keyCode === 27) {
            if (index === 0) nameEle.value = OMS_NAME;
            if (index === 1) pwdEle.value = OMS_PWD;
            if (index === 2) captchaEle.value = "";
            captchaImg?.click();
            captchaEle?.focus();
          }
        };
      });
    } else if ("/index.php/dashboard" == location.pathname) {
      location.pathname = "/index.php/om";
    } else if ("/index.php/om" == location.pathname) {
      setTimeout(() => {
        UI.listSize = 30;
        let firstPage = document.querySelector("#list-pagination > div > div:nth-child(1)");
        if (firstPage) {
          firstPage.click();
          document.querySelector(".theme-heo .logo").textContent = `页面刷新时间：${formatDateTime(
            new Date()
          )}`;
          setTimeout(() => {
            let select96 = document.querySelector(
              "#table-om-asset > tbody > tr:nth-child(14) > td:nth-child(3) > select > option:nth-child(2)"
            );
            if (select96) {
              select96.selected = true;
            }
          }, 1000);
        }
      }, 2000);
      setTimeout(() => {
        location.reload();
      }, 1 * 60 * 1000);
    }
  }

  function goLiEMS(com) {
    if (window === window.top) {
      registerMenuCommand(com);
      addStyle(SNIPPETS.LiEMSMainStyle);
      expandMenuSearchResults();
      waitForElement(LIEMS_SELECTOR.tabsItem, addShortcutDesc, { multiple: true });
    }
    hotkey();
    location.pathname === "/system/workbench.html" && handleOnlineUsers();
  }

  /**
   * 根据LiEMS版本处理在线用户
   */
  function handleOnlineUsers() {
    checkLiEMSVersion()
      ? waitForElement("div.pane-col > div.banner-left", addOnlineUsers)
      : waitForElement("div.banner-left > div.fl > div.info", sortOnlineList);
  }

  /**
   * 检查当前LiEMS版本是否大于指定的目标版本
   * @returns {boolean} 如果当前版本大于目标版本返回true，否则返回false
   */
  function checkLiEMSVersion() {
    const VERSION = "20241223";
    let versionStrArr = lui.version.split(".");
    let currentVersion = versionStrArr[versionStrArr.length - 1].substring(0, 8);
    return currentVersion > VERSION;
  }

  /**
   * 添加在线用户功能
   * @param {HTMLElement} parentEle - 父元素
   */
  function addOnlineUsers(parentEle) {
    // 添加tochat函数脚本
    if (!window.tochat) {
      addScript(SNIPPETS.LiEMSToChatScript);
    }

    // 创建在线用户链接
    let onlineUsers = document.createElement("a");
    onlineUsers.className = "info";
    onlineUsers.style.marginLeft = "1rem";
    parentEle.appendChild(onlineUsers);

    // 初始更新并设置定时更新
    updateOnlineUsersNum(onlineUsers);
    const updateInterval = setInterval(() => updateOnlineUsersNum(onlineUsers), 3000);

    // 添加点击事件监听
    onlineUsers.addEventListener("click", handleOnlineUsersClick);
  }

  /**
   * 处理在线用户点击事件
   * @param {Event} e - 事件对象
   */
  async function handleOnlineUsersClick(e) {
    let modal = document.getElementById("onlineUsersModal");

    if (modal) {
      // 切换显示/隐藏
      modal.style.display = modal.style.display === "none" ? "flex" : "none";
      if (modal.style.display === "flex") {
        await updateModalContent(modal);
      }
    } else {
      // 创建新模态框
      modal = createModal();
      document.body.appendChild(modal);
      await updateModalContent(modal);
    }
  }

  /**
   * 创建模态框元素
   * @returns {HTMLElement} 模态框元素
   */
  function createModal() {
    const modal = document.createElement("div");
    modal.id = "onlineUsersModal";
    modal.innerHTML = SNIPPETS.LiEMSOnlineUsersHtml;

    // 添加样式
    addStyle(SNIPPETS.LiEMSOnlineUsersStyle);

    // 添加关闭事件
    modal.querySelector(".modalClose").addEventListener("click", () => {
      modal.style.display = "none";
    });

    return modal;
  }

  /**
   * 更新模态框内容
   * @param {HTMLElement} modal - 模态框元素
   */
  async function updateModalContent(modal) {
    const tbody = modal.querySelector("tbody");
    const width = modal.querySelector("thead").clientWidth;
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; width: ${width}px">加载中...</td></tr>`;

    try {
      const data = await getOnlineUsers();
      renderUserTable(tbody, data);
    } catch (error) {
      console.error("Failed to load online users:", error);
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">加载失败: ${error.message}</td></tr>`;
    }
  }

  /**
   * 渲染用户表格
   * @param {HTMLElement} tbody - 表格tbody元素
   * @param {Array} data - 用户数据
   */
  function renderUserTable(tbody, data) {
    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">暂无在线用户</td></tr>';
      return;
    }

    const fragment = document.createDocumentFragment();

    data.forEach(user => {
      const row = document.createElement("tr");

      // 用户名单元格
      const nameCell = createUserCell(user.unam, `name ${user.className}`, user.usrId);
      row.appendChild(nameCell);

      // 公司名单元格
      const orgCell = createTextCell(user.orgName, "org");
      row.appendChild(orgCell);

      // IP地址单元格
      const ipCell = createTextCell(user.lgnIp, "address");
      row.appendChild(ipCell);

      // 时间单元格
      const timeCell = createTextCell(user.lgnTime, "time");
      row.appendChild(timeCell);

      // 终端类型单元格
      const terminalCell = document.createElement("td");
      terminalCell.className = `usr-info ${user.lgnType}`;
      row.appendChild(terminalCell);

      fragment.appendChild(row);
    });

    tbody.innerHTML = "";
    tbody.appendChild(fragment);
  }

  /**
   * 创建用户单元格
   * @param {string} text - 单元格文本
   * @param {string} className - CSS类名
   * @param {string} userId - 用户ID
   * @returns {HTMLElement} 单元格元素
   */
  function createUserCell(text, className, userId) {
    const cell = document.createElement("td");
    cell.title = text;
    cell.className = `usr-info ${className}`;
    cell.textContent = text;

    if (className.includes("tochat")) {
      cell.style.cursor = "pointer";
      cell.addEventListener("click", () => tochat(userId));
    }

    return cell;
  }

  /**
   * 创建文本单元格
   * @param {string} text - 单元格文本
   * @param {string} className - CSS类名
   * @returns {HTMLElement} 单元格元素
   */
  function createTextCell(text, className) {
    const cell = document.createElement("td");
    cell.title = text;
    cell.className = `usr-info ${className}`;
    cell.textContent = text;
    return cell;
  }

  /**
   * 向页面添加JavaScript脚本
   */
  function addScript(scriptStr) {
    const scriptEle = document.createElement("script");
    scriptEle.innerHTML = scriptStr;
    document.head.appendChild(scriptEle);
  }

  /**
   * 更新在线用户数量显示
   * @param {Element} element - 显示元素
   */
  function updateOnlineUsersNum(element) {
    const params = {
      pageSize: 100,
      pageIndex: 1,
    };

    lui.ajax(lui.url.userOnlineList, params, function (result) {
      try {
        result = lui.utils.unzip(result);
        const res = result.data.callbackData;
        const data = res.list || [];

        // 对数据按usrId进行去重
        onlineUsersData = Array.from(new Map(data.map(user => [user.usrId, user])).values()).map(
          user => ({
            usrOnline: user.unam,
            usrId: user.usrId,
            className: user.usrId == lui.session.getUserId() ? "" : "tochat",
            orgName: user.orgName,
            usrChartId: user.usrChartId,
          })
        );

        let usrOnlineNum = onlineUsersData.length || 0;
        element.textContent = `在线人数${usrOnlineNum}人`;
      } catch (error) {
        console.error("Error updating online users count:", error);
        element.textContent = "";
      }
    });
  }

  /**
   * 获取在线用户详细信息
   * @returns {Promise<Array>} 用户数据数组
   */
  async function getOnlineUsers() {
    if (!onlineUsersData.length) return [];

    try {
      const requests = onlineUsersData.map(user => createUserRequest(user));

      const results = await Promise.allSettled(requests);

      // 处理成功和失败的结果
      const successfulResults = results
        .filter(result => result.status === "fulfilled")
        .map(result => result.value);
      const errorResults = results
        .filter(result => result.status === "rejected")
        .map(result => result.reason.message || result.reason);

      if (errorResults.length) {
        console.warn(
          `Failed to fetch data for ${errorResults.length} users: ${errorResults.join(", ")}`
        );
      }

      // 按登录时间降序排列
      return successfulResults.sort((a, b) => new Date(b.lgnTime) - new Date(a.lgnTime));
    } catch (error) {
      console.error("Error fetching online users:", error);
      return [];
    }
  }

  /**
   * 创建用户请求
   * @param {Object} user - 用户对象
   * @returns {Promise} 请求Promise
   */
  function createUserRequest(user) {
    return new Promise((resolve, reject) => {
      lui.ajax(lui.url.usrOnlineInfo, { usrChartId: user.usrChartId }, res => {
        res
          ? (res.lgnIp === "0:0:0:0:0:0:0:1" && (res.lgnIp = window.location.hostname),
            (res.lgnType = res.lgnType.toLowerCase()),
            (res.className = user.className),
            resolve(res))
          : reject(user.usrOnline);
      });
    });
  }

  /**
   * 注册油猴菜单命令，根据传入的公司名称获取用户信息并创建登录菜单和快捷键帮助菜单。
   * @param {string} com - 公司名称，用于从存储中获取对应的用户信息。
   */
  function registerMenuCommand(com) {
    const users = GM_getValue(com)?.users || {};
    const [firstUser] = Object.values(users);
    if (firstUser) {
      defaultUsername = firstUser.name;
      defaultPassword = firstUser.password;
    }

    Object.entries(users).forEach(([displayName, user]) => {
      const suffix = user === firstUser ? "（Alt + Shift + M）" : "";
      GM_registerMenuCommand(`登录-🧑‍🏭${displayName}${suffix}`, () =>
        login(null, user.name, user.password)
      );
    });
    GM_registerMenuCommand("快捷键帮助（Alt + F1）", menuShortcut);
  }

  /**
   * 扩展菜单搜索结果的显示区域。
   * 此函数仅在首页执行，用于动态调整搜索结果的最大显示高度。
   * 根据可用空间计算最大可显示结果数量，但不超过预设的最大值。
   * 会在窗口大小改变时触发高度调整，并且在页面加载完成时进行初始高度设置。
   */
  function expandMenuSearchResults() {
    if ("/index.html" !== location.pathname) {
      return;
    }

    // 添加防抖的resize事件监听
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(adjustResultsHeight, 250);
    });

    // 页面加载时初始化
    window.addEventListener("load", adjustResultsHeight);
  }

  /**
   * 调整菜单搜索结果的显示高度。
   * 根据窗口的可用高度计算最大可显示的搜索结果数量，并动态设置搜索结果列表的最大高度。
   */
  function adjustResultsHeight() {
    const RESULTS_ITEM_HEIGHT = 30; // 每个搜索结果项的高度(px)
    const HEADER_HEIGHT = 50; // 页面顶部高度(px)
    const SEARCH_INPUT_HEIGHT = 150; // 搜索输入区域高度(px)

    // 计算可用内容高度
    const availableHeight = window.innerHeight - HEADER_HEIGHT - SEARCH_INPUT_HEIGHT;

    // 计算最大可显示结果数量
    let maxDisplayCount = Math.floor(availableHeight / RESULTS_ITEM_HEIGHT);

    // 应用最大结果数量限制
    maxDisplayCount = Math.min(maxDisplayCount, MAX_DISPLAY_RESULTS);

    // 计算最终高度
    const resultsHeight = maxDisplayCount * RESULTS_ITEM_HEIGHT;

    const cssStyle = `
      .c-text-dp-autocomplete {
        max-height: ${resultsHeight}px !important;
      }
    `;
    addStyle(cssStyle, "liems-results-height");
  }

  /**
   * 油猴菜单“快捷键”的事件处理函数
   */
  function menuShortcut() {
    let modal = document.getElementById("shortcutKeysModal");
    if (modal) {
      modal.style.display = modal.style.display === "none" ? "flex" : "none";
    } else {
      modal = document.createElement("div");
      modal.id = "shortcutKeysModal";
      modal.innerHTML = SNIPPETS.LiEMSShortcutHelpHtml;
      document.body.appendChild(modal);
      addStyle(SNIPPETS.LiEMSShortcutHelpStyle);
      document
        .querySelector(".modalHeader > .modalClose")
        .addEventListener("click", () => (modal.style.display = "none"));
    }
  }

  /**
   * 设置输入框的值，并模拟用户输入事件
   * 这个函数的目的是为了模拟用户在页面上的交互行为，当设置输入框的值时，它会触发输入事件（input）和更改事件（change）
   * @param {HTMLInputElement} inputDom - 要设置值的输入框元素
   * @param {string} value - 要设置的新值
   * 请注意，这个函数只能用于 `<input>` 元素，并且元素需要有 `_valueTracker` 属性才能正确地跟踪值的更改
   */
  function setValue(inputDom, value) {
    inputDom.value = value;
    let event = new Event("input", { bubbles: true });
    event.simulated = true;
    let tracker = inputDom._valueTracker;
    if (tracker) {
      tracker.setValue(value);
    }
    inputDom.dispatchEvent(event);

    inputDom.dispatchEvent(
      new Event("change", {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
  }

  function hotkey() {
    document.onkeydown = function (e) {
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      var altKey = e.altKey || e.code === "AltLeft" || e.code === "AltRight" || e.keyCode === 18;
      var shiftKey = e.shiftKey;

      // Alt + F1
      // 打开油猴菜单“快捷键”
      if (keyCode == 112 && !ctrlKey && altKey && !shiftKey) {
        menuShortcut();
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Alt + Shift + F
      // 打开菜单，并选中输入框中内容
      if (keyCode == 70 && !ctrlKey && altKey && shiftKey) {
        let menu = window.top.document.querySelector(LIEMS_SELECTOR.query.menu);
        if (menu) {
          menu.click();
          setTimeout(() => {
            let inputs = window.top.document.querySelectorAll(LIEMS_SELECTOR.query.input);
            for (let i = 0; i < inputs.length; i++) {
              const placeholder = inputs[i].getAttribute("placeholder");
              if ("请输入程序名称或程序号" == placeholder) {
                inputs[i].click();
                inputs[i].focus();
                inputs[i].select();
                e.preventDefault();
                e.stopPropagation();
                break;
              }
            }
          }, 500);
        }
      }

      // Esc
      // 关闭弹窗
      // 打开/关闭菜单界面
      // 关闭快捷键帮助页面
      if (keyCode == 27 && !ctrlKey && !altKey && !shiftKey) {
        // 关闭弹窗
        let selector0 = LIEMS_SELECTOR.exit.close0;
        let exit =
          document.querySelector(selector0) || window.top.document.querySelector(selector0);
        if (exit && exit.parentElement && exit.parentElement.style.display != "none") {
          exit.click();
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 关闭快捷键帮助页面
        exit = document.getElementById("shortcutKeysModal");
        if (exit && exit.style.display != "none") {
          exit.style.display = "none";
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 关闭在线用户列表页面
        exit = document.getElementById("onlineUsersModal");
        if (exit && exit.style.display != "none") {
          exit.style.display = "none";
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 打开/关闭菜单界面
        let selector1 = LIEMS_SELECTOR.exit.close1;
        let selector2 = LIEMS_SELECTOR.exit.close2;
        exit =
          window.top.document.querySelector(selector1) ||
          window.top.document.querySelector(selector2);
        if (exit) {
          e.preventDefault();
          e.stopPropagation();
          exit.click();
        }
      }

      // Alt + Shift + W
      // 关闭当前标签
      if (keyCode == 87 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        lui.page.close();
        return;
      }

      // Alt + Shift + O
      // 关闭其他标签
      if (keyCode == 79 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let tabs = window.top.document.querySelectorAll(".ivu-tabs-nav > .ivu-tabs-tab");
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (tabs[i].className.indexOf(LIEMS_SELECTOR.tabs.tabActive) == -1) {
            const closeBtn = tabs[i].querySelector(LIEMS_SELECTOR.tabs.close);
            closeBtn?.click();
          }
        }
        return;
      }

      // Alt + Shift + E
      // 关闭左侧标签
      if (keyCode == 69 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let tabs = window.top.document.querySelectorAll(".ivu-tabs-nav > .ivu-tabs-tab");
        let flag = false;
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (tabs[i].className.includes(LIEMS_SELECTOR.tabs.tabActive)) {
            flag = true;
          } else if (flag) {
            const closeBtn = tabs[i].querySelector(LIEMS_SELECTOR.tabs.close);
            closeBtn?.click();
          }
        }
        return;
      }

      // Alt + Shift + R
      // 关闭右侧标签
      if (keyCode == 82 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let tabs = window.top.document.querySelectorAll(".ivu-tabs-nav > .ivu-tabs-tab");
        let flag = true;
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (tabs[i].className.includes(LIEMS_SELECTOR.tabs.tabActive)) {
            flag = false;
          } else if (flag) {
            const closeBtn = tabs[i].querySelector(LIEMS_SELECTOR.tabs.close);
            closeBtn?.click();
          }
        }
        return;
      }

      // Alt + Shift + Q
      // 关闭全部标签
      if (keyCode == 81 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let tabs = window.top.document.querySelectorAll(".ivu-tabs-nav > .ivu-tabs-tab");
        for (let i = tabs.length - 1; i >= 0; i--) {
          const closeBtn = tabs[i].querySelector(LIEMS_SELECTOR.tabs.close);
          closeBtn?.click();
        }
        return;
      }

      // F4
      // 刷新当前标签
      if (keyCode == 115 && !ctrlKey && !altKey && !shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        if (window === window.top) {
          const activeClassName = getActiveTabClassName();
          if (activeClassName) {
            const tabId = activeClassName.replace("tab-", "");
            const iframe = document.querySelector(`iframe[tabid=${tabId}]`);
            iframe?.contentDocument.location.reload();
          }
        } else {
          window.document.location.reload();
        }
        return;
      }

      // Shift + F4
      // 强制刷新当前标签（先刷新系统XML缓存）
      if (keyCode == 115 && !ctrlKey && !altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const activeClassName = getActiveTabClassName();
        if (!activeClassName) {
          return;
        }
        const cachePgmId = "B7STS00423";
        lui.page.open(cachePgmId);
        let loaded;
        let cacheIframe;
        let selectBtn;
        let closeCache;
        let i = 0;
        let interval = setInterval(() => {
          i++;
          if (loaded || i > 250) {
            clearInterval(interval);
            if (loaded) {
              selectBtn.click();
              setTimeout(() => {
                const selectAllBtn = cacheIframe.contentWindow.document.querySelectorAll(
                  "ul.ivu-dropdown-menu > li.ivu-dropdown-item"
                )[2];
                if (selectAllBtn) {
                  selectAllBtn.click();
                  setTimeout(() => {
                    var cacheNoArr = cacheIframe.contentWindow.lui.grid
                      .get("DKCACHEMST")
                      .getStandbyPkArr();
                    if (!lui.utils.isEmpty(cacheNoArr)) {
                      cacheIframe.contentWindow.lui.service("refreshCache", { no: cacheNoArr });
                      closeCache = true;
                    }
                  }, 1500);
                  setTimeout(() => {
                    if (closeCache) {
                      cacheIframe.contentWindow.lui.page.close();
                    }

                    const tabId = activeClassName.replace("tab-", "");
                    const iframe = document.querySelector(`iframe[tabid=${tabId}]`);
                    if (iframe) {
                      iframe.contentDocument.location.reload();
                    }
                    activeTabByClassName(activeClassName);
                  }, 3500);
                }
              }, 500);
            } else {
              window.top.lui.message.warning("“缓存管理”程序启动失败，请重试！");
              console.log("加载超时！");
            }
          } else {
            cacheIframe = window.top.document.querySelector(`iframe[pgmid=${cachePgmId}]`);
            if (cacheIframe && cacheIframe.contentWindow) {
              selectBtn = cacheIframe.contentWindow.document.querySelector(
                "button.c-gfoot-check-item"
              );
              if (selectBtn) {
                loaded = true;
              }
            }
          }
        }, 100);
        return;
      }

      // F8
      // 获取当前标签的HTML地址
      if (keyCode == 119 && !ctrlKey && !altKey && !shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let url = lui.page.getActiveProgramInfo().url.replaceAll("/", "\\");
        lui.message.success("HTML路径：" + url);
        lui.utils.copyToClipBoard(url);
        return;
      }

      // Ctrl + F8
      // 获取当前标签的程序号
      if (keyCode == 119 && ctrlKey && !altKey && !shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let pgmId = lui.page.getActiveProgramInfo().pgmId;
        lui.message.success("程序号：" + pgmId);
        lui.utils.copyToClipBoard(pgmId);
        return;
      }

      // Alt + F8
      // 获取当前标签的XML路径
      if (keyCode == 119 && !ctrlKey && altKey && !shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let url = lui.page
          .getActiveProgramInfo()
          .url.replaceAll("/", "\\")
          .replace(".html", ".xml");
        lui.message.success("XML路径：" + url);
        lui.utils.copyToClipBoard(url);
        return;
      }

      // Shift + F8
      // 获取当前标签的JS路径，若与HTML不在同一目录，则获取的路径无效。
      if (keyCode == 119 && !ctrlKey && !altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let url = lui.page.getActiveProgramInfo().url.replaceAll("/", "\\").replace(".html", ".js");
        lui.message.success("JS路径：" + url);
        lui.utils.copyToClipBoard(url);
        return;
      }

      // Alt + T
      // 获取当前标签的数据表名。
      if (keyCode == 84 && !ctrlKey && altKey && !shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        if (window === window.top || typeof lui === "undefined" || !lui || lui?.isFrameworkTop) {
          return;
        }

        const model = lui?.page?.getViewModel()?.VUEMODEL;
        const table = model?.baseTableNames[0] || model?.gridTableNames[0];
        const gridTable = model?.gridTableNames[0];
        if (!table) {
          return;
        }
        const tableSet = new Set([table]);
        if (gridTable && gridTable !== table) {
          tableSet.add(gridTable);
        }

        const tableNames = Array.from(tableSet);
        lui.message.success(`数据表名：${tableNames.join("、")}`);
        lui.utils.copyToClipBoard(table);
        return;
      }

      // Alt + Shift + T
      // 获取当前标签的数据表名，并在数据字典中打开。
      if (keyCode == 84 && !ctrlKey && altKey && shiftKey) {
        // 阻塞浏览器的默认事件
        e.preventDefault();
        e.stopPropagation();
        if (window === window.top || typeof lui === "undefined" || !lui || lui?.isFrameworkTop) {
          return;
        }

        const model = lui?.page?.getViewModel()?.VUEMODEL;
        const table = model?.baseTableNames[0] || model?.gridTableNames[0];
        if (!table) {
          return;
        }
        lui.utils.copyToClipBoard(table);
        lui.page.open("B7STM00403", table);
        return;
      }

      // Ctrl + Alt + Shift + T
      // 输入数据表名，并在数据字典中打开。
      if (keyCode == 84 && ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let userInput = prompt("请输入数据库表名：");
        if (userInput == null) {
          return;
        }
        const table = userInput.trim().toUpperCase();
        if (isTableName(table)) {
          lui.utils.copyToClipBoard(table);
          lui.page.open("B7STM00403", table);
        } else {
          lui.message.warning("请输入正确的数据库表名！");
        }
        return;
      }

      // Ctrl + Alt + Shift + ←
      // 第一条数据。
      if (keyCode == 37 && ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let doc = getTargetDocument();
        let btn = doc.querySelector("i.ivu-icon-ios-skip-backward");
        if (btn && !btn.parentElement.disabled) {
          btn.click();
        }
        return;
      }
      // Alt + Shift + ←
      // 前一条数据，前一页。
      if (keyCode == 37 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        // 按钮配置清单（按优先级排序）
        const BUTTON_CONFIGS = [
          {
            selector: "i.ivu-icon-ios-arrow-back",
            disabledCheck: btn => btn.parentElement.disabled,
          },
          {
            selector: "i.lui-pre",
            disabledCheck: btn => btn.parentElement.disabled,
          },
          {
            selector: "li.v-page-prev.primary-button",
            disabledCheck: btn => btn.classList.contains("v-page-disabled"),
          },
        ];

        const targetDoc = getTargetDocument();

        // 顺序查找可操作按钮
        for (const { selector, disabledCheck } of BUTTON_CONFIGS) {
          const btn = targetDoc.querySelector(selector);
          if (btn && !disabledCheck(btn)) {
            btn.click();
            break; // 找到第一个可用按钮后终止查找
          }
        }
        return;
      }

      // Alt + Shift + →
      // 后一条数据，后一页。
      if (keyCode == 39 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        // 按钮配置清单（按优先级排序）
        const BUTTON_CONFIGS = [
          {
            selector: "i.ivu-icon-ios-arrow-forward",
            disabledCheck: btn => btn.parentElement.disabled,
          },
          {
            selector: "i.lui-next",
            disabledCheck: btn => btn.parentElement.disabled,
          },
          {
            selector: "li.v-page-next.primary-button",
            disabledCheck: btn => btn.classList.contains("v-page-disabled"),
          },
        ];

        const targetDoc = getTargetDocument();

        // 顺序查找可操作按钮
        for (const { selector, disabledCheck } of BUTTON_CONFIGS) {
          const btn = targetDoc.querySelector(selector);
          if (btn && !disabledCheck(btn)) {
            btn.click();
            break; // 找到第一个可用按钮后终止查找
          }
        }
        return;
      }

      // Ctrl + Alt + Shift + →
      // 最后一条数据。
      if (keyCode == 39 && ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let doc = getTargetDocument();
        const btn = doc.querySelector("i.ivu-icon-ios-skip-forward");
        if (btn && !btn.parentElement.disabled) {
          btn.click();
        }
        return;
      }

      // Alt + Shift + ↑
      // 打开列表。
      if (keyCode == 38 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let doc = getTargetDocument();
        const btn = doc.querySelector("i.lui-base-list");
        btn?.click();
        return;
      }

      // Alt + Shift + S
      // 保存页面。
      if (keyCode == 83 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        let doc = getTargetDocument();
        const btn = doc.querySelector(
          '#guide__toolbar > button.ivu-btn.ivu-btn-default.c-button.focus[name="toolbar_Save"]'
        );
        btn?.click();
        return;
      }

      // Alt + Shift + M
      // 自动登录/解锁
      if (keyCode == 77 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const doc = window !== window.top ? window.top.document : document;
        login(doc, defaultUsername, defaultPassword);
        return;
      }

      // Alt + Shift + P
      // 打开小铃铛消息弹窗
      if (keyCode == 80 && !ctrlKey && altKey && shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const doc = window !== window.top ? window.top.document : document;
        const btn = doc.querySelector("#guide__message_notice > i");
        btn?.click();
        return;
      }
    };
  }

  /**
   * Add Shortcut Key Description.
   * @param {Array} items - 菜单项数组
   */
  function addShortcutDesc(items) {
    if (items && items.length > 1) {
      const shortcuts = [
        " - F4",
        "",
        " - Alt+Shift+W",
        " - Alt+Shift+O",
        " - Alt+Shift+E",
        " - Alt+Shift+R",
        " - Alt+Shift+Q",
      ];
      items.forEach(
        (item, i) => i < shortcuts.length && shortcuts[i] && (item.textContent += shortcuts[i])
      );
    }
  }

  /**
   * Login automatically.
   * @param {Object} doc Document object.
   * @param {String} name username.
   * @param {String} password password.
   */
  function login(doc, name, password) {
    let targetDoc = doc || document;
    let nameDom = targetDoc.querySelector(LIEMS_SELECTOR.login.name);
    if (nameDom && name) {
      setValue(nameDom, name);
    }

    let passwordDom = targetDoc.querySelector(LIEMS_SELECTOR.login.password);
    if (passwordDom && password) {
      setValue(passwordDom, password);
    } else {
      return;
    }

    setTimeout(() => {
      let login = targetDoc.querySelector(LIEMS_SELECTOR.login.unlock);
      if (login && "解除锁定" === login.textContent.trim()) {
        login.click();
      } else {
        login = targetDoc.querySelector(LIEMS_SELECTOR.login.login);
        if (login && "登录" === login.textContent.trim()) {
          login.click();
        }
      }
    }, 100);
  }

  /**
   * Get active tab class name.
   * @returns {String} active tab class name.
   */
  function getActiveTabClassName() {
    const activeTab = window.top.document.querySelector(".ivu-tabs-tab.ivu-tabs-tab-active");
    if (activeTab) {
      for (let className of activeTab.classList) {
        if (!className.includes("ivu-tabs")) return className;
      }
    }
  }

  /**
   * Active tab by class name.
   * @param {String} className The class name of the tab to be activated.
   */
  function activeTabByClassName(className) {
    const tabs = window.top.document.querySelectorAll(".ivu-tabs-nav > .ivu-tabs-tab");
    for (let tab of tabs) {
      if (tab.classList.contains(className)) {
        tab.click();
        break;
      }
    }
  }

  /**
   * 创建常用菜单
   *
   * @param {HTMLElement} ele - 要填充菜单的 DOM 元素
   * @param {Object} menus - 包含菜单项的对象
   */
  function createCommonMenu(ele, menus) {
    addStyle(SNIPPETS.LuculentCommonMenuStyle);
    let luculentConfig = GM_getValue("Luculent");
    if (!luculentConfig.menus) {
      luculentConfig.menus = DEFAULT_COMMON_MENU;
      GM_setValue("Luculent", luculentConfig);
    }
    menus = luculentConfig.menus;
    ele.previousElementSibling.querySelector(".lu-cont5112").remove();
    let menuHtml = "";
    for (const menu in menus) {
      let menuBoxHtml = `<div class="commonMenu-container"><div class="commonMenu-title-container"><span class="commonMenu-title">${menu}</span></div><div class="commonMenu-item-container">`;
      const menuItems = menus[menu];
      let menuItemHtml = ``;
      for (let item of menuItems) {
        menuItemHtml += `<a class="commonMenu-item" href='javascript:openPgm("${item.program}","","")' title="${item.description}">${item.name}</a>`;
      }
      menuBoxHtml += menuItemHtml + `</div></div>`;
      menuHtml += menuBoxHtml;
    }
    ele.innerHTML = menuHtml;
  }

  /**
   * 覆盖默认的 showDetail 函数，用于在新窗口中打开指定 id 的新闻详情页面
   * @param {number} id - 要显示的新闻的 id
   */
  function overwriteShowDetail() {
    showDetail = function (id) {
      const url = window.location.origin + "/Liems/portal/detailNews.jsp?newsId=" + id;
      window.open(url, "_blank");
    };
  }

  /**
   * 对用户在线列表进行排序
   * 此函数会按照用户在线时间降序排列用户列表。
   * 如果在指定时间内（10秒）无法找到用户列表，函数将不会执行任何操作。
   * 适用版本：LiEMS8.0 ~ LiEMS8.1.20241223
   * @param {HTMLElement} onlineInfo - 用户在线信息的 DOM 元素
   */
  function sortOnlineList(onlineInfo) {
    if (!onlineInfo) return;

    onlineInfo.addEventListener("click", function (e) {
      const maxAttempts = 100;
      const attemptInterval = 100;
      const processDelay = 1000;

      let attempts = 0;

      const intervalId = setInterval(() => {
        attempts++;

        const onlineElement = document.querySelector(
          "div.banner-online-list > div.c-scrollbar-wrap > div.c-scrollbar-view"
        );
        if (onlineElement) {
          clearInterval(intervalId);

          setTimeout(() => {
            processOnlineList(onlineElement);
          }, processDelay);

          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          console.warn("Failed to find online list element after maximum attempts");
        }
      }, attemptInterval);
    });
  }

  /**
   * 处理在线列表排序
   * @param {HTMLElement} onlineElement - 在线列表元素
   */
  function processOnlineList(onlineElement) {
    const listItems = Array.from(onlineElement.children);
    if (listItems.length === 0) return;

    // 提取时间信息并排序
    const itemsWithTime = extractTimeInfo(listItems);
    if (itemsWithTime.length === 0) return;

    // 按时间降序排序
    itemsWithTime.sort((a, b) => new Date(b.time) - new Date(a.time));

    // 重新排列元素
    reorderListItems(onlineElement, itemsWithTime);
  }

  /**
   * 从列表项中提取时间信息
   * @param {Array<HTMLElement>} listItems - 列表项数组
   * @returns {Array} 包含时间和索引的对象数组
   */
  function extractTimeInfo(listItems) {
    const result = [];

    for (let i = 0; i < listItems.length; i++) {
      const timeElement = listItems[i].querySelector(".banner-online-td.time");
      if (!timeElement) continue;

      result.push({
        index: i,
        time: timeElement.textContent.trim(),
        element: listItems[i],
      });
    }

    return result;
  }

  /**
   * 重新排序列表项
   * @param {HTMLElement} container - 列表容器
   * @param {Array} sortedItems - 已排序的项数组
   */
  function reorderListItems(container, sortedItems) {
    // 使用文档片段提高性能
    const fragment = document.createDocumentFragment();

    // 按排序顺序添加元素
    sortedItems.forEach(item => {
      fragment.appendChild(item.element);
    });

    // 清空容器并添加排序后的元素
    container.innerHTML = "";
    container.appendChild(fragment);
  }

  /**
   * 获取目标文档对象。
   * 如果当前窗口在 iframe 中，则直接返回当前文档；
   * 否则尝试获取顶层窗口中活动程序对应的 iframe 的文档对象，若获取失败则返回当前文档。
   * @returns {Document} 目标文档对象。
   */
  function getTargetDocument() {
    // 在iframe中直接使用当前文档
    if (window !== window.top) return document;

    try {
      // 使用可选链操作避免空指针异常
      const pgmId = lui.page.getActiveProgramInfo().pgmId;
      const iframe = window.top.document.querySelector(`iframe[pgmid="${pgmId}"]`);
      return iframe?.contentWindow?.document || document;
    } catch (e) {
      console.warn("Iframe document access error:", e);
      return document;
    }
  }

  /**
   * 判断给定的字符串是否为一个有效的数据库表名
   *
   * 表名应以字母开头，后跟最多 15 个字母、数字或下划线字符，并以特定的三个字符结尾：AMT、DAT、DGR、EMP、HIS、INK、LIN、LNK、LOG、MST、NTS、RAM、STD、TMP、TRN 或 TYP
   *
   * @param {string} str - 需要检查的字符串
   * @return {boolean} 如果字符串是一个有效的表名，返回 true，否则返回 false
   */
  function isTableName(str) {
    const regex =
      /^[a-zA-Z][a-zA-Z0-9_]{0,15}(AMT|DAT|DGR|EMP|HIS|INK|LIN|LNK|LOG|MST|NTS|RAM|STD|TMP|TRN|TYP)$/;
    return regex.test(str);
  }

  /**
   * 处理考试相关操作。
   * 该方法用于在考试页面中添加特定样式，并复制试卷内容和标题到剪贴板。
   */
  function handleExam() {
    addStyle(SNIPPETS.LuculentExamStyle);
    copyExamContent();
    copyExamTitle();
  }

  /**
   * 复制试卷所有内容到剪贴板。
   */
  function copyExamContent() {
    waitForElement(".sj-title", element => {
      let copyBtn = document.createElement("button");
      copyBtn.textContent = "复制试卷内容";
      copyBtn.setAttribute("title", "点击复制试卷全部内容");
      copyBtn.className = "btn-copy-exam";
      copyBtn.addEventListener("click", function () {
        let content = document.querySelector(".tm-container")?.textContent || "";
        content = content.replace(/\s/g, "");
        copyText(content);
        layer.msg("试卷内容复制成功");
      });
      element.appendChild(copyBtn);
    });
  }

  /**
   * 为页面上的每个考试标题添加点击事件监听器，点击时复制标题文本到剪贴板
   *
   * 此函数会遍历页面上所有的.tm-content 元素，并为它们添加一个点击事件监听器。
   * 当点击发生时，它会获取标题文本，去除文本末尾的括号（如果有），然后将处理后的文本复制到剪贴板。
   *
   */
  function copyExamTitle() {
    waitForElement(
      ".tm-content",
      titles => {
        for (let title of titles) {
          title.setAttribute("title", "点击复制题目标题");
          title.addEventListener("click", function () {
            let content = title.querySelector("p")?.textContent || title.textContent;
            if (content) {
              const text = content
                .trim()
                .replace(/\s+/g, "")
                .replace(/(\(\)|\（\）|\(\）|\（\))$/g, "")
                .replace(/^\d+、/g, "")
                .trim();
              copyText(text);
              layer.msg(`题目复制成功: ${text}`);
            }
          });
        }
      },
      { multiple: true }
    );
  }

  function handleTask() {
    waitForElement(".daiban2", element => {
      addStyle(SNIPPETS.LuculentTaskStyle);
      let spanList = element.querySelectorAll(".daiban_tit > span");
      for (let span of spanList) {
        span.textContent = span.getAttribute("title").replace(/[.．......]+$/, "");
      }
    });
  }

  /**
   * 等待页面中出现指定元素
   * @param {string} selector - CSS选择器
   * @param {function} callback - 找到元素后的回调函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.maxAttempts=200] - 最大尝试次数
   * @param {number} [options.interval=100] - 检查间隔(毫秒)
   * @param {number} [options.timeout] - 超时时间(毫秒)
   * @param {boolean} [options.multiple=false] - 是否返回多个元素
   * @param {boolean} [options.useMutationObserver=true] - 是否使用MutationObserver监听DOM变化
   * @param {Element} [options.root=document] - 监听的根元素
   */
  function waitForElement(selector, callback, options) {
    // 合并默认选项
    const settings = {
      maxAttempts: 200,
      interval: 100,
      multiple: false,
      useMutationObserver: true,
      root: document,
      ...options,
    };

    // 计算超时时间（如果提供了timeout则优先使用）
    const maxTime = settings.timeout || settings.maxAttempts * settings.interval;

    let attempts = 0;
    const startTime = Date.now();
    let observer = null;
    let intervalId = null;

    // 检查元素函数
    const checkElement = () => {
      const element = settings.multiple
        ? settings.root.querySelectorAll(selector)
        : settings.root.querySelector(selector);

      const found = settings.multiple ? element.length > 0 : element !== null;

      return { element, found };
    };

    // 停止所有观察
    const stopObserving = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // 成功找到元素
    const onSuccess = element => {
      stopObserving();
      callback(element);
    };

    // 元素查找失败
    const onFailure = () => {
      stopObserving();
      callback(null);
    };

    // 立即尝试一次
    const { element: immediateElement, found: immediateFound } = checkElement();
    if (immediateFound) {
      onSuccess(immediateElement);
      return;
    }

    // 设置MutationObserver监听DOM变化
    if (settings.useMutationObserver && "MutationObserver" in window) {
      observer = new MutationObserver(() => {
        const { element, found } = checkElement();
        if (found) {
          onSuccess(element);
        }
      });

      observer.observe(settings.root, {
        childList: true,
        subtree: true,
      });
    }

    // 设置定时器定期检查（备用方案）
    intervalId = setInterval(() => {
      attempts++;
      const { element, found } = checkElement();
      const elapsed = Date.now() - startTime;

      // 如果找到元素
      if (found) {
        onSuccess(element);
        return;
      }

      // 如果超时或达到最大尝试次数
      if (elapsed >= maxTime || attempts >= settings.maxAttempts) {
        onFailure();
      }
    }, settings.interval);
  }

  /**
   * 将指定的文本内容复制到剪贴板
   *
   * @param {string} str - 要复制的文本内容
   */
  function copyText(str) {
    const textArea = document.createElement("textarea");
    document.body.appendChild(textArea);
    textArea.value = str;
    textArea.select();

    // 执行复制操作
    document.execCommand("copy");

    // 复制完成后，移除临时添加的文本区域元素
    document.body.removeChild(textArea);
  }

  /**
   * 将日期对象转换为格式化的时间字符串
   *
   * 此函数接受一个 Date 对象作为参数，并返回一个格式化后的时间字符串
   * 该字符串的格式为：HH:mm:ss，小时和分钟以及秒数都是两位数，不足两位的在数字前补零
   *
   * @param {Date} date - 要格式化的日期对象
   * @return {string} - 格式化后的时间字符串
   * @example
   *  const now = new Date();
   *  console.log(formatDateTime(now));
   */
  function formatDateTime(date) {
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map(num => num.toString().padStart(2, "0"))
      .join(":");
  }
})();
