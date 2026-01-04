// ==UserScript==

// @name         Insert Input and Button

// @namespace    http://tampermonkey.net/

// @version      1.0

// @description  Insert an input box and a button into the page

// @match        https://ad.oceanengine.com/*

// @grant        GM_setValue

// @grant        GM_getValue

// @grant       GM.setValue

// @grant       GM.getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/503927/Insert%20Input%20and%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/503927/Insert%20Input%20and%20Button.meta.js
// ==/UserScript==

(async function () {
    "use strict";
 
    
    function showDialog() {
        // 弹出对话框让用户输入字符串
        var userInput = prompt("请输入一些文本：");
      
        // 检查用户是否点击了取消或者没有输入任何内容
        if (userInput !== null) {
          // 打印用户输入的字符串
          console.log("You entered: " + userInput);
          // 这里可以添加其他逻辑来处理用户输入
        } else {
          console.log("No input was provided.");
        }
        return userInput
      }
      
//抖音授权

//获取行
async function 授权(){
    let id = showDialog()
    let row = document.querySelectorAll('.bui-table-body tr')
    for (let index = 0; index < row.length; index++) {
        const element = row[index];
        // 存在多个跳转链接
        let links = element.querySelectorAll('.ies-link')
        for (let index = 0; index < links.length; index++) {
            const link = links[index];
            if(link.innerText == "共享授权关系" && link.classList.contains("disabled")!= true){
                link.click()
                await sleep(1000)
                const dialog = document.querySelector('.bui-modal-dialog')
                setInput('input[placeholder="请输入账户关键词或ID"]',id)
                await sleep(3000)
                const item = document.querySelectorAll('.bui-infinite-scroller-box .byted-select-panel-item')
                await sleep(800)
                if(item.length == 2){
                item[1].click()
                console.log("点击");
                }
                await sleep(1000)
                document.querySelector('.byted-modal[data-show="true"]  button:nth-child(2)').click()
                await sleep(1000)

            }
    
            
        }
        
    }
}

//


    async function getValue(key) {
      const otherKey = await GM.getValue(key, null);
  
      console.log(otherKey);
  
      return otherKey;
    }
  
    async function setValue(key, value) {
      const otherKey = await GM.setValue(key, value);
  
      console.log(`存储${key}:${value}`);
  
      // return otherKey
    }
  
    // tools
  
    function tryEnhancer(baseFunction) {
      return function (...args) {
        try {
          // 执行传入的函数
  
          return baseFunction.apply(this, args);
        } catch (error) {
          // 处理错误
  
          console.error("捕获到错误:", error);
  
          // 可以选择抛出错误或者返回某个默认值
  
          // throw error; // 或者 return someDefaultValue;
        }
      };
    }
  
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  
    function getCurrentDateFormatted() {
      const now = new Date();
  
      const year = now.getFullYear(); // 获取年份
  
      const month = now.getMonth() + 1; // 获取月份，月份是从0开始的，所以需要+1
  
      const day = now.getDate(); // 获取日期
  
      // 格式化月份和日期，确保它们是两位数
  
      const formattedMonth = month < 10 ? "0" + month : month;
  
      const formattedDay = day < 10 ? "0" + day : day;
  
      // 组合成YYYY-MM-DD格式
  
      return `${year}-${formattedMonth}-${formattedDay}`;
    }
  
    // tools
  
    var style = document.createElement("style");
  
    style.type = "text/css";
  
    style.innerHTML = `
  
            #qjjBox {
  
                transition: all 0.3s ease;
  
                position: fixed;
  
                bottom: 20px;
  
                right: 20px;
  
                width: 300px;
  
                height: 400px;
  
                background-color: #f1f1f1;
  
                border-radius: 5px; /* 初始圆角 */
  
            }
  
  
  
  
  
            #qjjBox.minimized #mixButton {
  
                pointer-events: auto; /* 确保mixButton可以点击 */
  
            }
  
            #qjjBox.minimized {
  
                width: 50px; /* 缩小后的宽度 */
  
                height: 50px; /* 缩小后的高度 */
  
                border-radius: 50%; /* 圆形 */
  
                right: 10px; /* 缩小后更靠近边缘 */
  
                 opacity: 0.3; /* 设置透明度 */
  
                pointer-events: none; /* 允许点击穿透 */
  
            }
  
        `;
  
    document.head.appendChild(style);
  
    // 投流配置项目
  
    // 1.营销目标与场景 只需要看应用调起
  
    let 应用调起select =
      "#ad-main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(5) > div .newLanding:nth-child(2)";
  
    // 2.投放内容与目标
  
    // app配置
  
    const application = {
      安卓: "https://apps.bytesfield.com/download/basic/cur/cef394c735358045c4e85c47d2ecc0f85b92d8e7",
  
      IOS: "https://apps.apple.com/cn/app/id387682726",
    };
  
    let 应用包select = 'input[placeholder="请输入应用下载链接或选择已有应用"]';
  
    let deepLinkSelect =
      "div:nth-child(2) > div > div > div > div > div.oc-input-group-wrap > div > div > input";
  
    let 事件管理 =
      "div.ovui-select.ovui-select--md.ovui-select--fill > div > input";
  
    // 双转需要的元素
  
    let 下单 =
      'div[data-slot-name="deep-optimize-target"]'
    let app内下单 = `body > div.ovui-select__popper.ovui-select__popper--show > div.ovui-select__options > div > div > span > div > div > div > div > span`;
  
    //投放版位
  
    let 首选媒体 = 'div[data-slot-name="platform-module"]';
  
    let 应用选择 = 'div[data-slot-name="app-select"]';
  
    // 地域
  
    let 地域 = 'div[data-slot-name="district-new"]';
  
    // 年龄
  
    let 年龄 = 'data-slot-name="age"';
  
    // 是否已安装用户
  
    let 是否已安装用户 = 'div[data-slot-name="install"]';
  
    // 是否设置日期
  
    let 是否设置日期 = 'div[data-slot-name="date_range"]';
  
    // 日期范围 里面input 有两个需要修改
  
    let 日期范围 = 'div[data-slot-name="date_range"]';
  
    // 是否设置项目预算
  
    let 是否设置项目预算 = 'div[data-slot-name="budget"]';
  
    // 预算设置
  
    let 预算设置 = 'data-slot-name="total-budget-input"';
  
    // 出价系数
  
    let 出价系数 = 'div[data-slot-name="bid-coefficient"]';
  
    // 定向扩展
  
    let 定向扩展 = 'div[data-slot-name="audience-extend"]';
  
    // 项目名称
  
    let 项目名称 = 'div[data-slot-name="project-name"]';
  
    let 优化目标 = 'div[data-slot-name="optimize-target"]';
  
    // 选择日期
  
    // 假设您的日期控件的类名为 'date-picker-class'
  
    // var datePickerElement = document.querySelectorAll('[data-slot-name="range-picker"] input')[1];
  
    // datePickerElement.click()
  
    // document.querySelector('td[title="2024-10-03"]')
  
    async function waitForSelectValue(
      selector,
      expectedValue,
      timeout,
      interval
    ) {
      //     selector: CSS选择器，用于指定需要读取值的select元素。
  
      // expectedValue: 期望的值，当select元素的值与这个值相匹配时，函数会返回true。
  
      // timeout: 超时时间，单位毫秒，如果在这段时间内没有找到匹配的值，会触发超时。
  
      // interval: 循环时间，单位毫秒，表示每隔多久检查一次select元素的值。
  
      // 函数内部使用setTimeout设置了一个超时计时器，如果在指定的超时时间内没有找到匹配的值，就会通过reject拒绝这个Promise，并显示一个错误信息。同时，使用setInterval设置了一个周期性检查计时器，每隔一定的时间就读取一次select元素的值，并与期望值进行比较。如果值相符，就会清除间隔计时器和超时计时器，并通过resolve解决这个Promise。
  
      return new Promise((resolve, reject) => {
        // 定义超时拒绝函数
  
        const timeoutId = setTimeout(() => {
          clearInterval(intervalId); // 清除间隔
  
          reject(
            new Error(
              `超时错误：等待元素 ${selector} 的值 ${expectedValue} 超过 ${timeout} 毫秒。`
            )
          );
        }, timeout);
  
        // 定义周期性检查函数
  
        const intervalId = setInterval(() => {
          const currentValue = document.querySelector(selector).value;
  
          if (currentValue === expectedValue) {
            clearInterval(intervalId); // 清除间隔
  
            clearTimeout(timeoutId); // 清除超时
  
            resolve(true); // 值相符，解决Promise
          }
        }, interval);
      });
    }
  
    async function clickDate(dateStr, Select) {
      // 开始时间
  
      var datePickerElement = document.querySelectorAll(Select)[0];
  
      datePickerElement.click();
  
      const expectedValue = getCurrentDateFormatted();
  
      document.querySelector(`td[title="${expectedValue}"]`).click();
  
      await sleep(500);
  
      // 到期时间
  
      var datePickerElement = document.querySelectorAll(Select)[1];
  
      datePickerElement.click();
      await sleep(500);
      console.log(dateStr);
      document
        .querySelector(`td[title="${dateStr.replace(/年|月/g, "-")}"]`)
        .click();
      await sleep(500);
    }
  
    // clickDate('2024-10-20','[data-slot-name="range-picker"] input')
  
    // 创建元素
  
    function createElement(tag, ...arg) {
      var element = document.createElement(tag);
  
      // element.className = className;
  
      // element.textContent = textContent;
  
      // 检查数组长度是否为偶数，如果不是，则无法正确配对键值对
  
      if (arg.length % 2 !== 0) {
        console.error("属性和值的数量不匹配");
  
        return element;
      }
  
      // 遍历数组，步长为2（即每次跳过一个元素）
  
      for (var i = 0; i < arg.length; i += 2) {
        var attrName = arg[i];
  
        var attrValue = arg[i + 1];
  
        element.setAttribute(attrName, attrValue);
      }
  
      return element;
    }
  
    // 输入
  
    function setInput(select, value) {
      document.querySelector(select).value = value;
  
      document.querySelector(select).dispatchEvent(new Event("input"));
    }
  
    function setDate(select, value) {
      document.querySelector(select).value = value;
  
      document.querySelector(select).dispatchEvent(new Event("change"));
    }
  
    // 清除
  
    function setClear(select) {
      document.querySelector(select).value = "";
  
      document.querySelector(select).dispatchEvent(new Event("input"));
    }
  
    // 点击
  
    function setClick(select) {
      document.querySelector(select).click();
    }
  
    // 下拉选项
  async function 下拉(select,child,value,is双出价){
      setClick(select)
      await sleep(500)
      // setClick(`${child}`)
      document.querySelectorAll(child).forEach(e=>{if(e.innerText == value){
      console.log(e.innerText);
          e.click()
      }})
          await sleep(500)
  
                // 一键清空
        if (is双出价 == true) {
          document.querySelector(`${下单} input`).click();
  
          await sleep(500);
  
          document.querySelector(app内下单).click();
          // document.querySelectorAll(child).forEach(e=>{if(e.innerText == "app内下单"){
          //     console.log(e.innerText);
          //         e.click()
          //     }})
          await sleep(500)
          document.querySelector(`body > div.ovui-select__popper.ovui-select__popper--show > div.ovui-select__options > div > div > span > div`).click();
        }
  
  
  }
  
    function setApp(项目名称) {
      if (项目名称.indexOf("安卓") == -1) {
        setInput(`${应用选择} input`, application.IOS);
      } else {
        setInput(`${应用选择} input`, application.安卓);
      }
    }
  
    // setInput(下单,下单value)
    function get测试项(title) {
      const str = title.split(/【/g);
      return str[str.length - 1];
    }
    async function setX(contexta) {
      const context = contexta.trim().split(/	/g);
  
      const [xname, h5, dp] = context;
      const 备注 = get测试项(xname);
      const is双出价 = 备注.indexOf("双") != -1;
  
      let h5Select = `div.ovui-input-group.ovui-input-group--md.oc-input-group > div > input[placeholder="请输入落地页链接或者点击选择落地页"]`;
  
      let gname = `#ad-main > div > div:nth-child(8) > div > div:nth-child(3) > div > div > div.input-group-wrap > div > div > textarea`;
  
      const title = document.querySelector("title").innerText;
      const endDate = xname.match(/[0-9]{4}年[0-9]{2}月[0-9]{2}/g)[0];
      if (title.indexOf("项目") != -1) {
        // 已安装定向
        await tryEnhancer(await clickDate)(endDate, '[data-slot-name="range-picker"] input'); // clickDate(,))
  
        // 下拉访问
      tryEnhancer(下拉)(优化目标,'.option-wrapper',"app内访问",is双出价)
        // 判断是否是首选
  
        tryEnhancer(selectOptionCheck)(首选媒体, "首选媒体");
  
        // 点击定向扩展
  
        tryEnhancer(setClick)(`${定向扩展} .ovui-radio-item:nth-child(1)`);
  
        // 出价系数
        tryEnhancer(setInput)(`${出价系数} input`, "1.05")
  
        // 修改项目名称
  
        tryEnhancer(setInput)(`${项目名称} textarea`, xname);
  
        // 修改deepLink
  
        tryEnhancer(setInput)(deepLinkSelect, dp);
  
        // app链接
  
        tryEnhancer(setApp)(xname);
        await sleep(1000)
  
        // 深度转化
        tryEnhancer(setClick)(
          `${是否已安装用户} .oc-radio-group .ovui-radio-item:nth-child(3)`
        );
  
      }
  
      if (title.indexOf("广告") != -1) {
        tryEnhancer(setInput)(h5Select, h5);
  
        tryEnhancer(setInput)(gname, xname);
  
        // 一键清空
  
        document
          .querySelector(
            "div:nth-child(1) > div > div.oc-button-wrap.clear > button"
          )
  
          .click();
  
        await sleep(500);
  
        document
          .querySelector(
            " span.oc-typography.oc-typography-cursor.oc-typography-size-xs.oc-typography-color-primary.oc-typography-type-paragraph.oc-typography-span-undefined.oc-msg-list__item-a > span"
          )
          .click();
  
        // 填写价格
        if (is双出价 == true) {
          tryEnhancer(setInput)(
            "#ad-main > div > div:nth-child(6) > div > div:nth-child(13) > div > div > div.input-group-wrap > div > div.ovui-input__wrapper.ovui-input__wrapper--md.ovui-input__wrapper--clearable.ovui-input__wrapper--fill > input",
  
            "99"
          );
        }
      }
    }
  
    var gBox = createElement(
      "div",
  
      "id",
  
      "qjjBox",
  
      "style",
  
      "position: fixed; bottom: 20px; right: 20px; width: 300px; height: 400px; background-color: #f1f1f1;"
    );
  
    // 创建输入框
  
    var inputBox = createElement(
      "input",
  
      "type",
  
      "text",
  
      "id",
  
      "myInputBox",
  
      "style",
  
      "padding: 5px; margin: 10px;"
    );
  
    // 创建按钮
  
    var button = createElement(
      "button",
  
      "id",
  
      "myButton",
  
      "style",
  
      "padding: 5px 10px; margin: 10px;"
    );
  
    var 授权按钮 = createElement(
        "button",
    
        "id",
    
        "sq",
    
        "style",
    
        "padding: 5px 10px; margin: 10px;"
      );
    
    button.textContent = "Click Me";
    授权按钮.textContent = "授权按钮";
    var mixButton = createElement("button", "id", "mixButton");
  
    mixButton.textContent = "mix";
  
    async function selectOptionCheck(select, text) {
      const t = `${select} .ovui-radio-item--checked`;
  
      console.log(t);
  
      const value = document.querySelector(t).innerText;
  
      console.log(value);
  
      if (value != text) {
        alert(text + "选项未匹配需要调整");
      }
    }
  
    // 可以添加样式
  
    gBox.appendChild(inputBox);
  
    gBox.appendChild(button);
  
    gBox.appendChild(mixButton);
    gBox.appendChild(授权按钮);
    //日期匹配
  
    // gBox.appendChild(checkbox双);
  
    let info = await getValue("info");
  
    if (info != null) {
      inputBox.value = info;
    }
    授权按钮.addEventListener("click", async function () {
 授权()
      });
    
    // 为按钮添加点击事件监听器
  
    button.addEventListener("click", async function () {
      var inputValue = document.getElementById("myInputBox").value;
  
      // 这里可以执行你想要的操作，例如打印输入值
  
      //console.log('Button clicked! Input value:', inputValue);
  
      tryEnhancer(setX)(inputValue);
  
      await setValue("info", inputValue);
    });
  
    mixButton.addEventListener("click", async function () {
      var box = document.getElementById("qjjBox");
  
      // box.innerText = await geValue("a")
  
      // 切换类名来实现缩小和恢复
  
      box.classList.toggle("minimized");
    });
  
    // 将元素添加到页面
  
    document.body.appendChild(gBox);
  
    //document.body.appendChild(button);
  })();