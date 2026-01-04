// ==UserScript==
// @name         Drawaria.online Scripts Original (Reupload)
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  just a compilation of random scripts
// @match        https://*.drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @author       Jkhenz
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463549/Drawariaonline%20Scripts%20Original%20%28Reupload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463549/Drawariaonline%20Scripts%20Original%20%28Reupload%29.meta.js
// ==/UserScript==


(function ($, undefined) {
    $(function () {

        let curUrl = location.href;
        if(curUrl.includes('drawaria.online/avatar/builder')){

            //Avatar Builder
            let wait;
            Start();

            function Start(){
                wait = setInterval(function(){
                    if($('.Canvas').length === 1){
                        Avatar();
                        AvatarAlt();
                        StopWaiting();
                    }
                }, 200);
            }

            function StopWaiting(){
                clearInterval(wait);
            }

            function Avatar(){
                $('header').append('<label class="Button" for="image_input">Upload Image</label><input style="display:none" id="image_input" type="file" accept=".jfif, .jpg, .png">');
                let uploaded_image;
                $("#image_input").change(function() {
                    const reader = new FileReader();
                    if(this.files[0].size<7000000){
                        reader.addEventListener('load', function (){
                            uploaded_image = reader.result;
                            if(LOGGEDIN){
                                $.post("/saveavatar", {
                                    "avatarsave_builder":(`${JSON.stringify(ACCOUNT_AVATARSAVE)}`),
                                    "imagedata": (`${uploaded_image}`),
                                    "fromeditor": false
                                })
                            }else{
                                localStorage.setItem("avatarimagedata",(`${uploaded_image}`));
                                $.removeCookie('wt', { path: '/' });
                            }
                            $('label')[0].innerHTML = "Saving...";
                            setInterval(function(){
                                $('label')[0].innerHTML = "Save OK!";
                                let curUrl = window.location.href;
                                let domain = curUrl.replace("avatar/builder/","");
                                window.location.href = domain;
                            }, 2000);

                        });
                        reader.readAsDataURL(this.files[0]);
                    }
                    else{
                        alert("image file size is too large");
                    }
                });

            }
            function AvatarAlt(){
                $('.Canvas').append('<label for="image_input2" style="width:128px; height:128px; position:absolute; cursor:pointer" ><input style="display:none" id="image_input2" type="file" accept="image/*" >');

                let uploaded_image2;
                $("#image_input2").change(function() {
                    const reader = new FileReader();

                    reader.addEventListener('load', function (){
                        uploaded_image2 = reader.result;
                        imgChange(uploaded_image2);

                    });
                    reader.readAsDataURL(this.files[0]);

                });

            }
            function imgChange(imagePath) {
                var canvas=document.getElementsByClassName("main")[0];
                var ctx=canvas.getContext("2d");
                var img=new Image();
                img.onload = function(){

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img,0,0,canvas.width,canvas.width);
                };
                img.src=imagePath;
            }

        }else{
            let rightBar = $("#rightbar");
            $('<div id="assistPanel">').insertAfter(rightBar.children()[3]);

            //join in a room
            let joinRoomObserver = new MutationObserver(function(mutations) {
                if(mutations[0].target.textContent.includes('Word guessing')){
                    Status();
                    AutoStar();
                    WordHints();
                }else{
                    Token();
                    Status();

                }
                joinRoomObserver.disconnect();
            });
            joinRoomObserver.observe($('#infotext')[0], {childList: true });
        }

        //Token
        function Token(){
            let tokens = [
                {val : 'random', text: 'Random'},
                {val : 'fa-thumbs-up', text: 'Like'},
                {val : 'fa-heart', text: 'Heart'},
                {val : 'fa-paint-brush', text: 'Paint Brush'},
                {val : 'fa-cocktail', text: 'Cocktail'},
                {val : 'fa-hand-peace', text: 'Peace'},
                {val : 'fa-feather-alt', text: 'Feather'},
                {val : 'fa-trophy', text: 'Trophy'},
                {val : 'fa-mug-hot', text: 'Coffee'},
                {val : 'fa-gift', text: 'Gift'}
            ];
            $("#assistPanel").append('<div id="tokenPanel" style="margin-top:0.4rem; display: flex; flex-direction: column;"><button id="give">Give Token</button></div>');
            let tokenSel = $('<select id="selToken"style="width:100%">').prependTo("#tokenPanel");
            $(tokens).each(function() {
                tokenSel.append($("<option>").attr('value',this.val).text(this.text));
            });

            $("#give").click(function() {
                if($('#infotext').children()[0].textContent.includes("Word guessing")){
                    alert('not working in guessing game');
                    return;
                }
                GiveToken();
            });

            if(localStorage.getItem('lastToken')==null){
                localStorage.setItem('lastToken','random');
            }
            let selToken=$('#selToken')[0];
            selToken.value = localStorage.getItem('lastToken');

            function GiveToken(){
                if($('.playerlist-name-loggedin').length===0){
                    alert('no loggedin players to give token' );
                    return;
                }
                for(let i=0 ; i < $('.playerlist-name-loggedin').length;i++){
                    $('.playerlist-name-loggedin')[i].click();
                    if($('.playerlist-menu-playername')[i].textContent =="­­" || $('.playerlist-menu-playername')[i].textContent =="Liy Lalire" || selToken.value == "random"){
                        let arr=[];
                        for(let j =0; j<9;j++){
                            if($('.playerlist-tokens > .' + tokens [j+1].val)[i].innerHTML==''){
                                arr.push(0);
                            }else{
                                arr.push(parseInt($('.playerlist-tokens > .' + tokens [j+1].val)[i].innerHTML));
                            }
                        }
                        let min = Math.min.apply(Math, arr);
                        let ind = arr.indexOf(min);
                        $('.playerlist-tokens > .' + tokens[ind+1].val)[i].click();
                    }else{
                        $('.playerlist-tokens > .' + tokens[selToken.selectedIndex].val)[i].click();
                    }
                }
                localStorage.setItem('lastToken',selToken.value);
                $('.playerlist-menu-hidebutton').click();
                $("#give").prop("disabled",true);
                setTimeout(function(){ $("#give").prop("disabled",false) }, 300)
            }
        }

        //Status
        function Status(){
            let status = [
                {val : 0, text: 'Music Enabled'},
                {val : 1, text: 'AFK 1'},
                {val : 2, text: 'AFK 2'},
                {val : 3, text: 'Inventory Open'},
                {val : 4, text: 'Friend List Open'}
            ];

            $("#assistPanel").append('<div id="statusPanel" style="margin-top:0.4rem; display: flex; flex-direction: column;"><button id="togStats">Toggle Status</button><div id="toggleAll" style="display: flex; flex-direction: row;justify:center;"><button style="flex:1" id="addAll" >Add All</button><button  style="flex:1" id="remAll">Remove All</button></div></div>');

            let statusSel = $('<select id="selStat"style="width:100%">').prependTo("#statusPanel");
            $(status).each(function() {
                statusSel.append($("<option>").attr('value',this.val).text(this.text));
            });

            if(localStorage.getItem('lastStat')==null){
                localStorage.setItem('lastStat',0);
            }
            let selStat=$('#selStat')[0];
            selStat.value = localStorage.getItem('lastStat');

            $("#togStats").click(function() {
                localStorage.setItem('lastStat',selStat.value);
                ToggleStats($('#selStat').val());
            });

            $('#addAll').click(function() {
                AddAllStats(true);
            });
            $('#remAll').click(function() {
                AddAllStats(false);
            });

            function GetCurStats(){
                let allStats = ['fas fa-music', 'far fa-moon', 'fas fa-moon', 'fas fa-box', 'fas fa-user-friends'];
                let self = $('.playerlist-name-self')[0];
                let playerStats = self.nextElementSibling.childNodes[3].childNodes;
                let curStats=[];
                for(let i = 0;i< playerStats.length;i++){
                    curStats.push(allStats.indexOf(playerStats[i].className));
                }
                return curStats;
            }

            function AddAllStats(cond){
                let curStats=GetCurStats();
                for(let i=0;i<=4;i++){
                    if(curStats.includes(i)!=cond){
                        PLAYERFLAGS_INVENTORYOPEN=i;
                        $('.extmenu-button')[1].click();
                        $('.close')[6].click();
                    }
                }
                PLAYERFLAGS_INVENTORYOPEN=3;
            }

            function ToggleStats(statsNum){
                PLAYERFLAGS_INVENTORYOPEN=statsNum;
                $('.extmenu-button')[1].click();
                $('.close')[6].click();
                PLAYERFLAGS_INVENTORYOPEN=3;
            }
        }

        //Star Bot

        function AutoStar(){
            $("#assistPanel").append('<div id="autoStarPanel" style="margin-top:0.4rem; display: flex; flex-direction: column;"><button id="autoStar">Star Bot: Off</button></div>');

            $('#autoStar').click(function() {
                if( this.textContent=='Star Bot: On'){
                    this.textContent='Star Bot: Off';
                }
                else{
                    this.textContent='Star Bot: On';
                    $('.ratedrawerbox-button').click();
                }
            });

            let questionMarkObserver = new MutationObserver(function(mutations) {
                if($('#autoStar')[0].textContent=='Star Bot: On'){
                    $('.ratedrawerbox-button').click();
                }
            });
            questionMarkObserver.observe($('#targetword')[0], {attributes: true, attributeFilter:['style']});

        }

        //WordHints
        function WordHints(){
            (async () => {
                'use strict';

                const sendButton=document.getElementById('chatattop-sendbutton');
                const inputChat = document.getElementById('chatbox_textinput');
                const targetWord = document.getElementsByClassName("topbox-content-targetword")[1];
                const rightbar = document.getElementById('rightbar');

                const refreshDelay = 500;
                let wordList;
                let targetWordVal = '';
                let assistantPanel;
                let hintBox;

                const hintClick = (event) => {
                    const inputChatVal = inputChat.value;
                    inputChat.value = event.target.innerHTML;
                    sendButton.click();

                };

                const assist = (event, wordChanged = false) => {
                    let wordRegex = targetWord.textContent.replace(/_/g, '[^ \\-"]');
                    wordRegex = '"'.concat(wordRegex, '"');
                    wordRegex = new RegExp(wordRegex, 'g');

                    let hints = wordList.match(wordRegex);

                    if (!hints) {
                        hintBox.innerHTML = '<span style="color:black">Sorry, no hints available!</span>';
                        return;
                    } else {
                        hintBox.innerHTML = '<span style="color:black">Click on a hint to submit it: </span><br>';
                    }

                    hints = hints.map((hint) => {
                        return hint.substring(1, hint.length - 1);
                    });
                    hints = hints.sort((a, b) => {
                        return a.toLowerCase().localeCompare(b.toLowerCase());
                    });

                    const inputChatVal = inputChat.value;
                    const inputList = [];

                    hints.forEach((hint) => {

                        const hintSpan = document.createElement('a');
                        hintSpan.innerHTML = hint;
                        hintSpan.style.color = 'royalblue';
                        hintSpan.style.backgroundColor = "#FDFD8F";
                        hintSpan.href = 'javascript:void(0);';
                        hintSpan.onclick = hintClick;

                        if (!(inputChatVal && hint.toLowerCase().search(inputChatVal.toLowerCase()) !== -1 )) {
                            hintSpan.style.display= 'none';
                            inputList.push(hint);
                        }else{
                            hintBox.appendChild(hintSpan);
                            hintBox.appendChild(document.createTextNode(', '));
                        }
                    });
                    inputList.forEach((hint) => {
                        const hintSpan = document.createElement('a');
                        hintSpan.innerHTML = hint;
                        hintSpan.style.backgroundColor = 'none';
                        hintSpan.href = 'javascript:void(0);';
                        hintSpan.onclick = hintClick;
                        hintBox.appendChild(hintSpan);
                        hintBox.appendChild(document.createTextNode(', '));
                    });

                    hintBox.removeChild(hintBox.lastChild);

                };


                const initialize = async () => {

                    wordList = "https://api.npoint.io/fe8c64660af45e03961d";

                    try {
                        wordList = await fetch(wordList).then((response) => response.json());
                    } catch (e) {
                        await new Promise((resolve) => setTimeout(resolve, refreshDelay));
                        return initialize();
                    }

                    wordList = JSON.stringify(wordList);

                    wordList = wordList.substring(1, wordList.length - 1);

                    assistantPanel = document.createElement('p');

                    assistantPanel.style = `
        display: none;
        background: rgb(238, 238, 238);
        overflow-wrap: break-word;
        border-radius: 2px;
        border: 4px solid rgb(238, 238, 238);
        width: 100%;
        height: 100%;
        overflow-y: auto;
        color: rgb(57, 117, 206);
        margin: 8px 0 0 0;

    `;

                    hintBox = document.createElement('span');
                    assistantPanel.appendChild(hintBox);

                    rightbar.insertBefore(
                        assistantPanel,
                        rightbar.childNodes[3]
                    );

                    inputChat.onkeyup = assist;

                    setInterval(() => {

                        if(document.getElementById('targetword_tip').style.display == "none"){
                            assistantPanel.style.display = "none";
                            $("#assistPanel").show();
                        }else{
                            assistantPanel.style.display = "";
                            $("#assistPanel").hide();
                        }
                        if (
                            targetWord &&
                            targetWord.textContent.indexOf('_') !== -1
                        ) {
                            if (targetWordVal !== targetWord.textContent) {
                                hintBox.style.display = '';

                                assist(undefined, true);
                                targetWordVal = targetWord.textContent;
                            }
                        } else {
                            hintBox.style.display = 'none';
                            targetWordVal = '';

                        }
                    }, refreshDelay);
                };
                initialize();
            })();

        }

        //Delete likes data
        let regex = new RegExp('^r[0-9]');
        let keys = Object.keys(localStorage),
            len = keys.length;
        for(let i=0; i < len;i++){
            if(regex.test(keys[i])){
                if(keys[i].length==7){
                    localStorage.removeItem(keys[i]);
                }
            }
        }

        //remove limit in sticker size
        let launchStickerObserver = new MutationObserver(function(mutations) {
            for (let i=0, mutation; mutation = mutations[i]; i++) {
                if (mutation.attributeName == 'disabled') {
                    if (mutation.target.disabled) {
                        $('.fa-parachute-box').parent().prop("disabled",false);
                    }
                }
            };
        });
        launchStickerObserver.observe($('.fa-parachute-box').parent()[0], {attributes: true});

        //remove refresh list
        let refreshWordObserver = new MutationObserver(function(mutations) {
            for (let i=0, mutation; mutation = mutations[i]; i++) {
                if (mutation.attributeName == 'disabled') {
                    if (mutation.target.disabled) {
                        $('#wordchooser-refreshlist').prop("disabled",false);
                    }
                }
            };
        });
        refreshWordObserver.observe($('#wordchooser-refreshlist')[0], {attributes: true});


    });
})(window.jQuery.noConflict(true));