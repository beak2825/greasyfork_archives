// ==UserScript==
// @name         Corona forms
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  kolaborace při vyplňování microsoft forms.
// @author       sirluky
// @match        https://forms.office.com/*
// @match        http://forms.office.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412480/Corona%20forms.user.js
// @updateURL https://update.greasyfork.org/scripts/412480/Corona%20forms.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        'use strict';
    const ServerHost = "https://coronaforms.lkovar.tk/";

    const fID = window.formID ? window.formID : new URLSearchParams(window.location.search).get('id')
function odeslatOdpovedi(questionAnswers){
	const data = JSON.stringify({data: questionAnswers})

	fetch(ServerHost + "answers", {
	  "method": "POST",
	  "headers": {
	    "content-type": "application/json"
	  },
	  "body":data
	}).then(v=>v.json())
	.then(response => {
	  console.log(response, "odpovedi odeslany");
	})
	.catch(err => {
	  console.error(err);
	});
}

function ZiskejOdpovedinaOtazky(){
	const formID = window.formID ? window.formID : new URLSearchParams(window.location.search).get('id')

    window.username = window.OfficeFormServerInfo.userInfo.DisplayName || localStorage.getItem('coronaforms_username') || ('Anonym ' + Math.floor(Math.random()*10000000))
    localStorage.setItem('coronaforms_username', window.username)

    const username = window.username;
	const qcount = document.querySelectorAll('.office-form-body .office-form-question').length;
	let OtazkyAOdpovedi = [];
	for(let i = 1; i <= qcount; i++){
		const qnumber = i // cislo otazky 0..?
		// selector otazky
		let q = document.querySelector(`.office-form-body .office-form-question:nth-child(${qnumber})`)

		let answers = [];
		// ziskej vsechny zvolene odpovedi pro zvolenou otazku do answers
		q.querySelectorAll('.office-form-question-textbox, [aria-checked=true]').forEach(e => {
			answers.push(e.value)
		})
		let otazka = q.querySelector('.office-form-question-title :not([class])').textContent
		answers = answers.join(', ')
		OtazkyAOdpovedi.push({
	        "formID": formID,
	        "question": otazka,
	        "username": username,
	        "answer": answers
	    })
	}
	return OtazkyAOdpovedi;
}

    function cisloOtazkyProOdpoved(hledana){
        const qcount = document.querySelectorAll('.office-form-body .office-form-question').length;
        let OtazkyAOdpovedi = [];
        for(let i = 1; i <= qcount; i++){
            const qnumber = i // cislo otazky 0..?
            // selector otazky
            let q = document.querySelector(`.office-form-body .office-form-question:nth-child(${qnumber})`)

            let otazka = q.querySelector('.office-form-question-title :not([class])').textContent;
            if(otazka === hledana){
                return i
            }
        }
    }
    function smazproOtazku(qnumber){
        const e = document.querySelector(`.office-form-body .office-form-question:nth-child(${qnumber})`).querySelector('.choosed_optionbox')
        if(e){
           e.textContent = "";
           e.remove();
        }
    }

    function ZobrazOdpovediOstatnich_for_one_question(question,answers){
        const qnumber = cisloOtazkyProOdpoved(question)
        smazproOtazku(qnumber);

        let othersChoices = Object.entries(answers).map(([name,answer]) => ({name, choices:answer}))
        console.log(othersChoices)
        let othersChoicesDOM = document.createElement('ul')
        // rerender
        othersChoicesDOM.classList.add('choosed_optionbox') // class push .choosed_optionbox
        // othersChoicesDOM.remove()
        var h3 = document.createElement('h5')
        h3.textContent = "Odpovědi ostatních: "
        othersChoicesDOM.appendChild(h3);

        for(let choice of othersChoices){
                let o = document.createElement('li')
                o.style.paddingLeft = "30px"
                o.textContent = `${choice.name} - ${choice.choices}`
                othersChoicesDOM.appendChild(o);
        }


          document.querySelector(`.office-form-body .office-form-question:nth-child(${qnumber})`).appendChild(othersChoicesDOM);
        if(localStorage.getItem('displayAnswers') == 'true'){
            document.querySelectorAll('.choosed_optionbox').forEach(e => {
               e.style.display = "block";
            })
        } else {
            document.querySelectorAll('.choosed_optionbox').forEach(e => {
               e.style.display = "none";
            })
        }

    }

    function StahniOdpovediOstatnich(){
    	const formID = window.formID ? window.formID : new URLSearchParams(window.location.search).get('id')

        const qcount = document.querySelectorAll('.office-form-body .office-form-question').length;
        let OtazkyAOdpovedi = [];
        let data = [];
        for(let i = 1; i <= qcount; i++){
           const qnumber = i // cislo otazky 0..?
           // selector otazky
           let q = document.querySelector(`.office-form-body .office-form-question:nth-child(${qnumber})`)

           let otazka = q.querySelector('.office-form-question-title :not([class])').textContent;

           const one_data = {
                "formID": formID,
                "question": otazka
           };
           data.push(one_data);
        }
            fetch(ServerHost + "getanswers", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "body": JSON.stringify({data:data})
            }).then(v=>v.json())
                .then(response => {
                console.log(response)
                for(let one_response of response){
                  ZobrazOdpovediOstatnich_for_one_question(one_response.question, one_response.answers)
                  console.log(one_response,JSON.stringify(one_response));
                }
            }).catch(err => {
                console.error(err);
            });
    }
    setInterval(v =>{
        let questionAnswers = ZiskejOdpovedinaOtazky()
        odeslatOdpovedi(questionAnswers);
        StahniOdpovediOstatnich();
    },1000)
    let questionAnswers = ZiskejOdpovedinaOtazky()
    odeslatOdpovedi(questionAnswers);
    StahniOdpovediOstatnich();


