// ==UserScript==
// @name         Comunicacion Operacion UAS
// @namespace    http://tampermonkey.net/
// @version      2025-03-03
// @description  Comunicacion Operacion UAS en Web del Ministerio de Interior
// @author       You
// @match        https://drones.ses.mir.es/drones-web/formulario
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mir.es
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529477/Comunicacion%20Operacion%20UAS.user.js
// @updateURL https://update.greasyfork.org/scripts/529477/Comunicacion%20Operacion%20UAS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create UI elements
    const container = createContainer();
    const idText = createIdText(container);
    const operatorSelect = createOperatorSelect(container);
    const fillButton = createButton(container, 'Rellena', handleFillButtonClick);
    const saveButton = createButton(container, 'Graba', handleSaveButtonClick);
    const deleteButton = createButton(container, 'Elimina', handleDeleteButtonClick);

    // Initialize
    initialize();

    function createContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.display = 'flex';
        container.style.gap = '10px';
        document.body.appendChild(container);
        return container;
    }

    function createIdText(container) {
        const idText = document.createElement('div');
        container.appendChild(idText);
        return idText;
    }

    function createOperatorSelect(container) {
        const operatorSelect = document.createElement('select');
        container.appendChild(operatorSelect);
        return operatorSelect;
    }

    function createButton(container, text, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.addEventListener('click', onClick);
        container.appendChild(button);
        return button;
    }

    function setCookie(name, value) {
        const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function updateSelect() {
        operatorSelect.innerHTML = '';
        const operators = JSON.parse(getCookie(idText.innerText) || '[]');
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.key;
            option.innerText = operator.key;
            operatorSelect.appendChild(option);
        });
    }

    function handleFillButtonClick() {
        switch (idText.innerText) {
            case 'Operador':
                fillOperatorForm();
                break;
            case 'Piloto':
                fillPilotForm();
                break;
            case 'Uas':
                fillUasForm();
                break;
            case 'Observadores':
                fillObserversForm();
                break;
            case 'Operacion':
                fillOperationForm();
                break;
            default:
                alert('No form found!');
        }
    }

    function handleSaveButtonClick() {
        switch (idText.innerText) {
            case 'Operador':
                saveOperatorForm();
                break;
            case 'Piloto':
                savePilotForm();
                break;
            case 'Uas':
                saveUasForm();
                break;
            case 'Observadores':
                saveObserversForm();
                break;
            case 'Operacion':
                saveOperationForm();
                break;
            default:
                alert('No form found!');
        }
    }

    function handleDeleteButtonClick() {
        const key = operatorSelect.value;
        let items = JSON.parse(getCookie(idText.innerText) || '[]');
        const existingItemIndex = items.findIndex(op => op.key === key);
        if (existingItemIndex !== -1) {
            const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar este ${idText.innerText} "${key}"?`);
            if (!confirmDelete)
                return;

            items.splice(existingItemIndex, 1);
            setCookie(idText.innerText, JSON.stringify(items));
            updateSelect();
        }
    }

    function fillOperatorForm() {
        const operators = JSON.parse(getCookie(idText.innerText) || '[]');
        const selectedOperator = operators.find(op => op.key === operatorSelect.value);
        if (selectedOperator) {
            const formData = selectedOperator.data;
            document.querySelector('#formCampos\\:viaOPERADOR').value = formData.viaOPERADOR;

            const comboBoxViaOperador = document.querySelector('#formCampos\\:tipoViaOPERADOR_input');
            if (comboBoxViaOperador) {
                comboBoxViaOperador.value = formData.tipoViaOPERADOR;
                const event = new Event('change', { bubbles: false });
                comboBoxViaOperador.dispatchEvent(event);
            }

            setTimeout(() => {
                const comboBoxProvinciaOperador = document.querySelector('#formCampos\\:provinciaOPERADOR_input');
                if (comboBoxProvinciaOperador) {
                    comboBoxProvinciaOperador.value = formData.provinciaOPERADOR;
                    const event = new Event('change', { bubbles: false });
                    comboBoxProvinciaOperador.dispatchEvent(event);

                    setTimeout(() => {
                        const comboBoxLocalidadOperador = document.querySelector('#formCampos\\:localidadOPERADOR_input');
                        if (comboBoxLocalidadOperador) {
                            comboBoxLocalidadOperador.value = formData.localidadOPERADOR;
                            const event = new Event('change', { bubbles: false });
                            comboBoxLocalidadOperador.dispatchEvent(event);

                            setTimeout(() => {
                                document.querySelector('#formCampos\\:viaOPERADOR').value = formData.viaOPERADOR;
                                document.querySelector('#formCampos\\:numeroOPERADOR').value = formData.numeroOPERADOR;
                                document.querySelector('#formCampos\\:pisoOPERADOR').value = formData.pisoOPERADOR;
                                document.querySelector('#formCampos\\:codPostalOPERADOR').value = formData.codPostalOPERADOR;
                                document.querySelector('#formCampos\\:telefono1OPERADOR').value = formData.telefono1OPERADOR;
                                document.querySelector('#formCampos\\:telefono2OPERADOR').value = formData.telefono2OPERADOR;
                                document.querySelector('#formCampos\\:emailOPERADOR').value = formData.emailOPERADOR;
                                document.querySelector('#formCampos\\:codigoOp').value = formData.codigoOp;
                            }, 1000); // Adjust the delay as needed
                        }
                    }, 1000); // Adjust the delay as needed
                }
            }, 1000); // Adjust the delay as needed
        } else {
            alert('No hay operador seleccionado o no se ha encontrado la información del operador!');
        }
    }

    function fillPilotForm() {
        const pilots = JSON.parse(getCookie(idText.innerText) || '[]');
        const selectedPilot = pilots.find(op => op.key === operatorSelect.value);
        if (selectedPilot) {
            const formData = selectedPilot.data;


            const comboBoxTipoDocPiloto = document.querySelector('#formCampos\\:tipoDocPILOTO_input');
            if (comboBoxTipoDocPiloto) {
                comboBoxTipoDocPiloto.value = formData.tipoDocPiloto;
                const event = new Event('change', { bubbles: false });
                comboBoxTipoDocPiloto.dispatchEvent(event);
            }

            setTimeout(() => {


                const comboBoxViaPiloto = document.querySelector('#formCampos\\:tipoViaPILOTO_input');
                if (comboBoxViaPiloto) {
                    comboBoxViaPiloto.value = formData.tipoViaPILOTO;
                    const event = new Event('change', { bubbles: false });
                    comboBoxViaPiloto.dispatchEvent(event);
                }

                setTimeout(() => {
                    const comboBoxProvinciaPiloto = document.querySelector('#formCampos\\:provinciaPILOTO_input');
                    if (comboBoxProvinciaPiloto) {

                        comboBoxProvinciaPiloto.value = formData.provinciaPILOTO;
                        const event = new Event('change', { bubbles: false });
                        comboBoxProvinciaPiloto.dispatchEvent(event);

                        setTimeout(() => {
                            const comboBoxLocalidadPiloto = document.querySelector('#formCampos\\:localidadPILOTO_input');
                            if (comboBoxLocalidadPiloto) {

                                comboBoxLocalidadPiloto.value = formData.localidadPILOTO;
                                const event = new Event('change', { bubbles: false });
                                comboBoxLocalidadPiloto.dispatchEvent(event);

                                setTimeout(() => {

                                    document.querySelector('#formCampos\\:nombreRazonPILOTO').value = formData.nombreRazonPILOTO;
                                    document.querySelector('#formCampos\\:apellido1PILOTO').value = formData.apellido1PILOTO;
                                    document.querySelector('#formCampos\\:apellido2PILOTO').value = formData.apellido2PILOTO;

                                    document.querySelector('#formCampos\\:documentoPILOTO').value = formData.documentoPILOTO;
                                    document.querySelector('#formCampos\\:viaPILOTO').value = formData.viaPILOTO;

                                    document.querySelector('#formCampos\\:numeroPILOTO').value = formData.numeroPILOTO;
                                    document.querySelector('#formCampos\\:portalPILOTO').value = formData.portalPILOTO;
                                    document.querySelector('#formCampos\\:pisoPILOTO').value = formData.pisoPILOTO;
                                    document.querySelector('#formCampos\\:letraPILOTO').value = formData.letraPILOTO;
                                    document.querySelector('#formCampos\\:codPostalPILOTO').value = formData.codPostalPILOTO;
                                    document.querySelector('#formCampos\\:telefono1PILOTO').value = formData.telefono1PILOTO;
                                    document.querySelector('#formCampos\\:telefono2PILOTO').value = formData.telefono2PILOTO;

                                    document.querySelector('#formCampos\\:emailPILOTO').value = formData.emailPILOTO;

                                    document.querySelector('#formCampos\\:desCertCompetPil').value = formData.desCertCompetPil;
                                    document.querySelector('#formCampos\\:desCertFormacionPil').value = formData.desCertFormacionPil;
                                    document.querySelector('#formCampos\\:desCertSeguroPil').value = formData.desCertSeguroPil;
                                    document.querySelector('#formCampos\\:fechaVigCertSeguroPil_input').value = formData.fechaVigCertSeguroPil;
                                    document.querySelector('#formCampos\\:entidadCertSeguroPil').value = formData.entidadCertSeguroPil;
                                }, 1000); // Adjust the delay as needed
                            }
                        }, 1000); // Adjust the delay as needed
                    }
                }, 2000); // Adjust the delay as needed
            }, 2000); // Adjust the delay as needed
        } else {
            alert('no se hay piloto seleccionado o no se ha encontrado la información del piloto!');
        }
    }

    function fillUasForm() {
        const uas = JSON.parse(getCookie(idText.innerText) || '[]');
        const selectedUas = uas.find(op => op.key === operatorSelect.value);
        if (selectedUas) {
            const formData = selectedUas.data;
            const comboBoxClaseRpa = document.querySelector('#formCampos\\:codClaseRpa_input');
            if (comboBoxClaseRpa) {
                comboBoxClaseRpa.value = formData.codClaseRpa;
                const event = new Event('change', { bubbles: false });
                comboBoxClaseRpa.dispatchEvent(event);
            }

            setTimeout(() => {
                document.querySelector('#formCampos\\:nomFabricanteRpa').value = formData.nomFabricanteRpa;
                document.querySelector('#formCampos\\:codModeloRpa').value = formData.codModeloRpa;
                document.querySelector('#formCampos\\:desModeloRpa').value = formData.desModeloRpa;
                document.querySelector('#formCampos\\:numSerieRpa').value = formData.numSerieRpa;
                document.querySelector('#formCampos\\:matriculaRpa').value = formData.matriculaRpa;
                const inputMtomRpa = document.querySelector('#formCampos\\:mtomRpa_input');
                if (inputMtomRpa) {
                    inputMtomRpa.value = formData.mtomRpa;
                    const event = new Event('change', { bubbles: false });
                    inputMtomRpa.dispatchEvent(event);
                }
                const inputAutonomiaRpa = document.querySelector('#formCampos\\:autonomiaRpa_input');
                if (inputAutonomiaRpa) {
                    inputAutonomiaRpa.value = formData.autonomiaRpa;
                    const event = new Event('change', { bubbles: false });
                    inputAutonomiaRpa.dispatchEvent(event);
                }
                document.querySelector('#formCampos\\:autopilotoRpa').value = formData.autopilotoRpa;
                document.querySelector('#formCampos\\:bandaRpa').value = formData.bandaRpa;
                document.querySelector('#formCampos\\:colorRpa').value = formData.colorRpa;
                document.querySelector('#formCampos\\:lucesRpa').value = formData.lucesRpa;
                document.querySelector('#formCampos\\:cargaRpa').value = formData.cargaRpa;
                document.querySelector('#formCampos\\:vhfRpa').value = formData.vhfRpa;
                document.querySelector('#formCampos\\:eqEmergenciaRpa').value = formData.eqEmergenciaRpa;
                document.querySelector('#formCampos\\:visionRpa').value = formData.visionRpa;
                document.querySelector('#formCampos\\:modoSRpa').value = formData.modoSRpa;
            }
            , 1000); // Adjust the delay as needed
        } else {
            alert('No hay UAS seleccionado o no se ha encontrado la información del UAS!');
        }
    }

    function fillObserversForm() {
        const observers = JSON.parse(getCookie(idText.innerText) || '[]');
        const selectedObserver = observers.find(op => op.key === operatorSelect.value);

        if (selectedObserver) {
            const formData = selectedObserver.data;
            const comboBoxTipoDocObservadores = document.querySelector('#formCampos\\:tipoDocOBSERVADORES_input');
            if (comboBoxTipoDocObservadores) {
                comboBoxTipoDocObservadores.value = formData.tipoDocObservadores;
                const event = new Event('change', { bubbles: false });
                comboBoxTipoDocObservadores.dispatchEvent(event);
            }

            setTimeout(() => {
                const comboBoxViaObservadores = document.querySelector('#formCampos\\:tipoViaOBSERVADORES_input');
                if (comboBoxViaObservadores) {
                    comboBoxViaObservadores.value = formData.tipoViaOBSERVADORES;
                    const event = new Event('change', { bubbles: false });
                    comboBoxViaObservadores.dispatchEvent(event);
                }

                setTimeout(() => {
                    const comboBoxProvinciaObservadores = document.querySelector('#formCampos\\:provinciaOBSERVADORES_input');

                    if (comboBoxProvinciaObservadores) {

                        comboBoxProvinciaObservadores.value = formData.provinciaOBSERVADORES;
                        const event = new Event('change', { bubbles: false });
                        comboBoxProvinciaObservadores.dispatchEvent(event);

                        setTimeout(() => {
                            const comboBoxLocalidadObservadores = document.querySelector('#formCampos\\:localidadOBSERVADORES_input');
                            if (comboBoxLocalidadObservadores) {

                                comboBoxLocalidadObservadores.value = formData.localidadOBSERVADORES;
                                const event = new Event('change', { bubbles: false });
                                comboBoxLocalidadObservadores.dispatchEvent(event);

                                setTimeout(() => {

                                    document.querySelector('#formCampos\\:nombreRazonOBSERVADORES').value = formData.nombreRazonOBSERVADORES;
                                    document.querySelector('#formCampos\\:apellido1OBSERVADORES').value = formData.apellido1OBSERVADORES;
                                    document.querySelector('#formCampos\\:apellido2OBSERVADORES').value = formData.apellido2OBSERVADORES;
                                    document.querySelector('#formCampos\\:documentoOBSERVADORES').value = formData.documentoOBSERVADORES;
                                    document.querySelector('#formCampos\\:viaOBSERVADORES').value = formData.viaOBSERVADORES;
                                    document.querySelector('#formCampos\\:numeroOBSERVADORES').value = formData.numeroOBSERVADORES;
                                    document.querySelector('#formCampos\\:portalOBSERVADORES').value = formData.portalOBSERVADORES;
                                    document.querySelector('#formCampos\\:pisoOBSERVADORES').value = formData.pisoOBSERVADORES;
                                    document.querySelector('#formCampos\\:letraOBSERVADORES').value = formData.letraOBSERVADORES;
                                    document.querySelector('#formCampos\\:codPostalOBSERVADORES').value = formData.codPostalOBSERVADORES;
                                    document.querySelector('#formCampos\\:telefono1OBSERVADORES').value = formData.telefono1OBSERVADORES;
                                    document.querySelector('#formCampos\\:telefono2OBSERVADORES').value = formData.telefono2OBSERVADORES;
                                    document.querySelector('#formCampos\\:emailOBSERVADORES').value = formData.emailOBSERVADORES;
                                }, 1000); // Adjust the delay as needed
                            }
                        }, 1000); // Adjust the delay as needed
                    }
                }, 1000); // Adjust the delay as needed
            }, 1000); // Adjust the delay as needed
        } else {
            alert('No hay observador seleccionado o no se ha encontrado la información del observador!');
        }
    }

    function fillOperationForm() {
        const operations = JSON.parse(getCookie(idText.innerText) || '[]');
        const selectedOperation = operations.find(op => op.key === operatorSelect.value);
        if (selectedOperation) {
            const formData = selectedOperation.data;
            document.querySelector('#formCampos\\:tipo').value = formData.tipo;
            document.querySelector('#formCampos\\:fecha_input').value = formData.fecha;
            document.querySelector('#formCampos\\:horaInicio_input').value = formData.horaInicio;
            document.querySelector('#formCampos\\:minutosInicio_input').value = formData.minutosInicio;
            document.querySelector('#formCampos\\:horaFin_input').value = formData.horaFin;
            document.querySelector('#formCampos\\:minutosFin_input').value = formData.minutosFin;
            document.querySelector('#formCampos\\:lugarProteccion').value = formData.lugarProteccion;
            document.querySelector('#formCampos\\:lugarRecuperacionRem').value = formData.lugarRecuperacionRem;
            const inputAlturaRem = document.querySelector('#formCampos\\:alturaRem_input');
            if (inputAlturaRem) {
                inputAlturaRem.value = formData.alturaRem;
                const event = new Event('change', { bubbles: false });
                inputAlturaRem.dispatchEvent(event);
            }
            const inputZonaVuelo = document.querySelector('#formCampos\\:zona\\:mapa_value');
            if (inputZonaVuelo) {
                inputZonaVuelo.value = formData.ZonaVuelo;
                const event = new Event('change', { bubbles: false });
                inputZonaVuelo.dispatchEvent(event);
            }
            const ccAas = formData.ccAas;
            if (ccAas) {
                ccAas.forEach(ccAa => {
                    const inputCcAa = document.querySelector(`#formCampos\\:ccAas input[value="${ccAa}"]`);
                    if (inputCcAa) {
                        inputCcAa.click();
                    }
                });
            }
        } else {
            alert('No hay operación seleccionada o no se ha encontrado la información de la operación!');
        }
    }


    function saveOperatorForm() {
        const key = `${document.querySelector('#formCampos\\:nombreRazonOPERADOR').value} ${document.querySelector('#formCampos\\:apellido1OPERADOR').value} ${document.querySelector('#formCampos\\:apellido2OPERADOR').value}`;
        const formData = {
            viaOPERADOR: document.querySelector('#formCampos\\:viaOPERADOR').value,
            tipoViaOPERADOR: document.querySelector('#formCampos\\:tipoViaOPERADOR_input').value,
            paisOPERADOR: document.querySelector('#formCampos\\:paisOPERADOR_input').value,
            provinciaOPERADOR: document.querySelector('#formCampos\\:provinciaOPERADOR_input').value,
            localidadOPERADOR: document.querySelector('#formCampos\\:localidadOPERADOR_input').value,
            numeroOPERADOR: document.querySelector('#formCampos\\:numeroOPERADOR').value,
            portalOPERADOR: document.querySelector('#formCampos\\:portalOPERADOR').value,
            pisoOPERADOR: document.querySelector('#formCampos\\:pisoOPERADOR').value,
            letraOPERADOR: document.querySelector('#formCampos\\:letraOPERADOR').value,
            codPostalOPERADOR: document.querySelector('#formCampos\\:codPostalOPERADOR').value,
            telefono1OPERADOR: document.querySelector('#formCampos\\:telefono1OPERADOR').value,
            telefono2OPERADOR: document.querySelector('#formCampos\\:telefono2OPERADOR').value,
            emailOPERADOR: document.querySelector('#formCampos\\:emailOPERADOR').value,
            codigoOp: document.querySelector('#formCampos\\:codigoOp').value
        };

        let operators = JSON.parse(getCookie(idText.innerText) || '[]');
        const existingOperatorIndex = operators.findIndex(op => op.key === key);
        if (existingOperatorIndex !== -1) {
            const confirmOverride = confirm('Ya existen datos de este operador, quieres sobreescribirlos?');
            if (!confirmOverride)
                return;
            operators[existingOperatorIndex].data = formData;
        } else {
            operators.push({ key, data: formData });
        }

        setCookie(idText.innerText, JSON.stringify(operators));
        updateSelect();
    }

    function savePilotForm() {
        if (!document.querySelector('#formCampos\\:nombreRazonPILOTO').value) {
            alert('El campo "Nombre" es obligatorio');
            return;
        }
        if (!document.querySelector('#formCampos\\:apellido1PILOTO').value) {
            alert('El campo "Primer apellido" es obligatorio');
            return;
        }
        const key = `${document.querySelector('#formCampos\\:nombreRazonPILOTO').value} ${document.querySelector('#formCampos\\:apellido1PILOTO').value} ${document.querySelector('#formCampos\\:apellido2PILOTO').value}`;
        const formData = {
            nombreRazonPILOTO: document.querySelector('#formCampos\\:nombreRazonPILOTO').value,
            apellido1PILOTO: document.querySelector('#formCampos\\:apellido1PILOTO').value,
            apellido2PILOTO: document.querySelector('#formCampos\\:apellido2PILOTO').value,
            tipoDocPiloto: document.querySelector('#formCampos\\:tipoDocPILOTO_input').value,
            documentoPILOTO: document.querySelector('#formCampos\\:documentoPILOTO').value,
            viaPILOTO: document.querySelector('#formCampos\\:viaPILOTO').value,
            tipoViaPILOTO: document.querySelector('#formCampos\\:tipoViaPILOTO_input').value,
            paisPILOTO: document.querySelector('#formCampos\\:paisPILOTO_input').value,
            provinciaPILOTO: document.querySelector('#formCampos\\:provinciaPILOTO_input').value,
            localidadPILOTO: document.querySelector('#formCampos\\:localidadPILOTO_input').value,
            numeroPILOTO: document.querySelector('#formCampos\\:numeroPILOTO').value,
            portalPILOTO: document.querySelector('#formCampos\\:portalPILOTO').value,
            pisoPILOTO: document.querySelector('#formCampos\\:pisoPILOTO').value,
            letraPILOTO: document.querySelector('#formCampos\\:letraPILOTO').value,
            codPostalPILOTO: document.querySelector('#formCampos\\:codPostalPILOTO').value,

            telefono1PILOTO: document.querySelector('#formCampos\\:telefono1PILOTO').value,
            telefono2PILOTO: document.querySelector('#formCampos\\:telefono2PILOTO').value,
            emailPILOTO: document.querySelector('#formCampos\\:emailPILOTO').value,
            desCertCompetPil: document.querySelector('#formCampos\\:desCertCompetPil').value,
            desCertFormacionPil: document.querySelector('#formCampos\\:desCertFormacionPil').value,
            desCertSeguroPil: document.querySelector('#formCampos\\:desCertSeguroPil').value,
            fechaVigCertSeguroPil: document.querySelector('#formCampos\\:fechaVigCertSeguroPil_input').value,
            entidadCertSeguroPil: document.querySelector('#formCampos\\:entidadCertSeguroPil').value
        };

        let pilots = JSON.parse(getCookie(idText.innerText) || '[]');
        const existingPilotIndex = pilots.findIndex(op => op.key === key);
        if (existingPilotIndex !== -1) {
            const confirmOverride = confirm('Ya existen datos de este piloto, queres sobreescribirlos?');
            if (!confirmOverride)
                return;
            pilots[existingPilotIndex].data = formData;
        } else {
            pilots.push({ key, data: formData });
        }

        setCookie(idText.innerText, JSON.stringify(pilots));
        updateSelect();
    }

    function saveUasForm() {
        if (!document.querySelector('#formCampos\\:desModeloRpa').value) {
            alert('El campo "Modelo" es obligatorio');
            return;
        }
        const key = `${document.querySelector('#formCampos\\:nomFabricanteRpa').value} ${document.querySelector('#formCampos\\:desModeloRpa').value}`;
        const formData = {
            codClaseRpa: document.querySelector('#formCampos\\:codClaseRpa_input').value,
            nomFabricanteRpa: document.querySelector('#formCampos\\:nomFabricanteRpa').value,
            codModeloRpa: document.querySelector('#formCampos\\:codModeloRpa').value,
            desModeloRpa: document.querySelector('#formCampos\\:desModeloRpa').value,
            numSerieRpa: document.querySelector('#formCampos\\:numSerieRpa').value,
            matriculaRpa: document.querySelector('#formCampos\\:matriculaRpa').value,
            mtomRpa: document.querySelector('#formCampos\\:mtomRpa_input').value,
            autonomiaRpa: document.querySelector('#formCampos\\:autonomiaRpa_input').value,
            autopilotoRpa: document.querySelector('#formCampos\\:autopilotoRpa').value,
            bandaRpa: document.querySelector('#formCampos\\:bandaRpa').value,
            colorRpa: document.querySelector('#formCampos\\:colorRpa').value,
            lucesRpa: document.querySelector('#formCampos\\:lucesRpa').value,
            cargaRpa: document.querySelector('#formCampos\\:cargaRpa').value,
            vhfRpa: document.querySelector('#formCampos\\:vhfRpa').value,
            modoSRpa: document.querySelector('#formCampos\\:modoSRpa').value,
            eqEmergenciaRpa: document.querySelector('#formCampos\\:eqEmergenciaRpa').value,
            visionRpa: document.querySelector('#formCampos\\:visionRpa').value
        };

        let uas = JSON.parse(getCookie(idText.innerText) || '[]');
        const existingUasIndex = uas.findIndex(op => op.key === key);

        if (existingUasIndex !== -1) {
            const confirmOverride = confirm('Ya existen datos de esta UAS, queres sobreescribirlos?');
            if (!confirmOverride)
                return;
            uas[existingUasIndex].data = formData;
        }
        else {
            uas.push({ key, data: formData });
        }

        setCookie(idText.innerText, JSON.stringify(uas));
        updateSelect();
    }

    function saveObserversForm() {
        if (!document.querySelector('#formCampos\\:nombreRazonOBSERVADORES').value) {
            alert('El campo "Nombre" es obligatorio');
            return;
        }
        if (!document.querySelector('#formCampos\\:apellido1OBSERVADORES').value) {
            alert('El campo "Primer apellido" es obligatorio');
            return;
        }
        const key = `${document.querySelector('#formCampos\\:nombreRazonOBSERVADORES').value} ${document.querySelector('#formCampos\\:apellido1OBSERVADORES').value} ${document.querySelector('#formCampos\\:apellido2OBSERVADORES').value}`;
        const formData = {
            nombreRazonOBSERVADORES: document.querySelector('#formCampos\\:nombreRazonOBSERVADORES').value,
            apellido1OBSERVADORES: document.querySelector('#formCampos\\:apellido1OBSERVADORES').value,
            apellido2OBSERVADORES: document.querySelector('#formCampos\\:apellido2OBSERVADORES').value,
            tipoDocObservadores: document.querySelector('#formCampos\\:tipoDocOBSERVADORES_input').value,
            documentoOBSERVADORES: document.querySelector('#formCampos\\:documentoOBSERVADORES').value,
            viaOBSERVADORES: document.querySelector('#formCampos\\:viaOBSERVADORES').value,
            tipoViaOBSERVADORES: document.querySelector('#formCampos\\:tipoViaOBSERVADORES_input').value,
            paisOBSERVADORES: document.querySelector('#formCampos\\:paisOBSERVADORES_input').value,
            provinciaOBSERVADORES: document.querySelector('#formCampos\\:provinciaOBSERVADORES_input').value,
            localidadOBSERVADORES: document.querySelector('#formCampos\\:localidadOBSERVADORES_input').value,

            numeroOBSERVADORES: document.querySelector('#formCampos\\:numeroOBSERVADORES').value,
            portalOBSERVADORES: document.querySelector('#formCampos\\:portalOBSERVADORES').value,
            pisoOBSERVADORES: document.querySelector('#formCampos\\:pisoOBSERVADORES').value,
            letraOBSERVADORES: document.querySelector('#formCampos\\:letraOBSERVADORES').value,
            codPostalOBSERVADORES: document.querySelector('#formCampos\\:codPostalOBSERVADORES').value,
            telefono1OBSERVADORES: document.querySelector('#formCampos\\:telefono1OBSERVADORES').value,
            telefono2OBSERVADORES: document.querySelector('#formCampos\\:telefono2OBSERVADORES').value,
            emailOBSERVADORES: document.querySelector('#formCampos\\:emailOBSERVADORES').value
        };

        let observers = JSON.parse(getCookie(idText.innerText) || '[]');
        const existingObserverIndex = observers.findIndex(op => op.key === key);

        if (existingObserverIndex !== -1) {
            const confirmOverride = confirm('Ya existen datos de este observador, queres sobreescribirlos?');
            if (!confirmOverride)
                return;
            observers[existingObserverIndex].data = formData;
        }
        else {
            observers.push({ key, data: formData });
        }

        setCookie(idText.innerText, JSON.stringify(observers));
        updateSelect();
    }

    function saveOperationForm() {
        const key = document.querySelector('#formCampos\\:tipo').value;
        const formData = {
            tipo: document.querySelector('#formCampos\\:tipo').value,
            fecha: document.querySelector('#formCampos\\:fecha_input').value,
            horaInicio: document.querySelector('#formCampos\\:horaInicio_input').value,
            minutosInicio: document.querySelector('#formCampos\\:minutosInicio_input').value,
            horaFin: document.querySelector('#formCampos\\:horaFin_input').value,
            minutosFin: document.querySelector('#formCampos\\:minutosFin_input').value,
            lugarProteccion: document.querySelector('#formCampos\\:lugarProteccion').value,
            lugarRecuperacionRem: document.querySelector('#formCampos\\:lugarRecuperacionRem').value,
            alturaRem: document.querySelector('#formCampos\\:alturaRem_input').value,
            ccAas: Array.from(document.querySelectorAll('#formCampos\\:ccAas .ui-state-highlight')).map(item => item.innerText),
            ZonaVuelo: document.querySelector('#formCampos\\:zona\\:mapa_value').value
        };

        let operations = JSON.parse(getCookie(idText.innerText) || '[]');
        const existingOperationIndex = operations.findIndex(op => op.key === key);

        if (existingOperationIndex !== -1) {
            const confirmOverride = confirm('Ya existen datos de esta operación, queres sobreescribirlos?');
            if (!confirmOverride)
                return;
            operations[existingOperationIndex].data = formData;
        } else {
            operations.push({ key, data: formData });
        }

        setCookie(idText.innerText, JSON.stringify(operations));
        updateSelect();
    }

    function updateIdText() {
        const dictionary = {
            "formCampos:campos": "Operador",
            "formCampos:camposPiloto": "Piloto",
            "formCampos:camposRpa": "Uas",
            "formCampos:camposObservadores": "Observadores",
            "formCampos:camposRem": "Operacion"
        };
        const wizardContent = document.querySelector('#formCampos\\:idWizard_content');
        if (wizardContent) {
            const firstDiv = wizardContent.querySelector('div');
            if (firstDiv) {
                idText.innerText = dictionary[firstDiv.id] || '';
            } else {
                idText.innerText = 'No div found inside formCampos:idWizard_content';
            }
        } else {
            idText.innerText = 'formCampos:idWizard_content not found';
        }
        updateSelect();
    }

    function initialize() {
        const wizardContent = document.querySelector('#formCampos\\:idWizard_content');
        if (wizardContent) {
            const wizardContentObserver = new MutationObserver(updateIdText);
            wizardContentObserver.observe(wizardContent, { childList: true, subtree: true });
        }
        updateIdText();
    }
})();
