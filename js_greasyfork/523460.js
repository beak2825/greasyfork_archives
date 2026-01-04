// ==UserScript==
// @name         YouTube Comments Toggle Button
// @namespace    https://example.com/youtube-comments-toggle
// @version      1.5
// @description  Add a toggle button for YouTube comments with a comments icon.
// @match        *://*.youtube.com/*
// @match        *://m.youtube.com/*
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523460/YouTube%20Comments%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/523460/YouTube%20Comments%20Toggle%20Button.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const commentsSelector = 'ytm-single-column-watch-next-results-renderer .single-column-watch-next-modern-panels ytm-comments-entry-point-header-renderer.modern-styling';
  var trytohide = true;
  function toggleComments() {
    const comments = document.querySelector(commentsSelector);
    if (comments) {
      const isHidden = comments.style.display === 'none';
      comments.style.display = isHidden ? '' : 'none';
      console.log(`Comments are now ${isHidden ? 'visible' : 'hidden'}.`);
      if (isHidden) {
        document.querySelector('#toggleButton1').style.backgroundColor = '#f2f1f0';
        document.querySelector('#toggleButton1').style.color = 'black';
      } else {
        document.querySelector('#toggleButton1').style.backgroundColor = 'black';
        document.querySelector('#toggleButton1').style.color = '#f2f1f0';
      }
    }
  }

  const htmlPolicy = window.trustedTypes?.createPolicy('default', {
    createHTML: (html) => html,
  });

  function addButtonToInterface() {
    if (document.querySelector('#comments-toggle-button')) return;

    const buttonViewModel = document.createElement('button-view-model');
    buttonViewModel.id = 'comments-toggle-button';
    buttonViewModel.className = 'yt-spec-button-view-model slim_video_action_bar_renderer_button';

    const buttonHTML = `
            <yt-button-shape class="yt-spec-button-shape-next__button-shape-wiz-class" >
                <button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading" id='toggleButton1'>
                    <div class="yt-spec-button-shape-next__icon">
                        <c3-icon style="width: 24px; height: 24px;">
                            <span class="yt-icon-shape yt-spec-icon-shape">
                                <div style="width: 100%; height: 100%; display: block; fill: currentcolor; padding:3px">
                                    <!-- Comments Icon SVG -->
                                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.86 122.88" width="20" height="20">
  <title>comment</title>
  <path d="M30.28,110.09,49.37,91.78A3.84,3.84,0,0,1,52,90.72h60a2.15,2.15,0,0,0,2.16-2.16V9.82a2.16,2.16,0,0,0-.64-1.52A2.19,2.19,0,0,0,112,7.66H9.82A2.24,2.24,0,0,0,7.65,9.82V88.55a2.19,2.19,0,0,0,2.17,2.16H26.46a3.83,3.83,0,0,1,3.82,3.83v15.55ZM28.45,63.56a3.83,3.83,0,1,1,0-7.66h53a3.83,3.83,0,0,1,0,7.66Zm0-24.86a3.83,3.83,0,1,1,0-7.65h65a3.83,3.83,0,0,1,0,7.65ZM53.54,98.36,29.27,121.64a3.82,3.82,0,0,1-6.64-2.59V98.36H9.82A9.87,9.87,0,0,1,0,88.55V9.82A9.9,9.9,0,0,1,9.82,0H112a9.87,9.87,0,0,1,9.82,9.82V88.55A9.85,9.85,0,0,1,112,98.36Z"/>
</svg>
                                </div>
                            </span>
                        </c3-icon>
                    </div>
                    <div class="yt-spec-button-shape-next__button-text-content">Comments</div>
                    <yt-touch-feedback-shape>
                        <div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                        </div>
                    </yt-touch-feedback-shape>
                </button>
            </yt-button-shape>
        `;

    buttonViewModel.innerHTML = htmlPolicy ? htmlPolicy.createHTML(buttonHTML) : buttonHTML;

    buttonViewModel.addEventListener('click', toggleComments);

    const targetContainer = document.querySelector('.slim-video-action-bar-actions');
    if (targetContainer) {
      const firstButton = targetContainer.children[0];
      if (firstButton) {
        targetContainer.insertBefore(buttonViewModel, firstButton.nextSibling);
      } else {
        targetContainer.appendChild(buttonViewModel);
      }
      console.log('Toggle button added as the second button.');
    } else {
      console.warn('Target container not found.');
    }
  }

  const observer = new MutationObserver(() => {
    addButtonToInterface();
    const comments = document.querySelector(commentsSelector);
    comments.style.display = 'none';
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(()=>{trytohide = false}, 8000)
  addButtonToInterface();
})();