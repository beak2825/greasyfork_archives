// ==UserScript==
// @name         7speaking-v1-ayta
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  7speaking 0 - 1 ayta
// @author       ayfri & anta
// @match        https://user.7speaking.com/quiz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478100/7speaking-v1-ayta.user.js
// @updateURL https://update.greasyfork.org/scripts/478100/7speaking-v1-ayta.meta.js
// ==/UserScript==

function findSimpleExo() {
	const element = document.querySelector('.quiz__container');
	if (!element) return "not found";

	const internal = Object.entries(element).find(([k, v]) => k.startsWith('__reactInternalInstance'))[1];
	if (!internal) return "internal not found";

	const props = internal.alternate?.memoizedProps?.children?.props;
	if (!props) return "props not found";

	const answer = props.children[2]?.props?.answerOptions?.answer;
	if (!answer) return "error message not found";

	const result = answer.map(a => a.value);
	console.log(`The answer is: ${result.join(', ').trim()}`);

	return result.join(', ').trim();
}

function findTest() {
	const element = document.querySelector('.ExamsAndTests__questionContainer');
	if (!element) return "not found";

	const internal = Object.entries(element).find(([k, v]) => k.startsWith('__reactInternalInstance'))[1];
	if (!internal) return "internal not found";

	const props = internal.memoizedProps?.children?.props;
	if (!props) return "props not found";

	const errorMessage = props.children[1]?.props?.questions[0]?.errorMessage;
	if (!errorMessage) return "error message not found";

	const result = errorMessage.substr(-2, 1);
	return `The answer is ${result}`;
}

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


function handleInput(value) {
    const inputElement = document.querySelector('.MuiInputBase-input');
    if (!inputElement) return;

    const internal = Object.entries(inputElement).find(([k, v]) => k.startsWith('__reactInternalInstance'))[1];
    if (!internal) return;

    internal.memoizedProps.onChange({ currentTarget: {value}, isTrusted: true, target: {value} });
}

function handleButtons(value) {
	const buttons = document.querySelectorAll('.answer-container > button.button');
	if (!buttons) return;

	const button = [...buttons].find(b => b.innerText.trim() === value);
	if (!button) return;

	button.click();
}

async function automaticallyClick() {
	const value = findSimpleExo();
	if (!value) return;

	handleInput(value);
	handleButtons(value);

	const submitButton = document.querySelector('.question__btn');
	if (!submitButton) return;

	submitButton.click();
	await sleep(randomBetween(1500, 3000));
	submitButton.click();

	if (window.stopClicking) {
		console.log('stop clicking automatically');
		return;
	}

	await sleep(randomBetween(4000, 8000));
	await automaticallyClick();
}

const stop = () => window.stopClicking = true;
const start = async () => {
	window.stopClicking = false;
	await automaticallyClick();
};

function handleClick(btn, span) {
  if(span.textContent == 'Start') {
    span.textContent = 'Stop';
	btn.style.backgroundColor = '#c6002b';
    start();
  } else {
    span.textContent = 'Start';
	btn.style.backgroundColor = '#147b76';
    stop();
  }
}

function addStartStopBtn() {
  if(document.querySelector('.question__form')) {
    if(!document.getElementById('scriptBtn')) {
      const btn = document.createElement('button');
      btn.id = 'scriptBtn';
      btn.type = 'button';
	  btn.style.padding = '5px 16px 7px 16px';
      btn.style.fontSize = '1rem';
      btn.style.minWidth = '11.25rem';
      btn.style.boxSizing = 'border-box';
      btn.style.minHeight = '2.5rem';
      btn.style.transition = 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms';
      btn.style.fontFamily = '"sofia-pro", "Arial", sans-serif';
      btn.style.fontWeight = 'normal';
      btn.style.lineHeight = '1.75';
      btn.style.borderRadius = '6px';
      btn.style.textTransform = 'inherit';
      btn.style.color = 'rgb(242, 240, 237)';
      btn.style.backgroundColor = 'rgb(178, 0, 33)';
	  btn.style.width = '100%';
	  btn.style.cursor = 'pointer';
	  btn.style.border = '0';
	  btn.style.maxWidth = '300px';

      const span = document.createElement('span');
      span.className = 'MuiButton-label-56';
      span.textContent = 'Start';
      btn.style.backgroundColor = '#147b76'

      btn.appendChild(span);

      btn.addEventListener('click', () => handleClick(btn, span));

      const container = document.querySelector('.question__btns__container');
      container.style.flexFlow = 'column';
      container.style.gap = '1rem';
      container.style.alignItems = 'center';
      container.appendChild(btn);
    }
  }
}


addStartStopBtn();
setInterval(addStartStopBtn, 1000);