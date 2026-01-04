// ==UserScript==
// @name        Teste
// @namespace   pontoeletronico.bnb
// @include     http://s1nlbp22/pontoweb
// @version     1
// @grant       none
// @description Personal testing
// @downloadURL https://update.greasyfork.org/scripts/35592/Teste.user.js
// @updateURL https://update.greasyfork.org/scripts/35592/Teste.meta.js
// ==/UserScript==

viewModel.postBatida = (function (form, modalId) {
            AcionarIconeLoad(true);
            form = $(form);
            var self = this;
			/*
            // get client-side Captcha object instance
            var captchaObj = $("#CaptchaCode").get(0).Captcha;

            // gather data required for Captcha validation
			
            var params = {}
            params.CaptchaId = captchaObj.Id;
            params.InstanceId = captchaObj.InstanceId;
            params.UserInput = $("#CaptchaCode").val();

            var _jsres;

            $.getJSON('/Pontoweb/Home/CheckCaptcha', params, function (result) {
                if (false === result) {
                    document.getElementById('modal-btn-confirm').style.pointerEvents = 'none';

                    addAlert('A verificação de segurança falhou. Informe corretamente o código de verificação ' +
                         '\r(captcha) ao final deste formulário.', 'alert alert-danger', 'Falha no Registro da Batida');

                    var captchaObj = $("#CaptchaCode").get(0).Captcha;

                    captchaObj.ReloadImage();

                    window.setTimeout(function () { document.getElementById('modal-btn-confirm').style.pointerEvents = 'auto'; }, 10000);
                    AcionarIconeLoad(false);
                    return;
                } else {*/

                    var _batida = {};

                    var captchaObj = $("#CaptchaCode").get(0).Captcha;

                    _batida["idx"] = viewModel.batidas().length + 1;
                    _batida["matricula"] = form.find("#Matricula").val();
                    _batida["datahora"] = form.find("#DataHora").val();
                    _batida["datahoraUnix"] = _datahoraUnixServidor;
                    _batida["tipo"] = form.find("#Tipo").val();
                    _batida["csip"] = "128.15.0.20";
                    _batida["capid"] = captchaObj.Id;
                    _batida["instid"] = captchaObj.InstanceId;
                    _batida["userin"] = $("#CaptchaCode").val();

                    if ($("#ExibeIntervaloDescanso").val() == 'True') {

                        _batida["intervObrig"] = true;
                        _batida["prorrogExp"] = $("#ProrrogarExpediente").prop("checked");

                        if (_batida["prorrogExp"] == false) {

                            if ($("#DataInicioIntervaloDescanso").val() == '') {
                                addAlert('Campo obrigatório data início do intervalo não informado.', 'alert alert-danger', 'Falha no Registro da Batida');
                                AcionarIconeLoad(false);
                                return;
                            }

                            if ($("#HoraInicioIntervaloDescanso").val() == '') {
                                addAlert('Campo obrigatório hora início do intervalo não informado.', 'alert alert-danger', 'Falha no Registro da Batida');
                                AcionarIconeLoad(false);
                                return;
                            }

                            _batida["intervIni"] = $("#DataInicioIntervaloDescanso").val() + ' ' + $("#HoraInicioIntervaloDescanso").val();

                            if (form.find("#DataFimIntervaloDescanso").val() == '') {
                                addAlert('Campo obrigatório data término do intervalo não informado.', 'alert alert-danger', 'Falha no Registro da Batida');
                                AcionarIconeLoad(false);
                                return;
                            }

                            if (form.find("#HoraFimIntervaloDescanso").val() == '') {
                                addAlert('Campo obrigatório hora término do intervalo não informado.', 'alert alert-danger', 'Falha no Registro da Batida');
                                AcionarIconeLoad(false);
                                return;
                            }

                            _batida["intervFim"] = $("#DataFimIntervaloDescanso").val() + ' ' + $("#HoraFimIntervaloDescanso").val();
                        }
                    }
                    else if ($("#ExibeIntervaloArtigoCLT").val() == 'True') {
                        _batida["intervObrig"] = true;
                        _batida["prorrogExp"] = false;
                        _batida["intervIni"] = $("#DataHoraInicioIntervaloArtigoClt").val();
                        _batida["intervFim"] = $("#DataHoraFimIntervaloArtigoClt").val();
                    }

                    var json = JSON.stringify(_batida);

                    $.ajax({
                        url: '/Pontoweb/api/batidas',
                        type: 'POST',
                        data: json,
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        success: function (_jsonres) {
                            if (_jsonres.postr) {
                                viewModel.loadBatidas();
                                $('#' + modalId).modal('hide');
                            }
                            else {
                                addAlert(_jsonres.msgErro, 'alert alert-danger', 'Falha no Registro da Batida');
                            }
                            AcionarIconeLoad(false);
                        }
                    });
                //}
            //});

        });
//alert(document.getElementsByTagName("script")[lastPos].innerHTML);