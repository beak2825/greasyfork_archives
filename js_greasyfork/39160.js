// ==UserScript==
// @name     破解VIP会员视频集合zz
// @namespace  https://greasyfork.org/zh-CN/users/104201
// @version    4.2.4
// @description  一键破解[优酷|腾讯|乐视|爱奇艺|芒果|AB站|音悦台]等VIP或会员视频，解析接口贵精不贵多，绝对够用。详细方法看说明和图片。包含了[VIP视频在线解析破解去广告(全网)xx.xx.xx更新可用▶sonimei134][破解全网VIP视频会员-去广告▶ttmsjx][VIP会员视频解析▶龙轩][酷绘-破解VIP会员视频▶ahuiabc2003]以及[VIP视频破解▶hoothin]的部分接口。[Tampermonkey | Violentmonkey | Greasymonkey 4.0+]
// @author     黄盐
// require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @noframes
// @match    *://*.iqiyi.com/*
// @match    *://*.youku.com/*
// @match    *://*.le.com/*
// @match    *://*.letv.com/*
// @match    *://v.qq.com/*
// @match    *://*.tudou.com/*
// @match    *://*.mgtv.com/*
// @match    *://film.sohu.com/*
// @match    *://tv.sohu.com/*
// @match    *://*.acfun.cn/v/*
// @match    *://*.bilibili.com/*
// @match    *://vip.1905.com/play/*
// @match    *://*.pptv.com/*
// @match    *://v.yinyuetai.com/video/*
// @match    *://v.yinyuetai.com/playlist/*
// @match    *://*.fun.tv/vplay/*
// @match    *://*.wasu.cn/Play/show/*
// @match    *://*.56.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/39160/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39160/%E7%A0%B4%E8%A7%A3VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E9%9B%86%E5%90%88zz.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const YoukuIcon = '<svg width="1.2em" height="1.2em" viewbox="0 0 72 72"><defs><circle id="youkuC1" r="5.5" style="stroke:none;;fill:#0B9BFF;"></circle><path id="youkuArow" d="m0,10 a5,5 0,0,1 0,-10 h20 a5,5 0,0,1 0,10z" style="fill:#FF4242;"></path></defs><circle cx="36" cy="36" r="30.5" style="stroke:#30B4FF;stroke-width:11;fill:none;"></circle><use x="10.5" y="19" xlink:href="#youkuC1"/><use x="61.5" y="53" xlink:href="#youkuC1"/><use x="39" y="1" transform="rotate(30)" xlink:href="#youkuArow"/><use x="-1" y="52" transform="rotate(-35)" xlink:href="#youkuArow"/></svg>';
  const VQQIcon = '<svg height="1.2em" width="1.2em" viewbox="0 0 185 170"><defs><path id="vQQ" d="M7 20Q14 -10 55 7Q100 23 145 60Q170 80 145 102Q108 138 47 165Q15 175 4 146Q-5 80 7 20"></path></defs><use style="fill:#44B9FD;" transform="translate(27,0)" xlink:href="#vQQ"></use><use style="fill:#FF9F01;" transform="translate(0,18),scale(0.8,0.75)" xlink:href="#vQQ"></use><use style="fill:#97E61B;" transform="translate(23,18),scale(0.80.75)" xlink:href="#vQQ"></use><use style="fill:#fff;" transform="translate(50,45),scale(0.4)" xlink:href="#vQQ"></use></svg>';
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
    title: "龙轩脚本的接口，默认用浮空解析，失效请更换接口",
    url: "http://goudidiao.com/?url="
  };
  //apis name:显示的文字  url:接口  title:提示文字  intab:是否适合内嵌(嵌入判断:GMgetValue("replaceRaw",false)值||intab值)
  var apis =[
    {name:"够低调",url:"http://goudidiao.com/?url=",title:"转圈圈就换线路",intab:1},
    {name:"百域阁",url:"http://api.baiyug.cn/vip/index.php?url=",title:"转圈圈就换线路",intab:1},
    {name:"搜你妹"+YoukuIcon,url:"http://www.sonimei.cn/?url=",title:"综合接口，VIP视频*** 更新可用【作者sonimei134】脚本的接口",intab:0},
    {name:"vParse"+VQQIcon,url:"https://api.vparse.org/?url=",title:"支持腾讯",intab:1},
    {name:"猫云"+VQQIcon,url:"https://jx.maoyun.tv/index.php?id=",title:"支持腾讯",intab:1},
    {name:"噗噗电影",url:"http://pupudy.com/play?make=url&id=",title:"综合接口，破解全网VIP视频会员-去广告【作者ttmsjx】脚本的接口",intab:0},
    {name:"抢先影院"+YoukuIcon,url:"http://www.qxyingyuan.vip/play?make=url&id=",title:"据说优酷比较稳定",intab:0},
    {name:"酷绘",url:"http://appapi.svipv.kuuhui.com/svipjx/liulanqichajian/browserplugin/qhjx/qhjx.php?id=",title:"综合接口，酷绘*【作者ahuiabc2003】脚本的接口",intab:0},
    {name:"旋风解析",url:"http://api.xfsub.com/index.php?url=",title:"1905优先使用",intab:1},
    {name:"石头解析",url:"https://jiexi.071811.cc/jx.php?url=",title:"手动点播放",intab:1},
    {name:"无名小站",url:"http://www.sfsft.com/admin.php?url=",title:"无名小站同源",intab:1},
    {name:"VIP看看",url:"http://q.z.vip.totv.72du.com/?url=",title:"更换线路成功率会提高",intab:1},
    {name:"ODFLV",url:"http://aikan-tv.com/?url=",title:"不稳定，广告过滤软件可能有影响",intab:1},
    {name:"163人",url:"http://jx.api.163ren.com/vod.php?url=",title:"偶尔支持腾讯",intab:1},
    //{name:"CKFLV",url:"http://www.0335haibo.com/tong.php?url=",title:"CKFLV云,部分站点不支持",intab:1},
    {name:"无名小站2",url:"http://www.wmxz.wang/video.php?url=",title:"转圈圈就换线路",intab:1},
    //{name:"眼睛会下雨",url:"http://www.vipjiexi.com/yun.php?url=",title:"www.vipjiexi.com",intab:1},
    {name:"人人发布",url:"http://v.renrenfabu.com/jiexi.php?url=",title:"综合，多线路",intab:0}
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
      <button class="TMHYClose" onclick="q('#tMuserDefine').style.display='none';">?</button>
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
/** 2017-10-24  自定义解析接口 END */

})();

