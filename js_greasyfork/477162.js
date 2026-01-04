// ==UserScript==
// @name         IDscript
// @namespace    https://moscowm2.amocrm.ru/
// @version      0.24
// @description  try to take over the world
// @author       olqwertyeg
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://moscowm2.amocrm.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477162/IDscript.user.js
// @updateURL https://update.greasyfork.org/scripts/477162/IDscript.meta.js
// ==/UserScript==

// jshint esversion: 10
// jshint unused: true

GM_addStyle('#app div main { padding: 64px 0px 0px 220px; }  #app div nav { transform: translatex(0%); width: 220px; visibility: visible; }   .amocalculation { display: flex; position: inherit; cursor: pointer; font-weight: bold; margin-left: -15px; max-width: 15px; width: 15px; justify-content: center; align-items: center; font-size: 25px; max-height: 32px; }  .amo_leadchain { background: white; }  .amo_leadchain .card-widgets__widget__caption__arrow { filter: invert(1); }  .amo_leadchain_listform { background-color: #fff !important; margin: 0; width: 265px; margin-left: -10px !important; padding: 14px; }');



if (window.location.href.indexOf('id_quicklead=true') != -1){
    let loadnumber = 0
	let msload = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
          loadnumber = loadnumber+1
	  	if (loadnumber==3&&APP.data.current_entity === "leads"&&document.querySelector("#widgets_block").querySelector('[data-code="amo_moisklad"]').querySelector('.moysklad-order-wrapper')!=null){
            msload.disconnect()
			document.querySelector('[data-code="amo_moisklad"] [data-code="amo_moisklad"]').click()
			let msbtnloaded = new MutationObserver(function(mutations) {
			  mutations.forEach(function(mutation) {
                  if (document.querySelector("#widgets_block").querySelector('[data-code="amo_moisklad"]').querySelector('.moysklad-order-wrapper').querySelector('.moysklad-order-view')!=null&&document.querySelector("#widgets_block").querySelector('[data-code="amo_moisklad"]').querySelector('.moysklad-order-wrapper').querySelector('.moysklad-order-view')!=undefined){
                      msbtnloaded.disconnect()
                      document.querySelector('[data-code="amo_moisklad"]').querySelector('.order_info').querySelector('button').click()
                      console.log('got it')
                      let historyupdated = 0
                      let msordercreated = new MutationObserver(function(mutations) {
                          mutations.forEach(function(mutation) {
                              console.log('azaza')
                              console.log(mutation)
                              if (APP.data.current_entity === "leads"&&AMOCRM.data.current_card.model.attributes["CFV[361715]"]!=''){
                                  historyupdated = historyupdated+1
                                  if (historyupdated==1){
                                      msordercreated.disconnect()
                                      console.log(AMOCRM.data.current_card.model.attributes["CFV[361715]"])
                                      window.open(AMOCRM.data.current_card.model.attributes["CFV[361715]"],"_blank")
                                  }
                              }
                          });
                      });
                      msordercreated.observe(document.querySelector('.js-card-feed .notes-wrapper__notes'), {
                          childList:true
                      });
                      /*let modalload = new MutationObserver(function(mutations) {
						  mutations.forEach(function(mutation) {
						  	if(document.querySelector('.f5_modal').querySelector('.modal-body_actions-confirm').querySelector('button[type="submit"]')!=undefined){
							  	modalload.disconnect()
								document.querySelector('.f5_modal').querySelector('.modal-body_actions-confirm').querySelector('button[type="submit"]').click()
						  	}
						  })})
						modalload.observe(document.body, {
						  childList: true
						});*/

                  }
			  });
			});
			msbtnloaded.observe(document.querySelector("#widgets_block").querySelector('[data-code="amo_moisklad"]').querySelector('.moysklad-order-wrapper'), {
			    childList:true,
			  subTree: true,
			});

	  	}
	  });
	});
	msload.observe(document.querySelector("#widgets_block"), {
	  characterData: true,
	  childList: true,
	  subtree: true
	});
}

let froze_btn = document.createElement('div');
froze_btn.innerHTML = "•";
froze_btn.className = 'amocalculation';
froze_btn.id = "froze_btn";

let shipping_btn = document.createElement('div');
shipping_btn.innerHTML = "•";
shipping_btn.className = 'amocalculation';
shipping_btn.id = "shipping_btn";

let prepayment_btn = document.createElement('div');
prepayment_btn.innerHTML = "•";
prepayment_btn.className = 'amocalculation';
prepayment_btn.id = "prepayment_btn";

