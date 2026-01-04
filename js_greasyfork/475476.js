// ==UserScript==
// @name         Twitter Engagement Button
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  ツイートの下にエンゲージメント画面に飛ぶリンクを追加します｡結構自分用｡
// @author       sambaquiz
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://pbs.twimg.com/media/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475476/Twitter%20Engagement%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/475476/Twitter%20Engagement%20Button.meta.js
// ==/UserScript==

const EB = (function() {
    'use strict';

    return {
        inject: function (article) {
            if (article.getAttribute('data-testid') === 'tweet') {
                let wrapper = document.createElement('div');
                wrapper.style.marginTop = '15px';
                wrapper.style.display = 'flex';

                const username = article.querySelector('a[href*="/status/"]').href.split('/')[3];
                const statusId = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();

                {
                    let engagementButtonDiv = document.createElement('div');
                    engagementButtonDiv.style.marginRight = '30px';
                    let engagementButton = document.createElement('a');
                    engagementButton.className = 'engagementButton r-a023e6 css-18t94o4';
                    engagementButton.href = `/${username}/status/${statusId}/quotes`;
                    engagementButton.target= '_blank';
                    engagementButton.style.color = 'inherit';
                    engagementButton.style.textDecoration = 'none';
                    engagementButton.addEventListener('mouseover', function() {
                        this.style.textDecoration = 'underline';
                    });
                    engagementButton.addEventListener('mouseout', function() {
                        this.style.textDecoration = 'none';
                    });
                    engagementButton.style.marginLeft = '5px';
                    engagementButton.textContent = `Quote`;

                    let svg = document.createElement('svg');
                    svg.style.float = 'left';
                    svg.innerHTML = `
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="r-18jsvk2 r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr">
                        <g>
                            <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
                        </g>
                    </svg>
                    `;
                    engagementButton.appendChild(svg);
                    engagementButtonDiv.appendChild(engagementButton);
                    wrapper.appendChild(engagementButtonDiv);
                }
                {
                    let retweetEngagementButtonDiv = document.createElement('div');
                    retweetEngagementButtonDiv.style.marginRight = '30px';
                    let retweetEngagementButton = document.createElement('a');
                    retweetEngagementButton.className = 'engagementButton r-a023e6 css-18t94o4';
                    retweetEngagementButton.href = `/${username}/status/${statusId}/retweets`;
                    retweetEngagementButton.target= '_blank';
                    retweetEngagementButton.style.color = 'inherit';
                    retweetEngagementButton.style.textDecoration = 'none';
                    retweetEngagementButton.addEventListener('mouseover', function() {
                        this.style.textDecoration = 'underline';
                    });
                    retweetEngagementButton.addEventListener('mouseout', function() {
                        this.style.textDecoration = 'none';
                    });
                    retweetEngagementButton.style.marginLeft = '5px';
                    retweetEngagementButton.textContent = `RT`;

                    let svg = document.createElement('svg');
                    svg.style.float = 'left';
                    svg.innerHTML = `
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="r-18jsvk2 r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr">
                        <g>
                            <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
                        </g>
                    </svg>
                    `;
                    retweetEngagementButton.appendChild(svg);
                    retweetEngagementButtonDiv.appendChild(retweetEngagementButton);
                    wrapper.appendChild(retweetEngagementButtonDiv);
                }
                {
                    let likesEngagementButtonDiv = document.createElement('div');
                    likesEngagementButtonDiv.style.marginRight = '30px';
                    let likesEngagementButton = document.createElement('a');
                    likesEngagementButton.className = 'engagementButton r-a023e6 css-18t94o4';
                    likesEngagementButton.href = `/${username}/status/${statusId}/likes`;
                    likesEngagementButton.target= '_blank';
                    likesEngagementButton.style.color = 'inherit';
                    likesEngagementButton.style.textDecoration = 'none';
                    likesEngagementButton.addEventListener('mouseover', function() {
                        this.style.textDecoration = 'underline';
                    });
                    likesEngagementButton.addEventListener('mouseout', function() {
                        this.style.textDecoration = 'none';
                    });
                    likesEngagementButton.style.marginLeft = '5px';
                    likesEngagementButton.textContent = `Like`;

                    let svg = document.createElement('svg');
                    svg.style.float = 'left';
                    svg.innerHTML = `
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="r-18jsvk2 r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-lrvibr">
                        <g>
                            <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
                        </g>
                    </svg>
                    `;
                    likesEngagementButton.appendChild(svg);
                    likesEngagementButtonDiv.appendChild(likesEngagementButton);
                    wrapper.appendChild(likesEngagementButtonDiv);
                }

                const element = article.querySelector('div[data-testid="reply"]');
                element.parentElement.parentElement.parentElement.appendChild(wrapper);

            }

            article.dataset.EBinjected = 'true';
        }
    }
})();

(function () {
  const callback = ms => ms.forEach(m => m.addedNodes.forEach(node => {
    const article = node.tagName == 'ARTICLE' && node || node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article'));
    if (article && !article.dataset.EBinjected) EB.inject(article);
  }));

  const observer = new MutationObserver(callback)
  observer.observe(document.body, {childList: true, subtree: true});
})();