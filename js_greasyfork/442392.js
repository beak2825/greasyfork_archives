// ==UserScript==
// @version      2.0.3
// ==/UserScript==
if ($(location).attr('href').slice(8, 34) == 'sisterra.fontierras.gob.gt') {
    const hoy = $.datepicker.formatDate('dd/mm/yy', new Date())
    const vColor = {
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(230, 86, 86, 0.6)',
        'border-color': '#E13333'
    }
    const vClear = {
        'box-shadow': '',
        'border-color': ''
    }
    if ($(location).attr('href').slice(49) == 'Rpt_Control_Actividades_Digitador.php') {
        console.log('03.30.22.52')
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
                    const ArrendInt = setInterval(function() {
                        if ($('#Grabar').prop('disabled') == false && $('#LoteLista option').length == 2) {
                            $('#LoteLista option:eq(1)').prop('selected', true).change()
                            $('#Grabar').focus()
                            clearTimeout(ArrendInt)
                        }
                    }, 250)
                }
            }
            if (event.keyCode == 109) {
                if ($('#NoFormulario').val() > 900000) {
                    $('#NoFormulario').val().replace('-', '')
                    $('#NoFormulario').val(+$('#NoFormulario').val() - 1).blur()
                    const ArrendInt = setInterval(function() {
                        if ($('#Grabar').prop('disabled') == false && $('#LoteLista option').length == 2) {
                            $('#LoteLista option:eq(1)').prop('selected', true).change()
                            $('#Grabar').focus()
                            clearTimeout(ArrendInt)
                        }
                    }, 250)
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
                $('#motivo').val('').focus()
                $('#BtnAgregar').removeAttr('disabled')
                $('#BtnGuardarFormulario').removeAttr('disabled')
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
    if ($(location).attr('href').slice(49) == 'solicitudesVaciado.php') {
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
                if ($('#tabladatos tr').length > 3) {
                    if ($('#tabladatos tr:eq(2) td:eq(13)').text() == $('#tabladatos tr:eq(3) td:eq(13)').text()) {
                        $('#idAgencia').val($('#tabladatos tr:eq(2) td:eq(13)').text())
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
                    durMeses();
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
                    if ($('#tblAgregaGb tr').length > 1) {
                        $('#gbSiembra').val(253)
                    } else {
                        $('#gbSiembra').val(252)
                    }
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
                    $('#hCultivo').val(localStorage.getItem('hCultivo'));
                }
            });
            $('#hCultivo').blur(function() {
                localStorage.setItem('hCultivo', $('#hCultivo').val());
            });
            $('#hCantidad').blur(function() {
                if ($('#hCantidad').val() == 0) {
                    $('#hCantidad').val($('#cantidadExt').val());
                }
            });
            $('#hMedida1').focus(function() {
                $('#hMedida1').val($('#medidaArr').val());
            });
            $('#hMedida2').focus(function() {
                if ($('#hMedida2').val() == 0) {
                    $('#hMedida2').val(localStorage.getItem('hMedida2'))
                }
            });
            $('#hMedida2').blur(function() {
                if ($('#hMedida2').val() > 0) {
                    localStorage.setItem('hMedida2', $('#hMedida2').val())
                }
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
    }
    if ($(location).attr('href').slice(51, 64) == 'index?idApp=6') {
        busquedas = 1
        if (TRIANGULO == 'false') {
            if (SELECT == 'true') {
                $('#formBusqueda #dpi').focus()
                window.addEventListener("keydown", function(event) {
                    if (event.keyCode == 107) {
                        if ($('#resultadoPersonas tr').length == 2) {
                            localStorage.setItem('vColor', 0)
                            if (parent.boton == 1) {
                                if ($('#cargasFamH').val() == 0 && $('#cargasFamM').val() == 0) {
                                    if ($('#estadoCivil').val() == 3 || $('#estadoCivil').val() == 4) {
                                        $('#cargasFamH').css(vColor)
                                        $('#cargasFamM').css(vColor)
                                    }
                                } else {
                                    $('#cargasFamH').css(vClear)
                                    $('#cargasFamM').css(vClear)
                                }
                                if ($('#sexo').val() == 1) {
                                    if ($('#estadoCivil').val() == 3) {
                                        $('#sexo').css(vColor)
                                        $('#estadoCivil').css(vColor)
                                    } else {
                                        $('#sexo').css(vClear)
                                        $('#estadoCivil').css(vClear)
                                    }
                                }
                                localStorage.setItem('idPersona_apellidoCasada', $('#apellidoCasada').val())
                                localStorage.setItem('idPersona_apellidoCasada', $('#apellidoCasada').val())
                                localStorage.setItem('idPersona_sexo', $('#sexo').val())
                                localStorage.setItem('idPersona_estadoCivil', $('#estadoCivil').val())
                            }
                            if (parent.boton == 2) {
                                if ($('#sexo').val() == localStorage.getItem('idPersona_sexo')) {
                                    $('#sexo').css(vColor)
                                } else {
                                    $('#sexo').css(vClear)
                                }
                                if ($('#estadoCivil').val() == localStorage.getItem('idPersona_estadoCivil')) {
                                    $('#estadoCivil').css(vClear)
                                } else {
                                    $('#estadoCivil').css(vColor)
                                }
                                if ($('#idPersona', parent.document).text() == $('#tituloEdicion').text().slice(4)) {
                                    $('#formDatosPersona #dpi').css(vColor)
                                } else {
                                    $('#formDatosPersona #dpi').css(vClear)
                                }
                            }
                            $('#formDatosPersona .form-control').each(function() {
                                if ($(this).css('border-color') == 'rgb(225, 51, 51)') {
                                    localStorage.setItem('vColor', 1)
                                }
                            });
                            if (localStorage.getItem('vColor') == 0) {
                                $('#resultadoPersonas').find('tr')[1].ondblclick()
                                //$('#resultadoPersonas tr:eq(1)').ondblclick()
                            }
                        }
                    }
                }, false);
            }
            $('#formDatosPersona .form-control').each(function() {
                $(this).blur(function() {
                    localStorage.setItem('Temp_' + this.id, $(this).val())
                });
                localStorage.removeItem('SAVE_' + this.id)
                if (localStorage.getItem('Temp_' + this.id).length > 0) {
                    localStorage.setItem('SAVE_' + this.id, localStorage.getItem('Temp_' + this.id))
                }
            });
            $('#formDatosPersona #nombre1').blur(function() {
                if ($('#formDatosPersona #nombre1').val().indexOf($('#formBusqueda #nombre1').val()) < 0) {
                    $('#formDatosPersona #nombre1').css(vColor);
                } else {
                    $('#formDatosPersona #nombre1').css(vClear)
                }
                if ($('#formDatosPersona #nombre1').val() == 'AAA') {
                    $('#formDatosPersona .form-control').each(function() {
                        $(this).val(localStorage.getItem('SAVE_' + this.id))
                        if (this.id == 'departamentoId' || this.id == 'partidaDepto' || this.id == 'domicilioDepto') {
                            this.onchange()
                        }
                    });
                }
            });
            $('#formDatosPersona #nombre2').blur(function() {
                if ($('#formDatosPersona #nombre2').val().indexOf($('#formBusqueda #nombre2').val()) < 0) {
                    $('#formDatosPersona #nombre2').css(vColor);
                } else {
                    $('#formDatosPersona #nombre2').css(vClear)
                }
            });
            $('#nombre3').blur(function() {
                if ($('#nombre3').val() == " ") {
                    $('#nombre3').css(vColor);
                } else {
                    $('#nombre3').css(vClear);
                }
            });
            $('#formDatosPersona #apellido1').blur(function() {
                if ($('#formDatosPersona #apellido1').val().indexOf($('#formBusqueda #apellido1').val()) < 0) {
                    $('#formDatosPersona #apellido1').css(vColor);
                } else {
                    $('#formDatosPersona #apellido1').css(vClear)
                }
            });
            $('#formDatosPersona #apellido2').blur(function() {
                if ($('#formDatosPersona #apellido2').val().indexOf($('#formBusqueda #apellido2').val()) < 0) {
                    $('#formDatosPersona #apellido2').css(vColor);
                } else {
                    $('#formDatosPersona #apellido2').css(vClear)
                }
            });
            $('#apellidoCasada').blur(function() {
                if ($('#apellidoCasada').val().length > 0) {
                    $('#sexo').val(2)
                    $('#ocupacion').val(87)
                    if ($('#estadoCivil').val() != 2 || $('#estadoCivil').val() != 5) {
                        $('#estadoCivil').val(1)
                    }
                }
            });
            $('#departamentoId').blur(function() {
                if ($("#partidaDepto").val() != $("#nacimientoDepto").val()) {
                    $("#partidaDepto").val($("#nacimientoDepto").val()).change()
                }
            });
            $('#municipioId').blur(function() {
                if ($("#partidaMuni").val() != $("#nacimientoMuni").val()) {
                    $("#partidaMuni").val($("#nacimientoMuni").val())
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
                if ($('#escolaridad').val() == '0') {
                    $('#escolaridad').css(vColor);
                }
                if ($('#escolaridad').val() == 1) {
                    $('#firma').prop('checked', false);
                    $('#escribe').prop('checked', false);
                    $('#lee').prop('checked', false);
                    $('#escolaridad').css(vClear);
                }
                if ($('#escolaridad').val() > 1 && $('#escolaridad').val() < 6) {
                    $('#firma').prop('checked', true);
                    $('#escribe').prop('checked', true);
                    $('#lee').prop('checked', true);
                    $('#escolaridad').css(vClear);
                }
            });
            $('#nit, #email').blur(function() {
                $('#nit, #email').each(function() {
                    if ($(this).val().length == 3 && $(this).val().slice(0, 1) == "0") {
                        if ($(this).val().slice(1, 2) == 1 || $(this).val().slice(1, 2) == 3) {
                            if ($(this).val().slice(2) > 0 && $(this).val().slice(2) < 6) {
                                $("#escolaridad").val($(this).val().slice(2)).focus()
                                if ($(this).val().slice(1, 2) == 1) {
                                    $('#cargasFamH').val(localStorage.getItem('cargasFamH'));
                                    $('#cargasFamM').val(localStorage.getItem('cargasFamM'));
                                }
                                $('#residencia').val(localStorage.getItem('residencia'));
                                $('#aldea').val(localStorage.getItem('aldea'));
                                if ($('#domicilioDepto').val() != localStorage.getItem('domicilioDepto')) {
                                    $('#domicilioDepto').val(localStorage.getItem('domicilioDepto')).change();
                                }
                                setInter_Muni()
                                $('#btnGuardar').focus()
                                $(this).val('')
                            }
                        }
                    }
                    if ($(this).val() == "0") {
                        $('#residencia').focus()
                    }
                    if ($(this).val().slice(0, 1) == ".") {
                        var urlEner = "https://oficinavirtual.energuate.com/mifactura?" + $(this).val().slice(1)
                        window.open(urlEner, "Energuate", "width=600,height=400,scrollbars=NO")
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
                    if ($('#domicilioDepto').val() != localStorage.getItem('domicilioDepto')) {
                        $('#domicilioDepto').val(localStorage.getItem('domicilioDepto')).change();
                    }
                    setInter_Muni()
                }
                if ($('#residencia').val().length > 0) {
                    for (var i = 0; i < 3; i++) {
                        $('#residencia').val($('#residencia').val().replaceAll('..', '.'))
                        $('#residencia').val($('#residencia').val().replaceAll(',.', '.'))
                        $('#residencia').val($('#residencia').val().replaceAll(' .', '.'))
                        $('#residencia').val($('#residencia').val().replaceAll(' ,', ','))
                        $('#residencia').val($('#residencia').val().replaceAll('  ', ' '))
                    }
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

            function setInter_Muni() {
                if (localStorage.getItem('domicilioMuni') > 0) {
                    if ($('#domicilioMuni').val() != localStorage.getItem('domicilioMuni')) {
                        const ArrendInt = setInterval(function() {
                            if ($('#domicilioMuni option').length > 2) {
                                $('#domicilioMuni').val(localStorage.getItem('domicilioMuni'));
                                if ($('#domicilioMuni').val() == localStorage.getItem('domicilioMuni')) {
                                    clearTimeout(ArrendInt)
                                }
                            }
                        }, 250)
                    }
                }
            }
        }
        setInterval(function() {
            if (TRIANGULO == 'true') {
                if ($('#resultadoHistorial').text() == 'Historial Vacio') {
                    $('#resultadoHistorial').text('');
                    if ($("#ui-id-1", parent.document).text() == 'Arrendamiento') {
                        $("#ui-id-1", parent.document)[0].click();
                    }
                }
            }
            if (IDPERSONA == 'false') {
                if ($('#resultadoPersonas tr').length > 0 && $('#resultadoPersonas h6').length == 0) {
                    $('#resultadoPersonas').append("<h6></h6>");
                    if (TRIANGULO == 'false') {
                        $('#formDatosPersona .form-control').each(function() {
                            localStorage.setItem('Temp_' + this.id, '');
                        });
                        if ($("#ui-id-2", parent.document).text() == 'Triangulo') {
                            $("#ui-id-2", parent.document)[0].click();
                        }
                    }
                    if ($('#resultadoPersonas tr').length == 2) {
                        $('#resultadoPersonas button').click();
                    }
                }
            }
            if ($('#resultadoPersonas').text() == "No se encontraron registros") {
                if ($('#resultadoPersonas h6').length == 0) {
                    $("#resultadoPersonas").append("<h6></h6>")
                    if ($('#tituloEdicion').text() == "Para registrar personas haga clic en el botón Nuevo") {
                        ingresarPersona();
                    }
                    if (TRIANGULO == 'false') {
                        if ($("#ui-id-2", parent.document).text() == 'Triangulo') {
                            $("#ui-id-2", parent.document)[0].click();
                        }
                    } else {
                        if ($("#ui-id-1", parent.document).text() == 'Arrendamiento') {
                            $("#ui-id-1", parent.document)[0].click();
                        }
                    }
                }
            }
            if ($('#tituloHistorial button').length == 1) {
                if ($('#resultadoHistorial h6').length == 0) {
                    $('#resultadoHistorial').append("<h6></h6>");
                    iBoleta();
                }
            }
        }, 250);

        function iBoleta() {
            if (idUsuario == '1244' || idUsuario == '1496' || idUsuario == '2127') {
                if (idUsuario == '1244') {
                    var nombreU = "rgcahuex";
                }
                if (idUsuario == '1496') {
                    var nombreU = "rjcom";
                }
                if (idUsuario == '2127') {
                    var nombreU = "haochoa";
                }
                var f = new Date();
                var objeto1 = $('#resultadoH').html();
                var doc = new jsPDF('p', 'pt', 'letter');
                var logo = new Image();
                logo.src = "/servicesft/web/img/logo_fontierras.png";
                doc.addImage(logo, 'PNG', 20, 25, 30, 30);
                doc.setFontSize(16);
                if (esTriangulo == 1) {
                    doc.text('HISTORIAL DE BENEFICIARIO DE TRIANGULO DE LA DIGNIDAD', 75, 45);
                    doc.autoTableSetDefaults({
                        headStyles: {
                            fillColor: [233, 230, 234],
                            textColor: 47
                        }
                    });
                    doc.autoTable({
                        html: '#tablaH',
                        startY: 60,
                        margin: {
                            horizontal: 20,
                            top: 20
                        },
                        columnStyles: {
                            0: {
                                cellWidth: 50
                            },
                            1: {
                                cellWidth: 50
                            },
                            2: {
                                cellWidth: 55
                            },
                            3: {
                                cellWidth: 50
                            },
                            4: {
                                cellWidth: 50
                            },
                            5: {
                                cellWidth: 50
                            },
                            6: {
                                cellWidth: 60
                            },
                            7: {
                                cellWidth: 70
                            },
                            8: {
                                cellWidth: 50
                            },
                            9: {
                                cellWidth: 75
                            }
                        }
                    });
                } else {
                    doc.text('HISTORIAL DE BENEFICIARIO DE ARRENDAMIENTO DE TIERRAS', 70, 45);
                    doc.autoTableSetDefaults({
                        headStyles: {
                            fillColor: [233, 230, 234],
                            textColor: 47
                        }
                    });
                    doc.autoTable({
                        html: '#tablaH',
                        startY: 60,
                        margin: {
                            horizontal: 20,
                            top: 20
                        },
                        columnStyles: {
                            0: {
                                cellWidth: 65
                            }, // Programa
                            1: {
                                cellWidth: 50
                            }, // Figura
                            2: {
                                cellWidth: 65
                            }, // Documento
                            3: {
                                cellWidth: 50
                            }, // Ejercicio
                            4: {
                                cellWidth: 60
                            }, // Estado
                            5: {
                                cellWidth: 60
                            }, // Prestamo
                            6: {
                                cellWidth: 70
                            }, // Conocimiento
                            7: {
                                cellWidth: 50
                            }, // Demanda
                            8: {
                                cellWidth: 75
                            } // Doc. Demanda                                    
                        }
                    });
                }
                let finalY = doc.autoTable.previous.finalY;
                doc.setFontSize(8);
                doc.text(20, finalY + 10, "Usuario: " + nombreU + "    Fecha: " + addZero(f.getDate()) + "/" + (addZero(f.getMonth() + 1)) + "/" + f.getFullYear() + "  " + addZero(f.getHours()) + ":" + addZero(f.getMinutes()) + ":" + addZero(f.getSeconds()));
                if (esTriangulo == 1) {
                    doc.save('T_' + dpiPersona + "_" + f.getFullYear() + "/" + (addZero(f.getMonth() + 1)) + "/" + addZero(f.getDate()) + "_" + addZero(f.getHours()) + ":" + addZero(f.getMinutes()) + ":" + addZero(f.getSeconds()) + '.pdf');
                } else {
                    doc.save('A_' + dpiPersona + "_" + f.getFullYear() + "/" + (addZero(f.getMonth() + 1)) + "/" + addZero(f.getDate()) + "_" + addZero(f.getHours()) + ":" + addZero(f.getMinutes()) + ":" + addZero(f.getSeconds()) + '.pdf');
                }
            } else {
                imprimirHistorialP()
            }
        }
    };
}
if ($(location).attr('href').slice(37, 47) == 'mifactura?') {
    console.log('03.30.23.17')
    $('#nisRad').val($(location).attr('href').slice(47))
    $('#btnNisRad').click()
    $('#dashnoardMain').remove()
    $('.navbar').remove()
    $('#primaryTab').remove()
    $('#background_modal').remove()
    $('#content_modal').remove()
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
            $('#downloadBill').click();
            window.close(location, '_self')
        }
    });
};