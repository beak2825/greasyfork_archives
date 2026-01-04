// ==UserScript==
// @name         BotChatvdvoem
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       KoctrX
// @match        https://chatvdvoem.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40832/BotChatvdvoem.user.js
// @updateURL https://update.greasyfork.org/scripts/40832/BotChatvdvoem.meta.js
// ==/UserScript==
obj = {
    text: ['Не те б*яди,\nчто хлеба ради \nспередии сзади \nдают нам е*ти,\nБог их прости! \nА те б*яди - лгущие,\nденьги сосущие,\nе*ать не дающие - \nвот б*яди сущие,\nмать их ети!',
        'Гордишься ты, \nНо ты не идеал, \nСама себе ты набиваешь цену, \nТаких как ты я на х*й одевал, \nИ видит бог не раз ещё одену',
        'Я в Париже живу как денди. \nЖенщин имею до ста. \nМой х*й, как сюжет в легенде, \nПереходит из уст в уста.',
        'Лежу на чужой\nжене, потолок\nприлипает к жопе,\nно мы не ропщем - делаем коммунистов,\nназло буржуазной Европе!\nПусть х*й мой\nкак мачта топорщится!\nМне все равно, кто подо мной -\nжена министра или уборщица!'], // 2230 - max
    update: 1000, // 100mc
    st: false,
    autosave: true
};

_idArr = 0;

