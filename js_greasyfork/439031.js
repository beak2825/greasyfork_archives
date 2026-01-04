// ==UserScript==
// @name            CMTT-MAGIC
// @name:ru         CMTT-MAGIC
// @version         1.0.1
// @description     Add some magic to CMTT projects!
// @description:ru  Добавить немного магии проектам CMTT!
// @namespace       https://kartoshka.com
// @author          Kartoshka
// @license         GPLv2+
// @match           https://vc.ru/*
// @match           https://tjournal.ru/*
// @match           https://dtf.ru/*
// @run-at          document-end
// @grant           GM_setValue
// @grant           GM.setValue
// @grant           GM_getValue
// @grant           GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/439031/CMTT-MAGIC.user.js
// @updateURL https://update.greasyfork.org/scripts/439031/CMTT-MAGIC.meta.js
// ==/UserScript==

const COMMENTS_CONTAINER_SELECTOR = '.comments';
const COMMENTS_TABS_CONTAINER_SELECTOR = '.comments .comments__navigation .ui-tabs__content';
const COMMENTS_TITLE_SELECTOR = '.comments .comments__title';

const TAB_MODE_BUTTON_CLASS = 'magic-comments-mode-button';
const TAB_ACTION_BUTTON_CLASS = 'magic-comments-action-button';

const TAB_BUTTON_TEXT_CLASS = 'magic-comments-tab-button-text';

const OP_EXPAND_TOPLEVEL = 'expand-toplevel';
const OP_EXPAND_ALL = 'expand-all';
const OP_COLLAPSE_ALL = 'collapse-all';
const OP_COLLAPSE_ALL_SCROLL = 'collapse-all-scroll';
const OP_LOADMORE_ALL_NEAR_VIEWPORT = 'loadmore-all-near-viewport';
const OP_LOADMORE_FIRST_BELOW_VIEWPORT = 'loadmore-first-below-viewport';
const OP_LOAD_ALL_IF_PARTIAL = 'load-all-if-partial';

const ACTION_EXPAND = 'expand';
const ACTION_COLLAPSE = 'collapse';

const MODE_EXPAND_ON_SCROLL = 'expand-on-scroll';
const MODE_EXPAND_EARLY = 'expand-early';
const MODE_COLLAPSE_ALL = 'collapse-all';

const ACTIONS = [
  {
    value: ACTION_EXPAND,
    title: 'Развернуть',
    operations: [
      OP_EXPAND_ALL,
      {
        op: OP_LOAD_ALL_IF_PARTIAL,
        args: [{ afterLoadOperations: OP_EXPAND_ALL }],
      },
    ],
    newCurrentMode: MODE_EXPAND_EARLY,
  },
  {
    value: ACTION_COLLAPSE,
    title: 'Свернуть',
    operations: OP_COLLAPSE_ALL,
    newCurrentMode: MODE_COLLAPSE_ALL,
  },
];

const MODES = [
  {
    value: null,
    title: 'Не разворачиваются',
    initialOperations: null,
    initialNextAction: ACTION_EXPAND,
  },
  {
    value: MODE_EXPAND_ON_SCROLL,
    title: 'Разворачиваются',
    initialOperations: [
      OP_EXPAND_ALL,
      {
        op: OP_LOAD_ALL_IF_PARTIAL,
        args: [{ afterLoadOperations: OP_EXPAND_ALL }],
      },
    ],
    initialNextAction: ACTION_COLLAPSE,
  },
  {
    value: MODE_EXPAND_EARLY,
    title: 'Разворачиваются сразу',
    initialOperations: [
      OP_EXPAND_ALL,
      {
        op: OP_LOAD_ALL_IF_PARTIAL,
        args: [{ afterLoadOperations: OP_EXPAND_ALL }],
      },
    ],
    initialNextAction: ACTION_COLLAPSE,
  },
  {
    value: MODE_COLLAPSE_ALL,
    title: 'Сворачиваются все',
    initialOperations: OP_COLLAPSE_ALL_SCROLL,
    initialNextAction: ACTION_EXPAND,
  },
];

const DEFAULT_OPTIONS = {
  mode: null,
};

let windowLoaded = false;
let magicHappened = false;

let options;
let currentMode;
let nextAction;
let collapseProtected;
let restoreCommentScrollPosition;
let currentUrlPath;
let currentPageTitle;
let scrollAggregateTimer;
let throttledLoadMoreTimer;
let newPageDetectorTimer;
let waitForCommentsInitializedTimer;
let loadAllIfPartialCompleteTimer;

