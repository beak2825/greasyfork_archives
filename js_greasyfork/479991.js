// ==UserScript==
// @namespace    http://linkme.bio/jhonpergon/?userscript=buscadoresbar
// @version      1.8
// @author       Jhon Pérgon

// @name      Barra de Pesquisa Extra + Deep Web
// @name:pt      Barra de Pesquisa Extra + Deep Web
// @name:pt-BR      Barra de Pesquisa Extra + Deep Web
// @name:pt-PT      Barra de Pesquisa Extra + Deep Web
// @name:es      Barra de Búsqueda Extra + Deep Web
// @name:en      Extra Search Bar + Deep Web
// @name:fr      Barre de Recherche Supplémentaire + Deep Web
// @name:ru      Дополнительная строка поиска + Deep Web
// @name:ja      追加検索バー + Deep Web
// @name:ko      추가 검색 바 + Deep Web
// @name:zh-TW      額外搜索欄 + Deep Web
// @name:zh-CN      附加搜索栏 + Deep Web
// @name:id      Bilah Pencarian Tambahan + Deep Web
// @name:ug      قوشۇمچە ئىزدەش تىزىمىسى + Deep Web
// @name:ar      شريط البحث الإضافي + Deep Web
// @name:he      שורת חיפוש נוספת + Deep Web
// @name:hi      अतिरिक्त खोज बार + Deep Web
// @name:th      แถบค้นหาเพิ่มเติม + Deep Web
// @name:bg      Допълнителна търсачка + Deep Web
// @name:ro      Bară de Căutare Suplimentară + Deep Web
// @name:fi      Lisähakupalkki + Deep Web
// @name:it      Barra di Ricerca Extra + Deep Web
// @name:el      Επιπρόσθετη Γραμμή Αναζήτησης + Deep Web
// @name:eo      Aldona Serĉilo + Deep Web
// @name:hu      Extra Keresőszalag + Deep Web
// @name:nb      Ekstra Søkefelt + Deep Web
// @name:sk      Ďalšia Vyhľadávacia Lišta + Deep Web
// @name:sv      Extra Sökruta + Deep Web
// @name:sr      Додатна Трака за Претрагу + Deep Web
// @name:pl      Dodatkowa Belka Wyszukiwania + Deep Web
// @name:nl      Extra Zoekbalk + Deep Web
// @name:de      Extra Suchleiste + Deep Web
// @name:da      Ekstra Søgefelt + Deep Web
// @name:cs      Extra Vyhledávací Panel + Deep Web
// @name:uk      Додаткова Смуга Пошуку + Deep Web
// @name:tr      Ekstra Arama Çubuğu + Deep Web
// @name:vi      Thanh Tìm Kiếm Phụ + Deep Web
// @name:fr-CA   Barre de Recherche Supplémentaire + Deep Web

// @description          Concede acesso a links da deep web mesmo em navegadores comuns e adiciona várias opções de buscadores alternativos ao Google. Pressione CTRL+SPACE para visualizá-la.
// @description:pt       Concede acesso a links da deep web mesmo em navegadores comuns e adiciona várias opções de buscadores alternativos ao Google. Pressione CTRL+SPACE para visualizá-la.
// @description:pt-BR    Concede acesso a links da deep web mesmo em navegadores comuns e adiciona várias opções de buscadores alternativos ao Google. Pressione CTRL+SPACE para visualizá-la.
// @description:pt-PT    Concede acesso a links da deep web mesmo em navegadores comuns e adiciona várias opções de buscadores alternativos ao Google. Pressione CTRL+SPACE para visualizá-la.
// @description:es       Concede acceso a enlaces de la deep web incluso en navegadores comunes y añade varias opciones de buscadores alternativos a Google. Press CTRL+SPACE para visualizar.
// @description:en       Grants access to deep web links even in regular browsers and adds various alternative search engine options to Google. Press CTRL+SPACE to view.
// @description:fr       Offre l'accès aux liens du dark web même dans les navigateurs traditionnels et ajoute plusieurs options de moteurs de recherche alternatives à Google. Press CTRL+SPACE pour voir.
// @description:ru       Предоставляет доступ к ссылкам из глубокого интернета даже в обычных браузерах и добавляет различные альтернативные варианты поисковых систем к Google. Нажмите CTRL+SPACE для просмотра.
// @description:ja       通常のブラウザでもディープウェブのリンクにアクセスでき、Googleにさまざまな代替検索エンジンオプションを追加します。 CTRL+SPACE を押して表示します。
// @description:ko       일반 브라우저에서도 딥 웹 링크에 액세스하고 Google에 여러 가지 대체 검색 엔진 옵션을 추가합니다. CTRL+SPACE를 눌러보세요.
// @description:zh-TW    即使在常用瀏覽器中，也可存取深層網絡連結，並將多種替代搜索引擎選擇新增至 Google。 按下 CTRL+SPACE 以查看。
// @description:zh-CN    即使在常用浏览器中，也可以访问深网链接，并为 Google 添加各种替代搜索引擎选项。 按 CTRL+SPACE 查看。
// @description:id       Memberikan akses ke tautan web dalam web dalam bahkan di browser reguler dan menambahkan berbagai pilihan mesin pencari alternatif ke Google. Tekan CTRL+SPACE untuk melihatnya.
// @description:ug       دېپ وېب باغچىسىغا كۆرۈنىش كۆپ جانلىق براۋۋەرلەردەمەس ئاكسېس بېرىدۇ ۋە گوغۇلغا كۆپ ئۇچۇر يوللىغۇچى تاللانمىلىرى قوشىدۇ. كۆرۈش ئۇچۇن CTRL+SPACE نى بېسىڭ.
// @description:ar       يمنح الوصول إلى روابط الإنترنت العميقة حتى في المتصفحات العادية ويضيف العديد من خيارات محركات البحث البديلة إلى جوجل. اضغط CTRL+SPACE للعرض.
// @description:he       נותן גישה לקישורים ברשת העמוקה אפילו בדפדפנים רגילים ומוסיף אפשרויות מנועי חיפוש אלטרנטיביות שונות לגוגל. לחץ CTRL+SPACE להצגה.
// @description:hi       नियमित ब्राउज़रों में भी गहरे वेब लिंकों तक पहुँच प्रदान करता है और गूगल में विभिन्न वैकल्पिक खोज इंजन विकल्प जोड़ता है। देखने के लिए CTRL+SPACE दबाएं।
// @description:th       ให้การเข้าถึงลิงก์เว็บดีพไปยังเบราว์เซอร์ทั่วไปและเพิ่มตัวเลือกเครื่องมือค้นหาทางเลือกไปยัง Google หลายตัวเสมอ กด CTRL+SPACE เพื่อดู
// @description:bg       Осигурява достъп до връзки от дълбокия уеб дори и в обикновени браузъри и добавя различни алтернативни опции за търсене към Google. Натиснете CTRL+SPACE, за да видите.
// @description:ro       Oferă acces la link-uri din dark web chiar și în browserele obișnuite și adaugă diverse opțiuni alternative de căutare la Google. Apăsați CTRL+SPACE pentru a le vizualiza.
// @description:fi       Tarjoaa pääsyn syvän verkon linkkeihin jopa tavallisissa selaimissa ja lisää useita vaihtoehtoisia hakukonevaihtoehtoja Googleen. Paina CTRL+SPACE nähdäksesi.
// @description:it       Concede accesso ai link del web profondo anche nei browser comuni e aggiunge varie opzioni di motori di ricerca alternative a Google. Premi CTRL+SPACE per visualizzarla.
// @description:el       Παρέχει πρόσβαση σε σύνδεσμους deep web ακόμα και σε κανονικούς περιηγητές και προσθέτει διάφορες εναλλακτικές επιλογές μηχανών αναζήτησης στη Google. Πατήστε CTRL+SPACE για προβολή.
// @description:eo       Donas aliron al profundaj retligiloj eĉ en regulaj retumiloj kaj aldonas diversajn alternativajn serĉmotorajn opciojn al Google. Premu CTRL+SPACE por vidi.
// @description:hu       Hozzáférést biztosít a deep web linkekhez akár a szokásos böngészőkben is, és különböző alternatív keresőmotor lehetőségeket ad a Google-hoz. Nyomd meg a CTRL+SPACE-t a megtekintéshez.
// @description:nb       Gir tilgang til dypvebslenker selv i vanlige nettlesere og legger til ulike alternative søkemotoralternativer til Google. Trykk CTRL+SPACE for å se.
// @description:sk       Poskytuje prístup k odkazom deep webu dokonca aj v bežných prehliadačích a pridáva rôzne alternatívne možnosti vyhľadávania k Google. Stlačte CTRL+SPACE pre zobrazenie.
// @description:sv       Ger åtkomst till djupa webblänkar även i vanliga webbläsare och lägger till olika alternativa sökmotoralternativ till Google. Tryck CTRL+SPACE för att visa.
// @description:sr       Omogućava pristup linkovima dubokog veba čak i u običnim pregledačima i dodaje različite alternative za pretraživanje na Google-u. Pritisnite CTRL+SPACE da biste videli.
// @description:pl       Zapewnia dostęp do linków z dark web nawet w zwykłych przeglądarkach i dodaje różne alternatywne opcje wyszukiwania do Google. Naciśnij CTRL+SPACE, aby zobaczyć.
// @description:nl       Biedt toegang tot deep web-links zelfs in reguliere browsers en voegt verschillende alternatieve zoekmachine-opties toe aan Google. Druk op CTRL+SPACE om te bekijken.
// @description:de       Gewährt Zugriff auf Deep-Web-Links auch in herkömmlichen Browsern und fügt verschiedene alternative Suchmaschinenoptionen zu Google hinzu. Drücken Sie CTRL+SPACE, um sie anzuzeigen.
// @description:da       Giver adgang til dybe weblinks selv i almindelige browsere og tilføjer forskellige alternative søgemaskineindstillinger til Google. Tryk på CTRL+SPACE for at se.
// @description:cs       Poskytuje přístup k odkazům deep webu dokonce i v běžných prohlížečích a přidává různé alternativní možnosti vyhledávání do Google. Stiskněte CTRL+SPACE pro zobrazení.
// @description:uk       Забезпечує доступ до посилань з глибокої мережі навіть у звичайних браузерах та додає різноманітні альтернативні опції пошуку до Google. Натисніть CTRL+SPACE, щоб переглянути.
// @description:tr       Normal tarayıcılarda bile derin web bağlantılarına erişim sağlar ve Google'a çeşitli alternatif arama motoru seçenekleri ekler. Görmek için CTRL+SPACE'ye basın.
// @description:vi       Cung cấp truy cập vào các liên kết deep web ngay cả trong các trình duyệt thông thường và thêm nhiều lựa chọn công cụ tìm kiếm thay thế vào Google. Nhấn CTRL+SPACE để xem.
// @description:fr-CA    Offre l'accès aux liens du dark web même dans les navigateurs traditionnels et ajoute plusieurs options de moteurs de recherche alternatives à Google. Press CTRL+SPACE pour voir.

