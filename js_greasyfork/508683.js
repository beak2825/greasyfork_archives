// ==UserScript==
// @name        Fetch correct answers and populate exam
// @namespace   Zduniusz QOL
// @match       *://egzamin-informatyk.pl/testy*
// @grant       none
// @version     1.0
// @author      Zduniusz
// @license MIT
// @description 9/16/2024, 9:00:46 AM
// @downloadURL https://update.greasyfork.org/scripts/508683/Fetch%20correct%20answers%20and%20populate%20exam.user.js
// @updateURL https://update.greasyfork.org/scripts/508683/Fetch%20correct%20answers%20and%20populate%20exam.meta.js
// ==/UserScript==

const site_bottom_container = document.querySelector('footer > div > div > div');
const questions = document.querySelector('#portfolio  form').childNodes;
var answers = null;
var score = 28;

(function populate_container(){
  const h4 = document.createElement('h4');
  h4.textContent = 'Set Score';
  site_bottom_container.appendChild(h4);

  const p = document.createElement('p');
  site_bottom_container.appendChild(p);

  function score_update() {
      score = slider.value;
      p.textContent = `Score: ${(score / 40 * 100).toFixed(1)}% (${score}/40)`;
  }

  const slider = document.createElement('input');
  slider.id = 'slider';
  slider.type = 'range';
  slider.min = 0;
  slider.max = 40;
  slider.value = 28;
  site_bottom_container.appendChild(slider);
  site_bottom_container.addEventListener('input', score_update);
  score_update();

  const button = document.createElement('button');
  button.textContent = 'Update';
  button.classList.add('btn', 'btn-med');
  button.addEventListener('click', get_correct);
  site_bottom_container.appendChild(button);

})();

function get_correct() {
  if (answers != null)
    return populate_answers();

  // Prepare payload
  const params = new URLSearchParams();
  document.querySelectorAll('input[type="hidden"]').forEach(input => {
    params.append(input.name, input.value);
  });
  const urlEncodedString = params.toString();

  fetch(`/${window.location.pathname.split('/').slice(-2)[0].replace('testy-', 'odpowiedzi-')}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlEncodedString,
  })
  .then(response => {
      return response.text();
  })
  .then(html => {
    handle_response(html);
  });
}

function handle_response(raw){
  const regex = /<section id="portfolio">([\s\S]*?)<\/section>/;
  const section = raw.match(regex)[0];
  const hiddenSection = document.createElement('div');
  hiddenSection.innerHTML = section;
  const results = hiddenSection.querySelectorAll('.odpbad, .odpgood, .odpwrong');

  answers = [];

  function extractAnsN(str) {
    return str.match(/odp([^0-9]*)\d/)[1];
  }

  function isCorrect(classname){
    return classname.endsWith("good");
  }

  for (const result of results) {
    const id = result.id;
    const classname = result.className;

    if (!isCorrect(classname)) continue;
    answers.push(extractAnsN(id));
  }

  populate_answers();
}

function populate_answers(){
  var correctQuestions = new Set();
  while (correctQuestions.size < score) {
        const randomInt = Math.floor(Math.random() * 40);
        correctQuestions.add(randomInt);
  }

  function generateWrong(correct){
    let correct_num = correct.charCodeAt(0) - 'a'.charCodeAt(0);
    let wrong = 0;

    while (wrong == correct_num)
        wrong = Math.floor(Math.random() * 4);
    return String.fromCharCode(wrong + 'a'.charCodeAt(0));
  }

  for (let i = 0; i < 40; i++) {
    const markCorrect = correctQuestions.has(i);
    let answer = answers[i];
    if (!markCorrect)
      answer = generateWrong(answer);

    eval(`zmiana${answer.toUpperCase()}(${i + 1})`);
  }

}