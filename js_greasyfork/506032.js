// ==UserScript==
// @name        snowy tofthread
// @namespace   Violentmonkey Scripts
// @match       https://2ch.hk/gacha/res/3269757.html*
// @grant       none
// @version     1.0
// @author      shiro
// @description 8/31/2024, 12:06:17 PM
// @downloadURL https://update.greasyfork.org/scripts/506032/snowy%20tofthread.user.js
// @updateURL https://update.greasyfork.org/scripts/506032/snowy%20tofthread.meta.js
// ==/UserScript==

function fc_spawn_snow(flake_count) {
  let random_range = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let snowflake_name = 'js-snowflake';

  let rule = `.${snowflake_name} {
    position: absolute;
    width: 10px;
    height: 10px;
    background: linear-gradient(white, white);
    border-radius: 50%;
    filter: drop-shadow(0 0 10px white);
  }`;

  for(let i = 1; i < flake_count; i++){
    let random_x = Math.random() * 100; // vw
    let random_offset = random_range(-100000, 100000) * 0.0001; // vw;
    let random_x_end = random_x + random_offset;
    let random_x_end_yoyo = random_x + (random_offset / 2);
    let random_yoyo_time = random_range(30000, 80000) / 100000;
    let random_yoyo_y = random_yoyo_time * 100; // vh
    let random_scale = Math.random() * (1.0 - 0.2) + 0.2;
    let alpha = Math.random() * (1.0 - 0.1) + 0.1;
    let fall_duration = 15 + 21 * (1 - alpha); // s
    let fall_delay = (Math.floor(Math.random() * 36) + 1) * -1; // s


    rule += `
    .${snowflake_name}:nth-child(${i}) {
        opacity: ${alpha};
        transform: translate(${random_x}vw, -10px) scale(${random_scale});
        animation: fall-${i} ${fall_duration}s ${fall_delay}s linear infinite;
    }

    @keyframes fall-${i} {
        ${random_yoyo_time * 100}% {
            transform: translate(${random_x_end}vw, ${random_yoyo_y}vh) scale(${random_scale});
        }

        to {
            transform: translate(${random_x_end_yoyo}vw, 100vh) scale(${random_scale});
        }

    }
    `
  }

  let cnt = document.createElement('div');
  cnt.id = 'js-snowfield';
  cnt.style.position = 'fixed';
  cnt.style.top = '0';
  cnt.style.pointerEvents = 'none';

  for(let i = 1; i < flake_count; i++){
    let flake = document.createElement('div');
    flake.className = snowflake_name;
    cnt.appendChild(flake);
  }

  let css = document.createElement('style');
  css.type = 'text/css';
  css.textContent = rule;
  document.getElementsByTagName('head')[0].appendChild(css);

  document.body.appendChild(cnt);
}

function fc_remove_snow() {
  let el = document.getElementById('js-snowfield');
  el && el.parentNode.removeChild(el);
}

function fc_tomorrow_init() {
  if (window.matchMedia && window.matchMedia('(min-width: 481px)').matches) {
      fc_spawn_snow(Math.floor(Math.random() * 50) + 50);
  } else {
    // mobile
    fc_spawn_snow(Math.floor(Math.random() * 10) + 10);
  }
}

function fc_tomorrow_cleanup() {
  fc_remove_snow();
}

if (!window.snow_activated) {
    window.snow_activated = true;
    fc_tomorrow_init();
    setTimeout(() => window.sf && window.sf.destroy(), 1000);
}
