// ==UserScript==
// @name         【学习通刷课助手】||防止鼠标移出暂停|章节结束自动跳转|章节测试[调用AI接口答题，正确率待验证]
// @namespace    http://tampermonkey.net/
// @version      3.0.7
// @description  学习通课程自动挂机，当前脚本支持课程视频播放完成，自动跳转下一小节，章节测试自动跳过，后台播放防止视频暂停，章节测试刷题。
// @author       Sweek
// @match        *://*.chaoxing.com/*
// @license      GPLv3
// @icon         https://www.sweek.top/api/preview/avatar.jpg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://update.greasyfork.org/scripts/522188/1511411/typrmd5_sweek.js
// @resource     Table https://www.sweek.top/api/preview/table.json
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/493583/%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%91%7C%7C%E9%98%B2%E6%AD%A2%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%87%BA%E6%9A%82%E5%81%9C%7C%E7%AB%A0%E8%8A%82%E7%BB%93%E6%9D%9F%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%7C%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%5B%E8%B0%83%E7%94%A8AI%E6%8E%A5%E5%8F%A3%E7%AD%94%E9%A2%98%EF%BC%8C%E6%AD%A3%E7%A1%AE%E7%8E%87%E5%BE%85%E9%AA%8C%E8%AF%81%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/493583/%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%91%7C%7C%E9%98%B2%E6%AD%A2%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%87%BA%E6%9A%82%E5%81%9C%7C%E7%AB%A0%E8%8A%82%E7%BB%93%E6%9D%9F%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%7C%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%5B%E8%B0%83%E7%94%A8AI%E6%8E%A5%E5%8F%A3%E7%AD%94%E9%A2%98%EF%BC%8C%E6%AD%A3%E7%A1%AE%E7%8E%87%E5%BE%85%E9%AA%8C%E8%AF%81%5D.meta.js
// ==/UserScript==



GM_setValue("playbackRate", GM_getValue("playbackRate") || 1);
GM_setValue("volume", GM_getValue("volume") || 0);
GM_setValue("courseImg", GM_getValue("courseImg") || '');
GM_setValue("testType", GM_getValue("testType") || 'save');
GM_setValue("ifTest", GM_getValue("ifTest") || 'skip');
GM_setValue("asyncCourseInterval", GM_getValue("asyncCourseInterval") || '300000');
GM_setValue("taskInterval", GM_getValue("taskInterval") || '6000');
GM_setValue("testInterval", GM_getValue("testInterval") || '4000');
GM_setValue("ifReview", GM_getValue("ifReview") || '0');
GM_setValue("savedEmail", GM_getValue("savedEmail") || '');
GM_setValue("activeTab", GM_getValue("activeTab") || 'tab1');


// 定义全局变量
let readNum = 0 // 已读公告次数
let activeTab = GM_getValue("activeTab") // 当前选中tab
let currentTime = null // 当前视频当前播放节点
let duration = null // 当前视频总长度
let progress = null // 当前视频播放进度
let playbackRate = GM_getValue("playbackRate") // 当前视频播放倍速
let volume = GM_getValue("volume") // 当前视频音量

// 课程章节相关数据
let courseName = null // 当前课程名称
let courseId = null // 当前课程id
let courseImg = GM_getValue("courseImg") // 当前课程封面
let chapterInfo = [] // 当前课程所有章节数据
let currentChapterId = null // 当前所在章节id
let currentChapterName = null // 当前所在章节名称
let allChapterName = []  // 所有章节名称
let videoProgressId = '' // 定时监听页面内容监听事件
let syncCourseId = '' // 定时监听同步任务事件

// 同步课程时间间隔
let asyncCourseInterval = GM_getValue("asyncCourseInterval")

// 任务间隔
let taskInterval = GM_getValue("taskInterval")

// 是否复习模式
let ifReview = GM_getValue("ifReview")


// 章节测试数据
let testDom = null
let ifTest = GM_getValue("ifTest")
let testType = GM_getValue("testType")
let testTasks = []
let testBtnDocument = null

let testInterval = GM_getValue("testInterval")

// 获取当前页面的 URL
url = ''
chapterId = ''


let arrayEchelon = []; // 顺序执行梯队，初始化为空数组
const dealEvent = new Event("redeal", { bubbles: false, cancelable: false });
let testArrayEchelon = []; // 顺序执行梯队，初始化为空数组
const testDealEvent = new Event("testRedeal", { bubbles: false, cancelable: false });

// AI请求接口Url
const fetch_url ='https://www.sweek.top/model/sse/data?text='

// 页面模板部分
// 页面模板部分
// 页面模板部分

// 页面样式
var popCSs = `
#my-window {
  position: fixed;
  top: 5px;
  left: 20px;
  width: 400px;
  height: auto;
  background-color: rgb(255, 255, 255);
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 9999;
  overflow: hidden;
  padding: 0 5px 0px 0;
  font-family: fangsong;
  font-weight: bold;

  .header {
    background-color: #248067;
    color: #fff;
    padding: 5px;
    font-size: 16px;
    font-family: 'fangsong';
    font-weight: bold;
    border-radius: 0px;
    cursor: move;
    height: 50px;
    width: 400px;
    padding-left: 10px;

    .btn-content {
      width: 400px;
      display: flex;
      .btn {
        height: 22px;
        width: auto;
        margin-right: 4px;
        background-color: #fff;
        border: 1px solid #fff;
        border-radius: 2px;
        font-size: 12px;
        padding: 0 5px;
        font-family: 'fangsong';
        cursor: pointer;
        font-weight: bold;
        color: #248067;
        i {
          margin-right: 2px;
        }
      }

      .btn:hover {
        background-color: #248067;
        color: #fff;
      }
    }
  }

  .content {
    width: 400px;
    height: auto;
    background-color: rgb(255, 255, 255);
    .tab-bar {
      width: 395px;
      display: flex;
      background-color:rgb(255, 255, 255);
      color: white;
      padding: 5px;
      cursor: pointer;
      .tab {
        flex: 1;
        text-align: center;
        padding: 5px;
        background-color: #555;
        i {
          margin-right: 2px;
        }
      }
      div:hover {
        background-color: #666;
      }
      div.active {
        background-color: #248067;
      }
    }

    .content-title {
      height: 20px;
      width: 380px;
      background-color: #fff;
      color: #248067;
      line-height: 20px;
      padding-left: 5px;
      font-size: 15px;
      font-family: 'fangsong';
      font-weight: bold;
      border-left: 4px solid #248067;
      margin-top: 0px;
      margin-bottom: 0px;
    }

    .content-notice {
      height: 500px;
      width: 380px;
      overflow: auto;
      border: 1px solid #ccc;
      border-radius: 2px;
      padding: 5px;
      margin-top: 8px;
      font-size: 12px;
      font-weight: bold;
      display: block;
    }

    .content-process {
      height: 475px;
      width: 380px;
      overflow: auto;
      border: 1px solid #ccc;
      border-radius: 2px;
      padding: 5px;
      margin-top: 8px;
      display: none;
    }

    .content-log {
      height: 500px;
      width: 380px;
      overflow: auto;
      border: 1px solid #ccc;
      background-color: #222;
      color: #fff;
      border-radius: 2px;
      padding: 5px;
      margin-top: 8px;
      display: none;
      line-height: 22px;
    }

    .content-set {
      height: 500px;
      width: 380px;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid #ccc;
      border-radius: 2px;
      padding: 5px;
      margin-top: 8px;
      display: none;

      .content-set-title {
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        padding: 0 5px;
        font-size: 13px;
        color: #248067;

        i {
          margin-right: 4px;
          font-size: 14px;
        }
      }

      .content-set-tips {
        margin-bottom: 5px;
        font-family: 'fangsong';
        font-weight: bold;
        padding: 5px;
        margin: 5px;
        background-color: #42b88433;
      }

      .content-set-content {
        width: 370px;
        display: flex;
        justify-content: space-between;
        padding: 5px 5px;
        font-size: 13px;

        .control {
          width: 270px;
          height: 22px;
          display: flex;

          #ifReviewSelect,
          #playbackRateSelect,
          #volumeSelect,
          #ifTestSelect,
          #testTypeSelect,
          #taskIntervalSelect,
          #asyncCourseIntervalSelect,
          #testIntervalSelect {
            width: 260px;
            height: 22px;
            border-radius: 3px;
            border: 1px solid gray;
            font-size: 13px;
            font-family: fangsong;
            font-weight: bold;
            cursor: pointer;
          }
        }

        #email-input {
          width: 215px;
          height: 22px;
          border-radius: 3px;
          border: 1px solid gray;
          font-size: 13px;
          font-family: fangsong;
          font-weight: bold;
        }

        #save-btn {
          width: 40px;
          height: 24px;
          border-radius: 3px;
          border: 1px solid #888;
          font-size: 13px;
          font-family: fangsong;
          font-weight: bold;
          cursor: pointer;
          background-color: #fff;
          margin-left: 5px;
        }
        #save-btn:hover {
          background-color: #248067;
          color: #fff;
        }
      }
    }
  }

  .resizer {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: #248067;
    cursor: se-resize;
    border-radius: 0px;
    z-index: 1;
  }
}

#hide-btn {
  height: 25px;
  width: auto;
  float: right;
  margin-right: 10px;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 4px;
  font-size: 12px;
  padding: 0 5px;
  font-family: 'fangsong';
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #248067;
    color: #fff;
  }
}

#hide-notice-btn,
#hide-process-btn,
#hide-log-btn,
#hide-set-btn {
  height: 20px;
  line-height: 20px;
  width: auto;
  background-color: #fff;
  border: 1px solid gray;
  border-radius: 3px;
  font-size: 12px;
  padding: 0 5px;
  font-family: 'fangsong';
  cursor: pointer;
  float: right;

  &:hover {
    background-color: gray;
    color: #fff;
  }
}
`

