// ==UserScript==
// @name         Angi Subject & Body Copy UI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Dropdown to pick a canned response; buttons above subject & email to copy subject/body
// @match        https://office.angi.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542745/Angi%20Subject%20%20Body%20Copy%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/542745/Angi%20Subject%20%20Body%20Copy%20UI.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // canned responses
  const messages = [
    {
      label: "Rodents",
      subject: "Looking for help with rodents? — Senate Termite and Pest Control",
      body: `We are reaching out from Senate Termite & Pest Control regarding your recent rodent inquiry.

To begin combating rodent activity, we advise setting up a no-cost, no-obligation professional inspection as soon as possible.

Our top-to-bottom inspection will focus on:
- Identifying where the rodents are getting in
- What is attracting them
- Determining the size of the colony active in your home

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
    },
    {
      label: "General Pest Control",
      subject: "Looking for help with pests? — Senate Termite and Pest Control",
      body: `We are reaching out from Senate Termite & Pest Control regarding your recent pest control inquiry.

We advise setting up a no-cost, no-obligation professional inspection as soon as possible.

Our top-to-bottom inspection will focus on:
- Identifying any pest-related issues you're having
- Locating the origin of the pest problem

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
    },
    {
      label: "Small Animals",
      subject: "Looking for help with animal removal? — Senate Termite and Pest Control",
      body: `We are reaching out from Senate Termite & Pest Control regarding your recent inquiry about small animal removal.

We advise setting up a no-cost, no-obligation professional attic inspection as soon as possible.

Our top-to-bottom inspection will focus on:
- Identifying the openings animals are using to access your attic
- Presenting options for trapping and removal
- Sealing up attic space from inside to prevent future issues

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
    },
    {
      label: "Cockroaches",
      subject: "Looking for help with cockroach extermination? — Senate Termite and Pest Control",
      body: `We are reaching out from Senate Termite & Pest Control regarding your recent cockroach extermination inquiry.

To begin combating cockroach activity, we advise setting up a no-cost, no-obligation professional inspection as soon as possible.

Our top-to-bottom inspection will focus on:
- Determining what type of cockroaches are present
- Identifying what is attracting them
- Locating their congregating areas

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
    },
    {
      label: "Termites",
      subject: "Looking for help with termites? — Senate Termite and Pest Control",
      body: `We are reaching out from Senate Termite & Pest Control regarding your recent termite inquiry.

To begin combating termite activity, we advise setting up a no-cost, no-obligation professional inspection as soon as possible.

Our top-to-bottom inspection will focus on:
- Identifying the location of the infestation
- Assessing the damage caused

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
    },
    {
      label: "Bedbugs",
      subject: "Looking for help with bedbugs? — Senate Termite and Pest Control",
      body: `We are reaching out from Senate Termite & Pest Control regarding your recent bedbug inquiry.

To begin combating bedbug activity, we advise setting up a no-cost, no-obligation professional inspection as soon as possible.

Our top-to-bottom inspection will focus on:
- Identifying where they are located
- Determining what is attracting them
- Assessing the size of the colony

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
    },
    {
  label: "Attic Wildlife",
  subject: "Concerned about animals in your attic? — Senate Termite and Pest Control",
  body: `We are reaching out from Senate Termite & Pest Control regarding your recent inquiry about animal activity in the attic.

We recommend setting up a no-cost, no-obligation professional inspection to assess the situation.

Our top-to-bottom inspection will focus on:
- Identifying entry points used by squirrels, raccoons, or other wildlife
- Evaluating any damage caused to insulation or structure
- Presenting options for removal and future prevention

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
},
{
  label: "Bees",
  subject: "Looking for help with bees or stinging insects? — Senate Termite and Pest Control",
  body: `We are reaching out from Senate Termite & Pest Control regarding your recent inquiry about bees.

To safely address bee activity on your property, we recommend scheduling a no-cost, no-obligation professional inspection.

Our top-to-bottom inspection will focus on:
- Identifying the type of bee and the location of the hive or active area
- Determining appropriate treatment options based on the findings

Once this information is gathered, we will present our findings and service options.

Call our office today at 703-257-1585 for more information.`
}
  ];
  // track chosen index
  let chosenIndex = -1;

  // inject both UIs
  function injectUI() {
    // SUBJECT UI
    const subjGroup = document.querySelector('#email-subject')?.closest('.form-group');
    if (subjGroup && !document.getElementById('angiSubjUI')) {
      const wrap = document.createElement('div');
      wrap.id = 'angiSubjUI';
      wrap.style.display = 'flex';
      wrap.style.alignItems = 'center';
      wrap.style.marginBottom = '8px';

      const sel = document.createElement('select');
      sel.style.flex = '1';
      sel.style.marginRight = '8px';
      sel.innerHTML = `<option disabled selected>Choose response…</option>` +
        messages.map((m,i)=>`<option value="${i}">${m.label}</option>`).join('');
      sel.addEventListener('change', e => chosenIndex = +e.target.value);

      const btnSubj = document.createElement('button');
      btnSubj.textContent = 'Copy Subject';
      btnSubj.style.padding = '4px 8px';
      btnSubj.style.cursor = 'pointer';
      btnSubj.addEventListener('click', () => {
        if (chosenIndex < 0) return alert('Select a response first');
        GM_setClipboard(messages[chosenIndex].subject);
        btnSubj.textContent = '✓ Copied';
        setTimeout(()=> btnSubj.textContent = 'Copy Subject', 1200);
      });

      wrap.append(sel, btnSubj);
      subjGroup.parentNode.insertBefore(wrap, subjGroup);
    }

    // BODY UI
    const bodyGroup = document.querySelector('#email-content')?.closest('.form-group');
    if (bodyGroup && !document.getElementById('angiBodyUI')) {
      const wrapB = document.createElement('div');
      wrapB.id = 'angiBodyUI';
      wrapB.style.margin = '0 0 8px';

      const btnBody = document.createElement('button');
      btnBody.textContent = 'Copy Body';
      btnBody.style.padding = '4px 8px';
      btnBody.style.cursor = 'pointer';
      btnBody.addEventListener('click', () => {
        if (chosenIndex < 0) return alert('Select a response above');
        GM_setClipboard(messages[chosenIndex].body);
        btnBody.textContent = '✓ Copied';
        setTimeout(()=> btnBody.textContent = 'Copy Body', 1200);
      });

      wrapB.appendChild(btnBody);
      bodyGroup.parentNode.insertBefore(wrapB, bodyGroup);
    }
  }

  // watch for dynamic form load
  new MutationObserver(injectUI).observe(document.body, { childList: true, subtree: true });
})();
