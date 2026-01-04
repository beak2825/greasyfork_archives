// ==UserScript==
// @name        llvm docs页面隐藏侧边栏
// @namespace   Violentmonkey Scripts
// @match       https://llvm.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/4/4 16:20:24
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463230/llvm%20docs%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/463230/llvm%20docs%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

// get previous hyper link
var navigator_top = document.querySelector('[role="navigation"]')
var navigator_ul = navigator_top.querySelector('ul')
var eles = navigator_top.getElementsByClassName('right')
var index_link = eles[0]

var full_screen_link = index_link.cloneNode()
var fsl_a = document.createElement('a')
fsl_a['id'] = 'full_screen'
fsl_a.innerHTML = 'full screen'
full_screen_link.innerHTML = '| '
full_screen_link.appendChild(fsl_a)
navigator_ul.insertBefore(full_screen_link, index_link)



fsl_a.addEventListener('click', function(event) {
  var main_text_div = document.querySelector('[role="main"]')
  var origin_parent_node = main_text_div.parentNode
  var new_parent_node = origin_parent_node.parentNode.parentNode


  var div_sidebar = document.getElementsByClassName('sphinxsidebar')[0]
  var p_div_sidebar = div_sidebar.parentNode
  p_div_sidebar.removeChild(div_sidebar)

  new_parent_node.appendChild(main_text_div)

  origin_parent_node.removeChild(main_text_div)
})