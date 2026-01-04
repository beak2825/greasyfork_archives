// ==UserScript==
// @name          GreasyFork Modo Escuro
// @name:pt       GreasyFork Modo Escuro
// @name:pt-BR    GreasyFork Modo Escuro
// @name:pt-PT    GreasyFork Modo Escuro
// @name:es       Modo Oscuro de GreasyFork
// @name:en       GreasyFork Dark Mode
// @name:en       GreasyFork Dark Mode
// @name:fr       Mode sombre GreasyFork
// @name:ru       Тёмный режим GreasyFork
// @name:ja       GreasyFork ダークモード
// @name:ko       GreasyFork 다크 모드
// @name:zh-TW    GreasyFork 黑暗模式
// @name:zh-CN    GreasyFork 暗黑模式
// @name:id       Mode Gelap GreasyFork
// @name:ug       GreasyFork كۈنجەلەر كۇنۇپكىسى
// @name:ar       وضع الظلام لـ GreasyFork
// @name:he       מצב כהה של GreasyFork
// @name:hi       GreasyFork डार्क मोड
// @name:th       โหมดมืด GreasyFork
// @name:bg       Тъмнен режим на GreasyFork
// @name:ro       Mod întunecat GreasyFork
// @name:fi       GreasyForkin tumma tila
// @name:it       Modalità scura GreasyFork
// @name:el       Σκοτεινή λειτουργία GreasyFork
// @name:eo       Malhela modo de GreasyFork
// @name:hu       GreasyFork Sötét Mód
// @name:nb       GreasyFork Mørk Modus
// @name:sk       Tmavý režim GreasyFork
// @name:sv       GreasyFork Mörkt läge
// @name:sr       Тамни режим ГреасиФорк
// @name:pl       Tryb ciemny GreasyFork
// @name:nl       GreasyFork Donkere modus
// @name:de       GreasyFork Dunkler Modus
// @name:da       GreasyFork Mørk tilstand
// @name:cs       Temný režim GreasyFork
// @name:uk       Темний режим GreasyFork
// @name:tr       GreasyFork Koyu Mod
// @name:vi       Chế độ Tối GreasyFork
// @name:fr-CA    Mode sombre GreasyFork

// @description       Deixa a interface do Greasy Fork em modo escuro.
// @description:pt        Deixa a interface do Greasy Fork em modo escuro.
// @description:pt-BR     Deixa a interface do Greasy Fork em modo escuro.
// @description:pt-PT     Deixa a interface do Greasy Fork em modo escuro.
// @description:es        Pone la interfaz de Greasy Fork en modo oscuro.
// @description:en        Turns the Greasy Fork interface into dark mode.
// @description:en        Turns the Greasy Fork interface into dark mode.
// @description:fr        Met l'interface de Greasy Fork en mode sombre.
// @description:ru        Переключает интерфейс Greasy Fork в темный режим.
// @description:ja        Greasy Forkのインターフェースをダークモードに切り替えます。
// @description:ko        Greasy Fork 인터페이스를 다크 모드로 변경합니다.
// @description:zh-TW     將 Greasy Fork 介面切換為暗黑模式。
// @description:zh-CN     将 Greasy Fork 界面切换为暗黑模式。
// @description:id        Mengubah antarmuka Greasy Fork menjadi mode gelap.
// @description:ug        Greasy Fork كۆرسەتكۈچىسىنى كۈنجەلەر كۇنۇپكىسىغا ئايلاندۇرىدۇ.
// @description:ar        يقوم بتحويل واجهة Greasy Fork إلى الوضع الداكن.
// @description:he        משנה את ממשק ה-Greasy Fork למצב כהה.
// @description:hi        Greasy Fork इंटरफेस को डार्क मोड में बदलता है।
// @description:th        ทำให้อินเตอร์เฟซของ Greasy Fork เป็นโหมดมืด
// @description:bg        Превръща интерфейса на Greasy Fork в тъмен режим.
// @description:ro        Transformă interfața Greasy Fork în modul întunecat.
// @description:fi        Muuttaa Greasy Forkin käyttöliittymän tummaksi tilaksi.
// @description:it        Trasforma l'interfaccia di Greasy Fork in modalità scura.
// @description:el        Μετατρέπει τη διεπαφή του Greasy Fork σε σκοτεινή λειτουργία.
// @description:eo        Ŝaltas la interfacon de Greasy Fork en malhelan modon.
// @description:hu        Átkapcsolja a Greasy Fork felhasználói felületét sötét módba.
// @description:nb        Bytter Greasy Fork-grensesnittet til mørk modus.
// @description:sk        Prevráti rozhranie Greasy Fork do tmavého režimu.
// @description:sv        Gör Greasy Fork-gränssnittet mörkt läge.
// @description:sr        Пребацује интерфејс Греаси Форка у тамни режим.
// @description:pl        Przełącza interfejs Greasy Fork w tryb ciemny.
// @description:nl        Zet de interface van Greasy Fork om naar donkere modus.
// @description:de        Schaltet die Benutzeroberfläche von Greasy Fork in den Dunkelmodus.
// @description:da        Ændrer Greasy Fork-grænsefladen til mørk tilstand.
// @description:cs        Přepne rozhraní Greasy Fork do tmavého režimu.
// @description:uk        Перемикає інтерфейс Greasy Fork в темний режим.
// @description:tr        Greasy Fork arayüzünü koyu moda çevirir.
// @description:vi        Chuyển giao diện của Greasy Fork sang chế độ tối.
// @description:fr-CA     Met l'interface de Greasy Fork en mode sombre.

