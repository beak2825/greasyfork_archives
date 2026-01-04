// ==UserScript==
// @name         Twitch Addy Droplist
// @namespace    https://gr8.cc/
// @version      1.1
// @description  Get list of user ETH Addresses that tags you!
// @author       AvalonRychmon
// @license      MIT
// @match        https://www.twitch.tv/*
// @match        https://dashboard.twitch.tv/u/*/stream-manager
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @downloadURL https://update.greasyfork.org/scripts/441671/Twitch%20Addy%20Droplist.user.js
// @updateURL https://update.greasyfork.org/scripts/441671/Twitch%20Addy%20Droplist.meta.js
// ==/UserScript==


window.setInterval(() => {
    if (!$('#list-container').length) {

        // Create List Box
        showList();

        // Create Chat listener
        chatListener();
    }
}, 1000);

function chatListener(){

    // Get Chat Container
    const c = document.querySelector('.chat-scrollable-area__message-container');
    if (!c) {
        window.setTimeout(chatListener, 500);
        return;
    }

    // Remove any listener
    c.removeEventListener('DOMNodeInserted', checkMessage);
    // Add a new listener
    c.addEventListener('DOMNodeInserted', checkMessage, true);

}

function checkMessage(event){

    // Bot names
    const bots = ['nightbot','streamelements','streamlabs'];

    // Set username
    let username = localStorage.getItem('username');
    if(!username) return;

    // New Chat Message
    if (event.target.className !== 'chat-line__message') return;

    // Get chat text
    let textMessage = event.target.innerText.replace(/\d\d?:\d\d/, "");
        textMessage = textMessage.split(': ');

    // Message Variables
    let user = textMessage[0], msg = textMessage[1];

    // Check if msg or bot
    if( !msg || bots.includes(user.toLowerCase()) || user.startsWith("Replying") ) return;

    // RegExp variables
    if(username == 'all'){
        const regs = [
            `(?<addy>0x[a-fA-F0-9]{40})`,
            `(?<addy>[a-zA-Z0-9]{2,}\.eth)`
            ];

        regs.forEach((item, index) => {

            let pattern = new RegExp(item, "im");
            let found = msg.match(pattern);
            if(found){
                console.log(user+': '+found.groups.addy);
                newAddress(user, found.groups.addy);
                return
            }
        });
    }
    else if(username){

       const regs = [
            `@dropper.*(?<addy>0x[a-fA-F0-9]{40})`,
            `@dropper.*?(?<addy>[a-zA-Z0-9]{2,}\.eth)`,
            `(?<tag>@${username}).*(?<addy>0x[a-fA-F0-9]{40})`,
            `(?<addy>0x[a-fA-F0-9]{40}).*(?<tag>@${username})`,
            `(?<tag>@${username}).*?(?<addy>[a-zA-Z0-9]{2,}\.eth)`,
            `(?<addy>[a-zA-Z0-9]{2,}\.eth).*(?<tag>@${username})`
            ];

        regs.forEach((item, index) => {

            let pattern = new RegExp(item, "im");
            let found = msg.match(pattern);
            if(found){
                console.log(user+': '+found.groups.addy);
                newAddress(user, found.groups.addy);
                return
            }
        });

    }

}