// @match        *://*/*
// @exclude      https://www.searchencrypt.com/*
// @exclude      https://2lingual.com/*
// @exclude      https://www.youtube-nocookie.com/*
// @exclude      https://yewtu.be/watch?v=*
// @exclude      https://riservato-xyz.frama.io/*

// @grant        none
// @icon         data:image/png;base64,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
// @license      MIT

// @grant        GM_xmlhttpRequest

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/479991/Barra%20de%20Pesquisa%20Extra%20%2B%20Deep%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/479991/Barra%20de%20Pesquisa%20Extra%20%2B%20Deep%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';

  let barX = false;

  function startBar(){

      // Cria a barra de pesquisa
      const searchContainer = document.createElement('div');
      searchContainer.style.position = 'fixed';
      searchContainer.style.width = '100%';
      searchContainer.style.height = 'auto';
      searchContainer.title = 'toggle bar: CTRL+SPACE';
      searchContainer.style.borderBottom = 'solid 1px rgb(129, 133, 142)';
      searchContainer.style.padding = '3px';
      searchContainer.style.top = '0';
      searchContainer.style.left = '50%';
      searchContainer.style.right = '50%';
      searchContainer.style.transform = 'translate(-50%, 0px)';
      searchContainer.style.zIndex = '99999';
      searchContainer.style.display = 'list-item';
      searchContainer.style.alignItems = 'center';
      searchContainer.style.textAlign = 'center';
      searchContainer.style.backgroundColor = 'rgb(16, 24, 32)';
      searchContainer.style.display = "none";

    document.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === " ") {
            toggleBar();
        }
    });

    function toggleBar() {
        console.log("Ctrl+X foi pressionado!");
        if(barX == false){
          barX = true;
          searchContainer.style.display = "initial";
            document.body.style.marginTop = "35px";
        }else{
          barX = false;
          searchContainer.style.display = "none";
          document.body.style.marginTop = "0px";
        }

    }



      // Adiciona a opção Google
      const googleButton = document.createElement('button');
      googleButton.title = "Search on Google";
      googleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
          <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
        </svg>`;
      googleButton.className = 'btnBarscript';
      googleButton.style.margin = 'auto';
      googleButton.style.height = '28px';
      googleButton.style.width = '32px';
      googleButton.style.margin = '0px 5px';
      googleButton.style.padding = '0px 7px';
      googleButton.style.backgroundColor = '#000';
      googleButton.style.color = 'rgb(236, 236, 236)';
      googleButton.style.border = 'solid 1px #46555e';
      googleButton.style.borderRadius = '6px';
      googleButton.addEventListener('mouseover', function() {
        googleButton.style.color = '#dcdcdc';
        googleButton.style.backgroundColor = 'rgb(13, 11, 21)';
        googleButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      googleButton.addEventListener('mouseout', function() {
        googleButton.style.color = 'rgb(236, 236, 236)';
        googleButton.style.backgroundColor = '#000';
        googleButton.style.border = '1px solid #46555e';
      });
      googleButton.addEventListener('click', function() {
          const query = prompt('Search on Google');
          if (query !== null) {
              window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(googleButton);


      // Adiciona a opção Yahoo
      const yahooButton = document.createElement('button');
      yahooButton.title = "Search on Yahoo";
      yahooButton.innerHTML = `<svg fill="#ffffff" version="1.1" width="14" height="14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="7935ec95c421cee6d86eb22ecd134b83"> <path style="display: inline; fill-rule: evenodd; clip-rule: evenodd;" d="M496.622,161.516l-58.309,12.424 c-8.666,2.454-32.237,19.813-73.159,53.318c-43.42,34.737-65.752,57.049-69.465,68.233l-2.48,30.997l-1.25,18.627l4.963,47.106 l76.898,1.231l-1.24,23.563H247.315l-111.635,1.259l3.74-22.34l35.955-1.231c18.618-1.25,29.792-3.713,33.505-7.462 c2.463-2.444,3.713-17.332,3.713-43.395v-16.1l-1.25-32.256c-2.463-7.453-22.335-34.728-60.766-81.87 c-39.682-48.356-65.743-76.908-78.14-86.843L0.5,116.863V95.764c3.712-2.463,43.412-2.463,116.589-1.223 c50.842-1.241,93.018-1.241,126.509,1.223l-2.481,17.405l-75.649,7.426c23.54,34.718,59.531,83.12,107.891,143.872 c63.271-48.392,96.73-79.379,97.98-93.008l-64.493-9.942l-4.963-22.313h107.905l101.711,1.24L496.622,161.516L496.622,161.516z"> </path> </g> </g></svg>`;
      yahooButton.className = 'btnBarscript';
      yahooButton.style.margin = 'auto';
      yahooButton.style.height = '28px';
      yahooButton.style.width = '32px';
      yahooButton.style.margin = '0px 5px';
      yahooButton.style.padding = '0px 7px';
      yahooButton.style.backgroundColor = '#000';
      yahooButton.style.color = 'rgb(236, 236, 236)';
      yahooButton.style.border = 'solid 1px #46555e';
      yahooButton.style.borderRadius = '6px';
      yahooButton.addEventListener('mouseover', function() {
        yahooButton.style.color = '#dcdcdc';
        yahooButton.style.backgroundColor = 'rgb(13, 11, 21)';
        yahooButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      yahooButton.addEventListener('mouseout', function() {
        yahooButton.style.color = 'rgb(236, 236, 236)';
        yahooButton.style.backgroundColor = '#000';
        yahooButton.style.border = '1px solid #46555e';
      });
      yahooButton.addEventListener('click', function() {
          const query = prompt('Search on Yahoo');
          if (query !== null) {
              window.location.href = 'https://search.yahoo.com/search;?p=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(yahooButton);


     // Adiciona a opção Brave
      const braveButton = document.createElement('button');
      braveButton.title = "Search on Brave";
      braveButton.innerHTML = `<svg fill="#ffffff" width="14" height="14" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m15.68 0 2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633a186.42 186.42 0 0 1-4.293 2.916c-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 0 1-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z"></path></g></svg>`;
      braveButton.className = 'btnBarscript';
      braveButton.style.margin = 'auto';
      braveButton.style.height = '28px';
      braveButton.style.width = '32px';
      braveButton.style.margin = '0px 5px';
      braveButton.style.padding = '0px 7px';
      braveButton.style.backgroundColor = '#000';
      braveButton.style.color = 'rgb(236, 236, 236)';
      braveButton.style.border = 'solid 1px #46555e';
      braveButton.style.borderRadius = '6px';
      braveButton.addEventListener('mouseover', function() {
        braveButton.style.color = '#dcdcdc';
        braveButton.style.backgroundColor = 'rgb(13, 11, 21)';
        braveButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      braveButton.addEventListener('mouseout', function() {
        braveButton.style.color = 'rgb(236, 236, 236)';
        braveButton.style.backgroundColor = '#000';
        braveButton.style.border = '1px solid #46555e';
      });
      braveButton.addEventListener('click', function() {
          const query = prompt('Search on Brave');
          if (query !== null) {
              window.location.href = 'https://search.brave.com/search?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(braveButton);



      // Adiciona a opção Bing
      const bingButton = document.createElement('button');
      bingButton.title = "Search on Bing";
      bingButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bing" viewBox="0 0 16 16">
        <path d="M8.35 5.046a.615.615 0 0 0-.54.575c-.009.13-.006.14.289.899.67 1.727.833 2.142.86 2.2q.101.215.277.395c.089.092.148.141.247.208.176.117.262.15.944.351.664.197 1.026.327 1.338.482.405.201.688.43.866.7.128.195.242.544.291.896.02.137.02.44 0 .564-.041.27-.124.495-.252.684-.067.1-.044.084.055-.039.278-.346.562-.938.707-1.475a4.42 4.42 0 0 0-2.14-5.028 70 70 0 0 0-.888-.465l-.53-.277-.353-.184c-.16-.082-.266-.138-.345-.18-.368-.192-.523-.27-.568-.283a1 1 0 0 0-.194-.03z"/>
        <path d="M9.152 11.493a3 3 0 0 0-.135.083 320 320 0 0 0-1.513.934l-.8.496c-.012.01-.587.367-.876.543a1.9 1.9 0 0 1-.732.257c-.12.017-.349.017-.47 0a1.9 1.9 0 0 1-.884-.358 2.5 2.5 0 0 1-.365-.364 1.9 1.9 0 0 1-.34-.76 1 1 0 0 0-.027-.121c-.005-.006.004.092.022.22.018.132.057.324.098.489a4.1 4.1 0 0 0 2.487 2.796c.359.142.72.23 1.114.275.147.016.566.023.72.011a4.1 4.1 0 0 0 1.956-.661l.235-.149.394-.248.258-.163 1.164-.736c.51-.32.663-.433.9-.665.099-.097.248-.262.255-.283.002-.005.028-.046.059-.091a1.64 1.64 0 0 0 .25-.682c.02-.124.02-.427 0-.565a3 3 0 0 0-.213-.758c-.15-.314-.47-.6-.928-.83a2 2 0 0 0-.273-.12c-.006 0-.433.26-.948.58l-1.113.687z"/>
        <path d="m3.004 12.184.03.129c.089.402.245.693.515.963a1.82 1.82 0 0 0 1.312.543c.361 0 .673-.09.994-.287l.472-.29.373-.23V5.334c0-1.537-.003-2.45-.008-2.521a1.82 1.82 0 0 0-.535-1.177c-.097-.096-.18-.16-.427-.33L4.183.24c-.239-.163-.258-.175-.33-.2a.63.63 0 0 0-.842.464c-.009.042-.01.603-.01 3.646l.003 8.035Z"/>
      </svg>
      `;
      bingButton.className = 'btnBarscript';
      bingButton.style.margin = 'auto';
      bingButton.style.height = '28px';
      bingButton.style.width = '32px';
      bingButton.style.margin = '0px 5px';
      bingButton.style.padding = '0px 7px';
      bingButton.style.backgroundColor = '#000';
      bingButton.style.color = 'rgb(236, 236, 236)';
      bingButton.style.border = 'solid 1px #46555e';
      bingButton.style.borderRadius = '6px';
      bingButton.addEventListener('mouseover', function() {
        bingButton.style.color = '#dcdcdc';
        bingButton.style.backgroundColor = 'rgb(13, 11, 21)';
        bingButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      bingButton.addEventListener('mouseout', function() {
        bingButton.style.color = 'rgb(236, 236, 236)';
        bingButton.style.backgroundColor = '#000';
        bingButton.style.border = '1px solid #46555e';
      });
      bingButton.addEventListener('click', function() {
          const query = prompt('Search on Bing');
          if (query !== null) {
              window.location.href = 'https://www.bing.com/search?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(bingButton);



      // Adiciona a opção DuckDuckGo
      const duckduckButton = document.createElement('button');
      duckduckButton.title = "Search on DuckDuckGo";
      duckduckButton.innerHTML = `
       <svg viewBox="0 0 512.00 512.00" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ffffff" stroke="#ffffff" stroke-width="0.00512"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#fff" d="M208.5 16.44l8.4 58.01c2.3 10.1 6.7 18.63 18.4 28.35-14.5 2.6-23.1 1.1-29.8-2C116.3 140 51.75 263.3 33.71 409.3c-1.63 12 13.75-2.6 26.92-9.8.26-1.9.54-3.8.85-5.7 7.7-47.9 30.82-104.6 56.62-149.2 12.8-22.2 26.3-41.3 39.4-54.8 6.5-6.8 12.9-12.2 19.5-15.8 5-2.7 10.3-4.5 15.8-4.4 1.8 0 3.6.2 5.5.7 8.3 2.2 14.4 8.6 18.6 16.2 4.2 7.6 7.1 17 9.3 27.8 4.4 21.7 6 49.5 6.3 79.9.5 54.4-3.3 117-4.3 163.4 10 14.2 21.5 38.1 27.2 38 6.3-.1 18.8-21.8 29.8-35-6.9-43.7-12.1-107.1-11.1-162.9.6-30.2 3-58.1 8.3-79.8 2.7-10.9 6-20.2 10.7-27.8 4.7-7.6 11.3-13.7 19.9-15.6 1.6-.4 3.2-.5 4.8-.5h1.6c6.4.2 12.6 2.8 18 6.6 7.2 5.1 13.8 12.4 20.2 21.4 12.8 18 25.2 42.8 37 70.9 20.4 48.5 39 106.2 52.6 151.1 14.8 11.7 33.5 32.7 31 16-15.4-112.4-73.2-279-157.3-333.9-7.1 3.8-15.8 6-31.9 3.1 9.2-7.6 13.9-14.53 16.6-22.02l1.1-70.74zm-16 171.16c-1.5 0-3.7.5-6.8 2.2-4.2 2.3-9.6 6.6-15.3 12.5-11.4 11.8-24.4 30-36.7 51.4-24.4 42.1-46.64 97-54.12 140.9 33.62-3 77.42 7.4 131.02 46.9 1.5-44.7 4.4-99.3 3.9-147.1-.3-29.9-2-57-5.9-76.5-2-9.8-4.6-17.6-7.4-22.7-2.8-5.1-5.3-6.9-7.5-7.5-.3-.1-.7-.1-1.2-.1zm126.3 4.3c-.7 0-1.3.1-2 .2-2.5.5-5.2 2.5-8.4 7.5-3.1 5-6.1 12.8-8.5 22.6-4.8 19.4-7.2 46.4-7.8 75.9-.9 50 3.5 107.4 9.4 149.2 53-32.9 90.7-41 123.9-33.1-12.9-42-29.6-92.1-47.4-134.3-11.5-27.4-23.7-51.5-35.1-67.4-5.7-8-11.2-13.9-15.8-17.1-3.5-2.5-6.1-3.4-8.3-3.5z"></path></g></svg>
      `;
      duckduckButton.className = 'btnBarscript';
      duckduckButton.style.margin = 'auto';
      duckduckButton.style.height = '28px';
      duckduckButton.style.width = '32px';
      duckduckButton.style.margin = '0px 5px';
      duckduckButton.style.padding = '0px 7px';
      duckduckButton.style.backgroundColor = '#000';
      duckduckButton.style.color = 'rgb(236, 236, 236)';
      duckduckButton.style.border = 'solid 1px #46555e';
      duckduckButton.style.borderRadius = '6px';
      duckduckButton.addEventListener('mouseover', function() {
        duckduckButton.style.color = '#dcdcdc';
        duckduckButton.style.backgroundColor = 'rgb(13, 11, 21)';
        duckduckButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      duckduckButton.addEventListener('mouseout', function() {
        duckduckButton.style.color = 'rgb(236, 236, 236)';
        duckduckButton.style.backgroundColor = '#000';
        duckduckButton.style.border = '1px solid #46555e';
      });
      duckduckButton.addEventListener('click', function() {
          const query = prompt('Search on DuckDuckGo');
          if (query !== null) {
              window.location.href = 'https://duckduckgo.com/?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(duckduckButton);




      // Adiciona a opção Yandex
      const yandexButton = document.createElement('button');
      yandexButton.title = "Search on Yandex";
      yandexButton.innerHTML = `<svg fill="#ffffff" viewBox="-6 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m7.083 14.8-4.098 9.2h-2.986l4.5-9.834c-2.114-1.074-3.525-3.018-3.525-6.614-.005-5.034 3.185-7.551 6.979-7.551h3.858v24h-2.582v-9.2h-2.146zm2.147-12.62h-1.378c-2.08 0-4.097 1.378-4.097 5.372 0 3.858 1.847 5.1 4.097 5.1h1.378z"></path></g></svg>`;
      yandexButton.className = 'btnBarscript';
      yandexButton.style.margin = 'auto';
      yandexButton.style.height = '28px';
      yandexButton.style.margin = '0px 4px';
      yandexButton.style.padding = '3px 7px';
      yandexButton.style.fontSize = '.85rem';
      yandexButton.style.backgroundColor = '#000';
      yandexButton.style.color = 'rgb(236, 236, 236)';
      yandexButton.style.border = 'solid 1px #46555e';
      yandexButton.style.borderRadius = '6px';
      yandexButton.addEventListener('mouseover', function() {
        yandexButton.style.color = '#dcdcdc';
        yandexButton.style.backgroundColor = 'rgb(13, 11, 21)';
        yandexButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      yandexButton.addEventListener('mouseout', function() {
        yandexButton.style.color = 'rgb(236, 236, 236)';
        yandexButton.style.backgroundColor = '#000';
        yandexButton.style.border = '1px solid #46555e';
      });
      yandexButton.addEventListener('click', function() {
          const query = prompt('Search on Yandex');
          if (query !== null) {
              window.location.href = 'https://yandex.com/search/?text=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(yandexButton);





      // Adiciona a opção Google Scholar
      const academyButton = document.createElement('button');
      academyButton.title = "Search on Google Scholar";
      academyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-mortarboard-fill" viewBox="0 0 16 16">
        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z"/>
        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z"/>
      </svg>
      `;
      academyButton.className = 'btnBarscript';
      academyButton.style.margin = 'auto';
      academyButton.style.height = '28px';
      academyButton.style.width = '32px';
      academyButton.style.margin = '0px 5px';
      academyButton.style.padding = '0px 7px';
      academyButton.style.backgroundColor = '#000';
      academyButton.style.color = 'rgb(236, 236, 236)';
      academyButton.style.border = 'solid 1px #46555e';
      academyButton.style.borderRadius = '6px';
      academyButton.addEventListener('mouseover', function() {
        academyButton.style.color = '#dcdcdc';
        academyButton.style.backgroundColor = 'rgb(13, 11, 21)';
        academyButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      academyButton.addEventListener('mouseout', function() {
        academyButton.style.color = 'rgb(236, 236, 236)';
        academyButton.style.backgroundColor = '#000';
        academyButton.style.border = '1px solid #46555e';
      });
      academyButton.addEventListener('click', function() {
          const query = prompt('Search on Google Scholar');
          if (query !== null) {
              window.location.href = 'https://scholar.google.com.br/scholar?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(academyButton);



     // Adiciona a opção Wolframalpha
      const alphaButton = document.createElement('button');
      alphaButton.title = "Search on Wolframalpha";
      alphaButton.innerHTML = `
      <svg fill="#ffffff" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>Wolfram icon</title><path d="M20.105 12.001l3.307-3.708-4.854-1.059.495-4.944-4.55 1.996L12 0 9.495 4.287 4.947 2.291l.494 4.944L.587 8.289l3.305 3.707-3.305 3.713 4.854 1.053-.5 4.945 4.553-1.994L12 24l2.504-4.287 4.55 1.994-.495-4.938 4.854-1.06-3.308-3.708zm1.605 2.792l-2.861-.982-1.899-2.471 2.526.942 2.234 2.511zm.459-6.096l-2.602 2.918-3.066-1.141 1.844-2.612 3.824.835zm-4.288-1.324l-1.533 2.179.088-3.162 1.788-2.415-.343 3.398zm-3.304-2.399l3.091-1.354L15.9 5.998l-2.943 1.049 1.62-2.073zm1.187 1.772l-.096 3.652-3.341 1.12V7.969l3.437-1.223zM12 1.308l1.969 3.371L12 7.199l-1.971-2.521L12 1.308zM9.423 4.974l1.619 2.072-2.948-1.048L6.332 3.62l3.091 1.354zm2.245 2.995v3.549l-3.335-1.12-.102-3.652 3.437 1.223zM7.564 6.39l.086 3.162-1.532-2.179-.341-3.397L7.564 6.39zM1.83 8.692l3.824-.83 1.839 2.612-3.065 1.136L1.83 8.692zm2.694 3.585l2.526-.937-1.9 2.471-2.861.977 2.235-2.511zm-2.093 3.159l2.929-1 3.045.896-2.622.837-3.352-.733zm3.28 5.212l.392-3.896 3.111-.982.082 3.31-3.585 1.568zm3.691-5.708l-3.498-1.03 2.226-2.892 3.335 1.126-2.063 2.796zm2.266 7.191l-1.711-2.934-.066-2.771 1.777 2.597v3.108zm-1.73-6.8L12 12.532l2.063 2.799L12 18.336l-2.062-3.005zm4.104 3.866l-1.715 2.934v-3.107l1.782-2.597-.067 2.77zm-1.514-7.052l3.341-1.126 2.221 2.892-3.499 1.03-2.063-2.796zm2.175 6.935l.077-3.31 3.116.982.386 3.901-3.579-1.573zm3.514-2.912l-2.625-.837 3.049-.896 2.928 1.003-3.352.73z"></path></g></svg>
      `;
      alphaButton.className = 'btnBarscript';
      alphaButton.style.margin = 'auto';
      alphaButton.style.height = '28px';
      alphaButton.style.width = '32px';
      alphaButton.style.margin = '0px 5px';
      alphaButton.style.padding = '0px 7px';
      alphaButton.style.backgroundColor = '#000';
      alphaButton.style.color = 'rgb(236, 236, 236)';
      alphaButton.style.border = 'solid 1px #46555e';
      alphaButton.style.borderRadius = '6px';
      alphaButton.addEventListener('mouseover', function() {
        alphaButton.style.color = '#dcdcdc';
        alphaButton.style.backgroundColor = 'rgb(13, 11, 21)';
        alphaButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      alphaButton.addEventListener('mouseout', function() {
        alphaButton.style.color = 'rgb(236, 236, 236)';
        alphaButton.style.backgroundColor = '#000';
        alphaButton.style.border = '1px solid #46555e';
      });
      alphaButton.addEventListener('click', function() {
          const query = prompt('Search on Wolframalpha');
          if (query !== null) {
              window.location.href = 'https://www.wolframalpha.com/input?i=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(alphaButton);



      // Adiciona a opção SearX
      const searxButton = document.createElement('button');
      searxButton.title = "Search on SearX (TI)";
      searxButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>`;
      searxButton.className = 'btnBarscript';
      searxButton.style.margin = 'auto';
      searxButton.style.height = '28px';
      searxButton.style.width = '32px';
      searxButton.style.margin = '0px 5px';
      searxButton.style.padding = '0px 7px';
      searxButton.style.backgroundColor = '#000';
      searxButton.style.color = 'rgb(236, 236, 236)';
      searxButton.style.border = 'solid 1px #46555e';
      searxButton.style.borderRadius = '6px';
      searxButton.addEventListener('mouseover', function() {
        searxButton.style.color = '#dcdcdc';
        searxButton.style.backgroundColor = 'rgb(13, 11, 21)';
        searxButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      searxButton.addEventListener('mouseout', function() {
        searxButton.style.color = 'rgb(236, 236, 236)';
        searxButton.style.backgroundColor = '#000';
        searxButton.style.border = '1px solid #46555e';
      });
      searxButton.addEventListener('click', function() {
          const query = prompt('Search on SearX (TI)');
          if (query !== null) {
              window.location.href = 'https://searx.org/search?q=' + encodeURIComponent(query.toLowerCase()) + '&categories=it&language=auto';
          }
      });
      searchContainer.appendChild(searxButton);



     // Adiciona a opção Archive
      const archiveButton = document.createElement('button');
      archiveButton.title = "Search on Archive (Wayback Machine)";
      archiveButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
          <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z"/>
        </svg>
      `;
      archiveButton.className = 'btnBarscript';
      archiveButton.style.margin = 'auto';
      archiveButton.style.height = '28px';
      archiveButton.style.margin = '0px 4px';
      archiveButton.style.padding = '3px 7px';
      archiveButton.style.backgroundColor = '#000';
      archiveButton.style.color = 'rgb(236, 236, 236)';
      archiveButton.style.border = 'solid 1px #46555e';
      archiveButton.style.borderRadius = '6px';
      archiveButton.addEventListener('mouseover', function() {
        archiveButton.style.color = '#dcdcdc';
        archiveButton.style.backgroundColor = 'rgb(13, 11, 21)';
        archiveButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      archiveButton.addEventListener('mouseout', function() {
        archiveButton.style.color = 'rgb(236, 236, 236)';
        archiveButton.style.backgroundColor = '#000';
        archiveButton.style.border = '1px solid #46555e';
      });
      archiveButton.addEventListener('click', function() {
          const query = prompt('Search on Archive (Wayback Machine)');
          if (query !== null) {
              window.location.href = 'https://web.archive.org/web/*/' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(archiveButton);



     // Adiciona a opção Google Translate
      const translateButton = document.createElement('button');
      translateButton.title = "Translate Text";
      translateButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
          <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
          <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
        </svg>`;
      translateButton.className = 'btnBarscript';
      translateButton.style.margin = 'auto';
      translateButton.style.height = '28px';
      translateButton.style.width = '32px';
      translateButton.style.margin = '0px 5px';
      translateButton.style.padding = '0px 7px';
      translateButton.style.backgroundColor = '#000';
      translateButton.style.color = 'rgb(236, 236, 236)';
      translateButton.style.border = 'solid 1px #46555e';
      translateButton.style.borderRadius = '6px';
      translateButton.addEventListener('mouseover', function() {
        translateButton.style.color = '#dcdcdc';
        translateButton.style.backgroundColor = 'rgb(13, 11, 21)';
        translateButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      translateButton.addEventListener('mouseout', function() {
        translateButton.style.color = 'rgb(236, 236, 236)';
        translateButton.style.backgroundColor = '#000';
        translateButton.style.border = '1px solid #46555e';
      });
      translateButton.addEventListener('click', function() {
          const query = prompt('Translate this text:');
          if (query !== null) {
              window.open(`https://translate.google.com.br/?text=${encodeURIComponent(query)}&op=translate`, '_blank');
          }
      });
      searchContainer.appendChild(translateButton);



      // Adiciona a opção Mojeek
      const mojeekButton = document.createElement('button');
      mojeekButton.title = "Search on Mojeek";
      mojeekButton.innerHTML = `<svg height="14px" width="14px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 18.791 18.791" xml:space="preserve" fill="#000" stroke="#000" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.11274599999999999"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#dcdcdc;" d="M11.825,7.402h2.21v9.044h4.756V2.345H0v14.101h4.689V7.402h2.245v9.044h2.178h0.536h2.178V7.402 H11.825z"></path> </g> </g></svg>`;
      mojeekButton.className = 'btnBarscript';
      mojeekButton.style.margin = 'auto';
      mojeekButton.style.height = '28px';
      mojeekButton.style.width = '32px';
      mojeekButton.style.margin = '0px 5px';
      mojeekButton.style.padding = '0px 7px';
      mojeekButton.style.backgroundColor = '#000';
      mojeekButton.style.border = 'solid 1px #46555e';
      mojeekButton.style.borderRadius = '6px';
      mojeekButton.addEventListener('mouseover', function() {
        mojeekButton.style.color = '#dcdcdc';
        mojeekButton.style.backgroundColor = 'rgb(13, 11, 21)';
        mojeekButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      mojeekButton.addEventListener('mouseout', function() {
        mojeekButton.style.color = 'rgb(236, 236, 236)';
        mojeekButton.style.backgroundColor = '#000';
        mojeekButton.style.border = '1px solid #46555e';
      });
      mojeekButton.addEventListener('click', function() {
          const query = prompt('Search on Mojeek');
          if (query !== null) {
              window.location.href = 'https://www.mojeek.com/search?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(mojeekButton);




      // Adiciona a opção MetaGer
      const metagerButton = document.createElement('button');
      metagerButton.title = "Search on MetaGer";
      metagerButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="currentColor" class="bi bi-key-fill" viewBox="0 0 16 16">
        <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
      </svg>`;
      metagerButton.className = 'btnBarscript';
      metagerButton.style.margin = 'auto';
      metagerButton.style.height = '28px';
      metagerButton.style.margin = '0px 4px';
      metagerButton.style.padding = '3px 7px';
      metagerButton.style.fontSize = '.85rem';
      metagerButton.style.backgroundColor = '#000';
      metagerButton.style.color = 'rgb(236, 236, 236)';
      metagerButton.style.border = 'solid 1px #46555e';
      metagerButton.style.borderRadius = '6px';
      metagerButton.addEventListener('mouseover', function() {
        metagerButton.style.color = '#dcdcdc';
        metagerButton.style.backgroundColor = 'rgb(13, 11, 21)';
        metagerButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      metagerButton.addEventListener('mouseout', function() {
        metagerButton.style.color = 'rgb(236, 236, 236)';
        metagerButton.style.backgroundColor = '#000';
        metagerButton.style.border = '1px solid #46555e';
      });
      metagerButton.addEventListener('click', function() {
          const query = prompt('Search on MetaGer');
          if (query !== null) {
              window.location.href = 'https://metager.org/meta/meta.ger3?eingabe=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(metagerButton);

      // Adiciona a opção Gibiru
      const gibiruButton = document.createElement('button');
      gibiruButton.title = "Search on Gibiru";
      gibiruButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
      <style>
        text {
          font-family: monospace;
          font-size: 65px;
          fill: white;
        }
      </style>
      <text x="12" y="60">G</text>
    </svg>
        `;
      gibiruButton.className = 'btnBarscript';
      gibiruButton.style.margin = 'auto';
      gibiruButton.style.width = '30px';
      gibiruButton.style.height = '28px';
      gibiruButton.style.margin = '0px 4px';
      gibiruButton.style.padding = '3px 7px';
      gibiruButton.style.fontSize = '.85rem';
      gibiruButton.style.backgroundColor = '#000';
      gibiruButton.style.color = 'rgb(236, 236, 236)';
      gibiruButton.style.border = 'solid 1px #46555e';
      gibiruButton.style.borderRadius = '6px';
      gibiruButton.addEventListener('mouseover', function() {
        gibiruButton.style.color = '#dcdcdc';
        gibiruButton.style.backgroundColor = 'rgb(13, 11, 21)';
        gibiruButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      gibiruButton.addEventListener('mouseout', function() {
        gibiruButton.style.color = 'rgb(236, 236, 236)';
        gibiruButton.style.backgroundColor = '#000';
        gibiruButton.style.border = '1px solid #46555e';
      });
      gibiruButton.addEventListener('click', function() {
          const query = prompt('Search on Gibiru');
          if (query !== null) {
              window.location.href = 'https://gibiru.com/results.html?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(gibiruButton);



      // Adiciona a opção Swisscows
      const swisscButton = document.createElement('button');
      swisscButton.title = "Search on Swisscows";
      swisscButton.innerHTML = `<svg height="14px" width="14px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#fff;} </style> <g> <path class="st0" d="M510.632,181.469c-9.274-31.534-54.288-17.473-77.889-14.844c-16.69,1.858-32.964,9.54-35.239-6.683 c-5.564-39.672-5.918-74.378-38.945-110.15c-22.254-24.101-47.882-1.184-38.944,16.69c18.548,50.071,12.371,90.874-63.616,90.874 c-75.987,0-82.164-40.803-63.616-90.874c8.937-17.874-16.69-40.791-38.944-16.69c-33.028,35.772-33.381,70.478-38.944,110.15 c-2.276,16.223-18.548,8.541-35.239,6.683c-23.601-2.629-68.614-16.69-77.888,14.844c-8.709,29.61,24.112,79.736,100.142,90.862 c11.127,7.422,5.563,200.285,154.489,200.285c148.927,0,143.363-192.863,154.49-200.285 C486.52,261.205,519.341,211.079,510.632,181.469z"></path> </g> </g></svg>`;
      swisscButton.className = 'btnBarscript';
      swisscButton.style.margin = 'auto';
      swisscButton.style.height = '28px';
      swisscButton.style.margin = '0px 4px';
      swisscButton.style.padding = '3px 7px';
      swisscButton.style.fontSize = '.85rem';
      swisscButton.style.backgroundColor = '#000';
      swisscButton.style.color = 'rgb(236, 236, 236)';
      swisscButton.style.border = 'solid 1px #46555e';
      swisscButton.style.borderRadius = '6px';
      swisscButton.addEventListener('mouseover', function() {
        swisscButton.style.color = '#dcdcdc';
        swisscButton.style.backgroundColor = 'rgb(13, 11, 21)';
        swisscButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      swisscButton.addEventListener('mouseout', function() {
        swisscButton.style.color = 'rgb(236, 236, 236)';
        swisscButton.style.backgroundColor = '#000';
        swisscButton.style.border = '1px solid #46555e';
      });
      swisscButton.addEventListener('click', function() {
          const query = prompt('Search on Swisscows');
          if (query !== null) {
              window.location.href = 'https://swisscows.com/pt/web?query=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(swisscButton);


    // Adiciona a opção Refseek
      const refseekButton = document.createElement('button');
      refseekButton.title = "Search on Refseek";
      refseekButton.innerHTML = `
      <svg fill="#ffffff" height="14px" width="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M13,9.41a10.46,10.46,0,0,1-2.53-.65A15.4,15.4,0,0,1,8.83,8a15.3,15.3,0,0,1,1.65-.76A9.61,9.61,0,0,1,13,6.6,1.45,1.45,0,0,0,14,6a1.43,1.43,0,0,0-2.34-1.66h0A9,9,0,0,1,9.85,6.24a15.24,15.24,0,0,1-1.48,1,15.65,15.65,0,0,1,.17-1.8A10.5,10.5,0,0,1,9.25,3a1.41,1.41,0,0,0,0-1.17,1.41,1.41,0,0,0-1.82-.69A1.41,1.41,0,0,0,6.78,3a9.55,9.55,0,0,1,.71,2.52,15.53,15.53,0,0,1,.11,1.8,15.24,15.24,0,0,1-1.48-1A9.82,9.82,0,0,1,4.29,4.37a1.45,1.45,0,0,0-1-.57A1.41,1.41,0,0,0,3,6.6a9.64,9.64,0,0,1,2.52.65A14.61,14.61,0,0,1,7.18,8a15.4,15.4,0,0,1-1.65.75A10.5,10.5,0,0,1,3,9.41,1.39,1.39,0,0,0,2,10a1.41,1.41,0,0,0,2.21,1.74l.06-.09A10.39,10.39,0,0,1,6.12,9.77a15.11,15.11,0,0,1,1.47-1,13.54,13.54,0,0,1-.17,1.8A10,10,0,0,1,6.78,13a1.41,1.41,0,0,0,2.58,1.12,1.45,1.45,0,0,0,0-1.12,9.27,9.27,0,0,1-.7-2.52,13.43,13.43,0,0,1-.24-1.8,15.11,15.11,0,0,1,1.47,1,10.39,10.39,0,0,1,1.83,1.86,1.48,1.48,0,0,0,1,.58,1.41,1.41,0,0,0,.3-2.8Z"></path> </g> </g></svg>
      `
      refseekButton.className = 'btnBarscript';
      refseekButton.style.margin = 'auto';
      refseekButton.style.height = '28px';
      refseekButton.style.margin = '0px 4px';
      refseekButton.style.padding = '3px 7px';
      refseekButton.style.fontSize = '.85rem';
      refseekButton.style.backgroundColor = '#000';
      refseekButton.style.color = 'rgb(236, 236, 236)';
      refseekButton.style.border = 'solid 1px #46555e';
      refseekButton.style.borderRadius = '6px';
      refseekButton.addEventListener('mouseover', function() {
        refseekButton.style.color = '#dcdcdc';
        refseekButton.style.backgroundColor = 'rgb(13, 11, 21)';
        refseekButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      refseekButton.addEventListener('mouseout', function() {
        refseekButton.style.color = 'rgb(236, 236, 236)';
        refseekButton.style.backgroundColor = '#000';
        refseekButton.style.border = '1px solid #46555e';
      });
      refseekButton.addEventListener('click', function() {
          const query = prompt('Search on Refseek');
          if (query !== null) {
              window.location.href = 'https://www.refseek.com/search?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(refseekButton);



     // Adiciona a opção AHMIA
      const ahmiaButton = document.createElement('button');
      ahmiaButton.title = "AHMIA (deep web)";
      ahmiaButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
      </svg>`;
      ahmiaButton.className = 'btnBarscript';
      ahmiaButton.style.margin = 'auto';
      ahmiaButton.style.height = '28px';
      ahmiaButton.style.margin = '0px 4px';
      ahmiaButton.style.padding = '3px 7px';
      ahmiaButton.style.fontSize = '.85rem';
      ahmiaButton.style.backgroundColor = '#000';
      ahmiaButton.style.color = 'rgb(236, 236, 236)';
      ahmiaButton.style.border = '1px solid rgb(94, 49, 51)';
      ahmiaButton.style.borderRadius = '6px';
      ahmiaButton.style.textShadow = '1px .5px 3px #b30000';
      ahmiaButton.addEventListener('mouseover', function() {
        ahmiaButton.style.color = '#dcdcdc';
        ahmiaButton.style.backgroundColor = 'rgb(13, 11, 21)';
        ahmiaButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      ahmiaButton.addEventListener('mouseout', function() {
        ahmiaButton.style.color = 'rgb(236, 236, 236)';
        ahmiaButton.style.backgroundColor = '#000';
        ahmiaButton.style.border = '1px solid rgb(94, 49, 51)';
      });
      ahmiaButton.addEventListener('click', function() {
          const query = prompt('Search on Ahmia (deep web)');
          if (query !== null) {
              window.location.href = 'https://ahmia.fi/search/?q=' + encodeURIComponent(query.toLowerCase());
          }
      });
      searchContainer.appendChild(ahmiaButton);


      // Adiciona a opção The Deep Searches
      const deepButton = document.createElement('button');
      deepButton.title = "Deep Searches (deep web)";
      deepButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-globe2" viewBox="0 0 16 16">
        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
      </svg>`;
      deepButton.className = 'btnBarscript';
      deepButton.style.margin = 'auto';
      deepButton.style.height = '28px';
      deepButton.style.margin = '0px 4px';
      deepButton.style.padding = '3px 7px';
      deepButton.style.fontSize = '.85rem';
      deepButton.style.backgroundColor = '#000';
      deepButton.style.color = 'rgb(236, 236, 236)';
      deepButton.style.border = '1px solid rgb(94, 49, 51)';
      deepButton.style.borderRadius = '6px';
      deepButton.style.textShadow = '1px .5px 3px #b30000';
      deepButton.addEventListener('mouseover', function() {
        deepButton.style.color = '#dcdcdc';
        deepButton.style.backgroundColor = 'rgb(13, 11, 21)';
        deepButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      deepButton.addEventListener('mouseout', function() {
        deepButton.style.color = 'rgb(236, 236, 236)';
        deepButton.style.backgroundColor = '#000';
        deepButton.style.border = '1px solid rgb(94, 49, 51)';
      });
      deepButton.addEventListener('click', function() {
        window.open('http://searchgf7gdtauh7bhnbyed4ivxqmuoat3nm6zfrg3ymkq6mtnpye3ad.onion.ly/', '_blank');
      });
      searchContainer.appendChild(deepButton);


      // Adiciona a opção Search StartPage
      const startButton = document.createElement('button');
      startButton.title = "Search in StartPage";
      startButton.innerHTML = 'StartPage';
      startButton.className = 'btnBarscript';
      startButton.style.margin = 'auto';
      startButton.style.height = '28px';
      startButton.style.margin = '0px 4px';
      startButton.style.padding = '0px 7px';
      startButton.style.fontSize = '.80rem';
      startButton.style.backgroundColor = 'rgb(21, 19, 28)';
      startButton.style.color = 'rgb(236, 236, 236)';
      startButton.style.border = 'solid 1px rgb(89, 113, 128)';
      startButton.style.borderRadius = '6px';
      startButton.addEventListener('mouseover', function() {
        startButton.style.color = '#dcdcdc';
        startButton.style.backgroundColor = 'rgb(13, 11, 21)';
        startButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      startButton.addEventListener('mouseout', function() {
        startButton.style.color = 'rgb(236, 236, 236)';
        startButton.style.backgroundColor = 'rgb(21, 19, 28)';
        startButton.style.border = 'solid 1px rgb(89, 113, 128)';
      });
      startButton.addEventListener('click', function() {
        window.open('https://www.startpage.com/', '_blank');
      });
      searchContainer.appendChild(startButton);


      // Adiciona a opção Search Encrypt
      const encryptButton = document.createElement('button');
      encryptButton.title = "Search in Encrypt";
      encryptButton.innerHTML = 'Encrypt';
      encryptButton.className = 'btnBarscript';
      encryptButton.style.margin = 'auto';
      encryptButton.style.height = '28px';
      encryptButton.style.margin = '0px 4px';
      encryptButton.style.padding = '0px 7px';
      encryptButton.style.fontSize = '.80rem';
      encryptButton.style.backgroundColor = 'rgb(21, 19, 28)';
      encryptButton.style.color = 'rgb(236, 236, 236)';
      encryptButton.style.border = 'solid 1px rgb(89, 113, 128)';
      encryptButton.style.borderRadius = '6px';
      encryptButton.addEventListener('mouseover', function() {
        encryptButton.style.color = '#dcdcdc';
        encryptButton.style.backgroundColor = 'rgb(13, 11, 21)';
        encryptButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      encryptButton.addEventListener('mouseout', function() {
        encryptButton.style.color = 'rgb(236, 236, 236)';
        encryptButton.style.backgroundColor = 'rgb(21, 19, 28)';
        encryptButton.style.border = 'solid 1px rgb(89, 113, 128)';
      });
      encryptButton.addEventListener('click', function() {
        window.open('https://www.searchencrypt.com/home', '_blank');
      });
      searchContainer.appendChild(encryptButton);



      // Adiciona a opção Search 2lingual
      const lingualButton = document.createElement('button');
      lingualButton.title = "Search in 2lingual";
      lingualButton.innerHTML = '2lingual';
      lingualButton.className = 'btnBarscript';
      lingualButton.style.margin = 'auto';
      lingualButton.style.height = '28px';
      lingualButton.style.margin = '0px 4px';
      lingualButton.style.padding = '0px 7px';
      lingualButton.style.fontSize = '.80rem';
      lingualButton.style.backgroundColor = 'rgb(21, 19, 28)';
      lingualButton.style.color = 'rgb(236, 236, 236)';
      lingualButton.style.border = 'solid 1px rgb(89, 113, 128)';
      lingualButton.style.borderRadius = '6px';
      lingualButton.addEventListener('mouseover', function() {
        lingualButton.style.color = '#dcdcdc';
        lingualButton.style.backgroundColor = 'rgb(13, 11, 21)';
        lingualButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      lingualButton.addEventListener('mouseout', function() {
        lingualButton.style.color = 'rgb(236, 236, 236)';
        lingualButton.style.backgroundColor = 'rgb(21, 19, 28)';
        lingualButton.style.border = 'solid 1px rgb(89, 113, 128)';
      });
      lingualButton.addEventListener('click', function() {
        window.open('https://2lingual.com/', '_blank');
      });
      searchContainer.appendChild(lingualButton);


      // Adiciona a opção Search Symbolab
      const symbButton = document.createElement('button');
      symbButton.title = "Search in Symbolab";
      symbButton.innerHTML = 'Symb';
      symbButton.className = 'btnBarscript';
      symbButton.style.margin = 'auto';
      symbButton.style.height = '28px';
      symbButton.style.margin = '0px 4px';
      symbButton.style.padding = '0px 7px';
      symbButton.style.fontSize = '.80rem';
      symbButton.style.backgroundColor = 'rgb(21, 19, 28)';
      symbButton.style.color = 'rgb(236, 236, 236)';
      symbButton.style.border = 'solid 1px rgb(89, 113, 128)';
      symbButton.style.borderRadius = '6px';
      symbButton.addEventListener('mouseover', function() {
        symbButton.style.color = '#dcdcdc';
        symbButton.style.backgroundColor = 'rgb(13, 11, 21)';
        symbButton.style.border = '1px solid rgb(113, 155, 181)';
      });
      symbButton.addEventListener('mouseout', function() {
        symbButton.style.color = 'rgb(236, 236, 236)';
        symbButton.style.backgroundColor = 'rgb(21, 19, 28)';
        symbButton.style.border = 'solid 1px rgb(89, 113, 128)';
      });
      symbButton.addEventListener('click', function() {
        window.open('https://symbolab.com/', '_blank');
      });
      searchContainer.appendChild(symbButton);


      document.body.appendChild(searchContainer);

  }

  setTimeout(function(){
    startBar();
  },1200)


    // Encontrar todos os links na página e substitui por proxy .ly se for um domínio .onion
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.href.includes('.onion') && !link.href.includes('.onion.ly')) {
            if (link.href.includes('redirect_url=')) {
                const startIndex = link.href.indexOf('redirect_url=') + 13;
                const newHref = link.href.substring(startIndex).replace('.onion', '.onion.ly');
                link.href = newHref;
            } else {
                const newHref = link.href.replace('.onion', '.onion.ly');
                // Atualizar o href do link
                link.href = newHref;
            }
        }
    });

})();
