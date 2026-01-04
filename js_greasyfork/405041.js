// ==UserScript==
// @name         shift-card | paycom-mount
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  sends spreadsheet to k&n-admin-apps to be made into a shift card
// @author       Jordan M. Stokes
// @match        https://www.paycomonline.net/v4/cl/ta-sch*
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/405041/shift-card%20%7C%20paycom-mount.user.js
// @updateURL https://update.greasyfork.org/scripts/405041/shift-card%20%7C%20paycom-mount.meta.js
// ==/UserScript==

let mainContainer;
let defaultContent;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

(function() {
    'use strict';

    mainContainer = document.querySelector('.mainContainer');
    defaultContent = mainContainer.querySelector('.row');

    defaultContent.className += " default-content";

    if(window.location.href.includes('~~inferior-content~~'))
    {
        mountRemountLink();

        return;
    }

    if(window.location.href.includes("https://www.paycomonline.net/v4/cl/ta-schdisplaydash.php?outputtype=GRID"))
    {
        mountTamperFileSending();
        mountTamperStyling(getCss());
    }
    else if(window.location.href.includes("https://www.paycomonline.net/v4/cl/ta-scheduledash.php"))
    {
        mountTamperUI();
        mountTamperStyling(getCss());
    }
})();


function mountTamperUI()
{
    mainContainer.innerHTML =
    `
        <div class="tamper-container">
            <h1>k&n-admin-apps</h1>
            <h2>shift-cards | paycom-mount</h2>
            <div class="date">
                <input type="date"/>
            </div>
            <p class="button button-generate">generate</p>
            <p class="dismount">view inferior web design instead</p>
        </div>
    `;

    const tamperContainer = mainContainer.querySelector('.tamper-container');
    const dateInput = tamperContainer.querySelector('.date input');
    const generateButton = tamperContainer.querySelector('.button-generate');
    const dismount = tamperContainer.querySelector('.dismount');

    dateInput.value = formatDate(tomorrow);
    generateButton.addEventListener("click", generate);
    dismount.addEventListener("click", dismountTamperUI);
}

function mountRemountLink()
{
    let remountContainer = document.createElement('div');
    let mount = document.createElement('p');

    remountContainer.className = 'remount-container';
    mount.innerHTML = 'view superior web design instead';
    mount.className = 'mount';
    mount.addEventListener('click', remountTamperUI);

    mountTamperStyling(getDismountedCss());

    remountContainer.appendChild(mount);
    mainContainer.insertBefore(remountContainer, defaultContent);
}

function remountTamperUI()
{
    window.location.href = window.location.href.replace("~~inferior-content~~", "");
}

function dismountTamperUI()
{
    window.location.href += "~~inferior-content~~";
}

function mountTamperFileSending()
{
    let downloadLink = defaultContent.querySelector("#schedule a").href;
    downloadLink = downloadLink.replace("GRID", "EXCELXLSX");

    mainContainer.removeChild(defaultContent);

    let status = document.createElement("p");
    status.innerHTML = "uploading to k&n-admin-apps...";
    status.className = "status";

    mainContainer.appendChild(status);
    
    axios({
        method: 'get',
        url: downloadLink,
        responseType: 'blob'
    })
    .then(function (response) {
        const formData = new FormData();
        formData.append("file", response.data);
        axios.post(`https://kn-admin-apps.herokuapp.com/apps/shift-cards/`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }).then(function (response)
        {
            window.location.href = `https://kn-admin-apps.herokuapp.com/apps/shift-cards/output`;
        })
        .catch(error => 
        {
            console.log(error.status);
        });
    })
    .catch(error => { });
}

function mountTamperStyling(css)
{
    const body = document.querySelector('body');
    const styling = document.createElement('style');

    mainContainer.className = mainContainer.className.replace("noMarginTop", "");
    styling.innerHTML = css;

    body.appendChild(styling);
}