const showbar = document.createElement("p");
showbar.style.position = "fixed"
showbar.style.top = "10px";
showbar.style.right = "20px"
showbar.style.zIndex = "100000000"
showbar.style.color="black"
showbar.style.fontSize="30px"
showbar.style.background="white"
showbar.innerText = "0"

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h.toString().padStart(2,'0') + (h == 1 ? ":" : ":") : "";
    var mDisplay = m > 0 ? m.toString().padStart(2,'0') + (m == 1 ? ":" : ":") : "00:";
    var sDisplay = s > 0 ? s.toString().padStart(2,'0') + (s == 1 ? "" : "") : "00";
    return hDisplay + mDisplay + sDisplay;
}

setInterval(()=>{
console.log('FORMID',formIDdom.value)
    window.formID = formIDdom.value
    localStorage.setItem('casvsec-' +fID, parseInt(localStorage.getItem('casvsec-' +fID)||0)+1);
    showbar.innerText = `Váš čas: ${secondsToHms(localStorage.getItem('casvsec-' +fID))}`;
    showbar.innerHTML += `<a href="${ServerHost + fID}" target="_blank"><svg style="padding-left:3px; margin-left:5px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></a>`
},1000)
    const formIDdom = document.createElement('input')
    formIDdom.style.background = "transparent"
    formIDdom.style.border = "none"
    formIDdom.style.display = "block";
    formIDdom.style.width = "auto"
    formIDdom.style.maxWidth = "100%"
    setTimeout(() =>{
   document.querySelector("#form-container .office-form-title-container") && document.querySelector("#form-container .office-form-title-container").appendChild(formIDdom)
    },3000)

// TODO - auto reset


  document.body.appendChild(showbar);
  document.onkeyup = function(e) {
    if (e.ctrlKey && e.which == 66) {
      localStorage.setItem('displayAnswers',localStorage.getItem('displayAnswers') === "true" ? "false" : "true")
      if(localStorage.getItem('displayAnswers') === "true"){
        showbar.style.display = "block"
       document.querySelectorAll('.choosed_optionbox').forEach(e => {
            e.style.display = "block";
        })

      } else {
        showbar.style.display = "none"
       document.querySelectorAll('.choosed_optionbox').forEach(e => {
            e.style.display = "none";
        })

      }
    }
  };

      if(localStorage.getItem('displayAnswers') === "true"){
       showbar.style.display = "block"
      } else {
       showbar.style.display = "none"
      }
    },1000)
    

})();