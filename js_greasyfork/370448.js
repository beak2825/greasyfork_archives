// ==UserScript==
// @name Moomoo.io traducido al español
// @version 1.3
// @description Cambia cosas inglesas a español, todo traducido con google translate.
// @author Perussi
// @match *://moomoo.io/*
// @match *sandbox.moomoo.io/*
// @grant none
// @namespace https://greasyfork.org/users/128061
// @downloadURL https://update.greasyfork.org/scripts/370448/Moomooio%20traducido%20al%20espa%C3%B1ol.user.js
// @updateURL https://update.greasyfork.org/scripts/370448/Moomooio%20traducido%20al%20espa%C3%B1ol.meta.js
// ==/UserScript==

var aa = 0;
var timrz = [0];

var descLst = [["no effect","sin efecto"],["hacks are for losers","los hacks son para los perdedores"],["coolest mooer around","mooer más fresco alrededor"],["apple farms remembers","granjas de apple recuerda"],["join the enigma army","únete al ejército del enigma"],["hey everybody i'm blitz","hola a todos soy blitz"],["like and subscribe","me gusta y suscribirse"],["allows you to move at normal speed in snow","te permite moverte a velocidad normal en la nieve"],["have more control while in water","tener más control en el agua"],["increases arrow speed and range","aumenta la velocidad y el rango de la flecha"],["reduces damage taken but slows movement","reduce el daño recibido pero ralentiza el movimiento"],["makes you immune to poison","te hace inmune al veneno"],["slowly regenerates health over time","regenera lentamente la salud con el tiempo, también, esta traducción fue hecha por PerussiGaming"],["earn 1 extra gold per resource","ganar 1 oro adicional por recurso"],["reduces cost of projectiles","reduce el costo de los proyectiles"],["increases damage done but drains health","aumenta el daño hecho pero drena la salud"],["turrets won't attack but you move slower","las torretas no atacarán pero te moverás más despacio"],["increases your movement speed","aumenta tu velocidad de movimiento"],["knocks back enemies that attack you","repele a los enemigos que te atacan"],["melee attacks deal poison damage","los ataques cuerpo a cuerpo causan daño de veneno"],["bulls won't target you unless you attack them","los toros no te atacarán a menos que los ataques"],["generates points while worn","genera puntos mientras está desgastado"],["deal damage to players that damage you","inflija daño a los jugadores que lo dañen"],["you become a walking turret","te conviertes en una torrecilla"],["increased attack speed and fire rate","mayor velocidad de ataque y velocidad de disparo"],["restores health when you deal damage","restaura la salud cuando haces daño"],["earn double points for each kill","gana puntos dobles por cada muerte"],["increased damage to buildings but slower movement","mayor daño a los edificios pero movimiento más lento"],["steal half of a players gold when you kill them","robar la mitad de oro de un jugador cuando los matas"],["Super speed but reduced damage","Súper velocidad pero daño reducido"],["slowly regenerates health over time","regenera lentamente la salud a lo largo del tiempo"],["slowly regenerates health over time","regenera lentamente la salud a lo largo del tiempo"],["increased movement speed","mayor velocidad de movimiento"],["restores health when you deal damage","restaura la salud cuando haces daño"],["tool for gathering all resources","herramienta para reunir todos los recursos"],["gathers resources at a higher rate","reúne recursos a un ritmo mayor"],["deal more damage and gather more resources","hacer más daño y reunir más recursos"],["increased attack power but slower move speed","aumento de la potencia de ataque pero menor velocidad de movimiento"],["greater range and damage","mayor alcance y daño"],["long range melee weapon","arma cuerpo a cuerpo de largo alcance"],["fast long range melee weapon","arma cuerpo a cuerpo de largo alcance"],["really fast short range weapon","arma muy rápida de corto alcance"],["great for gathering but very weak","ideal para la reunión, pero muy débil"],["bow used for ranged combat and hunting","arco utilizado para el combate a distancia y la caza"],["hammer used for destroying structures","martillo usado para destruir estructuras"],["blocks projectiles and reduces melee damage","bloquea proyectiles y reduce el daño cuerpo a cuerpo"],["deals more damage and has greater range","causa más daño y tiene un alcance mayor"],["high firerate crossbow with reduced damage","alta ballesta de firerate con daño reducido"],["restores 20 health when consumed","restaura 20 salud cuando se consume"],["restores 40 health when consumed","restaura 40 salud cuando se consume"],["restores 30 health and another 50 over 5 seconds","restaura 30 salud y otros 50 durante 5 segundos"],["provides protection for your village","proporciona protección para su pueblo"],["provides improved protection for your village","proporciona una mejor protección para su pueblo"],["provides powerful protection for your village","proporciona una poderosa protección para tu pueblo"],["damages enemies when they touch them","daña a los enemigos cuando los tocan"],["poisons enemies when they touch them","envenena a los enemigos cuando los tocan"],["generates gold over time","genera oro a lo largo del tiempo"],["generates more gold over time","genera más oro en el tiempo"],["allows you to mine stone","te permite extraer piedra"],["allows you to farm wood","le permite cultivar madera"],["pit that traps enemies if they walk over it","hoyo que atrapa a los enemigos si caminan sobre él"],["provides boost when stepped on","proporciona impulso cuando pisó"],["defensive structure that shoots at enemies","estructura defensiva que dispara a los enemigos"],["platform to shoot over walls and cross over water","plataforma para disparar sobre las paredes y cruzar el agua"],["standing on it will slowly heal you","pararte lentamente te curará"],["you will spawn here when you die but it will dissapear","aparecerás aquí cuando mueras pero desaparecerá"],["blocks building in radius","bloques construyendo en radio"],["allows you to disguise yourself as a bush","te permite disfrazarse como un arbusto"]];

function replaceDesc(){
  for(aa = 0; aa < descLst.length; aa++){
    if(document.getElementById("itemInfoDesc").innerHTML === descLst[aa][0]){
      document.getElementById("itemInfoDesc").innerHTML = descLst[aa][1];
    }
  }
}

function queHayaLuz() {
  if(timrz[0] < 133){
    timrz[0] += 1;
    if(timrz[0] < 70){
      document.title = "Traducción Española";
    }
    if(70 <= timrz[0] && timrz[0] < 105){
      document.title = "<3 Jesucristo";
    }
    if(105 <= timrz[0] && timrz[0] < 126){
      document.title = "KatieW. es increíble <3";
    }
    if(126 <= timrz[0]){
      document.title = "Moo Moo";
    }
  }
  replaceDesc();
}

setInterval(queHayaLuz, 1000/7);