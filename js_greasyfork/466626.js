// ==UserScript==
// @name         InstaGrab
// @namespace    http://tampermonkey.net/
// @version      0.1.0-alpha
// @description  下载 Instagram 上的图片和视频。
// @author       cheer <cheer_cheer@alumni.tongji.edu.cn>
// @license      MIT
// @match        https://www.instagram.com/*
// @exclude      https://www.instagram.com/p/*
// @exclude      https://www.instagram.com/reels/*
// @exclude      https://www.instagram.com/explore/
// @icon         https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhB.png
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.9.1/jszip.min.js
// @connect      instagram.com
// @connect      cdninstagram.com
// @connect      fbcdn.net
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/466626/InstaGrab.user.js
// @updateURL https://update.greasyfork.org/scripts/466626/InstaGrab.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const isFunction = f => Object.prototype.toString.call(f) === '[object Function]'
  const isString = o => Object.prototype.toString.call(o) === '[object String]'

  const zfill = (n, count) => {
    return ('' + n).padStart(count, '0')
  }

  const ellipsize = (s, maxLength) => {
    if (s.length <= maxLength) {
      return s
    }

    maxLength = maxLength - 2
    let truncated = s.substring(0, maxLength)

    // 如果最后一个字符是代理字符，需要检查是否截断了代理对
    if (truncated.charCodeAt(maxLength - 1) >= 0xd800 &&
      truncated.charCodeAt(maxLength - 1) <= 0xdbff &&
      s.charCodeAt(maxLength) >= 0xdc00 &&
      s.charCodeAt(maxLength) <= 0xdfff) {
      truncated = s.substring(0, maxLength + 1)
    }

    return truncated + '……'
  }

  const getExtension = (url) => {
    const u = new URL(url, location.href)
    let path = u.pathname
    const i = path.lastIndexOf('/')
    if (i >= 0) {
      path = path.substring(i + 1)
    }

    const dotIndex = path.lastIndexOf('.')
    if (dotIndex < 0) {
      return ''
    }

    return path.substring(dotIndex)
  }

  const safeFileName = (() => {
    const INVALID_FILE_NAME_CHARS = new Set(('"<>|\0\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\v\f\r\u000e\u000f' +
      '\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f' +
      ':*?\\/').split(''))

    return (name) => {
      let safeName = ''
      for (const ch of name) {
        if (INVALID_FILE_NAME_CHARS.has(ch)) {
          safeName += '_'
        } else {
          safeName += ch
        }
      }
      return safeName
    }
  })();

  const archive = (zip, options) => {
    const opt = {
      ...options,
      type: 'blob'
    }

    let lastProgressReportTime = -1
    return zip.generateAsync(opt, (metadata) => {
      // 每隔 3 秒，在控制台汇报一次进度
      const now = +new Date()
      if (now - lastProgressReportTime < 3000) {
        return
      }

      let file = metadata.currentFile?.trim() || ''
      file = file.split('/').pop()
      if (file) {
        console.debug('归档进度：%c%s%c %% - %c%s%c',
          'color: yellow', metadata.percent.toFixed(2).padStart(6), 'color: inherit',
          'color: yellow', file.split('/').pop(), 'color: inherit')
      } else {
        console.debug('归档进度：%c%s%c %%',
          'color: yellow', metadata.percent.toFixed(2).padStart(6), 'color: inherit')
      }

      lastProgressReportTime = now
    })
  }

  const downloadBlob = (blob, filename) => {
    const link = unsafeWindow.document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename || true
    link.click()
    window.URL.revokeObjectURL(link.href)
  }

  const parseCookie = str => (str || document.cookie)
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0])] = decodeURIComponent(v[1])
      return acc
    }, {})

  const objToQueryString = obj => {
    if (!obj) {
      return ''
    }

    const qs = new URLSearchParams()
    for (const key of Object.keys(obj)) {
      const value = obj[key]
      if (Object.prototype.toString.call(value) !== '[object Array]') {
        qs.append(key, value + '')
      } else {
        for (const item of value) {
          qs.append(key, item)
        }
      }
    }
    return qs.toString()
  }

  const Constants = {
    queryHash: 'd4d88dc1500312af6f937f7b804c68c3',
    asbdId: '198387',
    appId: '936619743392459'
  }

  const getUsername = () => {
    const match = location.pathname.match(/^\/([a-z0-9_-]+?)\/?$/i)
    if (!match) {
      return ''
    }
    const group = match[1]
    if (group === 'explore') {
      return ''
    }
    return decodeURI(group || '')
  }

  const getPostItems = posts => {
    const items = []

    for (const item of posts.items || []) {
      const caption = item.caption?.text || ''
      const media = []

      if (item.video_versions) {
        const video = item.video_versions[0]
        if (video) {
          media.push({
            id: video.id,
            code: item.code,
            video: true,
            width: video.width,
            height: video.height,
            url: video.url
          })
        }
      } else if (item.carousel_media) {
        for (const m of item.carousel_media) {
          const mi = getMediaInfo(m)
          if (mi) {
            mi.code = item.code
            media.push(mi)
          }
        }
      } else {
        const mi = getMediaInfo(item)
        if (mi) {
          mi.code = item.code
          media.push(mi)
        }
      }

      let takenAt = item.taken_at
      if (takenAt) {
        takenAt = new Date(takenAt * 1000)
      } else {
        takenAt = undefined
      }

      items.push({
        caption,
        media,
        takenAt
      })
    }

    return items
  }

  const getMediaInfo = m => {
    const id = m.id
    const originalHeight = m.original_height
    const originalWidth = m.original_width

    let originalMediaUrl
    const mediaCandidates = m.image_versions2?.candidates || []
    for (const c of mediaCandidates) {
      if (c.width === originalWidth && c.height === originalHeight) {
        originalMediaUrl = c.url
        break
      }
    }
    if (!originalMediaUrl) {
      originalMediaUrl = mediaCandidates[0].url
    }

    if (!originalMediaUrl) {
      return null
    }

    return {
      id: id,
      video: false,
      width: originalWidth,
      height: originalHeight,
      url: originalMediaUrl
    }
  }

  class Instagram {
    constructor() {
      this._username = getUsername()
    }

    get username() {
      return this._username
    }

    get userId() {
      return this._userId
    }

    set userId(value) {
      this._userId = value
    }

    get queryHash() {
      return Constants.queryHash
    }

    get asbdId() {
      return Constants.asbdId
    }

    get appId() {
      return Constants.appId
    }

    get csrfToken() {
      if (this._csrfToken === undefined) {
        this._csrfToken = parseCookie().csrftoken
      }
      return this._csrfToken
    }

    get wwwClaim() {
      if (this._wwwClaim === undefined) {
        this._wwwClaim = sessionStorage.getItem('www-claim-v2') || '0'
      }
      return this._wwwClaim
    }

    get rolloutHash() {
      if (this._rolloutHash === undefined) {
        this._rolloutHash = (() => {
          const el = document.querySelector('[data-btmanifest$=_main]')
          if (!el) {
            return ''
          }
          const value = el.getAttribute('data-btmanifest')
          return value.substring(0, value.length - 5)
        })()
      }
      return this._rolloutHash
    }

    _executeApi({ method, url, params, data, headers }) {
      const qs = objToQueryString(params)
      if (qs) {
        url = url + '?' + qs
      }

      const getOptions = (resolve, reject) => {
        const options = {
          method: method || 'GET',
          url,
          headers: Object.assign({
            'origin': location.origin,
            'referer': document.referer || 'https://www.instagram.com/',
            'x-asbd-id': this.asbdId,
            'x-csrftoken': this.csrfToken,
            'x-ig-app-id': this.appId,
            'x-ig-www-claim': this.wwwClaim,
            'x-instagram-ajax': this.rolloutHash,
            'x-requested-with': 'XMLHttpRequest'
          }, headers || {}),
          responseType: 'json',
          onload(r) {
            const resp = r.response
            if (Object.prototype.toString.call(resp) === '[object Object]') {
              if (resp.status === 'ok') {
                resolve(resp)
                return
              }

              const err = new Error('接口返回的状态不正确。')
              err.name = 'ApiStatusError'
              err.response = r
              reject(err)
              return
            }

            const err = new Error('接口返回的内容无法解析。')
            err.name = 'UnexpectedApiResponseError'
            err.response = r
            reject(err)
          },
          onerror() {
            console.error(arguments)
            const err = new Error('接口调用失败。')
            err.name = 'UnhandledApiError'
            reject(err)
          }
        }

        if (data !== undefined) {
          options.data = isString(data) ? data : JSON.stringify(data)
        }

        return options
      }

      return new Promise((resolve, reject) => GM_xmlhttpRequest(getOptions(resolve, reject)))
    }

    getPosts(maxId) {
      const params = {
        count: 12
      }
      if (maxId) {
        params.max_id = maxId
      }

      let url
      if (this.userId) {
        url = `https://i.instagram.com/api/v1/feed/user/${encodeURI(this.userId)}/`
      } else {
        url = `https://i.instagram.com/api/v1/feed/user/${encodeURI(this.username)}/username/`
      }

      return this._executeApi({
        url,
        params
      })
    }
  }

  const downloadMedia = (media, item) => {
    return new Promise((resolve, reject) => {
      let accept = 'image/jpg,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      if (media.video) {
        accept = '*/*'
      }
      GM_xmlhttpRequest({
        method: 'GET',
        url: media.url,
        responseType: 'blob',
        timeout: 45_000,
        headers: {
          accept
        },
        onload(r) {
          if (200 < r.status || r.status > 299) {
            const err = new Error(`媒体资源下载失败，服务器返回 HTTP ${r.status}。`)
            err.name = 'HttpStatusError'
            err.status = r.status
            err.response = r
            reject(err)

            return
          }
          resolve({
            media,
            item,
            content: r.response
          })
        },
        ontimeout() {
          const err = new Error('媒体资源下载超时。')
          err.name = 'TimeoutError'
          reject(err)
        },
        onerror(r) {
          const err = new Error('媒体资源下载失败。')
          err.name = 'HttpError'

          if (r) {
            err.response = r
            if (r.error != null) {
              err.error = r.error
            }
          }

          reject(err)
        }
      })
    })
  }

  const download = async ({
    onUserResolved,
    onPostsFetched,
    onMediaDownloaded,
    onMediaDownloadFailed,
  }) => {
    const ins = new Instagram()

    let seq = 0
    const promises = []
    let nextMaxId = null
    while (true) {
      const posts = await ins.getPosts(nextMaxId)
      nextMaxId = posts.next_max_id

      if (!ins.userId) {
        // set user id
        ins.userId = posts.user?.pk
        if (onUserResolved) {
          await onUserResolved(posts.user)
        }
      }

      const items = getPostItems(posts)

      for (const item of items) {
        for (const m of item.media) {
          seq++
          const seqNo = seq
          const promise = downloadMedia(m, item)
            .then(async r => {
              r.seq = seqNo
              if (isFunction(onMediaDownloaded)) {
                await onMediaDownloaded(r)
              }
              return r
            })
            .catch(async e => {
              if (isFunction(onMediaDownloadFailed)) {
                await onMediaDownloadFailed(e)
              }
              throw e
            })

          promises.push(promise)
        }
      }

      if (isFunction(onPostsFetched)) {
        await onPostsFetched(posts, items)
      }

      if (!posts.more_available || !posts.next_max_id) {
        console.log('下载完成啦。')
        break
      }
    }

    const results = await Promise.allSettled(promises)
    console.log('Results:', results)
  }

  const downloadAsZip = async () => {
    try {
      const zip = new JSZip()
      let user
      let userdir

      await download({
        onUserResolved(u) {
          user = u
          // 在 zip 文件中创建用户目录
          userdir = zip.folder(safeFileName(u.username))
        },
        onPostsFetched(posts, items) {
          const mediaCount = items.map(x => x.media.length).reduce((a, b) => a + b, 0)
          console.log(`本次采集到 ${items.length} 个帖子，${mediaCount} 个图片/视频资源。`)
        },
        onMediaDownloaded(e) {
          // console.log('下载啦：', e)

          const caption = e.item.caption || e.media.id
          const ext = getExtension(e.media.url)
          const fileName = `${zfill(e.seq, 4)} - ${ellipsize(caption, 36)}${ext}`
          userdir.file(safeFileName(fileName), e.content, {
            date: e.item.takenAt || new Date(),
            comment: `${e.item.caption}  https://www.instagram.com/p/${e.media.code}/`.trim()
          })
        },
        onMediaDownloadFailed(e) {
          i++
          console.error('下载失败啦', e)
        }
      })

      console.log('下载完成，正在归档文件。')
      const blob = await archive(zip, {
        comment: `Instagram: https://www.instagram.com/${encodeURIComponent(user.username)}/`
      })
      console.log('归档完成，准备下载。')
      downloadBlob(blob, safeFileName(user.full_name || user.username) + '.zip')
    } catch (e) {
      alert('下载失败。')
      console.error('下载失败。', e)
    }
  }

  GM_registerMenuCommand('下载 TA 的帖子', downloadAsZip)
})()