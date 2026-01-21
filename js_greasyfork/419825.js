// ==UserScript==
// @name                 AIGPT Everywhere
// @namespace            OperaBrowserGestures
// @description          Mini A.I. floating menu that can define words, answer questions, translate, and much more in a single click and with your custom prompts. Includes useful click to search on Google and copy selected text buttons, along with Rocker+Mouse Gestures and Units+Currency+Time zone Converters, all features can be easily modified or disabled
// @version              81
// @author               hacker09
// @include              *
// @tag                  MINE!
// @tag                  AI
// @exclude              https://accounts.google.com/v3/signin/*
// @icon                 https://i.imgur.com/8iw8GOm.png
// @grant                GM_unregisterMenuCommand
// @grant                GM_registerMenuCommand
// @grant                GM_getResourceText
// @grant                GM.xmlHttpRequest
// @grant                GM_setClipboard
// @grant                GM_deleteValue
// @grant                GM_openInTab
// @grant                window.close
// @run-at               document-end
// @grant                GM_setValue
// @grant                GM_getValue
// @connect              google.com
// @connect              image.pollinations.ai
// @connect              generativelanguage.googleapis.com
// @resource             AIMenuContent https://cyber-sec0.github.io/AIMenu.html
// @require              https://update.greasyfork.org/scripts/506699/marked.js
// @require              https://unpkg.com/@highlightjs/cdn-assets/highlight.min.js
// @require              https://update.greasyfork.org/scripts/519002/Units%20Converter.js
// @require              https://update.greasyfork.org/scripts/538628/Geminmarkedi%20AI%20Stream%20Parser.js
// @downloadURL https://update.greasyfork.org/scripts/419825/AIGPT%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/419825/AIGPT%20Everywhere.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
const toHTML = html => window.trustedTypes?.createPolicy('BypassTT', { createHTML: HTML => HTML })?.createHTML(html) || html; //Bypass Trusted Types API+create safe HTML for chromium browsers

if(GM_getValue("SearchHighlight") === undefined) ["SearchHighlight", "MouseGestures", "TimeConverter", "UnitsConverter", "CurrenciesConverter"].forEach(option => GM_setValue(option, true)); //Set up everything on the first run

if ((location.href === 'https://aistudio.google.com/app/apikey' && document.querySelector(".apikey-link") !== null) && GM_getValue("APIKey") === undefined || GM_getValue("APIKey") === null || GM_getValue("APIKey") === '') { //Set up the API Key
  window.onload = setTimeout(() => {
    document.querySelectorAll(".apikey-link")[1].click(); //Click on the API Key
    setTimeout(() => {
      GM_setValue("APIKey", document.querySelector(".apikey-text").innerText); //Store the API Key
      alert((GM_getValue("APIKey") !== undefined && GM_getValue("APIKey") !== null && GM_getValue("APIKey") !== '') ? 'API Key automatically added!' : 'Failed to add API Key automatically!');
    }, 500);
  }, 1000);
}

var registeredToggleableCommandIDs = []; //Store the IDs of feature options

function AddMenu() {
  registeredToggleableCommandIDs = []; //Reset to capture new IDs from this registration pass
  ["MouseGestures", "RockerMouseGestures", "SearchHighlight", "TimeConverter", "CurrenciesConverter", "UnitsConverter"].forEach(option => {
    registeredToggleableCommandIDs.push( GM_registerMenuCommand(`${GM_getValue(option) ? "🟢 On" : "🔴 Off" } 🠞 ${option.replace(/([A-Z])/g, " $1").trim()}`, () => { GM_setValue(option, !GM_getValue(option)); location.reload(); }) );
  });
}

