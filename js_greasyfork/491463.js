// ==UserScript==
// @name         AI OCR, Photo Edit/Restore Suite: Multilingual, HD Upscale, Cutout & Object Erase
// @name:es      IA OCR, Edición/Restauración de Fotos: Multilingüe, Aumento HD, Recorte y Borrado de Objetos
// @name:de      KI OCR, Foto Bearbeitung/Wiederherstellung: Mehrsprachig, HD Vergrößerung, Objekt Entfernen
// @name:fr      IA OCR, Éditer/Restaurer Photo: Multilingue, Échelle HD, Découpe & Effacement d'Objet
// @name:it      IA OCR, Modifica/Ripristino Foto: Multilingua, Upscaling HD, Ritaglio e Cancellazione Oggetti
// @name:pt      IA OCR, Editar/Restaurar Foto: Multilíngue, Upscale HD, Recorte e Apagador de Objetos
// @name:ru      ИИ OCR, Редактирование/Восстановл. Фото: Многоязыч., HD, Вырезка & Удаление
// @name:ja      AI OCR, 写真編集/復元スイート：多言語、HDアップスケール、カットアウト＆オブジェクト消去
// @name:ko      AI OCR, 사진 편집/복원 스위트: 다국어, HD 업스케일, 컷아웃 및 객체 삭제
// @name:ar      OCR بالذكاء الاصطناعي, تحرير/استعادة الصور: متعدد اللغات, تكبير HD, قص ومسح العناصر
// @name:tr      AI OCR, Fotoğraf Düzenleme/Geri Yükleme Paketi: Çok Dilli, HD Büyütme, Kesim & Nesne Silme
// @name:nl      AI OCR, Foto Bewerken/Herstellen Suite: Meertalig, HD Opschalen, Uitsnijden & Object Wissen
// @name:sv      AI OCR, Foto Redigering/Återställning: Flera Språk, HD Förstoring, Utklipp & Objekt Borttagning
// @name:da      AI OCR, Foto Redigering/Genopretning: Flersproget, HD Optrapning, Udklip & Objektsletning
// @name:th      OCR ด้วย AI, ชุดแก้ไข/คืนค่ารูปภาพ: หลายภาษา, ขยาย HD, ตัดและลบวัตถุ
// @name:zh      AI OCR、照片编辑/恢复套件：多语言支持、HD升级、剪切和对象擦除
// @name:zh-CN   AI OCR、照片编辑/恢复套件：多语言支持、HD升级、剪切和对象擦除
// @name:zh-TW   AI OCR、照片編輯/恢復套件：多語言支援、HD升級、剪裁和物體擦除
// @description  Feature-packed suite for instant image-to-text conversion, photo enhancement/restoration, HD upscaling, clear background cutout, and swift object erasure, supporting 180+ languages, including rare dialects.
// @description:es  Conjunto completo de herramientas para la conversión instantánea de imagen a texto, mejora/restauración de fotos, escalado HD, recortes de fondo claros y borrado rápido de objetos, compatible con más de 180 idiomas, incluidos dialectos raros.
// @description:de  Funktionen-geladene Suite für Sofortbild-zu-Text-Konvertierung, Fotoverbesserung/-wiederherstellung, HD-Vergrößerung, klares Hintergrundausschneiden und schnelle Objekterasierung, unterstützt über 180 Sprachen, einschließlich seltener Dialekte.
// @description:fr  Suite complète de fonctionnalités pour la conversion instantanée d'image en texte, l'amélioration/restauration de photos, l'upscaling HD, la découpe d'arrière-plan claire et l'effacement rapide d'objets, prenant en charge plus de 180 langues, y compris les dialectes rares.
// @description:it  Pacchetto completo di funzionalità per la conversione istantanea da immagine a testo, miglioramento/ripristino foto, upscaling HD, ritaglio di sfondo trasparente e cancellazione rapida di oggetti, supporta oltre 180 lingue, inclusi dialetti rari.
// @description:pt  Pacote completo de funcionalidades para conversão instantânea de imagem em texto, melhoramento/restauração de fotos, escalamento HD, recorte de fundo claro e apagamento rápido de objetos, suportando mais de 180 idiomas, incluindo dialetos raros.
// @description:ru  Набор инструментов для мгновенного преобразования изображений в текст, улучшения/восстановления фотографий, увеличения HD, чистой вырезки фона и быстрого удаления объектов, поддерживает более 180 языков, включая редкие диалекты.
// @description:ja  画像からテキストへの瞬時の変換、写真の強化/復元、HDアップスケール、バックグラウンドカットアウトとオブジェクト消去を包括する機能パックスイートで、珍しい方言も含む180以上の言語に対応します。
// @description:ko  이미지에서 텍스트로의 즉각적인 변환, 사진 개선/복원, HD 업 스케일, 선명한 배경 컷아웃 및 신속한 객체 제거를 지원하는 180개 이상의 언어를 포함한 기능이 가득한 스위트입니다.
// @description:ar  حزمة ميزات للتحويل الفوري من الصورة إلى النص، وتحسين/استعادة الصور، والتكبير بجودة HD، وقص الخلفية الواضح، ومسح العناصر السريع، دعم أكثر من 180 لغة، بما في ذلك اللهجات النادرة.
// @description:tr  Anında resimden metne dönüştürme, fotoğraf iyileştirme/restorasyon, HD yükseltme, net arka plan kırpma ve hızlı nesne silme için özellik dolu bir paket, nadir lehçeler de dahil olmak üzere 180'den fazla dil desteği içerir.
// @description:nl  Functiepakket voor directe beeld-naar-tekst conversie, foto verbetering/herstel, HD opschaling, heldere achtergrond uitsnijden en snelle object wissen, ondersteunt meer dan 180 talen, inclusief zeldzame dialecten.
// @description:sv  Funktionsspäckad svit för omedelbar bild-till-text konvertering, foto förbättring/återställning, HD uppskalning, klar bakgrund utklipp och snabb objekt radering, med stöd för över 180 språk inklusive ovanliga dialekter.
// @description:da  Funktionsspækket pakke til øjeblikkelig billede-til-tekst konvertering, foto forbedring/genopretning, HD opskalering, klar baggrund udklip og hurtig objekt sletning, understøtter over 180 sprog, inklusive sjældne dialekter.
// @description:th  ชุดคุณสมบัติสำหรับการแปลงจากรูปภาพเป็นข้อความทันที, การปรับปรุง/คืนค่าภาพถ่าย, การขยายความละเอียด HD, การตัดพื้นหลังที่ชัดเจน, และการลบวัตถุอย่างรวดเร็ว รองรับมากกว่า 180 ภาษา รวมถึงภาษาถิ่นที่หายาก
// @description:zh  一款功能全面的套件，提供即时图像转文本转换、照片增强/恢复、HD上升、清晰背景剪切和快速对象擦除，支持180多种语言，包括罕见方言。
// @description:zh-CN 一款功能全面的套件，提供即时图像转文本转换、照片增强/恢复、HD上升、清晰背景剪切和快速对象擦除，支持180多种语言，包括罕见方言。
// @description:zh-TW 一款功能全面的套件，提供即時影像轉文字轉換、照片增強/恢復、HD上升、清晰背景剪切和快速物體擦除，支援180多種語言，包括罕見方言。
// @namespace    http://gpicy.com
// @version      1.1.8
// @author       gpicy
// @icon         https://cdn.jsdelivr.net/gh/gpicy/gpicy@main/assets/images/logo.svg
// @icon         data:image/png;base64,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
// @match        *://*/*
// @supportURL   https://gpicy.com?utm_source=greasyfork
// @grant        none
// @run-at       document-start
// @antifeature  ads
// @antifeature  payment
// @antifeature  membership
// @compatible   Chrome
// @compatible   Safari
// @compatible   Edge
// @compatible   Firefox
// @compatible   Opera
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/491463/AI%20OCR%2C%20Photo%20EditRestore%20Suite%3A%20Multilingual%2C%20HD%20Upscale%2C%20Cutout%20%20Object%20Erase.user.js
// @updateURL https://update.greasyfork.org/scripts/491463/AI%20OCR%2C%20Photo%20EditRestore%20Suite%3A%20Multilingual%2C%20HD%20Upscale%2C%20Cutout%20%20Object%20Erase.meta.js
// ==/UserScript==

