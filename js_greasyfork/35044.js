// ==UserScript==
// @name        ПИРАТЫ
// @namespace   adblock-ikar
// @description adblock-ikar
// @include     https://s*-ru.ikariam.gameforge.com/*
// @include     http://s*-ru.ikariam.gameforge.com/*
// @version     5.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35044/%D0%9F%D0%98%D0%A0%D0%90%D0%A2%D0%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/35044/%D0%9F%D0%98%D0%A0%D0%90%D0%A2%D0%AB.meta.js
// ==/UserScript==

var morn = 6;
var obst = 13;
var obst_2 = 13;
var ev = 22;
var apikey = "d7cd20c2d9423b3cbd17c5d50b4d117f";
var obed = true;
var wrong_buf = '';


$(document).on('submit', 'form[onsubmit="ajaxHandlerCallFromForm(this);return false;"]', function () {
    if (Bush.on && Bush.istime()) {
        console.log('проверка после капчи');
        Bush.control();
    } else if(Bush.islastday()){
        console.log('проверка после капчи последний день');
        Bush.control();
    } else {
        Bush.sleepprocedure();
    }
});

$(document).on('click', "#check_obed", function(){
     if ($(this).is(':checked')){
        $("#start_intr").prop('disabled', false);
        $("#end_intr").prop('disabled', false);
    }else{
        $("#start_intr").prop('disabled', true);
        $("#end_intr").prop('disabled', true);
    }
});

$(document).on('click', "#save_pir", function(){
    obst = $("#start_intr").val();
    obst_2 = $("#end_intr").val();
    obed = $('#check_obed').is(':checked');
    console.log('Данные изменены. Настройки будут атуальны до следующего обновления страницы');
});

$(document).on('click', '#js_CityPosition17Link', function (event) {
    Bush.doAfterRandom('Bush.init()');
});

