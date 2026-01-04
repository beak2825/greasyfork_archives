// ==UserScript==
// @name         hats
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Меняет цвет новогодних шапок на аватарах пользователей каждые x секунды
// @author       залупик
// @match        *://lolz.live/*
// @match        *://lolz.guru/*
// @match        *://zelenka.guru/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520731/hats.user.js
// @updateURL https://update.greasyfork.org/scripts/520731/hats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

  function addHatsToAvatars() {
      const avatarHolders = document.querySelectorAll('.avatar[data-avatarhtml="true"]');

      avatarHolders.forEach(holder => {
          if (!holder.querySelector('.new_year_hat_2025') && !holder.parentElement.querySelector('.new_year_hat_2025')) {
              const hatDiv = document.createElement('div');
              hatDiv.className = 'new_year_hat_2025';
              hatDiv.style.position = 'absolute';
              hatDiv.style.top = '0';
              hatDiv.style.left = '79%';
              hatDiv.style.transform = 'translateX(-50%)';

              hatDiv.innerHTML = `
                  <svg class="hat_ny_icon" xmlns="http://www.w3.org/2000/svg" width="44" height="41" viewBox="0 0 34 31" fill="none">
                      <path class="new_year_hat_color_one" d="M27.6166 20.0931C27.2995 19.8811 26.9582 19.7388 26.6138 19.6622L23.8742 11.3585C23.2607 9.50056 21.9004 8.05489 19.991 7.32358L15.8535 5.7345C13.0987 4.67641 10.3192 5.10067 8.37227 6.87545L5.42277 9.56647C4.27811 9.15491 3.0198 9.46724 2.39164 10.4068L1.37616 11.9258C0.618709 13.0587 1.05239 14.6878 2.3376 15.547L17.453 25.6523C18.7382 26.5116 20.4093 26.2897 21.1667 25.1567L22.1822 23.6378C22.8104 22.6982 22.6181 21.416 21.8 20.516L22.6509 18.2037L24.3172 20.2791C24.2337 20.3662 24.1563 20.4616 24.0875 20.5645C23.3675 21.6414 23.7778 23.1882 25.0013 24.0061C26.2243 24.8238 27.8106 24.6125 28.5309 23.5351C29.2507 22.4574 28.8401 20.9111 27.6166 20.0931V20.0931Z" fill="#db87e9"></path>
                      <path class="new_year_hat_color_two" d="M6.10544 9.9112L21.2208 20.0165C22.506 20.8757 22.9389 22.506 22.1822 23.6378L21.1668 25.1567C20.4093 26.2897 18.7382 26.5116 17.453 25.6524L2.33761 15.547C1.05239 14.6878 0.618715 13.0588 1.37617 11.9258L2.39165 10.4068C3.14827 9.27511 4.82022 9.05197 6.10544 9.9112V9.9112Z" fill="#EDEDED"></path>
                      <path class="new_year_hat_color_three" d="M25.0008 24.0058C26.2238 24.8234 27.8101 24.6121 28.5304 23.5347C29.2504 22.4578 28.8401 20.911 27.6166 20.0931C26.3936 19.2754 24.8073 19.4868 24.087 20.5642C23.367 21.6411 23.7778 23.1882 25.0008 24.0058Z" fill="#EDEDED"></path>
                      <path class="new_year_hat_color_four" d="M26.9991 23.6597C25.7761 22.8421 25.3651 21.2955 26.0853 20.2181C26.2335 19.9965 26.4187 19.8122 26.6294 19.6654C25.6399 19.4399 24.6236 19.7615 24.0873 20.5637C23.3673 21.6407 23.7776 23.1874 25.0011 24.0054C25.9729 24.6551 27.1729 24.6545 27.9866 24.087C27.6472 24.0102 27.3116 23.8686 26.9991 23.6597Z" fill="#db87e9"></path>
                      <path class="new_year_hat_color_five" d="M21.8002 20.5155L22.6512 18.2033L24.3175 20.2786C24.8815 19.6919 25.7569 19.4719 26.6142 19.6625C26.6142 19.6625 26.131 19.1593 25.4233 18.9744C25.0995 18.8895 24.8292 18.6481 24.7215 18.3431C24.3893 17.4028 23.6596 15.4341 22.7496 13.5791C22.4919 13.0537 21.694 13.119 21.6728 13.6699C21.6473 14.3314 21.403 14.9049 20.7469 15.1773C18.6394 16.052 12.316 13.8717 11.2569 13.3557L21.2214 20.0175C21.4395 20.1627 21.6323 20.3312 21.8002 20.5155V20.5155Z" fill="#db87e9"></path>
                  </svg>
              `;
              holder.parentElement.appendChild(hatDiv);
          }
      });
  }


  function changeHatColors() {
      const hatHolders = document.querySelectorAll('.new_year_hat_2025');
      hatHolders.forEach(holder => {
          const randomColor = getRandomColor();
          const hatElements = holder.querySelectorAll('.new_year_hat_color_one, .new_year_hat_color_three, .new_year_hat_color_four, .new_year_hat_color_five');

          hatElements.forEach(hat => {
              hat.setAttribute('fill', randomColor);
          });
      });
  }



    setInterval(() => {
        addHatsToAvatars();
        changeHatColors();
    }, 40);
})();

