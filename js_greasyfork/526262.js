// ==UserScript==
// @name        RTL布局bilibili.com
// @note
// @note        仅在自己pc上测试
// @note
// @description 对Bilibili的视频播放页面改成从右到左布局方式，解决长时间小窗看视频导致头轻微向左边偏转的问题。记忆播放窗口宽屏设置，自动启用宽屏模式。
// @match       https://bilibili.com/
// @match       https://www.bilibili.com/
// @match       https://*bilibili.com/*play/*
// @match       https://*bilibili.com/list/*
// @match       https://*bilibili.com/video/*
// @icon        https://www.bilibili.com/favicon.ico
// @version     25.02.10
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_unregisterMenuCommand
// @namespace   https://space.bilibili.com/474516472?spm_id_from=namespace
// @author      https://space.bilibili.com/474516472?spm_id_from=author
// @supportURL  https://space.bilibili.com/474516472?spm_id_from=supportURL
// @homepageURL https://space.bilibili.com/474516472?spm_id_from=homepageURL
// @require     https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license     MIT
//
// @downloadURL https://update.greasyfork.org/scripts/526262/RTL%E5%B8%83%E5%B1%80bilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/526262/RTL%E5%B8%83%E5%B1%80bilibilicom.meta.js
// ==/UserScript==
(function() {
  $(function() {
    console.log('run RTL')
    /*
     *
     */
    const wideCtl = ({
      checkedName = "✅ 自动开启宽屏模式",
      uncheckedName = "❌ 自动取消宽屏模式",
      initValue = false
    })=>{
      let checked = initValue
      const currentName = () => checked ? checkedName : uncheckedName;
      const register = () => {
        GM_registerMenuCommand(currentName(), () => { onChange(!checked); });
      };
      let onChange = (checked2) => {
        ctl.checked = checked2;
      };
      const ctl = {
        get onChange() { return onChange; },
        set onChange(newFn) { onChange = newFn; },
        get checked() { return checked; },
        set checked(newValue) {
          if (newValue == checked) return;
          GM_unregisterMenuCommand(currentName());
          checked = newValue;
          GM_setValue('widemode', newValue);
          register();
        },
      };
      register();
      return ctl;
    }
    const widectl = wideCtl({initValue: GM_getValue('widemode', false)})
    const url = document.URL.toLowerCase()
    const rtlcss = {open: [], close: {
      ".video-container-v1": {'display': '', 'flex-direction': ""},
      '.right-container': {'margin-left': '', 'margin-right': ""},
      ".playlist-container": {'display': '', 'flex-direction': ""},
      '.playlist-container--right': {'margin-left': '', 'margin-right': ""},
      ".plp-r.sticky": {'left': ''},
      "#bilibili-player-wrap": {'padding-right': '', 'padding-left': ''},
      '.player-left-components': {'padding-right': '', 'padding-left': ''}
    }}
    if(url.indexOf('play/') > -1){
      rtlcss.open = {
        ".plp-r.sticky": {'left': '0'},
        "#bilibili-player-wrap": {'padding-right': '0', 'padding-left': 'calc(var(--right-bar-width) + 30px)'},
        '.player-left-components': {'padding-right': '0', 'padding-left': 'calc(var(--right-bar-width) + 30px)'}
      }
    }else if(url.indexOf('list/') > -1){
      rtlcss.open = {
        ".playlist-container": {'display': 'flex', 'flex-direction': "row-reverse"},
        '.playlist-container--right': {'margin-left': '0', 'margin-right': "30px"}
      }
    }else if(url.indexOf('video/') > -1){
      rtlcss.open = {
        ".video-container-v1": {'display': 'flex', 'flex-direction': "row-reverse"},
        '.right-container': {'margin-left': '0', 'margin-right': "30px"}
      }
    }
    const rtlctl = (status)=>{ for(const item in rtlcss[status]) $(item).css(rtlcss[status][item]) }
    const widebtn = ()=> {
      rtlctl(widectl.checked == true ? 'close' : "open")
      $('.bpx-player-ctrl-wide').click()
    }
    // 处理宽屏模式
    const observer = new MutationObserver(function (mutationsList, observer) {
      if($('.bpx-player-control-entity').length > 0 && $('.bpx-player-control-entity').css('display') == 'none') return ;
      if($('.bpx-player-ctrl-wide').hasClass('bpx-state-entered')){
        // 宽屏模式
        widectl.checked = true
      }else{
        // 标准窗口
        widectl.checked = false
      }
      rtlctl(widectl.checked == true ? 'close' : "open")
    });
    if(widectl.checked != true) rtlctl('open')
    const _ = setInterval(()=>{
      if($('.bpx-player-ctrl-wide').length > 0){
        clearInterval(_)
        observer.observe($('.bpx-player-ctrl-wide').get(0), { attributes: true });
        console.log('ready')
        if($('.bpx-player-ctrl-wide').hasClass("bpx-state-entered")){
          if(widectl.checked != true) widebtn()
        }else{
          if(widectl.checked == true) widebtn()
        }
        widectl.onChange = (newValue)=> {
          widectl.checked = newValue; widebtn()
        }
        GM_registerMenuCommand("已恢复上次的设置。如有问题可把视频页面分享给我", () => {
          if(confirm("如有问题可把视频页面分享发给我，点击确定继续报错")) window.open('https://space.bilibili.com/474516472', '_blank');
        });
      }
    }, 100)
  })
})()