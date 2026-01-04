// ==UserScript==
// @name        啊我就免費仔
// @namespace   Violentmonkey Scripts
// @match       https://ani.gamer.com.tw/animeVideo.php
// @grant       none
// @version     1.0.7
// @author      bigiCrab
// @description 2021/7/16 上午12:38:18 不用點同意 等畫面重整
// @downloadURL https://update.greasyfork.org/scripts/429509/%E5%95%8A%E6%88%91%E5%B0%B1%E5%85%8D%E8%B2%BB%E4%BB%94.user.js
// @updateURL https://update.greasyfork.org/scripts/429509/%E5%95%8A%E6%88%91%E5%B0%B1%E5%85%8D%E8%B2%BB%E4%BB%94.meta.js
// ==/UserScript==

/**
 * 20210717
 * 解廣告要25秒
 * 看完廣告可維持575秒 不用再看
 * 等於看一次可用10分鐘
 *
 * localstroge Next=跳過下一個 All=全跳過
 * */

(async function () {
  "use strict";

  appendSettingUI();

  var __setting = {
    // server要?秒後才能通過
    waitSendADEnd: 25,
    // 看完廣告好可以多久不用再看廣告
    adPassVaildTime: 575,
    // 現在再看的動畫代碼
    thisSN: animefun.videoSn,
    // 下一集sn 0=沒有下一個
    nextSN: animefun.nextSn,
    // 上一集sn
    preSN: animefun.preSn,
    // 全系列sn
    allSN: $(
      "#BH_background > div.container-player > div.anime-title > div.anime-option  section > ul > li[class!='playing'] > a"
    )
      .toArray()
      .map((e) => new URL(e).searchParams.get("sn")),
  };
  // 要持續跳過哪集 Array 型別
  var m_nextSkipSNs = [__setting.nextSN];
  if (getNowSetting() == "Next") {
    //   這+下一集
    m_nextSkipSNs = [__setting.nextSN, __setting.thisSN];
  } else {
    //   全集
    m_nextSkipSNs = [...__setting.allSN, __setting.thisSN];
  }
  makeADPass(
    __setting.thisSN,
    getAd()[2],
    __setting.waitSendADEnd,
    async () => {
      await sleep(1);
      location.reload();
    },
    true,
    false
  );
  let haveRunFirstTimeAfterRefresh = [];
  setInterval(
    (function keepADPassAlive() {
      m_nextSkipSNs.forEach(async (sn) => {
        // 若重發別集的token會中斷現在的影片
        // makeADPass(
        //   sn,
        //   getAd()[2],
        //   __setting.waitSendADEnd,
        //   () => {
        //     console.log(`sn:${_sn}已經跳過廣告`);
        //   },
        //   false,
        //   false
        // );

        // 改成不問有沒有成功只看廣告
        if (!haveRunFirstTimeAfterRefresh.includes(sn)) {
          haveRunFirstTimeAfterRefresh.push(sn);
          console.log("1st", sn);
          if (sn == __setting.thisSN) {
            return;
          }
          if (await checkADPass(sn)) {
            console.log("ad pass", sn);
            return;
          }
        }
        console.log("ad no pass, send new request", sn);
        let s = getAd()[2];
        await fetch(`/ajax/videoCastcishu.php?s=${s}&sn=${sn}`);
        await sleep(__setting.waitSendADEnd * 1000);
        await fetch(`/ajax/videoCastcishu.php?s=${s}&sn=${sn}&ad=end`);
      });

      return keepADPassAlive;
    })(),
    (__setting.adPassVaildTime + __setting.waitSendADEnd) * 1000
  );

  function appendSettingUI() {
    const appendAnchor = $(
      "#BH_background > div.container-player > div.anime-title > div.anime-option > section.videoname > div.anime_name > button"
    );
    var changeBTN = $(`
      <span style="margin-left:5px;cursor: pointer;user-select: none;">
      </span>
      `);
    $(changeBTN).click(() => {
      handleUserChangeSetting();
    });
    var changeBTNContent_all = $(`
    <span id="free-guy-ui" title="All AD will be skip (refresh page to work)" style="padding:5px 10px;line-height: 1.5em;" class="bluebtn">
     AD All
    </span>
    `);
    // <i class="material-icons" style="vertical-align: middle;"> scatter_plot </i>
    // <i class="material-icons" style="vertical-align: middle;transform: rotate(90deg);"> drag_indicator </i>
    // <i class="material-icons" style="vertical-align: middle;"> grid_view </i>
    var changeBTNContent_next = $(`
    <span id="free-guy-ui" title="Only this & next ep AD will be skip (refresh page to work)" style="padding:5px 10px;line-height: 1.5em;" class="bluebtn">
     AD Next
    </span>
    `);
    // <i class="material-icons" style="vertical-align: middle;"> hdr_weak </i>

    $(changeBTN).append(changeBTNContent_all);
    appendAnchor.after(changeBTN);
    updateUI();

    function handleUserChangeSetting() {
      if (getNowSetting() == "Next") {
        localStorage.setItem("freeGuy_skipADSetting", "All");
      } else {
        localStorage.setItem("freeGuy_skipADSetting", "Next");
      }
      updateUI();
    }
    function updateUI() {
      if (getNowSetting() == "Next") {
        $("#free-guy-ui").replaceWith(changeBTNContent_next);
      } else {
        $("#free-guy-ui").replaceWith(changeBTNContent_all);
      }
    }
  }
  function getNowSetting() {
    return localStorage.getItem("freeGuy_skipADSetting", "Next") || "Next";
  }
  //     makeADPass(__setting.nextSN, getAd()[2], __setting.waitSendADEnd, () => {});
  /**
   * @param _sn 動畫no url可看到
   * @param _ads 廣告no getAd 可拿到可用
   * @param _waitADEnd server 要多久才能給通過廣告
   * @param _adPassCb ADPass 之後的 CB
   * @param _showToastr 要不要顯示toastr在畫面上
   * @param _forceGetAD 要不要重送廣告要求
   * */
  async function makeADPass(
    _sn,
    _ads,
    _waitADEnd,
    _adPassCb = () => {},
    _showToastr = false,
    _forceGetAD = false
  ) {
    if (_sn == 0) {
      console.log("sn錯誤");
      return;
    }
    let toastr = $.extend(true, {}, window.toastr);
    if (!_showToastr) {
      for (const key in toastr) {
        if (Object.hasOwnProperty.call(toastr, key)) {
          toastr[key] = () => {};
        }
      }
    }

    toastr.info("", "檢查廣告中...", { timeOut: 0 });
    let adPass = await checkADPass(_sn);
    toastr.clear();

    if (adPass) {
      toastr.success("", "廣告ㄅㄅ", { timeOut: 3000 });
    } else {
      let sec = _waitADEnd;
      //   UI
      if (_showToastr) {
        let el = toastr.warning("", `正在跳過廣告... ${sec}(秒)`, {
          timeOut: sec * 1000,
          extendedTimeOut: 0,
          progressBar: true,
        });
        el.css("pointer-events", "none");
        let title = el.find(".toast-title");
        setInterval(() => title.text(`正在跳過廣告... ${--sec}(秒)`), 1000);
      }
      // API 開始看AD
      await fetch(`/ajax/videoCastcishu.php?s=${_ads}&sn=${_sn}`);
      await sleep(sec * 1000);
      await fetch(`/ajax/videoCastcishu.php?s=${_ads}&sn=${_sn}&ad=end`);

      // retry AD 看完API
      let extraTime = 0;
      let adEnd_interval = setInterval(async () => {
        if (await checkADPass(_sn)) {
          toastr.clear();
          toastr.success(
            "",
            `廣告以消滅~~要等${_waitADEnd + extraTime}秒才有效`,
            {
              timeOut: 3000,
            }
          );

          clearInterval(adEnd_interval);

          console.log(`sn:${_sn}已經跳過廣告`);
          _adPassCb();
        } else {
          //跳過失敗 可能巴哈有改 或有點同意自己看廣告
          toastr.clear();

          toastr.error(``, `跳過廣告失敗QQ...`, {
            timeOut: 1000,
          });

          clearInterval(adEnd_interval);
          return;

          toastr.error(
            `server有延長驗證時間${_waitADEnd + ++extraTime}秒`,
            `重試跳過廣告... `,
            {
              timeOut: 1000,
            }
          );
          await fetch(`/ajax/videoCastcishu.php?s=${_ads}&sn=${_sn}&ad=end`);
        }
      }, 1000);
    }
    // test 巴哈API
    function testADPassTime() {
      const startTime = Math.floor(Date.now() / 1000);
      let test_interval = setInterval(async () => {
        if (await checkADPass(_sn)) {
          console.log(`還不用看廣告:${getPassTime(startTime)}`);
          // 這邊發都沒用
          //   await fetch(`/ajax/videoCastcishu.php?s=${_ads}&sn=${_sn}&ad=end`);
        } else {
          console.log(`要看廣告了:${getPassTime(startTime)}`);
          // 這邊發都沒用
          //   await fetch(`/ajax/videoCastcishu.php?s=${_ads}&sn=${_sn}&ad=end`);
          if (await checkADPass(_sn)) {
            console.log(`AD回來後 再發一次有效`);
          } else {
            console.log(`AD回來後 再發一次無效`);
          }
          clearInterval(test_interval);
        }
      }, 1000);
      function getPassTime(_startTime) {
        return Math.floor(Date.now() / 1000) - _startTime;
      }
    }
  }
  // return true 如果不需要看廣告
  async function checkADPass(_sn) {
    let res = await fetch(`/ajax/token.php?sn=${_sn}`);
    let json = await res.json();
    // json.time == 0 = 需要看廣告
    return json.time == 1;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
