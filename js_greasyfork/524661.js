 // ==UserScript==
// @name        Dark Margonem Forum
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Motyw Margonem Dark Site by Mateoo
// @author       Mateoo
// @icon
// @match        https://www.margonem.pl/
// @match        https://forum.margonem.pl/*
// @match        https://www.margonem.pl/art/*
// @match        https://www.margonem.pl/ladder/*
// @match        https://www.margonem.pl/prof
// @match        https://www.margonem.pl/stats
// @match        https://www.margonem.pl/ladder
// @match        https://www.margonem.pl/profile/*
// @match        https://www.margonem.pl/config*
// @match        https://www.margonem.pl/payments
// @match        https://www.margonem.pl/guilds/view,*
// @icon
// @downloadURL https://update.greasyfork.org/scripts/524661/Dark%20Margonem%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/524661/Dark%20Margonem%20Forum.meta.js
// ==/UserScript==
(function() {
  'use strict';
// Lista wzorców styli dla elementów <td>
const backgrounds = [
  "img/paper_01.png",
  "img/paper_02.png",
  "img/paper_03.png",
  "img/paper_06.png",
  "img/paper_04.png",
  "img/paper_07.png",
  "img/paper_08.png",
  "img/paper_09.png"
];

// Iteracja przez wszystkie elementy <td>
document.querySelectorAll('td').forEach(td => {
  // Pobranie wartości stylu background
  const backgroundStyle = td.style.background || td.style.backgroundImage;

  // Sprawdzenie, czy styl zawiera któryś z podanych obrazków
  if (backgrounds.some(img => backgroundStyle.includes(img))) {
    td.style.background = "none"; // Zmiana tła na czarne
  }
});
  // Lista obrazków do identyfikacji elementów
const forumBackgrounds = [
  "/img/forum-wood_01.png",
  "/img/forum-wood_02.png",
  "/img/forum-wood_03.png"
];

// Dodanie filtru grayscale do <th> i <tr>
document.querySelectorAll('th, tr').forEach(element => {
  const backgroundStyle = element.style.background || element.style.backgroundImage;

  // Sprawdzenie, czy styl zawiera któryś z podanych obrazków
  if (forumBackgrounds.some(img => backgroundStyle.includes(img))) {
    element.style.filter = "grayscale(1)"; // Dodanie filtru do elementu
  }
});
document.querySelectorAll('td.logo').forEach(element => {
    const backgroundStyle = element.style.background || element.style.backgroundImage;

    if (backgroundStyle.includes("img/logo/night0.gif")) {
        element.style.background = "none";
    } else if (backgroundStyle.includes("img/logo/default0.jpg")) {
        element.style.background = "none";
    } else if (backgroundStyle.includes("img/logo/tlo_wiosna.gif")) {
        element.style.background = "none";
    }
});


    document.querySelectorAll('td.pcont').forEach(element => {
  element.style.color = '#bcbcbc'; // Ustawienie koloru tekstu na niebieski
});
document.querySelectorAll('img[src="/img/forum-title.png"]').forEach(element => {
  element.remove();  // Usuwa element z drzewa DOM
});
document.querySelectorAll('tr').forEach(element => {
  const backgroundStyle = element.style.background || element.style.backgroundImage;
  if (backgroundStyle.includes('/img/forum-wood_02.png')) {
    element.style.background = 'black'; // Zmiana tła na czarne
  }
});
document.querySelectorAll('th').forEach(element => {
  const backgroundStyle = element.style.background || element.style.backgroundImage;
  if (backgroundStyle.includes('/img/forum-wood_01.png')) {
    element.style.background = 'none'; // Usuwanie tła
  }
});

document.querySelectorAll('th').forEach(element => {
  const backgroundStyle = element.style.background || element.style.backgroundImage;
  if (backgroundStyle.includes('/img/forum-wood_03.png')) {
    element.style.background = 'none'; // Usuwanie tła
  }
});

    document.querySelectorAll('tr.ncatbar').forEach(element => {
  const backgroundStyle = element.style.background || element.style.backgroundImage;
  if (backgroundStyle.includes('/img/forum-woodb_02.png')) {
    element.style.background = 'black'; // Zmiana tła na czarne
  }
});


    document.querySelectorAll('th[style*="background:url(/img/forum-woodb_01.png)"]').forEach(element => {
  element.style.background = 'none'; // Zmiana tła na none
});
    document.querySelectorAll('th[style*="background:url(/img/forum-woodb_03.png)"]').forEach(element => {
  element.style.background = 'none'; // Zmiana tła na none
});
document.querySelectorAll('tr.catbar[style*="background:url(/img/forum-woodb_02.png)"]').forEach(element => {
  element.style.background = 'black'; // Zmiana tła na czarne
});

document.querySelectorAll('th[style*="background:none"]').forEach(element => {
  element.style.background = 'black'; // Zmiana tła na czarne
});

document.querySelectorAll('[style*="background: url(\'/img/forum-catlogo.png\')"]').forEach(element => {
  element.style.filter = 'grayscale(1)';
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("td.logo img").forEach(img => img.remove());
});



    document.querySelectorAll('img[src="/_i/pl/logo-small.svg?v=2"], img.logo-mini[src="/_i/pl/logo-mini.svg"]').forEach(element => {
  element.style.filter = 'grayscale(1)'; // Dodanie filtru skali szarości
});
document.querySelectorAll('[style*="background: url(/img/forum-categ.png)"]').forEach(element => {
  element.style.background = '#363839bf'; // Ustawienie tła na kolor z przezroczystością
  element.style.border = 'solid 4px black'; // Dodanie obramowania
  element.style.borderRadius = '20%'; // Zaokrąglenie rogów
});
 document.querySelectorAll('span[style*="color: gold"]').forEach(element => {
  element.style.color = 'white';
});
    document.querySelectorAll('a.addbutton[style*="color: red"]').forEach(element => {
  element.style.color = '#b2a6a6'; // Zmiana koloru na #b2a6a6
});

document.querySelectorAll('img[src="/_i/pl/logo-small.png?v=2"]').forEach(element => {
  element.style.filter = 'grayscale(1)'; // Dodanie filtru skali szarości
});
document.querySelectorAll('b[style*="color:gold"]').forEach(element => {
  element.style.color = 'white'; // Zmiana koloru tekstu na biały
});
function updateSpanColors() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('span[style*="color: #fdd600"]').forEach(span => {
      span.style.setProperty('color', '#859dd3', 'important');
    });
  });

  // Nasłuchiwanie zmian w całym dokumencie
  observer.observe(document.body, { childList: true, subtree: true });

  // Początkowe ustawienie koloru
  document.querySelectorAll('span[style*="color: #fdd600"]').forEach(span => {
    span.style.setProperty('color', '#859dd3', 'important');
  });
}

