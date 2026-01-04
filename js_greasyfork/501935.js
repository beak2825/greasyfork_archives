// ==UserScript==
// @name MediaWiki举报工具
// @namespace mwreport
// @version 1.0.0
// @description MediaWiki页面举报
// @include *://*/wiki/*
// @include *://*/wiki/index.php?title=*
// @include *://*/wiki/index.php?*&title=*
// @include *://*/wiki/index.php/*
// @include *://*/w/*
// @include *://*/w/index.php?title=*
// @include *://*/w/index.php?*&title=*
// @include *://*/w/index.php/*
// @include *://*/index.php?title=*
// @include *://*/index.php?*&title=*
// @include *://*/index.php/*
// @license Parity-6.0.0
// @author 全身肥肉的小猪佩奇
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/501935/MediaWiki%E4%B8%BE%E6%8A%A5%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/501935/MediaWiki%E4%B8%BE%E6%8A%A5%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
if (!unsafeWindow.localStorage["mwRoot"]) {
  unsafeWindow.localStorage["mwRoot"] = prompt("MediaWiki 的根目录是什么", "/")
}
mwRootPath = unsafeWindow.localStorage["mwRoot"] == "/" ? "": unsafeWindow.localStorage["mwRoot"]

const mwXHR = function(host, url, config, body) {
  var xhr = new XMLHttpRequest()
  xhr.open(config.method, location.protocol + "//" + host + "/" + url, config.async)
  xhr.onerror = function() {
    if (xhr.status == 406) {
      config.header.push(["Accept", "*"])
      return mwXHR(host, url, config, body)
    }
    if (xhr.responseText != null) {
      if (config.async) {
        config.onProcessEnd(true, xhr.responseText)
      } else {
        return xhr.responseText
      }
    }
    if (config.async) {
      config.onProcessEnd(false, xhr)
    } else {
      return [false,
        xhr
      ]
    }
  }
  xhr.onload = function() {
    if (config.async) {
      config.onProcessEnd(true, xhr.responseText)
    } else {
      return xhr.responseText
    }
  }
  config.header.forEach((i) => {
    xhr.setRequestHeader.apply(xhr, i)
  })
  xhr.send(body)
  if (!config.async) {
    if (xhr.status == 200) {
      return xhr.responseText
    } else {
      return [false,
        xhr]
    }
  }
}

const mwUseAPI = function(action, parms, cb, body) {
  var parmsStr = parms.map((parm) => `&${parm[0]}=${parm[1]}`).join("")
  return mwXHR(location.host, action != undefined ? mwRootPath + "api.php?action=" + action + parmsStr: mwRootPath + "api.php", {
    method: body == undefined ? "GET": "POST",
    async: cb == undefined ? false: true,
    header: [
      ["MediaWiki", "MediaWiki-User"],
      ["Content-Type", "application/x-www-form-urlencoded"]
    ],
    onProcessEnd: function(success, data) {
      if (success) {
        cb(JSON.parse(data))
      } else {
        cb( {
          batchcomplete: false,
          err: data
        })
      }
    }
  },
    body)
}

const inUserPage = function() {
  return location.href.indexOf("User:") != -1 || unescape(location.href).indexOf("用户:") != -1
}

const isSysop = function (username) {
  const queryResult = JSON.parse(mwUseAPI("query", [
    ["list", "users"],
    ["ususers", username],
    ["usprop", "rights|groups"],
    ["format", "json"]
  ])).query.users[0]
  return queryResult.rights.includes("delete") || queryResult.rights.includes("block") || queryResult.groups.includes("sysop")

}

const report = function(pageTitle) {
  var mwCSRFToken = escape(JSON.parse(mwUseAPI("query",
    [
      ["meta",
        "tokens"
      ],
      ["type",
        "csrf"
      ],
      ["format",
        "json"
      ]
    ])).query.tokens.csrftoken)
  if (!unsafeWindow.localStorage["sysopName"]) return alert("未记录管理员，无法举报，请打开任意管理员的用户页面以记录")
  const sysopUsername = unsafeWindow.localStorage["sysopName"]
  const rvInfo = JSON.parse(mwUseAPI("query", [
    ["prop", "revisions"],
    ["titles", pageTitle],
    ["rvprop", "ids|timestamp"],
    ["format", "json"]])).query.pages
  const rvInfo2 = JSON.parse(mwUseAPI("query", [
    ["prop", "revisions"],
    ["titles", "User:" + sysopUsername],
    ["rvprop", "ids|timestamp"],
    ["format", "json"]])).query.pages
  const pgID = Object.keys(rvInfo)[0]
  const rvID = rvInfo[pgID].revisions[0].revid
  const rvTime = rvInfo[pgID].revisions[0].timestamp
  const pgID2 = Object.keys(rvInfo2)[0]
  const rvID2 = rvInfo2[pgID2].revisions[0].revid
  const rvTime2 = rvInfo2[pgID2].revisions[0].timestamp
  mwCSRFToken = mwCSRFToken.replace("+", "%2B")
  mwUseAPI(undefined,
    [],
    () => {},
    "action=edit&title=" + pageTitle + "&section=new&sectiontitle=举报页面&text=@[[User:" + sysopUsername + " ]] 您好，此页面违反了维基的规则，我在此向您举报。&basetimestamp=" + rvTime + "&baserevid=" + rvID + "&starttimestamp=now&watchlist=watch&format=json&token=" + mwCSRFToken)
  mwUseAPI(undefined,
    [],
    () => {},
    "action=edit&title=User:" + sysopUsername + "&section=new&sectiontitle=举报页面&text=您好，页面[[" + pageTitle + "]]违反了维基的规则，我在此向您举报。&basetimestamp=" + rvTime2 + "&baserevid=" + rvID2 + "&starttimestamp=now&watchlist=watch&format=json&token=" + mwCSRFToken)
}
const pgTitle = document.querySelector(".mw-page-title-main").innerText
if (inUserPage()) {
  const usName = pgTitle.replace("用户:", "").replace("User:", "")
  if (isSysop(usName)) unsafeWindow.localStorage["sysopName"] = usName
}
var reportButton = document.createElement("li")
reportButton.onclick = () => {
  report(pgTitle)
}
reportButton.classList.add("mw-list-item")
reportButton.setAttribute("id", "ca-report")
var reportLink = document.createElement("a")
reportLink.setAttribute("title", "举报该页面")
reportLink.setAttribute("href", "javascript:[]")
var reportText = document.createElement("span")
reportText.innerText = "举报"
reportLink.appendChild(reportText)
reportButton.appendChild(reportLink)
document.querySelector("#p-cactions .vector-menu-content .vector-menu-content-list").appendChild(reportButton)
debugger