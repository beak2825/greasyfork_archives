// ==UserScript==
// @name			Copy link in DIAVGEIA
// @name:el			Αντιγραφή συνδέσμου ΔΙΑΥΓΕΙΑΣ
// @description:el	Εμφανίζει εικονίδιο και ΑΔΑ δίπλα στο «Προβολή αρχείου» για αντιγραφή συνδέσμου ή ΑΔΑ με μήνυμα επιβεβαίωσης
// @version			1.2
// @author			Δρ. Παναγιώτης Ε. Παπάζογλου (Δασαρχείο Μετσόβου)
// @match			https://diavgeia.gov.gr/*
// @grant			none
// @license			GPL-3.0-or-later
// @namespace diavgeia
// @description This code displays an icon on the right side of the link "Προβολή αρχείου" on the search results of DIAVGEIA, where by click on it, it copies the URL of the file in human readable format.
// @downloadURL https://update.greasyfork.org/scripts/539236/Copy%20link%20in%20DIAVGEIA.user.js
// @updateURL https://update.greasyfork.org/scripts/539236/Copy%20link%20in%20DIAVGEIA.meta.js
// ==/UserScript==

(function () {
	'use strict';
	function showMessage(text,duration=3e3)
	{
		const msg=document.createElement('div');
		msg.textContent=text;
		Object.assign(msg.style,{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',backgroundColor:'rgba(60,125,34,0.9)',color:'white',padding:'12px 24px',borderRadius:'8px',fontSize:'16px',fontFamily:'Arial, sans-serif',zIndex:99999,opacity:'0',transition:'opacity 0.5s ease-in-out',});
		document.body.appendChild(msg);
		requestAnimationFrame(()=>{msg.style.opacity='1';});
		setTimeout(()=>{msg.style.opacity='0';setTimeout(()=>msg.remove(),500);},duration);
	}
	function enhanceLinks()
	{
		document.querySelectorAll('a[href$="inline=true"]').forEach(lnk=>
		{
			if(lnk.nextSibling?.classList?.contains('copy-icon')) return;
			const copyBtn=document.createElement('span');
			copyBtn.textContent='📋';
			copyBtn.title='Αντιγραφή συνδέσμου ΔΙΑΥΓΕΙΑΣ';
			copyBtn.className='copy-icon';
			copyBtn.style.cursor='pointer';
			copyBtn.style.marginLeft='5px';
			copyBtn.onclick=()=>{navigator.clipboard.writeText(decodeURIComponent(lnk.href));showMessage('Η διεύθυνση αντιγράφτηκε!');};
			const adaBtn=document.createElement('span');
			adaBtn.textContent='ΑΔΑ';
			adaBtn.title='Αντιγραφή ΑΔΑ';
			adaBtn.className='ada';
			adaBtn.style.cursor='pointer';
			adaBtn.style.marginLeft='5px';
			adaBtn.onclick=()=>{const ada=decodeURIComponent(lnk.href).split('/').pop().split('?')[0];navigator.clipboard.writeText(ada);showMessage('Ο ΑΔΑ αντιγράφτηκε!');};
			lnk.insertAdjacentElement('afterend',adaBtn);
			lnk.insertAdjacentElement('afterend',copyBtn);
		});
	}
	const observer=new MutationObserver(()=>enhanceLinks());
	observer.observe(document.body,{childList:true,subtree:true});
	enhanceLinks();
})();