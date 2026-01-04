// ==UserScript==
// @name         Append Rank by WatchNumber/LikeNumber in the Suno.ai Single Page
// @name:ar          إضافة ترتيب حسب عدد المشاهدات/الإعجابات في صفحة Suno.ai المفردة
// @name:bg          Добавяне на ранг по брой гледания/харесвания в единичната страница на Suno.ai
// @name:cs          Přidat hodnocení podle počtu zhlédnutí/lajků na jedné stránce Suno.ai
// @name:da          Tilføj rangering efter antal visninger/likes på Suno.ai enkeltside
// @name:de          Rangfolge nach Anzahl der Aufrufe/Likes auf der Suno.ai-Einzelansicht hinzufügen
// @name:el          Προσθήκη κατάταξης βάσει αριθμού προβολών/Μου αρέσει σε μεμονωμένη σελίδα Suno.ai
// @name:en          Append Rank by WatchNumber/LikeNumber in the Suno.ai Single Page
// @name:eo          Aldoni Rangon laŭ Vidoj/Ŝatoj en la Unuopa Paĝo de Suno.ai
// @name:es          Añadir rango por número de vistas/Me gusta en la página individual de Suno.ai
// @name:fi          Lisää sijoitus katselukertojen/tykkäysten mukaan Suno.ai:n yhdellä sivulla
// @name:fr          Ajouter un rang par nombre de vues/J'aime dans la page unique Suno.ai
// @name:fr-CA       Ajouter un rang par nombre de vues/J'aime dans la page unique Suno.ai (Canada)
// @name:he          הוסף דירוג לפי מספר צפיות/לייקים בדף יחיד של Suno.ai
// @name:hr          Dodaj rang prema broju pregleda/lajkova na jednoj stranici Suno.ai
// @name:hu          Rangsor hozzáadása a megtekintések/lájkok száma alapján a Suno.ai egyoldalas nézetben
// @name:id          Tambahkan Peringkat berdasarkan Jumlah Tontonan/Suka di Halaman Tunggal Suno.ai
// @name:it          Aggiungi ranking per numero di visualizzazioni/Mi piace nella pagina singola di Suno.ai
// @name:ja          Suno.aiのシングルページに視聴数/いいね数でランクを追加
// @name:ka          დაამატეთ რანგი ნახვების/ლაიქების რაოდენობის მიხედვით Suno.ai-ის ერთ გვერდზე
// @name:ko          Suno.ai 단일 페이지에서 조회수/좋아요 수로 순위 추가
// @name:nb          Legg til rangering etter antall visninger/liker på Suno.ai-siden
// @name:nl          Rang toevoegen op basis van aantal views/likes op de Suno.ai-pagina
// @name:pl          Dodaj ranking według liczby wyświetleń/polubień na pojedynczej stronie Suno.ai
// @name:pt-BR       Adicionar classificação por número de visualizações/curtidas na página única do Suno.ai
// @name:ro          Adaugă rangul după numărul de vizualizări/aprecieri în pagina unică Suno.ai
// @name:ru          Добавить рейтинг по количеству просмотров/лайков на отдельной странице Suno.ai
// @name:sk          Pridať poradie podľa počtu zhliadnutí/páči sa mi na jednej stránke Suno.ai
// @name:sr          Dodaj rang po broju pregleda/lajkova na jednoj stranici Suno.ai
// @name:sv          Lägg till rangordning efter antal visningar/gillningar på Suno.ai:s enskilda sida
// @name:th          เพิ่มอันดับตามจำนวนการดู/จำนวนถูกใจในหน้าเดียวของ Suno.ai
// @name:tr          Suno.ai Tek Sayfasında İzlenme/Beğeni Sayısına Göre Sıra Ekle
// @name:ug          Suno.ai بىر بەتتە كۆرۈش سانى / ياقتۇرۇش سانى بويىچە رەت قوشۇڭ
// @name:uk          Додати рейтинг за кількістю переглядів/вподобайок на окремій сторінці Suno.ai
// @name:vi          Thêm thứ hạng theo số lượt xem/thích trong Trang đơn của Suno.ai
// @name:zh          在 Suno.ai 单页中按观看次数/点赞数添加排名
// @name:zh-CN       在 Suno.ai 单页中按观看次数/点赞数添加排名
// @name:zh-HK       在 Suno.ai 單頁中按觀看次數/讚好數新增排名
// @name:zh-SG       在 Suno.ai 单页中按观看次数/点赞数添加排名
// @name:zh-TW       在 Suno.ai 單頁中按觀看次數/讚好數新增排名
// @description  Find similar elements and append their rank by watch number in descending order.
// @description:ar   ابحث عن عناصر مماثلة وألحق ترتيبها حسب عدد المشاهدات بترتيب تنازلي.
// @description:bg   Намерете подобни елементи и добавете техния ранг според броя гледания в низходящ ред.
// @description:cs   Najděte podobné prvky a připojte jejich hodnocení podle počtu zhlédnutí v sestupném pořadí.
// @description:da   Find lignende elementer og tilføj deres rangering efter antal visninger i faldende rækkefølge.
// @description:de   Ähnliche Elemente finden und ihre Rangfolge nach Anzahl der Aufrufe in absteigender Reihenfolge hinzufügen.
// @description:el   Βρείτε παρόμοια στοιχεία και προσθέστε την κατάταξή τους κατά αριθμό προβολών σε φθίνουσα σειρά.
// @description:eo   Trovu similajn elementojn kaj aldonu ilian rangon laŭ nombro de vidoj en malkreskanta ordo.
// @description:es   Encuentra elementos similares y añade su rango por número de vistas en orden descendente.
// @description:fi   Etsi samankaltaisia elementtejä ja lisää niiden sijoitus katselukertojen mukaan laskevassa järjestyksessä.
// @description:fr   Trouver des éléments similaires et ajouter leur rang par nombre de vues par ordre décroissant.
// @description:fr-CA   Trouver des éléments similaires et ajouter leur rang par nombre de vues par ordre décroissant (Canada).
// @description:he   מצא רכיבים דומים והוסף את הדירוג שלהם לפי מספר צפיות בסדר יורד.
// @description:hr   Pronađite slične elemente i dodajte njihov rang prema broju pregleda u silaznom redoslijedu.
// @description:hu   Hasonló elemek keresése és a rangsorolásuk hozzáadása a megtekintések száma alapján csökkenő sorrendben.
// @description:id   Temukan elemen serupa dan tambahkan peringkatnya berdasarkan jumlah tontonan dalam urutan menurun.
// @description:it   Trova elementi simili e aggiungi il loro ranking per numero di visualizzazioni in ordine decrescente.
// @description:ja   類似の要素を見つけて、視聴数で降順にランクを追加します。
// @description:ka   იპოვეთ მსგავსი ელემენტები და დაამატეთ მათი რანგი ნახვების რაოდენობის მიხედვით კლებადობის მიხედვით.
// @description:ko   유사한 요소를 찾고 조회수 기준으로 내림차순으로 순위를 추가합니다.
// @description:nb   Finn lignende elementer og legg til rangeringen deres etter antall visninger i synkende rekkefølge.
// @description:nl   Vind vergelijkbare elementen en voeg hun rang toe op basis van het aantal weergaven in aflopende volgorde.
// @description:pl   Znajdź podobne elementy i dodaj ich ranking według liczby wyświetleń w kolejności malejącej.
// @description:pt-BR   Encontre elementos semelhantes e adicione sua classificação pelo número de visualizações em ordem decrescente.
// @description:ro   Găsește elemente similare și adaugă rangul lor după numărul de vizualizări în ordine descrescătoare.
// @description:ru   Найдите похожие элементы и добавьте их рейтинг по количеству просмотров в порядке убывания.
// @description:sk   Nájdite podobné prvky a pripojte ich poradie podľa počtu zhliadnutí v zostupnom poradí.
// @description:sr   Pronađite slične elemente i dodajte njihov rang po broju pregleda u opadajućem redosledu.
// @description:sv   Hitta liknande element och lägg till deras rangordning efter antal visningar i fallande ordning.
// @description:th   ค้นหาองค์ประกอบที่คล้ายกันและเพิ่มอันดับตามจำนวนการดูในลำดับจากมากไปน้อย
// @description:tr   Benzer öğeleri bulun ve azalan düzende izlenme sayısına göre sıralarını ekleyin.
// @description:ug   ئوخشاش ئېلېمېنتلارنى تېپىپ ، تۆۋەنلەش تەرتىپىدە كۆرۈش سانى بويىچە دەرىجىسىنى قوشۇڭ.
// @description:uk   Знайдіть подібні елементи та додайте їх рейтинг за кількістю переглядів у порядку спадання.
// @description:vi   Tìm các phần tử tương tự và thêm thứ hạng của chúng theo số lượt xem theo thứ tự giảm dần.
// @description:zh          查找相似元素并按观看次数降序排列添加排名。
// @description:zh-CN       查找相似元素并按观看次数降序排列添加排名。
// @description:zh-HK       尋找相似元素並按觀看次數降序排列新增排名。
// @description:zh-SG       查找相似元素并按观看次数降序排列添加排名。
// @description:zh-TW       尋找相似元素並按觀看次數降序排列新增排名。
// @namespace    http://tampermonkey.net/
// @version      1.0.2.1
// @author       aspen138
// @match        *://app.suno.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suno.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490642/Append%20Rank%20by%20WatchNumberLikeNumber%20in%20the%20Sunoai%20Single%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/490642/Append%20Rank%20by%20WatchNumberLikeNumber%20in%20the%20Sunoai%20Single%20Page.meta.js
// ==/UserScript==





