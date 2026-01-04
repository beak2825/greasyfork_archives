// ==UserScript==
// @name     Berkeley EECS16A/EECS16B Selfgrade Autofiller
// @author   Tom Shen
// @version  1.5
// @description This user script is used to generate the self-grade report for Berkeley EE16A course. It will save you a lot of time.  
// @match *://eecs16b.org/self-grade*
// @match *://eecs16a.org/self-grade*
// @grant    none
// @namespace https://greasyfork.org/users/248188
// @downloadURL https://update.greasyfork.org/scripts/377906/Berkeley%20EECS16AEECS16B%20Selfgrade%20Autofiller.user.js
// @updateURL https://update.greasyfork.org/scripts/377906/Berkeley%20EECS16AEECS16B%20Selfgrade%20Autofiller.meta.js
// ==/UserScript==

(()=>{

  function setActionResubmission(){
    (()=>{let all_inputs = document.querySelectorAll(`input[id$="comment"]`);
for (let input of all_inputs){
  input.value = "did not resubmiit this part"
};
      let all_zero = document.querySelectorAll(`input[id$="0"]`);
for (let zero of all_zero){
  if (zero.value == "0") {
    zero.click();
  }
}

      
      
     })();



  }

    var but2 = document.createElement("button");
    but2.addEventListener("click",setActionResubmission);
    but2.innerHTML = "📝 Resubmission Autofill";
    document.getElementsByClassName("txt")[0].appendChild(but2)

})()

