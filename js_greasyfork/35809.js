// ==UserScript==
// @namespace         16v6NmX9VEaMfBc9dhACej9xp3AMAYkoSL

// @name              Bitcoin balance checker
// @description       Check the balance of a bitcoin address by selecting it.

// @homepageURL       
// @supportURL        

// @author            DemonDog
// @version           1.0
// @license           LGPLv3


// @match             *://*/*
// @grant             none
// @run-at            document-ready
// @downloadURL https://update.greasyfork.org/scripts/35809/Bitcoin%20balance%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/35809/Bitcoin%20balance%20checker.meta.js
// ==/UserScript==


function displayBalance(){
    
    //get address from selection
    address = window.getSelection().toString()

    //check if it's a valid bitcoin address
    if (address.match("^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$") > 0){
        
        //get the wallet balance from blockchain.info
        fetch("https://blockchain.info/q/addressbalance/" + address)
            .then(function(response){
                //read balance in satoshi
                return response.text() ;
                
            })
            .then(function(bal){
                //show the address and its balance
                alert("Address: " + address + "\nBalance: " + ( bal / 100000000.0 ) );
                
            });
    }
}


//trigger on keypress
document.onkeyup = function(e){

    //hit ctrl + shift + alt + B to activate
    if (e.key.toUpperCase() === "B" && e.ctrlKey && e.altKey && e.shiftKey)
        displayBalance(e);

    return false;

};
