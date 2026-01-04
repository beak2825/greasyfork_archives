// ==UserScript==
// @name       Omegle Group Chat
// @namespace  http://omeglegroup.edu/
// @version    1.4
// @description  Make a group of strangers in Omegle chat with each other
// @match      https://www.omegle.com
// @require http://code.jquery.com/jquery-latest.js
// @author Streak324
// @downloadURL https://update.greasyfork.org/scripts/442757/Omegle%20Group%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/442757/Omegle%20Group%20Chat.meta.js
// ==/UserScript==

var inputHTML = "strangermsg";
var running = false;
var amount;
var omegleWindows = {};
var chatbox = 'textarea.chatmsg';
var sendButton = 'button.sendbtn';
var startButton = 'textbtn';
var interval;
var kickIdlers = false;
var idleDelay = 60000;
var ownerNick = "OVERLORD";
var counter = 1;

if(window.name == '') {
    $(document).ready(function () {
        document.getElementById('header').insertAdjacentHTML('afterend', "<div style='background-color:white' id='omegle-settings'></div>");
        $('#omegle-settings').append('<h2>Group Chat Options</h2>');
        $('#omegle-settings').append("<label for='idle'>Autokick idlers</label><br />");
        $('#omegle-settings').append('<input id="idleBox" type="checkbox" name="idle">');
        $('#omegle-settings').append("<input id='idleText' type='text' name='idle' placeholder='In Milliseconds' disabled></br />");
        $('#omegle-settings').append("<label for='numPeeps'>Type number of people in conversation</label><br />");
        $('#omegle-settings').append("<input id='numPeeps' type='text' name='numPeeps' placeholder='Limit is 6. DONT GO ABOVE'>");
        $('#omegle-settings').append("<div id='group-buttons'></div>");
        $('#group-buttons').append('<form></form>');
        $('#group-buttons').append("<input id='start-group' type='submit', value='Start'>");
        $('#group-buttons').append("<input id='stop-group' type='submit', value='Stop' disabled><br /><br /><br />");
        $('#omegle-settings').append("<textarea id='group-log' rows='20', cols='150' disabled></textarea><br /><br />");
        $('#omegle-settings').append("<label for='addInput'>Send your own messages here</label><br />");
        $('#omegle-settings').append("<input id='addInput' name='addInput' type='text' disabled>");

        $('#idleBox').on('click', function() {
            if(document.getElementById('idleBox').checked) {
                kickIdlers = true;
                document.getElementById('idleText').disabled = false;
            } else {
                kickIdlers = false;
                document.getElementById('idleText').disabled = true;
            }
        });
        $('#start-group').on('click', function () {
            var num = $('#numPeeps').val();
            var _idleDelay = $('#idleText').val();
            if (isNumeric(num) && parseInt(num) > 0 && ($('#idleBox').is(':checked') && isNumeric(_idleDelay) || !$('#idleBox').is(':checked'))) {
                idleDelay = parseInt(_idleDelay);
                setupGroup(parseInt(num));
                $('#group-log').val('');
                $('#start-group').prop('disabled', true);
                $('#stop-group').prop('disabled', false);
                $('#addInput').prop('disabled', false);
            }
        });
        $('#stop-group').on('click', function () {
            closeGroup();
            $('#start-group').prop('disabled', false);
            $('#stop-group').prop('disabled', true);
            $('#addInput').prop('disabled', true);
        });

        $('#addInput').keypress(function(e) {
            if(e.which == 13) {
                broadcast(ownerNick + ': ' + $('#addInput').val());
                $('#addInput').val('');
            }
        });
    });
}

function runGroup() {
    for(var name in omegleWindows) {
        if(omegleWindows[name].connected) {
            var messages = omegleWindows[name].document.getElementsByClassName(inputHTML);
            for(i=omegleWindows[name].messageIndex; i < messages.length; i++) {
                var message = messages[i].getElementsByTagName('span')[0].innerHTML;
                if(!sendingCommands(message, name)){
                    broadcast(name + ": " + message, { sender: name });
                }
            }
            if(omegleWindows[name].messageIndex != messages.length) { //check if idling
                omegleWindows[name].messageIndex = messages.length;
                omegleWindows[name].idleCount = Date.now() + idleDelay;
            }
            if(kickIdlers && omegleWindows[name].idleCount < Date.now()) { //kick idlers
                console.log("Kicking " + name);
                omegleWindows[name].document.querySelector('button.disconnectbtn').click();
                omegleWindows[name].document.querySelector('button.disconnectbtn').click();
            }
            if(omegleWindows[name].document.querySelector('button.disconnectbtn').innerHTML == "New<div class=\"btnkbshortcut\">Esc</div>") { //find new people
                omegleWindows[name].connected = false;
                broadcast(name + " has left the group chat. Looking for a new person", { sender: name, connection: true });
                omegleWindows[name].document.querySelector('button.disconnectbtn').click();
            }
        } else if(omegleWindows[name].document.getElementById(startButton)) { //starting
            omegleWindows[name].document.getElementById(startButton).click();
        } else if(omegleWindows[name].document.getElementsByClassName('statuslog').length > 0) {
            var status = omegleWindows[name].document.getElementsByClassName('statuslog')[0].innerHTML;
            if(status == "You're now chatting with a random stranger. Say hi!") {
                var newName = "Stranger "+ (counter++);
                omegleWindows[name].connected = true;
                omegleWindows[name].idleCount = Date.now() + idleDelay;
                var welcome = "Welcome to Omegle Group Chat. Your nick is " + newName + ". Type !help for options. EXPECT BUGS";
                if(kickIdlers) welcome += " You will be kicked if you dont send messages at least every " + idleDelay/1000 + " seconds";
                omegleWindows[name].document.querySelector(chatbox).value = welcome;
                omegleWindows[name].document.querySelector(sendButton).click();
                omegleWindows[newName] = omegleWindows[name];
                delete omegleWindows[name];
                broadcast(newName + " has connected to the group chat", { sender: newName, connection: true });
            } else if(status == "<div><div>Looking for someone you can chat with...</div></div>") {
                omegleWindows[name].document.querySelector('button.disconnectbtn').click();
                omegleWindows[name].document.querySelector('button.disconnectbtn').click();
            }
        }
        checkCaptcha(omegleWindows[name]);
    }
}

