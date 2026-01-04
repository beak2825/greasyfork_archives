// ==UserScript==
// @name         MWI Profit Panel
// @namespace    http://tampermonkey.net/
// @version      2025.12.05
// @description  milkywayidle游戏利润插件，在右面板添加了根据当前市场数据计算出来的收益详情，掉落记录展示了掉落详情
// @author       MengLan
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      raw.githubusercontent.com
// @connect      ghproxy.net
// @connect      mooket.qi-e.top
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @resource     bootstrapCSS  https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536724/MWI%20Profit%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/536724/MWI%20Profit%20Panel.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 全局状态管理器
    class GlobalState {
      constructor() {
        this._state = {
          initClientData_itemDetailMap: {},
          initClientData_actionDetailMap: {},
          initClientData_openableLootDropMap: {},
          initCharacterData_characterSkills: [],
          initCharacterData_actionTypeDrinkSlotsMap: {},
          initCharacterData_characterHouseRoomMap: {},
          initCharacterData_characterItems: [],
          initCharacterData_communityActionTypeBuffsMap: {},
          initCharacterData_consumableActionTypeBuffsMap: {},
          initCharacterData_houseActionTypeBuffsMap: {},
          initCharacterData_equipmentActionTypeBuffsMap: {},
          hasMarketItemUpdate: false,
          isZHInGameSetting: false,
          freshnessMarketJson: {},
          medianMarketJson: {},
          processingMap: {},
          en2ZhMap: {},
          lootLog: [],
          profitSettings: {}
        };
        this._listeners = new Set();
        return new Proxy(this, {
          get(target, prop) {
            if (prop in target._state) {
              return target._state[prop];
            }
            return target[prop];
          },
          set(target, prop, value) {
            if (prop in target._state) {
              target._state[prop] = value;
              target._notifyListeners(prop, value);
              return true;
            }
            target[prop] = value;
            return true;
          }
        });
      }
      _notifyListeners(prop, value) {
        this._listeners.forEach(cb => cb(prop, value));
      }
      subscribe(callback) {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
      }
    }
    var globals = new GlobalState();

    var zhTranslation = {
      ...{
        global: {
          gameName: "\u94f6\u6cb3\u5976\u725b\u653e\u7f6e"
        },
        modalProvider: {
          ok: "\u786e\u5b9a",
          cancel: "\u53d6\u6d88",
          yes: "\u786e\u5b9a",
          no: "\u53d6\u6d88"
        },
        actionsUtil: {
          itemNotAvailable: "[\u7269\u54c1\u4e0d\u53ef\u7528]",
          doingNothing: "\u65e0\u6240\u4e8b\u4e8b...",
          partySuffix: " (\u961f\u4f0d)"
        },
        characterItemsUtil: {
          mainHand: "\u4e3b\u624b",
          offHand: "\u526f\u624b",
          back: "\u80cc\u90e8",
          head: "\u5934\u90e8",
          charm: "\u62a4\u7b26",
          body: "\u8eab\u4f53",
          legs: "\u817f\u90e8",
          hands: "\u624b\u90e8",
          feet: "\u811a\u90e8",
          pouch: "\u888b\u5b50",
          neck: "\u9879\u94fe",
          earrings: "\u8033\u73af",
          ring: "\u6212\u6307",
          trinket: "\u9970\u54c1",
          milkingTool: "\u6324\u5976\u5de5\u5177",
          foragingTool: "\u91c7\u6458\u5de5\u5177",
          woodcuttingTool: "\u4f10\u6728\u5de5\u5177",
          cheesesmithingTool: "\u5976\u916a\u953b\u9020\u5de5\u5177",
          craftingTool: "\u5236\u4f5c\u5de5\u5177",
          tailoringTool: "\u7f1d\u7eab\u5de5\u5177",
          cookingTool: "\u70f9\u996a\u5de5\u5177",
          brewingTool: "\u51b2\u6ce1\u5de5\u5177",
          alchemyTool: "\u70bc\u91d1\u5de5\u5177",
          enhancingTool: "\u5f3a\u5316\u5de5\u5177"
        },
        combatStats: {
          primaryTraining: "\u4e3b\u4fee\u8bad\u7ec3",
          focusTraining: "\u9009\u4fee\u8bad\u7ec3",
          combatStyleHrids: "\u6218\u6597\u98ce\u683c",
          damageType: "\u4f24\u5bb3\u7c7b\u578b",
          attackInterval: "\u653b\u51fb\u95f4\u9694",
          autoAttackDamage: "\u81ea\u52a8\u653b\u51fb\u4f24\u5bb3",
          abilityDamage: "\u6280\u80fd\u4f24\u5bb3",
          attackSpeed: "\u653b\u51fb\u901f\u5ea6",
          castSpeed: "\u65bd\u6cd5\u901f\u5ea6",
          abilityHaste: "\u6280\u80fd\u6025\u901f",
          criticalRate: "\u66b4\u51fb\u7387",
          criticalDamage: "\u66b4\u51fb\u4f24\u5bb3",
          stabAccuracy: "\u523a\u51fb\u7cbe\u51c6\u5ea6",
          slashAccuracy: "\u65a9\u51fb\u7cbe\u51c6\u5ea6",
          smashAccuracy: "\u949d\u51fb\u7cbe\u51c6\u5ea6",
          rangedAccuracy: "\u8fdc\u7a0b\u7cbe\u51c6\u5ea6",
          magicAccuracy: "\u9b54\u6cd5\u7cbe\u51c6\u5ea6",
          stabDamage: "\u523a\u51fb\u4f24\u5bb3",
          slashDamage: "\u65a9\u51fb\u4f24\u5bb3",
          smashDamage: "\u949d\u51fb\u4f24\u5bb3",
          rangedDamage: "\u8fdc\u7a0b\u4f24\u5bb3",
          magicDamage: "\u9b54\u6cd5\u4f24\u5bb3",
          defensiveDamage: "\u9632\u5fa1\u4f24\u5bb3",
          taskDamage: "\u4efb\u52a1\u4f24\u5bb3",
          physicalAmplify: "\u7269\u7406\u589e\u5e45",
          waterAmplify: "\u6c34\u7cfb\u589e\u5e45",
          natureAmplify: "\u81ea\u7136\u7cfb\u589e\u5e45",
          fireAmplify: "\u706b\u7cfb\u589e\u5e45",
          healingAmplify: "\u6cbb\u7597\u589e\u5e45",
          armorPenetration: "\u62a4\u7532\u7a7f\u900f",
          waterPenetration: "\u6c34\u7cfb\u7a7f\u900f",
          naturePenetration: "\u81ea\u7136\u7cfb\u7a7f\u900f",
          firePenetration: "\u706b\u7cfb\u7a7f\u900f",
          physicalThorns: "\u7269\u7406\u8346\u68d8",
          elementalThorns: "\u5143\u7d20\u8346\u68d8",
          retaliation: "\u53cd\u4f24",
          maxHitpoints: "\u6700\u5927HP",
          maxManapoints: "\u6700\u5927MP",
          stabEvasion: "\u523a\u51fb\u95ea\u907f",
          slashEvasion: "\u65a9\u51fb\u95ea\u907f",
          smashEvasion: "\u949d\u51fb\u95ea\u907f",
          rangedEvasion: "\u8fdc\u7a0b\u95ea\u907f",
          magicEvasion: "\u9b54\u6cd5\u95ea\u907f",
          armor: "\u62a4\u7532",
          waterResistance: "\u6c34\u7cfb\u6297\u6027",
          natureResistance: "\u81ea\u7136\u7cfb\u6297\u6027",
          fireResistance: "\u706b\u7cfb\u6297\u6027",
          damageTaken: "\u627f\u53d7\u4f24\u5bb3",
          lifeSteal: "\u751f\u547d\u5077\u53d6",
          manaLeech: "\u6cd5\u529b\u5438\u53d6",
          tenacity: "\u97e7\u6027",
          threat: "\u5a01\u80c1",
          hpRegenPer10: "\u751f\u547d\u6062\u590d",
          mpRegenPer10: "\u6cd5\u529b\u6062\u590d",
          foodHaste: "\u98df\u7269\u6025\u901f",
          drinkConcentration: "\u996e\u6599\u6d53\u5ea6",
          combatDropRate: "\u6218\u6597\u6389\u843d\u7387",
          combatDropQuantity: "\u6218\u6597\u6389\u843d\u6570\u91cf",
          combatRareFind: "\u6218\u6597\u7a00\u6709\u53d1\u73b0",
          combatExperience: "\u6218\u6597\u7ecf\u9a8c",
          staminaExperience: "\u8010\u529b\u7ecf\u9a8c",
          intelligenceExperience: "\u667a\u529b\u7ecf\u9a8c",
          attackExperience: "\u653b\u51fb\u7ecf\u9a8c",
          defenseExperience: "\u9632\u5fa1\u7ecf\u9a8c",
          meleeExperience: "\u8fd1\u6218\u7ecf\u9a8c",
          rangedExperience: "\u8fdc\u7a0b\u7ecf\u9a8c",
          magicExperience: "\u9b54\u6cd5\u7ecf\u9a8c",
          foodSlots: "\u98df\u7269\u69fd\u4f4d",
          drinkSlots: "\u996e\u6599\u69fd\u4f4d",
          weaken: "\u524a\u5f31",
          fury: "\u72c2\u6012",
          parry: "\u683c\u6321",
          mayhem: "\u66b4\u4e71",
          pierce: "\u7a7f\u523a",
          curse: "\u8bc5\u5492",
          ripple: "\u6d9f\u6f2a",
          bloom: "\u7efd\u653e",
          blaze: "\u70bd\u7130"
        },
        noncombatStats: {
          skillingSpeed: "\u4e13\u4e1a\u901f\u5ea6",
          milkingSpeed: "\u6324\u5976\u901f\u5ea6",
          foragingSpeed: "\u91c7\u6458\u901f\u5ea6",
          woodcuttingSpeed: "\u4f10\u6728\u901f\u5ea6",
          cheesesmithingSpeed: "\u5976\u916a\u953b\u9020\u901f\u5ea6",
          craftingSpeed: "\u5236\u4f5c\u901f\u5ea6",
          tailoringSpeed: "\u7f1d\u7eab\u901f\u5ea6",
          cookingSpeed: "\u70f9\u996a\u901f\u5ea6",
          brewingSpeed: "\u51b2\u6ce1\u901f\u5ea6",
          alchemySpeed: "\u70bc\u91d1\u901f\u5ea6",
          enhancingSpeed: "\u5f3a\u5316\u901f\u5ea6",
          taskSpeed: "\u4efb\u52a1\u901f\u5ea6",
          skillingEfficiency: "\u4e13\u4e1a\u6548\u7387",
          milkingEfficiency: "\u6324\u5976\u6548\u7387",
          foragingEfficiency: "\u91c7\u6458\u6548\u7387",
          woodcuttingEfficiency: "\u4f10\u6728\u6548\u7387",
          cheesesmithingEfficiency: "\u5976\u916a\u953b\u9020\u6548\u7387",
          craftingEfficiency: "\u5236\u4f5c\u6548\u7387",
          tailoringEfficiency: "\u7f1d\u7eab\u6548\u7387",
          cookingEfficiency: "\u70f9\u996a\u6548\u7387",
          brewingEfficiency: "\u51b2\u6ce1\u6548\u7387",
          alchemyEfficiency: "\u70bc\u91d1\u6548\u7387",
          enhancingSuccess: "\u5f3a\u5316\u6210\u529f\u7387",
          gatheringQuantity: "\u91c7\u96c6\u6570\u91cf",
          drinkConcentration: "\u996e\u6599\u6d53\u5ea6",
          skillingEssenceFind: "\u4e13\u4e1a\u7cbe\u534e\u53d1\u73b0",
          skillingRareFind: "\u4e13\u4e1a\u7a00\u6709\u53d1\u73b0",
          milkingRareFind: "\u6324\u5976\u7a00\u6709\u53d1\u73b0",
          foragingRareFind: "\u91c7\u6458\u7a00\u6709\u53d1\u73b0",
          woodcuttingRareFind: "\u4f10\u6728\u7a00\u6709\u53d1\u73b0",
          cheesesmithingRareFind: "\u5976\u916a\u953b\u9020\u7a00\u6709\u53d1\u73b0",
          craftingRareFind: "\u5236\u4f5c\u7a00\u6709\u53d1\u73b0",
          tailoringRareFind: "\u7f1d\u7eab\u7a00\u6709\u53d1\u73b0",
          cookingRareFind: "\u70f9\u996a\u7a00\u6709\u53d1\u73b0",
          brewingRareFind: "\u51b2\u6ce1\u7a00\u6709\u53d1\u73b0",
          alchemyRareFind: "\u70bc\u91d1\u7a00\u6709\u53d1\u73b0",
          enhancingRareFind: "\u5f3a\u5316\u7a00\u6709\u53d1\u73b0",
          skillingExperience: "\u4e13\u4e1a\u7ecf\u9a8c",
          milkingExperience: "\u6324\u5976\u7ecf\u9a8c",
          foragingExperience: "\u91c7\u6458\u7ecf\u9a8c",
          woodcuttingExperience: "\u4f10\u6728\u7ecf\u9a8c",
          cheesesmithingExperience: "\u5976\u916a\u953b\u9020\u7ecf\u9a8c",
          craftingExperience: "\u5236\u4f5c\u7ecf\u9a8c",
          tailoringExperience: "\u7f1d\u7eab\u7ecf\u9a8c",
          cookingExperience: "\u70f9\u996a\u7ecf\u9a8c",
          brewingExperience: "\u51b2\u6ce1\u7ecf\u9a8c",
          alchemyExperience: "\u70bc\u91d1\u7ecf\u9a8c",
          enhancingExperience: "\u5f3a\u5316\u7ecf\u9a8c"
        },
        home: {
          nav: {
            home: "\u9996\u9875",
            news: "\u65b0\u95fb",
            patchNotes: "\u66f4\u65b0\u65e5\u5fd7",
            gameGuide: "\u6e38\u620f\u6307\u5357"
          },
          title: "$t(global.gameName) - \u591a\u4eba\u653e\u7f6e\u6e38\u620f - \u6536\u96c6\u3001\u5236\u4f5c\u3001\u6218\u6597\u3001\u4ea4\u6613\uff0c\u8fd8\u6709\u66f4\u591a\u7cbe\u5f69\uff01",
          subtitle: "\u591a\u4eba\u653e\u7f6eRPG",
          bannerText: "\u8e0f\u4e0a\u4e00\u6bb5\u7a7f\u8d8a$t(global.gameName)\u7684\u65c5\u7a0b\uff0c\u8fd9\u662f\u4e00\u6b3e\u72ec\u7279\u7684\u591a\u4eba\u653e\u7f6e\u6e38\u620f\u3002\u65e0\u8bba\u4f60\u559c\u6b22\u6536\u96c6\u8d44\u6e90\u3001\u5236\u4f5c\u7269\u54c1\uff0c\u8fd8\u662f\u53c2\u4e0e\u4e0e\u5916\u661f\u602a\u7269\u7684\u53f2\u8bd7\u6218\u6597\uff0c\u8fd9\u91cc\u90fd\u6709\u5c5e\u4e8e\u4f60\u7684\u4e50\u8da3\uff01\u4f60\u53ef\u4ee5\u6c89\u6d78\u5728\u6211\u4eec\u7e41\u8363\u7684\u793e\u533a\u4e2d\uff0c\u5728\u73a9\u5bb6\u9a71\u52a8\u7684\u5e02\u573a\u4e2d\u4ea4\u6613\u7269\u54c1\uff0c\u4e0e\u670b\u53cb\u7ec4\u5efa\u516c\u4f1a\u3001\u7545\u804a\u4ea4\u6d41\uff0c\u751a\u81f3\u51b2\u51fb\u6392\u884c\u699c\u5dc5\u5cf0\uff01",
          testServer: "\u6d4b\u8bd5\u670d\u52a1\u5668",
          activePlayerCount: "\u5f53\u524d\u6709 {{count}} \u540d\u6d3b\u8dc3\u73a9\u5bb6\uff01",
          showcases: {
            gatherAndCraft: {
              title: "\u6536\u96c6\u548c\u5236\u4f5c",
              text: "\u6324\u5976\u3001\u91c7\u96c6\u3001\u4f10\u6728\u3001\u5976\u916a\u953b\u9020\u3001\u5236\u4f5c\u3001\u7f1d\u7eab\u3001\u70f9\u996a\u3001\u51b2\u6ce1\u3001\u70bc\u91d1\u3001\u5f3a\u5316"
            },
            combat: {
              title: "\u6218\u6597",
              text: "\u591a\u79cd\u6218\u6597\u98ce\u683c\uff0c\u53ef\u5b9a\u4e49\u6d88\u8017\u54c1\u548c\u6280\u80fd\u7684\u81ea\u52a8\u4f7f\u7528\u3002\u5355\u4eba\u6216\u7ec4\u961f\u6218\u6597"
            },
            marketplace: {
              title: "\u5e02\u573a",
              text: "\u4e70\u5356\u8d44\u6e90\u3001\u6d88\u8017\u54c1\u3001\u88c5\u5907\u7b49\u7269\u54c1"
            },
            community: {
              title: "\u793e\u533a",
              text: "\u4e0e\u670b\u53cb\u7ec4\u961f\u804a\u5929\uff0c\u4e89\u593a\u6392\u884c\u699c\u7684\u4e00\u5e2d\u4e4b\u5730\uff01"
            }
          },
          footer: {
            termsOfUse: "\u4f7f\u7528\u6761\u6b3e",
            privacyPolicy: "\u9690\u79c1\u653f\u7b56",
            emailContact: "\u8054\u7cfb\u6211\u4eec"
          }
        },
        auth: {
          tabs: {
            playAsGuest: "\u6e38\u5ba2\u767b\u5f55",
            register: "\u6ce8\u518c",
            login: "\u767b\u5f55"
          },
          serverError: {
            title: "\u65e0\u6cd5\u8fde\u63a5\u5230\u670d\u52a1\u5668",
            message: "\u4f60\u5f53\u524d\u65e0\u6cd5\u8fde\u63a5\u5230\u6e38\u620f\u670d\u52a1\u5668\u3002\u8fd9\u53ef\u80fd\u662f\u7531\u4e8e\u6e38\u620f\u6b63\u5728\u66f4\u65b0\u3001\u670d\u52a1\u5668\u7ef4\u62a4\uff0c\u6216\u8005\u4f60\u548c\u670d\u52a1\u5668\u4e4b\u95f4\u5b58\u5728\u7f51\u7edc\u95ee\u9898\uff08\u4f8b\u5982\u9632\u706b\u5899\uff09\u3002\u8bf75-10\u5206\u949f\u540e\u5237\u65b0\u9875\u9762\u518d\u8bd5\u3002"
          },
          thirdPartyCookieMessage: {
            title: "\u767b\u5f55",
            message: "\u4f60\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u7b2c\u4e09\u65b9Cookie\uff0c\u8fd9\u662f\u5728iframe\u5185\u73a9\u6e38\u620f\u6240\u5fc5\u9700\u7684\u3002\u8bf7\u542f\u7528\u7b2c\u4e09\u65b9Cookie\u6216\u4ece<a href='https://www.milkywayidle.com' target='_blank'>www.milkywayidle.com</a>\u8fdb\u884c\u6e38\u620f\u3002"
          },
          welcomeBack: {
            title: "\u6b22\u8fce\u56de\u6765\uff01",
            logout: "\u9000\u51fa\u767b\u9646"
          },
          buttons: {
            enterGame: "\u8fdb\u5165\u6e38\u620f"
          },
          confirmationMessages: {
            guestWarning: "\u8b66\u544a: \u8bbf\u5ba2\u8d26\u6237\u53ea\u80fd\u901a\u8fc7\u8bbe\u7f6e\u4e2d\u7684\u8bbf\u5ba2\u5bc6\u7801\u518d\u6b21\u767b\u5f55\u3002",
            logoutConfirmation: "\u4f60\u786e\u5b9a\u8981\u9000\u51fa\u767b\u9646\u5417\uff1f"
          },
          shared: {
            agreeToRulesLabel: "\u6211\u540c\u610f<termsLink>\u300a\u4f7f\u7528\u6761\u6b3e\u300b</termsLink>\u3001<privacyPolicyLink>\u300a\u9690\u79c1\u653f\u7b56\u300b</privacyPolicyLink>\u3001\u548c<gameRulesLink>\u300a\u6e38\u620f\u89c4\u5219\u300b</gameRulesLink>",
            agreeToOneAccountLabel: "\u6211\u540c\u610f\u6211\u53ea\u53ef\u73a9\u4e00\u4e2a\u8d26\u6237",
            errors: {
              agreeToRulesError: "\u4f60\u5fc5\u987b\u540c\u610f\u6e38\u620f\u89c4\u5219",
              agreeToOneAccountError: "\u4f60\u5fc5\u987b\u540c\u610f\u53ea\u73a9\u4e00\u4e2a\u8d26\u6237",
              serverUnreachable: "\u670d\u52a1\u5668\u65e0\u6cd5\u8bbf\u95ee\u6216\u79bb\u7ebf",
              captchaFailedError: "\u9a8c\u8bc1\u7801\u9a8c\u8bc1\u5931\u8d25",
              unexpectedError: "\u610f\u5916\u9519\u8bef"
            }
          }
        },
        playAsGuestForm: {
          title: "\u4ee5\u8bbf\u5ba2\u8eab\u4efd\u6e38\u73a9",
          info: "\u4f60\u7684\u4f1a\u8bdd\u5c06\u4fdd\u5b58\u5728\u6b64\u6d4f\u89c8\u5668\u4e2d\u3002\u8981\u8de8\u591a\u4e2a\u8bbe\u5907\u6e38\u73a9\uff0c\u4f60\u53ef\u4ee5\u5728\u6e38\u620f\u4e2d\u7684<b>\u8bbe\u7f6e</b>\u4e2d\u627e\u5230\u4f60\u7684<b>\u8bbf\u5ba2\u5bc6\u7801</b>\u6216\u8fdb\u884c\u5b8c\u6574<b>\u6ce8\u518c</b>\u3002",
          playButton: "\u6e38\u73a9"
        },
        registerForm: {
          title: "\u6ce8\u518c",
          emailLabel: "\u90ae\u7bb1",
          passwordLabel: "\u5bc6\u7801",
          passwordConfirmationLabel: "\u786e\u8ba4\u5bc6\u7801",
          registerButton: "\u6ce8\u518c",
          errors: {
            emailEmpty: "\u90ae\u7bb1\u4e0d\u80fd\u4e3a\u7a7a",
            invalidEmail: "\u8bf7\u8f93\u5165\u6709\u6548\u7684\u90ae\u7bb1",
            passwordTooShort: "\u5bc6\u7801\u81f3\u5c11\u9700\u89816\u4e2a\u5b57\u7b26",
            passwordsDoNotMatch: "\u5bc6\u7801\u4e0d\u5339\u914d"
          }
        },
        loginForm: {
          back: "< \u8fd4\u56de",
          title: "\u767b\u5f55",
          titleSteam: "\u767b\u5f55$t(global.gameName)",
          emailOrNameLabel: "\u90ae\u7bb1\u6216\u7528\u6237\u540d",
          passwordLabel: "\u5bc6\u7801",
          loginButton: "\u767b\u5f55",
          forgotPassword: "\u5fd8\u8bb0\u5bc6\u7801",
          errors: {
            emailOrNameEmpty: "\u90ae\u7bb1/\u7528\u6237\u540d\u4e0d\u80fd\u4e3a\u7a7a",
            passwordEmpty: "\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a"
          }
        },
        forgotPassword: {
          title: "\u5fd8\u8bb0\u5bc6\u7801",
          infoMessage: "\u5982\u679c\u4f60\u7684\u5e10\u6237\u5df2\u4f7f\u7528\u6709\u6548\u7535\u5b50\u90ae\u4ef6\u6ce8\u518c\uff0c\u4f60\u5c06\u6536\u5230\u4e00\u5c01\u5305\u542b\u91cd\u7f6e\u8bf4\u660e\u7684\u5bc6\u7801\u91cd\u7f6e\u90ae\u4ef6\u3002(\u53ef\u80fd\u9700\u8981\u68c0\u67e5\u5783\u573e\u90ae\u4ef6\u6587\u4ef6\u5939)",
          emailLabel: "\u7535\u5b50\u90ae\u4ef6",
          resetPasswordButton: "\u91cd\u7f6e\u5bc6\u7801",
          backToLogin: "\u8fd4\u56de\u767b\u5f55",
          successMessage: "\u5982\u679c\u8be5\u7535\u5b50\u90ae\u4ef6\u5730\u5740\u4e0e\u5e10\u6237\u5173\u8054\uff0c\u5df2\u53d1\u9001\u7535\u5b50\u90ae\u4ef6\u3002",
          errors: {
            emailEmptyError: "\u7535\u5b50\u90ae\u4ef6\u4e0d\u80fd\u4e3a\u7a7a",
            invalidEmailError: "\u8bf7\u8f93\u5165\u6709\u6548\u7684\u7535\u5b50\u90ae\u4ef6"
          }
        },
        playFromKongregate: {
          title: "\u4eceKongregate\u73a9\u6e38\u620f",
          noAccountMessage: "\u4f60\u5fc5\u987b\u62e5\u6709\u4e00\u4e2aKongregate\u5e10\u6237\u624d\u80fd\u8fdb\u884c\u6e38\u620f\u3002",
          registerButton: "\u6ce8\u518c",
          signInInfo: "\u767b\u5f55$t(global.gameName)\u3002\u5982\u679c\u662f\u521d\u6b21\u6e38\u73a9\uff0c\u53ef\u521b\u5efa\u65b0\u5e10\u6237\uff01",
          signInButton: "\u4eceKongregate\u767b\u5f55"
        },
        loginWithSteam: {
          signInTitle: "\u4eceSteam\u767b\u5f55\u6e38\u620f",
          signInInfo: "\u4f7f\u7528\u4f60\u7684Steam\u5e10\u6237\u5f00\u59cb\u73a9$t(global.gameName)\uff01",
          signInButton: "\u4eceSteam\u767b\u5f55",
          linkAccountTitle: "\u5df2\u6709$t(global.gameName)\u5e10\u6237\uff1f",
          linkAccountInfo: "\u5982\u679c\u4f60\u4e4b\u524d\u73a9\u8fc7\u7f51\u9875\u7248$t(global.gameName)\uff0c\u53ef\u4ee5\u5c06\u73b0\u6709\u5e10\u6237\u4e0eSteam\u7ed1\u5b9a\u3002",
          linkAccountButton: "\u6709\uff0c\u7ed1\u5b9a\u6211\u7684\u5e10\u6237",
          createAccountButton: "\u6ca1\u6709\uff0c\u521b\u5efa\u65b0\u5e10\u6237",
          steamAuthTicketError: "\u65e0\u6cd5\u83b7\u53d6Steam\u8eab\u4efd\u9a8c\u8bc1\u7968\u636e\u3002\u8bf7\u91cd\u65b0\u542f\u52a8Steam\u5e76\u91cd\u8bd5\u3002"
        },
        characterSelectPage: {
          title: "\u9009\u62e9\u89d2\u8272 - $t(global.gameName)",
          header: "\u9009\u62e9\u89d2\u8272",
          loading: "\u6b63\u5728\u52a0\u8f7d\u89d2\u8272...",
          createCharacterModal: {
            title: "\u521b\u5efa\u89d2\u8272",
            nameLabel: "\u89d2\u8272\u540d\u79f0:",
            namePlaceholder: "\u89d2\u8272\u540d\u79f0(2-16\u4e2a\u5b57\u6bcd\u6216\u6570\u5b57)",
            gameModeLabel: "\u6e38\u620f\u6a21\u5f0f:",
            maxCharacter: "\u6700\u591a{{count}}\u4e2a\u89d2\u8272",
            maxCharacter_one: "\u6700\u591a{{count}}\u4e2a\u89d2\u8272",
            maxCharacter_other: "\u6700\u591a{{count}}\u4e2a\u89d2\u8272",
            submitButton: "\u521b\u5efa",
            errors: {
              nameLength: "\u5fc5\u987b\u4e3a2\u523016\u4e2a\u5b57\u7b26",
              nameInvalid: "\u4ec5\u5141\u8bb8\u5b57\u6bcd\u548c\u6570\u5b57"
            }
          },
          slots: {
            slot: "\u69fd\u4f4d{{slotNum}}",
            empty: "\u7a7a",
            online: "\u5728\u7ebf",
            lastOnline: "\u4e0a\u6b21\u5728\u7ebf: {{duration}}\u524d"
          },
          errors: {
            fetchCharacters: "\u65e0\u6cd5\u83b7\u53d6\u89d2\u8272\u4fe1\u606f\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
            fetchGameModes: "\u65e0\u6cd5\u83b7\u53d6\u6e38\u620f\u6a21\u5f0f\u6570\u636e\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
            serverUnreachable: "\u670d\u52a1\u5668\u4e0d\u53ef\u8fbe\u6216\u79bb\u7ebf",
            unexpectedError: "\u672a\u77e5\u9519\u8bef"
          }
        },
        gamePage: {
          disconnectedFromServer: "\u4e0e\u670d\u52a1\u5668\u65ad\u5f00\u8fde\u63a5...",
          bannedMessage: "\u4f60\u88ab\u5c01\u7981\u81f3 {{banExpireTime}}\u3002{{banReason}}",
          refresh: "\u5237\u65b0",
          attemptingToConnect: "\u6b63\u5728\u8fde\u63a5\u5230\u670d\u52a1\u5668...",
          loadingTitle: "\u52a0\u8f7d\u4e2d - $t(global.gameName)",
          disconnectedTitle: "\u5df2\u65ad\u5f00\u8fde\u63a5 - $t(global.gameName)",
          guestLogoutWarning: "\u8b66\u544a: \u8bbf\u5ba2\u5e10\u6237\u53ea\u80fd\u901a\u8fc7\u8bbe\u7f6e\u4e2d\u7684\u8bbf\u5ba2\u5bc6\u7801\u518d\u6b21\u767b\u5f55\u3002",
          logoutConfirmation: "\u4f60\u786e\u5b9a\u8981\u9000\u51fa\u767b\u9646\u5417\uff1f",
          refreshPrompt: " \u8bf7\u5237\u65b0\u3002",
          gameServerRestarted: "\u6e38\u620f\u670d\u52a1\u5668\u5df2\u91cd\u542f\u3002\u8bf7\u5237\u65b0\u9875\u9762\u3002"
        },
        header: {
          flee: "\u9003\u8dd1",
          stop: "\u505c\u6b62",
          loadoutWithName: "\u914d\u88c5: {{name}}",
          loadoutUnavailable: "\u914d\u88c5\u5305\u542b\u7f3a\u5931\u7269\u54c1",
          loadoutDeleted: "\u914d\u88c5\u5df2\u5220\u9664",
          totalExperience: "\u603b\u7ecf\u9a8c: {{totalExp}}",
          totalLevel: "\u603b\u7b49\u7ea7: {{totalLevel}}",
          activePlayers: "\u6d3b\u8dc3\u89d2\u8272: {{activePlayerCount}}",
          confirmRunAway: "\u4f60\u786e\u5b9a\u8981\u9003\u79bb\u6218\u6597\u5417\uff1f",
          newTutorialMessage: "\u65b0\u6559\u7a0b\u6d88\u606f",
          newMessage: "\u65b0\u6d88\u606f",
          newTutorialTask: "\u65b0\u6559\u7a0b\u4efb\u52a1",
          newTask: "\u65b0\u4efb\u52a1",
          progress: "\u8fdb\u5ea6: {{currentCount}} / {{goalCount}}",
          successRate: "\u6210\u529f\u7387: {{successRate}}",
          usingCatalyst: "\u4f7f\u7528\u50ac\u5316\u5242",
          targetEnhance: "\u76ee\u6807: +{{enhancingMaxLevel}}",
          protectEnhance: "\u4fdd\u62a4: +{{enhancingProtectionMinLevel}}"
        },
        actionProgressBar: {
          fighting: "\u6218\u6597\u4e2d",
          travelingToBattle: "\u524d\u5f80\u6218\u6597"
        },
        queuedActions: {
          loadout: "\u914d\u88c5: {{name}}",
          loadoutUnavailable: "\u914d\u88c5\u5305\u542b\u4e0d\u53ef\u7528\u7269\u54c1",
          loadoutDeleted: "\u914d\u88c5\u5df2\u5220\u9664",
          useItem: "\u4f7f\u7528: {{itemName}}",
          catalystUnavailable: "\u50ac\u5316\u5242: [\u7269\u54c1\u4e0d\u8db3]",
          targetLevel: "\u76ee\u6807\u7b49\u7ea7: +{{level}}",
          protectFromLevel: "\u4fdd\u62a4\u7b49\u7ea7: +{{level}}",
          repeat: "\u91cd\u590d",
          gather: "\u6536\u96c6",
          produce: "\u751f\u4ea7",
          fight: "\u6218\u6597",
          actionCountTimes: "{{action}} {{count}} \u6b21",
          queuedActionsHeader: "\u884c\u52a8\u961f\u5217",
          queuedActionsSlotCount: "\u884c\u52a8\u961f\u5217 ({{current}}/{{max}})",
          upgradeCapacity: "\u5347\u7ea7\u5bb9\u91cf",
          queuedActionsCount: "+{{count}} \u961f\u5217<br />\u4e2d\u7684\u884c\u52a8",
          remove: "\u79fb\u9664",
          moveActionToFrontConfirm: "\u73b0\u5728\u8fd0\u884c\u6b64\u884c\u52a8\u5417\uff1f\u5f53\u524d\u884c\u52a8\u5c06\u6682\u505c\uff0c\u5e76\u5728\u4e4b\u540e\u7ee7\u7eed\u3002"
        },
        navigationBar: {
          myStuff: "\u6211\u7684\u7269\u54c1",
          marketplace: "\u5e02\u573a",
          tasks: "\u4efb\u52a1",
          combat: "\u6218\u6597",
          shop: "\u5546\u5e97",
          cowbellStore: "\u725b\u94c3\u5546\u5e97",
          lootTracker: "\u6389\u843d\u8bb0\u5f55",
          social: "\u793e\u4ea4",
          guild: "\u516c\u4f1a",
          leaderboard: "\u6392\u884c\u699c",
          moderator: "\u7ba1\u7406\u5458",
          settings: "\u8bbe\u7f6e",
          news: "\u65b0\u95fb",
          patchNotes: "\u66f4\u65b0\u65e5\u5fd7",
          gameGuide: "\u6e38\u620f\u6307\u5357",
          gameRules: "\u6e38\u620f\u89c4\u5219",
          wiki: "\u7ef4\u57fa\u767e\u79d1",
          discord: "Discord",
          testServer: "\u6d4b\u8bd5\u670d\u52a1\u5668",
          privacyPolicy: "\u9690\u79c1\u653f\u7b56",
          switchCharacter: "\u5207\u6362\u89d2\u8272",
          logout: "\u9000\u51fa\u767b\u9646",
          myStuffTooltip: "\u5e93\u5b58\u3001\u88c5\u5907\u3001\u80fd\u529b\u3001\u623f\u5c4b\u548c\u914d\u88c5\u3002",
          marketplaceTooltip: "\u73a9\u5bb6\u9a71\u52a8\u7684\u5e02\u573a\uff0c\u4f60\u53ef\u4ee5\u7528\u91d1\u5e01\u4e70\u5356\u7269\u54c1\u3002",
          tasksTooltip: "\u968f\u673a\u751f\u6210\u7684\u4efb\u52a1\uff0c\u5b8c\u6210\u540e\u53ef\u83b7\u5f97\u5956\u52b1\u3002",
          milkingTooltip: "\u54de\u54de\u54de\uff5e\uff5e\uff5e",
          foragingTooltip: "\u6210\u4e3a\u62fe\u8352\u5927\u5e08",
          woodcuttingTooltip: "We are \u4f10\u6728\u7d2f",
          cheesesmithingTooltip: "\u829d\u58eb\u5c31\u662f\u6253\u94c1",
          craftingTooltip: "\u5236\u4f5c\u6b66\u5668\u3001\u73e0\u5b9d\u7b49\u3002",
          tailoringTooltip: "\u5236\u4f5c\u8fdc\u7a0b\u548c\u9b54\u6cd5\u670d\u88c5\u3002",
          cookingTooltip: "\u5236\u4f5c\u5065\u5eb7\u98df\u7269\u7684\u827a\u672f\u3002",
          brewingTooltip: "\u5236\u4f5c\u7f8e\u5473\u996e\u54c1\u7684\u827a\u672f\u3002",
          alchemyTooltip: "\u83dc\u5c31\u591a\u70bc",
          enhancingTooltip: "+5\u9760\u52aa\u529b\uff0c+10\u9760\u8fd0\u6c14\uff0c+15\u662f\u5947\u8ff9\uff0c+20\u662f\u547d\u8fd0",
          combatTooltip: "\u4e0e\u602a\u7269\u6218\u6597\u3002\u4f60\u7684\u6218\u6597\u7b49\u7ea7\u4ee3\u8868\u4e86\u57fa\u4e8e\u5404\u4e2a\u6218\u6597\u6280\u80fd\u7b49\u7ea7\u7ec4\u5408\u7684\u7efc\u5408\u6218\u6597\u6548\u679c\u3002",
          shopTooltip: "\u4ece\u4f9b\u5e94\u5546\u5904\u8d2d\u4e70\u7269\u54c1\u3002",
          cowbellStoreTooltip: "\u8d2d\u4e70\u548c\u4f7f\u7528\u725b\u94c3\u3002",
          lootTrackerTooltip: "\u8bb0\u5f55\u4f60\u6700\u8fd1\u884c\u52a8\u83b7\u5f97\u7684\u7269\u54c1\u3002",
          socialTooltip: "\u670b\u53cb\u3001\u63a8\u8350\u548c\u9ed1\u540d\u5355\u3002",
          guildTooltip: "\u52a0\u5165\u73a9\u5bb6\u793e\u533a\u3002",
          leaderboardTooltip: "\u663e\u793a\u6bcf\u4e2a\u4e13\u4e1a\u7684\u9876\u7ea7\u73a9\u5bb6\u3002",
          moderatorTooltip: "\u5927\u9524\u7528\u6237\u3002",
          settingsTooltip: "\u66f4\u65b0\u5e10\u6237\u4fe1\u606f\u548c\u5176\u4ed6\u8bbe\u7f6e\u3002",
          staminaTooltip: "\u6bcf\u7ea7+10\u751f\u547d\u4e0a\u9650\u3002",
          intelligenceTooltip: "\u6bcf\u7ea7+10\u6cd5\u529b\u4e0a\u9650\u3002",
          attackTooltip: "\u589e\u52a0\u4f60\u7684\u7cbe\u51c6\u5ea6\u3001\u57fa\u7840\u653b\u51fb\u901f\u5ea6\u548c\u65bd\u6cd5\u901f\u5ea6\u3002",
          defenseTooltip: "\u589e\u52a0\u4f60\u7684\u95ea\u907f\u3001\u62a4\u7532\u548c\u5143\u7d20\u6297\u6027\u3002",
          meleeTooltip: "\u589e\u52a0\u4f60\u7684\u8fd1\u6218\u4f24\u5bb3\u3002",
          rangedTooltip: "\u589e\u52a0\u4f60\u7684\u8fdc\u7a0b\u4f24\u5bb3\u3002\u8fdc\u7a0b\u653b\u51fb\u6709\u989d\u5916\u7684\u66b4\u51fb\u51e0\u7387\u3002",
          magicTooltip: "\u589e\u52a0\u4f60\u7684\u9b54\u6cd5\u4f24\u5bb3\u3002",
          activePlayers: "\u6d3b\u8dc3\u89d2\u8272: {{count}}",
          level: "\u7b49\u7ea7: {{count}}",
          totalExperience: "\u603b\u7ecf\u9a8c: {{count}}",
          xpToLevelUp: "\u5347\u7ea7\u6240\u9700\u7ecf\u9a8c: {{count}}"
        },
        marketplacePanel: {
          marketplace: "\u5e02\u573a",
          marketListings: "\u5546\u54c1\u5217\u8868",
          myListings: "\u6211\u7684\u6302\u724c",
          resources: "\u8d44\u6e90",
          consumables: "\u6d88\u8017\u54c1",
          books: "\u6280\u80fd\u4e66",
          keys: "\u94a5\u5319",
          equipment: "\u88c5\u5907",
          accessories: "\u4f69\u9970",
          tools: "\u5de5\u5177",
          mustBeBetween0And20: "\u5fc5\u987b\u57280\u523020\u4e4b\u95f4",
          mustBeAtLeast1: "\u5fc5\u987b\u81f3\u5c11\u4e3a1",
          youDontHaveEnoughItems: "\u4f60\u6ca1\u6709\u8db3\u591f\u7684\u7269\u54c1",
          youCantAffordThisMany: "\u4f60\u4e70\u4e0d\u8d77\u8fd9\u4e48\u591a",
          mustBeAtLeastVendorPrice: "\u5fc5\u987b\u81f3\u5c11\u4e3a\u5546\u4eba\u4ef7\u683c",
          itemFilterPlaceholder: "\u7269\u54c1\u641c\u7d22",
          viewAllItems: "\u67e5\u770b\u6240\u6709\u7269\u54c1",
          viewAllEnhancementLevels: "\u67e5\u770b\u6240\u6709\u5f3a\u5316\u7b49\u7ea7",
          refresh: "\u5237\u65b0",
          sell: "\u51fa\u552e",
          buy: "\u8d2d\u4e70",
          sellNow: "\u7acb\u5373\u51fa\u552e",
          postSellOrder: "\u53d1\u5e03\u51fa\u552e\u8ba2\u5355",
          sellListing: "\u51fa\u552e\u6302\u724c",
          postSellListing: "\u53d1\u5e03\u51fa\u552e\u6302\u724c",
          buyNow: "\u7acb\u5373\u8d2d\u4e70",
          postBuyOrder: "\u53d1\u5e03\u8d2d\u4e70\u8ba2\u5355",
          buyListing: "\u8d2d\u4e70\u6302\u724c",
          postBuyListing: "\u53d1\u5e03\u8d2d\u4e70\u6302\u724c",
          max: "\u6700\u591a",
          all: "\u5168\u90e8",
          enhancementLevel: "\u5f3a\u5316\u7b49\u7ea7",
          quantityYouHave: "\u6570\u91cf (\u4f60\u6709: {{maxQuantity}})",
          quantityYouCanAfford: "\u6570\u91cf (\u4f60\u80fd\u8d1f\u62c5: {{maxQuantity}})",
          quantityAvailableAtPrice: "\u6570\u91cf (\u6b64\u4ef7\u683c\u53ef\u7528: {{marketQuantity}})",
          priceBestSellOffer: "\u4ef7\u683c (\u6700\u4f73\u51fa\u552e\u62a5\u4ef7: <bestPrice />)",
          priceBestBuyOffer: "\u4ef7\u683c (\u6700\u4f73\u8d2d\u4e70\u62a5\u4ef7: <bestPrice />)",
          youGetOrMore: "\u83b7\u5f97: {{totalValue}}<coin /> ({{taxRate}}\u7a0e)<br />(\u66f4\u591a\uff0c\u5982\u679c\u6709\u66f4\u597d\u7684\u62a5\u4ef7)",
          youPayOrLess: "\u652f\u4ed8: {{totalValue}}<coin /><br />(\u66f4\u5c11\uff0c\u5982\u679c\u6709\u66f4\u597d\u7684\u62a5\u4ef7)",
          sellRestricted: "\u51fa\u552e\u53d7\u9650",
          listingLimitReached: "\u5df2\u8fbe\u5230\u6302\u724c\u9650\u5236",
          newSellListing: "+ \u65b0\u51fa\u552e\u6302\u724c",
          newBuyListing: "+ \u65b0\u8d2d\u4e70\u6302\u724c",
          loading: "\u6b63\u5728\u52a0\u8f7d...",
          item: "\u7269\u54c1",
          bestAskPrice: "\u6700\u4f73\u51fa\u552e\u4ef7",
          bestBidPrice: "\u6700\u4f73\u6536\u8d2d\u4ef7",
          viewAll: "\u67e5\u770b\u5168\u90e8",
          nope: "\u6ca1\u6709...",
          quantity: "\u6570\u91cf",
          askPrice: "\u51fa\u552e\u4ef7",
          bidPrice: "\u6536\u8d2d\u4ef7",
          action: "\u64cd\u4f5c",
          upgradeCapacity: "\u5347\u7ea7\u5bb9\u91cf",
          collectAll: "\u5168\u90e8\u6536\u96c6 ({{claimableCount}})",
          status: "\u72b6\u6001",
          type: "\u7c7b\u578b",
          progress: "\u8fdb\u5ea6",
          price: "\u4ef7\u683c",
          taxTaken: "\u7a0e\u6536",
          collect: "\u6536\u96c6",
          chatLink: "\u804a\u5929\u94fe\u63a5",
          link: "\u94fe\u63a5",
          cancel: "\u53d6\u6d88",
          confirmCancelMarketListing: "\u4f60\u786e\u5b9a\u8981\u53d6\u6d88\u6b64\u6302\u724c\u5417\uff1f",
          active: "\u6709\u6548",
          filled: "\u5df2\u5b8c\u6210",
          cancelled: "\u5df2\u53d6\u6d88",
          expired: "\u5df2\u8fc7\u671f",
          listingsCount: "{{currentListings}} / {{listingCap}} \u6302\u724c"
        },
        marketListingLink: {
          buying: "\u8d2d\u4e70",
          selling: "\u51fa\u552e",
          price: "\u4ef7\u683c: <color>{{price}}</color>"
        },
        tasksPanel: {
          tasks: "\u4efb\u52a1",
          taskBoard: "\u4efb\u52a1\u680f",
          taskShop: "\u4efb\u52a1\u5546\u5e97",
          taskCooldownUpgrade: "-1\u5c0f\u65f6\u4efb\u52a1\u51b7\u5374",
          taskCooldownDescription: "\u6c38\u4e45\u51cf\u5c11\u4e00\u5c0f\u65f6\u4efb\u52a1\u7b49\u5f85\u65f6\u95f4\u3002",
          blockSlotUpgrade: "+1\u5c4f\u853d\u69fd\u4f4d",
          blockSlotDescription: "\u589e\u52a0\u4e00\u4e2a\u5c4f\u853d\u69fd\u4f4d\uff0c\u5141\u8bb8\u5c4f\u853d\u4e00\u79cd\u975e\u6218\u6597\u4e13\u4e1a\u7684\u65b0\u4efb\u52a1\u3002",
          combatBlockUpgrade: "\u89e3\u9501\u6218\u6597\u5c4f\u853d",
          combatBlockDescription: "\u5141\u8bb8\u5c4f\u853d\u6218\u6597\u4efb\u52a1\u3002\u4f60\u9700\u8981\u81f3\u5c11\u4e00\u4e2a\u53ef\u7528\u7684\u5c4f\u853d\u69fd\u4f4d\u624d\u80fd\u4f7f\u7528\u6b64\u529f\u80fd\u3002",
          tutorialIncomplete: "\u5b8c\u6210\u4f60\u7684\u6559\u7a0b\u4efb\u52a1\u4ee5\u89e3\u9501\u4efb\u52a1\u680f\u3002<br />\u4f60\u5f53\u524d\u7684\u4efb\u52a1\u53ef\u4ee5\u5728\u9875\u9762\u53f3\u4e0a\u89d2\u627e\u5230\u3002",
          purplesGift: "\u5c0f\u7d2b\u725b\u7684\u793c\u7269: {{unclaimedTaskPoints}} / {{claimCost}} \u4efb\u52a1\u79ef\u5206",
          claim: "\u9886\u53d6",
          unreadTasks: "\u4f60\u6709 {{count}} \u4e2a\u672a\u8bfb\u4efb\u52a1",
          unreadTasks_one: "\u4f60\u6709 {{count}} \u4e2a\u672a\u8bfb\u4efb\u52a1",
          unreadTasks_other: "\u4f60\u6709 {{count}} \u4e2a\u672a\u8bfb\u4efb\u52a1",
          read: "\u8bfb\u53d6",
          taskSlotCount: "{{taskCount}} / {{taskSlotCap}} \u4efb\u52a1",
          upgradeCapacity: "\u5347\u7ea7\u5bb9\u91cf",
          nextTask: "\u4e0b\u4e00\u4e2a\u4efb\u52a1: ",
          waitingForNextTask: "\u751f\u6210\u4e0b\u4e00\u4e2a\u4efb\u52a1\u3002\u8bf7\u7a0d\u7b49...",
          blockedSkills: "\u5c4f\u853d\u4e13\u4e1a",
          buyTaskUpgrade: "\u8d2d\u4e70\u4efb\u52a1\u5347\u7ea7",
          buyTaskShopItem: "\u8d2d\u4e70\u4efb\u52a1\u5546\u5e97\u7269\u54c1",
          quantity: "\u6570\u91cf",
          youPay: "\u652f\u4ed8: {{totalCost}}",
          buy: "\u8d2d\u4e70",
          upgrades: "\u5347\u7ea7",
          items: "\u7269\u54c1",
          lifetimeTaskPoints: "\u7d2f\u8ba1\u4efb\u52a1\u79ef\u5206: {{totalTaskPoints}}",
          minimumQuantity: "\u6700\u5c0f\u6570\u91cf: 1",
          notEnoughItems: "\u4f60\u6ca1\u6709\u8db3\u591f\u7684{{itemName}}"
        },
        taskBlockSlot: {
          remove: "\u79fb\u9664",
          blockSlot: "\u69fd\u4f4d {{slotIndex}}"
        },
        randomTask: {
          back: "\u8fd4\u56de",
          confirmDiscard: "\u786e\u8ba4\u653e\u5f03",
          payCowbells: "\u652f\u4ed8 {{cowbellCost}}",
          payCoins: "\u652f\u4ed8 {{coinCost}}",
          reroll: "\u91cd\u7f6e",
          mooPassFreeReroll: "\u54de\u5361\u514d\u8d39\u91cd\u7f6e",
          go: "\u524d\u5f80",
          claimReward: "\u9886\u53d6\u5956\u52b1",
          progress: "\u8fdb\u5ea6: {{currentCount}} / {{goalCount}}",
          rewards: "\u5956\u52b1: ",
          defeat: "\u51fb\u8d25 - {{monsterName}}"
        },
        tutorialQuest: {
          purple: "\u5c0f\u7d2b\u725b",
          welcomeStartText: "\u6b22\u8fce\u6765\u5230$t(global.gameName)\u2014\u2014\u4e00\u4e2a\u62e5\u6709\u795e\u5947\u5976\u725b\u7684\u4e16\u754c\uff01<br /><br />\u6211\u662f\u5c0f\u7d2b\u725b\uff0c\u9996\u5e2d\u57f9\u8bad\u5b98\uff0c\u4e5f\u662f\u4f60\u7684\u5bfc\u6e38\uff01<br /><br />\u6211\u4f1a\u7528\u6a59\u8272\u7684\u95ea\u5149\u6765\u5f15\u5bfc\u4f60\u5b8c\u6210\u57f9\u8bad\u3002",
          welcomeButtonText: "\u55e8\uff0c\u5c0f\u7d2b\u725b\uff01",
          milkCowStartText: "\u8ba9\u6211\u5148\u5e26\u4f60\u770b\u770b\u6211\u4eec\u795e\u5947\u5976\u725b\u6700\u62ff\u624b\u7684\uff1a\u751f\u4ea7\u795e\u5947\u725b\u5976\uff01\u987a\u4fbf\u8bf4\u4e00\u4e0b\uff0c\u6211\u7684\u8868\u59b9\u6df1\u7d2b\u4e5f\u5728\u8fd9\u91cc\u5de5\u4f5c\u3002\u55e8\uff0c\u6df1\u7d2b\uff01<br /><br />\u9996\u5148\uff0c\u8bd5\u7740\u6536\u96c6\u4e00\u4e9b\u725b\u5976\u3002",
          milkCowCompleteText: "\u5e72\u5f97\u597d\uff01\u8fd9\u91cc\u6709\u4e00\u4e9b\u989d\u5916\u7684\u725b\u5976\u548c\u4e00\u628a\u5237\u5b50\u3002\u5237\u4e00\u5237\u5976\u725b\uff0c\u5b83\u4eec\u4f1a\u66f4\u5feb\u4e50\u66f4\u9ad8\u6548\u7684\u4ea7\u5976\uff01",
          smithCheeseStartText: "\u8ba9\u6211\u4eec\u7528\u725b\u5976\u5236\u4f5c\u4e00\u4e9b\u5976\u916a\uff01\u8fd9\u4e9b\u7279\u6b8a\u7684\u5976\u916a\u975e\u5e38\u8010\u7528\uff0c\u53ef\u4ee5\u901a\u8fc7\u5976\u916a\u953b\u9020\u505a\u6210\u8bb8\u591a\u6709\u7528\u7684\u4e1c\u897f\uff01",
          smithCheeseCompleteText: "\u592a\u597d\u4e86\uff01\u5e26\u4e0a\u4e00\u4e9b\u989d\u5916\u7684\u5976\u916a\u53bb\u5b8c\u6210\u4e0b\u4e00\u4e2a\u4efb\u52a1\u3002",
          smithSwordStartText: "\u5976\u916a\u662f\u5236\u4f5c\u5de5\u5177\u3001\u6b66\u5668\u548c\u76d4\u7532\u7684\u91cd\u8981\u8d44\u6e90\u3002\u8ba9\u6211\u6559\u4f60\u5982\u4f55\u5236\u4f5c\u5976\u916a\u5251\u5427\uff01\u6211\u77e5\u9053\u8fd9\u542c\u8d77\u6765\u53ef\u80fd\u6709\u70b9\u4e0d\u53ef\u601d\u8bae\uff0c\u4f46\u8bf7\u76f8\u4fe1\u6211\u3002",
          smithSwordCompleteText: "\u771f\u68d2\uff01\u968f\u7740\u4f60\u7684\u5347\u7ea7\uff0c\u4f60\u4e5f\u53ef\u4ee5\u4f7f\u7528\u66f4\u5f3a\u7684\u88c5\u5907\uff01\u8fd8\u53ef\u4ee5\u5236\u4f5c\u5de5\u5177\u6765\u63d0\u9ad8\u4f60\u7684\u6280\u827a\u3002",
          forageFarmlandStartText: "\u73b0\u5728\u8ba9\u6211\u4eec\u53bb\u5bfb\u627e\u66f4\u591a\u7684\u8d44\u6e90\u3002\u524d\u5f80\u7fe0\u91ce\u519c\u573a\uff0c\u770b\u770b\u4f60\u80fd\u6536\u96c6\u5230\u4ec0\u4e48\u7269\u54c1\uff01",
          forageFarmlandCompleteText: "\u597d\u5feb\uff01\u91c7\u6458\u4e3a\u4f60\u63d0\u4f9b\u4e86\u8bb8\u591a\u6280\u827a\u6240\u9700\u7684\u8d44\u6e90\uff0c\u5305\u62ec\u70f9\u996a\u3001\u51b2\u6ce1\u548c\u7f1d\u7eab\uff01",
          cookDonutStartText: "\u662f\u65f6\u5019\u5f00\u59cb\u70f9\u996a\u4e86\uff0c\u7528\u4e00\u4e9b\u9e21\u86cb\u3001\u5c0f\u9ea6\u548c\u7cd6\u505a\u4e00\u4e2a\u7f8e\u5473\u7684\u751c\u751c\u5708\u5427\u3002\u4ec0\u4e48\uff1f\u4f60\u4e0d\u4f1a\u505a\u996d\uff1f\u4f60\u53ef\u4ee5\u5b66\u561b\uff01\u6211\u542c\u8bf4\u5730\u7403\u4e0a\u8fd8\u6709\u53ea\u8001\u9f20\u4f1a\u505a\u996d\u5462\uff0c\u5982\u679c\u5b83\u80fd\u505a\u5230\uff0c\u4f60\u80af\u5b9a\u4e5f\u884c\uff01\u8bd5\u8bd5\u770b\uff01",
          cookDonutCompleteText: "\u592a\u68d2\u4e86\uff01\u98df\u7269\u53ef\u4ee5\u5728\u6218\u6597\u4e2d\u6cbb\u6108\u4f60\u3002\u5feb\u62ff\u7740\u8fd9\u4e00\u6253\u514d\u8d39\u7684\u751c\u751c\u5708\uff01",
          fightFlyStartText: "\u73b0\u5728\u6211\u60f3\u5e26\u4f60\u53bb\u6211\u4eec\u7684\u90bb\u8fd1\u661f\u7403\u4e4b\u4e00\u2014\u2014\u81ed\u81ed\u661f\u7403\uff01\u6211\u542c\u8bf4\u90a3\u91cc\u6709\u5f88\u591a\u4f1a\u54ac\u4eba\u7684\u82cd\u8747\uff01\u4f60\u6700\u597d\u5e26\u4e0a\u5251\u548c\u4e00\u4e9b\u751c\u751c\u5708\u3002\u6211\u4eec\u51fa\u53d1\u5427\uff01",
          fightFlyCompleteText: "\u4e0e\u602a\u517d\u6218\u6597\u53ef\u4ee5\u8d5a\u53d6\u91d1\u5e01\u3001\u8d44\u6e90\u3001\u6280\u80fd\u4e66\uff0c\u751a\u81f3\u7a00\u6709\u7269\u54c1\u3002<br /><br />\u5982\u679c\u4f60\u5728\u6218\u6597\u4e2d\u88ab\u51fb\u5012\uff0c\u4f60\u5c06\u5728150\u79d2\u540e\u6062\u590d\u5e76\u7ee7\u7eed\u6218\u6597\u3002",
          messageTipsStartText: "\u770b\u8d77\u6765\u65c5\u884c\u5feb\u7ed3\u675f\u4e86\u3002\u867d\u7136\u8fd8\u6709\u5f88\u591a\u4e1c\u897f\u53ef\u4ee5\u63a2\u7d22\uff0c\u4f46\u522b\u62c5\u5fc3\uff0c\u4f60\u4e0d\u4f1a\u5b64\u5355\uff01\u4e00\u65e6\u4f60\u518d\u5347\u7ea7\u4e00\u70b9\uff0c\u5c31\u53ef\u4ee5\u4e0e\u5176\u4ed6\u73a9\u5bb6\u804a\u5929\u6216\u83b7\u5f97\u5e2e\u52a9\uff01<br /><br />\u4f60\u4e5f\u53ef\u4ee5\u5728\u6211\u4eec\u7684\u73a9\u5bb6\u9a71\u52a8\u7684\u5e02\u573a\u4e2d\u4e70\u5356\u7269\u54c1\uff0c\u9664\u975e\u4f60\u5728\u73a9\u94c1\u725b\u6a21\u5f0f\u3002",
          messageTipsButtonText: "\u597d\u7684",
          messageTips2StartText: "\u5728\u6211\u8d70\u4e4b\u524d\uff0c\u8fd8\u6709\u4e00\u4e9b\u63d0\u793a\uff1a<br />- \u6e38\u620f\u6307\u5357\u53ef\u4ee5\u5728\u5de6\u4fa7\u5bfc\u822a\u83dc\u5355\u7684\u5e95\u90e8\u627e\u5230\u3002<br />- \u5373\u4f7f\u4f60\u5904\u4e8e\u79bb\u7ebf\u72b6\u6001\uff0c\u4f60\u4f9d\u7136\u80fd\u7ee7\u7eed\u83b7\u5f9710\u5c0f\u65f6\u79bb\u7ebf\u8fdb\u7a0b (\u53ef\u5347\u7ea7)\u3002<br />- \u7269\u54c1\u3001\u6280\u80fd\u3001\u4e13\u4e1a\u548c\u654c\u4eba\u53ef\u4ee5\u9f20\u6807\u60ac\u505c\uff08\u5728\u79fb\u52a8\u8bbe\u5907\u4e0a\u957f\u6309\uff09\u4ee5\u67e5\u770b\u66f4\u8be6\u7ec6\u4fe1\u606f\u3002<br /><br />\u597d\u7684\uff0c\u6211\u5f97\u8d70\u4e86\uff0c\u662f\u65f6\u5019\u5403\u6211\u7684\u7b2c\u4e8c\u987f\u5348\u9910\u4e86\uff0c\u6211\u53ef\u6709\u56db\u4e2a\u80c3\u8981\u586b\u9971\u5462\u3002\u5feb\u53bb\u63a2\u7d22\u4e16\u754c\u5427\uff01",
          messageTips2ButtonText: "\u518d\u89c1\uff0c\u5c0f\u7d2b\u725b\uff01"
        },
        questModal: {
          purple: "\u5c0f\u7d2b\u725b",
          task: "\u4efb\u52a1",
          tutorial: "\u6559\u7a0b",
          taskInfo: "\u4efb\u52a1: {{taskName}}",
          progress: "\u8fdb\u5ea6: {{currentCount}} / {{goalCount}}",
          rewardsLabel: "\u5956\u52b1: ",
          defeatMonster: "\u51fb\u8d25 - {{monsterName}}",
          ok: "\u786e\u5b9a",
          accept: "\u63a5\u53d7",
          go: "\u524d\u5f80",
          claimReward: "\u9886\u53d6\u5956\u52b1"
        },
        gatheringProductionSkillPanel: {
          consumables: "\u6d88\u8017\u54c1"
        },
        alchemyPanel: {
          currentAction: "\u5f53\u524d\u884c\u52a8",
          notAlchemizing: "\u6ca1\u6709\u884c\u52a8",
          consumables: "\u6d88\u8017\u54c1"
        },
        enhancingPanel: {
          currentActionTab: "\u5f53\u524d\u884c\u52a8",
          notEnhancing: "\u6ca1\u6709\u884c\u52a8",
          consumables: "\u6d88\u8017\u54c1"
        },
        combatPanel: {
          combatZones: "\u6218\u6597\u533a\u57df",
          findParty: "\u5bfb\u627e\u961f\u4f0d",
          myParty: "\u6211\u7684\u961f\u4f0d",
          battleCount: "\u4ea4\u6218 #{{battleId}}"
        },
        combatZones: {
          consumables: "\u6d88\u8017\u54c1",
          abilities: "\u6280\u80fd"
        },
        findParty: {
          selectZone: "\u9009\u62e9\u533a\u57df",
          refresh: "\u5237\u65b0",
          createParty: "\u521b\u5efa\u961f\u4f0d",
          profile: "\u4e2a\u4eba\u8d44\u6599",
          join: "\u52a0\u5165",
          combatZone: "\u6218\u6597\u533a\u57df",
          difficulty: "\u96be\u5ea6",
          fightTimes: "\u6218\u6597 {{times}} \u6b21",
          partyName: "{{name}}\u7684{{partyType}}",
          privateParty: "\u79c1\u4eba\u961f\u4f0d",
          party: "\u961f\u4f0d",
          levelRequirement: "\u7b49\u7ea7{{minLevel}}-{{maxLevel}}"
        },
        party: {
          noLoadout: "\u65e0\u914d\u88c5",
          selectZone: "\u9009\u62e9\u533a\u57df",
          fightTimesWithInputs: "\u6218\u6597 <inputs /> \u6b21",
          partyName: "{{name}}\u7684{{partyType}}",
          privateParty: "\u79c1\u4eba\u961f\u4f0d",
          publicParty: "\u516c\u5f00\u961f\u4f0d",
          autoKickCheckbox: "\u81ea\u52a8\u8e22\u51fa5\u5206\u949f\u5185\u672a\u5c31\u7eea\u7684\u961f\u5458",
          autoKickEnabled: "\u81ea\u52a8\u8e22\u51fa\u5df2\u542f\u7528",
          autoKickDisabled: "\u81ea\u52a8\u8e22\u51fa\u5df2\u7981\u7528",
          slot: "\u69fd\u4f4d {{number}}",
          role: "\u5b9a\u4f4d",
          minLevel: "\u6700\u4f4e\u7b49\u7ea7",
          maxLevel: "\u6700\u9ad8\u7b49\u7ea7",
          addSlot: "\u6dfb\u52a0\u69fd\u4f4d",
          combatZone: "\u6218\u6597\u533a\u57df",
          difficulty: "\u96be\u5ea6",
          leaveParty: "\u79bb\u5f00\u961f\u4f0d",
          confirmLeaveParty: "\u4f60\u786e\u5b9a\u8981\u79bb\u5f00\u961f\u4f0d\u5417\uff1f",
          disbandParty: "\u89e3\u6563\u961f\u4f0d",
          confirmDisbandParty: "\u4f60\u786e\u5b9a\u8981\u89e3\u6563\u961f\u4f0d\u5417\uff1f",
          editParty: "\u4fee\u6539\u961f\u4f0d",
          cancel: "\u53d6\u6d88",
          createParty: "\u521b\u5efa\u961f\u4f0d",
          save: "\u4fdd\u5b58",
          linkToChat: "\u94fe\u63a5\u5230\u804a\u5929\u9891\u9053",
          consumables: "\u6d88\u8017\u54c1",
          abilities: "\u6280\u80fd",
          profile: "\u4e2a\u4eba\u8d44\u6599",
          giveLeadership: "\u7ed9\u4e88\u9886\u5bfc\u6743",
          kick: "\u8e22\u51fa",
          ready: "\u51c6\u5907\u5c31\u7eea",
          unready: "\u672a\u5c31\u7eea"
        },
        partyRoles: {
          any_role: "\u4efb\u4f55\u5b9a\u4f4d",
          damage_dealer: "\u4f24\u5bb3\u8f93\u51fa",
          support: "\u8f85\u52a9",
          tank: "\u5766\u514b"
        },
        partyLink: {
          linkText: "\u961f\u4f0d: $t(actionNames.{{actionHrid}})"
        },
        battlePanel: {
          stats: "\u5c5e\u6027",
          battleInfo: "\u4ea4\u6218\u4fe1\u606f",
          confirmRunAway: "\u4f60\u786e\u5b9a\u8981\u9003\u79bb\u6218\u6597\u5417\uff1f",
          combatDuration: "\u6218\u6597\u65f6\u95f4: {{duration}}",
          battles: "\u4ea4\u6218: {{battleId}}",
          deaths: "\u6218\u8d25: {{deathCount}}",
          itemsLooted: "\u6218\u5229\u54c1: ",
          experienceGained: "\u83b7\u5f97\u7ecf\u9a8c: ",
          waveLabel: "\u6ce2\u6b21 {{currentWave}} / {{maxWaves}}",
          battleNumber: "\u4ea4\u6218 #{{battleId}}",
          consumables: "\u6d88\u8017\u54c1",
          abilities: "\u6280\u80fd",
          flee: "\u9003\u8dd1"
        },
        combatUnit: {
          respawn: "\u590d\u6d3b",
          autoAttack: "\u81ea\u52a8\u653b\u51fb",
          stunned: "\u7729\u6655",
          blindedSilenced: "\u5931\u660e/\u6c89\u9ed8",
          blinded: "\u5931\u660e",
          silenced: "\u6c89\u9ed8"
        },
        combatMonsterTooltip: {
          combatLevel: "\u6218\u6597\u7b49\u7ea7: {{level}}",
          experience: "\u7ecf\u9a8c: {{experience}}",
          drops: "\u6389\u843d:",
          rareDrops: "\u7a00\u6709\u6389\u843d:"
        },
        skillActionDetail: {
          levelRequirement: "Lv.{{level}}{{bonus}}",
          requires: "\u9700\u8981",
          upgradesFrom: "\u5347\u7ea7\u81ea",
          upgradeItemWarning: "\u6ca1\u6709\u9009\u62e9\u5347\u7ea7\u7269\u54c1",
          enhancementTransferAll: "\u8f6c\u79fb\u6240\u6709\u5f3a\u5316\u7b49\u7ea7\u3002",
          enhancementTransfer: "\u8f6c\u79fb70%\u7684\u5f3a\u5316\u7b49\u7ea7\u3002<br />\u5c0f\u6570\u6709\u673a\u4f1a\u591a\u52a01\u7ea7\u3002",
          costs: "\u8d39\u7528",
          outputs: "\u4ea7\u51fa",
          essenceDrops: "\u7cbe\u534e",
          rareDrops: "\u7a00\u6709",
          experience: "\u7ecf\u9a8c",
          duration: "\u6301\u7eed\u65f6\u95f4",
          successRate: "\u6210\u529f\u7387",
          travel: "\u65c5\u884c\u65f6\u95f4",
          bonuses: "\u52a0\u6210",
          alchemizeItem: "\u70bc\u91d1\u7269\u54c1",
          selectAlchemyItem: "\u9009\u62e9\u8981\u70bc\u91d1\u7684\u7269\u54c1",
          coinifyInfo: "<span>\u70b9\u91d1:</span> \u5c06\u7269\u54c1\u8f6c\u6362\u4e3a\u91d1\u5e01\u3002",
          decomposeInfo: "<span>\u5206\u89e3:</span> \u5c06\u7269\u54c1\u8f6c\u6362\u4e3a\u539f\u6750\u6599\u6216\u7cbe\u534e\u3002",
          transmuteInfo: "<span>\u8f6c\u5316:</span> \u5c06\u7269\u54c1\u8f6c\u6362\u4e3a\u968f\u673a\u76f8\u5173\u7269\u54c1\u3002",
          invalidCoinifyItem: "\u6b64\u7269\u54c1\u65e0\u6cd5\u88ab\u70b9\u91d1",
          invalidDecomposeItem: "\u6b64\u7269\u54c1\u65e0\u6cd5\u88ab\u5206\u89e3",
          invalidTransmuteItem: "\u6b64\u7269\u54c1\u65e0\u6cd5\u88ab\u8f6c\u5316",
          recommendedLevel: "\u63a8\u8350\u7b49\u7ea7 {{level}} <Icon />",
          bulkMultiplier: "\u6bcf\u6b21\u4f7f\u7528 {{multiplier}} \u4e2a\u7269\u54c1",
          catalyst: "\u50ac\u5316\u5242",
          consumedItem: "\u6d88\u8017\u7269\u54c1",
          notUsed: "\u4e0d\u4f7f\u7528",
          enhanceItem: "\u5f3a\u5316\u88c5\u5907",
          selectEnhancingItem: "\u9009\u62e9\u8981\u5f3a\u5316\u7684\u88c5\u5907",
          successInfo: "<span>\u6210\u529f</span>\u5c06\u4f7f\u7269\u54c1\u7684\u5f3a\u5316\u7b49\u7ea7\u589e\u52a01\u3002",
          failureInfo: "<span>\u5931\u8d25</span>\u9664\u975e\u4f7f\u7528\u4fdd\u62a4\u9053\u5177\uff0c\u5c06\u91cd\u7f6e\u5f3a\u5316\u7b49\u7ea7\u4e3a0\u3002",
          targetLevel: "\u76ee\u6807\u7b49\u7ea7",
          protection: "\u4fdd\u62a4",
          protectFromLevel: "\u4fdd\u62a4\u8d77\u59cb\u7b49\u7ea7",
          protectionMinLevelWarning: "\u5fc5\u987b\u22652\u624d\u6709\u6548",
          entryKey: "\u5165\u53e3\u94a5\u5319",
          reward: "\u5956\u52b1",
          bosses: "BOSS",
          bossFight: "BOSS<br />\u6bcf{{battlesPerBoss}}\u573a<br/>\u4ea4\u6218\u51fa\u73b0",
          monsters: "\u602a\u7269",
          difficulty: "\u96be\u5ea6",
          repeat: "\u91cd\u590d",
          gather: "\u91c7\u96c6",
          produce: "\u751f\u4ea7",
          fight: "\u6218\u6597",
          loadout: "\u914d\u88c5",
          noLoadout: "\u65e0\u914d\u88c5",
          confirmStartNow: "\u4f60\u786e\u5b9a\u8981\u66ff\u6362\u4f60\u7684\u884c\u52a8\u961f\u5217\u5417\uff1f",
          buttons: {
            start: "\u5f00\u59cb",
            startNow: "\u7acb\u5373\u5f00\u59cb",
            stop: "\u505c\u6b62",
            upgradeQueue: "\u5347\u7ea7\u884c\u52a8\u961f\u5217",
            addToQueue: "\u6dfb\u52a0\u5230\u961f\u5217 #{{count}}",
            findParty: "\u5bfb\u627e\u961f\u4f0d"
          }
        },
        shopPanel: {
          minQuantity: "\u6700\u5c0f\u6570\u91cf: 1",
          cannotAfford: "\u65e0\u6cd5\u652f\u4ed8",
          itemFilterPlaceholder: "\u7269\u54c1\u7b5b\u9009",
          youPay: "\u652f\u4ed8: {{count}} {{itemName}}",
          buyItem: "\u8d2d\u4e70\u7269\u54c1",
          quantity: "\u6570\u91cf",
          buy: "\u8d2d\u4e70",
          shop: "\u5546\u5e97"
        },
        cowbellStorePanel: {
          buyCowbells: "\u8d2d\u4e70\u725b\u94c3",
          mooPass: "\u54de\u5361",
          upgrades: "\u4fbf\u5229\u5347\u7ea7",
          chatIcons: "\u804a\u5929\u56fe\u6807",
          customChatIcon: "\u5b9a\u5236\u804a\u5929\u56fe\u6807",
          nameColors: "\u540d\u79f0\u989c\u8272",
          customNameColor: "\u5b9a\u5236\u540d\u79f0\u989c\u8272",
          avatars: "\u89d2\u8272\u5f62\u8c61",
          customAvatar: "\u5b9a\u5236\u89d2\u8272\u5f62\u8c61",
          avatarOutfits: "\u89d2\u8272\u670d\u88c5",
          customAvatarOutfit: "\u5b9a\u5236\u89d2\u8272\u670d\u88c5",
          communityBuffs: "\u793e\u533a\u589e\u76ca",
          nameChange: "\u66f4\u6539\u540d\u79f0",
          optIn: "\u52a0\u5165",
          optOut: "\u9000\u51fa",
          price: "\u4ef7\u683c: {{price}}",
          supporterPoints: "{{points}} \u652f\u6301\u8005\u79ef\u5206",
          minimumQuantity: "\u6700\u5c0f\u6570\u91cf: 1",
          notEnoughItems: "\u4f60\u6ca1\u6709\u8db3\u591f\u7684 {{itemName}}",
          minimumDuration: "\u6700\u77ed\u6301\u7eed\u65f6\u95f4: 10\u5206\u949f",
          notEnoughCowbells: "\u4f60\u6ca1\u6709\u8db3\u591f\u7684\u725b\u94c3",
          mustBeCharacters: "\u5fc5\u987b\u662f2-16\u4e2a\u5b57\u7b26",
          onlyAlphabetsNumbers: "\u53ea\u5141\u8bb8\u5b57\u6bcd\u548c\u6570\u5b57",
          notAvailable: "\u4e0d\u53ef\u7528",
          serverUnreachable: "\u670d\u52a1\u5668\u65e0\u6cd5\u8bbf\u95ee\u6216\u79bb\u7ebf",
          unexpectedError: "\u610f\u5916\u9519\u8bef",
          confirmChangeName: "\u786e\u8ba4\u66f4\u6539\u540d\u79f0\u4e3a: {{name}}",
          purchaseSuccessful: "\u8d2d\u4e70\u6210\u529f",
          thankYouSupport: "\u611f\u8c22\u4f60\u7684\u652f\u6301! \u8d2d\u4e70\u7684\u725b\u94c3\u6216\u54de\u5361\u5e94\u8be5\u4f1a\u5728\u6e38\u620f\u4e2d\u6388\u4e88\u4f60\u3002",
          purchaseNotice: "\u8d2d\u4e70\u901a\u77e5",
          purchaseAntiFraudMessage: "\u6e38\u620f\u5b89\u5168\u8981\u6c42\uff1a\u9996\u6b21\u8d2d\u4e70\u5c06\u89e6\u53d172\u5c0f\u65f6\u7981\u6b62\u51fa\u552e\u725b\u94c3\u888b\u7684\u5e02\u573a\u9650\u5236\uff0c\u81ea\u884c\u4f7f\u7528\u6ca1\u6709\u9650\u5236\u3002",
          waitForSteamOverlay: "\u7b49\u5f85Steam\u53e0\u52a0\u9875\u9762",
          steamOverlayMessage: "Steam\u53e0\u52a0\u9875\u9762\u5c06\u81ea\u52a8\u5f39\u51fa\uff0c\u4ee5\u7ee7\u7eed\u4f60\u7684\u8d2d\u4e70\u3002\u8fd9\u901a\u5e38\u9700\u8981\u51e0\u79d2\u949f\uff0c\u4f46\u5076\u5c14\u4e5f\u4f1a\u9700\u8981\u66f4\u957f\u65f6\u95f4\u3002\u4e4b\u540e\u4f60\u53ef\u4ee5\u5173\u95ed\u6b64\u6d88\u606f\u3002",
          continueToPurchase: "\u7ee7\u7eed\u8d2d\u4e70",
          continuePayment: "\u70b9\u51fb\u7ee7\u7eed\uff0c\u5728\u65b0\u7a97\u53e3\u4e2d\u6253\u5f00\u6211\u4eec\u7684\u652f\u4ed8\u5904\u7406\u5668\u3002",
          guestWarning: "\u6ce8\u610f: \u8fd9\u662f\u4e00\u4e2a\u8bbf\u5ba2\u8d26\u6237\u3002\u5efa\u8bae\u5728\u8bbe\u7f6e->\u8d26\u6237\u4e2d\u6ce8\u518c\u4ee5\u907f\u514d\u610f\u5916\u4e22\u5931\u8bbf\u95ee\u6743\u9650",
          continue: "\u7ee7\u7eed",
          mooPassPerks: "\u54de\u5361\u798f\u5229",
          buyConvenienceUpgrade: "\u8d2d\u4e70\u4fbf\u5229\u5347\u7ea7",
          quantity: "\u6570\u91cf",
          limit: "(\u9650\u5236: {{limit}})",
          buyLimit: "\u8d2d\u4e70\u9650\u5236: {{limit}}",
          afterPurchaseHoursofflineProgress: "\u8d2d\u4e70\u540e: {{limit}} \u5c0f\u65f6\u79bb\u7ebf\u8fdb\u5ea6",
          afterPurchaseMarketListings: "\u8d2d\u4e70\u540e: {{limit}} \u5e02\u573a\u6302\u724c",
          afterPurchaseActionQueues: "\u8d2d\u4e70\u540e: {{limit}} \u884c\u52a8\u961f\u5217",
          afterPurchaseLoadoutSlots: "\u8d2d\u4e70\u540e: {{limit}} \u914d\u88c5\u69fd\u4f4d",
          afterPurchaseTaskSlots: "\u8d2d\u4e70\u540e: {{limit}} \u4efb\u52a1\u69fd\u4f4d",
          buyChatIcon: "\u8d2d\u4e70\u804a\u5929\u56fe\u6807",
          buyNameColor: "\u8d2d\u4e70\u540d\u79f0\u989c\u8272",
          buyAvatar: "\u8d2d\u4e70\u89d2\u8272\u5f62\u8c61",
          buyAvatarOutfit: "\u8d2d\u4e70\u89d2\u8272\u670d\u88c5",
          preview: "\u9884\u89c8",
          unlock: "\u89e3\u9501",
          buyCommunityBuff: "\u8d2d\u4e70\u793e\u533a\u589e\u76ca",
          minute: "\u5206\u949f",
          minutesToAdd: "\u6dfb\u52a0\u5206\u949f\u6570",
          youPay: "\u652f\u4ed8: {{cost}}",
          buy: "\u8d2d\u4e70",
          cowbellStore: "\u725b\u94c3\u5546\u5e97",
          supporterPointsLabel: "\u652f\u6301\u8005\u79ef\u5206: {{points}}",
          famePointsLabel: "\u540d\u8a89\u79ef\u5206: {{points}}",
          buyCowbellsInfo: "\u4f60\u53ef\u4ee5\u8d2d\u4e70\u725b\u94c3\u6765\u652f\u6301\u6e38\u620f\u3002\u725b\u94c3\u53ef\u7528\u4e8e\u8d2d\u4e70\u4fbf\u5229\u5347\u7ea7\u3001\u804a\u5929\u56fe\u6807\u3001\u540d\u79f0\u989c\u8272\u3001\u89d2\u8272\u5f62\u8c61\u3001\u89d2\u8272\u670d\u88c5\u3001\u793e\u533a\u589e\u76ca\uff0c\u6216\u8005\u66f4\u6539\u4f60\u7684\u540d\u79f0\u3002",
          testServerFreeCowbellsSteam: "\u6d4b\u8bd5\u670d\u52a1\u5668: \u4f60\u53ef\u4ee5\u514d\u8d39\u83b7\u5f97\u725b\u94c3\u3002\u8fd9\u4f7f\u7528Steam\u7684\u6c99\u76d2\u652f\u4ed8\u6a21\u5f0f\uff0c\u4e0d\u4f1a\u5b9e\u9645\u6263\u6b3e\u3002",
          testServerFreeCowbellsStripe: "\u6d4b\u8bd5\u670d\u52a1\u5668: \u4f60\u53ef\u4ee5\u514d\u8d39\u83b7\u5f97\u725b\u94c3\uff0c\u8f93\u51654242-4242-4242-4242\u4f5c\u4e3a\u4fe1\u7528\u5361\uff0c\u5176\u5b83\u5b57\u6bb5\u968f\u610f\u8f93\u5165\u3002",
          buyCowbellsNote: "\u6ce8\u610f: \u8d2d\u4e70\u7684\u725b\u94c3\u5c06\u4f5c\u4e3a\u725b\u94c3\u888b (\u6bcf\u888b10\u4e2a) \u51fa\u73b0\u5728\u4f60\u7684[\u5e93\u5b58]\u4e2d\uff0c\u53ef\u4ee5\u5728\u5e02\u573a\u4e0a\u51fa\u552e\u7ed9\u5176\u4ed6\u73a9\u5bb6 ({{cowbellTaxRate}}\u91d1\u5e01\u7a0e)\u3002\u4e00\u65e6\u6253\u5f00\u5c31\u4e0d\u53ef\u51fa\u552e\u3002",
          selectCurrency: "\u9009\u62e9\u8d27\u5e01",
          mooPassInfo: "\u54de\u5361\u63d0\u4f9b\u591a\u79cd\u5b9e\u7528\u4f46\u4e0d\u5f71\u54cd\u4e3b\u8981\u4f53\u9a8c\u7684<PerksLink>\u798f\u5229</PerksLink>\u3002",
          characterMooPass: "\u89d2\u8272\u54de\u5361",
          accountMooPass: "\u8d26\u6237\u54de\u5361",
          increaseOfflineProgressLimit: "\u589e\u52a0\u79bb\u7ebf\u8fdb\u5ea6\u4e0a\u9650",
          increaseMarketListingLimit: "\u589e\u52a0\u5e02\u573a\u6302\u724c\u4e0a\u9650",
          increaseActionQueueLimit: "\u589e\u52a0\u884c\u52a8\u961f\u5217\u4e0a\u9650",
          increaseLoadoutSlotLimit: "\u589e\u52a0\u914d\u88c5\u69fd\u4f4d\u4e0a\u9650",
          increaseTaskSlotLimit: "\u589e\u52a0\u4efb\u52a1\u69fd\u4f4d\u4e0a\u9650",
          freeMooPass: "14\u5929\u54de\u5361\u8d60\u9001",
          free: "\u514d\u8d39",
          confirmClaimFreeMooPass: "\u6fc0\u6d3b14\u5929\u514d\u8d39\u54de\u5361? \u8fd9\u662f\u4e00\u6b21\u6027\u8d60\u9001\u3002\u5982\u679c\u54de\u5361\u5df2\u7ecf\u6fc0\u6d3b\uff0c\u5c06\u5ef6\u957f14\u5929\u3002",
          mooPassWithCowbells: "7\u5929\u54de\u5361",
          buyMooPass: "\u8d2d\u4e70\u54de\u5361",
          totalMooPassDays: "\u83b7\u5f97: {{days}}\u5929\u54de\u5361",
          upgradeLimitsInfo: "\u5347\u7ea7\u4f1a\u6c38\u4e45\u589e\u52a0\u4e0a\u9650\u3002\u4f60\u5f53\u524d\u7684\u4e0a\u9650\u53ef\u4ee5\u5728[\u8bbe\u7f6e]\u4e2d\u67e5\u770b\u3002",
          seasonal: "\u8282\u65e5\u9650\u5b9a",
          unlocked: "\u5df2\u89e3\u9501",
          chatIconsInfo: "\u804a\u5929\u56fe\u6807\u663e\u793a\u5728\u4f60\u540d\u79f0\u524d\u9762\u3002\u89e3\u9501\u7684\u804a\u5929\u56fe\u6807\u53ef\u4ee5\u5728[\u8bbe\u7f6e]->[\u4e2a\u4eba\u8d44\u6599]\u4e2d\u66f4\u6539\u3002",
          customChatIconInfo: "\u4f60\u53ef\u4ee5\u82b1\u8d39 {{supporterPoints}} \u652f\u6301\u8005\u79ef\u5206\u548c {{cowbellCost}} \u725b\u94c3\u6765\u5b9a\u5236\u4e00\u4e2a\u804a\u5929\u56fe\u6807\u3002\u8bf7\u901a\u8fc7 Discord \u7684 #new-ticket \u9891\u9053\u63d0\u4ea4\u7533\u8bf7\u3002\u56fe\u6807\u5c06\u6839\u636e\u4f60\u63d0\u4f9b\u7684\u6982\u5ff5\u6216\u56fe\u7247\uff0c\u7531\u6211\u4eec\u7684\u8bbe\u8ba1\u5e08\u5236\u4f5c\uff0c\u786e\u4fdd\u7b26\u5408\u6e38\u620f\u7684\u98ce\u683c\u548c\u914d\u8272\u4e3b\u9898\u3002\u56fe\u6807\u4e0d\u5f97\u5305\u542b\u4efb\u4f55\u53d7\u7248\u6743\u4fdd\u62a4\u7684\u5185\u5bb9\u3002\u6388\u4e88\u56fe\u6807\u65f6\uff0c\u5c06\u4ece\u4f60\u9009\u62e9\u7684\u89d2\u8272\u4e2d\u6263\u9664\u652f\u6301\u8005\u70b9\u6570\u548c\u725b\u94c3\u8d39\u7528\u3002",
          nameColorsInfo: "\u70b9\u51fb\u4efb\u610f\u989c\u8272\u67e5\u770b\u9884\u89c8\u3002\u89e3\u9501\u7684\u989c\u8272\u53ef\u4ee5\u5728[\u8bbe\u7f6e]->[\u4e2a\u4eba\u8d44\u6599]\u4e2d\u66f4\u6539\u3002",
          customNameColorInfo: "\u4f60\u53ef\u4ee5\u82b1\u8d39 {{supporterPoints}} \u652f\u6301\u8005\u79ef\u5206\u548c {{cowbellCost}} \u725b\u94c3\u6765\u5b9a\u5236\u4e00\u4e2a\u540d\u79f0\u989c\u8272\u3002\u8bf7\u901a\u8fc7 Discord \u7684 #new-ticket \u9891\u9053\u63d0\u4ea4\u7533\u8bf7\u3002\u540d\u79f0\u989c\u8272\u53ef\u4ee5\u662f\u6e10\u53d8\u8272\uff0c\u5e76\u53ef\u9009\u62e9\u6dfb\u52a0\u5fae\u5f31\u7684\u53d1\u5149\u6548\u679c\u3002\u6388\u4e88\u540d\u79f0\u989c\u8272\u65f6\uff0c\u5c06\u4ece\u4f60\u9009\u62e9\u7684\u89d2\u8272\u4e2d\u6263\u9664\u652f\u6301\u8005\u70b9\u6570\u548c\u725b\u94c3\u8d39\u7528\u3002",
          avatarsInfo: "\u70b9\u51fb\u4efb\u610f\u89d2\u8272\u5f62\u8c61\u67e5\u770b\u9884\u89c8\u3002\u89e3\u9501\u7684\u89d2\u8272\u5f62\u8c61\u53ef\u4ee5\u5728[\u8bbe\u7f6e]->[\u4e2a\u4eba\u8d44\u6599]\u4e2d\u66f4\u6539\u3002",
          customAvatarInfo: "\u4f60\u53ef\u4ee5\u82b1\u8d39 {{supporterPoints}} \u652f\u6301\u8005\u79ef\u5206\u548c {{cowbellCost}} \u725b\u94c3\u6765\u5b9a\u5236\u4e00\u4e2a\u89d2\u8272\u5f62\u8c61\u3002\u8bf7\u901a\u8fc7 Discord \u7684 #new-ticket \u9891\u9053\u63d0\u4ea4\u7533\u8bf7\u3002\u89d2\u8272\u5f62\u8c61\u5c06\u6839\u636e\u4f60\u63d0\u4f9b\u7684\u6982\u5ff5\u6216\u56fe\u7247\uff0c\u7531\u6211\u4eec\u7684\u8bbe\u8ba1\u5e08\u5236\u4f5c\uff0c\u786e\u4fdd\u7b26\u5408\u6e38\u620f\u7684\u98ce\u683c\u548c\u914d\u8272\u4e3b\u9898\u3002\u89d2\u8272\u5f62\u8c61\u4e0d\u5f97\u5305\u542b\u4efb\u4f55\u53d7\u7248\u6743\u4fdd\u62a4\u7684\u5185\u5bb9\u3002\u6388\u4e88\u89d2\u8272\u5f62\u8c61\u65f6\uff0c\u5c06\u4ece\u4f60\u9009\u62e9\u7684\u89d2\u8272\u4e2d\u6263\u9664\u652f\u6301\u8005\u70b9\u6570\u548c\u725b\u94c3\u8d39\u7528\u3002",
          avatarOutfitsInfo: "\u70b9\u51fb\u4efb\u610f\u89d2\u8272\u670d\u88c5\u67e5\u770b\u9884\u89c8\u3002\u89e3\u9501\u7684\u89d2\u8272\u670d\u88c5\u53ef\u4ee5\u5728[\u8bbe\u7f6e]->[\u4e2a\u4eba\u8d44\u6599]\u4e2d\u66f4\u6539\u3002",
          customAvatarOutfitInfo: "\u4f60\u53ef\u4ee5\u82b1\u8d39 {{supporterPoints}} \u652f\u6301\u8005\u79ef\u5206\u548c {{cowbellCost}} \u725b\u94c3\u6765\u5b9a\u5236\u4e00\u4e2a\u89d2\u8272\u670d\u88c5\u3002\u8bf7\u901a\u8fc7 Discord \u7684 #new-ticket \u9891\u9053\u63d0\u4ea4\u7533\u8bf7\u3002\u89d2\u8272\u670d\u88c5\u5c06\u6839\u636e\u4f60\u63d0\u4f9b\u7684\u6982\u5ff5\u6216\u56fe\u7247\uff0c\u7531\u6211\u4eec\u7684\u8bbe\u8ba1\u5e08\u5236\u4f5c\uff0c\u786e\u4fdd\u7b26\u5408\u6e38\u620f\u7684\u98ce\u683c\u548c\u914d\u8272\u4e3b\u9898\u3002\u89d2\u8272\u670d\u88c5\u4e0d\u5f97\u5305\u542b\u4efb\u4f55\u53d7\u7248\u6743\u4fdd\u62a4\u7684\u5185\u5bb9\u3002\u6388\u4e88\u89d2\u8272\u670d\u88c5\u65f6\uff0c\u5c06\u4ece\u4f60\u9009\u62e9\u7684\u89d2\u8272\u4e2d\u6263\u9664\u652f\u6301\u8005\u70b9\u6570\u548c\u725b\u94c3\u8d39\u7528\u3002",
          communityBuffsInfo: "\u793e\u533a\u589e\u76ca\u4f7f\u670d\u52a1\u5668\u4e0a\u6240\u6709\u73a9\u5bb6\u90fd\u53d7\u76ca\u3002\u6bcf\u82b1\u8d39\u4e00\u4e2a\u725b\u94c3\u5728\u793e\u533a\u589e\u76ca\u4e0a\uff0c\u4f60\u5c06\u83b7\u5f971\u4e2a\u540d\u8a89\u79ef\u5206\u3002\u540d\u8a89\u79ef\u5206\u5728\u6392\u884c\u699c\u4e0a\u6392\u540d\u3002",
          fameLeaderboard: "\u540d\u8a89\u6392\u884c\u699c",
          currentName: "\u5f53\u524d\u540d\u79f0",
          newName: "\u65b0\u540d\u79f0",
          checkAvailability: "\u68c0\u67e5\u53ef\u7528\u6027",
          available: "\u53ef\u7528",
          cost: "\u8d39\u7528",
          changeName: "\u66f4\u6539\u540d\u79f0"
        },
        paymentSuccessPage: {
          paymentSuccess: "\u652f\u4ed8\u6210\u529f",
          thankYouMessage: "\u611f\u8c22\u4f60\u7684\u652f\u6301\uff01\u8d2d\u4e70\u7684\u725b\u94c3\u5c06\u57281\u5206\u949f\u5185\u51fa\u73b0\u5728\u4f60\u7684\u5e93\u5b58\u4e2d\u3002\u4f60\u53ef\u4ee5\u5173\u95ed\u6b64\u9875\u5e76\u8fd4\u56de\u6e38\u620f\u3002"
        },
        paymentCancelPage: {
          paymentCancelled: "\u652f\u4ed8\u5df2\u53d6\u6d88",
          closeTabMessage: "\u4f60\u53ef\u4ee5\u5173\u95ed\u6b64\u9875\u5e76\u8fd4\u56de\u6e38\u620f\u3002"
        },
        lootLogPanel: {
          lootTracker: "\u6389\u843d\u8bb0\u5f55",
          refresh: "\u5237\u65b0",
          startTime: "\u5f00\u59cb\u65f6\u95f4",
          duration: "\u6301\u7eed\u65f6\u95f4"
        },
        socialPanel: {
          friends: "\u670b\u53cb",
          referrals: "\u63a8\u8350",
          blockList: "\u9ed1\u540d\u5355",
          whisper: "\u79c1\u804a",
          profile: "\u8d44\u6599",
          confirmUnfriend: "\u786e\u8ba4\u53d6\u6d88\u597d\u53cb",
          unfriend: "\u53d6\u6d88\u597d\u53cb",
          activity: "\u6d3b\u52a8",
          status: "\u72b6\u6001",
          daysAgo: "{{days}}\u524d",
          online: "\u5728\u7ebf",
          hidden: "\u9690\u85cf",
          offline: "\u79bb\u7ebf",
          playerNamePlaceholder: "\u73a9\u5bb6\u540d\u79f0",
          addFriend: "\u6dfb\u52a0\u597d\u53cb",
          blockedPlayers: "\u5df2\u5c4f\u853d\u73a9\u5bb6",
          blockPlayer: "\u5c4f\u853d\u73a9\u5bb6",
          unblock: "\u53d6\u6d88\u5c4f\u853d",
          referralBonusFirstLevel: "\u63a8\u8350\u7684\u73a9\u5bb6\u8fbe\u5230\u4e86\u603b\u7b49\u7ea7 {{level}}",
          referralBonusPurchase: "\u63a8\u8350\u7684\u73a9\u5bb6\u8d2d\u4e70\u4e86\u725b\u94c3",
          reward: "\u5956\u52b1: {{quantity}}",
          claim: "\u9886\u53d6",
          referralInstructions: "\u5f53\u6709\u4eba\u4f7f\u7528\u4f60\u7684\u63a8\u8350\u94fe\u63a5\u6ce8\u518c\u65f6\uff0c\u4f60\u5c06\u6709\u8d44\u683c\u83b7\u5f97\u4ee5\u4e0b\u5956\u52b1:",
          referralInstructionBullets: "<ul><li>\u83b7\u5f97 {{firstLevelCowbells}}<cowbellIcon />\u5982\u679c\u63a8\u8350\u7684\u73a9\u5bb6\u8fbe\u5230\u603b\u7b49\u7ea7 {{firstTotalLevel}}\u3002</li><li>\u989d\u5916\u83b7\u5f97 {{secondLevelCowbells}}<cowbellIcon />\u5982\u679c\u73a9\u5bb6\u8fbe\u5230\u603b\u7b49\u7ea7 {{secondTotalLevel}}\u3002</li><li>\u73a9\u5bb6\u8d2d\u4e70\u7684\u4efb\u4f55\u725b\u94c3\u7684 {{purchaseCowbellPercent}}\u3002</li></ul>",
          referralLinkCopied: "\u94fe\u63a5\u5df2\u590d\u5236",
          copyLink: "\u590d\u5236\u94fe\u63a5",
          referralCount: "\u5230\u76ee\u524d\u4e3a\u6b62\uff0c\u5df2\u6709 <span>{{count}}</span> \u540d\u73a9\u5bb6\u901a\u8fc7\u4f60\u7684\u63a8\u8350\u94fe\u63a5\u6ce8\u518c",
          socialTitle: "\u793e\u4ea4"
        },
        guildPanel: {
          overview: "\u6982\u89c8",
          members: "\u6210\u5458",
          manage: "\u7ba1\u7406",
          nameLengthError: "\u540d\u79f0\u5fc5\u987b\u4e3a{{minLength}}-{{maxLength}}\u4e2a\u5b57\u7b26",
          nameContentError: "\u540d\u79f0\u53ea\u80fd\u5305\u542b\u5b57\u6bcd\u3001\u6570\u5b57\u548c\u5355\u4e2a\u7a7a\u683c",
          confirmDisband: "\u4f60\u786e\u5b9a\u8981\u89e3\u6563\u516c\u4f1a\u5417\uff1f",
          confirmLeave: "\u4f60\u786e\u5b9a\u8981\u79bb\u5f00\u516c\u4f1a\u5417\uff1f",
          guildInvitation: "\u516c\u4f1a\u9080\u8bf7:",
          invitedBy: "\u9080\u8bf7\u8005:",
          decline: "\u62d2\u7edd",
          join: "\u52a0\u5165",
          createGuildInstructions: "\u4f60\u53ef\u4ee5\u82b1\u8d395M\u91d1\u5e01\u521b\u5efa\u4e00\u4e2a\u516c\u4f1a\u3002\u516c\u4f1a\u76ee\u524d\u63d0\u4f9b\u4ee5\u4e0b\u529f\u80fd:",
          createGuildInfoBullets: "<ul><li>\u516c\u4f1a\u804a\u5929\u9891\u9053\u548c\u516c\u544a\u677f\u3002</li><li>\u5f53\u6210\u5458\u5728\u4efb\u4f55\u4e13\u4e1a\u83b7\u5f97\u7ecf\u9a8c\u65f6\u516c\u4f1a\u4e5f\u5c06\u83b7\u5f97\u7ecf\u9a8c\u5e76\u53ef\u5347\u7ea7\uff0c\u7ecf\u9a8c\u6bd4\u4f8b\u4e3a1:1000\u3002</li><li>{{defaultSlots}} \u4e2a\u6210\u5458\u69fd\u4f4d\uff0c\u6bcf{{levelsPerSlot}}\u7ea7\u516c\u4f1a\u7b49\u7ea7\u589e\u52a01\u4e2a\u989d\u5916\u69fd\u4f4d\u3002</li><li>\u53ef\u4ee5\u5206\u914d\u89d2\u8272: \u4f1a\u957f\u3001\u5c06\u519b\u3001\u5b98\u5458\u3001\u4f1a\u5458\u3002</li></ul>",
          cost5m: "\u8d39\u7528: 5,000,000",
          guildNamePlaceholder: "\u516c\u4f1a\u540d\u79f0",
          createGuild: "\u521b\u5efa\u516c\u4f1a",
          joinGuildInfo: "\u4f60\u4e5f\u53ef\u4ee5\u88ab\u9080\u8bf7\u52a0\u5165\u73b0\u6709\u516c\u4f1a\u3002\u4f7f\u7528\u62db\u52df\u804a\u5929\u9891\u9053\u5bfb\u627e\u8981\u52a0\u5165\u7684\u516c\u4f1a\u3002\u6536\u5230\u7684\u9080\u8bf7\u5c06\u663e\u793a\u5728\u4e0b\u65b9\u3002",
          save: "\u4fdd\u5b58",
          edit: "\u4fee\u6539",
          guildLevel: "\u516c\u4f1a\u7b49\u7ea7",
          guildExperience: "\u516c\u4f1a\u7ecf\u9a8c",
          expToLevelUp: "\u5347\u7ea7\u6240\u9700\u7ecf\u9a8c",
          guildMembers: "\u516c\u4f1a\u6210\u5458",
          whisper: "\u79c1\u804a",
          profile: "\u8d44\u6599",
          confirmGiveLead: "\u786e\u8ba4\u8f6c\u8ba9\u4f1a\u957f",
          giveLeadership: "\u8f6c\u8ba9\u4f1a\u957f",
          promote: "\u63d0\u5347",
          demote: "\u964d\u7ea7",
          cancelInvite: "\u53d6\u6d88\u9080\u8bf7",
          confirmKick: "\u786e\u8ba4\u8e22\u51fa",
          kick: "\u8e22\u51fa",
          playerNamePlaceholder: "\u73a9\u5bb6\u540d\u79f0",
          inviteToGuild: "\u9080\u8bf7\u52a0\u5165\u516c\u4f1a",
          membersHeader: "\u6210\u5458 ({{currentCount}}/{{maxCount}})",
          role: "\u804c\u4f4d",
          guildExp: "\u516c\u4f1a\u7ecf\u9a8c",
          activity: "\u6d3b\u52a8",
          status: "\u72b6\u6001",
          invited: "\u5df2\u9080\u8bf7",
          daysAgo: "{{days}}\u524d",
          online: "\u5728\u7ebf",
          hidden: "\u9690\u85cf",
          offline: "\u79bb\u7ebf",
          disbandInstructions: "\u5982\u679c\u6ca1\u6709\u5176\u4ed6\u6210\u5458\u6216\u9080\u8bf7\uff0c\u4f60\u53ef\u4ee5\u89e3\u6563\u516c\u4f1a\u3002",
          disbandGuild: "\u89e3\u6563\u516c\u4f1a",
          leaveInstructions: "\u4f60\u53ef\u4ee5\u79bb\u5f00\u516c\u4f1a\u3002\u79bb\u5f00\u516c\u4f1a\u6ca1\u6709\u4efb\u4f55\u60e9\u7f5a\u3002",
          leaveGuild: "\u79bb\u5f00\u516c\u4f1a",
          guild: "\u516c\u4f1a"
        },
        leaderboardPanel: {
          leaderboard: "\u6392\u884c\u699c",
          noPlayers: "\u6ca1\u6709\u73a9\u5bb6\u8fbe\u5230\u6b64\u6392\u884c\u699c\u7684\u6700\u4f4e\u6807\u51c6\u3002",
          updatesNote: "\u6bcf20\u5206\u949f\u66f4\u65b0\u4e00\u6b21",
          rank: "\u6392\u540d",
          name: "\u540d\u79f0",
          level: "\u7b49\u7ea7",
          experience: "\u7ecf\u9a8c",
          points: "\u79ef\u5206",
          taskPoints: "\u4efb\u52a1\u79ef\u5206",
          famePoints: "\u540d\u8a89\u79ef\u5206"
        },
        moderatorPanel: {
          reportedFor: "\u88ab\u4e3e\u62a5: "
        },
        settingsPanel: {
          settings: "\u8bbe\u7f6e",
          profile: "\u4e2a\u4eba\u8d44\u6599",
          game: "\u6e38\u620f",
          account: "\u8d26\u6237",
          show: "\u663e\u793a",
          hide: "\u9690\u85cf",
          off: "\u5173\u95ed",
          enabled: "\u542f\u7528",
          disabled: "\u7981\u7528",
          on: "\u5f00",
          public: "\u516c\u5f00",
          friendsGuildmates: "\u597d\u53cb/\u516c\u4f1a\u6210\u5458",
          private: "\u9690\u85cf",
          partyMembersOnly: "\u4ec5\u9650\u961f\u5458",
          emailEmpty: "\u7535\u5b50\u90ae\u4ef6\u4e0d\u80fd\u4e3a\u7a7a",
          validEmail: "\u8bf7\u8f93\u5165\u6709\u6548\u7684\u7535\u5b50\u90ae\u4ef6",
          currentPassword: "\u8bf7\u8f93\u5165\u4f60\u7684\u5f53\u524d\u5bc6\u7801",
          passwordLength: "\u5bc6\u7801\u81f3\u5c11\u4e3a6\u4e2a\u5b57\u7b26",
          confirmPassword: "\u786e\u8ba4\u5bc6\u7801\u4e0d\u5339\u914d",
          noneOwned: "\u6ca1\u6709",
          unlock: "\u89e3\u9501",
          unlockMoreAvatars: "\u89e3\u9501\u66f4\u591a\u89d2\u8272\u5f62\u8c61",
          unlockMoreOutfits: "\u89e3\u9501\u66f4\u591a\u670d\u88c5",
          setSkillLevel: "\u66f4\u6539\u4e13\u4e1a\u7b49\u7ea7",
          selectSkill: "\u9009\u62e9\u4e13\u4e1a",
          setLevel: "\u66f4\u6539\u7b49\u7ea7",
          preview: "\u9884\u89c8:",
          viewProfile: "\u67e5\u770b\u6211\u7684\u8d44\u6599",
          chatIcon: "\u804a\u5929\u56fe\u6807:",
          nameColor: "\u540d\u79f0\u989c\u8272:",
          avatar: "\u89d2\u8272\u5f62\u8c61:",
          avatarOutfit: "\u89d2\u8272\u670d\u88c5:",
          onlineStatus: "\u5728\u7ebf\u72b6\u6001:",
          equipment: "\u88c5\u5907:",
          deleteCharacter: "\u5220\u9664\u89d2\u8272",
          deleteCharacterTimeLimit: "\u521b\u5efa\u540e10\u5c0f\u65f6\u5185\u65e0\u6cd5\u5220\u9664",
          showDeletionInstructions: "\u663e\u793a\u5220\u9664\u8bf4\u660e",
          deleteCharacterInstructions: '\u6309\u7167\u8bf4\u660e\u6c38\u4e45\u5220\u9664\u6b64\u89d2\u8272 "{{name}}"\u3002\u5220\u9664\u540e\u65e0\u6cd5\u64a4\u9500\u3002\u4f60\u5fc5\u987b\u5148\u9000\u51fa\u961f\u4f0d\u548c\u516c\u4f1a\uff0c\u7136\u540e\u8f93\u5165\u89d2\u8272\u7684\u786e\u5207\u540d\u79f0\u4ee5\u786e\u8ba4\u5220\u9664\u3002',
          characterName: "\u89d2\u8272\u540d\u79f0:",
          deleteCharacterCaps: "\u5220\u9664\u89d2\u8272",
          gameMode: "\u6e38\u620f\u6a21\u5f0f:",
          mooPass: "\u54de\u5361:",
          inactive: "\u672a\u6fc0\u6d3b",
          offlineProgress: "\u79bb\u7ebf\u8fdb\u5ea6:",
          hours: "\u5c0f\u65f6",
          upgrade: "\u5347\u7ea7",
          marketListing: "\u5e02\u573a\u6302\u724c:",
          listings: "\u6302\u724c",
          actionQueue: "\u884c\u52a8\u961f\u5217:",
          actions: "\u884c\u52a8",
          loadoutSlot: "\u914d\u88c5\u69fd\u4f4d:",
          slots: "\u69fd\u4f4d",
          taskSlots: "\u4efb\u52a1\u69fd\u4f4d:",
          tasks: "\u4efb\u52a1",
          displayLanguage: "\u663e\u793a\u8bed\u8a00:",
          generalChat: "\u82f1\u8bed\u804a\u5929:",
          nonEnglishChat: "\u975e\u82f1\u8bed\u804a\u5929:",
          ironcowChat: "\u94c1\u725b\u804a\u5929:",
          tradeChat: "\u4ea4\u6613\u804a\u5929:",
          recruitChat: "\u62db\u52df\u804a\u5929:",
          beginnerChat: "\u65b0\u624b\u804a\u5929:",
          totalLevelMessage: "\u603b\u7b49\u7ea7\u6d88\u606f:",
          skillLevelMessage: "\u4e13\u4e1a\u7b49\u7ea7\u6d88\u606f:",
          communityBuffMessage: "\u793e\u533a\u589e\u76ca\u6d88\u606f:",
          profanityFilter: "\u5c4f\u853d\u4e0d\u826f\u8bed\u8a00:",
          chatURLWarning: "\u804a\u5929URL\u786e\u8ba4:",
          cssAnimation: "CSS\u52a8\u753b:",
          name: "\u540d\u79f0:",
          accountType: "\u8d26\u6237\u7c7b\u578b:",
          guest: "\u6e38\u5ba2",
          registeredUser: "\u6ce8\u518c\u7528\u6237",
          guestPassword: "\u6e38\u5ba2\u5bc6\u7801:",
          kongregateId: "Kongregate ID:",
          steamId: "Steam ID:",
          currentPasswordLabel: "\u5f53\u524d\u5bc6\u7801:",
          emailLabel: "\u7535\u5b50\u90ae\u4ef6:",
          newPassword: "\u65b0\u5bc6\u7801",
          confirmPasswordLabel: "\u786e\u8ba4\u5bc6\u7801",
          update: "\u66f4\u65b0",
          registerEmailPassword: "\u6ce8\u518c\u7535\u5b50\u90ae\u4ef6/\u5bc6\u7801"
        },
        chat: {
          generalTip: "\u63d0\u793a: \u82f1\u8bed\u9891\u9053\u4ec5\u9650\u82f1\u8bed\u8fdb\u884c\u6e38\u620f\u8ba8\u8bba\u548c\u53cb\u597d\u4ea4\u6d41\u3002\u4e3a\u4fdd\u6301\u79ef\u6781\u548c\u76f8\u4e92\u5c0a\u91cd\u7684\u6c14\u6c1b\uff0c\u8bf7\u9075\u5b88<gameRulesLink>\u6e38\u620f\u89c4\u5219</gameRulesLink>\u3002",
          tradeTip: "\u63d0\u793a: \u8d38\u6613\u9891\u9053\u7528\u4e8e\u5ba3\u4f20\u7269\u54c1\u4ea4\u6613\u548c\u670d\u52a1\u3002\u8bf7\u4f7f\u7528\u79c1\u804a\u8fdb\u884c\u5bf9\u8bdd\u548c\u8c08\u5224\u3002",
          recruitTip: "\u63d0\u793a: \u62db\u52df\u9891\u9053\u7528\u4e8e\u5ba3\u4f20\u516c\u4f1a/\u961f\u4f0d\u62db\u52df\u548c\u5bfb\u627e\u52a0\u5165\u516c\u4f1a/\u961f\u4f0d\u7684\u73a9\u5bb6\u3002\u8bf7\u4f7f\u7528\u79c1\u804a\u8fdb\u884c\u5bf9\u8bdd\u3002",
          beginnerTip: "\u63d0\u793a: \u6b22\u8fce\u5728\u6b64\u63d0\u95ee\u6216\u4e0e\u5176\u4ed6\u73a9\u5bb6\u804a\u5929\u3002\u5b9e\u7528\u94fe\u63a5: <gameGuideLink>\u6e38\u620f\u6307\u5357</gameGuideLink>\u548c<gameRulesLink>\u6e38\u620f\u89c4\u5219</gameRulesLink>\u3002",
          whisperTip: '\u63d0\u793a: \u4f60\u53ef\u4ee5\u4f7f\u7528\u547d\u4ee4"/w [\u73a9\u5bb6\u540d] [\u6d88\u606f]"\u4e0e\u5176\u4ed6\u73a9\u5bb6\u79c1\u804a\uff0c\u6216\u70b9\u51fb\u73a9\u5bb6\u7684\u540d\u79f0\u5e76\u9009\u62e9\u79c1\u804a\u3002',
          useWhisperCommand: "\u4f7f\u7528 /w \u547d\u4ee4",
          needPlayerName: "\u9700\u8981\u73a9\u5bb6\u540d",
          emptyMessage: "\u6d88\u606f\u4e3a\u7a7a",
          invalidCommand: "\u65e0\u6548\u547d\u4ee4",
          useTradeChannel: "\u8bf7\u4f7f\u7528\u4ea4\u6613\u9891\u9053",
          useRecruitChannel: "\u8bf7\u4f7f\u7528\u62db\u52df\u9891\u9053",
          mutedMessage: "\u7981\u8a00\u81f3 {{muteExpireTime}}\u3002{{muteReason}}",
          generalChatRestriction: "\u4f60\u9700\u8981\u81f3\u5c11 {{generalChatMinLevel}} \u603b\u7b49\u7ea7\u6216 {{generalChatMinExp}} \u603b\u7ecf\u9a8c\u624d\u80fd\u4f7f\u7528\u82f1\u8bed\u804a\u5929",
          chatRestriction: "\u4f60\u9700\u8981\u81f3\u5c11 {{chatMinLevel}} \u603b\u7b49\u7ea7\u624d\u80fd\u804a\u5929",
          enterMessagePlaceholder: "\u8f93\u5165\u6d88\u606f...",
          sendButton: "\u53d1\u9001",
          reportChatMessage: "\u4e3e\u62a5\u804a\u5929\u6d88\u606f",
          reportInstructions: "\u4e3e\u62a5\u4e25\u91cd\u7684\u804a\u5929\u5e72\u6270\u6216\u8fdd\u89c4\u884c\u4e3a\u3002\u5bf9\u4e8e\u4e2a\u4eba\u95f4\u7684\u5c0f\u4e89\u6267\uff0c\u8bf7\u4f7f\u7528\u5c4f\u853d\u529f\u80fd\u3002",
          reportReason: "\u4e3e\u62a5\u539f\u56e0:",
          submitReport: "\u63d0\u4ea4\u4e3e\u62a5",
          reportType: {
            selectReason: "\u9009\u62e9\u4e3e\u62a5\u539f\u56e0",
            harassmentMe: "\u9a9a\u6270\u6211",
            harassmentOthers: "\u9a9a\u6270\u4ed6\u4eba",
            offensiveLanguage: "\u5192\u72af\u6027\u8bed\u8a00",
            illegalViolentSexual: "\u975e\u6cd5/\u66b4\u529b/\u6027\u5185\u5bb9",
            controversialTopics: "\u654f\u611f\u8bdd\u9898",
            excessiveDrama: "\u8fc7\u5ea6\u95f9\u4e8b/\u7eb7\u4e89",
            spam: "\u6076\u610f\u5237\u5c4f/\u5783\u573e\u4fe1\u606f",
            encouragingRuleBreaking: "\u9f13\u52b1\u8fdd\u53cd\u89c4\u5219",
            personalInformation: "\u6cc4\u9732\u4e2a\u4eba\u4fe1\u606f",
            wrongChannel: "\u9519\u8bef\u9891\u9053",
            cheating: "\u4f5c\u5f0a",
            underage: "\u672a\u6ee113\u5c81",
            inappropriateName: "\u4e0d\u5f53\u540d\u79f0",
            other: "\u5176\u4ed6"
          },
          reportTypeDescription: {
            harassmentMe: "\u9488\u5bf9\u6211\u7684\u4eba\u8eab\u653b\u51fb\u6216\u4e25\u91cd\u9a9a\u6270\u3002",
            harassmentOthers: "\u9488\u5bf9\u5176\u4ed6\u73a9\u5bb6\u7684\u4eba\u8eab\u653b\u51fb\u6216\u4e25\u91cd\u9a9a\u6270\u3002",
            offensiveLanguage: "\u4f7f\u7528\u5192\u72af\u6027\u6216\u4e0d\u5f53\u8bed\u8a00\u3002",
            illegalViolentSexual: "\u5305\u542b\u975e\u6cd5\u3001\u8fc7\u5ea6\u66b4\u529b\u6216\u6027\u5185\u5bb9\u7684\u6d88\u606f\u3001\u8ba8\u8bba\u6216\u94fe\u63a5\u3002",
            controversialTopics: "\u654f\u611f\u8bdd\u9898\uff0c\u5982\u653f\u6cbb\u3001\u5b97\u6559\u3001\u56fd\u9645\u51b2\u7a81\u3001\u6027\u522b\u8ba8\u8bba\u3001\u6027\u53d6\u5411\u3001\u7981\u8a00/\u5c01\u7981\u6295\u8bc9\u7b49\uff0c\u4ee5\u53ca\u5176\u4ed6\u5bb9\u6613\u5f15\u53d1\u7eb7\u4e89\u7684\u8bdd\u9898\u3002",
            excessiveDrama: "\u84c4\u610f\u5e26\u8282\u594f\u6216\u717d\u52a8\u6027\u8a00\u8bba\uff0c\u5e72\u6270\u804a\u5929\u79e9\u5e8f\u3002",
            spam: "\u4e00\u4e2a\u73a9\u5bb6\u9891\u7e41\u53d1\u9001\u91cd\u590d\u6216\u65e0\u610f\u4e49\u6d88\u606f\u6216\u7d22\u8981\u514d\u8d39\u7269\u54c1\u3002(\u591a\u540d\u73a9\u5bb6\u53d1\u9001\u7c7b\u4f3c\u6d88\u606f\u662f\u5141\u8bb8\u7684)",
            encouragingRuleBreaking: "\u9f13\u52b1\u6216\u8bef\u5bfc\u5176\u4ed6\u73a9\u5bb6\u8fdd\u53cd\u6e38\u620f\u89c4\u5219\u3002",
            personalInformation: "\u6cc4\u9732\u81ea\u5df1\u6216\u5176\u4ed6\u73a9\u5bb6\u672a\u516c\u5f00\u7684\u4e2a\u4eba\u8eab\u4efd\u4fe1\u606f\u3002",
            wrongChannel: "\u591a\u6b21\u5728\u9519\u8bef\u7684\u9891\u9053\u53d1\u9001\u6d88\u606f\u3002",
            cheating: "\u81ea\u79f0\u4f5c\u5f0a\u884c\u4e3a\uff0c\u5305\u62ec\u591a\u8d26\u53f7\u3001\u8d22\u5bcc\u8f6c\u79fb\u3001\u7ebf\u5916\u4ea4\u6613\u3001\u975e\u6cd5\u811a\u672c\u6216\u6f0f\u6d1e\u5229\u7528\u3002",
            underage: "\u81ea\u79f0\u672a\u6ee113\u5c81\u3002",
            inappropriateName: "\u4e0d\u5f53\u7684\u89d2\u8272\u540d\u79f0\u3002",
            other: "\u5176\u4ed6\u672a\u6db5\u76d6\u7684\u95ee\u9898\u3002"
          }
        },
        chatMessage: {
          whisper: "\u79c1\u804a",
          mention: "\u63d0\u53ca",
          profile: "\u73a9\u5bb6\u8d44\u6599",
          addFriend: "\u52a0\u597d\u53cb",
          confirmBlock: "\u786e\u8ba4\u5c4f\u853d",
          block: "\u5c4f\u853d",
          report: "\u4e3e\u62a5",
          modInspect: "\u7ba1\u7406\u5458\u68c0\u67e5",
          undeleteMsg: "\u6062\u590d\u6d88\u606f",
          deleteMsg: "\u5220\u9664\u6d88\u606f",
          warn: "\u8b66\u544a",
          mute: "\u7981\u8a00",
          moderator: "\u7ba1\u7406\u5458",
          privateModeratorTo: "(\u79c1\u5bc6) \u7ba1\u7406\u5458\u5bf9{{receiverName}}\u8bf4",
          toPlayer: "\u5bf9{{receiverName}}\u8bf4",
          messageDeleted: "\u6d88\u606f\u5df2\u5220\u9664"
        },
        characterName: {
          customIcon: "\u5b9a\u5236\u56fe\u6807"
        },
        textWithLinks: {
          externalLinkWarning: "\u4f60\u786e\u5b9a\u8981\u6253\u5f00\u5916\u90e8\u94fe\u63a5\u5417\uff1f"
        },
        characterManagement: {
          inventory: "\u5e93\u5b58",
          equipment: "\u88c5\u5907",
          abilities: "\u6280\u80fd",
          house: "\u623f\u5c4b",
          loadouts: "\u914d\u88c5"
        },
        inventory: {
          openedLootHeader: "\u6253\u5f00\u7684\u6218\u5229\u54c1",
          foundItemsLabel: "\u4f60\u627e\u5230\u4e86",
          closeButton: "\u5173\u95ed",
          itemFilterPlaceholder: "\u7269\u54c1\u641c\u7d22"
        },
        equipmentPanel: {
          title: "\u88c5\u5907",
          viewStats: "\u67e5\u770b\u5c5e\u6027",
          combatStats: "\u6218\u6597\u5c5e\u6027",
          nonCombatStats: "\u975e\u6218\u6597\u5c5e\u6027"
        },
        abilitiesPanel: {
          title: "\u6280\u80fd",
          abilitySlotsLabel: "\u6280\u80fd\u69fd\u4f4d",
          learnedAbilitiesLabel: "\u5df2\u5b66\u6280\u80fd"
        },
        housePanel: {
          house: "\u623f\u5c4b",
          houseBuffs: "\u623f\u5c4b\u589e\u76ca",
          allSkills: "\u6240\u6709\u884c\u52a8",
          none: "\u65e0",
          notBuilt: "\u672a\u5efa\u9020",
          level: "{{level}} \u7ea7",
          max: "\u6700\u5927",
          constructionCosts: "\u5efa\u9020\u8d39\u7528",
          build: "\u5efa\u9020",
          viewBuffs: "\u67e5\u770b\u589e\u76ca",
          actionBuff: "{{action}}\u589e\u76ca",
          allSkillBuffs: "\u6240\u6709\u884c\u52a8\u589e\u76ca"
        },
        loadoutPanel: {
          allSkills: "\u6240\u6709\u884c\u52a8",
          newLoadout: "\u65b0\u914d\u88c5",
          createLoadout: "\u521b\u5efa\u914d\u88c5",
          loadoutCount: "{{count}} / {{max}} \u914d\u88c5",
          upgradeCapacity: "\u5347\u7ea7\u5bb9\u91cf",
          loadouts: "\u914d\u88c5",
          viewAllLoadouts: "\u67e5\u770b\u6240\u6709\u914d\u88c5",
          deleteLoadout: "\u5220\u9664\u914d\u88c5",
          confirmDeleteLoadout: "\u4f60\u786e\u5b9a\u8981\u5220\u9664\u6b64\u914d\u88c5\u5417\uff1f",
          name: "\u540d\u79f0",
          edit: "\u4fee\u6539",
          save: "\u4fdd\u5b58",
          setDefault: "\u8bbe\u4e3a{{actionTypeName}}\u7684\u9ed8\u8ba4\u914d\u88c5",
          suppressValidation: "\u7f3a\u5931\u7269\u54c1\u65f6\u4e0d\u8981\u63d0\u9192",
          importCurrentSetup: "\u5bfc\u5165\u5f53\u524d\u914d\u7f6e",
          confirmImportCurrentSetup: "\u4f60\u786e\u5b9a\u8981\u5bfc\u5165\u4f60\u5f53\u524d\u914d\u7f6e\u5417\uff1f\u8fd9\u5c06\u8986\u76d6\u73b0\u6709\u7684\u914d\u88c5\u3002",
          equipLoadout: "\u88c5\u5907\u914d\u88c5",
          equipment: "\u88c5\u5907",
          abilities: "\u6280\u80fd",
          consumables: "\u6d88\u8017\u54c1"
        },
        offlineProgressModal: {
          welcomeBack: "\u6b22\u8fce\u56de\u6765\uff01",
          offlineDuration: "\u79bb\u7ebf\u65f6\u95f4",
          progressDuration: "\u8fdb\u5c55\u65f6\u95f4",
          upgrade: "\u5347\u7ea7",
          itemsGained: "\u83b7\u5f97\u7269\u54c1",
          experienceGained: "\u83b7\u5f97\u7ecf\u9a8c",
          itemsConsumed: "\u6d88\u8017\u7269\u54c1",
          close: "\u5173\u95ed"
        },
        sharableProfile: {
          overview: "\u6982\u89c8",
          skills: "\u4e13\u4e1a",
          equipment: "\u88c5\u5907",
          house: "\u623f\u5c4b",
          guildRole: "{{guildName}} {{role}}",
          online: "\u5728\u7ebf",
          offline: "\u79bb\u7ebf",
          totalExperience: "\u603b\u7ecf\u9a8c: {{experience}}",
          totalLevel: "\u603b\u7b49\u7ea7: {{level}}",
          combatLevel: "\u6218\u6597\u7b49\u7ea7: {{level}}",
          age: "\u5e74\u9f84: {{age}}",
          level: "{{level}} \u7ea7",
          close: "\u5173\u95ed"
        },
        skill: {
          level: "\u7b49\u7ea7: {{level}}",
          totalExperience: "\u603b\u7ecf\u9a8c: {{totalExperience}}",
          expToLevelUp: "\u5347\u7ea7\u6240\u9700\u7ecf\u9a8c: {{remainingExperience}}"
        },
        item: {
          all: "\u5168\u90e8",
          learn: "\u5b66\u4e60",
          levelNotMet: "(\u7b49\u7ea7\u672a\u8fbe\u5230)",
          cannotDuringCombat: "(\u6218\u6597\u4e2d\u65e0\u6cd5\u4f7f\u7528)",
          newAbility: "(\u65b0\u6280\u80fd)",
          gainXP: "(+{{count}} XP)",
          equip: "\u88c5\u5907",
          enhance: "\u5f3a\u5316",
          alchemize: "\u70bc\u91d1",
          openLoot: "\u6253\u5f00 {{count}} \u4e2a",
          openLootWithKeys: "\u6253\u5f00 {{count}} \u4e2a (\u94a5\u5319: {{keyCount}})",
          viewMarketplace: "\u524d\u5f80\u5e02\u573a",
          viewCowbellStore: "\u524d\u5f80\u725b\u94c3\u5546\u5e97",
          linkToChat: "\u94fe\u63a5\u5230\u804a\u5929\u9891\u9053",
          openItemDictionary: "\u6253\u5f00\u7269\u54c1\u8bcd\u5178",
          sellFor: "\u5356\u51fa {{count}} \u91d1\u5e01",
          confirmSellFor: "\u786e\u8ba4\u5356\u51fa {{count}} \u91d1\u5e01"
        },
        itemTooltipText: {
          amount: "\u6570\u91cf: {{amount}}",
          sellPrice: "\u5546\u4eba\u4ef7\u683c: {{price}}",
          openHotkeyHint: "\u6253\u5f00 - [\u53f3\u952e\u70b9\u51fb]",
          abilityBookType: "\u7c7b\u578b: \u6280\u80fd\u4e66",
          requiresLevel: "\u9700\u8981: {{level}} \u7ea7{{skill}}",
          abilityExpPerBook: "\u6bcf\u672c\u4e66\u6280\u80fd\u7ecf\u9a8c: {{exp}} ",
          learnHotkeyHint: "\u5b66\u4e60 - [\u53f3\u952e\u70b9\u51fb]",
          equipmentType: "\u7c7b\u578b: {{type}}",
          equipHotkeyHint: "\u88c5\u5907 - [\u53f3\u952e\u70b9\u51fb]",
          consumableType: "\u7c7b\u578b: \u6d88\u8017\u54c1",
          usableIn: "\u53ef\u7528\u4e8e: ",
          cooldownInCombat: "\u51b7\u5374 (\u6218\u6597\u4e2d): {{seconds}}s",
          hpRestore: "HP\u6062\u590d: {{amount}}HP",
          mpRestore: "MP\u6062\u590d: {{amount}}MP",
          overDuration: "\u6301\u7eed {{duration}}"
        },
        equipmentStatsText: {
          weaken: "\u524a\u5f31: \u88ab\u654c\u4eba\u653b\u51fb\u65f6\uff0c\u964d\u4f4e\u654c\u4eba{{value}}\u4f24\u5bb3\uff0c\u6301\u7eed15\u79d2\uff0c\u6700\u591a\u53e0\u52a05\u6b21\u3002",
          fury: "\u72c2\u6012: \u547d\u4e2d\u654c\u4eba\u65f6\uff0c\u589e\u52a0{{value}}\u7cbe\u51c6\u5ea6\u548c\u4f24\u5bb3\uff0c\u6301\u7eed15\u79d2\uff0c\u6700\u591a\u53e0\u52a05\u6b21\u3002\u672a\u547d\u4e2d\u65f6\u5931\u53bb\u4e00\u534a\u53e0\u52a0\u5c42\u3002",
          parry: "\u683c\u6321: {{value}}\u51e0\u7387\u683c\u6321\u654c\u4eba\u7684\u653b\u51fb\uff0c\u907f\u514d\u4f24\u5bb3\u5e76\u7acb\u5373\u81ea\u52a8\u653b\u51fb\u4e00\u6b21\u3002\u53ef\u683c\u6321\u9488\u5bf9\u961f\u53cb\u7684\u653b\u51fb\u3002",
          mayhem: "\u66b4\u4e71: \u5728\u81ea\u52a8\u653b\u51fb\u672a\u547d\u4e2d\u65f6\uff0c\u6709{{value}}\u51e0\u7387\u81ea\u52a8\u653b\u51fb\u4e0b\u4e00\u4e2a\u654c\u4eba\uff0c\u53ef\u591a\u6b21\u8fde\u7eed\u89e6\u53d1\u3002",
          pierce: "\u7a7f\u900f: \u5728\u81ea\u52a8\u653b\u51fb\u547d\u4e2d\u540e\uff0c\u6709{{value}}\u51e0\u7387\u81ea\u52a8\u653b\u51fb\u4e0b\u4e00\u4e2a\u654c\u4eba\uff0c\u53ef\u591a\u6b21\u8fde\u7eed\u89e6\u53d1\u3002",
          curse: "\u8bc5\u5492: \u547d\u4e2d\u654c\u4eba\u65f6\uff0c\u4f7f\u5176\u53d7\u5230\u7684\u4f24\u5bb3\u589e\u52a0{{value}}\uff0c\u6301\u7eed15\u79d2\uff0c\u6700\u591a\u53e0\u52a05\u6b21\u3002",
          ripple: "\u6d9f\u6f2a: \u65bd\u653e\u6280\u80fd\u65f6\uff0c{{value}}\u51e0\u7387\u51cf\u5c11\u6240\u6709\u6280\u80fd\u51b7\u5374\u65f6\u95f42\u79d2\u5e76\u6062\u590d10MP\u3002",
          bloom: "\u7efd\u653e: \u65bd\u653e\u6280\u80fd\u65f6\uff0c{{value}}\u51e0\u7387\u6cbb\u7597HP%\u6700\u4f4e\u7684\u961f\u53cb10HP+15%\u9b54\u6cd5\u4f24\u5bb3\u3002",
          blaze: "\u70bd\u7130: \u65bd\u653e\u6280\u80fd\u65f6\uff0c{{value}}\u51e0\u7387\u653b\u51fb\u6240\u6709\u654c\u4eba30%\u9b54\u6cd5\u4f24\u5bb3\u3002"
        },
        itemSelector: {
          count: "\u6570\u91cf",
          remove: "\u79fb\u9664",
          itemFilterPlaceholder: "\u7269\u54c1\u641c\u7d22",
          cannotChangeWhileInCombat: "\u6218\u6597\u4e2d\u65e0\u6cd5\u66f4\u6539",
          noItemsAvailable: "\u6ca1\u6709\u53ef\u7528\u7269\u54c1"
        },
        consumableSlot: {
          requireBiggerPouch: "\u9700\u66f4\u5927<br />\u888b\u5b50",
          food: "\u98df\u7269",
          drink: "\u996e\u6599"
        },
        itemDictionary: {
          gatheredFrom: "\u91c7\u96c6\u81ea:",
          producedFrom: "\u751f\u4ea7\u81ea",
          producedFromCheesesmithing: "\u751f\u4ea7\u81ea\u5976\u916a\u953b\u9020:",
          producedFromCrafting: "\u751f\u4ea7\u81ea\u5236\u4f5c:",
          producedFromTailoring: "\u751f\u4ea7\u81ea\u7f1d\u7eab:",
          producedFromCooking: "\u751f\u4ea7\u81ea\u70f9\u996a:",
          producedFromBrewing: "\u751f\u4ea7\u81ea\u51b2\u6ce1:",
          producedFromAlchemy: "\u751f\u4ea7\u81ea\u70bc\u91d1:",
          producedFromEnhancing: "\u751f\u4ea7\u81ea\u5f3a\u5316:",
          rareDropFrom: "\u7a00\u6709\u6389\u843d\u6765\u81ea:",
          droppedByMonsters: "\u602a\u7269\u6389\u843d:",
          droppedByEliteMonsters: "\u7cbe\u82f1\u602a\u7269\u6389\u843d:",
          decomposedFrom: "\u5206\u89e3\u81ea(\u70bc\u91d1):",
          transmutedFrom: "\u8f6c\u5316\u81ea(\u70bc\u91d1):",
          decomposesInto: "\u5206\u89e3\u6210(\u70bc\u91d1):",
          transmutesInto: "\u8f6c\u5316\u6210(\u70bc\u91d1):",
          enhancingCost: "\u5f3a\u5316\u6210\u672c:",
          usedFor: "\u7528\u4e8e{{actionTypeName}}:",
          lootedFromContainer: "\u4ece\u5bb9\u5668\u4e2d\u83b7\u5f97:",
          openToLoot: "\u6253\u5f00\u53ef\u83b7\u5f97:",
          anyMilkingAction: "\u4efb\u4f55\u6324\u5976\u884c\u52a8\u3002",
          anyForagingAction: "\u4efb\u4f55\u91c7\u6458\u884c\u52a8\u3002",
          anyWoodcuttingAction: "\u4efb\u4f55\u4f10\u6728\u884c\u52a8\u3002",
          anyCheesesmithingAction: "\u4efb\u4f55\u5976\u916a\u953b\u9020\u884c\u52a8\u3002",
          anyCraftingAction: "\u4efb\u4f55\u5236\u4f5c\u884c\u52a8\u3002",
          anyTailoringAction: "\u4efb\u4f55\u7f1d\u7eab\u884c\u52a8\u3002",
          anyCookingAction: "\u4efb\u4f55\u70f9\u996a\u884c\u52a8\u3002",
          anyBrewingAction: "\u4efb\u4f55\u51b2\u6ce1\u884c\u52a8\u3002",
          anyAlchemyAction: "\u4efb\u4f55\u70bc\u91d1\u884c\u52a8\u3002",
          anyEnhancingAction: "\u4efb\u4f55\u5f3a\u5316\u884c\u52a8\u3002",
          anyLowLevelGathering: "\u4efb\u4f55\u4f4e\u7ea7\u91c7\u96c6\u884c\u52a8\u3002",
          anyMediumLevelGathering: "\u4efb\u4f55\u4e2d\u7ea7\u91c7\u96c6\u884c\u52a8\u3002",
          anyHighLevelGathering: "\u4efb\u4f55\u9ad8\u7ea7\u91c7\u96c6\u884c\u52a8\u3002",
          anyLowLevelProduction: "\u4efb\u4f55\u4f4e\u7ea7\u751f\u4ea7\u3001\u70bc\u91d1\u548c\u5f3a\u5316\u884c\u52a8\u3002",
          anyMediumLevelProduction: "\u4efb\u4f55\u4e2d\u7ea7\u751f\u4ea7\u3001\u70bc\u91d1\u548c\u5f3a\u5316\u884c\u52a8\u3002",
          anyHighLevelProduction: "\u4efb\u4f55\u9ad8\u7ea7\u751f\u4ea7\u3001\u70bc\u91d1\u548c\u5f3a\u5316\u884c\u52a8\u3002",
          almostAllMonstersDropCoins: "\u51e0\u4e4e\u6240\u6709\u602a\u7269\u90fd\u4f1a\u6389\u843d\u91d1\u5e01\u3002",
          anyLowLevelMonster: "\u4efb\u4f55\u4f4e\u7ea7\u602a\u7269\u5728\u666e\u901a\u6218\u6597\u4e2d\u3002",
          anyMediumLevelMonster: "\u4efb\u4f55\u4e2d\u7ea7\u602a\u7269\u5728\u666e\u901a\u6218\u6597\u4e2d\u3002",
          anyHighLevelMonster: "\u4efb\u4f55\u9ad8\u7ea7\u602a\u7269\u5728\u666e\u901a\u6218\u6597\u4e2d\u3002",
          recommendedLevel: "\u63a8\u8350\u7b49\u7ea7 {{level}} <Icon />"
        },
        ability: {
          level: "\u7b49\u7ea7: {{level}}",
          totalExperience: "\u603b\u7ecf\u9a8c: {{totalExperience}}",
          expToLevelUp: "\u5347\u7ea7\u6240\u9700\u7ecf\u9a8c: {{remainingExperience}}",
          linkToChat: "\u94fe\u63a5\u5230\u804a\u5929\u9891\u9053",
          lv: "Lv.{{level}}",
          ability: "\u6280\u80fd"
        },
        abilityTooltipText: {
          description: "\u63cf\u8ff0: {{description}}",
          cooldown: "\u51b7\u5374: {{duration}}",
          castTime: "\u65bd\u6cd5\u65f6\u95f4: {{duration}}",
          mpCost: "\u6cd5\u529b\u6d88\u8017: {{cost}} MP",
          effect: "\u6548\u679c: {{effectText}}",
          attacks: "\u653b\u51fb",
          heals: "\u6cbb\u7597",
          revivesAndHeals: "\u590d\u6d3b\u5e76\u6cbb\u7597",
          increases: "\u589e\u52a0",
          decreases: "\u51cf\u5c11",
          target: "\u76ee\u6807",
          self: "\u81ea\u5df1",
          enemy: "\u654c\u4eba",
          allEnemies: "\u6240\u6709\u654c\u4eba",
          allAllies: "\u6240\u6709\u961f\u53cb",
          lowestHpAlly: "HP\u6700\u4f4e\u7684\u961f\u53cb",
          deadAlly: "\u5df2\u9635\u4ea1\u7684\u961f\u53cb",
          possessive: {
            target: "\u76ee\u6807\u7684",
            self: "\u81ea\u5df1\u7684",
            enemy: "\u654c\u4eba\u7684",
            allEnemies: "\u6240\u6709\u654c\u4eba\u7684",
            allAllies: "\u6240\u6709\u961f\u53cb\u7684",
            lowestHpAlly: "HP\u6700\u4f4e\u7684\u961f\u53cb\u7684",
            deadAlly: "\u5df2\u9635\u4ea1\u7684\u961f\u53cb\u7684"
          },
          accuracyBonusText: "\u4ee5{{accuracyBonus}}\u603b\u7cbe\u51c6\u5ea6\uff0c",
          baseDamageFlat: "{{baseDamageFlat}}HP",
          baseDamageRatio: "{{baseDamageRatio}}",
          asDamageType: "{{damageType}}",
          takesDamageOverTime: "\u53d7\u6301\u7eed\u4f24\u5bb3",
          bleeds: "\u6d41\u8840",
          soaks: "\u6d78\u6e7f",
          poisons: "\u4e2d\u6bd2",
          burns: "\u71c3\u70e7",
          dotText: "\u4f7f\u76ee\u6807{{dotVerb}}{{dotDuration}}\uff0c\u518d\u9020\u6210\u539f\u653b\u51fb100%\u7684\u4f24\u5bb3\u3002",
          armorDamageText: "\u989d\u5916\u4f24\u5bb3\u7b49\u540c\u4e8e{{armorDamageRatio}}\u62a4\u7532\u3002",
          hpDrainText: "\u5438\u53d6{{hpDrainRatio}}\u7684\u4f24\u5bb3\u4f5c\u4e3aHP\u3002",
          pierceText: "{{pierceChance}}\u7a7f\u900f\u51e0\u7387\u3002",
          stunText: "{{stunChance}}\u51e0\u7387\u4f7f\u76ee\u6807\u6655\u7729{{stunDuration}}\u3002",
          blindText: "{{blindChance}}\u51e0\u7387\u4f7f\u76ee\u6807\u5931\u660e{{blindDuration}}\u3002",
          silenceText: "{{silenceChance}}\u51e0\u7387\u4f7f\u76ee\u6807\u6c89\u9ed8{{silenceDuration}}\u3002",
          damageHealReviveEffectText: "{{accuracyBonusText}}{{asDamageType}}{{effectType}}{{effectTarget}}{{baseDamageFlat}}{{maybePlus}}{{baseDamageRatio}}{{combatStyle}}\u4f24\u5bb3\u3002{{dotText}}{{armorDamageText}}{{hpDrainText}}{{pierceText}}{{stunText}}{{blindText}}{{silenceText}}",
          spendHpEffectText: "\u6d88\u8017\u5f53\u524dHP {{hpCost}}\u3002",
          buffEffectText: "{{increaseOrDecrease}}{{targetType}}{{buffName}}{{boostText}}\uff0c\u6301\u7eed{{duration}}\u3002"
        },
        abilitySlot: {
          specialAbility: "\u7279\u6b8a<br />\u6280\u80fd",
          ability: "\u6280\u80fd",
          unlockLevel: "{{level}}\u667a\u529b<br />\u89e3\u9501",
          remove: "\u79fb\u9664",
          cannotChangeInCombat: "\u6218\u6597\u4e2d\u65e0\u6cd5\u66f4\u6539",
          noAbilitiesAvailable: "\u6ca1\u6709\u53ef\u7528\u6280\u80fd"
        },
        combatTriggersSetting: {
          activateWhen: "\u4f7f\u7528\u6761\u4ef6:",
          activateOffCooldown: "\u51b7\u5374\u7ed3\u675f\u540e\u7acb\u5373\u4f7f\u7528",
          and: "\u5e76\u4e14",
          combatTriggers: "\u6218\u6597\u81ea\u52a8\u89e6\u53d1",
          selectTargetType: "\u9009\u62e9\u76ee\u6807\u7c7b\u578b",
          selectCondition: "\u9009\u62e9\u6761\u4ef6",
          select: "\u9009\u62e9",
          remove: "\u79fb\u9664",
          addCondition: "\u52a0\u6761\u4ef6",
          resetDefault: "\u91cd\u7f6e\u4e3a\u9ed8\u8ba4",
          save: "\u4fdd\u5b58",
          setting: "\u8bbe\u7f6e",
          triggerText: "{{dependency}}{{condition}} {{comparator}} {{value}}",
          cannotChangeInCombat: "\u6218\u6597\u4e2d\u65e0\u6cd5\u66f4\u6539"
        },
        buffText: {
          duration: "\u6301\u7eed\u65f6\u95f4",
          detail: "\u8be6\u60c5"
        },
        buffsTooltip: {
          bonuses: "\u52a0\u6210"
        },
        mooPass: {
          mooPass: "\u54de\u5361",
          durationLabel: "\u6301\u7eed\u65f6\u95f4: ",
          mooPassExpBuff: "+{{expBuff}} \u7ecf\u9a8c\u589e\u76ca (\u9650\u4e8e\u6807\u51c6\u89d2\u8272)",
          mooPassOfflineHourLimit: "+{{count}} \u5c0f\u65f6\u79bb\u7ebf\u8fdb\u5ea6\u4e0a\u9650",
          mooPassMarketListingLimit: "+{{count}} \u5e02\u573a\u6302\u724c\u4e0a\u9650",
          mooPassActionQueueLimit: "+{{count}} \u884c\u52a8\u961f\u5217\u4e0a\u9650",
          mooPassTaskSlotLimit: "+{{count}} \u4efb\u52a1\u69fd\u4f4d\u4e0a\u9650",
          mooPassFreeTaskRerolls: "+{{count}} \u6b21\u514d\u8d39\u4efb\u52a1\u91cd\u7f6e (\u6bcf\u4e2a\u4efb\u52a1)",
          mooPassLootTracker: "\u6700\u540e {{count}} \u4e2a\u884c\u52a8\u7684\u6389\u843d\u8bb0\u5f55",
          mooPassAvatarBorder: "\u91d1\u8272\u89d2\u8272\u8fb9\u6846"
        },
        communityBuff: {
          durationLabel: "\u6301\u7eed\u65f6\u95f4: ",
          durationDefault: "\u6301\u7eed\u65f6\u95f4: 1\u5206\u949f",
          minutesToNextLevel: "\u4e0b\u4e00\u7ea7\u6240\u9700\u5206\u949f\u6570: {{minutes}}",
          level: "\u7b49\u7ea7: {{level}}",
          max: " (\u6700\u5927)",
          usableIn: "\u53ef\u7528\u4e8e: ",
          contributor: "{{name}}: {{minutes}} \u5206\u949f",
          moreContributors: "(+{{count}} \u66f4\u591a\u8d21\u732e\u8005)"
        },
        systemChatMessage: {
          communityBuffAdded: "{{name}} \u6dfb\u52a0\u4e86{{minutes}}\u5206\u949f\u7684\u793e\u533a\u589e\u76ca: $t(communityBuffTypeNames.{{buffHrid}})!",
          characterLeveledUp: "{{name}} \u8fbe\u5230{{level}}$t(skillNames.{{skillHrid}})!",
          guildLeveledUp: "\u516c\u4f1a\u8fbe\u5230{{level}}\u7ea7!",
          guildNoticeUpdated: "{{name}} \u66f4\u65b0\u4e86\u516c\u4f1a\u516c\u544a\u4fe1\u606f\u3002",
          guildMemberPromoted: "{{name}} \u88ab {{actor}} \u63d0\u5347\u4e3a$t(guildCharacterRoleNames.{{role}})\u3002",
          guildMemberDemoted: "{{name}} \u88ab {{actor}} \u964d\u7ea7\u4e3a$t(guildCharacterRoleNames.{{role}})\u3002",
          guildMemberJoined: "{{name}} \u52a0\u5165\u4e86\u516c\u4f1a\uff01",
          guildMemberLeft: "{{name}} \u79bb\u5f00\u4e86\u516c\u4f1a\u3002",
          guildMemberKicked: "{{name}} \u88ab {{actor}} \u8e22\u51fa\u516c\u4f1a\u3002",
          partyMemberJoined: "{{name}} \u52a0\u5165\u4e86\u961f\u4f0d\u3002",
          partyMemberLeft: "{{name}} \u79bb\u5f00\u4e86\u961f\u4f0d\u3002",
          partyMemberKicked: "{{name}} \u88ab\u8e22\u51fa\u961f\u4f0d\u3002",
          partyMemberReady: "{{name}} \u5df2\u51c6\u5907\u597d\u3002",
          partyMemberNotReady: "{{name}} \u672a\u51c6\u5907\u597d\u3002",
          partyBattleStarted: "\u6218\u6597\u5f00\u59cb: $t(actionNames.{{actionHrid}})",
          partyBattleEnded: "\u6218\u6597\u7ed3\u675f: $t(actionNames.{{actionHrid}})",
          partyKeyCount: "\u94a5\u5319\u6570\u91cf: {{keyCountString}}",
          partyWaveFailed: "\u961f\u4f0d\u5728\u7b2c{{wave}}\u6ce2\u5931\u8d25\u3002"
        },
        infoNotification: {
          addedFriend: "\u5df2\u6dfb\u52a0\u597d\u53cb: {{0}}",
          removedFriend: "\u5df2\u5220\u9664\u597d\u53cb: {{0}}",
          blockedCharacter: "\u5df2\u5c4f\u853d\u89d2\u8272: {{0}}\n\u5728[\u793e\u4ea4]->[\u9ed1\u540d\u5355]\u53ef\u67e5\u770b",
          unblockedCharacter: "\u5df2\u53d6\u6d88\u5c4f\u853d\u89d2\u8272: {{0}}",
          chatReportSubmitted: "\u5df2\u63d0\u4ea4\u804a\u5929\u4e3e\u62a5",
          loadoutCreated: "\u5df2\u521b\u5efa\u914d\u88c5",
          loadoutUpdated: "\u5df2\u66f4\u65b0\u914d\u88c5",
          setupImportedToLoadout: "\u5df2\u5bfc\u5165\u5f53\u524d\u8bbe\u7f6e\u5230\u914d\u88c5",
          loadoutEquipped: "\u5df2\u88c5\u5907\u914d\u88c5",
          loadoutDeleted: "\u5df2\u5220\u9664\u914d\u88c5",
          boughtItem: "\u8d2d\u4e70\u4e86 {{0}} {{1}}",
          soldItem: "\u51fa\u552e\u4e86 {{0}} {{1}}",
          buyOrderCompleted: "\u8d2d\u4e70\u4e86 {{0}} \u4e2a{{1}}{{2}}\n\u82b1\u8d39 {{3}} \u91d1\u5e01",
          sellOrderCompleted: "\u51fa\u552e\u4e86 {{0}} \u4e2a{{1}}{{2}}\n\u83b7\u5f97 {{3}} \u91d1\u5e01",
          buyListingProgress: "\u8d2d\u4e70\u6302\u724c: {{0}}{{1}}\n\u8fdb\u5ea6: {{2}}/{{3}}",
          sellListingProgress: "\u51fa\u552e\u6302\u724c: {{0}}{{1}}\n\u8fdb\u5ea6: {{2}}/{{3}}",
          houseConstructed: "{{0}}\u7ea7{{1}}\u5df2\u5efa\u6210",
          steamCheckoutRequested: "\u5df2\u8bf7\u6c42STEAM\u7ed3\u8d26\u3002\u8bf7\u7a0d\u5019...",
          upgradePurchased: "\u5df2\u8d2d\u4e70\u5347\u7ea7: {{0}} (x{{1}})",
          chatIconUnlocked: "\u89e3\u9501\u804a\u5929\u56fe\u6807: {{0}}",
          nameColorUnlocked: "\u89e3\u9501\u540d\u79f0\u989c\u8272: {{0}}",
          avatarUnlocked: "\u89e3\u9501\u65b0\u89d2\u8272\u5f62\u8c61",
          avatarOutfitUnlocked: "\u89e3\u9501\u65b0\u89d2\u8272\u670d\u88c5",
          communityBuffAdded: "\u6dfb\u52a0\u4e86 {{0}} \u5206\u949f\u7684\u793e\u533a\u589e\u76ca: {{1}}",
          nameChanged: "\u540d\u79f0\u5df2\u66f4\u6539: {{0}}",
          guildCreated: "\u521b\u5efa\u4e86\u516c\u4f1a: {{0}}",
          guildDisbanded: "\u89e3\u6563\u4e86\u516c\u4f1a: {{0}}",
          guildLeft: "\u79bb\u5f00\u4e86\u516c\u4f1a: {{0}}",
          guildNoticeUpdated: "{{0}} \u66f4\u65b0\u4e86\u516c\u4f1a\u516c\u544a\u4fe1\u606f\u3002",
          guildPromotedTo: "\u4f60\u88ab\u63d0\u5347\u4e3a\u516c\u4f1a{{0}}",
          guildDemotedTo: "\u4f60\u88ab\u964d\u7ea7\u4e3a\u516c\u4f1a{{0}}",
          guildLeadershipPassed: "\u5c06\u4f1a\u957f\u6743\u79fb\u4ea4\u7ed9 {{0}}",
          guildMemberPromoted: "\u5c06 {{0}} \u63d0\u5347\u4e3a{{1}}",
          guildMemberDemoted: "\u5c06 {{0}} \u964d\u7ea7\u4e3a{{1}}",
          guildKicked: "\u88ab\u8e22\u51fa\u516c\u4f1a: {{0}}",
          kickedGuildMember: "\u5df2\u8e22\u51fa {{0}}",
          guildInvited: "\u9080\u8bf7\u52a0\u5165\u516c\u4f1a: {{0}}",
          guildInviteSent: "\u53d1\u9001\u4e86\u516c\u4f1a\u9080\u8bf7: {{0}}",
          guildInviteCanceled: "\u5df2\u53d6\u6d88\u516c\u4f1a\u9080\u8bf7: {{0}}",
          guildJoined: "\u52a0\u5165\u4e86\u516c\u4f1a: {{0}}",
          guildInviteDeclined: "\u62d2\u7edd\u4e86\u516c\u4f1a\u9080\u8bf7: {{0}}",
          partyCreated: "\u5df2\u521b\u5efa\u961f\u4f0d",
          characterLeveledUp: "\u4f60\u5df2\u8fbe\u5230 {{0}} {{1}}!",
          partyOptionsSaved: "\u961f\u4f0d\u9009\u9879\u5df2\u4fdd\u5b58",
          partyOpenForRecruiting: "\u961f\u4f0d\u6b63\u5728\u62db\u52df",
          partyLeadershipChanged: "\u961f\u957f\u6743\u8f6c\u79fb\u7ed9 {{0}}",
          partyJoined: "\u4f60\u5df2\u52a0\u5165\u961f\u4f0d",
          readyToBattle: "\u4f60\u5df2\u51c6\u5907\u597d\u6218\u6597",
          notReadyToBattle: "\u4f60\u672a\u51c6\u5907\u597d\u6218\u6597",
          partyDisbanded: "\u961f\u4f0d\u5df2\u89e3\u6563",
          partyLeft: "\u4f60\u5df2\u79bb\u5f00\u961f\u4f0d",
          partyKicked: "\u4f60\u88ab\u8e22\u51fa\u961f\u4f0d",
          partyMemberKicked: "\u5df2\u4ece\u961f\u4f0d\u8e22\u51fa {{0}}",
          referralJoined: "\u6709\u65b0\u73a9\u5bb6\u901a\u8fc7\u4f60\u7684\u63a8\u8350\u94fe\u63a5\u52a0\u5165\u4e86\u6e38\u620f\u3002\u611f\u8c22\u4f60\u7684\u5206\u4eab\uff01",
          newReferralBonus: "\u65b0\u63a8\u8350\u5956\u52b1\u5df2\u53d1\u653e\n\u5728[\u793e\u4ea4]->[\u63a8\u8350]\u9886\u53d6",
          cowbellPurchaseCompleted: "\u5df2\u8d2d\u4e70 {{0}} \u725b\u94c3",
          mooPassPurchaseCompleted: "\u5df2\u8d2d\u4e70 {{0}} \u5929\u54de\u5361",
          mooPassGranted: "\u5df2\u83b7\u5f97: {{0}} \u5929\u54de\u5361",
          updateSuccessful: "\u66f4\u65b0\u6210\u529f"
        },
        errorNotification: {
          unexpectedError: "\u53d1\u751f\u610f\u5916\u9519\u8bef",
          characterBlockError: "\u7531\u4e8e\u89d2\u8272\u5c4f\u853d\u800c\u5931\u8d25",
          characterNameNotFound: "\u627e\u4e0d\u5230\u89d2\u8272\u540d\u79f0",
          cannotFriendSelf: "\u65e0\u6cd5\u6dfb\u52a0\u81ea\u5df1\u4e3a\u597d\u53cb",
          friendAlreadyExists: "\u597d\u53cb\u5df2\u5b58\u5728",
          friendLimitReached: "\u597d\u53cb\u4e0a\u9650\u5df2\u8fbe\u5230",
          characterWasNotFriend: "\u89d2\u8272\u4e0d\u662f\u597d\u53cb",
          cannotBlockSelf: "\u65e0\u6cd5\u5c4f\u853d\u81ea\u5df1",
          characterAlreadyBlocked: "\u89d2\u8272\u5df2\u88ab\u5c4f\u853d",
          blockLimitReached: "\u5c4f\u853d\u4e0a\u9650\u5df2\u8fbe\u5230",
          characterWasNotBlocked: "\u89d2\u8272\u672a\u88ab\u5c4f\u853d",
          requestSpamProtection: "\u8bf7\u52ff\u8fc7\u5feb\u53d1\u9001\u6e38\u620f\u6307\u4ee4",
          nonPublicModMessage: "\u65e0\u6cd5\u5411\u975e\u516c\u5171\u9891\u9053\u53d1\u9001\u7ba1\u7406\u5458\u6d88\u606f",
          nonPublicWarningMessage: "\u65e0\u6cd5\u5411\u975e\u516c\u5171\u9891\u9053\u53d1\u9001\u8b66\u544a\u6d88\u606f",
          chatSpamProtection: "\u8bf7\u52ff\u91cd\u590d\u6d88\u606f\u6216\u8fc7\u5feb\u53d1\u9001\u6d88\u606f",
          waitBetweenTradeMessages: "\u8bf7\u7b49\u5f855\u5206\u949f\u540e\u518d\u53d1\u9001\u4ea4\u6613\u6d88\u606f",
          waitBetweenRecruitMessages: "\u8bf7\u7b49\u5f855\u5206\u949f\u540e\u518d\u53d1\u9001\u62db\u52df\u6d88\u606f",
          chatReportAlreadyExists: "\u4f60\u5df2\u4e3e\u62a5\u6b64\u804a\u5929\u6d88\u606f",
          chatReportAlreadyResolved: "\u6b64\u6d88\u606f\u7684\u4e3e\u62a5\u5df2\u88ab\u5904\u7406",
          stopPartyBattleBeforeSolo: "\u4f60\u5fc5\u987b\u505c\u6b62\u56e2\u961f\u6218\u6597\u540e\u624d\u80fd\u5f00\u59cb\u5355\u4eba\u884c\u52a8",
          cannotEquipLoadoutForAction: "\u65e0\u6cd5\u88c5\u5907\u6b64\u884c\u52a8\u7684\u914d\u88c5",
          cannotEquipLoadoutInCombat: "\u65e0\u6cd5\u5728\u6218\u6597\u4e2d\u88c5\u5907\u914d\u88c5",
          orderNotFulfilled: "\u8ba2\u5355\u65e0\u6cd5\u5b8c\u6210",
          steamCheckoutError: "Steam \u7ed3\u8d26\u9519\u8bef",
          stripeCheckoutError: "Stripe \u7ed3\u8d26\u9519\u8bef",
          characterNameUnavailable: "\u89d2\u8272\u540d\u79f0\u4e0d\u53ef\u7528",
          guildNameUnavailable: "\u516c\u4f1a\u540d\u79f0\u4e0d\u53ef\u7528",
          characterAlreadyInGuild: "\u89d2\u8272\u5df2\u6709\u516c\u4f1a",
          characterAlreadyInvited: "\u89d2\u8272\u5df2\u88ab\u9080\u8bf7",
          alreadyInParty: "\u4f60\u5df2\u7ecf\u5728\u961f\u4f0d\u4e2d",
          characterNotInParty: "\u89d2\u8272\u4e0d\u5728\u961f\u4f0d\u4e2d",
          partyNoLongerRecruiting: "\u6b64\u961f\u4f0d\u4e0d\u518d\u62db\u52df",
          partyGameModeMismatch: "\u6b64\u961f\u4f0d\u4e0e\u4f60\u7684\u6e38\u620f\u6a21\u5f0f\u4e0d\u5339\u914d",
          partySlotUnavailable: "\u961f\u4f0d\u69fd\u4f4d\u5df2\u4e0d\u53ef\u7528",
          currentPasswordIncorrect: "\u5f53\u524d\u5bc6\u7801\u4e0d\u6b63\u786e",
          emailAlreadyRegistered: "\u6b64\u7535\u5b50\u90ae\u4ef6\u5730\u5740\u5df2\u5728\u53e6\u4e00\u4e2a\u8d26\u6237\u4e0a\u6ce8\u518c"
        },
        guideTooltip: {
          milkingTitle: "\u6324\u5976",
          milkingContent: "\u8fd9\u4e9b\u795e\u5947\u5976\u725b\u7684\u725b\u5976\u6709\u591a\u79cd\u529f\u80fd\u3002\u5b83\u4eec\u53ef\u4ee5\u7528\u6765\u5236\u4f5c\u6d88\u8017\u54c1\uff0c\u6216\u8005\u505a\u6210\u7279\u6b8a\u5976\u916a\u4ee5\u5236\u4f5c\u88c5\u5907\u3002\n\u5976\u725b\u559c\u6b22\u88ab\u5237\u6bdb\u3002\u88c5\u5907\u5237\u5b50\u4f1a\u63d0\u5347\u4f60\u7684\u6324\u5976\u6548\u7387\u3002",
          foragingTitle: "\u91c7\u6458",
          foragingContent: "\u5728\u5404\u4e2a\u5730\u533a\u91c7\u6458\u65f6\uff0c\u4f60\u53ef\u4ee5\u627e\u5230\u8bb8\u591a\u4e0d\u540c\u7684\u8d44\u6e90\u3002\u8fd9\u4e9b\u8d44\u6e90\u53ef\u4ee5\u7528\u4e8e\u70f9\u996a\u548c\u51b2\u6ce1\u6d88\u8017\u54c1\u3002\n\u88c5\u5907\u526a\u5200\u4f1a\u63d0\u5347\u4f60\u7684\u91c7\u6458\u6548\u7387\u3002",
          woodcuttingTitle: "\u4f10\u6728",
          woodcuttingContent: "\u4f60\u53ef\u4ee5\u4ece\u4e0d\u540c\u7c7b\u578b\u7684\u6811\u6728\u4e2d\u83b7\u53d6\u6728\u6750\u3002\u6728\u6750\u7528\u4e8e\u5236\u4f5c\u5404\u79cd\u88c5\u5907\u3002\n\u88c5\u5907\u65a7\u5934\u4f1a\u63d0\u5347\u4f60\u7684\u4f10\u6728\u6548\u7387\u3002",
          cheesesmithingTitle: "\u5976\u916a\u953b\u9020",
          cheesesmithingContent: "\u7528\u725b\u5976\u5236\u4f5c\u7684\u786c\u8d28\u5976\u916a\u575a\u786c\u5982\u91d1\u5c5e\u3002\u4f60\u53ef\u4ee5\u5c06\u5b83\u4eec\u953b\u9020\u6210\u88c5\u5907\uff0c\u4e3a\u4f60\u7684\u6218\u6597\u6216\u6280\u827a\u8bad\u7ec3\u63d0\u4f9b\u52a0\u6210\u3002\n\u88c5\u5907\u53ef\u4ee5\u4ece\u4e00\u7ea7\u5347\u7ea7\u5230\u4e0b\u4e00\u7ea7\uff0c\u901a\u5e38\u9700\u8981\u8d8a\u6765\u8d8a\u591a\u7684\u5976\u916a\u3002\u8fd8\u6709\u4e00\u4e9b\u7279\u6b8a\u7684\u88c5\u5907\u53ef\u4ee5\u7528\u6218\u6597\u4e2d\u4ece\u602a\u7269\u8eab\u4e0a\u83b7\u5f97\u7684\u7269\u54c1\u6765\u5236\u4f5c\u3002\n\u88c5\u5907\u9524\u5b50\u4f1a\u63d0\u5347\u4f60\u7684\u5976\u916a\u953b\u9020\u6548\u7387\u3002",
          craftingTitle: "\u5236\u4f5c",
          craftingContent: "\u4f60\u53ef\u4ee5\u5236\u4f5c\u6b66\u5668\u3001\u526f\u624b\u88c5\u5907\u548c\u73e0\u5b9d\u3002\n\u88c5\u5907\u51ff\u5b50\u4f1a\u63d0\u5347\u4f60\u7684\u5236\u4f5c\u6548\u7387\u3002",
          tailoringTitle: "\u7f1d\u7eab",
          tailoringContent: "\u4f60\u53ef\u4ee5\u4f7f\u7528\u4ece\u6218\u6597\u548c\u91c7\u6458\u4e2d\u83b7\u5f97\u7684\u539f\u6750\u6599\u6765\u5236\u4f5c\u8fdc\u7a0b\u548c\u9b54\u6cd5\u670d\u88c5\u3002\n\u88c5\u5907\u9488\u4f1a\u63d0\u5347\u4f60\u7684\u7f1d\u7eab\u6548\u7387\u3002",
          cookingTitle: "\u70f9\u996a",
          cookingContent: "\u98df\u7269\u53ef\u4ee5\u7528\u6765\u6062\u590d\u4f60\u7684HP\u6216MP\u3002\u5b83\u4eec\u53ef\u4ee5\u968f\u8eab\u643a\u5e26\u5728\u6218\u6597\u4e2d\u4f7f\u7528\u3002\n\u88c5\u5907\u9505\u94f2\u4f1a\u63d0\u5347\u4f60\u7684\u70f9\u996a\u6548\u7387\u3002",
          brewingTitle: "\u51b2\u6ce1",
          brewingContent: "\u996e\u54c1\u53ef\u4ee5\u7ed9\u4f60\u63d0\u4f9b\u4e34\u65f6\u589e\u76ca\u6548\u679c\u3002\u5496\u5561\u53ef\u4ee5\u5728\u6218\u6597\u4e2d\u643a\u5e26\uff0c\u8336\u53ef\u4ee5\u5728\u8bad\u7ec3\u6280\u827a\u65f6\u4f7f\u7528\u3002\n\u88c5\u5907\u58f6\u4f1a\u63d0\u5347\u4f60\u7684\u51b2\u6ce1\u6548\u7387\u3002",
          alchemyTitle: "\u70bc\u91d1",
          alchemyContent: "\u70bc\u91d1\u8ba9\u4f60\u5c06\u7269\u54c1\u8f6c\u6362\u4e3a\u5176\u4ed6\u7269\u54c1\u3002\u6bcf\u79cd\u70bc\u91d1\u90fd\u6709\u4e0d\u540c\u7684\u6210\u529f\u7387\uff0c\u65e0\u8bba\u6210\u529f\u6216\u5931\u8d25\uff0c\u8f93\u5165\u7684\u7269\u54c1\u90fd\u4f1a\u88ab\u6d88\u8017\u3002\n\u70b9\u91d1: \u5c06\u7269\u54c1\u8f6c\u6362\u4e3a\u91d1\u5e01\u3002\u5206\u89e3: \u5c06\u7269\u54c1\u8f6c\u6362\u4e3a\u539f\u6750\u6599\u6216\u7cbe\u534e\u3002\u8f6c\u5316: \u5c06\u7269\u54c1\u8f6c\u6362\u4e3a\u968f\u673a\u76f8\u5173\u7269\u54c1\uff0c\u5728\u67d0\u4e9b\u60c5\u51b5\u4e0b\u80fd\u83b7\u5f97\u7684\u7279\u6b8a\u7269\u54c1\u3002\n\u6bcf\u6b21\u8f6c\u5316\u90fd\u6709\u4e00\u4e2a\u57fa\u672c\u6210\u529f\u7387\u3002\u5982\u679c\u4f60\u7684\u70bc\u91d1\u7b49\u7ea7\u4f4e\u4e8e\u7269\u54c1\u7b49\u7ea7\uff0c\u6210\u529f\u7387\u4f1a\u964d\u4f4e\u3002\u50ac\u5316\u5242\u548c\u8336\u53ef\u4ee5\u7528\u6765\u63d0\u9ad8\u6210\u529f\u7387\u3002\n\u88c5\u5907\u84b8\u998f\u5668\u4f1a\u63d0\u5347\u4f60\u7684\u70bc\u91d1\u6548\u7387\u3002",
          enhancingTitle: "\u5f3a\u5316",
          enhancingContent: "\u5f3a\u5316\u53ef\u4ee5\u6c38\u4e45\u63d0\u5347\u4f60\u7684\u88c5\u5907\uff0c\u968f\u7740\u5f3a\u5316\u7b49\u7ea7\u7684\u63d0\u9ad8\uff0c\u88c5\u5907\u5c06\u83b7\u5f97\u66f4\u9ad8\u7684\u52a0\u6210\u3002\n\u6bcf\u6b21\u5c1d\u8bd5\u5f3a\u5316\u90fd\u9700\u8981\u6d88\u8017\u5c11\u91cf\u6750\u6599\u3002\u6210\u529f\u7387\u53d6\u51b3\u4e8e\u4f60\u7684\u5f3a\u5316\u7b49\u7ea7\u3001\u88c5\u5907\u7269\u54c1\u7684\u7b49\u7ea7\u548c\u8be5\u7269\u54c1\u5f53\u524d\u7684\u5f3a\u5316\u7b49\u7ea7\u3002\u6210\u529f\u7684\u5f3a\u5316\u5c06\u4f7f\u7b49\u7ea7\u589e\u52a01\uff0c\u5931\u8d25\u4f1a\u5c06\u7b49\u7ea7\u91cd\u7f6e\u4e3a0\u3002\n\u4f60\u53ef\u4ee5\u9009\u62e9\u4f7f\u7528\u57fa\u7840\u88c5\u5907\u7684\u526f\u672c\u8fdb\u884c\u4fdd\u62a4\u3002\u5931\u8d25\u65f6\u4f7f\u7528\u4fdd\u62a4\u53ea\u4f1a\u5c06\u5f3a\u5316\u7b49\u7ea7\u964d\u4f4e1\uff0c\u4f46\u4f1a\u6d88\u80171\u4e2a\u4fdd\u62a4\u9053\u5177\u3002\n\u88c5\u5907\u5f3a\u5316\u5668\u4f1a\u63d0\u5347\u4f60\u7684\u5f3a\u5316\u6210\u529f\u7387\u3002",
          combatTitle: "\u6218\u6597",
          combatContent: "\u51fb\u8d25\u602a\u7269\u53ef\u83b7\u5f97\u7ecf\u9a8c\u548c\u7269\u54c1\u6389\u843d\u3002\n\u4f60\u7684\u6218\u6597\u5c5e\u6027\u57fa\u4e8e\u4f60\u7684\u6218\u6597\u7b49\u7ea7\u548c\u88c5\u5907\u52a0\u6210\u7684\u7ec4\u5408\u3002\n\u4f60\u53ef\u4ee5\u5e26\u98df\u7269\u6765\u6062\u590dHP\u6216MP\uff0c\u996e\u54c1\u53ef\u4ee5\u63d0\u4f9b\u589e\u76ca\u6548\u679c\uff0c\u8fd8\u53ef\u4ee5\u65bd\u653e\u5404\u79cd\u6280\u80fd\u3002\n\u4f60\u53ef\u4ee5\u901a\u8fc7\u4e0b\u65b9\u7684\u8bbe\u7f6e\u56fe\u6807\u6765\u66f4\u6539\u81ea\u52a8\u5316\u914d\u7f6e\u3002\n\u5982\u679c\u4f60\u5728\u6218\u6597\u4e2d\u88ab\u51fb\u8d25\uff0c\u4f60\u7684\u89d2\u8272\u5c06\u5728\u91cd\u751f\u5012\u8ba1\u65f6\u7ed3\u675f\u540e\u81ea\u52a8\u7ee7\u7eed\u6218\u6597\u3002",
          marketplaceTitle: "\u5e02\u573a",
          marketplaceContent: "\u5e02\u573a\u5141\u8bb8\u73a9\u5bb6\u4e3a\u4efb\u4f55\u53ef\u4ea4\u6613\u7269\u54c1\u521b\u5efa\u4e70\u5356\u6302\u724c\u3002\u4f60\u53ef\u4ee5\u70b9\u51fb\u4efb\u4f55\u5217\u51fa\u7684\u7269\u54c1\u67e5\u770b\u73b0\u6709\u6302\u724c\u6216\u521b\u5efa\u81ea\u5df1\u7684\u6302\u724c\u3002\n\u65b0\u6302\u724c\u5c06\u5c3d\u53ef\u80fd\u7531\u5e02\u573a\u4e0a\u6700\u5339\u914d\u7684\u4ef7\u683c\u6765\u6ee1\u8db3\u3002\u5982\u679c\u65e0\u6cd5\u7acb\u5373\u6ee1\u8db3\uff0c\u8be5\u6302\u724c\u5c06\u51fa\u73b0\u5728\u5e02\u573a\u4e0a\u3002\n\u4ea4\u6613\u6210\u529f\u65f6\uff0c\u5c06\u6536\u53d62%\u7684\u91d1\u5e01\u7a0e\uff0c\u6536\u5230\u7684\u7269\u54c1\u53ef\u4ee5\u4ece[\u6211\u7684\u6302\u724c]\u6807\u7b7e\u4e2d\u6536\u96c6\u3002\u51fa\u552e\u4ef7: \u5df2\u5b58\u5728\u7684\u51fa\u552e\u6302\u724c\u3002\u6536\u8d2d\u4ef7: \u5df2\u5b58\u5728\u7684\u8d2d\u4e70\u6302\u724c\u3002",
          combatStatsTitle: "\u6218\u6597\u5c5e\u6027",
          combatStatsContent: "\u653b\u51fb\u95f4\u9694: \u81ea\u52a8\u653b\u51fb\u7684\u901f\u5ea6\u3002\n\u6280\u80fd\u6025\u901f: \u51cf\u5c11\u6280\u80fd\u51b7\u5374\u65f6\u95f4\u3002\n\u7cbe\u51c6\u5ea6: \u589e\u52a0\u6210\u529f\u653b\u51fb\u7684\u51e0\u7387\u3002\n\u4f24\u5bb3: \u81ea\u52a8\u653b\u51fb\u4f24\u5bb3\u57281\u548c\u6700\u5927\u4f24\u5bb3\u4e4b\u95f4\u968f\u673a\u3002\n\u66b4\u51fb: \u603b\u662f\u9020\u6210\u6700\u5927\u4f24\u5bb3\u3002\u8fdc\u7a0b\u7c7b\u578b\u6709\u88ab\u52a8\u66b4\u51fb\u51e0\u7387\u3002\n\u4efb\u52a1\u4f24\u5bb3: \u5bf9\u88ab\u6307\u5b9a\u4e3a\u4efb\u52a1\u7684\u602a\u7269\u589e\u52a0\u4f24\u5bb3\u3002\n\u589e\u5e45: \u589e\u52a0\u8be5\u7c7b\u578b\u7684\u4f24\u5bb3\u3002\n\u95ea\u907f: \u589e\u52a0\u8eb2\u907f\u653b\u51fb\u7684\u51e0\u7387\u3002\n\u62a4\u7532: \u51cf\u5c11\u4e00\u5b9a\u6bd4\u4f8b\u7684\u7269\u7406\u4f24\u5bb3\u3002\n\u6297\u6027: \u51cf\u5c11\u4e00\u5b9a\u6bd4\u4f8b\u7684\u5143\u7d20\u4f24\u5bb3\u3002\n\u7a7f\u900f: \u5ffd\u7565\u4e00\u5b9a\u6bd4\u4f8b\u7684\u62a4\u7532/\u6297\u6027\u3002\n\u751f\u547d\u5077\u53d6: \u81ea\u52a8\u653b\u51fb\u65f6\u6062\u590d\u4e00\u5b9a\u6bd4\u4f8b\u7684HP\u3002\n\u6cd5\u529b\u5438\u53d6: \u81ea\u52a8\u653b\u51fb\u65f6\u5438\u53d6\u4e00\u5b9a\u6bd4\u4f8b\u7684MP\u3002\n\u8346\u68d8: \u88ab\u653b\u51fb\u65f6\uff0c\u5c06\u4e00\u5b9a\u6bd4\u4f8b\u7684\u9632\u5fa1\u4f24\u5bb3\u53cd\u5c04\u7ed9\u653b\u51fb\u8005\u3002\u6bcf\u4e2a\u62a4\u7532\u6216\u6297\u6027\u589e\u52a01%\u4f24\u5bb3\u3002\n\u53cd\u4f24: \u88ab\u653b\u51fb\u65f6\uff0c\u5c06(\u9632\u5fa1\u4f24\u5bb3+\u88ab\u653b\u51fb\u4f24\u5bb3)\u7684\u4e00\u5b9a\u6bd4\u4f8b\u4ee5\u949d\u51fb\u5f62\u5f0f\u53cd\u4f24\u653b\u51fb\u8005\u3002\n\u97e7\u6027: \u51cf\u5c11\u5931\u660e\u3001\u6c89\u9ed8\u6216\u7729\u6655\u7684\u51e0\u7387\u3002\n\u5a01\u80c1: \u589e\u52a0\u88ab\u602a\u7269\u653b\u51fb\u7684\u51e0\u7387\u3002\n\u6062\u590d: \u6bcf10\u79d2\u6062\u590d\u4e00\u5b9a\u6bd4\u4f8b\u7684\u6700\u5927HP/MP\u3002\n\u98df\u7269\u6025\u901f: \u51cf\u5c11\u98df\u7269\u51b7\u5374\u65f6\u95f4\u3002\n\u996e\u6599\u6d53\u5ea6: \u589e\u52a0\u996e\u6599\u6548\u679c\u3002\u51cf\u5c11\u6301\u7eed\u65f6\u95f4\u548c\u51b7\u5374\u65f6\u95f4\u3002",
          noncombatStatsTitle: "\u975e\u6218\u6597\u5c5e\u6027",
          noncombatStatsContent: "\u901f\u5ea6: \u589e\u52a0\u884c\u52a8\u901f\u5ea6\n\u4efb\u52a1\u901f\u5ea6: \u589e\u52a0\u4efb\u52a1\u4e2d\u7684\u884c\u52a8\u901f\u5ea6\u3002\n\u91c7\u96c6\u6570\u91cf: \u589e\u52a0\u91c7\u96c6\u6570\u91cf\n\u6548\u7387: \u7acb\u5373\u91cd\u590d\u884c\u52a8\u7684\u51e0\u7387\n\u4e13\u4e1a\u7cbe\u534e\u53d1\u73b0: \u589e\u52a0\u53d1\u73b0\u7cbe\u534e\u7684\u51e0\u7387\n\u4e13\u4e1a\u7a00\u6709\u53d1\u73b0: \u589e\u52a0\u7a00\u6709\u7269\u54c1\u6389\u843d\u7387\u3002",
          abilitiesTitle: "\u6280\u80fd",
          abilitiesContent: "\u6280\u80fd\u53ef\u4ee5\u4ece\u6280\u80fd\u4e66\u4e2d\u5b66\u4e60\u3002\u6280\u80fd\u4e66\u53ef\u4ee5\u4ece\u602a\u7269\u8eab\u4e0a\u83b7\u5f97\uff0c\u6216\u8005\u5728\u5e02\u573a\u4e0a\u4ece\u5176\u4ed6\u73a9\u5bb6\u90a3\u91cc\u8d2d\u4e70\u3002\n\u6280\u80fd\u53ef\u4ee5\u653e\u7f6e\u5728\u69fd\u4f4d\u4e2d\u7528\u4e8e\u6218\u6597\u3002\u968f\u7740\u667a\u529b\u7b49\u7ea7\u7684\u63d0\u5347\uff0c\u4f60\u5c06\u89e3\u9501\u66f4\u591a\u7684\u69fd\u4f4d\u3002\n\u968f\u7740\u7ecf\u9a8c\u7684\u83b7\u5f97\uff0c\u6280\u80fd\u4e5f\u4f1a\u5347\u7ea7\u3002\u6bcf\u6b21\u5728\u6218\u6597\u4e2d\u4f7f\u7528\u6280\u80fd\u65f6\u53ef\u4ee5\u83b7\u5f970.1\u70b9\u7ecf\u9a8c\uff0c\u4ece\u6d88\u8017\u91cd\u590d\u7684\u6280\u80fd\u4e66\u4e2d\u53ef\u4ee5\u83b7\u5f97\u66f4\u591a\u7ecf\u9a8c\u3002",
          houseTitle: "\u623f\u5c4b",
          houseContent: "\u4f60\u7684\u623f\u5c4b\u53ef\u4ee5\u5efa\u9020\u623f\u95f4\uff0c\u4e3a\u4f60\u63d0\u4f9b\u6c38\u4e45\u52a0\u6210\u3002\n\u6bcf\u4e2a\u623f\u95f4\u53ef\u4ee5\u5347\u7ea7\u5230\u6700\u9ad88\u7ea7\uff0c\u4f46\u5347\u7ea7\u6210\u672c\u9010\u6e10\u589e\u52a0\u3002",
          loadoutsTitle: "\u914d\u88c5",
          loadoutsContent: '\u914d\u88c5\u5141\u8bb8\u4f60\u4fdd\u5b58\u5f53\u524d\u7684\u88c5\u5907\u3001\u6d88\u8017\u54c1\u548c\u6280\u80fd\uff0c\u4ee5\u4fbf\u7a0d\u540e\u4e0e\u884c\u52a8\u4e00\u8d77\u81ea\u52a8\u52a0\u8f7d\u3002\u914d\u88c5\u53ef\u4ee5\u7ed1\u5b9a\u5230\u5355\u4e2a\u4e13\u4e1a\u6216"\u6240\u6709\u4e13\u4e1a"\u3002\u9009\u62e9"\u6240\u6709\u4e13\u4e1a"\u5c06\u53ea\u4fdd\u5b58\u88c5\u5907\u3002\n\u5c06\u914d\u88c5\u8bbe\u7f6e\u4e3a\u9ed8\u8ba4\u65f6\uff0c\u5728\u9009\u62e9\u4e0e\u914d\u88c5\u5173\u8054\u7684\u4e13\u4e1a\u4e2d\u7684\u4efb\u4f55\u884c\u52a8\u65f6\u4f1a\u81ea\u52a8\u9009\u62e9\u8be5\u914d\u88c5\u3002',
          enhancingProtectionTitle: "\u5f3a\u5316\u4fdd\u62a4",
          enhancingProtectionContent: "\u5f3a\u5316\u5931\u8d25\u65f6\u6d88\u8017\u4e00\u4e2a\u4fdd\u62a4\u9053\u5177\u4ee5\u786e\u4fdd\u53ea\u635f\u59311\u7ea7\u5f3a\u5316\uff0c\u800c\u4e0d\u662f\u91cd\u7f6e\u4e3a0\u7ea7\u3002",
          alchemyCatalystTitle: "\u70bc\u91d1\u50ac\u5316\u5242",
          alchemyCatalystContent: "\u50ac\u5316\u5242\u589e\u52a0\u6210\u529f\u7387\u3002\u4ec5\u5728\u6210\u529f\u65f6\u6d88\u8017\u4e00\u4e2a\u50ac\u5316\u5242\u3002"
        },
        newsPanel: {
          news: "\u65b0\u95fb"
        },
        newsText: {
          1755558e6: {
            heading: "\u5927\u578b\u66f4\u65b0 - \u6218\u6597\u91cd\u505a\u3001\u62a4\u7b26\u548c\u7cbe\u70bc\u88c5\u5907",
            content: "<div>\n\t\t\t\t\t\u672c\u6b21\u66f4\u65b0\u5bf9\u6218\u6597\u7cfb\u7edf\u8fdb\u884c\u4e86\u91cd\u5927\u6539\u9769\uff0c\u540c\u65f6\u5f15\u5165\u4e86\u65b0\u7684\u529f\u80fd\uff0c\u5305\u62ec\u62a4\u7b26\u3001\u7cbe\u70bc\u7684\u5730\u7262\u88c5\u5907\uff0c\u4ee5\u53ca\u6269\u5c55\u7684\u6218\u6597\u96be\u5ea6\u5c42\u7ea7\u3002\n\t\t\t\t\t<br />\n\t\t\t\t\t<br />\n\t\t\t\t\t\u5728\u957f\u671f\u7684\u6e38\u620f\u8fc7\u7a0b\u4e2d\uff0c\u6211\u4eec\u53d1\u73b0\u4e09\u79cd\u6218\u6597\u98ce\u683c\uff08\u8fd1\u6218\u3001\u8fdc\u7a0b\u548c\u9b54\u6cd5\uff09\u4e4b\u95f4\u5b58\u5728\u5e73\u8861\u6027\u95ee\u9898\u3002\u8fd9\u4e9b\u95ee\u9898\u4f7f\u5f97\u5728\u4e0d\u540c\u6218\u6597\u98ce\u683c\u548c\u4e0d\u540c\u8fdb\u5ea6\u9636\u6bb5\u4e4b\u95f4\u7ef4\u6301\u7ecf\u9a8c\u4e0e\u6536\u76ca\u5e73\u8861\u53d8\u5f97\u975e\u5e38\u56f0\u96be\u3002\u5176\u4e2d\u6700\u4e25\u91cd\u7684\u95ee\u9898\u5305\u62ec\uff1a\n\t\t\t\t\t<br />\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\u4e13\u4e1a\u9700\u6c42\uff1a\u8fd1\u6218\u73a9\u5bb6\u9700\u8981\u989d\u5916\u7684\u653b\u51fb\u4e13\u4e1a\uff0c\u5bfc\u81f4\u7ecf\u9a8c\u5206\u914d\u548c\u589e\u76ca\u9053\u5177\u7684\u4f7f\u7528\u51fa\u73b0\u4e0d\u5e73\u8861\u3002</li>\n\t\t\t\t\t\t<li>\u9b54\u6cd5\u6280\u80fd\u589e\u957f\uff1a\u56e0\u4e3a\u9b54\u6cd5\u8f93\u51fa\u5168\u9760\u6280\u80fd\uff0c\u9b54\u6cd5\u4f24\u5bb3\u6280\u80fd\u6bcf\u7ea7\u7684DPS\u63d0\u5347\u5927\u7ea6\u662f\u5176\u4ed6\u98ce\u683c\u7684\u4e24\u500d\uff0c\u4f7f\u5f97\u5728\u6240\u6709\u8fdb\u5ea6\u9636\u6bb5\u4e2d\u5f88\u96be\u516c\u5e73\u5730\u5e73\u8861\u8f93\u51fa\u3002</li>\n\t\t\t\t\t\t<li>\u7ecf\u9a8c\u4e0d\u5e73\u8861\uff1a\u7ecf\u9a8c\u516c\u5f0f\u5728\u65e0\u610f\u4e2d\u504f\u5411\u67d0\u4e9b\u7b56\u7565\uff0c\u5373\u4f7fDPS\u76f8\u540c\u3002</li>\n\t\t\t\t\t</ol>\n\t\t\t\t\t<br />\n\t\t\t\t\t\u672c\u6b21\u91cd\u505a\u89e3\u51b3\u4e86\u8fd9\u4e9b\u4e0d\u5e73\u8861\uff0c\u5e76\u4e3a\u6218\u6597\u7684\u957f\u671f\u5e73\u8861\u5960\u5b9a\u4e86\u57fa\u7840\u3002\u4e3b\u8981\u6539\u52a8\u5305\u62ec\uff1a\n\t\t\t\t\t<br />\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\u6240\u6709\u6218\u6597\u98ce\u683c\u73b0\u5728\u90fd\u9700\u8981\u4f9d\u9760\u653b\u51fb\u4e13\u4e1a\u6765\u63d0\u5347\u7cbe\u51c6\u5ea6\u3002\u73a9\u5bb6\u5c06\u7acb\u5373\u6839\u636e\u5176\u8fdc\u7a0b\u548c\u9b54\u6cd5\u7ecf\u9a8c\u768415%\u548c12%\u83b7\u5f97\u653b\u51fb\u7ecf\u9a8c\uff0c\u4ee5\u4f7f\u5176\u5177\u5907\u53ef\u884c\u6027\u3002\u653b\u51fb\u7ecf\u9a8c\u6bd4\u7387\u57fa\u4e8e\u6392\u884c\u699c\u6570\u636e\uff0c\u4ee5\u5141\u8bb8\u603b\u7ecf\u9a8c\u8d76\u4e0a\u8fd1\u6218\u3002</li>\n\t\t\t\t\t\t<li>\u9b54\u6cd5\u6280\u80fd\u7684\u6bcf\u7ea7\u4f24\u5bb3\u589e\u957f\u6bd4\u4f8b\u964d\u4f4e\u81f3\u6bcf\u7ea70.5%\u3002</li>\n\t\t\t\t\t\t<li>\u4e3a\u8fdc\u7a0b\u548c\u9b54\u6cd5\u88c5\u5907\u6dfb\u52a0\u4e86\u989d\u5916\u7684\u5956\u52b1\uff0c\u4ee5\u4fdd\u6301\u4e0e\u4e4b\u524d\u76f8\u4f3c\u7684\u4f24\u5bb3\u8f93\u51fa\u3002</li>\n\t\t\t\t\t\t<li>\u91cd\u76fe\u91cd\u505a\u5e76\u663e\u8457\u63d0\u9ad8\u4e86\u4f24\u5bb3\uff0c\u4ee5\u66f4\u63a5\u8fd1\u5176\u4ed6\u6218\u6597\u98ce\u683c\u7684\u8f93\u51fa\u3002</li>\n\t\t\t\t\t\t<li>\u5149\u73af\u7cfb\u7edf\u91cd\u505a\uff0c\u65b0\u589e\u57fa\u4e8e\u4e13\u4e1a\u7b49\u7ea7\u7684\u589e\u957f\u673a\u5236\uff0c\u5e76\u901a\u8fc7\u6280\u80fd\u4e66\u63d0\u4f9b\u4e00\u6b21\u6027\u7ecf\u9a8c\u9000\u6b3e\u3002</li>\n\t\t\t\t\t\t<li>\u65b0\u7684\u6218\u6597\u7ecf\u9a8c\u7cfb\u7edf\u4e0e\u51fb\u8d25\u7684\u602a\u7269\u76f8\u5173\u8054\uff0c\u62a4\u7b26\u5141\u8bb8\u4f60\u5c06\u8bad\u7ec3\u7ecf\u9a8c\u5206\u914d\u5230\u7279\u5b9a\u4e13\u4e1a\u4e0a\u3002</li>\n\t\t\t\t\t</ol>\n\t\t\t\t\t<br />\n\t\t\t\t\t\u968f\u7740\u6218\u6597\u91cd\u505a\uff0c\u6211\u4eec\u8fd8\u5f15\u5165\u4e86\u989d\u5916\u7684\u6218\u6597\u96be\u5ea6\u7b49\u7ea7\u3002\u6218\u6597\u533a\u57df\u96be\u5ea6\u73b0\u5728\u4eceT0\u5230T5\uff0c\u5e76\u4e14\u65b0\u7684\u62a4\u7b26\u53ef\u4ee5\u5728\u66f4\u9ad8\u96be\u5ea6\u7684\u533a\u57df\u4e2d\u627e\u5230\u3002T1\u548cT2\u5730\u7262\u4e5f\u5df2\u6dfb\u52a0\uff0c\u53ef\u4ee5\u83b7\u5f97\u7cbe\u70bc\u788e\u7247\u4ee5\u7cbe\u70bc\u4f60\u7684T95\u548c\u80cc\u90e8\u88c5\u5907\u3002\n\t\t\t\t\t<br />\n\t\t\t\t\t<br />\n\t\t\t\t\t\u8bbf\u95ee\u66f4\u65b0\u65e5\u5fd7\u4ee5\u83b7\u53d6\u66f4\u591a\u8be6\u7ec6\u4fe1\u606f\u3002\n\t\t\t \t</div>"
          },
          17476092e5: {
            heading: "\u4e2d\u578b\u66f4\u65b0 - \u54de\u5361\u548c\u5176\u4ed6\u65b0\u95fb",
            content: "<div>\n\t\t\t\t\t\u54de\u5361\u4e0a\u7ebf\u5566\uff01\u8fd9\u662f\u4e00\u9879\u53ef\u9009\u7684\u4f1a\u5458\u7cfb\u7edf\uff0c\u80fd\u5e26\u6765\u4e00\u7cfb\u5217\u5b9e\u7528\u4f46\u5e76\u975e\u5fc5\u8981\u7684\u798f\u5229\uff01\n\t\t\t\t\t\u6240\u6709\u89d2\u8272\u90fd\u53ef\u4ee5\u514d\u8d39\u9886\u53d614\u5929\u54de\u5361\uff0c\u6b64\u5916\u6240\u6709\u73b0\u6709\u89d2\u8272\u8fd8\u989d\u5916\u83b7\u8d60\u4e8614\u5929\u4f7f\u7528\u65f6\u95f4\u3002\n\t\t\t\t\t\u60f3\u4e86\u89e3\u66f4\u591a\u8be6\u60c5\uff0c\u53ef\u4ee5\u67e5\u770b\u66f4\u65b0\u65e5\u5fd7\u6216\u76f4\u63a5\u524d\u5f80\u725b\u94c3\u5546\u5e97\u770b\u770b\u3002\n\t\t\t\t\t<br />\n\t\t\t\t\t<br />\n\t\t\t\t\t\u52a0\u5165\u65b0\u7684\u4ed8\u8d39\u5185\u5bb9\uff0c\u6211\u4eec\u80fd\u7406\u89e3\u5927\u5bb6\u4f1a\u5173\u5fc3\u6e38\u620f\u672a\u6765\u7684\u65b9\u5411\uff0c\u5c24\u5176\u662f\u662f\u5426\u4f1a\u5f71\u54cd\u516c\u5e73\u6027\u3002\n\t\t\t\t\t\u6211\u4eec\u60f3\u518d\u6b21\u660e\u786e: \u6211\u4eec\u6ca1\u6709\u4efb\u4f55\u5f15\u5165\u5f3a\u5236\u6c2a\u91d1\u7684\u6253\u7b97\u3002\n\t\t\t\t\t\u54de\u5361\u7684\u8bbe\u8ba1\u7ecf\u8fc7\u4e86\u5927\u91cf\u73a9\u5bb6\u53cd\u9988\u7684\u53c2\u8003\uff0c\u76ee\u6807\u662f\u8ba9\u5b83\u5bf9\u4ed8\u8d39\u73a9\u5bb6\u548c\u514d\u8d39\u73a9\u5bb6\u90fd\u5b9e\u60e0\u53c8\u53cb\u597d\u3002\n\t\t\t\t\t\u5b83\u4e0d\u8bbe\u4efb\u4f55\u5185\u5bb9\u9650\u5236\uff0c\u4e0d\u4f1a\u5f71\u54cd\u6838\u5fc3\u73a9\u6cd5\u4f53\u9a8c\uff0c\u786e\u4fdd\u6240\u6709\u73a9\u5bb6\u90fd\u80fd\u516c\u5e73\u6e38\u620f\u3002\n\t\t\t\t\t\u540c\u65f6\uff0c\u54de\u5361\u4e3a\u6e38\u620f\u5f15\u5165\u4e86\u6301\u7eed\u4ef7\u503c\uff0c\u8ba9\u725b\u94c3\u7684\u9700\u6c42\u4e0d\u518d\u53ea\u4f9d\u8d56\u4e00\u6b21\u6027\u8d2d\u4e70\u7684\u4fbf\u5229\u529f\u80fd\u6216\u5916\u89c2\u9053\u5177\uff0c\n\t\t\t\t\t\u4ece\u800c\u6709\u52a9\u4e8e Milky Way Idle \u7684\u957f\u671f\u7a33\u5b9a\u53d1\u5c55\u3002\n\t\t\t\t\t<br />\n\t\t\t\t\t<br />\n\t\t\t\t\t\u53e6\u5916\uff0c\u968f\u7740\u73a9\u5bb6\u4eba\u6570\u4e0d\u65ad\u4e0a\u5347\uff0c\u6211\u4eec\u7684\u7ba1\u7406\u56e2\u961f\u4e5f\u9762\u4e34\u4e86\u66f4\u5927\u7684\u6311\u6218\u3002\n\t\t\t\t\t\u76ee\u524d\u7684\u7ba1\u7406\u7cfb\u7edf\u4e3b\u8981\u4f9d\u8d56\u5fd7\u613f\u7ba1\u7406\u5458\u5728\u573a\u65f6\u4e3b\u52a8\u9605\u8bfb\u804a\u5929\u5185\u5bb9\u3002\n\t\t\t\t\t\u4f46\u6211\u4eec\u4e5f\u6536\u5230\u4e86\u4e00\u4e9b\u53cd\u9988\uff0c\u6709\u4eba\u89c9\u5f97\u7ba1\u7406\u8fc7\u4e8e\u4e25\u683c\uff0c\u4e5f\u6709\u4eba\u6307\u51fa\u7ba1\u7406\u5458\u4e0d\u5728\u7ebf\u65f6\u6709\u4e0d\u5f53\u8a00\u8bba\u88ab\u6f0f\u770b\u3002\n\t\t\t\t\t\u4e3a\u6b64\uff0c\u6211\u4eec\u6b63\u5728\u5f00\u53d1\u4e00\u4e2a\u66f4\u4f9d\u8d56\u73a9\u5bb6\u4e3e\u62a5\u7684\u65b0\u7cfb\u7edf\uff0c\n\t\t\t\t\t\u8ba9\u5927\u5bb6\u80fd\u66f4\u4e3b\u52a8\u53c2\u4e0e\u7ba1\u7406\u804a\u5929\u73af\u5883\u3002\n\t\t\t\t\t\u6bd4\u5982\uff0c\u5728\u7ba1\u7406\u5458\u4e0d\u5728\u7ebf\u65f6\uff0c\u82e5\u4e00\u6761\u6d88\u606f\u88ab\u8db3\u591f\u591a\u73a9\u5bb6\u4e3e\u62a5\uff0c\u5c31\u4f1a\u81ea\u52a8\u89e6\u53d1\u5904\u7406\u673a\u5236\u3002\n\t\t\t\t\t\u8fd9\u4e5f\u80fd\u51cf\u8f7b\u7ba1\u7406\u5458\u7684\u8d1f\u62c5\uff0c\u8ba9\u4ed6\u4eec\u4e13\u6ce8\u5904\u7406\u90a3\u4e9b\u5df2\u7ecf\u88ab\u793e\u533a\u6807\u8bb0\u51fa\u6765\u7684\u5185\u5bb9\u3002\n\t\t\t\t\t\u8fd9\u4e2a\u7cfb\u7edf\u9884\u8ba1\u4f1a\u5728\u63a5\u4e0b\u6765\u4e00\u5230\u4e24\u5468\u5185\u4e0a\u7ebf\u3002\n\t\t\t\t\t<br />\n\t\t\t\t\t<br />\n\t\t\t\t\t\u6700\u540e\u518d\u6b21\u63d0\u9192\u5927\u5bb6\uff0c\u8bf7\u9075\u5b88\u5355\u8d26\u53f7\u89c4\u5219\u548c\u7981\u6b62\u901a\u8fc7\u5c0f\u53f7\u6216\u8d22\u5bcc\u8f6c\u79fb\u83b7\u53d6\u4e0d\u6b63\u5f53\u5229\u76ca\u7684\u89c4\u5b9a\u3002\n\t\t\t\t\t\u73b0\u5728\u6709\u5f88\u591a\u65b0\u73a9\u5bb6\u52a0\u5165\uff0c\u53ef\u80fd\u8fd8\u4e0d\u4e86\u89e3\u6211\u4eec\u5bf9\u4e8e\u5c0f\u53f7\u725f\u5229\u6216\u4ece\u91d1\u5546\u624b\u4e2d\u8d2d\u4e70\u91d1\u5e01\u7684\u6001\u5ea6\u3002\n\t\t\t\t\t\u6211\u4eec\u4f1a\u5b9a\u671f\u8fdb\u884c\u5c01\u53f7\u5904\u7406\u3002\u6bd4\u5982\u5728\u8fc7\u53bb\u51e0\u5468\u5185\uff0c\n\t\t\t\t\t\u6211\u4eec\u5bf9550\u591a\u4e2a\u4e3b\u8d26\u53f7\u548c\u6570\u5343\u4e2a\u5c0f\u53f7\u8fdb\u884c\u4e86\u6682\u65f6\u6216\u6c38\u4e45\u5c01\u7981\u3002\n\t\t\t\t\t\u88ab\u6682\u65f6\u5c01\u7981\u7684\u8d26\u53f7\u4e5f\u88ab\u79fb\u9664\u4e862\u52303\u500d\u7684\u4e0d\u6b63\u5f53\u91d1\u5e01\uff0c\u603b\u8ba1\u8d85\u8fc7120B\u91d1\u5e01\u3002\n\t\t\t\t\t\u4f5c\u5f0a\u98ce\u9669\u6781\u9ad8\uff0c\u6839\u672c\u4e0d\u503c\u5f97\u5192\u9669\u3002\u6211\u4eec\u4e5f\u4f1a\u6301\u7eed\u5347\u7ea7\u68c0\u6d4b\u7cfb\u7edf\uff0c\u4fdd\u969c\u516c\u5e73\u7684\u6e38\u620f\u73af\u5883\u3002\n\t\t\t\t</div>"
          },
          17449308e5: {
            heading: "\u5927\u578b\u66f4\u65b0 - \u6d77\u76d7\u57fa\u5730\u5730\u7262\u3001\u7b2c\u56db\u4e2a\u89d2\u8272\u69fd\u4f4d\u548c\u5b9a\u5236\u88c5\u9970\u54c1\u653f\u7b56\u66f4\u65b0",
            content: "<div>\n\t\t\t\t\t\u6d77\u76d7\u57fa\u5730\u5730\u7262\u73b0\u5df2\u5f00\u653e\u63a2\u7d22\uff01\u8fd9\u4e2a\u65b0\u5730\u7262\u6709\u5404\u79cd\u65b0\u7684T95\u6b66\u5668\u548c\u9632\u5177\uff0c\u4ee5\u53ca\u65b0\u7684\u6280\u80fd\u3002\u6211\u4eec\u8fd8\u5bf9\u73b0\u6709\u7269\u54c1\u548c\u6280\u80fd\u8fdb\u884c\u4e86\u4e00\u4e9b\u8c03\u6574\uff0c\u4ee5\u6539\u5584\u6e38\u620f\u5e73\u8861\u6027\u3002\u67e5\u770b\u5b8c\u6574\u7684\u66f4\u65b0\u65e5\u5fd7\u4ee5\u83b7\u53d6\u6240\u6709\u7ec6\u8282\uff01\n\t\t\t\t\t<br />\n\t\t\t\t\t<br />\n\t\t\t\t\t\u53e6\u5916\uff0c\u6211\u4eec\u4e3a\u73a9\u5bb6\u6dfb\u52a0\u4e86\u4e00\u4e2a\u65b0\u7684\u7b2c\u56db\u4e2a\u89d2\u8272\u69fd\u4f4d\uff0c\u5141\u8bb8\u6bcf\u4e2a\u4eba\u6700\u591a\u62e5\u67091\u4e2a\u6807\u51c6\u89d2\u8272\u548c3\u4e2a\u94c1\u725b\u89d2\u8272\u3002\n\t\t\t\t\t<br />\n\t\t\t\t\t<br />\n\t\t\t\t\t\u6211\u4eec\u8fd8\u66f4\u65b0\u4e86\u6211\u4eec\u7684\u5b9a\u5236\u88c5\u9970\u54c1\u653f\u7b56\u548c\u5b9a\u4ef7\u3002\u867d\u7136\u8fd9\u4e2a\u529f\u80fd\u6700\u521d\u662f\u4f5c\u4e3a\u4e00\u4efd\u5c0f\u793c\u7269\uff0c\u7528\u6765\u8868\u8fbe\u6211\u4eec\u5bf9\u652f\u6301\u8005\u7684\u611f\u8c22\uff0c\u4f46\u968f\u7740\u73a9\u5bb6\u6570\u91cf\u7684\u5927\u5e45\u589e\u52a0\uff0c\u8fd9\u9879\u5de5\u4f5c\u5df2\u7ecf\u53d8\u5f97\u96be\u4ee5\u627f\u53d7\u3002\u8fc7\u53bb\u4e00\u4e2a\u6708\u6211\u4eec\u82b1\u4e86\u5927\u7ea6150\u5230200\u5c0f\u65f6\u5904\u7406\u4e86\u7ea6100\u4e2a\u8bf7\u6c42\uff0c\u6211\u4eec\u9700\u8981\u817e\u51fa\u66f4\u591a\u65f6\u95f4\u7528\u4e8e\u5176\u4ed6\u5f00\u53d1\u4efb\u52a1\u3002\u4ece5\u67081\u65e5\u8d77\uff0c\u7533\u8bf7\u81ea\u5b9a\u4e49\u5916\u89c2\u5c06\u9700\u8981\u6d88\u8017\u652f\u6301\u8005\u79ef\u5206\u548c\u725b\u94c3\u3002\u6240\u6709\u57284\u6708\u5e95\u524d\u63d0\u4ea4\u7684\u8bf7\u6c42\uff0c\u4ecd\u5c06\u6309\u7167\u4e4b\u524d\u7684\u652f\u6301\u8005\u79ef\u5206\u8981\u6c42\u8fdb\u884c\u5904\u7406\u3002\n\t\t\t\t</div>"
          },
          17348256e5: {
            heading: "\u6280\u827a\u62d3\u5c55\u7b2c\u4e8c\u90e8\u5206 - \u661f\u7a7a\u5de5\u5177\u548c\u6280\u827a\u670d\u88c5",
            content: "<div>\n\t\t\t\t\t\u6211\u4eec\u5f88\u9ad8\u5174\u5730\u63a8\u51fa\u6280\u827a\u62d3\u5c55\u7684\u7b2c\u4e8c\u90e8\u5206-\u661f\u7a7a\u5de5\u5177\u4e0e\u6280\u827a\u670d\u88c5\uff01\u5728\u4f7f\u7528\u795e\u5723\u5de5\u5177\u8fd9\u4e48\u957f\u7684\u65f6\u95f4\u4ee5\u6765\uff0c\u4e13\u7cbe\u7684\u73a9\u5bb6\u4eec\u7ec8\u4e8e\u53c8\u80fd\u83b7\u5f97\u8fdb\u4e00\u6b65\u7684\u88c5\u5907\u5347\u7ea7\u4e86\uff01\u8fd9\u4e9b\u65b0\u7269\u54c1\u5e76\u4e0d\u5bb9\u6613\u83b7\u5f97\uff0c\u4f46\u5bf9\u4e8e\u8db3\u591f\u52e4\u594b\uff08\u6216\u5bcc\u6709\uff09\u7684\u73a9\u5bb6\u6765\u8bf4\uff0c\u6210\u529f\u83b7\u53d6\u5b83\u4eec\u5c06\u5e26\u6765\u663e\u8457\u7684\u63d0\u5347\u3002\u6295\u8eab\u5176\u4e2d\uff0c\u5c06\u4f60\u7684\u6280\u827a\u63a8\u5411\u65b0\u4e00\u6ce2\u7684\u9ad8\u5cf0\u5427\uff01\n\t\t\t\t</div>"
          }
        },
        patchNotesPanel: {
          patchNotes: "\u66f4\u65b0\u65e5\u5fd7"
        },
        patchNotesText: {
          1755558e6: {
            heading: "\u5927\u578b\u66f4\u65b0 - \u6218\u6597\u91cd\u505a\u3001\u62a4\u7b26\u548c\u7cbe\u70bc\u88c5\u5907",
            content: "<div>\n\t\t\t\t\t\u6218\u6597\u91cd\u505a\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6240\u6709\u6218\u6597\u98ce\u683c\u73b0\u5728\u90fd\u9700\u8981\u4f9d\u9760\u653b\u51fb\u4e13\u4e1a\u6765\u63d0\u5347\u7cbe\u51c6\u5ea6\u3002\n\t\t\t\t\t\t\t\u73a9\u5bb6\u5c06\u7acb\u5373\u83b7\u5f97\u76f8\u5f53\u4e8e\u5176\u73b0\u6709\u8fdc\u7a0b\u7ecf\u9a8c\u768415%\u548c\u9b54\u6cd5\u7ecf\u9a8c\u768412%\u7684\u653b\u51fb\u7ecf\u9a8c\u3002\n\t\t\t\t\t\t\t\u6b64\u8c03\u6574\u57fa\u4e8e\u6392\u884c\u699c\u6570\u636e\uff0c\u4ee5\u786e\u4fdd\u4e09\u79cd\u6218\u6597\u98ce\u683c\u4e4b\u95f4\u7684\u603b\u7ecf\u9a8c\u53ef\u6bd4\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u8fdc\u7a0b\u4e13\u4e1a\u7684\u9b54\u6cd5\u95ea\u907f\u52a0\u6210\u548c\u9b54\u6cd5\u4e13\u4e1a\u7684\u6297\u6027\u52a0\u6210\u5df2\u88ab\u79fb\u81f3\u9632\u5fa1\u4e13\u4e1a\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u529b\u91cf\u66f4\u540d\u4e3a\u8fd1\u6218\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u541b\u738b\u4e4b\u5251\u73b0\u5728\u53ef\u4ee5\u4e3a\u961f\u53cb\u683c\u6321\u4f24\u5bb3\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u75ab\u75c5\u5c04\u51fb\u5df2\u88ab\u91cd\u65b0\u8bbe\u8ba1\u4e3a\u524a\u5f31\u62a4\u7532/\u6297\u6027\uff0c\u800c\u4e0d\u662fHP/MP\u6062\u590d\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u8fdc\u7a0b\u88c5\u5907\u5df2\u6dfb\u52a0\u66b4\u51fb\u7387\u548c\u5176\u4ed6\u589e\u76ca\uff0c\u4ee5\u5f25\u8865\u7cbe\u51c6\u5ea6\u635f\u5931\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u9b54\u6cd5\u4f24\u5bb3\u6280\u80fd\u73b0\u5728\u6bcf\u4e2a\u6280\u80fd\u7b49\u7ea7\u7684\u6210\u957f\u4e3a0.5%\uff0c\u800c\u4e0d\u662f1%\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6d9f\u6f2a\u4e09\u53c9\u621f\u73b0\u5728\u5728\u6d9f\u6f2a\u6fc0\u6d3b\u65f6\u6062\u590d10MP\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6280\u80fd\u4f24\u5bb3\u548c\u5176\u4ed6\u589e\u76ca\u5df2\u88ab\u6dfb\u52a0\u5230\u9b54\u6cd5\u88c5\u5907\u4e2d\uff0c\u4ee5\u5f25\u8865\u7cbe\u51c6\u5ea6\u635f\u5931\u548c\u6280\u80fd\u6210\u957f\u964d\u4f4e\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u91cd\u76fe\uff1a\n\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u91cd\u76fe\u5df2\u88ab\u91cd\u65b0\u8bbe\u8ba1\u5e76\u6dfb\u52a0\u4e86\u4e00\u4e2a\u65b0\u7684\u5c5e\u6027\uff0c\u9632\u5fa1\u4f24\u5bb3\uff0c\u663e\u8457\u63d0\u9ad8\u5176\u8f93\u51fa\u4f24\u5bb3\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u5c16\u523a\u5916\u58f3\u5df2\u88ab\u91cd\u65b0\u8bbe\u8ba1\u4e3a\u540c\u65f6\u5305\u542b\u7269\u7406\u548c\u5143\u7d20\u8346\u68d8\uff0c\u57fa\u4e8e\u9632\u5fa1\u4f24\u5bb3\u548c\u62a4\u7532/\u6297\u6027\u7684\u53cc\u91cd\u5c5e\u6027\u8fdb\u884c\u52a0\u6210\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u5965\u672f\u53cd\u5c04\u5df2\u88ab\u8f6c\u6362\u4e3a\u60e9\u6212\uff0c\u8d4b\u4e88\u53cd\u4f24\u589e\u76ca\uff0c\u5c06\u4e00\u5b9a\u6bd4\u4f8b\u7684\u5373\u5c06\u5230\u6765\u7684\u4f24\u5bb3\u53cd\u5c04\u4e3a\u949d\u51fb\u653b\u51fb\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u76fe\u51fb\u7684\u62a4\u7532\u52a0\u6210\u5df2\u4ece60%\u63d0\u9ad8\u523070%\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u5149\u73af\uff1a\n\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u6c34\u548c\u706b\u5149\u73af\u5df2\u8f6c\u6362\u4e3a\u5143\u7d20\u5149\u73af\uff0c\u4e3a\u6240\u6709\u5143\u7d20\u63d0\u4f9b\u589e\u5e45\u52a0\u6210\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u81ea\u7136\u5149\u73af\u5df2\u8f6c\u6362\u4e3a\u5b88\u62a4\u5149\u73af\uff0c\u8d4b\u4e88\u6cbb\u7597\u589e\u5e45\u3001\u95ea\u907f\u3001\u62a4\u7532\u548c\u6297\u6027\u3002\u5b88\u62a4\u5149\u73af\u6682\u65f6\u53ef\u901a\u8fc7\u5546\u5e97\u6362\u6210\u5143\u7d20\u5149\u73af\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u57fa\u7840\u5149\u73af\u5c5e\u6027\u5df2\u88ab\u8c03\u6574\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u6bcf\u4e2a\u5149\u73af\u73b0\u5728\u8fd8\u4f1a\u6839\u636e\u65bd\u6cd5\u8005\u7684\u5bf9\u5e94\u6280\u80fd\u8fdb\u884c\u989d\u5916\u52a0\u6210:\n\t\t\t\t\t\t\t\t\t\u901f\u5ea6\u5149\u73af \u2192 \u653b\u51fb\uff0c\u5b88\u62a4\u5149\u73af \u2192 \u9632\u5fa1\uff0c\u7269\u7406\u5149\u73af \u2192 \u8fd1\u6218\uff0c\u66b4\u51fb\u5149\u73af \u2192 \u8fdc\u7a0b\uff0c\u5143\u7d20\u5149\u73af \u2192 \u9b54\u6cd5\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u84dd\u6280\u80fd\u7ecf\u9a8c\u5c06\u4ee5\u6bcf500\u70b9\u7ecf\u9a8c1\u672c\u4e66\u7684\u6bd4\u4f8b\u8f6c\u6362\u4e3a\u4e66\u7c4d\u3002\n\t\t\t\t\t\t\t\t\t\u4efb\u4f55\u4f4e\u4e8e500\u7684\u5269\u4f59\u7ecf\u9a8c\u5c06\u4fdd\u7559\u5728\u8be5\u6280\u80fd\u4e0a\u3002\n\t\t\t\t\t\t\t\t\t\u8fd9\u662f\u4e00\u9879\u4e00\u6b21\u6027\u7684\u8f6c\u6362\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u73b0\u5728\u6839\u636e\u51fb\u8d25\u7684\u602a\u7269\u56fa\u5b9a\u7ed9\u4e88\u6218\u6597\u7ecf\u9a8c\u503c\uff0c\u6218\u6597\u6301\u7eed\u65f6\u95f4\u8d8a\u957f\uff0c\u751f\u5b58\u7ecf\u9a8c\u5956\u52b1\u8d8a\u9ad8\u3002\n\t\t\t\t\t\t\t30%\u7684\u7ecf\u9a8c\u503c\u4f1a\u5206\u914d\u7ed9\u7531\u4f60\u7684\u6b66\u5668\u51b3\u5b9a\u7684\u4e3b\u8981\u8bad\u7ec3\u4e13\u4e1a\u3002\n\t\t\t\t\t\t\t\u5269\u4f59\u768470%\u7ecf\u9a8c\u53ef\u4ee5\u901a\u8fc7\u65b0\u7684\u62a4\u7b26\u88c5\u5907\u6765\u9009\u62e9\u5206\u914d\u3002\n\t\t\t\t\t\t\t\u8be5\u7cfb\u7edf\u5141\u8bb8\u73a9\u5bb6\u4f18\u5316\u4ed6\u4eec\u5728\u4e13\u4e1a\u4e0a\u7684\u7ecf\u9a8c\u5206\u914d\u3002\n\t\t\t\t\t\t\t\u7ecf\u9a8c\u503c\u6bd4\u7387\u7ecf\u8fc7\u5e73\u8861\uff0c\u73a9\u5bb6\u53ef\u4ee5\u5728\u4e3b\u8981\u4e13\u4e1a\u4e0a\u83b7\u5f97\u66f4\u591a\u7ecf\u9a8c\uff0c\u4f46\u603b\u4f53\u4e0a\u53ef\u80fd\u83b7\u5f97\u7684\u603b\u7ecf\u9a8c\u503c\u4f1a\u51cf\u5c11\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u602a\u7269\u4e0d\u518d\u5177\u6709\u57fa\u7840HP/MP\u6062\u590d\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u602a\u7269\u73b0\u5728\u6bcf\u8fc73\u5206\u949f\u4f1a\u83b7\u5f97\u66b4\u8d70\u589e\u76ca\uff0c\u589e\u52a010%\u7684\u7cbe\u51c6\u5ea6\u548c\u4f24\u5bb3\uff08\u6700\u591a\u53e0\u52a010\u6b21\uff09\u3002\n\t\t\t\t\t\t\tBOSS\u7684\u66b4\u8d70\u8ba1\u65f6\u4e3a10\u5206\u949f\uff0c\u800c\u975e3\u5206\u949f\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u90e8\u5206\u602a\u7269\u5c5e\u6027\u5df2\u8c03\u6574\u4ee5\u9002\u5e94\u4e0a\u8ff0\u6539\u52a8\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6218\u6597\u7b49\u7ea7\u516c\u5f0f\u5df2\u66f4\u65b0\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u7ec4\u961f\u6218\u6597\u7684\u7ecf\u9a8c\u73b0\u5728\u4f1a\u5728\u6240\u6709\u961f\u5458\u95f4\u5e73\u5747\u5206\u914d\uff0c\u4e0e\u9020\u6210\u4f24\u5bb3\u591a\u5c11\u65e0\u5173\u3002  \n\t\t\t\t\t\t\t\u82e5\u961f\u5458\u7684\u6218\u6597\u7b49\u7ea7\u6bd4\u961f\u4f0d\u6700\u9ad8\u8005\u4f4e\u81f3\u5c11 20%\uff0c\u5c06\u4f1a\u83b7\u5f97\u7ecf\u9a8c\u4e0e\u6389\u843d\u60e9\u7f5a\uff0c\u6bcf\u8d85\u8fc71%\u7684\u7b49\u7ea7\u5dee\u989d\u5916\u589e\u52a03%\u60e9\u7f5a\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6240\u6709\u6218\u6597\u98ce\u683c\u7684\u4f24\u5bb3\u548c\u7ecf\u9a8c\u83b7\u53d6\u901f\u7387\u5df2\u8fdb\u884c\u5e73\u8861\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t\t\u529f\u80fd\u548c\u5185\u5bb9:\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6218\u6597\u533a\u57df\u73b0\u5728\u5177\u6709\u53ef\u9009\u7684\u96be\u5ea6\u7b49\u7ea7\uff0c\u4eceT0\u5230T5\u3002\n\t\t\t\t\t\t\tT0\u5bf9\u5e94\u4e8e\u4e4b\u524d\u7684\u666e\u901a\u533a\u57df\uff0c\u800cT2\u7565\u9ad8\u4e8e\u4e4b\u524d\u7684\u7cbe\u82f1\u533a\u57df\u3002\n\t\t\t\t\t\t\t\u66f4\u9ad8\u7684\u96be\u5ea6\u63d0\u4f9b\u989d\u5916\u7684\u7ecf\u9a8c\u3001\u589e\u52a0\u6389\u843d\u548c\u4e00\u4e9b\u72ec\u7279\u7684\u6389\u843d\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u62a4\u7b26:\n\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u62a4\u7b26\u662f\u4e00\u79cd\u65b0\u88c5\u5907\uff0c\u53ef\u4ee5\u88c5\u5907\u5728\u62a4\u7b26\u69fd\u4e2d\uff0c\u4e3a\u7279\u5b9a\u4e13\u4e1a\u63d0\u4f9b\u989d\u5916\u7ecf\u9a8c\u3002\n\t\t\t\t\t\t\t\t\t\u5b83\u4eec\u8fd8\u53ef\u4ee5\u7528\u4e8e\u5728\u6218\u6597\u4e2d\u5c06\u7ecf\u9a8c\u96c6\u4e2d\u5230\u8be5\u4e13\u4e1a\u4e0a\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u5b9e\u4e60\u62a4\u7b26\u53ef\u4ee5\u5728\u5546\u5e97\u4ee5250K\u8d2d\u4e70\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u66f4\u9ad8\u7b49\u7ea7\u7684\u975e\u6218\u6597\u62a4\u7b26\u53ef\u4ee5\u4f7f\u7528\u4e13\u4e1a\u7cbe\u534e\u5236\u4f5c\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u66f4\u9ad8\u7b49\u7ea7\u7684\u6218\u6597\u62a4\u7b26\u53ef\u4ee5\u4ece\u66f4\u9ad8\u7b49\u7ea7\u7684\u6218\u6597\u533a\u57df\u83b7\u5f97\u6389\u843d\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u62a4\u7b26\u53ef\u4ee5\u4f7f\u7528\u5236\u4f5c\u4e13\u4e1a\u5408\u5e76\u4e3a\u66f4\u9ad8\u7b49\u7ea7\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u62a4\u7b26\u53ef\u4ee5\u88ab\u5f3a\u5316\uff0c\u5e76\u50cf\u5176\u4ed6\u9996\u9970\u4e00\u6837\u63d0\u4f9b5\u500d\u7684\u6b63\u5e38\u5f3a\u5316\u5956\u52b1\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u5730\u4e0b\u57ce\u73b0\u5728\u5177\u6709\u66f4\u9ad8\u7684\u96be\u5ea6\u7b49\u7ea7\uff0c\u6700\u9ad8\u53ef\u8fbeT2\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u7cbe\u70bc:\n\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\tT1\u548cT2\u5730\u4e0b\u57ce\u6389\u843d\u7cbe\u70bc\u5b9d\u7bb1\uff0c\u4f7f\u7528\u76f8\u540c\u7684\u5b9d\u7bb1\u94a5\u5319\u6253\u5f00\u4ee5\u83b7\u5f97\u7cbe\u70bc\u788e\u7247\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u7cbe\u70bc\u788e\u7247\u53ef\u7528\u4e8e\u5347\u7ea7\u6765\u81ea\u5404\u81ea\u5730\u4e0b\u57ce\u768495\u7ea7\u88c5\u5907\u548c\u80cc\u90e8\u88c5\u5907\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u7cbe\u70bc\u88c5\u5907\u63d0\u4f9b+5%\u7684\u989d\u5916\u5c5e\u6027\uff08\u80cc\u90e8\u88c5\u5907\u4e3a+10%\uff09\u5e76\u589e\u52a0\u6b66\u5668\u7279\u6b8a\u6548\u679c\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u7cbe\u70bc\u73b0\u6709\u7269\u54c1\u5c06\u8f6c\u79fb100%\u7684\u5f3a\u5316\u7b49\u7ea7\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u5bf9+11\u53ca\u4ee5\u4e0a\u7684\u5f3a\u5316\u6bd4\u4f8b\u8fdb\u884c\u4e86\u9002\u5ea6\u63d0\u9ad8\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u5df2\u6dfb\u52a0\u652f\u6301\u8005\u804a\u5929\u56fe\u6807\uff08\u4e0d\u540c\u7b49\u7ea7\u7684\u725b\u94c3\uff09\u5230\u725b\u94c3\u5546\u5e97\u3002\n\t\t\t\t\t\t\t\u5b83\u4eec\u53ef\u4ee5\u7528\u652f\u6301\u8005\u79ef\u5206\u8d2d\u4e70\uff0c\u5e76\u5c06\u663e\u793a\u4e3a\u7279\u6b8a\u7684\u7b2c\u4e8c\u4e2a\u56fe\u6807\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u57fa\u7840\u914d\u88c5\u69fd\u6570\u91cf\u4ece2\u589e\u52a0\u52303\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t\t\u5176\u4ed6:\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u5b98\u65b9\u5e02\u573a\u6570\u636e\u73b0\u5728\u6bcf\u5c0f\u65f6\u66f4\u65b0\uff0c\u800c\u4e0d\u662f\u6bcf6\u5c0f\u65f6\u66f4\u65b0\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t</div>"
          },
          17492508e5: {
            heading: "\u4e2d\u578b\u66f4\u65b0 - \u804a\u5929\u4e3e\u62a5\u7cfb\u7edf\u548c\u4f53\u9a8c\u4f18\u5316",
            content: '<div>\n\t\t\t\t\t\u529f\u80fd\u548c\u5185\u5bb9:\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u804a\u5929\u4e3e\u62a5\u7cfb\u7edf: \u73a9\u5bb6\u73b0\u5728\u53ef\u4ee5\u4e3e\u62a5\u804a\u5929\u4e2d\u7684\u8fdd\u89c4\u6d88\u606f\u3002\n\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u4e3e\u62a5\u5c06\u53d1\u9001\u7ed9\u7ba1\u7406\u5458\u8fdb\u884c\u5ba1\u6838\uff0c\u5e76\u53ef\u80fd\u91c7\u53d6\u76f8\u5e94\u5904\u7406\u63aa\u65bd\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u5982\u679c\u6d88\u606f\u6536\u5230\u8db3\u591f\u6570\u91cf\u7684\u4e3e\u62a5\uff0c\u7cfb\u7edf\u53ef\u80fd\u4f1a\u81ea\u52a8\u8fdb\u884c\u5904\u7406\u3002\u7ecf\u4eba\u5de5\u590d\u6838\u540e\uff0c\u76f8\u5173\u5904\u7f5a\u53ef\u80fd\u4f1a\u88ab\u8c03\u6574\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u53d1\u9001\u6b63\u786e\u7684\u4e3e\u62a5\u5c06\u589e\u52a0\u4f60\u672a\u6765\u4e3e\u62a5\u7684\u6743\u91cd\uff0c\u800c\u9519\u8bef\u7684\u4e3e\u62a5\u5c06\u663e\u8457\u964d\u4f4e\u6743\u91cd\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u73b0\u5728\u53ef\u4ee5\u5728\u8bbe\u7f6e\u4e2d\u5220\u9664\u89d2\u8272\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6dfb\u52a0\u4e86\u7279\u6b8a\u56fe\u6807(\u8d21\u732e\u8005\u3001BUG\u53d1\u73b0\u8005\u7b49)\uff0c\u53ef\u4ee5\u6388\u4e88\u5bf9\u6e38\u620f\u6709\u8f83\u5927\u8d21\u732e\u7684\u73a9\u5bb6\u3002\u5b83\u4eec\u5c06\u663e\u793a\u4e3a\u7b2c\u4e8c\u4e2a\u56fe\u6807\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t\t\u4f53\u9a8c\u4f18\u5316:\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u73b0\u5728\u53ef\u4ee5\u91cd\u65b0\u6392\u5e8f\u884c\u52a8\u961f\u5217\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u73b0\u5728\u53ef\u4ee5\u5728\u804a\u5929\u4e2d\u94fe\u63a5\u5e02\u573a\u6302\u724c\u3002\u8fd9\u5e94\u8be5\u6539\u5584\u4e0d\u540c\u8bed\u8a00\u7684\u4ea4\u6613\u9891\u9053\u4f53\u9a8c\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t\t\u5176\u4ed6:\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u6dfb\u52a0\u4e86\u5b98\u65b9\u5e02\u573a\u6570\u636e\uff0c\u53ef\u4ee5\u5728 <a href="https://www.milkywayidle.com/game_data/marketplace.json" target="_blank">https://www.milkywayidle.com/game_data/marketplace.json</a> \u8bbf\u95ee\u3002\n\t\t\t\t\t\t\t\u6b64\u6570\u636e\u6bcf6\u5c0f\u65f6\u66f4\u65b0\u4e00\u6b21(\u6709\u4e00\u5b9a\u7684\u968f\u673a\u6027\u548c\u5ef6\u8fdf\u4ee5\u9632\u6b62\u64cd\u7eb5)\uff0c\u5305\u542b\u6bcf\u4e2a\u7269\u54c1\u5f53\u65f6\u7684\u6700\u9ad8\u51fa\u4ef7\u548c\u6700\u4f4e\u8981\u4ef7\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u4ece\u804a\u5929\u4e2d\u79fb\u9664\u4e86 @mod \u547d\u4ee4\uff0c\u56e0\u4e3a\u5b83\u4e0d\u518d\u9700\u8981\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u670d\u52a1\u5668\u4f18\u5316\u4ee5\u6539\u5584\u540e\u7aef\u6027\u80fd\uff0c\u5e2e\u52a9\u652f\u6301\u66f4\u591a\u73a9\u5bb6\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t</div>'
          },
          17476092e5: {
            heading: "\u4e2d\u578b\u66f4\u65b0 - \u54de\u5361\u548c\u5176\u4ed6\u6539\u8fdb",
            content: "<div>\n\t\t\t\t\t\u529f\u80fd\u548c\u5185\u5bb9:\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u54de\u5361: \u53ef\u9009\u7684\u4f1a\u5458\u8d44\u683c\uff0c\u63d0\u4f9b\u8bb8\u591a\u6709\u7528\u4f46\u975e\u5fc5\u8981\u7684\u7279\u6743\u3002\n\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u53ef\u4ee5\u5728\u725b\u94c3\u5546\u5e97\u4f7f\u7528\u725b\u94c3\u6216\u73b0\u5b9e\u8d27\u5e01\u8d2d\u4e70\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u6240\u6709\u89d2\u8272\u53ef\u4ee5\u514d\u8d39\u9886\u53d614\u5929\u7684\u54de\u5361\u3002\u6240\u6709\u73b0\u6709\u89d2\u8272\u989d\u5916\u83b7\u5f9714\u5929\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t+5% \u7ecf\u9a8c\u589e\u76ca\u3002\u4ec5\u9650\u6807\u51c6\u89d2\u8272\uff0c\u4ee5\u5141\u8bb8\u94c1\u725b\u89d2\u8272\u4e0d\u53d7\u4ed8\u8d39\u5185\u5bb9\u7684\u663e\u8457\u5f71\u54cd\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t+10 \u5c0f\u65f6\u79bb\u7ebf\u8fdb\u5ea6\u9650\u5236\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t+6 \u5e02\u573a\u6302\u724c\u9650\u5236\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t+1 \u884c\u52a8\u961f\u5217\u9650\u5236\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t+8 \u4efb\u52a1\u69fd\u9650\u5236\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t+1 \u514d\u8d39\u4efb\u52a1\u91cd\u7f6e\uff08\u6bcf\u4e2a\u4efb\u52a1\uff09\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u6389\u843d\u8bb0\u5f55: \u8fc7\u53bb20\u6b21\u6d3b\u52a8\u7684\u6389\u843d\u8bb0\u5f55\u3002\u4f60\u53ef\u4ee5\u5728\u83dc\u5355\u4e2d\u7684\u725b\u94c3\u5546\u5e97\u4e0b\u65b9\u627e\u5230\u3002\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\u91d1\u8272\u89d2\u8272\u8fb9\u6846\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t\tSteam:\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\u66f4\u65b0\u4e86Steam\u5ba2\u6237\u7aef\uff0c\u5e76\u5c06\u672c\u5730\u4fdd\u5b58\u6570\u636e\u79fb\u52a8\u5230\u66f4\u7a33\u5b9a\u7684\u6587\u4ef6\u4f4d\u7f6e\u3002\n\t\t\t\t\t\t\t\u66f4\u65b0\u540e\u7b2c\u4e00\u6b21\u6253\u5f00\u6e38\u620f\u53ef\u80fd\u9700\u8981\u91cd\u65b0\u767b\u5f55\u548c\u8bbe\u7f6e\u63d2\u4ef6\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n                    \u4f53\u9a8c\u4f18\u5316:\n                    <ol>\n                        <li>\n                            \u5e02\u573a\u5355\u7b14\u6302\u5355\u6700\u9ad8\u4ef7\u683c\u4ece10B\u63d0\u5347\u81f3100B\u3002\n                        </li>\n                        <li>\n                            \u5e02\u573a\u7f29\u5199\u683c\u5f0f\u7684\u4ef7\u683c\u5355\u4f4d (K,M,B,T) \u73b0\u5728\u4f1a\u6309\u5355\u4f4d\u663e\u793a\u4e0d\u540c\u989c\u8272\uff0c\u964d\u4f4e\u770b\u9519\u7684\u98ce\u9669\u3002\n                        </li>\n                        <li>\n                            \u65b0\u589e /r \u804a\u5929\u6307\u4ee4\u7528\u4e8e\u5feb\u901f\u56de\u590d\u6700\u540e\u4e00\u6761\u79c1\u804a\u3002\n                        </li>\n                        <li>\n                           \u5bf9\u91cd\u590d\u5237\u5c4f\u7684\u804a\u5929\u6d88\u606f\uff08\u5355\u4eba\u6216\u591a\u4eba\uff09\u542f\u7528\u66f4\u4e25\u683c\u7684\u4fdd\u62a4\u63aa\u65bd\u3002\n                        </li>\n                    </ol>\n                    \u6f0f\u6d1e\u4fee\u590d:\n                    <ol>\n                        <li>\n                            \u4fee\u590d\u5f3a\u5316\u7cbe\u534e\u6389\u843d\u7387\u6bd4\u663e\u793a\u503c\u4f4e33%\u7684\u95ee\u9898\uff08\u6b64\u524d\u4ec5\u66f4\u65b0\u4e86\u5ba2\u6237\u7aef\u4f46\u9057\u6f0f\u540e\u7aef\uff09\u3002\n                        </li>\n                        <li>\n                            \u4fee\u590d\u91cd\u65b0\u8fdb\u5165\u6e38\u620f\u65f6\u672a\u8bfb\u79c1\u804a\u8ba1\u6570\u4e0d\u663e\u793a\u7684\u95ee\u9898\u3002\n                        </li>\n                        <li>\n                            \u4fee\u590d\u5976\u916a\u953b\u9020\u7c7b\u80f8\u7532\u7684\u81ea\u52a8\u653b\u51fb\u4f24\u5bb3\u52a0\u6210\u6570\u503c\uff0c\u73b0\u4e0e\u817f\u7532\u4e00\u81f4\uff08\u7279\u6b8a\u88c5\u5907\u4e0d\u53d7\u5f71\u54cd\uff09\u3002\n                        </li>\n                        <li>\n                            \u4fee\u6b63\u4e2d\u6587\u961f\u4f0d\u804a\u5929\u94fe\u63a5\u7684\u7ffb\u8bd1\u9519\u8bef\u3002\n                        </li>\n                        <li>\n                            \u79fb\u52a8\u7aef\u6392\u884c\u699c\u6807\u7b7e\u73b0\u652f\u6301\u6362\u884c\u663e\u793a\uff0c\u907f\u514d Steam \u6392\u884c\u699c\u5bfc\u81f4\u754c\u9762\u6ea2\u51fa\u3002\n                        </li>\n                    </ol>\n                    \u5176\u4ed6:\n                    <ol>\n                        <li>\n                            \u79fb\u9664\u9650\u65f6\u5468\u5e74\u5c0f\u7d2b\u725b\u53ca\u539f\u7248\u6770\u745e\u804a\u5929\u56fe\u6807\u3002\n                        </li>\n                        <li>\n                            \u5730\u4e0b\u57ce\u5546\u5e97\u4e2d\u79fb\u9664\u68d5\u8272/\u767d\u8272\u94a5\u5319\u788e\u7247\u5151\u6362 (\u539f\u672c\u5c31\u662f\u4e34\u65f6\u529f\u80fd)\u3002\n                        </li>\n                        <li>\n                            \u5e02\u573a\u7a0e\u7387\u73b0\u5728\u6539\u4e3a\u5411\u4e0a\u53d6\u6574 (\u539f\u4e3a\u5411\u4e0b\u53d6\u6574)\uff0c\u4ee5\u51cf\u5c11\u4f4e\u4ef7\u7269\u54c1\u7684\u5784\u65ad\u4ea4\u6613\u3002\n                        </li>\n                    </ol>\n\t\t\t\t</div>"
          },
          17449308e5: {
            heading: "\u91cd\u8981\u66f4\u65b0 - \u6d77\u76d7\u57fa\u5730\u5730\u7262\u548c\u66f4\u591a\u5185\u5bb9",
            content: '<div>\n\t\t\t\t\u529f\u80fd\u548c\u5185\u5bb9:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6d77\u76d7\u57fa\u5730:\n\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u65b0T95\u9b54\u6cd5\u6b66\u5668: \u6d9f\u6f2a\u4e09\u53c9\u621f\u3001\u7efd\u653e\u4e09\u53c9\u621f\u3001\u70bd\u7130\u4e09\u53c9\u621f\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u65b0T95\u62a4\u7532: \u951a\u5b9a\u80f8\u7532/\u817f\u7532\u3001\u6012\u6d9b\u80f8\u7532/\u817f\u7532\u3001\u514b\u62c9\u80af\u76ae\u8863/\u76ae\u88e4\u3001\u63a0\u593a\u8005\u5934\u76d4\u3001\u795e\u5c04\u62a4\u8155\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u65b0\u6280\u80fd: \u76fe\u51fb(\u4e5f\u6dfb\u52a0\u5230\u5947\u5e7b\u6d1e\u7a74)\u3001\u788e\u88c2\u51b2\u51fb\u3001\u751f\u547d\u5438\u53d6\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u65b0\u70bc\u91d1\u914d\u65b9\u3002\u6240\u6709\u5730\u7262\u6280\u80fd\u4e66\u8f6c\u5316\u7684\u6210\u529f\u7387\u5df2\u7edf\u4e00\u4e3a50%\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ol>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u72c2\u6012\u957f\u67aa: \u65b0\u589eT95\u957f\u67aa\uff0c\u6dfb\u52a0\u5230\u79d8\u6cd5\u5821\u5792\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4f7f\u7528\u751f\u4ea7\u6280\u80fd\u5347\u7ea7\u88c5\u5907\u65f6\uff0c\u73b0\u5728\u5c06\u4fdd\u755970%\u7684\u5f3a\u5316\u7b49\u7ea7\u3002\u4e00\u4e9bT95\u88c5\u5907\u914d\u65b9\u5df2\u8c03\u6574\u4e3a\u4ece\u8f83\u4f4e\u7ea7\u522b\u7684\u53d8\u4f53\u5347\u7ea7\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u65b0\u589e\u7b2c\u56db\u4e2a\u89d2\u8272\u69fd\u4f4d\u3002\u4f60\u6700\u591a\u53ea\u80fd\u62e5\u67093\u4e2a\u94c1\u725b\u89d2\u8272\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u65b0\u589eSTEAM\u6392\u884c\u699c\uff0c\u9002\u7528\u4e8e\u5728STEAM\u53d1\u5e03\u540e\u521b\u5efa\u7684\u89d2\u8272\uff0c\u5e76\u4e0eSTEAM\u5173\u8054\u3002\u4ec5\u5728\u7b26\u5408\u6761\u4ef6\u7684\u89d2\u8272\u4e0a\u53ef\u89c1\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u516c\u4f1a\u6210\u5458\u69fd\u4f4d\u4ece25+level/4\u589e\u52a0\u523030+level/3\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u88c5\u9970\u54c1:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u8282\u65e5\u9650\u5b9a(\u53d1\u5e03\u4e24\u5e74\u7eaa\u5ff5\u65e5): \u5468\u5e74\u5c0f\u7d2b\u725b\uff0c\u539f\u7248\u6770\u745e\u804a\u5929\u56fe\u6807\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6839\u636e\u5c0f\u90e8\u5206\u5730\u7262BOSS\u6dfb\u52a0\u4e86\u65b0\u7684\u804a\u5929\u56fe\u6807\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6dfb\u52a0\u4e862\u4e2a\u6d77\u76d7\u57fa\u5730\u4e3b\u9898\u5934\u50cf\u548c\u670d\u88c5\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5b9a\u5236\u88c5\u9970\u54c1\u7684\u8981\u6c42\u66f4\u6539\u4e3a\u9700\u8981\u82b1\u8d39\u652f\u6301\u8005\u79ef\u5206\u548c\u725b\u94c3\u3002\n\t\t\t\t\t\t\u7531\u4e8e\u73a9\u5bb6\u4eba\u6570\u7684\u5de8\u5927\u589e\u52a0\uff0c\u6211\u4eec\u65e0\u6cd5\u7ee7\u7eed\u652f\u6301\u5b9a\u5236\u88c5\u9970\u54c1\u4f5c\u4e3a\u793c\u7269\u3002\n\t\t\t\t\t\t\u65b0\u7684\u5b9a\u4ef7\u5c06\u4e8e5\u67081\u65e5\u751f\u6548\u30024\u6708\u5e95\u4e4b\u524d\u53d1\u8d77\u7684\u4efb\u4f55\u8bf7\u6c42\u5c06\u6839\u636e\u4e4b\u524d\u7684\u652f\u6301\u8005\u79ef\u5206\u8981\u6c42\u8fdb\u884c\u5904\u7406\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u5e73\u8861:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u8c03\u6574\u4e86\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319\u548c\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319\u7684\u914d\u65b9\uff0c\u4f7f\u5176\u68d5\u8272\u548c\u767d\u8272\u94a5\u5319\u788e\u7247\u4e92\u6362\u3002\n\t\t\t\t\t\t\u8fd9\u9632\u6b62\u4e86\u79d8\u6cd5\u5821\u5792\u548c\u6d77\u76d7\u57fa\u5730\u5171\u4eab3/4\u7684\u94a5\u5319\u788e\u7247\u3002\n\t\t\t\t\t\t\u4f60\u53ef\u4ee5\u5728\u5730\u7262\u5546\u5e97\u4e34\u65f6\u81ea\u7531\u4ea4\u6362\u68d5\u8272\u548c\u767d\u8272\u94a5\u5319\u788e\u7247\uff0c\u76f4\u5230\u4e0b\u4e00\u4e2a\u6e38\u620f\u66f4\u65b0\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6240\u6709\u8fd1\u6218\u62a4\u7532\u589e\u52a0\u4e86\u81ea\u52a8\u653b\u51fb\u4f24\u5bb3\uff0c\u4ee5\u4f7f\u8fd1\u6218\u4f24\u5bb3\u66f4\u63a5\u8fd1\u5176\u4ed6\u7c7b\u578b\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u589e\u52a0\u4e86\u91cd\u76fe\u7684\u51c6\u786e\u6027\u548c\u4f24\u5bb3\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5728\u5de8\u50cf\u80f8\u7532/\u817f\u7532\u4e0a\u6dfb\u52a0\u4e86\u8fd1\u6218\u51c6\u786e\u6027\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u81f4\u6b8b\u65a9: \u91cd\u65b0\u8bbe\u8ba1\u4e3a\u5bf9\u6240\u6709\u654c\u4eba\u9020\u6210\u4f24\u5bb3\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u8840\u5203\u65a9: \u4f24\u5bb3\u6301\u7eed\u65f6\u95f4\u4ece15\u79d2\u51cf\u5c11\u52309\u79d2\u3002\u53d7\u5230\u7684\u4f24\u5bb3\u51cf\u76ca\u4ece0%\u589e\u52a0\u52308%\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u51b0\u971c\u7206\u88c2: \u95ea\u907f\u51cf\u76ca\u4ece15%\u964d\u4f4e\u523010%\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u706b\u7130\u98ce\u66b4: \u4f24\u5bb3\u6301\u7eed\u65f6\u95f4\u4ece10\u79d2\u51cf\u5c11\u52306\u79d2\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u70df\u7206\u706d\u5f71: \u51c6\u786e\u6027\u51cf\u76ca\u4ece20%\u964d\u4f4e\u523015%\u3002\u95ea\u907f\u51cf\u76ca\u4ece0%\u589e\u52a0\u523015%\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u9b54\u50cf\u6d1e\u7a74: \u602a\u7269\u9632\u5fa1\u7b49\u7ea7\u964d\u4f4e10-20\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u66ae\u5149\u4e4b\u5730: \u602a\u7269\u706b\u7cfb\u6027\u964d\u4f4e20\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\tUI:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6dfb\u52a0\u4e86\u4e00\u4e2a\u65b0\u8bbe\u7f6e\u6765\u9690\u85cf\u82f1\u8bed\u804a\u5929\u7cfb\u7edf\u6d88\u606f\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u961f\u4f0d\u94fe\u63a5\u4e0d\u53ef\u53d1\u5728\u82f1\u8bed\u3001\u4ea4\u6613\u548c\u65b0\u624b\u804a\u5929\u4e2d\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5bf9\u4e00\u4e9b\u4e0d\u9002\u5408\u8bef\u70b9\u51fb\u7684\u6309\u94ae\u6dfb\u52a0\u4e86\u53cc\u91cd\u786e\u8ba4\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5728\u516c\u4f1a\u548c\u597d\u53cb\u5217\u8868\u4e2d\u6dfb\u52a0\u4e86\u4e0d\u6d3b\u8dc3\u5929\u6570\u8ba1\u6570\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u66f4\u6539\u4e86\u70bc\u91d1\u548c\u5f3a\u5316\u7684"\u5f00\u59cb"\u6309\u94ae\u6587\u672c\uff0c\u4f7f\u5176\u66f4\u660e\u663e\u5730\u663e\u793a\u6240\u6267\u884c\u7684\u884c\u52a8\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\tBUG\u4fee\u590d:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5f53\u4f60\u5728\u7269\u54c1\u4e0a\u67093\u4e2a\u672a\u5b8c\u6210\u7684\u6302\u724c\u65f6\uff0c\u4e0d\u8981\u963b\u6b62\u521b\u5efa\u5373\u65f6\u5e02\u573a\u8ba2\u5355\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4fee\u590d\u53ef\u80fd\u5bfc\u81f4\u5c11\u6570\u73a9\u5bb6\u7684\u5728\u670d\u52a1\u5668\u91cd\u542f\u540e\u505c\u6b62\u884c\u52a8\u7684\u95ee\u9898\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4fee\u590d\u4e86\u53ef\u80fd\u5bfc\u81f4\u670d\u52a1\u5668\u5d29\u6e83\u7684\u7f55\u89c1\u9519\u8bef\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u5176\u4ed6:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5c4f\u853d\u89d2\u8272\u5c06\u963b\u6b62\u52a0\u5165\u961f\u4f0d(\u57fa\u4e8e\u961f\u957f)\u548c\u516c\u4f1a\u9080\u8bf7\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u670d\u52a1\u5668\u548c\u5ba2\u6237\u7aef\u4f18\u5316\uff0c\u4ee5\u52a0\u5feb\u670d\u52a1\u5668\u91cd\u542f\u3001\u4efb\u52a1\u751f\u6210\u3001\u6eda\u52a8\u6027\u80fd\u7b49\u901f\u5ea6\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6dfb\u52a0\u4e86\u4e00\u4e2a\u529f\u80fd\uff0c\u5141\u8bb8ADMIN\u53d1\u5e03\u516c\u544a\u680f\u4ee5\u4f20\u8fbe\u91cd\u8981\u6d88\u606f\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u7ffb\u8bd1\u6539\u8fdb\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t</div>'
          },
          17419068e5: {
            heading: "\u5c0f\u578b\u66f4\u65b0 - \u53cd\u6b3a\u8bc8\u63aa\u65bd\u548cBUG\u4fee\u590d",
            content: "<div>\n\t\t\t\t\u53cd\u6b3a\u8bc8:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u7531\u4e8e\u6709\u51e0\u6b21\u76d7\u7528\u4fe1\u7528\u5361\u8d2d\u4e70\u725b\u94c3\u7684\u53d1\u751f\uff0c\u6dfb\u52a0\u4e86\u53cd\u6b3a\u8bc8\u63aa\u65bd\uff0c\u73a9\u5bb6\u9996\u6b21\u8d2d\u4e70\u725b\u94c3\u53ef\u80fd\u4f1a\u89e6\u53d172\u5c0f\u65f6\u7684\u9650\u5236\uff0c\u7981\u6b62\u5728\u5e02\u573a\u4e0a\u51fa\u552e\u725b\u94c3\u888b\u3002\u8d2d\u4e70\u524d\u4f1a\u6536\u5230\u901a\u77e5\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\tBUG\u4fee\u590d:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4fee\u590d\u4e86\u5728\u6781\u5c11\u6570\u60c5\u51b5\u4e0b\uff0c\u73a9\u5bb6\u53ef\u80fd\u4f1a\u5361\u5728\u4e0d\u5b58\u5728\u7684\u961f\u4f0d\u6218\u6597\u884c\u52a8\u4e2d\u7684\u95ee\u9898\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4fee\u590d\u4e86\u4e00\u4e9b\u7269\u54c1\u540d\u79f0\u548c\u76f8\u5e94\u64cd\u4f5c\u4e4b\u95f4\u7684\u7ffb\u8bd1\u4e0d\u4e00\u81f4\u95ee\u9898\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u5176\u4ed6:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u540e\u53f0\u66f4\u6539\u4ee5\u63d0\u9ad8\u6570\u636e\u5e93\u8fde\u63a5\u7a33\u5b9a\u6027\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t</div>"
          },
          17409132e5: {
            heading: "\u91cd\u8981\u66f4\u65b0 - \u4e2d\u56fd\u7ffb\u8bd1\u548c\u4e3aSTEAM\u53d1\u5e03\u7684\u6700\u540e\u51c6\u5907",
            content: "<div>\n\t\t\t\tUI:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6dfb\u52a0\u4e86\u4e2d\u6587\u7ffb\u8bd1\u3002\n\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u8bed\u8a00\u5c06\u6839\u636e\u4f60\u7684\u6d4f\u89c8\u5668\u8bed\u8a00\u81ea\u52a8\u9009\u62e9\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u73a9\u5bb6\u4e5f\u53ef\u4ee5\u5728[\u8bbe\u7f6e]->[\u6e38\u620f]\u6216\u4e3b\u9875\u4e0a\u624b\u52a8\u66f4\u6539\u663e\u793a\u8bed\u8a00\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u4e00\u4e9b\u9879\u76ee\u5c1a\u672a\u7ffb\u8bd1\uff0c\u5305\u62ec\u5927\u90e8\u5206\u65b0\u95fb\u548c\u66f4\u65b0\u65e5\u5fd7\uff0c\u4f7f\u7528\u6761\u6b3e\u548c\u9690\u79c1\u653f\u7b56\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\u5982\u679c\u4f60\u53d1\u73b0\u4efb\u4f55\u7ffb\u8bd1\u95ee\u9898\u6216\u663e\u793a\u6587\u672c\u9519\u8bef\uff0c\u8bf7\u5728Discord\u7684#bug-reports\u9891\u9053\u4e2d\u62a5\u544a\u3002\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ol>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5df2\u66f4\u65b0\u5f39\u7a97\uff0c\u4f7f\u5176\u5728\u6e38\u620f\u5c4f\u5e55\u4e0a\u5c45\u4e2d\u663e\u793a\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u5176\u4ed6:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4ece\u725b\u94c3\u5546\u5e97\u79fb\u9664\u4e86\u6625\u8282\u8282\u65e5\u9650\u5b9a\u88c5\u9970\u7269\u54c1\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5bf9STEAM\u96c6\u6210\u8fdb\u884c\u4e86\u66f4\u591a\u7684\u8c03\u6574\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u9690\u79c1\u653f\u7b56\u5df2\u66f4\u65b0\uff0c\u5305\u62ec\u4f7f\u7528\u5206\u6790\u548c\u8425\u9500cookie\u7684\u6761\u6b3e\u3002\u8fd9\u4f7f\u6211\u4eec\u80fd\u591f\u5728\u5176\u4ed6\u5e73\u53f0\u4e0a\u4e3a\u300a\u94f6\u6cb3\u5976\u725b\u653e\u7f6e\u300b\u8fd0\u884c\u5e7f\u544a\u65f6\u4f18\u5316\u8425\u9500\u6d3b\u52a8\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t</div>"
          },
          17378856e5: {
            heading: "\u5c0f\u578b\u66f4\u65b0",
            content: "<div>\n\t\t\t\t\u6625\u8282:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6625\u8282\u804a\u5929\u56fe\u6807\u3001\u89d2\u8272\u5f62\u8c61\u548c\u670d\u88c5\u5728\u725b\u94c3\u5546\u5e97\u4e2d\u51fa\u552e\uff0c\u6301\u7eed\u5230\u81f3\u5c113\u5468\u540e\u7684\u66f4\u65b0\u3002\u6d3b\u52a8\u7ed3\u675f\u540e\uff0c\u4f60\u4ecd\u7136\u53ef\u4ee5\u7ee7\u7eed\u4f7f\u7528\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u7528\u6237\u754c\u9762:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6bcf25\u7ea7\u4e13\u4e1a\u7b49\u7ea7\uff0c\u4ece100\u7ea7\u5f00\u59cb\uff0c\u53d1\u9001\u7cfb\u7edf\u6d88\u606f\uff0c\u800c\u4e0d\u4ec5\u4ec5\u662f100\u7ea7\u548c125\u7ea7\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u4fee\u590d:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6392\u884c\u699c\u516c\u4f1a\u540d\u79f0\u5e94\u8be5\u662f\u4e0d\u53ef\u70b9\u51fb\u7684\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6539\u8fdb\u804a\u5929\u6d88\u606fURL\u94fe\u63a5\u89e3\u6790\uff0c\u4f7f\u5176\u66f4\u51c6\u786e\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4fee\u590d\u4e86\u6570\u636e\u5e93\u5728\u7ef4\u62a4\u671f\u95f4\u8131\u673a\uff0c\u73a9\u5bb6\u4f1a\u88ab\u767b\u51fa\u7684\u95ee\u9898\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u4fee\u590d\u4e86\u4e00\u4e9b\u7f55\u89c1\u60c5\u51b5\u4e0b\u5bfc\u81f4\u73a9\u5bb6\u6218\u6597\u5728\u79bb\u7ebf\u8fdb\u5ea6\u7528\u5c3d\u540e\u672a\u6b63\u786e\u505c\u6b62\u7684\u95ee\u9898\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t\t\u5176\u4ed6:\n\t\t\t\t<ol>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u6dfb\u52a0\u4e86@mod\u548c@mods\u804a\u5929\u547d\u4ee4\uff0c\u7528\u4e8e\u7d27\u6025\u60c5\u51b5\u901a\u77e5\u7ba1\u7406\u5458\u3002\n\t\t\t\t\t</li>\n\t\t\t\t\t<li>\n\t\t\t\t\t\t\u5728\u540e\u53f0\u5b9e\u65bd\u4e86\u8eab\u4efd\u9a8c\u8bc1\u548c\u652f\u4ed8\u66f4\u6539\uff0c\u4ee5\u652f\u6301\u5373\u5c06\u53d1\u5e03\u7684STEAM\u7248\u672c\u3002\n\t\t\t\t\t</li>\n\t\t\t\t</ol>\n\t\t\t</div>"
          }
        },
        gameGuidePanel: {
          gameGuide: "\u6e38\u620f\u6307\u5357"
        },
        gameGuideContent: {
          faq: "\u5e38\u89c1\u95ee\u9898",
          faqContent: '<heading>\u5e38\u89c4\u95ee\u9898</heading>\n\t\t\t<question>\u95ee: \u79bb\u7ebf\u8fdb\u5ea6\u5982\u4f55\u8fd0\u4f5c?</question>\n\t\t\t<answer>\u7b54: \u5373\u4f7f\u4f60\u5904\u4e8e\u79bb\u7ebf\u72b6\u6001\uff0c\u4f60\u7684\u89d2\u8272\u4e5f\u4f1a\u7ee7\u7eed\u53d6\u5f97\u8fdb\u5c55\u3002\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0c\u65e0\u8bba\u4f55\u65f6\u5173\u95ed\u6d4f\u89c8\u5668\u6216\u79bb\u7ebf\uff0c\u4f60\u90fd\u53ef\u4ee5\u83b7\u5f97\u957f\u8fbe10\u5c0f\u65f6\u7684\u79bb\u7ebf\u8fdb\u5ea6\u3002\u4f60\u8fd8\u53ef\u4ee5\u901a\u8fc7\u725b\u94c3\u5546\u5e97\u63d0\u4f9b\u7684\u4fbf\u5229\u5347\u7ea7\u6765\u5ef6\u957f\u79bb\u7ebf\u65f6\u95f4\u3002</answer>\n\t\t\t<question>\u95ee: \u6211\u53ef\u4ee5\u4ece\u5176\u4ed6\u8bbe\u5907\u767b\u5f55\u5417?</question>\n\t\t\t<answer>\u7b54: \u5982\u679c\u4f60\u5df2\u6ce8\u518c\u5e10\u6237\uff0c\u53ef\u4ee5\u4f7f\u7528\u7535\u5b50\u90ae\u4ef6\u548c\u5bc6\u7801\u4ece\u4efb\u4f55\u8bbe\u5907\u767b\u5f55\u3002\u5982\u679c\u4f60\u4ee5\u6e38\u5ba2\u8eab\u4efd\u73a9\u6e38\u620f\uff0c\u53ef\u4ee5\u5728[\u8bbe\u7f6e]\u4e2d\u627e\u5230\u4f60\u7684\u6e38\u5ba2\u5bc6\u7801\uff0c\u7136\u540e\u7528\u4f60\u7684\u7528\u6237\u540d\u767b\u5f55\u3002</answer>\n\t\t\t<question>\u95ee: \u6211\u53ef\u4ee5\u5728\u6ca1\u6709\u4e92\u8054\u7f51\u8fde\u63a5\u7684\u60c5\u51b5\u4e0b\u73a9\u6e38\u620f\u5417?</question>\n\t\t\t<answer>\u7b54: \u4e0d\u53ef\u4ee5\uff0c\u4f60\u5fc5\u987b\u8fde\u63a5\u5230\u4e92\u8054\u7f51\u624d\u80fd\u73a9\u6e38\u620f\u3002\u4e0d\u8fc7\uff0c\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0c\u4f60\u4ecd\u53ef\u4ee5\u83b7\u5f97\u79bb\u7ebf\u8fdb\u5ea6\uff0c\u6700\u957f\u53ef\u8fbe10\u5c0f\u65f6\u3002\u5982\u679c\u4f60\u4e0d\u60f3\u4e0e\u5176\u4ed6\u73a9\u5bb6\u4e92\u52a8\uff0c\u53ef\u4ee5\u5173\u95ed\u804a\u5929\u9891\u9053\u5e76\u9009\u62e9\u4e0d\u4f7f\u7528\u5e02\u573a\u3002</answer>\n\t\t\t<question>\u95ee: \u6211\u53ef\u4ee5\u66f4\u6539\u6211\u7684\u89d2\u8272\u540d\u79f0\u5417?</question>\n\t\t\t<answer>\u7b54: \u53ef\u4ee5\u3002\u8bf7\u524d\u5f80[\u725b\u94c3\u5546\u5e97]\uff0c\u70b9\u51fb[\u66f4\u6539\u540d\u79f0]\u6765\u66f4\u6539\u4f60\u7684\u540d\u79f0\u3002\u8fd9\u9700\u8981500\u4e2a\u725b\u94c3\u3002</answer>\n\t\t\t<question>\u95ee: \u5982\u4f55\u83b7\u5f97\u804a\u5929\u56fe\u6807\u6216\u540d\u79f0\u989c\u8272?</question>\n\t\t\t<answer>\u7b54: \u53ef\u4ee5\u4f7f\u7528\u725b\u94c3\u4ece[\u725b\u94c3\u5546\u5e97]\u8d2d\u4e70\u804a\u5929\u56fe\u6807\u6216\u540d\u79f0\u989c\u8272\u3002\u4f60\u53ef\u4ee5\u5728[\u8bbe\u7f6e]\u4e2d\u66f4\u6539\u663e\u793a\u7684\u56fe\u6807\u548c\u540d\u79f0\u989c\u8272\u3002</answer>\n\t\t\t<question>\u95ee: \u5982\u4f55\u5411\u5176\u4ed6\u73a9\u5bb6\u53d1\u9001\u7ad9\u5185\u79c1\u4fe1?</question>\n\t\t\t<answer>\u7b54: \u8981\u5411\u5176\u4ed6\u73a9\u5bb6\u53d1\u9001\u79c1\u4eba\u4fe1\u606f\uff0c\u8bf7\u70b9\u51fb\u8be5\u73a9\u5bb6\u4fe1\u606f\u524d\u65b9\u7684\u540d\u79f0\u5e76\u70b9\u51fb[\u79c1\u804a]\u3002\u4f60\u4e5f\u53ef\u4ee5\u4f7f\u7528\u804a\u5929\u547d\u4ee4"/w \u73a9\u5bb6\u540d\u79f0 \u804a\u5929\u5185\u5bb9"\u3002</answer>\n\t\t\t<question>\u95ee: \u5982\u4f55\u5c4f\u853d\u5176\u4ed6\u73a9\u5bb6?</question>\n\t\t\t<answer>\u7b54: \u8981\u5c4f\u853d\u4e00\u540d\u73a9\u5bb6\u5e76\u505c\u6b62\u6536\u5230\u5176\u4efb\u4f55\u4fe1\u606f\uff0c\u8bf7\u70b9\u51fb\u8be5\u73a9\u5bb6\u4fe1\u606f\u524d\u65b9\u7684\u540d\u79f0\u5e76\u9009\u62e9[\u5c4f\u853d]\u3002\u4f60\u4e5f\u53ef\u4ee5\u4f7f\u7528\u804a\u5929\u547d\u4ee4"/block \u73a9\u5bb6\u540d\u79f0"\u3002\u4f60\u53ef\u4ee5\u5728[\u793e\u4ea4]\u83dc\u5355\u4e2d\u627e\u5230\u4f60\u7684\u9ed1\u540d\u5355\uff0c\u7136\u540e\u4ece\u5217\u8868\u89e3\u9664\u5bf9\u73a9\u5bb6\u7684\u5c4f\u853d\u3002</answer>\n\t\t\t<heading>\u6e38\u620f\u73a9\u6cd5</heading>\n\t\t\t<question>\u95ee: \u4ec0\u4e48\u662f\u884c\u52a8\u961f\u5217?</question>\n\t\t\t<answer>\u7b54: \u884c\u52a8\u961f\u5217\u5141\u8bb8\u4f60\u4e3a\u89d2\u8272\u8bbe\u7f6e\u4e00\u8fde\u4e32\u81ea\u52a8\u6267\u884c\u7684\u884c\u52a8\u3002\u8981\u4f7f\u7528\u5b83\uff0c\u8bf7\u70b9\u51fb[\u6dfb\u52a0\u5230\u961f\u5217]\u6309\u94ae\uff0c\u800c\u4e0d\u662f[\u5f00\u59cb]\u6309\u94ae\u3002\u961f\u5217\u69fd\u4f4d\u53ef\u4ee5\u4ece\u725b\u94c3\u5546\u5e97\u89e3\u9501\u6216\u5347\u7ea7\u3002</answer>\n\t\t\t<question>\u95ee: \u4ec0\u4e48\u662f\u725b\u94c3\uff0c\u5982\u4f55\u83b7\u5f97\u66f4\u591a\u7684\u725b\u94c3?</question>\n\t\t\t<answer>\n\t\t\t\t\u7b54: \u725b\u94c3\u662f\u6e38\u620f\u4e2d\u7684\u9ad8\u7ea7\u8d27\u5e01\u3002\u73a9\u5bb6\u53ef\u4ee5\u7528\u725b\u94c3\u8d2d\u4e70\u4fbf\u5229\u5347\u7ea7\u3001\u5916\u89c2\u88c5\u626e\u3001\u793e\u533aBUFF\u548c\u540d\u79f0\u66f4\u6539\u3002\u83b7\u5f97\u725b\u94c3\u6709\u4e09\u79cd\u65b9\u6cd5:\n\t\t\t\t<ul>\n\t\t\t\t\t<li>\u5b8c\u6210\u6559\u7a0b: \u53ef\u4ee5\u83b7\u5f9780\u4e2a\u725b\u94c3\u4f5c\u4e3a\u5956\u52b1\u3002</li>\n\t\t\t\t\t<li>\u7a00\u6709\u6389\u843d: \u5728\u6280\u827a\u8bad\u7ec3\u6216\u4e0e\u654c\u4eba\u6218\u6597\u65f6\uff0c\u6709\u673a\u4f1a\u4ece\u7a00\u6709\u6218\u5229\u54c1\u7bb1\u4e2d\u83b7\u5f97\u725b\u94c3\u3002</li>\n\t\t\t\t\t<li>\u4ece\u725b\u94c3\u5546\u5e97\u8d2d\u4e70: \u4f60\u53ef\u4ee5\u5728\u725b\u94c3\u5546\u5e97\u4e2d\u5145\u503c\u8d2d\u4e70\u725b\u94c3\u6765\u652f\u6301\u6e38\u620f\u3002</li>\n\t\t\t\t\t<li>\u4ece\u5e02\u573a\u8d2d\u4e70: \u4f60\u53ef\u4ee5\u5728\u5e02\u573a\u4e0a\u7528\u91d1\u5e01\u5411\u5176\u4ed6\u73a9\u5bb6\u8d2d\u4e70\u53ef\u4ea4\u6613\u7684\u725b\u94c3\u888b"\u3002</li>\n\t\t\t\t</ul>\n\t\t\t</answer>\n\t\t\t<question>\u95ee: \u4ec0\u4e48\u662f\u7a00\u6709\u6389\u843d?</question>\n\t\t\t<answer>\n\t\t\t\t\u7b54: \u7a00\u6709\u6389\u843d\u662f\u5728\u6e38\u620f\u4e2d\u53c2\u4e0e\u4e0d\u540c\u884c\u52a8\u65f6\u53ef\u4ee5\u83b7\u5f97\u7684\u6218\u5229\u54c1:\n\t\t\t\t<ul>\n\t\t\t\t\t<li>\u91c7\u96c6\u4e13\u4e1a: \u53ef\u4ee5\u83b7\u5f97\u5305\u542b\u661f\u661f\u788e\u7247\u7684\u9668\u77f3\u8231\u3002</li>\n\t\t\t\t\t<li>\u751f\u4ea7\u4e13\u4e1a\u3001\u70bc\u91d1\u548c\u5f3a\u5316: \u53ef\u4ee5\u83b7\u5f97\u5de5\u5320\u5323\uff0c\u91cc\u9762\u6709\u4fdd\u62a4\u788e\u7247\u548c\u5b9d\u77f3\u3002</li>\n\t\t\t\t\t<li>\u6218\u6597:\u53ef\u4ee5\u83b7\u5f97\u88c5\u6709\u5b9d\u77f3\u7684\u5b9d\u7bb1\u3002</li>\n\t\t\t\t</ul>\n\t\t\t\t\u6240\u6709\u7bb1\u5b50\u4e2d\u90fd\u4f1a\u6709\u91d1\u5e01\uff0c\u5076\u5c14\u8fd8\u4f1a\u6709\u725b\u94c3\u3002\u5b8c\u6210\u66f4\u9ad8\u7ea7\u7684\u6280\u827a\u6216\u5bf9\u6218\u66f4\u9ad8\u7ea7\u7684\u654c\u4eba\uff0c\u53ef\u83b7\u5f97\u66f4\u5927\u7684\u5b9d\u7bb1\u3002\n\t\t\t</answer>\n\t\t\t<question>\u95ee: \u5b9d\u77f3\u6709\u4ec0\u4e48\u7528?</question>\n\t\t\t<answer>\u7b54: \u5b9d\u77f3\u53ef\u4ee5\u7528\u6765\u5236\u4f5c\u4e0d\u540c\u7684\u9996\u9970\uff0c\u8fd9\u4e9b\u9996\u9970\u4f1a\u5e26\u6765\u4e00\u4e9b\u52a0\u6210\u3002\u6b64\u5916\uff0c\u8fd8\u53ef\u4ee5\u4f7f\u7528"\u5236\u4f5c"\u4e13\u4e1a\u5c06\u5b9d\u77f3\u7c89\u788e\u6210\u5c0f\u5757\uff0c\u7528\u6765\u51b2\u6ce1\u66f4\u9ad8\u6548\u7684\u5496\u5561\u548c\u8336\u3002\u5b9d\u77f3\u53ef\u4ee5\u4ece\u6218\u6597\u4e2d\u83b7\u53d6\u7684\u5b9d\u7bb1\u91cc\u627e\u5230\u3002</answer>\n\t\t\t<question>\u95ee: \u4ece\u54ea\u91cc\u83b7\u5f97\u8336\u53f6?</question>\n\t\t\t<answer>\u7b54: \u5728\u6218\u6597\u4e2d\u51fb\u8d25\u602a\u517d\u53ef\u4ee5\u83b7\u5f97\u8336\u53f6\u3002\u5728\u67e5\u770b\u6218\u6597\u533a\u57df\u65f6\uff0c\u4f60\u53ef\u4ee5\u5c06\u9f20\u6807\u60ac\u505c\u5728\u602a\u517d\u8eab\u4e0a(\u5728\u624b\u673a\u4e0a\u957f\u6309)\uff0c\u67e5\u770b\u5176\u6389\u843d\u7684\u7269\u54c1\u3002\u8336\u53f6\u662f\u6ce1\u8336\u7684\u5fc5\u5907\u6750\u6599\uff0c\u53ef\u4ee5\u4e3a\u975e\u6218\u6597\u4e13\u4e1a\u52a0\u6210\u3002</answer>\n\t\t\t<question>\u95ee: \u4ec0\u4e48\u662f\u7cbe\u534e?</question>\n\t\t\t<answer>\u7b54: \u7cbe\u534e\u53ef\u4ee5\u7528\u4e8e\u5f3a\u5316\u7279\u6b8a\u88c5\u5907\u3002\u6bcf\u4e2a\u6218\u6597\u533a\u57df\u7684\u602a\u517d\u90fd\u4f1a\u6389\u843d\u4e0d\u540c\u7c7b\u578b\u7684\u7cbe\u534e\u3002</answer>\n\t\t\t<br />',
          gathering: "\u91c7\u96c6\u7c7b\u4e13\u4e1a",
          gatheringContent: "<heading>\u6324\u5976</heading>\n\t\t\t<text>\n\t\t\t\t\u7ed9\u795e\u5947\u7684\u5976\u725b\u6324\u5976\u53ef\u4ee5\u83b7\u5f97\u4e0d\u540c\u79cd\u7c7b\u7684\u725b\u5976\uff0c\u8fd9\u4e9b\u725b\u5976\u6709\u591a\u79cd\u7528\u9014:\n\t\t\t\t<ul>\n\t\t\t\t\t<li>\u5976\u916a\u5236\u4f5c:\u725b\u5976\u53ef\u4ee5\u53d8\u6210\u5976\u916a\uff0c\u7136\u540e\u7528\u6765\u5236\u4f5c\u8fd1\u6218\u88c5\u5907\u6216\u4e13\u4e1a\u5de5\u5177\u3002</li>\n\t\t\t\t\t<li>\u70f9\u996a:\u725b\u5976\u662f\u8bb8\u591a\u98df\u8c31\u4e2d\u4e0d\u53ef\u6216\u7f3a\u7684\u539f\u6599\u3002</li>\n\t\t\t\t\t<li>\u51b2\u6ce1:\u725b\u5976\u4e5f\u7528\u4e8e\u5c11\u6570\u7684\u5496\u5561\u548c\u8336\u914d\u65b9\u3002</li>\n\t\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u901a\u8fc7\u88c5\u5907\u5237\u5b50\u6765\u5e2e\u52a9\u5976\u725b\u66f4\u5feb\u5730\u751f\u4ea7\u725b\u5976\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u91c7\u6458</heading>\n\t\t\t<text>\u91c7\u6458\u53ef\u4ee5\u8ba9\u4f60\u5728\u4e0d\u540c\u7684\u533a\u57df\u91c7\u6458\u4e0d\u540c\u7684\u8d44\u6e90\u3002\u4f60\u53ef\u4ee5\u5728\u67d0\u4e2a\u533a\u57df\u91c7\u6458\u7279\u5b9a\u7684\u7269\u54c1\uff0c\u4e5f\u53ef\u4ee5\u5728\u6574\u4e2a\u533a\u57df\u91c7\u6458\uff0c\u4ee5\u83b7\u5f97\u5404\u79cd\u7269\u54c1\u3002</text>\n\t\t\t<text>\n\t\t\t\t\u91c7\u6458\u7684\u8d44\u6e90\u53ef\u7528\u4e8e:\n\t\t\t\t<ul>\n\t\t\t\t\t<li>\u70f9\u996a: \u9e21\u86cb\u3001\u5c0f\u9ea6\u3001\u7cd6\u3001\u8393\u679c\u548c\u6c34\u679c\u662f\u8bb8\u591a\u98df\u8c31\u4e2d\u5fc5\u4e0d\u53ef\u5c11\u7684\u914d\u6599\u3002</li>\n\t\t\t\t\t<li>\u51b2\u6ce1: \u8393\u679c\u3001\u6c34\u679c\u548c\u5496\u5561\u8c46\u53ef\u7528\u4e8e\u51b2\u6ce1\u5496\u5561\u548c\u8336\u3002</li>\n\t\t\t\t\t<li>\u7f1d\u7eab: \u4e9a\u9ebb\u3001\u7af9\u5b50\u3001\u8695\u8327\u548c\u5176\u4ed6\u6750\u6599\u53ef\u4ee5\u52a0\u5de5\u6210\u5e03\u6599\uff0c\u5236\u4f5c\u9b54\u6cd5\u670d\u9970\u3002</li>\n\t\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<text>\u88c5\u5907\u526a\u5b50\u53ef\u4ee5\u63d0\u9ad8\u91c7\u6458\u901f\u5ea6\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u4f10\u6728</heading>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u780d\u4f10\u4e0d\u540c\u79cd\u7c7b\u6811\u6728\u7684\u539f\u6728\u3002</text>\n\t\t\t<text>\n\t\t\t\t\u539f\u6728\u53ef\u7528\u4e8e:\n\t\t\t\t<ul>\n\t\t\t\t\t<li>\u5976\u916a\u953b\u9020: \u539f\u6728\u662f\u5236\u4f5c\u4e00\u4e9b\u8fd1\u6218\u6b66\u5668\u548c\u4e13\u4e1a\u5de5\u5177\u7684\u539f\u6599\u3002</li>\n\t\t\t\t\t<li>\u5236\u4f5c: \u539f\u6728\u53ef\u4ee5\u52a0\u5de5\u6210\u6728\u6750\uff0c\u7528\u4e8e\u5236\u4f5c\u8fdc\u7a0b\u6b66\u5668\u548c\u9b54\u6cd5\u6b66\u5668\u3002</li>\n\t\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<text>\u88c5\u5907\u65a7\u5934\u53ef\u4ee5\u63d0\u9ad8\u4f10\u6728\u901f\u5ea6\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u7b49\u7ea7\u52a0\u6210</heading>\n\t\t\t<text>\u4f60\u7684\u7b49\u7ea7\u6bcf\u8d85\u8fc7\u884c\u52a8\u7684\u7b49\u7ea7\u8981\u6c421\u7ea7\uff0c\u5c31\u4f1a\u83b7\u5f971%\u7684\u6548\u7387\u52a0\u6210\u3002</text>\n\t\t\t<br />",
          production: "\u751f\u4ea7\u7c7b\u4e13\u4e1a",
          productionContent: "<heading>\u5976\u916a\u953b\u9020</heading>\n\t\t\t<text>\u5976\u916a\u953b\u9020\u662f\u5236\u9020\u8fd1\u6218\u88c5\u5907\u548c\u5de5\u5177\u7684\u4e13\u4e1a\u3002</text>\n\t\t\t<text>\u725b\u5976\u88ab\u52a0\u5de5\u6210\u4e0d\u540c\u7b49\u7ea7\u7684\u5976\u916a\u3002\u7136\u540e\u5236\u4f5c\u6210\u88c5\u5907(\u6709\u65f6\u4e0e\u5176\u4ed6\u8d44\u6e90\u7ed3\u5408\u4f7f\u7528)\u3002\u968f\u7740\u7b49\u7ea7\u7684\u63d0\u9ad8\uff0c\u88c5\u5907\u53ef\u4ee5\u5347\u7ea7\u5230\u66f4\u9ad8\u7684\u7b49\u7ea7\u3002</text>\n\t\t\t<text>\u88c5\u5907\u9524\u5b50\u53ef\u4ee5\u63d0\u9ad8\u5976\u916a\u5236\u4f5c\u7684\u901f\u5ea6\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u5236\u4f5c</heading>\n\t\t\t<text>\u5236\u4f5c\u53ef\u4ee5\u4ea7\u51fa\u591a\u79cd\u7269\u54c1\uff0c\u5305\u62ec\u8fdc\u7a0b\u6b66\u5668\u3001\u9b54\u6cd5\u6b66\u5668\u3001\u73e0\u5b9d\u548c\u5176\u4ed6\u7279\u6b8a\u8d44\u6e90\u3002</text>\n\t\t\t<text>\u539f\u6728\u53ef\u4ee5\u52a0\u5de5\u6210\u4e0d\u540c\u7b49\u7ea7\u7684\u6728\u6750\uff0c\u7136\u540e\u7528\u6765\u5236\u4f5c\u8fdc\u7a0b\u6b66\u5668\u548c\u9b54\u6cd5\u6b66\u5668\u3002</text>\n\t\t\t<text>\u9996\u9970\u53ef\u4ee5\u7528\u661f\u661f\u788e\u7247\u548c\u5b9d\u77f3\u5236\u4f5c\uff0c\u8fd9\u4e9b\u90fd\u662f\u91c7\u96c6\u6216\u6218\u6597\u4e2d\u53d1\u73b0\u7684\u7a00\u6709\u7269\u54c1\u3002</text>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u901a\u8fc7\u88c5\u5907\u51ff\u5b50\u6765\u63d0\u9ad8\u5236\u4f5c\u901f\u5ea6\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u7f1d\u7eab</heading>\n\t\t\t<text>\u7f1d\u7eab\u53ef\u4ee5\u5236\u4f5c\u5404\u79cd\u9b54\u6cd5\u670d\u9970\u548c\u888b\u5b50\u3002</text>\n\t\t\t<text>\u4e9a\u9ebb\u3001\u7af9\u5b50\u548c\u8695\u8327\u7b49\u91c7\u6458\u5f97\u6765\u7684\u539f\u6750\u6599\u53ef\u4ee5\u52a0\u5de5\u6210\u5e03\u6599\u3002\u4e0e\u602a\u517d\u6218\u6597\u83b7\u5f97\u7684\u517d\u76ae\u4e5f\u53ef\u4ee5\u52a0\u5de5\u6210\u76ae\u9769\u3002</text>\n\t\t\t<text>\u5e03\u6599\u4e3b\u8981\u7528\u4e8e\u5236\u4f5c\u9b54\u6cd5\u670d\u9970\uff0c\u5982\u888d\u670d\u548c\u5e3d\u5b50\uff0c\u800c\u76ae\u9769\u5219\u7528\u4e8e\u5236\u4f5c\u8fdc\u7a0b\u670d\u9970\uff0c\u5982\u76ae\u8863\u548c\u76ae\u9774\u3002</text>\n\t\t\t<text>\u9664\u4e86\u670d\u9970\uff0c\u4f60\u8fd8\u53ef\u4ee5\u5236\u4f5c\u888b\u5b50\uff0c\u589e\u52a0\u6218\u6597\u4e2d\u7684\u6700\u5927HP\u548cMP\u3002\u888b\u5b50\u8fd8\u80fd\u4e3a\u6280\u827a\u548c\u6218\u6597\u63d0\u4f9b\u989d\u5916\u7684\u6d88\u8017\u54c1\u69fd\u4f4d\u3002</text>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u901a\u8fc7\u88c5\u5907\u9488\u6765\u63d0\u9ad8\u7f1d\u7eab\u901f\u5ea6\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u70f9\u996a</heading>\n\t\t\t<text>\u70f9\u996a\u4ea7\u751f\u7684\u98df\u7269\u53ef\u5728\u6218\u6597\u4e2d\u4f7f\u7528\u3002</text>\n\t\t\t<text>\u751c\u751c\u5708\u548c\u86cb\u7cd5\u53ef\u4ee5\u6062\u590dHP\uff0c\u8f6f\u7cd6\u548c\u9178\u5976\u53ef\u4ee5\u6062\u590dMP\u3002</text>\n\t\t\t<text>\u88c5\u5907\u9505\u94f2\u53ef\u4ee5\u63d0\u9ad8\u70f9\u996a\u901f\u5ea6\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u51b2\u6ce1</heading>\n\t\t\t<text>\u51b2\u6ce1\u996e\u6599\u53ef\u5728\u77ed\u65f6\u95f4\u5185\u63d0\u4f9b\u589e\u76ca\u6548\u679c\u3002</text>\n\t\t\t<text>\u5728\u6218\u6597\u4e2d\u996e\u7528\u5496\u5561\u53ef\u4ee5\u63d0\u5347\u6218\u6597\u76f8\u5173\u5c5e\u6027\uff0c\u800c\u996e\u7528\u8336\u5219\u53ef\u4ee5\u63d0\u9ad8\u975e\u6218\u6597\u4e13\u4e1a\u3002</text>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u901a\u8fc7\u88c5\u5907\u4e00\u4e2a\u58f6\u6765\u63d0\u9ad8\u51b2\u6ce1\u901f\u5ea6\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u7b49\u7ea7\u52a0\u6210</heading>\n\t\t\t<text>\u4f60\u7684\u7b49\u7ea7\u6bcf\u8d85\u8fc7\u884c\u52a8\u7684\u7b49\u7ea7\u8981\u6c421\u7ea7\uff0c\u5c31\u4f1a\u83b7\u5f971%\u7684\u6548\u7387\u52a0\u6210\u3002</text>\n\t\t\t<br />",
          alchemy: "\u70bc\u91d1",
          alchemyContent: '<heading>\u70bc\u91d1</heading>\n\t\t\t<text>\u70bc\u91d1\u5141\u8bb8\u4f60\u4f7f\u7528\u70b9\u91d1\u3001\u5206\u89e3\u6216\u8f6c\u5316\u5c06\u7269\u54c1\u53d8\u4e3a\u5176\u4ed6\u7269\u54c1\u3002\u6bcf\u79cd\u884c\u52a8\u90fd\u6709\u4e0d\u540c\u7684\u6210\u529f\u7387\uff0c\u65e0\u8bba\u6210\u529f\u4e0e\u5426\uff0c\u6295\u5165\u7684\u7269\u54c1\u548c\u91d1\u5e01\u6210\u672c\u90fd\u4f1a\u88ab\u6d88\u8017\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u70b9\u91d1</heading>\n\t\t\t<text>\u70b9\u91d1\u53ef\u4ee5\u5c06\u7269\u54c1\u8f6c\u5316\u4e3a\u91d1\u5e01\u3002\u83b7\u5f97\u7684\u91d1\u5e01\u6570\u91cf\u662f\u7269\u54c1\u552e\u4ef7\u76845\u500d\u3002\u57fa\u672c\u6210\u529f\u7387\u4e3a70%\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u5206\u89e3</heading>\n\t\t\t<text>\u5206\u89e3\u53ef\u4ee5\u5c06\u7269\u54c1\u5206\u89e3\u6210\u539f\u6750\u6599\u6216\u7cbe\u534e\u3002\u88c5\u5907\u53ef\u4ee5\u5206\u89e3\u6210\u539f\u6750\u6599\uff0c\u975e\u88c5\u5907\u7269\u54c1\u53ef\u4ee5\u5206\u89e3\u6210\u6280\u827a\u7cbe\u534e\u3002\u5206\u89e3\u5f3a\u5316\u88c5\u5907\u53ef\u4ee5\u83b7\u5f97\u989d\u5916\u7684\u5f3a\u5316\u7cbe\u534e\uff0c\u5f3a\u5316\u7b49\u7ea7\u8d8a\u9ad8\uff0c\u6570\u91cf\u8d8a\u591a\u3002\u57fa\u672c\u6210\u529f\u7387\u4e3a60%\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u8f6c\u5316</heading>\n\t\t\t<text>\u8f6c\u5316\u53ef\u4ee5\u5c06\u7269\u54c1\u8f6c\u5316\u4e3a\u5176\u4ed6\u76f8\u5173\u7269\u54c1\u6216\u7a00\u6709\u72ec\u7279\u7269\u54c1\uff0c\u5982\u8d24\u8005\u4e4b\u77f3\u3002\u57fa\u672c\u6210\u529f\u7387\u56e0\u88ab\u8f6c\u5316\u7684\u7269\u54c1\u800c\u5f02\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u6210\u529f\u7387</heading>\n\t\t\t<text>\u57fa\u7840\u6210\u529f\u7387\u53d6\u51b3\u4e8e\u70bc\u91d1\u884c\u52a8\u548c\u88ab\u70bc\u91d1\u7684\u7279\u5b9a\u7269\u54c1\u3002\u5982\u679c\u4f60\u7684\u70bc\u91d1\u4e13\u4e1a\u7b49\u7ea7\u4f4e\u4e8e\u7269\u54c1\u7684\u7b49\u7ea7\uff0c\u6210\u529f\u7387\u5c31\u4f1a\u53d7\u5230\u5f71\u54cd\u3002\u4f7f\u7528\u50ac\u5316\u5242\u548c\u50ac\u5316\u8336\u53ef\u4ee5\u63d0\u9ad8\u6210\u529f\u7387\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u50ac\u5316\u5242</heading>\n\t\t\t<text>\u50ac\u5316\u5242\u662f\u53ef\u4ee5\u7528\u6765\u63d0\u9ad8\u70bc\u91d1\u6210\u529f\u7387\u7684\u7279\u6b8a\u7269\u54c1\u3002\u53ea\u6709\u5728\u6210\u529f\u65f6\u624d\u4f1a\u6d88\u8017\u4e00\u4e2a\u50ac\u5316\u5242\u3002\u666e\u901a\u50ac\u5316\u5242\u53ef\u4ee5\u4f7f\u7528\u4e13\u4e1a\u7cbe\u534e\u5236\u4f5c\u3002\u81f3\u9ad8\u50ac\u5316\u5242\u53ef\u901a\u8fc7\u8f6c\u5316\u666e\u901a\u50ac\u5316\u5242\u83b7\u5f97\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u70bc\u91d1\u6548\u7387</heading>\n\t\t\t<text>\u4f60\u7684\u7b49\u7ea7\u6bcf\u8d85\u8fc7\u7269\u54c1\u5efa\u8bae\u7b49\u7ea71\u7ea7\uff0c\u5c31\u4f1a\u83b7\u5f971%\u7684\u6548\u7387\u52a0\u6210\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u70bc\u91d1\u8bf4\u660e</heading>\n\t\t\t<text>\u4ee5\u4e0b\u662f\u70bc\u91d1\u7684\u6b65\u9aa4:</text>\n\t\t\t<ol>\n\t\t\t\t<li>\u9009\u62e9\u8981\u70bc\u91d1\u7684\u7269\u54c1;</li>\n\t\t\t\t<li>\u9009\u62e9\u8981\u8fdb\u884c\u7684\u70bc\u91d1\u884c\u52a8;</li>\n\t\t\t\t<li>\u51b3\u5b9a\u662f\u5426\u4f7f\u7528\u50ac\u5316\u5242\u3002\u5982\u679c\u4f7f\u7528\uff0c\u8bf7\u9009\u62e9\u50ac\u5316\u5242\u3002</li>\n\t\t\t\t<li>\u70b9\u51fb"\u5f00\u59cb"\u6309\u94ae\uff0c\u5c31\u4f1a\u5f00\u59cb\u70bc\u91d1\u3002</li>\n\t\t\t</ol>\n\t\t\t<br />',
          enhancing: "\u5f3a\u5316",
          enhancingContent: '<heading>\u5f3a\u5316</heading>\n\t\t\t<text>\u5f3a\u5316\u662f\u589e\u52a0\u4efb\u4f55\u88c5\u5907(\u5982\u76d4\u7532\u3001\u6b66\u5668\u3001\u5de5\u5177\u3001\u888b\u5b50\u6216\u9996\u9970)\u5c5e\u6027\u7684\u8fc7\u7a0b\u3002\u5f53\u4f60\u6210\u529f\u5f3a\u5316\u4e00\u4ef6\u88c5\u5907\u65f6\uff0c\u5176\u5f3a\u5316\u7b49\u7ea7\u4f1a\u589e\u52a0 1\u3002\u4f46\u662f\uff0c\u5982\u679c\u5f3a\u5316\u5931\u8d25\uff0c\u7b49\u7ea7\u4f1a\u91cd\u7f6e\u4e3a 0\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u5f3a\u5316\u6210\u529f\u7387</heading>\n\t\t\t<text>\u5f3a\u5316\u7684\u6210\u529f\u7387\u53d6\u51b3\u4e8e\u51e0\u4e2a\u56e0\u7d20\uff0c\u5305\u62ec\u4f60\u7684\u5f3a\u5316\u7b49\u7ea7\u3001\u88c5\u5907\u7684\u7b49\u7ea7\u4ee5\u53ca\u8be5\u88c5\u5907\u5f53\u524d\u7684\u5f3a\u5316\u7b49\u7ea7\u3002\u4e00\u822c\u6765\u8bf4\uff0c\u88c5\u5907\u7684\u7b49\u7ea7\u548c\u5f3a\u5316\u7b49\u7ea7\u8d8a\u9ad8\uff0c\u6210\u529f\u7387\u5c31\u8d8a\u4f4e\u3002\u88c5\u5907\u5f3a\u5316\u5668\u53ef\u4ee5\u63d0\u9ad8\u6210\u529f\u7387\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u4fdd\u62a4</heading>\n\t\t\t<text>\u4fdd\u62a4\u673a\u5236\u662f\u4e00\u4e2a\u5141\u8bb8\u73a9\u5bb6\u4f7f\u7528\u57fa\u7840\u88c5\u5907\u526f\u672c\u3001\u4fdd\u62a4\u4e4b\u955c\u6216\u5236\u4f5c\u7ec4\u4ef6(\u4ec5\u9002\u7528\u4e8e\u7279\u6b8a\u88c5\u5907)\u4e3a\u6bcf\u6b21\u5f3a\u5316\u63d0\u4f9b\u4fdd\u62a4\u7684\u529f\u80fd\u3002\u5982\u679c\u5f3a\u5316\u5931\u8d25\uff0c\u88c5\u5907\u7684\u7b49\u7ea7\u53ea\u4f1a\u964d\u4f4e1\u7ea7\uff0c\u4f46\u4f1a\u6d88\u80171\u4ef6\u4fdd\u62a4\u9053\u5177\u3002\u8fd9\u5bf9\u6bd5\u4e1a\u9636\u6bb5\u7684\u73a9\u5bb6\u6765\u8bf4\u662f\u8fbe\u5230\u9ad8\u5f3a\u5316\u7b49\u7ea7\u7684\u4e00\u79cd\u7ecf\u6d4e\u6709\u6548\u7684\u65b9\u6cd5\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u63d0\u5347\u901f\u5ea6</heading>\n\t\t\t<text>\u4f60\u7684\u7b49\u7ea7\u6bcf\u8d85\u8fc7\u88c5\u5907\u63a8\u8350\u7b49\u7ea71\u7ea7\uff0c\u5c31\u4f1a\u83b7\u5f971%\u7684\u884c\u52a8\u901f\u5ea6\u52a0\u6210\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u8bf4\u660e</heading>\n\t\t\t<text>\u4ee5\u4e0b\u662f\u5f3a\u5316\u88c5\u5907\u7684\u6b65\u9aa4:</text>\n\t\t\t<ol>\n\t\t\t\t<li>\u9009\u62e9\u8981\u5f3a\u5316\u7684\u88c5\u5907\u3002</li>\n\t\t\t\t<li>\u8bbe\u5b9a\u76ee\u6807\u5f3a\u5316\u7b49\u7ea7\u3002\u73b0\u5b9e\u4e00\u70b9\uff0c\u8003\u8651\u4ee5\u4f60\u76ee\u524d\u7684\u8d44\u6e90\u80fd\u8fbe\u5230\u4ec0\u4e48\u6c34\u5e73\u3002</li>\n\t\t\t\t<li>\u51b3\u5b9a\u662f\u5426\u4f7f\u7528\u4fdd\u62a4\u3002\u5982\u679c\u4f7f\u7528\uff0c\u5219\u9009\u62e9\u4fdd\u62a4\u9053\u5177\u548c\u4f7f\u7528\u4fdd\u62a4\u7684\u6700\u4f4e\u5f3a\u5316\u7b49\u7ea7\u3002\u4e00\u822c\u6765\u8bf4\uff0c\u5f3a\u5316\u7269\u54c1\u7684\u7b49\u7ea7\u8d8a\u9ad8\uff0c\u4f7f\u7528\u4fdd\u62a4\u7684\u6027\u4ef7\u6bd4\u5c31\u8d8a\u9ad8\u3002</li>\n\t\t\t\t<li>\u70b9\u51fb"\u5f00\u59cb"\u6309\u94ae\uff0c\u4f60\u5c06\u7ee7\u7eed\u5f3a\u5316\uff0c\u76f4\u5230\u8fbe\u5230\u76ee\u6807\u7b49\u7ea7\u6216\u6750\u6599\u8017\u5c3d\u3002</li>\n\t\t\t</ol>\n\t\t\t<br />\n\t\t\t<heading>\u5f3a\u5316\u52a0\u6210</heading>\n\t\t\t<text>\u5f3a\u5316\u88c5\u5907\u7684\u52a0\u6210\u5c5e\u6027\u6309\u57fa\u7840\u5c5e\u6027\u7684\u4e00\u5b9a\u767e\u5206\u6bd4\u589e\u52a0\u3002\u6bcf\u4e2a\u5f3a\u5316\u7b49\u7ea7\u7684\u603b\u52a0\u6210\u5982\u4e0b:\n\t\t\t<br />\n\t\t\t+1: 2.0%\n\t\t\t<br />\n\t\t\t+2: 4.2%\n\t\t\t<br />\n\t\t\t+3: 6.6%\n\t\t\t<br />\n\t\t\t+4: 9.2%\n\t\t\t<br />\n\t\t\t+5: 12.0%\n\t\t\t<br />\n\t\t\t+6: 15.0%\n\t\t\t<br />\n\t\t\t+7: 18.2%\n\t\t\t<br />\n\t\t\t+8: 21.6%\n\t\t\t<br />\n\t\t\t+9: 25.2%\n\t\t\t<br />\n\t\t\t+10: 29.0%\n\t\t\t<br />\n\t\t\t+11: 33.4%\n\t\t\t<br />\n\t\t\t+12: 38.4%\n\t\t\t<br />\n\t\t\t+13: 44.0%\n\t\t\t<br />\n\t\t\t+14: 50.2%\n\t\t\t<br />\n\t\t\t+15: 57.0%\n\t\t\t<br />\n\t\t\t+16: 64.4%\n\t\t\t<br />\n\t\t\t+17: 72.4%\n\t\t\t<br />\n\t\t\t+18: 81.0%\n\t\t\t<br />\n\t\t\t+19: 90.2%\n\t\t\t<br />\n\t\t\t+20: 100%\n\t\t\t</text>\n\t\t\t<text>\u4f5c\u4e3a\u4f8b\u5916\uff0c\u4f69\u9970\u3001\u80cc\u90e8\u88c5\u5907\u548c\u9970\u54c1\u69fd\u4f4d\u7684\u5f3a\u5316\u53ef\u83b7\u5f97\u6b63\u5e38\u52a0\u6210\u76845\u500d\u3002\u4f8b\u5982\uff0c\u4f69\u9970\u7684+1\u5f3a\u5316\u4e3a10%\u7684\u52a0\u6210\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u5f3a\u5316\u57fa\u7840\u6210\u529f\u7387</heading>\n\t\t\t<text>\n\t\t\t+1: 50%\n\t\t\t<br />\n\t\t\t+2: 45%\n\t\t\t<br />\n\t\t\t+3: 45%\n\t\t\t<br />\n\t\t\t+4: 40%\n\t\t\t<br />\n\t\t\t+5: 40%\n\t\t\t<br />\n\t\t\t+6: 40%\n\t\t\t<br />\n\t\t\t+7: 35%\n\t\t\t<br />\n\t\t\t+8: 35%\n\t\t\t<br />\n\t\t\t+9: 35%\n\t\t\t<br />\n\t\t\t+10: 35%\n\t\t\t<br />\n\t\t\t+11: 30%\n\t\t\t<br />\n\t\t\t+12: 30%\n\t\t\t<br />\n\t\t\t+13: 30%\n\t\t\t<br />\n\t\t\t+14: 30%\n\t\t\t<br />\n\t\t\t+15: 30%\n\t\t\t<br />\n\t\t\t+16: 30%\n\t\t\t<br />\n\t\t\t+17: 30%\n\t\t\t<br />\n\t\t\t+18: 30%\n\t\t\t<br />\n\t\t\t+19: 30%\n\t\t\t<br />\n\t\t\t+20: 30%\n\t\t\t</text>\n\t\t\t<br />',
          combat: "\u6218\u6597",
          combatContent: "<heading>\u6218\u6597</heading>\n\t\t\t<text>\u4e0e\u602a\u517d\u6218\u6597\u53ef\u4ee5\u83b7\u5f97\u91d1\u5e01\u3001\u8336\u53f6\u3001\u517d\u76ae\u3001\u7cbe\u534e\u3001\u6280\u80fd\u4e66\u3001\u5b9d\u77f3\u3001\u7279\u6b8a\u7269\u54c1\u4ee5\u53ca\u5404\u79cd\u5e38\u89c1\u8d44\u6e90\u3002\u5728\u4e0d\u540c\u7684\u6218\u6597\u533a\u57df\u4f1a\u6709\u4e0d\u540c\u96be\u5ea6\u7684\u654c\u4eba\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u88c5\u5907</heading>\n\t\t\t<text>\u7a7f\u6234\u88c5\u5907\u53ef\u4ee5\u63d0\u9ad8\u6218\u6597\u4e2d\u7684\u5c5e\u6027\u3002\u4f60\u53ef\u4ee5\u76f4\u63a5\u4ece\u5e93\u5b58\u4e2d\u88c5\u5907\u7269\u54c1\uff0c\u4e5f\u53ef\u4ee5\u70b9\u51fb\u5e93\u5b58\u65c1\u8fb9[\u88c5\u5907]\u4e2d\u7684\u88c5\u5907\u69fd\u4f4d\u6765\u88c5\u5907\u7269\u54c1\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u6d88\u8017\u54c1</heading>\n\t\t\t<text>\u6d88\u8017\u98df\u7269\u53ef\u4ee5\u6062\u590dHP\u6216MP\u3002\u996e\u6599\u53ef\u4ee5\u5728\u4e00\u5b9a\u65f6\u95f4\u5185\u63d0\u4f9b\u589e\u76ca\u6548\u679c\u3002\u5347\u7ea7\u888b\u5b50\u5728\u53ef\u4ee5\u8ba9\u4f60\u5728\u6218\u6597\u4e2d\u643a\u5e26\u66f4\u591a\u7684\u98df\u7269\u548c\u996e\u6599\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u6280\u80fd</heading>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u5b66\u4e60\u6280\u80fd\u4e66\uff0c\u5e76\u5728\u6218\u6597\u4e2d\u6d88\u8017MP\u6765\u4f7f\u7528\u6280\u80fd\u3002\u8981\u89e3\u9501\u65b0\u7684\u6280\u80fd\uff0c\u5fc5\u987b\u4ece\u6280\u80fd\u4e66\u4e2d\u5b66\u4e60\u3002\u6280\u80fd\u4f1a\u968f\u7740\u7b49\u7ea7\u7684\u63d0\u5347\u800c\u589e\u5f3a\u3002\u6bcf\u6b21\u5728\u6218\u6597\u4e2d\u4f7f\u7528\u6280\u80fd\u90fd\u4f1a\u83b7\u5f970.1\u7684\u7ecf\u9a8c\u3002\u4f60\u8fd8\u53ef\u4ee5\u901a\u8fc7\u6d88\u8017\u91cd\u590d\u7684\u6280\u80fd\u4e66\u6765\u83b7\u5f97\u5927\u91cf\u7ecf\u9a8c\u3002</text>\n\t\t\t<text>\u5728\u6218\u6597\u4e2d\u4f7f\u7528\u591a\u4e2a\u53ef\u7528\u7684\u6280\u80fd\u65f6\uff0c\u5b83\u4eec\u5c06\u6309\u7167\u4f60\u7684\u8bbe\u7f6e\u4ece\u5de6\u5230\u53f3\u7684\u987a\u5e8f\u65bd\u653e\u3002</text>\n\t\t\t<text>\u4f60\u7684\u667a\u529b\u7b49\u7ea7\u51b3\u5b9a\u4e86\u4f60\u53ef\u4ee5\u643a\u5e26\u591a\u5c11\u79cd\u6280\u80fd\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u89e6\u53d1\u5668</heading>\n\t\t\t<text>\u6d88\u8017\u54c1\u548c\u6280\u80fd\u90fd\u6709\u9ed8\u8ba4\u8bbe\u7f6e\uff0c\u7528\u4e8e\u51b3\u5b9a\u4ed6\u4eec\u4f55\u65f6\u4f1a\u81ea\u52a8\u4f7f\u7528\u3002\u8fd9\u4e9b\u8bbe\u7f6e\u88ab\u79f0\u4e3a\u89e6\u53d1\u5668\uff0c\u53ef\u4ee5\u5728\u8fdb\u5165\u6218\u6597\u524d\u70b9\u51fb\u6280\u80fd\u4e0b\u65b9\u7684[\u9f7f\u8f6e\u56fe\u6807]\u8fdb\u884c\u4fee\u6539\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u51fb\u8d25\u548c\u91cd\u751f</heading>\n\t\t\t<text>\u5728\u6218\u6597\u4e2d\u88ab\u51fb\u8d25\u540e\uff0c\u4f60\u7684\u89d2\u8272\u9700\u8981\u7b49\u5f85\u91cd\u751f\u5012\u8ba1\u65f6\u7ed3\u675f\uff0c\u624d\u80fd\u590d\u6d3b\u5e76\u81ea\u52a8\u91cd\u65b0\u5f00\u59cb\u6218\u6597\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u56e2\u961f\u6218\u6597</heading>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u521b\u5efa\u6216\u52a0\u5165\u4e00\u4e2a\u961f\u4f0d\uff0c\u4e00\u8d77\u5728\u6709\u591a\u4e2a\u602a\u7269\u7684\u533a\u57df\u6218\u6597\u3002\u5f53\u6240\u6709\u961f\u5458\u90fd\u6309\u4e0b[\u51c6\u5907\u5c31\u7eea]\u952e\u540e\uff0c\u961f\u4f0d\u5c06\u81ea\u52a8\u524d\u5f80\u6218\u6597\u5730\u70b9\u3002\u602a\u7269\u4f1a\u968f\u673a\u653b\u51fb\u4efb\u4f55\u4e00\u540d\u961f\u5458\uff0c\u800c\u5a01\u80c1\u503c\u8f83\u9ad8\u7684\u961f\u5458\u4f1a\u66f4\u9891\u7e41\u5730\u6210\u4e3a\u653b\u51fb\u76ee\u6807\u3002\u602a\u7269\u7684\u7ecf\u9a8c\u548c\u6389\u843d\u5c06\u5e73\u5747\u5206\u914d\u7ed9\u6240\u6709\u73a9\u5bb6\u3002\u6218\u6597\u7b49\u7ea7\u6bd4\u6700\u9ad8\u7b49\u7ea7\u73a9\u5bb6\u4f4e20%\u4ee5\u4e0a\u7684\u73a9\u5bb6\u5c06\u83b7\u5f97\u8f83\u5c11\u7684\u7ecf\u9a8c\u548c\u6389\u843d\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u5730\u4e0b\u57ce</heading>\n\t\t\t<text>\u5730\u4e0b\u57ce\u7531\u591a\u6ce2\u66f4\u9ad8\u7ea7\u7684\u7cbe\u82f1\u602a\u7269\u548c\u72ec\u7279\u7684\u5730\u4e0b\u57ceboss\u7ec4\u6210\u3002\u73a9\u5bb6\u53ef\u4ee5\u4f7f\u7528\u5730\u4e0b\u57ce\u94a5\u5319\u8fdb\u5165\u5730\u4e0b\u57ce\uff0c\u8fd9\u4e9b\u94a5\u5319\u53ef\u4ee5\u4ece\u5e38\u89c4\u6218\u6597\u533a\u57df\u7684boss\u8eab\u4e0a\u627e\u5230\u94a5\u5319\u788e\u7247\u540e\u5236\u4f5c\u3002</text>\n\t\t\t<text>\u4e00\u4e2a\u5730\u4e0b\u57ce\u961f\u4f0d\u4e2d\u6700\u591a\u53ef\u6709\u4e94\u540d\u73a9\u5bb6\u3002\u6bcf\u4e2a\u4eba\u90fd\u5fc5\u987b\u6709\u4e00\u628a\u94a5\u5319\uff0c\u5728\u51fb\u8d25\u6700\u7ec8boss\u540e\u6d88\u8017\u94a5\u5319\u4f1a\u83b7\u5f97\u5730\u4e0b\u57ce\u5b9d\u7bb1\u3002\u5982\u679c\u4f60\u4ee5\u8f83\u5c11\u7684\u73a9\u5bb6\u5b8c\u6210\u4e86\u4e00\u4e2a\u5730\u4e0b\u57ce\uff0c\u5c31\u6709\u673a\u4f1a\u4ee5\u591a\u4ed8\u51fa\u4e00\u4e2a\u94a5\u5319\u4e3a\u4ee3\u4ef7\u5f97\u5230\u4e00\u4e2a\u989d\u5916\u7684\u5b9d\u7bb1\u3002\u5982\u679c\u5730\u4e0b\u57ce\u6ca1\u6709\u5b8c\u6210\uff0c\u4f60\u5c06\u4fdd\u7559\u4f60\u7684\u5730\u4e0b\u57ce\u94a5\u5319\u3002</text>\n\t\t\t<text>\u5728\u5730\u4e0b\u57ce\u4e2d\u88ab\u51fb\u8d25\u4e0d\u4f1a\u89e6\u53d1\u91cd\u751f\u5012\u8ba1\u65f6\uff0c\u53ea\u80fd\u7b49\u961f\u5458\u590d\u6d3b\u4f60\u3002\u5982\u679c\u6240\u6709\u6210\u5458\u90fd\u88ab\u51fb\u8d25\u4e86\uff0c\u5730\u4e0b\u57ce\u4efb\u52a1\u5c06\u88ab\u89c6\u4e3a\u5931\u8d25\uff0c\u4f60\u4eec\u5c06\u4ece\u7b2c1\u6ce2\u91cd\u65b0\u5f00\u59cb\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u6218\u6597\u4e13\u4e1a</heading>\n\t\t\t<text>\u4f60\u6709 7 \u4e2a\u53ef\u4ee5\u5347\u7ea7\u7684\u6218\u6597\u4e13\u4e1a:</text>\n\t\t\t<ul>\n\t\t\t<li>\u8010\u529b: \u6bcf\u5347\u4e00\u7ea7\uff0c\u6700\u5927HP\u589e\u52a010\u3002</li>\n\t\t\t<li>\u667a\u529b: \u6bcf\u5347\u4e00\u7ea7\uff0c\u6700\u5927MP\u589e\u52a010\u3002</li>\n\t\t\t<li>\u653b\u51fb: \u63d0\u9ad8\u4f60\u7684\u7cbe\u51c6\u5ea6\u3001\u653b\u51fb\u901f\u5ea6\u548c\u65bd\u6cd5\u901f\u5ea6\u3002</li>\n\t\t\t<li>\u9632\u5fa1: \u63d0\u9ad8\u4f60\u7684\u95ea\u907f\u3001\u62a4\u7532\u548c\u5143\u7d20\u6297\u6027\u3002</li>\n\t\t\t<li>\u8fd1\u6218: \u63d0\u9ad8\u4f60\u7684\u8fd1\u6218\u4f24\u5bb3\u3002</li>\n\t\t\t<li>\u8fdc\u7a0b: \u63d0\u9ad8\u4f60\u7684\u8fdc\u7a0b\u4f24\u5bb3\u3002</li>\n\t\t\t<li>\u9b54\u6cd5: \u63d0\u9ad8\u4f60\u7684\u9b54\u6cd5\u4f24\u5bb3\u3002</li>\n\t\t\t</ul>\n\t\t\t<br />\n\t\t\t<heading>\u72b6\u6001\u6548\u679c</heading>\n\t\t\t<text>\u6709\u4e9b\u72b6\u6001\u6548\u679c\u4f1a\u6682\u65f6\u963b\u6b62\u4f60\u91c7\u53d6\u67d0\u4e9b\u884c\u52a8:</text>\n\t\t\t<ul>\n\t\t\t<li>\u5931\u660e: \u7981\u6b62\u4f7f\u7528\u81ea\u52a8\u653b\u51fb\u3002</li>\n\t\t\t<li>\u6c89\u9ed8: \u7981\u6b62\u4f7f\u7528\u6280\u80fd\u3002</li>\n\t\t\t<li>\u7729\u6655: \u7981\u6b62\u4f7f\u7528\u81ea\u52a8\u653b\u51fb\u3001\u6280\u80fd\u548c\u6d88\u8017\u54c1\u3002</li>\n\t\t\t</ul>\n\t\t\t<br />\n\t\t\t<heading>\u5c5e\u6027</heading>\n\t\t\t<text>\u4f60\u8fd8\u6709\u6b21\u8981\u6218\u6597\u5c5e\u6027\uff0c\u53d7\u4f60\u7684\u6218\u6597\u7b49\u7ea7\u3001\u88c5\u5907\u548c\u589e\u76ca\u5f71\u54cd:</text>\n\t\t\t<ul>\n\t\t\t<li>\u6218\u6597\u98ce\u683c: \u6bcf\u79cd\u653b\u51fb\u90fd\u6709\u7279\u5b9a\u7684\u7c7b\u578b - \u523a\u51fb\u3001\u65a9\u51fb\u3001\u949d\u51fb\u3001\u8fdc\u7a0b\u6216\u9b54\u6cd5\u3002</li>\n\t\t\t<li>\u4f24\u5bb3\u7c7b\u578b: \u6bcf\u6b21\u653b\u51fb\u90fd\u4f1a\u9020\u6210\u7279\u5b9a\u7c7b\u578b\u7684\u4f24\u5bb3 - \u7269\u7406\u3001\u6c34\u7cfb\u3001\u81ea\u7136\u7cfb\u6216\u706b\u7cfb\u3002</li>\n\t\t\t<li>\u653b\u51fb\u95f4\u9694: \u81ea\u52a8\u653b\u51fb\u7684\u901f\u5ea6\u3002</li>\n\t\t\t<li>\u6280\u80fd\u6025\u901f: \u51cf\u5c11\u6280\u80fd\u51b7\u5374\u65f6\u95f4\u3002</li>\n\t\t\t<li>\u7cbe\u786e\u5ea6: \u589e\u52a0\u51fb\u4e2d\u7684\u51e0\u7387\u3002</li>\n\t\t\t<li>\u4f24\u5bb3: \u51fb\u4e2d\u65f6\u7684\u6700\u5927\u4f24\u5bb3\u3002\u81ea\u52a8\u653b\u51fb\u4f24\u5bb3\u57281\u548c\u6700\u5927\u4f24\u5bb3\u4e4b\u95f4\u968f\u673a\u3002</li>\n\t\t\t<li>\u66b4\u51fb: \u66b4\u51fb\u603b\u662f\u4f1a\u9020\u6210\u6700\u5927\u4f24\u5bb3\u3002\u8fdc\u7a0b\u6218\u6597\u98ce\u683c\u5177\u6709\u57fa\u7840\u7684\u66b4\u51fb\u51e0\u7387\u3002</li>\n\t\t\t<li>\u589e\u5e45: \u589e\u52a0\u9020\u6210\u7684\u4f24\u5bb3\u3002</li>\n\t\t\t<li>\u8d2f\u7a7f: \u653b\u51fb\u65f6\u5ffd\u7565\u654c\u4eba\u4e00\u5b9a\u6bd4\u4f8b\u7684\u62a4\u7532\u6216\u6297\u6027\u3002</li>\n\t\t\t<li>\u95ea\u907f: \u589e\u52a0\u95ea\u907f\u653b\u51fb\u7684\u51e0\u7387\u3002</li>\n\t\t\t<li>\u62a4\u7532: \u51cf\u8f7b\u4e00\u5b9a\u6bd4\u4f8b\u7684\u7269\u7406\u4f24\u5bb3\u3002</li>\n\t\t\t<li>\u6297\u6027: \u51cf\u8f7b\u4e00\u5b9a\u6bd4\u4f8b\u7684\u6c34\u7cfb\u3001\u81ea\u7136\u7cfb\u6216\u706b\u7cfb\u4f24\u5bb3\u3002</li>\n\t\t\t<li>\u751f\u547d\u7a83\u53d6: \u6839\u636e\u4f60\u81ea\u52a8\u653b\u51fb\u9020\u6210\u4f24\u5bb3\u7684\u767e\u5206\u6bd4\u6062\u590dHP\u3002</li>\n\t\t\t<li>\u6cd5\u529b\u6c72\u53d6: \u6839\u636e\u4f60\u81ea\u52a8\u653b\u51fb\u9020\u6210\u4f24\u5bb3\u7684\u767e\u5206\u6bd4\u6062\u590dMP\u3002</li>\n\t\t\t<li>\u8346\u68d8: \u88ab\u653b\u51fb\u65f6\uff0c\u5c06\u4e00\u5b9a\u6bd4\u4f8b\u7684\u9632\u5fa1\u4f24\u5bb3\u53cd\u5c04\u7ed9\u653b\u51fb\u8005\u3002\u6bcf\u4e2a\u62a4\u7532\u6216\u6297\u6027(\u4e0e\u653b\u51fb\u7c7b\u578b\u76f8\u5bf9\u5e94)\u589e\u52a01%\u4f24\u5bb3\u3002</li>\n\t\t\t<li>\u53cd\u4f24: \u88ab\u653b\u51fb\u65f6\uff0c\u5c06(\u9632\u5fa1\u4f24\u5bb3+\u88ab\u653b\u51fb\u4f24\u5bb3)\u7684\u4e00\u5b9a\u6bd4\u4f8b\u4ee5\u949d\u51fb\u5f62\u5f0f\u53cd\u4f24\u653b\u51fb\u8005\u3002</li>\n\t\t\t<li>\u97e7\u6027: \u964d\u4f4e\u5931\u660e\u3001\u6c89\u9ed8\u6216\u7729\u6655\u7684\u51e0\u7387\u3002</li>\n\t\t\t<li>\u5a01\u80c1: \u589e\u52a0\u88ab\u602a\u7269\u653b\u51fb\u7684\u51e0\u7387\u3002</li>\n\t\t\t<li>HP/MP\u6062\u590d: \u6bcf10\u79d2\u6062\u590d\u4e00\u5b9a\u767e\u5206\u6bd4\u7684\u6700\u5927HP/MP\u3002</li>\n\t\t\t<li>\u98df\u7269\u6025\u901f: \u51cf\u5c11\u98df\u7269\u51b7\u5374\u65f6\u95f4\u3002</li>\n\t\t\t<li>\u996e\u6599\u6d53\u7f29: \u589e\u52a0\u996e\u6599\u6548\u679c\u3002\u7f29\u77ed\u6301\u7eed\u65f6\u95f4\u548c\u51b7\u5374\u65f6\u95f4\u3002</li>\n\t\t\t<li>\u6218\u6597\u6389\u843d\u7387: \u63d0\u9ad8\u5e38\u89c4\u7269\u54c1\u7684\u6389\u843d\u7387(\u4e0d\u8d85\u8fc7100%)\u3002</li>\n\t\t\t<li>\u6218\u6597\u6389\u843d\u6570\u91cf: \u589e\u52a0\u5e38\u89c4\u7269\u54c1\u7684\u6389\u843d\u6570\u91cf\u3002</li>\n\t\t\t<li>\u6218\u6597\u7a00\u6709\u53d1\u73b0: \u589e\u52a0\u7a00\u6709\u7269\u54c1\u7684\u6389\u843d\u7387\u3002</li>\n\t\t\t<li>\u4e3b\u4fee\u8bad\u7ec3: 30%\u7684\u6218\u6597\u7ecf\u9a8c\u4f1a\u5206\u914d\u7ed9\u4e3b\u4fee\u8bad\u7ec3\u4e13\u4e1a\uff0c\u8fd9\u53d6\u51b3\u4e8e\u4f60\u7684\u6b66\u5668\u3002</li>\n\t\t\t<li>\u9009\u4fee\u8bad\u7ec3: 70%\u7684\u6218\u6597\u7ecf\u9a8c\u4f1a\u5206\u914d\u7ed9\u4e13\u6ce8\u8bad\u7ec3\u4e13\u4e1a\uff0c\u8fd9\u53d6\u51b3\u4e8e\u4f60\u7684\u62a4\u7b26\u3002</li>\n\t\t\t<li>\u6218\u6597\u7b49\u7ea7: \u4ec5\u7528\u4e8e\u663e\u793a\uff0c\u4ee3\u8868\u57fa\u4e8e\u6218\u6597\u4e13\u4e1a\u7b49\u7ea7\u7684\u7efc\u5408\u6218\u6597\u529b\u3002</li>\n\t\t\t</ul>\n\t\t\t<br />\n\t\t\t<heading>\u516c\u5f0f</heading>\n\t\t\t<text>\u5bf9\u4e8e\u90a3\u4e9b\u559c\u6b22\u6570\u5b66\u7684\u4eba\uff0c\u4e0b\u9762\u662f\u6b21\u8981\u6218\u6597\u5c5e\u6027\u7684\u8ba1\u7b97\u516c\u5f0f:</text>\n\t\t\t<ul>\n\t\t\t<li>\u6700\u5927HP = 10 * (10 + \u8010\u529b)</li>\n\t\t\t<li>\u6700\u5927MP = 10 * (10 + \u667a\u529b)</li>\n\t\t\t<li>\u653b\u51fb\u95f4\u9694 = \u57fa\u7840\u95f4\u9694 / (1 + (\u653b\u51fb / 2000)) / (1 + \u653b\u51fb\u901f\u5ea6\u52a0\u6210)</li>\n\t\t\t<li>\u65bd\u6cd5\u65f6\u95f4 = \u57fa\u7840\u65bd\u6cd5\u65f6\u95f4 / (1 + (\u653b\u51fb / 2000) + \u65bd\u6cd5\u901f\u5ea6)</li>\n\t\t\t<li>\u80fd\u529b\u51b7\u5374\u65f6\u95f4 = \u57fa\u7840\u51b7\u5374\u65f6\u95f4 * 100 / (100 + \u6280\u80fd\u6025\u901f)</li>\n\t\t\t<li>\u7cbe\u786e\u5ea6 = (10 + \u653b\u51fb) * (1 + \u52a0\u6210\u767e\u5206\u6bd4)</li>\n\t\t\t<li>\u4f24\u5bb3 = (10 + [\u8fd1\u6218|\u8fdc\u7a0b|\u9b54\u6cd5|\u9632\u5fa1]) * (1 + \u52a0\u6210\u767e\u5206\u6bd4)</li>\n\t\t\t<li>\u91cd\u76fe\u949d\u51fb\u4f24\u5bb3 = \u949d\u51fb\u4f24\u5bb3 + \u9632\u5fa1\u4f24\u5bb3</li>\n\t\t\t<li>\u8346\u68d8\u4f24\u5bb3 = \u9632\u5fa1\u4f24\u5bb3 * (1 + [\u62a4\u7532|\u6297\u6027] / 100) * \u8346\u68d8%</li>\n\t\t\t<li>\u53cd\u4f24\u4f24\u5bb3 = (\u9632\u5fa1\u4f24\u5bb3 + MIN(\u653b\u51fb\u8005\u672a\u51cf\u514d\u4f24\u5bb3, 5 * \u9632\u5fa1\u4f24\u5bb3)) * \u53cd\u4f24%</li>\n\t\t\t<li>\u547d\u4e2d\u7387 = (\u6211\u7684\u7cbe\u51c6\u5ea6 ^ 1.4) / (\u6211\u7684\u7cbe\u51c6\u5ea6 ^ 1.4 + \u654c\u4eba\u95ea\u907f ^ 1.4)</li>\n\t\t\t<li>\u8fdc\u7a0b\u66b4\u51fb\u52a0\u6210\u7387 = 0.3 * \u547d\u4e2d\u51e0\u7387</li>\n\t\t\t<li>\u95ea\u907f = (10 + \u9632\u5fa1) * (1 + \u52a0\u6210\u767e\u5206\u6bd4)</li>\n\t\t\t<li>\u62a4\u7532 = 0.2 * \u9632\u5fa1 + \u52a0\u6210</li>\n\t\t\t<li>\u53d7\u5230\u7684\u7269\u7406\u4f24\u5bb3\u767e\u5206\u6bd4 = 100 / (100 + \u62a4\u7532)<br />\u5982\u679c\u62a4\u7532\u4e3a\u8d1f\u503c\uff0c\u5219 = (100 - \u62a4\u7532) / 100</li>\n\t\t\t<li>\u6297\u6027 = 0.2 * \u9632\u5fa1 + \u52a0\u6210</li>\n\t\t\t<li>\u53d7\u5230\u7684\u5143\u7d20\u4f24\u5bb3\u767e\u5206\u6bd4 = 100 / (100 + \u6297\u6027)<br />\u5982\u679c\u6297\u6027\u4e3a\u8d1f\u503c\uff0c\u5219 = (100 - \u6297\u6027) / 100</li>\n\t\t\t<li>\u5931\u660e/\u6c89\u9ed8/\u7729\u6655\u51e0\u7387 = \u57fa\u7840\u51e0\u7387 * 100 / (100 + \u97e7\u6027)</li>\n\t\t\t<li>\u88ab\u602a\u7269\u9501\u5b9a\u51e0\u7387 = \u6211\u7684\u5a01\u80c1/(\u56e2\u961f\u603b\u5a01\u80c1)</li>\n\t\t\t<li>\u6218\u6597\u7b49\u7ea7 = 0.1 * (\u8010\u529b + \u667a\u529b + \u653b\u51fb + \u9632\u5fa1 + MAX(\u8fd1\u6218, \u8fdc\u7a0b, \u9b54\u6cd5)) + 0.5 * MAX(\u653b\u51fb, \u9632\u5fa1, \u8fd1\u6218, \u8fdc\u7a0b, \u9b54\u6cd5)</li>\n\t\t\t</ul>\n\t\t\t<br />",
          tasks: "\u4efb\u52a1",
          tasksContent: '<heading>\u4efb\u52a1\u529f\u80fd</heading>\n\t\t\t<text>\u5b8c\u6210\u6559\u7a0b\u540e\uff0c\u4f60\u5c06\u89e3\u9501\u6b64\u529f\u80fd\u3002\u4efb\u52a1\u680f\u4f1a\u968f\u673a\u751f\u6210\u4e0d\u540c\u4e13\u4e1a\u957f\u77ed\u4e0d\u4e00\u7684\u4efb\u52a1\uff0c\u5b8c\u6210\u8fd9\u4e9b\u4efb\u52a1\u5c31\u4f1a\u83b7\u5f97\u5956\u52b1\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u4efb\u52a1\u680f</heading>\n\t\t\t<text>\n\t\t\t<ul>\n\t\t\t\t<li>\u9891\u7387: \u4efb\u52a1\u4f1a\u5b9a\u671f\u5206\u914d\uff0c\u4ece\u6bcf8\u5c0f\u65f6\u4e00\u6b21\u5f00\u59cb\u3002\u5347\u7ea7\u53ef\u4ee5\u5c06\u95f4\u9694\u65f6\u95f4\u7f29\u77ed\u81f3\u6700\u4f4e4\u5c0f\u65f6\u3002</li>\n\t\t\t\t<li>\u79cd\u7c7b: \u4efb\u52a1\u53ef\u80fd\u6d89\u53ca\u91c7\u96c6/\u751f\u4ea7\u4e13\u4e1a\u6216\u51fb\u8d25\u602a\u7269\u3002\u751f\u6210\u7684\u4efb\u52a1\u4f1a\u7a0d\u5fae\u4f18\u5148\u8003\u8651\u73a9\u5bb6\u7b49\u7ea7\u8f83\u9ad8\u7684\u4e13\u4e1a\u3002</li>\n\t\t\t\t<li>\u91cd\u7f6e: \u4f60\u53ef\u4ee5\u4f7f\u7528\u91d1\u5e01\u6216\u725b\u94c3\u91cd\u65b0\u9009\u62e9\u4efb\u52a1\u3002\u6bcf\u6b21\u91cd\u65b0\u9009\u62e9\u7684\u8d39\u7528\u4f1a\u7ffb\u500d(\u6709\u4e0a\u9650)\u3002</li>\n\t\t\t\t<li>\u5bb9\u91cf: \u4efb\u52a1\u6ca1\u6709\u671f\u9650\uff0c\u4f46\u6709\u4efb\u52a1\u69fd\u4f4d\u53ea\u67098\u4e2a\u3002\u4f60\u53ef\u4ee5\u5728\u725b\u94c3\u5546\u5e97\u4e2d\u5347\u7ea7\uff0c\u589e\u52a0\u4efb\u52a1\u69fd\u4f4d\u3002</li>\n\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<br />\n\t\t\t<heading>\u5956\u52b1</heading>\n\t\t\t<text>\n\t\t\t<ul>\n\t\t\t\t<li>\u5b8c\u6210\u4efb\u52a1\u53ef\u83b7\u5f97\u91d1\u5e01\u548c\u4efb\u52a1\u4ee3\u5e01\u3002\u6bcf\u83b7\u5f97\u4e00\u4e2a\u4efb\u52a1\u4ee3\u5e01\u8fd8\u4f1a\u79ef\u7d2f\u4e00\u4e2a\u4efb\u52a1\u70b9\u6570\u3002</li>\n\t\t\t\t<li>\u7d2f\u79ef50\u4e2a\u4efb\u52a1\u70b9\u6570\u5c31\u53ef\u4ee5\u9886\u53d6"\u5c0f\u7d2b\u725b\u7684\u793c\u7269"\uff0c\u6253\u5f00\u540e\u53ef\u4ee5\u83b7\u5f97\u91d1\u5e01\u3001\u4efb\u52a1\u4ee3\u5e01\u3001\u4efb\u52a1\u6c34\u6676\u548c\u5404\u79cd\u6218\u5229\u54c1\u3002</li>\n\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<br />\n\t\t\t<heading>\u4efb\u52a1\u5546\u5e97</heading>\n\t\t\t<text>\u4efb\u52a1\u4ee3\u5e01\u53ef\u5728\u4efb\u52a1\u5546\u5e97\u4e2d\u7528\u4e8e\u8d2d\u4e70\u6c38\u4e45\u5347\u7ea7\u6216\u7269\u54c1\uff0c\u5305\u62ec:\n\t\t\t<ul>\n\t\t\t\t<li>\u4efb\u52a1\u51b7\u5374:\u51cf\u5c11\u4efb\u52a1\u4e4b\u95f4\u7684\u51b7\u5374\u65f6\u95f4\u3002</li>\n\t\t\t\t<li>\u5c4f\u853d\u69fd\u4f4d:\u5141\u8bb8\u5c4f\u853d\u88ab\u5206\u914d\u7279\u5b9a\u4e13\u4e1a\u7684\u4efb\u52a1\u3002\u6218\u6597\u5c4f\u853d\u9700\u8981\u989d\u5916\u4ed8\u8d39\u89e3\u9501\u3002</li>\n\t\t\t\t<li>\u4efb\u52a1\u6c34\u6676:\u7528\u4e8e\u5236\u4f5c\u6216\u5347\u7ea7\u4efb\u52a1\u5fbd\u7ae0\u3002\u4efb\u52a1\u5fbd\u7ae0\u53ef\u5728\u6267\u884c\u4efb\u52a1\u65f6\u63d0\u4f9b\u5927\u91cf\u901f\u5ea6\u6216\u4f24\u5bb3\u52a0\u6210\u3002</li>\n\t\t\t\t<li>\u6218\u5229\u54c1\u7bb1:\u5927\u9668\u77f3\u8231\u3001\u5927\u5de5\u5320\u5323\u548c\u5927\u5b9d\u7bb1\u3002</li>\n\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<br />',
          guild: "\u516c\u4f1a",
          guildContent: "<heading>\u516c\u4f1a</heading>\n\t\t\t<text>\u901a\u8fc7\u5bfc\u822a\u83dc\u5355\u4e2d\u7684[\u516c\u4f1a]\u529f\u80fd\u53d1\u73b0\u516c\u4f1a\u3002\u516c\u4f1a\u7531\u559c\u6b22\u4e00\u8d77\u6e38\u620f\u7684\u73a9\u5bb6\u7ec4\u6210\u3002\u867d\u7136\u516c\u4f1a\u76ee\u524d\u4e3b\u8981\u4f5c\u4e3a\u793e\u4ea4\u4e2d\u5fc3\uff0c\u4f46\u672a\u6765\u63a8\u51fa\u7684\u6269\u5c55\u53ef\u80fd\u4f1a\u5f15\u5165\u66f4\u591a\u4ee5\u56e2\u961f\u4e3a\u5bfc\u5411\u7684\u6d3b\u52a8\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u521b\u5efa\u516c\u4f1a</heading>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u6295\u5165500\u4e07\u91d1\u5e01\u5e76\u9009\u62e9\u4e00\u4e2a\u72ec\u7279\u7684\u516c\u4f1a\u540d\u79f0\uff0c\u5c31\u53ef\u4ee5\u521b\u5efa\u81ea\u5df1\u7684\u516c\u4f1a\u3002\u4f5c\u4e3a\u516c\u4f1a\u7684\u521b\u5efa\u8005\uff0c\u4f60\u5c06\u81ea\u52a8\u6210\u4e3a\u516c\u4f1a\u4f1a\u957f\uff0c\u5728\u516c\u4f1a\u4e2d\u62e5\u6709\u6700\u9ad8\u6743\u529b\u3002\u4e4b\u540e\uff0c\u4f60\u53ef\u4ee5\u9080\u8bf7\u5176\u4ed6\u73a9\u5bb6\u52a0\u5165\u4f60\u7684\u516c\u4f1a\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u52a0\u5165\u516c\u4f1a</heading>\n\t\t\t<text>\u4f60\u53ef\u4ee5\u88ab\u9080\u8bf7\u52a0\u5165\u73b0\u6709\u7684\u516c\u4f1a\u3002\u4f60\u53ef\u4ee5\u5728\u62db\u52df\u804a\u5929\u9891\u9053\u5bfb\u627e\u6b63\u5728\u62db\u4eba\u7684\u516c\u4f1a\uff0c\u516c\u4f1a\u4f1a\u5728\u8be5\u9891\u9053\u79ef\u6781\u5bfb\u627e\u65b0\u6210\u5458\u3002\u4f60\u53ef\u4ee5\u5728\u516c\u4f1a\u9875\u9762\u4e0a\u67e5\u770b\u4f60\u6536\u5230\u7684\u9080\u8bf7\u3002</text>\n\t\t\t<br />\n\t\t\t<heading>\u516c\u4f1a\u529f\u80fd</heading>\n\t\t\t<text>\u516c\u4f1a\u6709\u51e0\u4e2a\u4e3b\u8981\u529f\u80fd:\n\t\t\t<ul>\n\t\t\t\t<li>\u516c\u4f1a\u804a\u5929\u9891\u9053: \u4e00\u4e2a\u79c1\u4eba\u7684\u3001\u81ea\u6211\u7ba1\u7406\u7684\u7a7a\u95f4\uff0c\u4f9b\u516c\u4f1a\u6210\u5458\u8054\u7cfb\u548c\u4ea4\u8c08\u3002</li>\n\t\t\t\t<li>\u516c\u4f1a\u516c\u544a\u680f: \u4e00\u4e2a\u53ef\u7531\u4f1a\u957f\u6216\u5c06\u519b\u7f16\u8f91\u7684\u516c\u544a\u677f\uff0c\u7528\u4e8e\u901a\u77e5\u6240\u6709\u6210\u5458\u3002</li>\n\t\t\t\t<li>\u516c\u4f1a\u7b49\u7ea7: \u968f\u7740\u6210\u5458\u5728\u5404\u79cd\u4e13\u4e1a\u83b7\u5f97\u7ecf\u9a8c\uff0c\u516c\u4f1a\u4f1a\u4ee51:1000\u7684\u6bd4\u4f8b\u79ef\u7d2f\u516c\u4f1a\u7ecf\u9a8c\uff0c\u4ece\u800c\u63d0\u5347\u516c\u4f1a\u7b49\u7ea7\u3002\u6839\u636e\u516c\u4f1a\u7b49\u7ea7\u548c\u7ecf\u9a8c\u6500\u5347\u6392\u884c\u699c\u3002</li>\n\t\t\t\t<li>\u6210\u5458\u540d\u989d: \u516c\u4f1a\u521d\u59cb\u65f6\u6709 {{defaultGuildMemberCount}} \u4e2a\u4f1a\u5458\u540d\u989d\uff0c\u6bcf\u63d0\u5347 {{guildLevelsPerMaxMember}} \u4e2a\u516c\u4f1a\u7b49\u7ea7\u53ef\u589e\u52a0 1 \u4e2a\u540d\u989d\u3002</li>\n\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<br />\n\t\t\t<heading>\u6210\u5458\u89d2\u8272</heading>\n\t\t\t<text>\u516c\u4f1a\u5177\u6709\u4e0d\u540c\u7684\u89d2\u8272\u548c\u6743\u9650\u3002\u8f83\u9ad8\u7b49\u7ea7\u7684\u89d2\u8272\u81ea\u52a8\u5177\u6709\u4efb\u4f55\u8f83\u4f4e\u7ea7\u89d2\u8272\u7684\u6743\u9650:\n\t\t\t<ul>\n\t\t\t\t<li>\u4f1a\u957f\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li>\u53ef\u5c06\u9886\u5bfc\u6743\u4f20\u7ed9\u53e6\u4e00\u4f4d\u6210\u5458\u3002</li>\n\t\t\t\t\t\t<li>\u5f53\u516c\u4f1a\u7a7a\u65e0\u4e00\u4eba\u65f6\uff0c\u6709\u6743\u89e3\u6563\u516c\u4f1a\u3002</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>\n\t\t\t\t<li>\u5c06\u519b\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li>\u6709\u6743\u63d0\u5347\u6216\u964d\u7ea7\u4efb\u4f55\u4f4e\u7ea7\u6210\u5458\u3002</li>\n\t\t\t\t\t\t<li>\u53ef\u7f16\u8f91\u516c\u4f1a\u516c\u544a\u680f\u3002</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>\n\t\t\t\t<li>\u5b98\u5458\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li>\u53ef\u9080\u8bf7\u65b0\u6210\u5458\u52a0\u5165\u516c\u4f1a\u3002</li>\n\t\t\t\t\t\t<li>\u53ef\u5c06\u4f4e\u7ea7\u522b\u6210\u5458\u8e22\u51fa\u516c\u4f1a\u3002</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>\n\t\t\t\t<li>\u4f1a\u5458\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li>\u53ef\u4ee5\u67e5\u770b\u516c\u4f1a\u6982\u51b5\u3002</li>\n\t\t\t\t\t\t<li>\u53ef\u4ee5\u67e5\u770b\u516c\u4f1a\u804a\u5929\u9891\u9053\u5e76\u8fdb\u884c\u4ea4\u8c08\u3002</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>\n\t\t\t\t<li>\u5df2\u9080\u8bf7\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li>\u5728\u63a5\u53d7\u516c\u4f1a\u9080\u8bf7\u4e4b\u524d\u6ca1\u6709\u8bbf\u95ee\u6743\u9650</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t</text>\n\t\t\t<br />",
          chatCommands: "\u804a\u5929\u547d\u4ee4",
          chatCommandsContent: "<heading>\u804a\u5929\u547d\u4ee4</heading>\n\t\t\t<text>\n\t\t\t\t<chatCommand>/w [\u540d\u79f0] [\u4fe1\u606f]</chatCommand> - \u4e0e\u5176\u4ed6\u73a9\u5bb6\u79c1\u804a<br />\n\t\t\t\t<chatCommand>/r</chatCommand> - \u56de\u590d\u6700\u540e\u4e00\u6761\u79c1\u804a<br />\n\t\t\t\t<chatCommand>/profile [\u540d\u79f0]</chatCommand> - \u67e5\u770b\u73a9\u5bb6\u8d44\u6599<br />\n\t\t\t\t<chatCommand>/friend [\u540d\u79f0]</chatCommand> - \u6dfb\u52a0\u597d\u53cb<br />\n\t\t\t\t<chatCommand>/block [\u540d\u79f0]</chatCommand> - \u5c4f\u853d\u73a9\u5bb6<br />\n\t\t\t</text>\n\t\t\t<br />",
          experienceTable: "\u7ecf\u9a8c\u8868"
        },
        gameRulesPanel: {
          gameRules: "\u6e38\u620f\u89c4\u5219"
        },
        gameRulesText: {
          content: "<div>\n\t\t\t\t\u94f6\u6cb3\u5976\u725b\u653e\u7f6e\u7684\u89c4\u5219\u65e8\u5728\u786e\u4fdd\u6240\u6709\u73a9\u5bb6\u90fd\u80fd\u83b7\u5f97\u6109\u5feb\u3001\u516c\u5e73\u7684\u6e38\u620f\u4f53\u9a8c\u3002\n\t\t\t\t\u8fdd\u53cd\u89c4\u5219\u5c06\u6839\u636e\u8fdd\u89c4\u884c\u4e3a\u7684\u7c7b\u578b\u548c\u4e25\u91cd\u7a0b\u5ea6\u53d7\u5230\u76f8\u5e94\u7684\u5904\u7f5a\uff0c\u5305\u62ec\u8b66\u544a\u3001\u7981\u8a00\u3001\u7269\u54c1\u79fb\u9664\u3001\u4ea4\u6613\u7981\u6b62\u6216\u8d26\u6237\u5c01\u7981\u3002\n\t\t\t\t<br /><br />\n\t\t\t</div>\n\t\t\t<olMain>\n\t\t\t\t<li><b>\u5e10\u53f7</b>\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u4ec5\u9650\u4e00\u4e2a\u8d26\u6237: </b>\n\t\t\t\t\t\t\t\u6bcf\u4e2a\u4eba\u53ea\u80fd\u4f7f\u7528\u4e00\u4e2a\u8d26\u6237\u8fdb\u884c\u6e38\u620f\u3002\u6e38\u5ba2\u4e5f\u88ab\u89c6\u4e3a\u8d26\u6237\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u4e0d\u5f97\u5171\u4eab\u8d26\u6237: </b>\n\t\t\t\t\t\t\t\u4e0d\u5f97\u4e0e\u5176\u4ed6\u73a9\u5bb6\u5171\u4eab\u8d26\u6237\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u4e0d\u5f97\u4f7f\u7528\u4e0d\u6070\u5f53\u7684\u540d\u79f0: </b>\n\t\t\t\t\t\t\t\u540d\u79f0\u4e0d\u5f97\u5177\u6709\u5192\u72af\u6027\u3001\u8272\u60c5\u3001\u5192\u5145\u4ed6\u4eba\u6216\u4f7f\u7528\u77e5\u540d\u73b0\u5b9e\u4eba\u7269\u7684\u540d\u5b57\u3002\u4e0d\u9002\u5f53\u7684\u540d\u79f0\u53ef\u5bfc\u81f4\u7981\u8a00\u548c\u5f3a\u5236\u66f4\u540d\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u4ec5\u965013\u5c81\u4ee5\u4e0a\u73a9\u5bb6: </b>\n\t\t\t\t\t\t\t\u6839\u636e\u7f8e\u56fdCOPPA\u300a\u513f\u7ae5\u5728\u7ebf\u9690\u79c1\u4fdd\u62a4\u6cd5\u6848\u300b\u89c4\u5b9a\uff0c\u4f60\u5fc5\u987b\u5e74\u6ee1 13 \u5468\u5c81\u624d\u80fd\u6ce8\u518c\u548c\u6e38\u620f\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t</li>\n\t\t\t\t<li><b>\u4ea4\u6613</b>\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u7981\u6b62\u771f\u5b9e\u4e16\u754c\u4ea4\u6613/\u4ea4\u53c9\u4ea4\u6613: </b>\n\t\t\t\t\t\t\t\u8bf7\u52ff\u5728\u94f6\u6cb3\u5976\u725b\u653e\u7f6e\u4e2d\u4ea4\u6613\u7269\u54c1\u6216\u670d\u52a1\u4ee5\u6362\u53d6\u6e38\u620f\u5916\u7684\u4efb\u4f55\u4e1c\u897f\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u7981\u6b62\u8d22\u5bcc\u8f6c\u79fb: </b>\n\t\t\t\t\t\t\t\u4e0d\u5f97\u5411\u4efb\u4f55\u73a9\u5bb6\u8f93\u9001\u8d22\u4ea7\u3002\u73a9\u5bb6\u63a5\u53d7\u7684\u6240\u6709\u793c\u7269\u603b\u4ef7\u503c\u4e0d\u5f97\u8d85\u8fc7 10M \u91d1\u5e01\u3002\u8d85\u8fc7\u8be5\u9650\u5236\u7684\u8d22\u5bcc\u8f6c\u79fb\u884c\u4e3a\uff0c\u65e0\u8bba\u662f\u5426\u6545\u610f\uff0c\u5747\u4f1a\u88ab\u89c6\u4e3a\u8fdd\u89c4\u884c\u4e3a\u3002\u975e\u6545\u610f\u7684\u8f6c\u79fb (\u4f8b\u5982\uff1a\u5728\u5e02\u573a\u4e0a\u5076\u7136\u8d2d\u4e70\u5230\u8d85\u4f4e\u4ef7\u7684\u7269\u54c1) \u4f1a\u88ab\u79fb\u9664\u76f8\u5173\u6536\u76ca\u3002\u6545\u610f\u7684\u8f6c\u79fb\u5c06\u6839\u636e\u4e25\u91cd\u7a0b\u5ea6\u53d7\u5230\u989d\u5916\u5904\u7f5a\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u7981\u6b62\u6b3a\u8bc8: </b>\n\t\t\t\t\t\t\t\u4e0d\u5f97\u4f7f\u7528\u6b3a\u9a97\u6216\u6572\u8bc8\u624b\u6bb5\u4ece\u5176\u4ed6\u73a9\u5bb6\u5904\u83b7\u5f97\u7269\u54c1\u3002\u5982\u6709\u8db3\u591f\u8bc1\u636e\uff0c\u6211\u4eec\u5c06\u5bf9\u6b3a\u8bc8\u8005\u91c7\u53d6\u884c\u52a8\u3002\u4f46\u56e0\u6b3a\u8bc8\u800c\u4e22\u5931\u7684\u7269\u54c1\u5c06\u4e0d\u4e88\u9000\u8fd8\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u57287\u5929\u5185\u507f\u8fd8\u8d37\u6b3e: </b>\n\t\t\t\t\t\t\t\u8d37\u6b3e\u98ce\u9669\u81ea\u8d1f\u30027\u5929\u5185\u672a\u507f\u8fd8\u7684\u8d37\u6b3e\u5c06\u88ab\u89c6\u4e3a\u8d22\u5bcc\u8f6c\u79fb/\u6b3a\u8bc8\u884c\u4e3a\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t</li>\n\t\t\t\t<li><b>\u804a\u5929</b>\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u8bf7\u76f8\u4e92\u5c0a\u91cd\uff0c\u53cb\u5584\u4ea4\u6d41: </b>\n\t\t\t\t\t\t\t\u804a\u5929\u89c4\u5219\u7684\u7b2c\u4e00\u6761\u5c31\u662f\u5c0a\u91cd\u5176\u4ed6\u73a9\u5bb6\u3002\u6211\u4eec\u7684\u76ee\u6807\u662f\u521b\u5efa\u4e00\u4e2a\u4eba\u4eba\u90fd\u80fd\u4eab\u53d7\u7684\u53cb\u597d\u793e\u533a\u7a7a\u95f4\u3002\n\t\t\t\t\t\t\t\u8bf7\u907f\u514d\u6545\u610f\u4e0e\u4ed6\u4eba\u5bf9\u7acb\u6216\u9a9a\u6270\u4ed6\u4eba\u3002\n\t\t\t\t\t\t\t\u867d\u7136\u5076\u5c14\u4f7f\u7528\u810f\u8bdd\u5e76\u4e0d\u8fdd\u53cd\u89c4\u5b9a\uff0c\u4f46\u8bf7\u4e0d\u8981\u8fc7\u5ea6\u4f7f\u7528\u810f\u8bdd\uff0c\u5c24\u5176\u662f\u9488\u5bf9\u5176\u4ed6\u73a9\u5bb6\u65f6\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u82f1\u8bed\u804a\u5929\u9891\u9053\u4ec5\u9650\u82f1\u8bed: </b>\n\t\t\t\t\t\t\t\u8bf7\u5728\u82f1\u8bed\u804a\u5929\u9891\u9053\u4f7f\u7528\u82f1\u8bed\u3002\u5176\u4ed6\u9891\u9053\u53ef\u4f7f\u7528\u4e0d\u540c\u8bed\u8a00\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u7981\u6b62\u6b67\u89c6: </b>\n\t\t\t\t\t\t\t\u8bf7\u52ff\u4f7f\u7528\u9488\u5bf9\u4efb\u4f55\u4e2a\u4eba\u6216\u7fa4\u4f53\u7684\u6c61\u8a00\u79fd\u8bed\u3001\u4fda\u8bed\u6216\u4efb\u4f55\u653b\u51fb\u6027\u8bdd\u8bed\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u7981\u6b62\u975e\u6cd5\u6216\u8272\u60c5\u8bdd\u9898: </b>\n\t\t\t\t\t\t\t\u8bf7\u52ff\u8ba8\u8bba\u975e\u6cd5\u6216\u8272\u60c5\u8bdd\u9898\u3002\u7981\u6b62\u53d1\u9001\u975e\u6cd5\u6d3b\u52a8\u6216\u8272\u60c5\u8bdd\u9898\u7684\u5916\u90e8\u94fe\u63a5\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u907f\u514d\u654f\u611f\u8bdd\u9898\u6216\u95f9\u5267: </b>\n\t\t\t\t\t\t\t\u8bf7\u907f\u514d\u8ba8\u8bba\u5bb9\u6613\u5f15\u53d1\u4e89\u8bae\u6216\u95f9\u5267\u7684\u654f\u611f\u8bdd\u9898\u3002\n\t\t\t\t\t\t\t\u8fd9\u5305\u62ec\u4f46\u4e0d\u9650\u4e8e\u653f\u6cbb\u3001\u5b97\u6559\u3001\u56fd\u9645\u51b2\u7a81\u3001\u6027\u522b\u8ba8\u8bba\u3001\u6027\u53d6\u5411\u3001\n\t\t\t\t\t\t\t\u7981\u8a00/\u5c01\u7981\u6295\u8bc9\uff0c\u4ee5\u53ca\u5176\u4ed6\u5bb9\u6613\u5f15\u53d1\u7eb7\u4e89\u7684\u8bdd\u9898\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u7981\u6b62\u6076\u610f\u5237\u5c4f: </b>\n\t\t\t\t\t\t\t\u8bf7\u52ff\u5728\u804a\u5929\u4e2d\u53d1\u9001\u5927\u91cf\u4e0d\u5fc5\u8981\u7684\u5783\u573e\u4fe1\u606f\u3001\u8fc7\u5ea6\u4f7f\u7528\u5927\u5199\u5b57\u6bcd\u3001\u6216\u5411\u4ed6\u4eba\u4e5e\u8ba8\u514d\u8d39\u7269\u54c1\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u8bf7\u52ff\u9f13\u52b1\u4ed6\u4eba\u8fdd\u53cd\u89c4\u5219: </b>\n\t\t\t\t\t\t\t\u4e0d\u8981\u8bef\u5bfc\u6216\u6002\u607f\u5176\u4ed6\u73a9\u5bb6\u8fdd\u53cd\u6e38\u620f\u89c4\u5219\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u4e0d\u8981\u6cc4\u9732\u4e2a\u4eba\u4fe1\u606f: </b>\n\t\t\t\t\t\t\t\u8bf7\u52ff\u62ab\u9732\u53ef\u8bc6\u522b\u7684\u4e2a\u4eba\u4fe1\u606f\uff0c\u5305\u62ec\u4f46\u4e0d\u9650\u4e8e\u4f60\u7684\u5168\u540d\u3001\u5730\u5740\u3001\u7535\u8bdd\u53f7\u7801\u548c\u7535\u5b50\u90ae\u4ef6\u3002\n\t\t\t\t\t\t\t\u6b64\u5916\uff0c\u8bf7\u52ff\u62ab\u9732\u5176\u4ed6\u73a9\u5bb6\u672a\u516c\u5f00\u7684\u4efb\u4f55\u4e2a\u4eba\u4fe1\u606f\uff0c\u5982\u59d3\u540d\u3001\u5e74\u9f84\u6216\u6240\u5728\u5730\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u6240\u6709\u5e7f\u544a\u5fc5\u987b\u5728\u9002\u5f53\u7684\u6e20\u9053\u53d1\u5e03: </b>\n\t\t\t\t\t\t\t\u6240\u6709\u8d2d\u4e70\u3001\u51fa\u552e\u6216\u670d\u52a1\u8bf7\u6c42\u5e94\u5728\u4ea4\u6613\u9891\u9053\u4e2d\u8fdb\u884c\u3002\u516c\u4f1a/\u961f\u4f0d\u62db\u52df\u6216\u5bfb\u6c42\u52a0\u5165\u516c\u4f1a/\u961f\u4f0d\u7684\u8bf7\u6c42\u5e94\u5728\u62db\u52df\u9891\u9053\u63d0\u51fa\u3002\n\t\t\t\t\t\t\t\u5141\u8bb8\u5728\u5927\u591a\u804a\u5929\u9891\u9053\u4e2d\u8be2\u95ee\u4ef7\u683c\u3002\u7981\u6b62\u9080\u8bf7/\u63a8\u8350\u94fe\u63a5\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u542c\u4ece<modIcon />\u7ba1\u7406\u5458\u5b89\u6392: </b>\n\t\t\t\t\t\t\t\u4e3a\u4e86\u4fdd\u6301\u826f\u597d\u7684\u804a\u5929\u73af\u5883\uff0c\u7ba1\u7406\u5458\u4f1a\u5bf9\u5404\u804a\u5929\u9891\u9053\u8fdb\u884c\u7ba1\u7406\u3002\n\t\t\t\t\t\t\t\u8bf7\u914d\u5408\u5e76\u5c0a\u91cd\u4ed6\u4eec\u7684\u8981\u6c42\u3002\u5982\u679c\u5bf9\u7ba1\u7406\u5458\u6709\u4efb\u4f55\u4e89\u6267\u6216\u6295\u8bc9\uff0c\u8bf7\u901a\u8fc7Discord\u7533\u8bc9\u6216\u53d1\u9001\u7535\u5b50\u90ae\u4ef6\u81f3contact@milkywayidle.com\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t</li>\n\t\t\t\t<li><b>\u673a\u5668\u4eba\u3001\u811a\u672c\u548c\u6269\u5c55</b>\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u7981\u6b62\u673a\u5668\u4eba: </b>\n\t\t\t\t\t\t\t\u8bf7\u52ff\u4f7f\u7528\u4efb\u4f55\u81ea\u52a8\u5316\u7a0b\u5e8f\u4ee3\u66ff\u4f60\u64cd\u4f5c\u6e38\u620f\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u811a\u672c\u548c\u6269\u5c55: </b>\n\t\t\t\t\t\t\t\u4efb\u4f55\u811a\u672c\u6216\u6269\u5c55\u7a0b\u5e8f\u90fd\u4e0d\u5f97\u4e3a\u73a9\u5bb6\u6267\u884c\u4efb\u4f55\u64cd\u4f5c(\u5411\u670d\u52a1\u5668\u53d1\u9001\u4efb\u4f55\u8bf7\u6c42)\uff0c\n\t\t\t\t\t\t\t\u4ec5\u9650\u4f7f\u7528\u4e8e\u663e\u793a\u4fe1\u606f\u6216\u6539\u8fdb\u7528\u6237\u754c\u9762 (\u4f8b\u5982: \u663e\u793a\u6218\u6597\u6458\u8981\u3001\u8ddf\u8e2a\u6389\u843d\u3001\u5c06\u6309\u94ae\u79fb\u52a8\u5230\u4e0d\u540c\u4f4d\u7f6e)\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t</li>\n\t\t\t\t<li><b>\u9519\u8bef\u548c\u6f0f\u6d1e</b>\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<b>\u4e0d\u5f97\u6ee5\u7528\u6f0f\u6d1e: </b>\n\t\t\t\t\t\t\t\u8bf7\u52ff\u6ee5\u7528\u6e38\u620f\u9519\u8bef\u6216\u6f0f\u6d1e\u6765\u4e3a\u81ea\u5df1\u8c0b\u5229\u3002\u8bf7\u901a\u8fc7Discord\u544a\u8bc9\u6211\u4eec\uff0c\u8c22\u8c22\u3002\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ol>\n\t\t\t\t</li>\n\t\t\t</olMain>\n\t\t\t<br />"
        }
      },
      ...{
        gameModeNames: {
          standard: "\u6807\u51c6",
          ironcow: "\u94c1\u725b",
          legacy_ironcow: "\u4f20\u7edf\u94c1\u725b"
        },
        gameModeDescriptions: {
          standard: "\u6807\u51c6\u6e38\u620f\u6a21\u5f0f\u9002\u5408\u5927\u591a\u6570\u73a9\u5bb6\uff0c\u6ca1\u6709\u529f\u80fd\u9650\u5236\u3002",
          ironcow: "\u94c1\u725b\u6e38\u620f\u6a21\u5f0f\u9002\u5408\u559c\u6b22\u81ea\u529b\u66f4\u751f\u7684\u73a9\u5bb6\u3002\u4f60\u4e0d\u80fd\u4f7f\u7528\u5e02\u573a\u4e0e\u5176\u4ed6\u73a9\u5bb6\u4ea4\u6613(\u4f8b\u5916: \u5141\u8bb8\u8d2d\u4e70\u725b\u94c3)\u3002",
          legacy_ironcow: ""
        },
        skillNames: {
          "/skills/total_level": "\u603b\u7b49\u7ea7",
          "/skills/milking": "\u6324\u5976",
          "/skills/foraging": "\u91c7\u6458",
          "/skills/woodcutting": "\u4f10\u6728",
          "/skills/cheesesmithing": "\u5976\u916a\u953b\u9020",
          "/skills/crafting": "\u5236\u4f5c",
          "/skills/tailoring": "\u7f1d\u7eab",
          "/skills/cooking": "\u70f9\u996a",
          "/skills/brewing": "\u51b2\u6ce1",
          "/skills/alchemy": "\u70bc\u91d1",
          "/skills/enhancing": "\u5f3a\u5316",
          "/skills/stamina": "\u8010\u529b",
          "/skills/intelligence": "\u667a\u529b",
          "/skills/attack": "\u653b\u51fb",
          "/skills/defense": "\u9632\u5fa1",
          "/skills/melee": "\u8fd1\u6218",
          "/skills/ranged": "\u8fdc\u7a0b",
          "/skills/magic": "\u9b54\u6cd5"
        },
        abilityNames: {
          "/abilities/poke": "\u7834\u80c6\u4e4b\u523a",
          "/abilities/impale": "\u900f\u9aa8\u4e4b\u523a",
          "/abilities/puncture": "\u7834\u7532\u4e4b\u523a",
          "/abilities/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
          "/abilities/scratch": "\u722a\u5f71\u65a9",
          "/abilities/cleave": "\u5206\u88c2\u65a9",
          "/abilities/maim": "\u8840\u5203\u65a9",
          "/abilities/crippling_slash": "\u81f4\u6b8b\u65a9",
          "/abilities/smack": "\u91cd\u78be",
          "/abilities/sweep": "\u91cd\u626b",
          "/abilities/stunning_blow": "\u91cd\u9524",
          "/abilities/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
          "/abilities/shield_bash": "\u76fe\u51fb",
          "/abilities/quick_shot": "\u5feb\u901f\u5c04\u51fb",
          "/abilities/aqua_arrow": "\u6d41\u6c34\u7bad",
          "/abilities/flame_arrow": "\u70c8\u7130\u7bad",
          "/abilities/rain_of_arrows": "\u7bad\u96e8",
          "/abilities/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
          "/abilities/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
          "/abilities/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
          "/abilities/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
          "/abilities/water_strike": "\u6d41\u6c34\u51b2\u51fb",
          "/abilities/ice_spear": "\u51b0\u67aa\u672f",
          "/abilities/frost_surge": "\u51b0\u971c\u7206\u88c2",
          "/abilities/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
          "/abilities/entangle": "\u7f20\u7ed5",
          "/abilities/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
          "/abilities/natures_veil": "\u81ea\u7136\u83cc\u5e55",
          "/abilities/life_drain": "\u751f\u547d\u5438\u53d6",
          "/abilities/fireball": "\u706b\u7403",
          "/abilities/flame_blast": "\u7194\u5ca9\u7206\u88c2",
          "/abilities/firestorm": "\u706b\u7130\u98ce\u66b4",
          "/abilities/smoke_burst": "\u70df\u7206\u706d\u5f71",
          "/abilities/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
          "/abilities/heal": "\u81ea\u6108\u672f",
          "/abilities/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
          "/abilities/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
          "/abilities/taunt": "\u5632\u8bbd",
          "/abilities/provoke": "\u6311\u8845",
          "/abilities/toughness": "\u575a\u97e7",
          "/abilities/elusiveness": "\u95ea\u907f",
          "/abilities/precision": "\u7cbe\u786e",
          "/abilities/berserk": "\u72c2\u66b4",
          "/abilities/frenzy": "\u72c2\u901f",
          "/abilities/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
          "/abilities/spike_shell": "\u5c16\u523a\u9632\u62a4",
          "/abilities/retribution": "\u60e9\u6212",
          "/abilities/vampirism": "\u5438\u8840",
          "/abilities/revive": "\u590d\u6d3b",
          "/abilities/insanity": "\u75af\u72c2",
          "/abilities/invincible": "\u65e0\u654c",
          "/abilities/speed_aura": "\u901f\u5ea6\u5149\u73af",
          "/abilities/guardian_aura": "\u5b88\u62a4\u5149\u73af",
          "/abilities/fierce_aura": "\u7269\u7406\u5149\u73af",
          "/abilities/critical_aura": "\u66b4\u51fb\u5149\u73af",
          "/abilities/mystic_aura": "\u5143\u7d20\u5149\u73af",
          "/abilities/promote": "\u664b\u5347"
        },
        abilityDescriptions: {
          "/abilities/poke": "\u6233\u5411\u76ee\u6807\u654c\u4eba",
          "/abilities/impale": "\u523a\u7a7f\u76ee\u6807\u654c\u4eba",
          "/abilities/puncture": "\u51fb\u7834\u76ee\u6807\u654c\u4eba\u7684\u62a4\u7532\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u4e34\u65f6\u964d\u4f4e\u5176\u62a4\u7532",
          "/abilities/penetrating_strike": "\u523a\u5411\u76ee\u6807\u654c\u4eba\uff0c\u5982\u679c\u547d\u4e2d\uff0c\u5219\u8d2f\u7a7f\u5e76\u523a\u5411\u4e0b\u4e00\u4e2a\u654c\u4eba",
          "/abilities/scratch": "\u6293\u4f24\u76ee\u6807\u654c\u4eba",
          "/abilities/cleave": "\u5288\u780d\u6240\u6709\u654c\u4eba",
          "/abilities/maim": "\u5212\u4f24\u76ee\u6807\u654c\u4eba\uff0c\u5e76\u4f7f\u5176\u6d41\u8840",
          "/abilities/crippling_slash": "\u65a9\u51fb\u6240\u6709\u654c\u4eba\uff0c\u5e76\u51cf\u5c11\u5176\u4f24\u5bb3",
          "/abilities/smack": "\u731b\u51fb\u76ee\u6807\u654c\u4eba",
          "/abilities/sweep": "\u5bf9\u6240\u6709\u654c\u4eba\u8fdb\u884c\u6a2a\u626b\u653b\u51fb",
          "/abilities/stunning_blow": "\u91cd\u9524\u76ee\u6807\u654c\u4eba\uff0c\u5e76\u6709\u51e0\u7387\u4f7f\u5176\u7729\u6655",
          "/abilities/fracturing_impact": "\u5bf9\u6240\u6709\u654c\u4eba\u9020\u6210\u4f24\u5bb3\uff0c\u5e76\u589e\u52a0\u5176\u6240\u53d7\u4f24\u5bb3",
          "/abilities/shield_bash": "\u76fe\u51fb\u76ee\u6807\u654c\u4eba",
          "/abilities/quick_shot": "\u5bf9\u76ee\u6807\u654c\u4eba\u8fdb\u884c\u5feb\u901f\u5c04\u51fb",
          "/abilities/aqua_arrow": "\u5411\u76ee\u6807\u654c\u4eba\u5c04\u51fa\u6c34\u7bad",
          "/abilities/flame_arrow": "\u5411\u76ee\u6807\u654c\u4eba\u5c04\u51fa\u706b\u7130\u7bad",
          "/abilities/rain_of_arrows": "\u5411\u6240\u6709\u654c\u4eba\u5c04\u51fa\u7bad\u96e8",
          "/abilities/silencing_shot": "\u5bf9\u76ee\u6807\u654c\u4eba\u5c04\u51fb\uff0c\u5e76\u4f7f\u5176\u6c89\u9ed8",
          "/abilities/steady_shot": "\u4ee5\u6781\u9ad8\u7684\u7cbe\u51c6\u5bf9\u76ee\u6807\u654c\u4eba\u8fdb\u884c\u5c04\u51fb",
          "/abilities/pestilent_shot": "\u5bf9\u76ee\u6807\u654c\u4eba\u5c04\u51fb\uff0c\u5e76\u51cf\u5c11\u62a4\u7532\u548c\u9b54\u6297",
          "/abilities/penetrating_shot": "\u5c04\u51fb\u76ee\u6807\u654c\u4eba\uff0c\u5982\u679c\u547d\u4e2d\uff0c\u5219\u8d2f\u7a7f\u5e76\u5c04\u5411\u4e0b\u4e00\u4e2a\u654c\u4eba",
          "/abilities/water_strike": "\u5bf9\u76ee\u6807\u654c\u4eba\u4f7f\u7528\u6d41\u6c34\u51b2\u51fb",
          "/abilities/ice_spear": "\u5bf9\u76ee\u6807\u654c\u4eba\u6295\u63b7\u51b0\u77db\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u964d\u4f4e\u5176\u653b\u51fb\u901f\u5ea6",
          "/abilities/frost_surge": "\u5bf9\u6240\u6709\u654c\u4eba\u65bd\u653e\u51b0\u971c\u7206\u88c2,\u9020\u6210\u4f24\u5bb3\u5e76\u51cf\u5c11\u95ea\u907f",
          "/abilities/mana_spring": "\u5bf9\u6240\u6709\u654c\u4eba\u91ca\u653e\u6cd5\u529b\u55b7\u6cc9\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u589e\u52a0\u53cb\u65b9MP\u6062\u590d",
          "/abilities/entangle": "\u7f20\u7ed5\u76ee\u6807\u654c\u4eba\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u6709\u51e0\u7387\u4f7f\u5176\u7729\u6655",
          "/abilities/toxic_pollen": "\u5bf9\u6240\u6709\u654c\u4eba\u65bd\u653e\u5267\u6bd2\u7c89\u5c18\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u51cf\u5c11\u62a4\u7532\u548c\u9b54\u6297",
          "/abilities/natures_veil": "\u7ed9\u6240\u6709\u654c\u4eba\u8499\u4e0a\u4e00\u5c42\u83cc\u5e55\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u6709\u51e0\u7387\u4f7f\u5176\u5931\u660e",
          "/abilities/life_drain": "\u5438\u53d6\u76ee\u6807\u654c\u4eba\u7684\u751f\u547d\u529b\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u6cbb\u7597\u81ea\u5df1",
          "/abilities/fireball": "\u5bf9\u76ee\u6807\u654c\u4eba\u65bd\u653e\u706b\u7403",
          "/abilities/flame_blast": "\u5bf9\u6240\u6709\u654c\u4eba\u65bd\u653e\u7194\u5ca9\u7206\u88c2",
          "/abilities/firestorm": "\u5bf9\u6240\u6709\u654c\u4eba\u65bd\u653e\u706b\u7130\u98ce\u66b4",
          "/abilities/smoke_burst": "\u5bf9\u76ee\u6807\u654c\u4eba\u91ca\u653e\u70df\u7206\u706d\u5f71\uff0c\u9020\u6210\u4f24\u5bb3\u5e76\u51cf\u5c11\u7cbe\u51c6",
          "/abilities/minor_heal": "\u5bf9\u81ea\u5df1\u65bd\u653e\u521d\u7ea7\u6cbb\u7597\u672f",
          "/abilities/heal": "\u5bf9\u81ea\u5df1\u65bd\u653e\u6cbb\u7597\u672f",
          "/abilities/quick_aid": "\u5bf9HP%\u6700\u4f4e\u7684\u961f\u53cb\u65bd\u653e\u6cbb\u7597\u672f",
          "/abilities/rejuvenate": "\u6cbb\u7597\u6240\u6709\u961f\u53cb",
          "/abilities/taunt": "\u5927\u5e45\u589e\u52a0\u5a01\u80c1\u7b49\u7ea7",
          "/abilities/provoke": "\u6781\u5927\u5730\u589e\u52a0\u5a01\u80c1\u7b49\u7ea7",
          "/abilities/toughness": "\u4e34\u65f6\u5927\u5e45\u589e\u52a0\u62a4\u7532\u548c\u6297\u6027",
          "/abilities/elusiveness": "\u4e34\u65f6\u5927\u5e45\u589e\u52a0\u95ea\u907f",
          "/abilities/precision": "\u4e34\u65f6\u5927\u5e45\u589e\u52a0\u7cbe\u51c6",
          "/abilities/berserk": "\u4e34\u65f6\u5927\u5e45\u589e\u52a0\u7269\u7406\u4f24\u5bb3",
          "/abilities/frenzy": "\u4e34\u65f6\u5927\u5e45\u589e\u52a0\u653b\u51fb\u901f\u5ea6",
          "/abilities/elemental_affinity": "\u4e34\u65f6\u5927\u5e45\u589e\u52a0\u5143\u7d20\u4f24\u5bb3",
          "/abilities/spike_shell": "\u4e34\u65f6\u83b7\u5f97\u7269\u7406\u548c\u5143\u7d20\u8346\u68d8",
          "/abilities/retribution": "\u4e34\u65f6\u83b7\u5f97\u53cd\u4f24\u5f3a\u5ea6",
          "/abilities/vampirism": "\u4e34\u65f6\u83b7\u5f97\u751f\u547d\u5077\u53d6",
          "/abilities/revive": "\u590d\u6d3b\u4e00\u4f4d\u6b7b\u4ea1\u7684\u961f\u53cb",
          "/abilities/insanity": "\u4ee5HP\u4e3a\u4ee3\u4ef7\uff0c\u4e34\u65f6\u589e\u52a0\u4f24\u5bb3\u3001\u653b\u51fb\u901f\u5ea6\u548c\u65bd\u6cd5\u901f\u5ea6",
          "/abilities/invincible": "\u4e34\u65f6\u6781\u5927\u589e\u52a0\u62a4\u7532\u3001\u6297\u6027\u548c\u97e7\u6027",
          "/abilities/speed_aura": "\u589e\u52a0\u6240\u6709\u961f\u53cb\u7684\u653b\u51fb\u901f\u5ea6\u548c\u65bd\u6cd5\u901f\u5ea6\uff0c\u6548\u679c\u968f\u65bd\u6cd5\u8005\u7684\u653b\u51fb\u6bcf\u7ea7\u589e\u52a0(0.005x)",
          "/abilities/guardian_aura": "\u589e\u52a0\u6240\u6709\u961f\u53cb\u7684\u6cbb\u7597\u589e\u5e45\u3001\u95ea\u907f\u3001\u62a4\u7532\u548c\u6297\u6027\uff0c\u6548\u679c\u968f\u65bd\u6cd5\u8005\u7684\u9632\u5fa1\u6bcf\u7ea7\u589e\u52a0(0.005x)",
          "/abilities/fierce_aura": "\u589e\u52a0\u6240\u6709\u961f\u53cb\u7684\u7269\u7406\u589e\u5e45\uff0c\u6548\u679c\u968f\u65bd\u6cd5\u8005\u7684\u8fd1\u6218\u6bcf\u7ea7\u589e\u52a0(0.005x)",
          "/abilities/critical_aura": "\u589e\u52a0\u6240\u6709\u961f\u53cb\u7684\u66b4\u51fb\u7387\u548c\u66b4\u51fb\u4f24\u5bb3\uff0c\u6548\u679c\u968f\u65bd\u6cd5\u8005\u7684\u8fdc\u7a0b\u6bcf\u7ea7\u589e\u52a0(0.005x)",
          "/abilities/mystic_aura": "\u589e\u52a0\u6240\u6709\u961f\u53cb\u7684\u5143\u7d20\u589e\u5e45\uff0c\u6548\u679c\u968f\u65bd\u6cd5\u8005\u7684\u9b54\u6cd5\u6bcf\u7ea7\u589e\u52a0(0.005x)",
          "/abilities/promote": "\u664b\u5347\u4e00\u4e2a\u5c0f\u5175"
        },
        itemNames: {
          "/items/coin": "\u91d1\u5e01",
          "/items/task_token": "\u4efb\u52a1\u4ee3\u5e01",
          "/items/chimerical_token": "\u5947\u5e7b\u4ee3\u5e01",
          "/items/sinister_token": "\u9634\u68ee\u4ee3\u5e01",
          "/items/enchanted_token": "\u79d8\u6cd5\u4ee3\u5e01",
          "/items/pirate_token": "\u6d77\u76d7\u4ee3\u5e01",
          "/items/cowbell": "\u725b\u94c3",
          "/items/bag_of_10_cowbells": "\u725b\u94c3\u888b (10\u4e2a)",
          "/items/purples_gift": "\u5c0f\u7d2b\u725b\u7684\u793c\u7269",
          "/items/small_meteorite_cache": "\u5c0f\u9668\u77f3\u8231",
          "/items/medium_meteorite_cache": "\u4e2d\u9668\u77f3\u8231",
          "/items/large_meteorite_cache": "\u5927\u9668\u77f3\u8231",
          "/items/small_artisans_crate": "\u5c0f\u5de5\u5320\u5323",
          "/items/medium_artisans_crate": "\u4e2d\u5de5\u5320\u5323",
          "/items/large_artisans_crate": "\u5927\u5de5\u5320\u5323",
          "/items/small_treasure_chest": "\u5c0f\u5b9d\u7bb1",
          "/items/medium_treasure_chest": "\u4e2d\u5b9d\u7bb1",
          "/items/large_treasure_chest": "\u5927\u5b9d\u7bb1",
          "/items/chimerical_chest": "\u5947\u5e7b\u5b9d\u7bb1",
          "/items/chimerical_refinement_chest": "\u5947\u5e7b\u7cbe\u70bc\u5b9d\u7bb1",
          "/items/sinister_chest": "\u9634\u68ee\u5b9d\u7bb1",
          "/items/sinister_refinement_chest": "\u9634\u68ee\u7cbe\u70bc\u5b9d\u7bb1",
          "/items/enchanted_chest": "\u79d8\u6cd5\u5b9d\u7bb1",
          "/items/enchanted_refinement_chest": "\u79d8\u6cd5\u7cbe\u70bc\u5b9d\u7bb1",
          "/items/pirate_chest": "\u6d77\u76d7\u5b9d\u7bb1",
          "/items/pirate_refinement_chest": "\u6d77\u76d7\u7cbe\u70bc\u5b9d\u7bb1",
          "/items/blue_key_fragment": "\u84dd\u8272\u94a5\u5319\u788e\u7247",
          "/items/green_key_fragment": "\u7eff\u8272\u94a5\u5319\u788e\u7247",
          "/items/purple_key_fragment": "\u7d2b\u8272\u94a5\u5319\u788e\u7247",
          "/items/white_key_fragment": "\u767d\u8272\u94a5\u5319\u788e\u7247",
          "/items/orange_key_fragment": "\u6a59\u8272\u94a5\u5319\u788e\u7247",
          "/items/brown_key_fragment": "\u68d5\u8272\u94a5\u5319\u788e\u7247",
          "/items/stone_key_fragment": "\u77f3\u5934\u94a5\u5319\u788e\u7247",
          "/items/dark_key_fragment": "\u9ed1\u6697\u94a5\u5319\u788e\u7247",
          "/items/burning_key_fragment": "\u71c3\u70e7\u94a5\u5319\u788e\u7247",
          "/items/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
          "/items/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
          "/items/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
          "/items/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
          "/items/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
          "/items/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
          "/items/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
          "/items/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
          "/items/donut": "\u751c\u751c\u5708",
          "/items/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
          "/items/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
          "/items/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
          "/items/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
          "/items/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
          "/items/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
          "/items/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
          "/items/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
          "/items/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
          "/items/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
          "/items/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
          "/items/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
          "/items/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
          "/items/gummy": "\u8f6f\u7cd6",
          "/items/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
          "/items/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
          "/items/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
          "/items/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
          "/items/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
          "/items/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
          "/items/yogurt": "\u9178\u5976",
          "/items/apple_yogurt": "\u82f9\u679c\u9178\u5976",
          "/items/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
          "/items/plum_yogurt": "\u674e\u5b50\u9178\u5976",
          "/items/peach_yogurt": "\u6843\u5b50\u9178\u5976",
          "/items/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
          "/items/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
          "/items/milking_tea": "\u6324\u5976\u8336",
          "/items/foraging_tea": "\u91c7\u6458\u8336",
          "/items/woodcutting_tea": "\u4f10\u6728\u8336",
          "/items/cooking_tea": "\u70f9\u996a\u8336",
          "/items/brewing_tea": "\u51b2\u6ce1\u8336",
          "/items/alchemy_tea": "\u70bc\u91d1\u8336",
          "/items/enhancing_tea": "\u5f3a\u5316\u8336",
          "/items/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
          "/items/crafting_tea": "\u5236\u4f5c\u8336",
          "/items/tailoring_tea": "\u7f1d\u7eab\u8336",
          "/items/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
          "/items/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
          "/items/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
          "/items/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
          "/items/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
          "/items/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
          "/items/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
          "/items/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
          "/items/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
          "/items/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
          "/items/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
          "/items/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
          "/items/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
          "/items/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
          "/items/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
          "/items/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
          "/items/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
          "/items/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
          "/items/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
          "/items/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
          "/items/gathering_tea": "\u91c7\u96c6\u8336",
          "/items/gourmet_tea": "\u7f8e\u98df\u8336",
          "/items/wisdom_tea": "\u7ecf\u9a8c\u8336",
          "/items/processing_tea": "\u52a0\u5de5\u8336",
          "/items/efficiency_tea": "\u6548\u7387\u8336",
          "/items/artisan_tea": "\u5de5\u5320\u8336",
          "/items/catalytic_tea": "\u50ac\u5316\u8336",
          "/items/blessed_tea": "\u798f\u6c14\u8336",
          "/items/stamina_coffee": "\u8010\u529b\u5496\u5561",
          "/items/intelligence_coffee": "\u667a\u529b\u5496\u5561",
          "/items/defense_coffee": "\u9632\u5fa1\u5496\u5561",
          "/items/attack_coffee": "\u653b\u51fb\u5496\u5561",
          "/items/melee_coffee": "\u8fd1\u6218\u5496\u5561",
          "/items/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
          "/items/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
          "/items/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
          "/items/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
          "/items/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
          "/items/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
          "/items/super_melee_coffee": "\u8d85\u7ea7\u8fd1\u6218\u5496\u5561",
          "/items/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
          "/items/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
          "/items/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
          "/items/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
          "/items/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
          "/items/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
          "/items/ultra_melee_coffee": "\u7a76\u6781\u8fd1\u6218\u5496\u5561",
          "/items/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
          "/items/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
          "/items/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
          "/items/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
          "/items/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
          "/items/channeling_coffee": "\u541f\u5531\u5496\u5561",
          "/items/critical_coffee": "\u66b4\u51fb\u5496\u5561",
          "/items/poke": "\u7834\u80c6\u4e4b\u523a",
          "/items/impale": "\u900f\u9aa8\u4e4b\u523a",
          "/items/puncture": "\u7834\u7532\u4e4b\u523a",
          "/items/penetrating_strike": "\u8d2f\u5fc3\u4e4b\u523a",
          "/items/scratch": "\u722a\u5f71\u65a9",
          "/items/cleave": "\u5206\u88c2\u65a9",
          "/items/maim": "\u8840\u5203\u65a9",
          "/items/crippling_slash": "\u81f4\u6b8b\u65a9",
          "/items/smack": "\u91cd\u78be",
          "/items/sweep": "\u91cd\u626b",
          "/items/stunning_blow": "\u91cd\u9524",
          "/items/fracturing_impact": "\u788e\u88c2\u51b2\u51fb",
          "/items/shield_bash": "\u76fe\u51fb",
          "/items/quick_shot": "\u5feb\u901f\u5c04\u51fb",
          "/items/aqua_arrow": "\u6d41\u6c34\u7bad",
          "/items/flame_arrow": "\u70c8\u7130\u7bad",
          "/items/rain_of_arrows": "\u7bad\u96e8",
          "/items/silencing_shot": "\u6c89\u9ed8\u4e4b\u7bad",
          "/items/steady_shot": "\u7a33\u5b9a\u5c04\u51fb",
          "/items/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb",
          "/items/penetrating_shot": "\u8d2f\u7a7f\u5c04\u51fb",
          "/items/water_strike": "\u6d41\u6c34\u51b2\u51fb",
          "/items/ice_spear": "\u51b0\u67aa\u672f",
          "/items/frost_surge": "\u51b0\u971c\u7206\u88c2",
          "/items/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
          "/items/entangle": "\u7f20\u7ed5",
          "/items/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18",
          "/items/natures_veil": "\u81ea\u7136\u83cc\u5e55",
          "/items/life_drain": "\u751f\u547d\u5438\u53d6",
          "/items/fireball": "\u706b\u7403",
          "/items/flame_blast": "\u7194\u5ca9\u7206\u88c2",
          "/items/firestorm": "\u706b\u7130\u98ce\u66b4",
          "/items/smoke_burst": "\u70df\u7206\u706d\u5f71",
          "/items/minor_heal": "\u521d\u7ea7\u81ea\u6108\u672f",
          "/items/heal": "\u81ea\u6108\u672f",
          "/items/quick_aid": "\u5feb\u901f\u6cbb\u7597\u672f",
          "/items/rejuvenate": "\u7fa4\u4f53\u6cbb\u7597\u672f",
          "/items/taunt": "\u5632\u8bbd",
          "/items/provoke": "\u6311\u8845",
          "/items/toughness": "\u575a\u97e7",
          "/items/elusiveness": "\u95ea\u907f",
          "/items/precision": "\u7cbe\u786e",
          "/items/berserk": "\u72c2\u66b4",
          "/items/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
          "/items/frenzy": "\u72c2\u901f",
          "/items/spike_shell": "\u5c16\u523a\u9632\u62a4",
          "/items/retribution": "\u60e9\u6212",
          "/items/vampirism": "\u5438\u8840",
          "/items/revive": "\u590d\u6d3b",
          "/items/insanity": "\u75af\u72c2",
          "/items/invincible": "\u65e0\u654c",
          "/items/speed_aura": "\u901f\u5ea6\u5149\u73af",
          "/items/guardian_aura": "\u5b88\u62a4\u5149\u73af",
          "/items/fierce_aura": "\u7269\u7406\u5149\u73af",
          "/items/critical_aura": "\u66b4\u51fb\u5149\u73af",
          "/items/mystic_aura": "\u5143\u7d20\u5149\u73af",
          "/items/gobo_stabber": "\u54e5\u5e03\u6797\u957f\u5251",
          "/items/gobo_slasher": "\u54e5\u5e03\u6797\u5173\u5200",
          "/items/gobo_smasher": "\u54e5\u5e03\u6797\u72fc\u7259\u68d2",
          "/items/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
          "/items/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
          "/items/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
          "/items/griffin_bulwark_refined": "\u72ee\u9e6b\u91cd\u76fe\uff08\u7cbe\uff09",
          "/items/gobo_shooter": "\u54e5\u5e03\u6797\u5f39\u5f13",
          "/items/vampiric_bow": "\u5438\u8840\u5f13",
          "/items/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
          "/items/cursed_bow_refined": "\u5492\u6028\u4e4b\u5f13\uff08\u7cbe\uff09",
          "/items/gobo_boomstick": "\u54e5\u5e03\u6797\u706b\u68cd",
          "/items/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
          "/items/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
          "/items/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
          "/items/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
          "/items/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
          "/items/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
          "/items/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
          "/items/wooden_bow": "\u6728\u5f13",
          "/items/birch_bow": "\u6866\u6728\u5f13",
          "/items/cedar_bow": "\u96ea\u677e\u5f13",
          "/items/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
          "/items/ginkgo_bow": "\u94f6\u674f\u5f13",
          "/items/redwood_bow": "\u7ea2\u6749\u5f13",
          "/items/arcane_bow": "\u795e\u79d8\u5f13",
          "/items/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
          "/items/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
          "/items/furious_spear": "\u72c2\u6012\u957f\u67aa",
          "/items/furious_spear_refined": "\u72c2\u6012\u957f\u67aa\uff08\u7cbe\uff09",
          "/items/regal_sword": "\u541b\u738b\u4e4b\u5251",
          "/items/regal_sword_refined": "\u541b\u738b\u4e4b\u5251\uff08\u7cbe\uff09",
          "/items/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
          "/items/chaotic_flail_refined": "\u6df7\u6c8c\u8fde\u67b7\uff08\u7cbe\uff09",
          "/items/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
          "/items/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
          "/items/sundering_crossbow_refined": "\u88c2\u7a7a\u4e4b\u5f29\uff08\u7cbe\uff09",
          "/items/frost_staff": "\u51b0\u971c\u6cd5\u6756",
          "/items/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
          "/items/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
          "/items/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
          "/items/rippling_trident_refined": "\u6d9f\u6f2a\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
          "/items/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
          "/items/blooming_trident_refined": "\u7efd\u653e\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
          "/items/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
          "/items/blazing_trident_refined": "\u70bd\u7130\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
          "/items/cheese_sword": "\u5976\u916a\u5251",
          "/items/verdant_sword": "\u7fe0\u7eff\u5251",
          "/items/azure_sword": "\u851a\u84dd\u5251",
          "/items/burble_sword": "\u6df1\u7d2b\u5251",
          "/items/crimson_sword": "\u7edb\u7ea2\u5251",
          "/items/rainbow_sword": "\u5f69\u8679\u5251",
          "/items/holy_sword": "\u795e\u5723\u5251",
          "/items/cheese_spear": "\u5976\u916a\u957f\u67aa",
          "/items/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
          "/items/azure_spear": "\u851a\u84dd\u957f\u67aa",
          "/items/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
          "/items/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
          "/items/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
          "/items/holy_spear": "\u795e\u5723\u957f\u67aa",
          "/items/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
          "/items/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
          "/items/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
          "/items/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
          "/items/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
          "/items/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
          "/items/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
          "/items/wooden_crossbow": "\u6728\u5f29",
          "/items/birch_crossbow": "\u6866\u6728\u5f29",
          "/items/cedar_crossbow": "\u96ea\u677e\u5f29",
          "/items/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
          "/items/ginkgo_crossbow": "\u94f6\u674f\u5f29",
          "/items/redwood_crossbow": "\u7ea2\u6749\u5f29",
          "/items/arcane_crossbow": "\u795e\u79d8\u5f29",
          "/items/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
          "/items/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
          "/items/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
          "/items/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
          "/items/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
          "/items/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
          "/items/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
          "/items/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
          "/items/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
          "/items/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
          "/items/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
          "/items/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
          "/items/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
          "/items/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
          "/items/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
          "/items/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
          "/items/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
          "/items/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
          "/items/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
          "/items/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
          "/items/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
          "/items/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
          "/items/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
          "/items/vision_shield": "\u89c6\u89c9\u76fe",
          "/items/gobo_defender": "\u54e5\u5e03\u6797\u9632\u5fa1\u8005",
          "/items/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
          "/items/knights_aegis": "\u9a91\u58eb\u76fe",
          "/items/knights_aegis_refined": "\u9a91\u58eb\u76fe\uff08\u7cbe\uff09",
          "/items/treant_shield": "\u6811\u4eba\u76fe",
          "/items/manticore_shield": "\u874e\u72ee\u76fe",
          "/items/tome_of_healing": "\u6cbb\u7597\u4e4b\u4e66",
          "/items/tome_of_the_elements": "\u5143\u7d20\u4e4b\u4e66",
          "/items/watchful_relic": "\u8b66\u6212\u9057\u7269",
          "/items/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
          "/items/bishops_codex_refined": "\u4e3b\u6559\u6cd5\u5178\uff08\u7cbe\uff09",
          "/items/cheese_buckler": "\u5976\u916a\u5706\u76fe",
          "/items/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
          "/items/azure_buckler": "\u851a\u84dd\u5706\u76fe",
          "/items/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
          "/items/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
          "/items/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
          "/items/holy_buckler": "\u795e\u5723\u5706\u76fe",
          "/items/wooden_shield": "\u6728\u76fe",
          "/items/birch_shield": "\u6866\u6728\u76fe",
          "/items/cedar_shield": "\u96ea\u677e\u76fe",
          "/items/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
          "/items/ginkgo_shield": "\u94f6\u674f\u76fe",
          "/items/redwood_shield": "\u7ea2\u6749\u76fe",
          "/items/arcane_shield": "\u795e\u79d8\u76fe",
          "/items/sinister_cape": "\u9634\u68ee\u6597\u7bf7",
          "/items/sinister_cape_refined": "\u9634\u68ee\u6597\u7bf7\uff08\u7cbe\uff09",
          "/items/chimerical_quiver": "\u5947\u5e7b\u7bad\u888b",
          "/items/chimerical_quiver_refined": "\u5947\u5e7b\u7bad\u888b\uff08\u7cbe\uff09",
          "/items/enchanted_cloak": "\u79d8\u6cd5\u62ab\u98ce",
          "/items/enchanted_cloak_refined": "\u79d8\u6cd5\u62ab\u98ce\uff08\u7cbe\uff09",
          "/items/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
          "/items/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
          "/items/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
          "/items/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
          "/items/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
          "/items/corsair_helmet_refined": "\u63a0\u593a\u8005\u5934\u76d4\uff08\u7cbe\uff09",
          "/items/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
          "/items/acrobatic_hood_refined": "\u6742\u6280\u5e08\u515c\u5e3d\uff08\u7cbe\uff09",
          "/items/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
          "/items/magicians_hat_refined": "\u9b54\u672f\u5e08\u5e3d\uff08\u7cbe\uff09",
          "/items/cheese_helmet": "\u5976\u916a\u5934\u76d4",
          "/items/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
          "/items/azure_helmet": "\u851a\u84dd\u5934\u76d4",
          "/items/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
          "/items/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
          "/items/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
          "/items/holy_helmet": "\u795e\u5723\u5934\u76d4",
          "/items/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
          "/items/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
          "/items/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
          "/items/beast_hood": "\u91ce\u517d\u515c\u5e3d",
          "/items/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
          "/items/cotton_hat": "\u68c9\u5e3d",
          "/items/linen_hat": "\u4e9a\u9ebb\u5e3d",
          "/items/bamboo_hat": "\u7af9\u5e3d",
          "/items/silk_hat": "\u4e1d\u5e3d",
          "/items/radiant_hat": "\u5149\u8f89\u5e3d",
          "/items/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
          "/items/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
          "/items/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
          "/items/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
          "/items/crafters_top": "\u5de5\u5320\u4e0a\u8863",
          "/items/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
          "/items/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
          "/items/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
          "/items/alchemists_top": "\u70bc\u91d1\u5e08\u4e0a\u8863",
          "/items/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
          "/items/gator_vest": "\u9cc4\u9c7c\u9a6c\u7532",
          "/items/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
          "/items/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
          "/items/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
          "/items/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
          "/items/anchorbound_plate_body_refined": "\u951a\u5b9a\u80f8\u7532\uff08\u7cbe\uff09",
          "/items/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
          "/items/maelstrom_plate_body_refined": "\u6012\u6d9b\u80f8\u7532\uff08\u7cbe\uff09",
          "/items/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
          "/items/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
          "/items/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
          "/items/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
          "/items/kraken_tunic_refined": "\u514b\u62c9\u80af\u76ae\u8863\uff08\u7cbe\uff09",
          "/items/icy_robe_top": "\u51b0\u971c\u888d\u670d",
          "/items/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
          "/items/luna_robe_top": "\u6708\u795e\u888d\u670d",
          "/items/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
          "/items/royal_water_robe_top_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
          "/items/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
          "/items/royal_nature_robe_top_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
          "/items/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
          "/items/royal_fire_robe_top_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
          "/items/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
          "/items/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
          "/items/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
          "/items/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
          "/items/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
          "/items/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
          "/items/holy_plate_body": "\u795e\u5723\u80f8\u7532",
          "/items/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
          "/items/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
          "/items/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
          "/items/beast_tunic": "\u91ce\u517d\u76ae\u8863",
          "/items/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
          "/items/cotton_robe_top": "\u68c9\u888d\u670d",
          "/items/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
          "/items/bamboo_robe_top": "\u7af9\u888d\u670d",
          "/items/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
          "/items/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
          "/items/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
          "/items/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
          "/items/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
          "/items/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
          "/items/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
          "/items/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
          "/items/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
          "/items/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
          "/items/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
          "/items/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
          "/items/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
          "/items/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
          "/items/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
          "/items/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
          "/items/anchorbound_plate_legs_refined": "\u951a\u5b9a\u817f\u7532\uff08\u7cbe\uff09",
          "/items/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
          "/items/maelstrom_plate_legs_refined": "\u6012\u6d9b\u817f\u7532\uff08\u7cbe\uff09",
          "/items/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
          "/items/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
          "/items/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
          "/items/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
          "/items/kraken_chaps_refined": "\u514b\u62c9\u80af\u76ae\u88e4\uff08\u7cbe\uff09",
          "/items/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
          "/items/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
          "/items/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
          "/items/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
          "/items/royal_water_robe_bottoms_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
          "/items/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
          "/items/royal_nature_robe_bottoms_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
          "/items/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
          "/items/royal_fire_robe_bottoms_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
          "/items/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
          "/items/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
          "/items/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
          "/items/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
          "/items/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
          "/items/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
          "/items/holy_plate_legs": "\u795e\u5723\u817f\u7532",
          "/items/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
          "/items/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
          "/items/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
          "/items/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
          "/items/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
          "/items/cotton_robe_bottoms": "\u68c9\u888d\u88d9",
          "/items/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
          "/items/bamboo_robe_bottoms": "\u7af9\u888d\u88d9",
          "/items/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
          "/items/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
          "/items/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
          "/items/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
          "/items/panda_gloves": "\u718a\u732b\u624b\u5957",
          "/items/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
          "/items/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
          "/items/dodocamel_gauntlets_refined": "\u6e21\u6e21\u9a7c\u62a4\u624b\uff08\u7cbe\uff09",
          "/items/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
          "/items/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
          "/items/marksman_bracers_refined": "\u795e\u5c04\u62a4\u8155\uff08\u7cbe\uff09",
          "/items/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
          "/items/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
          "/items/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
          "/items/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
          "/items/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
          "/items/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
          "/items/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
          "/items/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
          "/items/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
          "/items/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
          "/items/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
          "/items/beast_bracers": "\u91ce\u517d\u62a4\u8155",
          "/items/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
          "/items/cotton_gloves": "\u68c9\u624b\u5957",
          "/items/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
          "/items/bamboo_gloves": "\u7af9\u624b\u5957",
          "/items/silk_gloves": "\u4e1d\u624b\u5957",
          "/items/radiant_gloves": "\u5149\u8f89\u624b\u5957",
          "/items/collectors_boots": "\u6536\u85cf\u5bb6\u9774",
          "/items/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
          "/items/black_bear_shoes": "\u9ed1\u718a\u978b",
          "/items/grizzly_bear_shoes": "\u68d5\u718a\u978b",
          "/items/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
          "/items/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
          "/items/sorcerer_boots": "\u5deb\u5e08\u9774",
          "/items/cheese_boots": "\u5976\u916a\u9774",
          "/items/verdant_boots": "\u7fe0\u7eff\u9774",
          "/items/azure_boots": "\u851a\u84dd\u9774",
          "/items/burble_boots": "\u6df1\u7d2b\u9774",
          "/items/crimson_boots": "\u7edb\u7ea2\u9774",
          "/items/rainbow_boots": "\u5f69\u8679\u9774",
          "/items/holy_boots": "\u795e\u5723\u9774",
          "/items/rough_boots": "\u7c97\u7cd9\u9774",
          "/items/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
          "/items/gobo_boots": "\u54e5\u5e03\u6797\u9774",
          "/items/beast_boots": "\u91ce\u517d\u9774",
          "/items/umbral_boots": "\u6697\u5f71\u9774",
          "/items/cotton_boots": "\u68c9\u9774",
          "/items/linen_boots": "\u4e9a\u9ebb\u9774",
          "/items/bamboo_boots": "\u7af9\u9774",
          "/items/silk_boots": "\u4e1d\u9774",
          "/items/radiant_boots": "\u5149\u8f89\u9774",
          "/items/small_pouch": "\u5c0f\u888b\u5b50",
          "/items/medium_pouch": "\u4e2d\u888b\u5b50",
          "/items/large_pouch": "\u5927\u888b\u5b50",
          "/items/giant_pouch": "\u5de8\u5927\u888b\u5b50",
          "/items/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
          "/items/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
          "/items/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
          "/items/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
          "/items/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
          "/items/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
          "/items/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
          "/items/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
          "/items/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
          "/items/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
          "/items/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
          "/items/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
          "/items/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
          "/items/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
          "/items/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
          "/items/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
          "/items/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
          "/items/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
          "/items/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
          "/items/ring_of_armor": "\u62a4\u7532\u6212\u6307",
          "/items/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
          "/items/ring_of_resistance": "\u6297\u6027\u6212\u6307",
          "/items/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
          "/items/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
          "/items/philosophers_ring": "\u8d24\u8005\u6212\u6307",
          "/items/trainee_milking_charm": "\u5b9e\u4e60\u6324\u5976\u62a4\u7b26",
          "/items/basic_milking_charm": "\u57fa\u7840\u6324\u5976\u62a4\u7b26",
          "/items/advanced_milking_charm": "\u9ad8\u7ea7\u6324\u5976\u62a4\u7b26",
          "/items/expert_milking_charm": "\u4e13\u5bb6\u6324\u5976\u62a4\u7b26",
          "/items/master_milking_charm": "\u5927\u5e08\u6324\u5976\u62a4\u7b26",
          "/items/grandmaster_milking_charm": "\u5b97\u5e08\u6324\u5976\u62a4\u7b26",
          "/items/trainee_foraging_charm": "\u5b9e\u4e60\u91c7\u6458\u62a4\u7b26",
          "/items/basic_foraging_charm": "\u57fa\u7840\u91c7\u6458\u62a4\u7b26",
          "/items/advanced_foraging_charm": "\u9ad8\u7ea7\u91c7\u6458\u62a4\u7b26",
          "/items/expert_foraging_charm": "\u4e13\u5bb6\u91c7\u6458\u62a4\u7b26",
          "/items/master_foraging_charm": "\u5927\u5e08\u91c7\u6458\u62a4\u7b26",
          "/items/grandmaster_foraging_charm": "\u5b97\u5e08\u91c7\u6458\u62a4\u7b26",
          "/items/trainee_woodcutting_charm": "\u5b9e\u4e60\u4f10\u6728\u62a4\u7b26",
          "/items/basic_woodcutting_charm": "\u57fa\u7840\u4f10\u6728\u62a4\u7b26",
          "/items/advanced_woodcutting_charm": "\u9ad8\u7ea7\u4f10\u6728\u62a4\u7b26",
          "/items/expert_woodcutting_charm": "\u4e13\u5bb6\u4f10\u6728\u62a4\u7b26",
          "/items/master_woodcutting_charm": "\u5927\u5e08\u4f10\u6728\u62a4\u7b26",
          "/items/grandmaster_woodcutting_charm": "\u5b97\u5e08\u4f10\u6728\u62a4\u7b26",
          "/items/trainee_cheesesmithing_charm": "\u5b9e\u4e60\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/items/basic_cheesesmithing_charm": "\u57fa\u7840\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/items/advanced_cheesesmithing_charm": "\u9ad8\u7ea7\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/items/expert_cheesesmithing_charm": "\u4e13\u5bb6\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/items/master_cheesesmithing_charm": "\u5927\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/items/grandmaster_cheesesmithing_charm": "\u5b97\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/items/trainee_crafting_charm": "\u5b9e\u4e60\u5236\u4f5c\u62a4\u7b26",
          "/items/basic_crafting_charm": "\u57fa\u7840\u5236\u4f5c\u62a4\u7b26",
          "/items/advanced_crafting_charm": "\u9ad8\u7ea7\u5236\u4f5c\u62a4\u7b26",
          "/items/expert_crafting_charm": "\u4e13\u5bb6\u5236\u4f5c\u62a4\u7b26",
          "/items/master_crafting_charm": "\u5927\u5e08\u5236\u4f5c\u62a4\u7b26",
          "/items/grandmaster_crafting_charm": "\u5b97\u5e08\u5236\u4f5c\u62a4\u7b26",
          "/items/trainee_tailoring_charm": "\u5b9e\u4e60\u7f1d\u7eab\u62a4\u7b26",
          "/items/basic_tailoring_charm": "\u57fa\u7840\u7f1d\u7eab\u62a4\u7b26",
          "/items/advanced_tailoring_charm": "\u9ad8\u7ea7\u7f1d\u7eab\u62a4\u7b26",
          "/items/expert_tailoring_charm": "\u4e13\u5bb6\u7f1d\u7eab\u62a4\u7b26",
          "/items/master_tailoring_charm": "\u5927\u5e08\u7f1d\u7eab\u62a4\u7b26",
          "/items/grandmaster_tailoring_charm": "\u5b97\u5e08\u7f1d\u7eab\u62a4\u7b26",
          "/items/trainee_cooking_charm": "\u5b9e\u4e60\u70f9\u996a\u62a4\u7b26",
          "/items/basic_cooking_charm": "\u57fa\u7840\u70f9\u996a\u62a4\u7b26",
          "/items/advanced_cooking_charm": "\u9ad8\u7ea7\u70f9\u996a\u62a4\u7b26",
          "/items/expert_cooking_charm": "\u4e13\u5bb6\u70f9\u996a\u62a4\u7b26",
          "/items/master_cooking_charm": "\u5927\u5e08\u70f9\u996a\u62a4\u7b26",
          "/items/grandmaster_cooking_charm": "\u5b97\u5e08\u70f9\u996a\u62a4\u7b26",
          "/items/trainee_brewing_charm": "\u5b9e\u4e60\u51b2\u6ce1\u62a4\u7b26",
          "/items/basic_brewing_charm": "\u57fa\u7840\u51b2\u6ce1\u62a4\u7b26",
          "/items/advanced_brewing_charm": "\u9ad8\u7ea7\u51b2\u6ce1\u62a4\u7b26",
          "/items/expert_brewing_charm": "\u4e13\u5bb6\u51b2\u6ce1\u62a4\u7b26",
          "/items/master_brewing_charm": "\u5927\u5e08\u51b2\u6ce1\u62a4\u7b26",
          "/items/grandmaster_brewing_charm": "\u5b97\u5e08\u51b2\u6ce1\u62a4\u7b26",
          "/items/trainee_alchemy_charm": "\u5b9e\u4e60\u70bc\u91d1\u62a4\u7b26",
          "/items/basic_alchemy_charm": "\u57fa\u7840\u70bc\u91d1\u62a4\u7b26",
          "/items/advanced_alchemy_charm": "\u9ad8\u7ea7\u70bc\u91d1\u62a4\u7b26",
          "/items/expert_alchemy_charm": "\u4e13\u5bb6\u70bc\u91d1\u62a4\u7b26",
          "/items/master_alchemy_charm": "\u5927\u5e08\u70bc\u91d1\u62a4\u7b26",
          "/items/grandmaster_alchemy_charm": "\u5b97\u5e08\u70bc\u91d1\u62a4\u7b26",
          "/items/trainee_enhancing_charm": "\u5b9e\u4e60\u5f3a\u5316\u62a4\u7b26",
          "/items/basic_enhancing_charm": "\u57fa\u7840\u5f3a\u5316\u62a4\u7b26",
          "/items/advanced_enhancing_charm": "\u9ad8\u7ea7\u5f3a\u5316\u62a4\u7b26",
          "/items/expert_enhancing_charm": "\u4e13\u5bb6\u5f3a\u5316\u62a4\u7b26",
          "/items/master_enhancing_charm": "\u5927\u5e08\u5f3a\u5316\u62a4\u7b26",
          "/items/grandmaster_enhancing_charm": "\u5b97\u5e08\u5f3a\u5316\u62a4\u7b26",
          "/items/trainee_stamina_charm": "\u5b9e\u4e60\u8010\u529b\u62a4\u7b26",
          "/items/basic_stamina_charm": "\u57fa\u7840\u8010\u529b\u62a4\u7b26",
          "/items/advanced_stamina_charm": "\u9ad8\u7ea7\u8010\u529b\u62a4\u7b26",
          "/items/expert_stamina_charm": "\u4e13\u5bb6\u8010\u529b\u62a4\u7b26",
          "/items/master_stamina_charm": "\u5927\u5e08\u8010\u529b\u62a4\u7b26",
          "/items/grandmaster_stamina_charm": "\u5b97\u5e08\u8010\u529b\u62a4\u7b26",
          "/items/trainee_intelligence_charm": "\u5b9e\u4e60\u667a\u529b\u62a4\u7b26",
          "/items/basic_intelligence_charm": "\u57fa\u7840\u667a\u529b\u62a4\u7b26",
          "/items/advanced_intelligence_charm": "\u9ad8\u7ea7\u667a\u529b\u62a4\u7b26",
          "/items/expert_intelligence_charm": "\u4e13\u5bb6\u667a\u529b\u62a4\u7b26",
          "/items/master_intelligence_charm": "\u5927\u5e08\u667a\u529b\u62a4\u7b26",
          "/items/grandmaster_intelligence_charm": "\u5b97\u5e08\u667a\u529b\u62a4\u7b26",
          "/items/trainee_attack_charm": "\u5b9e\u4e60\u653b\u51fb\u62a4\u7b26",
          "/items/basic_attack_charm": "\u57fa\u7840\u653b\u51fb\u62a4\u7b26",
          "/items/advanced_attack_charm": "\u9ad8\u7ea7\u653b\u51fb\u62a4\u7b26",
          "/items/expert_attack_charm": "\u4e13\u5bb6\u653b\u51fb\u62a4\u7b26",
          "/items/master_attack_charm": "\u5927\u5e08\u653b\u51fb\u62a4\u7b26",
          "/items/grandmaster_attack_charm": "\u5b97\u5e08\u653b\u51fb\u62a4\u7b26",
          "/items/trainee_defense_charm": "\u5b9e\u4e60\u9632\u5fa1\u62a4\u7b26",
          "/items/basic_defense_charm": "\u57fa\u7840\u9632\u5fa1\u62a4\u7b26",
          "/items/advanced_defense_charm": "\u9ad8\u7ea7\u9632\u5fa1\u62a4\u7b26",
          "/items/expert_defense_charm": "\u4e13\u5bb6\u9632\u5fa1\u62a4\u7b26",
          "/items/master_defense_charm": "\u5927\u5e08\u9632\u5fa1\u62a4\u7b26",
          "/items/grandmaster_defense_charm": "\u5b97\u5e08\u9632\u5fa1\u62a4\u7b26",
          "/items/trainee_melee_charm": "\u5b9e\u4e60\u8fd1\u6218\u62a4\u7b26",
          "/items/basic_melee_charm": "\u57fa\u7840\u8fd1\u6218\u62a4\u7b26",
          "/items/advanced_melee_charm": "\u9ad8\u7ea7\u8fd1\u6218\u62a4\u7b26",
          "/items/expert_melee_charm": "\u4e13\u5bb6\u8fd1\u6218\u62a4\u7b26",
          "/items/master_melee_charm": "\u5927\u5e08\u8fd1\u6218\u62a4\u7b26",
          "/items/grandmaster_melee_charm": "\u5b97\u5e08\u8fd1\u6218\u62a4\u7b26",
          "/items/trainee_ranged_charm": "\u5b9e\u4e60\u8fdc\u7a0b\u62a4\u7b26",
          "/items/basic_ranged_charm": "\u57fa\u7840\u8fdc\u7a0b\u62a4\u7b26",
          "/items/advanced_ranged_charm": "\u9ad8\u7ea7\u8fdc\u7a0b\u62a4\u7b26",
          "/items/expert_ranged_charm": "\u4e13\u5bb6\u8fdc\u7a0b\u62a4\u7b26",
          "/items/master_ranged_charm": "\u5927\u5e08\u8fdc\u7a0b\u62a4\u7b26",
          "/items/grandmaster_ranged_charm": "\u5b97\u5e08\u8fdc\u7a0b\u62a4\u7b26",
          "/items/trainee_magic_charm": "\u5b9e\u4e60\u9b54\u6cd5\u62a4\u7b26",
          "/items/basic_magic_charm": "\u57fa\u7840\u9b54\u6cd5\u62a4\u7b26",
          "/items/advanced_magic_charm": "\u9ad8\u7ea7\u9b54\u6cd5\u62a4\u7b26",
          "/items/expert_magic_charm": "\u4e13\u5bb6\u9b54\u6cd5\u62a4\u7b26",
          "/items/master_magic_charm": "\u5927\u5e08\u9b54\u6cd5\u62a4\u7b26",
          "/items/grandmaster_magic_charm": "\u5b97\u5e08\u9b54\u6cd5\u62a4\u7b26",
          "/items/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
          "/items/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
          "/items/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
          "/items/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
          "/items/cheese_brush": "\u5976\u916a\u5237\u5b50",
          "/items/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
          "/items/azure_brush": "\u851a\u84dd\u5237\u5b50",
          "/items/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
          "/items/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
          "/items/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
          "/items/holy_brush": "\u795e\u5723\u5237\u5b50",
          "/items/celestial_shears": "\u661f\u7a7a\u526a\u5200",
          "/items/cheese_shears": "\u5976\u916a\u526a\u5200",
          "/items/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
          "/items/azure_shears": "\u851a\u84dd\u526a\u5200",
          "/items/burble_shears": "\u6df1\u7d2b\u526a\u5200",
          "/items/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
          "/items/rainbow_shears": "\u5f69\u8679\u526a\u5200",
          "/items/holy_shears": "\u795e\u5723\u526a\u5200",
          "/items/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
          "/items/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
          "/items/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
          "/items/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
          "/items/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
          "/items/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
          "/items/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
          "/items/holy_hatchet": "\u795e\u5723\u65a7\u5934",
          "/items/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
          "/items/cheese_hammer": "\u5976\u916a\u9524\u5b50",
          "/items/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
          "/items/azure_hammer": "\u851a\u84dd\u9524\u5b50",
          "/items/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
          "/items/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
          "/items/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
          "/items/holy_hammer": "\u795e\u5723\u9524\u5b50",
          "/items/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
          "/items/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
          "/items/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
          "/items/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
          "/items/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
          "/items/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
          "/items/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
          "/items/holy_chisel": "\u795e\u5723\u51ff\u5b50",
          "/items/celestial_needle": "\u661f\u7a7a\u9488",
          "/items/cheese_needle": "\u5976\u916a\u9488",
          "/items/verdant_needle": "\u7fe0\u7eff\u9488",
          "/items/azure_needle": "\u851a\u84dd\u9488",
          "/items/burble_needle": "\u6df1\u7d2b\u9488",
          "/items/crimson_needle": "\u7edb\u7ea2\u9488",
          "/items/rainbow_needle": "\u5f69\u8679\u9488",
          "/items/holy_needle": "\u795e\u5723\u9488",
          "/items/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
          "/items/cheese_spatula": "\u5976\u916a\u9505\u94f2",
          "/items/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
          "/items/azure_spatula": "\u851a\u84dd\u9505\u94f2",
          "/items/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
          "/items/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
          "/items/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
          "/items/holy_spatula": "\u795e\u5723\u9505\u94f2",
          "/items/celestial_pot": "\u661f\u7a7a\u58f6",
          "/items/cheese_pot": "\u5976\u916a\u58f6",
          "/items/verdant_pot": "\u7fe0\u7eff\u58f6",
          "/items/azure_pot": "\u851a\u84dd\u58f6",
          "/items/burble_pot": "\u6df1\u7d2b\u58f6",
          "/items/crimson_pot": "\u7edb\u7ea2\u58f6",
          "/items/rainbow_pot": "\u5f69\u8679\u58f6",
          "/items/holy_pot": "\u795e\u5723\u58f6",
          "/items/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
          "/items/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
          "/items/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
          "/items/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
          "/items/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
          "/items/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
          "/items/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
          "/items/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
          "/items/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
          "/items/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
          "/items/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
          "/items/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
          "/items/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
          "/items/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
          "/items/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
          "/items/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
          "/items/milk": "\u725b\u5976",
          "/items/verdant_milk": "\u7fe0\u7eff\u725b\u5976",
          "/items/azure_milk": "\u851a\u84dd\u725b\u5976",
          "/items/burble_milk": "\u6df1\u7d2b\u725b\u5976",
          "/items/crimson_milk": "\u7edb\u7ea2\u725b\u5976",
          "/items/rainbow_milk": "\u5f69\u8679\u725b\u5976",
          "/items/holy_milk": "\u795e\u5723\u725b\u5976",
          "/items/cheese": "\u5976\u916a",
          "/items/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
          "/items/azure_cheese": "\u851a\u84dd\u5976\u916a",
          "/items/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
          "/items/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
          "/items/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
          "/items/holy_cheese": "\u795e\u5723\u5976\u916a",
          "/items/log": "\u539f\u6728",
          "/items/birch_log": "\u767d\u6866\u539f\u6728",
          "/items/cedar_log": "\u96ea\u677e\u539f\u6728",
          "/items/purpleheart_log": "\u7d2b\u5fc3\u539f\u6728",
          "/items/ginkgo_log": "\u94f6\u674f\u539f\u6728",
          "/items/redwood_log": "\u7ea2\u6749\u539f\u6728",
          "/items/arcane_log": "\u795e\u79d8\u539f\u6728",
          "/items/lumber": "\u6728\u677f",
          "/items/birch_lumber": "\u767d\u6866\u6728\u677f",
          "/items/cedar_lumber": "\u96ea\u677e\u6728\u677f",
          "/items/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
          "/items/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
          "/items/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
          "/items/arcane_lumber": "\u795e\u79d8\u6728\u677f",
          "/items/rough_hide": "\u7c97\u7cd9\u517d\u76ae",
          "/items/reptile_hide": "\u722c\u884c\u52a8\u7269\u76ae",
          "/items/gobo_hide": "\u54e5\u5e03\u6797\u76ae",
          "/items/beast_hide": "\u91ce\u517d\u76ae",
          "/items/umbral_hide": "\u6697\u5f71\u76ae",
          "/items/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
          "/items/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
          "/items/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
          "/items/beast_leather": "\u91ce\u517d\u76ae\u9769",
          "/items/umbral_leather": "\u6697\u5f71\u76ae\u9769",
          "/items/cotton": "\u68c9\u82b1",
          "/items/flax": "\u4e9a\u9ebb",
          "/items/bamboo_branch": "\u7af9\u5b50",
          "/items/cocoon": "\u8695\u8327",
          "/items/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
          "/items/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
          "/items/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
          "/items/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
          "/items/silk_fabric": "\u4e1d\u7ef8",
          "/items/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
          "/items/egg": "\u9e21\u86cb",
          "/items/wheat": "\u5c0f\u9ea6",
          "/items/sugar": "\u7cd6",
          "/items/blueberry": "\u84dd\u8393",
          "/items/blackberry": "\u9ed1\u8393",
          "/items/strawberry": "\u8349\u8393",
          "/items/mooberry": "\u54de\u8393",
          "/items/marsberry": "\u706b\u661f\u8393",
          "/items/spaceberry": "\u592a\u7a7a\u8393",
          "/items/apple": "\u82f9\u679c",
          "/items/orange": "\u6a59\u5b50",
          "/items/plum": "\u674e\u5b50",
          "/items/peach": "\u6843\u5b50",
          "/items/dragon_fruit": "\u706b\u9f99\u679c",
          "/items/star_fruit": "\u6768\u6843",
          "/items/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
          "/items/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
          "/items/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
          "/items/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
          "/items/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
          "/items/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
          "/items/green_tea_leaf": "\u7eff\u8336\u53f6",
          "/items/black_tea_leaf": "\u9ed1\u8336\u53f6",
          "/items/burble_tea_leaf": "\u7d2b\u8336\u53f6",
          "/items/moolong_tea_leaf": "\u54de\u9f99\u8336\u53f6",
          "/items/red_tea_leaf": "\u7ea2\u8336\u53f6",
          "/items/emp_tea_leaf": "\u865a\u7a7a\u8336\u53f6",
          "/items/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
          "/items/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
          "/items/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
          "/items/prime_catalyst": "\u81f3\u9ad8\u50ac\u5316\u5242",
          "/items/snake_fang": "\u86c7\u7259",
          "/items/shoebill_feather": "\u9cb8\u5934\u9e73\u7fbd\u6bdb",
          "/items/snail_shell": "\u8717\u725b\u58f3",
          "/items/crab_pincer": "\u87f9\u94b3",
          "/items/turtle_shell": "\u4e4c\u9f9f\u58f3",
          "/items/marine_scale": "\u6d77\u6d0b\u9cde\u7247",
          "/items/treant_bark": "\u6811\u76ae",
          "/items/centaur_hoof": "\u534a\u4eba\u9a6c\u8e44",
          "/items/luna_wing": "\u6708\u795e\u7ffc",
          "/items/gobo_rag": "\u54e5\u5e03\u6797\u62b9\u5e03",
          "/items/goggles": "\u62a4\u76ee\u955c",
          "/items/magnifying_glass": "\u653e\u5927\u955c",
          "/items/eye_of_the_watcher": "\u89c2\u5bdf\u8005\u4e4b\u773c",
          "/items/icy_cloth": "\u51b0\u971c\u7ec7\u7269",
          "/items/flaming_cloth": "\u70c8\u7130\u7ec7\u7269",
          "/items/sorcerers_sole": "\u9b54\u6cd5\u5e08\u978b\u5e95",
          "/items/chrono_sphere": "\u65f6\u7a7a\u7403",
          "/items/frost_sphere": "\u51b0\u971c\u7403",
          "/items/panda_fluff": "\u718a\u732b\u7ed2",
          "/items/black_bear_fluff": "\u9ed1\u718a\u7ed2",
          "/items/grizzly_bear_fluff": "\u68d5\u718a\u7ed2",
          "/items/polar_bear_fluff": "\u5317\u6781\u718a\u7ed2",
          "/items/red_panda_fluff": "\u5c0f\u718a\u732b\u7ed2",
          "/items/magnet": "\u78c1\u94c1",
          "/items/stalactite_shard": "\u949f\u4e73\u77f3\u788e\u7247",
          "/items/living_granite": "\u82b1\u5c97\u5ca9",
          "/items/colossus_core": "\u5de8\u50cf\u6838\u5fc3",
          "/items/vampire_fang": "\u5438\u8840\u9b3c\u4e4b\u7259",
          "/items/werewolf_claw": "\u72fc\u4eba\u4e4b\u722a",
          "/items/revenant_anima": "\u4ea1\u8005\u4e4b\u9b42",
          "/items/soul_fragment": "\u7075\u9b42\u788e\u7247",
          "/items/infernal_ember": "\u5730\u72f1\u4f59\u70ec",
          "/items/demonic_core": "\u6076\u9b54\u6838\u5fc3",
          "/items/griffin_leather": "\u72ee\u9e6b\u4e4b\u76ae",
          "/items/manticore_sting": "\u874e\u72ee\u4e4b\u523a",
          "/items/jackalope_antler": "\u9e7f\u89d2\u5154\u4e4b\u89d2",
          "/items/dodocamel_plume": "\u6e21\u6e21\u9a7c\u4e4b\u7fce",
          "/items/griffin_talon": "\u72ee\u9e6b\u4e4b\u722a",
          "/items/chimerical_refinement_shard": "\u5947\u5e7b\u7cbe\u70bc\u788e\u7247",
          "/items/acrobats_ribbon": "\u6742\u6280\u5e08\u5f69\u5e26",
          "/items/magicians_cloth": "\u9b54\u672f\u5e08\u7ec7\u7269",
          "/items/chaotic_chain": "\u6df7\u6c8c\u9501\u94fe",
          "/items/cursed_ball": "\u8bc5\u5492\u4e4b\u7403",
          "/items/sinister_refinement_shard": "\u9634\u68ee\u7cbe\u70bc\u788e\u7247",
          "/items/royal_cloth": "\u7687\u5bb6\u7ec7\u7269",
          "/items/knights_ingot": "\u9a91\u58eb\u4e4b\u952d",
          "/items/bishops_scroll": "\u4e3b\u6559\u5377\u8f74",
          "/items/regal_jewel": "\u541b\u738b\u5b9d\u77f3",
          "/items/sundering_jewel": "\u88c2\u7a7a\u5b9d\u77f3",
          "/items/enchanted_refinement_shard": "\u79d8\u6cd5\u7cbe\u70bc\u788e\u7247",
          "/items/marksman_brooch": "\u795e\u5c04\u80f8\u9488",
          "/items/corsair_crest": "\u63a0\u593a\u8005\u5fbd\u7ae0",
          "/items/damaged_anchor": "\u7834\u635f\u8239\u951a",
          "/items/maelstrom_plating": "\u6012\u6d9b\u7532\u7247",
          "/items/kraken_leather": "\u514b\u62c9\u80af\u76ae\u9769",
          "/items/kraken_fang": "\u514b\u62c9\u80af\u4e4b\u7259",
          "/items/pirate_refinement_shard": "\u6d77\u76d7\u7cbe\u70bc\u788e\u7247",
          "/items/butter_of_proficiency": "\u7cbe\u901a\u4e4b\u6cb9",
          "/items/thread_of_expertise": "\u4e13\u7cbe\u4e4b\u7ebf",
          "/items/branch_of_insight": "\u6d1e\u5bdf\u4e4b\u679d",
          "/items/gluttonous_energy": "\u8d2a\u98df\u80fd\u91cf",
          "/items/guzzling_energy": "\u66b4\u996e\u80fd\u91cf",
          "/items/milking_essence": "\u6324\u5976\u7cbe\u534e",
          "/items/foraging_essence": "\u91c7\u6458\u7cbe\u534e",
          "/items/woodcutting_essence": "\u4f10\u6728\u7cbe\u534e",
          "/items/cheesesmithing_essence": "\u5976\u916a\u953b\u9020\u7cbe\u534e",
          "/items/crafting_essence": "\u5236\u4f5c\u7cbe\u534e",
          "/items/tailoring_essence": "\u7f1d\u7eab\u7cbe\u534e",
          "/items/cooking_essence": "\u70f9\u996a\u7cbe\u534e",
          "/items/brewing_essence": "\u51b2\u6ce1\u7cbe\u534e",
          "/items/alchemy_essence": "\u70bc\u91d1\u7cbe\u534e",
          "/items/enhancing_essence": "\u5f3a\u5316\u7cbe\u534e",
          "/items/swamp_essence": "\u6cbc\u6cfd\u7cbe\u534e",
          "/items/aqua_essence": "\u6d77\u6d0b\u7cbe\u534e",
          "/items/jungle_essence": "\u4e1b\u6797\u7cbe\u534e",
          "/items/gobo_essence": "\u54e5\u5e03\u6797\u7cbe\u534e",
          "/items/eyessence": "\u773c\u7cbe\u534e",
          "/items/sorcerer_essence": "\u6cd5\u5e08\u7cbe\u534e",
          "/items/bear_essence": "\u718a\u718a\u7cbe\u534e",
          "/items/golem_essence": "\u9b54\u50cf\u7cbe\u534e",
          "/items/twilight_essence": "\u66ae\u5149\u7cbe\u534e",
          "/items/abyssal_essence": "\u5730\u72f1\u7cbe\u534e",
          "/items/chimerical_essence": "\u5947\u5e7b\u7cbe\u534e",
          "/items/sinister_essence": "\u9634\u68ee\u7cbe\u534e",
          "/items/enchanted_essence": "\u79d8\u6cd5\u7cbe\u534e",
          "/items/pirate_essence": "\u6d77\u76d7\u7cbe\u534e",
          "/items/task_crystal": "\u4efb\u52a1\u6c34\u6676",
          "/items/star_fragment": "\u661f\u5149\u788e\u7247",
          "/items/pearl": "\u73cd\u73e0",
          "/items/amber": "\u7425\u73c0",
          "/items/garnet": "\u77f3\u69b4\u77f3",
          "/items/jade": "\u7fe1\u7fe0",
          "/items/amethyst": "\u7d2b\u6c34\u6676",
          "/items/moonstone": "\u6708\u4eae\u77f3",
          "/items/sunstone": "\u592a\u9633\u77f3",
          "/items/philosophers_stone": "\u8d24\u8005\u4e4b\u77f3",
          "/items/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
          "/items/crushed_amber": "\u7425\u73c0\u788e\u7247",
          "/items/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
          "/items/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
          "/items/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
          "/items/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
          "/items/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
          "/items/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
          "/items/shard_of_protection": "\u4fdd\u62a4\u788e\u7247",
          "/items/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c"
        },
        itemDescriptions: {
          "/items/coin": "\u57fa\u7840\u8d27\u5e01",
          "/items/task_token": "\u4efb\u52a1\u4ee3\u5e01\u3002\u53ef\u5728\u4efb\u52a1\u5546\u5e97\u4e2d\u4f7f\u7528\u8fd9\u4e9b\u4ee3\u5e01",
          "/items/chimerical_token": "\u6765\u81ea\u3010\u5947\u5e7b\u6d1e\u7a74\u3011\u7684\u5730\u4e0b\u57ce\u4ee3\u5e01\u3002\u53ef\u4ee5\u5728\u5730\u4e0b\u57ce\u5546\u5e97\u91cc\u6d88\u8d39",
          "/items/sinister_token": "\u6765\u81ea\u3010\u9634\u68ee\u9a6c\u620f\u56e2\u3011\u7684\u5730\u4e0b\u57ce\u4ee3\u5e01\u3002\u53ef\u4ee5\u5728\u5730\u4e0b\u57ce\u5546\u5e97\u91cc\u6d88\u8d39",
          "/items/enchanted_token": "\u6765\u81ea\u3010\u79d8\u6cd5\u8981\u585e\u3011\u7684\u5730\u4e0b\u57ce\u4ee3\u5e01\u3002\u53ef\u4ee5\u5728\u5730\u4e0b\u57ce\u5546\u5e97\u91cc\u6d88\u8d39",
          "/items/pirate_token": "\u6765\u81ea\u3010\u6d77\u76d7\u57fa\u5730\u3011\u7684\u5730\u4e0b\u57ce\u4ee3\u5e01\u3002\u53ef\u4ee5\u5728\u5730\u4e0b\u57ce\u5546\u5e97\u91cc\u6d88\u8d39",
          "/items/cowbell": "\u9ad8\u7ea7\u8d27\u5e01\u3002\u53ef\u5728\u725b\u94c3\u5546\u5e97\u8d2d\u4e70\u6216\u4f7f\u7528\u8fd9\u4e9b\u8d27\u5e01",
          "/items/bag_of_10_cowbells": "\u53ef\u4ea4\u6613\u7684\u4e00\u888b\u725b\u94c3\uff0c\u6bcf\u888b\u5305\u542b10\u4e2a\u725b\u94c3\u3002\u53ea\u80fd\u6574\u888b\u4ea4\u6613\uff0c\u4e00\u65e6\u6253\u5f00\u5c06\u65e0\u6cd5\u51fa\u552e",
          "/items/purples_gift": "\u83b7\u5f97\u4efb\u52a1\u79ef\u5206\u540e\u5c0f\u7d2b\u725b\u8d60\u9001\u7684\u793c\u7269\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/small_meteorite_cache": "\u5728\u91c7\u96c6\u65f6\u53ef\u4ee5\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/medium_meteorite_cache": "\u5728\u91c7\u96c6\u65f6\u53ef\u4ee5\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/large_meteorite_cache": "\u5728\u91c7\u96c6\u65f6\u53ef\u4ee5\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/small_artisans_crate": "\u5728\u751f\u4ea7\u65f6\u53ef\u4ee5\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/medium_artisans_crate": "\u5728\u751f\u4ea7\u65f6\u53ef\u4ee5\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/large_artisans_crate": "\u5728\u751f\u4ea7\u65f6\u53ef\u4ee5\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/small_treasure_chest": "\u53ef\u4ee5\u4ece\u602a\u7269\u8eab\u4e0a\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/medium_treasure_chest": "\u53ef\u4ee5\u4ece\u602a\u7269\u8eab\u4e0a\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/large_treasure_chest": "\u53ef\u4ee5\u4ece\u602a\u7269\u8eab\u4e0a\u627e\u5230\uff0c\u770b\u8d77\u6765\u91cc\u9762\u88c5\u7740\u7269\u54c1\uff01",
          "/items/chimerical_chest": "\u653b\u514b\u3010\u5947\u5e7b\u6d1e\u7a74\u3011\u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/chimerical_refinement_chest": "\u653b\u514b\u3010\u5947\u5e7b\u6d1e\u7a74\u3011(T1+) \u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/sinister_chest": "\u653b\u514b\u3010\u9634\u68ee\u9a6c\u620f\u56e2\u3011\u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/sinister_refinement_chest": "\u653b\u514b\u3010\u9634\u68ee\u9a6c\u620f\u56e2\u3011(T1+)\u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/enchanted_chest": "\u653b\u514b\u3010\u79d8\u6cd5\u8981\u585e\u3011\u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/enchanted_refinement_chest": "\u653b\u514b\u3010\u79d8\u6cd5\u8981\u585e\u3011(T1+)\u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/pirate_chest": "\u653b\u514b\u3010\u6d77\u76d7\u57fa\u5730\u3011\u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/pirate_refinement_chest": "\u653b\u514b\u3010\u6d77\u76d7\u57fa\u5730\u3011(T1+)\u540e\u7684\u5956\u52b1\uff0c\u53ef\u4ee5\u7528\u3010\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319\u3011\u6253\u5f00",
          "/items/blue_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/green_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/purple_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/white_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/orange_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/brown_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/stone_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/dark_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/burning_key_fragment": "\u770b\u8d77\u6765\u662f\u67d0\u79cd\u94a5\u5319\u7684\u788e\u7247\uff0c\u7528\u6765\u5236\u4f5c\u5730\u4e0b\u57ce\u94a5\u5319",
          "/items/chimerical_entry_key": "\u5141\u8bb8\u8fdb\u5165\u5730\u4e0b\u57ce\u3010\u5947\u5e7b\u6d1e\u7a74\u30111\u6b21",
          "/items/chimerical_chest_key": "\u5f00\u542f\u4e00\u4e2a\u5947\u5e7b\u5b9d\u7bb1",
          "/items/sinister_entry_key": "\u5141\u8bb8\u8fdb\u5165\u5730\u4e0b\u57ce\u3010\u9634\u68ee\u9a6c\u620f\u56e2\u30111\u6b21",
          "/items/sinister_chest_key": "\u5f00\u542f\u4e00\u4e2a\u9634\u68ee\u5b9d\u7bb1",
          "/items/enchanted_entry_key": "\u5141\u8bb8\u8fdb\u5165\u5730\u4e0b\u57ce\u3010\u79d8\u6cd5\u8981\u585e\u30111\u6b21",
          "/items/enchanted_chest_key": "\u5f00\u542f\u4e00\u4e2a\u79d8\u6cd5\u5b9d\u7bb1",
          "/items/pirate_entry_key": "\u5141\u8bb8\u8fdb\u5165\u5730\u4e0b\u57ce\u3010\u6d77\u76d7\u57fa\u5730\u30111\u6b21",
          "/items/pirate_chest_key": "\u5f00\u542f\u4e00\u4e2a\u6d77\u76d7\u5b9d\u7bb1",
          "/items/donut": "",
          "/items/blueberry_donut": "",
          "/items/blackberry_donut": "",
          "/items/strawberry_donut": "",
          "/items/mooberry_donut": "",
          "/items/marsberry_donut": "",
          "/items/spaceberry_donut": "",
          "/items/cupcake": "",
          "/items/blueberry_cake": "",
          "/items/blackberry_cake": "",
          "/items/strawberry_cake": "",
          "/items/mooberry_cake": "",
          "/items/marsberry_cake": "",
          "/items/spaceberry_cake": "",
          "/items/gummy": "",
          "/items/apple_gummy": "",
          "/items/orange_gummy": "",
          "/items/plum_gummy": "",
          "/items/peach_gummy": "",
          "/items/dragon_fruit_gummy": "",
          "/items/star_fruit_gummy": "",
          "/items/yogurt": "",
          "/items/apple_yogurt": "",
          "/items/orange_yogurt": "",
          "/items/plum_yogurt": "",
          "/items/peach_yogurt": "",
          "/items/dragon_fruit_yogurt": "",
          "/items/star_fruit_yogurt": "",
          "/items/milking_tea": "",
          "/items/foraging_tea": "",
          "/items/woodcutting_tea": "",
          "/items/cooking_tea": "",
          "/items/brewing_tea": "",
          "/items/alchemy_tea": "",
          "/items/enhancing_tea": "",
          "/items/cheesesmithing_tea": "",
          "/items/crafting_tea": "",
          "/items/tailoring_tea": "",
          "/items/super_milking_tea": "",
          "/items/super_foraging_tea": "",
          "/items/super_woodcutting_tea": "",
          "/items/super_cooking_tea": "",
          "/items/super_brewing_tea": "",
          "/items/super_alchemy_tea": "",
          "/items/super_enhancing_tea": "",
          "/items/super_cheesesmithing_tea": "",
          "/items/super_crafting_tea": "",
          "/items/super_tailoring_tea": "",
          "/items/ultra_milking_tea": "",
          "/items/ultra_foraging_tea": "",
          "/items/ultra_woodcutting_tea": "",
          "/items/ultra_cooking_tea": "",
          "/items/ultra_brewing_tea": "",
          "/items/ultra_alchemy_tea": "",
          "/items/ultra_enhancing_tea": "",
          "/items/ultra_cheesesmithing_tea": "",
          "/items/ultra_crafting_tea": "",
          "/items/ultra_tailoring_tea": "",
          "/items/gathering_tea": "",
          "/items/gourmet_tea": "",
          "/items/wisdom_tea": "",
          "/items/processing_tea": "",
          "/items/efficiency_tea": "",
          "/items/artisan_tea": "",
          "/items/catalytic_tea": "",
          "/items/blessed_tea": "",
          "/items/stamina_coffee": "",
          "/items/intelligence_coffee": "",
          "/items/defense_coffee": "",
          "/items/attack_coffee": "",
          "/items/melee_coffee": "",
          "/items/ranged_coffee": "",
          "/items/magic_coffee": "",
          "/items/super_stamina_coffee": "",
          "/items/super_intelligence_coffee": "",
          "/items/super_defense_coffee": "",
          "/items/super_attack_coffee": "",
          "/items/super_melee_coffee": "",
          "/items/super_ranged_coffee": "",
          "/items/super_magic_coffee": "",
          "/items/ultra_stamina_coffee": "",
          "/items/ultra_intelligence_coffee": "",
          "/items/ultra_defense_coffee": "",
          "/items/ultra_attack_coffee": "",
          "/items/ultra_melee_coffee": "",
          "/items/ultra_ranged_coffee": "",
          "/items/ultra_magic_coffee": "",
          "/items/wisdom_coffee": "",
          "/items/lucky_coffee": "",
          "/items/swiftness_coffee": "",
          "/items/channeling_coffee": "",
          "/items/critical_coffee": "",
          "/items/poke": "",
          "/items/impale": "",
          "/items/puncture": "",
          "/items/penetrating_strike": "",
          "/items/scratch": "",
          "/items/cleave": "",
          "/items/maim": "",
          "/items/crippling_slash": "",
          "/items/smack": "",
          "/items/sweep": "",
          "/items/stunning_blow": "",
          "/items/fracturing_impact": "",
          "/items/shield_bash": "",
          "/items/quick_shot": "",
          "/items/aqua_arrow": "",
          "/items/flame_arrow": "",
          "/items/rain_of_arrows": "",
          "/items/silencing_shot": "",
          "/items/steady_shot": "",
          "/items/pestilent_shot": "",
          "/items/penetrating_shot": "",
          "/items/water_strike": "",
          "/items/ice_spear": "",
          "/items/frost_surge": "",
          "/items/mana_spring": "",
          "/items/entangle": "",
          "/items/toxic_pollen": "",
          "/items/natures_veil": "",
          "/items/life_drain": "",
          "/items/fireball": "",
          "/items/flame_blast": "",
          "/items/firestorm": "",
          "/items/smoke_burst": "",
          "/items/minor_heal": "",
          "/items/heal": "",
          "/items/quick_aid": "",
          "/items/rejuvenate": "",
          "/items/taunt": "",
          "/items/provoke": "",
          "/items/toughness": "",
          "/items/elusiveness": "",
          "/items/precision": "",
          "/items/berserk": "",
          "/items/elemental_affinity": "",
          "/items/frenzy": "",
          "/items/spike_shell": "",
          "/items/retribution": "",
          "/items/vampirism": "",
          "/items/revive": "",
          "/items/insanity": "",
          "/items/invincible": "",
          "/items/speed_aura": "",
          "/items/guardian_aura": "",
          "/items/fierce_aura": "",
          "/items/critical_aura": "",
          "/items/mystic_aura": "",
          "/items/gobo_stabber": "",
          "/items/gobo_slasher": "",
          "/items/gobo_smasher": "",
          "/items/spiked_bulwark": "",
          "/items/werewolf_slasher": "",
          "/items/griffin_bulwark": "",
          "/items/griffin_bulwark_refined": "",
          "/items/gobo_shooter": "",
          "/items/vampiric_bow": "",
          "/items/cursed_bow": "",
          "/items/cursed_bow_refined": "",
          "/items/gobo_boomstick": "",
          "/items/cheese_bulwark": "",
          "/items/verdant_bulwark": "",
          "/items/azure_bulwark": "",
          "/items/burble_bulwark": "",
          "/items/crimson_bulwark": "",
          "/items/rainbow_bulwark": "",
          "/items/holy_bulwark": "",
          "/items/wooden_bow": "",
          "/items/birch_bow": "",
          "/items/cedar_bow": "",
          "/items/purpleheart_bow": "",
          "/items/ginkgo_bow": "",
          "/items/redwood_bow": "",
          "/items/arcane_bow": "",
          "/items/stalactite_spear": "",
          "/items/granite_bludgeon": "",
          "/items/furious_spear": "",
          "/items/furious_spear_refined": "",
          "/items/regal_sword": "",
          "/items/regal_sword_refined": "",
          "/items/chaotic_flail": "",
          "/items/chaotic_flail_refined": "",
          "/items/soul_hunter_crossbow": "",
          "/items/sundering_crossbow": "",
          "/items/sundering_crossbow_refined": "",
          "/items/frost_staff": "",
          "/items/infernal_battlestaff": "",
          "/items/jackalope_staff": "",
          "/items/rippling_trident": "",
          "/items/rippling_trident_refined": "",
          "/items/blooming_trident": "",
          "/items/blooming_trident_refined": "",
          "/items/blazing_trident": "",
          "/items/blazing_trident_refined": "",
          "/items/cheese_sword": "",
          "/items/verdant_sword": "",
          "/items/azure_sword": "",
          "/items/burble_sword": "",
          "/items/crimson_sword": "",
          "/items/rainbow_sword": "",
          "/items/holy_sword": "",
          "/items/cheese_spear": "",
          "/items/verdant_spear": "",
          "/items/azure_spear": "",
          "/items/burble_spear": "",
          "/items/crimson_spear": "",
          "/items/rainbow_spear": "",
          "/items/holy_spear": "",
          "/items/cheese_mace": "",
          "/items/verdant_mace": "",
          "/items/azure_mace": "",
          "/items/burble_mace": "",
          "/items/crimson_mace": "",
          "/items/rainbow_mace": "",
          "/items/holy_mace": "",
          "/items/wooden_crossbow": "",
          "/items/birch_crossbow": "",
          "/items/cedar_crossbow": "",
          "/items/purpleheart_crossbow": "",
          "/items/ginkgo_crossbow": "",
          "/items/redwood_crossbow": "",
          "/items/arcane_crossbow": "",
          "/items/wooden_water_staff": "",
          "/items/birch_water_staff": "",
          "/items/cedar_water_staff": "",
          "/items/purpleheart_water_staff": "",
          "/items/ginkgo_water_staff": "",
          "/items/redwood_water_staff": "",
          "/items/arcane_water_staff": "",
          "/items/wooden_nature_staff": "",
          "/items/birch_nature_staff": "",
          "/items/cedar_nature_staff": "",
          "/items/purpleheart_nature_staff": "",
          "/items/ginkgo_nature_staff": "",
          "/items/redwood_nature_staff": "",
          "/items/arcane_nature_staff": "",
          "/items/wooden_fire_staff": "",
          "/items/birch_fire_staff": "",
          "/items/cedar_fire_staff": "",
          "/items/purpleheart_fire_staff": "",
          "/items/ginkgo_fire_staff": "",
          "/items/redwood_fire_staff": "",
          "/items/arcane_fire_staff": "",
          "/items/eye_watch": "",
          "/items/snake_fang_dirk": "",
          "/items/vision_shield": "",
          "/items/gobo_defender": "",
          "/items/vampire_fang_dirk": "",
          "/items/knights_aegis": "",
          "/items/knights_aegis_refined": "",
          "/items/treant_shield": "",
          "/items/manticore_shield": "",
          "/items/tome_of_healing": "",
          "/items/tome_of_the_elements": "",
          "/items/watchful_relic": "",
          "/items/bishops_codex": "",
          "/items/bishops_codex_refined": "",
          "/items/cheese_buckler": "",
          "/items/verdant_buckler": "",
          "/items/azure_buckler": "",
          "/items/burble_buckler": "",
          "/items/crimson_buckler": "",
          "/items/rainbow_buckler": "",
          "/items/holy_buckler": "",
          "/items/wooden_shield": "",
          "/items/birch_shield": "",
          "/items/cedar_shield": "",
          "/items/purpleheart_shield": "",
          "/items/ginkgo_shield": "",
          "/items/redwood_shield": "",
          "/items/arcane_shield": "",
          "/items/sinister_cape": "",
          "/items/sinister_cape_refined": "",
          "/items/chimerical_quiver": "",
          "/items/chimerical_quiver_refined": "",
          "/items/enchanted_cloak": "",
          "/items/enchanted_cloak_refined": "",
          "/items/red_culinary_hat": "",
          "/items/snail_shell_helmet": "",
          "/items/vision_helmet": "",
          "/items/fluffy_red_hat": "",
          "/items/corsair_helmet": "",
          "/items/corsair_helmet_refined": "",
          "/items/acrobatic_hood": "",
          "/items/acrobatic_hood_refined": "",
          "/items/magicians_hat": "",
          "/items/magicians_hat_refined": "",
          "/items/cheese_helmet": "",
          "/items/verdant_helmet": "",
          "/items/azure_helmet": "",
          "/items/burble_helmet": "",
          "/items/crimson_helmet": "",
          "/items/rainbow_helmet": "",
          "/items/holy_helmet": "",
          "/items/rough_hood": "",
          "/items/reptile_hood": "",
          "/items/gobo_hood": "",
          "/items/beast_hood": "",
          "/items/umbral_hood": "",
          "/items/cotton_hat": "",
          "/items/linen_hat": "",
          "/items/bamboo_hat": "",
          "/items/silk_hat": "",
          "/items/radiant_hat": "",
          "/items/dairyhands_top": "",
          "/items/foragers_top": "",
          "/items/lumberjacks_top": "",
          "/items/cheesemakers_top": "",
          "/items/crafters_top": "",
          "/items/tailors_top": "",
          "/items/chefs_top": "",
          "/items/brewers_top": "",
          "/items/alchemists_top": "",
          "/items/enhancers_top": "",
          "/items/gator_vest": "",
          "/items/turtle_shell_body": "",
          "/items/colossus_plate_body": "",
          "/items/demonic_plate_body": "",
          "/items/anchorbound_plate_body": "",
          "/items/anchorbound_plate_body_refined": "",
          "/items/maelstrom_plate_body": "",
          "/items/maelstrom_plate_body_refined": "",
          "/items/marine_tunic": "",
          "/items/revenant_tunic": "",
          "/items/griffin_tunic": "",
          "/items/kraken_tunic": "",
          "/items/kraken_tunic_refined": "",
          "/items/icy_robe_top": "",
          "/items/flaming_robe_top": "",
          "/items/luna_robe_top": "",
          "/items/royal_water_robe_top": "",
          "/items/royal_water_robe_top_refined": "",
          "/items/royal_nature_robe_top": "",
          "/items/royal_nature_robe_top_refined": "",
          "/items/royal_fire_robe_top": "",
          "/items/royal_fire_robe_top_refined": "",
          "/items/cheese_plate_body": "",
          "/items/verdant_plate_body": "",
          "/items/azure_plate_body": "",
          "/items/burble_plate_body": "",
          "/items/crimson_plate_body": "",
          "/items/rainbow_plate_body": "",
          "/items/holy_plate_body": "",
          "/items/rough_tunic": "",
          "/items/reptile_tunic": "",
          "/items/gobo_tunic": "",
          "/items/beast_tunic": "",
          "/items/umbral_tunic": "",
          "/items/cotton_robe_top": "",
          "/items/linen_robe_top": "",
          "/items/bamboo_robe_top": "",
          "/items/silk_robe_top": "",
          "/items/radiant_robe_top": "",
          "/items/dairyhands_bottoms": "",
          "/items/foragers_bottoms": "",
          "/items/lumberjacks_bottoms": "",
          "/items/cheesemakers_bottoms": "",
          "/items/crafters_bottoms": "",
          "/items/tailors_bottoms": "",
          "/items/chefs_bottoms": "",
          "/items/brewers_bottoms": "",
          "/items/alchemists_bottoms": "",
          "/items/enhancers_bottoms": "",
          "/items/turtle_shell_legs": "",
          "/items/colossus_plate_legs": "",
          "/items/demonic_plate_legs": "",
          "/items/anchorbound_plate_legs": "",
          "/items/anchorbound_plate_legs_refined": "",
          "/items/maelstrom_plate_legs": "",
          "/items/maelstrom_plate_legs_refined": "",
          "/items/marine_chaps": "",
          "/items/revenant_chaps": "",
          "/items/griffin_chaps": "",
          "/items/kraken_chaps": "",
          "/items/kraken_chaps_refined": "",
          "/items/icy_robe_bottoms": "",
          "/items/flaming_robe_bottoms": "",
          "/items/luna_robe_bottoms": "",
          "/items/royal_water_robe_bottoms": "",
          "/items/royal_water_robe_bottoms_refined": "",
          "/items/royal_nature_robe_bottoms": "",
          "/items/royal_nature_robe_bottoms_refined": "",
          "/items/royal_fire_robe_bottoms": "",
          "/items/royal_fire_robe_bottoms_refined": "",
          "/items/cheese_plate_legs": "",
          "/items/verdant_plate_legs": "",
          "/items/azure_plate_legs": "",
          "/items/burble_plate_legs": "",
          "/items/crimson_plate_legs": "",
          "/items/rainbow_plate_legs": "",
          "/items/holy_plate_legs": "",
          "/items/rough_chaps": "",
          "/items/reptile_chaps": "",
          "/items/gobo_chaps": "",
          "/items/beast_chaps": "",
          "/items/umbral_chaps": "",
          "/items/cotton_robe_bottoms": "",
          "/items/linen_robe_bottoms": "",
          "/items/bamboo_robe_bottoms": "",
          "/items/silk_robe_bottoms": "",
          "/items/radiant_robe_bottoms": "",
          "/items/enchanted_gloves": "",
          "/items/pincer_gloves": "",
          "/items/panda_gloves": "",
          "/items/magnetic_gloves": "",
          "/items/dodocamel_gauntlets": "",
          "/items/dodocamel_gauntlets_refined": "",
          "/items/sighted_bracers": "",
          "/items/marksman_bracers": "",
          "/items/marksman_bracers_refined": "",
          "/items/chrono_gloves": "",
          "/items/cheese_gauntlets": "",
          "/items/verdant_gauntlets": "",
          "/items/azure_gauntlets": "",
          "/items/burble_gauntlets": "",
          "/items/crimson_gauntlets": "",
          "/items/rainbow_gauntlets": "",
          "/items/holy_gauntlets": "",
          "/items/rough_bracers": "",
          "/items/reptile_bracers": "",
          "/items/gobo_bracers": "",
          "/items/beast_bracers": "",
          "/items/umbral_bracers": "",
          "/items/cotton_gloves": "",
          "/items/linen_gloves": "",
          "/items/bamboo_gloves": "",
          "/items/silk_gloves": "",
          "/items/radiant_gloves": "",
          "/items/collectors_boots": "",
          "/items/shoebill_shoes": "",
          "/items/black_bear_shoes": "",
          "/items/grizzly_bear_shoes": "",
          "/items/polar_bear_shoes": "",
          "/items/centaur_boots": "",
          "/items/sorcerer_boots": "",
          "/items/cheese_boots": "",
          "/items/verdant_boots": "",
          "/items/azure_boots": "",
          "/items/burble_boots": "",
          "/items/crimson_boots": "",
          "/items/rainbow_boots": "",
          "/items/holy_boots": "",
          "/items/rough_boots": "",
          "/items/reptile_boots": "",
          "/items/gobo_boots": "",
          "/items/beast_boots": "",
          "/items/umbral_boots": "",
          "/items/cotton_boots": "",
          "/items/linen_boots": "",
          "/items/bamboo_boots": "",
          "/items/silk_boots": "",
          "/items/radiant_boots": "",
          "/items/small_pouch": "",
          "/items/medium_pouch": "",
          "/items/large_pouch": "",
          "/items/giant_pouch": "",
          "/items/gluttonous_pouch": "",
          "/items/guzzling_pouch": "",
          "/items/necklace_of_efficiency": "",
          "/items/fighter_necklace": "",
          "/items/ranger_necklace": "",
          "/items/wizard_necklace": "",
          "/items/necklace_of_wisdom": "",
          "/items/necklace_of_speed": "",
          "/items/philosophers_necklace": "",
          "/items/earrings_of_gathering": "",
          "/items/earrings_of_essence_find": "",
          "/items/earrings_of_armor": "",
          "/items/earrings_of_regeneration": "",
          "/items/earrings_of_resistance": "",
          "/items/earrings_of_rare_find": "",
          "/items/earrings_of_critical_strike": "",
          "/items/philosophers_earrings": "",
          "/items/ring_of_gathering": "",
          "/items/ring_of_essence_find": "",
          "/items/ring_of_armor": "",
          "/items/ring_of_regeneration": "",
          "/items/ring_of_resistance": "",
          "/items/ring_of_rare_find": "",
          "/items/ring_of_critical_strike": "",
          "/items/philosophers_ring": "",
          "/items/trainee_milking_charm": "",
          "/items/basic_milking_charm": "",
          "/items/advanced_milking_charm": "",
          "/items/expert_milking_charm": "",
          "/items/master_milking_charm": "",
          "/items/grandmaster_milking_charm": "",
          "/items/trainee_foraging_charm": "",
          "/items/basic_foraging_charm": "",
          "/items/advanced_foraging_charm": "",
          "/items/expert_foraging_charm": "",
          "/items/master_foraging_charm": "",
          "/items/grandmaster_foraging_charm": "",
          "/items/trainee_woodcutting_charm": "",
          "/items/basic_woodcutting_charm": "",
          "/items/advanced_woodcutting_charm": "",
          "/items/expert_woodcutting_charm": "",
          "/items/master_woodcutting_charm": "",
          "/items/grandmaster_woodcutting_charm": "",
          "/items/trainee_cheesesmithing_charm": "",
          "/items/basic_cheesesmithing_charm": "",
          "/items/advanced_cheesesmithing_charm": "",
          "/items/expert_cheesesmithing_charm": "",
          "/items/master_cheesesmithing_charm": "",
          "/items/grandmaster_cheesesmithing_charm": "",
          "/items/trainee_crafting_charm": "",
          "/items/basic_crafting_charm": "",
          "/items/advanced_crafting_charm": "",
          "/items/expert_crafting_charm": "",
          "/items/master_crafting_charm": "",
          "/items/grandmaster_crafting_charm": "",
          "/items/trainee_tailoring_charm": "",
          "/items/basic_tailoring_charm": "",
          "/items/advanced_tailoring_charm": "",
          "/items/expert_tailoring_charm": "",
          "/items/master_tailoring_charm": "",
          "/items/grandmaster_tailoring_charm": "",
          "/items/trainee_cooking_charm": "",
          "/items/basic_cooking_charm": "",
          "/items/advanced_cooking_charm": "",
          "/items/expert_cooking_charm": "",
          "/items/master_cooking_charm": "",
          "/items/grandmaster_cooking_charm": "",
          "/items/trainee_brewing_charm": "",
          "/items/basic_brewing_charm": "",
          "/items/advanced_brewing_charm": "",
          "/items/expert_brewing_charm": "",
          "/items/master_brewing_charm": "",
          "/items/grandmaster_brewing_charm": "",
          "/items/trainee_alchemy_charm": "",
          "/items/basic_alchemy_charm": "",
          "/items/advanced_alchemy_charm": "",
          "/items/expert_alchemy_charm": "",
          "/items/master_alchemy_charm": "",
          "/items/grandmaster_alchemy_charm": "",
          "/items/trainee_enhancing_charm": "",
          "/items/basic_enhancing_charm": "",
          "/items/advanced_enhancing_charm": "",
          "/items/expert_enhancing_charm": "",
          "/items/master_enhancing_charm": "",
          "/items/grandmaster_enhancing_charm": "",
          "/items/trainee_stamina_charm": "",
          "/items/basic_stamina_charm": "",
          "/items/advanced_stamina_charm": "",
          "/items/expert_stamina_charm": "",
          "/items/master_stamina_charm": "",
          "/items/grandmaster_stamina_charm": "",
          "/items/trainee_intelligence_charm": "",
          "/items/basic_intelligence_charm": "",
          "/items/advanced_intelligence_charm": "",
          "/items/expert_intelligence_charm": "",
          "/items/master_intelligence_charm": "",
          "/items/grandmaster_intelligence_charm": "",
          "/items/trainee_attack_charm": "",
          "/items/basic_attack_charm": "",
          "/items/advanced_attack_charm": "",
          "/items/expert_attack_charm": "",
          "/items/master_attack_charm": "",
          "/items/grandmaster_attack_charm": "",
          "/items/trainee_defense_charm": "",
          "/items/basic_defense_charm": "",
          "/items/advanced_defense_charm": "",
          "/items/expert_defense_charm": "",
          "/items/master_defense_charm": "",
          "/items/grandmaster_defense_charm": "",
          "/items/trainee_melee_charm": "",
          "/items/basic_melee_charm": "",
          "/items/advanced_melee_charm": "",
          "/items/expert_melee_charm": "",
          "/items/master_melee_charm": "",
          "/items/grandmaster_melee_charm": "",
          "/items/trainee_ranged_charm": "",
          "/items/basic_ranged_charm": "",
          "/items/advanced_ranged_charm": "",
          "/items/expert_ranged_charm": "",
          "/items/master_ranged_charm": "",
          "/items/grandmaster_ranged_charm": "",
          "/items/trainee_magic_charm": "",
          "/items/basic_magic_charm": "",
          "/items/advanced_magic_charm": "",
          "/items/expert_magic_charm": "",
          "/items/master_magic_charm": "",
          "/items/grandmaster_magic_charm": "",
          "/items/basic_task_badge": "",
          "/items/advanced_task_badge": "",
          "/items/expert_task_badge": "",
          "/items/celestial_brush": "",
          "/items/cheese_brush": "",
          "/items/verdant_brush": "",
          "/items/azure_brush": "",
          "/items/burble_brush": "",
          "/items/crimson_brush": "",
          "/items/rainbow_brush": "",
          "/items/holy_brush": "",
          "/items/celestial_shears": "",
          "/items/cheese_shears": "",
          "/items/verdant_shears": "",
          "/items/azure_shears": "",
          "/items/burble_shears": "",
          "/items/crimson_shears": "",
          "/items/rainbow_shears": "",
          "/items/holy_shears": "",
          "/items/celestial_hatchet": "",
          "/items/cheese_hatchet": "",
          "/items/verdant_hatchet": "",
          "/items/azure_hatchet": "",
          "/items/burble_hatchet": "",
          "/items/crimson_hatchet": "",
          "/items/rainbow_hatchet": "",
          "/items/holy_hatchet": "",
          "/items/celestial_hammer": "",
          "/items/cheese_hammer": "",
          "/items/verdant_hammer": "",
          "/items/azure_hammer": "",
          "/items/burble_hammer": "",
          "/items/crimson_hammer": "",
          "/items/rainbow_hammer": "",
          "/items/holy_hammer": "",
          "/items/celestial_chisel": "",
          "/items/cheese_chisel": "",
          "/items/verdant_chisel": "",
          "/items/azure_chisel": "",
          "/items/burble_chisel": "",
          "/items/crimson_chisel": "",
          "/items/rainbow_chisel": "",
          "/items/holy_chisel": "",
          "/items/celestial_needle": "",
          "/items/cheese_needle": "",
          "/items/verdant_needle": "",
          "/items/azure_needle": "",
          "/items/burble_needle": "",
          "/items/crimson_needle": "",
          "/items/rainbow_needle": "",
          "/items/holy_needle": "",
          "/items/celestial_spatula": "",
          "/items/cheese_spatula": "",
          "/items/verdant_spatula": "",
          "/items/azure_spatula": "",
          "/items/burble_spatula": "",
          "/items/crimson_spatula": "",
          "/items/rainbow_spatula": "",
          "/items/holy_spatula": "",
          "/items/celestial_pot": "",
          "/items/cheese_pot": "",
          "/items/verdant_pot": "",
          "/items/azure_pot": "",
          "/items/burble_pot": "",
          "/items/crimson_pot": "",
          "/items/rainbow_pot": "",
          "/items/holy_pot": "",
          "/items/celestial_alembic": "",
          "/items/cheese_alembic": "",
          "/items/verdant_alembic": "",
          "/items/azure_alembic": "",
          "/items/burble_alembic": "",
          "/items/crimson_alembic": "",
          "/items/rainbow_alembic": "",
          "/items/holy_alembic": "",
          "/items/celestial_enhancer": "",
          "/items/cheese_enhancer": "",
          "/items/verdant_enhancer": "",
          "/items/azure_enhancer": "",
          "/items/burble_enhancer": "",
          "/items/crimson_enhancer": "",
          "/items/rainbow_enhancer": "",
          "/items/holy_enhancer": "",
          "/items/milk": "\u54de",
          "/items/verdant_milk": "\u54de\u54de",
          "/items/azure_milk": "\u54de\u54de\u54de",
          "/items/burble_milk": "\u54de\u54de\u54de\u54de",
          "/items/crimson_milk": "\u54de\u54de\u54de\u54de\u54de",
          "/items/rainbow_milk": "\u54de\u54de\u54de\u54de\u54de\u54de",
          "/items/holy_milk": "\u54de\u54de\u54de\u54de\u54de\u54de\u54de",
          "/items/cheese": "",
          "/items/verdant_cheese": "",
          "/items/azure_cheese": "",
          "/items/burble_cheese": "",
          "/items/crimson_cheese": "",
          "/items/rainbow_cheese": "",
          "/items/holy_cheese": "",
          "/items/log": "",
          "/items/birch_log": "",
          "/items/cedar_log": "",
          "/items/purpleheart_log": "",
          "/items/ginkgo_log": "",
          "/items/redwood_log": "",
          "/items/arcane_log": "",
          "/items/lumber": "",
          "/items/birch_lumber": "",
          "/items/cedar_lumber": "",
          "/items/purpleheart_lumber": "",
          "/items/ginkgo_lumber": "",
          "/items/redwood_lumber": "",
          "/items/arcane_lumber": "",
          "/items/rough_hide": "",
          "/items/reptile_hide": "",
          "/items/gobo_hide": "",
          "/items/beast_hide": "",
          "/items/umbral_hide": "",
          "/items/rough_leather": "",
          "/items/reptile_leather": "",
          "/items/gobo_leather": "",
          "/items/beast_leather": "",
          "/items/umbral_leather": "",
          "/items/cotton": "",
          "/items/flax": "",
          "/items/bamboo_branch": "",
          "/items/cocoon": "",
          "/items/radiant_fiber": "",
          "/items/cotton_fabric": "",
          "/items/linen_fabric": "",
          "/items/bamboo_fabric": "",
          "/items/silk_fabric": "",
          "/items/radiant_fabric": "",
          "/items/egg": "",
          "/items/wheat": "",
          "/items/sugar": "",
          "/items/blueberry": "",
          "/items/blackberry": "",
          "/items/strawberry": "",
          "/items/mooberry": "",
          "/items/marsberry": "",
          "/items/spaceberry": "",
          "/items/apple": "",
          "/items/orange": "",
          "/items/plum": "",
          "/items/peach": "",
          "/items/dragon_fruit": "",
          "/items/star_fruit": "",
          "/items/arabica_coffee_bean": "",
          "/items/robusta_coffee_bean": "",
          "/items/liberica_coffee_bean": "",
          "/items/excelsa_coffee_bean": "",
          "/items/fieriosa_coffee_bean": "",
          "/items/spacia_coffee_bean": "",
          "/items/green_tea_leaf": "",
          "/items/black_tea_leaf": "",
          "/items/burble_tea_leaf": "",
          "/items/moolong_tea_leaf": "",
          "/items/red_tea_leaf": "",
          "/items/emp_tea_leaf": "",
          "/items/catalyst_of_coinification": "\u5728\u70bc\u91d1\u65f6\u4f7f\u7528\uff0c\u53ef\u63d0\u9ad815%\u7684\u70b9\u91d1\u6210\u529f\u7387 (\u4e58\u6cd5)\u3002\u6210\u529f\u65f6\u6d88\u8017\u4e00\u4e2a\u50ac\u5316\u5242\u3002",
          "/items/catalyst_of_decomposition": "\u5728\u70bc\u91d1\u65f6\u4f7f\u7528\uff0c\u53ef\u5c06\u5206\u89e3\u6210\u529f\u7387\u63d0\u9ad8 15% (\u4e58\u6cd5)\u3002\u6210\u529f\u65f6\u6d88\u8017\u4e00\u4e2a\u50ac\u5316\u5242\u3002",
          "/items/catalyst_of_transmutation": "\u5728\u70bc\u91d1\u65f6\u4f7f\u7528\uff0c\u53ef\u5c06\u8f6c\u5316\u6210\u529f\u7387\u63d0\u9ad8 15% (\u4e58\u6cd5)\u3002\u6210\u529f\u65f6\u6d88\u8017\u4e00\u4e2a\u50ac\u5316\u5242\u3002",
          "/items/prime_catalyst": "\u5728\u70bc\u91d1\u65f6\u4f7f\u7528\uff0c\u53ef\u5c06\u4efb\u4f55\u884c\u52a8\u7684\u6210\u529f\u7387\u63d0\u9ad8 25% (\u4e58\u6cd5)\u3002\u6210\u529f\u65f6\u6d88\u8017\u4e00\u4e2a\u50ac\u5316\u5242\u3002",
          "/items/snake_fang": "\u7528\u4e8e\u953b\u9020\u86c7\u7259\u77ed\u5251\u7684\u6750\u6599",
          "/items/shoebill_feather": "\u7528\u4e8e\u7f1d\u7eab\u9cb8\u5934\u9e73\u978b\u7684\u6750\u6599",
          "/items/snail_shell": "\u7528\u4e8e\u953b\u9020\u8717\u725b\u58f3\u5934\u76d4\u7684\u6750\u6599",
          "/items/crab_pincer": "\u7528\u4e8e\u953b\u9020\u87f9\u94b3\u624b\u5957\u7684\u6750\u6599",
          "/items/turtle_shell": "\u7528\u4e8e\u953b\u9020\u9f9f\u58f3\u80f8\u7532\u6216\u817f\u7532\u7684\u6750\u6599",
          "/items/marine_scale": "\u7528\u4e8e\u7f1d\u7eab\u6d77\u6d0b\u76ae\u8863\u6216\u76ae\u88e4\u7684\u6750\u6599",
          "/items/treant_bark": "\u7528\u4e8e\u5236\u4f5c\u6811\u4eba\u76fe\u7684\u6750\u6599",
          "/items/centaur_hoof": "\u7528\u4e8e\u7f1d\u7eab\u534a\u4eba\u9a6c\u9774\u7684\u6750\u6599",
          "/items/luna_wing": "\u7528\u4e8e\u7f1d\u7eab\u6708\u795e\u888d\u670d\u6216\u888d\u88d9\u7684\u6750\u6599",
          "/items/gobo_rag": "\u7528\u4e8e\u7f1d\u7eab\u6536\u85cf\u5bb6\u9774\u7684\u6750\u6599",
          "/items/goggles": "\u7528\u4e8e\u953b\u9020\u89c6\u89c9\u5934\u76d4\u7684\u6750\u6599",
          "/items/magnifying_glass": "\u7528\u4e8e\u953b\u9020\u89c6\u89c9\u76fe\u6216\u7f1d\u7eab\u7784\u51c6\u62a4\u8155\u7684\u6750\u6599",
          "/items/eye_of_the_watcher": "\u7528\u4e8e\u5236\u4f5c\u638c\u4e0a\u76d1\u5de5\u6216\u8b66\u6212\u9057\u7269\u7684\u6750\u6599",
          "/items/icy_cloth": "\u7528\u4e8e\u7f1d\u7eab\u51b0\u971c\u888d\u670d\u6216\u888d\u88d9\u7684\u6750\u6599",
          "/items/flaming_cloth": "\u7528\u4e8e\u7f1d\u7eab\u70c8\u7130\u888d\u670d\u6216\u888d\u88d9\u7684\u6750\u6599",
          "/items/sorcerers_sole": "\u7528\u4e8e\u7f1d\u7eab\u9b54\u6cd5\u5e08\u9774\u7684\u6750\u6599",
          "/items/chrono_sphere": "\u7528\u4e8e\u7f1d\u7eab\u9644\u9b54\u624b\u5957\u6216\u65f6\u7a7a\u624b\u5957\u7684\u6750\u6599",
          "/items/frost_sphere": "\u7528\u4e8e\u5236\u4f5c\u51b0\u971c\u6cd5\u6756\u7684\u6750\u6599",
          "/items/panda_fluff": "\u7528\u4e8e\u953b\u9020\u718a\u732b\u624b\u5957\u7684\u6750\u6599",
          "/items/black_bear_fluff": "\u7528\u4e8e\u953b\u9020\u9ed1\u718a\u978b\u7684\u6750\u6599",
          "/items/grizzly_bear_fluff": "\u7528\u4e8e\u953b\u9020\u68d5\u718a\u978b\u7684\u6750\u6599",
          "/items/polar_bear_fluff": "\u7528\u4e8e\u953b\u9020\u5317\u6781\u718a\u978b\u7684\u6750\u6599",
          "/items/red_panda_fluff": "\u7528\u4e8e\u7f1d\u7eab\u7ea2\u8272\u53a8\u5e08\u5e3d\u6216\u84ec\u677e\u7ea2\u5e3d\u7684\u6750\u6599",
          "/items/magnet": "\u7528\u4e8e\u953b\u9020\u78c1\u529b\u624b\u5957\u7684\u6750\u6599",
          "/items/stalactite_shard": "\u7528\u4e8e\u953b\u9020\u77f3\u949f\u957f\u67aa\u6216\u5c16\u523a\u91cd\u76fe\u7684\u6750\u6599",
          "/items/living_granite": "\u7528\u4e8e\u953b\u9020\u82b1\u5c97\u5ca9\u5927\u68d2\u6216\u5c16\u523a\u91cd\u76fe\u7684\u6750\u6599",
          "/items/colossus_core": "\u7528\u4e8e\u953b\u9020\u5de8\u50cf\u80f8\u7532\u6216\u817f\u7532\u7684\u6750\u6599",
          "/items/vampire_fang": "\u7528\u4e8e\u953b\u9020\u5438\u8840\u9b3c\u77ed\u5251\u6216\u5236\u4f5c\u5438\u8840\u5f13\u7684\u6750\u6599",
          "/items/werewolf_claw": "\u7528\u4e8e\u953b\u9020\u72fc\u4eba\u5173\u5200\u6216\u5236\u4f5c\u5438\u8840\u5f13\u7684\u6750\u6599",
          "/items/revenant_anima": "\u7528\u4e8e\u7f1d\u7eab\u4ea1\u7075\u76ae\u8863\u6216\u76ae\u88e4\u7684\u6750\u6599",
          "/items/soul_fragment": "\u7528\u4e8e\u5236\u4f5c\u7075\u9b42\u730e\u624b\u5f29\u7684\u6750\u6599",
          "/items/infernal_ember": "\u7528\u4e8e\u5236\u4f5c\u70bc\u72f1\u6cd5\u6756\u7684\u6750\u6599",
          "/items/demonic_core": "\u7528\u4e8e\u953b\u9020\u6076\u9b54\u80f8\u7532\u6216\u817f\u7532\u7684\u6750\u6599",
          "/items/griffin_leather": "\u7528\u4e8e\u953b\u9020\u72ee\u9e6b\u91cd\u76fe\u8ddf\u7f1d\u7eab\u72ee\u9e6b\u76ae\u8863\u6216\u76ae\u88e4\u7684\u6750\u6599",
          "/items/manticore_sting": "\u7528\u4e8e\u5236\u4f5c\u874e\u72ee\u76fe\u7684\u6750\u6599",
          "/items/jackalope_antler": "\u7528\u4e8e\u5236\u4f5c\u9e7f\u89d2\u5154\u4e4b\u6756\u7684\u6750\u6599",
          "/items/dodocamel_plume": "\u7528\u4e8e\u953b\u9020\u6e21\u6e21\u9a7c\u62a4\u624b\u7684\u6750\u6599",
          "/items/griffin_talon": "\u7528\u4e8e\u953b\u9020\u72ee\u9e6b\u91cd\u76fe\u7684\u6750\u6599",
          "/items/chimerical_refinement_shard": "\u7528\u4e8e\u5347\u7ea7\u3010\u5947\u5e7b\u6d1e\u7a74\u301195\u7ea7\u88c5\u5907\u548c\u5947\u5e7b\u7bad\u888b\u7684\u6750\u6599",
          "/items/acrobats_ribbon": "\u7528\u4e8e\u7f1d\u7eab\u6742\u6280\u5e08\u515c\u5e3d\u7684\u6750\u6599",
          "/items/magicians_cloth": "\u7528\u4e8e\u7f1d\u7eab\u9b54\u672f\u5e08\u5e3d\u7684\u6750\u6599",
          "/items/chaotic_chain": "\u7528\u4e8e\u953b\u9020\u6df7\u6c8c\u8fde\u67b7\u7684\u6750\u6599",
          "/items/cursed_ball": "\u7528\u4e8e\u5236\u4f5c\u5492\u6028\u4e4b\u5f13\u7684\u6750\u6599",
          "/items/sinister_refinement_shard": "\u7528\u4e8e\u5347\u7ea7\u3010\u9634\u68ee\u9a6c\u620f\u56e2\u301195\u7ea7\u88c5\u5907\u548c\u9634\u68ee\u6597\u7bf7\u7684\u6750\u6599",
          "/items/royal_cloth": "\u7528\u4e8e\u7f1d\u7eab\u7687\u5bb6\u888d\u670d\u548c\u7687\u5bb6\u888d\u88d9\u7684\u6750\u6599",
          "/items/knights_ingot": "\u7528\u4e8e\u953b\u9020\u9a91\u58eb\u4e4b\u76fe\u7684\u6750\u6599",
          "/items/bishops_scroll": "\u7528\u4e8e\u5236\u4f5c\u4e3b\u6559\u4e4b\u4e66\u7684\u6750\u6599",
          "/items/regal_jewel": "\u7528\u4e8e\u953b\u9020\u541b\u738b\u4e4b\u5251\u548c\u72c2\u6012\u957f\u67aa\u7684\u6750\u6599",
          "/items/sundering_jewel": "\u7528\u4e8e\u5236\u4f5c\u88c2\u7a7a\u4e4b\u5f29\u548c\u953b\u9020\u72c2\u6012\u957f\u67aa\u7684\u6750\u6599",
          "/items/enchanted_refinement_shard": "\u7528\u4e8e\u5347\u7ea7\u3010\u79d8\u6cd5\u8981\u585e\u301195\u7ea7\u88c5\u5907\u548c\u79d8\u6cd5\u62ab\u98ce\u7684\u6750\u6599",
          "/items/marksman_brooch": "\u7528\u4e8e\u7f1d\u7eab\u795e\u5c04\u62a4\u8155\u7684\u6750\u6599",
          "/items/corsair_crest": "\u7528\u4e8e\u953b\u9020\u63a0\u593a\u8005\u5934\u76d4\u7684\u6750\u6599",
          "/items/damaged_anchor": "\u7528\u4e8e\u953b\u9020\u951a\u5b9a\u80f8\u7532\u6216\u817f\u7532\u7684\u6750\u6599",
          "/items/maelstrom_plating": "\u7528\u4e8e\u953b\u9020\u6012\u6d9b\u80f8\u7532\u6216\u817f\u7532\u7684\u6750\u6599",
          "/items/kraken_leather": "\u7528\u4e8e\u7f1d\u7eab\u514b\u62c9\u80af\u76ae\u8863\u6216\u76ae\u88e4\u7684\u6750\u6599",
          "/items/kraken_fang": "\u7528\u4e8e\u5236\u4f5c\u6d9f\u6f2a\u3001\u7efd\u653e\u6216\u70bd\u7130\u4e09\u53c9\u621f\u7684\u6750\u6599",
          "/items/pirate_refinement_shard": "\u7528\u4e8e\u5347\u7ea7\u3010\u6d77\u76d7\u57fa\u5730\u301195\u7ea7\u88c5\u5907\u7684\u6750\u6599",
          "/items/butter_of_proficiency": "\u7528\u4e8e\u5236\u4f5c\u7279\u6b8a\u4e13\u4e1a\u5de5\u5177\u548c\u670d\u88c5\u7684\u6750\u6599",
          "/items/thread_of_expertise": "\u7528\u4e8e\u5236\u4f5c\u7279\u6b8a\u4e13\u4e1a\u670d\u88c5\u7684\u6750\u6599",
          "/items/branch_of_insight": "\u7528\u4e8e\u5236\u4f5c\u7279\u6b8a\u4e13\u4e1a\u5de5\u5177\u548c\u670d\u88c5\u7684\u6750\u6599",
          "/items/gluttonous_energy": "\u7528\u4e8e\u7f1d\u7eab\u8d2a\u98df\u4e4b\u888b",
          "/items/guzzling_energy": "\u7528\u4e8e\u7f1d\u7eab\u66b4\u996e\u4e4b\u56ca",
          "/items/milking_essence": "\u7528\u4e8e\u51b2\u6ce1\u5976\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/foraging_essence": "\u7528\u4e8e\u51b2\u6ce1\u91c7\u6458\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/woodcutting_essence": "\u7528\u4e8e\u51b2\u6ce1\u4f10\u6728\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/cheesesmithing_essence": "\u7528\u4e8e\u51b2\u6ce1\u5976\u916a\u953b\u9020\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/crafting_essence": "\u7528\u4e8e\u51b2\u6ce1\u5236\u4f5c\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/tailoring_essence": "\u7528\u4e8e\u51b2\u6ce1\u7f1d\u7eab\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/cooking_essence": "\u7528\u4e8e\u51b2\u6ce1\u70f9\u996a\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/brewing_essence": "\u7528\u4e8e\u51b2\u6ce1\u51b2\u6ce1\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/alchemy_essence": "\u7528\u4e8e\u51b2\u6ce1\u70bc\u91d1\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/enhancing_essence": "\u7528\u4e8e\u51b2\u6ce1\u5f3a\u5316\u8336\u548c\u5236\u4f5c\u70bc\u91d1\u50ac\u5316\u5242",
          "/items/swamp_essence": "\u7528\u4e8e\u5f3a\u5316\u6cbc\u6cfd\u661f\u7403\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/aqua_essence": "\u7528\u4e8e\u5f3a\u5316\u6d77\u6d0b\u661f\u7403\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/jungle_essence": "\u7528\u4e8e\u5f3a\u5316\u4e1b\u6797\u661f\u7403\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/gobo_essence": "\u7528\u4e8e\u5f3a\u5316\u54e5\u5e03\u6797\u661f\u7403\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/eyessence": "\u7528\u4e8e\u5f3a\u5316\u773c\u7403\u661f\u7403\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/sorcerer_essence": "\u7528\u4e8e\u5f3a\u5316\u5deb\u5e08\u4e4b\u5854\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/bear_essence": "\u7528\u4e8e\u5f3a\u5316\u718a\u718a\u661f\u7403\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/golem_essence": "\u7528\u4e8e\u5f3a\u5316\u9b54\u50cf\u6d1e\u7a74\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/twilight_essence": "\u7528\u4e8e\u5f3a\u5316\u66ae\u5149\u4e4b\u57ce\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/abyssal_essence": "\u7528\u4e8e\u5f3a\u5316\u5730\u72f1\u6df1\u6e0a\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/chimerical_essence": "\u7528\u4e8e\u5f3a\u5316\u5947\u5e7b\u6d1e\u7a74\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/sinister_essence": "\u7528\u4e8e\u5f3a\u5316\u9634\u68ee\u9a6c\u620f\u56e2\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/enchanted_essence": "\u7528\u4e8e\u5f3a\u5316\u79d8\u6cd5\u8981\u585e\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/pirate_essence": "\u7528\u4e8e\u5f3a\u5316\u6d77\u76d7\u57fa\u5730\u7279\u6b8a\u88c5\u5907\u7684\u6750\u6599",
          "/items/task_crystal": "\u5c0f\u7d2b\u725b\u7ed9\u7684\u6c34\u6676\uff0c\u53ef\u4ee5\u7528\u6765\u5236\u4f5c\u7279\u6b8a\u7684\u9970\u54c1\u3002",
          "/items/star_fragment": "\u5728\u9668\u77f3\u8231\u91cc\u53d1\u73b0\u7684\u788e\u7247\uff0c\u53ef\u4ee5\u7528\u6765\u5236\u4f5c\u73e0\u5b9d\u3002",
          "/items/pearl": "\u4e00\u79cd\u95ea\u4eae\u7684\u5b9d\u77f3\uff0c\u901a\u5e38\u5728\u5b9d\u7bb1\u4e2d\u627e\u5230",
          "/items/amber": "\u4e00\u79cd\u95ea\u4eae\u7684\u5b9d\u77f3\uff0c\u901a\u5e38\u5728\u5b9d\u7bb1\u4e2d\u627e\u5230",
          "/items/garnet": "\u4e00\u79cd\u95ea\u4eae\u7684\u5b9d\u77f3\uff0c\u901a\u5e38\u5728\u5b9d\u7bb1\u4e2d\u627e\u5230",
          "/items/jade": "\u4e00\u79cd\u95ea\u4eae\u7684\u5b9d\u77f3\uff0c\u901a\u5e38\u5728\u5b9d\u7bb1\u4e2d\u627e\u5230",
          "/items/amethyst": "\u4e00\u79cd\u95ea\u4eae\u7684\u5b9d\u77f3\uff0c\u901a\u5e38\u5728\u5b9d\u7bb1\u4e2d\u627e\u5230",
          "/items/moonstone": "\u4e00\u79cd\u95ea\u4eae\u7684\u5b9d\u77f3\uff0c\u901a\u5e38\u5728\u5b9d\u7bb1\u4e2d\u627e\u5230",
          "/items/sunstone": "\u4e00\u79cd\u95ea\u4eae\u7684\u592a\u9633\u5f62\u72b6\u7684\u5b9d\u77f3",
          "/items/philosophers_stone": "\u4f20\u8bf4\u4e2d\u62e5\u6709\u65e0\u7a77\u529b\u91cf\u7684\u77f3\u5934",
          "/items/crushed_pearl": "\u66fe\u7ecf\u662f\u4e00\u7c92\u73cd\u73e0",
          "/items/crushed_amber": "\u66fe\u7ecf\u662f\u4e00\u5757\u7425\u73c0",
          "/items/crushed_garnet": "\u66fe\u7ecf\u662f\u4e00\u9897\u77f3\u69b4\u77f3",
          "/items/crushed_jade": "\u66fe\u7ecf\u662f\u4e00\u5757\u7fe1\u7fe0",
          "/items/crushed_amethyst": "\u66fe\u7ecf\u662f\u4e00\u9897\u7d2b\u6c34\u6676",
          "/items/crushed_moonstone": "\u66fe\u7ecf\u662f\u4e00\u679a\u6708\u4eae\u77f3",
          "/items/crushed_sunstone": "\u66fe\u7ecf\u662f\u4e00\u679a\u592a\u9633\u77f3",
          "/items/crushed_philosophers_stone": "\u66fe\u7ecf\u662f\u4e00\u5757\u8d24\u8005\u4e4b\u77f3",
          "/items/shard_of_protection": "\u4ece\u5de5\u5320\u5323\u4e2d\u83b7\u5f97\uff0c\u7528\u4e8e\u5408\u6210\u4fdd\u62a4\u4e4b\u955c",
          "/items/mirror_of_protection": "\u4e00\u79cd\u7a00\u6709\u795e\u5668\uff0c\u53ef\u5728\u5f3a\u5316\u65f6\u4f5c\u4e3a\u4efb\u4f55\u4fdd\u62a4\u88c5\u5907\u7684\u526f\u672c"
        },
        itemCategoryNames: {
          "/item_categories/currency": "\u8d27\u5e01",
          "/item_categories/loot": "\u6218\u5229\u54c1",
          "/item_categories/key": "\u94a5\u5319",
          "/item_categories/food": "\u98df\u7269",
          "/item_categories/drink": "\u996e\u6599",
          "/item_categories/ability_book": "\u6280\u80fd\u4e66",
          "/item_categories/equipment": "\u88c5\u5907",
          "/item_categories/resource": "\u8d44\u6e90"
        },
        itemCategoryPluralNames: {
          "/item_categories/currency": "\u8d27\u5e01",
          "/item_categories/loot": "\u6218\u5229\u54c1",
          "/item_categories/key": "\u94a5\u5319",
          "/item_categories/food": "\u98df\u7269",
          "/item_categories/drink": "\u996e\u6599",
          "/item_categories/ability_book": "\u6280\u80fd\u4e66",
          "/item_categories/equipment": "\u88c5\u5907",
          "/item_categories/resource": "\u8d44\u6e90"
        },
        equipmentTypeNames: {
          "/equipment_types/two_hand": "\u53cc\u624b",
          "/equipment_types/main_hand": "\u4e3b\u624b",
          "/equipment_types/off_hand": "\u526f\u624b",
          "/equipment_types/back": "\u80cc\u90e8",
          "/equipment_types/head": "\u5934\u90e8",
          "/equipment_types/body": "\u8eab\u4f53",
          "/equipment_types/legs": "\u817f\u90e8",
          "/equipment_types/hands": "\u624b\u90e8",
          "/equipment_types/feet": "\u811a\u90e8",
          "/equipment_types/pouch": "\u888b\u5b50",
          "/equipment_types/neck": "\u9879\u94fe",
          "/equipment_types/earrings": "\u8033\u73af",
          "/equipment_types/ring": "\u6212\u6307",
          "/equipment_types/charm": "\u62a4\u7b26",
          "/equipment_types/trinket": "\u9970\u54c1",
          "/equipment_types/milking_tool": "\u6324\u5976\u5de5\u5177",
          "/equipment_types/foraging_tool": "\u91c7\u6458\u5de5\u5177",
          "/equipment_types/woodcutting_tool": "\u4f10\u6728\u5de5\u5177",
          "/equipment_types/cheesesmithing_tool": "\u5976\u916a\u953b\u9020\u5de5\u5177",
          "/equipment_types/crafting_tool": "\u5236\u4f5c\u5de5\u5177",
          "/equipment_types/tailoring_tool": "\u7f1d\u7eab\u5de5\u5177",
          "/equipment_types/cooking_tool": "\u70f9\u996a\u5de5\u5177",
          "/equipment_types/brewing_tool": "\u51b2\u6ce1\u5de5\u5177",
          "/equipment_types/alchemy_tool": "\u70bc\u91d1\u5de5\u5177",
          "/equipment_types/enhancing_tool": "\u5f3a\u5316\u5de5\u5177"
        },
        combatStyleNames: {
          "/combat_styles/stab": "\u523a\u51fb",
          "/combat_styles/slash": "\u65a9\u51fb",
          "/combat_styles/smash": "\u949d\u51fb",
          "/combat_styles/ranged": "\u8fdc\u7a0b",
          "/combat_styles/magic": "\u9b54\u6cd5",
          "/combat_styles/heal": "\u6cbb\u7597"
        },
        damageTypeNames: {
          "/damage_types/physical": "\u7269\u7406",
          "/damage_types/water": "\u6c34\u7cfb",
          "/damage_types/nature": "\u81ea\u7136\u7cfb",
          "/damage_types/fire": "\u706b\u7cfb"
        },
        monsterNames: {
          "/monsters/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
          "/monsters/acrobat": "\u6742\u6280\u5e08",
          "/monsters/anchor_shark": "\u6301\u951a\u9ca8",
          "/monsters/aquahorse": "\u6c34\u9a6c",
          "/monsters/black_bear": "\u9ed1\u718a",
          "/monsters/gobo_boomy": "\u8f70\u8f70",
          "/monsters/brine_marksman": "\u6d77\u76d0\u5c04\u624b",
          "/monsters/captain_fishhook": "\u9c7c\u94a9\u8239\u957f",
          "/monsters/butterjerry": "\u8776\u9f20",
          "/monsters/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
          "/monsters/chronofrost_sorcerer": "\u971c\u65f6\u5deb\u5e08",
          "/monsters/crystal_colossus": "\u6c34\u6676\u5de8\u50cf",
          "/monsters/demonic_overlord": "\u6076\u9b54\u9738\u4e3b",
          "/monsters/deranged_jester": "\u5c0f\u4e11\u7687",
          "/monsters/dodocamel": "\u6e21\u6e21\u9a7c",
          "/monsters/dusk_revenant": "\u9ec4\u660f\u4ea1\u7075",
          "/monsters/elementalist": "\u5143\u7d20\u6cd5\u5e08",
          "/monsters/enchanted_bishop": "\u79d8\u6cd5\u4e3b\u6559",
          "/monsters/enchanted_king": "\u79d8\u6cd5\u56fd\u738b",
          "/monsters/enchanted_knight": "\u79d8\u6cd5\u9a91\u58eb",
          "/monsters/enchanted_pawn": "\u79d8\u6cd5\u58eb\u5175",
          "/monsters/enchanted_queen": "\u79d8\u6cd5\u738b\u540e",
          "/monsters/enchanted_rook": "\u79d8\u6cd5\u5821\u5792",
          "/monsters/eye": "\u72ec\u773c",
          "/monsters/eyes": "\u53e0\u773c",
          "/monsters/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
          "/monsters/fly": "\u82cd\u8747",
          "/monsters/frog": "\u9752\u86d9",
          "/monsters/sea_snail": "\u8717\u725b",
          "/monsters/giant_shoebill": "\u9cb8\u5934\u9e73",
          "/monsters/gobo_chieftain": "\u54e5\u5e03\u6797\u914b\u957f",
          "/monsters/granite_golem": "\u82b1\u5c97\u9b54\u50cf",
          "/monsters/griffin": "\u72ee\u9e6b",
          "/monsters/grizzly_bear": "\u68d5\u718a",
          "/monsters/gummy_bear": "\u8f6f\u7cd6\u718a",
          "/monsters/crab": "\u8783\u87f9",
          "/monsters/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
          "/monsters/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
          "/monsters/jackalope": "\u9e7f\u89d2\u5154",
          "/monsters/rat": "\u6770\u745e",
          "/monsters/juggler": "\u6742\u800d\u8005",
          "/monsters/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
          "/monsters/luna_empress": "\u6708\u795e\u4e4b\u8776",
          "/monsters/magician": "\u9b54\u672f\u5e08",
          "/monsters/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
          "/monsters/manticore": "\u72ee\u874e\u517d",
          "/monsters/marine_huntress": "\u6d77\u6d0b\u730e\u624b",
          "/monsters/myconid": "\u8611\u83c7\u4eba",
          "/monsters/nom_nom": "\u54ac\u54ac\u9c7c",
          "/monsters/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
          "/monsters/panda": "\u718a\u732b",
          "/monsters/polar_bear": "\u5317\u6781\u718a",
          "/monsters/porcupine": "\u8c6a\u732a",
          "/monsters/rabid_rabbit": "\u75af\u9b54\u5154",
          "/monsters/red_panda": "\u5c0f\u718a\u732b",
          "/monsters/alligator": "\u590f\u6d1b\u514b",
          "/monsters/gobo_shooty": "\u54bb\u54bb",
          "/monsters/skunk": "\u81ed\u9f2c",
          "/monsters/gobo_slashy": "\u780d\u780d",
          "/monsters/slimy": "\u53f2\u83b1\u59c6",
          "/monsters/gobo_smashy": "\u9524\u9524",
          "/monsters/soul_hunter": "\u7075\u9b42\u730e\u624b",
          "/monsters/squawker": "\u9e66\u9e49",
          "/monsters/gobo_stabby": "\u523a\u523a",
          "/monsters/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
          "/monsters/swampy": "\u6cbc\u6cfd\u866b",
          "/monsters/the_kraken": "\u514b\u62c9\u80af",
          "/monsters/the_watcher": "\u89c2\u5bdf\u8005",
          "/monsters/snake": "\u86c7",
          "/monsters/tidal_conjuror": "\u6f6e\u6c50\u53ec\u5524\u5e08",
          "/monsters/treant": "\u6811\u4eba",
          "/monsters/turtle": "\u5fcd\u8005\u9f9f",
          "/monsters/vampire": "\u5438\u8840\u9b3c",
          "/monsters/veyes": "\u590d\u773c",
          "/monsters/werewolf": "\u72fc\u4eba",
          "/monsters/zombie": "\u50f5\u5c38",
          "/monsters/zombie_bear": "\u50f5\u5c38\u718a"
        },
        combatTriggerDependencyNames: {
          "/combat_trigger_dependencies/all_allies": "\u6240\u6709\u961f\u53cb\u7684",
          "/combat_trigger_dependencies/all_enemies": "\u6240\u6709\u654c\u4eba\u7684",
          "/combat_trigger_dependencies/self": "\u6211\u7684",
          "/combat_trigger_dependencies/targeted_enemy": "\u76ee\u6807\u654c\u4eba\u7684"
        },
        combatTriggerConditionNames: {
          "/combat_trigger_conditions/number_of_active_units": "\u5b58\u6d3b\u6570",
          "/combat_trigger_conditions/number_of_dead_units": "\u6b7b\u4ea1\u6570",
          "/combat_trigger_conditions/attack_coffee": "\u653b\u51fb\u5496\u5561",
          "/combat_trigger_conditions/berserk": "\u72c2\u66b4",
          "/combat_trigger_conditions/blind_status": "\u5931\u660e\u72b6\u6001",
          "/combat_trigger_conditions/channeling_coffee": "\u541f\u5531\u5496\u5561",
          "/combat_trigger_conditions/crippling_slash": "\u81f4\u6b8b\u65a9\u51cf\u76ca",
          "/combat_trigger_conditions/critical_aura": "\u81f4\u547d\u5149\u73af",
          "/combat_trigger_conditions/critical_coffee": "\u66b4\u51fb\u5496\u5561",
          "/combat_trigger_conditions/current_hp": "\u5f53\u524dHP",
          "/combat_trigger_conditions/current_mp": "\u5f53\u524dMP",
          "/combat_trigger_conditions/curse": "\u8bc5\u5492",
          "/combat_trigger_conditions/defense_coffee": "\u9632\u5fa1\u5496\u5561",
          "/combat_trigger_conditions/elemental_affinity": "\u5143\u7d20\u589e\u5e45",
          "/combat_trigger_conditions/elusiveness": "\u95ea\u907f",
          "/combat_trigger_conditions/enrage": "\u66b4\u8d70",
          "/combat_trigger_conditions/fierce_aura": "\u7269\u7406\u5149\u73af",
          "/combat_trigger_conditions/fracturing_impact": "\u788e\u88c2\u51b2\u51fb\u51cf\u76ca",
          "/combat_trigger_conditions/frenzy": "\u72c2\u901f",
          "/combat_trigger_conditions/frost_surge": "\u51b0\u971c\u7206\u88c2\u51cf\u76ca",
          "/combat_trigger_conditions/fury": "\u72c2\u6012",
          "/combat_trigger_conditions/guardian_aura": "\u5b88\u62a4\u5149\u73af",
          "/combat_trigger_conditions/ice_spear": "\u51b0\u67aa\u51cf\u76ca",
          "/combat_trigger_conditions/insanity": "\u75af\u72c2",
          "/combat_trigger_conditions/intelligence_coffee": "\u667a\u529b\u5496\u5561",
          "/combat_trigger_conditions/invincible": "\u65e0\u654c\u5149\u73af",
          "/combat_trigger_conditions/lowest_hp_percentage": "\u6700\u4f4eHP%",
          "/combat_trigger_conditions/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
          "/combat_trigger_conditions/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
          "/combat_trigger_conditions/maim": "\u8840\u5203\u65a9\u51cf\u76ca",
          "/combat_trigger_conditions/mana_spring": "\u6cd5\u529b\u55b7\u6cc9",
          "/combat_trigger_conditions/melee_coffee": "\u8fd1\u6218\u5496\u5561",
          "/combat_trigger_conditions/missing_hp": "\u7f3a\u5931HP",
          "/combat_trigger_conditions/missing_mp": "\u7f3a\u5931MP",
          "/combat_trigger_conditions/mystic_aura": "\u5143\u7d20\u5149\u73af",
          "/combat_trigger_conditions/pestilent_shot": "\u75ab\u75c5\u5c04\u51fb\u51cf\u76ca",
          "/combat_trigger_conditions/precision": "\u7cbe\u786e",
          "/combat_trigger_conditions/provoke": "\u6311\u8845",
          "/combat_trigger_conditions/puncture": "\u7834\u7532\u4e4b\u523a\u51cf\u76ca",
          "/combat_trigger_conditions/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
          "/combat_trigger_conditions/retribution": "\u60e9\u6212",
          "/combat_trigger_conditions/silence_status": "\u6c89\u9ed8\u72b6\u6001",
          "/combat_trigger_conditions/smoke_burst": "\u70df\u7206\u706d\u5f71\u51cf\u76ca",
          "/combat_trigger_conditions/speed_aura": "\u901f\u5ea6\u5149\u73af",
          "/combat_trigger_conditions/spike_shell": "\u5c16\u523a\u9632\u62a4",
          "/combat_trigger_conditions/stamina_coffee": "\u8010\u529b\u5496\u5561",
          "/combat_trigger_conditions/stun_status": "\u7729\u6655\u72b6\u6001",
          "/combat_trigger_conditions/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
          "/combat_trigger_conditions/taunt": "\u5632\u8bbd",
          "/combat_trigger_conditions/toughness": "\u575a\u97e7",
          "/combat_trigger_conditions/toxic_pollen": "\u5267\u6bd2\u7c89\u5c18\u51cf\u76ca",
          "/combat_trigger_conditions/vampirism": "\u5438\u8840",
          "/combat_trigger_conditions/weaken": "\u865a\u5f31\u72b6\u6001",
          "/combat_trigger_conditions/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561"
        },
        combatTriggerComparatorNames: {
          "/combat_trigger_comparators/less_than_equal": "<=",
          "/combat_trigger_comparators/greater_than_equal": ">=",
          "/combat_trigger_comparators/is_active": "\u5df2\u751f\u6548",
          "/combat_trigger_comparators/is_inactive": "\u672a\u751f\u6548"
        },
        shopCategoryNames: {
          "/shop_categories/dungeon": "\u5730\u4e0b\u57ce",
          "/shop_categories/general": "\u6742\u8d27",
          "/shop_categories/tester": "\u6d4b\u8bd5"
        },
        actionNames: {
          "/actions/milking/cow": "\u5976\u725b",
          "/actions/milking/verdant_cow": "\u7fe0\u7eff\u5976\u725b",
          "/actions/milking/azure_cow": "\u851a\u84dd\u5976\u725b",
          "/actions/milking/burble_cow": "\u6df1\u7d2b\u5976\u725b",
          "/actions/milking/crimson_cow": "\u7edb\u7ea2\u5976\u725b",
          "/actions/milking/unicow": "\u5f69\u8679\u5976\u725b",
          "/actions/milking/holy_cow": "\u795e\u5723\u5976\u725b",
          "/actions/foraging/egg": "\u9e21\u86cb",
          "/actions/foraging/wheat": "\u5c0f\u9ea6",
          "/actions/foraging/sugar": "\u7cd6",
          "/actions/foraging/cotton": "\u68c9\u82b1",
          "/actions/foraging/farmland": "\u7fe0\u91ce\u519c\u573a",
          "/actions/foraging/blueberry": "\u84dd\u8393",
          "/actions/foraging/apple": "\u82f9\u679c",
          "/actions/foraging/arabica_coffee_bean": "\u4f4e\u7ea7\u5496\u5561\u8c46",
          "/actions/foraging/flax": "\u4e9a\u9ebb",
          "/actions/foraging/shimmering_lake": "\u6ce2\u5149\u6e56\u6cca",
          "/actions/foraging/blackberry": "\u9ed1\u8393",
          "/actions/foraging/orange": "\u6a59\u5b50",
          "/actions/foraging/robusta_coffee_bean": "\u4e2d\u7ea7\u5496\u5561\u8c46",
          "/actions/foraging/misty_forest": "\u8ff7\u96fe\u68ee\u6797",
          "/actions/foraging/strawberry": "\u8349\u8393",
          "/actions/foraging/plum": "\u674e\u5b50",
          "/actions/foraging/liberica_coffee_bean": "\u9ad8\u7ea7\u5496\u5561\u8c46",
          "/actions/foraging/bamboo_branch": "\u7af9\u5b50",
          "/actions/foraging/burble_beach": "\u6df1\u7d2b\u6c99\u6ee9",
          "/actions/foraging/mooberry": "\u54de\u8393",
          "/actions/foraging/peach": "\u6843\u5b50",
          "/actions/foraging/excelsa_coffee_bean": "\u7279\u7ea7\u5496\u5561\u8c46",
          "/actions/foraging/cocoon": "\u8695\u8327",
          "/actions/foraging/silly_cow_valley": "\u50bb\u725b\u5c71\u8c37",
          "/actions/foraging/marsberry": "\u706b\u661f\u8393",
          "/actions/foraging/dragon_fruit": "\u706b\u9f99\u679c",
          "/actions/foraging/fieriosa_coffee_bean": "\u706b\u5c71\u5496\u5561\u8c46",
          "/actions/foraging/olympus_mons": "\u5965\u6797\u5339\u65af\u5c71",
          "/actions/foraging/spaceberry": "\u592a\u7a7a\u8393",
          "/actions/foraging/star_fruit": "\u6768\u6843",
          "/actions/foraging/spacia_coffee_bean": "\u592a\u7a7a\u5496\u5561\u8c46",
          "/actions/foraging/radiant_fiber": "\u5149\u8f89\u7ea4\u7ef4",
          "/actions/foraging/asteroid_belt": "\u5c0f\u884c\u661f\u5e26",
          "/actions/woodcutting/tree": "\u6811",
          "/actions/woodcutting/birch_tree": "\u6866\u6811",
          "/actions/woodcutting/cedar_tree": "\u96ea\u677e\u6811",
          "/actions/woodcutting/purpleheart_tree": "\u7d2b\u5fc3\u6811",
          "/actions/woodcutting/ginkgo_tree": "\u94f6\u674f\u6811",
          "/actions/woodcutting/redwood_tree": "\u7ea2\u6749\u6811",
          "/actions/woodcutting/arcane_tree": "\u5965\u79d8\u6811",
          "/actions/cheesesmithing/cheese": "\u5976\u916a",
          "/actions/cheesesmithing/cheese_boots": "\u5976\u916a\u9774",
          "/actions/cheesesmithing/cheese_gauntlets": "\u5976\u916a\u62a4\u624b",
          "/actions/cheesesmithing/cheese_sword": "\u5976\u916a\u5251",
          "/actions/cheesesmithing/cheese_brush": "\u5976\u916a\u5237\u5b50",
          "/actions/cheesesmithing/cheese_shears": "\u5976\u916a\u526a\u5200",
          "/actions/cheesesmithing/cheese_hatchet": "\u5976\u916a\u65a7\u5934",
          "/actions/cheesesmithing/cheese_spear": "\u5976\u916a\u957f\u67aa",
          "/actions/cheesesmithing/cheese_hammer": "\u5976\u916a\u9524\u5b50",
          "/actions/cheesesmithing/cheese_chisel": "\u5976\u916a\u51ff\u5b50",
          "/actions/cheesesmithing/cheese_needle": "\u5976\u916a\u9488",
          "/actions/cheesesmithing/cheese_spatula": "\u5976\u916a\u9505\u94f2",
          "/actions/cheesesmithing/cheese_pot": "\u5976\u916a\u58f6",
          "/actions/cheesesmithing/cheese_mace": "\u5976\u916a\u9489\u5934\u9524",
          "/actions/cheesesmithing/cheese_alembic": "\u5976\u916a\u84b8\u998f\u5668",
          "/actions/cheesesmithing/cheese_enhancer": "\u5976\u916a\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/cheese_helmet": "\u5976\u916a\u5934\u76d4",
          "/actions/cheesesmithing/cheese_buckler": "\u5976\u916a\u5706\u76fe",
          "/actions/cheesesmithing/cheese_bulwark": "\u5976\u916a\u91cd\u76fe",
          "/actions/cheesesmithing/cheese_plate_legs": "\u5976\u916a\u817f\u7532",
          "/actions/cheesesmithing/cheese_plate_body": "\u5976\u916a\u80f8\u7532",
          "/actions/cheesesmithing/verdant_cheese": "\u7fe0\u7eff\u5976\u916a",
          "/actions/cheesesmithing/verdant_boots": "\u7fe0\u7eff\u9774",
          "/actions/cheesesmithing/verdant_gauntlets": "\u7fe0\u7eff\u62a4\u624b",
          "/actions/cheesesmithing/verdant_sword": "\u7fe0\u7eff\u5251",
          "/actions/cheesesmithing/verdant_brush": "\u7fe0\u7eff\u5237\u5b50",
          "/actions/cheesesmithing/verdant_shears": "\u7fe0\u7eff\u526a\u5200",
          "/actions/cheesesmithing/verdant_hatchet": "\u7fe0\u7eff\u65a7\u5934",
          "/actions/cheesesmithing/verdant_spear": "\u7fe0\u7eff\u957f\u67aa",
          "/actions/cheesesmithing/verdant_hammer": "\u7fe0\u7eff\u9524\u5b50",
          "/actions/cheesesmithing/verdant_chisel": "\u7fe0\u7eff\u51ff\u5b50",
          "/actions/cheesesmithing/verdant_needle": "\u7fe0\u7eff\u9488",
          "/actions/cheesesmithing/verdant_spatula": "\u7fe0\u7eff\u9505\u94f2",
          "/actions/cheesesmithing/verdant_pot": "\u7fe0\u7eff\u58f6",
          "/actions/cheesesmithing/verdant_mace": "\u7fe0\u7eff\u9489\u5934\u9524",
          "/actions/cheesesmithing/snake_fang_dirk": "\u86c7\u7259\u77ed\u5251",
          "/actions/cheesesmithing/verdant_alembic": "\u7fe0\u7eff\u84b8\u998f\u5668",
          "/actions/cheesesmithing/verdant_enhancer": "\u7fe0\u7eff\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/verdant_helmet": "\u7fe0\u7eff\u5934\u76d4",
          "/actions/cheesesmithing/verdant_buckler": "\u7fe0\u7eff\u5706\u76fe",
          "/actions/cheesesmithing/verdant_bulwark": "\u7fe0\u7eff\u91cd\u76fe",
          "/actions/cheesesmithing/verdant_plate_legs": "\u7fe0\u7eff\u817f\u7532",
          "/actions/cheesesmithing/verdant_plate_body": "\u7fe0\u7eff\u80f8\u7532",
          "/actions/cheesesmithing/azure_cheese": "\u851a\u84dd\u5976\u916a",
          "/actions/cheesesmithing/azure_boots": "\u851a\u84dd\u9774",
          "/actions/cheesesmithing/azure_gauntlets": "\u851a\u84dd\u62a4\u624b",
          "/actions/cheesesmithing/azure_sword": "\u851a\u84dd\u5251",
          "/actions/cheesesmithing/azure_brush": "\u851a\u84dd\u5237\u5b50",
          "/actions/cheesesmithing/azure_shears": "\u851a\u84dd\u526a\u5200",
          "/actions/cheesesmithing/azure_hatchet": "\u851a\u84dd\u65a7\u5934",
          "/actions/cheesesmithing/azure_spear": "\u851a\u84dd\u957f\u67aa",
          "/actions/cheesesmithing/azure_hammer": "\u851a\u84dd\u9524\u5b50",
          "/actions/cheesesmithing/azure_chisel": "\u851a\u84dd\u51ff\u5b50",
          "/actions/cheesesmithing/azure_needle": "\u851a\u84dd\u9488",
          "/actions/cheesesmithing/azure_spatula": "\u851a\u84dd\u9505\u94f2",
          "/actions/cheesesmithing/azure_pot": "\u851a\u84dd\u58f6",
          "/actions/cheesesmithing/azure_mace": "\u851a\u84dd\u9489\u5934\u9524",
          "/actions/cheesesmithing/pincer_gloves": "\u87f9\u94b3\u624b\u5957",
          "/actions/cheesesmithing/azure_alembic": "\u851a\u84dd\u84b8\u998f\u5668",
          "/actions/cheesesmithing/azure_enhancer": "\u851a\u84dd\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/azure_helmet": "\u851a\u84dd\u5934\u76d4",
          "/actions/cheesesmithing/azure_buckler": "\u851a\u84dd\u5706\u76fe",
          "/actions/cheesesmithing/azure_bulwark": "\u851a\u84dd\u91cd\u76fe",
          "/actions/cheesesmithing/azure_plate_legs": "\u851a\u84dd\u817f\u7532",
          "/actions/cheesesmithing/snail_shell_helmet": "\u8717\u725b\u58f3\u5934\u76d4",
          "/actions/cheesesmithing/azure_plate_body": "\u851a\u84dd\u80f8\u7532",
          "/actions/cheesesmithing/turtle_shell_legs": "\u9f9f\u58f3\u817f\u7532",
          "/actions/cheesesmithing/turtle_shell_body": "\u9f9f\u58f3\u80f8\u7532",
          "/actions/cheesesmithing/burble_cheese": "\u6df1\u7d2b\u5976\u916a",
          "/actions/cheesesmithing/burble_boots": "\u6df1\u7d2b\u9774",
          "/actions/cheesesmithing/burble_gauntlets": "\u6df1\u7d2b\u62a4\u624b",
          "/actions/cheesesmithing/burble_sword": "\u6df1\u7d2b\u5251",
          "/actions/cheesesmithing/burble_brush": "\u6df1\u7d2b\u5237\u5b50",
          "/actions/cheesesmithing/burble_shears": "\u6df1\u7d2b\u526a\u5200",
          "/actions/cheesesmithing/burble_hatchet": "\u6df1\u7d2b\u65a7\u5934",
          "/actions/cheesesmithing/burble_spear": "\u6df1\u7d2b\u957f\u67aa",
          "/actions/cheesesmithing/burble_hammer": "\u6df1\u7d2b\u9524\u5b50",
          "/actions/cheesesmithing/burble_chisel": "\u6df1\u7d2b\u51ff\u5b50",
          "/actions/cheesesmithing/burble_needle": "\u6df1\u7d2b\u9488",
          "/actions/cheesesmithing/burble_spatula": "\u6df1\u7d2b\u9505\u94f2",
          "/actions/cheesesmithing/burble_pot": "\u6df1\u7d2b\u58f6",
          "/actions/cheesesmithing/burble_mace": "\u6df1\u7d2b\u9489\u5934\u9524",
          "/actions/cheesesmithing/burble_alembic": "\u6df1\u7d2b\u84b8\u998f\u5668",
          "/actions/cheesesmithing/burble_enhancer": "\u6df1\u7d2b\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/burble_helmet": "\u6df1\u7d2b\u5934\u76d4",
          "/actions/cheesesmithing/burble_buckler": "\u6df1\u7d2b\u5706\u76fe",
          "/actions/cheesesmithing/burble_bulwark": "\u6df1\u7d2b\u91cd\u76fe",
          "/actions/cheesesmithing/burble_plate_legs": "\u6df1\u7d2b\u817f\u7532",
          "/actions/cheesesmithing/burble_plate_body": "\u6df1\u7d2b\u80f8\u7532",
          "/actions/cheesesmithing/crimson_cheese": "\u7edb\u7ea2\u5976\u916a",
          "/actions/cheesesmithing/crimson_boots": "\u7edb\u7ea2\u9774",
          "/actions/cheesesmithing/crimson_gauntlets": "\u7edb\u7ea2\u62a4\u624b",
          "/actions/cheesesmithing/crimson_sword": "\u7edb\u7ea2\u5251",
          "/actions/cheesesmithing/crimson_brush": "\u7edb\u7ea2\u5237\u5b50",
          "/actions/cheesesmithing/crimson_shears": "\u7edb\u7ea2\u526a\u5200",
          "/actions/cheesesmithing/crimson_hatchet": "\u7edb\u7ea2\u65a7\u5934",
          "/actions/cheesesmithing/crimson_spear": "\u7edb\u7ea2\u957f\u67aa",
          "/actions/cheesesmithing/crimson_hammer": "\u7edb\u7ea2\u9524\u5b50",
          "/actions/cheesesmithing/crimson_chisel": "\u7edb\u7ea2\u51ff\u5b50",
          "/actions/cheesesmithing/crimson_needle": "\u7edb\u7ea2\u9488",
          "/actions/cheesesmithing/crimson_spatula": "\u7edb\u7ea2\u9505\u94f2",
          "/actions/cheesesmithing/crimson_pot": "\u7edb\u7ea2\u58f6",
          "/actions/cheesesmithing/crimson_mace": "\u7edb\u7ea2\u9489\u5934\u9524",
          "/actions/cheesesmithing/crimson_alembic": "\u7edb\u7ea2\u84b8\u998f\u5668",
          "/actions/cheesesmithing/crimson_enhancer": "\u7edb\u7ea2\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/crimson_helmet": "\u7edb\u7ea2\u5934\u76d4",
          "/actions/cheesesmithing/crimson_buckler": "\u7edb\u7ea2\u5706\u76fe",
          "/actions/cheesesmithing/crimson_bulwark": "\u7edb\u7ea2\u91cd\u76fe",
          "/actions/cheesesmithing/crimson_plate_legs": "\u7edb\u7ea2\u817f\u7532",
          "/actions/cheesesmithing/vision_helmet": "\u89c6\u89c9\u5934\u76d4",
          "/actions/cheesesmithing/vision_shield": "\u89c6\u89c9\u76fe",
          "/actions/cheesesmithing/crimson_plate_body": "\u7edb\u7ea2\u80f8\u7532",
          "/actions/cheesesmithing/rainbow_cheese": "\u5f69\u8679\u5976\u916a",
          "/actions/cheesesmithing/rainbow_boots": "\u5f69\u8679\u9774",
          "/actions/cheesesmithing/black_bear_shoes": "\u9ed1\u718a\u978b",
          "/actions/cheesesmithing/grizzly_bear_shoes": "\u68d5\u718a\u978b",
          "/actions/cheesesmithing/polar_bear_shoes": "\u5317\u6781\u718a\u978b",
          "/actions/cheesesmithing/rainbow_gauntlets": "\u5f69\u8679\u62a4\u624b",
          "/actions/cheesesmithing/rainbow_sword": "\u5f69\u8679\u5251",
          "/actions/cheesesmithing/panda_gloves": "\u718a\u732b\u624b\u5957",
          "/actions/cheesesmithing/rainbow_brush": "\u5f69\u8679\u5237\u5b50",
          "/actions/cheesesmithing/rainbow_shears": "\u5f69\u8679\u526a\u5200",
          "/actions/cheesesmithing/rainbow_hatchet": "\u5f69\u8679\u65a7\u5934",
          "/actions/cheesesmithing/rainbow_spear": "\u5f69\u8679\u957f\u67aa",
          "/actions/cheesesmithing/rainbow_hammer": "\u5f69\u8679\u9524\u5b50",
          "/actions/cheesesmithing/rainbow_chisel": "\u5f69\u8679\u51ff\u5b50",
          "/actions/cheesesmithing/rainbow_needle": "\u5f69\u8679\u9488",
          "/actions/cheesesmithing/rainbow_spatula": "\u5f69\u8679\u9505\u94f2",
          "/actions/cheesesmithing/rainbow_pot": "\u5f69\u8679\u58f6",
          "/actions/cheesesmithing/rainbow_mace": "\u5f69\u8679\u9489\u5934\u9524",
          "/actions/cheesesmithing/rainbow_alembic": "\u5f69\u8679\u84b8\u998f\u5668",
          "/actions/cheesesmithing/rainbow_enhancer": "\u5f69\u8679\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/rainbow_helmet": "\u5f69\u8679\u5934\u76d4",
          "/actions/cheesesmithing/rainbow_buckler": "\u5f69\u8679\u5706\u76fe",
          "/actions/cheesesmithing/rainbow_bulwark": "\u5f69\u8679\u91cd\u76fe",
          "/actions/cheesesmithing/rainbow_plate_legs": "\u5f69\u8679\u817f\u7532",
          "/actions/cheesesmithing/rainbow_plate_body": "\u5f69\u8679\u80f8\u7532",
          "/actions/cheesesmithing/holy_cheese": "\u795e\u5723\u5976\u916a",
          "/actions/cheesesmithing/holy_boots": "\u795e\u5723\u9774",
          "/actions/cheesesmithing/holy_gauntlets": "\u795e\u5723\u62a4\u624b",
          "/actions/cheesesmithing/holy_sword": "\u795e\u5723\u5251",
          "/actions/cheesesmithing/holy_brush": "\u795e\u5723\u5237\u5b50",
          "/actions/cheesesmithing/holy_shears": "\u795e\u5723\u526a\u5200",
          "/actions/cheesesmithing/holy_hatchet": "\u795e\u5723\u65a7\u5934",
          "/actions/cheesesmithing/holy_spear": "\u795e\u5723\u957f\u67aa",
          "/actions/cheesesmithing/holy_hammer": "\u795e\u5723\u9524\u5b50",
          "/actions/cheesesmithing/holy_chisel": "\u795e\u5723\u51ff\u5b50",
          "/actions/cheesesmithing/holy_needle": "\u795e\u5723\u9488",
          "/actions/cheesesmithing/holy_spatula": "\u795e\u5723\u9505\u94f2",
          "/actions/cheesesmithing/holy_pot": "\u795e\u5723\u58f6",
          "/actions/cheesesmithing/holy_mace": "\u795e\u5723\u9489\u5934\u9524",
          "/actions/cheesesmithing/magnetic_gloves": "\u78c1\u529b\u624b\u5957",
          "/actions/cheesesmithing/stalactite_spear": "\u77f3\u949f\u957f\u67aa",
          "/actions/cheesesmithing/granite_bludgeon": "\u82b1\u5c97\u5ca9\u5927\u68d2",
          "/actions/cheesesmithing/vampire_fang_dirk": "\u5438\u8840\u9b3c\u77ed\u5251",
          "/actions/cheesesmithing/werewolf_slasher": "\u72fc\u4eba\u5173\u5200",
          "/actions/cheesesmithing/holy_alembic": "\u795e\u5723\u84b8\u998f\u5668",
          "/actions/cheesesmithing/holy_enhancer": "\u795e\u5723\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/holy_helmet": "\u795e\u5723\u5934\u76d4",
          "/actions/cheesesmithing/holy_buckler": "\u795e\u5723\u5706\u76fe",
          "/actions/cheesesmithing/holy_bulwark": "\u795e\u5723\u91cd\u76fe",
          "/actions/cheesesmithing/holy_plate_legs": "\u795e\u5723\u817f\u7532",
          "/actions/cheesesmithing/holy_plate_body": "\u795e\u5723\u80f8\u7532",
          "/actions/cheesesmithing/celestial_brush": "\u661f\u7a7a\u5237\u5b50",
          "/actions/cheesesmithing/celestial_shears": "\u661f\u7a7a\u526a\u5200",
          "/actions/cheesesmithing/celestial_hatchet": "\u661f\u7a7a\u65a7\u5934",
          "/actions/cheesesmithing/celestial_hammer": "\u661f\u7a7a\u9524\u5b50",
          "/actions/cheesesmithing/celestial_chisel": "\u661f\u7a7a\u51ff\u5b50",
          "/actions/cheesesmithing/celestial_needle": "\u661f\u7a7a\u9488",
          "/actions/cheesesmithing/celestial_spatula": "\u661f\u7a7a\u9505\u94f2",
          "/actions/cheesesmithing/celestial_pot": "\u661f\u7a7a\u58f6",
          "/actions/cheesesmithing/celestial_alembic": "\u661f\u7a7a\u84b8\u998f\u5668",
          "/actions/cheesesmithing/celestial_enhancer": "\u661f\u7a7a\u5f3a\u5316\u5668",
          "/actions/cheesesmithing/colossus_plate_body": "\u5de8\u50cf\u80f8\u7532",
          "/actions/cheesesmithing/colossus_plate_legs": "\u5de8\u50cf\u817f\u7532",
          "/actions/cheesesmithing/demonic_plate_body": "\u6076\u9b54\u80f8\u7532",
          "/actions/cheesesmithing/demonic_plate_legs": "\u6076\u9b54\u817f\u7532",
          "/actions/cheesesmithing/spiked_bulwark": "\u5c16\u523a\u91cd\u76fe",
          "/actions/cheesesmithing/dodocamel_gauntlets": "\u6e21\u6e21\u9a7c\u62a4\u624b",
          "/actions/cheesesmithing/corsair_helmet": "\u63a0\u593a\u8005\u5934\u76d4",
          "/actions/cheesesmithing/knights_aegis": "\u9a91\u58eb\u76fe",
          "/actions/cheesesmithing/anchorbound_plate_legs": "\u951a\u5b9a\u817f\u7532",
          "/actions/cheesesmithing/maelstrom_plate_legs": "\u6012\u6d9b\u817f\u7532",
          "/actions/cheesesmithing/griffin_bulwark": "\u72ee\u9e6b\u91cd\u76fe",
          "/actions/cheesesmithing/furious_spear": "\u72c2\u6012\u957f\u67aa",
          "/actions/cheesesmithing/chaotic_flail": "\u6df7\u6c8c\u8fde\u67b7",
          "/actions/cheesesmithing/regal_sword": "\u541b\u738b\u4e4b\u5251",
          "/actions/cheesesmithing/anchorbound_plate_body": "\u951a\u5b9a\u80f8\u7532",
          "/actions/cheesesmithing/maelstrom_plate_body": "\u6012\u6d9b\u80f8\u7532",
          "/actions/cheesesmithing/dodocamel_gauntlets_refined": "\u6e21\u6e21\u9a7c\u62a4\u624b\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/corsair_helmet_refined": "\u63a0\u593a\u8005\u5934\u76d4\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/knights_aegis_refined": "\u9a91\u58eb\u76fe\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/anchorbound_plate_legs_refined": "\u951a\u5b9a\u817f\u7532\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/maelstrom_plate_legs_refined": "\u6012\u6d9b\u817f\u7532\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/griffin_bulwark_refined": "\u72ee\u9e6b\u91cd\u76fe\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/furious_spear_refined": "\u72c2\u6012\u957f\u67aa\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/chaotic_flail_refined": "\u6df7\u6c8c\u8fde\u67b7\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/regal_sword_refined": "\u541b\u738b\u4e4b\u5251\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/anchorbound_plate_body_refined": "\u951a\u5b9a\u80f8\u7532\uff08\u7cbe\uff09",
          "/actions/cheesesmithing/maelstrom_plate_body_refined": "\u6012\u6d9b\u80f8\u7532\uff08\u7cbe\uff09",
          "/actions/crafting/lumber": "\u6728\u677f",
          "/actions/crafting/wooden_crossbow": "\u6728\u5f29",
          "/actions/crafting/wooden_water_staff": "\u6728\u5236\u6c34\u6cd5\u6756",
          "/actions/crafting/basic_task_badge": "\u57fa\u7840\u4efb\u52a1\u5fbd\u7ae0",
          "/actions/crafting/advanced_task_badge": "\u9ad8\u7ea7\u4efb\u52a1\u5fbd\u7ae0",
          "/actions/crafting/expert_task_badge": "\u4e13\u5bb6\u4efb\u52a1\u5fbd\u7ae0",
          "/actions/crafting/wooden_shield": "\u6728\u76fe",
          "/actions/crafting/wooden_nature_staff": "\u6728\u5236\u81ea\u7136\u6cd5\u6756",
          "/actions/crafting/wooden_bow": "\u6728\u5f13",
          "/actions/crafting/wooden_fire_staff": "\u6728\u5236\u706b\u6cd5\u6756",
          "/actions/crafting/birch_lumber": "\u767d\u6866\u6728\u677f",
          "/actions/crafting/birch_crossbow": "\u6866\u6728\u5f29",
          "/actions/crafting/birch_water_staff": "\u6866\u6728\u6c34\u6cd5\u6756",
          "/actions/crafting/crushed_pearl": "\u73cd\u73e0\u788e\u7247",
          "/actions/crafting/birch_shield": "\u6866\u6728\u76fe",
          "/actions/crafting/birch_nature_staff": "\u6866\u6728\u81ea\u7136\u6cd5\u6756",
          "/actions/crafting/birch_bow": "\u6866\u6728\u5f13",
          "/actions/crafting/ring_of_gathering": "\u91c7\u96c6\u6212\u6307",
          "/actions/crafting/birch_fire_staff": "\u6866\u6728\u706b\u6cd5\u6756",
          "/actions/crafting/earrings_of_gathering": "\u91c7\u96c6\u8033\u73af",
          "/actions/crafting/cedar_lumber": "\u96ea\u677e\u6728\u677f",
          "/actions/crafting/cedar_crossbow": "\u96ea\u677e\u5f29",
          "/actions/crafting/cedar_water_staff": "\u96ea\u677e\u6c34\u6cd5\u6756",
          "/actions/crafting/basic_milking_charm": "\u57fa\u7840\u6324\u5976\u62a4\u7b26",
          "/actions/crafting/basic_foraging_charm": "\u57fa\u7840\u91c7\u6458\u62a4\u7b26",
          "/actions/crafting/basic_woodcutting_charm": "\u57fa\u7840\u4f10\u6728\u62a4\u7b26",
          "/actions/crafting/basic_cheesesmithing_charm": "\u57fa\u7840\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/actions/crafting/basic_crafting_charm": "\u57fa\u7840\u5236\u4f5c\u62a4\u7b26",
          "/actions/crafting/basic_tailoring_charm": "\u57fa\u7840\u7f1d\u7eab\u62a4\u7b26",
          "/actions/crafting/basic_cooking_charm": "\u57fa\u7840\u70f9\u996a\u62a4\u7b26",
          "/actions/crafting/basic_brewing_charm": "\u57fa\u7840\u917f\u9020\u62a4\u7b26",
          "/actions/crafting/basic_alchemy_charm": "\u57fa\u7840\u70bc\u91d1\u62a4\u7b26",
          "/actions/crafting/basic_enhancing_charm": "\u57fa\u7840\u5f3a\u5316\u62a4\u7b26",
          "/actions/crafting/cedar_shield": "\u96ea\u677e\u76fe",
          "/actions/crafting/cedar_nature_staff": "\u96ea\u677e\u81ea\u7136\u6cd5\u6756",
          "/actions/crafting/cedar_bow": "\u96ea\u677e\u5f13",
          "/actions/crafting/crushed_amber": "\u7425\u73c0\u788e\u7247",
          "/actions/crafting/cedar_fire_staff": "\u96ea\u677e\u706b\u6cd5\u6756",
          "/actions/crafting/ring_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u6212\u6307",
          "/actions/crafting/earrings_of_essence_find": "\u7cbe\u534e\u53d1\u73b0\u8033\u73af",
          "/actions/crafting/necklace_of_efficiency": "\u6548\u7387\u9879\u94fe",
          "/actions/crafting/purpleheart_lumber": "\u7d2b\u5fc3\u6728\u677f",
          "/actions/crafting/purpleheart_crossbow": "\u7d2b\u5fc3\u5f29",
          "/actions/crafting/purpleheart_water_staff": "\u7d2b\u5fc3\u6c34\u6cd5\u6756",
          "/actions/crafting/purpleheart_shield": "\u7d2b\u5fc3\u76fe",
          "/actions/crafting/purpleheart_nature_staff": "\u7d2b\u5fc3\u81ea\u7136\u6cd5\u6756",
          "/actions/crafting/purpleheart_bow": "\u7d2b\u5fc3\u5f13",
          "/actions/crafting/advanced_milking_charm": "\u9ad8\u7ea7\u6324\u5976\u62a4\u7b26",
          "/actions/crafting/advanced_foraging_charm": "\u9ad8\u7ea7\u91c7\u6458\u62a4\u7b26",
          "/actions/crafting/advanced_woodcutting_charm": "\u9ad8\u7ea7\u4f10\u6728\u62a4\u7b26",
          "/actions/crafting/advanced_cheesesmithing_charm": "\u9ad8\u7ea7\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/actions/crafting/advanced_crafting_charm": "\u9ad8\u7ea7\u5236\u4f5c\u62a4\u7b26",
          "/actions/crafting/advanced_tailoring_charm": "\u9ad8\u7ea7\u7f1d\u7eab\u62a4\u7b26",
          "/actions/crafting/advanced_cooking_charm": "\u9ad8\u7ea7\u70f9\u996a\u62a4\u7b26",
          "/actions/crafting/advanced_brewing_charm": "\u9ad8\u7ea7\u917f\u9020\u62a4\u7b26",
          "/actions/crafting/advanced_alchemy_charm": "\u9ad8\u7ea7\u70bc\u91d1\u62a4\u7b26",
          "/actions/crafting/advanced_enhancing_charm": "\u9ad8\u7ea7\u5f3a\u5316\u62a4\u7b26",
          "/actions/crafting/advanced_stamina_charm": "\u9ad8\u7ea7\u8010\u529b\u62a4\u7b26",
          "/actions/crafting/advanced_intelligence_charm": "\u9ad8\u7ea7\u667a\u529b\u62a4\u7b26",
          "/actions/crafting/advanced_attack_charm": "\u9ad8\u7ea7\u653b\u51fb\u62a4\u7b26",
          "/actions/crafting/advanced_defense_charm": "\u9ad8\u7ea7\u9632\u5fa1\u62a4\u7b26",
          "/actions/crafting/advanced_melee_charm": "\u9ad8\u7ea7\u8fd1\u6218\u62a4\u7b26",
          "/actions/crafting/advanced_ranged_charm": "\u9ad8\u7ea7\u8fdc\u7a0b\u62a4\u7b26",
          "/actions/crafting/advanced_magic_charm": "\u9ad8\u7ea7\u9b54\u6cd5\u62a4\u7b26",
          "/actions/crafting/crushed_garnet": "\u77f3\u69b4\u77f3\u788e\u7247",
          "/actions/crafting/crushed_jade": "\u7fe1\u7fe0\u788e\u7247",
          "/actions/crafting/crushed_amethyst": "\u7d2b\u6c34\u6676\u788e\u7247",
          "/actions/crafting/catalyst_of_coinification": "\u70b9\u91d1\u50ac\u5316\u5242",
          "/actions/crafting/treant_shield": "\u6811\u4eba\u76fe",
          "/actions/crafting/purpleheart_fire_staff": "\u7d2b\u5fc3\u706b\u6cd5\u6756",
          "/actions/crafting/ring_of_regeneration": "\u6062\u590d\u6212\u6307",
          "/actions/crafting/earrings_of_regeneration": "\u6062\u590d\u8033\u73af",
          "/actions/crafting/fighter_necklace": "\u6218\u58eb\u9879\u94fe",
          "/actions/crafting/ginkgo_lumber": "\u94f6\u674f\u6728\u677f",
          "/actions/crafting/ginkgo_crossbow": "\u94f6\u674f\u5f29",
          "/actions/crafting/ginkgo_water_staff": "\u94f6\u674f\u6c34\u6cd5\u6756",
          "/actions/crafting/ring_of_armor": "\u62a4\u7532\u6212\u6307",
          "/actions/crafting/catalyst_of_decomposition": "\u5206\u89e3\u50ac\u5316\u5242",
          "/actions/crafting/ginkgo_shield": "\u94f6\u674f\u76fe",
          "/actions/crafting/earrings_of_armor": "\u62a4\u7532\u8033\u73af",
          "/actions/crafting/ginkgo_nature_staff": "\u94f6\u674f\u81ea\u7136\u6cd5\u6756",
          "/actions/crafting/ranger_necklace": "\u5c04\u624b\u9879\u94fe",
          "/actions/crafting/ginkgo_bow": "\u94f6\u674f\u5f13",
          "/actions/crafting/ring_of_resistance": "\u6297\u6027\u6212\u6307",
          "/actions/crafting/crushed_moonstone": "\u6708\u4eae\u77f3\u788e\u7247",
          "/actions/crafting/ginkgo_fire_staff": "\u94f6\u674f\u706b\u6cd5\u6756",
          "/actions/crafting/earrings_of_resistance": "\u6297\u6027\u8033\u73af",
          "/actions/crafting/wizard_necklace": "\u5deb\u5e08\u9879\u94fe",
          "/actions/crafting/ring_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u6212\u6307",
          "/actions/crafting/expert_milking_charm": "\u4e13\u5bb6\u6324\u5976\u62a4\u7b26",
          "/actions/crafting/expert_foraging_charm": "\u4e13\u5bb6\u91c7\u6458\u62a4\u7b26",
          "/actions/crafting/expert_woodcutting_charm": "\u4e13\u5bb6\u4f10\u6728\u62a4\u7b26",
          "/actions/crafting/expert_cheesesmithing_charm": "\u4e13\u5bb6\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/actions/crafting/expert_crafting_charm": "\u4e13\u5bb6\u5236\u4f5c\u62a4\u7b26",
          "/actions/crafting/expert_tailoring_charm": "\u4e13\u5bb6\u7f1d\u7eab\u62a4\u7b26",
          "/actions/crafting/expert_cooking_charm": "\u4e13\u5bb6\u70f9\u996a\u62a4\u7b26",
          "/actions/crafting/expert_brewing_charm": "\u4e13\u5bb6\u917f\u9020\u62a4\u7b26",
          "/actions/crafting/expert_alchemy_charm": "\u4e13\u5bb6\u70bc\u91d1\u62a4\u7b26",
          "/actions/crafting/expert_enhancing_charm": "\u4e13\u5bb6\u5f3a\u5316\u62a4\u7b26",
          "/actions/crafting/expert_stamina_charm": "\u4e13\u5bb6\u8010\u529b\u62a4\u7b26",
          "/actions/crafting/expert_intelligence_charm": "\u4e13\u5bb6\u667a\u529b\u62a4\u7b26",
          "/actions/crafting/expert_attack_charm": "\u4e13\u5bb6\u653b\u51fb\u62a4\u7b26",
          "/actions/crafting/expert_defense_charm": "\u4e13\u5bb6\u9632\u5fa1\u62a4\u7b26",
          "/actions/crafting/expert_melee_charm": "\u4e13\u5bb6\u8fd1\u6218\u62a4\u7b26",
          "/actions/crafting/expert_ranged_charm": "\u4e13\u5bb6\u8fdc\u7a0b\u62a4\u7b26",
          "/actions/crafting/expert_magic_charm": "\u4e13\u5bb6\u9b54\u6cd5\u62a4\u7b26",
          "/actions/crafting/catalyst_of_transmutation": "\u8f6c\u5316\u50ac\u5316\u5242",
          "/actions/crafting/earrings_of_rare_find": "\u7a00\u6709\u53d1\u73b0\u8033\u73af",
          "/actions/crafting/necklace_of_wisdom": "\u7ecf\u9a8c\u9879\u94fe",
          "/actions/crafting/redwood_lumber": "\u7ea2\u6749\u6728\u677f",
          "/actions/crafting/redwood_crossbow": "\u7ea2\u6749\u5f29",
          "/actions/crafting/redwood_water_staff": "\u7ea2\u6749\u6c34\u6cd5\u6756",
          "/actions/crafting/redwood_shield": "\u7ea2\u6749\u76fe",
          "/actions/crafting/redwood_nature_staff": "\u7ea2\u6749\u81ea\u7136\u6cd5\u6756",
          "/actions/crafting/redwood_bow": "\u7ea2\u6749\u5f13",
          "/actions/crafting/crushed_sunstone": "\u592a\u9633\u77f3\u788e\u7247",
          "/actions/crafting/chimerical_entry_key": "\u5947\u5e7b\u94a5\u5319",
          "/actions/crafting/chimerical_chest_key": "\u5947\u5e7b\u5b9d\u7bb1\u94a5\u5319",
          "/actions/crafting/eye_watch": "\u638c\u4e0a\u76d1\u5de5",
          "/actions/crafting/watchful_relic": "\u8b66\u6212\u9057\u7269",
          "/actions/crafting/redwood_fire_staff": "\u7ea2\u6749\u706b\u6cd5\u6756",
          "/actions/crafting/ring_of_critical_strike": "\u66b4\u51fb\u6212\u6307",
          "/actions/crafting/mirror_of_protection": "\u4fdd\u62a4\u4e4b\u955c",
          "/actions/crafting/earrings_of_critical_strike": "\u66b4\u51fb\u8033\u73af",
          "/actions/crafting/necklace_of_speed": "\u901f\u5ea6\u9879\u94fe",
          "/actions/crafting/arcane_lumber": "\u795e\u79d8\u6728\u677f",
          "/actions/crafting/arcane_crossbow": "\u795e\u79d8\u5f29",
          "/actions/crafting/arcane_water_staff": "\u795e\u79d8\u6c34\u6cd5\u6756",
          "/actions/crafting/master_milking_charm": "\u5927\u5e08\u6324\u5976\u62a4\u7b26",
          "/actions/crafting/master_foraging_charm": "\u5927\u5e08\u91c7\u6458\u62a4\u7b26",
          "/actions/crafting/master_woodcutting_charm": "\u5927\u5e08\u4f10\u6728\u62a4\u7b26",
          "/actions/crafting/master_cheesesmithing_charm": "\u5927\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/actions/crafting/master_crafting_charm": "\u5927\u5e08\u5236\u4f5c\u62a4\u7b26",
          "/actions/crafting/master_tailoring_charm": "\u5927\u5e08\u7f1d\u7eab\u62a4\u7b26",
          "/actions/crafting/master_cooking_charm": "\u5927\u5e08\u70f9\u996a\u62a4\u7b26",
          "/actions/crafting/master_brewing_charm": "\u5927\u5e08\u917f\u9020\u62a4\u7b26",
          "/actions/crafting/master_alchemy_charm": "\u5927\u5e08\u70bc\u91d1\u62a4\u7b26",
          "/actions/crafting/master_enhancing_charm": "\u5927\u5e08\u5f3a\u5316\u62a4\u7b26",
          "/actions/crafting/master_stamina_charm": "\u5927\u5e08\u8010\u529b\u62a4\u7b26",
          "/actions/crafting/master_intelligence_charm": "\u5927\u5e08\u667a\u529b\u62a4\u7b26",
          "/actions/crafting/master_attack_charm": "\u5927\u5e08\u653b\u51fb\u62a4\u7b26",
          "/actions/crafting/master_defense_charm": "\u5927\u5e08\u9632\u5fa1\u62a4\u7b26",
          "/actions/crafting/master_melee_charm": "\u5927\u5e08\u8fd1\u6218\u62a4\u7b26",
          "/actions/crafting/master_ranged_charm": "\u5927\u5e08\u8fdc\u7a0b\u62a4\u7b26",
          "/actions/crafting/master_magic_charm": "\u5927\u5e08\u9b54\u6cd5\u62a4\u7b26",
          "/actions/crafting/sinister_entry_key": "\u9634\u68ee\u94a5\u5319",
          "/actions/crafting/sinister_chest_key": "\u9634\u68ee\u5b9d\u7bb1\u94a5\u5319",
          "/actions/crafting/arcane_shield": "\u795e\u79d8\u76fe",
          "/actions/crafting/arcane_nature_staff": "\u795e\u79d8\u81ea\u7136\u6cd5\u6756",
          "/actions/crafting/manticore_shield": "\u874e\u72ee\u76fe",
          "/actions/crafting/arcane_bow": "\u795e\u79d8\u5f13",
          "/actions/crafting/enchanted_entry_key": "\u79d8\u6cd5\u94a5\u5319",
          "/actions/crafting/enchanted_chest_key": "\u79d8\u6cd5\u5b9d\u7bb1\u94a5\u5319",
          "/actions/crafting/pirate_entry_key": "\u6d77\u76d7\u94a5\u5319",
          "/actions/crafting/pirate_chest_key": "\u6d77\u76d7\u5b9d\u7bb1\u94a5\u5319",
          "/actions/crafting/arcane_fire_staff": "\u795e\u79d8\u706b\u6cd5\u6756",
          "/actions/crafting/vampiric_bow": "\u5438\u8840\u5f13",
          "/actions/crafting/soul_hunter_crossbow": "\u7075\u9b42\u730e\u624b\u5f29",
          "/actions/crafting/frost_staff": "\u51b0\u971c\u6cd5\u6756",
          "/actions/crafting/infernal_battlestaff": "\u70bc\u72f1\u6cd5\u6756",
          "/actions/crafting/jackalope_staff": "\u9e7f\u89d2\u5154\u4e4b\u6756",
          "/actions/crafting/philosophers_ring": "\u8d24\u8005\u6212\u6307",
          "/actions/crafting/crushed_philosophers_stone": "\u8d24\u8005\u4e4b\u77f3\u788e\u7247",
          "/actions/crafting/philosophers_earrings": "\u8d24\u8005\u8033\u73af",
          "/actions/crafting/philosophers_necklace": "\u8d24\u8005\u9879\u94fe",
          "/actions/crafting/bishops_codex": "\u4e3b\u6559\u6cd5\u5178",
          "/actions/crafting/cursed_bow": "\u5492\u6028\u4e4b\u5f13",
          "/actions/crafting/sundering_crossbow": "\u88c2\u7a7a\u4e4b\u5f29",
          "/actions/crafting/rippling_trident": "\u6d9f\u6f2a\u4e09\u53c9\u621f",
          "/actions/crafting/blooming_trident": "\u7efd\u653e\u4e09\u53c9\u621f",
          "/actions/crafting/blazing_trident": "\u70bd\u7130\u4e09\u53c9\u621f",
          "/actions/crafting/grandmaster_milking_charm": "\u5b97\u5e08\u6324\u5976\u62a4\u7b26",
          "/actions/crafting/grandmaster_foraging_charm": "\u5b97\u5e08\u91c7\u6458\u62a4\u7b26",
          "/actions/crafting/grandmaster_woodcutting_charm": "\u5b97\u5e08\u4f10\u6728\u62a4\u7b26",
          "/actions/crafting/grandmaster_cheesesmithing_charm": "\u5b97\u5e08\u5976\u916a\u953b\u9020\u62a4\u7b26",
          "/actions/crafting/grandmaster_crafting_charm": "\u5b97\u5e08\u5236\u4f5c\u62a4\u7b26",
          "/actions/crafting/grandmaster_tailoring_charm": "\u5b97\u5e08\u7f1d\u7eab\u62a4\u7b26",
          "/actions/crafting/grandmaster_cooking_charm": "\u5b97\u5e08\u70f9\u996a\u62a4\u7b26",
          "/actions/crafting/grandmaster_brewing_charm": "\u5b97\u5e08\u917f\u9020\u62a4\u7b26",
          "/actions/crafting/grandmaster_alchemy_charm": "\u5b97\u5e08\u70bc\u91d1\u62a4\u7b26",
          "/actions/crafting/grandmaster_enhancing_charm": "\u5b97\u5e08\u5f3a\u5316\u62a4\u7b26",
          "/actions/crafting/grandmaster_stamina_charm": "\u5b97\u5e08\u8010\u529b\u62a4\u7b26",
          "/actions/crafting/grandmaster_intelligence_charm": "\u5b97\u5e08\u667a\u529b\u62a4\u7b26",
          "/actions/crafting/grandmaster_attack_charm": "\u5b97\u5e08\u653b\u51fb\u62a4\u7b26",
          "/actions/crafting/grandmaster_defense_charm": "\u5b97\u5e08\u9632\u5fa1\u62a4\u7b26",
          "/actions/crafting/grandmaster_melee_charm": "\u5b97\u5e08\u8fd1\u6218\u62a4\u7b26",
          "/actions/crafting/grandmaster_ranged_charm": "\u5b97\u5e08\u8fdc\u7a0b\u62a4\u7b26",
          "/actions/crafting/grandmaster_magic_charm": "\u5b97\u5e08\u9b54\u6cd5\u62a4\u7b26",
          "/actions/crafting/bishops_codex_refined": "\u4e3b\u6559\u6cd5\u5178\uff08\u7cbe\uff09",
          "/actions/crafting/cursed_bow_refined": "\u5492\u6028\u4e4b\u5f13\uff08\u7cbe\uff09",
          "/actions/crafting/sundering_crossbow_refined": "\u88c2\u7a7a\u4e4b\u5f29\uff08\u7cbe\uff09",
          "/actions/crafting/rippling_trident_refined": "\u6d9f\u6f2a\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
          "/actions/crafting/blooming_trident_refined": "\u7efd\u653e\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
          "/actions/crafting/blazing_trident_refined": "\u70bd\u7130\u4e09\u53c9\u621f\uff08\u7cbe\uff09",
          "/actions/tailoring/rough_leather": "\u7c97\u7cd9\u76ae\u9769",
          "/actions/tailoring/cotton_fabric": "\u68c9\u82b1\u5e03\u6599",
          "/actions/tailoring/rough_boots": "\u7c97\u7cd9\u9774",
          "/actions/tailoring/cotton_boots": "\u68c9\u9774",
          "/actions/tailoring/rough_bracers": "\u7c97\u7cd9\u62a4\u8155",
          "/actions/tailoring/cotton_gloves": "\u68c9\u624b\u5957",
          "/actions/tailoring/small_pouch": "\u5c0f\u888b\u5b50",
          "/actions/tailoring/rough_hood": "\u7c97\u7cd9\u515c\u5e3d",
          "/actions/tailoring/cotton_hat": "\u68c9\u5e3d",
          "/actions/tailoring/rough_chaps": "\u7c97\u7cd9\u76ae\u88e4",
          "/actions/tailoring/cotton_robe_bottoms": "\u68c9\u888d\u88d9",
          "/actions/tailoring/rough_tunic": "\u7c97\u7cd9\u76ae\u8863",
          "/actions/tailoring/cotton_robe_top": "\u68c9\u888d\u670d",
          "/actions/tailoring/reptile_leather": "\u722c\u884c\u52a8\u7269\u76ae\u9769",
          "/actions/tailoring/linen_fabric": "\u4e9a\u9ebb\u5e03\u6599",
          "/actions/tailoring/reptile_boots": "\u722c\u884c\u52a8\u7269\u9774",
          "/actions/tailoring/linen_boots": "\u4e9a\u9ebb\u9774",
          "/actions/tailoring/reptile_bracers": "\u722c\u884c\u52a8\u7269\u62a4\u8155",
          "/actions/tailoring/linen_gloves": "\u4e9a\u9ebb\u624b\u5957",
          "/actions/tailoring/reptile_hood": "\u722c\u884c\u52a8\u7269\u515c\u5e3d",
          "/actions/tailoring/linen_hat": "\u4e9a\u9ebb\u5e3d",
          "/actions/tailoring/reptile_chaps": "\u722c\u884c\u52a8\u7269\u76ae\u88e4",
          "/actions/tailoring/linen_robe_bottoms": "\u4e9a\u9ebb\u888d\u88d9",
          "/actions/tailoring/medium_pouch": "\u4e2d\u888b\u5b50",
          "/actions/tailoring/reptile_tunic": "\u722c\u884c\u52a8\u7269\u76ae\u8863",
          "/actions/tailoring/linen_robe_top": "\u4e9a\u9ebb\u888d\u670d",
          "/actions/tailoring/shoebill_shoes": "\u9cb8\u5934\u9e73\u978b",
          "/actions/tailoring/gobo_leather": "\u54e5\u5e03\u6797\u76ae\u9769",
          "/actions/tailoring/bamboo_fabric": "\u7af9\u5b50\u5e03\u6599",
          "/actions/tailoring/gobo_boots": "\u54e5\u5e03\u6797\u9774",
          "/actions/tailoring/bamboo_boots": "\u7af9\u9774",
          "/actions/tailoring/gobo_bracers": "\u54e5\u5e03\u6797\u62a4\u8155",
          "/actions/tailoring/bamboo_gloves": "\u7af9\u624b\u5957",
          "/actions/tailoring/gobo_hood": "\u54e5\u5e03\u6797\u515c\u5e3d",
          "/actions/tailoring/bamboo_hat": "\u7af9\u5e3d",
          "/actions/tailoring/gobo_chaps": "\u54e5\u5e03\u6797\u76ae\u88e4",
          "/actions/tailoring/bamboo_robe_bottoms": "\u7af9\u888d\u88d9",
          "/actions/tailoring/large_pouch": "\u5927\u888b\u5b50",
          "/actions/tailoring/gobo_tunic": "\u54e5\u5e03\u6797\u76ae\u8863",
          "/actions/tailoring/bamboo_robe_top": "\u7af9\u888d\u670d",
          "/actions/tailoring/marine_tunic": "\u6d77\u6d0b\u76ae\u8863",
          "/actions/tailoring/marine_chaps": "\u822a\u6d77\u76ae\u88e4",
          "/actions/tailoring/icy_robe_top": "\u51b0\u971c\u888d\u670d",
          "/actions/tailoring/icy_robe_bottoms": "\u51b0\u971c\u888d\u88d9",
          "/actions/tailoring/flaming_robe_top": "\u70c8\u7130\u888d\u670d",
          "/actions/tailoring/flaming_robe_bottoms": "\u70c8\u7130\u888d\u88d9",
          "/actions/tailoring/beast_leather": "\u91ce\u517d\u76ae\u9769",
          "/actions/tailoring/silk_fabric": "\u4e1d\u7ef8",
          "/actions/tailoring/beast_boots": "\u91ce\u517d\u9774",
          "/actions/tailoring/silk_boots": "\u4e1d\u9774",
          "/actions/tailoring/beast_bracers": "\u91ce\u517d\u62a4\u8155",
          "/actions/tailoring/silk_gloves": "\u4e1d\u624b\u5957",
          "/actions/tailoring/collectors_boots": "\u6536\u85cf\u5bb6\u9774",
          "/actions/tailoring/sighted_bracers": "\u7784\u51c6\u62a4\u8155",
          "/actions/tailoring/beast_hood": "\u91ce\u517d\u515c\u5e3d",
          "/actions/tailoring/silk_hat": "\u4e1d\u5e3d",
          "/actions/tailoring/beast_chaps": "\u91ce\u517d\u76ae\u88e4",
          "/actions/tailoring/silk_robe_bottoms": "\u4e1d\u7ef8\u888d\u88d9",
          "/actions/tailoring/centaur_boots": "\u534a\u4eba\u9a6c\u9774",
          "/actions/tailoring/sorcerer_boots": "\u5deb\u5e08\u9774",
          "/actions/tailoring/giant_pouch": "\u5de8\u5927\u888b\u5b50",
          "/actions/tailoring/beast_tunic": "\u91ce\u517d\u76ae\u8863",
          "/actions/tailoring/silk_robe_top": "\u4e1d\u7ef8\u888d\u670d",
          "/actions/tailoring/red_culinary_hat": "\u7ea2\u8272\u53a8\u5e08\u5e3d",
          "/actions/tailoring/luna_robe_top": "\u6708\u795e\u888d\u670d",
          "/actions/tailoring/luna_robe_bottoms": "\u6708\u795e\u888d\u88d9",
          "/actions/tailoring/umbral_leather": "\u6697\u5f71\u76ae\u9769",
          "/actions/tailoring/radiant_fabric": "\u5149\u8f89\u5e03\u6599",
          "/actions/tailoring/umbral_boots": "\u6697\u5f71\u9774",
          "/actions/tailoring/radiant_boots": "\u5149\u8f89\u9774",
          "/actions/tailoring/umbral_bracers": "\u6697\u5f71\u62a4\u8155",
          "/actions/tailoring/radiant_gloves": "\u5149\u8f89\u624b\u5957",
          "/actions/tailoring/enchanted_gloves": "\u9644\u9b54\u624b\u5957",
          "/actions/tailoring/fluffy_red_hat": "\u84ec\u677e\u7ea2\u5e3d\u5b50",
          "/actions/tailoring/chrono_gloves": "\u65f6\u7a7a\u624b\u5957",
          "/actions/tailoring/umbral_hood": "\u6697\u5f71\u515c\u5e3d",
          "/actions/tailoring/radiant_hat": "\u5149\u8f89\u5e3d",
          "/actions/tailoring/umbral_chaps": "\u6697\u5f71\u76ae\u88e4",
          "/actions/tailoring/radiant_robe_bottoms": "\u5149\u8f89\u888d\u88d9",
          "/actions/tailoring/umbral_tunic": "\u6697\u5f71\u76ae\u8863",
          "/actions/tailoring/radiant_robe_top": "\u5149\u8f89\u888d\u670d",
          "/actions/tailoring/revenant_chaps": "\u4ea1\u7075\u76ae\u88e4",
          "/actions/tailoring/griffin_chaps": "\u72ee\u9e6b\u76ae\u88e4",
          "/actions/tailoring/dairyhands_top": "\u6324\u5976\u5de5\u4e0a\u8863",
          "/actions/tailoring/dairyhands_bottoms": "\u6324\u5976\u5de5\u4e0b\u88c5",
          "/actions/tailoring/foragers_top": "\u91c7\u6458\u8005\u4e0a\u8863",
          "/actions/tailoring/foragers_bottoms": "\u91c7\u6458\u8005\u4e0b\u88c5",
          "/actions/tailoring/lumberjacks_top": "\u4f10\u6728\u5de5\u4e0a\u8863",
          "/actions/tailoring/lumberjacks_bottoms": "\u4f10\u6728\u5de5\u4e0b\u88c5",
          "/actions/tailoring/cheesemakers_top": "\u5976\u916a\u5e08\u4e0a\u8863",
          "/actions/tailoring/cheesemakers_bottoms": "\u5976\u916a\u5e08\u4e0b\u88c5",
          "/actions/tailoring/crafters_top": "\u5de5\u5320\u4e0a\u8863",
          "/actions/tailoring/crafters_bottoms": "\u5de5\u5320\u4e0b\u88c5",
          "/actions/tailoring/tailors_top": "\u88c1\u7f1d\u4e0a\u8863",
          "/actions/tailoring/tailors_bottoms": "\u88c1\u7f1d\u4e0b\u88c5",
          "/actions/tailoring/chefs_top": "\u53a8\u5e08\u4e0a\u8863",
          "/actions/tailoring/chefs_bottoms": "\u53a8\u5e08\u4e0b\u88c5",
          "/actions/tailoring/brewers_top": "\u996e\u54c1\u5e08\u4e0a\u8863",
          "/actions/tailoring/brewers_bottoms": "\u996e\u54c1\u5e08\u4e0b\u88c5",
          "/actions/tailoring/alchemists_top": "\u70bc\u91d1\u5e08\u4e0a\u8863",
          "/actions/tailoring/alchemists_bottoms": "\u70bc\u91d1\u5e08\u4e0b\u88c5",
          "/actions/tailoring/enhancers_top": "\u5f3a\u5316\u5e08\u4e0a\u8863",
          "/actions/tailoring/enhancers_bottoms": "\u5f3a\u5316\u5e08\u4e0b\u88c5",
          "/actions/tailoring/revenant_tunic": "\u4ea1\u7075\u76ae\u8863",
          "/actions/tailoring/griffin_tunic": "\u72ee\u9e6b\u76ae\u8863",
          "/actions/tailoring/gluttonous_pouch": "\u8d2a\u98df\u4e4b\u888b",
          "/actions/tailoring/guzzling_pouch": "\u66b4\u996e\u4e4b\u56ca",
          "/actions/tailoring/marksman_bracers": "\u795e\u5c04\u62a4\u8155",
          "/actions/tailoring/acrobatic_hood": "\u6742\u6280\u5e08\u515c\u5e3d",
          "/actions/tailoring/magicians_hat": "\u9b54\u672f\u5e08\u5e3d",
          "/actions/tailoring/kraken_chaps": "\u514b\u62c9\u80af\u76ae\u88e4",
          "/actions/tailoring/royal_water_robe_bottoms": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9",
          "/actions/tailoring/royal_nature_robe_bottoms": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9",
          "/actions/tailoring/royal_fire_robe_bottoms": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9",
          "/actions/tailoring/kraken_tunic": "\u514b\u62c9\u80af\u76ae\u8863",
          "/actions/tailoring/royal_water_robe_top": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d",
          "/actions/tailoring/royal_nature_robe_top": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d",
          "/actions/tailoring/royal_fire_robe_top": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d",
          "/actions/tailoring/chimerical_quiver_refined": "\u5947\u5e7b\u7bad\u888b\uff08\u7cbe\uff09",
          "/actions/tailoring/sinister_cape_refined": "\u9634\u68ee\u6597\u7bf7\uff08\u7cbe\uff09",
          "/actions/tailoring/enchanted_cloak_refined": "\u79d8\u6cd5\u62ab\u98ce\uff08\u7cbe\uff09",
          "/actions/tailoring/marksman_bracers_refined": "\u795e\u5c04\u62a4\u8155\uff08\u7cbe\uff09",
          "/actions/tailoring/acrobatic_hood_refined": "\u6742\u6280\u5e08\u515c\u5e3d\uff08\u7cbe\uff09",
          "/actions/tailoring/magicians_hat_refined": "\u9b54\u672f\u5e08\u5e3d\uff08\u7cbe\uff09",
          "/actions/tailoring/kraken_chaps_refined": "\u514b\u62c9\u80af\u76ae\u88e4\uff08\u7cbe\uff09",
          "/actions/tailoring/royal_water_robe_bottoms_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
          "/actions/tailoring/royal_nature_robe_bottoms_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
          "/actions/tailoring/royal_fire_robe_bottoms_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u88d9\uff08\u7cbe\uff09",
          "/actions/tailoring/kraken_tunic_refined": "\u514b\u62c9\u80af\u76ae\u8863\uff08\u7cbe\uff09",
          "/actions/tailoring/royal_water_robe_top_refined": "\u7687\u5bb6\u6c34\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
          "/actions/tailoring/royal_nature_robe_top_refined": "\u7687\u5bb6\u81ea\u7136\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
          "/actions/tailoring/royal_fire_robe_top_refined": "\u7687\u5bb6\u706b\u7cfb\u888d\u670d\uff08\u7cbe\uff09",
          "/actions/cooking/donut": "\u751c\u751c\u5708",
          "/actions/cooking/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
          "/actions/cooking/gummy": "\u8f6f\u7cd6",
          "/actions/cooking/yogurt": "\u9178\u5976",
          "/actions/cooking/blueberry_donut": "\u84dd\u8393\u751c\u751c\u5708",
          "/actions/cooking/blueberry_cake": "\u84dd\u8393\u86cb\u7cd5",
          "/actions/cooking/apple_gummy": "\u82f9\u679c\u8f6f\u7cd6",
          "/actions/cooking/apple_yogurt": "\u82f9\u679c\u9178\u5976",
          "/actions/cooking/blackberry_donut": "\u9ed1\u8393\u751c\u751c\u5708",
          "/actions/cooking/blackberry_cake": "\u9ed1\u8393\u86cb\u7cd5",
          "/actions/cooking/orange_gummy": "\u6a59\u5b50\u8f6f\u7cd6",
          "/actions/cooking/orange_yogurt": "\u6a59\u5b50\u9178\u5976",
          "/actions/cooking/strawberry_donut": "\u8349\u8393\u751c\u751c\u5708",
          "/actions/cooking/strawberry_cake": "\u8349\u8393\u86cb\u7cd5",
          "/actions/cooking/plum_gummy": "\u674e\u5b50\u8f6f\u7cd6",
          "/actions/cooking/plum_yogurt": "\u674e\u5b50\u9178\u5976",
          "/actions/cooking/mooberry_donut": "\u54de\u8393\u751c\u751c\u5708",
          "/actions/cooking/mooberry_cake": "\u54de\u8393\u86cb\u7cd5",
          "/actions/cooking/peach_gummy": "\u6843\u5b50\u8f6f\u7cd6",
          "/actions/cooking/peach_yogurt": "\u6843\u5b50\u9178\u5976",
          "/actions/cooking/marsberry_donut": "\u706b\u661f\u8393\u751c\u751c\u5708",
          "/actions/cooking/marsberry_cake": "\u706b\u661f\u8393\u86cb\u7cd5",
          "/actions/cooking/dragon_fruit_gummy": "\u706b\u9f99\u679c\u8f6f\u7cd6",
          "/actions/cooking/dragon_fruit_yogurt": "\u706b\u9f99\u679c\u9178\u5976",
          "/actions/cooking/spaceberry_donut": "\u592a\u7a7a\u8393\u751c\u751c\u5708",
          "/actions/cooking/spaceberry_cake": "\u592a\u7a7a\u8393\u86cb\u7cd5",
          "/actions/cooking/star_fruit_gummy": "\u6768\u6843\u8f6f\u7cd6",
          "/actions/cooking/star_fruit_yogurt": "\u6768\u6843\u9178\u5976",
          "/actions/brewing/milking_tea": "\u6324\u5976\u8336",
          "/actions/brewing/stamina_coffee": "\u8010\u529b\u5496\u5561",
          "/actions/brewing/foraging_tea": "\u91c7\u6458\u8336",
          "/actions/brewing/intelligence_coffee": "\u667a\u529b\u5496\u5561",
          "/actions/brewing/gathering_tea": "\u91c7\u96c6\u8336",
          "/actions/brewing/woodcutting_tea": "\u4f10\u6728\u8336",
          "/actions/brewing/cooking_tea": "\u70f9\u996a\u8336",
          "/actions/brewing/defense_coffee": "\u9632\u5fa1\u5496\u5561",
          "/actions/brewing/brewing_tea": "\u51b2\u6ce1\u8336",
          "/actions/brewing/attack_coffee": "\u653b\u51fb\u5496\u5561",
          "/actions/brewing/gourmet_tea": "\u7f8e\u98df\u8336",
          "/actions/brewing/alchemy_tea": "\u70bc\u91d1\u8336",
          "/actions/brewing/enhancing_tea": "\u5f3a\u5316\u8336",
          "/actions/brewing/cheesesmithing_tea": "\u5976\u916a\u953b\u9020\u8336",
          "/actions/brewing/melee_coffee": "\u8fd1\u6218\u5496\u5561",
          "/actions/brewing/crafting_tea": "\u5236\u4f5c\u8336",
          "/actions/brewing/ranged_coffee": "\u8fdc\u7a0b\u5496\u5561",
          "/actions/brewing/wisdom_tea": "\u7ecf\u9a8c\u8336",
          "/actions/brewing/wisdom_coffee": "\u7ecf\u9a8c\u5496\u5561",
          "/actions/brewing/tailoring_tea": "\u7f1d\u7eab\u8336",
          "/actions/brewing/magic_coffee": "\u9b54\u6cd5\u5496\u5561",
          "/actions/brewing/super_milking_tea": "\u8d85\u7ea7\u6324\u5976\u8336",
          "/actions/brewing/super_stamina_coffee": "\u8d85\u7ea7\u8010\u529b\u5496\u5561",
          "/actions/brewing/super_foraging_tea": "\u8d85\u7ea7\u91c7\u6458\u8336",
          "/actions/brewing/super_intelligence_coffee": "\u8d85\u7ea7\u667a\u529b\u5496\u5561",
          "/actions/brewing/processing_tea": "\u52a0\u5de5\u8336",
          "/actions/brewing/lucky_coffee": "\u5e78\u8fd0\u5496\u5561",
          "/actions/brewing/super_woodcutting_tea": "\u8d85\u7ea7\u4f10\u6728\u8336",
          "/actions/brewing/super_cooking_tea": "\u8d85\u7ea7\u70f9\u996a\u8336",
          "/actions/brewing/super_defense_coffee": "\u8d85\u7ea7\u9632\u5fa1\u5496\u5561",
          "/actions/brewing/super_brewing_tea": "\u8d85\u7ea7\u51b2\u6ce1\u8336",
          "/actions/brewing/ultra_milking_tea": "\u7a76\u6781\u6324\u5976\u8336",
          "/actions/brewing/super_attack_coffee": "\u8d85\u7ea7\u653b\u51fb\u5496\u5561",
          "/actions/brewing/ultra_stamina_coffee": "\u7a76\u6781\u8010\u529b\u5496\u5561",
          "/actions/brewing/efficiency_tea": "\u6548\u7387\u8336",
          "/actions/brewing/swiftness_coffee": "\u8fc5\u6377\u5496\u5561",
          "/actions/brewing/super_alchemy_tea": "\u8d85\u7ea7\u70bc\u91d1\u8336",
          "/actions/brewing/super_enhancing_tea": "\u8d85\u7ea7\u5f3a\u5316\u8336",
          "/actions/brewing/ultra_foraging_tea": "\u7a76\u6781\u91c7\u6458\u8336",
          "/actions/brewing/ultra_intelligence_coffee": "\u7a76\u6781\u667a\u529b\u5496\u5561",
          "/actions/brewing/channeling_coffee": "\u541f\u5531\u5496\u5561",
          "/actions/brewing/super_cheesesmithing_tea": "\u8d85\u7ea7\u5976\u916a\u953b\u9020\u8336",
          "/actions/brewing/ultra_woodcutting_tea": "\u7a76\u6781\u4f10\u6728\u8336",
          "/actions/brewing/super_melee_coffee": "\u8d85\u7ea7\u8fd1\u6218\u5496\u5561",
          "/actions/brewing/artisan_tea": "\u5de5\u5320\u8336",
          "/actions/brewing/super_crafting_tea": "\u8d85\u7ea7\u5236\u4f5c\u8336",
          "/actions/brewing/ultra_cooking_tea": "\u7a76\u6781\u70f9\u996a\u8336",
          "/actions/brewing/super_ranged_coffee": "\u8d85\u7ea7\u8fdc\u7a0b\u5496\u5561",
          "/actions/brewing/ultra_defense_coffee": "\u7a76\u6781\u9632\u5fa1\u5496\u5561",
          "/actions/brewing/catalytic_tea": "\u50ac\u5316\u8336",
          "/actions/brewing/critical_coffee": "\u66b4\u51fb\u5496\u5561",
          "/actions/brewing/super_tailoring_tea": "\u8d85\u7ea7\u7f1d\u7eab\u8336",
          "/actions/brewing/ultra_brewing_tea": "\u7a76\u6781\u51b2\u6ce1\u8336",
          "/actions/brewing/super_magic_coffee": "\u8d85\u7ea7\u9b54\u6cd5\u5496\u5561",
          "/actions/brewing/ultra_attack_coffee": "\u7a76\u6781\u653b\u51fb\u5496\u5561",
          "/actions/brewing/blessed_tea": "\u798f\u6c14\u8336",
          "/actions/brewing/ultra_alchemy_tea": "\u7a76\u6781\u70bc\u91d1\u8336",
          "/actions/brewing/ultra_enhancing_tea": "\u7a76\u6781\u5f3a\u5316\u8336",
          "/actions/brewing/ultra_cheesesmithing_tea": "\u7a76\u6781\u5976\u916a\u953b\u9020\u8336",
          "/actions/brewing/ultra_melee_coffee": "\u7a76\u6781\u8fd1\u6218\u5496\u5561",
          "/actions/brewing/ultra_crafting_tea": "\u7a76\u6781\u5236\u4f5c\u8336",
          "/actions/brewing/ultra_ranged_coffee": "\u7a76\u6781\u8fdc\u7a0b\u5496\u5561",
          "/actions/brewing/ultra_tailoring_tea": "\u7a76\u6781\u7f1d\u7eab\u8336",
          "/actions/brewing/ultra_magic_coffee": "\u7a76\u6781\u9b54\u6cd5\u5496\u5561",
          "/actions/alchemy/coinify": "\u70b9\u91d1",
          "/actions/alchemy/transmute": "\u8f6c\u5316",
          "/actions/alchemy/decompose": "\u5206\u89e3",
          "/actions/enhancing/enhance": "\u5f3a\u5316",
          "/actions/combat/fly": "\u82cd\u8747",
          "/actions/combat/rat": "\u6770\u745e",
          "/actions/combat/skunk": "\u81ed\u9f2c",
          "/actions/combat/porcupine": "\u8c6a\u732a",
          "/actions/combat/slimy": "\u53f2\u83b1\u59c6",
          "/actions/combat/smelly_planet": "\u81ed\u81ed\u661f\u7403",
          "/actions/combat/frog": "\u9752\u86d9",
          "/actions/combat/snake": "\u86c7",
          "/actions/combat/swampy": "\u6cbc\u6cfd\u866b",
          "/actions/combat/alligator": "\u590f\u6d1b\u514b",
          "/actions/combat/swamp_planet": "\u6cbc\u6cfd\u661f\u7403",
          "/actions/combat/sea_snail": "\u8717\u725b",
          "/actions/combat/crab": "\u8783\u87f9",
          "/actions/combat/aquahorse": "\u6c34\u9a6c",
          "/actions/combat/nom_nom": "\u54ac\u54ac\u9c7c",
          "/actions/combat/turtle": "\u5fcd\u8005\u9f9f",
          "/actions/combat/aqua_planet": "\u6d77\u6d0b\u661f\u7403",
          "/actions/combat/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
          "/actions/combat/myconid": "\u8611\u83c7\u4eba",
          "/actions/combat/treant": "\u6811\u4eba",
          "/actions/combat/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
          "/actions/combat/jungle_planet": "\u4e1b\u6797\u661f\u7403",
          "/actions/combat/gobo_stabby": "\u523a\u523a",
          "/actions/combat/gobo_slashy": "\u780d\u780d",
          "/actions/combat/gobo_smashy": "\u9524\u9524",
          "/actions/combat/gobo_shooty": "\u54bb\u54bb",
          "/actions/combat/gobo_boomy": "\u8f70\u8f70",
          "/actions/combat/gobo_planet": "\u54e5\u5e03\u6797\u661f\u7403",
          "/actions/combat/eye": "\u72ec\u773c",
          "/actions/combat/eyes": "\u53e0\u773c",
          "/actions/combat/veyes": "\u590d\u773c",
          "/actions/combat/planet_of_the_eyes": "\u773c\u7403\u661f\u7403",
          "/actions/combat/novice_sorcerer": "\u65b0\u624b\u5deb\u5e08",
          "/actions/combat/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
          "/actions/combat/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
          "/actions/combat/elementalist": "\u5143\u7d20\u6cd5\u5e08",
          "/actions/combat/sorcerers_tower": "\u5deb\u5e08\u4e4b\u5854",
          "/actions/combat/gummy_bear": "\u8f6f\u7cd6\u718a",
          "/actions/combat/panda": "\u718a\u732b",
          "/actions/combat/black_bear": "\u9ed1\u718a",
          "/actions/combat/grizzly_bear": "\u68d5\u718a",
          "/actions/combat/polar_bear": "\u5317\u6781\u718a",
          "/actions/combat/bear_with_it": "\u718a\u718a\u661f\u7403",
          "/actions/combat/magnetic_golem": "\u78c1\u529b\u9b54\u50cf",
          "/actions/combat/stalactite_golem": "\u949f\u4e73\u77f3\u9b54\u50cf",
          "/actions/combat/granite_golem": "\u82b1\u5c97\u5ca9\u9b54\u50cf",
          "/actions/combat/golem_cave": "\u9b54\u50cf\u6d1e\u7a74",
          "/actions/combat/zombie": "\u50f5\u5c38",
          "/actions/combat/vampire": "\u5438\u8840\u9b3c",
          "/actions/combat/werewolf": "\u72fc\u4eba",
          "/actions/combat/twilight_zone": "\u66ae\u5149\u4e4b\u5730",
          "/actions/combat/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
          "/actions/combat/soul_hunter": "\u7075\u9b42\u730e\u624b",
          "/actions/combat/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
          "/actions/combat/infernal_abyss": "\u5730\u72f1\u6df1\u6e0a",
          "/actions/combat/chimerical_den": "\u5947\u5e7b\u6d1e\u7a74",
          "/actions/combat/sinister_circus": "\u9634\u68ee\u9a6c\u620f\u56e2",
          "/actions/combat/enchanted_fortress": "\u79d8\u6cd5\u8981\u585e",
          "/actions/combat/pirate_cove": "\u6d77\u76d7\u57fa\u5730"
        },
        actionTypeNames: {
          "/action_types/milking": "\u6324\u5976",
          "/action_types/foraging": "\u91c7\u6458",
          "/action_types/woodcutting": "\u4f10\u6728",
          "/action_types/cheesesmithing": "\u5976\u916a\u953b\u9020",
          "/action_types/crafting": "\u5236\u4f5c",
          "/action_types/tailoring": "\u7f1d\u7eab",
          "/action_types/cooking": "\u70f9\u996a",
          "/action_types/brewing": "\u51b2\u6ce1",
          "/action_types/alchemy": "\u70bc\u91d1",
          "/action_types/enhancing": "\u5f3a\u5316",
          "/action_types/combat": "\u6218\u6597"
        },
        actionCategoryNames: {
          "/action_categories/milking/cows": "\u5976\u725b",
          "/action_categories/foraging/farmland": "\u7fe0\u91ce\u519c\u573a",
          "/action_categories/foraging/shimmering_lake": "\u6ce2\u5149\u6e56\u6cca",
          "/action_categories/foraging/misty_forest": "\u8ff7\u96fe\u68ee\u6797",
          "/action_categories/foraging/burble_beach": "\u6df1\u7d2b\u6c99\u6ee9",
          "/action_categories/foraging/silly_cow_valley": "\u50bb\u725b\u5c71\u8c37",
          "/action_categories/foraging/olympus_mons": "\u5965\u6797\u5339\u65af\u5c71",
          "/action_categories/foraging/asteroid_belt": "\u5c0f\u884c\u661f\u5e26",
          "/action_categories/woodcutting/trees": "\u6811",
          "/action_categories/cheesesmithing/material": "\u6750\u6599",
          "/action_categories/cheesesmithing/tool": "\u5de5\u5177",
          "/action_categories/cheesesmithing/main_hand": "\u4e3b\u624b",
          "/action_categories/cheesesmithing/two_hand": "\u53cc\u624b",
          "/action_categories/cheesesmithing/off_hand": "\u526f\u624b",
          "/action_categories/cheesesmithing/feet": "\u811a\u90e8",
          "/action_categories/cheesesmithing/hands": "\u624b\u90e8",
          "/action_categories/cheesesmithing/head": "\u5934\u90e8",
          "/action_categories/cheesesmithing/legs": "\u817f\u90e8",
          "/action_categories/cheesesmithing/body": "\u8eab\u4f53",
          "/action_categories/crafting/lumber": "\u6728\u677f",
          "/action_categories/crafting/crossbow": "\u5f29",
          "/action_categories/crafting/bow": "\u5f13",
          "/action_categories/crafting/staff": "\u6cd5\u6756",
          "/action_categories/crafting/off_hand": "\u526f\u624b",
          "/action_categories/crafting/ring": "\u6212\u6307",
          "/action_categories/crafting/earrings": "\u8033\u73af",
          "/action_categories/crafting/neck": "\u9879\u94fe",
          "/action_categories/crafting/charm": "\u62a4\u7b26",
          "/action_categories/crafting/trinket": "\u9970\u54c1",
          "/action_categories/crafting/special": "\u7279\u6b8a",
          "/action_categories/crafting/dungeon_keys": "\u5730\u4e0b\u57ce\u94a5\u5319",
          "/action_categories/tailoring/material": "\u6750\u6599",
          "/action_categories/tailoring/feet": "\u811a\u90e8",
          "/action_categories/tailoring/hands": "\u624b\u90e8",
          "/action_categories/tailoring/head": "\u5934\u90e8",
          "/action_categories/tailoring/legs": "\u817f\u90e8",
          "/action_categories/tailoring/body": "\u8eab\u4f53",
          "/action_categories/tailoring/pouch": "\u888b\u5b50",
          "/action_categories/tailoring/back": "\u80cc\u90e8",
          "/action_categories/cooking/instant_heal": "\u5373\u65f6\u56de\u8840",
          "/action_categories/cooking/heal_over_time": "\u6301\u7eed\u56de\u8840",
          "/action_categories/cooking/instant_mana": "\u5373\u65f6\u56de\u84dd",
          "/action_categories/cooking/mana_over_time": "\u6301\u7eed\u56de\u84dd",
          "/action_categories/brewing/tea": "\u8336",
          "/action_categories/brewing/coffee": "\u5496\u5561",
          "/action_categories/alchemy/alchemy": "\u70bc\u91d1",
          "/action_categories/enhancing/enhance": "\u5f3a\u5316",
          "/action_categories/combat/smelly_planet": "\u81ed\u81ed\u661f\u7403",
          "/action_categories/combat/swamp_planet": "\u6cbc\u6cfd\u661f\u7403",
          "/action_categories/combat/aqua_planet": "\u6d77\u6d0b\u661f\u7403",
          "/action_categories/combat/jungle_planet": "\u4e1b\u6797\u661f\u7403",
          "/action_categories/combat/gobo_planet": "\u54e5\u5e03\u6797\u661f\u7403",
          "/action_categories/combat/planet_of_the_eyes": "\u773c\u7403\u661f\u7403",
          "/action_categories/combat/sorcerers_tower": "\u5deb\u5e08\u4e4b\u5854",
          "/action_categories/combat/bear_with_it": "\u718a\u718a\u661f\u7403",
          "/action_categories/combat/golem_cave": "\u9b54\u50cf\u6d1e\u7a74",
          "/action_categories/combat/twilight_zone": "\u66ae\u5149\u4e4b\u5730",
          "/action_categories/combat/infernal_abyss": "\u5730\u72f1\u6df1\u6e0a",
          "/action_categories/combat/dungeons": "\u5730\u4e0b\u57ce"
        },
        buffTypeNames: {
          "/buff_types/gathering": "\u91c7\u96c6\u6570\u91cf",
          "/buff_types/efficiency": "\u6548\u7387",
          "/buff_types/alchemy_success": "\u70bc\u91d1\u6210\u529f\u7387",
          "/buff_types/enhancing_success": "\u5f3a\u5316\u6210\u529f\u7387",
          "/buff_types/action_speed": "\u884c\u52a8\u901f\u5ea6",
          "/buff_types/task_action_speed": "\u4efb\u52a1\u884c\u52a8\u901f\u5ea6",
          "/buff_types/milking_level": "\u6324\u5976\u7b49\u7ea7",
          "/buff_types/foraging_level": "\u91c7\u6458\u7b49\u7ea7",
          "/buff_types/woodcutting_level": "\u4f10\u6728\u7b49\u7ea7",
          "/buff_types/cheesesmithing_level": "\u5976\u916a\u953b\u9020\u7b49\u7ea7",
          "/buff_types/crafting_level": "\u5236\u4f5c\u7b49\u7ea7",
          "/buff_types/tailoring_level": "\u7f1d\u7eab\u7b49\u7ea7",
          "/buff_types/cooking_level": "\u70f9\u996a\u7b49\u7ea7",
          "/buff_types/brewing_level": "\u51b2\u6ce1\u7b49\u7ea7",
          "/buff_types/alchemy_level": "\u70bc\u91d1\u7b49\u7ea7",
          "/buff_types/enhancing_level": "\u5f3a\u5316\u7b49\u7ea7",
          "/buff_types/gourmet": "\u7f8e\u98df",
          "/buff_types/wisdom": "\u7ecf\u9a8c",
          "/buff_types/processing": "\u52a0\u5de5",
          "/buff_types/artisan": "\u5de5\u5320",
          "/buff_types/blessed": "\u798f\u6c14",
          "/buff_types/action_level": "\u884c\u52a8\u6240\u9700\u7b49\u7ea7",
          "/buff_types/essence_find": "\u7cbe\u534e\u53d1\u73b0",
          "/buff_types/rare_find": "\u7a00\u6709\u53d1\u73b0",
          "/buff_types/stamina_level": "\u8010\u529b\u7b49\u7ea7",
          "/buff_types/intelligence_level": "\u667a\u529b\u7b49\u7ea7",
          "/buff_types/defense_level": "\u9632\u5fa1\u7b49\u7ea7",
          "/buff_types/attack_level": "\u653b\u51fb\u7b49\u7ea7",
          "/buff_types/melee_level": "\u8fd1\u6218\u7b49\u7ea7",
          "/buff_types/ranged_level": "\u8fdc\u7a0b\u7b49\u7ea7",
          "/buff_types/magic_level": "\u9b54\u6cd5\u7b49\u7ea7",
          "/buff_types/attack_speed": "\u653b\u51fb\u901f\u5ea6",
          "/buff_types/cast_speed": "\u65bd\u6cd5\u901f\u5ea6",
          "/buff_types/critical_rate": "\u66b4\u51fb\u7387",
          "/buff_types/critical_damage": "\u66b4\u51fb\u4f24\u5bb3",
          "/buff_types/accuracy": "\u7cbe\u51c6",
          "/buff_types/damage": "\u4f24\u5bb3",
          "/buff_types/physical_amplify": "\u7269\u7406\u589e\u5e45",
          "/buff_types/water_amplify": "\u6c34\u7cfb\u589e\u5e45",
          "/buff_types/nature_amplify": "\u81ea\u7136\u7cfb\u589e\u5e45",
          "/buff_types/fire_amplify": "\u706b\u7cfb\u589e\u5e45",
          "/buff_types/healing_amplify": "\u6cbb\u7597\u589e\u5e45",
          "/buff_types/evasion": "\u95ea\u907f",
          "/buff_types/armor": "\u62a4\u7532",
          "/buff_types/water_resistance": "\u6c34\u7cfb\u6297\u6027",
          "/buff_types/nature_resistance": "\u81ea\u7136\u7cfb\u6297\u6027",
          "/buff_types/fire_resistance": "\u706b\u7cfb\u6297\u6027",
          "/buff_types/damage_taken": "\u6240\u53d7\u4f24\u5bb3",
          "/buff_types/life_steal": "\u751f\u547d\u7a83\u53d6",
          "/buff_types/mana_leech": "\u6cd5\u529b\u5438\u53d6",
          "/buff_types/physical_thorns": "\u7269\u7406\u8346\u68d8",
          "/buff_types/elemental_thorns": "\u5143\u7d20\u8346\u68d8",
          "/buff_types/retaliation": "\u53cd\u4f24\u5f3a\u5ea6",
          "/buff_types/tenacity": "\u97e7\u6027",
          "/buff_types/hp_regen": "HP\u6062\u590d",
          "/buff_types/mp_regen": "MP\u6062\u590d",
          "/buff_types/threat": "\u5a01\u80c1",
          "/buff_types/combat_drop_rate": "\u6218\u6597\u6389\u843d\u7387",
          "/buff_types/combat_drop_quantity": "\u6218\u6597\u6389\u843d\u6570\u91cf"
        },
        buffTypeDescriptions: {
          "/buff_types/gathering": "\u589e\u52a0\u91c7\u96c6\u6570\u91cf",
          "/buff_types/efficiency": "\u7acb\u5373\u91cd\u590d\u884c\u52a8\u7684\u51e0\u7387",
          "/buff_types/alchemy_success": "\u70bc\u91d1\u6210\u529f\u7387\u7684\u4e58\u6cd5\u52a0\u6210",
          "/buff_types/enhancing_success": "\u5f3a\u5316\u6210\u529f\u7387\u7684\u4e58\u6cd5\u52a0\u6210",
          "/buff_types/action_speed": "\u51cf\u5c11\u884c\u52a8\u6240\u9700\u65f6\u95f4",
          "/buff_types/task_action_speed": "\u51cf\u5c11\u4efb\u52a1\u884c\u52a8\u6240\u9700\u65f6\u95f4",
          "/buff_types/milking_level": "\u589e\u76ca\u6324\u5976\u7b49\u7ea7",
          "/buff_types/foraging_level": "\u589e\u76ca\u91c7\u6458\u7b49\u7ea7",
          "/buff_types/woodcutting_level": "\u589e\u76ca\u4f10\u6728\u7b49\u7ea7",
          "/buff_types/cheesesmithing_level": "\u589e\u76ca\u5976\u916a\u953b\u9020\u7b49\u7ea7",
          "/buff_types/crafting_level": "\u589e\u76ca\u5236\u4f5c\u7b49\u7ea7",
          "/buff_types/tailoring_level": "\u589e\u76ca\u7f1d\u7eab\u7b49\u7ea7",
          "/buff_types/cooking_level": "\u589e\u76ca\u70f9\u996a\u7b49\u7ea7",
          "/buff_types/brewing_level": "\u589e\u76ca\u51b2\u6ce1\u7b49\u7ea7",
          "/buff_types/alchemy_level": "\u589e\u76ca\u70bc\u91d1\u7b49\u7ea7",
          "/buff_types/enhancing_level": "\u589e\u76ca\u5f3a\u5316\u7b49\u7ea7",
          "/buff_types/gourmet": "\u6709\u673a\u4f1a\u514d\u8d39\u83b7\u5f97\u4e00\u4e2a\u989d\u5916\u7269\u54c1",
          "/buff_types/wisdom": "\u589e\u52a0\u83b7\u5f97\u7ecf\u9a8c",
          "/buff_types/processing": "\u6709\u673a\u4f1a\u7acb\u5373\u5c06\u539f\u6750\u6599\u8f6c\u5316\u6210\u4ea7\u54c1 (\u5976\u916a\u3001\u5e03\u6599\u3001\u548c\u6728\u6750)",
          "/buff_types/artisan": "\u51cf\u5c11\u751f\u4ea7\u8fc7\u7a0b\u4e2d\u6240\u9700\u6750\u6599",
          "/buff_types/blessed": "\u6709\u673a\u4f1a\u5728\u5f3a\u5316\u6210\u529f\u65f6\u83b7\u5f97+2\u800c\u4e0d\u662f+1",
          "/buff_types/action_level": "\u589e\u52a0\u884c\u52a8\u6240\u9700\u7b49\u7ea7",
          "/buff_types/essence_find": "\u589e\u52a0\u7cbe\u534e\u7684\u6389\u843d\u7387",
          "/buff_types/rare_find": "\u589e\u52a0\u7a00\u6709\u7269\u54c1\u7684\u6389\u843d\u7387",
          "/buff_types/stamina_level": "\u589e\u76ca\u8010\u529b\u7b49\u7ea7",
          "/buff_types/intelligence_level": "\u589e\u76ca\u667a\u529b\u7b49\u7ea7",
          "/buff_types/defense_level": "\u589e\u76ca\u9632\u5fa1\u7b49\u7ea7",
          "/buff_types/attack_level": "\u589e\u76ca\u653b\u51fb\u7b49\u7ea7",
          "/buff_types/melee_level": "\u589e\u76ca\u8fd1\u6218\u7b49\u7ea7",
          "/buff_types/ranged_level": "\u589e\u76ca\u8fdc\u7a0b\u7b49\u7ea7",
          "/buff_types/magic_level": "\u589e\u76ca\u9b54\u6cd5\u7b49\u7ea7",
          "/buff_types/attack_speed": "\u589e\u52a0\u81ea\u52a8\u653b\u51fb\u901f\u5ea6",
          "/buff_types/cast_speed": "\u589e\u52a0\u65bd\u6cd5\u901f\u5ea6",
          "/buff_types/critical_rate": "\u589e\u52a0\u66b4\u51fb\u7387",
          "/buff_types/critical_damage": "\u589e\u52a0\u66b4\u51fb\u4f24\u5bb3",
          "/buff_types/accuracy": "\u589e\u52a0\u7cbe\u51c6\u5ea6",
          "/buff_types/damage": "\u589e\u52a0\u4f24\u5bb3",
          "/buff_types/physical_amplify": "\u589e\u52a0\u7269\u7406\u4f24\u5bb3",
          "/buff_types/water_amplify": "\u589e\u52a0\u6c34\u7cfb\u4f24\u5bb3",
          "/buff_types/nature_amplify": "\u589e\u52a0\u81ea\u7136\u7cfb\u4f24\u5bb3",
          "/buff_types/fire_amplify": "\u589e\u52a0\u706b\u7cfb\u4f24\u5bb3",
          "/buff_types/healing_amplify": "\u589e\u52a0\u6cbb\u7597\u91cf",
          "/buff_types/evasion": "\u589e\u52a0\u95ea\u907f\u7387",
          "/buff_types/armor": "\u51cf\u5c11\u6240\u53d7\u7269\u7406\u4f24\u5bb3",
          "/buff_types/water_resistance": "\u51cf\u5c11\u6240\u53d7\u6c34\u7cfb\u4f24\u5bb3",
          "/buff_types/nature_resistance": "\u51cf\u5c11\u6240\u53d7\u81ea\u7136\u7cfb\u4f24\u5bb3",
          "/buff_types/fire_resistance": "\u51cf\u5c11\u6240\u53d7\u706b\u7cfb\u4f24\u5bb3",
          "/buff_types/damage_taken": "\u589e\u52a0\u6240\u53d7\u4f24\u5bb3",
          "/buff_types/life_steal": "\u81ea\u52a8\u653b\u51fb\u65f6\u83b7\u5f97\u751f\u547d\u7a83\u53d6",
          "/buff_types/mana_leech": "\u81ea\u52a8\u653b\u51fb\u65f6\u83b7\u5f97\u6cd5\u529b\u5438\u53d6",
          "/buff_types/physical_thorns": "\u53d7\u5230\u7269\u7406\u653b\u51fb\u65f6\uff0c\u5bf9\u653b\u51fb\u8005\u9020\u6210\u57fa\u4e8e\u4f60\u62a4\u7532\u7684\u4e00\u5b9a\u7269\u7406\u4f24\u5bb3",
          "/buff_types/elemental_thorns": "\u53d7\u5230\u5143\u7d20\u653b\u51fb\u65f6\uff0c\u5bf9\u653b\u51fb\u8005\u9020\u6210\u57fa\u4e8e\u4f60\u6297\u6027\u7684\u4e00\u5b9a\u5143\u7d20\u4f24\u5bb3",
          "/buff_types/retaliation": "\u5c06\u653b\u51fb\u539f\u59cb\u4f24\u5bb3\u7684\u4e00\u5b9a\u6bd4\u4f8b\u4ee5\u949d\u51fb\u5f62\u5f0f\u53cd\u4f24\u653b\u51fb\u8005",
          "/buff_types/tenacity": "\u964d\u4f4e\u5931\u660e\u3001\u6c89\u9ed8\u6216\u7729\u6655\u7684\u51e0\u7387",
          "/buff_types/hp_regen": "\u589e\u52a0HP\u6062\u590d",
          "/buff_types/mp_regen": "\u589e\u52a0MP\u6062\u590d",
          "/buff_types/threat": "\u589e\u52a0\u6218\u6597\u4e2d\u88ab\u653b\u51fb\u7684\u51e0\u7387",
          "/buff_types/combat_drop_rate": "\u589e\u52a0\u6218\u6597\u6218\u5229\u54c1\u7684\u6389\u843d\u7387",
          "/buff_types/combat_drop_quantity": "\u589e\u52a0\u6218\u6597\u6218\u5229\u54c1\u6570\u91cf"
        },
        buffTypeDebuffDescriptions: {
          "/buff_types/gathering": "\u51cf\u5c11\u91c7\u96c6\u6570\u91cf",
          "/buff_types/efficiency": "\u964d\u4f4e\u7acb\u5373\u91cd\u590d\u884c\u52a8\u7684\u53ef\u80fd\u6027",
          "/buff_types/alchemy_success": "",
          "/buff_types/enhancing_success": "",
          "/buff_types/action_speed": "",
          "/buff_types/task_action_speed": "",
          "/buff_types/milking_level": "",
          "/buff_types/foraging_level": "",
          "/buff_types/woodcutting_level": "",
          "/buff_types/cheesesmithing_level": "",
          "/buff_types/crafting_level": "",
          "/buff_types/tailoring_level": "",
          "/buff_types/cooking_level": "",
          "/buff_types/brewing_level": "",
          "/buff_types/alchemy_level": "",
          "/buff_types/enhancing_level": "",
          "/buff_types/gourmet": "",
          "/buff_types/wisdom": "",
          "/buff_types/processing": "",
          "/buff_types/artisan": "",
          "/buff_types/blessed": "",
          "/buff_types/action_level": "",
          "/buff_types/essence_find": "",
          "/buff_types/rare_find": "",
          "/buff_types/stamina_level": "",
          "/buff_types/intelligence_level": "",
          "/buff_types/defense_level": "",
          "/buff_types/attack_level": "",
          "/buff_types/melee_level": "",
          "/buff_types/ranged_level": "",
          "/buff_types/magic_level": "",
          "/buff_types/attack_speed": "",
          "/buff_types/cast_speed": "",
          "/buff_types/critical_rate": "",
          "/buff_types/critical_damage": "",
          "/buff_types/accuracy": "",
          "/buff_types/damage": "",
          "/buff_types/physical_amplify": "",
          "/buff_types/water_amplify": "",
          "/buff_types/nature_amplify": "",
          "/buff_types/fire_amplify": "",
          "/buff_types/healing_amplify": "",
          "/buff_types/evasion": "",
          "/buff_types/armor": "",
          "/buff_types/water_resistance": "",
          "/buff_types/nature_resistance": "",
          "/buff_types/fire_resistance": "",
          "/buff_types/damage_taken": "",
          "/buff_types/life_steal": "",
          "/buff_types/mana_leech": "",
          "/buff_types/physical_thorns": "",
          "/buff_types/elemental_thorns": "",
          "/buff_types/retaliation": "",
          "/buff_types/tenacity": "",
          "/buff_types/hp_regen": "",
          "/buff_types/mp_regen": "",
          "/buff_types/threat": "",
          "/buff_types/combat_drop_rate": "",
          "/buff_types/combat_drop_quantity": ""
        },
        houseRoomNames: {
          "/house_rooms/dairy_barn": "\u5976\u725b\u68da",
          "/house_rooms/garden": "\u82b1\u56ed",
          "/house_rooms/log_shed": "\u6728\u68da",
          "/house_rooms/forge": "\u953b\u9020\u53f0",
          "/house_rooms/workshop": "\u5de5\u4f5c\u95f4",
          "/house_rooms/sewing_parlor": "\u7f1d\u7eab\u5ba4",
          "/house_rooms/kitchen": "\u53a8\u623f",
          "/house_rooms/brewery": "\u51b2\u6ce1\u574a",
          "/house_rooms/laboratory": "\u5b9e\u9a8c\u5ba4",
          "/house_rooms/observatory": "\u5929\u6587\u53f0",
          "/house_rooms/dining_room": "\u9910\u5385",
          "/house_rooms/library": "\u56fe\u4e66\u9986",
          "/house_rooms/dojo": "\u9053\u573a",
          "/house_rooms/armory": "\u519b\u68b0\u5e93",
          "/house_rooms/gym": "\u5065\u8eab\u623f",
          "/house_rooms/archery_range": "\u5c04\u7bad\u573a",
          "/house_rooms/mystical_study": "\u795e\u79d8\u7814\u7a76\u5ba4"
        },
        purchaseBundleNames: {
          "/purchase_bundles/cowbells_500": "500\u4e2a\u725b\u94c3",
          "/purchase_bundles/cowbells_1050": "1050\u4e2a\u725b\u94c3",
          "/purchase_bundles/cowbells_2700": "2700\u4e2a\u725b\u94c3",
          "/purchase_bundles/cowbells_5500": "5500\u4e2a\u725b\u94c3",
          "/purchase_bundles/cowbells_11500": "11500\u4e2a\u725b\u94c3",
          "/purchase_bundles/moo_pass_standard_30": "30\u5929\u54de\u5361(\u6807\u51c6)",
          "/purchase_bundles/moo_pass_standard_90": "90\u5929\u54de\u5361(\u6807\u51c6)",
          "/purchase_bundles/moo_pass_standard_365": "1\u5e74\u54de\u5361(\u6807\u51c6)",
          "/purchase_bundles/moo_pass_ironcow_30": "30\u5929\u54de\u5361(\u94c1\u725b)",
          "/purchase_bundles/moo_pass_ironcow_90": "90\u5929\u54de\u5361(\u94c1\u725b)",
          "/purchase_bundles/moo_pass_ironcow_365": "1\u5e74\u54de\u5361(\u94c1\u725b)",
          "/purchase_bundles/moo_pass_account_30": "30\u5929\u54de\u5361(\u6240\u6709\u89d2\u8272)",
          "/purchase_bundles/moo_pass_account_90": "90\u5929\u54de\u5361(\u6240\u6709\u89d2\u8272)",
          "/purchase_bundles/moo_pass_account_365": "1\u5e74\u54de\u5361(\u6240\u6709\u89d2\u8272)"
        },
        buyableUpgradeNames: {
          "/buyable_upgrades/offline_hour_cap_1": "+1\u5c0f\u65f6\u79bb\u7ebf\u8fdb\u5ea6",
          "/buyable_upgrades/offline_hour_cap_2": "+1\u5c0f\u65f6\u79bb\u7ebf\u8fdb\u5ea6",
          "/buyable_upgrades/offline_hour_cap_3": "+1\u5c0f\u65f6\u79bb\u7ebf\u8fdb\u5ea6",
          "/buyable_upgrades/offline_hour_cap_4": "+1\u5c0f\u65f6\u79bb\u7ebf\u8fdb\u5ea6",
          "/buyable_upgrades/market_listing_cap_1": "+1\u5e02\u573a\u6302\u724c",
          "/buyable_upgrades/market_listing_cap_2": "+1\u5e02\u573a\u6302\u724c",
          "/buyable_upgrades/market_listing_cap_3": "+1\u5e02\u573a\u6302\u724c",
          "/buyable_upgrades/market_listing_cap_4": "+1\u5e02\u573a\u6302\u724c",
          "/buyable_upgrades/market_listing_cap_5": "+1\u5e02\u573a\u6302\u724c",
          "/buyable_upgrades/action_queue_cap_1": "+1\u884c\u52a8\u961f\u5217",
          "/buyable_upgrades/action_queue_cap_2": "+1\u884c\u52a8\u961f\u5217",
          "/buyable_upgrades/action_queue_cap_3": "+1\u884c\u52a8\u961f\u5217",
          "/buyable_upgrades/action_queue_cap_4": "+1\u884c\u52a8\u961f\u5217",
          "/buyable_upgrades/loadout_slot_cap_1": "+1\u914d\u88c5\u69fd\u4f4d",
          "/buyable_upgrades/loadout_slot_cap_2": "+1\u914d\u88c5\u69fd\u4f4d",
          "/buyable_upgrades/loadout_slot_cap_3": "+1\u914d\u88c5\u69fd\u4f4d",
          "/buyable_upgrades/loadout_slot_cap_4": "+1\u914d\u88c5\u69fd\u4f4d",
          "/buyable_upgrades/task_slot_cap_1": "+1\u4efb\u52a1\u69fd\u4f4d",
          "/buyable_upgrades/task_slot_cap_2": "+1\u4efb\u52a1\u69fd\u4f4d",
          "/buyable_upgrades/task_slot_cap_3": "+1\u4efb\u52a1\u69fd\u4f4d",
          "/buyable_upgrades/task_slot_cap_4": "+1\u4efb\u52a1\u69fd\u4f4d"
        },
        chatIconNames: {
          "/chat_icons/admin": "Admin",
          "/chat_icons/cco": "CCO",
          "/chat_icons/community_manager": "\u793e\u533a\u7ecf\u7406",
          "/chat_icons/super_moderator": "\u8d85\u7ea7\u7ba1\u7406\u5458",
          "/chat_icons/moderator": "\u7ba1\u7406\u5458",
          "/chat_icons/bug_finder": "BUG\u53d1\u73b0\u8005",
          "/chat_icons/super_bug_finder": "\u8d85\u7ea7BUG\u53d1\u73b0\u8005",
          "/chat_icons/contributor": "\u8d21\u732e\u8005",
          "/chat_icons/super_contributor": "\u8d85\u7ea7\u8d21\u732e\u8005",
          "/chat_icons/supporter": "\u652f\u6301\u8005",
          "/chat_icons/verdant_supporter": "\u7fe0\u7eff\u652f\u6301\u8005",
          "/chat_icons/azure_supporter": "\u851a\u84dd\u652f\u6301\u8005",
          "/chat_icons/burble_supporter": "\u6df1\u7d2b\u652f\u6301\u8005",
          "/chat_icons/crimson_supporter": "\u7edb\u7ea2\u652f\u6301\u8005",
          "/chat_icons/rainbow_supporter": "\u5f69\u8679\u652f\u6301\u8005",
          "/chat_icons/holy_supporter": "\u795e\u5723\u652f\u6301\u8005",
          "/chat_icons/beta_bunny": "\u6d4b\u8bd5\u5154",
          "/chat_icons/jack_o_lantern": "\u6770\u514b\u706f\u7b3c",
          "/chat_icons/santa_hat": "\u5723\u8bde\u5e3d",
          "/chat_icons/spring_festival_lantern": "\u6625\u8282\u706f\u7b3c",
          "/chat_icons/anniversary_purple": "\u5468\u5e74\u5c0f\u7d2b\u725b",
          "/chat_icons/og_jerry": "\u539f\u7248\u6770\u745e",
          "/chat_icons/milking": "\u6324\u5976",
          "/chat_icons/foraging": "\u91c7\u6458",
          "/chat_icons/woodcutting": "\u4f10\u6728",
          "/chat_icons/cheesesmithing": "\u5976\u916a\u953b\u9020",
          "/chat_icons/crafting": "\u5236\u4f5c",
          "/chat_icons/tailoring": "\u7f1d\u7eab",
          "/chat_icons/cooking": "\u70f9\u996a",
          "/chat_icons/brewing": "\u51b2\u6ce1",
          "/chat_icons/alchemy": "\u70bc\u91d1",
          "/chat_icons/enhancing": "\u5f3a\u5316",
          "/chat_icons/combat": "\u6218\u6597",
          "/chat_icons/stamina": "\u8010\u529b",
          "/chat_icons/intelligence": "\u667a\u529b",
          "/chat_icons/attack": "\u653b\u51fb",
          "/chat_icons/melee": "\u8fd1\u6218",
          "/chat_icons/defense": "\u9632\u5fa1",
          "/chat_icons/ranged": "\u8fdc\u7a0b",
          "/chat_icons/magic": "\u9b54\u6cd5",
          "/chat_icons/marketplace": "\u5e02\u573a",
          "/chat_icons/tasks": "\u4efb\u52a1",
          "/chat_icons/blueberry": "\u84dd\u8393",
          "/chat_icons/blackberry": "\u9ed1\u8393",
          "/chat_icons/strawberry": "\u8349\u8393",
          "/chat_icons/mooberry": "\u54de\u8393",
          "/chat_icons/marsberry": "\u706b\u661f\u8393",
          "/chat_icons/spaceberry": "\u592a\u7a7a\u8393",
          "/chat_icons/apple": "\u82f9\u679c",
          "/chat_icons/orange": "\u6a59\u5b50",
          "/chat_icons/plum": "\u674e\u5b50",
          "/chat_icons/peach": "\u6843\u5b50",
          "/chat_icons/dragon_fruit": "\u706b\u9f99\u679c",
          "/chat_icons/star_fruit": "\u6768\u6843",
          "/chat_icons/egg": "\u9e21\u86cb",
          "/chat_icons/bamboo": "\u7af9\u5b50",
          "/chat_icons/cheese": "\u5976\u916a",
          "/chat_icons/cupcake": "\u7eb8\u676f\u86cb\u7cd5",
          "/chat_icons/clover": "\u5e78\u8fd0\u8349",
          "/chat_icons/tea": "\u8336",
          "/chat_icons/coffee": "\u5496\u5561",
          "/chat_icons/task_crystal": "\u4efb\u52a1\u6c34\u6676",
          "/chat_icons/star_fragment": "\u661f\u5149\u788e\u7247",
          "/chat_icons/pearl": "\u73cd\u73e0",
          "/chat_icons/amber": "\u7425\u73c0",
          "/chat_icons/garnet": "\u77f3\u69b4\u77f3",
          "/chat_icons/jade": "\u7fe1\u7fe0",
          "/chat_icons/amethyst": "\u7d2b\u6c34\u6676",
          "/chat_icons/moonstone": "\u6708\u4eae\u77f3",
          "/chat_icons/sunstone": "\u592a\u9633\u77f3",
          "/chat_icons/philosophers_stone": "\u8d24\u8005\u4e4b\u77f3",
          "/chat_icons/sword": "\u5251",
          "/chat_icons/spear": "\u67aa",
          "/chat_icons/mace": "\u9489\u5934\u9524",
          "/chat_icons/bulwark": "\u91cd\u76fe",
          "/chat_icons/bow": "\u5f13",
          "/chat_icons/crossbow": "\u5f29",
          "/chat_icons/staff": "\u6cd5\u6756",
          "/chat_icons/book": "\u4e66\u7c4d",
          "/chat_icons/mages_hat": "\u6cd5\u5e08\u5e3d",
          "/chat_icons/panda_paw": "\u718a\u732b\u722a",
          "/chat_icons/fly": "\u82cd\u8747",
          "/chat_icons/rat": "\u6770\u745e",
          "/chat_icons/skunk": "\u81ed\u9f2c",
          "/chat_icons/porcupine": "\u8c6a\u732a",
          "/chat_icons/slimy": "\u53f2\u83b1\u59c6",
          "/chat_icons/frog": "\u9752\u86d9",
          "/chat_icons/snake": "\u86c7",
          "/chat_icons/swampy": "\u6cbc\u6cfd\u866b",
          "/chat_icons/alligator": "\u590f\u6d1b\u514b",
          "/chat_icons/giant_shoebill": "\u9cb8\u5934\u9e73",
          "/chat_icons/sea_snail": "\u8717\u725b",
          "/chat_icons/crab": "\u8783\u87f9",
          "/chat_icons/aquahorse": "\u6c34\u9a6c",
          "/chat_icons/nom_nom": "\u54ac\u54ac\u9c7c",
          "/chat_icons/turtle": "\u5fcd\u8005\u9f9f",
          "/chat_icons/marine_huntress": "\u6d77\u6d0b\u730e\u624b",
          "/chat_icons/jungle_sprite": "\u4e1b\u6797\u7cbe\u7075",
          "/chat_icons/myconid": "\u8611\u83c7\u4eba",
          "/chat_icons/treant": "\u6811\u4eba",
          "/chat_icons/centaur_archer": "\u534a\u4eba\u9a6c\u5f13\u7bad\u624b",
          "/chat_icons/luna_empress": "\u6708\u795e\u4e4b\u8776",
          "/chat_icons/eyes": "\u53e0\u773c",
          "/chat_icons/the_watcher": "\u89c2\u5bdf\u8005",
          "/chat_icons/ice_sorcerer": "\u51b0\u971c\u5deb\u5e08",
          "/chat_icons/flame_sorcerer": "\u706b\u7130\u5deb\u5e08",
          "/chat_icons/elementalist": "\u5143\u7d20\u6cd5\u5e08",
          "/chat_icons/chronofrost_sorcerer": "\u971c\u65f6\u5deb\u5e08",
          "/chat_icons/gummy_bear": "\u8f6f\u7cd6\u718a",
          "/chat_icons/panda": "\u718a\u732b",
          "/chat_icons/black_bear": "\u9ed1\u718a",
          "/chat_icons/grizzly_bear": "\u68d5\u718a",
          "/chat_icons/polar_bear": "\u5317\u6781\u718a",
          "/chat_icons/red_panda": "\u5c0f\u718a\u732b",
          "/chat_icons/zombie": "\u50f5\u5c38",
          "/chat_icons/vampire": "\u5438\u8840\u9b3c",
          "/chat_icons/werewolf": "\u72fc\u4eba",
          "/chat_icons/dusk_revenant": "\u9ec4\u660f\u4ea1\u7075",
          "/chat_icons/abyssal_imp": "\u6df1\u6e0a\u5c0f\u9b3c",
          "/chat_icons/soul_hunter": "\u7075\u9b42\u730e\u624b",
          "/chat_icons/infernal_warlock": "\u5730\u72f1\u672f\u58eb",
          "/chat_icons/demonic_overlord": "\u6076\u9b54\u9738\u4e3b",
          "/chat_icons/butterjerry": "\u8776\u9f20",
          "/chat_icons/rabid_rabbit": "\u75af\u9b54\u5154",
          "/chat_icons/enchanted_knight": "\u79d8\u6cd5\u9a91\u58eb",
          "/chat_icons/enchanted_bishop": "\u79d8\u6cd5\u4e3b\u6559",
          "/chat_icons/squawker": "\u9e66\u9e49",
          "/chat_icons/iron_cow": "\u94c1\u725b",
          "/chat_icons/cow": "\u5976\u725b",
          "/chat_icons/verdant_cow": "\u7fe0\u7eff\u5976\u725b",
          "/chat_icons/azure_cow": "\u851a\u84dd\u5976\u725b",
          "/chat_icons/burble_cow": "\u6df1\u7d2b\u5976\u725b",
          "/chat_icons/crimson_cow": "\u7edb\u7ea2\u5976\u725b",
          "/chat_icons/unicow": "\u5f69\u8679\u5976\u725b",
          "/chat_icons/holy_cow": "\u795e\u5723\u5976\u725b",
          "/chat_icons/duckling": "\u5c0f\u9e2d",
          "/chat_icons/whale": "\u9cb8\u9c7c",
          "/chat_icons/golden_coin": "\u91d1\u5e01",
          "/chat_icons/golden_marketplace": "\u91d1\u8272\u5e02\u573a",
          "/chat_icons/golden_egg": "\u91d1\u86cb",
          "/chat_icons/golden_berry": "\u91d1\u8272\u8393\u679c",
          "/chat_icons/golden_apple": "\u91d1\u8272\u82f9\u679c",
          "/chat_icons/golden_donut": "\u91d1\u8272\u751c\u751c\u5708",
          "/chat_icons/golden_cupcake": "\u91d1\u8272\u7eb8\u676f\u86cb\u7cd5",
          "/chat_icons/golden_clover": "\u91d1\u8272\u5e78\u8fd0\u8349",
          "/chat_icons/golden_biceps": "\u91d1\u8272\u4e8c\u5934\u808c",
          "/chat_icons/golden_frog": "\u91d1\u8272\u9752\u86d9",
          "/chat_icons/golden_piggy": "\u91d1\u8272\u5c0f\u732a",
          "/chat_icons/golden_duckling": "\u91d1\u8272\u5c0f\u9e2d",
          "/chat_icons/golden_whale": "\u91d1\u8272\u9cb8\u9c7c"
        },
        nameColorNames: {
          "/name_colors/burble": "\u7d2b\u8272",
          "/name_colors/blue": "\u84dd\u8272",
          "/name_colors/green": "\u7eff\u8272",
          "/name_colors/yellow": "\u9ec4\u8272",
          "/name_colors/coral": "\u73ca\u745a",
          "/name_colors/pink": "\u7c89\u8272",
          "/name_colors/fancy_burble": "\u534e\u4e3d\u7d2b\u8272",
          "/name_colors/fancy_blue": "\u534e\u4e3d\u84dd\u8272",
          "/name_colors/fancy_green": "\u534e\u4e3d\u7eff\u8272",
          "/name_colors/fancy_yellow": "\u534e\u4e3d\u9ec4\u8272",
          "/name_colors/fancy_coral": "\u534e\u4e3d\u73ca\u745a",
          "/name_colors/fancy_pink": "\u534e\u4e3d\u7c89\u8272",
          "/name_colors/iron": "\u94c1\u8272",
          "/name_colors/rainbow": "\u5f69\u8679\u8272",
          "/name_colors/golden": "\u91d1\u8272"
        },
        communityBuffTypeNames: {
          "/community_buff_types/experience": "\u7ecf\u9a8c",
          "/community_buff_types/gathering_quantity": "\u91c7\u96c6\u6570\u91cf",
          "/community_buff_types/production_efficiency": "\u751f\u4ea7\u6548\u7387",
          "/community_buff_types/enhancing_speed": "\u5f3a\u5316\u901f\u5ea6",
          "/community_buff_types/combat_drop_quantity": "\u6218\u6597\u6389\u843d\u6570\u91cf"
        },
        chatChannelTypeNames: {
          "/chat_channel_types/general": "\u82f1\u8bed",
          "/chat_channel_types/chinese": "\u4e2d\u6587",
          "/chat_channel_types/french": "Fran\xe7ais",
          "/chat_channel_types/german": "Deutsch",
          "/chat_channel_types/spanish": "Espa\xf1ol",
          "/chat_channel_types/portuguese": "Portugu\xeas",
          "/chat_channel_types/russian": "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
          "/chat_channel_types/hebrew": "\u05e2\u05d1\u05e8\u05d9\u05ea",
          "/chat_channel_types/arabic": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
          "/chat_channel_types/hindi": "\u0939\u093f\u0902\u0926\u0940",
          "/chat_channel_types/japanese": "\u65e5\u672c\u8a9e",
          "/chat_channel_types/korean": "\ud55c\uad6d\uc5b4",
          "/chat_channel_types/vietnamese": "Ti\u1ebfng Vi\u1ec7t",
          "/chat_channel_types/ironcow": "\u94c1\u725b",
          "/chat_channel_types/trade": "\u4ea4\u6613",
          "/chat_channel_types/recruit": "\u62db\u52df",
          "/chat_channel_types/beginner": "\u65b0\u624b",
          "/chat_channel_types/guild": "\u516c\u4f1a",
          "/chat_channel_types/party": "\u961f\u4f0d",
          "/chat_channel_types/moderator": "\u7ba1\u7406\u5458",
          "/chat_channel_types/whisper": "\u79c1\u804a"
        },
        guildCharacterRoleNames: {
          leader: "\u4f1a\u957f",
          general: "\u5c06\u519b",
          officer: "\u5b98\u5458",
          member: "\u4f1a\u5458"
        },
        leaderboardTypeNames: {
          standard: "\u6807\u51c6",
          ironcow: "\u94c1\u725b",
          legacy_ironcow: "\u4f20\u7edf\u94c1\u725b",
          steam_standard: "\u6807\u51c6 (Steam)",
          steam_ironcow: "\u94c1\u725b (Steam)",
          guild: "\u516c\u4f1a"
        },
        leaderboardCategoryNames: {
          total_level: "\u603b\u7b49\u7ea7",
          milking: "\u6324\u5976",
          foraging: "\u91c7\u6458",
          woodcutting: "\u4f10\u6728",
          cheesesmithing: "\u5976\u916a\u953b\u9020",
          crafting: "\u5236\u4f5c",
          tailoring: "\u7f1d\u7eab",
          cooking: "\u70f9\u996a",
          brewing: "\u51b2\u6ce1",
          alchemy: "\u70bc\u91d1",
          enhancing: "\u5f3a\u5316",
          stamina: "\u8010\u529b",
          intelligence: "\u667a\u529b",
          attack: "\u653b\u51fb",
          melee: "\u8fd1\u6218",
          defense: "\u9632\u5fa1",
          ranged: "\u8fdc\u7a0b",
          magic: "\u9b54\u6cd5",
          task_points: "\u4efb\u52a1\u79ef\u5206",
          fame_points: "\u540d\u671b\u79ef\u5206",
          guild: "\u516c\u4f1a"
        }
      }
    };

    function getItemName(itemHrid) {
      if (globals.isZHInGameSetting) return ZHitemNames[itemHrid];else return globals.initClientData_itemDetailMap[itemHrid].name;
    }
    function getActionName(actionHrid) {
      if (globals.isZHInGameSetting) return ZHActionNames[actionHrid];else return globals.initClientData_actionDetailMap[actionHrid].name;
    }
    function getItemValuation(hrid, marketJson) {
      const item = globals.initClientData_itemDetailMap[hrid];
      if (!item) {
        console.log(`${hrid} can't found the item detail`);
        return {
          bid: 0,
          ask: 0
        };
      }
      if (item?.isTradable) {
        const ret = {
          ...marketJson.market[item.name]
        };
        if (ret.bid == -1 && ret.ask == -1) ret.ask = ret.bid = 1e9;else if (ret.bid == -1 || ret.ask == -1) ret.ask = ret.bid = Math.max(ret.ask, ret.bid);
        if (globals.medianMarketJson?.market) {
          const median = globals.medianMarketJson.market[item.name];
          ret.medianAsk = median?.ask ?? 0;
          ret.medianBid = median?.bid ?? 0;
        }
        return ret;
      } else if (item?.isOpenable) {
        const openedItems = globals.initClientData_openableLootDropMap[hrid];
        const valuation = {
          bid: 0,
          ask: 0,
          medianAsk: 0,
          medianBid: 0
        };
        for (const openedItem of openedItems) {
          const openedValuation = getItemValuation(openedItem.itemHrid, marketJson);
          valuation.bid += openedItem.dropRate * (openedItem.minCount + openedItem.maxCount) / 2 * openedValuation.bid;
          valuation.ask += openedItem.dropRate * (openedItem.minCount + openedItem.maxCount) / 2 * openedValuation.ask;
          valuation.medianBid += openedItem.dropRate * (openedItem.minCount + openedItem.maxCount) / 2 * (openedValuation?.medianBid ?? 0);
          valuation.medianAsk += openedItem.dropRate * (openedItem.minCount + openedItem.maxCount) / 2 * (openedValuation?.medianAsk ?? 0);
        }
        return valuation;
      } else if (hrid === "/items/coin") return {
        ask: 1,
        bid: 1,
        medianAsk: 1,
        medianBid: 1
      };else if (hrid === "/items/cowbell") {
        const pack = getItemValuation("/items/bag_of_10_cowbells", marketJson);
        return {
          ask: pack.ask / 10,
          bid: pack.bid / 10,
          medianAsk: (pack?.medianAsk ?? 0) / 10,
          medianBid: (pack?.medianBid ?? 0) / 10
        };
      } else return {
        ask: item.sellPrice,
        bid: item.sellPrice,
        medianAsk: item.sellPrice,
        medianBid: item.sellPrice
      };
    }
    function getDropTableInfomation(dropTable, marketJson, teaBuffs = {
      processing: 0
    }) {
      const valuationResult = {
        ask: 0,
        bid: 0
      };
      const dropItems = [];
      for (const drop of dropTable) {
        const valuation = getItemValuation(drop.itemHrid, marketJson);
        let dropCount = (drop.minCount + drop.maxCount) / 2 * drop.dropRate;
        if (globals.processingMap && teaBuffs.processing) {
          const processingAction = globals.processingMap[drop.itemHrid];
          if (processingAction) {
            // Add processed production
            const outputItemHrid = processingAction.outputItems[0].itemHrid;
            const valuation = getItemValuation(outputItemHrid, marketJson);
            const outputCount = teaBuffs.processing / 100 * drop.dropRate;
            valuationResult.ask += valuation.ask * outputCount;
            valuationResult.bid += valuation.bid * outputCount;
            dropItems.push({
              name: getItemName(outputItemHrid),
              ...valuation,
              count: outputCount
            });

            // Reduce processed inputItem
            dropCount -= outputCount * processingAction.inputItems[0].count;
          }
        }
        valuationResult.ask += valuation.ask * dropCount;
        valuationResult.bid += valuation.bid * dropCount;
        dropItems.push({
          itemHrid: drop.itemHrid,
          name: getItemName(drop.itemHrid),
          ...valuation,
          count: dropCount
        });
      }
      return {
        ...valuationResult,
        dropItems
      };
    }
    function getSvg(iconId) {
      if (globals.initClientData_itemDetailMap[`/items/${iconId}`]) return `items_sprite.d4d08849.svg#${iconId}`;
      return `actions_sprite.e6388cbc.svg#${iconId}`;
    }
    function formatNumber(val) {
      let number = Number(val);
      const abs = Math.abs(number);
      if (abs < 10) return Number(Math.trunc(number * 1000) / 1000);else if (abs < 1000) return Number(Math.trunc(number * 10) / 10);else if (abs < 1e5) return Math.trunc(number);else if (abs < 1e6) return `${Number(Math.trunc(number / 100) / 10)}k`;else if (abs < 1e9) return `${Number(Math.trunc(number / 1e4) / 100)}M`;else if (abs < 1e12) return `${Number(Math.trunc(number / 1e7) / 100)}B`;else return `${Math.trunc(number / 1e12)}T`;
    }
    function getSign(val) {
      if (val > 0) return '↑';else if (val < 0) return '↓';
      return '';
    }
    function getDuration(date) {
      return formatDuration(Date.now() - date.getTime());
    }
    function formatDuration(diffMs) {
      const diffSeconds = Math.floor(diffMs / 1000);
      if (diffSeconds < 60) return `${diffSeconds}秒前`;
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) return `${diffMinutes}分钟前`;
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}小时 ${diffMinutes - diffHours * 60}分钟前`;
    }
    function getMwiObj$1() {
      try {
        if (mwi) return mwi;
        return null;
      } catch (e) {
        return null;
      }
    }

    // 完整的物品名称翻译
    const ZHitemNames = zhTranslation.itemNames;

    // 完整的动作名称翻译
    const ZHActionNames = zhTranslation.actionNames;
    const processingCategory = {
      "/action_types/cheesesmithing": ["/action_categories/cheesesmithing/material"],
      "/action_types/crafting": ["/action_categories/crafting/lumber", "/action_categories/crafting/special"],
      "/action_types/tailoring": ["/action_categories/tailoring/material"]
    };
    const ZHActionTypeNames = {
      milking: "\u6324\u5976",
      foraging: "\u91c7\u6458",
      woodcutting: "\u4f10\u6728",
      cheesesmithing: "\u5976\u916a\u953b\u9020",
      crafting: "\u5236\u4f5c",
      tailoring: "\u7f1d\u7eab",
      cooking: "\u70f9\u996a",
      brewing: "\u51b2\u6ce1"
    };
    const OneSecond = 1000;
    const OneMinute = 60 * OneSecond;
    const OneHour = 60 * OneMinute;
    const TimeSpan = {
      TEN_SECONDS: 10 * OneSecond,
      FIVE_MINUTES: 5 * OneMinute,
      HALF_HOURS: 30 * OneMinute,
      ONE_HOURS: OneHour,
      FOUR_HOURS: 4 * OneHour
    };

    const officialConfig = {
      cacheKey: "officialMarketDataCache",
      targetUrls: ["https://www.milkywayidle.com/game_data/marketplace.json", "https://www.milkywayidlecn.com/game_data/marketplace.json"],
      dataTransfer: data => {
        data.market = data.marketData;
        delete data.marketData;
        data.time = data.timestamp;
        delete data.timestamp;
      },
      dataRefreshInterval: TimeSpan.FOUR_HOURS
    };
    const mooketConfig = {
      cacheKey: "mooketMarketDataCache",
      targetUrls: ["https://mooket.qi-e.top/market/api.json"],
      dataTransfer: data => {
        data.market = data.marketData;
        delete data.marketData;
        data.time = data.timestamp;
        delete data.timestamp;
      },
      dataRefreshInterval: TimeSpan.HALF_HOURS
    };
    class MWIApiMarketJson {
      constructor(config) {
        this.dataRefreshInterval = config.dataRefreshInterval || TimeSpan.ONE_HOURS;
        this.cacheMaxAge = TimeSpan.FIVE_MINUTES;
        this.retryInterval = TimeSpan.TEN_SECONDS;
        this.refreshTimer = null;
        this.data = null;
        this.cacheKey = config.cacheKey;
        this.targetUrls = config.targetUrls;
        this.dataTransfer = config.dataTransfer;
        this.fetchMarketJson();
        return new Proxy(this, {
          get(target, prop) {
            if (target.data) return target.data[prop];
            return null;
          },
          set(target, prop, value) {
            // Cant be set outside
            return true;
          }
        });
      }
      clearRefreshTimer() {
        if (this.refreshTimer) {
          clearTimeout(this.refreshTimer);
          this.refreshTimer = null;
        }
      }
      schedualNextRefresh({
        data,
        timestamp
      }) {
        if (data) {
          this.data = data;
          dispatchEvent(new CustomEvent(this.cacheKey, {
            detail: data
          }));
          globals.hasMarketItemUpdate = true; // 主动刷新数据
        }
        const now = Date.now();
        const cacheAge = now - timestamp;
        const dataAge = data?.time ? now - new Date(data.time * 1000).getTime() : this.dataRefreshInterval;
        const nextRefreshTime = data ? Math.max(this.dataRefreshInterval - dataAge, this.cacheMaxAge - cacheAge, this.retryInterval) : this.retryInterval;
        this.clearRefreshTimer();
        this.refreshTimer = setTimeout(async () => {
          this.clearRefreshTimer();
          await this.fetchMarketJson();
        }, nextRefreshTime);
      }
      fetchMarketJson() {
        // 检查缓存
        const cachedData = localStorage.getItem(this.cacheKey);
        if (cachedData) {
          try {
            const {
              data,
              timestamp
            } = JSON.parse(cachedData);
            const now = Date.now();
            const cacheAge = now - timestamp;
            const dataAge = data?.time ? now - new Date(data.time * 1000).getTime() : this.dataRefreshInterval;

            // 如果数据未过期（1小时内）或 缓存足够新（5分钟内）
            if (dataAge < this.dataRefreshInterval || cacheAge < this.cacheMaxAge) {
              this.schedualNextRefresh({
                data,
                timestamp
              });
              return data;
            }
          } catch (e) {
            console.error('Failed to parse cache:', e);
          }
        }
        return new Promise(resolve => {
          const urls = this.targetUrls;
          let currentIndex = 0;
          const tryNextUrl = () => {
            if (currentIndex >= urls.length) {
              // 所有URL尝试失败，返回缓存或null
              if (cachedData) {
                try {
                  const {
                    data
                  } = JSON.parse(cachedData);
                  resolve(data);
                } catch (e) {
                  resolve(null);
                }
              } else {
                resolve(null);
              }
              return;
            }
            try {
              GM_xmlhttpRequest({
                method: "GET",
                url: urls[currentIndex],
                onload: response => {
                  try {
                    let data = JSON.parse(response.responseText);
                    if (this.dataTransfer) this.dataTransfer(data);
                    if (!data?.market) {
                      throw new Error('Invalid market data structure');
                    }

                    // 更新缓存
                    localStorage.setItem(this.cacheKey, JSON.stringify({
                      data,
                      timestamp: Date.now()
                    }));
                    resolve(data);
                  } catch (e) {
                    console.error('Failed to parse market data:', e);
                    currentIndex++;
                    tryNextUrl();
                  }
                },
                onerror: function (error) {
                  console.error(`Failed to fetch market data from ${urls[currentIndex]}:`, error);
                  currentIndex++;
                  tryNextUrl();
                }
              });
            } catch (error) {
              console.error('Request setup failed:', error);
              currentIndex++;
              tryNextUrl();
            }
          };
          tryNextUrl();
        }).then(data => {
          this.schedualNextRefresh({
            data,
            timestamp: Date.now()
          });
          return data;
        });
      }
    }
    class MooketMarketRealtime {
      constructor(updateCallback) {
        this.mwi = getMwiObj$1();
        this.updateCallback = updateCallback;
        addEventListener('MWICoreItemPriceUpdated', e => {
          console.log({
            detail: e.detail
          });
          const price = this.parseRealtimePrice(e.detail);
          if (price) {
            this.updateCallback(price);
          }
        });
      }
      parseRealtimePrice({
        priceObj,
        itemHridLevel
      }) {
        if (!itemHridLevel) return;
        const [itemHrid, level] = itemHridLevel.split(":");
        if (level !== "0") return;
        const item = globals.initClientData_itemDetailMap[itemHrid];
        return {
          name: item.name,
          ask: priceObj.ask,
          bid: priceObj.bid,
          time: priceObj.time
        };
      }
    }
    const DataSourceKey = {
      Official: "Official",
      MooketApi: "MooketApi",
      Mooket: "Mooket",
      User: "User",
      Init: "Init"
    };

    // MedianMarketCache - 管理历史市场数据快照
    class MedianMarketCache {
      constructor() {
        this.cacheKey = "medianMarketSnapshotCache";
        this.data = null;
        this.loadFromCache();
        return new Proxy(this, {
          get(target, prop) {
            // 优先返回目标对象自身的方法和属性
            if (prop in target && typeof target[prop] === 'function') {
              return target[prop].bind(target);
            }
            if (prop === 'market') {
              return target.data || {};
            }
            if (target.data && prop in target.data) {
              return target.data[prop];
            }
            return target[prop];
          },
          set(target, prop, value) {
            // 不允许外部直接设置
            return true;
          }
        });
      }
      loadFromCache() {
        try {
          const cached = localStorage.getItem(this.cacheKey);
          if (cached) {
            this.data = JSON.parse(cached);
            console.log('[MedianMarketCache] 从缓存加载历史数据');
          }
        } catch (e) {
          console.error('[MedianMarketCache] 加载缓存失败:', e);
        }
      }
      update(currentMarketData) {
        try {
          // 深拷贝当前市场数据作为新的历史快照
          this.data = JSON.parse(JSON.stringify(currentMarketData));
          // 持久化到 localStorage
          localStorage.setItem(this.cacheKey, JSON.stringify(this.data));
          console.log('[MedianMarketCache] 更新历史数据快照');
        } catch (e) {
          console.error('[MedianMarketCache] 更新快照失败:', e);
        }
      }
      setDefault(defaultMarketData) {
        // 仅在首次初始化且没有缓存数据时使用
        if (!this.data && defaultMarketData) {
          this.data = JSON.parse(JSON.stringify(defaultMarketData));
          localStorage.setItem(this.cacheKey, JSON.stringify(this.data));
          console.log('[MedianMarketCache] 设置默认历史数据');
        }
      }
    }
    class UnifyMarketData {
      constructor(itemDetailMap) {
        this.market = {};
        this.name2Hrid = {};
        this.statMap = {
          src: {},
          oldestItem: {},
          newestItem: {}
        };
        this.time = Date.now() / 1000;
        this.initMarketData(itemDetailMap);
        if (globals.profitSettings.dataSourceKeys.includes(DataSourceKey.Official)) {
          addEventListener(officialConfig.cacheKey, e => this.updateDataFromOfficialStyle(e.detail, DataSourceKey.Official));
          this.officialMarketJson = new MWIApiMarketJson(officialConfig);
        }
        if (globals.profitSettings.dataSourceKeys.includes(DataSourceKey.MooketApi)) {
          addEventListener(mooketConfig.cacheKey, e => this.updateDataFromOfficialStyle(e.detail, DataSourceKey.MooketApi));
          this.mooketMarketJson = new MWIApiMarketJson(mooketConfig);
        }
        if (globals.profitSettings.dataSourceKeys.includes(DataSourceKey.Mooket)) {
          this.mooketRealtime = new MooketMarketRealtime(item => this.updateRealtimePrice(item));
        }
      }
      initMarketData(itemDetailMap) {
        for (const [hrid, item] of Object.entries(itemDetailMap)) {
          if (item?.isTradable) {
            this.market[item.name] = {
              ask: item.sellPrice,
              bid: item.sellPrice,
              time: 0,
              src: DataSourceKey.Init
            };
            this.name2Hrid[item.name] = hrid;
          }
        }
        this.mergeFromCache();
        this.postUpdate();
      }
      updateDataFromOfficialStyle(marketJson, src) {
        // 在更新新数据前，先保存当前数据作为历史快照
        if (globals.medianMarketJson?.update) {
          globals.medianMarketJson.update(this.market);
        }
        const time = marketJson.time;
        for (const [name, item] of Object.entries(this.market)) {
          if (item.time > time) continue;
          const hrid = this.name2Hrid[name];
          const newPrice = marketJson?.market[hrid];
          if (!newPrice || !newPrice["0"]) continue;
          const level0 = newPrice["0"];
          Object.assign(item, {
            ask: level0.a,
            bid: level0.b,
            src,
            time
          });
        }
        this.postUpdate();
      }
      updateRealtimePrice(item) {
        const targetItem = this.market[item.name];
        if (targetItem?.time < item?.time) {
          Object.assign(targetItem, {
            ask: item.ask,
            bid: item.bid,
            src: DataSourceKey.Mooket,
            time: item.time
          });
          this.postUpdate();
        }
      }
      updateDataFromMarket(marketItemOrderBooks) {
        const itemHrid = marketItemOrderBooks?.itemHrid;
        if (itemHrid) {
          const item = globals.initClientData_itemDetailMap[itemHrid];
          const orderBook = marketItemOrderBooks?.orderBooks[0];
          const ask = orderBook?.asks?.length > 0 ? orderBook.asks[0].price : item.sellPrice;
          const bid = orderBook?.bids?.length > 0 ? orderBook.bids[0].price : item.sellPrice;
          const targetItem = this.market[item.name];
          Object.assign(targetItem, {
            ask,
            bid,
            src: DataSourceKey.User,
            time: Date.now() / 1000
          });
          this.postUpdate();
        }
      }
      postUpdate() {
        const newStas = {};
        let oldestItem = {
          name: "",
          time: Date.now() / 1000
        };
        let newestItem = {
          name: "",
          time: 0
        };
        let total = 0;
        for (const [name, item] of Object.entries(this.market)) {
          if (!newStas[item.src]) newStas[item.src] = 0;
          newStas[item.src]++;
          if (item.time < oldestItem.time) oldestItem = {
            name,
            time: item.time
          };
          if (item.time > newestItem.time) newestItem = {
            name,
            time: item.time
          };
          ++total;
        }
        this.time = oldestItem.time;
        Object.assign(this.statMap, {
          src: {
            ...newStas,
            total
          },
          oldestItem,
          newestItem
        });
        this.dumpToCache();
        globals.hasMarketItemUpdate = true;
      }
      mergeFromCache() {
        const cacheMarket = JSON.parse(GM_getValue('UnifyMarketData', '{}'));
        for (const [name, item] of Object.entries(this.market)) if (cacheMarket[name]) {
          const {
            ask,
            bid,
            src,
            time
          } = cacheMarket[name];
          if (DataSourceKey[src]) {
            Object.assign(item, {
              ask,
              bid,
              src,
              time
            });
          }
        }
      }
      dumpToCache() {
        GM_setValue('UnifyMarketData', JSON.stringify(this.market));
      }
      stat() {
        const dataSrcArr = [];
        for (const [k, val] of Object.entries(DataSourceKey)) {
          if (this.statMap.src[val]) {
            dataSrcArr.push(`${val} (${formatNumber(this.statMap.src[val] * 100 / this.statMap.src.total)}%)`);
          }
        }
        const oldestStr = `${globals.en2ZhMap[this.statMap.oldestItem.name]}(${getDuration(new Date(this.statMap.oldestItem.time * 1000))})`;
        `${globals.en2ZhMap[this.statMap.newestItem.name]}(${getDuration(new Date(this.statMap.newestItem.time * 1000))})`;
        return `最旧：${oldestStr} 数据来源：[${dataSrcArr.join(',')}]`;
      }
    }
    async function preFetchData() {
      // 初始化历史数据缓存
      globals.medianMarketJson = new MedianMarketCache();

      // 初始化统一市场数据
      globals.freshnessMarketJson = new UnifyMarketData(globals.initClientData_itemDetailMap);

      // 如果是第一次运行（没有历史缓存），使用初始市场数据作为默认值
      if (globals.medianMarketJson?.setDefault) {
        globals.medianMarketJson.setDefault(globals.freshnessMarketJson.market);
      }
    }

    class Buff {
      constructor() {
        this.artisan = 0; // "Reduces required materials during production"
        this.action_speed = 0; // "Decreases time cost for the action"
        this.alchemy_success = 0; // "Multiplicative bonus to success rate while alchemizing"
        this.blessed = 0; // "Chance to gain +2 instead of +1 on enhancing success"
        this.combat_drop_quantity = 0; // "Increases quantity of combat loot",
        this.efficiency = 0; // "Chance of repeating the action instantly"
        this.essence_find = 0; // "Increases drop rate of essences"
        this.enhancing_success = 0; // "Multiplicative bonus to success rate while enhancing",
        this.gathering = 0; // "Increases gathering quantity"
        this.wisdom = 0; // "Increases experience gained"
        this.processing = 0; // "Chance to instantly convert gathered resource into processed material"
        this.rare_find = 0; // "Increases rare item drop rate"
      }
      static fromBuffs(buffs) {
        const buff = new Buff();
        if (!buffs) return buff;
        for (const {
          typeHrid,
          flatBoost
        } of buffs) {
          switch (typeHrid) {
            case "/buff_types/artisan":
              buff.artisan += flatBoost * 100;
              break;
            case "/buff_types/action_level":
              buff.efficiency -= flatBoost;
              break;
            case "/buff_types/action_speed":
              buff.action_speed += flatBoost * 100;
              break;
            case "/buff_types/alchemy_success":
              buff.alchemy_success += flatBoost * 100;
              break;
            case "/buff_types/blessed":
              buff.blessed += flatBoost * 100;
              break;
            case "/buff_types/combat_drop_quantity":
              buff.combat_drop_quantity += flatBoost * 100;
              break;
            case "/buff_types/essence_find":
              buff.essence_find += flatBoost * 100;
              break;
            case "/buff_types/efficiency":
              buff.efficiency += flatBoost * 100;
              break;
            case "/buff_types/enhancing_success":
              buff.enhancing_success += flatBoost * 100;
              break;
            case "/buff_types/gathering":
            case "/buff_types/gourmet":
              buff.gathering += flatBoost * 100;
              break;
            case "/buff_types/wisdom":
              buff.wisdom += flatBoost * 100;
              break;
            case "/buff_types/processing":
              buff.processing += flatBoost * 100;
              break;
            case "/buff_types/rare_find":
              buff.rare_find += flatBoost * 100;
              break;
            default:
              if (typeHrid.endsWith("_level")) buff.efficiency += flatBoost;else console.error(`unhandled buff type - ${typeHrid}`);
              break;
          }
        }
        return buff;
      }
    }
    class BuffsProvider {
      constructor() {
        // 缓存所有buff数据
        this.buffCache = {
          community: new Map(),
          tea: new Map(),
          equipment: new Map(),
          house: new Map()
          // mooPass: new Map(),
        };

        // 订阅全局数据变化
        globals.subscribe((key, value) => {
          if (key === 'initCharacterData_communityActionTypeBuffsMap') this.updateBuffCache('community', value);else if (key === 'initCharacterData_consumableActionTypeBuffsMap') this.updateBuffCache('tea', value);else if (key === 'initCharacterData_equipmentActionTypeBuffsMap') this.updateBuffCache('equipment', value);else if (key === 'initCharacterData_houseActionTypeBuffsMap') this.updateBuffCache('house', value);
        });
        this.updateBuffCache('community', globals.initCharacterData_communityActionTypeBuffsMap);
        this.updateBuffCache('tea', globals.initCharacterData_consumableActionTypeBuffsMap);
        this.updateBuffCache('equipment', globals.initCharacterData_equipmentActionTypeBuffsMap);
        this.updateBuffCache('house', globals.initCharacterData_houseActionTypeBuffsMap);
        // updateBuffCache('mooPass', globals.initCharacterData_houseActionTypeBuffsMap);
      }
      updateBuffCache(type, data) {
        this.clearCache(type);
        for (const [actionType, buffs] of Object.entries(data)) {
          this.buffCache[type].set(actionType, Buff.fromBuffs(buffs));
        }
      }
      clearCache(type) {
        if (this.buffCache[type]) {
          this.buffCache[type].clear();
        }
      }
      getCommunityBuff(actionTypeHrid) {
        return this.buffCache.community.get(actionTypeHrid) || new Buff();
      }
      getTeaBuffs(actionTypeHrid) {
        return this.buffCache.tea.get(actionTypeHrid) || new Buff();
      }
      getHouseBuff(actionTypeHrid) {
        return this.buffCache.house.get(actionTypeHrid) || new Buff();
      }
      getEquipmentBuff(actionTypeHrid) {
        return this.buffCache.equipment.get(actionTypeHrid) || new Buff();
      }
    }

    // "community_buffs_updated" === e.type ? this.handleMessageCommunityBuffsUpdated(e)
    var buffs = new BuffsProvider();

    function ProfitCaculation(action, marketJson) {
      const isProduction = action.inputItems?.length > 0;
      const actionHrid = action.hrid;
      const buyMode = globals.profitSettings.materialPriceMode || 'bid';
      const sellMode = globals.profitSettings.productPriceMode || 'ask';

      // 茶(饮品)效率和支出计算
      const teaBuffs = buffs.getTeaBuffs(action.type);
      const drinksConsumedHourAskPrice = {
        ask: 0,
        bid: 0
      };
      const drinksList = globals.initCharacterData_actionTypeDrinkSlotsMap[action.type];
      const drinkItems = [];
      for (const drink of drinksList) {
        if (!drink?.itemHrid) continue;
        const valuation = getItemValuation(drink.itemHrid, marketJson);
        drinksConsumedHourAskPrice.ask += (valuation?.ask ?? 0) * 12;
        drinksConsumedHourAskPrice.bid += (valuation?.bid ?? 0) * 12;
        drinkItems.push({
          ...valuation,
          name: getItemName(drink.itemHrid),
          countPerHour: 12
        });
      }
      const communityBuff = buffs.getCommunityBuff(action.type);

      // 原料支出计算
      let inputItems = [];
      const totalResourcesPricePerAction = {
        ask: 0,
        bid: 0
      };
      if (isProduction) {
        inputItems = JSON.parse(JSON.stringify(action.inputItems));
        for (const item of inputItems) {
          item.name = getItemName(item.itemHrid);
          Object.assign(item, getItemValuation(item.itemHrid, marketJson));
          // 茶减少原料消耗
          item.count *= 1 - teaBuffs.artisan / 100;
          totalResourcesPricePerAction.ask += item.ask * item.count;
          totalResourcesPricePerAction.bid += item.bid * item.count;
        }

        // 上级物品作为原料
        if (action.upgradeItemHrid) {
          const valuation = getItemValuation(action.upgradeItemHrid, marketJson);
          totalResourcesPricePerAction.ask += valuation?.ask;
          totalResourcesPricePerAction.bid += valuation?.bid;
          const upgradedItem = {
            name: getItemName(action.upgradeItemHrid),
            ...valuation,
            count: 1
          };
          inputItems.push(upgradedItem);
        }
      }

      // 等级碾压提高效率（人物等级不及最低要求等级时，按最低要求等级计算）
      const requiredLevel = action.levelRequirement.level;
      let currentLevel = requiredLevel;
      for (const skill of globals.initCharacterData_characterSkills) {
        if (skill.skillHrid === action.levelRequirement.skillHrid) {
          currentLevel = skill.level;
          break;
        }
      }
      const levelEffBuff = Math.max(currentLevel - requiredLevel, 0);
      // 房子效率
      const houseBuff = buffs.getHouseBuff(action.type);
      // 特殊装备效率
      const equipmentBuff = buffs.getEquipmentBuff(action.type);
      // 总效率，影响动作数
      const totalEffBuff = levelEffBuff + houseBuff.efficiency + teaBuffs.efficiency + equipmentBuff.efficiency + communityBuff.efficiency;

      // 每小时动作数（包含工具缩减动作时间）
      const baseTimePerActionSec = action.baseTimeCost / 1000000000;
      const actualTimePerActionSec = baseTimePerActionSec / (1 + equipmentBuff.action_speed / 100);
      const actionPerHour = 3600 / actualTimePerActionSec * (1 + totalEffBuff / 100);

      // 每小时支出
      const expendPerHour = totalResourcesPricePerAction[buyMode] * actionPerHour + drinksConsumedHourAskPrice[buyMode];
      const outputItems = [];
      // 基础产出
      let basicOutputValuationPerAction = {
        ask: 0,
        bid: 0
      };
      if (isProduction) {
        for (const output of action.outputItems) {
          const valuation = getItemValuation(output.itemHrid, marketJson);
          basicOutputValuationPerAction.ask += valuation.ask * output.count;
          basicOutputValuationPerAction.bid += valuation.bid * output.count;
          outputItems.push({
            name: getItemName(output.itemHrid),
            ...valuation,
            count: output.count
          });
        }
      } else {
        basicOutputValuationPerAction = getDropTableInfomation(action.dropTable, marketJson, teaBuffs);
        outputItems.push(...basicOutputValuationPerAction.dropItems);
      }

      // 茶产量额外增益
      const quantityBuf = (100 + teaBuffs.gathering + communityBuff.gathering) / 100;
      basicOutputValuationPerAction.ask *= quantityBuf;
      basicOutputValuationPerAction.bid *= quantityBuf;
      outputItems.forEach(item => item.count *= quantityBuf);

      // 精华掉落
      const essenceOutputValuationPerAction = Array.isArray(action?.essenceDropTable) ? getDropTableInfomation(action.essenceDropTable, marketJson) : {
        ask: 0,
        bid: 0
      };
      if (essenceOutputValuationPerAction.dropItems) {
        const quantityBuf = (100 + equipmentBuff.essence_find) / 100;
        essenceOutputValuationPerAction.ask *= quantityBuf;
        essenceOutputValuationPerAction.bid *= quantityBuf;
        essenceOutputValuationPerAction.dropItems.forEach(item => item.count *= quantityBuf);
        outputItems.push(...essenceOutputValuationPerAction.dropItems);
      }

      // 稀有掉落
      const rareOutputValuationPerAction = Array.isArray(action?.rareDropTable) ? getDropTableInfomation(action.rareDropTable, marketJson) : {
        ask: 0,
        bid: 0
      };
      if (rareOutputValuationPerAction.dropItems) {
        const quantityBuf = (100 + houseBuff.rare_find + equipmentBuff.rare_find) / 100;
        rareOutputValuationPerAction.ask *= quantityBuf;
        rareOutputValuationPerAction.bid *= quantityBuf;
        rareOutputValuationPerAction.dropItems.forEach(item => item.count *= quantityBuf);
        outputItems.push(...rareOutputValuationPerAction.dropItems);
      }

      // 每小时产出
      const ask = basicOutputValuationPerAction.ask + essenceOutputValuationPerAction.ask + rareOutputValuationPerAction.ask;
      const bid = basicOutputValuationPerAction.bid + essenceOutputValuationPerAction.bid + rareOutputValuationPerAction.bid;
      const outputPerHour = {
        ask: ask * actionPerHour * 0.98,
        bid: bid * actionPerHour * 0.98
      };
      inputItems.forEach(item => item.countPerHour = item.count * actionPerHour);
      drinkItems.forEach(item => item.count = item.countPerHour / actionPerHour);
      inputItems.push(...drinkItems);
      outputItems.forEach(item => item.countPerHour = item.count * actionPerHour);

      // 每小时利润
      const profitPerHour = outputPerHour[sellMode] - expendPerHour;
      const profitPerDay = profitPerHour * 24;
      return {
        actionNames: getActionName(action.hrid),
        actionHrid,
        inputItems,
        outputItems,
        actionPerHour,
        expendPerHour,
        outputPerHour,
        profitPerHour,
        baseTimePerActionSec,
        levelEffBuff,
        teaBuffs,
        communityBuff,
        houseBuff,
        equipmentBuff,
        profitPerDay,
        ProfitMargin: 100 * profitPerHour / expendPerHour
      };
    }

    function GenerateDom(marketJson) {
      if (!marketJson?.market) throw new Error("Market data unavailable");
      const actionTypes = globals.profitSettings.actionCategories;
      const actionTypesHtml = [];
      for (const actionType of actionTypes) {
        const actions = [];
        Object.keys(globals.initClientData_actionDetailMap).filter(key => key.indexOf(`/actions/${actionType}/`) !== -1).forEach(key => actions.push(globals.initClientData_actionDetailMap[key]));
        const actionsHtmlResult = [];
        for (const action of actions) {
          if (processingCategory[action.type]) {
            const categorys = processingCategory[action.type];
            if (action?.category && categorys.indexOf(action.category) === -1) continue;
          }
          const levelEngouth = globals.initCharacterData_characterSkills.some(skill => skill.skillHrid === action.levelRequirement.skillHrid && skill.level >= action.levelRequirement.level);
          const iconId = action.hrid.replace(`/actions/${actionType}/`, '');
          const result = ProfitCaculation(action, marketJson);
          const actionHtml = `
                <div class="Item_itemContainer__x7kH1" style="position: relative;">
                    <div>
                        <div class="Item_item__2De2O Item_clickable__3viV6 Profit-pannel" style="${levelEngouth ? "" : "background-color: var(--color-midnight-800);"}" data-tooltip='${JSON.stringify(result)}'>
                            <div class="Item_iconContainer__5z7j4"><svg role="img" aria-label="${action.name}"
                                    class="Icon_icon__2LtL_" width="100%" height="100%">
                                    <use href="/static/media/${getSvg(iconId)}"></use>
                                </svg></div>
                            
                            <div id="script_stack_price" style="z-index: 1; position: absolute; top: 2px; left: 2px; text-align: left;">${formatNumber(result.profitPerDay)}</div>
                            <div class="Item_count__1HVvv">${result.ProfitMargin.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
            `;
          actionsHtmlResult.push({
            profitPerHour: result.profitPerHour,
            actionHtml
          });
        }
        const actionHtml = [];
        actionsHtmlResult.sort((l, r) => r.profitPerHour - l.profitPerHour).forEach(v => actionHtml.push(v.actionHtml));
        const actionTypeHtml = `
            <div>
                <div class="Inventory_itemGrid__20YAH">
                    <div class="Inventory_label__XEOAx" >
                        <span class="Inventory_categoryButton__35s1x">${ZHActionTypeNames[actionType]}</span>
                    </div>
                    ${actionHtml.join('\n')}
                </div>
            </div>
        `;
        actionTypesHtml.push(actionTypeHtml);
      }
      const innerHtml = actionTypesHtml.join('\n');
      return innerHtml;
    }

    function createTooltip() {
      const tooltip = document.createElement('div');
      tooltip.id = 'profit-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.className = 'MuiPopper-root MuiTooltip-popper css-55b9xc';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '9999';
      tooltip.style.display = 'none';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.margin = '0px';
      tooltip.style.inset = "0px auto auto 0px";
      const tooltipInner = document.createElement('div');
      tooltipInner.className = 'MuiTooltip-tooltip MuiTooltip-tooltipPlacementTop css-1spb1s5';
      tooltipInner.style.minWidth = "340px";
      const tooltipContent = document.createElement('div');
      tooltipContent.className = 'ItemTooltipText_itemTooltipText__zFq3A';
      tooltipInner.appendChild(tooltipContent);
      tooltip.appendChild(tooltipInner);
      document.body.appendChild(tooltip);
      setupTooltipEvents(tooltip, tooltipContent);
      return {
        container: tooltip,
        content: tooltipContent
      };
    }
    function generateDiffInfo(item, type) {
      const medianType = type == "ask" ? "medianAsk" : "medianBid";
      if (!item[type] || !item[medianType]) {
        console.log(item);
        return "";
      }
      const diff = item[type] - item[medianType];
      if (diff == 0) return "(-)";
      const sign = diff > 0 ? "↑" : "↓";
      const num = formatNumber(Math.abs(diff));
      return ` (${sign}${num})`;
    }
    function setupTooltipEvents(tooltip, tooltipContent) {
      let tooltipTimer = null;
      document.addEventListener('mouseover', e => {
        const itemContainer = e.target.closest('.Item_item__2De2O.Profit-pannel');
        if (!itemContainer) {
          tooltip.style.display = 'none';
          return;
        }
        const tooltipData = itemContainer.dataset.tooltip;
        if (!tooltipData) return;
        try {
          const data = JSON.parse(tooltipData);
          tooltipContent.innerHTML = formatTooltipContent(data);
          tooltip.style.display = 'block';

          // 计算并设置位置
          const rect = itemContainer.getBoundingClientRect();
          const xPos = Math.max(0, rect.left - tooltip.offsetWidth);
          const yPos = Math.max(0, rect.bottom - tooltip.offsetHeight);
          tooltip.style.transform = `translate(${xPos}px, ${yPos}px)`;
          tooltip.setAttribute('data-popper-placement', 'left');
          if (tooltipTimer) clearTimeout(tooltipTimer);
        } catch (e) {
          console.error('Failed to parse tooltip data:', e);
        }
      });
      document.addEventListener('mouseout', e => {
        if (!e.relatedTarget || !e.relatedTarget.closest('.Item_item__2De2O.Profit-pannel')) {
          tooltipTimer = setTimeout(() => {
            tooltip.style.display = 'none';
          }, 0);
        }
      });
    }
    function formatPercent(percent) {
      const result = percent ? `+${formatNumber(percent)}%` : "-";
      return result;
    }
    function formatTooltipContent(data) {
      let totalInputAsk = 0,
        totalInputBid = 0;
      let totalInputMedianAsk = 0,
        totalInputMedianBid = 0;
      const inputTableHtmls = [];
      for (const input of data.inputItems) {
        totalInputAsk += input.ask * input.count;
        totalInputBid += input.bid * input.count;
        totalInputMedianAsk += (input.medianAsk ?? 0) * input.count;
        totalInputMedianBid += (input.medianBid ?? 0) * input.count;
        const tableHtml = `
                    <tr>
                        <td style="text-align: left;">${input.name}</td>
                        <td style="text-align: right;">${formatNumber(input.count)}</td>
                        <td style="text-align: right;">${formatNumber(input.ask)}</td>
                        <td style="text-align: left;">${generateDiffInfo(input, "ask")}</td>
                        <td style="text-align: right;">${formatNumber(input.bid)}</td>
                        <td style="text-align: left;">${generateDiffInfo(input, "bid")}</td>
                        <td style="text-align: right;">${formatNumber(input.countPerHour)}</td>
                    </tr>
                `;
        inputTableHtmls.push(tableHtml);
      }
      let totalOuputAsk = 0,
        totalOuputBid = 0;
      let totalOutputMedianAsk = 0,
        totalOutputMedianBid = 0;
      const onputTableHtmls = [];
      for (const output of data.outputItems) {
        totalOuputAsk += output.ask * output.count;
        totalOuputBid += output.bid * output.count;
        totalOutputMedianAsk += (output.medianAsk ?? 0) * output.count;
        totalOutputMedianBid += (output.medianBid ?? 0) * output.count;
        const tableHtml = `
                    <tr>
                        <td style="text-align: left;">${output.name}</td>
                        <td style="text-align: right;">${formatNumber(output.count)}</td>
                        <td style="text-align: right;">${formatNumber(output.ask)}</td>
                        <td style="text-align: left;">${generateDiffInfo(output, "ask")}</td>
                        <td style="text-align: right;">${formatNumber(output.bid)}</td>
                        <td style="text-align: left;">${generateDiffInfo(output, "bid")}</td>
                        <td style="text-align: right;">${formatNumber(output.countPerHour)}</td>
                    </tr>
                `;
        onputTableHtmls.push(tableHtml);
      }

      // 格式化tooltip内容
      const content = `
        <div class="ItemTooltipText_name__2JAHA"><span>${data.actionNames}</span></div>

            <div style="color: #804600; font-size: 10px;">
                <table style="width:100%; border-collapse: collapse;">
                    <tbody>
                        <tr style="border-bottom: 1px solid #804600;">
                            <th style="text-align: left;">原料</th>
                            <th style="text-align: center;">数量</th>
                            <th style="text-align: right;">出售价</th>
                            <th style="text-align: left;"></th>
                            <th style="text-align: right;">收购价</th>
                            <th style="text-align: left;"></th>
                            <th style="text-align: right;">数量/小时</th>
                        </tr>
                        <tr style="border-bottom: 1px solid #804600;">
                            <td style="text-align: left;"><b>合计</b></td>
                            <td style="text-align: right;"><b>/</b></td>
                            <td style="text-align: right;"><b>${formatNumber(totalInputAsk)}</b></td>
                            <th style="text-align: left;">${generateDiffInfo({
    ask: totalInputAsk,
    medianAsk: totalInputMedianAsk
  }, "ask")}</th>
                            <td style="text-align: right;"><b>${formatNumber(totalInputBid)}</b></td>
                            <th style="text-align: left;">${generateDiffInfo({
    bid: totalInputBid,
    medianBid: totalInputMedianBid
  }, "bid")}</th>
                            <td style="text-align: right;"><b>/</b></td>
                        </tr>
                        ${inputTableHtmls.join('\n')}
                    </tbody>
                </table>
            </div>
            <div><strong>每小时支出:</strong> ${formatNumber(data.expendPerHour)}</div>
            <div style="color: #804600; font-size: 10px;">
                <table style="width:100%; border-collapse: collapse;">
                    <tbody>
                        <tr style="border-bottom: 1px solid #804600;">
                            <th style="text-align: left;">产出</th>
                            <th style="text-align: center;">数量</th>
                            <th style="text-align: right;">出售价</th>
                            <th style="text-align: left;"></th>
                            <th style="text-align: right;">收购价</th>
                            <th style="text-align: left;"></th>
                            <th style="text-align: right;">数量/小时</th>
                        </tr>
                        <tr style="border-bottom: 1px solid #804600;">
                            <td style="text-align: left;"><b>合计</b></td>
                            <td style="text-align: right;"><b>/</b></td>
                            <td style="text-align: right;"><b>${formatNumber(totalOuputAsk)}</b></td>
                            <th style="text-align: left;">${generateDiffInfo({
    ask: totalOuputAsk,
    medianAsk: totalOutputMedianAsk
  }, "ask")}</th>
                            <td style="text-align: right;"><b>${formatNumber(totalOuputBid)}</b></td>
                            <th style="text-align: left;">${generateDiffInfo({
    bid: totalOuputBid,
    medianBid: totalOutputMedianBid
  }, "bid")}</th>
                            <td style="text-align: right;"><b>/</b></td>
                        </tr>
                        ${onputTableHtmls.join('\n')}
                    </tbody>
                </table>
            </div>
            <div><strong>每小时收入(税后):</strong> ${formatNumber(data.outputPerHour.bid)}</div>
            <div style="color: #804600; font-size: 10px;">
                <table style="width:100%; border-collapse: collapse;">
                    <tbody>
                        <tr style="border-bottom: 1px solid #804600;">
                            <th style="text-align: right;">类型</th>
                            <th style="text-align: right;">速度</th>
                            <th style="text-align: right;">效率</th>
                            <th style="text-align: right;">数量</th>
                            <th style="text-align: right;">精华</th>
                            <th style="text-align: right;">稀有</th>
                            <th style="text-align: right;">经验</th>
                        </tr>
                        <tr style="border-bottom: 1px solid #804600;">
                            <td style="text-align: right;"><b>社区</b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.communityBuff.action_speed)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.communityBuff.efficiency)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.communityBuff.gathering)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.communityBuff.essence_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.communityBuff.rare_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.communityBuff.wisdom)} </b></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #804600;">
                            <td style="text-align: right;"><b>茶</b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.teaBuffs.action_speed)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.teaBuffs.efficiency)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.teaBuffs.gathering)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.teaBuffs.essence_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.teaBuffs.rare_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.teaBuffs.wisdom)} </b></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #804600;">
                            <td style="text-align: right;"><b>装备</b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.equipmentBuff.action_speed)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.equipmentBuff.efficiency)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.equipmentBuff.gathering)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.equipmentBuff.essence_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.equipmentBuff.rare_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.equipmentBuff.wisdom)} </b></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #804600;">
                            <td style="text-align: right;"><b>等级</b></td>
                            <td style="text-align: right;"><b> - </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.levelEffBuff)} </b></td>
                            <td style="text-align: right;"><b> - </b></td>
                            <td style="text-align: right;"><b> - </b></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #804600;">
                            <td style="text-align: right;"><b>房子</b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.houseBuff.action_speed)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.houseBuff.efficiency)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.houseBuff.gathering)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.houseBuff.essence_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.houseBuff.rare_find)} </b></td>
                            <td style="text-align: right;"><b> ${formatPercent(data.houseBuff.wisdom)} </b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>每小时动作: ${data.actionPerHour.toFixed(2)}次</div>
            <div>茶减少消耗: ${data.teaBuffs.artisan.toFixed(2)}%</div>
            <div><strong>每小时利润(税后):</strong> ${formatNumber(data.profitPerHour)}</div>
        `;
      return content;
    }

    const modalHTML = `
            <div class="modal fade" id="profitSettingsModal" tabindex="-1" style="z-index: 100000;" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">收益设置</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">原料进货方式</label>
                                <select class="form-select" id="materialPriceMode">
                                    <option value="ask">高买</option>
                                    <option value="bid">低买</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">产品出货方式</label>
                                <select class="form-select" id="productPriceMode">
                                    <option value="ask">高卖</option>
                                    <option value="bid">低卖</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">显示的动作分类</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="milkingCheck" value="milking">
                                    <label class="form-check-label" for="milkingCheck">挤奶</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="foragingCheck" value="foraging">
                                    <label class="form-check-label" for="foragingCheck">采摘</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="woodcuttingCheck" value="woodcutting">
                                    <label class="form-check-label" for="woodcuttingCheck">伐木</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="cheesesmithingCheck" value="cheesesmithing">
                                    <label class="form-check-label" for="cheesesmithingCheck">奶锻制造</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="craftingCheck" value="crafting">
                                    <label class="form-check-label" for="craftingCheck">制作</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="tailoringCheck" value="tailoring">
                                    <label class="form-check-label" for="tailoringCheck">缝纫</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="cookingCheck" value="cooking">
                                    <label class="form-check-label" for="cookingCheck">烹饪</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="brewingCheck" value="brewing">
                                    <label class="form-check-label" for="brewingCheck">冲泡</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">数据来源 (暂时不生效)</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="officialCheck" value="Official">
                                    <label class="form-check-label" for="officialCheck">官方市场</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="mooketApiCheck" value="MooketApi">
                                    <label class="form-check-label" for="mooketApiCheck">Mooket API</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="mooketCheck" value="Mooket">
                                    <label class="form-check-label" for="mooketCheck">Mooket实时</label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary" id="saveSettingsBtn">保存设置</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
    function validateProfitSettings(settings) {
      const validCategories = ['milking', 'foraging', 'woodcutting', 'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'];
      const validDataSources = ['Official', 'MooketApi', 'Mooket'];

      // 验证price modes
      if (!['ask', 'bid'].includes(settings.materialPriceMode)) {
        settings.materialPriceMode = 'ask';
      }
      if (!['ask', 'bid'].includes(settings.productPriceMode)) {
        settings.productPriceMode = 'bid';
      }

      // 验证dataSourceKeys
      if (!Array.isArray(settings.dataSourceKeys)) {
        settings.dataSourceKeys = validDataSources;
      } else {
        settings.dataSourceKeys = settings.dataSourceKeys.filter(src => validDataSources.includes(src));
        if (settings.dataSourceKeys.length === 0) {
          settings.dataSourceKeys = validDataSources;
        }
      }

      // 验证actionCategories
      if (!Array.isArray(settings.actionCategories)) {
        settings.actionCategories = validCategories;
      } else {
        settings.actionCategories = settings.actionCategories.filter(cat => validCategories.includes(cat));
        if (settings.actionCategories.length === 0) {
          settings.actionCategories = validCategories;
        }
      }
      return settings;
    }
    function initSettingsPanel() {
      // 设置按钮点击事件
      document.addEventListener('click', e => {
        if (e.target.closest('#profitSettingsBtn')) {
          // 创建并插入模态框HTML

          document.body.insertAdjacentHTML('beforeend', modalHTML);
          const modal = new bootstrap.Modal(document.getElementById('profitSettingsModal'));

          // 设置模态框隐藏时的清理事件
          document.getElementById('profitSettingsModal').addEventListener('hidden.bs.modal', () => {
            const modalEl = document.getElementById('profitSettingsModal');
            if (modalEl) {
              modalEl.remove();
            }
          });

          // 保存设置事件
          document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            const actionCategories = Array.from(document.querySelectorAll('#profitSettingsModal .modal-body > div:nth-child(3) input[type="checkbox"][value]:checked')).map(checkbox => checkbox.value);
            const dataSourceKeys = Array.from(document.querySelectorAll('#profitSettingsModal .modal-body > div:nth-child(4) input[type="checkbox"][value]:checked')).map(checkbox => checkbox.value);
            const settings = {
              materialPriceMode: document.getElementById('materialPriceMode').value,
              productPriceMode: document.getElementById('productPriceMode').value,
              dataSourceKeys: dataSourceKeys,
              actionCategories: actionCategories
            };
            globals.profitSettings = validateProfitSettings(settings);
            bootstrap.Modal.getInstance(document.getElementById('profitSettingsModal')).hide();
          });

          // 加载当前设置
          const settings = globals.profitSettings;
          document.getElementById('materialPriceMode').value = settings.materialPriceMode;
          document.getElementById('productPriceMode').value = settings.productPriceMode;
          // 设置默认数据来源选项
          const dataSourceCheckboxes = document.querySelectorAll('#profitSettingsModal .modal-body > div:nth-child(4) input[type="checkbox"][value]');
          if (settings.dataSourceKeys) {
            dataSourceCheckboxes.forEach(checkbox => {
              checkbox.checked = settings.dataSourceKeys.includes(checkbox.value);
            });
          } else {
            // 默认全选
            dataSourceCheckboxes.forEach(checkbox => {
              checkbox.checked = true;
            });
          }

          // 设置默认分类选项
          const checkboxes = document.querySelectorAll('#profitSettingsModal .modal-body > div:nth-child(3) input[type="checkbox"][value]');
          if (settings.actionCategories) {
            checkboxes.forEach(checkbox => {
              checkbox.checked = settings.actionCategories.includes(checkbox.value);
            });
          } else {
            // 默认全选
            checkboxes.forEach(checkbox => {
              checkbox.checked = true;
            });
          }
          modal.show();
        }
      });
      globals.subscribe((key, value) => {
        if (key === "profitSettings") {
          refreshProfitPanel(true);
          GM_setValue("profitSettings", JSON.stringify(value));
        }
      });
    }

    let initialized = false;

    // 获取当前交易模式的标识
    function getCurrentTradingMode() {
      const settings = globals.profitSettings;
      return `${settings.materialPriceMode}-${settings.productPriceMode}`;
    }

    // 设置交易模式
    function setTradingMode(materialMode, productMode) {
      const settings = globals.profitSettings;
      globals.profitSettings = {
        ...settings,
        materialPriceMode: materialMode,
        productPriceMode: productMode
      };
    }

    // 生成交易模式按钮组HTML
    function generateTradingModeButtons() {
      const currentMode = getCurrentTradingMode();
      const modes = [{
        key: 'ask-bid',
        label: '高买低卖',
        material: 'ask',
        product: 'bid'
      }, {
        key: 'ask-ask',
        label: '高买高卖',
        material: 'ask',
        product: 'ask'
      }, {
        key: 'bid-ask',
        label: '低买高卖',
        material: 'bid',
        product: 'ask'
      }, {
        key: 'bid-bid',
        label: '低买低卖',
        material: 'bid',
        product: 'bid'
      }];
      return modes.map(mode => `
        <label class="trading-mode-option" style="
            display: flex; 
            align-items: center; 
            margin-right: 6px; 
            padding: 3px 6px; 
            cursor: pointer; 
            font-size: 0.72em;
            border-radius: 3px;
            background: ${currentMode === mode.key ? '#007bff' : '#f8f9fa'};
            color: ${currentMode === mode.key ? 'white' : '#333'};
            border: 1px solid ${currentMode === mode.key ? '#007bff' : '#dee2e6'};
            transition: all 0.2s ease;
        ">
            <input type="radio" name="tradingMode" value="${mode.key}" ${currentMode === mode.key ? 'checked' : ''} 
                   style="display: none;" data-material="${mode.material}" data-product="${mode.product}">
            <span style="white-space: nowrap;">${mode.label}</span>
        </label>
    `).join('');
    }
    async function waitForPannels() {
      if (!globals.freshnessMarketJson?.market) {
        setTimeout(waitForPannels, 1000);
        return;
      }
      const rightPanelContainers = document.querySelectorAll("div.CharacterManagement_tabsComponentContainer__3oI5G");
      const leftPanelContainers = document.querySelectorAll("div.GamePage_middlePanel__ubts7 .MuiTabs-root");
      const targetNodes = [...rightPanelContainers, ...leftPanelContainers];
      targetNodes.forEach(container => {
        if (container.querySelector('.MuiButtonBase-root.MuiTab-root.MuiTab-textColorPrimary.css-1q2h7u5.income-tab')) return;

        // 添加标签按钮和面板容器
        const tabsContainer = container.querySelector('div.MuiTabs-flexContainer');
        const tabPanelsContainer = container.querySelector('div.TabsComponent_tabPanelsContainer__26mzo') || container.querySelector('div.MuiTabPanel-root');
        if (!tabsContainer || !tabPanelsContainer) return;
        const newTabButton = document.createElement('button');
        newTabButton.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5 income-tab';
        newTabButton.innerHTML = `<span class="MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu">收益<span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorWarning css-dpce5z"></span></span><span class="MuiTouchRipple-root css-w0pj6f"></span>`;
        newTabButton.classList.add('income-tab');
        tabsContainer.appendChild(newTabButton);

        // 创建收益面板
        const newPanel = document.createElement('div');
        newPanel.className = 'TabPanel_tabPanel__tXMJF TabPanel_hidden__26UM3 income-panel';
        newPanel.innerHTML = `
            <div class="Inventory_inventory__17CH2 profit-pannel">
            <h1 class="HousePanel_title__2fQ1U" style="position: relative; width: fit-content; margin: 4px auto 8px; font-size: 18px; font-weight: 600;">
                <div>生产收益详情</div>
                <div class="HousePanel_guideTooltipContainer__1lAt1" style="position: absolute; left: 100%; top: 0; margin-top: 1px; margin-left: 12px;">
                    <div class="GuideTooltip_guideTooltip__1tVq-" id="profitSettingsBtn" style="cursor: pointer">
                        <svg role="img" aria-label="Guide" class="Icon_icon__2LtL_" width="100%" height="100%">
                            <use href="/static/media/misc_sprite.6b3198dc.svg#settings"></use>
                        </svg>
                    </div>
                </div>
            </h1>
                <div style="display: flex; align-items: center; justify-content: space-between; margin: 0 10px 8px; flex-wrap: wrap;">
                    <span style="color: green; font-size: 0.8em; margin-bottom: 4px;">数据更新于: ${formatDuration(Date.now() - globals.freshnessMarketJson.time * 1000)}</span>
                    <div id="tradingModeContainer" style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        ${generateTradingModeButtons()}
                    </div>
                </div>
                <div class="Inventory_items__6SXv0 script_buildScore_added script_invSort_added">
                ${GenerateDom(globals.freshnessMarketJson)}
                </div>
            </div>
        `;
        tabPanelsContainer.appendChild(newPanel);
        container.dataset.processed = "true";
        setupTabSwitching(newTabButton, newPanel, tabPanelsContainer, container);
        if (!initialized) {
          createTooltip();
          setupClickActions();
          initSettingsPanel();
          setInterval(() => refreshProfitPanel(), 1000);
          initialized = true;
        }
      });
      setTimeout(waitForPannels, 1000);
    }
    function setupTabSwitching(newTabButton, newPanel, tabPanelsContainer, container) {
      newTabButton.addEventListener('click', () => {
        container.querySelectorAll('.MuiTab-root').forEach(btn => btn.classList.remove('Mui-selected'));
        newTabButton.classList.add('Mui-selected');
        tabPanelsContainer.querySelectorAll('.TabPanel_tabPanel__tXMJF').forEach(panel => {
          panel.classList.add('TabPanel_hidden__26UM3');
        });
        newPanel.classList.remove('TabPanel_hidden__26UM3');
      });
      container.querySelectorAll('.MuiTab-root:not(.income-tab)').forEach(btn => {
        btn.addEventListener('click', () => {
          newPanel.classList.add('TabPanel_hidden__26UM3');
          newTabButton.classList.remove('Mui-selected');

          // 添加选中状态并显示原标签面板
          btn.classList.add('Mui-selected');
          const tabIndex = Array.from(btn.parentNode.children).filter(el => !el.classList.contains('income-tab')).indexOf(btn);
          tabPanelsContainer.querySelectorAll('.TabPanel_tabPanel__tXMJF:not(.income-panel)').forEach((panel, index) => {
            panel.classList.toggle('TabPanel_hidden__26UM3', index !== tabIndex);
          });
        });
      });
    }
    function setupClickActions() {
      document.addEventListener('click', e => {
        // 处理交易模式按钮点击 (包括label和radio)
        const tradingModeLabel = e.target.closest('.trading-mode-option');
        if (tradingModeLabel) {
          const radio = tradingModeLabel.querySelector('input[type="radio"]');
          if (radio) {
            const materialMode = radio.dataset.material;
            const productMode = radio.dataset.product;
            setTradingMode(materialMode, productMode);
            refreshProfitPanel(true);

            // 更新所有按钮的样式
            document.querySelectorAll('.trading-mode-option').forEach(label => {
              const labelRadio = label.querySelector('input[type="radio"]');
              const isSelected = labelRadio === radio;
              label.style.background = isSelected ? '#007bff' : '#f8f9fa';
              label.style.color = isSelected ? 'white' : '#333';
              label.style.borderColor = isSelected ? '#007bff' : '#dee2e6';
              labelRadio.checked = isSelected;
            });
          }
          return;
        }
        const itemContainer = e.target.closest('.Item_item__2De2O.Profit-pannel');
        if (!itemContainer) return;
        const tooltipData = itemContainer.dataset.tooltip;
        if (!tooltipData) return;
        try {
          const data = JSON.parse(tooltipData);
          if (data?.actionHrid && getMwiObj$1()?.game?.handleGoToAction) {
            getMwiObj$1().game.handleGoToAction(data.actionHrid);
          }
        } catch (e) {
          console.error('Click action error:', e);
        }
      });
    }
    function refreshProfitPanel(force = false) {
      if (!globals.freshnessMarketJson?.market) return;
      const inventoryPanels = document.querySelectorAll('.Inventory_inventory__17CH2.profit-pannel');
      inventoryPanels.forEach(panel => {
        const timeSpan = panel.querySelector('span');
        if (timeSpan) {
          timeSpan.textContent = globals.freshnessMarketJson.stat();
          // timeSpan.textContent = `数据更新于：${getDuration(new Date(globals.freshnessMarketJson.time * 1000))}，收益刷新于：${getDuration(profitRefreshTime)}，mooket${mooketStatus()}，${getMwiObj()?.coreMarket ? "支持" : "不支持"}实时价格`;
        }

        // 更新交易模式按钮状态
        const tradingModeContainer = panel.querySelector('#tradingModeContainer');
        if (tradingModeContainer) {
          const currentMode = getCurrentTradingMode();
          const labels = tradingModeContainer.querySelectorAll('.trading-mode-option');
          labels.forEach(label => {
            const radio = label.querySelector('input[type="radio"]');
            const isSelected = radio.value === currentMode;
            label.style.background = isSelected ? '#007bff' : '#f8f9fa';
            label.style.color = isSelected ? 'white' : '#333';
            label.style.borderColor = isSelected ? '#007bff' : '#dee2e6';
            radio.checked = isSelected;
          });
        }
        if (force || globals.hasMarketItemUpdate) {
          const itemsContainer = panel.querySelector('.Inventory_items__6SXv0');
          if (itemsContainer) {
            itemsContainer.innerHTML = GenerateDom(globals.freshnessMarketJson);
            globals.hasMarketItemUpdate = false;
          }
        }
      });
    }

    const supportActionType = ["/action_types/milking", "/action_types/foraging", "/action_types/woodcutting", "/action_types/cheesesmithing", "/action_types/crafting", "/action_types/tailoring", "/action_types/cooking", "/action_types/brewing"
    // "/action_types/alchemy",
    // "/action_types/enhancing",
    // "/action_types/combat",
    ];
    function LostTrackerExpectEstimate() {
      setTimeout(() => {
        const lootLogList = document.querySelectorAll('.LootLogPanel_actionLoots__3oTid .LootLogPanel_actionLoot__32gl_');
        if (!lootLogList.length || !Array.isArray(globals.lootLog)) return;
        let totalDuration = 0,
          totalProfit = 0,
          totalExcessProfit = 0,
          totalExpectedProfit = 0;
        const lootLogData = [...globals.lootLog].reverse();
        lootLogList.forEach((lootElem, idx) => {
          const logData = lootLogData[idx];
          if (!logData) return;

          // 获取action数据
          const action = globals.initClientData_actionDetailMap[logData.actionHrid];
          if (!action) return;
          if (supportActionType.indexOf(action.type) === -1) return;

          // 计算预期收益
          const expected = ProfitCaculation(action, globals.medianMarketJson);

          // 计算实际收益
          let actualIncome = 0;
          Object.entries(logData.drops).forEach(([itemHash, count]) => {
            const itemHrid = itemHash.split("::")[0];
            const valuation = getItemValuation(itemHrid, globals.medianMarketJson);
            actualIncome += (valuation?.bid || 0) * count;
          });
          actualIncome *= 0.98;

          // 计算持续时间（小时）
          const startTime = new Date(logData.startTime);
          const endTime = new Date(logData.endTime);
          const durationHours = (endTime - startTime) / (1000 * 60 * 60);

          // 计算预期收益
          const expectedIncome = expected.outputPerHour.bid * durationHours;
          const outcome = expected.expendPerHour * durationHours;
          const profit = actualIncome - outcome;
          const expectedProfit = expectedIncome - outcome;
          const excessProfit = actualIncome - expectedIncome;
          const excessPercent = (excessProfit / expectedProfit * 100).toFixed(2);
          totalDuration += endTime - startTime;
          totalProfit += profit;
          totalExcessProfit += excessProfit;
          totalExpectedProfit += expectedProfit;

          // 生成显示元素

          const sign = getSign(excessProfit);
          const content = `支出: ${formatNumber(outcome)} 收入: ${formatNumber(actualIncome)} 预期盈利：${formatNumber(expectedProfit)} 实现盈利: ${formatNumber(profit)} (${sign}${Math.abs(excessPercent)}%)`;
          const colorIntensity = Math.min(Math.abs(excessPercent) / 20, 1) * 0.3 + 0.7;
          const color = excessProfit >= 0 ? `rgb(${Math.floor(255 * colorIntensity)}, 0, 0)` // 红色表示高于预期
          : `rgb(0, ${Math.floor(255 * colorIntensity)}, 0)`; // 绿色表示低于预期
          const span = document.createElement('span');
          span.style.marginLeft = '8px';
          span.style.color = color;
          span.textContent = content;

          // 添加到动作名称后面
          const actionNameSpan = lootElem.querySelector('span:not(.loot-log-index)');
          if (actionNameSpan) {
            actionNameSpan.appendChild(span);
          }
        });
        totalDuration /= 24 * 60 * 60 * 1000;
        const excessPercent = (totalExcessProfit / totalExpectedProfit * 100).toFixed(2);
        const content = `统计时长：${totalDuration.toFixed(2)}天 净利润: ${formatNumber(totalProfit)} (${formatNumber(totalProfit / totalDuration)}/天) 较预期: ${formatNumber(totalExcessProfit / totalDuration)}/天 (${excessPercent}%)`;
        const colorIntensity = Math.min(Math.abs(excessPercent) / 20, 1) * 0.2 + 0.8;
        const color = excessPercent >= 0 ? `rgb(${Math.floor(255 * colorIntensity)}, 0, 0)` // 红色表示高于预期
        : `rgb(0, ${Math.floor(255 * colorIntensity)}, 0)`; // 绿色表示低于预期
        const summarySpan = document.createElement('span');
        summarySpan.style.marginLeft = '8px';
        summarySpan.style.color = color;
        summarySpan.textContent = content;

        // 添加到顶部按钮行
        const buttonContainer = document.querySelector('.LootLogPanel_lootLogPanel__2013X div');
        if (buttonContainer) {
          buttonContainer.appendChild(summarySpan);
        }
      }, 200);
    }

    function hookWS() {
      const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
      const oriGet = dataProperty.get;
      dataProperty.get = hookedGet;
      Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
      function hookedGet() {
        const socket = this.currentTarget;
        if (!(socket instanceof WebSocket)) {
          return oriGet.call(this);
        }
        if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
          return oriGet.call(this);
        }
        const message = oriGet.call(this);
        Object.defineProperty(this, "data", {
          value: message
        }); // Anti-loop

        return handleMessage(message);
      }
    }
    function handleMessage(message) {
      try {
        let obj = JSON.parse(message);
        if (obj) {
          if (obj.type === "init_character_data") {
            globals.initCharacterData_characterSkills = obj.characterSkills;
            globals.initCharacterData_actionTypeDrinkSlotsMap = obj.actionTypeDrinkSlotsMap;
            globals.initCharacterData_characterHouseRoomMap = obj.characterHouseRoomMap;
            globals.initCharacterData_characterItems = obj.characterItems;
            globals.initCharacterData_communityActionTypeBuffsMap = obj.communityActionTypeBuffsMap;
            globals.initCharacterData_consumableActionTypeBuffsMap = obj.consumableActionTypeBuffsMap;
            globals.initCharacterData_houseActionTypeBuffsMap = obj.houseActionTypeBuffsMap;
            globals.initCharacterData_equipmentActionTypeBuffsMap = obj.equipmentActionTypeBuffsMap;
            waitForPannels();
          } else if (obj.type === "init_client_data") {
            globals.initClientData_actionDetailMap = obj.actionDetailMap;
            globals.initClientData_itemDetailMap = obj.itemDetailMap;
            globals.initClientData_openableLootDropMap = obj.openableLootDropMap;
          } else if (obj.type === "market_item_order_books_updated") {
            globals.hasMarketItemUpdate = true;
            globals.freshnessMarketJson.updateDataFromMarket(obj?.marketItemOrderBooks);
            console.log({
              hasMarketItemUpdate: globals.hasMarketItemUpdate,
              obj
            });
          } else if (obj.type === "loot_log_updated") {
            globals.lootLog = obj.lootLog;
            LostTrackerExpectEstimate();
          } else if (obj.type === "skills_updated") {
            setTimeout(() => {
              if (getMwiObj()?.game?.state?.characterSkillMap) {
                globals.initCharacterData_characterSkills = [...getMwiObj()?.game?.state.characterSkillMap.values()];
                refreshProfitPanel(true);
              } else console.error(obj);
            }, 100);
          } else if (obj.type === "community_buffs_updated") {
            globals.initCharacterData_communityActionTypeBuffsMap = obj.communityActionTypeBuffsMap;
            refreshProfitPanel(true);
          } else if (obj.type === "consumable_buffs_updated") {
            globals.initCharacterData_consumableActionTypeBuffsMap = obj.consumableActionTypeBuffsMap;
            refreshProfitPanel(true);
          } else if (obj.type === "equipment_buffs_updated") {
            globals.initCharacterData_equipmentActionTypeBuffsMap = obj.equipmentActionTypeBuffsMap;
            refreshProfitPanel(true);
          } else if (obj.type === "house_rooms_updated") {
            globals.initCharacterData_houseActionTypeBuffsMap = obj.houseActionTypeBuffsMap;
            refreshProfitPanel(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
      return message;
    }
    globals.subscribe((key, value) => {
      if (key === "initClientData_actionDetailMap") {
        const processingMap = {};
        for (const [actionHrid, actionDetail] of Object.entries(value)) {
          const categorys = processingCategory[actionDetail.type];
          if (categorys && categorys.indexOf(actionDetail.category) !== -1) {
            const inputHrid = actionDetail.inputItems[0].itemHrid;
            processingMap[inputHrid] = actionDetail;
          }
        }
        globals.processingMap = processingMap;
      }
      if (key === "initClientData_itemDetailMap") {
        const en2ZhMap = {};
        for (const [hrid, item] of Object.entries(value)) {
          const en = item.name;
          const zh = ZHitemNames[hrid];
          en2ZhMap[en] = zh;
        }
        globals.en2ZhMap = en2ZhMap;
      }
    });
    const profitSettings = validateProfitSettings(JSON.parse(GM_getValue('profitSettings', JSON.stringify({
      materialPriceMode: 'ask',
      productPriceMode: 'bid',
      dataSourceKeys: ['Official', 'MooketApi', 'Mooket'],
      actionCategories: ['milking', 'foraging', 'woodcutting', 'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing']
    }))));
    globals.profitSettings = profitSettings;
    globals.isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言

    const initCD = localStorage.getItem("initClientData");
    if (initCD) {
      const decomCD = LZString.decompressFromUTF16(initCD);
      const obj = JSON.parse(decomCD);
      globals.initClientData_actionDetailMap = obj.actionDetailMap;
      globals.initClientData_itemDetailMap = obj.itemDetailMap;
      globals.initClientData_openableLootDropMap = obj.openableLootDropMap;
    }
    hookWS();
    preFetchData();
    GM_addStyle(GM_getResourceText("bootstrapCSS"));
    window["MWIProfitPanel_Globals"] = globals;

})();
