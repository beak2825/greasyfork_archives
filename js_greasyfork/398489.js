// ==UserScript==
// @name         baidu-netdisk-rename
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Renaming tool for web-based version of baidu netdisk. It supports batch renaming. 百度网盘的重命名小工具，支持批量重命名。
// @author       neotan
// @match        https://pan.baidu.com/disk/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     purecss https://cdn.jsdelivr.net/npm/purecss@1.0.1/build/pure-min.min.css
// @resource     responsiveCss https://cdn.jsdelivr.net/npm/purecss@1.0.1/build/grids-responsive-min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/398489/baidu-netdisk-rename.user.js
// @updateURL https://update.greasyfork.org/scripts/398489/baidu-netdisk-rename.meta.js
// ==/UserScript==

;(async function () {
  'use strict'

  // ------------------- Utilities START ------------------- //
  function getMeta() {
    var filemanagerUrl
    var taskqueryUrl

    try {
      var scriptTag = $('script').filter((i, ctt) => {
        return !ctt.src && ctt.text.includes('"bdstoken":"')
      })[0]
      var bdstoken = scriptTag.text.match(/(?<=bdstoken"\s*:\s*")([A-Za-z0-9]*)(?=")/).pop().trim()
      
      if (bdstoken) {
        filemanagerUrl = `https://pan.baidu.com/api/filemanager?opera=rename&async=2&onnest=fail&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken}&clienttype=0`
        taskqueryUrl = `https://pan.baidu.com/share/taskquery?taskid=1052678625270016&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken}&clienttype=0`
      }
    } catch (e) {
      console.error(e)
    }

    return {
      filemanagerUrl,
      taskqueryUrl,
    }
  }

  function getFileNames() {
    var nodes = document.querySelectorAll('.file-name .text a')
    return [...nodes].map(n => n.textContent)
  }

  function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  function createFileName(oldName, searchStr, replaceStr, applyToAll, caseSenstive, useRegexp = true) {
    var g = applyToAll ? 'g' : ''
    var i = caseSenstive ? '' : 'i'
    var rex = new RegExp(escapeRegExp(searchStr), g + i)

    return oldName.replace(rex, replaceStr)
  }

  function getCWD() {
    var addr = window.location.href
    var urlParams = new URLSearchParams(addr.substring(addr.indexOf('?') + 1))
    var cwd = urlParams.get('path')
    if (!cwd) {
      throw new Error('Can\'t get current working directory.')
    }
    return cwd
  }

  function getBatchActions(cwd, batchText, applyToAll = true, caseSenstive = false, separator) {
    if (batchText && separator) {
      return batchText
        .split('\n')
        .map(line => {
          line = line.trim()
          var namingPair = line.split(separator)
          if (namingPair && namingPair.length === 2) {
            return getAction(cwd, namingPair[0].trim(), namingPair[0].trim(), namingPair[1].trim(), applyToAll, caseSenstive)
          }
        })
        .filter(action => action)
    }
  }

  function getAction(cwd, fileName, searchStr, replaceStr, applyToAll = true, caseSenstive = false) {
    var path = cwd + '/' + fileName
    var newname = createFileName(fileName, searchStr, replaceStr, applyToAll, caseSenstive)

    return fileName !== newname ? {path, newname} : ''
  }

  function getFormData(actions) {
    var formData = new FormData()
    formData.append('filelist', JSON.stringify(actions))

    return formData
  }

  function showMsg(msg) {
    $('.msg').html(msg).show('slow').delay(10000).hide(500)
  }

  function postData(url, formData) {
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .catch(err => console.error('Error:', err))
      .then(res => console.log('Response:', res))
  }

  function toBatchMode() {
    $('.single-mode').map(function () {
      $(this).slideUp(() => {
        $('.batch-mode').map(function () {
          $(this).slideDown()
        })
      })
    })

  }

  function toSingleMode() {
    $('.batch-mode').map(function () {
      $(this).slideUp(() => {
        $('.single-mode').map(function () {
          $(this).slideDown()
        })
      })
    })
  }

  // ------------------- Utilities END ------------------- //

  // ------------------- Main Functions declaration START ------------------- //
  var msg = ''
  var isBatchMode = $('.batch-switcher').prop('checked', true)
  var customCss = `
        .pure-g {
          padding: 5px;
          display: flex;
          align-items: center;
          background: #f1f1f1;
        }
        .netdisk-rename{
          display: flex;
        }
        .rename-form {
          width: 100%;
          display: none;
        }
        .rename-form > label {
          white-space: nowrap;
        }
        .rename-btn-wrapper > label:not(:first-child) {
            margin-left: 10px;
        }
        .rename-form__input-text {
          width: 80%;
        }
        .rename-btn-wrapper > label:not(:last-child) {
          margin-right: 10px;
        }
        .msg{
          background: #b1e279;
          padding: 8px 10px;
          display: none;
        }
        .toggle-btn{
          font-size: 10px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2147483647;
          width: 26px;
          transition: all .2s;
        }
        .rename-btn{
          width: 100%;
        }
        .rename-btn-wrapper{
           display: flex;
        }
        .author-label{
          font-size: 1.3rem;
        }
        .batch-mode{
           display: none;
        }
        .enlarge {
          width: 100px;
          height: 30px;
          font-size: 12px;
        }
`
  var domHtml = `
<div class="netdisk-rename">
  <button class="pure-button pure-button-primary toggle-btn" title="Toggle Netdisk renaming panel">R</button>
  <form class="pure-g pure-form rename-form">
    <div class="rename-btn-wrapper">
       <label class="pure-u-1 pure-button">Case Senstive? <input type="checkbox" name="caseSenstive" checked></label>
       <label class="pure-u-1 pure-button">Apply to all? <input type="checkbox" name="applyToAll" checked></label>
       <label class="pure-u-1 pure-button">Batch <input type="checkbox" class="batch-switcher" name="isBatchMode"></label>
       <button class="pure-button pure-button-primary rename-btn" type="submit">Rename</button>
       <a class="pure-link author-label" href="https://greasyfork.org/en/scripts/398489-baidu-netdisk-rename">&#9784;</a>
    </div>
    <div class="single-mode">
      <label class="pure-u-8-24">Replace: <input class="rename-form__input-text" type="text" name="searchStr"/></label>
      <label class="pure-u-8-24">with: <input class="rename-form__input-text" type="text" name="replaceStr"/></label>
      <label class="pure-u-7-24">Extension: <input class="rename-form__input-text" type="text" name="extention" size=10 value=".mp4" placeholder="all files"/></label>
    </div>
    <div class="batch-mode">
      <label class="pure-u-8-24">Separator: <input class="rename-form__input-text" type="text" name="separator" value="###"/></label>
      <label class="pure-u-1">
        <textarea class="pure-u-1" name="batchText" rows="4">
           oldName1 ### newName1
           oldName2 ### newName2
        </textarea>
      </label>
    </div>
    <div class="pure-u-1 msg">${msg}</div>
  </form>
</div>
`

  function main() {
    GM_addStyle(GM_getResourceText('purecss'))
    GM_addStyle(GM_getResourceText('responsiveCss'))
    GM_addStyle(customCss)
    $('#layoutMain').prepend($(domHtml))

    // initiate listeners
    $('.toggle-btn').hover(function () {
      $(this).addClass('enlarge').text('Rename Panel')
    }, function () {
      $(this).removeClass('enlarge').text('R')
    })
    $('.toggle-btn').click(() => $('.rename-form').slideToggle('fast'))
    $('.rename-form').submit(function (event) {
      event.preventDefault()
      var urlParams = new URLSearchParams($(this).serialize())
      var searchStr = urlParams.get('searchStr')
      var replaceStr = urlParams.get('replaceStr')
      var extention = urlParams.get('extention')
      var applyToAll = urlParams.get('applyToAll')
      var caseSenstive = urlParams.get('caseSenstive')

      var isBatchMode = urlParams.get('isBatchMode')
      var batchText = urlParams.get('batchText')
      var separator = urlParams.get('separator')

      var fileNames = getFileNames().filter(name => name.endsWith(extention))
      var cwd = getCWD()

      var actions = []
      if (isBatchMode) {
        actions = getBatchActions(cwd, batchText, applyToAll = true, caseSenstive = false, separator)
      } else {
        actions = fileNames.map(fileName => getAction(cwd, fileName, searchStr, replaceStr, applyToAll, caseSenstive)).filter(action => action)
      }

      var formData = getFormData(actions)
      var {filemanagerUrl, taskqueryUrl} = getMeta()

      if (actions.length > 0 && filemanagerUrl && taskqueryUrl) {
        postData(filemanagerUrl, formData)
        postData(taskqueryUrl, formData)
        showMsg(`Tried renaming ${actions.length} files, please <a onclick="location.reload()" style="cursor:pointer;">Refresh</a> for result.`)
      } else {
        showMsg('Nothing matched!')
      }
    })

    $('.batch-switcher').change(function () {
      if (this.checked) {
        toBatchMode()
      } else {
        toSingleMode()
      }
    })
    console.log('baidu-netdisk-rename initiated!')
  }

  // ------------------- Main Functions declaration END ------------------- //

  // ------------------- Main Functions execution START ------------------- //
  main()
})()
