// ==UserScript==
// @name ✅ Améliorer POE.COM
// @name:en ✅ Improve POE.COM
// @namespace http://tampermonkey.net/
// @author MaleZoR
// @version 0.13
// @description Masque les éléments spécifiés dans la page, modifie l'arrière-plan en transparent et améliore l'expérience utilisateur sur POE.COM
// @description:en Hides specified elements on the page, makes the background transparent, and improves the user experience on POE.COM
// @match https://poe.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_log
// @license MaleZoR
// @downloadURL https://update.greasyfork.org/scripts/464266/%E2%9C%85%20Am%C3%A9liorer%20POECOM.user.js
// @updateURL https://update.greasyfork.org/scripts/464266/%E2%9C%85%20Am%C3%A9liorer%20POECOM.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Sélectionne les éléments à masquer
  const selectorsToHide = [
    '#__next > div.PageWithSidebarLayout_centeringDiv___L9br > aside',
    '#__next > div.PageWithSidebarLayout_centeringDiv___L9br > div',
    '.ChatMessageInputView_paintbrushWraper__DHMNW',
    '.ChatMessageFeedbackButtons_feedbackButtonsContainer__0Xd3I',
    '.PageWithSidebarNavbar_navbar__LpjAK',
  ];

  // Masque les éléments sélectionnés
  selectorsToHide.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'none';
    }
  });

  // Ajoute les styles CSS
  GM_addStyle(`
    body {
      background-color: transparent !important;
    }

    .ChatMessageFeedbackButtons_feedbackButtonsContainer__0Xd3I {
      display: none;
    }

    @media screen and (min-width: 685px) {
    .PageWithSidebarLayout_mainSection__i1yOg {
      border-left: 0px;
      border-right: 0px;
    }
}

    .Message_row___ur0Y {
      margin-top: 10px;
    }

    .DropdownMenu_wrapper__7gVrP {
      display: none;
    }

    .ChatMessagesView_infiniteScroll__K_SeP, .ChatMessagesView_messagePair__CsQMW {
      display: flex;
      flex-direction: column;
      row-gap: 0px;
      column-gap: 0px;
    }

    .ChatMessagesView_infiniteScroll__K_SeP {
      margin-top: 0px;
      margin-right: 0px;
      margin-bottom: 0px;
      margin-left: 0px;
    }

    .Button_button__GWnCw:not([data-variant^=borderless]) {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      border-radius: 0.5em;
      background: transparent;
    }

    .ChatMessageInputView_growWrap__mX_pX:after, .ChatMessageInputView_growWrap__mX_pX>.ChatMessageInputView_textInput__Aervw {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      border-radius: 0.5em;
      margin-top: 10px;
      background: rgb(10, 10, 12);
    }

    .Message_botMessageBubble__CPGMI, .Message_humanMessageBubble__Nld4j {
      margin-bottom: 10px;
      width: 100%;
      border-radius: 1em;
    }

    .Message_botMessageBubble__CPGMI {
      margin-bottom: 10px;
      width: 100%;
      border-radius: 1em;
      background-color: #474b57;
    }

    .PageWithSidebarLayout_centeringDiv___L9br {
      position: relative;
    }

    .PageWithSidebarLayout_mainSection__i1yOg {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      max-width: 95%;
      width: 95%;
    }

    .ChatMessageInputView_growWrap__mX_pX:after,
    .ChatMessageInputView_growWrap__mX_pX > .ChatMessageInputView_textInput__Aervw {
      flex-grow: 1;
      background-color: var(--input-background-color) !important;
    }


    ol {
      font-style: italic;
    }
  `);

  // Styles pour le mode sombre
  GM_addStyle(`
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-white: #222b44 !important;
        --bg-purple-bubble: #24262c;
        --input-background-color: #474b57 !important;
      }
    }
  `);

  // Modifier la valeur de l'attribut placeholder de l'input de chat
  const inputElement = document.querySelector('.ChatMessageInputView_textInput__Aervw');
  inputElement.setAttribute('placeholder', 'Saisissez un message...');
})();
