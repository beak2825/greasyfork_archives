// ==UserScript==
// @name                iOS App Download Link Extractor
// @namespace           https://github.com/WangONC/ios-app-download-link-extractor
// @version             0.9.0
// @description         Extracts the IPA download link from itms-services URLs or displays an error message, shown next to the original button.
// @author              WangONC
// @source              https://github.com/WangONC/ios-app-download-link-extractor
// @match               *://*/*
// @grant               GM.xmlHttpRequest
// @license             MIT

// @name:en             iOS App Download Link Extractor
// @description:en      Extracts the IPA download link from itms-services URLs or displays an error message, shown next to the original button.
// @name:zh-CN          IPA提取助手
// @description:zh-CN   从 itms-services 链接中提取 IPA 下载直链或显示错误提示，并显示在原始按钮旁边
// @name:zh-TW          IPA提取助手
// @description:zh-TW   從 itms-services 連結中提取 IPA 下載直鍊或顯示錯誤提示，並顯示在原始按鈕旁邊
// @name:ar             مُستخرج رابط تنزيل تطبيقات iOS
// @description:ar      يستخرج رابط تنزيل IPA من عناوين itms-services أو يعرض رسالة خطأ، تُظهر بجانب الزر الأصلي
// @name:bg             Екстрактор на връзки за изтегляне на iOS приложения
// @description:bg      Извлича връзката за изтегляне на IPA от itms-services URL-и или показва съобщение за грешка до оригиналния бутон
// @name:ckb            دەرهێنەری بەستەری داگرتنی ئەپی iOS
// @description:ckb     بەستەری داگرتنی IPA لە itms-services URLەکان دەرهێنەرە یان پەیامی هەڵە نیشان دەدات، کە لە تەنیشتی دوگمەی سەرەکی دەردەکەوێت
// @name:cs             Extraktor odkazů ke stažení aplikací pro iOS
// @description:cs      Extrahuje odkaz na stažení IPA z adres itms-services nebo zobrazí chybovou zprávu vedle původního tlačítka
// @name:da             iOS App Download Link Extractor
// @description:da      Uddrager IPA-downloadlinket fra itms-services URL'er eller viser en fejlmeddelelse ved siden af den originale knap
// @name:de             iOS App Download Link Extractor
// @description:de      Extrahiert den IPA-Download-Link aus itms-services URLs oder zeigt eine Fehlermeldung neben dem ursprünglichen Button an
// @name:el             Εξαγωγέας Συνδέσμων Λήψης Εφαρμογών iOS
// @description:el      Εξάγει τον σύνδεσμο λήψης IPA από URLs itms-services ή εμφανίζει ένα μήνυμα σφάλματος δίπλα στο αρχικό κουμπί
// @name:eo             Eltiraĵo de Elŝuta Ligilo por iOS-Aplikoj
// @description:eo      Eltiras la IPA-elŝutan ligilon el itms-services URL-oj aŭ montras erarmesaĝon apud la originala butono
// @name:es             Extractor de Enlaces de Descarga de Aplicaciones iOS
// @description:es      Extrae el enlace de descarga de IPA de las URLs de itms-services o muestra un mensaje de error junto al botón original
// @name:es-419         Extractor de Enlaces de Descarga de Aplicaciones iOS
// @description:es-419  Extrae el enlace de descarga de IPA de las URLs de itms-services o muestra un mensaje de error junto al botón original
// @name:fi             iOS-sovelluksen latauslinkin poimija
// @description:fi      Puraisee IPA-latauslinkin itms-services-URL-osoitteista tai näyttää virheilmoituksen alkuperäisen painikkeen vieressä
// @name:fr             Extracteur de liens de téléchargement d'applications iOS
// @description:fr      Extrait le lien de téléchargement IPA des URL itms-services ou affiche un message d'erreur à côté du bouton d'origine
// @name:fr-CA          Extracteur de liens de téléchargement d'applications iOS
// @description:fr-CA   Extrait le lien de téléchargement IPA des URL itms-services ou affiche un message d'erreur à côté du bouton d'origine
// @name:he             מחלץ קישורי הורדה לאפליקציות iOS
// @description:he      מחלץ את קישור ההורדה של IPA מכתובות itms-services או מציג הודעת שגיאה ליד הכפתור המקורי
// @name:hr             Izvlači poveznice za preuzimanje iOS aplikacija
// @description:hr      Izvlači poveznicu za preuzimanje IPA iz itms-services URL-ova ili prikazuje poruku o grešci pored originalnog gumba
// @name:hu             iOS App Letöltési Link Kivonó
// @description:hu      Kinyeri az IPA letöltési linket az itms-services URL-ekből vagy hibaüzenetet jelenít meg az eredeti gomb mellett
// @name:id             Pengekstrak Tautan Unduhan Aplikasi iOS
// @description:id      Mengekstrak tautan unduhan IPA dari URL itms-services atau menampilkan pesan kesalahan di samping tombol asli
// @name:it             Estrattore di Link di Download per App iOS
// @description:it      Estrae il link di download IPA dagli URL itms-services o visualizza un messaggio di errore accanto al pulsante originale
// @name:ja             iOSアプリダウンロードリンク抽出ツール
// @description:ja      itms-services URLからIPAダウンロードリンクを抽出するか、エラーメッセージを元のボタンの横に表示します
// @name:ka             iOS აპლიკაციის ჩამოტვირთვის ბმულის ამომღები
// @description:ka      ამოიღებს IPA-ს ჩამოტვირთვის ბმულს itms-services URL-ებიდან ან აჩვენებს შეცდომის შეტყობინებას ორიგინალური ღილაკის გვერდით
// @name:ko             iOS 앱 다운로드 링크 추출기
// @description:ko      itms-services URL에서 IPA 다운로드 링크를 추출하거나 오류 메시지를 원래 버튼 옆에 표시합니다
// @name:mr             iOS अॅप डाउनलोड लिंक एक्स्ट्रॅक्टर
// @description:mr      itms-services URL मधून IPA डाउनलोड लिंक काढून किंवा त्रुटी संदेश दाखवून, मूळ बटणाजवळ दर्शविलेला
// @name:nb             iOS App Nedlastingslenke Ekstraktor
// @description:nb      Trekker ut IPA-nedlastingslenken fra itms-services URL-er eller viser en feilmelding ved siden av den opprinnelige knappen
// @name:nl             iOS App Download Link Extractor
// @description:nl      Extraheert de IPA-downloadlink van itms-services URL's of toont een foutmelding naast de originele knop
// @name:pl             Ekstraktor linków do pobierania aplikacji iOS
// @description:pl      Wyciąga link do pobrania IPA z adresów URL itms-services lub wyświetla komunikat o błędzie obok oryginalnego przycisku
// @name:pt             Extrator de Link de Download de Aplicativos iOS
// @description:pt      Extrai o link de download do IPA de URLs itms-services ou exibe uma mensagem de erro ao lado do botão original
// @name:pt-BR          Extrator de Link de Download de Aplicativos iOS
// @description:pt-BR   Extrai o link de download do IPA de URLs itms-services ou exibe uma mensagem de erro ao lado do botão original
// @name:ro             Extragător de Linkuri de Descărcare pentru Aplicații iOS
// @description:ro      Extrage linkul de descărcare IPA din URL-urile itms-services sau afișează un mesaj de eroare lângă butonul original
// @name:ru             Экстрактор ссылок на скачивание приложений iOS
// @description:ru      Извлекает ссылку на скачивание IPA из URL-адресов itms-services или отображает сообщение об ошибке рядом с оригинальной кнопкой
// @name:sk             Extraktor odkazov na stiahnutie aplikácií pre iOS
// @description:sk      Extrahuje odkaz na stiahnutie IPA z adries itms-services alebo zobrazí chybovú správu vedľa pôvodného tlačidla
// @name:sr             Екстрактор веза за преузимање iOS апликација
// @description:sr      Екстрахује везу за преузимање IPA из itms-services URL-ова или приказује поруку о грешци поред оригиналног дугмета
// @name:sv             iOS App Nedladdningslänk Extraktor
// @description:sv      Extraherar IPA-nedladdningslänken från itms-services URL:er eller visar ett felmeddelande bredvid den ursprungliga knappen
// @name:th             ตัวดึงลิงค์ดาวน์โหลดแอป iOS
// @description:th      ดึงลิงค์ดาวน์โหลด IPA จาก URL itms-services หรือแสดงข้อความผิดพลาดข้างปุ่มต้นฉบับ
// @name:tr             iOS Uygulama İndirme Bağlantısı Çıkarıcı
// @description:tr      itms-services URL'lerinden IPA indirme bağlantısını çıkarır veya orijinal butonun yanında bir hata mesajı gösterir
// @name:uk             Екстрактор посилань для завантаження додатків iOS
// @description:uk      Витягує посилання на завантаження IPA з URL-адрес itms-services або відображає повідомлення про помилку поруч з оригінальною кнопкою
// @name:ug             iOS ئەپ تۆۋەنلىك ئۇلىنىشىنى چىقىرىش
// @description:ug      itms-services URL لىرىدىن IPA چۈشۈرۈش ئۇلىنىشىنى چىقىرىپ ياكى ئەسلى كۇنۇپكا يېنىدا خاتالىق ئۇچۇرىنى كۆرسىتىدۇ
// @name:vi             Trích xuất liên kết tải xuống ứng dụng iOS
// @description:vi      Trích xuất liên kết tải IPA từ URL itms-services hoặc hiển thị thông báo lỗi bên cạnh nút gốc
// @downloadURL https://update.greasyfork.org/scripts/528616/IPA%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528616/IPA%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_RETRIES = 3;        // 最大重试次数
    const RETRY_INTERVAL = 1000;  // 重试间隔
    const TIMEOUT = 500;         // 超时时间

    function fetchPlist(plistUrl, retryCount, link) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: plistUrl,
            timeout: TIMEOUT, // 设置超时时间
            onload: function(response) {
                if (response.status === 200) {
                    let xmlText = response.responseText;
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    let downloadUrl = extractDownloadUrl(xmlDoc);
                    if (downloadUrl) {
                        let downloadLink = document.createElement('a');
                        downloadLink.href = downloadUrl;
                        downloadLink.target = '_blank'; // 新窗口打开，方便下载
                        downloadLink.textContent = 'Download IPA';
                        downloadLink.style.marginLeft = '13px';
                        downloadLink.classList.add('ipa-download-link'); // 添加类名以便识别
                        link.insertAdjacentElement('afterend', downloadLink);
                    } else {
                        showError(link, 'Unable to parse plist file');
                    }
                } else {
                    showError(link, `Request failed: ${response.status}`);
                }
            },
            onerror: function() {
                if (retryCount > 0) {
                    setTimeout(() => {
                        fetchPlist(plistUrl, retryCount - 1, link); // 递归重试
                        console.log(`当前重试 ${retryCount - 1}`);
                    }, RETRY_INTERVAL);
                } else {
                    showError(link, 'Network Error');
                }
            },
            ontimeout: function() {
                if (retryCount > 0) {
                    setTimeout(() => {
                        fetchPlist(plistUrl, retryCount - 1, link);
                        console.log(`当前重试 ${retryCount - 1}`);
                    }, RETRY_INTERVAL);
                } else {
                    showError(link, 'Request timed out');
                }
            }
        });
    }

    // 处理页面中的链接
    function processLinks() {
        let links = document.querySelectorAll('a[href^="itms-services://?action=download-manifest&url="]');
        if (links.length === 0) {
            // console.log('No matching links found');
            return;
        }

        for (let link of links) {
            // 检查新添加的链接
            if (link.nextElementSibling && (link.nextElementSibling.classList.contains('ipa-download-link') || link.nextElementSibling.classList.contains('ipa-error-link'))) {
                continue;
            }

            // 检查是否是已经处理过的链接
            if (link.getAttribute('ipa-data-processed') === 'true') {
                continue;
            }

            // 标记该链接为已处理
            link.setAttribute('ipa-data-processed', 'true');

            try {
                let href = link.href;
                let query = href.split('?')[1];
                if (!query) throw new Error('Invalid link format');
                let params = new URLSearchParams(query);
                let plistUrl = params.get('url');
                if (!plistUrl) throw new Error('No "url" parameter found');

                // 解码 plistUrl 以处理 URL 编码
                plistUrl = decodeURIComponent(plistUrl);

                fetchPlist(plistUrl, MAX_RETRIES, link);

            } catch (e) {
                showError(link, e.message);
            }
        }
    }

    // 提取下载链接的核心函数
    function extractDownloadUrl(xmlDoc) {
        let dict = xmlDoc.querySelector('plist > dict');
        if (!dict) return null;

        let keys = Array.from(dict.children).filter(el => el.tagName === 'key');
        let itemsKey = keys.find(key => key.textContent === 'items');
        if (!itemsKey) return null;

        let itemsArray = itemsKey.nextElementSibling;
        if (!itemsArray || itemsArray.tagName !== 'array') return null;

        let firstItem = itemsArray.querySelector('dict');
        if (!firstItem) return null;

        let assetsKey = Array.from(firstItem.children).find(el => el.tagName === 'key' && el.textContent === 'assets');
        if (!assetsKey) return null;

        let assetsArray = assetsKey.nextElementSibling;
        if (!assetsArray || assetsArray.tagName !== 'array') return null;

        let softwarePackageDict = Array.from(assetsArray.children).find(dict => {
            let kindKey = Array.from(dict.children).find(key => key.tagName === 'key' && key.textContent === 'kind');
            if (kindKey && kindKey.nextElementSibling.textContent === 'software-package') {
                return true;
            }
            return false;
        });
        if (!softwarePackageDict) return null;

        let urlKey = Array.from(softwarePackageDict.children).find(el => el.tagName === 'key' && el.textContent === 'url');
        if (!urlKey) return null;

        return urlKey.nextElementSibling.textContent;
    }

    // 显示错误提示的函数
    function showError(link, message) {
        let errorLink = document.createElement('a');
        errorLink.textContent = message;
        errorLink.style.color = 'red';
        errorLink.style.marginLeft = '13px';
        errorLink.style.pointerEvents = 'none'; // 防止点击
        errorLink.classList.add('ipa-error-link'); // 添加类名以便识别
        link.insertAdjacentElement('afterend', errorLink);
    }


    document.addEventListener('DOMContentLoaded', function() {
        processLinks();
    });

    window.addEventListener('load', function() {
        processLinks();
    });

    // 监听动态内容加载
    const observer = new MutationObserver(() => {
        processLinks();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
})();
