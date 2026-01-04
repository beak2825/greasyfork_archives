// ==UserScript==
// @name         MAL Redesigned Reviews
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Modernizes MAL reviews, giving it a major design overhaul and adding new functionality.
// @author       SomeNewGuy
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/reviews/*
// @match        https://myanimelist.net/profile/*/reviews
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466879/MAL%20Redesigned%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/466879/MAL%20Redesigned%20Reviews.meta.js
// ==/UserScript==

(() => {

  const selectorsToRemove = [
    '.tag.well-written.btn-label.js-btn-label',
    '.tag.informative.btn-label.js-btn-label',
    '.tag.creative.btn-label.js-btn-label',
    '.tag.confusing.btn-label.js-btn-label',
    '.btn-showall.js-btn-showall',
    '.tag.funny',
    '.tag.funny.btn-label.js-btn-label',
    '.open'
  ];

  const removeElements = () => {
    selectorsToRemove.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => element.remove());
    });
  };

const generateScore = rating => {
  const scoreDiv = document.createElement('div');
  scoreDiv.className = 'floatRightHeader';
  const ratingText = document.createElement('span');
  ratingText.textContent = "Reviewer's Rating: ";
  const ratingNumElement = document.createElement('span');
  ratingNumElement.className = 'rating-num';
  ratingNumElement.textContent = rating;
  scoreDiv.append(ratingText, ratingNumElement);

  const htmlElement = document.documentElement;
  const isDarkMode = htmlElement.classList.contains('appearance-dark', 'dark-mode');
  if (isDarkMode) {
    ratingText.style.color = '#9fbdff';
    ratingNumElement.style.color = '#d0d0d0';
  } else {
    ratingText.style.color = '#26448f';
    ratingNumElement.style.color = 'rgb(45 43 43)';
  }

  ratingText.style.fontWeight = 'bold';
  ratingNumElement.style.fontSize = '1.20em';
  ratingNumElement.style.fontWeight = 'bold';

  return scoreDiv;
};

  const processReviewElements = () => {
    const reviewElements = document.querySelectorAll('.review-element');
    reviewElements.forEach(reviewElement => {
      const reviewTags = reviewElement.querySelector('.tags');
      const ratingNumElement = reviewElement.querySelector('.rating > .num');
      const ratingNum = ratingNumElement.textContent;
      const scoreElement = generateScore(ratingNum);
      reviewTags.appendChild(scoreElement);

      ratingNumElement.style.display = 'none';
      ratingNumElement.parentElement.style.display = 'none';
    });
  };

  const hideElements = () => {
    const hiddenElements = document.querySelectorAll('.rating.mt20.mb20.js-hidden');
    hiddenElements.forEach(hiddenElement => {
      hiddenElement.style.cssText = 'display: none; visibility: hidden; position: absolute; left: -9999px';
    });

    const noticeElements = document.querySelectorAll('.notice.mb12.js-hidden');
    noticeElements.forEach(noticeElement => {
      noticeElement.style.display = 'none';
      noticeElement.textContent = '';
    });
  };

  const toggleElements = () => {
    const toggleCheckbox = document.getElementById('toggleCheckbox');
    const elementsToShowHide = document.querySelectorAll('.btn-reaction.js-btn-reaction:not(.nice)');

    elementsToShowHide.forEach(element => {
      element.style.display = toggleCheckbox.checked ? 'inline-block' : 'none';
    });

    localStorage.setItem('toggleCheckboxState', toggleCheckbox.checked);
  };

  const toggleTextMagnification = () => {
    const toggleCheckboxTextMagnification = document.getElementById('toggleCheckboxTextMagnification');
    const textElements = document.querySelectorAll('.text');

    textElements.forEach(element => {
      element.removeEventListener('mouseover', handleTextMagnification);
      element.removeEventListener('mouseout', handleTextMagnification);
    });

    if (toggleCheckboxTextMagnification.checked) {
      textElements.forEach(element => {
        element.addEventListener('mouseover', handleTextMagnification);
        element.addEventListener('mouseout', handleTextMagnification);
      });
    }

    localStorage.setItem('toggleCheckboxTextMagnificationState', toggleCheckboxTextMagnification.checked);
  };

  const handleTextMagnification = event => {
    const paragraph = event.target.closest('.text');
    if (paragraph) {
      if (event.type === 'mouseover') {
        paragraph.style.transition = 'font-size 0.3s ease-in-out';
        paragraph.style.fontSize = '1.3em';
      } else if (event.type === 'mouseout') {
        paragraph.style.transition = 'font-size 0.3s ease-in-out';
        paragraph.style.fontSize = '';
      }
    }
  };

  let reviewElements = document.querySelectorAll('.review-element');

  reviewElements.forEach(function(reviewElement) {
    let textElement = reviewElement.querySelector('.text');
    let spoilerTag = reviewElement.querySelector('.tag.spoiler');
    let readMoreButton = reviewElement.querySelector('.js-readmore');
    let showLessButton = reviewElement.querySelector('.js-showless');

    if (spoilerTag && textElement) {
      textElement.style.filter = 'blur(4px)';
      textElement.style.transition = 'filter 0.5s ease';

      let originalText = textElement.textContent;

      readMoreButton.addEventListener('click', function() {
        textElement.style.filter = 'none';
      });

      showLessButton.addEventListener('click', function() {
        textElement.style.filter = 'blur(4px)';
      });

      spoilerTag.innerHTML = 'Review contains spoilers';
      readMoreButton.innerHTML = '<i class="fas fa-angle-down"></i>Show the review';
    }
  });

  processReviewElements();
  hideElements();
  removeElements();

  const toggleCheckbox = document.createElement('input');
  toggleCheckbox.id = 'toggleCheckbox';
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.checked = localStorage.getItem('toggleCheckboxState') === 'true';
  toggleCheckbox.addEventListener('change', toggleElements);

  const toggleLabel = document.createElement('label');
  toggleLabel.htmlFor = 'toggleCheckbox';
  toggleLabel.textContent = 'Enable all the emojis';

  const toggleContainer = document.createElement('div');
  toggleContainer.style.marginTop = '10px';
  toggleContainer.style.textAlign = 'center';
  toggleContainer.appendChild(toggleCheckbox);
  toggleContainer.appendChild(toggleLabel);

  const toggleCheckboxTextMagnification = document.createElement('input');
  toggleCheckboxTextMagnification.id = 'toggleCheckboxTextMagnification';
  toggleCheckboxTextMagnification.type = 'checkbox';
  toggleCheckboxTextMagnification.checked = localStorage.getItem('toggleCheckboxTextMagnificationState') === 'true';
  toggleCheckboxTextMagnification.addEventListener('change', toggleTextMagnification);

  const toggleLabelTextMagnification = document.createElement('label');
  toggleLabelTextMagnification.htmlFor = 'toggleCheckboxTextMagnification';
  toggleLabelTextMagnification.textContent = 'Enable Text Magnification';

  const toggleContainerTextMagnification = document.createElement('div');
  toggleContainerTextMagnification.style.marginTop = '10px';
  toggleContainerTextMagnification.style.textAlign = 'center';
  toggleContainerTextMagnification.appendChild(toggleCheckboxTextMagnification);
  toggleContainerTextMagnification.appendChild(toggleLabelTextMagnification);

  const pageFooter = document.querySelector('footer');
  pageFooter.appendChild(toggleContainer);
  pageFooter.appendChild(toggleContainerTextMagnification);

  const buttons = document.querySelectorAll('.btn-reaction');
  buttons.forEach(button => {
  button.style.transition = 'transform 0.3s ease-in-out';
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.1)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
  });
});

  toggleElements();
  toggleTextMagnification();

  const settingsText = document.createElement('p');
  settingsText.textContent = 'MAL Redesigned Reviews - Version 1.6';
  settingsText.style.fontWeight = 'bold';
  settingsText.style.textAlign = 'center';
  settingsText.style.marginTop = '10px';
  settingsText.style.marginBottom = '10px';

  const pageFooterTitle = document.querySelector('footer');
  pageFooter.insertBefore(settingsText, toggleContainer);
  pageFooter.appendChild(toggleContainerTextMagnification);

  const toggleContainerTextMagnificationGar = document.createElement('div');
  toggleContainerTextMagnification.className = 'toggle-container';
  toggleContainerTextMagnification.style.marginBottom = '10px';

  const style = document.createElement('style');
  style.innerHTML = `
  .review-element {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 8px;
    margin-top: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }

  .review-element:hover {
    transform: translateY(-4px);
  }

  .thumbbody {
    display: flex;
    align-items: flex-start;
  }

  .thumb {
    position: absolute;
    top: 8px;
    left: 8px;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  .thumb img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }

  .thumb img:hover {
    transform: scale(1.05);
  }

  .body {
    margin-left: 56px;
  }

  .update_at {
    color: #999;
    font-size: 11px;
    display: flex;
    align-items: center;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  .username {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  .username a {
    color: #1c439b;
    font-size: 12px;
    font-weight: bold;
    text-decoration: none;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  .floatRightHeader {
    color: #a7b7cc;
    font-weight: bold;
    font-size: 12px;
    opacity: 1;
    transform: translateY(0);
  }

  .rating {
    font-size: 12px;
    font-weight: bold;
    margin-left: 4px;
    opacity: 1;
    transform: translateY(0);
  }

  .text {
    margin-top: 8px;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 1.3;
    opacity: 1;
    transform: translateY(0);
    color: #ccc;
  }

  .text.magnified {
    font-size: 14px;
    font-weight: bold;
  }
   .anime-info-review__header, .manga-info-review__header {
   padding: 10px !important;
   padding-bottom: 20px !important;
   background-color: #f6f6f6;
   border-radius: 8px;
  }
  .left, .right {
  margin-top: 7px !important;
  }
`;