function showList() {

        let listContainer = document.getElementById('list-container');
        if (!listContainer) {

            let username = localStorage.getItem('username');
                username = username ? username : '';

            $('head').append(`<style type="text/css">
                .channel-leaderboard {
                    display: none !important;
                }
                .card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    word-wrap: break-word;
                    background-color: #fff;
                    background-clip: border-box;
                    background-color: #0e0e10;
                    background-color: var(--color-background-base) !important;
                    color: #efeff1;
                    color: var(--color-text-base);
                    border-top: var(--border-width-default) solid var(--color-border-base) !important;
                    border-bottom: var(--border-width-default) solid var(--color-border-base) !important;
                    font-size: 1.3rem;
                    font-size: var(--font-size-base);
                    font-family: var(--font-base);
                    line-height: 2rem;
                    width: 100%;
                    max-height: 350px;
                }
                .card-header {
                    padding: 1.5rem;
                    margin-bottom: 0;
                    background-color: var(--color-background-body);
                    box-shadow: inset 0 calc(-1 * var(--border-width-default)) 0 var(--color-border-tab);
                    color: var(--color-text-alt) !important;
                    font-size: var(--font-size-6) !important;
                    font-weight: var(--font-weight-semibold) !important;
                    text-transform: uppercase !important;
                    width: 100%;
                    text-align: center;
                }
                .card-body {
                    flex: 1 1 auto;
                    padding: 1rem 1rem;
                }
                .card-title{
                    display: flex;
                    margin: 0.5rem auto 1rem;
                    padding-bottom: 0.25rem;
                    box-shadow: inset 0 calc(-1 * var(--border-width-default)) 0 var(--color-border-tab);
                }
                .input-group {
                    position: relative;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: stretch;
                    width: calc(100% - 96px) !important;
                }
                .input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation)>:not(:last-child):not(.dropdown-toggle):not(.dropdown-menu) {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                .input-group>:not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback) {
                    margin-left: -1px;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
                .input-group>.chat-wysiwyg-input__editor{
                    position: relative;
                    flex: 1 1 auto;
                    width: 1%;
                    min-width: 0;
                }
                .input-group .btn {
                    position: relative;
                    z-index: 2;
                }
                .mt-0{
                    margin-top: 0;
                }

                .mb-3 {
                    margin-bottom: 1rem !important;
                }

                .ms-3 {
                    margin-left: .75rem !important;
                }

                .me-3 {
                    margin-right: .75rem !important;
                }
                .pe-3 {
                    padding-right: 1rem!important;
                }
                .pb-3 {
                    padding-bottom: 1rem!important;
                }
                #list-container-move{
                    cursor: move;
                    user-select: none;
                }
                .move{
                    position: absolute;
                    border: var(--border-width-default) solid var(--color-border-base) !important;
                    align-items: center !important;
                    width: 340px;
                    z-index: 5000;
                }
                #list-container .chat-wysiwyg-input__editor{
                    position: relative;
                    outline: none;
                    white-space: pre-wrap;
                    overflow-wrap: break-word;
                    width: calc(100% - 96px) !important;
                    padding: 0.5em !important;
                    margin-right: 0 !important;
                    line-height: 1;
                    height: var(--input-size-default);
                }
                .dropList{
                    max-height: 206px;
                    overflow-x: hidden;
                    overflow-y: auto;
                }
                .dropList::-webkit-scrollbar {
                    width: 0.6rem;
                    background: rgba(0,0,0,0);
                }
                .dropList::-webkit-scrollbar-thumb {
                    background: var(--color-background-button-secondary-hover);
                    background-clip: padding-box;
                    border-radius: 7px;
                    min-height: 10px;
                    opacity: 1;
                    right: 2px;
                    width: 7px;
                }
                .address{
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    white-space: nowrap;
                    overflow: hidden;
                    margin-right: 6px;
                }
                .btn{
                    display: inline-flex;
                    position: relative;
                    -webkit-box-align: center;
                    align-items: center;
                    -webkit-box-pack: center;
                    justify-content: center;
                    vertical-align: middle;
                    overflow: hidden;
                    text-decoration: none;
                    white-space: nowrap;
                    user-select: none;
                    font-weight: var(--font-weight-semibold);
                    border-radius: var(--border-radius-medium);
                    font-size: var(--button-text-default);
                    height: var(--button-size-default);
                    width: var(--button-size-default);
                    padding: 0.5em;
                }
                .btn-close-wrapper {
                    position: absolute !important;
                    top: 9px !important;
                    right: 0px !important;
                    margin-right: 1rem !important;
                }
                .btn-close {
                    border: var(--border-width-default) solid transparent;
                    background-color: var(--color-background-button-icon-overlay-default);
                    color: var(--color-text-alt) !important;
                    font-size: 7px !important;
                }
                .btn-save {
                    background-color: var(--color-background-button-primary-default);
                    color: var(--color-text-button-primary);
                    width: 50px;
                }
                .btn-save:hover {
                    background-color: var(--color-background-button-primary-hover);
                    color: var(--color-text-button-primary);
                }
                .btn-copy {
                    background-color: var(--color-background-button-secondary-default);
                    color: var(--color-text-button-secondary);
                    overflow: hidden;
                    white-space: nowrap;
                    width: 98% !important;text-align: left !important;
                    justify-content: left !important;
                }
                .btn-copy:hover {
                    background-color: var(--color-background-button-secondary-hover);
                    color: var(--color-text-button-secondary);
                }
                .userAddress {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: calc(100% - 3.88em);
                 min-width: 2.88em;
                 display: inline-block;
                }
                .btn-delete {
                    background-color: var(--color-background-button-text-default);
                    color: var(--color-text-button-text);
                }
                .btn-shuffle{
                    fill: var(--color-fill-success);
                }
                .btn-close:hover, .btn-shuffle:hover, .btn-export:hover,.btn-delete:hover {
                    background-color: var(--color-background-button-text-hover);
                }
                .copied {
                    background-color: var(--color-background-button-success);
                    color: var(--color-text-button-success-active);
                }
                .copied:hover {
                    background-color: var(--color-background-button-success-hover);
                    color: var(--color-text-button-success-active);
                }
                .tippy-box[data-theme~='light'] {
                    padding: 1px 0px important;
                    margin: 0 !important;
                    border-radius: var(--border-radius-medium);
                    background-color: var(--color-background-tooltip);
                    color: var(--color-text-tooltip);
                    font-size: var(--font-size-6);
                    font-weight: var(--font-weight-semibold);
                    line-height: var(--line-height-heading);
                    text-align: left;
                    z-index: var(--z-index-balloon);
                    pointer-events: none;
                    user-select: none;
                    white-space: nowrap;
                }
                .tippy-box[data-theme~='light'] > .tippy-arrow::before {
                    border-top-color: var(--color-background-button-overlay-primary-default);
                    transform: scale(0.6);
                }
            </style>`);

            // Add List Container
            $( ".stream-chat" ).prepend(
                 `<div class="card" id="list-container">
                    <div class="card-header">
                        <span id="list-container-move">Addy Droplist <span id="count"></span></span>
                        <div class="btn-close-wrapper">
                        <button type="button" class="btn btn-close" aria-label="Close">
                        <svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 hcjcOH"><g><path d="M14.5 6.5L10 11 5.5 6.5 4 8l6 6 6-6-1.5-1.5z"></path></g></svg></button>
                        </div>
                    </div>
                    <div class="card-body" style="display: none;">
                        <div class="card-title mb-3 mt-0 pb-3">
                            <div class="input-group pe-3">
                                <input type="text" class="chat-wysiwyg-input__editor" id="username" placeholder="Twitch Username" value="${username}" autocomplete="off">
                                <button type="button" class="btn btn-save">Save</button>
                            </div>

                            <button type="button" class="Layout-sc-nxg1ff-0 tSgsW btn btn-shuffle" data-tippy-content="Shuffle" aria-label="Shuffle">
                            <svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1"><g><path d="M4 10a6 6 0 0110.472-4H13v2h5V3h-2v1.708A8 8 0 002 10h2zM7 14H5.528A6 6 0 0016 10h2a8 8 0 01-14 5.292V17H2v-5h5v2z"></path></g></svg>
                            </button>

                            <button type="button" class="Layout-sc-nxg1ff-0 tSgsW btn btn-export" data-tippy-content="Export" aria-label="Export">
                            <svg type="color-fill-current" width="20px" height="20px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScSvg-sc-1j5mt50-1 bESOCc"><g><path d="M12 4h2.586L9.293 9.293l1.414 1.414L16 5.414V8h2V2h-6v2z"></path><path d="M4 4h6v2H4v10h10v-6h2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"></path></g></svg>
                            </button>

                            <button type="button" class="Layout-sc-nxg1ff-0 tSgsW btn btn-delete" data-tippy-content="Delete" aria-label="Delete">
                                <svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 hcjcOH"><g><path d="M12 2H8v1H3v2h14V3h-5V2zM4 7v9a2 2 0 002 2h8a2 2 0 002-2V7h-2v9H6V7H4z"></path><path d="M11 7H9v7h2V7z"></path></g></svg>
                            </button>
                        </div>
                        <div class="dropList" id="dropList"></div>
                    </div>
                </div>`);

            // Load Addresses from localStorage
            loadList();

            // Make the List Container moveable:
            moveList();

            // Listen for username input enter key
            $('#username').keypress(function(e){
                if(e.keyCode == 13){
                    $(this).blur();
                    saveUsername();
                }
            });

            // Listener to save twitch username
            $('.btn-save').on('click', saveUsername);

            // Listen for Shuffle Button click
            $('.btn-shuffle').on('click', shuffleList);

            // Listen for Shuffle Button click
            $('.btn-export').on('click', exportList);

            // Listen for Delete Button click
            $('.btn-delete').on('click', deleteList);

            // Listen for Close Button click (Minimize Address List)
            $('.btn-close').on('click', function() {
                if($('.card-body').is(':visible')){
                    $('.card-body').fadeOut();
                    $(this).html('<svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 hcjcOH"><g><path d="M14.5 6.5L10 11 5.5 6.5 4 8l6 6 6-6-1.5-1.5z"></path></g></svg>');
                }
                else {
                    $('.card-body').fadeIn();
                    $(this).html('<svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 hcjcOH"><g><path d="M5.5 13.5L10 9l4.5 4.5L16 12l-6-6-6 6 1.5 1.5z"></path></g></svg>');
                }
            });

            // Listen for button tooltips
            tippy('[data-tippy-content]', {
                theme: 'light',
                delay: [500, 0]
            });
        }
    }

