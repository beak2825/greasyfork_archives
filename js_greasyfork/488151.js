// ==UserScript==
// @name         Show Accurate View Count, Asked timestamp and Modified timestamp of StackExchange question
// @name:ja      StackExchange質問の正確な閲覧数、質問時刻、修正時刻を表示
// @name:ko      StackExchange 질문의 정확한 조회수, 질문 시간戳, 수정 시간戳 표시
// @name:zh      显示StackExchange问题的准确查看次数、提问时间戳和修改时间戳
// @name:zh-CN   显示StackExchange问题的准确查看次数、提问时间戳和修改时间戳
// @name:zh-HK   顯示StackExchange問題的準確瀏覽次數、提問時間戳和修改時間戳
// @name:zh-SG   显示StackExchange问题的准确查看次数、提问时间戳和修改时间戳
// @name:zh-TW   顯示StackExchange問題的準確瀏覽次數、提問時間戳和修改時間戳
// @description  Show Accurate View Count, Asked timestamp and Modified timestamp of StackExchange question.
// @description:ar إظهار عدد المشاهدات الدقيق وطابع زمني للسؤال وطابع زمني للتعديل لسؤال StackExchange.
// @description:cs Zobrazit přesný počet zobrazení, čas položení a čas úpravy otázky na StackExchange.
// @description:da Vis nøjagtigt visningstal, tidsstempel for spørgsmål og ændringstidspunkt for StackExchange-spørgsmål.
// @description:de Genaue Aufrufzahl, Zeitstempel der Frage und Änderungszeitstempel von StackExchange-Fragen anzeigen.
// @description:en Show Accurate View Count, Asked timestamp and Modified timestamp of StackExchange question.
// @description:eo Montri Precizan Nombron de Vidoj, Tempomarkon de Demando kaj Modifitan Tempomarkon de StackExchange-demando.
// @description:fi Näytä tarkka katselukertojen määrä, kysymyksen aikaleima ja muokattu aikaleima StackExchange-kysymyksessä.
// @description:fr Afficher le compte précis des vues, l'horodatage de la question et l'horodatage modifié d'une question StackExchange.
// @description:he הצג ספירת צפיות מדויקת, חותמת זמן של השאלה וחותמת זמן של שינוי לשאלת StackExchange.
// @description:hr Prikaz točnog broja pregleda, vremenske oznake postavljanja i vremenske oznake izmjene pitanja na StackExchange.
// @description:hu Pontos megtekintési szám, kérdés időbélyege és módosított időbélyeg megjelenítése StackExchange kérdésnél.
// @description:id Tampilkan Jumlah Tampilan Akurat, Stempel Waktu Ditanya, dan Stempel Waktu Dimodifikasi dari pertanyaan StackExchange.
// @description:it Mostra conteggio preciso delle visualizzazioni, timestamp della domanda e timestamp modificato di una domanda StackExchange.
// @description:ja StackExchange質問の正確な閲覧数、質問時刻、修正時刻を表示。
// @description:ko StackExchange 질문의 정확한 조회수, 질문 시간戳, 수정 시간戳 표시.
// @description:nb Vis nøyaktig visningstall, tidsstempel for spørsmål og endret tidsstempel for StackExchange-spørsmål.
// @description:nl Toon nauwkeurige weergavetelling, tijdstempel van vraag en gewijzigde tijdstempel van StackExchange-vraag.
// @description:sk Zobraziť presný počet zobrazení, časovú pečiatku otázky a upravenú časovú pečiatku otázky na StackExchange.
// @description:sv Visa exakt visningsantal, tidsstämpel för frågan och modifierad tidsstämpel för StackExchange-fråga.
// @description:th แสดงจำนวนการดูที่แม่นยำ, เวลาที่ถาม และเวลาที่แก้ไขของคำถาม StackExchange.
// @description:tr StackExchange sorusunun doğru görüntüleme sayısını, sorulma zaman damgasını ve değiştirilme zaman damgasını göster.
// @description:vi Hiển thị số lượt xem chính xác, dấu thời gian được hỏi và dấu thời gian đã chỉnh sửa của câu hỏi StackExchange.
// @description:zh 显示StackExchange问题的准确查看次数、提问时间戳和修改时间戳。
// @description:zh-CN 显示StackExchange问题的准确查看次数、提问时间戳和修改时间戳。
// @description:zh-HK 顯示StackExchange問題的準確瀏覽次數、提問時間戳和修改時間戳。
// @description:zh-SG 显示StackExchange问题的准确查看次数、提问时间戳和修改时间戳。
// @description:zh-TW 顯示StackExchange問題的準確瀏覽次數、提問時間戳和修改時間戳。
// @namespace    http://tampermonkey.net/
// @version      0.1.2.1
// @license      MIT
// @author       aspen138
// @match          *://*.stackoverflow.com/questions/*
// @match          *://superuser.com/questions/*
// @match          *://meta.superuser.com/questions/*
// @match          *://serverfault.com/questions/*
// @match          *://meta.serverfault.com/questions/*
// @match          *://askubuntu.com/questions/*
// @match          *://meta.askubuntu.com/questions/*
// @match          *://mathoverflow.net/questions/*
// @match          *://meta.mathoverflow.net/questions/*
// @match          *://*.stackexchange.com/questions/*
// @match          *://answers.onstartups.com/questions/*
// @match          *://meta.answers.onstartups.com/questions/*
// @match          *://stackapps.com/questions/*
// @match          *://*.stackoverflow.com/review/*
// @match          *://superuser.com/review/*
// @match          *://meta.superuser.com/review/*
// @match          *://serverfault.com/review/*
// @match          *://meta.serverfault.com/review/*
// @match          *://askubuntu.com/review/*
// @match          *://meta.askubuntu.com/review/*
// @match          *://mathoverflow.net/review/*
// @match          *://meta.mathoverflow.net/review/*
// @match          *://*.stackexchange.com/review/*
// @match          *://answers.onstartups.com/review/*
// @match          *://meta.answers.onstartups.com/review/*
// @match          *://stackapps.com/review/*
// @match          *://*.stackoverflow.com/search*
// @match          *://superuser.com/search*
// @match          *://meta.superuser.com/search*
// @match          *://serverfault.com/search*
// @match          *://meta.serverfault.com/search*
// @match          *://askubuntu.com/search*
// @match          *://meta.askubuntu.com/search*
// @match          *://mathoverflow.net/search*
// @match          *://meta.mathoverflow.net/search*
// @match          *://*.stackexchange.com/search*
// @match          *://answers.onstartups.com/search*
// @match          *://meta.answers.onstartups.com/search*
// @match          *://stackapps.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488151/Show%20Accurate%20View%20Count%2C%20Asked%20timestamp%20and%20Modified%20timestamp%20of%20StackExchange%20question.user.js
// @updateURL https://update.greasyfork.org/scripts/488151/Show%20Accurate%20View%20Count%2C%20Asked%20timestamp%20and%20Modified%20timestamp%20of%20StackExchange%20question.meta.js
// ==/UserScript==


