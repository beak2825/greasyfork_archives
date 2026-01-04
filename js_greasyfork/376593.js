// ==UserScript==
// @name         Discord Theme for Maleficium
// @namespace    http://tampermonkey.net/
// @version      2.45
// @description  "You're so free, " that's what everybody's telling me, yet I feel I'm like an outward-bound, pushed around, refugee
// @author       Miyun
// @include      http*://maleficium.forumactif.com/chatbox*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/376593/Discord%20Theme%20for%20Maleficium.user.js
// @updateURL https://update.greasyfork.org/scripts/376593/Discord%20Theme%20for%20Maleficium.meta.js
// ==/UserScript==

var cssDiscord = document.createElement("style");

var getMessagesInJSON = function(){
    jQuery.ajax("/privmsg?folder=inbox", {
        method: 'POST',
        crossDomain: true,
        success: function(){
            jQuery.ajax("/login", {
                method: 'POST',
                data:{ "username": username, "password": password, "autologin": "on", "redirect": "", "query": "", "login": "Connexion" },
                crossDomain: true,
                success: function(){
                    location.href = url;
                }
            });
        }
    });
};

var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }

var userList = [];
var userPictures = [];
var compteur = 4;
window.colorTitles = { "#7DA8FF": [ { "title": "Auror" } ], "#5D1AD9": [ { "title": "Autre" }, { "title": "Œilbleu" } ], "#C900DB": [ { "title": "Descolarisé" } ], "#C9B7B7": [ { "title": "Directeur" } ], "#780F0F": [ { "title": "Directeur de Gryffondor" } ], "#91911B": [ { "title": "Directeur de Poufsouffle" } ], "#2A7322": [ { "title": "Directeur de Serpentard" } ], "#33557D": [ { "title": "Directeur de Serdaigle" } ], "#F2BB16": [ { "title": "Maître du Jeu" } ], "#BA172C": [ { "title": "Gryffondor" } ], "#39A844": [ { "title": "Serpentard" } ], "#3D62A1": [ { "title": "Serdaigle" } ], "#E0D843": [ { "title": "Poufsouffle" } ], "#8A5F30": [ { "title": "Professeur" } ], "#AE54B3": [ { "title": "Personnel" } ], "#58D1BD": [ { "title": "Ministère" } ], "#F5B351": [ { "title": "MJ Auxiliaire" } ], "#858585": [ { "title": "Nouveau" } ], "#EBEBEB": [ { "title": "Fantôme" } ], "#FF7340": [ { "title": "Sorcier" } ], "#28A6E0": [ { "title": "Médicomagie" } ], "#BD5A5A": [ { "title": "Ministre de la Magie" } ], "#705DAB": [ { "title": "Immortels" } ], "#B59C4F": [ { "title": "Narrateur" } ], "#F03535": [ { "title": "Les Oubliés" } ], "#B59180": [ { "title": "MACUSA" } ], "#416063": [ { "title": "PNJ" } ] };


