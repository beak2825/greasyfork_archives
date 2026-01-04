    // ==UserScript==
    // @name         Wawiwa black
    // @namespace    http://tampermonkey.net/
    // @version      2024-05-04
    // @description  Cambiar el tema visual a un esquema de colores oscuros
    // @author       ferchonet@gmail.com
    // @match        https://platform.blossom-kc.com/wawiwa_tech/
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=blossom-kc.com
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494171/Wawiwa%20black.user.js
// @updateURL https://update.greasyfork.org/scripts/494171/Wawiwa%20black.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        (function() {
            'use strict';
            const negro = "#1b1b1b", blanco = "#fff";
            //const negro2="#1b1b1b\u0020!important";

            function aplicarEstilo(elementos, fondo, texto) {
                for (let i = 0; i < elementos.length; i++) {
                    elementos[i].style.backgroundColor = fondo;
                    elementos[i].style.color = texto;
                }
            }

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        const clases = ['widget-body', '_clickable', '_fore', '_subTitle', '_title', 'main-12y3zn1', 'day', 'subTitle', 'react_container', 'main-hj1q89','_btn','_children','_main_narrow','_main_op','container-header','main-12y3zn1','main-1msxvtn','SidePanel','item-name','main-uukuit','inner-drawer','inner-drawer','main-1rr7s6m','SideCont','MainCol','.main-vmx6u8','main-1digpu7','WidgetContainer','SideCol','main-17a8ym','cat_card','_filler','_modal','InputDropDown','_field_wrapper','_placeholder','narrow','FileViewerOpener','_has_label','active','main-4p9c04','_main','main-3i8ec1','_desc'];
                        clases.forEach(clase => {
                            const elementos = document.getElementsByClassName(clase);
                            console.log(`${clase} count: ${elementos.length}`);
                            aplicarEstilo(elementos, negro, blanco);
                        });
                        /*-------------------------------------------------------------*/
                        var elementos5 = document.getElementsByClassName('_main_narrow');
                        console.log("_main_op"+elementos5.length);
                        for (var i = 0; i < elementos5.length; i++) {
                            console.log("_main_op = hijos ="+i);
                            elementos5[i].parentNode.style.backgroundColor = negro;
                            elementos5[i].parentNode.style.color = blanco;

                        }
                        /*tasks*/
                        var elementos5 = document.getElementsByClassName('MainCol');
                        console.log("MainCol"+elementos5.length);
                        for (var i = 0; i < elementos5.length; i++) {
                            console.log("MainCol = hijos ="+i);
                            console.log('/////////////////negro2='+negro2);
                            elementos5[i].parentNode.style.backgroundColor = negro2;
                            elementos5[i].parentNode.style.color = blanco;
                        }
                        /*_has_label*/
                        var elementos5 = document.getElementsByClassName('_has_label');
                        console.log("MainCol"+elementos5.length);
                        for (var i = 0; i < elementos5.length; i++) {
                            console.log("MainCol = hijos ="+i);
                            console.log('/////////////////negro2='+negro2);
                            elementos5[i].parentNode.style.backgroundColor = negro2;
                            elementos5[i].parentNode.style.color = blanco;
                        }


                        // Asegúrate de que el documento tenga un style sheet al cual puedas añadir reglas
                        if (document.styleSheets.length === 0) {
                            const style = document.createElement("style");
                            document.head.appendChild(style);
                        }

                        // Añadir una regla CSS con !important
                        const clase = "MainCol";  // Cambia esto por la clase real a la que quieres aplicar el estilo
                        const color = "#1b1b1b";
                        document.styleSheets[0].insertRule(`.${clase} { background-color: ${color} !important; }`, document.styleSheets[0].cssRules.length);

                        document.styleSheets[0].insertRule(`html body .${clase} { background-color: ${color} !important; }`, document.styleSheets[0].cssRules.length);
                        document.styleSheets[0].insertRule(`td .${clase} { background-color: ${color} !important; }`, document.styleSheets[0].cssRules.length);

                        document.getElementById("html_theme").style.backgroundColor = negro;
                    }
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        })();


    })();

