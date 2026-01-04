// ==UserScript==
// @name         B站视频下载
// @namespace    http://tampermonkey.net/
// @version      0.7.2
// @description  B站flv视频下载
// @author       wl
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393051/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/393051/B%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // get cid
  // https://api.bilibili.com/x/player/pagelist?aid=65419012&jsonp=jsonp
  // get common videoUrl
  // https://api.bilibili.com/x/player/playurl?avid=65419012&cid=113529010&qn=80&type=&otype=json
  // get fan videoUrl
  // https://api.bilibili.com/pgc/player/web/playurl?avid=70501826&cid=122144593&qn=80&type=&otype=json&ep_id=285132&fourk=1&module=bangumi&balh_ajax=1


  let videoFlvUrl = '', page = 0
  function downloadVideo(downUrl) {
      var aaa = document.createElement('a');
      aaa.id = 'aaaDown';
      aaa.href = downUrl;
      aaa.target = '_blank';
      aaa.style.display = 'none';
      document.body.appendChild(aaa);
      aaa.click();
      setTimeout(() => {
          document.body.removeChild(document.getElementById('aaaDown'))
      }, 500)
  }
  function request(url, method, data) {
    var options = {
      method: 'get',
      credentials: 'include'
    }
    let dataStr = ''
    if (method === 'get' && data) {
      for (let key in data) {
        dataStr += (key + '=' + data[key]) + '&'
      }
      url += '?' + dataStr
    }
    return fetch(url, options);
  }
  function getVideoUrl(isFan, callType) {
    let videoData = isFan ? window.__INITIAL_STATE__.epInfo : window.__INITIAL_STATE__.videoData
    let requestUrl
    console.log('videoData', videoData)
    let params = {
      avid: videoData.aid,
      cid: videoData.pages ? videoData.pages[page].cid : videoData.cid,
      qn: 80,
      type: '',
      otype: 'json'
    }
    if (isFan) {
      requestUrl = 'https://api.bilibili.com/pgc/player/web/playurl'
      Object.assign(params, {
        ep_id: videoData.id,
        fourk: 1,
        module: 'bangumi',
        balh_ajax: 1
      })
    } else {
      requestUrl = 'https://api.bilibili.com/x/player/playurl'
    }
    request(requestUrl, 'get', params).then(res => {
      return res.json()
    }).then(res => {
      if (res.code != 0) {
        console.log(res.message)
        return
      }
      var tmpUrl, durl
      if (isFan) durl = res.result.durl;
      else durl = res.data.durl;
      console.log('flv共有 ',durl.length, '段')
      if (callType == 'init') {
          return
      }
      tmpUrl = durl[0].url
      if (tmpUrl.indexOf('https') !== 0) {
        tmpUrl = tmpUrl.replace('http:', 'https:');
      }
      downloadVideo(tmpUrl);
    })
  }
  function initDownloadBtn() {
      var down = document.createElement('button')
      down.id = 'downBtn'
      down.innerHTML = '下载视频';
      down.style.position = 'fixed';
      down.style.top = '50px';
      down.style.right = '20px';
      down.style.padding = '10px';
      down.style.color = '#000';
      down.style.background = 'green';
      down.style.zIndex = '2002';
      down.style.cursor = 'pointer';
      document.body.appendChild(down);
      down.onclick = function() {
          var path = window.location.pathname;
          var reg = /bangumi/;
          getVideoUrl(reg.test(path), 'notInit');
      }
  }
    function getPage() {
        var search = window.location.search
        var res = search.match(/[\?&]p=(\d+)/)
        page = res ? res[1] - 1 : 0
        console.log('这是第' + page + 'p')
    }
    getPage()
    // 初始化下载按钮
    initDownloadBtn()
    // 获取下载链接
    var path = window.location.pathname;
    var reg = /bangumi/;
    setTimeout(() => {
        getVideoUrl(reg.test(path), 'init');
    }, 2000)
    



    // 倍速播放
  var timeout
  function initSpeedNotice(speed) {
      var speedDiv
      if (speedDiv = document.getElementById('showVideoSpeed')) {
          speedDiv.style.display = 'block'
          speedDiv.innerHTML = speed + '倍速';
      } else {
          speedDiv = document.createElement('div');
          speedDiv.id = 'showVideoSpeed'
          speedDiv.innerHTML = speed + '倍速';
          speedDiv.style.position = 'absolute';
          // speedDiv.style.top = '-40px';
          speedDiv.style.right = '20px';
          speedDiv.style.padding = '10px';
          speedDiv.style.color = '#000';
          speedDiv.style.background = 'green';
          speedDiv.style.zIndex = '2002';
          document.getElementById('bilibiliPlayer').appendChild(speedDiv);
      }
      window.clearTimeout(timeout)
      timeout = setTimeout(function() {
          speedDiv.style.display = 'none'
      }, 2000)
  }
  document.addEventListener('keyup', function(e) {
    if (e.key === 'k') {
        var video = document.getElementsByTagName('video')[0]
        if (video.playbackRate >= 16) {
        } else {
            video.playbackRate = parseInt(video.playbackRate + 1)
        }
        initSpeedNotice(video.playbackRate)
    } else if ( e.key === 'l' ) {
        var video = document.getElementsByTagName('video')[0]
        if (video.playbackRate >= 2) {
            video.playbackRate = parseInt(video.playbackRate - 1)
        } else {
            
        }
        initSpeedNotice(video.playbackRate)
    }
  })
})()