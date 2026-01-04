// ==UserScript==
// @name         Resizable Table Columns & Replace Link Text
// @description  Let user resize table columns by dragging the header edges & replace anchor text with its title attribute
// @name:ar      أعمدة جدول قابلة لتغيير الحجم واستبدال نص الرابط
// @description:ar يتيح للمستخدم تغيير حجم أعمدة الجدول بسحب حواف الرأس واستبدال نص الرابط بسمة العنوان الخاص به
// @name:bg      Преоразмеряеми колони на таблица и замяна на текст на връзка
// @description:bg Позволява на потребителя да преоразмерява колоните на таблицата чрез плъзгане на ръбовете на заглавието и да заменя текста на връзката с атрибута за заглавие
// @name:cs      Přizpůsobitelné sloupce tabulky a nahrazení textu odkazu
// @description:cs Umožňuje uživateli měnit velikost sloupců tabulky tažením okrajů záhlaví a nahradit text odkazu jeho atributem title
// @name:da      Justerbare tabelkolonner og udskiftning af linktekst
// @description:da Lader brugeren ændre størrelsen på tabelkolonner ved at trække i kanterne på overskriften og erstatte linkteksten med dens titelattribut
// @name:de      Anpassbare Tabellenspalten & Linktext ersetzen
// @description:de Ermöglicht dem Benutzer, Tabellenspalten durch Ziehen der Kopfzeilenränder anzupassen und den Ankertext durch dessen Titelattribut zu ersetzen
// @name:el      Προσαρμόσιμες στήλες πίνακα & αντικατάσταση κειμένου συνδέσμου
// @description:el Επιτρέπει στον χρήστη να αλλάζει το μέγεθος των στηλών του πίνακα σύροντας τις άκρες της κεφαλίδας και να αντικαθιστά το κείμενο του συνδέσμου με το χαρακτηριστικό τίτλου του
// @name:en      Resizable Table Columns & Replace Link Text
// @description:en Let user resize table columns by dragging the header edges & replace anchor text with its title attribute
// @name:eo      Regrandigeblaj Tabelkolumnoj & Anstataŭigo de Ligila Teksto
// @description:eo Permesas al la uzanto regrandigi tabelkolumnojn per trenado de la kapliniaj randoj kaj anstataŭigi la ankran tekston per ĝia titolatributo
// @name:es      Columnas de tabla redimensionables y reemplazo de texto de enlace
// @description:es Permite al usuario redimensionar columnas de tabla arrastrando los bordes del encabezado y reemplazar el texto del enlace con su atributo de título
// @name:fi      Muutettavan kokoiset taulukkosarakkeet ja linkkitekstin korvaaminen
// @description:fi Antaa käyttäjän muuttaa taulukkosarakkeiden kokoa vetämällä otsikon reunoja ja korvata linkkitekstin sen otsikkoattribuutilla
// @name:fr      Colonnes de tableau redimensionnables et remplacement du texte du lien
// @description:fr Permet à l’utilisateur de redimensionner les colonnes du tableau en faisant glisser les bords de l’en-tête et de remplacer le texte du lien par son attribut de titre
// @name:fr-CA   Colonnes de tableau redimensionnables et remplacement du texte du lien
// @description:fr-CA Permet à l’utilisateur de redimensionner les colonnes du tableau en faisant glisser les bords de l’en-tête et de remplacer le texte du lien par son attribut de titre
// @name:he      עמודות טבלה הניתנות לשינוי גודל והחלפת טקסט קישור
// @description:he מאפשר למשתמש לשנות את גודל עמודות הטבלה על ידי גרירת קצוות הכותרת ולהחליף את טקסט העוגן בתכונת הכותרת שלו
// @name:hr      Promjenjive širine stupaca tablice i zamjena teksta poveznice
// @description:hr Omogućuje korisniku promjenu širine stupaca tablice povlačenjem rubova zaglavlja i zamjenu teksta poveznice s njegovim atributom naslova
// @name:hu      Átméretezhető táblázat oszlopok és hivatkozásszöveg cseréje
// @description:hu Lehetővé teszi a felhasználó számára, hogy átméretezze a táblázat oszlopait a fejléc széleinek húzásával, és lecserélje a horgonyszöveget annak cím attribútumára
// @name:id      Kolom Tabel yang Dapat Diubah Ukurannya & Ganti Teks Tautan
// @description:id Memungkinkan pengguna mengubah ukuran kolom tabel dengan menyeret tepi header & mengganti teks tautan dengan atribut judulnya
// @name:it      Colonne della tabella ridimensionabili e sostituzione del testo del link
// @description:it Consente all’utente di ridimensionare le colonne della tabella trascinando i bordi dell’intestazione e sostituire il testo del link con il suo attributo title
// @name:ja      リサイズ可能なテーブル列とリンクテキストの置換
// @description:ja ユーザーがヘッダーの端をドラッグしてテーブル列のサイズを変更し、アンカーテキストをそのタイトル属性で置き換えることを可能にします
// @name:ka      ცხრილის სვეტების ზომის შეცვლა და ბმულის ტექსტის ჩანაცვლება
// @description:ka საშუალებას აძლევს მომხმარებელს შეცვალოს ცხრილის სვეტების ზომა თავსართის კიდეების გადათრევით და შეცვალოს ბმულის ტექსტი მისი სათაურის ატრიბუტით
// @name:ko      크기 조절 가능한 테이블 열 및 링크 텍스트 교체
// @description:ko 사용자가 헤더 가장자리를 드래그하여 테이블 열 크기를 조절하고 앵커 텍스트를 그 제목 속성으로 교체할 수 있게 합니다
// @name:nb      Justerbare tabellkolonner og erstatning av lenketekst
// @description:nb Lar brukeren justere tabellkolonner ved å dra i kantene på overskriften og erstatte lenketeksten med dens tittelattributt
// @name:nl      Aanpasbare tabelkolommen & vervanging van linktekst
// @description:nl Laat de gebruiker tabelkolommen aanpassen door de randen van de kop te slepen en de linktekst vervangen door het titelattribuut
// @name:pl      Regulowane kolumny tabeli i zamiana tekstu linku
// @description:pl Umożliwia użytkownikowi regulację kolumn tabeli przez przeciąganie krawędzi nagłówka oraz zamianę tekstu linku na jego atrybut title
// @name:pt-BR   Colunas de tabela redimensionáveis e substituição de texto de link
// @description:pt-BR Permite ao usuário redimensionar colunas de tabela arrastando as bordas do cabeçalho e substituir o texto do link pelo seu atributo de título
// @name:ro      Coloane de tabel redimensionabile și înlocuirea textului linkului
// @description:ro Permite utilizatorului să redimensioneze coloanele tabelului trăgând marginile antetului și să înlocuiască textul linkului cu atributul său de titlu
// @name:ru      Изменяемые размеры столбцов таблицы и замена текста ссылки
// @description:ru Позволяет пользователю изменять размер столбцов таблицы, перетаскивая края заголовка, и заменять текст ссылки её атрибутом заголовка
// @name:sk      Prispôsobiteľné stĺpce tabuľky a nahradenie textu odkazu
// @description:sk Umožňuje používateľovi meniť veľkosť stĺpcov tabuľky ťahaním okrajov hlavičky a nahradiť text odkazu jeho atribútom title
// @name:sr      Променљиве ширине колона табеле и замена текста везе
// @description:sr Омогућава кориснику да промени ширину колона табеле повлачењем ивица заглавља и замени текст везе са њеним атрибутом наслова
// @name:sv      Justerbara tabellkolumner och ersättning av länktext
// @description:sv Låter användaren justera tabellkolumner genom att dra i kanterna på rubriken och ersätta länktexten med dess titelattribut
// @name:th      คอลัมน์ตารางปรับขนาดได้และการแทนที่ข้อความลิงก์
// @description:th อนุญาตให้ผู้ใช้ปรับขนาดคอลัมน์ตารางโดยการลากขอบของส่วนหัวและแทนที่ข้อความลิงก์ด้วยแอตทริบิวต์ชื่อเรื่อง
// @name:tr      Yeniden Boyutlandırılabilir Tablo Sütunları ve Bağlantı Metni Değiştirme
// @description:tr Kullanıcının tablo sütunlarını başlık kenarlarını sürükleyerek yeniden boyutlandırmasına ve bağlantı metnini başlık özniteliği ile değiştirmesine olanak tanır
// @name:ug      كۆلەم ئۆزگەرتىشكە بولىدىغان جەدۋەل ئىستونلىرى ۋە ئۇلىنىش تېكىستىنى ئالماشتۇرۇش
// @description:ug ئىشلەتكۈچىگە جەدۋەل ئىستونلىرىنى باشلىق چەتلىرىنى سۆرەپ كۆلەم ئۆزگەرتىشكە ۋە ئۇلىنىش تېكىستىنى ئۇنىڭ ماۋزۇ ئالاھىدىلىكى بىلەن ئالماشتۇرۇشقا يول قويىدۇ
// @name:uk      Змінювані розміри стовпців таблиці та заміна тексту посилання
// @description:uk Дозволяє користувачу змінювати розміри стовпців таблиці, перетягуючи краї заголовка, та замінювати текст посилання його атрибутом заголовка
// @name:vi      Cột bảng có thể thay đổi kích thước & thay thế văn bản liên kết
// @description:vi Cho phép người dùng thay đổi kích thước cột bảng bằng cách kéo các cạnh tiêu đề và thay thế văn bản liên kết bằng thuộc tính tiêu đề của nó
// @name:zh      可调整大小的表格列和替换链接文本
// @description:zh 让用户通过拖动表头边缘调整表格列大小，并将锚文本替换为其标题属性
// @name:zh-CN   可调整大小的表格列和替换链接文本
// @description:zh-CN 让用户通过拖动表头边缘调整表格列大小，并将锚文本替换为其标题属性
// @name:zh-HK   可調節大小嘅表格列同取代連結文本
// @description:zh-HK 畀用戶通過拖動表頭邊緣調整表格列大小，並將錨點文本取代為其標題屬性
// @name:zh-SG   可调整大小的表格列和替换链接文本
// @description:zh-SG 让用户通过拖动表头边缘调整表格列大小，并将锚文本替换为其标题属性
// @name:zh-TW   可調整大小的表格列與替換連結文字
// @description:zh-TW 讓使用者通過拖曳表頭邊緣調整表格列大小，並將錨文字替換為其標題屬性
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       aspen138
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527626/Resizable%20Table%20Columns%20%20Replace%20Link%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/527626/Resizable%20Table%20Columns%20%20Replace%20Link%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Insert some CSS for the column "grip" that we'll add to each header
    const style = document.createElement('style');
    style.textContent = `
      .column-resize-grip {
        position: absolute;
        top: 0;
        right: 0;
        width: 6px;       /* Thicker area for easier dragging */
        height: 100%;
        cursor: col-resize;
        user-select: none;
      }
      th.resizable-header {
        position: relative;
      }
    `;
    document.head.appendChild(style);

    /**
     * Attach grips to each table header so we can drag the column widths.
     * @param {HTMLTableElement} table  A table element to attach resizing.
     */
    function makeColumnsResizable(table) {
        const headers = table.querySelectorAll('th');
        if (!headers.length) return;

        headers.forEach((header) => {
            header.classList.add('resizable-header');
            // Avoid adding multiple grips if script runs again
            if (header.querySelector('.column-resize-grip')) return;

            const grip = document.createElement('div');
            grip.className = 'column-resize-grip';
            header.appendChild(grip);

            grip.addEventListener('mousedown', startDragging);
        });

        function startDragging(event) {
            event.preventDefault();
            event.stopPropagation();

            const headerEl = event.target.parentElement;
            const startX = event.clientX;
            const startWidth = headerEl.offsetWidth;

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDragging);

            function onDrag(e) {
                const dx = e.clientX - startX;
                headerEl.style.width = `${startWidth + dx}px`;
            }

            function stopDragging() {
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', stopDragging);
            }
        }
    }

    /**
     * Replace the truncated link text with its full "title" attribute.
     * @param {HTMLTableElement} table A table element containing anchors with a title attribute.
     */
    function replaceLinkTextWithTitle(table) {
        const anchors = table.querySelectorAll('a[title]');
        anchors.forEach(anchor => {
            anchor.textContent = anchor.getAttribute('title');
        });
    }

    window.addEventListener('load', function() {
        // Modify the selector below to match your table's selector
        const table = document.querySelector('.t-tablelist');
        if (table) {
            makeColumnsResizable(table);
            replaceLinkTextWithTitle(table);
        }
    });
})();