// ==UserScript==
// @name         WME Closure Tab Enabler
// @description  Closure Tab Enabler
// @version      0.4
// @author       GuySpr
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @namespace    https://greasyfork.org/en/scripts/40085-wme-closure-tab-enabler
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40085/WME%20Closure%20Tab%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/40085/WME%20Closure%20Tab%20Enabler.meta.js
// ==/UserScript==

(function () {
    var counter = 0;
    var interval = 1;

    function bootstrapper() {
        var oWaze = W;
        if (typeof oWaze.selectionManager === "undefined") {
            setTimeout(bootstrapper, 500);
            return;
        }
        W.selectionManager.events.register("selectionchanged", null, enableClosureTab);
    }

    function enableClosureTab() {
        var noClosureTab = document.querySelectorAll("a[href='#segment-edit-closures']").length == 0;
        // no closure tab, probably disabled
        if(noClosureTab && W.selectionManager.selectedItems.length > 0 && W.selectionManager.selectedItems[0].model.type === 'segment'){
            var userTabs = document.getElementById('edit-panel');
            if (!(userTabs && getElementsByClassName('nav-tabs', userTabs))){
                return;
            }

            var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
            if (typeof navTabs !== "undefined") {
                if (!getElementsByClassName('tab-content', userTabs)){
                    return;
                }
                for(var i = 0; i < navTabs.children.length; i++){
                    var tabA = navTabs.children[i].children[0];
                    var disabled = tabA.hasAttribute('disabled');
                    var isTextClosure = I18n.translations[I18n.locale].edit.segment.tabs.closures == tabA.innerText;
                    if(disabled && isTextClosure){
                        tabA.removeAttribute('disabled');
                        tabA.setAttribute('href', '#segment-edit-closures');
                        tabA.setAttribute('data-toggle', 'tab');
                        return;
                    }
                }
            }
        }
    }

    function getElementsByClassName(classname, node) {
        if (!node)
            node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className)) a.push(els[i]);
        return a;
    }

    bootstrapper();
})();