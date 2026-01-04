// ==UserScript==
// @name         杭州机动车驾驶人理论培训平台——模拟练习页面体验改进
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  模拟练习页面体验改进
// @author       Daijie
// @match        http://hz.5u5u5u5u.com/exercise.action*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381408/%E6%9D%AD%E5%B7%9E%E6%9C%BA%E5%8A%A8%E8%BD%A6%E9%A9%BE%E9%A9%B6%E4%BA%BA%E7%90%86%E8%AE%BA%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E2%80%94%E2%80%94%E6%A8%A1%E6%8B%9F%E7%BB%83%E4%B9%A0%E9%A1%B5%E9%9D%A2%E4%BD%93%E9%AA%8C%E6%94%B9%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/381408/%E6%9D%AD%E5%B7%9E%E6%9C%BA%E5%8A%A8%E8%BD%A6%E9%A9%BE%E9%A9%B6%E4%BA%BA%E7%90%86%E8%AE%BA%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E2%80%94%E2%80%94%E6%A8%A1%E6%8B%9F%E7%BB%83%E4%B9%A0%E9%A1%B5%E9%9D%A2%E4%BD%93%E9%AA%8C%E6%94%B9%E8%BF%9B.meta.js
// ==/UserScript==

    'use strict';
const jump = function() {
  setTimeout(() => {
    if($('#remined').hasClass('zhengque')) {
      $('.nest_btn').click()
    }
  }, 300);
};
$('#option').on('click', 'li', (e) => {
  $(e.target).find('input').click();
  if(e.target.tagName === 'INPUT') {
    jump();
  }
}).css({ cursor: 'pointer', float:'left', clear: 'both'});
$(document).keydown((e) => {
  const chars = ['A', 'B', 'C', 'D'];
  const mapping = {
    "a": "A",
    "A": "A",
    "1": "A",
    "b": "B",
    "B": "B",
    "2": "B",
    "c": "C",
    "C": "C",
    "3": "C",
    "d": "D",
    "D": "D",
    "4": "D",
  };
  if(mapping[e.key] && !(e.ctrlKey || e.metaKey)) {
    const index = chars.indexOf(mapping[e.key]);
    $('#option li').eq( index ).find('input').click();
  }
});
GM_addStyle(`#option li:hover{
    color: #01257d
}`);