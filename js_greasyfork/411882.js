// ==UserScript==
// @name         trtc-success-rate
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       You
// @match        https://mta.qq.com/h5/visitor/ctr_button_stat/config?app_id=500699039
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411882/trtc-success-rate.user.js
// @updateURL https://update.greasyfork.org/scripts/411882/trtc-success-rate.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  /**
   *
   * @param {*} arg
   * @return {*}
   */
  function parseDom(arg) {
    var objE = document.createElement('div');
    objE.innerHTML = arg;
    return objE.childNodes;
  }

  /**
   * 获取事件列表
   * @return {*}
   */
  async function getList() {
    let { data } = await fetch(
      'https://mta.qq.com/h5/visitor/ctr_button_stat/get_config_data?&app_id=500699039&rnd=1601001086951&ajax=1'
    ).then(res => res.json());
    return data
      .filter(item => item.custom_id !== 'version' && item.custom_id !== 'sdkAppID')
      .map(item => {
        const res = {};
        res[item.custom_id] = parseDom(item.control)[0].dataset.id;
        return res;
      });
  }

  /**
   *
   *
   * @param {*} timestamp
   * @return {*}
   */
  function getDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  /**
   *
   * @param {number} id
   * @return {*}
   */
  async function getSuccessRate(id, span = 7) {
    const now = new Date();
    const startDate = getDate(now - span * 24 * 3600 * 1000);
    const endDate = getDate(now);
    const { data } = await fetch(
      `https://mta.qq.com/h5/visitor/ctr_custom_param/get_table?start_date=${startDate}&end_date=${endDate}&app_id=500699039&custom_id=${id}&param_id=value&rnd=1601000365539&ajax=1`
    ).then(res => res.json());
    const pending = data.filter(item => item.param_value.includes('pending'))[0].btn_stat;
    const success = data.filter(item => item.param_value.includes('success'))[0].btn_stat;
    const rate = ((success / pending) * 100).toFixed(2) + '%';
    return { rate, pending, success };
  }

  const list = await getList();
  let interval = setInterval(() => {
    const table = document.getElementById('div_table_table');
    if (table) {
      clearInterval(interval);
      list.forEach(async (item, index) => {
        const key = Object.keys(item)[0];
        const id = item[key];
        const { rate, pending, success } = await getSuccessRate(id);
        table.rows[
          index + 1
        ].cells[1].childNodes[0].innerHTML += `: ${rate} (${success}/${pending})(7天)`;
      });
    }
  }, 1000);
})();
