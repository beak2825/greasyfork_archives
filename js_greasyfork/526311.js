// ==UserScript==
// @name         SproutTurbo-Extractor
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Facilita a Execução das Tarefas de Alguns Empregadores da Sprout. O Script Pega no Codigo Fonte da Pagina o Codigo e o 10° Link Para Fazer a Tarefa de Alguns Empregadores.
// @author       ScripterOficial
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526311/SproutTurbo-Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/526311/SproutTurbo-Extractor.meta.js
// ==/UserScript==

(async function () {
    function criarBotaoParaPararScript() {
        const botaoParar = document.createElement('button');
        botaoParar.textContent = 'Parar Script';
        botaoParar.style.position = 'fixed';
        botaoParar.style.bottom = '10px';
        botaoParar.style.right = '10px';
        botaoParar.style.padding = '18px';
        botaoParar.style.backgroundColor = '#2e333f';
        botaoParar.style.color = '#c8cfd8';
        botaoParar.style.border = 'none';
        botaoParar.style.borderRadius = '5px';
        botaoParar.style.cursor = 'pointer';
        botaoParar.style.fontFamily = 'monospace';
        botaoParar.style.fontSize = '1.5em';
        botaoParar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        botaoParar.style.transition = 'background-color 0.3s';

        botaoParar.onmouseover = function () {
            botaoParar.style.backgroundColor = '#3c454e';
        };

        botaoParar.onmouseout = function () {
            botaoParar.style.backgroundColor = '#2e333f';
        };

        botaoParar.onclick = function () {
            document.cookie = "pararScript=true; max-age=" + 2 * 60; // 2 minutos
            alert('Script parado por 2 minutos.');
            location.reload();
        };

        document.body.appendChild(botaoParar);
    }

    function copiarTextoDoElemento(id) {
        const elemento = document.getElementById(id);
        if (elemento) {
            const areaTextoTemporaria = document.createElement("textarea");
            areaTextoTemporaria.value = elemento.innerText;
            document.body.appendChild(areaTextoTemporaria);
            areaTextoTemporaria.select();
            document.execCommand("copy");
            document.body.removeChild(areaTextoTemporaria);
        }
    }

    function verificarSeScriptFoiPausadoPeloCookie() {
        return document.cookie.split('; ').find(row => row.startsWith('pararScript='))?.split('=')[1] === 'true';
    }

    if (verificarSeScriptFoiPausadoPeloCookie()) {
        return;
    }

    async function buscarLinkAleatorio() {
        try {
            const resposta = await fetch(`${window.location.origin}/wp-json/wp/v2/posts?per_page=12`);

            if (!resposta.ok) {
                throw new Error(`Erro na requisição: ${resposta.status}`);
            }

            const posts = await resposta.json();

            if (posts.length === 0) return null;

            const indiceAleatorio = Math.floor(Math.random() * posts.length);
            window.link10 = posts[indiceAleatorio].link;
            return posts[indiceAleatorio].link;
        } catch (erro) {
            return null;
        }
    }

    async function executarExtracao() {
        const elementoContagemRegressiva = document.getElementById("countdownContainer");

        if (!elementoContagemRegressiva) {
            return;
        }

        const link = await buscarLinkAleatorio();

        if (!link || !link.startsWith("http")) {
            return;
        }

        try {
            const resposta = await fetch(window.location.href);
            const texto = await resposta.text();

            const parser = new DOMParser();
            const documento = parser.parseFromString(texto, "text/html");

            const scripts = documento.querySelectorAll("script");
            let codigoExtraido = "";

            scripts.forEach(script => {
                if (script.textContent.includes("Code:")) {
                    codigoExtraido = script.textContent.match(/Code:\s*(\S+)/)?.[1];
                }
            });

            if (!codigoExtraido) return;

            ["Code: ", "';", "Code:"].forEach(pattern => {
                codigoExtraido = codigoExtraido.replaceAll(pattern, "");
            });

            document.body.innerHTML = `
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: monospace;
            font-size: 1.5em;
            color: #c8cfd8;
            background: #343944;
            margin: 0;
            line-height: 1.3em;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        a {
            color: #5294e2;
        }
        b {
            color: #6a9e41;
        }
        .window {
            background: #404552;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border-radius: 5px;
            border: 2px solid #2e333f;
            width: 95vw;
            margin: auto;
        }
        .window_header {
            background: #2e333f;
            color: #c8cfd8;
            padding: 7px;
        }
        .window_title {
            display: inline-block;
        }
        .window_minimize_button, .window_maximize_button, .window_close_button {
            border-radius: 7px;
            width: 12px;
            height: 12px;
            display: inline-block;
            float: right;
            margin-left: 6px;
        }
        .window_minimize_button {
            background: #2cc640;
            border: 1px solid #51a75c;
        }
        .window_maximize_button {
            background: #fdbf2e;
            border: 1px solid #d6a839;
        }
        .window_close_button {
            background: #fe6256;
            border: 1px solid #ca5f59;
        }
        .window_content {
            padding: 12px;
        }
        .blink {
            animation: blinking 1s infinite;
        }
        @keyframes blinking {
            0% { clear: both; }
            50% { color: transparent; }
        }
        @media screen and (max-width: 800px) {
            body {
                padding-top: 5px;
            }
            .window {
                width: 98%;
            }
        }
        #extracted-code, #thepage {
            cursor: pointer;
            text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
        }
    </style>
</head>
<body>
    <div class="window">
        <div class="window_header">
            <div class="window_title">SproutTurbo By -Scripter-</div>
            <div class="window_close_button"></div>
            <div class="window_maximize_button"></div>
            <div class="window_minimize_button"></div>
        </div>
        <div class="window_content">
            <br>
            <center>Codigo Encontrado com Sucesso</center><br>
            O Codigo é  <span id="extracted-code" style="color:red">${codigoExtraido}</span><br><br>
            O Link 10 é  <span id="thepage" style="color:red">${link10}</span><br><br>
            <b>Scripter@SproutTurbo:~$</b> <span class="blink">_</span><br>
        </div>
    </div>
</body>
</html>
            `;

            criarBotaoParaPararScript();

            document.getElementById("extracted-code").addEventListener("click", () => copiarTextoDoElemento("extracted-code"));
            document.getElementById("thepage").addEventListener("click", () => copiarTextoDoElemento("thepage"));

        } catch (erro) {
            alert("Erro ao buscar o código-fonte.");
        }
    }

    // Usando window.onload para garantir que tudo carregue primeiro
    window.onload = function() {
        const SproutTurboExtractorTimeout = setTimeout(() => {
            executarExtracao();
        }, 1000); // Espera 1 segundo para iniciar a execução após o carregamento da página.
    };

})();
