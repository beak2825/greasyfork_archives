// ==UserScript==
// @name         Emojiforces
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Add emojis to submission verdicts.
// @author       ExplodingKonjac
// @license      GPLv3
// @match        https://codeforces.com/*
// @match        https://codeforc.es/*
// @downloadURL https://update.greasyfork.org/scripts/460448/Emojiforces.user.js
// @updateURL https://update.greasyfork.org/scripts/460448/Emojiforces.meta.js
// ==/UserScript==

(function() {

    function newRotatingEmoji(text) {
        var x=document.createElement('span');
        x.className='rotating-emoji'
        x.innerHTML=text
        x.style.fontSize="200%"
        return x
    }
    function getDifficultyLevel(x) {
        if(x<1000) return '😴' // [800,1000)
        else if(x<1500) return '🙂' // [1000,1500)
        else if(x<2000) return '😐' // [1500,2000)
        else if(x<2400) return '😨' // [2000,2400)
        else if(x<2800) return '😱' // [2400,2800)
        else if(x<3100) return '😡' // [2800,3100)
        else if(x<3400) return '🥵' // [3100,3400)
        else return '💀' // [3400,+∞)
    }
    function getRatingLevel(x) {
        if(x<-50) return '💩' // (-∞,-50)
        else if(x<0) return '🐸' // [-50,0)
        else if(x<800) return '👶' // [0,800)
        else if(x<1400) return '🙂' // [800,1400)
        else if(x<1900) return '😃' // [1400,1900)
        else if(x<2400) return '🤔' // [1900,2400)
        else if(x<2600) return '🧐' // [2400,2600)
        else if(x<3000) return '😎' // [2600,3000)
        else if(x<3500) return '😇' // [3000,3500)
        else return '👽' // [3500,+∞)
    }
    function getContribLevel(x) {
        if(x<-100) return '🤡' // (-∞,-100)
        else if(x<-50) return '👎' // [-100,-50)
        else if(x<0) return '🤐' // [-50,0)
        else if(x<50) return '😯' // [0,50)
        else if(x<80) return '😉' // [30,80)
        else if(x<120) return '🤗' // [60,120)
        else if(x<160) return '👍' // [100,160)
        else return '🤩' // [150,+∞)
    }

    document.querySelectorAll('span[class="verdict-accepted"]').forEach(function(e) {
        e.innerHTML+=' 😘'
    })
    document.querySelectorAll('span[class="verdict-rejected"]').forEach(function(ee) {
        var e=ee.querySelector('span[class="verdict-format-judged"]')
        var n=Number(e.innerHTML)
        var emj=''
        if(n==1) emj+='🤡'
        if(n==2) emj+='🤔'
        while(n>30) {
            emj+='😅'; n-=30
        }
        if(emj!='') e.innerHTML+=' '+emj
    })
    document.querySelectorAll('span[submissionverdict="COMPILATION_ERROR"]').forEach(function(e) {
        var x=newRotatingEmoji('🤣')
        x.style.marginLeft='8pt'
        e.appendChild(x)
    })
    document.querySelectorAll('span[submissionverdict="CHALLENGED"]').forEach(function(e) {
        var x=newRotatingEmoji('🤬')
        x.style.marginLeft='8pt'
        e.appendChild(x)
    })
    document.querySelectorAll('span[class="cell-failed-system-test"]').forEach(function(e) {
        e.innerHTML='<img src="https://s2.loli.net/2023/02/22/6s85lbvafzWphEr.gif" height="80%" width="80%"></img>'
    })
    document.querySelectorAll('span[class="verdict-challenged"]').forEach(function(e) {
        e.innerHTML+=' 👏👏👏'
    })
    document.querySelectorAll('span[class="verdict-unsuccessful-challenge"]').forEach(function(e) {
        if(e.innerHTML=='Unsuccessful hacking attempt' || e.innerHTML=='Неудачная попытка взлома') {
            e.innerHTML+='👈🤣'
        }
        else if(e.innerHTML=='Invalid input' || e.innerHTML=='Некорректный тест') {
            e.innerHTML+=' 😨'
        }
        else if(e.innerHTML=='Generator crashed' || e.innerHTML=='Некорректный генератор') {
            e.innerHTML+=' 🤯'
        }
        else if(e.innerHTML=='Generator compilation error' || e.innerHTML=='Ошибка компиляции генератора') {
            e.parentNode.title=e.innerHTML
            e.innerHTML='<img src="https://s2.loli.net/2023/02/22/6s85lbvafzWphEr.gif" height="40" width="40"></img>'
            var x1=newRotatingEmoji('😅')
            x1.style.marginRight='8pt'
            e.parentNode.insertBefore(x1,e)
            var x2=newRotatingEmoji('😅')
            x2.style.marginLeft='8pt'
            e.parentNode.appendChild(x2)
        }
    })
    document.querySelectorAll('span[class="ProblemRating"],span[class="tag-box"]').forEach(function(e) {
        var res=''
        if(e.className=="tag-box") {
            var diff=/\*[0-9]+/.exec(e.innerHTML)
            if(diff==null) return
            res=diff[0].slice(1)
        }
        else res=e.innerHTML
        e.innerHTML+=getDifficultyLevel(Number(res))
    })
    document.querySelectorAll('div[class="userbox"],div[class="personal-sidebar"]').forEach(function(box) {
        box.querySelectorAll('span[class|="user"]').forEach(function(e) {
            var num=/[+-]?[0-9]+/.exec(e.innerHTML)
            if(num==null) return
            e.innerHTML+=getRatingLevel(Number(num[0]))
            e.parentNode.style="white-space: nowrap"
        })
    })
    document.querySelectorAll('div[class="userbox"],div[class="personal-sidebar"]').forEach(function(box) {
        box.querySelectorAll('span[style="color:green;font-weight:bold;"],span[style="color:gray;font-weight:bold;"]').forEach(function(e) {
            var num=/[+-]?[0-9]+/.exec(e.innerHTML)
            console.log(num)
            if(num==null) return
            e.innerHTML+=getContribLevel(Number(num[0]))
            e.parentNode.style="white-space: nowrap"
        })
    })
    var sty=document.createElement("style")
    sty.type="text/css"
    sty.innerHTML='@keyframes rotation {\n'+
                  '  50% {\n'+
                  '    transform: rotate(180deg) scale(2);\n'+
                  '  }\n'+
                  '  100% {\n'+
                  '    transform: rotate(360deg) scale(1);\n'+
                  '  }\n'+
                  '}\n'+
                  '.rotating-emoji {\n'+
                  '  display: inline-block;\n'+
                  '  animation: rotation 2s infinite linear;\n'+
                  '}\n'+
                  '.ProblemRating {\n'+
                  '  white-space: nowrap\n'+
                  '}\n'
    document.getElementsByTagName('head')[0].appendChild(sty)
})();