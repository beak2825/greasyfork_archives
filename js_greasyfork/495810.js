// ==UserScript==
// @name         tkrclient
// @version      1.46
// @author       TKR MrGames
// @match        http*://*.iogames.fun/*
// @locale       en
// @description  try out extension on https://github.com/tkrclient/tkrclient ---------------------------- this script only works on the website "iogames.fun", allows for color picking, and reduction of spam messages by disallowing long string of text, and disallowing certain unicodes (not emojis)
// @license      MIT
// @namespace    script727288273783
// @downloadURL https://update.greasyfork.org/scripts/495810/tkrclient.user.js
// @updateURL https://update.greasyfork.org/scripts/495810/tkrclient.meta.js
// ==/UserScript==


(function() {


    /*---- Delete all script tags ----*/
    var scriptTags = document.querySelectorAll('script');
    scriptTags.forEach(function(scriptTag) {
      if (scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    });


    /*---- Html editing for lightweight page ----*/
    // Remove ALL CSS
    /*const header = document.querySelector('head'); {
      header?.remove()
    }*/
    // Remove the games on main page
    const mainpage = document.querySelector('main'); {
      mainpage?.remove()
    }
    // Remove the bottom text on main page
    const mainpage2 = document.querySelector('.main'); {
      mainpage2?.remove()
    }
    // Remove the side bar
    const asidepage = document.querySelector('aside'); {
      asidepage?.remove()
    }
    // Remove the navigation bar (navbar)
    /*const navpage = document.querySelector('nav'); {
      navpage?.remove()
    }*/
    // Remove sign-in
    const logon = document.getElementById('signin-widget'); {
      logon?.remove()
    }
    // Remove website Logo
    const logo = document.querySelector(".logo"); {
      logo?.remove()
    }
    // Remove languages on navbar
    const lang = document.querySelector(".lang"); {
      lang?.remove()
    }
    // Remove search bar on navbar
    const search = document.querySelector(".margin"); {
      search?.remove()
    }
    // Remove chat messages
    /*const chats = document.getElementById('messages'); {
      chats?.remove()
    }*/


    /*---- Move chat box upwards ----*/
    var bodycon = document.querySelector('body');
    var append = document.querySelector('.chat-send');
    var prepend = document.querySelector('#messages');


    /*---- Higher char limits ----*/
    // Higher character limit for chat box
    const messageInput = document.getElementById('message'); {
      messageInput.setAttribute('maxlength', '1000'); // 400 character limit
    }
    // Higher character limit for name box
    const nameInput = document.getElementById('name'); {
      nameInput.setAttribute('maxlength', '1000'); // 400 character limit
    }


    /*---- CSS customizations ----*/
    // Create a new style element
    var styleElement = document.createElement('style');
    // Define the CSS rules you want to apply
    var cssRules = `
       .sendUp {
            grid-template-areas: "nav     nav  nav     " "sidebar main name    " "sidebar main messages    " "sidebar main send    "
       }


       body .styleMessage {
            grid-area: messages;
            background-color: rgba(255,255,255,0.05);
            box-sizing: border-box;
            display: flex;
            flex-direction: column-reverse;
            padding: 0.5rem;
            overflow-wrap: normal;
            border-left: 1px solid rgba(0,0,0,0.25);
            overflow-y: scroll;
            scrollbar-color: transparent rgba(255,255,255,0.05);
            scrollbar-width: none
        }
        body .styleMessage .entry {
            margin-top:1rem
        }
        body .styleMessage .entry a,
        body .styleMessage .entry a:visited {
            display:inline-block;
            vertical-align:middle
        }
        body .styleMessage .entry a:hover img,
        body .styleMessage .entry a:visited:hover img {
            opacity:1
        }
        body .styleMessage .entry a img,
        body .styleMessage .entry a:visited img {
            opacity:0.5;
            margin-left:0.5rem
        }
        body .styleMessage .entry .time,
        body .styleMessage .entry .name {
            font-size:0.9rem
        }
        body .styleMessage .entry .time {
            opacity:0.5
        }
        body .styleMessage .entry .system {
            color:#3f0;
            font-weight:bold;
            text-shadow:0 0 0.5rem #3f0
        }
    `;
    // Set the CSS rules as the content of the style element
    styleElement.innerHTML = cssRules;
    // Append the style element to the document head
    document.head.appendChild(styleElement);
    // Add the new class to the element
    bodycon.classList.add('sendUp');
    // Add class styleMessage to Message element
    prepend.classList.remove('chat-messages');
    prepend.classList.add('styleMessage');


    /*---- Name color changes ----*/
    var namecolor = document.getElementById('colorpicker');
    // Function (for some reason only loads after few seconds)
    function func() {
      namecolor.style.removeProperty('all');
      namecolor.style.color = 'rgb(255, 0, 0)'; // CHANGE COLOR HERE! <---------------------------
    }
    setTimeout(func, 3000);

    /*---- Debloating html ----*/
    // Function (for some reason only loads after few seconds)
    function debloat() {
      const fbroot = document.getElementById('fb-root'); {
        fbroot?.remove()
      }
      const iframetag = document.querySelector('iframe'); {
        iframetag?.remove()
      }
    }
    setTimeout(debloat, 3000);


    /*---- Removing Unicode ----*/
    // Function (for some reason only loads after few seconds)
    function removeUnicodeFromElements() {
      console.log('Removing Unicode from elements...');
      // Get all the ".message" elements nested under the ".entry" class and "#messages" parent
      const messageElements = document.querySelectorAll('#messages .entry .message');
      messageElements.forEach(element => {
        // use /[^\u0000-\u007F]/g for ALL unicode characters (including emojies)!
        element.textContent = element.textContent.replace(/[^\u0000-\u007F\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F500}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      });
      // Get all the ".name" elements nested under the ".entry" class and "#messages" parent
      const nameElements = document.querySelectorAll('#messages .entry .name');
      nameElements.forEach(element => {
        // use /[^\u0000-\u007F]/g for ALL unicode characters (including emojies)!
        element.textContent = element.textContent.replace(/[^\u0000-\u007F\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F500}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      });
    }
    // Run the function to remove Unicode characters after a 3-second delay
    setTimeout(removeUnicodeFromElements, 3000);
    // Set up a mutation observer to watch for new elements
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          console.log('New elements added, running Unicode removal...');
          removeUnicodeFromElements();
        }
      });
    });
    // Start observing the "#messages" element for changes after a 3-second delay
    setTimeout(function() {
      observer.observe(document.getElementById('messages'), { childList: true });
    }, 3000);


    /* Keybindings for [ ] and \ to change colors */
    // Listen for the 'keypress' event on the document
    document.addEventListener('keypress', function(event) {
      // Check if the pressed key is the 'Enter' key
      function red() {
        namecolor.style.removeProperty('all');
        namecolor.style.color = 'rgb(255, 0, 0)'; // red
      }
      function green() {
        namecolor.style.removeProperty('all');
        namecolor.style.color = 'rgb(0, 255, 0)'; // green
      }
      function blue() {
        namecolor.style.removeProperty('all');
        namecolor.style.color = 'rgb(0, 0, 255)'; // blue
      }
      if (event.key === '[') { // [
        // Call the function you want to activate
        red();
      }
      if (event.key === ']') { // ]
        // Call the function you want to activate
        green();
      }
      if (event.key === '\\') { // \
        // Call the function you want to activate
        blue();
      }
    });


})();