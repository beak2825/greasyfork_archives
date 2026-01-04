// ==UserScript==
// @name         Random small stuff i make when im bored in one
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  something something
// @author       rdm
// @match        http://zombs.io/
// @icon         -
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437232/Random%20small%20stuff%20i%20make%20when%20im%20bored%20in%20one.user.js
// @updateURL https://update.greasyfork.org/scripts/437232/Random%20small%20stuff%20i%20make%20when%20im%20bored%20in%20one.meta.js
// ==/UserScript==

// <1>

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return [r, g, b];
    }
    return null;
};

window.randomColor = function() {
    for (let i in game.world.entities) {
        if (game.world.entities[i].entityClass === "PlayerEntity") {
            var hexValue = "1234567890abcdef";
            var hexLength = 6;
            var hex = "";
            for (let i = 0; i < hexLength; i++) hex += hexValue[Math.floor(Math.random() * hexValue.length)];
            let hr = hexToRgb(hex);
            game.world.entities[i].currentModel.nameEntity.setColor(hr[0], hr[1], hr[2]);
        };
    };
};

window.resetColor = function() {
    for (let i in game.world.entities) {
        if (game.world.entities[i].entityClass === "PlayerEntity") {
            game.world.entities[i].currentModel.nameEntity.setColor(220, 220, 220);
        };
    };
};

// <1 />
// <2>

window.appendFakeMessage = function(message, author = "System") {
    let d = Game.currentGame.ui.getComponent("Chat").ui.createElement(`
    <div class="hud-chat-message">
        <strong>${author}</strong>: ${message}
    </div>
    `);
    Game.currentGame.ui.getComponent("Chat").messagesElem.appendChild(d);
    Game.currentGame.ui.getComponent("Chat").messagesElem.scrollTop = Game.currentGame.ui.getComponent("Chat").messagesElem.scrollHeight;
}

// <2 />
// <3>

function rng(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function simpleUUIDGen(length = 16) {
    let UUID = '';
    for (let i = 0; i < 16; i++) UUID += rng(0, 2);
    return UUID;
}

game.network.addEnterWorldHandler((initial) => {
    game.network.list = [initial.uid];

    const dataChannel = new BroadcastChannel('deez-nuts'),
          uuid = simpleUUIDGen();
    dataChannel.onmessage = (e) => {
        const data = e.data;
        if (data.uuid == uuid || game.network.connectionOptions.id == data.server) return;

        if (data.type == 'get') {
            if (!game.network.list.length) return;

            data.uid && game.network.list.push(data.uid);
            dataChannel.postMessage({
                uuid: uuid,
                type: 'post',
                list: game.network.list
            });
        };
        if (data.type == 'post') game.network.list = data.list;
    };
    dataChannel.postMessage({
        uuid: uuid,
        type: 'get',
        uid: initial.uid,
        server: game.network.connectionOptions.id
    });
})

game.ui.components.Leaderboard.update = function () {
    for (var currentGame = Game.currentGame, leaderboardElem = 0x0; leaderboardElem < this.leaderboardData.length; leaderboardElem++) {
        let playerData = this.leaderboardData[leaderboardElem],
            playerName = this.playerNames[playerData.uid];
        this.playerNames[playerData.uid] || (playerName = window.filterXSS(playerData.name), this.playerNames[playerData.uid] = playerName);
        leaderboardElem in this.playerElems || (

            this.playerElems[leaderboardElem] = this.ui.createElement('<div\x20class=\x22hud-leaderboard-player\x22></div>'),
            this.playerRankElems[leaderboardElem] = this.ui.createElement(`<span class="player-rank">-</span>`),
            this.playerNameElems[leaderboardElem] = this.ui.createElement(`<strong class="player-name">-</strong>`),
            this.playerScoreElems[leaderboardElem] = this.ui.createElement(`<span class="player-score">-</span>`),
            this.playerWaveElems[leaderboardElem] = this.ui.createElement('<span\x20class=\x22player-wave\x22>-</span>'),

            this.playerElems[leaderboardElem].appendChild(this.playerRankElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerNameElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerScoreElems[leaderboardElem]),
            this.playerElems[leaderboardElem].appendChild(this.playerWaveElems[leaderboardElem]),

            this.playersElem.appendChild(this.playerElems[leaderboardElem])
        );

        const target = game.network.list.find(uid => uid === playerData.uid);
        target ? this.playerElems[leaderboardElem].classList.add('is-active')
               : this.playerElems[leaderboardElem].classList.remove(`is-active`);

        this.playerElems[leaderboardElem].style.display = `block`;
        this.playerRankElems[leaderboardElem].innerText = '#' + (playerData.rank + 0x1);
        this.playerNameElems[leaderboardElem].innerText = playerName;
        this.playerScoreElems[leaderboardElem].innerText = playerData.score.toLocaleString();
        this.playerWaveElems[leaderboardElem].innerHTML = 0x0 === playerData.wave ? `<small>&mdash;</small>` : playerData.wave.toLocaleString();
    }
    if (this.leaderboardData.length < this.playerElems.length) {
        for (var iactuallydontknowwhattocallthis = this.leaderboardData.length - 0x1;
             iactuallydontknowwhattocallthis < this.playerElems.length;
             iactuallydontknowwhattocallthis++) {
            this.playerElems[iactuallydontknowwhattocallthis].style.display = `none`;
        }
    }
}

// <3 />