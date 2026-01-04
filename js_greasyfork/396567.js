// ==UserScript==
// @name         米家插件相关代码生成
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  获取设备相关属性, 生成相应的米家插件代码
// @author       kkopite
// @match        https://iot.mi.com/fe-op/productCenter/config/function/detail*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396567/%E7%B1%B3%E5%AE%B6%E6%8F%92%E4%BB%B6%E7%9B%B8%E5%85%B3%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/396567/%E7%B1%B3%E5%AE%B6%E6%8F%92%E4%BB%B6%E7%9B%B8%E5%85%B3%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
  "use strict";

  function es(sel) {
    return document.querySelectorAll(sel);
  }

  function copy(copyTxt) {
    // input不会保留换行符
    var createInput = document.createElement("textarea");
    createInput.value = copyTxt;
    document.body.appendChild(createInput);
    createInput.select(); //选择对象
    document.execCommand("Copy"); //执行浏览器复制命令
    createInput.className = "createInput";
    createInput.style.display = "none";
    alert("复制成功，可以粘贴了！");
    console.log(copyTxt);
  }

  function getSiid() {
    const search = location.search.substring(1);
    let siid = "";
    search.split("&").forEach(str => {
      const arr = str.split("=");
      if (arr[0] === "siid") {
        siid = arr[1];
      }
    });
    return siid;
  }

  // 获取相关属性
  /**
   * @returns {Array<{piid: number, name: string, desc: string, propStr: string, type: string, value: string | number}>}
   */
  function getProperty() {
    const ps = document.querySelector(".funcDefineDetail-item").querySelectorAll("tbody>tr");
    const res = [];
    ps.forEach(tr => {
      const vals = [...tr.cells].map(item => item.innerText);
      const name = _.camelCase(vals[1])
      res.push({
        piid: vals[0],
        name,
        desc: vals[2],
        type: vals[4],
        value: getDefaultValue(vals[4]),
        propStr: `command.${name}.prop`
      });
    });
    return res;
  }
  // 生成所需的代码
  function generateProperty() {
    const arr = getProperty();
    const siid = getSiid();
    const code = arr
      .map(item => {
        return `${item.name}: {
        did,
        prop: 'props.${siid}.${item.piid}',
        siid: ${siid},
        piid: ${item.piid}
      }`;
      })
      .join(",\n");
    copy(code);
  }

  function getDefaultValue(type) {
    switch (type) {
      case "bool":
        return false;
      case "float":
      case "uint8":
      case "uint16":
        return 0;
      default:
        return "''";
    }
  }
  // 生成react组件中 关于这些属性的声明, 获取, 订阅
  function generateReactCode() {
    const arr = getProperty()
    const code =
    `state = {
      ${arr.map(({name, value, desc}) => {
        return `
        // ${desc}
        ${name}: ${value}`
      }).join(',\n')}
    }
    initData () {
      getPropertiesValue([
        ${arr.map(({name}) => 'command.' + name).join(',\n')}
      ]).then(res => {
        ${arr.map(({name, value}, idx) => {
          return `const ${name} = res[${idx}].value`
        }).join('\n')}
        this.setState({
          ${arr.map(({name}) => name).join(',\n')}
        })
      })
    }
    register () {
      this.subcription = null
      this.listener = addListener(
        (device, messages) => {
          console.log('Device received', messages)
          ${arr.map(({name, propStr}, idx) => {
            const res = `if (messages.has(${propStr})) {
                const ${name} = messages.get(${propStr})[0]
                this.setState({
                  ${name}
                })
              }`
            if (idx === 0) return res
            return ' else ' + res
          }).join('')}
      })

      subscribeMessages(
        ${arr.map(({propStr}) => propStr).join(',\n')}
      ).then(subcription => {
        console.log('subcription success')
        this.subcription = subcription
      }).catch(e => {
        console.log('subscription failed', e)
      })
    }

    unRegister () {
      this.subcription && this.subcription.remove()
      this.listener && this.listener.remove()
    }
    `
    copy(code)
  }

  function addBtn(name, func) {
    const btn = document.createElement("button");
    btn.innerText = name;
    btn.addEventListener("click", func);
    btnContainer.appendChild(btn);
  }

  let btnContainer = null;

  function init() {
    btnContainer = document.createElement("div");
    btnContainer.style.position = "fixed";
    btnContainer.style.top = "64px";
    btnContainer.style.right = 0;
    btnContainer.style.padding = "10px";
    document.body.append(btnContainer);

    addBtn("获取属性代码", generateProperty);
    addBtn("生成属性订阅,获取代码", generateReactCode);
  }

  init();
})();