if (window.top === window.self) AddMenu();
//Mouse Gestures_________________________________________________________________________________________________________________________________________________________________________________
if (GM_getValue("MouseGestures") === true) //If the MouseGestures is enabled
{
  var link;

  document.querySelectorAll('a').forEach(el => {
    el.addEventListener('mouseover', function() {
      link = this.href; //Store the hovered link
    });

    el.addEventListener('mouseout', () => {
      const previousLink = link; //Save the hovered link
      setTimeout(() => {
        if (previousLink === link) { //Check if the same link is still hovered
          link = 'about:newtab'; //Open a new tab
        }
      }, 200);
    });
  });

  const funcs = { //Store the MouseGestures functions
    'DL': () => { //Detect the Down+Left movement
      GM_openInTab(location.href, { incognito: true, });
      window.top.close();
    },

    'L': () => { //Detect the Left movement
      window.history.back();
    },

    'R': () => { //Detect the Right movement
      window.history.forward();
    },

    'D': (e) => { //Detect the Down movement
      if (e.shiftKey) {
        open(link, '_blank', 'height=' + screen.height + ',width=' + screen.width);
      }
      else {
        GM_openInTab(link, { active: true, insert: true, setParent: true });
      }
    },

    'UD': () => { //Detect the Up+Down movement
      location.reload();
    },

    'DR': (e) => { //Detect the Down+Right movement
      top.close();
      e.preventDefault();
      e.stopPropagation();
    },

    'DU': () => { //Detect the Down+Up movement
      GM_openInTab(link, { active: false, insert: true, setParent: true });
    }
  };

  //Math codes to track the mouse movement gestures
  var x, y, path;
  const TOLERANCE = 3;
  const SENSITIVITY = 3;
  const s = 1 << ((7 - SENSITIVITY) << 1);
  const t1 = Math.tan(0.15708 * TOLERANCE),t2 = 1 / t1;

  const tracer = (e) => {
    var cx = e.clientX, cy = e.clientY, deltaX = cx - x, deltaY = cy - y, distance = deltaX * deltaX + deltaY * deltaY;
    if (distance > s) {
      var slope = Math.abs(deltaY / deltaX), direction = '';
      if (slope > t1) {
        direction = deltaY > 0 ? 'D' : 'U';
      } else if (slope <= t2) {
        direction = deltaX > 0 ? 'R' : 'L';
      }
      if (path.charAt(path.length - 1) !== direction) {
        path += direction;
      }
      x = cx;
      y = cy;
    }
  };

  window.addEventListener('mousedown', (e) => {
    if (e.which === 3) {
      x = e.clientX;
      y = e.clientY;
      path = "";
      window.addEventListener('mousemove', tracer, false); //Detect the mouse position
    }
  }, false);

  window.addEventListener('contextmenu', (e) => { //When the right click BTN is released
    window.removeEventListener('mousemove', tracer, false); //Track the mouse movements
    if (path !== "") {
      e.preventDefault();
      if (funcs.hasOwnProperty(path)) {
        funcs[path](e);
      }
    }
  }, false);
}
//Rocker Mouse Gestures__________________________________________________________________________________________________________________________________________________________________________
if (GM_getValue("RockerMouseGestures") === true) //If the RockerMouseGestures is enabled
{
  const mouseState = { 0: false, 2: false }; //0: Left, 2: Right

  window.addEventListener("mouseup", (e) => {
    mouseState[e.button] = false; //Update the state for the released button

    if (mouseState[0] && !mouseState[2]) { //Left clicked, Right released
      history.back();
    } else if (mouseState[2] && !mouseState[0]) { //Right clicked, Left released
      history.forward();
    }
  }, false);

  window.addEventListener("mousedown", (e) => {
    mouseState[e.button] = true; //Update the state for the pressed button
  }, false);
}
//Search HighLight + Time + Currencies + Units Converters + Search HighLight + AI menus__________________________________________________________________________________________________________
if (GM_getValue("SearchHighlight") === true) //If the SearchHighlight is enabled
{
  var SelectedText;
  const Links = new RegExp(/\.org|\.ly|\.net|\.co|\.tv|\.me|\.biz|\.club|\.site|\.br|\.gov|\.io|\.ai|\.jp|\.edu|\.au|\.in|\.it|\.ca|\.mx|\.fr|\.tw|\.il|\.uk|\.zoom\.us|\.youtu\.be|\.com|\.us|\.de|\.cn|\.ru|\.es|\.ch|\.nl|\.se|\.no|\.dk|\.fi|\.pl|\.tr|\.xyz|\.za/i);

  document.body.addEventListener('mouseup', async (e) => { //When the user releases the mouse click after selecting something
    HtmlMenu.style.display = 'block'; //Display the container div
    SelectedText = getSelection().toString().trim();
    shadowRoot.querySelector("#ShowCurrencyORUnits").innerText = ''; //Remove the previous Units/Currency text
    shadowRoot.querySelector("#SearchBTN span")?.remove(); //Remove the GreyBar

    function ShowConversion(UnitORCurrency, Type, Result) {
      shadowRoot.querySelector("#SearchBTN").innerHTML = toHTML('<span class="GreyBar">&#x2502; </span>' + shadowRoot.querySelector("#SearchBTN").innerHTML);

      if (UnitORCurrency === 'Currencies') {
        const hasSymbol = SelectedText.match(Currencies)[2].match(CurrencySymbols) !== null;
        const currencyFormat = Intl.NumberFormat(navigator.language, { style: 'currency', currency: GM_getValue("YourLocalCurrency") }).format(Result);
        shadowRoot.querySelector("#ShowCurrencyORUnits").innerHTML = toHTML(hasSymbol ? (Type + ' 🠂 ' + currencyFormat) : currencyFormat);
      }
      else
      {
        shadowRoot.querySelector("#ShowCurrencyORUnits").innerHTML = toHTML(UnitORCurrency === 'Units' ? `${Result} ${Type}` : Result); //Show the converted time results
      }

      setTimeout(() => { //Wait for Units to show up to get the right offsetWidth
        const offsetWidth = shadowRoot.querySelector("#ShowCurrencyORUnits").offsetWidth; //Store the current menu size
        shadowRoot.querySelector("#ShowCurrencyORUnits").onmouseover = () => { //When the mouse hovers the unit/currency
          shadowRoot.querySelector("#ShowCurrencyORUnits").innerHTML = toHTML(`Copy`);
          shadowRoot.querySelector("#ShowCurrencyORUnits").style.display = 'inline-flex';
          shadowRoot.querySelector("#ShowCurrencyORUnits").style.width = `${offsetWidth}px`; //Maintain the aspect ratio
        };
      }, 0);

      const htmlcode = shadowRoot.querySelector("#ShowCurrencyORUnits").innerHTML; //Save the converted unit/currency value
      shadowRoot.querySelector("#ShowCurrencyORUnits").onmouseout = () => { //When the mouse leaves the unit/currency
        shadowRoot.querySelector("#ShowCurrencyORUnits").style.width = ''; //Return the original aspect ratio
        shadowRoot.querySelector("#ShowCurrencyORUnits").style.display = ''; //Return the original aspect ratio
        shadowRoot.querySelector("#ShowCurrencyORUnits").innerHTML = toHTML(htmlcode); //Return the previous html
      };

      shadowRoot.querySelector("#ShowCurrencyORUnits").onclick = () => { //When the unit/currency is clicked
        UnitORCurrency.match(/Units|Time/) ? GM_setClipboard(`${Result} ${Type}`) : GM_setClipboard(Intl.NumberFormat(navigator.language, { style: 'currency', currency: GM_getValue("YourLocalCurrency") }).format(Result));
      };
    }

    function Get(url) { //Get the final converted time/currency value
      return new Promise(resolve => GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: response => resolve(new DOMParser().parseFromString(response.responseText, 'text/html'))
      }));
    }
    //Time Converter_____________________________________________________________________________________________________________________________________________________________________________
    const time = new RegExp(/^[ \t\xA0]*(?=.*?(\d{1,2}:\d{2}(?::\d{2})?\s?(?:[aApP]\.?[mM]\.?)?)|\d{1,2}(?::\d{2}(?::\d{2})?)?\s?(?:[aApP]\.?[mM]\.?)?)(?=.*?(PST|PDT|MST|MDT|CST|CDT|EST|EDT|AST|ADT|NST|NDT|GMT|BST|MET|CET|CEST|EET|EEST|WET|WEST|JST|KST|IST|MSK|UTC|PT))(?:\1[ \t\xA0]*\2|\2[ \t\xA0]*\1)[ \t\xA0]*$/i);

    if (GM_getValue("TimeConverter") === true && SelectedText.match(time) !== null) //If the TimeConverter is enabled and if the selected text is a time
    {
      const timeResponse = await Get(`https://www.google.com/search?q=${SelectedText.match(time)[0].replace("WET", "Western European Time")} to local time`);
      const ConvertedTime = timeResponse.querySelector(".aCAqKc")?.innerText;
      const Secs = SelectedText.match(time)[0].match(/(?:\d{1,2}:\d{2}(:\d{2})\s?[ap]\.?m)/i)?.[1] || '';
      ConvertedTime && ShowConversion('Time', '', ConvertedTime.replace(/(\d{1,2}):(\d{2})\s?([pP][mM])/, (_, h, m) => `${(h % 12 + 12) % 24}:${m}`).match(/[\d:]+/g)[0] + Secs); //Convert to 24-hour format
    }
    //Currencies Converter_______________________________________________________________________________________________________________________________________________________________________
    const CurrencySymbols = new RegExp(/AU\$|HK\$|US\$|\$US|R\$|\$|¥|€|Rp|Kč|kr(?!w)|zł|£|฿|₩|лв|₪|円|₱|₽|руб|lei|Fr|krw|RON|TRY|₿|Br|₾|₴|₸|₺/i);
    const Currencies = new RegExp(/^[ \t\xA0]*\$?(?=.*?(\d+(?:.*\d+)?))(?=(?:\1[ \t\xA0]*)?(Dólares|dolares|dólares|dollars?|AU\$?D?|BGN|BRL|BCH|BTC|BYN|CAD|CHF|Fr|CNY|CZK|DKK|EUR|EGP|ETH|GBP|GEL|HKD|HUF|IDR|ILS|INR|JPY|LTC|KRW|MXN|NOK|NZD|PHP|PLN|RON|RUB|SEK|SGD|THB|TRY|USD|UAH|ZAR|KZT|YTL|\$|R\$|HK\$|US\$|\$US|¥|€|Rp|Kč|kr|krw|zł|£|฿|₩|лв|₪|円|₱|₽|руб|lei|Kč|₿|Br|₾|₴|₸|₺))(?:\1[ \t\xA0]*\2|\2[ \t\xA0]*\1)[ \t\xA0]*$/i); //https://regex101.com/r/6vTbtv/20 Davidebyzero

    if (GM_getValue("CurrenciesConverter") === true && SelectedText.match(Currencies) !== null) { //If Currencies Converter is enabled and if the selected text is a currency
      if (GM_getValue("YourLocalCurrency") === undefined) {
        const UserInput = prompt('Write your local currency.\nThe script will always use your local currency to make exchange-rate conversions.\n\n*Currency input examples:\nBRL\nCAD\nUSD\netc...\n\n*Press OK');
        GM_setValue("YourLocalCurrency", UserInput);
      }
      const currencyMap = { 'AU$': 'AUD', '$': 'USD', 'us$': 'USD', '$us': 'USD', 'r$': 'BRL', 'hk$': 'HKD', '¥': 'JPY', '€': 'EUR', 'rp': 'IDR', 'kč': 'CZK', 'kr': 'NOK', 'zł': 'PLN', '£': 'GBP', '฿': 'THB', '₩': 'KRW', 'лв': 'BGN', '₪': 'ILS', '円': 'JPY', '₱': 'PHP', '₽': 'RUB', 'руб': 'RUB', 'lei': 'RON', 'ron': 'Romanian Leu', 'krw': 'KRW', 'fr': 'CHF', '₿': 'BTC', 'Br': 'BYN', '₾': 'GEL', '₴': 'UAH', '₸': 'KZT', '₺': 'YTL', 'try': 'Turkish Lira' };
      if((currencyMap[SelectedText.match(CurrencySymbols)?.[0].toLowerCase()]||SelectedText.match(Currencies)[2]).toUpperCase() === GM_getValue("YourLocalCurrency").toUpperCase()) return; //Disable same unit conversion
      const CurrencySymbol = currencyMap[SelectedText.match(CurrencySymbols)?.[0].toUpperCase()] || SelectedText.match(Currencies)[2]; //Store the currency symbol
      const currencyResponse = await Get(`https://www.google.com/search?q=${SelectedText.replace(/[.,]/g, '').match(Currencies)[1]} ${CurrencySymbol} in ${GM_getValue("YourLocalCurrency")}`);
      const FinalCurrency = parseFloat(currencyResponse.querySelector(".SwHCTb, .pclqee").innerText.split(' ')[0].replaceAll(',', '')); //Store the FinalCurrency+erase all commas
      ShowConversion('Currencies', CurrencySymbol, FinalCurrency);
    }
    //Units Converter____________________________________________________________________________________________________________________________________________________________________________
    const Units = new RegExp(/^[ \t\xA0]*(-?\d+(?:[., ]\d+)?)(?:[ \t\xA0]*(in|inch|inches|"|”|″|cm|cms|centimeters?|m|mt|mts|meters?|ft|kg|lbs?|pounds?|kilograms?|ounces?|g|ozs?|fl oz|fl oz \(us\)|fluid ounces?|kphs?|km\/h|kilometers per hours?|mhp|mphs?|meters per hours?|(?:°\s?|º\s?|)(?:degrees?\s+)?(?:celsius|fahrenheit|[CF])|km\/hs?|ml|milliliters?|l|liters?|litres?|gal|gallons?|yards?|yd|Millimeter|millimetre|kilometers?|mi|mm|miles?|ft|fl|feets?|grams?|kilowatts?|kws?|brake horsepower|mechanical horsepower|hps?|bhps?|miles per gallons?|mpgs?|liters per 100 kilometers?|lt?\/100km|liquid quarts?|lqs?|qt|foot-? ?pounds?|ft-?lbs?|lb fts?|newton-? ?meters?|n·?m))?(?:[ \t\xA0]*x[ \t\xA0]*(-?\d+(?:[., ]\d+)?)(?:[ \t\xA0]*(in|inch|inches|"|”|″|cm|cms|centimeters?|m|mt|mts|meters?|ft))?)?[ \t\xA0]*(?:\(\w+\)[ \t\xA0]*)?(?:[ \t\xA0]*\^(\d+\.?\d*))*$/i);

    if (GM_getValue("UnitsConverter") === true && SelectedText.match(/\^(\d+\.?\d*)/) || (SelectedText.match(Units)?.[1] && SelectedText.match(Units)?.[2] || SelectedText.match(Units)?.[3])) { //If the Units Converter option is enabled+if the selected text is a math power or an unit

      const selectedUnitType = (SelectedText.match(Units)[2]||SelectedText.match(Units)[4])?.toLowerCase();
      const SecondSelectedUnitValue = SelectedText.match(Units)[3]?.replaceAll(',', '.')||0;
      const SelectedUnitValue = SelectedText.match(Units)[1].replaceAll(',', '.');
      var NewUnit = window.UConv[selectedUnitType]?.unit || selectedUnitType.toLowerCase();
      const convertValue = (value, unitType) => {
        const { factor, convert } = window.UConv[unitType] || {};
        return convert ? convert(value) : value * factor;
      };

      var ConvertedUnit = `${convertValue(parseFloat(SelectedUnitValue), selectedUnitType).toFixed(2)}${SecondSelectedUnitValue != 0 ? ` x ${convertValue(parseFloat(SecondSelectedUnitValue), selectedUnitType).toFixed(2)}` : ''}`;
      ConvertedUnit = SelectedText.match(/\^(\d+\.?\d*)/) ? (NewUnit = 'power', Math.pow(parseFloat(SelectedUnitValue), parseFloat(SelectedText.match(/\^(\d+\.?\d*)/)[1]))) : ConvertedUnit;
      ShowConversion('Units', NewUnit, ConvertedUnit);
    }
    //Mini Menu__________________________________________________________________________________________________________________________________________________________________________________
    if (shadowRoot.querySelector("#SearchBTN").innerText === 'Open') //If the Search BTN text is 'Open'
    {
      shadowRoot.querySelector("#highlight_menu > ul").style.paddingInlineStart = '19px'; //Increase the menu size
      shadowRoot.querySelector("#SearchBTN").innerText = 'Search'; //Display the BTN text as Search again
      shadowRoot.querySelectorAll(".AI-BG-box button").forEach(button => { button.style.marginLeft = ''; }); //Remove the margin left
      shadowRoot.querySelector("#OpenAfter").remove(); //Remove the custom Open white hover overlay
    }

    if (SelectedText.match(Links) !== null) //If the selected text is a link
    {
      shadowRoot.querySelector("#highlight_menu > ul").style.paddingInlineStart = '27px'; //Increase the menu size
      shadowRoot.querySelector("#SearchBTN").innerText = 'Open'; //Change the BTN text to Open
      shadowRoot.querySelectorAll(".AI-BG-box button").forEach(button => { button.style.marginLeft = '-2%'; }); //Add a margin left
      shadowRoot.innerHTML += toHTML(`<style id="OpenAfter"> #SearchBTN::after { width: 177% !important; transform: translate(-34%, -71%) !important; } </style> `); //Add a custom Open white hover overlay
    }

    shadowRoot.querySelector("#SearchBTN").onmousedown = (words) => {
      GM_openInTab(SelectedText.match(Links) ? SelectedText.replace(/^(?!https?:\/\/)(.+)$/, 'https://$1') : `https://www.google.com/search?q=${SelectedText.replaceAll('&', '%26').replace(/\s+/g, ' ')}`, { active: true, setParent: true, loadInBackground: true }); //Open link or Google+search for the selected text
      shadowRoot.querySelector("#highlight_menu").classList.remove('show');
    };

    const menu = shadowRoot.querySelector("#highlight_menu");
    if (document.getSelection().toString().trim() !== '' && shadowRoot.querySelector('#CloseOverlay.show') === null) { //If text has been selected and the AI overlay isn't showing
      const p = document.getSelection().getRangeAt(0).getBoundingClientRect(); //Store the selected position

      menu.classList.add('show'); //Show the menu
      menu.offsetHeight; //Trigger reflow by forcing a style calculation
      menu.style.top = p.top - menu.offsetHeight - 11 + 'px';
      menu.style.left = p.left + (p.width / 2) - (menu.offsetWidth / 2) + 'px';
      menu.classList.add('highlight_menu_animate');

      return; //Keep the menu open
    }
    menu.classList.remove('show'); //Hide the menu after a text is unselected
  }); //Finishes the mouseup event listener
  //AI Menu______________________________________________________________________________________________________________________________________________________________________________________
  var isImagePrompt, OldActive, FinalPrompt, transcript, request, OldRequest, silenceTimer, retryCount = 0, desiredVoice = null, isRecognizing = false, SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
  const HtmlMenu=document.body.appendChild(Object.assign(document.createElement('div'),{style:'width:0px;height:0px;display:none;'},{id:'AIContainer'})); //Create+hide a container div
  const UniqueLangs = navigator.languages.filter((l, i, arr) => !arr.slice(0, i).some(e => e.split('-')[0].toLowerCase() === l.split('-')[0].toLowerCase()) ); //Filter unique languages
  const Lang = UniqueLangs.join('+into '); //Use 1 or more languages
  const shadowRoot = HtmlMenu.attachShadow({ mode: 'closed' });
  const renderer = new window.marked.Renderer();
  const recognition = new SpeechRecognition();
  recognition.interimResults = true; //Show partial results
  recognition.continuous = true; //Keep listening until stopped

  shadowRoot.innerHTML = toHTML(GM_getResourceText("AIMenuContent")); //Set the AI menu HTML+CSS
  if (document.body.textContent || document.body.innerText) document.body.appendChild(HtmlMenu); //Append menu if body contains text

  renderer.code = function(code, lang, escaped) { //Override the default code rendering
    const tempDiv = Object.assign(document.createElement('div'), { innerHTML: window.marked.Renderer.prototype.code.call(this, code, lang, escaped) }); //Create a div and add the original HTML
    hljs.highlightElement(tempDiv.querySelector('code')); //Highlight the code
    return `<div class="code-block-wrapper">${shadowRoot.querySelector('#code-block-header-template').innerHTML.replaceAll('{{language}}', tempDiv.innerHTML.match(/class="language-([^"]+)"/)?.[1]?.slice(0,-5) || 'text')}${tempDiv.innerHTML}</div>`; //Clean up language name, combine with highlighted HTML
  };
  window.marked.setOptions({ renderer: renderer }); //Set our custom renderer

  function handleState(state) { //Show #AIMenu + #dictate but hide #TopPause for the load/abort states. Do the opposite for the 'start' state.
    const isStart = state === 'start';
    [["#TopPause", isStart], ["#AIMenu", !isStart], ["#dictate", !isStart]] .forEach(([el, show]) => shadowRoot.querySelector(el).classList.toggle('show', show));
  }

  function SwitchMode() {
    void shadowRoot.querySelector(".animated-prompt-box").offsetWidth; //Force reflow
    shadowRoot.querySelector(".animated-prompt-box").classList.add("magnify-animation");

    if (shadowRoot.querySelector("#prompt").placeholder.match('about')) { //If the input bar contains the word "about"
      shadowRoot.querySelector("#AddContext").remove(); //Return original prompt input styles
      shadowRoot.querySelector("#context").classList.remove('show');
      shadowRoot.querySelector("#prompt").placeholder = 'Ask Gemini anything...'; //Return default placeholder
    }
    else
    {
      shadowRoot.querySelector("#context").classList.add('show'); //Show the context mode
      shadowRoot.querySelector("#prompt").placeholder = `Ask about ${location.host.replace('www.','')}`; //Change placeholder
      shadowRoot.querySelector("#highlight_menu").insertAdjacentHTML('beforebegin', `<style id="AddContext"> #gemini { display: none; } #prompt { left: 5.5vw; width: 20.5vw; } .animated-prompt-box { --color-OrangeORLilac: #FF8051; } </style> `); //Show the context bar
    }
    setTimeout(() => { shadowRoot.querySelector(".animated-prompt-box").classList.remove("magnify-animation"); }, 300);
  }

  function AskAI(Prompt, button) {
    OldRequest = [Prompt, button, isImagePrompt];
    const IsLatin = !/\p{Script=Latin}/u.test(Prompt) ? `, add 2 headings, "Pronunciation:" and "Language:"` : '';
    const responsePrompt = Prompt.includes('?') ? 'Give me a very short, then a long, detailed answer' : 'Help me further understand/learn a term or topic from the text/word';
    const ShortTXTPrompt = Prompt.split(' ').length < 5 ? `\nAfter showing (in order) (add a heading as "${Prompt}") ${IsLatin} , a few possible "Synonyms:", "Definition:" and "Example:".` : '';
    const context = !!shadowRoot.querySelector("#context.show") ? `"${Prompt}"\n\nMainly base yourself on the text below\n\n${document.body.innerText}` : Prompt; //Add the page context if context is enabled
    const taskTXT = button.match('translate') ? `Translate this text: "${Prompt.trim().slice(0, 215)}${Prompt.length > 215 ? '…' : ''}"` : button.match('Prompt') ? `${Prompt.trim().slice(0, 240)}${Prompt.length > 240 ? '…' : ''}` : `Help me further explore a term or topic from the text: "${Prompt.trim().slice(0, 180)}${Prompt.length > 180 ? '…' : ''}"`; //AI Box top text
    FinalPrompt = button.match('translate') ? `Translate into ${Lang} the following text:\n\n"${Prompt}"\n${ShortTXTPrompt}${UniqueLangs.length > 1 ? `\n\nYou must answer using only 1 language first, then use only the other language, don't mix both languages!\nAlso, be sure to say which language is the translated text from, if the text isn't into ${Lang}!\n\n"${Prompt}" should be translated for the other languages.\nUse ---  ${UniqueLangs.length-1}x to divide your answer into language sections.` : ''}` : button.match('Prompt') ? context : `${responsePrompt}: "${Prompt}"`;
    FinalPrompt = button.match(/Rewrite|Tweak|Spellcheck/) ? `${button} the following text: "${Prompt}"` : FinalPrompt;
    FinalPrompt = button.match('Writer') ? Prompt : FinalPrompt;
    const data = { contents: [{ parts: [{ text: FinalPrompt }] }], generationConfig: { response_modalities: ['TEXT'] } };

    shadowRoot.querySelectorAll('.action-buttons, .insert-to-page-btn').forEach(el => {
      el.style.display = button.match(/Rewrite|Tweak|Spellcheck|Writer/) ? 'flex' : 'none';
    });

    shadowRoot.querySelector("#finalanswer-txt").innerHTML = toHTML(isImagePrompt ? '<p>Generating image...</p>' : '');
    shadowRoot.querySelectorAll("#CloseOverlay, #AIBox, .animated-prompt-box, .prompt-arrow").forEach(el => el.classList.add('show')); //Show Overlay, input+answer box+order and arrows
    shadowRoot.querySelector("#msg-txt").innerText = button.match(/Rewrite|Tweak|Spellcheck/) ? `${button} the following text: "${Prompt}"` : button.match('Writer') ? Prompt : taskTXT;
    shadowRoot.querySelector("#msg-txt").innerText = shadowRoot.querySelector("#msg-txt").innerText.length > 240 ? shadowRoot.querySelector("#msg-txt").innerText.slice(0, 240) + '…' : shadowRoot.querySelector("#msg-txt").innerText;

    data.systemInstruction = { parts: [{ text: `List of things you aren't allowed to say/do anything like:\n1 "Based on the provided text"\n2 "The text is already in"\n3 "No translation is needed"\n4 Ask for more context\n5 "You haven't provided context"\n6 Use bullet points for Synonyms` }] };
    data.safetySettings = ["HARASSMENT", "HATE_SPEECH", "SEXUALLY_EXPLICIT", "DANGEROUS_CONTENT"].map(cat => ({ category: `HARM_CATEGORY_${cat}`, threshold: "BLOCK_NONE" }));

    if (isImagePrompt) {
      handleState('load');
      shadowRoot.querySelector("#finalanswer-txt").innerHTML = toHTML(`<p>Generating Image...</p>`);

      GM.xmlHttpRequest({
        method: "GET",
        url: `https://image.pollinations.ai/prompt/${Prompt.replace(/^(generate|create|draw|make)\s*(me|an?|the|this|that)?\s*(image|picture|photo|drawing)?\s*(of|about|showing|depicting|illustrating)?\s*/i, '').replace(/\s+/g, '+')}?nologo=true&key=plln_sk_QjAANLJe2kERQ2KhWO8sx9DXSNeiU7F4`,
        responseType: 'blob',
        onload: (r) => {
          if (r.status === 200 && r.response.type.startsWith('image')) { // Success: It's an image
            const img = new Image();
            img.src = URL.createObjectURL(r.response);
            img.onload = () => {
              shadowRoot.querySelector("#finalanswer-txt").innerHTML = toHTML(`<p>Generated Image:</p>`);
              shadowRoot.querySelector("#finalanswer-txt").appendChild(img);
              shadowRoot.querySelector("#IMGOverlay").querySelector(".overlay-image").src = img.src;
              img.onclick = () => shadowRoot.querySelector("#IMGOverlay").classList.add("show");
            };
          } else { // Fail: It's text/JSON
            r.response.text().then(errTxt => {
              shadowRoot.querySelector("#finalanswer-txt").innerHTML = toHTML(`<p>Error: ${errTxt}</p>`);
            });
          }
        }
      });

      isImagePrompt = false;
      return;
    }

    request = GM.xmlHttpRequest({
      method: "POST",
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:streamGenerateContent?key=${GM_getValue("APIKey")}`,
      responseType: 'stream',
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
      onerror: (err) => {
        shadowRoot.querySelector("#msg-txt").innerText = 'Error';
        shadowRoot.querySelector("#finalanswer-txt").innerHTML = toHTML(`<br>Please copy and paste the error below:<br><a class="feedback" href="https://greasyfork.org/scripts/419825/feedback">Click here to report this bug</a><br><br> Prompt: ${Prompt}<br> Button: ${button}<br> Error: <pre>${JSON.stringify(err, null, 2)}</pre><br><br><br>`);
      },
      onload: (res) => {
        handleState('load');
      },
      onabort: (response) => {
        handleState('abort');
        shadowRoot.querySelector("#finalanswer-txt").innerHTML = toHTML('<p>Response has been interrupted.<\p>');
      },
      onloadstart: async function(response) {
        handleState('start');
        shadowRoot.querySelector("#prompt").focus(); //Focus
        const reader = response.response.getReader();
        await window.parseGeminiStream(reader, (item, markdown) => { //Call the stream parser
          if (item.error?.message && retryCount < 2) (AskAI(Prompt, button), retryCount++); //Retry 2x on error
          shadowRoot.querySelector("#finalanswer-txt").innerHTML = toHTML(window.marked.parse(markdown || `<p>${item.error?.message}</p>`)); //Render the AI response or error as HTML
        });
      }
    });
  }

  if (window.top === window.self) ['📝 Generate Text','🖊️ Tweak it','A✓ Spellcheck'].map((label,i) => GM_registerMenuCommand(label,() => { AskAI(OldActive.value.trim(), ['Rewrite','Tweak','Spellcheck'][i]); AddMenu(); }));
  //AI related event listeners___________________________________________________________________________________________________________________________________________________________________
  ['keydown','keyup','keypress'].forEach(type => document.addEventListener(type, e => e.target.id == 'AIContainer' && !{Tab:1,Enter:1,Escape:1}[e.key] && e.stopPropagation(), 1)); //Block key events on the prompt box except for Tab/Enter/Escape
  speechSynthesis.onvoiceschanged = () => desiredVoice = speechSynthesis.getVoices().find(v => v.name === "Microsoft Zira - English (United States)"); //Find+store the desired voice
  shadowRoot.querySelectorAll(".prompt-arrow").forEach(el => el.onclick = () => SwitchMode());
  speechSynthesis.onvoiceschanged(); //Handle cases where the event doesn't fire

  shadowRoot.querySelector("#TopPause").onclick = () => {
    request.abort();
  };

  shadowRoot.querySelector('#CopyBTN').onmousedown = () => {
    GM_setClipboard(SelectedText);
  };

  shadowRoot.querySelector("#IMGOverlay").onclick = function() {
    this.classList.remove("show");
  };

  window.addEventListener('scroll', () => {
    shadowRoot.querySelector("#highlight_menu").classList.remove('show');
  });

  shadowRoot.querySelector(".download-button").onclick = () => {
    GM.xmlHttpRequest({
      method: 'GET',
      url: shadowRoot.querySelector(".overlay-image").src,
      responseType: 'blob',
      onload: r => Object.assign(document.createElement('a'), { href: URL.createObjectURL(r.response), download: 'AI_Img.png' }).click()
    });
  };

  document.addEventListener('contextmenu', e => {
    OldActive = document.activeElement;
    registeredToggleableCommandIDs.forEach(id => GM_unregisterMenuCommand(id)); //Remove some menu features
  });

  shadowRoot.querySelector(".insert-to-page-btn").onclick = function() {
    OldActive.value = shadowRoot.querySelector("#finalanswer-txt").innerText;
    shadowRoot.querySelectorAll("#CloseOverlay, #AIBox, .animated-prompt-box, .prompt-arrow").forEach(el => el.classList.remove('show')); //Hide Overlay, input+answer box+order and arrows
  };

  shadowRoot.querySelectorAll('.action-btn').forEach((el, i) => {
    el.onclick = () => {
      AskAI(`${['Make the following text shorter', 'Make the following text longer', 'Add hashtags to the following text', 'Add emojis to the following text' ][i]}: "${shadowRoot.querySelector("#finalanswer-txt").innerText}"`, 'Writer');
    };
  });

  shadowRoot.querySelector("#NewAnswer").onclick = () => {
    recognition.stop(); //Stop recognizing audio
    speechSynthesis.cancel(); //Stop speaking
    isImagePrompt = OldRequest[2];
    AskAI(OldRequest[0], OldRequest[1]);
  };

  shadowRoot.querySelector("#copyAnswer").onclick = () => {
    (shadowRoot.querySelector("#copyAnswer").style.display = 'none', shadowRoot.querySelector("#AnswerCopied").style.display = 'inline-flex'); //Hide copy+show checkmark BTNs
    const finalEl = shadowRoot.querySelector("#finalanswer-txt");
    navigator.clipboard.write([ new ClipboardItem({ "text/plain": new Blob([finalEl.innerText], {type:"text/plain"}), "text/html": new Blob([finalEl.innerHTML], {type:"text/html"}) }) ]);
    setTimeout(() => { //Return play BTN svg
      (shadowRoot.querySelector("#copyAnswer").style.display = 'inline-flex', shadowRoot.querySelector("#AnswerCopied").style.display = 'none'); //Show copy+hide checkmark BTNs
    }, 1000);
  };

  shadowRoot.querySelector("#dictate").onclick = () => {
    if (isRecognizing) {
      recognition.stop();
    } else {
      isRecognizing = true;
      recognition.start();
      shadowRoot.querySelectorAll('.state1, .state2, .state3').forEach((state, index) => { //ForEach SVG animation state
        state.style.display = 'unset'; //Show all states
        state.classList.add('animate'+index); //Start the voice recording animation
      });
    }
  };

  shadowRoot.querySelector("#CloseOverlay").onclick = () => {
    [...shadowRoot.querySelector("#finalanswer-txt").childNodes].slice(0, -1).forEach(node => node.remove()); //Reset the text content
    shadowRoot.querySelectorAll("#CloseOverlay, #AIBox, .animated-prompt-box, .prompt-arrow").forEach(el => el.classList.remove('show')); //Hide Overlay, input+answer box+order and arrows
    recognition.stop(); //Stop recognizing audio
    speechSynthesis.cancel(); //Stop speaking
    request.abort(); //Abort any ongoing request
    if (shadowRoot.querySelector("#gemini").style.display === 'none') {
      shadowRoot.querySelector("#AddContext").remove(); //Return original prompt input styles
      shadowRoot.querySelector("#context").classList.remove('show');
      shadowRoot.querySelector("#prompt").placeholder = 'Ask Gemini anything...'; //Return default placeholder
    }
  };

  shadowRoot.querySelector("#finalanswer-txt").addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]'); //Get the clicked action button
    if (!button) return; //Exit if the click wasn't on a button

    if (button.dataset.action === 'copy') {
      GM_setClipboard(button.closest('.code-block-wrapper').querySelector('pre > code').innerText); //Copy code to clipboard
      button.innerHTML = toHTML(shadowRoot.querySelector('#icon-checkmark-template').innerHTML);
      setTimeout(() => ( button.innerHTML = toHTML(shadowRoot.querySelector('#icon-copy-template').innerHTML) ), 1000); //Revert back to copy icon
    }

    if (button.dataset.action === 'download') {
      Object.assign(document.createElement('a'), { //Create a temporary anchor element
        href: URL.createObjectURL(new Blob([button.closest('.code-block-wrapper').querySelector('pre > code').innerText], {type:'text/plain'})), //Create a blob URL with the code content
        download: `AI_Code.${({javascript:'js',html:'html',css:'css',python:'py',shell:'sh',bash:'sh',json:'json',sql:'sql',xml:'xml',typescript:'ts',java:'java',csharp:'cs',cpp:'cpp',c:'c'}[button.dataset.lang?.toLowerCase()]||'txt')}` //Get lang and set filename
        }).click(); //Trigger download
    }
  });

  shadowRoot.querySelectorAll("#speak, #SpeakingPause").forEach((el) => {
    el.onclick = () => { //When the speak or the bottom pause BTNs are clicked
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        (shadowRoot.querySelector("#speak").style.display = 'inline-flex', shadowRoot.querySelector("#SpeakingPause").classList.remove('show')); //Show the play+hide the pause BTNs
      }
      else
      {
        (shadowRoot.querySelector("#speak").style.display = 'none', shadowRoot.querySelector("#SpeakingPause").classList.add('show')); //Hide the play+show the pause BTNs

        const audio = new SpeechSynthesisUtterance([...shadowRoot.querySelector("#finalanswer-txt").children].filter((el, i) => !(i === 0 && el.tagName === 'P' && el.querySelector('strong'))).map(node => node.innerText.replace(/\b[a-z]{2}-[A-Z]{2}\b|[^\p{L}\p{N}\s%.,!?]/gui, ''))); //Play the AI response text, ignoring the first p>strong el and removing non-alphanumeric characters+lang locales for better pronunciation
        audio.voice = desiredVoice; //Use the desiredVoice
        speechSynthesis.speak(audio); //Speak the text

        audio.onend = (event) => {
          (shadowRoot.querySelector("#speak").style.display = 'inline-flex', shadowRoot.querySelector("#SpeakingPause").classList.remove('show')); //Show the play+hide the pause BTNs
        };
      }
    };
  });

  shadowRoot.querySelectorAll("#AIBTN").forEach((button) => {
    button.onmousedown = function(event, i) { //When the Explore or the Translate BTNs are clicked
      if (GM_getValue("APIKey") === undefined || GM_getValue("APIKey") === null || GM_getValue("APIKey") === '') { //Set up the API Key if it isn't already set
        GM_setValue("APIKey", prompt('Enter your API key\n*Press OK\n\nYou can get a free API key at https://aistudio.google.com/app/apikey'));
      }
      if (GM_getValue("APIKey") !== null && GM_getValue("APIKey") !== '') {
        AskAI(SelectedText, this.className);
      }
    };
  });

  [document, shadowRoot.querySelector("#prompt")].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        shadowRoot.querySelector("#CloseOverlay").click();
      }

      if (el === document && (e.shiftKey && e.code === 'Digit7' || e.key === '/') && (e.ctrlKey || e.metaKey)) { //Detect Ctrl/Cmd + / or Ctrl/Cmd + Shift + 7
        shadowRoot.querySelector("#prompt").value = document.activeElement.value?.trim() || "";
        shadowRoot.querySelectorAll("#CloseOverlay, .animated-prompt-box, .prompt-arrow, #dictate").forEach(el => el.classList.add('show')); //Show Overlay, input box+border, arrows and speak BTNs
        HtmlMenu.style.display = 'block'; //Display the container div
        shadowRoot.querySelector("#prompt").focus(); //Focus
      }
      if (e.target.id === 'AIContainer') {
        if (e.key === "Enter") {
          isImagePrompt = /^(generate|create|draw|make) (me|an?|the|this|that)? .* (at|in|on|of|for|about|showing|depicting|illustrating)/i.test(shadowRoot.querySelector("#prompt").value);
          AskAI(shadowRoot.querySelector("#prompt").value, shadowRoot.querySelector("#prompt").className);
          shadowRoot.querySelector("#prompt").value = ''; //Erase the prompt text
        }
        if (e.key === "Tab") {
          e.preventDefault(); //Block focus on browser tabs + the read BTN
          SwitchMode();
        }
        shadowRoot.querySelector("#prompt").focus(); //Focus
      }
    });
  });

  recognition.onend = () => {
    clearTimeout(silenceTimer); //Clear any pending timeout
    isRecognizing = false;

    shadowRoot.querySelectorAll('.state1, .state2, .state3').forEach((state, index) => { //ForEach SVG animation state
      index.toString().match(/1|2/) && (state.style.display = 'none'); //Show only the 1 state
      state.classList.remove('animate'+index); //Stop the voice recording animation
    });
    transcript ? AskAI(transcript, shadowRoot.querySelector("#prompt").className) : ["#finalanswer-txt","#msg-txt"].forEach(el => shadowRoot.querySelector(el).innerHTML = toHTML(`<p>No audio detected. Please try again or check your mic settings.<\p>`));
    transcript = ''; //Reset transcript
  }; //Finish the recognition end event listener

  recognition.onresult = (words) => {
    clearTimeout(silenceTimer); //Reset the silence timer on new input
    silenceTimer = setTimeout(() => isRecognizing && recognition.stop(), 5000); //Stop after 5 seconds of silence
    transcript = [...words.results].map(result => result[0].transcript).join(' '); //Combine speech recognition segments into a single transcript
    shadowRoot.querySelector("#msg-txt").innerText = transcript.slice(0, 240) + (transcript.length > 240 ? '…' : '');
  };
}