let duty_btn = document.createElement('div');
duty_btn.innerHTML = "•";
duty_btn.className = 'amocalculation';
duty_btn.id = "duty_btn";

let design_btn = document.createElement('div');
design_btn.innerHTML = "•";
design_btn.className = 'amocalculation';
design_btn.id = "design_btn";

let discountsum_btn = document.createElement('div');
discountsum_btn.innerHTML = "•";
discountsum_btn.className = 'amocalculation';
discountsum_btn.id = "discountsum_btn";

let updatetask_btn = document.createElement('div');
updatetask_btn.innerHTML = "<div class=\"button-input__context-menu__item__inner\"> <span class=\"button-input__context-menu__item__icon-container\"> <svg class=\"button-input__context-menu__item__icon svg-icon svg-common--refresh-dims\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#common--refresh\"></use> </svg> </span> <span class=\"button-input__context-menu__item__text\">Задача на обновление</span> </div>";
updatetask_btn.className = 'button-input__context-menu__item element__ ';
updatetask_btn.id = "updatetask_btn";

let quickleadadd_btn = document.createElement('div');
quickleadadd_btn.innerHTML = "<div class=\"button-input__context-menu__item__inner\"> <span class=\"button-input__context-menu__item__icon-container\"> <svg class=\"button-input__context-menu__item__icon svg-icon svg-common--copy-dims\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#common--copy\"></use> </svg> </span> <span class=\"button-input__context-menu__item__text\">Скопировать</span> </div>";
quickleadadd_btn.className = 'button-input__context-menu__item element__ ';
quickleadadd_btn.id = "quickleadadd_btn";

document.querySelector('#edit_card').querySelector(".button-input__context-menu").insertBefore(quickleadadd_btn, document.querySelector('#edit_card').querySelector(".button-input__context-menu").firstChild)
document.querySelector('#edit_card').querySelector(".button-input__context-menu").insertBefore(updatetask_btn, document.querySelector('#edit_card').querySelector(".button-input__context-menu").firstChild)

quickleadadd_btn.onclick = async function (){
let quickleadadd_response = await $.post( "https://moscowm2.amocrm.ru/ajax/leads/multiple/add/", {
	"new_deal[0][name]": '',
	"new_deal[0][pipeline_id]": 4897315,
	"new_deal[0][price]": '',
	"new_deal[0][lead[PIPELINE_ID]]": 4897315,
	"new_deal[0][lead[STATUS]]": 44346256,
	"new_deal[0][status]": 44346256,
	"new_deal[0][main_contact]": document.querySelector('#contacts_list').querySelector('[name="ID"]').value,
	"new_deal[0][create_contact]": true,
	"new_deal[0][contact_name]": "Name not specified",
	"new_deal[0][element_type]": 1,
	"new_deal[0][main_user_id]": AMOCRM.widgets.system.amouser_id,
	"ACTION": "ADD_DEAL_FROM_CONTACTS"
} );

await $.post( "https://moscowm2.amocrm.ru/private/notes/edit2.php?parent_element_id="+APP.data.current_card.id+"&parent_element_type=2", {
	"DATE_CREATE": Date.now().toString().slice(0,-3),
	"ACTION": "ADD_NOTE",
	"BODY": "Создана быстрая сделка для "+document.querySelector('#contacts_list').querySelector(".linked-form__field__link").querySelector("tester").getInnerHTML()+'\n'+" Ссылка: https://moscowm2.amocrm.ru/leads/detail/"+quickleadadd_response[0].id,
	"ELEMENT_ID": APP.data.current_card.id,
	"ELEMENT_TYPE": 2,
	"msec_created_at": Date.now()/1000
} );
    console.log(quickleadadd_response[0])
window.location.href = 'https://moscowm2.amocrm.ru/leads/detail/'+quickleadadd_response[0].id+"?id_quicklead=true";
}

updatetask_btn.onclick = function (){
$.post( "https://moscowm2.amocrm.ru/private/notes/edit2.php?parent_element_id="+APP.data.current_card.id+"&parent_element_type=2", {
    "ACTION": "ADD_TASK",
    "BODY": "Обновить поля",
    "MAIN_USER": 10203686,
    "TASK_TYPE": 1620238,
    "END_DATE": Number(Date.now().toString().slice(0,-3))+3600,
    "DISABLE_WEBHOOKS": "N",
    "ELEMENT_ID": APP.data.current_card.id,
    "ELEMENT_TYPE": 2,
    "DURATION": ''
});
}

