// ==UserScript==
// @name         핸즈프렌드 플러스
// @namespace    http://tampermonkey.net/
// @version      2024-05-21
// @description  핸즈프렌드의 여러 기능들을 담았습니다
// @author       You
// @match        https://handsfriend.com/start
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThRRTXpGCVi8jgyBgGaK61x9u3woV3gPw24GcPg680WQ&s
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495594/%ED%95%B8%EC%A6%88%ED%94%84%EB%A0%8C%EB%93%9C%20%ED%94%8C%EB%9F%AC%EC%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/495594/%ED%95%B8%EC%A6%88%ED%94%84%EB%A0%8C%EB%93%9C%20%ED%94%8C%EB%9F%AC%EC%8A%A4.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var option_onoff = 0;


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : "";
    }

    function setCookie(name, value, options = {}) {

        options = {
            path: '/',
            // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }

    function clickban(name) {
        var banlist = getCookie("banlist").split(',');

        var inp = confirm("'"+name+"' 님을 차단하시겠습니까?");
        if(inp){
            banlist.push(name);
            setCookie("banlist", banlist)
        }
    }


    const banbuttonClickHandler = () =>{
        var banlist = getCookie("banlist").split(',');
        var text = "";
        if(banlist != ""){
            text = "***현재 차단 리스트***\n -"+banlist.slice(1).join("\n -")+"\n";
        }
        else{
            text ="***현재 차단 리스트***\n없음\n";
        }
        var inp = prompt(text+"\n추가할 사용자 이름을 입력하세요","");
        if(inp){
            banlist.push(inp);
            setCookie("banlist", banlist)
        }

    };

    const optionbuttonClickHandler = () =>{
        option_onoff = 1;

    };

    function clicknoban(i) {
        console.log(i);
        var banlist = getCookie("banlist").split(',');
        var inp = confirm("'"+banlist[i]+"' 님의 차단을 해제하시겠습니까?");
        if(inp){
            banlist.splice(i,1);
            setCookie("banlist", banlist)
            option_onoff = 1;
        }
    }

    function buttonban() {
        var banlist = getCookie("banlist").split(',');
        var inp = prompt("차단할 사용자 이름을 입력하세요","");
        if(inp){
            banlist.push(inp);
            setCookie("banlist", banlist)
            option_onoff = 1;
        }
    }




    const banbutton = document.createElement( "button" );
    banbutton.textContent = '차단';
    banbutton.className = 'banbutton';
    banbutton.onclick = banbuttonClickHandler;
    banbutton.style = 'position: relative;float: right; padding: 0px 5px; margin-top:8px;margin-right:15px;margin-bottom: 8px;height: 33px;background-color:transparent;border:1px solid transparent;border-radius: 4px;border-color: #ddd;';
    document.getElementsByClassName("navbar-header")[0].appendChild(banbutton);

    const usercount = document.createElement( "button" );
    usercount.innerText = '15명';
    usercount.className = 'usercount';
    usercount.style = 'color:#00c1f1; position: relative;float: right; padding: 5px 5px; margin-top:8px;margin-right:15px;margin-bottom: 8px;height: 33px;background-color:transparent;border:1px solid transparent;border-radius: 4px;border-color: #ddd;';
    document.getElementsByClassName("navbar-header")[0].appendChild(usercount);

    const optionbutton = document.createElement( "div" );
    optionbutton.className = 'start_items';

     optionbutton.innerHTML += '<div class="small_margin"></div>';

    const optionbutton_title = document.createElement( "span" );
    optionbutton_title.className = 'start_items_title';
    optionbutton_title.textContent = '✚ 차단 유저 관리';
    optionbutton.appendChild(optionbutton_title);

    const optionbutton_contant = document.createElement( "span" );
    optionbutton_contant.className = 'start_items_content';
    optionbutton_contant.textContent = '차단 유저를 해제하거나 추가할 수 있습니다';
    optionbutton.appendChild(optionbutton_contant);

    optionbutton.innerHTML += '<div class="small_margin"></div>';

    const start_items_btn = document.createElement( "div" );
    start_items_btn.className = 'start_items_btn';


    const optionbutton_button = document.createElement( "i" );
    optionbutton_button.className = 'fa fa-chevron-circle-right fa-3x';
    optionbutton_button.id="handsfriend_plus";
    optionbutton_button.ariaHidden="true";
    optionbutton_button.addEventListener('mousedown',optionbuttonClickHandler);
    start_items_btn.appendChild(optionbutton_button);

    optionbutton.appendChild(start_items_btn);


    function loop(){

        document.getElementsByClassName("usercount")[0].innerText = Number(document.getElementById("user_count").innerText.split(':')[1])+"명";
        document.getElementById("chat_field").maxLength = "1000000";

        if(option_onoff == 0){
            if(document.getElementById("custom_chat_list") != null){
                optionbutton.style.display = document.getElementsByClassName("start_items")[0].style.display;
                document.getElementById("chat_monitor").appendChild(optionbutton);
            }
        }
        else if(option_onoff == 1){
            var dum2 = document.getElementsByClassName("start_items");
            for(var i = 0;i<dum2.length;i++){
                dum2[i].style.display = "none";
            }
            document.getElementById("chat_monitor").innerHTML = "";
            const official_message = document.createElement( "div" );
            official_message.className = 'official_message_wrap';
            official_message.innerHTML = "<strong>차단 유저 관리</strong>";
            official_message.innerHTML += '<div class="small_margin"></div>';
            official_message.innerHTML += '차단 유저를 해제하거나 추가할 수 있습니다';
            official_message.innerHTML += '<div class="small_margin"></div>';
            official_message.innerHTML += '<button class="btn btn-handsfriend2 btn-sm" id = banbanbutton>추가하기</button>';
            official_message.innerHTML += '&nbsp; &nbsp;<button class="btn btn-handsfriend2 btn-sm back_to_main">돌아가기</button>';
            document.getElementById("chat_monitor").appendChild(official_message);

            var banlist2 = getCookie("banlist").split(',');
            if(banlist2 != ""){
                for (var i1 = 1;i1 < banlist2.length;i1++){
                    document.getElementById("chat_monitor").innerHTML += `<div class="custom_chat_room">  <div class="custom_chat_room_title_wrap">  - <strong>${banlist2[i1]}</strong></div>  <div class="custom_chat_room_clients_wrap" style = "cursor : pointer">X</div></div>`;
                    //document.getElementsByClassName("custom_chat_room_clients_wrap")[i1-1].onclick = () => clicknoban(i1-1);
                }
                for (var i2 = 0;i2 < document.getElementsByClassName("custom_chat_room_clients_wrap").length;i2++){
                    const a = new Number(i2+1);
                    document.getElementsByClassName("custom_chat_room_clients_wrap")[i2].onclick = () => clicknoban(a);
                }
            }
            document.getElementById("banbanbutton").onclick = () => buttonban();

            option_onoff = 0;
        }


        var dum = document.getElementsByClassName("msg_wrap");
        var banlist = getCookie("banlist").split(',');
        var nick = "";
        for (var j = 0; j < dum.length;j++){
            if(dum[j].firstChild.className == "msg_nickname_wrap"){
                nick = dum[j].getElementsByClassName("msg_nickname_wrap")[0].innerHTML;
            }
            if(dum[j].firstChild.className == "send_box"){
                nick = -1;
            }
            if(banlist.indexOf(nick) != -1){
                dum[j].style.display = "none";
                dum[j].getElementsByClassName("receive_box")[0].innerHTML = "";

            }
            if(nick != -1){
                const nick2 = new String(nick);
                dum[j].ondblclick = () => clickban(nick2);
            }
            if(dum[j].lastChild.innerText.slice(0,8) == "https://" && (dum[j].lastChild.innerText.slice(-4) == ".png" || dum[j].lastChild.innerText.slice(-5) == ".webp" || dum[j].lastChild.innerText.slice(-4) == ".jpg")){
                dum[j].lastChild.innerHTML = `<img src = '${dum[j].lastChild.innerText}' style = "width:100%">`;
            }
            if(dum[j].lastChild.innerText.slice(0,8) == "https://" && dum[j].lastChild.innerText.slice(-4) == ".mp4"){
                dum[j].lastChild.innerHTML = `<video src = '${dum[j].lastChild.innerText}' style = "width:100%" controls></video>`;
            }
            if(dum[j].lastChild.innerText.slice(0,17) == "https://youtu.be/"){
                dum[j].lastChild.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${dum[j].lastChild.innerText.slice(16)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
            }
        }

        var dum3 = document.getElementsByClassName("official_message_wrap");

        for (var j1 = 0; j1 < dum3.length;j1++){
            if(dum3[j1].innerText.indexOf('에 접속 했습니다.') != -1){
                if(banlist.indexOf(dum3[j1].getElementsByTagName("strong")[0].innerHTML) != -1){
                    dum3[j1].style.display = "none";
                }
                else{
                    while (dum3[j1].childElementCount != 2){
                        dum3[j1].removeChild(dum3[j1].lastChild);
                    }
                }
                const nick3 = new String(dum3[j1].getElementsByTagName("strong")[0].innerHTML);
                dum3[j1].ondblclick = () => clickban(nick3);
            }
            if(dum3[j1].innerText.indexOf('님이 채팅방을 떠났습니다.') != -1){
                if(banlist.indexOf(dum3[j1].firstChild.innerHTML) != -1){
                    dum3[j1].style.display = "none";
                }
                const nick4 = new String(dum3[j1].firstChild.innerHTML);
                dum3[j1].ondblclick = () => clickban(nick4);
            }

        }

        return setTimeout(loop,0);
    }




    loop();

})();

