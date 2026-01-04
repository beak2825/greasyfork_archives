// ==UserScript==
// @name         PontuacaoMZ
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ferramenta que da uma pontuação para seus jogadores para cada posição
// @author       Gabriel Menezes (mz_seds)
// @match        https://www.managerzone.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422968/PontuacaoMZ.user.js
// @updateURL https://update.greasyfork.org/scripts/422968/PontuacaoMZ.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {

        var players_container = document.getElementById("players_container");
        var players_html = players_container.children;


    var pesos =
        {
            "Goleiro": {
                "Velocidade": 2,
                "Resistência": 8,
                "Inteligência": 8,
                "Passe Curto": 0,
                "Chute": 0,
                "Cabeceio": 0,
                "Defesa a Gol": 8,
                "Controle de Bola": 2,
                "Desarme": 0,
                "Passe Longo": 2,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma": 8
            },
            "Zagueiro": {
                "Velocidade": 7,
                "Resistência": 3,
                "Inteligência": 8,
                "Passe Curto": 6,
                "Chute": 0,
                "Cabeceio": 0,
                "Defesa a Gol": 0,
                "Controle de Bola": 3,
                "Desarme": 8,
                "Passe Longo": 3,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma": 3
            },
            "Lateral": {
                "Velocidade": 9,
                "Resistência": 8,
                "Inteligência": 3,
                "Passe Curto": 7,
                "Chute": 0,
                "Cabeceio": 0,
                "Defesa a Gol": 0,
                "Controle de Bola": 7,
                "Desarme": 9,
                "Passe Longo": 4,
                "Bola Parada": 0,
                "Experiência": 10,
                "Forma": 8
            },
            "Volante": {
                "Velocidade": 7,
                "Resistência": 8,
                "Inteligência": 8,
                "Passe Curto": 8,
                "Chute": 0,
                "Cabeceio": 0,
                "Defesa a Gol": 0,
                "Controle de Bola": 2,
                "Desarme": 8,
                "Passe Longo": 7,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma": 8
            },
            "Meia Central": {
                "Velocidade": 7,
                "Resistência": 8,
                "Inteligência": 8,
                "Passe Curto": 8,
                "Chute": 1,
                "Cabeceio": 0,
                "Defesa a Gol":	0,
                "Controle de Bola": 5,
                "Desarme": 1,
                "Passe Longo": 8,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma": 8
            },
            "Meia Atacante": {
                "Velocidade": 6,
                "Resistência": 8,
                "Inteligência": 8,
                "Passe Curto": 8,
                "Chute": 8,
                "Cabeceio": 0,
                "Defesa a Gol": 0,
                "Controle de Bola": 7,
                "Desarme": 7,
                "Passe Longo": 7,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma": 8
            },
            "Ponta": {
               "Velocidade": 9,
                "Resistência": 8,
                "Inteligência": 5,
                "Passe Curto": 3,
                "Chute": 0,
                "Cabeceio": 0,
                "Defesa a Gol": 0,
                "Controle de Bola": 8,
                "Desarme": 0,
                "Passe Longo": 8,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma":	8
            },
            "Atacante": {
                "Velocidade": 8,
                "Resistência": 8,
                "Inteligência": 8,
                "Passe Curto": 3,
                "Chute": 8,
                "Cabeceio": 2,
                "Defesa a Gol": 0,
                "Controle de Bola": 6,
                "Desarme": 1,
                "Passe Longo": 0,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma":	8
            },
            "Cabeçudo": {
                "Velocidade": 4,
                "Resistência": 8,
                "Inteligência": 8,
                "Passe Curto": 2,
                "Chute": 8,
                "Cabeceio": 8,
                "Defesa a Gol": 0,
                "Controle de Bola": 5,
                "Desarme": 0,
                "Passe Longo": 0,
                "Bola Parada": 0,
                "Experiência": 8,
                "Forma": 8
            }
    }

    var habilidades = [
        "Velocidade",
        "Resistência",
        "Inteligência",
        "Passe Curto",
        "Chute",
        "Cabeceio" ,
        "Defesa a Gol",
        "Controle de Bola",
        "Desarme",
        "Passe Longo",
        "Bola Parada",
        "Experiência",
        "Forma"
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


        var goleiro = calcularNotaPorPosicao(jogador, "Goleiro")
        var zagueiro = calcularNotaPorPosicao(jogador, "Zagueiro")
        var lateral = calcularNotaPorPosicao(jogador, "Lateral")
        var volante = calcularNotaPorPosicao(jogador, "Volante")
        var meia_central = calcularNotaPorPosicao(jogador, "Meia Central")
        var meia_atacante = calcularNotaPorPosicao(jogador, "Meia Atacante")
        var ponta = calcularNotaPorPosicao(jogador, "Ponta")
        var atacante = calcularNotaPorPosicao(jogador, "Atacante")
        var cabecudo = calcularNotaPorPosicao(jogador, "Cabeçudo")

        const posicoes = [
            {nome: "Goleiro", nota: goleiro},
            {nome:"Zagueiro", nota: zagueiro},
            {nome:"Lateral", nota: lateral},
            {nome:"Volante", nota: volante},
            {nome:"Meia Central", nota: meia_central},
            {nome:"Meia Atacante", nota:meia_atacante },
            {nome:"Ponta", nota:ponta },
            {nome:"Atacante", nota:atacante },
            {nome:"Cabeçudo", nota:cabecudo },

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
