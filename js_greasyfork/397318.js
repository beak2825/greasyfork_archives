// ==UserScript==
// @name         Projdi ze siti !
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  My to dokazeme !!
// @author       You
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397318/Projdi%20ze%20siti%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/397318/Projdi%20ze%20siti%20%21.meta.js
// ==/UserScript==



(function() {



const showbar = document.createElement("p");
showbar.style.position = "fixed"
showbar.style.top = "70px";
showbar.style.right = "10px"
showbar.style.zIndex = "100000000"
showbar.style.color="black"
    showbar.style.background="white"



showbar.innerHTML= "ahoj"
    document.body.appendChild(showbar);



showbar.style.display="none";





let barshow = false;
document.body.onkeypress = function(event){
var x = event.key;



    console.log(x);
    if(x == "f"){
    barshow = !barshow;
    showbar.style.display = barshow ? "block" : "none";
    }}










    let showanswers = "";
    // @match        https://assessment.netacad.net/virtuoso/delivery/pub-doc/2.0/assessment/*
    fetch('https://projdi-ze-siti.glitch.me/').then(v => v.json()).then(answers => {
        console.log(answers)
    document.addEventListener('click', function(event) {
        const path = event.composedPath && event.composedPath();
const target = path && path.length > 0 ? path[0] : event.target; // Fallback

            console.log(target.innerText)
        const questions = answers.map(v => v.title);
        //showanswers = answers.filter(({title,ans}) => title === target.innerText).sort()[0]
        let qindex = findBestMatch(target.innerText,questions).bestMatchIndex
        showanswers = answers[qindex].ans;
        showbar.innerHTML = showanswers
        console.log(showanswers)
    },true)
})





function compareTwoStrings(first, second) {
    first = first.replace(/\s+/g, '')
    second = second.replace(/\s+/g, '')



    if (!first.length && !second.length) return 1;                   // if both are empty strings
    if (!first.length || !second.length) return 0;                   // if only one is empty string
    if (first === second) return 1;                                    // identical
    if (first.length === 1 && second.length === 1) return 0;         // both are 1-letter strings
    if (first.length < 2 || second.length < 2) return 0;             // if either is a 1-letter string



    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        const count = firstBigrams.has(bigram)
            ? firstBigrams.get(bigram) + 1
            : 1;



        firstBigrams.set(bigram, count);
    };



    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        const count = firstBigrams.has(bigram)
            ? firstBigrams.get(bigram)
            : 0;



        if (count > 0) {
            firstBigrams.set(bigram, count - 1);
            intersectionSize++;
        }
    }



    return (2.0 * intersectionSize) / (first.length + second.length - 2);
}



function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');



    const ratings = [];
    let bestMatchIndex = 0;



    for (let i = 0; i < targetStrings.length; i++) {
        const currentTargetString = targetStrings[i];
        const currentRating = compareTwoStrings(mainString, currentTargetString)
        ratings.push({target: currentTargetString, rating: currentRating})
        if (currentRating > ratings[bestMatchIndex].rating) {
            bestMatchIndex = i
        }
    }




    const bestMatch = ratings[bestMatchIndex]



    return { ratings, bestMatch, bestMatchIndex };
}



function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== 'string') return false;
    if (!Array.isArray(targetStrings)) return false;
    if (!targetStrings.length) return false;
    if (targetStrings.find(s => typeof s !== 'string')) return false;
    return true;
}

    // Your code here...
})();

