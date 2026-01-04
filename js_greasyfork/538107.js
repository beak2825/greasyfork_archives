// ==UserScript==
// @name         Binance Copy Trading Spot - Filtros Avançados
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filtros para perfis conservador, moderado e agressivo na Binance Copy Trading Spot
// @author       SeuNome
// @match        https://www.binance.com/pt-BR/copy-trading/spot*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538107/Binance%20Copy%20Trading%20Spot%20-%20Filtros%20Avan%C3%A7ados.user.js
// @updateURL https://update.greasyfork.org/scripts/538107/Binance%20Copy%20Trading%20Spot%20-%20Filtros%20Avan%C3%A7ados.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ajuste os seletores conforme estrutura atual da página
    // Exemplo genérico para cards de portfólio
    function getPortfolios() {
        return Array.from(document.querySelectorAll('div.css-1ix4y3v')); // exemplo, verificar seletor correto
    }

    // Extrai número de string com %, USDT, etc.
    function extractNumber(text) {
        if (!text) return NaN;
        return parseFloat(text.replace(/[^\d.-]/g, ''));
    }

    // Extrai tags (exemplo simples)
    function extractTags(portfolio) {
        const tagsElements = portfolio.querySelectorAll('div.tag-class'); // ajustar seletor real
        return Array.from(tagsElements).map(t => t.innerText.trim());
    }

    // Função para filtrar portfólios por perfil
    function filterPortfolios(portfolios, perfil) {
        return portfolios.filter(p => {
            try {
                const roiText = p.querySelector('div[title*="ROI"]')?.innerText || '';
                const mddText = p.querySelector('div[title*="Perda máxima"]')?.innerText || '';
                const aumText = p.querySelector('div[title*="AUM"]')?.innerText || '';
                const participationText = p.querySelector('div[title*="Participação nos lucros"]')?.innerText || '';
                const minCopyText = p.querySelector('div[title*="Quantia mínima"]')?.innerText || '';
                const tags = extractTags(p);

                const roi = extractNumber(roiText);
                const mdd = extractNumber(mddText);
                const aum = extractNumber(aumText);
                const participation = extractNumber(participationText);
                const minCopy = extractNumber(minCopyText);

                if (isNaN(roi) || isNaN(mdd) || isNaN(aum) || isNaN(participation) || isNaN(minCopy)) {
                    return false;
                }

                if (perfil === 'conservador') {
                    return roi >= 0 && mdd <= 10 && aum >= 25000 && participation <= 10 && minCopy <= 50 &&
                           (tags.includes('Mais Resiliente') || tags.includes('Crescimento sólido'));
                }
                if (perfil === 'moderado') {
                    return roi >= 25 && mdd <= 30 && aum >= 100000 && participation <= 10 && minCopy <= 100 &&
                           (tags.includes('Criador de Dinheiro') || tags.includes('Gestor de Baleias'));
                }
                if (perfil === 'agressivo') {
                    return roi >= 50 && mdd <= 70 && aum >= 250000 && participation <= 10 && minCopy <= 1000 &&
                           (tags.includes('Melhor desempenho') || tags.includes('Gestor de Baleias'));
                }
                return false;
            } catch (e) {
                console.error('Erro ao filtrar portfólio:', e);
                return false;
            }
        });
    }

    // Destaca portfólios filtrados
    function highlightPortfolios(portfolios) {
        portfolios.forEach(p => {
            p.style.border = '3px solid #4CAF50';
            p.style.backgroundColor = '#e6ffe6';
            p.scrollIntoView({behavior: "smooth", block: "center"});
        });
    }

    // Remove destaques
    function clearHighlights(portfolios) {
        portfolios.forEach(p => {
            p.style.border = '';
            p.style.backgroundColor = '';
        });
    }

    // Cria painel de botões para seleção de perfil
    function createFilterButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '120px';
        container.style.right = '20px';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.zIndex = 10000;
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

        const title = document.createElement('div');
        title.innerText = 'Filtros Copy Trading';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '8px';
        container.appendChild(title);

        ['conservador', 'moderado', 'agressivo'].forEach(perfil => {
            const btn = document.createElement('button');
            btn.innerText = perfil.charAt(0).toUpperCase() + perfil.slice(1);
            btn.style.margin = '4px';
            btn.style.padding = '6px 12px';
            btn.style.cursor = 'pointer';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.backgroundColor = '#007bff';
            btn.style.color = 'white';
            btn.onmouseenter = () => btn.style.backgroundColor = '#0056b3';
            btn.onmouseleave = () => btn.style.backgroundColor = '#007bff';

            btn.onclick = () => {
                const portfolios = getPortfolios();
                clearHighlights(portfolios);
                const filtered = filterPortfolios(portfolios, perfil);
                if (filtered.length === 0) {
                    alert(`Nenhum portfólio encontrado para o perfil ${perfil}`);
                } else {
                    highlightPortfolios(filtered);
                }
            };
            container.appendChild(btn);
        });

        const clearBtn = document.createElement('button');
        clearBtn.innerText = 'Limpar Filtro';
        clearBtn.style.margin = '4px';
        clearBtn.style.padding = '6px 12px';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '4px';
        clearBtn.style.backgroundColor = '#6c757d';
        clearBtn.style.color = 'white';
        clearBtn.onmouseenter = () => clearBtn.style.backgroundColor = '#5a6268';
        clearBtn.onmouseleave = () => clearBtn.style.backgroundColor = '#6c757d';

        clearBtn.onclick = () => {
            const portfolios = getPortfolios();
            clearHighlights(portfolios);
        };
        container.appendChild(clearBtn);

        document.body.appendChild(container);
    }

    // Aguarda carregamento dos portfólios e inicializa
    function waitForPortfolios() {
        const interval = setInterval(() => {
            const portfolios = getPortfolios();
            if (portfolios.length > 0) {
                clearInterval(interval);
                createFilterButtons();
                console.log('Binance Copy Trading Filter: Botões criados');
            }
        }, 1000);
    }

    waitForPortfolios();

})();
