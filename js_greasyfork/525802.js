// ==UserScript==
// @name         MDA IMDB pictures save
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  imdb improvements
// @author       mr-d-r
// @license      MIT
// @match        https://www.imdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @require      https://update.greasyfork.org/scripts/524553/1525219/MDA%20library.js
// @downloadURL https://update.greasyfork.org/scripts/525802/MDA%20IMDB%20pictures%20save.user.js
// @updateURL https://update.greasyfork.org/scripts/525802/MDA%20IMDB%20pictures%20save.meta.js
// ==/UserScript==


/*ttoutSMART(500, 'lbl_111', 'set', ()=>{  		let a=5; 		});
ttoutSMART(600, 'lbl_222', 'set', ()=>{  		let a=6; 		});
ttoutSMART(700, 'lbl_333', 'set', ()=>{  		let a=7; 		});
ttoutSMART('', '', 'list', null);
log('lbl_222: ', ttoutSMART(222, 'lbl_222', 'chk', null));

log(ttoutSMART(222, 'lbl_222', 'chk', null));
ttout(1500,   ()=>{	 log('lbl_222: ', ttoutSMART(222, 'lbl_222', 'chk', null));		});

ttoutSMART(600, 'lbl_222', 			'del', ()=>{ let a=6; 		});		ttoutSMART('', '', 'list', null);
ttoutSMART(600, 'lbl_NOEXISTING', 	'del', ()=>{  let a=6; 		});		ttoutSMART('', '', 'list', null);

//ttoutSMART(600, 'lbl_111', 'del', ()=>{  		let a=6; 		}); 	log('lbl_111: ', ttoutSMART('', 'lbl_11', 'chk', null));
//ttoutSMART(600, 'lbl_333', 'del', ()=>{  		let a=6; 		}); 	log('lbl_111: ', ttoutSMART('', 'lbl_11', 'chk', null));
ttoutSMART(600, 'lbl_222', 'set', ()=>{  		let a=6; 		});
ttout(2500,   ()=>{	 ttoutSMART('', '', 'list', null);		});

function getJSVersion() {
  var version = undefined;
  if (String.prototype.trim) {
    version = 5;
    if (Array.prototype.map) {
      version = 6;
      if (Array.prototype.includes) {
        version = 7;
        if (Object.values) {
          version = 8;
          if (Promise.prototype.finally) {
            version = 9;
            if (Array.prototype.flat) {
              version = 10;
              if (String.prototype.matchAll) {
                version = 11;
                if (String.prototype.replaceAll) {
                  version = 12;
                  if (Object.hasOwn) {
                    version = 13;
                    if (Array.prototype.toSorted) {
                      version = 14;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if (version) {
    return "1." + version;
  } else {
    return "unknown";
  }
}

console.log( getJSVersion() );
let x; x??=5; console.log("x: ", x);


/*
The debugger Keyword
The debugger keyword stops the execution of JavaScript, and calls (if available) the debugging function.

This has the same function as setting a breakpoint in the debugger.

If no debugging is available, the debugger statement has no effect.

With the debugger turned on, this code will stop executing before it executes the third line.
*/


// simplest OOP object example  https://medium.com/@zalewski/object-oriented-programming-in-javascript-with-examples-updated-2024-0b3a90955965
var dog = 	{  	breed: 		'Labrador', 	color: 'black',
				bark() {	log('Woof!');				},
				meow() {	log('Meow!');				}
}; // end of dog
dog.bark();  dog.meow();   // WORKS

class Anim {
	constructor(breed='Labrador', color='black') 	{ 	this.breed=breed;  this.color=color; 	return; 	};
			var111=1; 		// Class field
	static 	var222=1289;	// Class field
			#counter = 0; 	// Private field
	static 	bark(c='blue') 							{	console.log('bark ' +c);							}
}; // end of Anium
Anim.bark('red');  // WORKS
console.log(Anim.var222);

// на основе класса сделать msg.show, mda.clean, msg.edit