(function() {
    const floatingMenu = document.createElement('div');
    floatingMenu.style.cssText = `
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background: linear-gradient(135deg, rgba(132, 16, 145, 0.45), rgba(222, 0, 114, 0.45));
    padding: 10px;
    border-radius: 0 5px 5px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    `;

    const closeButton = document.createElement('div');
    closeButton.innerHTML = `&times;`; // "×" symbol
    closeButton.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    margin-right: -10px;
    margin-top: -10px;
    border-radius: 15px; /* Makes it round */
    background-color: #FFF;
    color: #000;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
    closeButton.onclick = function() {
        document.body.removeChild(floatingMenu);
    };

    const menuTranslations = {
        'en': {
            'Image OCR': '🖼️ Image OCR',
            'PDF OCR': '📄 PDF OCR',
            'Lossless Image Enlarge': '🔍 Lossless Image Enlarge',
            'Background Removal': '🚫 Background Removal',
            'Object Removal': '🧹 Object Removal',
            'Photo Colorization': '🎨 Photo Colorization',
            'Portrait Restoration': '👥 Portrait Restoration'
        },
        'fr': { // French
            'Image OCR': '🖼️ OCR d\'Image',
            'PDF OCR': '📄 OCR de PDF',
            'Lossless Image Enlarge': '🔍 Agrandissement d\'Image Sans Perte',
            'Background Removal': '🚫 Suppression de l\'Arrière-plan',
            'Object Removal': '🧹 Retrait d\'Objet',
            'Photo Colorization': '🎨 Colorisation de Photo',
            'Portrait Restoration': '👥 Restauration de Portrait'
        },
        'de': { // German
            'Image OCR': '🖼️ Bild OCR',
            'PDF OCR': '📄 PDF OCR',
            'Lossless Image Enlarge': '🔍 Verlustfreie Bildvergrößerung',
            'Background Removal': '🚫 Hintergrund Entfernen',
            'Object Removal': '🧹 Objektentfernung',
            'Photo Colorization': '🎨 Fotokolorierung',
            'Portrait Restoration': '👥 Porträtrestaurierung'
        },
        'es': { // Spanish
            'Image OCR': '🖼️ OCR de Imagen',
            'PDF OCR': '📄 OCR de PDF',
            'Lossless Image Enlarge': '🔍 Ampliación de Imagen Sin Pérdida',
            'Background Removal': '🚫 Eliminación de Fondo',
            'Object Removal': '🧹 Eliminación de Objeto',
            'Photo Colorization': '🎨 Colorización de Fotos',
            'Portrait Restoration': '👥 Restauración de Retrato'
        },
        'it': { // Italian
            'Image OCR': '🖼️ OCR Immagine',
            'PDF OCR': '📄 OCR PDF',
            'Lossless Image Enlarge': '🔍 Ingrandimento Immagine Senza Perdite',
            'Background Removal': '🚫 Rimozione dello Sfondo',
            'Object Removal': '🧹 Rimozione Oggetto',
            'Photo Colorization': '🎨 Colorazione Foto',
            'Portrait Restoration': '👥 Restauro Ritratto'
        },
        'pt': { // Portuguese
            'Image OCR': '🖼️ OCR de Imagem',
            'PDF OCR': '📄 OCR de PDF',
            'Lossless Image Enlarge': '🔍 Ampliação de Imagem sem Perda',
            'Background Removal': '🚫 Remoção de Fundo',
            'Object Removal': '🧹 Remoção de Objeto',
            'Photo Colorization': '🎨 Coloração de Foto',
            'Portrait Restoration': '👥 Restauração de Retrato'
        },
        'ja': { // Japanese
            'Image OCR': '🖼️ 画像OCR',
            'PDF OCR': '📄 PDF OCR',
            'Lossless Image Enlarge': '🔍 ロスレス画像拡大',
            'Background Removal': '🚫 背景削除',
            'Object Removal': '🧹 オブジェクト削除',
            'Photo Colorization': '🎨 写真着色',
            'Portrait Restoration': '👥 ポートレート修復'
        },
        'nl': { // Dutch
            'Image OCR': '🖼️ Afbeelding OCR',
            'PDF OCR': '📄 PDF OCR',
            'Lossless Image Enlarge': '🔍 Verliesvrije Afbeelding Vergroten',
            'Background Removal': '🚫 Achtergrond Verwijderen',
            'Object Removal': '🧹 Object Verwijderen',
            'Photo Colorization': '🎨 Foto Inkleuren',
            'Portrait Restoration': '👥 Portret Restauratie'
        },
        'ru': { // Russian
            'Image OCR': '🖼️ OCR изображений',
            'PDF OCR': '📄 OCR PDF',
            'Lossless Image Enlarge': '🔍 Безубыточное Увеличение Изображения',
            'Background Removal': '🚫 Удаление Фона',
            'Object Removal': '🧹 Удаление Объектов',
            'Photo Colorization': '🎨 Колоризация Фото',
            'Portrait Restoration': '👥 Реставрация Портретов'
        },
        'ko': { // Korean
            'Image OCR': '🖼️ 이미지 OCR',
            'PDF OCR': '📄 PDF OCR',
            'Lossless Image Enlarge': '🔍 손실 없는 이미지 확대',
            'Background Removal': '🚫 배경 제거',
            'Object Removal': '🧹 객체 제거',
            'Photo Colorization': '🎨 사진 채색',
            'Portrait Restoration': '👥 초상화 복원'
        },
        'ar': { // Arabic
            'Image OCR': '🖼️ OCR للصور',
            'PDF OCR': '📄 OCR لملفات PDF',
            'Lossless Image Enlarge': '🔍 تكبير الصورة بدون فقدان',
            'Background Removal': '🚫 إزالة الخلفية',
            'Object Removal': '🧹 إزالة الكائن',
            'Photo Colorization': '🎨 تلوين الصور',
            'Portrait Restoration': '👥 استعادة الصور الشخصية'
        },
        'th': { // Thai
            'Image OCR': '🖼️ OCR ภาพ',
            'PDF OCR': '📄 OCR ไฟล์ PDF',
            'Lossless Image Enlarge': '🔍 ขยายภาพแบบไม่สูญเสียข้อมูล',
            'Background Removal': '🚫 ลบพื้นหลัง',
            'Object Removal': '🧹 ลบวัตถุ',
            'Photo Colorization': '🎨 การตกแต่งสีภาพถ่าย',
            'Portrait Restoration': '👥 การซ่อมแซมภาพเหมือน'
        },
        'zh': { // Simplified Chinese
            'Image OCR': '🖼️ 图像文字识别',
            'PDF OCR': '📄 PDF文字识别',
            'Lossless Image Enlarge': '🔍 无损放大图像',
            'Background Removal': '🚫 背景移除',
            'Object Removal': '🧹 物体移除',
            'Photo Colorization': '🎨 照片上色',
            'Portrait Restoration': '👥 人像修复'
        },
        'zh-TW': { // Traditional Chinese
            'Image OCR': '🖼️ 圖像文字識別',
            'PDF OCR': '📄 PDF文字識別',
            'Lossless Image Enlarge': '🔍 無損放大圖像',
            'Background Removal': '🚫 背景移除',
            'Object Removal': '🧹 物體移除',
            'Photo Colorization': '🎨 照片上色',
            'Portrait Restoration': '👥 人像修復'
        },

    };

    // Detecting your browser's preferred language
    function detectLanguage() {
        const supportedLangs = Object.keys(menuTranslations);
        const defaultLang = 'en';
        const userLangs = navigator.languages.map(lang => lang.split('-')[0]);
        for (let lang of userLangs) {
            if (supportedLangs.includes(lang)) {
                return lang;
            }
        }
        return defaultLang;
    }

    // Get the language translation of the current user
    const currentLang = detectLanguage();
    const translations = menuTranslations[currentLang];

    // List of features and associated URLs
    const features = [
        { icon: '🖼️', name: 'Image OCR', url: 'https://gpicy.com/en-US/image-ocr?utm_source=greasyfork', desc: 'Image recognition to text' },
        { icon: '📄',   name: 'PDF OCR', url: 'https://gpicy.com/en-US/pdf-ocr?utm_source=greasyfork', desc: 'PDF recognition into text' },
        { icon: '🔍',   name: 'Lossless Image Enlarge', url: 'https://gpicy.com/en-US/lossless-image-enlarge?utm_source=greasyfork', desc: 'Lossless magnification of AI image' },
        { icon: '🚫',   name: 'Background Removal', url: 'https://gpicy.com/en-US/background-removal?utm_source=greasyfork', desc: 'AI Background Removal' },
        { icon: '🧹',   name: 'Object Removal', url: 'https://gpicy.com/en-US/object-removal?utm_source=greasyfork', desc: 'AI Object Removal' },
        { icon: '🎨',   name: 'Photo Colorization', url: 'https://gpicy.com/en-US/photo-colorization?utm_source=greasyfork', desc: 'AI Photo Colorization' },
        { icon: '👥',   name: 'Portrait Restoration', url: 'https://gpicy.com/en-US/portrait-restoration?utm_source=greasyfork', desc: 'AI Portrait Restoration' },
    ];

    floatingMenu.appendChild(closeButton);

    features.forEach(feature => {
        const button = document.createElement('button');
        const translatedName = translations[feature.name] || feature.name;
        button.innerHTML = `${translatedName}`;
        button.style.cssText = `
        display: block;
        width: 100%;
        margin: 5px 0;
        background-color: #FFF;
        color: #000;
        border: none;
        border-radius: 3px;
        padding: 10px;
        cursor: pointer;
        text-align: left;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        `;

        button.onmouseenter = function() {
            this.style.transform = 'translateX(10px)';
            this.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.2)';
        };

        button.onmouseleave = function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        };

        button.onclick = function() {
            window.open(feature.url, '_blank');
        };

        const tooltip = document.createElement('span');
        tooltip.textContent = feature.desc;
        tooltip.style.cssText = `
            visibility: hidden;
            width: 120px;
            background-color: black;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -60px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        button.appendChild(tooltip);

        button.onmouseover = function() {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        };

        button.onmouseout = function() {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        };

        floatingMenu.appendChild(button);
    });

    document.body.appendChild(floatingMenu);
})();

