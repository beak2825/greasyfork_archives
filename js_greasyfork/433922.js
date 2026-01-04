// ==UserScript==
// @name Citadel fix duplicated diff id
// @namespace https://greasyfork.org/users/825389
// @version 1.1.9
// @author vivaxy
// @description fix duplicated diff id
// @include https://*-km.*.sankuai.com/*
// @include https://km.*.sankuai.com/*
// @match https://km.*.sankuai.com/*
// @match https://km.sankuai.com/*
// @require https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuidv4.min.js
// @run-at document-start
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/433922/Citadel%20fix%20duplicated%20diff%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/433922/Citadel%20fix%20duplicated%20diff%20id.meta.js
// ==/UserScript==

const win = window.unsafeWindow ? window.unsafeWindow : window;

const ATTR_PREFIX = {
  dataDiffId: 'ct-diff-id-',
  dataRowDiffId: 'ct-tr-diff-id-',
  dataCellDiffId: 'ct-cell-diff-id-',
  dataListItemDiffId: 'ct-list-item-diff-id-',
};

const checkDuplicatedDiffId = (view) => {
  const editorState = view.state;
  const { tr } = editorState;
  const diffIdSet = new Set();

  const duplicatedDiffIds = new Set();
  editorState.doc.nodesBetween(0, editorState.doc.nodeSize - 2, (node, pos) => {
    let diffId = null;
    const ATTR_KEYS = Object.keys(ATTR_PREFIX);
    const key = ATTR_KEYS.find((attrKey) => {
      const found = node.attrs[attrKey];
      if (found) {
        diffId = node.attrs[attrKey];
      }
      return found;
    });
    if (!diffId) {
      return;
    }
    if (diffIdSet.has(diffId)) {
      duplicatedDiffIds.add(diffId);
      const nAttrs = { ...node.attrs, [key]: `${ATTR_PREFIX[key]}${uuidv4()}` };
      tr.setNodeMarkup(pos, null, nAttrs);
    } else {
      diffIdSet.add(diffId);
    }
  });
  return [tr, duplicatedDiffIds];
};

let $fixButton;

function mountEditorView(view) {
  if (view.__fixDiffIDMounted) {
    return;
  }
  let fixTr;

  const oDispatch = view.dispatch;

  view.dispatch = function(tr) {
    oDispatch(tr);
    if (tr.docChanged) {
      check();
    }
  };
  view.__fixDiffIDMounted = true;

  $fixButton = document.createElement('button');
  $fixButton.textContent = 'Fix diff id';
  $fixButton.style.width = '40px';
  $fixButton.style.height = '40px';
  $fixButton.style.position = 'fixed';
  $fixButton.style.bottom = '90px';
  $fixButton.style.right = '24px';
  $fixButton.style.border = 'none';
  $fixButton.style.lineHeight = '12px';
  $fixButton.style.fontSize = '12px';
  $fixButton.style.fontFamily = 'monospace';
  $fixButton.style.fontWeight = '900';
  $fixButton.style.borderRadius = '50%';
  $fixButton.style.color = '#fff';
  $fixButton.style.background = '#f00';
  $fixButton.style.boxShadow = 'rgb(111 130 166 / 10%) 0px 2px 4px 0px';

  document.body.appendChild($fixButton);
  $fixButton.addEventListener('click', function() {
    if (fixTr) {
      view.dispatch(fixTr);
      fixTr = null;
    }
  });

  function check() {
    const [tr, duplicatedDiffIds] = checkDuplicatedDiffId(view);
    if (duplicatedDiffIds.size) {
      fixTr = tr;
      $fixButton.style.display = 'block';
      console.log('duplicatedDiffIds', duplicatedDiffIds);
    } else {
      fixTr = null;
      $fixButton.style.display = 'none';
    }
  }

  check();
}

let isVisible = true;

win.addEventListener('visibilitychange', function() {
  isVisible = document.visibilityState === 'visible';
});

setInterval(function() {
  if (isVisible) {
    if (document.getElementById('pm-body-wrapper')) {
      // view page
      hideFixButton();
      tryCheckInViewPage();
    } else if (win.__CITADELEDITOR_INSTANCE && Object.keys(win.__CITADELEDITOR_INSTANCE).length) {
      // old edit page
      const id = Object.keys(win.__CITADELEDITOR_INSTANCE)[0];
      if (id && win.__CITADELEDITOR_INSTANCE[id]) {
        mountEditorView(win.__CITADELEDITOR_INSTANCE[id].view);
      }
    } else if (win.editorInst) {
      // parker edit page
      mountEditorView(win.editorInst.manager.editorView);
    } else {
      // other page
      hideFixButton();
    }
  }
}, 5000);

function hideFixButton() {
  if ($fixButton) {
    $fixButton.style.display = 'none';
  }
}

const WARNING_STYLE = 'rgba(255,0,0,0.2)';

function elementInParentWithClassName(el, className) {
  let cur = el;
  while (cur && cur.classList) {
    if (cur.classList.contains(className)) {
      return true;
    }
    cur = cur.parentNode;
  }
  return false;
}

function tryCheckInViewPage() {
  const diffIdSet = new Set();
  const $docRoot = document.getElementById('pm-body-wrapper');
  if (!$docRoot) {
    return;
  }

  if ($docRoot.__fixDiffIDChecked) {
    return;
  }

  $docRoot.__fixDiffIDChecked = true;

  const duplicatedDiffIds = new Set();
  Object.keys(ATTR_PREFIX).forEach(function(_attrKey) {
    const attrKey = toFileName(_attrKey);
    Array.from($docRoot.querySelectorAll(`[${attrKey}]`)).forEach(function(el) {
      // ignore elements in `.cloneHeaderBody`
      if (!elementInParentWithClassName(el, 'cloneHeaderBody')) {
        const diffId = el.getAttribute(attrKey);
        if (diffIdSet.has(diffId)) {
          duplicatedDiffIds.add(diffId);
        } else {
          diffIdSet.add(diffId);
        }
      }
    });
  });

  if (duplicatedDiffIds.size) {
    $docRoot.style.background = WARNING_STYLE;
    console.log('duplicatedDiffIds', duplicatedDiffIds);
  }
}

function toFileName(name) {
  return Array.prototype.map.call(name, function(letter) {
    if (letter.toLowerCase() !== letter) {
      return '-' + letter.toLowerCase();
    } else {
      return letter;
    }
  }).join('');
}
