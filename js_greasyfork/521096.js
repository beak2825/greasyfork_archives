// ==UserScript==
// @name         掘金-删除讨厌的手机号认证弹窗
// @namespace    fxalll
// @version      1.0.0
// @author       fxalll
// @description  掘金最近强制要求手机号认证，不然强制弹窗。本脚本可以简单地把弹窗隐藏。
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAByFBMVEUAAAAegP8fgP8egf8eev8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP////9x6/jYAAAAlnRSTlMAAAAAAAZdWwUQhvTzhA8lq/ypJHH5C3PsBAJO2dghl2AqYZg7yBGIe/itJq96CGrozkMBRdDnaQwDaAfPN7ZwCfaUlnK3OGPeGP4Z8rww4+JeMr3xWt/aUjzHU9tYw+55IKSiHw3vwjYdn/qhCh6eHHfEOsbtdVDg4ddPL7qDhbkuF/cjrJMWbOnR0mtGKLD9JxKK9Ym9ME1eAAAAAWJLR0SX5m4brwAAAAd0SU1FB+UGEgMGHcgXPyMAAAHTSURBVDjLrVNpV1JRFH1bk55AISFPAVEQQXEgFTWQVDBDUsws5yErc8rU5tGZyjFNsvt7PfcBLizAtVqeD3fdu+9+5+6z3zmCcMkBioz3OYqrIjJ8nqtUqa9dT5cE0ORpGdPe0KVhAPl6RqHPT0uQCgoZKyyQUhAAgxECjKYis0neGM6TgOISC8kHrFa6gVhqK05mAGV2plY6YhjgKFcxe1kSA8YKJ8mv1HAMqKqmYpw1xuQUrpu1pL+u3g24Gxpp23TLhUR6j5dejcPNPp9MvU1UAQYPF9TS2uZHInGg/U4g8Rj8HXeDEDpDzFlyj/8kLo11dbGYXKDb5mShTqE8TGjPfbk4Sy938kGfXPDDR8TtVwriwCCBQ8NcCEbsjI3y+uAdGyc4NCEKyGp5TNvJJx5kA0+fTT3n6acrZgicnYvVPf9igbGFl/P8Rlrk69IUIfrlV3GvIL2eJP6b4JW4k2/f0fH9B+nMKXg/mgn6JHcTRMVnOnz5es5JrKyS5vBaLnXVuprq2tj8+3dutUfIobxvuu/kV+TH9j89AdfOLmXe26el9sCVoqfg/rnH5GhscKfsOeDw6Bc9U32cvq2jv09Uf6IZZocGR5GTebQuGL3/iVNGTHdSXGp/KgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0xOFQwMzowNjoyOSswMDowMBW0AwoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMThUMDM6MDY6MjkrMDA6MDBk6bu2AAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @match        https://juejin.cn/*
// @exclude      https://juejin.cn/oauth-result/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521096/%E6%8E%98%E9%87%91-%E5%88%A0%E9%99%A4%E8%AE%A8%E5%8E%8C%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%B7%E8%AE%A4%E8%AF%81%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/521096/%E6%8E%98%E9%87%91-%E5%88%A0%E9%99%A4%E8%AE%A8%E5%8E%8C%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%B7%E8%AE%A4%E8%AF%81%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function detectPage() {
    document.querySelector('.modal-mask').style.display="none";
    document.querySelector('.bind-phone-number-form').style.display="none";
  }

  const interval = setInterval(()=>{
      detectPage();
  },100)

  setTimeout(()=>{
      clearInterval(interval);
  },8000)

})();