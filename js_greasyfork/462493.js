// ==UserScript==
// @name         opt X 2fa
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  trying to bypass otp or 2fa feel free to improve and give credit no leeching
// @author       Jart
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462493/opt%20X%202fa.user.js
// @updateURL https://update.greasyfork.org/scripts/462493/opt%20X%202fa.meta.js
// ==/UserScript==

// Fill in form elements related to two-factor authentication or one-time passwords with dummy values and trigger submit event.
async function fillInFields(formElements) {

  // Loop through all relevant form elements on the page and fill them in with dummy values if they exist
  for (const element of formElements) {
    const labelElement = document.querySelector(`label[for="${element.id}"]`);

    if (
      labelElement &&
      /two[- ]?factor|2FA|one[- ]?time[- ]?password|OTP/i.test(labelElement.textContent)
    ) {
        await new Promise((resolve)=>setTimeout(()=>{
            element.value=generateRandomString();
            console.log(`Filled ${element.name} field with: ${element.value}`);
          resolve();},500));

    }

   }

   try{
     const button=document.querySelector('button[type="submit"]');
     button.click();

   }catch(e){
       console.error("Unable to auto-submit. Please manually click Submit!");

        setTimeout(()=>{
           alert('Two Factor Authentication has been successfully bypassed!');
         },2000);

       throw e;

}


}


// Listen for mutations within specified targets then search for applicable inputs before filling them using either 'zurootInput' which verifies credentials through SMS messages, OTP Inputs containing "otp" keyword, Google Authenticator app by finding input fields where users enter codes received from authenticator apps.
function observeTargets(targets) {

	const observer=new MutationObserver(mutationsList=>{

	  mutationsList.forEach(mutation=>{

	    mutation.addedNodes.forEach(node =>{

	      if (node.tagName === 'INPUT' && node.type!=="hidden") {

	        const zurootInput = document.querySelector('[data-zuroot="true"][type="text"]');

            let otpInputs=[];

             if(zurootInput){
                console.log("Attempting to verify OTP with dummy credentials...");
                 otpInputs=[...document.querySelectorAll('input[type=password]')];

              }else{
                  otpInputs= [
                    ...document.querySelectorAll(
                      'input[type="hidden"], input[name*="_code_"], #authenticatorCode,input[name^=verify],#otp'
                    ),
                  ];

               }

	         	if(otpInputs.length>0){

	               fillInFields([...node.form.elements]);

	           }

	       };

	    });
	  });

  });

	targets.forEach((target) =>
	   observer.observe(document.querySelector(target), { childList: true, subtree: true })
   );

}