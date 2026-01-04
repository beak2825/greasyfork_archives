// ==UserScript==
// @name         Anls.library
// @author       Jones Miller
// @version      1.0.0
// @namespace    https://t.me/jsday
// @description  .anleshilibrary. No ads, no login. Analyze VIP video, advanced on-demand. Multi-interface free choice, some interfaces support high-definition playback. It is not guaranteed to parse all videos. Mobile phone scan code playback, Douyin to remove watermark. Non-professionals All data is collected on the Internet-thanks to the original author for deleting if there is any infringement.
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/odzn6d9sltx0utpy7dmb2hnz5mek
// @include      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440578/Anlslibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/440578/Anlslibrary.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  var apis=[
    {name:"973973",url: "https://jx.973973.xyz/?url="}, {name:"ap2p",url: "https://jx.ap2p.cn/?url="}, {name:"h8jx",url: "https://www.h8jx.com/jiexi.php?url="}, {name:"jiexi",url: "https://api.jiexi.la/?url="}, {name:"m1907",url: "https://z1.m1907.cn/?jx="}, {name:"nxflv",url: "https://www.nxflv.com/?url="}, {name:"okjx",url: "https://okjx.cc/?url="}, {name:"parwix",url: "https://vip.parwix.com:4433/player/?url="}, {name:"youyitv",url: "https://jx.youyitv.com/?url="}
  ];
  var apis2=[
    {"name":"纯净解析","url":"https://z1.m1907.cn/?jx="},{"name":"高速接口1","url":"https://jsap.attakids.com/?url="},{"name":"B站解析1","url":"https://vip.parwix.com:4433/player/?url="},{"name":"B站解析2","url":"https://www.cuan.la/m3u8.php?url="},{"name":"虾米","url":"https://jx.xmflv.com/?url="},{"name":"Ckplayer","url":"https://www.ckplayer.vip/jiexi/?url="},{"name":"BL","url":"https://vip.bljiex.com/?v="},{"name":"乐多资源","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},{"name":"ccyjjd","url":"https://ckmov.ccyjjd.com/ckmov/?url="},{"name":"M3U8","url":"https://jx.m3u8.tv/jiexi/?url="},{"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},{"name":"Mao解析","url":"https://qd.hxys.tv/m3u8.php?url="},{"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url="},{"name":"SSAMAO","url":"https://www.ssamao.com/jx/?url="},{"name":"无极","url":"https://da.wujiys.com/?url="},{"name":"618G","url":"https://jx.618g.com/?url="},{"name":"ckmov","url":"https://www.ckmov.vip/api.php?url="},{"name":"迪奥","url":"https://123.1dior.cn/?url="},{"name":"福星","url":"https://jx.popo520.cn/jiexi/?url="},{"name":"RDHK","url":"https://jx.rdhk.net/?v="},{"name":"H8","url":"https://www.h8jx.com/jiexi.php?url="},{"name":"解析la","url":"https://api.jiexi.la/?url="},{"name":"久播","url":"https://jx.jiubojx.com/vip.php?url="},{"name":"九八","url":"https://jx.youyitv.com/?url="},{"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},{"name":"乐喵","url":"https://jx.hao-zsj.cn/vip/?url="},{"name":"MUTV","url":"https://jiexi.janan.net/jiexi/?url="},{"name":"明日","url":"https://jx.yingxiangbao.cn/vip.php?url="},{"name":"磨菇","url":"https://jx.wzslw.cn/?url="},{"name":"OK","url":"https://okjx.cc/?url="},{"name":"维多","url":"https://jx.ivito.cn/?url="},{"name":"小蒋","url":"https://www.kpezp.cn/jlexi.php?url="},{"name":"小狼","url":"https://jx.yaohuaxuan.com/?url="},{"name":"智能","url":"https://vip.kurumit3.top/?v="},{"name":"星驰","url":"https://vip.cjys.top/?url="},{"name":"星空","url":"http://60jx.com/?url="},{"name":"月亮","url":"https://api.yueliangjx.com/?url="},{"name":"0523","url":"https://go.yh0523.cn/y.cy?url="},{"name":"云端","url":"https://jx.ergan.top/?url="},{"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url="},{"name":"66","url":"https://api.3jx.top/vip/?url="},{"name":"116","url":"https://jx.116kan.com/?url="},{"name":"200","url":"https://vip.66parse.club/?url="},{"name":"云析","url":"https://jx.yparse.com/index.php?url="},{"name":"8090","url":"https://www.8090g.cn/?url="}
  ];
  var uaLogo="pc"; if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) { uaLogo="mobile";};
  var jmuapc="^https://v.qq.com/x/cover|^https://www.iqiyi.com/v_|^https://v.youku.com/v_show|^http(s)?://www.le.com/ptv/vplay|^https://www.bilibili.com/bangumi/play|^https://www.mgtv.com/b|^http(s)?://v.pptv.com/show/|^https://tv.sohu.com/v";
  var jmuamobile="^https://m.iqiyi.com/v_|^https://m.youku.com/alipay_video|^https://m.youku.com/video/id|^http(s)?://m.le.com/vplay_|^https://m.bilibili.com/bangumi/play|^https://m.mgtv.com/b|^http(s)?://m.pptv.com/show/|^https://m.tv.sohu.com/v"; 
  var jmuamvqq="^http(s)?://m.v.qq.com";
  var jmuady="^https://www.iesdouyin.com/share/video/|^https://www.douyin.com/share/video/|^https://www.douyin.com/video/";
  var jmuaytb="^https://www.youtube.com/|^https://m.youtube.com/";
  function createSelect(apis) {
    for (var i=0; i < apis.length; i++) {
      var jmanlsapis=document.createElement("div");
      jmanlsapis.id="jmanlsapis";
      jmanlsapis.innerHTML="<span class='spanStyle' style='"+jmanlsapis+"' url='"+apis[i].url+"'>"+apis[i].name+"</span>";
      jmhm6.appendChild(jmanlsapis);
    };    
    for (var i=0; i < apis.length; i++) {
      var jmanlsapis=document.createElement("div");
      jmanlsapis.id="jmanlsapis";
      (function (jm) {
        jmanlsapis.onclick = function () {
          window.open(apis[jm].url + location.href, '_blank');
        };
      })(i);
      jmanlsapis.innerHTML=apis[i].name;
      jmhm6s.appendChild(jmanlsapis);
    };  
    for (var i=0; i < apis2.length; i++) {
      var jmanlsapis=document.createElement("div");
      jmanlsapis.id="jmanlsapis";
      jmanlsapis.innerHTML="<span class='spanStyle' style='"+jmanlsapis+"' url='"+apis2[i].url+"'>"+apis2[i].name+"</span>";
      jmhm7.appendChild(jmanlsapis);
    };
    for (var i=0; i < apis2.length; i++) {
      var jmanlsapis=document.createElement("div");
      jmanlsapis.id="jmanlsapis";
      (function (jm) {
        jmanlsapis.onclick = function () {
          window.open(apis2[jm].url + location.href, '_blank');
        };
      })(i);
      jmanlsapis.innerHTML=apis2[i].name;
      jmhm7s.appendChild(jmanlsapis);
    };
    function jmhm678 () {
      jmhome.style.display='none'; jmbenye.style.display='block'; Parsing();
    };
    jmh6.onclick=function(){ jmhm6.style.display=jmqh1.style.display='block'; jmhm678 ();};
    jmh7.onclick=function(){ jmhm7.style.display=jmqh2.style.display='block'; jmhm678 ();};
    jmuser.onclick=function(){ jmforuser.style.display=jmqh3.style.display='block'; jmhm678 ();};  
  };
  function Parsing() {	
    var IframeStyle = "frameborder='no' width='100%' height='100%' allowfullscreen='true' allowtransparency='true' frameborder='0' scrolling='no';";  
    var classAndIDMap	= {"pc":{"v.qq.com":"mod_player","iqiyi.com":"flashbox","youku.com":"ykPlayer","le.com":"fla_box","bilibili.com":"bilibili-player-video-wrap|player-limit-mask","mgtv.com":"mgtv-player-wrap","pptv.com":"pplive-player","sohu.com":"x-player"},"mobile":{"v.qq.com":"mod_player","iqiyi.com":"m-box","youku.com":"h5-detail-player","le.com":"playB","bilibili.com":"bilibiliPlayer|player-wrapper","mgtv.com":"video-area","pptv.com":"pp-details-video","sohu.com":"player-view"}};   
    var elements = document.getElementsByClassName("spanStyle");
    for(var j in elements){
      elements[j].onclick=function(){
        var pwmqrapi='https://api.pwmqr.com/qrcode/create/?url=';
        jmqrlook.style.display=jmqrlooktx.style.display='block';jmbenye.style.display='none';
        jmqrlook.onclick=function(){
          jmqrcode.style='display:block;background-image:url('+pwmqrapi+api+location.href+') !important; background-color:#fff !important; background-position:center !important; background-repeat:no-repeat !important; background-size:95% !important;';
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
  function jmanls_menu() {
    var jmanls=document.createElement('div');
    jmanls=document.body.appendChild(jmanls);
    jmanls.innerHTML=`
<style type="text/css">
    .jmanls_win { position:fixed; display:none; width:150px; height:45px; bottom:25px; right:50%; transform:translate(50%); //background-color:#999; transition:0.3s all; z-index:10000000; font-size:12px; text-align:center; font-weight:600; color:#000; border-radius:10px;}
    .jmanls_winbk { background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/anleshi.png),linear-gradient(to top left,#9198e5,#9198e5,#e66465,#9198e5); background-position:center,center;background-repeat:no-repeat,no-repeat;background-size:80px,100%;}
    .jmanls_win div { display:none; position:absolute; width:100%; background-color:none;//#777; border-radius:10px;}
    .jmanls_menu { height:19%; top:0px; line-height:2.5;}
    .jmanls_menu div { position:relative; float:left; width:15%; height:100%; background-color:none;//#666; background-size:40%; background-image:url(//https://greasyfork.s3.us-east-2.amazonaws.com/odzn6d9sltx0utpy7dmb2hnz5mek); background-position:center; background-repeat:no-repeat; color:transparent !important;}
    .jmanls_menu div:hover { font-size:15px; line-height:2; color:#000 !important; text-shadow:0 0 5px #fff,0 0 10px #fff,0 0 15px #fff,0 0 20px #00a67c,0 0 35px #00a67c,0 0 40px #00a67c,0 0 50px #00a67c,0 0 75px #00a67c;}
    .jmanls_home { height:80%; bottom:0px; scrollbar-width:none;}
    .jmanls_home::-webkit-scrollbar { display:none;} 
    #jmanlsapis,.jmanls_home div,.jmanls_home a { position:relative; float:left; display:block; width:20%; height:25%; background-color:none;//#555; background-size:36%; background-image:url(https://greasyfork.s3.us-east-2.amazonaws.com/odzn6d9sltx0utpy7dmb2hnz5mek); background-position:center; background-repeat:no-repeat; margin:0 0 20px 0; color:#000; line-height:6.5; border-radius:10px; text-decoration:none;}
    #jmanlsapis { background-image:url(//); margin:0 0 5px 0; line-height:2.5;}
    .jmanls_home div:hover,.jmanls_home a:hover { text-shadow:0 0 5px #fff,0 0 10px #fff,0 0 15px #fff,0 0 20px #00a67c,0 0 35px #00a67c,0 0 40px #00a67c,0 0 50px #00a67c,0 0 75px #00a67c;}
    .jmanls_home spans { position:absolute; left:5px; top:85%; background-color:#888; color:#000; text-align:left; border-radius:5px;}
    #jmupdate,#jmhelp,#jmabout,#jmshuo,#jmanls_night { display:none; width:99%; height:98%; right:50%; transform:translate(50%); bottom:1%; background-color:#000; color:yellow;}
    #jmupdate div,#jmhelp div,#jmabout div,#jmshuo div,#jmanls_night div { width:46px; height:22px; top:5px; left:5px; background:red !important; margin:0 10px 0 0; color:#fff !important; line-height:2; text-shadow:none;}
    #jmupdate a { height:20%; background-size:32%; color:#fff !important;}
    #jmhelp span,#jmabout span,#jmshuo span { color:#fff;font-size:13px;}
    #jmbrowser1,#jmbrowser2,#jmbrowser3,#jmextensions1,#jmextensions2,#jmextensions3,#jmextensions4 { display:none; text-shadow:none; width:100%; height:40%;}
    #jmbrowser1 a,#jmbrowser2 a,#jmbrowser3 a,#jmextensions1 a,#jmextensions2 a,#jmextensions3 a,#jmextensions4 a { height:60%; //background-color:#999; margin:0 5% 0 0;}
    #jmqrcode { width:140px; height:140px; bottom:5px; right:50%; transform:translate(50%);}
    #jmqh1,#jmqh2,#jmqh3 { background-image:url(https://s1.aigei.com/src/img/png/b8/b89bd081f4a046ddae387713ea557ec4.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Lvz1H0WFiBrEry44ha7BioRVuWU=);}
    #jmup1,#jmup2 { position:absolute; top:-5px; right:15%; width:16px; height:16px; border-radius:50%; background:red !important; color:#fff !important; text-align:center; line-height:1.4;}
    .ot { overflow:auto;}
    #jmopen div { width:110%; height:110%; right:50%; bottom:50%; transform:translate(50%,50%); background-size:100%; background-position:center; background-repeat:no-repeat;}
    #jmopen span { position:absolute; right:50%; top:50%; transform:translate(50%,-50%); color:#000 !important; font-size:16px; text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 40px #ff00de, 0 0 70px #ff00de; white-space:nowrap;}
</style>
  <div id="jmwin" class="jmanls_win jmanls_winbk">
    <div id="jmmenu" class="jmanls_menu">
      <div id="jmback" style="display:block;background-size:50%;background-image:url(https://s.aigei.com/src/img/png/d8/d8f4b77181234762a11ac519a4b1c55e.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Jq-vMa_81vzEPd1pOK_YfkRoDQE=);">主页</div>
      <div id="jmext" style="background-size:32%;background-image:url(https://s1.chu0.com/src/img/png/1d/1de7674ccd2d4e1fbe3538805422483e.png?imageMogr2/auto-orient/thumbnail/!47x47r/gravity/Center/crop/47x47/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:uXnnnXIzNFw_qR8DToGfmxbJq0Y=);" onclick="this.style.display=jmhm2.style.display='none';jmhmext.style.display='block';">扩展</div>
      <div id="jmzs" style="background-image:url(https://s1.aigei.com/src/img/png/2c/2cf33a978e7d4b1d858b3157d8b80461.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:7hpftpgvasbuAqQ2vzwTE4nkOQM=);">赞赏</div>
      <div id="jmqr" style="background-image:url(https://s.aigei.com/src/img/png/23/23adca139a5c43c3809ab161f7f0453d.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:z0u2BGZ4KZ3Lx5wegbSaidmXLTQ=);">扫码装</div>
      <div id="jmqh1">切换</div> <div id="jmqh2">切换</div> <div id="jmqh3">切换</div>
      <div id="jmqrlook" style="background-color:#fc0;background-image:url(https://s1.aigei.com/src/img/png/7d/7d3ba135a9094da49930e8590d398d27.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:C42thzKg5H92vM21SQqnGY4JQMU=);">扫码看</div>
      <div id="jmhmhp" style="position:absolute;width:28.5px;right:0px;background-color:yellow;background-size:60%;background-image:url(https://s1.aigei.com/src/img/png/c5/c50eba4d60164c6da14e13afc7bd96ae.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:4IT7l3n3Qevh-Z_RGmpDopi2PBw=);" onclick="this.style.display='none';jmhelp.style.display='block';"></div>
      <span id="jmbenye" style="display:none;">当前 本页播放</span> <span id="jmxinye" style="display:none;color:yellow">当前 新页播放</span> <span id="jmqrlooktx" style="display:none;color:#fff">视频可正常播放 再扫码看</span>
    </div>
    <div id="jmhome" class="jmanls_home">
      <div style="background-size:49%;background-image:url(https://s.aigei.com/src/img/png/6b/6bcf441c80e14ce98d562c8cea5b9fcd.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:mb7hnvc78mzdH3s1RjW19ZBlejo=);" onclick="jmhome.style.display='none';jmhm1.style.display='block';">网站支持</div>
      <div style="background-image:url(https://s.aigei.com/src/img/png/a8/a8f556b24a8641fb84614603c5826fde.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:YysxaDFd1MNwSdGXi0J0M-FpOZc=);" onclick="jmhome.style.display='none';jmhm2.style.display=jmext.style.display='block';">浏览器</div>
      <div style="background-size:50%;background-image:url(https://s1.aigei.com/src/img/png/52/52f9770a55da4d6bb598093dc33362be.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Poxa0qO_7WAwFKxfcGMe0ovnW5Y=);" onclick="jmhome.style.display='none';jmhm3.style.display=jmzs.style.display='block';">福利</div>
      <div style="background-image:url(https://s.aigei.com/src/img/png/a6/a61143f89b484ff089c2658c020a91c6.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:BM9BnnaKNHs3RIRi5E8qTFspBRs=);" onclick="jmhome.style.display='none';jmhm4.style.display=jmqr.style.display='block';">脚本</div>
      <div style="background-size:32%;background-image:url(https://s1.aigei.com/src/img/png/0b/0b99612f09934162a7d21a90877e19f1.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:kkrd0XZBJu1pMZfQPS-D55Kt5K4=);" onclick="jmhome.style.display='none';jmhm5.style.display='block';"><div id="jmup1">1</div>设置</div>
      <div id="jmh6" style="display:none;background-size:49%;background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/Window/anleshi.png);">安乐选</div>
      <div id="jmh7" style="display:none;background-size:49%;background-image:url(https://s.aigei.com/src/img/png/a9/a94699145b4e4e6dae0c9c6550998acb.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:d81rdZTusCiStBpqJvBeSQBXjFg=);">解析</div>
      <div id="jmuser" style="display:none;background-image:url(https://s.aigei.com/src/img/png/b8/b8e545f76c3642f39d46a274434aa3c0.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:QAhRBrqqcMKGypz9v7Qf_UF7qfs=);">user</div>
      <div id="jmh9" style="display:none;background-size:30%;background-image:url(https://sf1-cdn-tos.douyinstatic.com/obj/eden-cn/kpchkeh7upepld/fe_app_new/favicon_v2.ico);">去水印</div>
      <div id="jmh10" style="display:none;background-size:32%;background-image:url(https://s1.chu0.com/src/img/png/1c/1c74115dcf904908b6d5d27a3a4ebb3b.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:KewhKY9ozpznMvoP4L0YAkIJl7A=);">解析</div>
      <spans>所有广告与安乐视无关 请勿轻信广告</spans>
    </div>
    <div id="jmhm1" class="jmanls_home">
      <a style="background-image:url(https://v.qq.com/favicon.ico);" href="https://v.qq.com/" target="_blank">腾讯视频</a> 
      <a style="background-image:url(http://www.iqiyipic.com/common/fix/128-128-logo.png);" href="https://www.iqiyi.com/" target="_blank">爱奇艺</a>
      <a style="background-image:url(https://img.alicdn.com/tfs/TB1WeJ9Xrj1gK0jSZFuXXcrHpXa-195-195.png);" href="https://www.youku.com/" target="_blank">优酷</a>
      <a style="background-image:url(https://www.le.com/favicon.ico);" href="https://www.le.com/" target="_blank">乐视</a> 
      <a style="background-image:url(https://www.bilibili.com/favicon.ico?v=1);" href="https://www.bilibili.com/" target="_blank">哔哩哔哩</a>  
      <a style="background-image:url(https://www.mgtv.com/favicon.ico);" href="https://www.mgtv.com/" target="_blank">芒果tv</a>
      <a style="background-image:url(https://sr1.pplive.cn/mcms/nav/images/favicon.ico)" href="https://www.pptv.com/" target="_blank">PPTV</a>
      <a style="background-image:url(https://my.tv.sohu.com/favicon.ico);" href="https://tv.sohu.com/" target="_blank">搜狐视频</a>
      <a style="background-image:url(https://sf1-cdn-tos.douyinstatic.com/obj/eden-cn/kpchkeh7upepld/fe_app_new/favicon_v2.ico);" href="https://www.douyin.com/discover" target="_blank">抖音</a>
      <a style="background-image:url(https://s1.chu0.com/src/img/png/1c/1c74115dcf904908b6d5d27a3a4ebb3b.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:KewhKY9ozpznMvoP4L0YAkIJl7A=);" href="https://www.youtube.com/" target="_blank">YouTube</a>
      <spans>安乐视支持以上站点 点击可去网站</spans>
    </div>
    <div id="jmhm2" class="jmanls_home">
      <div id="jmpc" style="background-color:yellow;background-image:url(https://s1.chu0.com/src/img/png/73/735d9904e0fa4126901d9b8ff0f9aed5.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:YPAjvJP9mDurgAApYG5agIJcRNo=);" onclick="this.style.backgroundColor='yellow';jmios.style.backgroundColor=jmand.style.backgroundColor='transparent';jmbrowser1.style.display='block';jmbrowser2.style.display=jmbrowser3.style.display='none';">电脑端</div>
      <div id="jmios" style="background-image:url(https://s1.chu0.com/src/img/png/bb/bb899a7c191e45d490f7ec834671dcf7.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:dNOOT4hGty3fL-xRAltU6jFAvbY=);" onclick="this.style.backgroundColor='yellow';jmpc.style.backgroundColor=jmand.style.backgroundColor='transparent';jmbrowser2.style.display='block';jmbrowser1.style.display=jmbrowser3.style.display='none';">ios</div>
      <div id="jmand" style="background-image:url(https://s1.chu0.com/src/img/png/14/1425b83ce14d49d89d612aa23f5a7783.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:-AKabsB8zfaS1cCfU60yPQKafdk=);" onclick="this.style.backgroundColor='yellow';jmpc.style.backgroundColor=jmios.style.backgroundColor='transparent';jmbrowser3.style.display='block';jmbrowser1.style.display=jmbrowser2.style.display='none';">Android</div>
      <span >* Safari为Apple专有<br>在ios要求ios15</span>
      <div id="jmbrowser1" style="display:block;background-image:url(//);">
        <a style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/Browser/Chrome.png);" href="https://www.google.com/chrome/" target="_blank">Chrome</a>
        <a style="background-size:46%;background-image:url(https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4nqTh);" href="https://www.microsoft.com/zh-cn/edge" target="_blank">Edge</a>
        <a style="background-image:url(https://www.mozilla.org/media/img/favicons/firefox/browser/favicon-196x196.59e3822720be.png);" href="https://www.mozilla.org/zh-CN/firefox/all/" target="_blank">Firefox</a>
        <a style="background-image:url(https://s1.chu0.com/src/img/png/8a/8af6a5cde9cb4c4e883642073bacc04a.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:2uWCiP9qFFe2E2JihLVDrCG0jIM=);cursor:default;">Safari *</a>
      </div>
      <div id="jmbrowser2" style="background-image:url(//);">
        <a style="background-image:url(https://is4-ssl.mzstatic.com/image/thumb/Purple125/v4/59/9f/c2/599fc2cf-fc9c-3cd4-73f9-ae3c8197bf5c/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/230x0w.png);" href="https://apps.apple.com/cn/app/id1261944766" target="_blank">Alook</a>
        <a style="background-image:url(https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/51/00/24/510024d4-a6da-eb6f-38b1-2f7735944378/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.jpeg/230x0w.jpg);" href="https://apps.apple.com/cn/app/id1530302877" target="_blank">Viax</a> 
        <a style="background-image:url(https://s1.chu0.com/src/img/png/8a/8af6a5cde9cb4c4e883642073bacc04a.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:2uWCiP9qFFe2E2JihLVDrCG0jIM=);cursor:default;">Safari *</a>
      </div>
      <div id="jmbrowser3" style="background-image:url(//);">
        <a style="background-image:url(http://file.market.xiaomi.com/thumbnail/PNG/l114/AppStore/0054941aba125b3e939eaf6aa09b394dfbd4056b6);" href="https://www.alookweb.com/" target="_blank">Alook</a>
        <a style="background-image:url(http://file.market.xiaomi.com/thumbnail/PNG/l114/AppStore/099cb4aa46da9be38967761d8519f0c3217435a50);" href="https://viayoo.com/zh-cn/" target="_blank">Via</a> 
        <a style="background-image:url(http://file.market.xiaomi.com/thumbnail/PNG/l114/AppStore/0b2e5582768cf538aea853cf4bda64d98dd434b44);" href="http://b.mixiaba.com/" target="_blank">米侠</a>
      </div>
      <spans>包含但不限于以上浏览器 点击可去下载</spans>
    </div>
    <div id="jmhmext" class="jmanls_home">
      <div id="jmch" style="background-color:yellow;background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/Browser/Chrome.png)" onclick="this.style.backgroundColor='yellow';jmed.style.backgroundColor=jmff.style.backgroundColor=jmsa.style.backgroundColor='transparent';jmextensions1.style.display='block';jmextensions2.style.display=jmextensions3.style.display=jmextensions4.style.display='none';">Chrome</div>
      <div id="jmed" style="background-size:46%;background-image:url(https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4nqTh)" onclick="this.style.backgroundColor='yellow';jmch.style.backgroundColor=jmff.style.backgroundColor=jmsa.style.backgroundColor='transparent';jmextensions2.style.display='block';jmextensions1.style.display=jmextensions3.style.display=jmextensions4.style.display='none';">Edge</div>
      <div id="jmff" style="background-image:url(https://www.mozilla.org/media/img/favicons/firefox/browser/favicon-196x196.59e3822720be.png)" onclick="this.style.backgroundColor='yellow';jmch.style.backgroundColor=jmed.style.backgroundColor=jmsa.style.backgroundColor='transparent';jmextensions3.style.display='block';jmextensions1.style.display=jmextensions2.style.display=jmextensions4.style.display='none';">Firefox</div>
      <div id="jmsa" style="background-image:url(https://s1.chu0.com/src/img/png/8a/8af6a5cde9cb4c4e883642073bacc04a.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:2uWCiP9qFFe2E2JihLVDrCG0jIM=)" onclick="this.style.backgroundColor='yellow';jmch.style.backgroundColor=jmed.style.backgroundColor=jmff.style.backgroundColor='transparent';jmextensions4.style.display='block';jmextensions1.style.display=jmextensions2.style.display=jmextensions3.style.display='none';">Safari</div>
      <div id="jmextensions1" style="display:block;background-image:url(//);">
        <a style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)" href="https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo" target="_blank">Tampermonkey</a>
        <a style="background-image:url(https://violentmonkey.github.io/static/vm-6437e4e5a400c6eff1c23ead4d549b0a.png)" href="https://chrome.google.com/webstore/detail/jinjaccalgkegednnccohejagnlnfdag" target="_blank">Violentmonkey</a>
      </div>
      <div id="jmextensions2" style="background-image:url(//);">
        <a style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)" href="https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd" target="_blank">Tampermonkey</a>
        <a style="background-image:url(https://violentmonkey.github.io/static/vm-6437e4e5a400c6eff1c23ead4d549b0a.png)" href="https://microsoftedge.microsoft.com/addons/detail/eeagobfjdenkkddmbclomhiblgggliao" target="_blank">Violentmonkey</a> 
      </div>
      <div id="jmextensions3" style="background-image:url(//);">
        <a style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)" href="https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/" target="_blank">Tampermonkey</a>
        <a style="background-image:url(https://violentmonkey.github.io/static/vm-6437e4e5a400c6eff1c23ead4d549b0a.png)" href="https://addons.mozilla.org/zh-CN/firefox/addon/violentmonkey/" target="_blank">Violentmonkey</a>
        <a style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/greasemonkey.png)" href="https://addons.mozilla.org/zh-CN/firefox/addon/greasemonkey/" target="_blank">Greasemonkey</a>
      </div>
      <div id="jmextensions4" style="background-image:url(//);">
        <a style="background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/other/tampermonkey.png)" href="https://apps.apple.com/cn/app/id1482490089" target="_blank">Tampermonkey</a>
        <a style="background-image:url(https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/d9/82/ad/d982ad5b-b276-b5e1-07a8-059ca3e858dd/AppIcon-0-0-85-220-0-0-0-0-4-0-0-0-2x-sRGB-0-0-0-0-0.png/230x0w.png)" href="https://apps.apple.com/cn/app/id1463298887" target="_blank">Userscripts</a>
      </div>
      <spans>常用扩展 点击进入相应浏览器扩展商店下载</spans>
    </div>
    <div id="jmhm3" class="jmanls_home">
      <div id="jmflal" style="background-image:url(https://s1.aigei.com/src/img/png/9b/9bf5203179f94a9790bd8e57a0fb8ab1.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:ieYWTeggdoMY2uhunJMIlUyc7S4=);">支付宝</div>
      <div id="jmflas" style="background-image:url(https://www.apple.com.cn/v/app-store/b/images/overview/icon_appstore__ev0z770zyxoy_large.png);">App Store</div>
      <spans>支付宝扫码 领取消费红包</spans>
    </div>
    <div id="jmhm4" class="jmanls_home">
      <a href="https://greasyfork.org/zh-CN/scripts/430384-%E5%AE%89%E4%B9%90%E8%A7%86" target="_blank">安乐视</a>
      <a href="https://greasyfork.org/zh-CN/scripts/412041-%E5%AE%89%E4%B9%90%E6%BB%9A" target="_blank">安乐滚</a>     
      <a href="https://greasyfork.org/zh-CN/scripts/423419-%E5%AE%89%E4%B9%90%E4%BC%A0" target="_blank">安乐传</a>      
      <a href="https://greasyfork.org/zh-CN/scripts/428174-%E5%AE%89%E4%B9%90%E7%A0%81" target="_blank">安乐码</a>
      <spans>扫码装 其他设备扫码 跳转安乐视页面</spans>
    </div>
    <div id="jmhm5" class="jmanls_home ot">
      <div id="jmNight" style="background-image:url(https://s.aigei.com/src/img/png/83/83dd9c007fae4ead97166c1333620185.png?imageMogr2/auto-orient/thumbnail/!75x75r/gravity/Center/crop/75x75/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:ZQwigfpYJJsxf6OGM24ccVFO39c=);">Night</div>
      <div id="jmDay" style="background-image:url(https://s.aigei.com/src/img/png/c7/c74268617b1c4701854815268908fb43.png?imageMogr2/auto-orient/thumbnail/!201x201r/gravity/Center/crop/201x201/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Kx002ZMnB39hIgbzLjxsCW-v89A=);">Day</div>     
      <div style="background-image:url(https://s1.aigei.com/src/img/png/c5/c50eba4d60164c6da14e13afc7bd96ae.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:4IT7l3n3Qevh-Z_RGmpDopi2PBw=);" onclick="jmhelp.style.display='block';">帮助</div>
      <div style="background-image:url(https://s.aigei.com/src/img/png/a3/a309a83526984f3abcdc1ec66c39ffdc.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:5vL-oaM0hhUYMAIwqk5oTLq7ta4=);" onclick="jmabout.style.display='block';">关于</div>
      <div style="background-image:url(https://s1.chu0.com/src/img/png/6f/6fc2d23f8b834474b5176e501b1d226d.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:rA6mozf7y4hptVSVQbzAJ5LtuX8=);" onclick="jmupdate.style.display='block';"><div id="jmup2">1</div>更新脚本</div>
      <a style="background-image:url(https://s.aigei.com/src/img/png/03/036f5bd2358b41b9b4968a20857517a1.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:SUTiee43YRGapx4vgj8eImkjKAw=);" href="https://t.me/jsday" target="_blank">TG 群</a>
      <a style="background-image:url(https://s.aigei.com/src/img/png/a8/a8e3d64fbfb741098cb636a5043186c4.png?imageMogr2/auto-orient/thumbnail/!237x237r/gravity/Center/crop/237x237/quality/85/&e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:KwsashQOUZVicoA8xOB-dfVFiTY=);" href="https://greasyfork.org/zh-CN/scripts/430384-%E5%AE%89%E4%B9%90%E8%A7%86/feedback" target="_blank">反馈</a>
      <a style="background-image:url(https://s1.chu0.com/src/img/png/c1/c127c8d5a5db420281acbbf93cce55f2.png?imageMogr2/auto-orient/thumbnail/!201x201r/gravity/Center/crop/201x201/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:fDy4AuFoCtqR5DIJuNWsoXIsLKU=);" href="https://gitee.com/Jones_Miller/als/raw/master/README.md" target="_blank">日志</a>
      <spans style="white-space:nowrap;">[当前版本: 22.<span id="jmver_bd"></span>] [最新版本: 22.<span id="jmver_bdnew"></span>] [内部版本: 22.<span id="jmnbver"></span>]</spans>
    </div>
    <div id="jmhm6" class="jmanls_home ot"></div> <div id="jmhm6s" class="jmanls_home ot"></div>
    <div id="jmhm7" class="jmanls_home ot"></div> <div id="jmhm7s" class="jmanls_home ot"></div>
    <div id="jmforuser" class="jmanls_home ot"><spans>根据脚本内要求 开启/关闭、填入接口</spans></div> <div id="jmforusers" class="jmanls_home ot"><spans>根据脚本内要求 开启/关闭、填入接口</spans></div>
    <div id="jmhelp" class="jmanls_home ot">
      <div onclick="jmhelp.style.display='none';">关闭</div>
      <br><br>
      <span>无广告 免登陆 VIP视频解析 超前点播</span><br>多接口自由选择、部分接口支持高清播放<br>* 不保证能解析所有视频<br><br>
      <span>user接口</span><br>根据脚本内要求 开启/关闭、填入接口<br><br>
      <span>抖音去水印</span><br>请在抖音视频播放页面使用<br>1、手机端:<br>iOS 抖音 分享 更多分享 在Alook中打开<br>Android 抖音 分享 复制链接<br>Alook粘贴 删除多余字符<br>2、电脑端: <br>请在抖音视频页面<br>暂不支持推荐等页面使用<br><br>
      <span>油管解析</span><br>请在YouTube视频播放页面使用<br>* 跳转第三方页面<br><br>
      <span>常见问题</span><br>1、不加载安乐视图标、不弹出菜单、点击解析没反应:<br>刷新网页或重启浏览器<br>2、解析失败、出错、清晰度问题:<br>请刷新页面或更换接口<br><br>
      <span>其他</span><br>‘切换’ 可互换 本页播放 和 新页播放<br>扫码看 扫码装 赞赏 请点击图片关闭<br><br>
      <span>暂无更多...</span><br><br><br>
    </div>
    <div id="jmabout" class="jmanls_home ot">
      <div onclick="jmabout.style.display='none';">关闭</div>
      <br><br>
      <span>声明</span><br>非专业人士 所有数据收集于互联网 感谢原作者<br>根据个人喜好调整修改<br>如有侵权 联系删除<br>* 不保证能解析所有视频<br><br>
      <span>感谢</span><br>飝 飝 、JW 提供接口<br><br>
      <span>* 不保证脚本的兼容性和稳定性</span><br><br>
    </div>
    <div id="jmshuo" class="jmanls_home ot">
      <div onclick="jmshuo.style.display='none';">ok</div>
      <br><br>‘切换’ 可互换 本页播放 和 新页播放<br>扫码看 扫码装 点击图片关闭<br><br>
      解析、去水印按钮 仅在相应的站点显示<br><br>
      <span>声明</span><br>非专业人士 所有数据收集于互联网 感谢原作者<br>根据个人喜好调整修改<br>如有侵权 联系删除<br>* 不保证能解析所有视频<br><br>
      <span>* 不保证脚本的兼容性和稳定性</span><br><br>
    </div>
    <div id="jmupdate" class="jmanls_home ot" style="display:block;">
      <div id="jmupneg" style="display:none;" onclick="jmupdate.style.display='none';">忽略</div>
      <a id="jmupalk" style="background-image:url(https://s1.chu0.com/src/img/png/6f/6fc2d23f8b834474b5176e501b1d226d.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:rA6mozf7y4hptVSVQbzAJ5LtuX8=);" href="https://gitee.com/Jones_Miller/als/raw/master/scripts/%E5%AE%89%E4%B9%90%E8%A7%86.alook" target="_blank">Alook专用</a>
      <a id="jmupall" style="background-image:url(https://s1.chu0.com/src/img/png/6f/6fc2d23f8b834474b5176e501b1d226d.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:rA6mozf7y4hptVSVQbzAJ5LtuX8=);" href="https://greasyfork.org/zh-CN/scripts/430384-%E5%AE%89%E4%B9%90%E8%A7%86.js">直接更新</a>
      <br><br><br><span id="jmuplog" style="display:none;color:#fff;font-size:15px;">当前脚本已是最新</span><br><span id="jmodlog" style="display:none;color:#fff;font-size:15px;">脚本可更新</span>
      <span style="color:#fff;font-size:13px;">[当前版本: 22.<span id="jmver_bd2"></span>][最新版本: 22.<span id="jmver_bdnew2"></span>][远程版本: 22.<span id="jmnbver2"></span>]</span><br><br>
      <span id="jmnewlog"></span><br><br>
      <span style="color:#fff;font-size:13px;">最近更新:</span><br>
      <span id="jmoldlog"></span><br><br>
      <span style="color:#fff;font-size:13px;">更新后 若有老版js的请删除</span><br><br>
      <span style="color:#fff;font-size:13px;">详情见 安乐视 页面</span><br><br><br>
    </div>
    <div id="jmanls_night" class="jmanls_home ot" style="background:#121 url(https://s1.chu0.com/src/img/png/2f/2fc70fa51519492e80dd883f5b7c03ab.png?imageMogr2/auto-orient/thumbnail/!237x218r/gravity/Center/crop/237x218/quality/85/&e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:WiGSED4716W-BTEWsksMa2PmSjU=) no-repeat center !important;background-size:118.5px 109px !important;color:#456 !important;">
      <div onclick="jmanls_night.style.display='none';">关闭</div><spans style="color:#666;">夜深了 洗洗睡吧</spans>
    </div>
    <div id="jmqrcode" class="jmanls_home" onclick="this.style.display='none';"></div>
  </div>
  <div id="jmytbopen" class="jmanls_win jmanls_winbk" style="//display:block; width:10px; height:49px; bottom:168px; right:0px; transform:none;"></div>
  <div id="jmopen" class="jmanls_win jmanls_winbk">
    <div id="jmtm_bk" style="background:#666 !important;opacity:0.8;"></div>
    <div id="jmanls_ico" style="background-image:url(https://greasyfork.s3.us-east-2.amazonaws.com/odzn6d9sltx0utpy7dmb2hnz5mek);"></div>
    <span id="jmtm"></span>
  </div>`;
    function jmgoback () {
      jmmenu.style.display=jmhome.style.display='block';
      jmhm1.style.display=jmhm2.style.display=jmhm3.style.display=jmhm4.style.display=jmhm5.style.display=jmhm6.style.display=jmhm7.style.display=jmforuser.style.display='none';
      jmhm6s.style.display=jmhm7s.style.display=jmforusers.style.display='none';
      jmhmext.style.display='none';
      jmext.style.display=jmzs.style.display=jmqr.style.display=jmqh1.style.display=jmqh2.style.display=jmqh3.style.display='none';
      jmqrlook.style.display=jmqrlooktx.style.display=jmbenye.style.display=jmxinye.style.display='none';
    };
    function jmgoopen() {
      jmopen.style.bottom='178px';jmopen.style.height='30px';
      jmwin.style.width='400px';jmwin.style.maxWidth='99vw';jmwin.style.height='150px';jmwin.style.bottom='25px';
      jmtm_bk.style.display='block';
    };
    jmopen.onclick=function () {
      jmopen.style.width='68px';
      jmgoopen(); jmgoback ();
    };
    jmback.onclick=function () {
      if (jmhome.style.display=='block') {
        jmmenu.style.display=jmhome.style.display='none';
        jmwin.style.width='150px';jmwin.style.height='45px';
        jmopen.style.width='150px';jmopen.style.height='45px';jmopen.style.bottom='25px';
        jmtm_bk.style.display='none';
        jmqrcode.style.display='none';
      } else {
        jmgoback ();
      }
    };  
    if (uaLogo=="pc") {
      var jmtopc="width:68px; height:49px; bottom:168px; right:0.5vmin; transform:none;";
      jmwin.style=jmopen.style=jmtopc;
      jmanls_ico.style.display='block';jmtm.style.display='none';
      jmopen.onclick=function () {
        jmgoopen(); jmgoback ();
        jmanls_ico.style.display='none';jmtm.style.display='block';
      };
      jmback.onclick=function () {
        if (jmhome.style.display=='block') {
          jmmenu.style.display=jmhome.style.display='none';
          jmwin.style.width='68px';
          jmwin.style.height=jmopen.style.height='49px';jmwin.style.bottom=jmopen.style.bottom='168px';
          /*if(location.href.match(jmuaytb)) {
            jmwin.style.right=jmopen.style.right="-70px";
            jmytbopen.style.display='block';
          };*/
          jmanls_ico.style.display='block';jmtm.style.display='none';
          jmtm_bk.style.display='none';
          jmqrcode.style.display='none';
        } else {
          jmgoback ();
        }
      };
      if (location.href.match(jmuaytb)) {
        var jmonmouse;
        var jmmo=function () {
          jmonmouse=setTimeout(function () {
            jmwin.style.right=jmopen.style.right="-80px";
            jmytbopen.style.display='block';
          },2000);
        };
        jmanls_ico.onmouseover=function () {
          jmmo();
        };
        jmanls_ico.onmouseleave=function () {
          clearTimeout(jmonmouse);
        };
        var jmytbonmouse;
        var jmytbmo=function () {
          jmytbonmouse=setTimeout(function () {
            jmwin.style.right=jmopen.style.right="0.5vmin";
            jmytbopen.style.display='none';
          },1000);
        };
        jmytbopen.onmouseover=function () {
          jmytbmo();
        };
        jmytbopen.onmouseleave=function () {
          clearTimeout(jmytbonmouse);
        };
      };
    };
    var jmqrcodestyle="display:block;background-color:#fff !important; background-position:center !important; background-repeat:no-repeat !important; background-size:95% !important;"
    jmzs.onclick=function () { jmqrcode.style=jmqrcodestyle+'background-image:url(https://greasyfork.s3.us-east-2.amazonaws.com/1ysztwdanqpr2l0o2zxmp7xj8ai2) !important;';};
    jmqr.onclick=function () { jmqrcode.style=jmqrcodestyle+'background-image:url(https://api.pwmqr.com/qrcode/create/?url=https://greasyfork.org/zh-CN/scripts/429612) !important;';};
    jmflal.onclick=function () { jmqrcode.style=jmqrcodestyle+'background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/alipayhb.jpeg) !important;';};
    jmflas.onclick=function () { jmqrcode.style=jmqrcodestyle+'background-image:url(https://gitee.com/Jones_Miller/als/raw/master/Pic/appstorehb.jpg) !important;';};
    function jmanqha () { jmqrlook.style.display=jmqrlooktx.style.display='none';jmbenye.style.display='none';jmxinye.style.display='block';}
    function jmanqhb () { jmbenye.style.display='block';jmxinye.style.display='none';}
    jmqh1.onclick=function () { if(jmhm6.style.display=='block') { jmhm6.style.display='none';jmhm6s.style.display='block';jmanqha ();} else { jmhm6.style.display='block';jmhm6s.style.display='none';jmanqhb ();}};
    jmqh2.onclick=function () { if(jmhm7.style.display=='block') { jmhm7.style.display='none';jmhm7s.style.display='block';jmanqha ();} else { jmhm7.style.display='block';jmhm7s.style.display='none';jmanqhb ();}};
    jmqh3.onclick=function () { if(jmforuser.style.display=='block') { jmforuser.style.display='none';jmforusers.style.display='block';jmanqha ();} else { jmforuser.style.display='block';jmforusers.style.display='none';jmanqhb ();}};
    function jmantm() { 
      var jmnow = new Date();
      var jmanh = jmnow.getHours();
      var jmanm = jmnow.getMinutes()>9?jmnow.getMinutes() :"0"+jmnow.getMinutes();
      var jmans = jmnow.getSeconds()>9?jmnow.getSeconds() :"0"+jmnow.getSeconds();
      jmtm.innerHTML=jmanh+":"+jmanm+":"+jmans;
    };
    setInterval (jmantm, 1000);
    var host = window.location.host;
    setInterval(function(){
      if(host.indexOf("v.qq.com")!=-1){
        $("#mask_layer").hide();
        $(".mod_vip_popup").hide();
        $(".at-app-banner").hide();
        $(".mod_source").hide();
      }
    },0); 
    window.onload = function () {
      var s = document.cookie;
      if (s.indexOf('jmsh=1') != -1) return;
      var d = new Date();
      d.setHours(d.getHours() + (24 * 30));
      document.cookie = 'jmsh=1;expires='+d.toGMTString();
      jmshuo.style.display=jmhmhp.style.display='block';
    };
    function jmdisplay () { jmwin.style.display=jmopen.style.display="block";}
    function jmnodisplay () { jmwin.style.display=jmopen.style.display="none";}
    if (location.href.match(jmuapc+'|'+jmuamobile+'|^https://v.qq.com/favicon.ico')) { 
      jmdisplay();
      jmh6.style.display=jmh7.style.display='block';
    };
    if (location.href.match(jmuady)) {
      jmdisplay();
      jmh9.style.display='block';
      var match = location.href.match(/share\/video\/(\d*)/);
      if (uaLogo=="pc") { var match = location.href.match(/video\/(\d*)/);};
      var id = match[1];
      fetch("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + id)
        .then((res) => res.json())
        .then((json) => {
        var info = json.item_list[0];
        var url = info.video.play_addr.url_list[0].replace("playwm", "play");
        jmh9.onclick = function () { window.open(url,'_self')};
        if (uaLogo=="pc") { jmh9.onclick = function () { window.open(url,'_blank')};}
      });
    };
    setInterval(function(){
      const host = window.location.host;
      const href = window.location.href;
      if(host.indexOf("m.v.qq.com")!=-1){
        if(  (href.indexOf("m.v.qq.com/x/m/play")!=-1)
          || (href.indexOf("m.v.qq.com/play")!=-1)
          || (href.indexOf("m.v.qq.com/x/cover/")!=-1)
          || (href.indexOf("m.v.qq.com/cover/")!=-1)
          ) {
          jmdisplay();
          jmh6.style.display=jmh7.style.display='block';
        } else {
          jmnodisplay();
        }
      };
      if(host.indexOf("youtube.com")!=-1){
        if(href.indexOf("youtube.com/watch")!=-1){
          jmdisplay();
          jmh10.style.display='block';
          jmh10.onclick = function() {
            window.open("https://www.ytdownfk.com/search?url=" + location.href, '_blank');
          }
        } else { 
          jmnodisplay();
        }
      };
    }, 500);
  };
  function jmnightandverlog () {
    var jmbs = document.querySelectorAll(".jmanls_home div,.jmanls_home a,#jmhm2 span,.jmanls_home spans,.jmanls_menu span");
    function jmdark() {
      for(var i=0;i<jmbs.length;i++) {
        jmbs[i].style.color='#fff';
      }
    };
    function jmlight() {
      for(var i=0;i<jmbs.length;i++) {
        jmbs[i].style.color='#000';
      }
    };
    function jmals_darkmode () { jmdark();jmwin.style.backgroundImage=jmopen.style.backgroundImage=jmytbopen.style.backgroundImage='url(), linear-gradient(to left top, rgb(204, 0, 0), rgb(137, 22, 23), rgb(25, 32, 107), rgb(137, 22, 23), rgb(25, 32, 107), rgb(137, 22, 23), rgb(204, 0, 0))';}
    function jmals_lightmode () { jmlight();jmwin.style.backgroundImage=jmopen.style.backgroundImage=jmytbopen.style.backgroundImage='#fffff';};
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      jmals_darkmode();
    } else {
      jmals_lightmode();
    };
    jmNight.onclick=function () { jmals_darkmode();};
    jmDay.onclick=function () { jmals_lightmode();};
    var now = new Date(); var jth = now.getHours(); if (jth>=7 && jth<18) { } else { jmals_darkmode();}; if( jth>=5 && jth<22) { } else { jmanls_night.style.display='block';};
    /**************************************/
    jmver_bdnew.innerHTML=jmver_bdnew2.innerHTML='2.19';
    jmnbver.innerHTML=jmnbver2.innerHTML='2.21';
    jmnewlog.innerHTML='在电脑端安乐视图标的一个问题；<br>解析、去水印 仅在相应的站点显示；<br>抖音页面可能无图标显示的问题；<br>抖音去水印 在电脑端 现在无需切换UA为移动端；<br>Night、Day 字体可见度；<br>在电脑端 YouTube 鼠标轻扫悬浮<br>其他一些调整。';
    jmoldlog.innerHTML='新增本地时间显示<br>支持YouTube视频解析<br>支持 ios15 Safari 浏览器';
    /**************************************/
    function noup () { jmupdate.style.display='none';jmup1.style.display=jmup2.style.display='none';jmupneg.style.display=jmuplog.style.display='block';jmupalk.style.display=jmupall.style.display='none';};
    function isup () { jmupneg.style.display=jmodlog.style.display='block';};
    if (jmver_bdnew.innerHTML=="2.19") { noup();} else { isup();};
    /**************************************/
  };
  if (location.href.match(jmuapc+'|'+jmuamvqq+'|'+jmuamobile+'|^https://v.qq.com/favicon.ico')) {
    jmanls_menu(); createSelect(apis); jmnightandverlog ();
  };
  if (location.href.match(jmuady+'|'+jmuaytb)) { jmanls_menu(); jmnightandverlog ();};
  
})();