const htmlElement = document.documentElement;
const isDarkMode = htmlElement.classList.contains('appearance-dark', 'dark-mode');

if (isDarkMode) {
  style.innerHTML += `
    .review-element {
      border-color: #000;
    }
    .thumbbody .body .reaction-box {
      background-color: #101010;
    }
    .dark-mode .review-element {
      background-color: #1e1d1d;
    }
    .update_at,
    .username a,
    .floatRightHeader,
    .rating,
    .text {
      color: #999;
    }
    .thumb img {
      box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
      transition: transform 0.3s ease-in-out !important;
    }
    .thumb img:hover {
      transform: scale(1.05) !important;
    }
    .anime-info-review__header, .manga-info-review__header {
      padding: 10px !important;
      padding-bottom: 20px !important;
      border-radius: 8px;
    }
    .left, .right {
      margin-top: 7px !important;
    }
    .recommended a {
      color: #9fbdff !important;
    }
    .not-recommended a {
      color: #ff9fa1 !important;
    }
    .mixed-feelings a {
      color: #a3a3a3 !important;
    }
    .recommended__bar {
      background: #9fbdff !important;
    }
    .mixed_feeling__bar {
      background: #a3a3a3 !important;
    }
    .not_recommended__bar {
      background: #ff9fa1 !important;
    }
  `;
}

