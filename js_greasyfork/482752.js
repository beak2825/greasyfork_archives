// ==UserScript==
// @name         米游社 Web 端个人主页显示用户所有游戏频道等级经验 (Miyoushe Web Profile Enhanced)
// @name:ar          عرض مستوى وخبرة المستخدم في جميع قنوات ألعاب Miyoushe على صفحة الويب الشخصية
// @name:cs          Zobrazuje úroveň a zkušenosti uživatele ve všech herních kanálech na webu Miyoushe.
// @name:da          Viser brugerens niveau og erfaring i alle spilkanaler på Miyoushe Web.
// @name:de          Zeigt das Level und die Erfahrung des Benutzers in allen Spielekanälen auf Miyoushe Web an.
// @name:en          Miyoushe Web Profile Enhanced: Displays level/XP for all game channels.
// @name:eo          Miyoushe Web Persona Paĝo: Montras nivelon/XP por ĉiuj ludkanaloj.
// @name:es          Miyoushe Web: Muestra el nivel y la experiencia en todos los canales de juego.
// @name:fi          Miyoushe Web -profiilin parannus: Näyttää tason/XP:n kaikille pelikanaville.
// @name:fr          Miyoushe Web : Affiche le niveau et l'XP pour tous les canaux de jeu.
// @name:fr-CA       Miyoushe Web : Affiche le niveau et l'XP pour tous les canaux de jeu (Canada).
// @name:he          שיפור פרופיל Miyoushe Web: מציג רמה/ניסיון עבור כל ערוצי המשחק.
// @name:hr          Miyoushe Web Profil poboljšan: Prikazuje razinu/XP za sve kanale igara.
// @name:hu          Miyoushe Web profiljavítás: Szinteket és XP-t jelenít meg minden játékcsatornához.
// @name:id          Peningkatan Profil Web Miyoushe: Menampilkan level/XP untuk semua saluran game.
// @name:it          Miglioramento del profilo Web Miyoushe: visualizza livello/XP per tutti i canali di gioco.
// @name:ja          Miyoushe Web プロファイル拡張: すべてのゲームチャンネルのレベル/XP を表示します。
// @name:ka          Miyoushe Web პროფილის გაუმჯობესება: აჩვენებს დონეს/XP-ს ყველა სათამაშო არხისთვის.
// @name:ko          미요우셰 웹 프로필 개선: 모든 게임 채널의 레벨/XP를 표시합니다.
// @name:nb          Miyoushe Web profilforbedring: Viser nivå/XP for alle spillkanaler.
// @name:nl          Miyoushe Web profielverbetering: Toont niveau/XP voor alle gamekanalen.
// @name:pl          Ulepszenie profilu Miyoushe Web: wyświetla poziom/XP dla wszystkich kanałów gier.
// @name:pt-BR       Melhoria de Perfil da Web Miyoushe: Exibe nível/XP para todos os canais de jogos.
// @name:ro          Îmbunătățire profil Web Miyoushe: Afișează nivelul/XP pentru toate canalele de joc.
// @name:sk          Vylepšenie profilu Miyoushe Web: Zobrazuje úroveň/XP pre všetky herné kanály.
// @name:sr          Miyoushe Web poboljšanje profila: Prikazuje nivo/XP za sve kanale igara.
// @name:sv          Miyoushe Web profilförbättring: Visar nivå/XP för alla spelkanaler.
// @name:th          Miyoushe Web Profile Enhancement: แสดงระดับ/XP สำหรับทุกช่องเกม
// @name:tr          Miyoushe Web Profil Geliştirme: Tüm oyun kanalları için seviye/XP'yi gösterir.
// @name:vi          Cải thiện Hồ sơ Web Miyoushe: Hiển thị cấp độ/XP cho tất cả các kênh trò chơi.
// @name:zh          米游社 Web 端个人主页增强：显示所有游戏频道等级和经验值
// @name:zh-CN       米游社 Web 端个人主页增强：显示所有游戏频道等级和经验值
// @name:zh-HK       米游社 Web 端個人主頁增強：顯示所有遊戲頻道等級和經驗值
// @name:zh-SG       米游社 Web 端个人主页增强：显示所有游戏频道等级和经验值
// @name:zh-TW       米游社 Web 端個人主頁增強：顯示所有遊戲頻道等級和經驗值
// @description  米游社Web端个人主页显示该用户在所有游戏频道的等级和经验值。
// @description:ar   يعرض هذا السكريبت مستوى وخبرة المستخدم في جميع قنوات ألعاب Miyoushe على صفحة الويب الشخصية.
// @description:bg   Този скрипт показва нивото и опита на потребителя във всички канали на игри на Miyoushe Web.
// @description:cs   Tento skript zobrazuje úroveň a zkušenosti uživatele ve všech herních kanálech na webu Miyoushe.
// @description:da   Dette script viser brugerens niveau og erfaring i alle spilkanaler på Miyoushe Web.
// @description:de   Dieses Skript zeigt das Level und die Erfahrung des Benutzers in allen Spielekanälen auf Miyoushe Web an.
// @description:el   Αυτό το σενάριο εμφανίζει το επίπεδο και την εμπειρία του χρήστη σε όλα τα κανάλια παιχνιδιών στο Miyoushe Web.
// @description:en    Displays the user's level and experience points for all game channels on the Miyoushe web profile page.
// @description:eo   Ĉi tiu skripto montras la nivelon kaj spertpunktojn de la uzanto por ĉiuj ludkanaloj sur la Miyoushe reteja profilo.
// @description:es   Este script muestra el nivel y los puntos de experiencia del usuario para todos los canales de juego en la página de perfil web de Miyoushe.
// @description:fi   Tämä skripti näyttää käyttäjän tason ja kokemuspisteet kaikille pelikanaville Miyoushen verkkoprofiilisivulla.
// @description:fr   Ce script affiche le niveau et les points d'expérience de l'utilisateur pour tous les canaux de jeu sur la page de profil web de Miyoushe.
// @description:fr-CA   Ce script affiche le niveau et les points d'expérience de l'utilisateur pour tous les canaux de jeu sur la page de profil web de Miyoushe (Canada).
// @description:he   סקריפט זה מציג את הרמה ונקודות הניסיון של המשתמש עבור כל ערוצי המשחק בדף פרופיל האינטרנט של Miyoushe.
// @description:hr   Ova skripta prikazuje razinu i bodove iskustva korisnika za sve kanale igara na web stranici profila Miyoushe.
// @description:hu   Ez a szkript megjeleníti a felhasználó szintjét és tapasztalati pontjait az összes játékcsatornához a Miyoushe webes profiloldalán.
// @description:id   Skrip ini menampilkan level dan poin pengalaman pengguna untuk semua saluran game di halaman profil web Miyoushe.
// @description:it   Questo script visualizza il livello e i punti esperienza dell'utente per tutti i canali di gioco nella pagina del profilo web di Miyoushe.
// @description:ja   このスクリプトは、Miyoushe Web プロファイルページ上のすべてのゲームチャンネルのユーザーのレベルと経験値を表示します。
// @description:ka   ეს სკრიპტი აჩვენებს მომხმარებლის დონესა და გამოცდილების ქულებს Miyoushe-ის ვებ პროფილის გვერდზე ყველა თამაშის არხისთვის.
// @description:ko   이 스크립트는 미요우셰 웹 프로필 페이지의 모든 게임 채널에 대한 사용자의 레벨과 경험치 포인트를 표시합니다.
// @description:nb   Dette skriptet viser brukerens nivå og erfaringspoeng for alle spillkanaler på Miyoushe webprofilside.
// @description:nl   Dit script toont het niveau en de ervaringspunten van de gebruiker voor alle gamekanalen op de Miyoushe webprofielpagina.
// @description:pl   Ten skrypt wyświetla poziom użytkownika i punkty doświadczenia dla wszystkich kanałów gier na stronie profilu internetowego Miyoushe.
// @description:pt-BR   Este script exibe o nível e os pontos de experiência do usuário para todos os canais de jogos na página de perfil da web Miyoushe.
// @description:ro   Acest script afișează nivelul utilizatorului și punctele de experiență pentru toate canalele de joc de pe pagina de profil web Miyoushe.
// @description:ru   Этот скрипт отображает уровень и очки опыта пользователя для всех игровых каналов на странице веб-профиля Miyoushe.
// @description:sk   Tento skript zobrazuje úroveň a body skúseností používateľa pre všetky herné kanály na stránke webového profilu Miyoushe.
// @description:sr   Ova skripta prikazuje nivo i poene iskustva korisnika za sve kanale igara na veb stranici profila Miyoushe.
// @description:sv   Detta skript visar användarens nivå och erfarenhetspoäng för alla spelkanaler på Miyoushe webbprofilsida.
// @description:th   สคริปต์นี้แสดงระดับและคะแนนประสบการณ์ของผู้ใช้สำหรับช่องเกมทั้งหมดในหน้าโปรไฟล์เว็บ Miyoushe
// @description:tr   Bu komut dosyası, Miyoushe web profil sayfasındaki tüm oyun kanalları için kullanıcının seviyesini ve deneyim puanlarını görüntüler.
// @description:ug   بۇ قوليازمىدا ئىشلەتكۈچىنىڭ Miyoushe تور بېتىدىكى شەخسىي ئۇچۇر بېتىدە بارلىق ئويۇن قاناللىرىنىڭ دەرىجىسى ۋە تەجرىبىسى كۆرسىتىلىدۇ.
// @description:uk   Цей скрипт відображає рівень і очки досвіду користувача для всіх ігрових каналів на сторінці веб-профілю Miyoushe.
// @description:vi   Tập lệnh này hiển thị cấp độ và điểm kinh nghiệm của người dùng cho tất cả các kênh trò chơi trên trang hồ sơ web Miyoushe.
// @description:zh          在米游社 Web 端个人主页显示该用户在所有游戏频道的等级和经验值。
// @description:zh-CN       在米游社 Web 端个人主页显示该用户在所有游戏频道的等级和经验值。
// @description:zh-HK       在米游社 Web 端個人主頁顯示該用戶在所有遊戲頻道的等級和經驗值。
// @description:zh-SG       在米游社 Web 端个人主页显示该用户在所有游戏频道的等级和经验值。
// @description:zh-TW       在米游社 Web 端個人主頁顯示該用戶在所有遊戲頻道的等級和經驗值。
// @namespace    http://tampermonkey.net/
// @version      0.3.7.3
// @author       aspen138
// @license      MIT
// @match        https://www.miyoushe.com/*/accountCenter/*
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAD/2FkI/9hZSv/YV5P/3W+19cOaxvzv6NX////g///+6v///vL///74///+/P/////////+///+6v///Yn//vkT/9hZfP/YWe7/2Ff//tx7//XFpv/++vj////////////////////////////////////////////////6///9kP/YWej/2Fn//9lY//zXiP/2zrf///////zw6f/649b////////////////////////////////////////+/e3/2Fn9/9hZ///ZWv/6043/99PB///////2zLT/99C5/////////////////////////////////////v/42Mb+/9hZ///YWf//2Fj//NiJ//XIrv///f3//fPt//759v////////////328f/52sn///79///////76d7/87yY///YWf3/2Fn//9lb//7ikf/3zbD/+NfE///9/P/////////////////53c3/9MOn///////++/r/9cOl//vXkf3/2Fn7/9hX//7cdP/1w5z/9cWm//XIrf/2zLX//PDq/////v///////vn2//749f//////+d3P//fGkf//3Wn6/9hZ9//YWP/82IP/9suu//vWo//1w6H/+daq//XCmf/2y7P/+uHT//zv6P/99fH/++zk//TBoP/92n7//9hX9f/YWfL/2Vn/+9OK//jSt///7Lz/9cWk//3bfv//3G//+9iZ//XEp//0wqb/9cen//bEmv/7147//9pe///YWe//2Fnr/9pb//nPiv/52sf//vLa//XFof/+23L//9lX//vVjv/1wqH/9cKY//jSrv//4H///9lb///YWP//2Fnn/9hZ4//aW//5zon/+dzN//739P/2xZz//9tr///aX//4y5T/+t7C//7nuP/1xKP//tt4///YV///2Fn//9hZ3f/YWdb/2Fj//NaB//XIrf/76eH/9sSZ///baP//22P/98iX//zkyv/+7Mb/9sen//7cdf//2Ff//9hZ///YWdD/2Fm4/9hY///aY//60oz/9L2Z//fIlP//22P//9tk//fImP/87eP//vfv//bHo///3HH//9hX///YWf//2Fm+/9hZaf/YWff/2Fj//9pe//7bdf/+23D//9hZ///bYf/3ypb/++ng//759v/1xqH//9xx///YV///2Fn//9hZof/YWQz/2Fl5/9hZ1v/YWfH/2Ff8/9hY///YWf//2Vr/+9WM//XIr//76N7/9cOd///ccv//2Ff//9hZ8//YWVv/2FkA/9hZAv/YWRz/2FlD/9hZav/YWY3/2Fmr/9hYxf/ca9n50prp9L+f9ffJnf3/3Gn9/9hY5f/YWXz/2FkKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAA==
// @grant       GM_addStyle
// @require https://update.greasyfork.org/scripts/483208/1302155/ajaxHooker_myaijarvis.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/482752/%E7%B1%B3%E6%B8%B8%E7%A4%BE%20Web%20%E7%AB%AF%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7%E6%89%80%E6%9C%89%E6%B8%B8%E6%88%8F%E9%A2%91%E9%81%93%E7%AD%89%E7%BA%A7%E7%BB%8F%E9%AA%8C%20%28Miyoushe%20Web%20Profile%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482752/%E7%B1%B3%E6%B8%B8%E7%A4%BE%20Web%20%E7%AB%AF%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7%E6%89%80%E6%9C%89%E6%B8%B8%E6%88%8F%E9%A2%91%E9%81%93%E7%AD%89%E7%BA%A7%E7%BB%8F%E9%AA%8C%20%28Miyoushe%20Web%20Profile%20Enhanced%29.meta.js
// ==/UserScript==






