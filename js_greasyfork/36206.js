// ==UserScript==

// @name        Bing Rewarder
// @namespace   bing
// @description Search for 30 random words on bing to rack up reward points, just search bing once to start script
// @include     http://www.bing.com/search?*
// @include     https://www.bing.com/*
// @version     1.0
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/36206/Bing%20Rewarder.user.js
// @updateURL https://update.greasyfork.org/scripts/36206/Bing%20Rewarder.meta.js
// ==/UserScript==

//keep track of how many searches were done
var iter = getURLParameter("brNum");
if(iter == null){
    iter = 0;
}
iter = parseInt(iter)+1;

if (iter > 30){
    return false;
}

//timeout next load for something between 1 and 5 seconds (you can change the timeout value below)
//the only reason for the randomness is to hopefully disguise this as being a script
window.setTimeout(function() {

    //get a random length between 4 and 10 characters
    var wordLength = Math.floor((Math.random()*20)+4);

    //get a random word, using above random length
    var newQuery = createRandomWord(wordLength);

    //execute new query
    window.open("http://www.bing.com/search?q="+newQuery+"&brNum="+iter,"_self");

}, (Math.random()*2345)+546); //THESE ARE THE TIMEOUT VALUES (4000 is the random factor of 4 seconds, 1000 is the minimum time of 1 second)


//special thanks to http://james.padolsey.com/javascript/random-word-generator/ for random word generator script below
//it generates a word with alternating consonants and vowels
function createRandomWord(length) {
    var consonants = 'bcdfghjklmnpqrstvwxyz',
        vowels = 'aeiou',
        rand = function(limit) {
            return Math.floor(Math.random()*limit);
        },
        i, word='', length = parseInt(length,24),
        consonants = consonants.split(''),
        vowels = vowels.split('');
    for (i=0;i<length/2;i++) {
        var randConsonant = consonants[rand(consonants.length)],
            randVowel = vowels[rand(vowels.length)];
        word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
        word += i*2<length-1 ? randVowel : '';
    }
    return word;
}

//http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}