// ==UserScript==
// @name         南理工教务处课程采集助手 V2
// @version      2.1
// @description  从南理工教务处（基于湖南强智科技开发，其他学校或许也可使用）的课程总库里爬取课程信息。支持自动翻页，导出 CSV，带暂停/停止，展示格式化数据表格，拼接完整大纲 URL
// @author       Light + ChatGPT
// @match        http://202.119.81.112:8080//Logon.do*
// @license      MIT
// @supportURL   https://github.com/NJUST-OpenLib/NJUST-JWC-Enhance
// @namespace https://greasyfork.org/users/1491624
// @downloadURL https://update.greasyfork.org/scripts/541628/%E5%8D%97%E7%90%86%E5%B7%A5%E6%95%99%E5%8A%A1%E5%A4%84%E8%AF%BE%E7%A8%8B%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/541628/%E5%8D%97%E7%90%86%E5%B7%A5%E6%95%99%E5%8A%A1%E5%A4%84%E8%AF%BE%E7%A8%8B%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B%20V2.meta.js
// ==/UserScript==

(function() {
  'use strict';

  Element.prototype.removeNode = function(deep) {
      if (deep && this.parentNode) {
          this.parentNode.removeChild(this);
      } else if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
      return this;
  };

  let allCourses = [];
  let isAutoRunning = false;
  let isPaused = false;
  let currentPage = 1;
  let isSortDesc = false;

  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed; top: 60px; right: 20px; width: 360px; max-height: 600px;
    overflow-y: auto; background: rgba(255,255,255,0.97);
    border: 1px solid #aaa; padding: 12px; font-size: 14px;
    box-shadow: 0 0 12px rgba(0,0,0,0.2); border-radius: 8px; z-index:99999;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  `;

  panel.innerHTML = `
<div style="display:flex; justify-content:space-between; align-items:center; margin:0 0 12px 0;">
    <h3 style="font-weight:bold; font-size:18px; margin:0;">课程采集助手V2</h3>
    <button id="btnClose" style="background:none; border:none; font-size:16px; cursor:pointer; padding:0;">×</button>
  </div>
   <div style="color:#666; font-size:14px; line-height:1.5; word-wrap:break-word; word-break:break-all;">
  <p style="margin:0 0 6px 0;">
    URL: <a href="${window.location.href}" target="_blank" style="color:#0066cc; text-decoration:underline;">${window.location.href}</a> 触发了捕获规则
  </p>
  <p style="margin:0; font-size:13px;">
    确保当前浏览器地址栏URL与其一致，如不一致，可能是iframe嵌入导致，请<a href="${window.location.href}" target="_blank" style="color:#0066cc; text-decoration:underline;">前往该页面</a>进行处理！
  </p>
     <p style="margin:0; font-size:13px;">
   请通过点击页面左上角齿轮图片（看不见请刷新），将“已显示字段”按次序设置为：<br>
   课程名称、学分、是否在用、课程编号、教学大纲是否录入、开课单位<br>
   设置完成后滚动小齿轮的窗口到底部，点击确定。<br>顺序必须一致！！
   <br>采集完成后，点击 导出CSV 以导出格式化数据，点击”打开转换页面“以转换为json。<br>注意：刷新页面会丢失已采集的数据<br>
  </p>
</div>
  <div style="margin-bottom: 10px; display:flex; gap:6px; flex-wrap: wrap;">
    <button id="btnStart" style="flex:1 1 30%;">开始采集</button>
    <button id="btnPause" style="flex:1 1 30%;" disabled>暂停采集</button>
    <button id="btnExtractPage" style="flex:1 1 100%; margin-top:6px;">提取本页课程</button>
    <button id="btnExportCSV" style="flex:1 1 48%;">导出CSV</button>
    <button id="btnOpenExternal" style="flex:1 1 48%;">打开转换页面</button>
  </div>
    </div>
    <div id="resultCount" style="margin-bottom:6px; font-weight:bold;">已采集课程数量：0</div>
    <div id="logBox" style="height:80px; overflow-y:auto; margin-bottom:8px; border:1px solid #ddd; padding:5px; font-size:12px; background:#f9f9f9; border-radius:4px;"></div>
    <div style="margin-bottom:8px; display:flex; gap:6px;">
      <button id="btnSortAsc" style="flex:1;">正序查看</button>
      <button id="btnSortDesc" style="flex:1;">倒序查看</button>
    </div>
    <div style="overflow:auto; max-height:300px; border:1px solid #ddd; border-radius:4px; background:#fff;">
      <table id="resultTable" border="1" cellspacing="0" cellpadding="4" style="width:100%; border-collapse: collapse; font-size:13px; text-align:center;">
        <thead style="background:#f0f0f0;">
          <tr>
            <th>序号</th>
            <th>课程名称</th>
            <th>学分</th>
            <th>是否在用</th>
            <th>课程编号</th>
            <th>教学大纲录入</th>
            <th>开课单位</th>
            <th>操作（课程大纲查看）</th>
          </tr>
        </thead>
        <tbody id="resultTbody"></tbody>
      </table>
    </div>
  `;
  document.body.appendChild(panel);
document.getElementById('btnOpenExternal').onclick = () => {
  window.open('https://enhance.njust.wiki/tools/csv2json.html', '_blank');
};
  function parsePageCourses() {
    const rows = document.querySelectorAll('tbody tr.smartTr');
    const courses = [];
    rows.forEach(tr => {
      const tds = tr.querySelectorAll('td');
      if (tds.length < 9) return;

      const indexText = tds[1].innerText.trim();

      let syllabusLink = '';
      const ondblclick = tr.getAttribute('ondblclick') || '';
      const match = ondblclick.match(/JsModck\('([^']+)'\)/);
      if(match){
        let partialUrl = match[1];
        if(partialUrl.startsWith('/')){
          syllabusLink = location.origin + partialUrl;
        } else {
          syllabusLink = location.origin + '/' + partialUrl;
        }
      }

      courses.push({
        index: indexText,
        courseName: tds[2].title || tds[2].innerText.trim(),
        credit: tds[3].title || tds[3].innerText.trim(),
        inUse: tds[4].title || tds[4].innerText.trim(),
        courseCode: tds[5].title || tds[5].innerText.trim(),
        syllabusEntered: tds[6].title || tds[6].innerText.trim(),
        department: tds[7].title || tds[7].innerText.trim(),
        syllabusText: tds[8].innerText.trim(),
        syllabusLink,
      });
    });
    return courses;
  }

  function addLog(message) {
    const logBox = document.getElementById('logBox');
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logBox.appendChild(logEntry);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function refreshTable(){
    const tbody = document.getElementById('resultTbody');
    tbody.innerHTML = '';

    const coursesToDisplay = [...allCourses];
    if (isSortDesc) {
      coursesToDisplay.reverse();
    }

    coursesToDisplay.forEach(c => {
      const tr = document.createElement('tr');

      const tdIndex = document.createElement('td');
      tdIndex.textContent = c.index;

      const tdName = document.createElement('td');
      tdName.textContent = c.courseName;

      const tdCredit = document.createElement('td');
      tdCredit.textContent = c.credit;

      const tdInUse = document.createElement('td');
      tdInUse.textContent = c.inUse;

      const tdCode = document.createElement('td');
      tdCode.textContent = c.courseCode;

      const tdSyllabusEntered = document.createElement('td');
      tdSyllabusEntered.textContent = c.syllabusEntered;

      const tdDept = document.createElement('td');
      tdDept.textContent = c.department;

      const tdSyllabusOp = document.createElement('td');
      if(c.syllabusLink){
        const a = document.createElement('a');
        a.href = c.syllabusLink;
        a.target = '_blank';
        a.textContent = c.syllabusText || '查看';
        tdSyllabusOp.appendChild(a);
      } else {
        tdSyllabusOp.textContent = c.syllabusText || '无';
      }

      tr.appendChild(tdIndex);
      tr.appendChild(tdName);
      tr.appendChild(tdCredit);
      tr.appendChild(tdInUse);
      tr.appendChild(tdCode);
      tr.appendChild(tdSyllabusEntered);
      tr.appendChild(tdDept);
      tr.appendChild(tdSyllabusOp);

      tbody.appendChild(tr);
    });

    document.getElementById('resultCount').textContent = `已采集课程数量：${allCourses.length} (第${currentPage}页)`;
  }

  function toCSV(arr){
    const header = ['序号','课程名称','学分','是否在用','课程编号','教学大纲录入','开课单位','操作（课程大纲查看链接）'];
    const lines = arr.map(c => [
      `"${c.index}"`,
      `"${c.courseName}"`,
      `"${c.credit}"`,
      `"${c.inUse}"`,
      `"${c.courseCode}"`,
      `"${c.syllabusEntered}"`,
      `"${c.department}"`,
      `"${c.syllabusLink}"`
    ].join(','));
    return header.join(',') + '\n' + lines.join('\n');
  }

  function exportCSV() {
    if (!Array.isArray(allCourses) || allCourses.length === 0) {
      alert('无课程数据可导出！');
      return;
    }
    const csv = toCSV(allCourses);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `courses_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getNextPageButton(){
    const btnImg = Array.from(document.querySelectorAll('img')).find(img=>/next/i.test(img.src));
    if(btnImg && btnImg.parentElement && btnImg.parentElement.tagName.toLowerCase()==='a'){
      return btnImg.parentElement;
    }
    return null;
  }

  async function autoCollect(){
    isAutoRunning = true;
    isPaused = false;
    currentPage = 1;
    addLog(`开始采集第${currentPage}页...`);
    updateButtons();

    while(isAutoRunning){
      if(isPaused){
        await new Promise(resolve => setTimeout(resolve, 300));
        continue;
      }

      const pageCourses = parsePageCourses();

      let minIndex = "";
      let maxIndex = "";
      if(pageCourses.length > 0) {
        minIndex = pageCourses[0].index;
        maxIndex = pageCourses[pageCourses.length-1].index;
      }

      let newCount = 0;
      pageCourses.forEach(c=>{
        if(!allCourses.find(item=>item.index === c.index)){
          allCourses.push(c);
          newCount++;
        }
      });

      if(pageCourses.length > 0) {
        addLog(`第${currentPage}页采集完成，编号${minIndex}~${maxIndex}，新增${newCount}条课程`);
      } else {
        addLog(`第${currentPage}页未找到课程数据`);
      }

      refreshTable();

      const nextBtn = getNextPageButton();
      if(!nextBtn){
        addLog(`未找到下一页按钮，采集结束`);
        break;
      }
      if(nextBtn.classList.contains('disabled') || nextBtn.style.pointerEvents==='none' || /no\.gif/i.test(nextBtn.querySelector('img')?.src)){
        addLog(`下一页按钮不可用，采集结束`);
        break;
      }

      addLog(`正在翻到第${currentPage+1}页...`);
      nextBtn.click();
      currentPage++;

      await new Promise(resolve => setTimeout(resolve, 2200));
      addLog(`开始采集第${currentPage}页...`);
    }
    isAutoRunning = false;
    updateButtons();
  }

  function updateButtons(){
    document.getElementById('btnStart').disabled = isAutoRunning && !isPaused;
    document.getElementById('btnPause').disabled = !isAutoRunning;
    document.getElementById('btnPause').textContent = isPaused ? '继续采集' : '暂停采集';
  }

  document.getElementById('btnExtractPage').onclick = () => {
    const pageCourses = parsePageCourses();

    let minIndex = "";
    let maxIndex = "";
    if(pageCourses.length > 0) {
      minIndex = pageCourses[0].index;
      maxIndex = pageCourses[pageCourses.length-1].index;
    }

    let newCount = 0;
    pageCourses.forEach(c=>{
      if(!allCourses.find(item=>item.index === c.index)){
        allCourses.push(c);
        newCount++;
      }
    });

    if(pageCourses.length > 0) {
      addLog(`手动提取：编号${minIndex}~${maxIndex}，新增${newCount}条课程`);
    } else {
      addLog(`当前页未找到课程数据`);
    }

    refreshTable();
  };

  document.getElementById('btnExportCSV').onclick = () => {
    exportCSV();
  };

  document.getElementById('btnStart').onclick = () => {
    if(isAutoRunning && isPaused){
      isPaused = false;
      updateButtons();
      return;
    }
    if(isAutoRunning) return;
    autoCollect();
  };

  document.getElementById('btnPause').onclick = () => {
    if(!isAutoRunning) return;
    isPaused = !isPaused;
    updateButtons();
  };

  document.getElementById('btnSortAsc').onclick = () => {
    isSortDesc = false;
    refreshTable();
  };

  document.getElementById('btnSortDesc').onclick = () => {
    isSortDesc = true;
    refreshTable();
  };

  document.getElementById('btnClose').onclick = () => {
    if(isAutoRunning && confirm('采集正在进行中，确定要关闭面板吗？')){
      document.body.removeChild(panel);
    } else if(!isAutoRunning) {
      document.body.removeChild(panel);
    }
  };

})();
