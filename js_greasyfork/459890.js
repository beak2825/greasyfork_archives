// ==UserScript==
// @name        TalkGPT
// @namespace   http://tampermonkey.net/
// @version     0.2
// @description enjoy Hands-Free Communication with ChatGPT
// @author      temberature@mail.com
// @include     https://chat.openai.com/chat*
// @grant       none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/459890/TalkGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/459890/TalkGPT.meta.js
// ==/UserScript==

(function () {
  addTalkBtn();
  let VoiceList;

  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = generateVoiceList;
  }
  let voice = "Microsoft Aria Online (Natural) - English (United States)", lang = "en-US";
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(addedNode => {
          if (addedNode.nodeType === Node.ELEMENT_NODE && ((addedNode.classList.contains('overflow-hidden') && addedNode.classList.contains('w-full') && addedNode.classList.contains('h-full') && addedNode.classList.contains('relative')) || addedNode.classList.contains('px-2') &&
          addedNode.classList.contains('py-10') &&
          addedNode.classList.contains('relative') &&
          addedNode.classList.contains('w-full') &&
          addedNode.classList.contains('flex') &&
          addedNode.classList.contains('flex-col') &&
          addedNode.classList.contains('h-full') &&
          addedNode.classList.contains('list')) ) {


            addTalkBtn();
            let stretchElement = document.querySelector('.stretch');
            let justifyCenterDiv = stretchElement.querySelector('.justify-center');
            justifyCenterDiv.appendChild(VoiceList);

          }

          if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.classList.contains('btn') && addedNode.classList.contains('flex') && addedNode.classList.contains('justify-center') && addedNode.classList.contains('gap-2') && addedNode.classList.contains('btn-neutral') && addedNode.classList.contains('border-0') && addedNode.classList.contains('md:border') && addedNode.textContent.includes('Regenerate response')) {
            const proseElements = document.querySelectorAll('.prose');
            const lastProseElement = proseElements[proseElements.length - 1];

            window.utterances = [];
            const msg = new SpeechSynthesisUtterance(lastProseElement.textContent);
            utterances.push(msg);
            msg.voice = window.speechSynthesis.getVoices().find(v => {
              return v.name === voice;
            });
            msg.onend = () => {
              recognize();
            };
            window.speechSynthesis.speak(msg);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });


  function recognize() {
    const recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = lang; // Set the language to Mandarin Chinese

    recognition.start();

    let transcript = '';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onend = () => {
      if(!transcript){
        return;
      }
      const textarea = document.querySelector('textarea');
      textarea.value = textarea.value + "" + transcript;

      // Find the sibling button and click it
      const button = textarea.nextElementSibling;
      button.click();
    };
  }
  function generateVoiceList() {
    let stretchElement = document.querySelector('.stretch');
    let justifyCenterDiv = stretchElement.querySelector('.justify-center');

    if(justifyCenterDiv.querySelector('select')) {
      return;
    }
    const select = document.createElement('select');

    select.style = "width: 5rem;border: 0;"
    select.onchange = function(event) {
      const values = event.target.value.split(';');
      voice = values[0];
      lang = values[1];
    }
    if (typeof speechSynthesis === 'undefined') {
      return;
    }

    const voices = speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
      const option = document.createElement('option');
      option.textContent = `${voices[i].name};${voices[i].lang}`;

      if (voices[i].default) {
        option.textContent += '; — DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);

      select.appendChild(option);
      select.value = `${voice};${lang}`;
    }


    VoiceList = select;
    justifyCenterDiv.appendChild(select);

  }


  function addTalkBtn() {
    let stretchElement = document.querySelector('.stretch');
    let justifyCenterDiv = stretchElement.querySelector('.justify-center');
    const button = document.createElement('button');
    button.classList.add('btn', 'flex', 'gap-2', 'justify-center', 'btn-neutral');
    button.textContent = 'Talk';
    button.addEventListener('click', function(e) {
      e.preventDefault();
      recognize();
    });
    justifyCenterDiv.appendChild(button);
  }

})();
