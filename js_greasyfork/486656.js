// ==UserScript==
// @name         快手直播助手自动弹链接
// @namespace    com.kwaixiaodian.zs.page.helper
// @version      1.2
// @author       Mag
// @description  填写商品id在框 输入循环时间即可自动点击商品
// @license      Mag
// @match        https://zs.kwaixiaodian.com/page/helper
// @icon         https://f2.eckwai.com/kos/nlav12333/seller-assets/8k7xf6f5m4.5e658004d37b460e.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486656/%E5%BF%AB%E6%89%8B%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%BC%B9%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/486656/%E5%BF%AB%E6%89%8B%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%BC%B9%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (document.getElementById("custom-script")) {
    console.log("脚本已存在，无需重复添加。");
    return;
  }

  var scriptContainer = document.createElement("script");
  scriptContainer.id = "custom-script";
  scriptContainer.type = "text/javascript";

  function clickButton(button) {
    button.click();
  }

  var intervalId,intervalId2;

  var targetAttributeInput = document.createElement("input");
  targetAttributeInput.type = "text";
  targetAttributeInput.value = "20805894958692";

  var targetAttributeInput2 = document.createElement("input");
  targetAttributeInput2.type = "text";
  targetAttributeInput2.value = "20810072572692";

  var timesInput = document.createElement("input");
  timesInput.type = "number";
  timesInput.value = "8";

  var startButton = document.createElement("button");
  startButton.textContent = "执行";

  var stopButton = document.createElement("button");
  stopButton.textContent = "终止";

  var buttonContainer = document.createElement("div");
  buttonContainer.style.position = "fixed";
  buttonContainer.style.top = "50%";
  buttonContainer.style.left = "20px";
  buttonContainer.style.transform = "translateY(-50%)";
  buttonContainer.style.zIndex = "9999";
  buttonContainer.appendChild(document.createTextNode("第一个商品ID："));
  buttonContainer.appendChild(targetAttributeInput);
  buttonContainer.appendChild(document.createElement("br"));
  buttonContainer.appendChild(document.createTextNode("第二个商品ID："));
  buttonContainer.appendChild(targetAttributeInput2);
  buttonContainer.appendChild(document.createElement("br"));
  buttonContainer.appendChild(document.createTextNode("时间间隔（分钟）："));
  buttonContainer.appendChild(timesInput);
  buttonContainer.appendChild(document.createElement("br"));
  buttonContainer.appendChild(startButton);
  buttonContainer.appendChild(stopButton);

  document.body.appendChild(buttonContainer);

//---------------------------------------------------------窗口移动设置
  var isDragging = false;
  var startPosX, startPosY;

  buttonContainer.addEventListener("mousedown", function(e) {
    isDragging = true;
    startPosX = e.clientX - buttonContainer.offsetLeft;
    startPosY = e.clientY - buttonContainer.offsetTop;
  });

  document.addEventListener("mousemove", function(e) {
    if (isDragging) {
      var offsetX = e.clientX - startPosX;
      var offsetY = e.clientY - startPosY;
      buttonContainer.style.left = offsetX + "px";
      buttonContainer.style.top = offsetY + "px";
    }
  });

  document.addEventListener("mouseup", function() {
    isDragging = false;
  });

//----------------------------------------------------------------------------
  var goodss="#c1goods-";//inner_c1goods-20810072572692
  function startLoopClick() {
    //获取商品ID
    var targetAttribute1 = targetAttributeInput.value;
    //合成新的字符串
    var goods1 = goodss.concat(targetAttribute1.toString())
    var targetAttribute2 = targetAttributeInput2.value;
    var goods2 = goodss.concat(targetAttribute2.toString())

    //获取时间数值
    var times =timesInput.value;

   // 定义两个要交替输出的数值
    var value1 = goods1;
    var value2 = goods2;

  // 定义一个变量来跟踪当前应输出的值
    var goodsValue = value1;

  // 初始化剩余循环次数为5次
    var remainingTimes = 5;

  // 设置每隔8分钟（480000毫秒）执行一次函数
    var intervalId3 = setInterval(function() {
    // 执行点击事件
      var query = document.querySelector.bind(document);
      const parentElementB= query(goodsValue+' div.cardBtn--Soa5Y')
      console.log("看看parentElementB",parentElementB)
      if (parentElementB) {
        const buttonB = parentElementB.querySelector('button:nth-child(4)');
        const spanB = buttonB.querySelector('span');
        console.log("看看span",spanB)
        if (spanB.textContent === "开始讲解") {
            clickButton(spanB);
          // 设置每1.5秒执行一次点击确定按钮
          const intervalId4 = setInterval(function() {

           // 确保在文档加载完成后执行脚本
          if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
            var querenButtonB = document.querySelector('div.ant-modal-confirm-btns button:nth-child(2)');
             console.log("确定位置",querenButtonB)
          // 检查元素是否存在
          if (querenButtonB) {
            // 模拟点击操作
            querenButtonB.click();
            // 可以选择在找到并点击后停止循环，防止重复点击
            clearInterval(intervalId4);
            console.log("确定按钮点击并关闭！")
            };
          };
          }, 1500); // 每隔2秒
          };
      }

    // 切换到下一个值
    if (goodsValue === value1) {
        goodsValue = value2;
    } else {
        goodsValue = value1;
    }

    // 每执行一次，剩余次数减一
    --remainingTimes;

    // 当剩余次数为0时，清除定时器
    if (remainingTimes <= 0) {
        clearInterval(intervalId3);
    }
    }, times*60*1000); // 每隔8分钟执行一次

  }

  //开始点击执行
  function stopLoopClick() {
    // clearInterval(intervalId);
    clearInterval(intervalId3);
    scriptContainer.remove();
    startButton.disabled = false;
  }

  startButton.addEventListener("click", function() {
    startLoopClick();
    startButton.disabled = true;
  });
  stopButton.addEventListener("click", stopLoopClick);

  document.body.appendChild(scriptContainer);

})();
