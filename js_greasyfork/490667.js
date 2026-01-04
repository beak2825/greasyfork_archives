// ==UserScript==
// @name        北林OJ
// @namespace   greasyfork.org
// @match       https://www.bjfuacm.com
// @match       https://www.bjfuacm.com/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @version     1.0
// @author      Gwen0x4c3
// @license     MIT
// @description 北林OJ专用，替换C++头文件、展示当前题目可查看的答案、提交状态显示与CE原因显示、设置每页展示题目数、展示题目状态
// @downloadURL https://update.greasyfork.org/scripts/490667/%E5%8C%97%E6%9E%97OJ.user.js
// @updateURL https://update.greasyfork.org/scripts/490667/%E5%8C%97%E6%9E%97OJ.meta.js
// ==/UserScript==

!(function() {
  'use strict';
  
  var $msg = {success:console.log,error:console.log,info:console.log}
  let h0x00=setInterval(()=>{
    if(document&&document.head&&document.body) {
      clearInterval(h0x00)
      function useMessage(){function n(n){for(var o=10,e=0;e<f.length;e++){var t=f[e];if(n&&n===t)break;o+=t.clientHeight+20}return o}function o(o){for(var e=0;e<f.length;e++){if(f[e]===o){f.splice(e,1);break}}o.classList.add(a.hide),f.forEach(function(o){o.style.top=n(o)+"px"})}function e(e){function i(){p.removeEventListener("animationend",i),setTimeout(o,x||t.duration||3e3,p)}function s(){"0"===getComputedStyle(p).opacity&&(p.removeEventListener("transitionend",s),p.remove())}var d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"info",x=arguments[2],p=r.createElement("div");p.className=a.box+" "+d,p.style.top=n()+"px",p.style.zIndex=c,p.innerHTML='\n    <span class="'+a.icon+'"></span>\n    <span class="'+a.text+'">'+e+"</span>\n    ",c++,f.push(p),r.body.appendChild(p),p.addEventListener("animationend",i),p.addEventListener("transitionend",s)}var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=document,i="__"+Math.random().toString(36).slice(2,7),a={box:"msg-box"+i,hide:"hide"+i,text:"msg-text"+i,icon:"msg-icon"+i},s=r.createElement("style");s.textContent=("\n  ."+a.box+", ."+a.icon+", ."+a.text+" {\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n  }\n  ."+a.box+" {\n    position: fixed;\n    top: 0;\n    left: 50%;\n    display: flex;\n    padding: 12px 16px;\n    border-radius: 2px;\n    background-color: #fff;\n    box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);\n    white-space: nowrap;\n    animation: "+a.box+"-move .4s;\n    transition: .4s all;\n    transform: translate3d(-50%, 0%, 0);\n    opacity: 1;\n    overflow: hidden;\n  }\n  ."+a.box+'::after {\n    content: "";\n    position: absolute;\n    left: 0;\n    top: 0;\n    height: 100%;\n    width: 4px;\n  }\n  @keyframes '+a.box+"-move {\n    0% {\n      opacity: 0;\n      transform: translate3d(-50%, -100%, 0);\n    }\n    100% {\n      opacity: 1;\n      transform: translate3d(-50%, 0%, 0);\n    }\n  }\n  ."+a.box+"."+a.hide+" {\n    opacity: 0;\n    /* transform: translate3d(-50%, -100%, 0); */\n    transform: translate3d(-50%, -100%, 0) scale(0);\n  }\n  ."+a.icon+" {\n    display: inline-block;\n    width: 18px;\n    height: 18px;\n    border-radius: 50%;\n    overflow: hidden;\n    margin-right: 6px;\n    position: relative;\n  }\n  ."+a.text+" {\n    font-size: 14px;\n    line-height: 18px;\n    color: #555;\n  }\n  ."+a.icon+"::after,\n  ."+a.icon+'::before {\n    position: absolute;\n    content: "";\n    background-color: #fff;\n  }\n  .'+a.box+".info ."+a.icon+", ."+a.box+".info::after {\n    background-color: #1890ff;\n  }\n  ."+a.box+".success ."+a.icon+", ."+a.box+".success::after {\n    background-color: #52c41a;\n  }\n  ."+a.box+".warning ."+a.icon+", ."+a.box+".warning::after {\n    background-color: #faad14;\n  }\n  ."+a.box+".error ."+a.icon+", ."+a.box+".error::after {\n    background-color: #ff4d4f;\n  }\n  ."+a.box+".info ."+a.icon+"::after,\n  ."+a.box+".warning ."+a.icon+"::after {\n    top: 15%;\n    left: 50%;\n    margin-left: -1px;\n    width: 2px;\n    height: 2px;\n    border-radius: 50%;\n  }\n  ."+a.box+".info ."+a.icon+"::before,\n  ."+a.box+".warning ."+a.icon+"::before {\n    top: calc(15% + 4px);\n    left: 50%;\n    margin-left: -1px;\n    width: 2px;\n    height: 40%;\n  }\n  ."+a.box+".error ."+a.icon+"::after, \n  ."+a.box+".error ."+a.icon+"::before {\n    top: 20%;\n    left: 50%;\n    width: 2px;\n    height: 60%;\n    margin-left: -1px;\n    border-radius: 1px;\n  }\n  ."+a.box+".error ."+a.icon+"::after {\n    transform: rotate(-45deg);\n  }\n  ."+a.box+".error ."+a.icon+"::before {\n    transform: rotate(45deg);\n  }\n  ."+a.box+".success ."+a.icon+"::after {\n    box-sizing: content-box;\n    background-color: transparent;\n    border: 2px solid #fff;\n    border-left: 0;\n    border-top: 0;\n    height: 50%;\n    left: 35%;\n    top: 13%;\n    transform: rotate(45deg);\n    width: 20%;\n    transform-origin: center;\n  }\n  ").replace(/(\n|\t|\s)*/gi,"$1").replace(/\n|\t|\s(\{|\}|\,|\:|\;)/gi,"$1").replace(/(\{|\}|\,|\:|\;)\s/gi,"$1"),r.head.appendChild(s);var c=t.zIndex||1e4,f=[];return{show:e,info:function(n){e(n,"info")},success:function(n){e(n,"success")},warning:function(n){e(n,"warning")},error:function(n){e(n,"error")}}}
      $msg=useMessage();
      // $msg.success('脚本开始运行')
    }
  },100)
  
  function injectCSS() {
    GM_addStyle(".error-log{list-style-type:none;padding:0}.error-log li{background-color:#f8d7da;color:#721c24;padding:10px;margin-top:5px;border:1px solid #f5c6cb;border-radius:5px;font-size:14px}");
    GM_addStyle('.oj-button{z-index:10000;width:120px;height:30px;line-height:30px;text-align:center;color:black;font-weight:bold;cursor:pointer}.oj-panel{z-index:10000;background:white;position:fixed;left:20px;top:20px;width:390px;border:1px solid #000}.oj-header{position:relative;height:30px;background:rgb(250, 250, 250);cursor:move}.oj-close{position:absolute;right:10px;top:0;font-size:19px;cursor:pointer}.oj-body{min-height:200px;max-height:500px;overflow-y:auto;overflow-x:hidden}.oj-result{padding:10px;transition:.2s;font-size:14px;}.oj-result:hover{background:rgb(240,240,240);}')
    GM_addStyle('.ojh{}.ojh-button{}.ojh-save{background:rgb(246,246,246);}.ojh-save-content{display:inline-block;width:90%;height:200px;resize:none;margin:5px auto;vertical-align:top}.ojh-save-button{margin-left:100px}.ojh-body{max-height:500px;padding:10px;overflow-y:auto;background:rgb(240,240,240)}.ojh-file{position:relative;border-bottom:1px solid black;padding: 10px 2px;}.ojh-file-name{}.ojh-file-delete{display:block;position:absolute;right:10px;top:0}.ojh-file-content{display:block;width:100%;height:200px;resize:none;margin:5px auto}.text-button{display:inline-block;text-align:center;color:blue;cursor:pointer}');
  }
  
  const status_map={"-2":{name:"Compile Error",short:"CE",color:"orange",type:"warning"},"-1":{name:"Wrong Answer",short:"WA",color:"#f8d7da",type:"error"},0:{name:"Accepted",short:"AC",color:"rgb(232,249,240)",type:"success"},1:{name:"Time Limit Exceeded",short:"TLE",color:"#f8d7da",type:"error"},2:{name:"Time Limit Exceeded",short:"TLE",color:"#f8d7da",type:"error"},3:{name:"Memory Limit Exceeded",short:"MLE",color:"#f8d7da",type:"error"},4:{name:"Runtime Error",short:"RE",color:"#f8d7da",type:"error"},5:{name:"System Error",short:"SE",color:"#f8d7da",type:"error"},6:{name:"Pending",color:"orange",type:"warning"},7:{name:"Judging",color:"blue",type:"info"},8:{name:"Partial Accepted",short:"PAC",color:"blue",type:"info"},9:{name:"Submitting",color:"yellow",type:"warning"}}
  
  const store = {
    headers: GM_getValue('oj-headers', []),
    pagesize: GM_getValue('oj-pagesize', 20),
    difficulty: GM_getValue('oj-difficulty', ""),
    problems: {},
    hideAC: GM_getValue('oj-hideAC', false),
  }
  unsafeWindow.fuckingstore = store;
  
  function createElement(tag, clazz, attrs) {
    const elem = document.createElement(tag);
    elem.className = clazz;
    if (attrs) {
      for (let key in attrs) {
        elem[key] = attrs[key];
      }
    }
    return elem;
  }
  
  function sel(selector) {
    return document.querySelector(selector);
  }
  
  function selall(selector) {
    return document.querySelector(selector);
  }
  
  let errorLog = null;
  
  function initErrorLog() {
    var cardBody = document.querySelectorAll('.ivu-card-body')[1];
    if (!cardBody) {
      setTimeout(() => {
        initErrorLog();
      }, 200);
    } else {
      errorLog = document.createElement('ul');
      errorLog.id = 'errorLog';
      errorLog.className = 'error-log';
      cardBody.appendChild(errorLog);
    }
  }
  
  function addErrorLog(result, status, info) {
    if ([6, 7, 9].indexOf(result) != -1) {
      return;
    }
    var e = document.createElement('li');
    let html = "";
    html += status.short + "<br/>"
    if (result == -2) { // compile error
      html += info.err_info;
    } else {
      html += `耗时: ${info.time_cost} 内存：${submissionMemoryFormat(info.memory_cost)}`
    }
    e.innerHTML = html;
    e.style.backgroundColor = status.color;
    
    errorLog.prepend(e);
  }

  function submissionMemoryFormat(t) {
    if (void 0 === t)
      return "--";
    var e = parseInt(t) / 1048576;
    return String(e.toFixed(0)) + "MB"
  }
  
  function initHeaderReplace() {
    if (!document.querySelector('.ivu-card-body')) {
      setTimeout(() => {
        initHeaderReplace();
      }, 200);
      return;
    }
    const cardBody = document.querySelectorAll('.ivu-card-body')[1];
    const ojh = createElement('div', 'ojh');
    const body = createElement('div', 'ojh-body', {style: "display:none"})
    cardBody.prepend(ojh);
    
    const showButton = createElement('a', 'ojh-button text-button', {textContent: "展示头文件", style: "margin-right:40px;"});
    showButton.onclick = e => {
      if (showButton.textContent == '展示头文件') {
        showButton.textContent = '隐藏头文件';
        body.style.display = 'block';
      } else {
        showButton.textContent = '展示头文件';
        body.style.display = 'none';
      }
    }
    ojh.appendChild(showButton);
    
    const uploadButton = createElement('a', 'ojh-button text-button', {textContent: "添加头文件+", style: "margin-right:40px;"});
    const save = createElement('div', 'ojh-save', {style: "display:none;"});
    save.append(createElement('span', '', {innerText: "引用名称："}))
    const saveInput = createElement('input', '', {style: "width:50%", placeholder: '代码中#include "../h/header.h"，就填../h/header.h'});
    save.append(saveInput);
    save.append(createElement('br'))
    save.append(createElement('span', '', {innerText: "文件内容："}))
    const saveArea = createElement('textarea', 'ojh-save-content');
    save.append(saveArea);
    const saveButton = createElement('button', 'ojh-save-button', {textContent: "保存"});
    uploadButton.onclick = e => {
      if (uploadButton.textContent == '添加头文件+') {
        uploadButton.textContent = '添加头文件-';
        save.style.display = 'block';
      } else {
        uploadButton.textContent = '添加头文件+';
        save.style.display = 'none';
      }
    }
    saveButton.onclick = e => {
      console.log(saveInput.value, saveArea.value)
      if (!saveInput.value) {
        $msg.error("引用名称没填");
        return;
      }
      if (!saveArea.value) {
        $msg.error("文件内容为空");
        return;
      }
      saveHeader(body, saveInput.value, saveArea.value);
      saveInput.value = saveArea.value = ""
    }
    
    const replaceButton = createElement('button', 'ojh-button', {textContent: "替换内容"});
    replaceButton.onclick = e => {
      $msg.info("开始替换代码中的头文件")
      let data = document.querySelector('.flex-container').__vue__.$data;
      let code = data.code;
      const regex = /#include "(.*?)"/g;
      while (true) {
        console.log("yici")
        let match;
        const headers = [];
        while ((match = regex.exec(code)) !== null) {
          headers.push(match[1]);
        }
        // 找是否存在header
        let find = false;
        for (let i = 0; i < headers.length; i++) {
          console.log("找是否匹配" + headers[i]);
          for (let storedHeader of store.headers) {
            if (headers[i] == storedHeader.name) {
              const escapedHeader = storedHeader.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(`#include "${escapedHeader}"`, 'g');
              let content = '// ' + storedHeader.name + "\n";
              content += storedHeader.content + "\n";
              code = code.replace(regex, content);
              find = true;
              break;
            }
          }
        }
        if (!find) {
          if (headers.length != 0) {
            $msg.info("未找到头文件：" + JSON.stringify(headers))
          }
          break;
        }
      }
      data.code = code;
      $msg.success("替换完成")
    }
    
    save.appendChild(saveButton);
    ojh.appendChild(uploadButton);
    ojh.appendChild(replaceButton);
    
    
    ojh.appendChild(save);

    ojh.append(body);
    showHeaders(body)
  }
  
  function showHeader(body, header) {
    const file = createElement('div', 'ojh-file', {id: "ojh-file-" + header.name});
    const name = createElement('span', 'ojh-file-name text-button', {innerText: header.name});
    const wrapper = createElement('div', 'ojh-file-wrapper', {style: "display: none;"})
    name.onclick = e => {
      if (wrapper.style.display == 'none') {
        wrapper.style.display = 'block';
      } else {
        wrapper.style.display = 'none';
      }
    }
    const deleteButton = createElement('a', 'ojh-file-delete text-button', {textContent: "删除"})
    deleteButton.onclick = e => {
      if (confirm("是否删除？")) {
        deleteHeader(header.name)
        document.getElementById('ojh-file-' + header.name)?.remove();
      }
    }
    file.append(name);
    file.append(deleteButton);
    
    const content = createElement('textarea', 'ojh-file-content', {value: header.content})
    const save = createElement('button', '', {textContent: "保存"});
    save.onclick = e => {
      saveHeader(body, header.name, content.value)
    }
    wrapper.append(content);
    wrapper.append(save);
    file.append(wrapper)
    
    body.append(file);
  }
  
  function showHeaders(body) {
    for (let header of store.headers) {
      showHeader(body, header);
    }
  }
  
  function saveHeader(body, name, content) {
    let headerElem = document.getElementById('ojh-file-' + name);
    if (!headerElem) {
      showHeader(body, {name, content})
    }
    for (let header of store.headers) { // 找是否有重复的
      if (header.name == name) {
        header.content = content;
        $msg.success("修改成功")
        GM_setValue('oj-headers', store.headers);
        return;
      }
    }
    store.headers.push({name, content});
    GM_setValue('oj-headers', store.headers);
    $msg.success("添加成功")
  }
  
  function deleteHeader(name) {
    console.log("删除头文件" + name);
    for (let i = 0; i < store.headers.length; i++) {
      if (store.headers[i].name == name) {
        store.headers.splice(i, 1);
        break;
      }
    }
    GM_setValue('oj-headers', store.headers);
    $msg.success("删除成功")
  }

  function initAnswerPanel() {
    if (!document.querySelector('.oj-menu')) {
      setTimeout(() => {
        initAnswerPanel();
      }, 200);
      return;
    }
    if (document.querySelector('.oj-panel')) {
      return;
    }
    const panel = createElement('div', 'oj-panel')
    const header = createElement('div', 'oj-header')
    const close = createElement('div', 'oj-close')
    close.innerText = '×'
    const body = createElement('div', 'oj-body')
    header.appendChild(close)
    panel.appendChild(header)
    panel.appendChild(body)
    document.body.appendChild(panel)
    let lastX = GM_getValue('box_last_x', 100)
    let lastY = GM_getValue('box_last_y', 100)
    panel.style.left = lastX + 'px'
    panel.style.top = lastY + 'px'
    panel.style.display = 'none'
    header.addEventListener('mousedown', makeDraggableFunction(panel, false, null, () => { 
        GM_setValue('box_last_x', parseInt(panel.style.left))
        GM_setValue('box_last_y', parseInt(panel.style.top))
    }), false)
    
    const showButton = createElement('span', 'oj-button ivu-menu-item')
    showButton.innerText = '看可见答案'
    document.querySelector('.oj-menu').appendChild(showButton)
    showButton.addEventListener('click', e => {
      showButton.style.display = 'none'
      panel.style.display = 'block'
      body.innerHTML = ''
      getAnswers()
    })
    close.addEventListener('click', e => {
      panel.style.display = 'none'
      showButton.style.display = 'block'
      stop = true;
    })
  }
  
   function makeDraggableFunction(elem, allowMoveOut, exec, callback) {
    let handleMouseDown = function (event) {
      let offsetX = parseInt(elem.style.left)
      let offsetY = parseInt(elem.style.top)
      let innerX  = event.clientX - offsetX
      let innerY  = event.clientY - offsetY
      if (!!exec) {
        exec()
      }
      document.onmousemove = function (event) {
        elem.style.left = event.clientX - innerX + 'px'
        elem.style.top = event.clientY - innerY + 'px'
        if (!allowMoveOut) {
          if (parseInt(elem.style.left) <= 0) {
            elem.style.left = '0px'
          }
          if (parseInt(elem.style.top) <= 0) {
            elem.style.top = '0px'
          }
          if (
            parseInt(elem.style.left) >=
            window.innerWidth - parseInt(elem.style.width)
          ) {
            elem.style.left =
              window.innerWidth - parseInt(elem.style.width) + 'px'
          }
          if (
            parseInt(elem.style.top) >=
            window.innerHeight - parseInt(elem.style.height)
          ) {
            elem.style.top = window.innerHeight - parseInt(elem.style.height) + 'px'
          }
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        if (!!callback) {
          callback()
        }
      }
    }
    return handleMouseDown
  }
  
  let stop = false;
  function getProblemId() {
    let url = location.href;
    if (url.indexOf('/problem') != -1) {
      url = url.substring(url.lastIndexOf('/') + 1);
      return parseInt(url);
    }
    return null;
  }
  function getAnswers() {
    let problemId = getProblemId();
    if (!problemId) {
      alert("未在答题界面！")
      return;
    }
    stop = false;
    let total = -1;
    getList(problemId, 1);
  }
  
  function getList(problemId, page) {
    const offset = (page - 1) * 100;
    fetch(`https://www.bjfuacm.com/api/submissions?myself=0&result=0&username=&page=${page}&problem_id=${problemId}&limit=100&offset=${offset}`, {
      "headers": {
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json;charset=utf-8",
      },
      "body": null,
      "method": "GET",
    }).then(res => res.json()).then(res => {
      // console.log(res)
      const {results, total} = res.data;
      let html = ''
      for (let result of results) {
        if (result.show_link) {
          const info = result.statistic_info;
          html += `<div class="oj-result">
                    <a href="https://www.bjfuacm.com/status/${result.id}" target="_blank">查看答案</a> 
                    <span>耗时${info.time_cost}MS 内存${submissionMemoryFormat(info.memory_cost)} 
                    作者<a href="https://www.bjfuacm.com/user-home?username=${result.username}" target="_blank">${result.username}</a></span></div>`
        }
      }
      document.querySelector('.oj-body').innerHTML += html;
      if (!stop && offset < total) {
        getList(problemId, page + 1);
      } else {
        document.querySelector('.oj-body').innerHTML += "<p style='text-align:center;'>—————— 已加载全部 ——————</p>";
      }
    }).catch(err => {
      console.error(err);
      alert("ERROR: " + err)
    });
  }
  
  /**
   * 为list添加每页展示数量的选项
   */
  function initPageOption(parent, onchange) {
    if (!sel('.content-app')) {
      setTimeout(initPageOption, 200);
      return;
    }
    setTimeout(() => {
      let vue = sel('.content-app').children[0].__vue__;
      console.log(vue)
      if (parent) {
        vue = vue.$parent;
      }
      vue.limit = store.pagesize;
      if (onchange) {
        onchange(vue, store.pagesize)
      }
      const filter = sel('.filter');
      const pageSelect = createElement('select', '', {style: "margin-right:10px;"})
      for (let pagesize of [10, 20, 30, 50, 100]) {
        const option = createElement('option', '', {label: `${pagesize}个/页`, textContent: `${pagesize}个/页`, value: pagesize});
        pageSelect.append(option);
        if (vue.limit == pagesize) {
          pageSelect.value = pagesize;
        }
      }
      pageSelect.onchange = e => {
        if (onchange) {
          onchange(vue, pageSelect.value);
        }
        store.pagesize = pageSelect.value;
        GM_setValue('oj-pagesize', store.pagesize);
      }
      filter.prepend(pageSelect);
      if (parent) { // if in problem list page
        const hideACLabel = createElement('label', '', {style: 'margin-right:10px', innerText: '隐藏已完成'});
        const hideACCheck = createElement('input', '', {type: 'checkbox', checked: store.hideAC});
        hideACCheck.onchange = e => {
          store.hideAC = hideACCheck.checked;
          GM_setValue('oj-hideAC', store.hideAC);
          onchange(vue, pageSelect.value);
        }
        hideACLabel.append(hideACCheck);
        filter.prepend(hideACLabel);
      }
    }, 200)
  }
  
  function hookRequest() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (url.indexOf('/api/submission?id=') != -1) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            const res = JSON.parse(this.responseText);
            const result = res.data.result;
            const status = status_map[result]
            console.log(res, status)
            if (!res.data.statistic_info) {
              return;
            }
            const info = res.data.statistic_info;
            addErrorLog(result, status, info);
            store.problems[res.data.problem] = {status: result};
          }
        })
      } else if (url.indexOf('/api/profile') != -1) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            const res = JSON.parse(this.responseText);
            store.problems = res.data.acm_problems_status.problems;
            console.log('SOLVED: ', store.problems)
          }
        })
      } else if (url.indexOf('/api/problem') != -1) {
        this.addEventListener('readystatechange', function() {
          if (this.readyState == 4) {
            const res = JSON.parse(this.responseText);
            const list = res.data.results;
            for (let i = 0; i < list.length; i++) {
              const problem = list[i];
              let status = store.problems[problem.id]
              if (status) {
                if (status.status == 0) {
                  if (store.hideAC) {
                    list.splice(i, 1);
                    i--;
                  } else {
                    problem.title = '✔️ ' + problem.title;
                  }
                } else {
                  problem.title = '❌ ' + problem.title;
                }
              }
            }
            Object.defineProperty(this, 'responseText', {writable: true})
            this.responseText = JSON.stringify(res);
          }
        })
      }
      originalOpen.apply(this, arguments);
    }
  }
  
  function urlContains(url, targets) {
    for (let target of targets) {
      if (url.indexOf(target) != -1) {
        return true;
      }
    }
    return false;
  }
  
  let lastPath = "DAMNSONWHEREDYOUFINDTHAT";
  setInterval(() => {
    if (location.pathname != lastPath) {
      lastPath = location.pathname;
      if (lastPath.indexOf('/problem/') != -1) {
        injectCSS();
        initErrorLog();
        initAnswerPanel();
        initHeaderReplace();
      } else if (['/problems', '/structure', '/started'].indexOf(lastPath) != -1) {
        initPageOption(true, (vue, pagesize) => {
          vue.limit = pagesize;
          vue.query.page = 1;
          if (!vue.query.difficulty || vue.query.difficulty == '') {
            vue.query.difficulty = store.difficulty;
          } else {
            store.difficulty = vue.query.difficulty;
            GM_setValue('oj-difficulty', store.difficulty);
          }
          vue.getProblemList();
        });
      } else if (lastPath == '/status') {
        initPageOption(false, (vue, pagesize) => {
          vue.limit = pagesize;
          vue.page = 1;
          vue.getSubmissions();
        });
      }
      console.log("path切换为" + lastPath)
    }
  }, 500);
  hookRequest();
})()