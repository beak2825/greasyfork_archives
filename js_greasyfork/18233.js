// ==UserScript==
// @name         Window floating container 
// @version      2.0.1
// @description  Adds a fixed header element for use by other scripts
// @author       @_jnblog
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
/* jshint -W097 */
/* global $ */
/* jshint asi: true, multistr: true */
'use strict'

window.windowFloaterUtils = {
  getFloater: function getFloater() {
    return $('#ijgWindowFloater')
  }
}

;(function _makeFloater() {
  var ijgFloater
  if ($('#ijgWindowFloater').length) {
    return
  }

  ijgFloater = $('<div id="ijgWindowFloater">')
  $('.Nav-top').append(ijgFloater).css('z-index', 1001)
  _addStyles()

  $('<i class="ijgWindowFloater-toggle">')
    .appendTo(ijgFloater)
    .on('click', function() {
    $('#ijgWindowFloater').toggleClass('ijg-is-closed')
    GM_setValue('ijgWindowFloater-closed', $('#ijgWindowFloater').hasClass('ijg-is-closed'))
  })

  var isClosed = GM_getValue('ijgWindowFloater-closed')
  if (isClosed || typeof ijgWindowFloater-closed === 'undefined') {
    $('#ijgWindowFloater').addClass('ijg-is-closed')
  }

  function _addStyles () {
  GM_addStyle('\
    #ijgWindowFloater {\
      position: absolute;\
      top: 100%;\
      transform: translateY(-50%);\
      left: 0;\
      z-index: 2000;\
      color: white;\
      background-color: black;\
      box-shadow: 0px 0px 6px 1px white;\
    }\
    #ijgWindowFloater a {\
      color: white !important;\
      padding: 5px;\
      display: inline-block;\
    }\
    #ijgWindowFloater a:hover {\
      text-decoration: underline;\
    }\
    .ijgWindowFloater-item {\
      vertical-align: middle;\
      padding-left: .6em;\
      padding-right: .2em;\
      white-space: nowrap;\
    }\
    .ijg-is-closed .ijgWindowFloater-item {\
      display: none;\
    }\
    .ijgWindowFloater-toggle {\
      cursor: pointer;\
      background-color: transparent;\
      box-shadow: inset 0 0 0 32px;\
      -webkit-transform-origin: right;\
      -ms-transform-origin: right;\
      transform-origin: right;\
      transform: rotate(180deg);\
      vertical-align: middle;\
      display: inline-block;\
      position: relative;\
      font-style: normal;\
      color: transparent;\
      text-align: left;\
      text-indent: -9999px;\
      direction: ltr;\
      box-sizing: border-box;\
      border: 2px solid white;\
      transition: all .2s;\
      border-radius: 50%;\
      width: 24px;\
      height: 24px;\
      margin: 2px 5px 3px 2px;\
      padding: 0;\
      top: 0;\
      left: -22px;\
    }\
    .ijgWindowFloater-toggle:before {\
      content: "";\
      width: 10px;\
      height: 10px;\
      position: absolute;\
      top: 5px;\
      right: 4px;\
      margin: auto 0;\
      pointer-events: none;\
      border-bottom: 3px solid white;\
      border-left: 3px solid white;\
    }\
    .ijgWindowFloater-toggle:before {\
      transform: rotate(45deg);\
    }\
    .ijg-is-closed .ijgWindowFloater-toggle:before {\
      transform: rotate(-135deg);\
      right: 7px;\
    }')
  }
})()