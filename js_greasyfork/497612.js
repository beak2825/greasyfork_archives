// ==UserScript==
// @name         Enable Right Click and Copy Link/Button Text on Drag
// @version      3.0
// @description  Enable right-click context menu on sites that disable it, copy the text of a link or button to the clipboard when dragged slightly, and remove added source links from copied text
// @description:de Ermöglicht das Kontextmenü mit der rechten Maustaste auf Websites, die es deaktivieren, und kopiert den Text eines Links oder einer Schaltfläche in die Zwischenablage, wenn er leicht gezogen wird, und entfernt hinzugefügte Quellenlinks aus kopiertem Text
// @description:ru Включить контекстное меню правой кнопкой мыши на сайтах, которые его отключают, копировать текст ссылки или кнопки в буфер обмена при небольшом перетаскивании и удалять добавленные ссылки на источник из скопированного текста
// @description:uk Увімкнути контекстне меню правою кнопкою миші на сайтах, які його вимикають, копіювати текст посилання або кнопки в буфер обміну при невеликому перетягуванні та видаляти додані посилання на джерело з копійованого тексту
// @description:zh 在禁用右键菜单的网站上启用右键菜单，并在稍微拖动时将链接或按钮的文本复制到剪贴板，并从复制的文本中删除添加的来源链接
// @description:ja 右クリックのコンテキストメニューを無効にするサイトで右クリックを有効にし、リンクやボタンのテキストを少しドラッグしてクリップボードにコピーし、コピーしたテキストから追加されたソースリンクを削除します
// @description:nl Schakel het rechtermuisknop-contextmenu in op sites die dit uitschakelen en kopieer de tekst van een link of knop naar het klembord wanneer deze licht wordt gesleept en verwijder toegevoegde bronnenlinks uit gekopieerde tekst
// @description:pt Ativar o menu de contexto do botão direito do mouse em sites que o desativam e copiar o texto de um link ou botão para a área de transferência quando arrastado ligeiramente e remover links de fonte adicionados do texto copiado
// @description:es Habilitar el menú contextual de clic derecho en sitios que lo deshabilitan y copiar el texto de un enlace o botón al portapapeles cuando se arrastra ligeramente y eliminar los enlaces de origen agregados del texto copiado
// @description:it Abilita il menu contestuale del tasto destro del mouse su siti che lo disabilitano e copia il testo di un collegamento o pulsante negli appunti quando viene trascinato leggermente e rimuove i collegamenti alla fonte aggiunti dal testo copiato
// @description:ar تمكين قائمة النقر بزر الماوس الأيمن على المواقع التي تعطلها ونسخ نص الرابط أو الزر إلى الحافظة عند سحبه قليلاً وإزالة روابط المصدر المضافة من النص المنسوخ
// @description:fr Activer le menu contextuel du clic droit sur les sites qui le désactivent et copier le texte d'un lien ou d'un bouton dans le presse-papiers lorsqu'il est légèrement glissé et supprimer les liens de source ajoutés du texte copié
// @description:pl Włącz menu kontekstowe kliknięcia prawym przyciskiem myszy na stronach, które je wyłączają, i skopiuj tekst linku lub przycisku do schowka po lekkim przeciągnięciu i usuń dodane linki źródłowe z skopiowanego tekstu
// @description:hi उन साइटों पर राइट-क्लिक संदर्भ मेनू सक्षम करें जो इसे अक्षम करते हैं और लिंक या बटन के टेक्स्ट को हल्के से खींचने पर क्लिपबोर्ड पर कॉपी करें और कॉपी किए गए टेक्स्ट से जोड़े गए स्रोत लिंक निकालें
// @description:bn ডান ক্লিক কনটেক্সট মেনু সক্ষম করুন যা এটি অক্ষম করে এবং হালকাভাবে টেনে নিয়ে গেলে লিঙ্ক বা বোতামের পাঠ্য ক্লিপবোর্ডে কপি করুন এবং কপি করা পাঠ্য থেকে যোগ করা উত্স লিঙ্কগুলি সরান
// @description:ko 오른쪽 클릭 컨텍스트 메뉴를 비활성화하는 사이트에서 오른쪽 클릭을 활성화하고 링크 또는 버튼 텍스트를 약간 드래그하면 클립보드에 복사하고 복사된 텍스트에서 추가된 소스 링크를 제거합니다
// @description:vi Kích hoạt menu ngữ cảnh chuột phải trên các trang web vô hiệu hóa nó và sao chép văn bản của liên kết hoặc nút vào bảng tạm khi kéo nhẹ và loại bỏ các liên kết nguồn được thêm từ văn bản đã sao chép
// @description:tr Sağ tıklama bağlam menüsünü devre dışı bırakan sitelerde sağ tıklama bağlam menüsünü etkinleştirin ve bir bağlantı veya düğmenin metnini hafifçe sürüklediğinizde panoya kopyalayın ve kopyalanan metinden eklenen kaynak bağlantıları kaldırın
// @description:th เปิดใช้งานเมนูคลิกขวาบนเว็บไซต์ที่ปิดใช้งานและคัดลอกข้อความของลิงก์หรือปุ่มไปยังคลิปบอร์ดเมื่อถูกลากเบา ๆ และลบลิงก์ที่เพิ่มจากข้อความที่คัดลอก
// @description:az Saytda sağ klik kontekst menyusunu aktivləşdirin, link və ya düymənin mətnini yüngülcə sürükləməklə panoya kopyalayın və kopyalanmış mətnə əlavə edilmiş mənbə linklərini silin
// @description:kz Сайттарда оң жақ батырма контексттік мәзірін қосыңыз, сілтеме немесе батырма мәтінін жеңіл тартып, алмасу буферіне көшіріңіз және көшірілген мәтіннен қосылған дереккөз сілтемелерін алып тастаңыз
// @description:uz Saytlarda o'ng tugma kontekst menyusini yoqing, havola yoki tugma matnini ozgina sudrab, almashish buferiga nusxa ko'chiring va nusxalangan matnga qo'shilgan manba havolalarini olib tashlang
// @icon           https://ide.onl/img/script/copylinkdrag.png
// @namespace      https://ide.onl/scripts/30-kopirovanie-teksta-ssylok-s-pomoschju-tampermonkey.html
// @license        MIT
// @match          *://*/*
// @grant          none
// @author         Sitego
// @downloadURL https://update.greasyfork.org/scripts/497612/Enable%20Right%20Click%20and%20Copy%20LinkButton%20Text%20on%20Drag.user.js
// @updateURL https://update.greasyfork.org/scripts/497612/Enable%20Right%20Click%20and%20Copy%20LinkButton%20Text%20on%20Drag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Массив доменов для исключений
    // Array of domains for exceptions
    const excludedDomains = [
        'coinmarketcap.com',
        'another-example.com',
        'yetanother-example.com'
    ];

    // Getting the current domain
    const currentDomain = window.location.hostname;

    // Checking if the current domain is in the exception array
    if (excludedDomains.includes(currentDomain)) {
        return; // Stop script execution if the domain is in exceptions
    }

    // Function to remove event listeners and inline scripts blocking right-click
    function enableRightClick(e) {
        e.stopPropagation();
    }

    // Overriding context menu events
    document.addEventListener('contextmenu', enableRightClick, true);

    // Removing inline oncontextmenu attributes
    function removeBlockingAttributes(node) {
        node.removeAttribute('oncontextmenu');
        node.removeAttribute('oncopy');
        node.removeAttribute('onselectstart');
        node.removeAttribute('unselectable');
        node.style.userSelect = 'auto';
        node.style.webkitUserSelect = 'auto';
        node.style.MozUserSelect = 'auto';
        node.style.msUserSelect = 'auto';
    }

    document.querySelectorAll('*').forEach(function(node) {
        removeBlockingAttributes(node);
    });

    // Mutation observer to handle dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    removeBlockingAttributes(node);
                }
            });
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Variables for drag detection and copying text
    let startX, startY, dragging = false, targetElement = null;

    document.addEventListener('mousedown', function(event) {
        if (event.target.tagName.toLowerCase() === 'a' || event.target.tagName.toLowerCase() === 'button') {
            startX = event.clientX;
            startY = event.clientY;
            dragging = true;
            targetElement = event.target;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (dragging) {
            const distance = Math.sqrt(Math.pow(event.clientX - startX, 2) + Math.pow(event.clientY - startY, 2));
            if (distance > 5) { // Consider it a drag if moved more than 5 pixels
                if (targetElement) {
                    const elementText = targetElement.textContent.trim();
                    navigator.clipboard.writeText(elementText).then(() => {
                        console.log('Text copied to clipboard:', elementText);
                    }).catch(err => {
                        console.error('Could not copy text: ', err);
                    });
                    dragging = false;
                    targetElement = null;
                }
            }
        }
    });

    document.addEventListener('mouseup', function() {
        dragging = false;
        targetElement = null;
    });

    document.addEventListener('mouseleave', function() {
        dragging = false;
        targetElement = null;
    });

    // Remove additional text added to clipboard
    document.addEventListener('copy', function(event) {
        event.stopPropagation();
        const selection = document.getSelection();
        if (!selection.rangeCount) return;
        const copiedText = selection.toString().trim();
        event.clipboardData.setData('text/plain', copiedText);
        event.preventDefault();
    }, true);

})();