function saveUsername(){

    // Save new username
    localStorage.setItem('username', $("#username").val().toLowerCase() );

    // Add copied class
    $('.btn-save').addClass('copied');

    // Remove copied class
    setTimeout( function(e){ $('.btn-save').removeClass('copied') } ,500);

    // Remove all .address divs
    $('div.address').each(function(){
        $(this).fadeOut('slow',function(){$(this).remove()});
    });

    // Reload List
    loadList();

}

function newAddress(user, address){


    // New address
    let newAddress = address.toLowerCase();

    // Get username
    let username = localStorage.getItem('username');

    // Get List
    let list = localStorage.getItem(username+'addyDroplist');

    // If list exist
    list = (list) ? JSON.parse(list) : [];
    // Add new address to list

    if(!list.filter(p => p.address == newAddress).length){
        //list.push(newAddress);
        list.push({'user':user, 'address': newAddress});

        // Add new address div
        if(!$('#'+newAddress).length){
            $('.dropList').append(`
                <div class="address" id="${newAddress}">
                    <button class="btn btn-copy" data-clipboard-text="${newAddress}">
                    <span>${user}:</span><span class="userAddress ms-3">${newAddress}</span></button>
                </div>
            `);
        }

        // Update address count
        $('#count').html('('+list.length+')');

        // Update localStorage list
        localStorage.setItem(username+'addyDroplist',JSON.stringify(list));

        // Listener for copy button
        $('button.btn-copy').off();
        $('button.btn-copy').on('click', copyAddress);
    }
}

