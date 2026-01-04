// ==UserScript==
// @name        速通NUIST学习通教评
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  新版教评令人窒息，默认给所有老师全10分，大家都开心（想改分的改源代码99行）
// @author        咩咩怪！
// @match      *://i.chaoxing.com/*
// @match      *://i.chaoxing.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483876/%E9%80%9F%E9%80%9ANUIST%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/483876/%E9%80%9F%E9%80%9ANUIST%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

// 创建悬浮窗
var floatWindow = document.createElement("div");
floatWindow.className = "float-window";
floatWindow.innerHTML = `
  <h3 id="main">打开到评教第一页，然后点开始运行</h3><br></br>
  <p>使用方法：点击账号头像，更改单位，回到主页之后点击左边蓝色背景边栏最下面的评价问卷（不能从通知里点进去）。要看得到评价问卷才有用，看不到就切换单位。评教完记得在油猴里把脚本关掉，不然每次打开学习通都会弹窗。要改分在油猴的源代码里99行改。</p>
  <p>【注意】出现弹窗警告进行不下去，或者卡住不动了，点击停止运行，返回评价问卷主页，再点击开始运行</p>
  <button id="anniu" class="float-button" onclick="changeParamAndText()">开始运行</button>
`;
document.body.appendChild(floatWindow);

// 创建样式
var style = document.createElement("style");
style.innerHTML = `
  .float-window {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: lightblue;
    border: 1px solid black;
    text-align: center;
    padding: 10px;
    z-index: 9999;
    display: inline-block;
  }

  .float-button {
    margin-top: 10px;
    width: 100px;
    height: 40px;
    font-size: 16px;
    cursor: pointer;
    z-index: 9999;
  }

  #main {
    font-size: 20px;
    font-weight: bold;
  }
`;
document.head.appendChild(style);

// 定义一个变量，初始值为1
var param = 0;
// 定义一个变量，表示是否还有 fontColor02 节点对象存在
var hasFontColor02 = true;
// 定义一个变量，表示是否需要换页
var needChangePage = false;
// 定义一个变量，表示当前的页码
var pageNum = 0;
// 定义一个变量，表示当前页的节点对象
var curPage = null;
// 使用 while 循环，当还有 fontColor02 节点对象存在时，继续循环
var nummnum = 1;

// 定义一个函数，用来改变参数和按钮的文本
function changeParamAndText() {
  // 切换参数的值，如果是1就变成0，如果是0就变成1
  param = param === 1 ? 0 : 1;

  // 获取id为anniu的按钮元素
  var button = document.getElementById("anniu");

  // 根据参数的值来改变按钮的文本
  if (param === 1) {
    button.innerHTML = "停止运行";
    setTimeout(() => {
      start_main();
    }, 500);
  } else {
    button.innerHTML = "开始运行";
  }

  // 打印参数的值
  console.log(param);
}

// 定义一个延时函数，返回一个 Promise 对象
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 定义一个 putdefen 函数，使用 async/await 语法
async function putdefen() {
  //设置分值
  var score = 10; //改分值在这里★★★
  await delay(300);
  console.log("进入点击函数");
  // 获取所有类名为 blueInp dafen 的元素
  let elements1;
  try {
    elements1 = document
      .getElementById("frame_content")
      .contentWindow.document.getElementsByClassName("blueInp dafen");
  } catch (error) {
    console.log("发生错误，500毫秒后重试");
    await delay(500);
    elements1 = document
      .getElementById("frame_content")
      .contentWindow.document.getElementsByClassName("blueInp dafen");
  }

  // 如果 elements1 为空，等待 500 毫秒，然后再次尝试获取 elements1
  while (elements1.length === 0) {
    console.log("elements1 为空，500毫秒后重试");
    await delay(500);
    elements1 = document
      .getElementById("frame_content")
      .contentWindow.document.getElementsByClassName("blueInp dafen");
  }

  // 使用 for...of 循环遍历元素列表
  for (const element of elements1) {
    // 设置元素的 value 属性为 10
    element.value = score;
  }
  // 获取类名为 botBtnBox 的元素
  await delay(200);
  // 使用 for...of 循环遍历元素列表
  const elements2 = document
    .getElementById("frame_content")
    .contentWindow.document.getElementsByClassName("blueInp dafen");
  for (const element of elements2) {
    // 设置元素的 value 属性为 10
    element.value = score;
  }
  await delay(200);
  const box1 = document
    .getElementById("frame_content")
    .contentWindow.document.querySelector(".botBtnBox");
  console.log(box1);
  // 如果 box 元素没有子节点，或者只有一个子节点，跳过这一步
  try {
    if (box1.children.length < 2) return;
    // 获取 box 元素的第二个子节点
    const button = box1.children[1];
    // 模拟用户点击元素
    button.click();
  } catch (error) {
    console.log("是我想的那样");
    console.log(error.name + ": " + error.message);
  }
  // 等待 300 毫秒
  await delay(500);
  // 获取类名为 layui-layer-btn0 的元素
  const button2 = document
    .getElementById("frame_content")
    .contentWindow.document.querySelector(".layui-layer-btn0");
  // 模拟用户点击元素
  button2.click();
  // 等待 100 毫秒
  await delay(400);
  // 获取 id 名字为 pageindex 的节点
  let pageindex = document
    .getElementById("frame_content")
    .contentWindow.document.getElementById("pageindex");
  // 获取 pageindex 节点的所有子节点
  let children = pageindex.children;
  // 使用 for...of 循环遍历子节点列表
  for (const child of children) {
    // 如果子节点的 innerHTML 在 "1" 到 "9" 之间，表示是页码节点
    if (child.innerHTML >= "1" && child.innerHTML <= "9") {
      if (Number(child.innerHTML) === pageNum) {
        // 模拟用户点击子节点
        console.log("点击函数回到当前页", Number(child.innerHTML));
        child.click();
        // 跳出 for 循环
        await delay(400);
        break;
      }
    }
  }
}

