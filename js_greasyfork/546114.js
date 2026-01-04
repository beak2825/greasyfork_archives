// ==UserScript==
// @name         PH - Search & UI (DL filter fix + copy /videos URL; wider fixed UI)
// @namespace    brazenvoid & Glau & gpt-5-2025-08-07
// @version      4.5.35
// @author       brazenvoid & gpt-5-2025-08-07
// @license      GPL-3.0-only
// @description  Search filters and UX tweaks. Fix: Hide From DL works on profile pages with different display name vs slug. Not-in-DL button copies profile /videos URL. UI panel is wider and width-resizer removed. Hide filters are disabled on author profile pages.
// @match        https://*.pornhub.com/*
// @match        https://*.pornhub.org/*
// @match        https://*.pornhubpremium.com/*
// @match        https://*.pornhubpremium.org/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/375557/Base%20Brazen%20Resource.js
// @require      https://update.greasyfork.org/scripts/416104/Brazen%20UI%20Generator.js
// @require      https://update.greasyfork.org/scripts/418665/Brazen%20Configuration%20Manager.js
// @require      https://update.greasyfork.org/scripts/429587/Brazen%20Item%20Attributes%20Resolver.js
// @require      https://update.greasyfork.org/scripts/424516/Brazen%20Subscriptions%20Loader.js
// @require      https://update.greasyfork.org/scripts/416105/Brazen%20Base%20Search%20Enhancer.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546114/PH%20-%20Search%20%20UI%20%28DL%20filter%20fix%20%2B%20copy%20videos%20URL%3B%20wider%20fixed%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546114/PH%20-%20Search%20%20UI%20%28DL%20filter%20fix%20%2B%20copy%20videos%20URL%3B%20wider%20fixed%20UI%29.meta.js
// ==/UserScript==

/* ===================== Styles ===================== */
/* Wider fixed panel and hide width resizer */
GM_addStyle([
  '#bv-ui{',
  '  min-width:450px !important;',
  '  width:450px !important;',
  '  max-width:450px !important;',
  '  resize:none !important;',
  '}',
  /* Hide common resizer handles used by the UI lib (safe selectors union) */
  '#bv-ui .ui-resizable-handle,',
  '#bv-ui .bv-ui-resizer,',
  '#bv-ui .resizer,',
  '#bv-ui .resize-handle{',
  '  display:none !important;',
  '  pointer-events:none !important;',
  '}'
].join('\n'));

GM_addStyle([
  '.bv-button-container{',
  '  position:absolute;',
  '  display:flex;',
  '  flex-direction:row;',
  '  justify-content:center;',
  '  gap:8px;',
  '  z-index:100;',
  '  transform:translateX(-50%);',
  '  white-space:nowrap;',
  '}',
  '#bv-blacklist-badge,#bv-add-to-blacklist-btn,#bv-dl-status-btn{',
  '  color:#fff !important;',
  '  padding:3px 8px;',
  '  font-size:11px;',
  '  font-weight:bold;',
  '  border-radius:3px;',
  '  border:none;',
  '  cursor:pointer;',
  '  line-height:1.5;',
  '  width:auto;',
  '  box-sizing:border-box;',
  '}',
  '#bv-blacklist-badge{background-color:#d9534f;}',
  '#bv-blacklist-badge:hover{background-color:#c9302c;}',
  '#bv-add-to-blacklist-btn,#bv-dl-status-btn.not-in-list{background-color:#1b1b1b;}',
  '#bv-add-to-blacklist-btn:hover,#bv-dl-status-btn.not-in-list:hover{background-color:#555;}',
  '#bv-dl-status-btn.in-list,#bv-dl-status-btn.server-offline{cursor:default;}',
  '#bv-dl-status-btn.in-list{background-color:#5cb85c;}',
  '#bv-dl-status-btn.server-offline{background-color:#f0ad4e;}'
].join('\n'));

/* ===================== Environment ===================== */
const PAGE_PATH_NAME = window.location.pathname;
const IS_FEED_PAGE = PAGE_PATH_NAME.startsWith('/feeds');
const IS_PLAYLIST_PAGE = PAGE_PATH_NAME.startsWith('/playlist');
const IS_PROFILE_PAGE =
  PAGE_PATH_NAME.startsWith('/model') ||
  PAGE_PATH_NAME.startsWith('/channels') ||
  PAGE_PATH_NAME.startsWith('/user') ||
  PAGE_PATH_NAME.startsWith('/users') ||
  PAGE_PATH_NAME.startsWith('/pornstar');
