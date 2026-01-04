// ==UserScript==
// @name         添加manhuagui自適應高度功能
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  在manhuagui縮放選項右側添加高度自適應，並自動滾動到圖片所在位置
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://*.manhuagui.com/comic/*/*.html
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543097/%E6%B7%BB%E5%8A%A0manhuagui%E8%87%AA%E9%81%A9%E6%87%89%E9%AB%98%E5%BA%A6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/543097/%E6%B7%BB%E5%8A%A0manhuagui%E8%87%AA%E9%81%A9%E6%87%89%E9%AB%98%E5%BA%A6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function(){
  document.head.appendChild(document.createElement("style")).textContent =
    ".tbCenter{width:auto!important;height:auto!important}.sub-btn{width:fit-content}";
  const autoKey = "mhg_autoHeight", scrollKey = "mhg_scroll";
  const imgs = () => [...document.querySelectorAll("#mangaBox img.mangaFile")];
  let scrollThrottle = null;
  const apply = () => {
    imgs().forEach(img => {
      const setStyle = () => {
        if(localStorage.getItem(autoKey) === "true"){
          img.style.height = "98vh";
          img.style.width = "auto";
          img.style.maxWidth = "100vw";
          img.style.objectFit = "contain";
        } else {
          img.style.height = "";
          img.style.width = "";
          img.style.maxWidth = "";
          img.style.objectFit = "";
        }
      };
      setStyle();
      if (!img.complete && !img._styleSet) {
        img.addEventListener("load", () => {
          setStyle();
          img._styleSet = true;
        }, {once: true});
      }
    });
  };
  const toggle = () => {
    const auto = localStorage.getItem(autoKey) !== "true";
    localStorage.setItem(autoKey, auto ? "true" : "false");
    apply();
    document.getElementById("auto-height-checkbox").checked = auto;
  };
  const insertBtn = () => {
    const tool = document.querySelector("#tool-zoom");
    if(!tool || document.getElementById("auto-height-btn")) return;
    const li = tool.parentElement,
          btn = document.createElement("li");
    btn.id = "auto-height-btn";
    btn.className = "pfunc";
    btn.innerHTML = '<label style="cursor:pointer;color:red;">' +
                      '<input type="checkbox" id="auto-height-checkbox" style="vertical-align:middle;margin-right:4px;">自適應高度' +
                    '</label>';
    btn.querySelector("input").addEventListener("change", toggle);
    li.insertAdjacentElement("afterend", btn);
    if(localStorage.getItem(autoKey) === null) localStorage.setItem(autoKey, "false");
    document.getElementById("auto-height-checkbox").checked = localStorage.getItem(autoKey) === "true";
    apply();
  };
  const updateScrollIndex = () => {
    if (scrollThrottle) return;
    scrollThrottle = setTimeout(() => {
      const im = imgs();
      let idx = 0, min = Infinity;
      im.forEach((img, i) => {
        const d = Math.abs(img.getBoundingClientRect().top);
        if(d < min){ min = d; idx = i; }
      });
      localStorage.setItem(scrollKey, idx);
      scrollThrottle = null;
    }, 150);
  };
  const scrollAfterLoaded = () => {
    const im = imgs(), idx = +(localStorage.getItem(scrollKey)) || 0;
    const promises = im.filter(img => !img.complete)
                       .map(img => new Promise(res => img.addEventListener("load", res, {once: true})));
    Promise.all(promises).then(() =>
      setTimeout(() => im[idx]?.scrollIntoView({behavior:"auto", block:"start"}), 100)
    );
  };
  window.addEventListener("scroll", updateScrollIndex);
  window.addEventListener("resize", apply);
  const observer = new MutationObserver(() => {
    insertBtn();
    apply();
    scrollAfterLoaded();
  });
  observer.observe(document.body, {childList: true, subtree: true});
  insertBtn();
  const box = document.getElementById("mangaBox");
  if(box && !box._autoObs){
    new MutationObserver(() => { apply(); scrollAfterLoaded(); })
      .observe(box, {childList: true, subtree: true});
    box._autoObs = true;
  }
  scrollAfterLoaded();
})();