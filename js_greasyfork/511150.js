// ==UserScript==
// @name           250 Gartic Room
// @description    Install this script and then visit https://gartic.io/?stragon link
// @version        1.0
// @author         STRAGON
// @license        N/A
// @match          *://gartic.io/*
// @icon           https://static.cdnlogo.com/logos/s/96/st.svg
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x

// @downloadURL https://update.greasyfork.org/scripts/511150/250%20Gartic%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/511150/250%20Gartic%20Room.meta.js
// ==/UserScript==

if(window.location.href.indexOf("?stragon")!=-1){
  document.body.innerHTML = `
  <div class="users" style="
    display: flex !important;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow-y: scroll;
    width: 100%;
    height: 100vh;
    background-image: url('https://motionbgs.com/dl/gif/753');
    background-size: cover;
    color: white;
  ">
    <div id="room-text"><h1>250 𝓡𝓞𝓞𝓜𝓢</h1></div>
    <div id="squares-container"></div>
  </div>
`;

setTimeout(function() {
  document.getElementById("room-text").style.display = "none";
}, 2000);

setTimeout(function() {
  const squaresContainer = document.getElementById("squares-container");
  const images1 = [
    "https://gartic.io/static/images/subjects/19.svg?v=1",
    "https://gartic.io/static/images/subjects/1.svg?v=1",
    "https://gartic.io/static/images/subjects/19.svg?v=1",
    "https://gartic.io/static/images/subjects/1.svg?v=1",
    "https://gartic.io/static/images/subjects/19.svg?v=1",
    "https://gartic.io/static/images/subjects/1.svg?v=1",
    "https://gartic.io/static/images/subjects/7.svg?v=1",
    "https://gartic.io/static/images/subjects/1.svg?v=1",
    "https://gartic.io/static/images/subjects/19.svg?v=1",
    "https://gartic.io/static/images/subjects/1.svg?v=1",
    "https://gartic.io/static/images/subjects/19.svg?v=1",
    "https://gartic.io/static/images/subjects/1.svg?v=1",
    "https://gartic.io/static/images/subjects/19.svg?v=1",
    "https://gartic.io/static/images/subjects/1.svg?v=1",
  ];
  const images2 = [
    "https://dl.shut.ir/public/file/2023/5/10/%D8%B9%DA%A9%D8%B3-%D9%BE%D8%B1%DA%86%D9%85-%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-%D8%AF%D8%A7%DB%8C%D8%B1%D9%87-%D8%A7%DB%8C.png",
    "https://dl.shut.ir/public/file/2023/5/10/%D8%B9%DA%A9%D8%B3-%D9%BE%D8%B1%DA%86%D9%85-%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-%D8%AF%D8%A7%DB%8C%D8%B1%D9%87-%D8%A7%DB%8C.png",
    "https://rasanika.com/storage/i/17225/h0sF0JVefm8oy73M/orig-900/circle.webp",
    "https://rasanika.com/storage/i/17225/h0sF0JVefm8oy73M/orig-900/circle.webp",
    "https://shut.ir/storage/image/2023/8/30/%D8%B9%DA%A9%D8%B3-%D9%BE%D8%B1%DA%86%D9%85-%D8%A2%D9%85%D8%B1%DB%8C%DA%A9%D8%A7-%D8%AF%D8%A7%DB%8C%D8%B1%D9%87-%D8%A7%DB%8C.webp",
    "https://shut.ir/storage/image/2023/8/30/%D8%B9%DA%A9%D8%B3-%D9%BE%D8%B1%DA%86%D9%85-%D8%A2%D9%85%D8%B1%DB%8C%DA%A9%D8%A7-%D8%AF%D8%A7%DB%8C%D8%B1%D9%87-%D8%A7%DB%8C.webp",
    "https://media.qudsonline.ir/d/2017/07/05/4/737104.jpg",
    "https://media.qudsonline.ir/d/2017/07/05/4/737104.jpg",
    "https://rasanika.com/storage/i/17223/kiM0_ja0UcPhi78P/orig-900/flag.webp",
    "https://rasanika.com/storage/i/17223/kiM0_ja0UcPhi78P/orig-900/flag.webp",
          "https://rasanika.com/storage/i/17215/-DGVZAHKzvTA6FH8/orig-900/azerbaijan.webp",
    "https://rasanika.com/storage/i/17215/-DGVZAHKzvTA6FH8/orig-900/azerbaijan.webp",
  ];
    const links = [
    "https://gartic.io/64j1aQ",
    "https://gartic.io/641IqM",
    "https://gartic.io/38j1aV",
    "https://gartic.io/3816Tw",
    "https://gartic.io/32j1aW",
    "https://gartic.io/321Ir2",
    "https://gartic.io/497IcN",
    "https://gartic.io/491Ir0",
    "https://gartic.io/31j1aZ",
    "https://gartic.io/311Ir1",
    "https://gartic.io/53j1aY",
    "https://gartic.io/53178D",
  ];
  squaresContainer.innerHTML = `
    ${Array(12).fill('').map((_, i) => `
      <div style="
        width: 287px;
        height: 80px;
        border-radius: 150px;
        background-color: #000;
        margin: 10px;
        display: inline-block;
        position: relative;

      ">
        <img src="${images1[i]}" style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        ">
        <img src="${images2[i]}" style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: absolute;
          left: 80px;
          top: 50%;
          transform: translateY(-50%);
        ">
        <a href="${links[i]}" target="_blank" style="
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background-color: red;
          color: black;
          padding: 10px 20px;
          border-radius: 100px;
          text-decoration: none;
        ">OPEN</a>
      </div>
    `).join('')}
  `;
}, 2000);}