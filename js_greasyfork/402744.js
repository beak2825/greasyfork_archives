// ==UserScript==
// @name     破解VIP会员视频集合【更新维护版】
// @namespace  maintenance_code_huahuacat
// @version    4.2.7
// @description 一键破解[爱奇艺|腾讯|优酷||乐视|芒果|AB站|音悦台]等VIP或会员视频，普通视频去广告快速播放。解析接口贵精不贵多，每一个都精心测试挑选，绝对够用。详细方法看说明和图片。支持[Tampermonkey | Violentmonkey | Greasymonkey 4.0+][只想做一个纯纯的视频解析脚本][原作者为黄盐，此版本为日常更新维护版]【个人以为这是最好用的VIP视频解析脚本了】
// @author     黄盐，爱画画的猫
// require   https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @noframes
// @match    *://*.youku.com/v_*
// @match    *://*.iqiyi.com/v_*
// @match    *://*.iqiyi.com/w_*
// @match    *://*.iqiyi.com/a_*
// @match    *://v.qq.com/x/cover/*
// @match    *://v.qq.com/x/page/*
// @match    *://*.le.com/ptv/vplay/*
// @match    *://*.tudou.com/listplay/*
// @match    *://*.tudou.com/albumplay/*
// @match    *://*.tudou.com/programs/view/*
// @match    *://*.mgtv.com/b/*
// @match    *://film.sohu.com/album/*
// @match    *://tv.sohu.com/v/*
// @match    *://*.acfun.cn/v/*
// @match    *://*.bilibili.com/video/*
// @match    *://*.bilibili.com/anime/*
// @match    *://*.bilibili.com/bangumi/play/*
// @match    *://*.baofeng.com/play/*
// @match    *://vip.pptv.com/show/*
// @match    *://v.pptv.com/show/*
// @exclude  *://*.bilibili.com/blackboard/*
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM.xmlHttpRequest
// @grant    GM_openInTab
// @grant    GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/402744/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88%E3%80%90%E6%9B%B4%E6%96%B0%E7%BB%B4%E6%8A%A4%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/402744/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88%E3%80%90%E6%9B%B4%E6%96%B0%E7%BB%B4%E6%8A%A4%E7%89%88%E3%80%91.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const YoukuIcon = '<svg width="1.2em" height="1.2em" viewbox="0 0 72 72"><defs><circle id="youkuC1" r="5.5" style="stroke:none;;fill:#0B9BFF;"></circle><path id="youkuArow" d="m0,10 a5,5 0,0,1 0,-10 h20 a5,5 0,0,1 0,10z" style="fill:#FF4242;"></path></defs><circle cx="36" cy="36" r="30.5" style="stroke:#30B4FF;stroke-width:11;fill:none;"></circle><use x="10.5" y="19" xlink:href="#youkuC1"/><use x="61.5" y="53" xlink:href="#youkuC1"/><use x="39" y="1" transform="rotate(30)" xlink:href="#youkuArow"/><use x="-1" y="52" transform="rotate(-35)" xlink:href="#youkuArow"/></svg>';
  const VQQIcon = '<svg height="1.2em" width="1.2em" viewbox="0 0 185 170"><defs><path id="vQQ" d="M7 20Q14 -10 55 7Q100 23 145 60Q170 80 145 102Q108 138 47 165Q15 175 4 146Q-5 80 7 20"></path></defs><use style="fill:#44B9FD;" transform="translate(27,0)" xlink:href="#vQQ"></use><use style="fill:#FF9F01;" transform="translate(0,18),scale(0.8,0.75)" xlink:href="#vQQ"></use><use style="fill:#97E61B;" transform="translate(23,18),scale(0.80.75)" xlink:href="#vQQ"></use><use style="fill:#fff;" transform="translate(50,45),scale(0.4)" xlink:href="#vQQ"></use></svg>';
  const ALLIcon = '<svg t="1588768248845" class="icon" viewBox="0 0 1138 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="932" width="16" height="16"><path d="M379.69614405 380.39802133l0 87.73465219-87.73465217 0 0-87.73465219 87.73465217 0zM116.4921875 116.4921875l878.75027719 0 0 791.015625-878.75027719 0 0-791.015625zM467.43079702 687.8202434l0-351.64048602-263.20395656 0 0 351.64048602 87.73465218 0 0-131.95291692 87.73465219 0 0 131.95291692 87.73465219 0zM687.11836612 687.8202434l0-44.21826473-87.73465218 0 0-307.42222129-87.73465219 0 0 351.64048602 175.46930437 0zM906.80593522 687.8202434l0-44.21826473-87.73465219 0 0-307.42222129-87.73465219 0 0 351.64048602 175.46930438 0z" fill="#d81e06" p-id="933"></path></svg>';
  const ONEIcon = '<svg t="1588768042523" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="872" width="16" height="16"><path d="M148.29760742 310.20861816c9.31091309-16.14990234 29.99267578-21.67053223 46.06018067-12.35961913l307.17773437 177.40173339 304.12902832-175.58898926c16.14990234-9.31091309 36.74926758-3.7902832 46.06018067 12.35961915 0.16479492 0.24719239 0.24719239 0.41198731 0.32958984 0.65917969-2.88391114-5.76782227-7.33337403-10.71166992-13.34838867-14.17236328L519.99255372 114.43225097c-6.17980958-5.02624512-13.9251709-7.66296387-21.7529297-7.58056639-7.82775879-0.08239747-15.57312012 2.55432129-21.75292968 7.5805664l-315.5822754 182.18078613c-8.32214356 4.77905273-13.84277344 12.68920898-15.90270996 21.34094239 0.74157715-2.55432129 1.81274414-5.19104004 3.29589844-7.74536134z" fill="#13227a" p-id="873"></path><path d="M852.71350098 313.83410644c7.91015625 15.8203125 2.22473145 35.34851075-13.34838868 44.32983399L537.87280273 532.18737793v353.48510742c0 18.62182617-15.07873536 33.78295898-33.78295898 33.78295899-18.62182617 0-33.78295898-15.07873536-33.78295898-33.78295898V535.15368653l-309.73205567-178.80249025c-9.80529786-5.68542481-15.73791504-15.49072266-16.72668457-26.03759764v367.57507323c-1.23596192 12.77160645 4.8614502 25.62561036 16.72668458 32.46459961l319.20776366 184.32312013c6.17980958 5.02624512 13.9251709 7.66296387 21.7529297 7.58056639 7.82775879 0.08239747 15.57312012-2.55432129 21.75292968-7.5805664l309.81445312-178.88488769c13.67797852-4.28466797 23.64807129-17.05627442 23.64807129-32.21740723V329.81921386c0-5.85021973-1.4831543-11.28845215-4.03747558-15.98510741z" fill="#13227a" p-id="874"></path></svg>';
  const FASTIcon = '<svg t="1588769141475" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="994" width="16" height="16"><path d="M917.06000029 128.97500029a29.52 29.52 0 0 0-22.03500058-22.03500058c-161.145-37.01999971-336.93000029 7.03500029-462.17999971 132.28500058a493.02 493.02 0 0 0-48.70500029 56.80499942c-4.185 5.69999971-10.17 9.64500029-17.02499942 11.34-65.43 16.2-128.45999971 50.38499971-180.79500058 102.72000058a395.80499971 395.80499971 0 0 0-60.705 78.05999971c-14.31 24.165 10.215 52.66500029 36.55500029 42.93 41.56499971-15.36000029 86.47499971-22.905 132.76500029-22.93499971-0.64500029 3.94499971-1.575 7.84500029-2.13000029 11.79a1996.2 1996.2 0 0 0 101.59499971 109.665 1990.78499971 1990.78499971 0 0 0 109.665 101.59499971c3.94499971-0.55500029 7.84500029-1.485 11.77500058-2.13000029-0.02999971 46.28999971-7.57500029 91.19999971-22.93500058 132.76500029-9.73500029 26.34000029 18.765 50.86500029 42.93 36.55500029a395.89499971 395.89499971 0 0 0 78.075-60.705c52.31999971-52.31999971 86.50500029-115.36499971 102.70500029-180.78000029 1.69499971-6.85500029 5.65499971-12.84000029 11.34-17.02500029a493.02 493.02 0 0 0 56.80500029-48.70499942c125.26499971-125.28 169.31999971-301.05 132.3-462.195zM715.19000029 450.51499971a100.19999971 100.19999971 0 1 1-141.72000029-141.71999942 100.19999971 100.19999971 0 0 1 141.72000029 141.71999942z" fill="#d81e06" p-id="995"></path><path d="M223.26499971 667.99999971C192.88999971 698.37499971 64.115 886.58 100.77499971 923.23999971c36.65999971 36.65999971 224.865-92.13000029 255.24-122.49 30.375-30.375 25.27499971-84.70500029-11.385-121.34999971-36.65999971-36.675-91.00500029-41.77500029-121.365-11.40000029z" fill="#d81e06" p-id="996"></path></svg>';
  var tMscript = document.createElement('script');
  tMscript.innerText = `q = function(cssSelector){return document.querySelector(cssSelector);};qa = function(cssSelector){return document.querySelectorAll(cssSelector);};`;
  document.head.appendChild(tMscript);
  window.q = function(cssSelector) {return document.querySelector(cssSelector);};
  window.qa = function(cssSelector) {return document.querySelectorAll(cssSelector);};
  window.makeEl = function(tag){return document.createElement(tag);};
  /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+ */
  function GMaddStyle(cssText){
    let a = document.createElement('style');
    a.textContent = cssText;
    let doc = document.head || document.documentElement;
    doc.appendChild(a);
  }
  /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
   * 为了兼容GreasyMonkey 4.0 获取结构化数据,比如 json Array 等,
   * 应当先将字符串还原为对象,再执行后续操作
   * GMgetValue(name,defaultValue).then((result)=>{
   *   let result = JSON.parse(result);
   *   // other code...
   * };
   */
  function GMgetValue(name, defaultValue) {
    if (typeof GM_getValue === 'function') {
      return new Promise((resolve, reject) => {
      resolve(GM_getValue(name, defaultValue));
      // reject();
      });
    } else {
      return GM.getValue(name, defaultValue);
    }
  }
  /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
   * 为了兼容GreasyMonkey 4.0 储存结构化数据,比如 json Array 等,
   * 应当先将对象字符串化,
   * GMsetValue(name, JSON.stringify(defaultValue))
   */
  function GMsetValue(name, defaultValue) {
    if (typeof GM_setValue === 'function') {
      GM_setValue(name, defaultValue);
    } else {
      GM.setValue(name, defaultValue);
    }
  }
  function GMxmlhttpRequest(obj){
    if (GM_xmlhttpRequest === "function") {
      GM_xmlhttpRequest(obj);
    } else{
      GM.xmlhttpRequest(obj);
    }
  }
  var replaceRaw,  /*是否嵌入当前页面*/
  episodes,        /*是否启用爱奇艺正确选集*/
  userApisOn;      /*是否加载自定义解析接口*/
  GMaddStyle(`
    /*TMHY:TamperMonkeyHuanYan*/
    #TMHYvideoContainer{z-index:999998;background:rgba(0,0,0,.7);position:fixed;top:7em;left:5em;height:65%;width:65%;resize:both;overflow:auto;box-shadow:2px 2px 5px 5px rgba(255,255,0,.8);}
    /*TMHYVideoContainer*/
    #TMHYvideoContainer button{top:.1em;cursor:pointer;visibility:hidden;font-size:3em;color:#fff;background:transparent;border:0;}
    #TMHYvideoContainer:hover button{visibility:visible;}
    #TMHYvideoContainer:hover button:hover{color:#ff0;}
    #TMHYiframe{height:100%;width:100%;overflow:auto;position:absolute;top:0;left:0;margin:auto;border:0;box-shadow:0 0 3em rgba(0,0,0,.4);z-index:-1;}
    /*TMHYIframe*/
    #TMHYul{position:fixed;top:5em;left:0;padding:0;z-index:999999;}
    #TMHYul li{list-style:none;}
    #TMHYul svg{float:right;}
    .TM1{opacity:0.3;position:relative;padding-right:.5em;width:1.5em;cursor:pointer;}
    .TM1:hover{opacity:1;}
    .TM1 span{display:block;border-radius:0 .3em .3em 0;background-color:#ffff00;border:0;font:bold 1em "微软雅黑"!important;color:#ff0000;margin:0;padding:1em .3em;}
    .TM3{position:absolute;top:0;left:1.5em;display:none;border-radius:.3em;margin:0;padding:0;}
    .TM3 li{float:none;width:6em;margin:0;font-size:1em;padding:.15em 1em;cursor:pointer;color:#3a3a3a!important;background:rgba(255,255,0,0.8);}
    .TM3 li:hover{color:white!important;background:rgba(0,0,0,.8);}
    .TM3 li:last-child{border-radius:0 0 .35em .35em;}
    .TM3 li:first-child{border-radius:.35em .35em 0 0;}
    .TM1:hover .TM3{display:block;}
    /*自定义解析接口,本页播放窗口设置*/
    .TMHYp {position:fixed;top:20%;left:20%;z-index:999999;background:yellow;padding:30px 20px 10px 20px;border-radius:10px;text-align:center;}/*TMHYpanel*/
    .TMHYp * {font-size:16px;background:rgba(255,255,0,1);font-family:'微软雅黑';color:#3a3a3a;border-radius:10px;}
    #tMuserDefine li {margin:5px;width:100%;list-style-type:none;}
    .TMHYp input[type=text] {border-radius:5px !important;border:1px solid #3a3a3a;margin:2px 10px 2px 5px;padding:2px 5px;}
    .TMHYlti {width:350px;}/*TMHYlongTextInput*/
    .TMHYmti {width:160px;}/*TMHYmti*/
    .idelete {float: left;  display: inline-block; color: red; padding: 0 20px !important; cursor: pointer;}
    .iname {padding-right:10px;}
    li:hover .idelete,li:hover .ilink,li:hover .iname {background:rgba(224,175,17,0.62);}
    .TMHYp button {border:1px solid #3a3a3a;border-radius:5px;cursor:pointer;padding: 2px 10px;margin:10px 20px 0 20px;}
    .TMHYp button:hover {background:#3a3a3a;color:yellow;}
    .TMHYClose {position:absolute;top:0;left:0;margin:0!important;}
    .TMHYp fieldset {margin:0;padding:10px;}
    .TMHYp legend {padding:0 10px;}
    .TMHYp label {display:inline-block;}
    .TMHYspan80 {display:inline-block;text-align:right;width:80px;}
    .TMHYspan120 {display:inline-block;text-align:right;width:120px;}
    #inTabSettingSave {position:relative;margin-top:10px;padding:3px 20px;}
  `);
  var defaultapi = {
    title: "KIWI解析,失效请更换接口",
    url: "http://kiwi8.top/mov/s?url="
  };
  //apis name:显示的文字  url:接口  title:提示文字  intab:是否适合内嵌(嵌入判断:GMgetValue("replaceRaw",false)值||intab值)
  var apis =[
    {name:"组合解析"+ALLIcon,url:"http://kiwi8.top/mov/s?url=",title:"KIWI解析，组合型解析，站长会维护排名",intab:0},
    {name:"纯净线路"+ONEIcon,url:"https://z1.m1907.cn/?jx=",title:"纯净线路，没有广告，资源丰富，但是速度不是太快",intab:1},
    {name:"黑云解析"+FASTIcon,url:"http://jiexi.380k.com/?url=",title:"速度块，好用",intab:0},
    {name:"石头解析",url:"https://jiexi.071811.cc/jx.php?url=",title:"手动点播放",intab:0},
    {name:"小童影视",url:"http://www.hb23888.vip/jxurl.php?url=",title:"速度勉强，需要手动点播放",intab:1},
    {name:"千叶解析",url:"https://yi29f.cn/vip.php?url=",title:"手动点播放",intab:1},
    {name:"927解析",url:"https://api.927jx.com/vip/?url=",title:"手动点播放",intab:1},
    {name:"星空解析",url:"https://jx.fo97.cn/?url=",title:"手动点播放",intab:1},
    {name:"无名小站",url:"http://www.sfsft.com/admin.php?url=",title:"无名小站同源",intab:0},
    {name:"无名小站2",url:"http://www.wmxz.wang/video.php?url=",title:"转圈圈就换线路",intab:0},
    {name:"人人发布",url:"http://v.renrenfabu.com/jiexi.php?url=",title:"综合，多线路",intab:0},
    {name:"二度解析",url:"https://jx.du2.cc/?url=",title:"手动点播放",intab:1},
  ];
  //嵌入页面播放
  function openInTab(evt) {
    // 找到支持的方法, 使用需要全屏的 element 调用
    function launchFullScreen(element) {
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    if(evt.target.dataset.intab === '1'){
      //如果页面有播放窗口,只需更新播放窗口的 src, 如果没有播放窗口,读取播放窗口位置信息,新建一个播放窗
      if(q('#TMHYiframe') === null){
        GMgetValue('intabSize','{"height":"","width":"","left":"","top":""}').then((position)=>{
          var sty = JSON.parse(position);
          sty = 'height:'+sty.height+';width:'+sty.width+';left:'+sty.left+';top:'+sty.top+';';
          var a = makeEl('div');
          a.id = 'TMHYvideoContainer';
          a.setAttribute('style', sty);
          a.innerHTML = '<button title="关闭" id="TMHYIframeClose">&#128473;</button><button id="TMHYfullScreen" title="全屏">&#128470;</button>';
          document.body.appendChild(a);
          var b=makeEl('iframe');
          b.id='TMHYiframe';
          b.src=evt.target.dataset.url + location.href;
          q('#TMHYvideoContainer').appendChild(b);
          q('#TMHYIframeClose').addEventListener('click', ()=>{document.body.removeChild(q('#TMHYvideoContainer'));}, false);
          q('#TMHYfullScreen').addEventListener('click', ()=>{launchFullScreen(q('#TMHYiframe'));}, false);
        });
      } else{
        q('#TMHYiframe').src=evt.target.dataset.url + location.href;
      }
    } else{
      //不适合页内播放的,打开新标签
      window.open(evt.target.dataset.url + location.href);
    }
  }
  //保存嵌入页面大小位置设置
  function saveInTabSetting(){
    var intabSize = {
      height:q('#TMpH').value,
      width:q('#TMpW').value,
      left:q('#TMpL').value,
      top:q('#TMpT').value
    };
    GMsetValue('intabSize', JSON.stringify(intabSize));
    setTimeout('document.body.removeChild(q("#TMHYSetting"));', 30);
  }
  //生成"嵌入页面大小位置设置"面板
  function intabSetting(){
    var intabSize = GMgetValue('intabSize','{"height":"","width":"","left":"","top":""}')
    .then((ag)=>{
      var a = makeEl('div');
      a.id='TMHYSetting';
      a.setAttribute('class', 'TMHYp');
      a.innerHTML = `
      <button class="TMHYClose" onclick="document.body.removeChild(this.parentNode)">&#128473;</button>
      <fieldset>
        <legend>页内播放窗口位置大小</legend>
        <label for="TMpH"><span class="TMHYspan80">高度</span><input type="text" id="TMpH" value="${intabSize.height}"  class="TMHYmti" placeholder='如"300px"或者"65%"'/></label>
        <label for="TMpW"><span class="TMHYspan80">宽度</span><input type="text" id="TMpW" value="${intabSize.width}"  class="TMHYmti" placeholder='如"300px"或者"65%"'/></label><br />
        <label for="TMpL"><span class="TMHYspan80">左边距</span><input type="text" id="TMpL" value="${intabSize.left}"  class="TMHYmti" placeholder='如"300px"或者"65%"'/></label>
        <label for="TMpT"><span class="TMHYspan80">上边距</span><input type="text" id="TMpT" value="${intabSize.top}"  class="TMHYmti" placeholder='如"300px"或者"65%"'/></label>
      </fieldset>
      <button onclick="(function(){var a=getComputedStyle(q('#TMHYvideoContainer'));q('#TMpH').value=a.height,q('#TMpW').value=a.width,q('#TMpL').value=a.left,q('#TMpT').value=a.top;})()">获取当前播放窗尺寸</button>
      <button id="intabSettingPreview" onclick="(function(){a=q('#TMHYvideoContainer').style.cssText='height:'+q('#TMpH').value+';width:'+q('#TMpW').value+';left:'+q('#TMpL').value+';top:'+q('#TMpT').value+';';})()">预览</button>
      <button id="intabSettingSave">保存</button>
      `;
      document.body.appendChild(a);
      q('#intabSettingSave').addEventListener('click', saveInTabSetting, false);
    });
  }
  //检查是否勾选页内解析
  function noNewTabCheck() {
    var x, arr = qa(".TM4 li");
    replaceRaw = q("#intabChekbx").checked;
    GMsetValue("replaceRaw", replaceRaw);
    for (x = 0; x < arr.length; x++) {
      if (replaceRaw) {
        arr[x].addEventListener("click", openInTab, false);
        arr[x].setAttribute('onclick', '');
      } else {
        arr[x].removeEventListener("click", openInTab, false);
        arr[x].setAttribute('onclick', 'window.open(this.dataset.url + location.href)');
      }
    }
  }
  /* 爱奇艺正确选集 */
  function rightEpsLinkCheck() {
    episodes = q("#realLinkChekbx").checked;
    GMsetValue("episodes", episodes);
    try {
      if (episodes) {
        q('#widget-dramaseries').addEventListener('click', function getLink(e) {
        //-------------iqiyi剧集真实播放页面方法  Begin------------------
        //Code piece infomation:
        //License:MIT   Author:hoothin  Homepage: http://hoothin.com  Email: rixixi@gmail.com
          var target = e.target.parentNode.tagName == "LI" ? e.target.parentNode : (e.target.parentNode.parentNode.tagName == "LI" ? e.target.parentNode.parentNode : e.target.parentNode.parentNode.parentNode);
          if (target.tagName != "LI") return;
          GMxmlhttpRequest({
            method: 'GET',
            url: "http://cache.video.qiyi.com/jp/vi/" + target.dataset.videolistTvid + "/" + target.dataset.videolistVid + "/?callback=crackIqiyi",
            onload: function(result) {
              var crackIqiyi = function(d) {
                location.href = d.vu;
              };
              eval(result.responseText);
            }
          });
        });
        //-------------iqiyi剧集真实播放页面方法  End------------------
      } else {
        q('#widget-dramaseries').removeEventListener('click', getLink);
      }
    } catch(e) {}
  }
  /* 勾选自定义接口 */
  function addApiCheck() {
    userApisOn = q('#addApiChekBx').checked;
    GMsetValue('userApisOn', userApisOn);
    if(userApisOn) {
      selfDefine();
      setTimeout(showAddApiPanel, 200);
    }
  }
  /*  执行  */
  var div = makeEl("div");
  div.id = "TMHYd";
  var txt = '', i = 0;
  /*提供的接口列表*/
  for (i in apis) {
    txt += `<li data-order=${i} data-url="${apis[i].url}" data-intab=${apis[i].intab} title="${apis[i].title}" onclick="window.open(this.dataset.url+location.href)">${apis[i].name}</li>`;
  }
  div.innerHTML = `
    <ul id="TMHYul">
      <li class="TM1"><span id="TMList"  title="${defaultapi.title}" onclick="window.open(\'${defaultapi.url}\'+window.location.href)">▶</span><ul class="TM3 TM4">${txt}</ul></li>
      <li class="TM1"><span id="TMSet">▣</span><ul class="TM3">
        <li><label><input type="checkbox" id="intabChekbx">本页解析</label></li>
        <li><label><input type="checkbox" id="realLinkChekbx">爱奇艺正确选集</label></li>
        <li><input type="checkbox" id="addApiChekBx"><label id="addApiBtn">增加接口</label></li>
        <li><label id="intabSettingBtn">本页播放设置</label></li>
      </ul></li>
    </ul>
  `;
  document.body.appendChild(div);
  q("#addApiChekBx").addEventListener('change', addApiCheck, false);
  // q("#addApiChekBx").addEventListener('click', addApiCheck, false);
  GMgetValue('userApisOn',false)
  .then((ag)=>{
    userApisOn = ag;
    q("#addApiChekBx").checked = userApisOn;
    /*看看是否需要加载自定义的接口列表*/
    if (userApisOn) {
      GMgetValue('userApis', "[{}]").then((ag1)=>{
        var userApis = JSON.parse(ag1), txt='';
        for (var j in userApis) {
          try {
            if (userApis[j].link !== null) {
              txt += `<li data-order=${j} data-url="${userApis[j].link}"  data-intab=${userApis[j].intab} onclick="window.open(this.dataset.url+location.href)">${userApis[j].name}</li>`;
            }
          } catch (e) {/*console.log(e);*/}
        }
        q('ul.TM3.TM4').innerHTML = txt + q('ul.TM3.TM4').innerHTML;
        selfDefine();
      });
    }
  })
  .then(()=>{
    q("#intabChekbx").addEventListener("click", noNewTabCheck, false);
    GMgetValue('replaceRaw',false).then((ag)=>{
      replaceRaw = ag;
      q("#intabChekbx").checked = replaceRaw;
      if (replaceRaw) {
        noNewTabCheck();
      }
    });
    q("#realLinkChekbx").addEventListener("click", rightEpsLinkCheck, false);
    GMgetValue('episodes',false).then((ag)=>{
      episodes = ag;
      q("#realLinkChekbx").checked = episodes;
      if (episodes && window.location.href.indexOf("iqiyi") != -1) {
        rightEpsLinkCheck();
      }
    });
    q("#addApiBtn").addEventListener('click', showAddApiPanel, false);
    q("#intabSettingBtn").addEventListener('click', intabSetting, false);
  });

/** 2017-10-24  自定义解析接口  */
/*  显示增加接口的面板  */
  function showAddApiPanel() {
    if (q('#tMuserDefine')) {
      q('#tMuserDefine').style.display = "block";
    } else {
      alert(`(●￣(ｴ)￣●)づ\n\n未启用[增加接口]功能\n请把 '▣增加接口'→'☑增加接口'!`);
    }
  }
/*  生成增加接口面板  */
  function selfDefine() {
    var a = makeEl('div');
    a.id = 'tMuserDefine';
    a.setAttribute('class', 'TMHYp');
    a.setAttribute('style', 'display:none');
    var txt = `
      <button class="TMHYClose" onclick="q('#tMuserDefine').style.display='none';">🗙</button>
      <li><span class="TMHYspan120">解析接口名称:</span><input type="text" id="tMname" class="TMHYlti" placeholder="显示的名称"></li>
      <li><span class="TMHYspan120">解析接口地址:</span><input type="text" id="tMparseLink" class="TMHYlti" placeholder="接口需要包含 http 或者 https"></li>
      <li><span class="TMHYspan80">本页解析:</span><label for="tMintabckbx"><input type="checkbox" id="tMintabckbx"/>适合</label></li>
      <li id="tMbtnLi">
        <button id="tMgo" onclick="window.open(q('#tMparseLink').value+location.href)">测试</button>
        <button id="tMadd">增加</button>
        <button id="tMsave">保存</button>
      </li>
    `;
    GMgetValue('userApis', "[{}]").then((ag)=>{
      var ar = JSON.parse(ag),d;
      try {
        if (ar[0].name !== undefined) {
          for (var i = 0; i < ar.length; i++) {
            d = (ar[i].intab==="1")?'checked':'';
            txt += `<li><span class="idelete" title="删除" onclick="document.getElementById('tMuserDefine').removeChild(this.parentNode)">✘</span><input class="icheck" type="checkbox" ${d}><span class="iname">${ar[i].name}</span><span class="ilink">${ar[i].link}</span></li>`;
          }
        }
      } catch (e) {}
      a.innerHTML = txt;
      document.body.appendChild(a);
      /*事件绑定*/
      q('#tMsave').addEventListener('click', function() {
        var newParseLinks = getarr();
        GMsetValue('userApis', JSON.stringify(newParseLinks));
        console.log(newParseLinks);
      }, false);
      q('#tMadd').addEventListener('click', function() {
        if (q('#tMname').value || q('#tMparseLink').value) {
          var b = q("#tMintabckbx").checked?"1":"0";
          var c = q("#tMintabckbx").checked?"checked":"";
          var a = makeEl('li');
          a.innerHTML = `<span class="idelete" title="删除" onclick="document.getElementById('tMuserDefine').removeChild(this.parentNode)">✘</span><input class="icheck" type="checkbox" ${c}><span class="iname">${q('#tMname').value}:</span><span class="ilink">${q('#tMparseLink').value}</span>`;
          if (q('span[class=iname]') === null) {
            q('#tMuserDefine').appendChild(a);
            q('#tMname').value = '';
            q('#tMparseLink').value = '';
          } else {
            q('#tMuserDefine').insertBefore(a, q('span[class=iname]').parentNode);
            q('#tMname').value = '';
            q('#tMparseLink').value = '';
          }
        }
      }, false);
    });
  }
/*  保存按钮执行函数:获取值并 await GM.setValue()  */
  function getarr() {
    var userUrl = qa('.ilink');
    var urlarr = [], tMname, tMparseLink, tMintabckbx;
    tMname = q('#tMname').value;
    tMparseLink = q('#tMparseLink').value;
    tMintabckbx = q('#tMintabckbx').checked?1:0;
    if (tMname || tMparseLink) {
      urlarr.push({ name: tMname, link: tMparseLink, intab:tMintabckbx });
    }
    for (var i = 0; i < userUrl.length; i++) {
      var n, t, l;
      t = userUrl[i].innerText;
      n = userUrl[i].previousSibling.innerText;
      l = userUrl[i].previousSibling.previousSibling.checked?'1':'0';
      urlarr.push({ name: n, link: t,intab:l });
    }
    return urlarr;
  }
})();