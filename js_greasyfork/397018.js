// ==UserScript==
// @name        Diarios chilenos bypass paywall
// @namespace    http://tampermonkey.net/
// @version      1.024
// @license MIT
// @description  Permite leer contenido pagado en los principales periodicos chilenos
// @name          malu
// @match        https://www.estrellaiquique.cl/
// @include      *digital.elmercurio.com/*
// @include       *digital.lasegunda.com/*
// @include       *www.estrella*.cl/*
// @include      *www.mercurio*.cl/*
// @include      *www.diario*.cl/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397018/Diarios%20chilenos%20bypass%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/397018/Diarios%20chilenos%20bypass%20paywall.meta.js
// ==/UserScript==


if (document.URL.match('digital.elmercurio.com/') || document.URL.match('digital.lasegunda.com/')) {
    (function () {
        document.cookie = "socialReferrer=null";
        document.cookie = "T=null";


        if (getCookie("ActivePDF") == "") {
            window.location.reload();
            document.cookie = "ActivePDF=active";
        }
    }());
}

else if (document.URL.match('estrella') || document.URL.match('diario') || document.URL.match('mercurio')) {
    (function () {

        setInterval(() => {
         
                const modal = document.getElementsByClassName("modal-wrapper");
                const modalOverflow = document.getElementsByClassName("home blog is-diario is-detalle modal-open");
                modal[0].style.display = "none";
                modalOverflow[0].style.overflow = "scroll";
           
        }, 1000);

        var expand = document.getElementsByClassName("col-7 grm-page")[0];
        expand.classList.add("expanded");
        document.getElementById('app').id = "nonap";
        document.getElementById('content').id = "noncontet";
        document.getElementsByClassName("modal-wrapper")[0].style.display = "none";
        GM_addStyle(".modal-open { overflow: visible !important } ");
        var targetNode = document.body;
        const config = { attributes: true, childList: true, subtree: true, attributeOldValue: true };
        const callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    if (mutation.oldValue === 'home blog is-diario is-detalle modal-open') {
                        document.body.className = "home blog is-diario is-detalle";
                    }
                }
            }
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    })();
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}