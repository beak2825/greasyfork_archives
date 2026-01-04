// ==UserScript==
// @name        JD 995 Dinner - jd.com
// @namespace   Violentmonkey Scripts
// @match       http://monitor.m.jd.com/tools/dinner/index
// @icon         http://vms.jd.com/assets/img/favicon.ico
// @grant       none
// @version     1.0.4
// @author      -
// @description 12/10/2020, 1:58:16 PM
// @downloadURL https://update.greasyfork.org/scripts/418441/JD%20995%20Dinner%20-%20jdcom.user.js
// @updateURL https://update.greasyfork.org/scripts/418441/JD%20995%20Dinner%20-%20jdcom.meta.js
// ==/UserScript==

const INTERVAL = 600000;
let DISHES = window.localStorage['com.derzh.jd.m.monitor.dinner.dishes'] || '大排面,小院\n土豆牛肉面,小院\n西点,天象';

const inferDish = () => {
  const dishes = Array.from($('#alarm_try_form').find('input[type=radio]')).map(el => el.value);
  const dish = DISHES.split('\n')
    .map(line => line.split(',').map(l => l.trim()).filter(_ => _))
    .filter(l => l.length)
    .map(line => dishes.find(d => !line.some(l => !d.match(l))))
    .filter(_ => _)[0] || dishes[0];
  return dish;
};

// 挂载配置和显示界面

// 说明
const configDEl = document.createElement('DIV');
configDEl.style = 'margin: 0 0 20px 0;';
configDEl.innerText = '说明：菜名一行一个，可使用逗号分隔多个匹配字符串，依次从上到下按顺序匹配，全部匹配失败自动定第一个菜。';
$('#alarm_try_form').after(configDEl);

// 根据配置实时计算出的结果
const configSEl = document.createElement('SPAN');
const updateSEl = () => {
  configSEl.innerText = ` => ${inferDish()}`;
};
configSEl.style = 'line-height: 60px; color: #999;';
$('#alarm_try_form').after(configSEl);

// 配置输入框
const configTAEl = document.createElement('TEXTAREA');
configTAEl.style = 'margin: 10px; width: 400px; height: 100px;';
configTAEl.value = DISHES;
configTAEl.addEventListener('input', () => {
  DISHES = configTAEl.value;
  window.localStorage['com.derzh.jd.m.monitor.dinner.dishes'] = DISHES;
  updateSEl();
});
$('#alarm_try_form').after(configTAEl);

// 标题
const configHEl = document.createElement('H4');
configHEl.innerText = '自动订餐：';
// 状态
configHEl.appendChild(document.createElement('SPAN'));
const statusEl = configHEl.firstElementChild;
statusEl.style = 'margin: 0 5px; color: red; font-size: 12px;';
$('#alarm_try_form').after(configHEl);
// 倒计时
configHEl.appendChild(document.createElement('SPAN'));
const timerEl = configHEl.firstElementChild.nextElementSibling;
timerEl.style = 'font-size: 12px; color: #666;';

// 检查订餐
window.addEventListener('load', () => {
  const checked = $('#alarm_try_form').find('span.checked');
  if (checked.length) {
    statusEl.innerText = '已预定：' + checked.parent().parent().text().trim();
  } else {
    const dish = inferDish();
    // /tools/dinner/change
    $.post('/tools/dinner/order', { type : dish }, (data) => {
      const data_json = JSON.parse(data);
      if (data_json.status !== 'success') {
        statusEl.innerText = "预定失败，原因：" + data_json.message;
      } else {
        statusEl.innerText = "预定成功：" + dish + data_json.message;
      }
    });
  }
  updateSEl();
});

// 启动定时器
const startTime = new Date().getTime();
setInterval(() => {
  const currTime = new Date().getTime();
  if (currTime - startTime > INTERVAL) {
    $.get('.', () => {
      window.location.reload();
    });
  }
  const cd = Math.max(Math.floor((INTERVAL - (currTime - startTime)) / 1000), 0);
  timerEl.innerText = `(reload: ${Math.floor(cd / 60)}:${cd % 60})`;
}, 1000);
