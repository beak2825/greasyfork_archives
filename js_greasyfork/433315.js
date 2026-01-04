// ==UserScript==
// @name            javdb_helper
// @version         1.0.0
// @author          洪世贤
// @include         http*://*javdb.com/v/*
// @description     添加推送磁力链接到 aria2 的下载按钮
// @require         https://code.jquery.com/jquery-2.1.4.min.js

// @namespace https://greasyfork.org/users/821273
// @downloadURL https://update.greasyfork.org/scripts/433315/javdb_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/433315/javdb_helper.meta.js
// ==/UserScript==
const BASE_HOST = '' // Aria2 RPC 地址，例如 https://aria2.com:6800/
const TOKEN = '' // Aria2 RPC 密钥
// 下载到 Aria2
const ariaDownload = function (download_url) {
  const url = `${BASE_HOST}/jsonrpc`
  var json_rpc = {
    jsonrpc: '2.0',
    id: '',
    method: 'aria2.addUri',
    params: [
      `token:${TOKEN}`,
      [download_url],
    ]
  };
  $.ajax({
    url: url,
    type: 'POST',
    crossDomain: true,
    processData: false,
    data: JSON.stringify(json_rpc),
    contentType: 'application/json',
    success: function (response) {
      const notifyElement = document.createElement("div")
      notifyElement.id = "notifyElement"
      notifyElement.className = "notification is-success"
      notifyElement.textContent = "发送成功 ~~"
      $(notifyElement).css({ position: 'fixed', right: '45%', bottom: '45%' })
      document.body.append(notifyElement)
      function removeNotify () {
        $("#notifyElement").remove()
      }
      setTimeout(removeNotify, 2000)
    }
  });
}

// 添加推送到 Aria2 按钮
$("#magnets-content td:last-child button").each(
  function () {
    $(this).parent().css('width', 170)
    const ariaButton = document.createElement('button');
    ariaButton.textContent = "发送到 Aria2"
    ariaButton.className = "button is-info is-light is-small "
    const that = $(this).attr('data-clipboard-text')
    ariaButton.onclick = function () {
      ariaDownload(that)
    }
    $(this).before(ariaButton)
  }
)

