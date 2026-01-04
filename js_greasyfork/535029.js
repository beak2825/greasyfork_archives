// ==UserScript==
// @name         Google Yorum Temizleyici
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  YouTube yorumlarını Google My Activity üzerinden otomatik olarak silmeye yardımcı olur.
// @match        https://myactivity.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535029/Google%20Yorum%20Temizleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/535029/Google%20Yorum%20Temizleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sol üstte bağlantı butonu
    function addLinkButtons() {
        if (document.getElementById("youtube-comments-link")) return;

        const container = document.createElement("div");
        container.id = "link-buttons-container";
        container.style.position = "fixed";
        container.style.top = "50%";
        container.style.right = "20px";
        container.style.transform = "translateY(-50%)";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "10px";
        container.style.zIndex = 9999;

        // YouTube yorumları butonu (bordo)
        const ytBtn = document.createElement("button");
        ytBtn.id = "youtube-comments-link";
        ytBtn.textContent = "🔗 YouTube Yorumlarına Git";
        ytBtn.style.padding = "10px 14px";
        ytBtn.style.fontSize = "14px";
        ytBtn.style.backgroundColor = "#800000"; // Bordo
        ytBtn.style.color = "#fff";
        ytBtn.style.border = "none";
        ytBtn.style.borderRadius = "6px";
        ytBtn.style.cursor = "pointer";
        ytBtn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        ytBtn.onclick = () => {
            window.open("https://myactivity.google.com/item?restrict=youtube_comments", "_blank");
        };

        // Diğer etkinlikler butonu (mavi)
        const otherBtn = document.createElement("button");
        otherBtn.textContent = "📄 Diğer Etkinlikler";
        otherBtn.style.padding = "10px 14px";
        otherBtn.style.fontSize = "14px";
        otherBtn.style.backgroundColor = "#1a73e8";
        otherBtn.style.color = "#fff";
        otherBtn.style.border = "none";
        otherBtn.style.borderRadius = "6px";
        otherBtn.style.cursor = "pointer";
        otherBtn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        otherBtn.onclick = () => {
            window.open("https://myactivity.google.com/more-activity", "_blank");
        };

        container.appendChild(ytBtn);
        container.appendChild(otherBtn);
        document.body.appendChild(container);
    }

    window.addEventListener("load", addLinkButtons);

    // ------------------- Temizleme Scripti -------------------
    let sleep = time => new Promise(res => setTimeout(res, time));
    let deletedCount = 0;
    let totalComments = 0;
    let isRunning = false;
    let commentsCounted = false;
    let intervalRef = null;

    function showStatus(latestText) {
        let box = document.getElementById("delete-status-box");

        if (!box) {
            box = document.createElement("div");
            box.id = "delete-status-box";
            box.style.position = "fixed";
            box.style.bottom = "20px";
            box.style.right = "20px";
            box.style.width = "420px";
            box.style.maxHeight = "300px";
            box.style.overflowY = "auto";
            box.style.background = "linear-gradient(to right, #1f1f1f, #2b2b2b)";
            box.style.color = "#e8eaed";
            box.style.padding = "16px";
            box.style.borderRadius = "12px";
            box.style.zIndex = 9999;
            box.style.fontSize = "14px";
            box.style.fontFamily = "Arial, sans-serif";
            box.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.6)";
            box.style.border = "1px solid #444";
            box.style.lineHeight = "1.6";
            box.style.whiteSpace = "pre-wrap";

            let title = document.createElement("div");
            title.id = "status-title";
            title.style.fontSize = "16px";
            title.style.fontWeight = "bold";
            title.style.marginBottom = "8px";
            title.textContent = "Google Etkinlik Temizleyici";
            box.appendChild(title);

            let countLine = document.createElement("div");
            countLine.id = "status-count";
            box.appendChild(countLine);

            let progressContainer = document.createElement("div");
            progressContainer.id = "progress-container";
            progressContainer.style.marginTop = "10px";
            progressContainer.style.height = "20px";
            progressContainer.style.background = "#444";
            progressContainer.style.borderRadius = "10px";
            progressContainer.style.overflow = "hidden";
            progressContainer.style.display = "none";
            box.appendChild(progressContainer);

            let progressBar = document.createElement("div");
            progressBar.id = "progress-bar";
            progressBar.style.height = "100%";
            progressBar.style.background = "#4caf50";
            progressBar.style.width = "0%";
            progressContainer.appendChild(progressBar);

            let lastLine = document.createElement("div");
            lastLine.id = "status-last";
            lastLine.style.marginTop = "12px";
            lastLine.style.fontStyle = "italic";
            lastLine.style.color = "#aab";
            box.appendChild(lastLine);

            let timeLeftLine = document.createElement("div");
            timeLeftLine.id = "status-time-left";
            timeLeftLine.style.marginTop = "8px";
            timeLeftLine.style.color = "#f57c00";
            box.appendChild(timeLeftLine);

            let controlButton = document.createElement("button");
            controlButton.id = "toggle-delete";
            controlButton.textContent = "🗑 Silmeyi Başlat";
            controlButton.style.marginTop = "12px";
            controlButton.style.padding = "8px 16px";
            controlButton.style.fontSize = "14px";
            controlButton.style.backgroundColor = "#4caf50";
            controlButton.style.color = "#fff";
            controlButton.style.border = "none";
            controlButton.style.borderRadius = "5px";
            controlButton.style.cursor = "pointer";
            controlButton.addEventListener("click", toggleRun);
            box.appendChild(controlButton);

            document.body.appendChild(box);
        }

        let statusText;
        if (!isRunning) {
            statusText = `Google sunucularında bulunan bir toplu silme önlemi nedeniyle her bir yorum, aralarında birkaç saniye boşluk bırakılarak silinmek zorunda. İşlem başlatıldığında tüm yorumların yüklenmesi amacıyla sayfa en aşağıya kadar kaydırılacak ve toplam yorum sayısı tespit edilecektir.`;
        } else if (isRunning && !commentsCounted) {
            statusText = `İçerikler yükleniyor, lütfen bekleyin.`;
        } else {
            statusText = `İçerikler kaldırılıyor ${deletedCount} / ${totalComments}`;
        }

        document.getElementById("status-count").textContent = statusText;

        const progressContainer = document.getElementById("progress-container");
        progressContainer.style.display = (isRunning && commentsCounted) ? "block" : "none";

        if (isRunning && commentsCounted) {
            let progress = (deletedCount / totalComments) * 100;
            document.getElementById("progress-bar").style.width = `${progress}%`;

            let remaining = totalComments - deletedCount;
            let remainingTime = remaining * 6;
            let h = Math.floor(remainingTime / 3600);
            let m = Math.floor((remainingTime % 3600) / 60);
            let s = remainingTime % 60;

            let timeStr = h > 0
                ? `${h} saat ${m} dakika ${s} saniye`
                : `${m} dakika ${s} saniye`;

            document.getElementById("status-time-left").textContent =
                `Kalan süre: ${timeStr}`;
        }

        if (latestText) {
            document.getElementById("status-last").textContent = `Son kaldırılan: "${latestText}"`;
        }
    }

    function toggleRun() {
        const btn = document.getElementById("toggle-delete");
        if (isRunning) {
            isRunning = false;
            clearInterval(intervalRef);
            btn.textContent = "▶ Silmeyi Başlat";
            btn.style.backgroundColor = "#4caf50";
            console.log("⏸ Silme işlemi duraklatıldı.");
        } else {
            isRunning = true;
            deletedCount = 0;
            totalComments = 0;
            commentsCounted = false;
            run();
            intervalRef = setInterval(run, 6000);
            btn.textContent = "⏸ Silmeyi Duraklat";
            btn.style.backgroundColor = "#f57c00";
            console.log("🟢 Silme işlemi başlatıldı.");
        }
    }

    async function scrollToBottom() {
        let lastHeight = document.body.scrollHeight;
        while (true) {
            window.scrollTo(0, lastHeight);
            await sleep(2000);
            let newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) break;
            lastHeight = newHeight;
        }
    }

    async function run() {
        showStatus();

        window.scrollTo(0, 0);
        await scrollToBottom();

        let cards = [...document.querySelectorAll("c-wiz .GqCJpe.u2cbPc.LDk2Pd")];
        console.log(`🔍 Taranan kart sayısı: ${cards.length}`);

        if (totalComments === 0) {
            totalComments = cards.length;
            commentsCounted = true;
            showStatus();
        }

        for (let card of cards) {
            try {
                let commentDiv = card.querySelector("div.QTGV3c[jsname='r4nke']");
                let commentText = commentDiv ? commentDiv.textContent.trim() : "Yorum metni alınamadı";

                let deleteButton = card.querySelector(".VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc");
                if (deleteButton) {
                    deleteButton.click();
                    deletedCount++;
                    showStatus(commentText);
                    console.log(`✅ Silinen yorum: ${commentText}`);
                    window.scrollBy(0, 100);
                    window.scrollBy(0, -100);
                    return;
                }
            } catch (e) {
                console.warn("⚠️ Hata oluştu:", e);
            }
        }

        window.scrollBy(0, 100);
        window.scrollBy(0, -100);
    }

    showStatus();
})();
