// ==UserScript==
// @name         Wiki file link preview
// @namespace    https://unlucky.ninja/
// @version      0.1
// @description  preview image for link that start with "File:"
// @author       UnluckyNinja
// @match        https://*.wikipedia.org/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/367711/Wiki%20file%20link%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/367711/Wiki%20file%20link%20preview.meta.js
// ==/UserScript==

// (function($, undefined) {
(function() {
  'use strict';

  $(function() {
    GM_addStyle(`
    #img-preview {
      position: fixed;
      width: auto;
      height: auto;
    }
    .wip-upper-right {
      top: 10px;
      right: 10px;
    }
    .wip-upper-left {
      top: 10px;
      left: 10px;
    }
    
    `)
    let preview = $('<img id="img-preview"></img>')

    function checkMouse(event, img) {
      console.log(event.clientX + ', ' + window.innerWidth)
      if (event.clientX < window.innerWidth / 2) {
        img.removeClass('wip-upper-left')
        img.addClass('wip-upper-right')
      } else {
        img.removeClass('wip-upper-right')
        img.addClass('wip-upper-left')
      }
    }

    let m_in = (event) => {
      console.log('m_in in ' + $(event.target).toString())
      let img = $('#img-preview')
      checkMouse(event, img)
      let imglink = '';
      let url = $(event.target).attr('href')
      if (url && url !== '') {
        console.log('url is ' + url)
        $.post(url, null, function(data, status, jqxhr) {
          imglink = $(data).find('#file img').first().attr('src');
          if (img.is(':visible')) {
            img.attr('src', imglink)
          }
          console.log('post success, imglink:' + imglink)
        }).fail(() => { console.log('get image failed') })
      }
      img.show()
    }

    let m_out = (event) => {
      let img = $('#img-preview')
      img.hide()
      img.attr('src', null)
    }

    preview.appendTo('body')
    preview.hide()

    let addPreviewEvent = function(node) {
      if (node.text().startsWith('File:')) {
        node.hover(m_in, m_out)
      }
    }

    waitForKeyElements("#mw-category-media a", addPreviewEvent);
  })
})()
//})(window.jQuery.noConflict(true) || $); // not work