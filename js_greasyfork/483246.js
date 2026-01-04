// ==UserScript==
// @name         ID_Ivan_script
// @namespace    https://moscowm2.amocrm.ru/
// @version      0.3
// @description  try to take over the world
// @author       olqwertyeg
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://moscowm2.amocrm.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483246/ID_Ivan_script.user.js
// @updateURL https://update.greasyfork.org/scripts/483246/ID_Ivan_script.meta.js
// ==/UserScript==
 
// jshint esversion: 10
// jshint unused: true
 
GM_addStyle('#app div main { padding: 64px 0px 0px 220px; }  #app div nav { transform: translatex(0%); width: 220px; visibility: visible; }   .amocalculation { display: flex; position: inherit; cursor: pointer; font-weight: bold; margin-left: -15px; max-width: 15px; width: 15px; justify-content: center; align-items: center; font-size: 25px; max-height: 32px; }  .amo_leadchain { background: white; }  .amo_leadchain .card-widgets__widget__caption__arrow { filter: invert(1); }  .amo_leadchain_listform { background-color: #fff !important; margin: 0; width: 265px; margin-left: -10px !important; padding: 14px; }');

let awesome_btn = document.createElement('div');
awesome_btn.innerHTML = "<span class=\"button-input-inner \"><span class=\"button-input-inner__text\">Сделать красиво</span></span>";
awesome_btn.className = 'button-input button-input_blue';
awesome_btn.id = "awesome_btn";

async function awesomebuttonload (){
	try{
		document.querySelector(".card-entity-form__fields .linked-forms__group-wrapper").appendChild(awesome_btn)
	}catch{}
}

awesomebuttonload()
 
let mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
  	if (APP.data.current_entity === "leads"){
  		awesomebuttonload()
  		setTimeout(chain_wgt_load, 3000);
  	}
  });
});
mutationObserver.observe(document.querySelector("#card_holder"), {
  attributes : true, attributeFilter : ['style']
});

awesome_btn.onclick = async function (){
    const total = Number(document.querySelector('[data-id="366005"]').querySelector("input").value)+Number(document.querySelector('[data-id="366007"]').querySelector("input").value)+Number(document.querySelector('[data-id="366009"]').querySelector("input").value)
    $.post( "https://moscowm2.amocrm.ru/private/notes/edit2.php?parent_element_id="+APP.data.current_card.id+"&parent_element_type=2", {
    	"DATE_CREATE": Date.now().toString().slice(0,-3),
    	"ACTION": "ADD_NOTE",
    	"BODY": "Общий опт "+total+"р, заказ на сумму "+document.querySelector('[data-id="budget"]').querySelector('input').value+"р",
    	"ELEMENT_ID": APP.data.current_card.id,
    	"ELEMENT_TYPE": 2,
    	"msec_created_at": Date.now()/1000
    } );
}