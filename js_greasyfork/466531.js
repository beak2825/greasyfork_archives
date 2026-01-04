// ==UserScript==
// @name         LZT Helper
// @version      0.1
// @description  LZT Helper dev build
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @grant        none
// @namespace https://greasyfork.org/users/1080731
// @downloadURL https://update.greasyfork.org/scripts/466531/LZT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/466531/LZT%20Helper.meta.js
// ==/UserScript==


(async function() {
  let SCRIPT_STATUS = false;
  const api_endpoints = {
    'getThemes': 'https://lztupgrade.toiloff.ru/api/themes',
    'getLogos': 'https://lztupgrade.toiloff.ru/api/logos',
    'getLogoByUID': 'https://lztupgrade.toiloff.ru/api/logo',
  }

  const currentDomain = window.location.hostname;

  if (typeof GM_addStyle === 'undefined') {
    GM_addStyle = (aCss) => {
      'use strict';
      let head = document.getElementsByTagName('head')[0];
      if (head) {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
      }
      return null;
    };
  };
    
    if (GM_info?.script?.version) Logger.log(`LZT Upgrade version: ${GM_info?.script?.version}`);

  if (typeof GM_getResourceText === 'undefined') {
    fetch('https://raw.githubusercontent.com/ilyhalight/lzt-upgrade/master/public/css/style.css')
    .then((response) => response.text().then(styles => GM_addStyle(styles)));
    fetch('https://raw.githubusercontent.com/ilyhalight/lzt-upgrade/master/public/css/coloris.css')
    .then((response) => response.text().then(coloris => GM_addStyle(coloris)));
  } else {
    const styles = GM_getResourceText("styles");
    const coloris = GM_getResourceText("coloris");
    GM_addStyle(styles);
    GM_addStyle(coloris);
  }

  const uniqueStyleDB = new LZTUniqueStyleDB();
  const contestsDB = new LZTContestsDB();
  const usersDB = new LZTUsersDB();
  const appearDB = new LZTAppearDB();
  const settingsDB = new LZTSettingsDB();

  let isUniqueDBInited = uniqueStyleDB.init().then(value => {return(value)}).catch(err => {Logger.error(err); return false});
  let isContestsDBInited = await contestsDB.init().then(value => {return(value)}).catch(err => {Logger.error(err); return false});
  let isUsersDBInited = await usersDB.init().then(value => {return(value)}).catch(err => {Logger.error(err); return false});
  let isAppearDBInited = await appearDB.init().then(value => {return(value)}).catch(err => {Logger.error(err); return false});
  let isSettingsDBInited = await settingsDB.init().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

  if (isAppearDBInited) {
    var dbAppearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
    if (dbAppearData.theme > 0) {
      $.ajax({
        url: api_endpoints['getThemes'],
        dataType: 'json',
        success: (value) => {
          if (value && value.length) {
            value.forEach(async(theme) => {
              if (theme.active === 1 && theme.uid === dbAppearData.theme) {
                  await loadTheme(theme.file);
              };
            });
          };
        },
        error: (err) => Logger.log('Не удалось получить список тем ', err)
      });
    }
  }

  const SCRIPT_LOADER = setInterval(async () => {
    if ($('body').length && $('head title').length) {
      if (!SCRIPT_STATUS) {
        Logger.log('Пытаемся запустить скрипт...');
        const res = START_SCRIPT();
        if (res === 'not auth') {
          Logger.log('Вы не авторизованы');
          clearInterval(SCRIPT_LOADER);
        };
      } else if ($('#LZTUpButton').length){
        Logger.log('Скрипт уже запущен. Удаление проверки на запуск...');
        clearInterval(SCRIPT_LOADER);
      } else {
        Logger.log('Скрипт не был запущен. Повторяем попытку...');
        START_SCRIPT();
      }
    } else {
      Logger.log('Скрипт не был запущен. Ожидание загрузки страницы...');
    }
  }, 5)

  const START_SCRIPT = async () => {
    Logger.log('Скрипт был запущен');
    SCRIPT_STATUS = true;
    // Error page
    if (/^(Error\s[0-9]{3}|Site\sMaintenance)$/.test($('head title').text())) {
      let body = $('body');
      if (body.attr('id') !== 'LZTUpErrorPage') {
        body.attr('id', 'LZTUpErrorPage');
        body.find('article > div').append('<img src="https://i.imgur.com/iVmKDr7.gif" alt="utya_duck_rain" loading="lazy">');
      }
      return 'not auth';
    }

    function getHeight() {
      let height = Math.max( document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
      Logger.log('Page height: ' + height);
      return height;
    }

    let heightOnLoad;

    // TODO: realize this
    const blockAds = '(Native/\\.NET файлов|threads\\/|easyliker\\.ru|niccord\\.ru|vpromotions\\.ru|skysmm\\.ru|VerifTeam|SmmPanelUS\\.com|t\\.me/lztnext|axxishop\\.ru|LIGHTSHOP\\.SU)';

    const username = $('.accountUsername span').text();

    const getUserid = () => {
      return XenForo._csrfToken.split(',')[0]
    }

    const getUserAvatar = () => {
      return $('img.navTab--visitorAvatar').attr('src');
    }

    const sleep = m => new Promise(r => setTimeout(r, m))

    const menuBtn = $('<li><a id="LZTUpButton">LZT Upgrade</a></li>');

    const reportButtonsList = [
      {
        id: 1,
        name: 'Оффтоп',
        alternativeName: '1.1',
        reason: 'Флуд / Оффтоп / Спам / Бесполезная тема'
      },
      {
        id: 2,
        name: 'Раздел',
        alternativeName: '2.12',
        reason: 'Создание темы не в соответствующем разделе'
      },
      {
        id: 3,
        name: 'Оформление',
        alternativeName: '3.2',
        reason: 'Неправильное оформление темы'
      },
    ]

    const noticesList = [
      {
        id: 1,
        name: 'scamNotice'
      },
      {
        id: 2,
        name: 'vpnNotice'
      },
    ]

    const availabledGroups = [
      {
        "name": "admin", // value="admin"
        "groupName": "Администратор",
        "uniqueStyle": ".style3", // if starting with "." - is a class name else style
        "bannerStyle": ".admin", // if starting with "." - is a class name else style
        "bannerText": "Администратор",
        "badgeIcon": ".admin", // if starting with "." - is a class name else style
        "badgeText": "Администратор"
      },
      {
        "name": "Designer",
        "groupName": "Дизайнер",
        "uniqueStyle": ".style9",
        "bannerStyle": ".Designer",
        "bannerText": "Дизайнер",
        "badgeIcon": ".Designer",
        "badgeText": "Дизайнер"
      },
      {
        "name": "headDesigner",
        "groupName": "Главный дизайнер",
        "uniqueStyle": ".style350",
        "bannerStyle": ".headDesigner",
        "bannerText": "Главный дизайнер",
        "badgeIcon": ".headDesigner",
        "badgeText": "Главный дизайнер"
      },
      {
        "name": "editor",
        "groupName": "Редактор",
        "uniqueStyle": ".style349",
        "bannerStyle": ".editor",
        "bannerText": "Редактор",
        "badgeIcon": ".editor",
        "badgeText": "Редактор"
      },
      {
        "name": "sponsor",
        "groupName": "Спонсор",
        "uniqueStyle": ".style359",
        "bannerStyle": ".sponsor",
        "bannerText": "Спонсор",
        "badgeIcon": ".sponsor",
        "badgeText": "Спонсор"
      },
      {
        "name": "coder",
        "groupName": "Разработчик",
        "uniqueStyle": ".style7",
        "bannerStyle": ".coder",
        "bannerText": "Разработчик",
        "badgeIcon": ".coder",
        "badgeText": "Разработчик"
      },
      {
        "name": "moder",
        "groupName": "Модератор",
        "uniqueStyle": ".style4",
        "bannerStyle": ".moder",
        "bannerText": "Модератор",
        "badgeIcon": ".moder",
        "badgeText": "Модератор"
      },
      {
        "name": "curator",
        "groupName": "Куратор",
        "uniqueStyle": ".style29",
        "bannerStyle": ".curator",
        "bannerText": "Куратор",
        "badgeIcon": ".curator",
        "badgeText": "Куратор"
      },
      {
        "name": "arbitr",
        "groupName": "Арбитр",
        "uniqueStyle": ".style30",
        "bannerStyle": ".arbitr",
        "bannerText": "Арбитр",
        "badgeIcon": ".arbitr",
        "badgeText": "Арбитр"
      },
      {
        "name": "Legend",
        "groupName": "Легенда",
        "uniqueStyle": ".style26",
        "bannerStyle": ".Legend",
        "bannerText": "Легенда",
        "badgeIcon": ".Legend",
        "badgeText": "Легенда"
      },
      {
        "name": "Supreme",
        "groupName": "Суприм",
        "uniqueStyle": ".style8",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
      {
        "name": "Ikarus",
        "groupName": "Искусственный интеллект",
        "uniqueStyle": ".style351",
        "bannerStyle": ".Ikarus",
        "bannerText": "Искусственный интеллект",
        "badgeIcon": ".Ikarus",
        "badgeText": "Искусственный интеллект"
      },
      {
        "name": "guru",
        "groupName": "Гуру",
        "uniqueStyle": ".style60",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
      {
        "name": "expert",
        "groupName": "Эксперт",
        "uniqueStyle": ".style23",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
      {
        "name": "lodger",
        "groupName": "Постоялец",
        "uniqueStyle": ".style22",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
      {
        "name": "newbie",
        "groupName": "Новичок",
        "uniqueStyle": ".style21",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
      {
        "name": "telegramBot",
        "groupName": "Телеграм бот",
        "uniqueStyle": ".style21",
        "bannerStyle": ".telegramBot",
        "bannerText": "Телеграм бот",
        "badgeIcon": ".telegramBot",
        "badgeText": "Телеграм бот"
      },
      {
        "name": "banned",
        "groupName": "Заблокированный",
        "uniqueStyle": ".banned",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
      {
        "name": "marketSeller",
        "groupName": "Привилегии на маркете",
        "uniqueStyle": ".style65",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
      {
        "name": "forumSeller",
        "groupName": "Продавец на форуме",
        "uniqueStyle": ".style11",
        "bannerStyle": "",
        "bannerText": "",
        "badgeIcon": "",
        "badgeText": ""
      },
    ]

    const informationLinks = [
      {
        id: 1,
        icon: 'far fa-donate',
        name: 'Поддержать разработку',
        desc: 'Все донаты идут на улучшение расширения',
        href: `https://lzt.market/balance/transfer?redirect=https%3A%2F%2Fzelenka.guru&username=${GM_info?.script?.author}`
      },
      // {
      //   id: 2,
      //   icon: 'far fa-comments',
      //   name: 'Тема на форуме',
      //   desc: 'Обсуждение расширения на форуме',
      //   href: `https://${currentDomain}/threads/XXXXXXX`
      // },
      {
        id: 2,
        icon: 'fab fa-telegram-plane',
        name: 'Telegram-Канал',
        desc: 'Информирование о новых обновлениях',
        href: `https://t.me/lzt_upgrade`
      },
      {
        id: 3,
        icon: 'fab fa-telegram-plane',
        name: 'Telegram-Чат',
        desc: 'Обсуждение расширения в Telegram',
        href: `https://t.me/lzt_upgrade_chat`
      },
    ]

    function validateAuthors(authorID, authorName) {
      if (typeof (authorID) === 'string') {
        if (authorID.includes(',') && authorName.includes(',')) {
          let authorIDArray = authorID.split(',');
          let authorNameArray = authorName.split(',');
          let res = '';
          for (i = 0; i < authorIDArray.length; i++) {
            res += `<a href="https://${window.location.hostname}/members/${authorIDArray[i]}">${XenForo.htmlspecialchars(authorNameArray[i])}</a>${i === authorIDArray.length - 1 ? '' : ', '}`;
          }
          return res;
        } else {
          return `<a href="https://${window.location.hostname}/members/${authorID}">${XenForo.htmlspecialchars(authorName)}</a>`;
        }
      } else if (typeof (authorID) === 'number') {
        return `<a href="https://${window.location.hostname}/members/${authorID}">${XenForo.htmlspecialchars(authorName)}</a>`;
      } else {
        return `${XenForo.htmlspecialchars(authorName)}`;
      }
    }

    $(menuBtn).on('click', async function () {
      let badgeFill;
      let badgeStroke;
      let noticesMarks;

      let forumLogo;
      let marketLogo;

      let reportButtonsInPost;
      let themeID;
      let themeAutoReload;

      async function getUniqueContent() {
        try {
          const uniqueData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          const nickStyle = uniqueData.nickStyle;
          const bannerStyle = uniqueData.bannerStyle;
          const bannerText = uniqueData.bannerText;
          const badgeText = uniqueData.badgeText;
          const badgeIcon = uniqueData.badgeIcon;
          badgeFill = uniqueData.badgeFill;
          badgeStroke = uniqueData.badgeStroke;
          noticesMarks = uniqueData.noticesMarks;
          const profileBackground = uniqueData.profileBackground;
          const profileBackgroundEverywhere = uniqueData.profileBackgroundEverywhere;

          return `
            <div id="LZTUpModalComment">
              На этой странице можно выбрать стиль вашего ника и лычки. Этот стиль виден только вам. После <a href="https://lolz.guru/account/upgrades?upgrade_id=14" target="_blank">покупки</a> настоящего уника его увидят все.
            </div>

            <div class="LZTUpModalBlock">
              <div id="LZTUpPreviewContainer" class="previewContainer">
                <div class="avatarBox">
                  <div class="avatarUserBadges">
                    <span id="LZTUpPreviewBadge" class="avatarUserBadge uniq_default badgeDefaultBackground Tooltip" tabindex="0" title="${uniqueData.badgeText}" style="${uniqueData.bannerStyle}"></span>
                  </div>
                  <a href="members/${getUserid()}/" class="avatar Av${getUserid()}m" data-avatarhtml="true">
                    <span class="img m" style="background-image: url(${getUserAvatar()})"></span>
                  </a>
                </div>
                <div class="info">
                  <span id="LZTUpUsernameStyle" class="UsernameStyle bold" style="${uniqueData.nickStyle}">${username}</span>
                  <div class="bannerOrStatus">
                    <em id="LZTUpUserBannerStyle" class="UserBannerStyle userBanner" style="${uniqueData.bannerStyle}">${uniqueData.bannerText}</em>
                  </div>
                </div>
              </div>
            </div>
            <div class="LZTUpModalBlockButtons">
              <select id="LZTUpSelectGroupsUniq" class="button" type="button">
                <option disabled selected value="none">Выбрать из групп форума</option>
              </select>
              <a href="https://${window.location.hostname}/account/uniq/test" class="button" target="_blank">
                <span>
                  <span class="SpoilerTitle">Выбрать готовый уник</span>
                </span>
              </a>
              <a href="https://mxidentic.github.io/lolzteam_uniq/" class="button" target="_blank">
                <span>
                  <span class="SpoilerTitle">Генератор уников</span>
                </span>
              </a>
            </div>

            <div id="LZTUpModalNoticesContainer">

            </div>

            <div id="LZTUpModalHeading" class="textHeading">Стиль ника:</div>
            <div id="LZTUpModalText" class="muted explain">Максимум 1500 символов. При отсутствии кода используется цвет вашей группы с форума.</div>
            <textarea id="LZTUpUniqueStyle" class="UsernameCss textCtrl" maxlength="1500">${nickStyle}</textarea>

            <div id="LZTUpModalHeading" class="textHeading">Стиль лычки:</div>
            <div id="LZTUpModalText" class="muted explain">Максимум 1500 символов.</div>
            <textarea id="LZTUpBannerStyle" class="BannerCss textCtrl" maxlength="1500">${bannerStyle}</textarea>

            <div id="LZTUpModalHeading" class="textHeading">Текст в лычке:</div>
            <div id="LZTUpModalText" class="muted explain">Максимум 24 символа. При отсутствии текста лычка не будет видна.</div>
            <input id="LZTUpBannerText" type="text" maxlength="24" class="textCtrl" value="${XenForo.htmlspecialchars(bannerText)}">

            <div id="LZTUpModalHeading" class="textHeading">Иконка на аватарке:</div>
            <div id="LZTUpModalText" class="muted explain">
              <a href="/threads/3405752/" class="mainc">[Гайд] Как правильно устанавливать свои иконки в уник</a>
              <br>
              <br>
              Максимумальная длина SVG - 3000 символов. При отсутствии значения будет установлено стандартная иконка.
            </div>
            <textarea id="LZTUpBadgeIcon" maxlength="3000" class="BadgeCss textCtrl">${badgeIcon}</textarea>

            <div id="LZTUpModalHeading" class="textHeading">Цвета иконки на аватарке:</div>
            <div id="LZTUpModalText" class="muted explain">Убедитесь, что в SVG нету заранее установленных значений 'fill' и 'stroke'.</div>
            <nobr>
              <div id="LZTUpBadgeFillContainer" class="mini">
                <div id="LZTUpModalText" class="muted explain">Цвет иконки (fill):</div>
                <input id="LZTUpBadgeFill" type="text" data-coloris class="textCtrl badge-fill-picker" value="${badgeFill}">
              </div>
            </nobr>
            <nobr>
              <div id="LZTUpBadgeStrokeContainer" class="mini" style="padding-top: 12px;">
                <div id="LZTUpModalText" class="muted explain" style="">Цвет иконки (stroke):</div>
                <input id="LZTUpStrokeFill" type="text" data-coloris class="textCtrl badge-stroke-picker" value="${badgeStroke}">
              </div>
            </nobr>

            <div id="LZTUpModalHeading" class="textHeading">Текст иконки на аватарке:</div>
            <div id="LZTUpModalText" class="muted explain">Максимум 24 символа. При отсутствии текста иконка не будет видна.</div>
            <input id="LZTUpBadgeText" maxlength="24" type="text" class="textCtrl" value="${XenForo.htmlspecialchars(badgeText)}">

            <div id="LZTUpModalHeading" class="textHeading">Фон в профиле</div>
            <input id="LZTUpProfileBackground" type="text" class="textCtrl" placeholder="Ссылка на изображение" value="${XenForo.htmlspecialchars(profileBackground)}">

            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="profile_background_everywhere" ${profileBackgroundEverywhere === 1 ? "checked" : ''}>
              <label for="profile_background_everywhere">Заменить фон на всех страницах форума</label>
            </div>

            <input id="LZTUpSaveUniqueDB" type="button" value="Сохранить" class="button primary save_button">
            <input id="LZTUpResetUniqueDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Локального уника": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Локального уника" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetUniqueDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      async function getContestsContent() {
        try {
          const contestsData = await contestsDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          const contestsTen = contestsData.contestsTen;
          const contestsAll = contestsData.contestsAll;
          const contestsInfoTop = contestsData.contestsInfoTop;
          const contestsBtnTopInBlock = contestsData.contestsBtnTopInBlock;
          const contestsHideTags = contestsData.contestsHideTags;
          const contestsAutoClose = contestsData.contestsAutoClose;
          const contestsRmContent = contestsData.contestsRmContent;
          const contestsShowWinChance = contestsData.contestsShowWinChance;

          return `
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_open_ten" ${contestsTen === 1 ? "checked" : ''}>
              <label for="contests_open_ten">Кнопка "Открыть 10"</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_open_all" ${contestsAll === 1 ? "checked" : ''}>
              <label for="contests_open_all">Кнопка "Открыть прогруженные"</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_info_top" ${contestsInfoTop === 1 ? "checked" : ''}>
              <label for="contests_info_top">Отображение информации о розыгрыше вверху темы</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_btn_top_in_block" ${contestsBtnTopInBlock === 1 ? "checked" : ''}>
              <label for="contests_btn_top_in_block">Отображение кнопки "Участвовать" выше блока с информацией о розыгрыше</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_hide_tags" ${contestsHideTags === 1 ? "checked" : ''}>
              <label for="contests_hide_tags">Скрытие тегов в теме розыгрыша</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_auto_close" ${contestsAutoClose === 1 ? "checked" : ''}>
              <label for="contests_auto_close">Автозакрытие страницы при нажатие на кнопку "Участвовать"</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_rm_content" ${contestsRmContent === 1 ? "checked" : ''}>
              <label for="contests_rm_content">Скрытие содержимого и голосований в теме розыгрыша</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="contests_show_win_chance" ${contestsShowWinChance === 1 ? "checked" : ''}>
              <label for="contests_show_win_chance">Показывать шанс победы в розыгрыше</label>
            </div>
            <input id="LZTUpResetContestsDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Розыгрышей": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Розыгрышей" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetContestsDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      async function getUsersContent() {
        try {
          const usersData = await usersDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          const showUseridInProfile = usersData.showUseridInProfile;
          const showFullRegInProfile = usersData.showFullRegInProfile;
          const disableShowTyping = usersData.disableShowTyping;

          return `
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="show_userid_in_profile" ${showUseridInProfile === 1 ? "checked" : ''}>
              <label for="show_userid_in_profile">Показывать UserID в профиле пользователя</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="show_fullreg_in_profile" ${showFullRegInProfile === 1 ? "checked" : ''}>
              <label for="show_fullreg_in_profile">Показывать полную дату регистрации в профиле пользователя</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="disable_show_typing" ${disableShowTyping === 1 ? "checked" : ''}>
              <label for="disable_show_typing">
                Отключить отправку информации о наборе сообщения
                <span class="fa fa-exclamation-triangle Tooltip" title="При включение/отключение этой функции страница будет перезагружена"></span>
              </label>
            </div>
            <input id="LZTUpResetUsersDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Пользователей": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Пользователей" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetUsersDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      async function getAppearContent() {
        try {
          const appearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          const hideUnreadArticleCircle = appearData.hideUnreadArticleCircle;
          const hideTagsInThreads = appearData.hideTagsInThreads;

          const hideCounterAlerts = appearData.hideCounterAlerts;
          const hideCounterConversations = appearData.hideCounterConversations;

          const backgroundEffect = appearData.backgroundEffect;
          const hideOnlyfans = appearData.hideOnlyfans;
          const showPollsResults = appearData.showPollsResults;

          return `
            <div id="LZTUpLogoSection" class="LZTUpModalSection">
              <div class="LZTUpModalSectionContent">
                <i id="LZTUpIcon" class="far fa-comments"></i>
                <div class="LZTUpModalSectionTexts">
                  <span id="LZTUpText">Логотип</span>
                  <span id="LZTUpSubText">Выберите логотип для форума из списка</span>
                </div>
                <i id="LZTUpIcon" class="far fa-angle-right gray right"></i>
              </div>
            </div>
            <div id="LZTUpMarketLogoSection" class="LZTUpModalSection">
              <div class="LZTUpModalSectionContent">
                <i id="LZTUpIcon" class="far fa-shopping-cart"></i>
                <div class="LZTUpModalSectionTexts">
                  <span id="LZTUpText">Логотип маркета</span>
                  <span id="LZTUpSubText">Выберите логотип для маркета из списка</span>
                </div>
                <i id="LZTUpIcon" class="far fa-angle-right gray right"></i>
              </div>
            </div>
            <div id="LZTUpThemesSection" class="LZTUpModalSection">
              <div class="LZTUpModalSectionContent">
                <i id="LZTUpIcon" class="far fa-paint-brush"></i>
                <div class="LZTUpModalSectionTexts">
                  <span id="LZTUpText">Менеджер тем</span>
                  <span id="LZTUpSubText">Выберите тему для форума из списка</span>
                </div>
                <i id="LZTUpIcon" class="far fa-angle-right gray right"></i>
              </div>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="hide_unread_article_circle" ${hideUnreadArticleCircle === 1 ? "checked" : ''}>
              <label for="hide_unread_article_circle">Скрыть значок непрочитанных статей в шапке сайта</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="hide_tags_in_threads" ${hideTagsInThreads === 1 ? "checked" : ''}>
              <label for="hide_tags_in_threads">Скрыть теги в темах</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="hide_counter_alerts" ${hideCounterAlerts === 1 ? "checked" : ''}>
              <label for="hide_counter_alerts">Скрыть счётчик уведомлений в навбаре</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="hide_counter_conversations" ${hideCounterConversations === 1 ? "checked" : ''}>
              <label for="hide_counter_conversations">Скрыть счётчик сообщений в навбаре</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="enable_background_effect" ${backgroundEffect === 1 ? "checked" : ''}>
              <label for="enable_background_effect">Включить снег (by <a href="/members/576497/" class="muted">Karasu_</a>)</label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="hide_onlyfans" ${hideOnlyfans === 1 ? "checked" : ''}>
              <label for="hide_onlyfans">
                Спрятать все темы с тегом Onlyfans
                <span class="fa fa-exclamation-triangle Tooltip" title="При включение/отключение этой функции страница будет перезагружена"></span>
              </label>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="show_polls_results" ${showPollsResults === 1 ? "checked" : ''}>
              <label for="show_polls_results">
                Показывать результаты голосований
                <span class="fa fa-exclamation-triangle Tooltip" title="Доступно, только, в голосованиях, в которых разрешено видеть результаты заранее"></span>
              </label>
            </div>
            <div id="LZTUpModalReportButtonsContainer">
              <div class="bold title">Кнопки быстрого репорта в посте:</div>
              <ul>
              </ul>
            </div>
            <input id="LZTUpResetAppearDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Внешнего вида": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Внешнего вида" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetAppearDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      async function getAppearLogosContent() {
        try {
          const appearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          forumLogo = appearData.forumLogo;
          const defaultLogoImg = 'https://raw.githubusercontent.com/ilyhalight/lzt-upgrade/master/public/static/img/logos/forum/default.svg';

          return `
            <div id="LZTUpModalCell">
              <div class="bold title">Логотип:</div>
              <div class="LZTUpModalMesh" id="LZTUpModalLogosContainer">
                <div class="LZTUpModalMeshItem ${forumLogo === 0 ? 'active' : ''}" id="set_default_logo" data-checked="${forumLogo === 0 ? 'true' : 'false'}">
                  <img src="${defaultLogoImg}" alt="logo">
                  <span class="LZTUpModalMeshItemName" data-shortname="default">По умолчанию</span>
                  <span class="LZTUpModalMeshItemAuthor">Lolzteam</span>
                </div>
              </div>
            </div>
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Внешнего вида (Логотипы)": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Внешнего вида" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetAppearDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      async function getAppearMarketLogosContent() {
        try {
          const appearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          marketLogo = appearData.marketLogo;
          const defaultMarketLogoImg = 'https://raw.githubusercontent.com/ilyhalight/lzt-upgrade/master/public/static/img/logos/market/default.svg';

          return `
            <div id="LZTUpModalCell">
              <div class="bold title">Логотип маркета:</div>
              <div class="LZTUpModalMesh" id="LZTUpModalMarketLogosContainer">
                <div class="LZTUpModalMeshItem ${marketLogo === 0 ? 'active' : ''}" id="set_default_marketlogo" data-checked="${marketLogo === 0 ? 'true' : 'false'}">
                  <img src="${defaultMarketLogoImg}" alt="logo">
                  <span class="LZTUpModalMeshItemName" data-shortname="default">По умолчанию</span>
                  <span class="LZTUpModalMeshItemAuthor">Lolzteam</span>
                </div>
              </div>
            </div>
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Внешнего вида (Логотипы маркета)": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Внешнего вида" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetAppearDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      async function getAppearThemesContent() {
        try {
          const appearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          themeID = appearData.theme;
          themeAutoReload = appearData.themeAutoReload;

          return `
            <div id="LZTUpModalCell">
              <div id="LZTUpModalChecksContainer">
                <input type="checkbox" id="theme_auto_reload" ${themeAutoReload === 1 ? "checked" : ''}>
                <label for="theme_auto_reload">
                  Автоматически обновлять страницу после смены темы
                  <span class="fa fa-exclamation-triangle Tooltip" title="При включение/отключение этой функции страница будет перезагружена"></span>
                </label>
              </div>
              <div id="LZTUpModalCell">
                <div class="bold title">Темы:</div>
                <div class="LZTUpModalMesh" id="LZTUpModalThemesContainer">
                  <div class="LZTUpModalMeshItem theme ${themeID === 0 ? 'active' : 'none'}" id="set_default_theme" data-checked="${themeID === 0 ? 'true' : 'false'}">
                    <span class="LZTUpModalMeshItemName" data-shortname="default">Обычная</span>
                    <span class="LZTUpModalMeshItemAuthor">Lolzteam</span>
                  </div>
                </div>
              </div>
            </div>
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Внешнего вида (темы)": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Внешнего вида" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetAppearDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      async function getSettingsContent() {
        return `
          <div id="LZTUpIconButton" class="LZTUpSaveSettings">
            <i id="LZTUpIcon" class="far fa-file-download"></i>
            <span id="LZTUpText">Сохранить настройки в файл</span>
          </div>
          <div id="LZTUpIconButton" class="LZTUpUploadSettings">
            <i id="LZTUpIcon" class="far fa-upload"></i>
            <span id="LZTUpText">Загрузить настройки из файла</span>
          </div>
        `
      }

      async function getUpdatesContent() {
        try {
          const settingsData = await settingsDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});

          const checkUpdatesOnLoad = settingsData.checkUpdatesOnLoad;

          return `
            <div id="LZTUpIconButton" class="LZTUpCheckUpdate">
              <i id="LZTUpIcon" class="far fa-cloud-download"></i>
              <span id="LZTUpText">Проверить наличие обновлений</span>
            </div>
            <div id="LZTUpModalChecksContainer">
              <input type="checkbox" id="check_updates_on_load" ${checkUpdatesOnLoad === 1 ? "checked" : ''}>
              <label for="check_updates_on_load">Проверять обновления при загрузке страницы</label>
            </div>
          `
        } catch (e) {
          Logger.error(`Не удалось загрузить меню "Настроек": ${e.message}`);
          return `
            <div id="LZTUpModalComment">
              Ваша база данных "Настроек" повреждена. Пожалуйста, сбросьте настройки с помощью кнопки ниже.
            </div>
            <input id="LZTUpResetSettingsDB" type="button" value="Сбросить настройки" class="button reset_button">
          `
        }
      }

      const overlay = registerModal(
        'LZT Upgrade',
        `
        <ul class="tabs" id="LZTUpTabs">
          <li class="active" id="LZTUpTab">
            <span>Главная</span>
          </li>
          <li id="LZTUpTab">
            <span>Настройки</span>
          </li>
        </ul>
        <div id="LZTUpList" class="LZTUpMainList">
          <div id="LZTUpListItem" class="LZTUpUniqItem">
            <i id="LZTUpIcon" class="far fa-palette"></i>
            <div>
              <span id="LZTUpText">Локальный Уник</span>
              <span id="LZTUpSubText">Представь, можно не платить...</span>
            </div>
          </div>
          <div id="LZTUpListItem" class="LZTUpContestsItem">
            <i id="LZTUpIcon" class="far fa-gift"></i>
            <div>
              <span id="LZTUpText">Розыгрыши</span>
              <span id="LZTUpSubText">Комфорт для розыгрышей</span>
            </div>
          </div>
          <div id="LZTUpListItem" class="LZTUpUsersItem">
            <i id="LZTUpIcon" class="far fa-user"></i>
            <div>
              <span id="LZTUpText">Пользователи</span>
              <span id="LZTUpSubText">Штучки для пользователей</span>
            </div>
          </div>
          <div id="LZTUpListItem" class="LZTUpAppearItem">
            <i id="LZTUpIcon" class="far fa-drafting-compass"></i>
            <div>
              <span id="LZTUpText">Внешний вид</span>
              <span id="LZTUpSubText">Темы, логотипы и другое</span>
            </div>
          </div>
        </div>
        <div id="LZTUpList" class="LZTUpSettingsList">
          <div id="LZTUpListItem" class="LZTUpSettingsItem">
            <i id="LZTUpIcon" class="far fa-cog"></i>
            <div>
              <span id="LZTUpText">Настройки</span>
              <span id="LZTUpSubText">Настройки расширения</span>
            </div>
          </div>
          <div id="LZTUpListItem" class="LZTUpUpdateItem">
            <i id="LZTUpIcon" class="far fa-cloud-download"></i>
            <div>
              <span id="LZTUpText">Обновления</span>
              <span id="LZTUpSubText">Установка и проверка обновлений расширения</span>
            </div>
          </div>
          <div id="LZTUpListItem" class="LZTUpInformationItem">
            <i id="LZTUpIcon" class="far fa-info-circle"></i>
            <div>
              <span id="LZTUpText">Информация</span>
              <span id="LZTUpSubText">Версия: ${GM_info?.script?.version}</span>
            </div>
          </div>
        </div>
        <div id="LZTUpUniqContainer" class="LZTUpSubMenu">
          ${await getUniqueContent()}
        </div>
        <div id="LZTUpContestsContainer" class="LZTUpSubMenu">
          ${await getContestsContent()}
        </div>
        <div id="LZTUpUsersContainer" class="LZTUpSubMenu">
          ${await getUsersContent()}
        </div>
        <div id="LZTUpAppearContainer" class="LZTUpSubMenu">
          ${await getAppearContent()}
        </div>
        <div id="LZTUpLogoSubContainer" class="LZTUpSubMenu">
          ${await getAppearLogosContent()}
        </div>
        <div id="LZTUpMarketLogoSubContainer" class="LZTUpSubMenu">
          ${await getAppearMarketLogosContent()}
        </div>
        <div id="LZTUpThemesSubContainer" class="LZTUpSubMenu">
          ${await getAppearThemesContent()}
        </div>
        <div id="LZTUpSettingsContainer" class="LZTUpSubMenu">
          ${await getSettingsContent()}
        </div>
        <div id="LZTUpUpdateContainer" class="LZTUpSubMenu">
          ${await getUpdatesContent()}
        </div>
        <div id="LZTUpInformationContainer" class="LZTUpSubMenu">
          <div id="LZTUpListLinks"></div>
        </div>
        `
      );

      const lztUpgradeModalMain = $('#LZTUpList').parent().parent();
      const lztUpgradeMainTitle = lztUpgradeModalMain.find('h2.heading');
      lztUpgradeMainTitle.attr('id', 'LZTUpModalMainTitle');

      availabledGroups.forEach(group => {
        const selectGroups = $('#LZTUpSelectGroupsUniq');
        selectGroups.append(`<option value="${group.name}">${group.groupName}</option>`)
      })

      async function setValueInMesh(target, container) {
        let containerChildrens = $(container).children();
        $(containerChildrens).attr('data-checked', 'false');
        $(containerChildrens).removeClass('active');
        let currentElement = $(target)[0].tagName.toLowerCase() === 'div' ? $(target) : $(target).parent();
        $(currentElement).attr('data-checked', 'true');
        $(currentElement).addClass('active');
      }

      function setDefaultInMesh(container) {
        let $logoSelect = $(container);
        if ($logoSelect.length === 1) {
          $logoSelect.children().addClass('active');
        }
      }

      // Загрузка логотипов форума
      // TODO: rewrite with market logo
      $.ajax({
        url: api_endpoints['getLogos'],
        dataType: 'json',
        data: {
          target: 1,
        },
        success: (value) => {
          if (value && value.length) {
            let $logoSelect = $('#LZTUpModalLogosContainer');
            value.forEach((logo) => {
              if (logo.active === 1) {
                let authorElem = validateAuthors(logo.author_userid, logo.author);
                let shortName = logo.name.replace(/ /g, '_').toLowerCase();
                $logoSelect.append(`
                <div class="LZTUpModalMeshItem ${forumLogo === logo.uid ? 'active' : ''}" id="set_${shortName}_logo" data-checked="${forumLogo === logo.uid ? 'true' : 'false'}">
                  <img src="${logo.preview}" alt="logo">
                  <span class="LZTUpModalMeshItemName" data-shortname="${shortName}">${XenForo.htmlspecialchars(logo.name)}</span>
                  <span class="LZTUpModalMeshItemAuthor">${authorElem}</span>
                </div>`);
                $(document).on('click', `#set_${shortName}_logo`, async function (event) {
                  await setValueInMesh(event.target, '#LZTUpModalLogosContainer');
                  await appearDB.update({forumLogo: logo.uid});
                  updateSiteLogo('main', logo.css);
                });
              }
            });
          }
        },
        error: (err) => {
          setDefaultInMesh('#LZTUpModalLogosContainer');
          Logger.log('Не удалось получить список логотипов форума ', err)
        }
      });

      $(document).on('click', `#set_default_logo`, async function (event) {
        await setValueInMesh(event.target, '#LZTUpModalLogosContainer');
        await appearDB.update({forumLogo: 0});
        updateSiteLogo('main', null);
      });

      // Загрузка логотипов маркета
      $.ajax({
        url: api_endpoints['getLogos'],
        dataType: 'json',
        data: {
          target: 2,
        },
        success: (value) => {
          if (value && value.length) {
            let $logoSelect = $('#LZTUpModalMarketLogosContainer');
            value.forEach((logo) => {
              if (logo.active === 1) {
                let authorElem = validateAuthors(logo.author_userid, logo.author);
                let shortName = logo.name.replace(/ /g, '_').toLowerCase();
                $logoSelect.append(`
                <div class="LZTUpModalMeshItem ${marketLogo === logo.uid ? 'active' : ''}" id="set_${shortName}_marketlogo" data-checked="${marketLogo === logo.uid ? 'true' : 'false'}">
                  <img src="${logo.preview}" alt="logo">
                  <span class="LZTUpModalMeshItemName" data-shortname="${shortName}">${XenForo.htmlspecialchars(logo.name)}</span>
                  <span class="LZTUpModalMeshItemAuthor">${authorElem}</span>
                </div>`);
                $(document).on('click', `#set_${shortName}_marketlogo`, async function (event) {
                  await setValueInMesh(event.target, '#LZTUpModalMarketLogosContainer');
                  await appearDB.update({marketLogo: logo.uid});
                  updateSiteLogo('market', logo.css);
                });
              }
            });
          };
        },
        error: (err) => {
          setDefaultInMesh('#LZTUpModalMarketLogosContainer');
          Logger.log('Не удалось получить список логотипов маркета ', err)
        }
      });

      $(document).on('click', `#set_default_marketlogo`, async function (event) {
        await setValueInMesh(event.target, '#LZTUpModalMarketLogosContainer');
        await appearDB.update({marketLogo: 0});
        updateSiteLogo('market', null);
      });

      // Загрузка тем
      // TODO: rewrite with logos
      $.ajax({
        url: api_endpoints['getThemes'],
        dataType: 'json',
        success: (value) => {
          if (value && value.length) {
            let $themeSelect = $('#LZTUpModalThemesContainer');
            value.forEach((theme) => {
              if (theme.active === 1) {
                let authorElem = validateAuthors(theme.author_userid, theme.author);
                let shortName = theme.name.replace(/ /g, '_').toLowerCase();
                $themeSelect.append(`
                <div class="LZTUpModalMeshItem theme ${themeID === theme.uid ? "active" : ''}" id="set_${shortName}_theme" data-checked="${themeID === theme.uid ? "true" : 'false'}" style="background:${theme.accent_color}">
                  <span class="LZTUpModalMeshItemName" data-shortname="${shortName}" style="color:${theme.text_color}">${XenForo.htmlspecialchars(theme.name)}</span>
                  <span class="LZTUpModalMeshItemAuthor">${authorElem}</span>
                </div>`);
                $(document).on('click', `#set_${shortName}_theme`, async function (event) {
                  await setValueInMesh(event.target, '#LZTUpModalThemesContainer');
                  await appearDB.update({theme: theme.uid});
                  registerAlert('Тема изменена. Обновите страницу, чтобы избежать багов с некорректным отображением стилей', 5000)
                  await loadTheme(theme.file);
                  if (themeAutoReload) {
                    await sleep(500);
                    window.location.reload()
                  }
                });
              }
            });
          };
        },
        error: (err) => {
          setDefaultInMesh('#LZTUpModalThemesContainer');
          Logger.error('Не удалось получить список тем ', err)
        }
      });

      $(document).on('click', `#set_default_theme`, async function (event) {
        await setValueInMesh(event.target, '#LZTUpModalThemesContainer');
        await appearDB.update({theme: 0});
        registerAlert('Устанаволена стандарная тема. Выполняю перезагрузку страницы...', 5000)
        await sleep(800);
        window.location.reload();
      });

      // Загрузка меток профиля
      const noticesContainer = $('#LZTUpModalNoticesContainer');
      for (const notice of noticesList) {
        let noticeStatus = '';
        if (typeof(noticesMarks) === 'string') {
          let notices = noticesMarks.split(',');
          if (notices.find(noticeMark => Number(noticeMark) === notice.id)) {
            noticeStatus = 'checked';
            $('#LZTUpUsernameStyle').after(`<span class="${notice.name}"></span>`);
          }
        }
        noticesContainer.append(`
          <input type="checkbox" id="set_${notice.id}_noticemark" value="${notice.name}" ${noticeStatus}>
          <label for="set_${notice.id}_noticemark">
            Метка <span class="${notice.name}"></span>
          </label>
        `);
      }

      // Загрузка кнопок быстрого репорта
      let $reportButtonsSelect = $('#LZTUpModalReportButtonsContainer > ul');
      for (const reportButton of reportButtonsList) {
        let btnStatus = '';
        if (typeof (reportButtonsInPost) === 'string') {
          let btns = reportButtonsInPost.split(',');
          if (btns.find(letter => Number(letter) === reportButton.id)) {
            btnStatus = 'checked';
          }
        }

        $reportButtonsSelect.append(`
          <li style = "list-style: none;">
            <label for="set_${reportButton.id}_reportbtn">
              <input type="checkbox" id="set_${reportButton.id}_reportbtn" value="${reportButton.name} (${reportButton.reason})" ${btnStatus}>
              ${reportButton.name} (${reportButton.reason})
            </label>
          </li>`);
      };

      // Загрузка информационных ссылок
      const listLinks = $('#LZTUpListLinks');
      for (const link of informationLinks) {
        const element = $(`
          <div id="LZTUpListItem">
            <i id="LZTUpIcon" class="${link.icon}"></i>
            <div>
              <span id="LZTUpText">${link.name}</span>
              <span id="LZTUpSubText">${link.desc}</span>
            </div>
          </div>
        `)

        element.on('click', () => window.open(link.href))
        listLinks.append(element)
      }

      var $LZTUpTabs = $('ul#LZTUpTabs');
      var $mainList = $('div.LZTUpMainList');
      var $settingsList = $('div.LZTUpSettingsList');
      var $uniqContainer = $('div#LZTUpUniqContainer');
      var $contestsContainer = $('div#LZTUpContestsContainer');
      var $usersContainer = $('div#LZTUpUsersContainer');
      var $appearContainer = $('div#LZTUpAppearContainer');
      var $logoSubContainer = $('div#LZTUpLogoSubContainer');
      var $marketLogoSubContainer = $('div#LZTUpMarketLogoSubContainer');
      var $themesSubContainer = $('div#LZTUpThemesSubContainer');
      var $settingsContainer = $('div#LZTUpSettingsContainer');
      var $updateContainer = $('div#LZTUpUpdateContainer');
      var $informationContainer = $('div#LZTUpInformationContainer');
      $settingsList.hide();
      $contestsContainer.hide();
      $usersContainer.hide();
      $uniqContainer.hide();
      $appearContainer.hide();
      $logoSubContainer.hide();
      $marketLogoSubContainer.hide();
      $themesSubContainer.hide();
      $settingsContainer.hide();
      $updateContainer.hide();
      $informationContainer.hide();

      async function createGoBackBtn(callback) {
        lztUpgradeModalMain.prepend($('<button id="LZTUpModalBackButton"><i class="fas fa-long-arrow-left"></i></button>'));
        $('#LZTUpModalBackButton').on('click', async () => {
          $('div.LZTUpSubMenu').hide();
          callback();
          $('.pcr-app').length ? $('.pcr-app').remove() : null;
        });
      }

      async function addGoBackBtn(target = '', elementToHide = undefined) {
        $('button#LZTUpModalBackButton').remove();
        return await createGoBackBtn(async () => {
          $('button#LZTUpModalBackButton').remove();
          if (target === 'appear' && typeof(elementToHide) !== 'undefined') {
            elementToHide.hide();
            $appearContainer.show();
            await addGoBackBtn();
            lztUpgradeMainTitle.text('Внешний вид');
          } else {
            $mainList.show();
            $LZTUpTabs.show();
            $settingsTab.removeClass('active');
            $mainTab.addClass('active');
            lztUpgradeMainTitle.text('LZT Upgrade');
          }
        });
      }

        /**
          @param {object} tab - tab object
          @param {string} text - text to show in title
        */
          async function updateMenu(tab, categoryContainer, text) {
            $(tab).hide();
            $LZTUpTabs.hide();
            $(categoryContainer).show();
            lztUpgradeMainTitle.text(text);
            await addGoBackBtn();
          }

        /**
          @param {object} category - category name (appear, ...)
          @param {string} categoryContainer - main category container to hide
          @param {string} subContainer - sub container to show
          @param {string} text - text to show in title
        */
          async function updateSubMenu(category, categoryContainer, subContainer, text) {
            $(categoryContainer).hide();
            $(subContainer).show();
            lztUpgradeMainTitle.text(text);
            await addGoBackBtn(category, subContainer);
          }

      $('ul#LZTUpTabs').parent().css("white-space", "unset"); // fixes so big free space in overlay
      var $menuTab = $('#LZTUpTabs > #LZTUpTab');
      var $mainTab, $settingsTab;
      $menuTab.toArray().forEach(element => {
        $(element).find('span').text() === 'Настройки' ? $settingsTab = $(element) : $mainTab = $(element);
      });

      if ($menuTab.length) {
        $mainTab.on('click', async () => {
          $($mainTab).find('span').text() === 'Главная' && !$mainTab.hasClass('active') ? (
            $settingsTab.removeClass('active'),
            $mainTab.addClass('active'),
            $settingsList.hide(),
            $mainList.show()
          ) : undefined;
        });

        $settingsTab.on('click', () => {
          $($settingsTab).find('span').text() === 'Настройки' && !$settingsTab.hasClass('active') ? (
            $mainTab.removeClass('active'),
            $settingsTab.addClass('active'),
            $mainList.hide(),
            $settingsList.show()
          ) : undefined;
        });

        $('div#LZTUpListItem.LZTUpUniqItem').on('click', async () => {
          await updateMenu($mainList, $uniqContainer, 'Локальный Уник');
          const LZTUpUniqueStyle = $('#LZTUpUniqueStyle');
          const LZTUpBannerStyle = $('#LZTUpBannerStyle');
          const LZTUpBannerText = $('#LZTUpBannerText');
          const LZTUpBadgeIcon = $('#LZTUpBadgeIcon');
          const LZTUpBadgeText = $('#LZTUpBadgeText');
          const LZTUpProfileBackground = $('#LZTUpProfileBackground');

          LZTUpUniqueStyle.trigger('change');
          LZTUpBannerStyle.trigger('change');
          LZTUpBannerText.trigger('change');
          LZTUpBadgeIcon.trigger('change');
          LZTUpBadgeText.trigger('change');
          LZTUpProfileBackground.trigger('change');
          const $svg = $('#LZTUpPreviewBadge > .customUniqIcon > svg');
          if ($svg.length) {
            $svg.attr('fill', badgeFill);
          }
          if ($svg.length) {
            $svg.attr('stroke', badgeStroke);
          }

          createColorPicker('.badge-fill-picker', '.xenOverlay');
          $('#LZTUpBadgeFill').on('input', (event) => {
            const $svg = $('#LZTUpPreviewBadge > .customUniqIcon > svg');
            if ($svg.length) {
              $svg.attr('fill', event.target.value);
            }
          });

          createColorPicker('.badge-stroke-picker', '.xenOverlay');
          $('#LZTUpStrokeFill').on('input', (event) => {
            const $svg = $('#LZTUpPreviewBadge > .customUniqIcon > svg');
            if ($svg.length) {
              $svg.attr('stroke', event.target.value);
            }
          });

        });

        $('div#LZTUpListItem.LZTUpContestsItem').on('click', async () => {
          await updateMenu($mainList, $contestsContainer, 'Розыгрыши');
        });

        $('div#LZTUpListItem.LZTUpUsersItem').on('click', async () => {
          await updateMenu($mainList, $usersContainer, 'Пользователи');
        });

        $('div#LZTUpListItem.LZTUpAppearItem').on('click', async () => {
          await updateMenu($mainList, $appearContainer, 'Внешний вид');
        });

        $('div.LZTUpSubMenu#LZTUpAppearContainer > div.LZTUpModalSection#LZTUpLogoSection').on('click', async () => {
          await updateSubMenu('appear', $appearContainer, $logoSubContainer, 'Внешний вид — Логотип');
        });

        $('div.LZTUpSubMenu#LZTUpAppearContainer > div.LZTUpModalSection#LZTUpMarketLogoSection').on('click', async () => {
          await updateSubMenu('appear', $appearContainer, $marketLogoSubContainer, 'Внешний вид — Логотип маркета');
        });

        $('div.LZTUpSubMenu#LZTUpAppearContainer > div.LZTUpModalSection#LZTUpThemesSection').on('click', async () => {
          await updateSubMenu('appear', $appearContainer, $themesSubContainer, 'Внешний вид — Менеджер тем');
        });

        $('div#LZTUpListItem.LZTUpSettingsItem').on('click', async () => {
          await updateMenu($settingsList, $settingsContainer, 'Настройки');
        });

        $('div#LZTUpListItem.LZTUpUpdateItem').on('click', async () => {
          await updateMenu($settingsList, $updateContainer, 'Обновления');
        });

        $('div#LZTUpListItem.LZTUpInformationItem').on('click', async () => {
          await updateMenu($settingsList, $informationContainer, 'Информация');
        });
      };
    });

    function createColorPicker(element, elementCont) {
      return Coloris({
        el: element,
        parent: elementCont,
        theme: 'polaroid',
        themeMode: 'lztupgrade',
        formatToggle: true,
        closeButton: true,
        clearButton: true,
        alpha: true,
      });
    }

    async function updateTooltips() {
      let $lztUpTooltips = $('#LZTUpTooltip.Tooltip');
      XenForo.Tooltip($lztUpTooltips);
    }

    async function registerMenuBtn(element) {
      var menuForAdd = $('#AccountMenu > ul:nth-child(1) > li:nth-child(10)');
      menuForAdd.after(element);
      return true;
    }

    function registerProfileBtn(element) {
      Array.from($('.secondaryContent > .button.block')).forEach(item => {
        if ($(item).text() === 'Редактировать') {
          var placeForAdd = $('.secondaryContent > .avatarScaler')
          placeForAdd.append(element);
          return true;
        }
      })
    }

    function updateNickStyle(style) {
      Array.from($('.username span')).forEach(item => {
        if ($(item).text() === username) {
          $(item).removeAttr('class');
          if (style.startsWith('.')) {
            $(item).addClass(style.replace('.', ''));
            $(item).attr('style', '');
          } else {
            $(item).attr('style', style);
          }
        }
      })
    }

    async function reloadNickStyle() {
      try {
        var uniqueData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});
        if (typeof(uniqueData) === 'object') {
          if (uniqueData.nickStyle !== '') {
            updateNickStyle(uniqueData.nickStyle);
          }
        }
      } catch (err) {
        Logger.error('Не удалось обновить стиль ника ', err);
      }
    }

    async function sendMessageHandler() {
      const sendButton = $('.sendMessageContainer > button.lzt-fe-se-sendMessageButton');

      if (sendButton.length > 0) {
        $(sendButton).on('click', async function() {
          await sleep(850);
          await updateUniqueStyles();
          await reloadReportButtons();
        })
      }

      const sendProfileButton = $('#ProfilePoster > .submitUnit > .button.primary');

      if (sendProfileButton.length > 0) {
        $(sendProfileButton).on('click', async function() {
          await sleep(850);
          await updateUniqueStyles();
        })
      }

      const element = $('#QuickReply.simpleRedactor');
      element.on('keyup', async (e) => {
        await updateUniqueStyles();
        await reloadReportButtons();
      });
      element.on('keydown', async (e) => {
        const keyCode = e ? (e.which ? e.which : e.keyCode) : e.keyCode;
        if (keyCode === 13) {
          await sleep(850);
          await updateUniqueStyles();
          await reloadReportButtons();
        }
      });

      const chatSendButton = $('.chatboxControl--button.sendMessage');
      chatSendButton.on('click', async (e) => {
        await sleep(850);
        await updateUniqueStyles();
      })

      const ChatboxInput = $('.ChatboxInput');
      ChatboxInput.on('keydown', async (e) => {
        const keyCode = e ? (e.which ? e.which : e.keyCode) : e.keyCode;
        if (keyCode === 13) {
          await sleep(850);
          await updateUniqueStyles();
        }
      })
    }

    function updateBannerStyle(style, text) {
      if (style.startsWith('.')) {
        bannerStyle = `class="userBanner wrapped ${style.replace('.', '')}"`
      } else {
        bannerStyle = `class="userBanner wrapped" style="${style}"`
      }

      const bannerBtn = $(`<em ${bannerStyle} id="LZTUpCustomBanner" itemprop="title"> \
      <span class="before"></span> \
      <strong>${text}</strong> \
      <span class="after"></span>\
      </em>`);
      $('#LZTUpCustomBanner').remove();
      registerProfileBtn(bannerBtn);
    }

    async function reloadBannerStyle() {
      try {
        const uniqueData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false});
        if (typeof(uniqueData) === 'object') {
          if (uniqueData.bannerText !== '') {
            updateBannerStyle(uniqueData.bannerStyle, uniqueData.bannerText);
          }
        }
      } catch (err) {
        Logger.error('Не удалось обновить стиль баннера ', err);
      }
    }

    async function forceReloadBannerStyle() {
      try {
        var uniqueData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
        if (typeof(uniqueData) === 'object') {
          updateBannerStyle(uniqueData.bannerStyle, uniqueData.bannerText);
          if (uniqueData.bannerText === '') {
            $('#LZTUpCustomBanner').remove();
          }
        }
      } catch (err) {
        Logger.error('Не удалось обновить стиль баннера ', err);
      }
    }

    async function registerUserBadges(bannerStyle = '', badgeText = '', badgeIcon = '') {
      for(const el of $.merge($(`.avatarHolder > a.Av${getUserid()}m`), $(`.avatarHolder > a.Av${getUserid()}s`))) {
        const $avatarHolder = $(el).parent()
        let $userBadges = $avatarHolder.find('.avatarUserBadges')
        let badgeId = null

        if(!$userBadges.length)
          $userBadges = $('<div class="avatarUserBadges" id="LZTUpUserBadges"></div>').prependTo($avatarHolder)

        const oldBadge = $userBadges.find('.customUniqIcon').parent();
        $userBadges.find('.avatarUserBadge').remove();
        if(oldBadge.length)
          for(const className of oldBadge.attr('class').split(/\s+/))
            if(/^avatarUserBadge--(\d+)$/.test(className))
              badgeId = className.match(/^avatarUserBadge--(\d+)$/)[1]

        if (!badgeText.length) {
          $userBadges.hide()
        } else {
          $userBadges.show()
        }

        $(`<span style="${bannerStyle.startsWith('.') ? '' : XenForo.htmlspecialchars(bannerStyle)}" id="LZTUpTooltip" class="avatarUserBadge Tooltip ${badgeIcon === '' ? 'uniq_default' : badgeIcon.startsWith('.') ? XenForo.htmlspecialchars(badgeIcon.replace('.', 'userBanner ')) : ''} ${badgeId ? `avatarUserBadge--${badgeId}` : ''}" title="${XenForo.htmlspecialchars(badgeText)}" tabindex="0">
          ${!badgeIcon.startsWith('.') ? `
            <div class="customUniqIcon">
              ${badgeIcon.replaceAll(/<[script|style]*>/gi, '<!--').replaceAll(/<\/[script|style]*>/gi, '-->')}
            </div>` : ''}
        </span>`
        ).appendTo($avatarHolder.find('.avatarUserBadges'));
      }
      return true;
    }

    async function reloadUserBadges() {
      try {
        var uniqueData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
        if (typeof(uniqueData) === 'object') {
          const isUserBadgesLoaded = $('#LZTUpUserBadges');
          if (isUserBadgesLoaded.length) {
            isUserBadgesLoaded.remove()
          }
          await registerUserBadges(uniqueData.bannerStyle, uniqueData.badgeText, uniqueData.badgeIcon);
          await setUniqIconColor(uniqueData.badgeFill, uniqueData.badgeStroke)
        }
      } catch (err) {
        Logger.error('Не удалось обновить стиль значка аватара юзера ', err);
      }
    }

    async function messageClickUsernameHandler() {
      var message = $('li.message');

      if (message.attr('data-author') === username) {
        var usernameBtn = $(message).find('.messageInfo > .userText > .item > .username span');
        if (usernameBtn.length > 0) {
          Array.from($(usernameBtn)).forEach(item => {
            $(item).on('click', async function() {
              await sleep(600);
              await updateUniqueStyles();
            })
          });
        };
      }
    }

    async function commentMoreHandler() {
      const commentMoreBtn = $('.CommentLoader');

      if (commentMoreBtn.length > 0) {
        $(commentMoreBtn).on('click', async function(event) {
          await sleep(2600);
          Logger.log('123')
          await updateUniqueStyles();
        })
      }
    }

    async function setUniqIconColor(badgeFill = '', badgeStroke = '') {
      for(const el of $.merge($(`.avatarHolder > a.Av${getUserid()}m`), $(`.avatarHolder > a.Av${getUserid()}s`))) {
        const $avatarHolder = $(el).parent();
        var $userBadge = $avatarHolder.find('.avatarUserBadges > .avatarUserBadge');
        var $svg = $userBadge.find('.customUniqIcon > svg');
        if ($svg.length && (badgeFill !== '' || badgeStroke !== '')) {
          badgeFill !== '' ? $svg.attr('fill', badgeFill) : undefined;
          badgeStroke !== '' ? $svg.attr('stroke', badgeStroke) : undefined;
        }
      }
    }

    async function redactorSendHandler() {
      let sendBtn = $('.simpleRedactor--button.sendMessageButton');
      if (sendBtn.length) {
        $(sendBtn).on('click', async function() {
          await sleep(550);
          await updateUniqueStyles();
        })
      }
    }

    async function getContestsLinks() {
      var $latestsThreads = $('div.latestThreads');
      var $stickyThreads = $('div.stickyThreads');
      $stickyThreads.is(':visible') ? $latestsThreads.add($stickyThreads) : undefined;
      var links = $latestsThreads.find('div.discussionListItem--Wrapper')
      .find('a.listBlock.main')
      .toArray()
      .map(element => $(element).attr('href'));
      return links;
    }

    async function hideThreadsByTag(name = 'OnlyFans') {
      var $latestsThreads = $('div.latestThreads');
      var $stickyThreads = $('div.stickyThreads');
      $stickyThreads.is(':visible') ? $latestsThreads.add($stickyThreads) : undefined;
      var threads = $latestsThreads.find('div.discussionListItem--Wrapper').toArray()
      threads.forEach(thread => {
        var threadTags = $(thread).find('a.listBlock.main').find('span.secondRow').find('.threadTitle--prefixGroup').find('.prefix').toArray().map(element => $(element).text());
        if (threadTags.includes(name)) {
          $(thread).hide();
        }
      })
    }

    async function regOpenContestsBtn(amount = 10) {
      if (await isContestsNode()) {
        await removeOpenContestsBtn(amount);
        var updateButton = $('div.pageNavLinkGroup > div.linkGroup.SelectionCountContainer > span.UpdateFeedButton.UpdateFeedButtonIcon');
        var getContestsButton = $(`<a class="button" id="openContestsButton${XenForo.htmlspecialchars(amount)}">Открыть ${amount < 100 ? XenForo.htmlspecialchars(amount) : 'прогруженные'}</a>`).on('click', async () => {
          updateButton.click();
          await sleep(1000);
          var links = await getContestsLinks();
          if (links.length) {
            $(links).map((element, value) => {
              if (element <= amount) {
                var win = window.open(`https://${window.location.hostname}/${value}`)
                win ? win.focus() : alert('Разрешите доступ к всплывающим окнам для этого сайта')
              } else {
                return;
              }
            })
          }
        });

        updateButton.length ? updateButton.parent().prepend(getContestsButton) : undefined;
      }
    }

    async function removeOpenContestsBtn(amount = 10) {
      if (await isContestsNode()) {
        var $oldOpenContestsButton = $(`#openContestsButton${XenForo.htmlspecialchars(amount)}`);
        $oldOpenContestsButton.length > 0 ? $oldOpenContestsButton.remove() : null;
      }
    }

    async function onClickCategoryContestsHandler() {
      var giveaways = $('li.node.node766.forum.level-n');
      $(giveaways).on('click', async () => {
        await sleep(1500);
        await regOpenContestsBtn(10);
        await regOpenContestsBtn(100);
      });
    }

    async function updateUniqueStyles() {
      await reloadNickStyle();
      await reloadBannerStyle();
      await reloadUserBadges();
      await updateTooltips();
      await reloadUserNoticeMarks();
    }

    async function isContestThread() {
      var $contestsThreadBlock = $('div.contestThreadBlock');
      return $contestsThreadBlock.length > 0 ? true : false
    }

    async function isContestsNode() {
      var $contestsTitleBar = $('div.titleBar > h1');
      return ($contestsTitleBar.length > 0 && $contestsTitleBar.attr('title') === 'Розыгрыши') ? true : false
    }

    async function isProfilePage() {
      var $ProfilePostList = $('ol#ProfilePostList');
      return $ProfilePostList.length > 0 ? true : false
    }

    async function isThreadPage() {
      let content = $('div#content.thread_view');
      return content.length > 0 ? true : false
    }

    async function contestThreadBlockMove(toTop = true) {
      if (await isContestThread()) {
        var $contestsThreadBlock = $('div.contestThreadBlock');
        var $messageContent = $('li.firstPost > div.messageInfo > div.messageContent > article > blockquote.messageText');
        if (toTop) {
          $contestsThreadBlock.after($messageContent);
          $contestsThreadBlock.css("border-top", "none").css("border-bottom", "1px solid rgb(45, 45, 45)");
        } else {
          $contestsThreadBlock.before($messageContent);
          $contestsThreadBlock.css("border-top", "1px solid rgb(45, 45, 45)").css("border-bottom", "none");
        }
      }
    }

    async function contestsBtnInBlockMove(toTop = true) {
      if (await isContestThread()) {
        var $contestsThreadBlock = $('div.contestThreadBlock');
        var $participateButton = $contestsThreadBlock.find('a.LztContest--Participate');
        var contestEnded = $contestsThreadBlock.find('span.button.contestIsFinished').length > 0 ? true : false;

        if (!$participateButton.length > 0) {
          $participateButton = $contestsThreadBlock.find('span.LztContest--alreadyParticipating');
          if (!$participateButton.length > 0) {
            $participateButton = $contestsThreadBlock.find('span.button.contestIsFinished');
          }
          $contestCaptcha = undefined;
        } else {
          $contestCaptcha = $contestsThreadBlock.find('div.ContestCaptcha');
        }
        if (toTop) { // to top
          var $contestsInfoHeading = $contestsThreadBlock.find('div.textHeading');
          $participateButton.attr("style", "margin: 0 0 15px"); // fixes big interval between infoHeader and participateButton
          $contestsThreadBlock.css('padding', "0");
          $contestsInfoHeading.before($participateButton);
          $contestCaptcha === undefined ? null : $participateButton.after($contestCaptcha);
        } else { // to default (bottom)
          var marginToFind = (contestEnded === true) ? 'div.marginBlock:nth-child(7)' : 'div.marginBlock:nth-child(9)'
          var $lastMarginBlock = $contestsThreadBlock.find(marginToFind)
          $participateButton.attr("style", "margin: 15px 0 0");
          $contestsThreadBlock.css('padding', "5px");
          $lastMarginBlock.after($participateButton);
          $contestCaptcha === undefined ? null : $participateButton.before($contestCaptcha);
        }
      }
    }

    async function getProfileUserid() {
      if (await isProfilePage()) {
        var marketLink = $('div#page_info_wrap > div.profile_info > div.userContentLinks > a:nth-child(2)').attr('href');
        var userid = marketLink.replace('market/user/', '').replace('/items', '')
        return userid
      }
    }

    async function getProfileUrl() {
      if (await isProfilePage()) {
        return $('meta[property="og:url"]').attr('content');
      }
    }

    async function getProfileUsername() {
      if (await isProfilePage()) {
        var username = XenForo.htmlspecialchars($('meta[property="og:title"]').attr('content'));
        return username
      }
    }

    async function addUserIdInProfileInfo() {
      if (await isProfilePage()) {
        var userid = await getProfileUserid()
        var profileInfoRow1 = $('div#page_info_wrap > div.profile_info > div.pairsJustified > div.clear_fix:nth-child(1)')
        var row = `
        <div class="clear_fix profile_info_row" id="LZTUpUserIDRow">
          <div class="label fl_l">ID:</div>
          <div class="labeled">${userid}</div>
        </div>`
        profileInfoRow1.after(row)
      }
    }

    async function removeUserIdInProfileInfo() {
      if (await isProfilePage()) {
        var profileUserIdRow = $('div.clear_fix#LZTUpUserIDRow');
        profileUserIdRow.remove()
      }
    }

    async function editUserRegInProfileInfo(full = false) {
      if (await isProfilePage()) {
        var $DateTime = $('div#page_info_wrap > div.profile_info > div.pairsJustified > div.clear_fix:nth-child(1) > div.labeled > span.DateTime');
        var FullReg = $DateTime.attr('title');
        if (full) {
          $DateTime.text(FullReg);
        } else {
          var RegDate = $DateTime.attr('title').split('в');
          $DateTime.text(RegDate[0]);
        }
      }
    }

    async function havePoll() {
      let $pollContainer = $('div.PollContainer');
      return $pollContainer.length ? true : false;
    }

    async function changeVisibility(elem, isHidden = true) {
      if (elem.length > 0) {
        isHidden ? elem.hide() : elem.show();
      };
    }

    async function tagsVisibility(isHidden = true) {
      var $tagList = $('div.titleBar > div.tagBlock > ul.tagList');
      await changeVisibility($tagList, isHidden)
    }

    async function contentVisibility(isHidden = true) {
      var $content = $('div.messageContent > article > blockquote');
      await changeVisibility($content, isHidden)
    }

    async function pollVisibility(isHidden = true) {
      if (await havePoll()) {
        var $pollContainer = $('div.PollContainer');
        await changeVisibility($pollContainer, isHidden)
      }
    }

    async function contestsTagsVisibility(isHidden = true) {
      if (await isContestThread()) {
        await tagsVisibility(isHidden);
      };
    }

    async function contestsContentVisibility(isHidden = true) {
      if (await isContestThread()) {
        await contentVisibility(isHidden);
        await pollVisibility(isHidden);
      };
    }

    async function getContestParticipants(contestBlock) {
      let participants;
      if (contestBlock.includes('Приняли участие: ')) {
        participants = contestBlock.split('Приняли участие: ')[1].split(' пользовател')[0];
      } else if (contestBlock.includes('Took part: ')) {
        participants = contestBlock.split('Took part: ')[1].split(' user')[0];
      } else {
        return 'Не удалось найти число участников розыгрыша';
      }
      return participants;
    }

    async function getContestWinnersNumber() {
      const titleBar = $('.titleBar');
      if (titleBar.length ) {
        const moneyContestWithValue = titleBar.find('.moneyContestWithValue');
        if (moneyContestWithValue.length) {
          const winners = moneyContestWithValue.text().split('x');
          return winners.length > 1 ? winners[0] : 1;
        }
      }
      return 1;
    }

    async function contestCalculateWinChance(participants, winners) {
      return (100 * winners/participants).toFixed(2);
    }

    async function contestsWinChance() {
      const $contestThreadBlock = $('.contestThreadBlock');
      const participants = await getContestParticipants($contestThreadBlock.text());
      const winners = await getContestWinnersNumber();
      if (participants === 'Не удалось найти число участников розыгрыша') {
        return participants;
      }

      return `${await contestCalculateWinChance(participants, winners)}%`;
    }

    async function contestsShowWinChance(show = true) {
      if (await isContestThread()) {
        if (!$('#LZTUpWinChance').length && show) {
          const winChance = await contestsWinChance();
          const contestInformationText = $('.contestThreadBlock > .textHeading').first();
          const winChanceHtml = $(`
            <div id="LZTUpWinChance" class="marginBlock">
              <span class="info-separator m-right"></span><span>Шанс на победу:</span>
              ${winChance}
            </div>`);
            contestInformationText.after(winChanceHtml);
        }

        if ($('#LZTUpWinChance').length) {
          show ? $('#LZTUpWinChance').show() : $('#LZTUpWinChance').hide();
        }
      };
    }

    async function unreadArticleCircleVisibility(isHidden = true) {
      $hasUnreadArticles = $('span.hasUnreadArticles')
      await changeVisibility($hasUnreadArticles, isHidden)
    }

    function updateSiteLogo(site, newStyles) {
      switch (site) {
        case 'main' || 'forum':
          $('#lzt-logo').length ? $('#lzt-logo')[0].style = newStyles : null;
          break;
        case 'market' || 'shop':
          $('#lzt-market-logo').length ? $('#lzt-market-logo')[0].style = newStyles : null;
          break;
        default:
          return false;
      }
      return true;
    }

    async function counterVisibility(type, toggle) {
      if (type === 'conversations') {
        var $conversations = $('div#ConversationsMenu_Counter');
        if ($conversations.find('.Total').text() === '0') {
          await changeVisibility($conversations, true);
        } else {
          await changeVisibility($conversations, toggle);
        }
      } else if (type === 'alerts') {
        var $alerts = $('div#AlertsMenu_Counter');
        if ($alerts.find('.Total').text() === '0') {
          await changeVisibility($alerts, true);
        } else {
          await changeVisibility($alerts, toggle);
        }
      };
    }

    async function contestsAutoCloseFunc(toggle) {
      if (toggle) {
        var btn = $('.LztContest--Participate')
        if (btn.length > 0) {
          $(btn).on('click', async () => {
            if (!$(btn).hasClass('disabled')) {
              await sleep(1000);
              window.close();
            }
          })
        }
      }
    }

    let $ConversationsCounter = $('div#ConversationsMenu_Counter')
    let $AlertsCounter = $('div#AlertsMenu_Counter')
    const counterMutationObserver = new MutationObserver(async function(mutations) {
      mutations.forEach(async function(mutation) {
        if (mutation.target === $AlertsCounter[0] || mutation.target === $ConversationsCounter[0]) {
          var dbAppearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
          if (dbAppearData.hideCounterAlerts === 1) {
            await counterVisibility('alerts', true);
          };
          if (dbAppearData.hideCounterConversations === 1) {
            await counterVisibility('conversations', true)
          };
        }
      });
    });

    async function addReportBtnInPosts(name, reason) {
      const $messageList = $('#messageList > li');
      for (let block of $messageList) {
        if ($(block).find('.publicControls').length) {
          let publicControls = $(block).find('.publicControls').toArray();
          publicControls.forEach(control => {
            if ($(control).find(`#LZTUPReportButton[name$=${name}]`).length === 0) {
              let $reportButton = $(`<span id = "LZTUPReportButton" name = "${name}">${XenForo.htmlspecialchars(name)}</span>`)
              $reportButton.on('click', async () => {
                let formData = new FormData();
                formData.append("message", reason)
                formData.append("is_common_reason", 1)
                formData.append("_xfToken", XenForo._csrfToken);
                formData.append("_xfNoRedirect", 1)
                formData.append("_xfToken", XenForo._csrfToken);
                formData.append("redirect", window.location.href);
                await fetch('posts/' + block.id.split('-')[1] +'/report', { method: 'POST', body: formData });
                registerAlert('Жалоба отправлена', 5000);
              })
              $(control).prepend($reportButton)
            }
          })
        }
      }
    }

    async function removeReportBtnInPosts(name) {
      const $messageList = $('#messageList > li');
      for (let block in $messageList) {
        const $reportBtn = $(block).find(`.publicControls > #LZTUPReportButton[name$=${name}]`)
        if ($reportBtn.length > 0) {
          $reportBtn.remove();
        }
      }
    }

    async function reloadReportButtons() {
      // TODO: Вынести получение данных из функции и передавать их как аргумент либо вынести логику в отдельную функцию
      let dbAppearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
      if (dbAppearData && dbAppearData.reportButtonsInPost.length > 0) {
        if (typeof (dbAppearData.reportButtonsInPost) === 'string') {
          let buttons = dbAppearData.reportButtonsInPost.split(',');
          for (const button of buttons) {
            let reportBtn = reportButtonsList.find(btn => btn.id === Number(button));
            typeof(reportBtn) === "object" ? await addReportBtnInPosts(reportBtn.name, reportBtn.reason) : undefined;
          }
        }
      }
    }

    async function addBackgroundEffect() {
      let height = getHeight();
      if (heightOnLoad !== height) {
        heightOnLoad = height;
        $('.backgroundEffect').css('height', `${height}px`);
      }
    }

    async function getPollResults() {
      let url = window.location;
      let polls = [];
      response = await fetch(`https://${url.hostname}/${url.pathname}poll/results?=&_xfRequestUri=${url.pathname}&_xfNoRedirect=1&_xfToken=${XenForo._csrfToken}&_xfResponseType=json`)
      if (response.status === 200) {
        let result = await response.json();
        if (result.templateHtml) {
          let $pollHtml = $(result.templateHtml);
          let pollPercentage = $pollHtml.find('.pollResults > .pollResult > .percentage').toArray().map(el => el.innerText.trim());
          let pollCounts = $pollHtml.find('.pollResults > .pollResult > .barCell > .barContainer > .count').toArray().map(el => el.innerText.trim())
          for (let i = 0; i < pollPercentage.length && i < pollCounts.length; i++) {
            polls.push(`${pollPercentage[i]} (${pollCounts[i]} чел.)`)
          }
        } else {
          Logger.error(`LZT Upgrade: Не удалось найти тело результатов голосования. Статус: ${response.status}`);
        }
      } else {
        Logger.error(`LZT Upgrade: Не удалось загрузить результаты голосования. Статус: ${response.status}`);
      }
      Logger.log('Результаты голосования: ', polls);
      return polls;
    }

    async function checkAndAddPollsResults() {
      if (await isThreadPage() && await havePoll()) {
        $pollOptions = $('.pollOptions');
        if ($pollOptions.length === 0) return;
        let polls = await getPollResults();
        if (polls.length > 0) {
          let $polls = $pollOptions.find('.pollOption').toArray();
          for (let i = 0; i < $polls.length && i < polls.length; i++) {
            let poll = $($polls[i]);
            poll.addClass('LZTUpPollResult');
            poll.append(`<span>${polls[i]}</span>`)
          }
        }
      }
    }

    async function removePollsResults() {
      if (await isThreadPage() && await havePoll()) {
        $pollOptions = $('.pollOptions');
        let $polls = $pollOptions.find('.pollOption').toArray();
        for (let i = 0; i < $polls.length; i++) {
          let poll = $($polls[i]);
          poll.addClass('LZTUpPollResult');
          poll.find('span').remove()
        }
      }
    }

    function removeExtraClasses(element, defaultClasses) {
      const elementClassList = $(element).attr('class').split(/\s+/);
      elementClassList.forEach(selectedClass => {
        if (!defaultClasses.includes(selectedClass)) $(element).removeClass(selectedClass);
      })
    }


    async function addNoticeMark(name) {
      Array.from($('.username span')).forEach(item => {
        if ($(item).text() === username) {
          const headerContent = $(item).parent()
          if (!headerContent.parent()[0].classList.contains('navLink') && !headerContent.parent().find(`span.${name}`).length) {
            let tooltipText = '';
            if (name === 'scamNotice') {
              tooltipText = 'Внимание! На данного пользователя недавно жаловались в связи с мошенничеством. Советуем вам быть осторожным и пользоваться гарантом, имея дело с ним.'
            } else if (name === 'vpnNotice') {
              tooltipText = 'Внимание! Данный пользователь использует VPN, будьте осторожны.'
            }
            const notice = $(`<span class="${name} Tooltip" title="${tooltipText}"></span>`);
            headerContent.after(notice);
            XenForo.Tooltip(notice);
          }
        }
      });
    }

    async function removeNoticeMark(name) {
      Array.from($('.username span')).forEach(item => {
        if ($(item).text() === username) {
          $(item).parent().parent().find(`span.${name}`).remove();
        }
      });
    }

    async function reloadUserNoticeMarks() {
      let dbUniqueStyleData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
      if (dbUniqueStyleData && dbUniqueStyleData?.noticesMarks?.length) {
        if (typeof (dbUniqueStyleData.noticesMarks) === 'string') {
          let noticesMarks = dbUniqueStyleData.noticesMarks.split(',');
          for (const noticeMark of noticesMarks) {
            let noticeMarkSpan = noticesList.find(notice => notice.id === Number(noticeMark));
            typeof(noticeMarkSpan) === "object" ? await addNoticeMark(noticeMarkSpan.name) : undefined;
          }
        }
      }
    }

    async function updateBackground() {
      let dbUniqueStyleData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
      if (dbUniqueStyleData && dbUniqueStyleData.profileBackground !== undefined) {
        if (await getProfileUrl() === $('#AccountMenu > ul:nth-child(1) > li:nth-child(1) > a').attr('href') || typeof(dbUniqueStyleData.profileBackgroundEverywhere) === 'number') {
          if (await isProfilePage() && await getProfileUrl() !== $('#AccountMenu > ul:nth-child(1) > li:nth-child(1) > a').attr('href')) {
            // Don't change it on other profiles
            return;
          }

          const body = $('body');
          if (dbUniqueStyleData.profileBackgroundEverywhere === 0 && dbUniqueStyleData.profileBackground.length) {
            body.attr('id', '');
            body.css('background-image', '');
            return;
          }

          if (dbUniqueStyleData.profileBackground.length) {
            body.attr('id', 'LZTUpCustomBackground');
            body.css('background-image', `linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url(${dbUniqueStyleData.profileBackground})`);
          } else {
            body.attr('id', '');
            body.css('background-image', '');
          }
        }
      }
    }

    async function disableShowTypingExecute() {
      XenForo.hasOwnProperty('threadNotify') && XenForo.threadNotify.hasOwnProperty('shareTypingActivity') ? XenForo.threadNotify.shareTypingActivity = 0 : null;
      XenForo.hasOwnProperty('ChatboxRTC') && XenForo.ChatboxRTC.hasOwnProperty('Start') ? XenForo.ChatboxRTC.Start.prototype.sendTypingMessage = () => {return} : null;
    }

    // * script start actions
    if (getUserid() === '') return 'not auth'; // superior auth check

    var MenuResult = await registerMenuBtn(menuBtn);

    if (isSettingsDBInited) {
      const dbSettingsData = await settingsDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
      dbSettingsData.checkUpdatesOnLoad === 1 ? await checkUpdate() : null;
    }

    if (isContestsDBInited) {
      var dbContestsData = await contestsDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
      if (dbContestsData.contestsTen === 1 || dbContestsData.contestsAll === 1) {
        await onClickCategoryContestsHandler();
        dbContestsData.contestsTen === 1 ? await regOpenContestsBtn(10) : null;
        dbContestsData.contestsAll === 1 ? await regOpenContestsBtn(100) : null;
      }
      dbContestsData.contestsInfoTop === 1 ? await contestThreadBlockMove(true) : null;
      dbContestsData.contestsBtnTopInBlock === 1 ? await contestsBtnInBlockMove(true) : null;
      dbContestsData.contestsHideTags === 1 ? await contestsTagsVisibility(true) : null;
      dbContestsData.contestsAutoClose === 1 ? await contestsAutoCloseFunc(true) : null;
      dbContestsData.contestsRmContent === 1 ? await contestsContentVisibility(true) : null;
      dbContestsData.contestsShowWinChance === 1 ? await contestsShowWinChance(true) : null;
    }

    if (isUsersDBInited) {
      var dbUsersData = await usersDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
      dbUsersData.showUseridInProfile === 1 ? await addUserIdInProfileInfo() : null;
      dbUsersData.showFullRegInProfile === 1 ? await editUserRegInProfileInfo(true) : null;
      dbUsersData.disableShowTyping === 1 ? await disableShowTypingExecute() : null;
    }

    if (isAppearDBInited) {
      var dbAppearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
      dbAppearData.hideUnreadArticleCircle === 1 ? await unreadArticleCircleVisibility(true) : null;
      dbAppearData.hideTagsInThreads === 1 ? await tagsVisibility(true) : null;
      if (dbAppearData.forumLogo > 0) {
        $.ajax({
          url: api_endpoints['getLogoByUID'],
          dataType: 'json',
          data: {
            uid: dbAppearData.forumLogo
          },
          success: logo => typeof(logo) === 'object' && logo.hasOwnProperty('uid') && logo.hasOwnProperty('css') ? updateSiteLogo('main', logo.css) : undefined,
          error: err => Logger.error(`LZT Upgrade: Не удалось загрузить логотип форума `, err)
        });
      }
      if (dbAppearData.marketLogo > 0) {
        $.ajax({
          url: api_endpoints['getLogoByUID'],
          dataType: 'json',
          data: {
            uid: dbAppearData.marketLogo
          },
          success: logo => typeof(logo) === 'object' && logo.hasOwnProperty('uid') && logo.hasOwnProperty('css') ? updateSiteLogo('market', logo.css) : undefined,
          error: err => Logger.error(`LZT Upgrade: Не удалось загрузить логотип маркета `, err)
        });
      }
      if (dbAppearData.reportButtonsInPost?.length > 0) {
        if (typeof (dbAppearData.reportButtonsInPost) === 'string') {
          let buttons = dbAppearData.reportButtonsInPost.split(',');
          for (const button of buttons) {
            let reportBtn = reportButtonsList.find(btn => btn.id === Number(button));
            typeof(reportBtn) === "object" ? await addReportBtnInPosts(reportBtn.name, reportBtn.reason) : undefined;
          }
        }
      }
      dbAppearData.hideCounterAlerts === 1 ? await counterVisibility('alerts', true) : null;
      dbAppearData.hideCounterConversations === 1 ? await counterVisibility('conversations', true) : null;
      dbAppearData.hideCounterAlerts === 1 || dbAppearData.hideCounterConversations === 1 ? counterMutation(true) : counterMutation(false);
      if (dbAppearData.backgroundEffect === 1) {
        $('body').prepend($('<div class="backgroundEffect"></div>'))
        await addBackgroundEffect();
        $(window).on('scroll', async () => {
          await addBackgroundEffect();
        })
      }
      if (dbAppearData.hideOnlyfans === 1) {
        await hideThreadsByTag('OnlyFans');
        $(window).on('scroll', async () => {
          await hideThreadsByTag('OnlyFans');
        })
      }
      dbAppearData.showPollsResults === 1 ? await checkAndAddPollsResults() : null;
    }

    await updateUniqueStyles();

    await sendMessageHandler();

    await messageClickUsernameHandler();

    await commentMoreHandler();

    await updateTooltips();

    await updateBackground()

    $('.chatboxStartIcon').on('click', async () => {
      await sleep(800);
      await updateUniqueStyles();
    });

    $('.UpdateFeedButton').on('click', async () => {
      await sleep(800);
      await updateUniqueStyles();
    });

    if (MenuResult === true) {
      // UNIQUE
      $(document).on('click', '#LZTUpSelectGroupsUniq', () => {
        const selectedGroup = $('#LZTUpSelectGroupsUniq').val();
        const uniqueStyle = $('#LZTUpUniqueStyle');
        const bannerStyle = $('#LZTUpBannerStyle');
        const bannerText = $('#LZTUpBannerText');
        const badgeIcon = $('#LZTUpBadgeIcon');
        const badgeText = $('#LZTUpBadgeText');

        for (const group of availabledGroups) {
          switch (selectedGroup) {
            case group.name:
              uniqueStyle.val(group.uniqueStyle);
              bannerStyle.val(group.bannerStyle);
              bannerText.val(group.bannerText);
              badgeIcon.val(group.badgeIcon);
              badgeText.val(group.badgeText);
          }
        }

        uniqueStyle.trigger('change');
        bannerStyle.trigger('change');
        bannerText.trigger('change');
        badgeIcon.trigger('change');
        badgeText.trigger('change');
      });

      $(document).on('click', '#LZTUpResetUniqueDB', async function () {
        await uniqueStyleDB.delete();
        await uniqueStyleDB.init();
        registerAlert('Кастомные стили сброшены');
        await sleep(500);
        window.location.reload();
      });

      $(document).on('click', '#LZTUpSaveUniqueDB', async function () {
        const nickStyleNew = $('#LZTUpUniqueStyle').val();
        if (nickStyleNew.length < 1501) {
          await uniqueStyleDB.update({nickStyle: nickStyleNew});
        } else {
          registerAlert('Стиль ника не должен превышать 1500 символов!')
          Logger.log('Не удалось сохранить стиль ника. Стиль ника не должен превышать 1500 символов!')
        }

        const bannerStyleNew = $('#LZTUpBannerStyle').val();
        if (bannerStyleNew.length < 1501) {
          await uniqueStyleDB.update({bannerStyle: bannerStyleNew});
        } else {
          registerAlert('Стиль лычки не должен превышать 1500 символов!')
          Logger.log('Не удалось сохранить стиль лычки. Стиль лычки не должен превышать 1500 символов!')
        }

        const bannerTextNew = $('#LZTUpBannerText').val();
        if (bannerTextNew.length < 25) {
          await uniqueStyleDB.update({bannerText: bannerTextNew});
        } else {
          registerAlert('Текст в лычке не должен превышать 24 символов!')
          Logger.log('Не удалось сохранить текст в лычке. Текст в лычке не должен превышать 24 символов!')
        }

        const badgeIconNew = $('#LZTUpBadgeIcon').val();
        if (badgeIconNew.length < 3001) {
          await uniqueStyleDB.update({badgeIcon: badgeIconNew});
        } else {
          registerAlert('Иконка на аватарке не должна превышать 3000 символов!')
          Logger.log('Не удалось сохранить иконку на аватарке. Иконка на аватарке не должен превышать 3000 символов!')
        }

        const badgeFill = $('#LZTUpBadgeFill').val();
        await uniqueStyleDB.update({badgeFill: badgeFill});

        const strokeFill = $('#LZTUpStrokeFill').val();
        await uniqueStyleDB.update({badgeStroke: strokeFill});

        const badgeTextNew  = $('#LZTUpBadgeText').val();
        if (badgeTextNew.length < 25) {
          await uniqueStyleDB.update({badgeText: badgeTextNew});
        } else {
          registerAlert('Текст в иконке аватарки не должен превышать 24 символов!')
          Logger.log('Не удалось сохранить текст в иконке аватарки. Текст в иконке аватарки не должен превышать 24 символов!')
        }

        let profileBackgroundNew  = $('#LZTUpProfileBackground').val();
        await uniqueStyleDB.update({profileBackground: profileBackgroundNew});
        await updateUniqueStyles();
        await forceReloadBannerStyle();
        await updateBackground();
      });


      $(document).on('click', '#profile_background_everywhere', async function () {
        $('#profile_background_everywhere')[0].checked ? (
          await uniqueStyleDB.update({profileBackgroundEverywhere: 1}),
          await updateBackground()
          ): (
            await uniqueStyleDB.update({profileBackgroundEverywhere: 0}),
            await updateBackground()
          );
      });

      noticesList.forEach(notice => {
        $(document).on('click', `#set_${notice.id}_noticemark`, async function () {
          let uniqueData = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
          let usedNoticesMarks;
          if (typeof (uniqueData.noticesMarks) === 'string') {
            usedNoticesMarks = uniqueData.noticesMarks.split(',');
            let emptyCell = usedNoticesMarks.indexOf('')
            emptyCell !== -1 ? usedNoticesMarks.splice(emptyCell, 1) : null;
            if (usedNoticesMarks.find(noticeId => noticeId === String(notice.id))) {
              let noticeIndex = usedNoticesMarks.indexOf(String(notice.id));
              noticeIndex !== -1 ? usedNoticesMarks.splice(noticeIndex, 1) : null;
            } else {
              usedNoticesMarks.push(String(notice.id));
            }
          } else {
            usedNoticesMarks = [String(notice.id)];
          }
          await uniqueStyleDB.update({noticesMarks: usedNoticesMarks.join()});
          $(`#set_${notice.id}_noticemark`)[0].checked ? (
            await addNoticeMark(notice.name),
            $('#LZTUpUsernameStyle').after(`<span class="${notice.name}"></span>`)
          ) : (
            await removeNoticeMark(notice.name),
            $('#LZTUpUsernameStyle').parent().find(`span.${notice.name}`).remove()
          );
        });
      });

      $(document).on('keyup change', '#LZTUpUniqueStyle', () => {
        let nickStyleNew = $('#LZTUpUniqueStyle').val();
        const usernameStyle = $('#LZTUpUsernameStyle');
        if (nickStyleNew.length < 1501) {
          removeExtraClasses(usernameStyle, ['UsernameStyle', 'bold']);
          if (nickStyleNew.startsWith('.')) {
            usernameStyle.addClass(nickStyleNew.replace('.', ''));
            usernameStyle.attr('style', '');
          } else {
            usernameStyle.attr('style', nickStyleNew);
          }
        }
      });

      $(document).on('keyup change', '#LZTUpBannerStyle', () => {
        let bannerStyleNew = $('#LZTUpBannerStyle').val();
        const bannerStyle = $('#LZTUpUserBannerStyle');
        const previewBadge = $('#LZTUpPreviewBadge');
        if (bannerStyleNew.length < 1501) {
          removeExtraClasses(bannerStyle, ['UserBannerStyle', 'userBanner']);
          removeExtraClasses(previewBadge, ['avatarUserBadge', 'Tooltip']);
          $('#LZTUpBadgeIcon').trigger('change');
          if (bannerStyleNew.startsWith('.')) {
            bannerStyle.addClass(bannerStyleNew.replace('.', ''));
            previewBadge.addClass(bannerStyleNew.replace('.', ''))
            bannerStyle.attr('style', '')
            previewBadge.attr('style', '')
          } else {
            bannerStyle.attr('style', bannerStyleNew);
            previewBadge.attr('style', bannerStyleNew);
          }
        }
      });

      $(document).on('keyup change', '#LZTUpBannerText', () => {
        let bannerTextNew = $('#LZTUpBannerText').val();
        if (bannerTextNew.length < 1501) {
          $('#LZTUpUserBannerStyle').text(bannerTextNew);
        }
      });

      $(document).on('keyup change', '#LZTUpBadgeIcon', async function () {
        let badgeIconNew = $('#LZTUpBadgeIcon').val();
        if (badgeIconNew.length < 3001) {
          const badge = $('#LZTUpPreviewBadge');
          badge.find('.customUniqIcon').remove();
          if (badgeIconNew.length) {
            removeExtraClasses(badge, ['avatarUserBadge', 'Tooltip']);
            if (badgeIconNew.startsWith('.')) {
              badge.addClass(badgeIconNew.replace('.', 'userBanner '));
            } else {
              badge.append(`<div class="customUniqIcon">${badgeIconNew.replaceAll(/<[script|style]*>/gi, '<!--').replaceAll(/<\/[script|style]*>/gi, '-->')}</div>`)
              badge.addClass('badgeDefaultBackground');
            }
          } else {
            const badge = $('#LZTUpPreviewBadge');
            badge.addClass('uniq_default');
            badge.addClass('badgeDefaultBackground');
          }
        }
      });

      $(document).on('keyup change', '#LZTUpBadgeText', async function () {
        let badgeTextNew  = $('#LZTUpBadgeText').val();
        if (badgeTextNew.length < 25) {
          // idk how pretty simple to do
          const badge = $('#LZTUpPreviewBadge.Tooltip');
          badge.attr('title', badgeTextNew);;
          const badgeParent = badge.parent();
          const badgeClone = badge.clone();
          badge.remove();
          badgeParent.append(badgeClone);
          if (!badgeTextNew.length) {
            badgeClone.hide()
          } else {
            badgeClone.show()
            XenForo.Tooltip(badgeClone);
          }
        }
      });

      $(document).on('keyup change', '#LZTUpProfileBackground', async function () {
        let profileBackgroundNew  = $('#LZTUpProfileBackground').val();
        const previewContainer = $('#LZTUpPreviewContainer');
        if (profileBackgroundNew.length) {
          previewContainer.css('background-image', `linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url(${profileBackgroundNew})`);
        } else {
          previewContainer.css('background-image', '');
        }
      });

      // CONTESTS
      $(document).on('click', '#LZTUpResetContestsDB', async function () {
        await contestsDB.delete();
        await contestsDB.init();
        registerAlert('Настройки розыгрышей LZT Upgrade сброшены');
        await sleep(500);
        window.location.reload();
      });

      $(document).on('click', '#contests_open_ten', async function () {
        $('#contests_open_ten')[0].checked ? (
          await contestsDB.update({contestsTen: 1}),
          await regOpenContestsBtn(10)
          ): (
            await contestsDB.update({contestsTen: 0}),
            await removeOpenContestsBtn(10)
          );
      });

      $(document).on('click', '#contests_open_all', async function () {
        $('#contests_open_all')[0].checked ? (
          await contestsDB.update({contestsAll: 1}),
          await regOpenContestsBtn(100)
          ): (
            await contestsDB.update({contestsAll: 0}),
            await removeOpenContestsBtn(100)
          );
      });

      $(document).on('click', '#contests_info_top', async function () {
        $('#contests_info_top')[0].checked ? (
          await contestsDB.update({contestsInfoTop: 1}),
          await contestThreadBlockMove(true)
          ): (
            await contestsDB.update({contestsInfoTop: 0}),
            await contestThreadBlockMove(false)
          );
      });

      $(document).on('click', '#contests_btn_top_in_block', async function () {
        $('#contests_btn_top_in_block')[0].checked ? (
          await contestsDB.update({contestsBtnTopInBlock: 1}),
          await contestsBtnInBlockMove(true)
          ): (
            await contestsDB.update({contestsBtnTopInBlock: 0}),
            await contestsBtnInBlockMove(false)
          );
      });

      $(document).on('click', '#contests_hide_tags', async function () {
        $('#contests_hide_tags')[0].checked ? (
          await contestsDB.update({contestsHideTags: 1}),
          await contestsTagsVisibility(true)
          ): (
            await contestsDB.update({contestsHideTags: 0}),
            await contestsTagsVisibility(false)
          );
      });

      $(document).on('click', '#contests_auto_close', async function () {
        $('#contests_auto_close')[0].checked ? (
          await contestsDB.update({contestsAutoClose: 1}),
          await contestsAutoCloseFunc(true)
          ): (
            await contestsDB.update({contestsAutoClose: 0}),
            await contestsAutoCloseFunc(false)
          );
      });

      $(document).on('click', '#contests_rm_content', async function () {
        $('#contests_rm_content')[0].checked ? (
          await contestsDB.update({contestsRmContent: 1}),
          await contestsContentVisibility(true)
          ): (
            await contestsDB.update({contestsRmContent: 0}),
            await contestsContentVisibility(false)
          );
      });

      $(document).on('click', '#contests_show_win_chance', async function () {
        $('#contests_show_win_chance')[0].checked ? (
          await contestsDB.update({contestsShowWinChance: 1}),
          await contestsShowWinChance(true)
          ): (
            await contestsDB.update({contestsShowWinChance: 0}),
            await contestsShowWinChance(false)
          );
      });

      // USERS
      $(document).on('click', '#LZTUpResetUsersDB', async function () {
        await usersDB.delete();
        await usersDB.init();
        registerAlert('Настройки пользователей LZT Upgrade сброшены');
        await sleep(500);
        window.location.reload();
      });

      $(document).on('click', '#show_userid_in_profile', async function () {
        $('#show_userid_in_profile')[0].checked ? (
          await usersDB.update({showUseridInProfile: 1}),
          await addUserIdInProfileInfo()
          ): (
            await usersDB.update({showUseridInProfile: 0}),
            await removeUserIdInProfileInfo()
          );
      });

      $(document).on('click', '#show_fullreg_in_profile', async function () {
        $('#show_fullreg_in_profile')[0].checked ? (
          await usersDB.update({showFullRegInProfile: 1}),
          await editUserRegInProfileInfo(true)
          ): (
            await usersDB.update({showFullRegInProfile: 0}),
            await editUserRegInProfileInfo(false)
          );
      });

      $(document).on('click', '#disable_show_typing', async function () {
        $('#disable_show_typing')[0].checked ? (
          await usersDB.update({disableShowTyping: 1}),
          registerAlert('Отправка информации о наборе сообщения отключена', 5000),
          await sleep(500),
          window.location.reload()
          ): (
            await usersDB.update({disableShowTyping: 0}),
            registerAlert('Отправка информации о наборе сообщения включена', 5000),
            await sleep(500),
            window.location.reload()
          );
      });

      // APPEAR
      $(document).on('click', '#LZTUpResetAppearDB', async function () {
        await appearDB.delete();
        await appearDB.init();
        registerAlert('Настройки "Внешнего вида" LZT Upgrade сброшены');
        await sleep(500);
        window.location.reload();
      });

      $(document).on('click', '#hide_unread_article_circle', async function () {
        $('#hide_unread_article_circle')[0].checked ? (
          await appearDB.update({hideUnreadArticleCircle: 1}),
          await unreadArticleCircleVisibility(true)
          ): (
            await appearDB.update({hideUnreadArticleCircle: 0}),
            await unreadArticleCircleVisibility(false)
          );
      });

      $(document).on('click', '#hide_tags_in_threads', async function () {
        $('#hide_tags_in_threads')[0].checked ? (
          await appearDB.update({hideTagsInThreads: 1}),
          await tagsVisibility(true)
          ): (
            await appearDB.update({hideTagsInThreads: 0}),
            await tagsVisibility(false)
          );
      });

      $(document).on('click', '#hide_counter_alerts', async function () {
        $('#hide_counter_alerts')[0].checked ? (
          await appearDB.update({hideCounterAlerts: 1}),
          await counterVisibility('alerts', true),
          counterMutation(true)
          ): (
            dbAppearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {},
            await appearDB.update({hideCounterAlerts: 0}),
            dbAppearData.hideCounterAlerts === 0 && dbAppearData.hideCounterConversations === 0 ? counterMutation(false) : null,
            await counterVisibility('alerts', false)
          );
      });

      $(document).on('click', '#hide_counter_conversations', async function () {
        $('#hide_counter_conversations')[0].checked ? (
          await appearDB.update({hideCounterConversations: 1}),
          await counterVisibility('conversations', true),
          counterMutation(true)
          ): (
            dbAppearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {},
            await appearDB.update({hideCounterConversations: 0}),
            dbAppearData.hideCounterAlerts === 0 && dbAppearData.hideCounterConversations === 0 ? counterMutation(false) : null,
            await counterVisibility('conversations', false)
          );
      });

      $(document).on('click', '#theme_auto_reload', async function () {
        $('#theme_auto_reload')[0].checked ? (
          await appearDB.update({themeAutoReload: 1}),
          await sleep(500),
          window.location.reload()
          ): (
            await appearDB.update({themeAutoReload: 0}),
            await sleep(500),
            window.location.reload()
          );
      });

      $(document).on('click', '#enable_background_effect', async function () {
        $('#enable_background_effect')[0].checked ? (
          await appearDB.update({backgroundEffect: 1}),
          $('body').prepend($('<div class="backgroundEffect"></div>')),
          await addBackgroundEffect()
          ): (
            await appearDB.update({backgroundEffect: 0}),
            $('.backgroundEffect').remove()
          );
      });

      $(document).on('click', '#hide_onlyfans', async function () {
        $('#hide_onlyfans')[0].checked ? (
          await appearDB.update({hideOnlyfans: 1}),
          registerAlert('Включено скрытие тега Onlyfans. Выполняю перезагрузку страницы...', 5000),
          await sleep(500),
          window.location.reload()
          ): (
            await appearDB.update({hideOnlyfans: 0}),
            registerAlert('Скрытие тега Onlyfans отключено. Выполняю перезагрузку страницы...', 5000),
            await sleep(500),
            window.location.reload()
          );
      });

      $(document).on('click', '#show_polls_results', async function () {
        $('#show_polls_results')[0].checked ? (
          await appearDB.update({showPollsResults: 1}),
          registerAlert('Включен показ результатов голосования', 5000),
          await checkAndAddPollsResults()
          ): (
            await appearDB.update({showPollsResults: 0}),
            registerAlert('Выключен показ результатов голосования', 5000),
            await removePollsResults()
          );
      });

      $(document).on('click', '.LZTUpSaveSettings', async function () {
        const uniqueStylesSettings = await uniqueStyleDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
        const contestsSettings = await contestsDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
        const usersSettings = await usersDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
        const appearSettings = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
        const config = JSON.stringify({
          uniqueStyle: uniqueStylesSettings,
          contests: contestsSettings,
          users: usersSettings,
          appear: appearSettings
        });

        const blob = new Blob([config], {
          type: 'application/json'
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'LZTUpgradeConfig.json';
        link.click();
        registerAlert('Файл настроек выгружен', 5000);
      });

      $(document).on('click', '.LZTUpUploadSettings', async function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.click();

        const file = await new Promise(resolve => {
          input.onchange = () => {
            resolve(input.files[0]);
          };
        });

        const reader = new FileReader();
        reader.readAsText(file);
        const config = await new Promise(resolve => {
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.error = () => {
            Logger.error('Ошибка загрузки файла настроек', reader.error);
            resolve(false);
          };
        });

        if (!config) {
          registerAlert('Ошибка загрузки файла настроек', 5000);
          return;
        }

        const configObj = JSON.parse(config);
        try {
          await uniqueStyleDB.update(configObj.uniqueStyle);
          await contestsDB.update(configObj.contests);
          await usersDB.update(configObj.users);
          await appearDB.update(configObj.appear);
          registerAlert('Настройки загружены. Выполняю перезагрузку страницы...', 5000);
          await sleep(500);
          window.location.reload();
        } catch (err) {
          Logger.error('Ошибка загрузки файла настроек', err)
          registerAlert('Ошибка загрузки файла настроек', 5000);
        }

      });

      reportButtonsList.forEach(btn => {
        $(document).on('click', `#set_${btn.id}_reportbtn`, async function () {
          let appearData = await appearDB.read().then(value => {return(value)}).catch(err => {Logger.error(err); return false}) || {};
          let usedBtns;
          if (typeof (appearData.reportButtonsInPost) === 'string') {
            usedBtns = appearData.reportButtonsInPost.split(',');
            let emptyCell = usedBtns.indexOf('')
            emptyCell !== -1 ? usedBtns.splice(emptyCell, 1) : null;
            if (usedBtns.find(btnId => btnId === String(btn.id))) {
              let btnIndex = usedBtns.indexOf(String(btn.id));
              btnIndex !== -1 ? usedBtns.splice(btnIndex, 1) : null;
            } else {
              usedBtns.push(String(btn.id));
            }
          } else {
            usedBtns = [String(btn.id)];
          }
          await appearDB.update({reportButtonsInPost: usedBtns.join()});
          $(`#set_${btn.id}_reportbtn`)[0].checked ? await addReportBtnInPosts(btn.name, btn.reason) : await removeReportBtnInPosts(btn.name);
        });
      });

      // Updates
      $(document).on('click', '#LZTUpResetSettingsDB', async function () {
        await settingsDB.delete();
        await settingsDB.init();
        registerAlert('Настройки "Настроек" LZT Upgrade сброшены');
        await sleep(500);
        window.location.reload();
      });

      $(document).on('click', '.LZTUpCheckUpdate', async () => await checkUpdate(true))

      $(document).on('click', '#check_updates_on_load', async function () {
        $('#check_updates_on_load')[0].checked ? (
          await settingsDB.update({checkUpdatesOnLoad: 1}),
          registerAlert('Включено автообновление расширения', 5000),
          await checkUpdate(true)
          ): (
            await settingsDB.update({checkUpdatesOnLoad: 0}),
            registerAlert('Выключено автообновление расширения', 5000)
          );
      });

    }

    var hasPageNav = $('.PageNav > nav > a');
    var isProfile = $('ol#ProfilePostList');
    var $messageList = $('ol.messageList');
    if (hasPageNav.length > 0 && isProfile.length > 0) {
      var mutationObserver = new MutationObserver(async function(mutations) {
        mutations.forEach(async function(mutation) {
          if (mutation.target === $(isProfile)[0]) {
            await updateUniqueStyles();
          }
        });
      });

      mutationObserver.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
      });
    }

    if ($messageList.length) {
      var mutationObserver = new MutationObserver(async function(mutations) {
        mutations.forEach(async function(mutation) {
          if (mutation.target === $($messageList)[0] || mutation.target.classList.contains('CommentPostList')) {
            await reloadReportButtons();
            await updateUniqueStyles();
          }
        });
      });

      mutationObserver.observe($messageList.parent()[0], {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
      });
    }

    function counterMutation(toggle) {
      if (toggle) {
        counterMutationObserver.observe(document.documentElement, {
          attributes: true,
          childList: true,
          subtree: true,
          attributeOldValue: true,
        });
      } else {
        counterMutationObserver.disconnect();
      }
    }
  };
})();



