// ==UserScript==
// @name         JotinhaPiece
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Para você que não quer tomar nenhum spoiler da pagina Opex
// @author       winicius-o
// @match        https://onepieceex.net/*
// @icon         https://www.google.com/s2/favicons?domain=onepieceex.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431628/JotinhaPiece.user.js
// @updateURL https://update.greasyfork.org/scripts/431628/JotinhaPiece.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const body = document.body;
    const newStyle = document.createElement("style");
    const className = document.querySelector("#base").className;
    const button = document.querySelector("#adicionais > li.contador");

    let noticias = Array.from(document.querySelector("#noticias").children);


    const jotinhaThumbs = [
        {
            url: "https://i.imgur.com/GwNLtsB.png",
            title: "A marinha está recrutando!",
            description: "Akainu quer VOCÊ para servir o pais!",
        },
        {
            url: "https://i.imgur.com/7zBl4DL.png",
            title: "Akainu manda fotos sensualizando para barba branca",
            description: "Confira agora o pack completo que vazaram na DenDenNet",
        },
        {
            url: "https://i.imgur.com/8KFJJhR.png",
            title: "Luffy comeu a Gomu Gomu no mi",
            description: "O QUE ELE ESTAVA PENSANDO? AGORA ELE NUNCA MAIS VAI PORDER TOMAR BANHO",
        },
        {
            url: "https://i.imgur.com/ZfV1YSJ.png",
            title: "Quem são os almirantes da marinha?",
            description: "conheça um pouco mais sobre estes trabalhadores que mantem a ordem em nosso país 😍",
        },
        {
            url: "https://i.imgur.com/YB4xoJu.png",
            title: "Aokiji chega em ilha Drum",
            description: "em seu passeio turistico a paises frios, Kuzan chega a terrinha de Drum",
        },
        {
            url: "https://i.imgur.com/7aF8WgC.png",
            title: "Aokiji chega em Tequila Wolf",
            description: "Kuzan achou a região muito fria até pra ele 🥶",
        },
        {
            url: "https://i.imgur.com/1J4kVpM.png",
            title: "Aokiji sai para conhecer o mundo",
            description: "após se demitir do trabalho antigo, Kuzan decide que vai viver do ócio",
        },
        {
            url: "https://i.imgur.com/o1x705A.png",
            title: "Garp tem uma grande decepção",
            description: "Garp quase chora quando Luffy o informa que quer se tornar um pirata",
        },
        {
            url: "https://i.imgur.com/7aZsv9U.png",
            title: "Buggy na TV!",
            description: "enquanto o pau tá quebrando em marine ford, Buggy faz propaganda para ganhar apoio popular",
        },
        {
            url: "https://i.imgur.com/Ilp6qh1.png",
            title: "Forma hibrida de Kaido",
            description: "depois de tantas teorias, descobrimos que a forma hibrida de Kaido não é nada mais que...",
        },
        {
            url: "https://i.imgur.com/F3U76RW.png",
            title: "Ace aparece!",
            description: "Ace se encontra com o barco dos mugiwaras, descobrimos que ele só queria um prato de comida",
        },
        {
            url: "https://i.imgur.com/rn4SI2S.png",
            title: "Luffy tem muita fome",
            description: "Luffy não come por 5 horas e fica com cara de pidão nas mesas do restaurante"
        },
        {
            url: "https://i.imgur.com/8K55JSQ.png",
            title: "Doffy é humilhado",
            description: "depois de chamar Don flamingo de cibito baleado, luffy se destransforma do Gear 4 e tem que ser arrastado as pressas para longe do local",
        },
        {
            url: "https://i.imgur.com/rfCPd0h.png",
            title: "Big mama fofoca com o Bepo",
            description: "Big mama gostou do ursinho fofinho e decidiu contar o que tá escrito no poneglyph dela"
        },
        {
            url: "https://i.imgur.com/xIXJj7e.png",
            title: "Going merry está em manutenção",
            description: "going merry aparentemente está com problemas na quilha, por sorte um mecânico bonitão vai tentar salvar o dia",
        },
        {
            url: "https://i.imgur.com/adXY8oN.png",
            title: "Revelada nova gear do luffy",
            description: "o resultado foi um pouco descepcionante...",
        },
        {
            url: "https://i.imgur.com/Y0hFuKb.png",
            title: "Montblanc encontra o tesouro de skypea",
            description: "ele se questiona se valeu a pena ao custo de participar de um arco tão ruim",
        },
        {
            url: "https://i.imgur.com/fYlFc9G.png",
            title: "Revelado o novo almirante, o almirante verde",
            description: "ainda é desconhecido os limites de sua força"
        },
        {
            url: "https://i.imgur.com/0uNnuKW.png",
            title: "Sabo e Luffy se reencontram",
            description: "Ace esqueceu de comparecer",
        },
        {
            url: "https://i.imgur.com/GoEgTNb.png",
            title: "Veja qual foi o destino de cada mugiwara pós-timeskip",
            description: '"eu vi o zoro enfaixado e ele tinha um bundão" - Perona',
        }

    ];

    const corClara = "350,48,95";
    const corMedia = "350,62,74";
    const corEscura = "350,66,69";


    newStyle.setAttribute("id", "jotinhaStyle");
    newStyle.innerText = `:root {

        --cor-clara: rgba(${corClara},1);
        --cor-clara-90: rgba(${corClara},.9);
        --cor-clara-80: rgba(${corClara},.8);
        --cor-clara-70: rgba(${corClara},.7);
        --cor-clara-60: rgba(${corClara},.6);
        --cor-clara-50: rgba(${corClara},.5);
        --cor-clara-40: rgba(${corClara},.4);
        --cor-clara-30: rgba(${corClara},.3);
        --cor-clara-20: rgba(${corClara},.2);
        --cor-clara-10: rgba(${corClara},.15);


        --cor-media: rgba(${corMedia},1);
        --cor-media-90: rgba(${corMedia},.9);
        --cor-media-80: rgba(${corMedia},.8);
        --cor-media-70: rgba(${corMedia},.6);
        --cor-media-60: rgba(${corMedia},.6);
        --cor-media-50: rgba(${corMedia},.5);
        --cor-media-40: rgba(${corMedia},.4);
        --cor-media-30: rgba(${corMedia},.3);
        --cor-media-20: rgba(${corMedia},.2);
        --cor-media-10: rgba(${corMedia},.15);


        --cor-escura: rgba(${corEscura},1);
        --cor-escura-90: rgba(${corEscura},.9);
        --cor-escura-80: rgba(${corEscura},.8);
        --cor-escura-70: rgba(${corEscura},.7);
        --cor-escura-60: rgba(${corEscura},.6);
        --cor-escura-50: rgba(${corEscura},.5);
        --cor-escura-40: rgba(${corEscura},.4);
        --cor-escura-30: rgba(${corEscura},.3);
        --cor-escura-20: rgba(${corEscura},.2);
        --cor-escura-10: rgba(${corEscura},.15);

    }
    .${className} .personagem-topo {
        background: url('https://i.imgur.com/XWlfEKm.png');
        width: 300px;
        height: 350px;
        position: absolute;
        top: 0;
        left: 200px;
        z-index: 50;
        background-repeat: no-repeat;
    }
    @media (max-width: 990px) {
        .tema93709  .personagem-topo{top:40px; left:auto; right:0; width: 50%; height: 150px;background-size: contain; background-position: top right; }
    }
    `;

    body.appendChild(newStyle);
    //document.querySelector("#topo > h1 > a > img").setAttribute("style", "background-image: url(https://i.imgur.com/W3TRpeI.png)");

    const jotinhaThumbsCopy = jotinhaThumbs;
    noticias.forEach((elemento, index) => {
        if(!(index < 9)){
            return;
        }

        const random = getRandomInt(0, jotinhaThumbs.length);
        const jotinhaThumb = jotinhaThumbsCopy[random];
        const noticia = elemento.children[1];

        noticia.children[0].children[0].setAttribute("style", `background-image: url(${jotinhaThumb.url})`);
        noticia.children[1].innerHTML = jotinhaThumb.title;
        noticia.children[4].innerHTML = jotinhaThumb.description;
        noticia.children[2].remove()

        jotinhaThumbsCopy.splice(random, 1);
    });

    button.addEventListener("click", (event) => {
        document.querySelector("#jotinhaStyle").remove();
            noticias.forEach((noticia) => {
                noticia.children[1].children[0].children[0].removeAttribute("style");
            });
    });

})();
