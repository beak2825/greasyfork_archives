// ==UserScript==
// @name        襄音传媒弹幕监控
// @description 2023年3月16日14:45:01
// @namespace   Violentmonkey Scripts
// @author x
// @license x
// @version 1.0.3
// @match https://live.douyin.com/*
// @include https://live.douyin.com/*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource     swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @grant GM_getResourceText
// @grant GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454967/%E8%A5%84%E9%9F%B3%E4%BC%A0%E5%AA%92%E5%BC%B9%E5%B9%95%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/454967/%E8%A5%84%E9%9F%B3%E4%BC%A0%E5%AA%92%E5%BC%B9%E5%B9%95%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

// ==============
(function() {
  'use strict';
  let util = {
      getValue(name) { return GM_getValue(name); }, setValue(name, value) { GM_setValue(name, value); },
      include(str, arr) {
          str = str.replace(/[-_]/ig, '');
          for (let i = 0, l = arr.length; i < l; i++) {
              let val = arr[i];
              if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                  return true;
              }
          }
          return false;
      },

      addStyle(id, tag, css) {
          tag = tag || 'style';
          let doc = document, styleDom = doc.getElementById(id);
          if (styleDom) return;
          let style = doc.createElement(tag);
          style.rel = 'stylesheet';
          style.id = id;
          tag === 'style' ? style.innerHTML = css : style.href = css;
          doc.head.appendChild(style);
      }
  };
  let main = {
        initValue() {
            let value = [
              { name: 'xy_jinru', value: false },
              { name: 'xy_guanzhu', value: false },
              { name: 'xy_danmu', value: true }
            ];
            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },
        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', () => {
                //alert('sd');
                let dom = `<div style="font-size: 1em;">
                <label class="instant-setting-label">弹幕消息<input type="checkbox" id="S-1" ${util.getValue('xy_danmu') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                <label class="instant-setting-label">进入消息<input type="checkbox" id="S-2" ${util.getValue('xy_jinru') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                <label class="instant-setting-label">关注消息(todo)<input type="checkbox" id="S-3" ${util.getValue('xy_guanzhu') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                </div>`;
                Swal.fire({
                    title: '消息类型过滤',
                    html: dom,
                    showCloseButton: true,
                    confirmButtonText: '保存',
                    footer: '<div style="text-align: center;font-size: 1em;"><a href="https://greasyfork.org/scripts/454967-%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%B9%95%E7%9B%91%E6%8E%A7-websocket%E6%9C%8D%E5%8A%A1/code/%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%B9%95%E7%9B%91%E6%8E%A7%20WebSocket%E6%9C%8D%E5%8A%A1.user.js">检查更新</a><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M445.956 138.812L240.916 493.9c-11.329 19.528-12.066 44.214 0 65.123 12.067 20.909 33.898 32.607 56.465 32.607h89.716v275.044c0 31.963 25.976 57.938 57.938 57.938h134.022c32.055 0 57.938-25.975 57.938-57.938V591.63h83.453c24.685 0 48.634-12.803 61.806-35.739 13.172-22.844 12.343-50.016 0-71.386l-199.42-345.693c-13.633-23.58-39.24-39.516-68.44-39.516-29.198 0-54.897 15.935-68.438 39.516z" fill="#d81e06"/></svg></div>',
                    customClass: {
                        popup: 'instant-popup',
                    },
                }).then((res) => {
                    if (res.isConfirmed) {
                        history.go(0);
                    }
                });
                document.getElementById('S-1').addEventListener('change', (e) => {
                    util.setValue('xy_danmu', e.currentTarget.checked);
                });
                document.getElementById('S-2').addEventListener('change', (e) => {
                    util.setValue('xy_jinru', e.currentTarget.checked);
                });
                document.getElementById('S-3').addEventListener('change', (e) => {
                    util.setValue('xy_guanzhu', e.currentTarget.checked);
                });
            });
        },
        addPluginStyle() {
            let style = `
                .instant-popup { font-size: 14px !important; }
                .instant-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                .instant-setting-label-col { display: flex;align-items: flex-start;;padding-top: 15px;flex-direction:column }
                .instant-setting-checkbox { width: 16px;height: 16px; }
                .instant-setting-textarea { width: 100%; margin: 14px 0 0; height: 60px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
                .instant-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
                 @keyframes instantAnminate { from { opacity: 1; } 50% { opacity: 0.4 } to { opacity: 0.9; }}
                .link-instanted { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
                .link-instanted * { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
            `;

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('instant-style', 'style', style);
            }
            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('instant-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        init() {
            this.initValue();
            this.addPluginStyle();
            this.registerMenuCommand();
        }
  };
  main.init();
  console.log('菜单已加载')

  const TIME = 1000;
  const HOST = 'ws://127.0.0.1:8765';
  // window.ws = new WebSocket('ws://127.0.0.1:8765/');
  const ws = new WebSocket(HOST);
  ws.onopen = function() { console.log('ws连接成功');ws.send("Browser start"); };
  ws.onclose = function() { console.log('ws断开连接'); };
  ws.onerror = function(){ console.log("ws连接出错"); };
  ws.onmessage = function(evt){
      console.log(evt.data)
      // console.log(document.cookie);
  }
  let barrageId = [];
  setInterval(function() {
      let webcastChatroom = document.getElementsByClassName('webcast-chatroom___items')[0];
      let barrageElements = webcastChatroom.getElementsByClassName('webcast-chatroom___item');
      let barrages = [];
      for (let barrageElementsIndex = 0; barrageElementsIndex < barrageElements.length; barrageElementsIndex++) {
          let barrageElement = barrageElements[barrageElementsIndex];

          let id = barrageElement.getAttribute('data-id');
          let type = '';

          let original = barrageElement.innerHTML;

          let nickname = '';
          let content = '';
          let originalText = original.replace(/">(\S*)<\/span><\/div><\/span>/g, '');
          originalText = originalText.replace(/<[^>]+>/g, '');
          originalText = originalText.trimStart().trimEnd();
          if (originalText.indexOf('欢迎来到直播间') === -1) {
              if (barrageElement.getAttribute('style') === 'background-color: transparent;') {
                  type = '欢迎';
                  originalText = originalText.split(' ');
              } else {
                  if (originalText.indexOf('&nbsp;×&nbsp;') !== -1) {
                      continue;
                  }
                  type = '弹幕';
                  originalText = originalText.split('：');
              }
              nickname = originalText[0];
              nickname = nickname.trimStart().trimEnd();
              originalText.shift();
              content = originalText.join('');
          } else {
              type = 'system';
              nickname = '系统';
              content = originalText;
          }

      let emoticons = original.match(/alt="([^"]*)"/g);
      let emoticon = '';
      if (emoticons !== null) {
          for (let emoticonsIndex = 0; emoticonsIndex < emoticons.length; emoticonsIndex++) {
              emoticon += emoticons[emoticonsIndex].replace('alt="', '').replace('"', '');
          }
      }
      content += emoticon;
          let barrage = { 'type': type,'nickname': nickname,'content': content, };
          if (barrageId.indexOf(id) === -1) {
              barrages.push(barrage);
              barrageId.push(id);
              if (barrageId.length > 300) {
                  barrageId.splice(0, 100);
              }
          }
      }

      let barragesJson = JSON.stringify(barrages);
      if (barragesJson !== '[]') {
        if(barrages.length > 0 ){
           for(let i=0; i < barrages.length; i++){
              // console.log( barrages[i] )
              let time  = new Date();
              if(barrages[i]['type']=='弹幕' && GM_getValue('xy_danmu') == true ){
                  /*console.debug( GM_getValue('xy_jinru') );
                  console.warn('Welcome to %c 🤠 %c v0.06 ',
                   'background-color:teal;color: white;border:1px solid teal;border-radius: 4px 0 0 4px;border-left-width:0;padding:1px;margin:2px 0;font-size:1.1em',
                   'background-color:#777;color: white;border:1px solid #777;border-radius: 0 4px 4px 0;border-right-width:0;padding:1px;margin:5px 0;'); */

                 console.log(time.format("h:m:ss") + " %s %c%s%c %c%s%c" ,
                      '🔊',
                     "font-weight:bold;color:cornflowerblue",
                      barrages[i]['nickname'],
                     "color:0",

                     "font-weight:bold;color:darkorange",
                      barrages[i]['content'],
                     "font-weight:normal;color:0");
              } else if( barrages[i]['type']=='欢迎' && GM_getValue('xy_jinru') == true  ){

                     console.log( time.format("h:m:ss") + " %s %c%s%c %c%s%c" +" 进入" ,
                         '🤠',
                         "font-weight:bold;color:#e5284d",
                          barrages[i]['nickname'],
                         "color:0",
                         "",
                         '',
                         "");
              } else {
                    /* console.log("%s %c%s%c %c%s%c",
                          barrages[i]['type'],
                         "font-weight:bold;color:#e5284d",
                          barrages[i]['nickname'],
                         "color:0",
                         "",
                          barrages[i]['content'],
                         ""); */
              }
              // ws.send(barragesJson);
          }
        }else if(barrages.length > 1) {
          // console.log( "%s %s"  , barrages  , barragesJson )
        }

      }
      // filtergift();
      // filterDanmu();
  }, TIME);
})();
// ==============

  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,                 //月份
      "d+": this.getDate(),                    //日
      "h+": this.getHours(),                   //小时
      "m+": this.getMinutes(),                 //分
      "s+": this.getSeconds(),                 //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };



