// ==UserScript==
// @name         AutoInteract PopMundo English
// @namespace    https://popmundo.com/
// @version      1.5
// @description  Automatic interactions
// @author       Doktorum
// @license      MIT
// @match        https://*.popmundo.com/World/Popmundo.aspx/*
// @icon         https://www.google.com/s2/favicons?domain=popmundo.com
// @grant        GM_getValue
// @grant        GM_setValue
// @require  https://cdn.jsdelivr.net/npm/js-cookie@3.0.0/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/527634/AutoInteract%20PopMundo%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/527634/AutoInteract%20PopMundo%20English.meta.js
// ==/UserScript==
(function () {
    'use strict'


    //Delay between opening tabs in miliseconds
    const DELAY = 500 //ms
    //Domain

    const DOMAIN = "popmundo.com";
    //The order of the following actions affects the interactions (you can change according to your wish)
    const interactions = {
        friendly: [
            { id: 70, name: "Hang out" },
            { id: 33, name: "Do funny magic" },
            { id: 62, name: "Share opinions" },
            { id: 60, name: "High Five" },
            { id: 69, name: "Share secrets" },
            { id: 18, name: "Play with" },
            { id: 34, name: "Have profound discussion" },
            { id: 44, name: "Give massage" },
            { id: 67, name: "Arm wrestle" },
            { id: 66, name: "Plait hair" },
            { id: 63, name: "Pat on back" },
            { id: 1, name: "Greet" },
            { id: 3, name: "Talk to" },
            { id: 5, name: "Tease" },
            { id: 65, name: "Gossip" },
            { id: 51, name: "Comfort" },
            { id: 57, name: "Fraternise" },
            { id: 68, name: "Offer advice" },
            { id: 55, name: "Shake hands" },
            { id: 8, name: "Hug" },
            { id: 56, name: "Kiss cheeks" },
            { id: 21, name: "Sing to" },
            { id: 4, name: "Tell joke" },
            { id: 24, name: "Wazzup call" },
            { id: 171, name: "Thank You call" },
            { id: 26, name: "Prank call" },
            { id: 121, name: "Gossip on phone" },
            { id: 58, name: "Send funny pic MMS" },
            { id: 61, name: "Send friendly text" },
            { id: 158, name: "Do the fish slapping dance" },
            { id: 98, name: "Talk about hobbies" },
            { id: 99, name: "Peekaboo" },
            { id: 93, name: "Pick up" },
            { id: 95, name: "Change diapers" },
            { id: 96, name: "Sing lullaby" },
            { id: 103, name: "Kiss on forehead" },
            { id: 91, name: "Look" },
            { id: 90, name: "Babble" },
            { id: 92, name: "Smile" }
        ],
        romance: [

            { id: 10, name: "Kiss passionately" },
            { id: 76, name: "Tell naughty joke" },
            { id: 12, name: "Tickle" },
            { id: 75, name: "Praise" },
            { id: 19, name: "Tantric sex" },
            { id: 11, name: "Make love" },
            { id: 30, name: "Caress" },
            { id: 9, name: "Kiss" },
            { id: 161, name: "Wink" },
            { id: 14, name: "Compliment" },
            { id: 71, name: "Hey sexy, how you doin'?" },
            { id: 20, name: "Spank" },
            { id: 13, name: "5 minute quickie" },
            { id: 77, name: "Say I love you" },
            { id: 64, name: "Embrace" },
            { id: 165, name: "Romantic call" },
            { id: 25, name: "Dirty call" },
            { id: 74, name: "Flirty text" },
            { id: 73, name: "Flirty call" },
            { id: 164, name: "Enjoy Kobe Sutra" }
        ]
    };

    // !!!!!!!!!!!!!!!!!!!!!! DO NOT EDIT AFTER THIS LINE !!!!!!!!!!!!!!!!!!!!!!
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

    const getLocationName = () => {
        //same as the getlocationid, but gets .text() intead the id
        var result = 0
        jQuery(".characterPresentation a").each((i, a) => {
            if (a.href.includes("/World/Popmundo.aspx/Locale/")) {
                result = a.text
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
        const preference = GM_getValue(atualChar + "-interact-" + userId, null);
        const avaiableIntr = getAvaiableInteractions();

        if (preference) {
            if (preference === "skip") {
                return { id: -1, name: "" };
            }
            if (interactions[preference]) {
                for (let interaction of interactions[preference]) {
                    if (avaiableIntr.includes(interaction.id.toString())) {
                        return { id: interaction.id, name: interaction.name }; // Retorna id e nome
                    }
                }
            }
        }

        for (let typeId in interactions) {
            for (let interaction of interactions[typeId]) {
                if (avaiableIntr.includes(interaction.id.toString())) {
                    return { id: interaction.id, name: interaction.name }; // Retorna id e nome
                }
            }
        }

        return { id: -1, name: "" };
    };



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
        if (window.parent === window) {
            jQuery("#batutu-output").append(`<tr class="${LOG_INDEX % 2 == 0 ? "odd" : "even"}"><td>${data}</td></tr>`);
            LOG_INDEX++;
        } else {
            window.parent.postMessage("interaction-frame-log#" + data, "*");
        }
    };


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

            if (data == "interaction-frame-close") {
                closeUrl();
            }
            if (data.includes("interaction-frame-log#")) {
                log(data.split("interaction-frame-log#")[1]);
            }
        }, false);
    }

    const injectGUI = () => {
        const box = `<div class="box">
        <h2>Automatic interactions</h2>
        <p>Click BEGIN to start interacting.</p>
        <p style="color:red;"><b>Warning: You must disable confirmation pop-ups in <a target="_blank" href="/User/Popmundo.aspx/User/ContentSettings">settings</a>.</b></p>
        <hr>
        <table class="data" style="margin-top:10px" id="batutu-output">
            <theader>
            <tr>
                <th>Actions</th>
            </tr>
            </theader>
        </table>

        <p class="actionbuttons">
        {{BTN}}
        </p>
        </div>`.replace("{{BTN}}", isScriptStarted() ? "<button disabled>Script running, please wait or reload page to cancel.</button>" : `<button type="button" id="interact-script-start" class="round">BEGIN</button>`)
        jQuery(".data thead tr").append("<th>Priority</th>")
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
                console.log(selectedIteration)
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
            GM_setValue(atualChar + "-interact-" + elem.data("id"), elem.val())
        })
    }

    const loadInteractionIds = () => {
        jQuery("#ctl00_cphTopColumn_ctl00_ddlInteractionTypes option").each((_, o) => {
            jQuery(o).html('[' + o.value + '] ' + jQuery(o).html())
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
    let atualChar = null;
    jQuery(document).ready(() => {
        const path = window.location.pathname;

        // Apenas define `atualChar` na página de relações de personagem
        if (path.startsWith("/World/Popmundo.aspx/Character/Relations/")) {
            atualChar = jQuery(".idHolder").text().trim();
            console.log("ID do personagem atual:", atualChar);
            // Aqui você pode salvar o ID globalmente para o gerenciamento de interações
            GM_setValue("currentCharacterId", atualChar);
        } else {
            // Em outras páginas, recupera o ID apenas uma vez
            atualChar = GM_getValue("currentCharacterId", null);
            console.log("Recuperando ID do personagem:", atualChar);
        }

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
                        alert("Script finished.")
                        window.location.reload()
                        return
                    } else {
                        goToPage(currentPage + 1)
                    }
                })
            } else {
                jQuery(document).on("click", "#interact-script-start", (evt) => {

                    jQuery(evt.target).attr("disabled", "disabled").html("Script running, please wait or reload page to cancel.");
                    startScript()
                    localStorage.setItem("interactScriptPage", currentPage)
                    open(cityId, getInteractionUserLinks(currentPage), 0, () => {
                        if (isLastPage()) {
                            alert("Script finished.")
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
            const charName = jQuery(".charPresBox h2").contents().filter(function () {
                return this.nodeType === Node.TEXT_NODE;
            }).text().trim(); // Captura o nome do personagem

            const myCityId = Number(extraData)
            const locId = getLocationId()
            const locName = getLocationName()
            if (isNaN(locId) || isNaN(id)) {
                sendClose()
                return
            }
            if (locId == 0 || getCityId() == 0) {
                sendClose()
                return
            }
            localStorage.setItem("interact-cid", id);
            localStorage.setItem("interact-cname", charName);
            if (myCityId == getCityId()) {
                log(`Moving to locale: <b>${locName}</b>`)
                gotoLocation(locId, id)
            } else {
                gotoInteraction(id)
            }
        } else if (path.includes("/Locale/") && isScriptStarted()) {
            const id = localStorage.getItem("interact-cid");
            const charName = localStorage.getItem("interact-cname");
            if (id) {
                log(`It's not possible to move to the locale: <b>${charName}</b>, trying to call...`);
                gotoPhone(id)
            }
        } else if (path.includes("/Interact/Details/")) {
            loadInteractionIds()
        } else if (path.includes("/Interact/")) {
            if (isScriptStarted()) {
                let id = 0;
                let charName = '';
                const isPhone = path.includes("/Interact/Phone/")
                if (isPhone) {
                    id = Number(path.split("/Interact/Phone/")[1])
                    //charname é o texto do segundo <a> presente no id ctl00_cphTopColumn_ctl00_hdrPeopleInfo
                    charName = jQuery("#ctl00_cphTopColumn_ctl00_hdrPeopleInfo").find("a").eq(1).text();
                } else {
                    id = Number(path.split("/Interact/")[1])
                    charName = jQuery("#ctl00_cphTopColumn_ctl00_hdrPeopleInfo").find("a").eq(1).text();
                }
                let itr = getNextInteraction(id);
                if (itr.id === -1) {
                    log(`Character <b>${charName}</b> doesn't have any available interaction.`);
                    setTimeout(() => {
                        sendClose();
                    }, DELAY);
                    return;
                }

                log(`<b>${isPhone ? "Calling" : "Interacting"} ${itr.name} ${isPhone ? "to" : "with"} ${charName}</b>`);
                interact(itr.id);

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