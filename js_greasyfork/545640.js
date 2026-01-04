// ==UserScript==
// @name         RWKF: Redirect with Keyword from Localhost (Via Browser)
// @namespace    http://yourdomain.com/
// @version      1.2.1
// @description  Fetch keyword from local server and redirect to Google every 60s with countdown display
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545640/RWKF%3A%20Redirect%20with%20Keyword%20from%20Localhost%20%28Via%20Browser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545640/RWKF%3A%20Redirect%20with%20Keyword%20from%20Localhost%20%28Via%20Browser%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- DAFTAR URL API ---
  // Kamu bisa tambahkan sebanyak apapun URL di dalam array ini
  const apiUrls = [
    "https://bing-search.onrender.com/keyword",
    "https://search.xter.my.id/keyword",
    // "https://url-ketiga-kamu.com/keyword", // <-- contoh jika mau nambah
    // "https://url-keempat-kamu.com/keyword",
  ];

  // --- Logika Utama ---

  function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Mengacak urutan elemen dalam sebuah array (Fisher-Yates Shuffle)
   */
  function shuffleArray(array) {
    let newArr = [...array]; // Salin array agar tidak mengubah yg asli
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  const delaySeconds = getRandomDelay(23, 35);
  let countdown = delaySeconds;

  // Tampilkan countdown
  const timerBox = document.createElement("div");
  timerBox.style.position = "fixed";
  timerBox.style.bottom = "10px";
  timerBox.style.right = "10px";
  timerBox.style.background = "rgba(0,0,0,0.7)";
  timerBox.style.color = "white";
  timerBox.style.padding = "6px 12px";
  timerBox.style.borderRadius = "8px";
  timerBox.style.fontSize = "16px";
  timerBox.style.zIndex = 9999;
  timerBox.textContent = `Redirect in ${countdown}s`;
  document.body.appendChild(timerBox);

  // Interval countdown
  const countdownInterval = setInterval(() => {
    countdown--;
    timerBox.textContent = `Redirect in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      fetchAndRedirect();
    }
  }, 1000);

  /**
   * Helper: Memproses respons dari server
   * (Melempar error jika respons tidak OK atau tidak ada keyword)
   */
  async function processResponse(response) {
    if (!response.ok) throw new Error(`Fetch failed (${response.status})`);
    const data = await response.json();
    if (!data.keyword) throw new Error("Keyword limit reached or not found");
    return data.keyword;
  }

  /**
   * Helper: Melakukan redirect ke Bing
   */
  function redirectToBing(keyword) {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(
      keyword
    )}&qs=PN&form=TSFLBL`;
    window.top.location.href = url;
  }

  /**
   * Mengambil keyword dari daftar URL yang sudah diacak.
   * Akan mencoba satu per satu sampai berhasil.
   */
  async function fetchAndRedirect() {
    const shuffledUrls = shuffleArray(apiUrls);
    const totalUrls = shuffledUrls.length;

    for (let i = 0; i < totalUrls; i++) {
      const url = shuffledUrls[i];
      const attempt = i + 1;
      
      try {
        timerBox.textContent = `Fetching (${attempt}/${totalUrls})...`;
        console.log(`Attempt ${attempt}/${totalUrls}: Trying ${url}`);
        
        const response = await fetch(url);
        const keyword = await processResponse(response);
        
        redirectToBing(keyword);
        return; // --- Berhasil, hentikan fungsi ---

      } catch (e) {
        console.warn(`Attempt ${attempt}/${totalUrls} failed for ${url}:`, e.message);
        // Biarkan loop berlanjut ke URL berikutnya
      }
    }

    // Jika loop selesai dan tidak ada yg berhasil
    timerBox.textContent = "Error: All servers failed.";
    console.error("All fetch attempts failed.");
  }
})();