// @match      *://*.stackexchange.com/*

(function() {
    'use strict';

    // Define a function to format the date
    function formatDate(date) {
        return date.toISOString().replace('T', ' ').replace(/\..*$/, 'Z');
    }

    // Update Asked time
    const askedTimeElement = document.querySelector('time[itemprop="dateCreated"]');
    if (askedTimeElement) {
        const askedDate = new Date(askedTimeElement.getAttribute('datetime'));
        console.log("askedDate=", askedDate);
        askedTimeElement.innerText = formatDate(askedDate);
    }

    // Update Modified time
    const modifiedTimeElement = document.querySelector('a[href*="?lastactivity"]');
    if (modifiedTimeElement) {
        const modifiedDate = new Date(modifiedTimeElement.getAttribute('title'));
        console.log("modifiedDate=", modifiedDate);
        modifiedTimeElement.innerText = formatDate(modifiedDate);
    }

    // Update Viewed count
    const viewedElement = document.querySelector('div[title*="Viewed"]');
    if (viewedElement) {
        const viewCount = viewedElement.getAttribute('title').match(/Viewed ([\d,]+) times/);
        if (viewCount && viewCount[1]) {
            viewedElement.innerText = 'Viewed ' + viewCount[1].replace(/,/g, '') + ' times';
        }
    }
})();
