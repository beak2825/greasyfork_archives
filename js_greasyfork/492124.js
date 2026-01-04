// ==UserScript==
// @name        复制标题超链接
// @namespace   tapd
// @match       https://www.tapd.cn/*/*/*/view*
// @grant       none
// @version     1.1
// @author      wangy
// @license           MIT
// @description 2024/4/9 15:01:15

// @downloadURL https://update.greasyfork.org/scripts/492124/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/492124/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


function addTitleLink(event) {
  let url = document.location.href
  let titleSpan = $('#story_name_view,#task_name_view,#bug_title_view').children('.editable-value')
  let title = titleSpan.attr('title')

  if(title === undefined || title == ''){
    // 处理标题异步加载的场景，如果取不到标题则等500ms后重试
    setTimeout(addTitleLink, 500)
    return
  }

  let a = $('<a id="title_link"/>')
            .attr('href', url)
            .css('font-size', 14)
            .css('background-color', '#fff')
            .text(title)
            .hide()
  let markdown = '[' + title + ']('+ url +')'

  $('<li />')
            .addClass('clipboard-btn')
            .attr('data-clipboard-text', markdown)
            .append($('<div>')
              .text('复制标题markdown'))
            .appendTo('.copy-info-link .dropdown-menu>ul')

  let b2 = $('<a href="javascript:"/>')
            .addClass('btn')
            .css('margin-left', 10)
            .append($('<span>')
              .text('设置标题可复制')
              .css('width','auto'))
            .click(async function() {
                a.show()
                titleSpan.hide()
            })
            .prependTo('.right-operation')

  titleSpan.before(a)
}


addEventListener("load", addTitleLink);