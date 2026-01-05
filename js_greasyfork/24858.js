// ==UserScript==
// @name         Dancing Cat Animation for Toradorable Skin Changer
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Dancing Cat Animation for a Toradorable skin changer.
// @author       Toradorable
// @grant        none
// @require      https://greasyfork.org/scripts/24894-toradorable-animator/code/Toradorable%20Animator.js
// ==/UserScript==

animator.addAnimation(
    {title:"Dancing Cat",
     frames: [
         {time: 500, url: "https://s11.postimg.org/51bh2tc6r/frame_0_delay_0_5s.gif", nick: "Cat"},
         {time: 500, url: "https://s11.postimg.org/uy55fffub/frame_1_delay_0_5s.gif", nick: "Im A Kitty Cat"},
         {time: 800, url: "https://s11.postimg.org/po06o4vlf/frame_2_delay_0_8s.gif", nick: "Im A Kitty Cat"},
         {time: 200, url: "https://s11.postimg.org/8or88vkdv/frame_3_delay_0_2s.gif", nick: "And I"},
         {time: 200, url: "https://s11.postimg.org/nyr3g2fw3/frame_4_delay_0_2s.gif", nick: "And I Dance"},
         {time: 200, url: "https://s11.postimg.org/6zi50t4oj/frame_5_delay_0_2s.gif", nick: "And I Dance Dance"},
         {time: 200, url: "https://s11.postimg.org/coydl4aur/frame_6_delay_0_2s.gif", nick: "I Dance Dance Dance"},
         {time: 200, url: "https://s11.postimg.org/dsihx2vhv/frame_7_delay_0_2s.gif", nick: "And I"},
         {time: 200, url: "https://s11.postimg.org/6dxrifz03/frame_8_delay_0_2s.gif", nick: "And I Dance"},
         {time: 200, url: "https://s11.postimg.org/74qho81df/frame_9_delay_0_2s.gif", nick: "And I Dance Dance"},
         {time: 500, url: "https://s11.postimg.org/p8ti8uz1v/frame_10_delay_0_5s.gif", nick: "I Dance Dance Dance"}
    ]}
);