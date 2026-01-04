// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://bubble.am/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30710/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/30710/New%20Userscript.meta.js
// ==/UserScript==

(function (d, e) {
    // javascript: $.getScript('https://dl.dropboxusercontent.com/s/3rvzi0228l8xwbs/jeba%C4%87.js?dl=0')
    function getCredentials(cb) {
        var xhr = new XMLHttpRequest;
        xhr.onload = function () {
            var result;
            if (result = xhr.response.match(/user_hash = '(.*)'/)) {
                cb(result[1], xhr.response.match(/player_id = (\d+)/)[1])
            } else {
                console.log('error');
            }
        }
        xhr.open('GET', 'http://bubble.am/');
        xhr.send();

    }
    getCredentials(function (user_hash, player_id) {


        var bubLogged = false;
        var dntt = true;
        var lastacti = Date.now();
        var player_id = player_id;
        var bubsrv = 'ws://sck.bubble.am:81';

        setTimeout(function () {
            bConnect(bubsrv);
        }, 1000);

        var bsocket;
        var sent2battle = false;
        var battlec = false;
        var notiBoard = [];
        var friends;
        var idleState = false;
        var idleTimer = null;


        var canv = document.querySelector('#canvas');
        var time = 0;
        canv.insertAdjacentHTML('afterend', '<div id="timerXXX" style="position: absolute;left: 180px;font-size: 34px;color: #00ac7e;top: 3px;">' + parseInt(time / 60) + ':' + parseInt(time % 60) + '</div>');
        var stoper;
        class Timer {
            constructor() {
                this.currentTime = 0;
                this.isStarted = false;
            }
            start() {
                var self = this;
                if (!this.isStarted) {
                    stoper = setInterval(function () {
                        self.currentTime++;
                        self.updateStoper()
                    }, 1000);
                    this.isStarted = true;
                }
            }
            stop() {
                if (this.isStarted) {
                    clearInterval(stoper);
                    this.isStarted = false;
                }
            }
            updateStoper() {
                var time = this.currentTime;
                document.querySelector('#timerXXX').innerHTML = '<div>' + parseInt(time / 60) + ':' + parseInt(time % 60) + '</div>';
            }
        }
        var timer = new Timer();


        d.bubbleSend = bubbleSend;
        d.isBubLogged = function () {
            return bubLogged;
        }
        d.myFriends = function () {
            return friends;
        }

        d.lastUserAct = function lastusract() {
            return parseInt((Date.now() - lastacti) / 1000);
        }

        d.liveBattles = function (b) {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(2);
                msg.setUint8(0, 97);
                msg.setUint8(1, b);
                bubSend(msg);
            }
        }

        d.createBattleServer = function (mode) {
            if (bubbleRunning() && isBubLogged()) {
                e('#playBtn').toggleClass('active').prop('disabled', true);
                e('#tournament-modal table.chat-table').html('');
                var msg = dtview(3);
                var mRegion = e("#region").val();
                switch (mRegion) {
                    case "4":
                        mRegion = 4;
                        break;
                    default:
                        mRegion = 1;
                }
                msg.setUint8(0, 98);
                msg.setUint8(1, parseInt(mode));
                msg.setUint8(2, mRegion);
                bubSend(msg);
            } else {
                alert('Battle mode is not available. Please try again later.');
                e('#playBtn').prop('disabled', false);
            }
        }
        d.getModeName = function getModeName(id, chk) {
            var srvname = '';
            if (typeof chk == 'undefined' && id.substr(0, 1) == ':') id = id.substr(1);
            id = parseInt(id);
            switch (id) {
                case 0:
                    srvname = 'FFA - 1x';
                    break;
                case 1:
                    srvname = 'Teams';
                    break;
                case 2:
                    srvname = 'Experimental';
                    break;
                case 3:
                    srvname = 'Teams HC';
                    break;
                case 5:
                    srvname = 'FFA - MegaSplit';
                    break;
                case 7:
                    srvname = 'FFA - hardcore';
                    break;
                case 8:
                    srvname = 'FFA - no teams';
                    break;
                case 9:
                    srvname = 'FFA 5x';
                    break;
                case 10:
                    srvname = 'Tournament';
                    break;
                case 11:
                    srvname = '2 vs 2';
                    break;
                case 12:
                    srvname = '1 vs 1';
                    break;
                case 13:
                    srvname = 'Test Server';
                    break;
                default:
                    srvname = 'n/a';
            }
            return srvname;
        }
        d.onmousedown = function (a) {
            if (logged == true) {
                lastacti = Date.now();
                checkua();
            }
        }
        d.onmousemove = function (a) {
            lastacti = Date.now();
        };
        d.playsound = function playsound(mp3) {
            e('#audiomp3').remove();
            setTimeout(function () {
                e('body').append('<audio id="audiomp3" autoplay><source src="/sounds/' + mp3 + '" type="audio/mpeg"></audio>');
            }, 500);
        }

        function checkua() {
            if (idleState == true) {
                idleState = false;
                if (!bubbleRunning()) {
                    bConnect(bubsrv);
                }
            } else {
                clearTimeout(idleTimer);
                idleTimer = setTimeout(function () {
                    idleState = true;
                    if (bubbleRunning()) {
                        bsocket.close();
                    }
                }, 3600 * 1000);
            }
        }

        function bConnect(a) {
            if (bsocket) {
                bsocket.onopen = null;
                bsocket.onmessage = null;
                bsocket.onclose = null;
                try {
                    bsocket.close()
                } catch (c) {}
                bsocket = null
            }
            bsocket = new WebSocket(a);
            bsocket.binaryType = "arraybuffer";
            bsocket.onopen = function () {
                console.log("WS Open: " + a);
                bubbleLogin(user_hash);

            };
            bsocket.onclose = function () {
                bubLogged = false;
                e('.showFriends').prop('disabled', true);
                e('.friends-online').hide();
                ftabledefault(false);
                e('.modal').modal('hide');
                if (dntt && idleState == false) {
                    var min = 4;
                    var max = 20;
                    var random = Math.floor(Math.random() * (max - min + 1)) + min;

                    console.log("WS closed. Trying to reconnect in " + random + " seconds..");
                    setTimeout(function () {
                        bConnect(bubsrv);
                    }, random * 1000);
                }
            }
            bsocket.onmessage = bubbleMessage;
            bsocket.onerror = function () {
                bubLogged = false;
                e('.showFriends').prop('disabled', true);
                console.log("WebSocket error")
            }
        }

        function bubParm(a, b) {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(3);
                b = parseInt(b);
                msg.setUint8(0, 9);
                msg.setUint8(1, a);
                msg.setUint8(2, b);
                bubSend(msg);
            }
        }

        function bubbleLogin(login) {
            if (bubbleRunning()) {
                var msg = dtview(1 + 2 * login.length);
                var offset = 0;
                msg.setUint8(offset++, 2);
                for (var i = 0; i < login.length; ++i) {
                    msg.setUint16(offset, login.charCodeAt(i), true);
                    offset += 2;
                }
                bubSend(msg);
            }
        }

        function bubbleSetOnline(v) {
            if (bubbleRunning() && isBubLogged()) {
                v = Boolean(v);
                var msg = dtview(2);
                msg.setUint8(0, 4);
                msg.setUint8(1, v);
                bubSend(msg);
            }
        }

        d.bLeave = function () {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(1);
                msg.setUint8(0, 6);
                bubSend(msg);
            }
        }

        d.bKick = function (pID) {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(5);
                msg.setUint8(0, 10);
                msg.setUint32(1, pID)
                bubSend(msg);
            }
        }

        d.bStart = function (id) {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(1);
                msg.setUint8(0, 7);
                bubSend(msg);
                return true;
            } else return false;
        }

        d.bInvA = function (bID) {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(5);
                msg.setUint8(0, 11);
                msg.setUint32(1, bID);
                bubSend(msg);
            }
        }

        function bStartConf() {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(1);
                msg.setUint8(0, 8);
                bubSend(msg);
                return true;
            } else return false;
        }

        d.cInvite = function (id, accepted) {
            if (bubbleRunning() && isBubLogged()) {
                var msg = dtview(7);
                accepted = Boolean(accepted);

                msg.setUint8(0, 3);
                msg.setUint32(1, id);
                msg.setUint8(5, accepted);
                bubSend(msg);
            }
        }

        function timeDifference(previous) {

            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;

            var elapsed = Date.now() - previous;

            if (elapsed < msPerMinute) {
                return Math.round(elapsed / 1000) + ' sekund/y temu';
            } else if (elapsed < msPerHour) {
                return Math.round(elapsed / msPerMinute) + ' minut/y temu';
            } else if (elapsed < msPerDay) {
                return Math.round(elapsed / msPerHour) + ' godzin/y temu';
            } else if (elapsed < msPerMonth) {
                return 'approximately ' + Math.round(elapsed / msPerDay) + ' days temu';
            } else if (elapsed < msPerYear) {
                return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months temu';
            } else {
                return 'approximately ' + Math.round(elapsed / msPerYear) + ' years temu';
            }
        }
        d.bubbleBattleChat = function bubbleBattleChat(str) {
            if (bubbleRunning() && isBubLogged() && (str.length < 100) && (str.length > 0)) {
                var msg = dtview(1 + 2 * str.length);

                msg.setUint8(0, 5);
                var offset = 1;
                for (var i = 0; i < str.length; ++i) {
                    msg.setUint16(offset, str.charCodeAt(i), true);
                    offset += 2;
                }
                bubSend(msg);
            }
        }

        function bubbleSend(sendto, str) {
            if (bubbleRunning() && isBubLogged() && (str.length < 100) && (str.length > 0)) {
                var msg = dtview(6 + (2 * str.length));

                msg.setUint8(0, 99);
                msg.setUint32(1, sendto);

                var offset = 6;
                for (var i = 0; i < str.length; ++i) {
                    msg.setUint16(offset, str.charCodeAt(i), true);
                    offset += 2;
                }
                bubSend(msg);
            }
        }

        function ftabledefault(battle) {
            if (!battle) e('#friends-view-modal-data h2').show();
            if (!battle) e('#friends-view-modal-data table').html('');
            if (!battle) e('#tournament-modal .tournament-invite').html('');
            if (battle) e('#tournament-modal .tournament-players').html('');
        }

        function displayFriends(friends, battle, leader) {
            function tableFriends(friends, battle) {
                ftabledefault(battle);
                if (friends.length > 0) {
                    if (!battle) e('#friends-view-modal-data h2').hide();
                    for (var i = 0; i < friends.length; i++) {
                        var c = JSON.parse(friends[i].c);
                        if (battle) {
                            var appendTr = '<tr><td style="text-align: left; width: 15%;">' +
                                '<span class="img-circle friends-circle" style="background-color:rgba(' + c.r + ',' + c.g + ',' + c.b + ',0.7);">' +
                                friends[i].n.substr(0, 1).toUpperCase() + '</span></td>' +
                                '<td style="width:65%">' + friends[i].n + '</td>';

                            var ds1 = friends[i].r;
                            if (ds1.length > 0) {
                                ds1 = ds1.split('=');
                                var pe12 = parseInt(ds1[0]) / (parseInt(ds1[0]) + parseInt(ds1[1])) * 100;
                                if (pe12 > 40 && parseInt(ds1[0]) > 5) {
                                    ds1 = '<span style="color:' + (pe12 > 50 ? 'green' : 'orange') + ';">' + parseInt(pe12) + '%</span>';
                                } else {
                                    ds1 = '';
                                }
                            }
                            appendTr += '<td>' + ds1 + '</td>';
                            if (player_id == leader && friends[i].i != leader) {
                                appendTr += '<td style="text-align:right;cursor:pointer;" class="text-muted"><i class="fa fa-ban" aria-hidden="true" onClick="bKick(' + friends[i].i + '); $(this).remove();"></i></td>';
                            } else appendTr += '<td></td>';

                            appendTr += '</tr>';

                        } else {
                            var appendTr = '<tr class="inviteplayer_' + friends[i].i + '" data-player="' + friends[i].i + '"><td style="text-align: left; width: 15%;"><span class="img-circle friends-circle" style="background-color:rgba(' + c.r + ',' + c.g + ',' + c.b + ',0.7);">' + friends[i].n.substr(0, 1).toUpperCase() + '</span></td><td style="width:65%">' + friends[i].n + '</td><td style="width:10%;text-align:center;">' + friends[i].p + '</td><td style="width:10%;" class="center d-online nHo" title="Online">' + (friends[i].s > 0 ? ' Battle' : gIcon(friends[i].o)) + '</td></tr>';

                        }
                        if (!battle) {
                            //if(friends[i].s < 0) {
                            e('#friends-view-modal-data table').append(appendTr);
                            e('#tournament-modal .tournament-invite').append(appendTr);
                            //}
                        } else {
                            e('#tournament-modal table.tournament-players').append(appendTr);
                        }
                    }
                }
            }
            //e('.showFriends').click();
            tableFriends(friends, battle);
        }

        function bubbleMessage(a) {
            if (typeof a.data === 'string') {
                var drb = JSON.parse(a.data);
                if (typeof drb.friends != 'undefined') {
                    displayFriends(drb.friends, false);
                } else if (typeof drb.ffs != 'undefined') {
                    var pis = e(".inviteplayer_" + drb.ffs.i);
                    if (pis.length > 0) {
                        if (typeof drb.ffs.offline != 'undefined') {
                            pis.remove();
                            if (e('#friends-view-modal-data tr').length == 0) {
                                e('#friends-view-modal-data h2').show();
                            }
                        }
                        if (typeof drb.ffs.online != 'undefined') pis.children('.d-online').html(gIcon(drb.ffs.online));
                        if (typeof drb.ffs.server != 'undefined')
                            if (drb.ffs.server > 0) {
                                pis.children('.d-online').html('2v2');
                                pis.prop('disabled', true).addClass('tr-disabled');
                            } else {
                                pis.children('.d-online').html(gIcon(false));
                                pis.prop('disabled', false).removeClass('tr-disabled');
                            }
                    } else if (typeof drb.ffs.new != 'undefined') {
                        e('#friends-view-modal-data h2').hide();
                        var c = JSON.parse(drb.ffs.new.c);
                        var appendTr = '<tr class="inviteplayer_' + drb.ffs.new.i + '" data-player="' + drb.ffs.new.i + '"><td style="text-align: left; width: 15%;"><span class="img-circle friends-circle" style="background-color:rgba(' + c.r + ',' + c.g + ',' + c.b + ',0.7);">' + drb.ffs.new.n.substr(0, 1).toUpperCase() + '</span></td><td style="width:65%">' + drb.ffs.new.n + '</td><td style="width:10%;text-align:center;">' + drb.ffs.new.p + '</td><td style="width:10%;" class="center d-online nHo" title="Online">' + (drb.ffs.new.s > 0 ? '2v2' : gIcon(drb.ffs.new.o)) + '</td></tr>';
                        e('#friends-view-modal-data table, #tournament-modal .tournament-invite').append(appendTr);
                    }
                } else if (typeof drb.leader != 'undefined') {
                    switch (drb.status) {
                        case 0:
                            e('.battle-srvstatus').html('Oczekiwanie');
                            break;
                        case 1:
                            e('.battle-srvstatus').html('Szukanie serwera gry');
                            break;
                        case 2:
                            e('.battle-srvstatus').html('Przygotowanie gry');
                            break;
                        case 3:
                            e('.battle-srvstatus').html('ĹÄczenie z grÄ!');
                            break;

                    }
                    if (drb.status == 3 && sent2battle == false && (drb.ip + currentMode()) == srvInfo()) {
                        if (lastUserAct() > 5) playsound('connected.mp3');
                        console.log('move to battle server');
                        setNick('yo');
                        hideOverlay();
                        e('.modal').modal('hide');
                        sent2battle = true;
                    } else if (drb.status !== 3) {
                        if (drb.status == 2 && battlec == false && drb.ip.length > 0) {
                            connect('ws://' + drb.ip, 1, drb.id);
                            battlec = true;
                        }
                        if (drb.status !== 2) battlec = false;
                        sent2battle = false;
                        if (!e('#tournament-modal').hasClass('in')) {
                            e('#tournament-modal').modal({
                                keyboard: false,
                                backdrop: 'static'
                            });
                        }

                        if (player_id == drb.leader) {
                            e("#button-start-battle, #i8DN").show();
                            if (!e("#button-start-battle").hasClass('active')) e('#button-start-battle').prop('disabled', false);
                        } else {
                            e("#button-start-battle").hide();
                        }

                        if (drb.online < drb.max) {
                            e('#button-start-battle').prop('disabled', true).removeClass('active');
                            e('.tournament-invite').find("tr").prop('disabled', false).css('opacity', 1);
                        } else {
                            e('.tournament-invite').find("tr").prop('disabled', true).css('opacity', 0.3);
                        }

                        e('#tournament-modal').attr("data-battleid", "" + drb.id + "");
                        //e('#tournament-modal .modal-title span').text(drb.id);
                        // count time created
                        //e('.battle-created').text(timeDifference(drb.created));
                        switch (drb.region) {
                            case 3:
                                drb.region = 'North & South America';
                                break;
                            case 4:
                                drb.region = 'Oceania';
                                break;
                            default:
                                drb.region = 'Europe';
                        }
                        e('.battle-region').text(drb.region);
                        e('.battle-servers').html(drb.servers);

                        if (!isNaN(drb.mode)) {
                            e('.battle-mode').text(getModeName(drb.mode, 1));
                            if (drb.mode == 12) {
                                e('.battle-reward').text('rank * 0.5 pt.');
                                e('.battle-defeated').text('rank *  0.25 pt. ');
                                e('#battleNotify').show();
                                e('#battleNotify11').hide();
                                e("#i8DN").hide();
                            } else {
                                if (player_id == drb.leader && drb.f == true) {
                                    e("#i8DN").show();
                                } else e("#i8DN").hide();
                                e('.battle-reward').text('1.0 pt.');
                                e('.battle-defeated').text('-0.5 pt.');
                                e('#battleNotify').hide();
                                e('#battleNotify11').show();
                            }
                        }
                        // players online num
                        e('.battle-online').text(drb.online + '/' + drb.max);
                        //put users to players tournament table
                        displayFriends(drb.data, true, drb.leader);
                        // add chat
                        if (drb.chat.length > 0) {
                            e('#tournament-modal table.chat-table').html('');
                            for (var i = 0; i < drb.chat.length; i++) {
                                var c = JSON.parse(drb.chat[i].c);
                                e('#tournament-modal table.chat-table').append('<tr><td><strong style="color:rgb(' + c.r + ',' + c.g + ',' + c.b + ');">' + drb.chat[i].u + '</strong>: ' + htmlspecialchars(drb.chat[i].m) + '</td></tr>');

                            }
                        }
                    }
                    //console.log(drb);	
                }

            } else {
                readPacket(new DataView(a.data))
            }
        }

        function readPacket(a) {
            function b() {
                for (var b = "";;) {
                    var d = a.getUint16(c, !0);
                    c += 2;
                    if (0 == d) break;
                    b += String.fromCharCode(d)
                }
                return b
            }
            var c = 0;
            if (240 == a.getUint8(c)) {
                c += 5;
            }
            switch (a.getUint8(c++)) {
                case 2:
                    dat = a.getUint8(c, true);
                    bubLogged = dat;
                    if (bubLogged == 1) {
                        bubParm(0, e('#check_Notify').is(':checked') ? 1 : 0);
                        bubParm(1, parseInt(e("#region").val()));
                        bubParm(2, e('#check_Notify11').is(':checked') ? 1 : 0);
                        e('.showFriends').prop('disabled', false);
                    } else if (bubLogged == 2) {
                        dntt = false;
                        bsocket.close();
                    }
                    break;
                case 98:
                    manageNotifi(a, c);
                    break;
                case 99:
                    if (lastUserAct() > 10) alert_audio.play();
                    bubbleChat(a, c);
                    break;
            }
        }

        function manageNotifi(view, offset) {
            function getString() {
                var text = '',
                    char;
                while ((char = view.getUint16(offset, true)) != 0) {
                    offset += 2;
                    text += String.fromCharCode(char);
                }
                offset += 2;
                return text;

            }

            noti_s = view.getUint8(offset++);
            var text = '',
                char;
            while ((char = view.getUint16(offset, true)) != 0) {
                text += String.fromCharCode(char);
                offset += 2;
            }

            switch (noti_s) {
                case 0:
                    updateNotifications(noti_s, 'Gracz jest offline.', 'error');
                    break;
                case 1:
                    updateNotifications(noti_s, 'Zaproszenie zostaĹo wysĹane.', 'success');
                    break;
                case 2:
                    updateNotifications(noti_s, text + '  zalogowaĹ siÄ.', 'success');
                    break;
                case 3:
                    updateNotifications(noti_s, text + ' odrzuciĹ/a zaproszenie.', 'error');
                    break;
                case 4:
                    updateNotifications(noti_s, 'Player is not available.', 'error');
                    break;
                case 5:
                    updateNotifications(noti_s, 'battle_error', 'error');
                    break;
                case 6:
                    alert('Battle mode is not available. Please try again later.');
                    e('#playBtn').removeClass('active').prop('disabled', false);
                    break;
                case 7:
                    e('#tournament-modal').modal('toggle');
                    alert('Musisz posiadaÄ minimum 5 punktĂłw ,aby doĹÄczyÄ do bitwy 1 vs 1. W przypadku przegranej tracisz 0.5 pkt.');
                    break;
                case 8:
                    updateLiveBattles(text);
                    break;
                case 9:
                    updateNotifications(noti_s, '1v1: Gracz z tÄ samÄ rangÄ co ty oczekuje na przeciwnika.', 'warning', 10001);
                    break;
                case 11:
                    updateNotifications(noti_s, 'Zaproszenie zostaĹo wysĹane. (' + text + ' graczy)', 'success');
                    break;
                case 12:
                    updateNotifications(noti_s, text + ' zaprosiĹ/a ciÄ do 2 vs 2.', 'warning', 20000);
                    break;
                case 230:
                    var msg = dtview(1);
                    msg.setUint8(0, 230);
                    bubSend(msg);
                    break;
            }

            if (noti_s == 0 || noti_s == 1) {
                e('.inviteplayer_' + text).prop('disabled', true).addClass('tr-disabled'); //.appendTo('#friends-view-modal-data table');
                setTimeout(function () {
                    e('.inviteplayer_' + text).prop('disabled', false).removeClass('tr-disabled')
                }, 30000);
            }
        }

        function updateLiveBattles(t1) {
            function nrbi(r3) {
                var r4 = '',
                    si1 = '';
                r3 = parseInt(r3);
                if (r3 >= 10) {
                    si1 = 'height:30px;width:40px;';
                    r4 = '<img style="' + si1 + '" src="//bubble.am/img/rank_' + r3 + '.png?v2">';
                }
                return r4;
            }

            t1 = JSON.parse(t1);
            //t1.reverse();
            text3 = '<table class="table table-striped table-hover"><tbody>';
            for (f1 in t1) {
                var points = [];
                var team = {
                    0: ['', -1],
                    1: ['', -1]
                };
                var battleStarted = (Date.now() - t1[f1]['c']) / 1000 + 30;
                for (g1 in t1[f1]['in']) {
                    points.push();
                    var n2 = t1[f1]['in'][g1]['n'];
                    if (typeof n2 == 'object') {
                        for (x1 in n2) {
                            var n3 = n2[x1].split(':');
                            team[g1][0] += n3[0] + ', ';
                            if (n3[1] > team[g1][1]) team[g1][1] = n3[1];
                        }
                        team[g1][0] = team[g1][0].substring(0, team[g1][0].length - 2);
                    } else {
                        var n3 = n2.split(':');
                        team[g1][0] += n3[0];
                        team[g1][1] = n3[1];
                    }
                    //team[g1] = (typeof n2 == 'object' ? n2.join('<br />') : n2);
                }
                text3 += '<tr class="connect" data-srv="' + t1[f1]['i'] + '-11-0-1" style="cursor:pointer;">' +
                    '<td class="bli-b">' + nrbi(team[0][1]) + '</td>' +
                    '<td class="fb-lo2g">' + team[0][0] + '</td>' +
                    '<td class="pb-lo2g"><strong style="font-size:17px;">' + points.join(':') + '</strong><br />' +
                    '<span style="color:silver;font-size:11px;">' + formatSeconds(battleStarted, 1) + '</span></td>' +
                    '<td class="sb-lo2g">' + team[1][0] + '</td>' +
                    '<td class="bli-b">' + nrbi(team[1][1]) + '</td></tr>';
            }
            text3 += '</tbody></table>';
            e('#battle-live-data').html(text3);
        }

        function updateNotifications(s1, info, type, expireT) {
            if (typeof expireT == 'undefined') {
                var expireT = 3000;
            }
            var fadeOut1 = 0;
            var d1 = Date.now();
            var icon = 'check-circle-o';
            var style1 = '';
            switch (type) {
                case 'warning':
                    icon = 'exclamation-triangle';
                    break;
                case 'error':
                    icon = 'exclamation-circle';
                    break;
            }

            if (info == 'battle_error') {
                info = 'Battle is no longer active.';
                if (e('#tournament-modal').hasClass('in')) {
                    e('#tournament-modal').modal('toggle');
                }
            }
            var onCl1 = '';
            var in1 = '<i class="fa fa-' + icon + '"></i>';

            if (s1 == 9) {
                onCl1 = 'onClick="setGameMode(\':11\', 1); createBattleServer(12);"';
            }

            if (s1 == 12) {
                if (beforeExit() == " ") {
                    style1 = 'style="opacity:0.7;';
                }
                var id_split = info.split(':');
                var ds1 = id_split[3];
                if (ds1.length > 0) {
                    ds1 = ds1.split('=');
                    ds1 = '<span style="color:green;">' + ds1[0] + '</span>:<span style="color:red;">' + ds1[1] + '</span>';
                }
                in1 = '<i onClick="cInvite(' + id_split[2] + ',false);" class="fa fa-times" style="color: #7D4D03; font-size: 16px; "></i>';
                info = '<span data-srv="tournament-2vs2-' + id_split[1] + '-11-' + id_split[2] + '" class="invite-accept"><strong>' + id_split[0] + '</strong> ' + id_split[4] + ' ' + ds1 + '</span>';
            }
            if (s1 == 13) {
                e('#mess_top1time').remove();
                e('body').append('<div id="mess_top1time" style="color: #54c154;position: absolute;left:40%;font: 35px Ubuntu;">Top Time++ ' + formatSeconds(info / 60, 1) + '</div>');
                e("#mess_top1time").fadeOut(1000);
            } else {
                var notiDiv = '<div id="mess_' + d1 + '" class="bubble_invite ' + type + '" ' + onCl1 + ' ' + style1 + '> ' + in1 + ' ' + info + '</div>';
                e("#bubbleNotifications").append(notiDiv);
                e("#mess_" + d1).delay(expireT).fadeOut(fadeOut1);
            }


            if (e('#bubbleNotifications div').length > 15) {
                e('#bubbleNotifications div').eq(0).remove();
            }
        }

        function bubbleChat(view, offset) {
            function getString() {
                var text = '',
                    char;
                while ((char = view.getUint16(offset, true)) != 0) {
                    offset += 2;
                    text += String.fromCharCode(char);
                }
                offset += 2;
                return text;

            }

            var flags = view.getUint8(offset++);
            // for future expansions
            if (flags & 2) {
                offset += 4;
            }
            if (flags & 4) {
                offset += 8;
            }
            if (flags & 8) {
                offset += 16;
            }

            var r = view.getUint8(offset++),
                g = view.getUint8(offset++),
                b = view.getUint8(offset++);


            notiBoard.push({
                "name": getString(),
                "color": 'rgb(' + r + ',' + g + ',' + b + ')',
                "message": getString(),
                "time": Date.now()
            });
            DrawChatBoard();
        }

        function DrawChatBoard() {
            var len = notiBoard.length;

            var chatnick = notiBoard[len - 1].name;
            var state;
            var dsfdsf = Date.now();
            var notiMessage = notiBoard[len - 1].message;
            if (notiMessage.length > 10) {
                var id_split = notiMessage.split(':');
                if (id_split.length == 4) {
                    e("#bubbleNotifications").append('<div id="mess_' + dsfdsf + '" class="bubble_invite warning"><i onClick="cInvite(' + id_split[3] + ',false);" class="fa fa-times" style="color: #7D4D03; font-size: 16px; "></i> <span data-srv="' + id_split[0] + '-' + id_split[1] + '-' + id_split[2] + '-' + id_split[3] + '" class="invite-accept"><strong>' + chatnick + '</strong> zaprosiĹ/a ciÄ do ' + getModeName(id_split[2]) + '. <a href="#"><i class="fa fa-play-circle"></i></a></span></div>');
                    e("#mess_" + dsfdsf).delay(15000).fadeOut(0);

                    if (e('#bubbleNotifications div').length > 15) {
                        e('#bubbleNotifications div').eq(0).remove();
                    }
                }
            }
        }

        function dtview(a) {
            return new DataView(new ArrayBuffer(a));
        }

        function bubbleRunning() {
            return null != bsocket && bsocket.readyState == bsocket.OPEN
        }

        function bubSend(a) {
            bsocket.send(a.buffer);
        }

        function gIcon(on) {
            if (on) {
                return '<i class="fa fa-gamepad"></i>';
            } else {
                return '<div class="online"></div>';
            }
        }
        var chkilog = false;

        function stchkilog(v) {
            console.log('chkilog: ' + v);
            chkilog = v;
        }

        function gekilog() {
            return chkilog;
        }
        var ef32f;
        var lastup = Date.now();
        d.startintd = function () {
            console.warn('t');
            clearInterval(ef32f);
            ef32f = setInterval(ba, 40);
        }

        function Kb() {
            Fa = 1;
            cb();
            setInterval(cb, 18E4);
            J = Ga = document.getElementById("canvas");

            var isTyping = false;
            var chattxt;

            f = J.getContext("2d");
            J.onmousedown = function (a) {
                if (db) {
                    var b = a.clientX - (5 + l / 5 / 2),
                        c = a.clientY - (5 + l / 5 / 2);
                    if (Math.sqrt(b * b + c * c) <= l / 5 / 2) {
                        ba();
                        K(17);
                        return
                    }
                }
                ma = a.clientX;
                na = a.clientY;
                Ha();
                ba()
            };
            J.onmousemove = function (a) {
                ma = a.clientX;
                na = a.clientY;
                Ha();
                lastacti = Date.now();
            };
            J.onmouseup = function () {}, /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", eb, !1) : document.body.onmousewheel = eb, e(d).on("beforeunload", beforeExit);

            J.onfocus = function () {
                isTyping = false;
            };

            document.getElementById("chat_textbox").onblur = function () {
                isTyping = false;
            };


            document.getElementById("chat_textbox").onfocus = function () {
                isTyping = true;
            };

            var a = 0,
                b = 0,
                c = 0;

            d.onkeydown = function (n) {
                switch (n.keyCode) {
                    case 32: // split
                        if ((!a) && (!isTyping)) {
                            ba();
                            K(17);
                            a = true;
                        }
                        break;
                    case 81: // key q pressed
                        if ((!b) && (!isTyping)) {
                            K(18);
                            b = true;
                        }
                        break;
                    case 87: // eject mass
                        if ((!c) && (!isTyping)) {
                            ba();
                            K(21);
                            c = true;
                        }
                        break;
                    case 27: // quit
                        oa(true);
                        break;

                    case 13:
                        if (isTyping) {
                            isTyping = false;
                            document.getElementById("chat_textbox").blur();
                            chattxt = document.getElementById("chat_textbox").value;
                            if (chattxt.length > 0) sendChat(chattxt);
                            //document.getElementById("chat_textbox").value = "";

                        } else {
                            if (!hasOverlay) {
                                document.getElementById("chat_textbox").focus();
                                isTyping = true;
                            }
                        }
                        break;
                    case 17:
                        if (!hasOverlay && !isTyping) {
                            document.getElementById("chat_textbox").value = "/g ";
                            document.getElementById("chat_textbox").focus();
                            isTyping = true;
                        }
                        break;
                }
            };


            d.onkeyup = function (n) {
                32 == n.keyCode && (a = !1);
                87 == n.keyCode && (c = !1);
                81 == n.keyCode && b && (K(19), b = !1)
            };
            d.onblur = function () {
                K(19);
                c = b = a = !1
            };
            d.onresize = fb;
            d.requestAnimationFrame(gb);
            startintd();
            y && e("#region").val(y);
            hb();
            pa(e("#region").val());
            0 == Ia && y && L();
            oa(0);
            fb();
            /*d.location.hash && 6 <= d.location.hash.length && ib(d.location.hash)*/
        }
        d.beforeExit = function () {
            return ckcj() ? " " : void 0
        }

        function eb(a) {
            if (hasOverlay == false) {
                M *= Math.pow(.9, a.wheelDelta / -120 || a.detail || 0);
                //  if (!isUnlimitedZoom) { //XXX
                //                if (0.4 > M) {
                //                    M = 0.4;
                //                }
                //                if (M > 4 / g) {
                //                    M = 4 / g;
                //                }
                //   } 
            }
        }

        function ckcj() {
            return h.length > 0
        }

        function Lb() {
            if (.4 > g) ca = null;
            else {
                for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, n = Number.NEGATIVE_INFINITY, d = 0; d < v.length; d++) {
                    var e = v[d];
                    !e.H() || e.L || 20 >= e.size * g || (a = Math.min(e.x - e.size, a), b = Math.min(e.y - e.size, b), c = Math.max(e.x + e.size, c), n = Math.max(e.y + e.size, n))
                }
                ca = Mb.X({
                    ba: a - 10,
                    ca: b - 10,
                    Z: c + 10,
                    $: n + 10,
                    fa: 2,
                    ha: 4
                });
                for (d = 0; d < v.length; d++)
                    if (e = v[d], e.H() && !(20 >= e.size * g))
                        for (a = 0; a < e.a.length; ++a) b =
                            e.a[a].x, c = e.a[a].y, b < t - l / 2 / g || c < u - q / 2 / g || b > t + l / 2 / g || c > u + q / 2 / g || ca.Y(e.a[a])
            }
        }

        function Ha() {
            qa = (ma - l / 2) / g + t;
            ra = (na - q / 2) / g + u
            //console.log(qa+'/'+ra);
        }

        function cb() {
            null == sa && (sa = {}, e("#region").children().each(function () {
                var a = e(this),
                    b = a.val();
                b && (sa[b] = a.text())
            }));
            e.get("/info", function (a) {
                var b = {},
                    c;
                for (c in a.regions) {
                    var n = c.split(":")[0];
                    b[n] = b[n] || 0;
                    b[n] += a.regions[c].numPlayers
                }
                for (c in b) e('#region option[value="' + c + '"]').text(sa[c] + " (" + b[c] + " " + lang[2] + ")");
            }, "json")
        }

        function hideOverlay() {
            hasOverlay = false;
            e("#overlays").css('background', '');
            e("#overlays").css('background-color', 'rgba(0, 0, 0, 0.498039)');
            e("#overlays").hide();
            e("#stats").hide();
            e("#formStd").hide();
            U = ea = !1;
            hb();
            kb(d.aa)
        }

        function pa(a) {
            if (bubLogged == 1) bubParm(1, parseInt(a));
            a && a != y && (e("#region").val() != a && e("#region").val(a), y = d.localStorage.location = a, e(".region-message").hide(), e(".region-message." + a).show(), e(".btn-needs-server").prop("disabled", !1), Fa && L())
        }

        d.oa = function (a) {
            hasOverlay = true;

            ea || U || (G = null, lb(d.aa), 1000 > a && (s = 1), ea = 1, e("#formStd").show(), 0 < a ? e("#overlays").fadeIn(a) : e("#overlays").show())
        }

        function fa(a) {
            e("#helloDialog").attr("data-gamemode", a);
            V = a;
            e("#gamemode").val(a)
        }

        function hb() {
            e("#region").val() ? d.localStorage.location = e("#region").val() : d.localStorage.location && e("#region").val(d.localStorage.location);
            //e("#region").val() ? e("#locationKnown").append(e("#region")) : e("#locationUnknown").append(e("#region"))
        }

        function lb(a) {
            d.googletag && d.googletag.cmd.push(function () {
                Ja && (Ja = !1, setTimeout(function () {
                    Ja = !0
                }, 6E4 * Nb), d.googletag && d.googletag.pubads && d.googletag.pubads().refresh && d.googletag.pubads().refresh(a))
            })
        }

        function kb(a) {
            d.googletag && d.googletag.pubads && d.googletag.pubads().clear &&
                d.googletag.pubads().clear(a)
        }

        function mb() {

            if (cnjdfs) {

                e("#connecting").show()
                e("#time2end").html('');
                var a = ++Ia;
                console.log("Find " + y + V);
                e.ajax("http://bubble.am/m", {
                    error: function () {
                        setTimeout(mb, 1E3)
                    },
                    success: function (a) {
                        a = a.split("\n");
                        chkha = a[3];
                        mapSize = a[2];
                        var cfve = '23';
                        if (typeof a[4] !== 'undefined' && beforeExit() !== " " && cfve != a[4]) {
                            console.log(cfve + '!= ' + a[4]);
                            d.location.href = "http://bubble.am/?v=" + cfve + "." + a[4];
                        }
                        var ksmd = btoa(a[0] + a[1]);
                        if (TaL == 1 && parseInt(V.substr(1)) < 10) {
                            e("#friendsZone").val('http://bubble.am/x' + ksmd);
                            e('#fDza').show();
                        } else {
                            e("#fDza").hide();
                        }

                        /*if(e.cookie('server')) {
                        	 ASaf = e.cookie('server').split("-");
                        	 Ka("ws://" + ASaf[0]+':'+ASaf[1], a[1]);
                        } else {*/
                        Ka("ws://" + a[0], a[1]);
                        //}

                    },
                    dataType: "text",
                    method: "POST",
                    cache: 0,
                    crossDomain: 1,
                    //data: (w + P || "?") + "=1"
                    data: 'tal=' + TaL + '&dm=' + y + V
                })

                /*e.ajax(da + "findServer", {
            error: function() {
                setTimeout(mb, 1E3)
            }
            , success: function(b) {
                a == Ia && (b.alert && alert(b.alert), Ka("ws://" + b.ip, b.token))
            }
            , dataType: "json"
            , method: "POST"
            , cache: !1
            , crossDomain: !0
            , data: (y + V || "?") + "\n154669603"
        })*/
            }
        }

        function L() {
            Fa && y && (mb())
        }

        d.closesck = function () {
            if (r) {
                try {
                    r.close()
                } catch (c) {}
            }
        }

        function Ka(a, b, isC, goSpec) {
            if (r) {
                r.onopen = null;
                r.onmessage = null;
                r.onclose = null;
                try {
                    r.close()
                } catch (c) {}
                r =
                    null
            }

            La.ip && (a = "ws://" + La.ip);
            if (a.length < 10) {
                e("#playBtn").prop("disabled", 0);
                return;
            }

            if (null != N) {
                var n = N;
                N = function () {
                    n(b)
                }
            }
            if (nb) {
                var d = a.split(":");
                a = d[0] + "s://ip-" + d[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.bubble.am:" + (+d[2] + 2E3)
            }
            z = [];
            h = [];
            H = {};
            v = [];
            W = [];
            w = [];
            A = B = null;
            O = 0;
            ha = !1;
            currSrv = a;
            console.log("Connecting to " + a);
            e("#playBtn").prop("disabled", 1);

            r = new WebSocket(a);
            r.binaryType = "arraybuffer";
            r.onopen = function () {
                var a;
                console.log("socket open");
                a = P(5);
                a.setUint8(0, 255);
                a.setUint32(1, 2207389747, 1);
                Q(a);

                a = P(5);
                a.setUint8(0, 254);
                a.setUint32(1, 4, 1);
                Q(a);
                if (typeof chkha !== 'undefined') {
                    a = P(1 + chkha.length);
                    a.setUint8(0, 253);
                    for (var b = 0; b < chkha.length; ++b) a.setUint8(b + 1, chkha.charCodeAt(b));
                    Q(a);
                }
                stchkilog(false);
                srvLogin(user_hash);
                var kdas = 0;
                var chkldk = setInterval(function () {
                    if (gekilog()) {
                        if (!isNaN(isC) && isC > 0) {
                            console.log('sbat: ' + isC);
                            a = P(5);
                            a.setUint8(0, 3);
                            a.setUint32(1, isC, 1);
                            Q(a);
                            cnjdfs = true;
                        } else if (!isNaN(goSpec)) {
                            spectate();
                        } else {
                            e("#playBtn").prop("disabled", 0);
                        }
                        clearInterval(chkldk);
                    }
                    if (kdas > 60) {
                        if (e('#tournament-modal').hasClass('in')) {
                            e('#tournament-modal').modal('toggle');
                        }
                        //setTimeout(function() { alert('Unable to connect to server. Check your internet connection'); },1000); 
                        clearInterval(chkldk);
                    }
                    kdas++;
                }, 100);
                /*a = P(1 + b.length);
            a.setUint8(0, 80);
			
            for (var c = 0; c < b.length; ++c) {
				a.setUint8(c + 1, b.charCodeAt(c));
			}
			
            Q(a);*/
                ob();
            };
            r.onmessage = Ob;
            r.onclose = Pb;
            r.onerror = function () {
                console.log("socket error")
            }
        }

        function srvLogin(login) {
            var msg = dtview(1 + 2 * login.length);
            var offset = 0;
            msg.setUint8(offset++, 2);
            for (var i = 0; i < login.length; ++i) {
                msg.setUint16(offset, login.charCodeAt(i), true);
                offset += 2;
            }
            Q(msg);
        }

        function P(a) {
            return new DataView(new ArrayBuffer(a))
        }

        function Q(a) {
            r.send(a.buffer)
        }

        function Pb() {
            ha && (ta = 500);
            console.log("socket close");
            oa(true);
            setTimeout(L, ta);
            ta *= 2
        }

        function Ob(a) {
            Qb(new DataView(a.data))
        }

        function Qb(a) {
            function b() {
                for (var b = "";;) {
                    var d = a.getUint16(c, !0);
                    c += 2;
                    if (0 == d) break;
                    b += String.fromCharCode(d)
                }
                return b
            }
            var c = 0;
            240 == a.getUint8(c) && (c += 5);
            switch (a.getUint8(c++)) {
                case 16:
                    Rb(a, c);
                    break;
                case 17:
                    ia = a.getFloat32(c, !0);
                    c += 4;
                    ja = a.getFloat32(c, !0);
                    c += 4;
                    ka = a.getFloat32(c, !0);
                    c += 4;
                    break;
                case 20:
                    h = [];
                    z = [];
                    break;
                case 21:
                    Ma = a.getInt16(c, !0);
                    c += 2;
                    Na = a.getInt16(c, !0);
                    c += 2;
                    Oa || (Oa = !0, ua = Ma, va = Na);
                    break;
                case 32:
                    z.push(a.getUint32(c, !0));
                    c += 4;
                    break;
                case 49:
                    if (null != B) break;
                    var n = a.getUint32(c, !0),
                        c = c + 4;
                    w = [];
                    for (var d = 0; d < n; ++d) {
                        var e = a.getUint32(c, !0),
                            c = c + 4;
                        // dane przychodzÄce w `w`
                        w.push({
                            id: e,
                            name: b()
                        })
                    }
                    pb();
                    break;
                case 50:
                    B = [];
                    n = a.getUint32(c, !0);
                    c += 4;
                    for (d = 0; d < n; ++d) B.push(a.getFloat32(c, !0)), c += 4;

                    pb();
                    break;
                case 64:
                    wa = a.getFloat64(c, 1);
                    c += 8;
                    xa = a.getFloat64(c, 1);
                    c += 8;
                    ya = a.getFloat64(c, 1);
                    c += 8;
                    za = a.getFloat64(c, 1);
                    c += 8;
                    ia = (ya + wa) / 2;
                    ja = (za + xa) / 2;
                    ka = 1;
                    0 == h.length && (t = ia, u = ja, g = ka);
                    break;
                case 81:
                    var f = a.getUint32(c, !0),
                        c = c + 4,
                        k = a.getUint32(c, !0),
                        c = c + 4,
                        l = a.getUint32(c, !0),
                        c = c + 4;
                    setTimeout(function () {
                        X({
                            d: f,
                            e: k,
                            c: l
                        })
                    }, 1200)
                    break;
                case 89:
                    var nStatus = a.getUint8(c++);
                    var nText = '',
                        char;

                    while ((char = a.getUint16(c, true)) != 0) {
                        nText += String.fromCharCode(char);
                        c += 2;
                    }

                    switch (nStatus) {
                        case 0:
                            spectate();
                            setTimeout(hideOverlay, 100);
                            break;
                        case 1:
                            bStartConf();
                            break;
                        case 2:
                            stchkilog(true);
                            break;
                        case 3:
                            shwdebug(nText);
                            break;
                        case 13:
                            updateNotifications(nStatus, nText);
                            console.log(nStatus + ' / ' + formatSeconds(nText, 1));
                            break;
                        case 230:
                            var a = P(1);
                            a.setUint8(0, 230);
                            Q(a);
                            break;
                    }

                    break;
                case 90:
                    dat = a.getFloat64(c, true);
                    c += 8;
                    formatSeconds(dat);
                    break;
                case 99:
                    addChat(a, c);
                    break;
            }
        }

        function shwdebug(text) {
            e('#shwdebug').html(text);
        }

        function formatSeconds(sec, ret) {
            sec = parseInt(sec);
            var time = '00:00';
            if (sec > 0) {
                var minutes = Math.floor((sec / 60));
                var seconds = sec - (minutes * 60);

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                time = minutes + ':' + seconds;
            }
            if (typeof ret == 'undefined') {
                e('#time2end').html(time);
            } else {
                return time;
            }
        }

        function addChat(view, offset) {
            function getString() {
                var text = '',
                    char;
                while ((char = view.getUint16(offset, true)) != 0) {
                    offset += 2;
                    text += String.fromCharCode(char);
                }
                offset += 2;
                return text;

            }

            var flags = view.getUint8(offset++);
            // for future expansions
            if (flags & 2) {
                offset += 4;
            }
            if (flags & 4) {
                offset += 8;
            }
            if (flags & 8) {
                offset += 16;
            }

            var r = view.getUint8(offset++),
                g = view.getUint8(offset++),
                b = view.getUint8(offset++);
            //color = (r << 16 | g << 8 | b).toString(16);



            /*	
        while (color.length > 6) {
            color = '0' + color;
        }
		
        color = '#' + color;*/

            chatBoard.push({
                "name": getString(),
                "color": 'rgb(' + r + ',' + g + ',' + b + ')',
                "message": getString(),
                "time": Date.now()
            });
            drawChatBoard();
        }

        function drawChatBoard() {

            var len = chatBoard.length;

            if (Aa) {
                e("#chatlog").css("color", "white");
                e("#chat_textbox").css("color", "white").css("background", "rgba(255, 255, 255, 0.2) none repeat scroll 0 0");
            }
            if (!Aa) {
                e("#chatlog").css("color", "black");
                e("#chat_textbox").css("color", "black").css("background", "rgba(0, 0, 0, 0.2) none repeat scroll 0 0");
            }

            var chatnick = chatBoard[len - 1].name;
            var state;
            var chatClassID = Date.now();

            var chatNick = htmlspecialchars(chatnick);


            var chatMessage = chatBoard[len - 1].message;


            dop = 0;

            var state2 = 0;

            if (chatMessage == '****need_pacc****') {
                state2 = 1;
                chatMessage = 'You need Premium, cena - 2 punkty.';

            } else if (chatMessage.substr(0, 3) == '/g ') {
                state2 = 2;
                chatMessage = chatMessage.replace('/g ', '');
            }

            if (chatNick == '[**system**]') {
                if (chatNick == '[**system**]') {
                    chatNick = '';
                    if (chatMessage.indexOf("|") > -1) {
                        chatMessage = chatMessage.split("|");
                        var cc = JSON.parse(chatMessage[1]);
                        state2 = '3" style="color:rgb(' + cc.r + ',' + cc.g + ',' + cc.b + ');';
                        chatMessage = chatMessage[0];
                    } else {
                        state2 = 3;
                    }
                }
            } else {
                chatNick = '<strong style="color:' + chatBoard[len - 1].color + '">' + chatNick + '</strong> ';
            }

            chatMessage = htmlspecialchars(chatMessage);
            e("#chatlog").append('<div class="mess_' + chatClassID + ' mess_type_' + state2 + '">' + chatNick + chatMessage + '</div>');



            //e("#chatlog").append(mg);
            e(".mess_" + chatClassID).delay(30000).fadeOut(500);
            if (e('#chatlog div').length > chathistory) {
                e('#chatlog div').eq(0).remove();
            }


            var chatWindow = document.getElementById("chatlog");
            dif = chatWindow.scrollHeight - chatWindow.scrollTop - dop;

            if (dif < 530) {
                e("#chatlog").scrollTop(500000);
            }



            var from = len - 15;
            if (from < 0) from = 0;


        }

        function htmlspecialchars(html) {
            html = html.replace(/&/g, "&amp;");
            html = html.replace(/</g, "&lt;");
            html = html.replace(/>/g, "&gt;");
            html = html.replace(/"/g, "&quot;");
            return html;
        }

        function Rb(a, b) {

            function n() {
                for (var c = "";;) {
                    var d = a.getUint8(b++);
                    if (0 == d) break;
                    c += String.fromCharCode(d)
                }
                return c
            }
            qb = E = Date.now();
            ha || (ha = !0, Sb());
            Pa = !1;
            var p = a.getUint16(b, !0);
            b += 2;
            for (var f = 0; f < p; ++f) {
                var C = H[a.getUint32(b, !0)],
                    k = H[a.getUint32(b + 4, !0)];
                b += 8;
                C && k && (k.R(), k.o = k.x, k.p = k.y, k.n = k.size, k.C = C.x, k.D = C.y, k.m = k.size, k.K = E, Tb(C, k))
            }
            for (f = 0;;) {
                p = a.getUint32(b, !0);
                b += 4;
                if (0 == p) break;
                ++f;
                var g;
                var gdID = a.getUint32(b, 1);
                b += 4;
                var C = a.getInt16(b, !0);
                b += 2;
                k = a.getInt16(b, !0);
                b += 2;
                g = a.getInt16(b, !0);
                b += 2;
                var m = a.getUint8(b++);
                var I = a.getUint8(b++);
                var R = a.getUint8(b++);
                var I = Ub(m << 16 | I << 8 | R);
                var R = a.getUint8(b++);
                var l = !!(R & 1);
                var q = !!(R & 18);
                var r = null;


                R & 2 && (b += 4 + a.getUint32(b, !0));
                R & 4 && (r = n());

                for (var r1, n1 = "";;) {
                    r1 = a.getUint16(b, !0);
                    b += 2;
                    if (0 == r1) break;
                    n1 += String.fromCharCode(r1);
                }

                var s = n1;

                var m = null;
                //console.log('Screen: '+s+' / Size: '+g+' | x: '+C+' y: '+k+' | color: '+I);

                if (H.hasOwnProperty(p)) {
                    m = H[p], m.J(), m.o = m.x, m.p = m.y, m.n = m.size, m.color = I, m.gdid = gdID;
                } else {
                    //console.log('has not');
                    m = new Y(p, C, k, g, I, s, gdID), v.push(m), H[p] = m, m.ia = C, m.ja = k;
                }
                m.f = l;
                m.j = q;
                m.C = C;
                m.D = k;
                m.m = g;
                m.K = E;
                m.T = R;
                m.V = r;
                s && m.t(s); - 1 != z.indexOf(p) && -1 == h.indexOf(m) && (h.push(m), 1 == h.length && (t = m.x, u = m.y, rb(), document.getElementById("overlays").style.display = "none", x = [], Qa = 0, Ra = h[0].color, Sa = !0, sb = Date.now(), S = Ta = Ua = 0))
            }
            C = a.getUint32(b, !0);
            b += 4;
            for (f = 0; f < C; f++) p = a.getUint32(b, !0), b += 4, m = H[p], null != m && m.R();

            //var cd1 = currentMode().split(':');
            Pa && 0 == h.length && (tb = Date.now(), Sa = !1, ea || U || (ub ? (lb(d.ab), Vb(), U = !0, e("#overlays").fadeIn(1000), quey(), e("#stats").show()) : oa(3E3)))

        }

        function quey() {
            /*
            if(logged == 1) {
            	bubbleSetOnline(false);
            	e('#escapingBallG').show();
            	e('#escapingLEVEL').hide(); 
            	setTimeout(function(){

            	e.ajax({
            		url: '//m.bubble.am/query',
            		method: "POST",
            		data: { 'do': 1 },
            		xhrFields: { 
            			withCredentials: true 
            		}
            	}).done(function( msg ) {
            		
            		e('.progress-bar-striped').css('width',msg.perc);
            		e('.progress-bar-star').text(msg.lvl);
            		e('.progress-bar-text').text(msg.text);
            		e('#escapingBallG').hide(); 
            		e('#escapingLEVEL').fadeIn(500);
            		
            	  });
            	}, 6000);
            }
            */
        }

        function Sb() {
            e("#connecting").hide();
            vb();
            N && (N(), N = null);
            null != Va && clearTimeout(Va);
            Va = setTimeout(function () {
                d.ga && (++wb, d.ga("set", "dimension2", wb))
            }, 1E4)
        }

        function ba() {
            if (Date.now() - lastup > 100) {
                startintd();
            }
            lastup = Date.now();

            if (isGameOn()) {
                var a = ma - l / 2,
                    b = na - q / 2;
                64 > a * a + b * b || .01 > Math.abs(xb - qa) && .01 > Math.abs(yb - ra) || (xb = qa, yb = ra, a = P(21), a.setUint8(0, 16), a.setFloat64(1, qa, !0), a.setFloat64(9, ra, !0), a.setUint32(17, 0, !0), Q(a))
            }
        }

        function vb() {
            if (isGameOn() && ha && null != G) {
                var a = P(1 + 2 * G.length);
                a.setUint8(0, 0);
                for (var b = 0; b < G.length; ++b) a.setUint16(1 + 2 * b, G.charCodeAt(b), !0);
                Q(a);
                G = null
            }
        }

        function sendChat(str) {
            if (isGameOn() && (str.length < 100) && (str.length > 0)) {
                if (str == '/fix') {
                    spectate();
                } else {
                    var msg = P(2 + 2 * str.length);
                    var offset = 0;
                    msg.setUint8(offset++, 99);
                    msg.setUint8(offset++, 0); // flags (0 for now)
                    for (var i = 0; i < str.length; ++i) {
                        msg.setUint16(offset, str.charCodeAt(i), true);
                        offset += 2;
                    }

                    Q(msg);
                }
                e('#chat_textbox').val('');

                if (document.getElementById("canvas")) {
                    document.getElementById("canvas").focus();
                }
            }
        }

        function isGameOn() {
            return null != r && r.readyState == r.OPEN
        }

        function K(a) {
            if (isGameOn()) {
                var b = P(1);
                b.setUint8(0, a);
                Q(b)
            }
        }

        function ob() {
            if (isGameOn() && null != D) {
                var a = P(1 + D.length);
                a.setUint8(0, 81);
                for (var b = 0; b < D.length; ++b) a.setUint8(b + 1, D.charCodeAt(b));
                Q(a)
            }
        }

        function fb() {
            l = 1 * d.innerWidth;
            q = 1 * d.innerHeight;
            Ga.width = J.width = l;
            Ga.height = J.height =
                q;
            var a = e("#helloDialog");
            a.css("transform", "none");
            var b = a.height(),
                c = d.innerHeight;
            b > c / 1.1 ? a.css("transform", "translate(-50%, -50%) scale(" + c / b / 1.1 + ")") : a.css("transform", "translate(-50%, -50%)");
            zb()
        }

        function Ab() {
            var a;
            a = 1 * Math.max(q / 1080, l / 1920);
            return a *= M
        }

        function Wb() {
            if (0 != h.length) {
                for (var a = 0, b = 0; b < h.length; b++) a += h[b].size;
                a = Math.pow(Math.min(64 / a, 1), .4) * Ab();
                g = (9 * g + a) / 10
            }
        }

        function zb() {

            if (hasOverlay == false) {
                var a, b = Date.now();
                ++Xb;
                E = b;
                if (0 < h.length) {
                    Wb();
                    for (var c = a = 0, d = 0; d < h.length; d++) h[d].J(), a += h[d].x /
                        h.length, c += h[d].y / h.length;
                    ia = a;
                    ja = c;
                    ka = g;
                    t = (t + a) / 2;
                    u = (u + c) / 2
                } else t = (29 * t + ia) / 30, u = (29 * u + ja) / 30, g = (9 * g + ka * Ab()) / 10;
                Lb();
                Ha();
                Wa || f.clearRect(0, 0, l, q);
                Wa ? (f.fillStyle = Aa ? "#111111" : "#F2FBFF", f.globalAlpha = .05, f.fillRect(0, 0, l, q), f.globalAlpha = 1) : Yb();
                v.sort(function (a, b) {
                    return a.size == b.size ? a.id - b.id : a.size - b.size
                });
                f.save();
                f.translate(l / 2, q / 2);
                f.scale(g, g);
                f.translate(-t, -u);
                if (showBorders && mapSize) {
                    drawBorders(f, mapSize);
                }
                for (d = 0; d < W.length; d++) W[d].s(f);
                for (d = 0; d < v.length; d++) v[d].s(f);
                if (Oa) {
                    ua = (3 * ua + Ma) / 4;
                    va = (3 * va + Na) / 4;
                    f.save();
                    f.strokeStyle =
                        "#FFAAAA";
                    f.lineWidth = 10;
                    f.lineCap = "round";
                    f.lineJoin = "round";
                    f.globalAlpha = .5;
                    f.beginPath();
                    for (d = 0; d < h.length; d++) f.moveTo(h[d].x, h[d].y), f.lineTo(ua, va);
                    f.stroke();
                    f.restore()
                }
                f.restore();
                A && A.width && f.drawImage(A, l - A.width - 10, 10);

                O = Math.max(O, Bb());
                0 != O && (null == Ba && (Ba = new Ca(24, "#FFFFFF")), Ba.u(lang[3] + ": " + ~~(O / 100)), c = Ba.F(), a = c.width, f.globalAlpha = .2, f.fillStyle = "#000000", f.fillRect(10, 10, a + 10, 34), f.globalAlpha = 1, f.drawImage(c, 15, 15));
                Zb();
                b = Date.now() - b;
                b > 1E3 / 60 ? F -= .01 :
                    b < 1E3 / 65 && (F += .01);
                .4 > F && (F = .4);
                1 < F && (F = 1);
                b = E - Cb;
                !isGameOn() || ea || U ? (s += b / 2E3, 1 < s && (s = 1)) : (s -= b / 300, 0 > s && (s = 0));
                0 < s && (f.fillStyle = "#000000", f.globalAlpha = .5 * s, f.fillRect(0, 0, l, q), f.globalAlpha = 1);
                Cb = E;

            }
        }

        function Yb() {
            f.fillStyle = Aa ? "#111111" : "#F2FBFF";
            f.fillRect(0, 0, l, q);
            f.save();
            f.strokeStyle = Aa ? "#AAAAAA" : "#000000";
            f.globalAlpha = .2 * g;
            for (var a = l / g, b = q / g, c = (-t + a / 2) % 50; c < a; c += 50) f.beginPath(), f.moveTo(c * g - .5, 0), f.lineTo(c * g - .5, b * g), f.stroke();
            for (c = (-u + b / 2) % 50; c < b; c += 50) f.beginPath(), f.moveTo(0, c * g - .5), f.lineTo(a *
                g, c * g - .5), f.stroke();
            f.restore()
        }

        function Zb() {
            if (db && Xa.width) {
                var a = l / 5;
                f.drawImage(Xa, 5, 5, a, a)
            }
        }

        function Bb() {
            for (var a = 0, b = 0; b < h.length; b++) a += h[b].m * h[b].m;
            return a
        }

        function pb() {
            A = null;
            if (null != B || 0 != w.length)
                if (null != B || Da) {
                    A = document.createElement("canvas");
                    var a = A.getContext("2d"),
                        b = 60,
                        b = null == B ? b + 24 * w.length : b + 180,
                        c = Math.min(200, .3 * l) / 200;
                    A.width = 200 * c;
                    A.height = b * c;
                    a.scale(c, c);
                    a.globalAlpha = .4;
                    a.fillStyle = "#000000";
                    a.fillRect(0, 0, 200, b);
                    a.globalAlpha = 1;
                    a.fillStyle = "#FFFFFF";
                    c = null;
                    c = lang[1];
                    var Kms = false;
                    var anunnamed = 'An unnamed cell';
                    if (V == ':8') anunnamed = ' ';
                    var dmwd = "";
                    a.font = "30px Ubuntu";
                    a.fillText(c, 100 - a.measureText(c).width / 2, 40);
                    if (null == B) {
                        for (a.font = "18px Ubuntu", b = 0; b < w.length; ++b) {

                            c = w[b].name || anunnamed;
                            switch (c) {
                                case '==Waiting==for==':
                                    Kms = true;
                                    c = lang[4];
                                    break;
                                case '==players=need==':
                                    Kms = true;
                                    c = lang[5];
                                    break;
                                case 'Game=starting=in':
                                    Kms = true;
                                    c = lang[6];
                                    if (photography_audio.paused) {
                                        photography_audio.play();
                                    } else {
                                        photography_audio.pause();
                                    }
                                    break;
                                case '=Good=luck======':
                                    Kms = true;
                                    c = lang[7];
                                    break;
                                case '=Players=Remaining=':
                                    Kms = true;
                                    c = lang[8];
                                    break;
                                case '=Congratulations==':
                                    Kms = true;
                                    c = lang[9];
                                    break;
                                case '==for====winning=':
                                    Kms = true;
                                    c = lang[10];
                                    break;
                                case 'Game=restarting=in':
                                    Kms = true;
                                    c = lang[11];
                                    break;
                            }
                            if (!Da) {
                                c = "An unnamed cell";
                            }
                            if (-1 != z.indexOf(w[b].id)) {

                                h[0].name && (c = h[0].name);
                                if (!Kms) dmwd = b + 1 + ". ";
                                c = dmwd + c;
                                a.fillStyle = "#FFAAAA";
                                a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);


                            } else {
                                a.fillStyle = "#FFFFFF";
                                if (!Kms) dmwd = b + 1 + ". ";
                                c = dmwd + c;
                                a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
                            }
                        }
                    } else {
                        for (b = c = 0; b < B.length; ++b) {
                            var d = c + B[b] * Math.PI * 2;
                            a.fillStyle = $b[b + 1];
                            a.beginPath();
                            a.moveTo(100, 140);
                            a.arc(100, 140, 80, c, d, 0);
                            a.fill();
                            c = d
                        }
                    }
                }
        }

        function Ya(a, b, c, d, e) {
            this.P = a;
            this.x = b;
            this.y = c;
            this.g = d;
            this.b = e
        }

        function Y(a, b, c, d, e, f, g) {
            this.id = a;
            this.gid = g;
            this.o = this.x = b;
            this.p = this.y = c;
            this.n = this.size = d;
            this.color = e;
            this.a = [];
            this.Q();
            this.t(f)
        }

        function Ub(a) {
            for (a = a.toString(16); 6 > a.length;) a = "0" + a;
            return "#" + a
        }

        function Ca(a, b, c, d) {
            //console.log(a+'/'+ b+'/'+ c+'/'+d);

            a && (this.q = a);
            b && (this.M = b);
            this.O = !!c;
            d && (this.r = d)
        }

        function ac(a) {
            for (var b = a.length, c, d; 0 < b;) d = Math.floor(Math.random() * b), b--, c = a[b], a[b] = a[d], a[d] = c
        }

        function X(a, b) {

        }

        function Db(a) {
            "string" == typeof a && (a = JSON.parse(a));
            Date.now() + 18E5 > a.expires ? e("#helloDialog").attr("data-logged-in", "0") : (d.localStorage[T] =
                JSON.stringify(a), D = a.authToken, e(".agario-profile-name").text(a.name), ob(), X({
                    e: a.xp,
                    c: a.xpNeeded,
                    d: a.level
                }), e("#helloDialog").attr("data-logged-in", "1"))
        }

        function bc(a) {
            a = a.split("\n");
            Db({
                name: a[0],
                fbid: a[1],
                authToken: a[2],
                expires: 1E3 * +a[3],
                level: +a[4],
                xp: +a[5],
                xpNeeded: +a[6]
            })
        }

        function $a(a) {
            d.history && d.history.replaceState && d.history.replaceState({}, d.document.title, a)
        }

        function Tb(a, b) {
            var c = -1 != z.indexOf(a.id),
                d = -1 != z.indexOf(b.id),
                e = 30 > b.size;
            c && e && ++Qa;
            e || !c || d || ++Ta
        }

        function Eb(a) {
            a = ~~a;
            var b = (a % 60).toString();
            a = (~~(a / 60)).toString();
            2 > b.length && (b = "0" + b);
            return a + ":" + b
        }

        function cc() {
            if (null == w) return 0;
            for (var a = 0; a < w.length; ++a)
                if (-1 != z.indexOf(w[a].id)) return a + 1;
            return 0
        }

        function drawBorders(g, siz) { //XXX
            if (Aa) {
                g["strokeStyle"] = "#FFFFFF";
            }

            g.beginPath();
            g.moveTo(0, 0); //TODO use min/max X/Y
            g.lineTo(siz, 0);
            g.lineTo(siz, siz);
            g.lineTo(0, siz);
            g.lineTo(0, 0);
            g.stroke();
        }

        function Vb() {
            e(".stats-food-eaten").text(Qa);
            e(".stats-time-alive").text(Eb((tb - sb) / 1E3));
            e(".stats-leaderboard-time").text(Eb(Ua));
            e(".stats-highest-mass").text(~~(O / 100));
            e(".stats-cells-eaten").text(Ta);
            e(".stats-top-position").text(0 == S ? ":(" : S);
            var a = document.getElementById("statsGraph");
            if (a) {
                var b = a.getContext("2d"),
                    c = a.width,
                    a = a.height;
                b.clearRect(0, 0, c, a);
                if (2 < x.length) {
                    for (var d = 200, p = 0; p < x.length; p++) d = Math.max(x[p], d);
                    b.lineWidth = 3;
                    b.lineCap = "round";
                    b.lineJoin = "round";
                    b.strokeStyle = Ra;
                    b.fillStyle = Ra;
                    b.beginPath();
                    b.moveTo(0, a - x[0] / d * (a - 10) + 10);
                    for (p = 1; p < x.length; p += Math.max(~~(x.length / c), 1)) {
                        for (var f = p / (x.length - 1) * c, g = [], k = -20; 20 >= k; ++k) 0 > p + k || p + k >= x.length || g.push(x[p + k]);
                        g = g.reduce(function (a, b) {
                            return a + b
                        }) / g.length / d;
                        b.lineTo(f, a - g * (a - 10) + 10)
                    }
                    b.stroke();
                    b.globalAlpha = .5;
                    b.lineTo(c, a);
                    b.lineTo(0, a);
                    b.fill();
                    b.globalAlpha = 1
                }
            }
        }
        if (!d.agarioNoInit) {
            var ab = d.location.protocol,
                nb = "https:" == ab,
                da = ab + "//m.bubble.am/";
            if (nb && -1 == d.location.search.indexOf("fb")) d.location.href = "http://bubble.am/";
            else {
                var Ea = d.navigator.userAgent;

                var Ga, f, J, l, chatCanvas, q, ca = null,
                    r = null,
                    t = 0,
                    u = 0,
                    currMode = ':' + default_mode,
                    currSrv = '',
                    z = [],
                    h = [],
                    H = {},
                    v = [],
                    W = [],
                    w = [],
                    chatBoard = [],
                    ma = 0,
                    na = 0,
                    qa = -1,
                    ra = -1,
                    Xb = 0,
                    E = 0,
                    Cb = 0,
                    G = null,
                    wa = 0,
                    xa = 0,
                    ya = 1E4,
                    za = 1E4,
                    g = 1,
                    y = null,
                    Fb = !0,
                    Da = !0,
                    bb = !1,
                    Pa = !1,
                    O = 0,
                    Aa = !1,
                    Gb = !1,
                    showBorders = 1,
                    mapSize = 0,
                    chkha = '',
                    Qd = 0,
                    ia = t = ~~((wa + ya) / 2),
                    ja = u = ~~((xa + za) / 2),
                    hasOverlay = true,
                    ka = 1,
                    TaL = 1,
                    V = ':' + default_mode,
                    B = null,
                    Fa = !1,
                    Oa = !1,
                    Ma = 0,
                    Na = 0,
                    ua = 0,
                    va = 0,
                    Hb = 0,
                    $b = ["#333333", "#FF3333", "#33FF33", "#3333FF"],
                    Wa = !1,
                    ha = !1,
                    qb = 0,
                    D = null,
                    M = 0.6,
                    s = 1,
                    ea = !1,
                    Ia = 0,
                    La = {};
                (function () {
                    var a = d.location.search;
                    "?" == a.charAt(0) && (a = a.slice(1));
                    for (var a = a.split("&"), b = 0; b < a.length; b++) {
                        var c = a[b].split("=");
                        La[c[0]] = c[1]
                    }
                })();
                var db = "ontouchstart" in d && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(d.navigator.userAgent),
                    Xa = new Image;
                Xa.src = "img/split.png";
                var Ib = document.createElement("canvas");
                if ("undefined" == typeof console || "undefined" == typeof DataView || "undefined" == typeof WebSocket || null == Ib || null == Ib.getContext || null == d.localStorage) alert("You browser does not support this game, we recommend you to use Firefox to play this");
                else {
                    var sa = null;
                    d.setNick = function (a) {
                        if (logged == 1 && !ckcj()) bubbleSetOnline(true);

                        if (!cnjdfs) {
                            cnjdfs = true;
                            mb();
                        }
                        hideOverlay();
                        G = a;
                        vb();
                        O = 0
                    };
                    d.setRegion = pa;
                    d.setSkins = function (a) {
                        Fb = a
                        setCookieConfig('Skins', a);
                    };
                    d.setNames = function (a) {
                        setCookieConfig('Names', a);
                        Da = a
                    };
                    d.setDarkTheme = function (a) {
                        setCookieConfig('DarkTheme', a);
                        Aa = a
                    };
                    d.displayChat = function (a) {
                        if (a) {
                            e("#enableChat").css('display', 'inline');

                        } else {
                            e("#enableChat").css('display', 'none');
                        }
                        setCookieConfig('enableChat', a);
                    };

                    d.teamsAllowed = function (a) {
                        setCookieConfig('Teams', (a ? 1 : 0));
                        TaL = a;
                        closesck();
                    };

                    d.battleNotify = function (a, b) {
                        setCookieConfig(b == 12 ? 'Notify' : 'Notify11', a ? 1 : 0);
                        bubParm(b == 12 ? 0 : 2, a ? 1 : 0);
                    };

                    d.setShowBorders = function (a) {
                        showBorders = a;
                        setCookieConfig('setShowBorders', a);
                    };
                    d.setColors = function (a) {
                        setCookieConfig('Colors', a);
                        bb = a
                    };
                    d.setShowMass = function (a) {
                        setCookieConfig('ShowMass', a);
                        Gb = a
                    };
                    d.setShowOthersMass = function (a) {
                        setCookieConfig('ShowOthersMass', a);
                        Qd = a
                    };
                    d.spectate = function () {
                        G = null;
                        K(1);
                        hideOverlay()
                    };
                    d.currentMode = function () {
                        return currMode;
                    }
                    d.srvInfo = function () {
                        currSrv = currSrv.replace('ws://', '');
                        return currSrv + currMode;
                    };
                    d.isDarkTheme = function () {
                        return Aa;
                    };
                    d.setGameMode = function (a, c) {
                        currMode = a.substr(0, 3);

                        a != V && (V = a, L());

                        if (a.substr(0, 3) == ':11' || a.substr(0, 3) == ':12') {
                            setCookieConfig('mode', ':11');
                        } else {
                            setCookieConfig('mode', a);
                        }
                        e('.friends-online').hide();
                    };
                    d.setAcid = function (a) {
                        Wa = a
                    };
                    null != d.localStorage && (null == d.localStorage.AB9 && (d.localStorage.AB9 = 0 + ~~(100 * Math.random())), Hb = +d.localStorage.AB9, d.ABGroup = Hb);
                    var asdd = '1';
                    if (e.cookie('server')) {
                        asdd = e.cookie('server').split("-");
                        asdd = asdd[2];
                    }
                    var Ja = !0,
                        Nb = 0,
                        la = {
                            OO: asdd
                        },
                        N = null;
                    d.connect = Ka;
                    var ta = 500,
                        Va = null,
                        wb = 0,
                        xb = -1,
                        yb = -1,
                        A = null,
                        F = 1,
                        Ba = null,
                        gb = function () {
                            var a = Date.now(),
                                b = 1E3 / 60;
                            return function () {
                                d.requestAnimationFrame(gb);
                                var c = Date.now(),
                                    e = c - a;

                                e > b && (a = c - e % b, !isGameOn() || 240 > Date.now() - qb ? zb() : console.warn("Skipping draw"), dc())
                            }
                        }(),
                        $ = {},
                        Jb = "colombia;poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;chaplin;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;bubble;bubble.am;portugal;jamaica;rzcw;gimper;jkm;wykop;wykop.pl;zalukaj;zalukaj.tv;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ja po te vipy;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal;addonscity;facebook;putin;merkel;tsipras;ator;obama;kim jong-un;dilma;hollande".split(";"),
                        ec = "8;nasa;putin;merkel;tsipras;obama;kim jong-un;dilma;hollande;berlusconi;cameron;clinton;hillary;blatter;chavez;fidel;merkel;palin;queen;boris;bush;trump".split(";")

                        ,
                        skinsD = "".split(";"),
                        skinsDimg = {},
                        aa = {};
                    Ya.prototype = {
                        P: null,
                        x: 0,
                        y: 0,
                        g: 0,
                        b: 0
                    };
                    Y.prototype = {
                        id: 0,
                        a: null,
                        name: null,
                        k: null,
                        I: null,
                        x: 0,
                        y: 0,
                        size: 0,
                        o: 0,
                        p: 0,
                        n: 0,
                        C: 0,
                        D: 0,
                        m: 0,
                        T: 0,
                        K: 0,
                        W: 0,
                        A: !1,
                        f: !1,
                        j: !1,
                        L: !0,
                        S: 0,
                        V: null,
                        R: function () {
                            var a;
                            for (a = 0; a < v.length; a++)
                                if (v[a] == this) {
                                    v.splice(a, 1);
                                    break
                                }
                            delete H[this.id];
                            a = h.indexOf(this); - 1 != a && (Pa = !0, h.splice(a, 1));
                            a = z.indexOf(this.id); - 1 != a && z.splice(a, 1);
                            this.A = !0;
                            0 < this.S && W.push(this)
                        },
                        i: function () {
                            return Math.max(~~(.3 * this.size), 24)
                        },
                        t: function (a) {
                            if (this.name = a) null == this.k ? this.k = new Ca(this.i(), "#FFFFFF", !0, "#000000") : this.k.G(this.i()), this.k.u(this.name)
                        },
                        Q: function () {
                            for (var a = this.B(); this.a.length > a;) {
                                var b = ~~(Math.random() * this.a.length);
                                this.a.splice(b, 1)
                            }
                            for (0 == this.a.length && 0 < a && this.a.push(new Ya(this, this.x, this.y, this.size, Math.random() - .5)); this.a.length < a;) b = ~~(Math.random() * this.a.length), b = this.a[b], this.a.push(new Ya(this, b.x, b.y, b.g, b.b))
                        },
                        B: function () {
                            var a = 10;
                            20 > this.size && (a = 0);
                            this.f && (a = 30);
                            var b = this.size;
                            this.f || (b *= g);
                            b *= F;
                            this.T & 32 && (b *= .25);
                            return ~~Math.max(b, a)
                        },
                        da: function () {
                            this.Q();
                            for (var a = this.a, b = a.length, c = 0; c < b; ++c) {
                                var d = a[(c - 1 + b) % b].b,
                                    e = a[(c + 1) % b].b;
                                a[c].b += (Math.random() - .5) * (this.j ? 3 : 1);
                                a[c].b *= .7;
                                10 < a[c].b && (a[c].b = 10); - 10 > a[c].b && (a[c].b = -10);
                                a[c].b = (d + e + 8 * a[c].b) / 10
                            }
                            for (var f = this, h = this.f ? 0 : (this.id / 1E3 + E / 1E4) % (2 * Math.PI), c = 0; c < b; ++c) {
                                var k = a[c].g,
                                    d = a[(c - 1 + b) % b].g,
                                    e = a[(c + 1) % b].g;
                                if (15 <
                                    this.size && null != ca && 20 < this.size * g && 0 < this.id) {
                                    var l = !1,
                                        m = a[c].x,
                                        I = a[c].y;
                                    ca.ea(m - 5, I - 5, 10, 10, function (a) {
                                        a.P != f && 25 > (m - a.x) * (m - a.x) + (I - a.y) * (I - a.y) && (l = !0)
                                    });
                                    !l && (a[c].x < wa || a[c].y < xa || a[c].x > ya || a[c].y > za) && (l = !0);
                                    l && (0 < a[c].b && (a[c].b = 0), a[c].b -= 1)
                                }
                                k += a[c].b;
                                0 > k && (k = 0);
                                k = this.j ? (19 * k + this.size) / 20 : (12 * k + this.size) / 13;
                                a[c].g = (d + e + 8 * k) / 10;
                                d = 2 * Math.PI / b;
                                e = this.a[c].g;
                                this.f && 0 == c % 2 && (e += 5);
                                a[c].x = this.x + Math.cos(d * c + h) * e;
                                a[c].y = this.y + Math.sin(d * c + h) * e
                            }
                        },
                        J: function () {
                            if (0 >= this.id) return 1;
                            var a;
                            a = (E - this.K) / 120;
                            a = 0 > a ? 0 : 1 < a ? 1 : a;
                            var b = 0 > a ? 0 : 1 < a ? 1 : a;
                            this.i();
                            if (this.A && 1 <= b) {
                                var c = W.indexOf(this); - 1 != c && W.splice(c, 1)
                            }
                            this.x = a * (this.C - this.o) + this.o;
                            this.y = a * (this.D - this.p) + this.p;
                            this.size = b * (this.m - this.n) + this.n;
                            return b
                        },
                        H: function () {
                            return 0 >= this.id ? !0 : this.x + this.size + 40 < t - l / 2 / g || this.y + this.size + 40 < u - q / 2 / g || this.x - this.size - 40 > t + l / 2 / g || this.y - this.size - 40 > u + q / 2 / g ? !1 : !0
                        },
                        s: function (a) {
                            if (this.H()) {
                                ++this.S;
                                var b = 0 < this.id && !this.f && !this.j && .4 > g;
                                5 > this.B() && 0 < this.id && (b = !0);
                                if (this.L &&
                                    !b)
                                    for (var c = 0; c < this.a.length; c++) this.a[c].g = this.size;
                                this.L = b;
                                a.save();
                                this.W = E;
                                c = this.J();
                                this.A && (a.globalAlpha *= 1 - c);
                                a.lineWidth = 10;
                                a.lineCap = "round";
                                a.lineJoin = this.f ? "miter" : "round";
                                bb ? (a.fillStyle = "#FFFFFF", a.strokeStyle = "#AAAAAA") : (a.fillStyle = this.color, a.strokeStyle = this.color);
                                if (b) a.beginPath(), a.arc(this.x, this.y, this.size + 5, 0, 2 * Math.PI, !1);
                                else {
                                    this.da();
                                    a.beginPath();
                                    var d = this.B();
                                    a.moveTo(this.a[0].x, this.a[0].y);
                                    for (c = 1; c <= d; ++c) {
                                        var e = c % d;
                                        a.lineTo(this.a[e].x, this.a[e].y)
                                    }
                                }
                                a.closePath();
                                c = this.name.toLowerCase();
                                if (c && Fb && !this.j && ':1' != V && ':3' != V && ':8' != V) {

                                    var loadBub = -1;
                                    if (this.gid && this.gid > 0) {
                                        loadBub = this.gid;
                                    } else {
                                        if (-1 != Jb.indexOf(c)) {
                                            loadBub = c;

                                        }
                                    }

                                    if (loadBub != -1) {

                                        if (!$.hasOwnProperty(c) || $[c].skin != loadBub) {
                                            $[c] = new Image;
                                            if (loadBub > 100000000) {
                                                $[c].src = "//bubble.am/skins/custom/" + loadBub + '.png?0.2.34';
                                            } else if (loadBub >= 10 && loadBub <= 20) {
                                                $[c].src = "//bubble.am/img/battle_" + loadBub + '.png?0.2.34';
                                            } else {
                                                $[c].src = "//m.bubble.am/skins/" + loadBub + '.png?0.2.34';
                                            }
                                            $[c].skin = loadBub;
                                        }
                                        if (0 != $[c].width && $[c].complete) {
                                            d = $[c];
                                        } else {
                                            d = null;
                                        }
                                    } else {
                                        d = null;
                                    }
                                } else {
                                    d = null;
                                }

                                e = d;
                                b || a.stroke();
                                a.fill();
                                null != e && (a.save(), a.clip(), a.drawImage(e, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), a.restore());
                                (bb || 15 < this.size) &&
                                !b && (a.strokeStyle = "#000000", a.globalAlpha *= .1, a.stroke());
                                a.globalAlpha = 1;
                                d = -1 != h.indexOf(this);
                                if (d) {
                                    //                                console.log(this.id) // jebaÄ‡
                                    var my = w.filter((user) => {
                                        return this.id === user.id;
                                    });

                                    var myPositionRank = my && w.indexOf(my[0]) !== -1 && w.indexOf(my[0]) + 1;
                                    if (Number(myPositionRank)) { // czy jestem w topce
                                        console.log(w.indexOf(my[0]) + 1)
                                        if ((w.indexOf(my[0]) + 1) === 1) { // czy jestem top 1
                                            timer.start();
                                            console.log('jestem top 1')
                                        } else {
                                            console.log('chuj ci w dupe')
                                            timer.stop();
                                        }
                                    }

                                }
                                b = ~~this.y;
                                if (0 != this.id && (Da || d) && this.name && this.k && (null == e || -1 == ec.indexOf(c))) {
                                    e = this.k;
                                    e.u(this.name);
                                    e.G(this.i());
                                    c = 0 >= this.id ? 1 : Math.ceil(10 * g) / 10;
                                    e.U(c);
                                    var e = e.F(),
                                        f = ~~(e.width / c),
                                        l = ~~(e.height / c);
                                    a.drawImage(e, ~~this.x - ~~(f / 2), b - ~~(l / 2), f, l);
                                    b += e.height / 2 / c + 4
                                }
                                0 < this.id && Gb && (d || (0 == h.length || Qd) && (!this.f || this.j) && 80 < this.size) && (null == this.I && (this.I = new Ca(this.i() / 2, "#FFFFFF", !0, "#000000")), d = this.I, d.G(this.i() / 2), d.u(~~(this.size * this.size / 100)), c = Math.ceil(10 * g) / 10, d.U(c), e = d.F(), f = ~~(e.width / c), l = ~~(e.height / c), a.drawImage(e, ~~this.x - ~~(f / 2), b - ~~(l / 2), f, l));
                                a.restore()
                            }
                        }
                    };
                    Ca.prototype = {
                        w: "",
                        M: "#000000",
                        O: !1,
                        r: "#000000",
                        q: 16,
                        l: null,
                        N: null,
                        h: !1,
                        v: 1,
                        G: function (a) {
                            this.q != a && (this.q = a, this.h = !0)
                        },
                        U: function (a) {
                            this.v != a && (this.v = a, this.h = !0)
                        },
                        setStrokeColor: function (a) {
                            this.r != a && (this.r = a, this.h = !0)
                        },
                        u: function (a) {
                            a != this.w && (this.w = a, this.h = !0)
                        },
                        F: function () {
                            null == this.l && (this.l = document.createElement("canvas"), this.N = this.l.getContext("2d"));
                            if (this.h) {
                                this.h = !1;
                                var a = this.l,
                                    b = this.N,
                                    c = this.w,
                                    d = this.v,
                                    e = this.q,
                                    f = e + "px Ubuntu";
                                b.font = f;
                                var g = ~~(.2 * e);
                                a.width = (b.measureText(c).width + 6) * d;
                                a.height = (e + g) * d;
                                b.font = f;
                                b.scale(d, d);
                                b.globalAlpha = 1;
                                b.lineWidth = 3;
                                b.strokeStyle = this.r;
                                b.fillStyle = this.M;
                                this.O && b.strokeText(c, 3, e - g / 2);
                                b.fillText(c, 3, e - g / 2)
                            }
                            return this.l
                        },
                        Fff: function () {
                            null == this.l && (this.l = document.createElement("canvas"), this.N = this.l.getContext("2d"));
                            if (this.h) {
                                this.h = !1;
                                var a = this.l,
                                    b = this.N,
                                    c = this.w,
                                    d = this.v,
                                    e = this.q,
                                    f = e + "px Ubuntu";
                                b.font = f;
                                var g = ~~(.2 * e);
                                a.width = (b.measureText(c).width + 6) * d;
                                a.height = (e + g) * d;
                                b.font = f;
                                b.scale(d, d);
                                b.globalAlpha = 1;
                                b.lineWidth = 3;
                                b.strokeStyle = this.r;
                                b.fillStyle = this.M;
                                this.O && b.strokeText(c, 3, e - g / 2);
                                b.fillText(c, 3, e - g / 2)
                            }
                            return this.l
                        },
                        getWidth: function () {
                            return (f.measureText(this.w).width + 6);
                        }
                    };
                    Date.now || (Date.now = function () {
                        return (new Date).getTime()
                    });
                    (function () {
                        for (var a = ["ms", "moz", "webkit", "o"], b =
                                0; b < a.length && !d.requestAnimationFrame; ++b) d.requestAnimationFrame = d[a[b] + "RequestAnimationFrame"], d.cancelAnimationFrame = d[a[b] + "CancelAnimationFrame"] || d[a[b] + "CancelRequestAnimationFrame"];
                        d.requestAnimationFrame || (d.requestAnimationFrame = function (a) {
                            return setTimeout(a, 1E3 / 60)
                        }, d.cancelAnimationFrame = function (a) {
                            clearTimeout(a)
                        })
                    })();
                    var Mb = {
                            X: function (a) {
                                function b(a) {
                                    a < d && (a = d);
                                    a > f && (a = f);
                                    return ~~((a - d) / 32)
                                }

                                function c(a) {
                                    a < e && (a = e);
                                    a > g && (a = g);
                                    return ~~((a - e) / 32)
                                }
                                var d = a.ba,
                                    e = a.ca,
                                    f = a.Z,
                                    g = a.$,
                                    k = ~~((f - d) / 32) + 1,
                                    l = ~~((g - e) / 32) + 1,
                                    m = Array(k * l);
                                return {
                                    Y: function (a) {
                                        var d = b(a.x) + c(a.y) * k;
                                        null == m[d] ? m[d] = a : Array.isArray(m[d]) ? m[d].push(a) : m[d] = [m[d], a]
                                    },
                                    ea: function (a, d, e, f, g) {
                                        var n = b(a),
                                            p = c(d);
                                        a = b(a + e);
                                        d = c(d + f);
                                        if (0 > n || n >= k || 0 > p || p >= l) debugger;
                                        for (; p <= d; ++p)
                                            for (f = n; f <= a; ++f)
                                                if (e = m[f + p * k], null != e)
                                                    if (Array.isArray(e))
                                                        for (var h = 0; h < e.length; h++) g(e[h]);
                                                    else g(e)
                                    }
                                }
                            }
                        },
                        rb = function () {
                            var a = new Y(0, 0, 0, 32, "#ED1C24", ""),
                                b = document.createElement("canvas");
                            b.width = 32;
                            b.height = 32;
                            var c = b.getContext("2d");
                            return function () {
                                0 < h.length && (a.color = h[0].color, a.t(h[0].name));
                                c.clearRect(0, 0, 32, 32);
                                c.save();
                                c.translate(16, 16);
                                c.scale(.4, .4);
                                a.s(c);
                                c.restore();
                                var d = document.getElementById("favicon"),
                                    e = d.cloneNode(!0);
                                // e.setAttribute("href", b.toDataURL("image/png"));
                                d.parentNode.replaceChild(e, d)
                            }
                        }();
                    e(function () {
                        rb()
                    });
                    var T = "loginCache3";
                    var dc = function () {
                        function a(a, b, c, d, e) {
                            var f = b.getContext("2d"),
                                g = b.width;
                            b = b.height;
                            a.color = e;
                            a.t(c);
                            a.size = d;
                            f.save();
                            f.translate(g / 2, b / 2);
                            a.s(f);
                            f.restore()
                        }
                        for (var b = new Y(-1, 0, 0, 32, "#5bc0de", ""), c = new Y(-1, 0, 0, 32, "#5bc0de", ""), d = "#0791ff #5a07ff #ff07fe #ffa507 #ff0774 #077fff #3aff07 #ff07ed #07a8ff #ff076e #3fff07 #ff0734 #07ff20 #ff07a2 #ff8207 #07ff0e".split(" "), f = [], g = 0; g < d.length; ++g) {
                            var h = g / d.length * 12,
                                k = 30 * Math.sqrt(g / d.length);
                            f.push(new Y(-1, Math.cos(h) * k, Math.sin(h) * k, 10, d[g], ""))
                        }
                        ac(f);
                        var l = document.createElement("canvas");
                        l.getContext("2d");
                        l.width = l.height = 70;
                        a(c, l, "", 26, "#ebc0de");
                        return function () {
                            e(".cell-spinner").filter(":visible").each(function () {
                                var c = e(this),
                                    d = Date.now(),
                                    f = this.width,
                                    g = this.height,
                                    h = this.getContext("2d");
                                h.clearRect(0, 0, f, g);
                                h.save();
                                h.translate(f / 2, g / 2);
                                for (var k = 0; 10 > k; ++k) h.drawImage(l, (.1 * d + 80 * k) % (f + 140) - f / 2 - 70 - 35, g / 2 * Math.sin((.001 * d + k) % Math.PI * 2) - 35, 70, 70);
                                h.restore();
                                (c = c.attr("data-itr")) && (c = ga(c));
                                a(b, this, c || "", +e(this).attr("data-size"), "#5bc0de")
                            });
                            e("#statsPellets").filter(":visible").each(function () {
                                e(this);
                                var b = this.width,
                                    c = this.height;
                                this.getContext("2d").clearRect(0, 0, b, c);
                                for (b = 0; b < f.length; b++) a(f[b], this, "", f[b].size, f[b].color)
                            })
                        }
                    }();
                    var x = [],
                        Qa = 0,
                        Ra = "#000000",
                        U = !1,
                        Sa = !1,
                        sb = 0,
                        tb = 0,
                        Ua = 0,
                        Ta = 0,
                        S = 0,
                        ub = !0;
                    setInterval(function () {
                        Sa && x.push(Bb() / 100)
                    }, 1E3 / 60);
                    setInterval(function () {
                        var a = cc();
                        0 != a && (++Ua, 0 == S && (S = a), S = Math.min(S, a))
                    }, 1E3);
                    d.closeStats = function () {
                        if (e.cookie('add')) {
                            e.cookie("add", parseInt(e.cookie('add')) + 1, {
                                expires: 1
                            });
                            if (e.cookie('add') % 3 == 0) window.open('http://bubble.am/ind.php');

                        } else {
                            e.cookie("add", 1, {
                                expires: 1
                            });
                        }
                        U = 0;
                        kb(d.ab);
                        oa(0);
                        window.location.hash = '#home';
                    };
                    d.setSkipStats = function (a) {
                        ub = !a
                    };
                    e(function () {
                        e(Kb)
                    })
                }
            }
        }
    })
})(window, window.jQuery);