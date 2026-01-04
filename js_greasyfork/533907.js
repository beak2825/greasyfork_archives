// ==UserScript==
// @name         kxBypass Executor Bypass
// @description  Bypasses Swift + Work.ink [semi] FULLY!
// @namespace    https://discord.gg/pqEBSTqdxV
// @version      2.8
// @match        https://*.work.ink/1ZRk*
// @match        https://*.swiftkeysystem.vip/ks/checkpoint/*
// @match        https://*.swiftkeysystem.vip/ks/getkey/*
// @match        https://*.swiftkeysystem.vip/error*
// @grant        none
// @run-at       document-end
// @icon         https://i.pinimg.com/736x/aa/2a/e5/aa2ae567da2c40ac6834a44abbb9e9ff.jpg
// @downloadURL https://update.greasyfork.org/scripts/533907/kxBypass%20Executor%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/533907/kxBypass%20Executor%20Bypass.meta.js
// ==/UserScript==

(function () {
  'use strict';

if (document.title === 'Just a moment...') return ;

                                                             /* Swift System */

if(location.href.includes("swiftkeysystem.vip/ks/checkpoint/")) {

  setInterval(()=>{
    document.querySelector('.footer').textContent='© 2025 kxBypass • discord.gg/pqEBSTqdxV';
    document.querySelector('.instruction-area').textContent='Swift Key System is absolute dogshit in my opinion.';
    document.querySelector('h1').textContent='kxBypass';
    document.querySelector('.checkpoint-container').style.background='linear-gradient(135deg,rgba(128,0,255,.85),rgba(75,0,130,.85))';
    document.body.style.background='linear-gradient(135deg,#3a0ca3,#720026)';
    const btn = document.querySelector('.continue-button');
       if(btn){
  btn.style.background = 'linear-gradient(135deg, #3a0ca3, #720026)';
  btn.style.color = 'white';
  btn.textContent = 'Join Discord';
  btn.onclick = () => window.open('https://discord.gg/pqEBSTqdxV', '_blank');
}

  }, 100);

  const w=setInterval(()=>{
    const hc=document.querySelector('textarea[name="h-captcha-response"]');
    const t=document.querySelector('#token')?.value;
    const x=document.querySelector('input[name="_xsrf"]')?.value;
    if(hc && hc.value.trim() && t && x) {
      clearInterval(w);
      console.log("✅ hCaptcha solved", hc.value, t, x);

      const f=document.createElement('form');
      f.method='POST';
      f.action=location.href;
      f.style.display='none';

      const add=(name,val)=>{const i=document.createElement('input');i.name=name;i.value=val;f.appendChild(i)};
      add('token',t); add('_xsrf',x); add('h-captcha-response',hc.value);
      document.body.appendChild(f);

      console.log("➡️ Redirecting to:", f.action);
      f.submit();
    }
  },500);
}


   if (window.location.href.includes("swiftkeysystem.vip/ks/getkey/")) {

       const interval = setInterval(() => {
    document.querySelector('.footer').textContent = '© 2025 kxBypass • discord.gg/pqEBSTqdxV';
    document.querySelector('h1').textContent = 'Key System Bypassed! ✅';
    document.querySelector('.completion-container').style.background = 'linear-gradient(135deg, rgba(128, 0, 255, 0.85), rgba(75, 0, 130, 0.85))';
    document.body.style.background = 'linear-gradient(135deg, #3a0ca3, #720026)';

     }, 100);
 }

if(location.href.includes("swiftkeysystem.vip/error?")) {
  setInterval(()=>{
   document.querySelector('.error-illustration svg')?.remove();
   document.querySelector('.header h1').textContent = 'kxBypass';
   document.querySelector('.error-message').textContent = 'An error occured while trying to bypass! Please try again or join our Discord using the button below!';
   document.querySelector('.error-container').style.background = 'linear-gradient(135deg, rgba(128,0,255,.85), rgba(75,0,130,.85))';
   document.body.style.background = 'linear-gradient(135deg,#3a0ca3,#720026)';
   document.querySelector('.footer').textContent = '© 2025 kxBypass • discord.gg/pqEBSTqdxV';
   const btn = document.querySelector('.home-button');
   btn.href = 'https://discord.gg/pqEBSTqdxV';
   btn.style.background = 'linear-gradient(135deg, #3a0ca3, #720026)';
   btn.style.color = 'white';
   btn.textContent = 'Join Discord';
  }, 100);
}


                                                            /* Work.ink System */

  if (window.location.href.includes("work.ink/1ZRk/")) {

  console.log("swift and work.ink bypass by awaitlol. ~ made in 10 minutes -> discord.gg/pqEBSTqdxV");

  const repeatSelectors = [
    '.button-box .accessBtn',
    'button.closelabel'
  ];

  let skipClickCount = 0;
  let accessIsolated = false;

  const interval = setInterval(() => {
    const checkpointNode = document.querySelector('div.fixed.top-16.left-0.right-0.bottom-0.bg-white.z-40.overflow-y-auto');
    if (checkpointNode) {
      checkpointNode.remove();
    }

    document.querySelector('.main-modal')?.remove();

    repeatSelectors.forEach(sel => {
      const btn = document.querySelector(sel);
      if (btn) {
        btn.click();
      }
    });

    const skipBtn = document.querySelector('button.skipBtn');
    if (skipBtn && skipClickCount < 4) {
      skipBtn.click();
      skipClickCount++;
    }

    if (skipClickCount >= 4 && !accessIsolated) {
      const accessBtn = document.querySelector('#access-offers.accessBtn');
      if (accessBtn) {
        document.body.innerHTML = '';
        document.body.style.cssText = `
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: white;
        `;
        document.body.appendChild(accessBtn);
        accessBtn.style.cssText = `
          font-size: 1.25rem;
          padding: 1rem 2rem;
          border-radius: 8px;
          background-color: #10b981;
          color: white;
          border: none;
          cursor: pointer;
        `;

        accessIsolated = true;
        clearInterval(interval);
      }
    }
  }, 200);
}
})();