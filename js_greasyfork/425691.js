// ==UserScript==
// @name         Target XBOX, PS5 And Test Toy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Target bot to automatically purchase items
// @author       You
// @match        https://www.target.com/co*
// @match        https://www.target.com/p/20ct-washable-markers-super-tip-classic-colors-mondo-llama-8482/*
// @match        https://www.target.com/p/xbox-series-x-console*
// @match        https://www.target.com/p/playstation-5-console/*
// @run-at      document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425691/Target%20XBOX%2C%20PS5%20And%20Test%20Toy.user.js
// @updateURL https://update.greasyfork.org/scripts/425691/Target%20XBOX%2C%20PS5%20And%20Test%20Toy.meta.js
// ==/UserScript==

function AddItemToCart()
{
    var counter1 = document.getElementsByClassName("Col-favj32-0 MkLC h-padding-h-default h-padding-t-tight")[1]; //check if the stock information is loaded before executing script  Link__StyledLink-zyll5o-0 ggRyRP h-text-sm h-text-underline
    if (counter1 && counter1.innerText.indexOf("Sold")>-1)
    {
        console.log("Loaded, OOS. Reloading now.");
        location.reload(); //if there is no store near you with the item in stock, reload the page and start script over
    }
    else if (counter1 && counter1.innerText.indexOf("Sold") == -1)
    {
        console.log("Loaded, possibly in stock")
        var buttonloaded = document.getElementsByClassName("Button__ButtonWithStyles-sc-1a5r2pb-0 styles__StyledButton-sc-1f2lsll-0 ioXwkT iIyhFg")[0]; //check if there’s red buttons loaded
        if (buttonloaded && (buttonloaded.innerText=="Pick it up" ||buttonloaded.innerText=="Pick up here"))
        {
            console.log("Pick it up here button loaded, clicking now");
            buttonloaded.click(); //if there is stock near you, click on "pick it up" button
            setTimeout(function(){location.replace("https://www.target.com/co-review");},1000); //redirect straight to checkout
        }
        else
        {
            console.log("No button found yet");
            setTimeout(AddItemToCart, 500); //restart function until the pick it up button appears
        }

    }
    else
    {
        console.log ("not loaded yet");
        setTimeout(AddItemToCart, 500);
    } //restart function until stock info is loaded
}

//The website fails to fetch the stock database sometimes. If it happens, reload the page
function LoadingError()
{
    var counter1 = document.getElementsByClassName("Button-bwu3xu-0 igoiFK h-margin-t-default")[0]; //error button plz refresh
    if (counter1)
    {
        location.reload(); //if the error is encountered, reload the page
    }
    else
    {
        setTimeout(LoadingError, 500);
    }
}


//set up an automatic reload in case of uncaught error
function ReloadTimer()
{
    console.log("reloading page in 15 seconds");
    setTimeout(function(){location.reload();},15000); //reload the page no matter what after 15 seconds
    setTimeout(function(){console.log("reloading page in 10 seconds");},5000);
    setTimeout(function(){console.log("reloading page in 5 seconds");},10000);
}

function CheckPayment()
{
    var counter = document.getElementsByClassName("Link__StyledLink-sc-4b9qcv-0 fUrQXY h-margin-l-tiny")[0]; //check if the Edit payment method button is loaded
    if (counter) //if the button is loaded, check if you are asked to provide your CVC
    {
        console.log("payment loaded");

        var cvc = document.getElementById("creditCardInput-cvv"); //if you are asked to provide your CVC, it gets more complicated. See at the very bottom
        if (cvc)
        {
            console.log("AHK Required");
            document.title = "AHK Required"; //change the name of the target tab for AutoHotKey input
            waitforcvcvalue();
        }
        else
        {
            console.log("CVC saved"); //if they don't ask you your CVC, it means they have it stored in memory (from a previous purchase)
            checkoutf(); //the script can then proceed
        }
    }
    else
    {
        console.log("No payment method found; trying again."); //the payment method has not yet been loaded
        setTimeout(CheckPayment, 500); //try again until the payment method area is loaded
    }
};

