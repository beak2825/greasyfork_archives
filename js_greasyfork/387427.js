// ==UserScript==
// @name         New Userscript
// @namespace    https://bitpick.co/
// @version      1.3.8
// @description  try to take over the world!
// @author       You
// @match        https://bitpick.co
// @match        https://bitpick.co/login.php
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/387427/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/387427/New%20Userscript.meta.js
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
var reloadPage = localStorage.getItem('reloadPage') !== null ? localStorage.getItem('reloadPage') : 'false';
var email = localStorage.getItem('email') !== null ? localStorage.getItem('email') : '';
var password = localStorage.getItem('password') !== null ? localStorage.getItem('password') : '';

$(document).ready(function() {
    var tempo = 0;
    var tempomin = 0;

    setTimeout(function() {
        if (document.getElementById('login_button') === null) {
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
                        if (tempomin === 10) {
                            window.location.reload();
                        }
                        if (document.getElementById('show_free_rolling_game').style.display !== 'none') {
                            if (reloadPage === 'false') {
                                window.location.reload();
                                localStorage.setItem('reloadPage', true);
                                return;
                            }
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
        } else {
            if (localStorage.getItem('email') !== null && localStorage.getItem('password') !== null){
                writeLogin();
            }else{
                 window.onbeforeunload = function(){
                    localStorage.setItem('email', document.getElementById('user_email').value);
                    localStorage.setItem('password', document.getElementById('user_pwd').value);
                };
            }
        }
    }, 3000)
});

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function writeLogin() {
    await timeout(2500);
    document.getElementById('user_email').focus();
    document.getElementById('user_email').value = localStorage.getItem('email');
    await timeout(2500);
    document.getElementById('user_pwd').focus();
    document.getElementById('user_pwd').value = localStorage.getItem('password');
    await timeout(1500);
    document.getElementById('user_email').focus();
    document.getElementById('user_email').value += 'a';
    await timeout(1500);
    document.getElementById('user_pwd').focus();
    document.getElementById('user_pwd').value += 'a';
    await timeout(2000);

    await timeout(1752);
    document.getElementById('user_email').focus();
    document.getElementById('user_email').value = document.getElementById('user_email').value.substring(0, document.getElementById('user_email').value.lastIndexOf('a'));
    await timeout(1852);
    document.getElementById('user_pwd').focus();
    document.getElementById('user_pwd').value = document.getElementById('user_pwd').value.substring(0, document.getElementById('user_pwd').value.lastIndexOf('a'));
    await timeout(2593);
    document.getElementById('login_button').focus();
    document.getElementById('login_button').click();
}

function writeCaptcha() {

}

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
    solveCaptcha();
}

function solveCaptcha() {
    html2canvas(document.getElementsByClassName('show_captcha')[0], {
        onrendered: function(canvas) {
            var tempcanvas = document.createElement('canvas');
            tempcanvas.width = 253;
            tempcanvas.height = 96;
            var context = tempcanvas.getContext('2d');
            context.drawImage(canvas, 0, 0, 253, 96);
            var dataURL = tempcanvas.toDataURL('image/png'); //function blocks CORS
            var fmfirstCaptcha = new FormData();
            fmfirstCaptcha.append('method', 'base64');
            fmfirstCaptcha.append('key', APIKEY);
            fmfirstCaptcha.append('body', dataURL);
            fmfirstCaptcha.append('phrase', '1');
            fmfirstCaptcha.append('numeric', '3');

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
                            getRespostaCaptcha(captchaID)
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
    });
}

var tentativascaptcha = 0;

function getRespostaCaptcha(captchaID) {
    tentativascaptcha++;
    console.log('Tentativa ' + tentativascaptcha + ' de 65');
    if (tentativascaptcha <= 65) {
        $.ajax({
            url: CORS + 'https://2captcha.com/res.php?key=' + APIKEY + '&action=get&id=' + captchaID,
            success: function(ansresult) {
                if (ansresult.length < 3) {
                    console.log('Erro: ' + ansresult);
                    setTimeout(function() {
                        getRespostaCaptcha(captchaID)
                    }, 5000);
                } else {
                    if (ansresult.substring(0, 3) == 'OK|') {
                        tentativascaptcha = 0;
                        var resposta = ansresult.substring(3);
                        console.log('Colocando a resposta: ' + resposta);

                        document.getElementById('game_capt').value = resposta;

                        var checkCode = setInterval(function() {
                            if (document.getElementById('game_capt').value.length > 0) {
                                clearInterval(checkCode);

                                console.log('Fazendo roll');
                                document.getElementById('roll_button').focus();
                                document.getElementById('roll_button').click();

                                var checkRollSuccess = setInterval(function() {
                                    if (document.getElementsByClassName('sa-icon sa-error animateErrorIcon')[0] !== undefined && document.getElementsByClassName('sa-icon sa-error animateErrorIcon')[0].style.display === 'block') {
                                        clearInterval(checkRollSuccess);
                                        makeRecognition(captchaID, ansresult, true);
                                        document.getElementById('game_capt').value = '';
                                        captchawrongattemp++;
                                        if (captchawrongattemp == 5) {
                                            console.log('Erro: Sessão expirada, reiniciando página em 2 minutos');
                                            setTimeout(function() {
                                                window.location.reload();
                                            }, 1000 * 60 * 2);
                                        }
                                        var clickButton = setInterval(function() {
                                            if (document.getElementsByClassName('sweet-alert showSweetAlert visible')[0] !== undefined && document.getElementsByClassName('confirm')[0] !== undefined) {
                                                clearInterval(clickButton);
                                                document.getElementsByClassName('confirm')[0].click();
                                            }
                                        });
                                    } else {
                                        clearInterval(checkRollSuccess);
                                        console.log('Roll feito com sucesso resetando..');
                                        makeRecognition(captchaID, false);
                                        var clickButton = setInterval(function() {
                                            if (document.getElementsByClassName('sweet-alert showSweetAlert visible')[0] !== undefined && document.getElementsByClassName('confirm')[0] !== undefined) {
                                                clearInterval(clickButton);
                                                document.getElementsByClassName('confirm')[0].click();
                                            }
                                        });
                                        reloadPage = 'false';
                                        localStorage.setItem('reloadPage', false);
                                        setTimeout(function() {
                                            botRunning = false;
                                        }, 10000);
                                        document.getElementById('game_capt').value = '';
                                    }
                                }, 1000);
                            }
                        }, 1000)

                    } else if (ansresult === 'CAPCHA_NOT_READY') {
                        setTimeout(function() {
                            getRespostaCaptcha(captchaID)
                        }, 5000);
                    } else if (ansresult === 'ERROR_CAPTCHA_UNSOLVABLE') {
                        tentativascaptcha = 0;
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
        tentativascaptcha = 0;
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