// ==UserScript==
// @name         Complemento para acortadores
// @namespace    Complemento para acortadores
// @version      18.5
// @description  Complemento para los acortadores faltantes
// @author       roberto
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/462522/Complemento%20para%20acortadores.user.js
// @updateURL https://update.greasyfork.org/scripts/462522/Complemento%20para%20acortadores.meta.js
// ==/UserScript==

(function() {
'use strict';

// Ejecuta el script solo en la página principal, no en iframes
if (window.top == window.self) {
    // activar variable para identificar si una pagina carga por completo
    var cargaCompleta = false;
    window.addEventListener('load', () => {
        setTimeout(function(){
            cargaCompleta = true;
        }, 3000);
    });
    //variables de la url y el dominio
    var currentUrl = window.location.href;
    var domain = window.location.hostname;

    // Crea un evento de mouseover
    var eventoMouseOver = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true
    });

    var telegramBotToken = '6232917197:AAHmwehsu1xIj8vg902nwP8G2F9RUerc2UU';
    var telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    var chatIdDiego = '5496846677';

    //enviar mensaje de error a TELEGRAM cuando detecte vpn
    function errorExtension1() {
        const message = domain + ' - cuenta baneada';
        
        fetch(telegramApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatIdDiego,
            text: message
          })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }

    function simularInteraccionClick(elemento) {
        // Crear el evento mousedown
        const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true
        });

        // Crear el evento mouseup
        const mouseupEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true
        });

        // Crear el evento mousemove
        const mousemoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true
        });

        // Crear el evento mouseover
        const mouseoverEvent = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true
        });

        // Simula el evento mousemove con un pequeño retraso
        setTimeout(function() {
            elemento.dispatchEvent(new MouseEvent('mousemoveEvent'));
            elemento.dispatchEvent(new MouseEvent('mouseoverEvent'));
            elemento.focus();
        }, 500);

        // Simula el evento mousedown con un pequeño retraso
        setTimeout(function() {
            elemento.dispatchEvent(mousedownEvent);
        }, 1000);

        // Simula el evento mouseup con un pequeño retraso
        setTimeout(function() {
            elemento.dispatchEvent(mouseupEvent);
        }, 1050);

        // Simula el evento de clic
        setTimeout(function() {
            //elemento.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            elemento.click();
        }, 1150);
    }

    function simularInteraccionClick2(elemento) {
        // Simula el evento mousemove con un pequeño retraso
        setTimeout(function() {
            elemento.dispatchEvent(new MouseEvent('mousemove'));
        }, 500);

        // Establece el foco en el elemento
        setTimeout(function() {
            elemento.dispatchEvent(new MouseEvent('mouseover'));
            elemento.focus();
        }, 600);

        // Simula el evento mousedown con un pequeño retraso
        setTimeout(function() {
            elemento.dispatchEvent(new MouseEvent('mousedown'));
        }, 1000);

        // Simula el evento mouseup con un pequeño retraso
        setTimeout(function() {
            elemento.dispatchEvent(new MouseEvent('mouseup'));
        }, 1050);

        // Simula el evento de clic
        setTimeout(function() {
            elemento.click();
        }, 1150);
    }

    //Check if a string is present in Array
    String.prototype.includesOneOf = function(arrayOfStrings) {
        //If this is not an Array, compare it as a String
        if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
        }
        for (var i = 0; i < arrayOfStrings.length; i++) {
            if (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    function TriggerEvent(element, eventName) {
        let event;
        if (typeof(Event) === 'function') {
            event = new Event(eventName, { bubbles: true, cancelable: true });
        } else {
            event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
        }
        element.dispatchEvent(event);
    }

    // Función para eliminar iframes y contenedores relacionados con hCaptcha y reCAPTCHA
    function eliminarCaptchas() {
        // Seleccionar iframes relacionados con hCaptcha y reCAPTCHA
        const captchas = document.querySelectorAll('iframe[src*="hcaptcha"], iframe[src*="recaptcha"]');
        
        captchas.forEach((iframe) => {
            iframe.remove();
        });
    
        // También eliminamos contenedores comunes que suelen tener CAPTCHAs
        const captchaContainers = document.querySelectorAll('[class*="h-captcha"], [class*="g-recaptcha"]');
        
        captchaContainers.forEach((container) => {
            container.remove();
        });
    }

    if (window.location.href.includes("cryptoinsidernew.com")) {
        eliminarCaptchas();
    }

    // solucion para autodime.com
    if (currentUrl == "https://autodime.com/blog/") {
        window.location.href = "https://autodime.com/blog/page/2/";
    }

    //Click the form button after solving captcha
    var selectorVPN = false;
    var clicked = false;
    var clicked2 = false;
    var clicked3 = false;
    var clicked4 = false;
    var clicked5 = false;
    var clicked6 = false;
    var clicked7 = false;
    var consent = false;
    var count = 0;

    var googleInterval = setInterval(function(){
        if (window.location.href.includes("google.com")) {
            let element = document.querySelectorAll('div a[href*="ctr.sh"]');
            if (element.length > 0) {
                let elemento = element[0];
                if (!clicked && elemento && elemento.style.display !== 'none' && !elemento.disabled) {
                    elemento.click();
                    clicked = true;
                    clearInterval(googleInterval);
                }
            }
        }
    }, 2000);

    setTimeout(function(){
        if (window.location.hostname.includes("vk.com")) {
            window.location.href = "https://google.com/";
        }

        let popupClicksfly = document.querySelector('.header .cover .hcontainer');
        if (popupClicksfly) {
            if (popupClicksfly.textContent.includes("Congratulations")) {
                window.location.href = "https://pastebin.com/raw/yv6R5cy8";
            }
        }
    }, 15000);
    
    /*setTimeout(function(){
        if (window.location.hostname.includes("mythvista.com")) {
            window.location.href = "https://pastebin.com/raw/yv6R5cy8";
        }
    }, 5000);*/

    setTimeout(function(){

        var wlinkName = document.querySelector('lottie-player:is([src*="Animation"])');
        var ctrDomains = ["ashrff.xyz","rezst.xyz","waezf.xyz","vivgames.online","lifgam.online","tpayr.xyz","starkroboticsfrc.com","sinonimos.de","quesignifi.ca","tiktokrealtime.com","tiktokcounter.net","2wheelslife.com","antonimos.de"];
        //var ctrName = document.querySelector('#poweredByPF');
        var ctrName = document.body.innerHTML.includes('poweredByPF');
        if (window.location.href.includesOneOf(ctrDomains) || ctrName || wlinkName) {
            // Crear el iframe
            var iframeCrea = document.createElement('iframe');
            // Establecer atributos del iframe
            iframeCrea.id = 'fixedIframe';
            // Agregar el iframe al cuerpo del documento
            document.body.appendChild(iframeCrea);
        }

        var linkNoFound404 = document.querySelector('.content .container h2');
        var linkNoFoundP = document.querySelector('.content .container p.error');
        if (linkNoFound404 && linkNoFoundP) {
            if (linkNoFound404.textContent.includes("404 Not Found") && linkNoFoundP.textContent.includes("not found on this server")) {
                errorExtension1();
            }
        }

        // pasarse adrinolinks.in
        let hostAdrinoLinks = document.querySelector('script:is([src*="G-51W5NFW23Y"])');
        // pasarse clicksfly Buscando elementos que contengan 'clk.wiki' o 'clk.kim'
        var hostClicksfly = [...document.querySelectorAll('*')].some(el => el.outerHTML.includes('clk.wiki') || el.outerHTML.includes('clk.kim') || el.outerHTML.includes('dekhe.click'));
        // pasarse safelinku Buscando elementos que contengan 'sfl.lku' o 'sfl.gl'
        if (!window.location.hostname.includes("sfl.gl") && !window.location.hostname.includes("sfl.lku")) {
            var hostSafelinku = [...document.querySelectorAll('*')].some(el => el.outerHTML.includes('sfl.lku') || el.outerHTML.includes('sfl.gl') || el.outerHTML.includes('safelinku'));
        }
        // pasarse shrtfly Buscando elementos que contengan 'special_links' o 'sfl.gl'
        var hostShrtfly = false;
        var stepShrtfly1 = [...document.querySelectorAll('*')].some(el => el.outerHTML.includes('special_links'));
        var stepShrtfly2 = document.querySelector('header span:is(*)', function(el) {
            return el.textContent.includes('step');
        });
        if (stepShrtfly1 && stepShrtfly2) {
            hostShrtfly = true;
        }

        // saber si estamos en exe o en cuty
        var exeName = document.querySelector('header a:is([href*="exe.io"])');
        var cutyName = document.querySelector('header a:is([href*="cuty.io"])');

        var acortadorInterval = setInterval(function(){
            // ### CODIGO PARA ACORTADORES

            try{

                // pasarse ctr.sh
                if (window.location.href.includes("ctr.sh")) {
                    let element = document.querySelector('button.btn.btn-primary.btn-captcha:is([type*="submit"])');
                    let element2 = document.querySelector('a.btn.btn-primary.btn-lg.get-link');
                    if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                        clicked = true;
                        // Simula el evento onmouseover en el elemento
                        simularInteraccionClick2(element);
                    }
                    if (!clicked && element2 && element2.style.display !== 'none' && !element2.disabled) {
                        clicked = true;
                        // Simula el evento onmouseover en el elemento
                        simularInteraccionClick2(element2);
                        setTimeout(function(){
                            // Simula el evento onmouseover en el elemento
                            simularInteraccionClick2(element2);
                        }, 7000);
                    }
                    setTimeout(function(){
                        window.location.href = "https://pastebin.com/raw/yv6R5cy8";
                    }, 20000);
                }

                // pasarse sinonimos.de
                var waitingShort = document.querySelector('div#spinner-overlay button');
                if (waitingShort && waitingShort.style.display !== 'none' && !waitingShort.disabled) {
                    simularInteraccionClick2(waitingShort);
                    clearInterval(acortadorInterval);
                }
                if (window.location.href.includesOneOf(ctrDomains) || ctrName) {
                    let agree = document.querySelector('button:is([mode*="primary"])');
                    let agree2Buttons = document.querySelectorAll('#sd-cmp button.sd-cmp-1bquj');
                    let agree2 = agree2Buttons[agree2Buttons.length - 1];
                    let agree3 = document.querySelector('button.cmplz-btn.cmplz-accept');
                    let agree4 = document.querySelectorAll('a.cl-consent__btn.cl-consent-node-a')[1];
                    let changeTab = document.querySelector('#scrolltocbt p');
                    let formHidden = document.querySelector("#checkclick");
                    let element = document.querySelector("#cbt");
                    let element2 = document.querySelector("#userForm div div");
                    let element3 = document.querySelector("h1");
                    let iframes = document.querySelectorAll('iframe');
                    let adblockText = document.querySelectorAll('div.enhanced-reading-modal div')[0];
                    let youtubeDiv = document.querySelector('#youtubeFollowStepModal');
                    let youtubeBoton = document.querySelector('#ytcontinueButton');
                    if (!clicked6 && youtubeDiv && youtubeDiv.style.display !== 'none' && !youtubeDiv.disabled) {
                        if (youtubeBoton && youtubeBoton.style.display !== 'none' && !youtubeBoton.disabled) {
                            simularInteraccionClick(youtubeBoton);
                            clicked6 = true;
                        }
                    }
                    let encontrado = false;
                    if (agree && !clicked5 && agree.style.display !== 'none' && !agree.disabled) {
                        TriggerEvent(agree, 'click');
                        //simularInteraccionClick(agree);
                        clicked5 = true;
                    }
                    if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                        TriggerEvent(agree2, 'click');
                        //simularInteraccionClick(agree2);
                        clicked3 = true;
                    }
                    if (agree3 && !clicked3 && agree3.style.display !== 'none' && !agree3.disabled) {
                        TriggerEvent(agree3, 'click');
                        //simularInteraccionClick(agree3);
                        clicked3 = true;
                    }
                    if (agree4 && !clicked3 && agree4.style.display !== 'none' && !agree4.disabled) {
                        TriggerEvent(agree4, 'click');
                        //simularInteraccionClick(agree4);
                        clicked3 = true;
                    }
                    if (!clicked && changeTab && changeTab.style.display !== 'none' && !changeTab.disabled) {
                        if (changeTab.textContent.includes("Click any ad & keep it open") || changeTab.textContent.includes("Click on the ad to continue")) {
                            clicked = true;
                        }
                    }
                    for (let i = 0; i < iframes.length; i++) {
                        let iframe = iframes[i];
                        if (iframe.src.includes('newassets.hcaptcha.com/captcha/')) {
                            if (!clicked4) {
                                element.scrollIntoView({behavior: 'smooth', block: 'start'});
                                clicked4 = true;
                            }
                            if (unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
                                if (!clicked && element && element.style.display !== 'none' && !element.disabled && !element.classList.contains("disabled") && formHidden && !formHidden.classList.contains("is-hidden")) {
                                    clicked = true;
                                    setTimeout(function(){
                                        simularInteraccionClick(element);
                                    }, 1500);
                                    setTimeout(function(){
                                        simularInteraccionClick(element);
                                    }, 7000);
                                    setTimeout(function(){
                                        simularInteraccionClick(element);
                                    }, 13000);
                                    setTimeout(function(){
                                        simularInteraccionClick(element);
                                    }, 20000);
                                    setTimeout(function(){
                                        simularInteraccionClick(element);
                                    }, 30000);
                                }
                            }
                            encontrado = true;
                        }
                    }

                    if (!encontrado) {
                        if (element && !clicked4) {
                            element.scrollIntoView({behavior: 'smooth', block: 'start'});
                            clicked4 = true;
                        }
                        if (!clicked && element && element.style.display !== 'none' && !element.disabled && !element.classList.contains("disabled") && formHidden && !formHidden.classList.contains("is-hidden")) {
                            clicked = true;
                            setTimeout(function(){
                                simularInteraccionClick(element);
                            }, 1500);
                            setTimeout(function(){
                                simularInteraccionClick(element);
                            }, 7000);
                            setTimeout(function(){
                                simularInteraccionClick(element);
                            }, 13000);
                            setTimeout(function(){
                                simularInteraccionClick(element);
                            }, 20000);
                            setTimeout(function(){
                                simularInteraccionClick(element);
                            }, 30000);
                        }
                    }
                    if (element2 && element2.style.display !== 'none' && !element2.disabled && element2.textContent.includes("reCAPTCHA service")) {
                        window.location.reload();
                        clearInterval(acortadorInterval);
                    }
                    if (element3 && element3.style.display !== 'none' && !element3.disabled && element3.textContent.includes("Automated Bypass")) {
                        window.location.reload();
                        clearInterval(acortadorInterval);
                    }
                    let iframe = document.getElementById('fixedIframe');
                    if (!clicked2 && iframe) {
                        iframe.focus();
                        setTimeout(function(){
                            iframe.focus();
                        }, 4000);
                        clicked2 = true;
                    }
                    if (adblockText && adblockText.style.display !== 'none' && !adblockText.disabled) {
                        if (adblockText.textContent.includes("disabling your ad blocker and tracker protector")){
                            window.location.href = "https://pastebin.com/raw/yv6R5cy8";
                            clearInterval(acortadorInterval);
                        }
                    }
                }
                let sessionsCtr = document.querySelectorAll("div strong")[1];
                if (sessionsCtr && sessionsCtr.style.display !== 'none' && !sessionsCtr.disabled && sessionsCtr.textContent.includes("2 active sessions")) {
                    let buttonSession = document.querySelector("form button");
                    if (buttonSession && buttonSession.style.display !== 'none' && !buttonSession.disabled) {
                        simularInteraccionClick(buttonSession);
                        clearInterval(acortadorInterval);
                    }
                }
                let noShortlink = document.querySelector("div.admania-entrycontent");
                if (noShortlink && noShortlink.style.display !== 'none' && !noShortlink.disabled) {
                    if (noShortlink.textContent.includes("NO_SHORTENER_LINK_FOUND")) {
                        window.location.href = "https://pastebin.com/raw/yv6R5cy8";
                    }
                }
            }catch(e){

            }

            // pasarse gktech.uk tiene recaptcha
            if (!clicked && window.location.href.includes("wlink.us")){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelectorAll('#sd-cmp button.sd-cmp-1bquj')[2];
                let agree3 = document.querySelector('button.cmplz-btn.cmplz-accept');
                let agree4 = document.querySelectorAll('a.cl-consent__btn.cl-consent-node-a')[1];
                let element = document.querySelector('button.btn.btn-primary:is([type="submit"])');
                let element2 = document.querySelector('a.btn.btn-success.btn-lg.get-link:not([class*="disabled"])');
                if (agree && !clicked5 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked5 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (agree3 && !clicked3 && agree3.style.display !== 'none' && !agree3.disabled) {
                    simularInteraccionClick(agree3);
                    clicked3 = true;
                }
                if (agree4 && !clicked3 && agree4.style.display !== 'none' && !agree4.disabled) {
                    simularInteraccionClick(agree4);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    simularInteraccionClick(element);
                    setTimeout(function(){
                        // Simula el evento onmouseover en el elemento
                        simularInteraccionClick(element);
                    }, 7000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                    simularInteraccionClick(element2);
                    setTimeout(function(){
                        // Simula el evento onmouseover en el elemento
                        simularInteraccionClick(element2);
                    }, 7000);
                    clicked = true;
                    clearInterval(acortadorInterval); 
                }
            }

            if (!clicked && window.location.href.includes("wlink.us/bypass.php")){
                window.location.href = "https://google.com/";
                clicked = true;
                clearInterval(acortadorInterval); 
            }
            if (!selectorVPN) {
                let vpnDetect = document.querySelector("head > title");
                if (vpnDetect && vpnDetect.textContent.includes("VPN/Proxy Detected")) {
                    window.location.href = "https://google.com/";
                    selectorVPN = true;
                    clearInterval(acortadorInterval); 
                } else {
                    selectorVPN = true;
                }
            }

            var wlinkName = document.querySelector('lottie-player:is([src*="Animation"])');
            if (wlinkName) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelectorAll('#sd-cmp button.sd-cmp-1bquj')[2];
                let agree3 = document.querySelector('button.cmplz-btn.cmplz-accept');
                let agree4 = document.querySelectorAll('a.cl-consent__btn.cl-consent-node-a')[1];
                let element = document.querySelector("form center > a.btn.btn-primary.btn-lg.claim-button");
                let element2 = document.querySelector("div#wpsafe-generate");
                let element3 = document.querySelector("div#wpsafe-generate > a");
                
                if (agree && !clicked5 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked5 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (agree3 && !clicked3 && agree3.style.display !== 'none' && !agree3.disabled) {
                    simularInteraccionClick(agree3);
                    clicked3 = true;
                }
                if (agree4 && !clicked3 && agree4.style.display !== 'none' && !agree4.disabled) {
                    simularInteraccionClick(agree4);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.hasAttribute('disabled')) {
                    simularInteraccionClick(element);
                    clearInterval(acortadorInterval); 
                }
                if (element2 && element2.parentElement && window.getComputedStyle(element2.parentElement).display !== 'none' && !element2.disabled) {
                    //alert("Elemento padre encontrado: " + element2.parentElement.outerHTML);
                    if (element2 && window.getComputedStyle(element2).display !== 'none' && !element2.hasAttribute('disabled')) {
                        if (element3 && window.getComputedStyle(element3).display !== 'none' && !element3.hasAttribute('disabled')) {
                            simularInteraccionClick(element3);
                            clearInterval(acortadorInterval);
                            setTimeout(function(){
                                var element4 = document.querySelector("div#wpsafegenerate div#wpsafe-link");
                                if (element4 && window.getComputedStyle(element4).display !== 'none' && !element4.hasAttribute('disabled')) {
                                    var element5 = document.querySelector("div#wpsafegenerate div#wpsafe-link > a:is([onclick])");
                                    if (element5 && window.getComputedStyle(element5).display !== 'none' && !element5.hasAttribute('disabled')) {
                                        simularInteraccionClick(element5);
                                    }
                                }
                            }, 4000);
                        }
                    }
                }
                let iframe = document.getElementById('fixedIframe');
                if (!clicked2 && iframe) {
                    iframe.focus();
                    setTimeout(function(){
                        iframe.focus();
                    }, 4000);
                    clicked2 = true;
                }
            }

            if (!consent) {
                let agree = document.querySelector('button.fc-button.fc-cta-consent.fc-primary-button');
                if (agree && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick2(agree);
                    consent = true;
                }
            }

            // pasarse gktech.uk tiene recaptcha
            if (!clicked && window.location.href.includes("gktech.uk")){
                let element = document.querySelector("#overlay-ad button");
                let element1 = document.querySelector("#wpsafelinkhuman");
                let element2 = document.querySelector("#wpsafe-wait1-continue");
                let element3 = document.querySelector("#wpsafe-generate a");
                let element4 = document.querySelector("#wpsafe-link a");
                if (element && element.style.display !== 'none' && !element.disabled) {
                    element.dispatchEvent(eventoMouseOver);
                    element.click();
                    setTimeout(function(){
                        if (element1 && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0 && element1.style.display !== 'none' && !element1.disabled) {
                            element1.dispatchEvent(eventoMouseOver);
                            element1.click();
                            clicked = true;
                            clearInterval(acortadorInterval);
                        }
                    }, 4000);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                    element2.dispatchEvent(eventoMouseOver);
                    element2.click();
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element3 && element3.style.display !== 'none' && !element3.disabled) {
                    element3.dispatchEvent(eventoMouseOver);
                    element3.click();
                }
                if (element4 && element4.style.display !== 'none' && !element4.disabled) {
                    element4.dispatchEvent(eventoMouseOver);
                    element4.click();
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            //pasarse themezon.net del acortador linksly.co y shrinkme.io
            if (!clicked && window.location.href.includes("linksly.co")) {
                let element = document.querySelector("button.btn.btn-primary");
                let element2 = document.querySelector("a.btn.btn-success.btn-lg.get-link");
                if (element && element.style.display !== 'none' && !element.disabled) {
                    element.dispatchEvent(eventoMouseOver);
                    element.click();
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.classList.contains("disabled")) {
                    setTimeout(function(){
                        element2.dispatchEvent(eventoMouseOver);
                        element2.click();
                    }, 5000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse tmearn.net en blogmado.com y cutwin.com en masrawytrend.com
            if (!clicked && (window.location.href.includes("masrawytrend.com") || window.location.href.includes("blogmado.com") || window.location.href.includes("tmearn.net"))){
                let element = document.querySelector('button.btn:is([type="submit"])');
                let elementCaptcha = document.querySelector('iframe:is([title="reCAPTCHA"])');
                if (elementCaptcha) {
                    if (element && element.style.display !== 'none' && !element.disabled && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
                        element.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 4000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                } else {
                    if (element && element.style.display !== 'none' && !element.disabled) {
                        element.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 4000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                }
            }

            // pasarse shortox.com
            if (!clicked && window.location.href.includes("sox.link")){
                let element = document.querySelector("a.btnBgRed.get-link");
                if (element && element.style.display !== 'none' && !element.disabled) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 4000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse shortox.com en surflink.tech mostrar captcha y un click
            if (!clicked && (window.location.href.includes("surflink.tech") || window.location.href.includes("coincroco.com"))){
                let element = document.querySelector("#fexkominhidden2");
                let element2 = document.querySelector("center button.btnBgRed");
                if (element && element.style.display !== 'none' && !element.disabled) {
                    element2.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 4000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse linkrex.net
            if (!clicked && window.location.href.includes("linkrex.net")){
                let element = document.querySelector("a.btn.get-link");
                if (element && element.style.display !== 'none' && !element.disabled) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 4000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse linkrex.net en autodime.com
            if (!clicked && window.location.href.includes("autodime.com")){
                let element = document.querySelector("#wpsafe-snp");
                let element2 = document.querySelector("#button1");
                let element3 = document.querySelector("#showw");
                let element4 = document.querySelector("#showw center a");
                let cloudflareBoxDone = document.querySelector('input[name="cf-turnstile-response"][value]:not([value=""])');
                let cloudflareBoxNotDone = document.querySelector('input[name="cf-turnstile-response"]:not([value])');
                if (element && element.style.display !== 'none' && !element.disabled && cloudflareBoxDone) {
                    if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                        element2.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element2);
                        }, 4000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                }
                if (element3 && element3.style.display !== 'none' && !element3.disabled) {
                    if (element4 && element4.style.display !== 'none' && !element4.disabled) {
                        element4.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element4);
                        }, 4000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                }
                if (cloudflareBoxNotDone && !clicked7) {
                    cloudflareBoxNotDone.scrollIntoView({behavior: 'smooth', block: 'center'});
                    clicked7 = true;
                }
            }

            // pasarse upfiles.com
            var upfilesName = document.querySelector('header a:is([href*="upfiles.com"])');
            if (!clicked && upfilesName){
                let agree = document.querySelector('button.fc-cta-consent');
                let agree2 = document.querySelector('button#ez-accept-all');
                let clickBody = document.querySelector('body');
                let element = document.querySelector('button#link-button:is([type="submit"]):not([class*="disabled"]):not([disabled="disabled"])');
                let element2 = document.querySelector('a#link-button.get-link:not([class*="disabled"]):not([disabled="disabled"])');
                if (agree && !clicked2 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked2 = true;
                }
                if (agree2 && !clicked2 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked2 = true;
                }
                if (clickBody) {
                    if (document.visibilityState === 'visible') {
                        simularInteraccionClick(clickBody);
                    }
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element);
                        }
                    }, 4000);
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element);
                        }
                    }, 11000);
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element);
                        }
                    }, 18000);
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element);
                        }
                    }, 25000);
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element);
                        }
                    }, 32000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                    element2.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element2);
                        }
                    }, 4000);
                    setTimeout(function(){
                        window.location.href = "https://google.com/";
                    }, 16000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse clicksfly.com en clk.wiki
            if (!clicked && (window.location.hostname.includes("clk.wiki") || window.location.hostname.includes("clk.kim")  || window.location.hostname.includes("dekhe.click"))){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('button.btn.btn-primary.btn-captcha');
                let element2 = document.querySelector('div.skip-ad a.btn');
                let element3 = document.querySelector('a.btn.btn-success.btn-lg.get-link:not([class*="disabled"])');
                let element4 = document.querySelector('form div#gads');
                let element5 = document.querySelector('div#sads.container');
                let element6 = document.querySelector('a.btn.btn-success.btn-lg.get-link:is([class*="disabled"])');
                let clickDiv = document.querySelector('body');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    setTimeout(function(){
                        if (agree) {
                            simularInteraccionClick(agree);
                        }
                    }, 5000);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    setTimeout(function(){
                        if (agree2) {
                            simularInteraccionClick(agree2);
                        }
                    }, 5000);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
                    simularInteraccionClick(element4);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 2000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 2000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element3 && element3.style.display !== 'none' && !element3.disabled) {
                    simularInteraccionClick(element5);
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 2000);
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 8000);
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 15000);
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 23000);
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 33000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (!clicked2 && element6 && element6.style.display !== 'none' && !element6.disabled) {
                    simularInteraccionClick(element5);
                    clicked2 = true;
                }
                if (!clicked4 && clickDiv) {
                    simularInteraccionClick(clickDiv);
                    clicked4 = true;
                }
            }

            // pasarse clicksfly.com  en yogablogfit.com, financerites.com, vocalley.com, howifx.com, healthfirstweb.com, mythvista.com
            //const hostClicksfly = ["sololevelingmanga.pics", "ss7.info","yogablogfit.com","financerites.com","vocalley.com","howifx.com","healthfirstweb.com","junkyponk.com","mythvista.com","apekite.com","webhostsec.com","livenewsflix.com"];
            if (hostClicksfly && (!window.location.hostname.includes("clk.wiki") || !window.location.hostname.includes("clk.kim") || !window.location.hostname.includes("dekhe.click"))) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('#scroll:not([class*="hidden"])');
                let element2 = document.querySelector('a:is([href*="#getlink"])');
                let element3 = document.querySelector('#hidden.footerLink:not([class*="hidden"])');
                let element4 = document.querySelector('div#hidden.footerLink');
                let element5 = document.querySelector('#getlink');
                let clickDiv = document.querySelector('body');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    setTimeout(function(){
                        if (agree) {
                            simularInteraccionClick(agree);
                        }
                    }, 5000);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    setTimeout(function(){
                        if (agree2) {
                            simularInteraccionClick(agree2);
                        }
                    }, 5000);
                    clicked3 = true;
                }
                if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                    simularInteraccionClick(element2);
                    clicked = true;
                }
                if (element3 && element3.style.display !== 'none' && !element3.disabled) {
                    simularInteraccionClick(element4);
                    setTimeout(function(){
                        simularInteraccionClick(element5);
                    }, 2000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (!clicked2 && clickDiv) {
                    simularInteraccionClick(clickDiv);
                    setTimeout(function(){
                        simularInteraccionClick(clickDiv);
                    }, 12000);
                    clicked2 = true;
                }
            }
            
            if (!clicked && (window.location.hostname.includes("fc-lc.xyz") || window.location.hostname.includes("fc-lc.com") || window.location.hostname.includes("oii.io"))){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let element = document.querySelector('button#invisibleCaptchaShortlink');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    agree.click();
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 3000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse fc.lc
            if (!clicked && window.location.hostname.includes("labgame.io")){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let agree3 = document.querySelectorAll('#sd-cmp button')[2];
                let element = document.querySelector('#next:not([class*="disabled"])');
                let element2 = document.querySelector('#scroll:not([class*="hidden"])');
                let element3 = document.querySelector('#glink:not([class*="hidden"])');
                let element4 = document.querySelector('#surl:not([class*="disabled"])');
                let overlay = document.querySelector('div#overlay');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    agree.click();
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    agree2.click();
                    clicked3 = true;
                }
                if (agree3 && !clicked3 && agree3.style.display !== 'none' && !agree3.disabled) {
                    agree3.click();
                    clicked3 = true;
                }
                if (!clicked2 && element && element.style.display !== 'none' && !element.disabled) {
                    simularInteraccionClick(element);
                    clicked2 = true;
                }
                if (clicked2 && !clicked4 && element2 && element2.style.display !== 'none' && !element2.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 3000);
                    clicked4 = true;
                }
                if (clicked4 && element3 && element3.style.display !== 'none' && !element3.disabled) {
                    setTimeout(function(){
                        element3.scrollIntoView({behavior: 'smooth', block: 'start'});
                    }, 2000);
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 5000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element4 && element4.style.display !== 'none' && !element4.disabled) {
                    if (overlay) {
                        simularInteraccionClick(overlay);
                    }
                    setTimeout(function(){
                        simularInteraccionClick(element4);
                    }, 3000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse mitly.us
            if (!clicked && window.location.hostname.includes("mitly.us")) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('#invisibleCaptchaShortlink');
                let element2 = document.querySelector('button.btn.btn-primary[type="submit"]:not([class*="btn-captcha"]):not([id])');
                let element3 = document.querySelector('a.btn.btn-success.btn-lg.get-link');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
                    simularInteraccionClick(element);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 7000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                    simularInteraccionClick(element2);
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 7000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element3 && element3.style.display !== 'none' && !element3.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                        setTimeout(function(){
                            simularInteraccionClick(element3);
                        }, 7000);
                    }, 3000);    
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }
            // pasarse mitly.us en sonjuegosgratis.com
            if (!clicked && window.location.hostname.includes("sonjuegosgratis.com")) {
                let element = document.querySelector('button.btn.btn-primary.btn-lg.btn-block');
                if (element && element.style.display !== 'none' && !element.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 2000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                setTimeout(function(){
                    window.location.href = "https://pastebin.com/raw/yv6R5cy8";
                    clicked = true;
                    clearInterval(acortadorInterval);
                }, 45000);
            }

            // pasarse shrtfly.com
            const domainShrtfly = ["stly.link","stfly.me","stfly.cc","stfly.xyz","stfly.vip","stfly.biz"];
            if (!clicked && window.location.hostname.includesOneOf(domainShrtfly)) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('form:is([id]) > button[type="submit"]:not([class*="disabled"]):is([id])');
                let clickBody = document.querySelector('body');
                if (agree && !clicked5 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked5 = true;
                }
                if (agree2 && !clicked5 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked5 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    if (clickBody) {
                        simularInteraccionClick(clickBody);
                    }
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 4000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            if (!clicked && hostShrtfly && !window.location.hostname.includesOneOf(domainShrtfly)) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('button:not([class*="disabled"]):is([id*="_start"])');
                let element2 = document.querySelector('form:is([id]):is([action*="api-endpoint/verify"]) > button[type="submit"]:not([class*="disabled"]):is([id])');
                let element3 = document.querySelector('form:is([id]):is([action*="api-endpoint/verify"]) > button[type="submit"]:not([class*="disabled"]):is([id]):is([data-original-content])');
                let divElement4 = document.querySelector('div:not([class*="hidden"]):is([id*="_final"])');
                let element4 = document.querySelector('form:is([id]):not([action*="api-endpoint/verify"]) > button[type="submit"]:not([class*="disabled"]):is([id])');
                let recaptchaBox = document.querySelector('iframe:is([src*="google.com/recaptcha/"])');
                let cloudflareBox = document.querySelector('input[name="cf-turnstile-response"]');
                let cloudflareBoxDone = document.querySelector('input[name="cf-turnstile-response"][value]:not([value=""])');
                let cloudflareBoxNotDone = document.querySelector('input[name="cf-turnstile-response"]:not([value])');
                let clickBody = document.querySelector('body');
                if (agree && !clicked5 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked5 = true;
                }
                if (agree2 && !clicked5 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked5 = true;
                }
                if (!clicked2 && element && element.style.display !== 'none' && !element.disabled) {
                    if (clickBody) {
                        simularInteraccionClick(clickBody);
                    }
                    setTimeout(function(){
                        if (!clicked2) {
                            simularInteraccionClick(element);
                        }
                        clicked2 = true;
                    }, 4000);
                }
                if (cloudflareBoxNotDone && clicked2 && !clicked4) {
                    cloudflareBoxNotDone.scrollIntoView({behavior: 'smooth', block: 'center'});
                    if (clickBody) {
                        clicked4 = true;
                        simularInteraccionClick(clickBody);
                    }
                }
                if (clicked2 && !clicked3 && element2 && element2.style.display !== 'none' && !element2.disabled) {
                    if (recaptchaBox && cloudflareBox) {
                        if ((unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) && cloudflareBoxDone) {
                            if (clickBody) {
                                simularInteraccionClick(clickBody);
                            }
                            setTimeout(function(){
                                if (!clicked3) {
                                    simularInteraccionClick(element2);
                                }
                                clicked3 = true;
                            }, 4000);
                        }
                    } else {
                        if ((unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) || cloudflareBoxDone) {
                            if (clickBody) {
                                simularInteraccionClick(clickBody);
                            }
                            setTimeout(function(){
                                if (!clicked3) {
                                    simularInteraccionClick(element2);
                                }
                                clicked3 = true;
                            }, 4000);
                        }
                    }
                }
                if (clicked2 && !clicked3 && element3 && element3.style.display !== 'none' && !element3.disabled) {
                    if (element3.textContent.includes("erify")) {
                        if (clickBody) {
                            simularInteraccionClick(clickBody);
                        }
                        setTimeout(function(){
                            if (!clicked3) {
                                simularInteraccionClick(element3);
                            }
                            clicked3 = true;
                        }, 4000);
                    }
                }
                if (clicked3 && divElement4 && divElement4.style.display !== 'none' && !divElement4.disabled) {
                    if (element4 && element4.style.display !== 'none' && !element4.disabled) {
                        if (clickBody) {
                            simularInteraccionClick(clickBody);
                        }
                        setTimeout(function(){
                            element4.scrollIntoView({behavior: 'smooth', block: 'center'});
                            simularInteraccionClick(element4);
                        }, 4000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                }
            }

            // pasarse uii.io  en pwrpa.cc y wordcounter.icu
            if (!clicked && (window.location.hostname.includes("pwrpa.cc") || window.location.hostname.includes("wordcounter.icu") || window.location.hostname.includes("newpa.cc"))){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let agree3 = document.querySelector('div#cmpbox a.cmpboxbtnyes');
                let element = document.querySelector('#invisibleCaptchaShortlink:not([class*="disabled"])');
                let element2 = document.querySelector('a.btn.btn-success.btn-lg.get-link:not([class*="disabled"])');
                let clickBody = document.querySelector('body');
                if (!clicked5 && clickBody) {
                    simularInteraccionClick(clickBody);
                    clicked5 = true;
                }
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (agree3 && !clicked3 && agree3.style.display !== 'none' && !agree3.disabled) {
                    simularInteraccionClick(agree3);
                    clicked3 = true;
                }
                if (!clicked2 && element && element.style.display !== 'none' && !element.disabled) {
                    simularInteraccionClick(element);
                    clicked2 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
                    simularInteraccionClick(element);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 3000);
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 10000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // shrinkearn.com 403 error
            if (!clicked && window.location.hostname.includes("shrinkearn.com")){
                if (document.querySelector('h1:first-of-type').textContent == '403') {
                    location.reload();
                }
            }

            // pasarse shrinkearn.com en blogtechh.com, insmyst.com, host-buzz.com, tech-bixby.com
            const hostShrinkearn = ["trockerz.in", "wp2hostt.com", "blogtechh.com","insmyst.com","host-buzz.com","tech-bixby.com","techbixby.com", "blogmystt.com"];
            if (!clicked && window.location.hostname.includesOneOf(hostShrinkearn) && cargaCompleta) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('#scroll');
                let element2 = document.querySelector('#scroll a');
                let element3 = document.querySelector('button#getlink:not([class*="disabled"])');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    setTimeout(function(){
                        if (agree) {
                            simularInteraccionClick(agree);
                        }
                    }, 5000);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    setTimeout(function(){
                        if (agree2) {
                            simularInteraccionClick(agree2);
                        }
                    }, 5000);
                    clicked3 = true;
                }
                if (!clicked2 && element && element.style.display !== 'none' && !element.disabled) {
                    clicked2 = true;
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 3000);
                    setTimeout(function(){
                        if (element3 && element3.style.display !== 'none' && !element3.disabled) {
                            setTimeout(function(){
                                simularInteraccionClick(element3);
                            }, 4000);
                            clicked = true;
                            clearInterval(acortadorInterval);
                        }
                    }, 7000);
                }
            }

            // pasarse shrinkearn.com y clk.sh
            const domainShrinkearnClk = ["tii.la","tpi.li","oko.sh","oii.la"];
            if (!clicked && window.location.hostname.includesOneOf(domainShrinkearnClk) && cargaCompleta) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector("button.btn.btn-primary");
                let element2 = document.querySelector('a.btn.btn-success.btn-lg.get-link:not([class*="disabled"])');
                let clickBody = document.querySelector('body');
                if (clickBody) {
                    simularInteraccionClick(clickBody);
                }
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 4000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 4000);
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 14000);
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 24000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            //pasarse themezon.net del acortador linksly.co y shrinkme.io
            if (!clicked && window.location.href.includes("travelkuku.com")) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector("#recaptcha_for_all_button");
                let element2 = document.querySelector(".wp-die-message");
                let element3 = document.querySelector("#btn1");
                let element4 = document.querySelector("#btn2");
                let element5 = document.querySelector("a.get-link");
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    simularInteraccionClick(element);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled && element2.textContent.includes("Forbidden")) {
                    window.location.reload();
                    clearInterval(acortadorInterval);
                }
                if (!clicked2 && element3 && element3.style.display !== 'none' && !element3.disabled) {
                    simularInteraccionClick(element3);
                    clicked2 = true;
                }
                if (element4 && element4.style.display !== 'none' && !element4.disabled) {
                    if (element5) {
                        simularInteraccionClick(element5);
                    }
                    setTimeout(function(){
                        simularInteraccionClick(element4);
                    }, 4000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            if (!clicked && window.location.href.includes("themezon.net")) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector("div#nextPage > button#btn2");
                let element2 = document.querySelector(".wp-die-message");
                let element3 = document.querySelector("#btn1");
                let element4 = document.querySelector("a.get-link");
                let element5 = document.querySelector("#nextPage");
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (!clicked2 && element3 && element3.style.display !== 'none' && !element3.disabled) {
                    setTimeout(function(){
                        if (!clicked2 && element3 && element3.style.display !== 'none' && !element3.disabled) {
                            clicked2 = true;
                            simularInteraccionClick(element3);
                        }
                    }, 3000);
                }
                if (clicked2 && !clicked && element4 && element4.parentNode && element4.parentNode.style.display !== 'none' && !element4.disabled) {
                    simularInteraccionClick(element4);
                    setTimeout(function(){
                        if (element && element.style.display !== 'none' && !element.disabled && element.parentNode && element.parentNode.style.display !== 'none') {
                            simularInteraccionClick(element);
                        }
                    }, 5000);
                    setTimeout(function(){
                        if (element5 && element5.style.display !== 'none' && !element5.disabled) {
                            simularInteraccionClick(element5);
                            let element6 = document.querySelector("#nextPage button");
                            if (element6 && element6.style.display !== 'none' && !element6.disabled) {
                                simularInteraccionClick(element6);
                            }
                        }
                    }, 22000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (element2 && element2.style.display !== 'none' && !element2.disabled && element2.textContent.includes("Forbidden")) {
                    window.location.reload();
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse ouo.io
            if (!clicked && (window.location.hostname.includes("ouo.io") || window.location.hostname.includes("ouo.press"))) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('button#btn-main:not([class*="disabled"])');
                let formFinal = document.querySelector('form#form-go');
                let clickBody = document.querySelector('body');
                if (clickBody && !clicked2) {
                    clicked2 = true;
                    simularInteraccionClick(clickBody);
                }
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled && formFinal) {
                    let botonAncho = element.offsetWidth;
                    let botonAlto = element.offsetHeight;

                    // Buscar un div con las mismas dimensiones
                    let divEncima = document.querySelector('div[style*="width: ' + botonAncho + 'px;"][style*="height: ' + botonAlto + 'px;"]');

                    if (divEncima && divEncima.style.display !== "none") {
                        simularInteraccionClick(divEncima);
                    } else {
                        element.scrollIntoView({behavior: 'smooth', block: 'center'});
                        simularInteraccionClick(element);
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 7000);
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 14000);
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 21000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                }
                if (element && element.style.display !== 'none' && !element.disabled && !formFinal) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 5000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 12000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse gplinks.co en nokrivibhag.in, ipotrend.in
            var domainGplinks = document.querySelector('head script:is([src*="gplinks.co"])');
            if (!clicked && domainGplinks && !window.location.href.includes("gplinks.co")) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector("button#VerifyBtn:is([style*='display: block;'])");
                let element2 = document.querySelector('div#GoNewxtDiv');
                let element3 = document.querySelector('div#GoNewxtDiv a#NextBtn');
                let clickBody = document.querySelector('body');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (!clicked2 && element) {
                    if (clickBody) {
                        simularInteraccionClick(clickBody);
                    }
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 5000);
                    clicked2 = true;
                }
                if (clicked2 && element2 && element2.style.display !== 'none' && !element2.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 5000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse gplinks.co
            if (!clicked && window.location.hostname.includes("gplinks.co")) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('a#captchaButton:not([class*="disabled"])');
                let cloudflareBox = document.querySelector('div.cf-turnstile:is([data-sitekey])');
                let clickBody = document.querySelector('body');
                if (!clicked2 && clickBody) {
                    simularInteraccionClick(clickBody);
                    clicked2 = true;
                }
                if (!clicked && cloudflareBox) {
                    cloudflareBox.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 5000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 12000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse cpmlink.net
            if (!clicked && window.location.hostname.includes("cpmlink.net")) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('a#btn-main');
                let divEncima = document.querySelector('body > div:is([style*="width: 100%;"][style*="height: 100%;"][style*="display: block;"][style*="z-index"])');
                let clickBody = document.querySelector('body');
                if (clickBody && !clicked2) {
                    clicked2 = true;
                    simularInteraccionClick(clickBody);
                }
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    if (divEncima) {
                        simularInteraccionClick(divEncima);
                    } else {
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 5000);
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 12000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                }
            }

            // pasarse safelinku.com
            if (!clicked && window.location.hostname.includes("sfl.gl")) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('button');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 5000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 12000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse safelinku.com
            if (!clicked && hostSafelinku) {
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('#btn-1');
                let element2 = document.querySelector('#btn-2');
                let element3 = document.querySelector('#btn-3');
                let cloudflareBoxDone = document.querySelector('input[name="cf-turnstile-response"][value]:not([value=""])');
                let cloudflareBoxNotDone = document.querySelector('input[name="cf-turnstile-response"]:not([value])');
                let clickBody = document.querySelector('body');
                if (clickBody && !clicked6) {
                    clicked6 = true;
                    simularInteraccionClick(clickBody);
                }
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (!clicked2 && element && element.style.display !== 'none' && !element.disabled) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    simularInteraccionClick(element);
                    clicked2 = true;
                }
                if (clicked2 && !clicked4 && element2 && element2.style.display !== 'none' && !element2.disabled) {
                    element2.scrollIntoView({behavior: 'smooth', block: 'center'});
                    simularInteraccionClick(element2);
                    clicked4 = true;
                }
                if (clicked4 && !clicked5 && element2 && element2.style.display !== 'none' && !element2.disabled && cloudflareBoxDone) {
                    cloudflareBoxDone.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        simularInteraccionClick(element2);
                    }, 2000);
                    clicked5 = true;
                }
                if (clicked5 && element3 && element3.style.display !== 'none' && !element3.disabled && cloudflareBoxDone) {
                    cloudflareBoxDone.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        simularInteraccionClick(element3);
                    }, 10000);
                    clicked = true;
                }
                if (cloudflareBoxNotDone && !clicked7) {
                    cloudflareBoxNotDone.scrollIntoView({behavior: 'smooth', block: 'center'});
                    if (clickBody) {
                        simularInteraccionClick(clickBody);
                    }
                    clicked7 = true;
                }
            }

            // pasarse paid4link.com
            if (!clicked && window.location.hostname.includes("paid4link.com")){
                let element = document.querySelector('a#get-link-button:not([class*="disabled"])');
                let cloudflareBox = document.querySelector('div.cf-turnstile:is([data-sitekey])');
                let clickBody = document.querySelector('body');
                if (!clicked3 && clickBody) {
                    simularInteraccionClick(clickBody);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 4000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 11000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 18000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 25000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 32000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
                if (!clicked && cloudflareBox) {
                    cloudflareBox.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }

            // pasarse adrinolinks.in
            if (!clicked && hostAdrinoLinks){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let popupDiv = document.querySelector('div#popup');
                let popupClose = document.querySelector('div:is([onclick*="closePopup()"])');
                let element = document.querySelector("button#tp-snp2");
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    setTimeout(function(){
                        if (agree && agree.style.display !== 'none' && !agree.disabled) {
                            simularInteraccionClick(agree);
                        }
                    }, 4000);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    setTimeout(function(){
                        if (agree2 && agree2.style.display !== 'none' && !agree2.disabled) {
                            simularInteraccionClick(agree2);
                        }
                    }, 4000);
                    clicked3 = true;
                }
                if (!clicked2 && popupDiv && popupDiv.style.display !== 'none' && !popupDiv.disabled && popupClose) {
                    // Generar un número aleatorio entre 0 y 100
                    if (Math.random() * 100 < 40) {
                        // Crear el iframe y hacer focus
                        let iframeCrea = document.createElement('iframe');
                        iframeCrea.id = 'fixedIframe';
                        document.body.appendChild(iframeCrea);
                        let iframe = document.getElementById('fixedIframe');
                        if (!clicked4 && iframe) {
                            iframe.focus();
                            clicked4 = true;
                        }
                    }
                    setTimeout(function(){
                        if (!clicked2) {
                            simularInteraccionClick(popupClose);
                            clicked2 = true;
                        }
                    }, 5000);
                }
                if (!clicked2 && ((!popupDiv && !popupClose) || (popupDiv && !popupClose))) {
                    clicked2 = true;
                }
                if (clicked2 && element && !element.disabled && element.style.display !== 'none' && element.parentNode && !element.parentNode.disabled && element.parentNode.style.display !== 'none') {
                    clicked = true;
                    clearInterval(acortadorInterval);
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 5000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 15000);
                }
            }

            // pasarse seturl.in
            if (!clicked && window.location.hostname.includes("seturl.in")){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('a.btn.btn-success.btn-lg.get-link:not([class*="disabled"])');
                let divBody = document.querySelector('body');
                if (divBody && !clicked4) {
                    divBody.style.display = 'block';
                    clicked4 = true;
                }
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked3 = true;
                }
                if (element && element.style.display !== 'none' && !element.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 5000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 15000);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }
            }

            // pasarse "linkslice.io","btcut.io","lkfms.pro","lkfm.pro"
            const hostProfits = ["linkslice.io","easy4skip.com"/*,"btcut.io","lkfms.pro","lkfm.pro"*/];
            if (!clicked && window.location.hostname.includesOneOf(hostProfits)){
                let element = document.querySelector('a.btn.btn-primary.btn-lg.get-link:not([class*="disabled"])');
                //let element2 = document.querySelector('button:is([type*="submit"])');
                if (element && element.style.display !== 'none' && !element.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 5000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 15000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 25000);
                    setTimeout(function(){
                        simularInteraccionClick(element);
                    }, 35000);
                    clicked = true;
                    clearInterval(acortadorInterval); 
                }
                /*if (element2 && element2.style.display !== 'none' && !element2.disabled && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
                    simularInteraccionClick(element2);
                    clicked = true;
                    clearInterval(acortadorInterval);
                }*/
                /*setTimeout(function(){
                    window.location.href = "https://pastebin.com/raw/yv6R5cy8";
                }, 30000);*/
            }

            // pasarse cutto.io
            /*if (!clicked && window.location.hostname.includes("cutto.io")){
                let element = document.querySelector('a.btn.btn-primary.btn-lg.get-link:not([class*="disabled"])');
                if (element && element.style.display !== 'none' && !element.disabled) {
                    if (element.textContent.includes("Get Link")) {
                        simularInteraccionClick(element.parentNode);
                        simularInteraccionClick(element);
                        setTimeout(function(){
                            // Simula el evento onmouseover en el elemento
                            simularInteraccionClick(element);
                        }, 7000);
                        clicked = true;
                        clearInterval(acortadorInterval);
                    }
                }
            }*/

        },3000);

        var linkpaysInterval = setInterval(function(){
            // pasarse linkpays.in
            //const hostlinkpays = ["webbooki.com","techyblogs.in","onlinerecruiters.in","travelagancy.com","vbnmx.online","surfsees.com","venzoars.com","edigitalizes.com"];
            //if (!clicked && window.location.hostname.includesOneOf(hostlinkpays)){
            let hostlinkpays = document.querySelector('nav.slicknav_nav.slicknav_hidden');
            if (!clicked && hostlinkpays){
                let agree = document.querySelector('button:is([mode*="primary"])');
                let agree2 = document.querySelector('button#ez-accept-all');
                let listTareas = document.querySelector('button.fc-list-item-button');
                let element = document.querySelector('form button#tp98');
                let element2 = document.querySelector('a#btn6 button.tp-btn.tp-blue');
                let element3 = document.querySelector('div#rtg-generate button:is([onclick="scrol()"])');
                let element4 = document.querySelector('div#rtg-btn a');
                let element5 = document.querySelector('div#rtg-btn a button');
                let element6 = document.querySelector('a button#tp-snp2.tp-btn.tp-blue');
                let element7 = document.querySelector('button#rtg-snp2');

                let element8 = document.querySelector('#robotSection1 > button');
                let element9 = document.querySelector('#wpsafe-generate1 > button');
                let element10 = document.querySelector('#robotContinue1 > button');
                let element11 = document.querySelector('#rtg-snp21 > button');
                let element12 = document.querySelector('#rtg-snp21');
                let element13 = document.querySelector('#rtg-snp21 form button');
                let element14 = document.querySelector('button#rtg');

                let closeAd = document.querySelector('#show-ad:is([class*="show"]) a#CloseAd');
                if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    setTimeout(function(){
                        if (agree && agree.style.display !== 'none' && !agree.disabled) {
                            simularInteraccionClick(agree);
                        }
                    }, 4000);
                    clicked3 = true;
                }
                if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    setTimeout(function(){
                        if (agree2 && agree2.style.display !== 'none' && !agree2.disabled) {
                            simularInteraccionClick(agree2);
                        }
                    }, 4000);
                    clicked3 = true;
                }
                if (listTareas && listTareas.style.display !== 'none' && !listTareas.disabled) {
                    simularInteraccionClick(listTareas);
                } else {
                    if (closeAd && !closeAd.disabled && closeAd.style.display !== 'none') {
                        simularInteraccionClick(closeAd);
                    }
                    if (element && !element.disabled && element.style.display !== 'none' && element.parentNode && !element.parentNode.disabled && element.parentNode.style.display !== 'none') {
                        element.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element);
                        }, 4000);
                    }
                    if (element2 && !element2.disabled && element2.style.display !== 'none' && element2.parentNode && !element2.parentNode.disabled && element2.parentNode.style.display !== 'none') {
                        element2.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element2);
                        }, 4000);
                    }
                    if (element3 && !element3.disabled && element3.style.display !== 'none' && element3.parentNode && !element3.parentNode.disabled && element3.parentNode.style.display !== 'none') {
                        element3.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element3);
                        }, 4000);
                    }
                    if (element4 && !element4.disabled && element4.style.display !== 'none' && element4.parentNode && !element4.parentNode.disabled && element4.parentNode.style.display !== 'none') {
                        if (element5 && !element5.disabled && element5.style.display !== 'none' && element5.parentNode && !element5.parentNode.disabled && element5.parentNode.style.display !== 'none') {
                            element5.scrollIntoView({behavior: 'smooth', block: 'center'});
                            setTimeout(function(){
                                simularInteraccionClick(element5);
                            }, 4000);
                        }
                    }
                    if (element6 && !element6.disabled && element6.style.display !== 'none' && element6.parentNode && !element6.parentNode.disabled && element6.parentNode.style.display !== 'none') {
                        element6.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element6);
                        }, 4000);
                    }
                    if (element7 && !element7.disabled && element7.style.display !== 'none' && element7.parentNode && !element7.parentNode.disabled && element7.parentNode.style.display !== 'none') {
                        element7.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element7);
                        }, 4000);
                    }
                    // nuevos clicks
                    if (element8 && !element8.disabled && element8.style.display !== 'none' && element8.parentNode && !element8.parentNode.disabled && element8.parentNode.style.display !== 'none') {
                        element8.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element8);
                        }, 4000);
                    }
                    if (element9 && !element9.disabled && element9.style.display !== 'none' && element9.parentNode && !element9.parentNode.disabled && element9.parentNode.style.display !== 'none') {
                        element9.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element9);
                        }, 4000);
                    }
                    if (element10 && !element10.disabled && element10.style.display !== 'none' && element10.parentNode && !element10.parentNode.disabled && element10.parentNode.style.display !== 'none') {
                        element10.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element10);
                        }, 4000);
                    }
                    if (element11 && !element11.disabled && element11.style.display !== 'none' && element11.parentNode && !element11.parentNode.disabled && element11.parentNode.style.display !== 'none') {
                        element11.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element11);
                        }, 4000);
                    }
                    if (element12 && !element12.disabled && element12.style.display !== 'none') {
                        if (element13 && !element13.disabled && element13.style.display !== 'none') {
                            element13.scrollIntoView({behavior: 'smooth', block: 'center'});
                            setTimeout(function(){
                                simularInteraccionClick(element13);
                            }, 4000);
                        }
                    }
                    if (element14 && !element14.disabled && element14.style.display !== 'none' && element14.parentNode && !element14.parentNode.disabled && element14.parentNode.style.display !== 'none') {
                        element14.scrollIntoView({behavior: 'smooth', block: 'center'});
                        setTimeout(function(){
                            simularInteraccionClick(element14);
                        }, 4000);
                    }
                }
            }
        },6000);
        
        var cutyInterval = setInterval(function(){
            // pasarse exeo.app y cuty
            if (!clicked && (cutyName || exeName) && cargaCompleta){
                let agree = document.querySelector('button.fc-cta-consent');
                let agree2 = document.querySelector('button#ez-accept-all');
                let element = document.querySelector('form#submit-form button#submit-button:is([type="submit"]):not([class*="g-recaptcha"])');
                let element2 = document.querySelector('form#submit-form button#submit-button:is([type="submit"]):is([class*="g-recaptcha"])');
                let element3 = document.querySelector('form#submit-form button#submit-button:not([type="submit"]):not([class*="g-recaptcha"])');
                let listTareas = document.querySelector('button.fc-list-item-button');
                let adblock = document.querySelector('span.error-message');
                let clickBody = document.querySelector('body');
                if (agree && !clicked2 && agree.style.display !== 'none' && !agree.disabled) {
                    simularInteraccionClick(agree);
                    clicked2 = true;
                }
                if (agree2 && !clicked2 && agree2.style.display !== 'none' && !agree2.disabled) {
                    simularInteraccionClick(agree2);
                    clicked2 = true;
                }
                if (listTareas && listTareas.style.display !== 'none' && !listTareas.disabled) {
                    setTimeout(function(){
                        simularInteraccionClick(listTareas);
                    }, 2000);
                } else {
                    // codigo primer click
                    if (element && element.style.display !== 'none' && !element.disabled) {
                        if (clicked4 && document.visibilityState === 'visible') {
                            let botonAncho = element.offsetWidth;
                            let botonAlto = element.offsetHeight;
        
                            // Buscar un div con las mismas dimensiones
                            let divEncima = document.querySelectorAll('div:is([style*="width: ' + botonAncho + 'px;"]):is([style*="height: ' + botonAlto + 'px;"])');
                            let divEncontrado = false;
    
                            divEncima.forEach(div => {
                                if (div.style.display !== "none") {
                                    simularInteraccionClick(div);
                                    divEncontrado = true;
                                }
                            });
                            
                            if (!divEncontrado) {
                                simularInteraccionClick(element);
                            }
                        }
                        if (!clicked4 && clickBody) {
                            if (document.visibilityState === 'visible') {
                                element.scrollIntoView({behavior: 'smooth', block: 'center'});
                                clicked4 = true;
                                simularInteraccionClick(clickBody);
                            }
                        }
                    }
                    // codigo captcha button
                    if (element2 && element2.style.display !== 'none' && !element2.disabled) {
                        if (clicked4 && document.visibilityState === 'visible') {
                            simularInteraccionClick(element2);
                            clicked = true;
                            clearInterval(cutyInterval);
                        }
                        if (!clicked4 && clickBody) {
                            if (document.visibilityState === 'visible') {
                                element2.scrollIntoView({behavior: 'smooth', block: 'center'});
                                clicked4 = true;
                                simularInteraccionClick(clickBody);
                            }
                        }
                    }
                    // codigo final click reclamar
                    if (element3 && element3.style.display !== 'none' && !element3.disabled) {
                        if (clicked4 && document.visibilityState === 'visible') {
                            // aleatorio entre 1 y 7 segundos para dar el click final
                            const randomTime = Math.floor(Math.random() * 7 + 1) * 1000;
                            setTimeout(function(){
                                simularInteraccionClick(element3);
                                setTimeout(function(){
                                    simularInteraccionClick(element3);
                                }, 12000);
                            }, randomTime);
                            clicked = true;
                            clearInterval(cutyInterval);
                        }
                        if (!clicked4 && clickBody) {
                            if (document.visibilityState === 'visible') {
                                element3.scrollIntoView({behavior: 'smooth', block: 'center'});
                                clicked4 = true;
                                simularInteraccionClick(clickBody);
                            }
                        }
                    }
                }
                if (adblock && adblock.style.display !== 'none' && !adblock.disabled && adblock.textContent.includes("Adblock")) {
                    setTimeout(function(){
                        window.location.reload();
                    }, 8000);
                    clicked = true;
                    clearInterval(cutyInterval);
                }
            }
        },5000);

    },4000);

    var acortadorInterval2 = setInterval(function(){

        // pasarse shrinkme.io  en shrinkme.site
        var shrinkmeName = document.querySelector('nav a:is([href*="shrinkme.io"])');
        if (shrinkmeName) {
            let agree = document.querySelector('button:is([mode*="primary"])');
            let agree2 = document.querySelector('button#ez-accept-all');
            //let element = document.querySelector('#invisibleCaptchaShortlink:not([class*="disabled"])');
            let element = document.querySelector('button.btn.btn-primary:not([class*="disabled"])');
            let element2 = document.querySelector('#div-human-verification');
            let element3 = document.querySelector('a.btn.btn-success.btn-lg.get-link:not([class*="disabled"])');
            let clickBody = document.querySelector('body');
            if (clickBody && !window.location.href.includes("themezon.net")) {
                simularInteraccionClick(clickBody);
            }
            if (agree && !clicked3 && agree.style.display !== 'none' && !agree.disabled) {
                simularInteraccionClick(agree);
                clicked3 = true;
            }
            if (agree2 && !clicked3 && agree2.style.display !== 'none' && !agree2.disabled) {
                simularInteraccionClick(agree2);
                clicked3 = true;
            }
            if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                let botonAncho = element.offsetWidth;
                let botonAlto = element.offsetHeight;

                // Buscar un div con las mismas dimensiones
                let divEncima = document.querySelector('div[style*="width: ' + botonAncho + 'px;"][style*="height: ' + botonAlto + 'px;"]');

                if (divEncima && divEncima.style.display !== "none") {
                    simularInteraccionClick(divEncima);
                } else {
                    if (document.visibilityState === 'visible') {
                        simularInteraccionClick(element2);
                        simularInteraccionClick(element);
                        clicked = true;
                        clearInterval(acortadorInterval2);
                    }
                }

            }
            if (!clicked && element3 && element3.style.display !== 'none' && !element3.disabled) {
                element3.scrollIntoView({behavior: 'smooth', block: 'start'});
                setTimeout(function(){
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element3);
                        }
                    }, 3000);
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element3);
                        }
                    }, 10000);
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element3);
                        }
                    }, 20000);
                    setTimeout(function(){
                        if (document.visibilityState === 'visible') {
                            simularInteraccionClick(element3);
                        }
                    }, 30000);
                }, 2000);
                clicked = true;
                clearInterval(acortadorInterval2);
            }
        }

    }, 5000);

    if (window.location.href.includes("pubnotepad.com")) {
        var clicked = false;
        var redirectInterval = setInterval(function(){
            let element = document.querySelector('div.card-body > a:is([href])');
            if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                // Cambiar el atributo target a _self
                element.setAttribute('target', '_self');

                simularInteraccionClick(element);
                clicked = true;
                clearInterval(redirectInterval);
            }
        },3000);
    }

    if (window.location.href.includes("tiktok.com")) {
        var clicked = false;
        var clicked2 = false;
        var redirectInterval = setInterval(function(){
            let element = document.querySelector('div:is([class*="DivGuestModeContainer"]) div:is([class*="DivTextContainer"])');
            let element2 = document.querySelector('div:is([class*="DivShareLinks"]) a');
            let element3 = document.querySelector('button.open_anyway_btn');
            if ((clicked || !element) && element2 && element2.style.display !== 'none' && !element2.disabled) {
                element2.target = "_self";
                simularInteraccionClick(element2);
                clearInterval(redirectInterval);
            }
            if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                simularInteraccionClick(element);
                clicked = true;
            }
            if (!clicked && element3 && element3.style.display !== 'none' && !element3.disabled) {
                simularInteraccionClick(element3);
                clicked = true;
                clearInterval(redirectInterval);
            }
        },3000);
    }

    if (window.location.href.includes("youtube.com/redirect")) {
        var clicked = false;
        var redirectInterval = setInterval(function(){
            let element = document.querySelector('a#invalid-token-redirect-goto-site-button');
            if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                simularInteraccionClick(element);
                clicked = true;
                clearInterval(redirectInterval);
            }
        },3000);
    }

    if (window.location.href.includes("t.me")) {
        var clicked = false;
        var redirectInterval = setInterval(function(){
            let element = document.querySelector('div.tgme_page_action > a');
            if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                if (element.textContent.includes("Open Link")) {
                    simularInteraccionClick(element);
                    clicked = true;
                    clearInterval(redirectInterval);
                }
            }
        },3000);
    }

    if (window.location.href.includes("facebook.com/flx/warn")) {
        var clicked = false;
        var redirectInterval = setInterval(function(){
            let element = document.querySelector('a[role="button"][target="_self"][href]');
            if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                simularInteraccionClick(element);
                clicked = true;
                clearInterval(redirectInterval);
            }
        },3000);
    }

    if (window.location.href.includes("google.com/url?q=")) {
        var clicked = false;
        var redirectInterval = setInterval(function(){
            let element = document.querySelector('body > div > a[href]');
            if (!clicked && element && element.style.display !== 'none' && !element.disabled) {
                simularInteraccionClick(element);
                clicked = true;
                clearInterval(redirectInterval);
            }
        },3000);
    }
}

})();