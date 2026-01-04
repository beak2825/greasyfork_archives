// ==UserScript==
// @name         Boss直聘职位排序
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  A Tampermonkey script using jQuery
// @author       You
// @match        https://www.zhipin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489032/Boss%E7%9B%B4%E8%81%98%E8%81%8C%E4%BD%8D%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489032/Boss%E7%9B%B4%E8%81%98%E8%81%8C%E4%BD%8D%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
  try {
    let isLoad = false
    const realXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new realXHR();

      const oldOpen = xhr.open;
      xhr.open = function (method, url, async, user, password) {
        this.addEventListener('readystatechange', function () {
        }, false);
        oldOpen.apply(this, arguments);
      };

      xhr.addEventListener('load', function () {
        if (this.status === 200 && (this.responseURL.includes('/list.json?') || this.responseURL.includes('/joblist.json?'))) {
          if (isLoad) {
            createTable(JSON.parse(xhr.responseText).zpData.jobList)
            return
          }

          isLoad = true
          loadALlScript().then(res => {
            addCustomStyle()
            createRootDom()
            createTable(JSON.parse(xhr.responseText).zpData.jobList)
          })
        }
      }, false);

      return xhr;
    };


    function loadALlScript() {
      const scriptList = [
        'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'
      ]
      const styleList = [
        'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'
      ]
      return Promise.all([...scriptList.map(createScript), ...styleList.map(createStyleLink)])
    }

    function createScript(href) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = href
        document.head.appendChild(script)
        script.onload = () => {
          resolve(true)
        }
        script.onerror = () => {
          reject(false)
        }
      })

    }

    function createStyleLink() {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'
        document.head.appendChild(link)
        link.onload = () => {
          resolve(true)
        }
        link.onerror = () => {
          reject(false)
        }
      })
    }

    function createTable(data) {
      // 创建新的 DOM 元素
      var newElement = $('<div>', {
        class: 'my-custom-element ui-widget-content',
      });

      // 创建一个表格
      const list = data.sort((a, b) => {
        // 判断是否有最后修改时间
        if (!a.lastModifyTime) {
          return 1
        }
        return new Date(b.lastModifyTime) - new Date(a.lastModifyTime)
      }).map((_, index) => {
        return $('<tr>', {
          html: `<td>${index}</td><td>${_.brandName}</td><td>${_.jobName}</td><td>${_.salaryDesc}</td><td>${_.jobExperience}</td><td>${_.bossName}</td><td>${_.bossTitle}</td><td>${_.lastModifyTime ? new Date(_.lastModifyTime).toLocaleString('zh-CN', { hour12: false }) : _.lastModifyTime}</td>`
        })
      })

      // 添加表头
      const tablehead = ['序号', '公司', '职位', '薪资', '经验', '招聘人', '招聘人职位', '最后修改时间']
      list.unshift(`<thead><tr class="ui-widget-header">${tablehead.map((_) => `<th>${_}</th>`).join('')}</tr></thead>`)

      const table = $('<table>', {
        html: list,
        class: 'ui-widget ui-widget-content'
      })

      // 将表格添加到新元素中

      newElement.append(table)

      // 判断是否已经存在
      if ($('.my-custom-element').length) {
        $('.my-custom-element').remove()
      }

      // 将新元素添加到 body 中
      $('.my-root-element').append(newElement);

      // 设置可以拖动
      $('.my-custom-element').resizable()
    }


    function createRootDom() {
      // 判断是否已经存在
      const rootDom = $('<div>', {
        class: 'my-root-element',
      })

      // 将新元素添加到 body 中
      $('body').append(rootDom);

      $('.my-root-element').draggable()
    }





  } catch (error) {
    console.error(error)
  }

  function addCustomStyle() {
    // 插入样式
    const style = document.createElement('style')
    style.type = 'text/css'
    style.id = 'my-custom-style'
    const str = `
  .my-root-element {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 9999;
    background-color: #fff;
    overflow: hidden;
  }

  .my-custom-element {
      background-color: #f9f9f9;
      border: 3px solid #ccc;
      padding: 10px;
      font-size: 16px;
      color: #333;
      width: 1200px;
      height: 300px;
      overflow: auto;
      border-radius: 5px;
  }

  .my-custom-element table {
      width: 100%;
      border-collapse: collapse;
      height: 100%;
  }

  .my-custom-element th, .my-custom-element td {
      border: 1px solid #ccc;
      padding: 5px;
      text-align: center;
  }
`
    style.innerHTML = str
    document.head.appendChild(style)
  }
})();
