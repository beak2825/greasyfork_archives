// ==UserScript==
// @name         New Userscript
// @namespace    https://freebitco.in/?op=home#
// @version      2.0.9.7
// @description  try to take over the world!
// @author       You
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386744/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/386744/New%20Userscript.meta.js
// ==/UserScript==
var botRunning = false;
var intervalBot;
var APIKEY = '1cf78845310cb0d149170376b8bd082a';
var CORS = 'https://speedfb.online/';
var GOOGLEKEY = '6LeGfGIUAAAAAEyUovGUehv82L-IdNRusaYFEm5b';
var timercheckbalance = 10; // minutes
var checkingbalance = false;
var timercheckbotstopped = 558; // in seconds 9.3 minutes
var checkBotStoppedTimer = 0;
var captchawrongattemp = 0;

$(document).ready(function() {
    var tempo = 0;
    var tempomin = 0;

    console.log('Iniciando...');

    if (localStorage.getItem('botStopWorking') === null) {
        intervalBot = setInterval(function() {
            if (!botRunning) {
                tempo++;
                if (tempo == 60) {
                    tempo = 0;
                    tempomin++;
                    console.log('Passou ' + tempomin + ' minuto');
                }
                if (!document.getElementById('time_remaining').classList.contains('hasCountdown')) {
                    tempomin = 0;
                    tempo = 0;
                    botRunning = true;
                    checkBalance2Captcha();
                }
            }
        }, 1000);

        var checkBotStop = setInterval(function() {
            if (!checkingbalance && botRunning) {
                checkBotStoppedTimer++;
                if (checkBotStoppedTimer === timercheckbotstopped) {
                    clearInterval(checkBotStop);
                    console.log('Bot parou de funcionar, reiniciando página...')
                    localStorage.setItem('botStopWorking', '');
                    window.location.reload();
                }
            }
        }, 1000);
    } else {
        localStorage.removeItem('botStopWorking');
        console.log('Reiniciando página novamente..')
        setTimeout(function() {
            window.location.reload();
        }, 3000);
    }
});

function checkBalance2Captcha() {
    console.log('Começando verificação de balanço 2Captcha...');
    var timecheckbalancesec = 0;
    var timecheckbalancemin = 0;
    var timeremaining = 0;

    $.ajax({
        url: CORS + 'https://2captcha.com/res.php?key=' + APIKEY + '&action=getbalance',
        success: function(resultbalance) {
            var balancestring = resultbalance.replace('.', '');
            var balance = parseInt(balancestring);
            if (balance >= 100) {
                console.log('Saldo suficiente (' + resultbalance + '), requisitando resposta do captcha');
                initBOT();
            } else {
                checkingbalance = true;
                console.log('Saldo insuficiente (' + resultbalance + '), começando verificação de saldo em ' + timercheckbalance + ' minutos');
                var checkBalance = setInterval(function() {

                    timecheckbalancesec++;

                    if (timecheckbalancesec == 60) {
                        timecheckbalancemin++;
                        timecheckbalancesec = 0;

                        timeremaining = timercheckbalance - timecheckbalancemin;

                        console.log('Faltam ' + timeremaining + ' minutos para verificação de balanço');
                    }

                    if (timecheckbalancemin == timercheckbalance) {
                        clearInterval(checkBalance);
                        checkingbalance = false;
                        window.location.reload();
                    }
                }, 1000)
            }
        },
        fail: function() {
            console.log('Falhou');
        }
    })
}

