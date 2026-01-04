// ==UserScript==
// @name        Word Grid Bot
// @namespace   https://github.com/tianshuo/wordgridbot
// @version     0.0.3
// @author      tianshuo
// @description Find answers for Word Grid Game
// @supportURL  https://github.com/tianshuo/wordgridbot/issues
// @match       *://metzger.media/games/word-grid/*
// @license     MIT
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/441491/Word%20Grid%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/441491/Word%20Grid%20Bot.meta.js
// ==/UserScript==


(function() {
const W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

var letterPoints={
    "A": 1,
    "B": 3,
    "C": 3,
    "D": 2,
    "E": 1,
    "F": 4,
    "G": 3,
    "H": 3,
    "I": 1,
    "J": 8,
    "K": 5,
    "L": 2,
    "M": 3,
    "N": 2,
    "O": 1,
    "P": 4,
    "Q": 10,
    "R": 1,
    "S": 1,
    "T": 1,
    "U": 2,
    "V": 5,
    "W": 4,
    "X": 8,
    "Y": 4,
    "Z": 10
};

 function wordPointsCalc(guess ){
     let total = 0;
     let usedLetters = {};
     let GUESS=guess.toUpperCase();
     GUESS.split('').forEach(function(val){
         if(usedLetters[val]){
             total += (letterPoints[val] * usedLetters[val]);
             usedLetters[val]+=1
         }else{
             total += letterPoints[val];
             usedLetters[val]=1
         }
     })
     if(Object.keys(usedLetters).length == 9){
         total += 100;
     }
     return total;
 }

let dict=W.dictionaryImport.map(x=>{return {w:x,s:wordPointsCalc(x)};}); //w: word, s: score
let sorteddict=dict.sort((x,y)=>x.s-y.s);
// Highest score is 'EXPRESSIONLESSNESSES', which comes from `app.letterBoard='eilnoprsx'.toUpperCase().split(“");`


let dicthash=sorteddict.reduce((acc,i)=>{
    var k=[...new Set(i.w.split(""))].sort().join("")
    acc[k]=i;
    return acc;
},{})

function getSubArrays(arr){
  var len = arr.length,
     subs = Array(Math.pow(2,len)).fill();
  return subs.map((_,i) => { var j = -1,
                                 k = i,
                               res = [];
                             while (++j < len ) {
                               k & 1 && res.push(arr[j]);
                               k = k >> 1;
                             }
                             return res;
                           }).slice(1);
}

function findBest(val){
   var chars=val.split("").sort();
   var subchars=getSubArrays(chars);
   return subchars.reduce((acc,iter)=>{
      if(dicthash[iter.join("")]){
         acc.push(dicthash[iter.join("")]);
      }
      return acc
   },[]).sort((x,y)=>y.s-x.s);
}


setInterval(function(){
    if(!W.app.guess){
        W.app.guess=findBest(W.app.letterBoard.join("").toLowerCase())[0].w.toUpperCase();
    }
 },1000)
})();

