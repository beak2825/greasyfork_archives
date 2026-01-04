// ==UserScript==
// @name         Grepolis Arrival Time
// @author       xxdamage
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @description  Shows the exact time of the attack's / support's arrival
// @icon         https://www.userlogos.org/files/logos/Anoe/Grep999.png
// @license MIT
// @version 1.3
// @namespace https://t.me/xxdamage
// @downloadURL https://update.greasyfork.org/scripts/478659/Grepolis%20Arrival%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/478659/Grepolis%20Arrival%20Time.meta.js
// ==/UserScript==

documentLoaded();
initializeOrGetStylePreference();
observeAjax();
inyectScript("moveCommandsFrame", moveCommandsFrame.toString())
moveCommandsFrame = new moveCommandsFrame;
applyCustomStyles();


function inyectScript(f, A) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.id = f;
    c.textContent = A;
    document.body.appendChild(c);
}

function moveCommandsFrame() {
    function f() {
        if (0 == $("#toolbar_activity_commands_list").length) {
            setTimeout(function () {
                f();
            }, 500);
        } else {
            var A = document.querySelector("#toolbar_activity_commands_list");
            if (0 == $("#grcrt_taclWrap").length) {
                if ($("#toolbar_activity_commands_list").wrap($("<div/>", { "class": "grcrt_taclWrap", id: "grcrt_taclWrap" })), true) {
                    $("#toolbar_activity_commands_list").addClass("grcrt_tacl");
                    $("#grcrt_taclWrap").draggable().draggable("enable");
                    var c = new MutationObserver(function (h) {
                        h.forEach(function (k) {
                            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && "none" == $(A).css("display") && $(".activity.commands").trigger("mouseenter");
                        });
                    });
                    0 == $("#toolbar_activity_commands_list>.js-dropdown-list>a.cancel").length && $("#toolbar_activity_commands_list>.js-dropdown-list").append($("<a/>", { href: "#n", "class": "cancel", style: "display:none;" }).click(function () {
                        $("#grcrt_taclWrap").removeAttr("style");
                    }));
                    c.observe(A, { attributes: !0, childList: !1, characterData: !1 });
                } else {
                    $("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style");
                }
            }
            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && $(".activity.commands").trigger("mouseenter");
        }
    }
    $("head").append($("<style/>").append($("<style/>").append(".showImportant { bisplay: block !important}").append("#grcrt_taclWrap { left:312px; position: absolute; top: 29px;}").append("#grcrt_taclWrap>#toolbar_activity_commands_list { left: 0 !important; top: 0 !important;}").append(".grcrt_tacl { z-index:5000 !important;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}").append(".grcrt_tacl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel:hover { opacity: 1;}")));
    $.Observer(GameEvents.command.send_unit).subscribe("moveCommandsFrame", function () {
        f();
    });
    f();
}

function createModalForPreference() {
    const modalHtml = `
        <div id="styleChoiceModal" class="modal">
            <div class="modal-content">
                <p><b>¿Qué estilo quieres que se muestre a la hora de ajustar un ataque?</b></p>
                <div class="button-group">
                    <button id="choice1"><span style='margin-right: 5px;'>Llegada:</span><span style='color:black;'>00:00:</span><span style='color:red; font-size: 1.08em;'>00</span></button>
                    <button id="choice2"><span style='margin-right: 5px;'>Llegada:</span><span style='color:black;'>00:00:</span><span style='color:blue; font-size: 1.08em;'>00</span></button>
                </div>

                <div class="button-group">
                    <button id="choice3">Segundo: <span style='color:red; font-size: 1.0em;'>00</span></button>
                    <button id="choice4">Segundo: <span style='color:blue; font-size: 1.0em;'>00</span></button>
                </div>
                <div class="button-group">
                    <button id="choice5"><span style='margin-right: 5px;'></span><span style='color:black;'>00:00:</span><span style='color:red; font-size: 1.08em;'>00</span></button>
                    <button id="choice6"><span style='margin-right: 5px;'></span><span style='color:black;'>00:00:</span><span style='color:blue; font-size: 1.08em;'>00</span></button>
                </div>
            </div>
        </div>
    `;

    const body = document.body;
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml.trim();
    body.appendChild(modalContainer);
}



