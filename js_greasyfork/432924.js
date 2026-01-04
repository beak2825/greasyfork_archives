// ==UserScript==
// @name                  [DEBUG] Log Exception Cause
// @name:zh-CN            [DEBUG] 异常诱因日志
// @version               1.0.4.20210925
// @namespace             laster2800
// @author                Laster2800
// @description           Log exception cause, see https://github.com/tc39/proposal-error-cause
// @description:zh-CN     记录异常诱因，详见 https://github.com/tc39/proposal-error-cause
// @homepageURL           https://greasyfork.org/zh-CN/scripts/432924
// @supportURL            https://greasyfork.org/zh-CN/scripts/432924/feedback
// @license               LGPL-3.0
// @include               *
// @grant                 none
// @run-at                document-start
// @downloadURL https://update.greasyfork.org/scripts/432924/%5BDEBUG%5D%20Log%20Exception%20Cause.user.js
// @updateURL https://update.greasyfork.org/scripts/432924/%5BDEBUG%5D%20Log%20Exception%20Cause.meta.js
// ==/UserScript==

(function() {
  'use strict'

  window.addEventListener('error', log)
  window.addEventListener('unhandledrejection', log)

  function log(event) {
    const cause = (event.error ?? event.reason)?.cause
    if (cause !== undefined) {
      console.error('↓ Error is caused by %o', cause)
    }
  }
})()
