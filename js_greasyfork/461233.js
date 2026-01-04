// ==UserScript==
// @name            Annict Following Viewings
// @namespace       https://github.com/SlashNephy
// @version         0.4.2
// @author          SlashNephy
// @description     Display following viewings on Annict work page.
// @description:ja  Annictの作品ページにフォロー中のユーザーの視聴状況を表示します。
// @homepage        https://scrapbox.io/slashnephy/Annict_%E3%81%AE%E4%BD%9C%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E4%B8%AD%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E8%A6%96%E8%81%B4%E7%8A%B6%E6%B3%81%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/Annict_%E3%81%AE%E4%BD%9C%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E4%B8%AD%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E8%A6%96%E8%81%B4%E7%8A%B6%E6%B3%81%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @icon            https://www.google.com/s2/favicons?sz=64&domain=annict.com
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://annict.com/*
// @require         https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @connect         api.annict.com
// @connect         raw.githubusercontent.com
// @connect         graphql.anilist.co
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/461233/Annict%20Following%20Viewings.user.js
// @updateURL https://update.greasyfork.org/scripts/461233/Annict%20Following%20Viewings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var lib = {};

    var hasRequiredLib;
    function requireLib() {
      if (hasRequiredLib) return lib;
      hasRequiredLib = 1;
      Object.defineProperty(lib, "__esModule", {
        value: true
      });
      lib.hasLength = hasLength;
      lib.hasMinLength = hasMinLength;
      lib.isNonEmpty = isNonEmpty;
      /**
       * Checks whether given array's length is equal to given number.
       *
       * @example
       * ```ts
       * hasLength(arr, 1) // equivalent to arr.length === 1
       * ```
       */
      function hasLength(arr, length) {
        return arr.length === length;
      }
      /**
       * Checks whether given array's length is greather than or equal to given number.
       *
       * @example
       * ```ts
       * hasMinLength(arr, 1) // equivalent to arr.length >= 1
       * ```
       */
      function hasMinLength(arr, length) {
        return arr.length >= length;
      }
      /**
       * Checks whether given array is not empty.
       *
       * @example
       * ```ts
       * isNonEmpty(arr) // equivalent to arr.length > 0
       * ```
       */
      function isNonEmpty(arr) {
        return arr.length >= 1;
      }
      return lib;
    }

    var libExports = requireLib();

    async function fetchAniListFollowingStatuses(mediaId, page, token) {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            body: JSON.stringify({
                query: `
        query($mediaId: Int!, $page: Int!) {
          Page(page: $page, perPage: 50) {
            mediaList(type: ANIME, mediaId: $mediaId, isFollowing: true) {
              user {
                name
                avatar {
                  large
                }
              }
              status
              score
              progress
              media {
                episodes
              }
              notes
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `,
                variables: {
                    mediaId,
                    page,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    }
    async function fetchPaginatedAniListFollowingStatuses(mediaId, token) {
        const results = [];
        let page = 1;
        while (true) {
            const response = await fetchAniListFollowingStatuses(mediaId, page, token);
            if ('errors' in response) {
                return response;
            }
            results.push(response);
            if (!response.data.Page.pageInfo.hasNextPage) {
                break;
            }
            page++;
        }
        return results;
    }

    async function fetchAnnictFollowingStatuses(workId, cursor, token) {
        const response = await fetch('https://api.annict.com/graphql', {
            method: 'POST',
            body: JSON.stringify({
                query: `
        query($workId: Int!, $cursor: String) {
          viewer {
            following(after: $cursor) {
              nodes {
                name
                username
                avatarUrl
                watched: works(annictIds: [$workId], state: WATCHED) {
                  nodes {
                    annictId
                  }
                }
                watching: works(annictIds: [$workId], state: WATCHING) {
                  nodes {
                    annictId
                  }
                }
                stopWatching: works(annictIds: [$workId], state: STOP_WATCHING) {
                  nodes {
                    annictId
                  }
                }
                onHold: works(annictIds: [$workId], state: ON_HOLD) {
                  nodes {
                    annictId
                  }
                }
                wannaWatch: works(annictIds: [$workId], state: WANNA_WATCH) {
                  nodes {
                    annictId
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
                variables: {
                    workId,
                    cursor,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    }
    async function fetchPaginatedAnnictFollowingStatuses(workId, token) {
        const results = [];
        let cursor = null;
        while (true) {
            const response = await fetchAnnictFollowingStatuses(workId, cursor, token);
            if ('errors' in response) {
                return response;
            }
            results.push(response);
            if (!response.data.viewer.following.pageInfo.hasNextPage) {
                break;
            }
            cursor = response.data.viewer.following.pageInfo.endCursor;
        }
        return results;
    }

    async function fetchArmEntries(branch = 'master') {
        const response = await fetch(`https://raw.githubusercontent.com/SlashNephy/arm-supplementary/${branch}/dist/arm.json`);
        return response.json();
    }

    class GM_Value {
        key;
        defaultValue;
        constructor(key, defaultValue, initialize = true) {
            this.key = key;
            this.defaultValue = defaultValue;
            const value = GM_getValue(key, null);
            if (initialize && value === null) {
                GM_setValue(key, defaultValue);
            }
        }
        get() {
            return GM_getValue(this.key, this.defaultValue);
        }
        set(value) {
            GM_setValue(this.key, value);
        }
        delete() {
            GM_deleteValue(this.key);
        }
        pop() {
            const value = this.get();
            this.delete();
            return value;
        }
    }

    const annictTokenKey = 'annict_token';
    const anilistTokenKey = 'anilist_token';
    const anilistCallbackKey = 'anilist_callback';
    const anilistClientId = '12566';
    const style = document.createElement('style');
    document.head.appendChild(style);
    GM_config.init({
        id: 'annict_following_viewings',
        title: 'Annict Following Viewings 設定',
        fields: {
            [annictTokenKey]: {
                label: 'Annict 個人用アクセストークン',
                type: 'text',
                default: '',
            },
            annictTokenButton: {
                type: 'annictTokenButton',
            },
            [anilistTokenKey]: {
                label: 'AniList アクセストークン',
                type: 'text',
                default: '',
            },
            anilistAuthorizeButton: {
                type: 'anilistAuthorizeButton',
            },
            [anilistCallbackKey]: {
                type: 'hidden',
            },
        },
        types: {
            annictTokenButton: {
                default: null,
                toNode() {
                    const div = document.createElement('div');
                    const anchor = document.createElement('a');
                    anchor.classList.add('button');
                    anchor.href = 'https://annict.com/settings/tokens/new';
                    anchor.textContent = 'Annict のアクセストークンを発行する';
                    anchor.target = '_blank';
                    div.appendChild(anchor);
                    const description = document.createElement('p');
                    description.classList.add('description');
                    description.textContent
                        = 'スコープは「読み取り専用」を選択してください。発行されたアクセストークンを上に貼り付けてください。';
                    div.appendChild(description);
                    return div;
                },
                toValue() {
                    return null;
                },
                reset() { },
            },
            anilistAuthorizeButton: {
                default: null,
                toNode() {
                    const anchor = document.createElement('a');
                    anchor.classList.add('button');
                    anchor.href = `https://anilist.co/api/v2/oauth/authorize?client_id=${anilistClientId}&response_type=token`;
                    anchor.textContent = 'AniList と連携する';
                    anchor.target = '_top';
                    anchor.addEventListener('click', () => {
                        GM_config.set(anilistCallbackKey, window.location.href);
                        GM_config.write();
                    });
                    return anchor;
                },
                toValue() {
                    return null;
                },
                reset() { },
            },
        },
        events: {
            open() {
                style.textContent = `
        .l-default {
          filter: blur(10px);
        }
        iframe#annict_following_viewings {
          border: 0 !important;
          border-radius: 20px;
          height: 70% !important;
          width: 50% !important;
          left: 50% !important;
          top: 50% !important;
          opacity: 0.9 !important;
          transform: translate(-50%, -50%);
        }
      `;
            },
            close() {
                style.textContent = '';
            },
            save() {
                window.location.reload();
            },
        },
        css: `
    body {
      background: #33363a !important;
      color: #e9ecef !important;
      -webkit-font-smoothing: antialiased !important;
      text-rendering: optimizeSpeed !important;
    }
    .config_header {
      font-weight: 700 !important;
      font-size: 1.75rem !important;
      padding: 1em !important;
    }
    .config_var {
      padding: 2em !important;
    }
    .field_label {
      font-weight: normal !important;
      font-size: 1.2rem !important;
    }
    input {
      background-color: #212529 !important;
      color: #e9ecef;
      display: block;
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      background-clip: padding-box;
      border: 1px solid #495057;
      appearance: none;
      border-radius: 0.3rem;
      transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    }
    div:has(> .saveclose_buttons) {
      text-align: center !important;
    }
    .saveclose_buttons {
      box-sizing: border-box;
      display: inline-block;
      font-weight: 400;
      line-height: 1.5;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.375rem 0.75rem !important;
      font-size: 1rem;
      border-radius: 50rem;
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
      color: #fff;
      background-color: #d51c5b;
      border-color: #d51c5b;
      -webkit-appearance: button;
    }
    .reset {
      color: #e9ecef !important;
    }
    a.button {
      color: #7ca1f3;
      text-decoration: none;
      padding-left: 2em;
    }
    p.description {
      padding-left: 3em;
      margin-top: 4px;
    }
    div#annict_following_viewings_anilist_callback_var {
      display: none;
    }
  `,
    });
    const migrate = () => {
        const annictTokenRef = new GM_Value('ANNICT_TOKEN');
        const annictToken = annictTokenRef.pop();
        if (annictToken !== undefined) {
            GM_config.set(annictTokenKey, annictToken);
        }
    };
    const parseAnnictFollowingStatuses = (response) => response.data.viewer.following.nodes
        .map((u) => {
        let label;
        let iconClasses;
        let iconColor;
        if (u.watched.nodes.length > 0) {
            label = '見た';
            iconClasses = ['fa-solid', 'fa-check'];
            iconColor = '--ann-status-completed-color';
        }
        else if (u.watching.nodes.length > 0) {
            label = '見てる';
            iconClasses = ['fa-solid', 'fa-play'];
            iconColor = '--ann-status-watching-color';
        }
        else if (u.stopWatching.nodes.length > 0) {
            label = '視聴停止';
            iconClasses = ['fa-solid', 'fa-stop'];
            iconColor = '--ann-status-dropped-color';
        }
        else if (u.onHold.nodes.length > 0) {
            label = '一時中断';
            iconClasses = ['fa-solid', 'fa-pause'];
            iconColor = '--ann-status-on-hold-color';
        }
        else if (u.wannaWatch.nodes.length > 0) {
            label = '見たい';
            iconClasses = ['fa-solid', 'fa-circle'];
            iconColor = '--ann-status-plan-to-watch-color';
        }
        else {
            return null;
        }
        return {
            name: u.name,
            service: 'annict',
            username: u.username,
            avatarUrl: u.avatarUrl,
            label,
            iconClasses,
            iconColor,
        };
    })
        .filter((x) => !!x);
    const parseAniListFollowingStatuses = (response) => response.data.Page.mediaList.map((u) => {
        let statusLabel;
        let iconClasses;
        let iconColor;
        switch (u.status) {
            case 'CURRENT':
                statusLabel = '見てる';
                iconClasses = ['fa-solid', 'fa-play'];
                iconColor = '--ann-status-watching-color';
                break;
            case 'PLANNING':
                statusLabel = '見たい';
                iconClasses = ['fa-solid', 'fa-circle'];
                iconColor = '--ann-status-plan-to-watch-color';
                break;
            case 'COMPLETED':
                statusLabel = '見た';
                iconClasses = ['fa-solid', 'fa-check'];
                iconColor = '--ann-status-completed-color';
                break;
            case 'DROPPED':
                statusLabel = '視聴停止';
                iconClasses = ['fa-solid', 'fa-stop'];
                iconColor = '--ann-status-dropped-color';
                break;
            case 'PAUSED':
                statusLabel = '一時中断';
                iconClasses = ['fa-solid', 'fa-pause'];
                iconColor = '--ann-status-on-hold-color';
                break;
            case 'REPEATING':
                statusLabel = 'リピート中';
                iconClasses = ['fa-solid', 'fa-forward'];
                iconColor = '--ann-status-watching-color';
                break;
        }
        let label = statusLabel;
        if (u.progress > 0 && u.progress !== u.media.episodes && u.status !== 'COMPLETED') {
            label += ` (${u.progress}話まで見た)`;
        }
        if (u.score > 0) {
            label += ` [${u.score} / 10]`;
        }
        return {
            name: u.user.name,
            service: 'anilist',
            username: u.user.name,
            avatarUrl: u.user.avatar.large,
            label,
            comment: u.notes ?? undefined,
            iconClasses,
            iconColor,
        };
    });
    const annictWorkPageUrlPattern = /^https:\/\/annict\.com\/works\/(\d+)/;
    const renderSectionTitle = () => {
        const title = document.createElement('div');
        title.classList.add('container', 'mt-5');
        {
            const div = document.createElement('div');
            div.classList.add('d-flex', 'justify-content-between');
            title.appendChild(div);
        }
        {
            const h2 = document.createElement('h2');
            h2.classList.add('fw-bold', 'h3', 'mb-3');
            h2.textContent = 'フォロー中のユーザーの視聴状況';
            title.appendChild(h2);
        }
        return title;
    };
    const renderSectionBody = () => {
        const body = document.createElement('div');
        body.classList.add('container', 'u-container-flat');
        {
            const card = document.createElement('div');
            card.classList.add('card', 'u-card-flat');
            body.appendChild(card);
            {
                const cardBody = document.createElement('div');
                {
                    cardBody.classList.add('card-body');
                    const loading = document.createElement('div');
                    loading.classList.add('loading');
                    loading.textContent = '読み込み中...';
                    cardBody.appendChild(loading);
                }
                const row = document.createElement('div');
                row.classList.add('row', 'g-3');
                cardBody.appendChild(row);
                card.appendChild(cardBody);
                return [body, cardBody, row];
            }
        }
    };
    const renderSectionBodyContent = (row, statuses) => {
        for (const status of statuses) {
            const col = document.createElement('div');
            col.classList.add('col-6', 'col-sm-3');
            col.style.display = 'flex';
            row.appendChild(col);
            {
                const avatarCol = document.createElement('div');
                avatarCol.classList.add('col-auto', 'pe-0');
                col.appendChild(avatarCol);
                {
                    const a = document.createElement('a');
                    if (status.service === 'annict') {
                        a.href = `/@${status.username}`;
                    }
                    else {
                        a.href = `https://anilist.co/user/${status.username}`;
                        a.target = '_blank';
                    }
                    avatarCol.appendChild(a);
                    {
                        const img = document.createElement('img');
                        img.classList.add('img-thumbnail', 'rounded-circle');
                        img.style.width = '50px';
                        img.style.height = '50px';
                        img.style.marginRight = '1em';
                        img.src = status.avatarUrl;
                        a.appendChild(img);
                    }
                }
                const userCol = document.createElement('div');
                userCol.classList.add('col');
                col.appendChild(userCol);
                {
                    const div1 = document.createElement('div');
                    userCol.appendChild(div1);
                    {
                        const a = document.createElement('a');
                        a.classList.add('fw-bold', 'me-1', 'text-body');
                        if (status.service === 'annict') {
                            a.href = `/@${status.username}`;
                        }
                        else {
                            a.href = `https://anilist.co/user/${status.username}`;
                            a.target = '_blank';
                        }
                        div1.appendChild(a);
                        {
                            const span = document.createElement('span');
                            span.classList.add('me-1');
                            span.textContent = status.name;
                            a.appendChild(span);
                        }
                        {
                            const small = document.createElement('small');
                            small.style.marginRight = '1em';
                            small.classList.add('text-muted');
                            if (status.service === 'annict') {
                                small.textContent = `@${status.username}`;
                            }
                            a.appendChild(small);
                        }
                    }
                    const div2 = document.createElement('div');
                    div2.classList.add('small', 'text-body');
                    userCol.appendChild(div2);
                    {
                        const i = document.createElement('i');
                        i.classList.add(...status.iconClasses);
                        i.style.color = `var(${status.iconColor})`;
                        div2.appendChild(i);
                    }
                    {
                        const small = document.createElement('small');
                        small.style.marginLeft = '5px';
                        small.textContent = status.label;
                        div2.appendChild(small);
                    }
                    if (status.comment) {
                        const p = document.createElement('p');
                        {
                            const i = document.createElement('i');
                            i.textContent = status.comment ?? '';
                            p.appendChild(i);
                        }
                        div2.appendChild(p);
                    }
                }
            }
        }
    };
    const handle = async () => {
        if (window.location.pathname === '/') {
            const hash = new URLSearchParams(window.location.hash.substring(1));
            const token = hash.get('access_token');
            if (token !== null) {
                GM_config.set(anilistTokenKey, token);
                window.location.hash = '';
                alert('[Annict Following Viewings] AniList と接続しました。');
                const callback = GM_config.get(anilistCallbackKey);
                GM_config.set(anilistCallbackKey, '');
                GM_config.write();
                if (typeof callback === 'string' && callback.length > 0) {
                    window.location.href = callback;
                }
            }
            return;
        }
        const workMatch = annictWorkPageUrlPattern.exec(window.location.href);
        if (!workMatch || !libExports.hasMinLength(workMatch, 2)) {
            return;
        }
        const annictWorkId = parseInt(workMatch[1], 10);
        if (!annictWorkId) {
            throw new Error('failed to extract Annict work ID');
        }
        const header = document.querySelector('.c-work-header');
        if (header === null) {
            throw new Error('failed to find .c-work-header');
        }
        const title = renderSectionTitle();
        header.insertAdjacentElement('afterend', title);
        const [body, card, row] = renderSectionBody();
        title.insertAdjacentElement('afterend', body);
        const settingsAnchor = document.createElement('a');
        settingsAnchor.href = 'about:blank';
        settingsAnchor.textContent = '設定';
        settingsAnchor.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            GM_config.open();
        });
        const annictToken = GM_config.get(annictTokenKey);
        const anilistToken = GM_config.get(anilistTokenKey);
        if (!annictToken && !anilistToken) {
            const guideAnchor = document.createElement('a');
            guideAnchor.href
                = 'https://scrapbox.io/slashnephy/Annict_%E3%81%AE%E4%BD%9C%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E4%B8%AD%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AE%E8%A6%96%E8%81%B4%E7%8A%B6%E6%B3%81%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript';
            guideAnchor.textContent = 'ガイド';
            guideAnchor.target = '_blank';
            card.textContent = '';
            card.append('Annict Following Viewings の動作にはアクセストークンの設定が必要です。', guideAnchor, 'を参考に', settingsAnchor, 'を行ってください。');
            return;
        }
        card.append(document.createElement('br'), settingsAnchor);
        const promises = [];
        if (typeof annictToken === 'string' && annictToken.length > 0) {
            promises.push(insertAnnictFollowingStatuses(annictWorkId, annictToken, card, row));
        }
        if (typeof anilistToken === 'string' && anilistToken.length > 0) {
            promises.push(insertAniListFollowingStatuses(annictWorkId, anilistToken, card, row));
        }
        await Promise.all(promises);
        if (row.children.length === 0) {
            card.append('フォロー中のユーザーの視聴状況はありません。');
        }
    };
    const insertAnnictFollowingStatuses = async (annictWorkId, annictToken, card, row) => {
        const responses = await fetchPaginatedAnnictFollowingStatuses(annictWorkId, annictToken);
        card.querySelector('.loading')?.remove();
        if ('errors' in responses) {
            const error = responses.errors.map(({ message }) => message).join('\n');
            card.append(`Annict GraphQL API がエラーを返しました。\n${error}`);
            return;
        }
        const statuses = responses.map((r) => parseAnnictFollowingStatuses(r)).flat();
        if (statuses.length > 0) {
            renderSectionBodyContent(row, statuses);
        }
    };
    const insertAniListFollowingStatuses = async (annictWorkId, anilistToken, card, row) => {
        const armEntries = await fetchArmEntries();
        const mediaId = armEntries.find((x) => x.annict_id === annictWorkId)?.anilist_id;
        if (!mediaId) {
            return;
        }
        card.querySelector('.loading')?.remove();
        const responses = await fetchPaginatedAniListFollowingStatuses(mediaId, anilistToken);
        if ('errors' in responses) {
            const error = responses.errors.map(({ message }) => message).join('\n');
            card.append(`AniList GraphQL API がエラーを返しました。\n${error}`);
            return;
        }
        const statuses = responses.map((r) => parseAniListFollowingStatuses(r)).flat();
        if (statuses.length > 0) {
            renderSectionBodyContent(row, statuses);
        }
    };
    migrate();
    document.addEventListener('turbo:load', () => {
        handle().catch(console.error);
    });

})();