const IS_VIDEO_PAGE = PAGE_PATH_NAME.startsWith('/view_video');
const IS_VIDEO_SEARCH_PAGE = PAGE_PATH_NAME.startsWith('/video') || PAGE_PATH_NAME.startsWith('/categories');

/* ===================== Helpers ===================== */
function parseProfilePath(pathname) {
  try {
    const m = pathname.match(/^\/(model|channels|user|users|pornstar)\/([^\/?#]+)/i);
    if (!m) return null;
    return { type: m[1].toLowerCase(), slug: decodeURIComponent(m[2]) };
  } catch (e) { return null; }
}
function getSlugFromHref(href) {
  if (!href) return null;
  try {
    const u = href.startsWith('http') ? new URL(href) : new URL(href, location.origin);
    const p = parseProfilePath(u.pathname);
    return p ? p.slug : null;
  } catch (e) { return null; }
}
function getCurrentProfileSlug() {
  const p = parseProfilePath(location.pathname);
  return p ? p.slug : null;
}
// Профильный URL со страницей видео (/videos для model/channels/pornstar, /videos/public для users)
function buildProfileVideosUrl() {
  const p = parseProfilePath(location.pathname);
  if (!p) return location.href;
  const encSlug = encodeURIComponent(p.slug);
  if (p.type === 'user' || p.type === 'users') {
    return location.origin + '/users/' + encSlug + '/videos/public';
  }
  return location.origin + '/' + p.type + '/' + encSlug + '/videos';
}
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
  }
  return new Promise(function (resolve) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      const ok = document.execCommand('copy');
      resolve(ok);
    } catch (e) {
      resolve(false);
    } finally {
      document.body.removeChild(ta);
    }
  });
}
// Унифицированное извлечение ключа профиля из карточки видео
function getProfileKeyFromItem($item) {
  const $a = $item.find('a[href^="/model/"], a[href^="/channels/"], a[href^="/user/"], a[href^="/users/"], a[href^="/pornstar/"]').first();
  let href = $a.attr('href') || '';
  let slug = getSlugFromHref(href);

  let displayName = ($a.text().trim() || $a.attr('title') || '').trim();
  if ((!slug || !displayName)) {
    const $fb = $item.find('.usernameWrap a, a.usernameLink').first();
    if (!displayName) displayName = ($fb.text().trim() || $fb.attr('title') || '').trim();
    if (!slug) slug = getSlugFromHref($fb.attr('href') || '');
  }
  const key = (slug || displayName || '').toLowerCase();
  return key || null;
}

// Ключ владельца страницы профиля: всегда slug из URL, если доступен; иначе — заголовок h1
const PAGE_OWNER_SLUG = IS_PROFILE_PAGE ? getCurrentProfileSlug() : null;
const PAGE_OWNER_NAME = IS_PROFILE_PAGE ? (function () {
  const h = $('.topProfileHeader h1, .channel-banner-info h1, .profile-header .main-title').first();
  return h.length ? h.text().trim() : null;
})() : null;
const PAGE_OWNER_KEY = IS_PROFILE_PAGE ? (PAGE_OWNER_SLUG || PAGE_OWNER_NAME || '').toLowerCase() : null;

/* ===================== Filter/Config Keys ===================== */
const FILTER_PAID_VIDEOS = 'Hide Paid Videos';
const FILTER_PREMIUM_VIDEOS = 'Hide Premium Videos';
const FILTER_PRO_CHANNEL_VIDEOS = 'Hide Pro Channel Videos';
const FILTER_PRIVATE_VIDEOS = 'Hide Private Videos';
const FILTER_RECOMMENDED_VIDEOS = 'Hide Recommended Videos';
const FILTER_VIDEOS_VIEWS = 'Views';
const FILTER_USER = 'User Blacklist';
const FILTER_WATCHED_VIDEOS = 'Watched Filters';
const LINK_DISABLE_PLAYLIST_CONTROLS = 'Disable Playlist Controls';
const LINK_USER_PUBLIC_VIDEOS = 'User Public Videos';
const UI_AUTO_NEXT = 'Auto Next';
const UI_LARGE_PLAYER_ALWAYS = 'Always Enlarge Player';
const UI_REMOVE_LIVE_MODELS_SECTIONS = 'Remove Live Models Sections';
const UI_REMOVE_PORN_STAR_SECTIONS = 'Remove Porn Star Sections';
const CONFIG_USERNAME = 'Your Username (for Subscriptions)';
const FILTER_DL_LIST = 'Hide From DL';

