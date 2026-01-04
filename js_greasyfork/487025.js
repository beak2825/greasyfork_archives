// ==UserScript==
// @name            TikTok Magic (download dinâmico)
// @namespace       https://linkme.bio/jhonpergon/?userscript=tiktok_tools
// @version         1.4
// @author          Jhon Pérgon
// @description     Baixe vídeos sem logo/marca d'água com apenas um clique, diretamente do tiktok. Mais recursos em breve.

/// @name:pt       TikTok Magic (download dinâmico)
// @name:pt-BR     TikTok Magic (download dinâmico)
// @name:pt-PT     TikTok Magic (download dinâmico)
// @name:es        TikTok Magic (descarga dinámica)
// @name:en        TikTok Magic (dynamic download)
// @name:en-US     TikTok Magic (dynamic download)
// @name:fr        TikTok Magic (téléchargement dynamique)
// @name:ru        TikTok Magic (динамическая загрузка)
// @name:ja        TikTok Magic（ダイナミックダウンロード）
// @name:ko        TikTok Magic (동적 다운로드)
// @name:zh-TW     TikTok Magic（動態下載）
// @name:zh-CN     TikTok Magic（动态下载）
// @name:id        TikTok Magic (unduhan dinamis)
// @name:ug        TikTok Magic (دينامىك چۈشەندۈرۈش)
// @name:ar        TikTok Magic (تحميل ديناميكي)
// @name:he        TikTok Magic (הורדה דינמית)
// @name:hi        TikTok Magic (गतिशील डाउनलोड)
// @name:th        TikTok Magic (ดาวน์โหลดไดนามิก)
// @name:bg        TikTok Magic (динамично изтегляне)
// @name:ro        TikTok Magic (descărcare dinamică)
// @name:fi        TikTok Magic (dynaaminen lataus)
// @name:it        TikTok Magic (download dinamico)
// @name:el        TikTok Magic (δυναμική λήψη)
// @name:eo        TikTok Magic (dinamika elŝuto)
// @name:hu        TikTok Magic (dinamikus letöltés)
// @name:nb        TikTok Magic (dynamisk nedlasting)
// @name:sk        TikTok Magic (dynamické sťahovanie)
// @name:sv        TikTok Magic (dynamisk nedladdning)
// @name:sr        TikTok Magic (динамично преузимање)
// @name:pl        TikTok Magic (dynamiczne pobieranie)
// @name:nl        TikTok Magic (dynamische download)
// @name:de        TikTok Magic (dynamischer Download)
// @name:da        TikTok Magic (dynamisk download)
// @name:cs        TikTok Magic (dynamické stahování)
// @name:uk        TikTok Magic (динамічне завантаження)
// @name:tr        TikTok Magic (dinamik indirme)
// @name:vi        TikTok Magic (tải xuống động)
// @name:fr-CA     TikTok Magic (téléchargement dynamique)