// 定义一个主函数，使用 async/await 语法
async function start_main() {
  console.log("进入主函数");
  while (true) {
    await delay(100);
    if (param === 1) {
      // 获取 id 名字为 pageindex 的节点
      console.log("第", nummnum, "次循环");
      nummnum = nummnum + 1;
      await delay(200);
      let pageindex = document
        .getElementById("frame_content")
        .contentWindow.document.getElementById("pageindex");
      // 获取 pageindex 节点的所有子节点
      let children = pageindex.children;
      // 使用 for...of 循环遍历子节点列表
      for (const child of children) {
        console.log("进入确定页码");
        // 如果子节点的 innerHTML 在 "1" 到 "9" 之间，表示是页码节点
        if (child.innerHTML >= "1" && child.innerHTML <= "9") {
          // 获取子节点的类名
          let className = child.className;
          // 如果类名包含 cur，表示是当前页的节点
          if (className.includes("cur")) {
            // 把子节点赋值给 curPage
            curPage = child;
            console.log(child.innerHTML);
            // 获取子节点的 innerHTML，转换为数字
            pageNum = Number(child.innerHTML);
            console.log("当前页码为:", Number(child.innerHTML));
          }
        }
      }

      // 检查是否还有待评价的 fontColor02 节点
      hasFontColor02 = false;
      // 再次获取所有类名为 fontColor02 的元素
      const elements2 = document
        .getElementById("frame_content")
        .contentWindow.document.getElementsByClassName("fontColor02");
      // 使用 for...of 循环遍历元素列表
      for (const element of elements2) {
        console.log("检查是否还有待评价的，决定是否换页");
        // 获取元素的文字内容，包括 HTML 标签
        const text = element.innerHTML;
        // 如果文字是“待评价”，表示还有待评价的 fontColor02 节点
        if (text === "待评价") {
          // 设置 hasFontColor02 为 true
          console.log("还有待评价的");
          hasFontColor02 = true;
          needChangePage = false;
          // 跳出 for 循环
          break;
        }
      }
      // 如果没有待评价的 fontColor02 节点，设置 needChangePage 为 true，表示需要换页
      if (!hasFontColor02) {
        needChangePage = true;
        console.log("该换页了");
      }

      if (needChangePage) {
        console.log("进入换页");
        let pageindex = document
          .getElementById("frame_content")
          .contentWindow.document.getElementById("pageindex");
        // 获取 pageindex 节点的所有子节点
        let children = pageindex.children;
        // 使用 for...of 循环遍历子节点列表
        for (const child of children) {
          // 如果子节点的 innerHTML 在 "1" 到 "9" 之间，表示是页码节点
          if (child.innerHTML >= "1" && child.innerHTML <= "9") {
            // 如果等于 pageNum+1，表示是要更换的页码
            if (Number(child.innerHTML) === pageNum + 1) {
              // 模拟用户点击子节点
              console.log("要换成", pageNum + 1);
              child.click();
              // 跳出循环
              pageNum = pageNum + 1;
              break;
            }
          }
        }
      }

      // 获取所有类名为 fontColor02 的元素
      const elements = document
        .getElementById("frame_content")
        .contentWindow.document.getElementsByClassName("fontColor02");
      // 使用 for...of 循环遍历元素列表
      for (const element of elements) {
        console.log("检查是否是待评价的，是就点击");
        // 获取元素的文字内容，包括 HTML 标签
        const text = element.innerHTML;
        // 如果文字是“待评价”，则执行以下操作
        if (text === "待评价") {
          // 调用点击函数
          element.click();
          await putdefen();
          await delay(400);
          break;
        }
      }
    } else {
      break;
    }
  }
  console.log("整个函数结束了");
}

var image1 = document.getElementById("anniu");
image1.onclick = changeParamAndText;
