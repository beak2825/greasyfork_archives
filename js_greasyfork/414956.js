// ==UserScript==
// @name         LowCodeEngine
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/414956/LowCodeEngine.user.js
// @updateURL https://update.greasyfork.org/scripts/414956/LowCodeEngine.meta.js
// ==/UserScript==
/* eslint-disable */

function safeGet(target, paths, defaultValue) {
  const safeGetRegex = /\[|(?:\]\[?)|\./g;
  if (typeof paths === 'string') {
    paths = paths.split(safeGetRegex).filter(p => !!p);
  }
  if (target) {
    const result = paths.some(p => {
      target = target[p];
      if (target === null || target === undefined) {
        return true;
      }
    });
    return result ? defaultValue : target;
  }
  return target;
}

const settedMap = {};
function defineProperty(name, descriptor) {
    if (window[name]) return;
    Object.defineProperty(window, name, descriptor);
}

function definePropertyWithGetter(name, path) {
    if (settedMap[name]) return;
    settedMap[name] = true;
    defineProperty(name, { get() { return safeGet(window, path); } });
}

(function() {
    'use strict';
    let tries = 0;
    const maxTries = 10;
    // if (window.RenderEngine) return;
    const iterId = setInterval(function() {
        if (tries++ >= maxTries) clearInterval(iterId);

        if (window.LeGao && window.LeGao.getContext && window.LeGao.getContext()) {
            clearInterval(iterId);
            const ctx = LeGao.getContext();
            window.$ctx = ctx;
            window.$schema = ctx.schema;
            window.$page = ctx.schema.pages && ctx.schema.pages[0];
            window.$utils = ctx.utils;
            window.$opts = window.$options = ctx.options;
            window.$this = ctx.__debugThis__;
            window.$get = fieldId => ctx.__debugThis__.$.call(window.$this, fieldId);
            window.$state = ctx.__debugThis__ && ctx.__debugThis__.state;
            window.$state$ = JSON.parse(JSON.stringify(window.$state || {}));
            window.$rawComponents = ctx.rawComponents;
            window.$components = ctx.components;
        }

        if (window.VisualEngine && VisualEngine.Pages) {
            definePropertyWithGetter('$curDoc', 'VisualEngine.Pages.currentDocument');
            definePropertyWithGetter('$rootNode', 'VisualEngine.Pages.currentDocument.rootNode');
            definePropertyWithGetter('$project', 'VisualEngine.Pages.currentDocument.project');
            definePropertyWithGetter('$designer', 'VisualEngine.Pages.currentDocument.project.designer');
            definePropertyWithGetter('$docs', 'VisualEngine.Pages.currentDocument.project.documents');
            definePropertyWithGetter('$docsMap', 'VisualEngine.Pages.currentDocument.project.documentsMap');
            definePropertyWithGetter('$nodes', 'VisualEngine.Pages.currentDocument.nodes');
            definePropertyWithGetter('$nodesMap', 'VisualEngine.Pages.currentDocument.nodesMap');
            window.$getNode = nodeId => {
                return nodeId ?
                    VisualEngine.Pages.currentDocument.nodesMap.get(nodeId) :
                    VisualEngine.Exchange.getSelected();
            }
        }
    }, 1000);
})();