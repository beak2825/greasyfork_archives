// ==UserScript==
// @name           Téléchargement automatique uptobox
// @description    Click sur téléchargement gratuit après le décompte, confirme le téléchargement et ferme l'onglet automatiquement.
// @name:en        Uptobox automatic download
// @description:en Click free download after countdown, confirm download and close tab automatically.
// @name:fr-CA         Téléchargement automatique uptobox
// @description:fr-CA  Click sur téléchargement gratuit après le décompte, confirme le téléchargement et ferme l'onglet automatiquement.
// @name:es        Descarga automática de Uptobox
// @description:es Haga clic en descarga gratuita después de la cuenta regresiva, confirme la descarga y cierre la pestaña automáticamente.
// @name:ar        تنزيل Uptobox تلقائيًا
// @description:ar انقر فوق تنزيل مجاني بعد العد التنازلي ، وأكد التنزيل وأغلق علامة التبويب تلقائيًا.
// @name:it        Download automatico di Uptobox
// @description:it Fare clic su download gratuito dopo il conto alla rovescia, confermare il download e chiudere automaticamente la scheda.
// @name:id        Unduhan Uptobox otomatis
// @description:id Klik unduh gratis setelah hitungan mundur, konfirmasi unduhan dan tutup tab secara otomatis.
// @name:de        Uptobox automatischer Download
// @description:de Klicken Sie nach dem Countdown auf "Kostenloser Download", bestätigen Sie den Download und schließen Sie die Registerkarte automatisch.
// @version    0.7.4.3
// @author     DEV314R
// @match      *uptobox.com/*
// @exclude    *.com/becomepremium*
// @exclude    *.com/login?*
// @exclude    *.com/my_account*
// @exclude    *.com/my_files*
// @exclude    *.com/register*
// @exclude    *.com/support*
// @exclude    *.com/ftp*
// @exclude    *.com/stats*
// @exclude    *.com/voucher*
// @exclude    *.com/resellers_list*
// @exclude    *.com/buy*
// @exclude    *.com/payments*
// @run-at     document-end
// @grant      window.close
// @namespace  http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/419504/T%C3%A9l%C3%A9chargement%20automatique%20uptobox.user.js
// @updateURL https://update.greasyfork.org/scripts/419504/T%C3%A9l%C3%A9chargement%20automatique%20uptobox.meta.js
// ==/UserScript==
setTimeout(dl,500)
var ti=document.querySelector("[data-remaining-time]").dataset.remainingTime;
var tim=ti*1000;
document.title="⏳"+document.title;
setTimeout(function cl(){document.querySelector(".download-btn").click()
 setTimeout(function r(){location.reload()},5000)
 },tim+=2000)
function dl(){document.querySelector("[href*='/dl/']").click()
 document.title="✔️"+document.title
 setTimeout(function wc(){window.close(document.URL)},3000)}