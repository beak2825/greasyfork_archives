// ==UserScript==
// @name        Jagile - jd.com
// @namespace   Violentmonkey Scripts
// @match       http://jagile.jd.com/myzone
// @icon        http://jagile.jd.com/static/favicon.ico
// @grant       none
// @version     1.0.3
// @author      -
// @description 12/9/2020, 6:05:45 PM
// @downloadURL https://update.greasyfork.org/scripts/418390/Jagile%20-%20jdcom.user.js
// @updateURL https://update.greasyfork.org/scripts/418390/Jagile%20-%20jdcom.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  setTimeout(() => {
    const saveEl = document.createElement('DIV');
    saveEl.className = 'el-form-item el-form-item--small';
    saveEl.innerHTML = '<div class="el-form-item__content"><button type="button" class="el-button el-button--primary el-button--mini"><span>保存</span></button></div>';
    saveEl.firstChild.firstChild.addEventListener('click', () => {
      const calendars = Array.from(document.getElementsByClassName('calendar-body__name__info'))
        .filter(el => (window.getComputedStyle(el.parentNode.parentNode).display !== "none"))
        .map(el => el.firstChild.innerText.match(/^([^ ]+) \( (.+?) \)$/))
        .map(a => ({ name: a[1], erp: a[2] }));
      window.localStorage['com.derzh.jd.jagile.calendar'] = JSON.stringify(calendars);
    });
    document.getElementsByClassName('teamspace-calendar__condition')[0].appendChild(saveEl);

    const loadEl = document.createElement('DIV');
    loadEl.className = 'el-form-item el-form-item--small';
    loadEl.innerHTML = '<div class="el-form-item__content"><button type="button" class="el-button el-button--primary el-button--mini"><span>恢复</span></button></div>';
    loadEl.firstChild.firstChild.addEventListener('click', () => {
      const calendars = JSON.parse(window.localStorage['com.derzh.jd.jagile.calendar']);
      const erps = calendars.map(c => `${c.name}(${c.erp})`);
      const els = [...document.getElementsByClassName('el-select-dropdown__item')]
        .filter(el => !el.classList.contains('selected') && erps.includes(el.innerText));
      const timer = setInterval(() => {
        const el = els.pop();
        if (el) {
          el.click();
        } else {
          clearInterval(timer);
        }
      })
    });
    document.getElementsByClassName('teamspace-calendar__condition')[0].appendChild(loadEl);
  }, 1000);
  
  const styleEl = document.createElement('STYLE');
  styleEl.innerHTML = '.teamspace-calendar .calendar .calendar-body__name { padding: 5px 0 5px 16px; } '
    + '.teamspace-calendar .calendar .calendar-body__task-list { padding: 2px 4px 2px 2px; } '
    + '.teamspace-calendar .calendar .calendar-body__load-item { height: 20px; line-height: 20px; font-size: 10px; } '
    + '.teamspace-calendar .calendar .calendar-body__name p.user { margin: 0; font-size: 12px; line-height: 20px; } ';
  document.body.appendChild(styleEl);
});
