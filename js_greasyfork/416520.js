// ==UserScript==
// @name             Clickable domain in Google search results
// @description      Ever wanted to get at the main page of the sought-for website right from the Google search results? Now you can
//
// @name:ru          Кликабельный домен в результатах поиска Google
// @description:ru   Иногда хочется перейти на главную страницу искомого сайта прямо из результатов поиска Google? Теперь можно
//
// @version          1.0.3
// @author           Konf
// @namespace        https://greasyfork.org/users/424058
// @compatible       Chrome
// @compatible       Opera
// @compatible       Firefox
// @icon             https://t1.gstatic.com/faviconV2?client=SOCIAL&url=http://google.com&size=32
// @include          /^http(s|):\/\/(www\.|)google\.(com|net|de|ru|co\.uk)\/search\?.*$/
// @run-at           document-end
// @grant            none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/416520/Clickable%20domain%20in%20Google%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/416520/Clickable%20domain%20in%20Google%20search%20results.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
  'use strict';

  const supposedTargets = Array.prototype.slice.call(
    document.querySelectorAll('cite')
  );

  // find a combo of classes that is most repeated
  const targetClasses = (function() {
    const measureObj = {};
    const biggest = { className: '', count: 0 };

    supposedTargets.forEach((el, id) => {
      const count = measureObj[el.className] || 0;

      measureObj[el.className] = count + 1;
    });

    for (const className in measureObj) {
      const count = measureObj[className];

      if (count === biggest.count) throwError();

      if (count > biggest.count) {
        biggest.count = count;
        biggest.className = className;
      }
    }

    if (!biggest.className) throwError();

    return biggest.className;
  }());

  const filteredTargets = supposedTargets.filter(
    el => el.className === targetClasses
  );

  const pairedTargets = [];
  let previousNode = null;

  for (let i = 0; i < filteredTargets.length; i++) {
    const currentNode = filteredTargets[i];

    if (previousNode === null) {
      previousNode = currentNode;
      continue;
    }

    if (
      previousNode.innerHTML === currentNode.innerHTML
    ) {
      pairedTargets.push([previousNode, currentNode]);
      previousNode = null;
    } else {
      previousNode = currentNode;
    }
  }

  if (pairedTargets.length === 0) return;

  const sortedTargets = { type1: [], type2: [] };

  pairedTargets.forEach((el, id) => {
    sortedTargets.type1.push(el[0]);
    sortedTargets.type2.push({ caption: el[1] });
  });

  (function() {
    const keyParentNode = sortedTargets.type2[0].caption.parentNode.parentNode;
    const visibility = findComputedStyle(keyParentNode, 'visibility');

    if (visibility !== 'hidden') throwError();
  }());

  sortedTargets.type1.forEach((el, id) => {
    const link = findNodeFromChild(el, 'a[ping]', 3);

    if (!link) return;

    el.style.display = 'none';
    sortedTargets.type2[id].link = link;
  });

  sortedTargets.type2.forEach(el => {
    el.caption.parentNode.parentNode.style.visibility = 'visible';
  });

  for (const obj of sortedTargets.type2) {
    if (!obj.link) continue;

    const url = new URL(obj.link.href);
    const captionHost = obj.caption.innerText.split('›')[0].trim();
    const newLink = `
      <a href="${url.origin}">${captionHost}</a>
    `;

    obj.caption.innerHTML = obj.caption.innerHTML.replace(captionHost, newLink);
  }


  // utils -----------------------------------------------------

  function camelize(str) {
    return str.replace(/-(\w)/g, function(str, letter){
      return letter.toUpperCase();
    });
  }

  function findComputedStyle(el, prop) {
    const dV = document.defaultView;

    if (el.currentStyle) {
      return el.currentStyle[camelize(prop)];
    } else if (dV && dV.getComputedStyle) {
      return dV.getComputedStyle(el, null).getPropertyValue(prop);
    } else {
      return el.style[camelize(prop)];
    }
  }

  function findNodeFromChild(child, query, depth) {
    let testNode = child.parentNode;
    let counter = 1;

    while (testNode && depth !== counter++) {
      if (testNode.matches(query)) return testNode;

      testNode = testNode.parentNode;
    }
  }

  function throwError() {
    throw new Error(
      'Google breadcrumbs script error: ' +
      'Google has changed pages layout'
    );
  }

  // -----------------------------------------------------------
})();
