// ==UserScript==
// @name        随机播放全员语音
// @namespace   null
// @match       https://nanabunnonijyuuni-mobile.com/s/n110/mypage
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @grant       unsafeWindow
// @version     2.2
// @author      fbz
// @description 2020/9/16 上午11:58:45
// @downloadURL https://update.greasyfork.org/scripts/411427/%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E5%85%A8%E5%91%98%E8%AF%AD%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/411427/%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E5%85%A8%E5%91%98%E8%AF%AD%E9%9F%B3.meta.js
// ==/UserScript==
$(function() {
  /**
   * 分为通常和季节语音
   * 通常只有201912录的 src为/${date}/${member}/1~3/1~3.mp3 例：/files/4/n110/mypage/audio/201912/a11/1/2.mp3
   * 季节有201912和202007 src为/${date}/${member}/commom/1~3.mp3 例：/files/4/n110/mypage/audio/202007/a11/common/2.mp3
   * */
  var baseSrc = '/files/4/n110/mypage/audio'
  var FILE_PATH = "/files/4/n110/mypage/"
  var dateArr = ['201912', '202007', '202102', '202104']
  var membersObj = { //处理成此数据格式
    'a11': {
      'common': {
        '201912': [],
        '202007': []
      },
      'other': {
        '201912': []
      }
    }
  }
  for (var i = 1; i <= 12; i++) {
    var member = `a${i}`
    var other201912 = []
    for (var j = 1; j <= 3; j++) {
      for (var k = 1; k <= 3; k++) {
        other201912.push(`${baseSrc}/201912/${member}/${j}/${k}.mp3`)
      }
    }
    var commomObj = {}
    dateArr.forEach(date => {
      var arr = []
      for (let j = 1; j <= 3; j++) {
        arr.push(`${baseSrc}/${date}/${member}/common/${j}.mp3`)
      }
      commomObj[date] = arr
    })

    membersObj[member] = {
      'common': {
        ...commomObj
      },
      'other': {
        '201912': other201912
      }
    }
  }
  delete membersObj.a9 //a9是meimei 没有语音
  delete membersObj.a12.common['201912'] //a12阿诗 没有冬季语音
  console.log('membersObj', membersObj)

  function getRandomSrc(item) {
    // 随机取一个链接 如果item为数组时说明到了最底层
    if (typeof item === 'object' && Array.isArray(item)) {
      return item[Math.floor(Math.random() * item.length)]
    } else {
      var keys = Object.keys(item)
      return getRandomSrc(item[keys[Math.floor(Math.random() * keys.length)]])
    }
  }

  var playBtn_1 = $('#js-btn1');
  playBtn_1.unbind() // 清除原事件

  var audio = document.createElement('audio');
  audio.addEventListener("ended", function() {
    if (playBtn_1.hasClass('is-active')) {
      playBtn_1.removeClass('is-active');
      $('img', playBtn_1).attr('src', FILE_PATH + 'img/button_play.svg');
    }
  }, false) // 播放结束后重置按钮为播放

  playBtn_1.click(function() {
    audio.src = getRandomSrc(membersObj);
    console.log('src', audio.src);
    console.log('played', audio.played);
    console.log('paused', audio.paused);

    $(this).toggleClass('is-active');
    if ($(this).hasClass('is-active')) {
      $(this).find('img').attr('src', FILE_PATH + 'img/button_stop.svg');
      audio.play();
    } else {
      $(this).find('img').attr('src', FILE_PATH + 'img/button_play.svg');
      audio.pause();
    }
  })
})
