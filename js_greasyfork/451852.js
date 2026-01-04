// ==UserScript==
// @name         SeeAuthorWanted
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  filter km wiki record by author
// @match        https://km.sankuai.com/
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @icon         data:image/jpeg;base64,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
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451852/SeeAuthorWanted.user.js
// @updateURL https://update.greasyfork.org/scripts/451852/SeeAuthorWanted.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const inputStyle = `box-sizing: border-box;
    margin: 0;
    font-variant: tabular-nums;
    list-style: none;
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    padding: 4px 11px;
    color: #000000d9;
    font-size: 14px;
    line-height: 1.5715;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: all .3s`
  const btnStyle = `line-height: 1.5715;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    border-left: none;
    box-shadow: 0 2px #00000004;
    cursor: pointer;
    transition: all .3s cubic-bezier(.645,.045,.355,1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: manipulation;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 2px;
    color: #000000d9;
    border-color: #d9d9d9;
    background: #fff;`

  $(`<div style="position:fixed;bottom:500px;left:30px;">
<div style="display:flex;align-items:center;"><input placeholder="请输入要筛选的名字" type="text" class="ql-input" style="${inputStyle}"/><div class="ql-filter" style="${btnStyle}">筛选</div><div class="ql-reset" style="${btnStyle}">重置</div></div><div style="color:#0000d9;font-size:12px;margin-top:8px;">加载后需要再次筛选</div>
  </div>`).appendTo($('body'))

  let nameRows = []
  let timer = null
  $('.ql-filter').click(() => {
    clearTimeout(timer)
    setTimeout(() => {
      try {
        const filterName = $('.ql-input').val()
        if (!filterName) {
          alert('请输入要筛选的名字')
          return
        }
        const bodies = $('.sp-table-list-body')
        let target = null
        if (bodies.length === 1) {
          target = bodies[0]
        } else {
          const activeTab = $($('.ant-tabs-tab.ant-tabs-tab-active')[1]).text()
          if (activeTab.includes('编辑')) {
            target = bodies[1]
          } else {
            target = bodies[0]
          }
        }
        const tableRows = $(target).children()
        const names = tableRows.find('.text-ov-wrapper')
        nameRows = names
        for (let i = 0; i < names.length; i++) {
          const name = $(names[i])
          if (!name.text().includes(filterName)) {
            name.parent().parent().hide()
          } else {
            name.parent().parent().show()
          }
        }
      } catch (e) {}
    }, 100)
  })
  $('.ql-reset').click(() => {
    clearTimeout(timer)
    setTimeout(() => {
      try {
        for (let i = 0; i < nameRows.length; i++) {
          const name = $(nameRows[i])
          name.parent().parent().show()
        }
        $('.ql-input').val('')
      } catch (e) {}
    })
  })
})()
