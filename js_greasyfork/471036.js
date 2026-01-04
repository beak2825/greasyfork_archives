// ==UserScript==
// @name     MAHE Autofill Button for Discharge of GIS001
// @version  1.0
// @grant    none
// @match        http://172.16.7.74/DISCHSUM/DischargeEntry*
// @match        http://172.16.7.74/dischsum/DischargeEntry*
// @match        http://172.16.7.74/DISCHSUM/ModifyEntry*
// @match        http://172.16.7.74/dischsum/ModifyEntry*
// @namespace Karan Garg
// @description Says so on the tin
// @downloadURL https://update.greasyfork.org/scripts/471036/MAHE%20Autofill%20Button%20for%20Discharge%20of%20GIS001.user.js
// @updateURL https://update.greasyfork.org/scripts/471036/MAHE%20Autofill%20Button%20for%20Discharge%20of%20GIS001.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const d = new Date();
  let month = months[d.getMonth()];
  var date = d.getDate()

  var titleDate = month + " " + date

  // Create the autofill button
  var button = document.createElement('button');
  button.innerHTML = 'Autofill';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  document.body.appendChild(button);

  // Create the scans button
  var linkbutton = document.createElement('button');
  linkbutton.innerHTML = 'Access Scans';
  linkbutton.style.position = 'fixed';
  linkbutton.style.top = '40px';
  linkbutton.style.right = '10px';
  document.body.appendChild(linkbutton);

  // Create the synth button
  var synth = document.createElement('button');
  synth.innerHTML = 'Synthesize HOPI';
  synth.style.position = 'fixed';
  synth.style.top = '70px';
  synth.style.right = '10px';
  document.body.appendChild(synth);

  var hospno = document.getElementById('ctl00_ContentPlaceHolder1_txthospno').value;

   function titleCase(str) {
   str = str.toLowerCase().split(' ');
   for (var i = 0; i < str.length; i++) {
       str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
   }
   return str.join(' ');
   }

  var name = document.getElementById('ctl00_ContentPlaceHolder1_txtptname');
  button.addEventListener('click', function() {
    var input1 = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
    var input2 = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
    var input3 = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
    var input4 = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
    var input5 = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
    var input6 = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
    var input7 = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
    var input8 = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
    var input9 = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
    var input10 = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
    var input11 = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
    var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
    radio.checked = true;
    var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
    select.selectedIndex = 1;

    if (input1.value == '') {
      input1.value = 'Physical findings of Examination :\nThe patient is Conscious, Cooperative, and well Oriented to time, place and person, Responds to commands\nE4M6V5\nNo Pallor, icterus, Cyanosis, Clubbing, Lymphadenopathy, Edema\nVitals: PR:82 bpm, BP: 130/ 80mmHg, RR: 18/min\nSystemic examination:-\nCVS: S1, S2 +, No murmurs\nCNS: GCS 15/15, No focal neurological deficits, HMF intact\nRS: trachea central, bilateral AE +, B/L NVBS +\nPer abdomen - No scars sinuses. No local rise of temperature. No organomegaly. No ascitis\nBS+';
    }
    if (input2.value == '') {
      input2.value = 'No H/o DM or HTN';
    }
    if (input3.value == '') {
      input3.value = 'NA';
    }
    if (input4.value == '') {
      input4.value = 'call on 9606758276';
    }
    if (input5.value == '') {
      input5.value = 'DR. BHARATH KUMAR BHAT';
    }
    if (input6.value == '') {
      input6.value = 'ASSISTANT PROFESSOR AND HOD';
    }
    if (input7.value == '') {
      input7.value = 'GIS-001';
    }
    if (input8.value == '') {
      input8.value = 'Normal diet';
    }
    if (input9.value == '') {
      input9.value = 'Review after _ weeks with _.';
    }
    if (input10.value == '') {
      input10.value = 'Conservative management';
    }
    if (input11.value == ''){
      input11.value = 'Clinically Stable';
    }
    var search = '[title="DATE"]'.replace('DATE', titleDate)
    var node = document.querySelector(search);
    node.click()
  });



  // Open a link when the button is clicked
  linkbutton.addEventListener('click', function() {
      var linkhtml = "https://mahepacs.manipal.edu/HIS/viewImages?mrn=MRDNUM&user=ramsoft_phy&timestamp=2025-06-26%2012:27:34&siteUniqueId=KH"
      var newlink = linkhtml.replace('MRDNUM', hospno.substr(1))
      window.open(newlink, '_blank');
  });

  // Synthesize HOPI when the button is clicked
  synth.addEventListener('click', function(){
  var age = document.getElementById('ctl00_ContentPlaceHolder1_txtage');
  console.log(age.value)
  var input2 = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
  var sex = document.getElementById('ctl00_ContentPlaceHolder1_txtsex');
  var HOPI = document.getElementById('ctl00_ContentPlaceHolder1_txtillness');
  var chief = document.getElementById('ctl00_ContentPlaceHolder1_txtcomplaints');
  var sextxt = "female"
  var gen = 'she'
  if (sex.value == "M"){
      sextxt = "male";
      gen = 'he'
      }
  var nummatch = chief.value.match(/\d+\s+\w+/g);
  for (let i = 0; i < nummatch.length; i++) {
      var numarr = nummatch[i].toLowerCase().split(' ')
      console.log(numarr[1])
  }
  var num = chief.value.match(/\d+\s+/g);
  console.log(num);
  console.log(nummatch);
  var chiefsplt = chief.value.split('\n')
  var resttxt = ''
  var numberArray = num.map(Number);
  console.log(numberArray);
  console.log(Math.max(...numberArray));
  var result = numberArray.indexOf(Math.max(...numberArray));
  console.log(result);
  if(result==1){
      for (let i = 1; i < chiefsplt.length; i++) {
          var k = chiefsplt.length - i - 1
          resttxt += '\nPatient also developed ' + chiefsplt[k].toLowerCase().replace(nummatch[k], '').replace(' x ', '').replace(' since ', '').replace('for', '').replace('  ', '') + ' ' + nummatch[k] + ' back'
      }
      if (HOPI.value == '') {
      HOPI.value = age.value.toLowerCase() + 'ear old ' + sextxt + ' named ' + titleCase(name.value) + ' (' +input2.value.replace('\n', ',') + ') was apparently normal ' + nummatch[chiefsplt.length - 1] + ' back when ' + gen + ' developed ' + chiefsplt[chiefsplt.length - 1].toLowerCase().replace(nummatch[chiefsplt.length - 1], '').replace(' x ', '').replace(' since ', '') + resttxt;
      }
  }else{
      for (let i = 1; i < chiefsplt.length; i++) {
          resttxt += '\nPatient also developed ' + chiefsplt[i].toLowerCase().replace(nummatch[i], '').replace(' x ', '').replace(' since ', '').replace('for', '').replace('  ', '') + ' ' + nummatch[i] + ' back'
      }
      if (HOPI.value == '') {
      HOPI.value = age.value.toLowerCase() + 'ear old ' + sextxt + ' named ' + titleCase(name.value) + ' (' +input2.value.replace('\n', ',') + ') was apparently normal ' + nummatch[0] + ' back when ' + gen + ' developed ' + chiefsplt[0].toLowerCase().replace(nummatch[0], '').replace(' x ', '').replace(' since ', '') + resttxt;
      }
  }

  });

   function preventclose(){window.addEventListener("beforeunload", function(event){
   var confirmationMessage = "You are not allowed to close this window"
   event.returnValue = confirmationMessage
   if (typeof event.preventDefault === "function"){
       event.preventDefault();
  }
  return confirmationMessage
  });
                          }

    function createRadioButton(id, label) {
        var radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.id = id;
        radioButton.name = 'radioGroup';
        radioButton.value = label;

        var radioLabel = document.createElement('label');
        radioLabel.htmlFor = id;
        radioLabel.appendChild(document.createTextNode(label));

        var radioContainer = document.createElement('div');
        radioContainer.appendChild(radioButton);
        radioContainer.appendChild(radioLabel);

        return radioContainer;
    }

    // Create the radio buttons
    var radioContainer1 = createRadioButton('radioButton1', 'Show error when changing window');

    // Add the radio buttons to the document
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '98%';
    container.style.right = '10px';
    container.style.transform = 'translateY(-50%)';
    container.appendChild(radioContainer1);
    document.body.appendChild(container);
    radioButton1.addEventListener('change', preventclose);


})();
