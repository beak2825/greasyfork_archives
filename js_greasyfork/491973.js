// ==UserScript==
// @name         pingcode helper
// @namespace    http://tampermonkey.net/
// @version      2024-04-09
// @description  快捷导入pingcode任务
// @author       飞天小猪
// @match        http://pc.tongqisumu.com:30001/pjm/projects/*
// @icon https://gongjux.com/files/3/4453uhm5937m/32/favicon.ico
// @grant        none
// @require https://greasyfork.org/scripts/453166-jquery/code/jquery.js?version=1105525
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491973/pingcode%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/491973/pingcode%20helper.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let projectInfo
  const headers = {
    cookie: document.cookie,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  }

  const setButton = () => {
    // 创建一个新的button元素
    var button = document.createElement('button');
    button.textContent = '虤'; // 设置按钮文字

    // 设置按钮的基本样式（包括固定定位与默认透明度）
    button.style.cssText = `
position: fixed; /* 或者 absolute，取决于您的布局需求 */
top: 30px;
left: 10px;
z-index: 99999;
background-color: #007bff;
color: white;
padding: 6px 12px;
border: none;
border-radius: 5px;
cursor: pointer;
opacity: 0.3;
transition: opacity 0.3s ease;
`;
    // 添加鼠标悬浮时的透明度变化
    button.addEventListener('mouseover', function () {
      this.style.opacity = 1;
    });

    // 添加鼠标离开时的透明度变化
    button.addEventListener('mouseout', function () {
      this.style.opacity = 0.3;
    });
    button.addEventListener('click', showPanel)
    // 将按钮添加到文档中
    document.body.appendChild(button);
  }
  const showPanel = async () => {
    const info = extractProjectIdAndSprintId(location.href)
    if (info.sprintId && info.projectName) {
      const { data } = await axios.get(`http://pc.tongqisumu.com:30001/api/agile/projects/${info.projectName}?addons=true&members=true&t=${new Date().getTime()}`, {
        headers
      })
      if (data.code === 200) {
        projectInfo = data.data
        await getPanelInfo()
      } else {
        alert("数据解析失败")
      }
    } else {
      alert("数据解析失败")
    }
  }
  const extractProjectIdAndSprintId = (url) => {
    const pathParts = url.split('/');
    const projectIndex = pathParts.indexOf('projects');
    const sprintIndex = pathParts.indexOf('sprint');

    if (projectIndex >= 0 && projectIndex + 1 < pathParts.length &&
      sprintIndex >= 0 && sprintIndex + 1 < pathParts.length) {
      const projectName = pathParts[projectIndex + 1];
      const sprintId = pathParts[sprintIndex + 1];
      return {
        projectName: projectName,
        sprintId: sprintId
      };
    }
    return null;
  }
  const getPanelInfo = async () => {
    const info = extractProjectIdAndSprintId(location.href)
    const params = {
      "sprint_id": info.sprintId,
      "criteria": {
        "search": {
          "keywords": "",
          "scopes": [
            "identifier",
            "title"
          ]
        },
        "conditions": [],
        "mode": 1,
        "show_type": 1,
        "group_by": "",
        "sort_by": "identifier",
        "sort_type": 1
      },
      "pi": 0,
      "ps": 100
    }
    const { data } = await axios.post(`http://pc.tongqisumu.com:30001/api/agile/projects/${projectInfo.value._id}/scrum/sprint/views/work-item/content`, params, { headers });
    if (data.code === 200) {
      const storys = data.data.value.filter(i => i.type === 3)
      genDom(storys)
    } else {
      alert(`项目故事获取失败，msg：${data.message}`)
    }
  }
  const genDom = (storys) => {
    const mask = document.createElement('div');
    mask.addEventListener('click', (event) => {
      // 判断点击的是mask本身还是其子元素
      if (event.target === mask) {
        document.body.removeChild(mask);
      } else {
        event.stopPropagation(); // 阻止子元素点击事件向上冒泡到mask
      }
    });
    mask.classList.add('mask');
    mask.style.cssText = `
background-color: rgba(0, 0, 0, 0.2);
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 1000;
display: flex;
justify-content: center;
align-items: center;
box-sizing: border-box;
`
    document.body.appendChild(mask);
    const tableWrap = document.createElement('div')
    tableWrap.classList.add('table-wrap');
    tableWrap.style.cssText = `
max-width: 1000px;
max-height: 900px;
min-height: 700px;
min-width: 720px;
width: 50vw;
height: 70vh;
background-color: #fff;
overflow-y: auto;
padding: 10px;
`
    // 创建关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '关闭'
    closeBtn.style.cssText = `
    background-color: #F56C6C;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    `
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(mask);
    })
    const select = document.createElement('select')
    select.style.cssText = `
    width: 200px;
    padding: 4px 8px;
    border-radius: 4px;
    border-color: #2165f9;
    margin-right: 10px;
    `
    for (let i = 0; i < storys.length; i++) {
      const option = document.createElement('option')
      option.value = storys[i]._id
      option.innerText = storys[i].title
      select.appendChild(option)
    }
    const prevFixInput = document.createElement('input')
    prevFixInput.placeholder = '统一标题前缀'
    prevFixInput.style.cssText = `
    margin-right: 10px;
padding: 3px;
border-radius: 4px;
border: 1px solid #2165f9;`
    const endFixInput = document.createElement('input')
    endFixInput.placeholder = '统一标题后缀'
    endFixInput.style.cssText = `
    margin-right: 10px;
padding: 3px;
border-radius: 4px;
border: 1px solid #2165f9;`
    // 创建批量插入按钮
    const requestBtn = document.createElement('button')
    requestBtn.textContent = '批量插入'
    requestBtn.style.cssText = `
    background-color: #2165f9;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    `
    requestBtn.addEventListener('click', () => {
      if (!textArea.value) return alert('请至少输入一条任务子模块名称')
      const rows = textArea.value.split('\n')
      const storyId = select.value
      const queue = rows.map(i => {
        const [title, start, end] = i.split('\t')
        const fixTitle = prevFixInput.value + title + endFixInput.value
        return { title: fixTitle, start: new Date(start + ' 00:00:00').getTime() / 1000, end: new Date(end + ' 00:00:00').getTime() / 1000 }
      })
      requestQueue(queue, storyId)
    })
    // 创建操作区域
    const btnArea = document.createElement('div')
    btnArea.style.cssText = `
height: 40px;
margin-bottom: 8px;
box-sizing: border-box;
padding: 4px 0;
`
    const textAreaWrap = document.createElement('div')
    textAreaWrap.style.cssText = `
height: 240px;
width: 100%;
overflow-y: auto;
padding: 10px;
box-sizing: border-box;
`
    const textArea = document.createElement('textarea')
    textArea.placeholder = '请输入要插入的任务子模块名称 格式为 标题\\t 起始时间:YYYY-MM-DD \\t 结束时间:YYYY-MM-DD'
    textArea.style.cssText = `
width: 100%;
height: calc(100% - 6px);
border: 1px solid #2165f9;
box-sizing: border-box;
padding: 10px;
border-radius: 4px;
`
    const tip = document.createElement('div')
    tip.id = 'process-tip'
    tip.innerText = '当前任务 0/0'
    tip.style.cssText = `
    padding-left:10px;
    `
    const textAreaWrap2 = document.createElement('div')
    textAreaWrap2.style.cssText = `
height: 240px;
width: 100%;
overflow-y: auto;
padding: 10px;
box-sizing: border-box;
`
    const textArea2 = document.createElement('textarea')
    textArea2.id = 'textArea2_0131'
    textArea2.disabled = true
    textArea2.placeholder = ''
    textArea2.style.cssText = `
width: 100%;
height: calc(100% - 6px);
border: 1px solid #2165f9;
box-sizing: border-box;
padding: 10px;
border-radius: 4px;
background-color: #282c34;
color: #61aeee;
`
    btnArea.appendChild(closeBtn)
    btnArea.appendChild(select)
    btnArea.appendChild(prevFixInput)
    btnArea.appendChild(endFixInput)
    btnArea.appendChild(requestBtn)
    tableWrap.appendChild(btnArea)
    textAreaWrap.appendChild(textArea)
    textAreaWrap2.appendChild(textArea2)
    tableWrap.appendChild(textAreaWrap)
    tableWrap.appendChild(tip)
    tableWrap.appendChild(textAreaWrap2)
    mask.appendChild(tableWrap)
  }
  const request = async (url, data) => {
    return axios.post(url, data, {
      headers
    })
  }
  const requestQueue = async (queue, storyId) => {
    const url = 'http://pc.tongqisumu.com:30001/api/agile/v2/work-item'
    for (let i = 0; i < queue.length; i++) {
      const processTip = document.getElementById('process-tip')
      processTip.innerText = `当前任务 ${i + 1}/${queue.length}`
      const data = {
        "start": {
          "date": queue[i].start, // 开始时间 / 1000
          "with_time": 0
        },
        "due": {
          "date": queue[i].end, // 结束时间 / 1000
          "with_time": 0
        },
        "participants": [],
        "project_id": projectInfo.value._id, // 项目id
        "type": 4, // 任务对应的type类型
        "parent_id": storyId, // 故事id
        "properties": {},
        "raw_values": {
          "title": queue[i].title,
          "project_id": projectInfo.value._id,
          "type": 4,
          "parent_id": storyId,
          "start": {
            "date": queue[i].start,
            "with_time": 0
          },
          "due": {
            "date": queue[i].end,
            "with_time": 0
          },
          "participants": []
        },
        "title": queue[i].title // 标题
      }
      const res = await request(url, data)
      const textArea2 = document.getElementById('textArea2_0131')
      if (res.data.code === 200) {
        textArea2.value += `SUCCESS: ${queue[i].title} 添加成功\n`
        textArea2.scrollTop = textArea2.scrollHeight
      } else {
        textArea2.value += `ERROR: ${queue[i].title} 添加失败 ---> ${res.data.message}\n`
        textArea2.scrollTop = textArea2.scrollHeight
      }
    }
  }
  const sleep = (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, time * 1000)
    })
  }
  async function init() {
    $('head').append('<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>') // 名称：layer，版本：3.5.1，原始地址：https://www.layuicdn.com/#Layer
    // 等待layer加载成功
    while (true) {
      if (typeof axios != 'undefined') {
        break
      }
      await sleep(0.5)
    }
    setButton()
  }
  init()
})();