// ==UserScript==
// @name            微博图片原图地址批量复制
// @description     点击一条微博下方的“复制”按钮后，就可粘贴到贴吧或者迅雷批量下载,支持相册图片和搜索页面
// @include         http://*.weibo.com/*
// @include         http://weibo.com/*
// @version         2.7
// @author          yechenyin
// @namespace	      https://greasyfork.org/users/3586-yechenyin
// @require	        https://code.jquery.com/jquery-1.11.2.min.js
// @grant           GM_setClipboard
// @run-at          document-body
// @downloadURL https://update.greasyfork.org/scripts/11687/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E5%9C%B0%E5%9D%80%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/11687/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E5%9C%B0%E5%9D%80%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

jQuery.fn.inserted = function(action, observe_for_once) {
  var selector = this.selector;
  if ($(selector).length > 0) {
    console.log($(selector).length + ' ' + selector + " is loaded at begin");
    action();
  }
  var reaction = function(records) {
    records.map(function(record) {
      if(record.target !== document.body && $(record.target).find(selector).length) {
        console.log($(record.target).selector + ' which contains ' + selector + ' is loaded');
        action();
        if (observe_for_once)
          observer.disconnect();
      }
    });
  };

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if (MutationObserver) {
    var observer = new MutationObserver(reaction);
    observer.observe(document.body, {childList: true, subtree: true});
  } else {
    //setInterval(reaction, 100);
  }
};

jQuery.fn.changed = function(action, forEachAddedNode, delay) {
  var selector = this.selector;
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if (MutationObserver) {
    var callback = function (records) {
    setTimeout(function() {
      console.log(records.length + ' ' + records[0].target.className + " is mutated");
      if (forEachAddedNode) {
      records.map(function (record) {
        console.log(record.target);
        console.log(record.addedNodes);
        for (var i = 0; i < record.addedNodes.length; i++) {
          action.call(record.addedNodes.item(i));
        }
      });
    } else
      action.call(document.querySelector(selector));

    }, delay || 0);

    };
    var observer = new MutationObserver(callback);

    if ($(selector).length > 0) {
        console.log($(selector).length + ' ' + selector + " is loaded");
        setTimeout(function() {
          if (forEachAddedNode)
            $(selector).each(action);
          else
            action();
        }, delay || 0);
    } else {
      var check = setInterval(function () {
        if ($(selector).length > 0) {
          console.log($(selector).length + ' ' + selector + " is inserted");
          clearInterval(check);
          if (forEachAddedNode)
            $(selector).each(action);
          else
            action();
          observer.observe(document.querySelector(selector), {childList: true});
        }
      }, 100);
    }

  }
};

jQuery.fn.loaded = function(action) {
  var selector = this.selector;
  var check = setInterval(function () {
    if ($(selector).length > 0) {
      console.log($(selector).length + ' ' + selector + " is loaded");
      clearInterval(check);
      action();
    }
  }, 100);
};

if (location.href.indexOf("weibo.com/") > 0) {
  block = "unlock";
  //add_copy_links();
  //$(document).on('DOMNodeInserted', '#plc_main', add_copy_links);
  //$('.WB_feed[node-type="feed_list"]').changed(add_copy_links);
  $('.WB_row_line, .feed_action_info, .WB_praishare').inserted(add_copy_links);
  $('.gn_topmenulist li').loaded(function () {
    $('.gn_topmenulist li').eq(0).after($('<li>').append($('<a>', {text:'包含话题', id:'contain_topic_setting'})));
    if (localStorage.also_contain_topic === undefined)
      localStorage.also_contain_topic = '';
    if (!localStorage.also_contain_topic)
      $('#contain_topic_setting').css('color', '#ccc');
    $('#contain_topic_setting').click(function () {
      if (localStorage.also_contain_topic) {
        localStorage.also_contain_topic = '';
        $('#contain_topic_setting').css('color', '#ccc');
      } else {
        localStorage.also_contain_topic = 'true';
        $('#contain_topic_setting').css('color', '#333');
      }
    });

    $('.gn_topmenulist li').eq(0).after($('<li>').append($('<a>', {text:'复制文字', id:'copy_text_setting'})));
    if (localStorage.also_copy_text === undefined)
      localStorage.also_copy_text = '';
    if (!localStorage.also_copy_text)
      $('#copy_text_setting').css('color', '#ccc');
    $('#copy_text_setting').click(function () {
      if (localStorage.also_copy_text) {
        localStorage.also_copy_text = '';
        $('#copy_text_setting').css('color', '#ccc');
      } else {
        localStorage.also_copy_text = 'true';
        $('#copy_text_setting').css('color', '#333');
      }
    });
  }, true);


}

function add_copy_links() {
  var i, html;
    for (i=0; i<$('.WB_row_line, .feed_action_info').length; i++) {
      if ($('.WB_row_line, .feed_action_info').eq(i).find('.copy_images').length === 0) {
        html = $('.WB_row_line, .feed_action_info').eq(i).html().substr(0, $('.WB_row_line, .feed_action_info').eq(i).html().indexOf('</li>'));
        html += '<li class="copy_images"><a class="S_txt2"><span class="S_line1 line">复制</span></a></li>';
        html += $('.WB_row_line, .feed_action_info').eq(i).html().substr($('.WB_row_line, .feed_action_info').eq(i).html().indexOf('</li>'));
        $('.WB_row_line, .feed_action_info').eq(i).html(html);
      }
    }
    $('.WB_row_line li, .feed_action_info li').css({width:"20%", cursor:'pointer'});

        for (i=0; i<$('.WB_praishare').length; i++) {
          if ($('.WB_praishare').eq(i).find('.copy_images').length === 0) {
            html = $('.WB_praishare').eq(i).html();
            html = '<a class="S_txt1"><span class="copy_images">复制</span></a><em class="W_vline S_line1"></em>' + html;
            $('.WB_praishare').eq(i).html(html);
          }
        }

    $('.copy_images').click(function () {
      var images, contents, text='', urls = '';
      if ($(this).parents('.WB_cardwrap').length > 0) {
        if ($(this).parents('.WB_cardwrap').find('.WB_feed_expand').length > 0)
          contents = $(this).parents('.WB_cardwrap').find('.WB_feed_expand .WB_text').contents();
        else
          contents = $(this).parents('.WB_cardwrap').find('.WB_text, .describe').contents();
        contents.each(function() {
          if ($(this).attr('action-type') === "feed_list_url")
            text += this.href+' ';
          else
            text += $(this).text();
        });
      text = text.replace(/^\s+/, '');
      if (localStorage.also_contain_topic)
        text = text.replace(/#(.*?)#/g, '$1');
      else
        text = text.replace(/#(.*?)#/g, '');
      if (text === '分享圖片' || text === '分享图片')
        text = '';
      console.log(text);

      images = $(this).parents('.WB_cardwrap').find('.WB_media_a img[class!="loading_gif"], .photo_pic');
      for (var i=0; i<images.length; i++) {
        urls += images[i].src + '\n';
      }
      console.log(images);
      urls = urls.replace(/\.cn\/\w+?\//g, '.cn/large/');
      console.log(urls);

      if (localStorage.also_copy_text)
        GM_setClipboard(urls + text);
      else
        GM_setClipboard(urls);
      $(this).find('span').css('color', '#ccc');
      $(this).hover(function() {
        var that = this;
        setTimeout(function() {
          $(that).find('span').attr('style', '');
        }, 300);
      });
      return false;
    }
    });
}
