// ==UserScript==
// @name         Highlight accounts whose questions or answers count > 0 on Stack Exchange profiles
// @description  Highlight divs with questions count>0 or answers count > 0 on Stack Exchange profiles
// @name:ar      إبراز الحسابات التي تحتوي على عدد أسئلة أو إجابات > 0 في ملفات Stack Exchange
// @description:ar إبراز العناصر التي تحتوي على عدد أسئلة > 0 أو عدد إجابات > 0 في ملفات Stack Exchange
// @name:cs      Zvýraznění účtů s počtem otázek nebo odpovědí > 0 na profilech Stack Exchange
// @description:cs Zvýrazňuje divy s počtem otázek > 0 nebo počtem odpovědí > 0 na profilech Stack Exchange
// @name:da      Fremhæv konti med antal spørgsmål eller svar > 0 på Stack Exchange-profiler
// @description:da Fremhæver divs med antal spørgsmål > 0 eller antal svar > 0 på Stack Exchange-profiler
// @name:de      Hervorheben von Konten mit Fragen- oder Antwortzahlen > 0 auf Stack Exchange-Profilen
// @description:de Hebt Divs mit Fragenanzahl > 0 oder Antwortanzahl > 0 auf Stack Exchange-Profilen hervor
// @name:en      Highlight accounts whose questions or answers count > 0 on Stack Exchange profiles
// @description:en Highlight divs with questions count>0 or answers count > 0 on Stack Exchange profiles
// @name:eo      Emfazi Kontojn kun Demandoj aŭ Respondoj > 0 en Stack Exchange Profiloj
// @description:eo Emfazas div-ojn kun nombro da demandoj > 0 aŭ nombro da respondoj > 0 en Stack Exchange-profiloj
// @name:es      Resaltar cuentas con conteo de preguntas o respuestas > 0 en perfiles de Stack Exchange
// @description:es Resalta divs con conteo de preguntas > 0 o conteo de respuestas > 0 en perfiles de Stack Exchange
// @name:fi      Korosta tilejä, joilla on kysymyksiä tai vastauksia > 0 Stack Exchange -profiileissa
// @description:fi Korostaa div-elementtejä, joissa kysymysten määrä > 0 tai vastausten määrä > 0 Stack Exchange -profiileissa
// @name:he      הדגש חשבונות שבהם מספר השאלות או התשובות > 0 בפרופילי Stack Exchange
// @description:he הדגש divs עם מספר שאלות > 0 או מספר תשובות > 0 בפרופילי Stack Exchange
// @name:hr      Istakni račune s brojem pitanja ili odgovora > 0 na profilima Stack Exchange
// @description:hr Istakni divove s brojem pitanja > 0 ili brojem odgovora > 0 na profilima Stack Exchange
// @name:hu      Kiemelje azokat a fiókokat, amelyeknek kérdései vagy válaszai száma > 0 a Stack Exchange profilokon
// @description:hu Kiemeli a div-eket, ahol a kérdések száma > 0 vagy a válaszok száma > 0 a Stack Exchange profilokon
// @name:id      Sorot akun dengan jumlah pertanyaan atau jawaban > 0 di profil Stack Exchange
// @description:id Sorot div dengan jumlah pertanyaan > 0 atau jumlah jawaban > 0 di profil Stack Exchange
// @name:it      Evidenzia account con conteggio domande o risposte > 0 sui profili Stack Exchange
// @description:it Evidenzia i div con conteggio domande > 0 o conteggio risposte > 0 sui profili Stack Exchange
// @name:ja      Stack Exchangeプロフィールで質問または回答数が0を超えるアカウントを強調表示
// @description:ja Stack Exchangeプロフィールで質問数が0を超えるか回答数が0を超えるdivを強調表示します
// @name:ko      Stack Exchange 프로필에서 질문 또는 답변 수가 0보다 큰 계정 강조
// @description:ko Stack Exchange 프로필에서 질문 수가 0보다 크거나 답변 수가 0보다 큰 div를 강조 표시
// @name:nb      Uthev kontoer med antall spørsmål eller svar > 0 på Stack Exchange-profiler
// @description:nb Uthever divs med antall spørsmål > 0 eller antall svar > 0 på Stack Exchange-profiler
// @name:nl      Markeer accounts met een aantal vragen of antwoorden > 0 op Stack Exchange-profielen
// @description:nl Markeert divs met een aantal vragen > 0 of een aantal antwoorden > 0 op Stack Exchange-profielen
// @name:pl      Podświetl konta z liczbą pytań lub odpowiedzi > 0 na profilach Stack Exchange
// @description:pl Podświetla divy z liczbą pytań > 0 lub liczbą odpowiedzi > 0 na profilach Stack Exchange
// @name:pt-BR   Destaque contas com contagem de perguntas ou respostas > 0 em perfis do Stack Exchange
// @description:pt-BR Destaca divs com contagem de perguntas > 0 ou contagem de respostas > 0 em perfis do Stack Exchange
// @name:ro      Evidențiază conturile cu număr de întrebări sau răspunsuri > 0 pe profilurile Stack Exchange
// @description:ro Evidențiază div-urile cu număr de întrebări > 0 sau număr de răspunsuri > 0 pe profilurile Stack Exchange
// @name:sk      Zvýraznenie účtov s počtom otázok alebo odpovedí > 0 na profiloch Stack Exchange
// @description:sk Zvýrazňuje divy s počtom otázok > 0 alebo počtom odpovedí > 0 na profiloch Stack Exchange
// @name:sv      Markera konton med antal frågor eller svar > 0 på Stack Exchange-profiler
// @description:sv Markerar divs med antal frågor > 0 eller antal svar > 0 på Stack Exchange-profiler
// @name:th      เน้นบัญชีที่มีจำนวนคำถามหรือคำตอบ > 0 บนโปรไฟล์ Stack Exchange
// @description:th เน้น div ที่มีจำนวนคำถาม > 0 หรือจำนวนคำตอบ > 0 บนโปรไฟล์ Stack Exchange
// @name:tr      Stack Exchange profillerinde soru veya cevap sayısı > 0 olan hesapları vurgula
// @description:tr Stack Exchange profillerinde soru sayısı > 0 veya cevap sayısı > 0 olan div’leri vurgular
// @name:vi      Làm nổi bật các tài khoản có số câu hỏi hoặc câu trả lời > 0 trên hồ sơ Stack Exchange
// @description:vi Làm nổi bật các div có số câu hỏi > 0 hoặc số câu trả lời > 0 trên hồ sơ Stack Exchange
// @name:zh      在 Stack Exchange 个人资料中高亮显示提问或回答数 > 0 的账户
// @description:zh 在 Stack Exchange 个人资料中高亮显示提问数 > 0 或回答数 > 0 的 div
// @name:zh-CN   在 Stack Exchange 个人资料中高亮显示提问或回答数 > 0 的账户
// @description:zh-CN 在 Stack Exchange 个人资料中高亮显示提问数 > 0 或回答数 > 0 的 div
// @name:zh-HK   喺 Stack Exchange 個人資料中突出顯示提問或回答數 > 0 嘅帳戶
// @description:zh-HK 喺 Stack Exchange 個人資料中突出顯示提問數 > 0 或回答數 > 0 嘅 div
// @name:zh-SG   在 Stack Exchange 个人资料中高亮显示提问或回答数 > 0 的账户
// @description:zh-SG 在 Stack Exchange 个人资料中高亮显示提问数 > 0 或回答数 > 0 的 div
// @name:zh-TW   在 Stack Exchange 個人資料中高亮顯示提問或回答數 > 0 的帳戶
// @description:zh-TW 在 Stack Exchange 個人資料中高亮顯示提問數 > 0 或回答數 > 0 的 div
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @author        aspen138
// @match       https://stackexchange.com/users/*/*?tab=accounts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/488093/Highlight%20accounts%20whose%20questions%20or%20answers%20count%20%3E%200%20on%20Stack%20Exchange%20profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/488093/Highlight%20accounts%20whose%20questions%20or%20answers%20count%20%3E%200%20on%20Stack%20Exchange%20profiles.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define the highlight style
    const highlightStyle = 'background-color: yellow;'; // Change this to your preferred highlight style

    // Function to check and highlight the div for questions or answers
    function highlightIfActive() {
        // Select all the account containers
        const accountContainers = document.querySelectorAll('.account-container');

        accountContainers.forEach(container => {
            // Select the questions and answers counts based on their position
            const questions = container.querySelector('.account-stat:nth-last-child(3) .account-number');
            const answers = container.querySelector('.account-stat:nth-last-child(2) .account-number');

            // Check if the questions or answers count is greater than 0 and apply the highlight
            if ((questions && parseInt(questions.textContent, 10) > 0) ||
                (answers && parseInt(answers.textContent, 10) > 0)) {
                container.style.cssText = highlightStyle;
            }
            else{
                // container.style.cssText = highlightStyle;
            }
        });
    }

    // Run the highlight function
    highlightIfActive();
})();