// ==UserScript==
// @name        AO3 Exchange Request Cut
// @description Automatically collapses exchange request details
// @include     https://archiveofourown.org/collections/*/requests*
// @namespace   https://greasyfork.org/en/scripts/414224-ao3-exchange-request-cut
// @version     0.1
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/414224/AO3%20Exchange%20Request%20Cut.user.js
// @updateURL https://update.greasyfork.org/scripts/414224/AO3%20Exchange%20Request%20Cut.meta.js
// ==/UserScript==


const requests = document.querySelectorAll("li.blurb.group")
const topBtnList = document.querySelector("ol.pagination.actions")
let hidden = true

const detailBtn = () => {
    const aBtn = document.createElement("button")
    aBtn.textContent = "Show Details"
    aBtn.className = "hide-exchange-button one"
    aBtn.style.margin = "5px"
    aBtn.addEventListener("click", function(){
        const summary = this.parentNode.querySelector("blockquote.userstuff.summary")
        if(summary.style.display === "none"){
            summary.style.display = "block"
            this.textContent = "Hide Details"
        }else{
            summary.style.display = "none"
            this.textContent = "Show Details"
        }
    })
    return aBtn
}

const showAll = () => {
    const aBtn = document.createElement("button")
    aBtn.textContent = "Show All"
    aBtn.className = "hide-exchange-button all"
    aBtn.style.margin = "5px"
    aBtn.addEventListener("click", function(){
        const summaries = document.querySelectorAll("blockquote.userstuff.summary")
        const buttons = document.querySelectorAll("button.hide-exchange-button.one")
        if(hidden){
            for(let i = 0; i < summaries.length; i++){
                summaries[i].style.display = "block"
                buttons[i].textContent = "Hide Details"
                this.textContent = "Hide All"
            }
            hidden = false
        }else{
            for(let i = 0; i < summaries.length; i++){
                summaries[i].style.display = "none"
                buttons[i].textContent = "Show Details"
                this.textContent = "Show All"
            }
            hidden = true
        }
    })
    return aBtn
}

for(let request of requests){
    const summary = request.querySelector("blockquote.userstuff.summary")
    if(summary !== null){
        summary.style.display = "none"
        request.insertBefore(detailBtn(), summary)
    }
}

topBtnList.appendChild(showAll())