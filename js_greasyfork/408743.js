// ==UserScript==
// @name        recommend me! - illinoislottery.com
// @namespace   Violentmonkey Scripts
// @match       https://www.illinoislottery.com/*
// @grant       none
// @version     1.0
// @author      KingOfCaves
// @description 8/11/2020, 5:18:36 PM
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408743/recommend%20me%21%20-%20illinoislotterycom.user.js
// @updateURL https://update.greasyfork.org/scripts/408743/recommend%20me%21%20-%20illinoislotterycom.meta.js
// ==/UserScript==

const stylesheet = `
.recommended {
  visibility: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0,0,0,0.8);
  z-index: 100;
}

.recommended.open {
  visibility: visible;
}

.recommended__day {
  font-size: 4rem;
  color: white;
}

.recommended__exit {
  width: 50px;
  height: 50px;
  background-color: white;
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
}

.recommended__exit::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 75%;
  height: 10%;
  background-color: black;
}
.recommended__exit::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 75%;
  height: 10%;
  background-color: black;
}

.dataset {
  background-color: white;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
  padding: 2rem;
  margin: 2rem;
}

.dataset__title {
  padding-bottom: 3px;
  border-bottom: 6px solid black;
  margin-bottom: 1rem;
}

.dataset__numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  font-color: white;
}

.dataset__numbers--hot .dataset__number {
  background-color: #E74C3C;
}

.dataset__numbers--warm .dataset__number {
  background-color: #9B59B6;
}

.dataset__numbers--cold .dataset__number {
  background-color: #3498DB;
}

.dataset__number {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
}

.dataset__numbers > :not(:last-child) {
  margin-right: 1rem;
}

.loader {
	margin: 1rem 0;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.loader .loader__dot {
	width: 20px;
	height: 20px;
	background-color: #fefefe;
	animation: both 1.5s wave infinite ease-in-out;
}

.loader .loader__dot:not(:last-child) {
	margin-right: 1rem;
}

.loader .loader__dot:nth-of-type(1) {
	animation-delay: -0.75s;;
}
.loader .loader__dot:nth-of-type(2) {
	animation-delay: -0.5s;
}
.loader .loader__dot:nth-of-type(3) {
	animation-delay: -0.25s;
}
.loader .loader__dot:nth-of-type(4) {
	animation-delay: 0;
}

@keyframes wave {
	from {
		transform: translate(0, -5px);
	}

	50% {
		transform: translate(0, 5px);
	}

	to {
		transform: translate(0, -5px);
	}
}
`;
let style = GM_addStyle(stylesheet);

const button = document.createElement('a');
const header = document.querySelector('.illi-header__account-info.user-account-info');
button.textContent = 'Forecast';
button.classList.add('ill-btn', 'ill-btn-stroke', 'ill-btn-stroke--default', 'user-account-info__register');
button.style.marginLeft = '1em'
header.appendChild(button);

const recommended = document.createElement('div');
recommended.classList.add('recommended');
document.body.prepend(recommended);

let results = [];
let running = false;

const loadingPage = () => {
  recommended.innerHTML = 
  `<div class="loader">
    <div class="loader__dot"></div>
    <div class="loader__dot"></div>
    <div class="loader__dot"></div>
    <div class="loader__dot"></div>
  </div>`;
  recommended.classList.add('open');
}

const getToday = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const d = new Date();
  return days[d.getDay()];
}

