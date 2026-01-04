// ==UserScript==
// @name        human_bench_mark_cheats
// @namespace   http://tampermonkey.net/
// @match       https://humanbenchmark.com/*
// @grant       none
// @version     1.0
// @author      AWAQ
// @description 2024
// @license     AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/512634/human_bench_mark_cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/512634/human_bench_mark_cheats.meta.js
// ==/UserScript==

// https://github.com/awaqawaqawaq/JS_scripts 
// humanbenchmark真是一个非常适合脚本初学者学习的网站😂😂😂


window.addEventListener("load", function () {
  if (
    window.location.href === "https://humanbenchmark.com/tests/reactiontime"
  ) {
    // 选择需要观察变动的节点
    const getTargetNode = () => document.querySelector(".anim-slide-fade-in");
    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };
    // 创建一个观察器实例
    const observer = new MutationObserver(callback);
    // 当观察到变动时执行的回调函数
    function callback(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log(mutation.target);
          console.log("A child node has been added or removed.");
          // 暂停观察器，避免死循环
          observer.disconnect();
          // 模拟鼠标 mousedown 事件
          simulateMouseDown(mutation.target);
          // 点击完成后重新启用观察器
          observer.observe(getTargetNode(), config);
        } else if (mutation.type === "attributes") {
          console.log(
            "The " + mutation.attributeName + " attribute was modified."
          );
        }
      }
    }

    const targetNode = getTargetNode();
    if (!targetNode) {
      console.error("Target node not found!");
      return; // Exit if the target node doesn't exist
    }
    // 开始观察目标节点
    observer.observe(targetNode, config);
    // 模拟鼠标 mousedown 事件
    function simulateMouseDown(target) {
      if (!target) return;
      // 创建和触发 mousedown 事件
      const mousedownEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      target.dispatchEvent(mousedownEvent);

      console.log("Simulated a mousedown event on the target element.");
    }
  }

  if (window.location.href === "https://humanbenchmark.com/tests/sequence") {
    let simulateMouseEvent = (element) => {
      element.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 0,
        })
      );
      element.dispatchEvent(
        new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          button: 0,
        })
      );
    };

    let observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === "attributes") {
          let element = mutation.target;
          let num = parseInt(
            document.querySelectorAll(".css-dd6wi1 span")[1].innerText
          );
          if (element.classList.contains("active")) {
            console.log(num);
            elementArray.push(element);
            console.log(element);
            if (num === 31) {
              observer.disconnect();
            }
            if (elementArray.length == num) {
              setTimeout(() => {
                elementArray.forEach((element) => {
                  simulateMouseEvent(element);
                });
                elementArray = []; //注意异步编程，不能写在外面
              }, 2000);
            }
          }
        }
      });
    });

    const config = { attributes: true, childList: true, subtree: true };
    let startBtn = document.querySelector(".css-de05nr.e19owgy710");
    simulateMouseEvent(startBtn);
    let elementArray = [];
    let elementNode = document.querySelector(".squares");
    observer.observe(elementNode, config);
  }

  if (window.location.href == "https://humanbenchmark.com/tests/typing") {
    function similateKeyPress(character, element) {
      let keydownEvent = new KeyboardEvent("keydown", {
        key: character,
        bubbles: true,
        cancelable: true,
      });
      let keyupEvent = new KeyboardEvent("keyup", {
        key: character,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(keydownEvent);
      element.dispatchEvent(keyupEvent);
    }

    let spans = document.querySelectorAll('[tabindex="1"] span');
    let spansText = Array.from(spans).map((element) => element.innerText);
    spansText.forEach((text, index) => {
      similateKeyPress(text, spans[index]);
    });
  }

  if (window.location.href == "https://humanbenchmark.com/tests/memory") {
    let simulateMouseEvent = (element) => {
      element.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 0,
        })
      );
      element.dispatchEvent(
        new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          button: 0,
        })
      );
    };

    let observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === "attributes") {
          let element = mutation.target;
          let num =parseInt(document.querySelectorAll(".css-dd6wi1 span")[1].innerText);
          console.log(num);
          if(num===40){
            observer.disconnect();
          }
          if (element.classList.contains("active")) {
            elementArray.push(element);
            console.log(element);
            setTimeout(() => {
              simulateMouseEvent(element);
            }, 2000);
          }
        }
      });
    });

    let elementArray = [];
    const config = { attributes: true, childList: true, subtree: true };
    let elementNode = document.querySelector(
      ".memory-test.css-aix2he.e19owgy77"
    );
    let startBtn = document.querySelector(".css-de05nr.e19owgy710");

    observer.observe(elementNode, config);
    simulateMouseEvent(startBtn);
  }

  if (window.location.href === "https://humanbenchmark.com/tests/aim") {
    let node = document.querySelector(".desktop-only");
    let observer = new MutationObserver(function (mutationsList) {
      //   if(mutationsList.length!=0){
      //       let element=document.querySelector('[data-aim-target="true"]');
      //       if(element){
      //         simulateMouseEvent(element);
      //     }else{
      //       observer.observe(node,{childList:true,subtree:true});

      //     }}
      //这种方式无法确保元素已经成功渲染，会导致出现“暂停”的行为
      //最好的方式是利用 foreach 循环，确保元素成功加载
      //foreach 也会导致“暂停”
      mutationsList.forEach(function (mutation) {
        // console(mutation.oldValue);
        let element = document.querySelector('[data-aim-target="true"]');
        if (element) simulateMouseEvent(element);
      });
    });
    observer.observe(node, { childList: true, subtree: true });
    function simulateMouseEvent(element) {
      const box = element.getBoundingClientRect();
      const coordX = box.left + (box.right - box.left) / 2;
      const coordY = box.top + (box.bottom - box.top) / 2;
      element.dispatchEvent(
        new MouseEvent("mousedown", {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: coordX,
          clientY: coordY,
          button: 0,
        })
      );
      element.dispatchEvent(
        new MouseEvent("mouseup", {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: coordX,
          clientY: coordY,
          button: 0,
        })
      );
    }
  }

  if (
    window.location.href === "https://humanbenchmark.com/tests/verbal-memory"
  ) {
    // 获取开始按钮并点击
    let startBtn = document.querySelector(".css-de05nr.e19owgy710");
    if (startBtn) {
      startBtn.click();
    }

    // 获取看到的按钮和新单词按钮
    let seen = document.getElementsByClassName("css-de05nr e19owgy710")[0]; // 假设这是"已见"按钮
    let newWord = document.getElementsByClassName("css-de05nr e19owgy710")[1]; // 假设这是"新单词"按钮
    let MAP = new Map();
    let cnt = 0;

    // 定义一个函数来处理新单词的点击
    function handleWord() {
      let text = document.querySelector(".word").innerText; // 获取当前单词
      console.log(text);
      if (!MAP.has(text)) {
        MAP.set(text, 1); // 记录已见单词
        if (newWord) {
          newWord.click(); // 点击新单词按钮
        }
      } else {
        if (seen) {
          seen.click(); // 点击已见按钮
        }
      }

      cnt++;

      // 限制循环次数或添加延迟以避免阻塞
      if (cnt < 5000) {
        setTimeout(handleWord, 10); // 每秒执行一次
      }
    }

    // 启动单词处理函数
    setTimeout(handleWord, 1000); // 延迟启动，确保页面元素已加载
  }

  if (window.location.href === "https://humanbenchmark.com/tests/chimp") {
    function loopTilEnd() {
      let i = 1;
      let startButton = document.querySelector(".css-de05nr.e19owgy710");
      if (startButton) {
        startButton.click();
      } else {
        return;
      }
      while (true) {
        let cell = document.querySelector(`[data-cellnumber="${i}"]`);
        if (!cell) {
          break;
        } else {
          cell.click();
          i++;
        }
      }
      loopTilEnd();
    }

    loopTilEnd();
  }

  if (
    window.location.href == "https://humanbenchmark.com/tests/number-memory"
  ) {
    let cnt = 0;
    function getNumbers() {
      if (cnt == 25) {
        return;
      }
      if (document.getElementsByClassName("big-number").length != 0) {
        let number = new Array();
        for (let i of document.getElementsByClassName("big-number ")[0]
          .innerText) {
          number.push(i);
          console.log(i);
        }
        console.log(number);
        inputNumbers(number);
        cnt++;
      } else {
        setTimeout(() => {
          getNumbers();
        }, 1);
      }
    }
    function simulateKeyPress(character, element) {
      let keydownEvent = new KeyboardEvent("keydown", {
        key: character,
        char: character,
        bubbles: true,
      });
      let keyupEvent = new KeyboardEvent("keyup", {
        key: character,
        char: character,
        bubbles: true,
      });
      element.dispatchEvent(keydownEvent);
      element.dispatchEvent(keyupEvent);
    } // 实际上并不能正确的输入
    function inputNumbers(numbers) {
      let input = document.getElementsByTagName("input")[0];
      if (input) {
        
        input.focus(); // 确保输入框获得焦点
        numbers.forEach((number) => {
          // 使用 execCommand 插入每一个字符
          document.execCommand("insertText", false, number);
        });
        document.getElementsByClassName("css-de05nr e19owgy710")[0].click();
        document.getElementsByClassName("css-de05nr e19owgy710")[0].click();
        getNumbers();
      } else {
        // 将 inputNumbers 函数作为回调传递给 setTimeout
        setTimeout(() => inputNumbers(numbers), 100);
      }
    }
    let startbtn = document.querySelector("button.css-de05nr.e19owgy710");
    startbtn.click();
    getNumbers();
  }
});