function initBOT() {
    var bonusRPBuyed = false;
    var RP = document.getElementsByClassName('reward_table_box br_0_0_5_5 user_reward_points font_bold')[0].innerText.replace(',', '');
    if (document.getElementById('bonus_container_free_points') !== null) {
        bonusRPBuyed = true;
    }
    if (RP >= 12) {
        if (document.getElementById('bonus_container_free_points') === null || document.getElementById('bonus_container_free_points') !== null && document.getElementById('bonus_container_free_points').style.display === 'none') {
            console.log('Comprando bônus RP');
            if (document.getElementById('unblock_modal_rp_bonuses_container').style.display === 'none') {
                if (RP >= 1200) {
                    RedeemRPProduct('free_points_100');
                } else if (RP >= 600) {
                    RedeemRPProduct('free_points_50');
                } else if (RP >= 300) {
                    RedeemRPProduct('free_points_25');
                } else if (RP >= 120) {
                    RedeemRPProduct('free_points_10');
                } else if (RP >= 12) {
                    RedeemRPProduct('free_points_1');
                }
            } else {
                if (RP >= 120) {
                    RedeemRPProduct('free_points_10');
                } else if (RP >= 12) {
                    RedeemRPProduct('free_points_1');
                }
            }


            console.log('Checando se o bônus RP foi comprado...');

            var checkBonusRPBuyed = setInterval(function() {
                if (document.getElementById('bonus_container_free_points') !== null) {
                    clearInterval(checkBonusRPBuyed);
                    bonusRPBuyed = true;
                    console.log('Bônus RP comprado. Comprando outros bônus')
                }else if (document.querySelector('.reward_point_redeem_result').innerText !== 'Error message!' && document.querySelector('.reward_point_redeem_result').innerText.indexOf('You do not') > -1){
                    clearInterval(checkBonusRPBuyed);
                    console.log('Erro ao comprar o bônus, reiniciando a página em 30 segundos...');
                    setTimeout(function(){
                        window.location.reload();
                    },1000*30);
                }
            }, 1000)
        }

        var checkBonusRPEnabled = setInterval(function() {
                if (RP >= 180 && document.getElementById('bonus_container_fp_bonus') === null || document.getElementById('bonus_container_fp_bonus') !== null && document.getElementById('bonus_container_fp_bonus').style.display === 'none') {
                    if (bonusRPBuyed && document.getElementById('bonus_container_free_points') !== null) {
                        clearInterval(checkBonusRPEnabled);

                        console.log('Comprando bônus FP');
                        if (document.getElementById('unblock_modal_rp_bonuses_container').style.display === 'none') {
                            if (RP >= 3200) {
                                RedeemRPProduct('fp_bonus_1000')
                            } else if (RP >= 1600) {
                                RedeemRPProduct('fp_bonus_500')
                            } else if (RP >= 320) {
                                RedeemRPProduct('fp_bonus_100')
                            } else if (RP >= 160) {
                                RedeemRPProduct('fp_bonus_50')
                            }
                        } else {
                            if (RP >= 390) {
                                RedeemRPProduct('fp_bonus_100')
                            } else if (RP >= 180) {
                                RedeemRPProduct('fp_bonus_50')
                            }
                        }

                        var checkBonusFPBuyed = setInterval(function() {
                            if (document.getElementById('bonus_container_fp_bonus') !== null) {
                                clearInterval(checkBonusFPBuyed);
                                console.log('Bônus FP comprado.')
                                checkCaptchaOrNot();
                            }else if (document.querySelector('.reward_point_redeem_result').innerText !== 'Error message!' && document.querySelector('.reward_point_redeem_result').innerText.indexOf('You do not') > -1){
                                clearInterval(checkBonusFPBuyed);
                                console.log('Erro ao comprar o bônus, reiniciando a página em 30 segundos...');
                                setTimeout(function(){
                                    window.location.reload();
                                },1000*30);
                            }
                        }, 1000);
                    }
                } else {
                    clearInterval(checkBonusRPEnabled);
                    checkCaptchaOrNot();
                }
            },
            1000);
    } else {
        checkCaptchaOrNot();
    }
}


