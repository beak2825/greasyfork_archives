// ==UserScript==
// @name         Herramientas telecentro 2
// @version      33
// @description  Conjunto de herramientas utililes para el dia a dia 1- tabulado rapido para queuemetrics 2- liberacion de boton venta
// @author       atottil-rin
// @match        https://portalventas.telecentro.net.ar/*
// @match        http://10.190.30.34/*
// @match        http://10.190.30.37:8080/*
// @match        http://10.190.30.36:8080/*
// @icon         https://portalventas.telecentro.net.ar/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1386489
// @downloadURL https://update.greasyfork.org/scripts/523961/Herramientas%20telecentro%202.user.js
// @updateURL https://update.greasyfork.org/scripts/523961/Herramientas%20telecentro%202.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const urlRaiz = `${window.location.protocol}//${window.location.host}`;
    const urlFull = window.location.href;

    if (urlRaiz == "https://portalventas.telecentro.net.ar" || urlFull == "http://10.190.30.36:8080/queuemetrics/qm_agentpage2_load.do#") {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "3");
        svg.appendChild(circle);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
            "d",
            "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        );
        svg.appendChild(path);
        // AND = %% OR = %|
        // Contenido de la config
        const container = document.createElement('div');
        container.id = 'main-config-container';

        const div1 = document.createElement('div');
        div1.className = 'subconfig-container';
        const p1 = document.createElement('p');
        p1.innerHTML = 'Liberar boton venta';
        const btni1 = document.createElement('button');
        btni1.innerHTML = 'Liberar';
        btni1.onclick = liberarBtnVenta
        div1.appendChild(p1);
        div1.appendChild(btni1);

        const div2 = document.createElement('div');
        div2.className = 'subconfig-container';
        const p2 = document.createElement('p');
        p2.innerHTML = 'Tabulado rapido';
        const btni2 = document.createElement('input');
        btni2.type = 'checkbox';
        btni2.id = 'checkbox-tablar';
        btni2.onclick = saveConfigToLocalStorage
        div2.appendChild(p2);
        div2.appendChild(btni2);

        function desactivarElemento() {
            const btnl = document.querySelector('button.tl-btn.is-block');
            btnl.disabled = true;
        }

        function liberarBtnVenta() {
            const btnl = document.querySelector('button.tl-btn.is-block');
            if (confirm('Primero corrobora con el dni que la venta no este cargada ¿Está seguro de liberar el botón de venta?')) {
                btnl.disabled = false;
                btnl.onclick = desactivarElemento
            }
        }

        container.appendChild(div1);
        container.appendChild(div2);

        document.body.appendChild(container);

        const formElements = container.querySelectorAll("input, select, textarea");

        formElements.forEach(function (formElement) {
            formElement.style.outline = "none";
            formElement.style.border = "none";
        });

        const btn = document.createElement('a');
        btn.id = 'config-main-btn';
        document.body.appendChild(btn);
        btn.appendChild(svg);
        svg.style = "pointer-events: none; user-select: none; min-height: 25px; min-width: 25px; max-height: 25px; max-width: 25px; margin: 18px;";

        let isDragging = false;
        let hasDragged = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Cargar la posición guardada del botón desde el almacenamiento local
        if (localStorage.getItem("buttonPosition")) {
            const { x, y } = JSON.parse(localStorage.getItem("buttonPosition"));
            setTranslate(x, y, btn);
            currentX = x;
            currentY = y;
            xOffset = x;
            yOffset = y;
        }

        btn.addEventListener("mousedown", dragStart);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === btn) {
                isDragging = true;
                hasDragged = false;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                hasDragged = true;
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, btn);
            }
        }
        const configContainer = document.getElementById("main-config-container");
        configContainer.parentNode.removeChild(configContainer);
        configContainer.style.height = "0px";
        configContainer.style.width = "0px";
        configContainer.style.padding = "0";
        configContainer.style.opacity = "0";
        btn.appendChild(configContainer);
        function dragEnd(e) {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                const position = { x: currentX, y: currentY };
                localStorage.setItem("buttonPosition", JSON.stringify(position));
                if (!hasDragged) {
                    if (svg.classList.contains("animate-spin")) {
                        let temp = btn.style.transition;
                        btn.style.transition = "all 0.05s";
                        btn.style.height = "61px";
                        btn.style.width = "61px";
                        setTimeout(() => {
                            btn.style.transition = temp;
                        }, 50);
                        svg.classList.remove("animate-spin");
                        svg.style.marginLeft = "18px";
                        btn.classList.remove("bg-[#2A2B32]");
                        configContainer.style.height = "0px";
                        configContainer.style.width = "0px";
                        configContainer.style.padding = "0";
                        configContainer.style.opacity = "0";
                    } else {
                        let temp = btn.style.transition;
                        btn.style.transition = "all 0.05s";
                        btn.style.height = "247px";
                        btn.style.width = "301.7px";
                        setTimeout(() => {
                            btn.style.transition = temp;
                        }, 50);
                        svg.classList.add("animate-spin");
                        svg.style.marginLeft = "auto";
                        btn.classList.add("bg-[#2A2B32]");
                        configContainer.removeAttribute("style");
                        configContainer.style.opacity = "0";
                        configContainer.style.transition = "opacity 0.2s";
                        configContainer.style.opacity = "1";
                    }
                }
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // ------------------------------ Configuración ------------------------------

        const spinner = document.createElement("div");
        spinner.classList.add("animate-spin", "w-4", "h-4", "border-white", "border-t-black", "rounded-full");
        spinner.style.borderWidth = "2px";

        function saveConfigToLocalStorage() {
            if (btni2.checked) {
                localStorage.setItem("script1-active", "activado");
                const alertTemp = document.getElementById('palert');
                if (alertTemp) {
                    alertTemp.innerHTML = '6 = Ya cliente</br>9 = Cont Aut</br>8 = Enviar formulario';
                }else{
                    const alert = document.createElement('div');
                    alert.className = 'subconfig-container';
                    alert.id = 'palert';
                    const palert = document.createElement('p');
                    palert.innerHTML = '6 = Ya cliente</br>9 = Cont Aut</br>8 = Enviar formulario';
                    alert.appendChild(palert);
                    container.appendChild(alert);
                }
            } else {
                localStorage.setItem("script1-active", "desactivado");
                const alertTemp = document.getElementById('palert');
                if (alertTemp) {
                    alertTemp.innerHTML = 'Para desactivar el tabulado rapido es necesario reiniciar la ventana';
                }else{
                    const alert = document.createElement('div');
                    alert.className = 'subconfig-container';
                    alert.id = 'palert';
                    const palert = document.createElement('p');
                    palert.innerHTML = 'Para desactivar el tabulado rapido es necesario reiniciar la ventana';
                    alert.appendChild(palert);
                    container.appendChild(alert);
                }
            }
        }
        function loadConfigFromLocalStorage() {
            const script1 = localStorage.getItem("script1-active");

            if (script1 == "activado") {
                btni2.checked = true;
                const alert = document.createElement('div');
                alert.className = 'subconfig-container';
                alert.id = 'palert';
                const palert = document.createElement('p');
                palert.innerHTML = '6 = Ya cliente</br>9 = Cont Aut</br>8 = Enviar formulario';
                alert.appendChild(palert);
                container.appendChild(alert);
            } else {
                btni2.checked = false;
            }
        }

        var styleElement = document.createElement("style");
        var styleContent = `
@-webkit-keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin{
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

#main-config-container{
  --tw-text-opacity: 1;
  height: 100%;
  color: rgb(255 255 255);
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39);
  overflow: hidden;
  cursor: auto;
  -webkit-user-select: text;
  -moz-user-select: text;
  user-select: text;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
.subconfig-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 260px;
  padding: 0px 20px;
}

#config-main-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 0.375rem;
  position: fixed;
  top: 50px;
  right: 200px;
  z-index: 9999;
  color: white;
  text-decoration: none !important;
}

#config-main-btn * {
    font-size: 15px;
    text-decoration: none !important;
}

#config-main-btn p {
    margin: 10px 0px;
    color: white;
}

#config-main-btn:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(42 43 50);
}

#config-main-btn {
  cursor: pointer;
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39);
  transition-property: color, background-color, border-color, fill, stroke,
    -webkit-text-decoration-color;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, -webkit-text-decoration-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  overflow: hidden;
}

#checkbox-tablar{
  width: 20px;
  height: 20px;
}
`
        styleElement.innerHTML = styleContent;
        document.head.appendChild(styleElement);

        loadConfigFromLocalStorage();
    }
        console.log(urlRaiz);
        function handleMessage(event2) {

            if (event2.origin === "http://10.190.30.36:8080") {
                if (event2.data === "script1activo") {
                    document.addEventListener('keydown', function (event) {
                        console.log(event.code+" and "+event.key)
                        if (event.key === '2' && event.code === 'Digit2') {
                            function triggerChangeEvent(element) {
                                var event = new Event('change', {
                                    bubbles: true,
                                    cancelable: true,
                                });
                                element.dispatchEvent(event);
                            }
                            document.querySelector('#selClasif').value = 'no_vta';
                            document.querySelector('#selSubClasif').value = 'a';
                            triggerChangeEvent(document.querySelector('#selClasif'));
                            triggerChangeEvent(document.querySelector('#selSubClasif'));
                            console.log("auto tab clasif as cont aut");
                        } else if (event.key === '3' && event.code === 'Digit3') {
                            function triggerChangeEvent(element) {
                                var event = new Event('change', {
                                    bubbles: true,
                                    cancelable: true,
                                });
                                element.dispatchEvent(event);
                            }
                            document.querySelector('#selClasif').value = 'no_vta';
                            document.querySelector('#selSubClasif').value = 'n';
                            triggerChangeEvent(document.querySelector('#selClasif'));
                            triggerChangeEvent(document.querySelector('#selSubClasif'));
                            console.log("auto tab clasif as cli");
                        } else if (event.key === '5' && event.code === 'Digit5') {
                            var btnSave = document.querySelector('#btnGuardar');
                            var nombreInput = document.querySelector('input[name="nombre"]');
                            var localidadInput = document.getElementById('localidad');
                            if (nombreInput.value.trim() !== '') {
                                if (localidadInput.value.trim() === '') {
                                    localidadInput.value = 'none';

                                }
                                if (!btnSave.disabled) {
                                    btnSave.click();
                                }
                            }
                            console.log("auto tab send");
                        }
                    });
                }
            }
            // window.removeEventListener('message', handleMessage)
        }

        function ejecutarScript() {
            const script1activo = localStorage.getItem("script1-active");
            if (script1activo === "activado") {
                // Enviar postMessage a los iframes existentes
                const destinos = ["http://10.190.30.34", "http://10.190.30.37:8080"];
                const iframes = document.querySelectorAll("iframe");
                iframes.forEach(iframe => {
                    destinos.forEach(destino => {
                        if (iframe.src.startsWith(destino)) {
                            iframe.contentWindow.postMessage("script1activo", destino);
                        }
                    });
                });
            }
        }
        if (urlRaiz == "http://10.190.30.34" || urlRaiz == "http://10.190.30.37:8080") {
            window.addEventListener('message', handleMessage)
        }

        if (urlRaiz == "http://10.190.30.36:8080") {
            const loop = setInterval(ejecutarScript, 1000);
        }

})();
