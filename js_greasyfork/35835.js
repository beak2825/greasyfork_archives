// ==UserScript==
// @name           Maleficium Chatbox Utility
// @description    Améliore l'expérience Chatbox pour Maleficium
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @version        6.30
// @include        http*://maleficium.forumactif.com/*
// @namespace      https://greasyfork.org/users/23836
// @connect-src    googleapis.com
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35835/Maleficium%20Chatbox%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/35835/Maleficium%20Chatbox%20Utility.meta.js
// ==/UserScript==


var timeout = document.createElement('label'),
    timeoutStyle = timeout.style;
var scrollbutton = document.createElement('label'),
    scrollStyle = scrollbutton.style;
var scrollType;
var interval;
var timeoutInterval;
var antiTimeoutOn = false;
var state = 0;
var speech;
var audio;
var called = 0;
var checkExist;
var scrollOn = true;
var userList = [];
var lastLetterDeleted = null;
var last_position = 0;
var alreadyTagged = [];
var linksVenef = [];
var postLink = [];

function start() {

    if (window.location.href.match('/post?')) {
        addSmileys();
    }

    if (window.location.href.match('chatbox')) {
        if (localStorage.getItem('smileys_first_time') !== "true"){
            var smileys_first_time = {};
            var arry = [];
            arry = GM_listValues();
            var p = arry.length;
            for (var i = 0; i < p-1; i=i+2) {
                smileys_first_time[GM_getValue(i+1)] = GM_getValue(i);
            }
            localStorage.setItem('smileys_first_time', "true");
            localStorage.setItem('smileysextend', JSON.stringify(smileys_first_time));
        }
        var smileys = {};
        if(isValidJson(localStorage.getItem('smileysextend'))){
          var smileyextend = JSON.parse(localStorage.getItem('smileysextend'));
          for (var key in smileyextend){
            smileys[key] = smileyextend[key];
          }
        }
        localStorage.setItem('smileysextend', JSON.stringify(smileys));

        jQuery(document.body).append(jQuery('<style>label.fontbutton{display: inline-block; height: 18px; border-radius: 3px; line-height: 16px; text-align: center; width: 18px;box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 1px 2px rgba(0,0,0,.05);border: 1px solid #aaa; background: #ecf3f7; color: #000!important;}</style>'));

        getStringFromInput();
        addAntiTimeoutButton();
        addScrollButton();
        addToggleButton();
        chatboxHandler();
    }

}