function checkCaptchaOrNot() {
    console.log('Checando método para resolver');
    if (document.getElementById('switch_captchas_button') !== null) {
        solveTwoCaptcha()
    } else if (document.getElementById('play_without_captchas_button') !== null) {
        solveRecaptcha()
    } else {
        console.log('Método escolhido: Resolver sem captcha');
        document.getElementById('free_play_form_button').click();
        var checkRollSuccess = setInterval(function() {
            if (document.getElementById('free_play_result').style.display === 'block') {
                clearInterval(checkRollSuccess);
                botRunning = false;
                console.log('Roll feito com sucesso resetando..');
            }
        }, 1000);
    }
}

function solveTwoCaptcha() {
    console.log('Método escolhido: TwoCaptcha');
    SwitchCaptchas('double_captchas');

    var urlimages = 'https://captchas.freebitco.in/botdetect/e/live/images/';
    var divcaptchaone = document.getElementsByClassName('captchasnet_captcha_content')[0];
    var divcaptchatwo = document.getElementsByClassName('captchasnet_captcha_content')[1];
    var captchaone = divcaptchaone.getElementsByTagName('img')[0];
    var captchatwo = divcaptchatwo.getElementsByTagName('img')[0];
    var captchaoneimage = CORS + urlimages + captchaone.src.substring(64) + '.jpeg';
    var captchatwoimage = CORS + urlimages + captchatwo.src.substring(64) + '.jpeg';

    toDataCaptcha(captchaoneimage, captchatwoimage);
}

function toDataCaptcha(captchaimage, captchatwoimage) {
    var c = document.createElement('CANVAS');
    c.width = 480;
    c.height = 80;
    var ctx = c.getContext("2d");
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    imageObj1.crossOrigin = 'Anonymous';
    imageObj2.crossOrigin = 'Anonymous';
    imageObj1.src = captchaimage;
    imageObj1.onload = function() {
        ctx.drawImage(imageObj1, 0, 0, 240, 80);
        imageObj2.src = captchatwoimage;
        imageObj2.onload = function() {
            ctx.drawImage(imageObj2, 260, 0, 240, 80);
            var img = c.toDataURL("image/jpeg");


            var fmfirstCaptcha = new FormData();
            fmfirstCaptcha.append('method', 'base64');
            fmfirstCaptcha.append('key', APIKEY);
            fmfirstCaptcha.append('body', img);
            fmfirstCaptcha.append('phrase', '1');
            fmfirstCaptcha.append('numeric', '2');
            fmfirstCaptcha.append('min_len', '10');
            fmfirstCaptcha.append('textinstructions', "Example: okriex mjuesdx");

            console.log('Requisitando Resposta (1)');

            $.ajax({
                url: CORS + 'https://2captcha.com/in.php',
                data: fmfirstCaptcha,
                processData: false,
                contentType: false,
                type: 'POST',

                success: function(result) {

                    if (result.length < 3) {
                        console.log(result);
                        window.location.reload();
                    } else if (result.substring(0, 3) == 'OK|') {
                        console.log('Requisitando Resposta (2) em cinco segundos');
                        var captchaID = result.substring(3);
                        setTimeout(function() {
                            getRespostaTwoCaptcha(captchaID)
                        }, 5000);
                    } else if (result === 'ERROR_ZERO_BALANCE') {
                        console.log('Balanço insuficiente');
                        checkBalance2Captcha();
                    } else {
                        console.log(result);
                    }
                },
                fail: function() {
                    console.log('Falhou');
                }
            });


        }
    };
}

var tentativastwocaptcha = 0;

