// ==UserScript==
// @name         ULR dmm unban
// @description  If you know, you know.
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @match        https://www.playunlight-dmm.com/?*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523013/ULR%20dmm%20unban.user.js
// @updateURL https://update.greasyfork.org/scripts/523013/ULR%20dmm%20unban.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const checkGameInterval = setInterval(() => {
    if (window.game && window.game.scene) {
      clearInterval(checkGameInterval);
      patchSceneStart();
    }
  }, 10);

  async function patched_unlight_init_create() {
    var url = location.serch;
    var getParam = (name, url) => {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };
    this.owner = Number(getParam('owner'));
    this.cdp_id = getParam('cdp_id');

    this.id = undefined;
    if (
      this.owner != undefined &&
      this.owner != null &&
      this.cdp_id != undefined &&
      this.cdp_id != null
    ) {
      this.id = await new Promise((resolve, reject) => {
        this.socket.emit('getid', this.owner, this.cdp_id);
        this.socket.on('getid', (id) => {
          resolve(id);
        });
      });
    }

    if (this.id === undefined) {
      return false;
    }

    // loader ==================================================================
    this.scene.launch('Loader');
    UL_LOADER = /** @type {UL_LOADER} */ (this.scene.get('Loader'));
    // =========================================================================

    this.scene.launch('ConnectionCheck', { id: this.id });
    if (this.id.includes('guest_') === true) {
      if (this.MAINTENANCE) this.scene.start('Title_Maintain', { id: this.id });
      else
        this.scene.start('Unlight', {
          id: this.id,
          owner: this.owner,
          cdp_id: this.cdp_id
        });

      return false;
    }

    let userType = await new Promise((resolve, reject) => {
      this.socket.on('playercheck', (type) => resolve(type));
      this.socket.emit('playercheck', this.id);
    });
    // use old api
    this.socket = io.connect(`https://www.playunlight-dmm.com:${11002}`);
    if (this.MAINTENANCE) {
      if (userType == 'developer' || userType == 'staff') {
        if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
          this.socket.disconnect();
          this.scene.start('Title_Maintain');
        } else this.socket.emit('db_player', this.id);
      } else {
        this.socket.disconnect();
        this.scene.start('Title_Maintain', { id: this.id });
      }
    } else {
      if (navigator.userAgent.match(/iPhone|Android.+Mobile/))
        this.scene.start('Title_Maintain');
      else this.socket.emit('db_player', this.id);
    }

    this.socket.on('db_player', (results) => {
      const data = results[0];
      volume_bgm = data.volume_bgm / 100;
      volume_se = data.volume_se / 100;
      volume_voice = data.volume_voice / 100;

      lang = data.lang;

      this.socket.disconnect();
      this.scene.start('Unlight', {
        id: this.id,
        owner: this.owner,
        cdp_id: this.cdp_id
      });
    });
    /*
    this.socket.on('banned', () => {
      this.socket.disconnect();
      this.msg = {
        ja: ['', 'あなたのアカウントは現在ロックされています'],
        en: ['', 'Your account has been locked.'],
        kr: ['', '사용중인 계정은 잠겨있습니다.'],
        scn: ['', '现在您的帐号已被锁定'],
        tcn: ['', '您的帳號正被封鎖中']
      }

      const rect = new Phaser.Geom.Rectangle(0, 0, 760, 680);
      const graphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
      graphics.fillRectShape(rect).setAlpha(0.5);
      this.text = this.add.text(380, 334, this.msg.ja[1], { fontFamily: 'font_light', fontSize: 15, resolution: 2, align: 'center' }).setOrigin(0.5, 0.5).setDepth(2);
      this.panel = this.add.nineslice(380, 340, 'panel_gene', 0, this.text.width + 18, 140, 71, 40, 63, 32).setDepth(1);
      this.label = this.add.text(380 - this.panel.width / 2 + 3, 285, this.msg.ja[0], { fontFamily: 'font_heavy', fontSize: 18, resolution: 2, color: 'black' }).setOrigin(0, 0.5).setDepth(2);
    });
    */
  }

  function patchSceneStart() {
    const originalStart = window.game.scene.start;
    window.game.scene.start = function (sceneKey, ...args) {
      console.log(`Starting scene: ${sceneKey}`);
      if (sceneKey === 'Unlight_Init') {
        console.log('Patching Unlight_Init instance');
        window.game.scene.keys.Unlight_Init.create =
          patched_unlight_init_create;
      }
      return originalStart.apply(this, arguments);
    };
  }
})();