function chatboxHandler() {
    Chatbox.prototype.refresh = function(data) {
        if (data.error) {
            jQuery("body").html(data.error);
        } else {
            if (this.connected && !this.archives) {
                jQuery("#chatbox_footer").css('display', 'block');
                jQuery("#chatbox_messenger_form").css('display', 'block');
                jQuery("#chatbox_messenger_form").css('visibility', 'visible');
            } else {
                jQuery("#chatbox_footer").css('display', 'none');
                jQuery("#chatbox_messenger_form").css('display', 'none');
                jQuery("#chatbox_messenger_form").css('visibility', 'hidden');
            }
            if (this.connected) {
                jQuery("#chatbox_display_archives").show();
                jQuery("#chatbox_option_co").hide();
                jQuery("#chatbox_option_disco, #chatbox_footer").show();
                jQuery(".format-message").each(function() {
                    var name = jQuery(this).attr('name');
                    var value = my_getcookie('CB_' + name);
                    jQuery(this).prop('checked', parseInt(value) ? true : false);
                });
                this.format();
                if (data.lastModified) {
                    this.listenParams.lastModified = data.lastModified;
                }
            } else {
                jQuery("#chatbox_option_co").show();
                jQuery("#chatbox_option_disco, #chatbox_footer").hide();
                jQuery("#chatbox_display_archives").hide();
            }
            if (data.users) {
                this.users = [];
                jQuery(".online-users, .away-users").empty();
                jQuery(".member-title").hide();
                for (var i in data.users) {
                    var user = data.users[i];
                    this.users[user.id] = user;
                    userList[user.id] = user;
                    var username = "<span style='color:" + user.color + "'>" +
                        (user.admin ? "@ " : "") +
                        "<span class='chatbox-username chatbox-user-username' data-user='" + user.id + "' >" + user.username + "</span>" +
                        "</span>";
                    var list = user.online ? '.online-users' : '.away-users';
                    jQuery(list).append('<li>' + username + '</li>');
                }
                if (!jQuery(".online-users").is(':empty')) {
                    jQuery(".member-title.online").show();
                }
                if (!jQuery(".away-users").is(':empty')) {
                    jQuery(".member-title.away").show();
                }
            }
            if (data.messages) {
                this.messages = data.messages;
                jQuery("#chatbox").empty();
                if (this.messages) {
                    var content = "";
                    for (var j = 0; j < this.messages.length; j++) {
                        var message = this.messages[j];
                        var html = "<p class='chatbox_row_" + (j % 2 == 1 ? 2 : 1) + " clearfix'>" +
                            "<span class='date-and-time' title='" + message.date + "'>[" + message.datetime + "]</span>";
                        if (message.userId == -10) {
                            html += "<span class='msg'>" +
                                "<span style='color:" + message.msgColor + "'>" +
                                "<strong> ";
                            if (localStorage.getItem("kickSentenceOff") !== "true"){
                                html += kickMessage(message.msg, message.datetime);
                            }else{
                                html += message.msg;
                            }
                                html += "</strong>" +
                                "</span>" +
                                "</span>";
                        } else {
                            var regExpCount = new RegExp("@{(.+?:[0-9]+)}",'g');
                            while(regExpCount.test(message.msg)){
                                var lastMatch = RegExp.lastMatch;
                                var userID = lastMatch.substring(lastMatch.indexOf(':')+1, lastMatch.indexOf('}'));
                                var usernameTagged = lastMatch.substring(lastMatch.indexOf('@{')+2, lastMatch.indexOf(':'));
                                if (userID == getUserID()){
                                    message.msg = message.msg.substring(0,regExpCount.lastIndex-lastMatch.length) + "<font color='#2E9AFE' style='background-color:#F8F18E;font-weight:bold;padding:2px;'>@" + usernameTagged + "</font>" +  message.msg.substring(regExpCount.lastIndex);
                                    if(alreadyTagged[html+message.msg] !== 1){
                                        alreadyTagged[html+message.msg] = 1;
                                    }
                                }else{
                                    message.msg = message.msg.substring(0,regExpCount.lastIndex-lastMatch.length) + "<font color='#2E9AFE' style='font-weight:bold;padding:2px;'>@" + usernameTagged + "</font>" +  message.msg.substring(regExpCount.lastIndex);
                                }
                                regExpCount.lastIndex = 0;
                            }
                                html += "<span class='user-msg'>";
                            if (this.avatar) {
                                html += "	<span class='cb-avatar'><img src='" + message.user.avatar + "' /></span>";
                            }
                            html += "	<span class='user' style='color:" + message.user.color + "'>" +
                                "<strong> " +
                                (message.user.admin ? "@ " : "") +
                                "<span class='chatbox-username chatbox-message-username'  data-user='" + message.userId + "' >" + message.username + "</span>&nbsp;:&nbsp;" +
                                "</strong>" +
                                "</span>";
                            html += "<span class='msg'>"+
                                message.msg +
                                "</span>" +
                                "</span>";
                        }
                        html += "</p>";
                        content += html;
                    }
                    jQuery("#chatbox").append(content);
                    if (scrollOn) {
                        scrollType = jQuery("#chatbox")[0].scrollTop;
                        jQuery("#chatbox")[0].scrollTop = jQuery("#chatbox").prop('scrollHeight') * 2;
                    }
                }
            }
        }
    };
}

