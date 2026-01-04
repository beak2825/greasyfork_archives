// ==UserScript==
// @name         PayWall Buster - Spain Newspapers
// @version      0.5.7
// @description  Quita el paywall de varios medios de "descomunicación" de España. Información por la que no se debería pagar, ya que está manipulada en gran medida por lobbies.
// @match        https://elpais.com/*
// @match        https://*.elcorreo.com/*
// @match        https://*.canarias7.es/*
// @match        https://*.elnortedecastilla.es/*
// @match        https://*.larioja.com/*
// @match        https://*.abc.es/*
// @match        https://*.diariosur.es/*
// @match        https://*.diariovasco.com/*
// @match        https://*.lavanguardia.com/*
// @match        https://*.mujerhoy.com/*
// @match        https://*.hoy.es/*
// @match        https://*.leonoticias.com/*
// @match        https://*.elcomercio.es/*
// @match        https://*.lasprovincias.es/*
// @match        https://*.eldiariomontanes.es/*
// @match        https://*.laverdad.es/*
// @match        https://*.burgosconecta.es/*
// @match        https://*.niusdiario.es/*
// @match        https://*.20minutos.es/*
// @match        https://*.ideal.es/*
// @match        https://*.elperiodico.com/*
// @grant        none
// @run-at       document-start
// jshint esversion: 6
// @namespace https://greasyfork.org/users/161767
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/404871/PayWall%20Buster%20-%20Spain%20Newspapers.user.js
// @updateURL https://update.greasyfork.org/scripts/404871/PayWall%20Buster%20-%20Spain%20Newspapers.meta.js
// ==/UserScript==

// Blocks paywall scripts
function needsToBeBlacklisted(value, type){
    let response = false;
    if(value !== undefined && value !== null && value.search(/p\.js/) > -1){
      response = true;
    }

    return response;
}

const createElementBackup = document.createElement
document.createElement = function(...args) {
    // If this is not a script tag, bypass
    if(args[0].toLowerCase() !== 'script')
        // Binding to document is essential
        return createElementBackup.bind(document)(...args)

    const scriptElt = createElementBackup.bind(document)(...args)
   
    // Backup the original setAttribute function
    const originalSetAttribute = scriptElt.setAttribute.bind(scriptElt)

    // Define getters / setters to ensure that the script type is properly set
    Object.defineProperties(scriptElt, {
        'src': {
            get() {
                return scriptElt.getAttribute('src')
            },
            set(value) {
                if(scriptElt.type !== undefined && scriptElt.type !== null && needsToBeBlacklisted(value, scriptElt.type)) {
                    originalSetAttribute('type', 'javascript/blocked')
                }
              
                if(scriptElt.src !== null && scriptElt.src !== undefined) {
                    originalSetAttribute('src', value)
                }
                return true
            }
        },
        'type': {
            set(value) {
                const src = scriptElt.src !== undefined ? scriptElt.src : '';
                const type = scriptElt.type !== undefined ? scriptElt.type : '';
                const typeValue = needsToBeBlacklisted(src, type) ? 'javascript/blocked' : value
                if(scriptElt.type !== undefined){
                    originalSetAttribute('type', typeValue)
                }
                return true
            }
        }
    })

    // Monkey patch the setAttribute function so that the setter is called instead.
    // Otherwise, setAttribute('type', 'whatever') will bypass our custom descriptors!
    scriptElt.setAttribute = function(name, value) {
        if(name === 'type' || name === 'src')
            scriptElt[name] = value
        else
            HTMLScriptElement.prototype.setAttribute.call(scriptElt, name, value)
    }

    return scriptElt
}