// 资源参考http://www.5ifxw.com/vip/
// 资源参考http://live.gopartook.com/
// 资源参考http://tv.dsqndh.com
// 资源参考http://51.ruyo.net/p/3127.html
//有效性未知||不能直接引用接口
//http://www.yydy8.com/common/?url=
//href="http://mt2t.com/yun?url=
//https://api.47ks.com/webcloud/?v=
//http://www.guqiankun.com/tools/vipvideo
//{name:"PU.tn",url:"http://api.pu.tn/qq1/?url=",title:"据说可以看优酷布袋游戏",intab:0},
// {name:"舞动秋天",url:"http://qtzr.net/s/?qt=",title:"qtzr.net",intab:1},
//过期接口
//{name:"65YW",url:"http://www.65yw.com/65yw/?vid=",title:"新接口，稳定性未知"},
//{name:"紫狐",url:"http://yun.zihu.tv/play.html?url=",title:"效果可能不稳定"},
//{name:"云解析",url:"http://www.efunfilm.com/yunparse/index.php?url=",title:"新接口，稳定性未知"},
//{name:"妹儿云",url:"https://www.yymeier.com/api.php?url=",title:"不稳定"}
//{name:"V云[腾讯]",url:"http://www.viyun.me/jiexi.php?url=",title:"腾讯首选"},
//{name:"1008影视"+YoukuIcon,url:"http://api.1008net.com/v.php?url=",title:"据说可以看布袋游戏视频",intab:1},
//{name:"FLVSP[腾讯]",url:"https://api.flvsp.com/?url=",title:"支持腾讯",intab:1},//解析源同上