function kickMessage(message, j){
    if (message.indexOf('kické') !== -1){
        message = message.substring(4,message.length-5);
        var rand = parseInt(j.substring(6)) % 7;
        var kicked = message.substring(0, message.indexOf('a été kické')-1);
        var kicker = message.substring(message.indexOf('par')+4);
        if (rand === 0) return "<em>THIS. IS. SPARTA ! (" + kicker + " has been kicked out by " + kicker + ") </em>";
        if (rand === 1) return "<em>" + kicked + " a été vilain, donc " + kicker + " a décidé de le punir ! Va-t-en ! </em>";
        if (rand === 2) return "<em>Je sais que " + kicker + " est sadique, mais " + kicked + " l'a mérité. Un kick, un. </em>";
        if (rand === 3) return "<em>Mange ça, " + kicked + " ! " + kicker + " a décidé de te raccompagner vers la sortie ! </em>";
        if (rand === 4) return "<em>Les aventuriers de la chatbox (surtout " + kicker + ") ont décidé de vous éliminer, et leur sentence est irrévocable. Au revoir, " + kicked + " ! </em>";
        if (rand === 5) return "<em>J'ai pas d'idées. Alors voilà l'ancien message : \"" + message + "\" </em>";
        if (rand === 6) return "<em>Euh... Tu sais, " + kicker + ", à force de manger des kicks, " + kicked + " va finir par être masochiste, hein ? </em>";

    }else{
        return message;
    }
}

function addAntiTimeoutButton() {
    addButton('TO', onClickTimeout, {fontSize : '11px'});
}

var addButton = (text, onclick, customCSS) => {
    var container = document.createElement("td");
    var label = document.createElement("label");
    jQuery(label).addClass('fontbutton');
    jQuery(label).click(() => onclick());
    jQuery(label).html(text);

    customCSS = customCSS || {};

    jQuery(label).css(customCSS);

    jQuery(container).append(label);
    jQuery('.text-styles').find('tr:first').prepend(container);
}

function addScrollButton() {
    addButton('Anti Scroll', onClickScroll, {'white-space':'pre-wrap','line-height': '1', 'width' :'35px', 'text-align':'center', 'font-size' : '9px'})
}

function onClickScroll(that) {
    if (scrollOn) {
        scrollbutton.style.background = '#0076b1';
        scrollOn = false;
    } else {
        scrollbutton.style.background = '#ecf3f7';
        scrollOn = true;
    }
}

function onClickTimeout() {
    if (antiTimeoutOn) {
        timeout.style.background = '#ecf3f7';
        antiTimeoutOn = false;
    } else {
        timeout.style.background = '#0076b1';
        antiTimeoutOn = true;
        postMessage('.');
    }
}

function getStringFromInput() {

    // Delete horizontal scrollbar
    var chatbox = document.getElementById('chatbox'),
        chatboxStyle = chatbox.style;
    var cssObjChat = {
        'overflow-x': 'hidden'
    };
    Object.keys(cssObjChat).forEach(key => chatboxStyle[key] = cssObjChat[key]);

    //change message send
    var submit = document.getElementById('submit_button');
    submit.onclick = onClickString;

}

function postMessage(string) {
    var input = document.getElementById('message');
    input.value = string;
    document.getElementById('submit_button').click();
}

function cursor_changed(element) {
    var new_position = getCursorPosition(element);
    if (new_position !== last_position) {
        last_position = new_position;
        return true;
    }
        return false;
}

function getCursorPosition(element) {
    var el = jQuery(element).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
    } else if ('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
}

function onClickString() {
    var arry = JSON.parse(localStorage.getItem('smileysextend'));
    var input = document.getElementById('message');
    var string = input.value;
    clearInterval(timeoutInterval);
    timeoutInterval = null;
    timeoutInterval = setInterval(function() {
        if (antiTimeoutOn) {
            postMessage('.');
        }
    }, 800000);
    if (string.indexOf("!play sans") !== -1) {
        string = null;
        input.value = null;
        load_page("sans");
        return;
    } else
    if (string.indexOf("!play undyne") !== -1) {
        string = null;
        input.value = null;
        load_page("undyne");
        return;
    } else
    if (string.indexOf("!ninfos aes") !== -1) {
        var obj = document.cookie.split(/[;] */).reduce(function(result, pairStr) {
            var arr = pairStr.split('=');
            if (arr.length === 2) { result[arr[0]] = arr[1]; }
            return result;
        }, {});
        string = null;
        input.value = null;
    } else
    if (string.indexOf("!script kickSentence off") !== -1) {
        string = null;
        input.value = null;
        localStorage.setItem('kickSentenceOff', "true");
        return;
    } else
    if (string.indexOf("!script kickSentence on") !== -1) {
        string = null;
        input.value = null;
        localStorage.setItem('kickSentenceOff', "false");
        return;
    } else
    if (string.search(/:[\x20-\x39\x3B-\x7E]+:/) !== -1) {
        for (var key in arry) {
            invokeSmiley(arry,key,input);
        }
    }

}

