// ==UserScript==
// @name         WoD 物品批量存放仓库
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace    http://tampermonkey.net/
// @description  awesome warehouse
// @author       lax
// @match        http*://*.world-of-dungeons.org/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @modifier     Christophero
// @version      2023.05.07.1
// @downloadURL https://update.greasyfork.org/scripts/520632/WoD%20%E7%89%A9%E5%93%81%E6%89%B9%E9%87%8F%E5%AD%98%E6%94%BE%E4%BB%93%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/520632/WoD%20%E7%89%A9%E5%93%81%E6%89%B9%E9%87%8F%E5%AD%98%E6%94%BE%E4%BB%93%E5%BA%93.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  // 特殊物品相关key
  const SPECIAL_ITEMS_KEY = "specialItems";
  const SPECIAL_ITEMS_VERSION = "specialItemsVersion";
  const SPECIAL_ITEMS_SHINE = "specialItemsShine";
  const SPECIAL_ITEMS_ALLOW_SELL = "specialItemsAllowSell";
  const DEAL_WITH_UNEQUIPABLE = "deal_with_unequipable";

  const placeMap = {
    warehouse: "go_group_2",
    treasury: "go_group",
    storage: "go_keller",
  };

  // 不希望被直接N掉但是又不想高亮的物品
  const reserveItems = [
    "魔法突破卷轴",
    "丑陋卷轴",
    "保护卷轴",
    "完全治愈卷轴",
    "愤怒卷轴",
    "精确卷轴",
    "觉醒卷轴",
    "孤狼卷轴",
    "迅鼬卷轴",
    "防魔卷轴",
    "蔑视卷轴",
    "驱逐卷轴",
    "放逐卷轴",
    "灭龙卷轴",
    "瓦解卷轴",
    "改良的强壮护符",
    "卡罗先活力护符",
    "否定护符",
    "军需品-第一圣殿骑士团的护符",
    "军需品-第三圣殿骑士团的护符",
    "军需品-第二圣殿骑士团的护符",
    "军需品-第四圣殿骑士团的护符",
    "弱化护符",
    "活跃护符",
    "改良的弱化护符",
    "麻痹护符",
    "改良的麻痹护符",
    "改良的防御疾病护符",
    "改良的否定护符",
    "改良的鲁比斯护符",
    "改良的自然防御护符",
    "希斯否定护符",
    "梨族活力护符",
    "野生灌木(碎末)",
    "红色蘑菇人表皮",
    "蓝色蘑菇人表皮",
  ];

  let fullHeroArr = [];

  //扩展jquery的格式化方法
  $.fn.parseForm = function () {
    var serializeObj = {};
    var array = this.serializeArray();
    var str = this.serialize();
    $(array).each(function () {
      if (serializeObj[this.name]) {
        if ($.isArray(serializeObj[this.name])) {
          serializeObj[this.name].push(this.value);
        } else {
          serializeObj[this.name] = [serializeObj[this.name], this.value];
        }
      } else {
        serializeObj[this.name] = this.value;
      }
    });
    return serializeObj;
  };

  /**
   *模拟form表单，实现post提交，并打开新窗口
   * url：请求链接
   * postData：json格式的post参数
   */
  const formpost = (url, postData) => {
    var tempform = document.createElement("form");
    tempform.action = url;
    tempform.target = "_blank";
    tempform.method = "post";
    tempform.style.display = "none";
    for (var x in postData) {
      var opt = document.createElement("textarea");
      opt.name = x;
      opt.value = postData[x];
      tempform.appendChild(opt);
    }
    document.body.appendChild(tempform);
    tempform.submit();
  };

  // 获取英雄列表
  const fetchAllHeroes = async () => {
    let heroes = [];
    let response = await fetch(
      `${location.protocol}//delta.world-of-dungeons.org/wod/spiel/settings/heroes.php?is_popup=1`
    );
    const text = await response.text();
    const jq = $(text);
    jq.find('form[name="the_form"]')
      .find(
        'input[name^="aktiv["]:checked,input[name^="uv["]:not(:visible),span.hilite:contains("活跃")'
      )
      .each((i, e) => {
        const $row = $(e).parents("tr:first");
        let heroName = $row.find("td:first a").text();
        let heroId = $row.find('td:first input[type="radio"]').val();
        heroes.push({ id: heroId, name: heroName });
      });
    console.log(heroes);
    return heroes;
  };

  const obj2Formdata = (params) => {
    let data = new FormData();
    for (let key of Object.keys(params)) {
      data.append(key, params[key]);
    }
    return data;
  };

  // 把道具放置进团队仓库
  const placeItemsIntoWarehouse = async (
    id,
    hero,
    onlyTake,
    dealWithUnequipable
  ) => {
    let url = `${location.protocol}//delta.world-of-dungeons.org/wod/spiel/hero/items.php?session_hero_id=${id}&is_popup=1`;
    let response = await fetch(url);
    const text = await response.text();
    const jq = $(text);
    let params = jq.find('form[name="the_form"]').parseForm();
    // console.log(params);
    params["item_3usage_item"] = "yes";
    params["item_3group_item"] = "no";
    if (params["ITEMS_LAGER_PSNR[1]"] < 100) {
      params["ITEMS_LAGER_PSNR[1]"] = 100;
      params["ITEMS_LAGER_PSGO[1]"] = "√";
    }
    let detail = await fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams(Object.entries(params)).toString(),
    });
    let detailText = await detail.text();
    let detailJq = $(detailText);
    let $itemTable = detailJq.find("#item_3is_open+table:first");
    let $pages = $itemTable.find(
      'input[name="dummy"], input[name^="ITEMS_LAGER_PAGE["]'
    );
    let $fullPa = detailJq.find(
      'p:contains("不把沉重的背包清理一番，您实在无法分出手来干别的事情。")'
    );
    if ($fullPa.length) {
      fullHeroArr.push(hero);
    }
    if (!onlyTake && !$fullPa.length) {
      // 把能放进团队仓库的扔进团队仓库
      $itemTable
        .find('select[name^="EquipItem["] option[value="go_group_2"]')
        .parent("select")
        .val("go_group_2");
      let $detailForm = detailJq.find('form[name="the_form"]');
      let detailParams = $detailForm.parseForm();
      detailParams["item_3usage_item"] = "yes";
      detailParams["item_3group_item"] = "no";
      detailParams["ok"] = "应用改动";
      detailParams["dummy"] = "go_group_2";
      // 如果不可装备物品要处理，则这里入仓后还要查询下这部分物品进行处理
      if (dealWithUnequipable in placeMap) {
        detailParams["item_3location"] = "tr_none";
        detailParams["item_3usage_item"] = "no";
      }
      // console.log(detailParams);

      let result = await fetch(url, {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "content-type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: new URLSearchParams(Object.entries(detailParams)).toString(),
      });
      let lastResult = await result.text();
      if (hero == "ReimuMustDie") console.log(lastResult);

      if (dealWithUnequipable in placeMap) {
        detailJq = $(lastResult);
        $itemTable = detailJq.find("#item_3is_open+table:first");
        $itemTable
          .find('select[name^="EquipItem["] option[value="go_group_2"]')
          .parent("select")
          .val(placeMap[dealWithUnequipable]);
        $detailForm = detailJq.find('form[name="the_form"]');
        detailParams = $detailForm.parseForm();
        detailParams["item_3usage_item"] = "yes";
        detailParams["item_3group_item"] = "no";
        detailParams["ok"] = "应用改动";
        detailParams["dummy"] = "go_group_2";
        detailParams["item_3location"] = "";
        result = await fetch(url, {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: new URLSearchParams(Object.entries(detailParams)).toString(),
        });
        lastResult = await result.text();
        if (hero == "ReimuMustDie") console.log(lastResult);
      }
    }

    // console.log(await result.text());
    let current = 0;
    let total = 0;
    total = parseInt($("#tipsTotal").text());
    current = parseInt($("#tipsCurrent").text()) + 1;
    $("#tipsCurrent").text(current);
    if (current >= total) {
      $("#awesomeTips").text("处理完成!");
      setTimeout(function () {
        $("#awesomeTips").remove();
      }, 1500);
      fullHeroArr.length &&
        alert("下面角色背包已满，请手动清理\n" + fullHeroArr.join("，"));
    }
  };

  const addMarkClass = () => {
    let style = document.createElement("style");
    style.type = "text/css";
    let cssText =
      // " .shining-item {background: -webkit-linear-gradient(-90deg, #6170ff 0%, #4bdfff 100%);background: linear-gradient(-90deg, #6170ff 0%, #4bdfff 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;}";
      " .special {background: -webkit-linear-gradient(left, #3442c5db, #00d2ff) 0 0 no-repeat;-webkit-background-clip: text;-webkit-text-fill-color: rgba(255, 255, 255, 0.3);text-shadow: 4px 3px 5px #1a8ae276;}" +
      " .shining-item {animation: shine 3s infinite;}" +
      " @keyframes shine {0%{text-shadow: none}30%{text-shadow:0 0 1px #fff, 0 0 4px #dfbe10d0, 0 0 8px #dfbe1060}100%{text-shadow: none}} ";
    if (style.styleSheet) {
      style.styleSheet.cssText = cssText;
    } else {
      style.appendChild(document.createTextNode(cssText));
    }
    document.getElementsByTagName("head")[0].appendChild(style);
  };

  const allToPublic = async (onlyTake) => {
    const dealWithUnequipable = $(
      'input[name="deal_with_unequipable"]:checked'
    ).val();
    localStorage.setItem(DEAL_WITH_UNEQUIPABLE, dealWithUnequipable);
    $("#batchWarehouseDiv").after(
      '<div id="awesomeTips"><span id="tipsOverview" style="padding: 5px 10px;">获取激活角色</span><span id="tipsTotal">0</span> / <span id="tipsCurrent">0</span></div>'
    );
    let heroes = await fetchAllHeroes();
    fullHeroArr = [];
    $("#tipsOverview").text(`激活角色${heroes.length}位：`);
    $("#tipsTotal").text(heroes.length);
    for (let hero of heroes) {
      placeItemsIntoWarehouse(
        hero.id,
        hero.name,
        onlyTake,
        dealWithUnequipable
      );
    }
  };

  const addBatchBtn = () => {
    const $groupDiv = $(".gadget.groupmsg.lang-cn");
    if (!$groupDiv.length) return;
    const $container = $(
      '<div id="batchWarehouseDiv" style="display: flex;flex-direction: column;"></div>'
    );
    const $fetchBtn = $(
      '<button name="fetchAll" class="button clickable" title="将所有激活角色的背包收取后不做其他操作，靠玩家自己有空时清理">激活角色背包收取</button>'
    );
    const $storeBtn = $(
      '<button name="storeAll" class="button clickable" title="将所有激活角色的非团队物品耗材放入团队仓库">激活角色耗材入仓</button>'
    );
    const dealWithUnequipable = localStorage.getItem(DEAL_WITH_UNEQUIPABLE);
    $container.append(`<div style="padding: 0 5px;">
    <span>不可装备物品放入哪里</span><br>
    <label><input type="radio" name="deal_with_unequipable" ${
      dealWithUnequipable == "" ? "checked" : ""
    } value="">无视</label>
    <label><input type="radio" name="deal_with_unequipable" ${
      dealWithUnequipable == "warehouse" ? "checked" : ""
    } value="warehouse">团仓</label>
    <label><input type="radio" name="deal_with_unequipable" ${
      dealWithUnequipable == "treasury" ? "checked" : ""
    } value="treasury">宝库</label>
    </div>`);
    $fetchBtn.click(function () {}).appendTo($container);
    $fetchBtn.click(() => allToPublic(true)).appendTo($container);
    $storeBtn.click(() => allToPublic(false)).appendTo($container);
    $groupDiv.before($container);
  };

  const doMark = (specialItemsMap, allowSell) => {
    let markedItems = [];
    $(".content_table:first a").each((i, el) => {
      let $el = $(el);
      const itemName = $el.text().replace("!", "");
      if (specialItemsMap.hasOwnProperty(itemName)) {
        $el.addClass("special");
        if (!allowSell) {
          $el
            .parents("tr:first")
            .find(
              "input:checkbox[name^='SellItemsStore['], input:checkbox[name^='SellItemsGroupCellar['], input:checkbox[name^='SellItemsFound[']"
            )
            .remove();
        }
        markedItems.push(itemName);
      } else if (
        itemName.endsWith("皮披肩") ||
        reserveItems.includes(itemName) ||
        ($el.prevAll("img").length === 2 &&
          !itemName.startsWith("炼金术毒药："))
      ) {
        // 不希望皮披肩和特殊卷轴、特殊护符被直接卖掉
        if (!allowSell) {
          $el
            .parents("tr:first")
            .find(
              "input:checkbox[name^='SellItemsStore['], input:checkbox[name^='SellItemsGroupCellar['], input:checkbox[name^='SellItemsFound[']"
            )
            .remove();
        }
      }
    });
  };

  const markItems = () => {
    let specialItemsStr = localStorage.getItem(SPECIAL_ITEMS_KEY);
    let specialItemsVer = localStorage.getItem(SPECIAL_ITEMS_VERSION);
    let shine = localStorage.getItem(SPECIAL_ITEMS_SHINE);
    let allowSell = localStorage.getItem(SPECIAL_ITEMS_ALLOW_SELL);
    let specialItemsMap = {};
    let nowTime = new Date().getTime();
    if (
      specialItemsStr &&
      specialItemsVer &&
      nowTime - specialItemsVer < 7 * 24 * 60 * 60 * 1000
    ) {
      specialItemsMap = JSON.parse(specialItemsStr);
      doMark(specialItemsMap, allowSell);
    } else {
      // 获取特殊物品信息
      fetch("https://www.christophero.xyz/wod/item/loadDict", {
        method: "POST",
        body: JSON.stringify({ dictTypeList: ["specialItems"] }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          if (!(res && res.code === 200)) {
            return;
          }
          const data = res.data;
          for (let item of data["specialItems"]) {
            specialItemsMap[item.label] = item.val;
          }
          localStorage.setItem(
            SPECIAL_ITEMS_KEY,
            JSON.stringify(specialItemsMap)
          );
          localStorage.setItem(SPECIAL_ITEMS_VERSION, nowTime);
          doMark(specialItemsMap, allowSell);
        });
    }
  };

  addBatchBtn();

  let pathName = location.pathname;
  if (pathName !== "/wod/spiel/hero/items.php") {
    return;
  }

  addMarkClass();
  markItems();

  if (typeof GM_addStyle == "undefined") {
    function GM_addStyle(styles) {
      var S = document.createElement("style");
      S.type = "text/css";
      var T = "" + styles + "";
      T = document.createTextNode(T);
      S.appendChild(T);
      document.body.appendChild(S);
      return;
    }
  }

  var WOD;
  (() => {
    var t = {
        138: (t, e, s) => {
          const i = s(90),
            n = {};
          i.keys().map((t) => {
            const e = t.split(".js")[0].split("/")[1];
            n[e] = i(t);
          }),
            (window.WOD = n);
          let r = location.href;
          r.includes("world-of-dungeons") &&
            r.includes("skills.php") &&
            n.SkillMap.getOnt().save(),
            (t.exports = n);
        },
        593: (t) => {
          let e;
          class s {
            constructor() {
              (this._ = $(".hero_full")),
                (this.name = this._.find(".font_Hero_Name").text()),
                (this.title = this._.find(".font_Hero_Title").text()),
                (this.class = this._.find(".font_Hero_Class").text()),
                (this.race = this._.find(".font_Hero_Race").text()),
                (this.level = this._.find(".font_Hero_Level").text());
            }
            getName() {
              return this.name;
            }
            getTitle() {
              return this.title;
            }
            getClass() {
              return this.class;
            }
            getRace() {
              return this.race;
            }
            getLevel() {
              return this.level;
            }
          }
          (s.getOnt = () => (e || (e = new s()), e)), (t.exports = s);
        },
        380: (t) => {
          "use strict";
          const e = {
            CLASSES: 0,
            RACE: 1,
            POSITION: 2,
            UNIQUE: 3,
            ATTRIBUTE: 4,
            ITEM_TYPE: 5,
            SKILL: 6,
            USE_SKILL: 7,
            SKILL_TYPE: 8,
            COORDINATE: 9,
            INLAY: 10,
            REQUIRE_ATTRIBUTE: 11,
          };
          let s;
          class i {
            constructor() {
              (this.lib = this.__getLib()),
                this.__init(),
                (this._selects = $(".search_container select")),
                this.setSkillSelectPriority(),
                (this.searchButton = $("a.button")),
                (this.consumable = $("input[name=item_3usage_item]")),
                (this.group = $("input[name=item_3group_item]")),
                (this.selects = this.__select2Init()),
                (this.attrRequire = $("input[name=item_3attribute_value]")),
                (this.level = $("input[name=item_3hero_level]")),
                (this.levelSelect = $("input[name=item_3hero_level_enabled]")),
                (this.minCondition = $("input[name=item_3item_condition]")),
                (this.maxCondition = $("input[name=item_3item_conditionMax]"));
            }
            __init() {
              this.__checkJquery(),
                // this.__checkSelect2(),
                this.__checkGM();
            }
            __checkJquery() {
              this.__check(() => {
                $;
              }, "无法访问jquery，请引入该库或联系该脚本的开发者！");
            }
            __checkSelect2() {
              this.__check(() => {
                $().select2();
              }, "无法访问select2，请引入该库或联系该脚本的开发者！");
            }
            __checkGM() {
              //                    this.__check((()=>{
              //                        GM_addStyle
              //                    }
              //                    ), "无法访问GM_addStyle，请打开或联系该脚本的开发者！"),
              //                    this.__check((()=>{
              //                        GM_getResourceText
              //                    }
              //                    ), "无法访问GM_getResourceText，请打开或联系该脚本的开发者！")
            }
            __check(t, e) {
              try {
                t();
              } catch (t) {
                alert(e);
              }
            }
            __getLib() {
              let t = window.localStorage;
              return (
                t || alert("无法访问浏览器数据库，请更换或升级浏览器！"), t
              );
            }
            __select2Init() {
              const t = Array.from(this._selects),
                e = $(t[0]),
                s = e.css("background-color"),
                i = e.css("color"),
                n = e.css("border"),
                r = e.css("border-radius"),
                o = t.map((t) => {
                  const e = $(t);
                  let s = $(e[0].options[0]).attr("value");
                  return (
                    s || (s = 0),
                    // e
                    //   .select2({
                    //     placeholder: {
                    //       id: s,
                    //     },
                    //     allowClear: !0,
                    //   })
                    //   .on("select2:unselecting", function () {
                    //     $(this).data("unselecting", !0);
                    //   })
                    //   .on("select2:opening", function (t) {
                    //     $(this).data("unselecting") &&
                    //       ($(this).removeData("unselecting"), t.preventDefault());
                    //   }),
                    e
                  );
                });
              return (
                // GM_addStyle(
                //   `\n\t\t\t.select2-container .select2-selection--single {\n\t\t\t\tbackground-color: ${s};\n\t\t\t\tborder: ${n};\n\t\t\t\tborderRadius: ${r};\n\t\t\t}\n\t\t\t.select2-dropdown {\n\t\t\t\tbackground-color: ${s};\n\t\t\t\tcolor: ${i};\n\t\t\t\tborder: ${n};\n\t\t\t}\n\t\t\t.select2-selection {\n\t\t\t\tbackground-color: ${s};\n\t\t\t}\n\t\t\t.select2-container--default .select2-selection--single .select2-selection__rendered {\n\t\t\t\tcolor: ${i};\n\t\t\t}\n\t\t\t`
                // ),
                // GM_addStyle(
                //   "\n\t\t::-webkit-scrollbar {/*滚动条整体样式*/\n\t\t\twidth: 4px;     /*高宽分别对应横竖滚动条的尺寸*/\n\t\t\theight: 4px;\n\t\t}\n\t\t::-webkit-scrollbar-thumb {/*滚动条里面小方块*/\n\t\t\tborder-radius: 5px;\n\t\t\t-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);\n\t\t\tbackground: rgba(0,0,0,0.2);\n\t\t}\n\t\t::-webkit-scrollbar-track {/*滚动条里面轨道*/\n\t\t\t-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);\n\t\t\tborder-radius: 0;\n\t\t\tbackground: rgba(0,0,0,0.1);\n\t\t}\n\t\t"
                // ),
                o
              );
            }
            setSkillSelectPriority() {
              const t = Array.from(this._selects),
                s = t[e.USE_SKILL],
                i = t[e.SKILL],
                n = $(i.options[0]);
              Array.from(s.options).map((t) => {
                Array.from(i.options).filter((e) => {
                  if (t.innerHTML === e.innerHTML && "&nbsp;" !== t.innerHTML) {
                    const t = $("<option/>");
                    return (
                      t.addClass($(e).className),
                      t.val($(e).val()),
                      t.text($(e).text()),
                      $(i).remove($(e)),
                      n.after(t),
                      !0
                    );
                  }
                });
              });
            }
            clear(t = !1) {
              Object.keys(e).map((t) => {
                this.setSelect(e[t]);
              }),
                this.setConsumable(),
                this.setGroup(),
                this.setRequireAttribute(),
                this.setLevel(),
                this.setMaxCondition(),
                this.setMinCondition(),
                t && this.search();
            }
            search() {
              this.searchButton.click();
            }
            setClasses(t) {
              return this.setSelect(e.CLASSES, t);
            }
            setRace(t) {
              return this.setSelect(e.RACE, t);
            }
            setPosition(t) {
              return this.setSelect(e.POSITION, t);
            }
            setUnique(t) {
              return this.setSelect(e.UNIQUE, t);
            }
            setAttribute(t) {
              return this.setSelect(e.ATTRIBUTE, t);
            }
            setItemType(t) {
              return this.setSelect(e.ITEM_TYPE, t);
            }
            setSkill(t) {
              return this.setSelect(e.SKILL, t);
            }
            setUseSkill(t) {
              return this.setSelect(e.USE_SKILL, t);
            }
            setSkillType(t) {
              return this.setSelect(e.SKILL_TYPE, t);
            }
            setCoordinate(t) {
              return this.setSelect(e.COORDINATE, t);
            }
            setInlay(t) {
              return this.setSelect(e.INLAY, t);
            }
            setRequireAttribute(t = "eff_at_st", s = "") {
              return (
                (this.attrRequire.value = s),
                this.setSelect(e.REQUIRE_ATTRIBUTE, t)
              );
            }
            setLevel(t = !1, e = 1) {
              t && this.levelSelect.click(), (this.level.value = e);
            }
            setMinCondition(t = 0) {
              this.minCondition[t].click();
            }
            setMaxCondition(t = 6) {
              this.maxCondition[t].click();
            }
            setConsumable(t = 0) {
              this.consumable[t].click();
            }
            setGroup(t = 0) {
              this.group[t].click();
            }
            setSelect(t = 0, e = 0) {
              const s = $(this.selects[t]);
              return s.val(e).trigger("change"), s;
            }
          }
          (i.getOnt = () => (s || (s = new i()), s)),
            (i.SELECT_ITEM = e),
            (i.CLASSES = {
              ADVENTURER: 22,
              MAGES_APPRENTICE: 23,
              ARCHER: 21,
              BARBARIAN: 2,
              MAGE: 59,
              ALCHEMIST: 30,
              BARD: 7,
              DRIFTER: 17,
              GLADIATOR: 1,
              HUNTER: 4,
              JUGGLER: 71,
              KNIGHT: 68,
              PALADIN: 67,
              PRIEST: 69,
              SCHOLAR: 3,
              SHAMAN: 11,
              NECROMANCER: 26,
              DANCER: 18,
              ALL: 0,
            }),
            (i.RACE = {
              BORDER_LANDER: 6,
              GNOME: 14,
              HALFING: 13,
              HILL_DWARF: 15,
              KERASI: 20,
              MAG_MOR_ELF: 12,
              TIRAM_AG_ELF: 8,
              WOODLANDE: 10,
              DINTURAN: 5,
              MOUNTAIN_DWARF: 16,
              RASHANI: 19,
              ALL: 0,
            }),
            (t.exports = i);
        },
        90: (t, e, s) => {
          var i = {
            "./Hero.js": 593,
            "./SelectBox.js": 380,
          };
          function n(t) {
            var e = r(t);
            return s(e);
          }
          function r(t) {
            if (!s.o(i, t)) {
              var e = new Error("Cannot find module '" + t + "'");
              throw ((e.code = "MODULE_NOT_FOUND"), e);
            }
            return i[t];
          }
          (n.keys = function () {
            return Object.keys(i);
          }),
            (n.resolve = r),
            (t.exports = n),
            (n.id = 90);
        },
      },
      e = {};
    function s(i) {
      var n = e[i];
      if (void 0 !== n) return n.exports;
      var r = (e[i] = {
        exports: {},
      });
      return t[i](r, r.exports, s), r.exports;
    }
    s.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
    var i = s(138);
    WOD = i;
  })();

  const selectBox = WOD.SelectBox.getOnt();

  const ITEM_POSITION = {
    // 仓库
    LOCAL: 1,
    // 团队仓库
    PUBLIC: 2,
    // 宝库
    GROUP: 3,
    // 储藏室
    PRIVATE: 4,
  };

  // storage
  const lib = window.localStorage;

  // 应用改动
  const post = $("input[name=ok]");

  // 位置口
  const itemFrom = $("input[name*=doEquipItem]");

  // 位置选择框
  const itemSelect = $("select[name=dummy]");

  // 执行状态key
  const STATUS = "wod_awesome_warehouse_status";

  // 耗材入仓状态key
  const AUTO_SAVE_CONSUMABLE = "wod_awesome_warehouse_save_consumable";

  // 团物归仓状态key
  const GROUP_BACK = "wod_awesome_warehouse_group_back";

  // 全部入仓
  const AUTO_SAVE_ALL = "wod_awesome_warehouse_save_all";

  // 全部入仓
  const AUTO_SAVE_ALL_TOTAL = "wod_awesome_warehouse_save_all_total";

  class Controller {
    constructor() {
      // 待执行脚本
      this.funcs = {};
      // 增强控制器
      this.controller = this._initController();
      // 耗材入仓
      this.createAutoFunWithItemReturnToPosition(
        "团队",
        "耗材入仓",
        "将耗材放入团队仓库",
        AUTO_SAVE_CONSUMABLE,
        ITEM_POSITION.PUBLIC,
        (select) => {
          selectBox.setGroup(select ? 0 : 2);
          this.autoSelectByConsumable(AUTO_SAVE_CONSUMABLE);
        }
      );

      // 团物归仓
      this.createAutoFunWithItemReturnToPosition(
        "耗材",
        "团物归仓",
        "将团队物品放回宝库",
        GROUP_BACK,
        ITEM_POSITION.GROUP,
        (select) => {
          selectBox.setConsumable(select ? 0 : 2);
          this.autoSelectByGroup(GROUP_BACK);
        }
      );

      // 全部入仓;
      this.createAutoFunWithItemReturnToPosition(
        null,
        "全部入仓",
        "将非团队物品放入团队仓库",
        AUTO_SAVE_ALL,
        ITEM_POSITION.PUBLIC,
        () => {
          selectBox.setGroup(2);
          this.autoSelectByAll(AUTO_SAVE_ALL);
        }
      );

      let allowSell = localStorage.getItem(SPECIAL_ITEMS_ALLOW_SELL);
      // 切换出售模式;
      this.createAutoFunWithItemReturnToPosition(
        null,
        allowSell ? "切换到非出售模式" : "切换到出售模式",
        "特殊非唯一物品在出售模式和非出售模式之间切换",
        AUTO_SAVE_ALL_TOTAL,
        ITEM_POSITION.PUBLIC,
        () => {
          localStorage.setItem(
            SPECIAL_ITEMS_ALLOW_SELL,
            allowSell ? "" : "ALLOW"
          );
          location.reload();
        }
      );

      // 检查可执行脚本
      this.check();
    }

    _initController() {
      GM_addStyle(`
				#awesome{
					width: 100%;
					border: 1px solid #FFD306;
					border-collapse: separate;
					display: flex;
					padding: 10px;
				}
			`);

      const searchContainer = $(".search_container");
      const controller = $(`<div id="awesome"></div>`);
      searchContainer.after(controller);

      // this.setSelectAutoOpen();
      // this.addSelectCanCancel();
      return controller;
    }

    addSelectCanCancel() {
      selectBox.selects.map((select) => {
        const selectView = select[0].nextElementSibling;
        const i = $("<div/>");
        i.val("x");
        $(selectView).append(i);
      });
    }

    setSelectAutoOpen() {
      selectBox.selects.map((select) => {
        let startTimeStamp = new Date().getTime();
        // 是否显示搜索栏
        let selectShow = false;
        // 搜索框是否被悬停
        let selected = false;
        // 搜索列表是否被悬停
        let dropSelected = false;
        // 计时器
        let tick;
        // 搜索栏是否使用
        let used = false;
        const selectView = select[0].nextElementSibling;
        selectView.addEventListener("mouseenter", (e) => {
          if (used) return;
          startTimeStamp = e.timeStamp;
          tick = setInterval(() => {
            if (new Date().getTime() - startTimeStamp >= 100) selectShow = true;
            if (selectShow) {
              window.clearInterval(tick);
              select.select2("open");

              const dropdown = $(".select2-dropdown")[0];

              dropdown.addEventListener("mouseenter", () => {
                dropSelected = true;
              });

              dropdown.addEventListener("mouseleave", () => {
                dropSelected = false;
                setTimeout(() => {
                  if (!selected) select.select2("close");
                }, 100);
              });
            }
          }, 100);
        });
        selectView.addEventListener("mouseleave", () => {
          selected = false;
          window.clearInterval(tick);
          setTimeout(() => {
            if (!dropSelected) select.select2("close");
          }, 100);
        });
      });
    }

    check() {
      const status = lib.getItem(STATUS);
      status &&
        JSON.parse(status).map((each) => {
          if (lib.getItem(each) && this.funcs[each] !== undefined)
            this.funcs[each]();
        });
    }

    createAutoFunWithItemReturnToPosition(
      check,
      bt,
      desc,
      flag,
      position,
      callback
    ) {
      this.add(new PowerButton(check, bt, desc, flag, callback));
      this.addReturnFun(flag, position);
    }

    add(box) {
      this.controller.append(box.element);
    }

    addReturnFun(flag, position) {
      this.funcs[flag] = () => {
        if (itemFrom[0] && Number(lib.getItem(flag))) {
          itemFrom[0].click();
          const option = itemSelect[0].options[position];
          option.selected = true;
          this.selectActive(itemSelect[0]);
          lib.setItem(flag, 0);
          post.click();
        }
        lib.setItem(flag, 0);
      };
    }

    selectActive(ele) {
      const e = document.createEvent("HTMLEvents");
      e.initEvent("change", false, true);
      ele.dispatchEvent(e);
    }

    autoSelectBy(select, flag) {
      selectBox.clear();
      select();
      lib.setItem(flag, 1);
      selectBox.search();
    }

    autoSelectByConsumable(flag) {
      this.autoSelectBy(() => {
        selectBox.setConsumable(1);
      }, flag);
    }

    autoSelectByAll(flag) {
      this.autoSelectBy(() => {
        selectBox.setConsumable(0);
      }, flag);
    }

    autoSelectByGroup(flag) {
      this.autoSelectBy(() => {
        selectBox.setGroup(1);
      }, flag);
    }
  }

  class PowerButton {
    constructor(check, name, desc, flag, callback) {
      this.select = false;
      this.flag = flag;
      update(flag);
      this.element = this.createCheckButton(check, name, desc, callback);
    }

    createButton(name, desc, callback) {
      const button = $(`<a/>`);
      button.attr("href", "#");
      desc && button.attr("title", desc);
      button.addClass("button");
      button.text(name);
      button.on("click", () => {
        callback(this.select);
      });
      return button;
    }

    createCheckButton(checkName, btName, desc, callback) {
      const self = this;
      const box = $(`<div/>`);
      box.css("border", "1px solid #FFD306");
      box.css("padding", "10px");
      box.css("display", "flex");
      if (checkName) {
        const label = $("<label/>");
        const input = $("<input/>");
        input.attr("type", "checkbox");
        input.attr("name", "item_3hero_level_enabled");
        label.text(checkName);
        input.on("click", function () {
          if (this.checked === true) {
            self.select = true;
          } else {
            self.select = false;
          }
        });
        label.append(input);
        box.append(label);
      }
      const button = this.createButton(btName, desc, callback);
      box.append(button);
      return box;
    }
  }
  new Controller();

  function update(key) {
    const arr = JSON.parse(lib.getItem(STATUS)) || [];
    if (!arr.includes(key)) arr.push(key);
    lib.setItem(STATUS, JSON.stringify(arr));
  }
})();
