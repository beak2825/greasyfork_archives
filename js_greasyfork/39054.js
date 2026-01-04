// ==UserScript==
// @name         Fast Interest Audit
// @namespace    salembeats
// @version      4.21
// @description  Fast interest audits. Recommended for use with mmmTurkeyBacon's "Scroll to Workspace" plugin and Cuyler's edit of Mturk Radio Keybinds. Now has sanity check.
// @author       Cuyler Stuwe (salembeats)
// @include      file:///C:/Users/Mini/Desktop/ia3.html
// @include      *
// @icon         http://ez-link.us/sb-png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39054/Fast%20Interest%20Audit.user.js
// @updateURL https://update.greasyfork.org/scripts/39054/Fast%20Interest%20Audit.meta.js
// ==/UserScript==

if(window === window.top) {return;}

// Indentified up here because it's relevant to our sanity check.
var instructionsDiv = document.querySelector(".panel.panel-primary");

function isThisAnInterestAudit()
{
    var isIt = false;
    var hitIdentificationMessage = "This is not an Interest Audit";



    if(instructionsDiv)
    {
        if(instructionsDiv.textContent.toLowerCase().includes("is the item relevant to the interest?") ||
           instructionsDiv.textContent.toLowerCase().includes("ist der artikel für das interesse relevant?") ||
           instructionsDiv.textContent.toLowerCase().includes("il prodotto e’ rilevante all’interesse?") ||
           instructionsDiv.textContent.toLowerCase().includes("¿es el artículo relevante al interés?") ||
           instructionsDiv.textContent.includes("Est-ce-que le produit est relatif à l'intérêt?") ||
           instructionsDiv.textContent.includes("判断基準: その商品は特定のインタレスト (興味関心) に対して関連性があるか") ||
           instructionsDiv.textContent.includes("商品是否与给定兴趣相关?"))
        {
            isIt = true;
            hitIdentificationMessage = "Identified Interest Audit HIT";
        }
    }

    console.log(hitIdentificationMessage);
    return isIt;
}

if(isThisAnInterestAudit())
{

    // Identify all of the relevant page elements
    var fullInterestParagraph = document.querySelector("p[style='font-size:1.4em; font-weight:bold;']");
    var redTextParagraphs = document.querySelectorAll("p[style='font-size:1.0em; font-weight:bold; color:red;']");
    var redTextParaGerman = document.querySelector("span[style='color:#FF0000;']");
    var productImage = document.querySelector("img[border='0']");
    var productDescriptionDiv = document.querySelector("div[style='font-style: italic; font-weight: bold; max-width: 300px; padding-bottom:15px;']");
    var yesButton = document.querySelector("#radio-yes");
    var yesButtonLabel = document.querySelector("label[for='radio-yes']");
    var noButton = document.querySelector("#radio-no");
    var noButtonLabel = document.querySelector("label[for='radio-no']");
    var skipButton = document.querySelector("#radio-skip");
    var skipButtonLabel = document.querySelector("label[for='radio-skip']");
    var buttonsHolder = document.querySelector("div[style='float:left; width:275px; padding-left:20px;']");
    var commentsText = document.querySelector("#comments");
    var miscBoldDivs = document.querySelectorAll("div[style='font-weight:bold;']");
    var allParagraphs = document.querySelectorAll("p");
    var hitBody = document.querySelector("body");
    var hitSubmitButton = document.querySelector("[type='submit']");

    hitBody.style.backgroundColor = "black"; // Make the HIT background color black.
    hitBody.style.color = "white"; // Default anything new to white (Doesn't do anything at the moment, really).

    // Color code the text we're keeping.
    fullInterestParagraph.style.color = "yellow";
    productDescriptionDiv.style.color = "gray";

    productImage.style.height = "400px";
    productImage.style.maxWidth = "400px";

    // Hide the instructions. We're elite. We've done these.
    instructionsDiv.style.display = "none";

    // Replace the interest text with an all-caps question without the unneccessary "Interest: " text.
    var modifiedInterestText = fullInterestParagraph.textContent
        .replace(/Interest:\s/,"")
        .replace(/Intérêt:\s/,"")
        .replace(/インタレスト名:\s/,"")
        .replace(/Interesse:\s/,"")
        .replace(/兴趣:\s/,"")
        .replace(/Interés:\s/, "")
        .replace(/(.*)/, "$&?").toUpperCase();
    fullInterestParagraph.textContent = modifiedInterestText;

    // Really big query string. This is probably the most important part of the script.
    fullInterestParagraph.style.fontSize = "5.0em";

    // Hide all red paragraphs. We don't need the warning.
    for(let i = 0, length = redTextParagraphs.length; i < length; i++)
    {
        redTextParagraphs[i].style.display = "none";
    }
    redTextParaGerman.style.display = "none";

    // Find the 'is this relevant to the..." text that goes above the "yes/no" buttons normally, and hide it.
    // We know how this HIT works.
    for(let i = 0, length = allParagraphs.length; i < length; i++)
    {
        let currentParagraph = allParagraphs[i];

        if(currentParagraph.textContent.includes("Is the product relevant"))
        {
            currentParagraph.style.display = "none";

            i = length; // End the search.
        }
    }

    // Hide all of the miscellaneous bold divs.
    // If we need the stuff here to make a decision, then we'd make better money by just returning this HIT and grabbing an easier one.
    for(let i = 0, length = miscBoldDivs.length; i < length; i++)
    {
        miscBoldDivs[i].style.display = "none";
    }

    // Color our YES and NO appropriately,
    // make the words bigger,
    // and make bigger gaps for the buttons that are about to be bigger.
    // Also, make the buttons holder big enough.
    yesButtonLabel.style.color = "green";
    yesButtonLabel.style.paddingLeft = "30px";
    yesButtonLabel.style.fontSize = "2.0em";
    noButtonLabel.style.color = "red";
    noButtonLabel.style.paddingLeft = "30px";
    noButtonLabel.style.fontSize = "2.0em";
    buttonsHolder.style.width = "500px";

    // Scale our YES and NO buttons.
    yesButton.style.transform = "scale(4)";
    noButton.style.transform = "scale(4)";

    // Hide the "skip" button and reasoning.
    // We can make more money by just returning this one if it's not worth a "yes" or "no".
    skipButton.style.display = "none";
    skipButtonLabel.style.display = "none";
    commentsText.style.display = "none";

    // Move things around to fixed places.
    //////////////////////////////////////
    var movedToFixedSpot = function(item,x,y)
    {
        item.style.position = "static";
        item.style.left = x;
        item.style.top = y;
        return item;
    };

    fullInterestParagraph = movedToFixedSpot(fullInterestParagraph,"20px","50px");
    productImage = movedToFixedSpot(productImage,"20px","150px");
    productDescriptionDiv = movedToFixedSpot(productDescriptionDiv, "440px","150px");
    buttonsHolder = movedToFixedSpot(buttonsHolder,"440px","250px");
    submitButton = movedToFixedSpot(submitButton,"-500px","0px"); // Hide the submit button, because we'll be clicking it by clicking the radio buttons
    //////////////////////////////////////

    // If we click either button, submit the form.
    //////////////////////////////////////
    yesButton.addEventListener("click",function() {
        hitSubmitButton.click();
    });
    //////////////////////////////////////
    noButton.addEventListener("click",function() {
        hitSubmitButton.click();
    });
    //////////////////////////////////////

}