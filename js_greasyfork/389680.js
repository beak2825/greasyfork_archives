// ==UserScript==
// @name           Google Mail (GMail) Basic HTML Version Keyboard Shortcuts
// @version        0.3
// @namespace      greasemonkey.scripts.ok90
// @description    Enhance GMail Basic HTML with keyboard shortcuts
// @match          https://mail.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/389680/Google%20Mail%20%28GMail%29%20Basic%20HTML%20Version%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/389680/Google%20Mail%20%28GMail%29%20Basic%20HTML%20Version%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==


function scrollToElement(element) {
  var margin = 10;
  var boundingClientRect = element.getBoundingClientRect();
  if(boundingClientRect.top < margin || boundingClientRect.bottom > window.innerHeight - margin) {
    element.scrollIntoView();
  }
}

(function() {
  var mails;
  var curr_mail;
  var mode = '';
  
  function updateUI() {
    for (var i = 0; i < mails.length; i++) {
      mails[i].className = (i == curr_mail) ? "active" : "";
    }
    mails[curr_mail].focus();
  }
  
  function moveItemSelection(delta) {
    curr_mail = Math.min(Math.max(0, curr_mail + delta), mails.length - 1);
    scrollToElement(mails[curr_mail]);
    console.log(mails[curr_mail].href);
    updateUI();
  }
  
  window.addEventListener("keydown", function(e) {
    if (e.keyCode == 27) { // Esc
        document.querySelector("input[name=q]").blur();
      document.querySelectorAll(".th > tbody > tr")[0].focus();
    }
    
    if (document.activeElement.nodeName == 'TEXTAREA'
        || document.activeElement.nodeName == 'INPUT'
        || (document.activeElement.nodeName == 'DIV'
           && document.activeElement.isContentEditable)) {
      
      return;  // Ignore keys when writing text
    }

    if (e.ctrlKey | e.altKey | e.metaKey) return;  // Pass through key combinations.
    
    // Go mode
    if (mode == 'g') {
      if (e.keyCode == 73) { // I Inbox
        document.querySelectorAll("a[accesskey=i]")[0].click();
        e.preventDefault();
      }
      
      if (e.keyCode == 75) { // K Kaufen & Verkaufen
        document.querySelectorAll("table.l tbody tr td.lb a")[0].click();
        e.preventDefault();
      }
     
      mode = '';
      
      return;
    }
    
    // Mark and action mode
    if (mode == 'm') {
      var opts = document.querySelectorAll("select[name=tact]")[0];
      var form = document.querySelectorAll("input[value=Go][type=submit]")[0];
      
      if (e.key == 'r') { // R mark as read
        opts.value = 'rd';
        form.click();
  		  e.preventDefault();
      }
      
      if (e.key == 'u') { // U mark as unread
				opts.value = 'ur';
        form.click();
        e.preventDefault();
      }
     
      mode = '';
      
      return;
    }
    
    if (e.keyCode == 38 || e.keyCode == 75) { // Up
      e.preventDefault();

      if (curr_mail == 0 && window.pageYOffset == 0) {
        document.querySelector("input[name=q]").focus();
      } else if (curr_mail == 0) {
        window.scrollTo(0, 0);
        e.preventDefault();
      } else {
        moveItemSelection(e.shiftKey ? -2 : -1);
        e.preventDefault();
      }
    }
    
    if (e.keyCode == 40 || e.keyCode == 74) { // Down
      if (curr_mail == mails.length - 1) {
        window.scrollTo(0, document.body.scrollHeight);
        e.preventDefault();
      } else {
        moveItemSelection(e.shiftKey ? 2 : 1);
        e.preventDefault();
      }
    }
    
    
    if (e.key == "h" || e.keyCode == 37) { // Left
      Array.from(document.querySelectorAll("table tbody tr td a")).filter(x => {return x.innerText.includes("Newer")})[0].click();
      e.preventDefault();
    }
    if (e.key == "l" || e.keyCode == 39) { // Right
      Array.from(document.querySelectorAll("table tbody tr td a")).filter(x => {return x.innerText.includes("Older")})[0].click();
      e.preventDefault();
    }
    
    
    if (e.keyCode == 13) { // Enter
      mails[curr_mail].children[2].firstChild.click();
      e.preventDefault();
    }
    
    if (e.keyCode == 84) { // T
      if (mails[curr_mail].firstChild.firstChild.hasAttribute('checked')) {
        mails[curr_mail].firstChild.firstChild.removeAttribute('checked');
      } else {
        mails[curr_mail].firstChild.firstChild.setAttribute('checked', '');
      }
      e.preventDefault();
    }
    
    if (e.keyCode == 82) { // R
      location.reload(); 
      e.preventDefault();
    }
    
    if (e.keyCode == 78) { // N
      document.querySelectorAll("table.m tbody tr td b a")[0].click();
      e.preventDefault();
    }
    
    if (e.keyCode == 66) { // B
      window.history.back();
      e.preventDefault();
    }
    
    if (e.keyCode == 71) { // G
      mode = 'g';
      e.preventDefault();
    }
    
    if (e.key == 'm') {
      mode = 'm';
      e.preventDefault();
    }
   });
  
   try {
     document.querySelectorAll(".th > tbody > tr")[0].focus();
 
     var mails = document.querySelectorAll(".th > tbody > tr");
     var curr_mail = 0;

     style = document.createElement('style');
     style.type = 'text/css';
     style.innerHTML = ".th > tbody > tr.active { background: #bbffdd !important; }\n"
       + "html { scroll-behavior: smooth; -webkit-scroll-behavior: smooth; }\n.minidiv {display: none}";
     document.getElementsByTagName('head')[0].appendChild(style);
    
     updateUI();  // updates .active class for first mail
   } catch (error) {}
})();