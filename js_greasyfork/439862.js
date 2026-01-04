// ==UserScript==
// @name        CAPTCHA filler - dreamwidth.org
// @namespace   Violentmonkey Scripts
// @match       *://*.dreamwidth.org/*.html?replyto=*
// @match       *://www.dreamwidth.org/talkpost_do
// @grant       none
// @version     1.0
// @author      Tombaugh Regio
// @description 2/10/2022, 6:40:57 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439862/CAPTCHA%20filler%20-%20dreamwidthorg.user.js
// @updateURL https://update.greasyfork.org/scripts/439862/CAPTCHA%20filler%20-%20dreamwidthorg.meta.js
// ==/UserScript==

function fillCaptcha() {
  function solveCaptcha(question) {
    function convertToNumerals(splitRegex, excludedArray) {
      const results = question
        .toLowerCase()
        .replace(/is$/, "")
        .split(splitRegex)
        .filter(section => section.length > 0 && section
                  .split(" ")
                  .findIndex(word => excludedArray.indexOf(word) > -1) === -1)
      .reduce((prev, number) => {
        const parseNumber = (number) => number.trim().split(" ").reduce((a, b) => a + numbersArray.filter(n => b === n.name)[0].digit, 0)
        
        const result = (/\d/.test(number)) ?
          //Number is already in numerals
          parseInt(number) 
        
          //Number is spelled out and over 100
          : (/hundred|thousand/.test(number)) ?
            ((!/thousand/.test(number)) ? 
              "zero thousand " + number 
              : (!/hundred/.test(number)) ? 
                number.split("thousand").join("thousand zero hundred") 
                : number)
              .replace(" and ", " ")
              .split(/hundred|thousand/)
              .reduce((a, b, i) => a + ((i === 2) ? parseNumber(b) : parseNumber(b) * Math.pow(10, 3 - i)) , 0) 
        
            //Number is spelled out and under 100
            : number.trim().length > 0 ? 
              parseNumber(number) 
              : 0
        
        if (result > 0) return [...prev, result]
      }, [])
      
      return results
    }
    
    const filterWords = (list) => question.toLowerCase().match(/\w+/g).filter(word => list.includes(word))
    
    const colorsArray = ["red", "yellow", "green", "blue", "purple", "black", "white", "pink", "brown"]
    const belowWaistArray = ["leg", "knee", "foot", "ankle"]
    const bodyPartsArray = [
      "head", "brain", "hair", "face", "eye", "nose", "ear", "chin", "tongue", "tooth", 
      "chest", "heart", "stomach", "arm", "elbow", "hand", "finger", "thumb", 
      ...belowWaistArray
    ]
    const weekendArray = ["Saturday", "Sunday"]
    const daysOfWeekArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", ...weekendArray]
    const numbersArray = [
      {digit: 0, name: "zero"},
      {digit: 1, name: "one"},
      {digit: 2, name: "two"},
      {digit: 3, name: "three"},
      {digit: 4, name: "four"},
      {digit: 5, name: "five"},
      {digit: 6, name: "six"},
      {digit: 7, name: "seven"},
      {digit: 8, name: "eight"},
      {digit: 9, name: "nine"},
      {digit: 10, name: "ten"},
      {digit: 11, name: "eleven"},
      {digit: 12, name: "twelve"},
      {digit: 13, name: "thirteen"},
      {digit: 14, name: "fourteen"},
      {digit: 15, name: "fifteen"},
      {digit: 16, name: "sixteen"},
      {digit: 17, name: "seventeen"},
      {digit: 18, name: "eighteen"},
      {digit: 19, name: "nineteen"},
      {digit: 20, name: "twenty"},
      {digit: 30, name: "thirty"},
      {digit: 40, name: "forty"},
      {digit: 50, name: "fifty"},
      {digit: 60, name: "sixty"},
      {digit: 70, name: "seventy"},
      {digit: 80, name: "eighty"},
      {digit: 90, name: "ninety"}
    ]
    const biggestArray = ["biggest", "highest", "largest"]
    const smallestArray = ["smallest", "lowest"]
    const biggestSmallestRegex = /[,:]| or |of the numbers|which of |(?<!which |these )is| number of /
    const mathRegex = /is|'s| = | equals|\+|-|add|minus|subtract|plus/
    const ordinalsRegex = /1st|2nd|3rd|\dth/
    
    //What's X's name?
    if (/name/.test(question)) return question.replace(/What|name/, "").match(/[A-Z][a-z]{3,}/)
    
    //What color is X?
    if (/colour of a |what colour/.test(question)) return colorsArray.filter(color => question.includes(color))
    
    //Which day of A, B, C is on the weekend?
    if (/weekendArray/.test(question)) return weekendArray.filter(day => question.includes(day))
    
    //Which body part of A, B, C, is below the waist?
    if (/waist/.test(question)) return filterWords(belowWaistArray)
    
    //What is X in digits?
    if (/as digits|as a number|in digits/.test(question)) return convertToNumerals(/ as digits| as a number|in digits|what is |enter the number /, [])
    
    //The biggest/smallest X of A, B, C is?
    if (!/colour|body/.test(question) 
       && question.split(" ").findIndex(word => [...biggestArray, ...smallestArray].indexOf(word) > -1) > -1
      ) {
      return convertToNumerals(biggestSmallestRegex, [...biggestArray, ...smallestArray])
        .sort((a,b) => question.split(" ").findIndex(word => biggestArray.indexOf(word) > -1) > -1 ? b - a : a - b)[0]
    }

    //How many X in the list A, B, C?
    if (/how many |number of/i.test(question)) {
      const list = []
      if (/colours/.test(question)) list.push(...colorsArray)
      if (/body parts/.test(question)) list.push(...bodyPartsArray)
      
      return filterWords(list).length
    }
    
    //What is X + Y or X - Y?
    if (/\+|add|plus|-|minus|subtract/.test(question)) {
      return convertToNumerals(mathRegex, ["what"]).reduce((a,b) => /\+|add|plus/.test(question) ? a + b : a - b)
    }
    
    //What is the Xth Y in the list A, B, C?
    if (ordinalsRegex.test(question)) {
      const ordinal = parseInt(question.match(ordinalsRegex)[0].match(/\d/)[0]) - 1
      
      if (/colour/.test(question)) return filterWords(colorsArray)[ordinal]
      if (/digit/.test(question)) return question.match(/\d{2,}/)[0][ordinal]
      if (/number/.test(question)) return convertToNumerals(/[,:]|and|list|from|series/, ["number"])[ordinal]
    }
    
    //If tomorrow/yesterday is X, what is today?
    if (/tomorrow|yesterday/i.test(question)) {
      const weekIndex = (daysOfWeekArray.findIndex(w => question.match(/\w+/g).includes(w)) + (/tomorrow/i.test(question) ? 6 : 1)) % 7
      return daysOfWeekArray[weekIndex]
    }
    
    return question
  }
  
  const captchaField = 'input[name="textcaptcha_response"]'
  
  //Fill in CAPTCHA field
  if (document.querySelector(captchaField)) {
    const question = document.querySelector('label[for="textcaptcha_response"]').textContent.trim().slice(0, -1)
    document.querySelector(captchaField).value = solveCaptcha(question)

  } else window.setTimeout(fillCaptcha, 100)
}

fillCaptcha()