// Wywołanie funkcji
updateSpanColors();
function styleTextarea() {
  const textarea = document.getElementById('content');
  if (textarea) {
    textarea.style.background = 'rgb(120 120 120 / 11%)';
    textarea.style.color = 'white';
    textarea.style.border = '2px solid black';
  }
}

// Wywołanie funkcji
styleTextarea();
function styleSubmitButton() {
  const button = document.querySelector('input[type="submit"][name="addp"]');
  if (button) {
    button.style.background = 'black';
    button.style.color = 'white';
    button.style.border = '2px solid #5c5c5c';
    button.style.borderRadius = '10%';
    button.style.width = '200px';
    button.style.height = '30px';
  }
}

// Wywołanie funkcji
styleSubmitButton();

(function startFireflyScript() {
    if (window.location.href === 'https://www.margonem.pl/') {
        console.log('Skrypt uruchomiony na stronie głównej Margonem.');

        // Funkcja do uzyskania obszaru tła (całe okno)
        function getBackgroundArea() {
            return {
                minX: 0,
                minY: 0,
                maxX: window.innerWidth,
                maxY: window.innerHeight,
            };
        }

        // Funkcja do tworzenia losowych pozycji świetlików
        function randomizeFireflyPosition(firefly, minX, minY, maxX, maxY) {
            const randomX = Math.random() * (maxX - minX) + minX;
            const randomY = Math.random() * (maxY - minY) + minY;
            firefly.style.left = `${randomX}px`;
            firefly.style.top = `${randomY}px`;
        }

        // Funkcja do animacji świetlików
        function animateFireflies() {
            const fireflies = document.querySelectorAll('.firefly3');
            const backgroundArea = getBackgroundArea();

            fireflies.forEach(firefly => {
                randomizeFireflyPosition(
                    firefly,
                    backgroundArea.minX,
                    backgroundArea.minY,
                    backgroundArea.maxX,
                    backgroundArea.maxY
                );
            });
        }

        // Dodanie elementów świetlików
        function createFireflies(numberOfFireflies) {
            for (let i = 0; i < numberOfFireflies; i++) {
                const firefly = document.createElement('div');
                firefly.classList.add('firefly3');
                document.body.appendChild(firefly);
            }
            console.log(`${numberOfFireflies} świetlików zostało dodanych do strony.`);
        }

        // Dodanie stylów CSS
        function addCSS() {
            const style = document.createElement('style');
            style.textContent = `
                .firefly3 {
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    border-radius:100%;
                    background-color: #f0f0f0;
                    background-size: contain; /* Dopasowanie tła */
                    box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.7), 0 0 3px 2px rgba(255, 255, 255, 0.5);
                    pointer-events: none; /* Aby świetliki nie wpływały na interakcje */
                    transition: left 10s, top 10s; /* Animacja 5 sekund */
                    opacity: 0.8; /* Delikatna przezroczystość */
                    z-index: -1; /* Pod tłem strony */
                }
            `;
            document.head.appendChild(style);
            console.log('Dodano style CSS dla świetlików.');
        }

        // Funkcja uruchamiająca animację
        function startFireflyAnimation() {
            addCSS();
            createFireflies(10); // Dodanie 10 świetlików
            setInterval(animateFireflies, 9700); // Animacja co 9.7 sekund
        }

        // Inicjalizacja
        startFireflyAnimation();
    }
})();

