// 页面Html
var popHtml = `
<div class="header">Sweek学习通助手[3.0.7]
  <button id="hide-btn">显示/隐藏</button>
  <div class="btn-content">
    <a href="https://www.sweek.top/usingtutorials" target="_blank">
      <button class="btn"><i class="bi bi-book"></i>使用教程</button>
    </a>
    <a href="https://www.sweek.top/api/scripts/常见问题.pdf" target="_blank">
      <button class="btn"><i class="bi bi-journal-x"></i>常见问题</button>
    </a>
    <a href="https://scriptcat.org/zh-CN/script-show-page/2453/comment" target="_blank">
      <button class="btn"><i class="bi bi-chat-square-heart"></i>给个好评</button>
    </a>
    <a href="https://scriptcat.org/zh-CN/users/150865" target="_blank">
      <button class="btn"><i class="bi bi-star"></i>点个关注</button>
    </a>
  </div>
</div>
<div class="content" id="my-window-content">
  <div class="tab-bar">
    <div id="tab1" class="tab active"><i class="bi bi-clipboard-fill"></i>通知公告</div>
    <div id="tab2" class="tab"><i class="bi bi-graph-up"></i>任务进度</div>
    <div id="tab3" class="tab"><i class="bi bi-code-slash"></i>执行日志</div>
    <div id="tab4" class="tab"><i class="bi bi-gear"></i>脚本配置</div>
  </div>
  <div class="row" style="padding: 5px;">
    <div class="content-title" id="content-title"></div>
    <div id="content-async-time"><span id="async-time">[任务进度同步中...]</span></div>
    <div class="content-notice" id="content-notice"></div>
    <div class="content-process" id="content-process"></div>
    <div class="content-log" id="content-log"></div>
    <div class="content-set" id="content-set">
      <div class="row" style="padding: 5px 0;border-bottom: 2px solid #579572;">
        <div class="content-set-title"><i class="bi bi-1-square-fill"></i>邮箱配置</div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>配置步骤（请按照步骤依次配置）
          </div>
          <div>
            <1>点击下方网站注册链接，跳转到网站SweekWebsite，<span style="text-decoration: underline;">进入首页，点击右上角注册/登录按钮，会弹出登录界面，然后使用邮箱进行注册。</span>
          </div>
          <div>
           [网站注册链接:
            <a href="https://www.sweek.top" style="color: dodgerblue" target="_blank">
              <span><i class="bi bi-link-45deg"></i>点击跳转，前往注册</span>
            </a>]
          </div>
          <div>
            <2>注册完成之后在下方邮箱输入框内输入刚才注册的邮箱地址，<span style="text-decoration: underline;">输入完成之后点击保存，弹出保存成功提示，说明邮箱配置成功。</span>
          </div>
          <div>
            <3>以上操作完成之后，可以正常使用章节测试AI答题，并且课程信息将会同步到网站SweekWebsite，<span style="text-decoration: underline;">可点击下方蓝色字体打开弹窗，微信扫码进入网站使用你的注册邮箱登录，查看课程进度。</span>
          </div>
          <div>
          [微信扫码弹窗:
          <a style="color: dodgerblue;cursor: pointer;" id="Qcode">
            <i class="bi bi-hand-index"></i>点击查看，微信扫码
          </a>]
          </div>
        </div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>邮箱区分大小写。
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[邮箱]</label>
          <div class="control">
            <input type="email" id="email-input" placeholder="请输入邮箱地址">
            <button id="save-btn">保存</button>
          </div>
        </div>
      </div>
       <div class="row" style="padding: 5px 0;border-bottom: 2px solid #579572;">
        <div class="content-set-title"><i class="bi bi-2-square-fill"></i>章节测试配置</div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>启用【处理章节测试】功能之前，必须先配置上方邮箱，否则无法启用。
          </div>
        </div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>由于本脚本暂时还未接入第三方题库，目前采用AI处理章节测试，鉴于AI对于理科类题目正确率过低以及图片类题目无法处理，如果您对于正确率有较高要求，建议在开启【处理章节测试】之后，将【章节测试完成】设置为【完成后暂时保存】。
          </div>
        </div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>任务进度中可查看答题情况，如果出现乱码会导致答题异常，那是由于油猴中使用的题目解密文件访问不通导致，请切换至【脚本猫】使用本脚本，或者【挂梯子】使用本脚本可解决乱码问题。
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[是否章节测试]</label>
          <div class="control">
            <select id="ifTestSelect">
              <option value="take">处理章节测试</option>
              <option value="skip">跳过章节测试</option>
            </select>
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[章节测试完成]</label>
          <div class="control">
            <select id="testTypeSelect">
              <option value="save">完成后暂时保存</option>
              <option value="submit">完成后提交</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row" style="padding: 5px 0;border-bottom: 2px solid #579572;">
        <div class="content-set-title"><i class="bi bi-3-square-fill"></i>功能配置</div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>启用复习模式之后，已完成的视频音频ppt将会加入任务中。
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[复习模式]</label>
          <div class="control">
            <select id="ifReviewSelect">
                <option value="1">启用</option>
                <option value="0">关闭</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row" style="padding: 5px 0;border-bottom: 2px solid #579572;">
        <div class="content-set-title"><i class="bi bi-4-square-fill"></i>视频配置</div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>【视频倍速】作者破解中，目前只能开启视频允许倍速。
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[视频倍速]</label>
          <div class="control">
            <select id="playbackRateSelect">
                <option value="1">1x</option>
                <option value="2">2x[部分场景使用]</option>
                <option value="3">3x[暂时无法使用]</option>
                <option value="4">4x[暂时无法使用]</option>
            </select>
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[视频音量]</label>
          <div class="control">
            <select id="volumeSelect">
              <option value="0">静音</option>
              <option value="0.2">20</option>
              <option value="0.4">40</option>
              <option value="0.6">60</option>
              <option value="0.8">80</option>
              <option value="1">100</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row" style="padding: 5px 0;border-bottom: 2px solid #579572;">
        <div class="content-set-title"><i class="bi bi-5-square-fill"></i>间隔时间配置</div>
        <div class="content-set-tips">
          <div>
            <i class="bi bi-info-circle"></i>【进度同步间隔】为本脚本将课程实时进度同步到邮箱账号的间隔时间。
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[进度同步间隔]</label>
          <div class="control">
            <select id="asyncCourseIntervalSelect">
              <option value="60000">1分钟</option>
              <option value="180000">3分钟</option>
              <option value="300000">5分钟</option>
              <option value="600000">10分钟</option>
            </select>
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[章节任务间隔]</label>
          <div class="control">
            <select id="taskIntervalSelect">
              <option value="4000">4s</option>
              <option value="6000">6s</option>
              <option value="8000">8s</option>
              <option value="10000">10s</option>
            </select>
          </div>
        </div>
        <div class="content-set-content">
          <label for="email-input">[章节测试间隔]</label>
          <div class="control">
            <select id="testIntervalSelect">
              <option value="4000">4s</option>
              <option value="6000">6s</option>
              <option value="8000">8s</option>
              <option value="10000">10s</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
// 初始化添加页面弹窗以及悬浮球
function initPopup() {
  // 添加CSS样式
  GM_addStyle(popCSs);
  // 创建窗口元素
  const myWindow = document.createElement("div");
  myWindow.id = "my-window";
  myWindow.innerHTML = popHtml;
  // 获取页面body元素
  const body = document.getElementsByTagName("body")[0];
  // 添加窗口和悬浮球到页面
  body.appendChild(myWindow);
  // 绑定隐藏窗口按钮的click事件
  const hideBtn = document.querySelector("#hide-btn");
  hideBtn.addEventListener("click", hideWindow);


  // 绑定隐藏公告按钮的click事件
  const tab1Btn = document.querySelector("#tab1");
  tab1Btn.addEventListener("click", function() {
    switchTab('tab1');
  });

  // 绑定隐藏播放进度按钮的click事件
  const tab2Btn = document.querySelector("#tab2");
  tab2Btn.addEventListener("click", function() {
    switchTab('tab2');
  });

  // 绑定隐藏日志按钮的click事件
  const tab3Btn = document.querySelector("#tab3");
  tab3Btn.addEventListener("click", function() {
    switchTab('tab3');
  });

  // 绑定隐藏设置按钮的click事件
  const tab4Btn = document.querySelector("#tab4");
  tab4Btn.addEventListener("click", function() {
    switchTab('tab4');
  });




  // 获取弹窗内容
  var htmlContent = '<div style="font-size: 16px;line-height: 25px;font-family: fangsong;">1.左侧二维码为网站SweekWebsite,登录可以查看课程进度（微信扫码），右侧二维码为qq脚本交流群（qq扫码）</div><div style="width: 100%; height: 400px;display: flex;justify-content: flex-start;align-items: center;"><img style="width: 400px; height: 400px;" src="https://www.sweek.top/api/preview/Qcode.png" alt=""><img style="height: 400px;" src="https://www.sweek.top/api/preview/Qrcode.jpg" alt=""></div><div style="font-size: 16px;line-height: 25px;font-family: fangsong;margin-top: 20px;">2.以下两张图片为同步的课程进度内容示意图,可以查看当前脚本挂机课程的实时进度信息</div><div><img style="height: 600px;" src="https://www.sweek.top/api/preview/demo1.jpg" alt=""><img style="height: 600px;" src="https://www.sweek.top/api/preview/demo2.jpg" alt=""></div>';

  // 点击链接显示弹窗
  document.getElementById('Qcode').addEventListener('click', function() {
    showCustomPopup(htmlContent, 800, 500);
  });
  

  // 获取头部元素
  const header = myWindow.querySelector('.header');

  // 处理移动事件
  let isDragging = false;
  let mouseX = 0;
  let mouseY = 0;

  header.addEventListener('mousedown', function (e) {
    e.preventDefault();
    isDragging = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;
      const newLeft = Math.min(
        Math.max(0, myWindow.offsetLeft + deltaX),
        window.innerWidth - myWindow.offsetWidth
      );
      const newTop = Math.min(
        Math.max(0, myWindow.offsetTop + deltaY),
        window.innerHeight - myWindow.offsetHeight
      );
      myWindow.style.left = newLeft + 'px';
      myWindow.style.top = newTop + 'px';
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });

  document.getElementById('ifReviewSelect').addEventListener('change', function() {
      updateIfReview(this.value);
  });
  document.getElementById("ifReviewSelect").value = ifReview;
  document.getElementById('playbackRateSelect').addEventListener('change', function() {
      updatePlaybackRate(this.value);
  });
  document.getElementById("playbackRateSelect").value = playbackRate;
  document.getElementById('volumeSelect').addEventListener('change', function() {
      updateVolume(this.value);
  });
  document.getElementById("volumeSelect").value = volume;
  
  document.getElementById('testTypeSelect').addEventListener('change', function() {
      updateTestType(this.value);
  });
  document.getElementById("testTypeSelect").value = testType;

  document.getElementById('ifTestSelect').addEventListener('change', function() {
      updateIfTest(this.value);
  });
  document.getElementById("ifTestSelect").value = ifTest;

  document.getElementById('asyncCourseIntervalSelect').addEventListener('change', function() {
      updateAsyncCourseInterval(this.value);
  });
  document.getElementById("asyncCourseIntervalSelect").value = asyncCourseInterval;

  document.getElementById('taskIntervalSelect').addEventListener('change', function() {
      updateTaskInterval(this.value);
  });
  document.getElementById("taskIntervalSelect").value = taskInterval;

  document.getElementById('testIntervalSelect').addEventListener('change', function() {
      updateTestInterval(this.value);
  });
  document.getElementById("testIntervalSelect").value = testInterval;
}






// 当下拉框的值改变时，更新变量值
function updateIfReview(val) {
  ifReview = val
  GM_setValue("ifReview", ifReview);
  notify(`复习模式已${ifReview == '1' ? '启用' : '关闭'}`, 2500)
}
function updatePlaybackRate(val) {
  playbackRate = val
  GM_setValue("playbackRate", playbackRate);
  // 刷新页面
  location.reload();
}
function updateVolume(val) {
  volume = val
  GM_setValue("volume", volume);
  // 刷新页面
  location.reload();
}
function updateIfTest(val) {
  if(val == "take") {
    // 获取输入的邮箱地址
    const email = GM_getValue("savedEmail") || '';
    // 检查邮箱地址是否有效
    if (!isValidEmail(email)) {
      notify('请输入有效的邮箱地址！', 5000)
      document.getElementById('ifTestSelect').value = 'skip';
      return;
    }
    
    const url = 'https://www.sweek.top/api/checkEmailExists';
    const data = { 
      email
    };
    if(email) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 声明请求主体的内容类型为 JSON
        },
        body: JSON.stringify(data), // 将数据对象转换为 JSON 字符串并作为请求主体
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // 解析 JSON 响应数据
      }).then(data => {
        if(data.exists){
          ifTest = val
          GM_setValue("ifTest", ifTest);
          notify(`已将章节测试设为${ifTest == 'take' ? '处理' : '跳过'}状态`, 2500)
        } else {
          document.getElementById('ifTestSelect').value = 'skip';
          notify('邮箱账号尚未注册，请扫码前往留言信箱网站注册,然后再尝试启用章节测试刷题功能', 5000)
        }
      }).catch(error => {
        // console.error('Error:', error);
      });
    }
  } else if (val == "skip"){
    ifTest = val
    GM_setValue("ifTest", ifTest);
    notify(`已将章节测试设为${ifTest == 'take' ? '处理' : '跳过'}状态`, 2500)
  }
}
function updateTestType(val) {
  testType = val
  GM_setValue("testType", testType);
  notify(`章节测试完成后将会${testType == 'save' ? '暂时保存' : '提交'}`, 2500)
  // 刷新页面
  // location.reload();
}
function updateAsyncCourseInterval(val) {
  asyncCourseInterval = val
  GM_setValue("asyncCourseInterval", asyncCourseInterval);
  notify(`章节任务进度同步间隔已设置为${asyncCourseInterval/1000}秒`, 2500)
  clearInterval(syncCourseId);
  syncCourseId = null;
  // 定时同步课程任务进度
	syncCourseId = setInterval(() => {
    syncCourseData()
	}, asyncCourseInterval);
  // 刷新页面
  // location.reload();
}
function updateTaskInterval(val) {
  taskInterval = val
  GM_setValue("taskInterval", taskInterval);
  notify(`章节任务执行间隔已设置为${taskInterval/1000}秒`, 2500)
  // 刷新页面
  // location.reload();
}
function updateTestInterval(val) {
  testInterval = val
  GM_setValue("testInterval", testInterval);
  notify(`章节测试执行间隔已设置为${testInterval/1000}秒`, 2500)
  // 刷新页面
  // location.reload();
}



function switchTab(tabId) {
  GM_setValue("activeTab", tabId);
  // 移除所有选项卡的活动状态
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // 设置当前选项卡为活动状态
  document.getElementById(tabId).classList.add('active');

  var contentNotice = document.getElementById("content-notice");
  var contentProcess = document.getElementById("content-process");
  var contentLog = document.getElementById("content-log");
  var contentSet = document.getElementById("content-set");
  var contentTitlt = document.getElementById("content-title");
  var contentAsyncTime = document.getElementById("content-async-time");
  switch (tabId) {
    case 'tab1':
      contentTitlt.innerHTML = '通知公告' + `<span style="margin-left: 10px; color: #333;font-size: 10px;">阅读次数：${readNum}</span>`
      contentAsyncTime.style.display = 'none'
      contentNotice.style.display = "block";
      contentProcess.style.display = "none";
      contentLog.style.display = "none";
      contentSet.style.display = "none";
      break;
    case 'tab2':
      contentTitlt.innerHTML = '任务进度'
      contentAsyncTime.style.display = 'block'
      contentNotice.style.display = "none";
      contentProcess.style.display = "block";
      contentLog.style.display = "none";
      contentSet.style.display = "none";
      break;
    case 'tab3':
      contentTitlt.innerHTML = '执行日志'
      contentAsyncTime.style.display = 'none'
      contentNotice.style.display = "none";
      contentProcess.style.display = "none";
      contentLog.style.display = "block";
      contentSet.style.display = "none";
      break;
    case 'tab4':
      contentTitlt.innerHTML = '脚本配置'
      contentAsyncTime.style.display = 'none'
      contentNotice.style.display = "none";
      contentProcess.style.display = "none";
      contentLog.style.display = "none";
      contentSet.style.display = "block";
      break;
  
    default:
      break;
  }
}




// 隐藏窗口函数
function hideWindow() {
  var myWindowContent = document.getElementById("my-window-content");
  var showPop = myWindowContent.style.display
  if (showPop == '' || showPop == 'block') {
    myWindowContent.style.display = "none";
  } else {
    myWindowContent.style.display = "block";
  }
}

function takeEmail() {
  // 获取邮箱输入框和保存按钮
  const emailInput = document.getElementById("email-input");
  const saveBtn = document.getElementById("save-btn");

  // 当保存按钮被点击时
  saveBtn.addEventListener("click", function() {
    // 获取输入的邮箱地址
    const email = emailInput.value.trim();
    // 检查邮箱地址是否有效
    if (!isValidEmail(email)) {
      notify('请输入有效的邮箱地址！', 2500)
      return;
    }
    
    const url = 'https://www.sweek.top/api/checkEmailExists';
    const data = { 
      email
    };
    if(email) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 声明请求主体的内容类型为 JSON
        },
        body: JSON.stringify(data), // 将数据对象转换为 JSON 字符串并作为请求主体
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // 解析 JSON 响应数据
      }).then(data => {
        if(data.exists){
          // 将邮箱地址存储到本地存储中
          GM_setValue("savedEmail", email);
          // 提示保存成功
          notify('保存成功！课程信息将同步到该邮箱账号', 2500)
        } else {
          notify('邮箱账号尚未注册，请扫码前往留言信箱网站注册', 2500)
        }
      }).catch(error => {
        // console.error('Error:', error);
      });
    }

  });

  // 页面加载时，尝试从本地存储中获取已保存的邮箱地址并反显到输入框中
  const savedEmail = GM_getValue("savedEmail") || '';
  if (savedEmail) {
    emailInput.value = savedEmail;
  }
}

// 邮箱地址验证函数
function isValidEmail(email) {
  // 此处可以使用正则表达式等方式进行邮箱地址的验证
  // 这里简单地判断邮箱是否包含 '@' 符号
  return email.includes("@");
}




// 封装页面组件方法
// 封装页面组件方法
// 封装页面组件方法

function showCustomPopup(htmlContent, width = 'auto', height = 'auto') {
  // 禁用页面滚动
  document.body.style.overflow = 'hidden';

  // 创建遮罩层
  var overlay = document.createElement('div');
  overlay.className = 'custom-popup-overlay';
  Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: '999998',
      opacity: '0',
      transition: 'opacity 0.3s ease-in-out'
  });

  // 创建弹窗容器
  var popupContainer = document.createElement('div');
  popupContainer.className = 'custom-popup-container';
  Object.assign(popupContainer.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0.8)',
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      maxWidth: '90%',
      maxHeight: '90%',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      opacity: '0',
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
      zIndex: '999999'
  });

  // 创建关闭按钮
  var closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  Object.assign(closeButton.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      padding: '5px 10px',
      backgroundColor: '#ff4d4f',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.3s'
  });

  closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#ff7875';
  });

  closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = '#ff4d4f';
  });

  // 关闭弹窗方法
  function closePopup() {
      popupContainer.style.opacity = '0';
      popupContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
      overlay.style.opacity = '0';
      setTimeout(() => {
          document.body.removeChild(popupContainer);
          document.body.removeChild(overlay);
          document.body.style.overflow = ''; // 恢复滚动
          document.removeEventListener('keydown', keyPressHandler);
      }, 300);
  }

  // 关闭按钮点击事件
  closeButton.addEventListener('click', closePopup);

  // 点击遮罩层关闭弹窗
  overlay.addEventListener('click', closePopup);

  // 监听 ESC 按键关闭弹窗
  function keyPressHandler(event) {
      if (event.key === 'Escape') {
          closePopup();
      }
  }
  document.addEventListener('keydown', keyPressHandler);

  // 创建内容容器（防止覆盖按钮）
  var contentContainer = document.createElement('div');
  Object.assign(contentContainer.style, {
      flex: '1',
      padding: '20px',
      overflowY: 'auto'
  });

  // 避免 innerHTML 直接赋值导致 XSS 攻击
  if (typeof htmlContent === 'string') {
      contentContainer.innerHTML = htmlContent;
  } else if (htmlContent instanceof HTMLElement) {
      contentContainer.appendChild(htmlContent);
  }

  // 组合元素
  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(contentContainer);
  document.body.appendChild(overlay);
  document.body.appendChild(popupContainer);

  // 动画显示弹窗
  setTimeout(() => {
      overlay.style.opacity = '1';
      popupContainer.style.opacity = '1';
      popupContainer.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
}



// 页面通知提示
function notify(text, time) {
  // 创建通知元素
  var notification = document.createElement('div');
  notification.className = 'notification';
  // 设置通知内容
  notification.innerHTML = '<div class="notification-content"><h2 style="font-size: 16px;font-weight: bold;color: #307dff;font-family: fangsong;">' + 'Sweek学习通助手提示' + '</h2><p style="font-family: fangsong;font-size: 13px;font-weight: bold;">' + text + '</p></div>';
  // 将通知添加到页面中
  document.body.appendChild(notification);
  // 设置通知样式
  notification.style.position = 'fixed';
  notification.style.top = '50px';
  notification.style.left = '-400px'; // 从左边弹出
  notification.style.transform = 'translateY(-50%)'; // 垂直居中
  notification.style.transition = 'left 0.5s ease-in-out'; // 添加过渡效果
  notification.style.zIndex = '999999';
  notification.style.backgroundColor = '#fff';
  notification.style.border = '1px solid #ccc';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.lineHeight = '25px';

  // 等待一小段时间后，移动通知到左边
  setTimeout(function() {
      notification.style.left = '20px'; // 移动到左边
  }, 100);

  // 设置定时器，在指定时间后移除通知
  setTimeout(function() {
      // 移动通知到左边以外
      notification.style.left = '-400px';
      // 等待过渡效果完成后，移除通知元素
      setTimeout(function() {
      notification.remove();
      }, 500);
  }, time);
}

// 添加执行日志
function addlog(str, color) {
  var _time = new Date().toLocaleTimeString()
  var contentLog = window.top.document.querySelector('.content-log');
  var newContent = '<p style="color: ' + color + ';">[' + _time + ']' + str + '</p><hr>';
  contentLog.innerHTML += newContent;
  // 将滚动条滚动到底部
  contentLog.scrollTop = contentLog.scrollHeight;
}


/** 监听事件-章节任务 */
document.addEventListener("redeal", () => {
    dealAnsEchelon(arrayEchelon);
});

/** 监听事件-章节测试 */
document.addEventListener("testRedeal", () => {
    dealTestEchelon(testArrayEchelon);
});


// 章节任务处理
// 章节任务处理
// 章节任务处理

/** 初始化 */
function initAll() {
  addlog('正在获取当前页面的任务...');
  const arrayAnsAll = document.querySelectorAll(".ans-attach-ct");
  addlog(`当前页面任务数量为: ${Array.from(arrayAnsAll).length}`);
  // 获取当前页面将会处理的任务-[根据是否启用复习模式]
  const arrayAns = ifReview == 1 ? document.querySelectorAll(".ans-attach-ct") : document.querySelectorAll('.ans-attach-ct:not(.ans-job-finished)')
  const taskCount = arrayAns.length;
  // addlog(`找到的任务数量: ${taskCount}`);
  if (arrayAns && taskCount > 0) {
    try {
      const arrayType = getIframesType(arrayAns);
      console.log('任务类型数组：', arrayType);

      const arrayDocument = getAllIframesDocument(arrayAns);
      console.log('任务文档数组：', arrayDocument);

      arrayEchelon = distributeAns(arrayType, arrayDocument);
      // addlog(`当前页面待办任务数量为: ${arrayEchelon.length}`);

      // 触发处理任务的事件
      document.dispatchEvent(dealEvent);
    } catch (error) {
      // console.error("初始化过程中发生错误：", error);
    }
  } else {
    addlog("当前页面没有可处理的任务,直接跳过章节");
    // 如果没有任务，
    skipChapter();
  }
}

// 获取任务属性
function getIframesType(arrayAns) {
  return Array.from(arrayAns)
      .map(ans => {
          const jsonStr = ans.querySelector("iframe")?.getAttribute("data");
          if (!jsonStr) {
              // console.warn("未找到 data 属性或 data 属性为空。");
              return null;
          }
          try {
              const json = JSON.parse(jsonStr);
              // 根据需求获取任务类型
              // 课程类型
              if(json && json.type) {
                return json.type;
              }
              // 测试类型
              if(json && json.worktype) {
                return json.worktype;
              }
          } catch (error) {
              // console.warn("解析 JSON 失败:", error);
              return null;
          }
      })
      .filter(type => type !== null);
}

// 获取任务 document
function getAllIframesDocument(arrayAns) {
return Array.from(arrayAns)
  .map(ans => ans.querySelector("iframe")?.contentWindow?.document)
  .filter(doc => doc !== undefined && doc !== null);
}

// 按任务属性映射处理函数
const handlerMap = {
  ".mp4": videoHandler,
  ".wmv": videoHandler,
  ".avi": videoHandler,
  ".mkv": videoHandler,
  ".flv": videoHandler,
  ".mov": videoHandler,
  ".doc": pptxHandler,
  ".docx": pptxHandler,
  ".pptx": pptxHandler,
  ".pdf": pptxHandler,
  ".ppt": pptxHandler,
  ".mp3": audioHandler,
  ".wav": audioHandler,
  "workA": testHandler
};

// 按任务属性分配执行函数
function distributeAns(arrayType, arrayDocument) {
  return arrayType.map((type, index) => {
      const handler = handlerMap[type] || ignoreAns;
      return { document: arrayDocument[index], handler };
  });
}

// 处理单个任务
function dealSingleAns(singleAns) {
  if (singleAns && singleAns.handler && typeof singleAns.handler === 'function') {
      singleAns.handler(singleAns.document);
  } else {
      // console.warn("无效的任务或处理函数。");
      document.dispatchEvent(dealEvent);
  }
}


// 章节测试处理
// 章节测试处理
// 章节测试处理


// 按章节测试题目属性映射处理函数
const handlerTestMap = {
  "单选题": choiceHandler,
  "多选题": choiceHandler,
  "判断题": choiceHandler
};

// 按任务属性分配执行函数
function distributeTest(arrayType) {
  return arrayType.map((item, index) => {
      const handler = handlerTestMap[item.type] || ignoreTest;
      return { document: item.document, handler, testObj: item };
  });
}

// 处理单个章节测试任务
function dealSingleTest(singleAns) {
  if (singleAns && singleAns.handler && typeof singleAns.handler === 'function') {
      singleAns.handler(singleAns.document, singleAns.testObj);
  } else {
      // console.warn("无效的任务或处理函数。");
      document.dispatchEvent(testDealEvent);
  }
}


/** 工具函数 */
/** 工具函数 */
/** 工具函数 */

// 章节测试执行方法
// 章节测试执行方法
// 章节测试执行方法


// 忽略章节测试题
function ignoreTest() {
	addlog("无法处理, 忽略该章节测试题");
	setTimeout(() => {
			document.dispatchEvent(testDealEvent);
	}, testInterval);
}

// 处理单选题/多选题/判断题
function choiceHandler(idocument, testObj) {
  // console.log('idocument：：：+ ', idocument)
  // console.log('testObj：：：+ ', testObj)
  addlog(`处理${testObj.type}任务中...`);
  fetch(fetch_url + testObj.question + '请你提供给我正确答案，不需要解析,答案需要精简，返回选项即可')
  .then(response => {
    let model_text = ''
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    const readChunk = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          console.log('model_text：：：+ ', model_text)
          const answer_index = findABCDEFPositions(model_text)
          console.log('answer_index：：：+ ', answer_index)
          const trueOptions = Array.from(idocument.querySelectorAll('li'));
          trueOptions.forEach((option, index) => {
            if (answer_index.includes(index)) {
              option.click();
            }
          });
          const answer_text = mapIndexToOption(answer_index)
          console.log('answer_text：：：+ ', answer_text)
          const currentTestTask = testTasks.find((task) => task.data == testObj.data)
          if (currentTestTask && answer_index.length > 0) {
            currentTestTask.model_text = model_text
            currentTestTask.answer_text = answer_text
            currentTestTask.status = true
          } else {
            currentTestTask.status = false
          }
          // 使用 findIndex 获取当前任务的索引
          const taskIndex = testTasks.findIndex((task) => task.data === testObj.data);
          const process = (((taskIndex + 1)/testTasks.length)*100).toFixed(2) + '%'
          console.log('testTasks：：：+ ', testTasks)
          setProcess(process, taskIndex + 1, testTasks.length, 'test')
          // 同步章节测试题目-AI模型生成
          const email = GM_getValue("savedEmail") || ''
          const course_name = GM_getValue("courseName") || '未获取课程名称';
          const testList = [{ question_id: testObj.data, question: testObj.question, answer: answer_text, type: testObj.type, email: email, course_name: course_name }]
          insertTestModel(testList)
          setTimeout(() => {
            document.dispatchEvent(testDealEvent);
          }, testInterval);
          return
        }
        const decodedValue = decoder.decode(value, { stream: true })
        model_text += decodedValue
        readChunk()
      })
    }
    readChunk()
  })
  .catch(error => {
    // 在这里处理错误
    // console.error('Error:', error);
  });
}

/** 章节测试任务梯队顺序处理 */
function dealTestEchelon(testArrayEchelon) {
  const remainingTasks = testArrayEchelon.length;
  addlog(`待处理章节测试任务数量为: ${remainingTasks}`);
  if (remainingTasks === 0) {
    // 获取章节测试题完成度
    const test_process = getTrueStatusPercentage(testTasks)
    const save_btn = testBtnDocument.querySelector('.btnSave')
    const submit_btn = testBtnDocument.querySelector('.btnSubmit')
    const mask_div = window.top.document.querySelector('.maskDiv')
    const pop_ok = mask_div.querySelector('#popok')
    if(test_process == 100) {
      addlog('章节测试任务已全部完成');
      switch (testType) {
        case 'save':
          save_btn.click()
          addlog('章节测试答案已暂时保存');
          break;
        case 'submit':
          submit_btn.click()
          setTimeout(() => {
            pop_ok.click()
            setTimeout(() => {
              const TiMus = getTestTopics()
              // console.log('TiMus：：：+ ', TiMus)
              // 计算正确率
              const rightRate = (TiMus.length/testTasks.length*100).toFixed(2) + '%';
              notify(`章节测试答题情况[${TiMus.length}/${testTasks.length}],章节测试正确率[${rightRate}]`, 5000)
              insertTest(TiMus)
            }, 3000);     
          }, 1000);
          addlog('章节测试答案已提交');
          break;
        default:
          break;
      }
    } else {
      addlog(`章节测试任务完成度为${test_process.toFixed(2)}%,不足100%，章节测试答案将暂时保存`);
      save_btn.click()
    }
    setTimeout(() => {
      if(testType == 'submit') {
        
      }
      addlog("章节测试任务已完成");
      dealAnsEchelon(arrayEchelon);
    }, 10000);
    return;
  }

  const nextTask = testArrayEchelon.shift();
  try {
    dealSingleTest(nextTask);
  } catch (error) {
      // console.error("处理任务时发生错误：", error);
      // 继续处理下一个任务
      dealTestEchelon(testArrayEchelon);
  }
}

// 课程任务执行方法
// 课程任务执行方法
// 课程任务执行方法

// 直接跳过
function skipChapter() {
	addlog("跳过章节");
	const chapterNext = window.top.document.querySelector("#prevNextFocusNext");
	if (chapterNext) {
			chapterNext.click();
	} else {
			// console.warn("未找到 #prevNextFocusNext 元素。");
	}

	setTimeout(() => {
			const tip = document.querySelector(".maskDiv.jobFinishTip.maskFadeOut");
			if (tip) {
					const tipNextChapter = document.querySelector(".jb_btn.jb_btn_92.fr.fs14.nextChapter");
					tipNextChapter?.click();
			} else {
					// console.warn("未找到完成提示或下一章节按钮。");
			}
	}, taskInterval);
}

// 忽略任务
function ignoreAns() {
	addlog("无法处理, 忽略任务");
	setTimeout(() => {
			document.dispatchEvent(dealEvent);
	}, taskInterval);
}

// 处理章节测试
function testHandler(idocument) {
  testDom = idocument
	addlog("处理章节测试任务中...");
  if (ifTest == 'take') {
    const iframe = idocument.querySelector("iframe");
    // console.log('iframe：：：+ ', iframe)
    if (iframe) {
      const sDocument = iframe.contentWindow?.document;
      // console.log('sDocument：：：+ ', sDocument)
      if(sDocument) {
        const form = sDocument.querySelector("form");
        // 存储章节测试按钮DOM
        testBtnDocument = sDocument.querySelector(".ZY_sub");
        // console.log('form：：：+ ', form)
        if (form) {
          const testTemps = Array.from(form.querySelectorAll('.singleQuesId, .newTestType'));
          testTasks = testTemps.map((temp) => {
            // console.log('temp：：：+ ', temp)
            return {
              document: temp,
              data: temp.getAttribute('data'),
              class: temp.getAttribute('class'),
              question: removeNewlines(temp.innerText),
              type: extractText(temp.innerText)
            }
          }).filter(item => item.class == "singleQuesId")
          // console.log('testTasks：：：+ ', testTasks)
          testArrayEchelon = distributeTest(testTasks);
          // 触发处理章节测试任务的事件
          document.dispatchEvent(testDealEvent);
        }
      }
    }
  } else if (ifTest == 'skip') {
    setTimeout(() => {
      addlog("根据配置选项，跳过章节测试");
      document.dispatchEvent(dealEvent);
    }, taskInterval);
  }
}

// 处理视频
function videoHandler(idocument) {
  addlog("处理视频任务中...");
  
  const video = idocument.querySelector("video");
  const videoPlayButton = idocument.querySelector(".vjs-big-play-button");
  const modalDialog = idocument.querySelector(".vjs-modal-dialog-content");
  const closeButton = idocument.querySelector(".vjs-done-button");
  // console.log('video：：：+ ', video)
  // console.log('videoPlayButton：：：+ ', videoPlayButton)
  // 检查视频和播放按钮是否存在
  if (!video || !videoPlayButton) {
    addlog("没有找到视频或播放按钮,3s后将刷新页面");
    setTimeout(() => {
      ocation.reload(); // 刷新页面
    }, 3000);
    return;
  }

  const playVideo = () => {    
    if (video && typeof video.play === 'function') {
      console.log('1video.play()：：：+ ')
      video.muted = true;  // 静音
      video.play().catch((error) => {
        console.error('视频播放失败:', error);
        addlog("视频播放失败，尝试点击播放按钮");
        videoPlayButton.click();
      });
    } else {
      console.log('1videoPlayButton.click()：：：+ ')
      addlog("视频播放失败，尝试点击播放按钮");
      videoPlayButton.click();
    }
  }
  const clickPlayVideo = () => {  
    if (videoPlayButton && typeof videoPlayButton.click === 'function'){
      console.log('2videoPlayButton.click()：：：+ ')
      videoPlayButton.click();
    }  else  {
      console.log('2video.play()：：：+ ')
      video.muted = true;  // 静音
      video.play().catch((error) => {
        console.error('视频播放失败:', error);
        videoPlayButton.click();
      });
    } 
  }

  const closeModalDialog = () => {
    if (modalDialog && closeButton && modalDialog.getAttribute("aria-hidden") !== "true") {
      setTimeout(() => {
        closeButton.click();
      }, 2000);
    }
  };

  const onLoadedData = () => {
    video.volume = volume;
    addlog(`已将视频音量调节为${volume * 100}%`);

    video.playbackRate = playbackRate;
    addlog(`已将视频倍速调节为${playbackRate}X`);
  };

  const handlePause = () => {
    clickPlayVideo();
    closeModalDialog();
  };

  const updateProgress = () => {
    const currentTime = video.currentTime;
    const duration = video.duration;
    const progress = (currentTime / duration) * 100;
    setProcess(progress.toFixed(2) + '%', currentTime.toFixed(0), duration.toFixed(0), 'video');
  };

  video.addEventListener("loadeddata", onLoadedData);
  video.addEventListener("pause", handlePause);
  video.addEventListener("timeupdate", updateProgress);

  video.addEventListener("ended", () => {
    addlog("视频任务已完成");
    document.dispatchEvent(dealEvent);
    video.removeEventListener("pause", handlePause);
    video.removeEventListener("timeupdate", updateProgress);
  }, { once: true });

  setTimeout(() => {
    if (video.paused && !video.ended) {
      playVideo();
      addlog('由于程序出错未自动播放，现重新模拟点击播放按钮...');
    }
  }, 10000);

  playVideo();
}


// 处理音频
function audioHandler(idocument) {
	  addlog("处理音频任务中...");
    const audio = idocument.querySelector("audio");
    const audioPlayButton = idocument.querySelector(".vjs-play-control.vjs-control.vjs-button");

    if (!audio) {
        // console.warn("未找到音频元素。");
        document.dispatchEvent(dealEvent);
        return;
    }

    // 播放音频
    audioPlayButton?.click();

    // 监听音频播放结束事件
    audio.addEventListener("ended", () => {
        addlog("音频任务已完成");
        document.dispatchEvent(dealEvent);
    }, { once: true });

    // 监听音频暂停事件并在暂停时继续播放
    audio.addEventListener("pause", () => {
        // console.log("音频暂停，自动恢复播放...");
        audioPlayButton?.click();
    });
    // 监听音频进度变化
    audio.addEventListener("timeupdate", () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progress = (currentTime / duration) * 100;
      setProcess(progress.toFixed(2) + '%', currentTime.toFixed(0), duration.toFixed(0), 'audio');
    });
}

// 处理 PPT & PDF
function pptxHandler(idocument) {
  // 添加日志提示
  addlog("处理 PPT/PDF 任务中...");

  // 获取嵌入的 iframe 元素
  const iframe = idocument.querySelector("iframe");
  if (!iframe) {
    console.warn("未找到嵌入的 iframe 元素。");
    document.dispatchEvent(dealEvent);
    return;
  }

  const sDocument = iframe.contentWindow?.document;
  if (!sDocument) {
    console.warn("无法获取 PPT/PDF 的文档内容。");
    document.dispatchEvent(dealEvent);
    return;
  }

  let finalHeight = sDocument.documentElement.scrollHeight;
  let currentHeight = 0;

  const scrollStep = 5;  // 滚动的步长，较小的步长会让滚动更加平滑
  const maxHeight = finalHeight;  // 目标滚动的最大高度

  // 平滑滚动函数
  function smoothScroll() {
    finalHeight = sDocument.documentElement.scrollHeight; // 动态更新最终高度
    if (currentHeight >= maxHeight) {      
      addlog("PPT/PDF任务已完成");
      document.dispatchEvent(dealEvent); // 完成滚动
      return;
    }

    currentHeight += scrollStep; // 每次滚动小步长
    sDocument.defaultView.scrollTo(0, currentHeight); // 执行滚动

    // 计算滚动进度并更新
    const progress = (currentHeight / maxHeight) * 100;
    setProcess(
      progress.toFixed(2) + '%', 
      currentHeight.toFixed(0), 
      maxHeight.toFixed(0), 
      'pdf'
    );

    // 请求下一帧
    requestAnimationFrame(smoothScroll);
  }

  // 开始滚动动画
  smoothScroll();
}




/** 任务梯队顺序处理 */
function dealAnsEchelon(arrayEchelon) {
    const remainingTasks = arrayEchelon.length;
		addlog(`待处理任务数量为: ${remainingTasks}`);
    if (remainingTasks === 0) {
      addlog('该章节任务已处理完成，即将跳转下一章节')
      setTimeout(() => {
        skipChapter();
      }, taskInterval);
      return;
    }
    const nextTask = arrayEchelon.shift();
    try {
        dealSingleAns(nextTask);
    } catch (error) {
        // console.error("处理任务时发生错误：", error);
        // 继续处理下一个任务
        dealAnsEchelon(arrayEchelon);
    }
}


// 其他执行方法
// 其他执行方法
// 其他执行方法

// 获取章节测试题目-正确的
function getTestTopics() {

  // 获取第一个符合条件的 iframe 并获取其中的子 iframe
  const testIframe = testDom.querySelector("iframe")?.contentWindow?.document.querySelector('.CeYan');
  console.log('testIframe：：：+ ', testIframe);

  // 如果没有找到目标元素，返回空数组
  if (!testIframe) {
    console.error('没有找到目标的测试 iframe');
    return [];
  }

  // 获取题目元素
  const TiMusDom = testIframe.querySelectorAll('.TiMu');
  console.log('TiMusDom：：：+ ', TiMusDom);

  // 筛选出正确答案的题目
  const rightTiMusDom = Array.from(TiMusDom).filter(TiMu => {
    return TiMu.querySelector('.marking_dui') !== null;
  });
  console.log('rightTiMusDom：：：+ ', rightTiMusDom);

  // 提取题目和答案
  const TiMus = Array.from(rightTiMusDom).map(TiMu => {
    const filteredText = Array.from(TiMu.children)
      .filter(child => !child.classList.contains('newAnswerBx') || !child.classList.contains('fl') ) // 过滤掉 class 为 newAnswerBx 的子元素
      .map(child => child.innerText) // 获取剩余子元素的 innerText
      .join(''); // 拼接所有文本内容

    const question = removeNewlines(filteredText);
    const answer = TiMu.querySelector('.answerCon')?.innerText || ''; // 使用 ? 确保 answerCon 存在
    const type = extractText(question)
    const email  = GM_getValue("savedEmail") || ''
    const course_name = GM_getValue("courseName") || '未获取课程名称';
    const question_id = TiMu.getAttribute('data') || ''
    return { question_id, question: question, answer: answer, type: type, email: email, course_name: course_name };
  });

  // console.log('TiMus：：：+ ', TiMus);
  return TiMus;
}



// 获取任务成功占比
function getTrueStatusPercentage(arr) {
  // 过滤出status为true的元素
  const trueCount = arr.filter(item => item.status === true).length;

  // 计算占比
  const percentage = (trueCount / arr.length) * 100;

  return percentage;
}

// 转化时间格式-秒转化成MM:ss
function formatTime(seconds) {
  let hrs = Math.floor(seconds / 3600);
  let mins = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;

  let formattedTime = [
      hrs > 0 ? String(hrs).padStart(2, '0') : null, 
      String(mins).padStart(2, '0'), 
      String(secs).padStart(2, '0')
  ].filter(Boolean).join(':');

  return formattedTime;
}


// 索引转换选项
function mapIndexToOption(arr) {
  arr = arr.map(item => {
    switch (item) {
      case 0:
        return 'A';
      case 1:
        return 'B';
      case 2:
        return 'C';
      case 3:
        return 'D';
      case 4:
        return 'E';
      case 5:
        return 'F';
      case 6:
        return 'G';
      default:
        break
    }
  })
  return arr.join('');
}

// 根据选项匹配索引
function findABCDEFPositions(str) {
  const result = [];
  const targetChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];  // 目标字符集合
  targetChars.forEach((text, index) => {
    if(str.indexOf(text) !== -1) {
      result.push(index);  // 记录该字符的索引
    }
  })
  return result;
}

function removeNewlines(str) {
  // 使用正则表达式去除所有的换行符（\n）
  return str.replace(/\n/g, '');
}

function extractText(str) {
  // 使用正则表达式提取“【多选题】”中的“多选题”部分
  const match = str.match(/【(.*?)】/);
  return match ? match[1] : null;
}

// 获取当前时间，年月日时分秒
function getCurrentDateTime() {
	var now = new Date();
	var year = now.getFullYear();
	var month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1，并确保两位数格式
	var day = now.getDate().toString().padStart(2, '0'); // 确保两位数格式
	var hours = now.getHours().toString().padStart(2, '0'); // 确保两位数格式
	var minutes = now.getMinutes().toString().padStart(2, '0'); // 确保两位数格式
	var seconds = now.getSeconds().toString().padStart(2, '0'); // 确保两位数格式

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 设置播放进度
function setProcess(val1, val2, val3, type) {
  const _process = window.top.document.querySelector('#content-process');
  const _time = getCurrentDateTime();
  let newContent = `<p style="color: #000;">[${_time}]</p><hr>`;
  
  switch (type) {
      case 'video':
      case 'audio':
          const mediaType = type === 'video' ? '视频' : '音频';
          newContent += `<p>播放进度：${val1}</p><hr>`;
          newContent += `<p>播放倍速：${playbackRate}</p><hr>`;
          newContent += `<p>${mediaType}长度：${formatTime(val2)}/${formatTime(val3)}</p>`;
          break;
      
      case 'pdf':
          newContent += `<p>浏览进度：${val1}</p><hr>`;
          newContent += `<p>PDF高度：${val2}px/${val3}px</p>`;
          break;
      
      case 'test':
          newContent += `<p>[答题进度：${val1}] [${val2}/${val3}]</p>`;
          newContent += testTasks.map((item, index) => {
              const color = item.status ? 'green' : 'red';
              const answerText = item.answer_text || '暂无答案';
              return `<p><span style="color: ${color}">[${index + 1}]</span> <span>${answerText}</span></p><p>${item.question}</p>`;
          }).join('');
          break;
  }
  
  _process.innerHTML = newContent;
}


// 获取视频播放进度-定时监听页面内容进行下一步处理
function getVideoProgress() {
  if(location.pathname == '/mycourse/studentstudy') {
    // 脚本运行过程中如果弹出弹窗，发现后关闭-10s执行一次
		const jobFinishTip = document.querySelector(".jobFinishTip");
		const nextChapter = document.querySelector(".nextChapter");
    if (jobFinishTip) {
      const computedStyle = getComputedStyle(jobFinishTip);
      if (computedStyle.display !== 'none') {
        nextChapter.click()
      }
    }
  }
}

// 获取页面url
function getURLInfo() {
  if(location.pathname == '/mycourse/studentstudy') {
    url = location.href
    // 获取问号后面的部分
    var queryString = url.split('?')[1];
    // 将查询字符串拆分为参数对
    var queryParams = queryString.split('&');
    // 创建一个对象来存储参数
    var params = {};
    // 遍历参数对，将它们存储在对象中
    queryParams.forEach(function(queryParam) {
        var parts = queryParam.split('=');
        var key = decodeURIComponent(parts[0]);
        var value = decodeURIComponent(parts[1]);
        params[key] = value;
    });
    chapterId = params['chapterId']
    courseId = params['courseId']
    GM_setValue("courseId", courseId);
  }
}


/**
 * 获取课程所有章节节点数据
 */
function getChapterCodeInfo() {
  if(location.pathname === '/mooc-ans/knowledge/cards') {
    var chapter = window.top.document.querySelectorAll('.posCatalog_select')
    chapterInfo = chapter
    allChapterName=[]

    chapterInfo.forEach(function(item) {
      allChapterName.push({
        id: item.id,
        title: item.innerText,
        active: item.classList.contains('posCatalog_active') ? 1 : 0,
        ifTitle: item.classList.contains('firstLayer') ? 1 : 0,
        status: item.childNodes[3]?.className == 'icon_Completed prevTips' ? 1 : 0
      })
      if (item.classList.contains('posCatalog_active')) {
        currentChapterId = item.id
        GM_setValue("currentChapterId", currentChapterId);
        currentChapterName = item.innerText
        GM_setValue("currentChapterName", currentChapterName);
      }
    });
    GM_setValue("chapterInfo", JSON.parse(JSON.stringify(allChapterName)));
    addlog('当前章节为' + currentChapterName, 'green')
  }
}

// 获取公告数据
async function getBoard() {
  try {
    let response = await fetch('https://www.sweek.top/api/board');
    let data = await response.json();
    
    // 在这里处理接收到的数据
    let notice = document.querySelector('#content-notice');
    notice.innerHTML = data.text;
    readNum = data.num;
  } catch (error) {
    // 处理错误
    console.error('Error:', error);
  }
}

// 同步课程时间
async function syncCourseData() {
  if (location.pathname === "/mycourse/studentstudy") {
    const emailInput = document.getElementById("email-input");
    const email = emailInput.value.trim();
    if (!email) return;

    const checkEmailUrl = "https://www.sweek.top/api/checkEmailExists";
    const courseUrl = "https://www.sweek.top/api/insertOrUpdateCourse";

    try {
      // 检查邮箱是否存在
      const emailResponse = await fetch(checkEmailUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!emailResponse.ok) throw new Error("检查邮箱请求失败");

      const emailData = await emailResponse.json();
      if (!emailData.exists) {
        const _async_time = window.top.document.querySelector("#async-time");
        _async_time.innerHTML =
          '<span style="color: #000;">[同步课程信息失败，邮箱未注册]</span>';
        return;
      }

      // 获取课程相关信息
      const savedEmail = GM_getValue("savedEmail", "");
      const courseName = GM_getValue("courseName", "测试");
      const courseId = GM_getValue("courseId", "");
      const courseImg = GM_getValue("courseImg", "");
      const process = document.querySelector("#content-process").innerHTML;
      const chapterInfo = GM_getValue("chapterInfo", "");

      if (!savedEmail || !process) return;

      // 处理章节信息
      const chapters = [...window.top.document.querySelectorAll(".posCatalog_select")];
      const allChapterName = chapters.map((item) => {
        const isActive = item.classList.contains("posCatalog_active");
        const isFirstLayer = item.classList.contains("firstLayer");
        const isCompleted = item.childNodes[3]?.className === "icon_Completed prevTips";

        if (isActive) {
          GM_setValue("currentChapterId", item.id);
          GM_setValue("currentChapterName", item.innerText);
        }

        return {
          id: item.id,
          title: item.innerText,
          active: isActive ? 1 : 0,
          ifTitle: isFirstLayer ? 1 : 0,
          status: isCompleted ? 1 : 0,
        };
      });

      const requestData = {
        email: savedEmail,
        course_id: courseId,
        course_name: courseName,
        course_img: courseImg,
        chapter: JSON.stringify(allChapterName),
        current_chapter: `${GM_getValue("currentChapterId", "")},${GM_getValue("currentChapterName", "")}`,
        process,
      };

      // 发送课程数据同步请求
      const courseResponse = await fetch(courseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!courseResponse.ok) throw new Error("同步课程数据请求失败");

      const _async_time = window.top.document.querySelector("#async-time");
      const _time = new Date().toLocaleString();
      _async_time.innerHTML = `<span style="color: #000;">[同步时间：${_time}]</span>`;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

// 存储章节测试题目至数据库
async function insertTest(arr) {
  const url = 'https://www.sweek.top/api/insertTest';
  const data = {
    testList: arr
  }
  if (arr.length > 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('题目同步成功!：：：+ ', arr)
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}
// 存储章节测试题目至数据库
async function insertTestModel(arr) {
  const url = 'https://www.sweek.top/api/insertTestModel';
  const data = {
    testList: arr
  }
  if (arr.length > 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('题目同步成功!：：：+ ', arr)
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}




// 方法执行入口
// 方法执行入口
// 方法执行入口
(async function () {
  // 引入Bootstrap Icons
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.css";
  document.head.appendChild(link);
  // console.log('location.pathname：：：+ ', location.pathname)
  // 章节测试页面字体解密逻辑
  if (location.pathname == '/mooc-ans/work/doHomeWorkNew') {
    var md5 = md5 || window.md5;

    // 判断是否存在加密字体
    var styleTags = document.querySelectorAll('style');
    var fontStyle = Array.from(styleTags).find(style => style.textContent.includes('font-cxsecret'));
    if (!fontStyle) return;

    // 解析font-cxsecret字体
    var font = fontStyle.textContent.match(/base64,([\w\W]+?)'/)[1];
    console.log('Typr：：：+ ', Typr)
    font = Typr.parse(base64ToUint8Array(font))[0];

    // 使用 GM_getResourceText 获取字体映射表
    var table = JSON.parse(GM_getResourceText('Table'));

    // 处理字体解密逻辑
    processFontDecryption(table, font);

    function processFontDecryption(table, font) {
        // 匹配解密字体
        var match = {};
        for (var i = 19968; i < 40870; i++) { // 中文[19968, 40869]
            var glyph = Typr.U.codeToGlyph(font, i);
            if (!glyph) continue;
            var path = Typr.U.glyphToPath(font, glyph);
            var hash = md5(JSON.stringify(path)).slice(24); // 8位即可区分
            match[i] = table[hash];
        }

        // 替换加密字体
        document.querySelectorAll('.font-cxsecret').forEach(element => {
            let html = element.innerHTML;
            for (var key in match) {
                var regex = new RegExp(String.fromCharCode(key), 'g');
                html = html.replace(regex, String.fromCharCode(match[key]));
            }
            element.innerHTML = html;
            element.classList.remove('font-cxsecret'); // 移除字体加密
        });
        console.log('执行解密：：：+ ')
    }

    function base64ToUint8Array(base64) {
        var binaryString = window.atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
  }
	// 进入学习通弹出提示
	if(location.pathname == '/base') {
		notify('已进入学习通首页，请进入课程，选择需要学习的课程', 5000)
	}
  // 进入课程弹出提示
  if (location.pathname == '/mooc2-ans/mycourse/stu') {
    let courseName = window.top.document.querySelector('.classDl .colorDeep')?.getAttribute('title');
    let courseImg = window.top.document.querySelector('.classDl').getElementsByTagName("img")[0]?.getAttribute('src');

    if (courseName && courseImg) {
        GM_setValue("courseName", courseName);
        GM_setValue("courseImg", courseImg);
        notify('已进入课程:' + courseName + '，请选择需要学习的章节', 5000);
    } else {
        console.error('课程信息未能获取');
    }
  }

	// 初始化显示页面弹窗
	if(location.pathname == '/mycourse/studentstudy') {
		initPopup()  
		// 获取公告数据
	  await	getBoard()  
		// 邮箱操作
		takeEmail()
    // 默认激活tab
    switchTab(activeTab)
	}
	// 获取页面章节节点数据
	getChapterCodeInfo()
	// 获取页面url信息
	getURLInfo()

	// 定时打印视频播放进度-定时监听页面内容进行下一步处理
	videoProgressId = setInterval(() => {
		getVideoProgress()
	}, 10000);

	// 定时同步课程任务进度
	syncCourseId = setInterval(() => {
    syncCourseData()
	}, asyncCourseInterval);

  if(location.pathname == '/mooc-ans/knowledge/cards') { 
    console.log('触发：：：+ ')
    addlog('脚本加载中...')
    // 10秒后执行initAll
    setTimeout(() => {
        initAll();
    }, 5000);
  }
})();







