// ==UserScript==
// @name        TinyGrail Helper Remake
// @description 为小圣杯增加一些小功能
// @namespace   inqb.ga
// @version     2.4.13
// @author      Liaune, Cedar, no1xsyzy (InQβ)
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/(user|character|rakuen\/topiclist|rakuen\/home|rakuen\/topic\/crt).*
// @grant       GM_style
// @downloadURL https://update.greasyfork.org/scripts/408112/TinyGrail%20Helper%20Remake.user.js
// @updateURL https://update.greasyfork.org/scripts/408112/TinyGrail%20Helper%20Remake.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "ul.timelineTabs li a {\n  margin: 2px 0 0 0;\n  padding: 5px 10px 5px 10px;\n}\n\nimg.cover {\n  background-color: transparent;\n}\n\n.assets .my_temple.item .card {\n  box-shadow: 3px 3px 5px #FFEB3B;\n  border: 1px solid #FFC107;\n}\n\nhtml[data-theme='dark'] .assets .my_temple.item .card {\n  box-shadow: 0px 0px 15px #FFEB3B;\n  border: 1px solid #FFC107;\n}\n\n.assets .my_temple.item .name a {\n  font-weight: bold;\n  color: #0084b4;\n}\n\n#grail .temple_list .item {\n  margin: 5px 5px 5px 0;\n  width: 107px;\n}\n\n.assets_box .item {\n  margin: 5px 5px 5px 0;\n  width: 90px;\n}\n\n#lastTemples .assets .item {\n  margin: 5px 5px 5px 0;\n  width: 107px;\n}\n\n.item .card {\n  width: 105px;\n  height: 140px;\n}\n\n.assets_box .item .card {\n  width: 90px;\n  height: 120px;\n}\n\n#grailBox .my_auction,\n#TB_window .my_auction {\n  color: #ffa7cc;\n  margin-right: 5px;\n}\n\n#grailBox .user_auction,\n#TB_window .user_auction {\n  color: #a7e3ff;\n  margin-right: 5px;\n}\n\nhtml[data-theme='dark'] #grailBox .title {\n  background-color: transparent;\n}\n\n#grailBox .trade_box button {\n  min-width: 50px;\n  padding: 0 9px;\n}\n\n#TB_window .text_button {\n  margin: 0 8px 0 0;\n  padding: 0;\n  width: fit-content;\n  height: fit-content;\n  min-width: fit-content;\n  color: #0084B4;\n}\n";
  styleInject(css_248z);

  function launchObserver ({
    parentNode,
    selector,
    failCallback = null,
    successCallback = null,
    stopWhenSuccess = true,
    config = {
      childList: true,
      subtree: true
    }
  }) {
    // if parent node does not exist, return
    if (!parentNode) { return }
    const observeFunc = mutationList => {
      if (!document.querySelector(selector)) {
        if (failCallback) { failCallback(); }
        return
      }
      if (stopWhenSuccess) { observer.disconnect(); }
      if (successCallback) { successCallback(); }
    };
    const observer = new MutationObserver(observeFunc);
    observer.observe(parentNode, config);
  }

  const API = 'https://tinygrail.com/api/';

  function getData (url) {
    if (!url.startsWith('http')) url = API + url;
    return new Promise((resolve, reject) => {
      $__default['default'].ajax({
        url: url,
        type: 'GET',
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          resolve(res);
        },
        error: err => {
          reject(err);
        }
      });
    })
  }

  function postData (url, data) {
    const d = JSON.stringify(data);
    if (!url.startsWith('http')) url = API + url;
    return new Promise((resolve, reject) => {
      $__default['default'].ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: d,
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          resolve(res);
        },
        error: err => {
          reject(err);
        }
      });
    })
  }

  function defineStorage (name, defaultValue) {
    if (!(name in localStorage)) {
      localStorage.setItem(name, JSON.stringify(defaultValue));
    }

    function getter () {
      return JSON.parse(localStorage.getItem(name))
    }

    function setter (v) {
      localStorage.setItem(name, JSON.stringify(v));
    }
    return [getter, setter]
  }

  const [getSettings, setSettings] = defineStorage('TinyGrail_settings', {
    pre_temple: 'on',
    hide_grail: 'off',
    auction_num: 'one',
    merge_order: 'off',
    get_bonus: 'on',
    gallery: 'off',
    auto_fill_temple: 'off'
  });

  const [getItemsSetting, setItemsSetting] = defineStorage('TinyGrail_ItemsSetting', {});

  const ItemsSetting = getItemsSetting();

  // 自动补塔
  function autoFillTemple () {
    if (getSettings().auto_fill_temple !== 'on') { return }
    async function autoFillCosts (autoFillCostList) {
      for (let i = 0; i < autoFillCostList.length; i++) {
        const id = autoFillCostList[i].id;
        const supplyId = autoFillCostList[i].supplyId;
        const cost = autoFillCostList[i].cost;
        await postData(`magic/stardust/${supplyId}/${id}/${cost}/true`, null).then((d) => {
          if (d.State === 0) {
            console.log(`自动补塔 #${id} ${d.Value}`);
          } else {
            console.log(`自动补塔 #${id} ${d.Message}`);
          }
        });
      }
    }

    function checkLostTemple (currentPage) {
      const autoFillCostList = [];
      getData(`chara/user/temple/0/${currentPage}/500`).then((d) => {
        if (d.State === 0) {
          for (let i = 0; i < d.Value.Items.length; i++) {
            const info = {};
            const lv = d.Value.Items[i].CharacterLevel;
            info.id = d.Value.Items[i].CharacterId;
            info.supplyId = ItemsSetting.stardust ? ItemsSetting.stardust[lv] : null;
            info.cost = d.Value.Items[i].Sacrifices - d.Value.Items[i].Assets;
            if (info.cost >= 100 && info.cost <= 250 && info.id !== info.supplyId && info.supplyId) {
              autoFillCostList.push(info);
            }
          }
          autoFillCosts(autoFillCostList);
          if (currentPage < d.Value.TotalPages) {
            checkLostTemple(currentPage + 1);
          }
        }
      });
    }
    checkLostTemple(1);
  }

  const [getAutoTempleList, setAutoTempleList] = defineStorage('TinyGrail_autoTempleList', []);

  function formatDate (date) {
    date = new Date(date);
    return date.format('yyyy-MM-dd hh:mm:ss')
  }
  function formatTime (timeStr) {
    const now = new Date();
    const time = new Date(timeStr) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000;

    let times = (time - now) / 1000;
    let day = 0;
    let hour = 0;
    let minute = 0;
    let second = 0;
    if (times > 0) {
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60)) - Math.floor(times / (60 * 60 * 24)) * 24;
      minute = Math.floor(times / 60) - Math.floor(times / (60 * 60)) * 60;

      if (day > 0) { return `剩余${day}天${hour}小时` } else if (hour > 0) { return `剩余${hour}小时${minute}分钟` } else { return `即将结束 剩余${minute}分钟` }
      // return '即将结束';
    } else {
      times = Math.abs(times);
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60));
      minute = Math.floor(times / 60);
      second = Math.floor(times);

      if (minute < 1) {
        return `${second}s ago`
      } else if (minute < 60) {
        return `${minute}m ago`
      } else if (hour < 24) {
        return `${hour}h ago`
      }

      if (day > 1000) { return 'never' }

      return `[${new Date(timeStr).format('yyyy-MM-dd')}] ${day}d ago`
    }
  }
  function formatNumber (number, decimals, decPoint, thousandsSep) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    const n = !isFinite(+number) ? 0 : +number;
    const prec = !isFinite(+decimals) ? 2 : Math.abs(decimals);
    const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
    const dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
    let s = '';
    // toFixedFix = function (n, prec) {
    //   let k = Math.pow(10, prec);
    //   return '' + Math.ceil(n * k) / k;
    // };
    // s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    s = (prec ? n.toFixed(prec) : '' + Math.round(n)).split('.');
    const re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2');
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec)
  }
  function formatAskPrice (price) {
    if (Number.isInteger(parseFloat(price))) { return price } else { return (price - Math.floor(price)) > 0.5 ? Math.ceil(price) : Math.floor(price) + 0.5 }
  }

  function removeEmpty (array) {
    const arr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i]) { arr.push(array[i]); }
    }
    return arr
  }

  function removeBuildTemple (charaId) {
    const autoTempleList = getAutoTempleList();
    for (let i = 0; i < autoTempleList.length; i++) {
      if (autoTempleList[i].charaId === charaId) {
        autoTempleList.splice(i, 1);
        break
      }
    }
    $__default['default']('#autobuildButton').text('[自动建塔]');
    setAutoTempleList(autoTempleList);
  }

  async function autoBuildTemple (charas) {
    function buildTemple (chara, amount) {
      postData(`chara/sacrifice/${chara.charaId}/${amount}/false`, null).then((d) => {
        if (d.State === 0) {
          console.log(`#${chara.charaId} ${chara.name} 献祭${amount} 获得金额 ₵${d.Value.Balance.toFixed(2)}`);
          $__default['default']('#autobuildButton').text('[自动建塔]');
          removeBuildTemple(chara.charaId);
        } else {
          console.log(`${d.Message}`);
        }
      });
    }

    function postBid (chara, price, amount, Amount, Sacrifices) {
      postData(`chara/bid/${chara.charaId}/${price}/${amount}`, null).then((d) => {
        if (d.Message) { console.log(`#${chara.charaId} ${chara.name} ${d.Message}`); } else {
          console.log(`买入成交 #${chara.charaId} ${chara.name} ${price}*${amount}`);
          if ((Amount + Sacrifices + amount) >= chara.target) { // 持股达到数量，建塔
            buildTemple(chara, chara.target - Sacrifices);
          }
        }
      });
    }

    function getAskin (Asks, lowPrice) {
      let [price, amount] = [0, 0];
      for (let i = 0; i < Asks.length; i++) {
        if (Asks[i].Price > 0 && Asks[i].Price <= lowPrice) {
          amount += Asks[i].Amount;
          price = Asks[i].Price;
        }
      }
      return [price, amount]
    }

    function removeMyAsks (Asks, myAsks) {
      for (let i = 0; i < Asks.length; i++) {
        for (let j = 0; j < myAsks.length; j++) {
          if (formatAskPrice(Asks[i].Price) === formatAskPrice(myAsks[j].Price)) { Asks[i].Amount -= myAsks[j].Amount; }
        }
        if (Asks[i].Amount === 0) { delete Asks[i]; }
      }
      Asks = removeEmpty(Asks);
      return Asks
    }
    for (let i = 0; i < charas.length; i++) {
      const chara = charas[i];
      console.log(`自动建塔 check #${chara.charaId} ${chara.name}`);
      await getData(`chara/user/${chara.charaId}`).then((d) => {
        const myAsks = d.Value.Asks;
        const Amount = d.Value.Amount;
        const Sacrifices = d.Value.Sacrifices;
        if (Sacrifices >= chara.target) {
          removeBuildTemple(chara.charaId);
        } else if ((Amount + Sacrifices) >= chara.target) { // 持股达到数量，建塔
          buildTemple(chara, chara.target - Sacrifices);
        } else {
          getData(`chara/depth/${chara.charaId}`).then((d) => {
            let Asks = d.Value.Asks;
            Asks = removeMyAsks(Asks, myAsks);
            // console.log(Asks);
            const AskPrice = Asks[0] ? Asks[0].Price : 0;
            if (AskPrice && AskPrice <= chara.bidPrice) { // 最低卖单低于买入上限，买入
              const [price, amount] = getAskin(Asks, chara.bidPrice);
              postBid(chara, price, Math.min(amount, chara.target - Amount - Sacrifices), Amount, Sacrifices);
            }
          });
        }
      });
    }
  }

  function autoTemple () {
    const autoTempleList = getAutoTempleList();
    if (autoTempleList.length) { autoBuildTemple(autoTempleList); }
  }

  const [getFillICOList, setFillICOList] = defineStorage('TinyGrail_fillicoList', []);

  function caculateICO (ico) {
    let level = 0;
    let price = 0;
    let amount = 0;
    let next = 100000;
    let nextUser = 15;

    // 人数等级
    const heads = ico.Users;
    let headLevel = Math.floor((heads - 10) / 5);
    if (headLevel < 0) { headLevel = 0; }

    // 资金等级
    while (ico.Total >= next && level < headLevel) {
      level += 1;
      next += Math.pow(level + 1, 2) * 100000;
    }
    if (level) {
      amount = 10000 + (level - 1) * 7500;
      price = ico.Total / amount;
    }
    nextUser = (level + 1) * 5 + 10;

    return {
      Level: level,
      Next: next,
      Price: price,
      Amount: amount,
      Users: nextUser - ico.Users
    }
  }

  function ICOStandard (lv) {
    const users = lv * 5 + 10;
    let total = 100000;
    let level = 1;
    while (lv > level) {
      level++;
      total += Math.pow(level, 2) * 100000;
    }
    return {
      Users: users,
      Total: total
    }
  }

  function closeDialog () {
    $__default['default']('#TB_overlay').remove();
    $__default['default']('#TB_window').remove();
  }

  async function fullfillICO (icoList) {
    var dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="info_box">
<div class="title">自动补款检测中</div>
<div class="result" style="max-height:500px;overflow:auto;"></div>
</div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
    if (!$__default['default']('#TB_window').length) { $__default['default']('body').append(dialog); }
    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    for (let i = 0; i < icoList.length; i++) {
      const Id = icoList[i].Id;
      const charaId = icoList[i].charaId;
      const targetlv = icoList[i].target;
      const target = ICOStandard(targetlv);
      await getData(`chara/${charaId}`).then((d) => {
        if (d.State === 0) {
          const predicted = caculateICO(d.Value);
          if (predicted.Level >= targetlv) {
            console.log(charaId + '总额:' + d.Value.Total + ',已达标，无需补款');
            $__default['default']('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 总额: ${d.Value.Total} ,已达标，无需补款</div>`);
          } else if (predicted.Users <= 0) {
            let offer = predicted.Next - d.Value.Total;
            if (d.Value.Users >= target.Users) {
              offer = target.Total - d.Value.Total;
            }
            offer = Math.max(offer, 5000);
            postData(`chara/join/${Id}/${offer}`, null).then((d) => {
              if (d.State === 0) {
                $__default['default']('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 补款: ${offer}</div>`);
                console.log(charaId + '补款:' + offer);
              } else {
                $__default['default']('.info_box .result').prepend(`<div class="row">#${charaId} ${d.Message}</div>`);
                console.log(d.Message);
              }
            });
          } else {
            $__default['default']('.info_box .result').prepend(`<div class="row">#${charaId} 目标: lv${targetlv} 人数: ${d.Value.Users}, 人数不足，未补款</div>`);
            console.log(charaId + '人数:' + d.Value.Users + ',人数不足，未补款');
          }
        }
      });
    }
  }

  function fillICO () {
    let fillicoList = getFillICOList();
    const icoList = [];
    for (let i = 0; i < fillicoList.length; i++) {
      const endTime = new Date(new Date(fillicoList[i].end) - (new Date().getTimezoneOffset() + 8 * 60) * 60 * 1000);
      const leftTime = (new Date(endTime).getTime() - new Date().getTime()) / 1000; // 剩余时间：秒
      if (leftTime < 60) {
        console.log(`ico check#${fillicoList[i].charaId} -「${fillicoList[i].name}」 目标等级:lv${fillicoList[i].target} ${leftTime}s left`);
        icoList.push(fillicoList[i]);
        delete fillicoList[i];
      }
    }
    fillicoList = removeEmpty(fillicoList);
    setFillICOList(fillicoList);
    if (icoList.length) { fullfillICO(icoList); }
  }

  function getWeeklyShareBonus (callback) {
    if (!confirm('已经周六了，赶紧领取股息吧？')) { return }

    getData('event/share/bonus').then(d => {
      if (d.State === 0) { alert(d.Value); } else { alert(d.Message); }
      callback();
    });
  }

  function getShareBonus () {
    let asiaTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai'
    });
    asiaTime = new Date(asiaTime);
    const Day = asiaTime.getDay();
    if (Day === 6) {
      getData('event/share/bonus/check').then((d) => {
        if (d.State === 0) {
          getWeeklyShareBonus();
        }
      });
    }
  }

  function hideBonusButton () {
    if (!$__default['default']('#bonusButton').length) { return }
    getData('event/share/bonus/test').then((d) => {
      const x = d.Value.Share / 10000;
      const allowance = Math.log10(x + 1) * 30 - x;
      if (d.State === 0 && allowance < 0) { $__default['default']('#bonusButton').remove(); }
      // else $('#shareBonusButton').hide();
    });
  }

  function menuItemClicked (func) {
    $__default['default']('.timelineTabs a').removeClass('focus');
    $__default['default']('.timelineTabs a').removeClass('top_focus');
    $__default['default']('#helperMenu').addClass('focus');
    if (func) { func(1); }
  }

  function openSettings () {
    closeDialog();
    const settings = getSettings();
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tbody><tr><td valign="top" width="50%">主页显示/隐藏小圣杯</td><td valign="top">
<select id="set1"><option value="off" selected="selected">显示</option><option value="on">隐藏</option></select></td></tr>
<tr><td valign="top" width="50%">将自己圣殿排到第一个显示</td><td valign="top">
<select id="set2"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
<tr><td valign="top" width="50%">默认拍卖数量</td><td valign="top">
<select id="set3"><option value="one" selected="selected">1</option><option value="all">全部</option></td></tr>
<tr><td valign="top" width="50%" title="合并同一时间同一价格的历史订单记录">合并历史订单</td><td valign="top">
<select id="set4"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
<tr><td valign="top" width="50%">周六自动提醒领取股息</td><td valign="top">
<select id="set5"><option value="on" selected="selected">是</option><option value="off">否</option></td></tr>
<tr><td valign="top" width="50%">圣殿画廊</td><td valign="top">
<select id="set6"><option value="off" selected="selected">关</option><option value="on">开</option></td></tr>
<tr><td valign="top" width="50%">自动补塔</td><td valign="top">
<select id="set7"><option value="off" selected="selected">关</option><option value="on">开</option></td></tr>
<tr><td valign="top" width="12%"><input class="inputBtn" value="保存" id="submit_setting" type="submit"></td><td valign="top"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
    $__default['default']('body').append(dialog);
    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    $__default['default']('#set1').val(settings.hide_grail);
    $__default['default']('#set2').val(settings.pre_temple);
    $__default['default']('#set3').val(settings.auction_num);
    $__default['default']('#set4').val(settings.merge_order);
    $__default['default']('#set5').val(settings.get_bonus);
    $__default['default']('#set6').val(settings.gallery);
    $__default['default']('#set7').val(settings.auto_fill_temple);
    $__default['default']('#submit_setting').on('click', () => {
      settings.hide_grail = $__default['default']('#set1').val();
      settings.pre_temple = $__default['default']('#set2').val();
      settings.auction_num = $__default['default']('#set3').val();
      settings.merge_order = $__default['default']('#set4').val();
      settings.get_bonus = $__default['default']('#set5').val();
      settings.gallery = $__default['default']('#set6').val();
      settings.auto_fill_temple = $__default['default']('#set7').val();
      setSettings(settings);
      $__default['default']('#submit_setting').val('已保存');
      setTimeout(() => {
        closeDialog();
      }, 500);
    });
  }

  function normalizeAvatar (avatar) {
    if (!avatar) { return '//lain.bgm.tv/pic/user/l/icon.jpg' }

    if (avatar.startsWith('https://tinygrail.oss-cn-hangzhou.aliyuncs.com/')) { return avatar + '!w120' }

    const a = avatar.replace('http://', '//');
    return a
  }

  function cancelBids () {
    if (!confirm('取消全部买单？')) { return }
    $__default['default']('#eden_tpc_list ul').html('');
    getData('chara/user/assets').then((d) => {
      const Balance = d.Value.Balance;
      getData('chara/bids/0/1/1000').then((d) => {
        cancelAllBids(d.Value.Items, Balance);
      });
    });
  }

  async function cancelAllBids (charas, Balance) {
    for (let i = 0; i < charas.length; i++) {
      const id = charas[i].Id;
      const name = charas[i].Name;
      const avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(charas[i].Icon)}')"></span></a>`;
      await getData(`chara/user/${id}`).then((d) => {
        let line = 'line_even';
        if (i % 2 === 0) { line = 'line_odd'; }
        const tid = d.Value.Bids[0].Id;
        const price = d.Value.Bids[0].Price;
        const amount = d.Value.Bids[0].Amount;
        Balance += price * amount;
        postData(`chara/bid/cancel/${tid}`, null).then((d) => {
          const message = `<li class="${line} item_list item_log" data-id="${id}">${avatar}<span class="tag raise">+${formatNumber(price * amount, 2)}</span>
₵${formatNumber(Balance, 2)}<span class="row"><small class="time">取消买单(${tid}) #${id} 「${name}」 ${price}*${amount}</small></span></li>`;
          $__default['default']('#eden_tpc_list ul').prepend(message);
        });
      });
    }
  }

  const [getCharaInitPrice, setCharaInitPrice] = defineStorage('TinyGrail_chara_initPrice', {});

  let charaInitPrice;

  function sellOut () {
    charaInitPrice = getCharaInitPrice();
    $__default['default']('#eden_tpc_list .item_list').removeAttr('onclick');
    $__default['default']('#eden_tpc_list .item_list').each((i, e) => {
      const id = $__default['default'](e).data('id');
      const sellBtn = `<span><small data-id="${id}" class="sell_btn">[卖出]</small></span>`;
      if (!$__default['default'](e).find('.sell_btn').length) {
        $__default['default'](`#eden_tpc_list li[data-id=${id}] .row`).append(sellBtn);
      }
    });
    $__default['default']('.sell_btn').on('click', (e) => {
      const id = $__default['default'](e.target).data('id');
      if (id) {
        const priceTag = $__default['default'](`#eden_tpc_list li[data-id=${id}]`).find('div.tag')[0].innerText.match(/₵([0-9]*(\.[0-9]{1,2})?)/);
        const priceNow = priceTag ? priceTag[1] : 0; // 获取抽奖时买价
        getData(`chara/${id}`).then((d) => {
          const initPrice = charaInitPrice[id] ? charaInitPrice[id].init_price : d.Value.Price;
          const price = Math.max(parseFloat(priceNow), parseFloat(initPrice).toFixed(2), d.Value.Current.toFixed(2));
          getData(`chara/user/${id}`).then((d) => {
            const amount = d.Value.Amount;
            if (amount) {
              postData(`chara/ask/${id}/${price}/${amount}`, null).then((d) => {
                if (d.Message) { console.log(`#${id}: ${d.Message}`); } else { console.log(`卖出委托#${id} ${price}*${amount}`); }
              });
            }
          });
        });
      }
      $__default['default'](`#eden_tpc_list li[data-id=${id}]`).remove();
    });
  }

  const [getFollowList, setFollowList] = defineStorage('TinyGrail_followList', {
    user: '',
    charas: [],
    auctions: []
  });

  function listItemClicked () {
    const link = $__default['default'](this).find('a.avatar').attr('href');
    if (link) {
      if (parent.window.innerWidth < 1200) {
        $__default['default'](parent.document.body).find('#split #listFrameWrapper').animate({
          left: '-450px'
        });
      }
      window.open(link, 'right');
    }
  }

  function renderBalanceLog (item, even) {
    var line = 'line_odd';
    if (even) { line = 'line_even'; }

    var change = '';
    if (item.Change > 0) { change = `<span class="tag raise large">+₵${formatNumber(item.Change, 2)}</span>`; } else if (item.Change < 0) { change = `<span class="tag fall large">-₵${formatNumber(Math.abs(item.Change), 2)}</span>`; }

    var amount = '';
    if (item.Amount > 0) { amount = `<span class="tag new large">+${formatNumber(item.Amount, 0)}</span>`; } else if (item.Amount < 0) { amount = `<span class="tag even large">${formatNumber(item.Amount, 0)}</span>`; }

    var id = '';
    if (item.Type === 4 || item.Type === 5 || item.Type === 6) {
      id = `data-id="${item.RelatedId}"`;
    }

    var log = `<li class="${line} item_list item_log" ${id}>
                <div class="inner">₵${formatNumber(item.Balance, 2)}
                  <small class="grey">${formatTime(item.LogTime)}</small>
                  <span class="row"><small class="time">${item.Description}</small></span>
                </div>
                <span class="tags">
                  ${change}
                  ${amount}
                </span>
              </li>`;
    return log
  }

  function renderCharacterDepth (chara) {
    const depth = `<small class="raise">+${formatNumber(chara.Bids, 0)}</small><small class="fall">-${formatNumber(chara.Asks, 0)}</small><small class="even">${formatNumber(chara.Change, 0)}</small>`;
    return depth
  }

  function renderCharacterTag (chara, item) {
    let flu = '--';
    let tclass = 'even';
    if (chara.Fluctuation > 0) {
      tclass = 'raise';
      flu = `+${formatNumber(chara.Fluctuation * 100, 2)}%`;
    } else if (chara.Fluctuation < 0) {
      tclass = 'fall';
      flu = `${formatNumber(chara.Fluctuation * 100, 2)}%`;
    }

    const tag = `<div class="tag ${tclass}" title="₵${formatNumber(chara.MarketValue, 0)} / ${formatNumber(chara.Total, 0)}">₵${formatNumber(chara.Current, 2)} ${flu}</div>`;
    return tag
  }

  function renderBadge (item, withCrown, withNew, withLevel) {
    let badge = '';

    if (withLevel) {
      badge = `<span class="badge level lv${item.Level}">lv${item.Level}</span>`;
    }
    if (item.Type === 1 && withNew) {
      badge += `<span class="badge new" title="+${formatNumber(item.Rate, 1)}新番加成剩余${item.Bonus}期">×${item.Bonus}</span>`;
    }
    if (item.State > 0 && withCrown) {
      badge += `<span class="badge crown" title="获得${item.State}次萌王">×${item.State}</span>`;
    }
    return badge
  }

  function renderCharacter (item, type, even, showCancel) {
    let line = 'line_odd';
    if (even) { line = 'line_even'; }
    const amount = `<small title="固定资产">${formatNumber(item.Sacrifices, 0)}</small>`;

    const tag = renderCharacterTag(item);
    const depth = renderCharacterDepth(item);
    let id = item.Id;
    if (item.CharacterId) { id = item.CharacterId; }
    const time = item.LastOrder;
    let avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(item.Icon)}')"></span></a>`;
    let cancel = '';
    if (showCancel) { cancel = `<span><small data-id="${id}" class="cancel_auction">[取消]</small></span>`; }
    let badge = renderBadge(item, true, true, true);
    let chara;

    if (type === 'auction') {
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(+${item.Rate.toFixed(2)})</small>
<div class="row"><small class="time">${formatTime(time)}</small>
${cancel}</div></div>${tag}</li>`;
    } else if (type === 'ico') {
      badge = renderBadge(item, false, false, false);
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a>
<div class="row"><small class="time">${formatTime(item.End)}</small><span><small>${formatNumber(item.State, 0)} / ${formatNumber(item.Total, 1)}</small></span>
</div></div><div class="tags tag lv1">ICO进行中</div></li>`;
    } else if (type === 'temple') {
      let costs = '';
      if (item.Assets - item.Sacrifices < 0) {
        costs = `<small class="fall" title="损耗">${item.Assets - item.Sacrifices}</small>
<span><small data-id="${id}" data-lv="${item.CharacterLevel}"  data-cost="${item.Sacrifices - item.Assets}" class="fill_costs">[补充]</small></span>`;
      }
      avatar = `<a href="/rakuen/topic/crt/${id}?trade=true" class="avatar l" target="right"><span class="avatarNeue avatarReSize32 ll" style="background-image:url('${normalizeAvatar(item.Cover)}')"></span></a>`;
      chara = `<li class="${line} item_list" data-id="${id}" data-lv="${item.CharacterLevel}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}<span class="badge lv${item.CharacterLevel}">lv${item.CharacterLevel}</span></a> <small class="grey">(+${item.Rate.toFixed(2)})</small>
<div class="row"><small class="time" title="创建时间">${formatTime(item.Create)}</small><small title="固有资产 / 献祭值">${item.Assets} / ${item.Sacrifices}</small>${costs}</div></div>
<div class="tag lv${item.Level}">${item.Level}级圣殿</div></li>`;
    } else if (!item.Current) {
      const pre = caculateICO(item);
      badge = renderBadge(item, false, false, false);
      // let percent = formatNumber(item.Total / pre.Next * 100, 0);
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(ICO进行中: lv${pre.Level})</small>
<div class="row"><small class="time">${formatTime(item.End)}</small><span><small>${formatNumber(item.Users, 0)}人 / ${formatNumber(item.Total, 1)} / ₵${formatNumber(pre.Price, 2)}</small></span>
${cancel}</div></div><div class="tags tag lv${pre.Level}">ICO进行中</div></li>`;
    } else {
      chara = `<li class="${line} item_list" data-id="${id}">${avatar}<div class="inner">
<a href="/rakuen/topic/crt/${id}?trade=true" class="title avatar l" target="right">${item.Name}${badge}</a> <small class="grey">(+${item.Rate.toFixed(2)} / ${formatNumber(item.Total, 0)} / ₵${formatNumber(item.MarketValue, 0)})</small>
<div class="row"><small class="time">${formatTime(item.LastOrder)}</small>${amount}<span title="买入 / 卖出 / 成交">${depth}</span>
${cancel}</div></div>${tag}</li>`;
    }

    return chara
  }

  function fillCosts (id, lv, cost) {
    closeDialog();
    const ItemsSetting = getItemsSetting();
    const supplyId = ItemsSetting.stardust ? ItemsSetting.stardust[lv] : '';
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title" title="用一个角色的活股或固定资产，给另一个角色的圣殿消耗进行补充，目标人物的等级要小于或等于发动攻击圣殿的人物等级">星光碎片</div>
<div class="desc" style="display:none"></div>
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tr><td>能源：<input id="supplyId" type="number" style="width:60px" value="${supplyId}"></td>
<td>目标：<input id="toSupplyId" type="number" style="width:60px" value="${id}"></td></tr>
<td>类型：<select id="isTemple" style="width:60px"><option value="false">活股</option><option value="true" selected="selected">塔股</option></select></td>
<td>数量：<input id="amount" type="number" style="width:60px" value="${cost}"></td></tr>
<tr><td><input class="inputBtn" value="充能" id="submit_stardust" type="submit"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;

    $__default['default']('body').append(dialog);
    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    if (!supplyId) {
      $__default['default']('#TB_window .desc').text('当前等级的能源角色id未设定，补充过一次之后会记住此等级的能源角色id');
      $__default['default']('#TB_window .desc').show();
    }
    $__default['default']('#submit_stardust').on('click', () => {
      const supplyId = $__default['default']('#supplyId').val();
      const toSupplyId = $__default['default']('#toSupplyId').val();
      const isTemple = $__default['default']('#isTemple').val();
      const amount = $__default['default']('#amount').val();
      if (supplyId) {
        if (!ItemsSetting.stardust) { ItemsSetting.stardust = {}; }
        ItemsSetting.stardust[lv] = supplyId;
        setItemsSetting(ItemsSetting);
        postData(`magic/stardust/${supplyId}/${toSupplyId}/${amount}/${isTemple}`, null).then((d) => {
          closeDialog();
          if (d.State === 0) { alert(d.Value); } else { alert(d.Message); }
        });
      } else { alert('角色id不能为空'); }
    });
  }

  let lastEven = false;

  function loadCharacterList (list, page, total, more, type, showCancel) {
    const followList = getFollowList();
    $__default['default']('#eden_tpc_list ul .load_more').remove();
    if (page === 1) { $__default['default']('#eden_tpc_list ul').html(''); }
    // console.log(list);
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      // console.log(item);
      if (type === 'balance') {
        const log = renderBalanceLog(item, lastEven);
        $__default['default']('#eden_tpc_list ul').append(log);
      } else {
        const chara = renderCharacter(item, type, lastEven, showCancel);
        $__default['default']('#eden_tpc_list ul').append(chara);
      }
      lastEven = !lastEven;
    }
    $__default['default']('.cancel_auction').on('click', (e) => {
      // if (!confirm('确定取消关注？')) return;
      const id = $__default['default'](e.target).data('id').toString();
      if (type === 'chara') {
        followList.charas.splice(followList.charas.indexOf(id), 1);
      } else if (type === 'auction') {
        followList.auctions.splice(followList.auctions.indexOf(id), 1);
      }
      setFollowList(followList);
      $__default['default'](`#eden_tpc_list li[data-id=${id}]`).remove();
    });

    $__default['default']('.fill_costs').on('click', (e) => {
      const id = $__default['default'](e.target).data('id');
      const lv = $__default['default'](e.target).data('lv');
      const cost = $__default['default'](e.target).data('cost');
      fillCosts(id, lv, cost);
      $__default['default'](e.target).remove();
    });

    $__default['default']('#eden_tpc_list .item_list').on('click', listItemClicked);
    if (page !== total && total > 0) {
      const loadMore = `<li class="load_more"><button id="loadMoreButton" class="load_more_button" data-page="${page + 1}">[加载更多]</button></li>`;
      $__default['default']('#eden_tpc_list ul').append(loadMore);
      $__default['default']('#loadMoreButton').on('click', function () {
        const page = $__default['default'](this).data('page');
        if (more) { more(page); }
      });
    } else {
      let noMore = '暂无数据';
      if (total > 0) { noMore = '加载完成'; }

      $__default['default']('#eden_tpc_list ul').append(`<li class="load_more sub">[${noMore}]</li>`);
    }
  }

  function loadFollowChara (page) {
    const followList = getFollowList();
    const start = 50 * (page - 1);
    const ids = followList.charas.slice(start, start + 50);
    const totalPages = Math.ceil(followList.charas.length / 50);
    postData('chara/list', ids.map(x => +x)).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value, page, totalPages, loadFollowChara, 'chara', true);
      }
    });
  }

  function loadMyICO (page) {
    getData(`chara/user/initial/0/${page}/50`).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value.Items, d.Value.CurrentPage, d.Value.TotalPages, loadMyICO, 'ico', false);
      }
    });
  }

  function loadMyTemple (page) {
    getData(`chara/user/temple/0/${page}/50`).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value.Items, d.Value.CurrentPage, d.Value.TotalPages, loadMyTemple, 'temple', false);
        if (page === 1) {
          $__default['default']('#eden_tpc_list ul').prepend('<li id="lostTemple" class="line_odd item_list" style="text-align: center;">[查看受损圣殿]</li>');
          $__default['default']('#lostTemple').on('click', function () {
            $__default['default']('#eden_tpc_list ul').html('');
            loadLostTemple(1);
          });
        }
      }
    });
  }

  function loadLostTemple (page) {
    const lostTemples = [];
    getData(`chara/user/temple/0/${page}/500`).then((d) => {
      if (d.State === 0) {
        for (let i = 0; i < d.Value.Items.length; i++) {
          if (d.Value.Items[i].Assets - d.Value.Items[i].Sacrifices < 0) { lostTemples.push(d.Value.Items[i]); }
        }
        loadCharacterList(lostTemples, 2, 2, loadLostTemple, 'temple', false);
      }
      if (page < d.Value.TotalPages) {
        page++;
        loadLostTemple(page);
      }
    });
  }

  function loadScratch () {
    const ItemsSetting = getItemsSetting();
    $__default['default']('#eden_tpc_list ul').html('');
    $__default['default']('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[刮刮乐]</li>');
    const scratchResults = [];
    const scratchIds = [];
    const chaosCubeResults = [];
    const chaosCubeIds = [];
    scratch();

    function scratch () {
      getData('event/scratch/bonus2').then((d) => {
        if (d.State === 0) {
          for (let i = 0; i < d.Value.length; i++) {
            scratchResults.push(d.Value[i]);
            scratchIds.push(d.Value[i].Id);
          }
          if (!d.Value.length) {
            scratchResults.push(d.Value);
            scratchIds.push(d.Value.Id);
          }
          scratch();
        } else {
          postData('chara/list', scratchIds.map(x => +x)).then((d) => {
            for (let i = 0; i < d.Value.length; i++) {
              d.Value[i].Sacrifices = scratchResults[i].Amount;
              d.Value[i].Current = scratchResults[i].SellPrice;
            }
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
            $__default['default']('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[混沌魔方]</li>');
            chaosCube();
          });
        }
      });
    }

    function chaosCube () {
      const templeId = ItemsSetting.chaosCube;
      if (templeId) {
        postData(`magic/chaos/${templeId}`, null).then((d) => {
          console.log(d);
          if (d.State === 0) {
            for (let i = 0; i < d.Value.length; i++) {
              chaosCubeResults.push(d.Value[i]);
              chaosCubeIds.push(d.Value[i].Id);
            }
            if (!d.Value.length) {
              chaosCubeResults.push(d.Value);
              chaosCubeIds.push(d.Value.Id);
            }
            chaosCube();
          } else {
            if (d.Message !== '今日已超过使用次数限制或资产不足。') {
              alert(d.Message);
              chaosCube();
            } else {
              postData('chara/list', chaosCubeIds.map(x => +x)).then((d) => {
                for (let i = 0; i < d.Value.length; i++) {
                  d.Value[i].Sacrifices = chaosCubeResults[i].Amount;
                  d.Value[i].Current = chaosCubeResults[i].SellPrice;
                }
                loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
              });
            }
          }
        });
      } else { alert('未设置施放混沌魔方的圣殿，请先在角色圣殿施放一次混沌魔方即可完成预设'); }
    }
  }

  function loadMagic () {
    closeDialog();
    const ItemsSetting = getItemsSetting();
    const templeId = ItemsSetting.chaosCube || '';
    const monoId = ItemsSetting.guidepost ? ItemsSetting.guidepost.monoId : '';
    const toMonoId = ItemsSetting.guidepost ? ItemsSetting.guidepost.toMonoId : '';
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tr><td title="消耗圣殿10点固定资产，获取随机角色10-100股随机数量">混沌魔方</td>
<td>炮塔：<input id="chaosCube" type="number" style="width:60px" value="${templeId}"></td><td></td>
<td><input class="inputBtn" value="发射" id="submit_chaosCube" type="submit"></td></tr>
<tr><td title="消耗圣殿100点固定资产，获取指定股票10-100股随机数量，目标人物的等级要小于或等于发动攻击圣殿的人物等级">虚空道标</td>
<td>炮塔：<input id="monoId" type="number" style="width:60px" value="${monoId}"></td>
<td>目标：<input id="toMonoId" type="number" style="width:60px" value="${toMonoId}"></td>
<td><input class="inputBtn" value="发射" id="submit_guidepost" type="submit"></td></tr>
<tr><td title="用一个角色的活股或固定资产，给另一个角色的圣殿消耗进行补充，目标人物的等级要小于或等于发动攻击圣殿的人物等级">星光碎片</td>
<td>能源：<input id="supplyId" type="number" style="width:60px"></td>
<td>目标：<input id="toSupplyId" type="number" style="width:60px"></td></tr>
<td></td><td>类型：<select id="isTemple" style="width:60px"><option value="false">活股</option><option value="true" selected="selected">塔股</option></select></td>
<td>数量：<input id="amount" type="number" style="width:60px" value="100"></td>
<td><input class="inputBtn" value="充能" id="submit_stardust" type="submit"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;

    $__default['default']('body').append(dialog);
    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    $__default['default']('#submit_chaosCube').on('click', () => {
      const templeId = $__default['default']('#chaosCube').val();
      ItemsSetting.chaosCube = templeId;
      setItemsSetting(ItemsSetting);
      postData(`magic/chaos/${templeId}`, null).then((d) => {
        closeDialog();
        console.log(d);
        if (d.State === 0) {
          $__default['default']('#eden_tpc_list ul').html('');
          $__default['default']('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[混沌魔方]</li>');
          const Id = d.Value.Id;
          const Amount = d.Value.Amount;
          const SellPrice = d.Value.SellPrice;
          postData('chara/list', [Id].map(x => +x)).then((d) => {
            for (let i = 0; i < d.Value.length; i++) {
              d.Value[i].Sacrifices = Amount;
              d.Value[i].Current = SellPrice;
            }
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
          });
        } else { alert(d.Message); }
      });
    });
    $__default['default']('#submit_guidepost').on('click', () => {
      const monoId = $__default['default']('#monoId').val();
      const toMonoId = $__default['default']('#toMonoId').val();
      ItemsSetting.guidepost = {
        monoId: monoId,
        toMonoId: toMonoId
      };
      setItemsSetting(ItemsSetting);
      postData(`magic/guidepost/${monoId}/${toMonoId}`, null).then((d) => {
        closeDialog();
        console.log(d);
        if (d.State === 0) {
          $__default['default']('#eden_tpc_list ul').html('');
          $__default['default']('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[虚空道标]</li>');
          const Id = d.Value.Id;
          const Amount = d.Value.Amount;
          const SellPrice = d.Value.SellPrice;
          postData('chara/list', [Id].map(x => +x)).then((d) => {
            for (let i = 0; i < d.Value.length; i++) {
              d.Value[i].Sacrifices = Amount;
              d.Value[i].Current = SellPrice;
            }
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
          });
        } else { alert(d.Message); }
      });
    });
    $__default['default']('#submit_stardust').on('click', () => {
      const supplyId = $__default['default']('#supplyId').val();
      const toSupplyId = $__default['default']('#toSupplyId').val();
      const isTemple = $__default['default']('#isTemple').val();
      const amount = $__default['default']('#amount').val();
      postData(`magic/stardust/${supplyId}/${toSupplyId}/${amount}/${isTemple}`, null).then((d) => {
        closeDialog();
        console.log(d);
        if (d.State === 0) {
          alert(d.Value);
          $__default['default']('#eden_tpc_list ul').html('');
          $__default['default']('#eden_tpc_list ul').append('<li class="line_odd item_list" style="text-align: center;">[星光碎片]</li>');
          postData('chara/list', [supplyId, toSupplyId].map(x => +x)).then((d) => {
            loadCharacterList(d.Value, 2, 2, loadScratch, 'chara', false);
          });
        } else { alert(d.Message); }
      });
    });
  }

  let charasList = [];

  function setCharasList (lst) {
    charasList = lst;
  }

  function loadTemperaryList (page) {
    const start = 50 * (page - 1);
    const ids = charasList.slice(start, start + 50);
    console.log(ids);
    const totalPages = Math.ceil(charasList.length / 50);
    postData('chara/list', ids.map(x => +x)).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value, page, totalPages, loadTemperaryList, 'chara', false);
      }
    });
  }

  async function autoJoinICO (icoList) {
    for (let i = 0; i < icoList.length; i++) {
      const charaId = icoList[i].CharacterId;
      await getData(`chara/${charaId}`).then((d) => {
        if (d.State === 0) {
          const offer = 5000;
          const Id = d.Value.Id;
          if (d.Value.Total < 100000 && d.Value.Users < 15) {
            getData(`chara/initial/${Id}`).then((d) => {
              if (d.State === 1) {
                postData(`chara/join/${Id}/${offer}`, null).then((d) => {
                  if (d.State === 0) {
                    console.log(`#${charaId} 追加注资成功。`);
                    $__default['default'](`#eden_tpc_list li[data-id=${charaId}] .row`).append(`<small class="raise">+${offer}</small>`);
                  }
                });
              }
            });
          }
        }
      });
    }
  }

  async function joinAuctions (ids) {
    for (let i = 0; i < ids.length; i++) {
      const Id = ids[i];
      await postData('chara/auction/list', [Id]).then((d) => {
        let myAuctionAmount = 0;
        if (d.Value.length) { myAuctionAmount = d.Value[0].Amount; }
        if (myAuctionAmount) {
          const myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${formatNumber(d.Value[0].Price, 2)} / ${myAuctionAmount}</span>`;
          $__default['default'](`.item_list[data-id=${Id}] .time`).after(myAuction);
        } else {
          getData(`chara/user/${Id}/tinygrail/false`).then((d) => {
            const price = Math.ceil(d.Value.Price * 100) / 100;
            const amount = 1;
            postData(`chara/auction/${Id}/${price}/${amount}`, null).then((d) => {
              if (d.State === 0) {
                const myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${price} / ${amount}</span>`;
                $__default['default'](`.item_list[data-id=${Id}] .time`).after(myAuction);
              } else {
                console.log(d.Message);
              }
            });
          });
        }
      });
    }
  }

  async function loadValhalla (ids) {
    for (let i = 0; i < ids.length; i++) {
      const Id = ids[i];
      await getData(`chara/user/${Id}/tinygrail/false`).then((d) => {
        const valhalla = `<small class="even" title="拍卖底价 / 拍卖数量">₵${formatNumber(d.Value.Price, 2)} / ${d.Value.Amount}</small>`;
        $__default['default'](`.cancel_auction[data-id=${Id}]`).before(valhalla);
      });
    }
  }

  function loadUserAuctions (d) {
    d.Value.forEach((a) => {
      if (a.State !== 0) {
        const userAuction = `<span class="user_auction auction_tip" title="竞拍人数 / 竞拍数量">${formatNumber(a.State, 0)} / ${formatNumber(a.Type, 0)}</span>`;
        $__default['default'](`.item_list[data-id=${a.CharacterId}] .time`).after(userAuction);
        $__default['default']('#auctionHistoryButton').before(userAuction);
        $__default['default']('#TB_window.dialog .desc').append(userAuction);
      }
      if (a.Price !== 0) {
        const myAuction = `<span class="my_auction auction_tip" title="出价 / 数量">₵${formatNumber(a.Price, 2)} / ${formatNumber(a.Amount, 0)}</span>`;
        $__default['default'](`.item_list[data-id=${a.CharacterId}] .time`).after(myAuction);
        $__default['default']('#auctionHistoryButton').before(myAuction);
        $__default['default']('#TB_window.dialog .desc').append(myAuction);
      }
    });
  }

  function loadFollowAuction (page) {
    const followList = getFollowList();
    const start = 20 * (page - 1);
    const ids = followList.auctions.slice(start, start + 20);
    const totalPages = Math.ceil(followList.auctions.length / 20);
    postData('chara/list', ids.map(x => +x)).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value, page, totalPages, loadFollowAuction, 'auction', true);
        postData('chara/auction/list', ids).then((d) => {
          loadUserAuctions(d);
        });
        loadValhalla(ids);
      }
    });
  }

  const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="bibeBox" style="padding:10px">