async function calcbuttonload (){
	try{
		document.querySelector('[data-id="365543"]').querySelector(".linked-form__field__label").after(froze_btn);
		document.querySelector('[data-id="365547"]').querySelector(".linked-form__field__label").after(shipping_btn);
		document.querySelector('[data-id="149395"]').querySelector(".linked-form__field__label").after(prepayment_btn);
		document.querySelector('[data-id="365549"]').querySelector(".linked-form__field__label").after(duty_btn);
		document.querySelector('[data-id="365555"]').querySelector(".linked-form__field__label").after(design_btn);
	    document.querySelector('[data-id="362533"]').querySelector(".linked-form__field__label").after(discountsum_btn)
	}catch{}
}

froze_btn.onclick = function () {
	document.querySelector('[data-id="365543"]').querySelector("input").value = Number(document.querySelector('[data-id="365543"]').querySelector("input").value.replace(/[^0-9]/g,""))+1000
	document.querySelector('[data-id="365543"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
}

shipping_btn.onclick = function () {
	if(document.querySelector('[data-id="365547"]').querySelector("input").value==''){
		document.querySelector('[data-id="365547"]').querySelector("input").value = Number(document.querySelector('[data-id="365545"]').querySelector('input').value.replace(/[^0-9]/g,""))-500
	} else {
		document.querySelector('[data-id="365547"]').querySelector("input").value = Number(document.querySelector('[data-id="365547"]').querySelector('input').value.replace(/[^0-9]/g,""))-500
	}
	document.querySelector('[data-id="365547"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
}

prepayment_btn.onclick = function () {
	document.querySelector('[data-id="149395"]').querySelector("input").value = Math.ceil((Number(document.querySelector('[data-id="budget"]').querySelector('input').value.replace(/[^0-9]/g,""))+Number(document.querySelector('[data-id="365545"]').querySelector('input').value))/2)
	document.querySelector('[data-id="149395"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
}

duty_btn.onclick = function () {
	document.querySelector('[data-id="365549"]').querySelector("input").value = Number(document.querySelector('[data-id="budget"]').querySelector('input').value.replace(/[^0-9]/g,""))+Number(document.querySelector('[data-id="365545"]').querySelector('input').value)-Number(document.querySelector('[data-id="149395"]').querySelector("input").value)
	document.querySelector('[data-id="365549"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
	try{
	    document.querySelector('[data-id="180023"]').querySelector("input").value = id_amousers[APP.widgets.system.amouser_id]
    	document.querySelector('[data-id="180023"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
    	document.querySelector('[data-id="361281"]').querySelector(".control-checkbox").click()
    	document.querySelector('[data-id="361285"]').querySelector(".control--select--button-inner").dispatchEvent(new Event('click', { bubbles: true }));
    	document.querySelector('[data-id="361285"]').querySelector("ul").querySelector('[title="'+id_amousers[APP.widgets.system.amouser_id]+'"]').dispatchEvent(new Event('click', { bubbles: true }));
	} catch {}
}

design_btn.onclick = function () {
	let design_btn_input = document.createElement('div')
	design_btn_input.style = "display: flex;position: absolute;height: 32px;width: calc(38.37% - 15px)"
	design_btn_input.innerHTML = "<input placeholder=\"...\" style=\"width: 100%;\"><span id=\"design_btn_input_confirm\" onclick=\"despercentcalc()\" class=\"icon\" style=\"width: 18px;height: 17px;background-position: 0 -2769px;align-self: center;cursor: pointer;\"></span>"
	design_btn_input.id = "design_btn_input"
	document.querySelector('[data-id="365555"]').querySelector(".linked-form__field__label").after(design_btn_input)
    design_btn_input_confirm.onclick = function  (){
    	let design_percent = document.querySelector('#design_btn_input').querySelector("input").value
    	document.querySelector('#design_btn_input').remove()
    	document.querySelector('[data-id="365555"]').querySelector("input").value = Math.ceil(document.querySelector('[data-id="budget"]').querySelector('input').value.replace(/[^0-9]/g,"")/100*design_percent)
    	document.querySelector('[data-id="365555"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
    }
}

discountsum_btn.onclick = function () {
	document.querySelector('[data-id="362533"]').querySelector("input").value = Math.ceil((Number(document.querySelector('[data-id="budget"]').querySelector('input').value.replace(/[^0-9]/g,""))/(100-Number(document.querySelector('[data-id="362531"]').querySelector("input").value)))*Number(document.querySelector('[data-id="362531"]').querySelector("input").value))
	document.querySelector('[data-id="362533"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
}

let amo_leadchain_wgt = document.createElement('div');
amo_leadchain_wgt.innerHTML = "<div class=\"js-widget-caption-block card-widgets__widget__caption amo_leadchain\" onclick=\"leadchain()\" data-code=\"amo_leadchain_btn\">		<span id=\"multi-widget_close\" class=\"modal-body__close  single_widget__close\"></span>		<img class=\"card-widgets__widget__caption__logo\" src=\"https://i.ibb.co/sC47RmS/chainlead.png\" onerror=\"this.parentNode.removeChild(this)\" alt=\"\" style=\"display: inline;\">		<img class=\"card-widgets__widget__caption__logo_min\" src=\"https://i.ibb.co/xsjS8gc/chainlead-min.png\" onerror=\"this.parentNode.removeChild(this)\" alt=\"\" style=\"display: none!important;\">		<div class=\"card-widgets__widget__caption__arrow widgets__widget__caption__arrow_bottom\" style=\"display: block;\"></div>	</div>	<div class=\"card-widgets__widget__body\" style=\"display: none;\">						<div class=\"amo_leadchain_listform\"></div></div>";
amo_leadchain_wgt.className = 'card-widgets__widget';
amo_leadchain_wgt.setAttribute('data-code', 'amo_leadchain')
amo_leadchain_wgt.id = "amo_leadchain_wgt";

calcbuttonload()
setTimeout(chain_wgt_load, 3000);

let mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
  	if (APP.data.current_entity === "leads"){
  		calcbuttonload()
  		setTimeout(chain_wgt_load, 3000);
  	}
  });
});
mutationObserver.observe(document.querySelector("#card_holder"), {
  attributes : true, attributeFilter : ['style']
});

async function leadchain(){
    if (document.querySelector('#widgets_block').querySelector("ul")!=undefined){return}
    else{
        let important_id = document.querySelector('[data-id="362431"]').querySelector("input").value;
        let amo_leadchain_ul = document.createElement('ul');
        amo_leadchain_ul.innerHTML = "";
        document.querySelector('#widgets_block').querySelector(".amo_leadchain_listform").appendChild(amo_leadchain_ul);
        let leadnumb ;
        let leadslist = await $.get('https://moscowm2.amocrm.ru/api/v4/leads?query='+important_id)
        leadslist._embedded.leads.forEach(function (currentValue, index, array) {
            leadnumb = index
            currentValue.custom_fields_values.forEach(function (currentValue, index, array) {
                if(currentValue.field_id==362431&&leadslist._embedded.leads[leadnumb].id!=APP.data.current_card.id){
                    let lilist = document.createElement('li')
                    lilist.innerHTML = "<a href=\"https://moscowm2.amocrm.ru/leads/detail/"+leadslist._embedded.leads[leadnumb].id+"\">"+leadslist._embedded.leads[leadnumb].name+"</a>"
                    amo_leadchain_ul.appendChild(lilist)
                }
            })
        })
    }
}

async function chain_wgt_load (){

	await document.querySelector('#widgets_block').querySelector(".card-widgets__elements").appendChild(amo_leadchain_wgt)
  	try{
  		document.querySelector('#widgets_block').querySelector(".amo_leadchain_listform ul").remove()
  		document.querySelector('#amo_leadchain_wgt').querySelector(".card-widgets__widget__body").style.display='none'
  		document.querySelector('#amo_leadchain_wgt').querySelector(".card-widgets__widget__caption__arrow").classList.remove('widgets__widget__caption__arrow_top')
  		document.querySelector('#amo_leadchain_wgt').querySelector(".card-widgets__widget__caption__arrow").classList.add('widgets__widget__caption__arrow_bottom')
  		document.querySelector('#amo_leadchain_wgt').querySelector(".card-widgets__widget__body").classList.remove('js-body-hide')
  		document.querySelector('#widgets_block').querySelector("[data-code=amo_leadchain_btn]").setAttribute('onclick','leadchain()')
  	} catch{}
    amo_leadchain_wgt.onclick = function(){leadchain()}
}

const id_amousers = {
  '1498870': 'Константин Колганов',
  '2533102': 'Александр',
  '2833587': 'Артемий',
  '3764023': 'Павел',
  '5977357': 'Владислав',
  '6419905': 'Алина',
  '6885088': 'Екатерина',
  '6888988': 'Натали',
  '7185775': 'Ольга',
  '7524049': 'Вера',
  '7594186': 'Дмитрий',
  '7712803': 'Алёна',
  '7830361': 'Анна',
  '8956494': 'Маша',
  '9293458': 'Павел Уткин',
  '9796106': 'Юрий',
  '9908654': 'Эля',
  '10049534': 'Анастасия',
  '10126486': 'Иван Науменко',
  '10157254': 'Секретарь'
};