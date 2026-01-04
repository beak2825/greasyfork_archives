// ==UserScript==
// @name        LRN
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/lrn
// @include     *lrn.com*
// @exclude     none
// @version     0.0.11
// @description:en	Makes LRN training less painful
// @grant    		none
// @description Makes LRN training less painful
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518785/LRN.user.js
// @updateURL https://update.greasyfork.org/scripts/518785/LRN.meta.js
// ==/UserScript==

/**
 * USAGE INSTRUCTIONS:
 *
 * BEFORE YOU USE THIS: Start the course and do the intro manually. This section determines which sections you have to go through and you don't want the script randomly choosing loads of them!
 *
 * Either: Install using the TamperMonkey browser extension
 * Or: Copy the popup URL to open the course in a normal tab, open dev tools (using menu as they've disabled right-click) and paste the script into the console.
 *
 * Sometimes it gets stuck, so if it does just reload (and if using the copy-paste method, re-execute in the console).
 *
 * Finally, if you've completed everything but it still needs you to spend more time (it requires you to spend at least 90 mins) there's a new "Slow mode" - toggle this on at the top of the script and re-open any completed section to go through it super slowly!
 */

const DEBUG = false;
const ATTEMPT_QUIZZES = true;
const SLOW_MODE = false;

let isWorking = false;

const getRandomItem = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex] ?? arr[0];
};

const pause = (duration) =>
  new Promise((res) => setTimeout(() => res(), duration));

const debug = DEBUG ? (...args) => console.log('DEBUG:', ...args) : () => null;

const closePopup = () => {
  const closeButton = document.getElementById('POP_CLOSE');
  if (!closeButton) {
    return;
  }
  closeButton.click();
};

const isAnswerCheckbox = (element) =>
  element.getAttribute('type') === 'checkbox' &&
  element.id.startsWith('SAQ_CHECKBOX');
const isAnswerRadio = (element) =>
  element.getAttribute('type') === 'radio' &&
  element.id.startsWith('SAQ_RADIO');

const speedUpVideo = () => {
  const videos = [...document.getElementsByTagName('video')];
  debug('Speeding up videos', videos);
  videos.forEach((video) => {
    video.playbackRate = 4.0;
    if (video?.paused) {
      video.play();
    }
  });
};

const openHomepageSectionIfAvailable = async () => {
  const homepageSectionCards =
    document.getElementsByClassName('ip-tile-card-inner');
  debug('Homepage sections', homepageSectionCards);
  if (!homepageSectionCards.length) {
    return;
  }

  const unlockedHomepageSectionCards = [...homepageSectionCards].filter(
    (section) => {
      return !section.querySelector('.ip-icon-lock');
    },
  );
  debug('unlockedHomepageSectionCards', unlockedHomepageSectionCards);
  if (!unlockedHomepageSectionCards.length) {
    return;
  }

  const incompleteHomepageSectionCards = [
    ...unlockedHomepageSectionCards,
  ].filter((section) => {
    return !section.querySelector('.ip-tile-check');
  });
  debug('incompleteHomepageSectionCards', incompleteHomepageSectionCards);
  if (
    incompleteHomepageSectionCards.some((section) =>
      section.innerText.includes('Introduction'),
    )
  ) {
    debug('Introduction section found, skipping');
    return;
  }
  if (!incompleteHomepageSectionCards.length) {
    return;
  }
  debug('Filtered homepage sections', incompleteHomepageSectionCards);
  await pause(2000);
  getRandomItem(incompleteHomepageSectionCards).click();
};

const selectThumnailButtonIfAvailable = () => {
  // get all elements by class ip-ctr-select-thumbnail-btn
  // for each, click it
  const thumbnailButtons = [
    ...document.getElementsByClassName('ip-ctr-select-thumbnail-btn'),
  ];
  debug('thumbnailButtons', thumbnailButtons);
  if (!thumbnailButtons.length) {
    return;
  }
  isWorking = true;
  for (let button of thumbnailButtons) {
    debug('Selecting thumbnail button', button);
    button.click();
  }
  isWorking = false;
};

