// ==UserScript==
// @name         Translator Portal Ease of Use
// @namespace    https://www.roblox.com/games/263761432/Horrific-Housing
// @version      1.5.5
// @description  Allows you to automate skipping of invalid translations.
// @author       wut
// @match        https://www.roblox.com/localization/games/*/translations?languageCode=*
// @icon         https://cdn.discordapp.com/attachments/566672513485111296/859943435522539520/unknown-50.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428634/Translator%20Portal%20Ease%20of%20Use.user.js
// @updateURL https://update.greasyfork.org/scripts/428634/Translator%20Portal%20Ease%20of%20Use.meta.js
// ==/UserScript==

// IS THE SITE LOADED?
window.addEventListener("load", function(){
	

	
	
    // EXPAND ALL CONTEXT TABS
    document.querySelectorAll('.section-title')[0].click();
    document.querySelectorAll('.section-title')[1].click();
    document.querySelectorAll('.section-title')[2].click();
	
	
	autoskipList = [];
	autoskipListLength = 0;


    // CREATING THE SKIP BUTTON
	skip = document.querySelector('#selenium-save-entry-button').cloneNode( true );
	skip.setAttribute('id', 'selenium-skip-button');
	document.querySelectorAll('.col-sm-6')[2].appendChild( skip );
	skip.innerHTML = "Skip";
	document.getElementById("selenium-skip-button").style.marginRight = "10px";
	skip.removeAttribute("disabled");
	
	// CREATING THE AUTOSKIP BUTTON
	autoskipmode = 0;
	autoskipbtn = document.querySelector('#selenium-save-entry-button').cloneNode( true );
	autoskipbtn.setAttribute('id', 'selenium-autoskip-button');
	document.querySelectorAll('.col-sm-6')[2].appendChild( autoskipbtn );
	autoskipbtn.innerHTML = "Autoskip";
	document.getElementById("selenium-autoskip-button").style.marginRight = "10px";
	autoskipbtn.removeAttribute("disabled");
	autoskipbtn.style.borderColor = "#ff4444"
	autoskipbtn.style.color = "#ff4444"
	
	// DEFINING THE INPUT TEXTBOX
	inputbox = document.getElementById("selenium-translation-text");
	inputbox.style.resize = "none";
	
	
	
	// SKIP BUTTON LISTENER FUNCTION
	document.getElementById("selenium-skip-button").addEventListener("click", function() {

		// COPYING AND PASTING THE TEXT
		inputbox.value = document.getElementById("selenium-entry-source-text").innerHTML;
		inputbox.innerHTML = document.getElementById("selenium-entry-source-text").innerHTML;
		inputbox.classList.remove("ng-pristine");
		inputbox.classList.remove("ng-empty");
		inputbox.classList.add("ng-valid");
		inputbox.classList.add("ng-not-empty");
		inputbox.classList.add("ng-dirty");
		inputbox.classList.add("ng-valid-parse");

		// MANUAL TEXTBOX UPDATE (IMPORTANT)
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", false, true);
			inputbox.dispatchEvent(evt);
		}
		else {
			inputbox.fireEvent("onchange");
		}

		// AUTOMATICALLY CLICK SAVE
		save = document.querySelector('#selenium-save-entry-button');
		save.click();

	});
	
	
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		
		element.style.display = 'none';
		document.body.appendChild(element);
		
		element.click();

		document.body.removeChild(element);
	};

	
	
	
	
	document.getElementById("selenium-autoskip-button").addEventListener("click", function() {
		
		if (autoskipmode == 0) {
			
			autoskipbtn.style.borderColor = "#52ff52"
			autoskipbtn.style.color = "#52ff52"
			autoskipmode = 1;
			
			// CREATING AUTOSKIP WHITELIST TAB
			autoskip = document.querySelector('.game-locations-context').cloneNode( true );
			autoskip.setAttribute('id', 'autoskip');
			document.querySelector('.meta-data-wrapper').appendChild( autoskip );
			document.querySelectorAll('.section-title')[3].innerHTML = "Autoskip Locations Whitelist";
			
			
			autoskipInputContainer = document.querySelector('.translation-input').cloneNode( true );
			autoskipInputContainer.setAttribute('id', 'autoskip-input-container');
			autoskip.appendChild( autoskipInputContainer );
			autoskipInputContainer.style.height = "38px";
			document.querySelectorAll('[uib-tooltip]')[16].remove();
			document.querySelectorAll('.no-content')[2].remove();
			document.querySelectorAll('.pull-right')[14].remove();
				
			autoskipInput = document.querySelectorAll('#selenium-translation-text')[1];
			autoskipInput.setAttribute('id', 'autoskip-input');
			autoskipInput.setAttribute('placeholder', 'Paste Import File Text Here');
			autoskipInput.value = "";
			autoskipInput.style.height = "35px";
			autoskipInput.style.width = "69%";
			autoskipInput.style.resize = "none";
			autoskipInput.style.overflow = "hidden";
			autoskipInput.setAttribute('rows', '1');
			autoskipInput.removeAttribute('maxlength');
		
			autoskipIEmode = 0;
			autoskipIE = document.querySelector('#selenium-skip-button').cloneNode( true );
			autoskipIE.setAttribute('id', 'autoskip-ie');
			autoskipIE.removeAttribute("ng-click");
			autoskipInputContainer.appendChild( autoskipIE );
			autoskipIE.innerHTML = "Import";
			autoskipIE.style.marginTop = "-33px";
			
			autoskipListClear = autoskipIE.cloneNode( true );
			autoskipListClear.setAttribute('id', 'autoskip-list-clear');
			autoskipInputContainer.appendChild( autoskipListClear );
			autoskipListClear.innerHTML = "Clear List";
			autoskipListClear.style.marginTop = "-33px";
			autoskipListClear.style.marginRight = "94px";
			
	
			// AUTOSKIP IMPORT/EXPORT LISTENER
			document.querySelector('#autoskip-ie').addEventListener("click", function() {
			
				if (autoskipIEmode == 1) {
					
					download("autoskip-config.txt", autoskipList);
					
				} else {
					
					if (autoskipInput.value == "") {
						
						console.log();
						
					} else {
						
						autoskipList = autoskipInput.value.split(',');
						autoskipInput.value = "";
						autoskipIEmode = 1;
						autoskipIE.innerHTML = "Export";
						localStorage.setItem('cachedskiplist', autoskipList);
						
						for (const element of autoskipList) {
							autoskipList[autoskipListLength] = element;
							autoskipListLength += 1;
							newFilter = document.querySelector('.ellipsis-overflow').cloneNode( true );
							autoskipListContainer.appendChild( newFilter );
							newFilter.innerHTML = element;
							autoskipListContainer.style.height = 26 * autoskipListLength + "px";
							newFilter.style.padding = "3px";
							newFilter.style.marginTop = "0px";
							newFilter.classList.add("skipfilter");
						};
					};
					
				};
			});
			
			autoskipAdd = skip.cloneNode( true );
			autoskipAdd.setAttribute('id', 'autoskip-add');
			document.querySelectorAll('.collapsible-content')[1].appendChild( autoskipAdd );
			autoskipAdd.style.marginTop = "-27px";
			autoskipAdd.innerHTML = "Add";
			document.querySelector('.ellipsis-overflow').style.marginTop = "6px";
			
			
			autoskipListContainer = document.createElement("div");
			autoskip.appendChild( autoskipListContainer );
			autoskipListContainer.style.width = "645px"
			autoskipListContainer.style.height = "0px"
			
			//AUTOSKIP ADD BUTTON LISTENER
			document.querySelector('#autoskip-add').addEventListener("click", function() {
			
				if (autoskipList.includes(document.querySelector('.ellipsis-overflow').innerHTML) == false) {
					
					autoskipIEmode = 1;
					autoskipIE.innerHTML = "Export";
					
					// STORING THE INPUT IN ARRAY
					autoskipList[autoskipListLength] = document.querySelector('.ellipsis-overflow').innerHTML;
					autoskipListLength += 1;
					newFilter = document.querySelector('.ellipsis-overflow').cloneNode( true );
					autoskipListContainer.appendChild( newFilter );
					newFilter.innerHTML = document.querySelector('.ellipsis-overflow').innerHTML;
					autoskipListContainer.style.height = 26 * autoskipListLength + "px";
					newFilter.style.padding = "3px";
					newFilter.classList.add("skipfilter");
					localStorage.setItem('cachedskiplist', autoskipList);
					skip.click();
					
				} else {
					
					setTimeout(function(){ autoskipAdd.style.color = "#ff4444"; autoskipAdd.style.borderColor = "#ff4444"; }, 0);
					setTimeout(function(){ autoskipAdd.style.color = "#bdbebe"; autoskipAdd.style.borderColor = "#bdbebe"; }, 150);
					setTimeout(function(){ autoskipAdd.style.color = "#ff4444"; autoskipAdd.style.borderColor = "#ff4444"; }, 300);
					setTimeout(function(){ autoskipAdd.style.color = "#bdbebe"; autoskipAdd.style.borderColor = "#bdbebe"; }, 450);
					setTimeout(function(){ autoskipAdd.style.color = "#ff4444"; autoskipAdd.style.borderColor = "#ff4444"; }, 600);
					setTimeout(function(){ autoskipAdd.style.color = "#bdbebe"; autoskipAdd.style.borderColor = "#bdbebe"; }, 750);
					
				};
			});
			
			// CLEARLIST LISTENER
			autoskipListClear.addEventListener("click", function() {
				
				document.querySelectorAll('.skipfilter').forEach(function(elem) {
					elem.parentNode.removeChild(elem);
				});
				
				autoskipIEmode = 0;
				autoskipIE.innerHTML = "Import";
				autoskipList = [];
				localStorage.setItem('cachedskiplist', autoskipList);
				autoskipListLength = 0;
				autoskipListContainer.style.height = 26 * autoskipListLength + "px";
				
			});
			
			if (localStorage.getItem('cachedskiplist') != null) {
				autoskipList = localStorage.getItem('cachedskiplist').split(',');
				autoskipIEmode = 1;
				autoskipIE.innerHTML = "Export";
				
				for (const element of autoskipList) {
					autoskipList[autoskipListLength] = element;
					autoskipListLength += 1;
					newFilter = document.querySelector('.ellipsis-overflow').cloneNode( true );
					autoskipListContainer.appendChild( newFilter );
					newFilter.innerHTML = element;
					autoskipListContainer.style.height = 26 * autoskipListLength + "px";
					newFilter.style.padding = "3px";
					newFilter.style.marginTop = "0px";
					newFilter.classList.add("skipfilter");
				};
			};
			
		} else if (autoskipmode == 1) {
			
			autoskipbtn.style.borderColor = "#ff4444"
			autoskipbtn.style.color = "#ff4444"
			autoskipmode = 0;
			document.querySelector('#autoskip').remove();
			autoskipAdd.remove();
			document.querySelector('.ellipsis-overflow').style.marginTop = "0px";
			autoskipList = [];
			autoskipListLength = 0;
			
		};
		
	});
	




    // AUTOSKIP EXECUTOR
    const observer = new MutationObserver(mutation => {
		if (autoskipmode == 1) {
			if (autoskipList.includes(document.querySelector('.ellipsis-overflow').innerHTML) == true ) {
				document.getElementById("selenium-skip-button").click();
			};
		};
		
    });

    observer.observe(document.getElementById("selenium-entry-source-text"), {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true
    });


});