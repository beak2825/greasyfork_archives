/* eslint-disable max-len,no-plusplus,no-param-reassign,new-cap,func-style */
// ==UserScript==
// @name         Redeem itch.io
// @namespace    Redeem-itch.io
// @version      1.3.12
// @description  自动领取itch.io key链接和免费itch.io游戏
// @author       HCLonely
// @iconURL      https://itch.io/favicon.ico
// @include      *://*itch.io/*
// @include      *://keylol.com/*
// @include      *://www.steamgifts.com/discussion/*
// @include      *://www.reddit.com/r/*
// @include      *://new.isthereanydeal.com/deals/*
// @include      *://freegames.codes/game/*
// @include      *://itchclaim.tmbpeter.com/*
// @include      *://shaigrorb.github.io/freetchio/*
// @supportURL   https://blog.hclonely.com/posts/578f9be7/
// @homepage     https://blog.hclonely.com/posts/578f9be7/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require      https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @connect      itch.io
// @connect      *.itch.io
// @downloadURL https://update.greasyfork.org/scripts/36806/Redeem%20itchio.user.js
// @updateURL https://update.greasyfork.org/scripts/36806/Redeem%20itchio.meta.js
// ==/UserScript==

/* global checkItchGame,MutationObserver */
/* eslint-disable camelcase */