/* ===================== Main Class ===================== */
class PHSearchAndUITweaks extends BrazenBaseSearchEnhancer {
  constructor() {
    super({
      isUserLoggedIn: $('#topRightProfileMenu').length > 0,
      itemDeepAnalysisSelector: '.video-wrapper',
      itemLinkSelector: '.title > a',
      itemListSelectors: 'ul.videos',
      itemNameSelector: '.title > a',
      itemSelectors: '.videoblock',
      requestDelay: 0,
      scriptPrefix: 'ph-sui-'
    });

    this._playlistPageUsername = '';
    this._profilePageUsername = '';

    // Кэши для Hide From DL (ключ: slug || displayName, в нижнем регистре)
    this._dlListCache = new Set();
    this._dlCheckedCache = new Set();

    this._setupFeatures();
    this._setupComplianceFilters();
    this._setupUI();
    this._setupEvents();
  }

  // Принудительно показываем все карточки видео на страницах профилей (байпас скрывающих фильтров)
  _unhideAllItemsOnProfilePage(itemsList) {
    if (!IS_PROFILE_PAGE) return;
    try {
      const items = itemsList.find(this._config.itemSelectors);
      items.each((_i, el) => {
        const $el = $(el);
        $el.show();
        $el.css('display', '');
        $el.removeClass('bv-hidden bv-collapsed bv-filtered-out bv-filter-hidden');
        $el.find('.bv-hidden, .bv-collapsed, .bv-filtered-out, .bv-filter-hidden').removeClass('bv-hidden bv-collapsed bv-filtered-out bv-filter-hidden');
      });
    } catch (e) { /* no-op */ }
  }

  _complyItemsList(itemsList, isInitialCompliance) {
    super._complyItemsList(itemsList, isInitialCompliance);

    // Первый байпас сразу (если какая-то логика скрыла сходу)
    if (IS_PROFILE_PAGE) this._unhideAllItemsOnProfilePage(itemsList);

    this._checkUsernamesOnPage(itemsList).then(() => {
      super._complyItemsList(itemsList, false);
      // Повторный байпас после того, как подгрузился статус DL
      if (IS_PROFILE_PAGE) this._unhideAllItemsOnProfilePage(itemsList);
    });
  }

