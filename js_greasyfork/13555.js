// ==UserScript==
// @name        Nicopedia-FlMMLonHTML5
// @namespace   https://github.com/kosh04/userscript
// @version     0.20211002
// @description ニコニコ大百科のピコカキコプレーヤーをFlMMLonHTML5に置き換える (デバッグ用)
// @match       https://dic.nicovideo.jp/*
// @require     https://cdn.jsdelivr.net/npm/flmml-on-html5@2.0.0/dist/flmml-on-html5.js
// @resource    flmmlworker.js  https://cdn.jsdelivr.net/npm/flmml-on-html5@2.0.0/dist/flmml-on-html5.worker.js
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// @noframes
// @author      kosh (mono)
// @downloadURL https://update.greasyfork.org/scripts/13555/Nicopedia-FlMMLonHTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/13555/Nicopedia-FlMMLonHTML5.meta.js
// ==/UserScript==

/*global FlMML,FlMMLPlayer*/

/*
flmml-on-html5 v2.x アップデートに伴い v1.x 付属の FlMMLPlayer は削除されました。
このスクリプトでは FlMMLPlayer@1.x を利用するための（非推奨な）回避策をいくつか施しています。
*/

'use strict';

// https://ghcdn.rawgit.org/argentum384/flmml-on-html5/v1.2.0/src/flmmlplayer-raw.js
"use strict";var FlMMLPlayer=function(T,P){function t(t,i){for(var e in i)t[e]=i[e];return t}function w(t,i,e){t.addEventListener(i,e)}function L(t,i){t.appendChild(i)}function b(t){return t.cloneNode()}function C(t){return P.createElementNS("http://www.w3.org/2000/svg",t)}function F(t,i,e){t.setAttributeNS(null,i,e)}function G(t,i){for(var e in i)t.setAttributeNS(null,e,i[e])}function k(){for(var t=arguments.length;t--;)arguments[t].style.display="inline"}function B(){for(var t=arguments.length;t--;)arguments[t].style.display="none"}function N(t){1&t.buttons&&t.preventDefault()}function R(t){var i=this.no=R.players.length,e=this.hue=null==t.hue?200:t.hue;this.volume=null==t.volume?100:t.volume,this.logVolume=!!t.logVolume,this.workerURL=t.workerURL,t.mmlURL&&""!==t.mmlURL?(this.mmlURL=t.mmlURL,this.mmlStatus=R.MMLST_WAIT):(this.mml=t.mml,this.mmlStatus=R.MMLST_ARG);var s=this.svg=C("svg");G(s,{id:"flmmlplayer"+i,viewBox:"0 0 600 100"}),s.style.height=t.height||"1.5em",w(s,"mousedown",N),w(s,"mousemove",N);var o=P.createElement("style");o.setAttribute("type","text/css"),L(o,P.createTextNode("svg#flmmlplayer"+i+" .clickable-button:active{fill:url(#gradBtnPushed"+i+");}svg#flmmlplayer"+i+" .clickable-button:hover{stroke:hsl("+e+",100%,75%)}svg#flmmlplayer"+i+" text{text-anchor:middle;pointer-events:none}")),L(s,o);var l=C("defs"),n=C("filter"),h=C("feGaussianBlur"),a=C("feMerge"),r=C("feMergeNode"),u=C("feMergeNode");G(n,{id:"filterGlow"+i,x:"-150%",y:"-100%",width:"600%",height:"400%"}),G(h,{in:"SourceGraphic",stdDeviation:8,result:"blur"}),F(r,"in","blur"),F(u,"in","SourceGraphic"),L(a,r),L(a,u),L(n,h),L(n,a),L(l,n);var c=C("linearGradient"),m=C("linearGradient"),g=C("stop"),f=C("stop");G(c,{id:"gradBtn"+i,x1:"0%",y1:"0%",x2:"0%",y2:"100%"}),G(g,{offset:0,"stop-color":"hsl("+e+",30%,98%)"}),G(f,{offset:1,"stop-color":"hsl("+e+",30%,83%)"}),L(c,g),L(c,f),G(m,{id:"gradBtnPushed"+i,x1:"0%",y1:"0%",x2:"0%",y2:"100%"}),f=b(f),g=b(g),F(f,"offset",0),F(g,"offset",1),L(m,f),L(m,g),L(l,c),L(l,m);var p=C("linearGradient"),d=C("stop"),y=C("stop");G(p,{id:"gradDisp"+i,x1:"0%",y1:"0%",x2:"0%",y2:"100%"}),G(d,{offset:0,"stop-color":"hsl("+e+",100%,2%)"}),G(y,{offset:1,"stop-color":"hsl("+e+",100%,30%)"}),L(p,d),L(p,y),L(l,p),L(s,l);var v=this.gPlayFirst=C("g");w(v,"click",this.playFirst.bind(this));var S=this.rectBtn=C("rect");G(S,{x:5,y:5,width:90,height:90,rx:6,ry:6,fill:"url(#gradBtn"+i+")",stroke:"hsl("+e+",15%,50%)","stroke-width":4,class:"clickable-button"});var M=b(S);F(M,"width",590),L(v,M);var x=this.pathPlay=C("path");G(x,{fill:"hsl(120,100%,35%)",d:"M22,22v56l56,-28z",filter:"url(#filterGlow"+i+")","pointer-events":"none"});var D=b(x);F(D,"transform","translate(115,0)");var V=C("text");if(G(V,{x:345,y:72,"font-family":"'Verdana'","font-size":62,textLength:280}),L(V,P.createTextNode("Play MML")),L(v,V),L(v,D),L(s,v),!t.underground){var T=P.getElementsByTagName("script");L(T.item(T.length-1).parentNode,s)}this.hasPlayedOnce=!1,this.isChangingVol=!1,this.hasReplacedFonts=!1,R.players.push(this)}return t(R,{MMLST_ARG:1,MMLST_WAIT:2,MMLST_LOADING:3,MMLST_SUCCEED:4,MMLST_FAILED:5,players:[]}),t(R.prototype,{setMasterVolume:function(t){var i;if(null==t?t=this.volume:this.volume=t,this.logVolume){i=(Math.pow(40,t/127-1)-.025)/.975*127}else i=t;this.hasPlayedOnce&&this.flmml.setMasterVolume(i)},replaceFonts:function(){this.hasPlayedOnce&&!this.hasReplacedFonts&&R.hasLoadedFonts&&(G(this.textDisplay,{y:45,"font-family":"'Press Start 2P'","font-weight":"normal","font-size":33}),this.hasReplacedFonts=!0)},getSVGPos:function(t,i){var e=this.svg.createSVGPoint();return e.x=t,e.y=i,e.matrixTransform(this.svg.getScreenCTM().inverse())},changeStatus:function(t,i){for(var e,s=this.textDisplay;e=s.lastChild;)s.removeChild(e);L(s,P.createTextNode(t)),i&&F(s,"textLength",i)},showVolume:function(){for(var t=(0|this.volume)+"";t.length<3;)t=" "+t;this.changeStatus("Volume:"+t,289),this.isDispVol=!0,clearTimeout(this.tIDDispVol),this.tIDDispVol=setTimeout(this.onDispVolTimer.bind(this),2e3)},changeVolume:function(t){var i;t<230?i=0:230<=t&&t<570?i=(t-230)/340*127:570<=t&&(i=127),this.flmml&&(this.setMasterVolume(i),this.showVolume()),t<225&&(t=225),575<t&&(t=575),F(this.circleVolume,"cx",t)},onReadyStateChange:function(t){this.xhr.readyState===XMLHttpRequest.DONE&&(200===this.xhr.status?(this.changeStatus("Compiling...",347),k(this.gStop),B(this.gStopD),this.mml=this.xhr.responseText,this.mmlStatus=R.MMLST_SUCCEED,this.flmml.play(this.mml),clearTimeout(this.tIDDispVol)):(this.changeStatus("Failure.",232),this.flmml.release(),this.flmml=null,this.mmlStatus=R.MMLST_FAILED))},playFirst:function(){var t=this.flmml=new FlMMLonHTML5(this.workerURL);this.setMasterVolume(),w(t,"compilecomplete",this.onCompileComplete.bind(this)),w(t,"buffering",this.onBuffering.bind(this)),w(t,"complete",this.onComplete.bind(this)),w(t,"syncinfo",this.onSyncInfo.bind(this));var i=this.svg,e=this.no,s=this.hue,o=this.gPlay=C("g"),l=this.gPlayD=C("g"),n=this.gPause=C("g"),h=this.gStop=C("g"),a=this.gDisplay=C("g"),r=this.gVolume=C("g");w(o,"click",this.playPause.bind(this)),w(n,"click",this.playPause.bind(this)),F(h,"transform","translate(100,0)"),w(h,"click",this.stop.bind(this));var u=this.gStopD=b(h),c=this.rectBtn;L(o,b(c)),L(n,b(c)),L(h,b(c));var m=b(c);G(m,{stroke:"hsl("+s+",15%,75%)",class:""}),L(l,b(m)),L(u,b(m));var g=this.pathPlay;L(o,g);var f=b(g);G(f,{fill:"gray",opacity:.5}),L(l,f);var p=C("rect");G(p,{x:26,y:22,width:17,height:56,fill:"hsl(210,100%,50%)",filter:"url(#filterGlow"+e+")","pointer-events":"none"});var d=b(p);F(d,"x",57),L(n,p),L(n,d);var y=C("rect");G(y,{x:23,y:23,width:54,height:54,fill:"hsl(15,100%,50%)",filter:"url(#filterGlow"+e+")","pointer-events":"none"}),L(h,y);var v=b(y);G(v,{fill:"gray",opacity:.5}),L(u,v);var S=C("rect");G(S,{x:203,y:5,width:394,height:44,rx:6,ry:6,fill:"url(#gradDisp"+e+")",stroke:"hsl("+s+",100%,30%)","stroke-width":4,"pointer-events":"none"}),L(a,S);var M=this.textDisplay=C("text");G(M,{x:401,y:43,fill:"white","font-family":"'Courier New',Courier',monospace","font-weight":"bold","font-size":50}),L(a,M);var x=C("rect");G(x,{x:205,y:70,width:390,height:12,rx:4,ry:4,fill:"url(#gradBtnPushed"+e+")",stroke:"hsl("+s+",15%,75%)","stroke-width":4}),L(r,x);var D=this.circleVolume=C("circle");if(G(D,{cx:498,cy:76,r:22,fill:"url(#gradBtn"+e+")",stroke:"hsl("+s+",15%,50%)","stroke-width":4,class:"button"}),F(D,"cx",this.volume/127*340+230|0),L(r,D),B(o,n,h,u),this.mmlStatus===R.MMLST_ARG)this.changeStatus("Compiling...",347),k(h),t.play(this.mml);else if(this.mmlStatus===R.MMLST_WAIT){var V=this.xhr=new XMLHttpRequest;w(V,"readystatechange",this.onReadyStateChange.bind(this)),V.open("GET",this.mmlURL),V.send(null),this.mmlStatus=R.MMLST_LOADING,this.changeStatus("Loading...",289),k(u)}i.removeChild(this.gPlayFirst),L(i,o),L(i,l),L(i,n),L(i,h),L(i,u),L(i,a),L(i,r),w(i,"mousedown",this.onMouseDown.bind(this)),w(T,"mousemove",this.onMouseMove.bind(this)),w(T,"mouseup",this.onMouseUp.bind(this)),w(i,"touchstart",this.onTouchStart.bind(this)),w(T,"touchmove",this.onTouchMove.bind(this)),w(T,"touchend",this.onMouseUp.bind(this)),this.hasPlayedOnce=!0,this.replaceFonts()},playPause:function(){this.flmml.isPlaying()?(k(this.gPlay),B(this.gPause),this.flmml.pause()):(k(this.gPause,this.gStop),B(this.gPlay,this.gStopD),this.flmml.isPaused()||(this.isCompiling=!0,this.changeStatus("Compiling...",347)),this.flmml.play(this.mml)),clearTimeout(this.tIDDispVol),this.onDispVolTimer()},stop:function(){k(this.gPlay,this.gStopD),B(this.gPause,this.gStop),this.flmml.stop(),clearTimeout(this.tIDDispVol),this.onDispVolTimer()},onMouseDown:function(t){if(1&t.buttons&&this.hasPlayedOnce){var i=this.getSVGPos(t.clientX,t.clientY);205<=i.x&&i.x<595&&50<=i.y&&i.y<100&&(this.changeVolume(i.x),this.isChangingVol=!0)}},onMouseMove:function(t){if(1&t.buttons&&this.isChangingVol){var i=this.getSVGPos(t.clientX,t.clientY);this.changeVolume(i.x),t.preventDefault()}},onMouseUp:function(t){this.isChangingVol=!1},onTouchStart:function(t){if(this.hasPlayedOnce){var i=t.touches[0],e=this.getSVGPos(i.clientX,i.clientY);205<=e.x&&e.x<595&&50<=e.y&&e.y<100&&(this.changeVolume(e.x),this.isChangingVol=!0)}},onTouchMove:function(t){if(this.isChangingVol){var i=t.touches[0],e=this.getSVGPos(i.clientX,i.clientY);this.changeVolume(e.x),t.preventDefault()}},onCompileComplete:function(){k(this.gPause),B(this.gPlayD),this.isCompiling=!1},onBuffering:function(t){100===t.progress?(this.isBuffering=!1,clearTimeout(this.tIDDispVol),this.onDispVolTimer()):this.isDispVol||(this.changeStatus("Buffering:"+(t.progress<10?" ":"")+t.progress+"%",377),this.isBuffering=!0)},onComplete:function(){k(this.gPlay,this.gStopD),B(this.gPause,this.gStop),clearTimeout(this.tIDDispVol),this.onDispVolTimer()},onSyncInfo:function(){this.isDispVol||this.isCompiling||this.isBuffering||this.changeStatus(this.flmml.getNowTimeStr()+"/"+this.flmml.getTotalTimeStr(),318)},onDispVolTimer:function(){this.isDispVol=!1,this.isCompiling?this.changeStatus("Compiling...",347):this.isBuffering||this.onSyncInfo()},getElement:function(){return this.svg}}),R.onActiveFonts=function(){R.hasLoadedFonts=!0;for(var t=R.players.length;t--;)R.players[t].replaceFonts.call(R.players[t])},R.hasLoadedFonts=!1,R}(window,document),WebFontConfig={google:{families:["Press+Start+2P::latin"]},active:FlMMLPlayer.onActiveFonts};!function(t){var i=t.createElement("script");i.src=("https:"===t.location.protocol?"https":"http")+"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",i.type="text/javascript",i.async="true";var e=t.getElementsByTagName("script").item(0);e.parentNode.insertBefore(i,e)}(document);

