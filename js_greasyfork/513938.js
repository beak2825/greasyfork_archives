// ==UserScript==
// @name        Gotta go fast - PPM Autographs
// @namespace   Violentmonkey Scripts
// @author      Drinkwater
// @license     MIT
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @grant       none
// @version     1.7
// @description Go, go, go, go, go, go, go Gotta go fast Gotta go fast Gotta go faster, faster, faster, faster, faster! Sonic X
// @downloadURL https://update.greasyfork.org/scripts/513938/Gotta%20go%20fast%20-%20PPM%20Autographs.user.js
// @updateURL https://update.greasyfork.org/scripts/513938/Gotta%20go%20fast%20-%20PPM%20Autographs.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let timeInFirstCollect = 0;
    let firstBookTimestamp = null;
    let minuteDelay = 5; // Delay padrão de 5 minutos
    let remainingDelay = 0;
    let firstBookId = 0;
    let indexPeopleBloc = 0;
    let fixedBookIds = [];
    let isProcessingBlock = false; // Para evitar múltiplas chamadas ao temporizador
    let continuaColeta = false;


    // Função para coletar as pessoas dentro do contexto do iframe
    async function getPeopleToCollect(iframe) {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let people = [];

        let initialPeopleTable = iframeDocument.querySelector('#tablepeople');

        // Check the #ctl00_cphLeftColumn_ctl00_chkAutograph checkbox
        let autographCheckbox = iframeDocument.querySelector('#ctl00_cphLeftColumn_ctl00_chkAutograph');
        if (autographCheckbox) {
            autographCheckbox.checked = true;
        }

        // Uncheck other checkboxes
        let otherCheckboxes = [
            '#ctl00_cphLeftColumn_ctl00_chkOnline',
            '#ctl00_cphLeftColumn_ctl00_chkGame',
            '#ctl00_cphLeftColumn_ctl00_chkRelationships'
        ];

        otherCheckboxes.forEach(selector => {
            let checkbox = iframeDocument.querySelector(selector);
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
            }
        });

        // Trigger the filter button click
        let filterButton = iframeDocument.querySelector('#ctl00_cphLeftColumn_ctl00_btnFilter');
        if (filterButton) {
            filterButton.click();
        } else {
            throw new Error("Filter button not found.");
        }

        // Check every second if the people table has updated
        return new Promise((resolve) => {
            let interval = setInterval(() => {
                let newIframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                let newPeopleTable = newIframeDocument.querySelector('#tablepeople');

                if (newPeopleTable && newPeopleTable !== initialPeopleTable) {
                    clearInterval(interval); // Stop checking

                    // Collect data from the new table
                    Array.from(newPeopleTable.querySelectorAll('tbody tr')).forEach(row => {
                        let characterLink = row.querySelector('a');
                        let statusText = row.querySelectorAll('td')[1]?.textContent.trim();
                        let status = (!statusText || statusText === "Online") ? "Disponível" : "Ocupado";

                        if (status === "Disponível" && characterLink) {
                            people.push({
                                name: characterLink.textContent,
                                id: characterLink.href.split('/').pop(),
                                status: status
                            });
                        }
                    });

                    resolve(people); // Resolve the Promise with available people
                }
            }, 1000);
        });
    }


    // Função para criar o iframe e garantir que ele esteja completamente carregado
    async function createIframe() {
        let domain = window.location.hostname;
        let path = '/World/Popmundo.aspx/City/PeopleOnline/';
        let url = 'https://' + domain + path;

        // Cria o iframe
        let iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Retorna o iframe, mas garante que ele esteja carregado antes de usá-lo
        return new Promise((resolve, reject) => {
            iframe.onload = function () {
                resolve(iframe);
            };
            iframe.onerror = function () {
                reject('Erro ao carregar o iframe');
            };
        });
    }

    // Função para logar dados
    let LOG_INDEX = 0;
    function log(data) {
        if (window.parent === window) {
            jQuery("#logs-autografos").append(`<tr class="${LOG_INDEX % 2 == 0 ? "odd" : "even"}" drinkwater><td drinkwater>${data}</td></tr>`);
            LOG_INDEX++;
        }
    }


    async function goToLocation(iframe, charId, charName) {
        let iframeActualHost = iframe.contentWindow.location.host;
        let domain = iframeActualHost;
        let path = `/World/Popmundo.aspx/Character/${charId}`;
        let url = 'https://' + domain + path;

        // Carrega a primeira URL e espera carregar
        iframe.src = url;
        await waitForIframeLoad(iframe);

        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Tenta acessar o link de interação
        let locationLink = iframeDocument.querySelector('#ctl00_cphRightColumn_ctl00_lnkInteract')?.href || iframeDocument.querySelector('#ctl00_cphRightColumn_ctl00_btnInteract')?.href;
        let links
        if (!locationLink) {
            let characterPresentation = iframeDocument.querySelector('.characterPresentation');
            if (characterPresentation) {
                links = characterPresentation.querySelectorAll('a');
                if (links.length > 0) {
                    let lastLink = links[links.length - 1];
                    let href = lastLink.getAttribute('href');
                    let locationId = href.split('/').pop();
                }
                if (!locationId) {
                    log(`Talvez ${charName} não está mais na cidade, ou algo aconteceu!`);
                    return;
                }
                locationLink = `https://${domain}/World/Popmundo.aspx/Locale/MoveToLocale/${locationId}/${charId}`;
            }
        }

        if (locationLink.startsWith('javascript:')) {
            //click the link if it starts with javascript:
            const interactBtn = iframeDocument.querySelector('#ctl00_cphRightColumn_ctl00_btnInteract');
            interactBtn.click();
            await waitForIframeLoad(iframe);
            return;
        }

        // Remove o domínio, mantendo apenas a parte a partir de /World/
        let relativePath = locationLink.includes('/World/') ? locationLink.split('/World/')[1] : null;
        if (!relativePath) {
            log('Algo de errado não está certo! Mas continuamos !');
            console.log(relativePath)
            console.log(locationLink)
            return;
        }

        // Cria a nova URL com o caminho relativo
        let newUrl = 'https://' + iframe.contentWindow.location.host + '/World/' + relativePath;
        log(`Movendo até o local de <b>${charName}</b>`);
        iframe.src = newUrl;

        // Aguarda o segundo carregamento do iframe
        await waitForIframeLoad(iframe);
    }

    // Função para aguardar o carregamento do iframe
    function waitForIframeLoad(iframe) {
        return new Promise((resolve) => {
            iframe.onload = function () {
                //simular tempo humano de espera
                setTimeout(() => {
                    resolve();
                }, 2000); // Espera 1 segundo para simular o tempo de carregamento humano
            };
        });
    }

    async function getBookIds(iframe, person) {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let bookIds = [];

        let select = jQuery(iframeDocument).find('#ctl00_cphTopColumn_ctl00_ddlUseItem');
        if (select.length === 0) {
            log(`Aparentemente <b>${person.name}</b> não está mais disponível ou não deixa usar itens`);
            // Armazenar o char no localStorage para não tentar novamente
            let blockedChars = JSON.parse(localStorage.getItem('chars-block-itens')) || [];
            if (!blockedChars.includes(person.id)) {
                blockedChars.push(person.id);
                localStorage.setItem('chars-block-itens', JSON.stringify(blockedChars));
                log(`Armazenando char ${person.name} (${person.id}) no localStorage para não tentar novamente.`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            return [];
        }

        jQuery(iframeDocument).find('#ctl00_cphTopColumn_ctl00_ddlUseItem option').each(function () {
            let optionText = jQuery(this).text().trim();
            let optionValue = jQuery(this).val();

            if (optionText === 'Livro de autógrafos' || optionText === 'Autograph book') {
                bookIds.push(optionValue);

                if (firstBookId === 0) {
                    firstBookId = optionValue;
                }
            }
        });

        return bookIds;
    }



    async function collectAutograph(iframe, bookId, person, isLastPersonInBlock = false, iframeLoadsInCycle = 1) {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        let select = iframeDocument.querySelector('#ctl00_cphTopColumn_ctl00_ddlUseItem');
        if (!select || select.length === 0) {
            return;
        }
        select.value = bookId;

        if (bookId === firstBookId && !firstBookTimestamp) {
            firstBookTimestamp = Date.now();
            log(`Primeiro uso do livro às: ${new Date(firstBookTimestamp).toLocaleTimeString()}`);
        }

        let submitButton = iframeDocument.querySelector('#ctl00_cphTopColumn_ctl00_btnUseItem');
        if (!submitButton) {
            log(`Não foi possível encontrar o botão de uso do item para <b>${person.name}</b>`);
            return;
        }

        submitButton.click();
        await waitForIframeLoad(iframe);

        // Na última pessoa, calcular o delay restante baseado no primeiro uso do livro
        if (isLastPersonInBlock && firstBookTimestamp) {
            // Considera o tempo de humanização (2s por carregamento de iframe)
            let now = Date.now();
            let elapsedMs = now - firstBookTimestamp;
            let iframeHumanizationMs = iframeLoadsInCycle * 2000;
            let elapsedTime = Math.floor((elapsedMs + iframeHumanizationMs) / 60000);
            remainingDelay = Math.max(0, minuteDelay - elapsedTime);  // Armazenar o delay calculado

            log(`Tempo decorrido desde o primeiro uso (incluindo humanização): ${elapsedTime} minutos.`);
            log(`Delay restante para o próximo bloco: ${remainingDelay} minutos.`);

            // Resetar o timestamp para o próximo bloco
            firstBookTimestamp = null;
        }
    }

    function startDelayTimer(minutes) {
        let timerMessage = jQuery('#timer-message');
        let totalSeconds = minutes * 60;

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                let minutesLeft = Math.floor(totalSeconds / 60);
                let secondsLeft = totalSeconds % 60;

                timerMessage.text(`Esperando: ${minutesLeft} minutos e ${secondsLeft} segundos restantes...`);

                if (totalSeconds <= 0) {
                    clearInterval(interval);
                    timerMessage.text('Continuando a coleta de autógrafos...');
                    setTimeout(() => timerMessage.text(''), 2000); // Limpa a mensagem após 2 segundos
                    resolve();
                }

                totalSeconds--;
            }, 1000);
        });
    }



    jQuery(document).ready(function () {
        jQuery('#checkedlist').before('<div class="box" id="autografos-box" drinkwater><h2 drinkwater>Coletar Autógrafos</h2></div>');
        jQuery('#autografos-box').append('<p drinkwater>O script usará todos os livros do seu inventário, para coletar autógrafos de popstars presentes na cidade!</p>');
        jQuery('#autografos-box').append('<p class="actionbuttons" drinkwater> <input type="button" name="btn-iniciar-coleta" value="Iniciar" id="inicar-coleta" class="rmargin5" drinkwater> <input type="button" name="btn-parar-coleta" value="Parar" id="parar-coleta" class="rmargin5" drinkwater> <input type="button" name="btn-clear-storage" value="Limpar chars que não aceitam uso de itens" id="limpar-chars" class="rmargin5" drinkwater></p>');
        jQuery('#autografos-box').append('<div id="timer-message" style="font-weight: bold; color: red;" drinkwater></div>');
        jQuery('#autografos-box').append('<table id="logs-autografos" class="data dataTable" drinkwater></table>');
        jQuery('#logs-autografos').append('<tbody drinkwater><tr drinkwater><th drinkwater>Logs</th></tr></tbody>');

        let bookAmount;
        const bookElement = jQuery('#checkedlist a:contains("Livro de autógrafos")');
        if (bookElement.length > 0) {
            const bookQuantity = bookElement.closest('td').find('em').text().trim();
            debugger
            if (bookQuantity.startsWith('x')) {
                bookAmount = parseInt(bookQuantity.substring(1));
                log(`Quantidade de livros de autógrafos encontrada: ${bookAmount}`);
            } else {
                bookAmount = bookElement.length;
            }
        } else {
            log('Nenhum Livro de autógrafos encontrado.');
        }


        let bookIndex = 0; // Inicia o índice do livro
        let lastCycleIds = [];       // ← NOVO: quem recebeu autógrafo no ciclo anterior


        jQuery('#inicar-coleta').click(async function () {
            continuaColeta = true;
            jQuery('#inicar-coleta').prop('disabled', true);
            jQuery('#parar-coleta').prop('disabled', false);
            jQuery('#inicar-coleta').prop('value', 'Coletando Autografos...');
            // utilitário de espera
            const esperarSegundos = s => new Promise(r => setTimeout(r, s * 1000));

            /* ------------------------------------------------------------------
             * LOOP PRINCIPAL • tenta usar exatamente "bookAmount" livros por ciclo
             * -----------------------------------------------------------------*/
            while (continuaColeta) {
                try {
                    /* ---------- snapshot inicial ---------- */
                    let iframe = await createIframe();
                    let queue = await getPeopleToCollect(iframe);
                    const blockedChars = JSON.parse(localStorage.getItem('chars-block-itens')) || [];
                    queue = queue.filter(
                        p => !blockedChars.includes(p.id) && !lastCycleIds.includes(p.id)
                    );

                    if (queue.length === 0) {
                        log('Nenhuma pessoa elegível encontrada. Tentarei novamente em 60 s.');
                        await esperarSegundos(60);
                        continue;
                    }

                    let livrosUsados = 0;      // quantos livros já foram consumidos neste ciclo
                    let primeiroUsoTs = null;   // marca o 1.º autógrafo do ciclo
                    let currentCycleIds = [];    // ← NOVO
                    let iframeLoadsInCycle = 0;  // NOVO: conta carregamentos de iframe

                    /* ---------- continua até consumir "bookAmount" livros ---------- */
                    while (livrosUsados < bookAmount && continuaColeta) {

                        // se a fila esvaziar antes de completar a cota, faz novo snapshot
                        if (queue.length === 0) {
                            iframe = await createIframe();
                            iframeLoadsInCycle++; // conta carregamento extra
                            queue = (await getPeopleToCollect(iframe))
                                .filter(p => !blockedChars.includes(p.id));

                            if (queue.length === 0) break;   // ninguém mais disponível
                        }

                        const person = queue.shift();
                        if (!person) continue;             // segurança

                        await goToLocation(iframe, person.id, person.name);
                        iframeLoadsInCycle++; // conta carregamento do goToLocation
                        const bookIds = await getBookIds(iframe, person);
                        if (bookIds.length === 0) continue;  // não aceita itens → tenta próximo

                        if (!primeiroUsoTs) primeiroUsoTs = Date.now();

                        const livroId = bookIds[bookIndex % bookIds.length];
                        log(`Coletando autógrafo de <b>${person.name}</b> usando livro ID: ${livroId}`);
                        await collectAutograph(iframe, livroId, person, (livrosUsados + 1 === bookAmount), iframeLoadsInCycle);

                        currentCycleIds.push(person.id);        // NOVO
                        bookIndex = (bookIndex + 1) % bookIds.length;
                        livrosUsados++;
                    }
                    lastCycleIds = currentCycleIds;

                    /* ---------- cooldown baseado no 1.º uso do ciclo ---------- */
                    if (livrosUsados > 0 && primeiroUsoTs) {
                        // Considera o tempo de humanização (2s por carregamento de iframe)
                        const elapsedMin = Math.floor((Date.now() - primeiroUsoTs + iframeLoadsInCycle * 2000) / 60000);
                        const delayMinRest = Math.max(0, minuteDelay - elapsedMin);

                        if (delayMinRest > 0) {
                            log(`Cooldown de ${delayMinRest} min antes do próximo ciclo…`);
                            await startDelayTimer(delayMinRest);
                        }
                    }

                } catch (err) {
                    console.error(err);
                    log('Erro durante a execução do script – consulte o console.');
                }
            }

            jQuery('#inicar-coleta').prop('disabled', false);
            jQuery('#inicar-coleta').prop('value', 'Iniciar');
            jQuery('#parar-coleta').prop('disabled', true);
            log('Coleta de autógrafos interrompida.');
        });

        jQuery('#parar-coleta').prop('disabled', true);
        jQuery('#parar-coleta').click(function () {
            continuaColeta = false;
            jQuery('#parar-coleta').prop('disabled', true);
            jQuery('#inicar-coleta').prop('disabled', false);
            jQuery('#inicar-coleta').prop('value', 'Iniciar');
            log('Coleta de autógrafos interrompida pelo usuário.');
        });

        // Limpar chars que não aceitam uso de itens
        jQuery('#limpar-chars').click(function () {
            localStorage.removeItem('chars-block-itens');
            log('Storage "chars-block-itens" limpo.');
        });
    });

})();