// ==UserScript==
// @name         Telegram Web Sort by reactions
// @name:ru      Telegram Web Сортировка по реакциям
// @name:zh-CN   Telegram Web 按回应排序
// @name:zh-TW   Telegram Web 按反應排序
// @name:ar      Telegram Web ترتيب حسب التفاعلات
// @name:bg      Telegram Web Сортиране по реакции
// @name:cs      Telegram Web Třídit podle reakcí
// @name:da      Telegram Web Sorter efter reaktioner
// @name:de      Telegram Web Nach Reaktionen sortieren
// @name:el      Telegram Web Ταξινόμηση αντιδράσεων
// @name:eo      Telegram Web Ordigi laŭ reagoj
// @name:es      Telegram Web Ordenar por reacciones
// @name:es-419  Telegram Web Ordenar por reacciones
// @name:fi      Telegram Web Lajittele reaktoiden mukaan
// @name:fr      Telegram Web Trier par réactions
// @name:fr-CA   Telegram Web Trier par réactions
// @name:he      Telegram Web מיון לפי תגובות
// @name:hr      Telegram Web Sortiraj po reakcijama
// @name:hu      Telegram Web Rendezés reakciók szerint
// @name:id      Telegram Web Urutkan berdasarkan reaksi
// @name:it      Telegram Web Ordina per reazioni
// @name:ja      Telegram Web リアクションでソート
// @name:ka      Telegram Web რეაქციების მიხედვით დალაგება
// @name:ko      Telegram Web 반응순 정렬
// @name:nb      Telegram Web Sorter etter reaksjoner
// @name:nl      Telegram Web Sorteren op reacties
// @name:pl      Telegram Web Sortuj według reakcji
// @name:pt-BR   Telegram Web Ordenar por reações
// @name:ro      Telegram Web Sortează după reacții
// @name:sv      Telegram Web Sortera efter reaktioner
// @name:th      Telegram Web เรียงตามปฏิกิริยา
// @name:tr      Telegram Web Tepkilere göre sırala
// @name:uk      Telegram Web Сортування за реакціями
// @name:ug      Telegram Web ئىنكاسلار بويىچە تەرتىپلەش
// @name:vi      Telegram Web Sắp xếp theo lượt tương tác
// @version      0.1.6
// @description  Helps you find messages (posts) with the most reactions (likes) in Telegram
// @description:ru Помогает найти сообщения (посты) с наибольшим количеством реакций (лайков) в Телеграм
// @description:zh-CN  帮助您查找Telegram中回应（点赞）最多的消息（帖子）
// @description:zh-TW  協助您查找Telegram中反應（按讚）最多的訊息（貼文）
// @description:ar      يساعدك في العثور على الرسائل (المشاركات) ذات أكبر عدد من التفاعلات (الإعجابات) في Telegram
// @description:bg      Помага ви да намерите съобщения (публикации) с най-много реакции (харесвания) в Telegram
// @description:cs      Pomáhá vám najít zprávy (příspěvky) s největším počtem reakcí (lajků) v Telegramu
// @description:da      Hjælper dig med at finde beskeder (opslag) med flest reaktioner (synes godt om) i Telegram
// @description:de      Hilft Ihnen dabei, Nachrichten (Beiträge) mit den meisten Reaktionen (Likes) in Telegram zu finden
// @description:el      Σας βοηθά να βρείτε μηνύματα (δημοσιεύσεις) με τις περισσότερες αντιδράσεις (λαϊκ) στο Telegram
// @description:eo      Helpas al vi trovi mesaĝojn (afiŝojn) kun la plej multaj reagoj (ŝatoj) en Telegram
// @description:es      Le ayuda a encontrar mensajes (publicaciones) con más reacciones (me gusta) en Telegram
// @description:es-419  Le ayuda a encontrar mensajes (publicaciones) con más reacciones (me gusta) en Telegram
// @description:fi      Auttaa sinua löytämään viestejä (julkaisuja), joilla on eniten reaktioita (tykkäyksiä) Telegramissa
// @description:fr      Vous aide à trouver les messages (publications) avec le plus de réactions (j'aime) dans Telegram
// @description:fr-CA   Vous aide à trouver les messages (publications) avec le plus de réactions (j'aime) dans Telegram
// @description:he      עוזר לך למצוא הודעות (פוסטים) עם הכי הרבה תגובות (לייקים) ב-Telegram
// @description:hr      Pomaže vam pronaći poruke (objave) s najviše reakcija (sviđanja) u Telegramu
// @description:hu      Segít megtalálni a legtöbb reakciót (lájkot) kapott üzeneteket (bejegyzéseket) a Telegramban
// @description:id      Membantu Anda menemukan pesan (postingan) dengan reaksi (suka) terbanyak di Telegram
// @description:it      Ti aiuta a trovare i messaggi (post) con più reazioni (mi piace) in Telegram
// @description:ja      Telegramで最も反応（いいね）の多いメッセージ（投稿）を見つけるのに役立ちます
// @description:ka      დაგეხმარებათ იპოვოთ ყველაზე მეტი რეაქციის (მოწონებების) მქონე შეტყობინებები (პოსტები) Telegram-ში
// @description:ko      Telegram에서 가장 많은 반응(좋아요)을 받은 메시지(게시물)를 찾는 데 도움을 줍니다
// @description:nb      Hjelper deg med å finne meldinger (innlegg) med flest reaksjoner (likerklikk) i Telegram
// @description:nl      Helpt u bij het vinden van berichten (posts) met de meeste reacties (likes) in Telegram
// @description:pl      Pomaga znaleźć wiadomości (posty) z największą liczbą reakcji (polubień) w Telegramie
// @description:pt-BR   Ajuda você a encontrar mensagens (posts) com mais reações (curtidas) no Telegram
// @description:ro      Vă ajută să găsiți mesajele (postările) cu cele mai multe reacții (aprecieri) în Telegram
// @description:sv      Hjälper dig att hitta meddelanden (inlägg) med flest reaktioner (gilla-markeringar) i Telegram
// @description:th      ช่วยคุณค้นหาข้อความ (โพสต์) ที่มีปฏิกิริยา (ถูกใจ) มากที่สุดใน Telegram
// @description:tr      Telegram'da en fazla tepki (beğeni) alan mesajları (gönderileri) bulmanıza yardımcı olur
// @description:uk      Допомагає вам знаходити повідомлення (пости) з найбільшою кількістю реакцій (лайків) у Telegram
// @description:ug      Telegram'دا ئەڭ كۆپ رېئاكسىيە (لايك) بار خەت (پوست) لارنى تېپىشقا ياردەم قىلىدۇ
// @description:vi      Giúp bạn tìm các tin nhắn (bài đăng) có nhiều tương tác (thích) nhất trong Telegram
// @author       sokollondon
// @match        https://web.telegram.org/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js
// @grant        none
// @namespace    https://github.com/sokollondon/tg-sort
// @downloadURL https://update.greasyfork.org/scripts/455750/Telegram%20Web%20Sort%20by%20reactions.user.js
// @updateURL https://update.greasyfork.org/scripts/455750/Telegram%20Web%20Sort%20by%20reactions.meta.js
// ==/UserScript==

