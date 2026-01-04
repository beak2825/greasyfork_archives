// ==UserScript==
// @name                7zap Reveal Ultra Light Clean Enhanced
// @version             3.81
// @author              oumuamuax
// @namespace           https://github.com/oumuamuax/7zap-reveal-img-and-codes
// @description         Reveals the part numbers on 7zap, removes image blur, and eliminates premium restriction messages.
// @license             MIT
// @match               https://*.7zap.com/*
// @grant               none
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/540442/7zap%20Reveal%20Ultra%20Light%20Clean%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/540442/7zap%20Reveal%20Ultra%20Light%20Clean%20Enhanced.meta.js
// ==/UserScript==

console.log('7zap Universal Blur Interceptor: Iniciando...');

// *** INTERCEPTAR APLICACIÓN DE BLUR SIN DEPENDER DE CLASES ESPECÍFICAS ***
(function() {
    'use strict';

    // 1. INTERCEPTAR TODAS LAS MODIFICACIONES DE STYLE QUE CONTENGAN BLUR
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
        if (property === 'filter' && value && value.includes('blur')) {
            console.log('7zap Interceptor: Bloqueada aplicación de filter blur');
            return; // No aplicar blur
        }
        if (property === '-webkit-filter' && value && value.includes('blur')) {
            console.log('7zap Interceptor: Bloqueada aplicación de -webkit-filter blur');
            return; // No aplicar blur
        }
        return originalSetProperty.call(this, property, value, priority);
    };

    // 2. INTERCEPTAR ASIGNACIÓN DIRECTA DE STYLE.FILTER
    Object.defineProperty(HTMLElement.prototype, 'style', {
        get: function() {
            if (!this._styleProxy) {
                this._styleProxy = new Proxy(this.getAttribute('style') ?
                    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style').get.call(this) :
                    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style').get.call(this), {
                    set: function(target, property, value) {
                        if ((property === 'filter' || property === 'webkitFilter') &&
                            value && value.includes && value.includes('blur')) {
                            console.log('7zap Interceptor: Bloqueada asignación directa de blur');
                            return true; // No aplicar
                        }
                        target[property] = value;
                        return true;
                    }
                });
            }
            return this._styleProxy;
        },
        configurable: true
    });

    // 3. INTERCEPTAR classList.add PARA CUALQUIER CLASE
    const originalClassListAdd = DOMTokenList.prototype.add;
    DOMTokenList.prototype.add = function() {
        const args = Array.from(arguments);
        const filteredArgs = args.filter(className => {
            // Obtener el CSS de la clase para verificar si tiene blur
            const tempElement = document.createElement('div');
            tempElement.className = className;
            document.body.appendChild(tempElement);
            const computedStyle = window.getComputedStyle(tempElement);
            const hasBlur = computedStyle.filter && computedStyle.filter.includes('blur');
            document.body.removeChild(tempElement);

            if (hasBlur) {
                console.log('7zap Interceptor: Bloqueada clase con blur:', className);
                return false;
            }
            return true;
        });

        if (filteredArgs.length > 0) {
            return originalClassListAdd.apply(this, filteredArgs);
        }
    };

    // 4. INTERCEPTAR setAttribute PARA STYLE Y CLASS
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'style' && value && value.includes && value.includes('blur')) {
            console.log('7zap Interceptor: Bloqueada setAttribute style con blur');
            return;
        }
        if (name === 'class' && value && this.tagName === 'IMG') {
            // Verificar si alguna de las clases tiene blur en su CSS
            const classes = value.split(' ');
            const filteredClasses = classes.filter(className => {
                const rules = Array.from(document.styleSheets).flatMap(sheet => {
                    try {
                        return Array.from(sheet.cssRules || []);
                    } catch (e) {
                        return [];
                    }
                });

                const hasBlurRule = rules.some(rule => {
                    if (rule.selectorText && rule.selectorText.includes(className) &&
                        rule.style && rule.style.filter && rule.style.filter.includes('blur')) {
                        console.log('7zap Interceptor: Detectada clase con blur en CSS:', className);
                        return true;
                    }
                    return false;
                });

                return !hasBlurRule;
            });

            if (filteredClasses.length !== classes.length) {
                value = filteredClasses.join(' ');
            }
        }
        return originalSetAttribute.call(this, name, value);
    };

    // 5. BLOQUEAR MutationObserver QUE ELIMINA IMÁGENES
    const originalMutationObserver = window.MutationObserver;
    window.MutationObserver = function(callback) {
        return new originalMutationObserver(function(mutations) {
            const filteredMutations = mutations.filter(function(mutation) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'style' &&
                    mutation.target.tagName === 'IMG') {
                    console.log('7zap Interceptor: Bloqueada mutación de style en imagen');
                    return false;
                }
                return true;
            });

            if (filteredMutations.length > 0) {
                return callback(filteredMutations);
            }
        });
    };

    // 6. PROTEGER Element.prototype.remove PARA IMÁGENES
    const originalRemove = Element.prototype.remove;
    Element.prototype.remove = function() {
        if (this.tagName === 'IMG') {
            console.log('7zap Interceptor: Bloqueada eliminación de imagen');
            return;
        }
        return originalRemove.call(this);
    };

    // 7. INTERCEPTAR SCRIPTS INLINE QUE APLICAN BLUR
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
        if (child.tagName === 'SCRIPT' && child.textContent) {
            const content = child.textContent;
            if (content.includes('classList.add(bCs)') ||
                content.includes('style.filter="blur') ||
                content.includes('filter: blur')) {
                console.log('7zap Interceptor: Bloqueado script que aplica blur');
                child.textContent = '// Script de blur bloqueado por 7zap Interceptor';
            }
        }
        return originalAppendChild.call(this, child);
    };

})();

