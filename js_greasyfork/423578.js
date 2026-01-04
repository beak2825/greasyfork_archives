// ==UserScript==
// @name         直播录屏工具（防崩溃版）
// @namespace    https://segmentfault.com/a/1190000025182822
// @version      0.1
// @description  此脚本打开后直接注入，无需操作，自动下载，用于各种无法下载环境。如果下载时询问位置，需要设置浏览器默认保存位置，之后可以保存到默认位置。
// @author       脚本作者AlanIIE
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423578/%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F%E5%B7%A5%E5%85%B7%EF%BC%88%E9%98%B2%E5%B4%A9%E6%BA%83%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/423578/%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F%E5%B7%A5%E5%85%B7%EF%BC%88%E9%98%B2%E5%B4%A9%E6%BA%83%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==





(function () {

    let _sourceBufferList = []
    let $btnDownload = document.createElement('div')
    let $downloadNum = document.createElement('div')
    let $tenRate = document.createElement('div') // 十倍速播放
    let $oneRate = document.createElement('div') // 一倍速播放

    // 十倍速播放
    function _tenRatePlay () {
        let $domList = document.getElementsByTagName('video')
        for (let i = 0, length = $domList.length; i < length; i++) {
            const $dom = $domList[i]
            $dom.playbackRate = 10
        }
    }
    // 一倍速播放
    function _oneRatePlay () {
        let $domList = document.getElementsByTagName('video')
        for (let i = 0, length = $domList.length; i < length; i++) {
            const $dom = $domList[i]
            $dom.playbackRate = 1
        }
    }


    // 自动下载//
    function _auto_download() {//
      _sourceBufferList.forEach((target) => {//
        const mime = target.mime.split(';')[0]//
        const type = mime.split('/')[1]//
        const fileBlob = new Blob(target.bufferList, { type: mime }) // 创建一个Blob对象，并设置文件的 MIME 类型//
        const a = document.createElement('a')//
        a.download = `${document.title}.${type}`//
        a.href = URL.createObjectURL(fileBlob)//
        a.style.display = 'none'//
        document.body.appendChild(a)//
        a.click()//
        a.remove()//
      })//
    }//

    // 下载资源
    function _download () {
        _sourceBufferList.forEach((target) => {
            const mime = target.mime.split(';')[0]
            const type = mime.split('/')[1]
            const fileBlob = new Blob(target.bufferList, { type: mime }) // 创建一个Blob对象，并设置文件的 MIME 类型
            const a = document.createElement('a')
            a.download = `${document.title}.${type}`
      a.href = URL.createObjectURL(fileBlob)
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
        })
    }

    // 监听资源全部录取成功
    let _endOfStream = window.MediaSource.prototype.endOfStream
    window.MediaSource.prototype.endOfStream = function () {
        alert('资源全部捕获成功，即将下载！')
        _download()
        _endOfStream.call(this)
    }

    // 录取资源
    let _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
    window.MediaSource.prototype.addSourceBuffer = function (mime) {
        console.log(mime)
        let sourceBuffer = _addSourceBuffer.call(this, mime)
        let _append = sourceBuffer.appendBuffer
        let bufferList = []
        _sourceBufferList.push({
            mime,
            bufferList,
        })
        sourceBuffer.appendBuffer = function (buffer) {
            let step_length = 10000
            $downloadNum.innerHTML = `已捕获 ${_sourceBufferList[0].bufferList.length} 个片段`
            bufferList.push(buffer)
            _append.call(this, buffer)
            if (_sourceBufferList[0].bufferList.length%step_length === 0) {//
                _auto_download()//下载当前已加载视频文件
                bufferList.splice(1, step_length, buffer)//删除当前缓存
            }//
        }
        return sourceBuffer
    }

    // 添加操作的 dom
    function _appendDom () {
        const baseStyle = `
      position: fixed;
      top: 50px;
      right: 50px;
      height: 40px;
      padding: 0 20px;
      z-index: 9999;
      color: white;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      background-color: #3498db;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    `
    $tenRate.innerHTML = '十倍速捕获'
        $oneRate.innerHTML = '一倍速捕获'
        $downloadNum.innerHTML = '已捕获 0 个片段'
        $btnDownload.innerHTML = '下载已捕获片段'
        $tenRate.style = baseStyle + `top: 150px;`
    $oneRate.style = baseStyle + `top: 200px;`
    $btnDownload.style = baseStyle + `top: 100px;`
    $downloadNum.style = baseStyle
    $btnDownload.addEventListener('click', _download)
    $tenRate.addEventListener('click', _tenRatePlay)
    $oneRate.addEventListener('click', _oneRatePlay)
    document.getElementsByTagName('html')[0].insertBefore($tenRate, document.getElementsByTagName('head')[0]);
    document.getElementsByTagName('html')[0].insertBefore($oneRate, document.getElementsByTagName('head')[0]);
    document.getElementsByTagName('html')[0].insertBefore($downloadNum, document.getElementsByTagName('head')[0]);
    document.getElementsByTagName('html')[0].insertBefore($btnDownload, document.getElementsByTagName('head')[0]);
}

_appendDom()
})()


