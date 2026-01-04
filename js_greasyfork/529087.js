// ==UserScript==
// @name         ULR skip CPU
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  skip cpu
// @author       Me
// @match        https://www.playunlight.online/*
// @match        https://www.playunlight-dmm.com/?*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529087/ULR%20skip%20CPU.user.js
// @updateURL https://update.greasyfork.org/scripts/529087/ULR%20skip%20CPU.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitGame(callback) {
    const intervalID = setInterval(() => {
      if (window?.game?.scene) {
        clearInterval(intervalID);
        callback();
      }
    }, 100);
  }
  function patchedCreate() {
    this.ccInfo = this.cache.json.get('cc_asset');
    this.mcInfo = this.cache.json.get('mc_asset');
    this.mc_boss = this.cache.json.get('mc_boss');
    this.charaProfile = this.cache.json.get('charaProfile');
    this.eventInfo = this.cache.json.get('event_info');

    this.isPlayerA = false;
    new InitMain(this);

    this._chara1.hp = this.config.chara1_hp;
    if (this._chara2.filename != null) {
      this._chara2.hp = this.config.chara2_hp;
    }
    if (this._chara3.filename != null) {
      this._chara3.hp = this.config.chara3_hp;
    }

    this.cardArray = [];

    this.cards = [];
    this.swd1 = [];
    this.gun1 = [];
    this.shi1 = [];
    this.mov1 = [];
    this.spe1 = [];
    this.swd2 = [];
    this.gun2 = [];
    this.shi2 = [];
    this.mov2 = [];
    this.spe2 = [];
    this.draw = [];
    this.break = [];

    this.clicked = [];
    this.used = [];
    this.rotate = [];
    this.texture = [];

    this.additionalDraw = 0;

    this.initiative = false;

    this.socket.on('cardLeftB1', () => {
      var length = 0;
      for (let i = 0; i < this.cards.length; i++) {
        if (this.clicked[i] == 0 && this.used == 0) {
          length++;
        }
      }
      this.socket.emit('cardLeftB2', this.room, length, this.additionalDraw);
    });

    this.socket.on('drawPhase', (arrayB, arrayA) => {
      for (let i = 0; i < arrayB.length; i++) {
        this.texture.push({
          swd1: arrayB[i].swd1,
          gun1: arrayB[i].gun1,
          shi1: arrayB[i].shi1,
          mov1: arrayB[i].mov1,
          spe1: arrayB[i].spe1,
          swd2: arrayB[i].swd2,
          gun2: arrayB[i].gun2,
          shi2: arrayB[i].shi2,
          mov2: arrayB[i].mov2,
          spe2: arrayB[i].spe2,
          draw: 0,
          break: 0,
          heal: 0,
          holy: false,
          holy_enemy: false,
          rotate: false,
          clicked: false,
          used: false,
          texture: 'ac'
        });
      }
    });
    this.socket.on('cardDraw', (arrayB, arrayA) => {
      for (let i = 0; i < arrayB.length; i++) {
        this.texture.push({
          swd1: arrayB[i].swd1,
          gun1: arrayB[i].gun1,
          shi1: arrayB[i].shi1,
          mov1: arrayB[i].mov1,
          spe1: arrayB[i].spe1,
          swd2: arrayB[i].swd2,
          gun2: arrayB[i].gun2,
          shi2: arrayB[i].shi2,
          mov2: arrayB[i].mov2,
          spe2: arrayB[i].spe2,
          draw: 0,
          break: 0,
          heal: 0,
          holy: false,
          holy_enemy: false,
          rotate: false,
          clicked: false,
          used: false,
          texture: 'ac'
        });
      }
    });
    this.socket.on('eventCard', (event, a) => {
      if (event != null) {
        this.texture.push({
          swd1: event.swd1,
          gun1: event.gun1,
          shi1: event.shi1,
          mov1: event.mov1,
          spe1: event.spe1,
          swd2: event.swd2,
          gun2: event.gun2,
          shi2: event.shi2,
          mov2: event.mov2,
          spe2: event.spe2,
          draw: event.draw,
          break: event.break,
          heal: event.heal,
          holy: event.holy,
          holy_enemy: event.holy_enemy,
          rotate: false,
          clicked: false,
          used: false,
          texture: 'event'
        });
      }
    });

    this.socket.on('cardRob_B', (array) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].card.type == 'ac') {
          this.texture.push({
            swd1: array[i].card.swd1,
            gun1: array[i].card.gun1,
            shi1: array[i].card.shi1,
            mov1: array[i].card.mov1,
            spe1: array[i].card.spe1,
            swd2: array[i].card.swd2,
            gun2: array[i].card.gun2,
            shi2: array[i].card.shi2,
            mov2: array[i].card.mov2,
            spe2: array[i].card.spe2,
            draw: 0,
            break: 0,
            heal: 0,
            holy: false,
            holy_enemy: false,
            rotate: array[i].card.rotate,
            clicked: false,
            used: false,
            texture: 'ac'
          });
        } else {
          this.texture.push({
            swd1: array[i].card.swd1,
            gun1: array[i].card.gun1,
            shi1: array[i].card.shi1,
            mov1: array[i].card.mov1,
            spe1: array[i].card.spe1,
            swd2: array[i].card.swd2,
            gun2: array[i].card.gun2,
            shi2: array[i].card.shi2,
            mov2: array[i].card.mov2,
            spe2: array[i].card.spe2,
            draw: array[i].card.draw,
            break: array[i].card.break,
            heal: array[i].card.heal,
            holy: array[i].card.holy,
            holy_enemy: array[i].card.holy_enemy,
            rotate: array[i].card.rotate,
            clicked: false,
            used: false,
            texture: 'event'
          });
        }
      }
    });

    this.socket.on('cardRob_A', (array) => {
      for (let i = 0; i < array.length; i++) {
        this.texture[array[i].cardindex].used = true;
      }
    });

    this.socket.on('cardBack', (array, l) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].type == 'ac') {
          this.texture.push({
            swd1: array[i].swd1,
            gun1: array[i].gun1,
            shi1: array[i].shi1,
            mov1: array[i].mov1,
            spe1: array[i].spe1,
            swd2: array[i].swd2,
            gun2: array[i].gun2,
            shi2: array[i].shi2,
            mov2: array[i].mov2,
            spe2: array[i].spe2,
            draw: 0,
            break: 0,
            heal: 0,
            holy: false,
            holy_enemy: false,
            rotate: array[i].rotate,
            clicked: false,
            used: false,
            texture: 'ac'
          });
        } else {
          this.texture.push({
            swd1: array[i].swd1,
            gun1: array[i].gun1,
            shi1: array[i].shi1,
            mov1: array[i].mov1,
            spe1: array[i].spe1,
            swd2: array[i].swd2,
            gun2: array[i].gun2,
            shi2: array[i].shi2,
            mov2: array[i].mov2,
            spe2: array[i].spe2,
            draw: array[i].draw,
            break: array[i].break,
            heal: array[i].heal,
            holy: array[i].holy,
            holy_enemy: array[i].holy_enemy,
            rotate: array[i].rotate,
            clicked: false,
            used: false,
            texture: 'event'
          });
        }
      }
    });

    this.socket.on('initiativeA', () => {
      this.initiative = false;
    });
    this.socket.on('initiativeB', () => {
      this.initiative = true;
    });

    this.socket.on('distance', (value) => {
      this.distance = value;
    });

    this.socket.on('endGame_A', (result) => {
      this.socket.emit('leaveRoom', this.room);
      this.socket.disconnect();
      this.scene.stop('MainCPU');
    });

    this.socket.on('chara_A', (chara1, chara2, chara3) => {
      this._chara1 = chara1;
      this._chara2 = chara2;
      this._chara3 = chara3;
    });

    this.socket.on('endMovePhase', (phase) => {
      this.arr = [];
      this.phase = phase;
      this.isEnd = false;

      if (this.phase == 'change') {
        var chara = [];
        if (this.chara1.hp != 0) {
          chara.push({
            index: 0,
            hp: this.chara1.hp
          });
        }
        if (this.chara2.hp != 0) {
          chara.push({
            index: 1,
            hp: this.chara2.hp
          });
        }
        if (this.chara3.hp != 0) {
          chara.push({
            index: 2,
            hp: this.chara3.hp
          });
        }

        setTimeout(() => {
          this.socket.emit('changeReady', this.room, chara[0].index, this.id);
        }, 3000);
      }
    });

    this.socket.on('endPhase', (phase) => {
      this.arr = [];
      this.phase = phase;
      this.isEnd = false;

      if (this.phase == 'change') {
        var chara = [];
        if (this.chara1.hp != 0) {
          chara.push({
            index: 0,
            hp: this.chara1.hp
          });
        }
        if (this.chara2.hp != 0) {
          chara.push({
            index: 1,
            hp: this.chara2.hp
          });
        }
        if (this.chara3.hp != 0) {
          chara.push({
            index: 2,
            hp: this.chara3.hp
          });
        }

        setTimeout(() => {
          this.socket.emit('changeReady', this.room, chara[0].index, this.id);
        }, 3000);
      }
    });

    this.socket.on('endDrawPhase', () => {
      this.phase = 'move';
      this.isEnd = false;
    });

    this.socket.on('cardBreakB', (array) => {
      for (let i = 0; i < array.length; i++) {
        this.texture[array[i].cardindex].used = true;
      }
    });

    this.socket.on('endGame_B', (a) => {
      this.socket.disconnect();
    });

    this.socket.on('chara_B', (chara1, chara2, chara3) => {
      this.chara1 = chara1;
      this.chara2 = chara2;
      this.chara3 = chara3;
    });

    this.arr = [];
    this.isEnd = false;
    this.socket.on('cardController1B', async () => {
      this.cardAllow = true;
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));

      let events = [];
      let cards = this.texture.flatMap(({ used, clicked }, index) =>
        used === false && clicked === false ? index : []
      );
      let eventcards = [];
      if (this.phase === 'move') {
        eventcards = this.texture.flatMap((value, index) =>
          value.used === false &&
          value.clicked === false &&
          (value.draw > 0 || value.heal > 0 || value.holy === true)
            ? index
            : []
        );
      } else {
        eventcards = this.texture.flatMap((value, index) =>
          value.used === false &&
          value.clicked === false &&
          (value.draw > 0 ||
            value.heal > 0 ||
            value.holy === true ||
            value.break > 0 ||
            value.holy_enemy === true)
            ? index
            : []
        );
      }

      // override eventcards
      eventcards = [];

      if (eventcards.length > 0) {
        this.socket.emit('card', this.room, this.id, eventcards[0]);
        (this.texture[eventcards[0]].used = true),
        (this.texture[eventcards[0]].clicked = true);
        return;
      }

      if (this.phase === 'attack') {
        if (this.distance === 0) {
          for (let i = 0; i < cards.length; i++) {
            if (
              this.texture[cards[i]].rotate === false &&
              this.texture[cards[i]].swd1 > 0
            ) {
              events.push({ type: 'card', index: cards[i] });
            } else if (
              this.texture[cards[i]].rotate === true &&
              this.texture[cards[i]].swd2 > 0
            ) {
              events.push({ type: 'card', index: cards[i] });
            } else if (
              this.texture[cards[i]].rotate === false &&
              this.texture[cards[i]].swd2 > 0
            ) {
              events.push({
                type: 'rotate',
                index: cards[i]
              }),
              events.push({
                type: 'card',
                index: cards[i]
              });
            } else if (
              this.texture[cards[i]].rotate === true &&
              this.texture[cards[i]].swd1 > 0
            ) {
              events.push({
                type: 'rotate',
                index: cards[i]
              }),
              events.push({
                type: 'card',
                index: cards[i]
              });
            } else if (
              this.texture[cards[i]].swd1 === 0 &&
              this.texture[cards[i]].swd2 === 0 &&
              this.initiative === false
            ) {
              const rnd = Math.random();
              if (rnd < 0.5) {
                events.push({
                  type: 'rotate',
                  index: cards[i]
                });
              }
              events.push({ type: 'card', index: cards[i] });
            }
          }
        } else if (this.distance > 0) {
          for (let i = 0; i < cards.length; i++) {
            if (
              this.texture[cards[i]].rotate === false &&
              this.texture[cards[i]].gun1 > 0
            ) {
              events.push({ type: 'card', index: cards[i] });
            } else if (
              this.texture[cards[i]].rotate === true &&
              this.texture[cards[i]].gun2 > 0
            ) {
              events.push({ type: 'card', index: cards[i] });
            } else if (
              this.texture[cards[i]].rotate === false &&
              this.texture[cards[i]].gun2 > 0
            ) {
              events.push({
                type: 'rotate',
                index: cards[i]
              }),
              events.push({
                type: 'card',
                index: cards[i]
              });
            } else if (
              this.texture[cards[i]].rotate === true &&
              this.texture[cards[i]].gun1 > 0
            ) {
              events.push({
                type: 'rotate',
                index: cards[i]
              }),
              events.push({
                type: 'card',
                index: cards[i]
              });
            } else if (
              this.texture[cards[i]].gun1 === 0 &&
              this.texture[cards[i]].gun2 === 0 &&
              this.initiative === false
            ) {
              const rnd = Math.random();
              if (rnd < 0.5) {
                events.push({
                  type: 'rotate',
                  index: cards[i]
                });
              }
              events.push({ type: 'card', index: cards[i] });
            }
          }
        } else if (this.distance === null) {
          let swdsum = 0;
          let gunsum = 0;
          for (let i = 0; i < cards.length; i++) {
            (swdsum +=
              this.texture[cards[i]].swd1 + this.texture[cards[i]].swd2),
            (gunsum +=
                this.texture[cards[i]].gun1 + this.texture[cards[i]].gun2);
          }
          let distance_assume = 0;
          if (gunsum > swdsum) {
            distance_assume = 1;
          }

          let card_type = 'swd';
          let card_type_other = 'gun';
          if (distance_assume != 0) {
            (card_type = 'gun'), (card_type_other = 'swd');
          }

          for (let i = 0; i < cards.length; i++) {
            switch (true) {
            case this.texture[cards[i]].rotate === true &&
                this.texture[cards[i]][`${card_type}2`] > 0:
            case this.texture[cards[i]].rotate === false &&
                this.texture[cards[i]][`${card_type}1`] > 0: {
              events.push({
                type: 'card',
                index: cards[i]
              });
              break;
            }
            case this.texture[cards[i]].rotate === true &&
                this.texture[cards[i]][`${card_type}1`] > 0:
            case this.texture[cards[i]].rotate === false &&
                this.texture[cards[i]][`${card_type}2`] > 0: {
              events.push({
                type: 'rotate',
                index: cards[i]
              });
              events.push({
                type: 'card',
                index: cards[i]
              });
              break;
            }
            case this.initiative === false &&
                this.texture[cards[i]].rotate === false &&
                this.texture[cards[i]][`${card_type_other}1`] === 0 &&
                this.texture[cards[i]][`${card_type_other}2`] === 0: {
              const card_rotate = Math.random();
              if (card_rotate < 0.5) {
                events.push({
                  type: 'rotate',
                  index: cards[i]
                });
              }
              events.push({
                type: 'card',
                index: cards[i]
              });
              break;
            }
            case this.initiative === false &&
                this.texture[cards[i]].rotate === false &&
                this.texture[cards[i]][`${card_type_other}1`] === 0 &&
                this.texture[cards[i]][`${card_type_other}2`] > 0:
            case this.initiative === false &&
                this.texture[cards[i]].rotate === true &&
                this.texture[cards[i]][`${card_type_other}2`] === 0 &&
                this.texture[cards[i]][`${card_type_other}1`] > 0: {
              events.push({
                type: 'card',
                index: cards[i]
              });
              break;
            }
            case this.initiative === false &&
                this.texture[cards[i]].rotate === false &&
                this.texture[cards[i]][`${card_type_other}1`] > 0 &&
                this.texture[cards[i]][`${card_type_other}2`] === 0:
            case this.initiative === false &&
                this.texture[cards[i]].rotate === true &&
                this.texture[cards[i]][`${card_type_other}2`] > 0 &&
                this.texture[cards[i]][`${card_type_other}1`] === 0: {
              events.push({
                type: 'rotate',
                index: cards[i]
              });
              events.push({
                type: 'card',
                index: cards[i]
              });
              break;
            }
            }
          }
        }
      } else if (this.phase === 'defense') {
        for (let i = 0; i < cards.length; i++) {
          if (
            (this.texture[cards[i]].rotate === false &&
              this.texture[cards[i]].shi1 > 0) ||
            (this.texture[cards[i]].rotate === true &&
              this.texture[cards[i]].shi2 > 0)
          ) {
            events.push({ type: 'card', index: cards[i] });
          } else if (
            (this.texture[cards[i]].rotate === false &&
              this.texture[cards[i]].shi2 > 0) ||
            (this.texture[cards[i]].rotate === true &&
              this.texture[cards[i]].shi1 > 0)
          ) {
            events.push({ type: 'rotate', index: cards[i] });
            events.push({ type: 'card', index: cards[i] });
          } else if (this.initiative === true) {
            const rnd = Math.random();
            if (rnd < 0.5) {
              events.push({
                type: 'rotate',
                index: cards[i]
              });
            }
            events.push({ type: 'card', index: cards[i] });
          }
        }
      } else if (this.phase === 'move') {
        let swdsum = 0;
        let gunsum = 0;
        const card_tmp = structuredClone(
          this.texture.filter(
            ({ used, clicked }) => used === false && clicked === false
          )
        );
        for (let i = 0; i < card_tmp.length; i++) {
          card_tmp[i].swd1 === card_tmp[i].swd2
            ? (swdsum += card_tmp[i].swd1)
            : (swdsum += card_tmp[i].swd1 + card_tmp[i].swd2);
          card_tmp[i].gun1 === card_tmp[i].gun2
            ? (gunsum += card_tmp[i].gun1)
            : (gunsum += card_tmp[i].gun1 + card_tmp[i].gun2);
        }
        let select = 'stay';
        let select_type = null;
        if (swdsum > gunsum) {
          select_type = 'swd';
        }
        if (swdsum < gunsum) {
          select_type = 'gun';
        }
        if (swdsum === gunsum) {
          const rnd = Math.random();
          rnd < 0.5 ? (select_type = 'swd') : (select_type = 'gun');
        }
        cards = this.texture.flatMap((value, index) =>
          value.used === false &&
          value.clicked === false &&
          (value.mov1 > 0 || value.mov2 > 0) &&
          value[`${select_type}1`] + value[`${select_type}2`] === 0
            ? index
            : []
        );
        if (cards.length > 0 && select_type === 'swd') {
          select = 'front';
        }
        if (cards.length > 0 && select_type === 'gun') {
          select = 'back';
        }
        if (this.chara.hp === 1 && this.chara.hp_max > 1) {
          select = 'stay';
        }

        for (let i = 0; i < cards.length; i++) {
          if (
            select_type === 'swd' &&
            this.texture[cards[i]].swd1 + this.texture[cards[i]].swd2 > 0
          ) {
            continue;
          }
          if (
            select_type === 'gun' &&
            this.texture[cards[i]].gun1 + this.texture[cards[i]].gun2 > 0
          ) {
            continue;
          }

          if (
            (this.texture[cards[i]].rotate === false &&
              this.texture[cards[i]].mov1 > 0) ||
            (this.texture[cards[i]].rotate === true &&
              this.texture[cards[i]].mov2 > 0)
          ) {
            events.push({ type: 'card', index: cards[i] });
          } else {
            events.push({ type: 'rotate', index: cards[i] });
            events.push({ type: 'card', index: cards[i] });
          }
        }

        // ignore move_select
        // this.socket.emit('move_select', this.room, this.id, select);
      }

      // override events
      events = [];

      for (let i = 0; i < events.length; i++) {
        this.socket.emit(events[i].type, this.room, this.id, events[i].index);
        (this.texture[events[i].index].clicked = true),
        (this.texture[events[i].index].used = true);
        await new Promise((resolve, reject) => setTimeout(resolve, 350));
      }

      this.events.emit('CPU_turn_end');

      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      this.socket.emit('I_am_ok', this.room, this.id);
    });

    this.socket.on('cardController2B', () => {
      this.cardAllow = false;
    });

    this.socket.on('cc058_sk01_destroy', (value) => {
      this.distance = value;
    });

    this.socket.emit('gameReady', this.room, false);
  }

  function overwriteCPU() {
    const cpu = window.game.scene.keys.MainCPU;
    cpu.create = patchedCreate.bind(cpu);
  }

  waitGame(overwriteCPU);
})();
