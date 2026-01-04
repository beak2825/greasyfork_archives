// ==UserScript==
// @name           MAL Title Copy Button
// @name:tr        MAL Başlık Kopyalama Düğmesi
// @namespace      https://greasyfork.org/en/users/1500762-kerimdemirkaynak
// @match          https://myanimelist.net/anime/*
// @run-at         document-end
// @version        1.6
// @license        MIT License
// @author         Kerim Demirkaynak
// @icon           https://cdn.myanimelist.net/images/favicon.ico
// @description Adds a button to MyAnimeList anime pages to copy the title with one click.
// @description:tr MyAnimeList anime sayfasına, başlığı tek tıkla kopyalamak için buton ekler.
// @downloadURL https://update.greasyfork.org/scripts/544366/MAL%20Title%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544366/MAL%20Title%20Copy%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Dil metinlerini tanımla
  const i18n = {
    en: {
      copy: "📋 Copy Title",
      copied: "✅ Copied!",
    },
    tr: {
      copy: "📋 Başlığı Kopyala",
      copied: "✅ Kopyalandı!",
    },
  };

  // Tarayıcı dilini al ve uygun metinleri seç (varsayılan: İngilizce)
  const lang = navigator.language.startsWith("tr") ? "tr" : "en";
  const texts = i18n[lang];

  function addCopyButton() {
    // Düğme zaten varsa tekrar ekleme
    if (document.querySelector("#mal-copy-title-btn")) return;

    // Başlık elementini bul
    const titleElement =
      document.querySelector("h1.title-name") ||
      document.querySelector("h1.title");

    if (!titleElement) return;

    // Düğmenin ekleneceği kapsayıcıyı bul
    const pageTitleContainer =
      titleElement.closest(".page-title") || titleElement.parentElement;
    if (!pageTitleContainer) return;

    // Düğmeyi oluştur
    const btn = document.createElement("button");
    btn.id = "mal-copy-title-btn";
    btn.innerText = texts.copy; // Dile göre metin ata
    btn.style.fontSize = "13px";
    btn.style.padding = "4px 10px";
    btn.style.marginTop = "8px";
    btn.style.marginLeft = "10px";
    btn.style.border = "1px solid #3498db";
    btn.style.background = "white";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.2s ease";

    // Fare ile üzerine gelme efekti
    btn.addEventListener("mouseover", () => {
      btn.style.backgroundColor = "#3498db";
      btn.style.color = "white";
    });
    btn.addEventListener("mouseout", () => {
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
    });

    // Tıklama olayı
    btn.addEventListener("click", () => {
      const titleText = titleElement.innerText.trim();
      navigator.clipboard.writeText(titleText).then(() => {
        btn.innerText = texts.copied; // Dile göre "kopyalandı" metnini göster
        setTimeout(() => (btn.innerText = texts.copy), 1500); // Eski metne geri dön
      });
    });

    // Düğmeyi sayfaya ekle
    pageTitleContainer.appendChild(btn);
  }

  // Sayfa içeriği dinamik olarak değişebileceği için MutationObserver kullan
  const observer = new MutationObserver(addCopyButton);
  observer.observe(document.body, { childList: true, subtree: true });

  // İlk yüklemede fonksiyonu çalıştır
  addCopyButton();
})();