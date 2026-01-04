// ==UserScript==
// @name         百度纯净版-持续更新中...
// @namespace    http://tampermonkey.net/
// @description  去除百度搜索多余信息,纯净,设置背景色
// @version      0.6.5
// @description  try to take over the world!
// @author       tomiaa
// @match      *://www.baidu.com/*
// @match      *://www.baidu.com/s?*
// @match      *://www.baidu.com/sf/*
// @match      *://image.baidu.com/search/index*
// @match      *://zhidao.baidu.com/search*
// @match      *://wenku.baidu.com/search*
// @match      *://tieba.baidu.com/f*
// @match      *://tieba.baidu.com/
// @match      *://tieba.baidu.com/p/*

// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/429512/%E7%99%BE%E5%BA%A6%E7%BA%AF%E5%87%80%E7%89%88-%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/429512/%E7%99%BE%E5%BA%A6%E7%BA%AF%E5%87%80%E7%89%88-%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD.meta.js
// ==/UserScript==
;(() => {

  const $ = id => document.querySelector(id);
  const cEl = el => document.createElement(el);
  const format = val => val > 9 ? val : '0' + val;

  console.clear();
  const config = {
    'https://www.baidu.com/':{ // index
      remove: [
        '#s-top-left',          // nav 左侧
        '#s-hotsearch-wrapper', // 搜索下面热搜
        '#s_lg_img',            // 百度logo
        '#bottom_layer',        // 底部
        '#s_side_wrapper',      // 右下角
        '#s_wrap',              // 资讯
        '#s_lm_wrap',           // 资讯
        /* change事件后 */
        '#content_right',       // 搜索后右侧
        '#rs',                  // 底部
        '#foot',                // 底部
        '#s_popup_advert',      // 打开底部弹出广告
        '.advert-shrink',       // 右下角广告
        '#lm-new',              // 首页广告
      ],
      css: `
        ::-webkit-scrollbar-thumb{
          background: #1aa0ac;
          border: 4px solid transparent;
          border-radius: 1em;
          background-clip: content-box;
          cursor: pointer;
          min-height: 50px;
        }
         ::-webkit-scrollbar{
          width: 1em;
          background: #e5e5e5;
          border-radius: 0.5em;
        }
        #head_wrapper #form .bdsug-new::after{
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
          filter: blur(80px);
          background: #fdeff2;
        }
        html {
          overflow: auto;
        }
        body{
          background-size: cover !important;
          background-repeat: no-repeat !important;
          background-position: 50% !important;
        }
        #u1{
          right: 4em;
        }
        /* change事件 */
        #head{
          background: transparent;
        }
        #u{
          margin-right: 3em;
        }
        #page{
          background-color: transparent;
        }
        /* 时间 */
        #clock{
          position: absolute;
          width: 5em;
          height: 1em;
          bottom: 2em;
          font-size: 3em;
          line-height: 1em;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          color: #666;
        }
        /* 头部 */
        #s_top_wrap{
          background: transparent;
        }
        /* 设置 */
        #setting {
          position: absolute;
          z-index: 999;
          width: 2em;
          height: 2em;
          top: 1.4em;
          right: 1.2em;
          cursor: pointer;
        }
        #setting::before {
          content: "";
          position: absolute;
          top: -8px; right: -8px;
          bottom: -8px; left: -8px;
        }
        #setting #svg{
          transition: all .5s;
          width: 100%;
          height: 100%;
        }
        #setting:hover #svg{
          transform: rotate(180deg);
        }
        #setting #settingInfo{
          width: 7em;
          height: 0;
          font-size: 1.5em;
          border-width: 0;
          text-align: left;
          box-sizing: content-box;
          border: 0px solid pink;
          background: hsla(0,0%,100%,.5);
          position: absolute;
          right: 0;
          top: 135%;
          border-radius: 5px;
          transition: all .5s;
          overflow: hidden;
        }
        #setting #settingInfo::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
          filter: blur(10px);
          margin: -30px;
        }
        #setting:hover #settingInfo{
          height: 25em;
          width: 28em;
          padding: 0.5em;
          box-shadow: 0 0 5px rgba(0,0,0,.3);
        }
        /* 显示时间 */
        #timeBox{
          display: flex;
          align-items: center;
        }
        #timecheck{
          appearance: none;
          width: 4em;
          height: 1.6em;
          border: 1px solid pink;
          margin-left: 1em;
          border-radius: 0.8em;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          transition: all .5s;
        }
        #timecheck::before{    
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          width: 1.6em;
          height: 1.6em;
          background: pink;
          border-radius: 50%;
          transition: all .5s;
        }
        #timecheck:checked{
          border-color: #39b54a;
        }
        #timecheck:checked::before{
          left: calc(4em - 1.6em);
          background: #39b54a;
          opacity: .6;
        }
        /* 颜色选择 */
        #colorsBox{
          height: 10em;
          overflow-y: auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }
        #colorsItem{
          width: 19%;
          height: 4em;
          box-sizing: border-box;
          margin: 0.2em 0;
          border-radius: 5px;
          font-size: 0.6em;
          padding-left: 0.4em;
          color: #222;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        /* 颜色选择 */
        #bgcBox .col-xs-1_5{
          width: 19%;
          font-size: 0.8em;
        }
        #bgcBox input{
          display: none;
        }
        #bgcBox li{
          margin-bottom: 0.5em;
        }
        #bgcBox li div{
          margin-bottom: 0.5em;
          border-radius: 5px;
          padding: 1em 1em 0.3em 0.3em;
        }
        #bgcBox li div h4{
        }

        #picInnerBox{
          width: 100%;
          display: flex;
          justify-content: space-between;
          height: 10em;
          flex-wrap: wrap;
          overflow: auto;
        }
        #picInnerBox .pic-item{
          width: 32%;
          height: 5em;
          background-size: cover;
          color: #666;
          margin-top: 0.5em;
        }
        /* 文字颜色 */
        #textColorBox{
          margin-left: 1em;
          display: flex;
          align-items: center;
        }
        #textColorBox input{
          background: transparent;
          border: none;
          width: 3em;
          height: 1.8em;
        }
      `,
      fn(){
        document.title = '百度';
        /* 设置 */
        let setting = `<div id='svg'>
          <svg t="1626769525805" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8836" width="100%" height="100%"><path d="M858.75 512c0-58.97 44.19-107.53 101.25-114.6-10.91-42.77-27.84-83.1-49.74-120.16-19.48 14.95-43.78 23.94-70.24 23.94-63.83 0-115.58-51.75-115.58-115.58 0-26.67 9.13-51.16 24.3-70.72C711.14 92.41 670.12 75.1 626.6 64c-7.08 57.05-55.63 101.25-114.6 101.25-58.97 0-107.53-44.19-114.6-101.25-42.86 10.93-83.27 27.91-120.4 49.87 14.2 19.2 22.7 42.87 22.7 68.58 0 63.84-51.75 115.58-115.58 115.58-25.93 0-49.79-8.64-69.07-23.07C92.5 312.64 75.13 353.77 64 397.4c57.06 7.07 101.25 55.63 101.25 114.6S121.06 619.53 64 626.6c10.98 43.07 28.07 83.68 50.19 120.96 19.71-15.62 44.58-25.01 71.67-25.01 63.84 0 115.58 51.75 115.58 115.58 0 27.1-9.4 51.97-25.01 71.68 37.28 22.12 77.89 39.21 120.96 50.19 7.07-57.05 55.63-101.25 114.6-101.25 58.97 0 107.53 44.19 114.6 101.25 43.44-11.08 84.39-28.35 121.93-50.75-12.89-18.64-20.47-41.23-20.47-65.61 0-63.84 51.75-115.58 115.58-115.58 24.38 0 46.96 7.59 65.61 20.47 22.4-37.54 39.67-78.49 50.75-121.93-57.04-7.07-101.24-55.63-101.24-114.6z" fill="#8C9EFF" p-id="8837"></path><path d="M512 512m-140 0a140 140 0 1 0 280 0 140 140 0 1 0-280 0Z" fill="#FFD600" p-id="8838"></path><path d="M512 680c-92.63 0-168-75.36-168-168 0-92.63 75.37-168 168-168s168 75.37 168 168c0 92.64-75.37 168-168 168z m0-280c-61.76 0-112 50.24-112 112s50.24 112 112 112 112-50.24 112-112-50.24-112-112-112z" fill="#FFFFFF" p-id="8839"></path></svg>
        </div>
        `;
        let set = cEl('div');
        set.id = 'setting';
        set.innerHTML = setting;
        document.body.appendChild(set);

        /* 显示时间 */
        let timeBox = cEl('div');
        timeBox.id = 'timeBox';
        timeBox.innerHTML = '显示时间';
        let time = cEl('input');
        time.type = 'checkbox';
        time.id = 'timecheck';
        timeBox.appendChild(time);

        /* 设置选项 */
        let settingInfo = cEl('div');
        settingInfo.id = 'settingInfo';
        settingInfo.appendChild(timeBox)
        set.appendChild(settingInfo);

        /* 文字颜色 */
        let textColorBox =  cEl('div');
        textColorBox.id = 'textColorBox';
        textColorBox.innerHTML = '文字颜色';
        let textColorInput = cEl('input');
        textColorInput.type = 'color'
        textColorBox.appendChild(textColorInput);
        timeBox.appendChild(textColorBox);

        let colorStyle = cEl('style');
        document.body.appendChild(colorStyle);

        const setTextColor  = value => {
          colorStyle.innerHTML = `
          #clock,
          .show-city-name,
          .c-color-t,
          .s-top-right-text,
          .user-name
          {
            color: ${value || '#000'} !important;
          }
          `;
        }
        textColorInput.oninput = function(){
          setTextColor(this.value)
          localStorage.setItem('textColor',this.value);
        }

        window.addEventListener('load', () => {
          setTextColor(localStorage.getItem('textColor'))
          textColorInput.value = localStorage.getItem('textColor');
        })

        /* 配色 */
        let bgcBox = cEl('div');
        bgcBox.id = 'bgcBox';
        bgcBox.innerHTML = '纯色背景';
        let colors = `<div id="colorsBox"> <div class="col-xs-1_5"> <ul> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#bf242a;"> <h3>桜色</h3> <h4>#bf242a</h4><input type="text" name="copy" value="#bf242a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fdeff2;"> <h3>薄桜</h3> <h4>#fdeff2</h4><input type="text" name="copy" value="#fdeff2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e9dfe5;"> <h3>桜鼠</h3> <h4>#e9dfe5</h4><input type="text" name="copy" value="#e9dfe5" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e4d2d8;"> <h3>鸨鼠</h3> <h4>#e4d2d8</h4><input type="text" name="copy" value="#e4d2d8" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f6bfbc;"> <h3>虹色</h3> <h4>#f6bfbc</h4><input type="text" name="copy" value="#f6bfbc" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f5b1aa;"> <h3>珊瑚色</h3> <h4>#f5b1aa</h4><input type="text" name="copy" value="#f5b1aa" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f5b199;"> <h3>一斤染</h3> <h4>#f5b199</h4><input type="text" name="copy" value="#f5b199" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#efab93;"> <h3>宍色</h3> <h4>#efab93</h4><input type="text" name="copy" value="#efab93" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f2a0a1;"> <h3>红梅色</h3> <h4>#f2a0a1</h4><input type="text" name="copy" value="#f2a0a1" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f0908d;"> <h3>薄红</h3> <h4>#f0908d</h4><input type="text" name="copy" value="#f0908d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ee827c;"> <h3>甚三红</h3> <h4>#ee827c</h4><input type="text" name="copy" value="#ee827c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f09199;"> <h3>桃色</h3> <h4>#f09199</h4><input type="text" name="copy" value="#f09199" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f4b3c2;"> <h3>鸨色</h3> <h4>#f4b3c2</h4><input type="text" name="copy" value="#f4b3c2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eebbcb;"> <h3>撫子色</h3> <h4>#eebbcb</h4><input type="text" name="copy" value="#eebbcb" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e8d3c7;"> <h3>灰梅</h3> <h4>#e8d3c7</h4><input type="text" name="copy" value="#e8d3c7" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e8d3d1;"> <h3>灰桜</h3> <h4>#e8d3d1</h4><input type="text" name="copy" value="#e8d3d1" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e6cde3;"> <h3>淡红藤</h3> <h4>#e6cde3</h4><input type="text" name="copy" value="#e6cde3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e5abbe;"> <h3>石竹色</h3> <h4>#e5abbe</h4><input type="text" name="copy" value="#e5abbe" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e597b2;"> <h3>薄红梅</h3> <h4>#e597b2</h4><input type="text" name="copy" value="#e597b2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e198b4;"> <h3>桃花色</h3> <h4>#e198b4</h4><input type="text" name="copy" value="#e198b4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e4ab9b;"> <h3>水柿</h3> <h4>#e4ab9b</h4><input type="text" name="copy" value="#e4ab9b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e09e87;"> <h3>ときがら茶</h3> <h4>#e09e87</h4><input type="text" name="copy" value="#e09e87" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d69090;"> <h3>退红</h3> <h4>#d69090</h4><input type="text" name="copy" value="#d69090" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d4acad;"> <h3>薄柿</h3> <h4>#d4acad</h4><input type="text" name="copy" value="#d4acad" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c97586;"> <h3>长春色</h3> <h4>#c97586</h4><input type="text" name="copy" value="#c97586" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c099a0;"> <h3>梅鼠</h3> <h4>#c099a0</h4><input type="text" name="copy" value="#c099a0" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b88884;"> <h3>鸨浅葱</h3> <h4>#b88884</h4><input type="text" name="copy" value="#b88884" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b48a76;"> <h3>梅染</h3> <h4>#b48a76</h4><input type="text" name="copy" value="#b48a76" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#a86965;"> <h3>苏芳香</h3> <h4>#a86965</h4><input type="text" name="copy" value="#a86965" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#a25768;"> <h3>浅苏芳</h3> <h4>#a25768</h4><input type="text" name="copy" value="#a25768" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ec6d71;"> <h3>真朱</h3> <h4>#ec6d71</h4><input type="text" name="copy" value="#ec6d71" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eb6ea5;"> <h3>赤紫</h3> <h4>#eb6ea5</h4><input type="text" name="copy" value="#eb6ea5" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e95295;"> <h3>躑躅色</h3> <h4>#e95295</h4><input type="text" name="copy" value="#e95295" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e7609e;"> <h3>牡丹色</h3> <h4>#e7609e</h4><input type="text" name="copy" value="#e7609e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#d0576b;"> <h3>今样色</h3> <h4>#d0576b</h4><input type="text" name="copy" value="#d0576b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#c85179;"> <h3>中红</h3> <h4>#c85179</h4><input type="text" name="copy" value="#c85179" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e9546b;"> <h3>蔷薇色</h3> <h4>#e9546b</h4><input type="text" name="copy" value="#e9546b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e95464;"> <h3>韩红</h3> <h4>#e95464</h4><input type="text" name="copy" value="#e95464" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#c85554;"> <h3>银朱</h3> <h4>#c85554</h4><input type="text" name="copy" value="#c85554" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#c53d43;"> <h3>赤红</h3> <h4>#c53d43</h4><input type="text" name="copy" value="#c53d43" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#e83929;"> <h3>红緋</h3> <h4>#e83929</h4><input type="text" name="copy" value="#e83929" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#e60033;"> <h3>赤</h3> <h4>#e60033</h4><input type="text" name="copy" value="#e60033" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#e2041b;"> <h3>猩緋</h3> <h4>#e2041b</h4><input type="text" name="copy" value="#e2041b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#d7003a;"> <h3>红</h3> <h4>#d7003a</h4><input type="text" name="copy" value="#d7003a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#c9171e;"> <h3>深緋</h3> <h4>#c9171e</h4><input type="text" name="copy" value="#c9171e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#d3381c;"> <h3>绯色</h3> <h4>#d3381c</h4><input type="text" name="copy" value="#d3381c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#ce5242;"> <h3>赤丹</h3> <h4>#ce5242</h4><input type="text" name="copy" value="#ce5242" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#d9333f;"> <h3>红赤</h3> <h4>#d9333f</h4><input type="text" name="copy" value="#d9333f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#b94047;"> <h3>胭脂</h3> <h4>#b94047</h4><input type="text" name="copy" value="#b94047" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#ba2636;"> <h3>朱緋</h3> <h4>#ba2636</h4><input type="text" name="copy" value="#ba2636" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#b7282e;"> <h3>茜色</h3> <h4>#b7282e</h4><input type="text" name="copy" value="#b7282e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#a73836;"> <h3>深海老茶</h3> <h4>#a73836</h4><input type="text" name="copy" value="#a73836" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#9e3d3f;"> <h3>苏芳</h3> <h4>#9e3d3f</h4><input type="text" name="copy" value="#9e3d3f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#a22041;"> <h3>真红</h3> <h4>#a22041</h4><input type="text" name="copy" value="#a22041" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#a22041;"> <h3>浓红</h3> <h4>#a22041</h4><input type="text" name="copy" value="#a22041" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f8f4e6;"> <h3>象牙色</h3> <h4>#f8f4e6</h4><input type="text" name="copy" value="#f8f4e6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ede4cd;"> <h3>练色</h3> <h4>#ede4cd</h4><input type="text" name="copy" value="#ede4cd" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e9e4d4;"> <h3>灰白色</h3> <h4>#e9e4d4</h4><input type="text" name="copy" value="#e9e4d4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ede1a9;"> <h3>蒸栗色</h3> <h4>#ede1a9</h4><input type="text" name="copy" value="#ede1a9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f2f2b0;"> <h3>女郎花</h3> <h4>#f2f2b0</h4><input type="text" name="copy" value="#f2f2b0" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e4dc8a;"> <h3>枯草色</h3> <h4>#e4dc8a</h4><input type="text" name="copy" value="#e4dc8a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f8e58c;"> <h3>淡黄</h3> <h4>#f8e58c</h4><input type="text" name="copy" value="#f8e58c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ddbb99;"> <h3>白茶</h3> <h4>#ddbb99</h4><input type="text" name="copy" value="#ddbb99" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d7a98c;"> <h3>赤白橡</h3> <h4>#d7a98c</h4><input type="text" name="copy" value="#d7a98c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f2c9ac;"> <h3>洗柿</h3> <h4>#f2c9ac</h4><input type="text" name="copy" value="#f2c9ac" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fff1cf;"> <h3>鸟の子色</h3> <h4>#fff1cf</h4><input type="text" name="copy" value="#fff1cf" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fddea5;"> <h3>蜂蜜色</h3> <h4>#fddea5</h4><input type="text" name="copy" value="#fddea5" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fce2c4;"> <h3>肌色</h3> <h4>#fce2c4</h4><input type="text" name="copy" value="#fce2c4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fde8d0;"> <h3>薄卵色</h3> <h4>#fde8d0</h4><input type="text" name="copy" value="#fde8d0" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f9c89b;"> <h3>雄黄</h3> <h4>#f9c89b</h4><input type="text" name="copy" value="#f9c89b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f7bd8f;"> <h3>洒落柿</h3> <h4>#f7bd8f</h4><input type="text" name="copy" value="#f7bd8f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f6b894;"> <h3>赤香</h3> <h4>#f6b894</h4><input type="text" name="copy" value="#f6b894" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f4dda5;"> <h3>砥粉色</h3> <h4>#f4dda5</h4><input type="text" name="copy" value="#f4dda5" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f1bf99;"> <h3>肉色</h3> <h4>#f1bf99</h4><input type="text" name="copy" value="#f1bf99" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f1bf99;"> <h3>人色</h3> <h4>#f1bf99</h4><input type="text" name="copy" value="#f1bf99" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#efcd9a;"> <h3>丁子色</h3> <h4>#efcd9a</h4><input type="text" name="copy" value="#efcd9a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#efcd9a;"> <h3>香色</h3> <h4>#efcd9a</h4><input type="text" name="copy" value="#efcd9a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f0cfa0;"> <h3>薄香</h3> <h4>#f0cfa0</h4><input type="text" name="copy" value="#f0cfa0" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#edd3a1;"> <h3>浅黄</h3> <h4>#edd3a1</h4><input type="text" name="copy" value="#edd3a1" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e0c38c;"> <h3>枯色</h3> <h4>#e0c38c</h4><input type="text" name="copy" value="#e0c38c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f3bf88;"> <h3>淡香</h3> <h4>#f3bf88</h4><input type="text" name="copy" value="#f3bf88" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f7b977;"> <h3>杏色</h3> <h4>#f7b977</h4><input type="text" name="copy" value="#f7b977" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f19072;"> <h3>东云色</h3> <h4>#f19072</h4><input type="text" name="copy" value="#f19072" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f19072;"> <h3>曙色</h3> <h4>#f19072</h4><input type="text" name="copy" value="#f19072" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ee836f;"> <h3>珊瑚朱色</h3> <h4>#ee836f</h4><input type="text" name="copy" value="#ee836f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eb9b6f;"> <h3>深支子</h3> <h4>#eb9b6f</h4><input type="text" name="copy" value="#eb9b6f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e0815e;"> <h3>纁</h3> <h4>#e0815e</h4><input type="text" name="copy" value="#e0815e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#df7163;"> <h3>浅绯</h3> <h4>#df7163</h4><input type="text" name="copy" value="#df7163" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d57c6b;"> <h3>真赭</h3> <h4>#d57c6b</h4><input type="text" name="copy" value="#d57c6b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d0826c;"> <h3>洗朱</h3> <h4>#d0826c</h4><input type="text" name="copy" value="#d0826c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ca8269;"> <h3>遠州茶</h3> <h4>#ca8269</h4><input type="text" name="copy" value="#ca8269" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#bb5548;"> <h3>红桦色</h3> <h4>#bb5548</h4><input type="text" name="copy" value="#bb5548" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#ab6953;"> <h3>赭</h3> <h4>#ab6953</h4><input type="text" name="copy" value="#ab6953" class="copy-content"> </div> </li> </ul> </div> <div class="col-xs-1_5"> <ul> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#96514d;"> <h3>小豆色</h3> <h4>#96514d</h4><input type="text" name="copy" value="#96514d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#8d6449;"> <h3>枯茶</h3> <h4>#8d6449</h4><input type="text" name="copy" value="#8d6449" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#deb068;"> <h3>饴色</h3> <h4>#deb068</h4><input type="text" name="copy" value="#deb068" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bf794e;"> <h3>骆驼色</h3> <h4>#bf794e</h4><input type="text" name="copy" value="#bf794e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bc763c;"> <h3>土色</h3> <h4>#bc763c</h4><input type="text" name="copy" value="#bc763c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b98c46;"> <h3>黄唐色</h3> <h4>#b98c46</h4><input type="text" name="copy" value="#b98c46" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b79b5b;"> <h3>桑染</h3> <h4>#b79b5b</h4><input type="text" name="copy" value="#b79b5b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b77b57;"> <h3>栌色</h3> <h4>#b77b57</h4><input type="text" name="copy" value="#b77b57" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b68d4c;"> <h3>黄橡</h3> <h4>#b68d4c</h4><input type="text" name="copy" value="#b68d4c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ad7d4c;"> <h3>丁字染</h3> <h4>#ad7d4c</h4><input type="text" name="copy" value="#ad7d4c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ad7d4c;"> <h3>香染</h3> <h4>#ad7d4c</h4><input type="text" name="copy" value="#ad7d4c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ae7c4f;"> <h3>枇杷茶</h3> <h4>#ae7c4f</h4><input type="text" name="copy" value="#ae7c4f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ad7e4e;"> <h3>芝翫茶</h3> <h4>#ad7e4e</h4><input type="text" name="copy" value="#ad7e4e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ae7c58;"> <h3>焦香</h3> <h4>#ae7c58</h4><input type="text" name="copy" value="#ae7c58" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#a86f4c;"> <h3>胡桃色</h3> <h4>#a86f4c</h4><input type="text" name="copy" value="#a86f4c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#946243;"> <h3>渋纸色</h3> <h4>#946243</h4><input type="text" name="copy" value="#946243" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#917347;"> <h3>朽葉色</h3> <h4>#917347</h4><input type="text" name="copy" value="#917347" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#956f29;"> <h3>桑茶</h3> <h4>#956f29</h4><input type="text" name="copy" value="#956f29" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#8c7042;"> <h3>路考茶</h3> <h4>#8c7042</h4><input type="text" name="copy" value="#8c7042" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#7b6c3e;"> <h3>国防色</h3> <h4>#7b6c3e</h4><input type="text" name="copy" value="#7b6c3e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d8a373;"> <h3>伽羅色</h3> <h4>#d8a373</h4><input type="text" name="copy" value="#d8a373" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#cd8c5c;"> <h3>江戸茶</h3> <h4>#cd8c5c</h4><input type="text" name="copy" value="#cd8c5c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#cd5e3c;"> <h3>樺色</h3> <h4>#cd5e3c</h4><input type="text" name="copy" value="#cd5e3c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#cb8347;"> <h3>紅鬱金</h3> <h4>#cb8347</h4><input type="text" name="copy" value="#cb8347" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c37854;"> <h3>土器色</h3> <h4>#c37854</h4><input type="text" name="copy" value="#c37854" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c38743;"> <h3>狐色</h3> <h4>#c38743</h4><input type="text" name="copy" value="#c38743" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c39143;"> <h3>黄土色</h3> <h4>#c39143</h4><input type="text" name="copy" value="#c39143" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bf783a;"> <h3>琥珀色</h3> <h4>#bf783a</h4><input type="text" name="copy" value="#bf783a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#bb5535;"> <h3>赤茶</h3> <h4>#bb5535</h4><input type="text" name="copy" value="#bb5535" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#bb5520;"> <h3>代赭</h3> <h4>#bb5520</h4><input type="text" name="copy" value="#bb5520" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#b55233;"> <h3>煉瓦色</h3> <h4>#b55233</h4><input type="text" name="copy" value="#b55233" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#aa4f37;"> <h3>雀茶</h3> <h4>#aa4f37</h4><input type="text" name="copy" value="#aa4f37" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#9f563a;"> <h3>団十郎茶</h3> <h4>#9f563a</h4><input type="text" name="copy" value="#9f563a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#9f563a;"> <h3>柿渋色</h3> <h4>#9f563a</h4><input type="text" name="copy" value="#9f563a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#9a493f;"> <h3>紅鳶</h3> <h4>#9a493f</h4><input type="text" name="copy" value="#9a493f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#98623c;"> <h3>灰茶</h3> <h4>#98623c</h4><input type="text" name="copy" value="#98623c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#965042;"> <h3>茶色</h3> <h4>#965042</h4><input type="text" name="copy" value="#965042" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#965036;"> <h3>檜皮色</h3> <h4>#965036</h4><input type="text" name="copy" value="#965036" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#95483f;"> <h3>鳶色</h3> <h4>#95483f</h4><input type="text" name="copy" value="#95483f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#954e2a;"> <h3>柿茶</h3> <h4>#954e2a</h4><input type="text" name="copy" value="#954e2a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#8f2e14;"> <h3>弁柄色</h3> <h4>#8f2e14</h4><input type="text" name="copy" value="#8f2e14" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#8a3319;"> <h3>赤錆色</h3> <h4>#8a3319</h4><input type="text" name="copy" value="#8a3319" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#8a3b00;"> <h3>褐色</h3> <h4>#8a3b00</h4><input type="text" name="copy" value="#8a3b00" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#852e19;"> <h3>栗梅</h3> <h4>#852e19</h4><input type="text" name="copy" value="#852e19" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#7b4741;"> <h3>紅檜皮</h3> <h4>#7b4741</h4><input type="text" name="copy" value="#7b4741" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#773c30;"> <h3>海老茶</h3> <h4>#773c30</h4><input type="text" name="copy" value="#773c30" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#783c1d;"> <h3>唐茶</h3> <h4>#783c1d</h4><input type="text" name="copy" value="#783c1d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#762f07;"> <h3>栗色</h3> <h4>#762f07</h4><input type="text" name="copy" value="#762f07" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#752100;"> <h3>赤銅色</h3> <h4>#752100</h4><input type="text" name="copy" value="#752100" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6c3524;"> <h3>錆色</h3> <h4>#6c3524</h4><input type="text" name="copy" value="#6c3524" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#683f36;"> <h3>赤褐色</h3> <h4>#683f36</h4><input type="text" name="copy" value="#683f36" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#664032;"> <h3>茶褐色</h3> <h4>#664032</h4><input type="text" name="copy" value="#664032" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6d3c32;"> <h3>栗皮茶</h3> <h4>#6d3c32</h4><input type="text" name="copy" value="#6d3c32" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#583822;"> <h3>黒茶</h3> <h4>#583822</h4><input type="text" name="copy" value="#583822" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6c2c2f;"> <h3>葡萄茶</h3> <h4>#6c2c2f</h4><input type="text" name="copy" value="#6c2c2f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#640125;"> <h3>葡萄色</h3> <h4>#640125</h4><input type="text" name="copy" value="#640125" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f8b862;"> <h3>萱草色</h3> <h4>#f8b862</h4><input type="text" name="copy" value="#f8b862" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f6ad49;"> <h3>柑子色</h3> <h4>#f6ad49</h4><input type="text" name="copy" value="#f6ad49" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f39800;"> <h3>金茶</h3> <h4>#f39800</h4><input type="text" name="copy" value="#f39800" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f08300;"> <h3>蜜柑色</h3> <h4>#f08300</h4><input type="text" name="copy" value="#f08300" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ec6d51;"> <h3>鉛丹色</h3> <h4>#ec6d51</h4><input type="text" name="copy" value="#ec6d51" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ee7948;"> <h3>黄丹</h3> <h4>#ee7948</h4><input type="text" name="copy" value="#ee7948" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ed6d3d;"> <h3>柿色</h3> <h4>#ed6d3d</h4><input type="text" name="copy" value="#ed6d3d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ec6800;"> <h3>黄赤</h3> <h4>#ec6800</h4><input type="text" name="copy" value="#ec6800" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ec6800;"> <h3>人参色</h3> <h4>#ec6800</h4><input type="text" name="copy" value="#ec6800" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ee7800;"> <h3>橙色</h3> <h4>#ee7800</h4><input type="text" name="copy" value="#ee7800" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eb6238;"> <h3>照柿</h3> <h4>#eb6238</h4><input type="text" name="copy" value="#eb6238" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#ea5506;"> <h3>赤橙</h3> <h4>#ea5506</h4><input type="text" name="copy" value="#ea5506" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#ea5506;"> <h3>金赤</h3> <h4>#ea5506</h4><input type="text" name="copy" value="#ea5506" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#eb6101;"> <h3>朱色</h3> <h4>#eb6101</h4><input type="text" name="copy" value="#eb6101" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e49e61;"> <h3>小麦色</h3> <h4>#e49e61</h4><input type="text" name="copy" value="#e49e61" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e45e32;"> <h3>丹色</h3> <h4>#e45e32</h4><input type="text" name="copy" value="#e45e32" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e17b34;"> <h3>黄茶</h3> <h4>#e17b34</h4><input type="text" name="copy" value="#e17b34" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#dd7a56;"> <h3>肉桂色</h3> <h4>#dd7a56</h4><input type="text" name="copy" value="#dd7a56" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#db8449;"> <h3>赤朽葉色</h3> <h4>#db8449</h4><input type="text" name="copy" value="#db8449" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d66a35;"> <h3>黄櫨染</h3> <h4>#d66a35</h4><input type="text" name="copy" value="#d66a35" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ffd900;"> <h3>蒲公英色</h3> <h4>#ffd900</h4><input type="text" name="copy" value="#ffd900" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ffd900;"> <h3>黄色</h3> <h4>#ffd900</h4><input type="text" name="copy" value="#ffd900" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ffea00;"> <h3>中黄</h3> <h4>#ffea00</h4><input type="text" name="copy" value="#ffea00" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ffec47;"> <h3>菜の花色</h3> <h4>#ffec47</h4><input type="text" name="copy" value="#ffec47" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fef263;"> <h3>黄檗色</h3> <h4>#fef263</h4><input type="text" name="copy" value="#fef263" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fcd575;"> <h3>卵色</h3> <h4>#fcd575</h4><input type="text" name="copy" value="#fcd575" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fbd26b;"> <h3>花葉色</h3> <h4>#fbd26b</h4><input type="text" name="copy" value="#fbd26b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f5e56b;"> <h3>刈安色</h3> <h4>#f5e56b</h4><input type="text" name="copy" value="#f5e56b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eec362;"> <h3>玉蜀黍色</h3> <h4>#eec362</h4><input type="text" name="copy" value="#eec362" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ebd842;"> <h3>金糸雀色</h3> <h4>#ebd842</h4><input type="text" name="copy" value="#ebd842" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ffdb4f;"> <h3>黄支子色</h3> <h4>#ffdb4f</h4><input type="text" name="copy" value="#ffdb4f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fbca4d;"> <h3>支子色</h3> <h4>#fbca4d</h4><input type="text" name="copy" value="#fbca4d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fcc800;"> <h3>向日葵色</h3> <h4>#fcc800</h4><input type="text" name="copy" value="#fcc800" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f8b500;"> <h3>山吹色</h3> <h4>#f8b500</h4><input type="text" name="copy" value="#f8b500" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fabf14;"> <h3>鬱金色</h3> <h4>#fabf14</h4><input type="text" name="copy" value="#fabf14" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f7c114;"> <h3>藤黄</h3> <h4>#f7c114</h4><input type="text" name="copy" value="#f7c114" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e6b422;"> <h3>金色</h3> <h4>#e6b422</h4><input type="text" name="copy" value="#e6b422" class="copy-content"> </div> </li> </ul> </div> <div class="col-xs-1_5"> <ul> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e6b422;"> <h3>黄金</h3> <h4>#e6b422</h4><input type="text" name="copy" value="#e6b422" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d9a62e;"> <h3>櫨染</h3> <h4>#d9a62e</h4><input type="text" name="copy" value="#d9a62e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d3a243;"> <h3>黄朽葉色</h3> <h4>#d3a243</h4><input type="text" name="copy" value="#d3a243" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c89932;"> <h3>山吹茶</h3> <h4>#c89932</h4><input type="text" name="copy" value="#c89932" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d0af4c;"> <h3>芥子色</h3> <h4>#d0af4c</h4><input type="text" name="copy" value="#d0af4c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#8b968d;"> <h3>豆がら茶</h3> <h4>#8b968d</h4><input type="text" name="copy" value="#8b968d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6e7955;"> <h3>麹塵</h3> <h4>#6e7955</h4><input type="text" name="copy" value="#6e7955" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#767c6b;"> <h3>山鳩色</h3> <h4>#767c6b</h4><input type="text" name="copy" value="#767c6b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#888e7e;"> <h3>利休鼠</h3> <h4>#888e7e</h4><input type="text" name="copy" value="#888e7e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5a544b;"> <h3>海松茶</h3> <h4>#5a544b</h4><input type="text" name="copy" value="#5a544b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#56564b;"> <h3>藍海松茶</h3> <h4>#56564b</h4><input type="text" name="copy" value="#56564b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#56564b;"> <h3>藍媚茶</h3> <h4>#56564b</h4><input type="text" name="copy" value="#56564b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#494a41;"> <h3>千歳茶</h3> <h4>#494a41</h4><input type="text" name="copy" value="#494a41" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6b6f59;"> <h3>岩井茶</h3> <h4>#6b6f59</h4><input type="text" name="copy" value="#6b6f59" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#474b42;"> <h3>仙斎茶</h3> <h4>#474b42</h4><input type="text" name="copy" value="#474b42" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#333631;"> <h3>黒緑</h3> <h4>#333631</h4><input type="text" name="copy" value="#333631" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5b6356;"> <h3>柳煤竹</h3> <h4>#5b6356</h4><input type="text" name="copy" value="#5b6356" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#726250;"> <h3>樺茶色</h3> <h4>#726250</h4><input type="text" name="copy" value="#726250" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9d896c;"> <h3>空五倍子色</h3> <h4>#9d896c</h4><input type="text" name="copy" value="#9d896c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#94846a;"> <h3>生壁色</h3> <h4>#94846a</h4><input type="text" name="copy" value="#94846a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#897858;"> <h3>肥後煤竹</h3> <h4>#897858</h4><input type="text" name="copy" value="#897858" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#716246;"> <h3>媚茶</h3> <h4>#716246</h4><input type="text" name="copy" value="#716246" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#cbb994;"> <h3>白橡</h3> <h4>#cbb994</h4><input type="text" name="copy" value="#cbb994" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d6c6af;"> <h3>亜麻色</h3> <h4>#d6c6af</h4><input type="text" name="copy" value="#d6c6af" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bfa46f;"> <h3>榛色</h3> <h4>#bfa46f</h4><input type="text" name="copy" value="#bfa46f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9e9478;"> <h3>灰汁色</h3> <h4>#9e9478</h4><input type="text" name="copy" value="#9e9478" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a59564;"> <h3>利休茶</h3> <h4>#a59564</h4><input type="text" name="copy" value="#a59564" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#715c1f;"> <h3>鶯茶</h3> <h4>#715c1f</h4><input type="text" name="copy" value="#715c1f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c7b370;"> <h3>木蘭色</h3> <h4>#c7b370</h4><input type="text" name="copy" value="#c7b370" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#dcd3b2;"> <h3>砂色</h3> <h4>#dcd3b2</h4><input type="text" name="copy" value="#dcd3b2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a19361;"> <h3>油色</h3> <h4>#a19361</h4><input type="text" name="copy" value="#a19361" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#8f8667;"> <h3>利休色</h3> <h4>#8f8667</h4><input type="text" name="copy" value="#8f8667" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#887938;"> <h3>梅幸茶</h3> <h4>#887938</h4><input type="text" name="copy" value="#887938" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6a5d21;"> <h3>璃寛茶</h3> <h4>#6a5d21</h4><input type="text" name="copy" value="#6a5d21" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#918754;"> <h3>黄海松茶</h3> <h4>#918754</h4><input type="text" name="copy" value="#918754" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a69425;"> <h3>菜種油色</h3> <h4>#a69425</h4><input type="text" name="copy" value="#a69425" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ada250;"> <h3>青朽葉</h3> <h4>#ada250</h4><input type="text" name="copy" value="#ada250" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#938b4b;"> <h3>根岸色</h3> <h4>#938b4b</h4><input type="text" name="copy" value="#938b4b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#8c8861;"> <h3>鶸茶</h3> <h4>#8c8861</h4><input type="text" name="copy" value="#8c8861" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a1a46d;"> <h3>柳茶</h3> <h4>#a1a46d</h4><input type="text" name="copy" value="#a1a46d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#726d40;"> <h3>海松色</h3> <h4>#726d40</h4><input type="text" name="copy" value="#726d40" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#928c36;"> <h3>鶯色</h3> <h4>#928c36</h4><input type="text" name="copy" value="#928c36" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#dccb18;"> <h3>緑黄色</h3> <h4>#dccb18</h4><input type="text" name="copy" value="#dccb18" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d7cf3a;"> <h3>鶸色</h3> <h4>#d7cf3a</h4><input type="text" name="copy" value="#d7cf3a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c5c56a;"> <h3>抹茶色</h3> <h4>#c5c56a</h4><input type="text" name="copy" value="#c5c56a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c3d825;"> <h3>若草色</h3> <h4>#c3d825</h4><input type="text" name="copy" value="#c3d825" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b8d200;"> <h3>黄緑</h3> <h4>#b8d200</h4><input type="text" name="copy" value="#b8d200" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e0ebaf;"> <h3>若芽色</h3> <h4>#e0ebaf</h4><input type="text" name="copy" value="#e0ebaf" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d8e698;"> <h3>若菜色</h3> <h4>#d8e698</h4><input type="text" name="copy" value="#d8e698" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c7dc68;"> <h3>若苗色</h3> <h4>#c7dc68</h4><input type="text" name="copy" value="#c7dc68" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#99ab4e;"> <h3>青丹</h3> <h4>#99ab4e</h4><input type="text" name="copy" value="#99ab4e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#7b8d42;"> <h3>草色</h3> <h4>#7b8d42</h4><input type="text" name="copy" value="#7b8d42" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#69821b;"> <h3>苔色</h3> <h4>#69821b</h4><input type="text" name="copy" value="#69821b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#aacf53;"> <h3>萌黄</h3> <h4>#aacf53</h4><input type="text" name="copy" value="#aacf53" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b0ca71;"> <h3>苗色</h3> <h4>#b0ca71</h4><input type="text" name="copy" value="#b0ca71" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b9d08b;"> <h3>若葉色</h3> <h4>#b9d08b</h4><input type="text" name="copy" value="#b9d08b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#839b5c;"> <h3>松葉色</h3> <h4>#839b5c</h4><input type="text" name="copy" value="#839b5c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#cee4ae;"> <h3>夏虫色</h3> <h4>#cee4ae</h4><input type="text" name="copy" value="#cee4ae" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#82ae46;"> <h3>鶸萌黄</h3> <h4>#82ae46</h4><input type="text" name="copy" value="#82ae46" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a8c97f;"> <h3>柳色</h3> <h4>#a8c97f</h4><input type="text" name="copy" value="#a8c97f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9ba88d;"> <h3>青白橡</h3> <h4>#9ba88d</h4><input type="text" name="copy" value="#9ba88d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c8d5bb;"> <h3>柳鼠</h3> <h4>#c8d5bb</h4><input type="text" name="copy" value="#c8d5bb" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c1d8ac;"> <h3>裏葉柳</h3> <h4>#c1d8ac</h4><input type="text" name="copy" value="#c1d8ac" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a8bf93;"> <h3>山葵色</h3> <h4>#a8bf93</h4><input type="text" name="copy" value="#a8bf93" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#769164;"> <h3>老竹色</h3> <h4>#769164</h4><input type="text" name="copy" value="#769164" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d6e9ca;"> <h3>白緑</h3> <h4>#d6e9ca</h4><input type="text" name="copy" value="#d6e9ca" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#93ca76;"> <h3>淡萌黄</h3> <h4>#93ca76</h4><input type="text" name="copy" value="#93ca76" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#93b881;"> <h3>柳染</h3> <h4>#93b881</h4><input type="text" name="copy" value="#93b881" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#badcad;"> <h3>薄萌葱</h3> <h4>#badcad</h4><input type="text" name="copy" value="#badcad" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#97a791;"> <h3>深川鼠</h3> <h4>#97a791</h4><input type="text" name="copy" value="#97a791" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#98d98e;"> <h3>若緑</h3> <h4>#98d98e</h4><input type="text" name="copy" value="#98d98e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#88cb7f;"> <h3>浅緑</h3> <h4>#88cb7f</h4><input type="text" name="copy" value="#88cb7f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#69b076;"> <h3>薄緑</h3> <h4>#69b076</h4><input type="text" name="copy" value="#69b076" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6b7b6e;"> <h3>青鈍</h3> <h4>#6b7b6e</h4><input type="text" name="copy" value="#6b7b6e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bed2c3;"> <h3>青磁鼠</h3> <h4>#bed2c3</h4><input type="text" name="copy" value="#bed2c3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#93b69c;"> <h3>薄青</h3> <h4>#93b69c</h4><input type="text" name="copy" value="#93b69c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a6c8b2;"> <h3>錆青磁</h3> <h4>#a6c8b2</h4><input type="text" name="copy" value="#a6c8b2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#47885e;"> <h3>緑青色</h3> <h4>#47885e</h4><input type="text" name="copy" value="#47885e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#316745;"> <h3>千歳緑</h3> <h4>#316745</h4><input type="text" name="copy" value="#316745" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#68be8d;"> <h3>若竹色</h3> <h4>#68be8d</h4><input type="text" name="copy" value="#68be8d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#3eb370;"> <h3>緑</h3> <h4>#3eb370</h4><input type="text" name="copy" value="#3eb370" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#007b43;"> <h3>常磐色</h3> <h4>#007b43</h4><input type="text" name="copy" value="#007b43" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bed3ca;"> <h3>千草鼠</h3> <h4>#bed3ca</h4><input type="text" name="copy" value="#bed3ca" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#92b5a9;"> <h3>千草色</h3> <h4>#92b5a9</h4><input type="text" name="copy" value="#92b5a9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#7ebea5;"> <h3>青磁色</h3> <h4>#7ebea5</h4><input type="text" name="copy" value="#7ebea5" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#7ebeab;"> <h3>青竹色</h3> <h4>#7ebeab</h4><input type="text" name="copy" value="#7ebeab" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#028760;"> <h3>常磐緑</h3> <h4>#028760</h4><input type="text" name="copy" value="#028760" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#3b7960;"> <h3>木賊色</h3> <h4>#3b7960</h4><input type="text" name="copy" value="#3b7960" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2f5d50;"> <h3>天鵞絨</h3> <h4>#2f5d50</h4><input type="text" name="copy" value="#2f5d50" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#3a5b52;"> <h3>虫襖</h3> <h4>#3a5b52</h4><input type="text" name="copy" value="#3a5b52" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#475950;"> <h3>革色</h3> <h4>#475950</h4><input type="text" name="copy" value="#475950" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#00552e;"> <h3>深緑</h3> <h4>#00552e</h4><input type="text" name="copy" value="#00552e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#005243;"> <h3>鉄色</h3> <h4>#005243</h4><input type="text" name="copy" value="#005243" class="copy-content"> </div> </li> </ul> </div> <div class="col-xs-1_5"> <ul> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#006e54;"> <h3>萌葱色</h3> <h4>#006e54</h4><input type="text" name="copy" value="#006e54" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#00a381;"> <h3>花緑青</h3> <h4>#00a381</h4><input type="text" name="copy" value="#00a381" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#38b48b;"> <h3>翡翠色</h3> <h4>#38b48b</h4><input type="text" name="copy" value="#38b48b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#00a497;"> <h3>青緑</h3> <h4>#00a497</h4><input type="text" name="copy" value="#00a497" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#80aba9;"> <h3>水浅葱</h3> <h4>#80aba9</h4><input type="text" name="copy" value="#80aba9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#5c9291;"> <h3>錆浅葱</h3> <h4>#5c9291</h4><input type="text" name="copy" value="#5c9291" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#478384;"> <h3>青碧</h3> <h4>#478384</h4><input type="text" name="copy" value="#478384" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#43676b;"> <h3>御召茶</h3> <h4>#43676b</h4><input type="text" name="copy" value="#43676b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#80989b;"> <h3>湊鼠</h3> <h4>#80989b</h4><input type="text" name="copy" value="#80989b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2c4f54;"> <h3>高麗納戸</h3> <h4>#2c4f54</h4><input type="text" name="copy" value="#2c4f54" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#1f3134;"> <h3>百入茶</h3> <h4>#1f3134</h4><input type="text" name="copy" value="#1f3134" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#47585c;"> <h3>錆鼠</h3> <h4>#47585c</h4><input type="text" name="copy" value="#47585c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#485859;"> <h3>錆鉄御納戸</h3> <h4>#485859</h4><input type="text" name="copy" value="#485859" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6c848d;"> <h3>藍鼠</h3> <h4>#6c848d</h4><input type="text" name="copy" value="#6c848d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#53727d;"> <h3>錆御納戸</h3> <h4>#53727d</h4><input type="text" name="copy" value="#53727d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5b7e91;"> <h3>舛花色</h3> <h4>#5b7e91</h4><input type="text" name="copy" value="#5b7e91" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#426579;"> <h3>熨斗目花色</h3> <h4>#426579</h4><input type="text" name="copy" value="#426579" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4c6473;"> <h3>御召御納戸</h3> <h4>#4c6473</h4><input type="text" name="copy" value="#4c6473" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#455765;"> <h3>鉄御納戸</h3> <h4>#455765</h4><input type="text" name="copy" value="#455765" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#44617b;"> <h3>紺鼠</h3> <h4>#44617b</h4><input type="text" name="copy" value="#44617b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#393f4c;"> <h3>藍鉄</h3> <h4>#393f4c</h4><input type="text" name="copy" value="#393f4c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#393e4f;"> <h3>青褐</h3> <h4>#393e4f</h4><input type="text" name="copy" value="#393e4f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#203744;"> <h3>褐返</h3> <h4>#203744</h4><input type="text" name="copy" value="#203744" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4d4c61;"> <h3>褐色</h3> <h4>#4d4c61</h4><input type="text" name="copy" value="#4d4c61" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eaf4fc;"> <h3>月白</h3> <h4>#eaf4fc</h4><input type="text" name="copy" value="#eaf4fc" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eaedf7;"> <h3>白菫色</h3> <h4>#eaedf7</h4><input type="text" name="copy" value="#eaedf7" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e8ecef;"> <h3>白花色</h3> <h4>#e8ecef</h4><input type="text" name="copy" value="#e8ecef" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ebf6f7;"> <h3>藍白</h3> <h4>#ebf6f7</h4><input type="text" name="copy" value="#ebf6f7" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c1e4e9;"> <h3>白藍</h3> <h4>#c1e4e9</h4><input type="text" name="copy" value="#c1e4e9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bce2e8;"> <h3>水色</h3> <h4>#bce2e8</h4><input type="text" name="copy" value="#bce2e8" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a2d7dd;"> <h3>瓶覗</h3> <h4>#a2d7dd</h4><input type="text" name="copy" value="#a2d7dd" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#abced8;"> <h3>秘色色</h3> <h4>#abced8</h4><input type="text" name="copy" value="#abced8" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a0d8ef;"> <h3>空色</h3> <h4>#a0d8ef</h4><input type="text" name="copy" value="#a0d8ef" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#89c3eb;"> <h3>勿忘草色</h3> <h4>#89c3eb</h4><input type="text" name="copy" value="#89c3eb" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#84a2d4;"> <h3>青藤色</h3> <h4>#84a2d4</h4><input type="text" name="copy" value="#84a2d4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#83ccd2;"> <h3>白群</h3> <h4>#83ccd2</h4><input type="text" name="copy" value="#83ccd2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#84b9cb;"> <h3>浅縹</h3> <h4>#84b9cb</h4><input type="text" name="copy" value="#84b9cb" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#698aab;"> <h3>薄花色</h3> <h4>#698aab</h4><input type="text" name="copy" value="#698aab" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#008899;"> <h3>納戸色</h3> <h4>#008899</h4><input type="text" name="copy" value="#008899" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#00a3af;"> <h3>浅葱色</h3> <h4>#00a3af</h4><input type="text" name="copy" value="#00a3af" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2a83a2;"> <h3>花浅葱</h3> <h4>#2a83a2</h4><input type="text" name="copy" value="#2a83a2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#59b9c6;"> <h3>新橋色</h3> <h4>#59b9c6</h4><input type="text" name="copy" value="#59b9c6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#2ca9e1;"> <h3>天色</h3> <h4>#2ca9e1</h4><input type="text" name="copy" value="#2ca9e1" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#38a1db;"> <h3>露草色</h3> <h4>#38a1db</h4><input type="text" name="copy" value="#38a1db" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#0095d9;"> <h3>青</h3> <h4>#0095d9</h4><input type="text" name="copy" value="#0095d9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#0094c8;"> <h3>薄藍</h3> <h4>#0094c8</h4><input type="text" name="copy" value="#0094c8" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2792c3;"> <h3>縹色</h3> <h4>#2792c3</h4><input type="text" name="copy" value="#2792c3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#007bbb;"> <h3>紺碧</h3> <h4>#007bbb</h4><input type="text" name="copy" value="#007bbb" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5383c3;"> <h3>薄群青</h3> <h4>#5383c3</h4><input type="text" name="copy" value="#5383c3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5a79ba;"> <h3>薄花桜</h3> <h4>#5a79ba</h4><input type="text" name="copy" value="#5a79ba" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4c6cb3;"> <h3>群青色</h3> <h4>#4c6cb3</h4><input type="text" name="copy" value="#4c6cb3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#3e62ad;"> <h3>杜若色</h3> <h4>#3e62ad</h4><input type="text" name="copy" value="#3e62ad" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#1e50a2;"> <h3>瑠璃色</h3> <h4>#1e50a2</h4><input type="text" name="copy" value="#1e50a2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#507ea4;"> <h3>薄縹</h3> <h4>#507ea4</h4><input type="text" name="copy" value="#507ea4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#19448e;"> <h3>瑠璃紺</h3> <h4>#19448e</h4><input type="text" name="copy" value="#19448e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#164a84;"> <h3>紺瑠璃</h3> <h4>#164a84</h4><input type="text" name="copy" value="#164a84" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#165e83;"> <h3>藍色</h3> <h4>#165e83</h4><input type="text" name="copy" value="#165e83" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#274a78;"> <h3>青藍</h3> <h4>#274a78</h4><input type="text" name="copy" value="#274a78" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2a4073;"> <h3>深縹</h3> <h4>#2a4073</h4><input type="text" name="copy" value="#2a4073" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#223a70;"> <h3>紺色</h3> <h4>#223a70</h4><input type="text" name="copy" value="#223a70" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#192f60;"> <h3>紺青</h3> <h4>#192f60</h4><input type="text" name="copy" value="#192f60" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#1c305c;"> <h3>留紺</h3> <h4>#1c305c</h4><input type="text" name="copy" value="#1c305c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#0f2350;"> <h3>濃藍</h3> <h4>#0f2350</h4><input type="text" name="copy" value="#0f2350" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#17184b;"> <h3>鉄紺</h3> <h4>#17184b</h4><input type="text" name="copy" value="#17184b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#0d0015;"> <h3>漆黒</h3> <h4>#0d0015</h4><input type="text" name="copy" value="#0d0015" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bbc8e6;"> <h3>淡藤色</h3> <h4>#bbc8e6</h4><input type="text" name="copy" value="#bbc8e6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bbbcde;"> <h3>藤色</h3> <h4>#bbbcde</h4><input type="text" name="copy" value="#bbbcde" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#8491c3;"> <h3>紅掛空色</h3> <h4>#8491c3</h4><input type="text" name="copy" value="#8491c3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#8491c3;"> <h3>紅碧</h3> <h4>#8491c3</h4><input type="text" name="copy" value="#8491c3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4d5aaf;"> <h3>紺桔梗</h3> <h4>#4d5aaf</h4><input type="text" name="copy" value="#4d5aaf" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4d5aaf;"> <h3>花色</h3> <h4>#4d5aaf</h4><input type="text" name="copy" value="#4d5aaf" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4a488e;"> <h3>紺藍</h3> <h4>#4a488e</h4><input type="text" name="copy" value="#4a488e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4d4398;"> <h3>紅桔梗</h3> <h4>#4d4398</h4><input type="text" name="copy" value="#4d4398" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5654a2;"> <h3>桔梗色</h3> <h4>#5654a2</h4><input type="text" name="copy" value="#5654a2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#706caa;"> <h3>藤納戸</h3> <h4>#706caa</h4><input type="text" name="copy" value="#706caa" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#68699b;"> <h3>紅掛花色</h3> <h4>#68699b</h4><input type="text" name="copy" value="#68699b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#867ba9;"> <h3>紫苑色</h3> <h4>#867ba9</h4><input type="text" name="copy" value="#867ba9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#dbd0e6;"> <h3>白藤色</h3> <h4>#dbd0e6</h4><input type="text" name="copy" value="#dbd0e6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a59aca;"> <h3>藤紫</h3> <h4>#a59aca</h4><input type="text" name="copy" value="#a59aca" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#7058a3;"> <h3>菫色</h3> <h4>#7058a3</h4><input type="text" name="copy" value="#7058a3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#674598;"> <h3>青紫</h3> <h4>#674598</h4><input type="text" name="copy" value="#674598" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#674196;"> <h3>菖蒲色</h3> <h4>#674196</h4><input type="text" name="copy" value="#674196" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9079ad;"> <h3>竜胆色</h3> <h4>#9079ad</h4><input type="text" name="copy" value="#9079ad" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#745399;"> <h3>江戸紫</h3> <h4>#745399</h4><input type="text" name="copy" value="#745399" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#65318e;"> <h3>本紫</h3> <h4>#65318e</h4><input type="text" name="copy" value="#65318e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#522f60;"> <h3>葡萄色</h3> <h4>#522f60</h4><input type="text" name="copy" value="#522f60" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#493759;"> <h3>深紫</h3> <h4>#493759</h4><input type="text" name="copy" value="#493759" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2e2930;"> <h3>紫黒</h3> <h4>#2e2930</h4><input type="text" name="copy" value="#2e2930" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#884898;"> <h3>紫</h3> <h4>#884898</h4><input type="text" name="copy" value="#884898" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c0a2c7;"> <h3>薄葡萄</h3> <h4>#c0a2c7</h4><input type="text" name="copy" value="#c0a2c7" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#460e44;"> <h3>紫紺</h3> <h4>#460e44</h4><input type="text" name="copy" value="#460e44" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#74325c;"> <h3>暗紅色</h3> <h4>#74325c</h4><input type="text" name="copy" value="#74325c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#55295b;"> <h3>桑の実色</h3> <h4>#55295b</h4><input type="text" name="copy" value="#55295b" class="copy-content"> </div> </li> </ul> </div> <div class="col-xs-1_5"> <ul> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#895b8a;"> <h3>古代紫</h3> <h4>#895b8a</h4><input type="text" name="copy" value="#895b8a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#824880;"> <h3>茄子紺</h3> <h4>#824880</h4><input type="text" name="copy" value="#824880" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#915c8b;"> <h3>二藍</h3> <h4>#915c8b</h4><input type="text" name="copy" value="#915c8b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#9d5b8b;"> <h3>京紫</h3> <h4>#9d5b8b</h4><input type="text" name="copy" value="#9d5b8b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#7a4171;"> <h3>蒲葡</h3> <h4>#7a4171</h4><input type="text" name="copy" value="#7a4171" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#bc64a4;"> <h3>若紫</h3> <h4>#bc64a4</h4><input type="text" name="copy" value="#bc64a4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#b44c97;"> <h3>紅紫</h3> <h4>#b44c97</h4><input type="text" name="copy" value="#b44c97" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#aa4c8f;"> <h3>梅紫</h3> <h4>#aa4c8f</h4><input type="text" name="copy" value="#aa4c8f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#cc7eb1;"> <h3>菖蒲色</h3> <h4>#cc7eb1</h4><input type="text" name="copy" value="#cc7eb1" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#cca6bf;"> <h3>紅藤色</h3> <h4>#cca6bf</h4><input type="text" name="copy" value="#cca6bf" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c4a3bf;"> <h3>浅紫</h3> <h4>#c4a3bf</h4><input type="text" name="copy" value="#c4a3bf" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e7e7eb;"> <h3>紫水晶</h3> <h4>#e7e7eb</h4><input type="text" name="copy" value="#e7e7eb" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#dcd6d9;"> <h3>薄梅鼠</h3> <h4>#dcd6d9</h4><input type="text" name="copy" value="#dcd6d9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d3cfd9;"> <h3>暁鼠</h3> <h4>#d3cfd9</h4><input type="text" name="copy" value="#d3cfd9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d3ccd6;"> <h3>牡丹鼠</h3> <h4>#d3ccd6</h4><input type="text" name="copy" value="#d3ccd6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c8c2c6;"> <h3>霞色</h3> <h4>#c8c2c6</h4><input type="text" name="copy" value="#c8c2c6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a6a5c4;"> <h3>藤鼠</h3> <h4>#a6a5c4</h4><input type="text" name="copy" value="#a6a5c4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a69abd;"> <h3>半色</h3> <h4>#a69abd</h4><input type="text" name="copy" value="#a69abd" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a89dac;"> <h3>薄色</h3> <h4>#a89dac</h4><input type="text" name="copy" value="#a89dac" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9790a4;"> <h3>薄鼠</h3> <h4>#9790a4</h4><input type="text" name="copy" value="#9790a4" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9e8b8e;"> <h3>鳩羽鼠</h3> <h4>#9e8b8e</h4><input type="text" name="copy" value="#9e8b8e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#95859c;"> <h3>鳩羽色</h3> <h4>#95859c</h4><input type="text" name="copy" value="#95859c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#95949a;"> <h3>桔梗鼠</h3> <h4>#95949a</h4><input type="text" name="copy" value="#95949a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#71686c;"> <h3>紫鼠</h3> <h4>#71686c</h4><input type="text" name="copy" value="#71686c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#705b67;"> <h3>葡萄鼠</h3> <h4>#705b67</h4><input type="text" name="copy" value="#705b67" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#634950;"> <h3>濃色</h3> <h4>#634950</h4><input type="text" name="copy" value="#634950" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5f414b;"> <h3>紫鳶</h3> <h4>#5f414b</h4><input type="text" name="copy" value="#5f414b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#4f455c;"> <h3>濃鼠</h3> <h4>#4f455c</h4><input type="text" name="copy" value="#4f455c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#5a5359;"> <h3>藤煤竹</h3> <h4>#5a5359</h4><input type="text" name="copy" value="#5a5359" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#594255;"> <h3>滅紫</h3> <h4>#594255</h4><input type="text" name="copy" value="#594255" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#524748;"> <h3>紅消鼠</h3> <h4>#524748</h4><input type="text" name="copy" value="#524748" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#513743;"> <h3>似せ紫</h3> <h4>#513743</h4><input type="text" name="copy" value="#513743" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e6eae3;"> <h3>灰黄緑</h3> <h4>#e6eae3</h4><input type="text" name="copy" value="#e6eae3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d4dcd6;"> <h3>蕎麦切色</h3> <h4>#d4dcd6</h4><input type="text" name="copy" value="#d4dcd6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d4dcda;"> <h3>薄雲鼠</h3> <h4>#d4dcda</h4><input type="text" name="copy" value="#d4dcda" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#d3cbc6;"> <h3>枯野色</h3> <h4>#d3cbc6</h4><input type="text" name="copy" value="#d3cbc6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c8c2be;"> <h3>潤色</h3> <h4>#c8c2be</h4><input type="text" name="copy" value="#c8c2be" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b3ada0;"> <h3>利休白茶</h3> <h4>#b3ada0</h4><input type="text" name="copy" value="#b3ada0" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a99e93;"> <h3>茶鼠</h3> <h4>#a99e93</h4><input type="text" name="copy" value="#a99e93" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a58f86;"> <h3>胡桃染</h3> <h4>#a58f86</h4><input type="text" name="copy" value="#a58f86" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#928178;"> <h3>江戸鼠</h3> <h4>#928178</h4><input type="text" name="copy" value="#928178" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#887f7a;"> <h3>煤色</h3> <h4>#887f7a</h4><input type="text" name="copy" value="#887f7a" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b4866b;"> <h3>丁子茶</h3> <h4>#b4866b</h4><input type="text" name="copy" value="#b4866b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#b28c6e;"> <h3>柴染</h3> <h4>#b28c6e</h4><input type="text" name="copy" value="#b28c6e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#a16d5d;"> <h3>宗伝唐茶</h3> <h4>#a16d5d</h4><input type="text" name="copy" value="#a16d5d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#9f6f55;"> <h3>砺茶</h3> <h4>#9f6f55</h4><input type="text" name="copy" value="#9f6f55" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#8c6450;"> <h3>煎茶色</h3> <h4>#8c6450</h4><input type="text" name="copy" value="#8c6450" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#856859;"> <h3>銀煤竹</h3> <h4>#856859</h4><input type="text" name="copy" value="#856859" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#765c47;"> <h3>黄枯茶</h3> <h4>#765c47</h4><input type="text" name="copy" value="#765c47" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6f514c;"> <h3>煤竹色</h3> <h4>#6f514c</h4><input type="text" name="copy" value="#6f514c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#6f4b3e;"> <h3>焦茶</h3> <h4>#6f4b3e</h4><input type="text" name="copy" value="#6f4b3e" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#544a47;"> <h3>黒橡</h3> <h4>#544a47</h4><input type="text" name="copy" value="#544a47" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#543f32;"> <h3>憲法色</h3> <h4>#543f32</h4><input type="text" name="copy" value="#543f32" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#554738;"> <h3>涅色</h3> <h4>#554738</h4><input type="text" name="copy" value="#554738" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#433d3c;"> <h3>檳榔子染</h3> <h4>#433d3c</h4><input type="text" name="copy" value="#433d3c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#432f2f;"> <h3>黒鳶</h3> <h4>#432f2f</h4><input type="text" name="copy" value="#432f2f" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#3f312b;"> <h3>赤墨</h3> <h4>#3f312b</h4><input type="text" name="copy" value="#3f312b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#302833;"> <h3>黒紅</h3> <h4>#302833</h4><input type="text" name="copy" value="#302833" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#ffffff;border:1px solid #eee;"> <h3>白</h3> <h4>#ffffff</h4><input type="text" name="copy" value="#ffffff" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fffffc;"> <h3>胡粉色</h3> <h4>#fffffc</h4><input type="text" name="copy" value="#fffffc" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f7fcfe;"> <h3>卯の花色</h3> <h4>#f7fcfe</h4><input type="text" name="copy" value="#f7fcfe" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f8fbf8;"> <h3>白磁</h3> <h4>#f8fbf8</h4><input type="text" name="copy" value="#f8fbf8" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#fbfaf5;"> <h3>生成り色</h3> <h4>#fbfaf5</h4><input type="text" name="copy" value="#fbfaf5" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f3f3f3;"> <h3>乳白色</h3> <h4>#f3f3f3</h4><input type="text" name="copy" value="#f3f3f3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#f3f3f2;"> <h3>白練</h3> <h4>#f3f3f2</h4><input type="text" name="copy" value="#f3f3f2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#eae5e3;"> <h3>素色</h3> <h4>#eae5e3</h4><input type="text" name="copy" value="#eae5e3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#e5e4e6;"> <h3>白梅鼠</h3> <h4>#e5e4e6</h4><input type="text" name="copy" value="#e5e4e6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#dcdddd;"> <h3>白鼠</h3> <h4>#dcdddd</h4><input type="text" name="copy" value="#dcdddd" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#dddcd6;"> <h3>絹鼠</h3> <h4>#dddcd6</h4><input type="text" name="copy" value="#dddcd6" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#c0c6c9;"> <h3>灰青</h3> <h4>#c0c6c9</h4><input type="text" name="copy" value="#c0c6c9" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#afafb0;"> <h3>銀鼠</h3> <h4>#afafb0</h4><input type="text" name="copy" value="#afafb0" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#adadad;"> <h3>薄鈍</h3> <h4>#adadad</h4><input type="text" name="copy" value="#adadad" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#a3a3a2;"> <h3>薄墨色</h3> <h4>#a3a3a2</h4><input type="text" name="copy" value="#a3a3a2" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9ea1a3;"> <h3>錫色</h3> <h4>#9ea1a3</h4><input type="text" name="copy" value="#9ea1a3" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#9fa0a0;"> <h3>素鼠</h3> <h4>#9fa0a0</h4><input type="text" name="copy" value="#9fa0a0" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#949495;"> <h3>鼠色</h3> <h4>#949495</h4><input type="text" name="copy" value="#949495" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#333333;background:#888084;"> <h3>源氏鼠</h3> <h4>#888084</h4><input type="text" name="copy" value="#888084" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#7d7d7d;"> <h3>灰色</h3> <h4>#7d7d7d</h4><input type="text" name="copy" value="#7d7d7d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#7b7c7d;"> <h3>鉛色</h3> <h4>#7b7c7d</h4><input type="text" name="copy" value="#7b7c7d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#727171;"> <h3>鈍色</h3> <h4>#727171</h4><input type="text" name="copy" value="#727171" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#595857;"> <h3>墨</h3> <h4>#595857</h4><input type="text" name="copy" value="#595857" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#595455;"> <h3>丼鼠</h3> <h4>#595455</h4><input type="text" name="copy" value="#595455" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#524e4d;"> <h3>消炭色</h3> <h4>#524e4d</h4><input type="text" name="copy" value="#524e4d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#474a4d;"> <h3>藍墨茶</h3> <h4>#474a4d</h4><input type="text" name="copy" value="#474a4d" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#383c3c;"> <h3>羊羹色</h3> <h4>#383c3c</h4><input type="text" name="copy" value="#383c3c" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2b2b2b;"> <h3>蝋色</h3> <h4>#2b2b2b</h4><input type="text" name="copy" value="#2b2b2b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#2b2b2b;"> <h3>黒</h3> <h4>#2b2b2b</h4><input type="text" name="copy" value="#2b2b2b" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#180614;"> <h3>烏羽色</h3> <h4>#180614</h4><input type="text" name="copy" value="#180614" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#281a14;"> <h3>鉄黒</h3> <h4>#281a14</h4><input type="text" name="copy" value="#281a14" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#000b00;"> <h3>濡羽色</h3> <h4>#000b00</h4><input type="text" name="copy" value="#000b00" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#250d00;"> <h3>黒壇</h3> <h4>#250d00</h4><input type="text" name="copy" value="#250d00" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#241a08;"> <h3>憲法黒茶</h3> <h4>#241a08</h4><input type="text" name="copy" value="#241a08" class="copy-content"> </div> </li> <li> <div class="item item-clr-chuantong copy-color copy-click" style="color:#ffffff;background:#16160e;"> <h3>暗黒色</h3> <h4>#16160e</h4><input type="text" name="copy" value="#16160e" class="copy-content"> </div> </li> </ul> </div> </div>`;
        /* 纯色切换 */
        let toggleColor = color => {
          document.body.style.background = color;
          localStorage.setItem('bodyBgc',color)
        }
        bgcBox.innerHTML += colors;
        bgcBox.addEventListener('click', e => {
          let fun = {
            'h4': () => {
              toggleColor(e.target.innerHTML);
            },
            'h3': () => {
              toggleColor(e.target.nextElementSibling.innerHTML);
            },
            'div': () => {
              if(e.target.children[1].nodeName.toLowerCase() == 'h4')
                toggleColor(e.target.children[1].innerHTML);
            }
          }
          fun?.[e.target.nodeName.toLowerCase()]?.();
        })
        settingInfo.appendChild(bgcBox);

        /* 图片背景 */
        let pics = [
          {
            url: 'https://p.qlogo.cn/zc_icon/0/c37a1553ed84d0b97c6c4e8185aa59f616268815316858/0.jpg',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/e55490769ae17ccffdfe4c9768617a9516268823599153/0.png',
            name: '纱雾'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/e57d4abd2521588fa443d86c37e98a9816268824157905/0.jpg',
            name: '纱雾'
          },
          {
            url: 'https://p6-tt.byteimg.com/origin/pgc-image/a29351c3e5034eaa8932fbcfbc676db6.png',
            name: '初音',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/d6ed1c31bdfe1f9cc0c5f0e1fe12e4b616268827839999/0.png',
            name: '02',
            color: '#fff'
          },
          {
            url: 'https://p6-tt.byteimg.com/origin/pgc-image/834dac90f4c646be9904664816995be3.png',
            name: '蕾姆'
          },
          {
            url: 'https://img30.360buyimg.com/pop/jfs/t1/196210/18/14571/1993027/60fb8ed0E05e2463b/2aeca862d75e43d7.jpg',
            name: '君の名',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/ee8aacd16b953f2bab55425db76ea79e16270988916254/0.jpg',
            name: '君の名',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/46c0afc1f1e1b8d893ae2c62d5ac117416270989199219/0.png',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/ec38e734c1ad2ecd0c7a2b78be3c2b3c16270989533129/0.png',
            name: '双马尾'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/c5c51bfd60dcb81c4cf8eef3ba89cbdb16270989837769/0.png',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/e5f2d6ebca159cea9fa766664a26d84c16270990402515/0.png',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/682704e766758fa70e98a55de546951b16270990671689/0.png',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/6630d05c343586a97984cbee0104e10716270990908323/0.jpeg',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/f3c4f3572aac496d0cadb3bee52a92e516270991138011/0.png',
            name: '英莉莉',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/05895bf6133d4131659cad7d3440403616270991383467/0.jpg',
            name: '君の名',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/46d49e8061d58280356a9ac8ea9de90c16270991570882/0.jpg',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/92262aace174450f9adc38675a3c246a16270991691026/0.jpg',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/b80b7c92109f786f1eb98f966933165f16270993274964/0.png',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/02ecedfd39a6158241b3b79d49398f3e16270993566982/0.png',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/eec4cb41ac24327926d68d1e694a6cd416270993701592/0.png',
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/37dd31efc79a162fe0ab68f74005b9ad16270994035286/0.jpg',
            name: '磷叶石',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/8568c9d99ddb4fe05d4cac896146b15a16270994681685/0.png',
            name: '鬼刀',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/6052e0e1a937f6b3578d65c9c9fb31bc16270994678568/0.png',
            name: '鬼刀',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/4448bd7ec06eb3ebefe969836e71ed9f16270994675302/0.png',
            name: '鬼刀',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/61d541dbd71fd82bf4d00d8497ed15bc16270994675354/0.png',
            name: '鬼刀',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/4d2c5d7aefd0850ab6918fac899e07b616270994665082/0.jpg',
            name: '鬼刀',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/03544a46132a5a7b5c577514c1d6027516270994652145/0.jpg',
            name: '鬼刀',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/36aaeb3109fd68d4db94e3bd70bef96616270995238944/0.png',
            name: '无名',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/12c2ece0d1673a1e7e992dd1945afb1516270996357511/0.png',
            name: 'D.va',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/e47d421e9f34ce8914a0d1ea78c6ede316270997713507/0.png',
            name: '薇尔莉特',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/df6450996a76cd0545168c6b2771e5e716270998324702/0.png',
            name: '影山茂夫'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/0d00f4ad96b712907a0f68a9e06a186c16270998835084/0.png',
            name: 'RE0'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/c931b197a3f8fa8add1209214d6eb28c16270999056279/0.jpg',
            name: 'narota',
            color: '#fff'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/4aec6b2bf59ca00b25666d9a441108e516270999356088/0.png',
            name: '火影'
          },
          {
            url: 'https://p.qlogo.cn/zc_icon/0/49eaf1619e0747fc66ba78bba07d689516271003488737/0.png',
          },
        ]
        pics.map(item => item.url = `https://images.weserv.nl/?url=${item.url}`)
        let picBox = cEl('div');
        picBox.innerHTML = '2K壁纸';
        picBox.id = 'picBox';
        let picInnerBox = cEl('div');
        picInnerBox.id = 'picInnerBox'

        pics.forEach(item => {
          let temp = cEl('div');
          temp.className = 'pic-item';
          temp.style.backgroundImage = `url(${item.url})`
          temp.innerHTML = `
          <p style='color:${item.color || '#666'}'>${item.name || ''}</p>
          `;
          picInnerBox.appendChild(temp);
        })

        picBox.addEventListener('click',e => {
          if(e.target.nodeName.toLowerCase() == 'p'){
            toggleColor(e.target.parent.style.backgroundImage);
            return;
          }
          toggleColor(e.target.style.backgroundImage);
        })

        picBox.appendChild(picInnerBox);
        settingInfo.appendChild(picBox);

        window.addEventListener('load', () => {
          $('#su').value = '搜 索';
          /* 时间 */
          let clock = cEl('div');
          clock.id = 'clock';
          clock.style.display = 'none';
          $('#form').appendChild(clock);
          let nowTime = null;
          let timeFn = () => {
            let date = new Date();
            nowTime = `${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`;
            clock.innerHTML = nowTime;
            getTime();
          }
          function getTime(){
            setTimeout(timeFn,1000)
          }
          timeFn();

          /* 时间显示隐藏 */
          time.onchange = function(){
            clock.style.display = this.checked ? 'block' : 'none';
            localStorage.setItem('timeCheck',this.checked)
          }
          let flag = localStorage.getItem('timeCheck');
          if(flag === 'true'){
            time.checked = true;
            clock.style.display = 'block';
          }
          let bodyBgc = localStorage.getItem('bodyBgc');
          bodyBgc && toggleColor(bodyBgc);
          
          
          /* 搜索地址变化，去除背景 */
          const input = document.getElementById('kw')
          const wrapper = document.getElementById('wrapper')

          input.addEventListener('input', () => {
            wrapper.classList.length > 1 && (document.body.style.background = '')
          })

        })
        
        
      },
    },
    /* 搜索结果页 */
    'https://www.baidu.com/s': { // 搜索页
      remove: [
        // '#result_logo',         // 左上角logo
        '#content_right',       // 右侧
        '.s-tab-more',          // 更多
        '.s-tab-b2b',           // 采购
        '#foot',                // 底部
        '.new_nums',            // 找到数量
        '.search_tool_close',   // 收起工具
        '.toindex',             // 右侧返回首页
        /* item底部 */
        '.se_st_footer',        
        '.c-showurl',
        '.kuaizhao',            // 快照
        '.c-icons-outer',       // 保障
        '.op-guide-cont',       // 翻译下载
        '#rs',                  // 相关搜索
        '#content_left > div[tpl=news-realtime]',   // 贴吧咨询
        '#content_left > div[tpl=short_video_pc]',   // 视频推荐
      ],
      css:`
      .head_nums_cont_inner{
        top: 0 !important;
      }
      #page{
        background-color: transparent !important;
      }
      ::-webkit-scrollbar-thumb{
        background: #1aa0ac;
        border: 4px solid transparent;
        border-radius: 1em;
        background-clip: content-box;
        cursor: pointer;
        min-height: 50px;
      }
       ::-webkit-scrollbar{
        width: 1em;
        background: #e5e5e5;
        border-radius: 0.5em;
      }
      `,
      fn(){
        /* 去除搜索结果广告 */
        let ad = document.querySelectorAll('#content_left > div:not(.result)');
        
        for(let item in ad){
          if(!ad[item].className) ad[item]?.remove?.(); // 插入广告

          // if(ad[item].className == 'result-op c-container new-pmd') ad[item]?.remove?.(); // 贴吧相关消息推荐
        }
      }
    },
    'https://www.baidu.com/sf/vsearch': {   // 视频
      remove: [
        '#content_right',       // 右侧
        '.s-tab-more',          //更多
        '.s-tab-b2b',           // 采购
      ]
    },
    'https://image.baidu.com/search/index': {
      remove: [
        '#tips',      // 提示
        '#topRS',     // 相关搜索
        '#resultInfo',// 数量
        '#common-feedback-link',// 反馈
        '.s_tab_more',          // 更多
        '.s-tab-b2b',           // 采购

      ],
      css: `
      #newImgFilter{
        margin-left: 7rem;
      }
      .hover ._self{ /* 下载 */
        right: 10px;
      }
      .hover .title, /* 标题 */
      .hover .dutu{  /* 识图 */
        display:none !important;
      }
      `
    },
    'https://zhidao.baidu.com/search': { // 知道
      remove: [
        '.fixheight',   // 右侧
        '#footer-help', // 底部
        '.shop-entrance',// 右上角商城
        '.s-tab-b2b',           // 采购
      ]
    },
    "https://wenku.baidu.com/search": { // 文库
      remove: [
        '.base-layout-content-right',   // 右侧
        '.user-vip',                    // 右上角vip立减
        '.user-more',                   //右上角更多
        '.no-full-screen',              // 右下角
        '.baidu-search-tip-wrap',       // 去网页搜索
        '.search-relative-wrapper',     // 相关搜索
        '.cover-img-wrap',              // 底部广告
        '.search-foot-wrap',            // 底部
        '.head-recom',                  // 搜索推荐
      ]
    },
    /* 贴吧 */
    'https://tieba.baidu.com/f': {   // 贴吧 进吧
      remove: [
        '.search_nav',   // 头部
        '.u_hermes',                  // 问题反馈
        '.u_member',                  // 会员
        '.gift-goin',       // gif
        '.card_info',       // 目录
        '.dialogJ',  // 弹窗
        '.dialogJmodal',  // 弹窗
        '.fengchao-wrap-feed', // 广告
        /* 右下角 */
        '.tbui_fbar_down',
        '.tbui_fbar_refresh',
        '.tbui_fbar_share',
        '.tbui_fbar_feedback',
        '.tbui_fbar_favor',
        '#aside',
        '.th_footer_l',       // 贴子数量
        /* 底部发帖 */
        '.poster_head_surveillance',    // 政策
        '.ui_bubble_wrap j_wrap',       // 分享弹窗
        '.topic_add_btn',               // 话题
        '#footer',                      // 底部
      ],
      css: `
      #content_wrap{
        width: 100% !important; /* 内容 */
      }
      /* 左侧广告 */
      .clearfix .label_text,
      .clearfix .close_btn,
      .clearfix .j_click_stats,
      .clearfix .hover_btn
      {
        display: none !important;
      }
      #content_wrap
      {
        background: #fff;
      }
      `,
      fn(){
        window.addEventListener('load', () => {
          /* 收起讨论 */
          if($('#listPostCnt')){
            $('#listPostCnt').style.display = 'none';
            $('#listEditorCnt').style.display = 'none';
            $('#slideBtn').classList.remove('down')
          }
        })
      }
    },
    'https://tieba.baidu.com/': { // 贴吧首页
      remove: [
        // '.top-sec',     // 轮播
        '.search_nav ',  // 顶部
        '.u_menu_member', // 会员
        '#spage-tbshare-container', // 右侧分享
        '.r-top-sec',    // 推荐贴吧
        '.r-right-sec',  // 右侧
        '.spage_liveshow_slide', // 游戏
        '#spage_game_tab_wrapper', // 左侧游戏
        '.aggregate_entrance_wrap', // 左侧 精选
        '.ufw-gap', // 分类
        '#f-d-w', // 分类
        '.footer', // 底部
      ],
      css: `
      #left-cont-wraper {
        position: static !important;
      }
      .top-sec{
        display: none !important;
      }
      `
    },
    'https://tieba.baidu.com/p/': { // 贴吧看帖
      remove: [
        '.search_nav ',  // 顶部
        '.u_menu_member', // 会员
        /* 右下角 */
        '.tbui_fbar_down',
        '.tbui_fbar_refresh',
        '.tbui_fbar_share',
        '.tbui_fbar_feedback',
        '.tbui_fbar_favor',
        '.tbui_fbar_props',
        '.tbui_fbar_tsukkomi',
        '#aside',
        '#celebrity', // 右侧会员
        '.app_download_box', // 右侧下载app
        '.topic_list_box',   // 贴吧热议
        '#tieba-notice',     // 右侧反馈
        '.tieba_notice_theme2', // 右侧反馈
        '[ad-dom-img]',     // 广告
        '.share_btn_wrapper',// 一楼分享
        /* 底部发帖 */
        '.poster_head_surveillance',    // 政策
        '#footer',                      // 底部

        '.d_icons',     // 头像下面印记
        '.save_face_bg',  // 每层楼右上角图标
        '.d_nameplate',  // 头像特权图标
      ]
    }
  }


  const currentHref = location.href.split('?');
  console.log(currentHref);
  class BaiduClear {

    constructor(config){
      this.config = config;
      this.domain = '';
      this.query = null;
      this.init();
    }

    init(){
      const currentHref = location.href.split('?');
      this.domain = currentHref[0];
      this.query = currentHref[1];
      console.log(this.domain);
      
      this.domain.includes('tieba.baidu.com/p/') && (this.domain = 'https://tieba.baidu.com/p/'); // 贴吧看帖


      this.removeToHidden(this.config?.[this.domain]?.remove);
      this.addCss(this.config?.[this.domain]?.css);
      this.remove(this.config?.[this.domain]?.remove);
      this.config?.[this.domain]?.fn?.();
    }


    remove(arr = []){
      arr.map(item => $(item)).forEach(item => {
        item?.remove();
      })
    }

    removeToHidden(arr = []){
      if(!arr.length) return;
      this.addCss(arr.join(',') + `{display: none;}`)
    }

    addCss(css = ''){
      if(!css) return;
      let  style = document.createElement('style')
      style.innerHTML = css;
      document.documentElement.appendChild(style);
    }

  }
  new BaiduClear(config);
})();

