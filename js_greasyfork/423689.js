// ==UserScript==
// @name        雀魂麻将脚本
// @description 用于雀魂麻将的简易脚本
// @namespace   game.maj-soul.com
// @match       *://game.maj-soul.com/1/
// @icon        https://game.maj-soul.com/1/favicon.ico
// @grant       none
// @version     1.9
// @author      bin
// @downloadURL https://update.greasyfork.org/scripts/423689/%E9%9B%80%E9%AD%82%E9%BA%BB%E5%B0%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423689/%E9%9B%80%E9%AD%82%E9%BA%BB%E5%B0%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const setColor = (pai, color, force = false) => {
  if (pai == null) return;
  if (!force && ("lastColor" in pai)) return;
  pai.lastColor = color;
  pai.model.meshRender.sharedMaterial.setColor(caps.Cartoon.COLOR, pai.lastColor);
}
// 不需要的功能只需要在对应的大括号前加上`/*`
const runner = () => {
  { // js弹出框替换
    /**
     * 提示框
     * @param {(text:string)=>void} text "sometext"
     * @param {boolean} short 为true时表示弹出框是否需要手动关闭(item get)
     */
    window.alert = (text, short) => {
      if (!short) uiscript.UI_InfoLite.Inst.show(text);
      else uiscript.UI_LightTips.Inst.show(text);
    };
    /**
     * 确认框
     * @param {string} text 内容
     * @param {()=>void} fix 确定按钮回调函数
     * @param {()=>void} cancel 取消按钮回调函数
     */
    window.confirm = (text, fix, cancel) => {
      text == undefined && (text = null);
      fix == undefined && (fix = null);
      cancel == undefined && (cancel = null);
      let a = new uiscript.UI_SecondConfirm();
      a.onCreate();
      uiscript.UIMgr.Inst.AddLobbyUI(a);
      Laya.timer.frameOnce(5, this, () => {
        a.show(text, new Laya.Handler(window, fix), new Laya.Handler(window, cancel));
      })
    };
    /**
     * 输入框
     * @param {string} title 标题 
     * @param {string} tipsText 输入提示
     * @param {(text:string)=>boolean} fix 确定按钮回调函数,参数为文本框中的内容,返回true时防止关闭UI
     * @param {()=>boolean} cancel 取消按钮回调函数,返回true时防止关闭UI
     * @param {string} fixText 确认按钮显示的文本,默认为确认
     * @param {string} cancelText 取消按钮显示的文本,默认为取消
     */
    window.prompt = (title, tipsText, fix, cancel, fixText, cancelText) => {
      title == undefined && (title = null);
      tipsText == undefined && (tipsText = null);
      typeof fix == "function" || (fix = e => false);
      typeof cancel == "function" || (cancel = e => false);
      fixText == undefined && (fixText = "取消");
      cancelText == undefined && (cancelText = "确定");
      let a = new uiscript.UI_Nickname();
      // a.onCreate();
      uiscript.UIMgr.Inst.AddLobbyUI(a);
      Laya.timer.frameOnce(5, this, () => {
        a.root._childs[2]._$set_text(title);
        a.root._childs[4]._$set_text(tipsText);
        a.root._childs[10]._childs[0]._$set_text(fixText);
        a.root._childs[10].clickHandler = new Laya.Handler(window, e => !cancel() && a.destroy())
        a.root._childs[8]._childs[0]._$set_text(cancelText);
        a.root._childs[8].clickHandler = new Laya.Handler(window, e => !fix(a.input.text) && a.destroy());
        a.show();
      });
    };
    /**
     * 数字输入框,最大支持输入10位数
     * @param {string} text 内容
     * @param {(num:number)=>void} fix 确定按钮回调函数,参数为输入的数字
     * @param {()=>void} cancel 取消按钮回调函数
     */
    window.numberPrompt = (text, fix, cancel) => {
      text == undefined && (text = null);
      fix == undefined && (fix = null);
      cancel == undefined && (cancel = null);
      let a = new uiscript.UI_NumberInput();
      uiscript.UIMgr.Inst.AddLobbyUI(a);
      Laya.timer.frameOnce(5, this, () => {
        a.show(text, new Laya.Handler(window, fix), new Laya.Handler(window, cancel));
      });
    }
    console.log("js弹出框替换 开");
  } //*/
  { // 副露占位
    let color = new Laya.Vector4(1, 1, 1, .4);
    const QiPaiNoPass = view.Block_QiPai.prototype.QiPaiNoPass;
    view.Block_QiPai.prototype.QiPaiNoPass = function () {
      try {
        setColor(this.last_pai, color, true)
        this.last_pai.model.meshRender.sharedMaterial.blend = 2;
        this.last_pai.val.type += 10;
        this.QiPaiPass();
      } catch (e) {
        QiPaiNoPass.call(this)
        console.error(e);
      }
    }

    const OnChoosedPai = view.ViewPai.prototype.OnChoosedPai;
    view.ViewPai.prototype.OnChoosedPai = function () {
      try {
        let e = view.DesktopMgr.Inst.choosed_pai;
        if (null == e || 0 != mjcore.MJPai.Distance(this.val, e)) {
          if (this.lastColor !== undefined) {
            this.model.meshRender.sharedMaterial.setColor(caps.Cartoon.COLOR, this.lastColor);
          } else if (this.isxuezhanhu || this.ispaopai) {
            this.model.meshRender.sharedMaterial.setColor(caps.Cartoon.COLOR, new Laya.Vector4(1, .78, .78, 1));
          } else if (this.ismoqie) {
            this.model.meshRender.sharedMaterial.setColor(caps.Cartoon.COLOR, new Laya.Vector4(.8, .8, .8, 1));
          } else {
            this.model.meshRender.sharedMaterial.setColor(caps.Cartoon.COLOR, this.GetDefaultColor());
          }
        } else {
          this.model.meshRender.sharedMaterial.setColor(caps.Cartoon.COLOR, new Laya.Vector4(.615, .827, .976, 1));
        }
      } catch (e) {
        OnChoosedPai.call(this);
        console.error(e)
      }
    }
    console.log("副露占位 开");
  } //*/ 
  { // 强制开启便捷提示
    const initRoom = view.DesktopMgr.prototype.initRoom;
    view.DesktopMgr.prototype.initRoom = function (...args) {
      try {
        args[0].mode.detail_rule.bianjietishi = true;
      } catch (e) {
        console.warn(e);
      }
      return initRoom.call(this, ...args);
    }
    console.log("便捷提示 开");
  } //*/
  { // 电脑随机皮肤
    let players = [0, 0, 0, 0];
    players.get = function () {
      for (let i = 0; i < 3; i++) {
        let value = this.shift();
        if (value > 1) {
          return value;
        }
      }
      return getSkin();
    }
    let getSkin = () => {
      let index = Math.random() * (cfg.item_definition.skin.rows_.length - 2) >> 0;
      return cfg.item_definition.skin.rows_[index + 2].id;
    }
    const openMJRoom = game.Scene_MJ.prototype.openMJRoom
    game.Scene_MJ.prototype.openMJRoom = function (...args) {
      args[1].forEach(player => {
        if (!player.account_id) {
          player.avatar_id = players.get();
          player.character.charid = cfg.item_definition.skin.map_[player.avatar_id].character_id;
          player.character.level = 5;
          player.character.skin = player.avatar_id;
          player.nickname = cfg.item_definition.character.map_[player.character.charid]["name_chs"]
        }
      });
      return openMJRoom.call(this, ...args)
    }

    const _refreshPlayerInfo = uiscript.UI_WaitingRoom.prototype._refreshPlayerInfo
    uiscript.UI_WaitingRoom.prototype._refreshPlayerInfo = function (t) {
      if (t.account_id === 0 && players[t.cell_index] === 0) {
        console.log(t);
        players[t.cell_index] = t.avatar_id = getSkin();
        t.nickname = cfg.item_definition.character.map_[cfg.item_definition.skin.map_[t.avatar_id].character_id]["name_chs"]
      }
      return _refreshPlayerInfo.call(this, t)
    }

    const _clearCell = uiscript.UI_WaitingRoom.prototype._clearCell
    uiscript.UI_WaitingRoom.prototype._clearCell = function (t) {
      players[t] = 0;
      return _clearCell.call(this, t)
    }
    console.log("电脑随机皮肤 开");
  } //*/
  { // 解锁所有语音
    let interval = setInterval(() => {
      if (window?.cfg?.voice?.sound?.rows_ === undefined) return;
      clearInterval(interval);
      cfg.voice.sound.rows_.forEach(sound => {
        sound.level_limit = 0;
        sound.bond_limit = 0;
      });
      console.log("解锁所有语音");
    })
  } //*/
  { // 立直标注
    let color = [
      new Laya.Vector4(228 / 255, 160 / 255, 133 / 255, 1),
      new Laya.Vector4(252 / 255, 247 / 255, 154 / 255, 1),
      new Laya.Vector4(205 / 255, 255 / 255, 205 / 255, 1),
      new Laya.Vector4(1, 1, 1, 1)
    ]
    const changeColor = () => {
      let number = view.DesktopMgr.Inst.players.filter(p => p.trans_liqi.active).length;
      view.DesktopMgr.Inst.players.forEach(player => {
        setColor(player.container_qipai.last_pai, color[number]);
        player.container_qipai.pais.forEach(pai => {
          setColor(pai, color[number]);
        });
      });
    }
    const play = view.ActionLiqi.play;
    view.ActionLiqi.play = function (e) {
      changeColor();
      return play.call(this, e);
    }
    const fastplay = view.ActionLiqi.fastplay;
    view.ActionLiqi.fastplay = function (e, i) {
      changeColor();
      return fastplay.call(this, e, i);
    }
    console.log("立直标注 开");
  } //*/
}

new Promise((res) => {
  let interval = setInterval(() => {
    if (window.game === undefined) return;
    clearInterval(interval);
    console.log("游戏已加载");
    res();
  }, 100);
}).then(() => {
  runner();
}).catch(e => {
  console.warn(e)
});