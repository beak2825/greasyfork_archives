// ==UserScript==
// @name         Auxiliador de partidas - Footmundo ATUAL
// @namespace    http://www.footmundo.com
// @version      0.5
// @description  Facilita mudança de taticas na partida
// @author       Vicente Ayuso
// @match        https://www.footmundo.com/estadio/*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471652/Auxiliador%20de%20partidas%20-%20Footmundo%20ATUAL.user.js
// @updateURL https://update.greasyfork.org/scripts/471652/Auxiliador%20de%20partidas%20-%20Footmundo%20ATUAL.meta.js
// ==/UserScript==
$(document).ready(function() {
const seuTimeDivStyle = `
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 16px;
  width: 100%;
  z-index: 9999;

`;
    // Função para criar e adicionar o iframe
    function addIframe(src, linkElement) {
        const iframe = $('<iframe>', { src: src, style: 'display:none;' });
        $('body').append(iframe);
        monitorarFormacao(iframe.get(0), linkElement);
    }

    // Função para monitorar a formação
    function monitorarFormacao(iframe, linkElement) {
        const intervalodeId = setInterval(() => {
            const iframeWindow = iframe.contentWindow;
            iframeWindow.location.reload();

            iframe.onload = () => {
                const tituloH2 = $('<h6>', { class: 'mt-4 mb-2', text: 'A formação atual do time adversário é:' });
                const formacao = iframe.contentDocument.getElementById('Formacao').innerHTML;
                const formacaoDiv = $('<div>').html(formacao);

                // Remover a formação tática anterior se houver uma
                linkElement.prev('.formacao-tatica').remove();

                // Adicionar a formação tática atual diretamente antes do link
                // Alterar a cor da fonte para branco e adicionar sombreado e negrito
                linkElement.before(formacaoDiv.addClass('formacao-tatica').css({color: 'white', 'text-shadow': '2px 2px 4px #000000', 'font-weight': 'bold', 'margin-bottom':'5px'}));
            };
        }, 4000);

        // Limpar o intervalo anterior ao sair da página
        $(window).on('beforeunload', function() {
            clearInterval(intervalodeId);
        });
    }

    // Pegue os links e chame addIframe imediatamente para ambos
    const linkCasa = $('table.pagina_partida td:first-child').find('a');
    const linkFora = $('table.pagina_partida td:last-child').find('a');

    const hrefCasa = linkCasa.attr('href');
    const hrefFora = linkFora.attr('href');

    addIframe(hrefCasa, linkCasa);
    addIframe(hrefFora, linkFora);





  //-- fim da area de mudar tatica do time ------------------------------------





// Selecionar a div com a class "center"
const centerDiv2 = $('.center');

// Criar a div com class "bloc"
const seuTimeBlocDiv = $('<div>', { class: 'bloc' });
const seuTimeBoxDiv = $('<div>', { class: 'box', id: 'seu-time' , name:'script-formacao'});

// Criar um header com um h3 texto
const seuTimeHeader = $('<header>');
const seuTimeTituloH3 = $('<h3>', { class: 'titulo', text: 'Seu Time' });
const seuTimeSpan1 = $('<span>', {text:'Digite o ID do seu time '});

// Adicionar o h3 ao header
seuTimeHeader.append(seuTimeTituloH3);

// Adicionar o header e a div seuTimeBoxDiv à div com class "bloc"
seuTimeBlocDiv.append(seuTimeHeader);
seuTimeBlocDiv.append(seuTimeBoxDiv);
seuTimeBoxDiv.append(seuTimeSpan1);

// Adicione um input para o ID do time
const inputIdTime = $('<input>', { id: 'id-time', class: 'form-control', type: 'number' });
seuTimeBoxDiv.append(inputIdTime);

// Criar o botão "Abrir tática do seu time"
const btnAbrirTatica = $('<button>', { class: 'btn btn-primary mt-2', text: 'Abrir tática do seu time' });

// Adicionar o botão ao seuTimeBoxDiv
seuTimeBoxDiv.append(btnAbrirTatica);

// Adicionar duas quebras de linha após o span
const breakLine3 = $('<br>');
const breakLine4 = $('<br>');
seuTimeBoxDiv.append(breakLine3);
seuTimeBoxDiv.append(breakLine4);

// Adicionar a div "seu-time" à div "center"
centerDiv2.append(seuTimeBlocDiv);

// Função para adicionar o iframe do time
function addIframeSeuTime(src) {
  const iframe = $('<iframe>', { src: src, style: 'width: 100%; height: 250px;' });
  seuTimeBoxDiv.append(iframe);

  iframe.on('load', function() {
    const iframeContent = iframe.contents();
    const targetElement = iframeContent.find('header h3.titulo:contains("Escolha o esquema tático do time:")');
    if (targetElement.length > 0) {
      targetElement.get(0).scrollIntoView();
    }
  });
}

// Evento de clique no botão "Abrir tática do seu time"
btnAbrirTatica.on('click', function() {
  const idTimeSelecionado = inputIdTime.val();
  const linkTatica = `https://www.footmundo.com/formacao/time/${idTimeSelecionado}`;
  seuTimeBoxDiv.empty();
  addIframeSeuTime(linkTatica);
});




});