function applyModalStyles() {
    const modalStyles = `
        .modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            border-radius: 10px;  /* Agregado para bordes redondeados */
            width: fit-content;  /* Ajusta el ancho según el contenido */
            max-width: 90%;  /* Añadido para garantizar que no sea demasiado ancho */
            text-align: center;
            box-sizing: border-box; /* Incluye padding y bordes en el tamaño del elemento */
        }
        .modal-content button {
            margin: 5px;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            font-size: 1.1em;
            background-color: #ddd;
            transition: background-color 0.3s;
        }
        .modal-content button:hover {
            background-color: #bbb;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(modalStyles));
    document.head.appendChild(styleElement);
}



function askUserForStylePreference() {
    document.getElementById('choice1').onclick = function() {
        localStorage.setItem('GrepolisTimeStylePreference', '1');
        document.getElementById('styleChoiceModal').style.display = "none";
    };

    document.getElementById('choice2').onclick = function() {
        localStorage.setItem('GrepolisTimeStylePreference', '2');
        document.getElementById('styleChoiceModal').style.display = "none";
    };

    document.getElementById('choice3').onclick = function() {
        localStorage.setItem('GrepolisTimeStylePreference', '3');
        document.getElementById('styleChoiceModal').style.display = "none";
    };

    document.getElementById('choice4').onclick = function() {
        localStorage.setItem('GrepolisTimeStylePreference', '4');
        document.getElementById('styleChoiceModal').style.display = "none";
    };

    document.getElementById('choice5').onclick = function() {
        localStorage.setItem('GrepolisTimeStylePreference', '5');
        document.getElementById('styleChoiceModal').style.display = "none";
    };

    document.getElementById('choice6').onclick = function() {
        localStorage.setItem('GrepolisTimeStylePreference', '6');
        document.getElementById('styleChoiceModal').style.display = "none";
    };

    document.getElementById('styleChoiceModal').style.display = "block";
}

function applyCustomStyles() {
    const styleContent = `
        .sandy-box .item.command { height: 54px !important; }
        .secondsIndicator {
            color: rgba(0, 0, 0, 0.5);
            font-size: xx-small;
            position: relative;
            display: flex;
            line-height: 0px;
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(styleContent));
    document.head.appendChild(styleElement);
}

function documentLoaded() {
    const checkInterval = setInterval(() => {
        if (document.readyState === "complete" && document.querySelector(".tb_activities.toolbar_activities .middle")) {
            clearInterval(checkInterval);
            const commandsObserver = new MutationObserver(() => handleCommandsChange());
            commandsObserver.observe(document.getElementById("toolbar_activity_commands_list"), {
                attributes: true,
                subtree: true
            });
        }
    }, 100);
}

function handleCommandsChange() {
    const allowedList = [
        "icon attack_type32x32 support outgoing",
        "icon attack_type32x32 revolt outgoing",
        "icon attack_type32x32 attack_land outgoing",
        "icon attack_type32x32 attack_sea outgoing",
        "icon attack_type32x32 attack_spy",
    ];

    for (let dropdown of document.querySelectorAll(".js-dropdown-item-list")) {
        if (dropdown.childElementCount != 0 && /movement/.test(dropdown.children[0].id)) {
            for (let child of dropdown.children) {
                const iconElement = child.querySelector('.item.command .icon');
                console.log(iconElement.className)
                if (iconElement && allowedList.includes(iconElement.className.trim()) && !child.querySelector('.secondsIndicator')) {
                    const secondsIndicator = document.createElement("div");
                    secondsIndicator.className = "secondsIndicator";

                    const totalTimestamp = Timestamp.toDate(child.dataset.timestamp);
                    const formattedTime = formatTimestamp(totalTimestamp);

                    const indicatorText = document.createElement("p");
                    indicatorText.innerHTML = formattedTime;
                    indicatorText.style.fontSize = "1.2em";
                    indicatorText.style.fontWeight = "bold";

                    secondsIndicator.appendChild(indicatorText);
                    child.querySelector('.command').appendChild(secondsIndicator);
                }
            }
        }
    }
}

const Timestamp = {
    toDate: function (timestamp) {
        return new Date(timestamp * 1000);
    },
};

function formatTimestamp(date) {
    const style = localStorage.getItem('GrepolisTimeStylePreference') || "1";
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    switch (style) {
        case "1":
            return `<span style='margin-right: 5px;'>Llegada:</span><span style='color:black;'>${hours}:${minutes}:</span><span style='color:red; font-size: 1.08em;'>${seconds}</span>`;
        case "2":
            return `<span style='margin-right: 5px;'>Llegada:</span><span style='color:black;'>${hours}:${minutes}:</span><span style='color:blue; font-size: 1.08em;'>${seconds}</span>`;
        case "3":
            return `<span style='margin-right: 5px;'>Segundo: <span style='color:red; font-size: 1.0em;'>${seconds}</span>`;
        case "4":
            return `<span style='margin-right: 5px;'>Segundo: <span style='color:blue; font-size: 1.0em;'>${seconds}</span>`;
        case "5":
            return `<span style='margin-right: 5px;'></span><span style='color:black;'>${hours}:${minutes}:</span><span style='color:red; font-size: 1.08em;'>${seconds}</span>`;
        case "6":
            return `<span style='margin-right: 5px;'></span><span style='color:black;'>${hours}:${minutes}:</span><span style='color:blue; font-size: 1.08em;'>${seconds}</span>`;
        default:
            return `<span style='margin-right: 5px;'></span><span style='color:black;'>${hours}:${minutes}:</span><span style='color:red; font-size: 1.08em;'>${seconds}</span>`;
    }
}


function initializeOrGetStylePreference() {
    if (!localStorage.getItem('GrepolisTimeStylePreference')) {
        createModalForPreference();
        applyModalStyles();
        askUserForStylePreference();
    }
}


function observeAjax() {
    $(document).ajaxComplete((e, xhr, opt) => {
        const urlParts = opt.url.split("?");
        if (urlParts.length > 1) {
            const params = urlParts[1].split(/&/);
            if (params.length > 1) {
                const action = `${urlParts[0].substr(5)}/${params[1].substr(7)}`;
                if (action === "/town_info/attack" || action === "/town_info/support") {
                    handleCommandsChange();
                }
            }
        }
    });
}
