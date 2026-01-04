// ==UserScript==
// @name Data Privacy - hide your history from others
// @namespace http://tampermonkey.net/
// @version 0.3
// @description Blurs the font of the sidebar when the mouse is not hovering over it thus hiding information from collegues that are passing by
// @author Dmytro G. (https://github.com/gerasy)
// @match ://.openai.com/*

// @name:zh-CN 数据隐私 - 隐藏您的历史记录
// @name:zh-SG 数据隐私 - 隐藏您的历史记录
// @name:zh-TW 資料隱私 - 隱藏您的歷史記錄
// @name:zh-HK 資料隱私 - 隱藏您的歷史記錄
// @name:ja データプライバシー - 他人からの履歴の表示を隠す
// @name:ko 데이터 개인정보 - 다른 사람에게 히스토리 숨기기
// @name:ru Конфиденциальность данных - скройте свою историю от других
// @name:de Datenschutz - Verbergen Sie Ihre Verlauf vor anderen
// @name:es Privacidad de datos - oculta tu historial a los demás
// @name:fr Confidentialité des données - masquer votre historique aux autres
// @name:it Protezione dei dati - nascondi la tua cronologia agli altri


// @description:zh-CN 当鼠标没有悬停在侧边栏上时，模糊侧边栏的字体，从而向经过的同事隐藏信息
// @description:zh-SG 当鼠标没有悬停在侧边栏上时，模糊侧边栏的字体，从而向经过的同事隐藏信息
// @description:zh-TW 當滑鼠未懸停在側邊欄時，將側邊欄字體模糊，以向經過的同事隱藏資訊
// @description:zh-HK 當滑鼠未懸停在側邊欄時，將側邊欄字體模糊，以向經過的同事隱藏資訊
// @description:ja マウスがサイドバーにカーソルを合わせていない場合、サイドバーのフォントをぼかすことで、通りすがりの同僚から情報を隠す
// @description:ko 마우스가 사이드바에 호버하지 않으면 사이드바의 글꼴을 흐릿하게하여 동료들이 지나갈 때 정보를 숨깁니다.
// @description:ru Размывает шрифт боковой панели, когда указатель мыши не наведен на нее, скрывая информацию от коллег, проходящих мимо
// @description:de Macht die Schrift der Seitenleiste unscharf, wenn die Maus nicht darüber schwebt, und verbirgt so Informationen vor vorbeigehenden Kollegen
// @description:es Desenfoca la fuente de la barra lateral cuando el mouse no está sobre ella, ocultando así información a los colegas que pasan
// @description:fr Floute la police de la barre latérale lorsque la souris ne la survole pas, cachant ainsi les informations aux collègues qui passent
// @description:it Sfoca il carattere della barra laterale quando il mouse non è sopra di esso, nascondendo così le informazioni ai colleghi che passano

// @author Dmytro G. (https://github.com/gerasy)

// @namespace http://tampermonkey.net/
// @namespace:zh-CN http://tampermonkey.net/
// @namespace:zh-SG http://tampermonkey.net/
// @namespace:zh-TW http://tampermonkey.net/
// @namespace:zh-HK http://tampermonkey.net/
// @namespace:ja http://tampermonkey.net/
// @namespace:ko http://tampermonkey.net/
// @namespace:ru http://tampermonkey.net/
// @namespace:de http://tampermonkey.net/
// @namespace:es http://tampermonkey.net/
// @namespace:fr http://tampermonkey.net/
// @namespace:it http://tampermonkey.net/

// @license MIT

// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @compatible brave
// @compatible vivaldi
// @compatible uc
// @downloadURL https://update.greasyfork.org/scripts/464290/Data%20Privacy%20-%20hide%20your%20history%20from%20others.user.js
// @updateURL https://update.greasyfork.org/scripts/464290/Data%20Privacy%20-%20hide%20your%20history%20from%20others.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to the head of the document
    const style = document.createElement('style');
    style.innerHTML = `
        .blur-effect {
            filter: blur(3px);
            transition: filter 700ms ease-in-out 300ms;
        }

        .blur-effect:hover {
            filter: none;
            transition: filter 700ms ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Function to apply the blur effect
    function applyBlur(sidebar) {
        if (sidebar) {
            sidebar.classList.add('blur-effect');
        }
    }

    // Function to remove the blur effect
    function removeBlur(sidebar) {
        if (sidebar) {
            sidebar.classList.remove('blur-effect');
        }
    }

    // Function to add event listeners to toggle the blur effect
    function addListeners(sidebar) {
        if (sidebar) {
            // Apply the blur effect by default
            applyBlur(sidebar);

            // Add event listeners to toggle the blur effect
            sidebar.addEventListener('mouseover', () => removeBlur(sidebar));
            sidebar.addEventListener('mouseout', () => applyBlur(sidebar));
        }
    }

    // Get the sidebar element
    const sidebarXPath = '/html/body/div[1]/div[2]/div[1]/div/div/nav/div';
    const sidebar = document.evaluate(sidebarXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // Apply listeners to the current sidebar
    addListeners(sidebar);

    // Observe changes in the DOM to handle dynamic content
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const newSidebar = document.evaluate(sidebarXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                addListeners(newSidebar);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
