// ==UserScript==
// @name        Steam Comments ErrorProofing
// @namespace   steam
// @author      伟大鱼塘
// @description 防止留言被误删
// @include     https://steamcommunity.com/
// @match       https://steamcommunity.com/*
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/369220/Steam%20Comments%20ErrorProofing.user.js
// @updateURL https://update.greasyfork.org/scripts/369220/Steam%20Comments%20ErrorProofing.meta.js
// ==/UserScript==

{
  const appendModal = fun => {
    const html =
      '<div id="del_confirm_modal" class="newmodal" style="position: fixed;z-index: 1000; max-width: 1826px;left: 681px;top: 346px;">' +
      '<div class="modal_top_bar"></div>' +
      '<div class="newmodal_header_border">' +
      '<div class="newmodal_header">' +
      '<div class="newmodal_close"></div>' +
      '<div class="title_text">确认删除？</div>' +
      '</div>' +
      '</div>' +
      '<div class="newmodal_content_border">' +
      '<div class="newmodal_content" style="max-height: 816px">' +
      '<div class="profileedit_SaveCancelButtons_2KJ8a">' +
      '<button type="button" id="confirm_btn" class="DialogButton _DialogLayout Primary">确认</button>' +
      '<button type="button" class="DialogButton _DialogLayout Secondary">取消</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'
    document.querySelector('body').insertAdjacentHTML('afterBegin', html)
    bindEvent(fun)
  }

  const bindEvent = fun => {
    const modal = document.querySelector('#del_confirm_modal')
    modal.addEventListener('click', e => {
      const t = e.target
      if (t.id == 'confirm_btn') {
        const eventFun = new Function(fun)
        eventFun()
      }
      document.querySelector('body').removeChild(modal)
    })
  }

  const resetClickEvent = () => {
    const del_nodeList = document.querySelectorAll('.actionlink')
    for (let el of del_nodeList) {
      const fun = el.href.substring(11)
      el.href = 'javascript:;'
      el.addEventListener('click', () => {
        appendModal(fun)
      })
    }
  }

  const obs = () => {
    const targetList = document.querySelectorAll('.commentthread_comments')
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        resetClickEvent()
      })
    })
    for (let el of targetList) {
      observer.observe(el, {
        childList: true,
        subtree: true,
      })
    }
  }

  resetClickEvent()
  obs()
}