// ==UserScript==
// @name         Autokahoot
// @version      1.5.2
// @description  Automatically move through kahoots - with more power and ease
// @author       codingMASTER398
// @match        https://play.kahoot.it/v2*
// @run-at       document-start
// @grant      none
// @icon https://img.icons8.com/plasticine/2x/kahoot.png
// @namespace https://greasyfork.org/users/682906
// @downloadURL https://update.greasyfork.org/scripts/421685/Autokahoot.user.js
// @updateURL https://update.greasyfork.org/scripts/421685/Autokahoot.meta.js
// ==/UserScript==
window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalScripts.push(()=>{
    console.log("[AUTOKAHOOT] running")

    window.toInsert = document.createElement("div");
    window.toInsert.innerHTML = "codingMASTER398 - Autokahoot"; //PLEASE DONT CHANGE, THIS IS MY ONLY FORM OF CREDIT ):
    window.toInsert.style.color = 'white'
    window.toInsert.style.position = "absolute";
    window.toInsert.style.bottom = "0px";
    window.toInsert.style.textAlign = "left";
    window.toInsert.style.width = "100%";
    document.body.appendChild(window.toInsert);

    icount=true
    setInterval(function() {
        if(icount==true){
            if(document.getElementsByClassName('flat-button__FlatButton-sc-6uljam-0')[0]){
                if(document.getElementsByClassName('flat-button__FlatButton-sc-6uljam-0')[0].disabled){}else{
                    icount = false
                    counts=16
                    countdown = setInterval(function(){
                        counts--
                        document.getElementsByClassName('flat-button__FlatButton-sc-6uljam-0')[0].innerText = "Start-"+counts
                        if(counts==0 || counts < 0){
                            if(counts < -5){
                                clearTimeout(countdown);
                                icount=true
                                document.getElementsByClassName('flat-button__FlatButton-sc-6uljam-0')[0].innerText = "Start"
                            }else{
                                clearTimeout(countdown);
                                icount=true
                                document.getElementsByClassName('flat-button__FlatButton-sc-6uljam-0')[0].innerText = "Start"
                                document.getElementsByClassName('flat-button__FlatButton-sc-6uljam-0')[0].click();
                            }
                        }
                    }, 1000);
                }
            }
        }
    },1000)
    setInterval(function() {
        if(document.getElementsByClassName('iJqmEC')[0]){
            document.getElementsByClassName('iJqmEC')[0].click();
        }
        if(document.getElementsByClassName('kFPtaw')[0]){
            if(document.getElementsByClassName('kFPtaw')[0].innerText=="Play next" || document.getElementsByClassName('kFPtaw')[0].innerText=="Play again"){
                document.getElementsByClassName('kFPtaw')[0].click();
            }
        }
    },10000)

    function waitforendportal() {
        a = setInterval(() => {
            if(document.getElementsByClassName('cRHjov')[0]){
                clearInterval(a)
                setTimeout(() => {
                    console.log("Clicking")
                    document.getElementsByClassName('cRHjov')[0].click();
                    setTimeout(() => {
                        document.getElementsByClassName('ghnSPz')[0].click();
                    }, 1000);
                    waitforendportal();
                }, 30000);
            }
        }, 3000);
    }
    waitforendportal();
    
    function waitfornext() {
        console.log("Waiting for next")
        setTimeout(
            function(){
                nexte = setInterval(() => {
            if(document.getElementsByClassName('kFPtaw')[0]){
                if(document.getElementsByClassName('kFPtaw')[0].innerHTML=='Next'){
                    console.log("Found next")
                    setTimeout(() => {
                            waitfornext();
                        }, 10);
                    clearInterval(nexte)
                    setTimeout(() => {
                        document.getElementsByClassName('kFPtaw')[0].innerHTML='Next - 3'
                    }, 1000);
                    setTimeout(() => {
                        document.getElementsByClassName('kFPtaw')[0].innerHTML='Next - 2'
                    }, 2000);
                    setTimeout(() => {
                        document.getElementsByClassName('kFPtaw')[0].innerHTML='Next - 1'
                    }, 3000);
                    setTimeout(() => {
                        document.getElementsByClassName('kFPtaw')[0].innerHTML='Please wait'
                        document.getElementsByClassName('kFPtaw')[0].click();

                    }, 4000);
                }
            }
        }, 50);
            },4000)
        
    }
    waitfornext();
    
    ae = setInterval(() => {
        if(document.getElementsByClassName('guhfFk')[0]){
            clearInterval(ae)
            countsr=31
            countdown = setInterval(function(){
                countsr--
                document.getElementsByClassName('guhfFk')[0].innerText = "Classic - "+countsr
                if(countsr==0 || countsr < 0){
                    clearInterval(countdown);
                    document.getElementsByClassName('guhfFk')[0].click();
                }
            }, 1000);
        }
    }, 3000);
});

if(!window.antibotAdditionalScripts){
    alert("Make sure you have theusaf's antibot on! Autokahoot wont work without it!")
}