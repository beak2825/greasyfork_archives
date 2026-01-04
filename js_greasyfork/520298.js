// ==UserScript==
// @name         Add Copy Button to Chat Messages on Github Copilot web page
// @name:ar      إضافة زر نسخ إلى رسائل الدردشة في صفحة Github Copilot
// @name:bg      Добавяне на бутон за копиране към чат съобщенията на уеб страницата на Github Copilot
// @name:cs      Přidat tlačítko Kopírovat ke zprávám chatu na webové stránce Github Copilot
// @name:da      Tilføj Kopier-knap til chatbeskeder på Github Copilot webside
// @name:de      Kopier-Button zu Chatnachrichten auf der Github Copilot Webseite hinzufügen
// @name:el      Προσθήκη κουμπιού αντιγραφής στα μηνύματα συνομιλίας στην ιστοσελίδα Github Copilot
// @name:en         Add Copy Button to Chat Messages on Github Copilot web page
// @name:eo         Aldoni Kopian Butonon al Babilaj Mesaĝoj sur Github Copilot retpaĝo
// @name:es         Añadir botón de copiar a los mensajes de chat en la página web de Github Copilot
// @name:fi         Lisää kopiointipainike Github Copilotin verkkosivun chattiviesteihin
// @name:fr         Ajouter un bouton de copie aux messages de chat sur la page web Github Copilot
// @name:fr-CA      Ajouter un bouton de copie aux messages de chat sur la page web Github Copilot (Canada)
// @name:he         הוספת כפתור העתקה להודעות צ'אט בדף האינטרנט של Github Copilot
// @name:hr         Dodaj gumb za kopiranje porukama chata na web stranici Github Copilot
// @name:hu         Másolás gomb hozzáadása a csevegő üzenetekhez a Github Copilot weboldalán
// @name:id         Tambahkan Tombol Salin ke Pesan Obrolan di Halaman Web Github Copilot
// @name:it         Aggiungi pulsante Copia ai messaggi di chat sulla pagina web di Github Copilot
// @name:ja         Github Copilot Web ページのチャットメッセージにコピーボタンを追加
// @name:ka         დაამატეთ კოპირების ღილაკი Github Copilot-ის ვებ გვერდზე ჩეთის შეტყობინებებს
// @name:ko         Github Copilot 웹 페이지의 채팅 메시지에 복사 버튼 추가
// @name:nb         Legg til Kopier-knapp til chatmeldinger på Github Copilot-websiden
// @name:nl         Kopieerknop toevoegen aan chatberichten op Github Copilot webpagina
// @name:pl         Dodaj przycisk Kopiuj do wiadomości na czacie na stronie Github Copilot
// @name:pt-BR       Adicionar botão de copiar às mensagens de chat na página web do Github Copilot
// @name:ro         Adaugă butonul Copiază la mesajele chat de pe pagina web Github Copilot
// @name:ru         Добавить кнопку "Копировать" к сообщениям чата на веб-странице Github Copilot
// @name:sk         Pridať tlačidlo Kopírovať k chatovým správam na webovej stránke Github Copilot
// @name:sr         Додај дугме Копирај порукама ћаскања на веб страници Github Copilot
// @name:sv         Lägg till Kopiera-knapp till chattmeddelanden på Github Copilot-webbsidan
// @name:th         เพิ่มปุ่มคัดลอกไปยังข้อความแชทบนหน้าเว็บ Github Copilot
// @name:tr         Github Copilot web sayfasındaki sohbet mesajlarına Kopyala düğmesi ekle
// @name:ug         Github Copilot تور بېتىدىكى پاراڭلىشىش ئۇچۇرلىرىغا كۆچۈرۈش كۇنۇپكىسى قوشۇش
// @name:uk         Додати кнопку "Копіювати" до повідомлень чату на веб-сторінці Github Copilot
// @name:vi         Thêm nút Sao chép vào tin nhắn trò chuyện trên trang web Github Copilot
// @name:zh         在 Github Copilot 网页的聊天消息中添加复制按钮
// @name:zh-CN      在 Github Copilot 网页的聊天消息中添加复制按钮
// @name:zh-HK      在 Github Copilot 網頁的聊天訊息中新增複製按鈕
// @name:zh-SG      在 Github Copilot 网页的聊天消息中添加复制按钮
// @name:zh-TW      在 Github Copilot 網頁的聊天訊息中新增複製按鈕
// @description  Adds a "Copy" button to chat message elements to easily copy their content.
// @description:ar  يضيف زر "نسخ" إلى عناصر رسائل الدردشة لنسخ محتواها بسهولة.
// @description:bg  Добавя бутон "Копиране" към елементите на чат съобщенията, за да можете лесно да копирате съдържанието им.
// @description:cs  Přidá tlačítko "Kopírovat" k prvkům zpráv chatu pro snadné kopírování jejich obsahu.
// @description:da  Tilføjer en "Kopier"-knap til chatbeskedelementer for nemt at kopiere deres indhold.
// @description:de  Fügt einen "Kopieren"-Button zu Chatnachrichtenelementen hinzu, um deren Inhalt einfach zu kopieren.
// @description:el  Προσθέτει ένα κουμπί "Αντιγραφή" στα στοιχεία μηνυμάτων συνομιλίας για εύκολη αντιγραφή του περιεχομένου τους.
// @description:en  Adds a "Copy" button to chat message elements to easily copy their content.
// @description:eo  Aldonas "Kopi" butonon al la babilejmesaĝaj elementoj por facile kopii ilian enhavon.
// @description:es  Añade un botón de "Copiar" a los elementos de los mensajes de chat para copiar fácilmente su contenido.
// @description:fi  Lisää "Kopioi"-painikkeen chattiviestielementteihin, jotta niiden sisällön kopioiminen olisi helppoa.
// @description:fr  Ajoute un bouton "Copier" aux éléments de message de chat pour copier facilement leur contenu.
// @description:fr-CA  Ajoute un bouton "Copier" aux éléments de message de chat pour copier facilement leur contenu.
// @description:he  מוסיף כפתור "העתקה" לרכיבי הודעות צ'אט כדי להעתיק בקלות את התוכן שלהם.
// @description:hr  Dodaje gumb "Kopiraj" elementima poruka chata za jednostavno kopiranje njihovog sadržaja.
// @description:hu  Hozzáad egy "Másolás" gombot a csevegő üzenetelemekhez, hogy könnyen másolható legyen a tartalmuk.
// @description:id  Menambahkan tombol "Salin" ke elemen pesan obrolan untuk menyalin kontennya dengan mudah.
// @description:it  Aggiunge un pulsante "Copia" agli elementi dei messaggi di chat per copiare facilmente il loro contenuto.
// @description:ja  チャットメッセージ要素に「コピー」ボタンを追加して、コンテンツを簡単にコピーできるようにします。
// @description:ka  ამატებს "კოპირების" ღილაკს ჩეთის შეტყობინების ელემენტებს, რათა მარტივად დააკოპიროთ მათი შინაარსი.
// @description:ko  채팅 메시지 요소에 "복사" 버튼을 추가하여 해당 콘텐츠를 쉽게 복사할 수 있습니다.
// @description:nb  Legger til en "Kopier"-knapp til chatmeldingselementer for å enkelt kopiere innholdet deres.
// @description:nl  Voegt een "Kopieer"-knop toe aan chatberichtelementen om de inhoud ervan gemakkelijk te kopiëren.
// @description:pl  Dodaje przycisk "Kopiuj" do elementów wiadomości na czacie, aby łatwo kopiować ich zawartość.
// @description:pt-BR  Adiciona um botão "Copiar" aos elementos de mensagens de chat para copiar facilmente seu conteúdo.
// @description:ro  Adaugă un buton "Copiază" elementelor mesajelor chat pentru a copia cu ușurință conținutul acestora.
// @description:ru  Добавляет кнопку "Копировать" к элементам сообщений чата для удобного копирования их содержимого.
// @description:sk  Pridá tlačidlo "Kopírovať" k elementom chatových správ pre jednoduché kopírovanie ich obsahu.
// @description:sr  Додаје дугме "Копирај" елементима порука ћаскања ради лакшег копирања њиховог садржаја.
// @description:sv  Lägger till en "Kopiera"-knapp till chattmeddelandeelement för att enkelt kopiera deras innehåll.
// @description:th  เพิ่มปุ่ม "คัดลอก" ไปยังองค์ประกอบข้อความแชทเพื่อให้คัดลอกเนื้อหาได้ง่าย
// @description:tr  Sohbet mesajı öğelerine içeriklerini kolayca kopyalamak için bir "Kopyala" düğmesi ekler.
// @description:ug  پاراڭلىشىش ئۇچۇر ئېلېمېنتلىرىغا «كۆچۈرۈش» كۇنۇپكىسى قوشۇپ ئۇلارنىڭ مەزمۇنىنى ئاسان كۆچۈرۈشكە قۇلايلىق يارىتىدۇ.
// @description:uk  Додає кнопку "Копіювати" до елементів повідомлень чату для легкого копіювання їх вмісту.
// @description:vi  Thêm nút "Sao chép" vào các phần tử tin nhắn trò chuyện để dễ dàng sao chép nội dung của chúng.
// @description:zh  在聊天消息元素中添加一个“复制”按钮，以便轻松复制其内容。
// @description:zh-CN  在聊天消息元素中添加一个“复制”按钮，以便轻松复制其内容。
// @description:zh-HK  在聊天訊息元素中新增一個「複製」按鈕，以便輕鬆複製其內容。
// @description:zh-SG  在聊天消息元素中添加一个“复制”按钮，以便轻松复制其内容。
// @description:zh-TW  在聊天訊息元素中新增一個「複製」按鈕，以便輕鬆複製其內容。
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @author       aspen138
// @match        *://github.com/copilot/c/*
// @match        *://github.com/copilot/
// @match        *://github.com/copilot/*
// @grant        none
// @run-at       document-end
// @icon         https://github.com/favicons/favicon-copilot.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520298/Add%20Copy%20Button%20to%20Chat%20Messages%20on%20Github%20Copilot%20web%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/520298/Add%20Copy%20Button%20to%20Chat%20Messages%20on%20Github%20Copilot%20web%20page.meta.js
// ==/UserScript==





