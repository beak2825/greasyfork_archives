// ==UserScript==
// @name Chatvtroem
// @version 3.0.0
// @description:ru 123
// @description:en 123
// @include https://chatvdvoem.ru/
// @name:ru ЧатВтроем
// @namespace https://greasyfork.org/users/230919
// @description 123
// @downloadURL https://update.greasyfork.org/scripts/375257/Chatvtroem.user.js
// @updateURL https://update.greasyfork.org/scripts/375257/Chatvtroem.meta.js
// ==/UserScript==

//check1 - авторестарт обеих чатов
//check2 - авторестарт только что закрытого чата
//check3 - пересылать сообщения

chop = (function() {
    var i = 0;
    return function() {
        i++;
        if(i === 2) {
            chop = null;
            glack(0, 1);
            glack(1, 0);
            createChecks(3);
            check3.checked = true;
            check1.onclick = function() {
                if(check2.checked) check2.checked = false;
            };
            check2.onclick = function() {
                if(check1.checked) check1.checked = false;
            };
            frames[0].document.getElementsByTagName('ol')[0].onclick = function(e) {
                if(e.target.className === 'name' && e.target.innerText === 'Некто' && frames[1].chat.isChatStarted()) frames[1].chat.sendMessage(e.target.msg);
            };
            frames[1].document.getElementsByTagName('ol')[0].onclick = function(e) {
                if(e.target.className === 'name' && e.target.innerText === 'Некто' && frames[0].chat.isChatStarted()) frames[0].chat.sendMessage(e.target.msg);
            };
        };
    };
}());


function createChecks(amount) {
    var a = document.createElement('div');
    a.setAttribute('id', 'check');
    a.setAttribute('style', 'display:inline-block; position: absolute; top:0px;');
    document.body.appendChild(a);

    for(var i = 1; i <= amount; i++) {
        var r = document.createElement('input');
        r.setAttribute('type', 'checkbox');
        r.setAttribute('id', 'check' + i);
        check.appendChild(r);
    };
};

function startBoth() {
    if(!frames[0].chat.isChatStarted()) frames[0].chat.start();
    if(!frames[1].chat.isChatStarted()) frames[1].chat.start();
};

function closeBoth() {
    if(frames[0].chat.isChatStarted()) frames[0].chat.close();
    if(frames[1].chat.isChatStarted()) frames[1].chat.close();
};

function glack(numberf, numbert) {

    return function() {
        frames[numberf].chat.abcd = frames[numberf].chat.start;
        frames[numberf].chat.start = function() {
            frames[numberf].chat.abcd();
            frames[numberf].chat.socket.onmessage = function(evt) {
                //console.log('Сервер:' + evt.data);
                try {
                    var response = JSON.parse(evt.data);
                } catch (e) {
                    console.log("WS: Response JSON parsing error: ", evt.data);
                    return;
                }

                frames[numberf].chat.receiveSocketMessage(response);




                switch (response.action) {

                    case 'message_from_user':

                        (function() {
                            if(response.sender === 'someone') {
                                var button = frames[numberf].document.getElementsByClassName('name')[frames[numberf].document.getElementsByClassName('name').length - 1];
                                button.msg = response.message;
                            };
                        }());


                        if(response.ratio !== undefined) setTimeout((function() {
                            frames[numberf].$('.image-timer').remove();
                        }()), 2000);


                        if(check3.checked && frames[numbert].chat.isChatStarted() && response.sender === 'someone') {
                            frames[numbert].chat.sendMessage(response.message);
                        };
                        break;
                    case 'chat_removed':
                        if(check1.checked) {
                            closeBoth();
                            setTimeout((function() {
                                startBoth();
                            }), 1000);
                        };
                        if(check2.checked) {
                            setTimeout((function() {
                                frames[numberf].chat.start();
                            }), 1000);
                        };
                        break;
                    case 'user_writing':
                        if(check3.checked && frames[numbert].chat.isChatStarted()) {
                            frames[numbert]._setTyping();
                        }
                        break;
                       
                       
                }; 

            };
        };
    }();
};

var start = function() {
    var frameset = document.createElement("frameset");

    var one = document.createElement("frame");
    var two = document.createElement("frame");

    frameset.setAttribute("cols", "50%, 50%");
    frameset.setAttribute("id", "frameset");
    one.setAttribute("src", "/?");
    two.setAttribute("src", "/?");
    one.setAttribute('onload', 'this.contentWindow.ui.setChatPage(); chop();');
    two.setAttribute('onload', 'this.contentWindow.ui.setChatPage(); chop();');

    frameset.appendChild(one);
    frameset.appendChild(two);
    document.body.innerHTML = document.head.innerHTML = "";
    document.body.setAttribute("style", "margin: 0px;");
    document.body.appendChild(frameset);
};

var activate = document.querySelector(".startChat").appendChild(document.createElement("a"));

activate.setAttribute("href", "/");
activate.textContent = "Злоупотребить";

activate.addEventListener("click", function(event) {
    event.preventDefault();
    start();
});