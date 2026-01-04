// ==UserScript==
// @name         禅道---1
// @namespace    chandao
// @description  禅道部分页面样式修改, 功能辅助
// @version      1.4.3
// @author       vizo
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @include      *://*/zentao*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/382685/%E7%A6%85%E9%81%93---1.user.js
// @updateURL https://update.greasyfork.org/scripts/382685/%E7%A6%85%E9%81%93---1.meta.js
// ==/UserScript==

'use strict'

let timsx = null

$(function() {
  GM_addStyle(`
    .tiles .tile {
      cursor: pointer;
    }
    .tiles .tile:hover {
      background: #22242711
    }
    #bugList tbody tr.x_active {
      opacity: .3 !important;
    }

    #bugList tbody tr.s_active td,
    #bugList tbody tr.s_active .c-title * {
      color: #f22 !important;
    }
    
    #bugList tbody tr.black-lt {
      opacity: .3 !important;
    }
    
    #bugList tbody tr.s_active.black-lt td,
    #bugList tbody tr.s_active.black-lt .c-title * {
      color: #000 !important;
      font-weight: bold;
      font-style: italic;
    }
    
    tr[data-id]:not(.table-children),
    tr[data-id]:not(.table-children):hover {
      background: #d7f3ec !important;
    }
    
    #txcjkps78d4 {
      display: block;
      width: 350px;
      height: 200px;
      resize: none;
      overflow: auto;
      outline: none;
      border: 0;
      background: #fff;
      box-shadow: 0 0 5px #c4c4c4;
      color: #555;
      font-size: 13px;
      font-family: PingFang SC,Hiragino Sans GB,Microsoft YaHei;
      padding: 10px;
      position: fixed;
      top: -300px;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 1;
      display: none;
    }
    
    #txcjkps78d4.on {
      display: block;
    }
    
  `)
  
  
  $('body').append(`
    <textarea id="txcjkps78d4"></textarea>
  `)
  
  function tgBlacklist() {
    $('#txcjkps78d4').addClass('on')
    setBlanklistToInp()
  }
  
  GM_registerMenuCommand('黑名单', tgBlacklist)
  

  // 根据本地存储判断是否展开子任务..
  $(function () {
    
    function toggleAllSubtask(isExpand) {
      if (isExpand) {
        $('.table-children').show()
        $('.task-toggle').removeClass('collapsed')
        localStorage.setItem('cnd_subtask_isExpand', '1')
      } else {
        $('.table-children').hide()
        $('.task-toggle').addClass('collapsed')
        localStorage.setItem('cnd_subtask_isExpand', '0')
      }
    }
    
    function isExpand() {
      return !!+localStorage.getItem('cnd_subtask_isExpand')
    }
    
    toggleAllSubtask(isExpand())
    
    let link = `<a href="javascript:;" id="tg_zhankai" class="btn">全部展开/折叠</a>`
    if ( location.href.includes('project-task') ) {
      $('.btn-toolbar.pull-left').append(link)
    }
    
    $('body').on('click', '#tg_zhankai', function() {
      toggleAllSubtask(!isExpand())
    })
    
  })
  
  // 首页增加a标签快速跳转
  $('.tiles .tile').each(function() {
    let tis = $(this)
    let text = tis.find('.tile-title').text()
    let arr = [
      {
        text: '我的BUG',
        url: '/zentao/my-bug.html',
      },
      {
        text: '我的任务',
        url: '/zentao/my-task.html',
      },
      {
        text: '我的需求',
        url: '/zentao/my-story.html',
      },
      {
        text: '进行中的迭代',
        url: '/zentao/my-project.html',
      },
    ]
    arr.forEach(v => {
      if (v.text == text) {
        tis.attr('data-href', v.url)
      }
    })
    
  })
  
  // 自己名字高亮
  function setTrlineht() {
    $('#bugList tbody tr').each(function() {
      let store = GM_getValue('_blacklistId')
      let blacklist = store ? JSON.parse(store) : []
      let tis = $(this)
      let cid = tis.find('.c-id').text().replace(/\D/g, '')
      let text = tis.find('.c-status').text()
      let who = tis.find('.c-assignedTo .text-red').text()
      let user = $('#userNav .user-name').text()
      if ( text === '已解决') {
        tis.addClass('x_active')
      }
      // 黑名单
      if ( blacklist.includes(cid) ) {
        tis.addClass('black-lt')
      } else {
        tis.removeClass('black-lt')
      }
      
      if (user === who) {
        tis.addClass('s_active')
      }
    })
  }
  
  setTrlineht()
  
  // 首页链接点击跳转
  $('body').on('click', '.tiles .tile', function() {
    let href = $(this).attr('data-href')
    if (href) {
      location.href = href
    }
  })
  

  function setBlanklistToInp() {
    let ids = GM_getValue('_blacklistId')
    ids = ids ? JSON.parse(ids) : []
    let str = ids.join(', ').replace(/(\d+)$/, '$1, ')
    $('#txcjkps78d4').val(str)
  }
  
  $('#txcjkps78d4').on('input', function() {
    
    clearTimeout(timsx)
    
    let tis = $(this)
    let val = tis.val()
    tis.val( val.replace(/[^,\d\s]+/, '') )
    
    let list = tis.val().replace(/\s/g, '').replace(/,+$/, '').split(',')
    
    GM_setValue('_blacklistId', JSON.stringify(list))
    
    timsx = setTimeout(() => {
      setTrlineht()
    }, 500)
  })
  
  document.addEventListener('click', function() {
    if (event.target.id != 'txcjkps78d4') {
      $('#txcjkps78d4').removeClass('on')
    }
  })
  
  $('body').on('contextmenu', '#bugList tr .c-id', function() {
    event.preventDefault()
    let tis = $(this)
    let list = GM_getValue('_blacklistId') || []
    let cid = tis.text().replace(/\s/g, '')
    console.log(cid)
  })
  
  setBlanklistToInp()
})
