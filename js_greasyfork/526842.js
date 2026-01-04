// ==UserScript==
// @name         daemon插件测试版
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  在右上角添加按钮并点击发布
// @author       Your name
// @match        http*://*/upload.php*
// @match        http*://*/details.php*
// @match        http*://*/edit.php*
// @match        http*://*/torrents.php*
// @match        https://kp.m-team.cc/detail/*
// @match        https://*/torrents*
// @match        https://totheglory.im/t/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526842/daemon%E6%8F%92%E4%BB%B6%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526842/daemon%E6%8F%92%E4%BB%B6%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

// 在脚本开头添加样式表
const style = document.createElement('style');
style.textContent = `
/* 消息框样式 */
.daemon-msg {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 600px;
  padding: 5px;
  background: rgba(230, 247, 255, 0.8); /* 浅蓝色背景，透明度为 0.8 */
  border: 1px solid #000; /* 黑色边框 */
  border-radius: 4px;
  font: bold 14px/1.4 Arial;  /* 修改字体大小和加粗 */
  resize: none;
  overflow: auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  word-wrap: break-word; /* 允许长单词换行 */
  overflow-wrap: break-word; /* 确保内容在边框宽度时换行 */
  white-space: normal; /* 允许内容换行 */
  margin: 0; /* 减少空白部分 */
}

/* 失败/错误样式 */
.daemon-msg-fail {
  color: red;                 /* 新增字体颜色设置 */
}

/* 列表项样式 */
.list-item {
  margin-bottom: 10px;
}

.list-item h3 {
  font-size: 14px;
  margin: 0 0 5px;
}

.list-item p {
  margin: 0;
}

/* 表格样式 */
.daemon-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  color: #000;

}

.daemon-table th,
.daemon-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 12px;
  vertical-align: top;
  color: #000 !important; /* 新增强制黑色字体 */

}

.daemon-table th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
}

.daemon-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.daemon-table tr:hover {
  background-color: #e9ecef;
}

/* 覆盖可能影响文字颜色的行样式 */
.daemon-table tr:nth-child(even),
.daemon-table tr:hover {
  color: inherit !important;
}

.status-flag {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8em;
}

.true-flag {
  background-color: #d4edda;
  color: #155724;
}

.false-flag {
  background-color: #f8d7da;
  color: #721c24;
}
`;
// 在样式表中添加新样式
style.textContent += `
/* 容器标题栏 */
.list-header {
  position: relative;
  padding: 8px 30px 8px 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

/* 折叠按钮 */
.toggle-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 3px;
  transition: 0.2s;
}

.toggle-btn:hover {
  background: rgba(0,0,0,0.1);
}

/* 内容区域过渡动画 */
.list-content {
  max-height: 500px;
  overflow: auto;
  transition: max-height 0.3s ease-out;
}

.list-content.collapsed {
  max-height: 0;
  overflow: hidden;
}
`;
// 在样式表中添加新样式
style.textContent += `
.daemon-list {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 1000px;
  max-height: 80vh;
  background: white;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  z-index: 10000;
  transition: all 0.3s ease;
  display: none; /* 默认隐藏 */
}

.daemon-list.visible {
  display: block;
}

.close-btn {
  position: absolute;
  right: 15px;
  top: 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.close-btn:hover {
  background: #bb2d3b;
  transform: scale(1.1);
}
`;
// 在样式表中添加删除按钮样式
style.textContent += `
.delete-btn {
  padding: 4px 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 12px;
}

.delete-btn:hover {
  background: #bb2d3b;
  transform: scale(1.05);
}

.loading {
  position: relative;
  pointer-events: none;
  opacity: 0.7;
}

.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
`;
style.textContent += `
/* 按钮容器样式 */
#daemon-btn-container {
    position: fixed;
    right: 20px;
    top: 250px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: move;
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}

/* 单个按钮样式 */
.daemon-btn {
    padding: 12px 20px;
    background: linear-gradient(145deg, #e3f2fd, #bbdefb);
    color: #1976d2;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font: bold 14px 'Microsoft YaHei';
    box-shadow: 0 2px 4px rgba(25,118,210,0.2);
    transition: all 0.2s ease;
    position: relative;
}

/* 按钮悬停效果 */
.daemon-btn:hover {
    background: linear-gradient(145deg, #bbdefb, #90caf9);
    box-shadow: 0 4px 8px rgba(25,118,210,0.3);
    transform: translateY(-2px);
}

/* 拖拽手柄样式 */
.drag-handle {
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 24px;
    opacity: 0.5;
    cursor: move;
    background:
        linear-gradient(to bottom,
            #666 20%,
            transparent 20%,
            transparent 40%,
            #666 40%,
            #666 60%,
            transparent 60%,
            transparent 80%,
            #666 80%
        );
}
`;
// 在样式表中添加边界限制提示
style.textContent += `
#daemon-btn-container.boundary-hit {
  animation: boundary-shake 0.4s ease;
}

@keyframes boundary-shake {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(-5px, 0); }
  40% { transform: translate(5px, 0); }
  60% { transform: translate(-3px, 0); }
  80% { transform: translate(3px, 0); }
}
`;


