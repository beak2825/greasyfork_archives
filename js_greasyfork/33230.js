// ==UserScript==
// @name         The-West Events
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Send Hearts/Rockets/Eggs/Pretzels to your friends automatically (traducido spanish)
// @include	https://*.the-west.*/game.php*
// @include	https://*.tw.innogames.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33230/The-West%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/33230/The-West%20Events.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.TWEvents = {
        eventTypes: {
            Easter: {
                item: "eggs"
            },
            Independence: {
                item: "rockets"
            },
            Hearts: {
                item: "hearts"
            },
            Octoberfest: {
                item: "pretzels"
            },
            DayOfDead: {
              item: "flowers"
            }
        },
        friendsbar: function() {
            return Game.sesData[this.event].friendsbar;
        },
        friendsBarUi: function () {
            var FriendsBar = WestUi.FriendsBar;
            if (!FriendsBar.friendsBarUi) {
                FriendsBar.friendsBarUi = new west.ui.FriendsBarUi();
                FriendsBar.friendsBarUi.setType('friends')
            }
            return FriendsBar.friendsBarUi.friendsBar;
        },
        service: {
            delay: 45,
            isRunning: false
        },
        maxPlayers: 50
    };

    TWEvents.checkEvent = function () {

        for (var event in this.eventTypes) {

            if (this.eventTypes.hasOwnProperty(event)) {

                if (Game.sesData.hasOwnProperty(event)) {
                    this.event = event;
                    return event;
                }

            }

        }

        return false;

    };

    TWEvents.gui = {};

    TWEvents.getFriends = function () {

        var event = this.event;

        var players = [];

        var friends = Chat.Friendslist.getFriends();
        var eventActivations = this.friendsBarUi().eventActivations;
        var friendsbar = this.friendsbar();

        var t, playerId, obj;

        for (var i = 0; i < friends.length; i++) {

            t = 0;
            playerId = friends[i].playerId;

            if (typeof eventActivations[playerId] != "undefined" && typeof eventActivations[playerId][event] != "undefined") {
                t = eventActivations[playerId][event] + parseInt(friendsbar.cooldown, 10) - (new ServerDate).getTime() / 1e3;
            }

            obj = {
                name: friends[i].pname,
                id: playerId,
                t: t
            };

            if (t <= 0){
                players.push(obj);
            }

        }

        return players;

    };

    TWEvents.stopService = function () {

        TWEvents.service.isRunning = false;

        wman.getById("TWEvents")
            .setTitle("Haz click en el botón de INICIO...");

        TWEvents.gui.button.setCaption("Inicio");

    };

    TWEvents.toggleService = function () {

        if (this.service.isRunning) {

            this.stopService();

        } else {

            this.service.isRunning = true;

            this.gui.button.setCaption("Detener");

            var event = this.event;

            wman.getById("TWEvents")
                .setTitle("Recogiendo a tus amigos...");

            Ajax.remoteCallMode("friendsbar", "search", {search_type: 'ses', search_term: event}, function (resp) {

                if (resp.error) {
                    this.stopService();
                    return new MessageError(resp.message).show();
                }

                this.friendsBarUi().setEventActivations_(resp.eventActivations);

                var friends = this.getFriends();

                if (friends.length) {

                    new MessageHint(friends.length > 50 ? "Se ha iniciado el envío. Tienes más de " + TWEvents.maxPlayers + " amigos, tienes que esperar " + TWEvents.service.delay + " segundos antes del siguiente envío " + TWEvents.eventTypes[TWEvents.event].item + "." : 'Envío iniciado.').show();

                    this.gui.loader.setValue(0);
                    this.gui.loader.setMaxValue(friends.length);

                    this.sendLoveCycle(friends, 0);

                } else {

                    this.stopService();

                    new MessageSuccess("¡No puedes enviar " + TWEvents.eventTypes[TWEvents.event].item + " a nadie!").show();

                }

            }.bind(this));

        }

    };

    TWEvents.sendLoveCycle = function (friends, start) {

        if (!this.service.isRunning)
            return;

        var count = friends.length - start > TWEvents.maxPlayers ? TWEvents.maxPlayers : friends.length - start;

        if (count < 0)
            return;

        wman.getById("TWEvents")
            .setTitle("Enviando " + TWEvents.eventTypes[TWEvents.event].item + " a " + count + " " + (count > 1 ? "jugadores" : "jugador") + "... (" + Math.ceil(start / TWEvents.maxPlayers + 1) + "/" + Math.ceil(friends.length / TWEvents.maxPlayers) + ")");

        TWEvents.sendLoveRecursive(friends, start + count, count);

    };

    TWEvents.sendLoveRecursive = function (friends, start, count) {

        if (this.service.isRunning) {

            if (count > 0) {

                var index = start - count;
                var id = friends[index].id;
                var event = this.event;
                var eventActivations = WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations;

                Ajax.remoteCall("friendsbar", "event", {player_id: id, event: event}, function (resp) {

                    if (resp.error)
                        new MessageError(resp.msg).show();

                    if (typeof eventActivations[id] != "undefined")
                        WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations[id][event] = resp.activationTime;

                    this.gui.loader.increase();

                    TWEvents.sendLoveRecursive(friends, start, --count);

                }.bind(this));

            } else if (start < friends.length) {

                var delay = this.service.delay;

                this.timer(delay - 1);

                this.service.delayTimeout = window.setTimeout(function() {
                    this.sendLoveCycle(friends, start);
                }.bind(this), (delay + 1) * 1000)

            } else {

                this.stopService();

                new MessageSuccess("Envío " + TWEvents.eventTypes[TWEvents.event].item + " terminado.").show();

            }

        }

    };

    TWEvents.timer = function (time) {

        if (time < 0 || !this.service.isRunning) return;

        window.setTimeout(function () {

            wman.getById("TWEvents")
                .setTitle("Por favor, espere " + time + " " + (time == 1 ? "segundo" : "segundos"));

            time--;

            this.timer(time);

        }.bind(this), 1000);

    };

    TWEvents.launch = function () {

        if (this.checkEvent() !== false) {

            this.gui.loader = new west.gui.Progressbar();
            this.gui.button = new west.gui.Button();

            this.gui.loader.setValue(0);
            this.gui.loader.setMaxValue(0);

            var content = $("<div style='padding: 10px'></div>");

            content.append($("<div style='padding-bottom: 10px'></div>").html(TWEvents.gui.loader.getMainDiv()));
            content.append($("<div style='padding-bottom: 10px'></div>").html(TWEvents.gui.button.setCaption("Inicio")
                .click(TWEvents.toggleService.bind(this)).getMainDiv()));

            wman.open("TWEvents")
                .setId("TWEvents")
                .setMiniTitle("TWEvents")
                .setTitle("Haz click en el botón de INICIO...")
                .setSize(500, 170)
                .appendToContentPane(content);

        } else {
            new MessageError("No hay ningún evento en ejecución...").show();
        }

    };

    TWEvents.inject = function () {

        $('#ui_menubar').append($('<div class="ui_menucontainer"><div class="menulink lfriends hasMousePopup" title="¡Siembra amor!" onclick="TWEvents.launch();"></div><div class="menucontainer_bottom"></div></div>'));

    };

    TWEvents.inject();

})();