var formattedString = "place_holder";

function insertOrUpdateFormattedString() {
    // Use an ID or a class to identify the element
    var existingElement = document.getElementById('formattedStringElement');

    if (existingElement) {
        // If the element already exists, update its content
        existingElement.innerHTML = "\r\n<br>" + formattedString;
    } else {
        // Otherwise, create and insert the element as before
        var formattedStringElement = document.createElement('div');
        formattedStringElement.id = 'formattedStringElement'; // Assign an ID to the new element
        formattedStringElement.innerHTML = "\r\n<br>" + formattedString;
        var introDivs = document.querySelectorAll('.mhy-account-center-user__intro');

        if (introDivs && introDivs.length > 1) {
            var targetDiv = introDivs[1];
            targetDiv.parentNode.insertBefore(formattedStringElement, targetDiv.nextSibling);
        }
    }
}

(function() {
    'use strict';

    // Assuming ajaxHooker is already defined elsewhere in your script
    ajaxHooker.hook(request => {
        if (request.url.includes("https://bbs-api.miyoushe.com/user/wapi/getUserFullInfo")) {
            request.response = res => {
                var json = JSON.parse(res.responseText);
                var gameLevelExpList = json.data.user_info.level_exps;
                var gameNames = {
                    1: "崩坏3",
                    2: "原神",
                    3: "崩坏学园2",
                    4: "未定事件簿",
                    5: "大别野",
                    6: "崩坏：星穹铁道",
                    8: "绝区零",
                    9: "崩坏：因缘精灵",
                    10: "星布谷地"
                };

                formattedString = gameLevelExpList.map(function(item) {
                    var gameName = gameNames[item.game_id] || "未知游戏";
                    return `${gameName}频道等级为${item.level}，经验为${item.exp}<br>`;
                }).join("") + "";

                // Call the function to either insert or update the string in the page
                insertOrUpdateFormattedString();
            }
        }
    });
})();
