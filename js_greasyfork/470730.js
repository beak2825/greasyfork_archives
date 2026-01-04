// ==UserScript==
// @name         快速创建 Jira 子任务
// @license      MIT
// @version      0.0.8
// @description  一个帮助用户在 Jira 任务页面中快速创建子任务的油猴脚本 / A script to help user creating sub task in Jira task web page.
// @author       Nauxscript
// @match        *jira.gdbyway.com/*
// @run-at       document-end
// @namespace    Nauxscript
// @downloadURL https://update.greasyfork.org/scripts/470730/%E5%BF%AB%E9%80%9F%E5%88%9B%E5%BB%BA%20Jira%20%E5%AD%90%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/470730/%E5%BF%AB%E9%80%9F%E5%88%9B%E5%BB%BA%20Jira%20%E5%AD%90%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const hostName = 'http://jira.gdbyway.com'
  const createTaskDialogUrl = '/secure/QuickCreateIssue!default.jspa?decorator=none&parentIssueId='
  const editTaskDialogUrl = '/secure/QuickEditIssue!default.jspa?issueId='
  const baseRequestUrl = `${hostName}${createTaskDialogUrl}`
  const defaultTitlePrefix = '前端：'
  let createSubTaskRequestUrl = '/secure/QuickCreateIssue.jspa?decorator=none'
  let isWaiting = false
  let currTaskInfo = null

  if (!$) {
    throw new Error('have no jquery')
  }
  
  const quickAddSubTaskBtn = createQuickAddBtn();
  const quickEditBtn = createEditBtn();

  $(document).on('ajaxComplete', onRequest)

  window.addEventListener('keyup', async (e) => {
    // const ctrlKey = e.ctrlKey
    const altKey = e.altKey
    // alt + ; = … in mac
    if (altKey && ['…', ';', '；'].includes(e.key)) {
      basicProcess()
    }
    e.preventDefault();
    return false;
  })
  
  function basicProcess() {
    if (isWaiting) {
        return alert('请勿频繁操作')
      }
      const createTaskBtn = document.getElementById('create-subtask')
      const editTaskBtn = document.getElementById('edit-issue') 
      
      if (!createTaskBtn) {
        console.error('当前无法创建子任务');
      }

      if (!editTaskBtn) {
        console.error('无法编辑当前任务');
      }

      if (!createTaskBtn && !editTaskBtn) {
        console.error('无法创建或编辑任务'); 
        return 
      }

      currTaskInfo = getTaskInfo({
        baseRequestUrl,
        defaultTitlePrefix,
      })

      if (!currTaskInfo) {
        return
      }
      isWaiting = true
      if (currTaskInfo.mode === 'c') {
        // create
        if (!createTaskBtn) {
          alert('当前无法创建子任务')
          isWaiting = false
          return
        }

        createTaskBtn.click()
      } else if (currTaskInfo.mode === 'e') {
        // edit
        if (!editTaskBtn) {
          alert('无法编辑当前任务')
          isWaiting = false
          return
        }
        editTaskBtn.click()
      } else {
        isWaiting = false
      }
  }

  const componentRegExpStrGennerator = (title) => `(?<=title="${title}"value=").*(?=")`
  const sourceRegExpStrGennerator = (title) => `(?<=value=").*(?=">${title}<)`

  function matching(str, RegExpStr) {
    const regExpStr = new RegExp(RegExpStr, 'gm')
    const normalizeStr = str.replaceAll(' ', '')
    const id = normalizeStr.match(regExpStr)   
    return id
  }

  function onRequest(event, xhr, setting) {
    if (setting.url === `${createTaskDialogUrl}${currTaskInfo?.parentIssueId}` && isWaiting) {
      console.log('create task dialog open', xhr.responseJSON);
      xhr.responseJSON.fields.forEach(field => {
        if (field.label === '模块') {
          const id = matching(field.editHtml, componentRegExpStrGennerator(currTaskInfo.componentText)) || []
          currTaskInfo.componentId = id[0] || ''
        }
        if (field.label === '问题来源') {
          const id = matching(field.editHtml, sourceRegExpStrGennerator(currTaskInfo.sourceText)) || []
          currTaskInfo.sourceId = id[0] || ''
        }
      })
      createSubTask(currTaskInfo)
      isWaiting = false
      return
    }

    // edit current task info
    if (setting.url === `${editTaskDialogUrl}${currTaskInfo?.parentIssueId}&decorator=none` && isWaiting) {
      console.log('edit task dialog open');
      // wip
      editTask(currTaskInfo)
      isWaiting
      return
    }

    if (setting.url === createSubTaskRequestUrl && ['1', '2'].includes(currTaskInfo.switchStatus)) {
      const parentKey = xhr.responseJSON?.createdIssueDetails?.fields?.parent?.key
      const currSubTaskKey = xhr.responseJSON?.createdIssueDetails?.key
      if (parentKey === currTaskInfo.parentIssueKey) {

        if (currTaskInfo.switchStatus === '1') {
          autoDone(currSubTaskKey)
        }

        if (currTaskInfo.switchStatus === '2') {
          autoDoing(currSubTaskKey)
        }
      }
      return
    }
    if (setting.url.includes('AjaxIssueEditAction!default.jspa')) {
      insertOperateBtns()
      console.log('fuck');
    }
  }

  function insertOperateBtns() {
    const createTaskBtn = document.getElementById('create-subtask')
    const editTaskBtn = document.getElementById('edit-issue')   

    if (editTaskBtn) {
      editTaskBtn.parentNode.insertBefore(quickEditBtn, editTaskBtn.nextSibling)
    }

    if (createTaskBtn) { 
      const c = document.getElementById('opsbar-opsbar-transitions')
      if (!c) return 
      c.append(quickAddSubTaskBtn)
    }
  }

  function createEditBtn() {
    const _quickEditBtn = document.createElement('div');
    _quickEditBtn.id = 'quick-edit-btn';
    _quickEditBtn.classList.add('aui-button');
    _quickEditBtn;
    const icon = document.createElement('span');
    icon.className = 'icon aui-icon aui-icon-small aui-iconfont-edit';
    const text = document.createElement('span');
    text.innerText = '快速编辑';
    const todayStr = getCurrDate()

    _quickEditBtn.append(icon);
    _quickEditBtn.append(text);
    _quickEditBtn.addEventListener('click', () => {
      const editTaskBtn = document.getElementById('edit-issue')  
      currTaskInfo = getTaskInfo({
        baseRequestUrl,
        defaultTitlePrefix,
      }, `@[${todayStr};${todayStr}]@c@0@`);
      if (!currTaskInfo) {
        return;
      }
      isWaiting = true;
      editTaskBtn.click();
    });
    return _quickEditBtn;
  }

  function createQuickAddBtn() {
    const _quickAddSubTaskBtn = document.createElement('div');
    _quickAddSubTaskBtn.id = 'quick-add-sub-task-btn';
    _quickAddSubTaskBtn.classList.add('aui-button');
    const todayStr = getCurrDate()
    const text = document.createElement('span');
    text.innerText = '快速添加子任务';
    _quickAddSubTaskBtn.append(text);
    _quickAddSubTaskBtn.addEventListener('click', () => {
      const createTaskBtn = document.getElementById('create-subtask')
      currTaskInfo = getTaskInfo({
        baseRequestUrl,
        defaultTitlePrefix,
      }, `@[${todayStr};${todayStr}]@c@0@`);
      if (!currTaskInfo) {
        return;
      }
      isWaiting = true;
      createTaskBtn.click();
    });
    return _quickAddSubTaskBtn;
  }

  const promiseHelper = () => {
    let _resolve, _reject
    const p = new Promise((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })
    return {
      p,
      _resolve,
      _reject
    }
  }

  function getTaskInfo(config, defaultStr = '') {
    
    const parentLinkEle = document.getElementById('key-val')
    const parentSummaryEle = document.getElementById('summary-val')
    const parentIssueId = parentLinkEle.getAttribute('rel')
    const parentIssueKey = parentLinkEle.getAttribute('data-issue-key')
    const parentTaskTitle = config.defaultTitlePrefix + parentSummaryEle.innerText

    // get the a tag inner text in a span with id=components-field
    const componentText = document.getElementById('components-field')?.querySelector('a')?.innerText || '无'
    const sourceText = document.getElementById('customfield_10502-val')?.innerText || '无（不需填问题来源时选择）'
    const componentId = ''
    const sourceId = ''

    const todayStr = getCurrDate()
    const inputStr = window.prompt(`
      输入规则:
      ------------
      @[<正整数>，0/1/-1对应为今天/明天/昨天，如此类推 | <开始时间>;<结束时间>]@<c 创建子任务 | e 编辑当前任务>@<创建子任务后切换状态:0 不切换状态 | 1 切换到已完成 | 2 切换到处理中>@<预估时间>
      ------------
      默认使用当天的日期，创建子任务，不自动关闭；
      不做修改请直接在最后输入预估时间
    `,defaultStr || `@[${todayStr};${todayStr}]@c@0@`)
    
    if (!inputStr) {
      isWaiting = false
      console.error('退出创建!');
      return
    }

    const inputInfo = normalizeInput(inputStr)

    const taskInfo = {
      parentTaskTitle,
      targetTime: inputStr,
      parentIssueId,
      parentIssueKey,
      componentText,
      componentId,
      sourceText,
      sourceId,
      ...inputInfo
    }

    return taskInfo
  }

  function normalizeInput(input) {
    let parseItems = input.split('@')

    // remove first item cause' it is a invalid param
    parseItems.shift()

    parseItems = parseItems.map(item => !item ? '' : item)
    const [timeStr, mode, switchStatus, estimateTime] = parseItems
    const [startTimeStr, endTimeStr] = normalizeTime(timeStr)

    if (!['c', 'e'].includes(mode)) {
      throw new Error('Invalid mode');
    }

    if (!['0', '1', '2'].includes(switchStatus)) {
      throw new Error('Invalid switchStatus');
    } 

    return {
      mode,
      switchStatus,
      estimateTime,
      startTime: startTimeStr.replace(/\s+/g, ''),
      endTime: endTimeStr.replace(/\s+/g, ''),
    };
  }

  function normalizeTime(timeStr) {
    if (timeStr[0] === '[' && timeStr[timeStr.length - 1] === ']') {
      const res = timeStr.match(/(?<=\[).*(?=\])/gm)
      return res[0].split(';')
    }
    const dayNum = Number(timeStr)
    if (isNaN(dayNum)) {
      const msg = '任务时间格式有误！'
      alert(msg) 
      throw new Error(msg)
    }
    const dateStr = getFullDate(dayNum)
    return [dateStr, dateStr] 
  }

  function getCurrDate() {
    return getFullDate()
  }

  function getFullDate(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    const formattedDate = year + '-' + month + '-' + day;
    return formattedDate
  }

  function createSubTask(baseInfo) {
    // init mutationObserver to spy on dialog close 
    observerDialog('create-subtask-dialog')

    console.log(baseInfo);

    const summaryInput = document.getElementById('summary')
    const targetStartInput = document.getElementById('customfield_10113')
    const targetEndInput = document.getElementById('customfield_10114')
    const assignToMeBtn = document.getElementById('assign-to-me-trigger')
    const originalestimate = document.getElementById('timetracking_originalestimate')
    const remainingestimate = document.getElementById('timetracking_remainingestimate')
    const sourceSelect = document.getElementById('customfield_10502')

    summaryInput.value = baseInfo.parentTaskTitle
    originalestimate.value = baseInfo.estimateTime
    remainingestimate.value = baseInfo.estimateTime
    targetStartInput.value = baseInfo.startTime
    targetEndInput.value = baseInfo.endTime
    sourceSelect.value = baseInfo.sourceId
    assignToMeBtn.click()

    document.getElementById('components-multi-select').querySelector('.drop-menu').click()
    const componentDropdownEle = document.getElementsByClassName('ajs-layer active')[0]

    if (componentDropdownEle) {
      componentDropdownEle.querySelector('.no-suggestions')?.querySelector('button')?.click()
      const listContainer = componentDropdownEle.querySelector('.aui-last')
      const componentItem = listContainer?.querySelector(`.aui-list-item-li-${currTaskInfo.componentText}`)
      if (componentItem) {
        listContainer.querySelectorAll('.aui-list-item.active').forEach(item => item.classList.remove('active')) 
        componentItem.classList.add('active')
      }
      componentItem?.click() 
    }

    setTimeout(() => {
      summaryInput.focus()
    }, 200)
  }

  function editTask(baseInfo) {
    // init mutationObserver to spy on dialog close 
    observerDialog('edit-issue-dialog')

    const summaryInput = document.getElementById('summary')
    const targetStartInput = document.getElementById('customfield_10113')
    const targetEndInput = document.getElementById('customfield_10114')
    const originalestimate = document.getElementById('timetracking_originalestimate')
    const remainingestimate = document.getElementById('timetracking_remainingestimate')

    originalestimate.value = baseInfo.estimateTime
    remainingestimate.value = baseInfo.estimateTime
    targetStartInput.value = baseInfo.startTime
    targetEndInput.value = baseInfo.endTime
    summaryInput.focus()
  }

  function observerDialog(id) {
    const dialogContainer = document.getElementById(id)
    if (!dialogContainer) return
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.removedNodes) {
          for (let i = 0; i < mutation.removedNodes.length; i++) {
            if (mutation.removedNodes[i] === dialogContainer) {
              console.log('Node removed!');
              observer.disconnect();  // 如果节点被移除，停止观察
              isWaiting = false
            }
          }
        }
      });    
    });

    // 配置观察选项:
    const config = { attributes: true, childList: true, subtree: true };

    // 传入目标节点和观察选项
    observer.observe(document.body, config);
  }

  async function autoTransition(issueKey, condition, title, extendData = {}) {
    if (!issueKey) return
    const transitionId = await getTaskTransitionId(issueKey, condition)
    if (!transitionId) {
      console.error(`子任务【${issueKey}】无法${title}`);
      return
    }
    await sendRequest(`issue/${issueKey}/transitions`, 'POST', {
      transition: {
        id: transitionId 
      },
      ...extendData
    })
    location.reload(true)
  }

  async function getTaskTransitionId(issueKey, condition) {
    const url = `issue/${issueKey}/transitions?expand=transitions.fields`
    const res = await sendRequest(url)
    if (res && res.transitions && res.transitions.length) {
      const transition = res.transitions.find(condition)
      return transition.id
    }
  }

  function autoDoing(issueKey) {
    autoTransition(issueKey, (transition) => transition.name === '处理任务', '自动进行')
  }

  function autoDone(issueKey) {
    autoTransition(issueKey, (transition) => transition.name === '关闭任务', '自动关闭', {
      fields: {
        resolution: {
          name: 'Done'
        }
      }
    })
  }

  function sendRequest(api, method = 'GET', param) {
    const { p, _resolve, _reject } = promiseHelper()
    var xhr = new XMLHttpRequest(),
      url = `${hostName}/rest/api/2/${api}`;
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            let json
            if (xhr.responseText) {
              json = JSON.parse(xhr.responseText);
              console.log(json);
            }
            _resolve(json || xhr.responseText)
          } else {
            console.error('Error: ' + xhr.status);
            console.error('Response: ' + xhr.responseText);
            _reject(xhr.responseText)
          }
        }
      }
    };
    xhr.onerror = function (err) {
      _reject(err)
    };
    xhr.send(param ? JSON.stringify(param) : undefined)
    return p
  }
})()