<label>在超展开左边创建角色列表 请输入角色url或id，如 https://bgm.tv/character/29282 或 29282，一行一个</label>
<textarea rows="10" class="quick" name="urls"></textarea>
<input class="inputBtn" value="创建列表" id="submit_list" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="关注角色" id="add_follow" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="关注竞拍" id="add_auction" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="参与竞拍" id="join_auction" type="submit" style="padding: 3px 5px;">
<input class="inputBtn" value="参与ICO" id="join_ico" type="submit" style="padding: 3px 5px;">
</div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;

  function getCharasList () {
    const charasList = [];
    const charas = $__default['default']('.bibeBox textarea').val().split('\n');
    for (let i = 0; i < charas.length; i++) {
      try {
        const charaId = charas[i].match(/(character\/|crt\/)?(\d+)/)[2];
        charasList.push(charaId);
      } catch (e) {}  }
    setCharasList(charasList);
  }

  function creatTemporaryList (page) {
    closeDialog();

    $__default['default']('body').append(dialog);
    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    $__default['default']('#submit_list').on('click', () => {
      getCharasList();
      loadTemperaryList(1);
      closeDialog();
    });
    $__default['default']('#add_follow').on('click', () => {
      const charasList = getCharasList();
      for (let i = 0; i < charasList.length; i++) {
        const followList = getFollowList();
        const charaId = charasList[i].toString();
        if (followList.charas.includes(charaId)) {
          followList.charas.splice(followList.charas.indexOf(charaId), 1);
          followList.charas.unshift(charaId);
        } else {
          followList.charas.unshift(charaId);
        }
        setFollowList(followList);
      }
      loadFollowChara(1);
      closeDialog();
    });

    $__default['default']('#add_auction').on('click', () => {
      getCharasList();
      for (let i = 0; i < charasList.length; i++) {
        const followList = getFollowList();
        const charaId = charasList[i].toString();
        if (followList.auctions.includes(charaId)) {
          followList.auctions.splice(followList.auctions.indexOf(charaId), 1);
          followList.auctions.unshift(charaId);
        } else {
          followList.auctions.unshift(charaId);
        }
        setFollowList(followList);
      }
      loadFollowAuction(1);
      closeDialog();
    });

    $__default['default']('#join_auction').on('click', () => {
      getCharasList();
      $__default['default']('#eden_tpc_list ul').html('');
      loadTemperaryList(1);
      joinAuctions(charasList);
      closeDialog();
    });

    $__default['default']('#join_ico').on('click', () => {
      getCharasList();
      postData('chara/list', charasList.map(x => +x)).then((d) => {
        autoJoinICO(d.Value);
        loadTemperaryList(1);
        closeDialog();
      });
    });
  }

  function loadBalance () {
    closeDialog();
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<table align="center" width="98%" cellspacing="0" cellpadding="5" class="settings">
<tr><td>类型：<select id="balanceType" style="width:100px">
<option value="0" selected="selected">全部</option>
<option value="18">魔法道具</option>
<option value="1">彩票刮刮乐</option>
<option value="2">参与ICO</option>
<option value="3">ICO退款</option>
<option value="13">ICO结果</option>
<option value="4">买入委托</option>
<option value="5">取消买入</option>
<option value="6">卖出委托</option>
<option value="8">取消卖出</option>
<option value="7">交易印花税</option>
<option value="9">资产重组</option>
<option value="10">参与竞拍</option>
<option value="11">修改竞拍</option>
<option value="12">竞拍结果</option>
<option value="14">个人所得税</option>
<option value="16">红包</option>
</select></td>
<td>第<input id="page" type="number" style="width:30px" value="1">页</td>
<td>每页<input id="amount" type="number" style="width:50px" value="1000">条</td>
<td><input class="inputBtn" value="查询" id="submit_search" type="submit"></td></tr>
</tbody></table>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>
</div>`;
    $__default['default']('body').append(dialog);
    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    $__default['default']('#submit_search').on('click', () => {
      const Type = +$__default['default']('#balanceType').val();
      const page = $__default['default']('#page').val();
      const amount = $__default['default']('#amount').val();
      const Logs = [];
      getData(`chara/user/balance/${page}/${amount}`).then((d) => {
        closeDialog();
        if (d.State === 0) {
          for (let i = 0; i < d.Value.Items.length; i++) {
            if (d.Value.Items[i].Type === Type || Type === 0) { Logs.push(d.Value.Items[i]); }
          }
          loadCharacterList(Logs, 1, 1, loadBalance, 'balance', false);
          $__default['default']('#eden_tpc_list ul li').on('click', function (e) {
            var id = $__default['default'](e.target).data('id');
            if (id == null) {
              var result = $__default['default'](e.target).find('small.time').text().match(/#(\d+)/);
              if (result && result.length > 0) { id = result[1]; }
            }

            if (id != null && id.length > 0) {
              if (parent.window.innerWidth < 1200) {
                $__default['default'](parent.document.body).find('#split #listFrameWrapper').animate({
                  left: '-450px'
                });
              }
              window.open(`/rakuen/topic/crt/${id}?trade=true`, 'right');
            }
          });
        }
      });
    });
  }

  function loadAutoBuild (page) {
    const autoTempleList = getAutoTempleList();
    autoBuildTemple(autoTempleList);
    const charas = [];
    for (let i = 0; i < autoTempleList.length; i++) { charas.push(autoTempleList[i].charaId); }
    const start = 50 * (page - 1);
    const ids = charas.slice(start, start + 50);
    const totalPages = Math.ceil(charas.length / 50);
    postData('chara/list', ids.map(x => +x)).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value, page, totalPages, loadAutoBuild, 'chara', false);
      }
    });
  }

  function loadAutoFillICO (page) {
    const fillicoList = getFillICOList();
    const charas = [];
    for (let i = 0; i < fillicoList.length; i++) { charas.push(fillicoList[i].charaId); }
    const start = 50 * (page - 1);
    const ids = charas.slice(start, start + 50);
    const totalPages = Math.ceil(charas.length / 50);
    postData('chara/list', ids.map(x => +x)).then((d) => {
      if (d.State === 0) {
        loadCharacterList(d.Value, page, totalPages, loadAutoBuild, 'chara_ico', false);
      }
    });
  }

  function loadHelperMenu () {
    const item = `<li><a href="#" id="helperMenu" class="top">助手</a>
<ul>
<li><a href="#" id="temporaryList">临时列表</a></li>
<li><a href="#" id="followChara">关注角色</a></li>
<li><a href="#" id="followAuction">关注竞拍</a></li>
<li><a href="#" id="myICO">我的ICO</a></li>
<li><a href="#" id="myTemple">我的圣殿</a></li>
<li><a href="#" id="scratch">抽奖</a></li>
<li><a href="#" id="magic">魔法道具</a></li>
<li><a href="#" id="balance">资金日志分类</a></li>
<li><a href="#" id="sell">卖出</a></li>
<li><a href="#" id="autoBuild">自动建塔</a></li>
<li><a href="#" id="autoICO">自动补款</a></li>
<li><a href="#" id="cancelBids">取消买单</a></li>
<li><a href="#" id="settings">设置</a></li>
</ul>
</li>`;
    $__default['default']('.timelineTabs').append(item);

    $__default['default']('#followChara').on('click', function () {
      menuItemClicked(loadFollowChara);
    });

    $__default['default']('#followAuction').on('click', function () {
      menuItemClicked(loadFollowAuction);
    });

    $__default['default']('#myICO').on('click', function () {
      menuItemClicked(loadMyICO);
    });

    $__default['default']('#myTemple').on('click', function () {
      menuItemClicked(loadMyTemple);
    });

    $__default['default']('#balance').on('click', function () {
      menuItemClicked(loadBalance);
    });

    $__default['default']('#autoBuild').on('click', function () {
      menuItemClicked(loadAutoBuild);
    });

    $__default['default']('#autoICO').on('click', function () {
      menuItemClicked(loadAutoFillICO);
    });

    $__default['default']('#temporaryList').on('click', function () {
      menuItemClicked(creatTemporaryList);
    });

    $__default['default']('#scratch').on('click', function () {
      menuItemClicked(loadScratch);
    });

    $__default['default']('#magic').on('click', function () {
      menuItemClicked(loadMagic);
    });

    $__default['default']('#sell').on('click', function () {
      menuItemClicked(sellOut);
    });

    $__default['default']('#cancelBids').on('click', function () {
      menuItemClicked(cancelBids);
    });

    $__default['default']('#settings').on('click', function () {
      menuItemClicked(openSettings);
    });
  }

  function showGallery () {
    const settings = getSettings();
    if (settings.gallery === 'on') {
      let index = 0;
      $__default['default']('body').on('keydown', function (e) {
        switch (event.keyCode) {
          case 37:
            closeDialog();
            $__default['default']('.item .card')[index - 1].click();
            break
          case 39:
            closeDialog();
            $__default['default']('.item .card')[index + 1].click();
            break
        }
      });
      $__default['default']('body').on('touchstart', '#TB_window.temple', function (e) {
        let touch = e.originalEvent;
        const startX = touch.changedTouches[0].pageX;
        $__default['default'](this).on('touchmove', function (e) {
          e.preventDefault();
          touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          if (touch.pageX - startX > 20) { // 向左
            closeDialog();
            $__default['default']('.item .card')[index - 1].click();
            $__default['default'](this).off('touchmove');
          } else if (touch.pageX - startX < -20) { // 向右
            closeDialog();
            $__default['default']('.item .card')[index + 1].click();
            $__default['default'](this).off('touchmove');
          }      });
      }).on('touchend', function () {
        $__default['default'](this).off('touchmove');
      });
      setInterval(function () {
        $__default['default']('.item .card').on('click', (e) => {
          index = $__default['default']('.item .card').index(e.currentTarget);
        });
      }, 1000);
    }
  }

  function showHideGrailBox () {
    const settings = getSettings();
    const config = settings.hide_grail;
    if (config === 'on') {
      $__default['default']('#grail').hide();
      setTimeout(() => {
        $__default['default']('#pager1').hide();
      }, 500);
    }
  }

  function cancelAuction (chara) {
    let message = '确定取消竞拍？';
    const Day = new Date().getDay();
    if (Day === 6) { message = '周六取消竞拍将收取20%税，确定取消竞拍？'; }
    if (!confirm(message)) { return }
    $__default['default']('#TB_window .loading').show();
    $__default['default']('#TB_window .label').hide();
    $__default['default']('#TB_window .desc').hide();
    $__default['default']('#TB_window .trade').hide();
    getData('chara/user/auction/1/100').then((d) => {
      let id = 0;
      for (let i = 0; i < d.Value.Items.length; i++) {
        if (chara.Id === d.Value.Items[i].CharacterId) {
          id = d.Value.Items[i].Id;
          break
        }
      }
      if (id) {
        postData(`chara/auction/cancel/${id}`, null).then((d) => {
          $__default['default']('#TB_window .loading').hide();
          $__default['default']('#TB_window .label').show();
          $__default['default']('#TB_window .desc').show();
          $__default['default']('#TB_window .trade').show();
          if (d.State === 0) {
            $__default['default']('#TB_window .trade').hide();
            $__default['default']('#TB_window .label').hide();
            $__default['default']('#TB_window .desc').text('取消竞拍成功');
          } else { alert(d.Message); }
        });
      } else {
        $__default['default']('#TB_window .loading').hide();
        $__default['default']('#TB_window .desc').text('未找到竞拍角色');
      }
    });
  }

  function bidAuction (chara) {
    $__default['default']('#TB_window .loading').show();
    $__default['default']('#TB_window .label').hide();
    $__default['default']('#TB_window .desc').hide();
    $__default['default']('#TB_window .trade').hide();
    const price = $__default['default']('.trade.auction .price').val();
    const amount = $__default['default']('.trade.auction .amount').val();
    postData(`chara/auction/${chara.Id}/${price}/${amount}`, null).then((d) => {
      $__default['default']('#TB_window .loading').hide();
      $__default['default']('#TB_window .label').show();
      $__default['default']('#TB_window .desc').show();
      $__default['default']('#TB_window .trade').show();
      if (d.State === 0) {
        const message = d.Value;
        $__default['default']('#TB_window .trade').hide();
        $__default['default']('#TB_window .label').hide();
        $__default['default']('#TB_window .desc').text(message);
      } else {
        alert(d.Message);
      }
    });
  }

  function openAuctionDialog (chara, auction) {
    let auctionNum = chara.State;
    if (getSettings().auction_num === 'one') { auctionNum = 1; }
    const price = Math.ceil(chara.Price * 100) / 100;
    const total = formatNumber(price * chara.State, 2);
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title" title="拍卖底价 / 竞拍数量 / 流通股份">股权拍卖 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Price, 2)} / ${chara.State} / ${chara.Total}</div>
<div class="desc">
<button id="fullfill_auction" class="text_button" title="当竞拍数量未满时补满数量">[补满]</button>
<button id="change_amount" class="text_button" title="按修改后的价格确定数量，保持总价不变">[改量]</button>
<button id="change_price" class="text_button" title="按修改后的数量确定价格，保持总价不变">[改价]</button>
</div><div class="label">
<span class="input">价格</span><span class="input">数量</span><span class="total">合计 -₵${total}</span>
</div><div class="trade auction">
<input class="price" type="number" style="width: 100px" min="${price}" value="${price}">
<input class="amount" type="number" style="width: 100px" min="1" max="${chara.State}" value="${auctionNum}">
<button id="bidAuctionButton" class="active">确定</button><button id="cancelAuctionButton" style="display: none">取消竞拍</button></div>
<div class="loading" style="display:none"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
    $__default['default']('body').append(dialog);
    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);

    $__default['default']('.assets_box .auction_tip').remove();
    loadUserAuctions(auction);

    $__default['default']('#cancelAuctionButton').on('click', function () {
      cancelAuction(chara);
    });
    $__default['default']('#bidAuctionButton').on('click', function () {
      bidAuction(chara);
    });

    if (!auction.Value.length) {
      auction.Value = [{
        Price: 0,
        Amount: 0,
        Type: 0,
        State: 0
      }];
    }

    if (auction.Value[0].Price) {
      $__default['default']('.trade.auction .price').val(auction.Value[0].Price);
      $__default['default']('.trade.auction .amount').val(auction.Value[0].Amount);
      const total = formatNumber(auction.Value[0].Price * auction.Value[0].Amount, 2);
      $__default['default']('#TB_window .label .total').text(`合计 -₵${total}`);
      $__default['default']('#cancelAuctionButton').show();
    }

    $__default['default']('#TB_window .auction input').on('keyup', () => {
      const price = $__default['default']('.trade.auction .price').val();
      const amount = $__default['default']('.trade.auction .amount').val();
      const total = formatNumber(price * amount, 2);
      $__default['default']('#TB_window .label .total').text(`合计 -₵${total}`);
    });
    $__default['default']('#fullfill_auction').on('click', function () {
      const totalAuction = chara.State;
      const amount = totalAuction - auction.Value[0].Type + auction.Value[0].Amount;
      const price = Math.ceil(chara.Price * 100) / 100;
      $__default['default']('.trade.auction .price').val(price);
      $__default['default']('.trade.auction .amount').val(amount);
      $__default['default']('#TB_window .label .total').text(`合计 -₵${formatNumber(price * amount, 2)}`);
    });
    $__default['default']('#change_amount').on('click', function () {
      const price = parseFloat($__default['default']('.trade.auction .price').val());
      const total = auction.Value[0].Price * auction.Value[0].Amount;
      const amount = Math.ceil(total / price);
      $__default['default']('.trade.auction .amount').val(amount);
      $__default['default']('#TB_window .label .total').text(`合计 -₵${formatNumber(price * amount, 2)}`);
    });
    $__default['default']('#change_price').on('click', function () {
      const amount = parseInt($__default['default']('.trade.auction .amount').val());
      const total = auction.Value[0].Price * auction.Value[0].Amount;
      const price = Math.ceil(total / amount * 100) / 100;
      $__default['default']('.trade.auction .price').val(price);
      $__default['default']('#TB_window .label .total').text(`合计 -₵${formatNumber(price * amount, 2)}`);
    });
  }

  function showTopWeek () {
    getData('chara/topweek').then((d) => {
      let totalExtra = 0;
      let totalPeople = 0;
      for (let i = 0; i < d.Value.length; i++) {
        totalExtra += d.Value[i].Extra;
        totalPeople += d.Value[i].Type;
      }
      console.log(totalExtra + '/' + totalPeople + '=' + totalExtra / totalPeople);
      $__default['default']('#topWeek .auction_button').hide();

      for (let i = 0; i < d.Value.length; i++) {
        const score = d.Value[i].Extra + d.Value[i].Type * totalExtra / totalPeople;
        const tag = $__default['default']('#topWeek .assets .item')[i].querySelector('.tag');
        $__default['default'](tag).attr('title', '综合得分:' + formatNumber(score, 2));
        const average = (d.Value[i].Extra + d.Value[i].Price * d.Value[i].Sacrifices) / d.Value[i].Assets;
        const buff = $__default['default']('#topWeek .assets .item')[i].querySelector('.buff');
        $__default['default'](buff).attr('title', '平均拍价:' + formatNumber(average, 2));
        const charaId = d.Value[i].CharacterId;
        const auctionButton = $__default['default'](`<div class="name auction" data-id="${charaId}">
<span title="竞拍人数 / 竞拍数量 / 拍卖总数">${d.Value[i].Type} / ${d.Value[i].Assets} / ${d.Value[i].Sacrifices}</span></div>`);
        $__default['default']($__default['default']('#topWeek .assets .item')[i]).append(auctionButton);
        const chara = {
          Id: d.Value[i].CharacterId,
          Name: d.Value[i].CharacterName,
          Price: d.Value[i].Price,
          State: d.Value[i].Sacrifices,
          Total: 0
        };
        auctionButton.on('click', () => {
          postData('chara/auction/list', [charaId]).then((d) => {
            openAuctionDialog(chara, d);
          });
        });
      }
    });
  }

  function fixAuctions (chara) {
    getData(`chara/user/${chara.Id}/tinygrail/false`).then((d) => {
      chara.Price = d.Value.Price;
      chara.State = d.Value.Amount;
      let button = '<button id="auctionButton2" class="text_button">[萌王投票]</button>';
      if (d.State === 0 && d.Value.Amount > 0) { button = '<button id="auctionButton2" class="text_button">[参与竞拍]</button>'; }
      $__default['default']('#buildButton').before(button);
      $__default['default']('#auctionButton').hide();
      postData('chara/auction/list', [chara.Id]).then((d) => {
        loadUserAuctions(d);
        $__default['default']('#auctionButton2').on('click', () => {
          openAuctionDialog(chara, d);
        });
      });
    });
  }

  function openHistoryDialog (chara, page) {
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title">上${page}周拍卖结果 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Current, 2)} / ${formatNumber(chara.Total, 0)}</div>
<div class="desc" style="display:none"></div>
<div class="result" style="display:none; max-height: 500px; overflow: auto;"></div>
<div class="page_inner">
<a id="nextweek" class="p" style="display:none; float: left;margin-bottom: 5px;margin-left: 50px;">后一周</a>
<a id="lastweek" class="p" style="display:none; float: right;margin-bottom: 5px;margin-right: 50px;">前一周</a>
</div>
<div class="loading"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
    $__default['default']('body').append(dialog);

    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    const charaInitPrice = getCharaInitPrice();
    const weekAsMilliseconds = 7 * 24 * 3600 * 1000;
    const templeWeek = Math.floor((new Date() - new Date('2019/10/05')) / weekAsMilliseconds + 1);
    const icoWeek = Math.floor((new Date() - new Date(charaInitPrice[chara.Id].time)) / weekAsMilliseconds + 1);
    const week = Math.min(templeWeek, icoWeek);
    getData(`chara/auction/list/${chara.Id}/${page}`).then((d) => {
      $__default['default']('#TB_window .loading').hide();
      if (d.State === 0 && d.Value.length > 0) {
        let success = 0;
        let total = 0;
        d.Value.forEach((a) => {
          let state = 'even';
          let name = '失败';
          if (a.State === 1) {
            success++;
            total += a.Amount;
            state = 'raise';
            name = '成功';
          }
          const record = `
<div class="row"><span class="time">${formatDate(a.Bid)}</span>
<span class="user"><a target="_blank" href="/user/${a.Username}">${a.Nickname}</a></span>
<span class="price">₵${formatNumber(a.Price, 2)} / ${formatNumber(a.Amount, 0)}</span>
<span class="tag ${state}">${name}</span></div>`;
          $__default['default']('#TB_window .result').append(record);
        });
        $__default['default']('#TB_window .desc').text(`共有${d.Value.length}人参与拍卖，成功${success}人 / ${total}股`);
        $__default['default']('#TB_window .result').show();
      } else {
        $__default['default']('#TB_window .desc').text('暂无拍卖数据');
      }
      $__default['default']('#TB_window .desc').show();
      if (page > 1) { $__default['default']('#nextweek').show(); }
      if (page < week) { $__default['default']('#lastweek').show(); }
      $__default['default']('#nextweek').on('click', () => {
        page--;
        closeDialog();
        openHistoryDialog(chara, page);
      });
      $__default['default']('#lastweek').on('click', () => {
        page++;
        closeDialog();
        openHistoryDialog(chara, page);
      });
    });
  }

  function showAuctionHistory (chara) {
    const button = '<button id="auctionHistorys" class="text_button">[往期拍卖]</button>';
    $__default['default']('#auctionHistoryButton').after(button);
    $__default['default']('#auctionHistoryButton').hide();
    $__default['default']('#auctionHistorys').on('click', () => {
      openHistoryDialog(chara, 1);
    });
  }

  function openTradeHistoryDialog (chara) {
    var dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title">交易历史记录 - #${chara.Id} 「${chara.Name}」 ₵${formatNumber(chara.Current, 2)} / ${formatNumber(chara.Total, 0)}</div>
<div class="result" style="display:none; max-height: 500px; overflow: auto;"></div>
<div class="desc" style="display:none"></div>
<div class="loading"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
    $__default['default']('body').append(dialog);

    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);
    $__default['default']('#TB_overlay').on('click', closeDialog);
    let tradeHistory, totalPages;
    getData(`chara/charts/${chara.Id}/2019-08-08`).then((d) => {
      if (d.State === 0) {
        tradeHistory = d.Value.reverse();
        totalPages = Math.ceil(d.Value.length / 50);
        loadTradeHistory(1);
      }
    });

    function loadTradeHistory (page) {
      $__default['default']('#TB_window .loading').hide();
      $__default['default']('#TB_window .result').show();
      $__default['default']('#TB_window .result').html('');
      const records = tradeHistory.slice(50 * (page - 1), 50 * page);
      if (records.length) {
        for (let i = 0; i < records.length; i++) {
          var record = `<div class="row">
<span class="time" title="交易时间">${formatDate(records[i].Time)}</span>
<span class="price" title="价格">₵${formatNumber((records[i].Price / records[i].Amount), 2)}</span>
<span class="amount" title="数量">${formatNumber(records[i].Amount, 0)}</span>
<span class="price" title="交易额">₵${formatNumber(records[i].Price, 2)}</span>
</div>`;
          $__default['default']('#TB_window .result').append(record);
        }
        $__default['default']('#TB_window .desc').html('');
        $__default['default']('#TB_window .desc').text(`共有${tradeHistory.length}条记录，当前 ${page} / ${totalPages} 页`);

        for (let i = 1; i <= totalPages; i++) {
          const pager = `<span class="page" data-page="${i}">[${i}]</span>`;
          $__default['default']('#TB_window .desc').append(pager);
        }

        $__default['default']('#TB_window .desc .page').on('click', (e) => {
          const page = $__default['default'](e.target).data('page');
          loadTradeHistory(page);
        });

        $__default['default']('#TB_window .result').show();
      } else {
        $__default['default']('#TB_window .desc').text('暂无交易记录');
      }
      $__default['default']('#TB_window .desc').show();
    }
  }

  function showTradeHistory (chara) {
    $__default['default']('#kChartButton').after('<button id="tradeHistoryButton" class="text_button">[交易记录]</button>');
    $__default['default']('#tradeHistoryButton').on('click', () => {
      openTradeHistoryDialog(chara);
    });
  }

  function sellAll (charaId, initPrice) {
    $__default['default']($__default['default']('#grailBox .info .text')[1]).append('<button id="sell_out" class="text_button" title="以发行价全部卖出">[全部卖出]</button>');
    $__default['default']('#sell_out').on('click', function () {
      getData(`chara/user/${charaId}`).then((d) => {
        $__default['default']('.ask .price').val(initPrice);
        $__default['default']('.ask .amount').val(d.Value.Amount);
      });
    });
  }

  function showInitialPrice (charaId) {
    const charaInitPrice = getCharaInitPrice();
    if (charaInitPrice[charaId]) {
      const initPrice = charaInitPrice[charaId].init_price;
      const time = charaInitPrice[charaId].time;
      $__default['default']($__default['default']('#grailBox .info .text')[1]).append(`<span title="上市时间:${time}">发行价：${initPrice}</span>`);
      sellAll(charaId, initPrice);
    } else {
      getData(`chara/charts/${charaId}/2019-08-08`).then((d) => {
        const initPrice = d.Value[0].Begin.toFixed(2);
        const time = d.Value[0].Time.replace('T', ' ');
        getCharaInitPrice();
        charaInitPrice[charaId] = {
          init_price: initPrice,
          time: time
        };
        setCharaInitPrice(charaInitPrice);
        $__default['default']($__default['default']('#grailBox .info .text')[1]).append(`<span title="上市时间:${time}">发行价：${initPrice}</span>`);
        sellAll(charaId, initPrice);
      });
    }
  }

  function showPrice (chara) {
    const price = chara.Price.toFixed(2);
    $__default['default']($__default['default']('#grailBox .info .text')[1]).append(`<span>评估价：${price}</span>`);
  }

  function priceWarning () {
    const price = $__default['default']('.bid .price').val();
    $__default['default']('#bidButton').after('<button style="display:none" id="confirm_bidButton" class="active bid">买入</button>');
    $__default['default']('.bid .price').on('input', function () {
      const priceNow = $__default['default']('.bid .price').val();
      if (priceNow > Math.max(price * 3, 100)) {
        $__default['default']('.bid .price').css({
          color: 'red'
        });
        $__default['default']('#confirm_bidButton').show();
        $__default['default']('#bidButton').hide();
      } else {
        $__default['default']('#confirm_bidButton').hide();
        $__default['default']('#bidButton').show();
        $__default['default']('.bid .price').css({
          color: 'inherit'
        });
      }
    });
    $__default['default']('#confirm_bidButton').on('click', function () {
      const price = $__default['default']('.bid .price').val();
      const amount = $__default['default']('.bid .amount').val();
      if (!confirm(`买入价格过高提醒！\n确定以${price}的价格买入${amount}股？`)) {
        return
      }
      $__default['default']('#bidButton').click();
    });
  }

  function showOwnTemple () {
    const followList = getFollowList();
    const settings = getSettings();
    const preTemple = settings.pre_temple;
    const temples = $__default['default']('#lastTemples .item');
    let me = followList.user;
    if (!me) {
      me = $__default['default']('#new_comment .reply_author a')[0].href.split('/').pop();
      followList.user = me;
      setFollowList(followList);
    }
    for (let i = 0; i < temples.length; i++) {
      if (temples[i].querySelector(`.name a[href$="${me}"]`)) {
        temples[i].classList.add('my_temple');
        temples[i].classList.remove('replicated');
        if (preTemple === 'on') { $__default['default']('#lastTemples').prepend(temples[i]); }
        break
      }
    }
    $__default['default']('#expandButton').one('click', () => {
      showOwnTemple();
    });
  }

  function showOwnLink () {
    const followList = getFollowList();
    const settings = getSettings();
    const preLink = settings.pre_temple;
    const links = $__default['default']('#grailBox .assets_box #lastLinks.assets .link.item');
    let me = followList.user;
    if (!me) {
      me = $__default['default']('#new_comment .reply_author a')[0].href.split('/').pop();
      followList.user = me;
      localStorage.setItem('TinyGrail_followList', JSON.stringify(followList));
    }
    for (let i = 0; i < links.length; i++) {
      const user = links[i].querySelector('.name a').href.split('/').pop();
      if (user === me) {
        links[i].classList.add('my_link');
        if (preLink === 'on') { $__default['default'](links[i]).siblings('.rank.item').after(links[i]); }
        break
      }
    }
  }

  function showTempleRate (chara) {
    const rate = chara.Rate;
    const level = chara.Level;
    getData(`chara/temple/${chara.Id}`).then((d) => {
      const templeAll = {
        1: 0,
        2: 0,
        3: 0
      };
      for (let i = 0; i < d.Value.length; i++) {
        templeAll[d.Value[i].Level]++;
      }
      const templeRate = rate * (level + 1) * 0.3;
      $__default['default']('#grailBox .assets_box .bold .sub').attr('title', '活股股息:' + formatNumber(rate, 2));
      $__default['default']('#grailBox .assets_box .bold .sub').before(`<span class="sub"> (${templeAll[3]} + ${templeAll[2]} + ${templeAll[1]})</span>`);
      $__default['default']('#expandButton').before(`<span class="sub" title="圣殿股息:${formatNumber(templeRate, 2)}"> (${formatNumber(templeRate, 2)})</span>`);
    });
  }

  function changeTempleCover (charaId) {
    $__default['default']('#lastTemples').on('click', '.card', (e) => {
      console.log('thr: card clicked', e);
      const followList = getFollowList();
      const me = followList.user;
      const temple = $__default['default'](e.currentTarget).parent().data('temple');
      const user = temple.Name;
      if (user === me) ; else { addButton(temple, user); }
    });

    //   function setChaosCube(temple){
    //     $('#chaosCubeButton').on('click', () => {
    //       let templeId = temple.CharacterId;
    //       ItemsSetting.chaosCube = templeId;
    //       setItemsSetting(ItemsSetting)
    //     });
    //   }
    function addButton (temple, user) {
      $__default['default']('#TB_window .action').append(`<button id="changeCoverButton2" class="text_button" title="修改圣殿封面">[修改]</button>
<button id="copyCoverButton" class="text_button" title="复制圣殿图片为自己圣殿的封面">[复制]</button>`);

      $__default['default']('#changeCoverButton2').on('click', () => {
        const cover = prompt('图片url(你可以复制已有圣殿图片的url)：');
        const url = 'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/' + cover.match(/cover\/\S+\.jpg/)[0];
        postData(`chara/temple/cover/${charaId}/${temple.UserId}`, url).then((d) => {
          if (d.State === 0) {
            alert('更换封面成功。');
            $__default['default']('#TB_window img.cover').attr('src', cover);
            $__default['default']('#grailBox .assets_box .assets .item').each(function () {
              if (user === this.querySelector('.name a').href.split('/').pop()) {
                $__default['default'](this).find('div.card').css({
                  'background-image': 'url(https://tinygrail.mange.cn/' + cover.match(/cover\/\S+\.jpg/)[0] + '!w150)'
                });
              }
            });
          } else {
            alert(d.Message);
          }
        });
      });

      $__default['default']('#copyCoverButton').on('click', () => {
        const cover = $__default['default']('#TB_window .container .cover').attr('src');
        const url = 'https://tinygrail.oss-cn-hangzhou.aliyuncs.com/' + cover.match(/cover\/\S+\.jpg/)[0];
        postData(`chara/temple/cover/${charaId}`, url).then((d) => {
          if (d.State === 0) {
            alert('更换封面成功。');
            location.reload();
          } else {
            alert(d.Message);
          }
        });
      });
    }
  }

  function mergeorderList (orderListHistory) {
    const mergedorderList = [];
    let i = 0;
    mergedorderList.push(orderListHistory[0]);
    for (let j = 1; j < orderListHistory.length; j++) {
      if ((orderListHistory[j].Price === mergedorderList[i].Price) && Math.abs(new Date(orderListHistory[j].TradeTime) - new Date(mergedorderList[i].TradeTime)) < 10 * 1000) {
        // 10s内同价格订单合并
        mergedorderList[i].Amount += orderListHistory[j].Amount;
      } else {
        mergedorderList.push(orderListHistory[j]);
        i++;
      }
    }
    return mergedorderList
  }

  function mergeorderListHistory (charaId) {
    const settings = getSettings();
    if (settings.merge_order === 'on') {
      getData(`chara/user/${charaId}`).then((d) => {
        if (d.State === 0 && d.Value) {
          $__default['default']('.ask .ask_list li[class!=ask]').hide();
          const askHistory = mergeorderList(d.Value.AskHistory);
          for (let i = 0; i < askHistory.length; i++) {
            const ask = askHistory[i];
            if (ask) { $__default['default']('.ask .ask_list').prepend(`<li title="${formatDate(ask.TradeTime)}">₵${formatNumber(ask.Price, 2)} / ${formatNumber(ask.Amount, 0)} / +${formatNumber(ask.Amount * ask.Price, 2)}<span class="cancel">[成交]</span></li>`); }
          }
          $__default['default']('.bid .bid_list li[class!=bid]').hide();
          const bidHistory = mergeorderList(d.Value.BidHistory);
          for (let i = 0; i < bidHistory.length; i++) {
            const bid = bidHistory[i];
            if (bid) { $__default['default']('.bid .bid_list').prepend(`<li title="${formatDate(bid.TradeTime)}">₵${formatNumber(bid.Price, 2)} / ${formatNumber(bid.Amount, 0)} / -${formatNumber(bid.Amount * bid.Price, 2)}<span class="cancel">[成交]</span></li>`); }
          }
        }
      });
    }
  }

  function openBuildDialog (chara) {
    const autoTempleList = getAutoTempleList();
    let charaId = chara.Id;
    if (chara.CharacterId) { charaId = chara.CharacterId; }
    let target = 500;
    let bidPrice = 10;
    let intempleList = false;
    let index = 0;
    for (let i = 0; i < autoTempleList.length; i++) {
      if (autoTempleList[i].charaId === charaId) {
        target = autoTempleList[i].target;
        bidPrice = autoTempleList[i].bidPrice;
        intempleList = true;
        index = i;
      }
    }
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title" title="目标数量 / 买入价格">
自动建塔 - #${charaId} 「${chara.Name}」 ${target} / ₵${bidPrice}</div>
<div class="desc"><p>当已献祭股数+持有股数达到目标数量时将自动建塔</p>
输入 目标数量 / 买入价格(不超过此价格的卖单将自动买入)</div>
<div class="label"><div class="trade build">
<input class="target" type="number" style="width:150px" title="目标数量" value="${target}">
<input class="bidPrice" type="number" style="width:100px" title="卖出下限" value="${bidPrice}">
<button id="startBuildButton" class="active">自动建塔</button><button id="cancelBuildButton">取消建塔</button></div>
<div class="loading" style="display:none"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
    $__default['default']('body').append(dialog);

    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);

    $__default['default']('#cancelBuildButton').on('click', function () {
      if (intempleList) {
        autoTempleList.splice(index, 1);
        setAutoTempleList(autoTempleList);
        alert(`取消自动建塔${chara.Name}`);
        $__default['default']('#autobuildButton').text('[自动建塔]');
      }
      closeDialog();
    });

    $__default['default']('#startBuildButton').on('click', function () {
      const info = {};
      info.charaId = charaId.toString();
      info.name = chara.Name;
      info.target = $__default['default']('.trade.build .target').val();
      info.bidPrice = $__default['default']('.trade.build .bidPrice').val();
      if (intempleList) {
        autoTempleList.splice(index, 1);
        autoTempleList.unshift(info);
      } else { autoTempleList.unshift(info); }
      setAutoTempleList(autoTempleList);
      alert(`启动自动建塔#${info.charaId} ${info.name}`);
      closeDialog();
      $__default['default']('#autobuildButton').text('[自动建塔中]');
      autoBuildTemple([info]);
    });
  }

  function setBuildTemple (chara) {
    let inTempleList = false;
    let charaId = chara.Id;
    const autoTempleList = getAutoTempleList();
    if (chara.CharacterId) { charaId = chara.CharacterId; }
    for (let i = 0; i < autoTempleList.length; i++) {
      if (autoTempleList[i].charaId === charaId) { inTempleList = true; }
    }
    setAutoTempleList(autoTempleList);
    let button;
    if (inTempleList) {
      button = '<button id="autobuildButton" class="text_button">[自动建塔中]</button>';
    } else {
      button = '<button id="autobuildButton" class="text_button">[自动建塔]</button>';
    }
    if ($__default['default']('#buildButton').length) { $__default['default']('#buildButton').after(button); } else { $__default['default']('#grailBox .title .text').after(button); }

    $__default['default']('#autobuildButton').on('click', () => {
      openBuildDialog(chara);
    });
  }

  function followChara (charaId) {
    const followList = getFollowList();
    let button = '<button id="followCharaButton" class="text_button">[关注角色]</button>';
    if (followList.charas.includes(charaId)) {
      button = '<button id="followCharaButton" class="text_button">[取消关注]</button>';
    }
    if ($__default['default']('#kChartButton').length) { $__default['default']('#kChartButton').before(button); } else { $__default['default']('#grailBox .title .text').after(button); }

    $__default['default']('#followCharaButton').on('click', () => {
      if (followList.charas.includes(charaId)) {
        followList.charas.splice(followList.charas.indexOf(charaId), 1);
        $__default['default']('#followCharaButton').text('[关注角色]');
      } else {
        followList.charas.unshift(charaId);
        $__default['default']('#followCharaButton').text('[取消关注]');
      }
      setFollowList(followList);
    });
  }

  function followAuctions (charaId) {
    getData(`chara/user/${charaId}/tinygrail/false`).then((d) => {
      const followList = getFollowList();
      if (d.State === 0) {
        let button;
        if (followList.auctions.includes(charaId)) {
          button = '<button id="followAuctionButton" class="text_button">[取消关注]</button>';
        } else {
          button = '<button id="followAuctionButton" class="text_button">[关注竞拍]</button>';
        }
        $__default['default']('#buildButton').before(button);
        $__default['default']('#followAuctionButton').on('click', () => {
          if (followList.auctions.includes(charaId)) {
            followList.auctions.splice(followList.auctions.indexOf(charaId), 1);
            $__default['default']('#followAuctionButton').text('[关注竞拍]');
          } else {
            followList.auctions.unshift(charaId);
            $__default['default']('#followAuctionButton').text('[取消关注]');
          }
          setFollowList(followList);
        });
      }
    });
  }

  function addCharaInfo () {
    const charaId = $__default['default']('#grailBox .title .name a')[0].href.split('/').pop();
    followChara(charaId); // 关注角色
    followAuctions(charaId); // 关注竞拍情况
    showInitialPrice(charaId); // 显示发行价
    priceWarning(); // 买入价格过高提醒
    mergeorderListHistory(charaId); // 合并同一时间订单历史记录
    launchObserver({
      parentNode: document.body,
      selector: '#lastTemples .item',
      successCallback: () => {
        showOwnTemple(); // 显示自己的圣殿
        changeTempleCover(charaId); // 修改他人圣殿封面
      }
    });
    launchObserver({
      parentNode: document.body,
      selector: '#lastLinks .link.item',
      successCallback: () => {
        showOwnLink(); // 前置自己的连接
      }
    });
    showGallery(); // 查看画廊
    getData(`chara/${charaId}`).then((d) => {
      const chara = d.Value;
      showAuctionHistory(chara); // 历史拍卖
      showTradeHistory(chara); // 交易记录
      showPrice(chara); // 显示评估价
      showTempleRate(chara); // 显示各级圣殿数量及股息计算值
      setBuildTemple(chara); // 自动建塔
      fixAuctions(chara); // 修改默认拍卖底价和数量
    });
  }

  function openICODialog (chara) {
    const fillicoList = getFillICOList();
    let target = 1;
    let inorder = false;
    let index = 0;
    for (let i = 0; i < fillicoList.length; i++) {
      if (fillicoList[i].Id === chara.Id) {
        target = fillicoList[i].target;
        inorder = true;
        index = i;
      }
    }
    const dialog = `<div id="TB_overlay" class="TB_overlayBG TB_overlayActive"></div>
<div id="TB_window" class="dialog" style="display:block;max-width:640px;min-width:400px;">
<div class="title">自动补款 - #${chara.CharacterId} 「${chara.Name}」 lv${target}</div>
<div class="desc">目标等级：<input type="number" class="target" min="1" max="10" step="1" value="${target}" style="width:50px"></div>
<div class="label"><div class="trade ico">
<button id="startfillICOButton" class="active">自动补款</button>
<button id="fillICOButton" style="background-color: #5fda15;">立即补款</button>
<button id="cancelfillICOButton">取消补款</button></div>
<div class="loading" style="display:none"></div>
<a id="TB_closeWindowButton" title="Close">X关闭</a>
</div>`;
    $__default['default']('body').append(dialog);

    $__default['default']('#TB_closeWindowButton').on('click', closeDialog);

    $__default['default']('#cancelfillICOButton').on('click', function () {
      if (inorder) {
        alert(`取消自动补款${chara.Name}`);
        $__default['default']('#followICOButton').text('[自动补款]');
        fillicoList.splice(index, 1);
        setFillICOList(fillicoList);
      }
      closeDialog();
      console.log(fillicoList);
    });

    $__default['default']('#startfillICOButton').on('click', function () {
      const target = parseFloat($__default['default']('.desc .target').val());
      if (target <= 0 || !Number.isInteger(target)) {
        alert('请输入正整数！');
        return
      }
      const info = {};
      info.Id = chara.Id.toString();
      info.charaId = chara.CharacterId.toString();
      info.name = chara.Name;
      info.target = target;
      info.end = chara.End;
      if (inorder) {
        fillicoList[index] = info;
      } else { fillicoList.push(info); }
      setFillICOList(fillicoList);
      alert(`启动自动补款#${chara.Id} ${chara.Name}`);
      $__default['default']('#followICOButton').text('[自动补款中]');
      closeDialog();
      console.log(fillicoList);
    });

    $__default['default']('#fillICOButton').on('click', function () {
      const target = parseFloat($__default['default']('.desc .target').val());
      if (target <= 0 || !Number.isInteger(target)) {
        alert('请输入正整数！');
        return
      }
      const info = {};
      info.Id = chara.Id.toString();
      info.charaId = chara.CharacterId.toString();
      info.name = chara.Name;
      info.target = target;
      info.end = chara.End;
      closeDialog();
      if (confirm(`立即补款#${chara.Id} ${chara.Name} 至 lv${target}`)) {
        fullfillICO([info]);
      }
    });
  }

  function setFullFillICO (chara) {
    const fillicoList = getFillICOList();
    let button;
    let inorder = false;
    const charaId = chara.CharacterId;
    for (let i = 0; i < fillicoList.length; i++) {
      if (fillicoList[i].charaId === charaId) {
        inorder = true;
      }
    }
    if (inorder) {
      button = '<button id="followICOButton" class="text_button">[自动补款中]</button>';
    } else {
      button = '<button id="followICOButton" class="text_button">[自动补款]</button>';
    }
    $__default['default']('#grailBox .title .text').after(button);
    $__default['default']('#followICOButton').on('click', () => {
      openICODialog(chara);
    });
  }

  function showEndTime (chara) {
    const endTime = (chara.End).slice(0, 19);
    $__default['default']('#grailBox .title .text').append(`<div class="sub" style="margin-left: 20px">结束时间: ${endTime}</div>`);
  }

  function addIcoInfo () {
    const charaId = location.pathname.split('/').pop();
    followChara(charaId); // 关注角色
    getData(`chara/${charaId}`).then((d) => {
      const chara = d.Value;
      showEndTime(chara); // 显示结束时间
      setBuildTemple(chara); // 自动建塔
      setFullFillICO(chara); // 自动补款
    });
  }

  //= ======================================================================================================//

  setInterval(autoFillTemple, 60 * 60 * 1000);
  setInterval(autoTemple, 60 * 60 * 1000);
  setInterval(fillICO, 30 * 1000);

  // character page
  if (location.pathname.startsWith('/rakuen/topic/crt') || location.pathname.startsWith('/character')) {
    const parentNode = document.getElementById('subject_info') || document.getElementById('columnCrtB');
    // charater trade info
    let charaFetched = false;
    launchObserver({
      parentNode: parentNode,
      selector: '#grailBox .assets_box',
      failCallback: () => {
        charaFetched = false;
      },
      successCallback: () => {
        if (charaFetched) return
        charaFetched = true;
        addCharaInfo();
      },
      stopWhenSuccess: false
    });
    // charater ico info
    let icoFetched = false;
    launchObserver({
      parentNode: parentNode,
      selector: '#grailBox .trade .money',
      failCallback: () => {
        icoFetched = false;
      },
      successCallback: () => {
        if (icoFetched) return
        icoFetched = true;
        addIcoInfo();
      },
      stopWhenSuccess: false
    });
  } else if (location.pathname.startsWith('/rakuen/home')) { // rakuen homepage
    // 周六未领取股息则自动领取
    if (getSettings().get_bonus === 'on') getShareBonus();
    launchObserver({
      parentNode: document.body,
      selector: '#topWeek',
      successCallback: () => {
        hideBonusButton(); // 隐藏签到
        showTopWeek(); // 显示萌王榜排名数值
        showGallery(); // 显示画廊
      }
    });
    let charaFetched = false;
    launchObserver({
      parentNode: document.body,
      selector: '#grailBox .assets_box',
      failCallback: () => {
        charaFetched = false;
      },
      successCallback: () => {
        if (charaFetched) return
        charaFetched = true;
        addCharaInfo();
      },
      stopWhenSuccess: false
    });
  } else if (location.pathname.startsWith('/rakuen/topiclist')) { // menu page
    setTimeout(function () {
      loadHelperMenu();
    }, 500);
  } else if (location.pathname.startsWith('/user')) { // user homepage
    launchObserver({
      parentNode: document.body,
      selector: '#grail',
      successCallback: () => {
        showHideGrailBox();
        showGallery();
      }
    });
    let charaFetched = false;
    launchObserver({
      parentNode: document.body,
      selector: '#grailBox .assets_box',
      failCallback: () => {
        charaFetched = false;
      },
      successCallback: () => {
        if (charaFetched) return
        charaFetched = true;
        addCharaInfo();
      },
      stopWhenSuccess: false
    });
  }

}($));