function invokeSmiley(arry,key,input){
  var string = input.value;
    if (string.indexOf(key) !== -1) {
        if (arry[key].indexOf('height="') !== -1) {
            string = string.substring(0, string.indexOf(key)) + '[img(' + arry[key].substring(arry[key].indexOf('width="') + 7, arry[key].indexOf('style="margin-bottom: 10px;"') - 2) + 'px,' + arry[key].substring(arry[key].indexOf('height="') + 8, arry[key].indexOf('width="') - 2) + 'px)]' + arry[key].substring(arry[key].indexOf('src="') + 5, arry[key].indexOf('alt="') - 2) + '[/img]' + string.substr(string.indexOf(key) + key.length);
        } else {
            string = string.substring(0, string.indexOf(key)) + '[img]' + arry[key].substring(arry[key].indexOf('src="') + 5, arry[key].indexOf('alt="') - 2) + '[/img]' + string.substr(string.indexOf(key) + key.length);
        }
        input.value = string;
        invokeSmiley(arry,key,input);
    }
}

function addSmileys() {
    var arry = JSON.parse(localStorage.getItem('smileysextend'));
    let smiley = document.createElement('div');

    for (var key in arry) {
        smiley.innerHTML += arry[key];
        smiley.innerHTML += '<img id="delete' + key + '" src="https://i.imgur.com/eNtm3Py.png" />';
    }

    smiley.innerHTML += '<center><label for="message" style="color: #dfe0c0;cursor: default">Lien nouveau smiley : </label><br /><input type="text" id="message" name="message" size="35" maxlength="1024" class="post" autocomplete="off" onkeydown="number_of_refresh=0;" style="font-weight: normal;font-style: normal;color: rgb(223, 224, 192);background-repeat: no-repeat;background-image: none;background-position: 100% 0px;background-color: #0B1231;    height: 16px;margin-top: 3px;width: 250px;cursor: pointer;font-family: Verdana,Arial,Helvetica,sans-serif;font-size: 1em;vertical-align: middle;">';
    smiley.innerHTML += '<center><label for="message" style="color: #dfe0c0;cursor: default">Raccourci smiley (sans les ":") : </label><br /><input type="text" id="smileymessage" name="smileymessage" size="35" maxlength="1024" class="post" autocomplete="off" onkeydown="number_of_refresh=0;" style="font-weight: normal;font-style: normal;color: rgb(223, 224, 192);background-repeat: no-repeat;background-image: none;background-position: 100% 0px;background-color: #0B1231;    height: 16px;margin-top: 3px;width: 150px;cursor: pointer;font-family: Verdana,Arial,Helvetica,sans-serif;font-size: 1em;vertical-align: middle;"><br /><br /><input type="button" id="buttonvalidate" style="margin: 0px 0px 10px 0px;" value="Valider"><br><input type="button" id="exportsmiley" style="margin: 0px 0px 10px 0px;" value="Exporter..."><input type="button" id="importsmiley" style="margin: 0px 0px 10px 5px;" value="Importer..."><br />';

    document.getElementById('simple-wrap').insertBefore(smiley, document.getElementsByClassName('center')[0]);

    for (key in arry) {
        waitForElementToDisplay(key, arry, 100);
    }

    var btn;
    waitForBtnToDisplay('buttonvalidate', 100, btn);
    waitForExportImportToDisplay('exportsmiley', 'importsmiley', 100);
}

