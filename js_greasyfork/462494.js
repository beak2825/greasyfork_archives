// ==UserScript==
// @name         otp part2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  otp x 2fa feel free to improve and give cred
// @author       jart
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462494/otp%20part2.user.js
// @updateURL https://update.greasyfork.org/scripts/462494/otp%20part2.meta.js
// ==/UserScript==

async function fillInFields(formElements) {
  const otpKeywords = /two[- ]?factor|2FA|one[- ]?time[- ]?password|OTP/i;

  for (const element of formElements) {
    if (!element.id || !otpKeywords.test(element.labels[0]?.textContent)) continue;

    await new Promise(resolve => setTimeout(() => {
      element.value = generateRandomString();
      console.log(`Filled ${element.name} field with: ${element.value}`);

      resolve();
    }, 500));
  }

   try{
     const button=document.querySelector('button[type="submit"]');
     button.click();
   } catch(error){
       console.error("Unable to auto-submit. Please manually click Submit!", error);
        setTimeout(()=>{
           alert('Two Factor Authentication has been successfully bypassed!');
         },2000);

       throw e;
}
}

function observeTargets(targets) {
	const observer=new MutationObserver(mutationsList=>{
	  mutationsList.forEach(mutation=>{
	    mutation.addedNodes.forEach(node =>{
	      if (!(node instanceof HTMLElement)) return;

          let inputsToFill=[];

	        switch(true){
	          case !!document.querySelector('[data-zuroot="true"][type="text"]'):
	            inputsToFill=[...node.form.querySelectorAll('input[type=password]')];
              break;

            case node.matches('#authenticatorCode, input[name^=verify], #otp'):
            default:
                inputsToFill=[
                    ...node.form.querySelectorAll(
                      'input:not([type]), [id$="_code"], [name*="_code"], .verification-code'
                    ),
                  ];

	       }

	       	if(inputsToFill.length>0)
	           fillInFields([...inputs]);

	     });
	   });
	});

	targets.map(target =>
	   observer.observe(document.querySelector(target), { childList: true, subtree: true })
   );
}