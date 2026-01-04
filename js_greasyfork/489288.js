// ==UserScript==
// @name   小红书无水印媒体
// @namespace  http://your.namespace.com
// @version  0.2
// @description  读取小红书页面内容的图片视频的无水印媒体数据，左侧按钮是解析出链接，显示在页面内，右边蓝色按钮是把链接发送到网页文件下载器，进行下载。评论的图片，只发送到网页下载器下载。
// @author   Your name
// @match    https://www.xiaohongshu.com/*

// @icon   https://www.xiaohongshu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/489288/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%AA%92%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/489288/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%AA%92%E4%BD%93.meta.js
// ==/UserScript==

// 创建按钮元素
// var button = document.createElement('button');
// button.innerHTML = '按钮';
// // 设置按钮样式
// button.style.position = 'fixed';
// button.style.top = '0';
// button.style.left = '0';
// button.style.zIndex = '9999';
// button.addEventListener('click', function (event) {
//   console.log(unsafeWindow.__INITIAL_STATE__)
// })
//将按钮添加到页面的body元素中
// document.body.appendChild(button);

//目录路径，一定要把单斜杠换成双斜杠
var 文件保存目录 = '';
//示例  var 服务器地址='http://127.0.0.1:5001/Mediadown';
var 服务器地址 = '';
var globalJSON = [];
var subJSON = [];
var 页面源码 = '';

var 阻止更新页面内容 = localStorage.getItem('阻止更新页面内容');
(function () {
    var css = `
  .author[target="_blank"]{
    max-width: 100px;
  }
  .mianban {
   background-color: rgb(140 153 133 / 80%);
   border-radius: 5px;
   border: 2px solid #bbb;
   box-shadow: 0 1px 0 rgb(0 0 0 / 30%), 0 2px 2px -1px rgb(0 0 0 / 50%), 0 1px 0 rgb(255 255 255 / 30%) inset;
   z-index: 888;
   width: 400px;
   overflow-y: scroll;
   position: fixed;
   left: 25px;
   max-height: 60vh;
  }
  .Recordingpanel {
    z-index: 999;
    width: 350px;
    left: 25px;
    position: fixed;
    overflow-y: scroll;
    background-color: rgb(184 168 40 / 80%);
    border-radius: 5px;
    border: 2px solid #bbb;
    box-shadow: 0 1px 0 rgb(0 0 0 / 30%), 0 2px 2px -1px rgb(0 0 0 / 50%), 0 1px 0 rgb(255 255 255 / 30%) inset;
  }
  .提示 {
    position: relative;
    transform: translate(50%, 0%);
    color: #fce001;
    height: 15px;
    width: 250px;
    user-select: none;
  }
  .Recordingpanel.hidden {
    display: none;
  }
  .Recordingtext {
    padding: 5px 10px;
    border-radius: 15px;
    margin: 5px 0px;
    cursor: pointer;
    position: relative;
    background: #b1a125;
  }
  .Recordingtext.error {
    background: #b13325;
  }
  .selectList{
    overflow-y: scroll;
    height: 560px;
  }
  .jilubutton{
    left: 0px;
    padding: 10px 0px 5px 3px;
    border-radius: 0px 5px 5px 0px;
    position: fixed;
    width: 20px;
    height: 50px;
    background: #b1a125;
    cursor: pointer;
    user-select: none;
  }
  .jilubutton:hover {
    background: rgb(203 169 0);
  }
  
  .jilubutton:active {
    background: rgb(203 103 0); /* 点击时的颜色 */
  }
  .set-button {
   color: #fff;
   border-color: #269CE9;
   background-color: #269CE9;
   border-radius: 5px;
   border: 2px solid #bbb;
   box-shadow: 0 1px 0 rgb(0 0 0 / 30%), 0 2px 2px -1px rgb(0 0 0 / 50%), 0 1px 0 rgb(255 255 255 / 30%) inset;
  }
  .set-button:hover::after {
   background-color: rgba(255, 255, 255, 0.3) !important;
  }
  .set-button:hover {
    background-color: #70B9E8;
  }
  .set-button:active {
    background: #2db628;
    /* position: fixed; */
    /* margin-bottom: 9px; */
    text-shadow: none;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, .3) inset;
  }
  .yidong{
    background: #074836;
  }

  .set-button {
    color: #fff !important;
    box-shadow:
    0 1px 0 rgb(0 0 0 / 30%),
    1px 2px 2px 0px rgb(247 23 23 / 50%),
    0px -8px 9px rgb(21 133 207 / 100%) inset; /* 只在右边和下边添加内阴影效果 */
  }
  .list_down_button {
    position: absolute;
    bottom: 0px;
    right: -9px;
    background: #516447;
    width: 20px;
    height: 20px;
    border-radius: 8px;
    cursor: pointer; /* 设置鼠标样式为链接指针 */
    overflow: hidden; /* 隐藏伪元素溢出部分 */
  }
  .list_down_button:hover {
    background-color: rgb(252 167 4);
  }

  .list_down_button:active {
    background: rgb(231, 106, 4); /* 点击时的颜色 */
  }
  .list_down_button.wait {
    background: #1DA1F2; 
  }
  .list_down_button.fail {
    background: brown; 
  }
  .list_down_button.success {
    background: green; 
  }
  .meiti_button {
    width: 23px;
    height: 23px;
    background: #0f77c72b;
    cursor: pointer;
    border-radius: 5px;
    margin: 5px;
    display: inline-block;
    vertical-align: middle;
  }
  // .meiti_button:hover {
  //   background-color: rgb(252 167 4);
  // }

  // .meiti_button:active {
  //   background: rgb(231, 106, 4); /* 点击时的颜色 */
  // }
  // .pinglun_button{
  //   width: 20px;
  //   height: 20px;
  //   background: rgb(239 199 0);
  //   cursor: pointer;
  //   border-radius: 5px;
  // }
  // .pinglun_button:hover {
  //   background: rgb(203 169 0);
  // }

  .pinglun_button:active {
    background: rgb(203 103 0); /* 点击时的颜色 */
  }
  .meiti_send_button[down_status="wait"]{
    background: linear-gradient(to bottom right, #36a5ff, #03599f);
    /* 10s 是动画持续时间，可以根据需要调整 */
    animation: rotateBackground 10s linear infinite;
  }
  .meiti_send_button[down_status="success"]{
    background:green;
  }
  .meiti_send_button[down_status="fail"]{
    background:brown;
  }
  .libox{
    display:flex;
    background-color: #99a294;
  }
  .mouseover .libox{
    background-color: rgb(0 200 200 / 50%)
  }
  .loca_download svg {
    width: 23px !important;
    height: 23px !important;
    color: #1DA1F2;
    cursor: pointer;
  }
  .loca_download svg:hover {
    color: #d48600;
  }
  .loca_download svg:active {
    color: rgb(231, 106, 4);
  }
  [down_status="download"] g.download, [down_status="fail"] g.failed, [down_status="success"] g.completed, [down_status="wait"] g.loading{
    display: unset;
  }
  .loca_download g {
    display: none;
  }
  [down_status="wait"] g.loading {
    transform-origin: center;
  }
  @keyframes rotateBackground {
    from {
    transform: rotate(0deg);
    }
    to {
    transform: rotate(360deg);
    }
  }
  [down_status="wait"] g.loading {
    animation: rotate 5s linear infinite;
  }
  /* 定义旋转动画 */
  @keyframes rotate {
    from {
    transform: rotate(0deg);
    }
    to {
    transform: rotate(360deg);
    }
  }
  .meiti_send_button{
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: 5px;
    background:#b1a125;
  }
  .meiti_send_button:hover {
    background: rgb(203 169 0);
  }
  .meiti_send_button:active {
    background: rgb(203 103 0); /* 点击时的颜色 */
  }
  [meiti_send_button="red"]{
    background:red;
  }
  [meiti_send_button="green"]{
    background:green;
  }
  [meiti_send_button="brown"]{
    background:brown;
  }
  .chaxun{
    background:#2a7da54a;
    border-radius: 20px;
    color: #0068ab ;
  }
/*设置按钮*/
  .main_button {
    position: fixed;
    top: 55.5vh;
    width: 20px;
    height: 50px;
    /*background: linear-gradient(to right, , rgba(252, 247, 224, 0.5));*/
    background: #FF2442;
    cursor: pointer;
    z-index: 9999;
    border-radius: 0px 5px 5px 0px;
    padding: 10px 0px 5px 3px;
    user-select: none;
  }
/*设置面板*/
  .settingPanel {
    position: fixed;
    top: 55.5vh;
    left: 20px;
    padding: 10px;
    color: #376339;
    background: linear-gradient(to right, #DCF0B0, #FCF7E0);
    border: 1px solid #000;
    z-index: 9999;
    display: none;
  }

  .button:hover::after {
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.3) !important;
  }

  .button:hover {
    border-radius: 5px;
    background-color: #70B9E8;
  }

  .button:active {
    border-radius: 5px;
    background: #2db628;
    /* position: fixed; */
    /* margin-bottom: 9px; */
    text-shadow: none;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, .3) inset;
  }
  .dfturl {
    background-size: contain;
    background-repeat: no-repeat;
    width: 50px;
    height: 50px;
  }
    /**/
    .floating-btn-sets[data-v-75df8d6e]{
    right: 0px;
    width: 35px;
    } 
  /*置顶按钮*/
  .back-top[data-v-396124b4] {
    background: #13b5db00;
    width: 35px;
    height: 35px;
  }
  /*置顶按钮*/
  .back-top .btn-wrapper[data-v-396124b4] {
    background: #49b0ffa1;
  }
  /*刷新按钮*/
  .reload[data-v-053c290a] {
    background: #13b5db00;
    width: 35px;
    height: 35px;
  }
  /*刷新按钮*/
  .reload .btn-wrapper[data-v-053c290a] {
    background: #49b0ffa1;
  }
  .全赞 {
    position: fixed;
    top: 61.5vh;
    width: 20px;
    height: 67px;
    background: #ff7524;
    cursor: pointer;
    z-index: 9999;
    border-radius: 0px 5px 5px 0px;
    padding: 0px 0px 5px 3px;
    user-select: none;
  }
  .全赞:hover{
    background: #f98948;
  }
  .全赞:active{
    background: #d14d00;
  }
  .阻止更新 {
    position: fixed;
    top: 70vh;
    width: 20px;
    height: 67px;
    background: #ff7524;
    cursor: pointer;
    z-index: 9999;
    border-radius: 0px 5px 5px 0px;
    padding: 0px 0px 5px 3px;
    user-select: none;
  }
  .阻止更新:hover{
    background: #f98948;
  }
  .阻止更新:active{
    background: #d14d00;
  }
  .reds-toast[data-v-2ec4f68e] {
    background: #0047a5 !important;
  }
  `
    if (!document.querySelector('.custom')) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        style.className = "custom";
        document.head.appendChild(style);
    }

})();

