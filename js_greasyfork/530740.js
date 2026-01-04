// ==UserScript==
// @name         Uçur+chat control
// @version      2.9
// @description  Uçur plus !
// @author       Qwyua
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1442650
// @downloadURL https://update.greasyfork.org/scripts/530740/U%C3%A7ur%2Bchat%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/530740/U%C3%A7ur%2Bchat%20control.meta.js
// ==/UserScript==
let mesajbt=document.createElement('button'),m_s,a_i,m_a,m_z,m_b

mesajbt.innerHTML ='<button id="mesajbt" class="btYellowBig" style="margin-top:15px"></span><div name="qwyuaxd"><svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.747 21.75H7.5a.75.75 0 0 1-.683-1.06l3.021-6.667-4.537-.101-1.655 2.005c-.315.396-.567.573-1.209.573h-.84a.828.828 0 0 1-.689-.33c-.112-.151-.221-.406-.114-.77l.929-3.328a.851.851 0 0 1 .024-.074v-.007a.69.69 0 0 1-.024-.075l-.93-3.35c-.101-.356.009-.605.12-.752A.789.789 0 0 1 1.55 7.5h.887c.48 0 .945.215 1.219.563l1.62 1.97 4.562-.067-3.02-6.656A.75.75 0 0 1 7.5 2.25h1.26a1.172 1.172 0 0 1 .908.46l5.862 7.124 2.708-.07c.198-.012.747-.015.874-.015 2.59.001 4.138.842 4.138 2.251 0 .443-.178 1.266-1.363 1.789-.7.31-1.634.466-2.776.466-.125 0-.673-.004-.874-.015l-2.708-.072-5.876 7.125a1.174 1.174 0 0 1-.906.457Z"></path></svg></div><strong>UÇUR</strong></button>';
mesajbt.onmousedown=()=>{

        /*
  eğer bu yazının altında ki // kaldırırsan ve let in başına // koyarsan normal uçur gibi çalışır. */
       // GM_sendMessage('nick',document.getElementsByClassName("content profile")[0].innerText.split("\n")[1]);setTimeout(function(){GM_sendMessage('nick', document.getElementsByClassName("content profile").innerText)},800);
          let msq=document.getElementsByClassName("content profile")[0].innerText.split("\n")[1],asd="?uçur "+msq;chatsend(asd)

}

setInterval(function(){if(document.querySelector(".content.profile")){if(document.querySelector('#mesajbt')==null){document.querySelector('div[class="buttons"]').appendChild(mesajbt)}}},250);
setInterval(function(){const msgElements = document.querySelectorAll('div.msg.you span');if(!document.querySelector("#chat>div>div>div.scrollElements>div.msg.sending.you")){for (const msgElement of msgElements){let x = msgElement.innerText,_rand=Math.floor(Math.random()*999),sensin = document.querySelectorAll(".you")[0].innerText.split("\n")[0],qwe=window.location.href

            /* 
eğer bu yazının altında ki // kaldırırsan nickini chat e yazdığın herkesi atar */
            // GM_sendMessage("nick",x,sensin)
            if(x=="?rpdw"){msgElement.innerText=msgElement.innerText+"";GM_sendMessage("rpdw",_rand)}
            if(x=="?res"){msgElement.innerText=msgElement.innerText+"";GM_sendMessage("res",_rand,qwe)}
            if(x=="?ref"){msgElement.innerText=msgElement.innerText+"";GM_sendMessage("ref",_rand,qwe)}
            if(x.indexOf("?uçur ")!==-1){msgElement.innerText=msgElement.innerText+"";let sads=x.replace("?uçur ",""),xd = Math.floor(Math.random()*999);GM_sendMessage("nick",sads,xd)}

}}},250)

GM_onMessage('nick',function(message,qwe){for(let i of document.querySelectorAll(".nick")){if(message==i.innerText){i.click();document.querySelectorAll(".ic-votekick")[0].click()}}})
GM_onMessage('res',function(x,w){if(window.location.href!=w){var chc = setInterval(function(){document.querySelector("#exit").click();document.querySelector(".ic-yes").click();clearInterval(chc)});let j = window.location.href;let en = setInterval(function(){if(!document.querySelector("#popUp .loading")){clearInterval(en);window.location.href=j}},100)}})
GM_onMessage('rpdw',function(data){document.querySelector(".denounce").click();document.querySelector(".btYellowBig.smallButton.ic-yes").click()})
GM_onMessage('ref',function(data,x){if(window.location.href!=x){document.querySelector("#exit").click()}})
function GM_onMessage(label, callback) {GM_addValueChangeListener(label,function(){callback.apply(undefined, arguments[2])})}
function GM_sendMessage(label){GM_setValue(label, Array.from(arguments).slice(1))}
function chatsend(m_q){a_i=document.querySelector('input[name=chat]');m_a=a_i.value;a_i.value=m_q;m_z=new Event("input",{bubbles:!0});m_z.simulated=!0;m_b=new Event("submit",{bubbles:!0});m_b.simulated=!0;m_s=a_i._valueTracker;m_s&&m_s.setValue(m_a);a_i.dispatchEvent(m_z);a_i.form.dispatchEvent(m_b);}
function answersend(m_q){a_i=document.querySelector('input[name=answer]');m_a=a_i.value;a_i.value=m_q;m_z=new Event("input",{bubbles:!0});m_z.simulated=!0;m_b=new Event("submit",{bubbles:!0});m_b.simulated=!0;m_s=a_i._valueTracker;m_s&&m_s.setValue(m_a);a_i.dispatchEvent(m_z);a_i.form.dispatchEvent(m_b);}

