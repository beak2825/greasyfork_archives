// ==UserScript==
// @name         findReact
// @version      1.0
// @description  Helper Fn
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*// @author       Toonidy
// @license      MIT
// ==/UserScript==

// Credit to Toonidy for this
function findReact(dom, traverseUp = 0) {
  const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"));
  const domFiber = dom[key];
  if (!domFiber) return null;

  const getCompFiber = (fiber) => {
    let parentFiber = fiber?.return;
    while (parentFiber && typeof parentFiber.type === "string") {
      parentFiber = parentFiber.return;
    }
    return parentFiber;
  };

  let compFiber = getCompFiber(domFiber);
  for (let i = 0; traverseUp && compFiber && i < traverseUp; i++) {
    compFiber = getCompFiber(compFiber);
  }
  return compFiber?.stateNode || null;
}