var lastindex=0;
function keydown(event) {
    //console.log(event.keyCode);
    if(event.keyCode == 109 || event.keyCode == 189){ // 按-或者小键盘-
        pagefullscreen();
    }
}
document.addEventListener('keydown', keydown, false);
var haspagefullscreen=0;
if (location.href.indexOf("https://www.douyin.com/follow")>-1){
    haspagefullscreen=1;
}
function pagefullscreen(){
    var is=0;
    //$(`#slidelist > div > div.swiper-wrapper > div.swiper-slide-active xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).click();
    $(`#slidelist > div > div.swiper-wrapper > div.swiper-slide-active xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).each(function(){
        haspagefullscreen=1;
        $(this).click();
        is=1;
        if (is){return}
        console.log("非推荐");
        $(`xg-controls xg-icon>div > div:nth-child(2)`).each(function(){
            if ($(this).parent().text().indexOf("网页全屏")<0)return;
            console.log("判断：",$(this).text(),"  ",$(this)[0]);
            haspagefullscreen=1;
            $(this).click();
        })
    })
}
var firstfullscreen=setInterval(function(){
    if (haspagefullscreen){
        clearInterval(firstfullscreen);
        return;
    }
    pagefullscreen();
},1000);

function filtergift(){ //过滤直播礼物
    $(`div.webcast-chatroom___item span.Q7mln_nz`).each(function(){
        if ($(this).text().indexOf("送出了")>-1){
            console.log($(this).parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
            $(this).parent().parent().parent().parent().hide();
        }
    })
}

function filterDanmu(){ //过滤直播礼物
    $(`div.webcast-chatroom___item span.JqBinbea`).each(function(){
       if ( $(this).find("span").attr("class").indexOf("webcast-chatroom___content-with-emoji-text")  >-1 ) {
         // console.log( $(this).parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " ") );
         //console.log( $(this).parent().parent().html() );
        // $(this).parent().parent().parent().parent().hide();
       }

    })
}
function addCSS(){
    let wdstyle = document.createElement('style');
    wdstyle.classList.add("optimize");
    wdstyle.innerHTML = `
div.gNyVUu_s,.OaNxZqFU img,.iRX47Q8q img{display:none!important}
.qdcce5kG .VFMR0HAe{background:#0000 !important}
.vLt8mbfQ .y8iJbHin .mMOxHVzv,.vLt8mbfQ .y8iJbHin .rrKCA47Q,div.webcast-chatroom,.BasEuG5Q ._QjzkgP3,.OaNxZqFU,.basicPlayer.xgplayer{background:#000 !important}
.Npz7CPXj,div.webcast-chatroom .webcast-chatroom___input-container .webcast-chatroom___textarea{background:#111 !important}
div.JwGiJkkI,div.xgplayer-dynamic-bg,div.umOY7cDY,div.ruqvqPsH{display:none !important}
.pgQgzInF.hqONwptG .Jf1GlewW.Ox89VrU5,.ckEyweZa.AmXnh1GR .QICHGW7r.RosH2lNv,.SxCiQ8ip.V6Va18Np .EDvjMGPs.FKQqfehj{
    height: 100% !important;
}
div.immersive-player-switch-on-hide-interaction-area,#video-info-wrap,xg-inner-controls.xg-inner-controls{opacity:0.6 !important}
.xgplayer-playswitch .xgplayer-playswitch-tab{opacity:0 !important}
div.xgplayer-playswitch-tab:hover,div.immersive-player-switch-on-hide-interaction-area:hover,#video-info-wrap:hover,xg-inner-controls.xg-inner-controls:hover{opacity:1 !important}

`
    document.body.appendChild(wdstyle);
}
addCSS();