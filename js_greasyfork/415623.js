// ==UserScript==
// @name         Cobmais - DevOps
// @namespace    http://app.cobmais.com.br/
// @version      1.0.0
// @description  Botão para Copiar o Nome da Tarefa ao Criar Pull request
// @author       Rodrigo Mescua
// @match        http*://*dev.azure.com/cobmais/*/pullrequestcreate*
// @icon         https://raw.githubusercontent.com/romesc/cobmais-utils/master/favicon.ico
// @require  http://code.jquery.com/jquery-3.4.1.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @grant    GM_addStyle
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/415623/Cobmais%20-%20DevOps.user.js
// @updateURL https://update.greasyfork.org/scripts/415623/Cobmais%20-%20DevOps.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true) // eslint-disable-line no-undef
waitForKeyElements ("body > div.full-size > div > div > div.flex-row.flex-grow.scroll-hidden > div.flex-column.flex-grow.scroll-hidden > div.v-scroll-auto.flex.flex-grow.relative.region-content > div > div.repos-pr-create-form.page-content.page-content-top.flex-column.flex-grow.flex-noshrink.rhythm-vertical-16 > div > div > div > div.rhythm-vertical-16.region-createPullRequestOverviewExtensions > div > div.bolt-table-container.flex-grow > table > tbody > a > td.bolt-table-two-line-cell.bolt-table-cell.bolt-list-cell > div > div:nth-child(1) > span.flex-grow.text-ellipsis", tarefaFunction);
waitForKeyElements ("button.btntarefafinal", tarefaCopy);

function tarefaFunction (jNode) {
    var eventos = document.querySelectorAll('body > div.full-size > div > div > div.flex-row.flex-grow.scroll-hidden > div.flex-column.flex-grow.scroll-hidden > div.v-scroll-auto.flex.flex-grow.relative.region-content > div > div.repos-pr-create-form.page-content.page-content-top.flex-column.flex-grow.flex-noshrink.rhythm-vertical-16 > div > div > div > div.rhythm-vertical-16.region-createPullRequestOverviewExtensions > div > div.bolt-table-container.flex-grow > table > tbody > a > td.bolt-table-two-line-cell.bolt-table-cell.bolt-list-cell > div > div:nth-child(1) > span.flex-grow.text-ellipsis');
    var teste = '';
    for ( var i = 0; i < eventos.length; i++ ) {
        var nomeTarefa = eventos[i].innerText.replace('Desenvolvimento ','');
        teste = '<button data-clipboard-text="' + nomeTarefa + '" style="cursor: auto;" class="bolt-header-command-item-button bolt-button bolt-icon-button enabled subtle bolt-focus-treatment" id="btnTarefaCob" type="button"><span class="left-icon flex-noshrink fabric-icon ms-Icon--Paste medium"></span><span class="bolt-button-text body-m">Copiar</span></button>';
        if (i == eventos.length - 1) {
            teste = '<button data-clipboard-text="' + nomeTarefa + '" style="cursor: auto;" class="btntarefafinal bolt-header-command-item-button bolt-button bolt-icon-button enabled subtle bolt-focus-treatment" id="btnTarefaCob" type="button"><span class="left-icon flex-noshrink fabric-icon ms-Icon--Paste medium"></span><span class="bolt-button-text body-m">Copiar</span></button>';
        }
        if (eventos[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML.indexOf(teste) == -1){
            eventos[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML = eventos[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML.concat(teste);
        }
    }
}

function tarefaCopy (teste) {
    var btns1 = document.querySelectorAll('button.btntarefafinal');
    var clipboard = new ClipboardJS(btns1);

    clipboard.on('success', function(e) {
        console.log('Nome da Tarefa copiado para a Área de Transferência');
        return;
    });
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