// 初始化配置
const { apidomain: configDomain, apikey: configKey } = loadConfig();
let apidomain = configDomain;
let apikey = configKey;

// daemon接口配置
var apiurl = '';
var fileapiurl = '';
var deployapiurl = '';
var listapiurl = '';
var deleteapiurl = '';

// 更新API地址的函数
function updateApiUrls() {
    apiurl = `${apidomain}/add_torrent`;
    fileapiurl = `${apidomain}/upload`;
    deployapiurl = `${apidomain}/force_deploy`;
    listapiurl = `${apidomain}/getTorrentList`;
    deleteapiurl = `${apidomain}/del_torrent`;
}
updateApiUrls();
const container = createListContainer();

var atBottom = false;
// 页面加载完成后执行
var site_url = decodeURI(window.location.href);

/* 种子处理核心 */
async function handleSeedUpload(file) {
    const form = new FormData();
    form.append('file', file);
    uploadTorrentDaemon(form);
}
// 配置管理部分
function loadConfig() {
    const defaultDomain = 'https://xx.xx.xx:8443';
    const defaultKey = 'defaultKey';

    // 从存储加载或使用默认值
    let saved = GM_getValue('daemon_config', '');
    if (saved.includes('|')) {
        const [domain, key] = saved.split('|');
        return {
            apidomain: domain || defaultDomain,
            apikey: key || defaultKey
        };
    }
    return { apidomain: defaultDomain, apikey: defaultKey };
}

function saveConfig(domain, key) {
    GM_setValue('daemon_config', `${domain}|${key}`);
}

// 设置按钮处理函数
function handleSettings() {
    const input = prompt('请输入API配置（格式：后端地址|API密钥）\n例如：https://example.com|yourapikey', `${apidomain}|${apikey}`);

    if (input) {
        const parts = input.split('|');
        if (parts.length === 2) {
            apidomain = parts[0].trim();
            apikey = parts[1].trim();
            saveConfig(apidomain, apikey);
            updateApiUrls();
            addMsg('配置已保存！');
        } else {
            addMsg('输入格式错误，请使用 域名|API密钥 格式');
        }
    }
}
// ==================== 拖拽 开始 ====================
// 创建可拖拽容器
const btnContainer = document.createElement('div');
btnContainer.id = 'daemon-btn-container';

// 修改初始化位置加载部分
const savedPosition = GM_getValue('btn_position', null);
const containerRect = btnContainer.getBoundingClientRect();
const defaultPosition = { x: 20, y: 250 };

// 拖拽功能实现
let isDragging = false;
let startX, startY;
let initialX, initialY;
let dragThreshold = 5; // 触发拖拽的阈值

// 新增位置修正函数
function validatePosition(pos) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerWidth = btnContainer.offsetWidth;
    const containerHeight = btnContainer.offsetHeight;

    return {
      x: Math.min(Math.max(pos.x, 0), viewportWidth - containerWidth - 10),
      y: Math.min(Math.max(pos.y, 10), viewportHeight - containerHeight - 10)
    };
  }

  // 应用初始位置
  if (savedPosition) {
    const validPos = validatePosition(savedPosition);
    btnContainer.style.right = `${validPos.x}px`;
    btnContainer.style.top = `${validPos.y}px`;
  } else {
    btnContainer.style.right = `${defaultPosition.x}px`;
    btnContainer.style.top = `${defaultPosition.y}px`;
  }


btnContainer.addEventListener('mousedown', function(e) {
    startX = e.clientX;
    startY = e.clientY;
    initialX = parseFloat(this.style.right) || 20;
    initialY = parseFloat(this.style.top) || 250;
    isDragging = false;
});


