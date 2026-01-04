
// ==UserScript==
// @name         Udemy Progress Control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The script can automatically check or uncheck off completed lessons of courses or sections, saving users time and effort in manually marking them as completed.
// @author       realzam
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463490/Udemy%20Progress%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/463490/Udemy%20Progress%20Control.meta.js
// ==/UserScript==


function awaitToElement(element){
    return new Promise((resolve) => {
        let nIntervId = setInterval(()=>{
            const isReady=document.querySelectorAll(element).length != 0
            if(isReady){
                resolve()
                clearInterval(nIntervId)
            }
        },100)
        });
}

function seccionCollapse(seccion,action){
    return new Promise(async(resolve) => {
        const seccionButtonCollapse =seccion.querySelector('button[type="button"]')
        const isChecked = seccion.querySelector('span[data-checked]').getAttribute('data-checked') === 'checked'
        console.log(seccion.getAttribute('data-purpose'),isChecked)
        if(isChecked!=action){
            seccionButtonCollapse.click()
            if(action){
                await awaitToElement('ul.ud-unstyled-list')
            }
        }
        resolve()
    });
}

const isPageLoaded = async()=> awaitToElement('div[data-purpose="curriculum-section-container"]')

async function actioSeccion(seccion,action){
    await seccionCollapse(seccion,true)
    const leccions=seccion.childNodes[2].childNodes[0].childNodes[0].childNodes
    for(const leccion of leccions)
    {
        if(leccion.querySelector('input').checked !=action)
        {
            leccion.querySelector('input').click()
        }
    }
    await seccionCollapse(seccion,false)

}

async function actionCourse(seccions,action){
    for(const seccion of seccions)
    {
        await actioSeccion(seccion,action)
    }
}


async function main() {
    await isPageLoaded();
    const seccions = document.querySelector('#ct-sidebar-scroll-container > div > div').childNodes;
    const courseActions = document.querySelector('section[data-purpose="sidebar"]').childNodes[0];

    let completeAllCourseBtn = document.createElement("div");
    completeAllCourseBtn.tabIndex=0
    completeAllCourseBtn.role="button"
    completeAllCourseBtn.className = "item-link ud-btn ud-btn-small ud-btn-primary ud-heading-sm";
    completeAllCourseBtn.innerHTML ='<span>Complete</span>'
    completeAllCourseBtn.onclick = ()=>{actionCourse(seccions,true)};

    let resetCourseBtn = document.createElement("div");
    resetCourseBtn.tabIndex=0
    resetCourseBtn.role="button"
    resetCourseBtn.className = "item-link ud-btn ud-btn-small ud-btn-secondary ud-heading-sm";
    resetCourseBtn.innerHTML ='<span>Reset</span>'
    resetCourseBtn.onclick = ()=>{actionCourse(seccions,false)};

    courseActions.appendChild(completeAllCourseBtn)
    courseActions.appendChild(resetCourseBtn)

    for(const seccion of seccions)
    {
        let checkAllSeccionnBtn = document.createElement("div");
        checkAllSeccionnBtn.tabIndex=0
        checkAllSeccionnBtn.role="button"
        checkAllSeccionnBtn.className = "item-link ud-btn ud-btn-small ud-btn-primary ud-heading-sm";
        checkAllSeccionnBtn.innerHTML ='<span>Check All</span>'
        checkAllSeccionnBtn.style.margin='5px'
        checkAllSeccionnBtn.onclick = ()=>{actioSeccion(seccion,true)}

        let uncheckAllSeccionnBtn = document.createElement("div");
        uncheckAllSeccionnBtn.tabIndex=0
        uncheckAllSeccionnBtn.role="button"
        uncheckAllSeccionnBtn.className = "item-link ud-btn ud-btn-small ud-btn-secondary ud-heading-sm";
        uncheckAllSeccionnBtn.innerHTML ='<span>Uncheck All</span';
        uncheckAllSeccionnBtn.style.margin='5px'
        uncheckAllSeccionnBtn.onclick = ()=>{actioSeccion(seccion,false)};

        seccion.appendChild(checkAllSeccionnBtn)
        seccion.appendChild(uncheckAllSeccionnBtn)
    }

}

main()