function generate(event)
{
    const target = event.target;

    target.style.transform = "scale(1.2)";
    target.style.opacity = "0.65";

    function countDown(target)
    {
        let display = target.innerHTML;

        if(isNaN(display))
        {
            console.log('a');
            target.innerHTML = "3"
        }
        else if(display === "1")
        {
            console.log('b');
            target.innerHTML = "generating...";
            submit();
            return;
        }
        else
        {
            console.log('c');
            target.innerHTML = "" + parseInt(display) - 1;
        }

        setTimeout(() => countDown(target), 1000);
    }

    countDown(target);

    const dateInput = document.querySelector('.date input');
    const date = formattedDateToPaycom(dateInput.value);
    const body = document.querySelector("body");
    const startDate = defaultContent.querySelector("#startDate");
    const endDate = defaultContent.querySelector("#endDate");
    const groupBy = defaultContent.querySelector("#groupby");
    const employeeSelectAll = defaultContent.querySelector("#employeeFilter #chkSelectAll");
    const employeeStatusActive = defaultContent.querySelector("#statusFilter .filterCheckbox");
    let excelSelector = null;

    let inputs = defaultContent.querySelectorAll('input');

    let radioCount = 0;

    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type.toLowerCase() == 'radio') {

            radioCount ++;

            if(radioCount === 2)
            {
                excelSelector = inputs[i];
            }
        }
    }
    body.appendChild(defaultContent);

    startDate.value = date;
    endDate.value = date;

    employeeSelectAll.click();
    employeeStatusActive.click();

    groupBy.value = "cat1";
    groupBy.onchange();

    const cat1s = defaultContent.querySelectorAll("#cat1 #chkSelectAll");

    for(let i = 0; i < cat1s.length; i++)
    {
        cat1s[i].click();
    }

    excelSelector.click();
}

function submit()
{
    const submit = defaultContent.querySelector("#btnSubmit");

    submit.click();
}

function formattedDateToPaycom(date)
{
    const split = date.split('-');

    return `${split[1]}/${split[2]}/${split[0]}`;
}

function formatDate(date)
{
    const formattedDate = date.getFullYear() + "-" + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    
    return formattedDate;
}

function getCss()
{
    return `
    body {
        min-height: 1000px;
    }

    .mainContainer {
        background: #2a2a2a;
        margin-top: 8vh;
        border-radius: 13px;
        min-height: 0;
        text-align: center;
    }

    .default-content {
        opacity: 0;
        position: absolute;
        top: -1000px;
        z-index: -1;
    }

    .tamper-container {
        font-family: "Georgia", "Times New Roman", Times, serif;
        font-weight: 200;
        background: #333;
        text-align: center;
        padding: 5px;
        margin: 50px;
        border: 3px solid white;
        border-radius: 10px;
    }

    .tamper-container h1 {
        font-size: 45px;
        margin: 60px 0 17px;
        color: white;
    }

    .tamper-container h2 {
        font-size: 24px;
        color: #aaa;
    }

    .tamper-container h1,
    .tamper-container h2 {
        font-family: "Georgia", "Times New Roman", Times, serif;
        font-weight: 200;
    }

    .date {
        display: block;
        margin: 60px auto 40px;
        width: 170px;
        height: 30px;
        background: white;
        border-radius: 10px;
    }

    .date input {
        text-align: center;
        border: none;
        background: #0078d7;
        color: white;
        font-size: 14px;
        box-sizing: border-box;
        outline: 0;
        padding: 0.75rem;
        position: relative;
        width: 100%;
        user-select: none;
        border-radius: 10px;
        border: 2px solid white;
    }

    .date input::-webkit-calendar-picker-indicator {
        background: transparent;
        bottom: 0;
        color: transparent;
        cursor: default;
        height: auto;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
    }

    .button {
        display: inline-block;
        font-size: 16px;
        color: white;
        background: #3d8a4f;
        padding: 10px 32px;
        margin: 0 0 45px;
        border-radius: 10px;
        border: 2px solid white;
    }

    .button,
    .date,
    .dismount {
        transform: scale(1.0);
        transition: transform 200ms, opacity 250ms;
    }

    .button:hover,
    .date:hover,
    .dismount:hover {
        transform: scale(1.1);
        cursor: default;
    }

    .button:select {
        opacity: 0.8;
    }

    .dismount {
        display: block;
        color: #aaa;
        font-size: 14px;
        text-decoration: underline;
        margin: 45px auto 25px;
        width: 250px;
    }

    .status {
        display: inline-block;
        font-family: "Georgia", "Times New Roman", Times, serif;
        font-weight: 200;
        margin: 150px auto;
        color: white;
        background: #333;
        font-size: 22px;
        padding: 30px 50px;
        border: 3px solid white;
        border-radius: 10px;
    }
    
    .footerAppend {
        margin: 10vh 0 5vh;
    }


`;
}

function getDismountedCss()
{
    return `
    
    .remount-container {
        display: block;
    }

    .mount {
        display: block;
        color: #37873b;
        font-size: 14px;
        text-decoration: underline;
        margin: 15px auto 50px;
        width: 250px;
        transform: scale(1.0);
        transition: transform 200ms, opacity 250ms;
    }

    .mount:hover {
        transform: scale(1.1);
        cursor: default;
    }

    `
}