loadOptions().then(magic);
window.addEventListener('load', () => {
  windowLoaded = true;
  remagic();
});
window.addEventListener('popstate', startNewPageDetector);
window.addEventListener('click', startNewPageDetector);

/**
 *
 */
function magic() {
  if (!options) {
    return;
  }

  if (!windowLoaded) {
    return;
  }

  if (!getTabsContainer()) {
    return;
  }

  if (magicHappened) {
    return;
  }
  magicHappened = true;

  clean();
  init();
}

/**
 *
 */
function remagic() {
  magicHappened = false;
  magic();
}

/**
 *
 */
function init() {
  if (!options) {
    return;
  }

  currentMode = options.mode;
  nextAction = getModeParams(currentMode).initialNextAction;

  currentPageTitle = document.title;
  currentUrlPath = window.location.pathname;
  processOptionsBasedOnUrl();

  renderButtons();
  applyCurrentMode();
  runOperations(getModeParams(currentMode).initialOperations);
  addLoadAllIfPartialLinksClickHandler();
}

/**
 *
 */
function clean() {
  stopAllExpandRoutines();
  cleanCollapseProtected();
  restoreCommentScrollPosition = null;
  newPageDetectorTimer = stopTimer(newPageDetectorTimer);
  waitForCommentsInitializedTimer = stopTimer(waitForCommentsInitializedTimer);
  loadAllIfPartialCompleteTimer = stopTimer(loadAllIfPartialCompleteTimer);
}

/**
 *
 */
function startNewPageDetector() {
  stopTimer(newPageDetectorTimer);
  newPageDetectorTimer = setTimeout(newPageDetectorTick.bind(null, 0), 0);
}

/**
 *
 */
function newPageDetectorTick(iteration = 0) {
  newPageDetectorTimer = null;

  if (iteration > 20) {
    return;
  }

  const rescheduleWaitForCommentsInitialized = () => {
    stopTimer(waitForCommentsInitializedTimer);
    waitForCommentsInitializedTimer = setTimeout(waitForCommentsInitializedTick.bind(null, 0), 250);
  };

  if (currentUrlPath !== window.location.pathname) {
    currentUrlPath = window.location.pathname;
    rescheduleWaitForCommentsInitialized();
    return;
  }

  if (currentPageTitle !== document.title) {
    currentPageTitle = document.title;
    rescheduleWaitForCommentsInitialized();
    return;
  }

  newPageDetectorTimer = setTimeout(newPageDetectorTick.bind(null, iteration + 1), 250);
}

/**
 *
 */
function waitForCommentsInitializedTick(iteration = 0) {
  waitForCommentsInitializedTimer = null;

  if (iteration > 40) {
    return;
  }

  const reschedule = (timeout = 250) => {
    waitForCommentsInitializedTimer = setTimeout(
      waitForCommentsInitializedTick.bind(null, iteration + 1),
      timeout,
    );
  };

  const tabs = getTabsContainer();

  if (!tabs) {
    reschedule();
    return;
  }

  if (optionsModeButtonExists(tabs)) {
    reschedule();
    return;
  }

  (async () => {
    await sleep(1);

    remagic();

    await sleep(250);

    if (!waitForCommentsInitializedTimer) {
      // Lets keep trying even after remagic
      reschedule();
    }
  })();
}

/**
 *
 */
function processOptionsBasedOnUrl() {
  const query = new URLSearchParams(window.location.search);
  const id = query.get('comment');

  if (id) {
    addCollapseProtected(id);
    restoreCommentScrollPosition = id;
  }
}

/**
 *
 */
function renderButtons() {
  const tabs = getTabsContainer();

  if (!tabs) {
    return;
  }

  renderOptionsModeButton(tabs);
  renderActionButton(tabs);
}

/**
 *
 */
function renderOptionsModeButton(container = getTabsContainer()) {
  if (!options) {
    return;
  }

  // This button always shows mode stored in options (not the currentMode)
  const modeParams = getModeParams(options.mode, 0);
  const nextModeParams = getModeParamsByIndex(findModeIndex(options.mode) + 1);

  const button = ensureTabButton(TAB_MODE_BUTTON_CLASS, container);

  setTabButtonText(button, modeParams.title);
  setTabButtonOnClick(button, setOptionsMode.bind(null, nextModeParams.value));

  setTabButtonTextStyle(
    button,
    'padding:3px 7px;border:1px dotted #888;border-radius:4px;opacity:.8;user-select:none',
  );
}

/**
 *
 */
function optionsModeButtonExists(container = getTabsContainer()) {
  return !!container.querySelector(`.${TAB_MODE_BUTTON_CLASS}`);
}