(function() {
    //'use strict';


	function showAlert (msg, delay=2000, hook="") { 	// show message bound to HTML element
		console.log("showAlert() " + msg, '\n', hook);
		if (hook=="") hook="[data-test-id='unauth-header-logo']";
		let aa, dialog = document.createElement("dialog");
		aa=qS(hook);  console.log("-=- ", hook, '\n', aa);
		aa?.appendChild(dialog); 	dialog.innerText = msg;
		dialog.show(); 								setTimeout(function () { 	dialog.close(); 	}, delay);
	}


    function showmsgIMDB (msg, durat, hook="")  {   // ``` ёёё
        let aa, mydiv, mydivBase="showmsgQAX",   mydivTitle="showmsgCOMMONtitle";   //,   myDivN=mydivBase;
        var pareFou=qS(hook);   if(!pareFou)  { console.log("hook is not found");  return; }
		aa=qS("#" +mydivBase);  // console.log("mydiv exist?", aa);
        if(!aa) 	mydiv = document.createElement("div");  	// create new
		else 		mydiv=aa;   								// use existing
        mydiv.style.zIndex=100;          mydiv.innerHTML = `<h1> ${msg} </h1>`;                          // border: solid 5px Red;
        mydiv.id=mydivBase;   mydiv.style.position="absolute";   mydiv.title=mydivTitle;
        if(!aa) pareFou.insertBefore(mydiv, pareFou.firstChild)   		//if(!aa) bb=pareFou.appendChild(mydiv);

        if(!aa) tTS(durat, mydivBase, 'new',   ()=>{ 	mydiv.parentNode.removeChild(mydiv);        });  // set my smart timer ttoutSMART()
    }  // end of showmsgIMDB()


	function removeADs() {
		qS("[data-testid='media-sheet__attr-banner']")?.remove(); 		// remove rare ads
		log("trailer ", qS("[data-testid='video-player-slate-overlay']")?.remove() );  	// remove trailer
	}


	async function writeURLToFile(fileHandle, url) {  // WORKS FINE
  		const writable = await fileHandle.createWritable();  	// Create a FileSystemWritableFileStream to write to.
  		const response = await fetch(url); 						// Make an HTTP request for the contents.
  		await response.body.pipeTo(writable);   				// Stream the response into the file.   // pipeTo() closes the destination pipe by default, no need to close it.
	}


	document.addEventListener("keydown", (e) => {
		var aa,bb,ee,  opts, fname, fhnd, clip;
		if(anyActiveInput())  {       return;  }
		switch (e.code) {
			case "ArrowLeft":
			case "ArrowRight":  removeADs();
								break;

			case "KeyS":	if (e.ctrlKey || e.altKey) 	break;
							removeADs();
							aa=document.head.querySelector("meta[property='og:image'][content]");     // <meta property="og:image" content="https://m.media-amazon.com/images/M/MV5BMTUzMDYyNzE4NV5BMl5BanBnXkFtZTcwOTE2NDc1OA@@._V1_FMjpg_UX1000_.jpg">
							if(!aa) { showAlert("picture is NOT found", 2000, '[data-testid="action-bar"]');  return; }
							//console.log("=-=>", aa?.content);
							// window.open(aa?.content); 	// WORKS открывает картинку в новой вкладке    //  window.open(sUrl, '_self') - в той же вкладке
							//if ('showOpenFilePicker' in self) {  console.log("-- !!! --- The showOpenFilePicker() method of the File System Access API is supported."); }
							fname=aa?.content.substring(aa?.content.lastIndexOf('/')+1);
							opts = { suggestedName: fname,  types: [      {	description: 'Images',		accept: {    'image/*': ['.png', '.gif', '.jpeg', '.jpg']      }	},    ],  };
							(async() => {	if (e.shiftKey) { 	clip=await window.navigator.clipboard.readText();
																opts.suggestedName=clip +" " +opts.suggestedName; 	}
											fhnd = await window.showSaveFilePicker(opts);
											writeURLToFile(fhnd,aa?.content);
							})(); 	// WORKS GREAT !!!
				          	e.preventDefault(); e.stopPropagation();
							break;

			case "KeyI":	if (e.ctrlKey || e.altKey) 	break;  // tmp 2del whole KeyI !!!!
        					aa=qS("#showmsgQAX"); 			if (!aa) return;
							if (aa.style.display=="block" || aa.style.display=="") 	{ 	aa.style.display="none"; 	mediaInfoToggle('off'); 	}
							else 													{ 	aa.style.display="block";	mediaInfoToggle('on');		}
							tTS(0,'','list',0);
							e.preventDefault(); e.stopPropagation();
							break;

			case "Backquote":  // like Esc
					if (e.ctrlKey || e.altKey || e.shiftKey)  break;
					showmsgIMDB("	&#x3000; Back to main page", 3000, '[data-testid="media-viewer"]');
					qS('a[data-testid="mv-breadcrumb-close-button"]')?.click();
					e.preventDefault();
					break;
		} // end of switch
	}); // end of  window.addEventListener("keydown", (e) =>


	function mediaInfoToggle(togg) {  var a,b, 	fn=fnName();
		a=qS(".media-viewer__media-sheet .ipc-page-content-container div[aria-hidden]");
		if( !a )  { console.log(`${fn}: cannot find media info panel`); 	return; 	}
		b=a.style.visibility;
		switch (togg) {
			case "on":        case  1:  case  '1':	togg=1;		a.style.visibility='visible';							break;
			case "off":       case  0:  case  '0': 	togg=0;		a.style.visibility='hidden';							break;
			case "toggle":    case 69:  case '69': 	togg=69;	if ( b=='visible' )		a.style.visibility='hidden';
																else 					a.style.visibility='visible';	break;
			case "state":     case  2:  case  '2': 	togg=2;   	if ( b=='visible' )		return 1;
																else 					return 0;
			default:											console.log(`${fn}: invalid parameter: ${togg}`);		return;
		}
	} // mediaInfoToggle()


	document.addEventListener("click",() => { 	var a, b;
		//if(dbg)
		log(`onClick`);
		a=qS("#showmsgQAX"); 			if (!a) return;
		tTO(100, ()=>{
			if( mediaInfoToggle('state') ) 	{ a.style.display="block";   tTS(1500, 'QAX1', 'new',()=>{		a.style.display="none";		log("---must be display=none here!!!");		}); }
			else 							  a.style.display="none";
		});
		tTS(0,'','list',0);
	}); // addEventListener("click"


	function showButtonsInfo (dela) {
		showmsgIMDB("	&#x3000; - S - save picture  					<br> \
						&#x3000; - Shift-S - save with paste  			<br> \
						&#x3000; - Backquote - escape to main page  	<br><br> \
						&#x3000; - I - show/close this help", 						dela, '[data-testid="media-viewer"]');
	} // showButtonsInfo()



	window.navigation.addEventListener("navigate", (event) => {   // https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
		// console.log("on navigate event");
		if (window.location.href.match("/mediaviewer/")) 	showButtonsInfo(2000000);
	});


	window.addEventListener('load', function() {
		let aa;
		if (window.location.href.match("www.imdb.com/embeddable/IMDbEmbeddableStaticDistProd")) { console.log(`${GM.info.script.name} ===> on load event: exiting on IMDbEmbeddableStaticDistProd`);   return; }
		console.log(`${GM.info.script.name} ===> on load event: ${window.location.href}`);

		//TrustedHTMLworkaround();
		setTimeout(function () { 	removeADs(); 	}, 200);
		if (window.location.href.match("/mediaviewer/")) 	showButtonsInfo(2000000);
		setTimeout(function () 	{  	if(aa=qS("span.ipc-see-more")?.querySelector("button.ipc-see-more__button")) {
										console.log("'See all' is clicked ", aa); 	aa?.click(); // click on 'See all' button
										setTimeout(function () 	{					window.scrollTo(0, 0); 	document.dispatchEvent(   new KeyboardEvent('keydown', {'key': 'Home', ctrlKey: true})   );  // jump to the very top of page
																}, 	200);
										setTimeout(function () 	{	removeADs(); 	window.scrollTo(0, 0); 	document.dispatchEvent(   new KeyboardEvent('keydown', {'key': 'Home', ctrlKey: true})   );  // jump to the very top of page
																}, 	400);  // 800
										setTimeout(function () 	{	removeADs();
																}, 	1400);  // 800
										setTimeout(function () 	{	removeADs();
																}, 	3400);  // 800
									}
		}, 600);
	});


})();
