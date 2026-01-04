// ==UserScript==
// @name         直播查询脚本
// @namespace    http://tampermonkey.net/
// @version      0.4
// @icon         https://cdn.jsdelivr.net/gh/fujinxiang/statics/avatar.png
// @description  live search script
// @include      *://*.ke.seewo.com/*
// @include      *://live.seewo.com/*
// @include      *://monitor.cvte.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/mousetrap@1.6.5/mousetrap.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435883/%E7%9B%B4%E6%92%AD%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435883/%E7%9B%B4%E6%92%AD%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';
  $(document).ready(function () {
    console.log('直播脚本开始');

    function getPlanId() {
      let id;
      const url = window.location.href;

      return new Promise((resolve, reject) => {
        try {
          if (url.includes('research')) {
            const activityUid = /research\/([a-z0-9]+)$/.exec(window.location.href)[1];
            const apiExtend = {
              method: 'GET',
              apiUrl: `/class-platform/activity/v1/${activityUid}/research/open/detail`,
              headers: { userName: '', userType: '', userId: '' },
              baseURL: 'http://gjy.seewo.com',
            };
            fetch &&
              fetch('/live/fetch', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  ApiExtend: btoa(JSON.stringify(apiExtend)),
                },
              }).then((result) =>
                result.json().then((data) => {
                  if (data.code === 200) {
                    id = data.data.planUid;
                    resolve(id);
                  }
                })
              );
          } else if (url.includes('interactivity')) {
            const activityUid = /interactivity\/([a-z0-9]+)$/.exec(window.location.href)[1];
            const apiExtend = {
              method: 'GET',
              apiUrl: `/class-platform/activity/v1/${activityUid}/interactivity/open/detail`,
              headers: { userName: '', userType: '', userId: '' },
              baseURL: 'http://gjy.seewo.com',
            };
            fetch &&
              fetch('/live/fetch', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  ApiExtend: btoa(JSON.stringify(apiExtend)),
                },
              }).then((result) =>
                result.json().then((data) => {
                  if (data.code === 200) {
                    id = data.data.planUid;
                    resolve(id);
                  }
                })
              );
          } else {
            id = /\/([a-z0-9]+)$/.exec(window.location.href)[1];
            resolve(id);
          }
        } catch (error) {
          console.log(error);
          reject(error);
          alert('获取活动ID失败');
        }
      });
    }

    function gotoGrafana() {
      getPlanId().then((id) => {
        window.open(`https://monitor.cvte.com/grafana/d/GCUc2UuWk/zhi-bo-cha-xun?orgId=13&var-search=${id}`);
      });
    }

    if (/\/([a-z0-9]+)$/.test(window.location.href) && window.location.href.includes('/live')) {
      var link = $('<a style="position:fixed;top:50%;right:10px;z-index:9999;" href="javascript:void(0)">去Grafana查询</a>');
      link.click(gotoGrafana);
      $('body').append(link);

      Mousetrap.bind('ctrl+shift+h', function () {
        $(link).toggle();
      });
    }

    if(window.location.href.includes('zhi-bo-cha-xun')){
      var opsLink = $('<a style="position:fixed;top:55%;right:38%;z-index:9999;color:yellow" href="http://live.seewo.com/ops" target="_blank">去 OPS 查询</a>');
      $('body').append(opsLink);

      Mousetrap.bind('ctrl+shift+h', function () {
        $(opsLink).toggle();
      });
    }
  });
})();