function getRespostaTwoCaptcha(captchaID) {
    tentativastwocaptcha++;
    console.log('Tentativa ' + tentativastwocaptcha + ' de 65');
    if (tentativastwocaptcha <= 65) {
        $.ajax({
            url: CORS + 'https://2captcha.com/res.php?key=' + APIKEY + '&action=get&id=' + captchaID,
            success: function(ansresult) {
                if (ansresult.length < 3) {
                    console.log('Erro: ' + ansresult);
                    setTimeout(function() {
                        getRespostaTwoCaptcha(captchaID)
                    }, 5000);
                } else {
                    if (ansresult.substring(0, 3) == 'OK|') {
                        tentativastwocaptcha = 0;
                        var resposta = ansresult.substring(3);
                        console.log('Colocando a resposta: ' + resposta);
                        if (resposta.split(' ').length - 1 === 1) {
                            try {
                                var splitresposta = resposta.split(' ');
                                captcharesposta1 = splitresposta[0];
                                captcharesposta2 = splitresposta[1];

                                document.getElementsByClassName('captchasnet_captcha_input_box')[0].value = captcharesposta1;
                                document.getElementsByClassName('captchasnet_captcha_input_box')[1].value = captcharesposta2;

                                var checkCode = setInterval(function() {
                                    if (document.getElementsByClassName('captchasnet_captcha_input_box')[0].value.length > 0 && document.getElementsByClassName('captchasnet_captcha_input_box')[1].value.length > 0) {
                                        clearInterval(checkCode);

                                        console.log('Fazendo roll');
                                        document.getElementById('free_play_form_button').click();

                                        var checkRollSuccess = setInterval(function() {
                                            if (document.getElementById('free_play_form_button').style.display !== 'none' && document.getElementById('free_play_result').style.display === '' && document.getElementById('free_play_error').innerHTML === 'Captcha is incorrect or has expired. Please try again.') {
                                                clearInterval(checkRollSuccess);
                                                makeRecognition(captchaID, ansresult, true);
                                                captchawrongattemp++;
                                                if (captchawrongattemp == 5){
                                                    console.log('Erro: Sessão expirada, reiniciando página em 2 minutos');
                                                    setTimeout(function(){
                                                    window.location.reload();
                                                },1000*60*2);
                                                }
                                            } else if (document.getElementById('free_play_form_button').style.display !== 'none' && document.getElementById('free_play_result').style.display === '' && document.getElementById('free_play_error').innerHTML === 'Session Expired.Please reload the page.') {
                                                clearInterval(checkRollSuccess);
                                                console.log('Erro: Sessão expirada, reiniciando página em 2 minutos');
                                                setTimeout(function(){
                                                    window.location.reload();
                                                },1000*60*2);
                                            } else if (document.getElementById('free_play_form_button').style.display === 'none' && document.getElementById('free_play_result').style.display === 'block') {
                                                clearInterval(checkRollSuccess);
                                                console.log('Roll feito com sucesso resetando..');
                                                makeRecognition(captchaID, false);
                                                botRunning = false;
                                            }
                                        }, 1000);
                                    }
                                }, 1000)
                            } catch (e) {
                                makeRecognition(captchaID, ansresult, true);
                            }
                        } else {
                            makeRecognition(captchaID, ansresult, true);
                        }
                    } else if (ansresult === 'CAPCHA_NOT_READY') {
                        setTimeout(function() {
                            getRespostaTwoCaptcha(captchaID)
                        }, 5000);
                    } else if (ansresult === 'ERROR_CAPTCHA_UNSOLVABLE') {
                        tentativastwocaptcha = 0;
                        console.log('Captcha não resolvido tentando novamente. Não será cobrado.');
                        checkBalance2Captcha();
                    }
                }
            },
            fail: function(resultfail) {
                console.log('Falhou: ' + resultfail);
            }
        });
    } else {
        tentativastwocaptcha = 0;
        console.log('Número de tentativas excedido');
        checkBalance2Captcha();
    }
}


function solveRecaptcha() {
    console.log('Método escolhido: Recaptcha');
    console.log('Requisitando Resposta (1)');
    $.ajax({
        url: CORS + 'https://2captcha.com/in.php?key=' + APIKEY + '&method=userrecaptcha&googlekey=' + GOOGLEKEY + '&pageurl=https://freebitco.in/',
        success: function(result) {
            if (result.length < 3) {
                console.log(result);
                window.location.reload();
            } else {
                if (result.substring(0, 3) == 'OK|') {
                    console.log('Requisitando Resposta (2) em cinco segundos');
                    var captchaID = result.substring(3);
                    setTimeout(function() {
                        getRespostaRecaptcha(captchaID)
                    }, 5000)
                } else {
                    console.log(result);
                    checkBalance2Captcha();
                }
            }
        },
        fail: function(resultfail) {
            console.log('Falhou: ' + resultfail);
        }
    })
}

