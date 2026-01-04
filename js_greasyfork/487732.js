// ==UserScript==
// @name         Better Competencies Gandalf
// @namespace    http://tampermonkey.net/
// @version      2024-02-20
// @description  Rend l'utilisation de l'onglet Compétences de Gandalf plus intuitif
// @author       Arthur Decaen
// @match        https://gandalf.epitech.eu/local/graph/view.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epitech.eu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487732/Better%20Competencies%20Gandalf.user.js
// @updateURL https://update.greasyfork.org/scripts/487732/Better%20Competencies%20Gandalf.meta.js
// ==/UserScript==

class Competency
{
    constructor(fill, progress, median, threshold, html, title) {
        this.fill = parseInt(fill.replace("%", ""))
        this.progress = parseInt(progress.replace("%", ""))
        this.median = parseInt(median.replace("%", ""))
        this.threshold = parseInt(threshold.replace("%", ""))
        this.html = html
        this.title = title

        this.median = parseInt(this.median * 100 / this.threshold)
        if (Math.abs(this.median - this.progress) <= 2) this.median = this.progress
        this.subComps = []
    }

    GetSubCompsNeeded() {
        const nbSuccess = this.subComps.filter((subComp) => subComp.status == "success").length
        if (nbSuccess == 0) return this.subComps.length
        const valueBySuccess = this.progress / nbSuccess
        return Math.ceil((100 - this.progress) / valueBySuccess)
    }
}

class SubComp
{
    constructor(title, status, id)
    {
        this.title = title.split(" - ")[1]
        this.status = status
        this.id = id

        switch (this.status) {
            case 'success': this.icon = "proficiencyIcon fa fa-check-circle-o success"; break;
            case 'failed': this.icon = "proficiencyIcon fa fa-times-circle-o failed"; break;
            case 'unrated': this.icon = "proficiencyIcon fa fa-times-circle-o unrated"; break;
        }
    }
}

(function() {
    'use strict';

    // ---------- CSS ----------

    const styles = `
    .style {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .styleSkill {
        display: grid;
        grid-template-columns: 4fr 60px 60px 40px;
        grid-template-rows: 2fr;
        grid-column-gap: 0px;
        grid-row-gap: -1px;
        text-wrap: nowrap;
        padding-left: 7px;
        padding-right: 7px;
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .styleSkill:nth-child(even) {
        background: #e9e9e9;
    }

    .styleSkill:nth-child(1) {
        font-weight: bold;
        border-bottom: solid 1px;
        font-style: italic;
    }

    .styleSkillTitle {
        width: fit-content !important;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }

    .styleSubComp {
        display: flex;
        flex-direction: column;
    }

    .styleSubCompChild {
        display: flex;
        justify-content: flex-start;
        gap: 5px;
        font-size: .9rem;
        padding-left: 1.5rem;
    }

    .info button {
        background: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: bold !important;
        text-wrap: nowrap;
        margin: 0;
        padding: 0;
    }

    .listInfo {
        width: 100% !important;
        max-width: 100% !important;
    }

    .studentInfo {
        width: 100%;
    }
    `

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

    // ---------- Get Data ----------

    const competencies = []
    const skillContainer = document.querySelectorAll('.skillProgressContainer:not(.legendSkillProgressSample)');
    var cent = 0

    for (var i = 0; i != skillContainer.length; i++) {
        const container = skillContainer[i]

        const comp = new Competency(
            container.getElementsByClassName("skillProgress")[0].style.width,
            container.title,
            container.getElementsByClassName("skillProgressMedian")[0].style.left,
            container.getElementsByClassName("skillProgressThreshold")[0].style.left,
            container,
            container.previousElementSibling.innerHTML.replaceAll("\t", "").replaceAll("\n", "")
        )

        const progressBar = comp.html.getElementsByClassName("skillProgress")[0]

        if (comp.progress < comp.median) progressBar.style.backgroundColor = "#ffc689"
        if (comp.progress >= 100) {
            cent += 1;
            progressBar.style.backgroundColor = "#40f499"
        }

        const parent = comp.html.parentElement.parentElement.parentElement
        const subComps = parent.querySelectorAll(".competencyLine.behaviorLine")

        for (var j = 0; j != subComps.length; j++)
        {
            const status = subComps[j].querySelectorAll(".proficiencyIcon")[0].title
            const title = status == "unrated"
            ? subComps[j].children[2].innerHTML.replaceAll("\t", "").replaceAll("\n", "")
            : subComps[j].querySelectorAll(".competencyTitle")[0].innerHTML
            const id = `subcomp-${i}-${j}`
            subComps[j].id = id

            const subComp = new SubComp(title, status, id)
            comp.subComps.push(subComp)
        }

        competencies.push(comp)
    }

    // ---------- Button functions ----------

    function firstSetSubComp() {
        const state = localStorage.getItem("subCompState") === "true"
        const subCompDivs = document.querySelectorAll(".styleSubComp")
        for (var i = 0; i != subCompDivs.length; i++) {
            subCompDivs[i].style.display = state ? "none" : "flex"
        }
    }

    function toggleSubComp() {
        const state = localStorage.getItem("subCompState") === "true"
        const subCompDivs = document.querySelectorAll(".styleSubComp")
        for (var i = 0; i != subCompDivs.length; i++) {
            subCompDivs[i].style.display = state ? "flex" : "none"
        }
        localStorage.setItem("subCompState", !state)
    }

    // ---------- Add to page ----------

    const listInfo = document.getElementsByClassName("listInfo")[0]
    listInfo.innerHTML += `
<div class="content-line">
<span class="info">Validated skills: </span>
<span class="content">${cent}/${competencies.length}</span>
</div>`

    const unfinished = competencies.map((comp) => {
        return comp.progress < 100 ? `<span class="styleSkill">
        <span class="styleSkillTitle" title="${comp.title}">${comp.title}</span>
        <b style="color: #76c893;" title="Ma progression">${comp.progress}%</b>
        <b style="color: #34a0a4;" title="Progression moyenne">${comp.median}%</b>
        <b style="color: #184e77;" title="Compétences restantes">${comp.GetSubCompsNeeded()}</b>
        <span class="styleSubComp">
        ${
        comp.subComps.filter(function(objet) {
            return objet.status !== 'success';
        }).sort((a, b) => {
            return a.status === 'failed' ? 1 : -1
        }).map((subComp) => {
            return `
            <span class="styleSubCompChild">
            <span class="${subComp.icon}"></span>
            <span onclick="document.getElementById('${subComp.id}').scrollIntoView({ behavior: 'smooth', block: 'center' })">${subComp.title}</span>
            </span>`
        }).join("")
    }
        </span>
        </span>
        `
        : ""
    }).join("")
    listInfo.innerHTML += `<div class="content-line">
<span class="info"><button id="unfinished">Unfinished skills: </button></span>
<span class="content style">
    <span class="styleSkill">
        <span class="styleSkillTitle">Skill name</span>
        <b style="color: #76c893;">Current</b>
        <b style="color: #34a0a4;">Median</b>
        <b style="color: #184e77;">Need</b>
    </span>
    ${unfinished}
</span>
</div>`

    firstSetSubComp()
    document.querySelector("#unfinished").addEventListener("click", toggleSubComp)
})();