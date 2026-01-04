// ==UserScript==
// @name         查询开关字段
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  switch appid
// @match        http://corpint.ams.ct.ctripcorp.com/*
// @match        https://corpint.ams.ct.ctripcorp.com/*
// @match        http://localhost:7000/#/configManagement/*
// @include        http://corpint.ams.*.qa.nt.ctripcorp.com/*
// @include        https://corpint.ams.*.qa.nt.ctripcorp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ctripcorp.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504260/%E6%9F%A5%E8%AF%A2%E5%BC%80%E5%85%B3%E5%AD%97%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/504260/%E6%9F%A5%E8%AF%A2%E5%BC%80%E5%85%B3%E5%AD%97%E6%AE%B5.meta.js
// ==/UserScript==
(function() {
 
    let html;
 
    let configs = [];
    let result = [];
 
    if (window.location.href.indexOf('serviceFee' > -1)) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://corpint.ams.ct.ctripcorp.com/ams/switchManagement/queryConfig',
            data:'{"module": "serviceFee","inUseState": "A","dimension": "fundaccount","page": 1,"pageSize": 1000,"pos": "ALL"}',
            headers: {
                'Content-Type':'application/json'
            },
            onload: (response) => {
                // Display the search results in the label
                var result = JSON.parse(response.responseText)
                configs = result.response.data
            }
        });
    }
 
    document.addEventListener('keydown', (e) => {
      if (e && e.code === 'Digit1' && e.ctrlKey && e.altKey) {
        const hideableItems = document.getElementsByClassName('hideableType')
        const styleInvisible = 'display:none;font-size:10px;margin-right:5px'
        const styleVisible = 'display:inline;font-size:10px;margin-right:5px'
        if (hideableItems && hideableItems.length > 0) {
          const available = hideableItems[0].getAttribute('style') !== styleInvisible
          hideableItems.forEach((a) => {
            a.setAttribute('style', available ? styleInvisible : styleVisible)
          })
        } else {
          document.getElementsByTagName('a').forEach((a) => {
            if (a.attributes['id']?.value?.includes('_a')) {
              var keyVal = document.createElement("div");
              const replacedKey = a.attributes['id']?.value?.replace('_a', '')
              const config = configs.filter(a => a.sysKey.replaceAll('_', '') === replacedKey)
              if (config.length = 1 && config[0] != undefined) {
                  let nameCn = {}
                  if (config[0].sysValue != undefined && config[0].sysValue != '') {
                      const values = config[0].sysValue.split(',')
                      for (let curr = 0; curr < values.length; curr++) {
                          const convert = values[curr].split(':')
                          nameCn[convert[0]] = convert[1]
                      }
                  }
                  keyVal.innerText = config[0].tableName + '.' + config[0].sysKey + ' 默认值：' + (nameCn[config[0].defVal] == undefined ? config[0].defVal : nameCn[config[0].defVal])
              } else {
                  keyVal.innerText = a.attributes['id']?.value?.replace('_a', '')
              }
              keyVal.setAttribute('class', 'hideableType')
              keyVal.setAttribute('style', styleVisible)
              a.appendChild(keyVal)
            }
          })
          console.log(sysKeyList.join(','))
        }
      }
    })
})();