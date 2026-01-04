// ==UserScript==
// @name         Special Claims - Outlook Buttons
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Copies the Receive Date, Email, and Name
// @author       Nathan Swarts
// @match        https://outlook.office.com/mail/Specialclaims@dwd.IN.gov/*
// @match        https://outlook.office365.com/mail/Specialclaims@dwd.IN.gov/*
// @match        https://outlook.office.com/mail/PUA@dwd.IN.gov/*
// @match        https://outlook.office365.com/mail/PUA@dwd.IN.gov/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434197/Special%20Claims%20-%20Outlook%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/434197/Special%20Claims%20-%20Outlook%20Buttons.meta.js
// ==/UserScript==

var checkExist = setInterval(function() {
   if (document.getElementsByClassName('_3qXS6Uo8WFxax_lDWr_1a_').length) {
       console.log(document.readyState)
       let division = document.createElement('div');
       let buttonCopyDate = document.createElement('button');
       buttonCopyDate.className = 'ms-Button GJoz3Svb7GjPbATIMTlpL _2W_XxC_p1PufyiP8wuAvwF lZNvAQjEfdlNWkGGuJb7d ms-Button--commandBar PleNk7rXi9dhw_-rxCXnh'
       buttonCopyDate.style.float = 'right'
       buttonCopyDate.onclick = function() {
           let inp = document.createElement('input');
           inp.type = "text";
           inp.value = document.getElementsByClassName('_24i22iNhbLz_Hc8BeXBUwc')[0].innerText;
           document.body.append(inp);
           inp.select();
           document.execCommand("Copy");
           document.body.removeChild(inp);
       };
       let spanCopyDate = document.createElement('span');
       spanCopyDate.className = 'ms-Button-textContainer';
       spanCopyDate.innerHTML = 'Copy Email Date';
       spanCopyDate.style.padding = '10px';
       let buttonCopySubject = document.createElement('button');
       buttonCopySubject.className = 'ms-Button GJoz3Svb7GjPbATIMTlpL _2W_XxC_p1PufyiP8wuAvwF lZNvAQjEfdlNWkGGuJb7d ms-Button--commandBar PleNk7rXi9dhw_-rxCXnh';
       buttonCopySubject.style.float = 'right';
       buttonCopySubject.onclick = function() {
           let inp = document.createElement('input');
           inp.type = "text";
           inp.value = document.getElementsByClassName('_15gqBTUta5ZVWkGNTkvx90')[0].innerText;
           document.body.append(inp);
           inp.select();
           document.execCommand("Copy");
           document.body.removeChild(inp);
       };
       let spanCopySubject = document.createElement('span');
       spanCopySubject.className = 'ms-Button-textContainer';
       spanCopySubject.innerHTML = 'Copy Email Subject';
       spanCopySubject.style.padding = '10px';
       let buttonCopyName = document.createElement('button');
       buttonCopyName.className = 'ms-Button GJoz3Svb7GjPbATIMTlpL _2W_XxC_p1PufyiP8wuAvwF lZNvAQjEfdlNWkGGuJb7d ms-Button--commandBar PleNk7rXi9dhw_-rxCXnh';
       buttonCopyName.style.float = 'right';
       buttonCopyName.onclick = function() {
           let inp = document.createElement('input');
           inp.type = "text";
           inp.value = document.getElementsByClassName("_3HWDmPvwbfbJdx0zvu6Bve")[0].textContent.replace(/ <.*>/,"");
           document.body.append(inp);
           inp.select();
           document.execCommand("Copy");
           document.body.removeChild(inp);
       };
       let spanCopyName = document.createElement('span');
       spanCopyName.className = 'ms-Button-textContainer';
       spanCopyName.innerHTML = 'Copy Name';
       spanCopyName.style.padding = '10px';
       var emailAdrs = [];
       buttonCopyName.append(spanCopyName)
       buttonCopyDate.append(spanCopyDate);
       buttonCopySubject.append(spanCopySubject);
       division.style.border = '3px';
       division.style.borderTopStyle = 'solid';
       division.style.borderTopColor = '#db626c';
       division.append(buttonCopyName);
       division.append(buttonCopyDate);
       division.append(buttonCopySubject);
       document.getElementsByClassName('_3tea2qB15VCCcZHGuh1EJQ')[0].after(division)
       clearInterval(checkExist);
   }
}, 100); // check every 100ms