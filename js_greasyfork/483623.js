/* eslint userscripts/no-invalid-headers: ["error", { allowed: [ "webRequest" ] }] */

// ==UserScript==
// @name            瞎混辅助
// @namespace       http://res.xiahun.cn/
// @version         0.0.9
// @description     自用
// @author          不告诉你
// @license         GPL3
// @match           http://res.xiahun.cn/web/index.html
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           unsafeWindow
// @webRequest      [{ "selector": "http://res.xiahun.cn/web/js/bundle-*", "action": "cancel" }]
// @connect          ntfy.sh
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/483623/%E7%9E%8E%E6%B7%B7%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/483623/%E7%9E%8E%E6%B7%B7%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

/* global a,Be,Laya */
/* eslint-disable curly,dot-notation,no-eval */

// 开启虚拟控制台
GM_registerMenuCommand("虚拟控制台", ()=>gutil.openLayaVconsole())

var gObj = {
  debug: true, // 调试模式
  scale: 1.0,
  listeners: {},
  listeners_backup: {},
  pathCmds: { e: "go east", s: "go south", w: "go west", n: "go north", se: "go southeast", sw: "go southwest", ne: "go northeast", nw: "go northwest" },
  TMP: {
    正邪死亡名单: GM_getValue("正邪死亡名单")?.split(";"),
    自动谜题: GM_getValue("自动谜题"),
  },
  map: [
    { 雪亭镇街道: "jh 1", 雪亭镇街口: "jh 1;w", 武馆门口: "jh 1;e", 丰登当铺: "jh 1;n" },
    { 华山村村口: "jh 2", 桃花林: "jh 2;n", 茶棚: "jh 2;e", 祠堂: "jh 2;e;n" },
    { 华山山脚: "jh 3", 蜿蜒山路: "jh 3;e", 观瀑台: "jh 3;e;e", 思过崖: "jh 3;e;e;n" },
    { 恒山广场: "jh 4", 竹林: "jh 4;n", 解剑碑: "jh 4;e" },
    { 虹桥: "jh 5", 湖心岛: "jh 5;e", 春秋水色斋: "jh 5;e;e" },
    { 大雄宝殿: "jh 6", 达摩洞: "jh 6;n", 千佛殿: "jh 6;e", 礼佛殿: "jh 6;w" },
    { 晚月林: "jh 7", 花池: "jh 7;n", 翠嫣亭: "jh 7;n;e", 戏水台: "jh 7;n;e;e" },
    { 荒野小路: "jh 8", 往生碑: "jh 8;n", 墓冢群: "jh 8;e", 世外桃源: "jh 8;e;n", 墓门: "jh 8;e;n;n", 寒玉小居: "jh 8;e;n;e" },
    { 戈壁小路: "jh 9", 伊犁小镇: "jh 9;w", 龙门客栈: "jh 9;w;n", 百龙山庄: "jh 9;w;n;e" },
    { 阴山密林: "jh 10", 大昭秘境: "jh 10;e", 礼佛桥: "jh 10;e;n", 寺门: "jh 10;e;n;n" },
    { 雪林: "jh 11", 冰谷: "jh 11;e", 异域花园: "jh 11;e;s", 山庄后院: "jh 11;e;n", 铁雪小屋: "jh 11;e;e" },
    { 黑山林: "jh 12", 大石门: "jh 12;e", 献魂台: "jh 12;e;n", 拜会集: "jh 12;e;e", 魔殿: "jh 12;e;n;n" },
  ],
  goodAndEvil: {
    王铁匠: "武馆门口",
    英白罗: "桃花林",
    杨掌柜: "丰登当铺",
    柳绘心: "武馆门口",
    当铺掌柜: "雪亭镇街口",
    农夫: "华山村村口",
    朱老伯: "茶棚",
    跛脚汉子: "华山村村口",
    苦力: "丰登当铺",
    夏应梦: "祠堂",
  },
  attr: {
    攻速: ["剑皇", "豪拳", "樱刃", "罗刹女", "梦伞"],
    内力: ["罗刹女", "樱刃", "梦伞", "豪拳", "剑皇"],
    抗性: ["豪拳", "剑皇", "樱刃", "罗刹女", "梦伞"],
    生命力: ["豪拳", "剑皇", "樱刃", "罗刹女", "梦伞"],
    防御力: ["豪拳", "剑皇", "樱刃", "罗刹女", "梦伞"],
    攻击力: ["樱刃", "梦伞", "剑皇", "豪拳", "罗刹女"],
    附加僵直: ["梦伞", "豪拳", "剑皇", "罗刹女", "樱刃"],
  },
  item: {
    装备: [
      ["布衣", "铁戒", "麻布手套", "草帽", "铁手镯", "木杖", "布鞋", "长剑", "木枪", "破披风", "木棍", "石斧", "飞镖", "单刀", "铁项链",],
      ["丝绸衣", "银戒", "鹿皮手套", "皮帽", "银手镯", "钢杖", "兽皮鞋", "钢剑", "刺矛", "长斗篷", "铁棍", "短斧", "暗箭", "鬼头刀", "银项链",],
      ["金戒", "格斗拳套", "银丝帽", "金手镯", "禅杖", "银丝鞋", "长虹剑", "亮银枪", "军袍", "精铁棒", "青铜斧", "手里箭", "弯月刀", "金项链", "钢丝甲衣",],
      ["白金戒指", "丝绸掌套", "金丝帽", "白金手镯", "鹿角杖", "金丝鞋", "疾风剑", "虎牙枪", "丝质披风", "追风棍", "精铁斧", "峨嵋刺", "割鹿刀", "白金项链", "银丝衣",],
      ["钻石戒指","搏蛟拳套","宝玉帽","钻石手镯","青铜杖","宝玉鞋","断水剑","点钢枪","羊毛斗篷","踏云棍", "双板斧","流星锤","沉虹刀","钻石项链","银丝链甲衣",],
      ["天寒戒", "拜月掌套", "天寒帽", "天寒手镯", "金刚杖", "天寒鞋", "飞羽剑", "霸王戟", "夜行披风", "新月棍", "宣花斧", "金弹子", "斩空刀", "天寒项链", "软甲衣",],
      ["残雪戒", "霹雳掌套", "残雪帽", "残雪手镯", "疯魔杖", "残雪鞋", "星河剑", "湛金枪", "貂皮斗篷", "玉清棍", "白虎斧", "生死符", "血屠刀", "残雪项链", "金丝宝甲衣",],
      ["明月戒","墨玄掌套","明月帽","明月手镯","西毒蛇杖","明月鞋","倚天剑","霸王枪","孔雀氅","烈日棍","星月大斧","冰魄银针","屠龙刀","明月项链","月光宝甲衣",],
      ["烈日宝戒","龙象拳套","烈日帽","烈日宝镯","伏虎杖","烈日宝靴","诛仙剑","赤焰枪","披星戴月","残阳棍","破冥斧","暴雨梨花针","斩神刀","烈日宝链","日光宝甲衣",],
      ["斩龙帽","开天宝棍","龙皮至尊甲衣","斩龙宝镯","鎏金缦罗","九天龙吟剑","斩龙鎏金枪","小李飞刀","斩龙宝靴","天罡掌套","斩龙宝戒","达摩杖","飞宇天怒刀","斩龙宝链","天雷断龙斧",],
    ],
    碎片: [
      ["姬若瑾画卷残页","南宫梦蝶画卷残页","谢嫣然画卷残页","凤何夕画卷残页","百花宫主画卷残页","花千舞画卷残页","西夏公主画卷残页","蓝悠兰画卷残页","红袖仙子画卷残页","火灵儿画卷残页",],
      ["神级打狗棒碎片","神级梨花针碎片","神级圣火令碎片","神级倚天剑碎片","天魔琴碎片","青龙偃月刀碎片","盘古斧碎片","定海神针碎片",],
      ["域外居士碎片","郭家剑王碎片","剑皇碎片","罗刹女碎片","魔枪女碎片","武啸天碎片","神无碎片","豪拳碎片","梦伞碎片","樱刃碎片","大漠刀神碎片",],
    ],
  },
};

