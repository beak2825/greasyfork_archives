// ==UserScript==
// @name           Change fandom layout back to hydra
// @name:zh        Fandom新界面给我爬啊！
// @description    Change fandom layout back to old version, some may not work
// @description:zh 把fandom界面改回旧版本，部分站点可能无效
// @namespace      minc/fandom_to_hydra
// @version        0.1
// @author         Minc
// @author:zh      敏克
// @match          https://*.fandom.com/*
// @downloadURL https://update.greasyfork.org/scripts/431477/Change%20fandom%20layout%20back%20to%20hydra.user.js
// @updateURL https://update.greasyfork.org/scripts/431477/Change%20fandom%20layout%20back%20to%20hydra.meta.js
// ==/UserScript==

(function() {
    var foo = window.location.search
    if (!foo.match(/useskin=hydra/)) {
        if (!foo.match(/\?/)){
            foo = foo + '?useskin=hydra'
        }
        else{
            foo = foo + '&useskin=hydra'
        }
        window.location.search = foo;
        history.replaceState(null,null,foo)
    }
})();