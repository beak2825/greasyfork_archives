// ==UserScript==
// @name         Lepra Opacity Origin
// @version      v.0.1
// @description  Скрипт для https://leprosorium.ru/ для скрытия всего загруженных видео и картинок.Можно адаптировать для всех других сайтов добавив строчку с // @match
// @author       Dru1v1v1er
// @match      *.leprosorium.ru/*
// @license MIT

// @namespace https://greasyfork.org/users/1053395
// @downloadURL https://update.greasyfork.org/scripts/487716/Lepra%20Opacity%20Origin.user.js
// @updateURL https://update.greasyfork.org/scripts/487716/Lepra%20Opacity%20Origin.meta.js
// ==/UserScript==
// Установим желаемую прозрачность. 1 - все видно, 0 - ничего не видно
const OPACITY_VALUE = 0.05;


const TRANSITION_PROPERTY = 'opacity';
// Выберем скорость видимости невидимости, 0.2s - все быстро пропадает, 1s - не сразу появляется
const TRANSITION_DURATION_OUT = '0.2s';
const TRANSITION_DURATION_IN = '1s';

const TRANSITION_TIMING_FUNCTION_OUT = 'ease-in-out';
const TRANSITION_TIMING_FUNCTION_IN = 'ease-out';


const mediaElements = document.querySelectorAll('img, video');

mediaElements.forEach((element) => {
  element.style.opacity = OPACITY_VALUE;
  element.style.transition = `${TRANSITION_PROPERTY} ${TRANSITION_DURATION_OUT} ${TRANSITION_TIMING_FUNCTION_OUT}`;
});

mediaElements.forEach((element) => {
  element.addEventListener('mouseenter', () => {
    element.style.opacity = 1;
    element.style.transition = `${TRANSITION_PROPERTY} ${TRANSITION_DURATION_IN} ${TRANSITION_TIMING_FUNCTION_IN}`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.opacity = OPACITY_VALUE;
    element.style.transition = `${TRANSITION_PROPERTY} ${TRANSITION_DURATION_OUT} ${TRANSITION_TIMING_FUNCTION_OUT}`;
  });
});
