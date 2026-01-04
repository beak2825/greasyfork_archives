// ==UserScript==
// @name        [개인용] 네부 과거시세
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     0.02
// @author      루시퍼홍
// @description Please use with violentmonkey
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/542510/%5B%EA%B0%9C%EC%9D%B8%EC%9A%A9%5D%20%EB%84%A4%EB%B6%80%20%EA%B3%BC%EA%B1%B0%EC%8B%9C%EC%84%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/542510/%5B%EA%B0%9C%EC%9D%B8%EC%9A%A9%5D%20%EB%84%A4%EB%B6%80%20%EA%B3%BC%EA%B1%B0%EC%8B%9C%EC%84%B8.meta.js
// ==/UserScript==


let lastAptCode = null;

function getAptCodeFromUrl() {
  const match = location.href.match(/complexes\/(\d+)/);
  return match ? match[1] : null;
}

function addHistoryPriceButton(aptCode) {
  const titleEl = document.querySelector(".complex_title");
  if (!titleEl) return;

  // 기존 버튼 제거 (코드 바뀌었을 때)
  const existing = document.getElementById("historyPriceBtn");
  if (existing) existing.remove();

  const btn = document.createElement("button");
  btn.id = "historyPriceBtn";
  btn.textContent = "📈 과거 시세 보기";
  btn.style.marginLeft = "10px";
  btn.style.padding = "4px 8px";
  btn.style.fontSize = "13px";
  btn.style.border = "1px solid #999";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";
  btn.style.backgroundColor = "#fff";

  btn.addEventListener("click", () => {
    const url = `http://luciferhong.asuscomm.com:8000/static/apt_detail.html?code=${aptCode}`;
    window.open(url, "_blank");
  });

  titleEl.appendChild(btn);
}

// 주기적으로 URL 변화 감지 및 버튼 삽입
setInterval(() => {
  const currentCode = getAptCodeFromUrl();
  if (currentCode && currentCode !== lastAptCode) {
    lastAptCode = currentCode;
    addHistoryPriceButton(currentCode);
  }
}, 500);