(function () {
  'use strict';

  const closeWindow = true; // 领取完成后自动关闭页面，改为'false'则为不自动关闭
  const url = window.location.href;

  /** *************************自动领取itch.io游戏链接***************************/
  if (/^https?:\/\/[\w\W]{1,}\.itch\.io\/[\w]{1,}(-[\w]{1,}){0,}\/download\/[\w\W]{0,}/i.test(url)) {
    $('button.button').map((i, e) => {
      if (/link|claim|链接/gim.test($(e).text())) e.click();
      return e;
    });
    if ((/This page is linked|此页面已链接到帐户/gim.test($('div.inner_column').text()) || $('a.button.download_btn[data-upload_id]').length > 0) && closeWindow === 1) closePage();
  }

  /** *********************领取免费itch.io游戏***************************/
  if (/^https?:\/\/.*?itch\.io\/.*?\/purchase(\?.*?)?$/.test(url) && /No thanks, just take me to the downloads|不用了，请带我去下载页面/i.test($('a.direct_download_btn').text())) {
    $('a.direct_download_btn')[0].click();
  } else if (
    $('.purchase_banner_inner').length === 0 &&
    (
      /0\.00/gim.test($('.button_message').eq(0)
        .find('.dollars[itemprop]')
        .text()) ||
      /0\.00/gim.test($('.money_input').attr('placeholder')) ||
      /自己出价|Name your own price/gim.test($('.button_message').eq(0)
        .find('.buy_message')
        .text())
    )
  ) {
    $('.buy_btn').after(`<a data-itch-href="${$('.buy_btn').attr('href')}" href="javascript:void(0)" onclick="redeemItchGame(this)" target="_self" class="button" one-link-mark="yes" title="仅支持免费游戏">后台领取</a>`);
  }

  /** **********************限时免费游戏包*****************************/
  if (/https?:\/\/itch.io\/s\/[\d]{1,}\/[\w\W]{1,}/.test(url)) {
    if ($('.promotion_buy_row .buy_game_btn').length > 0) {
      $('.promotion_buy_row .buy_game_btn').after('<button id="redeem-itch-io" class="button" style="font-size:18px;letter-spacing:0.025em;line-height:36px;height:40px;padding:0 20px;margin:0 16px">后台领取</button>');
    } else {
      $('.countdown_row').prepend('<div style="width: 100%"><button id="redeem-itch-io" class="button" style="font-size:18px;letter-spacing:0.025em;line-height:36px;padding:0 20px;margin: 10px 30%;width: 40%;">后台领取</button></div>');
    }

    $('#redeem-itch-io').click(async () => {
      const gameLink = $('.thumb_link.game_link');
      for (const e of gameLink) {
        await redeemGame(e);
      }
    });
  }

  /** **********************后台领取游戏*****************************/
  if (['keylol.com', 'www.steamgifts.com', 'www.reddit.com', 'new.isthereanydeal.com', 'freegames.codes', 'itchclaim.tmbpeter.com', 'shaigrorb.github.io'].includes(window.location.hostname)) {
    addRedeemBtn();
    const observer = new MutationObserver(addRedeemBtn);
    observer.observe(document.documentElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }
  function addRedeemBtn() {
    for (const e of $('a[href*="itch.io"]:not(".redeem-itch-game")')) {
      const positionEle = window.location.hostname === 'shaigrorb.github.io' ? $(e).addClass('redeem-itch-game')
        .parents('.item-card') : $(e).addClass('redeem-itch-game');
      positionEle.after(`<a ${
        window.location.hostname === 'freegames.codes' ? 'class="details__buy" ' : ''
      }
        data-itch-href="${$(e).attr('href')}"
        href="javascript:void(0);"
        onclick="redeemItchGame('${$(e).attr('href')}')"
        target="_self"
        style="${window.location.hostname === 'shaigrorb.github.io' ? 'position:relative;height:min-content;right:39px;background-color:#16a34a;top:4px;text-decoration-line:none;color:white;font-weight:bold;border-radius:2px;padding:5px;font-size:13px; ' : `margin-${window.location.hostname === 'freegames.codes' ? 'top' : 'left'}:10px !important;`}">领取</a>`);
    }
  }
  GM_registerMenuCommand('提取所有链接', async () => {
    log('正在提取链接，请稍候...');
    let gamesLink = [];
    for (const e of $('a[href*="itch.io"]:not(".itch-io-game-link-owned"):not([href*="itch.io/b/"]):not([href*="itch.io/c/"])')) {
      const links = await getUrlLink(e);
      gamesLink = [...gamesLink, ...links];
    }
    gamesLink = [...new Set(gamesLink)];
    for (const e of gamesLink) {
      await isOwn(e);
    }
    log('全部领取完成！', 'success');
  });
  unsafeWindow.redeemItchGame = redeemGame;
  function closePage() {
    window.close();
  }
  function log(e, c) {
    if (typeof e !== 'string') return console.log(e);
    Swal[$('.swal2-container').length > 0 ? 'update' : 'fire']({
      title: e,
      icon: c || 'info',
      customClass: {
        title: 'break-all'
      }
    });
    let color = 'color:';
    switch (c) {
    case 'success':
      color += 'green';
      break;
    case 'warning':
      color += 'blue';
      break;
    case 'info':
      color += 'yellow';
      break;
    case 'error':
      color += 'red';
      break;
    default:
      color += 'black';
    }
    console.log(`%c${e}`, color);
  }

  async function getUrlLink(e) {
    let url = '';
    if ($(e).attr('data-itch-href')) {
      url = $(e).attr('data-itch-href');
    } else {
      if ($(e).hasClass('itch-io-game-link-owned')) return [];
      url = $(e).attr('href');
    }
    log(`正在处理游戏/优惠包链接: <br/>${url}`);
    if (/https?:\/\/itch.io\/s\/[\d]+\/.+/.test(url)) {
      log(`正在获取优惠包信息...<br/>${url}`);
      const data = await httpRequest({
        url,
        method: 'get'
      });

      if (data.status === 200) {
        if (data.responseText.includes('not_active_notification')) {
          log('活动已结束！', 'error');
          return [];
        }
        const gamesLink = [];
        const games = $(data.responseText).find('.game_grid_widget.promo_game_grid a.thumb_link.game_link');
        for (const e of games) {
          gamesLink.push(e.href.replace(/\/$/, ''));
        }
        return gamesLink;
      }
      log('请求失败！', 'error');
      log(data);
      return [];
    } else if (/^https?:\/\/.+?\.itch\.io\/[^/]+?(\/purchase)?$/.test(url)) {
      return [url.replace('/purchase', '').replace(/\/$/, '')];
    }
    return [];
  }
  async function redeemGame(e) {
    let url = '';
    if (typeof e === 'string') {
      url = e;
    } else if ($(e).attr('data-itch-href')) {
      url = $(e).attr('data-itch-href');
    } else {
      if ($(e).hasClass('itch-io-game-link-owned')) return;
      url = $(e).attr('href');
    }
    log(`当前游戏/优惠包链接: <br/>${url}`);
    if (/https?:\/\/itch.io\/s\/[\d]+\/.+/.test(url)) {
      log(`正在获取优惠包信息...<br/>${url}`);
      const data = await httpRequest({
        url,
        method: 'get'
      });
      if (data.status === 200) {
        if (data.responseText.includes('not_active_notification')) {
          log('活动已结束！', 'error');
        } else {
          const games = $(data.responseText).find('.game_grid_widget.promo_game_grid a.thumb_link.game_link');
          for (const e of games) {
            await isOwn(e.href);
          }
        }
      } else {
        log('请求失败！', 'error');
        log(data);
      }
    } else if (/^https?:\/\/.+?\.itch\.io\/[^/]+?(\/purchase)?$/.test(url)) {
      await isOwn(url.replace('/purchase', ''));
    } else if (/^https?:\/\/.+?\.itch\.io\/[^/]+?(\/purchase)\?reward_id=/.test(url)) {
      await isOwn(url);
    }
  }
  async function isOwn(url) {
    log(`当前游戏链接: <br/>${url}`);
    log(`正在检测游戏是否拥有...<br/>${url}`);
    const data = await httpRequest({
      url,
      method: 'get'
    });
    if (data.status === 200) {
      if (data.responseText.includes('purchase_banner_inner')) {
        log('游戏已拥有！', 'success');
      } else {
        await purchase(url);
      }
    } else {
      log('请求失败！', 'error');
      log(data);
    }
  }
  async function purchase(url) {
    try {
      log(`正在加载购买页面...<br/>${url}`);
      const purchaseUrl = url.includes('/purchase') ? url : `${url}/purchase`;
      const data = await httpRequest({
        url: purchaseUrl,
        method: 'get'
      });
      if (data.status === 200) {
        const html = $(data.responseText);
        if (/0\.00/gim.test(html.find('.button_message:first .dollars[itemprop]').text()) || /0\.00/gim.test(html.find('.money_input').attr('placeholder')) || /自己出价|Name your own price/gim.test(html.find('.button_message:first .buy_message').text())) {
          const csrf_token = html.find('[name="csrf_token"]').val();
          const reward_id = html.find('[name="reward_id"]').val();
          await download(purchaseUrl.replace(/\/purchase.*/, ''), csrf_token, reward_id);
        } else {
          log('价格不为 0, 可能活动已结束！', 'error');
        }
      } else {
        log('请求失败！', 'error');
        log(data);
      }
    } catch (error) {
      log('请求失败！', 'error');
      log(error);
    }
  }
  async function download(url, csrf_token, reward_id) {
    log(`正在请求下载页面...<br/>${url}`);
    const data = await httpRequest({
      url: `${url}/download_url`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: `csrf_token=${encodeURIComponent(csrf_token)}${reward_id ? (`&reward_id=${reward_id}`) : ''}`,
      responseType: 'json'
    });
    if (data.status === 200 && data.response && data.response.url) {
      await loadDownload(data.response.url, url);
    } else {
      log('请求失败！', 'error');
      log(data);
    }
  }

  async function loadDownload(e, referer) {
    log('正在加载下载页面...');
    const url = new URL(e);
    const data = await httpRequest({
      url: url.href,
      method: 'get',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        DNT: 1,
        Host: url.hostname,
        Referer: referer,
        'sec-ch-ua': '"\\\\Not;A\\"Brand";v="99", "Google Chrome";v="85", "Chromium";v="85"',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4164.2 Safari/537.36'
      }
    });
    if (data.status === 200 && data.responseText) {
      const html = $(data.responseText);
      const claimBtn = html.find('button.button:contains("Link"),button.button:contains("Claim"),button.button:contains("链接")');
      const form = html.find('form[action*="claim-key"]');
      if (/This page is linked|此页面已链接到帐户/gim.test(html.find('div.inner_column').text()) || html.find('a.button.download_btn[data-upload_id]').length > 0) {
        log('领取成功！', 'success');
      } else if (form.length > 0) {
        const url = form.attr('action');
        const csrf_token = form.find('input[name="csrf_token"]').val();
        await claimame(url, csrf_token, url.href);
      } else if (claimBtn.length > 0 && claimBtn.parents('form').length > 0) {
        const form = claimBtn.parents('form');
        const url = form.attr('action');
        const csrf_token = form.find('input[name="csrf_token"]').val();
        await claimame(url, csrf_token, url.href);
      } else if (data.finalUrl.includes('/register')) {
        log('领取失败，请先登录！', 'error');
      } else {
        log('领取完成，结果未知！', 'success');
      }
    } else {
      log('请求失败！', 'error');
      log(data);
    }
    if (typeof checkItchGame === 'function') checkItchGame();
  }
  async function claimame(e, token, referer) {
    log('正在领取游戏...');
    const url = new URL(e);
    const data = await httpRequest({
      url: url.href,
      method: 'post',
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'max-age=0',
        'Content-Type': 'application/x-www-form-urlencoded',
        DNT: 1,
        Host: url.hostname,
        Origin: url.origin,
        Referer: referer,
        'sec-ch-ua': '"\\\\Not;A\\"Brand";v="99", "Google Chrome";v="85", "Chromium";v="85"',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4164.2 Safari/537.36'
      },
      data: `csrf_token=${encodeURIComponent(token)}`
    });
    if (data.status === 200 && data.responseText) {
      const html = $(data.responseText);
      if (/This page is linked|此页面已链接到帐户/gim.test(html.find('div.inner_column').text()) || html.find('a.button.download_btn[data-upload_id]').length > 0) {
        log('领取成功！', 'success');
      } else {
        log('领取完成，结果未知！', 'success');
      }
    } else if (data.finalUrl.includes('/register')) {
      log('请先登录！', 'error');
      log(data);
    } else {
      log('请求失败！', 'error');
      log(data);
    }
  }
  function httpRequest(option, i = 0) {
    return new Promise((resolve, reject) => {
      option.onload = (data) => {
        resolve(data);
      };
      option.onerror = reject;
      option.ontimeout = reject;
      option.onabort = reject;
      option.timeout = 30000;
      GM_xmlhttpRequest(option);
    }).then((data) => data)
      .catch(() => {
        if (i > 1) {
          return {};
        }
        return httpRequest(option, ++i);
      });
  }
  GM_addStyle('.swal2-title.break-all{word-wrap:break-word; word-break:break-all;}');
}());
