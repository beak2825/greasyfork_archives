

// ==UserScript==
// @name         Pegaxy Rent Bot
// @namespace    http://tampermonkey.net/
// @version      0.190
// @description  try to take over the world!
// @author       You
// @match        https://play.pegaxy.io/renting?tab=share-profit
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442496/Pegaxy%20Rent%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/442496/Pegaxy%20Rent%20Bot.meta.js
// ==/UserScript==
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const $ = (elem) => {
return document.querySelector(elem);
};

document.paused = false;
document.porcentagem = 5;

(async function () {
  var porcHabilitada = false;
  var achados = [];
  var temModal = false;
  var rented = false;
  var fistTime = true;
  var qtdClick = 0;

  var items = null;

  await sleep(2000);
  while (true) {

      if (document.getElementsByClassName("item-tab") && document.getElementsByClassName("item-tab")[2])document.getElementsByClassName("item-tab")[2].click()

      if($(".viewAlert") && $(".viewAlert").children && ($(".viewAlert").children[3].textContent == "RentService: the Pega is rented by other" ||
        $(".viewAlert").children[3].textContent == "MetaMask Tx Signature: User denied transaction signature.")) {
           $("div.btn-close-modal").click()
      }

      if (document.getElementsByClassName("header-view")[0]) {

          if (document.getElementsByClassName("header-view")[0].children.length > 2) {
              document.getElementsByClassName("header-view")[0].children[document.getElementsByClassName("header-view")[0].children.length - 1].remove()
          }

          items = null;
        if (
              document.getElementsByClassName("header-view")[0] != undefined
          ) {
              var element = document.createElement("template");

              element.innerHTML = ""
              if (!porcHabilitada){
                  element.innerHTML =
                    '<div class="list-filter"><button type="button" id="pauseButton" class="btn btn-link">⏸︎</button><span class="check-title">Porcentagem mínima para alugar: </span><input type="text" size="1" id="porcentagem" value="'+document.porcentagem+'" name="porcentagem"></div>'.trim();
              }

              element.innerHTML +=
                  '<span><span class="check-title">QTD Click: </span><input type="text" size="1" id="qtdClick" value="'+qtdClick+'" name="qtdClick"></span>'.trim();

              var header = document.getElementsByClassName("header-view")[0];
              for (let i = element.content.children.length; i > 0; --i)
                  header.append(element.content.children[0]);
              document.getElementById("pauseButton").onclick = function () {
                  if (this.innerText == "⏸︎") {
                      this.innerText = "⏵︎";
                      document.paused = true;
                  } else {
                      this.innerText = "⏸︎";
                      document.paused = false;
                  }
              };
              document.getElementById("porcentagem").onchange = function () {
                  GM_setValue("porcentagem", this.value);
              };
              porcHabilitada = true;
          }
          if (!document.paused && !temModal && porcHabilitada && (document.porcentagem = parseInt(document.getElementById("porcentagem").value)) != 0 ) {
              var resultados = document.getElementsByClassName("button-game primary");

              resultados = Array.from(resultados).slice().reverse();
              resultados = resultados.filter(item => parseInt(item.innerText.split("%")[0]) >= document.porcentagem)
              resultados = resultados.filter(item => !achados.includes(item.parentElement.parentElement.parentElement.parentElement.innerText.split(" ")[0].substring(1)))

              qtdClick = resultados.length;

              for (var i = 0; i < resultados.length; i++) {

                  var filtrado = resultados[i];
                  var id = resultados[i].parentElement.parentElement.parentElement.parentElement.innerText.split(" ")[0].substring(1);

                  achados.push(id);

                  if (! fistTime) {
                      filtrado.click();
                      break;
                  }

              }

              temModal = document.getElementsByClassName("modal-dialog modal-xl modal-dialog-centered").length > 0;
              if ( !temModal && (items = document.getElementsByClassName("item-tab")).length > 0) {
                  items[1].click();
                  items[2].click();
              }
              else {
                  rented = false;
              }

              fistTime = false;
          }
          else{
              var botoes = document.getElementsByClassName("button-game primary");
              if(botoes.length > 0 && !rented)
                  for(var k = 0; k < botoes.length; k++)
                      if(botoes[k].innerText == "Rent"){
                          botoes[k].click();
                          rented = true;
                      }

          }
          temModal =
              document.getElementsByClassName(
              "modal-dialog modal-xl modal-dialog-centered"
          ).length > 0;
      }

      await sleep(600);
  }
})();