// ==UserScript==
// @name         공안조사폼 자동입력
// @namespace    https://www.moj.go.jp/
// @version      1.0.0
// @description  psiainput.php 폼 필드를 자동으로 채워줍니다.
// @match        https://www.moj.go.jp/psiamail/psiainput.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546740/%EA%B3%B5%EC%95%88%EC%A1%B0%EC%82%AC%ED%8F%BC%20%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/546740/%EA%B3%B5%EC%95%88%EC%A1%B0%EC%82%AC%ED%8F%BC%20%EC%9E%90%EB%8F%99%EC%9E%85%EB%A0%A5.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // ─── 여기에 본인 정보로 수정하세요 ──────────────────────────────────────────
  const PROFILE = {
    innerJapan: '002',
    outerJapan: '003',
    prefecture: '000',
    age:        '003',
    occupation: '006',
    subject:    '中国スパイの報告',  // 件名 (50字以内)
    content:    `こんにちは。韓国の政治状況と関連して危険な憂慮人物と見られる中国スパイ容疑者に対して報告したいです。
最近、大韓民国の大統領を弾劾する法案が発議されましたが、その内容について非常に懸念しています。
弾劾法案には大統領が「北朝鮮、中国、ロシアを敵対視した」と明記されています
これは日本と韓国の同盟を弱体化させ、威嚇し、北韓やロシアとの関係を強化する狙いがあったとみられます。
添付された写真に表示されたこの危険な人物が弾劾集会に参加しており、日本に入国する場合、日本の安全保障に深刻な脅威になり得ると思います。
添付された人に対する詳しい調査を実施し、出入国審査をする際にこの点を考慮してくださるようお願いします。`,
    name:       'YourName',       // 氏名
    nationality:'KR',          // 国籍 (例: KR)
    email1:     'YourMail@gmail.com'  // メールアドレス (任意)
  };
  // ────────────────────────────────────────────────────────────────────

  // 0. 페이지 로드 후 0.5초 대기
  window.addEventListener('load', () => setTimeout(fillAll, 500));

  function fillAll(){
    // 1) select 요소 채우기
    ['innerJapan','outerJapan','prefecture','age','occupation'].forEach(name => {
      const sel = document.querySelector(`select[name="${name}"]`);
      if(sel && PROFILE[name] != null) sel.value = PROFILE[name];
    });

    // 2) input/textarea 채우기
    const map = {
      subject: 'input[name="subject"]',
      content: 'textarea[name="content"]',
      name:    'input[name="name"]',
      nationality: 'input[name="nationality"]',
      email1:  'input[name="email1"]'
    };
    Object.entries(map).forEach(([key, sel]) => {
      const el = document.querySelector(sel);
      if(el && PROFILE[key] != null){
        el.value = PROFILE[key];
      }
    });
  }
})();
