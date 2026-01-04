// ==UserScript==
// @name         MEMRISE / add a link in the navigation bar
// @name:fr      MEMRISE / ajoutez un lien dans la barre de navigation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click on the memrise's logo in the navigation bar to add a new link
// @description:fr  Cliquez sur le logo de memrise pour ajouter a nouveau lien
// @author       nadroy
// @include      /https:\/\/www\.memrise\.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38964/MEMRISE%20%20add%20a%20link%20in%20the%20navigation%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/38964/MEMRISE%20%20add%20a%20link%20in%20the%20navigation%20bar.meta.js
// ==/UserScript==
(function(){
    var ls = window.localStorage
    var btnColored = document.getElementsByClassName("header-nav-item colored premium")[0]
    if(ls.getItem("TheNewLinks") != null && ls.getItem("TheNewLinks") != "" && ls.getItem("TheNewLinks").includes(":")){
        btnColored.insertAdjacentHTML("beforebegin" , ls.getItem("TheNewLinks"))
    }
    var memriseLogo = document.getElementsByClassName("header-logo-desktop")[0]
    document.getElementsByClassName("header-logo")[0].removeAttribute("href")
    function addElementNav(){
        var newLinkValue = prompt("The new link : ")
        var newTextLinkValue = prompt("Text to display : ")
        var theLink = `<li class="header-nav-item plain"><a href="` + newLinkValue + `" class="nav-item-btn">
                        <span class="nav-item-btn-text plain">` + newTextLinkValue + `</span>
                    </a></li>`
        if(newTextLinkValue != ""){
            if(newLinkValue.includes("http://") != false || newLinkValue.includes("https://") != false){
                if(ls.getItem("TheNewLinks") != null && ls.getItem("TheNewLinks") != ""){
                    ls.setItem("TheNewLinks" , ls.getItem("TheNewLinks") + theLink)
                    btnColored.insertAdjacentHTML('beforebegin' , theLink)
                }else{
                    ls.setItem("TheNewLinks" , theLink)
                    btnColored.insertAdjacentHTML('beforebegin' , theLink)
                }

            }else{
                return false
            }
        }else{
            return false
        }
        return false
    }
    memriseLogo.onclick = function(){
        addElementNav()
    }
})()