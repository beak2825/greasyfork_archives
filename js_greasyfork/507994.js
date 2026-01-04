// ==UserScript==
// @name         WarRevive
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @license MIT
// @description  To request a revive from multiple revive providers for others
// @author       Kindly[1651049]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      tornuhc.eu
// @connect      api.no1irishstig.co.uk
// @downloadURL https://update.greasyfork.org/scripts/507994/WarRevive.user.js
// @updateURL https://update.greasyfork.org/scripts/507994/WarRevive.meta.js
// ==/UserScript==


// swap between UHC & NITE
// and click save, then refresh your war page
let reviveProvider = 'UHC';

/* --------- DO NOT MODIFY BELOW --------- */

new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    for (const node of mutation.addedNodes) {
      addReviveCol();
    }
  });
}).observe(document.body, { childList: true, subtree: true });


function addReviveCol() {

    var factionElement = document.querySelector(".your-faction");
    if (factionElement) {
        var membersListElement = factionElement.querySelector(".members-list");
        if (membersListElement) {
            let titleNode = membersListElement.parentNode.querySelector(".title, .c-pointer");
            let titleAttackNode = titleNode.querySelector(".attack");
            titleAttackNode.style.display = 'block';
            titleAttackNode.childNodes[0].nodeValue = "Revive"

            for (let i = 0; i < membersListElement.children.length; i++) {
                let rowAttackNode = membersListElement.children[i].querySelector(".attack");

                if (rowAttackNode && rowAttackNode.childNodes[0].textContent != reviveProvider) {
                    rowAttackNode.style.display = 'block';
                    rowAttackNode.childNodes[0].style.cssText = rowAttackNode.childNodes[0].style.cssText;

                    rowAttackNode.childNodes[0].textContent = reviveProvider;
                    rowAttackNode.childNodes[0].style.color = '#ff8787';
                    rowAttackNode.addEventListener("click", (event) => {requestRevive(event)});

                }

            };

        } else {
            console.log('couldnt find members list');
        }
    } else {
        console.log('couldnt find your-faction');
    }
}

function requestRevive(event) {
    const name = event.target.parentNode?.parentNode?.querySelector('.honor-text:not([class*=" "])')?.textContent;
    const href = event.target.parentNode?.parentNode?.querySelector('.honor-text-wrap')?.parentNode?.getAttribute('href');
    const url = new URL(href, window.location.origin);
    const xid = parseInt(url.searchParams.get('XID'));

    console.log(`requesting revive for ${name} ${xid} with ${reviveProvider}`)

    if (reviveProvider == "NITE") {
        NiteRevive(xid, name);
    }

    if (reviveProvider == "UHC") {
        UHCRevive(xid, name);
    }

}

const Nite = "Midnight X";
function NiteRevive(xid, name) {

    const source = "Midnight X Script";
    const API_URL = 'https://api.no1irishstig.co.uk/request';
    GM.xmlHttpRequest({
    method: 'POST',
    url: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      'tornid': parseInt(xid),
      'username': name,
      "vendor": Nite,
      'source': `${source} 1.2.4`,
      'type': 'revive'
    }),
    onload: handleNiteResponse,
  })
}

function UHCRevive(xid, name) {
    let source = "UHC Script"
    let sidebarData = getSidebar();
    let faction = sidebarData.statusIcons.icons.faction.subtitle.split(' of ')[1];
    var obj = new Object();
    obj.userID = xid;
    obj.userName = name;
    obj.factionName = faction;
    obj.source = source;

    var jsonString= JSON.stringify(obj);

    let url = 'https://tornuhc.eu/api/request'

    console.log(obj);
    GM.xmlHttpRequest({
        method: 'POST',
        url: url,
        data: jsonString,
        headers:    {
                "Content-Type": "application/json"
        },
        onload: function (response) {
            if (response.status == '200') {
                alert('Sent to UHC! Please pay your reviver 1 xanax or $1m')
            } else {
                alert(response.responseText)
            }
        },
        onerror: function (error) {
            alert('Something went wrong, please let Natty_Boh know')
        }
    })

}

function getSidebar() {
    let key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
    let sidebarData = JSON.parse(sessionStorage.getItem(key))
    return sidebarData
}

function handleNiteResponse(response) {
  if (response?.status && response.status !== 200) {
    var responseText = response.responseText.replace(/^"|"$/g, '');
    alert(`Error Code: ${response.status}\nMessage: ${responseText}` || `An unknown error has occurred`);
    return;
  }

  let contract = false;
  try {
    contract = !!JSON.parse(response.responseText).contract;
  } catch (e) {
  }

  if (contract) {
    alert(`Contract request has been sent to ${Nite}. Thank you!`)
  } else {
    alert(`Request has been sent to ${Nite}. Please pay your reviver a Xanax or $1m. Thank you!`);
  }
}



GM_addStyle(`
    @media screen and (max-width: 1000px) {
        .rv {
            display: none;
        }
    }

    .your-faction .level {
        width: 27px !important;
    }

    .your-faction .attack {
        width: 25px !important;
    }


    .your-faction .status {
        width: 34px !important;
    }

`);