// 修改拖拽事件处理
document.addEventListener('mousemove', function(e) {
    if (startX === undefined) return;

    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);

    if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
      isDragging = true;
      btnContainer.style.transition = 'none';
    }

    if (isDragging) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const containerRect = btnContainer.getBoundingClientRect();

      // 计算边界限制
      let newX = initialX + (startX - e.clientX);
      let newY = initialY + (e.clientY - startY);

      // X轴边界检查
      newX = Math.max(10, Math.min(newX, viewportWidth - containerRect.width - 10));

      // Y轴边界检查
      newY = Math.max(10, Math.min(newY, viewportHeight - containerRect.height - 10));

      // 应用限制后的位置
      btnContainer.style.right = `${newX}px`;
      btnContainer.style.top = `${newY}px`;

      // 边界碰撞提示
      if (newX <= 10 || newX >= viewportWidth - containerRect.width - 10) {
        btnContainer.classList.add('boundary-hit');
        setTimeout(() => btnContainer.classList.remove('boundary-hit'), 400);
      }
    }
  });

  // 添加窗口resize监听
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const currentX = parseFloat(btnContainer.style.right) || 20;
      const currentY = parseFloat(btnContainer.style.top) || 250;
      const validPos = validatePosition({x: currentX, y: currentY});

      btnContainer.style.transition = 'all 0.3s ease';
      btnContainer.style.right = `${validPos.x}px`;
      btnContainer.style.top = `${validPos.y}px`;
    }, 200);
  });

document.addEventListener('mouseup', function() {
    if (isDragging) {
        GM_setValue('btn_position', {
            x: parseFloat(btnContainer.style.right),
            y: parseFloat(btnContainer.style.top)
        });
        btnContainer.style.transition = 'all 0.3s ease';
    }
    startX = startY = undefined;
    isDragging = false;
});

// 创建带拖拽手柄的按钮
function createDragHandle() {
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    return handle;
}

// ==================== 拖拽 结束 ====================

// ==================== 只添加到最外层 start ====================
debugger;
// 获取最外层文档的body
if (window.self === window.top) {
    const rootBody = document.body;
    const rootHead = rootBody.ownerDocument.head;
    if (!rootBody.querySelector('#daemon-btn-container')) {
        rootBody.appendChild(btnContainer);
    }
    if (!rootHead.querySelector('#daemon-style')) {
        style.id = 'daemon-style';
        rootHead.appendChild(style);
    }
}

// ==================== 只添加到最外层 end ====================


// 初始化函数
function init() {
    // 等待目标元素加载完成
    waitForElement(processDownload);
}
// 等待元素出现的函数
function waitForElement(callback, maxTries = 30, interval = 1000) {
    let tries = 0;

    function check() {


        if (getUrl()) {
            callback();
            return;
        }

        tries++;
        if (tries < maxTries) {
            setTimeout(check, interval);
        }
    }

    check();
}
function getUrl() {
    if (site_url.match(/torrents\/download_check/)) {
        // 获取所有包含 "torrents/download" 的链接
        const links = document.querySelectorAll('a[href*="torrents/download"]');
        if(links){
            // 筛选包含 i 标签的链接
            const targetLink = Array.from(links).find(link => link.querySelector('i'));
            // 获取 href 属性
            return targetLink ? targetLink.getAttribute('href') : null;
        }


    } else {
        const element = document.getElementById('tDownUrl');
        if (element && element.value) {
            return element.value;
        }
    }
    return null;
}
// 主处理函数
function processDownload() {

    // 检查是否同域
    try {
        const currentDomain = new URL(window.location.href).hostname;
        const urlDomain = new URL(getUrl()).hostname;

        if (currentDomain === urlDomain) {
            // 同域直接下载
            getBlob(getUrl());
        } else {
            addMsg('请刷新界面后重试！');
        }
    } catch (error) {
        console.error('URL解析错误:', error);
    }
}

function getBlob(url) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        overrideMimeType: "text/plain; charset=x-user-defined",
        onload: (xhr) => {
            try {
                // 转换数据
                var raw = xhr.responseText;
                var bytes = new Uint8Array(raw.length);
                for (var i = 0; i < raw.length; i++) {
                    bytes[i] = raw.charCodeAt(i) & 0xff;
                }

                // 创建 Blob
                var blob = new Blob([bytes], { type: 'application/x-bittorrent' });

                // 获取文件名
                const filename = 'file.torrent';

                // 创建 FormData
                var formData = new FormData();
                formData.append('file', blob, filename);

                // 上传文件
                uploadTorrentDaemon(formData);
            } catch (error) {
                console.error('Error processing torrent:', error);
                addMsg('处理种子文件失败: ' + error.message);
            }
        },
        onerror: function (res) {
            console.error('Download failed:', res);
            addMsg('下载种子文件失败');
        }
    });
}