(function () {
    // 创建设置按钮
    var settingButton = document.createElement('div');
    settingButton.className = 'main_button';
    settingButton.innerHTML = '设置';
    document.body.appendChild(settingButton);

    var settingPanel = document.createElement('div');
    settingPanel.className = 'settingPanel';
    settingPanel.innerHTML = `
  <label for="server">服务器地址:</label>
  <br>
  <textarea class="server_address"  placeholder="http://127.0.0.1:5001/Mediadown" style="width: 200px;resize: none; height: 40px;"></textarea>
  <br>
  <label for="directory">文件保存目录:</label>
  <br>
  <textarea class="filedirectory"  placeholder="D:\\临时文件\\临时保存" style="width: 200px;resize: none; height: 40px;"></textarea>
  <br>
  <button id="saveButton" class="button" style="font-weight: bold; color: #333333;cursor:pointer; position: relative;margin: 6px 0px 0px 0px;right: -170px;padding: 4px;">保存</button>
  <br>
<span style="font-size: 12px; padding: 3px;  border-radius: 5px;">请复制密码：f4hz，<a href="https://police.lanzouw.com/b01a8pxgj" target="_blank"><br>点击这里</a>下载《网页下载器.exe》</span>
  

  `;

    document.body.appendChild(settingPanel);
    settingPanel.addEventListener('mousedown', function (e) {
        dragMenu(settingPanel, e);
    });
    按钮绑定(settingButton, settingPanel);
    function 按钮绑定(settingButton, settingPanel,) {
        settingButton.addEventListener('mousedown', function (e) {
            dragMenu(settingButton, e);
        });
        // 定义一个变量用于保存计时器的 ID
        var timerId;
        // 给设置按钮绑定鼠标移入事件
        settingButton.addEventListener('mouseenter', function () {
            // 显示设置面板
            settingPanel.style.display = 'block';
            // 清除计时器
            clearTimeout(timerId);
        });
        // 给设置面板绑定鼠标移入事件，避免鼠标移出设置按钮后立即隐藏设置面板
        settingPanel.addEventListener('mouseenter', function () {
            // 清除计时器
            clearTimeout(timerId);
        });
        // 给设置按钮绑定鼠标移出事件
        settingButton.addEventListener('mouseleave', function () {
            // 开始计时，500 毫秒后隐藏设置面板
            timerId = setTimeout(function () {
                settingPanel.style.display = 'none';
            }, 500);
        });
        // 给设置面板绑定鼠标移出事件，避免鼠标移入设置面板后立即隐藏设置面板
        settingPanel.addEventListener('mouseleave', function () {
            // 开始计时，500 毫秒后隐藏设置面板
            timerId = setTimeout(function () {
                settingPanel.style.display = 'none';
            }, 500);
        });
        // 显示/隐藏设置界面
        if (settingButton) {
            settingButton.addEventListener('click', function () {
                if (settingPanel.style.display === 'none') {
                    settingPanel.style.display = 'block';
                    console.log('开始设置');
                } else {
                    settingPanel.style.display = 'none';
                }
            });
        }
    }

    let 服务器地址value = document.querySelector('.server_address');
    // 读取缓存服务器地址的值
    服务器地址 = localStorage.getItem('服务器地址');
    //如果缓存没有内容就使用默认的数值
    if (服务器地址) {
        服务器地址value.value = 服务器地址;
    } else {
        服务器地址value.value = 'http://127.0.0.1:5001/Mediadown'; // 默认值
        服务器地址 = 服务器地址value.value;
    }

    let 文件保存目录value = document.querySelector('.filedirectory');
    // 读取缓存服务器地址的值
    文件保存目录 = localStorage.getItem('directoryPath');
    //如果缓存没有内容就使用默认的数值
    if (文件保存目录) {
        文件保存目录value.value = 文件保存目录;
    } else {
        文件保存目录value.value = 'D:\\临时文件\\临时保存'; // 默认值
        文件保存目录 = 文件保存目录value.value;
    }
    判断服务器();

    // 监听保存按钮的点击事件
    var saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', function () {
        localStorage.setItem('服务器地址', 服务器地址value.value);
        localStorage.setItem('directoryPath', 文件保存目录value.value);
        文件保存目录 = 文件保存目录value.value

    });
    var 全赞 = document.createElement('div');
    全赞.className = '全赞';
    全赞.textContent = '全部点赞';
    document.body.appendChild(全赞);
    全赞.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        当前页全赞();
    })
    var 阻止更新 = document.createElement('div');
    阻止更新.className = '阻止更新';
    阻止更新.textContent = '阻止更新';
    document.body.appendChild(阻止更新);
    阻止更新.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        if (阻止更新页面内容 === true) {
            阻止更新页面内容 = false;
            localStorage.setItem('')
            showToast('已经恢复刷新页面内容。😀', true)
        } else {
            阻止更新页面内容 = true;
        }

    })
})();
// function 弹出设置服务器(){
//   if (服务器地址) {
//   服务器地址value.value = 服务器地址;
//   } else {
//   // 创建悬浮框来让用户填写服务器地址
//   let 悬浮框 = document.createElement('div');
//   悬浮框.style.position = 'fixed';
//   悬浮框.style.top = '50%';
//   悬浮框.style.left = '50%';
//   悬浮框.style.transform = 'translate(-50%, -50%)';
//   悬浮框.style.backgroundColor = '#fff';
//   悬浮框.style.padding = '20px';
//   悬浮框.style.border = '1px solid #ccc';
//   悬浮框.style.zIndex = '9999';
//   悬浮框.style.borderRadius='10px';

//   let 输入框 = document.createElement('input');
//   输入框.value = 'http://127.0.0.1:5001/Mediadown';
//   输入框.type = 'text';
//   输入框.style.width='290px';
//   输入框.style.height='30px';
//   输入框.style.margin='0 5px 0 0';
//   输入框.style.backgroundColor='#c9c9c9';
//   输入框.className='severinput'
//   输入框.placeholder = '请输入服务器地址';
//   悬浮框.appendChild(输入框);

