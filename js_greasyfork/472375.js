// ==UserScript==
// @namespace    http://linkme.bio/jhonpergon/?userscript=api_block
// @version      1.4
// @author       Jhon Pérgon

// @name         Não Pegue Meu IP
// @name:pt       Não Pegue Meu IP
// @name:es       No Obtengas Mi IP
// @name:en       Don't Get My IP
// @name:fr       Ne Prends Pas Mon IP
// @name:ru       Не бери мой IP
// @name:ja       IPを取得しないでください
// @name:ko       내 IP를 가져가지 마세요
// @name:zh-TW     不要获取我的IP
// @name:zh-CN     不要获取我的IP
// @name:id        Jangan Ambil IP Saya
// @name:ug        مېنىڭ ئۆزئىپىمنى قۇلۇپ قويما
// @name:ar        لا تأخذ عنوان IP الخاص بي
// @name:he        אל תקבל את כתובת ה-IP שלי
// @name:hi        मेरा IP मत लो
// @name:th        อย่าเก็บ IP ของฉัน
// @name:bg        Не взимайте моето IP
// @name:ro        Nu Luați IP-ul Meu
// @name:fi        Älä Hae Minun IP-osoitettani
// @name:it        Non Prendere Il Mio IP
// @name:el        Μην Πάρεις Την IP Μου
// @name:eo        Ne Prenu Mian IP
// @name:hu        Ne Vegyél El Az IP-címemet
// @name:nb        Ikke Hent Min IP
// @name:sk        Neberaj Moju IP
// @name:sv        Ta Inte Mitt IP
// @name:sr        Ne Uzimaj Moj IP
// @name:pl        Nie Bierz Mojego IP
// @name:nl        Pak Mijn IP Niet
// @name:de        Mein IP Nicht Abrufen
// @name:da        Tag Ikke Min IP
// @name:cs        Nezírej Moji IP
// @name:uk        Не Бери Мою IP
// @name:tr        IP'imi Alma
// @name:vi        Đừng Lấy IP Của Tôi
// @name:fr-CA     Ne Prends Pas Mon IP (Canada)

// @description         Impede a captura do endereço IP feita por solicitação de API externa.
// @description:pt      Impede a captura do endereço IP feita por solicitação de API externa.
// @description:es      Bloquea la captura de IP realizada por una solicitud de API externa.
// @description:en      Blocks the capture of the IP address done by an external API request.
// @description:fr      Bloque la capture de l'adresse IP effectuée par une demande d'API externe.
// @description:ru      Блокирует захват IP-адреса, сделанный внешним запросом API.
// @description:ja      外部APIリクエストによるIPアドレスのキャプチャをブロックします。
// @description:ko      외부 API 요청으로 수행 된 IP 주소 캡처를 차단합니다.
// @description:zh-TW   阻止外部API请求捕获IP地址。
// @description:zh-CN   阻止外部API请求捕获IP地址。
// @description:id       Mencegah penangkapan alamat IP yang dilakukan oleh permintaan API eksternal.
// @description:ug       سىرىقى API سورىسى تەرىپىدىن ئىشلىتىلغان IP ؛ىمىزنى قولۇپ قويىدۇ.
// @description:ar       يحظر التقاط عنوان IP الذي يتم بواسطة طلب API خارجي.
// @description:he       מונע את לכידת כתובת ה-IP שנעשית על ידי בקשת API חיצונית.
// @description:hi       एक्सटर्नल API अनुरोध द्वारा किए गए IP पता को ब्लॉक करता है।
// @description:th       บล็อกการจับ IP address ที่ทำโดยคำขอ API จากภายนอก
// @description:bg       Блокира заснемането на IP адрес, извършено чрез външна заявка към API.
// @description:ro       Blochează capturarea adresei IP efectuată prin cererea unei API externe.
// @description:fi       Estää IP-osoitteen kaappauksen, joka on tehty ulkoisen API-pyynnön kautta.
// @description:it       Blocca la cattura dell'indirizzo IP effettuata da una richiesta di API esterna.
// @description:el       Φράζει την καταγραφή της διεύθυνσης IP που πραγματοποιείται από εξωτερικό αίτημα API.
// @description:eo       Blokas la kaptadon de la IP-adreso farita per ekstera API peto.
// @description:hu       Blokkolja az IP-cím elkapását, amit külső API-kérés végzett.
// @description:nb       Blokkerer fangsten av IP-adressen utført av en ekstern API-forespørsel.
// @description:sk       Blokuje zachytávanie IP adresy vykonané externou požiadavkou API.
// @description:sv       Blockerar fångsten av IP-adressen som utförs av en extern API-begäran.
// @description:sr       Blokira hvatanje IP adrese izvršeno preko spoljnog API zahteva.
// @description:pl       Blokuje przechwytywanie adresu IP dokonywane przez zewnętrzne żądanie API.
// @description:nl       Blokkeert het vastleggen van het IP-adres dat wordt gedaan door een externe API-aanvraag.
// @description:de       Blockiert das Erfassen der IP-Adresse durch eine externe API-Anfrage.
// @description:da       Blokerer opfange IP-adressen udført af en ekstern API-forespørgsel.
// @description:cs       Blokuje zachycení IP adresy provedené externí žádostí o API.
// @description:uk       Блокує захоплення IP-адреси, здійснене зовнішньою запитом до API.
// @description:tr       Harici bir API isteği tarafından yapılan IP adresi yakalamayı engeller.
// @description:vi       Chặn việc thu thập địa chỉ IP thực hiện bởi yêu cầu API bên ngoài.
// @description:fr-CA   Bloque la capture de l'adresse IP effectuée par une demande d'API externe.

