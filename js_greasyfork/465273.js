// ==UserScript==
// @name         AutoInteract PopMundo
// @namespace    https://popmundo.com/
// @version      0.7
// @description  INTERAGE SOZINHO
// @author       Arthur L#3301
// @match        https://*.popmundo.com/World/Popmundo.aspx/*
// @icon         https://www.google.com/s2/favicons?domain=popmundo.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.0/dist/js.cookie.min.js
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/465273/AutoInteract%20PopMundo.user.js
// @updateURL https://update.greasyfork.org/scripts/465273/AutoInteract%20PopMundo.meta.js
// ==/UserScript==
(function() {
    'use strict'
    
    //Delay entre abertura de abas em milisegundos.
    const DELAY = 500 //ms
    //Domain
    const DOMAIN = "popmundo.com";
    //A ordem das ações afeta na hora da escolha.
    const interactions = {
        friendly: [
            62, //"Dizer o que pensa"
            34, //"Ter uma discussão profunda"
            18, //"Brincar com"
            44, //"Fazer massagem"
            60, //"High Five"
            67, //"Queda de braço"
            66, //"Trançar o cabelo"
            63, //"Tapinha nas costas"
            1, //"Cumprimentar"
            3, //"Conversar"
            5, //"Fazer graça"
            65, //"Fofocar"
            69, //"Contar segredos"
            70, //"Dar uma volta"
            51, //"Consolar"
            57, //"Fraternizar"
            68, //"Dar conselhos"
            55, //"Aperto de mão"
            59, //"Passar um tempo junto"
            8, //"Abraçar"
            56, //"Beijar o rosto"
            21, //"Cantar para"
            4, //"Contar piada"
            24, //"Ligar para papear"
            26, //"Passar trote"
            121, //Fofocar ao telefone"
            58, //"Mandar foto engraçada por MMS"
            61, //"Mandar mensagem no celular"
            158, //Dançar o fish slapping"
            98, //"Falar sobre hobbies"
            99, //"Esconde-esconde"
            93, //"Pegar no colo"
            95, //"Trocar as fraldas"
            6, //"Gugu-dadá"
            96, //"Cantar uma canção de ninar"
            103, //"Beijinho na testa"
            51, //"Consolar"
            91, //"Olhar"
            90, //"Balbuciar"
            92, //"Sorrir alegremente"
            33, //"Fazer uma mágica divertida"
        ],
        romance: [
            76, //"Contar piada safada"
            30, //"Acariciar"
            9, //"Beijar"
            75, //"Louvar"
            10, //"Beijar apaixonadamente"
            77, //"Dizer eu amo você"
            161, //"Piscar"
            14, //"Elogiar"
            71, //"Você vem sempre aqui?"
            20, //"Dar uns tapinhas..."
            13, //"Rapidinha"
            64, //"Envolver"
            12, //"Fazer cócegas"
            165, //"Ligação Romantica"
            25, //"Ligação safadinha"
            74, //"Flertar por SMS"
            73, //"Ligar para flertar"
            11, //"Fazer amor"
            19, //"Sexo tântrico"
            164, //"Desfrutar do Kobe Sutra"
            13, //"Rapidinha"
        ]
    }

    // !!!!!!!!!!!!!!!!!!!!!! NÃO MEXER DEPOIS DESSA LINHA !!!!!!!!!!!!!!!!!!!!!!
    jQuery.fn.center = function () {
        return this.css("left", jQuery("#ppm-main").position().left + "px")
    }

    const getInteractionUserLinks = () => {
        const links = []
        jQuery("a").each((i, a) => {
            if (a.href.includes("/Interact/Details/")) {
                links.push(a.href.replace("/Interact/Details/", "/Character/"))
            }
        });
        return links
    }

    const getAvaiableInteractions = () => {
        const result = [];
        jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option").each((_, o) => {
            if (o.value == 0) {
                return
            }
            result.push(o.value)
        })
        return result
    }

    const getLocationId = () => {
        var result = 0
        jQuery(".characterPresentation a").each((i, a) => {
            if (a.href.includes("/World/Popmundo.aspx/Locale/")) {
                result = Number(a.href.split("/Locale/")[1])
            }
        })
        return result;
    }

    const getCityId = () => {
        var result = 0
        jQuery(".characterPresentation a").each((_, a) => {
            if (a.href.includes("/World/Popmundo.aspx/City/")) {
                result = Number(a.href.split("/City/")[1])
            }
        })
        return result
    }

    const goToPage = (page) => {
        jQuery.when(jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage").val(page).change()).then(() => {
            __doPostBack('ctl00$cphLeftColumn$ctl00$ddlShowPage', '')
        })
    }

    const gotoInteraction = (id) => {
        window.location.pathname = `/World/Popmundo.aspx/Interact/${id}`
    }

    const gotoPhone = (id) => {
        window.location.pathname = `/World/Popmundo.aspx/Interact/Phone/${id}`
    }

    const gotoLocation = (locationId, userId) => {
        window.location.pathname = `/World/Popmundo.aspx/Locale/MoveToLocale/${locationId}/${userId}`
    }

    const getPageCount = () => {
        const p = jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").length
        return p == 0 ? 1 : p
    }

    const getCurrentPage = () => {
        let currentId = 1;
        jQuery("#ctl00_cphLeftColumn_ctl00_ddlShowPage option").each((_, o) => {
            if (jQuery(o).attr("selected")) {
                currentId = o.value
            }
        })
        return currentId
    }

    const isLastPage = () => {
        return (getCurrentPage() == getPageCount())
    }

    const interact = (id) => {
        jQuery.when(jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes").val(id).change()).then(() => {
            let intrBtn = jQuery("#ctl00_cphTopColumn_ctl00_btnInteract");
            if (intrBtn.length == 0) {
                return
            }
            intrBtn.click()
        })
    }

    const getNextInteraction = (userId) => {
        const preference =  Cookies.get("interact-" + userId, { domain: DOMAIN })
        const avaiableIntr = getAvaiableInteractions()
        if (preference) {
            if (preference === "skip") {
                return -1
            }
            if (interactions[preference]) {
                for (let intr of interactions[preference]) {
                    for (let aitr of avaiableIntr) {
                        if (aitr == intr) {
                            return intr
                        }
                    }
                }
            }
        }
        for (let typeId in interactions) {
            for (let intr of interactions[typeId]) {
                for (let aitr of avaiableIntr) {
                    if (aitr == intr) {
                        return intr
                    }
                }
            }
        }
        return -1
    }

    let frameOpen = false;
    const openUrl = (url) => {
        frameOpen = true;
        jQuery('#interaction-iframe').attr('src', url);
    }
    const closeUrl = () => {
        frameOpen = false;
        jQuery('#interaction-iframe').attr('src', null);
    }

    const sendClose = () => {
        window.parent.postMessage("interaction-frame-close", "*")
    }

    let LOG_INDEX = 0;
    const log = (data) => {
        if (window.parent === window)
        {
            jQuery("#batutu-output").append(`<tr class="${LOG_INDEX % 2 == 0 ? "odd": "even"}"><td>${data}</td></tr>`)
            LOG_INDEX++;
        }
        else
        {
            window.parent.postMessage("interaction-frame-log#"+data, "*")
        }
    }

    const open = (cityId, links, current, finished) => {
        if (links.length == current) {
            finished()
            return
        }
        openUrl(links[current] + "#" + cityId)
        const interval = setInterval(() => {
            if (!frameOpen) {
                clearInterval(interval)
                open(cityId, links, current + 1, finished)
            }
        }, 500)
    }

    const injectIframe = () => {
        jQuery("body").append(`<iframe id="interaction-iframe" style="position: absolute; width:0;height:0;border: 0;border: none;"></iframe>`);
        window.addEventListener('message', e => {
            const key = e.message ? 'message' : 'data';
            const data = e[key] + "";

            if (data == "interaction-frame-close")
            {
                closeUrl();
            }
            if (data.includes("interaction-frame-log#"))
            {
                log(data.split("interaction-frame-log#")[1]);
            }
        },false);
    }

    const injectGUI = () => {
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
            jQuery(elem).find("a").each((_, a) => {
                if (a.href.includes("/Character/")) {
                    id = Number(a.href.split("/Character/")[1])
                    return
                }
            })
            if (id != 0) {
                const selectedIteration = Cookies.get("interact-" + id, { domain: DOMAIN })
                let options = ""
                for (var opt in interactions) {
                    options += `<option value="${opt}" ${selectedIteration == opt ? "selected":"" }>${opt}</option>`
                }
                options += `<option value="skip" ${selectedIteration == "skip" ? "selected":"" }>skip</option>`
                const select = `<td><select data-id="${id}" class="interaction-type round">${options}</select></td>`
                jQuery(elem).append(select)
            }
        });
        jQuery(document).on("change", ".interaction-type", (event) => {
            var elem = jQuery(event.target)
            Cookies.set("interact-" + elem.data("id"), elem.val(), { domain: DOMAIN })
        })
    }

    const loadInteractionIds = () => {
        jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option").each((_, o)=>{
            jQuery(o).html('['+o.value+'] ' + jQuery(o).html())
        })
    }

    const isScriptStarted = () => {
        return localStorage.getItem("interactScriptStarted");
    }

    const startScript = () => {
        localStorage.setItem("interactScriptStarted", true)
    }

    const stopScript = () => {
        localStorage.removeItem("interactScriptStarted")
    }

    jQuery(document).ready(() => {
        const path = window.location.pathname
        const extraData = decodeURI(window.location.hash).replace("#", "");
        if (path.includes("/Character/Relations/")) {
            injectIframe();
            injectGUI()
            const currentPage = Number(getCurrentPage())
            const cityId = getCityId()
            if (localStorage.getItem("interactScriptPage") == currentPage) {
                stopScript()
                localStorage.removeItem("interactScriptPage")
                window.location.reload()
            }
            if (isScriptStarted()) {
                localStorage.setItem("interactScriptPage", currentPage)
                open(cityId, getInteractionUserLinks(currentPage), 0, () => {
                    if (isLastPage()) {
                        stopScript()
                        localStorage.removeItem("interactScriptPage")
                        alert("Script finalizado.")
                        window.location.reload()
                        return
                    } else {
                        goToPage(currentPage + 1)
                    }
                })
            } else {
                jQuery(document).on("click", "#interact-script-start", (evt) => {

                    jQuery(evt.target).attr("disabled", "disabled").html("Script em execução, aguarde ou recarregue a pagina para cancelar.");
                    startScript()
                    localStorage.setItem("interactScriptPage", currentPage)
                    open(cityId, getInteractionUserLinks(currentPage), 0, () => {
                        if (isLastPage()) {
                            alert("Script finalizado.")
                            stopScript()
                            localStorage.removeItem("interactScriptPage")
                            return
                        } else {
                            goToPage(currentPage + 1)
                        }
                    })
                })
            }
        } else if (path.includes("/Character/") && !path.includes("/Character/Relations/") && isScriptStarted()) {
            const id = Number(path.split("/Character/")[1])
            const myCityId = Number(extraData)
            const locId = getLocationId()
            if (isNaN(locId) || isNaN(id)) {
                sendClose()
                return
            }
            if (locId == 0 || getCityId() == 0){
                sendClose()
                return
            }
            localStorage.setItem("interact-cid", id);
            if (myCityId == getCityId()) {
                log(`Movendo para a localização: ${locId}`)
                gotoLocation(locId, id)
            } else {
                gotoInteraction(id)
            }
        } else if (path.includes("/Locale/") && isScriptStarted()) {
            const id = localStorage.getItem("interact-cid");
            if (id){
                log(`Não é possivel entrar no local: ${id}, tentando ligar...`);
                gotoPhone(id)
            }
        } else if (path.includes("/Interact/Details/")){
            loadInteractionIds()
        } else if (path.includes("/Interact/")) {
            if (isScriptStarted()) {
                let id = 0;
                const isPhone = path.includes("/Interact/Phone/")
                if (isPhone){
                    id = Number(path.split("/Interact/Phone/")[1])
                } else {
                    id = Number(path.split("/Interact/")[1])
                }
                let itr = getNextInteraction(id);
                if (itr === -1) {
                    log(`Personagem ${id} não tem nenhuma interação disponvel.`)
                    setTimeout(() => {
                        sendClose()
                    }, DELAY)
                    return
                }
                log(`<b>${isPhone ? "Ligando" : "Interagindo" } ${itr} ${isPhone ? "para" : "com" } o personagem ${id}</b>`)
                interact(itr)
            } else {
                loadInteractionIds()
            }
        } else {
            if (isScriptStarted()) {
                log(`Unknown path ${window.location.pathname}`);
                sendClose();
            }
        }
    })
})()