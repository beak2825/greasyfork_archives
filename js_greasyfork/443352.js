// ==UserScript==
// @name         bv辅助
// @namespace    https://greasyfork.org/users/718683
// @author       runwithfaith
// @match        https://www.bilibili.com/video/*
// @match        https://www.le.com/ptv/vplay/*
// @match        https://www.ixigua.com/*
// @match        https://haokan.baidu.com/*
// @match        https://tv.cctv.com/*
// @icon         http://bilibili.com/favicon.ico
// @description  我本人在阿b看视频的辅助js,只测试过火狐.内置多个功能,可以设置倍速,音量,全屏等.本脚本永久开源，永久免费。本脚本仅供合法使用,不得被用于任何的非法用途。
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @compatible   firefox
// @require https://greasyfork.org/scripts/435697-myutils/code/myUtils.js?version=1236344
// @license      MIT
// @noframes
// @version 0.0.1.20231120041830
// @downloadURL https://update.greasyfork.org/scripts/443352/bv%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/443352/bv%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
/*
缺点:全屏后较为单调.且火狐必须先配置浏览器.功能少.
优点:强解耦
*/
/*添加元素,仅执行一次*/
;(function addEles(){
    const sv=GM_setValue,gv=GM_getValue,as=GM_addStyle,uw=unsafeWindow;
    let vedio;
    as(`#mbvt{
            position: fixed;
            top: 30% !important;
            right: 0 !important;
            z-index: 9999999;
            width: 50px;
        }/*video{
            width: 100%;height: 100%;position: fixed;z-index: 1659548286991;left: 0;top: 0;background: black;
        }*/`);
    const root=my.append(`div`,my.zone,'',`id`,'mbvt'),//总div
          fsBtn=my.append(`button`,null,'全屏'),
          play=my.append(`button`,null,'play'),
          pause=my.append(`button`,null,'pause'),
          replay=my.append(`button`,null,'起点'),
          isFs=my.append('input',null,'','type',"checkbox"),
          isAutoPlay=my.append('input',null,'','type',"checkbox"),
          back5s=my.append('button',null,'back'),
          vcover=my.append('button',null,'封面'),
          rate=my.append('input',null,'倍速'),
          volume=my.append('input',null,'音量');
    isFs.checked=parseInt(gv('autoFs',0));
    isAutoPlay.checked=parseInt(gv('autoPlay',0));
    fsBtn.onclick=()=>{vedio.requestFullscreen();};
    replay.onclick=()=>{vedio.currentTime=0;vedio.play()};
    vcover.onclick=()=>{open(uw.vd.pic)};
    play.onmouseover=()=>{vedio.pause();vedio.play()};
    pause.onmouseover=()=>{vedio.pause()};
    back5s.onmouseover=()=>{vedio.currentTime-= 5;};
    rate.onclick=e=>{
        const r= Number(prompt('设置倍速0-4：',rate.value));
        if(r>-1){
            vedio.playbackRate=r;
            sv('pbRate',r);
            e.target.value=r;
        }
    };
    volume.onclick=e=>{
        const v= Number(prompt('设置音量0-1：',volume.value));
        if(v>-1){
            vedio.volume=v;
            sv('volume',v);
            e.target.value=v;
        }
    };
    isFs.onchange=e=>{sv('autoFs',e.target.checked&1)}
    isAutoPlay.onchange=e=>{sv('autoPlay',e.target.checked&1)}
    appendDivWithEle(root,fsBtn,back5s,play,pause,replay,vcover,rate,volume);
    my.after(isFs,fsBtn,'');
    my.after(isAutoPlay,play,'');

    return init()
    function init(){/*初始化倍速,音量,全屏*/
        const v=document.querySelector('video');//作为网页加载好的flag
        if(!v){
            // console.log("video not found, retry after 1000ms...");
            return setTimeout(init,1000);
        }else{//首次初始化
            observeVideo(vedio=v,init);
            v.addEventListener('play',()=>{
                let flag=1;
                if(isFs.checked &!document.fullScreen) fsBtn.click();
                return (flag<2)&&(flag++)&&(()=>{
                    const vo=parseFloat(gv('volume',1)),r=gv('pbRate',1);
                    v.playbackRate=rate.value=r;
                    v.volume=volume.value=vo;
                })()
            })
            if(isAutoPlay.checked) v.play();
            if(isFs.checked&!document.fullScreen)fsBtn.click();
        }
    }
})();
/*div套子div,子div套实质ele*/
function appendDivWithEle(dad,...elements){
    elements.forEach(e=>{my.append(e,my.append(`div`,dad,''))})
}
/*观察video*/
function observeVideo(video,init){
    const targetNode = video,
          config = {
              attributes: true,
              attributeFilter: ["src"],
              childList: false,
              subtree: false
          },
          // 观察到变动时执行回调
          callback = function(mutations, observer) {
              for(let mutation of mutations) {
                  if (mutation.type == 'attributes') {// 触发换源:清晰度改变/下一个视频/网络波动
                      //换源前半:video标签丢失,mutation.target.src由实变为''
                      //换源后半:video标签不丢失,mutation.target.src由''变为实
                      if(mutation.target.src){// console.log('触发换源了')
                          observer.disconnect();
                          init();//重新初始化
                      }
                  }
              }
          },
          observer = new MutationObserver(callback);// 创建一个观察器实例并传入回调函数
    observer.observe(targetNode, config);
}