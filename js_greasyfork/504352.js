// ==UserScript==
// @name         小说阅读模式
// @namespace    https://viayoo.com/
// @version      220505.21
// @description  按钮开关“[Ξ]”是上滑隐藏、下滑显示的，进入阅读模式后的设置按钮“M”同。
// @author       You
// @license MIT
// @run-at       document-end
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504352/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/504352/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

!function() {
  /*【参考】：阅读模式→酷安@fangsiyuan《纯文本阅读模式》；按钮隐藏→酷安@谷花泰《仿酷安回到顶部/底部（增强版）》；主题→话本小说网;酷安@石头VS影子 提供历史记录方法……感谢评论区的建议反馈*/
  var zhdx = 20;
  /*20为字体初始大小*/
  var zhcz = 6;
  /*6为字行差值，该值与字体大小之和作为行高*/
  var zhbj = 4;
  /*4为显示边距*/
  var cszt = "#e3edcd-#000";
  /*初始主题，主题格式：背景色-字体颜色。单独颜色值则为背景色且字体为黑色*/
  var ztss = "#FFCBE8-#C71585;#fce4ec-#880e4f;#CCE2BF-green;#e0f2f1-#004d40;#e1f5fe-#01579b;#494949-#C1C1C1;#1a1c23-#c6c7c8;#000000-#bbbbbb;#C7EDCC;#DCECD2;#f4f0e9;#fff";
  /*本脚本所有主题集，主题之间“;”隔开*/
  var $ = function(e) {
    return document.querySelector(e)
  },
  ydcss = "display:none;text-align:center !important;font-size:20px;width:28px;height:28px;line-height:28px;text-align:center;float:right;position:fixed;right:10px;top:70%;color:#000;opacity:0.8;background:#e3edcd;cursor:pointer;position:fixed !important;z-index:9999999999 !important;box-shadow:0px 1px 1px #000;border-radius:50%;";
  if (!$("#txtyd")) {
    var ydan = document.createElement("span");
    ydan.id = "txtyd";
    ydan.innerHTML = "[\u039e]";
    ydan.style.cssText = ydcss;
    ydan.addEventListener("click",
    function() {
      jryd()
    });
    $("body").appendChild(ydan);
  }
  var hdy1, hdy2;
  document.addEventListener("touchstart",
  function(e) {
    hdy1 = e.changedTouches[0].clientY
  });
  document.addEventListener("touchmove",
  function(e) {
    hdy2 = e.changedTouches[0].clientY;
    $("#txtyd").style.display = hdy2 - hdy1 > 0 ? "block": "none"
  });
  function jryd() {
    var wybm = document.characterSet,
    wyt = '<html><head><meta charset="' + wybm + '"><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"><style type="text/css">body{text-align:center;word-wrap:break-word;}#xsxs p{padding:0px ' + zhbj + 'px;text-align:justify;margin:0;}.wbt{font-weight:bold;}</style><title></title><script>var $=function(e){return document.querySelector(e)},dqurl="' + location.href + '",ksqy="' + document.documentElement.clientHeight + '",xsztys="' + ztss + '",mrzt="' + cszt + '";</script></head><body><div><iframe hidden></iframe></div><div id="xssj" style="width:100%;height:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div><div id="xsxs"></div><br><script>var nexturl=dqurl,nextt="",xsnr,tcdzt,tztdx,tzthg,fysz,khwb="</p><br><p>";function szztdx(e){$("body").style.fontSize=e+"px";tztdx=e;tzthg=e*1+' + zhcz + ';fysz=ksqy-tzthg;$("body").style.lineHeight=tzthg+"px"};szztdx("' + zhdx + '");xstxt(dqurl);function xstxt(e){dqurl=e;var t=new XMLHttpRequest;t.open("get",e,true),t.overrideMimeType("text/html;charset=' + wybm + '"),t.onreadystatechange=function(){4==t.readyState&&200==t.status&&($("#xssj").innerHTML=t.responseText.replace(/^\\s+|\\s+$/g,"").replace(/<!--.*?-->/g,"").replace(/>\\s+?</g,"><").replace(/<style[\\s\\S]*?<\\/style>/ig,"").replace(/<script[\\s\\S]*?<\\/script>/ig,"").replace(/<iframe[\\s\\S]*?<\\/iframe>/ig,"").match(/<body[\\s\\S]*<\\/body>/i),nextt=t.responseText.match(/<title>([\\s\\S]*)<\\/title>/i)[1],zltxt())},t.send()}function zltxt(){function e(e){e.style.display="none"}function n(){for(var n=["div","span","p"],t=0;t<n.length;t++){var r=s.querySelectorAll(n[t]);if(r.length>0)for(var o=0;o<r.length;o++)r[o].innerText.replace(/\\s+/g,"").length<8&&e(r[o])}}function t(n){var t=s.querySelectorAll(n);if(t.length>0)for(var r=0;r<t.length;r++)e(t[r])}function r(n){s.querySelector(n)&&e(s.querySelector(n))}function o(){xsnr=("\\n\\n"+xsnr).replace(/\\r|\\n/g,"\\n\\n").replace(/\\n\\s+/g,khwb),window.screen.height>=document.documentElement.scrollHeight&&zstxt()}var s=$("#xssj"),u=s.querySelectorAll("a"),l=u.length,x=/\u4e0b\u4e00\u9875|\u4e0b\u9875|\u4e0b\u8282|\u4e0b\u4e00\u9801|\u4e0b\u9801|\u4e0b\u4e00\u7ae0|\u4e0b\u7ae0/;if(l>0)for(var c=l-1;c>=0;c--){var i=u[c],a=i.innerText,f=i.href;if(x.test(a)&&-1==f.indexOf("#")){nexturl=f;break}nexturl=""}!function(){r("#foot"),t("footer"),r("#footer"),r(".footer"),t("iframe"),t("form"),t("input"),t("table"),t("tbody"),t("tr"),t("td"),t("ul"),t("li"),t("img"),t("font"),t("b"),t("a")}(),$("#xssj #chaptercontent")?(r("#cambrian0"),xsnr=$("#xssj #chaptercontent").innerText,o()):$("#xssj #nr")?(xsnr=$("#xssj #nr").innerText,o()):$("#xssj #content")?(xsnr=$("#xssj #content").innerText,o()):$("#xssj .content")?(xsnr=$("#xssj .content").innerText,o()):$("#xssj #novelcontent")?(xsnr=$("#xssj #novelcontent").innerText,o()):(n(),n(),xsnr=s.innerText,o())}function zstxt(){dqurl!=location.href&&history.pushState(null,nextt,dqurl);document.title=nextt;var t="<br><br><div class=\'wbt\'>END</div><br>";$("#xsxs").innerHTML+=t.replace(/END/,nextt)+"<p>"+xsnr+"</p>",""!=nexturl?xstxt(nexturl):($("#xsxs").innerHTML+=t,dqurl="")}document.addEventListener("scroll",dddb);function dddb(){var e=document.documentElement.scrollTop||$("body").scrollTop;window.screen.height<document.documentElement.scrollHeight&&e+2*window.screen.height>document.documentElement.scrollHeight&&dqurl!=nexturl&&zstxt()}</script><span id="txtcd" style="top:80%;z-index:999">M</span><div id="szcsp" style="color:rgb(0,0,0);font-size:24px;line-height:24px;opacity:1;background:rgb(255,255,255);cursor:pointer;position:fixed;bottom:5%;left:5%;right:5%;margin-top:auto;z-index:9999;border:1px solid rgb(197,197,197);border-radius:5px;-webkit-tap-highlight-color:rgba(0,0,0,0);display:none;"><div id="szcsp2" style="margin:8px;padding:8px;text-align:center;"><p><span id="csztjx">\u3000A-\u3000</span>\u3000<span id="csztzd">\u3000A+\u3000</span></p><p id="cszt"></p><p><span onclick="location.reload();window.scrollTo(0,0);">\u9000\u51fa\u9605\u8bfb\u6a21\u5f0f</span></p></div></div><style type="text/css">#szcsp2 span{display:inline-block;margin:4px;padding:4px;border:1px solid #c5c5c5;border-radius:5px;}#szcsp2 p{margin:4px;}img{display:none!important;}#txtcd{' + ydcss + '}</style></body></html>';
    var newy = window.open('', '_self');
    newy.opener = null;
    newy.document.write(wyt);
    newy.document.close();
    var cpfy = document.createElement("script");
    cpfy.innerHTML = '$("#xsxs").addEventListener("click",function(e){e.clientY<window.screen.availHeight/2?window.scrollBy(0,-fysz):(window.scrollBy(0,fysz),yctcd())});document.addEventListener("touchstart",function(e){startY=e.changedTouches[0].clientY});document.addEventListener("touchmove",function(e){endY=e.changedTouches[0].clientY,endY-startY>0?($("#txtcd").style.display="block",tcdzt=1):yctcd()});function yctcd(){"1"==tcdzt&&($("#txtcd").style.display="none",$("#szcsp").style.display="none",tcdzt=0)};$("#txtcd").addEventListener("click",function(){$("#szcsp").style.display="block";tcdzt=1}),$("#csztjx").addEventListener("click",function(){var t=tztdx-1;t>9&&szztdx(t)}),$("#csztzd").addEventListener("click",function(){var t=1*tztdx+1;t<41&&szztdx(t)});cjztan();szzt(mrzt);function cjztan(){for(var t=xsztys.split(";"),e=0;e<t.length;e++){var n=document.createElement("span");n.innerHTML="\u3000",n.style.backgroundColor=t[e].split("-")[0],n.setAttribute("ysz",t[e]),n.onclick=function(){var t=this.getAttribute("ysz");szzt(t)},$("#cszt").appendChild(n)}}function szzt(o){var t=o.split("-");$("body").style.backgroundColor=t[0],void 0==t[1]?$("body").style.color="#000":$("body").style.color=t[1]}';
    $("body").appendChild(cpfy)
  }
} ();