Bush =
    {
    checkfree: true,
    wakeUp: 0,
    timer: '',
    sleep: '',
    avtypes: 0,
    randMod: 1,
    on: false,
    flag: 0,
    sleepprocedure: function () {
        console.log('Чит уснул)');
        clearTimeout(Bush.timer);
        var now = new Date();
        var h = now.getHours();
        Bush.wakeUp = Math.random() * 20 + 39;
        if(h < obst || h > obst_2){
            if(Bush.avtypes >= 8){
                $('.button[href*="Level=15&"]').click();
                console.log('стартовала ночная миссия на 8ч');
            }else{
                $('.button[href*="Level='+(1+(Bush.avtypes-1)*2)+'&"]').click();
                console.log('стартовала ночная миссия '+(1+(Bush.avtypes-1)*2)+' типа');
            }
            Bush.sleepTimer(450);
        }else{
            Bush.sleepTimer(Bush.wakeUp-now.getMinutes());
        }
        Bush.control();
    },
    isMission: function () {
        return $('.action').children('.button').hasClass("button_disabled");
    },
    islastday: function(){ // отключена
        if($('span#piracyHighscoreTime').text().indexOf('Д') == -1){
            return true;
        }else{
            return false;
        }
    },
    istime: function () {
        var now = new Date();
        var d = now.getDay();
        var h = now.getHours();
        var m = now.getMinutes();
        if ((h > morn && h < obst) || (h > obst_2 && h < ev) || ((h == morn || h == obst_2) && (m > Bush.wakeUp || d == 0 || d == 6))) {
            return true;
        } else if(!obed && h >= obst && h <= obst_2){
	    return true;
	} else {
            return false;
        }
    },
    isCaptcha: function () {
        return $('#captcha').length;
	Bush.set_balance();
    },

    doAfterRandom: function (code) {
        window.setTimeout(code, (Math.random() * 0.3 + 0.2) * 10000); //2-5 секунд
    },

    control: function () {
        window.setTimeout('Bush.check()', 5000);
    },

    check: function () {
        console.log('проверяю');
        if (Bush.isCaptcha()) {
            console.log('Капча найдена!');
	    if(wrong_buf.length > 0){
		$.ajax({
                    type: 'GET',
                    url: 'https://rucaptcha.com/res.php?key='+apikey+'&action=reportbad&id='+wrong_buf+'&json=true&header_acao=1',
                    success: function (answer) {
                        if(answer.status) console.log('Капча с id='+wrong_buf+' разгадана неверно и была отправлена на сервер');
                        wrong_buf = '';
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log("Неправильная капча не была отправлена по причине: " + xhr.status +' '+ thrownError);
                    }
                });
	    }
            clearTimeout(Bush.timer);
            Bush.timer = '';
            capcher.uploadFile();
        } else {
            if (Bush.isMission()) {
                if (Bush.timer === '' || (!Bush.istime() && Bush.sleep !== '')) {
                    console.log('Захват идёт, но таймер не инициализирован');//выполняется сразу после капчи или смены режима тика
                    Bush.initTimer();
		    wrong_buf = '';
                } else {
                    console.log('Всё в порядке, захват идёт, таймер работает');
                }
            } else if (!Bush.islastday()){
                if (Bush.istime()) {
                    console.log('скрипт проснулся');
                    clearInterval(Bush.sleep);
                    Bush.timer = '';
                    console.log('Инициация чита');
                    Bush.clickPirat();
                } else {
                    console.log('ещё спим');
                    Bush.init();
                }
            } else {
                console.log('миссия не идёт, таймер хз, короче смотри сам');
            }
        }
    },

    clickPirat: function () {
	var now = new Date();
        var h = now.getHours();
        if((!Bush.istime() && !Bush.islastday()) || (Bush.islastday() && (h <= morn || h >= ev))){
            Bush.sleepprocedure();
            return;
        }
        var newrand = 0;
        var missiontimerset = Math.floor((Math.random() * Bush.avtypes) + 1);
        if(missiontimerset > Bush.avtypes || missiontimerset > 4) missiontimerset = 1;
        newrand = (1 + (missiontimerset - 1) * 2);
        if (Bush.avtypes == 1 || Bush.islastday()) {
            Bush.randMod = 1;
            $('.button[href*="Level=1&"]').click();
        }else{
            if(newrand !== Bush.randMod){
                clearTimeout(Bush.timer);
                Bush.randMod = newrand;
            }
            $('.button[href*="Level=' + Bush.randMod + '&"]').click();
        }
        console.log('чит стартовал миссию');
        Bush.initTimer();
        Bush.control();
    },
    fin: function(n, d, t){
        t = t/1000;
        var e = n;
        var p = new Date();
        p.setSeconds(0);p.setMinutes(0);p.setHours(0);
        switch (d) {
            case 1:
                e.setSeconds(e.getSeconds() + 150 + t);
                p.setSeconds(150 + t);
                break;
            case 3:
                e.setSeconds(e.getSeconds() + 450 + t);
                p.setSeconds(450 + t);
                break;
            case 5:
                e.setSeconds(e.getSeconds() + 900 + t);
                p.setSeconds(900 + t);
                break;
            case 7:
                e.setSeconds(e.getSeconds() + 1800 + t);
                p.setSeconds(1800 + t);
                break;
        }
        return Bush.zeroes(e.getHours(), 2)+':'+Bush.zeroes(e.getMinutes(), 2)+':'+Bush.zeroes(e.getSeconds(), 2)+'\n'+
            'Время миссии: '+Bush.zeroes(p.getHours(), 2)+':'+Bush.zeroes(p.getMinutes(), 2)+':'+Bush.zeroes(p.getSeconds(), 2);
    },
    initTimer: function () {
        var timeout = (Math.random() * 60 + 30) * 1000; //0.3...1.5
        if(Bush.islastday()){
            timeout = (Math.random() * 22 + 8) * 1000;
            Bush.timer = setTimeout('Bush.clickPirat()', 150000 + timeout);
        }else{
            switch (Bush.randMod) {
                case 1:
                    Bush.timer = setTimeout('Bush.clickPirat()', 150000 + timeout);
                    break;
                case 3:
                    Bush.timer = setTimeout('Bush.clickPirat()', 450000 + timeout);
                    break;
                case 5:
                    Bush.timer = setTimeout('Bush.clickPirat()', 900000 + timeout);
                    break;
                case 7:
                    Bush.timer = setTimeout('Bush.clickPirat()', 1800000 + timeout);
                    break;
                default:
                    console.log('что-то не так с определеителем');//стандартная
                    break;
            }
        }
        var totime = new Date();
        var ht = totime.getHours();
        var mt = totime.getMinutes();
        var st = totime.getSeconds();
        console.log('Интервал '+Bush.randMod+' типа запущен\nВремя старта:'+Bush.zeroes(ht, 2)+':'+Bush.zeroes(mt, 2)+':'+Bush.zeroes(st, 2)+'\nВремя завершения: '+Bush.fin(totime, Bush.randMod, timeout));
    },

    sleepTimer: function (time) {
        Bush.sleep = setTimeout('Bush.init()', (time+1) * 60 * 1000);
    },

    set_balance: function() {
        $.ajax(
            {
                type: 'GET',
                url: 'https://rucaptcha.com/res.php?key='+apikey+'&action=getbalance&json=true&header_acao=1',
                success: function (answer) {
                    $("#bal").text(answer.request);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Не могу посмотреть баланс" + xhr.status +' '+ thrownError);
                }
            });
    },

    zeroes: function(number, length) {
        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
        return my_string;
    },

    init: function () {
        if (Bush.avtypes == 0) {
            $('#container').append('<div id="sidebar" class="focusable focus" style="z-index: 98; left: 660px; top: 30px; opacity: 1; right: auto;"><ul id="sidebarWidget"><li class="accordionItem">'+
                                           '<a class="accordionTitle active"><center><b>Баланс: <span id="bal"></span></b></center></a><div class="accordionContent" style="box-sizing: border-box;padding: 12px;">'+
                                           '  Режим обеда: <input type="checkbox" checked id="check_obed" style="display: inline-block;vertical-align: baseline;">вкл '+
                                           '<input type="text" id="start_intr" size="3" value="'+obst+'"> - <input type="text" id="end_intr" size="3" value="'+(obst_2+1)+'"><br/>'+
                                           '  <button id="save_pir" style="width:80px;height:24px;">Сохранить</button>'+
                                           '</div></li></ul></div>');
            Bush.set_balance();
            Bush.wakeUp = Math.random() * 20 + 39;
            $('a.button').each(function () {
                if (this.innerHTML === "Захват") Bush.avtypes++;
            });
        }
        Bush.on = true;
        if (!Bush.istime()) {
            window.setTimeout('Bush.init()', 60000);
            console.log('Спим');
            return;
        }
        if (Bush.isMission()) {
            if(Bush.flag == 0)console.log('Чит активирован, но не запущен. Миссия активна. Ждём завершения');
            Bush.flag++;
            window.setTimeout('Bush.init()', 30000);
        } else {
            console.log('Инициация чита');
            Bush.clickPirat();
        }
    },
};