function copyAddress(){

    var elem = $(this).attr("data-clipboard-text");
    var id = '#'+elem+' button.btn-copy';
    let inner = $(id).html();

    var clipboard = new ClipboardJS('.btn-copy');
    clipboard.on('success', function (e) {
        $(id).addClass( "copied" );
        $(id).html('Copied to clipboard!');
        setTimeout( function(){
            $(id).html(inner);
            clipboard.destroy();
        },800);
    });
}

function moveList() {
    let startX =0, startY = 0, endX = 0, endY = 0;

    $('#list-container-move').mousedown(function(e){

        // Add move class
        $('#list-container').addClass('move');
        $('#list-container div.card-body').css('width', '340px');

        // Start position
        startX = e.clientX;
        startY = e.clientY;

        // Move Div
        $(document).mousemove( function(e){

            e = e || window.event;
            e.preventDefault();

            endX = startX - e.clientX;
            endY = startY - e.clientY;
            startX = e.clientX;
            startY = e.clientY;

            let pos = $('#list-container').position();

            // Set the Div's new position:
            $('#list-container').css({'left': (pos.left - endX) + 'px', 'top': (pos.top - endY) + 'px'});
        });

        // Stop moving when mouse button is released
        $(document).mouseup(function() {
            $(document).off("mousemove");
            $('.card-header').css('text-align', 'left');
        });

    });
}

