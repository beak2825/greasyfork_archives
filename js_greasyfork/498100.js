// ==UserScript==
// @name         WikiwiskwisKleuren
// @namespace    be.koelan
// @version      2024-06-10
// @description  Voegt extra kleuren toe aan gevonden woorden op wikiwiskwis
// @author       Boris Vereertbrugghen
// @match        https://www.wikiwiskwis.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikiwiskwis.be
// @license      GNU General Public License v3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498100/WikiwiskwisKleuren.user.js
// @updateURL https://update.greasyfork.org/scripts/498100/WikiwiskwisKleuren.meta.js
// ==/UserScript==

var TheColors = ['#CD6155','#AF7AC5','#5499C7','#48C9B0','#F7DC6F','#F8C471','#E59866',
                 '#F2D7D5','#EBDEF0','#D6EAF8','#D1F2EB','#FCF3CF','#FAE5D3'];
var TheColorI = 0;

(function() {
    console.log('init');
    var elements =  $('.title-row');
    console.log('init '+ elements.length);
    for(var i = 0; i < elements.length; i++){
        elements[i].onclick = function(event){audoChooseColors()};
    }

    setTimeout(function(){
        addColorClick()
    },500);
    $("#guessForm").on("click", "#doGuess", function(e) {
        waitScrollToHighLighted();
    });
    $("#guessForm").on("keypress", "#wordGuess", function(e) {
        if (e.which == 13) {
            waitScrollToHighLighted();
        }
    });
})();

function waitScrollToHighLighted(){
    setTimeout(function(){
        addColorClick();
        var words = $( ".highlighted" );
        if(words.length>0){
            words[0].scrollIntoView();
            window.scrollBy(0,-100);
        }
    }, 200);
}

function audoChooseColors(){
    addColorClick();
    var words = $( "span[data-word]" );
    for(var x = 0; x < words.length; x++){
        words[x].style.backgroundColor='';
    }
    TheColorI = 0;
    var elements = $("#guesswords .guess");
    var map = new Map();
    for(var i = 0; i < elements.length; i++){
        var guessWordElm = elements[i].childNodes[0];
        var text = guessWordElm.innerHTML;
        var count = Number(elements[i].childNodes[1].innerHTML);
        if(count>0){
            map.set(text,count);
        }
    }
    var sortedByValue = [...map.entries()].sort((a, b) => b[1]-a[1]);
    var y = 0;
    for (let [key, value] of sortedByValue) {
        for(var j = 0; j < elements.length; j++){
            if(key == elements[j].childNodes[0].innerHTML){
                doColorClick(elements[j]);
                y++;
                if(y>9){
                    return;
                }
            }
        }
    }

}

function addColorClick(){
    var elements = $("#guesswords .guess");
    console.log(elements.length);
    var elementsX = $("#guessColumn .guesses .title-row .wordCount")
    console.log('addColorClick '+ elementsX.length);
    elementsX[0].innerHTML = '# '+elements.length;
    for(var i = 0; i < elements.length && i<10; i++){
        elements[i].onclick = function(event){
            doColorClick(event.target.parentElement);
        };
    }

    var words = $( "span[data-word]" );
    for(var x = 0; x < words.length; x++){
        words[x].onclick = function(event){
            selectNextWord(event.target);
        };
    }
}

function selectNextWord(currentWord){
    var text = currentWord.getAttribute('data-word');
    console.log('selectNextWord '+ text);
    var words = $( "span[data-word='"+text+"']" );
    var found = false;
    var nextWord;
    for(var i = 0; i < words.length; i++){
        if(found){
            nextWord = words[i];
            break;
        }
        if(words[i]==currentWord){
            found = true;
        }
    }
    if(typeof nextWord === 'undefined'){
        nextWord = words[0];
    }

    if(typeof nextWord === 'undefined'){
        return;
    }
    nextWord.style.color = 'red';
    nextWord.scrollIntoView();
    window.scrollBy(0,-250);
    setTimeout(function(){
        nextWord.style.color = '';
    },1500);
}

function doColorClick(currentTarget){
    console.log(currentTarget);
    var guessWordElm = currentTarget.childNodes[0]
    var text = guessWordElm.innerHTML;
    var count = currentTarget.childNodes[1].innerHTML;
    if(count<1){
        return;
    }

    var color = TheColors[TheColorI];
    if(guessWordElm.style.hasOwnProperty('backgroundColor') && guessWordElm.style.backgroundColor !== ''){
        color = '';
    }else{
        TheColorI++;
        if(TheColorI >= TheColors.length){
            TheColorI = 0;
        }
    }

    console.log('doColorClick '+ text+" -> "+color);
    guessWordElm.style.backgroundColor = color;
    var words = $( "span[data-word='"+text+"']" );
    for(var i = 0; i < words.length; i++){
        words[i].style.backgroundColor=color;
    }
    if(words.length>0 && color !== ''){
        words[0].scrollIntoView();
        window.scrollBy(0,-250);
    }
}