capcher =
    {
    securityCode: "",
    base64img: "",
    captchaID: "",

    doAfterRandom: function (code) {
        window.setTimeout(code, (Math.random() + 1) * 10000);
    },

    getImage: function (adr) {
        var img = adr;
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/jpeg", 0.5);
        dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        return encodeURIComponent(dataURL);
    },

    uploadFile: function () {
        var s = document.getElementsByClassName('captchaImage')[0];
        capcher.base64img = this.getImage(s);
        var base64img = capcher.base64img;
        console.log("начинаю процедуру отправки капчи");
        $.ajax(
            {
                type: 'POST',
                url: 'https://rucaptcha.com/in.php',
                data: 'method=base64&key=' + apikey + '&body=' + base64img + '&json=true&header_acao=1',
                success: function (answer) {
                    if (answer.status && answer.status == 1) {
                        capcher.captchaID = answer.request;
			wrong_buf = capcher.captchaID;
                        capcher.doAfterRandom('capcher.getAnswer()');
                    } else if (answer.status == 0 && answer.request == "ERROR_ZERO_BALANCE") {
                        Bush.act.stop();
                    } else {
                        capcher.act.message(answer.request);
                    }
                },
                error: function (xhr, error) {
                    Bush.act.message("Что-то опять пошло не так...");
                    capcher.doAfterRandom('Bush.uploadFile()');
                }
            });

    },

    getAnswer: function () {
        var captchaId = capcher.captchaID;
        $.ajax(
            {
                type: 'GET',
                url: 'https://rucaptcha.com/res.php',
                data: 'key=' + apikey + '&action=get&id=' + captchaId + "&json=true&header_acao=1",
                success: function (answer) {
                    if (answer.status && answer.status == 1) {
                        capcher.securityCode = answer.request;
                        capcher.act.suc();
                    } else if (answer.status == 0 && answer.request == "CAPCHA_NOT_READY") {
                        capcher.act.message("Не готово, отдохни чутка ©: ");
                        capcher.doAfterRandom('capcher.getAnswer()');
                    } else if (answer.status == 0 && answer.request == "ERROR_CAPTCHA_UNSOLVABLE") {
                        capcher.act.message("Моя не уметь читать такие цифры :( ");
                        $("input.button[value='Захват']").click();
                    }
                },
                error: function (xhr, error) {
                    capcher.act.message("Что-то опять пошло не так... ");
                    capcher.doAfterRandom('capcher.getAnswer()');
                }
            });
    },

    act:
    {
        suc: function () {
            $('input#captcha').val(capcher.securityCode);
            $("input.button[value='Захват']").click();
        },
        message: function (text) {
            console.log(text);
        },
        stop: function () {
            console.log('no money no honey');
        }
    }
};