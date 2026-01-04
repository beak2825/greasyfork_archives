// ==UserScript==
// @name         Steam Trade Quick Accept
// @namespace    http://steamcommunity.com/
// @version      1.0
// @description  Adds a cute little accept button to incoming offers on Steam
// @author       3kh0
// @license      MIT
// @match        https://steamcommunity.com/*/tradeoffers*
// @match        https://steamcommunity.com/tradeoffer/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540084/Steam%20Trade%20Quick%20Accept.user.js
// @updateURL https://update.greasyfork.org/scripts/540084/Steam%20Trade%20Quick%20Accept.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function a() {
    const t = document.querySelectorAll('.tradeoffer');
    
    t.forEach(offer => {
      const rl = offer.querySelector('.tradeoffer_footer_actions a[href*="ShowTradeOffer"]');
      if (!rl) return;
      const id = offer.id.replace('tradeofferid_', '');
      if (!id) return;
      
      const f = offer.querySelector('.tradeoffer_footer_actions');
      if (!f) return;

      if (f.querySelector('.qa')) return;

      const btn = document.createElement('a');
      btn.href = 'javascript:void(0);';
      btn.className = 'whiteLink qa';
      btn.textContent = 'Accept Trade';
      btn.style.color = '#5cb85c';
      btn.style.fontWeight = 'bold';
      
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        accept(id);
      });

      f.appendChild(document.createTextNode(' | '));
      f.appendChild(btn);
    });
  }
  
  function accept(id) {
    const match = document.cookie.match(/(^|; )sessionid=([^;]*)/);
    const sessionId = match ? match[2] : null;

    const btn = document.querySelector(`#tradeofferid_${id} .qa`);
    if (btn) {
      btn.textContent = 'Accepting...';
    }
    
    let partnerId = '';
    const links = document.querySelectorAll(`#tradeofferid_${id} .tradeoffer_partner a`);
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      const match = href.match(/\/profiles\/(\d+)/);
      if (match && match[1]) {
        partnerId = match[1];
      }
    });
    
    if (!partnerId) {
      const avatar = document.querySelector(`#tradeofferid_${id} .tradeoffer_partner .playerAvatar`);
      const miniId = avatar ? avatar.getAttribute('data-miniprofile') : '';
      
      if (miniId) {
        partnerId = miniId;
      }
    }
    
    if (!partnerId) {
      if (btn) {
        btn.textContent = 'Error';
        btn.style.color = 'red';
      }
      return;
    }
    
    const url = `https://steamcommunity.com/tradeoffer/${id}/accept`;
    const body = `sessionid=${encodeURIComponent(sessionId)}&serverid=1&tradeofferid=${encodeURIComponent(id)}&partner=${encodeURIComponent(partnerId)}&captcha=`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    
    fetch(url, {
      method: 'POST',
      body: body,
      credentials: 'include',
      headers: headers,
      referrer: `https://steamcommunity.com/tradeoffer/${id}/`,
      mode: 'cors'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`http fuck up ${response.status} ${response.statusText}`);
      }
      
      return response.text().then(text => {
        try {
          if (!text || text.trim() === '') {
            return { empty: true };
          }
          
          return JSON.parse(text);
        } catch (e) {
          throw new Error(`Invalid JSON`);
        }
      });
    })
    .then(data => {
      if (data.empty || data.strError) {
        if (btn) {
          btn.textContent = 'Error';
          btn.style.color = 'red';
        }
        return;
      }
      
      if (data && data.needs_mobile_confirmation) {
        if (btn) {
          btn.textContent = 'Confirm on mobile';
          btn.style.color = 'orange';
        }
        return;
      }
      
      if (btn) {
        btn.textContent = 'Accepted!';
        btn.style.color = 'green';
      }
    })
  }
  
  a();
  
  const o = new MutationObserver(function(ms) {
    ms.forEach(function(m) {
      if (m.addedNodes && m.addedNodes.length > 0) {
        a();
      }
    });
  });
  
  o.observe(document.body, {
    childList: true,
    subtree: true
  });
})();