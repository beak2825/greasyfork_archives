// ==UserScript==
// @name         删除B站视频窗口自选功能区（增强版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  设置面板可删除B站视频窗口功能区面板（播放/暂停，进度条，章节点，弹幕区，弹幕发送区，无损音质，清晰度，选集，倍速，字幕，音量，设置，画中画，宽屏，网页全屏，全屏，视频推荐区），可调整B站视频默认音量，可锁定B站视频清晰度画质
// @author       MENGbb
// @match         *://www.bilibili.com/video/av*
// @match         *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/festival/*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503630/%E5%88%A0%E9%99%A4B%E7%AB%99%E8%A7%86%E9%A2%91%E7%AA%97%E5%8F%A3%E8%87%AA%E9%80%89%E5%8A%9F%E8%83%BD%E5%8C%BA%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503630/%E5%88%A0%E9%99%A4B%E7%AB%99%E8%A7%86%E9%A2%91%E7%AA%97%E5%8F%A3%E8%87%AA%E9%80%89%E5%8A%9F%E8%83%BD%E5%8C%BA%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    checkThePage();
    //检测代码是否已动态渲染
    function checkThePage() {
        if(document.getElementsByClassName("bpx-player-control-bottom-left")[0] && document.getElementsByClassName("bpx-player-control-bottom-left")[0].childElementCount>=2
           && document.getElementsByClassName("bpx-player-control-bottom-right")[0] && document.getElementsByClassName("bpx-player-control-bottom-right")[0].childElementCount>=8){
            //默认播放音量
            if(GM_getValue('integerVolume', -1)>=0){
                document.querySelector('video').volume = GM_getValue('integerVolume', -1)/100
            }
            // 锁定清晰度
            setQualityLock();
            //删除标签
            deleteDiv();
        }else{
            //每过多少毫秒判断一次是否进入此页面，进入页面后执行脚本
            setTimeout(checkThePage,GM_getValue('integerPolling', 100));
        }
    }
        // 清晰度锁定
    function setQualityLock() {
        var choice = GM_getValue('qualityLock', '取消锁定');
        if(choice === '取消锁定') return;
        var items = document.getElementsByClassName("bpx-player-ctrl-quality-menu-item");
        for(var i=0; i<items.length; i++){
            var txt = items[i].innerText;
            if((choice==='4K' && txt.includes('4K')) ||
               (choice==='1080P 60帧' && txt.includes('60帧')) ||
               (choice==='1080P 60帧' && txt.includes('高码率')) ||
               (choice==='1080P' && txt.includes('1080P 高清')) ||
               (choice==='720P' && txt.includes('720P')) ||
               (choice==='480P' && txt.includes('480P')) ||
               (choice==='360P' && txt.includes('360P')) ||
               (choice==='自动' && txt.includes('自动'))) {
                items[i].click();
                break;
            }
        }
    }

    //删除标签
    function deleteDiv(){
        //上一个
        //GM_getValue('prev', false) && document.getElementsByClassName("bpx-player-ctrl-prev")[0] && (document.getElementsByClassName("bpx-player-ctrl-prev")[0].outerHTML = '<div></div>');
        //播放/暂停
        GM_getValue('play', false) && document.getElementsByClassName("bpx-player-ctrl-play")[0] && (document.getElementsByClassName("bpx-player-ctrl-play")[0].outerHTML = '<div></div>');
        //下一个
        //GM_getValue('next', false) && document.getElementsByClassName("bpx-player-ctrl-next")[0] && (document.getElementsByClassName("bpx-player-ctrl-next")[0].outerHTML = '<div></div>');
        //进度条
        GM_getValue('time', false) && document.getElementsByClassName("bpx-player-ctrl-time")[0] && (document.getElementsByClassName("bpx-player-ctrl-time")[0].outerHTML = '<div></div>');
        //章节点
        GM_getValue('viewpoint', false) && document.getElementsByClassName("bpx-player-ctrl-viewpoint")[0] && (document.getElementsByClassName("bpx-player-ctrl-viewpoint")[0].outerHTML = '<div></div>');
        //弹幕区
        GM_getValue('center', false) && document.getElementsByClassName("bpx-player-control-bottom-center")[0] && (document.getElementsByClassName("bpx-player-control-bottom-center")[0].outerHTML = '<div></div>');
        //弹幕发送区
        GM_getValue('inputbar', false) && document.getElementsByClassName("bpx-player-video-inputbar")[0] && (document.getElementsByClassName("bpx-player-video-inputbar")[0].outerHTML = '<div></div>');
        //无损音质
        GM_getValue('flac', false) && document.getElementsByClassName("bpx-player-ctrl-flac")[0] && (document.getElementsByClassName("bpx-player-ctrl-flac")[0].outerHTML = '<div></div>');
        //清晰度
        GM_getValue('quality', false) && document.getElementsByClassName("bpx-player-ctrl-quality")[0] && (document.getElementsByClassName("bpx-player-ctrl-quality")[0].outerHTML = '<div></div>');
        //选集
        GM_getValue('eplist', false) && document.getElementsByClassName("bpx-player-ctrl-eplist")[0] && (document.getElementsByClassName("bpx-player-ctrl-eplist")[0].outerHTML = '<div></div>');
        //倍速
        GM_getValue('playbackrate', false) && document.getElementsByClassName("bpx-player-ctrl-playbackrate")[0] && (document.getElementsByClassName("bpx-player-ctrl-playbackrate")[0].outerHTML = '<div></div>');
        //字幕
        GM_getValue('subtitle', false) && document.getElementsByClassName("bpx-player-ctrl-subtitle")[0] && (document.getElementsByClassName("bpx-player-ctrl-subtitle")[0].outerHTML = '<div></div>');
        //音量
        GM_getValue('volume', false) && document.getElementsByClassName("bpx-player-ctrl-volume")[0] && (document.getElementsByClassName("bpx-player-ctrl-volume")[0].outerHTML = '<div></div>');
        //设置
        GM_getValue('setting', false) && document.getElementsByClassName("bpx-player-ctrl-setting")[0] && (document.getElementsByClassName("bpx-player-ctrl-setting")[0].outerHTML = '<div></div>');
        //画中画
        GM_getValue('pip', false) && document.getElementsByClassName("bpx-player-ctrl-pip")[0] && (document.getElementsByClassName("bpx-player-ctrl-pip")[0].outerHTML = '<div></div>');
        //宽屏
        GM_getValue('wide', false) && document.getElementsByClassName("bpx-player-ctrl-wide")[0] && (document.getElementsByClassName("bpx-player-ctrl-wide")[0].outerHTML = '<div></div>');
        //网页全屏
        GM_getValue('web', false) && document.getElementsByClassName("bpx-player-ctrl-web")[0] && (document.getElementsByClassName("bpx-player-ctrl-web")[0].outerHTML = '<div></div>');
        //全屏
        GM_getValue('full', false) && document.getElementsByClassName("bpx-player-ctrl-full")[0] && (document.getElementsByClassName("bpx-player-ctrl-full")[0].outerHTML = '<div></div>');
        //视频推荐区
        GM_getValue('panel', false) && document.getElementsByClassName("bpx-player-ending-panel")[0] && (document.getElementsByClassName("bpx-player-ending-panel")[0].outerHTML = '<div class="bpx-player-ending-panel" data-option="1"><div class="bpx-player-ending"></div></div>') &&
        //删掉视频推荐板块后需要保持点击重播的功能
        document.getElementsByClassName("bpx-player-ending-panel")[0].addEventListener("click", function() {document.getElementsByClassName("bpx-player-ctrl-play")[0].click();});
    }
    // 创建设置面板的HTML
    const settingsPanelHTML = `
  <div id="settingsPanel" style="display:none; position:fixed; top:5%; left:50%; transform:translateX(-50%); background:white; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.5); padding:20px; z-index:10000; width:300px;">
    <h3 style="text-align:center; margin-bottom:20px;">选择屏蔽的功能</h3>
    <div style="column-count: 2; column-gap: 20px;">
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="play">
			<span class="slider round"></span>
		  </label>
		  播放/暂停
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="time">
			<span class="slider round"></span>
		  </label>
		  进度条
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="viewpoint">
			<span class="slider round"></span>
		  </label>
		  章节点
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="center">
			<span class="slider round"></span>
		  </label>
		   弹幕区
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="inputbar">
			<span class="slider round"></span>
		  </label>
		   弹幕发送区
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="flac">
			<span class="slider round"></span>
		  </label>
		   无损音质
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="quality">
			<span class="slider round"></span>
		  </label>
		  清晰度
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="eplist">
			<span class="slider round"></span>
		  </label>
		   选集
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="playbackrate">
			<span class="slider round"></span>
		  </label>
		   倍速
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="subtitle">
			<span class="slider round"></span>
		  </label>
		  字幕
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="volume">
			<span class="slider round"></span>
		  </label>
		   音量
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="setting">
			<span class="slider round"></span>
		  </label>
		  设置
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="pip">
			<span class="slider round"></span>
		  </label>
		   画中画
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="wide">
			<span class="slider round"></span>
		  </label>
		  宽屏
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="web">
			<span class="slider round"></span>
		  </label>
		   网页全屏
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="full">
			<span class="slider round"></span>
		  </label>
		   全屏
		</label>
		<label style="display:block; margin-bottom:10px;">
		  <label class="switch">
			<input type="checkbox" id="panel">
			<span class="slider round"></span>
		  </label>
		  视频推荐区
		</label>
	</div>
    <div>
      <label style="font-weight:bold;">清晰度锁定：</label>
      <div>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="4K"> 4K
        </label>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="1080P 60帧"> 1080P 60帧
        </label>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="1080P"> 1080P
        </label>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="720P"> 720P
        </label>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="480P"> 480P
       </label>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="360P"> 360P
        </label>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="自动"> 自动
        </label>
        <label style="margin-right:10px;white-space:nowrap;">
          <input type="radio" name="qualityLock" value="取消锁定"> 取消锁定
        </label>
      </div>
    </div>
    <label style="display:block; margin-bottom:20px;">
      <span>设置默认音量(-1为关闭)</span>
      <div style="display: flex; align-items: center;">
        <input type="range" id="integerVolume" min="-1" max="100" style="width: 100%; padding: 5px; ">
        <span id="volumeRangeValue">-1</span>
      </div>
    </label>
    <label style="display:block; margin-bottom:20px;">
      <span>设置脚本轮询频率，根据个人喜好调整（单位：毫秒）</span>
      <div style="display: flex; align-items: center;">
        <input type="range" id="integerPolling" min="1" max="5000" style="width: 100%; padding: 5px; ">
        <span id="pollingRangeValue">100</span>
      </div>
    </label>
    <button id="closeSettings" style="display:block; margin:0 auto; padding:5px 10px; border:none; background:#007BFF; color:white; border-radius:5px; cursor:pointer;">关闭(刷新生效)</button>
  </div>
`;

    // 将设置面板添加到页面
    document.body.insertAdjacentHTML('beforeend', settingsPanelHTML);

    // 添加菜单命令
    GM_registerMenuCommand('功能区设置面板', () => {
        document.getElementById('settingsPanel').style.display = 'block';
    });

    // 关闭按钮事件
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsPanel').style.display = 'none';
    });


    // 获取所有的复选框元素
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // 遍历每个复选框
    checkboxes.forEach(checkbox => {
        // 获取复选框的id
        const id = checkbox.id;
        // 从Tampermonkey存储中获取对应的值，默认值为false
        const value = GM_getValue(id, false);
        // 设置复选框的状态
        checkbox.checked = value;
    });

    // 监听复选框状态变化并保存到Tampermonkey存储中
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            GM_setValue(checkbox.id, checkbox.checked);
        });
    });

    // ————— 新增：清晰度锁定 单选框 初始化与保存 —————
    const radios = document.querySelectorAll('input[name="qualityLock"]');
    radios.forEach(radio => {
        const val = radio.value;
        radio.checked = (val === GM_getValue('qualityLock', '取消锁定'));
        radio.addEventListener('change', () => {
            if (radio.checked) {
                GM_setValue('qualityLock', val);
            }
        });
    });

    // 获取整数输入框元素
    const integerVolume = document.getElementById('integerVolume');
    const volumeRangeValue = document.getElementById('volumeRangeValue');

    const integerPolling = document.getElementById('integerPolling');
    const pollingRangeValue = document.getElementById('pollingRangeValue');

    // 从Tampermonkey存储中获取整数值
    integerVolume.value = GM_getValue('integerVolume', -1);
    volumeRangeValue.textContent = GM_getValue('integerVolume', -1);

    integerPolling.value = GM_getValue('integerPolling', 100);
    pollingRangeValue.textContent = GM_getValue('integerPolling', 100);

    // 监听整数输入框变化并保存到Tampermonkey存储中
    integerVolume.addEventListener('input', () => {
        const value = integerVolume.value;
        volumeRangeValue.textContent = value;
        GM_setValue('integerVolume', value);
    });

    integerPolling.addEventListener('input', () => {
        const value = integerPolling.value;
        pollingRangeValue.textContent = value;
        GM_setValue('integerPolling', value);
    });



// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
  .switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:checked + .slider:before {
    transform: translateX(14px);
  }
`;
document.head.append(style);



})();