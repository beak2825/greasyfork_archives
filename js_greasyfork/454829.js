// ==UserScript==
// @name         Kahoot Autoplay
// @version      1.8
// @description  Kahoot autoplay for streamers
// @author       Doggo_Live
// @match        https://play.kahoot.it/v2*
// @run-at       document-start
// @grant      none
// @icon https://img.icons8.com/plasticine/2x/kahoot.png
// @namespace https://greasyfork.org/users/775420
// @downloadURL https://update.greasyfork.org/scripts/454829/Kahoot%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/454829/Kahoot%20Autoplay.meta.js
// ==/UserScript==
window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalScripts.push(()=>{
    console.log("[KAHOOT AUTOPLAY] running")
 
    window.toInsert = document.createElement("div");
    window.toInsert.innerHTML = "Kahoot AUTOPLAY";
    window.toInsert.style.color = 'white'
    window.toInsert.style.position = "absolute";
    window.toInsert.style.bottom = "0px";
    window.toInsert.style.textAlign = "left";
    window.toInsert.style.width = "100%";
    document.body.appendChild(window.toInsert);
 
    icount=true
    setInterval(function() {
        if(icount==true){
            if(document.getElementsByClassName('lLtlL')[0]){
                if(document.getElementsByClassName('lLtlL')[0].disabled){}else{
                    icount = false
                    counts=3
                    countdown = setInterval(function(){
                        counts--
                        document.getElementsByClassName('lLtlL')[0].innerText = "Start-"+counts
                        if(counts==0 || counts < 0){
                            if(counts < -5){
                                clearTimeout(countdown);
                                icount=true
                                document.getElementsByClassName('lLtlL')[0].innerText = "Start"
                            }else{
                                clearTimeout(countdown);
                                icount=true
                                document.getElementsByClassName('lLtlL')[0].innerText = "Start"
                                document.getElementsByClassName('lLtlL')[0].click();
                            }
                        }
                    }, 1000);
                }
            }
        }
    },1000)
    setInterval(function() {
        if(document.getElementsByClassName('sc-jcVebW ldurDv enter-button__Button-sc-3mpvij-0 cnNgKW')[0]){
            document.getElementsByClassName('sc-jcVebW ldurDv enter-button__Button-sc-3mpvij-0 cnNgKW')[0].click();
        }
        if(document.getElementsByClassName('ilFhDI')[0]){
            if(document.getElementsByClassName('ilFhDI')[0].innerText=="Play next" || document.getElementsByClassName('ilFhDI')[0].innerText=="Play again"){
                document.getElementsByClassName('ilFhDI')[0].click();
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
            if(document.getElementsByClassName('sc-jQbIHB eRsdmN')[0]){
                if(document.getElementsByClassName('sc-jQbIHB eRsdmN')[0].innerHTML=='Next'){
                    console.log("Found next")
                    setTimeout(() => {
                            waitfornext();
                        }, 10);
                    clearInterval(nexte)
                    setTimeout(() => {
                        document.getElementsByClassName('sc-jQbIHB eRsdmN')[0].innerHTML='Next - 3'
                    }, 1000);
                    setTimeout(() => {
                        document.getElementsByClassName('sc-jQbIHB eRsdmN')[0].innerHTML='Next - 2'
                    }, 2000);
                    setTimeout(() => {
                        document.getElementsByClassName('sc-jQbIHB eRsdmN')[0].innerHTML='Next - 1'
                    }, 3000);
                    setTimeout(() => {
                        document.getElementsByClassName('sc-jQbIHB eRsdmN')[0].innerHTML='Please wait'
                        document.getElementsByClassName('sc-jQbIHB eRsdmN')[0].click();
 
                    }, 4000);
                }
            }
        }, 50);
            },4000)
 
    }
    waitfornext();
 
    ae = setInterval(() => {
        if(document.getElementsByClassName('jHPrOq')[0]){
            clearInterval(ae)
            countsr=6
            countdown = setInterval(function(){
                countsr--
                document.getElementsByClassName('jHPrOq')[0].innerText = "Next- "+countsr
                if(countsr==0 || countsr < 0){
                    clearInterval(countdown);
                    document.getElementsByClassName('jHPrOq')[0].click();
                }
            }, 1000);
        }
    }, 3000);
});
 
if(!window.antibotAdditionalScripts){
    alert("Make sure to use Kantibot with this script")
}
 
 

