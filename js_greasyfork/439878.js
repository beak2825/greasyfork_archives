// ==UserScript==
// @name        chatango chatbox - xsanime.com
// @description make chatango iframe like messenger chat box - 2/11/2022, 11:41:44 AM
// @version     1.0.0
// @license     MIT
// @namespace   com.github.codeiter.userscript
// @author      Mohamed Amin Boubaker - https://github.com/CodeIter
// @match       http*://xsanime.com/*
// @match       http*://*.xsanime.com/*
// @noframes
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439878/chatango%20chatbox%20-%20xsanimecom.user.js
// @updateURL https://update.greasyfork.org/scripts/439878/chatango%20chatbox%20-%20xsanimecom.meta.js
// ==/UserScript==

const chatango_iframe_div = document.querySelector('.ChatButton')

const chatango_wrapper = document.createElement('div')
chatango_wrapper.id='chatango-wrapper'
//chatango_wrapper.style['display'] = 'none'
chatango_wrapper.style['right']='1000px'
chatango_iframe_div.parentNode.insertBefore(chatango_wrapper, chatango_iframe_div)
chatango_wrapper.appendChild(chatango_iframe_div)

const chatango_box = document.createElement('div')
chatango_box.id='chatango-box'
chatango_box.style['position'] = 'fixed'
chatango_box.style['bottom'] = '0'
chatango_box.style['left'] = '15px'
chatango_box.style['z-index'] = '9'
chatango_box.style['box-sizing'] = 'border-box'
chatango_wrapper.parentNode.insertBefore(chatango_box, chatango_wrapper)
chatango_box.appendChild(chatango_wrapper)

const chatango_button = document.createElement('button')
chatango_button.id='chatango-button'
chatango_button.style['background-color'] = '#555'
chatango_button.style['color'] = 'white'
chatango_button.style['padding'] = '16px 20px'
chatango_button.style['border'] = 'none'
chatango_button.style['cursor'] = 'pointer'
chatango_button.style['opacity'] = '0.8'
chatango_button.style['width'] = '280px'
chatango_button.innerText = 'Open ChatanGo Box'

chatango_button.addEventListener("click", function() {
  if(chatango_wrapper.style['right']!=='1000px'){
    chatango_wrapper.style['right']='1000px'
    chatango_button.style['background-color'] = '#555'
    chatango_box.style['border'] = 'none'
    chatango_button.innerText = 'Open ChatanGo Box'
  }else{
    chatango_wrapper.style['right']='0'
    chatango_button.style['background-color'] = 'red'
    chatango_box.style['border'] = '3px solid #f1f1f1'
    chatango_button.innerText = 'Close ChatanGo Box'
  }
})
chatango_box.appendChild(chatango_button)
