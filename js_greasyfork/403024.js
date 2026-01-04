// ==UserScript==
// @name         Pixiv - Fast add bookmark
// @namespace    https://www.github.com/soosad
// @version      2.3.0
// @description  Add, edit or remove bookmark (illustration/animation/manga/novel) with one click.
// @author       https://www.github.com/soosad
// @match        *://www.pixiv.net/*
// @run-at       document-end
// @require      https://unpkg.com/react@16/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@16/umd/react-dom.production.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/403024/Pixiv%20-%20Fast%20add%20bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/403024/Pixiv%20-%20Fast%20add%20bookmark.meta.js
// ==/UserScript==

(function main() {
  const isReact = () => typeof globalInitData === 'object';
  const token = () => (isReact() ? globalInitData.token : pixiv.context.token);
  const getUserId = () => (isReact() ? globalInitData.userData.id : pixiv.user.id);
  const rc = React.Component;
  const rce = React.createElement;
  const rdr = ReactDOM.render;
  const rdcp = ReactDOM.createPortal;
  const pfb = {
    pathData: {
      heartPathBorder:
        'M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,'
        + '23.1517313 17.2206059,27.1100183'
        + 'C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,'
        + '23.1517462 4,18.2694529 4,12.5'
        + 'C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366'
        + 'C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z',
      heartPathBackground:
        'M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5'
        + 'C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,'
        + '25.3646328'
        + 'C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,'
        + '21.7268037 26,17.4385986 26,12.5'
        + 'C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,'
        + '11.3317089 Z',
      padlockPathBorder:
        'M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28C32 30.2091 30.2091 '
        + '32 28 32H21'
        + 'C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234C19.2619 '
        + '17.709 21.623 15.5 24.5 15.5'
        + 'C27.377 15.5 29.7381 17.709 29.9796 20.5234Z',
      padlockPathBackground:
        'M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21'
        + 'C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 '
        + '22.567 17.5 24.5 17.5'
        + 'C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 '
        + '26 20.1716 26 21V22H23V21Z',
      dotMenu:
        'M16,18 C14.8954305,18 14,17.1045695 14,16 C14,14.8954305 14.8954305,14 16,'
        + '14 C17.1045695,14 18,14.8954305 18,16 C18,17.1045695 17.1045695,18 16,18 Z M9,'
        + '18 C7.8954305,18 7,17.1045695 7,16 C7,14.8954305 7.8954305,14 9,14 C10.1045695,'
        + '14 11,14.8954305 11,16 C11,17.1045695 10.1045695,18 9,18 Z M23,18 C21.8954305,18 21,'
        + '17.1045695 21,16 C21,14.8954305 21.8954305,14 23,14 C24.1045695,14 25,14.8954305 25,'
        + '16 C25,17.1045695 24.1045695,18 23,18 Z',
    },
    classList: {
      MAIN_ID: 'pfbMain',
      PORTAL_ID: 'pfbPortal',
      BUTTON_HEART: 'pfb_button-heart',
      ANCHOR_HEART: 'pfb_anchor-heart',
      HEART_EMPTY: 'pfb_heart-empty',
      HEART_PUBLIC: 'pfb_heart-public',
      HEART_PRIVATE: 'pfb_heart-private',
      HEART_BORDER: 'pfb_heart-border',
      HEART_BACKGROUND: 'pfb_heart-background',
      PADLOCK_BORDER: 'pfb_padlock-border',
      PADLOCK_BACKGROUND: 'pfb_padlock-background',
      NIGHT_THEME: 'pfb_night-theme',
      MAIN_CONTAINER: 'pfb_container',
      LIGHT_PANEL: 'pfb_light-panel',
      ADVANCED_PANEL: 'pfb_advanced-panel',
      ADD_BUTTON: 'pfb_add-button',
      REMOVE_BUTTON: 'pfb_remove-button',
      MORE_BUTTON: 'pfb_more-button',
      BUTTON_CONTAINER: 'pfb_button-container',
      BOOKMAKRED: 'pfb_bookmarked',
      ACTION_SECTION: 'pfb_action-section',
      COMMENT_SECTION: 'pfb_comment-section',
      TITLE_SECTION: 'pfb_title-section',
      TAGS_SECTION: 'pfb_tags-section',
      WORKS_TAGS: 'pfb_work-tags',
      TITLE_TAG_LIST: 'pfb_title-tag-list',
      TAG: 'pfb_tag',
      TAG_ADDED: 'pfb_tag-added',
      ADVANCED_PANEL_SECTION: 'pfb_section',
      PANEL: 'pfb_panel',
      ADVANCED_PANEL_HEADER: 'pfb_header',
      TITLE: 'pfb_title',
      CLOSE_ADVANCED_PANEL: 'pfb_close-advanced-panel',
      ACTION_BUTTONS: 'pfb_action-btns',
      ACTION_THEME: 'pfb_action-theme',
      NIGHT_THEME_BUTTON: 'pfb_night-theme-btn',
      LIGHT_THEME_BUTTON: 'pfb_light-theme-btn',
      FLOAT_CONTAINER_ID: 'pfb_float-container',
      SVG_BOOKMARKED: 'btBeIl',
      SVG_NONE: 'inFaFn',
      FLOAT_BUTTON_CONTAINER: 'pfb_f-btn-container',
      FLOAT_BUTTON: 'pfb_f-btn',
      FLOAT_BTN_BOOKMARKED: 'pfb_f-bookmarked',
      FLOAT_SVG_HEART: 'pfb_f-svg-heart',
      FLOAT_PATH_BORDER: 'pfb_f-path-heart-border',
      FLOAT_PATH_BACKGROUND: 'pfb_f-path-heart-background',
      FLOAT_PATH_PADLOCK_BORDER: 'pfb_f-path-padlock-border',
      FLOAT_PATH_PADLOCK_BACKGROUND: 'pfb_f-path-padlock-background',
      FLOAT_SVG_LINE: 'pfb_f-svg-line',
    },
    selectorsList: {
      currentWorkHeartSelector: '#root main section section > div:nth-child(3)',
      currentWorkHeartNavSelector: 'article > div > figure + section .jcSCsn + div > div > button',
      currentNovelHeartSelector: 'article section > div:nth-child(3)',
      heartButtonSelector: 'button.bAzGIE',
      heartImgSelector: '._one-click-bookmark',
      placeIllustrationSelector: '#root main section section',
      placeNovelSelector: 'article section',
      portalIllustrationSelector: '#root figure > figcaption ul + div',
      portalNovelSelector: '#root article footer + ul + div',
      numberOfBookmarksSelector: 'dd[title=Bookmarks]',
      pixivWelcomeTitle: 'h2.welcome',
      pixivErrorTitle: 'h2.error-title',
      tagNovel: '.tags > .tag > a.text',
      tagIllust: 'figcaption footer > ul > li a',
      closestDivCont: 'div[width]',
      closestDivContNovel: 'li',
      closestDivContNovelSize: 'section > div > div > div',
      anchorNovel: 'a[href*="/novel/show.php?id="]',
      anchorIllust: 'a[href*="/artworks/"]',
    },
    regexList: {
      novelPath: new RegExp('^\\/novel\\/show\\.php$', 'g'),
      novelPath2: new RegExp('\\/novel\\/show\\.php\\?.*id=\\d+.*'),
      illustPath: new RegExp('\\/artworks\\/\\d+', 'g',),
    },
    urlList: {
      workData(workType, id) {
        return `https://www.pixiv.net/ajax/${workType}/${id}`;
      },
      bookmarkDataUrl(workType, illustId) {
        return `https://www.pixiv.net/ajax/${workType}/${illustId}/bookmarkData`;
      },
      bookmarkTagsUrl(worksType, userId) {
        return `https://www.pixiv.net/ajax/user/${userId}/${worksType}/bookmark/tags`;
      },
      illustBookmarkUrl(illustId) {
        return `https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=${illustId}`;
      },
      novelBookmarkUrl(novelId) {
        return `https://www.pixiv.net/novel/bookmark_add.php?id=${novelId}`;
      },
      novelBookmarkDetailUrl(novelId) {
        return `https://www.pixiv.net/novel/bookmark_detail.php?id=${novelId}`;
      },
    },
    scriptData: {
      cssVersion: '220',
      isUserScript: true,
      pfbnightTitle: 'pfbnight',
    },
    fetchData: {
      urlList: {
        addIllustBookmarkUrl: '/ajax/illusts/bookmarks/add',
        removeIllustBookmarkUrl: '/rpc/index.php',
        removeNovelBookmarkUrl: '/ajax/novels/bookmarks/delete',
        addNovelBookmarkUrl: '/ajax/novels/bookmarks/add',
      },
      args: {
        getArgs: {
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        },
        bookmarkAdd: {
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'X-CSRF-Token': token(),
          },
          method: 'POST',
        },
        bookmarkRemove: {
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'X-CSRF-Token': token(),
          },
          method: 'POST',
        },
      },
      body: {
        illustRemove(bookmarkId) {
          return `mode=delete_illust_bookmark&bookmark_id=${bookmarkId}`;
        },
        novelRemove(bookmarkId) {
          return `del=1&book_id=${bookmarkId}`;
        },
      },
    },
    data: {},
    elementsList: {
      path([d, className]) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add(className);
        path.setAttribute('d', d);
        return path;
      },
      heart(className, d) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '32');
        svg.classList.add(className);
        d.forEach((pathD) => {
          const path = this.path(pathD);
          svg.appendChild(path);
        });
        return svg;
      },
      publicHeart() {
        const { HEART_PUBLIC, HEART_BORDER, HEART_BACKGROUND } = pfb.classList;
        const { heartPathBorder, heartPathBackground } = pfb.pathData;
        const heart = this.heart(HEART_PUBLIC, [
          [heartPathBorder, HEART_BORDER],
          [heartPathBackground, HEART_BACKGROUND],
        ]);
        return heart;
      },
      privateHeart() {
        const {
          HEART_PRIVATE,
          HEART_BORDER,
          HEART_BACKGROUND,
          PADLOCK_BORDER,
          PADLOCK_BACKGROUND,
        } = pfb.classList;
        const {
          heartPathBorder,
          heartPathBackground,
          padlockPathBorder,
          padlockPathBackground,
        } = pfb.pathData;
        const heart = this.heart(HEART_PRIVATE, [
          [heartPathBorder, HEART_BORDER],
          [heartPathBackground, HEART_BACKGROUND],
          [padlockPathBorder, PADLOCK_BORDER],
          [padlockPathBackground, PADLOCK_BACKGROUND],
        ]);
        return heart;
      },
      emptyHeart() {
        const { HEART_EMPTY, HEART_BORDER, HEART_BACKGROUND } = pfb.classList;
        const { heartPathBorder, heartPathBackground } = pfb.pathData;
        const heart = this.heart(HEART_EMPTY, [
          [heartPathBorder, HEART_BORDER],
          [heartPathBackground, HEART_BACKGROUND],
        ]);
        return heart;
      },
      buttonNovel(props) {
        const { bookmarkCount, bookmarkId } = props;
        const { novelBookmarkUrl, novelBookmarkDetailUrl } = pfb.urlList;
        const { illustId } = pfb.data;
        return rce(
          'div',
          null,
          bookmarkId
            ? rce(
              'a',
              {
                href: novelBookmarkDetailUrl(illustId),
                className: 'bookmark-count _ui-tooltip',
                'data-tooltip': `${bookmarkCount} Bookmarks`,
              },
              rce('i', { className: '_icon _bookmark-icon-inline' }),
              bookmarkCount,
            )
            : null,
          rce(
            'a',
            {
              href: novelBookmarkUrl(illustId),
              className: `_bookmark-toggle-button ${
                bookmarkId ? 'bookmarked edit-bookmark' : 'add-bookmark'
              }`,
            },
            !bookmarkId ? rce('span', { className: 'bookmark-icon' }) : null,
            rce(
              'span',
              { className: 'description' },
              bookmarkId ? 'Edit bookmark' : 'Add to bookmarks',
            ),
          ),
        );
      },
      svgHeart(props) {
        const { isPrivateBookmark, bookmarkId } = props;
        const {
          HEART_EMPTY,
          HEART_PRIVATE,
          HEART_PUBLIC,
          HEART_BORDER,
          HEART_BACKGROUND,
          PADLOCK_BORDER,
          PADLOCK_BACKGROUND,
        } = pfb.classList;
        const {
          heartPathBorder,
          heartPathBackground,
          padlockPathBorder,
          padlockPathBackground,
        } = pfb.pathData;

        return rce(
          'svg',
          {
            className: `${HEART_EMPTY} ${
              bookmarkId ? `${isPrivateBookmark ? HEART_PRIVATE : HEART_PUBLIC}` : ''
            }`,
            viewBox: '0 0 32 32',
            width: 32,
            height: 32,
          },
          rce('path', { className: HEART_BORDER, d: heartPathBorder }),
          rce('path', { className: HEART_BACKGROUND, d: heartPathBackground }),
          isPrivateBookmark
            ? rce('path', { className: PADLOCK_BORDER, d: padlockPathBorder })
            : null,
          isPrivateBookmark
            ? rce('path', { className: PADLOCK_BACKGROUND, d: padlockPathBackground })
            : null,
        );
      },
      buttonHeart(props) {
        const {
          bookmarkId, addBookmark, isPrivateBookmark, disabledButtons,
        } = props;
        const { BUTTON_HEART } = pfb.classList;
        const { illustBookmarkUrl } = pfb.urlList;
        return bookmarkId
          ? rce(
            'a',
            { className: BUTTON_HEART, href: illustBookmarkUrl(pfb.data.illustId) },
            rce(pfb.elementsList.svgHeart, { isPrivateBookmark, bookmarkId }),
          )
          : rce(
            'button',
            {
              className: BUTTON_HEART,
              onClick: e => addBookmark(e, 0),
              disabled: disabledButtons,
            },
            rce(pfb.elementsList.svgHeart, { isPrivateBookmark, bookmarkId }),
          );
      },
      svgLine(props) {
        return rce(
          'svg',
          { viewBox: props.viewBox },
          props.lines.map((l, i) => rce('line', {
            key: i, x1: l[0], y1: l[1], x2: l[2], y2: l[3],
          })),
        );
      },
      svgPath(props) {
        return rce('svg', null, props.d.map((d, i) => rce('path', { d, key: i })));
      },
      buttonLight(props) {
        const { BUTTON_CONTAINER } = pfb.classList;
        return rce(
          'div',
          { className: BUTTON_CONTAINER },
          rce('button', { type: 'button', ...props }, props.children),
        );
      },
      themeButton(props) {
        const { onClick, className, title } = props;
        return rce(
          'button',
          { onClick, className, title },
          rce('svg', null, rce('rect', { x: 0, y: 0 })),
        );
      },
      header(props) {
        const {
          BOOKMAKRED,
          ADVANCED_PANEL_HEADER,
          TITLE,
          CLOSE_ADVANCED_PANEL,
          ACTION_BUTTONS,
          ACTION_THEME,
          NIGHT_THEME_BUTTON,
          LIGHT_THEME_BUTTON,
        } = pfb.classList;
        const {
          toggleMoreOptions,
          bookmarkId,
          isPrivateBookmark,
          addBookmark,
          removeBookmark,
          disabledButtons,
        } = props;
        return rce(
          'div',
          { className: ADVANCED_PANEL_HEADER },
          rce(
            'div',
            { className: TITLE },
            rce('h1', null, rce('div', null, rce('span', null, 'Update bookmark'))),
            rce(
              'button',
              { className: CLOSE_ADVANCED_PANEL, onClick: e => toggleMoreOptions(e, false) },
              rce(pfb.elementsList.svgLine, {
                viewBox: '0 0 8 8',
                lines: [['1', '1', '7', '7'], ['7', '1', '1', '7']],
              }),
            ),
          ),
          rce(
            'div',
            { className: ACTION_BUTTONS },
            rce(
              'button',
              {
                className: `${isPrivateBookmark === false ? BOOKMAKRED : ''}`,
                onClick: e => addBookmark(e, '0'),
                disabled: disabledButtons,
              },
              'Public',
            ),
            rce(
              'button',
              {
                className: `${isPrivateBookmark === true ? BOOKMAKRED : ''}`,
                onClick: e => addBookmark(e, '1'),
                disabled: disabledButtons,
              },
              'Private',
            ),
            bookmarkId
              ? rce(
                'button',
                {
                  onClick: e => removeBookmark(e, bookmarkId),
                  disabled: disabledButtons,
                },
                'Remove',
              )
              : null,
          ),
          rce(
            'div',
            { className: ACTION_THEME },
            rce('span', null, 'Theme:'),
            rce(
              'div',
              null,
              rce(pfb.elementsList.themeButton, {
                className: NIGHT_THEME_BUTTON,
                title: 'Night',
                onClick: e => pfb.changeTheme(e, true),
              }),
              rce(pfb.elementsList.themeButton, {
                className: LIGHT_THEME_BUTTON,
                title: 'Light',
                onClick: e => pfb.changeTheme(e, false),
              }),
            ),
          ),
        );
      },
      inputSection(props) {
        const {
          className, count, limit, onChange, value, title, placeholder, maxLength,
        } = props;
        return rce(
          'div',
          null,
          rce(
            'div',
            { className },
            rce('h2', null, title),
            rce('div', null, rce('span', null, count), rce('span', null, limit)),
          ),
          rce('input', {
            type: 'text', placeholder, value, onChange, maxLength,
          }),
        );
      },
      tagList(props) {
        const { TAG_ADDED, TITLE_TAG_LIST, TAG } = pfb.classList;
        const {
          listOfTags, tagsForBookmark, addTagToInput, text,
        } = props;
        return rce(
          'div',
          null,
          rce('span', { className: TITLE_TAG_LIST }, text),
          listOfTags.map((item, id) => rce(
            'span',
            {
              className: `${TAG} ${
                tagsForBookmark.includes(`${item.tag}`.toLowerCase()) ? TAG_ADDED : ''
              }`,
              key: id,
              onClick: e => addTagToInput(e, item.tag),
            },
            `${item.tag} (${item.cnt})`,
          )),
        );
      },
      action(props) {
        const {
          handleChange,
          inputTags,
          inputComment,
          workTags,
          addTagToInput,
          userTags,
          sortUserTags,
          workTagsLowerCase,
          nameSort,
          countSort,
        } = props;
        const { privateTags, publicTags } = userTags;
        const {
          ACTION_SECTION,
          COMMENT_SECTION,
          TITLE_SECTION,
          TAGS_SECTION,
          WORKS_TAGS,
          TITLE_TAG_LIST,
          TAG,
          TAG_ADDED,
        } = pfb.classList;
        const charCount = inputComment.length;
        const tags = inputTags.match(/\S+/g, '') || [];
        const tagsForBookmark = tags.map(item => `${item}`.toLowerCase());
        const tagsCount = tagsForBookmark.length;
        return rce(
          'div',
          { className: ACTION_SECTION },
          rce(
            'div',
            { className: COMMENT_SECTION },
            rce(pfb.elementsList.inputSection, {
              className: TITLE_SECTION,
              count: charCount,
              limit: '/140',
              onChange: e => handleChange(e, true),
              value: inputComment,
              title: 'Bookmark comment',
              placeholder: 'Leave a comment...',
              maxLength: 140,
              isTagsSection: false,
            }),
          ),
          rce(
            'div',
            { className: TAGS_SECTION },
            rce(pfb.elementsList.inputSection, {
              className: TITLE_SECTION,
              count: tagsCount,
              limit: '/10',
              onChange: e => handleChange(e, false),
              value: inputTags,
              title: 'Bookmark tags',
              placeholder: 'Add tags for your favourite bookmark',
              maxLength: 140,
              isTagsSection: true,
            }),
            rce(
              'div',
              { className: WORKS_TAGS },
              rce(
                'div',
                null,
                rce('span', { className: TITLE_TAG_LIST }, 'Tags for this work'),
                rce(
                  'div',
                  null,
                  [['Lower case', true], ['Orignal', false]].map((item, i) => rce(
                    'span',
                    {
                      className: 'pfb_work-tags-options',
                      key: i,
                      onClick: e => workTagsLowerCase(e, item[1]),
                    },
                    item[0],
                  )),
                ),
              ),
              rce(
                'div',
                null,
                workTags.map((item, id) => rce(
                  'span',
                  {
                    className: `${TAG} ${
                      tagsForBookmark.includes(`${item}`.toLowerCase()) ? TAG_ADDED : ''
                    }`,
                    key: id,
                    onClick: e => addTagToInput(e, item),
                  },
                  item,
                )),
              ),
            ),
            rce(
              'div',
              { className: WORKS_TAGS },
              rce(
                'div',
                null,
                rce('span', { className: TITLE_TAG_LIST }, 'Your bookmark tags'),
                rce(
                  'div',
                  null,
                  [
                    ['Sort by name', 0, 'nameSort', nameSort],
                    ['Sort by count', 1, 'countSort', countSort],
                  ].map((item, i) => rce(
                    'span',
                    {
                      className: 'pfb_work-tags-options',
                      key: i,
                      onClick: e => sortUserTags(e, item[1], item[2], item[3]),
                    },
                    item[0],
                  )),
                ),
              ),
              rce(
                'div',
                null,
                publicTags.length
                  ? rce(pfb.elementsList.tagList, {
                    listOfTags: publicTags,
                    addTagToInput,
                    tagsForBookmark,
                    text: 'Public:',
                  })
                  : null,
                privateTags.length
                  ? rce(pfb.elementsList.tagList, {
                    listOfTags: privateTags,
                    addTagToInput,
                    tagsForBookmark,
                    text: 'Private:',
                  })
                  : null,
              ),
            ),
          ),
        );
      },
      advancedPanel(props) {
        const { ADVANCED_PANEL, ADVANCED_PANEL_SECTION, PANEL } = pfb.classList;
        const {
          toggleMoreOptions,
          bookmarkId,
          isPrivateBookmark,
          addBookmark,
          inputComment,
          workTags,
          userTags,
          workTagsLowerCase,
          inputTags,
          detectClickOutsidePanel,
          addTagToInput,
          sortUserTags,
          nameSort,
          countSort,
          handleChange,
          removeBookmark,
          disabledButtons,
        } = props;
        return rce(
          'div',
          { className: ADVANCED_PANEL, onClick: e => detectClickOutsidePanel(e), title: '' },
          rce(
            'div',
            { className: ADVANCED_PANEL_SECTION },
            rce(
              'div',
              { className: PANEL },
              rce(pfb.elementsList.header, {
                toggleMoreOptions,
                bookmarkId,
                isPrivateBookmark,
                addBookmark,
                removeBookmark,
                disabledButtons,
              }),
              rce(pfb.elementsList.action, {
                handleChange,
                userTags,
                workTagsLowerCase,
                sortUserTags,
                workTags,
                nameSort,
                countSort,
                addTagToInput,
                inputComment,
                inputTags,
              }),
            ),
          ),
        );
      },
      lightPanel(props) {
        const {
          LIGHT_PANEL, MORE_BUTTON, ADD_BUTTON, REMOVE_BUTTON, BOOKMAKRED,
        } = pfb.classList;
        const { dotMenu } = pfb.pathData;
        const { buttonLight, svgLine, svgPath } = pfb.elementsList;
        const {
          isPrivateBookmark,
          bookmarkId,
          removeBookmark,
          addBookmark,
          toggleMoreOptions,
          disabledButtons,
        } = props;
        return rce(
          'div',
          { className: LIGHT_PANEL },
          rce(
            buttonLight,
            {
              className: MORE_BUTTON,
              title: 'More options',
              onClick: e => toggleMoreOptions(e, true),
            },
            rce(svgPath, { d: [dotMenu] }),
          ),
          bookmarkId
            ? rce(
              buttonLight,
              {
                className: REMOVE_BUTTON,
                title: 'Remove bookmark',
                onClick: e => removeBookmark(e, bookmarkId),
                disabled: disabledButtons,
              },
              rce(svgLine, {
                viewBox: '0 0 8 8',
                lines: [['1', '1', '7', '7'], ['7', '1', '1', '7']],
              }),
            )
            : null,
          rce(
            buttonLight,
            {
              className: `${ADD_BUTTON} ${isPrivateBookmark === true ? BOOKMAKRED : ''}`,
              onClick: e => addBookmark(e, '1'),
              disabled: disabledButtons,
            },
            'Private',
          ),
          rce(
            buttonLight,
            {
              className: `${ADD_BUTTON} ${isPrivateBookmark === false ? BOOKMAKRED : ''}`,
              onClick: e => addBookmark(e, '0'),
              disabled: disabledButtons,
            },
            'Public',
          ),
        );
      },
      floatContainer() {
        const { FLOAT_CONTAINER_ID } = pfb.classList;
        const div = document.createElement('div');
        div.id = FLOAT_CONTAINER_ID;
        return div;
      },
    },

    miniBookmarkInitialize() {
      const { FLOAT_CONTAINER_ID } = this.classList;
      document.body.appendChild(this.elementsList.floatContainer());
      class Mini extends rc {
        constructor(props) {
          super(props);
          this.state = {
            illustsMini: {},
            novelsMini: {},
            detected: false,
            show: false,
            currentWork: {
              currentId: null,
              isNovel: null,
              position: { top: '0px', left: '0px' },
            },
            btnsDisabled: true,
          };
          this.detectHeart = this.detectHeart.bind(this);
        }

        componentDidMount() {
          document.addEventListener('mouseover', this.detectHeart);
        }

        detectHeart(e) {
          const { target } = e;
          if (target.closest(`#${FLOAT_CONTAINER_ID}`)) return;
          const { heartButtonSelector, heartImgSelector } = pfb.selectorsList;
          const button = target.closest(heartButtonSelector) || target.closest(heartImgSelector);
          if (!button) {
            if (this.state.detected) {
              this.setState({ detected: false, show: false, btnsDisabled: true });
            }
            return;
          }
          if (this.state.detected) return;
          this.setState({ detected: true });
          const ss = (stateM, isNovel, id, isPrivate, bookmarkId, position, show, btnsDisabled) => {
            this.setState(prevState => ({
              [stateM]: {
                ...prevState[stateM],
                [id]: { id, isPrivate, bookmarkId },
              },
              currentWork: { currentId: id, position, isNovel },
              show,
              btnsDisabled,
            }));
          };
          let id;
          let isBookmarked;
          let isNovel;
          if (pfb.data.isReactApp) {
            const { novelPath } = pfb.regexList;
            const {
              closestDivCont,
              closestDivContNovel,
              closestDivContNovelSize,
              anchorNovel,
              anchorIllust,
            } = pfb.selectorsList;
            const { SVG_BOOKMARKED, SVG_NONE } = pfb.classList;
            const elem = button.closest(closestDivCont)
              || button.closest(closestDivContNovel)
              || button.closest(closestDivContNovelSize);
            if (!elem) return;
            const { href } = elem.querySelector(anchorNovel) || elem.querySelector(anchorIllust);
            isNovel = new URL(href).pathname.match(novelPath);
            const illId = href.match(/\/artworks\/\d+/)[0].match(/\d+/)[0];
            id = +illId;
            const svg = button.querySelector('svg');
            isBookmarked = svg.classList.contains(SVG_BOOKMARKED)
              || !svg.classList.contains(SVG_NONE);
          } else {
            const { id: workId, type } = button.dataset;
            isNovel = type === 'novel';
            id = workId;
            isBookmarked = button.classList.contains('on');
          }
          const { top, left } = button.getBoundingClientRect();
          const position = {
            top: `${top + window.pageYOffset}px`,
            left: `${left + window.pageXOffset}px`,
          };
          const stateM = isNovel ? 'novelsMini' : 'illustsMini';
          if (isBookmarked) {
            if (this.state[stateM][id]) {
              this.setState({
                currentWork: { currentId: id, position, isNovel },
                show: true,
                btnsDisabled: false,
              });
              return;
            }
            pfb.loadBookmarkData(isNovel, id).then((response) => {
              const { error, body } = response;
              if (error) return;
              const { private: isPriv = null, id: bookId = null } = body.bookmarkData || {};
              ss(stateM, isNovel, id, isPriv, bookId, position, true, false);
            });
          } else ss(stateM, isNovel, id, null, null, position, true, false);
        }

        addBookmark(e, illustId, isNovel, restrict) {
          this.setState({ btnsDisabled: true });
          const { bookmarkAdd } = pfb.fetchData.args;
          const id = isNovel ? 'novel_id' : 'illust_id';
          const data = {
            [id]: illustId,
            restrict,
            comment: '',
            tags: [],
          };
          const body = JSON.stringify(data);
          const args = { ...bookmarkAdd, body };
          const ss = (stateM, props) => {
            this.setState(prevState => ({
              [stateM]: {
                ...prevState[stateM],
                [illustId]: {
                  ...prevState[stateM][illustId],
                  ...props,
                },
              },
              btnsDisabled: false,
            }));
            pfb.updateHeart(illustId, +restrict, isNovel);
          };
          pfb.saveBookmark(isNovel, args).then((response) => {
            const { body: respBody, error } = response;
            if (error) this.setState({ btnsDisabled: false });
            if (isNovel) {
              pfb.loadBookmarkData(isNovel, illustId).then((resp) => {
                const { error: err, body: bd } = resp;
                if (err) return;
                const { private: isPrivate = null, id: bookmarkId = null } = bd.bookmarkData || {};
                ss('novelsMini', { isPrivate, bookmarkId });
              });
            } else {
              const { last_bookmark_id: bookmarkId } = respBody;
              const isPrivateBookmark = !!+restrict;
              if (bookmarkId) ss('illustsMini', { isPrivate: isPrivateBookmark, bookmarkId });
              else ss('illustsMini', { isPrivate: isPrivateBookmark });
            }
          });
        }

        removeBookmark(e, id, bookmarkId, isNovel) {
          this.setState({ btnsDisabled: true });
          const { bookmarkRemove } = pfb.fetchData.args;
          const { illustRemove, novelRemove } = pfb.fetchData.body;
          if (!bookmarkId) return;
          const body = isNovel ? novelRemove(bookmarkId) : illustRemove(bookmarkId);
          const args = { ...bookmarkRemove, body };
          const stateM = isNovel ? 'novelsMini' : 'illustsMini';
          pfb.removeBookmark(isNovel, args).then((response) => {
            if (!response.error) {
              this.setState(prevState => ({
                [stateM]: {
                  ...prevState[stateM],
                  [id]: {
                    ...prevState[stateM][id],
                    isPrivate: null,
                    bookmarkId: null,
                  },
                },
                btnsDisabled: false,
              }));
              pfb.updateHeart(id, 2, isNovel);
            } else this.setState({ btnsDisabled: false });
          });
        }

        render() {
          const {
            currentWork: {
              currentId,
              isNovel,
              position: { top, left },
            },
            btnsDisabled: disabled,
            detected,
            show,
          } = this.state;
          const workType = isNovel ? 'novelsMini' : 'illustsMini';
          const { id, bookmarkId, isPrivate } = this.state[workType][currentId] || {};
          const {
            heartPathBorder,
            heartPathBackground,
            padlockPathBorder,
            padlockPathBackground,
          } = pfb.pathData;
          const {
            FLOAT_BUTTON_CONTAINER,
            FLOAT_BUTTON,
            FLOAT_BTN_BOOKMARKED,
            FLOAT_SVG_HEART,
            FLOAT_PATH_BORDER,
            FLOAT_PATH_BACKGROUND,
            FLOAT_PATH_PADLOCK_BORDER,
            FLOAT_PATH_PADLOCK_BACKGROUND,
            FLOAT_SVG_LINE,
          } = pfb.classList;
          const style = { top, left };
          return show && detected
            ? rce(
              'div',
              { style },
              rce(
                'div',
                { className: FLOAT_BUTTON_CONTAINER },
                rce(
                  'button',
                  {
                    onClick: e => this.addBookmark(e, id, isNovel, 0),
                    disabled,
                    className: `${FLOAT_BUTTON} ${
                      bookmarkId && !isPrivate ? FLOAT_BTN_BOOKMARKED : ''
                    }`,
                    title: 'Public bookmark',
                  },
                  rce(
                    'svg',
                    { className: FLOAT_SVG_HEART, viewBox: '0 0 34 34' },
                    rce('path', { className: FLOAT_PATH_BORDER, d: heartPathBorder }),
                    rce('path', {
                      className: FLOAT_PATH_BACKGROUND,
                      d: heartPathBackground,
                    }),
                  ),
                ),
              ),
              rce(
                'div',
                { className: FLOAT_BUTTON_CONTAINER },
                rce(
                  'button',
                  {
                    onClick: e => this.addBookmark(e, id, isNovel, 1),
                    disabled,
                    className: `${FLOAT_BUTTON} ${
                      bookmarkId && isPrivate ? FLOAT_BTN_BOOKMARKED : ''
                    }`,
                    title: 'Private bookmark',
                  },
                  rce(
                    'svg',
                    { className: FLOAT_SVG_HEART, viewBox: '0 0 34 34' },
                    rce('path', { className: FLOAT_PATH_BORDER, d: heartPathBorder }),
                    rce('path', {
                      className: FLOAT_PATH_BACKGROUND,
                      d: heartPathBackground,
                    }),
                    rce('path', {
                      className: FLOAT_PATH_PADLOCK_BORDER,
                      d: padlockPathBorder,
                    }),
                    rce('path', {
                      className: FLOAT_PATH_PADLOCK_BACKGROUND,
                      d: padlockPathBackground,
                    }),
                  ),
                ),
              ),
              bookmarkId
                ? rce(
                  'div',
                  { className: FLOAT_BUTTON_CONTAINER },
                  rce(
                    'button',
                    {
                      onClick: e => this.removeBookmark(e, currentId, bookmarkId, isNovel),
                      className: FLOAT_BUTTON,
                      title: 'Remove bookmark',
                      disabled,
                    },
                    rce(
                      'svg',
                      { className: FLOAT_SVG_LINE, viewBox: '0 0 8 8' },
                      rce('line', {
                        x1: '1', y1: '1', x2: '7', y2: '7',
                      }),
                      rce('line', {
                        x1: '7', y1: '1', x2: '1', y2: '7',
                      }),
                    ),
                  ),
                )
                : null,
            )
            : null;
        }
      }
      rdr(rce(Mini, null), document.getElementById(FLOAT_CONTAINER_ID));
    },
    pfbElementsInitialize() {
      const { isNovel } = this.data;
      const { MAIN_ID, PORTAL_ID } = this.classList;
      const {
        placeIllustrationSelector,
        placeNovelSelector,
        portalIllustrationSelector,
        portalNovelSelector,
        currentNovelHeartSelector,
        currentWorkHeartSelector,
      } = this.selectorsList;
      const placeSelector = isNovel ? placeNovelSelector : placeIllustrationSelector;
      // const portalSelector = isNovel ? portalNovelSelector : placeIllustrationSelector;
      const mainParent = document.querySelector(placeSelector);
      const portalParent = isNovel
        ? document.querySelector(portalNovelSelector)
        : document.querySelector(placeIllustrationSelector).parentElement.parentElement;
      const position = 'beforeend';
      if (isNovel && portalParent) {
        portalParent.insertAdjacentHTML('beforeend', '<span id="pfb-nv"></span>');
      }
      mainParent.insertAdjacentHTML(position, `<div id="${MAIN_ID}"></div>`);
      if (portalParent && !document.getElementById('pfbPortal')) {
        portalParent.insertAdjacentHTML('afterend', `<div id="${PORTAL_ID}"></div>`);
      }
      const modalRoot = document.getElementById(`${PORTAL_ID}`);
      const mainBookBtn = isNovel ? currentNovelHeartSelector : currentWorkHeartSelector;
      const buttonRoot = document.querySelector(mainBookBtn);
      class Modal extends rc {
        constructor(props) {
          super(props);
          this.container = document.createElement('div');
        }

        componentDidMount() {
          if (this.props.btn) {
            const childs = [...this.props.place.querySelectorAll('*')];
            childs.forEach(n => n.remove());
          }
          this.props.place.appendChild(this.container);
        }

        componentWillUnmount() {
          this.props.place.removeChild(this.container);
        }

        render() {
          return rdcp(this.props.children, this.container);
        }
      }
      class Container extends rc {
        constructor(props) {
          super(props);
          this.state = {
            bookmarkId: null,
            isPrivateBookmark: null,
            showAdvancedPanel: false,
            disabledButtons: true,
            nameSort: true,
            countSort: true,
            bookmarkCount: 1,
            inputTags: '',
            inputComment: '',
            workTags: [],
            originalWorkTags: [],
            allTags: [],
            userTags: { publicTags: [], privateTags: [] },
            userTagsOriginal: { publicTags: [], privateTags: [] },
          };
          this.toggleMoreOptions = this.toggleMoreOptions.bind(this);
          this.addBookmark = this.addBookmark.bind(this);
          this.removeBookmark = this.removeBookmark.bind(this);
          this.handleChange = this.handleChange.bind(this);
          this.addTagToInput = this.addTagToInput.bind(this);
          this.detectClickOutsidePanel = this.detectClickOutsidePanel.bind(this);
          this.workTagsLowerCase = this.workTagsLowerCase.bind(this);
          this.sortUserTags = this.sortUserTags.bind(this);
        }

        componentDidMount() {
          this.fetchUserTags();
          this.fetchWorkData();
        }

        fetchWorkData() {
          const { isNovel, illustId } = pfb.data;
          pfb.loadWorkData(isNovel, illustId).then((response) => {
            if (response.error) {
              this.getWorkTags();
              this.fetchBookmarkData();
            } else {
              const {
                bookmarkData,
                tags: { tags },
                isOriginal,
                userName,
                bookmarkCount,
              } = response.body;
              const {
                private: isPrivateBookmark = null, id: bookmarkId = null,
              } = bookmarkData || {};
              let workTags = [];
              if (userName) workTags.push(userName);
              if (isOriginal) workTags.push('Original');
              if (tags) {
                tags.forEach((i) => {
                  if (!i) return;
                  workTags.push(i.tag);
                  if (i.romaji) workTags.push(i.romaji);
                  if (i.translation) {
                    const transTags = Object.values(i.translation);
                    workTags = [...workTags, ...transTags];
                  }
                });
              }
              const mappedWT = workTags.map(tag => tag.replace(/\s+/g, ''));
              this.setState({
                isPrivateBookmark,
                bookmarkId,
                workTags: mappedWT,
                originalWorkTags: mappedWT,
                bookmarkCount,
                disabledButtons: false,
              });
            }
          });
        }

        addTagToInput(e, tag) {
          this.setState(prevState => ({ inputTags: `${prevState.inputTags} ${tag}` }));
        }

        handleChange(e, isCommentInput) {
          const { target } = e;
          const propState = isCommentInput ? 'inputComment' : 'inputTags';
          this.setState({ [propState]: target.value });
        }

        fetchUserTags() {
          const { userId, isNovel } = pfb.data;
          pfb.loadUserTags(userId, isNovel).then((response) => {
            const { error, body } = response;
            if (error) return;
            const { private: privateTags, public: publicTags } = body;
            privateTags.shift();
            publicTags.shift();
            const pub = publicTags.map(i => i.tag);
            const priv = privateTags.map(i => i.tag);
            const allTags = [...pub, ...priv, ...this.state.workTags];
            this.setState({
              userTags: { publicTags, privateTags },
              userTagsOriginal: { publicTags, privateTags },
              allTags,
            });
          });
        }

        getWorkTags() {
          const { isNovel } = pfb.data;
          const { tagNovel, tagIllust } = pfb.selectorsList;
          const tagSelector = isNovel ? tagNovel : tagIllust;
          const tagsEl = document.querySelectorAll(tagSelector);
          const tags = [...tagsEl].map(item => item.innerText.replace(/\s+/g, ''));
          this.setState({ workTags: tags, originalWorkTags: tags });
        }

        sortUserTags(e, type, property, rev) {
          let publicTags;
          let privateTags;
          const {
            publicTags: oldPublicTags,
            privateTags: oldPrivateTags,
          } = this.state.userTagsOriginal;
          const sortTagsByCount = (arr, isDesc) => arr.sort((vote1, vote2) => {
            if (+vote1.cnt > +vote2.cnt) return isDesc ? -1 : 1;
            if (+vote1.cnt < +vote2.cnt) return isDesc ? 1 : -1;
            if (`${vote1.tag}` > `${vote2.tag}`) return 1;
            if (`${vote1.tag}` < `${vote2.tag}`) return -1;
            return 0;
          });
          const sortTagsByName = (arr, isDesc) => arr.sort((vote1, vote2) => {
            if (`${vote1.tag}` > `${vote2.tag}`) return isDesc ? -1 : 1;
            if (`${vote1.tag}` < `${vote2.tag}`) return isDesc ? 1 : -1;
            if (+vote1.cnt > +vote2.cnt) return 1;
            if (+vote1.cnt < +vote2.cnt) return -1;
            return 0;
          });
          switch (type) {
            case 1:
              publicTags = sortTagsByCount(oldPublicTags, rev);
              privateTags = sortTagsByCount(oldPrivateTags, rev);
              break;
            case 0:
            default:
              publicTags = sortTagsByName(oldPublicTags, rev);
              privateTags = sortTagsByName(oldPrivateTags, rev);
              break;
          }
          this.setState({ userTags: { publicTags, privateTags }, [property]: !rev });
        }

        workTagsLowerCase(e, bool) {
          this.setState(prevState => ({
            workTags: bool
              ? prevState.originalWorkTags.map(i => `${i}`.toLowerCase())
              : prevState.originalWorkTags,
          }));
        }

        fetchBookmarkData() {
          const { isNovel, illustId } = pfb.data;
          pfb.loadBookmarkData(isNovel, illustId).then((data) => {
            const { error, body } = data;
            if (error) return;
            const {
              private: isPrivateBookmark = null, id: bookmarkId = null,
            } = body.bookmarkData || {};
            this.setState({ isPrivateBookmark, bookmarkId, disabledButtons: false });
          });
        }

        toggleMoreOptions(e, show) {
          this.setState({ showAdvancedPanel: show });
          if (show) document.body.classList.add('pfb_overflow');
          else document.body.classList.remove('pfb_overflow');
        }

        detectClickOutsidePanel(e) {
          const {
            target: { classList },
          } = e;
          if (classList.contains('pfb_section') || classList.contains('pfb_advanced-panel')) {
            this.toggleMoreOptions(null, false);
          }
        }

        addBookmark(e, restrict) {
          this.setState({ disabledButtons: true });
          const { inputComment, inputTags } = this.state;
          const { illustId, isNovel } = pfb.data;
          const { bookmarkAdd } = pfb.fetchData.args;
          const id = isNovel ? 'novel_id' : 'illust_id';
          const data = {
            [id]: illustId,
            restrict,
            comment: inputComment,
            tags: inputTags.match(/\S+/g, '') || [],
          };
          const body = JSON.stringify(data);
          const args = { ...bookmarkAdd, body };
          pfb.saveBookmark(isNovel, args).then((response) => {
            const { body: respBody, error } = response;
            if (error) this.setState({ disabledButtons: false });
            if (isNovel) this.fetchBookmarkData();
            else {
              const { last_bookmark_id: bookmarkId } = respBody;
              const isPrivateBookmark = !!+restrict;
              if (bookmarkId) {
                this.setState({ bookmarkId, isPrivateBookmark, disabledButtons: false });
              } else this.setState({ isPrivateBookmark, disabledButtons: false });
              if (!isNovel) {
                const { currentWorkHeartNavSelector } = pfb.selectorsList;
                const parent = document.querySelector(currentWorkHeartNavSelector);
                if (parent) pfb.replaceHeartSVG(parent, +restrict);
              }
            }
          });
        }

        removeBookmark(e, id) {
          this.setState({ disabledButtons: true });
          const { isNovel } = pfb.data;
          const { bookmarkId } = this.state;
          const { bookmarkRemove } = pfb.fetchData.args;
          const { illustRemove, novelRemove } = pfb.fetchData.body;
          if (!bookmarkId) return;
          const body = isNovel ? novelRemove(id) : illustRemove(id);
          const args = { ...bookmarkRemove, body };
          pfb.removeBookmark(isNovel, args).then((response) => {
            if (!response.error) {
              this.setState({ bookmarkId: null, isPrivateBookmark: null, disabledButtons: false });
              if (!isNovel) {
                const { currentWorkHeartNavSelector } = pfb.selectorsList;
                const parent = document.querySelector(currentWorkHeartNavSelector);
                if (parent) pfb.replaceHeartSVG(parent, 2);
              }
            } else this.setState({ disabledButtons: false });
          });
        }

        render() {
          const {
            bookmarkId,
            isPrivateBookmark,
            showAdvancedPanel,
            disabledButtons,
            inputComment,
            workTags,
            userTags,
            bookmarkCount,
            nameSort,
            countSort,
            inputTags,
          } = this.state;
          const {
            addBookmark,
            removeBookmark,
            toggleMoreOptions,
            handleChange,
            sortUserTags,
            addTagToInput,
            detectClickOutsidePanel,
            workTagsLowerCase,
          } = this;
          const { MAIN_CONTAINER } = pfb.classList;
          return rce(
            'div',
            { className: MAIN_CONTAINER },
            rce(pfb.elementsList.lightPanel, {
              bookmarkId,
              isPrivateBookmark,
              addBookmark,
              removeBookmark,
              toggleMoreOptions,
              disabledButtons,
            }),
            showAdvancedPanel
              ? rce(
                Modal,
                { place: modalRoot, btn: false },
                rce(pfb.elementsList.advancedPanel, {
                  bookmarkId,
                  detectClickOutsidePanel,
                  isPrivateBookmark,
                  addBookmark,
                  removeBookmark,
                  addTagToInput,
                  nameSort,
                  countSort,
                  userTags,
                  sortUserTags,
                  workTagsLowerCase,
                  workTags,
                  handleChange,
                  toggleMoreOptions,
                  disabledButtons,
                  inputComment,
                  inputTags,
                }),
              )
              : null,
            !pfb.data.isNovel && buttonRoot
              ? rce(
                Modal,
                { place: buttonRoot, btn: true },
                rce(pfb.elementsList.buttonHeart, {
                  bookmarkId,
                  isPrivateBookmark,
                  addBookmark,
                  disabledButtons,
                }),
              )
              : null,
          );
        }
      }
      rdr(rce(Container, null), document.getElementById(`${MAIN_ID}`));
    },
    css() {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerText = '#root .pfb_container{margin-right:20px}#root .pfb_light-panel{width:auto}.pfb_li'
        + 'ght-panel{width:400px;display:flex;flex-direction:row-reverse}.pfb_light-panel>d'
        + 'iv:first-child{border-radius:0px 8px 8px 0px}.pfb_light-panel>div:last-child{bor'
        + 'der-radius:8px 0px 0px 8px}.pfb_button-container{height:32px;transition:backgrou'
        + 'nd-color 0.2s}.pfb_button-container>button{border:none;background:none;margin:0;'
        + 'padding:0;height:32px;cursor:pointer;font-weight:700;line-height:1;font-size:14p'
        + 'x}.pfb_container button:focus,.pfb_advanced-panel button:focus,#pfb_float-contai'
        + 'ner button:focus{outline:0}.pfb_button-container>button>svg{width:32px;height:32'
        + 'px}.pfb_add-button{padding:9px 14px !important}.pfb_remove-button{padding:8px 11'
        + 'px !important;width:38px}.pfb_remove-button>svg{stroke-linecap:round;stroke-widt'
        + 'h:2;width:16px !important;height:16px !important}.pfb_more-button{padding:0px 3p'
        + 'x !important}.pfb_overflow{overflow:hidden}.pfb_advanced-panel{display:flex;widt'
        + 'h:100%;height:100%;z-index:9999;position:fixed;font-size:20px;line-height:24px;f'
        + 'ont-weight:bold;top:0;left:0;overflow:auto}.pfb_section{width:800px;display:flex'
        + ';margin:auto;padding:40px;flex:none}.pfb_panel{width:100%;border-radius:8px}.pfb'
        + '_header{border-radius:8px 8px 0 0}.pfb_title{align-items:center;flex:none;displa'
        + 'y:flex;padding:16px;line-height:1;text-align:center;font-size:16px;font-weight:7'
        + '00}.pfb_title>h1{flex:auto;padding:0 24px;font-size:18px;margin:0}.pfb_title>h1>'
        + 'div{justify-content:center;display:flex;align-items:center}.pfb_close-advanced-p'
        + 'anel{align-self:flex-start;box-sizing:content-box;padding:4px;width:16px;margin-'
        + 'left:-24px;border:none;flex:none;outline:none;background:transparent;line-height'
        + ':0;font-size:0;cursor:pointer}.pfb_close-advanced-panel>svg{stroke-linecap:round'
        + ';stroke-width:2px;width:16px;height:16px}.pfb_action-btns{display:flex;margin:16'
        + 'px 16px 26px 16px;justify-content:center}.pfb_action-btns>button:first-child{bor'
        + 'der-radius:50px 0 0 50px}.pfb_action-btns>button:last-child{border-radius:0 50px'
        + ' 50px 0}.pfb_action-btns>button{background:none;padding:12px 0 !important;width:'
        + '200px;line-height:1;border:none;font-size:14px;font-weight:700;cursor:pointer;ma'
        + 'rgin:0;transition:background-color 0.4s}.pfb_action-theme{display:flex;justify-c'
        + 'ontent:flex-end;margin:0 24px}.pfb_action-theme>span{margin-right:10px;font-size'
        + ':14px;margin-top:2px}.pfb_action-theme>div{padding:5px 8px 0 8px}.pfb_action-the'
        + 'me>div>button{border:none;background:none;line-height:1;padding:0;cursor:pointer'
        + ';margin:0}.pfb_action-theme>div>button>svg{width:20px;height:20px}.pfb_action-th'
        + 'eme>div>button>svg>rect{width:100%;height:100%}.pfb_night-theme-btn{margin-right'
        + ':5px !important}.pfb_action-section{width:100%;border-radius:0 0 8px 8px}.pfb_co'
        + 'mment-section{padding:25px 35px 35px;border-bottom:1px solid}.pfb_tags-section>d'
        + 'iv,.pfb_comment-section>div{text-align:center}.pfb_tags-section>div>input,.pfb_c'
        + 'omment-section>div>input{overflow:hidden;resize:none;font-size:14px;height:25px;'
        + 'padding:6px 10px;border:none;border-radius:4px;width:643px;border:1px solid}.pfb'
        + '_title-section{display:flex;padding:0px 35px;justify-content:space-between}.pfb_'
        + 'title-section>h2{margin:5px 0 10px 0;font-size:16px}.pfb_title-section>div{font-'
        + 'size:12px;padding-top:6px;margin-right:5px}.pfb_work-tags-options{margin-right:5'
        + 'px;font-size:12px;cursor:pointer}.pfb_tags-section{padding:20px 35px}.pfb_tags-s'
        + 'ection>.pfb_title-section{padding-bottom:25px}.pfb_tags-section>div:nth-child(1)'
        + '{padding-bottom:30px;position:relative}.pfb_work-tags{font-size:14px;padding:0 3'
        + '2px;margin-bottom:16px}.pfb_work-tags>div{display:flex;flex-wrap:wrap}.pfb_work-'
        + 'tags>div:nth-child(1){margin:0 2px;justify-content:space-between}.pfb_work-tags>'
        + 'div:nth-child(2){border:1px solid;border-radius:5px;padding:5px 4px 3px}.pfb_wor'
        + 'k-tags>div:nth-child(2)>div{display:flex;flex-wrap:wrap}.pfb_work-tags>div:nth-c'
        + 'hild(2)>div:first-child{border-bottom:1px solid;margin-bottom:3px;padding-bottom'
        + ':2px}.pfb_work-tags>div:nth-child(2)>div:last-child{border-bottom:none;margin-bo'
        + 'ttom:0;padding-bottom:0}.pfb_title-tag-list{margin:0 3px}.pfb_tag{padding:0px 5p'
        + 'x;font-size:12px;margin:0px 1px 2px;cursor:pointer;font-size:12px;border-radius:'
        + '3px;transition:background-color 0.4s ease 0s}.pfb_tag-added{background:none}.pfb'
        + '_tag-added:hover{background:none}.pfb_button-heart{display:inline-block;box-sizi'
        + 'ng:content-box;padding:0;color:inherit;background:none;border:none;line-height:1'
        + ';height:32px;cursor:pointer}.pfb_heart-empty,.pfb_heart-public,.pfb-heart-privat'
        + 'e{box-sizing:border-box;line-height:0;font-size:0px;vertical-align:top;transitio'
        + 'n:color 0.2s ease 0s, fill 0.2s ease 0s}.pfb_heart-background{transition:fill 0.'
        + '2s ease 0s}.pfb_padlock-border,.pfb_padlock-background{fill-rule:evenodd;clip-ru'
        + 'le:evenodd}.pfb_action-btns>button:disabled,button.pfb_add-button:disabled{opaci'
        + 'ty:0.4}#pfb_float-container>div{z-index:9999;position:absolute;display:flex;heig'
        + 'ht:36px}#pfb_float-container>div>div:first-child>button{border-radius:5px 0 0 5p'
        + 'x}#pfb_float-container>div>div:last-child>button{border-radius:0 5px 5px 0}#pfb_'
        + 'float-container>div>.pfb_f-btn-container:nth-child(3)>button{padding-top:3px}#pf'
        + 'b_float-container button:disabled{opacity:0.9}#pfb_float-container .pfb_f-btn-co'
        + 'ntainer{background:none !important}.pfb_f-btn{padding:0 2px;border:none;width:40'
        + 'px;height:36px;cursor:pointer}.pfb_f-svg-heart{padding:3px 0 0 3px;height:33px}.'
        + 'pfb_f-svg-heart>path{fill-rule:evenodd}.pfb_f-svg-line{stroke-linecap:round;stro'
        + 'ke-width:2;width:18px !important;height:18px !important}.pfb_bookmarked{color:#0'
        + '086e0 !important}.pfb_light-panel .pfb_button-container{background-color:#ebebeb'
        + '}.pfb_light-panel .pfb_button-container>button{color:#666}.pfb_light-panel .pfb_'
        + 'button-container:hover{background-color:#dcdcdc}.pfb_light-panel .pfb_more-butto'
        + 'n>svg{fill:#666}.pfb_light-panel .pfb_remove-button>svg{stroke:#666}.pfb_advance'
        + 'd-panel{color:#333333;background-color:#00000066}.pfb_panel{background:#eee}.pfb'
        + '_header{background:#fff}.pfb_title{color:#333}.pfb_close-advanced-panel>svg{stro'
        + 'ke:#ccc}.pfb_action-btns>button{color:#666;background-color:#ededed}.pfb_action-'
        + 'btns>button:hover{background-color:#e2e2e2 !important}.pfb_action-theme>span{col'
        + 'or:#333}.pfb_action-theme>div{background:#eee}.pfb_night-theme-btn rect{fill:#22'
        + '2}.pfb_light-theme-btn rect{fill:#fff}.pfb_comment-section{border-color:#fff}.pf'
        + 'b_tags-section>div>input,.pfb_comment-section>div>input{background-color:#fff;bo'
        + 'rder-color:#222}.pfb_work-tags>div:nth-child(2){border-color:#666;background-col'
        + 'or:#ccc}.pfb_work-tags>div:nth-child(2)>div:first-child{border-color:#222}.pfb_t'
        + 'ag{color:#fff;background-color:#3e5b71}.pfb_tag:hover{background-color:#3f7186}.'
        + 'pfb_tag-added{color:#3e5b71;background:none}'
        + '.pfb_tags-section input[type="text"],.pfb_comment-se'
        + 'ction input[type="text"]{color:#333;background-color:#fff}.pfb_tags-section inpu'
        + 't[type="text"]:focus,.pfb_comment-section input[type="text"]:focus{color:#333;ba'
        + 'ckground-color:#fff}.pfb_heart-empty{color:#1f1f1f;fill:#222}.pfb_padlock-border'
        + ',.pfb_heart-background{fill:#fff}.pfb_heart-public,.pfb_heart-private{color:#ff4'
        + '060;fill:#ff4060}.pfb_heart-public .pfb_heart-background,.pfb_heart-private .pfb'
        + '_heart-background{fill:#ff4060}.pfb_padlock-background{fill:#1f1f1f}.pfb_f-btn{b'
        + 'ackground-color:#222}.pfb_f-btn:hover{background-color:#333}#pfb_float-container'
        + ' button:disabled{background-color:#777}.pfb_f-path-heart-border,.pfb_f-path-padl'
        + 'ock-background{fill:#111}.pfb_f-path-heart-background,.pfb_f-path-padlock-border'
        + '{fill:#fff}.pfb_f-bookmarked .pfb_f-path-heart-background{fill:#ff4060}.pfb_f-sv'
        + 'g-line{stroke:#fff}.pfb_night-theme .pfb_light-panel .pfb_button-container{backg'
        + 'round-color:#333}.pfb_night-theme .pfb_light-panel .pfb_button-container>button{'
        + 'color:#fff}.pfb_night-theme .pfb_light-panel .pfb_button-container:hover{backgro'
        + 'und-color:#555}.pfb_night-theme .pfb_light-panel .pfb_more-button>svg{fill:#fff}'
        + '.pfb_night-theme .pfb_light-panel .pfb_remove-button>svg{stroke:#fff}.pfb_night-'
        + 'theme .pfb_work-tags>div:nth-child(2){border-color:#222;background-color:#555}.p'
        + 'fb_night-theme .pfb_tag-added{background:none;color:#fff}.pfb_night-theme .pfb_p'
        + 'anel{color:#fff;background-color:#333}.pfb_night-theme .pfb_header{background-co'
        + 'lor:#444}.pfb_night-theme .pfb_title{color:#fff}.pfb_night-theme .pfb_action-the'
        + 'me>span{color:#fff}.pfb_night-theme .pfb_action-theme>div{background-color:#333}'
        + '.pfb_night-theme .pfb_comment-section{border-color:#222}.pfb_night-theme .pfb_ac'
        + 'tion-section input{background-color:#444;color:#fff}.pfb_night-theme .pfb_action'
        + '-section input[type="text"]:focus{background-color:#444;color:#fff}.pfb_night-th'
        + 'eme .pfb_action-btns>button{color:#fff;background-color:#333}.pfb_night-theme .p'
        + 'fb_action-btns>button:hover{background-color:#555 !important}';
      document.head.appendChild(style);
    },
    updateHeart(id, type, isNovel) {
      if (pfb.data.isReactApp) {
        const { heartButtonSelector, closestDivContNovelSize } = pfb.selectorsList;
        const a = isNovel ? `a[href*="/novel/show.php?id=${id}"]` : `a[href*="/artworks/${id}"]`;
        const elems = [...document.querySelectorAll(`div[width] ${a}`)];
        elems.forEach((elem) => {
          const div = isNovel
            ? elem.closest('li') || elem.closest(closestDivContNovelSize)
            : elem.closest('div[width]');
          const button = div.querySelector(heartButtonSelector);
          pfb.replaceHeartSVG(button, type);
        });
      } else {
        const dataType = isNovel ? 'novel' : 'illust';
        const elems = [
          ...document.querySelectorAll(
            `div._one-click-bookmark[data-type="${dataType}"][data-id="${id}"]`,
          ),
        ];
        elems.forEach(elem => pfb.replaceHeartImg(elem, type));
      }
    },
    replaceHeartImg(button, type) {
      if (!button) return;
      switch (type) {
        case 0:
          button.classList.remove('private');
          button.classList.add('on');
          break;
        case 1:
          button.classList.add('on', 'private');
          break;
        case 2:
        default:
          button.classList.remove('on', 'private');
          break;
      }
    },
    replaceHeartSVG(parent, heartType) {
      if (!parent) return;
      const child = parent.querySelector('*');
      let heart;
      switch (heartType) {
        case 0:
          heart = this.elementsList.publicHeart();
          break;
        case 1:
          heart = this.elementsList.privateHeart();
          break;
        case 2:
          heart = this.elementsList.emptyHeart();
          break;
        default:
          break;
      }
      if (parent) parent.replaceChild(heart, child);
    },
    changeTheme(e, isNight) {
      const { pfbnightTitle } = pfb.scriptData;
      const { NIGHT_THEME } = this.classList;
      const data = JSON.stringify({ night: isNight });
      localStorage.setItem(pfbnightTitle, data);
      const method = isNight ? 'add' : 'remove';
      document.body.classList[method](NIGHT_THEME);
    },
    async loadLocalStorage(title) {
      const data = await localStorage.getItem(title);
      return data ? JSON.parse(data) : {};
    },
    async loadWorkData(isNovel, illustId) {
      const workType = isNovel ? 'novel' : 'illust';
      const { workData } = this.urlList;
      const url = workData(workType, illustId);
      const { getArgs } = this.fetchData.args;
      const response = await fetch(url, getArgs);
      return response.json();
    },
    async loadBookmarkData(isNovel, illustId) {
      const workType = isNovel ? 'novel' : 'illust';
      const { bookmarkDataUrl } = this.urlList;
      const { getArgs } = this.fetchData.args;
      const url = bookmarkDataUrl(workType, illustId);
      const response = await fetch(url, getArgs);
      return response.json();
    },
    async loadUserTags(userId, isNovel) {
      const { bookmarkTagsUrl } = this.urlList;
      const { getArgs } = this.fetchData.args;
      const worksType = isNovel ? 'novels' : 'illusts';
      const url = bookmarkTagsUrl(worksType, userId);
      const response = await fetch(url, getArgs);
      return response.json();
    },
    async saveBookmark(isNovel, args) {
      const { addIllustBookmarkUrl, addNovelBookmarkUrl } = this.fetchData.urlList;
      const url = isNovel ? addNovelBookmarkUrl : addIllustBookmarkUrl;
      const response = await fetch(url, args);
      return response.json();
    },
    async removeBookmark(isNovel, args) {
      const { removeIllustBookmarkUrl, removeNovelBookmarkUrl } = this.fetchData.urlList;
      const url = isNovel ? removeNovelBookmarkUrl : removeIllustBookmarkUrl;
      const response = await fetch(url, args);
      return response.json();
    },
    runObserver() {
      const { placeIllustrationSelector, placeNovelSelector } = this.selectorsList;
      const { MAIN_ID } = this.classList;
      const { illustPath, novelPath2 } = this.regexList;
      const observer = new MutationObserver(() => {
        const elementIllust = document.querySelector(placeIllustrationSelector);
        const elementNovel = document.querySelector(placeNovelSelector);
        const isIllust = window.location.href.match(illustPath);
        const isNovel = window.location.href.match(novelPath2);
        if (elementIllust && isIllust) {
          const mc = isIllust ? MAIN_ID : 'pfb-nv';
          if (!document.getElementById(mc)) {
            const m1 = window.location.pathname.match(/\/artworks\/\d+/);
            if (m1) {
              const m2 = m1[0].match(/\d+/);
              if (m2) {
                const illustId = +m2[0];
                this.data.illustId = illustId;
                this.pfbElementsInitialize();
              }
            }
          }
        }
      });
      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    },
    initialize() {
      const { pixivWelcomeTitle, pixivErrorTitle } = this.selectorsList;
      const { novelPath } = this.regexList;
      const { pfbnightTitle } = pfb.scriptData;
      const welcomeTitle = document.querySelector(pixivWelcomeTitle);
      const errorTitle = document.querySelector(pixivErrorTitle);
      const isNovel = window.location.pathname.match(novelPath);
      if (welcomeTitle || errorTitle) return;
      this.data.token = token();
      this.data.isReactApp = isReact();
      this.data.userId = getUserId();
      this.data.isNovel = isNovel;
      this.css();
      this.loadLocalStorage(pfbnightTitle).then((localData) => {
        if (localData.night) {
          const { NIGHT_THEME } = this.classList;
          document.body.classList.add(NIGHT_THEME);
        }
      });
      this.miniBookmarkInitialize();
      if (this.data.isReactApp) this.runObserver();
    },
  };
  pfb.initialize();
}());