function uploadTorrentDaemon(formData) {
    GM_xmlhttpRequest({
        method: "POST",
        url: fileapiurl,  // 替换为实际的上传接口
        data: formData,
        headers: {
            'Authorization': 'Bearer ' + apikey  // 替换为实际的认证信息
        },
        onload: function (response) {
            try {

                var result = JSON.parse(response.responseText);
                if (result.code === 200) {
                    addMsg('推送成功：' + JSON.stringify(result));
                } else {
                    addMsg('推送失败：' + JSON.stringify(result));
                }
            } catch (error) {
                addMsg('解析响应失败: ' + error.message);
            }
        },
        onerror: function (error) {
            addMsg('上传失败: 网络错误');
        },
        onprogress: function (progress) {
            if (progress.lengthComputable) {
                var percentComplete = (progress.loaded / progress.total) * 100;
                console.log('上传进度: ' + percentComplete.toFixed(2) + '%');
            }
        }
    });
}

function doPostJson(url, data) {
    GM_xmlhttpRequest({
        method: "POST",
        url: url,
        data: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + apikey  // 替换为实际的认证信息
        },
        onload: function (response) {
            try {

                var result = JSON.parse(response.responseText);
                if (result.code === 200) {
                    addMsg('成功：' + JSON.stringify(result));
                } else {
                    addMsg('失败：' + JSON.stringify(result));
                }
            } catch (error) {
                addMsg('解析响应失败: ' + error.message);
            }
        },
        onerror: function (error) {
            addMsg('失败: 网络错误');
        }
    });
}

function doGet(url, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer ' + apikey  // 替换为实际的认证信息
        },
        onload: function (response) {
            try {
                var result = JSON.parse(response.responseText);
                if (result.code === 200) {
                    if (typeof callback === 'function') {
                        callback(JSON.parse(result.data));
                    }
                } else {
                    addMsg('失败：' + JSON.stringify(result));
                }
            } catch (error) {
                addMsg('解析响应失败: ' + error.message);
            }
        },
        onerror: function (error) {
            addMsg('失败: 网络错误');
        }
    });
}
function checkContainer() {
    if (!container){
        container = createListContainer();
    }
}
function addMsg(msg) {
    const failKeywords = ['失败', '错误', '异常'];
    let msgBox = document.getElementById('daemon-msg');

    // 如果元素不存在，则创建一个新的 textarea 元素
    if (!msgBox) {
        msgBox = document.createElement('textarea');
        msgBox.id = 'daemon-msg'; // 设置 id
        msgBox.readOnly = true; // 设置为只读
        document.body.appendChild(msgBox); // 添加到页面中
    }

    // 设置 textarea 的内容为传入的 msg 参数
    msgBox.value = msg;

    // 动态调整 textarea 的高度
    // msgBox.style.height = 'auto'; // 先设置为 auto，以便根据内容计算高度
    // msgBox.style.height = Math.min(msgBox.scrollHeight, 100) + 'px'; // 限制最大高度为 200px
    msgBox.style.height = '100px'; // 先设置为 auto，以便根据内容计算高度

    // 根据 msg 内容是否包含“成功”来设置样式
    if (failKeywords.some(keyword => msg.includes(keyword))) {
        msgBox.className = 'daemon-msg daemon-msg-fail'; // 如果包含“失败”、“重试”或“错误”，设置类名为 daemon-msg-fail
    } else {
        msgBox.className = 'daemon-msg'; // 否则，设置类名为 daemon-msg
    }
}


// 修改按钮创建方式，使用addEventListener
function addButton(idx, label, callback) {
    const btn = document.createElement('button');
    btn.className = 'daemon-btn';
    btn.textContent = label;

    // 使用事件监听替代内联事件
    btn.addEventListener('click', function(e) {
        if (!isDragging && typeof callback === 'function') {
            callback();
        }
    });

    btn.appendChild(createDragHandle());
    btnContainer.appendChild(btn);
}
// 定义获取列表并显示的函数
function fetchAndDisplayList() {
    doGet(listapiurl, refreshList);
}
// 强制刷新内容
function refreshList(data) {
    // checkContainer();
    if (container.classList.contains('visible')) {
        displayList(data); // 先关闭
        displayList(data); // 再重新打开
    } else {
        displayList(data); // 直接打开
    }
}