//   let 确认按钮 = document.createElement('button');
//   确认按钮.textContent = '确认';
//   确认按钮.className='severconfirm';
//   确认按钮.style.width='60px';
//   确认按钮.style.height='30px';
//   确认按钮.style.cursor='pointer';
//   确认按钮.style.borderRadius='5px';
//   确认按钮.style.background='antiquewhite';
//   确认按钮.addEventListener('click', function () {
//     服务器地址 = 输入框.value;
//     localStorage.setItem('服务器地址', 服务器地址);
//     服务器地址value.value = 服务器地址;
//     document.body.removeChild(悬浮框);
//   });
//   悬浮框.appendChild(确认按钮);
//   document.body.appendChild(悬浮框);
//   }
// }
function 判断服务器() {
    if (/^(https?:\/\/)/.test(服务器地址) === false) {
        showToast('如需要使用外部网页文件下载器，请在源码里填写服务器地址。')
    }
}
function 读取页面媒体() {
    'use strict';
    var indexValues = [];
    // 创建一个数组来保存结果
    var resultList = []; // 判断是否存在类名为 '.swiper-wrapper [data-swiper-slide-index]' 的元素
    var noteItems = document.querySelectorAll('.swiper-wrapper [data-swiper-slide-index]');
    if (noteItems.length != 0) {
        // 遍历元素列表
        noteItems.forEach(function (element) {
            var index = element.getAttribute('data-swiper-slide-index');

            // 检查该值是否已经存在于数组中
            if (indexValues.includes(index)) {
                console.log('存在重复值:', index);
                return; // 如果存在重复值，停止执行后续命令
            }
            // 提取 URL 文件名
            var backgroundImage = element.style.backgroundImage;

            if (backgroundImage) {
                var matchResult = backgroundImage.match(/([^/]+)$/);

                if (matchResult) {
                    var filename = matchResult[0].split('!')[0];
                    console.log('网址文件名:', filename);
                } else {
                    console.log('未找到匹配的内容');
                }
            } else {
                console.log('backgroundImage 不存在或为空');
            }

            var titleSpanText = document.querySelector('.note-content').textContent.replace(/[<>:"/\\|?*]/g, '');
            var username = document.querySelector('.username').textContent.replace(/[<>:"/\\|?*]/g, '');
            // 构建结果字符串  用户名-文案-URL文件名
            var resultString = username + '----' + titleSpanText + '---' + filename + ".jpeg";
            // 将结果字符串添加到结果数组中
            var obj = {
                filename: resultString,
                url: "https://sns-img-hw.xhscdn.net/" + filename,
                小红书ID: 小红书ID
            };
            resultList.push(obj);
            // 记录该值并继续执行后续命令
            indexValues.push(index);
        });
        创建列表框(resultList);
    } else {
        // 判断是否存在类名为 '.player-container video' 的元素
        noteItems = document.querySelectorAll('.player-container video');
        if (noteItems.length !== 0) {
            var pageSourceCode = document.documentElement.outerHTML;
            var start = pageSourceCode.indexOf('originVideoKey":"') + 'originVideoKey":"'.length;
            var end = pageSourceCode.indexOf('"', start);
            var filename = pageSourceCode.substring(start, end).replace(/\\u002F/g, "/");
            var url;
            if (filename == "" || filename == "rflow: hidden;") {
                noteItems.forEach(function (item) {
                    var 小红书ID = window.location.pathname.split('/').pop()
                    访问获取笔记源码(小红书ID);
                    // url= item.src;
                    // filename = url.split('/').pop().split('.')[0];
                    // showToast("当前获取到的视频链接，非原链接，请刷新界面后进入笔记页面。", false)
                    // console.log(filename);
                    return;
                });
            } else {
                url = "http://sns-video-bd.xhscdn.com/" + filename
                var titleSpanText = document.querySelector('.note-content').textContent.replace(/[<>:"/\\|?*]/g, '');
                var username = document.querySelector('.username').textContent.replace(/[<>:"/\\|?*]/g, '');
                // 构建结果字符串  用户名-文案-URL文件名
                var resultString = username + '----' + titleSpanText + '---' + filename + ".MP4";
                // 将结果字符串添加到结果数组中
                var obj = {
                    filename: resultString,
                    url: url,
                    小红书ID: 小红书ID
                };
                resultList.push(obj);
                console.log(filename);
                创建列表框(resultList);
            }


        } else {
            // 判断是否存在类名为 '.note-item:not([class*=" "])' 的元素
            noteItems = document.querySelectorAll('.note-item:not([class*=" "])');
            if (noteItems.length != 0) {
                // 遍历每个 note-item 元素
                noteItems.forEach(function (noteItem, index) {
                    // 获取 .cover.ld.mask 类名的元素
                    var coverElement = noteItem.querySelector('.cover.ld.mask');
                    var backgroundURL = "";
                    if (coverElement) {
                        // 获取 background 属性的 URL
                        backgroundURL = window.getComputedStyle(coverElement).background.match(/url\(["']?([^"']+)["']?\)/)[1];

                        // 检查 coverElement 是否是链接
                        if (coverElement.tagName === 'A') {
                            var wenshuid = coverElement.href;
                            console.log(wenshuid);
                        } else {
                            console.log('coverElement 不是一个链接');
                        }
                    }

                    // 获取 title 下的 span 文本  文案内容
                    if (noteItem.querySelector('.title span')) {
                        var titleSpanText = noteItem.querySelector('.title span').textContent.replace(/[<>:"/\\|?*]/g, '')
                    }

                    //获取用户名
                    var username = "";
                    if (noteItem.querySelector('.active.router-link-exact-active.author span')) {
                        // 获取 active router-link-exact-active author 下的 span 文本
                        username = noteItem.querySelector('.active.router-link-exact-active.author span').textContent;
                    } else {
                        if (noteItem.querySelector('.author-wrapper span')) {
                            // 获取 active router-link-exact-active author 下的 span 文本
                            username = noteItem.querySelector('.author-wrapper span').textContent;
                        }
                    }

                    // 提取 URL 文件名
                    var filename = backgroundURL.substring(backgroundURL.lastIndexOf('/') + 1).split('!')[0];
                    // 构建结果字符串  用户名-文案-URL文件名
                    var resultString = username + '----' + titleSpanText + '---' + filename + ".jpeg";
                    // 将结果字符串添加到结果数组中
                    var obj = {
                        filename: resultString,
                        url: "https://sns-img-hw.xhscdn.net/" + filename,
                        小红书ID: 小红书ID
                    };
                    resultList.push(obj);
                    创建列表框(resultList,);
                });
            }
        }
    }

}

function 创建列表框(resultList, 按钮_参数) {
    if (document.querySelector('.mianban')) {
        document.querySelector('.mianban').remove();
        延时();
        showToast("删除列表成功。", false);
    }
    // 添加选择列表到 body 元素
    var mianbanbox = document.createElement('div');
    // 创建一个选择列表元素
    var selectList = document.createElement('div');
    selectList.className = 'selectList';
    // 遍历结果数组，创建选项并添加到选择列表中
    resultList.forEach(function (result, index) {
        // 创建带有序号的元素
        var optionWrapper = document.createElement('div');
        selectList.appendChild(optionWrapper);
        optionWrapper.classList.add('optionWrapper');
        optionWrapper.style.margin = "5px 10px";
        optionWrapper.setAttribute('murl', result.url);
        optionWrapper.setAttribute('xiaohongshuid', result.小红书ID);
        optionWrapper.style.cursor = "pointer";
        optionWrapper.style.position = "relative";
        var indexMarker = document.createElement('div');
        indexMarker.style.fontWeight = "bold";
        indexMarker.classList.add('indexMarker');
        indexMarker.textContent = index + 1 + "、"; // 序号从1开始
        optionWrapper.appendChild(indexMarker);
        var libox = document.createElement('div');
        libox.className = 'libox';
        libox.textContent = result.filename;
        optionWrapper.appendChild(libox);
        // optionWrapper.insertBefore(indexMarker, optionWrapper.firstChild);
        var dfturlbox = document.createElement('div');
        dfturlbox.className = '图片盒子';
        dfturlbox.style.height = '50px';
        dfturlbox.style.width = '50px';
        libox.appendChild(dfturlbox);
        var dfturl = document.createElement('div');
        dfturl.className = 'dfturl';
        dfturl.style.backgroundImage = `url("${result.dfturl}")`;
        dfturlbox.appendChild(dfturl);
        // var libox = document.createElement('div');
        // libox.className='libox';
        // libox.textContent = result.filename;
        // optionWrapper.appendChild(libox);
        // 添加鼠标右键点击事件
        optionWrapper.addEventListener('contextmenu', function (event) {
            // 阻止默认的右键菜单
            event.preventDefault();
            // 修改组件样式
            this.style.backgroundColor = "rgb(0 100 100 / 50%)";
            var url = this.getAttribute('murl');
            // 复制URL到剪贴板
            copyToClipboard(url);
        });
        // 添加鼠标移入事件
        optionWrapper.addEventListener('mouseover', function () {
            this.style.backgroundColor = "rgb(0 200 200 / 50%) ";
            this.classList.add('mouseover');
        });
        // 添加鼠标移出事件
        optionWrapper.addEventListener('mouseout', function () {
            // 恢复原始背景色
            this.style.backgroundColor = "";
            this.classList.remove('mouseover');
        });
        // optionWrapper.addEventListener('dblclick', function () {
        //   this.style.backgroundColor = "rgb(140 153 133 / 100%)";
        //   showToast("开始下载媒体信息", true);
        //   var url = this.getAttribute('murl');
        //   var filename = this.textContent;
        //   // 调用 downloadFile 函数进行下载
        //   downloadFile(url, filename);
        //   showToast("请选择保存位置", true)
        // });
        //原生JS下载代码，
        optionWrapper.setAttribute('data', index);
        optionWrapper.addEventListener('dblclick', function (event) {
            event.preventDefault();
            const index = pseudoElement.getAttribute('data');
            下载文件(index, 按钮_参数, list_down_button);
        });
        //创建伪元素
        var list_down_button = document.createElement('div');
        list_down_button.className = "list_down_button"
        list_down_button.setAttribute('data', index);
        list_down_button.addEventListener('click', function () {
            const index = list_down_button.getAttribute('data');
            下载文件(index, 按钮_参数, list_down_button);
        });
        libox.appendChild(list_down_button);
        selectList.addEventListener('wheel', function (event) {
            // 阻止事件冒泡
            event.stopPropagation();
            // 阻止默认滚动行为
            event.preventDefault();
            // 获取滚动距离
            var delta = event.deltaY || event.detail || event.wheelDelta;

            // 根据滚动方向调整 scrollTop 和 scrollLeft
            if (delta > 0) {
                selectList.scrollTop += 10;
            } else {
                selectList.scrollTop -= 10;
            }
        })
    });

    var linkWrappers = document.querySelectorAll('.side-bar .link-wrapper:not([class*=" "])'); // 选择所有class为link-wrapper的元素
    var top = "calc(30% + 30px)%";
    linkWrappers.forEach(function (element) {
        if (element.textContent.trim() === "我") { // 检查元素的文本内容是否为"我"
            var rect = element.getBoundingClientRect();
            top = rect.top + element.clientHeight + 10 + "px";
            console.log(element.textContent.trim())
        }
    });
    mianbanbox.className = "mianban";
    console.log(top);
    mianbanbox.style.top = top;

    // 检查是否存在 .side-bar .information-wrapper 元素
    var informationWrapper = document.querySelector('.side-bar .information-wrapper:not([class*=" "])');
    if (informationWrapper) {
        // 如果 .side-bar .information-wrapper 存在，设置 mianbanbox 的高度为该元素顶部到页面顶部的距离
        var topOffset = informationWrapper.getBoundingClientRect().top;
        mianbanbox.style.height = parseFloat(topOffset) - parseFloat(top) + "px";
        console.log(parseFloat(topOffset) - parseFloat(top) + "px")
    } else {
        // 如果 .side-bar .information-wrapper 不存在，设置 mianbanbox 的高度为 580px
        mianbanbox.style.height = "580px";
    }

    // if (document.querySelector('div.side-bar:not([class*=" "])').clientWidth + 24 < 490) {
    //   mianbanbox.style.overflowX = 'scroll'; // 设置垂直滚动条
    // }
    var 提示 = document.createElement('div');
    提示.className = '提示';
    提示.textContent = `双击此处，可关闭此窗口。`;
    mianbanbox.appendChild(提示);
    提示.addEventListener('dblclick', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        mianbanbox.remove();
    });

    mianbanbox.appendChild(selectList);

    document.querySelector('body').appendChild(mianbanbox);
    mianbanbox.addEventListener('mousedown', function (e) {
        dragMenu(mianbanbox, e);
    });
    mianbanbox.addEventListener('scroll', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
    });
    function 下载文件(index, 按钮_参数, list_down_button) {
        list_down_button.classList.add('wait')
        var 剩余下载 = false;
        var 列表 = document.querySelectorAll(".optionWrapper");
        const wenjian = 列表[index];
        wenjian.style.backgroundColor = "rgb(140 153 133 / 100%)";
        showToast("开始下载媒体信息", true)
        var url = wenjian.getAttribute('murl');
        var 小红书ID = wenjian.getAttribute('xiaohongshuid');
        var filename = wenjian.textContent;
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var fileSize = xhr.response.size; // 获取文件大小
            var maxSize = 10 * 1024; // 设置最大文件大小为5MB
            if (fileSize < maxSize) {
                // 如果文件大于5MB，显示警告并返回
                showToast("文件过小，疑似URL异常。", true);
                list_down_button.classList.remove('wait');
                list_down_button.classList.add('error'); // 可以为过大的文件设置一个错误状态
                return; // 结束函数执行
            }
            showToast("文件预下载完成了", true)
            list_down_button.classList.add('success')
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            showToast("请选择保存位置,并保存文件", true)
            a.click();
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
            添加成功下载文件(小红书ID);
            wenjian.setAttribute('down', 'success');
            list_down_button.classList.remove('wait');
            列表.forEach(element => {
                if (element.getAttribute('xiaohongshuid') === 小红书ID) {
                    if (element.getAttribute('down') != 'success') {
                        剩余下载 = true;
                    }
                }
            });
            if (!剩余下载) {
                按钮_参数.setAttribute('down_status', 'success');
            }
        };

        // 处理下载错误
        xhr.onerror = function () {
            showToast("下载失败，请检查网络连接并重试", true);
            list_down_button.classList.remove('wait');
            list_down_button.classList.add('error'); // 可以添加一个错误的类来改变按钮的样式，表示下载失败
            wenjian.style.backgroundColor = ""; // 或设置为其他颜色，表示错误状态
        };

        xhr.open('GET', url);
        xhr.send();
        return false;
    }

}

// var 远程下载记录 = localStorage.getItem('远程下载记录');
// //如果缓存没有内容就使用默认的数值
// if (远程下载记录) {
//   远程下载记录 = JSON.parse(远程下载记录)
//   for (let index = 0; index < 远程下载记录.length; index++) {

//   创建下载记录列表框(远程下载记录[index].记录)
//   }
// } else {
//   var jsonString = '[]';
//   远程下载记录 = JSON.parse(jsonString);

// }
var jsonString = '[]';
var 远程下载记录 = JSON.parse(jsonString);
创建下载记录列表框("")

function 创建下载记录列表框(content, 添加, 异常) {
    if (!document.querySelector('.Recordingpanel')) {
        var linkWrappers = document.querySelectorAll('.side-bar .link-wrapper:not([class*=" "])'); // 选择所有class为link-wrapper的元素
        var top = "30%";
        linkWrappers.forEach(function (element) {
            if (element.textContent.trim() === "我") { // 检查元素的文本内容是否为"我"
                var rect = element.getBoundingClientRect();
                top = rect.top + element.clientHeight + 10 + "px";
            }
        });
        var parent = document.createElement('div');
        parent.className = 'Recordingpanel hidden';
        parent.style.top = top;
        parent.addEventListener('mousedown', function (e) {
            dragMenu(parent, e);
        });
        var informationWrapper = document.querySelector('.side-bar .information-wrapper:not([class*=" "])');
        if (informationWrapper) {
            // 如果 .side-bar .information-wrapper 存在，设置 mianbanbox 的高度为该元素顶部到页面顶部的距离
            var topOffset = informationWrapper.getBoundingClientRect().top;
            parent.style.height = parseFloat(topOffset) - parseFloat(top) + "px";
        } else {
            // 如果 .side-bar .information-wrapper 不存在，设置 mianbanbox 的高度为 580px
            parent.style.height = "580px";
        }
        parent.addEventListener('scroll', function (event) {
            event.preventDefault();
            if (parent.scrollTop === 0) {
                document.querySelector('.Recordingtext').style.background = '#5ab125'
            } else {
                console.log(parent.scrollHeight, parent.scrollTop);
                if (parent.scrollHeight - parent.scrollTop === parent.clientHeight) {
                    let Recordingtext = document.querySelectorAll('.Recordingtext')
                    Recordingtext[Recordingtext.length - 1].style.background = '#7f7313'
                }

            }

        });
        document.querySelector('body').appendChild(parent);
        var jilubutton = document.createElement('div');
        document.querySelector('body').appendChild(jilubutton);
        jilubutton.className = "jilubutton";
        let jilubutton_top = (document.querySelector('.main_button')?.getBoundingClientRect()?.top - jilubutton?.getBoundingClientRect()?.height - 10)
        if (jilubutton_top != 'NAN') {
            jilubutton.style.top = jilubutton_top + 'px'
        }
        jilubutton.style.top = + 'px';
        jilubutton.textContent = "记录";
        jilubutton.addEventListener('click', function () {
            // 恢复原始背景色
            if (document.querySelector('.Recordingpanel.hidden')) {
                parent.classList.remove('hidden');
                jilubutton.textContent = "关闭";
            } else {
                parent.classList.add('hidden');
                jilubutton.textContent = "记录";
            }
        });
    }
    if (content) {
        var record_content = document.createElement('div');
        record_content.classList.add('Recordingtext');
        if (异常) {
            record_content.classList.add('error');
        }
        record_content.textContent = content;
        var Recordingpanel = document.querySelector('.Recordingpanel')
        Recordingpanel.appendChild(record_content)
        record_content.addEventListener('mouseover', function (event) {
            event.stopPropagation();
            var str = record_content.textContent;
            var 小红书ID = str.match(/\b[A-Fa-f0-9]{16,}\b/g)?.[0];
            if (小红书ID) {
                // 获取所有类名为 "title" 的元素
                var elements = document.querySelectorAll('.title[href]');
                // 遍历这些元素，检查它们的 href 属性
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].href.includes(小红书ID)) {
                        elements[i].parentElement?.classList.add('chaxun')
                        break;
                        // 如果需要在找到匹配元素后执行其他操作，可以在这里添加代码
                    }
                }
                elements = document.querySelectorAll('.cover.ld.mask[href]');
                // 遍历这些元素，检查它们的 href 属性
                for (var j = 0; j < elements.length; j++) {
                    if (elements[j].href.includes(小红书ID)) {
                        elements[j].parentElement?.querySelector('.footer').classList.add('chaxun')
                        break;
                        // 如果需要在找到匹配元素后执行其他操作，可以在这里添加代码
                    }
                }
                // //这是笔记详情页面
                // var script = document.querySelectorAll('script');
                // for (let index = 0; index < script.length; index++) {
                //   if (script[index].textContent.includes(小红书ID)) {
                //   document.querySelector('.note-content').classList.add('chaxun');
                //   break;
                //   }

                var content = document.querySelectorAll('meta[content]');
                for (let index = 0; index < content.length; index++) {
                    if (content[index].getAttribute('content').includes(小红书ID)) {
                        document.querySelector('.note-content').classList.add('chaxun');
                        break;
                    }
                }
                var comment_item = document.querySelectorAll('.comment-item');
                for (let index = 0; index < comment_item.length; index++) {
                    if (comment_item[index].id.includes(小红书ID)) {
                        comment_item[index].classList.add('chaxun');
                        break;
                    }
                }

            }
            // 禁止父元素移动的代码
            // parent.style.pointerEvents = 'none';
        });
        record_content.addEventListener('mouseout', function (event) {
            event.stopPropagation();
            document.querySelector('.chaxun')?.classList?.remove('chaxun');
            // 启用父元素移动的代码
            // parent.style.pointerEvents = 'auto';
        });
        if (添加) {
            let json = {
                记录: content,
            };
            远程下载记录.push(json)
            // localStorage.setItem('远程下载记录', JSON.stringify(远程下载记录));
        }

    }
}

//zhushezhi();
function zhushezhi() {
    var div3 = document.createElement('div');
    div3.style.fontSize = '15px';
    div3.style.padding = "7px 10px 0px 10px";
    div3.style.zIndex = "999";
    div3.style.width = "70px";
    div3.style.height = "33px";
    div3.style.position = "fixed";
    div3.style.cursor = "pointer";

    div3.style.userSelect = "none";
    div3.textContent = "取图片";
    div3.className = "set-button";
    document.querySelector('body').appendChild(div3);
    var top = null;
    var left = null;
    var gao = document.querySelector('#link-guide')
    if (gao) {
        var rect = gao.getBoundingClientRect();
        top = rect.top - 4 + "px";
        left = rect.left + 2 + rect.width + "px";
    }

    div3.style.top = top;
    div3.style.left = left;
    div3.addEventListener('click', function () {
        console.log('执行打印命令');
        if (document.querySelector('.mianban')) {
            document.querySelector('.mianban').remove();
            showToast("删除列表成功。", false);
        }
        读取页面媒体();
        showToast("读取页面内小红书媒体信息完成，获取媒体数：" + document.querySelectorAll(".optionWrapper").length, false);
    });
    div3.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // 阻止默认右键菜单
        if (document.querySelector('.mianban')) {
            document.querySelector('.mianban').remove();
            延时();
            showToast("删除列表成功。", false);
        }
    });

}

function 延时() {
    var count = 0;
    var intervalId = setInterval(function () {
        var a = 1;
        console.log(a);
        count++;
        if (count === 5) {
            clearInterval(intervalId);
        }
    }, 1000);
}


//页面元素监测，判断小红书笔记列表是否出现
(function () {
    // 创建一个 MutationObserver 实例
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查每个变化的类型
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                // 循环遍历添加的节点
                mutation.addedNodes.forEach(function (addedNode) {
                    // 检查添加的节点是否为目标元素
                    if (addedNode.classList) {
                        const authorWrapperElements = addedNode.querySelectorAll('.footer .author-wrapper');
                        if (authorWrapperElements.length > 0) {
                            小红书媒体(authorWrapperElements);
                        } else {
                            const authorWrapperElements = addedNode.querySelectorAll('[data-v-ed4befca ][class="author-wrapper"]');
                            if (authorWrapperElements.length > 0) {
                                评论媒体(authorWrapperElements);
                            } else {
                                const authorWrapperElements = addedNode.querySelectorAll('.right .author-wrapper');
                                if (authorWrapperElements.length > 0) {
                                    评论媒体(authorWrapperElements);
                                } else {
                                    const interact_container = addedNode.querySelectorAll('.interact-container');
                                    if (interact_container.length > 0) {
                                        评论框(interact_container);
                                    } else {
                                        const bottom_channel = addedNode.querySelector('.bottom-channel[href="https://creator.xiaohongshu.com/publish/publish?source=official"]');
                                        if (bottom_channel) {
                                            bottom_channel.parentElement.remove();
                                        } else {
                                            var 报错提示 = addedNode.querySelector('[class="reds-toast center"]');
                                            if (报错提示) {
                                                if (报错提示.textContent.includes('XMLHttpRequest')) {
                                                    报错提示.textContent = '已经成功阻止页面刷新，😀';
                                                }

                                            } else {
                                                var 关闭登录 = addedNode.querySelector('[class="icon-btn-wrapper close-button"]')
                                                if (关闭登录) {
                                                    关闭登录.click();
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    });
    // 开始观察父节点下的变化
    observer.observe(document.body, { childList: true, subtree: true });
})();

function 访问获取笔记源码(小红书ID, 类型, 按钮) {
    get("https://www.xiaohongshu.com/explore/" + 小红书ID + "?exSource=", '', function (content) {
        let initialStateText = 取源码JSON文本(content);
        if (!initialStateText) {
            showToast(小红书ID + '--读取页面该笔记源码失败', false);
            return;
        }
        笔记源码分析(initialStateText, 类型, 按钮);
    });
}
function 取源码JSON文本(content) {
    var regex = /window\.__INITIAL_STATE__=(.*?)(?=<\/script>)/s;
    var match = regex.exec(content);
    if (match && match.length >= 2) {
        let initialStateText = match[1];
        // 现在 initialStateText 中存储了 window.__INITIAL_STATE__ 和 </script> 之间的内容
        initialStateText = initialStateText.replace(/:undefined/g, ':"undefined"');
        return initialStateText;
    }
}
// 请求函数，接受url和回调函数作为参数,callback为响应文本
function get(url, post, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(post ? 'POST' : 'GET', url, false);// 第三个参数设置为false表示同步请求
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(xhr.responseText);
            } else if (xhr.status === 404) {
                showToast("资源未找到");
            } else if (xhr.status === 500) {
                showToast("服务器内部错误");
            } else if (xhr.status === 0) {
                showToast("连接错误");
            } else {
                showToast("网络错误或其他错误");
            }
        }
    };
    if (post) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(post);
    } else {
        xhr.send();
    }
}
// fetch('https://m.v.qq.com/x/m/play?cid=mcv8hkc8zk8lnov',{
//  credentials: 'include' // 包含cookie信息
// })

//   .then(response => response.text())
//   .then(data => {
//   // 打印元素的文本内容
//   doc=元素转DOM对象(data)
//   console.log(doc.querySelector('body'))
//   })
// .catch(error => console.error(error));

// function 元素转DOM对象(data){
//   let htmlString = data;
//   // 创建一个 DOMParser 实例
//   let parser = new DOMParser();
//   // 使用 DOMParser 的 parseFromString 方法将 HTML 文本解析为 DOM 对象
//  return parser.parseFromString(htmlString, 'text/html');
// }
//下载方式,1发送至下载器，2，在本地下载，解析到面板
function 笔记源码分析(initialStateText, 下载方式, 按钮) {
    // 然后再进行 JSON 解析

    var initialStateJSON = JSON.parse(initialStateText);
    // 从 JSON 对象中提取特定路径的内容
    var resultList = [];
    var 小红书ID, 用户名, 用户id, 文件名ID, title, desc, time, 时间, currentDate, mediaurl, mediaurl2, mediaurl3, 文件名, 文案, 文件类型, dfturl, 新文件名, savedDirectoryPath;
    var mediajs = [];
    var downjs = {};
    // 赋值操作
    savedDirectoryPath = localStorage.getItem("directoryPath");
    if (!savedDirectoryPath) {
        按钮.setAttribute('down_status', 'fail');
        showToast('请在设置里，填写文件保存目录');
        return;
    }
    小红书ID = initialStateJSON.note?.firstNoteId;
    if (typeof 小红书ID === 'string') {
        console.log('jsonData2.a 是一个字符串');
    } else if (typeof 小红书ID === 'object' && 小红书ID !== null) {
        小红书ID = initialStateJSON.note?.firstNoteId?._rawValue;
    }
    用户名 = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.user?.nickname;
    用户id = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.user?.userId;
    文件名ID = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.video?.consumer?.originVideoKey;
    title = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.title;
    desc = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.desc;
    time = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.time;
    IP地址 = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.ipLocation ?? '';
    文案 = title + desc;
    文案 = 文案.length > 100 ? 文案.substring(0, 100) : 文案;
    currentDate = new Date(time);
    时间 = currentDate.toISOString().replace(/[-T:Z.]/g, '').slice(0, 14).replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '\$1-\$2-\$3_\$4\$5\$6');

    if (文件名ID != undefined) {
        新文件名 = `${用户名}----${用户id}----${文案}----${小红书ID}----${文件名ID}----${时间}_${IP地址}.mp4`;
        if (新文件名.length > 360) {
            const maxLength = 360 - (新文件名.length - text.length);
            const 文案 = text.substring(0, maxLength);
            新文件名 = `${用户名}----${用户id}----${文案}----${小红书ID}----${文件名ID}----${时间}_${IP地址}.mp4`;
        }
        mediaurl = "http://sns-video-bd.xhscdn.com/" + 文件名ID
        dfturl = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.imageList[0].urlDefault;
        if (下载方式 === 1) {
            文件类型 = "mp4"
            // const json = JSON数据(videourl,videourl2, 文件名ID, 文案, 用户名, 用户id, 文件保存目录, 文件名.replace(/[\\/:*?"<>|,;#%]/g, ''), 文件类型, 小红书ID, '', '');
            mediajs.push({ 用户名: 用户名, 文章ID: 小红书ID, 文件ID: 文件名ID, url: mediaurl, url2: mediaurl2, url3: mediaurl3, 文件名: 新文件名.replace(/[\\/:*?"<>|,;#%]/g, ''), 文件类型: 文件类型 });
            // 视频下载(json, 0, 按钮)
        } else {
            const obj = {
                filename: 文件名,
                url: mediaurl,
                小红书ID: 小红书ID,
                dfturl: dfturl
            };
            resultList.push(obj);
            创建列表框(resultList, 按钮);
            showToast("读取页面内小红书媒体信息完成，获取视频数：" + document.querySelectorAll(".optionWrapper").length, true);
        }
    } else {
        var arrayLength = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.imageList.length;
        if (arrayLength != 0) {
            for (var i = 0; i < arrayLength; i++) {
                var image = initialStateJSON.note?.noteDetailMap[小红书ID]?.note?.imageList[i];
                文件名ID = image.fileId;
                if (文件名ID === "") {
                    dfturl = image.urlDefault;
                    文件名ID = dfturl.substring(dfturl.lastIndexOf("/") + 1, dfturl.lastIndexOf("!"));
                }
                height = image.height;
                新文件名 = `${用户名}----${用户id}----${文案}----${小红书ID}----${文件名ID}----${时间}_${IP地址}.png`;
                if (新文件名.length > 360) {
                    const maxLength = 360 - (新文件名.length - text.length);
                    const 文案 = text.substring(0, maxLength);
                    新文件名 = `${用户名}----${用户id}----${文案}----${小红书ID}----${文件名ID}----${时间}_${IP地址}.mp4`;
                }
                mediaurl = `http://ci.xiaohongshu.com/${文件名ID}?imageView2/2/w/format/png`;
                mediaurl2 = `https://ci.xiaohongshu.com/spectrum/${文件名ID}?imageView2/2/w/0/format/jpg/v3`;
                mediaurl3 = `https://sns-img-hw.xhscdn.net/${文件名ID}`;
                if (下载方式 === 1) {
                    文件类型 = "webp"
                    mediajs.push({ 用户名: 用户名, 文章ID: 小红书ID, 文件ID: 文件名ID, url: mediaurl, url2: mediaurl2, url3: mediaurl3, 文件名: 新文件名.replace(/[\\/:*?"<>|,;#%]/g, ' '), 文件类型: 文件类型 });
                } else {
                    const obj = {
                        filename: 文件名,
                        url: mediaurl,
                        小红书ID: 小红书ID,
                        dfturl
                    };
                    resultList.push(obj);
                }
            }


        }
    }
    if (下载方式 === 1) {
        console.log('开始准备发送信息');
        downjs.media = mediajs;
        downjs.下载名称 = `《${用户名}》 \n ${文案}`;
        downjs.小红书ID = 小红书ID;
        按钮.setAttribute('down_status', 'wait');
        downjs.目录 = savedDirectoryPath;//+ 用户名.replace(/[<>:"/\\|?*\x00-\x1F\ud800-\udfff]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g, '')
        媒体发送下载(JSON.stringify(downjs), 按钮);
        // console.log(downjs, JSON.stringify(downjs));
    } else {
        创建列表框(resultList, 按钮);
        showToast("读取页面内小红书媒体信息完成，获取图片数：" + document.querySelectorAll(".optionWrapper").length, true);
    }
}


function 媒体发送下载(post, 按钮) {
    let 下载情况 = '';
    let 正常 = false;
    let 异常 = false;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 服务器地址, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    let returnjson = JSON.parse(xhr.responseText)
                    if (returnjson.msg.下载.下载状态 === 'true') {
                        按钮.setAttribute('down_status', 'success');
                        异常 = false;
                    } else {
                        按钮.setAttribute('down_status', 'fail');
                        异常 = true;
                    }
                    下载情况 = returnjson.msg.下载.下载状况;
                    // console.log(xhr.responseText)
                    正常 = true;
                    创建下载记录列表框(下载情况, true, 异常);
                    添加成功下载文件2(returnjson.小红书ID);
                } catch {
                    showToast('响应内容错误', xhr.responseText);
                }

            } else if (xhr.status === 404) {
                下载情况 = '视频：网络状态{' + xhr.status + ",资源未找到";
            } else if (xhr.status === 500) {
                下载情况 = '视频：网络状态{' + xhr.status + ",服务器内部错误";
            } else {
                下载情况 = '视频：网络状态{' + xhr.status + ",网络错误或其他错误";
            }
            if (!正常) {
                按钮.setAttribute('down_status', 'fail');
                判断服务器();
            }
            showToast(下载情况, 正常);
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(post);
}
function 图片下载(post, index, 按钮) {
    var 下载情况 = '';
    let 正常 = false;
    let 异常 = false;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 服务器地址, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let returnjson = JSON.parse(xhr.responseText);
                if (returnjson.下载.下载状态 === "下载完毕") {
                    按钮.setAttribute('down_status', 'success');
                    异常 = false;
                } else {
                    按钮.setAttribute('down_status', 'fail');
                    异常 = true;
                }
                正常 = true;
                下载情况 = '图片（' + (index + 1) + '）' + returnjson.用户名 + '--' + returnjson.文案.substring(0, 10) + '--' + returnjson.小红书ID + returnjson.下载.下载状态;
                // console.log(xhr.responseText)
                创建下载记录列表框(下载情况, true, 异常);
            } else {
                if (xhr.status === 404) {
                    下载情况 = '图片（' + (index + 1) + '）--网络状态{' + xhr.status + '},资源未找到\n';
                } else {
                    if (xhr.status === 500) {
                        下载情况 = '图片（' + (index + 1) + '）--网络状态{' + xhr.status + ',服务器内部错误\n';
                    } else {
                        下载情况 = '图片（' + (index + 1) + '）--网络状态{' + xhr.status + ',网络错误或其他错误\n';
                    }
                }
            }
            if (!正常) {
                按钮.setAttribute('down_status', 'fail');
                判断服务器();
            }
            showToast(下载情况, true);

        }
    };
    xhr.onerror = function () {
        showToast('发生网络错误');
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(post);
}
function 评论图片下载(post, index, 按钮, 评论ID) {
    let 下载情况 = '';
    let 正常 = false;
    let 异常 = false;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 服务器地址, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let returnjson = JSON.parse(xhr.responseText)
                if (returnjson.下载.下载状态 === "下载完毕") {
                    按钮.setAttribute('down_status', 'success');
                    添加成功下载文件(评论ID)
                    异常 = false;
                    正常 = true;
                } else {
                    异常 = true;
                }
                下载情况 = '图片（' + (index + 1) + '）' + returnjson.用户名 + '--' + returnjson.文案.substring(0, 10) + '--' + returnjson.小红书ID + returnjson.下载.下载状态;

                // console.log(xhr.responseText)
                创建下载记录列表框(下载情况, true, 异常);
            } else if (xhr.status === 404) {
                下载情况 = '评论图片（' + (index + 1) + '）--网络状态{' + xhr.status + '},资源未找到\n';
            } else if (xhr.status === 500) {
                下载情况 = '评论图片（' + (index + 1) + '）--网络状态{' + xhr.status + ',服务器内部错误\n';
            } else {
                下载情况 = '评论图片（' + (index + 1) + '）--网络状态{' + xhr.status + ',网络错误或其他错误\n';
            }

            if (!正常) {
                按钮.setAttribute('down_status', 'fail')
                判断服务器();
            }
            showToast(下载情况, 正常);
        }
    };
    xhr.onerror = function () {
        showToast('发生网络错误');
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(post);
}
function 小红书媒体(authorWrapperElements) {
    // 遍历匹配的元素列表
    authorWrapperElements.forEach(function (element) {
        if (!element.querySelector('.meiti_button')) {
            var linkElement = element.parentNode?.parentNode?.querySelector('a');
            if (linkElement) {
                var link = linkElement.getAttribute('href');
                var 小红书ID = link.substring(link.lastIndexOf('/') + 1);
                if (小红书ID != "") {
                    var xiazai = 本地下载按钮元素创建();
                    下载记录查询(小红书ID, xiazai);
                    xiazai.className = "loca_download";
                    // 添加鼠标点击事件
                    xiazai.addEventListener("click", function () {
                        xiazai.setAttribute('down_status', 'wait');
                        访问获取笔记源码(小红书ID, 0, xiazai);
                    })
                    element.appendChild(xiazai);
                    var meiti_send_button = document.createElement('div');
                    meiti_send_button.className = "meiti_send_button";
                    // 添加鼠标点击事件
                    下载记录查询2(小红书ID, meiti_send_button);
                    meiti_send_button.addEventListener("click", function () {
                        meiti_send_button.setAttribute('down_status', 'wait');
                        访问获取笔记源码(小红书ID, 1, meiti_send_button);
                    })
                    element.appendChild(meiti_send_button);
                }
            }
        }
    });
}

function 评论媒体(authorWrapperElements) {
    // 遍历匹配的元素列表
    authorWrapperElements.forEach(function (element) {
        if (!element.querySelector('.loca_download')) {
            // 添加鼠标点击事件
            var linkElement = element.parentNode?.parentNode?.parentElement?.id;
            if (linkElement) {
                var 小红书ID = linkElement.substring(linkElement.lastIndexOf('-') + 1);
                if (小红书ID != "") {
                    var xiazai = 本地下载按钮元素创建();
                    下载记录查询(小红书ID, xiazai);
                    xiazai.className = "loca_download";
                    element.appendChild(xiazai);
                    xiazai.addEventListener("click", function () {
                        xiazai.setAttribute('down_status', 'wait');
                        outerLoop: for (var i = 0; i < globalJSON.length; i++) {
                            const comments = globalJSON[i]?.data?.comments;
                            if (comments) {
                                for (var j = 0; j < comments.length; j++) {
                                    if (comments[j].id === 小红书ID) {
                                        let url, 文件名, 文件名ID, 用户名, 用户id, 文件类型, 文案, json;
                                        url = comments[j].pictures?.[0]?.url_default;
                                        if (url) {
                                            文件名ID = url.match(/([^/]+)$/)[0].split('!')[0]
                                            文案 = comments[j].content;
                                            用户名 = comments[j].user_info?.nickname;
                                            用户id = comments[j].user_info?.user_id;
                                            文件名 = 用户名 + '----' + comments[j].note_id + '----{评论}' + 文案 + '----' + 用户id + '----' + 文件名ID + '----' + 时间转换(comments[j].create_time) + '（1）.png'
                                            文件名 = 文件名.replace(/[\\/:*?"<>|,;#%]/g, '');
                                            文件类型 = 'png';
                                            mediajs.push({ 用户名: 用户名, 文章ID: 小红书ID, 文件ID: 文件名ID, url: mediaurl, url2: mediaurl2, url3: mediaurl3, 文件名: 文件名.replace(/[\\/:*?"<>|,;#%]/g, ''), 文件类型: 文件类型 });

                                            json = JSON数据(url, 文件名ID, 文案, 用户名, 用户id, 文件保存目录, 文件名, 文件类型, 小红书ID)
                                            评论图片下载(json, 0, xiazai);
                                            break outerLoop; // 退出外部循环
                                        }
                                    }
                                    const sub_comments = comments[j].sub_comments;
                                    for (var k = 0; k < sub_comments.length; k++) {
                                        let url, 文件名, 文件名ID, 用户名, 用户id, 文件类型, 文案, json;
                                        if (sub_comments[k].id === 小红书ID) {
                                            url = sub_comments[k]?.pictures?.[0]?.url_default
                                            if (url) {
                                                url = sub_comments[k].pictures?.[0]?.url_default;
                                                文件名ID = url.match(/([^/]+)$/)[0]?.split('!')[0];
                                                文案 = sub_comments[k].content;
                                                用户名 = sub_comments[k].user_info?.nickname;
                                                用户id = sub_comments[k].user_info?.user_id;
                                                文件名 = 用户名 + '----' + sub_comments[k].note_id + '----{评论}' + 文案 + '----' + 用户id + '----' + 文件名ID + '----' + 时间转换(sub_comments[k].create_time + '（1）.png')
                                                文件名 = 文件名.replace(/[\\/:*?"<>|,;#%]/g, '');
                                                文件类型 = 'png';
                                                json = JSON数据(url, 文件名ID, 文案, 用户名, 用户id, 文件保存目录, 文件名, 文件类型, 小红书ID);
                                                评论图片下载(json, 0, xiazai);
                                                break outerLoop; // 退出外部循环
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    })
                }
            }


        }
        // 在这里执行你的逻辑操作
    });
}

function 评论框(authorWrapperElements) {
    // 遍历匹配的元素列表
    authorWrapperElements.forEach(function (element) {
        element.querySelector('.chat-wrapper')?.remove();
        //创建本地解析笔记按钮
        if (!element.querySelector('.meiti_button')) {
            let 小红书ID = window.location.href.match(/\b[A-Fa-f0-9]{16,}\b/g)[0];
            var xiazai = 本地下载按钮元素创建();
            xiazai.className = "meiti_button loca_download";
            下载记录查询(小红书ID, xiazai);
            // 添加鼠标点击事件
            xiazai.addEventListener("click", function () {
                xiazai.setAttribute('down_status', 'wait');
                访问获取笔记源码(小红书ID, 0, xiazai);
            })
            element.querySelector('.share-wrapper').appendChild(xiazai);
            //创建发送笔记URL至网页文件下载按钮
            var meiti_send_button = document.createElement('div');
            meiti_send_button.className = "meiti_send_button";
            meiti_send_button.style.margin = '5px';
            meiti_send_button.style.display = 'inline-block';
            meiti_send_button.style.verticalAlign = 'middle';
            下载记录查询2(小红书ID, meiti_send_button);
            // 添加鼠标点击事件
            meiti_send_button.addEventListener("click", function () {
                let initialStateText = JSON.stringify(unsafeWindow.__INITIAL_STATE__);
                笔记源码分析(initialStateText, 1, meiti_send_button);
            })
            element.querySelector('.share-wrapper').appendChild(meiti_send_button);
        }
    });
}

function JSON数据(url, url2, url3, 文件名ID, 文案, 用户名, 用户id, 目录, 文件名, 文件类型, 小红书ID, prvurl, dfturl) {
    let json = {
        url: url,
        url2: url2,
        url3: url3,
        文件名ID: 文件名ID,
        文案: 文案,
        用户名: 用户名,
        用户id: 用户id,
        目录: 目录,
        文件名: 文件名,
        文件类型: 文件类型,
        小红书ID: 小红书ID,
        prvurl: prvurl,
        dfturl: dfturl
    };
    return JSON.stringify(json);
}

function 下载记录查询(小红书ID, 按钮_参数) {
    var mediajson = localStorage.getItem('mediacompleted');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    if (mediajson.includes(小红书ID)) {
        按钮_参数.setAttribute('down_status', 'success');
    } else {
        按钮_参数.setAttribute('down_status', 'download');
    }
}
function 下载记录查询2(小红书ID, 按钮_参数) {
    var mediajson = localStorage.getItem('mediacompleted2');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    if (mediajson.includes(小红书ID)) {
        按钮_参数.setAttribute('down_status', 'success');
    } else {
        按钮_参数.setAttribute('down_status', 'download');
    }
}
function 添加成功下载文件(推文ID) {
    var mediajson = localStorage.getItem('mediacompleted');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    mediajson.push(推文ID);
    localStorage.setItem('mediacompleted', JSON.stringify(mediajson));
}
function 添加成功下载文件2(推文ID) {
    var mediajson = localStorage.getItem('mediacompleted2');
    if (!mediajson) {
        mediajson = [];
    } else {
        mediajson = JSON.parse(mediajson);
    }
    mediajson.push(推文ID);
    localStorage.setItem('mediacompleted2', JSON.stringify(mediajson));
}
// function 发送数据置下载服务端(post){
//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', 服务器地址, false); // 第三个参数设置为false表示同步请求
//   xhr.send(post);

//   if (xhr.status === 200) {
//   console.log(xhr.responseText);
//   } else {
//   console.log('请求失败：' + xhr.status);
//   }
// }
function 本地下载按钮元素创建() {
    var 下载 = document.createElement('div');
    var 下载按钮SVG = `<div class='背景'><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">
        <g class="download"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></g>
        <g class="completed"><path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l3,4 q1,1 2,0 l8,-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></g>
        <g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.4"></circle><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round"></path></g>
        <g class="failed"><circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8"></circle><path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none"></path></g>
        </svg></div>`
    下载.innerHTML = 下载按钮SVG;
    return 下载;
}

function 时间转换(timestamp) {
    timestamp.toString().padEnd(13, '0');
    // 创建一个新的 Date 对象并使用时间戳初始化它
    var date = new Date(timestamp);
    // 使用 Date 对象的方法获取年、月、日、时、分和秒
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    // 组合成所需的日期时间格式
    return year + '-' + month + '-' + day + ' ' + hours + ' ' + minutes + ' ' + seconds;
}
//复制内容到剪辑版
function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
function 请求服务端下载(jsonData, 按钮) {
    get(服务器地址, jsonData, function (response) {
        console.log(response);
        let retrunjson = JSON.parse(response);
        if (retrunjson.下载.网络访问) {
            showToast("评论图片：" + retrunjson.用户名 + '--' + retrunjson.小红书ID + '--' + retrunjson.下载.网络访问)
            按钮.setAttribute('down_status', 'fail')
        } else {
            showToast("评论图片：" + retrunjson.用户名 + '--' + retrunjson.小红书ID + '--' + retrunjson.下载.下载状态)
            按钮.setAttribute('down_status', 'fail')
        }

    });
}


function showToast(message, isError) {
    // 创建新的提示框
    const toastContainer = document.createElement('div');
    // 设置样式属性
    toastContainer.style.position = 'fixed';
    toastContainer.style.justifyContent = 'center';
    toastContainer.style.top = '30%';
    toastContainer.style.left = '50%';
    toastContainer.style.width = '65vw';
    toastContainer.style.margin = '10px 0 0 0';
    toastContainer.style.transform = 'translate(-50%, -50%)';
    toastContainer.style.display = 'flex';
    toastContainer.style.padding = '5px';
    toastContainer.style.fontSize = '20px';
    toastContainer.style.background = '#e7f4ff';
    toastContainer.style.zIndex = '999';
    toastContainer.style.borderRadius = '15px';
    toastContainer.classList.add('PopupMessage'); // 设置 class 名称为 PopupMessage
    // 根据是否为错误提示框添加不同的样式
    if (isError) {
        toastContainer.classList.add('success');
        toastContainer.style.color = '#3fc91d';
    } else {
        toastContainer.classList.add('error');
        toastContainer.style.color = '#CC5500';
    }
    // 将提示框添加到页面中
    document.body.appendChild(toastContainer);
    // 获取页面高度的 20vh
    const windowHeight = window.innerHeight;
    //设置最低的高度。
    const height = windowHeight * 0.2;
    // 设置当前提示框的位置
    toastContainer.style.top = `${height}px`;
    // 在页面中插入新的信息
    const toast = document.createElement('div');
    // 使用 <br> 实现换行
    toast.innerHTML = message.replace(/\n/g, '<br>');
    toastContainer.appendChild(toast);
    // 获取所有的弹出信息元素，包括新添加的元素
    const popupMessages = document.querySelectorAll('.PopupMessage');
    // 调整所有提示框的位置
    let offset = 0;
    popupMessages.forEach(popup => {
        if (popup !== toastContainer) {
            popup.style.top = `${parseInt(popup.style.top) - toast.offsetHeight - 5}px`;
        }
        offset += popup.offsetHeight;
    });
    // 在 3 秒后隐藏提示框
    setTimeout(() => {
        toastContainer.classList.add('hide');
        // 过渡动画结束后移除提示框
        setTimeout(() => {
            toastContainer.parentNode.removeChild(toastContainer);
        }, 300);
    }, 3000);
}


监测页面请求();
function 监测页面请求() {
    // 保存原始的 XMLHttpRequest 对象
    var originalXhrOpen = XMLHttpRequest.prototype.open;
    var originalXhrSend = XMLHttpRequest.prototype.send;
    // 重写 XMLHttpRequest 的 open 方法
    XMLHttpRequest.prototype.open = function (method, url) {
        //console.log('发起网络请求：', method, url);
        // 保存请求URL
        this.__url = url;
        if (阻止更新页面内容 === true) {
            if (url.includes('api/sns/web/v1/homefeed') || url.includes('api/sns/web/v1/search') || url.includes('api/sns/web/v1/note/like/page') || url.includes('/api/sns/web/v2/note/collect/page')) {
                return;
            }

        }
        // 调用原始的 open 方法
        originalXhrOpen.apply(this, arguments);
    };
    // 重写 XMLHttpRequest 的 send 方法
    XMLHttpRequest.prototype.send = function (data) {
        var xhr = this;
        // 监听请求完成事件
        xhr.addEventListener('load', function () {
            console.log('load', xhr.__url)
            // console.log('请求URL：', xhr.__url);
            // console.log('请求头：', xhr.getAllResponseHeaders());
            // console.log('响应内容：', xhr.responseText);
            try {
                数据判断(xhr.__url, xhr.responseText);
            } catch {

            }

        });

        // 调用原始的 send 方法
        originalXhrSend.apply(this, arguments);
    };
    // 监听 fetch 请求
    if (window.fetch) {
        var originalFetch = window.fetch;

        window.fetch = function (url, options) {
            //console.log('发起网络请求：', url, options);

            // 调用原始的 fetch 方法
            return originalFetch.apply(this, arguments)
                .then(function (response) {
                    //console.log('响应URL：', response.url);
                    //console.log('响应头：', response.headers);
                    return response.text().then(function (text) {
                        //console.log('响应内容：', text);
                        数据判断(response.url, text);
                        return new Response(text, response);
                    });
                });
        };
    }
}
function 数据判断(url, text) {
    if (url.includes("comment/page") && url.includes("cursor=")) {
        if (url.includes("cursor=&")) {
            globalJSON = [];
        }
        try {
            // 将响应内容解析为 JSON
            const jsonResponse = JSON.parse(text);
            // 将 JSON 添加到全局变量
            globalJSON.push(jsonResponse);
        } catch (error) {
            console.log("解析响应内容为 JSON 时出错：", error);
        }
    } else {
        if (url.includes('comment/sub/page')) {
            try {
                // 将响应内容解析为 JSON
                const jsonResponse = JSON.parse(text);
                // 将 JSON 添加到全局变量
                subJSON.push(jsonResponse);
                console.log("评论包", subJSON);
            } catch (error) {
                console.log("解析响应内容为 JSON 时出错：", error);
            }
        } else {
            if (url.includes('explore/')) {
                try {
                    页面源码 = text;
                    console.log("监测页面源码", subJSON);
                } catch (error) {
                    console.log("解析响应内容为 JSON 时出错：", error);
                }
            }
        }
    }
}

// //网络请求监测
// (function () {
//   // 重写 XMLHttpRequest 对象的 open 方法
//   var realOpen = XMLHttpRequest.prototype.open;
//   XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
//   realOpen.apply(this, arguments);
//   };

//   // 重写 XMLHttpRequest 对象的 send 方法
//   var realSend = XMLHttpRequest.prototype.send;
//   XMLHttpRequest.prototype.send = function (data) {
//   var self = this;
//   var onload = this.onload;
//   this.onload = function () {
//     var url = self.responseURL;
//     console.log('链接',url)
//     // 判断 URL 是否包含 "comment/page" 和 "cursor="
//     if (url.includes("comment/page") && url.includes("cursor=")) {
//       if (url.includes("cursor=&")) {
//       globalJSON = [];
//       }
//       try {
//       // 将响应内容解析为 JSON
//       const jsonResponse = JSON.parse(self.responseText);
//       // 将 JSON 添加到全局变量
//       globalJSON.push(jsonResponse);
//       } catch (error) {
//       console.log("解析响应内容为 JSON 时出错：", error);
//       }
//     } else {
//       if (url.includes('comment/sub/page')) {
//       try {
//         // 将响应内容解析为 JSON
//         const jsonResponse = JSON.parse(self.responseText);
//         // 将 JSON 添加到全局变量
//         subJSON.push(jsonResponse);
//         console.log("评论包", subJSON);
//       } catch (error) {
//         console.log("解析响应内容为 JSON 时出错：", error);
//       }
//       }else{
//       if (url.includes('explore/')) {
//         try {
//           页面源码=self.responseText;
//           console.log("页面源码", subJSON);
//         } catch (error) {
//           console.log("解析响应内容为 JSON 时出错：", error);
//         }
//       }
//       }
//     }

//     if (typeof onload === 'function') {
//       onload.apply(self, arguments);
//     }
//   };
//   realSend.apply(this, arguments);
//   };

// })()

//元素移动函数
function dragMenu(menuObj, e) {
    e = e ? e : window.event;
    if (e.target !== menuObj) {
        return; // 如果点击的不是父元素本身，则不执行拖动操作
    }
    // || e.target.tagName === 'BUTTON' 判断是否为按钮元素
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
    }
    let dragData = {
        startX: e.clientX,
        startY: e.clientY,
        menuLeft: menuObj.offsetLeft,
        menuTop: menuObj.offsetTop
    };
    document.onmousemove = function (e) { try { dragMenu(menuObj, e); } catch (err) { } };
    document.onmouseup = function (e) { try { stopDrag(menuObj); } catch (err) { } };
    doane(e);
    function stopDrag(menuObj) {
        document.onmousemove = null;
        document.onmouseup = null;
    }
    function doane(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
    document.onmousemove = function (e) {
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        let menuLeft = dragData.menuLeft + mouseX - dragData.startX;
        let menuTop = dragData.menuTop + mouseY - dragData.startY;
        menuObj.style.left = menuLeft + 'px';
        menuObj.style.top = menuTop + 'px';
        doane(e);
    }
}

// 监测页面请求()
// function 监测页面请求(){
//   // 拦截 XMLHttpRequest 请求
//   var realXhr = window.XMLHttpRequest;
//   window.XMLHttpRequest = function () {
//     var xhr = new realXhr();
//     var currentUrl; // 声明 currentUrl 变量
//     // 重写 xhr.open 方法
//     console.log('请求链接',currentUrl);
//     var realOpen = xhr.open;
//     xhr.open = function (method, url, async, user, password) {
//       currentUrl = url; // 将当前请求的 URL 赋值给 currentUrl
//       realOpen.apply(this, arguments);
//     };
//     // 重写 xhr.send 方法
//     var realSend = xhr.send;
//     xhr.send = function (data) {
//       this.addEventListener('load', function () {
//       // 判断是否包含有 "comment/page" 和 "cursor=" 的 URL 请求
//       console.log('响应链接',currentUrl);
//       if (currentUrl.includes("comment/page") && currentUrl.includes("cursor=")) {
//         if(currentUrl.includes("cursor=&")){
//           globalJSON = [];
//         }
//         // console.log("响应状态码：", xhr.status);
//         // console.log("响应头：", xhr.getAllResponseHeaders());
//         // console.log("响应体：", xhr.responseText);
//         try {
//           // 将响应内容解析为 JSON
//           const jsonResponse = JSON.parse(xhr.responseText);
//           // 将 JSON 添加到全局变量
//           globalJSON.push(jsonResponse);
//           // var secondMember = globalJSON[1]?.data?.comments[0]?.content;
//           console.log("评论包", jsonResponse);
//         } catch (error) {
//           console.log("解析响应内容为 JSON 时出错：", error);
//         }
//       }
//       //更多回复
//       if (currentUrl.includes("comment/sub/page")) {
//         // console.log("响应状态码：", xhr.status);
//         // console.log("响应头：", xhr.getAllResponseHeaders());
//         // console.log("响应体：", xhr.responseText);
//         try {
//           // 将响应内容解析为 JSON
//           const jsonResponse = JSON.parse(xhr.responseText);
//           // 将 JSON 添加到全局变量
//           subJSON.push(jsonResponse);
//           // var secondMember = globalJSON[1]?.data?.comments[0]?.content;
//           console.log("评论包",jsonResponse);
//         } catch (error) {
//           console.log("解析响应内容为 JSON 时出错：", error);
//         }
//       }
//       });
//       realSend.apply(this, arguments);
//     };
//     // 重写 xhr.setRequestHeader 方法
//     var realSetRequestHeader = xhr.setRequestHeader;
//     xhr.setRequestHeader = function (header, value) {
//       realSetRequestHeader.apply(this, arguments);
//     };

//     // 重写 xhr.getRequestHeader 方法
//     var realGetRequestHeader = xhr.getRequestHeader;
//     xhr.getRequestHeader = function (header) {
//       return realGetRequestHeader.apply(this, arguments);
//     };

//     return xhr;
//   };
// }

function 当前页全赞() {
    var collection = document.querySelectorAll('[class="reds-icon like-icon"] use');
    for (let name of collection) {
        if (name.getAttribute('xlink:href') === '#like') {
            name.parentElement.parentElement.click();
        }
        console.log();
    }
}