if (true){
  $(`<style>
 BODY{background-image:url(https://i.imgur.com/ZPwx43D.png);background-size: 100%;background-attachment: fixed;}
#paper{background: none;color: #ffffff;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
.hor{background: black;height: 1px;}
.ver{background: black;width: 1px;}
td.logo{filter: grayscale(1);}
#side-left{background:none;}
#forum .topics TD{border: 1px solid #6c7577;color: #919da7;}
#forum .sticky {background: #414447ab;}
A {color: #d2d3d4;}
A:hover{color:#000000;}
#forum SMALL {color: #b6b6b6;}
#forum .topics TH{color: #60c8f8;}
#forum .topics TR:hover{background: #8b989e69;}
#ornrd {background: none;}
#ornru {background: none;}
#ornld {background: none;}
#ornlu {background: none;}
#posts{background: #2a2c2e8f;text-shadow: 0px 0px 0 #000000, 0px 0px 0 #000, 0px 0px 2px #000, 0px 0px 0 #000000;}
BLOCKQUOTE{border: 2px solid #000000;background: #575f6040;}
#posts .sepbar {height: 1px;font-size: 1px;background: black;}
#posts TD{border: 2px solid #000000;}
#forum TD.pbar{background: #1c1f2173;color:#bebebe;border-top-width: 3px;}
#forum B.fr1, #forum B.fr2{background:none;}
#forum B.fr2{background:none;}
#posts H3{background:none;color: #d8d8d8;}
#posts TD.puser{background: url(https://i.imgur.com/G9C0mlr.png);color:#ffffff;}
#posts TABLE.repbar{background: url(https://i.imgur.com/iF9YUrF.png) no-repeat;}
#posts .nickwood{background: url(https://i.imgur.com/YXBa8ZS.png) top center;}
#posts TD.postid{background: url(https://i.imgur.com/G9C0mlr.png);color: #bdbcb9;}
#posts TD.zsp{background: url(/img/forum-post-b5.png) !important;}
#posts TD.smg{background: url(/img/forum-post-b3.png) !important;}
#posts TD.mod{background: url(/img/forum-post-b2.png) !important;}
#posts TD.smg A, #posts TD.mod A, #posts TD.system A, #posts TD.pns A, #posts TD.zsp A{color: #dfe1e3;}
#forum TABLE.repbar TD{color: #d7d8e4;}
#posts TD.smg A:hover, #posts TD.mod A:hover, #posts TD.system A:hover, #posts TD.pns A:hover, #posts TD.zsp A:hover{color: #000000;}
#tip.rep{background: url(https://i.imgur.com/G9C0mlr.png);}
#tip{border: 2px solid black;border-radius: 10%;}
#tip-o1{background: none;}
#tip-o2{background: none;}
#forum .rules{background: #45454540;border: 2px solid #000000;color: #ffffff;}
#paper H4{border: 2px solid #ffffeb;color: #ffffff;background: #3a3a3a;}
#forum .catg TD{border: 1px solid #454545;}
#forum .cat2{color:white;}
#tip.item{background: #000000f2;border-color: #000000;color: #d8d8d8;}
#tip.item B{color: #dfeaff;}
#tip.item I.legbon{color: #f33f3f;}
#tip.item I.looter{color: #969696;}
#tip.item I.idesc{color: #969696;}
#tip.item B.att{color: #ffffff;}
#tip.item B.legendary{color: #f33f3f;}
.light-brown-box{color: #a6a6a6;background-color: #1e1e1e47;box-shadow: inset 0 0 3px 0 rgb(58 58 58 / 35%), inset 0 0 25px 8px rgb(62 61 61 / 90%), 0 0 8px 2px #000;}
.comments{color: #787878;filter: grayscale(1);}
:root {--bg-gradient: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0 0 0) 40%, rgb(0 0 0) 60%, rgb(0 0 0 / 0%) 100%);}
.background-logged-wrapper{background-image: none !important;}
.menu{background: black;border: solid 2px #2e2e2e;border-radius: 40px;}
.menu>li a{color: #969696;}
.menu>li a:hover{color: #fefefe;}
.menu>li>ul{    box-shadow: 0 3px 9px rgb(64 64 64 / 80%);border: rgb(48 48 48 / 80%) solid 1px;}
.menu>li>ul>li:hover{color: #ffffff;background: rgb(55 55 55 / 50%);}
.menu>li>ul>li{color: #9e9e9e;background-color: rgb(0 0 0 / 80%);border-bottom: rgb(74 74 74 / 80%) solid 1px;}
.box-trnsp .heading{color: #cccccc;}
.box-trnsp .label, .box-trnsp label{color: #a4a3a2;}
.text-divider span{color: #a8a8a8;}
.text-divider span::after, .text-divider span::before{background: rgb(107 107 107 / 60%);}
.c-btn--secondary.c-btn--outlined{border: 1px solid rgb(101 101 101 / 70%);color: #a6a6a6;}
.c-btn.enter-game{background: #242424b3;border: 1px solid #4a4a4a;color: white;box-shadow: 0px 0px 8px 1px #989898;}
.c-btn.enter-game:hover{    background: #6b6b6bb3; box-shadow: 0px 0px 15px 9px #989898;}
.c-btn--secondary.c-btn--outlined:hover{border-color: rgb(255 255 255 / 85%);}
.header-box .select-char{filter: grayscale(1);}
.light-brown-box h1, .light-brown-box h2, .light-brown-box h3, .light-brown-box h4{color: #b7b6b6;}
.news-container .news-body h3{color: rgb(207 207 207 / 90%);}
.popup-select-character .charc, .popup-select-character .new-char{border: 2px solid #000000b3;background: rgb(58 58 57 / 73%);box-shadow: inset 0 0 25px 5px rgb(0 0 0 / 89%);color: #b2b2b2;}
.popup-select-character .charc:hover, .popup-select-character .new-char:hover{background: rgb(134 131 127 / 73%);color: white;}
.btn, .close-popup{background-image: linear-gradient(to bottom, #232323 40%, #181817 80%);border: 1px solid #3d3d3d;color: #bdbdbd;}
select option{background: #181717d6;color: white;}
option:hover {background: #666464;}
.form-control, .form-select{    color: #d4d4d4;}
.pagination{color: #9e9e9e;}
.news .news-footer{color: #9a9a9a;}
.short-news .short-news-footer{color: #878787;}
.white-line{background: linear-gradient(to right, rgba(200, 175, 133, 0) 2%, #ffffff 30%, #ffffff 70%, rgba(200, 175, 133, 0) 98%);}
.brown-box, .light-brown-box{color: #a6a6a6;background-color: #1e1e1e47;box-shadow: inset 0 0 3px 0 rgb(58 58 58 / 35%), inset 0 0 25px 8px rgb(62 61 61 / 90%), 0 0 8px 2px #000;}
.brown-box h1, .brown-box h2, .brown-box h3, .light-brown-box h1, .light-brown-box h2, .light-brown-box h3{color: #a7a7a7;}
.brown-box .black-line, .light-brown-box .black-line{background: #747474;}
footer{background: #00000073;border-top: 1px solid #656565;}
.server-stats-info .server-stat .server-stat-value{color: #ffffff;}
.toplist-header .slide-radio-container{color: #626262;}
.toplist-header .slide-radio-container input[type=radio]+label:nth-child(2){filter:grayscale(1);}
.form-group--dark .form-control, .form-group--dark .form-select, .form-group--dark .label-control{color: #cccccc;}
.form-group--dark .form-select option{color:white;}
.form-group--dark .form-select{filter: grayscale(1);}
.server-stats table tr td{color: #bebebe;}
.server-stats table tr td:nth-child(2){background:none;}
.news-container .news-header h2{color:white;}
.ranking-tab{background: #4b4b4b96;border: solid 2px #434343;color: #dddddd;}
.header-underline .subheader{color: #888786;}
table tr .dark-cell, table tr.dark-row{color: #e0e0e0;background: #000000a1;}
table.table--separators td+td:after, table.table--separators th+th:after{border-right: 1px solid #878787;}
table tr{color: #adadad;}
table.table--separators tbody .dark-cell:after{border-top: 1px solid #878787;}
.top-player.pvp-image h4{color: #eeeeee;}
.top-player .player-image .player-image-background{box-shadow: inset 0px 0px 17px 12px #2f2f2f;}
table tr:hover .dark-cell{background-color:#343434;}
.season-button{background: #1b1b1b8f;border: solid 1px #63636394;border-radius: 10px;}
.season-button.season-button-active{background: #7070708f;border: solid 1px #63636394;}

.profile-header h2 span{color: #ffffff;}
.c-avatar--border::before{background:none;}
.c-avatar{border: solid 2px #747474d6;box-shadow: inset 0px 0px 8px 4px #424242;background: #83838324 no-repeat bottom center;}
.profile-header .profile-header-data-container .profile-header-data{    background: #11111178;}
.profile-header .profile-header-data-container .profile-header-data .value{color: #aeaeae;}
.profile-container .left-column{background: #00000057;}
.profile-container .left-column li{border: 2px solid #000000b3;background: rgb(58 58 57 / 73%);box-shadow: inset 0 0 25px 5px rgb(0 0 0 / 89%);color: #b2b2b2;}
.profile-container .left-column li:hover{background: rgb(134 131 127 / 73%);color: white;}
.profile-container .right-column{background: #00000057;border:none;}
.profile-container .right-column .char-container .char-background{background: radial-gradient(black, #0000001f, transparent);border-radius: 50%;}
.profile-container .right-column .char-container .eq-background{background: none;}
.profile-container .right-column .char-headers{background: #0000008f !important;}
.profile-container .right-column .char-headers .char-header{color: #bcbcbc;}
.profile-container .right-column .char-data .char-data-column{color: #9b9b9b;}
.profile-custom-page.light-brown-box .profile-custom-page-body blockquote{border: 2px solid #57575661;background: #1616167a;}
.tabs__nav-item.is-active{background: #aeaeae96;color: #ffffff;}
.tabs__nav-item.is-active:after{background: none;}
.tabs__nav-item{background: #4b4b4b96;border: solid 2px #434343;color: #dddddd;}
.tabs__nav-item:hover{background-color: #535353;}
.tabs__content{color: #cccccc;}
.form-check-input--brown:checked[type=radio], .light-brown-box .form-check-input:checked[type=radio]{filter: grayscale(1);}
.form-check-input--brown:checked, .light-brown-box .form-check-input:checked{background-color: #373737;border-color: rgb(9 9 9 / 70%);}
button#js-av-btn{background: #242424b3;border: 1px solid #4a4a4a;color: white;box-shadow: 0px 0px 8px 1px #989898;}
button#js-av-btn:hover{background: #6b6b6bb3;box-shadow: 0px 0px 15px 9px #989898;}
.tip-wrapper{color: #dadada;}
.account-config .info-row .eye-icon-button{filter: grayscale(1);}
.account-config .config-background-container .fback-list:before{border-image: none;}
.account-config .character-icon span{color: #bababa;}
.profile-custom-page .profile-custom-page-body blockquote{border: 2px solid #57575661;background: #1616167a;}
.sceditor-container iframe, .sceditor-container textarea{color:white;}
.account-config .profile-edit .sceditor-toolbar{background: #0000009c;}
.account-config .profile-edit .sceditor-dropdown, .account-config .profile-edit .sceditor-group{background: #a9a9a9;}
.vertical-white-line{background: linear-gradient(to bottom, #ffffff 2%, #ffffff 30%, #ffffff 70%, #ffffff 98%);}
.form-check-input--brown:checked[type=checkbox], .light-brown-box .form-check-input:checked[type=checkbox]{filter: grayscale(1);}
.account-config .c-char>:not(:first-child)::before{background: #ffffff;}
.account-config .c-char__icon{color: #9e9e9e;}
.account-config .c-char{background: #0f0f0f8f;color: #e5e5e5;border: 1px solid #717171b3;}
.tabs--style2 .tabs__content{background: #1c1c1cbd;border: 1px solid #666666ba;color: #e4e3e2;}
.tabs--style2 .tabs__nav-item.is-active{background: #aeaeae96;color: #ffffff;}
.tabs--style2 .tabs__nav-item{background: #4b4b4b96;border: solid 2px #434343;color: #dddddd;}
.helper-text{color: #8f8f8f;}
button.c-btn.mt-4{background: #242424b3;border: 1px solid #4a4a4a;color: white;box-shadow: 0px 0px 8px 1px #989898;}
button.c-btn.mt-4:hover{background: #6b6b6bb3;box-shadow: 0px 0px 15px 9px #989898;}
.text-green{color: #82e465;}
.text-red{color: #be8080;}
.special-offer{border: 1px solid #909090;background: rgba(255, 255, 255, .2);box-shadow: inset 0 0 24px 3px #100f0f;}
.prof_name{color: white;}
.prof_wrapper .prof.active{background: #717171b3;border: 1px solid #ffffff78;}
.prof_wrapper .prof.active .prof_name{color:#cafff3;}
.prof_wrapper .prof{background: #02020263;}
.header-box .substitution-time{    color: white;}
input[type="text"] {border-radius: 10px;background: #b3b3b3;filter: drop-shadow(2px 4px 6px black);}
input[type="submit"]{border-radius: 7px;background: #353535;color: white;border-color: #636363;}
select{border-radius: 10px;background: #1e1e1e;color: white;}
</style>`).appendTo('body');
}
preload();
})();