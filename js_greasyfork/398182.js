// ==UserScript==
// @name         Cobmais - Util
// @namespace    http://app.cobmais.com.br/
// @version      1.0.14
// @description  Auxiliar Testes e Debugs
// @author       Rodrigo Mescua
// @match        http*://*.cobmais.com.br/*/telecobranca*
// @match        http*://localhost:*/telecobranca*
// @match        http*://172.36.1.4/*/telecobranca*
// @match        http*://192.36.1.4/*/telecobranca*
// @match        http*://app-hml-cobmais.brazilsouth.cloudapp.azure.com/*/telecobranca*
// @icon         https://raw.githubusercontent.com/romesc/cobmais-utils/master/favicon.ico
// @require  http://code.jquery.com/jquery-3.4.1.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @grant    GM_addStyle
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/398182/Cobmais%20-%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/398182/Cobmais%20-%20Util.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true) // eslint-disable-line no-undef
waitForKeyElements ("div.ev-item-inclusao", evcFunction);
waitForKeyElements ("div.ct-item", conFunction);
waitForKeyElements (".ct-sel-neg", negFunction);
waitForKeyElements ("span.btneventofinal", testeCopy);
waitForKeyElements ("span.btncontratofinal", testeConCopy);
waitForKeyElements ("span.btnnegociacaofinal", testeNegCopy);

function evcFunction (jNode) {
    var eventos = document.querySelectorAll('div.ev-item-inclusao');
    var teste = '';
    for ( var i = 0; i < eventos.length; i++ ) {
        if (eventos[i].style.display === "none") {
            continue;
        }

        var idEvento = eventos[i].parentElement.parentElement.id.replace('ev-item-','');
        teste = '  <span id="btnEv' + idEvento + '" title="Clique para Copiar o ID Evento" class="btn btnevento badge badge-primary" style="cursor: pointer;" data-clipboard-text="' + idEvento + '">' + idEvento + '</span>';
        if (i == eventos.length - 1) {
            teste = '  <span id="btnEv' + idEvento + '" title="Clique para Copiar o ID Evento" class="btn btnevento btneventofinal badge badge-primary" style="cursor: pointer;" data-clipboard-text="' + idEvento + '">' + idEvento + '</span>';
        }
        if (eventos[i].innerHTML.indexOf(teste) == -1){
            eventos[i].insertAdjacentHTML('beforeEnd',teste);
        }
    }
}

function conFunction (jNode) {
    var contratos = document.querySelectorAll('span.ct-item-clique');
    var teste = '';
    for ( var j = 0; j < contratos.length; j++ ) {
        var idContrato = contratos[j].parentElement.dataset.ctt;
        teste = '\t<span id="btnCt' + idContrato + '" title="Clique para Copiar o ID Contrato" class="btn btncontrato badge badge-primary" style="cursor: pointer;" data-clipboard-text="' + idContrato + '">' + idContrato + '</span>';
        if (j == contratos.length - 1) {
            teste = '\t<span id="btnCt' + idContrato + '" title="Clique para Copiar o ID Contrato" class="btn btncontrato btncontratofinal badge badge-primary" style="cursor: pointer;" data-clipboard-text="' + idContrato + '">' + idContrato + '</span>';
        }
        if (contratos[j].innerHTML.indexOf(teste) == -1){
            contratos[j].innerHTML = contratos[j].innerHTML.concat(teste);
        }
    }
}

function testeCopy (teste) {
    var btns1 = document.querySelectorAll('span.btnevento');
    var clipboard = new ClipboardJS(btns1);

    clipboard.on('success', function(e) {
        toastr.success('ID Evento copiado para a Área de Transferência');
    });
}

function testeConCopy (teste) {
    var btns2 = document.querySelectorAll('span.btncontrato');
    var clipboard = new ClipboardJS(btns2);

    clipboard.on('success', function(e) {
        toastr.success('ID Contrato copiado para a Área de Transferência');
    });
}

function negFunction (jNode) {
    var negs = document.querySelectorAll('.ct-neg');
    var teste = '';

    for (var j = 0; j < negs.length; j++ ) {

        if (negs[j].lastElementChild.classList.contains("btnnegociacao")){
            negs[j].lastElementChild.remove();
        }

        var idNeg = negs[j].lastElementChild.firstElementChild.id.replace('ppvNegociacao', '');

        teste = '\t<span id="btnCopiarNeg' + idNeg + '" title="Clique para copiar o ID da Negociação selecionada" class="btn btnnegociacao badge badge-primary" style="cursor: pointer;">Copiar ID Neg</span>';

        if (negs[j].innerHTML.indexOf(teste) == -1){
            negs[j].insertAdjacentHTML('beforeEnd', teste);
        }

        document.getElementById("btnCopiarNeg" + idNeg).addEventListener (
            "click", testeNegCopy, false
        );
    }
}

function testeNegCopy (teste) {
    var $combo = document.getElementById("selNegociacao" + teste.target.id.replace('btnCopiarNeg',''));

    GM_setClipboard($combo.value);
    toastr.success('ID Negociação copiado para a Área de Transferência');
}

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") {
        targetNodes = $(selectorTxt);
    }
    else {
        targetNodes = $(iframeSelector).contents().find(selectorTxt);
    }

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
