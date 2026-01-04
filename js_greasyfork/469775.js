// ==UserScript==
// @name         ChatGPT 2 HackMD
// @namespace    https://github.com/EastSun5566
// @version      0.0.13
// @description  Ship some ChatGPT conversions to HackMD
// @author       Michael Wang
// @license      MIT
// @homepageURL  https://github.com/EastSun5566
// @match        https://chat.openai.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackmd.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469775/ChatGPT%202%20HackMD.user.js
// @updateURL https://update.greasyfork.org/scripts/469775/ChatGPT%202%20HackMD.meta.js
// ==/UserScript==

// @ts-check

(function () {
  /**
   * @param {string} html
   * @see {@link https://www.reddit.com/r/ChatGPT/comments/zm237o/save_your_chatgpt_conversation_as_a_markdown_file}
   */
  function h(html) {
    return html.replace(/<p>/g, '\n\n')
      .replace(/<\/p>/g, '')
      .replace(/<b>/g, '**')
      .replace(/<\/b>/g, '**')
      .replace(/<i>/g, '_')
      .replace(/<\/i>/g, '_')
      .replace(/<code[^>]*>/g, (match) => {
        const lm = match.match(/class="[^"]*language-([^"]*)"/);
        return lm ? `\n\`\`\`${lm[1]}\n` : '```';
      })
      .replace(/<\/code[^>]*>/g, '```')
      .replace(/<[^>]*>/g, '')
      .replace(/Copy code/g, '')
      .replace(/This content may violate our content policy. If you believe this to be in error, please submit your feedback — your input will aid our research in this area./g, '')
      .trim();
  }

  function ship() {
    const messages = document.querySelectorAll('.text-base');
    let text = '';
    for (const message of messages) {
      const warp = message.querySelector('.whitespace-pre-wrap');
      if (warp) {
        text += `**${message.querySelector('img') ? 'You' : 'ChatGPT'}**: ${h(warp.innerHTML)}\n\n`;
      }
    }

    const output = [
      `[${document.title}](${window.location.href})`,
      '',
      `\`${new Date().toLocaleString()}\``,
      ...text.split(/\n/g).map((t) => ` > ${t}`),
      '',
    ].join('\n');
    window.open(`https://hackmd.io/new?title=${encodeURIComponent(output)}`);
  }

  const BUTTON_ID = 'ship-to-hackmd';
  function mountButton() {
    if (document.body.querySelector(`#${BUTTON_ID}`)) return;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.title = 'Ship to HackMD';
    button.style.position = 'absolute';
    button.style.right = '1.5rem';
    button.style.bottom = '4rem';
    button.addEventListener('click', ship);

    const icon = document.createElement('img');
    icon.src = 'https://www.google.com/s2/favicons?sz=64&domain=hackmd.io';
    icon.style.width = '1.5rem';
    button.appendChild(icon);

    document.body.appendChild(button);
  }

  mountButton();
}());
