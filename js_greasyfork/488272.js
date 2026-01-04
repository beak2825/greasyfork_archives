// ==UserScript==
// @name                   TV Online é 1,2
// @namespace              https://linkme.bio/jhonpergon/?userscript=tvonline
// @version                1.2
// @author                 Jhon Pérgon
// @description            Todos os principais canais de TV em uma janela flutuante. Basta pressionar as teclas 1 + 2 (juntas) para visualizá-la ou ocultá-la em qualquer site. Você ainda poderá ouvir o áudio do canal com ela ocultada para evitar inconvenientes.

// @name:pt                TV Online é 1,2
// @name:pt-BR             TV Online é 1,2

// @description:pt         Todos os principais canais de TV em uma janela flutuante. Basta pressionar as teclas 1 + 2 (juntas) para visualizá-la ou ocultá-la em qualquer site. Você ainda poderá ouvir o áudio do canal com ela ocultada para evitar inconvenientes.
// @description:pt-BR      Todos os principais canais de TV em uma janela flutuante. Basta pressionar as teclas 1 + 2 (juntas) para visualizá-la ou ocultá-la em qualquer site. Você ainda poderá ouvir o áudio do canal com ela ocultada para evitar inconvenientes.

// @icon         data:image/png;base64,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
// @license      MIT
// @match        *://*/*
// @grant        none


// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/488272/TV%20Online%20%C3%A9%201%2C2.user.js
// @updateURL https://update.greasyfork.org/scripts/488272/TV%20Online%20%C3%A9%201%2C2.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var url = window.location.href;
     let loadInicial = false;

    // firula para alguns sites externos
    if (url.includes("cxtv.com.br")) {

          setTimeout(function(){
              var elementosOcultar = [
                  '.media.m-b-20',
                  '.col-md-4',
                  '.clearfix',
                  '.btn',
                  '.m-t-20',
                  '.vjs-big-play-button',
                  'footer',
                  'span',
                  'p',
                  '.m-t-30',
                  '.b2',
                  '#id1',
                  'header'
              ];

              elementosOcultar.forEach(function(seletor) {
                  var elementos = document.querySelectorAll(seletor);
                  elementos.forEach(function(elemento) {
                      elemento.style.display = 'none';
                  });
              });

              document.body.style.backgroundColor = "#000";
              document.body.style.width = "100%";
              document.body.style.height = "100%";
              document.body.style.backgroundColor = "#000";
            if(document.querySelector(".bg-white")){
              document.querySelector(".bg-white").style.backgroundColor = '#000';
            }
            if(document.querySelector(".p-t-20")){
              document.querySelector(".p-t-20").style.paddingTop = '0px';
            }
            if(document.querySelector(".video.bg-silver.b-radius-5.padding-5")){
              document.querySelector(".video.bg-silver.b-radius-5.padding-5").style.backgroundColor = '#000';
            }

          if(document.querySelector(".col-md-8")){
              let checkUrlx = document.querySelector("iframe").src;
              if(checkUrlx.includes("youtube.com/embed")){
                  var iframeAtual = document.querySelector('iframe');
                  var novoIframe = document.createElement('iframe');
                  novoIframe.style.position = 'fixed';
                  novoIframe.style.width = '100%';
                  novoIframe.style.height = '100%';
                  novoIframe.style.top = '0px';
                  novoIframe.style.left = '0px';
                  novoIframe.style.zIndex = '1000';
                  novoIframe.src = iframeAtual.src;
                  novoIframe.allow = 'accelerometer; autoplay; gyroscope; picture-in-picture';
                  novoIframe.frameBorder = '0';
                  novoIframe.scrolling = 'no';
                  novoIframe.referrerPolicy = 'no-referrer';
                  novoIframe.allowFullscreen = true;

                  // Substitui o iframe atual pelo novo iframe
                  iframeAtual.parentNode.replaceChild(novoIframe, iframeAtual);

              }else{
                let vdx =document.querySelector(".col-md-8");
                vdx.style.position = 'fixed';
                vdx.style.width = '100%';
                vdx.style.height = '100%';
                vdx.style.top = '0px';
                vdx.style.left = '0px';
                vdx.style.zIndex = '1000';
              }

            }
            if(document.querySelector("#my-video")){
              let vdx = document.querySelector("#my-video");
              vdx.style.position = 'fixed';
              vdx.style.width = '100%';
              vdx.style.height = '100%';
              vdx.style.top = '0px';
              vdx.style.left = '0px';
            }
         },1500)

    }else if (url.includes("embedflix.net/tv")) {
        if(document.querySelector(".embedder_info")){
           document.querySelector(".embedder_info").style.display = 'none';
        }
    }else{ // código da tv

       const draggableDiv = document.createElement('div');
        draggableDiv.id = 'draggableDiv';
        draggableDiv.className = 'draggable resizable hidden';
        draggableDiv.innerHTML = `
            <div class="resize-bar">
                <input type="range" class="ipt size" id="resizeRate" min="0" max="290" value="10">
                <select class="ipt canais" id="canais">
                    <option value="off">➝ Off</option>
                    <option value="https://reidoscanais.com/embed/?id=globosp-globosaopaulo">TV Globo</option>
                    <option value="https://reidoscanais.com/embed/?id=cnnbrasil">CNN Brasil</option>
                    <option value="https://embedflix.net/tv/sbt">SBT</option>
                    <option value="https://reidoscanais.com/embed/?id=recordsp">RecordTV</option>
                    <option value="https://embedflix.net/tv/band-tv-sp">Band</option>
                    <option value="https://embedflix.net/tv/redetv">RedeTV</option>
                    <option value="https://aovivo.ebc.com.br/embed-tvbrasil.html?v=20230211">TV Brasil</option>
                    <option value="https://www.cxtv.com.br/tv-ao-vivo/tv-cultura">TV Cultura</option>
                    <option value="https://reidoscanais.com/embed/?id=futura">Canal Futura</option>
                    <option value="https://www.cxtv.com.br/tv-ao-vivo/seven-tv">SevenTV</option>

                    <option value="https://embedflix.net/tv/discovery-channel-hd">Discovery</option>
                    <option value="https://embedflix.net/tv/history-channel">History</option>
                    <option value="https://reidoscanais.com/embed/?id=nationalgeographic">N. Geographc</option>
                    <option value="https://embedflix.net/tv/space">Space</option>

                    <option value="https://embedflix.net/tv/warner-channel">Warner Bros</option>
                    <option value="https://reidoscanais.com/embed/?id=disneychannel">Disney</option>
                    <option value="https://reidoscanais.com/embed/?id=nickelodeon">Nickelodeon</option>

                    <option value="https://embedflix.net/tv/sportv-hd">Sportv</option>
                    <option value="https://reidoscanais.com/embed/?id=mtv">MTV</option>

                    <option value="https://www.cxtv.com.br/tv-ao-vivo/desenhos-classicos-tv">Desenhos Clássicos</option>
                    <option value="https://www.cxtv.com.br/tv-ao-vivo/otaku-sign-tv">OtakuTV</option>
                    <option value="https://www.cxtv.com.br/tv-ao-vivo/anime-tv">AnimeTV</option>
                    <option value="https://www.cxtv.com.br/tv-ao-vivo/rede-brasil-de-televisao-rbtv">Rede Brasil</option>

                    <option value="https://www.cxtv.com.br/tv-ao-vivo/tv-classicos">TV Clássicos</option>
                    <option value="https://www.cxtv.com.br/tv-ao-vivo/nasa-tv">NASA TV</option>


                    <option value="https://reidoscanais.com/embed/?id=aee">A&E Movies</option>
                    <option value="https://reidoscanais.com/embed/?id=universaltv">Universal Filmes</option>
                    <option value="https://embedflix.net/tv/hbo-pop">HBO</option>
                    <option value="https://reidoscanais.com/embed/?id=sonychannel">Sony</option>
                    <option value="https://reidoscanais.com/embed/?id=cinemax">Cinemax</option>
                    <option value="https://embedflix.net/tv/tnt-series">TNT</option>
                    <option value="https://reidoscanais.com/embed/?id=starchannel">Star Channel</option>

                    <option value="https://reidoscanais.com/embed/?id=cancaonova">Canção Nova</option>
                    <option value="https://reidoscanais.com/embed/?id=combate">Canal Combate</option>
                    <option value="https://reidoscanais.com/embed/?id=paramountplus">Paramount</option>
                    <option value="https://reidoscanais.com/embed/?id=comedycentral">Comedy Central</option>
                </select>
            </div>
            <iframe id="xcanal" style="background-image: url('https://i.ytimg.com/vi/XYM-hPcvX1Q/hqdefault.jpg');" src="" allow="accelerometer; autoplay='autoplay'; gyroscope; picture-in-picture" frameborder="0" scrolling="no" referrerpolicy="no-referrer" allowfullscreen=""></iframe>
        `;

        // Adicionando estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            .draggable {
                width: 250px;
                height: 150px;
                background-color: #000;
                position: fixed;
                border: solid 1px gray;
                border-radius: .5rem;
                left: 10px;
                top: 10px;
                overflow: hidden;
                z-index: 9999999;
            }
            #draggableDiv {
              background-image: linear-gradient(to right, #602d2d, #262664, #125b12, #808002, #7d4f4f);
            }
            .hidden {
                display: none;
            }
            .resize-bar {
                width: 100%;
                background-color: rgb(24, 29, 31);
                height: 30px;
                padding: 0px;
                padding-top: 2px;
                cursor: move;
                overflow: hidden;
                color: #dcdcdc;
            }
            .ipt {
                float: left;
            }
            .resize-bar .size {
                width: 115px;
                margin-left: 10px;
                margin-top: 4px;
            }
            .resize-bar .canais {
                width: 40%;
                min-width: 100px;
                color: #dcdcdc;
                margin-left: 5px;
                background-color: rgb(16, 20, 21);
                padding: 5px 2px;
                border: none;
                font-weight: bold;
                border-radius: 4px 0px 0px 4px;
            }
            .resizable {
                resize: none;
                overflow: hidden;
            }
            #xcanal {
                width: 100%;
                height: calc(100% + -28px);
                background-size: 100% 100%;
            }
        `;

        // Adiciona os elementos no DOM
        if(document.body){
          document.body.appendChild(draggableDiv);
          document.head.appendChild(style);
        }


        const resizeRateInput = document.getElementById('resizeRate');
        const resizeBar = document.querySelector('.resize-bar');
        let isDragging = false;
        let startX, startY, initialMouseX, initialMouseY;
        let originalWidth, originalHeight;
        let altKeyPressed = false;

        document.addEventListener('keydown', function(event) {
            if (event.keyCode === 49) {
                altKeyPressed = true;
            }
            if (event.keyCode === 97) {
                altKeyPressed = true;
            }
            if (altKeyPressed && event.keyCode === 50 || altKeyPressed && event.keyCode === 98) { // Código para a tecla "T"
                let alerta = "TV: O autor notifica que devido as restrições no presente site, o script não poderá ser executado aqui.";
                if (url.includes("chat.openai.com")) {
                  console.log(alerta);
                } else if (url.includes("facebook.com")) {
                  console.log(alerta);
                } else if (url.includes("instagram.com")) {
                  console.log(alerta);
                } else if (url.includes("gemini.google.com")) {
                  console.log(alerta);
                } else if (url.includes("web.whatsapp.com")) {
                  console.log(alerta);
                } else if (url.includes("chat.openai.com")) {
                  console.log(alerta);
                } else if (url.includes("twitter.com")) {
                  console.log(alerta);
                } else if (url.includes("://x.com")) {
                  console.log(alerta);
                } else{
                  draggableDiv.classList.toggle('hidden');
                }
            }
        });

        document.addEventListener('keyup', function(event) {
            altKeyPressed = false;
        });

        resizeBar.addEventListener('mousedown', (e) => {
            if (e.target === resizeBar) {
                isDragging = true;
                startX = draggableDiv.offsetLeft;
                startY = draggableDiv.offsetTop;
                initialMouseX = e.clientX;
                initialMouseY = e.clientY;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - initialMouseX;
                const dy = e.clientY - initialMouseY;
                draggableDiv.style.left = `${startX + dx}px`;
                draggableDiv.style.top = `${startY + dy}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        resizeRateInput.addEventListener('input', () => {
            const rate = parseInt(resizeRateInput.value);

            if (!isNaN(rate) && rate > 0) {
                const diff = rate - parseInt(resizeRateInput.defaultValue);
                const newWidth = originalWidth + diff;
                const newHeight = originalHeight + diff;

                draggableDiv.style.width = `${newWidth}px`;
                draggableDiv.style.height = `${newHeight}px`;
            }
        });

        // Guardar as dimensões originais da div quando ela se tornar visível
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const classList = Array.from(mutation.target.classList);
                    if (!classList.includes('hidden')) {
                        originalWidth = draggableDiv.offsetWidth;
                        originalHeight = draggableDiv.offsetHeight;
                    }
                }
            });
        });

        observer.observe(draggableDiv, { attributes: true });

        document.getElementById("canais").addEventListener("change", function() {
            if(loadInicial == false){
              document.querySelector('#draggableDiv').style.backgroundImage = "url('')";
              loadInicial = true;
            }

            let selectedOption = this.value;
            if(selectedOption !== "off"){
              let iframeAtual = document.querySelector('#xcanal');
              iframeAtual.src = "";
              iframeAtual.style.backgroundImage = "url('https://i.pinimg.com/originals/cf/ce/2f/cfce2fa4cc0ccdc49cf1482c355a50b8.gif')";
              setTimeout(function(){
                let novoIframe = document.createElement('iframe');
                novoIframe.id = 'xcanal';
                novoIframe.src = selectedOption;
                novoIframe.allow = 'accelerometer; autoplay; gyroscope; picture-in-picture';
                novoIframe.frameBorder = '0';
                novoIframe.scrolling = 'no';
                novoIframe.referrerPolicy = 'no-referrer';
                novoIframe.allowFullscreen = true;

                iframeAtual.parentNode.replaceChild(novoIframe, iframeAtual);
                setTimeout(function(){
                  let iframeAtual = document.querySelector('#xcanal');
                  iframeAtual.style.backgroundImage = "url('https://media.tenor.com/xlMY4rdRwjEAAAAM/interruption-tv.gif')";
                },3500);
              },1200);
            }else{
              let iframeAtual = document.querySelector('#xcanal');
              iframeAtual.src = "";
              iframeAtual.style.backgroundImage = "url('https://i.ytimg.com/vi/XYM-hPcvX1Q/hqdefault.jpg')";
            }
        });

    }

})();
