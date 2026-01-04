// ==UserScript==
// @name         禅道日志工具
// @namespace
// @version      1.2.1
// @description  禅道的一些便捷工具
// @author       chenwuai
// @license      MIT
// @match        http://192.168.0.16:88/zentao/*
// @grant        none
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/446860/%E7%A6%85%E9%81%93%E6%97%A5%E5%BF%97%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/446860/%E7%A6%85%E9%81%93%E6%97%A5%E5%BF%97%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if(typeof $ === 'undefined') return

    // 样式
    const style = `
        #dropMenu {
            width: 600px;
        }
        #dropMenu #tabContent {
            max-width: 100%;
        }
        #currentItem .text{
            max-width: 100% !important;
        }
    `;
    document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);


    const pathName = document.location.pathname;
    let projectName = '';
    let loginUserId = ''

    // 初始化函数，根据页面路径调用不同的初始化方法
    function init() {
        if (/zentao\/execution-task\S+/.test(pathName)) {
            executionTaskInit();
        } else if (/my-work-task\S+/.test(pathName)) {
            myWorkTaskInit();
        } else if (/task-create\S+/.test(pathName)) {
            taskCreateInit();
        } else if (/story-create\S+/.test(pathName)) {
            storyCreateInit();
        }
    }

    // 任务页面初始化
    function executionTaskInit() {
        const projectBtn = document.querySelector('#heading #currentItem');
        projectName = projectBtn?.title || ''; // 使用可选链操作符

        const moreBtn = document.querySelector('#more');
        if (moreBtn) {
            addCustomButton(moreBtn, 'copyTaskLog', '复制日志', formatterExecutionTaskLog);
        }
    }

    // 我的任务总览页面初始化
    function myWorkTaskInit() {
        const moreBtn = document.querySelector('#mainMenu');
        if (moreBtn) {
            addCustomButton(moreBtn, 'copyTaskLog', '复制日志', formatterMyWorkTaskLog);
        }
    }

    // 新增任务页面初始化
    function taskCreateInit(){
        $('#dataform tr.mailtoBox').hide()
        $('#dataform tr.datePlanBox').hide()

        $('select#type').val('devel').trigger("chosen:updated")
        $('select#assignedTo').val(loginUserId).trigger("chosen:updated")
    }

    // 新增需求页面初始化
    function storyCreateInit(){
        $('#dataform tr.sourceBox').hide()
        $('#dataform tr.verifyBox').hide()
        $('#dataform tr.mailtoBox').hide()
        $('#dataform tr.keywordsBox').hide()
        // $('#dataform #planIdBox').parent().hide()
        $('#dataform #moduleIdBox').parent().css({'display':'block','min-width':'500px'})
        $('#dataform #moduleIdBox').parent().prev().css({'display':'block','min-width':'500px'})
        $('#dataform #parent_chosen').parent().parent().hide()

        $('select#assignedTo').val(loginUserId).trigger("chosen:updated")
    }

    // 任务页面-格式化日志
    function formatterExecutionTaskLog(event){

        let checkedIDs = getCheckedTaskLogIds()
        if(checkedIDs.length === 0){
            alert('请选中日志')
            return
        }

        const logs = getCheckedTaskLog() // 获取选中任务对象
        if(!logs) return;

        const textList = [projectName]
        logs.forEach((i,index)=>{
            const text = getTaskLogText(i)
            textList.push(`${text}`)
        });
        copyTextToClipboard(textList.join('\r\n'), event.target);
    }

    // 获取选中的任务日志
    function getCheckedTaskLog() {
        try {
            const logCells = $('#taskList .dtable-body .dtable-cell.is-checked');
            if (!logCells || logCells.length === 0) return null;
            const logs = {};
            const needKeys = ['id', 'name', 'status', 'progress'];

            logCells.each(function(){
                let row = $(this).data('row');
                if (!logs[row]) {
                    logs[row] = { id: row };
                }
                if (needKeys.includes($(this).data('col'))) {
                    logs[row][$(this).data('col')] = $(this).text();
                }
            })


            return Object.values(logs).sort((a, b) => (a.progress || 0) - (b.progress || 0) || a.id - b.id);
        } catch (error) {
            console.error("Error in getCheckedTaskLog:", error);
            return null;
        }
    }

    // 获取任务日志选中的id数组
    function getCheckedTaskLogIds(){
        var taskForm = $('#executionTaskForm')[0]
        if (taskForm && taskForm.elements && taskForm.elements['taskIDList[]']){
            var checkedIdList = []
            if(typeof taskForm.elements['taskIDList[]'].length !== 'undefined'){
                $(taskForm.elements['taskIDList[]']).each(function(){
                    checkedIdList.push(+$(this).val())
                })
            }else{
                checkedIdList.push(+$(taskForm.elements['taskIDList[]']).val())
            }
            return checkedIdList
        }else{
            return []
        }
    }

    // 获取任务日志文本
    function getTaskLogText(data) {
        if (!data) {
            console.error('Invalid task log data');
            return '';
        }

        let id = data.id?.trim() || '';
        let name = data.name?.trim() || '';
        let status = data.status?.trim() || '';
        const progress = data.progress;

        return `【${id}】${name} - ${status === '进行中' ? `${status} ${progress}%` : status}`;
    }

    // 我的任务页面-格式化日志
    function formatterMyWorkTaskLog(event){

        const logs = getCheckedMyWorkTaskLog()
        if(!logs){
            alert('请选中日志')
            return
        }

        const textList = []
        Object.keys(logs).forEach(key=>{
            const list = logs[key].sort((a, b) => (a.progress || 0) - (b.progress || 0) || a.id - b.id)
            const strList = list.reduce((a,c)=>{
                const str = `【${c.id}】${c.name} - ${c.statusName} ${c.progress > 0 ? c.progress + '%' : ''}`
                a.push(str)
                return a
            },[key])
            textList.push(strList.join('\r\n'))
        })

        copyTextToClipboard(textList.join('\r\n'), event.target);
    }
    // 获取选中的任务日志
    function getCheckedMyWorkTaskLog() {
        try {
            const logCells = $('#myTaskList tr.checked');
            if (!logCells || logCells.length === 0) return null;
            const logs = {};

            logCells.each(function(){
                const log = getMyWorkTaskLogInfo(this)
                if(log){
                    const projectName = log.project.replace(/[\r\n]/g, '').replace(/\s+/g, ' ').trim()
                    if(typeof logs[projectName] === 'undefined'){
                        logs[projectName] = []
                    }
                    logs[projectName].push(log)
                }
            })
            return logs
        } catch (error) {
            console.error("Error in getCheckedTaskLog:", error);
            return null;
        }
    }
    // 获取我的任务日志信息
    function getMyWorkTaskLogInfo(dom) {
        if (!dom) {
            console.error('Invalid task log data');
            return '';
        }
        const id = getChildDomText(dom,'.c-id');
        const name = getChildDomText(dom,'.c-name');
        const statusName = getChildDomText(dom,'.c-status');
        const project = getChildDomText(dom,'.c-project');
        const dataset = dom.dataset

        const status = dataset.status
        let progress = 0
        if(status === 'doing'){
            const consumed = +dataset.consumed
            const total = +dataset.consumed + +dataset.left
            progress = (Math.floor(consumed / total * 100))
        }
        return { project, id, name, status, statusName, progress}
    }


    // tools
    // 复制文本到剪贴板，并提供用户反馈
    async function copyTextToClipboard(text, target) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) { // 检查 navigator.clipboard 和 writeText 是否存在
                await navigator.clipboard.writeText(text);
                $(target).data('originalText', target.innerHTML);
                target.innerHTML = '✌已复制✌';
                setTimeout(() => target.innerHTML = $(target).data('originalText') || '复制', 1500);
                return; // 成功复制后直接返回
            }
        } catch (err) {
            console.warn('使用 navigator.clipboard 复制失败，尝试使用 document.execCommand：', err);
            // 不做任何处理，继续执行下面的兼容方案
        }

        // 兼容方案：使用 document.execCommand('copy')
        const el = $('<textarea>');
        el.val(text);
        el.attr('readonly', '');
        el.css({
            position: 'absolute',
            left: '-9999px'
        });
        $('body').append(el);

        // 保存当前选区
        const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;

        el.select();
        try {
            const successful = document.execCommand('copy');
            if(successful){
                $(target).data('originalText', target.innerHTML);
                target.innerHTML = '✌已复制✌';
                setTimeout(() => target.innerHTML = $(target).data('originalText') || '复制', 1500);
            } else {
                console.error('使用 document.execCommand 复制失败');
                alert('复制失败，请手动复制');
            }
        } catch (err) {
            console.error('使用 document.execCommand 复制时发生错误：', err);
            alert('复制失败，请手动复制');
        }

        el.remove(); // 移除textarea

        // 恢复选区
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
    }
    
    // 添加 button 子元素
    function addCustomButton(parent,id,text,cb){
        if(!parent || !id || !text || !cb){
            console.error('addCustomButton Error',parent,id,text,cb)
            return
        }

        const btn = $('<button>', { // 使用 jQuery 创建元素更简洁
            id: id,
            class: 'btn btn-link',
            style: 'color: #0DBB7D;',
            text: text,
            click: cb,
        });

        $(parent).append(btn);
    }

    function getChildDomText(dom,child){
      const childDom = $(dom).find(child)
      return childDom?.text().trim() || ''
    }

    function getLoginUser(){
        loginUserId = localStorage.getItem('zentao_user')
        if(loginUserId) return
        fetch(`/zentao/my-profile.html?onlybody=yes`, {
            credentials: 'include'
          })
            .then(res => res.text())
            .then(html => {
              const match = html.match(/<th>\s*用户名\s*<\/th>\s*<td>(.*?)<\/td>/);
              if (match && match[1]) {
                loginUserId = match[1].trim();
                localStorage.setItem('zentao_user', loginUserId)
              } else {
                console.warn('⚠️ 未匹配到用户名字段');
              }
            })
            .catch(err => {
              console.error('获取用户信息失败:', err);
            });
    }

    $(document).ready(()=>{
        getLoginUser()
        console.log('当前用户账号:', loginUserId);
        init()
    });
})();