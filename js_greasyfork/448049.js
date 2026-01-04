// ==UserScript==
// @name        AutoCode
// @namespace   Violentmonkey Scripts
// @match       http://jypsh.jiafei.site/code_training.php
// @grant       none
// @version     4.0
// @author      Astbreal
// @description 2022年9月19日 11:17:00
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448049/AutoCode.user.js
// @updateURL https://update.greasyfork.org/scripts/448049/AutoCode.meta.js
// ==/UserScript==

var timebase = 1.5; // 全局时间基数
var timeMax = 4.5; // 最大有效打码时间
var countRun = 20; // 默认20组
var time = 4; // 默认每组打卡4s左右

// 使用随机数种子制作伪随机数
class Random {
  // 实例化一个随机数生成器，seed=随机数种子，默认当前时间
  constructor(seed) {
    this.seed = (seed || Date.now()) % 999999999;
  }

  // 取一个随机整数 max=最大值（0开始，不超过该值） 默认1
  next(max) {
    max = max || 1;
    this.seed = (this.seed * 9301 + 49297) % 233280;
    let val = this.seed / 233280.0;
    return Math.fround(val * max);
  }
}

// 判断第n组小打卡时有没有错误
function faultExisted(codeNum) {
  if (codeNum > 0) {
    let tableId = document.getElementById("scoretable");
    let result = tableId.rows[codeNum].cells[3].innerText.trim("");
    // 取出表格，若表格中有错误的值，则刷新页面并将打卡组数加1
    if (result === "错误") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function passThisWork(needNum, timespan) {
  let count = 0;
  let timer = setInterval(function () {
    if (count < needNum) {
      document.getElementById("codecancle").click();
      count++;
    } else {
      clearTimeout(timer);
      return;
    }
  }, timespan);
}

function autocode(finalDozenNum, time) {
  //n 为打卡组数，timebase为基础时间（最低多少秒打卡），timespan是时间误差。时间基本单位为秒。
  let commit = document.getElementById("sysok"); // 此处是每10次打完后需要点的确定键
  let codeNum = 0; // 10次小任务计数器，一组打完重置为0
  let dozenNum = 0; // 组数计数器。
  let timespan = time - timebase;
  let passtime = 800; // pass时点击的时间

  // 每隔2-3.5秒填充并确认一次。延迟问题
  function codeAciton() {
    if (dozenNum < finalDozenNum) {
      commit.click();
      randomTimeWork();
    } else {
      // 指定的任务次数已完成
      sendLog("全部打卡已完成！");
      return;
    }

    // 使用setTimeout做真随机定时任务
    function randomTimeWork() {
      let random = new Random();
      let timer = setTimeout(function () {
        // 只有做了一次才能检查
        if (codeNum > 0) {
          // 此处是检查上一次的打卡有没有出现错误
          let exist = faultExisted(codeNum);
          if (exist) {
            sendLog("检测到有任务失败，正在快速重置任务...")
            passCount = 10 - codeNum;
            passThisWork(passCount, passtime); // 直接错误提交后面的所有代码
            codeNum = 0;
            sendLog("任务重置完成！")
            setTimeout(function () {
              clearTimeout(timer);
              codeAciton();
              // }, 1000);
            }, passCount * passtime + 4000);
            return;
          }
        }

        if (codeNum > 9) {
          codeNum = 0;
          dozenNum++
          sendLog(`第${dozenNum}次打码已完成`);
          setTimeout(function () {
            codeAciton();
          }, 1000);
          return;
        }

        //任务
        let img = document
          .getElementsByTagName("img")[0]
          .src.split("_")[1]
          .split(".")[0];
        document.getElementsByName("codenum")[0].value = img;
        document.getElementById("codeok").click();
        codeNum += 1; // 次数加1
        sendLog(codeNum.toString().concat(": ", img)); // 在控制台显示计数

        // 递归调用，做随机时间定时任务
        randomTimeWork();
        clearTimeout(timer);
      }, timebase * 1000 + timespan * 1000 * random.next());
    }
  }

  codeAciton();
}
console.log()

//日志函数
function sendLog(...any){
  // 拼接传入的数据
  var Logs = any.join("");

	// 获取目标 <div> 元素
	var targetDiv = document.getElementById('logBox'); // 替换为你的目标 <div> 元素的 ID
	targetDiv.appendChild(document.createElement('br'));
	// 创建文本节点
	var textNode = document.createTextNode(Logs);
	
	// 添加文本节点到目标 <div> 元素
	targetDiv.appendChild(textNode);
  targetDiv.style.textAlign = "left";
	targetDiv.scrollTop = targetDiv.scrollHeight;

  // 同时输出控制台
  console.log(Logs);
}

//创建日志框
function createLogBox() {
  var logBox = document.createElement('div');
  logBox.id = 'logBox';
  // logBox.style.position = 'fixed';
  logBox.style.bottom = '0';
  logBox.style.left = '0';
  logBox.style.width = '900px';
  logBox.style.height = '230px';
  logBox.style.backgroundColor = 'rgb(221,196,196)'; // 更改背景颜色为黑色
  logBox.style.color = 'black'; // 更改文本颜色为绿色
  logBox.style.margin = 'auto';
  logBox.style.marginTop = '4px';
  logBox.style.overflow = 'auto';
  logBox.style.padding = '5px';
  logBox.style.fontFamily = 'Arial, sans-serif';
  logBox.style.whiteSpace='pre-wrap';
  document.body.appendChild(logBox);
}

function htmlSet(count, time) {
  createLogBox();

  // 开始打开按钮
  let start = document.createElement("button");
  start.id = "startas01";
  start.textContent = "开始打码";
  start.style.width = "90px";
  start.style.height = "35px";
  start.style.fontSize = "18px";
  start.style.alignItems = "center";
  start.style.color = "rgb(0,0,139)";

  // 设置组数按钮
  let setCountRun = document.createElement("button");
  setCountRun.id = "setCountRun01";
  setCountRun.textContent = "确认设置";
  setCountRun.style.width = "90px";
  setCountRun.style.height = "35px";
  setCountRun.style.fontSize = "18px";
  setCountRun.style.alignItems = "center";
  setCountRun.style.color = "rgb(0,0,139)";

  // 每组打码单位时间(2.6-4s)
  let CodeTime = document.createElement("input");
  CodeTime.id = "CodeTime01";
  CodeTime.value = "4s(默认时间)";
  CodeTime.style.width = "90px";
  CodeTime.style.height = "35px";
  CodeTime.style.fontSize = "13px";
  CodeTime.style.color = "rgb(128,0,128)";
  CodeTime.style.alignItems = "center";

  // 组数文本
  let RunTimevalue = document.createElement("input");
  RunTimevalue.id = "countRun01";
  RunTimevalue.value = "20(默认组数)";
  RunTimevalue.style.width = "90px";
  RunTimevalue.style.height = "35px";
  RunTimevalue.style.fontSize = "13px";
  RunTimevalue.style.color = "green";
  RunTimevalue.style.alignItems = "center";

  var countx = document.getElementById("codebestscore");
  // var startx = document.getElementById("codesuccesscount");
  var username = document.getElementById("userrealname");

  // 放置按钮位置
  username.append(setCountRun)
  username.appendChild(RunTimevalue);
  username.appendChild(CodeTime);
  username.appendChild(start);

  // 设置焦点显示
  window.onload = function () {
    // CodeTime 设置焦点和非焦点时的默认值。
    CodeTime.onfocus = function () {
      if (CodeTime.value.trim() == "4s(默认时间)") {
        CodeTime.value = "";
      }
    };
    CodeTime.onblur = function () {
      if (CodeTime.value.trim() == "") {
        CodeTime.value = "4s(默认时间)";
      }
    };

    // RunTimevalue 焦点和非焦点默认值
    RunTimevalue.onfocus = function () {
      if (RunTimevalue.value.trim() == "20(默认组数)") {
        RunTimevalue.value = "";
      }
    };
    RunTimevalue.onblur = function () {
      if (RunTimevalue.value.trim() == "") {
        RunTimevalue.value = "20(默认组数)";
      }
    };
  };

  // 绑定按钮动作
  setCountRun.onclick = function () {
    // 设置打码总组数
    countStr = RunTimevalue.value.valueOf();

    if (parseInt(countStr) > 0 && parseInt(countStr) < 40) {
      count = parseInt(countStr);
      sendLog("已经将组数设置为: ", count);
    } else {
      sendLog(
        "设置失败，组数必须介入在0到40组之间，当前总组数为： ",
        parseInt(countStr)
      );
    }

    // 设置单词打码时间
    TimeStr = CodeTime.value.valueOf();

    if (parseFloat(TimeStr) > timebase && parseFloat(TimeStr) < timeMax) {
      time = parseFloat(TimeStr);
      sendLog("已经将单组最大时间设置为: ", time);
    } else {
      sendLog(
        `设置失败，单词打码时间必须介入在${timebase}到${timeMax}秒之间，当前设置的单组打码时间为：`,
        parseFloat(TimeStr)
      );
    }
  };

  start.onclick = function () {
    sendLog("开始打码！总共有", count,"组打码。");
    autocode(count, time);
  };
}

(function () {
  "use strict";
  htmlSet(countRun, time);
})();
