// ==UserScript==
// @name            OnlyFakes easy prompt copy
// @namespace       Violentmonkey Scripts
// @match           https://uncensoredai.io/*
// @grant           none
// @version         0.1.1
// @author          vipprograms
// @description     Simply click on the images to copy the prompt
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513050/OnlyFakes%20easy%20prompt%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/513050/OnlyFakes%20easy%20prompt%20copy.meta.js
// ==/UserScript==
GM_addStyle(`
:root{
  --offwhite:color: hsl(0, 0%, 98%);
}
p{  white-space: pre;}

.oepc_popup{position:absolute; top:0; left:0; transform:translate(-50%,-50%); padding:10px 20px; background-color:hsla(0,0%,0%,70%);
  color:var(--offwhite); border-radius:5px; z-index:1000; backdrop-filter:blur(20px);
}
`);

const showPopup = (text) => {
  const popup = document.createElement('div');
  popup.innerHTML = `<div class="oepc_popup">${text}</div>`;
  document.body.appendChild(popup);

  // Get the current mouse position
  const mouseX = window.innerWidth / 2;
  const mouseY = window.innerHeight / 2;

  // Set the position of the popup immediately
  const scrollY = window.scrollY;
  popup.firstChild.style.position = 'absolute';
  popup.firstChild.style.left = `${mouseX}px`;
  popup.firstChild.style.top = `${mouseY + scrollY}px`;

  setTimeout(() => {
    const innerDiv = popup.firstChild;
    innerDiv.style.transition = 'opacity 0.5s';
    innerDiv.style.opacity = '0';
    setTimeout(() => {
      popup.remove();
    }, 600);
  }, 1000);
};



const copyPrompt = async (prompt) => {
  await navigator.clipboard.writeText(prompt);
};

const processImages = () => {
  document.querySelectorAll('img[alt^="Image made with A"]:not([data-listener-added])').forEach(img => {
    img.setAttribute('data-listener-added', 'true');
    img.addEventListener('click', () => {
      const prompt = img.alt.split('Prompt: ')[1];
      if (!prompt) return;
      copyPrompt(prompt);

      let text = `Copied!<br><br>Prompt:<br>${prompt}`;

      showPopup(text);

    });
  });
};

document.addEventListener('DOMContentLoaded', processImages);
window.addEventListener('scroll', processImages);
