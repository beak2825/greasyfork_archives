// ==UserScript==
// @name         Auxiliador de partidas - Footmundo
// @namespace    http://www.footmundo.com
// @version      0.3
// @description  Facilita mudança de taticas na partida
// @author       Vicente Ayuso
// @match        https://www.footmundo.com/estadio/*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464517/Auxiliador%20de%20partidas%20-%20Footmundo.user.js
// @updateURL https://update.greasyfork.org/scripts/464517/Auxiliador%20de%20partidas%20-%20Footmundo.meta.js
// ==/UserScript==

$(document).ready(function() {
    // CSS para estilizar a div "seu-time"
  const seuTimeDivStyle = `
    background-color: #f8f9fa;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
    position: fixed;
    top: 30%;
    width: 345px;
    z-index: 9999;
  `;

  // Criar a div com id "time-adversario"
  const timeAdversarioDiv = $('<div>', { id: 'time-adversario', class: 'bg-light p-4 rounded shadow', style: 'z-index: 9999' });

  // Criar a div com id "visitante-casa"
  const visitanteCasaDiv = $('<div>', { id: 'visitante-casa' });

  // Criar os botões com class "btn_padrao"
  const tituloh4 = $('<h6>', { class: 'mt-4 mb-4', text: 'Diga onde seu time está jogando' });
  const paragrafo = $('<p>', {text:'Depois de clicar no botão a tatica que o time adversario está utilizando'});
  const paragrafo2 = $('<p>', {text:' aparecerá aqui e sera atualizada sempre que ele alterar'});
  const btnJogandoFora = $('<button>', { class: 'btn btn-primary mr-2', text: 'Fora' });
  const btnJogandoCasa = $('<button>', { class: 'btn btn-primary', text: 'em casa' });

  // Adicionar os botões à div "visitante-casa"
  visitanteCasaDiv.append(tituloh4);
  visitanteCasaDiv.append(paragrafo);
  visitanteCasaDiv.append(paragrafo2);
  visitanteCasaDiv.append(btnJogandoCasa);
  visitanteCasaDiv.append(btnJogandoFora);

  // Adicionar a div "visitante-casa" à div "time-adversario"
  timeAdversarioDiv.append(visitanteCasaDiv);

  // Criar o elemento Shadow DOM
  const shadowRoot = document.createElement('div');
  shadowRoot.attachShadow({ mode: 'open' });

  // Adicionar o Bootstrap CSS ao Shadow DOM
  const bootstrapCssLink = document.createElement('link');
  bootstrapCssLink.setAttribute('rel', 'stylesheet');
  bootstrapCssLink.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
  shadowRoot.shadowRoot.appendChild(bootstrapCssLink);

  // Adicionar a div "time-adversario" ao Shadow DOM
  shadowRoot.shadowRoot.appendChild(timeAdversarioDiv.get(0));

  // Adicionar o elemento Shadow DOM ao body da página
  $('#coluna').append(shadowRoot);

  // Adicionar o Bootstrap JS ao cabeçalho
  $.getScript('https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js');

  let intervalodeId;

  // Função para criar e adicionar o iframe
  function addIframe(src) {
    const iframe = $('<iframe>', { src: src, style: 'display:none;' });
    $('body').append(iframe);
    monitorarFormacao(iframe.get(0));
  }

  // Função para monitorar a formação
  function monitorarFormacao(iframe) {
    if (intervalodeId) {
      clearInterval(intervalodeId);
    }

    intervalodeId = setInterval(() => {
      const iframeWindow = iframe.contentWindow;
      iframeWindow.location.reload();

      iframe.onload = () => {
        const tituloH2 = $('<h6>', { class: 'mt-4 mb-2', text: 'A formação atual do time adversário é:' });
        const formacao = iframe.contentDocument.getElementById('Formacao').innerHTML;

        if (visitanteCasaDiv.html() !== formacao) {
          visitanteCasaDiv.html('');
          visitanteCasaDiv.append(tituloH2);
          visitanteCasaDiv.append(formacao);
        }
      };
    }, 2000);
  }

  // Eventos de clique nos botões
  btnJogandoCasa.on('click', function() {
    const linkFora = $('table.pagina_partida td:last-child').find('a').attr('href');
    visitanteCasaDiv.empty();
    addIframe(linkFora);
  });


  btnJogandoFora.on('click', function() {
    const linkCasa = $('table.pagina_partida td:first-child').find('a').attr('href');
    visitanteCasaDiv.empty();
    addIframe(linkCasa);
  });

  //-----------------------Area de mudar tatica do proprio time ----------------------------Area
  // Criar a div com id "seu-time"
  const seuTimeDiv = $('<div>', { id: 'seu-time', style: seuTimeDivStyle });

  // Criar a label e o input para o ID do time
  const labelIdTime = $('<label>', { for: 'id-time', text: 'Qual o ID do seu time?' });
  const inputIdTime = $('<input>', { id: 'id-time', class: 'form-control', type: 'number' });

  // Criar o botão "Abrir tática do seu time"
  const btnAbrirTatica = $('<button>', { class: 'btn btn-primary mt-2', text: 'Abrir tática do seu time' });

  // Adicionar a label, o input e o botão à div "seu-time"
  seuTimeDiv.append(labelIdTime);
  seuTimeDiv.append(inputIdTime);
  seuTimeDiv.append(btnAbrirTatica);

  // Adicionar a div "seu-time" ao Shadow DOM
  shadowRoot.shadowRoot.appendChild(seuTimeDiv.get(0));
  $('body').append(seuTimeDiv);

  // Função para adicionar o iframe do time
  function addIframeSeuTime(src) {
    const iframe = $('<iframe>', { src: src, style: 'width: 100%; height: 500px;' });
    seuTimeDiv.append(iframe);
  }

  // Evento de clique no botão "Abrir tática do seu time"
  btnAbrirTatica.on('click', function() {
    const idTimeSelecionado = inputIdTime.val();
    const linkTatica = `https://www.footmundo.com/formacao/time/${idTimeSelecionado}`;
    seuTimeDiv.empty();
    addIframeSeuTime(linkTatica);
  });


  //-- fim da area de mudar tatica do time ------------------------------------


});