function loadList(){

    // Get username
    let username = localStorage.getItem('username');

    // Get List
    let list = localStorage.getItem(username+'addyDroplist');

    // If list exist
    if(list){
        // JSON Decode list
        list = JSON.parse(list);
        // Foreach address
        for(let i = 0 ; i < list.length; i++) {
            $('.dropList').append(`
                <div class="address" id="${list[i]['address']}">
                    <button class="btn btn-copy" data-clipboard-text="${list[i]['address']}">
                    <span>${list[i]['user']}:</span><span class="userAddress ms-3">${list[i]['address']}</span></button>
                </div>
            `);
        }

        // Update address count
        $('#count').html('('+list.length+')');

    }

    // Listener for copy button
    $('button.btn-copy').on('click', copyAddress);
}

function exportList(){

    // Get username
    const username = localStorage.getItem('username');

    // Get List
    let list = localStorage.getItem(username+'addyDroplist');
    
    // If list exist
    if(list){
        // JSON Decode list
        list = JSON.parse(list);
        let rows = '';

        // Foreach address
        for(let i = 0 ; i < list.length; i++) {
            rows += '<tr><td>'+list[i]['user']+'</td><td>'+list[i]['address']+'</td></tr>';
        }


        // Create window and append list
        var a = window.open('', '', 'height=600, width=800');
            a.document.write(`
                <!doctype html>
                    <html lang="en">
                        <head>
                            <!-- Required meta tags -->
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">

                            <!-- Bootstrap CSS -->
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

                            <title>Twitch Addy Droplist</title>
                        </head>

                        <body>
                            <div class="container">
                                <div class="row">

                                    <h1>Twitch Addy Droplist</h1>

                                    <table class="table table-small table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Username</th>
                                                <th scope="col">Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${rows}
                                        </tbody>
                                    </table>

                                </div>
                            </div>

                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
                        </body>
                    </html>
            `);
            a.document.close();

    }
}

function shuffleList() {

    // Remove all copied class
    $('button.btn-copy').removeClass( 'copied' );

    // Shuffle List
    $('.dropList').html(
        $('.dropList').children().sort(
            function() {
                return 0.5 - Math.random();
            })
    );

    // Add copy button listener
    $('.btn-copy').on('click', copyAddress);
}

function deleteList(){
    // Verify user wants to delete
    if (window.confirm("Are you sure you want to delete list?")) {

        // Get username
        let username = localStorage.getItem('username');

        // Remove list from local storage
        localStorage.removeItem(username+'addyDroplist');

        // Remove all .address divs
        $(".address").each(function(){
            $(this).fadeOut('slow',function(){$(this).remove()});
        });

        // Update address count
        $('#count').html('');
    }
}