// 修改后的displayList函数
function displayList(list) {
    // 切换可见状态
    container.classList.toggle('visible');

    // 只有当容器可见时才更新内容
    if (container.classList.contains('visible')) {
        container.innerHTML = `
      <div class="list-header">
        <strong style="font-size:1.2em">种子监控面板</strong>
        <span style="margin-left:15px">总数: ${list.length}</span>
        <button class="close-btn" title="关闭">×</button>
      </div>
      <div class="list-content">
<table class="daemon-table">
  <thead>
    <tr>
      <th style="width:50%">名称</th>
      <th style="width:20%">Tracker</th>
      <th style="width:60px">状态</th>
      <th style="width:30px">操作</th>
    </tr>
  </thead>
  <tbody>
    ${list.map(item => `
      <tr data-hash="${item.torrent_hash}" data-md5="${item.torrent_md5}">
        <td style="word-wrap:break-word">${item.torrent_name}</td>
        <td>${item.torrent_tracker}</td>
        <td>
          <span class="status-flag ${item.ispushed ? 'true-flag' : 'false-flag'}">
            Pushed: ${item.ispushed}
          </span>
          <span class="status-flag ${item.isavailable ? 'true-flag' : 'false-flag'}">
            Available: ${item.isavailable}
          </span>
        </td>
        <td>
          <button class="delete-btn" data-hash="${escapeHTML(item.torrent_hash)}" data-md5="${escapeHTML(item.torrent_md5)}">
   删除
</button>
        </td>
      </tr>
    `).join('')}
  </tbody>
</table>
      </div>
    `;
// 使用事件委托处理删除操作
    container.addEventListener('click', async (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const hash = row.dataset.hash;
            const md5 = row.dataset.md5;
            await deleteTorrent(hash, md5, deleteBtn);
        }

        const closeBtn = e.target.closest('.close-btn');
        if (closeBtn) {
            container.classList.remove('visible');
        }
    });
}
}

// 简化的容器创建函数
function createListContainer() {
    const container = document.createElement('div');
    container.id = 'daemon-list';
    container.className = 'daemon-list';
    document.body.appendChild(container);
    return container;
}

// 在生成HTML时对特殊字符进行转义
const escapeHTML = str => str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// 添加删除函数
async function deleteTorrent(hash, md5, button) {
    if (!confirm(`确定要删除该种子吗？\n哈希值：${hash}\nMD5：${md5}`)) return;

    button.classList.add('loading');

    try {
        await doPostJson(deleteapiurl, {
            torrent_hash: hash,
            torrent_name: null,
            torrent_md5: md5
        });
        fetchAndDisplayList()
    } catch (error) {
        console.error('删除失败:', error);
        alert(`删除失败: ${error.message}`);
    } finally {
        button.classList.remove('loading');
    }
}

if (site_url.match(/details.php\?id=\d+&uploaded=1/) || site_url.match(/torrents\/download_check/)) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}
else if (site_url.match(/upload.php/)) {
    addButton(1, '点击发布', () => {
        const publishButton = document.querySelector('input[value="发布"]');
        if (publishButton) {
            publishButton.click();
        } else {
            addMsg('未找到发布按钮！');
        }
    });
}
// 添加按钮
if (site_url.match(/details.php/) || site_url.match(/totheglory.im\/t\//)) {
    addButton(1, '编辑种子', () => {

        const editButton = document.querySelector('a[href*="edit.php"]');
        if (editButton) {
            window.location.assign(editButton.href);
        } else {
            addMsg('未找到编辑按钮！');
        }
    });
}
if (site_url.match(/edit.php/)) {
    addButton(1, '编辑完成', () => {
        debugger;
        if(site_url.match(/piggo.me/)){
            const form = document.getElementById("compose");
            form.submit();
            return;
        } else {
            var editButton = document.querySelector('input[type*="submit"]');
            if (editButton) {
                editButton.click()
                return;
            }
        }
        addMsg('未找到编辑按钮！');
    });
}
addButton(3, '推送链接', () => {
    doPostJson(apiurl, { torrent_link: getUrl() });
});
addButton(2, '推送文件', () => {
    getBlob(getUrl());
});
addButton(4, '队列->QB', () => {
    doPostJson(deployapiurl, {});
});

addButton(5, '面板', fetchAndDisplayList);
addButton(6, '设置', handleSettings);
addButton(7, '选择种子', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => handleSeedUpload(e.target.files[0]);
    input.click();
});