// ==UserScript==
// @name         Anlslibrary
// @author       Jones Miller
// @version      21.12.12
// @namespace    https://t.me/jsday
// @description  .anleshilibrary. No ads, no login. Analyze VIP video, advanced on-demand. Multi-interface free choice, some interfaces support high-definition playback. It is not guaranteed to parse all videos. Mobile phone scan code playback, Douyin to remove watermark. Non-professionals All data is collected on the Internet-thanks to the original author for deleting if there is any infringement.
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/odzn6d9sltx0utpy7dmb2hnz5mek
// @include      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/437099/Anlslibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/437099/Anlslibrary.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
  var apis=[
    {name:"7cyd",url: "https://v.7cyd.com/vip/?url="}, {name:"973973",url: "https://jx.973973.xyz/?url="}, {name:"ap2p",url: "https://jx.ap2p.cn/?url="}, {name:"h8jx",url: "https://www.h8jx.com/jiexi.php?url="}, {name:"jiubo",url: "https://jx.jiubojx.com/vip.php?url="}, {name:"jiexi",url: "https://api.jiexi.la/?url="}, {name:"lang",url: "https://jx.xiaolangyun.com/?url="}, {name:"m1907",url: "https://z1.m1907.cn/?jx="}, {name:"nxflv",url: "https://www.nxflv.com/?url="}, {name:"okjx",url: "https://okjx.cc/?url="}, {name:"parwix",url: "https://vip.parwix.com:4433/player/?url="}, {name:"youyitv",url: "https://jx.youyitv.com/?url="}
  ];
  var apis2=[
    {"name":"纯净解析","url":"https://z1.m1907.cn/?jx="},{"name":"高速接口1","url":"https://jsap.attakids.com/?url="},{"name":"B站解析1","url":"https://vip.parwix.com:4433/player/?url="},{"name":"B站解析2","url":"https://www.cuan.la/m3u8.php?url="},{"name":"虾米","url":"https://jx.xmflv.com/?url="},{"name":"Ckplayer","url":"https://www.ckplayer.vip/jiexi/?url="},{"name":"BL","url":"https://vip.bljiex.com/?v="},{"name":"乐多资源","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},{"name":"ccyjjd","url":"https://ckmov.ccyjjd.com/ckmov/?url="},{"name":"M3U8","url":"https://jx.m3u8.tv/jiexi/?url="},{"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},{"name":"Mao解析","url":"https://qd.hxys.tv/m3u8.php?url="},{"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url="},{"name":"SSAMAO","url":"https://www.ssamao.com/jx/?url="},{"name":"无极","url":"https://da.wujiys.com/?url="},{"name":"618G","url":"https://jx.618g.com/?url="},{"name":"ckmov","url":"https://www.ckmov.vip/api.php?url="},{"name":"迪奥","url":"https://123.1dior.cn/?url="},{"name":"福星","url":"https://jx.popo520.cn/jiexi/?url="},{"name":"RDHK","url":"https://jx.rdhk.net/?v="},{"name":"H8","url":"https://www.h8jx.com/jiexi.php?url="},{"name":"解析la","url":"https://api.jiexi.la/?url="},{"name":"久播","url":"https://jx.jiubojx.com/vip.php?url="},{"name":"九八","url":"https://jx.youyitv.com/?url="},{"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},{"name":"乐喵","url":"https://jx.hao-zsj.cn/vip/?url="},{"name":"MUTV","url":"https://jiexi.janan.net/jiexi/?url="},{"name":"明日","url":"https://jx.yingxiangbao.cn/vip.php?url="},{"name":"磨菇","url":"https://jx.wzslw.cn/?url="},{"name":"OK","url":"https://okjx.cc/?url="},{"name":"维多","url":"https://jx.ivito.cn/?url="},{"name":"小蒋","url":"https://www.kpezp.cn/jlexi.php?url="},{"name":"小狼","url":"https://jx.yaohuaxuan.com/?url="},{"name":"智能","url":"https://vip.kurumit3.top/?v="},{"name":"星驰","url":"https://vip.cjys.top/?url="},{"name":"星空","url":"http://60jx.com/?url="},{"name":"月亮","url":"https://api.yueliangjx.com/?url="},{"name":"0523","url":"https://go.yh0523.cn/y.cy?url="},{"name":"云端","url":"https://jx.ergan.top/?url="},{"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url="},{"name":"66","url":"https://api.3jx.top/vip/?url="},{"name":"116","url":"https://jx.116kan.com/?url="},{"name":"200","url":"https://vip.66parse.club/?url="},{"name":"云析","url":"https://jx.yparse.com/index.php?url="},{"name":"8090","url":"https://www.8090g.cn/?url="}
  ];
  var jmuapc = "^https://v.qq.com/x/cover|^https://www.iqiyi.com/v_|^https://v.youku.com/v_show|^http(s)?://www.le.com/ptv/vplay|^https://www.bilibili.com/bangumi/play|^https://www.mgtv.com/b|^http(s)?://v.pptv.com/show/|^https://tv.sohu.com/v";
  var jmuamobile = "^http(s)?://m.v.qq.com|^https://m.iqiyi.com/v_|^https://m.youku.com/alipay_video|^https://m.youku.com/video/id|^http(s)?://m.le.com/vplay_|^https://m.bilibili.com/bangumi/play|^https://m.mgtv.com/b|^http(s)?://m.pptv.com/show/|^https://m.tv.sohu.com/v"; 
  var jmuady = "^https://www.iesdouyin.com/share/video/|^https://www.douyin.com/share/video/";
  function createSelect(apis) {
    function jmontouchmouse() {
      jmalsli.setAttribute("style","color:#000 !important;");
      jmalsli.ontouchstart=jmalsli.onmouseover=function () {
        this.style="background:linear-gradient(to right,rgba(255,255,255,0) 0,rgba(255,255,255,.3) 50%,rgba(255,255,255,0) 100%) !important;color:#eef6fc !important;";
      };
      jmalsli.ontouchend=jmalsli.onmouseout=function () {
        this.style="background:transparent !important;color:#000 !important;";
      };
    };
    function jmonParsing() {
      (function (jm) {
        jmontouchmouse();
      })(i);
    };
    function jmonParsing2() {
      (function (jm) {
        jmalsli.onclick = function () {
          window.open(apis[jm].url + location.href, '_blank');
        };
        jmontouchmouse();
      })(i);
    };
    function jmonParsing3() {
      (function (jm) {
        jmalsli.onclick = function () {
          window.open(apis2[jm].url + location.href, '_blank');
        };
        jmontouchmouse();
      })(i);
    };
    for (var i=0; i < apis.length; i++) {
      var jmalsli=document.createElement("div");
      jmalsli.id="jmalsli";
      jmonParsing();
      jmalsli.innerHTML="<span class='spanStyle' style='"+jmalsli+"' url='"+apis[i].url+"'>"+apis[i].name+"</span>";
      jmalsul.appendChild(jmalsli);
    };   
    for (var i=0; i < apis2.length; i++) {
      var jmalsli=document.createElement("div");
      jmalsli.id="jmalsli";
      jmonParsing();
      jmalsli.innerHTML="<span class='spanStyle' style='"+jmalsli+"' url='"+apis2[i].url+"'>"+apis2[i].name+"</span>";
      jmalsul2.appendChild(jmalsli);
    };   
    for (var i=0; i < apis.length; i++) {
      var jmalsli=document.createElement("div");
      jmalsli.id="jmalsli";
      jmonParsing2();
      jmalsli.innerHTML=apis[i].name;
      jmalsulbk.appendChild(jmalsli);
    };
    for (var i=0; i < apis2.length; i++) {
      var jmalsli=document.createElement("div");
      jmalsli.id="jmalsli";
      jmonParsing3();
      jmalsli.innerHTML=apis2[i].name;
      jmalsul2bk.appendChild(jmalsli);
    };
    jmals_ul.onclick=function(){ jmalsul.style='width:100%;';jmals_hm.style='left:0;width:0;';jmbkqh.style.display='block';Parsing();};
    jmals_ul2.onclick=function(){ jmalsul2.style='width:100%;';jmals_hm.style='left:0;width:0;';jmbkqh2.style.display='block';Parsing();};
    jmuser.onclick=function(){ jmalsul3.style='width:100%;';jmals_hm.style='left:0;width:0;';jmbkqh3.style.display='block';Parsing();};
    jmals_dy.onclick = function () { jmgals_help.style.display="block";jmgals_help.innerHTML="<span>抖音去水印<br>电脑 手机 通用<br>请在抖音视频页面使用<br>* 使用见 Tools - help</span>";};
  };
  function Parsing() {
    var uaLogo="pc"; if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) { uaLogo="mobile"; };	
    var IframeStyle = "frameborder='no' width='100%' height='100%' allowfullscreen='true' allowtransparency='true' frameborder='0' scrolling='no';";  
    var classAndIDMap	= {"pc":{"v.qq.com":"mod_player","iqiyi.com":"flashbox","youku.com":"ykPlayer","le.com":"fla_box","bilibili.com":"bilibili-player-video-wrap|player-limit-mask","mgtv.com":"mgtv-player-wrap","pptv.com":"pplive-player","sohu.com":"x-player"},"mobile":{"v.qq.com":"mod_player","iqiyi.com":"m-box","youku.com":"h5-detail-player","le.com":"playB","bilibili.com":"bilibiliPlayer|player-wrapper","mgtv.com":"video-area","pptv.com":"pp-details-video","sohu.com":"player-view"}};   
    var elements = document.getElementsByClassName("spanStyle");
    for(var j in elements){
      elements[j].onclick=function(){
        var pwmqrapi='https://api.pwmqr.com/qrcode/create/?url=';
        jmqqr.style.display=jmqrtishi.style.display='block';
        jmqqr.onclick=function(){
          jmals_qr.style='display:block;background-image:url('+pwmqrapi+api+location.href+') !important;background-color:#fff !important;background-position:center !important;background-repeat:no-repeat !important;background-size:95% !important;';
        };
        var api = this.getAttribute("url");
        for(let key in classAndIDMap[uaLogo]){
          if (document.location.href.match(key)) {
            var values = classAndIDMap[uaLogo][key].split("|");
            var labelType = "";
            var class_id = "";
            for(let value in values){
              if(document.getElementById(values[value])){
                class_id = values[value];
                labelType = "id";
                break;
              }
              if(document.getElementsByClassName(values[value]).length>0){
                class_id = values[value];
                labelType = "class";
                break;
              }
            }
            if(labelType!=""&&class_id!=""){
              var iframe = "<iframe id='iframePlayBox' src='"+api+document.location.href+"' "+IframeStyle+" ></iframe>";
              if(labelType=="id"){
                document.getElementById(class_id).innerHTML="";
                document.getElementById(class_id).innerHTML=iframe;
              } else {
                document.getElementsByClassName(class_id)[0].innerHTML="";
                if(uaLogo=="mobile"){
                  document.getElementsByClassName(class_id)[0].style.height="225px";
                }
                document.getElementsByClassName(class_id)[0].innerHTML=iframe;
              }
              return;
            }
          }
        }
      }
    }
  };
  function jmals_douyin() {
    var match = location.href.match(/share\/video\/(\d*)/);
    var id = match[1];
    fetch("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + id)
      .then((res) => res.json())
      .then((json) => {
      var info = json.item_list[0];
      var url = info.video.play_addr.url_list[0].replace("playwm", "play");
      jmals_dy.onclick = function () { window.open(url,'_self')};
    });
    jmals_ul.onclick=jmals_ul2.onclick=jmuser.onclick= function () { jmgals_help.style.display="block";jmgals_help.innerHTML="<span>这里不支持使用</span>";};
  };
function jmals_menu() {
    var jmals=document.createElement("div");
    jmals=document.body.appendChild(jmals);
    jmals.innerHTML=`<head><style type="text/css">
@media (prefers-color-scheme: dark) {
  #jmals_ckb,#jmals_xfcd,#jmgals_shezhi { background-image:url(//),linear-gradient(to top left,#3e4346,#3e4346);}
  }
@media (prefers-color-scheme: light) {
}
.jmals_cd { display:none;position:fixed;width:66px;height:49px;bottom:168px;right:0.5vmin;background:transparent !important;cursor:pointer;transition:0.25s all;z-index:10000000;border-radius:10px;}
.jmals_cd svg,.jmals_cd div { position:absolute;width:100%;height:100%;right:50%;transform:translate(50%);fill:#008000;border-radius:10px;} 
.jmals_ck { display:none;position:fixed;width:99vw;max-width:400px;//max-width:800px;height:139px;bottom:25px;right:50%;transform:translate(50%);transition:0.2s all;z-index:10000000;border-radius:10px;}
.jmals_cka { background-color:transparent !important;background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/anleshi.png),url(//https://gitee.com/Jones_Miller/als/raw/master/Pic/Slide.png) !important;background-position:center,bottom 10px right 25% !important;background-repeat:no-repeat,no-repeat !important;background-size:75px 25px,26px !important;}
.jmals_ckb { background-color:transparent;background-image:url(//),linear-gradient(to top left,#9198e5,#9198e5,#e66465,#9198e5);background-position:center,center;background-repeat:no-repeat,no-repeat;background-size:100%,100%;} 
.jmals_ck div,.jmals_ck a { font-weight:900;border-radius:10px;}
.jmals_one { position:absolute;width:0;height:110px;bottom:0px;right:0;background:transparent !important;//transition:0.1s all;}
.jmals_one div { width:50%;color:#000 !important;}  
#jmalsli,.jmals_one a,.jmals_ck a { position:relative;float:left;width:20%;max-width:80px;height:32px;margin:5px 0 0 0;color:#000 !important;font-size:13px;line-height:2.5;font-weight:900 !important;cursor:pointer;//background-color:yellow;background-image:url(//);background-position:center;background-repeat:no-repeat;background-size:30px;text-decoration:none;}
.jmals_one a,.jmals_ck a { color:transparent !important;}  
.jmals_one a:hover,.jmals_ck a:hover { background:transparent !important;color:#000 !important;fill:transparent !important;text-shadow:0 0 5px #fff,0 0 10px #fff,0 0 15px #fff,0 0 20px #00a67c,0 0 35px #00a67c,0 0 40px #00a67c,0 0 50px #00a67c,0 0 75px #00a67c !important;}
.jmals_one::-webkit-scrollbar { display:none;}  
.jmals_cd,.jmals_ck a,.jmals_ck div { -webkit-overflow-scrolling:touch;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-khtml-user-select:none;user-select:none;}
.jmals_ot { overflow:auto;scrollbar-width:none;}
.jmals_zi { font-size:12px;text-align:center;line-height:1.3;color:#666 !important;}
.jmals_gg { position:absolute;width:auto;height:auto;right:3px;top:3px;text-align:center;//background:red;}
#jmalj_jha { position:absolute;top:5px;left:15%;width:5px;height:5px;border-radius:50%;background:#000 !important;box-shadow:0 0 0 2px yellow !important;}
#jmalj_jh { position:absolute;top:5px;left:15%;width:15px;height:15px;border-radius:50%;background:transparent url(https://s1.aigei.com/src/img/png/b0/b0d7cbcbd3b948e4b7bd86382102655a.png?imageMogr2/auto-orient/thumbnail/!47x47r/gravity/Center/crop/47x47/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:FgLIsklrljxwh9lXe9SeHEqeWHA=) no-repeat center !important;background-size:100% !important;//box-shadow:0 0 0 2px yellow !important;}
.jmals_qr { display:none;width:130px;height:130px;right:50%;bottom:50%;transform:translate(50%,50%);background-color:#fff !important;background-position:center !important;background-repeat:no-repeat !important;background-size:95% !important;}
#jmgy_sh div { width:100%;margin:5px 0 0 0;}
#jmgals_help2 span { background:#000 !important;color:#f0c !important;}
#jmgals_help2 div { width:100%;text-align:left;color:yellow !important;}
  </style></head>
<body>
  
  <div class="jmals_ck jmals_ckb jmals_zi" id="jmals_xfcd" style="display:none;width:150px;height:45px;bottom:25px;border-radius:30px;';"
       onclick="jmals_ck.style.display=jmals_ckb.style.display='block';";>
    
    <div id="jmckbtools" style="display:none">
      <a id="jmNight">Night</a> <a id="jmDay">Day</a> <a id="jmqraz">扫码装</a> <a id="jmqrzs">赞赏</a> <a id="jmhelp">help</a>
    </div>
    
    <div class="jmals_cka" id="jmals_xfbk" style="whidth:100%;height:100%;border-radius:30px;"></div>
  </div>
  
  <div class="jmals_cd" id="jmals_cd">
    <svg viewBox="128 128 256 256" id="jmcd_svg">
      <path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6z"/>
      <path style="fill:#18222d;" d="M222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"/>
    </svg>
    <div style="background:url(https://greasyfork.s3.us-east-2.amazonaws.com/dbwwph48urw1x73bn5fjdhzb22sy) no-repeat center bottom;background-size:100% 25px;"></div>
    <div id="jmals_open"
         onclick="jmals_open.style.display='none';jmals_close.style.display='block';
                  jmcd_svg.style='fill:#cd7f32';jmals_ck.style.display=jmals_ckb.style.display='block';"></div>
    <div id="jmals_close" style="display:none;"
         onclick="jmals_close.style.display='none';jmals_open.style.display='block';
                  jmcd_svg.style='';jmals_ck.style.display=jmals_ckb.style.display='none';"></div>
  </div>
  
  <div class="jmals_ck jmals_ckb jmals_zi" id="jmals_ckb">
    <!--div class="jmals_one jmals_ot jmals_qr" id="jm_video" style="display:block;width:100%;height:100%;background:transparent !important;;">
    <video src="https://img.mgtv.com/assets/pcweb/download-bg-movie.mp4" autoplay="autoplay" loop="loop" muted="muted" style="width:100%;"></video>
    </div-->
  </div>
  
  <div class="jmals_ck jmals_cka jmals_zi" id="jmals_ck">
    
    <div id="jmqrtishi" class="jmals_gg" style="display:none;color:#fc0 !important;">视频正常播放后<br>再扫码看</div>
    
    <a id="jmals_zy" style="height:22px;line-height:1.8;margin:1px 0 0 0;background-image:url(https://s.aigei.com/src/img/png/d8/d8f4b77181234762a11ac519a4b1c55e.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Jq-vMa_81vzEPd1pOK_YfkRoDQE=);">
      <jh id="jmalj_jha"></jh>主页</a>
    
    <a id="jmshezhi">Tools</a>
    <a id="jmbkqh">切换</a> <a id="jmbkqh2">切换</a> <a id="jmbkqh3">切换</a> <a id="jmqqr">扫码看</a> <a id="jmchajian">扩展</a>

    <div class="jmals_one jmals_ot" id="jmalsul"> <a style="color:#666 !important;cursor:default;">本页播放</a> </div>    
    <div class="jmals_one jmals_ot" id="jmalsul2"> <a style="color:#666 !important;cursor:default;">本页播放</a> </div>   
    <div class="jmals_one jmals_ot" id="jmalsul3"> <a style="color:#666 !important;cursor:default;">本页播放</a> </div>    
    <div class="jmals_one jmals_ot" id="jmalsulbk"> <a style="color:yellow !important;cursor:default;">新页播放</a> </div>    
    <div class="jmals_one jmals_ot" id="jmalsul2bk"> <a style="color:yellow !important;cursor:default;">新页播放</a> </div>
    <div class="jmals_one jmals_ot" id="jmalsul3bk"> <a style="color:yellow !important;cursor:default;">新页播放</a> </div>
    
    <div class="jmals_one jmals_ot" style="width:100%;" id="jmals_hm">
      
      <a style="background-image:url(https://s.aigei.com/src/img/png/6b/6bcf441c80e14ce98d562c8cea5b9fcd.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:mb7hnvc78mzdH3s1RjW19ZBlejo=);background-size:40px;"
         onclick="jmals_sp.style='width:100%;';jmals_hm.style='left:0;width:0;';">视频</a>  
      <a style="background-image:url(https://s.aigei.com/src/img/png/3b/3b6a2b4fba644c1f9f0c4b043eb8cd74.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:zScAoO1IraDYqD3zaLcnCobjW3k=);background-size:40px;"
         onclick="jmals_yy.style='width:100%;';jmals_hm.style='left:0;width:0;';">影音</a>
      <a style="background-image:url(https://s.aigei.com/src/img/png/a8/a8f556b24a8641fb84614603c5826fde.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:YysxaDFd1MNwSdGXi0J0M-FpOZc=);"
         onclick="jmals_llq.style='width:100%;';jmals_hm.style='left:0;width:0;';jmchajian.style.display='block';">浏览器</a>     
      <a style="background-image:url(https://s.aigei.com/src/img/png/a6/a61143f89b484ff089c2658c020a91c6.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:BM9BnnaKNHs3RIRi5E8qTFspBRs=);background-size:28px;"
         onclick="jmals_xz.style='width:100%;';jmals_hm.style='left:0;width:0;';">脚本下载</a>
      <a style="background-image:url(https://s.aigei.com/src/img/png/a3/a309a83526984f3abcdc1ec66c39ffdc.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:5vL-oaM0hhUYMAIwqk5oTLq7ta4=);background-size:26px;"
         onclick="jmals_gy.style='width:100%;';jmals_hm.style='left:0;width:0;';"><jh id="jmalj_jh"></jh>关于</a>        
      <br><br><br>     
      <a id="jmals_ul" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/Window/anleshi.png);background-size:40px;"
         onclick="jmalsul.style='width:100%;';jmals_hm.style='left:0;width:0;';">安乐选</a>     
      <a id="jmals_ul2" style="background-image:url(https://s.aigei.com/src/img/png/a9/a94699145b4e4e6dae0c9c6550998acb.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:d81rdZTusCiStBpqJvBeSQBXjFg=);background-size:40px;"
         onclick="jmalsul2.style='width:100%;';jmals_hm.style='left:0;width:0;';">解析</a>      
      <a id="jmuser" style="display:none;background-image:url(https://s.aigei.com/src/img/png/b8/b8e545f76c3642f39d46a274434aa3c0.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:QAhRBrqqcMKGypz9v7Qf_UF7qfs=);"                            
         onclick="jmalsul3.style='width:100%;';jmals_hm.style='left:0;width:0;';">user</a>
      <a id="jmals_dy"
         style="background-image:url(https://sf1-cdn-tos.douyinstatic.com/obj/eden-cn/kpchkeh7upepld/fe_app_new/favicon_v2.ico);background-size:26px;">去水印</a>
      <a style="background-image:url(https://s1.aigei.com/src/img/png/2d/2dbfb0699d924358bb3076e5f953b526.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:3poKSCtbwKxFzw7dTnTgduj47r8=);background-size:49px;"
         onclick="jmalihb.style.display='block';">支付宝红包</a>
      <br><br><br>
      <div style="width:100%;color:#555 !important;text-align:left;">. * 所有广告与 安乐视 无关 请勿轻信广告</div>
    </div>
    
    <div class="jmals_one jmals_ot" id="jmals_sp">
      <div>安乐视 支持以下站点</div> 
      <a href="https://v.qq.com/" target="_blank" style="background-image:url(https://v.qq.com/favicon.ico);">腾讯视频</a> 
      <a href="https://www.iqiyi.com/" target="_blank" style="background-image:url(http://www.iqiyipic.com/common/fix/128-128-logo.png);background-size:28px;">爱奇艺</a>
      <a href="https://www.youku.com/" target="_blank" style="background-image:url(https://img.alicdn.com/tfs/TB1WeJ9Xrj1gK0jSZFuXXcrHpXa-195-195.png);background-size:36px;">优酷</a>
      <a href="https://www.le.com/" target="_blank" style="background-image:url(https://www.le.com/favicon.ico);background-size:36px;">乐视</a> 
      <a href="https://www.bilibili.com/" target="_blank" style="background-image:url(https://www.bilibili.com/favicon.ico?v=1);">哔哩哔哩</a>  
      <a href="https://www.mgtv.com/" target="_blank" style="background-image:url(https://www.mgtv.com/favicon.ico);background-size:26px;">芒果tv</a>
      <a href="https://www.pptv.com/" target="_blank" style="background-image:url(https://sr1.pplive.cn/mcms/nav/images/favicon.ico);background-size:25px;">PPTV</a>
      <a href="https://tv.sohu.com/" target="_blank" style="background-image:url(https://my.tv.sohu.com/favicon.ico);background-size:25px;">搜狐视频</a>
    </div>
    
    <div class="jmals_one jmals_ot" id="jmals_yy"> 
      <a href="https://www.douyin.com/discover" target="_blank" style="background-image:url(https://sf1-cdn-tos.douyinstatic.com/obj/eden-cn/kpchkeh7upepld/fe_app_new/favicon_v2.ico);">抖音</a>
      <br><br><br>
      <a href="https://www.nfmovies.com/" target="_blank" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/TVideo/nfmovies.png);background-size:55px 25px;">奈菲影视</a> 
      <a href="https://music.liuzhijin.cn/" target="_blank" style="background-image:url(https://s.aigei.com/src/img/png/fb/fb0d627c25914514b126d4f765648b05.png?imageMogr2/auto-orient/thumbnail/!127x127r/gravity/Center/crop/127x127/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:vHoCZuH1tNlIw4hKYyiqlOI9pwI=);">刘志进实验室</a>
    </div>
    
    <div class="jmals_one jmals_ot" id="jmals_llq">
      <a style="color:#000 !important;";>电脑端</a>
      <a href="https://www.google.com/chrome/" target="_blank" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/Browser/Chrome.png);">Chrome</a>
      <a href="https://www.microsoft.com/zh-cn/edge" target="_blank" style="background-image:url(https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4nqTh);background-size:40px;">Edge</a>
      <a href="https://www.mozilla.org/zh-CN/firefox/all/" target="_blank" style="background-image:url(https://www.mozilla.org/media/img/favicons/firefox/browser/favicon-196x196.59e3822720be.png);">Firefox</a>
      <a style="background-image:url(https://km.support.apple.com/kb/image.jsp?productid=PP341&size=120x120);cursor:default;">Safari</a>
      <br><br><br>    
      <a style="color:#000 !important;";>iOS</a>
      <a href="https://apps.apple.com/cn/app/id1261944766" target="_blank" style="background-image:url(https://is4-ssl.mzstatic.com/image/thumb/Purple125/v4/59/9f/c2/599fc2cf-fc9c-3cd4-73f9-ae3c8197bf5c/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/230x0w.png);">Alook</a>
      <a href="https://apps.apple.com/cn/app/id1530302877" target="_blank" style="background-image:url(https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/51/00/24/510024d4-a6da-eb6f-38b1-2f7735944378/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.jpeg/230x0w.jpg);">Viax</a> 
      <br><br><br>
      <a style="color:#000 !important;";>Android</a>
      <a href="https://www.coolapk.com/apk/alook.browser" target="_blank" style="background-image:url(http://file.market.xiaomi.com/thumbnail/PNG/l114/AppStore/0054941aba125b3e939eaf6aa09b394dfbd4056b6);">Alook</a>
      <a href="https://www.coolapk.com/apk/mark.via" target="_blank" style="background-image:url(http://file.market.xiaomi.com/thumbnail/PNG/l114/AppStore/099cb4aa46da9be38967761d8519f0c3217435a50);">Via</a> 
      <a href="http://b.mixiaba.com/" target="_blank" style="background-image:url(http://file.market.xiaomi.com/thumbnail/PNG/l114/AppStore/0b2e5582768cf538aea853cf4bda64d98dd434b44);">米侠</a>
      <br><br><br>
      <div style="width:100%;text-align:left;">. * 1. 包含 但不限于以上浏览器<br>. * 2. Safari 为macOS内置浏览器 在安乐视页面 点击安装此脚本可能无效 请手动全选复制 然后新建js</div>
      <br>
    </div>
    
    <div class="jmals_one jmals_ot" id="jmals_xz">
      <a href="https://greasyfork.org/zh-CN/scripts/430384-%E5%AE%89%E4%B9%90%E8%A7%86" target="_blank" style="color:#000 !important;";>安乐视</a>
      <a href="https://greasyfork.org/zh-CN/scripts/412041-%E5%AE%89%E4%B9%90%E6%BB%9A" target="_blank" style="color:#000 !important;";>安乐滚</a>     
      <a href="https://greasyfork.org/zh-CN/scripts/423419-%E5%AE%89%E4%B9%90%E4%BC%A0" target="_blank" style="color:#000 !important;";>安乐传</a>      
      <a href="https://greasyfork.org/zh-CN/scripts/428174-%E5%AE%89%E4%B9%90%E7%A0%81" target="_blank" style="color:#000 !important;";>安乐码</a>        
    </div>
    
    <div class="jmals_one jmals_ot" id="jmals_chajian">
      <div>电脑端 包含 但不限于以下扩展</div>
      <a style="color:#000 !important;";>Chrome</a> 
      <a href="https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo" target="_blank" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)">Tampermonkey</a>
      <a href="https://chrome.google.com/webstore/detail/jinjaccalgkegednnccohejagnlnfdag" target="_blank" style="background-image:url(https://violentmonkey.github.io/static/vm-6437e4e5a400c6eff1c23ead4d549b0a.png)">Violentmonkey</a>
      <br><br><br>
      <a style="color:#000 !important;";>Edge</a>
      <a href="https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd" target="_blank" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)">Tampermonkey</a>
      <a href="https://microsoftedge.microsoft.com/addons/detail/eeagobfjdenkkddmbclomhiblgggliao" target="_blank" style="background-image:url(https://violentmonkey.github.io/static/vm-6437e4e5a400c6eff1c23ead4d549b0a.png)">Violentmonkey</a> 
      <br><br><br>
      <a style="color:#000 !important;";>FireFox</a>
      <a href="https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/" target="_blank" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)">Tampermonkey</a>
      <a href="https://addons.mozilla.org/zh-CN/firefox/addon/violentmonkey/" target="_blank" style="background-image:url(https://violentmonkey.github.io/static/vm-6437e4e5a400c6eff1c23ead4d549b0a.png)">Violentmonkey</a>
      <a href="https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/" target="_blank" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/greasemonkey.png)">Greasemonkey</a> 
      <br><br><br>
      <a style="color:#000 !important;";>Safari</a>
      <a href="https://apps.apple.com/cn/app/id1482490089" target="_blank" style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)">Tampermonkey</a>
      <a href="https://apps.apple.com/cn/app/id1463298887" target="_blank" style="background-image:url(https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/d9/82/ad/d982ad5b-b276-b5e1-07a8-059ca3e858dd/AppIcon-0-0-85-220-0-0-0-0-4-0-0-0-2x-sRGB-0-0-0-0-0.png/230x0w.png)">Userscripts</a>
      <br><br><br>
    </div>
    
    <div class="jmals_one jmals_ot" id="jmals_gy">
      <a href="https://t.me/jsday" target="_blank" style="background-image:url(https://s.aigei.com/src/img/png/03/036f5bd2358b41b9b4968a20857517a1.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:SUTiee43YRGapx4vgj8eImkjKAw=);">TG群组</a>      
      <a href="https://greasyfork.org/zh-CN/scripts/430384-%E5%AE%89%E4%B9%90%E8%A7%86/feedback" target="_blank" style="background-image:url(https://s.aigei.com/src/img/png/a8/a8e3d64fbfb741098cb636a5043186c4.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:KwsashQOUZVicoA8xOB-dfVFiTY=);">反馈</a>      
      <a href="https://gitee.com/Jones_Miller/als/raw/master/README.md" target="_blank" style="background-image:url(https://s.aigei.com/src/img/png/a5/a5d75922b51c4316a8abef08a16164dd.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:SfL2Qh_pW4BSaETEioQgbw3XyCQ=);">更新日志</a>
      <a id="jmals_bdup" style="background-color:yellow !important;background-image:url(https://s1.aigei.com/src/img/png/b0/b0d7cbcbd3b948e4b7bd86382102655a.png?imageMogr2/auto-orient/thumbnail/!47x47r/gravity/Center/crop/47x47/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:FgLIsklrljxwh9lXe9SeHEqeWHA=);background-size:20px;color:#000 !important;" onclick="jm_update.style.display='block';">脚本更新</a>
      <br><br><br>
      <div id="jmgy_sh" style="position:absolute;width:100%;">
        <div style="position:absolute;top:0px;width:50%;left:0px;">
          <div id="jmver_bd">本地当前 更新脚本后显示</div> <div id="jmver_bdnew" style="color:yellow !important;font-size:13px;">本地最新 Ver 21.12.12</div>
          <div style="color:#0ff !important;">远程 永久最新 Ver 21.12.12</div> <div>* 本地版 好比客户端，远程版 就是打开它后看到的内容</div>
        </div>
        <div style="position:absolute;top:0px;width:50%;right:0px;">
          <div>非专业人士 所有数据收集于互联网</div> <div>感谢原作者 如有侵权 联系删除</div> <div>感谢：飝 飝 、JW 提供接口</div>
        </div>
      </div>
    </div>
    
    <div class="jmals_one jmals_ot jmals_qr" id="jmgals_help" style="width:191px;height:auto;min-height:50px;max-height:100px;background:#666 !important;color:yellow !important;font-size:13px;line-height:1.8;" onclick="this.style.display='none';"></div>
    <div class="jmals_one jmals_ot jmals_qr" id="jmgals_help2" style="//display:block;width:100%;height:100%;//170px;//bottom:85px;background:#666 !important;font-size:13px;line-height:1.8;">
      <div style="position:absolute;width:46px;height:22px;top:5px;left:5px;text-align:center;background:red !important;color:#fff !important;" onclick="jmgals_help2.style.display='none';">关闭</div>
      <br>
      <span>user接口:</span><br><div>. 根据脚本内要求 开启/关闭 并填入接口</div>
      <br>
      <span>抖音去水印使用:</span><br><div>* 手机端:<br>. iOS 抖音 分享 更多分享 在Alook中打开<br>. Android 抖音 分享 复制链接 Alook粘贴 删除多余字符<br>* 电脑端: <br>. 抖音视频页面 更改UA为iPhone或Android后刷新页面<br>. 在推荐等页面不支持使用</div>
      <span>常见问题:</span><br><div>* 不加载安乐视图标、不弹出菜单、点击解析没反应:<br>. 刷新网页 或 重启浏览器<br>* 解析失败、出错、清晰度问题：<br>. 刷新页面 或 更换接口</div>
      <br>
      <span>暂无更多...</span>
    <br><br>
    </div>
    <div class="jmals_ck jmals_ckb jmals_zi" id="jmgals_shezhi" style="display:none;width:186px;height:28px;bottom:141px;">
      <a id="jmNight2">Night</a> <a id="jmDay2">Day</a> <a id="jmqraz2">扫码装</a> <a id="jmqrzs2">赞赏</a> <a id="jmhelp2">help</a>
    </div>
    <div class="jmals_one jmals_ot jmals_qr" id="jmals_qr" onclick="this.style.display='none';"></div>
    <!--div class="jmals_one jmals_ot jmals_qr" id="jmgoodnight" style="width:100%;height:100%;background:#121 url(https://s1.aigei.com/src/img/png/2f/2fc70fa51519492e80dd883f5b7c03ab.png?imageMogr2/auto-orient/thumbnail/!237x218r/gravity/Center/crop/237x218/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:1vw7cG0q9738OraYWfzLll07VDI=) no-repeat center !important;background-size:118.5px 109px !important;color:#456 !important;font-size:20px;line-height:1.8;" onclick="this.style.display='none';">夜深了 洗洗睡吧<br><br><br><span style="color:#345 !important;font-size:12px;">点击此窗口任意位置关闭</span></div>
    
    <!--div class="jmals_one jmals_ot jmals_qr"
         style="display:block;width:100%;height:100%;
                background:#121 url(//) no-repeat center !important;
                background-size:100% 100% !important;color:#456 !important;font-size:20px;line-height:1.8;" 
         onclick="this.style.display='none';">
      <br><br><br>
      <span style="color:#345 !important;font-size:12px;">点击此窗口任意位置关闭</span>
    </div-->
    
    <div class="jmals_one jmals_ot jmals_qr" id="jm_update" style="display:block;width:98%;height:95%;background:#121 url(//) no-repeat center !important;background-size:118.5px 109px !important;opacity:0.8;color:#fff !important;line-height:1.8;">
      <div style="width:100%;color:#fff !important;">本地脚本有更新 v21.12.12</div>
      <a href="https://gitee.com/Jones_Miller/als/raw/master/README.md" target="_blank" style="position:absolute;width:80px;bottom:50px;left:15px;color:yellow !important;">更新日志</a>
      <a href="https://greasyfork.org/zh-CN/scripts/430384-%E5%AE%89%E4%B9%90%E8%A7%86" target="_blank" style="position:absolute;width:80px;bottom:5px;left:15px;background-color:yellow !important;background-image:url(https://s1.aigei.com/src/img/png/b0/b0d7cbcbd3b948e4b7bd86382102655a.png?imageMogr2/auto-orient/thumbnail/!47x47r/gravity/Center/crop/47x47/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:FgLIsklrljxwh9lXe9SeHEqeWHA=);background-size:20px;font-size:13px;color:#000 !important;";>点击更新</a>
      <div style="position:absolute;width:46px;height:22px;bottom:10px;right:20px;background:red !important;color:#fff !important;" onclick="jm_update.style.display='none';">忽略</div>
    </div>
    
    <div class="jmals_one jmals_ot jmals_qr" id="jmalihb"
         style="width:238.2px;height:345.6px;bottom:180px;background:red url(https://gitee.com/Jones_Miller/als/raw/master/Pic/141634350685_.pic_hd.jpg) no-repeat center !important;background-size:100% !important;"
         onclick="this.style.display='none';"><span style="color:#345 !important;font-size:12px;">点击此窗口任意位置关闭</span></div>
    
  </div>

</body>`;
  
  jmals_zy.onclick = function () {
    if (jmals_hm.style.width == "100%") { 
      jmals_xfbk.style.display='block';
      jmals_xfcd.style.width='150px';
      jmals_xfcd.style.height='45px';
      jmals_xfcd.style.borderRadius='30px';
      jmals_ck.style.display=jmals_ckb.style.display='none';
      jmckbtools.style.display='none';
    } else {
      jmals_hm.style='width:100%;';
      jmalsul.style=jmalsul2.style=jmalsul3.style='left:0;width:0;';
      jmalsulbk.style=jmalsul2bk.style=jmalsul3bk.style='left:0;width:0;';
      jmals_sp.style=jmals_yy.style=jmals_llq.style=jmals_xz.style=jmals_gy.style='left:0;width:0;';        
      jmals_chajian.style='left:0;width:0;';
      jmals_qr.style.display='none';
      jmqqr.style.display=jmqrtishi.style.display='none';
      jmbkqh.style.display=jmbkqh2.style.display=jmbkqh3.style.display='none';
      jmchajian.style.display='none';
      jmshezhi.style.display='block';
    }
  };

  var jmalsxcd='display:none;width:46px;height:22px;background-size:22px;line-height:1.8;margin:1px 0 0 0;';
  function jmqqrgg() { jmqqr.style.display=jmqrtishi.style.display='none';};
  function jmals_darkmode() { jmNight.style.display=jmNight2.style.display='none';jmDay.style.display=jmDay2.style.display='block';jmals_ckb.style.backgroundImage=jmals_xfcd.style.backgroundImage=jmgals_shezhi.style.backgroundImage='url(//),linear-gradient(to top left,#3e4346,#3e4346)';}
  window.onload = function() { var now = new Date(); var hour = now.getHours(); if( hour >= 7 && hour < 18) {} else { jmals_darkmode();}; if( hour >= 5 && hour < 22) {} else { jmgoodnight.style.display='block';};};
  jmshezhi.style=jmalsxcd+'display:block;background-image:url(https://s1.aigei.com/src/img/png/0b/0b99612f09934162a7d21a90877e19f1.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:kkrd0XZBJu1pMZfQPS-D55Kt5K4=);background-size:18px;';
  jmNight.style=jmNight2.style=jmalsxcd+'display:block;background-image:url(https://s.aigei.com/src/img/png/83/83dd9c007fae4ead97166c1333620185.png?imageMogr2/auto-orient/thumbnail/!75x75r/gravity/Center/crop/75x75/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:ZQwigfpYJJsxf6OGM24ccVFO39c=)';
  jmDay.style=jmDay2.style=jmalsxcd+'background-image:url(https://s.aigei.com/src/img/png/c7/c74268617b1c4701854815268908fb43.png?imageMogr2/auto-orient/thumbnail/!201x201r/gravity/Center/crop/201x201/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Kx002ZMnB39hIgbzLjxsCW-v89A=)';
  jmqraz.style=jmqraz2.style=jmalsxcd+'display:block;background-image:url(https://s.aigei.com/src/img/png/23/23adca139a5c43c3809ab161f7f0453d.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:z0u2BGZ4KZ3Lx5wegbSaidmXLTQ=)';
  jmqrzs.style=jmqrzs2.style=jmalsxcd+'display:block;background-image:url(https://s1.aigei.com/src/img/png/2c/2cf33a978e7d4b1d858b3157d8b80461.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:7hpftpgvasbuAqQ2vzwTE4nkOQM=)';
  jmbkqh.style=jmbkqh2.style=jmbkqh3.style=jmalsxcd+'background-image:url(https://s1.aigei.com/src/img/png/b8/b89bd081f4a046ddae387713ea557ec4.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Lvz1H0WFiBrEry44ha7BioRVuWU=)';
  jmqqr.style=jmalsxcd+'background-color:#fc0 !important;background-image:url(https://s1.aigei.com/src/img/png/7d/7d3ba135a9094da49930e8590d398d27.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:C42thzKg5H92vM21SQqnGY4JQMU=)';
  jmhelp.style=jmhelp2.style=jmalsxcd+'display:block;background-image:url(https://s1.aigei.com/src/img/png/c5/c50eba4d60164c6da14e13afc7bd96ae.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:4IT7l3n3Qevh-Z_RGmpDopi2PBw=)';    
  jmchajian.style=jmalsxcd+'background-image:url(https://s1.aigei.com/src/img/png/b7/b74d65cb080f459d91bd760ad61817af.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:DYm1KPlUWuNBKmk5FIEASwMpw0o=)';
  jmNight.onclick=jmNight2.onclick =  function () { jmNight.style.display=jmNight2.style.display='none';jmDay.style.display=jmDay2.style.display='block';jmals_darkmode();};
  jmDay.onclick=jmDay2.onclick = function () { jmDay.style.display=jmDay2.style.display='none'; jmNight.style.display=jmNight2.style.display='block';jmals_ckb.style.backgroundImage=jmals_xfcd.style.backgroundImage=jmgals_shezhi.style.backgroundImage='';};
  jmqraz.onclick=jmqraz2.onclick = function () { jmals_qr.style='display:block;background-image:url(https://api.pwmqr.com/qrcode/create/?url=https://greasyfork.org/zh-CN/scripts/429612) !important;background-color:#fff !important;background-position:center !important;background-repeat:no-repeat !important;background-size:95% !important;';};
  jmqrzs.onclick=jmqrzs2.onclick = function () { jmals_qr.style='display:block;background-image:url(https://greasyfork.s3.us-east-2.amazonaws.com/ey2zdayg615s8vjq7p6ptuotfav2) !important;background-color:#fff !important;background-position:center !important;background-repeat:no-repeat !important;background-size:95% !important;';};
    jmbkqh.onclick = function () {
      if (jmalsul.style.width == "100%") {
        jmalsulbk.style='width:100%;transition:0s all;';jmalsul.style='left:0;width:0;transition:0s all;';jmqqrgg();
      } else {
        jmalsul.style='width:100%;transition:0s all;';jmalsulbk.style='left:0;width:0;transition:0s all;';
      }
    };    
    jmbkqh2.onclick = function () {
      if (jmalsul2.style.width == "100%") {
        jmalsul2bk.style='width:100%;transition:0s all;';jmalsul2.style='left:0;width:0;transition:0s all;';jmqqrgg();
      } else {
        jmalsul2.style='width:100%;transition:0s all;';jmalsul2bk.style='left:0;width:0;transition:0s all;';
      }
    };
    jmbkqh3.onclick = function () {
      if (jmalsul3.style.width == "100%") {
        jmalsul3bk.style='width:100%;transition:0s all;';jmalsul3.style='left:0;width:0;transition:0s all;';jmqqrgg();
      } else {
        jmalsul3.style='width:100%;transition:0s all;';jmalsul3bk.style='left:0;width:0;transition:0s all;';
      }
    };
  jmhelp.onclick = jmhelp2.onclick = function () { jmgals_help2.style.display="block";};
  jmchajian.onclick = function () { jmchajian.style.display="none";jmals_chajian.style='width:100%;';jmals_llq.style='left:0;width:0;';};
  
  /*window.onload = function () {
    var s = document.cookie;
    if (s.indexOf('jmuptz=1') != -1) return;
    var d = new Date();
    d.setHours(d.getHours() + 168);
    document.cookie = 'jmuptz=1;expires='+d.toGMTString();
    jm_update.style.display='block';
  }*/
  
}; 
  
  function jmtoolsinmobile() {
    jmals_xfcd.style.display="block";
    jmals_xfcd.onclick = function () {
      if(jmals_xfcd.style.width == "150px") {
    this.style.width='99vw';this.style.height='139px';this.style.borderRadius='10px';
    jmals_xfbk.style.display='none';
    jmals_ck.style.display='block';
        //if (/Android/i.test(navigator.userAgent)) { jmals_ckb.style.display='block';/*jmals_hm.style.width='0px';*/}
      } else {} };
    jmshezhi.onclick = function () {
    if (jmckbtools.style.display == "none") {
      jmals_xfcd.style.height='170px';
      jmckbtools.style.display='block';
    } else {
      jmals_xfcd.style.height='139px';
      jmckbtools.style.display='none';
    }
  } 
  };
  function jmtoolsinpc() {
    /*jmals_hm.style.width='0px';*/
    jmals_ck.style.right=jmals_ckb.style.right='0.5vmin';
    jmals_ck.style.transform=jmals_ckb.style.transform='translate(0%)';
    jmals_cd.style.display="block";
    jmshezhi.onclick = function () {
    if (jmgals_shezhi.style.display == "none") {
      jmgals_shezhi.style.display='block';
    } else {
      jmgals_shezhi.style.display='none';
    }
  }
  };
  function jmdouyinpc() {
    jmals_dy.onclick = function() {
      jmgals_help.style.display="block";
      jmgals_help.innerHTML="<span>若要使用 抖音去水印<br>请更改UA为<br>iPhone 或 Android<br>然后刷新页面<br>再次点击 安乐视 即可</span>"};
    jmals_ul.onclick=jmals_ul2.onclick=jmuser.onclick = function () {
      jmgals_help.style.display="block";
      jmgals_help.innerHTML="<span>这里不支持使用</span>";
    }
  };
  
  if (location.href.match(jmuapc+'|^https://v.qq.com/favicon.ico|'+jmuamobile)) {
    jmals_menu(); createSelect(apis);
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      jmtoolsinmobile();
    } else {
      jmtoolsinpc();
    }
  };
  if (location.href.match(jmuady)) { 
    jmals_menu(); jmals_douyin(); jmtoolsinmobile();
  };
  if (location.href.match('^https://www.douyin.com/video/')) {
    jmals_menu(); jmtoolsinpc(); jmdouyinpc();
  };
  
})();