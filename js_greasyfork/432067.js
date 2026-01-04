// ==UserScript==
// @name         抖店工具条
// @namespace    https://github.com/forhot2000
// @version      0.1.5
// @description  抖店自定义工具按钮条
// @author       wangxiang
// @match        https://fxg.jinritemai.com/*~
// @icon         https://lf1-fe.ecombdstatic.com/obj/eden-cn/upqphj/homepage/icon.svg
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432067/%E6%8A%96%E5%BA%97%E5%B7%A5%E5%85%B7%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/432067/%E6%8A%96%E5%BA%97%E5%B7%A5%E5%85%B7%E6%9D%A1.meta.js
// ==/UserScript==

/* global jQuery */
(function () {
  'use strict';

  var $ = jQuery;
  //$.noConflict();

  var debugEnabled = true;
  var exportIcon =
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0aXRsZS8+PHBhdGggZD0iTTE4LDIxSDZhMywzLDAsMCwxLTMtM1Y2QTMsMywwLDAsMSw2LDNoNGExLDEsMCwwLDEsMCwySDZBMSwxLDAsMCwwLDUsNlYxOGExLDEsMCwwLDAsMSwxSDE4YTEsMSwwLDAsMCwxLTFWMTRhMSwxLDAsMCwxLDIsMHY0QTMsMywwLDAsMSwxOCwyMVoiIGZpbGw9IiM0NjQ2NDYiLz48cGF0aCBkPSJNMjEsNC4wNXY1YTEsMSwwLDAsMS0uNjIuOTIuODQuODQsMCwwLDEtLjM4LjA4LDEsMSwwLDAsMS0uNzEtLjI5TDE3LjQ1LDhsLTQuNzksNC43OWExLDEsMCwwLDEtMS40MiwwLDEsMSwwLDAsMSwwLTEuNDJMMTYsNi41NSwxNC4yNCw0Ljc2QTEsMSwwLDAsMSwxNCwzLjY3LDEsMSwwLDAsMSwxNSwzLjA1aDVhLjczLjczLDAsMCwxLC4yNSwwLC4zNy4zNywwLDAsMSwuMTQsMCwuOTQuOTQsMCwwLDEsLjUzLjUzLjM3LjM3LDAsMCwxLDAsLjE0QS43My43MywwLDAsMSwyMSw0LjA1WiIgZmlsbD0iIzQ2NDY0NiIvPjwvc3ZnPg==';

  $(function onLoad() {
    appendToolbar([{ icon: exportIcon, title: '复制订单', onClick: getOrders }]);
  });

  function getOrders() {
    var rowElementList = Array.from(document.getElementsByClassName('mortise-rich-table-row'));
    //console.log(rowElementList);
    var text = rowElementList.map((el) => el.innerText).join('\n\n');
    // navigator.clipboard.writeText(text);
    showAndCopyText(text);
  }

  function toast(message, time) {
    var $container = $('<div>')
      .css({
        position: 'absolute',
        bottom: '50px',
        left: 0,
        right: 0,
        height: '30px',
        width: '150px',
        lineHeight: '30px',
        margin: 'auto',
        textAlign: 'center',
        background: '#d3d3d3',
        border: '1px solid #333',
        padding: '5px',
        zIndex: 1000,
      })
      .text(message);
    $(document.body).append($container);
    $container.delay(time || 3000).fadeOut(300, () => {
      $container.remove();
    });
  }

  function showAndCopyText(text) {
    var copyToClipboard = () => {
      navigator.clipboard.writeText(text);
      toast('已复制到剪贴板。');
    };
    var $container = $('<div>').css({
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: '300px',
      width: '550px',
      margin: 'auto',
      background: '#d3d3d3',
      border: '1px solid #333',
      padding: '5px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
    });
    var $text = $('<textarea>')
      .css({
        width: '100%',
        boxSizing: 'border-box',
        height: '260px',
      })
      .attr({
        disabled: true,
      })
      .val(text);
    var $buttons = $('<div>').css({
      display: 'flex',
      flexDirection: 'row',
    });
    var $copyButton = $('<button>')
      .css({
        width: '50%',
        marginRight: '10px',
        marginTop: '5px',
        height: '30px',
      })
      .text('一键复制')
      .on('click', copyToClipboard);
    var $closeButton = $('<button>')
      .css({
        width: '50%',
        // marginRight: '10px',
        marginTop: '5px',
        height: '30px',
      })
      .text('关闭')
      .on('click', () => {
        $container.remove();
      });
    $container.append($text);
    $container.append($buttons);
    $buttons.append($copyButton);
    $buttons.append($closeButton);
    $(document.body).append($container);
    copyToClipboard();
  }

  function debug() {
    debugEnabled && console.log.apply(console, Array.from(arguments));
  }

  function info() {
    console.log.apply(console, Array.from(arguments));
  }

  function appendToolbar(buttons) {
    var $container = $('<div>').css({
      position: 'fixed',
      top: '140px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    });
    buttons.forEach((btn) => void appendButton($container, btn));
    $(document.body).append($container);
  }

  function appendButton($parent, btn) {
    var $button = $('<button>')
      .css({
        width: '30px',
        height: '30px',
        marginBottom: '10px',
        padding: '2px',
      })
      .on('click', () => {
        $button.attr('disabled', true);
        Promise.resolve(btn.onClick())
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            $button.attr('disabled', false);
          });
      });
    if (btn.icon) {
      var $icon = $('<i>')
        .attr({
          title: btn.title,
        })
        .css({
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${exportIcon})`,
          backgroundRepeat: 'no-repeat',
        });
      $button.append($icon);
    } else if (btn.text) {
      $button.text(btn.text);
    }
    $parent.append($button);
  }
})();
