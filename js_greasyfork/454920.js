// ==UserScript==
// @name        Fix GoogleCitation
// @namespace   Violentmonkey Scripts
// @match       https://scholar.google.com/*
// @match       https://usercontent.beijingbang.top/*
// @require     https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @run-at document-end
// @version     2.0
// @author      leeechsh
// @license        MIT
// @description 2022/11/16 15:03:39
// @downloadURL https://update.greasyfork.org/scripts/454920/Fix%20GoogleCitation.user.js
// @updateURL https://update.greasyfork.org/scripts/454920/Fix%20GoogleCitation.meta.js
// ==/UserScript==

function clipboardCopy (text) {
  if (navigator.clipboard) { // 如果浏览器兼容该 API
    return navigator.clipboard.writeText(text).catch(function (err) {
      throw (err !== undefined ? err : new DOMException('The request is not allowed', 'NotAllowedError'))
    })
  }

  // 或者使用 document.execCommand()

  // 把需要复制的文本放入 <span>
  const span = document.createElement('span')
  span.textContent = text

  // 保留文本样式
  span.style.whiteSpace = 'pre'

  // 把 <span> 放进页面
  document.body.appendChild(span)

  // 创建选择区域
  const selection = window.getSelection()
  const range = window.document.createRange()
  selection.removeAllRanges()
  range.selectNode(span)
  selection.addRange(range)

  // 复制文本到剪切板
  let success = false
  try {
    success = window.document.execCommand('copy')
  } catch (err) {
    console.log('error', err)
  }

  // 清除战场
  selection.removeAllRanges()
  window.document.body.removeChild(span)

  return success
    ? Promise.resolve()
    : Promise.reject(new DOMException('The request is not allowed', 'NotAllowedError'))
}

function copycitation() {
    async function cccopy() {
      /* Get the text field */
      var text = $("pre").text();
      await clipboardCopy(text);
      alert('已复制到剪贴板!');
    }
    cccopy();
}

function replaceBibUrl() {
    let prepareFindPaper = $("div.gs_r");
    prepareFindPaper.each(function (k, v) {
        let delay = Math.floor(Math.random() * (2000 - 1000 + 1) + 1500);
        let paperClassID = "cit_" + Math.floor(Math.random() * 10000);
        let prepareFindPaper = $(this);

        let code = prepareFindPaper.attr("data-cid");
        let url = "https://" + document.location.hostname + "/scholar?q=info:" + code +
            ":scholar.google.com/&output=cite&scirp=0&hl=en";

        let node = prepareFindPaper.find("div.gs_fl");
        node.prepend($('<a class="gs_or_btn ' + paperClassID + '" title="' + url + '">Citetex</a>'));

        $("." + paperClassID).on("click", null, url, function (e) {
            let code = prepareFindPaper.attr("data-cid");
            let url = "https://" + document.location.hostname + "/scholar?q=info:" + code +
                ":scholar.google.com/&output=cite&scirp=0&hl=en";
            $.ajax({
                url: url,
                method: "get"
            }).then(function (resp) {
                console.log(resp);
                var citeUrl = $(resp)[1].firstChild.href.replace(/^https:\/\/[^/]+\//, "https://usercontent.beijingbang.top/");
                console.log(citeUrl)
                window.open(citeUrl, '_blank');
            });
        })
    })
}

var domain = document.domain;
if (domain == "usercontent.beijingbang.top") {
    copycitation();
} else {
    replaceBibUrl();
}
