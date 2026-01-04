// ==UserScript==
// @name              94list-laravel-tampermonkey
// @namespace         https://github.com/huankong233/94list-laravel-tampermonkey
// @version           0.0.4
// @author            huan_kong
// @description       对接 94list-laravel 的油猴脚本
// @license           MIT
// @homepage          https://github.com/huankong233/94list-laravel-tampermonkey
// @supportURL        https://github.com/huankong233/94list-laravel-tampermonkey
// @icon              https://huankong.top/favicon.ico
// @match             *://pan.baidu.com/disk/main*
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/home*
// @connect           localhost
// @connect           127.0.0.1
// @connect           *
// @require           https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
// @require           https://registry.npmmirror.com/sweetalert2/11.10.6/files/dist/sweetalert2.all.min.js
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @grant             GM_setClipboard
// @grant             GM_registerMenuCommand
// @grant             GM_setValue
// @grant             GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/490248/94list-laravel-tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/490248/94list-laravel-tampermonkey.meta.js
// ==/UserScript==

$(async function () {
  GM_registerMenuCommand('⚙️ 设置', () => {
    Swal.fire({
      title: '⚙️ 设置',
      html: `<div>
        <p>94list-laravel-site-url</p>
        <input type="text" id="siteUrl" value=${GM_getValue('94list-laravel-site-url', '')}>
        <p>94list-laravel-site-password</p>
        <input type="text" id="sitePassword" value=${GM_getValue(
          '94list-laravel-site-password',
          ''
        )}>
        <p>94list-laravel-site-aria2-host</p>
        <input type="text" id="siteAriaHost" value=${GM_getValue(
          '94list-laravel-site-aria2-host',
          ''
        )}>
        <p>94list-laravel-site-aria2-secret</p>
        <input type="text" id="siteAriaSecret" value=${GM_getValue(
          '94list-laravel-site-aria2-secret',
          ''
        )}>
      </div>`,
      icon: 'info',
      showConfirmButton: true
    }).then(() => {
      GM_setValue('94list-laravel-site-url', document.querySelector('#siteUrl').value)
      GM_setValue('94list-laravel-site-password', document.querySelector('#sitePassword').value)
      GM_setValue('94list-laravel-site-aria2-host', document.querySelector('#siteAriaHost').value)
      GM_setValue(
        '94list-laravel-site-aria2-secret',
        document.querySelector('#siteAriaSecret').value
      )
      location.reload()
    })
  })

  function setLocalStorage(key, url) {
    GM_setValue(key, url)
    location.reload()
  }

  const request = params => {
    return new Promise((resolve, reject) =>
      GM_xmlhttpRequest({
        ...params,
        onload: res => (res.status === 200 ? resolve(res) : reject(res)),
        onerror: err => reject(err)
      })
    )
  }

  const getPt = () => {
    if (document.location.href.indexOf('.baidu.com/disk/home') > 0) return 'home'
    if (document.location.href.indexOf('.baidu.com/disk/main') > 0) return 'main'
    return ''
  }
  const pt = getPt()

  GM_addStyle(
    `input{outline-style:none;border:1px solid #c0c4cc;border-radius:5px;width:100%;height:100%;padding:0;padding:10px 15px;box-sizing:border-box}.hk table{width:100%;border-collapse:collapse;margin:25px 0;font-size:.9em;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;min-width:400px;box-shadow:0 0 20px rgba(0,0,0,0.15)}.hk thead tr{background-color:#009879;color:#fff;text-align:center;}.hk .line{line-height:60px}.hk th,.hk td{padding:12px 15px;width:138px;height:85px;overflow:overlay;display:inline-block;}.hk tbody tr{border-bottom:1px solid #ddd}.hk tbody tr:nth-of-type(even){background-color:#f3f3f3}.hk td{height:100px;}.hk td.line{line-height:75px;}.homeButton button{display: inline-block;line-height: 1;white-space: nowrap;cursor: pointer;background: #fff;border: 1px solid #dcdfe6;color: #606266;-webkit-appearance: none;text-align: center;-webkit-box-sizing: border-box;box-sizing: border-box;outline: 0;margin: 0;-webkit-transition: .1s;transition: .1s;font-weight: 500;padding: 12px 36px;font-size: 14px;border-radius: 4px;height: 32px;padding: 8px 12px;font-size: 14px;color: #fff;background-color: #ff436a;border-color: #ff436a;border-radius: 3px;text-transform: none;outline: none;border: none;margin-right:none !important;}.homeButton{display: inline-block;}`
  )

  if (pt === 'home') {
    $('.tcuLAu').prepend(
      '<div class="homeButton wp-s-agile-tool-bar__h-group"><button style="margin-right:10px;" id="94listDownBtn" class="u-button nd-file-list-toolbar-action-item is-need-left-sep u-button--primary u-button--default u-button--small is-has-icon  u-button--danger"><i class="iconfont icon-download"></i><span>94list-laravel</span></button></div>'
    )
    GM_addStyle(
      `.hk th,.hk td{width:108px !important;height:60px !important;}.hk td{height:75px !important;}`
    )
  } else if (pt === 'main') {
    $('.wp-s-agile-tool-bar__header.is-header-tool').prepend(
      '<div class="wp-s-agile-tool-bar__h-group"><button style="margin-right:10px;" id="94listDownBtn" class="u-button nd-file-list-toolbar-action-item is-need-left-sep u-button--primary u-button--default u-button--small is-has-icon  u-button--danger"><i class="iconfont icon-download"></i><span>94list-laravel</span></button></div>'
    )
  }

  const siteUrl = GM_getValue('94list-laravel-site-url')
  const password = GM_getValue('94list-laravel-site-password')

  if (!siteUrl | (siteUrl === 'null')) {
    await Swal.fire({
      title: '请先设置 94list-laravel-site-url',
      html: `<input type="text" id="siteUrl">`
    })
    setLocalStorage('94list-laravel-site-url', document.querySelector('#siteUrl').value)
  }

  const serevrConfig = await request({
    method: 'POST',
    url: siteUrl + '/api/user/getConfig',
    responseType: 'json'
  })
    .then(res => res.response.data)
    .catch(_ => {
      Swal.fire({
        icon: 'error',
        title: '系统提示',
        text: '请求服务器失败!'
      }).then(_ => setLocalStorage('94list-laravel-site-url', null))
    })

  if (serevrConfig.havePassword && !password | (password === 'null')) {
    await Swal.fire({
      title: '请先设置 94list-laravel-site-password',
      html: `<input type="text" id="sitePassword">`
    })
    setLocalStorage('94list-laravel-site-password', document.querySelector('#sitePassword').value)
  }

  const match = /"bdstoken":"(\w+)"/.exec($('html').html())
  if (match === null) {
    Swal.fire({
      icon: 'error',
      title: '系统提示',
      text: '未知错误!'
    }).then(_ => location.reload())
  }
  const bdstoken = match[1]

  const getSelectedList = function () {
    if (pt === 'home') {
      return require('system-core:context/context.js').instanceForSystem.list.getSelected()
    } else if (pt === 'main') {
      let mainList = document.querySelector('.nd-main-list')
      if (!mainList) mainList = document.querySelector('.nd-new-main-list')
      return mainList.__vue__.selectedList
    }
  }

  $('#94listDownBtn').on('click', async function () {
    if ($('tr.selected img[src*="ceH8M5EZYnGhnBKRceGqmaZXPPw2xbO+1x"]').length > 0) {
      Swal.fire({
        icon: 'error',
        title: '系统提示',
        text: '不支持文件夹解析'
      })
      return
    }
    const selectedIds = getSelectedList().map(v => v.fs_id)
    if (selectedIds.length === 0) {
      Swal.fire({
        title: '系统提示',
        text: '请选择需要下载的文件',
        icon: 'error'
      })
      return
    }
    function getRangeCode(len = 6) {
      const orgStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let returnStr = ''
      for (let i = 0; i < len; i++) {
        returnStr += orgStr.charAt(Math.floor(Math.random() * orgStr.length))
      }
      return returnStr
    }
    Swal.fire({
      title: false,
      text: '服务器请求中',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    })
    const pwd = getRangeCode(4)
    const shareLink = await $.ajax({
      method: 'post',
      url: `https://pan.baidu.com/share/set?channel=chunlei&bdstoken=${bdstoken}period=1&pwd=${pwd}&eflag_disable=true&channel_list=%5B%5D&schannel=4&fid_list=[${selectedIds}]`
    })
    if (shareLink.show_msg) {
      Swal.fire({
        title: '系统提示',
        text: shareLink.show_msg,
        icon: 'error'
      })
      return
    }
    const url = shareLink.link
    const shareFileList = await request({
      method: 'post',
      url: siteUrl + '/api/user/getFileList',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        dir: '/',
        url,
        pwd,
        password
      }),
      responseType: 'json'
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: '系统提示',
        text: err.response.message
      }).then(_ =>
        err.response.message == '密码不匹配'
          ? setLocalStorage('94list-laravel-site-password', null)
          : location.reload()
      )
    })
    const shareSign = await request({
      method: 'post',
      url: siteUrl + '/api/user/getSign',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        uk: shareFileList.response.data.uk,
        shareid: shareFileList.response.data.shareid,
        password
      }),
      responseType: 'json'
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: '系统提示',
        text: err.response.message
      }).then(_ =>
        err.response.message == '密码不匹配'
          ? setLocalStorage('94list-laravel-site-password', null)
          : location.reload()
      )
    })
    const downLinks = await request({
      method: 'post',
      url: siteUrl + '/api/user/downloadFiles',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        fs_ids: selectedIds,
        timestamp: shareSign.response.data.timestamp,
        uk: shareFileList.response.data.uk,
        sign: shareSign.response.data.sign,
        randsk: shareFileList.response.data.randsk,
        shareid: shareFileList.response.data.shareid,
        password
      }),
      responseType: 'json'
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: '系统提示',
        text: err.response.message
      }).then(_ =>
        err.response.message == '密码不匹配'
          ? setLocalStorage('94list-laravel-site-password', null)
          : location.reload()
      )
    })
    Swal.close()

    Swal.fire({
      html: `<h3>当前下载UA: ${serevrConfig.userAgent}</h3><div class="hk"><table><thead><tr><th class="line">文件名</th><th class="line">地址</th><th class="line">操作</th></tr></thead><tbody></tbody></table></div>`
    })

    downLinks.response.data.forEach(link => {
      $('.swal2-html-container .hk table tbody').append(`
      <tr>
          <td class="line">${link.server_filename}</td>
          <td>${link.dlink}</td>
          <td><button class="aria" data-dlink="${link.dlink}" data-filename="${link.server_filename}">发送到Aria2</button><button class="idm" data-dlink="${link.dlink}" data-filename="${link.server_filename}">尝试调用IDM</button><button class="copy" data-dlink="${link.dlink}">复制链接</button></td>
      </tr>`)
    })

    $('.hk button.aria').on('click', async function () {
      let aria2Host = GM_getValue('94list-laravel-site-aria2-host')
      if (!aria2Host || aria2Host === 'null') {
        await Swal.fire({
          title: '请先设置 94list-laravel-site-aria2-host',
          html: `<input type="text" id="siteAriaHost">`
        })

        aria2Host = document.querySelector('#siteAriaHost').value
        GM_setValue('94list-laravel-site-aria2-host', aria2Host)
      }

      let aria2Secret = GM_getValue('94list-laravel-site-aria2-secret')

      await request({
        method: 'post',
        url: aria2Host,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          jsonrpc: '2.0',
          id: '94list-laravel-tampermonkey',
          method: 'aria2.addUri',
          params: [
            `token:${aria2Secret}`,
            [$(this).data('dlink')],
            {
              out: $(this).data('filename'),
              header: [`User-Agent: ${serevrConfig.userAgent}`]
            }
          ]
        })
      }).catch(err => alert('请求aria2失败,请检查控制台输出'))
    })

    $('.hk button.idm').on('click', async function () {
      const blob = await request({
        method: 'get',
        url: $(this).data('dlink'),
        responseType: 'blob',
        headers: { 'User-Agent': serevrConfig.userAgent }
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = $(this).data('filename')
      a.click()
      URL.revokeObjectURL(url)
    })

    $('.hk button.copy').on('click', function () {
      GM_setClipboard($(this).data('dlink'), 'dlink')
    })
  })
})
