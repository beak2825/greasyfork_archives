// ==UserScript==
// @name         Fort chat helper
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  Fort battle helper
// @author       You
// @include https://*.the-west.*/game.php*
// @include https://*.the-west.*.*/game.php*
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491032/Fort%20chat%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/491032/Fort%20chat%20helper.meta.js
// ==/UserScript==


(function (fn) {
  // 🡱 🡳 🡰 🡲 ⇄
  // 34 x 24

  function improveMenuBar() {
    const style = document.createElement('style');

    style.textContent = `
      .fortbattle .button_retarget_offliners {
        display: block !important;
      }
      .fortbattle .button_retarget_tank_offliners {
        display: block !important;
      }
      .fortbattle .button_retarget_dps_offliners {
        display: block !important;
      }
      .fortbattle .button_forgo_flag {
        display: block !important;
      }
    `;

    document.head.appendChild(style);
  }


  GameMap.FBPlayerPrototype = function (name, cellIdx, isAlly) {
    this.name = name;
    this.cellIdx = cellIdx;
    this.isAlly = isAlly;
  };
  GameMap.FBPlayerPrototype.prototype = {
    getText: function () {
      return `${this.isAlly ? '/569' : '/955'} ${this.name} /999`;
    },
  };

  GameMap.FortHelper = {
    height: 24,
    width: 34,
    arrows: {
      up: "/991  ↑ /999",
      down: "/991  ↓ /999",
      left: "/991  ← /999",
      right: "/991  → /999",
      swap: "/991  ⇄ /999",
      //swap: "/991  🡰🡲 /999",
    },
    selectedPlayer: null,

    typeName(player) {
      this.type(player.getText())
    },

    typeMove(cellTo) {
      this.type(`${this.selectedPlayer.getText()} ${this.getMove(this.selectedPlayer.cellIdx, cellTo)}`);
    },

    typeSwap(currentPlayer) {
      let moveCommand =
        `${this.selectedPlayer.getText()} (${this.getMove(this.selectedPlayer.cellIdx, currentPlayer.cellIdx)})` +
        ` ${this.arrows.swap} ` +
        `${currentPlayer.getText()} (${this.getMove(currentPlayer.cellIdx, this.selectedPlayer.cellIdx)})`;
      this.type(moveCommand)

    },

    sendMoveMessage(cellTo) {
      Chat.Request.Tell(this.selectedPlayer.name, this.getMove(this.selectedPlayer.cellIdx, cellTo));
    },

    getMove(cellFrom, cellTo) {
      let y1 = Math.floor(cellFrom / this.width);
      let y2 = Math.floor(cellTo / this.width);
      let x1 = cellFrom % this.width;
      let x2 = cellTo % this.width;

      let vertical = y1 - y2;
      let verticalArrow = vertical > 0 ? `${Math.abs(vertical)} ${this.arrows.up}`
        : `${Math.abs(vertical)} ${this.arrows.down}`;
      let horizontal = x1 - x2;
      let horizontalArrow = horizontal < 0 ? `${Math.abs(horizontal)} ${this.arrows.right}`
        : `${horizontal} ${this.arrows.left}`;
      if (vertical == 0)
        return horizontalArrow;
      if (horizontal == 0)
        return verticalArrow;

      return `${verticalArrow} ${horizontalArrow}`
    },

    type: function (text) {
      var chat = $('input.message:visible');
      chat.val(`${chat.val()} ${text}`);
    },

  };

  var newScript = document.createElement('script');
  newScript.setAttribute("type", "application/javascript");
  newScript.textContent = '(' + fn + ')();';
  (document.body || document.head || document.documentElement).appendChild(newScript);
  newScript.parentNode.removeChild(newScript);
  improveMenuBar();

})(function () {
  FortBattleWindow.addPointerEventsOriginal = FortBattleWindow.addPointerEvents
  FortBattleWindow.addPointerEvents = function () {
    FortBattleWindow.addPointerEventsOriginal.call(this);
    var battlegroundEl = this.battlegroundEl;
    var that = this;

    var handler = function (e) {
      if (!e.shiftKey && !e.ctrlKey) {
        GameMap.FortHelper.selectedPlayer = null;
        return;
      }
      var cellIdx;
      var getCurCellIdx = function () {
        if (!cellIdx) cellIdx = that.getCellIdx(e);
        return cellIdx;
      };

      var hoverCellIdx = getCurCellIdx();
      var targetChar = that.charactersByPos[hoverCellIdx];
      let player;
      if (targetChar) {
        player = new GameMap.FBPlayerPrototype(targetChar.name, hoverCellIdx, that.ownPlayer.team == targetChar.team);
      }

      if (e.shiftKey && !e.ctrlKey && targetChar) {
        GameMap.FortHelper.typeName(player);
        return;
      }

      // ctrl
      if (targetChar && !GameMap.FortHelper.selectedPlayer) {
        GameMap.FortHelper.selectedPlayer = player;
        return;
      }

      if (e.ctrlKey && e.shiftKey && GameMap.FortHelper.selectedPlayer) {
        GameMap.FortHelper.sendMoveMessage(hoverCellIdx);
        GameMap.FortHelper.selectedPlayer = null;
        return;
      }

      if (targetChar && GameMap.FortHelper.selectedPlayer) {
        GameMap.FortHelper.typeSwap(player);
        GameMap.FortHelper.selectedPlayer = null;
      }

      if (!targetChar && GameMap.FortHelper.selectedPlayer) {
        GameMap.FortHelper.typeMove(hoverCellIdx);
      }


      if (!targetChar) {

        return;
      }



    };

    battlegroundEl.on(MouseEvent.POINTER_UP, handler);
  }
});
