// ==UserScript==
// @name         AutoInteract PopMundo
// @namespace    https://popmundo.com/
// @version      1.9
// @description
// @author       Arthur L#3301
// @coauthor     Britto
// @license      MIT
// @match        https://*.popmundo.com/World/Popmundo.aspx/*
// @icon         https://www.google.com/s2/favicons?domain=popmundo.com
// @grant        GM_getValue
// @grant        GM_setValue
// @require  https://cdn.jsdelivr.net/npm/js-cookie@3.0.0/dist/js.cookie.min.js
// @description Automating boring shit
// @downloadURL https://update.greasyfork.org/scripts/511100/AutoInteract%20PopMundo.user.js
// @updateURL https://update.greasyfork.org/scripts/511100/AutoInteract%20PopMundo.meta.js
// ==/UserScript==
(function () {
    'use strict'
 
 
    //Delay entre abertura de abas em milisegundos.
    const DELAY = 500 //ms
    //Domain
 
    const DOMAIN = "popmundo.com";
    //A ordem das ações afeta na hora da escolha.
    const interactions = {
        friendly: [
            { id: 62, name: "Dizer o que pensa" },
            { id: 34, name: "Ter uma discussão profunda" },
            { id: 18, name: "Brincar com" },
            { id: 44, name: "Fazer massagem" },
            { id: 60, name: "High Five" },
            { id: 67, name: "Queda de braço" },
            { id: 66, name: "Trançar o cabelo" },
            { id: 63, name: "Tapinha nas costas" },
            { id: 1, name: "Cumprimentar" },
            { id: 3, name: "Conversar" },
            { id: 5, name: "Fazer graça" },
            { id: 65, name: "Fofocar" },
            { id: 69, name: "Contar segredos" },
            { id: 70, name: "Dar uma volta" },
            { id: 51, name: "Consolar" },
            { id: 57, name: "Fraternizar" },
            { id: 68, name: "Dar conselhos" },
            { id: 55, name: "Aperto de mão" },
            { id: 59, name: "Passar um tempo junto" },
            { id: 8, name: "Abraçar" },
            { id: 56, name: "Beijar o rosto" },
            { id: 21, name: "Cantar para" },
            { id: 4, name: "Contar piada" },
            { id: 24, name: "Ligar para papear" },
            { id: 171, name: "Ligar para agradecer" },
            { id: 26, name: "Passar trote" },
            { id: 121, name: "Fofocar ao telefone" },
            { id: 58, name: "Mandar foto engraçada por MMS" },
            { id: 61, name: "Mandar mensagem no celular" },
            { id: 158, name: "Dançar o fish slapping" },
            { id: 98, name: "Falar sobre hobbies" },
            { id: 99, name: "Esconde-esconde" },
            { id: 93, name: "Pegar no colo" },
            { id: 95, name: "Trocar as fraldas" },
            { id: 6, name: "Gugu-dadá" },
            { id: 96, name: "Cantar uma canção de ninar" },
            { id: 103, name: "Beijinho na testa" },
            { id: 91, name: "Olhar" },
            { id: 90, name: "Balbuciar" },
            { id: 92, name: "Sorrir alegremente" },
            { id: 33, name: "Fazer uma mágica divertida" }
        ],
        romance: [
            
            { id: 76, name: "Contar piada safada" },
            { id: 30, name: "Acariciar" },
            { id: 9, name: "Beijar" },
            { id: 75, name: "Louvar" },
            { id: 10, name: "Beijar apaixonadamente" },
            { id: 77, name: "Dizer eu amo você" },
            { id: 161, name: "Piscar" },
            { id: 14, name: "Elogiar" },
            { id: 71, name: "Você vem sempre aqui?" },
            { id: 20, name: "Dar uns tapinhas..." },
            { id: 13, name: "Rapidinha" },
            { id: 64, name: "Envolver" },
            { id: 12, name: "Fazer cócegas" },
            { id: 165, name: "Ligação Romântica" },
            { id: 25, name: "Ligação safadinha" },
            { id: 74, name: "Flertar por SMS" },
            { id: 73, name: "Ligar para flertar" },
            { id: 19, name: "Sexo tântrico" },
            { id: 11, name: "Fazer amor" },
            { id: 164, name: "Desfrutar do Kobe Sutra" }
        ]
    };
 
    // !!!!!!!!!!!!!!!!!!!!!! NÃO MEXER DEPOIS DESSA LINHA !!!!!!!!!!!!!!!!!!!!!!
    jQuery.fn.center = function () {
        return this.css("left", jQuery("#ppm-main").position().left + "px")
    }
 
    const getInteractionUserLinks = () => {
        console.log('getInteractionUserLinks: Buscando links de interação de usuário.');
        const links = []
        jQuery("a").each((i, a) => {
            if (a.href.includes("/Interact/Details/")) {
                links.push(a.href.replace("/Interact/Details/", "/Character/"))
            }
        });
        console.log('getInteractionUserLinks: Links encontrados:', links);
        return links
    }
 
    const getAvaiableInteractions = () => {
        console.log('getAvaiableInteractions: Buscando interações disponíveis.');
        const result = [];
        jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option").each((_, o) => {
            if (o.value == 0) {
                return
            }
            result.push(o.value)
        })
        console.log('getAvaiableInteractions: Interações disponíveis:', result);
        return result
    }
 
    const getLocationId = () => {
        console.log('getLocationId: Buscando ID da localização.');
        var result = 0
        jQuery(".characterPresentation a").each((i, a) => {
            if (a.href.includes("/World/Popmundo.aspx/Locale/")) {
                result = Number(a.href.split("/Locale/")[1])
            }
        })
        console.log('getLocationId: ID da localização encontrado:', result);
        return result;
    }
 
    const getLocationName = () => {
        console.log('getLocationName: Buscando nome da localização.');
        //same as the getlocationid, but gets .text() intead the id
        var result = 0
        jQuery(".characterPresentation a").each((i, a) => {
            if (a.href.includes("/World/Popmundo.aspx/Locale/")) {
                result = a.text
            }
        })
        console.log('getLocationName: Nome da localização encontrado:', result);
        return result;
    }
 
 
 
    const getCityId = () => {
        console.log('getCityId: Buscando ID da cidade.');
        var result = 0
        jQuery(".characterPresentation a").each((_, a) => {
            if (a.href.includes("/World/Popmundo.aspx/City/")) {
                result = Number(a.href.split("/City/")[1])
            }
        })
        console.log('getCityId: ID da cidade encontrado:', result);
        return result
    }
 
    const goToPage = (page) => {
        console.log('goToPage: Indo para a página:', page);
        jQuery.when(jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage").val(page).change()).then(() => {
            __doPostBack('ctl00$cphLeftColumn$ctl00$ddlShowPage', '')
        })
    }
 
    const gotoInteraction = (id) => {
        console.log('gotoInteraction: Indo para interação:', id);
        window.location.pathname = `/World/Popmundo.aspx/Interact/${id}`
    }
 
    const gotoPhone = (id) => {
        console.log('gotoPhone: Indo para interação por telefone:', id);
        window.location.pathname = `/World/Popmundo.aspx/Interact/Phone/${id}`
    }
 
    const gotoLocation = (locationId, userId) => {
        console.log('gotoLocation: Movendo para localização:', locationId, 'com usuário:', userId);
        window.location.pathname = `/World/Popmundo.aspx/Locale/MoveToLocale/${locationId}/${userId}`
    }
 
    const getPageCount = () => {
        console.log('getPageCount: Buscando contagem de páginas.');
        const p = jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").length
        const count = p == 0 ? 1 : p;
        console.log('getPageCount: Contagem de páginas:', count);
        return count;
    }
 
    const getCurrentPage = () => {
        console.log('getCurrentPage: Buscando página atual.');
        let currentId = 1;
        jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").each((_, o) => {
            if (jQuery(o).attr("selected")) {
                currentId = o.value
            }
        })
        console.log('getCurrentPage: Página atual:', currentId);
        return currentId
    }
 
    const isLastPage = () => {
        const result = getCurrentPage() == getPageCount();
        console.log('isLastPage: É a última página?', result);
        return result;
    }
 
    const interact = (id) => {
        console.log('interact: Interagindo com ID:', id);
        jQuery.when(jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val(id).change()).then(() => {
            let intrBtn = jQuery("#ctl00_cphTopColumn_ctl00_btnInteract");
            if (intrBtn.length == 0) {
                console.log('interact: Botão de interação não encontrado.');
                return
            }
            console.log('interact: Clicando no botão de interação.');
            intrBtn.click()
        })
    }
 
    const getNextInteraction = (userId) => {
        console.log('getNextInteraction: Buscando próxima interação para o usuário:', userId);
        const preference = GM_getValue(atualChar + "-interact-" + userId, null);
        console.log('getNextInteraction: Preferência de interação:', preference);
        const avaiableIntr = getAvaiableInteractions();
 
        if (preference) {
            if (preference === "skip") {
                console.log('getNextInteraction: Usuário marcado para pular.');
                return { id: -1, name: "" };
            }
            if (interactions[preference]) {
                console.log('getNextInteraction: Verificando interações preferenciais do tipo:', preference);
                for (let interaction of interactions[preference]) {
                    if (avaiableIntr.includes(interaction.id.toString())) {
                        console.log('getNextInteraction: Interação preferencial encontrada:', interaction);
                        return { id: interaction.id, name: interaction.name }; // Retorna id e nome
                    }
                }
            }
        }
 
        console.log('getNextInteraction: Nenhuma interação preferencial encontrada, buscando qualquer interação disponível.');
        for (let typeId in interactions) {
            for (let interaction of interactions[typeId]) {
                if (avaiableIntr.includes(interaction.id.toString())) {
                    console.log('getNextInteraction: Interação disponível encontrada:', interaction);
                    return { id: interaction.id, name: interaction.name }; // Retorna id e nome
                }
            }
        }
 
        console.log('getNextInteraction: Nenhuma interação disponível encontrada.');
        return { id: -1, name: "" };
    };
 
 
 
    let frameOpen = false;
    const openUrl = (url) => {
        console.log('openUrl: Abrindo URL no iframe:', url);
        frameOpen = true;
        jQuery('#interaction-iframe').attr('src', url);
    }
    const closeUrl = () => {
        console.log('closeUrl: Fechando iframe.');
        frameOpen = false;
        jQuery('#interaction-iframe').attr('src', null);
    }
 
    const sendClose = () => {
        console.log('sendClose: Enviando mensagem para fechar o iframe.');
        window.parent.postMessage("interaction-frame-close", "*")
    }
 
    let LOG_INDEX = 0;
    const log = (data) => {
        console.log('log: Registrando mensagem:', data);
        if (window.parent === window) {
            jQuery("#batutu-output").append(`<tr class="${LOG_INDEX % 2 == 0 ? "odd" : "even"}"><td>${data}</td></tr>`);
            LOG_INDEX++;
        } else {
            window.parent.postMessage("interaction-frame-log#" + data, "*");
        }
    };
 
 
    const open = (cityId, links, current, finished) => {
        console.log('open: Abrindo links. Total:', links.length, 'Atual:', current);
        if (links.length == current) {
            console.log('open: Todos os links foram abertos.');
            finished()
            return
        }
        openUrl(links[current] + "#" + cityId)
        const interval = setInterval(() => {
            if (!frameOpen) {
                console.log('open: Iframe fechado, abrindo próximo link.');
                clearInterval(interval)
                open(cityId, links, current + 1, finished)
            }
        }, 500)
    }
 
    const injectIframe = () => {
        console.log('injectIframe: Injetando iframe na página.');
        jQuery("body").append(`<iframe id="interaction-iframe" style="position: absolute; width:0;height:0;border: 0;border: none;"></iframe>`);
        window.addEventListener('message', e => {
            const key = e.message ? 'message' : 'data';
            const data = e[key] + "";
            console.log('injectIframe: Mensagem recebida do iframe:', data);
 
            if (data == "interaction-frame-close") {
                console.log('injectIframe: Mensagem de fechar recebida.');
                closeUrl();
            }
            if (data.includes("interaction-frame-log#")) {
                console.log('injectIframe: Mensagem de log recebida.');
                log(data.split("interaction-frame-log#")[1]);
            }
        }, false);
    }
 
    const injectGUI = () => {
        console.log('injectGUI: Injetando GUI na página.');
        const box = `<div class="box">
        <h2>Interação automatica</h2>
        <p>Clique em iniciar para começar a interagir.</p>
        <p style="color:red;"><b>Atenção: Você deve desablitiar os popups de confirmação em <a target="_blank" href="/User/Popmundo.aspx/User/ContentSettings">configurações</a>.</b></p>
        <hr>
        <table class="data" style="margin-top:10px" id="batutu-output">
            <theader>
            <tr>
                <th>Ações</th>
            </tr>
            </theader>
        </table>
 
        <p class="actionbuttons">
        {{BTN}}
        </p>
        </div>`.replace("{{BTN}}", isScriptStarted() ? "<button disabled>Script em execução, aguarde ou recarregue a pagina para cancelar.</button>" : `<button type="button" id="interact-script-start" class="round">Iniciar</button>`)
        jQuery(".data thead tr").append("<th>Prioridade</th>")
        jQuery("#ppm-content").prepend(box)
        jQuery(".data tbody tr").each((_, elem) => {
            let id = 0;
            let name = '';
            jQuery(elem).find("a").each((_, a) => {
                if (a.href.includes("/Character/")) {
                    id = Number(a.href.split("/Character/")[1]); // Captura o ID do personagem
                    name = jQuery(a).find("strong").text(); // Captura o nome do personagem
                    return;
                }
            })
 
            if (id != 0) {
                const selectedIteration = GM_getValue(atualChar + "-interact-" + id, null)
                console.log('injectGUI: Interação selecionada para o usuário', id, ':', selectedIteration);
                let options = ""
                for (var opt in interactions) {
                    options += `<option value="${opt}" ${selectedIteration == opt ? "selected" : ""}>${opt}</option>`
                }
                options += `<option value="skip" ${selectedIteration == "skip" ? "selected" : ""}>skip</option>`
                const select = `<td><select data-id="${id}" class="interaction-type round">${options}</select></td>`
                jQuery(elem).append(select)
            }
        });
        jQuery(document).on("change", ".interaction-type", (event) => {
            var elem = jQuery(event.target)
            console.log('injectGUI: Alterando tipo de interação para o usuário', elem.data("id"), 'para', elem.val());
            GM_setValue(atualChar + "-interact-" + elem.data("id"), elem.val())
        })
    }
 
    const loadInteractionIds = () => {
        console.log('loadInteractionIds: Carregando IDs de interação no dropdown.');
        jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option").each((_, o) => {
            jQuery(o).html('[' + o.value + '] ' + jQuery(o).html())
        })
    }
 
    const isScriptStarted = () => {
        const started = localStorage.getItem("interactScriptStarted");
        console.log('isScriptStarted: Script iniciado?', started);
        return started;
    }
 
    const startScript = () => {
        console.log('startScript: Iniciando script.');
        localStorage.setItem("interactScriptStarted", true)
    }
 
    const stopScript = () => {
        console.log('stopScript: Parando script.');
        localStorage.removeItem("interactScriptStarted")
    }
    let atualChar = null;
    jQuery(document).ready(() => {
        console.log('Document Ready: O DOM está pronto.');
        const path = window.location.pathname;
        console.log('Document Ready: Path atual:', path);
 
        // Apenas define `atualChar` na página de relações de personagem
        if (path.startsWith("/World/Popmundo.aspx/Character/Relations/")) {
            atualChar = jQuery(".idHolder").text().trim();
            console.log("Página de Relações: ID do personagem atual definido como:", atualChar);
            // Aqui você pode salvar o ID globalmente para o gerenciamento de interações
            GM_setValue("currentCharacterId", atualChar);
        } else {
            // Em outras páginas, recupera o ID apenas uma vez
            atualChar = GM_getValue("currentCharacterId", null);
            console.log("Outra Página: ID do personagem recuperado:", atualChar);
        }
 
        const extraData = decodeURI(window.location.hash).replace("#", "");
        console.log('Document Ready: Extra data do hash:', extraData);

        if (path.includes("/Character/Relations/")) {
            console.log('Roteamento: Página de Relações de Personagem.');
            injectIframe();
            injectGUI()
            const currentPage = Number(getCurrentPage())
            const cityId = getCityId()
            if (localStorage.getItem("interactScriptPage") == currentPage) {
                console.log('Roteamento: Página recarregada após execução, parando script.');
                stopScript()
                localStorage.removeItem("interactScriptPage")
                window.location.reload()
            }
            if (isScriptStarted()) {
                console.log('Roteamento: Script iniciado, processando página de relações.');
                localStorage.setItem("interactScriptPage", currentPage)
                open(cityId, getInteractionUserLinks(currentPage), 0, () => {
                    console.log('Roteamento: Abertura de links finalizada.');
                    if (isLastPage()) {
                        console.log('Roteamento: Última página alcançada, finalizando script.');
                        stopScript()
                        localStorage.removeItem("interactScriptPage")
                        alert("Script finalizado.")
                        window.location.reload()
                        return
                    } else {
                        console.log('Roteamento: Indo para a próxima página.');
                        goToPage(currentPage + 1)
                    }
                })
            } else {
                console.log('Roteamento: Script não iniciado, aguardando clique no botão Iniciar.');
                jQuery(document).on("click", "#interact-script-start", (evt) => {
                    console.log('Roteamento: Botão Iniciar clicado.');
                    jQuery(evt.target).attr("disabled", "disabled").html("Script em execução, aguarde ou recarregue a pagina para cancelar.");
                    startScript()
                    localStorage.setItem("interactScriptPage", currentPage)
                    open(cityId, getInteractionUserLinks(currentPage), 0, () => {
                        console.log('Roteamento: Abertura de links finalizada após clique.');
                        if (isLastPage()) {
                            console.log('Roteamento: Última página alcançada, finalizando script.');
                            alert("Script finalizado.")
                            stopScript()
                            localStorage.removeItem("interactScriptPage")
                            return
                        } else {
                            console.log('Roteamento: Indo para a próxima página.');
                            goToPage(currentPage + 1)
                        }
                    })
                })
            }
        } else if (path.includes("/Character/") && !path.includes("/Character/Relations/") && isScriptStarted()) {
            console.log('Roteamento: Página de Detalhes do Personagem.');
            const id = Number(path.split("/Character/")[1])
            const charName = jQuery(".charPresBox h2").contents().filter(function () {
                return this.nodeType === Node.TEXT_NODE;
            }).text().trim(); // Captura o nome do personagem
            console.log('Roteamento: ID do Personagem:', id, 'Nome:', charName);

            const myCityId = Number(extraData)
            const locId = getLocationId()
            const locName = getLocationName()
            console.log('Roteamento: ID da Minha Cidade:', myCityId, 'ID da Localização:', locId, 'Nome da Localização:', locName);

            if (isNaN(locId) || isNaN(id)) {
                console.log('Roteamento: ID da localização ou do personagem inválido. Fechando.');
                sendClose()
                return
            }
            if (locId == 0 || getCityId() == 0) {
                console.log('Roteamento: ID da localização ou da cidade é 0. Fechando.');
                sendClose()
                return
            }
            localStorage.setItem("interact-cid", id);
            localStorage.setItem("interact-cname", charName);
            if (myCityId == getCityId()) {
                console.log('Roteamento: Mesma cidade, movendo para a localização.');
                log(`Movendo para a localização: <b>${locName}</b>`)
                gotoLocation(locId, id)
            } else {
                console.log('Roteamento: Cidades diferentes, tentando interação direta.');
                gotoInteraction(id)
            }
        } else if (path.includes("/Locale/") && isScriptStarted()) {
            console.log('Roteamento: Página de Localização.');
            const id = localStorage.getItem("interact-cid");
            const charName = localStorage.getItem("interact-cname");
            console.log('Roteamento: Tentando interagir com:', charName, `(ID: ${id})`);
            if (id) {
                log(`Não é possivel entrar no local: <b>${charName}</b>, tentando ligar...`);
                gotoPhone(id)
            }
        } else if (path.includes("/Interact/Details/")) {
            console.log('Roteamento: Página de Detalhes da Interação.');
            loadInteractionIds()
        } else if (path.includes("/Interact/")) {
            console.log('Roteamento: Página de Interação.');
            if (isScriptStarted()) {
                let id = 0;
                let charName = '';
                const isPhone = path.includes("/Interact/Phone/")
                console.log('Roteamento: É interação por telefone?', isPhone);
                if (isPhone) {
                    id = Number(path.split("/Interact/Phone/")[1])
                    charName = jQuery("#ctl00_cphTopColumn_ctl00_hdrPeopleInfo").find("a").eq(1).text();
                } else {
                    id = Number(path.split("/Interact/")[1])
                    charName = jQuery("#ctl00_cphTopColumn_ctl00_hdrPeopleInfo").find("a").eq(1).text();
                }
                console.log('Roteamento: Interagindo com:', charName, `(ID: ${id})`);
                let itr = getNextInteraction(id);
                if (itr.id === -1) {
                    log(`Personagem <b>${charName}</b> não tem nenhuma interação disponível.`);
                    console.log('Roteamento: Nenhuma interação disponível, fechando.');
                    setTimeout(() => {
                        sendClose();
                    }, DELAY);
                    return;
                }
 
                log(`<b>${isPhone ? "Ligando" : "Interagindo"} ${itr.name} ${isPhone ? "para" : "com"} o personagem ${charName}</b>`);
                console.log('Roteamento: Executando interação:', itr.name);
                interact(itr.id);
 
            } else {
                console.log('Roteamento: Script não iniciado, apenas carregando IDs de interação.');
                loadInteractionIds()
            }
        } else {
            if (isScriptStarted()) {
                log(`Unknown path ${window.location.pathname}`);
                console.log('Roteamento: Caminho desconhecido, fechando.', window.location.pathname);
                sendClose();
            }
        }
    })
})()