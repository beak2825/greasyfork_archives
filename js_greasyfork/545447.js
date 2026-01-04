// ==UserScript==
// @name         Empl*ym*nt Term Censor
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Censors those pesky offensive words...
// @author       Meolsei
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545447/Empl%2Aym%2Ant%20Term%20Censor.user.js
// @updateURL https://update.greasyfork.org/scripts/545447/Empl%2Aym%2Ant%20Term%20Censor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const EMPLOYMENT_TERMS = [
    "accountant","applicant","apprenticeship","benefit","bonus","boss",
    "career","colleague","contract","contractor","corporation","cover_letter","cv",
    "deadline","demotion","employee","employer","employment","entrepreneur","equity",
    "freelance","freelancer","gig","hiring","hire","human_resources","income",
    "independent_contractor","internship","interview","job","job_offer","job_search",
    "labor","layoff","leave","leave_of_absence","manager","management","mentorship",
    "motivation","networking","onboarding","overtime","part_time","pay","paycheck",
    "payroll","pension","position","promotion","qualification","recruiter","recruitment",
    "remote","resignation","resume","salary","shift","skill","staff","startup",
    "subcontractor","subcontracting","temp","temporary","tenure","timekeeping","timesheet",
    "training","unemployment","union","vacation","wage","work","work_from_home",
    "workload","workplace","workforce"
  ];

  const EXCLUDE_SELECTOR = 'script, style, noscript, textarea, code, pre, input, select, option, iframe, svg, canvas';

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const pattern = EMPLOYMENT_TERMS.map(escapeRegex).join('|');
  const regex = new RegExp(`\\b(${pattern})([a-zA-Z'’-]*)\\b`, 'gi');

  // Replace only middle vowels, preserve first and last char
  function censorMiddleVowels(word) {
    if (word.length <= 2) return word;
    const vowels = /[aeiouAEIOU]/;
    let chars = word.split('');
    for (let i = 1; i < chars.length - 1; i++) {
      if (vowels.test(chars[i])) {
        chars[i] = '*';
      }
    }
    return chars.join('');
  }

  function censorWordWithSuffix(base, suffix) {
    return censorMiddleVowels(base) + suffix;
  }

  function isExcludedTextNode(textNode) {
    const parent = textNode.parentElement;
    if (!parent) return true;
    if (parent.closest(EXCLUDE_SELECTOR)) return true;
    if (parent.isContentEditable) return true;
    return false;
  }

  function censorTextNodeValue(val) {
    return val.replace(regex, (match, base, suffix) => {
      return censorWordWithSuffix(base, suffix);
    });
  }

  function walkAndReplace(root) {
    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      const toProcess = [];
      let node;
      while (node = walker.nextNode()) toProcess.push(node);

      for (const textNode of toProcess) {
        if (isExcludedTextNode(textNode)) continue;
        const oldVal = textNode.nodeValue;
        if (!oldVal || !/[A-Za-z]/.test(oldVal)) continue;
        const newVal = censorTextNodeValue(oldVal);
        if (newVal !== oldVal) textNode.nodeValue = newVal;
      }
    } catch (e) {
      console.error('Censor script error', e);
    }
  }

  walkAndReplace(document.body || document.documentElement);

  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      for (const n of m.addedNodes) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (!isExcludedTextNode(n) && /[A-Za-z]/.test(n.nodeValue)) {
            n.nodeValue = censorTextNodeValue(n.nodeValue);
          }
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          if (!n.closest(EXCLUDE_SELECTOR)) walkAndReplace(n);
        }
      }
    }
  });

  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

})();
