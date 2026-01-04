// ==UserScript==
// @name         Frag Ennhancer
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Melhorias gerais pro Fragrantica BR.
// @author       Lucas S.
// @match        https://www.fragrantica.com.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491377/Frag%20Ennhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/491377/Frag%20Ennhancer.meta.js
// ==/UserScript==

	// Remove spam do eBay
(function() {
	'use strict';

	const removerIframe = () => {
		const iframe = document.getElementById('idIframeMMM');
		if (iframe) {
			iframe.remove();
			console.log("Iframe 'idIframeMMM' removido.");
		}
	};

	// Remove notícias
	const removerElementosComLinksEspecificos = () => {
		document.querySelectorAll('.grid-x.grid-margin-x.grid-margin-y').forEach(element => {
			if (element.querySelector('a[href*="https://www.fragrantica.com.br/novidades/"]')) {
				element.remove();
				console.log("Elemento com link para novidades removido.");
			}
		});
	};

	// Remove botão do eBay em baixo da foto do perfume
	const removerBotaoEspecifico = () => {
		const botao = document.querySelector("#main-content > div:nth-child(1) > div.small-12.medium-12.large-9.cell > div > div:nth-child(10) > div > div:nth-child(4) > div > div > button");
		if (botao) {
			botao.remove();
			console.log("Botão eBay removido.");
		}
	};
	const removerElementoAdicional = () => {
		const elementoAdicional = document.evaluate('//*[@id="main-content"]/div[1]/div[1]/div/div[2]/div[3]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (elementoAdicional) {
			elementoAdicional.remove();
			console.log("Elemento adicional eBay removido.");
		}
	};

	// Aumenta tamanho da legenda da nota
	const modificarEstiloElemento = () => {
		const elemento = document.querySelector("#main-content > div:nth-child(1) > div.small-12.medium-12.large-9.cell > div > div:nth-child(2) > div:nth-child(5) > div.small-12.medium-6.text-center > div > p.info-note");
		if (elemento) {
			elemento.style.fontSize = '18px';
			elemento.style.background = '#F7FAFF';
			console.log("Estilo do elemento modificado.");
		}
	};

    // Cria orb com nota
    const criarElementoCircular = () => {
        const valorElemento = document.querySelector("#main-content > div:nth-child(1) > div.small-12.medium-12.large-9.cell > div > div:nth-child(2) > div:nth-child(5) > div.small-12.medium-6.text-center > div > p.info-note > span:nth-child(1)");
        const imgElement = document.querySelector("#main-content > div:nth-child(1) > div.small-12.medium-12.large-9.cell > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p > a > img");

        if (valorElemento && imgElement && !document.querySelector('.circular-value')) {
            const valor = valorElemento.textContent || 'N/A';

            const circle = document.createElement('div');
            circle.textContent = valor;
            circle.className = 'circular-value';
            circle.style = `
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background-color: #4CAF50;
                color: white;
                text-align: center;
                line-height: 50px;
                position: absolute;
                transform: translateX(-100%);
                left: 50;
                font-weight: bold;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                margin-right: 5px;
            `;

            // Adiciona o círculo perto do elemento da imagem
            imgElement.parentNode.insertBefore(circle, imgElement);
        }
    };

	// Adiciona a porcentagem de similaridade acima da imagem do perfume
	const adicionarPorcentagemSimilaridade = () => {
		const voteSpans = Array.from(document.querySelectorAll('span[style="font-size: 0.8rem;"]:not(.processed)'));

		for (let i = 0; i < voteSpans.length; i += 2) {
			if (voteSpans[i + 1]) {
				const yesVotes = parseInt(voteSpans[i].textContent, 10);
				const noVotes = parseInt(voteSpans[i + 1].textContent, 10);
				const totalVotes = yesVotes + noVotes;
				const similarityPercentage = totalVotes > 0 ? ((yesVotes / totalVotes) * 100).toFixed(2) : "0.00";

				// Cria um novo elemento div para conter a porcentagem
				const percentageDiv = document.createElement('div');
				percentageDiv.style = "font-size: 0.8rem; color: green; position: absolute; transform: translateY(-100%); top: 0; left: 27%;";
				percentageDiv.textContent = `(${similarityPercentage}%)`;

				// Encontra o elemento mais próximo que pode atuar como container para posicionar absolutamente o novo div
				const container = voteSpans[i].closest('.cell');

				if (container && !container.querySelector('.similarity-percentage')) {
					// Garante que o container esteja posicionado relativamente para que o transform funcione corretamente
					container.style.position = 'relative';
					container.insertBefore(percentageDiv, container.firstChild);
					container.classList.add('similarity-percentage'); // Marca o container para evitar duplicatas
				}

				// Marca os spans processados para evitar reprocessamento
				voteSpans[i].classList.add('processed');
				voteSpans[i + 1].classList.add('processed');
			}
		}
	};

	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (!mutation.addedNodes) return;

			let iframeEncontrado = false;
			let elementoComLinkEncontrado = false;
			let botaoEncontrado = false;
			let elementoAdicionalEncontrado = false;

			for (let i = 0; i < mutation.addedNodes.length; i++) {
				if (mutation.addedNodes[i].id === 'idIframeMMM') {
					iframeEncontrado = true;
				}
				if (mutation.addedNodes[i].nodeType === 1) {
					if (mutation.addedNodes[i].matches('.grid-x.grid-margin-x.grid-margin-y') && mutation.addedNodes[i].querySelector('a[href*="https://www.fragrantica.com.br/novidades/"]')) {
						elementoComLinkEncontrado = true;
					}
					if (document.querySelector("#main-content > div:nth-child(1) > div.small-12.medium-12.large-9.cell > div > div:nth-child(10) > div > div:nth-child(4) > div > div > button")) {
						botaoEncontrado = true;
					}
					if (document.evaluate('//*[@id="main-content"]/div[1]/div[1]/div/div[2]/div[3]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
						elementoAdicionalEncontrado = true;
					}
				}
			}

			if (iframeEncontrado) removerIframe();
			if (elementoComLinkEncontrado) removerElementosComLinksEspecificos();
			if (botaoEncontrado) removerBotaoEspecifico();
			if (elementoAdicionalEncontrado) removerElementoAdicional();

			// Chamada para modificar o estilo a cada mutação, para garantir que as alterações sejam aplicadas
            criarElementoCircular();
			adicionarPorcentagemSimilaridade();
			modificarEstiloElemento();
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	// Chama as funções de alteração
	removerIframe();
	removerElementosComLinksEspecificos();
	removerBotaoEspecifico();
	removerElementoAdicional();
	modificarEstiloElemento();

	// Chama a função para adicionar porcentagem de similaridade quando a página é carregada
	window.addEventListener('load', adicionarPorcentagemSimilaridade);
    window.addEventListener('load', criarElementoCircular);
})();