var tentativasrecaptcha = 0;

function getRespostaRecaptcha(captchaID) {
    tentativasrecaptcha++;
    console.log('Tentativa de resposta: ' + tentativasrecaptcha + ' de 65');
    if (tentativasrecaptcha <= 65) {
        $.ajax({
            url: CORS + 'https://2captcha.com/res.php?key=' + APIKEY + '&action=get&id=' + captchaID,
            success: function(ansresult) {
                if (ansresult.length < 3) {
                    console.log('Erro: ' + ansresult);
                    tentativasrecaptcha = 0;
                    setTimeout(function() {
                        getRespostaRecaptcha(captchaID)
                    }, 5000);
                } else {
                    if (ansresult.substring(0, 3) == 'OK|') {
                        tentativasrecaptcha = 0;
                        console.log('Captcha resolvido colocando a resposta');
                        document.getElementById('g-recaptcha-response').innerHTML = ansresult.substring(3);
                        var checkCode = setInterval(function() {
                            if (document.getElementById('g-recaptcha-response').innerHTML.length > 0) {
                                clearInterval(checkCode);

                                console.log('Fazendo roll');
                                document.getElementById('free_play_form_button').click();

                                var checkRollSuccess = setInterval(function() {
                                    if (document.getElementById('free_play_form_button').style.display !== 'none' && document.getElementById('free_play_result').style.display === '' && document.getElementById('free_play_error').innerHTML === 'Captcha is incorrect or has expired. Please try again.') {
                                        clearInterval(checkRollSuccess);
                                        makeRecognition(captchaID, true);
                                    } else if (document.getElementById('free_play_form_button').style.display !== 'none' && document.getElementById('free_play_result').style.display === '' && document.getElementById('free_play_error').innerHTML === 'Session Expired.Please reload the page.') {
                                        clearInterval(checkRollSuccess);
                                        console.log('Sessão expirada, reiniciando página');
                                        window.location.reload();
                                    } else if (document.getElementById('free_play_form_button').style.display === 'none' && document.getElementById('free_play_result').style.display === 'block') {
                                        clearInterval(checkRollSuccess);
                                        console.log('Roll feito com sucesso resetando..');
                                        makeRecognition(captchaID, false);
                                        botRunning = false;
                                    }
                                }, 1000);
                            }
                        }, 1000)
                    } else if (ansresult === 'CAPCHA_NOT_READY') {
                        setTimeout(function() {
                            getRespostaRecaptcha(captchaID)
                        }, 5000);
                    } else if (ansresult === 'ERROR_CAPTCHA_UNSOLVABLE') {
                        tentativasrecaptcha = 0;
                        console.log('Captcha não resolvido tentando novamente');
                        checkBalance2Captcha();
                    }
                }
            }
        });
    } else {
        tentativasrecaptcha = 0;
        console.log('Número de tentativas excedido');
        checkBalance2Captcha();
    }
}

function makeRecognition(captchaID, respostaCaptcha, captchaWrong) {
    if (!captchaWrong) {
        $.ajax({
            url: CORS + 'https://2captcha.com/res.php?key=' + APIKEY + '&action=reportgood&id=' + captchaID,
            success: function(reportgood) {
                console.log('ReportGood enviado ^^ ' + reportgood);
            }
        });
    } else {
        console.log('Captcha incorreto fazendo reconhecimento: ' + respostaCaptcha);
        $.ajax({
            url: CORS + 'http://2captcha.com/res.php?key=' + APIKEY + '&action=reportbad&id=' + captchaID,
            success: function(reportbad) {
                console.log('Tentando novamente ' + reportbad);
                checkBalance2Captcha();
            }
        });
    }
}
