// ==UserScript==
// @name         Users Chatvdvoem.ru
// @namespace    https://chatvdvoem.ru
// @version      0.0.1
// @description  Information about the interlocutor in the chat together
// @author       KoctrX
// @match        https://chatvdvoem.ru/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40830/Users%20Chatvdvoemru.user.js
// @updateURL https://update.greasyfork.org/scripts/40830/Users%20Chatvdvoemru.meta.js
// ==/UserScript==

_setting = {
    nickNameLength: 10
};

if (chat.isChatStarted()) {
    _chat.connect();
}
document.body.setAttribute('onkeyup', '_chat.key(event.keyCode)');
myLog = document.getElementById('projects');
_user = {};
_me = chat.user;

document.getElementById('but-start').onclick = function () {
    _chat.connect();
};

var _tel = setInterval(function () {
    try {
        document.getElementsByClassName('but-chat-start')[0].setAttribute('onclick', '_chat.connect()');
    } catch (e) {
    }
}, 500);

_chat = {
    start: function () {
        chat.start();
        this.connect();
    },
    close: function () {
        chat.close();
    },
    key: function (key) {
        if (key === 27) {
            if (!chat.isChatStarted()) {
                this.start();
            } else {
                this.close();
            }
        }
    }, style: function () {
        var st = document.createElement('style');
        st.setAttribute('type', 'text/css');
        _style = '.cls { color: #f00; } .p { cursor:pointer; } .ctr { margin: 0 auto; }';
        _style += '.title { text-align: center;background: #515151;padding: 5px;color: #fff;margin: 5px 0;border-radius: 10px; }';
        _style += '.block { padding: 5px; font-size: 14px;}';
        st.innerHTML = _style;
        document.head.appendChild(st);
    },
    dom: function () {
        this.style();
        document.getElementById('projects').style.width = '300px';
        document.getElementById('log').style.right = '330px';
        myLog.innerHTML = '';
        myLog.appendChild(this.createClass({
            'type': 'div',
            'class': 'title p',
            'inner': 'Собеседник',
            other: 'onclick',
            res: '_chat.hidden({type: "class", name: "opponent", id:0})'
        }));
        myLog.appendChild(this.createClass({'type': 'div', 'class': 'block opponent', 'inner': ''}));
        myLog.appendChild(this.createClass({
            'type': 'div',
            'class': 'title p',
            'inner': 'Моя информация',
            other: 'onclick',
            res: '_chat.hidden({type: "class", name: "user", id:0})'
        }));
        myLog.appendChild(this.userCreateUI());
        this.settings();
    },
    settings: function () {
        settings.set("sound", false);
        $("#sound").find(".switch")[settings.sound ? "addClass" : "removeClass"]("on");
        var e = $("link.theme-link[title='grey']");
        e.siblings(".theme-link").prop("disabled", true);
        e.prop("disabled", false);
        settings.set("theme", 'grey');
    },
    userCreateUI: function () {
        myBlock = this.createClass({'type': 'div', 'class': 'block user', inner: ''});
        obj = {'type': 'div', 'class': '', inner: 'Логин: <span class="cls myLogin">' + _me.name + '</span><hr>'};
        myBlock.appendChild(this.createClass(obj));
        obj.inner = 'ОС (beta): <span  class="cls">' + this.device(_me.guid) + '</span><hr>';
        myBlock.appendChild(this.createClass(obj));
        obj.inner = 'Вход: <span  class="cls">' + _me.dataConnect + '</span><hr>';
        myBlock.appendChild(this.createClass(obj));
        myBlock.appendChild(this.createClass({
            'type': 'div',
            'class': '',
            inner: '<div class="button signin-button ctr" onclick="_chat.setRandomUserName();">Рандомный логин</div>'
        }));
        return myBlock;
    },
    hidden: function (obj) {
        function setThis(obj) {
            obj.style.display = (obj.style.display !== 'none') ? 'none' : 'block';
        }

        switch (obj.type) {
            case 'class':
                setThis(document.getElementsByClassName(obj.name)[obj.id]);
                break;
            case 'id':
                setThis(document.getElementById(obj.name));
                break;
        }
    },
    opponentReload: function (_us) {
        block = document.getElementsByClassName('opponent')[0];
        block.innerHTML = '';
        var t = {'type': 'div', 'class': ''};
        t.inner = 'Логин: <span onclick="document.getElementById(&#34;text&#34;).innerHTML+=this.innerHTML;" class="cls p">' + _us.name + '</span><hr>';
        block.appendChild(this.createClass(t));
        t.inner = 'Авторизация: <span  class="cls">' + _us.isLoggedIn + '</span><hr>';
        block.appendChild(this.createClass(t));
        // t.inner = 'GUID: <span  class="cls">' + _us.guid + '</span><hr>';
        // block.appendChild(this.createClass(t));
        // t.inner = 'UID: <span  class="cls">' + _us.uid + '</span><hr>';
        // block.appendChild(this.createClass(t));
        t.inner = 'ОС (beta): <span  class="cls">' + this.device(_us.guid) + '</span><hr>';
        block.appendChild(this.createClass(t));
        t.inner = 'Начало диалога: <span  class="cls">' + _us.connect + '</span><hr>';
        block.appendChild(this.createClass(t));
    },
    device: function (guid) {
        var arr = [{
            name: 'IOS',
            code: 'ios'
        }, {
            name: 'Android',
            code: 'droid'
        }, {
            name: 'VPN (Windows)',
            code: 'vpp'
        }, {
            name: 'Mobile browser',
            code: 'webmob'
        }];
        var device = (guid.split('-').length === 5) ? 'Windows' : 'Не определен';
        var count = arr.length - 1;
        while (count >= 0) {
            if (!guid.indexOf(arr[count].code)) {
                device = arr[count].name;
                break;
            }
            count--;
        }
        return device;
    },
    createClass: function (obj) {
        var elem = document.createElement(obj.type);
        if (obj.class.length > 0) {
            elem.setAttribute('class', obj.class);
        }
        elem.innerHTML = obj.inner;
        if (obj.other !== undefined && obj.res !== undefined) {
            elem.setAttribute(obj.other, obj.res);
        }
        return elem;
    },
    connect: function () {
        var int = setInterval(function () {
            if (chat.isChatStarted()) {
                _user = chat.opponent;
                _user.connect = _chat.time();
                //log.push(_user);
                _chat.opponentReload(_user);
                clearInterval(int);
            }
        }, 20);
    },
    parseTime: function (time) {
        return (time < 10) ? '0' + time : time;
    },
    time: function () {
        var t = new Date();
        return this.parseTime(t.getHours()) + ':' + this.parseTime(t.getMinutes()) + ':' + this.parseTime(t.getSeconds());
    },
    setUserName: function (name) {
        document.getElementsByClassName('myLogin')[0].innerHTML = name;
        settings.set("username", name);
        chat.setUsername(name);
        $("#nickname").text(name);
    },
    randomName: function (count) {
        var stringArray = 'qwertyuiopasdfghjklzxcvbnm1234567890ёйцукенгшщзхъфывапролджэячсмитьбю'.split('');
        var res = '';
        while (count >= 0) {
            var q = stringArray[this.randomize(0, stringArray.length - 1)];
            res += (this.randomize(0, 1) === 1) ? q.toUpperCase() : q.toLowerCase();
            count--;
        }
        return res;
    },
    randomize: function (x, y) {
        return Math.floor(x + Math.random() * ((y + 1) - x));
    },
    setRandomUserName: function () {
        this.setUserName(this.randomName(_setting.nickNameLength));
    }
};
_me.dataConnect = _chat.time();
_chat.dom();