// ==UserScript==
// @name        语雀标签（状态）小工具 - yuque.com
// @namespace   Violentmonkey Scripts
// @match       https://www.yuque.com/*/*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/12/19 03:46:53
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456833/%E8%AF%AD%E9%9B%80%E6%A0%87%E7%AD%BE%EF%BC%88%E7%8A%B6%E6%80%81%EF%BC%89%E5%B0%8F%E5%B7%A5%E5%85%B7%20-%20yuquecom.user.js
// @updateURL https://update.greasyfork.org/scripts/456833/%E8%AF%AD%E9%9B%80%E6%A0%87%E7%AD%BE%EF%BC%88%E7%8A%B6%E6%80%81%EF%BC%89%E5%B0%8F%E5%B7%A5%E5%85%B7%20-%20yuquecom.meta.js
// ==/UserScript==

(function a(startTime, lastELCount) {
    'use strict';

    startTime = startTime || Date.now();
    lastELCount = lastELCount || 0;
    if (Date.now() - startTime > 10000) {
        return;
    }
    // let thisElCount = document.querySelectorAll('*')?.length || 0;
    // if (thisElCount !== lastELCount || Date.now() - startTime > 10000) {
    //     setTimeout(a, 300, startTime, thisElCount);
    //     return;
    // }
    let $main = document.querySelector('#main') || document.getElementById('lark-text-editor');
    if (!$main) {
        setTimeout(a, 300, startTime);
        return;
    }

    document.getElementById('wl-yq-label-panel')?.remove();

    let div = document.createElement('div', {});
    div.id = 'wl-yq-label-panel'
    div.innerHTML = `
<style>
#wl-yq-label-panel {
    position: fixed;
    top: 68px;
    right: 20px;
    max-height: calc(100% - 100px);
    width: 200px;
    box-shadow: 0 0 5px -1px #cccccc;
    border-radius: 5px;
    padding: 10px;
    z-index: 1000;
    overflow: auto;
    opacity: 0;
    transition: opacity 0.5s;
}

.wl-drag {
    position: absolute;
    width: 100%;
    height: 10px;
    left: 0;
    top: 0;
    cursor: move;
}
.no-select {
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    /*-khtml-user-select:none; !*早期浏览器*!*/
    user-select:none;
}
.wl-animate {
    transition: left 1s, top 1s !important;
}
.wl-choose-label {
    outline: 1px solid #ac6363;
}

.wl-label-item {
    text-overflow: ellipsis;
    OVERFLOW: hidden;
    word-break: keep-all;
    white-space: nowrap;
}
</style>

<div class="wl-drag"></div>

<!--<p> 标签1..... </p>-->
<!--<p> 标签1..... </p>-->
<!--<p> 标签1..... </p>-->
<!--<p> 标签1..... </p>-->
<!--<p> 标签1..... </p>-->
<div class="wl-label-content"></div>
`
    document.body.append(div);

    let mousedownOffsetX, mousedownOffsetY;
    let $wlYqLabelPanel = document.getElementById('wl-yq-label-panel');
    document.getElementsByClassName('wl-drag')[0].addEventListener('mousedown', function (e) {
        document.body.setAttribute('class', document.body.getAttribute('class') + ' no-select');
        mousedownOffsetX = e.offsetX;
        mousedownOffsetY = e.offsetY;
        document.addEventListener('mousemove', wlMousemoveFun);
    });

    function wlMousemoveFun(e) {
        $wlYqLabelPanel.style.left = (e.x - mousedownOffsetX) + 'px';
        $wlYqLabelPanel.style.top = (e.y - mousedownOffsetY) + 'px';
    }

    document.addEventListener('mouseup', e => {
        document.body.setAttribute('class', document.body.getAttribute('class').replace('no-select', ''));
        document.removeEventListener('mousemove', wlMousemoveFun);
        if (parseInt($wlYqLabelPanel.style.left.replace('px', '')) < 20
            || parseInt($wlYqLabelPanel.style.top.replace('px', '')) < 20
            || parseInt($wlYqLabelPanel.style.left.replace('px', '')) > document.body.clientWidth - 200 - 20
            || parseInt($wlYqLabelPanel.style.top.replace('px', '')) > document.body.clientHeight - $wlYqLabelPanel.clientHeight - 20) {
            $wlYqLabelPanel.setAttribute('class', ($wlYqLabelPanel.getAttribute('class') || '') + ' wl-animate');
            if (parseInt($wlYqLabelPanel.style.left.replace('px', '')) < 20) {
                $wlYqLabelPanel.style.left = '20px';
            }
            if (parseInt($wlYqLabelPanel.style.top.replace('px', '')) < 20) {
                $wlYqLabelPanel.style.top = '20px';
            }
            if (parseInt($wlYqLabelPanel.style.left.replace('px', '')) > document.body.clientWidth - 200 - 20) {
                $wlYqLabelPanel.style.left = document.body.clientWidth - 200 - 20 + 'px';
            }
            if (parseInt($wlYqLabelPanel.style.top.replace('px', '')) > document.body.clientHeight - $wlYqLabelPanel.clientHeight - 20) {
                $wlYqLabelPanel.style.top = document.body.clientHeight - $wlYqLabelPanel.clientHeight - 20 + 'px';
            }
            setTimeout(() => $wlYqLabelPanel.setAttribute('class', $wlYqLabelPanel.getAttribute('class').replace('wl-animate', '')), 1000);
        }
    });

    let $labelContent = document.getElementsByClassName('wl-label-content')[0];
    function refreshLabels(a) {
        $wlYqLabelPanel.style.opacity = '0';
        setTimeout(refreshLabelsDo, 500)
    }
    function refreshLabelsDo() {
        let $labels = [...document.querySelectorAll('[class="article-content"] [data-card-name="label"], #lark-text-editor [data-card-name="label"]')];
        $labels.sort((a, b) => {
            let sor = a.childNodes[0].childNodes[0].childNodes[0].getAttribute('class') > b.childNodes[0].childNodes[0].childNodes[0].getAttribute('class') ? 1
                : a.childNodes[0].childNodes[0].childNodes[0].getAttribute('class') < b.childNodes[0].childNodes[0].childNodes[0].getAttribute('class') ? -1 : 0;
            if (sor !== 0) return sor;
            return a.innerText > b.innerText ? 1 : a.innerText < b.innerText ? -1 : 0;
        })
        let content = ``;
        for (let $label of $labels) {
            let labelContent = ($label?.nextElementSibling?.innerText || '') + ($label?.nextElementSibling?.nextElementSibling?.innerText || '') + ($label?.nextElementSibling?.nextElementSibling?.nextElementSibling?.innerText || '');
            content += `
                <div id="${$label.id}" class="wl-label-item"><a href="#${$label.id}"><object><div style="display: inline-block">${$label.outerHTML}</div><span>${labelContent}</span></object></a></div>
            `;
        }
        $labelContent.innerHTML = content;
        setTimeout(()=>$wlYqLabelPanel.style.opacity = '1', 300);
    }
    $labelContent.addEventListener('mouseover', function (e) {
        let $e = e.target;
        while (true) {
            if ($e.classList.contains('wl-label-item')) {
                break;
            }
            $e = $e.parentElement;
            if ($e == null) return;
        }

        for (let $label of document.querySelectorAll('#' + $e.id)) {
            if (($label.getAttribute('class') || '').indexOf('wl-label-item') > -1) {
                $label.setAttribute('class', $label.getAttribute('class') + ' wl-choose-label');
            } else {
                $label.parentElement.setAttribute('class', $label.parentElement.getAttribute('class') + ' wl-choose-label');
            }
        }
    })
    $labelContent.addEventListener('mouseout', function (e) {
        for (let $label of document.querySelectorAll('.wl-choose-label')) {
            $label.setAttribute('class', $label.getAttribute('class').replace('wl-choose-label', ''));
        }
    })
    // refreshLabels();

    // let lastRefReshLabelsTime;
    let lastElCount = 0;
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let observer = new MutationObserver( (mutationList) => {
        // console.log(mutationList)
        let thisELCount = (document.querySelectorAll('[class="article-content"] [data-card-name="label"], #lark-text-editor [data-card-name="label"]')?.length || 0);
        if (lastElCount === thisELCount) return;
        lastElCount = thisELCount || 0;
        refreshLabels();
    })
    observer.observe($main, {
        // attributes: true,
        // attributeFilter: ['class'],
        // attributeOldValue: true,
        subtree: true,
        childList: true
    })

    let $focusTag = null;
    document.body.addEventListener('focus', function (e) {
        // console.log(e)
        let $e = e.target;
        while (true) {
            if ($e.getAttribute('ne-role') === 'render-unit') {
                break;
            }
            $e = $e.parentElement;
            if ($e == null) return;
        }
        $focusTag = $el.querySelector('[data-card-name="label"]');
    });
    document.body.addEventListener('keyup', function (e) {
        let $e = document.getSelection().focusNode;
        while (true) {
            if (($e.getAttribute && $e.getAttribute('ne-role')) === 'render-unit') {
                break;
            }
            $e = $e.parentElement;
            if ($e == null) return;
        }
        if ($e.querySelector('[data-card-name="label"]')) refreshLabels();
    })


})();