(function() {
    'use strict';

    // Update these if class names change
    const MESSAGE_CONTENT_CLASS = 'UserMessage-module__container--cAvvK';
    const CHAT_MESSAGE_CONTENT_CLASS = 'ChatMessage-module__content--MYneF';

    /**
     * Creates and returns a copy button element.
     */
    function createCopyButton() {
        const button = document.createElement('button');
        button.innerText = 'Copy';
        button.classList.add('copy-button');

        // Use sticky positioning to keep it visible while the element is in view
        button.style.position = 'sticky';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '0.9em';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        button.style.marginLeft = 'auto';
        button.style.float = 'right';
        button.style.display = 'inline-block';
        // Ensure parent or relevant ancestor allows sticky to function
        // For sticky to work, the ancestor should have no overflow constraints that break it.

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#45a049';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#4CAF50';
        });

        return button;
    }

    /**
     * Adds a copy button to a chat message element.
     * @param {HTMLElement} messageElement
     */
    function addCopyButton(messageElement) {
        // Prevent adding multiple buttons
        if (messageElement.querySelector('.copy-button')) return;

        const messageContent = messageElement.querySelector(`.${MESSAGE_CONTENT_CLASS}`);
        if (!messageContent) return;

        // Ensure the parent is a block-level container that supports sticky
        messageElement.style.position = 'relative';
        messageElement.style.display = 'block';

        const copyButton = createCopyButton();

        copyButton.addEventListener('click', () => {
            const textToCopy = messageContent.innerText.trim();
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyButton.innerText = 'Copied!';
                copyButton.style.backgroundColor = '#388E3C';
                setTimeout(() => {
                    copyButton.innerText = 'Copy';
                    copyButton.style.backgroundColor = '#4CAF50';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });

        messageElement.appendChild(copyButton);
    }

    /**
     * Processes all existing chat messages on page load.
     */
    function processExistingMessages() {
        const messageElements = document.querySelectorAll(`.${CHAT_MESSAGE_CONTENT_CLASS}`);
        messageElements.forEach(messageElement => addCopyButton(messageElement));
    }

    /**
     * Observes newly added messages dynamically.
     */
    function observeNewMessages() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && node.classList.contains(CHAT_MESSAGE_CONTENT_CLASS)) {
                                addCopyButton(node);
                            }
                            const nestedMessages = node.querySelectorAll(`.${CHAT_MESSAGE_CONTENT_CLASS}`);
                            nestedMessages.forEach(nestedNode => addCopyButton(nestedNode));
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    function init() {
        processExistingMessages();
        observeNewMessages();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();


