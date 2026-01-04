// ==UserScript==
// @name         CAI Toolbar
// @namespace    https://sleazyfork.org/en/users/1033554-thud-butt
// @version      1.0
// @description  Adds a toolbar with auto-scroll (including auto resending after 500 errrors), copy last message (adding bold and italics markdown), and remove last message.
// @author       Thud Butt
// @match        https://beta.character.ai/*
// @icon         https://characterai.io/static/logo512.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460816/CAI%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/460816/CAI%20Toolbar.meta.js
// ==/UserScript==
'use strict';

const enabledColor = '#009933';
const disabledColor = '#ff9900';


// Keep consistent state between page refreshes, unless we're coming from a 500 refresh
let autoScrollEnabled = (sessionStorage.getItem('auto-scroll') !== null) ? JSON.parse(sessionStorage.getItem('auto-scroll')) : false;
let autoScrollInterval = null;

loadToolbar();

setAutoScrollState(autoScrollEnabled);


function loadToolbar()
{
    let customStyle = document.createElement('style');
    customStyle.innerHTML = `
    div.custom-toolbar {
    background-color: rgb(37, 37, 37);
    border-right: 1px solid rgb(15, 15, 15) !important;
    border-bottom: 1px solid rgb(15, 15, 15) !important;
    border-left: 1px solid rgb(15, 15, 15) !important;
    border-radius: 0px 0px 10px 10px;
    width: 200px;
    height: 50px;
    position: sticky;
    top: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 1000;
    display: flex;
    justify-content: space-around;
    }
    `;

    document.body.prepend(customStyle);

    // TOOLBAR
    let divCustomToolbar = document.createElement('div');
    divCustomToolbar.classList.add('custom-toolbar');


    // AUTO SCROLL BUTTON
    let buttonAutoScroll = document.createElement('button');
    buttonAutoScroll.id = 'button-auto-scroll';
    buttonAutoScroll.innerHTML = `
    <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="${autoScrollEnabled ? enabledColor : disabledColor}" d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"/></svg>
    `;
    buttonAutoScroll.type = 'button';
    buttonAutoScroll.title = 'Auto-scroll'
    buttonAutoScroll.classList.add('btn');
    buttonAutoScroll.onclick = function()
    {
        autoScrollEnabled = !autoScrollEnabled;
        setAutoScrollState(autoScrollEnabled)
    };
    divCustomToolbar.append(buttonAutoScroll);
    document.body.prepend(divCustomToolbar);


    // COPY LAST MESSAGE BUTTON
    let buttonCopy = document.createElement('button');
    buttonCopy.id = 'button-copy-last';
    buttonCopy.innerHTML = `
    <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ededed" d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z"/></svg>
    `;
    buttonCopy.type = 'button';
    buttonCopy.title = 'Copy last message'
    buttonCopy.classList.add('btn');
    buttonCopy.onclick = function()
    {
        let lastMessage = document.querySelector('div.chatdisplay div.user-msg:last-of-type p').innerHTML;
        lastMessage = lastMessage.replace(/<\/?em[^>]*>/g, '*');
        lastMessage = lastMessage.replace(/<\/?strong[^>]*>/g, '**');
        navigator.clipboard.writeText(lastMessage);
    };
    divCustomToolbar.append(buttonCopy);

    // REMOVE LAST MESSAGE BUTTON
    let buttonRemoveLast = document.createElement('button');
    buttonRemoveLast.id = 'button-remove-last';
    buttonRemoveLast.innerHTML = `
    <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ededed" d="M258.7 57.4L25.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H256h9.4H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H355.9L486.6 285.3c25-25 25-65.5 0-90.5L349.3 57.4c-25-25-65.5-25-90.5 0zM265.4 416H256l-105.4 0-80-80L195.3 211.3 332.7 348.7 265.4 416z"/></svg>
    `;
    buttonRemoveLast.type = 'button';
    buttonRemoveLast.title = 'Remove last message'
    buttonRemoveLast.classList.add('btn');
    buttonRemoveLast.onclick = function()
    {
        document.querySelector('div.chattop span[data-toggle="dropdown"]').click();
        document.querySelector('div.dropdown-menu.show button:nth-of-type(4n)').click();
        document.querySelector('div.chatdisplay input[type="checkbox"]:last-of-type').click();
        document.querySelector('div.chatfooter button.btn-danger').click();
    };
    divCustomToolbar.append(buttonRemoveLast);


    document.body.prepend(divCustomToolbar);
}

// Autoscrolling
function startAutoScroll()
{
    waitForElement("div[class='swiper-button-next']", 1000).then(function()
    {
        for(let step = 0; step < 5; step++)
        {
            arrowRight();
        };
    })
    .catch(() => {});

    // Clicks the Try Again button
    waitForElement('.Toastify__toast--default', 1000).then(function()
    {
        document.querySelector('.Toastify__toast--default .btn-primary').click();
    })
    .catch(() => {});

    // If there has been a 500 error, then we need to reload the page, remove our last message, and resend it.
    waitForElement('.Toastify__toast--error', 1000).then(function()
    {
        document.getElementById('user-input').closest('div').querySelector('button:nth-child(2)').click();
    })
    .catch(() => {});

    // Add message count
    waitForElement('div.msg-row', 30000).then(function()
    {
        addNumber();

        let messageNumberObserverRow = new MutationObserver(addNumber());

        messageNumberObserverRow.observe(document.querySelector('div.swiper-wrapper'), {childList: true});

        let messageNumberObserverCol = new MutationObserver(function()
        {
            messageNumberObserverRow.observe(document.querySelector('div.swiper-wrapper'), {childList: true});
        });

        messageNumberObserverCol.observe(document.querySelector('div.infinite-scroll-component'), {childList: true});
    })
    .catch(() => {});
}

function setAutoScrollState(state)
{
    // Toggle the auto retry button
    if(state)
    {
        document.querySelector('#button-auto-scroll path').setAttribute('fill', disabledColor);
        clearInterval(autoScrollInterval);
    }
    else
    {
        document.querySelector('#button-auto-scroll path').setAttribute('fill', enabledColor);
        autoScrollInterval = setInterval(startAutoScroll, 1000);
    }

    sessionStorage.setItem('auto-scroll', autoScrollEnabled);
}

// Timed MutationObserver
function waitForElement(querySelector, timeout)
{
    return new Promise((resolve, reject) =>
    {
        let timer = false;

        if(document.querySelectorAll(querySelector).length) return resolve();

        const observer = new MutationObserver(() =>
        {
            if(document.querySelectorAll(querySelector).length)
            {
                observer.disconnect();
                if(timer !== false) clearTimeout(timer);
                return resolve();
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

        if(timeout)
        {
            timer = setTimeout(function()
            {
                observer.disconnect();
                reject();
            }, timeout);
        }
    });
}

// Arrow right and arrow left keypresses for "swiping"
function arrowRight()
{
    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'ArrowRight'}));
}

function arrowLeft()
{
    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'ArrowLeft'}));
}

function addNumber()
{
    let messageNumber = document.querySelectorAll('.swiper-wrapper .swiper-slide .rounded .flex-column');

    for (let i = 0; i < messageNumber.length; i++)
    {
        messageNumber[i].innerHTML = messageNumber[i].innerHTML.replace(messageNumber[i].innerHTML, 'c.AI | ' + (i + 1));
    }
}