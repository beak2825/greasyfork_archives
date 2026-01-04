// ==UserScript==
// @name         旺旺UpUp
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  牛刀小试
// @author       theCrazy-handsomeboy
// @match        https://ads.tiktok.com/i18n/*
// @grant        none
// ==/UserScript==



const makeBox=function () {
  "use strict";

  // check element
  const targetSelector = ".biz-right-bar";
  let successfulCount = 0;
  let intervalId;
  let codeTextArea = "";
  let runFlag = false;
  //---------- The Box ----------
  const popupContainer = document.createElement("div");
  popupContainer.id = "popupContainer";
  Object.assign(popupContainer.style, {
    position: "fixed", // Changed from "none" to "fixed"
    display: "none",
    justifyContent: "space-between",
    alignItems: "center",
    top: "90%",
    left: "230px",
    transform: "translate(-50%, -50%)",
    padding: "10px",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: "1000",
    width: "380px",
    borderRadius: "8px",
  });

  popupContainer.innerHTML = `
    <div style="display:flex;justify-content: center;">
    <h4>Execution Count:${successfulCount}</h4>
    </div>
    <div style="display: flex;">
        <textarea id="CodeTextarea" rows="3" style="width: 200px; margin-bottom: 10px;margin-top:2px"></textarea>
        <div>
        <div>

        <button id="executeBtn" style="font-size: 15px; margin-left: 10px; cursor: pointer; width: 50px; height: 30px; margin-right: 10px; border: none; background-color: #5475e7; color: #fff;">run</button>
  </div>
  <div>
        <button id="stopBtn" style="margin-top:5px;font-size: 15px; width: 50px; margin-left: 10px;cursor: pointer; height: 30px; margin-right: 10px; border: none; background-color: #e75454; color: #fff;">stop</button>
       </div>
        </div>
       <div style="margin-right:10px;margin-left:10px">
           <div style="display: flex; justify-content: center; align-items: center;">
            <p>Count：</p>
            <input type="number" id="loopCount" min="1" value="10" style="cursor: pointer; width: 50px; font-size: 20px; border-radius: 5px; ">
            <button id="clearAll" style="margin-left: 10px;font-size: 15px; width: 60px; cursor: pointer; height: 30px; margin-right: 10px; border: none; background-color: #54e780; color: #fff;">clearAll</button>
       </div>
               <div style="display: flex; justify-content: center; align-items: center;margin-top:5px">
           <p>Timer：</p>
            <input type="number" id="timers" min="10" value="10" style="cursor: pointer; width: 50px; font-size: 20px; border-radius: 5px; ">
      <button id="closeBtn" style="margin-left: 10px;font-size: 15px; width: 60px; cursor: pointer; height: 30px; margin-right: 10px; border: none; background-color: #e7a754; color: #fff;">close</button>
 
       </div>
       
       </div>
           </div>
  `;

  // Box functions
  function addBox() {
    document.body.appendChild(popupContainer);
  }

  function hiddenBox() {
    popupContainer.style.display = "none"; // 隐藏 box 而不是删除
  }

  function showBox() {
    popupContainer.style.display = "block"; // 显示box
  }

  // Watching target Element
  const checkForElement = () => {
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      console.log("已出现");
      // addBox();
      observer.disconnect();
      addBox();
      targetElement.insertAdjacentHTML(
        "beforebegin",
        `<div id="customButton" style="margin-top: 30px; width:200px; cursor: pointer; color: gray; text-align: center;">_____</div>`
      );

      const button = document.getElementById("customButton");
      button.addEventListener("click", () => {
        if (
          document.getElementById("popupContainer") &&
          popupContainer.style.display === "block"
        ) {
          hiddenBox();
        } else if (
          document.getElementById("popupContainer") &&
          popupContainer.style.display === "none"
        ) {
          showBox();
        }
      });

      const executeBtn = document.getElementById("executeBtn");
      const stopBtn = document.getElementById("stopBtn");
      const closeBtn = document.getElementById("closeBtn");
      const clearAll = document.getElementById("clearAll");
      function clearTheInterval() {
        clearInterval(intervalId);
        runFlag = false;
        executeBtn.style.cursor = "pointer";
        popupContainer.querySelector('h4').innerText = `Execution Count:0`;
      }
      // Button function
      executeBtn.addEventListener("click", () => {
        codeTextArea = document.getElementById("CodeTextarea").value;
        let codeFunction = new Function(codeTextArea); // Use codeTextArea
        let executionCount = 0;
        const loopCount = parseInt(
          document.getElementById("loopCount").value,
          10
        );
        const loopTimer =
          parseInt(document.getElementById("timers").value, 10) * 1000;
        if (runFlag === true) {
          console.log("别重复");
          return 0;
        }
        runFlag = true;

        executeBtn.style.cursor = "not-allowed";
        intervalId = setInterval(() => {
          if (executionCount < loopCount) {
            try {
         
              codeFunction();
              successfulCount++;
              executionCount++;
             popupContainer.querySelector('h4').innerText = `Execution Count:${successfulCount}`;
            } catch (error) {
              console.error(`执行出错: ${error.message}`);
            }
          } else {
            clearTheInterval();
            alert("fetch执行已完成");
          }
        }, loopTimer); // Use getRandomTime() here
      });

      stopBtn.addEventListener("click", () => {
        clearTheInterval();
        alert("fetch已停止");
      });

      closeBtn.addEventListener("click", () => {
        hiddenBox(); // Hide the box
      });

      clearAll.addEventListener("click", () => {
        console.log("yes");
        clearTheInterval();
        alert("fetch已停止和清空");
        codeTextArea = ""; // 清空代码变量
        document.getElementById("CodeTextarea").value = ""; // 清空文本区域
    
      });
    }
  };

  // Run observer to watch for element
  const observer = new MutationObserver(checkForElement);

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true, // Observe all child nodes
  });
}
