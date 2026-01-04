// ==UserScript==
// @name         Fck X (Twitter)
// @license      MIT
// @namespace    zam157.fck-x
// @version      0.2
// @run-at       document-start
// @description  F**k X!
// @author       Zam157
// @homepageURL  https://github.com/zam157/tamper/tree/master/scripts/fck-x
// @supportURL   https://github.com/zam157/tamper/tree/master/scripts/fck-x
// @match        https://twitter.com/**
// @match        https://x.com/**
// @downloadURL https://update.greasyfork.org/scripts/465165/Fck%20X%20%28Twitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465165/Fck%20X%20%28Twitter%29.meta.js
// ==/UserScript==

(() => {
  // #region Filter promoted tweets
  function filterPromotedInstructions(instructions) {
    return instructions.map((instruction) => {
      if (instruction.type !== 'TimelineAddEntries')
        return instruction

      // instruction.entries = instruction.entries.filter(entry => !entry.entryId.includes('promoted-tweet'))
      instruction.entries = instruction.entries.filter((entry) => {
        if (entry.content?.itemContent?.promotedMetadata)
          return false
        if (entry.content?.items?.[0]?.item?.itemContent?.promotedMetadata)
          return false
        return true
      })
      return instruction
    })
  }
  /**
   * @param {string} json
   * @param {'timeline'|'detail'} type
   */
  function rewriteResponse(json, type) {
    const obj = JSON.parse(json)
    const instructions = (() => {
      if (type === 'timeline')
        return obj.data?.home?.home_timeline_urt?.instructions
      if (type === 'detail')
        return obj.data?.threaded_conversation_with_injections_v2?.instructions
      return null
    })()
    if (!instructions)
      return json
    const _instructions = filterPromotedInstructions(instructions)
    if (type === 'timeline')
      obj.data.home.home_timeline_urt.instructions = _instructions
    if (type === 'detail')
      obj.data.threaded_conversation_with_injections_v2.instructions = _instructions
    return JSON.stringify(obj)
  }
  // #endregion

  function inject(target, fnName, cb) {
    const originalFn = target[fnName]
    target[fnName] = function (...args) {
      cb.call(this, originalFn.bind(this), args)
    }
  }

  inject(XMLHttpRequest.prototype, 'open', function (originalFn, args) {
    const [, url] = args
    let type = null
    if (/HomeTimeline|HomeLatestTimeline/.test(url))
      type = 'timeline'
    else if (/\/api\/graphql\/.+\/TweetDetail/.test(url))
      type = 'detail'
    if (type) {
      const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response').get
      for (const propertyName of ['response', 'responseText']) {
        Object.defineProperty(this, propertyName, {
          get: () => {
            const result = getter.call(this)
            if (!result)
              return

            return rewriteResponse(result, type)
          },
        })
      }
    }

    return originalFn(...args)
  })
})()
