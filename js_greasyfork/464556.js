// ==UserScript==
// @name        YouTube Color
// @description A colorful YouTube
// @match       https://*.youtube.com/*
// @license     MIT
// @version 0.0.1.20230421113649
// @namespace https://greasyfork.org/users/1063001
// @downloadURL https://update.greasyfork.org/scripts/464556/YouTube%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/464556/YouTube%20Color.meta.js
// ==/UserScript==
if (window.location.href.includes('youtube.com')) {
  const colors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#00FFFF', '#0000FF', '#800080', '#FFC0CB', '#00FF00', '#FF00FF', '#6A5ACD', '#FF69B4', '#FFD700', '#32CD32', '#00FA9A', '#40E0D0', '#1E90FF', '#8B0000', '#FF4500', '#FF8C00', '#9932CC'];
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes changeColor {
      0% {
        color: ${colors[0]};
      }
    5% {
        color: ${colors[colors.length - 20]};
      }
    10% {
        color: ${colors[colors.length - 19]};
      }
    15% {
        color: ${colors[colors.length - 18]};
      }
    20% {
        color: ${colors[colors.length - 17]};
      }
    25% {
        color: ${colors[colors.length - 16]};
      }
    30% {
        color: ${colors[colors.length - 15]};
      }
    35% {
        color: ${colors[colors.length - 14]};
      }
    40% {
        color: ${colors[colors.length - 13]};
      }
    45% {
        color: ${colors[colors.length - 12]};
      }
    50% {
        color: ${colors[colors.length - 11]};
      }
    55% {
        color: ${colors[colors.length - 10]};
      }
    60% {
        color: ${colors[colors.length - 9]};
      }
    65% {
        color: ${colors[colors.length - 8]};
      }
    70% {
        color: ${colors[colors.length - 7]};
      }
    75% {
        color: ${colors[colors.length - 6]};
      }
    80% {
        color: ${colors[colors.length - 5]};
      }
    85% {
        color: ${colors[colors.length - 4]};
      }
    90% {
        color: ${colors[colors.length - 3]};
      }
    95% {
        color: ${colors[colors.length - 2]};
      }
    100% {
        color: ${colors[colors.length - 1]};
      }
    }
  *
     {
      animation-name: changeColor;
      animation-duration: 20s;
      animation-iteration-count: infinite;
    }
  `;
  document.head.appendChild(style);
}