// ==UserScript==
// @name         Bangumi章节批量添加时间
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Bangumi 章节批量添加时间
// @include      /^https?:\/\/(bangumi\.tv|bgm\.tv|chii\.in)\/subject\/.*\/ep\/.*/
// @author       墨云
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531843/Bangumi%E7%AB%A0%E8%8A%82%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/531843/Bangumi%E7%AB%A0%E8%8A%82%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 等待指定选择器的元素出现后执行回调
  function waitForEl(selector, cb, interval = 300, timeout = 10000) {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        cb(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
      }
    }, interval);
  }

  //
  waitForEl('div.markItUpHeader', function (toolbarToRemove) {
    if (toolbarToRemove) {
      toolbarToRemove.remove();
    }
  });
  // ----------------------------------------

  // 日历图标
  function createCalendarIcon() {
    const icon = document.createElement('div');
    icon.style.cssText = "width:16px;height:16px;position:relative;border:1px solid #007AFF;border-radius:2px;background:#fff;";
    const header = document.createElement('div');
    header.style.cssText = "position:absolute;top:0;left:0;width:100%;height:5px;background:#007AFF;border-top-left-radius:2px;border-top-right-radius:2px;";
    icon.appendChild(header);
    const dotStyle = "width:3px;height:3px;background:#007AFF;border-radius:50%;position:absolute;top:1px;";
    const dotLeft = document.createElement('div');
    dotLeft.style.cssText = dotStyle + "left:2px;";
    const dotRight = document.createElement('div');
    dotRight.style.cssText = dotStyle + "right:2px;";
    icon.appendChild(dotLeft);
    icon.appendChild(dotRight);
    return icon;
  }

  // 创建弹窗
  function createModal(onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.cssText = "position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;";
    const modal = document.createElement('div');
    modal.style.cssText = "position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:8px;min-width:300px;";
    overlay.appendChild(modal);

    // 从第几集开始（选填）
    const startEpDiv = document.createElement('div');
    startEpDiv.style.cssText = "margin-bottom:20px;";
    startEpDiv.innerHTML = `<div>从第几集开始（选填）：</div><input type="number" min="1" placeholder="留空则从当前第一个开始" style="width:100%;" />`;

    // 日期选择区域
    const dateLabel = document.createElement('label');
    dateLabel.textContent = "选择日期：";
    const dateInput = document.createElement('input');
    dateInput.type = "date";
    dateInput.style.cssText = "width:100%;margin-bottom:20px;";

    // 更新周期选择区域
    const cycleLabel = document.createElement('label');
    cycleLabel.textContent = "选择更新周期：";
    const cycleSelect = document.createElement('select');
    cycleSelect.style.cssText = "width:100%;margin-bottom:20px;";
    const defOpt = document.createElement('option');
    defOpt.value = "";
    defOpt.textContent = "更新周期";
    defOpt.disabled = true;
    defOpt.selected = true;
    cycleSelect.appendChild(defOpt);
    // 更新周期选项
    ["周更", "日更", "工作日更", "特定星期更", "当天更完"].forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      cycleSelect.appendChild(opt);
    });

    // 一天几更（默认为1）
    const dailyMultiDiv = document.createElement('div');
    dailyMultiDiv.style.cssText = "margin-top:10px;";
    dailyMultiDiv.innerHTML = `<div>一天几更（默认为1）：</div><input type="number" min="1" value="1" style="width:100%;" />`;

    // 复选框区域：仅当选择“特定星期更”时显示
    const weekdayDiv = document.createElement('div');
    weekdayDiv.style.cssText = "margin-top:10px;display:none;";
    weekdayDiv.innerHTML = `
      <div>选择星期（至少选2个）：</div>
      <label><input type='checkbox' value='1'> 星期一</label>
      <label><input type='checkbox' value='2'> 星期二</label>
      <label><input type='checkbox' value='3'> 星期三</label>
      <label><input type='checkbox' value='4'> 星期四</label>
      <label><input type='checkbox' value='5'> 星期五</label>
      <label><input type='checkbox' value='6'> 星期六</label>
      <label><input type='checkbox' value='7'> 星期日</label>
    `;
    cycleSelect.addEventListener('change', function () {
      if (cycleSelect.value === "特定星期更") {
        weekdayDiv.style.display = "block";
      } else {
        weekdayDiv.style.display = "none";
      }
    });

    // 按钮区域
    const btnDiv = document.createElement('div');
    btnDiv.style.cssText = "text-align:right;margin-top:20px;";
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = "确定";
    confirmBtn.style.marginRight = "10px";
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = "取消";
    btnDiv.appendChild(confirmBtn);
    btnDiv.appendChild(cancelBtn);

    // 按顺序将各部分添加到弹窗中
    modal.append(startEpDiv, dateLabel, dateInput, cycleLabel, cycleSelect, dailyMultiDiv, weekdayDiv, btnDiv);
    document.body.appendChild(overlay);

    confirmBtn.addEventListener('click', () => {
      const dVal = dateInput.value;
      const cycleVal = cycleSelect.value;
      let extra = null;
      if (cycleVal === "特定星期更") {
        const checkboxes = weekdayDiv.querySelectorAll("input[type='checkbox']");
        extra = [];
        checkboxes.forEach(chk => {
          if (chk.checked) extra.push(parseInt(chk.value, 10));
        });
        if (extra.length < 2) {
          alert("请至少选择两个星期！");
          return;
        }
      }
      const dailyMultiInput = dailyMultiDiv.querySelector("input[type='number']");
      const dailyMulti = parseInt(dailyMultiInput.value, 10);
      if (isNaN(dailyMulti) || dailyMulti < 1) {
        alert("请输入有效的一天几更数字（至少1）");
        return;
      }
      // 获取“从第几集开始”的值
      const startEpInput = startEpDiv.querySelector("input[type='number']");
      const startEpVal = startEpInput.value.trim();
      const startEp = startEpVal === "" ? null : parseInt(startEpVal, 10);
      onConfirm(dVal, cycleVal, extra, dailyMulti, startEp);
      document.body.removeChild(overlay);
    });
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
  }

  // 日期处理及增量函数
  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  function addDays(date, n) {
    let d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
  function addWeeks(date, n) {
    return addDays(date, 7 * n);
  }
  function addBusinessDays(date, n) {
    let d = new Date(date);
    while (n > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) n--;
    }
    return d;
  }
  // “当天更完”选项
  function computeDate(date, cycle, offset) {
    if (cycle === "日更") return addDays(date, offset);
    if (cycle === "周更") return addWeeks(date, offset);
    if (cycle === "工作日更") return addBusinessDays(date, offset);
    if (cycle === "当天更完") return date;
    return addDays(date, offset);
  }

  // 返回日期对应的星期（1 为星期一，7 为星期日）
  function getWeekday(d) {
    let wd = d.getDay();
    return wd === 0 ? 7 : wd;
  }

  // 针对“特定星期更”的处理
  function getNextScheduledDateOnOrAfter(date, selectedDays) {
    let d = new Date(date);
    while (!selectedDays.includes(getWeekday(d))) {
      d = addDays(d, 1);
    }
    return d;
  }
  function getNextScheduledDate(d, selectedDays) {
    let candidate = addDays(d, 1);
    while (!selectedDays.includes(getWeekday(candidate))) {
      candidate = addDays(candidate, 1);
    }
    return candidate;
  }
  function computeSpecificDate(startDate, selectedDays, offset) {
    let d = computeDate(startDate, "日更", 0); // 使用日更逻辑计算第一集日期
    let scheduledDate = new Date(d);
    let episodeCount = 0;
    while (episodeCount < offset) {
      scheduledDate = getNextScheduledDate(scheduledDate, selectedDays);
      episodeCount++;
    }
    return scheduledDate;
  }

  // 处理文本域数据
  function processData(startDate, cycle, extra, dailyMulti, startEp) {
    const ta = document.querySelector('textarea[name="ep_list"]');
    if (!ta) {
      alert("未找到目标文本域！");
      return;
    }
    const lines = ta.value.split(/\r?\n/);
    let started = (startEp === null);
    let uniqueCount = 0; // 累计处理的【唯一】章节数
    const mapping = {};  // 记录第一列章节号到对应的有效偏移量
    const res = lines.map(line => {
      if (!line.trim()) return line;
      const parts = line.split("|");
      const chapter = parts[0].trim();
      // 若尚未开始处理
      if (!started) {
        if (chapter === String(startEp)) {
          started = true;
        } else {
          return line;
        }
      }
      let effectiveOffset;
      if (mapping.hasOwnProperty(chapter)) {
        effectiveOffset = mapping[chapter];
      } else {
        effectiveOffset = Math.floor(uniqueCount / dailyMulti);
        mapping[chapter] = effectiveOffset;
        uniqueCount++;
      }
      let newDate;
      if (cycle === "特定星期更" && Array.isArray(extra)) {
        newDate = computeSpecificDate(new Date(startDate), extra, effectiveOffset);
      } else {
        newDate = computeDate(new Date(startDate), cycle, effectiveOffset);
      }
      parts[4] = formatDate(newDate);
      return parts.join("|");
    });
    ta.value = res.join("\n");
  }

  // 注入逻辑
  function injectButton() {
    waitForEl('textarea[name="ep_list"]', function (el) {
      const newDiv = document.createElement('div');
      newDiv.style.cssText = 'display: block; margin-bottom: 5px;';
      const link = document.createElement('a');
      link.href = "#"; // 使用#作为链接占位符
      link.title = "添加时间";
      link.style.cursor = "pointer";
      link.appendChild(createCalendarIcon());
      newDiv.appendChild(link);

      el.parentNode.insertBefore(newDiv, el);

      link.addEventListener('click', e => {
        e.preventDefault();
        createModal((dateVal, cycleVal, extra, dailyMulti, startEp) => {
          if (!dateVal) {
            alert("请选择日期！");
            return;
          }
          const d = new Date(dateVal);
          if (isNaN(d.getTime())) {
            alert("无效的日期！");
            return;
          }
          if (!cycleVal) {
            alert("请选择更新周期！");
            return;
          }
          processData(d, cycleVal, extra, dailyMulti, startEp);
        });
      });
    });
  }

  injectButton();
})();