// @description:pt        Baixe vídeos sem logo/marca d'água com apenas um clique, diretamente do tiktok. Mais recursos em breve.
// @description:pt-BR     Baixe vídeos sem logo/marca d'água com apenas um clique, diretamente do tiktok. Mais recursos em breve.
// @description:pt-PT     Baixe vídeos sem logo/marca d'água com apenas um clique, diretamente do tiktok. Mais recursos em breve.
// @description:es        Descarga vídeos sin logo/marca de agua con un solo clic, directamente desde TikTok. Pronto más características.
// @description:en        Download videos without logo/watermark with just one click, directly from TikTok. More features coming soon.
// @description:fr        Téléchargez des vidéos sans logo/marque d'eau en un seul clic, directement depuis TikTok. Plus de fonctionnalités à venir.
// @description:ru        Загружайте видео без логотипа/водяного знака всего одним щелчком, прямо из TikTok. Скоро появятся дополнительные функции.
// @description:ja        ロゴ/ウォーターマークなしの動画を1クリックでTikTokから直接ダウンロードします。近日、さらなる機能を追加予定です。
// @description:ko        로고/워터마크 없는 동영상을 한 번의 클릭으로 TikTok에서 직접 다운로드하세요. 곧 더 많은 기능이 출시됩니다.
// @description:zh-TW     一次點擊即可從 TikTok 直接下載無標誌/水印的影片。更多功能即將推出。
// @description:zh-CN     一次点击即可从 TikTok 直接下载无标志/水印的视频。更多功能即将推出。
// @description:id        Unduh video tanpa logo/tanda air dengan hanya satu kali klik, langsung dari TikTok. Fitur lebih lanjut akan segera hadir.
// @description:ug        TikTokدىن تەكشۈرۈشقا كۈنكەر قۇيۇپ، بىر قىلىشتا پۈتۈن چۈشەندۈرۈشقا بولىدۇ. قوشۇمچە ئىمكانلار قىلىنىدۇ.
// @description:ar        قم بتنزيل الفيديوهات بدون شعار/علامة مائية بنقرة واحدة، مباشرة من TikTok. المزيد من الميزات قريبًا.
// @description:he        הורד סרטונים ללא לוגו/סימן מים בלחיצה אחת, ישירות מ-TikTok. יש יותר תכונות בקרוב.
// @description:hi        एक क्लिक में लोगो/जलाम रहित वीडियो डाउनलोड करें, सीधे TikTok से। जल्द ही अधिक सुविधाएँ उपलब्ध होंगी।
// @description:th        ดาวน์โหลดวิดีโอโดยไม่มีโลโก้/ลายน้ำด้วยคลิกเดียวโดยตรงจาก TikTok คุณลักษณะเพิ่มเติมในเร็ว ๆ นี้
// @description:bg        Изтегляйте видеоклипове без лого/воден знак с едно щракване, директно от TikTok. Повече функции скоро.
// @description:ro        Descărcați videoclipuri fără logo/semn de apă cu doar un clic, direct de pe TikTok. Mai multe funcționalități în curând.
// @description:fi        Lataa videoita ilman logoa/vesileimaa vain yhdellä napsautuksella, suoraan TikTokista. Lisää ominaisuuksia tulossa pian.
// @description:it        Scarica video senza logo/watermark con un solo clic, direttamente da TikTok. Altre funzionalità in arrivo presto.
// @description:el        Κατεβάστε βίντεο χωρίς λογότυπο/υδατογραφή με μόνο ένα κλικ, απευθείας από το TikTok. Περισσότερες λειτουργίες σύντομα διαθέσιμες.
// @description:eo        Elŝutu videojn sen logo/aŭ akvo-marko per nur unu klako, rekte de TikTok. Pliaj funkcioj venos baldaŭ.
// @description:hu        Tölts le videókat logó/vízjel nélkül egyetlen kattintással, közvetlenül a TikTokról. Hamarosan több funkció érkezik.
// @description:nb        Last ned videoer uten logo/vannmerke med bare ett klikk, direkte fra TikTok. Flere funksjoner kommer snart.
// @description:sk        Stiahnite si videá bez loga/vodného značky jediným kliknutím priamo z TikToku. Ďalšie funkcie čoskoro.
// @description:sv        Ladda ner videor utan logotyp/vattenstämpel med bara ett klick, direkt från TikTok. Fler funktioner kommer snart.
// @description:sr        Преузмите видее без лого/воденог жига једним кликом, директно са ТикТока. Више функција ускоро.
// @description:pl        Pobieraj filmy bez logo/wodnego znaku za pomocą jednego kliknięcia, bezpośrednio z TikToka. Więcej funkcji wkrótce.
// @description:nl        Download video's zonder logo/watermerk met slechts één klik, rechtstreeks van TikTok. Meer functies binnenkort beschikbaar.
// @description:de        Laden Sie Videos ohne Logo/Wasserzeichen mit nur einem Klick direkt von TikTok herunter. Weitere Funktionen bald verfügbar.
// @description:da        Download videoer uden logo/vandmærke med kun ét klik, direkte fra TikTok. Flere funktioner kommer snart.
// @description:cs        Stahujte videa bez loga/vodního znamení jedním kliknutím přímo z TikToku. Další funkce brzy.
// @description:uk        Завантажуйте відео без лого/водяного знаку одним кліком, безпосередньо з TikTok. Більше функцій незабаром.
// @description:tr        TikTok'tan sadece bir tıklama ile logo/su damgası olmadan video indirin. Yakında daha fazla özellik.
// @description:vi        Tải xuống video mà không có logo/dấu nước chỉ bằng một cú nhấp chuột, trực tiếp từ TikTok. Các tính năng khác sẽ sớm được cập nhật.
// @description:fr-CA     Téléchargez des vidéos sans logo/marque d'eau en un seul clic, directement depuis TikTok. Plus de fonctionnalités à venir.

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue

// @license        MIT
// @match          https://*.tiktok.com/*
// @icon           https://cdn.iconscout.com/icon/free/png-256/free-tiktok-4069944-3365463.png

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser
// @downloadURL https://update.greasyfork.org/scripts/487025/TikTok%20Magic%20%28download%20din%C3%A2mico%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487025/TikTok%20Magic%20%28download%20din%C3%A2mico%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

  let contagemK = 0;

  function addBToks(){

    // Criação do elemento <a>
    var linkElement = document.createElement('a');
    linkElement.setAttribute('href', '#');
    linkElement.setAttribute('class', 'linkTok');
    linkElement.setAttribute('target', '_blank');

    if(GM_getValue("statusVideo") == true && contagemK == 0){
      GM_setValue("statusVideo", false);
      linkElement.addEventListener('click', function() {
          setTimeout(() => {
              window.close(); // Fecha a aba após iniciar o download
          }, 1800);
      });
    }

    // Criação do elemento <button>
    var buttonElement = document.createElement('button');
    buttonElement.setAttribute('data-e2e', 'arrow-right');
    buttonElement.setAttribute('title', 'download magic');
    buttonElement.setAttribute('role', 'button');
    buttonElement.setAttribute('aria-label', 'Download Limpo');
    buttonElement.setAttribute('class', 'tiktokDL');

    // Criação do elemento <svg>
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '26');
    svgElement.setAttribute('height', '26');
    svgElement.setAttribute('viewBox', '0 0 48 48');
    svgElement.setAttribute('fill', '#fff');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('style', '--darkreader-inline-fill: #d7d5d1;');

    // Criação do elemento <path> dentro do <svg>
    var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', 'M21.9 7.38v19.86l-6.73-6.73a.87.87 0 0 0-1.24 0l-1.73 1.73a.88.88 0 0 0 0 1.24l11.18 11.18c.34.35.9.35 1.24 0L35.8 23.48a.88.88 0 0 0 0-1.24l-1.73-1.73a.87.87 0 0 0-1.24 0l-6.73 6.73V7.38c0-.49-.4-.88-.87-.88h-2.45c-.49 0-.88.4-.88.88ZM10.88 37.13c-.49 0-.88.39-.88.87v2.63c0 .48.4.87.88.87h26.24c.49 0 .88-.4.88-.87V38c0-.48-.4-.87-.87-.87H10.86Z');

    svgElement.appendChild(pathElement);
    buttonElement.appendChild(svgElement);
    linkElement.appendChild(buttonElement);

    var styleElement1 = document.createElement('style');
    styleElement1.innerHTML = `
        .tiktokDL{
            position: absolute;
            z-index: 1;
            display: flex;
            -moz-box-pack: center;
            justify-content: center;
            -moz-box-align: center;
            align-items: center;
            background: rgba(84, 84, 84, 0.5);
            border-radius: 50%;
            cursor: pointer;
            border: medium;
            outline: none;
            width: 40px;
            height: 40px;
            top: calc(50% + 62px);
            margin-top: -24px;
            right: 20px;
            z-index: 10;
        }
    `;
    var styleElement2 = document.createElement('style');
    styleElement2.innerHTML = `
        .tiktokDL{
            position: absolute;
            z-index: 1;
            display: flex;
            -moz-box-pack: center;
            justify-content: center;
            -moz-box-align: center;
            align-items: center;
            background: rgba(84, 84, 84, 0.5);
            border-radius: 50%;
            cursor: pointer;
            border: medium;
            outline: none;
            width: 40px;
            height: 40px;
            top: calc(50% + -262px);
            margin-top: -24px;
            right: 20px;
            z-index: 10;
        }
    `;


    if(document.querySelector(".css-1s9jpf8-ButtonBasicButtonContainer-StyledVideoSwitch.e11s2kul11")){
      // Selecionar o elemento com a classe específica
      document.head.appendChild(styleElement1);
      const targetElement = document.querySelector('.css-1s9jpf8-ButtonBasicButtonContainer-StyledVideoSwitch.e11s2kul11');
      targetElement.insertAdjacentElement('afterend', linkElement);
    }else if(document.querySelector(".css-ty9aj4-DivVideoContainer.eqrezik7")){
      document.head.appendChild(styleElement2);
      const targetElement = document.querySelector('.css-ty9aj4-DivVideoContainer.eqrezik7');
      targetElement.insertAdjacentElement('afterend', linkElement);
    }else{
      document.head.appendChild(styleElement1);
      document.querySelector("#app-header").appendChild(linkElement);
    }

  }


    // Armazena o valor após a última "/" no endereço do site
    var lastSegment = window.location.pathname.split('/').filter(function(segment) {
        return segment !== '';
    }).pop();

    function minhaFuncao() {
        console.log('O valor após a última "/" mudou para:', lastSegment);

        if(document.querySelector(".linkTok")){
          document.querySelector(".linkTok").remove();
        }

        if(window.location.href.includes("/video/")){
          addBToks();
          const videoTikTok = document.querySelector('video');
          if (videoTikTok && videoTikTok.src.includes("-prime.tiktok.com/video/")) {
              const videoSrc = videoTikTok.src;
              document.querySelector(".linkTok").href = videoSrc;
          } else {
              /*let cancellLink = document.querySelector(".linkTok");
                cancellLink.addEventListener('click', function(event) {
                event.preventDefault();
              });*/
              const linkTokElement = document.querySelector('.tiktokDL');
              linkTokElement.addEventListener('click', function() {
                  GM_setValue("statusVideo", true);
                  //alert('Error.');
                  //window.location.reload();
             });
          }
        }
    }

    // Monitora as mudanças no valor após a última "/"
    function tokChck() {
        var newLastSegment = window.location.pathname.split('/').filter(function(segment) {
            return segment !== '';
        }).pop();

        // Se o valor mudou, chama a função
        if (lastSegment !== newLastSegment) {
            lastSegment = newLastSegment;
            contagemK++;
            minhaFuncao();
        }
    };


    if(window.location.href.includes("-prime.tiktok.com/video/")){
      const videoElement = document.querySelector('video');

        if (videoElement) {
            videoElement.pause();
            const videoSrc = videoElement.src;
            const uniqueId = Math.floor(Math.random() * 10000); // Gera um ID único com quatro números
            const downloadFileName = `tiktok_magic-${uniqueId}.mp4`;
            const downloadLink = document.createElement('a');
            downloadLink.href = videoSrc;
            downloadLink.download = downloadFileName;

            downloadLink.addEventListener('click', () => {
                setTimeout(() => {
                    window.close(); // Fecha a aba após iniciar o download
                }, 1300); // Defina um intervalo de tempo suficiente para o download começar
            });
            downloadLink.click();

        } else {
            console.log('Elemento de vídeo não encontrado.');
        }
    }else{
      setTimeout(function(){
        minhaFuncao();
        setInterval(tokChck, 1500)
      },2500)
    }



  function carregarStatus() {
      const statusTK = GM_getValue("statusVideo");
      if (statusTK) {
        if(GM_getValue("statusVideo") == true){
          if(contagemK == 0){
            var dwstyle = document.createElement('style');
            dwstyle.innerHTML = `
                .tiktokDL{
                    border: 1px solid transparent;
                    animation: picbord .5s infinite;
                }
                @keyframes picbord {
                    0% {
                        border: 1px solid transparent;
                    }
                    100% {
                        border: 1px solid lightgreen;
                    }
                }
            `;
            document.head.appendChild(dwstyle);
          }
        }
      }else{
         GM_setValue("statusVideo", false);
      }
  }

  carregarStatus();

})();