// *** APLICAR CSS UNIVERSAL ANTI-BLUR ***
function applyUniversalAntiBlur() {
    const style = document.createElement('style');
    style.id = '7zap-universal-anti-blur';
    style.innerHTML = `
        /* Eliminar blur de CUALQUIER imagen sin importar la clase */
        img[style*="blur"],
        img[style*="filter: blur"],
        img[style*="-webkit-filter: blur"] {
            -webkit-filter: none !important;
            -moz-filter: none !important;
            -ms-filter: none !important;
            -o-filter: none !important;
            filter: none !important;
            opacity: 1 !important;
        }

        /* Detectar cualquier clase que contenga patrones comunes de hash MD5 */
        img[class*="a"], img[class*="b"], img[class*="c"], img[class*="d"],
        img[class*="e"], img[class*="f"], img[class*="0"], img[class*="1"],
        img[class*="2"], img[class*="3"], img[class*="4"], img[class*="5"],
        img[class*="6"], img[class*="7"], img[class*="8"], img[class*="9"] {
            -webkit-filter: none !important;
            filter: none !important;
        }

        /* Fuerza bruta: todas las imágenes de 7zap */
        img[src*="7zap.com"],
        img[src*="img.7zap.com"] {
            -webkit-filter: none !important;
            filter: none !important;
        }

        /* Ocultar alertas de restricción */
        .alert-scheme {
            display: none !important;
            visibility: hidden !important;
        }
    `;

    if (document.head && !document.getElementById('7zap-universal-anti-blur')) {
        document.head.appendChild(style);
        console.log('7zap Interceptor: CSS universal anti-blur aplicado');
    }
}

