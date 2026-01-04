// ==UserScript==
// @name         Old c.ai
// @namespace    https://github.com/ismael1222/Return-old-c.ai-look
// @version      0.3.4
// @description  Reskin the new site into good ol' looks with this script
// @author       u/MaxGremory
// @grant        GM_getResourceText
// @match        https://character.ai/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @resource     htmll https://return-old-c-ai-look.vercel.app/mainpage.html
// @resource     profpagehtml https://return-old-c-ai-look.vercel.app/profilepage.html

// @downloadURL https://update.greasyfork.org/scripts/511736/Old%20cai.user.js
// @updateURL https://update.greasyfork.org/scripts/511736/Old%20cai.meta.js
// ==/UserScript==
/*
var urlParams = new URLSearchParams(window.location.search)
console.log(urlParams.get("chats"))
*/
(function() {
    'use strict';
    var lastPage = ""
    function loadMainPage(){
        //funcion para crear nua tarjeta (solo main, se puede dejar aqui)
        function createCard(charName, imageURL, charURL , element){
            let card = `<a href="${charURL}"><div class="card"><img src="${imageURL}" alt="${charName}"><strong><p>${charName}</p></strong></div></a>`
    let container = document.querySelectorAll('.cardContainer')[element]
    container.insertAdjacentHTML('beforeend', card)

        }
        //funcion para pegar la main page
        function pastePage(){
            let x = GM_getResourceText("htmll");
            document.querySelector('body').insertAdjacentHTML('beforeend', x);
        }
        //cuando se sepa que la main page se cargo, se ejecuta esta
        function inicializacion(){

            // Get profile picture
            let origPic = document.querySelectorAll('.object-cover.object-top')[1]
            let pic = "#"
            origPic?pic = origPic.src.split("i/80/").join("i/200/"):false;
            document.querySelector("img.profilePic").src = pic
            //-------
            //Continue Chatting section
            document.querySelectorAll("a.gap-2.group").forEach(character =>{
                let name = character.querySelector("p.text-md").innerHTML
                let imageSelector = character.querySelector(".relative.mb-2 img")
                let imageURL = "#"
                imageSelector?imageURL = imageSelector.src.split("i/80/").join("i/200/"):false;
                let charURL = character.href
                createCard(name, imageURL, charURL, 0)
            })
            //--------------
            //Foryou section
            document.querySelectorAll("li.mb-6")[0].querySelectorAll("div.swiper-slide").forEach(character =>{
                let name = character.querySelector("div p").innerHTML
                let imageSelector = character.querySelector("div img")
                let imageURL = "#"
                imageSelector?imageURL = imageSelector.src:"#"
                let charURL = character.querySelector("a").href
                createCard(name, imageURL, charURL, 1)
            })
            //Featured section
            document.querySelectorAll("li.mb-6")[1].querySelectorAll("div.swiper-slide").forEach(character =>{
                let name = character.querySelector("div p").innerHTML
                let imageSelector = character.querySelector("div img")
                let imageURL = "#"
                imageSelector?imageURL = imageSelector.src:"#"
                let charURL = character.querySelector("a").href
                createCard(name, imageURL, charURL, 2)
            })
            //INICIALIZACION TERMINADA, CARDS PUESTAS:
            document.querySelector('div.mainDiv').classList.remove("hide")
            document.querySelector("div.loading").classList.add("hide")

        }
        //se pega la main page
        pastePage();
        //se empieza timer para ver cuando carga la main page original
        //y cuando carga, se inicializa
        function start(){
            let testSubject = document.querySelectorAll("li.mb-6")[2]?.querySelectorAll(".swiper-slide.pr-2")[0]
            if(testSubject !== undefined){
                clearInterval(testInterval)
                inicializacion()
            }else{
                console.log("Failed to find the third loaded column's first card")
            }
        }
        var testInterval = setInterval(start, 100)
        }
    function loadChatPage(){
        let chatnumber = " 💬"+document.querySelector(".flex.gap-3 > div > div.flex").innerHTML.split(" chats").join("")
        let nameObject = document.querySelector("p.font-semi-bold.line-clamp-1.text-ellipsis.break-anywhere.overflow-hidden.whitespace-normal")
        let charImageINCHAT = document.querySelector(".flex.gap-3 > a")
        nameObject.insertAdjacentHTML("beforeend", chatnumber)
        charImageINCHAT.insertAdjacentHTML("beforebegin", "<a href='/' class='arrow'>⮜</a>")
        var arrowInterval = setInterval(()=>{
            let arrw = document.querySelector('a.arrow')
            if(arrw = undefined){
                nameObject.insertAdjacentHTML("beforeend", chatnumber)
                charImageINCHAT.insertAdjacentHTML("beforebegin", "<a href='/' class='arrow'>⮜</a>")
            }

        },5000)

        }
    function loadProfilePage(){
        let x = GM_getResourceText("profpagehtml");
        document.querySelector('main main').insertAdjacentHTML('afterbegin', x);
        let origPic = document.querySelectorAll('.object-cover.object-top')[1]
        let pic = "#"
        origPic?pic = origPic.src.split("i/80/").join("i/200/"):false;
        document.querySelector("img.profilePic").src = pic

    }
    function loadMainPageChat(){
        //funcion para crear nua tarjeta (solo main, se puede dejar aqui)
        function createCard(charName, imageURL, charURL , doBreak, iterationNumber){
            let rowText=`<div class="cardContainer cc n${iterationNumber}"></div>`
            if(doBreak == true){
                let main = document.querySelector('div.footer')
                main.insertAdjacentHTML("beforebegin",rowText)
            }
            let card = `<a href="${charURL}"><div class="card"><img src="${imageURL}" alt="${charName}"><strong><p>${charName}</p></strong></div></a>`
            let container = document.querySelector(`.n`+iterationNumber)
            container.insertAdjacentHTML('beforeend', card)
        }
        //funcion para pegar la main page
        function pastePage(){
            let x = GM_getResourceText("htmll");
            document.querySelector('body').insertAdjacentHTML('beforeend', x);
        }
        //cuando se sepa que la main page se cargo, se ejecuta esta
        function inicializacion(){
            // Get profile picture
            let origPic = document.querySelectorAll('.object-cover.object-top')[1]
            let pic = "#"
            origPic?pic = origPic.src.split("i/80/").join("i/200/"):false;
            document.querySelector("img.profilePic").src = pic
            //-------
            //Continue Chatting section
            var cards = -1
            var iterations = 0
            document.querySelectorAll("a.gap-2.group").forEach(character =>{
                let name = character.querySelector("p.text-md").innerHTML
                let imageSelector = character.querySelector(".relative.mb-2 img")
                let imageURL = "#"
                imageSelector?imageURL = imageSelector.src.split("i/80/").join("i/200/"):false;
                let charURL = character.href
                //CHECH IUF ITERATIONS IS 5, IF NOT, CONMTINUE, ELSE, br
                if(cards == 5){
                    iterations++
                    createCard(name, imageURL, charURL, true, iterations);
                    //charName, imageURL, charURL, doBreak, iterationNumber
                    cards = 0
                }else{
                    createCard(name, imageURL, charURL, false, iterations)
                    cards++
                }
            })
            //hide two unused rows
            document.querySelectorAll('.plus').forEach(item =>{
                item.classList.add('hide')

            })
            document.querySelector('.cc').classList.add('dropdown')
            //INICIALIZACION TERMINADA, CARDS PUESTAS:
            document.querySelector('div.mainDiv').classList.remove("hide")
            document.querySelector("div.loading").classList.add("hide")

        }
        //se pega la main page
        pastePage();
        //se empieza timer para ver cuando carga la main page original
        //y cuando carga, se inicializa
        function start(){
            let testSubject = document.querySelectorAll("li.mb-6")[2]?.querySelectorAll(".swiper-slide.pr-2")[0]
            if(testSubject !== undefined){
                clearInterval(testInterval)
                inicializacion()
            }else{
                console.log("Failed to find the third loaded column's first card")
            }
        }
        var testInterval = setInterval(start, 100)
        }
    setInterval(()=>{
        if(lastPage !== window.location.href){
            //var urlParams = new URLSearchParams(window.location.search)
            //console.log(urlParams.get("chats"))
            if(/https\:\/\/character\.ai\/chat\/.+/gi.test(window.location.href)){
                console.log("GOTTA LOAD CHATS")
                loadChatPage();
                let arrowInterval = setInterval(()=>{
                    let arrw = document.querySelector('a.arrow')
                    if(arrw == undefined){
                        loadChatPage()
                    }
                },5000)
                }else if(/https\:\/\/character\.ai\/$/gi.test(window.location.href)){
                    console.log("GOTTA LOAD MAIN")
                    loadMainPage()
                }else if(/https\:\/\/character\.ai\/(\?.*)?$/gi.test(window.location.href)){
                    console.log("GOTTA LOAD MAIN CHAT")
                    loadMainPageChat()
                }else if(/https\:\/\/character\.ai\/profile\/.+$/gi.test(window.location.href)){
                    console.log("GOTTA LOAD PROFILE")
                    loadProfilePage()
                }else{
                    console.error("PAGE NOT RECOGNIZED. PLEASE REPORT THIS ISSUE ALONG WITH THE URL PROVIDED ON THIS MESSAGE.\n"+window.location.href)
                }
            //
            lastPage = window.location.href
        }
    }, 1000)

})();
