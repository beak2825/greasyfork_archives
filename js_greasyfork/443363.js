// ==UserScript==
// @name         Gitlab Jobs Auto-width
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Redesigns Gitlab Pipeline UI So that Jobs are wide enough to see their full names.
// @author       mkielar
// @license      MIT
// @match        https://gitlab.com/*/-/pipelines/*
// @match        http://gitlab-k8s-new.bbp777.games/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443363/Gitlab%20Jobs%20Auto-width.user.js
// @updateURL https://update.greasyfork.org/scripts/443363/Gitlab%20Jobs%20Auto-width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`
      .gl-w-full {
        width: unset !important;
      }
      .gl-w-13 {
        width: unset !important;
        margin-right: 8px;
      }
      span[data-testid="downstream-pipeline-label"]:nth-child(1) {
        margin-left: 22px;
      }
      span[data-testid="downstream-pipeline-label"]:not(:nth-child(1)) {
        margin-left: 2px;
      }
      button[data-qa-selector="expand_pipeline_button"] {
        right: -33px !important;
        top: -1px;
        bottom: -1px;
        border: 1px solid #dbdbdb !important;
      }
      div[data-qa-selector="child_pipeline"] {
        margin-right: 32px;
      }
      .ci-job-component, .ci-job-dropdown-container {
        margin-left: 40px;
      }
      .scrollable-menu .ci-job-component {
         margin-left: 30px;
      }
      button.dropdown-menu-toggle {
        width: unset !important
      }
      button.dropdown-menu-toggle div[data-qa-selector="job_item_container"] {
        margin-left: 0px;
      }

      .big-pipeline-graph-dropdown-menu {
        width: unset !important;
        max-width: unset !important;
      }
      .gl-ci-action-icon-container {
        left: 5px;
      }
      .gl-pipeline-job-width {
        width: auto !important;
        align-self: flex-start !important;
      }
      .mw-70p {
        max-width: unset !important;
        margin-right: 4px !important;
      }
      .gl-display-inline-block {
	    max-width: unset !important;
      }
      .gl-w-70p {
        width: 100% !important;
      }

      button.dropdown-menu-toggle > div > div:not(:first-child) {
        margin-left: 4px;
        background-color: #f0f0f0;
        min-width: 24px;
        min-height: 24px;
        text-align: center;
        border-radius: 100%
      }
      button.dropdown-menu-toggle > div > div:not(:first-child):hover {
        background-color: black;
        color: white;
      }
      div[data-testid="stage-column-title"] div {
        margin-left: 40px;
        text-transform: lowercase !important;
      }
      .stage-name {
        text-transform: lowercase !important;
      }
      div.js-pipeline-graph > div {
        scroll-behavior: smooth
      }
      .gl-button.gl-button.btn-default .gl-icon, .gl-button.gl-button.btn-block.btn-default .gl-icon {
        color: #666;
        top: 0px;
      }
    `);

    function scrollToFirstUnfinished() {

        // The DIV with Scrollbar is actually first child of the 'js-pipeline-graph' DIV.
        let pipelineGraphContainer = document.getElementsByClassName("js-pipeline-graph")[0].firstChild

        // Find first element which is marked as failed or in-progress, otherwise find first that's created, then skipped.
        let target = pipelineGraphContainer.querySelector('[data-testid="status_running-icon"]')
                     || pipelineGraphContainer.querySelector('[data-testid="status_pending-icon"]')
                     || pipelineGraphContainer.querySelector('[data-testid="status_failed-icon"]')
                     || pipelineGraphContainer.querySelector('[data-testid="status_created-icon"]')
                     || pipelineGraphContainer.querySelector('[data-testid="status_skipped-icon"]')

        if (target) {
            let targetRect = target.getBoundingClientRect()
            let pipelineGraphContainerRect = pipelineGraphContainer.getBoundingClientRect()

            // Make sure we're scrolled vertically
            target.scrollIntoView({behavior: "smooth", block: "end", inline: "end"})

            var isTargetVisible = (targetRect.left >= pipelineGraphContainerRect.left)
                                  && (targetRect.left <= pipelineGraphContainerRect.left + pipelineGraphContainer.clientHeight);

           if (!isTargetVisible) {
             // Scroll the pipelilne container horizontally
             pipelineGraphContainer.scrollLeft = (targetRect.left + pipelineGraphContainer.scrollLeft) - pipelineGraphContainerRect.left - 48 - 16
           }
        }
    }

    const waitFor = (parent, ...selectors) => new Promise(resolve => {
        const delay = 500
        const f = () => {
            const elements = selectors.map(selector => parent.querySelector(selector))
            if (elements.some(element => element != null)) {
                resolve(elements)
            } else {
                setTimeout(f, delay)
            }
        }
        f()
    })

    waitFor(document, '.js-pipeline-graph').then(([pipelineGraph]) => {
        waitFor(pipelineGraph, '[data-testid="status_running-icon"]', '[data-testid="status_pending-icon"]', '[data-testid="status_failed-icon"]', '[data-testid="status_created-icon"]', '[data-testid="status_skipped-icon"]').then(() => {
            scrollToFirstUnfinished()
        })
   })
    // Full width pipeline
    $('head').append('<style type="text/css"> .container-limited { max-width: 100%!important; } </style>')
    // Do not crop names
    $('head').append('<style type="text/css"> .pipeline-graph .build { width: auto!important; } .ci-status-text { max-width: 100%; margin-right: 35px } </style>')
    // Hide tooltips
    $('head').append('<style type="text/css"> .bs-tooltip-bottom { display: none; } </style>')
})();