// *** FUNCIONALIDAD PRINCIPAL DE REVELADO DE NÚMEROS ***
function processPage() {
    // Versión clásica
    var classicElements = document.querySelectorAll('.copyPartNumberWrap:not([data-7zap-done])');
    for(var i = 0; i < classicElements.length; i++) {
        var element = classicElements[i];
        replace_hidden_pn_clean(element);

        if (element.children[1]) {
            element.children[1].setAttribute("href", "https://www.google.com/search?q=" + get_pn_clean(element).replaceAll(" ", "+"));
        }
        if (element.children[0]) {
            element.children[0].setAttribute("onclick", "navigator.clipboard.writeText(\"" + get_pn_clean(element) + "\")");
        }

        element.setAttribute('data-7zap-done', 'true');
        console.log('7zap Interceptor: Procesado clásico:', get_pn_clean(element));
    }

    // Versión moderna - números ocultos
    var strongElements = document.querySelectorAll('strong:not([data-7zap-revealed])');
    for(var j = 0; j < strongElements.length; j++) {
        var strongElement = strongElements[j];
        var text = strongElement.textContent || '';
        if (text.match(/\d+\*+\d*/)) {
            var container = strongElement.closest('.partCodeInCatalog, tr, div');
            if (container) {
                var onclickElement = container.querySelector('[onclick*="clickToCopyPartNumber"]');
                if (onclickElement) {
                    var onclick = onclickElement.getAttribute('onclick');
                    var match = onclick.match(/clickToCopyPartNumber\(['"]([^'"]+)['"]\)/);
                    if (match && match[1]) {
                        strongElement.textContent = match[1];
                        strongElement.setAttribute('data-7zap-revealed', 'true');
                        console.log('7zap Interceptor: Revelado moderno:', text, '->', match[1]);
                    }
                }
            }
        }
    }
}

function get_pn_clean(e) {
    var idx_s = e.innerHTML.indexOf("('") + 2;
    var idx_e = e.innerHTML.indexOf("')", idx_s);
    var fullText = e.innerHTML.substr(idx_s, idx_e - idx_s).replaceAll("&nbsp;","");

    if (fullText.includes("', '")) {
        var cleanNumber = fullText.split("', '")[0];
        return cleanNumber;
    }

    return fullText;
}

function replace_hidden_pn_clean(e) {
    var ret = "";
    var idx_s = e.innerHTML.indexOf("</i>") + 4;
    var idx_e = e.innerHTML.indexOf("&nbsp", idx_s);

    ret += e.innerHTML.substr(0, idx_s);
    ret += get_pn_clean(e);
    ret += e.innerHTML.substr(idx_e);

    e.innerHTML = ret;
}

function hideAlerts() {
    var textElements = document.querySelectorAll('div, span, p');
    for(var j = 0; j < textElements.length; j++) {
        var text = textElements[j].textContent || '';
        if (text.includes('Users without a premium tariff can view no more than') &&
            !textElements[j].dataset.zapHidden) {
            textElements[j].style.transform = 'translateX(-9999px)';
            textElements[j].style.position = 'absolute';
            textElements[j].dataset.zapHidden = 'true';
            console.log('7zap Interceptor: Mensaje premium oculto');
        }
    }
}

// *** APLICAR CSS INMEDIATAMENTE ***
applyUniversalAntiBlur();

// *** INICIALIZACIÓN ***
function waitForDOM() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                processPage();
                hideAlerts();
                applyUniversalAntiBlur();
            }, 500);
        });
    } else {
        setTimeout(function() {
            processPage();
            hideAlerts();
            applyUniversalAntiBlur();
        }, 500);
    }
}

waitForDOM();

// *** VERIFICACIÓN PERIÓDICA ***
setInterval(function() {
    try {
        var classicUnprocessed = document.querySelectorAll('.copyPartNumberWrap:not([data-7zap-done])');
        var hiddenNumbers = document.querySelectorAll('strong:not([data-7zap-revealed])');

        var foundHidden = 0;
        for(var i = 0; i < hiddenNumbers.length; i++) {
            if (hiddenNumbers[i].textContent && hiddenNumbers[i].textContent.includes('*')) {
                foundHidden++;
            }
        }

        if (classicUnprocessed.length > 0 || foundHidden > 0) {
            processPage();
        }

        // Reaplicar CSS anti-blur
        if (!document.getElementById('7zap-universal-anti-blur')) {
            applyUniversalAntiBlur();
        }

    } catch (e) {
        console.error('7zap Interceptor: Error:', e);
    }
}, 5000);

console.log('7zap Universal Blur Interceptor: Protección universal activada');