document.head.appendChild(style);

  const tagRestylePs = document.querySelectorAll('.tag.preliminary, .tag.spoiler');
  tagRestylePs.forEach(function(tagRestyle) {
  if (isDarkMode) {
    tagRestyle.style.backgroundColor = '#1e1d1d';
    tagRestyle.style.borderColor = '#1e1d1d';
  } else {
    tagRestyle.style.backgroundColor = '#f9f9f9';
    tagRestyle.style.borderColor = '#f9f9f9';
  }
});

  const tagRestyleP = document.querySelectorAll('.tag.preliminary');
  tagRestyleP.forEach(function(tagRestyle) {
  tagRestyle.style.color = '#2db039';
});

function createCheckbox(id, labelText) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText;

  const spacingSpan = document.createElement('span');
  spacingSpan.style.marginLeft = '8px';

  return { checkbox, label, spacingSpan };
}

function toggleVisibility(checkbox, elements, localStorageKey) {
  const toggleElementVisibility = () => {
    const displayStyle = checkbox.checked ? 'block' : 'none';
    elements.forEach((element) => {
      element.style.display = displayStyle;
    });

    localStorage.setItem(localStorageKey, checkbox.checked);
  };

  const applyVisibilityState = () => {
    const savedCheckboxState = localStorage.getItem(localStorageKey);
    if (savedCheckboxState !== null) {
      checkbox.checked = JSON.parse(savedCheckboxState);
      toggleElementVisibility();
    }
  };

  checkbox.addEventListener('change', toggleElementVisibility);
  applyVisibilityState();
}

const container = document.createElement('div');
container.style.cssText = 'text-align: center; margin-top: 10px;';

const reactionCheckbox = createCheckbox('toggleCheckbox', 'Show the reaction count');
container.append(reactionCheckbox.checkbox, reactionCheckbox.label, reactionCheckbox.spacingSpan);

const reactionElements = document.querySelectorAll('.icon-reaction.js-icon-reaction');
reactionElements.forEach(element => {
  element.style.display = 'none'; // Hide reaction box by default
});
toggleVisibility(reactionCheckbox.checkbox, reactionElements, 'checkboxState');

const giftCheckbox = createCheckbox('toggleGiftCheckbox', 'Show the gift button');
container.append(giftCheckbox.checkbox, giftCheckbox.label, giftCheckbox.spacingSpan);

const giftElements = document.querySelectorAll('.gift');
giftElements.forEach(element => {
  element.style.display = 'none'; // Hide gift button by default
});
toggleVisibility(giftCheckbox.checkbox, giftElements, 'giftCheckboxState');

document.body.append(container);

const blankSpaceDiv = document.createElement('div');
blankSpaceDiv.style.height = '10px';
document.body.append(blankSpaceDiv);
})();