// ==UserScript==
// @name         切换虚拟集群
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  本地调用Nacos切换虚拟集群（网关需编写代码支持）
// @author       fzhyzamt
// @match        *://*.nexttoship.cc/*
// @match        *://gaia-test.cntrans.cn/*
// @match        *://192.168.6.141/*
// @match        *://192.168.6.143/*
// @match        *://localhost/*
// @match        *://0.0.0.0/*
// @match        *://127.0.0.1/*
// @match        *://bc.cntrans.cn/*
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.7.1.min.js#md5=2c872dbe60f4ba70fb85356113d8b35e
// @homepageURL  https://greasyfork.org/zh-CN/scripts/480416-%E5%88%87%E6%8D%A2%E8%99%9A%E6%8B%9F%E9%9B%86%E7%BE%A4
// @downloadURL https://update.greasyfork.org/scripts/480416/%E5%88%87%E6%8D%A2%E8%99%9A%E6%8B%9F%E9%9B%86%E7%BE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/480416/%E5%88%87%E6%8D%A2%E8%99%9A%E6%8B%9F%E9%9B%86%E7%BE%A4.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (!/(cntrans-cm|bc-rail-web|rail-way-mobile|cm|lotheor|yundao-console-web)/.test(location.pathname)) {
    return
  }

  let _preSelector = null

  function _createBaseSelector(localKey, values) {
    const d = document.createElement('div')
    d.style.position = 'fixed'
    // d.style.top = (_preSelector === null ? 0 : d.getBoundingClientRect().bottom) + 'px'
    d.style.top = (_preSelector === null ? 0 : 22) + 'px'
    _preSelector = d
    d.style.left = 0
    d.style.zIndex = 1000
    const select = document.createElement('select')
    for (const value of ['DEFAULT', ...values]) {
      var option = document.createElement('option')
      if (typeof value === 'object') {
        option.value = value.value
        option.text = value.label
      } else {
        option.value = value
        option.text = value
      }
      select.appendChild(option)
    }
    select.onchange = function (e) {
      let value = e.target.value
      if (value === 'DEFAULT') {
        localStorage.removeItem(localKey)
      } else {
        localStorage.setItem(localKey, value)
      }
    }
    d.appendChild(select)

    let cluster = localStorage[localKey]
    cluster ??= 'DEFAULT'
    select.value = cluster
    return d
  }

  function createClusterSelector() {
    // 最终文件头：X-Cntrans-Cluster
    const d = _createBaseSelector('XCntransCluster', ['LOCAL', 'LOCAL2', 'LOCAL3', 'AD'])
    return d
  }

  function createCmHostSelector() {
    return new Promise((resolve) => {
      $.ajax({
        url: 'http://nacos.nexttoship.cc:18848/nacos/v2/ns/instance/list',
        method: 'GET',
        data: {
          namespaceId: 'f9a2d77f-561c-45a2-8d09-1fd569301f96',
          groupName: 'CINTERMODAL',
          serviceName: 'container-management'
        }
      }).done(function (resp) {
        resolve(
          _createBaseSelector(
            'XCntransCmHost',
            resp.data.hosts.map((host) => {
              let hostname = host.ip + ':' + host.port
              return {
                label: hostname,
                value:  hostname
              }
            })
          )
        )
      })
    })
  }

  const selectorDiv = createClusterSelector()
  document.body.appendChild(selectorDiv)

  if (/cintermodal\.nexttoship\.cc\/cm/.test(location.href)) {
    const cmSelectorDiv = createCmHostSelector()
    cmSelectorDiv.then((d) => {
      document.body.appendChild(d)
    })
  }
})()
