// ==UserScript==
// @name         BBNews测试专用
// @namespace    https://bbnews.app
// @version      0.1
// @description  Test BBNews!
// @author       Jermic
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461104/BBNews%E6%B5%8B%E8%AF%95%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461104/BBNews%E6%B5%8B%E8%AF%95%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==



function execADBlockJS() {
    var removeSelectors = [





    ];
    for (var removeSelector of removeSelectors) {
        var removeEles = document.querySelectorAll(removeSelector);
        if (removeEles.length == 0) {
            continue
        }
        for (var removeEle of removeEles) {
            try {
                removeEle.parentNode.removeChild(removeEle)
            } catch (e) {console.log(e);}
        }
    }
    var clickSelectors = [

    ];
    for (var clickSelector of clickSelectors) {
        var clickEles = document.querySelectorAll(clickSelector);
        if (clickEles.length == 0) {
            continue
        }
        for (var clickEle of clickEles) {
            try {
                clickEle.click()
            } catch (e) {console.log(e);}
        }
    }
}
document.addEventListener('DOMContentLoaded', execADBlockJS);
//document.addEventListener('DOMSubtreeModified', execADBlockJS);
window.addEventListener('load',execADBlockJS);
execADBlockJS();
