// ==UserScript==
// @name         Gerrit Relation Chain
// @version      0.0.5
// @author       yupnano(https://github.com/yupnano)
// @description  Add CR Label on Relation Chain
// @description:zh-CN Relation chain 显示 review 状态
// @license      MIT
// @include      https://gerrit*/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwXHfuMiyPYhXPv2J5H1gkRAvoZvLcjrBKTigr2e_X8A&s
// @grant        none
// @namespace https://greasyfork.org/users/1115435
// @downloadURL https://update.greasyfork.org/scripts/515918/Gerrit%20Relation%20Chain.user.js
// @updateURL https://update.greasyfork.org/scripts/515918/Gerrit%20Relation%20Chain.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interval;

    function addCrLabelsOnRelationChain() {
        // console.log('start addCrLabelsOnRelationChain');

        var grChangeViewElement = document.getElementById('app')?.shadowRoot
             ?.getElementById('app-element')?.shadowRoot
             ?.querySelector('main')
             ?.querySelector('gr-change-view');

        var relationChainSection = grChangeViewElement?.shadowRoot
        ?.querySelector('gr-related-changes-list')?.shadowRoot
        ?.querySelector('gr-endpoint-decorator')
        ?.getElementsByClassName('relatedChanges')[0]

        var relatedChanges = relationChainSection?.getElementsByClassName('changeContainer');

        if (!relatedChanges || relatedChanges.length === 0) {
             console.log('relatedChanges element not exist!');
             return;
        }

        //clearInterval(interval);
        if (hasProcessed(relatedChanges[0])) {
            // console.log('has processed');
            return;
        }

        const host = window.location.host;

        for (let index=0; index < relatedChanges.length; index++) {
            let changeLink = relatedChanges[index].querySelector('a');
            let changeId = changeLink.href.split('/+/')[1].split('/')[0];
            fetch(`https://${host}/changes/${changeId}/detail`, {credentials: "include"})
                .then(res => res.text())
                .then(res => JSON.parse(res.substring(res.indexOf('\'') + 1).replaceAll('\n', ' ')))
                .then(res => {
                    const codeReviews =res.labels['Code-Review'].all;
                    const verifieds = res.labels['Verified'].all;
                    const allCodeReviews = verifieds.concat(codeReviews);
                    return allCodeReviews.reverse().map(cr => cr.value).filter(value => !!value);
                })
                .then(values => values.forEach(value => appendCrLableElement(changeLink, value)));
        }

        markProcessed(relatedChanges[0]);
        console.log('addCrLabelsOnRelationChain finished');
    }

    function markProcessed(element) {
        var blankElement = document.createElement('div');
        blankElement.className = 'addCrLabelsOnRelationChain-marked';
        element.appendChild(blankElement);
    }

    function hasProcessed(element) {
        return element?.getElementsByClassName('addCrLabelsOnRelationChain-marked')?.length > 0;
    }

    function appendCrLableElement(changeLink, value) {
        var crLable = document.createElement("span");
        crLable.innerHTML =`
        <span style="color: ${value > 0 ? 'green' : 'red'};">
           &nbsp;${value > 0 ? '+' : '-'}${value}
        </span>
        `;
        changeLink.insertAdjacentElement('afterend', crLable);
    }

    window.addEventListener('load', function () {
        // interval = setInterval(addCrLabelsOnRelationChain, 200)
    })

    document.addEventListener('timing-report', (e) => {
        if(event.detail.name?.includes('ChangeFullyLoaded')) {
          addCrLabelsOnRelationChain();
        }
    });


})();