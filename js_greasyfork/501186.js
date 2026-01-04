// ==UserScript==
// @name            youTube Download Button Replacer with yt1s
// @namespace       johnnyScripts
// @match           https://www.youtube.com/watch
// @match           https://*.youtube.com/*
// @grant           GM_addStyle
// @run-at          document-start
// @version         1.1.2
// @author          johnny
// @license MIT
// @description Replaces the original Premium Download Button with third party website with free downloading
// @description:pt-BR Substitui o botão de download premium original por um site de terceiros com download gratuito
// @description:ar يستبدل زر التنزيل المميز الأصلي بموقع ويب تابع لجهة خارجية مع تنزيل مجاني
// @description:bg Заменя оригиналния бутон за премиум изтегляне с уебсайт на трета страна с безплатно изтегляне
// @description:cs Nahrazuje původní tlačítko Premium Stáhnout webovou stránkou třetí strany s bezplatným stahováním
// @description:da Erstatter den oprindelige Premium Download-knap med en tredjeparts hjemmeside med gratis download
// @description:de Ersetzt den originalen Premium-Download-Button durch eine Drittanbieter-Website mit kostenlosem Download
// @description:el Αντικαθιστά το αρχικό κουμπί Premium Λήψη με ιστότοπο τρίτου μέρους με δωρεάν λήψη
// @description:eo Anstataŭigas la originalan Premium Elŝuto-Butonon per retejo de tria partio kun senpaga elŝuto
// @description:es Reemplaza el botón de descarga Premium original con un sitio web de terceros con descarga gratuita
// @description:fi Korvaa alkuperäisen Premium-latauspainikkeen kolmannen osapuolen verkkosivustolla, jossa on ilmainen lataus
// @description:fr Remplace le bouton de téléchargement Premium original par un site tiers avec téléchargement gratuit
// @description:fr-CA Remplace le bouton de téléchargement Premium original par un site tiers avec téléchargement gratuit
// @description:he מחליף את כפתור ההורדה המקורי של Premium באתר צד שלישי עם הורדה בחינם
// @description:hu Helyettesíti az eredeti prémium letöltés gombot egy harmadik fél weboldalával, amely ingyenes letöltést biztosít
// @description:id Mengganti tombol unduhan Premium asli dengan situs web pihak ketiga dengan pengunduhan gratis
// @description:it Sostituisce il pulsante di download Premium originale con un sito web di terze parti con download gratuito
// @description:ja 元のプレミアムダウンロードボタンを無料ダウンロードができるサードパーティのウェブサイトに置き換えます
// @description:ko 원본 프리미엄 다운로드 버튼을 무료 다운로드가 가능한 제3자 웹사이트로 교체합니다
// @description:nb Erstatter den originale Premium Download-knappen med en tredjeparts nettside med gratis nedlasting
// @description:nl Vervangt de originele Premium-downloadknop door een externe website met gratis download
// @description:pl Zastępuje oryginalny przycisk Premium do pobierania stroną trzeciej firmy z darmowym pobieraniem
// @description:ro Înlocuiește butonul original Premium de descărcare cu un site web terț cu descărcare gratuită
// @description:ru Заменяет оригинальную кнопку премиум-скачивания на сайт третьей стороны с бесплатным скачиванием
// @description:sk Nahrádza pôvodné tlačidlo Premium na stiahnutie webovou stránkou tretej strany s bezplatným sťahovaním
// @description:sr Zamenjuje originalno Premium dugme za preuzimanje sa web-sajt treće strane sa besplatnim preuzimanjem
// @description:sv Ersätter den ursprungliga Premium-hämtningsknappen med en tredjepartswebbplats med gratis nedladdning
// @description:th แทนที่ปุ่มดาวน์โหลดพรีเมียมดั้งเดิมด้วยเว็บไซต์ของบุคคลที่สามที่มีการดาวน์โหลดฟรี
// @description:tr Orijinal Premium İndir düğmesini ücretsiz indirme sağlayan üçüncü taraf bir web sitesi ile değiştirir
// @description:uk Замінює оригінальну кнопку Premium завантаження на сторонній веб-сайт із безкоштовним завантаженням
// @description:ug ئەسلى Premium چۈشۈرۈش كۇنۇپكىسىنى ھەقسىز چۈشۈرۈشچى ئۇچۇر تورى بىلەن ئالماشتۇرىدۇ
// @description:vi Thay thế nút Tải xuống Premium gốc bằng trang web của bên thứ ba với tải xuống miễn phí
// @description:zh-CN 将原来的高级下载按钮替换为第三方网站的免费下载按钮
// @description:zh-TW 將原來的高級下載按鈕替換為第三方網站的免費下載按鈕
// @downloadURL https://update.greasyfork.org/scripts/501186/youTube%20Download%20Button%20Replacer%20with%20yt1s.user.js
// @updateURL https://update.greasyfork.org/scripts/501186/youTube%20Download%20Button%20Replacer%20with%20yt1s.meta.js
// ==/UserScript==

(function() {
    const API = "https://yt1s.com/en/youtube-to-mp3?q=";
    const BUTTON_ID = "dwnldBtn";
    const TARGET_CONTAINER = "#top-level-buttons-computed";
    const REFERENCE_BUTTON = "#top-level-buttons-computed > segmented-like-dislike-button-view-model";

    const buttonStyle = `
        #${BUTTON_ID} {
            background-color: #292a2a; /* Alterado para a nova cor */
            color: #FFFFFF;
            border: 1px solid #292a2a;
            border-color: rgba(41,42,42,255);
            margin: 0px 4px;
            border-radius: 18px;
            width: 120px; /* Ajustado para acomodar o ícone e o texto */
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-style: normal;
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: flex; /* Usado para alinhar o ícone e o texto */
            align-items: center;
            justify-content: center;
        }
        #${BUTTON_ID} svg {
            margin-right: 8px; /* Espaçamento entre o ícone e o texto */
            fill: #FFFFFF; /* Define a cor do ícone como branca */
        }
        #${BUTTON_ID}:hover {
            background-color: #15171E;
            color: #ffffff;
            border-color: #15171E;
        }
    `;

    GM_addStyle(buttonStyle);

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function removeFlexibleItemButtons() {
        const flexibleItemButtons = document.querySelector("#flexible-item-buttons");
        if (flexibleItemButtons) {
            flexibleItemButtons.remove();
        }
    }

    function addButton() {
        waitForElement(TARGET_CONTAINER).then((container) => {
            removeFlexibleItemButtons();

            const referenceButton = container.querySelector(REFERENCE_BUTTON);
            const btn = document.createElement('a');
            btn.href = API + encodeURIComponent(window.location.href);
            btn.target = "_blank";
            btn.id = BUTTON_ID;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: inherit; width: 24px; height: 24px;" aria-hidden="true">
                    <path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z" fill="#FFFFFF"></path>
                </svg>
                Download
            `;
            container.insertBefore(btn, referenceButton.nextSibling);
        });
    }

    function updateButton() {
        waitForElement(`#${BUTTON_ID}`).then((btn) => {
            btn.href = API + encodeURIComponent(window.location.href);
        });
    }

    window.onload = addButton;
    window.addEventListener("yt-navigate-start", updateButton, true);
})();