const pressPlayVideo = () => {
  const playButton = document.getElementById('VIDEO_PLAY_BUTTON');
  debug('Play button', playButton);
  if (!playButton) {
    return;
  }
  playButton.click();
  debug('Pressing play button');
};

const selectRandomBinaryOption = () => {
  if (!ATTEMPT_QUIZZES) {
    return;
  }

  const radioInputs = [...document.getElementsByTagName('INPUT')].filter(
    (input) => input.id.startsWith('RADIO-'),
  );
  debug('radioInputs', radioInputs);
  if (!radioInputs.length) {
    return;
  }
  getRandomItem(radioInputs).click();
};

const answerQuestionIfAvailable = () => {
  const scorePieChart = document.getElementById('PIE_TEXT_QUICK_QUIZ_PROGRESS');
  if (scorePieChart && !ATTEMPT_QUIZZES) {
    // We can't automate this part as we need the answers to be correct!
    debug('Not attempting quiz');
    return;
  }

  const submitButton =
    document.getElementById('IP_SAQ_SUBMIT_BUTTON') ||
    document.getElementById('SUBMIT_BUTTON') ||
    document.getElementById('RETRY_BUTTON');
  debug('submitButton', submitButton);
  if (!submitButton) {
    return;
  }
  debug('Attempting question(s)');
  const submitDisabled = submitButton.getAttribute('aria-disabled') === 'true';
  debug('submitDisabled', submitDisabled);
  if (!submitDisabled) {
    submitButton.click();
  }

  // The submit button cannot yet be pressed, so we need to select more answers
  const uncheckedAnswers = [...document.getElementsByTagName('INPUT')].filter(
    (input) =>
      (isAnswerCheckbox(input) || isAnswerRadio(input)) &&
      input.getAttribute('aria-checked') !== 'true',
  );
  debug('uncheckedAnswers', uncheckedAnswers);
  if (!uncheckedAnswers.length) {
    return;
  }
  getRandomItem(uncheckedAnswers).click();
};

const expandSectionsIfAvailable = async () => {
  const expandableItems = [
    ...document.getElementsByClassName('ip-ctr-inner-btn'),
    ...document.getElementsByClassName('ip-accordion-popupBtn'),
    ...document.getElementsByClassName('ctrhotspot-hotspot'),
  ];
  debug('Expandable items', expandableItems);
  if (!expandableItems.length) {
    return;
  }
  isWorking = true;
  for (let item of expandableItems) {
    debug('Expandable item', item);
    item.click();
    await pause(800);
  }
  isWorking = false;
};

const pressNextIfAvailable = () => {
  const nextButton = document.getElementById('NAV_NEXT');
  debug('nextButton', nextButton);
  if (!nextButton) {
    return;
  }
  const isDisabled = nextButton.getAttribute('aria-disabled') === 'true';
  debug('nextButton isDisabled', isDisabled);
  if (isDisabled) {
    return;
  }
  // TODO: Hide video elements? Maybe they're interfering with the next button?
  nextButton.click();
};

const pressSwitchToTextIfAvailable = () => {
  const switchButton = document.getElementById('BTN_TEXT_MODE');
  debug('switchButton', switchButton);
  if (!switchButton) {
    return;
  }
  const isDisabled = switchButton.getAttribute('aria-disabled') === 'true';
  debug('switchButton isDisabled', isDisabled);
  if (isDisabled) {
    return;
  }
  switchButton.click();
};

function doActions() {
  openHomepageSectionIfAvailable();
  pressSwitchToTextIfAvailable();
  selectThumnailButtonIfAvailable();
  pressNextIfAvailable();
  expandSectionsIfAvailable();
  answerQuestionIfAvailable();
  selectRandomBinaryOption();
  pressPlayVideo();
  speedUpVideo();
  closePopup();
}

function worker() {
  try {
    // If another action is in progress, then don't trigger new actions yet...
    if (!isWorking) {
      doActions();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, SLOW_MODE ? 15000 : 500);
