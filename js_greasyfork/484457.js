// ==UserScript==
// @name        Picagem Automática do tiptip
// @namespace   www.tiptip.pt
// @match       https://www.tiptip.pt/*
// @grant       none
// @version     1.2
// @license     MIT
// @author      Samuel Araújo
// @icon        https://www.tiptip.pt/public/img/iconTiptip.png
// @description Faz a picagem automática do tiptip, a partir das 8 faz picagem assim que abrir o tiptip, faz picagem para sair às 13, para voltar a entrar às 14 e saída novamente às 18
// @downloadURL https://update.greasyfork.org/scripts/484457/Picagem%20Autom%C3%A1tica%20do%20tiptip.user.js
// @updateURL https://update.greasyfork.org/scripts/484457/Picagem%20Autom%C3%A1tica%20do%20tiptip.meta.js
// ==/UserScript==

function fecharAlerta() {
  var alertaAberto = document.querySelector(".bootbox-alert");
  if (alertaAberto) {
    bootbox.hideAll();
  }
}

function isWeekend() {
  var hoje = new Date();
  var diaSemana = hoje.getDay(); 
  return (diaSemana === 0 || diaSemana === 6); 
}

function verificarHora() {
  var agora = new Date();
  var horas = agora.getHours();
  var minutos = agora.getMinutes();

  if (isWeekend() == false) {
    if ((horas >= 8 && horas < 12 || horas >= 14 && horas < 16) && picking_type === 0) {
      document.getElementById("play").click();
      console.log("Picagem de entrada");
      fecharAlerta();
    }
    else if ((horas >= 13 && horas < 14 || horas >= 18 && minutos > 5 ) && picking_type === 1) {
      document.getElementById("stop").click();
      console.log("Picagem de saída");
    }
  }
}

setInterval(verificarHora, 60000);
