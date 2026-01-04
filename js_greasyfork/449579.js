// ==UserScript==
// @name         Twitter - copy clean tweet url
// @namespace    gaeulbyul.userscript
// @version      0.1.20220815
// @description  Copy the tweet url without parameters.
// @license      MIT
// @author       Gaeulbyul
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/449579/Twitter%20-%20copy%20clean%20tweet%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/449579/Twitter%20-%20copy%20clean%20tweet%20url.meta.js
// ==/UserScript==

/* NOTE
  트위터에서 "트윗 복사하기" 기능은,
  ㄱ. 안 보이는 span태그 생성
  ㄴ. 거기에 URL 삽입
  ㄷ. document.createRange와 selectNodeContents를 이용해 이를 선택
  ㄹ. document.execCommand("copy")를 통해 복사
  ...의 과정을 거친다.
  이 스크립트는 Proxy를 통해 ㄷ 과정에서 사용하는 selectNodeContents에 개입한 뒤,
  URL을 고치는 방식으로 트래킹 파라미터를 지운다.
*/

"use strict";
(function ({ Range }) {
  const snc = Range.prototype.selectNodeContents;
  Range.prototype.selectNodeContents = new Proxy(snc, {
    apply(target, self, args) {
      const span = args[0];
      let url = new URL(span.textContent);
      url.searchParams.delete("s");
      url.searchParams.delete("t");
      url = url.toString();
      // 복사하려는 URL이 있던 span 내용을 수정한다.
      span.textContent = url;
      return Reflect.apply(target, self, args);
    },
  });
})(unsafeWindow);