  // Проверяем авторов на странице. На страницах профилей проверяем одного владельца (slug из URL).
  async _checkUsernamesOnPage(itemsList) {
    if (!this._getConfig(FILTER_DL_LIST)) {
      this._dlListCache.clear();
      this._dlCheckedCache.clear();
      return;
    }

    // Страница профиля: проверяем одного владельца
    if (IS_PROFILE_PAGE) {
      const key = PAGE_OWNER_KEY;
      if (!key || this._dlCheckedCache.has(key)) return;
      await new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://localhost:8080/check?name=' + encodeURIComponent(key),
          onload: (res) => {
            try {
              const data = JSON.parse(res.responseText);
              this._dlCheckedCache.add(key);
              if (data && data.found) this._dlListCache.add(key);
            } catch (e) {
              this._dlCheckedCache.add(key);
            } finally {
              resolve();
            }
          },
          onerror: () => { this._dlCheckedCache.add(key); resolve(); }
        });
      });
      return;
    }

    // Обычные списковые страницы: собираем ключи по карточкам
    const items = itemsList.find(this._config.itemSelectors);
    const keysOnPage = new Set();

    items.each((_i, el) => {
      const key = getProfileKeyFromItem($(el));
      if (key) keysOnPage.add(key);
    });

    const toCheck = Array.from(keysOnPage).filter((k) => !this._dlCheckedCache.has(k));
    if (toCheck.length === 0) return;

    const reqs = toCheck.map((key) => new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://localhost:8080/check?name=' + encodeURIComponent(key),
        onload: (res) => {
          try {
            const data = JSON.parse(res.responseText);
            this._dlCheckedCache.add(key);
            if (data && data.found) this._dlListCache.add(key);
          } catch (e) {
            this._dlCheckedCache.add(key);
          } finally {
            resolve();
          }
        },
        onerror: () => { this._dlCheckedCache.add(key); resolve(); }
      });
    }));

    await Promise.all(reqs);
  }

  _setupProfilePageActions() {
    if (!IS_PROFILE_PAGE) return;
    const self = this;

    const repositionButtons = () => {
      const avatar = $('#avatarPicture');
      const buttonContainer = $('.bv-button-container');
      const positioningParent = $('section.topProfileHeader').first();
      if (!avatar.length || !buttonContainer.length || !positioningParent.length) return;

      const avatarPos = avatar.position();
      const avatarHeight = avatar.outerHeight();
      const avatarWidth = avatar.outerWidth();
      const topPosition = avatarPos.top + avatarHeight + 12;
      const centerOfAvatarX = avatarPos.left + (avatarWidth / 2);

      buttonContainer.css({ top: topPosition + 'px', left: centerOfAvatarX + 'px' });
    };

    setTimeout(() => {
      const nicknameElement = $('.topProfileHeader h1, .channel-banner-info h1, .profile-header .main-title').first();
      const avatarContainer = $('#avatarPicture').first();
      const positioningParent = $('section.topProfileHeader').first();
      if (!nicknameElement.length || !avatarContainer.length || !positioningParent.length || $('.bv-button-container').length > 0) return;

      const actualProfileName = nicknameElement.text().trim();
      if (!actualProfileName) {
        console.error('[PH Tweaks] Could not find the profile name on the page.');
        return;
      }

      const profileSlug = getCurrentProfileSlug();

      positioningParent.css('position', 'relative');
      const buttonContainer = $('<div class="bv-button-container"></div>');
      positioningParent.append(buttonContainer);

      repositionButtons();
      $(window).on('resize', repositionButtons);

      const saveBlacklist = (blacklistArray) => {
        const field = self._configurationManager.getFieldOrFail(FILTER_USER);
        const fakeTextarea = $('<textarea></textarea>').val(blacklistArray.join('\n'));
        const originalElement = field.element;
        field.element = fakeTextarea;
        field.value = blacklistArray;
        self._configurationManager.save();
        field.element = originalElement;
      };

      const updateButtonState = (isBlacklisted) => {
        buttonContainer.find('#bv-add-to-blacklist-btn, #bv-blacklist-badge').remove();
        let buttonToAdd;
        if (isBlacklisted) {
          buttonToAdd = $('<button id="bv-blacklist-badge">⛔ Remove from BL</button>').on('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            let list = self._getConfig(FILTER_USER) || [];
            const lowered = actualProfileName.toLowerCase().trim();
            saveBlacklist(list.filter((u) => String(u).toLowerCase().trim() !== lowered));
            updateButtonState(false);
          });
        } else {
          buttonToAdd = $('<button id="bv-add-to-blacklist-btn">⊕ Add to BL</button>').on('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            let list = self._getConfig(FILTER_USER) || [];
            saveBlacklist([].concat(list, [actualProfileName]));
            updateButtonState(true);
          });
        }
        buttonContainer.prepend(buttonToAdd);
      };

      // Кнопка статуса DL: если не в DL — по клику копируем URL профиля с /videos (/videos/public для users)
      const checkDownloadStatus = (profileKey) => {
        buttonContainer.find('#bv-dl-status-btn').remove();
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://localhost:8080/check?name=' + encodeURIComponent(profileKey),
          onload: function (response) {
            let statusButton;
            try {
              const data = JSON.parse(response.responseText);
              if (data.found) {
                statusButton = $('<button id="bv-dl-status-btn" class="in-list" title="В DL">✓ In DL</button>');
              } else {
                statusButton = $('<button id="bv-dl-status-btn" class="not-in-list" title="Нажмите, чтобы скопировать ссылку на профиль /videos">Not in DL</button>');
                statusButton.on('click', async function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  const url = buildProfileVideosUrl();
                  const ok = await copyToClipboard(url);
                  const prev = statusButton.text();
                  statusButton.text(ok ? 'Copied!' : 'Copy failed');
                  setTimeout(function () { statusButton.text(prev); }, 1200);
                });
              }
            } catch (e) {
              statusButton = $('<button id="bv-dl-status-btn" class="server-offline" title="Сервер DL недоступен">Server Error</button>');
            }
            buttonContainer.append(statusButton);
          },
          onerror: function () {
            const statusButton = $('<button id="bv-dl-status-btn" class="server-offline" title="Сервер DL недоступен">DL Server Offline</button>');
            buttonContainer.append(statusButton);
          }
        });
      };

      const initialBlacklist = self._getConfig(FILTER_USER) || [];
      const loweredList = initialBlacklist.map((u) => String(u).toLowerCase().trim());
      updateButtonState(loweredList.includes(actualProfileName.toLowerCase().trim()));

      // На сервер отправляем slug, при его отсутствии — display name
      checkDownloadStatus(profileSlug || actualProfileName);
    }, 500);
  }

  _autoNext() {
    let allVideos = $('.nf-videos ' + this._config.itemSelectors);
    if (allVideos.length > 0 && !allVideos.is(':visible')) {
      let nextButton = $('.page_next:not(.disabled) > a');
      if (nextButton.length) {
        window.location = nextButton.attr('href');
      }
    }
  }

  _complyProfileLinks() {
    $('.usernameBadgesWrapper a, a.usernameLink, .usernameWrap a').each((index, profileLink) => {
      profileLink = $(profileLink);
      let href = profileLink.attr('href');
      if (!href) return;
      if (href.startsWith('/channels') || href.startsWith('/model') || href.startsWith('/pornstar')) {
        profileLink.attr('href', href + '/videos');
      } else if (href.startsWith('/user') || href.startsWith('/users')) {
        profileLink.attr('href', href + '/videos/public');
      }
    });
  }

  _enlargePlayer() {
    let player = $('#player');
    if (player.hasClass('original')) {
      player.removeClass('original').addClass('wide');
    }
  }

  _fixLeftOverSpaceOnVideoSearchPage() {
    $('.showingCounter, .tagsForWomen').each((index, div) => { div.style.height = 'auto'; });
  }

  _fixPaginationNavOnVideoSearchPage() {
    $('.pagination3').insertAfter($('div.nf-videos .search-video-thumbs'));
  }

  _removeLoadMoreButtons() {
    $('.more_recommended_btn, #loadMoreRelatedVideosCenter').remove();
  }

  _removePremiumSectionFromSearchPage() {
    $('.nf-videos .sectionWrapper .sectionTitle h2').each((index, element) => {
      let sectionTitle = $(element);
      if (sectionTitle.text().trim() === 'Premium Videos') {
        sectionTitle.parents('.sectionWrapper:first').remove();
        return false;
      }
    });
  }

  // На странице профиля всегда показываем все видео-секции (paid/fanonly/private), не завися от флагов скрытия
  _removeVideoSectionsOnProfilePage() {
    const videoSections = [
      { linkSuffix: 'paid' },
      { linkSuffix: 'fanonly' },
      { linkSuffix: 'private' }
    ];
    for (let videoSection of videoSections) {
      let videoSectionWrapper = $('.videoSection > div > div > h2 > a[href$="/' + videoSection.linkSuffix + '"]').parents('.videoSection:first');
      videoSectionWrapper.show();
    }
  }

  _setupComplianceFilters() {
    this._addItemTextSanitizationFilter(
      'Censor video names by substituting offensive phrases. Each rule in separate line with comma separated target phrases. ' +
      'Requires page reload to apply. Example Rule: boyfriend=stepson,stepdad'
    );
    this._addItemWhitelistFilter('Show videos with specified phrases in their names. Separate the phrases with line breaks.');
    this._addItemTextSearchFilter();

    // На профилях не скрываем просмотренные
    this._addItemComplianceFilter(FILTER_WATCHED_VIDEOS, (item, value) => {
      if (IS_PROFILE_PAGE) return true;
      if (value === '1') return !this._get(item, FILTER_WATCHED_VIDEOS);
      if (value === '2') return this._get(item, FILTER_WATCHED_VIDEOS);
      return true;
    });

    this._addItemPercentageRatingRangeFilter('.value');
    this._addItemDurationRangeFilter('.duration');
    this._addItemComplianceFilter(FILTER_VIDEOS_VIEWS);
    this._addItemComplianceFilter(FILTER_PRO_CHANNEL_VIDEOS);
    this._addItemComplianceFilter(FILTER_PAID_VIDEOS);
    this._addItemComplianceFilter(FILTER_PREMIUM_VIDEOS);
    this._addItemComplianceFilter(FILTER_PRIVATE_VIDEOS);
    this._addItemComplianceFilter(FILTER_RECOMMENDED_VIDEOS);

    // Hide From DL — на странице профиля НЕ применяем скрытие (но статус/кнопка продолжают работать)
    this._addItemComplianceFilter(FILTER_DL_LIST, (item) => {
      if (IS_PROFILE_PAGE) return true;
      const key = IS_PROFILE_PAGE ? PAGE_OWNER_KEY : getProfileKeyFromItem(item);
      if (!key) return true;
      return !this._dlListCache.has(key);
    });

    // Blacklist пользователей — на страницах профилей не скрываем
    this._addItemComplianceFilter(FILTER_USER, (item, users) => {
      if (IS_PROFILE_PAGE) return true;
      const username = (this._get(item, FILTER_USER) || '').toLowerCase().trim();
      const blacklist = users.map((u) => String(u).toLowerCase().trim());
      return !blacklist.includes(username);
    });

    // Subscriptions filter: не применять на профилях
    this._addSubscriptionsFilter(() => !IS_FEED_PAGE && !IS_PROFILE_PAGE, (item) => {
      let username = this._get(item, FILTER_USER);
      return (username === this._playlistPageUsername || username === this._profilePageUsername) ? false : username;
    });

    this._addItemBlacklistFilter('Hide videos with specified phrases in their names.');
  }

  _setupEvents() {
    if (IS_FEED_PAGE) {
      this._onAfterInitialization.push(() =>
        ChildObserver.create()
          .onNodesAdded((itemsAdded) => {
            let itemsList;
            for (let item of itemsAdded) {
              if (typeof item.querySelector === 'function') {
                itemsList = item.querySelector(this._config.itemListSelectors);
                if (itemsList) this._complyItemsList($(itemsList));
              }
            }
          })
          .observe($('#moreData')[0])
      );
    } else if (IS_VIDEO_SEARCH_PAGE) {
      this._onAfterInitialization.push(() => this._performOperation(UI_AUTO_NEXT, () => this._autoNext()));
    }

    this._onBeforeUIBuild.push(() => {
      if (IS_PROFILE_PAGE) {
        const pathParts = PAGE_PATH_NAME.split('/').filter((p) => p);
        this._profilePageUsername = decodeURIComponent(pathParts[1] || '');
      }

      if (IS_VIDEO_PAGE) {
        this._performOperation(FILTER_PAID_VIDEOS, () => $('#p2vVideosVPage').remove());
        this._performOperation(UI_LARGE_PLAYER_ALWAYS, () => this._enlargePlayer());
        this._removeLoadMoreButtons();
        Validator.sanitizeNodeOfSelector('.inlineFree', this._configurationManager.getFieldOrFail(FILTER_TEXT_SANITIZATION).optimized);
      } else if (IS_VIDEO_SEARCH_PAGE) {
        this._performOperation(UI_REMOVE_PORN_STAR_SECTIONS, () => $('#relatedPornstarSidebar').remove());
        this._performOperation(FILTER_PREMIUM_VIDEOS, () => this._removePremiumSectionFromSearchPage());
        this._fixLeftOverSpaceOnVideoSearchPage();
        this._fixPaginationNavOnVideoSearchPage();
      } else if (IS_PROFILE_PAGE) {
        this._removeVideoSectionsOnProfilePage();
      } else if (IS_PLAYLIST_PAGE) {
        this._playlistPageUsername = $('#js-aboutPlaylistTabView .usernameWrap a').text().trim();
        if (this._getConfig(LINK_DISABLE_PLAYLIST_CONTROLS)) {
          this._onFirstHitAfterCompliance.push((item) => this._validatePlaylistVideoLink(item));
        }
      }

      this._performOperation(
        UI_REMOVE_LIVE_MODELS_SECTIONS,
        () => $('.streamateContent').each((index, element) => { $(element).parents('.sectionWrapper:first').remove(); })
      );
    });

    this._onAfterUIBuild.push(() => {
      this._performOperation(LINK_USER_PUBLIC_VIDEOS, () => this._complyProfileLinks());
      this._setupProfilePageActions();
      this._uiGen.getSelectedSection()[0].userScript = this;
    });
  }

  _setupFeatures() {
    this._configurationManager
      .addFlagField(FILTER_PAID_VIDEOS, 'Hide paid videos.')
      .addFlagField(FILTER_PREMIUM_VIDEOS, 'Hide premium videos.')
      .addFlagField(FILTER_PRIVATE_VIDEOS, 'Hide private Videos.')
      .addFlagField(FILTER_PRO_CHANNEL_VIDEOS, 'Hide videos from professional channels.')
      .addFlagField(FILTER_RECOMMENDED_VIDEOS, 'Hide recommended videos.')
      .addFlagField(FILTER_DL_LIST, 'Hide videos from users in your local DL.')
      .addFlagField(LINK_DISABLE_PLAYLIST_CONTROLS, 'Disable playlist controls on video pages.')
      .addFlagField(LINK_USER_PUBLIC_VIDEOS, 'Jump directly to public videos on any profile link click.')
      .addFlagField(UI_AUTO_NEXT, 'Automatically go to next search page if no videos match after first run.')
      .addFlagField(UI_LARGE_PLAYER_ALWAYS, 'Enlarges player on all video pages.')
      .addFlagField(UI_REMOVE_LIVE_MODELS_SECTIONS, 'Remove live model stream sections from search.')
      .addFlagField(UI_REMOVE_PORN_STAR_SECTIONS, 'Remove porn star listings from search.')
      .addRadiosGroup(FILTER_WATCHED_VIDEOS, [
        ['No Filtering', 0],
        ['Hide Watched Videos', 1],
        ['Show Only Watched Videos', 2]
      ], 'Control fate of already watched videos.')
      .addRangeField(FILTER_VIDEOS_VIEWS, 0, 10000000, 'Filter videos by view count.')
      .addRulesetField(FILTER_USER, 6, 'Hides videos from specified users/channels.')
      .addTextField(CONFIG_USERNAME, 'Если загрузка подписок не удалась, введите сюда свой никнейм.');

    this._itemAttributesResolver
      .addAttribute(FILTER_PAID_VIDEOS, (item) => Validator.isChildMissing(item, '.p2v-icon, .fanClubVideoWrapper'))
      .addAttribute(FILTER_PREMIUM_VIDEOS, (item) => Validator.isChildMissing(item, '.marker-overlays > .premiumIcon'))
      .addAttribute(FILTER_PRIVATE_VIDEOS, (item) => Validator.isChildMissing(item, '.privateOverlay'))
      .addAttribute(FILTER_PRO_CHANNEL_VIDEOS, (item) => Validator.isChildMissing(item, '.channel-icon'))
      .addAttribute(FILTER_RECOMMENDED_VIDEOS, (item) => Validator.isChildMissing(item, '.recommendedFor'))
      .addAttribute(FILTER_USER, (item) => {
        const link = item.find('.usernameWrap a, a.usernameLink').first();
        return (link.text().trim() || link.attr('title') || '').trim();
      })
      .addAttribute(FILTER_VIDEOS_VIEWS, (item) => {
        let viewsCountString = item.find('.views var').text();
        let viewsCountMultiplier = 1;
        let viewsCountStringLength = viewsCountString.length;
        if (viewsCountString[viewsCountStringLength - 1] === 'K') {
          viewsCountMultiplier = 1000;
          viewsCountString = viewsCountString.replace('K', '');
        } else if (viewsCountString[viewsCountStringLength - 1] === 'M') {
          viewsCountMultiplier = 1000000;
          viewsCountString = viewsCountString.replace('M', '');
        }
        return parseFloat(viewsCountString) * viewsCountMultiplier;
      })
      .addAttribute(FILTER_WATCHED_VIDEOS, (item) =>
        Validator.doesChildExist(item, '.watchedVideoText') || Validator.doesChildExist(item, '.watchedVideo')
      );

    // Subscriptions loader
    let subsUrl = null;
    const manualUsername = (this._getConfig(CONFIG_USERNAME) || '').trim();
    if (manualUsername) {
      subsUrl = window.location.origin + '/users/' + manualUsername + '/subscriptions';
    } else {
      const profileLinkElement = $('#topRightProfileMenu a[href^="/users/"]');
      if (profileLinkElement.length > 0) {
        const profilePath = profileLinkElement.first().attr('href');
        if (profilePath) subsUrl = window.location.origin + profilePath + '/subscriptions';
      }
    }
    if (!subsUrl) {
      console.error('[PH Tweaks] Subscription URL could not be constructed. Please enter your username manually in the script settings (Settings tab).');
    }

    this._setupSubscriptionLoader().addConfig({
      url: subsUrl,
      getPageCount: (page) => {
        const countText = page.find('.showingInfo').first().text();
        if (!countText) return 0;
        const totalSubs = parseInt(countText.replace(/\D/g, ''), 10);
        return Math.ceil(totalSubs / 100);
      },
      getPageUrl: (baseUrl, pageNo) => baseUrl + '?page=' + pageNo,
      subscriptionsCountSelector: '.showingInfo',
      subscriptionNameSelector: 'a.usernameLink'
    });
  }

  _setupUI() {
    const tab1 = this._uiGen.createTabPanel('Filters 1', true).append([
      this._configurationManager.createElement(FILTER_DURATION_RANGE),
      this._configurationManager.createElement(FILTER_PERCENTAGE_RATING_RANGE),
      this._configurationManager.createElement(FILTER_VIDEOS_VIEWS),
      this._uiGen.createBreakSeparator(),
      this._configurationManager.createElement(FILTER_PAID_VIDEOS),
      this._configurationManager.createElement(FILTER_PREMIUM_VIDEOS),
      this._configurationManager.createElement(FILTER_PRIVATE_VIDEOS),
      this._configurationManager.createElement(FILTER_PRO_CHANNEL_VIDEOS),
      this._configurationManager.createElement(FILTER_RECOMMENDED_VIDEOS),
      this._configurationManager.createElement(FILTER_SUBSCRIBED_VIDEOS),
      this._configurationManager.createElement(FILTER_DL_LIST),
      this._configurationManager.createElement(FILTER_UNRATED),
      this._uiGen.createSeparator(),
      this._configurationManager.createElement(FILTER_WATCHED_VIDEOS),
      this._uiGen.createSeparator(),
      this._configurationManager.createElement(OPTION_DISABLE_COMPLIANCE_VALIDATION)
    ]);

    const tab2 = this._uiGen.createTabPanel('Filters 2').append([
      this._configurationManager.createElement(FILTER_TEXT_SEARCH),
      this._configurationManager.createElement(FILTER_TEXT_BLACKLIST),
      this._configurationManager.createElement(FILTER_TEXT_WHITELIST),
      this._configurationManager.createElement(FILTER_TEXT_SANITIZATION),
      this._configurationManager.createElement(FILTER_USER)
    ]);

    const tab3 = this._uiGen.createTabPanel('Interface').append([
      this._configurationManager.createElement(UI_LARGE_PLAYER_ALWAYS),
      this._configurationManager.createElement(LINK_DISABLE_PLAYLIST_CONTROLS),
      this._configurationManager.createElement(LINK_USER_PUBLIC_VIDEOS),
      this._configurationManager.createElement(UI_AUTO_NEXT),
      this._uiGen.createSeparator(),
      this._configurationManager.createElement(UI_REMOVE_LIVE_MODELS_SECTIONS),
      this._configurationManager.createElement(UI_REMOVE_PORN_STAR_SECTIONS)
    ]);

    const tab4 = this._uiGen.createTabPanel('Settings').append([
      this._configurationManager.createElement(OPTION_ALWAYS_SHOW_SETTINGS_PANE),
      this._uiGen.createSeparator(),
      this._uiGen.createFormSection('Account').append([
        this._configurationManager.createElement(CONFIG_USERNAME),
        this._createSubscriptionLoaderControls()
      ]),
      this._uiGen.createSeparator(),
      this._createSettingsBackupRestoreFormActions()
    ]);

    const tab5 = this._uiGen.createTabPanel('Stats').append([
      this._uiGen.createStatisticsFormGroup(FILTER_TEXT_BLACKLIST),
      this._uiGen.createStatisticsFormGroup(FILTER_TEXT_WHITELIST),
      this._uiGen.createStatisticsFormGroup(FILTER_DURATION_RANGE),
      this._uiGen.createStatisticsFormGroup(FILTER_TEXT_SEARCH),
      this._uiGen.createStatisticsFormGroup(FILTER_PAID_VIDEOS, 'Paid Videos'),
      this._uiGen.createStatisticsFormGroup(FILTER_PREMIUM_VIDEOS, 'Premium Videos'),
      this._uiGen.createStatisticsFormGroup(FILTER_PRIVATE_VIDEOS, 'Private Videos'),
      this._uiGen.createStatisticsFormGroup(FILTER_PRO_CHANNEL_VIDEOS, 'Pro Channel Videos'),
      this._uiGen.createStatisticsFormGroup(FILTER_PERCENTAGE_RATING_RANGE),
      this._uiGen.createStatisticsFormGroup(FILTER_RECOMMENDED_VIDEOS, 'Recommended'),
      this._uiGen.createStatisticsFormGroup(FILTER_SUBSCRIBED_VIDEOS, 'Subscribed'),
      this._uiGen.createStatisticsFormGroup(FILTER_DL_LIST, 'In DL'),
      this._uiGen.createStatisticsFormGroup(FILTER_UNRATED, 'Unrated'),
      this._uiGen.createStatisticsFormGroup(FILTER_VIDEOS_VIEWS),
      this._uiGen.createStatisticsFormGroup(FILTER_WATCHED_VIDEOS, 'Watched'),
      this._uiGen.createSeparator(),
      this._uiGen.createStatisticsTotalsGroup()
    ]);

    const tabs = this._uiGen.createTabsSection(['Filters 1', 'Filters 2', 'Interface', 'Settings', 'Stats'], [tab1, tab2, tab3, tab4, tab5]);

    this._userInterface = [
      tabs,
      this._createSettingsFormActions()
    ];
  }

  _validatePlaylistVideoLink(videoItem) {
    videoItem.find('a').each((_i, playlistLink) => {
      playlistLink = $(playlistLink);
      playlistLink.attr('href', playlistLink.attr('href').replace(/&pkey.*/, ''));
    });
  }
}

/* ===================== Init ===================== */
(new PHSearchAndUITweaks()).init();