function waitforcvcvalue(){ //this is only if you need to type it your card verification code (CVC)
    var cvc = document.getElementById("creditCardInput-cvv");
    if (cvc.value.length == 3) //if the CVC field has been entered (so if 3 hidden characters appear in the field), proceed
    {
        checkoutf(); //click on "place your order" now that the CVC is in. Gratz on your purchase.
    }
    else
    {
        console.log("waiting for AHK"); //if the CVC field is empty or not entirely entered (1 or 2 out of 3 numbers), wait before proceeding
        setTimeout(waitforcvcvalue, 500);
    }
}

function saveandcontinue(){
    var savebutton1 = document.getElementsByClassName("Button__ButtonWithStyles-sc-1a5r2pb-0 bZkgSI")[0]; //This is the order info save and continue button
    var savebutton2 = document.getElementsByClassName("Button-bwu3xu-0 lnurpp")[0]; //This is the payment info save and continue button
    if (savebutton1)
    {
        console.log("First save button found")
        savebutton1.click();
        setTimeout(saveandcontinue, 1500);
    }
    else if (savebutton2)
    {
        console.log("Second save button found")
        savebutton2.click();
        checkforcvc();
    }
    { setTimeout(saveandcontinue, 1500);} //if it's not loaded, look for it again
}

function checkforcvc(){
    var cvc = document.getElementById("creditCardInput-cvv"); //if you are asked to provide your CVC, it gets more complicated. See at the very bottom
    var cvccounter = 0;
    if (cvc)
    {
        console.log("AHK Required");
        document.title = "AHK Required"; //change the name of the target tab for AutoHotKey input
        waitforcvcvalue();
    }
    else
    {
        cvccounter +=1;
    }

    if (cvccounter > 5)
    {
        console.log("CVC saved"); //if they don't ask you your CVC, it means they have it stored in memory (from a previous purchase)
        checkoutf(); //the script can then proceed
    }
    else {setTimeout(checkforcvc, 500)}
}


function checkoutf(){ //this is only if the CVC code is not asked by Target
    var checkout = document.getElementsByClassName("BaseButton-sc-3v3oog-0 ButtonPrimary-sc-9wgfzx-0 cLBbtz JRFKP")[0]; //This is the "place your order" button
    if (checkout)
    {
        console.log("Finalizing")
        checkout.click(); //if the order button is loaded, press it. Congratz on your purchase
        setTimeout(checkoutf, 7000); //if the button above didn't redirect you to order confirmation, loop the function so that the order button is continuously pressed until it goes through
    }
    else { setTimeout(checkoutf, 1000);} //if it's not loaded, look for it again
}

if (window.location.href.indexOf("https://www.target.com/p") > -1)
{
    AddItemToCart();
    LoadingError();
    ReloadTimer();
}

if (window.location.href.indexOf("https://www.target.com/co")>-1 && window.location.href.indexOf("https://www.target.com/co-thankyou") == -1)
{
    CheckPayment();
    saveandcontinue();
}


/* AHK SCRIPT FOR INPUT CVC CODE
REPLACE THE XXX WITH YOUR CVC CODE


Gui, +LastFound
DllCall("RegisterShellHookWindow", UInt, WinExist())
OnMessage(DllCall("RegisterWindowMessage", Str, "SHELLHOOK"), "ShellMessage")
Return

ShellMessage(wParam, lParam) {
 ; https://autohotkey.com/board/topic/80644-how-to-hook-on-to-shell-to-receive-its-messages/
 Static targetTitle := "AHK Required", browser := "chrome.exe"
 wTitle = ahk_id %lParam%
 WinGet, pname, ProcessName, %wTitle%
 WinGetTitle, thisTitle, %wTitle%
 If (wParam != (redraw := 6) || pname != browser || !Instr(thisTitle, targetTitle))
  Return
 Sleep, 500
 SoundBeep
 Send, XXX
 Sleep, 2500
 Send, XXX
 Send {tab}
 Sleep, 5000
 Send, XXX
} */
