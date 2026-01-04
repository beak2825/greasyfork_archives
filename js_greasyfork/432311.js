// ==UserScript==
// @name        PetriMod
// @namespace   https://vk.com/petrimod
// @description Мод-пак для Чашки Петри
// @version     2.0
// @author      Anonim
// @include     http://petridish.pw/*
// @run-at      document-start
// @grant       unsafeWindow
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/432311/PetriMod.user.js
// @updateURL https://update.greasyfork.org/scripts/432311/PetriMod.meta.js
// ==/UserScript==

const config = [//True - включено, false - отключено
    true,//Разблокированный зум
    false,//Границы карты
    false,//Интерактивные цвета игроков
    true,//Фиолетовая подсветка твоих сообщений в чате (Цвет можно поменять ниже)
    false,//Удалять рекламу и метрики
    false,//Деление и кормёжка мышью
    true,//Не показывать статистику после игры (Когда тебя съедают)
    true,//Авто-обновление компаса на актуальные координаты из чата, Показ точки компаса на мини-карте
    true,//Исправленая цифра общего онлайна (Вычитаются боты игры)
    false,//Скрытие сообщений с координатами
    true,//По умолчанию скрывать сообщения от "GameInfo Global Message" (рекорды и т.п.)
    false,//Отключение анимационных скинов (Список ников с анимацией анулируется - возможны баги, сообщайте!)
    false,//Отключение квадратных скинов (Список квадратных скинов анулируется - возможны баги, сообщайте!)

    //
    500,//История чата (100 - как у всех, 500 - как у Модеров)

    //Цвет указывать только в таком же формате! (HEX-цвета)
    '#a357eb',//Цвет подсветки в чате (Цвет по умочланию - фиолетовый)
    '#360101',//Цвет границ карты Цвет по умочланию - тёмно-красный)

    //Ниже указаны коды клавиш, чтобы поменять на своё - гугли "коды клавиш javascript"
    81,//(Q) Быстрая кормежка
    82,//(R) Изменить всем цвет на случайный
    83,//(S) Поставить случайный скин
    66,//(B) Изменить свой цвет на случайный
    115//(F4) Быстрый перезаход на сервер
];//После изменения настроек, перезагрузи страницу с игрой!

var p = {};
var m = {
    registerObserver: function() {
        if (typeof(window.WebKitMutationObserver) == 'undefined') return;
        p.observer = new window.WebKitMutationObserver(function(mutationRecords) {
            mutationRecords.forEach(function(mutationRecord) {
                for (var i = 0; i < mutationRecord.addedNodes.length; ++i) {
                    checkNode(mutationRecord.addedNodes[i]);
                }
            });
        });
        p.observer.observe(window.document, {
            subtree: true,
            childList: true,
            attribute: false
        });
    }
};

m.registerObserver();