const interpretResults = () => {
  const sortedResults = results.map(result => ({
    day: result.day,
    numbers: result.winningNumbers
  }))
  .sort((a, b) => {
    const order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const aPlace = order.findIndex(day => a.day === day);
    const bPlace = order.findIndex(day => b.day === day);
    return aPlace - bPlace;
  });
  let appearances = [];
  let currentNumber;
  let currentDay;
  
  sortedResults.forEach(result => {
    const { day, numbers } = result;
    if (typeof currentDay !== 'string' || currentDay !== day) {
      currentDay = day;
      appearances = [
        ...appearances,
        {
          day,
          numbers
        }
      ];
    } else {
      const foundIndex = appearances.findIndex(appearance => appearance.day === day);
      appearances[foundIndex] = {
        ...appearances[foundIndex],
        numbers: appearances[foundIndex].numbers.concat(numbers).sort()
      }
    }
  });
  
  appearances.forEach((appearance, index) => {
    appearance.numbers.forEach(number => {
      if (typeof currentNumber !== 'number' || currentNumber !== number) {
        currentNumber = number;
        if (typeof appearances[index].occurences === 'undefined') {
          appearances[index] = {
            ...appearance,
            occurences: [{
              number,
              amount: 1
            }]
          }
        } else {
          appearances[index] = {
            ...appearance,
            occurences: [
              ...appearances[index].occurences, 
              {
                number,
                amount: 1
            }]
          }
        }
      } else {
        const foundIndex = appearances[index].occurences.findIndex(occ => occ.number === number);
        appearances[index].occurences[foundIndex] = {
          ...appearances[index].occurences[foundIndex],
          amount: appearances[index].occurences[foundIndex].amount + 1
        }
    }})
  });
  
  const today = getToday();
  const sortedOccurences = appearances.find(appearance => appearance.day === today)
    .occurences
    .sort((a, b) => b.amount - a.amount);
  
  const hot = sortedOccurences.slice(0, 2);
  const warm = sortedOccurences.slice(2, 5);
  const cold = sortedOccurences.slice(5, -1);
  
  recommended.innerHTML = `
    <div class="recommended__exit"></div>
    <h2 class="recommended__day">${today}</h2>
    <div class="dataset">
      <div class="dataset__title">Hot</div>
      <div class="dataset__numbers dataset__numbers--hot">
        ${hot.map(i => `<div class="dataset__number">${i.number}</div>`).join('\n')}
      </div>
    </div>
    <div class="dataset">
      <div class="dataset__title">Warm</div>
      <div class="dataset__numbers dataset__numbers--warm">
        ${warm.map(i => `<div class="dataset__number">${i.number}</div>`).join('\n')}
      </div>
    </div>
    <div class="dataset">
      <div class="dataset__title">Cold</div>
      <div class="dataset__numbers dataset__numbers--cold">
        ${cold.map(i => `<div class="dataset__number">${i.number}</div>`).join('\n')}
      </div>
    </div>`;

  console.log(appearances);
}

const fillResults = async (page = 1) => {
  await fetch(`https://www.illinoislottery.com/dbg/results/pick3?page=${page}`)
  .then((response) => response.text())
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const pageResults = Array.from(doc.querySelectorAll('.dbg-results__result-info')).map(result => {
      const day = result.querySelector('.dbg-results__day-info').textContent.toLowerCase().trim();
      const date = result.querySelector('.dbg-results__date-info').textContent.toLowerCase().trim();
      const time = result.querySelector('.dbg-results__draw-info').textContent.toLowerCase().trim();
      const winningNumbers = result.querySelector('.dbg-results__result-line').textContent
        .replace(/\D/g,'')
        .split('')
        .map(number => +number);

      return {
        day,
        time,
        winningNumbers
      }
    });

    results = [...results, ...pageResults];
    return page + 1;
  })
  .then((nextPage) => {
    if (results.length <= 28) {
      return fillResults(nextPage);
    } else {
      running = false;
      interpretResults();
    }
  })
  .catch((error) => console.log(error));
}

const dataCollect = async () => {
  results = [];
  
  if (!running) {
    running = true;
    loadingPage();
    await fillResults();
  } else {
    console.log('loading...');
  }
}

button.addEventListener('click', dataCollect);
recommended.addEventListener('click', (e) => {
  if (e.target.classList.contains('recommended__exit')) {
    recommended.classList.remove('open')
  }
})

                        