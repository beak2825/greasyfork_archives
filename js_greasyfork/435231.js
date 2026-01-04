// ==UserScript==
// @name    ANTISPAM++ JVC
// @author	GodTier
// @description		Antispam avancé pour jvc
// @version  1.3
// @match       https://www.jeuxvideo.com/*
// @grant       GM.setValue
// @grant       GM.getValue
// @require	http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/833748
// @downloadURL https://update.greasyfork.org/scripts/435231/ANTISPAM%2B%2B%20JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/435231/ANTISPAM%2B%2B%20JVC.meta.js
// ==/UserScript==

(async (W) => {
  
  const 
    BLACKLIST = ["discord","jvarchive","avenoel"],
    BASE_URL = `https://${W.document.domain}`,
    MAILBOX_URL = `${BASE_URL}/messages-prives/boite-reception.php`,
    MP_URL = `${BASE_URL}/messages-prives/message.php/`,
    MP_API = `${BASE_URL}/abonnements/ajax/list_notification_header.php?type=mp`;

  const asyncFilter = async (arr,predicate) => 
		await Promise.all(arr.map(predicate)).then(bool => arr.filter((_, i) => bool[i]));

  const awaitElements = selector => {
    return new Promise(resolve => {
      if (document.querySelectorAll(selector).length !== 0) {
        return resolve(document.querySelectorAll(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelectorAll(selector).length !== 0) {
          resolve(document.querySelectorAll(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  };
  
   
 const isBlacklisted = text => BLACKLIST.some(r => text.toUpperCase().includes(r.toUpperCase()));
  const init = async () => {
    let response = await fetch(MAILBOX_URL).then((r) => r.text());
    var cookies = parseDOM(response)
    .querySelectorAll("#b-reception > form > input[type=hidden]");
    var ajax_hash = W.document.body.attributes[0].value;
    return {
      cookies,
      ajax_hash,
    };
  };

  const sendToSpam = async (IDs) => {
    const payload = {
      conv_move: 666,
      "conv_select[]": IDs,
    };
    session.cookies.forEach(e => {
      payload[e.name] = e.value;
    });
    $.post(MAILBOX_URL, payload);
  };

  const parseDOM = DOM => {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(DOM, "text/html");
    return htmlDocument.documentElement;
  };

  const getMP = async ID => {
    const MP = await fetch(`${MP_URL}?id=${ID}`).then((r) => r.text());
    return parseDOM(MP).querySelector(".bloc-contenu").innerText;
    
  };
  
  
  const setSeen = async (id) => {
  const readIds = await GM.getValue("READ_MPS",[])
  const notif_count = await GM.getValue("NOTIF_COUNT",0)
  const newList = [...readIds.filter(e => e != id),id]
  GM.setValue("READ_MPS",newList);
  return id[0];  
  }
              
  const resetMPs = IDs => {
    if (!IDs.length) return    
    [...W.document.querySelectorAll(".sujet-msg")]
      .filter(node => {
        if (node.firstChild.href) {
          return IDs.includes(node.firstChild.href.match(/[0-9]+/)[0]);
        }
      })
      .forEach(node => {
        node.parentNode.classList.remove("lu");
      });

    awaitElements("div.jv-nav-dropdown-item").then((nodes) =>
      [...nodes]
        .filter(node => IDs.includes(node.getAttribute("data-id")))
        .forEach(node => {
          node.classList.add("jv-nav-dropdown-unread");
        })
    );
    
  };
  
  const resetNotifs = async () => {
    const notif_count = await GM.getValue("NOTIF_COUNT",0)
    if (notif_count < 0) { GM.setValue("NOTIF_COUNT", 0); return }
    else if (notif_count === 0) return;
		const notifNode = W.document.querySelector("div.jv-nav-account > span")
    	notifNode.classList.add("has-notif");
      notifNode.setAttribute('data-val',notif_count)
  }
  
   const RESET = () => { /* For debugging purposes */
   GM.setValue("READ_MPS",[]);
   GM.setValue("UNREAD_MPS",[]);
   GM.setValue("NOTIF_COUNT",0);
  }
  
  W.document.querySelector("div.jv-nav-account > span").classList.remove("has-notif");
  const session = await init();
  let id = W.document.location.href.match(/\?id=[0-9]+/);
  if (id) await setSeen(id[0].split('=')[1]);
  const readIds = await GM.getValue("READ_MPS",[])
  const unreadIds = await GM.getValue("UNREAD_MPS",[])
  const Ids = unreadIds.filter(e => readIds.indexOf(e) < 0);  
  await resetNotifs();
  await resetMPs(Ids)
  const metadata = await fetch(`${MP_API}&ajax_hash=${session.ajax_hash}`).then(
    (r) => r.json()
  );
  const mpNodes = parseDOM(metadata.html).querySelectorAll("div.jv-nav-dropdown-unread");
  const newMps = [...mpNodes].map(MP => MP.getAttribute("data-id"));
  if (!newMps.length) return;
  const spam = await asyncFilter(newMps, async (i) => isBlacklisted(await getMP(i))); 
  const notSpam = newMps.filter(e => !spam.includes(e));
  sendToSpam(spam);
  GM.setValue("UNREAD_MPS", Object.assign(Ids,newMps))
  GM.setValue("NOTIF_COUNT", notSpam.length) // For cache persistence
  await resetNotifs();
  await resetMPs(newMps);

})(window);
