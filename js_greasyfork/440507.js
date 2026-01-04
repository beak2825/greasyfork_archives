// ==UserScript==
// @name         Arrendamiento
// @namespace    https://greasyfork.org/es/users/473907/
// @version      1.3.1
// @description  Sisterra
// @author       RoLinGt
// @include      https://sisterra.fontierras.gob.gt/*
// @include      https://oficinavirtual.energuate.com/mifactura?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440507/Arrendamiento.user.js
// @updateURL https://update.greasyfork.org/scripts/440507/Arrendamiento.meta.js
// ==/UserScript==
if ($(location).attr('href').slice(8, 34) == 'sisterra.fontierras.gob.gt') {
    var hoy = $.datepicker.formatDate('dd/mm/yy', new Date())
    var vColor = {
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(230, 86, 86, 0.6)',
        'border-color': '#E13333'
    }
    var vClear = {
        'box-shadow': '',
        'border-color': ''
    }
    /////////////////////////////////////////////////
    if ($(location).attr('href').slice(49) == 'Rpt_Control_Actividades_Digitador.php') {
        window.addEventListener('keydown', function(event) {
            if (event.keyCode == 107) {
                if ($('#fecha').val() == '' && $('#fecha1').val() == '') {
                    $('#fecha').val(hoy)
                    $('#fecha1').val(hoy)
                    $('#id_region').val(108)
                    $('#ui-datepicker-div').css('display', 'none')
                    $('#BtnGenerarReporte').click()
                }
            }
        }, false);
    }
    if ($(location).attr('href').slice(49) == 'Demanda.php') {
        $('.ui-button-text:eq(4)').click(function() {
            if ($('.ui-widget-overlay').length == 1) {
                if ($('.ui-button-text:eq(4)').text() == 'Ok') {
                    if ($('#lbmensaje').text().indexOf('Se ingres') == 0) {
                        localStorage.setItem('idDemanda', $('#lbmensaje').text().slice(50))
                    }
                }
            }
        });
        $('#iddemandaB').blur(function() {
            if ($('#iddemandaB').val() > 0 && $('#ejercicioB').val() == '') {
                $('#ejercicioB').val(2022)
            }
        });
        $('#BtnNuevaDemanda').click(function() {
            $('#fecha').val(hoy)
            $('#ui-datepicker-div').css('display', 'none')
            $('#tipodemanda').val(10)
            $('#lugarrecepcion').val(108)
            ObtieneSedes();
            $('#sede').val(1)
            $('#departamento').focus()
        });
    }
    if ($(location).attr('href').slice(49) == 'Fincas.php') {
        $('#nomfincaB').val(localStorage.getItem('nomfincaB'))
        $('#pnombreB').val(localStorage.getItem('pnombreB'))
        $('#papellidoB').val(localStorage.getItem('papellidoB'))
        $('#sapellidoB').val(localStorage.getItem('sapellidoB'))
        $('#BtnBuscar').focus();
        $('#nomfincaB').blur(function() {
            localStorage.setItem('nomfincaB', $('#nomfincaB').val())
        });
        $('#pnombreB').blur(function() {
            localStorage.setItem('pnombreB', $('#pnombreB').val())
        });
        $('#papellidoB').blur(function() {
            localStorage.setItem('papellidoB', $('#papellidoB').val())
        });
        $('#sapellidoB').blur(function() {
            localStorage.setItem('sapellidoB', $('#sapellidoB').val())
        });
        $('#BtnNuevo').click(function() {
            $('#registro').val(0)
            $('#folio').val(0)
            $('#libro').val(0)
            $('#nomfinca').val('RUSTICA')
            $('#aldea').focus()
        });
    }
    if ($(location).attr('href').slice(49) == 'arr_listado.php') {
        if ($('#LoteLista option').length == 2) {
            $('#LoteLista option:eq(1)').prop('selected', true)
            $('#SinListado').click()
        }
    };
    if ($(location).attr('href').slice(49) == 'Rpt_libro_conocimiento.php') {
        $('#Ejercicio').val(2022)
        $('#fecha').val(hoy)
        $('#fecha1').val(hoy)
    }
    if ($(location).attr('href').slice(49) == 'Conocimiento.php') {
        $('#xconocimiento').click(function() {
            localStorage.setItem('xdemanda', false)
        });
        $('#xdemanda').click(function() {
            localStorage.setItem('xdemanda', true)
        });
        if (localStorage.getItem('xdemanda') == 'true') {
            $('#xdemanda').click()
        }
        $('#ejercicioB').val(2022)
        $('#iddemandaB').focus()
        $('#fechacono').blur(function() {
            if ($('#lbmsg').text() == 'No tiene Número de Conocimiento Asignado.') {
                $('#refentrega').val(7)
            }
        });
    };
    if ($(location).attr('href').slice(49) == 'arr_lote_asignar.php') {
        window.addEventListener("keydown", function(event) {
            if (event.keyCode == 107) {
                if ($('#NoFormulario').val() > 900000) {
                    $('#NoFormulario').val().replace('+', '')
                    $('#NoFormulario').val(+$('#NoFormulario').val() + 1).blur()
                }
            }
            if (event.keyCode == 109) {
                if ($('#NoFormulario').val() > 900000) {
                    $('#NoFormulario').val().replace('-', '')
                    $('#NoFormulario').val(+$('#NoFormulario').val() - 1).blur()
                }
            }
        }, false);
    };
    if ($(location).attr('href').slice(49) == 'ControlFormulario.php') {
        window.addEventListener('keydown', function(event) {
            if (event.keyCode == 107) {
                if ($('#noformularioB').val() > 900000) {
                    $('#noformularioB').val(+$('#noformularioB').val() + 1)
                    $('#BtnBuscarFormulario').click()
                }
            }
            if (event.keyCode == 109) {
                if ($('#noformularioB').val() > 900000) {
                    $('#noformularioB').val(+$('#noformularioB').val() - 1)
                    $('#BtnBuscarFormulario').click()
                }
            }
        }, false);
        $('#noformularioB').blur(function() {
            if ($('#noformularioB').val() == '000') {
                $('#noformularioB').val('')
                var forArrend = prompt("SISTERRA", "").split("\n")
                if (forArrend.length > 1) {
                    var i = 0
                    var t = setInterval(function() {
                        if (i <= forArrend.length) {
                            if ($('#BtnBuscarFormulario').prop('disabled') == false) {
                                if ($('#noformularioB').val().length == 0 && $('.ui-widget-overlay').length == 0) {
                                    $('#noformularioB').val(forArrend[i++])
                                    document.title = "Control de Formulario " + (forArrend.length - i)
                                    $('#BtnBuscarFormulario').click()
                                }
                            }
                            if ($('.ui-widget-overlay').length == 1) {
                                if ($('.ui-button-text:eq(1)').text() == 'Ok') {
                                    $('.ui-button-text:eq(1)').click()
                                    $('#noformularioB').val('')
                                }
                            }
                            if ($('#divmensaje').text().length > 8 && $('#ejercicio').val() == 2022) {
                                if ($('#divmensaje').text() == 'EN DICTAMEN') {
                                    BtnGuardarFormulario.click()
                                } else {
                                    BtnCancelarFormulario.click()
                                }
                            }
                        }
                    }, 250)
                }
            }
        });
        $('#motivo').blur(function() {
            if ($('#motivo').val() == '000') {
                $('#motivo').val('')
                $('#BtnAgregar').removeAttr('disabled')
                $('#BtnGuardarFormulario').removeAttr('disabled').focus()
            }
        });
    }
    if ($(location).attr('href').slice(49) == 'formularioDigitacion.php') {
        $('#idFormulario').blur(function() {
            if ($('#idFormulario').val() == '000') {
                $('#idFormulario').val('')
                var forArrend = prompt("SISTERRA", "").split("\n")
                if (forArrend.length > 1) {
                    var i = 0
                    var t = setInterval(function() {
                        if (i <= forArrend.length) {
                            if ($('#idFormulario').val().length == 0 && $('.ui-widget-overlay').length == 0) {
                                $('#idFormulario').val(forArrend[i++])
                                document.title = (forArrend.length - i) + ' Digitación Formulario'
                                DatosFormulario()
                            }
                            if ($('.ui-widget-overlay').length == 1) {
                                if ($('.ui-button-text:eq(3)').text() == 'Ok') {
                                    $('.ui-button-text:eq(3)').click()
                                    $('#idFormulario').val('')
                                }
                            }
                            if ($('#lbmsg2').text().length > 8 && $('#ejercicio').val() == 2022) {
                                if ($('#lbmsg2').text() == 'Estado: Dictamen Aprobado') {
                                    $('#lbmsg2').text('')
                                    $('#btnGuardar').click()
                                }
                            }
                        }
                    }, 250)
                }
            }
        });
    }
    if ($(location).attr('href').slice(49) == 'formularioAprobacion.php') {
        $('#idFormulario').blur(function() {
            if ($('#idFormulario').val() == '000') {
                $('#idFormulario').val('')
                var forArrend = prompt("SISTERRA", "").split("\n")
                if (forArrend.length > 1) {
                    var i = 0
                    var t = setInterval(function() {
                        if (i <= forArrend.length) {
                            if ($('#idFormulario').val().length == 0 && $('.ui-widget-overlay').length == 0) {
                                $('#idFormulario').val(forArrend[i++])
                                document.title = (forArrend.length - i) + ' Digitación Formulario'
                                DatosFormulario()
                            }
                            if ($('.ui-widget-overlay').length == 1) {
                                if ($('.ui-button-text:eq(1)').text() == 'Ok') {
                                    $('.ui-button-text:eq(1)').click()
                                    $('#idFormulario').val('')
                                }
                            }
                            if ($('#lbmsg2').text().length > 8 && $('#ejercicio').val() == 2022) {
                                if ($('#lbmsg2').text() == 'Estado: Digitado') {
                                    $('#lbmsg2').text('')
                                    $('#btnAprobar').click()
                                }
                            }
                        }
                    }, 250)
                }
            }
        });
    }
    /////////////////////////////////////////////////
    if ($(location).attr('href').slice(49) == 'solicitudesVaciado.php') {
        $('#idDemanda').val(localStorage.getItem('idDemanda')).select();
        $('#idDemanda').blur(function() {
            if ($('#idDemanda').val() == '000') {
                $('#idDemanda').val('')
                $('#divVaciadoDetalle').find('.seleccionar, .manual, .areaTexto, .button, .button1, table div').removeAttr('disabled');
            }
        });
        $('#formSolicitud').blur(function() {
            if ($('#formSolicitud').val() == "" || $('#formSolicitud').val() >= 15841 && $('#formSolicitud').val() <= 27500) {
                $('#formSolicitud').css(vClear)
            } else {
                $('#formSolicitud').css(vColor)
            }
        });
        $('#ejercicioDem').blur(function() {
            if ($('#ejercicioDem').val() == 2022) {
                localStorage.setItem('idDemanda', $('#idDemanda').val())
            }
        });
        $('#btnPersona').blur(function() {
            if ($('#avalistaes').val() == 0) {
                $('#avalistaes').val(4)
            }
            // if (localStorage.getItem('tituloEdicion').split(",")[1] == 1 || localStorage.getItem('tituloEdicion').split(",")[1] == 4) {
            //     $('#btnAvalista').attr("disabled", true)
            // }
        });
        $('#avalistaes').blur(function() {
            if ($('#avalistaes').val() == 1 || $('#avalistaes').val() == 4) {
                $('#avalistaes').css(vClear);
            } else {
                $('#avalistaes').css(vColor);
            }
        });
        $('#idAgencia').focus(function() {
            if ($('#tabladatos').find('tr').length > 3) {
                if ($('#tabladatos').find('tr:eq(2)').find('td:eq(13)').text() == $('#tabladatos').find('tr:eq(3)').find('td:eq(13)').text()) {
                    $('#idAgencia').val($('#tabladatos').find('tr:eq(2)').find('td:eq(13)').text())
                    $('#idAgencia').css(vClear)
                } else {
                    $('#idAgencia').css(vColor)
                }
            }
        });
        $('#estado').blur(function() {
            if ($('#estado').val() == 202) {
                $('#estado').css(vClear);
            } else {
                $('#estado').css(vColor);
            }
        });
        $('#cantidadExt').blur(function() {
            if ($('#cantidadExt').val().slice(0, 1) == "0") {
                $('#idFinca').val(localStorage.getItem('idFinca'))
                $('#fNombre').val(localStorage.getItem('fNombre'))
                $('#cantidadExt').val($('#cantidadExt').val().slice(1))
            }
        });
        $('#medidaArr').blur(function() {
            if ($('#medidaArr').val() == 0) {
                $('#medidaArr').val(localStorage.getItem('medidaArr'))
            }
        });
        $('#valorArr').blur(function() {
            if ($('#valorArr').val().slice(0, 2) == '00') {
                $('#valorArr').val().slice(-3)
                localStorage.setItem('valorArr', $('#valorArr').val())
                $('#valorArr').val('')
            }
            if ($('#valorArr').val() == '') {
                $('#valorArr').val(localStorage.getItem('valorArr') * $('#cantidadExt').val())
            }
        });
        $('#mesInicio').focus(function() {
            if ($('#mesInicio').val() == 1 && $('#mesFinal').val() == 1) {
                $('#mesFinal').val(12)
                durMeses()
            }
        });
        $('#ui-id-1').click(function() {
            $('#gbSiembra').focus()
        });
        $('#ui-id-2').click(function() {
            $('#hCultivo').focus()
        });
        $('#ui-id-3').click(function() {
            $('#pActividad').focus()
        });
        $('#gbSiembra').focus(function() {
            if ($('#gbSiembra').val() == 18) {
                if ($('#tblAgregaGb').find('td').length > 0) {
                    $('#gbSiembra').val(253)
                }
                $('#gbSiembra').val(252)
            }
        });
        $('#gbTipo').focus(function() {
            if ($('#gbTipo').val() == 0) {
                $('#gbTipo').val(3)
            }
        });
        $('#gbCantidad').blur(function() {
            if ($('#gbCantidad').val() == 0) {
                $('#gbCantidad').val($('#cantidadExt').val())
            }
        });
        $('#gbMedida1').focus(function() {
            $('#gbMedida1').val($('#medidaArr').val())
        });
        $('#gbMedida2').focus(function() {
            if ($('#gbMedida2').val() == 0) {
                $('#gbMedida2').val(20)
            }
        });
        $('#hCultivo').focus(function() {
            if ($('#hCultivo').val() == 106) {
                $('#hCultivo').val(localStorage.getItem('hCultivo'))
            }
        });
        $('#hCultivo').blur(function() {
            localStorage.setItem('hCultivo', $('#hCultivo').val())
        });
        $('#hCantidad').blur(function() {
            $('#hCantidad').val($('#cantidadExt').val())
        });
        $('#hMedida1').focus(function() {
            $('#hMedida1').val($('#medidaArr').val())
        });
        $('#hMedida2').focus(function() {
            if ($('#hMedida2').val() == 0) {
                $('#hMedida2').val(localStorage.getItem('hMedida2'))
            }
        });
        $('#hMedida2').blur(function() {
            localStorage.setItem('hMedida2', $('#hMedida2').val())
        });
        $('#pActividad').focus(function() {
            $('#pActividad').val(localStorage.getItem('pActividad'))
        });
        $('#pActividad').blur(function() {
            localStorage.setItem('pActividad', $('#pActividad').val())
        });
        $('#btnGuardar').click(function() {
            if ($('#idFinca').val().length > 0) {
                localStorage.setItem('medidaArr', $('#medidaArr').val())
                localStorage.setItem('idFinca', $('#idFinca').val())
                localStorage.setItem('fNombre', $('#fNombre').val())
            }
        });
    }
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    if ($(location).attr('href').slice(51, 64) == 'index?idApp=6') {
        if (TRIANGULO == 'false') {
            if (SELECT == 'true') {
                $('#formBusqueda #dpi').focus()
            }
            $('#formDatosPersona #nombre1').blur(function() {
                if ($('#formDatosPersona #nombre1').val().search($('#formBusqueda #nombre1').val()) < 0) {
                    $('#formDatosPersona #nombre1').css(vColor);
                } else {
                    $('#formDatosPersona #nombre1').css(vClear);
                }
                localStorage.getItem('LSnombre1', $('#formDatosPersona #nombre1').val())
            });
            $('#formDatosPersona #nombre2').blur(function() {
                if ($('#formDatosPersona #nombre2').val().search($('#formBusqueda #nombre2').val()) < 0) {
                    $('#formDatosPersona #nombre2').css(vColor);
                } else {
                    $('#formDatosPersona #nombre2').css(vClear)
                }
                localStorage.getItem('LSnombre2', $('#formDatosPersona #nombre2').val())
            });
            $('#nombre3').blur(function() {
                if ($('#nombre3').val() == " ") {
                    $('#nombre3').css(vColor);
                } else {
                    $('#nombre3').css(vClear);
                }
                localStorage.getItem('LSnombre3', $('#nombre3').val())
            });
            $('#formDatosPersona #apellido1').blur(function() {
                if ($('#formDatosPersona #apellido1').val().search($('#formBusqueda #apellido1').val()) < 0) {
                    $('#formDatosPersona #apellido1').css(vColor);
                } else {
                    $('#formDatosPersona #apellido1').css(vClear)
                }
                localStorage.getItem('LSapellido1', $('#formDatosPersona #apellido1').val())
            });
            $('#formDatosPersona #apellido2').blur(function() {
                if ($('#formDatosPersona #apellido2').val().search($('#formBusqueda #apellido2').val()) < 0) {
                    $('#formDatosPersona #apellido2').css(vColor);
                } else {
                    $('#formDatosPersona #apellido2').css(vClear)
                }
                localStorage.getItem('LSapellido2', $('#formDatosPersona #apellido2').val())
            });
            $('#apellidoCasada').blur(function() {
                if ($('#apellidoCasada').val().length > 0) {
                    $('#sexo').val(2)
                    $('#ocupacion').val(87)
                    if ($('#estadoCivil').val() == '') $('#estadoCivil').val(1)
                }
            });
            $('#ordenDpi').blur(function() {
                if ($("#partidaDepto").val() != $("#nacimientoDepto").val()) {
                    $("#partidaDepto").val($("#nacimientoDepto").val())
                    $("#partidaDepto").change()
                }
            });
            $('#municipioId').blur(function() {
                if ($("#partidaMuni").val() != $("#nacimientoMuni").val()) {
                    $("#partidaMuni").val($("#nacimientoMuni").val())
                    $("#partidaMuni").change()
                }
            });
            $('#sexo').blur(function() {
                if ($("#sexo").val() == 1) {
                    if ($('#ocupacion').val() != 1) {
                        $('#ocupacion').val(2);
                    }
                }
                if ($("#sexo").val() == 2) {
                    $('#ocupacion').val(87);
                }
            });
            $('#pueblo').focus(function() {
                if ($("#pueblo").val() == "") {
                    $('#pueblo').val(localStorage.getItem('pueblo'))
                }
            });
            $('#comLing').focus(function() {
                if ($("#comLing").val() == "") {
                    $('#comLing').val(localStorage.getItem('comLing'))
                }
            });
            $('#btnIdiomas').focus(function() {
                for (var i = 1; i <= 25; i++) {
                    if (eval("$('#idioma" + i + "')").prop('checked') == true) {
                        break;
                    }
                    if (i == 25) {
                        $('#idioma1').prop('checked', true)
                        break;
                    }
                }
            });
            $('#escolaridad').blur(function() {
                if ($('#escolaridad').val() == 1) {
                    $('#firma').prop('checked', false)
                    $('#escribe').prop('checked', false)
                    $('#lee').prop('checked', false)
                }
                if ($('#escolaridad').val() > 1 && $('#escolaridad').val() < 6) {
                    $('#firma').prop('checked', true)
                    $('#escribe').prop('checked', true)
                    $('#lee').prop('checked', true)
                }
            });
            $('#nit, #email').blur(function() {
                $('#formDatosPersona').find('#nit, #email').each(function() {
                    if ($(this).val().length == 4 && $(this).val().slice(0, 1) == "0") {
                        switch ($(this).val().slice(3)) {
                            case "1":
                                $("#escolaridad").val(1)
                                break;
                            case "2":
                                $("#escolaridad").val(2)
                                break;
                            case "3":
                                $("#escolaridad").val(3)
                                break;
                            case "4":
                                $("#escolaridad").val(4)
                                break;
                            case "5":
                                $("#escolaridad").val(5)
                                break;
                        }
                        switch ($(this).val().slice(1, 2)) {
                            case "1":
                                ArrendResid()
                                $('#cargasFamH').val(localStorage.getItem('cargasFamH'));
                                $('#cargasFamM').val(localStorage.getItem('cargasFamM'));
                                $(this).val('')
                                break;
                            case "3":
                                ArrendResid()
                                $(this).val('')
                                break;
                        }

                        function ArrendResid() {
                            $('#escolaridad').focus();
                            $('#residencia').val(localStorage.getItem('residencia'));
                            $('#aldea').val(localStorage.getItem('aldea'));
                            if ($('#domicilioDepto').val() != localStorage.getItem('domicilioDepto')) {
                                $('#domicilioDepto').val(localStorage.getItem('domicilioDepto')).change();
                            }
                            if ($('#domicilioMuni').val() != localStorage.getItem('domicilioMuni')) {
                                ArrendInt = setInterval(function() {
                                    if ($('#domicilioMuni option').length > 2) {
                                        $('#domicilioMuni').val(localStorage.getItem('domicilioMuni'));
                                        $('#btnGuardar').focus()
                                        clearTimeout(ArrendInt)
                                    }
                                }, 250)
                            }
                            $('#btnGuardar').focus()
                        }
                    }
                    if ($(this).val() == "0") {
                        $('#residencia').focus()
                    }
                    if ($(this).val().slice(0, 1) == ".") {
                        window.open("https://oficinavirtual.energuate.com/mifactura?" + $(this).val().slice(1), "Energuate", "width=600,height=400,scrollbars=NO")
                        $(this).val('')
                        $('#residencia').val('')
                    }
                });
            });
            $('#telefono').blur(function() {
                if ($('#telefono').val().match(/\d/g).length % 8 == 0) {
                    $('#telefono').css(vClear);
                } else {
                    $('#telefono').css(vColor)
                }
            });
            $('#residencia').blur(function() {
                if ($('#residencia').val() == "0") {
                    $('#residencia').val(localStorage.getItem('residencia'));
                    $('#aldea').val(localStorage.getItem('aldea'));
                    $('#domicilioDepto').val(localStorage.getItem('domicilioDepto')).change();
                    var ArrendInt = setInterval(function() {
                        if ($('#domicilioMuni option').length > 2) {
                            $('#domicilioMuni').val(localStorage.getItem('domicilioMuni')).change();
                            clearTimeout(ArrendInt)
                        }
                    }, 250)
                }
                for (var i = 0; i < 3; i++) {
                    $('#residencia').val($('#residencia').val().replaceAll('..', '.').replaceAll(' .', '.').replaceAll(' ,', '.').replaceAll('  ', ' '))
                }
            });
            $('#aldea').blur(function() {
                if ($('#nit').val() == "0") {
                    $('#nit').val('').focus()
                }
            });
            $('#btnGuardar').click(function() {
                localStorage.setItem('comLing', $('#comLing').val())
                localStorage.setItem('pueblo', $('#pueblo').val())
                localStorage.setItem('cargasFamH', $('#cargasFamH').val())
                localStorage.setItem('cargasFamM', $('#cargasFamM').val())
                localStorage.setItem('residencia', $('#residencia').val())
                localStorage.setItem('aldea', $('#aldea').val())
                localStorage.setItem('domicilioDepto', $('#domicilioDepto').val())
                localStorage.setItem('domicilioMuni', $('#domicilioMuni').val())
            });
            $('#btnCancelar').click(function() {
                $('#formBusqueda')[0].reset()
                $('#formBusqueda #nombre1').focus()
            });
        }
        /////////////////////////////////////////////
        /////////////////////////////////////////////
        /////////////////////////////////////////////
        /////////////////////////////////////////////
        /////////////////////////////////////////////
        /////////////////////////////////////////////
    };
}
if ($(location).attr('href').slice(37, 47) == 'mifactura?') {
    $('#nisRad').val($(location).attr('href').slice(47))
    $('#btnNisRad').click()
    $('#dashnoardMain').remove()
    $('.navbar').remove()
    $('#primaryTab').remove()
    $('#background_modal').remove()
    $('#content_modal').remove()
    $('.invoiceControls').remove()
    $(document.body).css('padding-top', '0px');
    var ArrendInt = setInterval(function() {
        if ($('.back-modal').css('display') == 'none') {
            if ($('#nisRad').val() != $('.address span:eq(0)').text()) {
                $('#nisRad').val($('.address span:eq(0)').text())
            }
        }
    }, 250)
    $('#nisRad').focus(function() {
        if ($('#nisRad').val() == $('.address span:eq(0)').text()) {
            $('#nisRad').select();
            document.execCommand('copy')
            window.close(location, '_self')
        }
    });
};