// @match        *://*/*
// @exclude      *://www.google.*
// @exclude      *://greasyfork.org/*
// @exclude      *://translate.google.*
// @exclude      *://www.google.it/*
// @exclude      https://www.youtube.com/*
// @exclude      https://m.youtube.com/*
// @exclude      https://music.youtube.com/*
// @exclude      https://youtu.be/*
// @exclude      https://accounts.youtube.com/*
// @exclude      https://www.youtube-nocookie.com/*
// @exclude      https://gmail.com/*
// @exclude      https://mail.google.com/*
// @exclude      https://github.com/*
// @exclude        https://www.facebook.com/*
// @exclude        https://facebook.com/*
// @exclude        https://m.facebook.com/*
// @exclude        https://wikipedia.org/*
// @exclude        https://web.whatsapp.com/*
// @exclude        https://instagram.com/*
// @exclude        https://x.com/*
// @exclude        https://twitter.com/*
// @exclude       *://www.bilibili.com/*
// @exclude       *://*.bilibili.com/*
// @exclude       *://s1.hdslb.com/*


// @grant        none
// @icon         data:image/png;base64,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

// @license      MIT
// @run-at       document-start

// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @compatible      berrybrowser

// @downloadURL https://update.greasyfork.org/scripts/472375/N%C3%A3o%20Pegue%20Meu%20IP.user.js
// @updateURL https://update.greasyfork.org/scripts/472375/N%C3%A3o%20Pegue%20Meu%20IP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stopGo = false;

    function stopAll(){
    // Sobrescreve a função addEventListener para prevenir a adição de eventos
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        console.log(`Tentativa de adição de evento bloqueada: ${type}`);
        // Não faz nada, impedindo a adição de eventos
    };

    // Remove o listener padrão do contexto de usuário para eventos adicionados dinamicamente
    window.removeEventListener = function(type, listener, options) {
        // Não faz nada
    };

    // Remove todos os listeners existentes
    const removeAllListeners = () => {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const events = getEventListeners(element);
            for (const eventType in events) {
                events[eventType].forEach(event => {
                    element.removeEventListener(event.type, event.listener);
                });
            }
        });
    };

    // Remove todos os listeners existentes antes de a página ser totalmente carregada
    window.addEventListener('beforeunload', removeAllListeners);
    window.addEventListener('error', removeAllListeners);
    window.addEventListener('load', removeAllListeners);



     // Desativa o JavaScript na página
        function letsGo(){

              const gElements = document.querySelectorAll('svg');
              if (gElements) {
                 gElements.forEach((svgElement) => {
                    svgElement.style.width = '10px';
                });
              }
              const imggElements = document.querySelectorAll('img');
              if (imggElements) {
                 imggElements.forEach((svgElement) => {
                    svgElement.style.display = 'none';
                });
              }

              window.eval = function() { };

              // Desativa a criação de novos elementos de script
              document.createElement = function(tagName) {
                  if (tagName.toLowerCase() === 'script') {
                      return document.createTextNode('');
                  }
                  return false;
              };

              // Remove todos os scripts existentes na página
                var scripts = document.querySelectorAll('script');
                scripts.forEach(function(script) {
                    script.parentNode.removeChild(script);
                });

              var allElements = document.querySelectorAll('*');
                allElements.forEach(function(element) {
                element.DOMContentLoaded = "";
                element.load = "";
                element.click = "";
                element.keydown = "";
                element.mousedown = "";
                element.down = "";
                element.attached = "";
                element.onclick = "";
                element.auxclick = "";
                element.dblclick = "";
                element.copy = "";
                element.change = "";
                element.keypress = "";
                element.mouseover = "";
                element.beforeunload = "";
                element.error = "";
                if(element.href){
                  element.innerHTML = "Don't Get My IP (Your UserScript)";
                  element.href = 'https://greasyfork.org/pt-BR/scripts/472375-n%C3%A3o-pegue-meu-ip';
                }
                if(element.src){
                  element.src = '';
                }
                if(element.tagName == 'BUTTON'){
                  element.remove();
                }
                //console.log(element.tagName)
                if(element.tagName == 'P' && element.id !== 'hahahax' || element.tagName == 'SPAN' || element.tagName == 'STRONG' || element.tagName == 'SMALL' || element.tagName == 'TD' || element.tagName == 'TH' || element.tagName == 'B' || element.tagName == 'H1' || element.tagName == 'H2' || element.tagName == 'H3' || element.tagName == 'H4'){
                  element.innerText = " Suspicious activity verified. The site's javascript has been disabled to prevent future actions.";
                }

            });

            allElements.forEach(function(element) {
                element.removeAttribute('DOMContentLoaded');
                element.removeAttribute('load');
                element.removeAttribute('onmousedown');
                element.removeAttribute('onmouseup');
                element.removeAttribute('onclick');
                element.removeAttribute('click');
                element.removeAttribute('attached');
                element.removeAttribute('keypress');
                element.removeAttribute('mouseover');
                element.removeAttribute('mousedown');
                element.removeAttribute('keydown');
                element.removeAttribute('beforeunload');
                element.removeAttribute('popstate');
                element.removeAttribute('error');
            });
        }

      window.setTimeout(letsGo, 100);


          // Cria a barra de pesquisa
          const addalertBlock = document.createElement('div');
          addalertBlock.innerHTML = `<p id='hahahax' style='text-align: center;color: rgb(255, 255, 255);'>Userscript IPBLOCK: SITE BLOCKED.</p>`;
          addalertBlock.style.position = 'fixed';
          addalertBlock.style.width = '100%';
          addalertBlock.style.height = 'auto';
          addalertBlock.title = 'Open userscript page';
          addalertBlock.style.borderBottom = 'solid 1px rgb(129, 133, 142)';
          addalertBlock.style.paddingTop = '10px';
          addalertBlock.style.top = '0';
          addalertBlock.style.left = '50%';
          addalertBlock.style.right = '50%';
          addalertBlock.style.transform = 'translate(-50%, 0px)';
          addalertBlock.style.zIndex = '99999';
          addalertBlock.style.display = 'list-item';
          addalertBlock.style.alignItems = 'center';
          addalertBlock.style.textAlign = 'center';
          addalertBlock.style.backgroundColor = 'rgb(85, 0, 0)';
          addalertBlock.style.color = '#fff';
          addalertBlock.style.cursor = 'pointer';

        document.addEventListener("keydown", function(event) {
            window.open('https://greasyfork.org/pt-BR/scripts/472375-n%C3%A3o-pegue-meu-ip', '_blank');
        });

        document.body.style.backgroundColor = 'rgb(4, 2, 2)';
        document.body.style.color = '#fff';
        document.body.style.marginTop = '40px';
        document.body.appendChild(addalertBlock);

    }


      var palavrasSalvas = `
         geoip,
         ip address:,
         address ip:,
         your ip:,
         ip2Location,
         ipaddress,
         myip,
         whatismyip,
         what is my ip?,
         endereço ip:,
         meu ip:,
         meuip.com`;

      function stringParaArray(xpalavrasChave) {
        const arrayDePalavras = xpalavrasChave.split(',');
        const palavrasLimparEspacos = arrayDePalavras
          .map(palavra => palavra.trim())
          .filter(palavra => palavra !== '');
        return palavrasLimparEspacos;
      }

      const palavrasChaveString = palavrasSalvas;
      const palavrasChave = stringParaArray(palavrasChaveString);

      // Função para verificar se uma palavra-chave está presente em um elemento
      function verificaPalavrasChave(elemento) {
        var texto = elemento.textContent.toLowerCase();
        for (var i = 0; i < palavrasChave.length; i++) {
          var palavra = palavrasChave[i].toLowerCase();
          if (texto.includes(palavra)) {
            return true;
          }
        }
        return false;
      }


      // Função para remover tags com base nas palavras-chave
      function removeTagsComPalavrasChave() {
        var checarSubtags = Array.from(document.querySelectorAll('*'));
        checarSubtags.forEach(function (checarSubtag) {
              if (verificaPalavrasChave(checarSubtag)) {
                stopGo = true;
              }
        });
      }


    const ativeChekall = setInterval(() => {
        luazul();
    }, 100);

    function luazul(){
      if(document.body){
           removeTagsComPalavrasChave();
           //setInterval(removeTagsComPalavrasChave, 1200);
           clearInterval(ativeChekall);
        }
    }

    console.log('IPBLOCK ====>> Listening for requests...');
    // Lista de URLs de API conhecidas para capturar o IP
    const blockedApiUrls = [
        'https://www.gstatic.com/charts/geochart',
        'https://api.ipify.org',
        'https://api.ipify.org?format=json',
        'https://ipinfo.io',
        'https://api.ipapi.com',
        'https://www.iplocation.net',
        'https://api.iplocation.net',
        'https://website-cdn.ipinfo.io',
        'https://p.typekit.net',
        'https://use.typekit.net',
        'https://pagead2.googlesyndication.com',
        'https://data-jsext.com',
        'https:main.exoclick.com',
        'https:main.exdynsrv.com',
        'https:main.exosrv.com',
        'https://geolocation.onetrust.com',
        'https://cdn.cookielaw.org',
        'http://axeocy.com',
        'https://chikzzz.com',
        'https://themeetpartners.life',
        'https://api.ip-api.com',
        'https://ipapi.co',
        'https://geo.ipify.org',
        'https://extreme-ip-lookup.com',
        'https://freeipapi.com',
        'https://application/vnd.maxmind.com',
        'https://freegeoip.io',
        'ipbase.com',
        'https://api.ip2location.com',
        'https://ipstack.com',
        'https://ipstack1.p.rapidapi.com',
        'https://app.fusebox.fm',
        'https://api.usercentrics.eu',
        'https://maps.googleapis.com',
        'https://www.expressvpn.com',
        'https://graphql.usercentrics.eu',
        'https://ipaddress',
        'https://tls.browserleaks.com',
        'https://rf.revolvermaps.com',
        '/website/_next/static',
        'nordvpn.com/',
        'expressvpn.com/',
        'whoisxmlapi.com',
        'maxmind.com',
        'whatismyip.com',
        'ip-api',
        'myip.',
        '/cookie',
        '/location',
        '/ip',
        '/ips',
        '/api/hostname',
        '/api/whois',
        'https://[',
        'geoip',
        'geoip2',
        'ipaddress'
        // Adicione mais URLs de API que deseja bloquear, se necessário
    ];

    let listBlock1 = "list of blocked ==> ";
    let listBlock2 = "list of blocked --> ";

    var verifyc1 = false;

    let contagemBlck = 1;

    // Intercepta as solicitações AJAX feitas pelo website
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Verifica se a URL da solicitação corresponde a uma URL de API bloqueada
        console.log('====>>', url);
        if (blockedApiUrls.some(apiUrl => url.startsWith(apiUrl))) {
            verifyc1 = true;
            listBlock1 += '\n\n'+contagemBlck+': '+url;
            contagemBlck++;
            console.log(`Solicitação de API bloqueada: ${url}`);
            return; // Interrompe a execução da solicitação
        }
        for (var i = 0; i < blockedApiUrls.length; i++) {
          var palavra = blockedApiUrls[i];
          if (url.includes(palavra)) {
            console.log(`~ Block: ${palavra}`);
            listBlock1 += palavra+" ~ ";
            verifyc1 = true;

                  // Intercepta as requisições AJAX
                  var send = XMLHttpRequest.prototype.send;
                  XMLHttpRequest.prototype.send = function() {
                      console.log('Tentativa de enviar requisição AJAX bloqueada.');
                      // bloqueia a requisição e para de carregar a página
                  };

                  // Intercepta o envio de formulários
                  var submit = HTMLFormElement.prototype.submit;
                  HTMLFormElement.prototype.submit = function() {
                      console.log('Tentativa de enviar formulário bloqueada.');
                      // bloqueia o envio de formuário e para de carregar a página
                  };

                  // Intercepta o clique em links
                  document.addEventListener('click', function(event) {
                      if (event.target.tagName === 'a') {
                          console.log('Tentativa de navegar para outra página bloqueada.');
                          event.preventDefault(); // Bloqueia o comportamento padrão do link
                      }
                  });
            return;
          }
        }
        // Continua com a execução normal da solicitação
        open.apply(this, arguments);
    };



  let bloquearFetch = true;
  let verifyc2 = false;

  function interceptarFetch(url, options) {
    console.log('---->>', url);
    for (var i = 0; i < blockedApiUrls.length; i++) {
        var palavra = blockedApiUrls[i];
        if (url.includes(palavra)) {
          console.log(`~ Block: ${palavra}`);
          listBlock2 += palavra+" ~ ";
          verifyc2 = true;
          return Promise.resolve({ status: 200, body: 'A solicitação foi bloqueada.' });
        }
      }
    if (bloquearFetch && correspondeAUrlBloqueada(url)) {
      console.log('Solicitação fetch bloqueada:', url);
      verifyc2 = true;
      listBlock2 += '\n\n'+contagemBlck+': '+url+" ~ ";
      contagemBlck++;
      return Promise.resolve({ status: 200, body: 'A solicitação foi bloqueada.' });
    } else {
      return window.originalFetch.call(this, url, options);
    }
  }

  function correspondeAUrlBloqueada(url) {
    for (const urlBloqueada of blockedApiUrls) {
      if (url.startsWith(urlBloqueada)) {
        return true;
      }
      for (var i = 0; i < blockedApiUrls.length; i++) {
        var palavra = blockedApiUrls[i];
        if (url.includes(palavra)) {
          console.log(`~ Block: ${palavra}`);
          return true;
        }
      }
    }
    return false;
  }

  // Substituir a função fetch globalmente
  window.originalFetch = window.fetch;
  window.fetch = interceptarFetch;

  // Aguarde o evento de carregamento total da página
  window.addEventListener('load', function() {
    // Após o carregamento total da página, permitir todas as solicitações fetch
    bloquearFetch = false;
  });



  function notificaAlert() {
    setTimeout(function(){
      if(verifyc1 == true){
        window.stop();
        console.log("~~ IPBLOCK AJAX ~~\n\n"+listBlock1);
        listBlock1 = "list of blocked ==> ";
        verifyc1 = false;
        stopAll();
      }
      else if(verifyc2 == true){
        window.stop();
        console.log("~~ IPBLOCK Fetch ~~\n\n"+listBlock2);
        listBlock2 = "list of blocked --> ";
        verifyc2 = false;
        stopAll();
      }else if(stopGo == true){
          window.stop();
          console.log("~~ IPBLOCK: Stop All.");
          stopAll();
      }else{
        console.log('IPBLOCK ====>> No API requests for IP identified.');
      }
    },1000);
  }

    var xurl = window.location.href;
    // Verifica o URL para determinar o que fazer no site
    if (xurl.includes(`https://[`) || xurl.includes(`vercel`)) {
      stopGo = true;
      Object.defineProperty(Element.prototype, 'innerText', {
          set: function(value) {},
      });
      Object.defineProperty(Element.prototype, 'innerHTML', {
          set: function(value) {},
      });
    };

  window.addEventListener('load', notificaAlert);

})();