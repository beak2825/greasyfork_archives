// ==UserScript==
// @name                Salesforce Tweaks
// @namespace           zen
// @description         Improve salesforce for me
// @version             1.2.2
// @run-at              document-start
// @match               https://ifood.lightning.force.com/*
// @require             https://update.greasyfork.org/scripts/526417/1643812/USToolkit.js
// @grant               unsafeWindow
// @grant               window.focus
// @grant               GM_addStyle
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/544923/Salesforce%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/544923/Salesforce%20Tweaks.meta.js
// ==/UserScript==

const COMENTARIO = `
Reabertura? - Não 
Houve tentativa de contato? - N/A 
Nome da pessoa com quem falou: N/A 
Telefone(s) de contato: N/A

Solicitação do parceiro: Parceiro solicitou contestação de cancelamento (pedido total parcial) 
Descrição das ações: PLACEHOLDER
CÓDIGO DE CANCELAMENTO: 417

O motivo do cancelamento do pedido prevê crédito pelo motor? - SIM NÃO
CRÉDITO_PELO_ORÁCULO? - SIM NÃO 
CRÉDITO_GERADO_MANUAL: SIM NÃO 
Solução para a solicitação do parceiro: Crédito acatado negado

Foi realizada a pós tabulação, a formalização via e-mail e o fechamento do caso? - SIM 
Caso solucionado? - SIM
`.trim();

const copyPopup = document.createElement("div");
copyPopup.id = "copyPopup";
copyPopup.textContent = "Copiado";
document.documentElement.appendChild(copyPopup);

const onElements = new UST.OnElements({ deep: true });

let backOffice;
let autoAcceptCase = true;
const mouseButton = {
    0: "left",
    1: "middle",
    2: "right",
};

function copyOnClick(element) {
    element.style.setProperty("font-weight", "bold", "important");
    element.style.setProperty("cursor", "pointer", "important");

    element.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        navigator.clipboard.writeText(element.innerText).then(() => {
            copyPopup.classList.add("popupActive");
            setTimeout(() => copyPopup.classList.remove("popupActive"), 2000);
        });
    });
}

function backOfficeHandler(element) {
    if (!backOffice?.self) {
        backOffice = window.open(`https://backoffice.ifoodxt.com.br/orders?id=${element.innerText}`, "_blank");
        return;
    }

    backOffice.focus();
    backOffice.postMessage({ UUID: element.innerText }, "https://backoffice.ifoodxt.com.br");
}

document.addEventListener("keydown", (event) => {
    if (event.code === "KeyA" && event.shiftKey) {
        autoAcceptCase = !autoAcceptCase;
        autoAcceptOnStyle.disabled = !autoAcceptCase;
    }
});

document.addEventListener("readystatechange", () => {
    autoAcceptOnStyle.disabled = !autoAcceptCase;
});

onElements.per('records-record-layout-item[field-label="UUID"] lightning-formatted-text', (element) => {
    copyOnClick(element);

    element.addEventListener("mousedown", (event) => {
        const mouseClick = mouseButton[event.button];
        if (mouseClick === "middle" && event.ctrlKey) {
            backOfficeHandler(element);
            return;
        }

        window.open(`https://oraculo.ifoodxt.com.br/dashboard?requester_type=partner&type=order&id=${element.innerText}`, "_blank");
    });
});

onElements.per(
    'records-record-layout-item:is([field-label="Número do caso"], [field-label="Fornecedor ID"]) lightning-formatted-text',
    (element) => {
        copyOnClick(element);
    },
);

onElements.per('[data-target-selection-name="sfdc:RecordField.CaseComment.CommentBody"] textarea', (element) => {
    if (!location.pathname.startsWith("/lightning/o/CaseComment/new")) return;

    element.value = COMENTARIO;
    element.rows = 20;
});

onElements.per('[data-target-selection-name="sfdc:RecordField.CaseComment.IsPublished"] input[type="checkbox"]', (element) => {
    if (!location.pathname.startsWith("/lightning/o/CaseComment/new")) return;

    element.click();
});

onElements.per('.oneUtilityBarPanel button[title="Aceitar"]', (element) => {
    if (!autoAcceptCase) return;

    element.click();
});

async function prepareEmail() {
    const fromAddressInput = await UST.waitElement(
        '.split-right > .active [data-target-selection-name="sfdc:RecordField.EmailMessage.ValidatedFromAddress"] a',
    );
    if (fromAddressInput.innerText === "Atendimento iFood <atendimento_parceiro@ifood.com.br>") return;
    fromAddressInput.click();

    const ifoodAddress = await UST.waitElement('.select-options li > a[title="Atendimento iFood <atendimento_parceiro@ifood.com.br>"]');
    ifoodAddress.click();

    const addUser = await UST.waitElement(
        '.split-right > .active :not(.slds-show) [data-target-selection-name="sfdc:RecordField.EmailMessage.ToAddress"] button:has([data-key="adduser"])',
    );
    addUser.click();

    const selectAllCheckbox = await UST.waitElement(
        ".uiModal.open.active:has(lightning-vertical-navigation-item.slds-is-active:nth-child(1)) .listDisplays th.selectionColumnHeader .slds-checkbox_faux",
    );
    const accountContacts = selectAllCheckbox
        .closest('[data-aura-class="supportEmailRecipientLookup"]')
        .querySelector("lightning-vertical-navigation-item:nth-child(2)").shadowRoot.children[0];
    if (accountContacts.innerText !== "Contatos da conta") return;
    accountContacts.click();

    const selectAllContacts = await UST.waitElement(
        ".uiModal.open.active:has(lightning-vertical-navigation-item.slds-is-active) .listDisplays:not(:has(tbody > tr:nth-child(50))) th.selectionColumnHeader .slds-checkbox_faux",
    );
    selectAllContacts.click();

    const addContacts = await UST.waitElement(
        ".uiModal.open.active:has(lightning-vertical-navigation-item.slds-is-active:nth-child(2)) .modal-footer button:nth-child(2):not([disabled])",
    );
    addContacts.click();

    const insertTemplateButton = await UST.waitElement('a[role="button"]:has([data-key="insert_template"])');
    insertTemplateButton.click();
}

onElements.per('.split-right > .active [data-tab-name="Case.Enviar_Email"]', (element) => {
    if (!location.pathname.startsWith("/lightning/r/Case/")) return;

    element.click();

    prepareEmail();
});

onElements.start();

GM_addStyle(`
#copyPopup {
    position: fixed;
    z-index: 9;
    top: 0rem;
    left: 50%;
    translate: -50% -100%;
    background: hsl(240, 58%, 4%);
    color: #eee;
    padding: 15px;
    font-size: 16px;
    border-radius: .5rem;
    transition: translate .2s ease;
    font-family: system-ui;
}
.popupActive {
    translate: -50% 2rem !important;
}
.oneUtilityBarPanel .panel-header:has([icon-name="utility:omni_channel"]) {
    background: hsl(0deg 50% 70% / 50%);
}
`);

const autoAcceptOnStyle = GM_addStyle(`
.oneUtilityBarPanel .panel-header:has([icon-name="utility:omni_channel"]) {
    background: hsl(125deg 50% 70% / 50%);
}
`);