flood = {
    connect: function () {
        if (obj.st) {
            document.getElementById('but-start').click();
        }
    },
    close: function () {
        if (obj.st) {
            document.getElementById('but-close').click();
        }
    },
    saveToCookie: function () {
        if (obj.text.length > 0 && obj.text.toString().length > 0) {
            var jsonData = JSON.stringify(obj.text);
            document.cookie = 'list=' + jsonData + ';path=/';
            flood.mirage({'type': 'id', id: 'saveToCookie', innerP: 'Сохранено', innerE: 'Сохранить'});
        } else {
            alert('Вы не можете сохранить пустой объект, добавьте текст и после сохраните.');
        }
    },
    mirage: function (cart) {
        var object = (cart.type === 'id') ? document.getElementById(cart.id) : document.getElementsByClassName(cart.id)[cat.c];
        object.disabled = true;
        object.innerHTML = cart.innerP;
        setTimeout(function () {
            object.disabled = false;
            object.innerHTML = cart.innerE;
        }, 1000);
    },
    clearCookie: function () {
        if (confirm('Вы уверены что хотите удалить данные с куков? ')) {
            document.cookie = 'list=;path=/';
            flood.mirage({'type': 'id', id: 'delCo', innerP: 'Очищено', innerE: 'Очистить куки'});
        }
    },
    getCookie: function (name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    flood: function () {
        if (obj.text.length >= 1 && obj.text.toString().length >= 1) {
            var sub = document.getElementById('_submit');
            if (obj.st) {
                obj.st = false;
                sub.value = 'Включить';
            } else {
                obj.st = true;
                flood.sender();
                sub.value = 'Выключить';
            }
        } else {
            alert('Добавьте текст для флуда');
        }
    },
    list: function (tr) {
        if (!tr) {
            try {
                document.getElementsByClassName('list')[0].remove();
            } catch (e) {
            }
            if (obj.text.length > 0) {
                var elem = this.listRender(this.createObjects({type: 'div', attr: [['class', 'list']]}));
                document.getElementById('projects').appendChild(elem);
            }
        } else {
            document.getElementsByClassName('listcl')[_idArr].innerHTML = flood.miniSub(_idArr);
        }
    },
    getWriteList: function (id, tray) {
        document.getElementById('_textArea').focus();
        if (document.getElementById('_textArea').value.length < 1 && !tray) {
            alert('Введите текст, не оставляйте пустое поле');
        } else {
            _idArr = id;
            document.getElementById('_textArea').value = obj.text[id];
        }
    },
    deleteElemList: function () {
        if (confirm("Вы уверены что хотите удалить текст:\n" + obj.text[_idArr])) {
            obj.text.splice(_idArr, 1);
            flood.getWriteList(0, true);
            flood.list();
        }
    },
    removeList: function () {
        if (confirm("Вы уверены что хотите очистить весь список?")) {
            obj.text = [''];
            flood.getWriteList(0, true);
            flood.list();
        }
    },
    listRender: function (elem) {
        for (var i = 0; i < obj.text.length; i++) {
            var el = flood.createObjects({
                'type': 'div',
                attr: [['onclick', 'flood.getWriteList(' + i + ');'], ['class', 'listcl']]
            });
            el.innerHTML = flood.miniSub(i);
            elem.appendChild(el);
        }
        return elem;
    },
    miniSub: function (i) {
        return (obj.text[i].length > 30) ? obj.text[i].substring(0, 30) + '...' : obj.text[i];
    },
    sendActive: function () {
        flood.updateText();
        if (obj.text[_idArr].length >= 1) {
            this.sendMessage(obj.text[_idArr]);
        } else if (document.getElementById('_textArea').value.length >= 1) {
            flood.sendActive();
        } else {
            alert('Введите что нибудь');
            document.getElementById('_textArea').focus();
        }
    },
    sendMessage: function (message) {
        chat.sendMessage(message);
    },
    getTextFlood: function () {
        if (obj.text.length > 0) {
            flood.sendMessage(obj.text[flood.randomize(0, obj.text.length - 1)]);
        } else {
            alert('Добавьте текст для флуда.');
        }
    },
    randomize: function (x, y) {
        return Math.floor(x + Math.random() * ((y + 1) - x));
    },
    sender: function () {
        if (obj.st) {
            if (chat.isChatStarted()) {
                flood.getTextFlood();
                setTimeout(function () {
                    flood.close();
                    flood.timer();
                }, obj.update);
            } else {
                setTimeout(function () {
                    flood.connect();
                    flood.timer();
                }, obj.update);
            }
        }
    },
    chat: function () {
        var but = document.getElementById('_but');
        var teq = document.getElementById('text');
        if (teq.getAttribute('contenteditable') === 'true') {
            teq.setAttribute('contenteditable', 'false');
            but.value = 'Включить чат';
        } else {
            teq.setAttribute('contenteditable', 'true');
            but.value = 'Выключить чат';
        }
    },
    setPoster: function () {
        var projects = document.getElementById('projects');
        document.getElementById('log-wrap').setAttribute('class', 'show-projects');
        var log = document.createElement('style');
        log.setAttribute('type', 'text/css');
        log.innerHTML = '.show-projects #log { right:315px; }';
        log.innerHTML += '.list { width: 100%; background: #000; }';
        log.innerHTML += '.listcl { padding: 3px 5px; background: #3d3d3d; margin: 1px 0; color: #fff; cursor: pointer; }';
        log.innerHTML += '.listcl:hover { background: rgba(0,0,0,0.5); }';
        log.innerHTML += '.btn { margin: 2px 2px; padding: 3px; cursor: pointer; border: 1px solid #000; }';
        document.head.appendChild(log);
        projects.innerHTML = '';
        projects.style = 'width: 300px; display: inline-block;';
        projects.appendChild(this.createForm());
        if (obj.autosave) {
            document.getElementById('_update').disabled = true;
        }
        if (this.getCookie('list')) {
            obj.text = flood.resCookie();
        }
        document.getElementById('_textArea').value = obj.text[0];
        this.list();
    },
    resCookie: function () {
        var test = JSON.parse(this.getCookie('list'));
        return ({}.toString.call(test).slice(8, -1) === 'Array') ? test : obj.text;
    },
    updateText: function (re) {
        if (document.getElementById('_textArea').value.length >= 1 || re) {
            obj.text[_idArr] = document.getElementById('_textArea').value;
        } else {
            document.getElementById('_textArea').focus();
            return alert('Нельзя сохранить пустое поле');
        }
        if (!re) {
            flood.list();
            flood.mirage({'type': 'id', id: '_update', innerP: 'Сохранено', innerE: 'Сохранить'});
        } else {
            flood.list(true);
        }
    },
    createForm: function () {
        var tie = document.createElement('form');
        tie.setAttribute('onsubmit', 'return false;');
        tie.appendChild(this.createObjects({
            'type': 'button',
            inner: 'Новый',
            attr: [['class', 'btn'], ['onclick', 'flood.newTicket();'], ['title', 'Добавить текст']]
        }));
        tie.appendChild(this.createObjects({
            'type': 'button',
            inner: 'Удалить',
            attr: [['class', 'btn'], ['onclick', 'flood.deleteElemList();'], ['title', 'Удалить текущий текст']]
        }));
        tie.appendChild(this.createObjects({
            'type': 'button',
            inner: 'Удалить все',
            attr: [['class', 'btn'], ['onclick', 'flood.removeList();'], ['title', 'Удалить все сохраненные тексты']]
        }));
        tie.appendChild(this.createObjects({
            'type': 'input',
            attr: [['type', 'submit'], ['id', '_update'], ['class', 'btn'], ['onclick', 'flood.updateText();'], ['value', 'Сохранить']]
        }));
        var style = 'border: 1px solid #000; height: 100px; width: 95%; resize: none; padding: 5px; font-size: 14px;';
        tie.appendChild(this.createObjects({
            'type': 'textarea',
            attr: [['id', '_textArea'], ['onkeyup', '(obj.autosave)?flood.updateText(true):"";'], ['style', style]]
        }));
        style = 'padding: 5px; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 5px;';
        tie.appendChild(this.createObjects({
            'type': 'input',
            attr: [['type', 'submit'], ['id', '_active'], ['class', 'btn'], ['onclick', 'flood.sendActive();'], ['value', 'Отправить']]
        }));
        tie.appendChild(this.createObjects({
            'type': 'input',
            attr: [['type', 'submit'], ['id', '_submit'], ['class', 'btn'], ['onclick', 'flood.flood();'], ['value', 'Включить']]
        }));
        tie.appendChild(this.createObjects({
            'type': 'input',
            attr: [['type', 'submit'], ['id', '_but'], ['class', 'btn'], ['onclick', 'flood.chat();'], ['value', 'Выключить чат']]
        }));
        var inputCheck = '<input type="checkbox" ' + ((obj.autosave) ? 'checked' : 'none') + ' id="_autosave" onclick="flood.autosave();"/>';
        tie.appendChild(this.createObjects({
            'type': 'div',
            inner: '<label>Автосохранение ' + inputCheck + '</label>',
            attr: [['class', 'save']]
        }));
        tie.appendChild(this.createObjects({
            'type': 'button',
            inner: 'Сохранить в куки',
            attr: [['class', 'save btn'], ['id', 'saveToCookie'], ['onclick', 'flood.saveToCookie();']]
        }));
        tie.appendChild(this.createObjects({
            'type': 'button',
            inner: 'Очистить куки',
            attr: [['class', 'save btn'], ['id', 'delCo'], ['onclick', 'flood.clearCookie();']]
        }));
        return tie;
    },
    autosave: function () {
        obj.autosave = document.getElementById('_autosave').checked;
        document.getElementById('_update').disabled = (obj.autosave) ? true : false;
        alert((obj.autosave) ? 'Автосохранение включено' : 'Автосохранение отключено');
    },
    newTicket: function () {
        if (obj.text[_idArr].length < 1) {
            alert('Введите текст, не оставляйте пустое поле');
        } else {
            obj.text.push('');
            document.getElementById('_textArea').focus();
            this.getWriteList(obj.text.length - 1);
            this.list();
        }
    },
    timer: function () {
        setTimeout(function () {
            flood.sender();
        }, obj.update);
    },
    createObjects: function (obj) {
        var object = document.createElement(obj.type);
        if (obj.inner) {
            object.innerHTML = obj.inner;
        }
        if (obj.attr) {
            for (var i = 0; i < obj.attr.length; i++) {
                object.setAttribute(obj.attr[i][0], obj.attr[i][1]);
            }
        }
        return object;
    }
};
flood.setPoster();