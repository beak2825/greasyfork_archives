// ==UserScript==
// @name 全身肥肉的小猪佩奇 - 怪物饲养员 - 公用修改器
// @namespace gwsyygyxgqpeppapig
// @description 怪物饲养员公用修改器
// @author 全身肥肉的小猪佩奇
// @license Parity-6.0.0
// @include *://g8hh.github.io/monster-breeder/
// @include *://gityx.github.io/monster-breeder/
// @require https://code.jquery.com/jquery-3.0.0.js
// @version 1.0.02
// @downloadURL https://update.greasyfork.org/scripts/501326/%E5%85%A8%E8%BA%AB%E8%82%A5%E8%82%89%E7%9A%84%E5%B0%8F%E7%8C%AA%E4%BD%A9%E5%A5%87%20-%20%E6%80%AA%E7%89%A9%E9%A5%B2%E5%85%BB%E5%91%98%20-%20%E5%85%AC%E7%94%A8%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501326/%E5%85%A8%E8%BA%AB%E8%82%A5%E8%82%89%E7%9A%84%E5%B0%8F%E7%8C%AA%E4%BD%A9%E5%A5%87%20-%20%E6%80%AA%E7%89%A9%E9%A5%B2%E5%85%BB%E5%91%98%20-%20%E5%85%AC%E7%94%A8%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

// 佩奇内核开始 作者 全身肥肉的小猪佩奇
var peppapig = {}
peppapig.notice = "<p id=peppapig-notice>哼，我是佩奇，我要提醒你，本程序仅<br>为个人学习使用，请在24小时内删除，哼。</p>"
peppapig.edit = []
peppapig.exec = []
peppapig.style = `
<style>
#peppapig {
z-index: 999999;
position: absolute;
word-spacing: -0.1;
right: 4mm;
top: 4mm;
border: 1mm solid black;
background-color: darkgrey;
padding: 1mm;
color: white;
}
#peppapig-main {
margin: 1mm;
padding: 1mm;
border: 1mm solid black;
background-color: grey;
}
.peppapig-item * {
display: inline-block;
}
.peppapig-button {
border: 0.8mm solid white;
border-radius: 5%;
font-weight: bold;
padding: 0.2mm;
max-height: 6mm;
}
</style>
`
peppapig.html = `
<div id="peppapig">
<h2 id="peppapig-title"></h2>
<p id="peppapig-notice"></p>
<div id="peppapig-main">
<h3>数值编辑</h3>
<div id="peppapig-edits"></div>
<h3>普通动作</h3>
<div id="peppapig-execs"></div>
</div>
</div>
`
peppapig.title = ""
peppapig.peppa = function () {
  $("body").append(peppapig.style + peppapig.html)
  $("#peppapig-title").text(peppapig.title)
  $("#peppapig-notice").html(peppapig.notice)
  peppapig.edit.forEach((item, count) => {
    $("#peppapig-edits").append(`<div class="peppapig-item"><p>${item.name}</p><input type="number" min="${item.min}" max="${item.max}"/><div class="peppapig-button" id="peppapig-edit-submit-button-${count}">提交</div></div>`)
    $(`#peppapig-edit-submit-button-${count}`).on("click", (event) => {
      item.onSubmit(parseInt($(event.target).prev().val()))})
  })
  peppapig.exec.forEach((item, count) => {
    if ("peppa" in item && "george" in item) {
      $("#peppapig-execs").append(`<div class="peppapig-item"><div curr="off" class="peppapig-button" id="peppapig-exec-action-button-${count}">${item.name}</div></div>`)
      peppapig[item.name] = item
      $(`#peppapig-exec-action-button-${count}`).css("color", "#ff0000")
      $(`#peppapig-exec-action-button-${count}`).on("click", (event) => {
        if ($(event.target).attr("curr") == "off") {
          $(event.target).attr("curr", "on")
          $(event.target).css("color", "#00ff00")
          peppapig[$(event.target).text()].peppa()
        } else {
          $(event.target).attr("curr", "off")
          $(event.target).css("color", "#ff0000")
          peppapig[$(event.target).text()].george()
        }
      })
    } else {
      $("#peppapig-execs").append(`<div class="peppapig-item"><div class="peppapig-button" id="peppapig-exec-action-button-${count}">${item.name}</div></div>`)
      peppapig[item.name] = item
      $(`#peppapig-exec-action-button-${count}`).on("click", (event) => {
        peppapig[$(event.target).text()].doAction()
      })
    }
  })
}
//佩奇内核结束
peppapig.edit.push({
  name: "金钱数",
  onSubmit: (data) => {
    unsafeWindow.Cash = data
    console.log("金钱数改为", data)
  }})
peppapig.exec.push({
  name: "超多金钱",
  doAction: () => {
    unsafeWindow.Cash = 1e10
    console.log("金钱数改为超多")
  }
})
peppapig.exec.push({
  name: "金钱不减",
  peppa: () => {
    jqbjInterval = setInterval(jqbj, 10)
  },
  george: () => {
    clearInterval(jqbjInterval)
  }
})
peppapig.title = "怪物饲养员公用修改器"
peppapig.peppa()
oldMoney = 1000
function jqbj() {
  if (Cash < oldMoney) unsafeWindow.Cash = oldMoney
  oldMoney = unsafeWindow.Cash
}