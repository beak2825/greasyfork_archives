// ==UserScript==
// @name         Blacket Full Theme Switcher Movable
// @version      1.5.0
// @description  Cycle through full page themes including Original, Amoled, Red, Orange, Yellow, Green, Blue, Purple, Pink, and White on Blacket! Movable panel with Titan One font.
// @icon         https://blacket.org/content/logo.png
// @author       monkxy#0001
// @namespace    http://monkxy.com
// @match        https://*.blacket.org/*
// @require      https://blacket.org/lib/js/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/538499/Blacket%20Full%20Theme%20Switcher%20Movable.user.js
// @updateURL https://update.greasyfork.org/scripts/538499/Blacket%20Full%20Theme%20Switcher%20Movable.meta.js
// ==/UserScript==

(() => {
  const $ = jQuery;

  // Load Titan One font if not present
  if (!$("link[href*='Titan+One']").length) {
    $("head").append('<link href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap" rel="stylesheet">');
  }

  // Themes list as before
  const themes = [
     {
      name: "Original",
      css: `
        /* No overrides, original Blacket.org styling */
        /* This resets to the site's default look */
        #blacket-theme-style { display: none !important; }
      `
    },
    {
      name: "Amoled",
      css: `
        /* Amoled theme overrides */
        #blacket-theme-style { display: block !important; }
        .styles__blooketText___1pMBG-camelCase {
            font-size: 40px;
            font-family: Titan One, sans-serif;
            text-decoration: none;
            color: white;
            filter: drop-shadow(0px 0px 5px white);
            margin-bottom: 20px;
            text-align: center;
        }
        .styles__background___2J-JA-camelCase {
            background-color: #000 !important;
        }
        .styles__bazaarItem___Meg69-camelCase {
            background-color: #111111 !important;
            transition: 0.2s ease-in-out;
        }
        .styles__bazaarItem___Meg69-camelCase:hover {
            background-color: #222222 !important;
            transform: scale(1.05);
        }
        .styles__bazaarItems___KmNa2-camelCase,
        .styles__blookGridContainer___AK47P-camelCase,
        .styles__cardContainer___NGmjp-camelCase,
        .styles__chatCurrentRoom___MCaV4-camelCase,
        .styles__chatInputContainer___gkR4A-camelCase,
        .styles__chatRoomsListContainer___Gk4Av-camelCase,
        .styles__chatRoomsTitle___fR4Av-camelCase,
        .styles__chatRooms___o5ASb-camelCase,
        .styles__container___1BPm9-camelCase,
        .styles__container___2VzTy-camelCase,
        .styles__container___3St5B-camelCase,
        .styles__containerHeader___3xghM-camelCase,
        .styles__containerHeaderInside___2omQm-camelCase,
        .styles__containerHeaderRight___3xghM-camelCase,
        .styles__containerHeaderRightFriends___3xghM-camelCase,
        .styles__editHeaderContainer___2G1ji-camelCase,
        .styles__formsForm___MvA35-camelCase,
        .styles__header___22Ne2-camelCase,
        .styles__header___2O21B-camelCase,
        .styles__headerBadgeBg___12ogR-camelCase,
        .styles__headerSide___1r1-b-camelCase,
        .styles__infoContainer___2uI-S-camelCase,
        .styles__input___2XTSp-camelCase,
        .styles__left___9beun-camelCase,
        .styles__myTokenAmount___ANKHA-camelCase,
        .styles__otherTokenAmount___SEGGS-camelCase,
        .styles__postsContainer___39_IQ-camelCase,
        .styles__profileContainer___CSuIE-camelCase,
        .styles__profileDropdownMenu___2jUAA-camelCase,
        .styles__profileDropdownOption___ljZXD-camelCase,
        .styles__rightButtonInside___14imT-camelCase,
        .styles__sidebar___1XqWi-camelCase,
        .styles__signUpButton___3_ch3-camelCase,
        .styles__statContainer___QKuOF-camelCase,
        .styles__statsContainer___QnrRB-camelCase,
        .styles__toastContainer___o4pCa-camelCase,
        .styles__tokenContainer___3yBv--camelCase,
        .styles__tradingContainer___B1ABS-camelCase {
            background-color: #000 !important;
        }
        .styles__chatEmojiButton___8RFa2-camelCase,
        .styles__chatUploadButton___g39Ac-camelCase {
            background-color: #000 !important;
            transition: 0.2s ease-in-out;
        }
        .styles__chatEmojiButton___8RFa2-camelCase:hover,
        .styles__chatUploadButton___g39Ac-camelCase:hover {
            background-color: #111111 !important;
        }
        .styles__button___2hNZo-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: #000 !important;
        }
        .styles__buttonInside___39vdp-camelCase,
        .styles__front___vcvuy-camelCase {
            background-color: #fff !important;
            color: #000 !important;
        }
        .styles__edge___3eWfq-camelCase,
        .styles__horizontalBlookGridLine___4SAvz-camelCase,
        .styles__verticalBlookGridLine___rQWaZ-camelCase,
        hr {
            background-color: #fff !important;
        }
        #searchInput,
        textarea,
        input,
        .toastMessage {
            background-color: #000 !important;
        }
        .styles__loginButton___1e3jI-camelCase {
            background-color: #fff !important;
            color: #000 !important;
        }
        .styles__profileDropdownOption___ljZXD-camelCase:hover {
            background-color: #111111 !important;
        }
      `
    },
{
  name: "Red",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #b31313 !important;
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #d72e2e !important;
    }

    textarea, input, button {
      background-color: #d62b2b !important;
      color: white !important;
      border-color: #a31313 !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #8e0d0d !important;
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
},



{
  name: "Orange",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #ff6f00 !important; /* orange */
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #ff9100 !important; /* lighter orange */
    }

    textarea, input, button {
      background-color: #ff8f00 !important;
      color: white !important;
      border-color: #cc5a00 !important; /* darker orange border */
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #cc5200 !important; /* darker hover */
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
},
{
  name: "Yellow",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #b38f00 !important;
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #d7ae00 !important;
    }

    textarea, input, button {
      background-color: #d6ab00 !important;
      color: white !important;
      border-color: #a38800 !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #8e6f00 !important;
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
},

    {
  name: "Green",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #1a6500 !important;
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #2ab200 !important;
    }

    textarea, input, button {
      background-color: #28b000 !important;
      color: white !important;
      border-color: #176600 !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #135300 !important;
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
},
    {
  name: "Blue",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #0048b3 !important;
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #0066ff !important;
    }

    textarea, input, button {
      background-color: #0065ff !important;
      color: white !important;
      border-color: #003d80 !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #003366 !important;
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
},
    {
  name: "Purple",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #6a00b3 !important;
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #8600ff !important;
    }

    textarea, input, button {
      background-color: #7e00ff !important;
      color: white !important;
      border-color: #4b0080 !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #4b0080 !important;
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
},

    {
  name: "Pink",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #b30089 !important;
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #d32eaf !important;
    }

    textarea, input, button {
      background-color: #d22da3 !important;
      color: white !important;
      border-color: #8a005a !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #720040 !important;
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
},
    {
  name: "White",
  css: `
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      background-color: #e6e6e6 !important;
      color: black !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: #f7f7f7 !important;
      color: black !important;
    }

    textarea, input, button {
      background-color: #f0f0f0 !important;
      color: black !important;
      border-color: #bfbfbf !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: #d6d6d6 !important;
      transform: scale(1.05);
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: black !important;
    }
  `
},
{
  name: "Rainbow",
  css: `
    @keyframes rainbowFade {
      0%   { background-color: #FF0000; } /* Red */
      16%  { background-color: #FF7F00; } /* Orange */
      33%  { background-color: #FFFF00; } /* Yellow */
      50%  { background-color: #00FF00; } /* Green */
      66%  { background-color: #0000FF; } /* Blue */
      83%  { background-color: #4B0082; } /* Indigo */
      100% { background-color: #9400D3; } /* Violet */
    }

    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__app___bM8h5-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__friendContainer___3wVox-camelCase,
    .styles__bazaarItem___Meg69-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
      animation: rainbowFade 15s infinite alternate;
      color: white !important;
    }

    .styles__stat___3f0U4-camelCase,
    .styles__friend___3ZgeG-camelCase,
    .styles__containerInner___3aRAZ-camelCase,
    .styles__profileStat___3GvPt-camelCase {
      background-color: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
    }

    textarea, input, button {
      background-color: rgba(0, 0, 0, 0.3) !important;
      color: white !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
    }

    button:hover,
    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
      background-color: rgba(0, 0, 0, 0.5) !important;
      transform: scale(1.05);
      color: white !important;
    }

    hr, .styles__edge___3eWfq-camelCase {
      background-color: white !important;
    }
  `
}

  ];


  let styleEl = $('#blacket-theme-style');
  if (styleEl.length === 0) {
    styleEl = $('<style id="blacket-theme-style"></style>');
    $('head').append(styleEl);
  }

  let currentTheme = parseInt(localStorage.getItem('blacket-theme-index')) || 0;

  function applyTheme(idx) {
    if (idx < 0 || idx >= themes.length) idx = 0;
    currentTheme = idx;
    localStorage.setItem('blacket-theme-index', currentTheme);
    if (themes[currentTheme].name === "Original") {
      styleEl.text('');
      styleEl.attr('disabled', 'disabled');
    } else {
      styleEl.removeAttr('disabled');
      styleEl.text(themes[currentTheme].css);
    }
    $('#blacket-theme-switcher-btn-text').text(`Theme: ${themes[currentTheme].name}`);
    console.log(`%c[Blacket Theme] Applied theme: ${themes[currentTheme].name}`, 'color: #0a0; font-weight: bold;');
  }

  // Create draggable panel container
  let panel = $('#blacket-theme-switcher-panel');
  if (panel.length === 0) {
    panel = $(`
      <div id="blacket-theme-switcher-panel" style="
        position: fixed;
        bottom: 15px;
        right: 15px;
        width: 160px;
        background-color: #222;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        font-family: 'Titan One', cursive, sans-serif;
        user-select: none;
        z-index: 999999;
      ">
        <div id="blacket-theme-switcher-header" style="
          cursor: move;
          padding: 8px 12px;
          font-weight: bold;
          font-size: 16px;
          background: #111;
          border-radius: 8px 8px 0 0;
          text-align: center;
        ">Theme Switcher</div>
        <button id="blacket-theme-switcher-btn" style="
          width: 100%;
          padding: 10px 0;
          border: none;
          background-color: #444;
          color: white;
          font-family: 'Titan One', cursive, sans-serif;
          font-size: 14px;
          border-radius: 0 0 8px 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        ">
          <span id="blacket-theme-switcher-btn-text">Theme: Loading...</span>
        </button>
      </div>
    `);
    $('body').append(panel);
  }

  // Drag logic
  const header = $('#blacket-theme-switcher-header');
  let isDragging = false;
  let dragStartX, dragStartY;
  let panelStartX, panelStartY;

  header.on('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const offset = panel.offset();
    panelStartX = offset.left;
    panelStartY = offset.top;
    e.preventDefault();
  });

  $(document).on('mouseup', () => {
    isDragging = false;
  });

  $(document).on('mousemove', (e) => {
    if (!isDragging) return;
    let newX = panelStartX + (e.clientX - dragStartX);
    let newY = panelStartY + (e.clientY - dragStartY);

    // Keep panel within viewport boundaries
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const panelWidth = panel.outerWidth();
    const panelHeight = panel.outerHeight();

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + panelWidth > windowWidth) newX = windowWidth - panelWidth;
    if (newY + panelHeight > windowHeight) newY = windowHeight - panelHeight;

    panel.css({ left: newX + 'px', top: newY + 'px', bottom: 'auto', right: 'auto' });
  });

  // Button click to cycle themes
  $('#blacket-theme-switcher-btn').off('click').on('click', () => {
    let next = (currentTheme + 1) % themes.length;
    applyTheme(next);
  });

  applyTheme(currentTheme);
})();
