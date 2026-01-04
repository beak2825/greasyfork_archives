// ==UserScript==
// @name        tap.bio open links in new tab
// @namespace   Violentmonkey Scripts
// @match       https://tap.bio/*
// @grant       none
// @version     1.0
// @author      -
// @require https://unpkg.com/moduleraid@5.1.2/dist/moduleraid.umd.js
// @require https://unpkg.com/devtools-detect@3.0.1/index.js
// @description 3/24/2022, 6:49:54 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442050/tapbio%20open%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/442050/tapbio%20open%20links%20in%20new%20tab.meta.js
// ==/UserScript==

const win = unsafeWindow;

const sleep = (w = 100) => new Promise(r=>setTimeout(r, w));
const until = async (f, w) => { while (!f()) await sleep(w) };

// hook into React as early as possible
let reactRoot;
const h = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
if (win[h]) {
  const ocfr = win[h].onCommitFiberRoot.bind(win[h]);
  win[h].onCommitFiberRoot = (_, root) => {
    reactRoot = root;
    return ocfr(_, root);
  };
} else {
  const listeners={};
  win[h] = {
    inject: ()=>0,
    checkDCE: ()=>0,
    onCommitFiberRoot: (_, root) => reactRoot = root,
    onCommitFiberUnmount: ()=>0,
    supportsFiber: true,
    on: ()=>0,
    sub: ()=>0,
    renderers: [],
    emit: ()=>0
  };
}

function getPropsThatContain(name) {
  const getPropFromNode = node => {
    if (!node) return;
    const props = node.memoizedProps;
    if (props?.[name] !== undefined) return props;
    const siblingProp = getPropFromNode(node.sibling);
    if (siblingProp !== undefined) return siblingProp;
    const childProp = getPropFromNode(node.child);
    if (childProp !== undefined) return childProp;
  }
  return getPropFromNode(reactRoot?.current);
}

/** Magically obtain a prop value from the most top-level React component we can find */
function getProp(name) {
  return getPropsThatContain(name)?.[name];
}
/** Horribly mutate a name prop value on zero or more React components */
function setProp(name, value) {
  let props;
  while (props = getPropsThatContain(name)) {
    if (props[name] === value) return;
    props[name] = value;
  }
}

async function go() {
  await until(() => getProp('client')?.cache?.data?.data); // wait for apollo cached data
  
  const mR = new moduleraid({ entrypoint: "webpackJsonp@tap-bio/landing", debug: true }); // webpack modules. not used.
  
  const apolloData = getProp('client').cache.data.data;
  const arrayOfStuff = Object.values(apolloData);
  
  if (window.devtools.isOpen) {
    const exposed = { reactRoot, getProp, getPropsThatContain, setProp, mR, apolloData };
    console.log('tap.bio: DevTools open - exposing ', exposed);
    Object.assign(win, exposed);
  }
  
  // mR.findConstructor('styles__CtaButton')[0][0]()
  document.querySelectorAll(`button[class*="styles__CtaButton"`).forEach(elt=>elt.addEventListener('click', (event)=> {
    const title = elt.textContent;
    // assume optimistically that a link title is unique and is associated with only one URL
    const url = arrayOfStuff.find(obj => obj.title === title)?.url;
    if (url) {
      // prevent default click handling
      event.stopPropagation();
      // alternate click handling goes here.
      open(url, '_blank');
    }
  }, true))
}

win.addEventListener('load', go);
