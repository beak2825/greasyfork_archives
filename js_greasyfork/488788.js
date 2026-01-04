// ==UserScript==
// @name         BIT-乐学-修改侧边栏课程-GUI
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  修改侧边栏显示的课程
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       CJJ
// @match        *://lexue.bit.edu.cn/*
// @icon         https://lexue.bit.edu.cn/theme/image.php/eguru/theme/1724573654/favicon
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/488788/BIT-%E4%B9%90%E5%AD%A6-%E4%BF%AE%E6%94%B9%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%AF%BE%E7%A8%8B-GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/488788/BIT-%E4%B9%90%E5%AD%A6-%E4%BF%AE%E6%94%B9%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%AF%BE%E7%A8%8B-GUI.meta.js
// ==/UserScript==

(async function () {
  'use strict'
  // GreasyFork提供：
  /* global GM_getValue, GM_setValue, GM_registerMenuCommand */
  // 乐学提供：
  /* global M */

  let dragsrc = null
  let shown_courses = await GM_getValue('lexue_shown_courses') || []
  let hidden_courses = await GM_getValue('lexue_hidden_courses') || []
  const popup_cover = document.createElement('div')
  const popup = document.createElement('div')
  popup_cover.style = 'width:100%;height:100%;background-color:rgba(0,0,0,0.6);position:fixed;inset:0px;z-index:2000'

  function rewrite_sidebar (shown_courses) {
    const current_id = document.querySelector('[data-key="coursehome"].active_tree_node')?.href?.match(/(?<=id=)\w+/)?.join() // 如果找不到返回undefined
    const mycourses = document.querySelector('li:has([data-key="mycourses"])')
    const sidebar_course_list = mycourses.parentNode

    let node = mycourses.nextSibling
    while (node) {
      node.parentNode.removeChild(node)
      node = mycourses.nextSibling
    }

    for (let i = 0; i < shown_courses.length; i++) {
      const classList = (current_id === shown_courses[i][0] ? ['list-group-item-action active active_tree_node ', 'font-weight-bold '] : ['', ''])
      sidebar_course_list.innerHTML += `<li>
                        <a class="list-group-item list-group-item-action  ${classList[0]}" href="https://lexue.bit.edu.cn/course/view.php?id=${shown_courses[i][0]}" data-key="${shown_courses[i][0]}" data-isexpandable="1" data-indent="1" data-showdivider="0" data-type="20" data-nodetype="1" data-collapse="0" data-forceopen="0" data-isactive="0" data-hidden="0" data-preceedwithhr="0" data-parent-key="">
                            <div class="ml-1">
                                <div class="media">
                                        <span class="media-left">
                                            <i class="icon fa fa-${shown_courses[i][2]} fa-fw " aria-hidden="true"></i>
                                        </span>
                                    <span class="media-body ${classList[1]}">${shown_courses[i][1]}</span>
                                </div>
                            </div>
                        </a>
                    </li>`
    }
  }

  function openPopup () {
    popup.style = 'background-color:white;color:black;box-shadow:rgb(153,153,153) 0px 0px 2px;transform:translate(-50%,-50%);position:fixed;border:3px solid rgba(0,0,0,0.6);font-size:16px;overflow:hidden;z-index:3000;left:50%;top:50%;width:70%;text-align:center;'
    popup.innerHTML = `<style>
#popup_title{
    width:100%;
    height:40px;
    line-height:40px;
    box-sizing:border-box;
    background-color:rgb(255,77,64);
    color:rgb(255,255,255);
    font-weight:700;
    font-size:20px;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
#close_popup{
    text-decoration:none;
    color:rgb(255,255,255);
    position:absolute;
    right:10px;
    top:0px;
    font-size:25px;
    display:inline-block;
    cursor:pointer;
}
ul#shown_courses,ul#hidden_courses{
    width:45%;
    height:60vh;
    display:inline;
    position:relative;
    background-color: #dddddd;
    border: 1px solid #000;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    overflow-y:scroll;
    overflow-x:hidden;
    scrollbar-width: none;/* 兼容火狐 */
    -ms-overflow-style: none;/* 兼容IE10+ */
    text-align:center;
    word-break:break-all;
    list-style: none;
    padding-left: 0;
}
ul#shown_courses::-webkit-scrollbar,ul#hidden_courses::-webkit-scrollbar{
    width: 0px;/* 兼容火狐 */
}
ul#shown_courses>li,ul#hidden_courses>li{
    cursor: grab;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid #000;
    width: 100%;
    text-align: center;
}
ul#shown_courses span,ul#hidden_courses span{
    min-height:24px;
}
span[contenteditable='true']{
    border:thin solid #C0C0C0;
}
</style><div id="popup_title">编辑侧边栏课程
<div id="close_popup">×</div>
</div>
通过拖动来归类和排序
<div style="display:flex;justify-content:center;">
<div style="width:45%;font-size:16px;">显示的课程</div>
<div style="width:45%;font-size:16px;">隐藏的课程</div>
</div>
<div style="display:flex;justify-content:center;">
<ul id="shown_courses" ondragover="event.preventDefault();"></ul>
<ul id="hidden_courses" ondragover="event.preventDefault();"></ul>
</div>
<button id="rewrite_sidebar" style="margin:1% 1% 1% 1%;">完成</button></div>`
    popup.querySelector('#close_popup').onclick = () => closePopup()
    popup.querySelector('#rewrite_sidebar').onclick = () => {
      closePopup()
      shown_courses = []
      hidden_courses = []
      const shown_lis = popup.querySelectorAll('#shown_courses>li')
      const hidden_lis = popup.querySelectorAll('#hidden_courses>li')
      for (let i = 0; i < shown_lis.length; i++) {
        shown_courses.push([shown_lis[i].dataset.id, shown_lis[i].innerText.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll(' ', '&nbsp;'), shown_lis[i].querySelector('[data-icon]').dataset.icon])
      }
      for (let j = 0; j < hidden_lis.length; j++) {
        hidden_courses.push([hidden_lis[j].dataset.id, hidden_lis[j].innerText.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll(' ', '&nbsp;'), hidden_lis[j].querySelector('[data-icon]').dataset.icon])
      }
      GM_setValue('lexue_shown_courses', shown_courses)
      GM_setValue('lexue_hidden_courses', hidden_courses)
      rewrite_sidebar(shown_courses)
    }
    popup.querySelector('#shown_courses').addEventListener('drop', function (e) {
      e.preventDefault()
      this.append(dragsrc)
    })
    popup.querySelector('#hidden_courses').addEventListener('drop', function (e) {
      e.preventDefault()
      this.append(dragsrc)
    })
    for (let i = 0; i < shown_courses.length; i++) {
      const shown_li = document.createElement('li')
      shown_li.setAttribute('data-id', shown_courses[i][0])
      shown_li.draggable = 'true'
      shown_li.addEventListener('dragstart', function (e) {
        dragsrc = this
      })
      shown_li.addEventListener('dragover', function (e) {
        e.preventDefault()
      })
      shown_li.addEventListener('drop', function (e) {
        e.stopPropagation()
        if (this !== dragsrc) {
          if (this.parentNode === dragsrc.parentNode && this.offsetTop > dragsrc.offsetTop) {
            this.parentNode.insertBefore(dragsrc, this.nextSibling)// if this.nextSibling===null insert as the last child.
          } else {
            this.parentNode.insertBefore(dragsrc, this)
          }
        }
      })
      shown_li.innerHTML = `<a class="list-group-item list-group-item-action"><div class="ml-1"><div class="media"><span class="media-left"><i class="icon fa fa-${shown_courses[i][2]} fa-fw" aria-hidden="true" ondblclick="this.style.display='none';this.nextSibling.style.display='block';this.nextSibling.focus();this.parentNode.parentNode.parentNode.parentNode.parentNode.draggable=false"></i><span class="media-body" style="cursor:auto;display:none" contenteditable="true" onfocus="this.innerText=this.dataset.icon" data-icon="${shown_courses[i][2]}" onblur="this.style.display='none';this.previousSibling.style.display='block';this.parentNode.parentNode.parentNode.parentNode.parentNode.draggable=true;this.dataset.icon=this.innerText;this.innerText='';this.previousSibling.className='icon fa fa-'+this.dataset.icon+' fa-fw';" onkeydown="if(event.keyCode===13){this.blur();}" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain').replace(/[\\n|\\r]/gm,''))"></span></span><span class="media-body" ondblclick="this.setAttribute('contenteditable','true');this.focus();this.style.cursor='auto';this.parentNode.parentNode.parentNode.parentNode.draggable=false" onblur="this.removeAttribute('contenteditable');this.style.cursor='grab';this.parentNode.parentNode.parentNode.parentNode.draggable=true" onkeydown="if(event.keyCode===13){this.blur();}" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain').replace(/[\\n|\\r]/gm,'')).replaceAll(' ','&nbsp;')">${shown_courses[i][1]}</span></div></div></a>`
      popup.querySelector('#shown_courses').append(shown_li)
    }
    for (let j = 0; j < hidden_courses.length; j++) {
      const hidden_li = document.createElement('li')
      hidden_li.setAttribute('data-id', hidden_courses[j][0])
      hidden_li.draggable = 'true'
      hidden_li.addEventListener('dragstart', function (e) {
        dragsrc = this
      })
      hidden_li.addEventListener('dragover', function (e) {
        e.preventDefault()
      })
      hidden_li.addEventListener('drop', function (e) {
        e.stopPropagation()
        if (this !== dragsrc) {
          if (this.parentNode === dragsrc.parentNode && this.offsetTop > dragsrc.offsetTop) {
            this.parentNode.insertBefore(dragsrc, this.nextSibling)// if this.nextSibling===null insert as the last child.
          } else {
            this.parentNode.insertBefore(dragsrc, this)
          }
        }
      })
      hidden_li.innerHTML = `<a class="list-group-item list-group-item-action"><div class="ml-1"><div class="media"><span class="media-left"><i class="icon fa fa-${hidden_courses[j][2]} fa-fw" aria-hidden="true" ondblclick="this.style.display='none';this.nextSibling.style.display='block';this.nextSibling.focus();this.parentNode.parentNode.parentNode.parentNode.parentNode.draggable=false"></i><span class="media-body" style="cursor:auto;display:none" contenteditable="true" onfocus="this.innerText=this.dataset.icon" data-icon="${hidden_courses[j][2]}" onblur="this.style.display='none';this.previousSibling.style.display='block';this.parentNode.parentNode.parentNode.parentNode.parentNode.draggable=true;this.dataset.icon=this.innerText;this.innerText='';this.previousSibling.className='icon fa fa-'+this.dataset.icon+' fa-fw'" onkeydown="if(event.keyCode===13){this.blur();}" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain').replace(/[\\n|\\r]/gm,''))"></span></span><span class="media-body" ondblclick="this.setAttribute('contenteditable','true');this.focus();this.style.cursor='auto';this.parentNode.parentNode.parentNode.parentNode.draggable=false" onblur="this.removeAttribute('contenteditable');this.style.cursor='grab';this.parentNode.parentNode.parentNode.parentNode.draggable=true" onkeydown="if(event.keyCode===13){this.blur();}" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain').replace(/[\\n|\\r]/gm,'')).replaceAll(' ','&nbsp;')">${hidden_courses[j][1]}</span></div></div></a>`
      popup.querySelector('#hidden_courses').append(hidden_li)
    }
    document.body.append(popup_cover)
    document.body.append(popup)
  }

  function closePopup () {
    document.body.removeChild(popup_cover)
    document.body.removeChild(popup)
  }

  function reload_courses () {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const courses = JSON.parse(xhr.responseText)[0].data.courses
        courses.sort((a, b) => a.enddate - b.enddate)
        for (let i = 0; i < courses.length; i++) {
          if (!hidden_courses.filter(hidden_course => parseInt(hidden_course[0]) === courses[i].id).length && !shown_courses.filter(shown_course => parseInt(shown_course[0]) === courses[i].id).length) {
            hidden_courses.unshift([courses[i].id, `<b style="color:red">${courses[i].fullname}</b>`, 'graduation-cap'])
          }
        }
        openPopup()
      }
    }
    xhr.open('POST', `https://lexue.bit.edu.cn/lib/ajax/service.php?sesskey=${M.cfg.sesskey}&info=core_course_get_enrolled_courses_by_timeline_classification`, true)
    xhr.send('[{"index":0,"methodname":"core_course_get_enrolled_courses_by_timeline_classification","args":{"offset":0,"limit":0,"classification":"all","sort":"fullname","customfieldname":"","customfieldvalue":""}}]')
  }

  if (shown_courses.length || hidden_courses.length) {
    rewrite_sidebar(shown_courses)
  } else {
    reload_courses()
  }

  GM_registerMenuCommand('更新课程并修改侧边栏', function () {
    if (!popup.parentNode) {
      reload_courses()
    }
  })
  GM_registerMenuCommand('仅修改侧边栏', function () {
    if (!popup.parentNode) {
      openPopup()
    }
  })
})()
