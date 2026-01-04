// ==UserScript==
// @name         [MTurk Worker] HIT Details Enhancer
// @namespace    https://github.com/Kadauchi
// @version      1.0.3
// @description  Changes the HIT Details link text to the requester name, changes the requester name inside the popup to a link that searches for their HITs and adds the remaining HIT count to the details bar.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/projects/*/tasks*
// @downloadURL https://update.greasyfork.org/scripts/36148/%5BMTurk%20Worker%5D%20HIT%20Details%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/36148/%5BMTurk%20Worker%5D%20HIT%20Details%20Enhancer.meta.js
// ==/UserScript==

function reactRequire(string) {
    const element = document.querySelector(`[data-react-class="require('${string}')['default']"]`);

    if (element) {
        try {
            const reactProps = JSON.parse(element.dataset.reactProps);
            return { element: element, reactProps: reactProps };
        }
        catch (error) {
            return false;
        }
    }
    return false;
}

(function() {
    const react = reactRequire(`reactComponents/common/ShowModal`);
    const react2 = reactRequire(`reactComponents/modal/MTurkWorkerModal`);

    const details = react.element.closest(`.project-detail-bar`).firstElementChild.lastElementChild.firstElementChild;

    react.element.firstChild.textContent = react.reactProps.modalOptions.requesterName;
    details.firstElementChild.className = `col-xs-4 text-xs-center col-md-4 text-md-center`;
    details.lastElementChild.className = `col-xs-4 text-xs-center col-md-4 text-md-right`;

    const available = document.createElement(`div`);
    available.className = `col-xs-4 text-xs-center col-md-4 text-md-center`;

    const availableLabel = document.createElement(`span`);
    availableLabel.className = `detail-bar-label`;
    availableLabel.textContent = `HITs: `;
    available.appendChild(availableLabel);

    const availableValue = document.createElement(`span`);
    availableValue.className = `detail-bar-value`;
    availableValue.textContent = react.reactProps.modalOptions.assignableHitsCount;
    available.appendChild(availableValue);

    details.insertBefore(available, details.lastElementChild);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const addedNode = mutation.addedNodes[0];

            if (addedNode.matches(`#modalProjectDetailsModal`) === true) {
                const requester = addedNode.querySelector(`[data-reactid=".8.0.0.1.0.0.1"]`);

                const link = document.createElement(`a`);
                link.href = `https://worker.mturk.com/requesters/${react.reactProps.modalOptions.contactRequesterUrl.match(/requesterId=(\w+)/)[1]}/projects`;
                link.target = `_blank`;
                link.textContent = react.reactProps.modalOptions.requesterName;

                requester.replaceWith(link);
            }
        });
    });

    observer.observe(react2.element, { childList: true });
})();