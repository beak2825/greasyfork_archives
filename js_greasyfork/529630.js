// ==UserScript==
// @name        Só previsão - ipma.pt
// @namespace   Violentmonkey Scripts
// @match       https://www.ipma.pt/pt/otempo/prev.localidade.hora/*
// @grant       GM_addStyle
// @version     1.0
// @author      Diogo Tito Victor Marques
// @license     MIT
// @description 13/02/2020, 16:26:13 Hides all the clutter in IPMA's 10 day forecast page and adds a discrete curve to visually indicate which hour columns belong to today's day
// @downloadURL https://update.greasyfork.org/scripts/529630/S%C3%B3%20previs%C3%A3o%20-%20ipmapt.user.js
// @updateURL https://update.greasyfork.org/scripts/529630/S%C3%B3%20previs%C3%A3o%20-%20ipmapt.meta.js
// ==/UserScript==

// Uma curva em SVG para ajudar a separar visualmente o dia de hoje do dia de amanhã na previsão horária
const templateCurva = document.createElement("template")
templateCurva.innerHTML = `
<svg id="curvaSVG" width="810" height="50" viewBox="0 0 120 100" preserveAspectRatio="none">
  <path id="curva-hoje" fill="rgba(31, 135, 198, 0.25)"/>
  <path id="curva-amanha" fill="rgb(239, 239, 239)"/>
</svg>
`

// O que quero ver na página:
document.body.prepend(
  "Distrito/Ilha: ", district, " Cidade/Vila: ", locations,
  weekly,
  templateCurva.content,
  daily,
)

// Esconde tudo o resto (#district, #locations, #weekly e #daily foram arrancados pelo prepend acima)
GM_addStyle`
  #Container, #daily > .dayWrapper > .warning-msg {
    display: none;
  }
  /* O <svg> é display: inline por pré-definição e isso cria um espaço vazio debaixo dele */
  #curvaSVG {
    display: block;
    margin: -1px auto;  /* Centrar horizontalmente como os outros display: block */
  }
`

// Monkey patch para calcular as dimensões da curva do #curvaSVGPath assim que souber
// quantas colunas (horas) há para o dia de hoje. Faz isto só 1 vez, quando a página carrega (não quando se muda localidade).
const f = yoda.renderDailyForecast.bind(yoda);
let primeiraVez = true;
yoda.renderDailyForecast = (...args) => {
  f(...args)
  if (primeiraVez) {
    primeiraVez = false;
    
    // É aqui que parameterizo a curva
    const horasAmanha = $(".hour .wrapper[style]").length  // quantas colunas foram pintadas de cinzento com um inline style
    const x = 5 * (24 - horasAmanha)
    const curvaHoje = `C 12 120, ${x} 30, ${x} 100`   // C x1 y1, x2 y2, x y  -- dois pontos de controlo e onde acaba
    const curvaAmanha = `C 120 20, 23.7 70, 23.7 0`
    $('#curva-hoje').attr('d',   `M 0 0  H 11.7  ${curvaHoje}  H 0  Z`)
    $('#curva-amanha').attr('d', `M 12 0  ${curvaHoje} H 120  ${curvaAmanha}  Z`)
    
    // Já agora aproveito e fecho o Vento e o Estado do mar
    $('#daily .dayWrapper .datarow.winddata').slideUp();
    $('#daily .dayWrapper .datarow.seadata').slideUp();
    
    // e acrescento uma borda cinzenta mais escura na coluna do dia de amanhã
    $('.weekly-column:not(.active):first').css({'border-bottom': '4px solid #c3c3c3'})
  }
}