// v2.0.0 リリースログから引用
// >>> エントリポイント FlMMLonHTML5 の名前を FlMML に変更。ただし当面の間 FlMMLonHTML5 でも利用可
unsafeWindow.FlMMLonHTML5 = FlMML;

const workerURL = (() => {
    const code = GM_getResourceText("flmmlworker.js");
    const blob = new Blob([code], { type: "application/javascript" });
    return URL.createObjectURL(blob);
})();

// セレクタ指定ヒント
// id="piko12345"
// id="piko124_u2" (単語記事「ピコカキコ」参照)
// id="pikobbs12345"
// id="pikolist12345"
// id="pikosearch12345"
const pikoSelector = '[id^=piko]';

document.querySelectorAll(pikoSelector).forEach(piko => {
    const m = piko.id.match(/^piko(?:bbs|list|search)?(\d+)/);
    if (!m) return;
    const mml_id = m[1]; // "piko777" -> "777"

    const imgPikoplayer = piko.children.item(0);
    imgPikoplayer.removeAttribute("onclick"); // 元イベントの無効化
    imgPikoplayer.addEventListener('click', (e) => {
        const player = new FlMMLPlayer({
            mmlURL: `/mml/${mml_id}`,
            height: "1.8em",
            underground: true,
            workerURL: workerURL,
        });
        e.target.parentNode.replaceChild(player.svg, e.target);
    });
});

FlMML.prepare(pikoSelector);