// @namespace       http://linkme.bio/jhonpergon/?userscript=greasyfork_dark-mode
// @version       1.0
// @author       Jhon Pérgon

// @icon         https://greasyfork.org/vite/assets/blacklogo16-37ZGLlXh.png
// @grant        GM_addStyle
// @match        https://greasyfork.org/*
// @grant        none
// @license      MIT

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser
// @downloadURL https://update.greasyfork.org/scripts/487415/GreasyFork%20Modo%20Escuro.user.js
// @updateURL https://update.greasyfork.org/scripts/487415/GreasyFork%20Modo%20Escuro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bodyStyles = document.createElement('style');
    bodyStyles.innerHTML = `
        body{
            background-color: #121517; color: #fff;
            color: #fff;
            background-image: url("https://wallpapercrafter.com/desktop1/612985-binary-code-binary-code-dark-technology-art-graphics.jpg"); /*https://wallpapercrafter.com/th8001/612985-binary-code-binary-code-dark-technology-art-graphics.jpg*/
            background-size: 100%;
        }
        p{
          background-color: rgba(0,0,0,.7);
        }
        a{
          color: #f40072;
        }
        a:hover{
          text-shadow: 1px .5px 3px #b531ff;
        }
        a:visited {
          color: #dd0b77;
        }
        .list-option-group ul {
          background-color: #000;
        }
        .list-option-group .list-current{
          border-left: 7px solid #7d1372;
          box-shadow: inset 0 1px #9d2b561a,inset 0 -1px #1b0e221a;
          margin: 0 0 0 -4px;
          padding: .4em 1em .4em calc(1em - 3px);
          background: linear-gradient(#550024,#140731);
        }
        .list-option-group a:hover,
        .list-option-group a:focus {
          background:linear-gradient(#1a142b,#680158);
          text-decoration:none;
          box-shadow:inset 0 -1px #ddd,inset 0 1px #eee;
          color: #dcdcdc;
        }
        a.discussion-title {
          color: #f3c9ff;
        }
        a.discussion-title:hover {
          color: #efb6ff;
        }
        .rating-icon{
          background-color: #000;
        }

        .user-content {
          background: linear-gradient(to right,#263351,#050c13ad 1em);
          border-left: 2px solid #636dfb;
        }
        textarea{
          background-color: #0c0e15;
          color: #dcdcdc;
          border: solid 2px #305473;
        }

        .linenums li{
          background-color: #dcdcdc;
        }
        .linenums li span{
          background-color: #dcdcdc;
        }

    `;
    document.head.appendChild(bodyStyles);

    // Objeto que mapeia classes ou IDs de elementos para estilos de substituição
    const estilosParaSubstituir = {
        // INTERFACE
        'main-header': 'background-image: linear-gradient(rgb(91, 0, 76), rgb(9, 6, 6)); background-color: #111010;', //cabeçalho

        'text-content': 'background-color: #0c0e0f; color: #fff; border: 1px solid #59162C; box-shadow: 0 0 5px #1557d5;', //content central

        'script-list': 'background-color: #07060b; border: 1px solid #59162C; box-shadow: 0 0 5px #1557d5;',
        'script-info': 'background-color: #07060b; border: 1px solid #59162C; box-shadow: 0 0 5px #1557d5;',

        'script-list-sort': '',

        // Adicione mais pares de classes ou IDs aqui
    };

      // Função para substituir estilos CSS em elementos
      function substituirEstilos() {
          for (const seletor in estilosParaSubstituir) {
              const elementos = document.querySelectorAll(`.${seletor}, #${seletor}`);
              elementos.forEach(elemento => {
                  elemento.style.cssText += estilosParaSubstituir[seletor];
              });
          }
      }

    substituirEstilos();

})();