/**
 *
 */
function renderActionButton(container = getTabsContainer()) {
  const actionParams = getActionParams(nextAction);

  const button = ensureTabButton(TAB_ACTION_BUTTON_CLASS, container);

  setTabButtonText(button, actionParams?.title);
  setTabButtonOnClick(button, runAction.bind(null, nextAction));

  setTabButtonTextStyle(button, 'opacity:.7;user-select:none');
}

/**
 *
 */
function setOptionsMode(newMode) {
  if (!options) {
    return;
  }

  if (options.mode === newMode) {
    return;
  }

  options.mode = newMode;

  saveOptions().then(remagic);
}

/**
 *
 */
function runAction(action) {
  const actionParams = getActionParams(action, 0);
  const nextActionParams = getActionParamsByIndex(findActionIndex(action) + 1);

  currentMode = actionParams.newCurrentMode;
  nextAction = nextActionParams.value;

  renderActionButton();
  applyCurrentMode();
  runOperations(actionParams.operations);
}

/**
 *
 */
function applyCurrentMode() {
  switch (currentMode) {
    case MODE_EXPAND_ON_SCROLL:
      applyExpandOnScrollMode();
      break;
    case MODE_EXPAND_EARLY:
      applyExpandEarlyMode();
      break;
    case MODE_COLLAPSE_ALL:
      applyCollapseAllMode();
      break;
  }
}

/**
 *
 */
function applyExpandOnScrollMode() {
  runOperations(OP_LOADMORE_ALL_NEAR_VIEWPORT);
  document.addEventListener('scroll', scrollHandler);
}

/**
 *
 */
function applyExpandEarlyMode() {
  runOperations(OP_LOADMORE_ALL_NEAR_VIEWPORT);
  document.addEventListener('scroll', scrollHandler);
  scheduleThrottledLoadMore();
}

/**
 *
 */
function applyCollapseAllMode() {
  stopAllExpandRoutines();
}

/**
 *
 */
function stopAllExpandRoutines() {
  document.removeEventListener('scroll', scrollHandler);
  scrollAggregateTimer = stopTimer(scrollAggregateTimer);
  throttledLoadMoreTimer = stopTimer(throttledLoadMoreTimer);
}

/**
 *
 */
function scrollHandler() {
  if (!scrollAggregateTimer) {
    scrollAggregateTimer = setTimeout(() => {
      scrollAggregateTimer = null;
      runOperation(OP_LOADMORE_ALL_NEAR_VIEWPORT);
    }, 300);
  }
}

/**
 *
 */
function scheduleThrottledLoadMore() {
  throttledLoadMoreTimer = setTimeout(throttledLoadMoreTick, 3000);
}

/**
 *
 */
function throttledLoadMoreTick() {
  if (runOperation(OP_LOADMORE_FIRST_BELOW_VIEWPORT)) {
    scheduleThrottledLoadMore();
  }
}

/**
 *
 */
function runOperations(operations) {
  if (!operations) {
    return undefined;
  }
  return Array.isArray(operations)
    ? operations.map((item) => (!!item ? runOperation(item) : undefined))
    : runOperation(operations);
}

/**
 *
 */
