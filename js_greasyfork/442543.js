/*
 * @Description: File Description
 * @FilePath: /backend_cms_mangement/index.js
 * @LastEditors: zzz
 * @LastEditTime: 2022-04-14 15:11:54
 */
// ==UserScript==
// @name         cms backend management
// @name:zh-CN   cms内部管理
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  cms内部管理
// @author       zzailianlian
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @match        http://backend.meitun-test.com/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meitun-test.com
// @license      MIT
// @run-at document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/442543/cms%20backend%20management.user.js
// @updateURL https://update.greasyfork.org/scripts/442543/cms%20backend%20management.meta.js
// ==/UserScript==

(function () {
  'use strict';


  var sc = document.createElement("script");
  sc.setAttribute("type", "text/javascript");
  sc.src = "https://code.jquery.com/jquery-3.5.1.min.js";
  // document.getElementsByTagName('body')[0].appendChild(sc);

  if (window.ActiveXObject || "ActiveXObject" in window) { //判断是否是ie
    if (sc.readyState) { //判断是否支持readyState
      sc.onreadystatechange = function () {
        if (this.readyState == "loaded" || this.readyState == "complete") {
          console.log("ie10及以下加载完成");
          onloaded()
        }
      }
    } else {
      sc.onload = function () {
        console.log("ie11及Edge加载完成");
        onloaded()
      }
    }
  } else {    //不是ie
    sc.onload = function () {
      console.log('非ie浏览器加载完成');
      onloaded()
    }
  }

  function clearActivitedTab() {
    if ($('#menubar_tabs span[title="关闭"]').length) {
      $.map($('#menubar_tabs span[title="关闭"]'), function (item) {
        item.click()
      })
    }
  }

  var onloaded = function () {
    var jqVersion = $.fn.property || $().property || jQuery.fn.jquery
    console.log('version版本：', jqVersion)

    const wrapperToolsContainer = $('<div id="wrapperToolsContainer">更新的页面id：<input type="number" style="margin-bottom:8px;"/></div>')

    wrapperToolsContainer.find('input').attr('value','783')

    wrapperToolsContainer.css({
      position: 'fixed',
      top: 50,
      right: 100,
      padding: '12px',
      background: '#3498db',
      borderRadius: '4px',
      fontSize: '14px',
      zIndex: 999,
      opacity: 0.1,
    });
    wrapperToolsContainer.hover(function () { $(this).css({ opacity: 1 }); }, function () { $(this).css({ opacity: .1 }); })
    const initCMSModule = $('<div>初始化cms页面</div>')
    initCMSModule.css({
      padding: '12px',
      color: 'white',
      background: '#2ecc71',
      borderRadius: '4px',
      fontSize: '14px',
      border: '1px solid #27ae60',
      zIndex: 999,
      marginBottom: '24px',
      cursor: 'pointer'
    });

    const syncConfig = $('<div>同步配置到页面</div>')
    syncConfig.css({
      padding: '12px',
      color: 'white',
      background: '#2ecc71',
      borderRadius: '4px',
      fontSize: '14px',
      border: '1px solid #27ae60',
      zIndex: 999,
      cursor: 'pointer'

    });

    wrapperToolsContainer.append(initCMSModule).append(syncConfig)
    $('body').append(wrapperToolsContainer)

    const CMS_PAGE_TAB_ID = 'CMS_PAGE_TAB_ID'
    const CMS_MODULE_TAB_ID = 'CMS_MODULE_TAB_ID'
    function getLastTabId() {
      return $('#menubar_tabs').find('h3').last().find('a').attr('id')
    }
    initCMSModule.on('click', () => {
      clearActivitedTab();
      // 初始化cms管理tab
      $("a:contains('v2.0CMS页面管理')").get(0).click()
      GM_setValue(CMS_PAGE_TAB_ID, getLastTabId());
      $("a:contains('v2.0CMS系统模板')").get(0).click()
      GM_setValue(CMS_MODULE_TAB_ID, getLastTabId());
    })

    function getFrameJQ(id) {
      // mainIframe_modifyPage
      // mainIframe_tabli_
      return $(document.getElementById(id).contentWindow.document.body)
    }
    function getIdFromTab(tabidArr) {
      if (!tabidArr || tabidArr instanceof Array) {
        return ''
      }
      return tabidArr.split('_').slice(-1) || ''
    }
    function loop(judgeFn = () => { }, callbackFn = () => { }, delay = 1000) {
      let threshold = 10 * delay; // 10个delay的时间，默认为10s
      console.log("interval start")
      let startTimeStamp = 0;
      const intervalTimer = window.setInterval(function () {
        console.log("interval running")
        startTimeStamp += delay;
        if (judgeFn()) {
          console.log("interval end")
          callbackFn()
          window.clearInterval(intervalTimer)
          return;
        }
        if (startTimeStamp >= threshold) {
          window.clearInterval(intervalTimer)
          console.error('loop超时')
          return new Error('loop超时')
        }
      }, delay)
    }



    syncConfig.on('click', () => {
        const MODULE_ID = $('#wrapperToolsContainer').find('input').get(0).value;

              if(!MODULE_ID){
               return alert('请输入要更新的页面id')
              }
    console.log('MODULE_ID',MODULE_ID)

      // 同步配置模板到页面
      const pendingSyncList = $('button:contains("同步线上")')
      console.log('我是同步列表', pendingSyncList, window.performance)
      const cmsPageFrameJq = getFrameJQ('mainIframe_tabli_' + getIdFromTab(GM_getValue(CMS_PAGE_TAB_ID)))
      // 编辑页面
      cmsPageFrameJq.find('tr').find('td:contains(' + MODULE_ID + ')').parent().find('button:contains("编辑")').click()

      loop(function () {
        return !!$('#mainIframe_modifyPage' + MODULE_ID).length
      }, function () {
        // 存在该iframe说明已经【编辑点击之后调起iframe】
        const cmsPageModalFrameJq = getFrameJQ('mainIframe_modifyPage' + MODULE_ID)
        loop(function () {
          // 副标题存在数据，说明【编辑操作】掉接口回填成功
          return !!$(getFrameJQ('mainIframe_modifyPage' + MODULE_ID)).find('input[placeholder="如：APP新客活动"]').last().attr('value')
        }, function () {
          // 下一步
          $(getFrameJQ('mainIframe_modifyPage' + MODULE_ID)).find('input[value="下一步"]').last().click();
          loop(function () {
            // 如果模拟器中存在模板数据，说明【下一步操作】掉接口回填成功
            return !!$(getFrameJQ('mainIframe_modifyPage' + MODULE_ID)).find('.cms-show').length
          },
            function () {
              // 保存
              $(getFrameJQ('mainIframe_modifyPage' + MODULE_ID)).find('input[value="保存"]').last().click()
              loop(function () {
                // 如果存在同步线上按钮，说明【保存操作】掉接口回填成功
                return !!$(getFrameJQ('mainIframe_tabli_' + getIdFromTab(GM_getValue(CMS_PAGE_TAB_ID)))).find('tr').find('td:contains(' + MODULE_ID + ')').parent().find('button:contains("同步线上")').length
              }, function () {
                // 同步线上
                $(getFrameJQ('mainIframe_tabli_' + getIdFromTab(GM_getValue(CMS_PAGE_TAB_ID)))).find('tr').find('td:contains(' + MODULE_ID + ')').parent().find('button:contains("同步线上")').click()
              })
            })
        })
      })
    })
  }
  onloaded()
})();