// 监听器管理
const Listener = {
  add: (name, func) => {
    gObj.listeners[name] = func;
  },
  del: (name) => {
    delete gObj.listeners[name];
  },
  backup: (name) => {
    gObj.listeners_backup[name] = gObj.listeners[name]
    delete gObj.listeners[name]
  }
};

// 暴露bundle.js命名空间
GM_xmlhttpRequest({
  method: "GET",
  url: document.querySelector("body > script[src^='js/bundle-']").src,
  onload: (response) => {
    eval(
      response.responseText
        .substring(19, response.responseText.length - 6)
        .replaceAll("window", "unsafeWindow")
        .replace("var a=", "window.a=")
    );
    Be.prototype.disposeMsg = function (e) { this._debug && console.log("recv: ", JSON.stringify(e)); for (let listener of Object.values(gObj.listeners)) { listener(e); }; let t = e.type, i = String.isEmpty(e.subtype) ? null : t + "." + e.subtype; if (this._performceStats && this._performceStats.begin(i || t), i) { let o = this._preprocess[i];o&&o(e)}let s=this._preprocess[t];s&&s(e),!(i&&this.findAndCallCbs(i,e))&&(this.findAndCallCbs(t,e)||(this.ignoreAllPacket||this.distributeMsg(t,i,e),this._performceStats&&this._performceStats.end(i||t)))}
    //this._debug = gObj.debug; // 开启游戏内置的调试模式
    unsafeWindow.debugL = (code) => eval(code);
    let waitInitSI = setInterval(() => {
      if (window.a && a.client && a.npcDefs) {
        clearInterval(waitInitSI);
        a.client._debug = gObj.debug; // 开启游戏内置的调试模式（控制台输出发送的指令
        gObj.worldBoss = Object.keys(a.npcDefs) // 初始化世界Boss数据
          .filter((e) => !e.indexOf("public_comm") && e != "public_comm_family_quest")
          .map((e) => {
            return { id: e, name: a.npcDefs[e].name };
          });
      }
    }, 1000);
    
    gObj.exec = (cmds, index, type, callback) => {
      if (index + 1 < cmds.length) {
        if (cmds[index].startsWith("go ") || cmds[index].match(/jh \d+/))
          a.client.asyncRequest(cmds[index], "look_room.info"); // 跑图过程中不进行前端渲染，节约性能和更快的速度
        else a.client.send(cmds[index]);
        setTimeout(() => gObj.exec(cmds, ++index, type, callback), 500);
      } else if (type) a.client.asyncRequest(cmds[index], type).then(callback);
      else if (callback?.toString().indexOf("a.ui.cur_room._data.npcs") >= 0) {
        let waitNpcData = setInterval(() => {
          if (!a.ui.cur_room?._data?.npcs) return;
          clearInterval(waitNpcData);
          callback();
        }, 250);
        a.client.send(cmds[index]);
      } else a.client.send(cmds[index]);
    };
    gObj.execActions = (cmds, type, callback) => {
      console.debug("exec: " + cmds);
      gObj.exec(
        cmds.split(";").map((e) => {
          if (!gObj.pathCmds[e]) return e;
          return gObj.pathCmds[e] + "." + Math.floor(Math.random() * 1000000);
        }),
        0,
        type,
        callback,
      );
    };
  },
});

