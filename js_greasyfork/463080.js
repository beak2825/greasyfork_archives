// ==UserScript==
// @name         Skillsetter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows you to quickly change your skills
// @author       Daria
// @license      MIT
// @match        https://hordes.io/play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hordes.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463080/Skillsetter.user.js
// @updateURL https://update.greasyfork.org/scripts/463080/Skillsetter.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';

let interval = setInterval(function(){
        if(document.getElementsByClassName("flexer svelte-e2mar4").length > 0 && document.getElementsByClassName("flexer svelte-e2mar4")[0].id == ""){
                let skills = document.getElementsByClassName("panel-bright skillbox svelte-e2mar4")
let flexer = document.getElementsByClassName("flexer svelte-e2mar4")[0]
flexer.id = "taken"
console.log(document.querySelector("#skilllist").childNodes.length)
if(document.querySelector("#skilllist").childNodes.length % 2 == 0){
   document.querySelector("#skilllist").append(document.createElement("div"))
}
document.querySelector("#skilllist").append(document.createElement("div"))
let char = localStorage.getItem("lastConnectedChar")
let skillsets = []
if(localStorage.getItem("skillsets") != null){
        if(JSON.parse(localStorage.getItem("skillsets"))[char] != null){
                skillsets = JSON.parse(localStorage.getItem("skillsets"))[char]
        }
} else {
        localStorage.setItem("skillsets", JSON.stringify({}))
}
for(let i = 0; i < skillsets.length; i++){
        createButton2(i)
}
let apply = document.getElementById("tutapplyskills")
flexer.addEventListener('click', (e) => {
        if(e.target.id.substring(1) == "skillset"){
                let index = parseInt(e.target.id.substring(0, 1))
                let btn = e.target
            if(e.shiftKey){
                skillsets.splice(index, 1)
                let charsets = JSON.parse(localStorage.getItem("skillsets"))
                charsets[char] = skillsets
                localStorage.setItem("skillsets", JSON.stringify(charsets))
                btn.remove()
            } else {
                for(let i = 0; i < skills.length; i++){
                    let clicks = skills[i].getElementsByClassName("btn incbtn white svelte-e2mar4").length + skills[i].childNodes[1].getElementsByClassName("btn incbtn green svelte-e2mar4").length
                    for(let j = 0; j < clicks; j++){
                        skills[i].getElementsByClassName("btn incbtn grey svelte-e2mar4")[skills[i].getElementsByClassName("btn incbtn grey svelte-e2mar4").length - 1].click()
                    }
                }
                let timeout = setTimeout(function(){
                    for(let i = 0; i < skills.length; i++){

                            for(let j = 0; j < skillsets[index][i + 1]; j++){
                                let plus = skills[i].getElementsByClassName("btn incbtn green svelte-e2mar4")
                                        if (plus.length > 0){
                                                plus[skills[i].getElementsByClassName("btn incbtn green svelte-e2mar4").length - 1].click()
                                            }
                                }
                    }
                    apply.click()
                }, 100)

            }
        }
})
apply.addEventListener('click', (e) => {
    if(e.shiftKey){
        createButton()
        skillsets = JSON.parse(localStorage.getItem("skillsets"))[char]
    }
})


        }
}, 10)

function createButton(){
    let char = localStorage.getItem("lastConnectedChar")
        let skillsets = []
if(localStorage.getItem("skillsets") != null){
        if(JSON.parse(localStorage.getItem("skillsets"))[char] != null){
                skillsets = JSON.parse(localStorage.getItem("skillsets"))[char]
        }
} else {
        localStorage.setItem("skillsets", JSON.stringify({}))
}
        let elem = document.createElement("div")
        elem.className = "l-upperLeftModal container uiscaled svelte-voya4q"
        let elem2 = document.createElement("div")
        elem2.className = "window panel-black svelte-yjs4p5"
        elem.append(elem2)
        let input = document.createElement("input")
        input.placeholder = "Choose name"
        let btn = document.createElement("div")
        btn.className = "btn purp"
        btn.textContent = "Create"
        elem2.append(input, btn)
        document.getElementsByClassName("container svelte-1j9lddf")[0].append(elem)
        btn.addEventListener('click', function(){
                elem2.remove()
                let skillset = []
                let name = input.value
                skillset.push(name)
                document.getElementsByClassName("container svelte-1j9lddf")[0].append(elem)
            let skills = document.getElementsByClassName("panel-bright skillbox svelte-e2mar4")
                for(let i = 0; i < skills.length; i++){
                    skillset.push(skills[i].getElementsByClassName("btn incbtn white svelte-e2mar4").length)
                }
                btn = document.createElement("div")
                btn.className = "btn navbtn grey"
                btn.textContent = name
                btn.id = skillsets.length + "skillset"
                skillsets.push(skillset)
                let charsets = JSON.parse(localStorage.getItem("skillsets"))
                charsets[char] = skillsets
                localStorage.setItem("skillsets", JSON.stringify(charsets))
            console.log()
                document.getElementById("skilllist").insertBefore(btn, document.getElementById("skilllist").lastChild)
        })

}
function createButton2(n){
    let char = localStorage.getItem("lastConnectedChar")
        let skillsets = []
if(localStorage.getItem("skillsets") != null){
        if(JSON.parse(localStorage.getItem("skillsets"))[char] != null){
                skillsets = JSON.parse(localStorage.getItem("skillsets"))[char]
        }
} else {
        localStorage.setItem("skillsets", JSON.stringify({}))
}
        let btn = document.createElement("div")
        btn.className = "btn navbtn grey"
        btn.textContent = skillsets[n][0]
        btn.id = n + "skillset"
        document.getElementsByClassName("scrollbar skilllist svelte-e2mar4")[0].insertBefore(btn, document.getElementsByClassName("scrollbar skilllist svelte-e2mar4")[0].lastChild)
}
});