function checkNode(node) {
    var tag = node.parentElement ? node.parentElement.tagName : "";
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        node.textContent = node.textContent.replaceAll('sizePlot.setValue(ballmass);', 'sizePlot.setValue(1000 > ballmass ? ballmass : "".concat(Math.round(ballmass / 100) / 10, "k"));');
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        node.textContent = node.textContent.replaceAll('playByLocationHash();', '');
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        node.textContent = node.textContent.replaceAll('animationTick++;', 'animationTick++;fps.tick();');
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[2]) {
            node.textContent = node.textContent.replaceAll('//    color = this.color;', 'color = this.color;');
            node.textContent = node.textContent.replaceAll('//       color = "#300A48";', 'color = "#300A48";');
            node.textContent = node.textContent.replaceAll('//     color = "#A020F0";', 'color = "#A020F0";');
            node.textContent = node.textContent.replaceAll('// color = "#3371FF";', '');
            node.textContent = node.textContent.replaceAll('//  color = "#FF3C3C";', 'color = "#FF3C3C";');
            node.textContent = node.textContent.replaceAll('// color = "#FFBF3D";', 'color = "#FFBF3D";');
            node.textContent = node.textContent.replaceAll('// color = "#44F720";', 'color = "#44F720";');
            node.textContent = node.textContent.replaceAll('//color = "#00AA00";', 'color = "#00AA00";');
            node.textContent = node.textContent.replaceAll('//color = "#FFFF00";', 'color = "#FFFF00";');
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[0]) {
            node.textContent = node.textContent.replace(/ > zoom/g, ' > zoom && false');
            node.textContent = node.textContent.replaceAll('if (isFB == 1) { event.preventDefault(); }', 'if (0.1 > zoom) { zoom = 0.1; }\nif (isFB == 0.1) { event.preventDefault(); }');
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[1]) {
            node.textContent = node.textContent.replace(/ function drawBorders(ctx) {/g, ' function drawBorders(ctx) {');
            node.textContent = node.textContent.replaceAll(' function drawBorders(ctx) {', `function drawBorders(ctx) {         ctx.save();
                ctx.beginPath();
                ctx.fillStyle = '${config[15]}';
                ctx.rect(-mapmaxX, -mapmaxY, mapmaxX * 3, mapmaxY);
                ctx.rect(mapmaxX, 0, mapmaxX, mapmaxY * 2);
                ctx.rect(-mapmaxX, 0, mapmaxX, mapmaxY * 2);
                ctx.rect(0, mapmaxY, mapmaxX, mapmaxY);
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#FFFFFF';
                ctx.strokeRect(0, 0, mapmaxX, mapmaxY);
                ctx.restore();`);
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        node.textContent = node.textContent.replace('var chathistory = 100;', `var chathistory = ${config[13]};`);
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        node.textContent = node.textContent.replace(
            'var checkchat = readCookie("ruschat");',
            `if ((GameInfoHide == true) && (escnick.indexOf('***** GameInfo Global Message *****') != -1)) {
                     state = ' style="display:none;" ';
                 }

                 if (blacklistchat.indexOf(Number(chatid)) != -1) {
                     state = ' style="display:none;" ';
                 }

                 var checkchat = readCookie("ruschat");`
        );

        node.textContent = node.textContent.replace(
            "if (chatBoard[len - 1].message.indexOf('**coords:') != -1) {",
            `if (chatBoard[len - 1].message.indexOf('**coords:') != -1) {
                     state = '';
                     if (chatCordiHide) {
                         state = ' style="display:none;" ';
                     }
                `
        );
        node.textContent = node.textContent.replace("<div class='chatenter'>", `<div " + state + " class='chatenter'>`);
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[3]) {
            node.textContent = node.textContent.replace(
                "if (supermods.indexOf(chatnicknoid.toLowerCase()) != -1) {",
                `if ((podcvetka == true) && (chatid == igrokId)) {
                     mod = "style='color:white;background-color:${config[14]};padding:0px 5px;'";
                  }
                  if (supermods.indexOf(chatnicknoid.toLowerCase()) != -1) {`
            );
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[8]) {
            node.textContent = node.textContent.replace(`$("p.online span").html(srs['total']);`, `var total = 0;`);
            node.textContent = node.textContent.replace(
                /\$\("#now" \+ sern \+ ", #likednow" \+ sern\).html\(cura\);\n\s+}/,
                `let el = $("#now" + sern + ", #likednow" + sern).html(cura)[0];
                    if ((typeof el != 'undefined') && (/^arena\d+/i.test(sern) == false)) {total = total+cura;};};
            var botiki = (20+25+10+20+33+10+10+10+10+10+10+10+30+25+10+30+100+25+20+15+25+17+17+27+27+15+20+15+5+30+5+50+5);
            $("p.online span").html(total-botiki);`
            );
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[7]) {
            node.textContent = node.textContent.replace(`setCompas("`, `setCompas(" + chatid + ", " `);
            node.textContent = node.textContent.replace(`setCompas(posX,posY)`, `setCompas(chatid, posX, posY)`);
            node.textContent = node.textContent.replace(
                `$("#kompasx").val(posX);`,
                `kompasId = chatid;kompasPosX = posX;kompasPosY = posY;$("#kompasposition").css("display", "block");$("#kompasx").val(posX);`
            );
            node.textContent = node.textContent.replace(
                `if (Yhere < 0) { Yhere = 0; }`,
                `if (Yhere < 0) { Yhere = 0; };if (chatid == kompasId) { setCompas(chatid, Xhere, Yhere); };`);
            node.textContent = node.textContent.replace(
                `$("div.map-header .coords").html(bbuuX + '.' + bbuuY);`,
                `$("div.map-header .coords").html(bbuuX + '.' + bbuuY);
                 if ((kompasPosX > 0) || (kompasPosY > 0)) {
                    var kompasX = ~~(kompasPosX / maxX * 100);
                    var kompasY = ~~(kompasPosY / maxY * 100);
                    $("#kompasposition").css("top", kompasY+ "%").css("left", kompasX+"%");
                 }
                 `);
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        node.textContent = node.textContent.replaceAll(`sendChat("***playerenter***");`, `sendChat("***playerenter***");lovimIgrokId = true;`);
        node.textContent = node.textContent.replaceAll(`chatBoard.push({`, `let nick = getString();let msg = getString();chatBoard.push({`);
        node.textContent = node.textContent.replaceAll(`"name": getString(),`, `"name": nick, `);
        node.textContent = node.textContent.replaceAll(`"message": getString(),`, `"message": msg, `);
        node.textContent = node.textContent.replaceAll(
            `if (window.currentStatus != 'secret') {`,
            `var iddlina = nick.indexOf(")") - 1;
              var chatid = Number(nick.substr(1, iddlina));
              if ((lovimIgrokId == true) && (msg == '***playerenter***')) {
                  igrokId = chatid;
                  lovimIgrokId = false;
              }
              if (window.currentStatus != 'secret') {`
        );
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        node.textContent = node.textContent.replace(/[ \S]+old-design-ru[ \S]+/ig, '');
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[4]) {
            if (node.textContent.indexOf('www.acint.net/aci.js') != -1) {
                node.remove();
            }
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[4]) {
            if ((node.src == 'https://mc.yandex.ru/metrika/watch.js') || (node.textContent.indexOf('https://mc.yandex.ru/metrika/watch.js') != -1)) {
                node.remove();
            }
        }
    }
    if (tag == "NOSCRIPT" || node.tagName == "NOSCRIPT") {
        if (config[4]) {
            if (node.textContent.indexOf('https://mc.yandex.ru/watch/') != -1) {
                node.remove();
            }
        }
    }
    if (tag == "SCRIPT" || node.tagName == "SCRIPT") {
        if (config[4]) {
            if ((node.textContent.indexOf('adsbygoogle') != -1) || (typeof node.src != 'undefined' && node.src.indexOf('adsbygoogle') != -1)) {
                node.remove();
            }
        }
    }
    if (tag == "INS" || node.tagName == "INS") {
        if (config[4]) {
            node.remove();
        }
    }
    if (tag == "IFRAME" || node.tagName == "IFRAME") {
        if (config[4]) {
            if ((typeof node.src != 'undefined') && (node.src == 'https://www.youtube.com/embed/Ye0XkOKxM4w')) {
                node.remove();
            }
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function(event) {
    p.observer.disconnect();

    const win = unsafeWindow;

    win.igrokId = 0;
    win.lovimIgrokId = false;

    win.kompasId = 0;
    win.kompasPosX = 0;
    win.kompasPosY = 0;

    win.podcvetka = config[3];

    if (config[11]) {
        win.animated = [];
    }
    if (config[12]) {
        win.squareskins = [];
    }

    $('#twrbutton').hide();
    $('#how').hide();

    var fpsDiv = document.createElement('div');
    fpsDiv.id = 'fps'
    fpsDiv.style = 'font-size: 18px;color: #50f500;position: absolute;right: 200px;bottom: 10px;'
    fpsDiv.textContent = '0';
    $("#map").before(fpsDiv);

    setInterval(function () {
        if (fps.value > 0 && fps.value < 61) {
            document.getElementById("fps").textContent = fps.value;
        }
    }, 120);

    var span = document.createElement('span');
    span.id = 'kompasposition'
    span.style = 'background:red;display:none;'
    span.className = 'round blue';
    $("#map > .map-container").append(span);

    var li = document.createElement('li');
    li.title = 'Отображение координат в чате';
    li.innerHTML = '<label><input type="checkbox" id="chatCordi" onchange="chatCordiFunc();" checked="checked"><i class="mdi mdi-target mdi-18px"></i></label>';
    $("#chat > .chat-header > ul").append(li);

    var li2 = document.createElement('li');
    li2.title = 'Отображение сообщений от "GameInfo Global Message" (рекорды и т.п.)';
    li2.innerHTML = '<label><input type="checkbox" id="GameInfo" onchange="GameInfoFunc();" checked="checked"><i class="mdi mdi-message-bulleted mdi-18px"></i></label>';
    $("#chat > .chat-header > ul").append(li2);

    var li3 = document.createElement('li');
    li3.title = 'Отображение входов в чате';
    li3.innerHTML = '<label><input type="checkbox" id="chatVxodi" onchange="chatVxodiFunc();" checked="checked"><i class="mdi mdi-login mdi-18px"></i></label>';
    $("#chat > .chat-header > ul").append(li3);
    chatenter.closest('li').remove();

    var nikigroka = readCookie("playername");
    var chatwelcome = $('.chatwelcome').html();
    var newchatwelcome = chatwelcome.replace(/https.*Google Play/ig, 'Добро пожаловать!<br>Новости и обновления PetriMod в группе ВК: <a target="_blank" href="https://vk.com/petrimod">https://vk.com/petrimod</a>');
    $('.chatwelcome').html(newchatwelcome);

    win.chatCordiHide = config[9];
    if (config[9]) {
        $("#chatCordi").removeAttr("checked");
        win.document.getElementById('chatCordi').nextSibling.style.opacity = '0.5';
    }

    win.GameInfoHide = config[10];
    if (config[10]) {
        $("#GameInfo").removeAttr("checked");
        win.document.getElementById('GameInfo').nextSibling.style.opacity = '0.5';
    }

    if (readCookie('chatenter') == 'false') {
        $("#chatVxodi").removeAttr("checked");
        win.document.getElementById('chatVxodi').nextSibling.style.opacity = '0.5';
    }
    else {
        $("#chatVxodi").attr("checked","checked");
        win.document.getElementById('chatVxodi').nextSibling.style.opacity = '1';
    }

    win.chatCordiFunc = function(e) {
        var el = document.querySelectorAll('#chatlog > div');
        if ($("#chatCordi").prop('checked') == true) {
            $("#chatCordi").attr("checked","checked");
            win.chatCordiHide = false;
            win.document.getElementById('chatCordi').nextSibling.style.opacity = '1';

            for (let elem of el) {
                if (elem.innerHTML.indexOf('title="Player Coords"') != -1) {
                    elem.style.display = 'block';
                }
            }
        }
        else {
            $("#chatCordi").removeAttr("checked");
            win.chatCordiHide = true;
            win.document.getElementById('chatCordi').nextSibling.style.opacity = '0.5';

            for (let elem of el) {
                if (elem.innerHTML.indexOf('title="Player Coords"') != -1) {
                    elem.style.display = 'none';
                }
            }
        }
    }

    win.GameInfoFunc = function(e) {
        var el = document.querySelectorAll('#chatlog > div');
        if ($("#GameInfo").prop('checked') == true) {
            $("#GameInfo").attr("checked","checked");
            win.GameInfoHide = false;
            win.document.getElementById('GameInfo').nextSibling.style.opacity = '1';

            for (let elem of el) {
                if (elem.innerHTML.indexOf('***** GameInfo Global Message *****') != -1) {
                    elem.style.display = 'block';
                }
            }
        }
        else {
            $("#GameInfo").removeAttr("checked");
            win.GameInfoHide = true;
            win.document.getElementById('GameInfo').nextSibling.style.opacity = '0.5';

            for (let elem of el) {
                if (elem.innerHTML.indexOf('***** GameInfo Global Message *****') != -1) {
                    elem.style.display = 'none';
                }
            }
        }
    }

    win.chatVxodiFunc = function(e) {
        var el = document.querySelectorAll('#chatlog > div');
        createCookie('chatenter', $("#chatVxodi").is(':checked'), 999);
        var chatenter = readCookie("chatenter");
        if (chatenter == null) {
            $("#chatVxodi").removeAttr("checked");
            for (let elem of el) {
                if ((elem.className == 'chatenter') && (elem.innerHTML.indexOf('title="Player Coords"') == -1)) {
                    elem.style.display = 'none';
                }
            }
        }
        if (chatenter == 'true') {
            win.document.getElementById('chatVxodi').nextSibling.style.opacity = '1';
            $("#chatVxodi").attr("checked","checked");
            for (let elem of el) {
                if ((elem.className == 'chatenter') && (elem.innerHTML.indexOf('title="Player Coords"') == -1)) {
                    elem.style.display = 'block';
                }
            }
            $("#chatlog").scrollTop(500000);
        }
        if (chatenter == 'false') {
            win.document.getElementById('chatVxodi').nextSibling.style.opacity = '0.5';
            $("#chatVxodi").removeAttr("checked");
            for (let elem of el) {
                if ((elem.className == 'chatenter') && (elem.innerHTML.indexOf('title="Player Coords"') == -1)) {
                    elem.style.display = 'none';
                }
            }
        }
    }

    var banSkinov = document.createElement ('div');
    banSkinov.innerHTML = `
        <div id="ban-skinov" class="ban-skinov"><div class="ban-skinov-w">
        <div class="ban-skinov-i"><div class="ban-skinov-h">
        <h3 class="ban-skinov-t">Блокировка скинов</h3>
        <span class="ban-skinov-c" id="zabanitbskinclose">×</span></div>
        <div id="spisokskinov"></div></div></div></div>
        <style>
        .ban-skinov{background:rgba(0,0,0,0.7);pointer-events:none;position:fixed;
        top:0;right:0;bottom:0;left:0;z-index:9999;transition:all .5s ease;margin:0;padding:0;opacity:0}
        .ban-skinov:target{opacity:1;pointer-events:auto;overflow-y:auto}
        .ban-skinov-w{margin:auto;margin-top:60px;margin-bottom:20px}
        .ban-skinov-i{position:relative;border:1px solid;border-color:red;border-radius:25px}
        .ban-skinov-h{padding:15px;position:relative}
        .ban-skinov-t{text-align:center;font-size:18px;color:#555;
        font-weight:700;line-height:1.5;margin-top:0;margin-bottom:0}
        .ban-skinov-c{position:absolute;top:4px;right:12px;font-size:28px;color:red;text-decoration:none}
        .ban-skinov-c:focus,.ban-skinov-c:hover{color:red;cursor:pointer}
        div#ban-skinov img{background-color:#dc3f3f;cursor:pointer;border:2px solid;
        border-color:red;border-radius:50%;width:128px;height:128px;margin:8px}
        @media (min-width:550px) {.ban-skinov-w{max-width:890px}}
        </style>
        `;
    document.body.appendChild(banSkinov);

    var divIkonka = document.createElement('div');
    divIkonka.id = 'zabanitbskinopen';
    divIkonka.title = 'Скрыть определённый скин';
    divIkonka.className = 'button no-hover round opacity';
    divIkonka.innerHTML = `<i class="mdi mdi-delete-circle mdi-24px"></i>`;
    $('#sun').after(divIkonka);

    $( "#zabanitbskinopen" ).click(function() {
        var ujeDobavleno = [];
        var HTML = '';
        for (var key in playerSkins) {
            if ((playerSkins[key] != 0) && (ujeDobavleno.indexOf(playerSkins[key]) == -1)) {
                ujeDobavleno.push(playerSkins[key]);
                HTML = HTML+'<img src="http://petridish.pw/engine/serverskins/'+playerSkins[key]+'.png" onclick="zabanitbSkin('+key+');this.remove();">';
            }
        }
        document.getElementById('spisokskinov').innerHTML = HTML;

        if (ujeDobavleno.length) {
            win.location.hash = '#ban-skinov';
        }
        else if (skinsspisok.length) {
            alert("Ты уже перебанил всех!");
        }
    });
    $( "#zabanitbskinclose" ).click(function() {
        win.location.hash = '#'+win.currentStatus;
    });

    var skinsspisok = [];
    setInterval(function () {
        if (skinsspisok.length < 1) return;
        for (var key in playerSkins) {
            if (skinsspisok.indexOf(playerSkins[key]) != -1) {
                playerSkins[key] = 0;
            }
        }
    }, 5000);

    win.zabanitbSkin = function(ID) {
        alert("Скин "+playerSkins[ID]+" скрыт в игре до перезагрузки страницы!");
        skinsspisok.push(playerSkins[ID]);
        playerSkins[ID] = 0;
    }

    var feeding = false;
    var wDown = $.Event("keydown", { keyCode: 87});
    var wUp = $.Event("keyup", { keyCode: 87});
    var interval = null;
    var splitdown = $.Event("keydown", { keyCode: 32});
    var splitup = $.Event("keyup", { keyCode: 32});

    $(document).bind('mousedown', function(e){
        if ((isTyping == false) && config[5]) {
            if (e.which == 1) {
                clearInterval(interval);
                feeding = true;
                setTimeout(function () {
                    clearInterval(interval);
                    if (feeding) {
                        interval = setInterval(function () {
                            $("body").trigger(wDown);
                            $("body").trigger(wUp);
                        }, 0);
                    }
                }, 150);
            }
            if (e.which == 3) {
                $("body").trigger(splitdown);
                $("body").trigger(splitup);
            }
        }
    }).bind('mouseup', function(e){
        if (config[5]) {
            if (e.which == 1) {
                feeding = false;
                clearInterval(interval);
            }
        }
    }).bind('keydown', function(e){
        if ((e.keyCode == config[16]) && (isTyping == false)) {
            $("body").trigger(wDown);
            $("body").trigger(wUp);
        }
        if ((e.keyCode == config[17]) && (isTyping == false)) {
            var key = null;
            for (key in win.playerColorIndexes) {
                if (key != igrokId) {
                    win.playerColorIndexes[key] = randomnumber(127);
                }
            }
            win.fly('Рандомные цвета!');
        }
        if ((e.keyCode == config[18]) && (igrokId > 0) && (isTyping == false)) {
            win.playerSkins[igrokId] = randomnumber(333333);
            win.fly('Рандомный скин!');
        }
    }).bind('keyup', function(e){
        if ((e.keyCode == config[19]) && (isTyping == false)) {
            win.playercolor = randomnumber(127);
            sendCol();
            win.fly('Рандомный цвет!');
        }
        if (e.keyCode == config[20]) {
            win.socketaddr = '';
            $('#newplaybutton').click();
        }
    });

    $('canvas').bind('contextmenu', function(e){
        e.preventDefault();
    });

    if (config[6]) {
        var targetNode = document.getElementById('endgameoverlay');
        var observer = new MutationObserver(function(){
            if (targetNode.style.display != 'none') {
                win.$('#endgameoverlay, #gameoverlay').hide();
                win.jQuery('#specbutton').show();
                win.setSpectate(true);
                win.setUnlimitedZoom(true);
                win.startthegame();
                win.sp(1);
                win.performFullHide();
                win.fly('ПОТРАЧЕНО!))');
            }
        });
        observer.observe(targetNode, { attributes: true, childList: true });
    }


    win.blacklistchat = [];
     var chatobserver = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            for (var node of mutation.addedNodes) {
                if (node.matches('ul.chat-context-menu')) {
                    var text = 'Заблокировать';
                    var playerID = Number(node.dataset.chatId);
                    if (blacklistchat.indexOf(playerID) != -1) { text = 'Разблокировать'; }
                    node.appendChild($(`<li><a onclick="blacklistchatFunc(${playerID})">${text}</a></li>`)[0]);
                }
            }
        }
    });
    chatobserver.observe(document.body, { childList: true });

    win.blacklistchatFunc = function (playerID) {
        var index = blacklistchat.indexOf(playerID);
        if (index != -1) {
            blacklistchat.splice(index, 1);
        }
        else {
            blacklistchat.push(playerID);
        }
    }


    function randomnumber(max) {
        return Math.floor(Math.random() * max);
    }
});

unsafeWindow.fps = {
    sampleSize : 60,
    value : 0,
    _sample_ : [],
    _index_ : 0,
    _lastTick_: false,
    tick : function(){
        // if is first tick, just set tick timestamp and return
        if( !this._lastTick_ ){
            this._lastTick_ = performance.now();
            return 0;
        }
        // calculate necessary values to obtain current tick FPS
        let now = performance.now();
        let delta = (now - this._lastTick_)/1000;
        let fps = 1/delta;
        // add to fps samples, current tick fps value
        this._sample_[ this._index_ ] = Math.round(fps);

        // iterate samples to obtain the average
        let average = 0;
        for(var i=0; i<this._sample_.length; i++) average += this._sample_[ i ];

        average = Math.round( average / this._sample_.length);

        // set new FPS
        this.value = average;
        // store current timestamp
        this._lastTick_ = now;
        // increase sample index counter, and reset it
        // to 0 if exceded maximum sampleSize limit
        this._index_++;
        if( this._index_ === this.sampleSize) this._index_ = 0;
        return this.value;
    }
}