function broadcast(message, opts) {
    if(!opts) {
        opts = {
            sender : null,
            connection : false
        };
    }
    for(var name in omegleWindows) {
        if(omegleWindows[name].connected) {
            omegleWindows[name].document.querySelector(chatbox).value = "";
            if(opts.sender && name == opts.sender)
                omegleWindows[name].document.querySelector(chatbox).value += "(YOU) ";

            if((opts.connection && omegleWindows[name].logConnections) || !opts.connection) {
                omegleWindows[name].document.querySelector(chatbox).value += message;
                omegleWindows[name].document.querySelector(sendButton).click();
            }
        }
    }
    document.getElementById('group-log').value += message + '\n';
    $('#group-log').scrollTop($('#group-log')[0].scrollHeight);
}

function sendingCommands(message, user) {
    if(message.substring(0, 6) == '!nick ') {
        var newNick = message.substring(6, (message.length < 30) ? message.length : 30);
        if (newNick != user) {
            for(var name in omegleWindows) {
                if(name == newNick || newNick == ownerNick) {
                    omegleWindows[user].document.querySelector(chatbox).value = "That nickname has been taken";
                    omegleWindows[user].document.querySelector(sendButton).click();
                    return true;
                }
            }
            omegleWindows[newNick] = omegleWindows[user];
            delete omegleWindows[user];
            message = user + " has changed his name to " + newNick;
            broadcast(message, { sender: newNick });
        }
        return true;
    } else if(message.substring(0, 12) == '!toggle-logs') {
        omegleWindows[user].logConnections = (omegleWindows[user].logConnections) ? false : true;
        if(omegleWindows[user].logConnections) { omegleWindows[user].document.querySelector(chatbox).value = "Notices have been enabled"; }
        else { omegleWindows[user].document.querySelector(chatbox).value = "Notices have been disabled"; }
        omegleWindows[user].document.querySelector(sendButton).click();
        return true;
    } else if(message.substring(0, 5) == '!help') {
        omegleWindows[user].document.querySelector(chatbox).value = "************************************COMMAND OPTIONS************************************";
        omegleWindows[user].document.querySelector(chatbox).value += "!nick newname --- Allows you to set your nickname";
        omegleWindows[user].document.querySelector(chatbox).value += "\n!toggle-logs --- Enable/Disable notices on people who enter and leave the group chat";
        omegleWindows[user].document.querySelector(sendButton).click();
        return true;
    }
    return false;
}

function setupGroup(num) {
    running = true;
    amount = num;
    console.log(amount);
    for(i=0; i < amount; i++) {
        omegleWindows[i] = window.open('https://omegle.com/', 'window '+i);
        $(omegleWindows[i].document).ready(function() {
            omegleWindows[i].document.title = 'window '+i;
            omegleWindows[i].connected = false;
            omegleWindows[i].messageIndex = 0;
            omegleWindows[i].logConnections = true;
        });
    }
    interval = setInterval(runGroup, 1000);
}

function closeGroup() {
    broadcast('DISCONNECTING THE GROUP CHAT. GOODBYE LOSERS');
    running = false;
    for(var name in omegleWindows) {
        omegleWindows[name].close();
    }
    clearInterval(interval);
    omegleWindows = {};
}

function checkCaptcha(omegleWindow) {
    if(omegleWindow.document.getElementById('recaptcha_area') && !omegleWindow.captchaNotice) {
        omegleWindow.captchaNotice = true;
        omegleWindows[name].document.querySelector(chatbox).value = "HEYY!!!! WE HAVE A CAPTCHA AT " + omegleWindow.name;
        omegleWindows[name].document.querySelector(sendButton).click();
    } else if(!omegleWindow.document.getElementById('recaptcha_area')) {
        omegleWindow.captchaNotice = false;
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}