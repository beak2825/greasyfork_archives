// ==UserScript==
// @name         Egg finder
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Search for eggs
// @author       Jox [1714547]
// @match        *://*.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381453/Egg%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/381453/Egg%20finder.meta.js
// ==/UserScript==


alert('PLEASE REMOVE THIS SCRIPT\nChed told that he added penalty for those who use scripts');


/*
(function() {

    GM_addStyle(`
@keyframes pulse {
    0% {
        opacity: 1;
        box-shadow: 0 0 0 0 #00d550;
        bottom:26px;
        right:7px;
        height:30px;
        width:30px;
        opacity: .4
    }

    50% {
        bottom:26px;
        right:7px;
        height:30px;
        width:30px;
        opacity: 1
    }

    100% {
        opacity: .5;
        box-shadow: 0 0 0 1000px transparent;
        bottom:26px;
        right:7px;
        height:30px;
        width:30px;
        opacity: .1
    }
}

@keyframes pulse2 {
    0% {
        opacity: 1;
        box-shadow: 0 0 0 0 #ff0755;
        bottom:26px;
        right:7px;
        height:30px;
        width:30px;
        opacity: .4
    }

    50% {
        bottom:26px;
        right:7px;
        height:30px;
        width:30px;
        opacity: 1
    }

    100% {
        opacity: .5;
        box-shadow: 0 0 0 30px transparent;
        bottom:26px;
        right:7px;
        height:30px;
        width:30px;
        opacity: .1
    }
}

.pulsereal::after {
    background-image: radial-gradient(rgba(0, 0, 0, 0), #66FF3A);
    border-radius: 100%;
    content: "";
    display: flex;
    position: relative;
    bottom:26px;
    right:7px;
    height:30px;
    width:30px;
    animation: pulse 3s ease-out;
    animation-iteration-count: infinite;
    z-index: -100
    }

.pulsefake::after {
    background-image: radial-gradient(rgba(0, 0, 0, 0), #FF3E3A);
    border-radius: 100%;
    content: "";
    display: flex;
    position: relative;
    bottom:26px;
    right:7px;
    height:30px;
    width:30px;
    animation: pulse2 1.5s ease-out;
    animation-iteration-count: infinite;
    z-index: -100
    }
`
               );

    //Check every half second for eggs
    setInterval(searchForEggs, 500);


    function searchForEggs() {
        //This is how i find eggs
        var eggs = document.querySelectorAll('img[src*="competition.php"]');

        //Temp avriabels for norifications
        var foundNewEggs = false;
        var newEggPosition = '';

        var viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        //go over all eggs
        for(var egg of eggs){

            //check is already makerd as found
            if(!egg.dataset.found && egg.complete){

                var fakeEgg = false;

                if(egg && !(egg.style.display == 'none' || egg.style.visibility == 'hidden')){

                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = egg.naturalWidth || 19;
                    canvas.height = egg.naturalHeight || 19;
                    ctx.drawImage(egg, 0, 0);

                    if(ctx.getImageData(0, 0, canvas.width, canvas.height).data.find(x => x !== 0)){
                        //If I am here it's real egg
                        fakeEgg = false;
                    }
                    else {
                        //If I am here it's FAKE egg
                        fakeEgg = true;
                    }
                }

                //Mark it as found and create border around it so it's easier to find
                if(fakeEgg){
                    //egg.style.border = "5px solid #FF0000";
                    egg.parentElement.classList.add('pulsefake');
                }
                else{
                   //egg.style.border = "5px solid #00FF00";
                   egg.parentElement.classList.add('pulsereal');
                }
                egg.dataset.found = true;

                //find egg position on screen
                var eggPosition = egg.getBoundingClientRect();
                var percentTop = eggPosition.top / viewPortHeight * 100;
                var percentLeft = eggPosition.left / viewPortWidth * 100;
                var verticalPosition = (percentTop > 25 ? (percentTop > 75 ? 'BOTTOM' : 'MIDDLE') : 'TOP');
                var horisontalPosition = (percentLeft > 25 ? (percentLeft > 75 ? 'RIGHT' : 'CENTER') : 'LEFT');

                newEggPosition += '\nLook at ' + verticalPosition + ' ' + horisontalPosition + (fakeEgg ? ' FAKE EGG' : '');

                //check for eggs that are not shown to prevent false alarm
                if(egg.style.display == 'none' || egg.style.visibility == 'hidden'){
                    console.log(`Found egg, but it's hidden`, newEggPosition);
                }
                else{
                    //If there are shown setting variale for later notifivcation
                    foundNewEggs = true;
                }
            }
        }

        //If there are eggs send notification
        if(foundNewEggs){
            alert('Found egg on page!' + newEggPosition);
            console.log('Found egg on page!' + newEggPosition + '\nDo NOT click on invisible eggs');
        }
    }
})();

*/