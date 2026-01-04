// ==UserScript==
// @name         Cryptodrip.io Auto Claim + Banner
// @namespace    Violentmonkey Scripts
// @match        https://cryptodrip.io/*
// @grant        none
// @license MIT
// @version      2.1
// @description  Auto klik View Ad, verifikasi captcha, klaim reward & tampilkan banner sementara
// @downloadURL https://update.greasyfork.org/scripts/542465/Cryptodripio%20Auto%20Claim%20%2B%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/542465/Cryptodripio%20Auto%20Claim%20%2B%20Banner.meta.js
// ==/UserScript==

(function () {
    'use strict';
  (function() {
    const urlParams = new URLSearchParams(window.location.search);
    const refFromUrl = urlParams.get('ref');
    const savedRef = localStorage.getItem('ref');

    if (!savedRef) {
       
        if (refFromUrl) {
           
            localStorage.setItem('ref', refFromUrl);
        } else {
            
            window.location.href = "https://cryptodrip.io/index.php?ref=3404";
        }
    }

   
})();
 // Blokir window.open agar tidak buka tab baru
  window.open = function () {
    console.log("Blokir window.open");
    return null;
  };
let err=document.querySelector("#cf-error-details > header > h1 > span.inline-block");
  if(err){
      setTimeout(() => {
           window.location.reload();
         },1000);
  }
  // Hapus atribut target="_blank" dari semua <a> baru
  const observer = new MutationObserver(() => {
    document.querySelectorAll('a[target="_blank"]:not([data-noblank])').forEach(link => {
      link.removeAttribute('target');
      link.dataset.noblank = 'true';
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

    // === Blok setTimeout dan setInterval yang mencoba buka jendela ===
    const asliTimeout = window.setTimeout;
    window.setTimeout = function (fn, delay, ...args) {
        if (typeof fn === 'string' && fn.includes('window.open')) {
            console.log("🛑 setTimeout coba buka jendela diblokir!");
            return null;
        }
        return asliTimeout(fn, delay, ...args);
    };

    const asliInterval = window.setInterval;
    window.setInterval = function (fn, delay, ...args) {
        if (typeof fn === 'string' && fn.includes('window.open')) {
            console.log("🛑 setInterval coba buka jendela diblokir!");
            return null;
        }
return asliInterval(fn, delay, ...args);

    };

   




    // === Fungsi Auto Klik View Ad dan Captcha ===
    function klikViewAd() {
        const tombolIklan = Array.from(document.querySelectorAll('button.btn')).find(el =>
            el.innerText.toLowerCase().includes('view ad') && typeof el.onclick === 'function'
        );

        if (tombolIklan) {
            tombolIklan.click();
            console.log('✅ Tombol View Ad diklik!');
            setTimeout(klikCaptchaSubmit, 8000);
        } else {
            console.log('⚠️ Tombol View Ad tidak ditemukan.');
        }
    }

    function klikCaptchaSubmit() {
        const submitButton = document.querySelector('#captchaForm button[type="submit"]');
        if (submitButton) {
            submitButton.click();
            console.log('✅ Tombol Submit Captcha diklik!');
        } else {
            console.log('⚠️ Tombol Submit Captcha tidak ditemukan.');
        }
    }

function autoClaimAfterCaptcha() {
      // === Fungsi Pemantauan Klik Harian ===

  function pantauKlikHarian() {
    // Mulai pantau klik harian setelah klik tombol

    const intervalclaim = setInterval(() => {
        const captchaVal = document.querySelector('.cf-turnstile input[name="cf-turnstile-response"]')?.value;
        const button = document.getElementById('mineButton');
const timestamp = Date.now() - Math.floor(Math.random() * 5000); // waktu 0–5 detik lalu
const randomPart = Math.random().toString(36).substr(2, 9);
const requestId = `CLAIM_${timestamp}_${randomPart}`;

        if (captchaVal && captchaVal.length > 0 && button && !button.disabled) {
            console.log('✅ CAPTCHA selesai. Hapus event listener & klik tombol klaim.');

            // Hapus event listener jahat dengan cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // Klik tombol klaim
            newButton.click();
          setTimeout(() => {
           window.location.reload();
         },1000);
          nextClickTime = Date.now() + (data.remaining_time * 1000);
sessionStorage.setItem('nextClickTime', nextClickTime.toString());

            clearInterval(intervalclaim);

        }


    }, 5000);
    const klikCheck = setInterval(() => {
        const el = document.querySelector('#clicks_today');
        const match = el?.textContent.match(/(\d+)\s*\/\s*(\d+)/); // Tangkap angka seperti 40 / 40

        if (match) {
            const current = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);
            console.log(`📊 Klik hari ini: ${current}/${max}`);

            if (current >= max) {
                console.log('🚫 Klik harian penuh. Stop.');
                clearInterval(klikCheck);
               clearInterval(intervalclaim);
            }
        }


  }, 1000);
}
pantauKlikHarian();
}



    // === Deteksi Reset Waktu Klik ===
    function monitorResetTime() {
        setInterval(() => {
            const resetText = document.querySelector('#reset_time')?.textContent;
            if (resetText?.includes('Next reset in: 0')) {
                console.log('♻️ Waktu reset terdeteksi. Reload halaman.');
                location.reload();
            }
        }, 6000);
    }

  
    function klikLinkFaucet() {
        if (window.location.pathname.includes('mine.php')) return;

        const linkFaucet = Array.from(document.querySelectorAll('a')).find(a =>
            a.href.includes('mine.php') && a.textContent.includes('Faucet')
        );
        if (linkFaucet) {
            console.log('⛏️ Klik link Faucet...');
            linkFaucet.click();
        }
    }

    function klikCheckboxManusia() {
        const checkbox = document.querySelector('.cb-lb input[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
            console.log('✅ Checkbox manusia diklik.');
        }
    }



    // === Jalankan Saat Halaman Siap ===
    window.addEventListener('load', () => {
        console.log('🚀 Script aktif di cryptodrip.io');
        setTimeout(() => {
           // isiPasswordDanLogin();
           // isiEmailDanSubmit();
            //klikLinkFaucet();
            //klikCheckboxManusia();
            //klikViewAd();
            autoClaimAfterCaptcha();
            //pantauKlikHarian();
            monitorResetTime();
            //showBannerCountdown();
        }, 1000);
    });

    // === Auto Reload Tiap 62 detik ===
    setInterval(() => {
        location.replace(location.href);
    }, 620000);
})();
