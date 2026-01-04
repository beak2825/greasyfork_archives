// ==UserScript==
// @name         Rahina Kabinawa
// @namespace    Danielv123
// @version      3.1
// @description  Win micromatch in < 100 seconds!
// @author       You
// @match        https://quizlet.com/*/micro*
// @grant        none
// ==/UserScript==

// this script died when microscatter turned into micromatch, but it still works albeit badly.
// edit: Version 2.0 fixed everything and its now able to get sub 0.5 second times!
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
terms = Quizlet.matchModeData.terms;
wordDefinition = {};
definitionWord = {};
for(let i = 0; i < terms.length; i++){
    wordDefinition[terms[i].word] = terms[i].definition;
    definitionWord[terms[i].definition] = terms[i].word;
}
firstClick = true;
document.onclick = ()=>{
    firstClick = false;
    setTimeout(()=>{
        // Magic for loop instead
        // checks if the combination is right before clicking :)
        for(let i=0;i<document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes.length;i++) {
            console.log("i = "+i);
            // click it if its unclicked
            if(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[0].childNodes.length == 0 || document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[1].childNodes[0].className == "MatchModeQuestionGridTile is-selected"){
                console.log("Already clicked " + i);
            } else {
                let word = document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML.replace(/<!--([\s\S]*?)-->/mig, '');
                let translatedWord;
                if(wordDefinition[word]){
                    translatedWord = wordDefinition[word];
                } else if(definitionWord[word]){
                    translatedWord = definitionWord[word];
                }
                // console.log(translatedWord);
                // find another word in the same dataset ID and click that as well
                for(let o = 0; o < document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes.length; o++) {
                    // console.log("o = " + o );
                    if(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[o].innerHTML.includes(translatedWord)) {
                        let x = i;
                        setTimeout(()=>{
                            console.log("Found word pair: "+translatedWord+":"+word);
                            eventFire(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[o].childNodes[0], "pointerdown");
                            setTimeout(()=>{
                                eventFire(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[x].childNodes[0], "pointerdown");
                            },00);
                        },i*300);
                    }
                }
            }
        }
    },500);
};

// brute force, they now penalize faults so this is shit
/*
setInterval(function() {
    var dwfg = Math.floor(Math.random() * 16);
    // console.log(document.getElementById("cells").childNodes[dwfg].getAttribute("data-type"));
    if(document.getElementById("cells").childNodes[dwfg].className == "cell long touching correct" || document.getElementById("cells").childNodes[dwfg].className == "cell long touching touched"){
    } else {
        eventFire(document.querySelector("#cells").childNodes[dwfg], "click");
    }
}, 1);
*/
setInterval(function() {
    //eventFire(document.querySelector("body > div:nth-child(4) > div > div.UIModal.is-open > div > div > div.HighscoresMessage > div.UIDiv.HighscoresMessage-button > button"), "click");
}, 2000);