Listener.add("消息", (obj) => {
  /* 娱乐功能 */
  /*
  // 假装是VIP
  a.userData.is_vip = 1;
  // 假装是GM
  // a.userData.id = "u100310"
  a.userData.is_editor = 1;
  // 装逼
  a.userData.name = "无名";
  a.userData.lvl = Infinity;
  a.userData.combat_score = Infinity;
  a.userData.uexp = Infinity;
  a.userData.exp = Infinity;
  a.userData.upgrade_exp = Infinity;
  a.userData.pon = Infinity;
  a.userData.yuanbao = Infinity;
  a.userData.money = Infinity;
  a.jhData.sub_map_id = "mojiao1_room30";
  a.jhData.map_id = "mojiao";
  a.jhData.jh_map = "12"
  a.jhData.npc1 = "mojiao_npc23,魔教鬼卫,150,0"
  a.jhData.guaji_time = 65535
  a.jhData.map_name = "魔教"
  a.jhData.sub_map_name = "魔教12-30"
  a.jhData.jh_sub_map = "30"
  */
  if (obj.type == "vs") {
    switch (obj.subtype) {
      case "new_item":
        if (GM_getValue("捡宝箱"))
         if (Math.random()>=0.55)
         gObj.execActions("get "+obj.item.split(",")[0])
        return;
      case "fight_msg":
        gObj.execActions(obj.finish_cmd)
        return
    }
    // 强制恢复时延
    if (a.indexRT?._timer?.scale && a.indexRT._timer.scale < gObj.scale) a.indexRT._timer.scale = gObj.scale;
    return;
  }
  switch (obj.from_name) {
    case "世界boss":
      if (!gObj.TMP.waiting) {
        let res = obj.msg.match(/(.*)降临在\[url=act:find_boss_road .*\]\[color=#FFD700\](.*)\[\/color\]\[\/url\]，各位大侠赶紧去替天行道，还世界一片净土！/);
        if (gObj.TMP.waitingBoss != res[1]) {
          // 技能书少，不打了
          if (!["大悲王", "邪皇"].includes(res[1])) return;
          gObj.TMP.waitingBoss = res[1];
          gObj.execActions(
            gObj.map.find((e) => Object.keys(e).includes(res[2]))[res[2]] + ";fight ready " + gObj.worldBoss.find((e) => e.name == res[1]).id + ";auto_fight 1",
          );
        }
      }
      return;
    case "青龙会组织":
      a.ui.showTips(obj.msg);
      if (!GM_getValue("青龙")) return;
      var tmp = obj.msg.match(
        /青龙会组织：(\[color=#.{6}\].*\[\/color\])\[color=#FF0000\]正在\[url=act:find_qinglong_road .*\]\[color=#.{6}\](.*)\[\/color\]\[\/url\]\[color=#FF0000\]施展力量，本会愿出\[color=#.{6}\](.*)\[color=#FF0000\]的战利品奖励给本场战斗的最终获胜者/,
      );
      if (tmp && tmp[3]?.match(GM_getValue("青龙物品")) && !a.ui.isSceneLoadingShowing()) {
        gObj.execActions(gObj.map.filter((e) => Object.keys(e).indexOf(tmp[2]) >= 0)[0][tmp[2]], undefined, () => {
          gObj.execActions("kill ready " + Object.values(a.ui.cur_room._data.npcs).find((i) => i.name == tmp[1]).id);
        });
      }
      return;
  }
  if (obj.type == "chat") {
    if (obj.channel == "sys" && obj?.from_id?.startsWith("bad_target_") && GM_getValue("正邪")) {
      let res = obj.msg.match(/\[color=#.{6}\](.*)\[\/color\]正在行凶，各位侠客行行好来救救我吧~/);
      if (!res) return;
      let room = gObj.goodAndEvil[obj.from_name.match(/\[color=#.{6}\](.*)\[\/color\]/)[1]];
      if (a.ui.isSceneLoadingShowing() || a.war) return;
      if (gObj.TMP["正邪死亡名单"]?.indexOf(res[1]) >= 0)
        gObj.execActions(`${gObj.map.find((e) => Object.keys(e).indexOf(room) >= 0)[room]};look_npc ${obj.from_id}`, "look_npc,notice.look_npc", (i) => {
          gObj.execActions(i["cmd2"].split(",")[1]);
        });
      return;
    } else if (obj.subtype == "tell") {
      a.ui.showTips(`${obj.from_name}告诉你：${obj.msg}`);
    } else if (obj.channel_name == "侠魂闲聊群") {
      a.ui.showTips(`【闲聊】${obj.from_name}：${obj.msg}`);
    } else GM_xmlhttpRequest({
      method: "POST",
      url: "https://ntfy.sh/xiahun",
      data: `{message:${JSON.stringify(obj)}}`,
    })
  } else if (gObj.TMP["挑战江湖"] && obj.type == "play_chat" && obj.chat_id == "family_quest") {
    // FIXME
    if (obj.name?.startsWith("战胜")) gObj.execActions("find_family_quest_road;fight ready " + obj.npc1.split(",")[0]);
    else obj.name?.startsWith("找到");
    gObj.execActions("family_quest check_finish");
  } else if (gObj.TMP["自动谜题"] && obj.type == "main_msg") {
    if (obj.msg.indexOf("不给") > 0) {
      let res = obj.msg.match(/([^道]+)道:/);
      if (!res) return;
      gObj.execActions("fight ready " + Object.values(a.ui.cur_room._data.npcs).find((i) => i.name == res[1]).id);
      return;
    }
    let res = obj.msg.match(/(\[url=act:find_task_road2? [^\]]+\][^\[]+)?.*\[url=act:(find_task_road2? ([^\]]+))\]([^\[]+)/);
    if (!res) return;
    if (obj.msg.indexOf("转告") == -1 && (obj.msg.indexOf("吧！") > 0 || obj.msg.indexOf("罢！") > 0 || obj.msg.indexOf("厉害！") > 0))
      gObj.execActions(res[2], undefined, () => {
        gObj.execActions("fight ready " + Object.values(a.ui.cur_room._data.npcs).find((i) => i.name == res[4]).id);
      });
    else if (obj.msg.indexOf("打探") > 0)
      gObj.execActions(res[2], undefined, () => {
        gObj.execActions("npc_datan " + Object.values(a.ui.cur_room._data.npcs).find((i) => i.name == res[4]).id);
      });
    else if (obj.msg.indexOf("帮忙找来？") > 0 || obj.msg.indexOf("想要") > 0) gObj.execActions("give " + res[3]);
    else if (obj.msg.indexOf("藏在了") > 0) gObj.execActions(res[2] + ";room_sousuo");
    else
      gObj.execActions(res[2], undefined, () => {
        gObj.execActions("ask " + Object.values(a.ui.cur_room._data.npcs).find((i) => i.name == res[4]).id);
      });
  }
});

GM_registerMenuCommand("执行指令", () => {
  a.ui.showInput("执行指令", "", GM_getValue("CMD")).then((cmd) => {
    GM_setValue("CMD", cmd);
    gObj.execActions(cmd);
  });
});

GM_registerMenuCommand("一键日常", () => {
  gObj.execActions(
    a.jhData.map_lists
      .split(",")
      .splice(0, a.jhData.jh_map)
      .map((e) => "jh saodang " + e)
      .join(";") +
    "qiandao;qiandao 1;jh get;zhucheng;shenbing;" +
    "shenbing saodang shenbing_shenbing_dagoubang;" +
    "shenbing saodang shenbing_shenbing_lihuazhen;" +
    "shenbing saodang shenbing_shenbing_shenghuoling;" +
    "shenbing saodang shenbing_shenbing_yitianjian;" +
    "shenbing saodang shenbing_shenbing_tianmoqin;" +
    "zhuceng;beauty;" +
    "beauty get_drop beauty_beauty_xieyanran;" +
    "beauty get_drop beauty_beauty_huolinger" +
    "erengu buy_fb_cnt fuzhou fubenjingying1 2;erengu saodang fuzhou fubenjingying1;erengu saodang fuzhou fubenjingying1;"+
    "erengu buy_fb_cnt fuzhou fubenjingying2 2;erengu saodang fuzhou fubenjingying2;erengu saodang fuzhou fubenjingying2;"+
    "erengu buy_fb_cnt fuzhou fubenjingying3 2;erengu saodang fuzhou fubenjingying3;erengu saodang fuzhou fubenjingying3;"+
    "erengu buy_fb_cnt fuzhou fubenjingying4 2;erengu saodang fuzhou fubenjingying4;erengu saodang fuzhou fubenjingying4;"+
    "erengu buy_fb_cnt erengu erengu1 2;erengu saodang erengu erengu1;erengu saodang erengu erengu1;"+
    "erengu buy_fb_cnt erengu erengu2 2;erengu saodang erengu erengu2;erengu saodang erengu erengu2;"+
    "erengu buy_fb_cnt erengu erengu3 2;erengu saodang erengu erengu3;erengu saodang erengu erengu3;"+
    "erengu buy_fb_cnt erengu erengu4 2;erengu saodang erengu erengu4;erengu saodang erengu erengu4;"+
    "erengu buy_fb_cnt shuzhongzhuhai shuzhongzhuhai1 2;erengu saodang shuzhongzhuhai shuzhongzhuhai1;erengu saodang shuzhongzhuhai shuzhongzhuhai1;"+
    "erengu buy_fb_cnt shuzhongzhuhai shuzhongzhuhai2 2;erengu saodang shuzhongzhuhai shuzhongzhuhai2;erengu saodang shuzhongzhuhai shuzhongzhuhai2;"+
    "erengu buy_fb_cnt shuzhongzhuhai shuzhongzhuhai3 2;erengu saodang shuzhongzhuhai shuzhongzhuhai3;erengu saodang shuzhongzhuhai shuzhongzhuhai3;"+
    "erengu buy_fb_cnt shuzhongzhuhai shuzhongzhuhai4 2;erengu saodang shuzhongzhuhai shuzhongzhuhai4;erengu saodang shuzhongzhuhai shuzhongzhuhai4;"+
    "erengu buy_fb_cnt taohuawu taohuawu1 2;erengu saodang taohuawu taohuawu1;erengu saodang taohuawu taohuawu1;"+
    "erengu buy_fb_cnt taohuawu taohuawu2 2;erengu saodang taohuawu taohuawu2;erengu saodang taohuawu taohuawu2;"+
    "erengu buy_fb_cnt taohuawu taohuawu3 2;erengu saodang taohuawu taohuawu3;erengu saodang taohuawu taohuawu3;"+
    "erengu buy_fb_cnt taohuawu taohuawu4 2;erengu saodang taohuawu taohuawu4;erengu saodang taohuawu taohuawu4;"+
    "erengu buy_fb_cnt damo damo1 2;erengu saodang damo damo1;erengu saodang damo damo1;"+
    "erengu buy_fb_cnt damo damo2 2;erengu saodang damo damo2;erengu saodang damo damo2;"+
    "erengu buy_fb_cnt damo damo3 2;erengu saodang damo damo3;erengu saodang damo damo3;"+
    "erengu buy_fb_cnt damo damo4 2;erengu saodang damo damo4;erengu saodang damo damo4;"+
    "erengu buy_fb_cnt xueshan xueshan1 2;erengu saodang xueshan xueshan1;erengu saodang xueshan xueshan1;"+
    "erengu buy_fb_cnt xueshan xueshan2 2;erengu saodang xueshan xueshan2;erengu saodang xueshan xueshan2;"+
    "erengu buy_fb_cnt xueshan xueshan3 2;erengu saodang xueshan xueshan3;erengu saodang xueshan xueshan3;"+
    "erengu buy_fb_cnt xueshan xueshan4 2;erengu saodang xueshan xueshan4;erengu saodang xueshan xueshan4;"
    ,
  );
});

// FIXME
GM_registerMenuCommand("一键打宝", () => {
  setInterval(() => {
    gObj.execActions("dabao", "dabao.info", (item1) => {
      `${{
        type: "dabao",
        ret: "1",
        drop_type: "item",
        drop_name: "残雪戒[7阶]",
        cmd_name2: "出售",
        cmd_name1: "装备",
        equip_type: "finger",
        drop_id: "equip_finger7#134797",
        cmd_confirm2: "此装备的某些属性可能比当前装备高，确实要出售吗？",
        cmd2: "items sell equip_finger7#134797",
        cmd1: "pet wear equip_finger7#134797 lingpo_lingpo_luoshanv",
        drop_amount: "1",
        subtype: "info",
        _rtm_: 1702012365338,
      }}`;
      if (item1.drop_name.match(/经验|潜能|残页|银两|碎片/)) {
        gObj.execActions("blank", "suc.blank");
        return;
      }
      if (item1.drop_name.indexOf("阅历果") >= 0) {
        gObj.execActions(item1.cmd1)
        return;
      }
      if (item1.drop_name.match(/灵草|大还丹|狂暴丹/)) {
        return;
      }
      gObj.execActions("items info2 " + item1.drop_id, "items.info", (item2) => {
        // 打掉的
        gObj.execActions(`pet equip:${item2.item_subtype} lingpo_lingpo_luoshanv`, "pet.equip", (item3) => {
          if (parseInt(item2.item_score) > parseInt(item3.item_score)) {
            gObj.execActions(item1.cmd1);
          } else {
            gObj.execActions(item1.cmd2);
          }
          count++;
        });
      });
    });
  }, 1000); // 每隔1秒执行一次打宝
});

// FIXME
GM_registerMenuCommand("一键对话", () => {
  var index = 0;
  var paths = gObj.map
    .map((e) => Object.values(e))
    .join()
    .split(",")
    .concat("lock_room");
  function next() {
    if (!paths[index]) return;
    gObj.execActions(paths[index++], undefined, () => {
      setTimeout(() => {
        for (let npcId of Object.keys(a.ui.cur_room._data.npcs)) {
          if (npcId.startsWith("eren") || npcId.startsWith("bad_target_")) continue;
          gObj.execActions("ask " + npcId + ";look_room;ask " + npcId + ";look_room");
        }
        setTimeout(next, 3000);
      }, 1000);
    });
  }
  next();
});

// FIXME
GM_registerMenuCommand("一键挑战", () => {
  var index = 0;
  var paths = gObj.map
    .map((e) => Object.values(e))
    .join()
    .split(",")
    .concat("lock_room");
  function next() {
    if (!paths[index]) return;
    gObj.execActions(paths[index++], undefined, () => {
      setTimeout(() => {
        for (let npcId of Object.keys(a.ui.cur_room._data.npcs)) {
          if (npcId.startsWith("eren") || npcId.startsWith("bad_target_")) continue;
          gObj.execActions("ask " + npcId + ";look_room;ask " + npcId + ";look_room");
        }
        setTimeout(next, 3000);
      }, 1000);
    });
  }
  next();
});

GM_registerMenuCommand("监听宝箱", () => {
  GM_setValue("捡宝箱", !GM_getValue("捡宝箱"));
  gObj.TMP["捡宝箱"] = GM_getValue("捡宝箱");
  a.ui.showTips(`监听宝箱已${GM_getValue("捡宝箱") ? "开启" : "关闭"}`);
});

GM_registerMenuCommand("自动谜题", () => {
  GM_setValue("自动谜题", !GM_getValue("自动谜题"));
  gObj.TMP["自动谜题"] = GM_getValue("自动谜题");
  a.ui.showTips(`自动谜题已${GM_getValue("自动谜题") ? "开启" : "关闭"}`);
});

for (let name of ["青龙", "正邪"]) {
  GM_registerMenuCommand(
    `监听${name}`,
    (() => () => {
      if (GM_getValue(name)) {
        Listener.del(name);
      } else {
        if (name == "青龙")
          a.ui
            .showInput("青龙物品设置", "请输入要监听的物品（支持正则表达式）", GM_getValue("青龙物品") || gObj.item["装备"].slice(7).join().replaceAll(",", "|"), "保 存")
            .then((value) => GM_setValue("青龙物品", value));
        else if (name == "正邪")
          a.ui.showInput("杀谁（没写杀正，懒）", "", GM_getValue("正邪死亡名单") || "段老大;二娘", "保 存").then((value) => {
            GM_setValue("正邪死亡名单", value);
            gObj.TMP["正邪死亡名单"] = value.split(";");
          });
      }
      GM_setValue(name, !GM_getValue(name));
      a.ui.showTips(`监听${name}已${GM_getValue(name) ? "开启" : "关闭"}`);
    })(name),
  );
}

GM_registerMenuCommand("查询玩家", () => {
  a.ui.showInput("查玩家", "支持擂台上的玩家", GM_getValue("玩家") || a.userData.name).then((value) => {
    GM_setValue("玩家", value);
    a.client.asyncRequest("sort", "sort.list").then((i) =>
      Laya.ClassUtils.getClass("KNr9dUMmTraFFu1ciemDXQ")?.prototype?.onClickPlayer(
        Object.entries(i)
          .filter(([k, v]) => k.length >= 5 && k.startsWith("sort"))
          .find((e) => e[1].split(",")[2] == value)[1]
          .split(",")[1],
      ),
    );
  });
});