function runOperation(operation) {
  let operationArgs = [];

  if (operation?.op) {
    if (operation.hasOwnProperty('args')) {
      operationArgs = Array.isArray(operation.args) ? operation.args : [operation.args];
    }
    operation = operation.op;
  } else if (typeof operation !== 'string') {
    throw new Error('Operation must be a string');
  }

  switch (operation) {
    case OP_EXPAND_TOPLEVEL:
      return expandCollapsedUpToLevel(1);
    case OP_EXPAND_ALL:
      return expandAllCollapsed();
    case OP_COLLAPSE_ALL:
      return collapseAllExceptProtected();
    case OP_COLLAPSE_ALL_SCROLL:
      return collapseAllExceptProtectedScroll();
    case OP_LOADMORE_ALL_NEAR_VIEWPORT:
      return loadMoreAllNearViewport();
    case OP_LOADMORE_FIRST_BELOW_VIEWPORT:
      return loadMoreFirstBelowViewport();
    case OP_LOAD_ALL_IF_PARTIAL:
      return loadAllIfPartial(...operationArgs);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

/**
 *
 */
function expandCollapsedUpToLevel(level) {
  let counter = 0;

  for (let i = 1; i <= level; i++) {
    counter += clickOnNodesPreservingScroll(`[data-level="${i}"] .comment__expand-branch--visible`);
  }

  return counter;
}

/**
 *
 */
function expandAllCollapsed() {
  return clickOnNodesPreservingScroll('.comment__expand-branch--visible');
}

/**
 *
 */
function collapseAllExceptProtected() {
  doCollapseComments('', true, false);
}

/**
 *
 */
function collapseAllExceptProtectedScroll() {
  doCollapseComments('', true, true);
}

/**
 *
 */
function doCollapseComments(filterSelector = '', exceptProtected = true, updateScroll = true) {
  const container = getCommentsContainer();

  let filter = filterSelector;

  if (exceptProtected) {
    filter += generateCollapseProtectedSelector();
  }

  const collapseSelector = `.comment${filter} .comment__branch--no-border`;

  if (!updateScroll) {
    return clickOnNodesPreservingScroll(collapseSelector);
  }

  (async () => {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    await waitForSameValueWithinTime(() => window.scrollY, 1, 1);

    let commentIdScrollTo;
    let commentScrollTo;
    let positionFromBottomScrollTo;

    if (restoreCommentScrollPosition) {
      await waitForSameValueWithinTime(() => window.scrollY, 25, 5);

      commentIdScrollTo = restoreCommentScrollPosition;
      restoreCommentScrollPosition = null;

      const el = getCommentElementByCommentId(commentIdScrollTo);

      if (el) {
        const top = getElementViewportRelativeTop(el);
        if (top >= 500 || top <= -500) {
          commentIdScrollTo = null;
        }
      } else {
        commentIdScrollTo = null;
      }
    }

    if (commentIdScrollTo) {
      commentScrollTo = getCommentElementByCommentId(commentIdScrollTo, container);
    } else {
      commentScrollTo = findFirstCommentElementBeginsWithinViewport();
      if (typeof commentScrollTo === 'number') {
        if (commentScrollTo < 0) {
          // Comments are below the viewport, collapse should not affect scroll position
          commentScrollTo = null;
        } else {
          // Comments are above the viewport, it's better to scroll to position from bottom instead
          positionFromBottomScrollTo = document.documentElement.scrollHeight - window.scrollY;
          commentScrollTo = null;
        }
      }
    }

    if (!commentScrollTo && !positionFromBottomScrollTo) {
      return clickOnNodesPreservingScroll(collapseSelector);
    }

    let oldTop = null;

    if (commentScrollTo) {
      oldTop = getElementViewportRelativeTop(commentScrollTo);
    }

    const scrollToNewPos = () => {
      let newScrollY = null;

      if (positionFromBottomScrollTo) {
        newScrollY = document.documentElement.scrollHeight - positionFromBottomScrollTo;
      } else if (oldTop !== null && commentScrollTo) {
        if (commentScrollTo?.classList?.contains('comment--collapsed')) {
          // If commentScrollTo is collapsed now then scroll to its first visible ancestor
          try {
            for (const ancestorId of getCommentAncestors(
              getCommentIdByCommentElement(commentScrollTo),
            )) {
              const ancestorEl = getCommentElementByCommentId(ancestorId);
              if (!ancestorEl?.classList || ancestorEl?.classList?.contains('comment--collapsed')) {
                continue;
              }
              newScrollY =
                window.scrollY + getElementViewportRelativeTop(ancestorEl) - windowHeight / 2 + 100;
              break;
            }
          } catch (e) {
            return;
          }
        } else {
          newScrollY = window.scrollY + getElementViewportRelativeTop(commentScrollTo) - oldTop;
        }
      }

      if (typeof newScrollY !== 'number') {
        return null;
      }

      newScrollY = Math.floor(newScrollY);

      window.scrollTo(0, newScrollY);

      return newScrollY;
    };

    const result = clickOnNodes(collapseSelector);

    let scrolledTo = scrollToNewPos();

    await sleep(1);

    if (scrolledTo !== window.scrollY) {
      scrollToNewPos();
    }

    return result;
  })();
}

/**
 *
 */
function generateCollapseProtectedSelector(container = getCommentsContainer()) {
  if (!(collapseProtected instanceof Set) || !collapseProtected.size) {
    return '';
  }

  const allDescendents = new Set();
  const processedRoots = new Set();

  for (const protectedId of [...collapseProtected]) {
    const rootId = getCommentRootId(protectedId);

    if (processedRoots.has(rootId)) {
      continue;
    }

    processedRoots.add(rootId);

    for (const descendentId of getCommentDescendants(rootId)) {
      allDescendents.add(descendentId);
    }
  }

  const branchClosings = new Set();

  for (const descendentId of [...allDescendents]) {
    if (
      container.querySelector(`.comment[data-id="${descendentId}"] .comment__branch--no-border`)
    ) {
      branchClosings.add(descendentId);
    }
  }

  if (branchClosings.size > 1000) {
    return '';
  }

  return [...branchClosings].map((item) => `:not([data-id="${item}"])`).join('');
}

/**
 *
 */
function loadMoreAllNearViewport() {
  const inViewport = [];
  const nearViewport = [];

  iterateLoadMoreNodes((node) => {
    const top = getElementViewportRelativeTop(node);
    const bottom = getElementViewportRelativeBottom(node);

    if (top > 0) {
      if (bottom > 0) {
        inViewport.push(node);
      } else if (bottom > -200) {
        nearViewport.push(node);
      } else if (bottom > -500 && !nearViewport.length) {
        nearViewport.push(node);
      }
    }
  });

  for (const node of new Set([...inViewport, ...nearViewport])) {
    doClickLoadMoreNode(node);
  }
}

/**
 *
 */
function loadMoreFirstBelowViewport() {
  return !!iterateLoadMoreNodes((node) => {
    const top = getElementViewportRelativeTop(node);
    const bottom = getElementViewportRelativeBottom(node);

    if (top > 0 && bottom < 0) {
      doClickLoadMoreNode(node);
      return true;
    }
  });
}

/**
 *
 */
function iterateLoadMoreNodes(fn) {
  const selectors = ['.comment__load-more:not(.comment__load-more--waiting)', '.comments__more'];

  const container = getCommentsContainer();

  for (const selector of selectors) {
    for (const node of container.querySelectorAll(
      `${selector}:not(.magic-comments-load-waiting)`,
    )) {
      if (fn(node) === true) {
        return true;
      }
    }
  }
}

/**
 *
 */
function doClickLoadMoreNode(node) {
  if (node?.classList) {
    node.classList.add('magic-comments-load-waiting');
  }
  node.click();
}

/**
 *
 */
function addLoadAllIfPartialLinksClickHandler() {
  for (const link of document.querySelectorAll(
    `${COMMENTS_CONTAINER_SELECTOR} .comments__link_to_all a`,
  )) {
    link.addEventListener('click', loadAllIfPartialLinksClickHandler);
  }
}

/**
 *
 */
function loadAllIfPartialLinksClickHandler() {
  let operations;

  switch (currentMode) {
    case MODE_EXPAND_ON_SCROLL:
    case MODE_EXPAND_EARLY:
      operations = OP_EXPAND_ALL;
      break;
    case MODE_COLLAPSE_ALL:
      operations = OP_COLLAPSE_ALL_SCROLL;
      break;
    default:
      operations = [];
  }

  startLoadAllIfPartialCompleteTimer({
    afterLoadOperations: operations,
  });
}

/**
 *
 */
function loadAllIfPartial(...args) {
  const link = document.querySelector(`${COMMENTS_CONTAINER_SELECTOR} .comments__link_to_all a`);

  if (!link) {
    return;
  }

  link.click();

  startLoadAllIfPartialCompleteTimer(...args);
}

/**
 *
 */
function startLoadAllIfPartialCompleteTimer(...args) {
  stopTimer(loadAllIfPartialCompleteTimer);
  loadAllIfPartialCompleteTimer = setTimeout(
    loadAllIfPartialCompleteTick.bind(null, 0, ...args),
    250,
  );
}

/**
 *
 */
function loadAllIfPartialCompleteTick(iteration = 0, ...args) {
  loadAllIfPartialCompleteTimer = null;

  if (iteration > 50) {
    return;
  }

  const tabs = getTabsContainer();

  if (tabs) {
    if (!tabs.querySelector('.comments__link_to_all')) {
      setTimeout(loadAllIfPartialCompleteCallback.bind(null, ...args), 1000);
    }
    return;
  }

  loadAllIfPartialCompleteTimer = setTimeout(
    loadAllIfPartialCompleteTick.bind(null, iteration + 1, ...args),
    250,
  );
}

/**
 *
 */
function loadAllIfPartialCompleteCallback(params) {
  if (params?.afterLoadOperations) {
    runOperations(params.afterLoadOperations);
  }
}

/**
 *
 */
function getCommentElementByCommentId(id, container = getCommentsContainer()) {
  return container.querySelector(`.comment[data-id="${id}"]`);
}

/**
 *
 */
function getCommentIdByCommentElement(element) {
  if (typeof element?.getAttribute !== 'function') {
    return undefined;
  }
  return element.getAttribute('data-id') | undefined;
}

/**
 *
 */
function getNthCommentElement(n, filter = null, comments = null) {
  return filterCommentElements(filter, comments)?.[n - 1];
}

/**
 *
 */
function getLastCommentElement(filter = null, comments = null) {
  comments = filterCommentElements(filter, comments);
  return comments?.[comments.length - 1];
}

/**
 *
 */
function getCommentElementsCount(filter = null, comments = null) {
  return filterCommentElements(filter, comments).length;
}

/**
 *
 */
function binarySearchCommentElement(fn, filter = null, comments = null) {
  comments = filterCommentElements(filter, comments);

  if (!comments.length) {
    return undefined;
  }

  let l = 0;
  let r = comments.length - 1;

  while (l <= r) {
    const i = Math.floor((l + r) / 2);

    const comment = comments?.[i];

    if (!comment) {
      return undefined;
    }

    const result = fn(comment, i, comments);

    if (result === -1) {
      r = i - 1;
    } else if (result === 1) {
      l = i + 1;
    } else {
      return comment;
    }
  }

  return undefined;
}

/**
 *
 */
function getAllCommentElements() {
  return filterCommentElements(null);
}

/**
 *
 */
function filterCommentElements(filter, comments) {
  if (!comments) {
    comments = document.getElementsByClassName('comment');

    if (!comments) {
      throw new Error('Function getElementsByClassName() returned unexpected result');
    }
  }

  // Convert to array if it's an iterable (e.g. Set)
  comments = [...comments];

  if (typeof filter !== 'function') {
    return comments;
  }

  if (comments.length) {
    comments = comments.filter(filter);
  }

  return comments;
}

/**
 *
 */
function visibleCommentsOnlyFilter(comment) {
  if (!comment?.classList) {
    return false;
  }
  return !comment.classList.contains('comment--collapsed');
}

/**
 *
 */
function findFirstCommentElementBeginsWithinViewport() {
  const comments = filterCommentElements(visibleCommentsOnlyFilter);

  if (!comments.length) {
    return undefined;
  }

  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  let top = getElementViewportRelativeTop(comments[0]);

  if (top >= 0) {
    if (top < windowHeight) {
      return comments[0];
    }
    // There is no comment within the viewport (all of them are below it)
    return top;
  }

  top = getElementViewportRelativeBottom(comments[comments.length - 1]);

  if (top < 0) {
    // All comments are above the viewport
    return top;
  }

  return binarySearchCommentElement(
    (comment, index, comments) => {
      let top = getElementViewportRelativeTop(comment);

      if (top < 0) {
        if (
          comments?.[index + 1] &&
          getElementViewportRelativeTop(comments?.[index + 1]) >= 0 &&
          getElementViewportRelativeTop(comments?.[index + 1]) < windowHeight
        ) {
          return -1;
        } else {
          // A case when comment is started above viewport and took the entire window height
          return 0;
        }
      } else if (top > windowHeight) {
        return 1;
      } else if (
        comments?.[index - 1] &&
        getElementViewportRelativeTop(comments?.[index - 1]) > 0
      ) {
        return -1;
      }

      return 0;
    },
    null,
    comments,
  );
}

/**
 *
 */
function getCommentsCountByAttr() {
  const title = document.querySelector(COMMENTS_TITLE_SELECTOR);

  if (!title) {
    return undefined;
  }

  const count = parseInt(title.getAttribute('data-count'));

  return typeof count === 'number' ? count : undefined;
}

/**
 *
 */
function getCommentParentId(id) {
  id = parseInt(id);

  if (!id) {
    throw new Error('Invalid comment id');
  }

  const comment = document.querySelector(
    `${COMMENTS_CONTAINER_SELECTOR} .comment[data-id="${id}"]`,
  );

  if (!comment) {
    throw new Error(`Comment "${id}" not found`);
  }

  return parseInt(comment.getAttribute('data-reply_to')) || null;
}

/**
 *
 */
function getSiblingCommentId(id) {
  id = parseInt(id);

  if (!id) {
    throw new Error('Invalid comment id');
  }

  const comment = document.querySelector(
    `${COMMENTS_CONTAINER_SELECTOR} .comment[data-id="${id}"] + .comment`,
  );

  if (!comment) {
    return null;
  }

  return parseInt(comment.getAttribute('data-id')) || null;
}

/**
 *
 */
function getCommentAncestors(id) {
  const ancestors = [];

  let loopDetector = 0;
  let parentId = id;

  while (parentId && ++loopDetector < 1000) {
    parentId = getCommentParentId(parentId);
    if (parentId) {
      ancestors.push(parentId);
    }
  }

  return ancestors;
}

/**
 *
 */
function isCommentAncestor(id, ancestorId) {
  ancestorId = parseInt(ancestorId);

  let loopDetector = 0;
  let parentId = id;

  while (parentId && ++loopDetector < 1000) {
    parentId = getCommentParentId(parentId);
    if (parentId && parentId === ancestorId) {
      return true;
    }
  }

  return false;
}

/**
 *
 */
function getCommentRootId(id) {
  id = parseInt(id);

  if (!id) {
    throw new Error('Invalid comment id');
  }

  const ancestors = getCommentAncestors(id);

  return ancestors.length ? ancestors[ancestors.length - 1] : id;
}

/**
 *
 */
function getCommentDescendants(id) {
  const descendants = [];

  let loopDetector = 0;
  let siblingId = id;

  while (siblingId && ++loopDetector < 10000) {
    siblingId = getSiblingCommentId(siblingId);
    if (siblingId) {
      if (!isCommentAncestor(siblingId, id)) {
        break;
      }
      descendants.push(siblingId);
    }
  }

  return descendants;
}

/**
 *
 */
function ensureTabButton(className, container = getTabsContainer()) {
  let button = container.querySelector(`.${className}`);

  if (!button) {
    button = createTabButton();
    button.classList.add(className);
    container.appendChild(button);
  }

  return button;
}

/**
 *
 */
function createTabButton() {
  const button = document.createElement('div');
  button.classList.add('ui-tab');

  const buttonLabel = document.createElement('span');
  buttonLabel.classList.add('ui-tab__label');

  const buttonMagicText = document.createElement('span');
  buttonMagicText.classList.add(TAB_BUTTON_TEXT_CLASS);

  buttonLabel.appendChild(buttonMagicText);
  button.appendChild(buttonLabel);

  return button;
}

/**
 *
 */
function setTabButtonText(button, text) {
  setTabButtonTextProperty(button, 'textContent', text);
}

/**
 *
 */
function setTabButtonTextStyle(button, style) {
  setTabButtonTextProperty(button, 'style', style);
}

/**
 *
 */
function setTabButtonTextProperty(button, property, value) {
  if (!button) {
    return;
  }

  const textEl = button.querySelector(`.${TAB_BUTTON_TEXT_CLASS}`);

  if (!textEl) {
    return;
  }

  textEl[property] = value;
}

/**
 *
 */
function addTabButtonClass(button, className) {
  if (button?.classList) {
    button.classList.add(className);
  }
}

/**
 *
 */
function removeTabButtonClass(button, className) {
  if (button?.classList) {
    button.classList.remove(className);
  }
}

/**
 *
 */
function setTabButtonOnClick(button, callback) {
  if (button) {
    button.onclick = callback;
  }
}

/**
 *
 */
function clickOnNodes(selector, filter = null, container = getCommentsContainer()) {
  if (!container) {
    return 0;
  }

  if (filter && typeof filter !== 'function') {
    throw new Error('Node filter must be a function');
  }

  let counter = 0;

  for (const node of container.querySelectorAll(selector)) {
    if (filter && !filter(node)) {
      continue;
    }
    node.click();
    ++counter;
  }

  return counter;
}

/**
 *
 */
function clickOnNodesPreservingScroll(selector, filter = null, container = getCommentsContainer()) {
  const pos = window.scrollY;
  const result = clickOnNodes(selector, filter, container);
  window.scrollTo(0, pos);
  return result;
}

/**
 *
 */
function getCommentsContainer() {
  return document.querySelector(COMMENTS_CONTAINER_SELECTOR);
}

/**
 *
 */
function getTabsContainer() {
  return document.querySelector(COMMENTS_TABS_CONTAINER_SELECTOR);
}

/**
 *
 */
function getElementViewportRelativeTop(element) {
  if (!element?.getBoundingClientRect) {
    return undefined;
  }
  return element.getBoundingClientRect().top;
}

/**
 *
 */
function getElementViewportRelativeBottom(element) {
  if (!element?.getBoundingClientRect) {
    return undefined;
  }
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const rect = element.getBoundingClientRect();
  return windowHeight - (rect.top + rect.height);
}

/**
 *
 */
function addCollapseProtected(id) {
  if (!(collapseProtected instanceof Set)) {
    collapseProtected = new Set();
  }

  id = parseInt(id);

  if (id) {
    collapseProtected.add(id);
  }
}

/**
 *
 */
function removeCollapseProtected(id) {
  if (!(collapseProtected instanceof Set)) {
    return;
  }

  id = parseInt(id);

  if (id) {
    collapseProtected.remove(id);
  }
}

/**
 *
 */
function cleanCollapseProtected() {
  collapseProtected = null;
}

/**
 *
 */
async function waitForSameValueWithinTime(getter, delay, times, allowedValues) {
  if (typeof allowedValues !== 'undefined') {
    if (!Array.isArray(allowedValues)) {
      allowedValues = [allowedValues];
    }
  }

  const checkValueIsAllowed = (value) => {
    if (!Array.isArray(allowedValues)) {
      return;
    }
    if (allowedValues.indexOf(value) === -1) {
      throw new Error(`Value "${value}" is not allowed`);
    }
  };

  let i = 0;
  let val = getter();

  checkValueIsAllowed(val);

  while (++i <= times) {
    await sleep(delay);

    const newval = getter();

    checkValueIsAllowed(newval);

    if (newval !== val) {
      val = newval;
      i = 0;
    }
  }

  return val;
}

/**
 *
 */
function stopObserver(observer) {
  if (observer) {
    observer.disconnect();
  }
  return null;
}

/**
 *
 */
function stopTimer(timer) {
  if (timer) {
    clearTimeout(timer);
  }
  return null;
}

/**
 *
 */
async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 *
 */
function findModeIndex(mode) {
  return findParamsArrayEntryIndex(MODES, mode);
}

/**
 *
 */
function getModeParams(mode, defaultIndex = 0) {
  return getParamsArrayEntry(MODES, mode, defaultIndex);
}

/**
 *
 */
function getModeParamsByIndex(index, defaultIndex = 0) {
  return getParamsArrayEntryByIndex(MODES, index, defaultIndex);
}

/**
 *
 */
function findActionIndex(action) {
  return findParamsArrayEntryIndex(ACTIONS, action);
}

/**
 *
 */
function getActionParams(action, defaultIndex = 0) {
  return getParamsArrayEntry(ACTIONS, action, defaultIndex);
}

/**
 *
 */
function getActionParamsByIndex(index, defaultIndex = 0) {
  return getParamsArrayEntryByIndex(ACTIONS, index, defaultIndex);
}

/**
 *
 */
function findParamsArrayEntryIndex(arr, value) {
  return arr.findIndex((item) => item.value === value);
}

/**
 *
 */
function getParamsArrayEntry(arr, value, defaultIndex = 0) {
  return arr.find((item) => item.value === value) || arr[defaultIndex];
}

/**
 *
 */
function getParamsArrayEntryByIndex(arr, index, defaultIndex = 0) {
  return arr?.[index] || arr[defaultIndex];
}

/**
 *
 */
async function loadOptions() {
  options = await loadCurrentHostParam('options', DEFAULT_OPTIONS);
}

/**
 *
 */
async function saveOptions() {
  if (!options) {
    return false;
  }
  await saveCurrentHostParam('options', options);
  return true;
}

/**
 *
 */
function formatStorageParamName(name) {
  return name.replace(/[^a-z0-9]/i, '_');
}

/**
 *
 */
async function loadParamFromStorage(param, defaultValue) {
  if (typeof GM?.getValue === 'function') {
    return await GM.getValue(formatStorageParamName(param), defaultValue);
  } else if (typeof GM_getValue === 'function') {
    return GM_getValue(formatStorageParamName(param), defaultValue);
  } else {
    throw new Error('Script requires GM.getValue() or GM_getValue() to load parameters');
  }
}

/**
 *
 */
async function saveParamToStorage(param, value) {
  if (typeof value !== 'string') {
    throw new Error('Storage can contain only string values');
  }

  if (typeof GM?.setValue === 'function') {
    await GM.setValue(formatStorageParamName(param), value);
  } else if (typeof GM_setValue === 'function') {
    GM_setValue(formatStorageParamName(param), value);
  } else {
    throw new Error('Script requires GM.setValue() or GM_setValue() to save parameters');
  }
}

/**
 *
 */
async function loadParamAsJsonFromStorage(param, defaultValue) {
  const value = await loadParamFromStorage(param, null);
  return typeof value === 'string' ? JSON.parse(value) : defaultValue;
}

/**
 *
 */
async function saveParamAsJsonToStorage(param, value) {
  return saveParamToStorage(param, JSON.stringify(value));
}

/**
 *
 */
async function loadCurrentHostParam(name, defaultValue) {
  return loadParamAsJsonFromStorage(`${window.location.host}${name}`, defaultValue);
}

/**
 *
 */
async function saveCurrentHostParam(name, value) {
  return saveParamAsJsonToStorage(`${window.location.host}${name}`, value);
}