function waitForElementToDisplay(key, arry, time) {
    if (document.getElementById('delete'+key) !== null) {
        var deletekey = document.getElementById('delete'+key);
        deletekey.onclick = function() {
            delete arry[key];
            localStorage.setItem('smileysextend', JSON.stringify(arry));
            location.reload();
        };
    } else {
        setTimeout(function() {
            waitForElementToDisplay(key, arry, time);
        }, time);
    }
}

function waitForExportImportToDisplay(selector1, selector2, time) {
    if (document.getElementById(selector1) !== null && document.getElementById(selector2) !== null) {
        document.getElementById(selector1).onclick = onClickExport;
        document.getElementById(selector2).onclick = onClickImport;
        let exportArea = document.createElement('textarea');
        exportArea.id = 'exportimportarea';
        document.getElementById('importsmiley').parentNode.appendChild(exportArea);
    } else {
        setTimeout(function() {
            waitForExportImportToDisplay(selector1, selector2, time);
        }, time);
    }
}

function onClickExport() {
    var arry = JSON.parse(localStorage.getItem('smileysextend'));
    let exportImportArea = document.getElementById('exportimportarea');
    exportImportArea.value = JSON.stringify(arry);
}

function onClickImport() {
    let exportImportArea = document.getElementById('exportimportarea');
    if (exportImportArea.value !== null) {
        if(isValidJson(exportImportArea.value)) localStorage.setItem('smileysextend', exportImportArea.value);
        location.reload();
    }
}

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

function addButtonValidate(text, onclick, cssObj) {
    cssObj = cssObj || {
        position: 'relative',
        top: '1px',
        left: '5px',
        'z-index': 5,
        'border-radius': '3px',
        'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05)',
        'display': 'inline-block',
        'line-height': '16px',
        'text-align': 'center',
        'border': '1px solid #AAA',
    };
    let button = document.createElement('button'),
        btnStyle = button.style;
    document.getElementById('simple-wrap').appendChild(button);
    button.innerHTML = '<alt="Smilies" title="Smilies">Valider';
    button.onclick = onclick;
    btnStyle.position = 'absolute';
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
    return button;
}

function onClick() {

    var input = document.getElementById('message');
    var inputSmiley = document.getElementById('smileymessage');
    var img = new Image();
    var arry = JSON.parse(localStorage.getItem('smileysextend'));
    img.onload = function() {
        if (img.height > 45 && inputSmiley.value) {
            var height = img.height;
            var width = img.width;
            var ratio = height / 45;
            height = Math.floor(height / ratio);
            width = Math.floor(width / ratio);
            arry[':' + inputSmiley.value + ':'] = '<a href="javascript:insert_chatboxsmilie(\':' + inputSmiley.value + ':\')" style="margin-left: 10px;"><img title="" src="' + input.value + '" alt="" height="' + height + '" width="' + width + '" style="margin-bottom: 10px;" /></a>';
            localStorage.setItem('smileysextend', JSON.stringify(arry));
            location.reload();
        } else if (img.height <= 45 && img.height !== 0 && inputSmiley.value) {
            arry[':' + inputSmiley.value + ':'] = '<a href="javascript:insert_chatboxsmilie(\':' + inputSmiley.value + ':\')" style="margin-left: 10px;"><img title="" src="' + input.value + '" alt="" style="margin-bottom: 10px;" /></a>';
            localStorage.setItem('smileysextend', JSON.stringify(arry));
            location.reload();
        }
    };
    img.src = input.value;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function waitForBtnToDisplay(selector, time, btn) {
    if (document.getElementById(selector) !== null) {
        btn = document.getElementById(selector);
        btn.onclick = onClick;
        return;
    } else {
        setTimeout(function() {
            waitForBtnToDisplay(selector, time, btn);
        }, time);
    }
}

function load_page(play) {

    let blackscreen = document.createElement('black_screen'),
        btnStyle = blackscreen.style;
    if (play == "sans") {
        var cssObj = cssObj || {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            'z-index': 5,
            'border-radius': '3px',
            'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05)',
            'display': 'inline-block',
            'img-height': '50%',
            'img-width': '100%',
            'background-image': 'url("http://www.dickson-constant.com/medias/images/catalogue/api/orc-6028-680.jpg")',
            'background-size': '100%',
            'background-repeat': 'no-repeat',
            'background-position': 'center'
        };
        blackscreen.innerHTML = "<object type=\"text/html\" data=\"https://jcw87.github.io/c2-sans-fight/\" width=\"800px\" height=\"400px\" style=\"overflow:auto;border:5px ridge blue\"></object>";
    } else
    if (play == "undyne") {
        cssObj = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            'z-index': 5,
            'border-radius': '3px',
            'box-shadow': 'inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05)',
            'display': 'inline-block',
            'img-height': '50%',
            'img-width': '100%',
            'background-image': 'url("http://www.dickson-constant.com/medias/images/catalogue/api/orc-6028-680.jpg")',
            'background-size': '100%',
            'background-repeat': 'no-repeat',
            'background-position': 'center'
        };
        blackscreen.innerHTML = "<object type=\"text/html\" data=\"https://joezeng.github.io/fairdyne/\" width=\"800px\" height=\"650px\" style=\"overflow:auto;border:5px ridge blue\"></object>";
    }
    btnStyle.position = 'absolute';
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
    document.getElementById('chatbox_header').appendChild(blackscreen);

}

