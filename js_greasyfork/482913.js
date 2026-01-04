// ==UserScript==
// @name        community banners
// @namespace   Violentmonkey Scripts
// @match       https://kbin.social/m/*
// @grant       none
// @version     1.0
// @author      minnie
// @description 12/22/2023, 4:50:24 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482913/community%20banners.user.js
// @updateURL https://update.greasyfork.org/scripts/482913/community%20banners.meta.js
// ==/UserScript==



if (window.location.href.includes('/m/')) {

    const magIcon = document.querySelector('section.magazine.section div.row figure img');
    const magHeader = document.querySelector('section.magazine.section div.row header h4 a');
    const magName = magHeader.getAttribute('href');
    let cssRules;
    // console.log('Magazine Icon URL:', magIconURL, 'Mag Name: ', magName);

    const styleElement = document.createElement('style');

    if (magIcon) {
      let magIconURL = magIcon.getAttribute('src');


      cssRules = `
        h1[hidden] {
        height: 12vh;
        background-image: url(${magIconURL});
        background-size: cover;
        background-size: 150%;
        background-position: center;
        display: block;
        color: transparent;
        user-select: none;
        margin: 0.50rem 0;
        border-radius: 3px;
        backdrop-filter: blur(10px);
        }


        h1[hidden]::before {
            content: "";
            position: absolute;
            background-color: rgba(0, 0, 0, .5);
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 3px;
            backdrop-filter: blur(15px);
            z-index: -1;

        }


        h1[hidden]::before {
          content: "${magName}" !important;
          color: white;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(15px);
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }
      `;
    } else {
      const noIcon = 'https://www.color-meanings.com/wp-content/uploads/Purple-and-pink-gradient-pattern.jpeg';
        cssRules = `
          h1[hidden] {
          height: 12vh;
          background-image: url(${noIcon});
          background-size: cover;
          background-position: center;
          display: block;
          color: transparent;
          user-select: none;
          margin: 0.50rem 0;
          border-radius: 3px;
          backdrop-filter: blur(10px);
          }


          h1[hidden]::before {
              content: "";
              position: absolute;
              background-color: rgba(0, 0, 0, .5);
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 3px;
              backdrop-filter: blur(1px);
              z-index: -1;

          }


          h1[hidden]::before {
            content: "${magName}" !important;
            color: white;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 4;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
          }
        `;
    }


   styleElement.textContent = cssRules;

   document.head.appendChild(styleElement);


}