// ==UserScript==
// @name         PuntuaciónMZ
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Herramienta que da una puntuación para cada posición de jugadores de  Managerzone (Traducción de olavarriense4ever de PontuacaoMZ https://greasyfork.org/es/scripts/422968-pontuacaomz)
// @author       Joaquín de la Iglesia (olavarriense4ever)
// @match        https://www.managerzone.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428524/Puntuaci%C3%B3nMZ.user.js
// @updateURL https://update.greasyfork.org/scripts/428524/Puntuaci%C3%B3nMZ.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {

        var players_container = document.getElementById("players_container");
        var players_html = players_container.children;


    var pesos =
        {
            "Arquero": {
                "Velocidad": 2,
                "Resistencia": 8,
                "Inteligencia": 8,
                "Pases": 0,
                "Remates": 0,
                "Cabezazos": 0,
                "Atajando": 8,
                "Control de balón": 2,
                "Entradas": 0,
                "Pases Largos": 2,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico": 8
            },
            "Defensor": {
                "Velocidad": 7,
                "Resistencia": 3,
                "Inteligencia": 8,
                "Pases": 6,
                "Remates": 0,
                "Cabezazos": 0,
                "Atajando": 0,
                "Control de balón": 3,
                "Entradas": 8,
                "Pases Largos": 3,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico": 3
            },
            "Lateral": {
                "Velocidad": 9,
                "Resistencia": 8,
                "Inteligencia": 3,
                "Pases": 7,
                "Remates": 0,
                "Cabezazos": 0,
                "Atajando": 0,
                "Control de balón": 7,
                "Entradas": 9,
                "Pases Largos": 4,
                "Balón Parado": 0,
                "Experiencia": 10,
                "Estado físico": 8
            },
            "Volante": {
                "Velocidad": 7,
                "Resistencia": 8,
                "Inteligencia": 8,
                "Pases": 8,
                "Remates": 0,
                "Cabezazos": 0,
                "Atajando": 0,
                "Control de balón": 2,
                "Entradas": 8,
                "Pases Largos": 7,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico": 8
            },
            "Mediocampista Central": {
                "Velocidad": 7,
                "Resistencia": 8,
                "Inteligencia": 8,
                "Pases": 8,
                "Remates": 1,
                "Cabezazos": 0,
                "Atajando":	0,
                "Control de balón": 5,
                "Entradas": 1,
                "Pases Largos": 8,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico": 8
            },
            "Mediocampista Ofensivo": {
                "Velocidad": 6,
                "Resistencia": 8,
                "Inteligencia": 8,
                "Pases": 8,
                "Remates": 8,
                "Cabezazos": 0,
                "Atajando": 0,
                "Control de balón": 7,
                "Entradas": 7,
                "Pases Largos": 7,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico": 8
            },
            "Extremo": {
               "Velocidad": 9,
                "Resistencia": 8,
                "Inteligencia": 5,
                "Pases": 3,
                "Remates": 0,
                "Cabezazos": 0,
                "Atajando": 0,
                "Control de balón": 8,
                "Entradas": 0,
                "Pases Largos": 8,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico":	8
            },
            "Delantero": {
                "Velocidad": 8,
                "Resistencia": 8,
                "Inteligencia": 8,
                "Pases": 3,
                "Remates": 8,
                "Cabezazos": 2,
                "Atajando": 0,
                "Control de balón": 6,
                "Entradas": 1,
                "Pases Largos": 0,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico":	8
            },
            "Cabezón": {
                "Velocidad": 4,
                "Resistencia": 8,
                "Inteligencia": 8,
                "Pases": 2,
                "Remates": 8,
                "Cabezazos": 8,
                "Atajando": 0,
                "Control de balón": 5,
                "Entradas": 0,
                "Pases Largos": 0,
                "Balón Parado": 0,
                "Experiencia": 8,
                "Estado físico": 8
            }
    }

    var habilidades = [
        "Velocidad",
        "Resistencia",
        "Inteligencia",
        "Pases",
        "Remates",
        "Cabezazos" ,
        "Atajando",
        "Control de balón",
        "Entradas",
        "Pases Largos",
        "Balón Parado",
        "Experiencia",
        "Estado físico"
    ]

    function calcularNotaPorPosicao(jogador, posicao) {
        let somatorioDaHabilidade = 0
        let somatorioDoPeso = 0
        habilidades.forEach(habilidade => {
            somatorioDaHabilidade = somatorioDaHabilidade + (jogador[habilidade] * pesos[posicao][habilidade])
            somatorioDoPeso = somatorioDoPeso + pesos[posicao][habilidade]
        })


        return somatorioDaHabilidade / somatorioDoPeso
    }

    function buscaHabilidadesDoJogador(allskillval) {
        let contador = 0
        let jogador = {}
        for (var i = 0; i < allskillval.length; i++) {
            let habilidade = habilidades[contador]
            if (!allskillval[i].innerText.includes("%")){
                jogador[habilidade] = allskillval[i].innerText.replace(/[()]/g, "")
                contador++
            }
        }
        return jogador
    }

    for (var i = 0; i < players_html.length; i++) {
        var player = players_html[i];
        var header = player.getElementsByClassName("subheader clearfix")[0];


        var allskillval = player.getElementsByClassName("skillval")



        var jogador = buscaHabilidadesDoJogador(allskillval)


        var goleiro = calcularNotaPorPosicao(jogador, "Arquero")
        var zagueiro = calcularNotaPorPosicao(jogador, "Defensor")
        var lateral = calcularNotaPorPosicao(jogador, "Lateral")
        var volante = calcularNotaPorPosicao(jogador, "Volante")
        var meia_central = calcularNotaPorPosicao(jogador, "Mediocampista Central")
        var meia_atacante = calcularNotaPorPosicao(jogador, "Mediocampista Ofensivo")
        var ponta = calcularNotaPorPosicao(jogador, "Extremo")
        var atacante = calcularNotaPorPosicao(jogador, "Delantero")
        var cabecudo = calcularNotaPorPosicao(jogador, "Cabezón")

        const posicoes = [
            {nome: "Arquero", nota: goleiro},
            {nome:"Defensor", nota: zagueiro},
            {nome:"Lateral", nota: lateral},
            {nome:"Volante", nota: volante},
            {nome:"Mediocampista Central", nota: meia_central},
            {nome:"Mediocampista Ofensivo", nota:meia_atacante },
            {nome:"Extremo", nota:ponta },
            {nome:"Delantero", nota:atacante },
            {nome:"Cabezón", nota:cabecudo },

        ]

        posicoes.sort((a,b) => (a.nota > b.nota) ? -1: 1)


        var stringNota = ""

        posicoes.forEach(posicao => {
            stringNota = stringNota + `${posicao.nome}: ${posicao.nota.toFixed(3)} || `
        })

        var nota = document.createElement("span");
        var novaLinha = document.createElement("br");

        nota.textContent = stringNota

        if (!window.location.href.includes("transfer")) header.appendChild(novaLinha)
        header.appendChild(nota)

    }

        }, 10000)


})();