(function() {
    'use strict';

    // Function to append rankings based on text content numbers
    function appendRankings(selector) {
        window.addEventListener('load', function() {
            // Find elements matching the selector and convert NodeList to Array
            const elements = Array.from(document.querySelectorAll(selector));

            console.log("elements=", elements);

            // Filter, sort, and append rank in a combined step
            elements
                .filter(el => el.querySelector('p')) // Filter elements containing a <p> tag
                .sort((a, b) => { // Sort elements by the number inside <p> in descending order
                    const aNumber = parseInt(a.querySelector('p').textContent, 10);
                    const bNumber = parseInt(b.querySelector('p').textContent, 10);
                    return bNumber - aNumber;
                })
                .forEach((element, index) => { // Append a rank span to each element
                    const rankDisplay = document.createElement('span');
                    rankDisplay.style.marginLeft = '10px';
                    rankDisplay.textContent = `Rank${index + 1}'`;
                    rankDisplay.className="chakra-text css-19h91tu";
                    element.appendChild(rankDisplay);
                });

            console.log("sortedElements", elements); // Debugging
        });
    }

    // Call the function for both selectors
    appendRankings('button[data-theme="dark"][aria-label="Play Count"].css-1v0yma7');
    appendRankings('button[data-theme="dark"][aria-label="like-button"]');
})();


