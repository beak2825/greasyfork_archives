// ==UserScript==
// @name            ZAVI - UniAxa
// @namespace       https://tampermonkey.net/
// @license         GPL-3.0-or-later
// @version         1.8
// @description:it  Zero Attention Video Interface: un'interfaccia invisibile per saltare, chiudere e avanzare nei corsi. Meno interazione, più tempo per te.
// @description     Zero Attention Video Interface: an invisible interface to skip, close and anvance trough courses. Less distractions, more time for you.
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABzlBMVEX/////vSz9/P3/ySr8ui7+uy7+vC3+/f7/wyr/xigdAHD//v4jAHD/wCr/yygvAmwwAXMqAG43BnDqpjwqAHTzrzn/zij6tzL/xS3/yCn3tDPsqToaAHe5dlL/0SXnoz3/1SUkAHfUkUbOi0rkoD78+/09C2/vrTf//v+gYVf/vTSyc0/JhU2oaVPbmEH/wC95P2PLiUngnEKublJBDm6ZWlucXlf/zypbJGqkZFi+fFDEgk4vBny4ekqFR19vOGHQjkRhKWcTAGjR0dH4sjmMT1nt7O9VH2djY2O8fktoMGSzblo5E4P08fWRVlQwAGP+uTbXlURxNWnp5uwlAGbEhUaTVV3/2iNFEmx8Q1r0qzyjX2FXNpIPAHVLGHGbhr21c1XDw8KxsrGdnZ3Bdl67u7tNFmGvaF5kRp1BCmDi2ure3t7Yj0+RUWJRHG16YKmKiokdHR3Gi0A4ODg/CXb49vjZ0eYODg6DS1qpl8OCgoFKJo2ij8JERESJb6+1ps0lJSXAstO/hEU1BmnGfVajo6NLS0uNd7VdIlrPxd3jlUzWglSqqqlXV1fKvdnSyuB8fHuPj48sLCwyMjLo4ffwnkn/5CCSSG91dXWtW2WgAf0IAAAKRUlEQVRYw3RW+Vva6BZOCIQEQ0hCWMK+U/ZFQBbZkbUq4gJqpYJrq3a01urYsbVjdab7erv8t/cLj3e0He95nvzwfeG8vGd7TyDoRhMIhq4OYvHV/eB66GanITF4LRYPDQmGxJcYAgEkFogHr/iHv+Z/BIlv9L9+WLvoXR1W+tClj+DD1oDSTRyGoOliv3yw1SuXz8vQ6f548Y0YWnsj2Fopn/ehtT5U3upvQcfl6ZWt/knxBgQ7tLt3cVI8vFjbv9gv7lX7ny+qu4e7vcNqsfrx/NP+bv/w7V55v7f3tlc9fHNDEHbouArt9U+hN5+hT2tve7unx2+LJ9/L1ZOt6seT3vSn8xPotPi5eLxfXKlCB9ANAB9PP3zq7UHFvY9705/7a3sra8WVw5XeabV6fHzxtnq+Dx0WT9d6+yf9w97NIex/KI6vCKC16hq0UoTOq2vFav/geNfeK0K7H6CtNxBIx9bx9y3795UbQ9itDjJsv6r/+MGXx1/uv3/8+P2X8S9l+8FlrcTQzVUYnxbb7bz7wf3nd3/bfHJ71EzQ9OTk2dm9e51O5NHtbvcJuLzzEjqw/58+4O8f3928TcxM3luvz0+4Er7FH67FHxsNvdW2YJzK5by12LrkLiS+dRMCcC/ffcKs11utncbqi9nV5WV9yuo3ahUaZ9jbWDaOjKgRhFS7Cn9Bgn+73xJA409H132W7fCCOyBSOLVGudFv9aZWa41GMmTTyBtRPwKrhKhhuPAH9K8gAKdno5N6JKxP+RIb+mTN8yM6lonq/XKFSqG15fSJ4bA2kVDhQlRIBiXvf+UA/J8Wsk0SlpMGTCM3Gp0auVMTQEg88Cr08EU66bV6E7Gwf24KgUWYU3bn1zrYod8Lc4hUCOPWxnJyVb/h8qGYFBYKMfmiEFVptP6UXq+PDWuWkygsJGOFd79QsEN/5UdQEYrFNhRSHFjYooJRGIYDi1pMJEJhDJdqk/rUosq2HUClisnffsmCHdrMKIUoFk4qpUJgeDKEiIC/VNHAhBhJIhzHkWT4hXNVJRUBChPm8k/NKIbGR12kEJXKVagUV2OwSFiT8gRgkRzntOm5o6OjhMVtkC/AWikM8xSeXqdwyw49nQljQpEIxtRyy5Q2oNQsYzwDGCYtdTPVkQBjuzUSlYI8wahQ6ZO8u4YwSKEJw3Acc2YdDgcTj8m1A3cUj+m6HrWTOQOWpzycguNQkRTVuPPEFYIA+GfcKb8tVCvll7qtOEEQjiTCB8B5dBMmpHZEAwbEfN1sDH1rYFhp49uPbw7i2WUlBNDzQnA7GMsZjWHF7Fj9QcdBERIq77DgKjKos9Ycukgwmk5H45FubrthC2j9rxQ2byMz88cAYQgqj65bd6xWpcGglKoRzK1y+tMtOuJSwSKpPK6jMlMi02yr2eY0KO7UuDoUFcn6DZqQfuZ3Pgo79KyQaIQWbZ6xmFXECTEOlmIG+eiUic8B1lzWKnFYqmVZfZMLGGPU0gPv61rW7FI6/+ORPB5k8O7kYtiraOmYdaqrR3I1qUiFAYBBGUQoBxoDFuG2PBupdCk2P8xFLYaRWXNNOeVe37wEcJVWbZ6wSmMD+LoMosICGd0UPqgjh3AwJkKFmNo460nntEhb9WjCoDFkOsjrpm90nM/hs8k5zQuYxFUPnLX5eZ9KxC3EdTtCPgIhmoyGmka+uWGM4xCDUj5GEUwSIXOs8/XCQ/b+YKM4WpqUV4qF2ZCBIzmp0hJxgKlDQceR7jpjbm1YX1ksGqGUc+eCZibqoSV15xQr31YNAACFTUYf2NCSGZ0XV6G4Zo5Ycpk0/GhpZx8a1SnKaNl+ZW0qFcNxHRsttb3mbHcnysApzDVaHgC8JFq+EGqkJNERWJNKLOdblJFEcTzEmlmzbYJpkgYTFgpSS0RGzuHuBxW12u1IcA1k/c7lKG2uaxPeYaJLzKkXrCjon8wjuXsW1c5OhZMp1mcoeecZHRMcYxQGTpFdyqphZ9TgS6YKzy9b8WXBY8KCbIchKiGOxDGYC7KOeAADvdVuevVBh7kzllO09WZ/eM5BUHpQ4VIqZZn57XKmh6A7fwewOkFvRGhdN5ZTuNUjw9mSumQLuVodSicZs7kR0mCMyCI6piPxKYUwum30zmz+b8PwrVAKxCV1G2XRdyRmNhLPBrP5ToQyM/GxdI7ytLmA3BehacZjfNTi+IlWrxY2//nSEEDv6LD6gWTeyjrb2XhuIlMnqHzQk+34NWoOGalkta66QyKRUZZ2llaAAES4HwjrP7oohu6zIS5OOOJETmF2fTW0A5Tnq+Grr9JGcA4ttWgGjHNnuFVpe3RpkieAVW6PX+mqGJpm/xypEzKaduSpfCL9MM0kcn9a5jvb1vRc3kHTgJBH0Y4yCV2QD0CEWyTPrynSAMAUlMhkMpqQERIgKDLwgNXKsgT/33RGHgByVuosxd28VgqVR0+uiyoAGPWaYgCAlg3sjH/OzsARaFM27WSGTSowYT66yycAtHhz8qftBnJA+Q2zVJ5maJlkwEHGixjNMBOzWjWirlQCKGnML+UVGD9jQmUGjOG13QQ6SSbHS0ywM5+lxyp0fixPRHZivnDSESCBOuA1XUo5TOnm3EC5wYiOLBee/bRYgCidqWDkSFaphM36ADVhUh9RTSUOSBnBPobxkUq8vvTAYsI0GImiyuXC0583G2ike2BhOR26YKnOGCZYJylnrbiKm2UXDAjStEQdS8wwqQ69WNC6vOod4P/f9svuN2koDOMNtBSKfISPdi3lo7SktKXlo8ICA8QENLiOD+mIDOK8IC4sMhKCJGTcbJqAeuHV/l8PI2pwkI173+s+55w85+l7fq81urnAaGlEYEvzPeZ0OWQVE+KNd7KxEQ87s6dy4jlNX0kHZn86mWq/iaVeYzPIuvk4g47wwg7bYItY7Vy5aPoZ7Zwwnslk4sFomnG9TCt4XBrGOOGtvyzo11PIEP2XDq4rOEzYKC5EIj7lVhIytUqxWKul5WqJI/AQJaVz4Uyi2ijUmXPoAZ5EIVTLBLhbs1lWwc9ssRNKiWU/pZSSN4AH7CZFzagf2u2mWBgwoxb0EJAA4eVVnD+y2+BhIhekTDAf5Ligz+d281w4l013s0KOEOU6MwItMBLdhoj5AmkLH4PDcqpw3Ge/n5V595337of/otu98Cf5Q6Km5xdg9wi6lRDBAkbYzA6zSd5siSMwQVCArFaMFmsGKUvI29G185Md8pUHEa2CEyYSYWWhK0v9fmz8NcmGlSAPOit5WK7o2sywU74Okn5GgsgBC+MrwjGB5xHgAo6LlMjX6tps9ZEV2lnAlt7Ai4PUEzDAFAQBiTeTdpEtfvwycGjzyFbroA1G+tzTBe/Bb5rCjaK70BlgmNYb3Vgfld9nEVow+rKiHo3Hp1Kmsxw48r3FzeX9ZPK4fD0DtOY9jQGtwJMH+86/naxvKGJ4inxNamBSaE1/Ti9frd1GIwbUCu1R6N9rApOHYS/tn2OgYDxFrVHof+1TvwAVFQF1MUxsOAAAAABJRU5ErkJggg==
// @author          GP
// @match           https://uniaxa.it/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/542107/ZAVI%20-%20UniAxa.user.js
// @updateURL https://update.greasyfork.org/scripts/542107/ZAVI%20-%20UniAxa.meta.js
// ==/UserScript==