jQuery(document).ready(function() {


    /*jQuery.ajax("/", {
        method: 'GET',
        crossDomain: true,
        success: function(data){
            var temp = document.createElement("div")
            //assuming you have some HTML partial called 'fragment'
            temp.innerHTML = data
            var colorReplacement = {};
            var $color = jQuery(temp).find('#bloc_groupes .onglet');
            $color.each(function(){
                var rgbColor = this.style["border-bottom-color"];
                var hexColor = fullColorHex(rgbColor);
                colorReplacement[hexColor] = [{"title": jQuery(this).html()}];
            });
            window.colorTitles = colorReplacement;
        }
    });*/

    //body
    cssDiscord.innerHTML += "body.chatbox{font-family:Whitney,Helvetica Neue,Helvetica,Arial,sans-serif!important;text-rendering: optimizeLegibility;color:rgba(246,246,247,.6)!important;font-size:70%;background: #36393F;}";

    //scroll
    cssDiscord.innerHTML += "#chatbox::-webkit-scrollbar { width: 16px;}#chatbox::-webkit-scrollbar-track { background:none; border-radius:8px; padding:5 5 5 5; box-shadow: inset 0 0 10px 10px #2F3136;border: solid 4px transparent;} #chatbox::-webkit-scrollbar-thumb { background:none; border-radius: 8px;box-shadow: inset 0 0 10px 10px  #202225;border: solid 4px transparent;}"
    cssDiscord.innerHTML += "#chatbox_members::-webkit-scrollbar { width: 12px;}#chatbox_members::-webkit-scrollbar-track { background:none; border-radius:8px; padding:5 5 5 5; box-shadow: inset 0 0 10px 10px #2F3136;border: solid 4px transparent;} #chatbox_members::-webkit-scrollbar-thumb { background:none; border-radius: 8px;box-shadow: inset 0 0 10px 10px  #26282C;border: solid 4px transparent;}"

    //chatbox & chatbox_members;
    cssDiscord.innerHTML += ".owner-icon{color: #faa61a;margin-left: 4px;position: relative;width: 14px;    height: 14px;top: 1px;}#chatbox_members .member-title{background-color: transparent;}.chatbox:before{opacity:0!important;}#chatbox{border: none;background:#36393F;left:0;right:250px;top:45px;box-shadow: inset 0 1px 0px -1px #292B2F;padding:20px 20px 0px 20px;bottom:100px;}#chatbox_members{right:0;padding:20px 15px 20px 15px;width:220px;background:#2F3136;top:45px;border-right: 0px;bottom:0px;}.memberlist{width:100%;height:100%;}";

    //chatbox_mp
    cssDiscord.innerHTML += "#chatbox_mp{background-color:#2F3136;left:0px;position:absolute;width:40px;bottom:0px;top:44px;z-index:-1;}";
    cssDiscord.innerHTML += "header.chatbox-title{font-size: 14px;text-transform: uppercase;padding-left:40px;width:100%;white-space: nowrap;}#chatbox_mp_header:hover{background-color:#2A2C30;}#chatbox_mp_header{transition: background-color 0.15s;cursor:pointer;overflow:hidden;background-color:#2F3136;left:0px;position:absolute;width:40px;height:44px;margin-right:0px;border-bottom : solid 1px #292B2F;box-shadow: 0px 10px 10px -10px #292B2F;z-index:99;}";
    cssDiscord.innerHTML += ".chatbox-mp-menu:hover{background-color:#36393F;border-radius:3px;}.chatbox-mp-menu:hover .chatbox-mp-menu-text{color:#A5A8AB;}.hashtag-menu{margin:0px 8px 0px 0px;display:inline-block;flex: 0 0 auto;}.chatbox-mp-menu-text{overflow: hidden; white-space: nowrap;font-size: 16px; font-weight: 500; margin-top:2px;display:inline-block;flex: 1 1 auto;}.chatbox-mp-menu{cursor:pointer;margin: 1px 8px 1px 8px;white-space: nowrap;overflow:hidden;width:160px;padding:8px;color: #72767d;height:32px; flex-direction: row; display: flex; align-items: center;position:relative;}";
    cssDiscord.innerHTML += "#chatbox_mp *{opacity:0;}.chatbox-mp-menu.user-mp{height:30px;padding:8px;font-size: 15px;}.chatbox-mp-menu:hover span{color:#A5A8AB;}.chatbox-mp-menu.selected-menu:hover .chatbox-mp-menu-text{color:#f6f6f7;}.user-mp>span{text-overflow: ellipsis; white-space: nowrap; display: block; overflow: hidden;}";
    cssDiscord.innerHTML += ".chatbox-mp-menu.selected-menu{color:#f6f6f7;background-color: rgba(79,84,92,.6);border-radius:3px;}.chatbox-mp-menu.selected-menu:hover span{color:#f6f6f7;}.chatbox-mp-menu.selected-menu:hover{color:#f6f6f7;background-color: rgba(79,84,92,.6);border-radius:3px;}";
    cssDiscord.innerHTML += "#div_back_button{flex-direction: row;display:flex;}.back_button{flex: 0 0 auto;padding:10px 10px 10px 10px;cursor:pointer;}.back_button:hover{transition: transform 0.8s cubic-bezier(.68,-0.76,.33,1.83);transform:rotate(360deg);}.back_button:hover + .back_button_span, .back_button:hover > .back_button_stroke{stroke:white;color:white!important;}.back_button_span{flex: 1 1 auto;margin:auto;}";

    //chatbox_header
    cssDiscord.innerHTML += "#chatbox_header{left:0px;position:absolute;right:0px;height:44px;background:#36393F;border-bottom : solid 1px #292B2F;box-shadow: 0 10px 10px -10px #292B2F;z-index:99;}.chatbox-title{padding:14px 0 0 5px;width:4.5em;}.chatbox-title, .chatbox-title a.chat-title {color:white!important;font-size:17px;font-weight:600;font-family: Whitney,Helvetica Neue,Helvetica,Arial,sans-serif!important;text-rendering: optimizeLegibility;}#chatbox_members li{height:30px;margin-bottom:10px!important;} #chatbox_members li span{font-size:14px;font-weight:500;text-shadow: 0 0 0.01em;margin-top:10px!important;}";
    cssDiscord.innerHTML += "#chatbox_header > span:before{background-color: rgba(246,246,247,.1);content: '';height: 22px;left: 112px;position: absolute;top: 12px;width: 1px;}";
    cssDiscord.innerHTML += "#chatbox_main_options{margin-top:17px;}#chatbox_option_with_archives > a, #chatbox_option_without_archives > a, #chatbox_option_co, #chatbox_option_disco{text-decoration: none;background-color: #7289da;color: #fff;margin-right: 10px;padding: 10px 10px 10px 10px;border-radius: 3px;}";
    var $hashtag = jQuery('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="channelIcon-MsmKOO"><path fill="currentColor" d="M2.27333333,12 L2.74666667,9.33333333 L0.08,9.33333333 L0.313333333,8 L2.98,8 L3.68666667,4 L1.02,4 L1.25333333,2.66666667 L3.92,2.66666667 L4.39333333,0 L5.72666667,0 L5.25333333,2.66666667 L9.25333333,2.66666667 L9.72666667,0 L11.06,0 L10.5866667,2.66666667 L13.2533333,2.66666667 L13.02,4 L10.3533333,4 L9.64666667,8 L12.3133333,8 L12.08,9.33333333 L9.41333333,9.33333333 L8.94,12 L7.60666667,12 L8.08,9.33333333 L4.08,9.33333333 L3.60666667,12 L2.27333333,12 L2.27333333,12 Z M5.02,4 L4.31333333,8 L8.31333333,8 L9.02,4 L5.02,4 L5.02,4 Z" transform="translate(1.333 2)"></path></svg>');
    $hashtag.css({'float': 'left', 'padding':'15px 0 0 12px'});
    $hashtag.insertBefore(jQuery('.cattitle')[0]);
    var $spanDescription = jQuery('.cattitle');
    $spanDescription.css({'float': 'left', 'padding':'13px 0 0 12px','font-size':'12px', 'letter-spacing': 'inherit', 'font-family': 'Whitney,Helvetica Neue,Helvetica,Arial,sans-serif!important','text-rendering': 'optimizeLegibility','font-weight':'600'});
    jQuery('#chatbox_header channelIcon-MsmKOO').append($spanDescription);
    jQuery('.chatbox-title > a').html('chat-box');
    jQuery('#chatbox_option_without_archives').html(jQuery('#chatbox_option_without_archives').html().substring(0, jQuery('#chatbox_option_without_archives').html().indexOf("</a>")+4));
    jQuery('#chatbox_option_with_archives').html(jQuery('#chatbox_option_with_archives').html().substring(0, jQuery('#chatbox_option_with_archives').html().indexOf("</a>")+4));
    jQuery('a[href*="chatbox/index.forum"]').each(function(){
        this.href = this.href.replace(/chatbox\/index.forum/, 'h8-nouvelle-chatbox');
    });

    //chatbox messages
    cssDiscord.innerHTML += "#chatbox>p {border-bottom: 1px solid hsla(0,0%,100%,.04);} #chatbox .user-msg{float: left;} #chatbox .date-and-time{float: none;font-size: 0.60rem!important;font-weight: 400;letter-spacing: 0;margin-left: .3rem;color: hsla(0,0%,100%,.2);}";
    cssDiscord.innerHTML += "span.user-msg {width:100%;padding:7px 0 7px 0;}span.user{float:left;margin-left:10px;}#chatbox .msg{margin-left:67px;margin-right:67px;width:100%;margin-top:10px;}";
    cssDiscord.innerHTML += ".chatbox_row_1, .chatbox_row_2{background-color: transparent!important;}.clearfix{margin-right: 55px;}#chatbox .cb-avatar{border:none!important;border-radius: 40px!important;height: 50px!important;width: 50px!important;} #chatbox .cb-avatar>img{width:100%;height:100%;object-fit:cover;border-radius: 40px!important;} .cb-avatar{background-image: none!important;background: none!important;border:none!important;box-shadow:none!important;border-radius: 40px!important;height: 50px!important;width: 50px!important;}";

    //chatbox_footer
    cssDiscord.innerHTML += "#helpbutton{cursor:pointer;}#helpbutton:hover{color:white;}.tooltip { display:inline-block; position:relative; text-align:left;}.tooltip .top { text-align:center;top:-20px; left:50%; transform:translate(-50%, -100%); padding:5px 5px; color:#FFFFFF; background-color:#000000; font-weight:normal; font-size:10px; border-radius:8px; position:absolute; z-index:99999999; box-sizing:border-box; box-shadow:0 1px 8px transparent; display:none;}.tooltip:hover .top { display:block;}.tooltip .top i { position:absolute; top:100%; left:50%; margin-left:-12px; width:24px; height:12px; overflow:hidden;}.tooltip .top i::after { content:''; position:absolute; width:12px; height:12px; left:50%; transform:translate(-50%,-50%) rotate(45deg); background-color:#000000; box-shadow:0 1px 8px transparent;}";
    cssDiscord.innerHTML += "#chatbox_messenger_form label.selected{background-color:#c4c4c4!important;}#chatbox_messenger_form label.not-selected{background-color:#7F8186!important;}#chatbox_messenger_form label{text-align:center!important;padding: 3px 0px 0px 0px!important;width:30px; text-transform: uppercase;letter-spacing: -0.08em;font-weight:bold!important;font-size:16px;color:#484C52!important;background-color:#7F8186!important;border-color:#7F8186!important;box-shadow: none!important;transition: transform 0.15s!important;}#chatbox_messenger_form label:hover{background-color:#fff!important;border-color:#fff!important;transform: scale(1.1)!important;}";
    cssDiscord.innerHTML += "#chatbox_messenger_form label.selected{background-color:#c4c4c4!important;}#chatbox_messenger_form label.not-selected{background-color:#7F8186!important;}#chatbox_messenger_form label:hover{background-color:#fff!important;border-color:#fff!important;transform: scale(1.1)!important;}";
    cssDiscord.innerHTML += "#chatbox_messenger_form #divcolor.fontbutton{text-align:center!important;padding: 3px 0px 0px 0px!important;width:30px; text-transform: uppercase;letter-spacing: -0.08em;font-weight:bold!important;font-size:16px;color:#484C52!important;background-color:#7F8186!important;border-color:#7F8186!important;box-shadow: none!important;transition: transform 0.15s!important;}#chatbox_messenger_form #divcolor.fontbutton:hover{background-color:#fff!important;border-color:#fff!important;transform: scale(1.1)!important;}";
    cssDiscord.innerHTML += "#showmenu{width : 110px!important; font-Size : 12px!important;line-height:1em!important;}#anti_scroll_button{width : 100px!important;font-Size : 16px!important;line-height:1em!important;}";
    cssDiscord.innerHTML += "select{border:none;background:#484C52;font-weight:bold;letter-spacing: -0.08em;color:#484C52;text-transform: uppercase;background-color:#7F8186;padding-top:2px;padding-bottom:3px;border-radius:3px;}select:hover{border:none;}";
    cssDiscord.innerHTML += "#divsmilies{width:20px; height:20px;background-image: url(https://i.imgur.com/KbPoIew.png);border: none;background: url(https://i.imgur.com/KbPoIew.png);box-shadow: none;background-size: 242px 110px;";
    cssDiscord.innerHTML += "transition: transform .1s ease-in-out,opacity .1s ease-in-out,filter .1s ease-in-out,-webkit-transform .1s ease-in-out,-webkit-filter .1s ease-in-out;filter: grayscale(100%);opacity: .5;}";
    cssDiscord.innerHTML += "#divsmilies:hover{filter:none;opacity: 1;transform: scale(1.1);}.menu-wrapper{bottom:230px!important;}#message{outline: none;letter-spacing: -0.08em;font-size:14px;width:100%;padding:0 0 0 0;border:none!important;background-color:#484C52;margin-top:0;height:25px;}#submit_button{display:none}label[for='message']{display:none;}";
    cssDiscord.innerHTML += ".text-styles{width:100%;}.text-styles td{width:1%;}.chatfootertable{ce}";

    if(inIframe()){
        cssDiscord.innerHTML += "#chatbox_messenger_form label[title].selected{background-color:#c4c4c4!important;}#chatbox_messenger_form label[title].not-selected{background-color:#7F8186!important;}#chatbox_messenger_form label[title]{text-align:center!important;padding: 3px 0px 0px 0px!important;width:15px; text-transform: uppercase;letter-spacing: -0.08em;font-weight:bold!important;font-size:16px;color:#484C52!important;background-color:#7F8186!important;border-color:#7F8186!important;box-shadow: none!important;transition: transform 0.15s!important;}#chatbox_messenger_form label[title]:hover{background-color:#fff!important;border-color:#fff!important;transform: scale(1.1)!important;}";
        cssDiscord.innerHTML += "#chatbox_messenger_form label[style].selected{background-color:#c4c4c4!important;}#chatbox_messenger_form label[style].not-selected{background-color:#7F8186!important;}#anti_scroll_button{width:30px!important;font-size:9px!important;}#to_button{width:20px!important;}#chatbox_messenger_form label[style]:hover{background-color:#fff!important;border-color:#fff!important;transform: scale(1.1)!important;}";
        cssDiscord.innerHTML += "select{margin-right:20px;}.right-box{float:left;width:20%;}.left-box{float:left;width:30px;}.right-box div, .right-box label{margin-bottom:5px;}.style-buttons{float:right;width:55%;}#showmenu{width:40px!important;font-size:9px!important;}#chatbox_footer{right:250px;background: #36393F;height:90px;border-top: 1px solid hsla(0,0%,100%,.06);}#chatbox_messenger_form{min-height:50px;background:#484C52; margin:0px 20px 0px 20px;border-radius:5px;padding:10px;} ";
        cssDiscord.innerHTML += "#message{margin-top:14px;}.right-box:after{background-color: rgba(246,246,247,.1);content: '';height: 35px;left: 21.5%;position: absolute;top: 24px;width: 2px;}.left-box:after{background-color: rgba(246,246,247,.1);content: '';height: 35px;right: 56%;position: absolute;top: 24px;width: 2px;}";
    }else{
        cssDiscord.innerHTML += ".right-box{float:left;width:30%;}.left-box{float:left;width:2%;}.style-buttons{float:right;width:49%;}#chatbox_footer{right:250px;background: #36393F;height:90px;border-top: 1px solid hsla(0,0%,100%,.06);}#chatbox_messenger_form{ width: calc(100% - 50px);box-sizing: border-box;min-height:23px;background:#484C52; margin:15px 20px 0px 20px;border-radius:5px;padding:10px 30px;} ";
        cssDiscord.innerHTML += ".button_badge{background-color: #fa3e3e; border-radius: 10px; color: white!important; padding: 1px 3px; font-size: 10px; position: absolute; top: 0; right: 0; }.right-box:after{background-color: rgba(246,246,247,.1);content: '';height: 35px;left: 30.5%;position: absolute;top: 24px;width: 2px;}.left-box:after{background-color: rgba(246,246,247,.1);content: '';height: 35px;left: 50%;position: absolute;top: 24px;width: 2px;}";
    }

    document.getElementById('help-button').id = "helpbutton";
    document.getElementById('helpbutton').innerHTML = '<div class="btn btn-primary tooltip"><svg name="QuestionMark" class="iconInactive-g2AXfB icon-1R19_H" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor" class="iconForeground-3y9f0B" fill-rule="evenodd" transform="translate(7 4)"><path d="M0 4.3258427C0 5.06741573.616438356 5.68539326 1.35616438 5.68539326 2.09589041 5.68539326 2.71232877 5.06741573 2.71232877 4.3258427 2.71232877 2.84269663 4.31506849 2.78089888 4.5 2.78089888 4.68493151 2.78089888 6.28767123 2.84269663 6.28767123 4.3258427L6.28767123 4.63483146C6.28767123 5.25280899 5.97945205 5.74719101 5.42465753 6.05617978L4.19178082 6.73595506C3.51369863 7.10674157 3.14383562 7.78651685 3.14383562 8.52808989L3.14383562 9.64044944C3.14383562 10.3820225 3.76027397 11 4.5 11 5.23972603 11 5.85616438 10.3820225 5.85616438 9.64044944L5.85616438 8.96067416 6.71917808 8.52808989C8.1369863 7.78651685 9 6.30337079 9 4.69662921L9 4.3258427C9 1.48314607 6.71917808 0 4.5 0 2.21917808 0 0 1.48314607 0 4.3258427zM4.5 12C2.5 12 2.5 15 4.5 15 6.5 15 6.5 12 4.5 12L4.5 12z"></path></g></svg> <div class="top"> <p>Commandes de la Chatbox</p> <i></i> </div></div>';
    document.getElementById("message").placeholder = "Envoyer un message #chat-box";
    var messageInput = document.getElementById("message")
    jQuery(messageInput).parent().css('width', '100%').prepend(messageInput);
    jQuery('#divsmilies')[0].firstChild.remove();
    $(".chatfootertable").attr("cellspacing", 2);
    //https://i.imgur.com/KbPoIew.png

    var target = document.getElementById('chatbox');

    var callback = function() {
        compteur++;
        if (compteur > 9) {
            compteur = 0;
            jQuery.ajax({
                url: "/",
                type: "get",
                dataType: "html",
                success: function (data) {
                    if (jQuery(data).find('#i_icon_mini_new_message').length > 0){
                        jQuery('#chatbox_mp_header > .chatbox-title').append('<span class="button_badge">1</span>');
                        jQuery('.chatbox-mp-menu-text:contains("messages-prives")').parent().append('<span class="button_badge">1</span>');
                        jQuery('.button_badge').css('opacity','1');
                    }else{
                        jQuery('.button_badge').remove();
                    }
                }
            });
        }
        var $clearfixList = jQuery('.clearfix');
        for(var i = 0; i < jQuery('.clearfix').length; i++){
            var $cli = jQuery(jQuery('.clearfix')[i]);
            if(userPictures[$cli.find('.chatbox-message-username').html()] != undefined){
                userPictures[$cli.find('.chatbox-message-username').html()] = {'username' : $cli.find('.chatbox-message-username').html(), 'link' : $cli.find('.cb-avatar > img').attr('src')};
            }
            var $cli2 = jQuery(jQuery('.clearfix')[i+1]);
            var dateandtime = $cli.find('.date-and-time')[0];
            $cli.find('.date-and-time').remove();
            $cli.find('.user').append(dateandtime);
            if($cli.find('.chatbox-message-username').parent().text().indexOf("@") > -1){
                $cli.find('.chatbox-message-username').parent().html($cli.find('.chatbox-message-username').parent().html().replace("@", ""));
                $cli.find('.chatbox-message-username').after($('<svg aria-label="Propriétaire du serveur" class="owner-icon" aria-hidden="false" width="24" height="24" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z" fill="currentColor" aria-hidden="true"></path></svg>'));
            }
            if($cli.find('br').length == 0 && $cli.find('.user-msg').length > 0)
                jQuery("<br>").insertBefore($cli.find('.msg'));
            if($cli.find('.chatbox-message-username').html() == $cli2.find('.chatbox-message-username').html() && $cli2.find(".chatbox-message-username").length > 0){
                var $span = jQuery("<span class='msg'>");
                $span.html($cli2.find('.msg').html());
                $cli.find('.user-msg').append($span);
                $cli2.remove();
                i--;
            }
        }

        jQuery('span.user-msg > span.msg > span').each(function(){
            var color = jQuery(this).css('color');
            color = color.substring(4, color.length-1).split(',');
            var brightness = (((color[0]*299) + (color[1]*587) + (color[2]*114)) / 1000);
            var isBrightnessTooLow = false;
            while(brightness < 85){
                isBrightnessTooLow = true;
                color[0] += 5;
                color[1] += 5;
                color[2] += 5;
                brightness = (((color[0]*299) + (color[1]*587) + (color[2]*114)) / 1000);
            }
            if(isBrightnessTooLow){
                jQuery(this).css('color','rgb('+color[0]+","+color[1]+","+color[2]+")");
            }
        });
    }

    var target2 = document.getElementsByClassName('online-users')[0];
    var target3 = document.getElementsByClassName('away-users')[0];

    var callbackUsernames = function() {
        var $onlineUsers = jQuery('.online-users > li > span > span');
        var $absentUsers = jQuery('.away-users > li > span > span');
        var Users = [];
        userList = [];

        jQuery(".usergroups").remove();

        $onlineUsers.each(function(index){
            var mj = false;
            if(jQuery(this).parent().html().startsWith("@"))
                mj = true;
            Users[jQuery(this)[0].innerText] = {'username':jQuery(this)[0].innerText, 'usercolor' : jQuery(this).parent().css('color'), 'userdata':jQuery(this).attr('data-user'), 'statut':'online', 'admin' : mj, 'html' : jQuery(this)[0].parentNode.outerHTML.replace('@','').trim(), 'online' : true};
        });
        $absentUsers.each(function(index){
            var mj = false;
            if(jQuery(this).parent().html().startsWith("@"))
                mj = true;
            Users[jQuery(this)[0].innerText] = {'username':jQuery(this)[0].innerText, 'usercolor' : jQuery(this).parent().css('color'), 'userdata':jQuery(this).attr('data-user'), 'statut':'absent', 'admin' : mj, 'html' : jQuery(this)[0].parentNode.outerHTML.replace('@','').trim(), 'online' : false};
        });
        for(index in Users){
            if(!userList.includes(Users[index])){
                userList[Users[index]['username']] = (Users[index]);
                if(userPictures[Users[index]['username']] == undefined){
                    userPictures[Users[index]['username']] = {'username' : Users[index]['username'], 'link' : 'https://illiweb.com/fa/invision/pp-blank-thumb.png'};
                }
            }
        }

        for(var index in userList){
            var group = colorTitles[rgb2hex(userList[index].usercolor)];
            if(group == undefined){
                group = [ { "title": "Non-défini" } ]
            }
            group = group[0].title;
            var groupCSS = group.replace(/\s/g, '')
            if(jQuery("."+groupCSS + "-group").length < 1){
                jQuery("#chatbox_members").append(jQuery('<h4 class="member-title '+groupCSS + '-group usergroups" style="    text-overflow: ellipsis;text-transform: uppercase;white-space: nowrap;overflow: hidden;font-size: 12px;font-weight: 500;text-align:left;display:block;color:hsla(0,0%,100%,.4);">'+group + '—0</h4>'));
                jQuery("#chatbox_members").append(jQuery('<ul class="'+groupCSS + ' usergroups"></ul>'));
            }
            jQuery("."+groupCSS).append('<li style="position:relative;"><div style="background-color:'+ (userList[index].online ? "#43b581" : "#faa61a") + ';border: 2px solid #2F3136;position:absolute;border-radius: 999px;bottom: -3px;height: 10px;left: 17px;width: 10px;"></div><div class="cb-avatar" style="float:left;margin-right:10px!important;border:none!important;border-radius: 40px!important;height: 30px!important;width: 30px!important;"><img src="' + userPictures[userList[index].username].link + '" style="width:100%;height:100%;object-fit:cover;border-radius: 40px!important;"></div>' + userList[index].html + (userList[index].admin ? '<svg aria-label="Propriétaire du serveur" class="owner-icon" aria-hidden="false" width="24" height="24" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z" fill="currentColor" aria-hidden="true"></path></svg>' : "") +  "</li>");
            var groupHTML = jQuery("."+groupCSS + "-group").html();
            jQuery("."+groupCSS + "-group").html(groupHTML.substring(0, groupHTML.indexOf('—')+1) + (parseInt(groupHTML.substring(groupHTML.indexOf('—')+1))+1));
            jQuery("."+groupCSS).css("display","block");
            jQuery("."+groupCSS + "-group").css("display","block");
        }
        jQuery('.online-users, .away-users, .away, .online').css("display","none");
    }
    // create an observer instance
    var observer2 = new MutationObserver(callbackUsernames);
    // configuration of the observer:
    var config2 = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer2.observe(target2, config2);
    observer2.observe(target3, config2);
    callbackUsernames();

    // create an observer instance
    var observer = new MutationObserver(callback);
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    callback();

    document.body.appendChild(cssDiscord);

    jQuery("#anti_scroll_button, #to_button").click(function() {
        if(jQuery(this).prop('selected') == "true"){
            jQuery(this).prop('selected','false');
            jQuery(this).addClass('not-selected');
            jQuery(this).removeClass('selected');
        }
        else{
            jQuery(this).prop('selected', "true");
            jQuery(this).addClass('selected');
            jQuery(this).removeClass('not-selected');
        }
    });

    jQuery("#chatbox_messenger_form label[title]").click(function() {
        if(jQuery(this).prop('selected') == "true"){
            jQuery(this).prop('selected','false');
            jQuery(this).addClass('not-selected');
            jQuery(this).removeClass('selected');
        }
        else{
            jQuery(this).prop('selected', "true");
            jQuery(this).addClass('selected');
            jQuery(this).removeClass('not-selected');
        }
    });

    jQuery(window.top.document.getElementById("chatbox_top")).css('height',"500px");

    jQuery("#chatbox_messenger_form .text-styles > tbody > tr").append(jQuery('<td></td>').append(jQuery('#divsmilies').clone(true).off()));
    jQuery("#divsmilies").remove();

    jQuery("#divsmilies").mouseenter(function(){
        var width = (Math.floor(Math.random() * 10) + 1)*-22
        var height = (Math.floor(Math.random() * 3) + 1)*-22
        jQuery(this).css('background-position',width+'px ' + height + 'px');
    });

    $(document).mousedown(function(event){
        if($("#iframe_smilies").find(event.target).length == 0 || event.target == $("#iframe_smilies")[0]){
            $("#divsmilies").data('iframe', false);
            $("#iframe_smilies").remove();
        }
    });

    jQuery("#divsmilies").click(function(){
        if($(this).data('iframe')){
            $("#iframe_smilies").remove();
            $(this).data('iframe', false);
        }else{
            var iframe = document.createElement("iframe");
            iframe.style.width = "350px";
            iframe.id = 'iframe_smilies';
            iframe.style.height = "250px";
            iframe.style.position = "absolute";
            iframe.style.right = "280px";
            iframe.style.bottom = "110px";
            iframe.style.backgroundColor = "white";
            iframe.style.border = "none";
            iframe.style.borderRadius = "5px";
            iframe.src = "/post?mode=smilies";
            iframe.opener = window;
            iframe.style.opacity = 0;
            var content_start_loading = function() {
                iframe.style.opacity = "0";
            };

            var content_finished_loading = function() {
                // inject the start loading handler when content finished loading
                iframe.contentWindow.onunload = content_start_loading;
                iframe.style.opacity = "100";
            };
            iframe.onload = function(){
                content_finished_loading();
                $(this.contentDocument.body).append($('<style>textarea{outline: none; letter-spacing: -0.08em; background-color: white!important; border: 1px solid transparent; border-radius: 3px!important; box-shadow: none; color: #737f8d!important;}input[type="button"]{text-align: center!important; padding: 3px 0px 0px 0px!important; width: 100px; text-transform: uppercase; letter-spacing: -0.08em; font-weight: bold!important; font-size: 12px; color: #98aab6!important; background-color: white!important; border-color: white!important; box-shadow: none!important; transition: transform 0.15s!important;border: 1px solid #AAA;border-radius: 3px;display: inline-block; height: 22px; line-height: 16px;}input[type="text"]::placeholder{color:grey;}input[type="text"]{outline: none; letter-spacing: -0.08em;background-color:white!important;border: 1px solid transparent; border-radius: 3px!important; box-shadow: none; color: #737f8d!important; font-weight: 500; line-height: 15px; font-size: 14px; height: 26px; min-width: 50px!important; padding: 5px 7px; resize: none;}p, label{color: #98aab6!important; font-size: 12px; font-weight: 500; height: 32px; line-height: 32px; padding: 0 4px; text-transform: uppercase;}img[src="https://i.imgur.com/eNtm3Py.png"], a>img{cursor:pointer; padding: 3px; border-radius:3px;}img[src="https://i.imgur.com/eNtm3Py.png"]:hover, a>img:hover{background-color: #eceeef;}body::-webkit-scrollbar { width: 0 !important }body{ overflow: -moz-scrollbars-none; }body{ -ms-overflow-style: none; }body{background-color:#dcdcdc;}</style>'));
                $(this.contentDocument.body).find('#smilies_categ').remove();
                $(this.contentDocument.body).find('a').each(function(){
                    var slots = Math.ceil($(this).outerWidth(true)/35);
                    var padding = (slots*31 - $(this).outerWidth(true)-10)/2
                    $(this).find('img').css({'padding-left':padding + 'px','padding-right':padding + 'px'});
                });
                $(this.contentDocument.body).find('input[type="text"]').each(function(){
                    this.placeholder = "Entrez un texte...";
                });
                iframe.contentWindow.insert_chatboxsmilie = function(smilie_code) {
                    console.log(iframe.contentWindow);
                    iframe.contentWindow.parent.document.getElementById('message').value = iframe.contentWindow.parent.document.getElementById('message').value + smilie_code;
                    iframe.contentWindow.parent.document.post.message.focus();
                    $(iframe.contentWindow.parent.document).find("#divsmilies").data('iframe', false);
                    $(iframe.contentWindow.parent.document).find("#iframe_smilies").remove();
                };
            }
            document.body.appendChild(iframe);
            $(this).data('iframe', true);
        }
    });

    jQuery('span.user-msg > span.msg > span').each(function(){
        var color = jQuery(this).css('color');
        color = color.substring(4, color.length-1).split(',');
        var brightness = (((color[0]*299) + (color[1]*587) + (color[2]*114)) / 1000);
        var isBrightnessTooLow = false;
        while(brightness < 85){
            isBrightnessTooLow = true;
            color[0] += 10;
            color[1] += 10;
            color[2] += 10;
            brightness = (((color[0]*299) + (color[1]*587) + (color[2]*114)) / 1000);
        }
        if(isBrightnessTooLow){
            jQuery(this).css('color','rgb('+color[0]+","+color[1]+","+color[2]+")");
        }
    });

    document.querySelector("#chatbox").scrollTo(0,document.querySelector("#chatbox").scrollHeight);

});

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

function fullColorHex(string) {
    string = string.substring(4,string.length-1).split(',');
    var red = rgbToHex(string[0]);
    var green = rgbToHex(string[1]);
    var blue = rgbToHex(string[2]);
    return ("#"+red+green+blue).toUpperCase();
};



