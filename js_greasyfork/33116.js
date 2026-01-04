// ==UserScript==
// @name         超碰视频去广告，解决VIP限制
// @namespace    undefined
// @version      0.0.29
// @description  超碰视频去广告，解决VIP限制，提取视频地址，添加下载按钮
// @author       Svend
// @match        http://www.xiaobi000.com/*
// @match        http://www.xiaobi001.com/*
// @match        http://www.xiaobi002.com/*
// @match        http://www.xiaobi003.com/*
// @match        http://www.xiaobi004.com/*
// @match        http://www.xiaobi005.com/*
// @match        http://www.xiaobi006.com/*
// @match        http://www.xiaobi008.com/*
// @match        http://www.xiaobi009.com/*
// @match        http://www.xiaobi010.com/*
// @match        http://www.xiaobi013.com/*
// @match        http://www.xiaobi014.com/*
// @match        http://www.xiaobi015.com/*
// @match        http://www.xiaobi016.com/*
// @match        http://www.xiaobi017.com/*
// @match        http://www.xiaobi018.com/*
// @match        http://www.xiaobi019.com/*
// @match        http://www.xiaobi020.com/*
// @match        http://www.xiaobi021.com/*
// @match        http://www.xiaobi022.com/*
// @match        http://www.xiaobi023.com/*
// @match        http://www.xiaobi024.com/*
// @match        http://www.xiaobi025.com/*
// @match        http://www.xiaobi026.com/*
// @match        http://www.xiaobi027.com/*
// @match        http://www.xiaobi028.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/33116/%E8%B6%85%E7%A2%B0%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%A7%A3%E5%86%B3VIP%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/33116/%E8%B6%85%E7%A2%B0%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E8%A7%A3%E5%86%B3VIP%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
$(document).ready(function() {
  caoporn();
});

function caoporn() {
  var host = window.location.host.replace('www', '');
  if (!host.startsWith('.')) {
    host = '.' + host;
  }
  setCookie('video_log', 0, host, '/');

  setTimeout(function() {
    //ad
    removeAD();
  }, 100);

  setTimeout(function() {
    removeAD();
    console.clear();
    if (typeof layer !== 'undefined') {
      layer.closeAll();
      delete layer;
    }
    if (typeof flashvars !== 'undefined') {
      var videoUrl = flashvars.video_url;
      videoUrl = videoUrl.slice(0, videoUrl.lastIndexOf('/?'));
      console.log('视频地址 ---> :', videoUrl);
      //createVideoEle("#kt_player", videoUrl);
      createDownloadBtn(videoUrl);
    }
  }, 500);
}

function setCookie(name, value, domain, path) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  var cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';domain=' + domain + ';path=' + path;
  document.cookie = cookie;

  console.log('set cookie:', cookie);
}

function removeAD() {
  $('.m_ad').remove();
  $('.pc_ad').remove();
  $('.thumbs__list cfx').remove();
  $('qq').remove();
  $('noindex').remove();
  $('.place').remove();
  $('.right-vip').remove();
  $('.top-links').remove();
}

function createVideoEle(ele, url) {
  var videoDiv = '<div id="user_video_div"><video id="user_video" controls="controls" autoplay></video></div>';
  $(ele).html(videoDiv);
  $('#user_video').attr('src', url);
  $('#user_video_div').css({
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    background: '#000'
  });
  $('#user_video').css({
    width: '100%',
    height: '100%',
    background: '#000'
  });
  $(document).keydown(function(e) {
    if (e.keyCode === 39) {
      $('#user_video')[0].currentTime += 5;
    } else if (e.keyCode === 37) {
      $('#user_video')[0].currentTime -= 5;
    }
  });

  $('#user_video').on('play', function(e) {
    $('#user_video').css('opacity', 1);
  });

  $('#user_video').on('pause', function(e) {
    $('#user_video').css('opacity', 0);
  });

  $('#user_video').on('click', function(e) {
    return this.paused ? this.play() : this.pause();
  });
}

function createDownloadBtn(videoUrl) {
  var top = $('#kt_player').offset().top + 2;
  var left = $('#kt_player').offset().left + $('#kt_player').width() - 92;

  var title = ''
  var headline = document.getElementsByClassName('headline')[0]
  if (headline) {
    title = headline.firstElementChild.textContent
  }

  var downloadBtn =
    '<a style="position:absolute; top: ' +
    top +
    'px; left: ' +
    left +
    'px; background: #e9e9e9; color: green; width: 90px; height: 30px; line-height: 30px; z-index: 99999; text-align: center; font-size: 20px; border-radius: 5px; cursor: pointer;" href="' +
    videoUrl +
    '" download="'+title+'">下载</a>';
  $(document.body).append(downloadBtn);
}