/**
 * ---------------------------
 * Time: 09/07/2025 14:30.
 * Author: GP
 * ---------------------------
 */

/**
 * -==THIS SCRIPT REQUIRES TIMEHOOKER TO WORK PROPERLY==-
 * Otherwise it will act just like a bot without the speeding capability.
 * I left a lot of comments to make it easier for you to understand how it works.
 * NOTICE: You may need to tweek the script a bit and translate some parts if you are using this program outside italy. Ask to ChatGPT for advice if unsure.
 *
 * -==QUESTO SCRIPT NECESSITA DI TIMEHOOKER PER FUNZIONARE CORRETTAMENTE==-
 * Altrimenti agirà solamente come un semplice bot senza la funzionalità di velocizzare la pagina.
 * Ho lasciato un sacco di commenti per rendere più facile la comprensione.
 * N.B.: E possibile che, nel caso tu stia utilizzando questo script fuori dall'italia, dovrai apportare alcune modifiche e tradurre alcune sezioni. In caso di incertezza, chiedi a una mano a ChatGPT.
 *
 * Download Timehooker (ENG): https://greasyfork.org/en/scripts/438894-timerhooker-english-version
 */

(function () {
    'use strict';

    // TUTTI I COMMENTI (le stringhe che iniziano con '//') POSSONO ESSERE RIMOSSI O MODIFICATI A PIACIMENTO SENZA CHE IL CODICE NE RISENTA IN ALCUN MODO.

    // Intervallo di 1 secondo per evitare che lo script sovraccarichi il browser.
    const CHECK_INTERVAL_MS = 1000;

    // Queste sono semplicissime variabili. Tradurre il loro nome è irrilevante.
    let lastVideoState = null;
    let lastAvantiState = null;
    let lastPlayButtonFound = true;
    let videoVelocizzato = false;
    let inGestionePopup = false;
    let popupQueue = [];

    // -== FUNZIONE PER VELOCIZZARE LA PAGINA ==-
    // Rinnovo il mio invito a installare Timehooker, per non rendere questa parte dek codice inutile.
    function velocizza() {
        if (!videoVelocizzato && typeof timer !== 'undefined') {
            timer.change(1 / 99999999999); // Nel caso volessi modificare la velocità, non rimmuovere il '1 / '. Il codice non si rompe ma, al posto di velocizzare rallenta.
            videoVelocizzato = true;
            console.log("⏩ Velocizzo il video."); // 'console.log(...)' serve solamente ad inviare dei messaggi nella console (accessibile utilizzando gli 'Strumenti per Sviluppatori' su Chrome).
        }
    }

    // -==FUNZIONE PER RIPRISTINARE LA PAGINA==-
    // Terminato il video, in automatico il programma ripristina la velocità a 'x1', per evitare che la sessione rischi espirare.
    function ripristinaVelocità() {
        if (typeof timer !== 'undefined') {
            timer.change(1);
            videoVelocizzato = false;
            console.log("🔁 Ripristino la velocità normale.");
        }
    }

    // -==FUZIONE PER PASSARE ALLA PROSSIMA LEZIONE==-
    // Controlla se il pulsante 'Avanti' sia attivo e, nel caso, lo clicca.
    function clickPulsanteAvanti() {
        const avantiButton = document.querySelector('#puls_avanti'); // Potrebbe essere necessario sistituire '#puls_avanti'.

        if (!avantiButton) {
            if (lastAvantiState !== 'non-trovato') {
                console.log("⚪ Pulsante 'Avanti' non trovato.");
                lastAvantiState = 'non-trovato';
            }
            return false;
        }

        if (!avantiButton.classList.contains('disabled') && !avantiButton.disabled) {
            if (lastAvantiState !== 'attivo') {
                console.log("➡️ Pulsante 'Avanti' attivo. Lo clicco.");
                lastAvantiState = 'attivo';
            }
            ripristinaVelocità();
            avantiButton.click();
            return true;
        } else {
            if (lastAvantiState !== 'non-attivo') {
                console.log("⏳ Pulsante 'Avanti' non ancora attivo.");
                lastAvantiState = 'non-attivo';
            }
            return false;
        }
    }

    // -==FUNZIONE PER CHIUDERE IL POPUP AL TERMINE DELLA LEZIONE ==-
    // Alla fine di ogni lezione, generalmente compare un popup che chiede all'utente di tornare alla schermata 'Home' per proseguire con il corso.
    // Questa funzione ha l'obbietivo di controllare se quest'ultimo esista e, nel caso sia visibile a schermo, chiuderlo e tornare automaticamente alla schermata 'Home'.
    function chiudiPopupFineSezioneEHome() {
      const chiudiFine = [...document.querySelectorAll('button.btn.pulsCont[data-dismiss="modal"]')] // Questa stringa è difficile da comprendere, nel caso sia necessario adattare qualcosa, basta sostituire 'modal'.
          .find(btn =>
              btn.innerText.trim().toUpperCase() === "CHIUDI" && // Potrebbe essere necessario sostituire 'CHIUDI'.
              (btn.offsetParent !== null || btn.getBoundingClientRect().height > 0)
          );

      if (chiudiFine) {
          console.log("🎯 Trovato popup di fine sezione visibile. Lo chiudo.");
          chiudiFine.click();

          setTimeout(() => {
              const homeBtn = document.querySelector('#puls_menu');
              if (homeBtn && (homeBtn.offsetParent !== null || homeBtn.getBoundingClientRect().height > 0)) {
                  console.log("🏠 Clicco il pulsante 'Home'.");
                  homeBtn.click();
              } else {
                  console.log("❓ Pulsante 'Home' non visibile.");
              }
          }, 100);
          return true;
      }

      return false;
  }


    // -==FUNZIONE PER GESTIRE I POPUP DI FINE LEZIONE==-
    // Al termine di alcune lezioni, è necessario visualizzare alcune risorse che vengono illustrate sotto forma di popup. Questo codice automatizza il processo di apertura e di chiusura.
    function gestisciPopup(callback) {
        if (popupQueue.length === 0) {
            popupQueue = [...document.querySelectorAll('#mioContAree button.areaVideo')] // Potrebbe essere necessario sostituire '#mioContAree" e "button.areaVideo'.
                .filter(btn => !btn.classList.contains('cliccato'));
        }

        if (popupQueue.length === 0) {
            inGestionePopup = false;
            if (callback) callback();
            return;
        }

        inGestionePopup = true;

        const button = popupQueue.shift();
        button.classList.add('cliccato');
        console.log(`📌 Clicco su bottone popup con ID: ${button.id}`);
        button.click();

        // -==SOTTOFUNZIONE PER LA GESTIONE DEI POPUP==-
        function aspettaChiudiEContinua(tentativi = 0) {
            const chiudiBtn = document.querySelector('button[data-dismiss="modal"]'); // Potrebbe essere necessario sostituire 'modal'.

            if (chiudiBtn) {
                console.log("✅ Trovato pulsante 'Chiudi'. Lo clicco.");
                chiudiBtn.click();

                setTimeout(() => {
                    gestisciPopup(callback);
                }, 100);
            } else if (tentativi < 10) {
                setTimeout(() => aspettaChiudiEContinua(tentativi + 1), 300);
            } else {
                console.log("❌ Nessun pulsante 'Chiudi' trovato. Continuo con il prossimo.");
                gestisciPopup(callback);
            }
        }

        aspettaChiudiEContinua();
    }

    // -==FUNZIONE PER GESTIRE IL VIDEO==-
    // Questa è la funzione più importante di tutto il programma. Una funzione per gestirle tutte.
    // Racchiude tutta la logica che gestisce se e quando attivare le varie funzioni (oltre, chiaramente, a gestire i video)
    function gestisciVideo() {
        // 1. Priorità: chiudi popup finale e torna alla home
        if (chiudiPopupFineSezioneEHome()) return;

        // 2. Se stiamo gestendo popup intermedi, pausa qui
        if (inGestionePopup) return;

        // 3. Prova a cliccare "Avanti"
        const avantiCliccato = clickPulsanteAvanti();
        if (avantiCliccato) return;

        // 4. Gestione video
        const playButton = document.querySelector('button.vjs-play-control');

        if (!playButton) {
            if (lastPlayButtonFound === true) {
                console.log("🛑 Pulsante Play scomparso. Ripristino velocità.");
                ripristinaVelocità();
                lastPlayButtonFound = false;
            }
            return;
        } else {
            lastPlayButtonFound = true;
        }

        const classList = playButton.classList;

        // Questo codice ha lo scopo di controllare lo stato del video ed agire di conseguenza. Per farlo, controlla il pulsante play-pausa situato sull'angolo in basso a sinistra.
        if (classList.contains('vjs-ended')) { // Potrebbe essere necessario sostituire 'vjs-ended'.
            if (lastVideoState !== 'ended') {
                console.log("🔴 Video terminato. Controllo popup...");
                ripristinaVelocità();
                lastVideoState = 'ended';

                // Attiva popup handling
                gestisciPopup(() => {
                    console.log("📦 Gestione popup completata.");
                });
            }
            return;
        }

        if (classList.contains('vjs-paused')) { // Potrebbe essere necessario sostituire 'vjs-paused'.
            if (lastVideoState !== 'paused') {
                console.log("🟡 Video in pausa. Provo a cliccare...");
                lastVideoState = 'paused';
            }
            playButton.click();
            velocizza();
            return;
        }

        if (classList.contains('vjs-playing')) { // Potrebbe essere necessario sostituire 'vjs-playing'.
            if (lastVideoState !== 'playing') {
                console.log("🟢 Video in riproduzione.");
                lastVideoState = 'playing';
            }
            velocizza();
            return;
        }

        if (lastVideoState !== 'unknown') {
            console.log("⚠️ Stato del video sconosciuto.");
            lastVideoState = 'unknown';
        }
    }

    setInterval(gestisciVideo, CHECK_INTERVAL_MS); //Questa stringa serve semplicemente ad attivare tutto il programma.
})();
