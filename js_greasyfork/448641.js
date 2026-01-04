// ==UserScript==
// @name         AutoTitle
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  AutoTask Title Formatter
// @author       Tim Hill
// @match        https://ww1.autotask.net/Mvc/ServiceDesk/TicketEdit.mvc*
// @match        https://ww1.autotask.net/Mvc/ServiceDesk/TicketNew.mvc*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autotask.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448641/AutoTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/448641/AutoTitle.meta.js
// ==/UserScript==

var abbreviations = // Account abbreviations
          {
              "Coleman Professional Services": "Coleman",
              "Northwest Ohio Classical Academy": "NOCA",
              "Maximum Accessible Housing of Ohio": "MAHO",
              "Brokaw, Inc.": "Brokaw",
              "Sequoia Financial Group": "Sequoia",
              "Thommen Medical USA, LLC": "Thommen Medical",
              "South Columbus Preparatory Academy at German Village": "SCPA German Village",
              "Snavely Group, LLC": "Snavely Group",
              "Northeast Ohio College Preparatory School": "NEOCPS",
          }

function getAccount()
{
    let account = document.getElementsByClassName("Chip")[0].textContent;
    return (account in abbreviations ? abbreviations[account] : account).trim();
}

function getContact()
{
    return document.getElementsByClassName("Chip")[1].textContent.trim().replace(" (primary)", "");
}

function getFirstAdditionalContact()
{
    try
    {
        return document.getElementsByClassName("Chip")[6].textContent.trim();
    }
    catch (e)
    {
        return false;
    }

}

function getSecondAdditionalContact()
{
    return document.getElementsByClassName("Chip")[7].textContent.trim();
}

function getLocation()
{
    return document.getElementsByClassName("Text HighImportance")[0].textContent.trim();
}


function getTitle()
{
    return document.querySelector(".TextAreaContainer > textarea:nth-child(1)").value.trim();
}

function setTitle(new_title)
{
    let title = document.querySelector(".TextAreaContainer > textarea:nth-child(1)");
    title.value = new_title;
    title.dispatchEvent(new Event("input")); // Ensures the change isn't cosmetic upon saving
    title.focus(); // Puts the cursor at the end of the title box, helpful for new tickets
}

//// Button
// Elements
var account_container = document.querySelector(".SectionContainer"); // This is the container we will be putting our button in
var btn_format = document.createElement("BUTTON"); // The button we will use to format the title

// Button styling
btn_format.innerText = "Format Title";
btn_format.style.color = "#ffffff";
btn_format.style.backgroundColor = "#1b2a3a";
btn_format.style.border = "1px solid #2d3e50";
btn_format.style.borderRadius = "4px";
btn_format.style.width = "100%";
btn_format.style.padding = "8px 12px";
btn_format.style.marginTop = "10px";
btn_format.style.fontSize = "14px";
btn_format.style.cursor = "pointer";
btn_format.style.transition = "background-color 0.2s ease";
btn_format.onmouseover = () => btn_format.style.backgroundColor = "#233546";
btn_format.onmouseout = () => btn_format.style.backgroundColor = "#1b2a3a";

// Click function
btn_format.onclick = () =>
{
    switch(getAccount())
    {
        case "Sequoia":
            setTitle(getContact() + " - " + getAccount() + " - " + getTitle().replace("SEQ - FIT - ", ""));
            break;
        case "LifeStance":
        case "Lifestance Midwest":
        case "LifeStance Pacific":
        case "Lifestance Northeast":
        case "Lifestance Northwest":
        case "Lifestance Atlantic":
        case "Lifestance Central":
        case "Lifestance Corp":
        case "Lifestance Great Lakes":
            setTitle(getContact() + " - " + getLocation() + " - " + getTitle());
            break;
        default:
            setTitle(getContact() + " - " + getAccount() + " - " + getTitle());
    }
}
account_container.appendChild(btn_format); // Places the button