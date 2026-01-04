// ==UserScript==
// @name         Master Duel Meta - Screenshot for Deck Builder
// @namespace    https://github.com/DonkeyBear
// @version      0.2.6
// @description  Take a nice shot of your deck!
// @author       DonkeyBear
// @match        http://www.masterduelmeta.com/deck-tester*
// @match        https://www.masterduelmeta.com/deck-tester*
// @icon         https://s3.duellinksmeta.com/img/icons/favicon-32x32.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459975/Master%20Duel%20Meta%20-%20Screenshot%20for%20Deck%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/459975/Master%20Duel%20Meta%20-%20Screenshot%20for%20Deck%20Builder.meta.js
// ==/UserScript==

const stylesheet = /* css */`
  .deck-container.taking-shot .new-card, .deck-container.taking-shot .adjust-buttons-container, .search-container.taking-shot {
    display: none !important;
  }
  .screenshot {
    object-fit: contain;
    max-width: 100vw;
    max-height: 100vh;
  }
  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
    backdrop-filter: blur(3px);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info-container {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: .75em;
    font-weight: 500;
  }
  .info-container .slot-info {
    color: white;
  }
  .slot-info, .card-count {
    flex-basis: auto !important;
  }
  .tag {
    color: white;
    padding: .1rem .4rem;
    border-radius: .25rem;
    margin-right: .25rem;
  }
  .tag.rarity-ur {
    background: linear-gradient(90deg, #c92ae7 0%, #7844fd 49%, #43bcd5 100%);
  }
  .tag.rarity-sr {
    background: linear-gradient(90deg, #e85504 0%, #f19d00 100%);
  }
  .tag.rarity-r {
    background: linear-gradient(90deg, #1831cc 0%, #017cfb 100%);
  }
  .tag.rarity-n {
    background: linear-gradient(90deg, #4f494b 0%, #969696 100%);
  }
`;
const style = document.createElement('style');
style.textContent = stylesheet;
document.head.appendChild(style);

// Append screenshot button
const tabButtonContainer = document.querySelector('ul.svelte-umfxo');
const newTabButton = document.createElement('li');
newTabButton.classList.add('svelte-umfxo', 'screenshot-button');
newTabButton.textContent = 'Screenshot';
newTabButton.onclick = () => { takeshot() };
tabButtonContainer.appendChild(newTabButton);

countCards();

const observer = {};

// Append screenshot button again if it's removed
observer.tabButtonContainer = new MutationObserver(() => {
  if (!tabButtonContainer.querySelector('.screenshot-button')) {
    tabButtonContainer.appendChild(newTabButton);
  }
});
observer.tabButtonContainer.observe(tabButtonContainer, { childList: true });

// Count cards and print
observer.mainDeck = new MutationObserver(() => { countCards() });
observer.extraDeck = new MutationObserver(() => { countCards() });
observer.deckContainer = new MutationObserver(() => {
  // Append count-info again if it's removed
  if (document.querySelector('.deck-container > .info-container').textContent.includes('cards')) { countCards() }
  const mainDeck = document.querySelector('.deck-container > .box-container');
  const extraDeck = document.querySelector('.extra-side-deck');
  if (mainDeck) { observer.mainDeck.observe(mainDeck, { childList: true, subtree: true, attributes: true }) }
  if (extraDeck) { observer.extraDeck.observe(extraDeck, { childList: true, subtree: true, attributes: true }) }
  if (mainDeck && mainDeck) { observer.deckContainer.disconnect() }
});
observer.deckContainer.observe(document.querySelector('.deck-container'), { childList: true });

function takeshot () {
  const deckContainer = document.querySelector('.deck-container');
  const searchContainer = document.querySelector('.search-container');

  deckContainer.classList.add('taking-shot');
  searchContainer.classList.add('taking-shot');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.onclick = () => { overlay.remove() };
  document.body.appendChild(overlay);

  const options = {
    allowTaint: false,
    useCORS: true,
    backgroundColor: '#001b35', // Background color of <body>
    logging: false
  };
  html2canvas(deckContainer.parentElement, options).then(canvas => { // eslint-disable-line no-undef
    canvas.classList.add('screenshot');
    overlay.appendChild(canvas);
  });

  deckContainer.classList.remove('taking-shot');
  searchContainer.classList.remove('taking-shot');
}

function countCards () {
  const counter = {
    main: 0,
    extra: 0,
    ur: 0,
    sr: 0,
    r: 0,
    n: 0
  };

  const mainDeckCards = document.querySelectorAll('.deck-container > .box-container > .card-container > .card');
  const extraDeckCards = document.querySelectorAll('.extra-side-deck .card-container > .card');

  for (const cards of [mainDeckCards, extraDeckCards]) {
    for (const card of cards) {
      if (!card.querySelector('img')) { break }

      let copies;
      const cardAmount = card.querySelector('img.card-amount');
      if (!cardAmount) {
        copies = 1;
      } else if (cardAmount.alt.includes('2')) {
        copies = 2;
      } else if (cardAmount.alt.includes('3')) {
        copies = 3;
      }

      cards === mainDeckCards ? counter.main += copies : counter.extra += copies;

      const rarityImage = card.querySelector('.rarity-image > img');
      if (!rarityImage) { break }
      switch (rarityImage.alt) {
        case 'UR Rarity':
          counter.ur += copies;
          break;
        case 'SR Rarity':
          counter.sr += copies;
          break;
        case 'R Rarity':
          counter.r += copies;
          break;
        case 'N Rarity':
          counter.n += copies;
      }
    }
  }

  const infoLeft = document.querySelector('.info-container .slot-info');
  const infoRight = document.querySelector('.info-container .card-count');
  infoLeft.innerHTML = /* html */`
    <span class="tag rarity-ur">${counter.ur} UR</span>
    <span class="tag rarity-sr">${counter.sr} SR</span>
    <span class="tag rarity-r">${counter.r} R</span>
    <span class="tag rarity-n">${counter.n} N</span>
  `;
  infoRight.textContent = `Main: ${counter.main} Extra: ${counter.extra}`;
}
