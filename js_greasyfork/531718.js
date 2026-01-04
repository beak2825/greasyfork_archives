// ==UserScript==
// @name         自动刷新ERP考勤二维码
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  ERP自动刷新考勤二维码
// @author       CListery
// @match        *://e.fangstar.net/login.html
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531718/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0ERP%E8%80%83%E5%8B%A4%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/531718/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0ERP%E8%80%83%E5%8B%A4%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const AUTO_SERVER_HOST = 'http://auto.nrp.fangstar.com'
  // const AUTO_SERVER_HOST = 'http://127.0.0.1:9123'

  const styleE = document.createElement('style')
  styleE.textContent = `
.x-mask,
.x-css-shadow,
.app-download-container,
.atten-qrcode-mask,
.atten-qrcode-mask-el,
.x-window.x-message-box.x-layer.x-window-default {
  display: none !important;
}

.x-window.x-layer.x-window-default.x-border-box {
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}

.qr-shower {
  display: flex !important;
  position: fixed !important;
  z-index: 9999999 !important;
  background: white !important;
  border: 4px black !important;
  top: 10% !important;
  left: 50% !important;
  transform: translate(-50%, -5%);
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
}

.time-label {
  position: fixed !important;
  top: 80% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}

.refresh-btn {
  display: flex;
  position: fixed;
  z-index: 9999999;
  cursor: pointer;
  top: 88%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 19px;
  color: #ffffff;
  padding: 8px 10px 8px 10px;
  background-color: #363636;
  border: 1px solid;
  border-radius: 6px 6px 6px 6px;
  text-decoration: none;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
}

.refresh-btn:hover {
  background-color: #2483ab;
  color: white;
}

.refresh-btn:disabled {
  background-color: rgb(155, 155, 155);
  color: rgb(10, 10, 10);
  cursor: not-allowed;
  border: none;
}

.hide {
  display: none !important;
}
`

  setInterval(() => {
    if (document.querySelector('#appLoadingIndicator_bg')) {
      location.reload()
    }
  }, 10000)

  const forceRefreshAttenQrcode = () => {
    clearInterval(refreshCheckerId)
    unsafeWindow.self.isUpdateDevice = false
    window.stop_time_check_on_next_day = true
    let date = new Date()
    window.curDay = date.getDay()
    window.pause_auto_refresh = false
    unsafeWindow.self._getAttenQrcode()
  }

  const refreshChecker = () => {
    let date = new Date()
    if (window.stop_time_check_on_next_day && window.curDay) {
      if (date.getDay() == window.curDay) {
        window.pause_auto_refresh = false
        return
      } else {
        window.stop_time_check_on_next_day = false
        window.curDay = undefined
      }
    }
    let curMinutes = date.getMinutes()
    window.pause_auto_refresh = true
    switch (date.getHours()) {
      case 8:
        if (curMinutes >= 30) {
          window.pause_auto_refresh = false
        }
        break
      case 9:
        if (curMinutes <= 30) {
          window.pause_auto_refresh = false
        }
        break
      case 17:
        if (curMinutes >= 50) {
          window.pause_auto_refresh = false
        }
        break
      case 18:
        if (curMinutes <= 10) {
          window.pause_auto_refresh = false
        }
        break
      default:
        break
    }
    if (window.pause_auto_refresh) {
      request('GET', `${AUTO_SERVER_HOST}/check`, (resp) => {
        try {
          data = JSON.parse(resp.responseText)
        } catch (error) {
          data = resp.responseText
        }
        if (typeof data === 'object') {
          if (data['status'] === 'ok') {
            console.log('response:', resp.finalUrl, data)
            if (data['is_wait'] && data['is_wait'] == true) {
              forceRefreshAttenQrcode()
            }
            return
          }
        }
        console.error(data)
      })
    }
  }
  refreshChecker()
  const refreshCheckerId = setInterval(refreshChecker, 1000)

  if (document.lastElementChild) {
    document.lastElementChild.appendChild(styleE)
  } else {
    let timer1 = setInterval(function () {
      if (document.lastElementChild) {
        clearInterval(timer1)
        document.lastElementChild.appendChild(styleE)
      }
    })
  }

  // const server = window.location.origin

  let refreshButton = document.createElement('button')
  refreshButton.textContent = 'REFRESH'
  refreshButton.classList.add('refresh-btn')
  document.body.appendChild(refreshButton)
  refreshButton.onclick = forceRefreshAttenQrcode

  window.wait_ready_task = setInterval(() => {
    // console.log(erp.svc.sys.SysSvc.getHelperData)
    // if (erp.svc.sys.SysSvc.getHelperData) {
    //   if (!erp.svc.sys.SysSvc._getHelperData_hook) {
    //     erp.svc.sys.SysSvc._getHelperData_hook = erp.svc.sys.SysSvc.getHelperData
    //     erp.svc.sys.SysSvc.getHelperData = function (maskMsg) {
    //       return new Ext.Promise(function (resolve, reject) {
    //         erp.svc.sys.SysSvc._getHelperData_hook(maskMsg)
    //           .then(function (helperCiphertext) {
    //             console.log('getHelperData s:', helperCiphertext)
    //             resolve(helperCiphertext)
    //           })
    //           .catch(function (err) {
    //             console.error('getHelperData e:', err)
    //             reject(err)
    //           })
    //       })
    //       // var me = this
    //       // var helperUrl = Ext.String.format(
    //       //   '{0}/getDetailHostInfo',
    //       //   erp.conf.helperUrl || 'https://rfid.fangstar.com:48900'
    //       // )
    //       // return new Ext.Promise(function (resolve, reject) {
    //       //   erp.svc.BaseSvc.ajax
    //       //     .call(me, { url: '/v2/common/now', hideMask: !maskMsg, loadMsg: maskMsg })
    //       //     .then(function (now) {
    //       //       maskMsg && me.mask(maskMsg)
    //       //       Ext.data.JsonP.request({
    //       //         url: helperUrl,
    //       //         params: { unixTime: now, _dc: now },
    //       //         timeout: 2000,
    //       //         success: function (data) {
    //       //           maskMsg && me.unmask()
    //       //           resolve(data && data.data)
    //       //         },
    //       //         failure: function (err) {
    //       //           maskMsg && me.unmask()
    //       //           reject('<a href="/download.html">房星小助手</a>未运行或运行失败，请重新运行。')
    //       //         },
    //       //       })
    //       //     })
    //       //     .catch(function (err) {
    //       //       reject(err)
    //       //     })
    //       // })
    //     }
    //   }
    // }

    // console.log(unsafeWindow.self._switchToQCodeAtten)
    if (unsafeWindow.self._switchToQCodeAtten) {
      let self = unsafeWindow.self

      clearInterval(window.wait_ready_task)

      if (!self._getAttenQrcode_hook) {
        self._getAttenQrcode_hook = self._getAttenQrcode
        self._getAttenQrcode = function (data) {
          if (window.pause_auto_refresh) {
            return
          }
          return self._getAttenQrcode_hook(data)
        }
      }
      if (!self._setAttenQrcodeEnable_hook) {
        self._setAttenQrcodeEnable_hook = self._setAttenQrcodeEnable
        self._setAttenQrcodeEnable = function (enable) {
          refreshButton.disabled = enable
          return self._setAttenQrcodeEnable_hook(enable)
        }
      }
      if (!self._queryAttenQrcodeKey_hook) {
        self._queryAttenQrcodeKey_hook = self._queryAttenQrcodeKey
        self._queryAttenQrcodeKey = function (data) {
          // console.log('_queryAttenQrcodeKey:', data)
          const updateDeviceInfo = () => {
            console.log('updateDeviceInfo:', self.isUpdateDevice, data)
            if (self.isUpdateDevice == true) {
              return
            }
            request(
              'POST',
              `${AUTO_SERVER_HOST}/helper/device`,
              JSON.stringify({ helperCiphertext: data }),
              {
                'Content-Type': 'application/json',
              },
              (resp) => {
                try {
                  data = JSON.parse(resp.responseText)
                } catch (error) {
                  data = resp.responseText
                }
                if (typeof data === 'object') {
                  if (data['status'] === 'ok') {
                    console.log('response:', resp.finalUrl, data)
                    self.isUpdateDevice = true
                    self._getAttenQrcode()
                    return
                  }
                }
                console.error(data)
              }
            )
          }
          erp.appData.ajaxReq({
            mask: [self],
            url: erp.Server.attendance.attenQrcode.getShopAttenQrcodeKey,
            params: {
              router_data: data,
            },
            successCallBack: function (data) {
              self._attenQrcodeId_ = data.qrcodeid
              self._attenQrcodeTtl_ = data.ttl
              try {
                self._createAttenQrcode(data.qrcodeid)
                self._setAttenQrcodeTimer(data.ttl)
                self._setAttenQrcodeEnable(true)
                self.attenTimerCt.setData({ time: data.ttl })
              } catch (ex) {
                self._setAttenQrcodeEnable(false)
              }
            },
            failureCallBack: function () {
              self._attenQrcodeId_ = null
              self._setAttenQrcodeEnable(false)
              updateDeviceInfo()
            },
          })
        }
      }

      if (!self._createAttenQrcode_hook) {
        self._createAttenQrcode_hook = self._createAttenQrcode
        self._createAttenQrcode = function () {
          request(
            'POST',
            `${AUTO_SERVER_HOST}/token/${self._attenQrcodeId_}?valid_time=${self._attenQrcodeTtl_}`
          )
          return self._createAttenQrcode_hook(...arguments)
        }
      }

      self._switchToQCodeAtten()

      let qrcodeDOM = self.el.query('#' + self.attenQrCodeContainerId)[0]
      if (!qrcodeDOM) {
        console.error('not found QR dom!')
        return
      }
      // dom.parentElement.removeChild(dom)

      let size = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.65)

      qrcodeDOM.classList.add('qr-shower')
      qrcodeDOM.style.height = size + 'px'
      qrcodeDOM.style.width = size + 'px'

      let timeEl = self.attenTimerCt.el.dom
      timeEl.classList.add('time-label')

      // let qrImg = document.querySelector('img')[0]
      // qrImg =
      // unsafeWindow.document.body.appendChild(dom)

      self._setAttenQrcodeTimer = function (ttl) {
        if (self._attenQrcodeTimer_) {
          clearInterval(self._attenQrcodeTimer_)
        }
        if (window.load_timeout_checker) {
          clearTimeout(window.load_timeout_checker)
        }
        var counter = ttl
        self._attenQrcodeTimer_ = setInterval(function () {
          counter--
          if (self._curAttenQrStatus != self._qrCodeStatus.CREATE) {
            clearInterval(self._attenQrcodeTimer_)
            self._attenQrcodeTimer_ = null
            self._setAttenQrcodeEnable(false)
            return
          }
          if (counter <= 0) {
            clearInterval(self._attenQrcodeTimer_)
            self._attenQrcodeTimer_ = null
            self._setAttenQrcodeEnable(false)
            if (window.pause_auto_refresh) {
              return
            }
            // self._checkAttenQrcodeRefresh(self._attenQrcodeId_)
            self._getAttenQrcode()
            window.load_timeout_checker = setTimeout(() => {
              console.log('timeout...')
              window.location.reload()
            }, 10000)
            return
          }
          self.attenTimerCt.setData({ time: counter })
        }, 1000)
      }
    }
  }, 100)

  const request = (
    method,
    url,
    data = null,
    headers = {},
    callback = (resp) => {
      try {
        data = JSON.parse(resp.responseText)
      } catch (error) {
        data = resp.responseText
      }
      console.log('response:', resp.finalUrl, data)
    }
  ) => {
    console.log(`request: ${url} - ${method}`)
    console.log(`request-data: ${data ? JSON.stringify(data) : data}`)
    GM_xmlhttpRequest({
      url: url,
      method: method,
      headers: headers,
      data: data,
      onload: function (response) {
        callback(response)
      },
      onerror: function (response) {
        callback(response)
      },
    })
  }

  // window.search_btn_task = setInterval(() => {
  //   document.querySelectorAll('a.x-btn').forEach((ele) => {
  //     ele.querySelectorAll('span.x-btn-inner:last-child').forEach((spanEl) => {
  //       // console.log(ele, spanEl.textContent)
  //       if (spanEl.textContent == '考勤') {
  //         clearInterval(window.search_btn_task)
  //         ele.click()
  //         // setInterval(() => {
  //         // x-component clickable-label x-box-item x-component-default
  //         // document.querySelectorAll('.x-component.clickable-label').forEach((e) => {
  //         //   if (e.textContent == '点击刷新') {
  //         //     if (e.parentElement.parentElement.parentElement.style.display != 'none') {
  //         //       // e.click()
  //         //       console.log('refresh QRCode...')
  //         //       let time = parseInt(Date.now() / 1000)
  //         //       request(
  //         //         'get',
  //         //         `https://rfid.fangstar.com:48900/getHostInfo?unixTime=${time}&_dc=${time}&callback=Ext.data.JsonP.callback2`,
  //         //         (resp) => {
  //         //           // console.log(resp)
  //         //           if (resp.responseText) {
  //         //             let hsinfo = JSON.parse(
  //         //               resp.responseText.substring(
  //         //                 'Ext.data.JsonP.callback2('.length,
  //         //                 resp.responseText.length - 1
  //         //               )
  //         //             )
  //         //             // console.log(hsinfo)
  //         //             request(
  //         //               'POST',
  //         //               'https://e.fangstar.net/v2/pc/atten/atten-qrcode/get-shop-atten-qrcode-key',
  //         //               (resp) => {
  //         //                 // console.log(resp)
  //         //                 if (resp.responseText) {
  //         //                   let obj = JSON.parse(resp.responseText)
  //         //                   if (obj.result) {
  //         //                     showQRCode(obj.data)
  //         //                   } else {
  //         //                     console.error(obj.msg)
  //         //                   }
  //         //                 }
  //         //               },
  //         //               `data=${encodeURIComponent(JSON.stringify({ router_data: hsinfo.data }))}`,
  //         //               {
  //         //                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //         //               }
  //         //             )
  //         //           }
  //         //         }
  //         //       )
  //         //     }
  //         //   }
  //         // })
  //         // }, 2000)
  //       }
  //     })
  //   })
  // }, 100)
})()
