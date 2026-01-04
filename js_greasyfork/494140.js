// ==UserScript==
// @name					Tieba No App
// @namespace			xuyiming.open@outlook.com
// @author				依然独特
// @description		解除百度贴吧强制 App 跳转
// @version				0.0.3
// @run-at				document-end
// @include				https://tieba.baidu.com/f*
// @include				https://tiebac.baidu.com/f*
// @include				https://tieba.baidu.com/p/*
// @include				https://tiebac.baidu.com/p/*
// @match					https://tieba.baidu.com/f*
// @match					https://tiebac.baidu.com/f*
// @match					https://tieba.baidu.com/p/*
// @match					https://tiebac.baidu.com/p/*
// @grant					unsafeWindow
// @license				CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/494140/Tieba%20No%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/494140/Tieba%20No%20App.meta.js
// ==/UserScript==

(function () {
  // Only on desktop site `PageData' will be defined
  if (unsafeWindow.PageData != null) {
    return
  } else {
    // Make Tieba thinks it is in baidu box app
    Object.defineProperties(navigator, Object.getOwnPropertyDescriptors({
      userAgent: 'Mozilla/5.0 baiduboxapp0'
    }))

    // We need `this' binding
    const filterIframeSet = function (value) {
      const url = new URL(value)

      // Hook up baiduboxapp protocol
      if (url.protocol === 'baiduboxapp:') {
        const data = JSON.parse(decodeURIComponent(url.searchParams.get('params')))

        // Hook up deeplink target
        if (url.pathname === '//v7/vendor/ad/deeplink') {
          const appUrl = new URL(data.appUrl)

          // Hook up Tieba target
          if (appUrl.protocol === 'com.baidu.tieba:') {
            onTiebaUrl(appUrl)
          }
        }

        // Ignore other targets
      } else {
        setIframeSrc.call(this, value)
      }
    }

    const onTiebaUrl = url => {
      const i = url.pathname.lastIndexOf('/')

      const path = url.pathname.slice(2, i)
      const page = url.pathname.slice(i + 1)

      const data1 = restoreData1(url.searchParams)

      const data = {
        ...data1,
        param: {
          ...data1.param,
          ...restoreData2(page, url.searchParams),
        }
      }

      // Real navigation
      if ('pb' === page && data.param.tid) {
        location.assign(`https://tieba.baidu.com/p/${data.param.tid}`)
      }

    }

    const restoreData1 = searchParams => {
      const {
        fr: _fr,  // 'bpush'
        bdid, _bdid,
        qd: _qd,  // 'scheme
        downchannel: _downchannel,
        refer, _refer,
        eqid, _eqid,
        target_scheme,
        obj_locate,
        obj_source,
        obj_name,
        obj_param2,
        has_token,
        extdata,
        ...custom
      } = Object.fromEntries(searchParams)

      return {
        param: {
          obj_locate: obj_locate,
          obj_obj_source: obj_source,
          obj_originSource: obj_name,
          clear_token: has_token,
          extdata: extdata,
          ...custom
        },
        browser: obj_param2,
        target_scheme,
      }
    }

    const restoreData2 = (page, searchParams) => {
      const t = Object.fromEntries(searchParams)

      if ('pb' === page) {
        if (t.tid) {
          return { tid: t.tid }
        } else {
          return {
            ori_ugc_nid: t.ori_ugc_nid,
            ori_ugc_tid: t.ori_ugc_tid,
            ori_ugc_type: t.ori_ugc_type,
            ori_ugc_vid: t.ori_ugc_vid,
          }
        }
      } else if ('frs' === page && t.kw) {
        return { kw: t.kw }
      } else if ('tbwebview' === page && t.url) {
        return { url: t.url }
      } else if ('usercenter' === page && t.portrait) {
        return { portrait: t.portrait }
      } else if ('topicdetail' === page && t.topic_id) {
        return { topic_id: t.topic_id }
      } else if ('item' === page && t.item_id) {
        return { item_id: t.item_id }
      } else if ('voiceRoom' === page && t.room_id) {
        return { room_id: t.room_id }
      } else if ('router/portal' === page && t.params) {
        return { routerParams: t.params }
      } else if ('searchResultPage' === page && t.query) {
        return { query: t.query }
      }
    }

    // Tieba uses <iframe> src to launch native activity
    const { set: setIframeSrc, ...setIframeAttrs } = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src')

    Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
      ...setIframeAttrs,
      set: filterIframeSet
    })
  }
})()