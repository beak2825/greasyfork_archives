// ==UserScript==
// @name 在B站(Bilibili)网页版自动显示歌词
// @version 1.0.1
// @description 自动歌词显示
// @author Tian
// @namespace BilibiliMusicLRC
// @license MIT
// @match https://www.bilibili.com/video/*
// @require https://static.hdslb.com/js/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @connect ark.cn-beijing.volces.com
// @connect api.52vmy.cn
// @downloadURL https://update.greasyfork.org/scripts/547368/%E5%9C%A8B%E7%AB%99%28Bilibili%29%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E6%AD%8C%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/547368/%E5%9C%A8B%E7%AB%99%28Bilibili%29%E7%BD%91%E9%A1%B5%E7%89%88%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E6%AD%8C%E8%AF%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 存储密钥（建议通过脚本设置页面输入,不要直接硬编码）
  // 首次使用请在控制台执行：
  // GM_setValue('tencentSecretId', '你的SecretId')
  // GM_setValue('tencentSecretKey', '你的SecretKey')
  const SECRET_ID = 'AKIDToxtgHj03va2HNHzUmtnUxFMG6jAPakl';
  const SECRET_KEY = 'tYzlMlz0sfOzOgu0ufDXdVCgz62sUt54';
  const TOKEN = "";

  // API配置
  const host = "ark.cn-beijing.volces.com/api/v3/chat/completions";


  // 添加所有的DOM元素
  // 创建主要容器
  const mainBox = document.createElement('div');
  // 创建标题
  const title = document.createElement('div');
  // 创建最小化按钮
  const minimizeButton = document.createElement('button');
  // 创建关闭按钮
  const closeButton = document.createElement('button');
  // 创建调用API按钮
  const apiButton = document.createElement('button');
  // 创建输入框
  const resultInput = document.createElement('input');
  // 创建结果显示区域
  const resultBox = document.createElement('div');
  // 创建歌词显示区域
  const resultMusicLrc = document.createElement('div');


  // 常量配置
  let music_Name = [];
  let music_Msg = [];
  let music_Msg_Time = [];
  let music_Chapter = [];
  let api_lock = false; // 防止重复请求锁

  /**
   * 初始化
   */
  function init() {
    // 关键步骤：注入 placeholder 样式（必须在输入框创建前执行，确保样式生效）
    const style = document.createElement('style');
    style.textContent = `
        .music-lyric-input::placeholder {
            color: #14ffec !important;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 添加主盒子
    mainBox.id = 'music-lyric-main-box';
    mainBox.style.position = 'fixed';
    mainBox.style.width = '300px';
    mainBox.style.minHeight = '30px';
    mainBox.style.padding = '10px 15px';
    mainBox.style.top = '10px';
    mainBox.style.left = '10px';
    mainBox.style.zIndex = '9998';
    mainBox.style.backgroundColor = 'rgb(33, 33, 33)';
    mainBox.style.display = 'flex';
    mainBox.style.flexDirection = 'column';
    mainBox.style.alignItems = 'flex-start';
    mainBox.style.borderRadius = '8px';
    mainBox.style.fontSize = '14px';
    mainBox.style.lineHeight = '1.5';
    // 按住拖动
    mainBox.style.cursor = 'move';
    mainBox.onmousedown = function (event) {
      const shiftX = event.clientX - mainBox.getBoundingClientRect().left
      const shiftY = event.clientY - mainBox.getBoundingClientRect().top
      function moveAt(pageX, pageY) {
        mainBox.style.left = pageX - shiftX + 'px'
        mainBox.style.top = pageY - shiftY + 'px'
      }
      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY)
      }
      document.addEventListener('mousemove', onMouseMove)
      mainBox.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove)
        mainBox.onmouseup = null
      }
      mainBox.ondragstart = function () {
        return false
      }
    }
    document.body.appendChild(mainBox);

    // 添加标题
    title.textContent = '歌词助手';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    title.style.color = '#14ffec';
    title.style.position = 'absolute';
    title.style.top = '15px';
    title.style.left = '15px';
    title.style.userSelect = 'none';
    mainBox.appendChild(title);

    // 添加最小化
    minimizeButton.id = 'minimize-button';
    minimizeButton.textContent = '-';
    minimizeButton.style.position = 'absolute';
    minimizeButton.style.top = '10px';
    minimizeButton.style.right = '40px';
    minimizeButton.style.zIndex = '9999';
    minimizeButton.style.padding = '5px 10px';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.border = 'none';
    minimizeButton.style.borderRadius = '5px';
    minimizeButton.style.backgroundColor = '#323232';
    minimizeButton.style.color = '#14ffec';
    minimizeButton.addEventListener('click', () => {
      apiButton.style.display = apiButton.style.display === 'none' ? 'block' : 'none';
      resultInput.style.display = resultInput.style.display === 'none' ? 'block' : 'none';
      resultBox.style.display = resultBox.style.display === 'none' ? 'block' : 'none';
      minimizeButton.textContent = minimizeButton.textContent === '-' ? '+' : '-';
    });
    mainBox.appendChild(minimizeButton);

    // 添加关闭
    closeButton.id = 'close-button';
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.zIndex = '9999';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.backgroundColor = '#323232';
    closeButton.style.color = '#14ffec';
    closeButton.addEventListener('click', () => {
      mainBox.remove();
    });
    mainBox.appendChild(closeButton);

    // 也可以添加一个按钮,点击时调用API
    apiButton.id = 'call-nlp-api-button';
    apiButton.textContent = '重新查找歌词!';
    apiButton.style.padding = '10px 15px';
    apiButton.style.zIndex = '9998';
    apiButton.style.cursor = 'pointer';
    apiButton.style.border = 'none';
    apiButton.style.borderRadius = '5px';
    apiButton.style.backgroundColor = '#323232';
    apiButton.style.color = '#14ffec';
    apiButton.style.marginBottom = '10px';
    apiButton.style.marginTop = '40px';
    apiButton.addEventListener('click', callNlpApi);
    mainBox.appendChild(apiButton);

    // 输入框
    resultInput.type = 'text';
    resultInput.placeholder = '输入歌名获取歌词';
    resultInput.disabled = false;
    resultInput.readOnly = false;
    resultInput.autocomplete = 'off'; // 避免自动填充干扰
    // 添加input样式
    resultInput.className = 'music-lyric-input';
    resultInput.style.width = '150px';
    resultInput.style.padding = '5px';
    resultInput.style.paddingLeft = '13px'; // 确保placeholder有内边距
    resultInput.style.borderRadius = '5px';
    resultInput.style.border = '1px solid #323232'; // 原代码border: none可能导致视觉上不可见
    resultInput.style.boxSizing = 'border-box';
    resultInput.style.fontSize = '14px';
    resultInput.style.outline = 'none'; // 可选：去除聚焦边框
    resultInput.style.zIndex = '9999'; // 确保在最上层，避免被遮挡
    resultInput.style.backgroundColor = '#323232';
    resultInput.style.color = '#14ffec';
    resultInput.style.marginBottom = '10px';
    resultInput.addEventListener('keydown', (e) => {
      e.stopPropagation(); // 阻止事件冒泡到页面
    });
    resultInput.addEventListener('input', (e) => {
      e.stopPropagation();
    });
    resultInput.addEventListener('blur', (e) => {
      getMusic(e.target.value);
      e.stopPropagation();
    });
    mainBox.appendChild(resultInput);

    // 结果显示区域
    resultBox.className = 'music-lyric-result-box';
    resultBox.style.padding = '10px 15px';
    resultBox.style.backgroundColor = '#323232';
    resultBox.style.color = '#14ffec';
    resultBox.style.zIndex = '9999';
    resultBox.style.maxWidth = '300px';
    resultBox.style.maxHeight = '400px';
    resultBox.style.overflowY = 'auto';
    resultBox.style.borderRadius = '8px';
    resultBox.style.fontSize = '14px';
    resultBox.style.lineHeight = '1.5';
    resultBox.style.marginBottom = '10px';
    resultBox.style.fontWeight = '300';
    resultBox.innerHTML = `
    <strong>识别到的歌词/作品:</strong>
    <br>
    <div class="box_item"></div>
    `;
    mainBox.appendChild(resultBox);
  }

  /**
   * 发起API请求
   */
  async function callNlpApi() {
    if (api_lock) {
      return; // 如果锁定,则不执行
    }
    api_lock = true; // 上锁
    resetConstants();
    const box_item = document.querySelector('.box_item');
    if (box_item) {
      box_item.innerHTML = '识别中...';
    }
    try {
      const sampleText = $('.video-title').text();
      music_Chapter = [];
      let tempChapter = document.querySelectorAll('.bpx-player-ctrl-viewpoint-menu-item-content');
      for (let i = 0; i < tempChapter.length; i++) {
        music_Chapter.push(tempChapter[i].textContent);
      }
      console.log(music_Chapter);
      const payload = JSON.stringify({
        "model": "doubao-1-5-thinking-pro-250415",
        "messages": [
          { "role": "system", "content": "你是人工智能助手." },
          { "role": "user", "content": `请从以下文本中识别出歌词和作品名称,文本内容为：${sampleText + music_Chapter.join(',')}。只需要返回歌词和作品名称即可,用英文逗号分割,不需要其他多余的描述。如果没有识别出歌词或作品,请返回“ ”。` }
        ]
      });
      // 使用GM_xmlhttpRequest发送请求（避免跨域问题）
      GM_xmlhttpRequest({
        method: 'POST',
        url: `https://${host}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 628cbe0e-210d-46e0-bd89-cee9ff9957e0`
        },
        data: payload,
        onload: function (response) {
          console.log("API响应:", JSON.parse(response.responseText));
          // 可以在这里处理返回结果,例如显示在页面上
          box_item.innerHTML = '';
          api_lock = false; // 解锁
          showResult(JSON.parse(response.responseText).choices[0].message.content);
        },
        onerror: function (error) {
          api_lock = false; // 解锁
          box_item.innerHTML = '请求出错,请稍后再试.';
        }
      });

    } catch (error) {
      console.error("调用API时出错:", error);
    }
  }

  /**
   * 获取歌曲
   */
  async function getMusic(musicName) {
    if (api_lock) {
      return; // 如果锁定,则不执行
    }
    api_lock = true; // 上锁
    if (document.querySelector('.music-lyric-result-lrc')) {
      document.querySelector('.music-lyric-result-lrc').remove();
    }
    try {
      // 使用GM_xmlhttpRequest发送请求（避免跨域问题）
      GM_xmlhttpRequest({
        url: 'https://api.52vmy.cn/api/music/lrc?msg=' + encodeURIComponent(musicName) + '&n=1',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        onload: function (response) {
          // 处理数据 正则删除[00:00.35]
          const cleanedLyric = response.responseText.replace(/\[.*?\]/g, '');
          // 提取歌词
          music_Msg = cleanedLyric
            .split(/[\r\n]+/)  // 按任意换行符拆分（兼容所有系统）
            .filter(line => line.trim() !== '');  // 过滤空行/纯空白行
          // 提取时间
          music_Msg_Time = (response.responseText.match(/\[(\d{2}:\d{2}\.\d{2})\]/g) || []).map(t => t.replace(/[\[\]]/g, ''));
          console.log(music_Msg_Time);
          resultMusicLrc.className = 'music-lyric-result-lrc';
          resultMusicLrc.style.position = 'fixed';
          resultMusicLrc.style.top = '80px';
          resultMusicLrc.style.right = '10px';
          resultMusicLrc.style.padding = '10px 15px';
          resultMusicLrc.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          resultMusicLrc.style.color = '#fff';
          resultMusicLrc.style.zIndex = '9999';
          resultMusicLrc.style.maxWidth = '200px';
          resultMusicLrc.style.maxHeight = '300px';
          resultMusicLrc.style.overflowY = 'auto';
          resultMusicLrc.style.borderRadius = '8px';
          resultMusicLrc.style.fontSize = '14px';
          resultMusicLrc.style.lineHeight = '1.5';
          // 隐藏滑动条
          resultMusicLrc.style.scrollbarWidth = 'none'; // Firefox
          resultMusicLrc.style.msOverflowStyle = 'none'; // IE 10+
          // 按住拖动
          resultMusicLrc.style.cursor = 'move';
          resultMusicLrc.onmousedown = function (event) {
            const shiftX = event.clientX - resultMusicLrc.getBoundingClientRect().left
            const shiftY = event.clientY - resultMusicLrc.getBoundingClientRect().top
            function moveAt(pageX, pageY) {
              resultMusicLrc.style.left = pageX - shiftX + 'px'
              resultMusicLrc.style.top = pageY - shiftY + 'px'
            }
            function onMouseMove(event) {
              moveAt(event.pageX, event.pageY)
            }
            document.addEventListener('mousemove', onMouseMove)
            resultMusicLrc.onmouseup = function () {
              document.removeEventListener('mousemove', onMouseMove)
              resultMusicLrc.onmouseup = null
            }
            resultMusicLrc.ondragstart = function () {
              return false
            }

          }
          document.body.appendChild(resultMusicLrc);
          for (let i = 0; i < music_Msg.length; i++) {
            // 创建歌词行元素
            const lineDiv = document.createElement('div');
            lineDiv.textContent = music_Msg[i];
            lineDiv.style.padding = '5px';
            lineDiv.style.fontSize = '16px';
            resultMusicLrc.appendChild(lineDiv);
          }
          apiButton.style.display = apiButton.style.display === 'none' ? 'block' : 'none';
          resultInput.style.display = resultInput.style.display === 'none' ? 'block' : 'none';
          resultBox.style.display = resultBox.style.display === 'none' ? 'block' : 'none';
          minimizeButton.textContent = minimizeButton.textContent === '-' ? '+' : '-';
          scrollLyric();
          api_lock = false; // 解锁
        },
        onerror: function (error) {
          console.error("API请求错误:", error);
          api_lock = false; // 解锁
        }
      });

    } catch (error) {
      console.error("调用API时出错:", error);
      api_lock = false; // 解锁
    }
  }

  /**
   * 在页面上显示结果
   * @param {object} result API返回的结果
   */
  function showResult(result) {
    const resultBoxItem = document.querySelector('.box_item');
    // 先处理数据 按照,分割
    music_Name = result.split(',');
    // 去重
    music_Name = Array.from(new Set(music_Name));
    // 去除空格
    music_Name = music_Name.map(name => name.trim()).filter(name => name !== '');
    // 显示在页面上
    resultBoxItem.innerHTML = '';
    for (let i = 0; i < music_Name.length; i++) {
      const resultNameItem = document.createElement('div');
      resultNameItem.style.display = 'inline-block';
      resultNameItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      resultNameItem.style.padding = '5px 10px';
      resultNameItem.style.borderRadius = '5px';
      resultNameItem.style.margin = '2px 5px 2px 0';
      resultNameItem.style.userSelect = 'none';
      resultNameItem.style.cursor = 'pointer';
      resultNameItem.innerHTML = music_Name[i];
      resultNameItem.addEventListener('click', function () {
        getMusic(music_Name[i]);
      });
      resultBoxItem.appendChild(resultNameItem);
    }
    if (music_Name.length === 0) {
      resultBoxItem.innerHTML = '未识别到歌词或作品';
    }
  }

  /**
   * 歌词滚动
   */
  function scrollLyric() {
    // 时间格式为 mm:ss.xx 转换为毫秒
    function timeToSeconds(time) {
      const parts = time.split(':');
      const minutes = parseInt(parts[0], 10);
      const seconds = parseFloat(parts[1]);
      return (minutes * 60 + seconds) * 1000;
    }
    // 转换所有时间为毫秒
    music_Msg_Time = music_Msg_Time.map(timeToSeconds);
    // 到达时间后滚动到对应位置,打印对应歌词
    const interval = setInterval(() => {
      const currentTime = document.querySelector('video').currentTime * 1000; // 当前时间 毫秒
      for (let i = 0; i < music_Msg_Time.length; i++) {
        // 提前5毫秒
        if (currentTime >= (music_Msg_Time[i] - 5) && currentTime < ((music_Msg_Time[i + 1] || Infinity) - 5)) {
          // 滚动到对应位置
          const lines = resultMusicLrc.querySelectorAll('div');
          if (lines[i]) {
            lines[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 高亮当前行
            lines[i].style.color = '#ff0';
            // 取消上一个高亮
            if (i > 0 && lines[i - 1]) {
              lines[i - 1].style.color = '#fff';
            }
          }
          break;
        }
      }
    }, 100);
  }

  /**
   * 重置常量
   */
  function resetConstants() {
    music_Name = [];
    const resultBoxItem = document.querySelector('.box_item');
    if (resultBoxItem) {
      resultBoxItem.innerHTML = '';
    }
  }

  // 页面加载完成后执行
  $(document).ready(function () {
    init();
  });

})();
