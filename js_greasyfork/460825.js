// ==UserScript==
// @name         grafana-round-corner
// @namespace    https://github.com/leychan
// @version      0.1
// @description  grafana面板设置圆角,增加美观度
// @author       leychan
// @match        http://grafana.cvm.5i5j.com/d/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460825/grafana-round-corner.user.js
// @updateURL https://update.greasyfork.org/scripts/460825/grafana-round-corner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let count = 0
    let radius = '8px'

    document.addEventListener('DOMNodeInserted', function(event){
        let panels = document.getElementsByClassName('panel-container')
        if (panels.length != count) {
            for (let i = count; i < panels.length; i++) {
                panels[i].style.borderRadius=radius
                console.log(panels[i])

                let linkSection = panels[i].getElementsByClassName('panel-info-corner-inner')
                console.log(linkSection)
                for (let j = 0; j < linkSection.length; j++) {
                    linkSection[j].style.borderRadius=radius
                }
            }
            count = panels.length
        }

    }, false);

})();
