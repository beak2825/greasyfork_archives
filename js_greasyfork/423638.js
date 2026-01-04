// ==UserScript==
// @name         OF Zendesk Ticket Assistant (ZTA)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds buttons to check email/twitter for user
// @author       BananaShot (Roland CS)
// @match        https://onlyfans.zendesk.com/agent/tickets/*
// @grant        GM_addStyle
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/423638/OF%20Zendesk%20Ticket%20Assistant%20%28ZTA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423638/OF%20Zendesk%20Ticket%20Assistant%20%28ZTA%29.meta.js
// ==/UserScript==

(function () {

    let anchorForTicketURL;
    let emailPart;
    let twitterID;
    let headerForLink;

    let currentUrl = location.href;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const callLinkConstructor = function () {

        anchorForTicketURL = document.querySelector(`div[data-side-conversations-anchor-id="${currentUrl.replace(/\D+/gm, '')}"]`)
        emailPart = anchorForTicketURL.querySelector('.email');
        twitterID = document.querySelectorAll('.comment-twitter-identity')[0];
        headerForLink = anchorForTicketURL.getElementsByClassName('source delimited_items')[0];

        if (emailPart) {
            emailButton(emailPart, headerForLink);
        }

        if (!((String(twitterID.innerText.trim())) === '@')) {
            twitterButton(twitterID, headerForLink);
        }
    }

    const createButton = function (element, innerHTML, type, classname, id) {

        let button = document.createElement(element);
        button.innerHTML = innerHTML
        button.type = type;
        button.className = classname;
        button.id = id;

        return button
    }

    const appendButton = function (parentElem, child) {

        if (!parentElem.querySelector('button')) {
            parentElem.appendChild(child);
        }
    }

    const emailButton = function (emailElem, parentToAppend) {

        let linkForButton = `https://onlyfans.com/machineroom/entity/users/?filter[email]=${emailElem.innerHTML}`

        let button = createButton('button', 'Check Email', 'button', 'button button1', 'email-url-to-admin');

        button.addEventListener("click", function () {
            window.open(linkForButton, '_blank');
        });

        appendButton(parentToAppend, button);

    }

    const twitterButton = function (twitterElem, parentToAppend) {

        let fullTwitter = twitterElem.innerText.trim();
        let twitterLink = 'https://onlyfans.com/machineroom/entity/users_profiles/?filter[twitter]=' + fullTwitter.replace('@', '');

        let button = createButton('button', 'Check Twitter', 'button', 'button button2', 'twitter-url-to-admin');

        button.addEventListener("click", function () {
            window.open(twitterLink, '_blank');
        });

        appendButton(parentToAppend, button);
    }

    window.addEventListener('load', async function () {

        await delay(500);
        callLinkConstructor();

    })

    document.body.addEventListener('click', async () => {

        await delay(500);
        if (currentUrl !== location.href) {

            currentUrl = location.href;
            callLinkConstructor();

        }
    }, true);

})();

GM_addStyle(`

.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
}

.button1 {
  background-color: white;
  color: black;
  border: 2px solid #4CAF50;
}

.button1:hover {
  background-color: #4CAF50;
  color: white;
}

  .button2 {
  background-color: white;
  color: black;
  border: 2px solid #008CBA;
}

 .button2:hover {
  background-color: #008CBA;
  color: white;
}
`);