function getUserID(){
    var cookieSession = getCookie("fa_www_maleficium_forumactif_com_data");
    cookieSession = decodeURIComponent(cookieSession);
    cookieSession = cookieSession.substring(cookieSession.indexOf("userid")+10,cookieSession.indexOf("userid")+13);
    return cookieSession;
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function getCookieValue(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

// ------------------------------------------------------------
// -------------------- Menu gauche caché ---------------------
// ------------------------------------------------------------

function addToggleButton() {
    var PREFIX = "menu";
    var $wrapper = jQuery('<div>', { class: PREFIX + '-wrapper' });
    var $loading = jQuery('<div>', { class: PREFIX + '-loading' });
    var $frame = jQuery('<iframe>', { class: PREFIX + '-frame' });
    var $cover = jQuery('<div>', { class: PREFIX + '-cover' });
    $frame.attr('id','dropFrame');
    $wrapper.appendTo(document.body).append($frame);

    // sizing
    $wrapper.css({
        width: '550px',
        height: '250px'
    });

    // scaling
    var inversePercent = 100 / .50;
    $frame.css({
        width: inversePercent + '%',
        height: inversePercent + '%',
        transform: 'scale(' + .75 + ')',
        transformOrigin: 'top left',
        position: 'relative'
    });

    // positioning

    $wrapper.css({
        position:'absolute',
        bottom: ($frame.height()-335) + "px",
        left: '-' + jQuery(this).width()*2 + 'px'
    });

    $frame.on('load', function(){
        var innerDoc = this.contentDocument || this.contentWindow.document;
        jQuery(innerDoc).find('#page-header').remove();
    });

    $wrapper.leftMenu();

    var toggle = document.createElement('label');
    toggle.innerHTML = 'Afficher menu';
    toggle.id = 'showmenu';

    toggle.onclick = function(){
        $wrapper.toggleLeftMenu({src:"http://www.maleficium.forumactif.com/privmsg?folder=inbox"});
    };

    jQuery(toggle).addClass('fontbutton');
    toggle.style.width = '40px';
    toggle.style.textAlign = 'center';
    toggle.style.fontSize = '9px';
    toggle.style.lineHeight = '9px';
    toggle.style.visibility = "visible";
    toggle.style.display = "block";
    toggle.style.display = "block";
    toggle.style["white-space"] = "pre-wrap";
    toggle.style["line-height"] = "1";

    var leftbox = jQuery('#chatbox_messenger_form > table > tbody > tr')[0];
    var wrapperToggle = document.createElement('td');
    var wrapperSelect = document.createElement('td');
    $(wrapperToggle).append(toggle);
    $(wrapperSelect).append(jQuery('<select name="thelist" onChange="javascript:function(){$(\'#dropFrame\').attr(\'src\', \'this.value\')}"><option value="http://www.maleficium.forumactif.com/privmsg?folder=inbox">Messages</option></select>'));
    $(leftbox).prepend(wrapperToggle);
    $(leftbox).prepend(wrapperSelect);
}

jQuery.fn.leftMenu = function(){

    jQuery(this).data("hidden", true);

}

jQuery.fn.toggleLeftMenu = function(options){

    if(options != undefined && options.src != jQuery('#dropFrame').attr("src"))
        jQuery('#dropFrame')
            .attr('src', options.src)
            .on('load', function(){
            var innerDoc = this.contentDocument || this.contentWindow.document;
            this.contentWindow.scrollTo(0,jQuery(this).contents().find('.row.row1:first').offset().top-75);
        });

    var hidden = jQuery(this).data('hidden');
    jQuery('#showmenu').text(hidden ? 'Cacher menu' : 'Afficher menu');

    if(hidden){
        jQuery(this).animate({
            left: '0px'
        },1000)
    } else {
        jQuery(this).animate({
            left: '-' + jQuery(this).width()*2 + 'px'
        },1000)
    }

    jQuery(this).data("hidden", !hidden);

}

// ------------------------------------------------------------
// ----------------- jQuery custom function -------------------
// ------------------------------------------------------------

jQuery.fn.getCursorPosition = function() {
    var el = jQuery(this).get(0);
    var pos = 0;
    var posEnd = 0;
    if('selectionStart' in el) {
        pos = el.selectionStart;
        posEnd = el.selectionEnd;
    } else if('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
        posEnd = Sel.text.length;
    }
    // return both selection start and end;
    return [pos, posEnd];
};

jQuery.expr.filters.offscreen = function(el) {
  if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect()

    console.log(rect.bottom);
    console.log(window.innerHeight);

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth) /*or $(window).width() */
    );
};

jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
            matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

function loadCss(){
    var css = "<style>.mini-preview-anchor { display: inline-block; position: relative; white-space: nowrap;}.mini-preview-wrapper { -moz-box-sizing: content-box; box-sizing: content-box; position: absolute; overflow: hidden; z-index: -1; opacity: 0; margin-top: -4px; border: solid 1px #000; box-shadow: 4px 4px 6px rgba(0, 0, 0, .3); transition: z-index steps(1) .3s, opacity .3s, margin-top .3s;}.mini-preview-anchor:hover .mini-preview-wrapper { z-index: 2; opacity: 1; margin-top: 6px; transition: opacity .3s, margin-top .3s;}.mini-preview-loading, .mini-preview-cover { position: absolute; top: 0; bottom: 0; right: 0; left: 0; }.mini-preview-loading { display: table; height: 100%; width: 100%; font-size: 1.25rem; text-align: center; color: #f5ead4; background-color: #59513f;}.mini-preview-loading::before { content: 'Loading...'; display: table-cell; text-align: center; vertical-align: middle;}.mini-preview-cover { background-color: rgba(0, 0, 0, 0); /* IE fix */}.mini-preview-frame { border: none; -webkit-transform-origin: 0 0; transform-origin: 0 0;}</style>";
    jQuery(document.body).append(css);
}

jQuery(document).ready(function(){

    jQuery('#message').keydown(function (e) {
        var position = jQuery(this).getCursorPosition();
        var deleted = '';
        var val = jQuery(this).val();
        if (e.which == 8) {
            if (position[0] == position[1]) {
                if (position[0] == 0)
                    deleted = '';
                else
                    deleted = val.substr(position[0] - 1, 1);
            }
            else {
                deleted = val.substring(position[0], position[1]);
            }
        }
        else if (e.which == 46) {
            var val = jQuery(this).val();
            if (position[0] == position[1]) {

                if (position[0] === val.length)
                    deleted = '';
                else
                    deleted = val.substr(position[0], 1);
            }
            else {
                deleted = val.substring(position[0], position[1]);
            }
        }
        lastLetterDeleted = deleted;
    });

    loadCss();
    start();
});