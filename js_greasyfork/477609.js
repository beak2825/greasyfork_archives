// ==UserScript==
// @name         斗牌魂记牌器
// @namespace    card-soul-mod
// @version      0.1
// @description  启用月卡的记牌器
// @author       larz
// @license      MIT
// @match        https://game.card-soul.com/*
// @downloadURL https://update.greasyfork.org/scripts/477609/%E6%96%97%E7%89%8C%E9%AD%82%E8%AE%B0%E7%89%8C%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/477609/%E6%96%97%E7%89%8C%E9%AD%82%E8%AE%B0%E7%89%8C%E5%99%A8.meta.js
// ==/UserScript==

function isLoaded() {
  try {
    return (
      this != null &&
      app != null &&
      app.PvdMgr != null &&
      app.PvdMgr.sendReq2Auth != null
    );
  } catch (err) {
    return false;
  }
}

function init() {
  if (!isLoaded()) {
    return setTimeout(init, 2000);
  }

  console.log("Game loaded !");

  app.PvdMgr.sendReq2Auth = ((fn) =>
    function (name, data, callback, _void_) {
      callback = ((fn) =>
        function (...args) {
          if (args.slice(-1)[0].constructor.name == "ResLogin")
            args.slice(-1)[0].mall.month_ticket = [...Array(5).keys()].map(
              (num) =>
                net.ProtobufManager.lookupType("pk.GoodsRecord").fromObject({
                  goods_id: 30000 + num,
                  expire_time: Math.floor(Date.now() / 1000) + 2592000,
                })
            );
          fn.call(this, ...args);
        })(callback);
      fn.call(this, name, data, callback, _void_);
    })(app.PvdMgr.sendReq2Auth);
}

init();
