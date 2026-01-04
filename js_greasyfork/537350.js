// ==UserScript==
// @name         Multi-Language Translator (Unofficial)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  GitHub sayfalarındaki Latin olmayan karakterli metinleri resmi olmayan Google Translate API'sini kullanarak çevirir.
// @author       ekstra26
// @license      MIT
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      translate.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/537350/Multi-Language%20Translator%20%28Unofficial%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537350/Multi-Language%20Translator%20%28Unofficial%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Kullanıcının Ayarları ---
    let TARGET_SOURCE_LANGS_CODES = GM_getValue('targetSourceLangCodes', 'zh,ja,ko');
    const TARGET_LANG = 'en'; // Hedef dil (İngilizce)

    // Unicode karakter aralıkları (basit dil/script tespiti için)
    const LANG_RANGES = {
        'zh': {
            name: 'Çince (Basit/Geleneksel), Japonca (Kanji), Korece (Hanja)',
            regex: /[\u4E00-\u9FFF\u3400-\u4DBF]/
        },
        'ja': {
            name: 'Japonca (Hiragana/Katakana)',
            regex: /[\u3040-\u30FF]/
        },
        'ko': {
            name: 'Korece (Hangul)',
            regex: /[\uAC00-\uD7AF]/
        },
        'ru': {
            name: 'Rusça (Kiril)',
            regex: /[\u0400-\u04FF]/
        },
        'ar': {
            name: 'Arapça',
            regex: /[\u0600-\u06FF\u0750-\u077F]/
        },
        'el': {
            name: 'Yunanca',
            regex: /[\u0370-\u03FF\u1F00-\u1FFF]/
        },
        'th': {
            name: 'Tayca',
            regex: /[\u0E00-\u0E7F]/
        },
    };

    GM_registerMenuCommand("Taranacak Kaynak Dilleri Ayarla", function() {
        const availableLangs = Object.keys(LANG_RANGES).map(code => `${code} (${LANG_RANGES[code].name})`).join('\n');
        let newLangs = prompt(
            `Lütfen taranacak dil kodlarını virgülle ayırarak girin (örn: zh,ja,ko).\n` +
            `Mevcut ve önerilen diller:\n` +
            `${availableLangs}\n\n` +
            `Not: Bu ayar, metinlerin hangi karakterleri içerdiğini tespit etmek için kullanılır. ` +
            `API'nin kendisi çoğu zaman doğru dilde çeviri yapar.`,
            TARGET_SOURCE_LANGS_CODES
        );
        if (newLangs !== null) {
            TARGET_SOURCE_LANGS_CODES = newLangs.trim().toLowerCase();
            GM_setValue('targetSourceLangCodes', TARGET_SOURCE_LANGS_CODES);
            alert(`Taranacak diller başarıyla kaydedildi: ${TARGET_SOURCE_LANGS_CODES}. Sayfayı yenileyerek çeviriyi başlatın.`);
        } else {
            alert('Dil ayarı iptal edildi.');
        }
    });

    GM_registerMenuCommand("Şimdi Çeviriyi Başlat", function() {
        if (!GM_getValue('targetSourceLangCodes')) {
            showNotification("Lütfen önce 'Taranacak Kaynak Dilleri Ayarla' seçeneğini kullanarak dilleri ayarlayın.", 'error');
            return;
        }
        console.log("[DEBUG] Manuel çeviri başlatılıyor...");
        translatePage();
    });


    // --- Yardımcı Fonksiyonlar ---

    function containsAnySelectedNonLatinScript(text) {
        const selectedCodes = TARGET_SOURCE_LANGS_CODES.split(',').map(c => c.trim());
        for (const code of selectedCodes) {
            const langInfo = LANG_RANGES[code];
            if (langInfo && langInfo.regex.test(text)) {
                return true;
            }
        }
        return false;
    }

    function translateText(text, targetLang) {
        return new Promise((resolve, reject) => {
            const encodedText = encodeURIComponent(text);
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=${targetLang}&q=${encodedText}`;

            console.log(`[DEBUG] API çağrısı yapılıyor (ilk 100 karakter): ${apiUrl.substring(0, 100)}...`); // URL'yi kısalt
            console.log(`[DEBUG] Orijinal Metin gönderiliyor: "${text}"`);

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    console.log(`[DEBUG] API Yanıt Durumu: ${response.status}`);
                    console.log(`[DEBUG] API Yanıt Metni (tamamını):`, response.responseText); // Tam yanıtı logla
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data[0] && data[0][0] && data[0][0][0]) {
                            const translated = data[0][0][0];
                            console.log(`[DEBUG] Çevrilen Metin (parsed): "${translated}"`);
                            resolve(translated);
                        } else {
                            console.warn("[DEBUG] Çeviri sonucu bulunamadı veya beklenmeyen yanıt yapısı:", data);
                            reject("Çeviri sonucu bulunamadı veya API yanıt yapısı değişmiş olabilir.");
                        }
                    } catch (e) {
                        console.error("[DEBUG] JSON parse hatası veya API yanıtı işlenirken hata oluştu:", e);
                        reject("API yanıtı işlenirken hata oluştu. Yanıt: " + response.responseText);
                    }
                },
                onerror: function(response) {
                    console.error("[DEBUG] API çağrısı başarısız oldu (onerror):", response);
                    reject(`Ağ hatası veya API çağrısı başarısız. Durum kodu: ${response.status}, Yanıt: ${response.responseText}`);
                },
                ontimeout: function() {
                    console.error("[DEBUG] API çağrısı zaman aşımına uğradı.");
                    reject("API çağrısı zaman aşımına uğradı.");
                }
            });
        });
    }

    function showNotification(message, type = 'info') {
        let notification = document.getElementById('gh-translate-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'gh-translate-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.background = '#333';
            notification.style.color = 'white';
            notification.style.padding = '10px 15px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '99999';
            notification.style.display = 'none';
            notification.style.opacity = '0.9';
            notification.style.fontSize = '14px';
            notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.style.background = type === 'error' ? '#d9534f' : (type === 'success' ? '#5cb85c' : '#333');
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 8000);
    }


    // --- Ana Çeviri Mantığı ---
    async function translatePage() {
        if (!TARGET_SOURCE_LANGS_CODES) {
            showNotification("Lütfen önce 'Taranacak Kaynak Dilleri Ayarla' seçeneğini kullanarak dilleri ayarlayın.", 'error');
            return;
        }

        showNotification(`Sayfa taranıyor ve ${TARGET_SOURCE_LANGS_CODES} dillerinden metinler çevriliyor...`);
        console.log(`[DEBUG] Taranacak diller: ${TARGET_SOURCE_LANGS_CODES}`);

        const textNodesToTranslate = [];
        const uniqueTexts = new Set();

        // GitHub README, Wiki, issue yorumları gibi ana içerik alanlarını hedefleyin.
        // Daha genel p etiketlerini de ekledim.
        const containers = document.querySelectorAll(
            '.markdown-body,p,h1,h2,h3, .wiki-body, .js-issue-row .col-9, .js-comment-body, .f5.color-fg-muted, .comment-body, .Box-body p, .BorderGrid-cell p'
        );

        console.log(`[DEBUG] ${containers.length} adet olası çeviri konteyneri bulundu.`);

        containers.forEach(container => {
            const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walk.nextNode())) {
                const text = node.nodeValue.trim();
                if (text !== '' &&
                    node.parentNode &&
                    node.parentNode.nodeName !== 'SCRIPT' &&
                    node.parentNode.nodeName !== 'STYLE' &&
                    node.parentNode.nodeName !== 'CODE' &&
                    node.parentNode.nodeName !== 'PRE' &&
                    node.parentNode.nodeName !== 'KBD' &&
                    !node.parentNode.classList.contains('highlight') &&
                    text.length > 5 && // Çok kısa metinleri atla (örn: "a", "1", "...")
                    containsAnySelectedNonLatinScript(text) && // Sadece seçilen dillerin karakterlerini içerenleri tara
                    !uniqueTexts.has(text) // Aynı metni birden fazla kez işlememek için
                ) {
                    textNodesToTranslate.push({ node: node, originalText: text });
                    uniqueTexts.add(text);
                    // console.log(`[DEBUG] Çevrilecek metin düğümü bulundu: "${text.substring(0, Math.min(text.length, 50))}..."`);
                }
            }
        });

        if (textNodesToTranslate.length === 0) {
            showNotification("Çevrilecek metin bulunamadı (seçilen dillerde).", 'info');
            console.log("[DEBUG] Çevrilecek metin düğümü bulunamadı (seçilen dillerde).");
            return;
        }

        showNotification(`${textNodesToTranslate.length} adet taranan metin bulundu. Çeviriliyor... (Bu işlem biraz zaman alabilir)`);
        console.log(`[DEBUG] Toplam ${textNodesToTranslate.length} adet metin düğümü çeviri için kuyruğa alındı.`);

        let translatedCount = 0;
        let failedCount = 0;

        // Her metin düğümünü API'nin limitlerine takılmamak için sırayla çevirelim
        for (const item of textNodesToTranslate) {
            const node = item.node;
            const originalText = item.originalText;

            try {
                const translatedText = await translateText(originalText, TARGET_LANG);
                console.log(`[DEBUG] Orijinal: "${originalText}" -> Çevrilen: "${translatedText}"`);
                if (translatedText && translatedText.trim() !== originalText.trim()) {
                    node.nodeValue = translatedText;
                    translatedCount++;
                    console.log(`[DEBUG] Metin başarıyla güncellendi. Yeni metin: "${node.nodeValue}"`);
                } else {
                    console.log(`[DEBUG] Metin güncellenmedi. Orijinal metinle aynıydı veya boş döndü. (Orijinal: "${originalText}", Gelen: "${translatedText}")`);
                }
            } catch (error) {
                console.warn(`[DEBUG] Metin çevrilemedi: "${originalText.substring(0, Math.min(originalText.length, 50))}..." Hata: ${error}`);
                failedCount++;
            }
            // Her API çağrısı arasında kısa bir gecikme
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (translatedCount > 0) {
            showNotification(`${translatedCount} metin başarıyla çevrildi. ${failedCount} metin çevrilemedi.`, 'success');
        } else {
            showNotification("Taranan metinler ya zaten hedef dildeydi ya da çevrilecek metin bulunamadı.", 'info');
        }
        console.log("[DEBUG] Çeviri işlemi tamamlandı.");
    }

    // Sayfa yüklendiğinde ve biraz sonra tekrar çeviriyi dene
    window.addEventListener('load', translatePage);
    setTimeout(translatePage, 3000);

})();