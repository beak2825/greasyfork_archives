// ==UserScript==
// @name        Hamro Csit
// @namespace   Violentmonkey Scripts
// @match       https://*.hamrocsit.com/*
// @grant       none
// @version     1.0
// @author      Sush
// @description 12/5/2024, 4:16:52 PM
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/520142/Hamro%20Csit.user.js
// @updateURL https://update.greasyfork.org/scripts/520142/Hamro%20Csit.meta.js
// ==/UserScript==

  /* Enables Premium */
  tucsitnotes.hassubscription=true

  /* Removes junk */
  let styles = `
    #credential_picker_container,
    .messanger_floating,
    .list-account-info,
    .style-switcher,

    .menu-item[style="position:relative;"],

    .docs-overview .row .col-md-3,
    .category-area .col-md-2,
    .course-single .col-md-3:not(.question-bank-sidebar),

    .feature-area,
    .step-area,
    .cta-area {
      display: none !important;
    }
    .row {
      justify-content: center !important;
    }

    .course-single-tab .nav .nav-link,
    .question-bank-sidebar {
      display: block !important;
      color: white !important;
    }
  `
  let styleSheet = document.createElement("style")
  styleSheet.innerHTML = styles
  document.head.appendChild(styleSheet)

  $('.question-bank-sidebar').show()

  /* Enables dark theme */
  toggleTheme(true)

  $('#qnBankAnswersModal').on('click', () => {
    const btn = document.querySelector('.btn-close')
    const clickEvent = new MouseEvent("click", {
      "view": window,

    });
    btn.dispatchEvent(clickEvent)
  })

  /* Removes banner ads */
  const allImg = document.getElementsByTagName('img')
  console.log(allImg)

  for (var img of allImg) {
    if (img.src.includes('.gif?') || img.src.endsWith('.gif')) {
      $(img).parent().hide()
    }
  }