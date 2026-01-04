// ==UserScript==
// @name         Whatsapp Web Privacy Mode
// @namespace    graphen
// @version      3.3.1
// @description  Add button and hotkey to hide contact names and avatars on web.whatsapp.com
// @author       Graphen
// @match        https://web.whatsapp.com/
// @icon         https://i.imgur.com/LeZuNg7.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35966/Whatsapp%20Web%20Privacy%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/35966/Whatsapp%20Web%20Privacy%20Mode.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    'use strict';
    var hidden = false;
    var defaultbkg = 'lightgrey';
    var prevName = '';

    waitForId('side').then(el => {
      //console.log(el);
    });
    function waitForId(id, nodeToObserve = document) {
      const el = document.getElementById(id);
      return el ?
        Promise.resolve(el) :
        new Promise(resolve => {
          new MutationObserver((mutations, observer) => {
            const el = document.getElementById(id);
            if (el) {
              // add F7 shortcut
              document.addEventListener("keydown", function(e) {
                  var keyCode = e.keyCode;
                  if(keyCode==118) {
                      toggleShowHide();
                  }
              }, false);
              // add Button
              addButton('Hide / F7', toggleShowHide);
              //console.log("WA Privacy: Button added.");
              observer.disconnect();
              resolve(el);
            }
          }).observe(nodeToObserve, {childList: true, subtree: true});
        });
    }

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', top: '15px', left:'70px', 'z-index': 5000, 'font-weight':'bold', border:'black solid', 'border-radius':'10px',
                            padding:'4px', 'background-color': defaultbkg, 'min-width': '75px', 'box-shadow':'grey 3px 3px 0px 0px'};
        let button = document.createElement('button'), btnStyle = button.style;
      try{
        document.getElementById('app').appendChild(button);
      }
      catch(err){
        console.log("addButton: " + err);
      }
        button.innerHTML = text;
        button.onclick = onclick;
        button.classList = ['show-hide-btn unpressed'];

        button.onmouseover = function() {
            button.style["background-color"] = 'salmon';
        };
        button.onmouseout = function() {
            button.style["background-color"] = defaultbkg;
        };
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
        return button;
    }

    function toggleShowHide() {
        var btn = document.getElementsByClassName('show-hide-btn')[0];
        var panel = document.getElementById('pane-side');
        var chatname = document.querySelector('#main > header > div:nth-of-type(2) > div:nth-of-type(1) > div > span');
        var groupsubheadline = document.querySelector('#main > header > div:nth-of-type(2) > div:nth-of-type(2) > span');
        var partnerimage = document.querySelector('#main > header > div:nth-of-type(1) > div:nth-of-type(1) > img');
        var groupchatbubblenames = document.getElementsByClassName('_3FuDI');
        //console.log(btn);
        //console.log(panel);
        //console.log(chatname);
        //console.log(groupsubheadline);
        //console.log(partnerimage);
        //console.log(groupchatbubblenames);

        if (hidden) {
            // show
            //console.log("WA Privacy: Toggled show.");
            panel.setAttribute('style', 'filter:none');
            defaultbkg = 'lightgrey';
            btn.innerHTML = 'Hide / F7';
            btn.style.left = '70px';
            btn.style.top = '15px';
            btn.style["box-shadow"] = 'grey 3px 3px 0px 0px';
            try {
                // at start no chat is open
                if (chatname) {
                    chatname.innerHTML = prevName;
                    chatname.title = prevName;
                }
                // not every user/group has set an image
                if (partnerimage) {
                  partnerimage.setAttribute('style', 'filter:none;');
                }
                // subheadline for group chats
                if (groupsubheadline) {
                  groupsubheadline.setAttribute('style', 'display:block;');
                }
                // name above single message in group chat
                if (groupchatbubblenames) {
                  for (const bubble of groupchatbubblenames) {
                      bubble.setAttribute('style', 'filter:none;');
                  }
                }
            } catch(err) {
                console.log("toggleShow: " + err);
            }
            prevName = '';
        } else {
            // hide
            //console.log("WA Privacy: Toggled hide.");
            panel.setAttribute('style', 'filter:blur(10px);');
            defaultbkg = 'grey';
            btn.innerHTML = 'Show / F7';
            btn.style.left = '73px';
            btn.style.top = '18px';
            btn.style["box-shadow"] = '';
            try {
                // at start no chat is open
                if (chatname) {
                    prevName = chatname.innerHTML;
                    chatname.innerHTML = randomName();
                    chatname.title = chatname.innerHTML;
                }
                // not every user/group has set an image
                if (partnerimage) {
                    partnerimage.setAttribute('style', 'filter:blur(10px);');
                }
                // subheadline for group chats
                if (groupsubheadline) {
                    groupsubheadline.setAttribute('style', 'display:none;');
                }
                // name above single message in group chat
                if (groupchatbubblenames) {
                  for (const bubble of groupchatbubblenames) {
                      bubble.setAttribute('style', 'filter:blur(5px);');
                  }
                }
            } catch(err) {
                console.log("toggleHide: " + err);
            }
        }
        document.getElementsByClassName('show-hide-btn')[0].style["background-color"] = defaultbkg;
        hidden = !hidden;
    }
    function randomName() {
        var names = ['Grace Kelly', 'Nicolas Cage', 'Albert Einstein', 'Angus Young', 'Katy Perry', 'Leonardo DiCaprio', 'Cleopatra', 'Anonymous Pasta Lovers',
                     'Karl Lagerfeld', 'Holy Father', 'Homer Simpson', 'Barney Stinson', 'Walter White', 'Queen Victoria', 'Sheldon Cooper', 'Mahatma Gandhi'];
        return names[Math.floor(Math.random() * names.length)];
    }
})();
