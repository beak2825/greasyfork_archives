// ==UserScript==
// @name         融慧小公举
// @namespace    https://*.sunac.com.cn/
// @version      1.0.6
// @description  融慧小公举12
// @author       cuiqimeng
// @match        https://zhsq-iot-uat-api.sunac.com.cn/*
// @match        https://zhsq-iot.sunac.com.cn/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      http://code.jquery.com/ui/1.11.0/jquery-ui.min.js
// @resource      https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @icon         https://wydevops.coding.net/static/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476285/%E8%9E%8D%E6%85%A7%E5%B0%8F%E5%85%AC%E4%B8%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/476285/%E8%9E%8D%E6%85%A7%E5%B0%8F%E5%85%AC%E4%B8%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const log = function(...args) {
    console.log('%c融慧小公举：', 'color:red;font-weight:bold;font-size:12px;', ...args);
  };
  log('注入成功');

  // 工具方法
  const Utils = {
    // arr数组使用prop属性求和
    reduceByProp(arr, prop) {
      return arr.reduce((total, curr) => {
        return total += (curr[prop] || 0);
      }, 0);
    },
    debounce(fn, time = 500) {
      let t = null;
      return function() {
        if (t) {
          clearTimeout(t);
        }
        t = setTimeout(() => {
          fn.apply(this, arguments);
        }, time);
      };
    }
  };

  const main = async () => {
    if (location.hash !== '#/video-platform/plan-configuration/online/plan') return;
    getTable();

  };

  function getTable() {
    if (!$('table.el-table__body').length) return;
    const table = $('table.el-table__body');
    const trList = Array.from(table.find('tr'));
    // log('列：', trList);
    if (trList.length === 0) return;
    let count = 0;
    let _flag = $(trList[0]).hasClass('hacked');
    if (_flag) return;
    trList.forEach(tr => {
      const id = tr.children[7].children[0].innerText;
      const status = tr.children[1].children[0].children[0].innerText;
      const isCopy = status === '已过期';
      log('id:', id);
      // btn
      const btnHtml = `<a class='el-link el-link--${!isCopy ? 'success' : 'primary'} __hacked-btn' data-copy='${isCopy}' data-id='${id}' style='margin-right: 4px'><span data-copy='${isCopy}' data-id='${id}' class='el-link__inner'>${isCopy ? '复制' : '升级'} </span></a>`;
      $(tr.children[0].children[0]).prepend(btnHtml);
      log('已注入按钮');
      $(tr).addClass('hacked');
      count++;
    });
    $('.__hacked-btn').click(async (event) => process(event));
  }

  setInterval(() => {
    main();
  }, 1000);

  async function process(event) {
    if (event.target.innerText === '处理中' || event.target.innerText === '不可操作') return;
    log(event.target.dataset);
    const { id, copy } = event.target.dataset;
    const isCopy = copy === 'true';
    event.target.innerText = '处理中';
    try {
      const { data } = await fetchDetail(id);
      log('详情data', data);
      if (![1, 2].includes(data.level)) {
        alert('非集团级和大区级！不可操作');
        event.target.innerText = '归属非集团级和大区级';
        return;
      }
      if (data.selectLevel !== 4) {
        alert('不为项目级，不可操作！');
        event.target.innerText = '非项目级';
        return;
      }
      const allOrg = getAllOrg();
      // log(allOrg, '所有组织');
      const curr = allOrg.find(item => item.id === data.selectOrgs[0].id);
      const area = allOrg.find(item => item.id === curr.full_parent_id[1]);

      const orgNames = Array.from(new Set(data.selectOrgs.map(item => item.name.split('-')[1])));
      if (orgNames.length > 1) {
        alert(`不可操作，存在多个大区的项目：${orgNames.join('、')}`);
        event.target.innerText = '多项目不可操作';
        return;
      }

      const flag = confirm(`修改大区为「${area.name}」，是否继续？`);
      if (!flag) {
        log('用户取消');
        event.target.innerText = isCopy ? '复制' : '升级';
        return;
      }

      const params = convertDetailToSave(data, area.id, isCopy);
      log(params, 'params');
      const res = await upgradeIns(params, isCopy);
      log(res);
      if (res.code === 200) {
        event.target.innerText = '成功';
      } else {
        log('接口错误！！，粘贴给开发：', res);
        event.target.innerText = '接口错误';
        alert(res.message);
        copyToClip(JSON.stringify(res || {}));
      }
    } catch (e) {
      log('发生错误！！，粘贴给开发：', e);
      event.target.innerText = '发生错误';
      copyToClip(JSON.stringify(e));
    }
  }

  let _cache = null;

  function getAllOrg() {
    if (_cache && _cache.length) return _cache;
    return _cache = window.rootStore.state.projectData.allOrg;
  }

  function convertDetailToSave(detail, areaId, isCopy = false) {
    const repeatParam = detail.repeatParam || {};
    if (repeatParam.dayOfWeeks && repeatParam.dayOfWeeks.join) {
      repeatParam.dayOfWeeks = repeatParam.dayOfWeeks.join(',');
    }
    return {
      'line': detail.line,
      'id': isCopy ? null : detail.id,
      'orgId': detail.orgId,
      'level': detail.level,
      'name': detail.name,
      'date': isCopy ? {
        'from': '2023-09-28',
        'to': '2023-12-31'
      } : detail.date,
      'status': isCopy ? 0 : detail.status,
      'captureStartTime': detail.captureStartTime,
      'days': detail.days,
      'repeatParam': repeatParam,
      'selectLevel': 2,
      'serviceLevels': [1,
        0,
        4,
        8,
        2,
        3],
      'serviceTypes': [1, 3],
      'orgIds': [
        areaId
      ],
      'memberIds': detail.members ? detail.members.map(item => item.id) : [],
      'roleIds': detail.roles ? detail.roles.map(item => item.roleId) : [],
      'groupLevel': detail.groupLevel,
      'cameras': detail.cameras ? detail.cameras.map(item => item.dn) : [],
      'tags': detail.tags ? detail.tags.map(item => item.tag) : [],
      'tagMin': detail.tagMin,
      'tagPer': detail.tagPer
    };
  }

  function copyToClip(text) {
    const MIMETYPE = 'text/html';

    const data = [new ClipboardItem({ [MIMETYPE]: new Blob([text], { type: MIMETYPE }) })];
    navigator.clipboard.write(data).then(function() {
      log('错误信息复制成功！去试试粘贴吧～');
    }, function() {
      alert('复制失败，再试一次吧！');
      console.error('Unable to write to clipboard. :-(');
    });
  }

  async function fetchDetail(id) {
    const httpPrefix = window.httpConfig.sassServer;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${httpPrefix}/vpapi/v1/inspection/${id}`,
        type: 'GET',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,ja;q=0.8',
          'access-control-allow-origin': '*',
          'access-token': window.localStorage.accessToken,
          'group': 'VIDEO-PLATFORM',
          'stage': 'pre_release'
        },
        data: null,
        method: 'GET',
        success: function(data, textStatus, xhr) {
          // Handle the success response here
          console.log(data);
          resolve(data);
        },
        error: function(xhr, textStatus, errorThrown) {
          // Handle any errors here
          console.error(errorThrown);
          reject(errorThrown);
          alert('计划详情请求失败');
        }
      });

    });
  }

  async function upgradeIns(data, isCopy = false) {
    const httpPrefix = window.httpConfig.sassServer;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${httpPrefix}/vpapi/v1/inspection`,
        type: isCopy ? 'POST' : 'PUT',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,ja;q=0.8',
          'access-control-allow-origin': '*',
          'access-token': window.localStorage.accessToken,
          'group': 'VIDEO-PLATFORM',
          'stage': 'pre_release'
        },
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        success: function(data, textStatus, xhr) {
          // Handle the success response here
          console.log(data);
          resolve(data);
        },
        error: function(xhr, textStatus, errorThrown) {
          // Handle any errors here
          console.error(errorThrown);
          alert('保存失败');
        }
      });
    });
  }

  async function copyIns() {
    alert('稍等一下，无事发生');
  }

})();

