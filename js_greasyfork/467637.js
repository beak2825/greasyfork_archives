// ==UserScript==
// @name         Ant Design表单回填
// @namespace    http://tampermonkey-filler
// @version      1.0.2
// @description  Fill Ant Design forms with random data
// @require      https://cdn.jsdelivr.net/npm/mockjs@1.1.0/dist/mock-min.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.7/dayjs.min.js
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467637/Ant%20Design%E8%A1%A8%E5%8D%95%E5%9B%9E%E5%A1%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/467637/Ant%20Design%E8%A1%A8%E5%8D%95%E5%9B%9E%E5%A1%AB.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let instance = null;

  // 使用mockjs生成随机数据
  const generateRandomString = () => {
    return Mock.mock("@ctitle");
  };

  const generateRandomNumber = () => Math.floor(Math.random() * 100);

  const getRandomIndex = (length) => Math.floor(Math.random() * length);

  const selectRandomOptions = (options) => {
    for (let i = 0; i < options.length; i++) {
      if (Math.random() < 0.5) {
        options[i].selected = true;
      }
    }
  };

  const generateRandomDate = () => {
    console.log(dayjs());
    return dayjs();
  };


  const getNumberOrStr = (value) => {
    return isNaN(Number(value)) ? value : Number(value)
  }

  const getValueByFieldType = (children) => {
    const field = children[0]

    const classes = field?.classList || [];

    // 单选
    if (classes?.contains("ant-radio-group")) {
      // 所有选项
      const allOptions = field.querySelectorAll('input[type="radio"]');
      // 随机值
      const randomIndex = getRandomIndex(allOptions.length);
      const value = allOptions[randomIndex].value;
      return {
        [field.id]: getNumberOrStr(value),
      };
    } else if (classes.contains('ant-checkbox-group')){
      // 多选
      // 所有选项
      const allOptions = field.querySelectorAll('input[type="checkbox"]');
      // 随机多个选项
      const randomIndex = getRandomIndex(allOptions.length);
      const randomOptions = []
      for(let i = 0; i < randomIndex; i++){
        randomOptions.push(getNumberOrStr(allOptions[i].value))
      }
      return {
        [field.id]: randomOptions,
      };
    }else if(classes.contains('ant-input-number-group-wrapper') || classes.contains('ant-input-number')){
      const inputField = field.querySelector('input');
      if(!inputField?.id){
        return {}
      }
      return {
        [inputField.id]: generateRandomNumber(),
      };
    } else if(classes.contains('ant-picker')){
      const inputField = field.querySelector('input');
      return {
        [inputField.id]: generateRandomDate(),
      }
    } else if (classes.contains("ant-select")) {
      const inputField = field.querySelector('input');
      const clickEvent = new Event("mousedown", {
        bubbles: true,
        cancelable: true,
      });

      // class=ant-select-selector 派发事件
      field.children[0].dispatchEvent(clickEvent);

      let optionsId = inputField?.attributes?.["aria-owns"]?.value;
      const options = document.querySelector(`#${optionsId}`);
      if (options?.childNodes?.length) {
        // 随机下拉选择
        return { [inputField.id]:options.childNodes[getRandomIndex(options.childNodes.length)].textContent}
      } else {
        return {};
      }
      // 如果父级的classList 包含ant-picker-input则是日期选择器
    }  else{
      const inputField = field.querySelector('input[type="text"]');
      if(!inputField?.id){
        return {}
      }
      return {
        [inputField.id]: generateRandomString(),
      };
    }

  };

  // 递归遍历 DOM 元素，查找 React FiberNode
  function getReactFiberNode(element) {
    for (let key in element) {
      if (key.startsWith("__reactFiber")) {
        return element[key];
      }
    }
    return null;
  }

  // 递归遍历 FiberNode，查找 React 组件实例对象
  function getReactComponentInstance(fiberNode) {
    if (fiberNode?.stateNode && fiberNode?.stateNode.hasOwnProperty("state")) {
      return fiberNode?.stateNode;
    }

    let child = fiberNode?.child;
    while (child) {
      instance = getReactComponentInstance(child);
      if (instance) {
        return instance;
      }
      child = child.sibling;
    }

    return null;
  }

  // 回填表单
  const fillForm = (form) => {
    // 找到fiberNode
    const __reactFiber = getReactFiberNode(form);
    if (__reactFiber) {
      // 通过fiberNode找到组件实例
      const instance = getReactComponentInstance(__reactFiber);
      if (instance) {
        const fields = document.querySelectorAll(".ant-form-item-control-input-content");
        let fillValues = {};
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];

          // if(field.type === 'radio'){
          //   // 查找radioGroup
          //   const radioGroupEle = field.parentNode.parentNode.parentNode
          //   // 所有选项
          //   const allOptions = radioGroupEle.querySelectorAll('input[type="radio"]')
          //   // 随机值
          //   const randomIndex = getRandomIndex(allOptions.length)
          //   fillValues[radioGroupEle.id] = Number(allOptions[randomIndex].value)
          // }else if(field.type === 'checkbox'){
          //   // 查找radioGroup
          //   const radioGroupEle = field.parentNode.parentNode.parentNode
          //   // 所有选项
          //   const allOptions = radioGroupEle.querySelectorAll('input[type="radio"]')
          //   // 随机值
          //   const randomIndex = getRandomIndex(allOptions.length)
          //   fillValues[radioGroupEle.id] = Number(allOptions[randomIndex].value)
          // }else{
            if(field?.childElementCount){
              fillValues = { ...fillValues, ...getValueByFieldType(field.children) };
            }
          // }
        }
        // 去掉
        console.log(instance, fillValues, "最后回填的值");
        instance?.context?.setFieldsValue(fillValues);
      } else {
        throw new Error("不能找到组件实例");
      }
    } else {
      throw new Error("不能找到FiberNode");
    }
  };

  const addButton = () => {
    const button = document.createElement("button");
    button.innerText = "回填弹框表单";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";
    button.addEventListener("click", () => {
      // 在这里根据具体的Ant Design表单结构，找到目标表单元素
      const formElement = document?.querySelector(".ant-modal-body")?.querySelector("form");
      if (!formElement) {
        throw new Error("不能找到表单元素");
      }else{
        fillForm(formElement);
      }

    });

    const button1 = document.createElement("button");
    button1.innerText = "回填表单";
    button1.style.position = "fixed";
    button1.style.bottom = "50px";
    button1.style.right = "10px";
    button1.style.zIndex = "9999";
    button1.addEventListener("click", () => {
      // 在这里根据具体的Ant Design表单结构，找到目标表单元素
      const formElement = document?.querySelector("form");
      if (!formElement) {
        throw new Error("不能找到表单元素");
      }else{
        fillForm(formElement);
      }

    });

    document.body.appendChild(button);
    document.body.appendChild(button1);
  };

  addButton();
})();
