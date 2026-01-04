// ==UserScript==
// @name         QQ Mail File Share
// @namespace    undefined
// @version      0.0.3
// @description  qq邮箱中转站文件分享,秒传原理
// @author       https://github.com/cong99
// @match        *://mail.qq.com/*
// @match        *://cong99.gitee.io/qq_mail_file_share/*
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bootpag/1.0.7/jquery.bootpag.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/392885/QQ%20Mail%20File%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/392885/QQ%20Mail%20File%20Share.meta.js
// ==/UserScript==

(function() {
  'use strict'
  var ConstantValue = {
    current_version: '0.0.3',
    param_start_key: '#QQ_FILE_SHARE_',
    param_start_action_key: '#QQ_FILE_ACTION_',
    tip_page_host: 'cong99.gitee.io',
    tip_page_pathname: '/qq_mail_file_share/',
    tip_page_url: 'https://cong99.gitee.io/qq_mail_file_share/',
    main_page_pathname: '/cgi-bin/frame_html',
    login_page_pathname: '/cgi-bin/login',
    script_page_url: 'https://greasyfork.org/zh-CN/scripts/392885',
    share_link_url: 'https://mail.qq.com/',
    login_info_api_url: 'https://mail.qq.com/cgi-bin/login?fun=psaread&rand=&delegate_url=&target=',
    file_list_api_url: 'https://mail.qq.com/cgi-bin/ftnExs_files?t=ftn.json&s=list&ef=js&listtype=self&up=down&sorttype=createtime',
    file_list_page_size: 10,
    alert_param_error: '分享链接中所带参数错误',
    alert_unlogin_error: '请登录qq邮箱之后再重新点击分享链接',
    alert_get_file_list_error: '获取中转站文件列表失败',
    alert_create_file_error: '创建分享文件失败',
    tip_jump_error: '如果页面没有主动跳转, 点击这里=>',
    tip_jump_update_error: '您的油猴脚本版本过低, 请及时更新=>'
  }

  var $ = $ || window.$
  var encodeBase64 = btoa || window.btoa
  var decodeBase64 = atob || window.atob

  $(function(){
    if (isTipPage()) {
      var supportVerison = ($('#support-min-version').text() || '').trim()
      if (isLowerVerison(ConstantValue.current_version, supportVerison)) {
        var tipALink = `<a href="${ConstantValue.script_page_url}" target="_blank">脚本地址</a>`
        var tipDom = $('#page-tip').html(ConstantValue.tip_jump_update_error + tipALink)
      } else {
        if (location.hash && location.hash.indexOf(ConstantValue.param_start_key) > -1) {
          var qqShareHref = ConstantValue.share_link_url + location.hash
          var tipALink = `<a href="${qqShareHref}" target="_blank">下载地址</a>`
          var tipDom = $('#page-tip').html(ConstantValue.tip_jump_error + tipALink)
          location.href = qqShareHref
        }
      }
    } else {
      if (isShareLinkFirstLoad()) {
        getLoginRedirect()
      } else if (isMainPage()) {
        // console.log('shareParam', shareParam)
        var shareParam = getShareParam()
        var fileShareHelper = new FileShareHelper()
        if (shareParam) {
          // 秒传
          var quickUrl = createQuickUploadUrl(shareParam)

          request({url: quickUrl}).then(res => {
            var responseText = res.response
            var json = {}
            try {
              json = eval(responseText)
            } catch(err) {
              alert(ConstantValue.alert_create_file_error + ' 失败原因: ' + responseText)
            }
            if (Number(json.errcode) === 0) {
              alert('获取到分享文件: ' + shareParam.sName)
            }
          }).catch(err => {
            // 接口一定返回200, 这里写着以防万一而已
            alert(ConstantValue.alert_create_file_error)
          }).finally(() => {
            // 设置hash为空
            location.hash = ''
            // 初始化table
            fileShareHelper.init(true)
          })
        } else {
          fileShareHelper.init()
        }
      }
    }
  })

  // 原始分享链接 加载
  function isShareLinkFirstLoad() {
    var hash = (location.hash || '').trim()
    if (hash && hash.startsWith(ConstantValue.param_start_key)) {
      return true
    } else {
      return false
    }
  }

  // 中途提供跳转的提示页
  function isTipPage() {
    var pathname = location.pathname
    var checkPathName = ConstantValue.tip_page_pathname
    return location.host === ConstantValue.tip_page_host && ( pathname === checkPathName || pathname === (checkPathName + 'index') || pathname === (checkPathName + 'index.html'))
  }

  function isMainPage(){
    var regx = /sid=/g
    return !!location.search.match(regx) && ConstantValue.main_page_pathname === location.pathname
  }

  function getSid() {
    return urlArgs()['sid']
  }

  function urlArgs() {
    var args = {}
    var query = location.search.substring(1)
    var pairs = query.split("&")
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf("=")
      if (pos == -1) {
          continue
      }
      var name = pairs[i].substring(0, pos)
      var value = pairs[i].substring(pos + 1)
      args[name] = value
    }
    return args
  }

  function isLowerVerison(currentVersion, checkVersion) {
    return versionToNum(currentVersion) < versionToNum(checkVersion)
  }

  function versionToNum(version) {
    if (!version) {
      return 0
    }
    var versionList = version.split('.')
    if (versionList.length < 3) {
      return 0
    } else {
      versionList = versionList.map(item => parseInt(item))
      return versionList[0] * 100 * 100 + versionList[1] * 100 + versionList[2]
    }
  }

  function getShareParam() {
    var hash = (location.hash || '').trim()
    if (hash && hash.startsWith(ConstantValue.param_start_action_key)) {
      var paramStr = hash.substring(ConstantValue.param_start_action_key.length)
      var paramJson = {}
      try {
        var paramJsonStr = decodeBase64(paramStr)
        paramJson = JSON.parse(paramJsonStr)
      } catch(err) {
        alert(ConstantValue.alert_param_error)
        return false
      }
      // 校验参数是否正确
      if (paramJson.sName && paramJson.nSize && paramJson.sSHA) {
        paramJson.sName = decodeURIComponent(paramJson.sName)
        return paramJson
      } else {
        alert(ConstantValue.alert_param_error)
        return false
      }
    } else {
      return false
    }
  }

  function getLoginRedirect() {
    request({
      url: ConstantValue.login_info_api_url
    }).then(response => {
      // console.log('response', response.finalUrl)
      var finalUrl = response.finalUrl || ''
      if (finalUrl && finalUrl.indexOf(ConstantValue.main_page_pathname) > -1) {
        location.href = response.finalUrl + replaceStartKey(location.hash)
      } else {
        // 未登录 https://mail.qq.com/cgi-bin/login?fun=psaread&rand=&delegate_url=&target=
        alert(ConstantValue.alert_unlogin_error)
      }
    })
  }

  function isJsonStr(str) {
    if (typeof str == 'string') {
      try {
        JSON.parse(str)
        return true
      } catch(e) {
        // console.log(e)
        return false
      }
    } else {
      return false
    }
  }

  function replaceStartKey(hash) {
    return hash.replace(ConstantValue.param_start_key, ConstantValue.param_start_action_key)
  }

  function request(option) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: option.method || 'GET',
        url: option.url,
        dataType: option.data_type || 'text',
        headers: option.headers || {
        },
        onload: function (response) {
          resolve(response)
        },
        onerror: function (response) {
          reject(response)
        }
      })
    })
  }

  function formatFileSize(fileSize) {
    if (fileSize < 1024) {
      return fileSize + 'B'
    } else if (fileSize < (1024*1024)) {
      var temp = fileSize / 1024
      temp = temp.toFixed(2)
      return temp + 'KB'
    } else if (fileSize < (1024*1024*1024)) {
      var temp = fileSize / (1024*1024)
      temp = temp.toFixed(2)
      return temp + 'MB'
    } else {
      var temp = fileSize / (1024*1024*1024)
      temp = temp.toFixed(2)
      return temp + 'GB'
    }
  }

  function formatTime(timestamp) {
    var date = new Date(timestamp * 1000)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    var h = date.getHours() + ':'
    var m = date.getMinutes() + ':'
    var s = date.getSeconds()
    return Y + M + D + h + m + s
  }

  function formatExpireTime(second) {
    if (second < 0) {
      return '无限期'
    } else if (second < 60) {
      return second + '秒'
    } else if (second < 60 * 60) {
      return Math.ceil(second / 60) + '分钟'
    } else if (second < 60 * 60 * 24) {
      return Math.ceil(second / 60 / 60) + '小时'
    } else {
      return Math.ceil(second / 60 / 60 / 24) + '天'
    }
  }

  function getDownloadUrl(sid, fileItem) {
    return `https://mail.qq.com/cgi-bin/ftnDownload302?sid=${sid}&fid=${fileItem.sFileId}&code=${fileItem.sFetchCode}&k=${fileItem.sKey}`
  }

  function getShareLink(fileItem) {
    var paramJson = {}
    paramJson.sName = encodeURIComponent(fileItem.sName)
    paramJson.nSize = fileItem.nSize
    paramJson.sSHA = fileItem.sSHA
    return ConstantValue.tip_page_url + ConstantValue.param_start_key + encodeBase64(JSON.stringify(paramJson))
  }

  function createQuickUploadUrl(fileItem) {
    var sid = getSid()
    return `https://mail.qq.com/cgi-bin/ftnCreatefile?uin=&ef=js&resp_charset=UTF8&s=ftnCreate&sid=${sid}&dirid=&path=${fileItem.sName}&size=${fileItem.nSize}&sha=${fileItem.sSHA}&sha3=&appid=2&loc=ftnCreatefile,ftnCreatefile,ftnCreate,ftn2`
  }

  function FileShareHelper(){
    this.init = function(showTable) {
      insertPurecss()
      var listPageDiv = createFileListPage()
      var switchBtn = createSwitchBtn(listPageDiv)
      createToolDom()
      if (showTable) {
        switchBtn.click()
      }
    }
    function insertPurecss() {
      var myCssStr = `
        .button-success,
        .button-error,
        .button-warning,
        .button-secondary {
          color: white!important;
          border-radius: 4px;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }
        .button-success {background: rgb(28, 184, 65)}
        .button-error {background: rgb(202, 60, 60)}
        .button-warning {background: rgb(223, 117, 20)}
        .button-secondary {background: rgb(66, 184, 221)}
        .pure-table th {overflow: hidden;text-overflow: ellipsis;white-space: nowrap}
        .w80 {width: 80px; margin: auto;} 
        .w120 {width: 120px; margin: auto;}
        .w160 {width: 160px; margin: auto;}
        .w240 {width: 240px; margin: auto;}
        .w360 {width: 3600px; margin: auto;}
        .bootpag li {display: inline-block;}
        .bootpag a {display: inline-block; height: 35px; width: 35px; background: #FFF; line-height: 35px; margin: 0 5px; font-weight: bold;}
        .bootpag .active a {
          background: rgb(202, 60, 60);
          color: #Fff;
        }
        .modal-mask {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 100;
          background: #333;
          opacity: 0.5;
        }
        .modal-dialog {
          position: fixed;
          top: 25%;
          left: 33%;
          z-index: 101;
          height: 130px;
          width: 500px;
          background: #fff;
          border: 1px solid rgba(0,0,0,.2);
          border-radius: 6px;
          padding: 20px;
        }
        .modal-dialog-title {
          font-size: 16px;
          line-height: 16px;
          font-weight: bold;
          width: 460px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .modal-dialog-content {
          height: 80px;
          line-height: 14px;
          font-size: 14px;
          margin: 10px 0;
          max-width: 100%;
          word-break: break-all;
          overflow-y: auto;
        }
        .modal-dialog-tip {
          color: rgb(28, 184, 65);
        }
        .modal-dialog-close-btn {
          float: right;
        }
      `
      var $pureCss = $(`<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css">`)
      var $myCss = $(`<style type="text/css">${myCssStr}</style>`)
      $('head').append($pureCss)
      $('head').append($myCss)
    }

    function createToolDom() {
      var $modalMask = $(`<div id="modal-mask" class="modal-mask"></div>`)
      var $modalDialog = $(`<div id="modal-dialog" class="modal-dialog">
        <h3 id="modal-dialog-title" class="modal-dialog-title">title</h3>
        <div id="modal-dialog-content" class="modal-dialog-content">content</div>
        <span class="modal-dialog-tip">已将链接复制到剪贴板！</span>
        <button id="modal-dialog-close-btn" class="pure-button button-error modal-dialog-close-btn">关闭</button></div>`)
      $('body').append($modalMask)
      $('body').append($modalDialog)
      $('#modal-mask').hide()
      $('#modal-dialog').hide()
      $('#modal-dialog-close-btn').click(function() {
        $('#modal-mask').hide()
        $('#modal-dialog').hide()
      })
    }

    function openDialog(title, content) {
      $('#modal-dialog-title').html(title)
      $('#modal-dialog-title').attr('title', title)
      $('#modal-dialog-content').html(content)
      $('#modal-mask').show()
      $('#modal-dialog').show()
    }

    function tipInfo(content, type, duration) {
      setTimeout(() => {
        // close
      }, duration || 1000)
    }

    function createSwitchBtn(listPageDiv) {
      var switchToList = '切换至分享列表'
      var switchToOrigin = '切换至原页面'
      var $switchBtn = $(`<button class="pure-button button-error" style="position: fixed;top: 2px;right: 200px;z-index: 99">${switchToList}</button>`)
      $switchBtn.click(function() {
        if ($switchBtn.text() === switchToList) {
          listPageDiv.show()
          $switchBtn.text(switchToOrigin)
        } else {
          listPageDiv.hide()
          $switchBtn.text(switchToList)
        }
      })
      $('body').append($switchBtn)
      return $switchBtn
    }

    function createFileListPage() {
      var $pageDiv = $('<div style="position: fixed;height: 100%;width: 100%;z-index: 98;top: 0;padding-top: 50px; background: #333"></div>')
      $pageDiv.hide()
      var $contentWraperDiv = $('<div style="width: 80%; margin: auto;"></div>')
      var $refreashBtn = $(`<button class="pure-button button-secondary">刷新[上传过文件之后建议刷新]</button>`)
      var $emptyDiv = $(`<div style="text-align: center; color:#fff;"><h1>中转站暂无数据...</h1></div>`)
      $emptyDiv.hide()
      var $paginationDiv = $(`<div style="text-align: center; margin-top: 25px;"></div>`) 
      var $fileTable = $(`<table class="pure-table pure-table-horizontal" style="width: 100%; margin: 10px auto; background: #fff"></table>`)
      var $tableHead = $(`<thead style="text-align: center"><tr><th>文件名</th><th>文件大小</th><th>上传时间</th><th>过期时间</th><th>下载次数</th><th>操作</th></tr></thead>`)
      var $tableBody = $(`<tbody></tbody>`)
      
      $refreashBtn.click(function () {
        // 这边有问题, 分页组件要注销然后再重建---->当前没有好办法注销，所以隐藏该按钮
        // firstLoadData($paginationDiv, $emptyDiv, $tableBody)
      })

      $fileTable.append($tableHead)
      $fileTable.append($tableBody)

      // $contentWraperDiv.append($refreashBtn)
      $contentWraperDiv.append($fileTable)
      $contentWraperDiv.append($emptyDiv)
      $contentWraperDiv.append($paginationDiv)

      $pageDiv.append($contentWraperDiv)

      $('body').append($pageDiv)
      firstLoadData($paginationDiv, $emptyDiv, $tableBody)
      return $pageDiv
    }

    function insertFileListIntoTable(tableBodyDom, fileList) {
      var sid = getSid()
      var fileTrList = fileList.map(fileItem => {
        return `<tr><th><div class="w120" title="${fileItem.sName}">${fileItem.sName}</div></th>
        <th><div class="w80">${formatFileSize(fileItem.nSize)}</div></th>
        <th><div class="w160">${formatTime(fileItem.nCreateTime)}</div></th>
        <th><div class="w80">${formatExpireTime(fileItem.nExpireTime)}</div></th>
        <th><div class="w120">${fileItem.nDownCnt}</div></th>
        <th><div class="w240">
          <button class="button-warning pure-button share-link-btn" filename="${fileItem.sName}" link="${getShareLink(fileItem)}">分享链接</button>
          <a class="button-success pure-button" href="${getDownloadUrl(sid, fileItem)}" target="_blank">下载</a>
        </div></th>
        </tr>`
      })
      tableBodyDom.html('')
      tableBodyDom.append($(fileTrList.join('')))
      $('.share-link-btn').click(function() {
        var title = $(this).attr('filename') + ' 分享地址:'
        var content = $(this).attr('link')
        GM_setClipboard(content, 'text')
        openDialog(title, content)
      })
    }

    function firstLoadData(paginationDivDom, emptyDivDom, tableBodyDom) {
      // 初始获取第一页，创建分页组件
      window.currentPageNum = 1
      requestFileList(window.currentPageNum, tableBodyDom).then(listRes => {
        // 处理dom
        var total = listRes.nTotal || 0
        total = parseInt(total)
        if (total) {
          createPagination(paginationDivDom, total, tableBodyDom)
        } else {
          paginationDivDom.hide()
          emptyDivDom.show()
        }
      })
    }

    function createPagination(paginationDivDom, total, tableBodyDom) {
      var pageSize = ConstantValue.file_list_page_size
      var totalPage = total % pageSize === 0 ? total / pageSize : Math.ceil(total / pageSize)
      paginationDivDom.bootpag({
        total: totalPage,
        page: 1,
        maxVisible: 5,
        leaps: true,
        firstLastUse: true
      }).on('page', function(event, num){
        window.currentPageNum = num
        requestFileList(num, tableBodyDom)
      })
    }

    function requestFileList(page, tableBodyDom) {
      var sid = getSid()
      // 接口页码是以0开始的
      return request({
        url: ConstantValue.file_list_api_url + `&sid=${sid}&page=${page - 1}&pagesize=${ConstantValue.file_list_page_size}`,
        data_type: 'json'
      }).then(response => {
        var responseText = response.responseText
        var json = {}
        try {
          json = eval(responseText)
        } catch(err) {
          alert(ConstantValue.alert_get_file_list_error)
        }
        insertFileListIntoTable(tableBodyDom, json.oFiles)
        // console.log(json)
        return json
      })
    }
  }

})()