(function() {
    let style = `
#sBtn{position:fixed;top:73px;right:16px;width:45px;height:45px;padding:5px;border-radius:10px;text-align:center;font-size:20px;padding-top:5px;z-index:2;opacity: .7;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAtGVYSWZJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAEwIDAAEAAAABAAAAaYcEAAEAAABmAAAAAAAAAEgAAAABAAAASAAAAAEAAAAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAAQAAAAAOgBAABAAAAQAAAAAAAAABuEYT5AAABkklEQVR4nO2bPU7EMBBGX74OcQIKjgFnYMVPh1YcZ7kMFQeh4g4sghtQYhSJaoWCHduJZ8dPcud8sZ3VTPZJgU6n05nmGngHwsHYA5uCeaXyi7OfWORb4bwS+UkMEXNCgYyUvNz8JIRzhHOEc7TCPccOkFIwVyf8M1LZRHaCsQNccYRdoCmEc4RzhHOEc4RzhHOEc7TCPWN9QDO+IBR+E0zxAdV9wWDAB1DzTVQ4RzhHOEeN+4AmfEFYyQcs4guGiDndBxwzwjnCOcI5wjnCOcI5MuwDFvMFoWEfkO0LhsgDyM1IySvN5PqEc4RzhHNk3Acs4gtCoz6gmC+4Az4qLGDMvMUAHxWfwpI/99k1YKiYb8IW3QPfFZ7+mLnFCLsKB/CIIQbgqeDmny2+Y5wALwU2/wqcYpSzzB79CZxjnAvga8bmx2suG/IBWb5gm9gZxrkPDfqALF+wq1TxQ2MjuzOkVnwzBxDTGeZUfFMHMNUZ5lZ8cwfwV2eIrfimi+AhN78X7DP/5i7lA5r4HqHT6dA0P32R2X1NXS7nAAAAAElFTkSuQmCC") no-repeat center center;
background-size:32px;background-color:#fff;cursor:pointer;}
.theme-dark #sBtn{background-color: #a9a9a9;}
@media screen and (max-width: 600px) {
    #sBtn{top: 111px;right: 8px;}
}
    `;
    let $body = $('body');
    $body.prepend('<style>'+style+'</style>');

    //Btn
    $body.prepend("<div id='sBtn' title='Sort by number of likes'></div>");

    $('#sBtn').click(function() {
        $('.message-date-group').each(function() {//add date to msg
            let date = $(this).find('.sticky-date').text();
            $(this).find('.message-list-item').each(function() {
                $(this).find('.message-time').prepend(date+' ');
            });
        });
        $('.message-list-item').detach().sort(function(a, b) {
            let aQty, bQty;
            aQty = $(a).find('.Reactions .Button').get().reduce((sum, button) => {
                return sum + $(button).text2qty();
            }, 0);
            bQty = $(b).find('.Reactions .Button').get().reduce((sum, button) => {
                return sum + $(button).text2qty();
            }, 0);
            return aQty - bQty;
        }).appendTo($('.messages-container'));
        $('.MessageList').scrollTo($('.message-list-item:last .Reactions'),{axis:'y'});
    });

    $.fn.text2qty = function () {
        let t = $(this).text(),
            qty = toFloat(t),
            ava = $(this).find('.Avatar');
        if(ava.length){
            qty = ava.length;
        }else if(t.match("K$")){
            qty = qty*1000;
        }else if(t.match("M$")){
            qty = qty*1000000;
        }
        //console.info(qty);
        return qty;
    }

    function toFloat(str) {
        return parseFloat(str.replace(/[^0-9.,]/g,'').replace(/[,]/g,'.'));
    }
})();