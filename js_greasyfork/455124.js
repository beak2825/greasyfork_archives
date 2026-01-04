/* eslint-disable no-extra-semi */
// ==UserScript==
// @name         九酷音乐下载
// @namespace    https://greasyfork.org/zh-CN/users/455124
// @version      0.0.1
// @description  九酷音乐下载工具，一键下载MP3文件，一键复制歌曲文件名
// @author       gafish
// @match        https://www.9ku.com/play/*.htm
// @icon         https://www.google.com/s2/favicons?domain=9ku.com
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/copy-to-clipboard@3.3.1/example/index.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455124/%E4%B9%9D%E9%85%B7%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455124/%E4%B9%9D%E9%85%B7%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

;(function (jQuery, copyToClipboard) {
  'use strict'

  const box = jQuery('.ppBox')
  const feifa = jQuery('#feifa')

  const downloadedKey = 'chrome_plugin_downloaded'

  let musicInfo

  const init = () => {
    const { singer, musicname, song_id, meida } = window
    const { mp3 } = meida

    musicInfo = {
      singer,
      musicName: musicname,
      songID: song_id,
      mp3URL: mp3,
      downloadFileName: `${singer} - ${musicname}.mp3`,
    }

    if (!box[0]) return

    box.css({ height: 340 })

    addDownloadButton()
    addMp3FileName()

    hidePalylistAd()

    const downloaded = getDownloaded()

    if (downloaded.includes(musicInfo.songID)) {
      addDownloadedTag()
    }
  }
  const getDownloaded = () => {
    const downloaded = window.localStorage[downloadedKey] || '[]'
    const downloadedArr = JSON.parse(downloaded)

    return downloadedArr
  }
  const addDownloadButton = () => {
    if (!box || !musicInfo) return

    const downloadBtn = jQuery(`
      <a
        href="${musicInfo.mp3URL}"
        download=${musicInfo.downloadFileName.replace(/\s/g, '_')}
        target="_blank"
      >
        下载MP3文件
      </a>
    `)

    downloadBtn
      .css({
        display: 'block',
        backgroundColor: '#f00',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: 5,
        margin: 10,
        textAlign: 'center',
        height: 30,
        lineHeight: '30px',
      })
      .contextmenu(() => {
        const downloaded = getDownloaded()

        if (!downloaded.includes(musicInfo.songID)) {
          downloaded.push(musicInfo.songID)
          window.localStorage[downloadedKey] = JSON.stringify(downloaded)
        }

        addDownloadedTag()
      })

    box.append(downloadBtn)
  }
  const addMp3FileName = () => {
    if (!box || !musicInfo) return

    const fileNameContaner = jQuery(`
      <div>
        点击复制文件名
        <b></b><br />
        ${musicInfo.downloadFileName}
      </div>
    `)
    fileNameContaner
      .css({
        display: 'block',
        backgroundColor: '#ccc',
        color: '#000',
        padding: '5px 10px',
        borderRadius: 5,
        margin: 10,
        textAlign: 'center',
        height: 40,
        lineHeight: '20px',
        cursor: 'pointer',
      })
      .click(() => {
        copyToClipboard(musicInfo.downloadFileName)
        fileNameContaner.find('b').text('已复制')
      })

    box.append(fileNameContaner)
  }
  const addDownloadedTag = () => {
    if (box.find('#downloaded').length) return

    const downloadedTag = jQuery(`
      <div id="downloaded">
      <b>已下载</b>
      </div>
    `)

    downloadedTag.css({
      position: 'absolute',
      top: -10,
      left: -10,
      zIndex: 99,
      backgroundColor: 'yellow',
      color: '#f00',
      borderRadius: '50%',
      border: '1px solid #f00',
      textAlign: 'center',
      width: 25,
      height: 25,
      lineHeight: '50px',
      transform: 'rotate(-45deg)',
    })
    box.prepend(downloadedTag)
  }
  const hidePalylistAd = () => {
    let i = 0
    const findAdLi = () => {
      if (i > 1000) return

      const sprr = jQuery('#songlist li[id]')

      setTimeout(() => {
        findAdLi()
        i++
      }, 1000)

      sprr.hide()
    }

    findAdLi()
  }
  const reShowPlayer = () => {
    feifa.html(`
      <div class="playingTit" style="color: yellow;">该歌曲侵犯相关权益人权利，九酷原站不提供试听</div>
      <div id="lrctext" style="display: none">
        <textarea id="lrc_content" style="display: block">[00:00.00]</textarea>
      </div>
      <div class="oldPlayer">
        <div id="jp_container_1" class="jp-audio">
          <div class="jp-type-single">
            <div class="jp-interface clearfix">
              <div class="playerMain-01">
                <div class="playName">
                </div>
                <div class="jp-time-holder">
                  <div class="jp-current-time">00:00</div>
                  /
                  <div class="jp-duration">00:00</div>
                </div>
              </div>
              <div class="playerMain-02">
                <div class="jp-progress">
                  <div class="jp-seek-bar" style="width: 0%">
                    <div class="jp-play-bar" style="width: 0%"></div>
                  </div>
                </div>
              </div>
              <div class="playerMain-03">
                <div class="fl">
                  <ul class="jp-controls">
                    <li>
                      <a
                        href="javascript:{};"
                        onclick="javascript:vy.z=1;downlog(song_id,2,timeupd1);pu.PlayNext(-1);"
                        class="jp-previous"
                        tabindex="1"
                        title="按键盘上的‘↑’或‘←’键切换到上一首"
                        >上一首</a
                      >
                    </li>
                    <li>
                      <a
                        href="javascript:{};"
                        class="jp-play"
                        tabindex="1"
                        title="按键盘上的‘space(空格)’键在播放与暂停之间切换"
                        >播放</a
                      >
                    </li>
                    <li>
                      <a
                        href="javascript:{};"
                        class="jp-pause"
                        tabindex="1"
                        title="按键盘上的‘space(空格)’键在播放与暂停之间切换"
                        >暂停</a
                      >
                    </li>
                    <li>
                      <a
                        href="javascript:{};"
                        onclick="javascript:vy.z=1;downlog(song_id,2,timeupd1);pu.PlayNext(1);"
                        class="jp-next"
                        tabindex="1"
                        title="按键盘上的‘→’或‘↓’键切换到下一首"
                        >下一首</a
                      >
                    </li>
                  </ul>
                </div>
                <div class="fr">
                  <ul class="ku-volume">
                    <li>
                      <a
                        href="javascript:{};"
                        class="jp-mute"
                        tabindex="1"
                        title="静音"
                        >静音</a
                      >
                    </li>
                    <li>
                      <a
                        href="javascript:{};"
                        class="jp-unmute"
                        style="display: none"
                        tabindex="1"
                        title="取消静音"
                        >取消静音</a
                      >
                    </li>
                    <li class="volume-bar-wrap">
                      <div class="jp-volume-bar">
                        <div class="jp-volume-bar-value" style="width: 80%"></div>
                      </div>
                    </li>
                    <li>
                      <a
                        href="javascript:{};"
                        class="jp-volume-max"
                        tabindex="1"
                        title="最大音量"
                        >最大音量</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    window.ndPlayer = new window.KuPlayer()
    window.musiclist()
  }
  const checkMp3 = () => {
    if (!window.meida.mp3) {
      setTimeout(checkMp3, 200)
      return
    }

    init()
  }

  // 非法音乐，重新显示播放器
  if (feifa) {
    reShowPlayer()
  }

  checkMp3()
})(window.jQuery, window.copyToClipboard)
